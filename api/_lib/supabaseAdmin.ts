// Cliente Supabase com a service role. SÓ pode ser importado dentro de api/.
// Pastas/arquivos com "_" não viram rota na Vercel.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/types/database';

export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente');
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
