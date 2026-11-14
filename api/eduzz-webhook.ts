// Webhook da Eduzz (T-34): a compra aprovada cria o login da paciente.
// Ver PLANO.md → "Fluxo Eduzz". Regras puras em _lib/eduzz.ts.
//
// Respostas:
//   401 assinatura inválida (a Eduzz mostra no histórico de envios)
//   200 processado, duplicado, ignorado ou ping
//   500 falha ao gravar/convidar: a Eduzz pode reenviar, e o reenvio é seguro (idempotente)
import { supabaseAdmin } from './_lib/supabaseAdmin';
import {
  conferirAssinatura,
  efeitoDaSuspensao,
  interpretarEvento,
  lerConfigProdutos,
  planoAoLiberar,
  tipoDoProduto,
  type EventoEduzz,
  type TipoProduto,
} from './_lib/eduzz';
import type { Json } from '../src/types/database';

const hoje = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // AAAA-MM-DD

export async function POST(request: Request): Promise<Response> {
  const corpo = await request.text();
  const assinatura = conferirAssinatura(corpo, request.headers.get('x-signature'), process.env.EDUZZ_WEBHOOK_SECRET);

  let ev: EventoEduzz;
  try {
    ev = interpretarEvento(JSON.parse(corpo));
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : 'json inválido' }, { status: 400 });
  }

  // Ping de ativação: responde 200 sempre (senão a URL nem ativa) e diz se a assinatura bateu.
  // No histórico de envios da Eduzz, a resposta deve mostrar "assinatura": "hex" ou "base64".
  if (ev.acao === 'ping') {
    return Response.json({ ok: true, ping: true, assinatura: assinatura ?? 'invalida' });
  }
  if (!assinatura) {
    console.warn('[eduzz] assinatura inválida', ev.evento, ev.orderId);
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
