// Recorta as folhas de ícones (grade 2x2 gerada pela IA) em um arquivo por ícone.
//   entrada : imagens-origem/<pasta>/_folhas/<folha>.(png|jpg|webp)
//   saída   : imagens-origem/<pasta>/<id>.png  (1024 px quadrado)
// As folhas, os ids e a ordem (esq→dir, cima→baixo) vêm de finalizacao/refs/prompts-imagens-marca.json.
// Uso: npm run imagens:folhas
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const folhas = JSON.parse(fs.readFileSync('finalizacao/refs/prompts-imagens-marca.json', 'utf8')).filter((i) => i.tipo === 'folha');
const SAIDA_PX = 1024;
let feitos = 0;

for (const f of folhas) {
  const dir = path.join(f.pasta, '_folhas');
  const arq = ['png', 'jpg', 'jpeg', 'webp'].map((e) => path.join(dir, `${f.folha}.${e}`)).find(fs.existsSync);
  if (!arq) {
    console.log(`· ${f.folha}: folha não encontrada em ${dir} (pulando)`);
    continue;
  }
  const { width, height } = await sharp(arq).metadata();
  const w = Math.floor(width / f.cols);
  const h = Math.floor(height / f.rows);
  if (Math.abs(width / height - 1) > 0.03) console.log(`  ! ${f.folha}: a folha não é quadrada (${width}x${height}); o recorte pode ficar torto`);
  for (let i = 0; i < f.ids.length; i++) {
    const col = i % f.cols;
    const row = Math.floor(i / f.cols);
    const dest = path.join(f.pasta, `${f.ids[i]}.png`);
    await sharp(arq)
      .extract({ left: col * w, top: row * h, width: w, height: h })
      .resize(SAIDA_PX, SAIDA_PX, { fit: 'cover' })
      .png()
      .toFile(dest);
    feitos++;
  }
  console.log(`✓ ${f.folha}: ${width}x${height} → ${f.ids.join(', ')}`);
}
console.log(`${feitos} ícones recortados.`);
