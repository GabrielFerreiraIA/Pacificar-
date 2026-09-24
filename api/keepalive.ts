// Keep-alive do Supabase gratuito (T-40). Ver PLANO.md → "Keep-alive em detalhe".
// Faz escrita e leitura reais no Postgres, porque o Supabase mede atividade de banco.
// Chamado pelo Vercel Cron (diário) e pelo GitHub Actions (a cada 12h).
import { supabaseAdmin } from './_lib/supabaseAdmin';
import { segredoConfere } from './_lib/auth';

const FONTES = new Set(['vercel-cron', 'github-actions', 'manual']);
const RETENCAO_DIAS = 30;

export async function GET(request: Request): Promise<Response> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!segredoConfere(token, process.env.CRON_SECRET)) {
    return Response.json({ ok: false, error: 'não autorizado' }, { status: 401 });
  }

  const src = new URL(request.url).searchParams.get('src') ?? 'manual';
  const source = FONTES.has(src) ? src : 'manual';

  try {
    const db = supabaseAdmin();

    const ins = await db.from('heartbeat').insert({ source }).select('created_at').single();
    if (ins.error) throw ins.error;

    const limite = new Date(Date.now() - RETENCAO_DIAS * 86_400_000).toISOString();
    const del = await db.from('heartbeat').delete().lt('created_at', limite);
    if (del.error) throw del.error;

    const cnt = await db.from('heartbeat').select('id', { count: 'exact', head: true });
    if (cnt.error) throw cnt.error;

    return Response.json({ ok: true, source, at: ins.data.created_at, total: cnt.count });
  } catch (e) {
    const message = e instanceof Error ? e.message : (e as { message?: string })?.message ?? 'erro';
    console.error('[keepalive] falhou:', message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
