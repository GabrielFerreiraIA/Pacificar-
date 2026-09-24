// Aceite da T-73: check-in feito sem internet sincroniza quando a conexão volta.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/offline_e2e.mjs
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { aceitarTermo } from './_util.mjs';

const BASE = 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `teste.offline.${Date.now()}@example.com`;
const senha = randomBytes(8).toString('hex');
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { data: u, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
if (error) throw error;
await aceitarTermo(admin, u.user.id);
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
const abrirAba = (page, nome) => clicar(page, nome, 'nav button');
const texto = page => page.evaluate(() => document.body.innerText);
const noBanco = async () => {
  const [c, p, z, pr] = await Promise.all([
    admin.from('checkins').select('day_number').eq('user_id', u.user.id),
    admin.from('preparo_checked').select('item_id').eq('user_id', u.user.id),
    admin.from('zeolite_days').select('day').eq('user_id', u.user.id),
    admin.from('profiles').select('current_day').eq('id', u.user.id).single()
  ]);
  return { checkins: c.data.length, preparo: p.data.length, zeolite: z.data.length, dia: pr.data.current_day };
};

try {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.evaluateOnNewDocument(() => localStorage.setItem('pacificar_tour_v1', 'done'));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', senha);
  await clicar(page, 'Entrar');
  await page.waitForSelector('nav', { timeout: 20000 });
  await sleep(4000); // carga inicial + service worker assumindo a página

  // ── Sem internet ──
  await page.setOfflineMode(true);
  await sleep(500);
  ok(/Sem conexão/.test(await texto(page)), 'Banner de sem conexão aparece');

  await clicar(page, 'Fazer check-in'); await sleep(1000);
  await clicar(page, 'Concluir check-in do dia 1'); await sleep(1500);
  await clicar(page, 'Voltar'); await sleep(800);
  await abrirAba(page, 'Preparo'); await sleep(1000);
  await page.evaluate(() => document.querySelector('main button[aria-pressed="false"]')?.click());
  await abrirAba(page, 'Protocolos'); await sleep(1000);
  await page.evaluate(() => document.querySelector('[aria-label="Dia 1, não registrado"]')?.click());
  await sleep(800);

  const fila = await page.evaluate(() => {
    const k = Object.keys(localStorage).find(x => x.startsWith('pacificar_fila_v1_'));
    return k ? JSON.parse(localStorage.getItem(k)).map(o => o.t) : [];
  });
  ok(['checkin', 'preparo', 'zeolite', 'profile'].every(t => fila.includes(t)), `Registros guardados na fila do aparelho (${fila.join(', ')})`);
  ok(/guardados neste aparelho/.test(await texto(page)), 'Banner avisa quantos registros aguardam');
  let banco = await noBanco();
  ok(banco.checkins === 0 && banco.preparo === 0 && banco.zeolite === 0, 'Nada chegou ao banco enquanto offline');

  // Recarregar sem internet: o PWA abre pelo service worker e a fila sobrevive
  await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
  const t0 = Date.now();
  await page.waitForFunction(() => /guardados neste aparelho/.test(document.body.innerText), { timeout: 15000 }).catch(() => {});
  const segundos = ((Date.now() - t0) / 1000).toFixed(1);
  const aposReload = await texto(page);
  ok(/Sem conexão/.test(aposReload) && /guardados neste aparelho/.test(aposReload), `Após recarregar offline, o app abre e a fila continua (em ${segundos}s)`);
  ok(Number(segundos) < 3, 'Abre offline em menos de 3 s (perfil guardado no aparelho)');

  // ── Internet de volta ──
  await page.setOfflineMode(false);
  let tentativas = 0;
  do { await sleep(1500); banco = await noBanco(); } while (++tentativas < 10 && (banco.checkins === 0 || banco.zeolite === 0));
  ok(banco.checkins === 1 && banco.preparo === 1 && banco.zeolite === 1, `Com a internet de volta, tudo subiu (${JSON.stringify(banco)})`);
  ok(banco.dia === 2, 'Dia liberado avançou no banco');
  await sleep(1500);
  const filaFinal = await page.evaluate(() => Object.keys(localStorage).filter(x => x.startsWith('pacificar_fila_v1_')).length);
  ok(filaFinal === 0, 'Fila do aparelho esvaziada');
  ok(!/guardados neste aparelho|Enviando/.test(await texto(page)), 'Banner some depois de enviar');
} finally {
  await browser.close();
  await admin.auth.admin.deleteUser(u.user.id);
  console.log('Usuário de teste removido.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nOffline OK');
