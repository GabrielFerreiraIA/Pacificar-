// Converte as fotos originais dos pratos (PNG pesado) em WebP leve para o app.
//   origem : imagens-origem/pratos/**/<id>.png|jpg   (fora do git, fora do build)
//   saída  : public/pratos/<id>.webp     (800 px, destaque do cartão)
//            public/pratos/t/<id>.webp   (240 px, miniatura da faixa de opções)
// O <id> é b01..b20 (café), l01..l20 (almoço), d01..d20 (jantar), a mesma ordem de src/data/mealOptions.ts.
// Uso: npm run imagens:pratos
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ORIGEM = 'imagens-origem/pratos';
const SAIDA = 'public/pratos';
fs.mkdirSync(`${SAIDA}/t`, { recursive: true });

const arquivos = [];
(function varrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) varrer(p);
    else if (/^[bld]\d{2}\.(png|jpe?g|webp)$/i.test(e.name)) arquivos.push(p);
  }
})(ORIGEM);

let antes = 0;
let depois = 0;
for (const f of arquivos) {
  const id = path.basename(f).replace(/\.\w+$/, '').toLowerCase();
  antes += fs.statSync(f).size;
  const img = sharp(f).rotate();
  await img.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`${SAIDA}/${id}.webp`);
  await img.clone().resize({ width: 240, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`${SAIDA}/t/${id}.webp`);
  depois += fs.statSync(`${SAIDA}/${id}.webp`).size + fs.statSync(`${SAIDA}/t/${id}.webp`).size;
}
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log(`${arquivos.length} fotos · ${mb(antes)} → ${mb(depois)}`);
const esperados = ['b', 'l', 'd'].flatMap((k) => Array.from({ length: 20 }, (_, i) => `${k}${String(i + 1).padStart(2, '0')}`));
const faltam = esperados.filter((id) => !fs.existsSync(`${SAIDA}/${id}.webp`));
if (faltam.length) console.log('Faltam:', faltam.join(', '));
