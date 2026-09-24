// Utilitários compartilhados pelos testes E2E.
import fs from 'node:fs';

/** Versão atual do termo, lida de src/data/termo.ts (fonte única). */
export function termoVersao() {
  const src = fs.readFileSync(new URL('../../src/data/termo.ts', import.meta.url), 'utf8');
  return src.match(/TERMO_VERSAO = '([^']+)'/)[1];
}

/** Registra o aceite do termo (T-60) para o teste ir direto ao app. */
export async function aceitarTermo(admin, userId) {
  const { error } = await admin.from('consents').insert({ user_id: userId, term_version: termoVersao() });
  if (error && error.code !== '23505') throw error;
}
