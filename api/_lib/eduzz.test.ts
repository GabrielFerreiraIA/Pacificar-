// Testes das regras puras do webhook da Eduzz (T-34). Não toca no banco.
// Uso: node ./node_modules/tsx/dist/cli.mjs api/_lib/eduzz.test.ts
import { createHmac } from 'node:crypto';
import { conferirAssinatura, efeitoDaSuspensao, interpretarEvento, lerConfigProdutos, planoAoLiberar, tipoDoProduto } from './eduzz';

let falhas = 0;
const ok = (c: boolean, m: string) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };

// Payload fictício no formato de https://developers.eduzz.com/reference/webhook/myeduzz-invoice-paid
const pago = {
  id: 'evt_teste_1',
  event: 'myeduzz.invoice_paid',
  sentDate: '2026-11-09T12:00:00.000Z',
  data: {
    id: 98765,
    status: 'paid',
    buyer: { id: '1', name: 'Paciente Teste', email: 'Paciente.Teste@Exemplo.com', document: '00000000000', cellphone: '5547900000000', address: { city: 'X' } },
    items: [{ productId: 'P567', name: 'Pacificar' }],
    paid: { value: 297 },
    paymentMethod: 'creditCard',
  },
};

const segredo = 'chave-de-teste';
const corpo = JSON.stringify(pago);
const hex = createHmac('sha256', segredo).update(corpo).digest('hex');
const b64 = createHmac('sha256', segredo).update(corpo).digest('base64');

ok(conferirAssinatura(corpo, hex, segredo) === 'hex', 'Assinatura em hex confere');
ok(conferirAssinatura(corpo, hex.toUpperCase(), segredo) === 'hex', 'Hex maiúsculo confere');
ok(conferirAssinatura(corpo, b64, segredo) === 'base64', 'Assinatura em base64 confere');
ok(conferirAssinatura(corpo + ' ', hex, segredo) === null, 'Corpo alterado → inválida');
ok(conferirAssinatura(corpo, hex, 'outra') === null, 'Chave errada → inválida');
ok(conferirAssinatura(corpo, null, segredo) === null, 'Sem header → inválida');
ok(conferirAssinatura(corpo, hex, undefined) === null, 'Sem EDUZZ_WEBHOOK_SECRET → inválida');

const ev = interpretarEvento(pago);
ok(ev.acao === 'liberar' && ev.orderId === '98765', 'Fatura paga libera, id da fatura = data.id');
ok(ev.email === 'paciente.teste@exemplo.com', 'E-mail em minúsculas');
ok(ev.telefone === '5547900000000' && ev.nome === 'Paciente Teste', 'Nome e celular');
ok(!JSON.stringify(ev.resumo).includes('00000000000') && !JSON.stringify(ev.resumo).includes('address'), 'Resumo sem CPF nem endereço (LGPD)');

const presente = interpretarEvento({ ...pago, data: { ...pago.data, student: { name: 'Aluna', email: 'aluna@exemplo.com' } } });
ok(presente.email === 'aluna@exemplo.com', 'Com "student", o acesso vai para quem recebe');

ok(interpretarEvento({ ...pago, event: 'myeduzz.invoice_refunded' }).acao === 'suspender', 'Reembolso suspende');
const cb = interpretarEvento({ ...pago, event: 'myeduzz.invoice_chargeback', data: { ...pago.data, chargeback: { status: 'underReview' } } });
ok(cb.acao === 'suspender' && cb.evento === 'myeduzz.invoice_chargeback:underReview', 'Chargeback em análise suspende e tem chave própria');
const cbNegado = interpretarEvento({ ...pago, event: 'myeduzz.invoice_chargeback', data: { ...pago.data, chargeback: { status: 'rejected' } } });
ok(cbNegado.acao === 'liberar', 'Chargeback recusado devolve o acesso');
ok(interpretarEvento({ ...pago, event: 'myeduzz.invoice_canceled' }).acao === 'registrar', 'Cancelada só registra');
ok(interpretarEvento({ id: 'x', event: 'ping', data: { message: 'ping' } }).acao === 'ping', 'Ping reconhecido');

let lancou = false;
try { interpretarEvento({ event: 'myeduzz.invoice_paid', data: {} }); } catch { lancou = true; }
ok(lancou, 'Sem data.id → erro');

// Duas versões do app (T-87): produto → plano
const semConfig = lerConfigProdutos({});
ok(tipoDoProduto(['P567'], semConfig) === '21d', 'Sem configuração, qualquer produto libera 21 dias (como antes)');
const legado = lerConfigProdutos({ EDUZZ_PRODUCT_IDS: 'P1, P567' });
ok(tipoDoProduto(['P567'], legado) === '21d', 'EDUZZ_PRODUCT_IDS (nome antigo) conta como 21 dias');
ok(tipoDoProduto(['P999'], legado) === null, 'Outro produto da conta é ignorado');
const cfg = lerConfigProdutos({ EDUZZ_PRODUCT_7D: 'S7', EDUZZ_PRODUCT_21D: 'S21', EDUZZ_PRODUCT_UPGRADE: 'UP, UP2' });
ok(tipoDoProduto(['S7'], cfg) === '7d', 'Produto de 7 dias');
ok(tipoDoProduto(['S21'], cfg) === '21d', 'Produto de 21 dias');
ok(tipoDoProduto(['UP2'], cfg) === 'upgrade', 'Upgrade (vários ids por variável)');
ok(tipoDoProduto(['S7', 'UP'], cfg) === 'upgrade', 'Fatura com dois itens do app: vale o que dá mais acesso');
ok(tipoDoProduto(['X'], cfg) === null, 'Produto fora das três listas é ignorado');
ok(planoAoLiberar('7d', null) === 7, 'Conta nova com o produto de 7 → 7 dias');
ok(planoAoLiberar('21d', null) === 21 && planoAoLiberar('upgrade', 7) === 21, '21 dias e upgrade → 21');
ok(planoAoLiberar('7d', 21) === 21, 'Quem já tem 21 e compra o de 7 continua com 21');
ok(efeitoDaSuspensao('upgrade') === 'voltar-para-7', 'Estorno do upgrade volta para 7 dias');
ok(efeitoDaSuspensao('7d') === 'suspender' && efeitoDaSuspensao('21d') === 'suspender', 'Estorno da jornada suspende');

if (falhas) process.exit(1);
console.log('\nWebhook Eduzz: regras OK');
