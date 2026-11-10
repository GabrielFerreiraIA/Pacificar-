/* Modo demonstração (T-56, T-85, T-86).
   Em produção não há botão: na tela de login, 5 toques no logo abrem a demo.
   Os dados fictícios (mockData, com fotos do Unsplash) ficam num chunk separado,
   baixado só quando a demo é aberta. A demo não usa login nem toca no Supabase:
   tudo fica salvo no navegador de quem testa. */
import type * as Mock from './mockData';

export type DemoData = typeof Mock;

/** Botão visível só em desenvolvimento ou com VITE_DEMO=true (preview). O gesto funciona sempre. */
export const DEMO_ATIVA = import.meta.env.DEV || import.meta.env.VITE_DEMO === 'true';

/** Preenchido por carregarDemo(). Os módulos leem a ligação viva (export let). */
export let DEMO: DemoData | null = null;

const CHAVE = 'pacificar_demo_aberta';

export async function carregarDemo(): Promise<void> {
  if (!DEMO) DEMO = await import('./mockData');
  try {
    sessionStorage.setItem(CHAVE, '1'); // recarregar a página mantém a demo aberta nesta aba
  } catch {
    /* navegação privada: segue sem lembrar */
  }
}

export function demoLembrada(): boolean {
  try {
    return sessionStorage.getItem(CHAVE) === '1';
  } catch {
    return false;
  }
}

export function sairDaDemo(): void {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
  window.location.replace('/');
}
