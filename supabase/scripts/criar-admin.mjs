// Cria (por convite) e promove a conta de terapeuta da Ana (T-15).
// Uso: node --env-file=.env.local supabase/scripts/criar-admin.mjs email@da-ana.com
// - Se a conta não existe: envia o convite (a Ana define a senha pelo link) e promove.
// - Se já existe: só promove a admin.
// Nenhuma senha é criada ou exibida por este script.
import { createClient } from '@supabase/supabase-js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Informe o e-mail: node --env-file=.env.local supabase/scripts/criar-admin.mjs email@da-ana.com');
  process.exit(1);
}
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, APP_URL } = process.env;
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

let { data: perfil } = await admin.from('profiles').select('id, role').ilike('email', email).maybeSingle();

if (!perfil) {
  const redirectTo = `${(APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')}/definir-senha`;
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: { full_name: 'Ana Carla Nesi' }
  });
  if (error) {
    console.error('Falha ao convidar:', error.message);
    process.exit(1);
  }
  console.log(`Convite enviado para ${email} (link leva a ${redirectTo}).`);
  perfil = { id: data.user.id, role: 'patient' };
}

const { error } = await admin.from('profiles').update({ role: 'admin', access_status: 'active' }).eq('id', perfil.id);
if (error) {
  console.error('Falha ao promover:', error.message);
  process.exit(1);
}
console.log(`${email} agora é terapeuta (admin).`);
