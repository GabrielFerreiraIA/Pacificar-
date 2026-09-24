/* Direitos da pessoa titular (T-63 · LGPD art. 18): cópia dos dados e pedido de exclusão. */
import { db, ok } from './client';
import { BUCKET } from './labExams';

/** Validade dos links dos exames incluídos na cópia (o arquivo é baixado à parte). */
const VALIDADE_LINKS = 24 * 60 * 60;

/** Reúne tudo o que o app guarda sobre a pessoa logada (o RLS garante que é só dela). */
export async function exportarMeusDados(userId: string) {
  const q = <T,>(p: PromiseLike<{ data: T; error: { message: string } | null }>) => p.then(ok);
  const [perfil, anamnese, checkins, exames, prescricao, ciclos, zeolita, preparo, doshas, consentimentos, pedidos] =
    await Promise.all([
      q(db().from('profiles').select('*').eq('id', userId).maybeSingle()),
      q(db().from('anamneses').select('*').eq('user_id', userId).maybeSingle()),
      q(db().from('checkins').select('*').eq('user_id', userId).order('day_number')),
      q(db().from('lab_exams').select('*').eq('user_id', userId).order('created_at')),
      q(db().from('prescriptions').select('*').eq('user_id', userId).maybeSingle()),
      q(db().from('parasite_cycles').select('*').eq('user_id', userId).order('cycle_number')),
      q(db().from('zeolite_days').select('*').eq('user_id', userId).order('day')),
      q(db().from('preparo_checked').select('*').eq('user_id', userId)),
      q(db().from('dosha_results').select('*').eq('user_id', userId)),
      q(db().from('consents').select('*').eq('user_id', userId)),
      q(db().from('deletion_requests').select('*').eq('user_id', userId))
    ]);

  // Links temporários para baixar os arquivos dos exames
  const links = new Map<string, string>();
  if (exames.length) {
    const res = await db()
      .storage.from(BUCKET)
      .createSignedUrls(
        exames.map(e => e.storage_path),
        VALIDADE_LINKS
      );
    res.data?.forEach(s => s.path && s.signedUrl && links.set(s.path, s.signedUrl));
  }

  return {
    sobre: {
      app: 'Pacificar · Ana Carla Nesi (CRP 17/2833)',
      gerado_em: new Date().toISOString(),
      observacao:
        'Cópia dos seus dados guardados no app (LGPD, art. 18). Os links dos exames valem por 24 horas a partir da geração.'
    },
    perfil,
    anamnese,
    checkins,
    exames: exames.map(e => ({ ...e, link_para_baixar: links.get(e.storage_path) ?? null })),
    prescricao,
    ciclos_desparasitacao: ciclos,
    dias_zeolita: zeolita.map(z => z.day),
    preparo_marcado: preparo.map(p => p.item_id),
    questionario_doshas: doshas,
    consentimentos,
    pedidos_de_exclusao: pedidos
  };
}

/** Baixa a cópia como arquivo JSON no aparelho. */
export async function baixarMeusDados(userId: string) {
  const dados = await exportarMeusDados(userId);
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pacificar-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export interface PedidoExclusao {
  id: number;
  status: 'pending' | 'done' | 'cancelled';
  created_at: string;
}

export async function pedidoAberto(userId: string): Promise<PedidoExclusao | null> {
  const row = ok(
    await db()
      .from('deletion_requests')
      .select('id, status, created_at')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .maybeSingle()
  );
  return (row as PedidoExclusao | null) ?? null;
}

export async function pedirExclusao(userId: string, motivo: string): Promise<PedidoExclusao> {
  const res = await db()
    .from('deletion_requests')
    .insert({ user_id: userId, reason: motivo.trim().slice(0, 1000) || null })
    .select('id, status, created_at')
    .single();
  if (res.error) {
    // Já existe um pedido em aberto (índice único parcial)
    if (res.error.code === '23505') {
      const aberto = await pedidoAberto(userId);
      if (aberto) return aberto;
    }
    throw new Error(res.error.message);
  }
  return res.data as PedidoExclusao;
}
