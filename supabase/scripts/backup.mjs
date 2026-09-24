// Backup mensal do Pacificar (T-82). O Supabase gratuito não oferece backup baixável.
//
// Uso: node --env-file=.env.local supabase/scripts/backup.mjs
// Gera backups/pacificar-AAAA-MM-DD.bak (fora do git: dado de saúde), com:
//   - dados do banco via pg_dump (--data-only: public, auth e metadados do storage).
//     O schema está nas migrations do repositório (supabase/migrations/).
//   - os arquivos dos exames (bucket "exames").
// Tudo empacotado e CRIPTOGRAFADO (AES-256-GCM, chave derivada por scrypt da BACKUP_PASSPHRASE).
// Para conferir ou extrair: supabase/scripts/abrir-backup.mjs
//
// Variáveis (.env.local): SUPABASE_DB_URL (pooler, porta 5432), SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY, BACKUP_PASSPHRASE e PG_BIN (pasta do pg_dump 17).
import { execFileSync } from 'node:child_process';
import { createCipheriv, randomBytes, scryptSync } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_DB_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BACKUP_PASSPHRASE, PG_BIN } = process.env;
for (const [k, v] of Object.entries({ SUPABASE_DB_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BACKUP_PASSPHRASE })) {
  if (!v) {
    console.error(`Falta ${k} no .env.local`);
    process.exit(1);
  }
}

const pgDump = path.join(PG_BIN ?? '', process.platform === 'win32' ? 'pg_dump.exe' : 'pg_dump');
const hoje = new Date().toISOString().slice(0, 10);

// Tabelas do Auth que só guardam sessões e tokens: ficam de fora (segurança e tamanho)
const EXCLUIR = [
  'auth.sessions',
  'auth.refresh_tokens',
  'auth.audit_log_entries',
  'auth.flow_state',
  'auth.one_time_tokens',
  'auth.mfa_challenges'
];

console.log('1/3 Exportando o banco (pg_dump)…');
const sql = execFileSync(
  pgDump,
  [
    '--data-only',
    '--no-owner',
    '--no-privileges',
    // Só --table: quando há --table, o pg_dump ignora --schema
    '--table=public.*',
    '--table=auth.*',
    '--table=storage.buckets',
    '--table=storage.objects',
    ...EXCLUIR.map(t => `--exclude-table=${t}`),
    SUPABASE_DB_URL
  ],
  { maxBuffer: 1024 * 1024 * 1024, env: { ...process.env, PGCONNECT_TIMEOUT: '20' } }
);
console.log(`   ${(sql.length / 1024).toFixed(0)} KB de SQL`);

console.log('2/3 Baixando os arquivos dos exames…');
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const arquivos = {};
const { data: pastas, error: e1 } = await admin.storage.from('exames').list('', { limit: 1000 });
if (e1) throw e1;
for (const pasta of pastas ?? []) {
  const { data: itens, error: e2 } = await admin.storage.from('exames').list(pasta.name, { limit: 1000 });
  if (e2) throw e2;
  for (const item of itens ?? []) {
    const caminho = `${pasta.name}/${item.name}`;
    const { data: blob, error: e3 } = await admin.storage.from('exames').download(caminho);
    if (e3) throw e3;
    arquivos[caminho] = Buffer.from(await blob.arrayBuffer()).toString('base64');
  }
}
console.log(`   ${Object.keys(arquivos).length} arquivo(s)`);

console.log('3/3 Compactando e criptografando…');
const pacote = gzipSync(
  JSON.stringify({
    formato: 'pacificar-backup-v1',
    gerado_em: new Date().toISOString(),
    sql_gzip_base64: gzipSync(sql).toString('base64'),
    arquivos
  })
);
const sal = randomBytes(16);
const iv = randomBytes(12);
const chave = scryptSync(BACKUP_PASSPHRASE, sal, 32);
const cifra = createCipheriv('aes-256-gcm', chave, iv);
const conteudo = Buffer.concat([cifra.update(pacote), cifra.final()]);
// Layout: "PCFB1" | sal(16) | iv(12) | tag(16) | dados
const saida = Buffer.concat([Buffer.from('PCFB1'), sal, iv, cifra.getAuthTag(), conteudo]);

fs.mkdirSync('backups', { recursive: true });
const destino = path.join('backups', `pacificar-${hoje}.bak`);
fs.writeFileSync(destino, saida);
console.log(`\n✔ Backup salvo em ${destino} (${(saida.length / 1024).toFixed(0)} KB, criptografado).`);
console.log('  Copie este arquivo para um lugar seguro fora deste computador (ex.: Google Drive pessoal).');
