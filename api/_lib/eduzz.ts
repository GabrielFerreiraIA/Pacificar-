// Regras puras do webhook e da Entrega Customizada da Eduzz (T-34 / T-90). Sem banco, para testar isolado.
// Referências:
// - Webhook (Console): https://developers.eduzz.com/docs/webhook e https://developers.eduzz.com/reference/webhook/myeduzz-invoice-paid
// - Entrega Customizada (Órbita): https://github.com/eduzz/custom-delivery
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

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
  /** Origem do payload: webhook novo do Console ou Entrega Customizada do Órbita (T-90). */
  formato?: 'webhook' | 'custom_delivery';
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

/**
 * Converte o corpo bruto enviado pela Eduzz (JSON, form-urlencoded ou vazio no teste de validação
 * da Entrega Customizada) num objeto pronto para `interpretarEvento`.
 */
export function lerCorpoEduzz(corpo: string): unknown {
  if (!corpo || !corpo.trim()) return { event: 'ping' };
  const limpo = corpo.trim();
  if (limpo.startsWith('{') || limpo.startsWith('[')) {
    return JSON.parse(limpo);
  }
  const params = new URLSearchParams(limpo);
  const root: Record<string, unknown> = {};
  const fields: Record<string, unknown> = {};
  for (const [k, v] of params.entries()) {
    const m = k.match(/^fields\[([^\]]+)\]$/);
    if (m) {
      fields[m[1]] = v;
    } else {
      root[k] = v;
      if (k.startsWith('edz_') || k === 'trans_status') fields[k] = v;
    }
  }
  if (Object.keys(fields).length) root.fields = fields;
  if (!Object.keys(root).length) return { event: 'ping' };
  return root;
}

/**
 * Valida a autenticação da Entrega Customizada (`https://github.com/eduzz/custom-delivery`):
 * 1. `fields.edz_cli_origin_secret` comparado com `EDUZZ_ORIGIN_SECRET` ou `EDUZZ_WEBHOOK_SECRET`
 * 2. `nsid` = `sha1(edz_fat_cod + edz_cnt_cod + edz_cli_cod)`
 * 3. `sid` = `md5(valores_ordenados_de_fields + edz_cli_apikey)`
 */
export function conferirEntregaCustomizada(
  json: unknown,
  env: Record<string, string | undefined>
): 'origin_secret' | 'nsid' | 'sid' | 'origin_presente' | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;
  const fields = (
    obj.fields && typeof obj.fields === 'object' ? obj.fields : obj
  ) as Record<string, unknown>;

  const originRecebido = texto(fields.edz_cli_origin_secret);
  const segredosConfigurados = [
    ...(env.EDUZZ_ORIGIN_SECRET ?? '').split(','),
    ...(env.EDUZZ_WEBHOOK_SECRET ?? '').split(','),
  ]
    .map(s => s.trim())
    .filter(Boolean);

  const iguais = (a: string, b: string) => {
    const x = Buffer.from(a);
    const y = Buffer.from(b);
    return x.length === y.length && timingSafeEqual(x, y);
  };

  if (originRecebido && segredosConfigurados.some(s => iguais(originRecebido, s))) {
    return 'origin_secret';
  }

  // Validação por nsid documentada no repositório oficial eduzz/custom-delivery
  const nsid = texto(obj.nsid) ?? texto(fields.nsid);
  const fatCod = fields.edz_fat_cod != null ? String(fields.edz_fat_cod) : '';
  const cntCod = fields.edz_cnt_cod != null ? String(fields.edz_cnt_cod) : '';
  const cliCod = fields.edz_cli_cod != null ? String(fields.edz_cli_cod) : '';
  if (nsid && fatCod && cntCod && cliCod) {
    const gerado = createHash('sha1').update(`${fatCod}${cntCod}${cliCod}`).digest('hex');
    if (iguais(nsid.toLowerCase(), gerado.toLowerCase())) return 'nsid';
  }

  // Validação por sid (MD5 das chaves ordenadas + edz_cli_apikey)
  const sid = texto(obj.sid) ?? texto(fields.sid);
  const apiKey = texto(fields.edz_cli_apikey);
  if (sid && apiKey && obj.fields && typeof obj.fields === 'object') {
    const fObj = obj.fields as Record<string, unknown>;
    const ordenado = Object.keys(fObj)
      .sort()
      .reduce((acc, k) => `${acc}${fObj[k] ?? ''}`, '');
    const geradoSid = createHash('md5').update(ordenado + apiKey).digest('hex');
    if (iguais(sid.toLowerCase(), geradoSid.toLowerCase())) return 'sid';
  }

  // Se o produtor ainda não cadastrou EDUZZ_ORIGIN_SECRET separadamente, aceita se edz_cli_origin_secret veio preenchido
  if (!texto(env.EDUZZ_ORIGIN_SECRET) && originRecebido) {
    return 'origin_presente';
  }

  return null;
}

