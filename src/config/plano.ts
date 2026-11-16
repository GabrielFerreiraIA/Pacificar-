/* Duas versões do app (T-87 · D15): jornada de 7 ou de 21 dias.
   Quem comprou 7 dias vê os dias 8 a 21 com cadeado e a oferta de upgrade.

   Link do checkout do produto "upgrade 7 → 21" na Eduzz (3151468, público, não é segredo).
   Fica direto no código para não depender de variável na Vercel. Se um dia o link mudar,
   troque aqui. VITE_EDUZZ_UPGRADE_URL, se existir, tem prioridade (útil para testes). */
import type { UserProfile } from '../types';
import { linkWhatsAppAna } from './contato';

export const DIAS_JORNADA_COMPLETA = 21;

export const LINK_CHECKOUT_UPGRADE = 'https://chk.eduzz.com/wv5vlxod';

const checkout = (import.meta.env.VITE_EDUZZ_UPGRADE_URL ?? '').trim() || LINK_CHECKOUT_UPGRADE;

/** Dias que a pessoa comprou. Terapeuta e perfis sem a informação: 21. */
export function diasDoPlano(user: UserProfile | null | undefined, role?: string): 7 | 21 {
  if (role === 'admin') return 21;
  return user?.plan_days === 7 ? 7 : 21;
}

/**
 * Link do upgrade. O webhook reconhece a compra pelo e-mail, então o e-mail do app
 * vai junto para o checkout já vir preenchido (a Eduzz ignora o parâmetro se não usar).
 */
export function linkUpgrade(email?: string): { href: string; viaWhatsApp: boolean } {
  if (!checkout) {
    return {
      href: linkWhatsAppAna('Olá, Ana! Concluí (ou estou concluindo) os 7 dias do Pacificar e quero desbloquear a jornada completa de 21 dias. 🌿'),
      viaWhatsApp: true,
    };
  }
  if (!email) return { href: checkout, viaWhatsApp: false };
  const url = new URL(checkout);
  if (!url.searchParams.has('email')) url.searchParams.set('email', email);
  return { href: url.toString(), viaWhatsApp: false };
}
