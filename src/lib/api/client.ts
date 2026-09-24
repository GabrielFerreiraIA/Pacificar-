/* Base da camada de dados (T-14). Cada entidade tem seu arquivo em src/lib/api/.
   As funções lançam erro; quem chama decide como avisar a pessoa. */
import { supabase } from '../supabase';

export function db() {
  if (!supabase) throw new Error('Supabase não configurado');
  return supabase;
}

/** Desembrulha a resposta do supabase-js: devolve os dados ou lança o erro. */
export function ok<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}
