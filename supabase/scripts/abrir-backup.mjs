// Confere ou extrai um backup gerado por backup.mjs (T-82).
//
// Conferir (não grava nada):   node --env-file=.env.local supabase/scripts/abrir-backup.mjs backups/pacificar-AAAA-MM-DD.bak
// Extrair para restaurar:      ... abrir-backup.mjs <arquivo.bak> --extrair <pasta>
//   Gera <pasta>/dados.sql e <pasta>/exames/<user_id>/<arquivo>.
//
// Restaurar num projeto novo (passo a passo em finalizacao/refs/backup.md):
//   1. aplicar as migrations de supabase/migrations/ no projeto novo;
//   2. psql "<url do projeto novo>" -f <pasta>/dados.sql
//   3. reenviar os arquivos de <pasta>/exames/ para o bucket "exames".
import { createDecipheriv, scryptSync } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

const [arquivo, flag, pastaSaida] = process.argv.slice(2);
const { BACKUP_PASSPHRASE } = process.env;
if (!arquivo || !BACKUP_PASSPHRASE) {
  console.error('Uso: node --env-file=.env.local supabase/scripts/abrir-backup.mjs <arquivo.bak> [--extrair <pasta>]');
  process.exit(1);
}

const buf = fs.readFileSync(arquivo);
if (buf.subarray(0, 5).toString() !== 'PCFB1') throw new Error('Arquivo não é um backup do Pacificar.');
const sal = buf.subarray(5, 21);
const iv = buf.subarray(21, 33);
const tag = buf.subarray(33, 49);
const decifra = createDecipheriv('aes-256-gcm', scryptSync(BACKUP_PASSPHRASE, sal, 32), iv);
decifra.setAuthTag(tag);
let pacote;
try {
  pacote = JSON.parse(gunzipSync(Buffer.concat([decifra.update(buf.subarray(49)), decifra.final()])).toString());
} catch {
  console.error('Não foi possível abrir: senha (BACKUP_PASSPHRASE) errada ou arquivo corrompido.');
  process.exit(1);
}

const sql = gunzipSync(Buffer.from(pacote.sql_gzip_base64, 'base64')).toString();
const contar = tabela => (sql.match(new RegExp(`^COPY ${tabela.replace('.', '\\.')} [\\s\\S]*?^\\\\\\.$`, 'm'))?.[0].split('\n').length ?? 2) - 2;

console.log(`Backup ${pacote.formato} gerado em ${pacote.gerado_em}`);
for (const t of ['auth.users', 'public.profiles', 'public.anamneses', 'public.checkins', 'public.lab_exams', 'public.consents']) {
  console.log(`  ${t.padEnd(18)} ${contar(t)} linha(s)`);
}
console.log(`  arquivos de exames  ${Object.keys(pacote.arquivos).length}`);

if (flag === '--extrair') {
  if (!pastaSaida) throw new Error('Informe a pasta: --extrair <pasta>');
  fs.mkdirSync(path.join(pastaSaida, 'exames'), { recursive: true });
  fs.writeFileSync(path.join(pastaSaida, 'dados.sql'), sql);
  for (const [caminho, b64] of Object.entries(pacote.arquivos)) {
    const destino = path.join(pastaSaida, 'exames', caminho);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, Buffer.from(b64, 'base64'));
  }
  console.log(`\n✔ Extraído em ${pastaSaida}. Apague esta pasta depois de restaurar (dado de saúde).`);
}
