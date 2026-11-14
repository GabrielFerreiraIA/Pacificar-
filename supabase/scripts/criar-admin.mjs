// Cria (sem verificação de e-mail) e promove a conta de terapeuta da Ana (T-15 / T-89).
// Uso: node --env-file=.env.local supabase/scripts/criar-admin.mjs email@da-ana.com
// - Se a conta não existe: cria já confirmada com needs_password = true (a Ana define a senha no 1º acesso) e promove.
// - Se já existe: promove a admin e garante que o e-mail está confirmado.
// Nenhuma senha é criada ou exibida por este script.
import { createClient } from '@supabase/supabase-js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Informe o e-mail: node --env-file=.env.local supabase/scripts/criar-admin.mjs email@da-ana.com');
  process.exit(1);
}
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

let { data: perfil } = await admin.from('profiles').select('id, role').ilike('email', email).maybeSingle();

if (!perfil) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: 'Ana Carla Nesi', needs_password: true }
  });
  if (error) {
    console.error('Falha ao criar conta:', error.message);
    process.exit(1);
  }
  console.log(`Conta criada e confirmada para ${email} (a senha será definida no primeiro acesso ao app).`);
  perfil = { id: data.user.id, role: 'patient' };
}

const { error } = await admin.from('profiles').update({ role: 'admin', access_status: 'active' }).eq('id', perfil.id);
if (error) {
  console.error('Falha ao promover:', error.message);
  process.exit(1);
}
console.log(`${email} agora é terapeuta (admin).`);
