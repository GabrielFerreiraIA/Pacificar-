// Teste real do bucket "exames" (T-13) contra o projeto configurado no .env.local.
// Uso: node --env-file=.env.local supabase/tests/storage_test.mjs
// Cria dois usuários temporários, testa as regras e apaga tudo no fim.
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const url = process.env.SUPABASE_URL;
const pub = process.env.VITE_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !pub || !secret) throw new Error('Faltam SUPABASE_URL, VITE_SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY no .env.local');

const admin = createClient(url, secret, { auth: { persistSession: false } });
const pdf = new Blob(['%PDF-1.4\n% teste\n'], { type: 'application/pdf' });
let falhas = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✔' : '✘'} ${msg}`); if (!cond) falhas++; };

async function novoUsuario(tag) {
  const email = `teste-storage-${tag}-${Date.now()}@exemplo.invalid`;
  const password = randomBytes(16).toString('hex');
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const client = createClient(url, pub, { auth: { persistSession: false } });
  const { error: e2 } = await client.auth.signInWithPassword({ email, password });
  if (e2) throw e2;
  return { id: data.user.id, client };
}

const a = await novoUsuario('a');
const b = await novoUsuario('b');
try {
  const caminhoA = `${a.id}/${Date.now()}-exame.pdf`;
  let r = await a.client.storage.from('exames').upload(caminhoA, pdf, { contentType: 'application/pdf' });
  ok(!r.error, 'A envia PDF na própria pasta');

  r = await a.client.storage.from('exames').upload(`${b.id}/intruso.pdf`, pdf, { contentType: 'application/pdf' });
  ok(!!r.error, 'A NÃO envia na pasta de B');

  r = await a.client.storage.from('exames').upload(`${a.id}/x.txt`, new Blob(['oi'], { type: 'text/plain' }), { contentType: 'text/plain' });
  ok(!!r.error, 'Tipo não permitido (text/plain) é recusado');

  r = await a.client.storage.from('exames').upload(caminhoA, pdf, { contentType: 'application/pdf', upsert: true });
  ok(!!r.error, 'Sobrescrever arquivo existente é recusado');

  r = await b.client.storage.from('exames').download(caminhoA);
  ok(!!r.error, 'B NÃO baixa o exame de A');

  r = await b.client.storage.from('exames').createSignedUrl(caminhoA, 60);
  ok(!!r.error, 'B NÃO gera signed URL do exame de A');

  r = await a.client.storage.from('exames').createSignedUrl(caminhoA, 60);
  ok(!r.error && !!r.data?.signedUrl, 'A gera signed URL do próprio exame');
  if (r.data?.signedUrl) ok((await fetch(r.data.signedUrl)).ok, 'Signed URL abre o arquivo');

  const anon = createClient(url, pub, { auth: { persistSession: false } });
  r = await anon.storage.from('exames').download(caminhoA);
  ok(!!r.error, 'Anônimo NÃO baixa');

  r = await b.client.storage.from('exames').remove([caminhoA]);
  const aindaExiste = !(await a.client.storage.from('exames').download(caminhoA)).error;
  ok(aindaExiste, 'B NÃO apaga o exame de A');

  // Cota: completa 20 arquivos e tenta o 21º
  for (let i = 1; i < 20; i++) {
    await a.client.storage.from('exames').upload(`${a.id}/cota-${i}.pdf`, pdf, { contentType: 'application/pdf' });
  }
  r = await a.client.storage.from('exames').upload(`${a.id}/cota-21.pdf`, pdf, { contentType: 'application/pdf' });
  ok(!!r.error, 'Cota de 20 arquivos por paciente é respeitada');

  r = await a.client.storage.from('exames').remove([caminhoA]);
  ok(!r.error && r.data?.length === 1, 'A apaga o próprio exame');
} finally {
  for (const u of [a, b]) {
    const { data } = await admin.storage.from('exames').list(u.id, { limit: 100 });
    if (data?.length) await admin.storage.from('exames').remove(data.map(f => `${u.id}/${f.name}`));
    await admin.auth.admin.deleteUser(u.id);
  }
  console.log('Usuários e arquivos de teste removidos.');
}

if (falhas) { console.error(`\n${falhas} verificação(ões) falharam.`); process.exit(1); }
console.log('\nStorage OK');
