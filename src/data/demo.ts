/* Dados fictícios da demonstração (T-56, T-85).
   Ligada em desenvolvimento ou com VITE_DEMO=true no build (demo da Ana na Vercel).
   Sem nenhuma das duas, DEMO vira null e o mockData (com a paciente fictícia e
   fotos do Unsplash) sai do bundle. A demo não usa login nem toca no Supabase:
   tudo fica salvo no navegador de quem testa. */
import * as mock from './mockData';

export const DEMO_ATIVA = import.meta.env.DEV || import.meta.env.VITE_DEMO === 'true';

export const DEMO = DEMO_ATIVA ? mock : null;
