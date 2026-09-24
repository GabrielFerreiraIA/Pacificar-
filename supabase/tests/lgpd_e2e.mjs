// Aceite da T-63: exportar meus dados (JSON) e pedir exclusão da conta.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/lgpd_e2e.mjs
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { aceitarTermo } from './_util.mjs';

const BASE = 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const ts = Date.now();
const contas = {
  paciente: { email: `teste.lgpd.${ts}@example.com`, senha: randomBytes(8).toString('hex') },
  ana: { email: `teste.ana.lgpd.${ts}@example.com`, senha: randomBytes(8).toString('hex') }
};
const MOTIVO = 'Terminei a jornada, obrigada!';
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'pacificar-lgpd-'));

for (const c of Object.values(contas)) {
  const { data, error } = await admin.auth.admin.createUser({ email: c.email, password: c.senha, email_confirm: true });
  if (error) throw error;
  c.id = data.user.id;
  await aceitarTermo(admin, c.id);
}
const P = contas.paciente.id;
await admin.from('profiles').update({ role: 'admin' }).eq('id', contas.ana.id);
await admin.from('profiles').update({ full_name: 'Lia Teste LGPD' }).eq('id', P);
await admin.from('anamneses').insert({ user_id: P, answers: { nome: 'Lia Teste LGPD' } });
await admin.from('checkins').insert({ user_id: P, day_number: 1, energy_rating: 4, journal_notes: 'nota do diário' });
const exPath = `${P}/${ts}-exame.pdf`;
await admin.storage.from('exames').upload(exPath, new Blob(['%PDF-1.4\n%lgpd\n'], { type: 'application/pdf' }), { contentType: 'application/pdf' });
await admin.from('lab_exams').insert({ user_id: P, file_name: 'Exame LGPD', storage_path: exPath, mime_type: 'application/pdf' });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true
});
const clicar = (page, texto, sel = 'button') =>
  page.evaluate((t, s) => {
    const b = [...document.querySelectorAll(s)].find(el => el.innerText.includes(t) && !el.disabled);
    b?.click();
    return !!b;
  }, texto, sel);

async function entrar(conta, viewport = { width: 390, height: 844, isMobile: true }) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(() => localStorage.setItem('pacificar_tour_v1', 'done'));
  page.on('dialog', d => d.accept());
  const cdp = await page.createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: pasta, browserContextId: ctx.id });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', conta.email);
  await page.type('input[type=password]', conta.senha);
  await clicar(page, 'Entrar');
  await page.waitForSelector('nav', { timeout: 20000 });
  await sleep(2500);
  return page;
}

try {
  // ── Paciente ──
  const pac = await entrar(contas.paciente);
  await pac.evaluate(() => document.querySelector('header [aria-haspopup=menu]').click());
  await clicar(pac, 'Meu perfil'); await sleep(1500);
  ok((await pac.evaluate(() => document.body.innerText)).includes('Baixar meus dados'), 'Perfil mostra a seção Seus dados');
  ok(!(await pac.evaluate(() => document.body.innerText)).includes('Restaurar dados iniciais'), 'Reset de demonstração não aparece com login real');

  await clicar(pac, 'Baixar meus dados');
  let arquivo = null;
  for (let i = 0; i < 20 && !arquivo; i++) {
    await sleep(500);
    arquivo = fs.readdirSync(pasta).find(f => f.startsWith('pacificar-meus-dados-') && f.endsWith('.json'));
  }
  ok(!!arquivo, `Arquivo baixado (${arquivo ?? 'nenhum'})`);
  const dados = arquivo ? JSON.parse(fs.readFileSync(path.join(pasta, arquivo), 'utf8')) : {};
  ok(dados.anamnese?.answers?.nome === 'Lia Teste LGPD' && dados.checkins?.[0]?.journal_notes === 'nota do diário',
    'Cópia traz anamnese e check-ins');
  ok(dados.consentimentos?.length === 1 && dados.perfil?.id === P, 'Cópia traz perfil e aceite do termo');
  const link = dados.exames?.[0]?.link_para_baixar;
  ok(!!link && (await fetch(link)).ok, 'Cópia traz link que baixa o exame');

  await clicar(pac, 'Pedir exclusão da conta'); await sleep(400);
  await pac.type('textarea', MOTIVO);
  await clicar(pac, 'Enviar pedido de exclusão'); await sleep(2500);
  ok((await pac.evaluate(() => document.body.innerText)).includes('Pedido de exclusão enviado'), 'Paciente vê o pedido enviado');
  let { data: pedidos } = await admin.from('deletion_requests').select('status, reason').eq('user_id', P);
  ok(pedidos?.length === 1 && pedidos[0].status === 'pending' && pedidos[0].reason === MOTIVO, 'Pedido registrado no banco (em aberto, com o motivo)');
  const { count: perfis } = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('id', P);
  ok(perfis === 1, 'Nada foi apagado na hora');
  await pac.browserContext().close();

  // Pela API: não duplica e a paciente não consegue "concluir" o próprio pedido
  const cli = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await cli.auth.signInWithPassword({ email: contas.paciente.email, password: contas.paciente.senha });
  const dup = await cli.from('deletion_requests').insert({ user_id: P });
  ok(!!dup.error, 'Segundo pedido em aberto é recusado');
  await cli.from('deletion_requests').update({ status: 'done' }).eq('user_id', P);
  ({ data: pedidos } = await admin.from('deletion_requests').select('status').eq('user_id', P));
  ok(pedidos?.every(p => p.status === 'pending'), 'Paciente não altera o status do próprio pedido');

  // ── Ana ──
  const ana = await entrar(contas.ana, { width: 1280, height: 900 });
  ok((await ana.evaluate(() => document.body.innerText)).includes('Pediu exclusão'), 'Painel mostra o selo "Pediu exclusão"');
  await clicar(ana, 'Lia Teste LGPD'); await sleep(2000);
  ok((await ana.evaluate(() => document.body.innerText)).includes(MOTIVO), 'Prontuário mostra o pedido e o motivo');
} finally {
  await browser.close();
  await admin.storage.from('exames').remove([exPath]);
  for (const c of Object.values(contas)) if (c.id) await admin.auth.admin.deleteUser(c.id);
  fs.rmSync(pasta, { recursive: true, force: true });
  console.log('Contas, arquivos e download de teste removidos.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nLGPD OK');
