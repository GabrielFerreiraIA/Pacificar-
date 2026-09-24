// Aceite da T-60: sem aceitar o termo de consentimento, a paciente não entra no app.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/termo_e2e.mjs
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { termoVersao } from './_util.mjs';

const BASE = 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `teste.termo.${Date.now()}@example.com`;
const senha = randomBytes(8).toString('hex');
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { data: u, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
if (error) throw error;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true
});

async function entrar() {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('pacificar_tour_v1', 'done'));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', senha);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Entrar'))?.click());
  await page.waitForFunction(() => /Aceitar e começar|Hoje/.test(document.body.innerText), { timeout: 20000 });
  await sleep(1000);
  return page;
}
const botaoAceitar = page =>
  page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Aceitar e começar')));

try {
  let page = await entrar();
  const t = await page.evaluate(() => document.body.innerText);
  ok(t.includes('Aceitar e começar') && !(await page.$('nav')), 'Primeiro acesso mostra o termo, não o app');
  ok(await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Aceitar e começar'))?.disabled), 'Botão de aceite desativado sem marcar a autorização');

  await page.evaluate(() => [...document.querySelectorAll('summary')].find(s => s.innerText.includes('termo completo'))?.click());
  ok((await page.evaluate(() => document.body.innerText)).includes('Seus direitos'), 'Termo completo abre na mesma tela');

  await page.click('input[type=checkbox]');
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Aceitar e começar'))?.click());
  await page.waitForSelector('nav', { timeout: 15000 }).catch(() => {});
  ok(!!(await page.$('nav')), 'Depois do aceite, o app abre');

  const { data: rows } = await admin.from('consents').select('term_version, user_agent, accepted_at').eq('user_id', u.user.id);
  ok(rows?.length === 1 && rows[0].term_version === termoVersao() && rows[0].user_agent?.length > 0,
    `Aceite registrado no banco (versão ${rows?.[0]?.term_version})`);
  await page.browserContext().close();

  page = await entrar();
  ok(!!(await page.$('nav')) && !(await page.evaluate(() => document.body.innerText)).includes('Aceitar e começar'),
    'Novo login (outro aparelho) não pede o termo de novo');
  await page.browserContext().close();

  // Paciente não consegue apagar nem alterar o próprio aceite
  const cli = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await cli.auth.signInWithPassword({ email, password: senha });
  await cli.from('consents').delete().eq('user_id', u.user.id);
  const { count } = await admin.from('consents').select('user_id', { count: 'exact', head: true }).eq('user_id', u.user.id);
  ok(count === 1, 'Registro de aceite é imutável para a paciente');
} finally {
  await browser.close();
  await admin.auth.admin.deleteUser(u.user.id);
  console.log('Usuário de teste removido.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nTermo OK');
