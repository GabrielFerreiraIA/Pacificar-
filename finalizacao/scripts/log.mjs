#!/usr/bin/env node
// Uso:
//   npm run log -- T-11 claude       cria o log da sessão, já preenchido com commits e arquivos da tarefa
//   npm run log -- infra antigravity  ajuste avulso, sem tarefa
//   npm run log:ultimos               mostra os 5 logs mais recentes e suas pendências
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LOGS, lerTarefas, listarLogs, agora, git } from './lib.mjs';

const [primeiro, segundo] = process.argv.slice(2);

if (primeiro === 'ultimos') {
  const n = Number(segundo) || 5;
  const logs = listarLogs().slice(-n);
  if (!logs.length) { console.log('Nenhum log ainda.'); process.exit(0); }
  logs.forEach(arquivo => {
    const texto = readFileSync(join(LOGS, arquivo), 'utf8');
    const titulo = texto.split('\n')[0].replace(/^#\s*/, '');
    const pend =
      texto.split(/^## Pendências.*$/m)[1]?.split(/^## /m)[0].replace(/<!--[\s\S]*?-->/g, '').trim() || '(nenhuma)';
    console.log(`\n▸ ${arquivo}\n  ${titulo}\n  Pendências: ${pend.replace(/\n/g, '\n  ')}`);
  });
  console.log('');
  process.exit(0);
}

const tarefaId = primeiro?.toUpperCase();
const agente = segundo;
if (!tarefaId || !agente) {
  console.error('Uso: npm run log -- T-11 claude   (ou: npm run log -- infra claude)');
  process.exit(1);
}

const avulso = tarefaId === 'INFRA';
const tarefa = avulso ? null : lerTarefas().tarefas.find(t => t.id === tarefaId);
if (!avulso && !tarefa) { console.error(`Tarefa ${tarefaId} não existe em TAREFAS.md.`); process.exit(1); }

const grep = avulso ? '\\[infra\\]' : `\\[${tarefaId}\\]`;
const commits = git(`log --oneline --grep="${grep}" -n 30`) || '(nenhum commit com essa marca ainda)';
const arquivos = git(`log --name-only --pretty=format: --grep="${grep}" -n 30`)
  .split('\n').map(s => s.trim()).filter(Boolean);
const unicos = [...new Set(arquivos)].sort();
const naoCommitado = git('status --short') || '(árvore limpa)';

const nome = `${agora()}_${agente}_${avulso ? 'infra' : tarefaId}.md`;
const titulo = avulso ? 'Ajuste avulso' : `${tarefa.id} · ${tarefa.titulo}`;

const conteudo = `# ${titulo}

- **Agente:** ${agente}
- **Data:** ${agora().replace('_', ' ')}
- **Status da tarefa ao fechar o log:** ${avulso ? '—' : tarefa.status === 'x' ? 'concluída' : tarefa.nota || 'livre'}

## O que foi feito
<!-- 3 a 8 bullets objetivos. O que existe agora que não existia antes. -->
-

## Decisões tomadas
<!-- Escolhas que a próxima sessão precisa saber. Se mudou algo do PLANO.md, atualize o PLANO também. -->
-

## Como testar
<!-- Passos que o Gabriel consegue seguir para validar e marcar o checklist. -->
1.

## Pendências
<!-- O que ficou para depois ou precisa de ação humana. Escreva "nenhuma" se não houver. -->
-

## Registro automático

### Commits da tarefa
\`\`\`
${commits}
\`\`\`

### Arquivos tocados nesses commits
${unicos.length ? unicos.map(a => `- \`${a}\``).join('\n') : '- (nenhum)'}

### Alterações ainda não commitadas
\`\`\`
${naoCommitado}
\`\`\`
`;

mkdirSync(LOGS, { recursive: true });
const caminho = join(LOGS, nome);
writeFileSync(caminho, conteudo, 'utf8');
console.log(`Log criado: finalizacao/logs/${nome}`);
console.log('Preencha as seções "O que foi feito", "Decisões", "Como testar" e "Pendências", depois faça o commit.');
