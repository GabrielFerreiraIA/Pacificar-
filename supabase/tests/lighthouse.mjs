// Lighthouse (mobile, CPU 4x mais lenta) na tela de login e na Home logada (T-75). Meta: >= 90.
// Uso: npm i --no-save lighthouse@12   (pesado; não fica no package.json)
//      npm run build && npm run preview -- --port 4173   (em outro terminal)
//      node --env-file=.env.local supabase/tests/lighthouse.mjs
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { termoVersao } from './_util.mjs';
const BASE = process.env.BASE ?? 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `teste.lh.${Date.now()}@example.com`, senha = randomBytes(8).toString('hex');
const { data: u } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
await admin.from('consents').insert({ user_id: u.user.id, term_version: termoVersao() });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const cats = ['performance', 'accessibility', 'best-practices'];
const resumo = r => Object.fromEntries(cats.map(c => [c, Math.round(r.lhr.categories[c].score * 100)]));
const falhas = r => Object.values(r.lhr.audits).filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual').map(a => `${a.id} (${a.score}) ${a.displayValue ?? ''}`);
try {
  const page = await browser.newPage();
  const r1 = await lighthouse(BASE + '/', { onlyCategories: cats, output: 'json', logLevel: 'error' }, undefined, page);
  console.log('LOGIN', JSON.stringify(resumo(r1)));
  falhas(r1).forEach(f => console.log('   -', f));
  // Login e Home
  await page.evaluate(() => localStorage.setItem('pacificar_tour_v1', 'done'));
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', email); await page.type('input[type=password]', senha);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Entrar')).click());
  await page.waitForSelector('nav', { timeout: 20000 });
  const r2 = await lighthouse(BASE + '/', { onlyCategories: cats, output: 'json', logLevel: 'error', disableStorageReset: true }, undefined, page);
  console.log('HOME', JSON.stringify(resumo(r2)));
  falhas(r2).forEach(f => console.log('   -', f));
} finally { await browser.close(); await admin.auth.admin.deleteUser(u.user.id); }
