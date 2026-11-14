// Regras puras do webhook da Eduzz (T-34). Sem banco, para dar para testar isolado.
// Referência: https://developers.eduzz.com/docs/webhook (envelope, ping, segurança)
// e https://developers.eduzz.com/reference/webhook/myeduzz-invoice-paid (campos da fatura).
import { createHmac, timingSafeEqual } from 'node:crypto';

export type AcaoEduzz = 'liberar' | 'suspender' | 'registrar' | 'ping';

export interface EventoEduzz {
  acao: AcaoEduzz;
  /** Chave de idempotência junto com orderId. No chargeback inclui o status, que muda várias vezes. */
  evento: string;
  orderId: string;
  email: string | null;
  nome: string;
  telefone: string | null;
  produtos: string[];
  /** Cópia enxuta para a tabela purchases: sem CPF nem endereço (LGPD). */
  resumo: Record<string, unknown>;
}

interface Pessoa {
  name?: string | null;
  email?: string | null;
  cellphone?: string | null;
  phone?: string | null;
}

/**
 * Confere o header x-signature: HMAC-SHA256 do corpo com a chave secreta do webhook.
 * A documentação não diz se a saída é hex ou base64, então aceitamos as duas e
 * devolvemos qual bateu (aparece na resposta do ping, no histórico da Eduzz).
 */
export function conferirAssinatura(
  corpo: string,
  assinatura: string | null,
  segredo: string | undefined
): 'hex' | 'base64' | null {
  if (!assinatura || !segredo) return null;
  const recebida = assinatura.trim().replace(/^sha256=/i, '');
  const mac = createHmac('sha256', segredo).update(corpo, 'utf8').digest();
  const iguais = (a: string, b: string) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
  };
  if (iguais(recebida.toLowerCase(), mac.toString('hex'))) return 'hex';
  if (iguais(recebida, mac.toString('base64'))) return 'base64';
  return null;
}

const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);

/** Lê o envelope { id, event, data, sentDate } e decide o que fazer. Lança erro se o JSON não tiver o formato. */
export function interpretarEvento(json: unknown): EventoEduzz {
  const env = json as { id?: unknown; event?: unknown; data?: Record<string, unknown> };
  const event = texto(env?.event);
  if (!event) throw new Error('evento sem o campo "event"');

  if (event === 'ping') {
    return { acao: 'ping', evento: 'ping', orderId: String(env.id ?? 'ping'), email: null, nome: '', telefone: null, produtos: [], resumo: {} };
  }

  const data = env.data ?? {};
  const orderId = data.id != null ? String(data.id) : null;
  if (!orderId) throw new Error(`evento ${event} sem data.id (id da fatura)`);

  // "student" é quem recebe o acesso; pode ser diferente de quem pagou (presente).
  const aluno = (data.student ?? null) as Pessoa | null;
  const comprador = (data.buyer ?? {}) as Pessoa;
  const pessoa = texto(aluno?.email) ? aluno! : comprador;

  const email = texto(pessoa.email)?.toLowerCase() ?? null;
  const nome = texto(pessoa.name) ?? '';
  const telefone = texto(pessoa.cellphone) ?? texto(pessoa.phone);
  const itens = Array.isArray(data.items) ? (data.items as Array<{ productId?: unknown; name?: unknown }>) : [];
  const produtos = itens.map(i => (i.productId != null ? String(i.productId) : '')).filter(Boolean);

  let acao: AcaoEduzz = 'registrar';
  let evento = event;
  if (event === 'myeduzz.invoice_paid') acao = 'liberar';
  else if (event === 'myeduzz.invoice_refunded') acao = 'suspender';
  else if (event === 'myeduzz.invoice_chargeback') {
    // O chargeback muda de status várias vezes; se a contestação for recusada, o acesso volta.
    const status = texto((data.chargeback as { status?: unknown } | null)?.status) ?? 'unknown';
    evento = `${event}:${status}`;
    acao = status === 'rejected' ? 'liberar' : 'suspender';
  }

  const resumo: Record<string, unknown> = {
    eventId: env.id ?? null,
    event,
    status: data.status ?? null,
    invoiceId: orderId,
    produtos: itens.map(i => ({ productId: i.productId ?? null, name: i.name ?? null })),
    paidAt: data.paidAt ?? null,
    paymentMethod: data.paymentMethod ?? null,
    valor: (data.paid as { value?: unknown } | null)?.value ?? (data.price as { value?: unknown } | null)?.value ?? null,
    chargeback: (data.chargeback as { status?: unknown } | null)?.status ?? null,
    refund: (data.refund as { type?: unknown } | null)?.type ?? null,
  };

  return { acao, evento, orderId, email, nome, telefone, produtos, resumo };
}

/* ── Duas versões do app (T-87 · D15) ──────────────────────────
   Três produtos na Eduzz, um só sistema:
     EDUZZ_PRODUCT_7D       jornada de 7 dias
     EDUZZ_PRODUCT_21D      jornada de 21 dias (EDUZZ_PRODUCT_IDS, o nome antigo, conta como 21)
     EDUZZ_PRODUCT_UPGRADE  upgrade de 7 para 21, vendido dentro do app
   Cada variável aceita vários ids separados por vírgula. Todas vazias = qualquer
   produto da conta libera 21 dias (o comportamento de antes). */

export type TipoProduto = '7d' | '21d' | 'upgrade';
export type PlanoDias = 7 | 21;

export interface ConfigProdutos {
  p7: string[];
  p21: string[];
  upgrade: string[];
}

const lista = (v: string | undefined) => (v ?? '').split(',').map(s => s.trim()).filter(Boolean);

export function lerConfigProdutos(env: Record<string, string | undefined>): ConfigProdutos {
  return {
    p7: lista(env.EDUZZ_PRODUCT_7D),
    p21: [...lista(env.EDUZZ_PRODUCT_21D), ...lista(env.EDUZZ_PRODUCT_IDS)],
    upgrade: lista(env.EDUZZ_PRODUCT_UPGRADE),
  };
}

/**
 * Qual produto do app veio na fatura. null = produto de outra coisa da Ana (ignorar).
 * Se a fatura tiver mais de um item do app (ex.: order bump), vale o que dá mais acesso.
 */
export function tipoDoProduto(produtos: string[], cfg: ConfigProdutos): TipoProduto | null {
  if (!cfg.p7.length && !cfg.p21.length && !cfg.upgrade.length) return '21d';
  if (produtos.some(p => cfg.upgrade.includes(p))) return 'upgrade';
  if (produtos.some(p => cfg.p21.includes(p))) return '21d';
  if (produtos.some(p => cfg.p7.includes(p))) return '7d';
  return null;
}

/** Dias liberados por uma compra paga. Nunca reduz: quem já tem 21 e compra o de 7 continua com 21. */
export function planoAoLiberar(tipo: TipoProduto, atual: number | null | undefined): PlanoDias {
  const novo: PlanoDias = tipo === '7d' ? 7 : 21;
  return atual === 21 ? 21 : novo;
}

/**
 * O que um reembolso/chargeback faz: estorno do upgrade só devolve a pessoa
 * para 7 dias (ela continua com a compra original); estorno da jornada suspende.
 */
export function efeitoDaSuspensao(tipo: TipoProduto): 'voltar-para-7' | 'suspender' {
  return tipo === 'upgrade' ? 'voltar-para-7' : 'suspender';
}
