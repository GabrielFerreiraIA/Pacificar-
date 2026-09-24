// Aceite da T-14: preencher a anamnese no celular e ver as respostas no notebook com o mesmo login.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/sync_e2e.mjs
// Cria um usuário temporário e apaga tudo no fim (cascade nas tabelas do paciente).
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { aceitarTermo } from './_util.mjs';

const BASE = 'http://localhost:4173';
const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: secret } = process.env;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const email = `teste.sync.${Date.now()}@example.com`;
const senha = randomBytes(8).toString('hex');
const NOME = 'Maria Sincronia Teste';
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

async function entrar(viewport) {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport(viewport);
  // O tour de primeiro acesso prende o foco; aqui ele já foi visto
  await page.evaluateOnNewDocument(() => localStorage.setItem('pacificar_tour_v1', 'done'));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', email);
  await page.type('input[type=password]', senha);
  await clicar(page, 'Entrar');
  await page.waitForSelector('nav', { timeout: 20000 });
  await sleep(2500); // carga inicial do servidor
  return page;
}
const clicar = (page, texto) =>
  page.evaluate(t => {
    const b = [...document.querySelectorAll('button')].find(el => el.innerText.includes(t));
    b?.click();
    return !!b;
  }, texto);
const abrirAba = (page, nome) =>
  page.evaluate(n => [...document.querySelectorAll('nav button')].find(b => b.innerText.includes(n))?.click(), nome);

async function abrirAnamnese(page) {
  await abrirAba(page, 'Anamnese');
  await sleep(1500);
  await clicar(page, 'Iniciar minha anamnese');
  await sleep(800);
  (await clicar(page, 'Continuar de onde parei')) || (await clicar(page, 'Começar anamnese'));
  await sleep(1000);
}

try {
  // ── Celular ──
  const celular = await entrar({ width: 390, height: 844, isMobile: true });
  ok((await celular.evaluate(() => document.body.innerText)).includes('Dia'), 'Paciente nova entra na Home');

  await abrirAnamnese(celular);
  const campo = await celular.$('main input[type=text]');
  ok(!!campo, 'Primeira pergunta da anamnese aberta');
  await campo.type(NOME);
  await sleep(2000); // debounce do auto-save

  const { data: anam } = await admin.from('anamneses').select('answers, completed').eq('user_id', u.user.id).single();
  ok(anam?.answers?.nome === NOME, `Resposta gravada no banco (answers.nome = "${anam?.answers?.nome}")`);

  const { data: ciclos } = await admin
    .from('parasite_cycles').select('cycle_number, moon_date').eq('user_id', u.user.id).order('cycle_number');
  ok(ciclos?.length === 5 && ciclos.every((c, i) => i === 0 || c.moon_date > ciclos[i - 1].moon_date),
    `5 ciclos lunares criados no primeiro acesso (${ciclos?.map(c => c.moon_date).join(', ')})`);

  await abrirAba(celular, 'Protocolos'); await sleep(1200);
  await clicar(celular, 'Desparasitação'); await sleep(800);
  const prot = await celular.evaluate(() => document.body.innerText);
  ok(prot.includes('Peso ainda não informado') && !prot.includes('Peso registrado: 68'),
    'Sem peso cadastrado, a dose não usa peso fictício');
  ok(prot.includes(new Date(ciclos[0].moon_date + 'T12:00:00').getDate() + ' de'), 'Protocolos mostra as luas do banco');

  // Zeólita: marca o dia 1
  await clicar(celular, 'Zeólita'); await sleep(800);
  await celular.evaluate(() => document.querySelector('[aria-label="Dia 1, não registrado"]')?.click());
  // Preparo: marca o primeiro item
  await abrirAba(celular, 'Preparo'); await sleep(1200);
  const itemPreparo = await celular.evaluate(() => {
    const b = document.querySelector('main button[aria-pressed="false"]');
    b?.click();
    return b?.innerText.split('\n')[0] ?? '';
  });
  // Check-in do dia 1 com os valores padrão
  await abrirAba(celular, 'Hoje'); await sleep(1200);
  await celular.evaluate(() => [...document.querySelectorAll('main button')].find(b => b.innerText.includes('Fazer check-in'))?.click());
  await sleep(1200);
  await clicar(celular, 'Concluir check-in do dia 1');
  await sleep(2500);

  const [zeo, prep, chk, perfil] = await Promise.all([
    admin.from('zeolite_days').select('day').eq('user_id', u.user.id),
    admin.from('preparo_checked').select('item_id').eq('user_id', u.user.id),
    admin.from('checkins').select('day_number, energy_rating, bristol_type').eq('user_id', u.user.id),
    admin.from('profiles').select('current_day').eq('id', u.user.id).single()
  ]);
  ok(zeo.data?.some(z => z.day === 1), 'Dia de zeólita gravado no banco');
  ok(prep.data?.length === 1, `Item do Preparo gravado no banco ("${itemPreparo}")`);
  ok(chk.data?.length === 1 && chk.data[0].day_number === 1 && chk.data[0].energy_rating > 0, 'Check-in do dia 1 gravado no banco');
  ok(perfil.data?.current_day === 2, `Dia liberado avançou para 2 (current_day = ${perfil.data?.current_day})`);
  await celular.browserContext().close();

  // ── Notebook, mesmo login ──
  const notebook = await entrar({ width: 1280, height: 800 });
  await abrirAnamnese(notebook);
  const valor = await notebook.$eval('main input[type=text]', el => el.value).catch(() => '');
  ok(valor === NOME, `Notebook vê a resposta dada no celular ("${valor}")`);

  // Nenhum dado fictício da demo com login real
  const home = await (async () => { await abrirAba(notebook, 'Hoje'); await sleep(1000); return notebook.evaluate(() => document.body.innerText); })();
  ok(!home.includes('Camila'), 'Sem a paciente fictícia "Camila" com login real');
  ok(home.includes('Revisar check-in do dia 1') || home.includes('1 de 21'), 'Notebook vê o check-in feito no celular');

  await abrirAba(notebook, 'Preparo'); await sleep(1200);
  const marcados = await notebook.evaluate(() => document.querySelectorAll('main button[aria-pressed="true"]').length);
  ok(marcados === 1, `Notebook vê o item do Preparo marcado no celular (${marcados})`);
  await notebook.browserContext().close();
} finally {
  await browser.close();
  await admin.auth.admin.deleteUser(u.user.id);
  const { count } = await admin.from('anamneses').select('user_id', { count: 'exact', head: true }).eq('user_id', u.user.id);
  console.log(`Usuário de teste removido (anamnese restante: ${count}).`);
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nSincronização OK');
