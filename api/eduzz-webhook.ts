// Webhook e Entrega Customizada da Eduzz (T-34 / T-89 / T-90): a compra aprovada cria a conta ativa da paciente.
// Suporta os dois formatos da Eduzz no mesmo endereço (/api/eduzz-webhook):
//   1. Webhook do Console (developers.eduzz.com): JSON { id, event, data } + header x-signature (HMAC-SHA256)
//   2. Entrega Customizada do Órbita (github.com/eduzz/custom-delivery): GET/POST de validação (200) e
//      POST { type: 'create'|'remove', sid, nsid, fields: { edz_* } } (JSON ou form-urlencoded)
import { supabaseAdmin } from './_lib/supabaseAdmin.js';
import {
  conferirAssinatura,
  conferirEntregaCustomizada,
  efeitoDaSuspensao,
  interpretarEvento,
  lerConfigProdutos,
  lerCorpoEduzz,
  planoAoLiberar,
  tipoDoProduto,
  type EventoEduzz,
  type TipoProduto,
} from './_lib/eduzz.js';
import type { Json } from '../src/types/database';

const hoje = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // AAAA-MM-DD

/**
 * Validação da URL no modal de Entrega Customizada do Órbita (requer status HTTP 200).
 * Se uma paciente abrir esta URL no navegador, recebe 200 e é levada para a tela de login do app.
 */
export async function GET(request: Request): Promise<Response> {
  const accept = request.headers.get('accept') ?? '';
  if (accept.includes('text/html')) {
    return new Response(
      '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><script>location.replace("/")</script><title>Pacificar</title></head><body>Redirecionando para o Pacificar…</body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
  return Response.json({ ok: true, ping: true, entrega: 'customizada' }, { status: 200 });
}

export async function HEAD(): Promise<Response> {
  return new Response(null, { status: 200 });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 200 });
}

export async function POST(request: Request): Promise<Response> {
  const corpo = await request.text();
  const assinatura = conferirAssinatura(corpo, request.headers.get('x-signature'), process.env.EDUZZ_WEBHOOK_SECRET);

  let parsed: unknown;
  let ev: EventoEduzz;
  try {
    parsed = lerCorpoEduzz(corpo);
    ev = interpretarEvento(parsed);
  } catch (e) {
    // Se não veio header x-signature do Console, pode ser um ping de validação da Entrega Customizada do Órbita
    if (!request.headers.get('x-signature')) {
      return Response.json({ ok: true, ping: true, entrega: 'customizada' }, { status: 200 });
    }
    return Response.json({ ok: false, error: e instanceof Error ? e.message : 'json inválido' }, { status: 400 });
  }

  const authCustom = ev.formato === 'custom_delivery' ? conferirEntregaCustomizada(parsed, process.env) : null;

  // Ping de ativação (Console Webhook ou validação de Entrega Customizada no Órbita): responde 200 sempre.
  if (ev.acao === 'ping') {
    return Response.json({ ok: true, ping: true, assinatura: assinatura ?? authCustom ?? 'invalida' }, { status: 200 });
  }

  const autenticado = ev.formato === 'custom_delivery' ? (authCustom ?? assinatura) : assinatura;
  if (!autenticado) {
    console.warn('[eduzz] assinatura/origem inválida', ev.evento, ev.orderId);
    return Response.json({ ok: false, error: 'assinatura inválida' }, { status: 401 });
  }

  const db = supabaseAdmin();
  // Qual versão do app esta fatura compra: 7 dias, 21 dias ou o upgrade (T-87 · D15)
  const tipo = tipoDoProduto(ev.produtos, lerConfigProdutos(process.env));
  ev.resumo.tipo = tipo;

  // Idempotência: (order_id, event) é único. Se já foi processado, não faz nada de novo.
  const ins = await db
    .from('purchases')
    .insert({ order_id: ev.orderId, event: ev.evento, email: ev.email, payload: ev.resumo as Json })
    .select('id')
    .single();
  let compraId: number;
  if (ins.error) {
    if (ins.error.code !== '23505') return erro('purchases', ins.error.message);
    const ja = await db.from('purchases').select('id, processed_at').eq('order_id', ev.orderId).eq('event', ev.evento).single();
    if (ja.error) return erro('purchases', ja.error.message);
    if (ja.data.processed_at) return Response.json({ ok: true, duplicado: true });
    compraId = ja.data.id; // tentativa anterior falhou no meio: processa de novo
  } else {
    compraId = ins.data.id;
  }

  try {
    let userId: string | null = null;
    let resultado = 'registrado';

    if (ev.acao !== 'registrar' && !tipo) {
      resultado = 'ignorado: outro produto';
    } else if (ev.acao === 'liberar' && tipo) {
      if (!ev.email) throw new Error('fatura paga sem e-mail do comprador');
      const lib = await liberar(db, ev, tipo);
      userId = lib.id;
      resultado = `acesso liberado: ${lib.plano} dias`;
    } else if (ev.acao === 'suspender' && tipo && ev.email) {
      // Estorno do upgrade não tira o acesso: a pessoa volta para os 7 dias que comprou antes
      const patch =
        efeitoDaSuspensao(tipo) === 'voltar-para-7' ? { plan_days: 7 } : { access_status: 'revoked' };
      const { data, error } = await db
        .from('profiles')
        .update(patch)
        .eq('email', ev.email)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      userId = data?.id ?? null;
      resultado = !userId ? 'suspensão sem conta' : 'plan_days' in patch ? 'upgrade estornado: volta para 7 dias' : 'acesso suspenso';
    }

    await db.from('purchases').update({ processed_at: new Date().toISOString(), user_id: userId, error: null }).eq('id', compraId);
    return Response.json({ ok: true, resultado });
  } catch (e) {
    const msg = e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'erro';
    await db.from('purchases').update({ error: msg }).eq('id', compraId);
    return erro('processar', msg);
  }
}

