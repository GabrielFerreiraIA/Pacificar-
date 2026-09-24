// Aceite da T-57: painel da terapeuta com dados reais, e o efeito disso para a paciente.
// Uso: npm run build && npm run preview -- --port 4173  (em outro terminal)
//      node --env-file=.env.local supabase/tests/painel_e2e.mjs
import puppeteer from 'puppeteer-core';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const BASE = 'http://localhost:4173';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const ts = Date.now();
const contas = {
  ana: { email: `teste.ana.${ts}@example.com`, senha: randomBytes(8).toString('hex') },
  paciente: { email: `teste.joana.${ts}@example.com`, senha: randomBytes(8).toString('hex') }
};
const NOME = 'Joana Painel Teste';
const RECADO = 'Beba água morna ao acordar e caminhe 20 minutos.';
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) falhas++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Montagem ──
for (const c of Object.values(contas)) {
  const { data, error } = await admin.auth.admin.createUser({ email: c.email, password: c.senha, email_confirm: true });
  if (error) throw error;
  c.id = data.user.id;
}
const P = contas.paciente.id;
await admin.from('profiles').update({ role: 'admin', full_name: 'Ana Teste' }).eq('id', contas.ana.id);
await admin.from('profiles').update({ full_name: NOME, current_day: 4 }).eq('id', P);
await admin.from('anamneses').insert({ user_id: P, answers: { nome: NOME, ocupacao: 'Professora' }, completed: true });
await admin.from('checkins').insert({ user_id: P, day_number: 1, energy_rating: 3, sleep_quality: 4, bloating_level: 2, sweet_craving: 1, bristol_type: 4, diet_compliance: 'total', journal_notes: 'Dormi melhor hoje.' });
const exPath = `${P}/${ts}-hemograma.pdf`;
await admin.storage.from('exames').upload(exPath, new Blob(['%PDF-1.4\n%teste\n'], { type: 'application/pdf' }), { contentType: 'application/pdf' });
await admin.from('lab_exams').insert({ user_id: P, file_name: 'Hemograma setembro', storage_path: exPath, mime_type: 'application/pdf', category: 'Hemograma completo' });

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
const texto = page => page.evaluate(() => document.body.innerText);

async function entrar(conta) {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('pacificar_tour_v1', 'done'));
  page.on('dialog', d => d.accept());
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', conta.email);
  await page.type('input[type=password]', conta.senha);
  await clicar(page, 'Entrar');
  await page.waitForSelector('nav', { timeout: 20000 });
  await sleep(3000);
  return page;
}

try {
  // ── Ana ──
  const ana = await entrar(contas.ana);
  let t = await texto(ana);
  ok(t.includes(NOME), 'Painel lista a paciente real do banco');
  ok(!t.includes('Camila'), 'Sem pacientes fictícios no painel');
  ok(t.includes('Anamnese ok') && t.includes('1 exame · 1 a revisar'), 'Indicadores da paciente (anamnese ok, 1 exame a revisar)');
  ok(!!(await ana.$('[aria-label="Paciente em risco de abandono"]')), 'Alerta de risco (dia 4 com 1 check-in)');

  await clicar(ana, NOME); await sleep(2500);
  t = await texto(ana);
  ok(t.includes('Professora'), 'Prontuário mostra a anamnese da paciente');

  await clicar(ana, 'Check-ins', '[role=tab]'); await sleep(500);
  t = await texto(ana);
  ok(t.includes('Dia 1') && t.includes('Dormi melhor hoje.') && t.includes('Leve'), 'Aba Check-ins com o registro e o diário');

  await clicar(ana, 'Exames', '[role=tab]'); await sleep(500);
  const novaAba = new Promise(r => browser.once('targetcreated', r));
  await clicar(ana, 'Abrir laudo');
  const alvo = await novaAba; await sleep(2500);
  ok(/\/object\/sign\/exames\//.test(alvo.url()), 'Terapeuta abre o laudo da paciente por link assinado');
  await (await alvo.page())?.close();
  await ana.bringToFront();
  await clicar(ana, 'Marcar como revisado'); await sleep(2000);
  const { data: ex } = await admin.from('lab_exams').select('therapist_reviewed').eq('user_id', P).single();
  ok(ex.therapist_reviewed === true, 'Exame marcado como revisado no banco');

  await clicar(ana, 'Prescrição', '[role=tab]'); await sleep(500);
  await ana.type('#patient-weight', '72');
  await ana.select('#dosha', 'Pitta');
  await ana.click('#therapist-notes', { clickCount: 3 });
  await ana.type('#therapist-notes', RECADO);
  await clicar(ana, 'Salvar prescrição'); await sleep(2500);
  const [{ data: pr }, { data: pf }] = await Promise.all([
    admin.from('prescriptions').select('dosha_predominant, therapist_notes, created_by').eq('user_id', P).single(),
    admin.from('profiles').select('weight').eq('id', P).single()
  ]);
  ok(pr?.dosha_predominant === 'Pitta' && pr.therapist_notes === RECADO && pr.created_by === contas.ana.id, 'Prescrição salva no banco, assinada pela terapeuta');
  ok(Number(pf?.weight) === 72, 'Peso da paciente salvo (72 kg)');

  await clicar(ana, 'Suspender acesso'); await sleep(2000);
  let { data: st } = await admin.from('profiles').select('access_status').eq('id', P).single();
  ok(st.access_status === 'revoked' && (await texto(ana)).includes('Acesso suspenso'), 'Suspender acesso funciona e aparece na lista');
  await clicar(ana, 'Reativar acesso'); await sleep(2000);
  ({ data: st } = await admin.from('profiles').select('access_status').eq('id', P).single());
  ok(st.access_status === 'active', 'Reativar acesso funciona');
  await ana.browserContext().close();

  // ── Paciente ──
  const pac = await entrar(contas.paciente);
  await clicar(pac, 'Protocolos', 'nav button'); await sleep(1200);
  await clicar(pac, 'Desparasitação'); await sleep(800);
  t = await texto(pac);
  ok(t.includes('Peso registrado: 72 kg') && t.includes('18 mg'), 'Paciente vê a dose pela faixa do peso informado pela Ana (60–80 kg → 18 mg)');
  await pac.evaluate(() => document.querySelector('header [aria-haspopup=menu]').click());
  await clicar(pac, 'Meu perfil'); await sleep(1500);
  t = await texto(pac);
  ok(t.includes(RECADO) && t.includes('Pitta'), 'Paciente vê a prescrição e o recado da Ana no perfil');
} finally {
  await browser.close();
  await admin.storage.from('exames').remove([exPath]);
  for (const c of Object.values(contas)) if (c.id) await admin.auth.admin.deleteUser(c.id);
  console.log('Contas e arquivos de teste removidos.');
}
if (falhas) { console.log(`\n${falhas} falha(s)`); process.exit(1); }
console.log('\nPainel OK');
