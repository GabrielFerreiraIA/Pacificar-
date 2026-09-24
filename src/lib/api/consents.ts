/* Aceite do termo de consentimento (T-60). Imutável para o paciente (só insert, via RLS). */
import { db, ok } from './client';

export async function hasConsent(userId: string, version: string): Promise<boolean> {
  const rows = ok(
    await db().from('consents').select('term_version').eq('user_id', userId).eq('term_version', version)
  );
  return rows.length > 0;
}

export async function acceptConsent(userId: string, version: string) {
  const res = await db()
    .from('consents')
    .insert({ user_id: userId, term_version: version, user_agent: navigator.userAgent.slice(0, 300) });
  // Aceite repetido (dois aparelhos, clique duplo) não é erro
  if (res.error && res.error.code !== '23505') throw new Error(res.error.message);
}
