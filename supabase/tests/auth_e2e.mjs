// E2E das telas de acesso (T-21) contra o preview do build e o Supabase real.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/auth_e2e.mjs
// Cria um usuário temporário, testa login/sair/recuperação e apaga o usuário no fim.
// CHROME_PATH aponta para o Chrome instalado (padrão: Windows).
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const BASE = 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `teste.e2e.${Date.now()}@example.com`;
const p1 = randomBytes(8).toString('hex'), p2 = randomBytes(8).toString('hex');
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { data: u, error } = await admin.auth.admin.createUser({ email, password: p1, email_confirm: true });
if (error) throw error;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true });
  const texto = () => page.evaluate(() => document.body.innerText);
  const clicarTexto = t => page.evaluate(t => [...document.querySelectorAll('button')].find(b => b.innerText.includes(t))?.click(), t);

  await page.goto(BASE, { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => document.body.innerText.includes('Entrar'), { timeout: 20000 });
  ok((await texto()).includes('Entrar na sua jornada'), 'Sem sessão abre a tela de login');
  ok(!(await texto()).includes('modo demonstração'), 'Build de produção não oferece modo demonstração');

  await page.type('input[type=email]', email);
  await page.type('input[type=password]', 'senha-errada-123');
  await clicarTexto('Entrar'); await sleep(2500);
  ok((await texto()).includes('E-mail ou senha não conferem'), 'Senha errada mostra erro em português');

  await page.$eval('input[type=password]', el => { el.value = ''; });
  await page.click('input[type=password]', { clickCount: 3 });
  await page.type('input[type=password]', p1);
  await clicarTexto('Entrar'); await sleep(3000);
  ok(!!(await page.$('nav')), 'Senha certa entra no app');

  await page.evaluate(() => localStorage.setItem('pacificar_teste', '1'));
  await page.evaluate(() => document.querySelector('header [aria-haspopup=menu]').click()); await sleep(400);
  ok((await texto()).includes(email), 'Menu mostra o e-mail da conta');
  await clicarTexto('Sair da conta'); await sleep(1500);
  ok((await texto()).includes('Entrar na sua jornada'), 'Sair volta para o login');
  const sobrou = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('pacificar_') || k.startsWith('sb-')));
  ok(sobrou.length === 0, `Sair limpa cache local e sessão (restou: ${sobrou.join(',') || 'nada'})`);

  await clicarTexto('Esqueci minha senha'); await sleep(300);
  ok((await texto()).includes('Enviar link'), 'Tela de esqueci a senha');

  // Link de recuperação gerado pelo admin (não envia e-mail)
  const { data: link, error: e2 } = await admin.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: `${BASE}/definir-senha` } });
  if (e2) throw e2;
  const page2 = await (await browser.createBrowserContext()).newPage();
  await page2.setViewport({ width: 390, height: 844, isMobile: true });
  await page2.goto(link.properties.action_link, { waitUntil: 'domcontentloaded' }); await page2.waitForFunction(() => /Crie sua senha|link/i.test(document.body.innerText), { timeout: 20000 }).catch(() => {}); await sleep(800);
  const t2 = await page2.evaluate(() => document.body.innerText);
  ok(t2.includes('Crie sua senha') && t2.includes(email), `Link de recuperação abre "Crie sua senha" (${new URL(page2.url()).pathname})`);
  const campos = await page2.$$('input[type=password]');
  await campos[0].type('curta'); await campos[1].type('curta');
  await page2.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Salvar senha'))?.click()); await sleep(500);
  ok((await page2.evaluate(() => document.body.innerText)).includes('pelo menos 8 caracteres'), 'Senha curta é recusada');
  for (const c of campos) { await c.click({ clickCount: 3 }); await c.press('Backspace'); await c.type(p2); }
  await page2.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Salvar senha'))?.click()); await sleep(3000);
  ok(!!(await page2.$('nav')) && new URL(page2.url()).pathname === '/' && !page2.url().includes('access_token'), 'Nova senha salva entra no app e limpa o token da URL');

  const anon = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  ok(!(await anon.auth.signInWithPassword({ email, password: p2 })).error, 'Nova senha funciona no login');
  ok(!!(await anon.auth.signInWithPassword({ email, password: p1 })).error, 'Senha antiga deixou de funcionar');

  const page3 = await (await browser.createBrowserContext()).newPage();
  await page3.setViewport({ width: 390, height: 844, isMobile: true });
  await page3.goto(link.properties.action_link, { waitUntil: 'domcontentloaded' }); await page3.waitForFunction(() => /link|senha/i.test(document.body.innerText), { timeout: 20000 }).catch(() => {}); await sleep(800);
  const t3 = await page3.evaluate(() => document.body.innerText);
  ok(t3.includes('Este link expirou') || t3.includes('Este link não vale mais'), 'Link reaproveitado mostra aviso e pede um novo');
} finally {
  await browser.close();
  await admin.auth.admin.deleteUser(u.user.id);
  console.log('Usuário de teste removido.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nAuth E2E OK');
