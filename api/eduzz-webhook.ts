// Webhook da Eduzz (T-34): a compra aprovada cria o login da paciente.
// Ver PLANO.md → "Fluxo Eduzz". Regras puras em _lib/eduzz.ts.
//
// Respostas:
//   401 assinatura inválida (a Eduzz mostra no histórico de envios)
//   200 processado, duplicado, ignorado ou ping
//   500 falha ao gravar/convidar: a Eduzz pode reenviar, e o reenvio é seguro (idempotente)
import { supabaseAdmin } from './_lib/supabaseAdmin';
import { conferirAssinatura, interpretarEvento, produtoDoApp, type EventoEduzz } from './_lib/eduzz';
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

    if (ev.acao !== 'registrar' && !produtoDoApp(ev.produtos, process.env.EDUZZ_PRODUCT_IDS)) {
      resultado = 'ignorado: outro produto';
    } else if (ev.acao === 'liberar') {
      if (!ev.email) throw new Error('fatura paga sem e-mail do comprador');
      userId = await liberar(db, ev);
      resultado = 'acesso liberado';
    } else if (ev.acao === 'suspender' && ev.email) {
      const { data, error } = await db
        .from('profiles')
        .update({ access_status: 'revoked' })
        .eq('email', ev.email)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      userId = data?.id ?? null;
      resultado = userId ? 'acesso suspenso' : 'suspensão sem conta';
    }

    await db.from('purchases').update({ processed_at: new Date().toISOString(), user_id: userId, error: null }).eq('id', compraId);
    return Response.json({ ok: true, resultado });
  } catch (e) {
    const msg = e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'erro';
    await db.from('purchases').update({ error: msg }).eq('id', compraId);
    return erro('processar', msg);
  }
}

/** Cria o convite (conta nova) ou reativa a conta existente. Devolve o id do usuário. */
async function liberar(db: ReturnType<typeof supabaseAdmin>, ev: EventoEduzz): Promise<string> {
  const email = ev.email!;
  const existente = await db.from('profiles').select('id, full_name, phone, journey_start_date').eq('email', email).maybeSingle();
  if (existente.error) throw existente.error;

  let id = existente.data?.id;
  if (!id) {
    const appUrl = (process.env.APP_URL ?? '').replace(/\/$/, '');
    const convite = await db.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${appUrl}/definir-senha`,
      data: { full_name: ev.nome, phone: ev.telefone },
    });
    if (convite.error || !convite.data.user) throw convite.error ?? new Error('convite não criou usuário');
    id = convite.data.user.id; // a trigger handle_new_user já criou o profile
  }

  const { error } = await db
    .from('profiles')
    .update({
      access_status: 'active',
      eduzz_invoice_id: ev.orderId,
      full_name: existente.data?.full_name || ev.nome,
      phone: existente.data?.phone || ev.telefone,
      journey_start_date: existente.data?.journey_start_date ?? hoje(),
    })
    .eq('id', id);
  if (error) throw error;
  return id;
}

function erro(etapa: string, msg: string): Response {
  console.error(`[eduzz] falha em ${etapa}:`, msg);
  return Response.json({ ok: false, error: msg }, { status: 500 });
}