function ehEntregaCustomizada(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false;
  const obj = json as Record<string, unknown>;
  if (texto(obj.event)) return false;
  if (obj.fields && typeof obj.fields === 'object') return true;
  if (obj.type === 'create' || obj.type === 'remove') return true;
  if ('edz_fat_cod' in obj || 'edz_cnt_cod' in obj || 'edz_cli_email' in obj) return true;
  return false;
}

function interpretarEntregaCustomizada(json: Record<string, unknown>): EventoEduzz {
  const fields = (
    json.fields && typeof json.fields === 'object' ? json.fields : json
  ) as Record<string, unknown>;

  const type = (texto(json.type) ?? texto(fields.type))?.toLowerCase() ?? null;
  const rawOrderId = fields.edz_fat_cod != null ? String(fields.edz_fat_cod).trim() : '';
  const orderId = rawOrderId && rawOrderId !== '0' ? rawOrderId : null;
  const email = texto(fields.edz_cli_email)?.toLowerCase() ?? null;

  // Ping / validação da URL da oferta no modal de Entrega Customizada do Órbita (retorna 200)
  if (!orderId || (!email && type !== 'remove')) {
    return {
      acao: 'ping',
      evento: 'ping',
      orderId: orderId ?? 'ping',
      email: null,
      nome: '',
      telefone: null,
      produtos: [],
      resumo: { formato: 'custom_delivery', type },
      formato: 'custom_delivery',
    };
  }

  const nome = texto(fields.edz_cli_rsocial) ?? texto(fields.edz_cli_nome) ?? '';
  const telefone = texto(fields.edz_cli_cel) ?? texto(fields.edz_cli_tel) ?? null;
  const produtos = [fields.edz_cnt_cod, fields.edz_cnt_paicod]
    .filter(v => v != null && String(v).trim() !== '' && String(v).trim() !== '0')
    .map(v => String(v).trim());

  const fatStatus = Number(fields.edz_fat_status ?? fields.trans_status ?? 0);
  let acao: AcaoEduzz = 'registrar';
  if (type === 'remove' || [4, 6, 7, 10].includes(fatStatus)) {
    acao = 'suspender';
  } else if (type === 'create' || fatStatus === 3) {
    acao = 'liberar';
  }

  const evento =
    acao === 'liberar'
      ? 'eduzz.custom_delivery.create'
      : acao === 'suspender'
        ? 'eduzz.custom_delivery.remove'
        : `eduzz.custom_delivery.${type ?? (fatStatus || 'other')}`;

  // Sem CPF (edz_cli_taxnumber) nem endereço na cópia salva em purchases (LGPD)
  const resumo: Record<string, unknown> = {
    formato: 'custom_delivery',
    type,
    status: fatStatus || null,
    invoiceId: orderId,
    produtos: [
      {
        productId: fields.edz_cnt_cod ?? null,
        parentId: fields.edz_cnt_paicod ?? null,
        name: fields.edz_cnt_titulo ?? null,
      },
    ],
    valor: fields.edz_valorpago ?? null,
    orderBump: fields.edz_order_bump_item ?? null,
  };

  return {
    acao,
    evento,
    orderId,
    email,
    nome,
    telefone,
    produtos,
    resumo,
    formato: 'custom_delivery',
  };
}

/**
 * Lê tanto o envelope do Webhook do Console `{ id, event, data, sentDate }` quanto o payload da
 * Entrega Customizada do Órbita `{ type, sid, nsid, fields: { edz_* } }` (T-90).
 */
export function interpretarEvento(json: unknown): EventoEduzz {
  if (ehEntregaCustomizada(json)) {
    return interpretarEntregaCustomizada(json as Record<string, unknown>);
  }
  // Objeto vazio enviado no botão de validação da Entrega Customizada do Órbita → ping 200
  if (json && typeof json === 'object' && Object.keys(json as Record<string, unknown>).length === 0) {
    return { acao: 'ping', evento: 'ping', orderId: 'ping', email: null, nome: '', telefone: null, produtos: [], resumo: {} };
  }

  const env = json as { id?: unknown; event?: unknown; data?: Record<string, unknown> };
  const event = texto(env?.event);
  if (!event) throw new Error('evento sem o campo "event"');

  if (event === 'ping') {
    return { acao: 'ping', evento: 'ping', orderId: String(env.id ?? 'ping'), email: null, nome: '', telefone: null, produtos: [], resumo: {}, formato: 'webhook' };
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
