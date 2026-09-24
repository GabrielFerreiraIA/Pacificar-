#!/usr/bin/env node
// Gera finalizacao/checklist/checklist.html a partir do TAREFAS.md.
// Depois, uma sessão do Claude Code republica a página (ver CLAUDE.md). As marcações do Gabriel
// ficam guardadas no armazenamento da página, indexadas pelo ID da tarefa, e sobrevivem à republicação.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, lerTarefas } from '../scripts/lib.mjs';

const pasta = join(ROOT, 'finalizacao', 'checklist');
const { tarefas } = lerTarefas();

const dados = {
  geradoEm: new Date().toISOString(),
  tarefas: tarefas.map(({ id, titulo, donos, deps, status, nota, fase, detalhes }) => ({
    id, titulo, donos, deps, status, nota, fase, detalhes
  }))
};

// JSON seguro dentro de <script>
const json = JSON.stringify(dados)
  .replace(/</g, '\u003c')
  .replace(/\u2028/g, '\u2028')
  .replace(/\u2029/g, '\u2029');

const template = readFileSync(join(pasta, 'template.html'), 'utf8');
if (!template.includes('"__DADOS__"')) {
  console.error('template.html sem o marcador "__DADOS__".');
  process.exit(1);
}
writeFileSync(join(pasta, 'checklist.html'), template.replace('"__DADOS__"', json), 'utf8');
console.log(`checklist.html gerado com ${tarefas.length} tarefas.`);
