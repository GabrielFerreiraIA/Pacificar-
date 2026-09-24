// Teste do backup (T-82): gera, abre, recusa senha errada e extrai conferindo os dados.
// Uso: node --env-file=.env.local supabase/tests/backup_test.mjs
// Cria uma paciente temporária com anamnese, check-in e exame; apaga tudo no fim
// (inclusive o .bak e a pasta extraída, que contêm dado de teste).
import { createClient } from '@supabase/supabase-js';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const run = (args, env = {}) =>
  execFileSync(process.execPath, ['--env-file=.env.local', ...args], { env: { ...process.env, ...env }, encoding: 'utf8' });

const { data: u, error } = await admin.auth.admin.createUser({
  email: `teste.backup.${Date.now()}@example.com`,
  password: 'x'.repeat(12),
  email_confirm: true
});
if (error) throw error;
const conteudo = Buffer.from(`%PDF-1.4\n%backup-teste-${Date.now()}\n`);
const caminho = `${u.user.id}/exame-backup.pdf`;
const arq = `backups/pacificar-${new Date().toISOString().slice(0, 10)}.bak`;
const pasta = 'backups/_extracao_teste';
const jaExistia = fs.existsSync(arq);
if (jaExistia) fs.renameSync(arq, `${arq}.anterior`);

try {
  await admin.from('anamneses').insert({ user_id: u.user.id, answers: { nome: 'Backup Teste' } });
  await admin.from('checkins').insert({ user_id: u.user.id, day_number: 1 });
  await admin.storage.from('exames').upload(caminho, conteudo, { contentType: 'application/pdf' });

  run(['supabase/scripts/backup.mjs']);
  ok(fs.existsSync(arq), `Backup gerado (${arq}, ${(fs.statSync(arq).size / 1024).toFixed(0)} KB)`);
  const bruto = fs.readFileSync(arq);
  ok(!bruto.includes('Backup Teste') && !bruto.includes('backup-teste'), 'Conteúdo criptografado (nada legível no arquivo)');

  const conf = run(['supabase/scripts/abrir-backup.mjs', arq]);
  ok(/auth\.users\s+[1-9]/.test(conf) && /public\.anamneses\s+[1-9]/.test(conf) && /arquivos de exames\s+[1-9]/.test(conf),
    'Abre com a senha e mostra usuários, anamneses e exames');

  let recusou = false;
  try {
    execFileSync(process.execPath, ['supabase/scripts/abrir-backup.mjs', arq], {
      env: { ...process.env, BACKUP_PASSPHRASE: 'senha-errada' },
      stdio: 'pipe'
    });
  } catch {
    recusou = true;
  }
  ok(recusou, 'Senha errada não abre');

  run(['supabase/scripts/abrir-backup.mjs', arq, '--extrair', pasta]);
  const sql = fs.readFileSync(`${pasta}/dados.sql`, 'utf8');
  ok(sql.includes('Backup Teste') && sql.includes('COPY auth.users'), 'SQL extraído tem os dados e as contas do Auth');
  ok(!/COPY auth\.(sessions|refresh_tokens)/.test(sql), 'Sessões e tokens ficaram de fora');
  ok(Buffer.compare(fs.readFileSync(`${pasta}/exames/${caminho}`), conteudo) === 0, 'Arquivo do exame extraído idêntico ao original');
} finally {
  fs.rmSync(pasta, { recursive: true, force: true });
  fs.rmSync(arq, { force: true });
  if (jaExistia) fs.renameSync(`${arq}.anterior`, arq);
  await admin.storage.from('exames').remove([caminho]);
  await admin.auth.admin.deleteUser(u.user.id);
  console.log('Paciente, arquivo e backup de teste removidos.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nBackup OK');