/**
 * Cria a conta já ativa (sem verificação de e-mail) ou reativa a conta existente, com o plano da compra.
 * A paciente define a própria senha no primeiro acesso ao app (api/primeiro-acesso.ts).
 * Upgrade numa conta existente só muda o plano: a jornada continua de onde está.
 */
async function liberar(
  db: ReturnType<typeof supabaseAdmin>,
  ev: EventoEduzz,
  tipo: TipoProduto
): Promise<{ id: string; plano: number }> {
  const email = ev.email!;
  const existente = await db
    .from('profiles')
    .select('id, full_name, phone, journey_start_date, plan_days, eduzz_invoice_id')
    .eq('email', email)
    .maybeSingle();
  if (existente.error) throw existente.error;

  let id = existente.data?.id;
  if (!id) {
    const criado = await db.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: ev.nome, phone: ev.telefone, needs_password: true },
    });
    if (criado.error || !criado.data.user) throw criado.error ?? new Error('compra não criou usuário');
    id = criado.data.user.id; // a trigger handle_new_user já criou o profile
  }

  const plano = planoAoLiberar(tipo, existente.data?.plan_days);
  const { error } = await db
    .from('profiles')
    .update({
      access_status: 'active',
      plan_days: plano,
      // a fatura do upgrade fica só em purchases; aqui segue a da compra original
      eduzz_invoice_id: tipo === 'upgrade' && existente.data?.eduzz_invoice_id ? existente.data.eduzz_invoice_id : ev.orderId,
      full_name: existente.data?.full_name || ev.nome,
      phone: existente.data?.phone || ev.telefone,
      journey_start_date: existente.data?.journey_start_date ?? hoje(),
    })
    .eq('id', id);
  if (error) throw error;
  return { id, plano };
}

function erro(etapa: string, msg: string): Response {
  console.error(`[eduzz] falha em ${etapa}:`, msg);
  return Response.json({ ok: false, error: msg }, { status: 500 });
}
