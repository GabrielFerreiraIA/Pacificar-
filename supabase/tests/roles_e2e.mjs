// E2E de papéis (T-22): paciente não chega ao painel da terapeuta de nenhum jeito.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/roles_e2e.mjs
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const BASE = 'http://localhost:4173';
const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: secret, VITE_SUPABASE_ANON_KEY: pub } = process.env;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const email = `teste.papel.${Date.now()}@example.com`;
const senha = randomBytes(8).toString('hex');
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };

const { data: u, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
if (error) throw error;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true
});

async function entrar() {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', senha);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Entrar'))?.click());
  await page.waitForSelector('nav', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));
  return page;
}
const navTexto = page => page.evaluate(() => document.querySelector('nav').innerText);

try {
  // ── Paciente ──
  let page = await entrar();
  ok(!(await navTexto(page)).includes('Clínica'), 'Paciente não vê a aba Clínica');
  await page.evaluate(() => document.querySelector('header [aria-haspopup=menu]').click());
  const menu = await page.evaluate(() => document.querySelector('[role=menu]')?.innerText ?? '');
  ok(!menu.includes('demonstração') && !menu.includes('Painel da terapeuta'), 'Menu sem troca de papel em produção');
  ok(!(await page.evaluate(() => document.body.innerText)).includes('Seus pacientes'), 'Painel não renderiza');

  // Pela API, com o token da própria paciente
  const cli = createClient(url, pub, { auth: { persistSession: false } });
  await cli.auth.signInWithPassword({ email, password: senha });
  const up = await cli.from('profiles').update({ role: 'admin' }).eq('id', u.user.id);
  ok(!!up.error, `Paciente não se promove pela API (${up.error?.message ?? 'passou!'})`);
  const { data: vistos } = await cli.from('profiles').select('id');
  ok(vistos?.length === 1, 'Paciente só enxerga o próprio perfil');
  await page.browserContext().close();

  // ── Mesma conta promovida pela service role ──
  await admin.from('profiles').update({ role: 'admin' }).eq('id', u.user.id);
  page = await entrar();
  ok((await navTexto(page)).includes('Clínica'), 'Terapeuta (role do banco) vê a aba Clínica');
  ok((await page.evaluate(() => document.body.innerText)).includes('Seus pacientes'), 'Terapeuta abre direto no painel');
  await page.browserContext().close();

  // ── Acesso suspenso (T-23): reembolso/chargeback ──
  await admin.from('profiles').update({ role: 'patient', access_status: 'revoked' }).eq('id', u.user.id);
  page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', senha);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Entrar'))?.click());
  await page.waitForFunction(() => /pausad/i.test(document.body.innerText), { timeout: 20000 }).catch(() => {});
  const t = await page.evaluate(() => document.body.innerText);
  ok(t.includes('jornada está pausada'), 'Suspenso vê a tela de acesso pausado');
  ok(!(await page.$('nav')), 'Suspenso não vê o app');
  const href = await page.evaluate(() => document.querySelector('a[href*="wa.me"]')?.getAttribute('href') ?? '');
  ok(href.includes('wa.me') && decodeURIComponent(href).includes(email), 'Botão de WhatsApp com a mensagem e o e-mail');
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Sair'))?.click());
  await page.waitForSelector('input[type=email]', { timeout: 10000 }).catch(() => {});
  ok(!!(await page.$('input[type=email]')), 'Suspenso consegue sair');
  await page.browserContext().close();

  await admin.from('profiles').update({ access_status: 'active' }).eq('id', u.user.id);
  page = await entrar();
  ok(!!(await page.$('nav')), 'Reativado volta a entrar no app');
} finally {
  await browser.close();
  await admin.auth.admin.deleteUser(u.user.id);
  console.log('Usuário de teste removido.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nPapéis OK');
