// Converte as imagens de imagens-origem/{preparo,anamnese,doshas} em WebP leve para o app.
//   preparo  (fotos 4:3)  → public/preparo/<id>.webp   800 px de largura
//   anamnese (ícones 1:1) → public/anamnese/<id>.webp  384 px
//   doshas   (emblemas)   → public/doshas/<id>.webp    512 px
// As folhas (_folhas/) são ignoradas aqui: passam antes por `npm run imagens:folhas`.
// Uso: npm run imagens:app
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const GRUPOS = [
  { pasta: 'preparo', largura: 800, qualidade: 78 },
  { pasta: 'anamnese', largura: 384, qualidade: 82 },
  { pasta: 'doshas', largura: 512, qualidade: 82 }
];

let antes = 0;
let depois = 0;
let n = 0;
for (const g of GRUPOS) {
  const dir = path.join('imagens-origem', g.pasta);
  if (!fs.existsSync(dir)) continue;
  const saida = path.join('public', g.pasta);
  fs.mkdirSync(saida, { recursive: true });
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isFile() || !/\.(png|jpe?g|webp)$/i.test(e.name)) continue;
    const origem = path.join(dir, e.name);
    const id = e.name.replace(/\.\w+$/, '');
    const dest = path.join(saida, `${id}.webp`);
    await sharp(origem).rotate().resize({ width: g.largura, withoutEnlargement: true }).webp({ quality: g.qualidade }).toFile(dest);
    antes += fs.statSync(origem).size;
    depois += fs.statSync(dest).size;
    n++;
  }
}
const mb = (x) => (x / 1048576).toFixed(1) + ' MB';
console.log(`${n} imagens · ${mb(antes)} → ${mb(depois)}`);
