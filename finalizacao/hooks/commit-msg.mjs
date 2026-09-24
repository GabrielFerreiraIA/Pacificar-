#!/usr/bin/env node
// Git hook commit-msg (vale para Claude, Antigravity e humano): todo commit precisa dizer
// a qual tarefa pertence. É isso que permite ao `npm run log` montar o histórico sozinho.
import { readFileSync } from 'node:fs';

const arquivo = process.argv[2];
const primeiraLinha = readFileSync(arquivo, 'utf8').split(/\r?\n/)[0].trim();

const aceito =
  /\[(T-\d+|infra|docs)\]/.test(primeiraLinha) ||
  /^(Merge|Revert|fixup!|squash!)/.test(primeiraLinha);

if (!aceito) {
  console.error('\n✖ Commit recusado: a mensagem precisa indicar a tarefa.');
  console.error('  Exemplos:  [T-11] cria migration inicial');
  console.error('             [infra] ajusta script de build');
  console.error('             [docs] atualiza PLANO.md');
  console.error(`  Recebido:  ${primeiraLinha || '(vazio)'}\n`);
  process.exit(1);
}
