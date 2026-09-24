import { timingSafeEqual } from 'node:crypto';

/** Compara segredos em tempo constante (evita descobrir o segredo pelo tempo de resposta). */
export function segredoConfere(recebido: string | null | undefined, esperado: string | undefined): boolean {
  if (!recebido || !esperado) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}
