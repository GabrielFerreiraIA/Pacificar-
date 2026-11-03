// Importa imagens soltas (qualquer nome) e organiza nas pastas certas de imagens-origem/.
//   uso: npm run imagens:importar -- "public/+Imagens"      (pasta de entrada; padrão: imagens-origem/_entrada)
// O arquivo é reconhecido pelo nome (sem acento, sem maiúscula). Exemplos que casam:
//   "Raspador de lingua.png" → preparo/raspador      "climas.png" → folha clima
//   "sabor-doce · Doce.png"  → anamnese/sabor-doce   "exercicios.png" → folha exercicio
// Os arquivos são MOVIDOS (a pasta de entrada fica vazia). Folhas vão para _folhas/ e são cortadas por
// `npm run imagens:folhas`; o resto é otimizado por `npm run imagens:app`.
import fs from 'node:fs';
import path from 'node:path';

const ENTRADA = process.argv[2] ?? 'imagens-origem/_entrada';
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// [id, pasta, [apelidos]] — o apelido mais longo que aparecer no nome vence.
const ALVOS = [
  ['raspador', 'preparo', ['raspador']],
  ['zeolita', 'preparo', ['zeolita']],
  ['desparasitacao', 'preparo', ['desparasitacao', 'kit de desparasit']],
  ['massalas', 'preparo', ['massalas']],
  ['gorduras', 'preparo', ['gorduras', 'ghee']],
  ['ricino', 'preparo', ['ricino']],
  ['chas', 'preparo', ['chas']],
  ...['doce', 'salgado', 'acido', 'picante', 'amargo', 'adstringente'].map((s) => [`sabor-${s}`, 'anamnese', [`sabor-${s}`]]),
  ...['frio', 'quente', 'seco', 'chuvoso'].map((s) => [`clima-${s}`, 'anamnese', [`clima-${s}`]]),
  ...['seca', 'oleosa', 'normal', 'mista'].map((s) => [`pele-${s}`, 'anamnese', [`pele-${s}`]]),
  ...['suave', 'moderado', 'vigoroso'].map((s) => [`exercicio-${s}`, 'anamnese', [`exercicio-${s}`]]),
  ...['vata', 'pitta', 'kapha'].map((s) => [`dosha-${s}`, 'doshas', [`dosha-${s}`]])
];
// folhas (grade 2x2): [folha, pasta, [apelidos]]
const FOLHAS = [
  ['clima', 'anamnese', ['clima']],
  ['pele', 'anamnese', ['pele']],
  ['exercicio', 'anamnese', ['exercicio']],
  ['doshas', 'doshas', ['doshas']]
];

if (!fs.existsSync(ENTRADA)) {
  console.error(`Pasta de entrada não encontrada: ${ENTRADA}`);
  process.exit(1);
}

const melhor = (nome, lista) => {
  let achou = null;
  for (const [id, pasta, apelidos] of lista) {
    for (const a of apelidos) if (nome.includes(a) && (!achou || a.length > achou.tam)) achou = { id, pasta, tam: a.length };
  }
  return achou;
};

let movidos = 0;
const semMatch = [];
for (const e of fs.readdirSync(ENTRADA, { withFileTypes: true })) {
  if (!e.isFile() || !/\.(png|jpe?g|webp)$/i.test(e.name)) continue;
  const origem = path.join(ENTRADA, e.name);
  const ext = path.extname(e.name).toLowerCase().replace('jpeg', 'jpg');
  const nome = norm(e.name);
  // ids individuais primeiro (mais específicos); depois as folhas
  const ind = melhor(nome, ALVOS);
  const folha = melhor(nome, FOLHAS);
  let destino;
  if (ind && (!folha || ind.tam >= folha.tam + 4)) destino = path.join('imagens-origem', ind.pasta, `${ind.id}${ext}`);
  else if (folha) destino = path.join('imagens-origem', folha.pasta, '_folhas', `${folha.id}${ext}`);
  else {
    semMatch.push(e.name);
    continue;
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(origem, destino);
  fs.unlinkSync(origem);
  console.log(`✓ ${e.name}  →  ${destino.replace(/\\/g, '/')}`);
  movidos++;
}
for (const n of semMatch) console.log(`? ${n}  (nome não reconhecido; renomeie com o id, ex.: raspador.png)`);
console.log(`${movidos} arquivo(s) organizados.`);
try {
  if (fs.readdirSync(ENTRADA).length === 0 && ENTRADA !== 'imagens-origem/_entrada') fs.rmdirSync(ENTRADA);
} catch {}
