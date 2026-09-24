// E2E do upload de exames (T-50) contra o build e o Supabase real.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/exames_e2e.mjs
// Gera no navegador uma foto "de celular" pesada (4000×3000) e um PDF, envia, abre e apaga.
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const BASE = 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `teste.exames.${Date.now()}@example.com`;
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
const clicar = (page, texto) =>
  page.evaluate(t => {
    const b = [...document.querySelectorAll('button')].find(el => el.innerText.includes(t) && !el.disabled);
    b?.click();
    return !!b;
  }, texto);

/** Coloca um arquivo gerado no navegador no <input type=file>. tipo: 'foto' | 'pdf' */
const escolherArquivo = (page, tipo) =>
  page.evaluate(async tipo => {
    let file;
    if (tipo === 'foto') {
      const c = document.createElement('canvas');
      c.width = 4000; c.height = 3000;
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(c.width, c.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 200 + Math.random() * 55;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = '#222'; ctx.font = '48px sans-serif';
      for (let y = 200; y < 3000; y += 90) ctx.fillText('Hemoglobina 13,5 g/dL   Ferritina 42 ng/mL', 200, y);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.95));
      file = new File([blob], 'IMG_2026_laudo.jpg', { type: 'image/jpeg' });
    } else {
      file = new File(['%PDF-1.4\n%teste\n'], 'hemograma_outubro.pdf', { type: 'application/pdf' });
    }
    const input = document.querySelector('#exam-file');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return file.size;
  }, tipo);

const esperarTexto = (page, re, timeout = 60000) =>
  page.waitForFunction(r => new RegExp(r).test(document.body.innerText), { timeout }, re.source).then(() => true, () => false);

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
  await sleep(2000);

  // Perfil → Exames de sangue
  await page.evaluate(() => document.querySelector('header [aria-haspopup=menu]').click());
  await clicar(page, 'Meu perfil'); await sleep(1200);
  await clicar(page, 'Exames de sangue'); await sleep(1200);
  ok(!!(await page.$('#exam-file')), 'Tela de exames aberta');

  // ── Foto pesada ──
  const tamFoto = await escolherArquivo(page, 'foto');
  await sleep(500);
  ok((await page.$eval('#exam-name', el => el.value)) === 'IMG 2026 laudo', 'Nome sugerido a partir do arquivo');
  await clicar(page, 'Anexar exame');
  ok(await esperarTexto(page, /Exame enviado para a Ana/), 'Foto enviada');
  const txt = await page.evaluate(() => document.body.innerText);
  ok(/otimizado de/.test(txt), `Mensagem mostra a economia (${txt.match(/otimizado de [^\n]+/)?.[0] ?? '—'})`);

  let { data: rows } = await admin.from('lab_exams').select('*').eq('user_id', u.user.id);
  const foto = rows?.[0];
  ok(foto && foto.size_bytes < tamFoto / 3, `Foto comprimida: ${(tamFoto / 1024 / 1024).toFixed(1)} MB → ${Math.round(foto?.size_bytes / 1024)} KB`);
  ok(foto?.mime_type === 'image/webp' && foto.storage_path.startsWith(`${u.user.id}/`), `Salva como ${foto?.mime_type} na pasta da paciente`);

  // ── PDF ──
  await escolherArquivo(page, 'pdf');
  await sleep(300);
  await clicar(page, 'Anexar exame');
  ok(await esperarTexto(page, /Exame enviado para a Ana(?! ·)/), 'PDF enviado sem alteração');
  ({ data: rows } = await admin.from('lab_exams').select('*').eq('user_id', u.user.id));
  ok(rows?.length === 2 && rows.some(r => r.mime_type === 'application/pdf'), 'Dois exames registrados no banco');
  ok((await page.evaluate(() => document.body.innerText)).includes('2 de 20'), 'Cota visível (2 de 20)');

  // ── Ver (link assinado) ──
  const novaAba = new Promise(r => browser.once('targetcreated', t => r(t)));
  await page.evaluate(() => document.querySelector('[aria-label^="Ver "]')?.click());
  const alvo = await novaAba;
  await sleep(2500);
  ok(/\/storage\/v1\/object\/sign\/exames\//.test(alvo.url()), 'Ver abre link assinado do bucket privado');

  // ── Apagar ──
  page.on('dialog', d => d.accept());
  await page.evaluate(() => document.querySelector('[aria-label^="Apagar "]')?.click());
  await sleep(2500);
  ({ data: rows } = await admin.from('lab_exams').select('storage_path').eq('user_id', u.user.id));
  const { data: objs } = await admin.storage.from('exames').list(u.user.id);
  ok(rows?.length === 1 && objs?.length === 1, `Apagar remove registro e arquivo (restam ${rows?.length} e ${objs?.length})`);
} finally {
  await browser.close();
  const { data: objs } = await admin.storage.from('exames').list(u.user.id);
  if (objs?.length) await admin.storage.from('exames').remove(objs.map(o => `${u.user.id}/${o.name}`));
  await admin.auth.admin.deleteUser(u.user.id);
  console.log('Usuário e arquivos de teste removidos.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nExames OK');
