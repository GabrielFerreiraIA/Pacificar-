#!/usr/bin/env node
// Hook SessionStart do Claude Code: o que for impresso aqui entra no contexto da sessão.
// Dá ao agente o estado atual do projeto sem ele precisar pedir.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lerTarefas, prontas, resumo, listarLogs, LOGS } from '../scripts/lib.mjs';

try {
  const { tarefas } = lerTarefas();
  const r = resumo(tarefas);
  const fmt = t => `- ${t.id} ${t.titulo} [@${t.donos.join(' @')}]${t.nota ? ' — ' + t.nota : ''}`;

  const andamento = tarefas.filter(t => t.status === '~');
  const bloqueadas = tarefas.filter(t => t.status === '!');
  const livres = prontas(tarefas).filter(t => t.donos.includes('agente'));

  const ultimos = listarLogs().slice(-3).map(arquivo => {
    const texto = readFileSync(join(LOGS, arquivo), 'utf8');
    const pend = texto.split(/^## Pendências.*$/m)[1]?.split(/^## /m)[0].replace(/<!--[\s\S]*?-->/g, '').trim();
    return `- ${arquivo}${pend && pend !== '-' ? `\n  Pendências: ${pend.replace(/\n/g, ' ')}` : ''}`;
  });

  const saida = [
    '# Estado da finalização do PACIFICAR (gerado pelo hook SessionStart)',
    '',
    `Progresso: ${r.feitas}/${r.total} tarefas concluídas.`,
    '',
    'Siga o protocolo de sessão do AGENTS.md: escolha UMA tarefa, rode `npm run tarefa -- iniciar T-NN claude`, trabalhe, conclua e crie o log.',
    '',
    andamento.length ? `## Em andamento (não pegue estas)\n${andamento.map(fmt).join('\n')}` : '## Em andamento\nNenhuma.',
    bloqueadas.length ? `\n## Bloqueadas\n${bloqueadas.map(fmt).join('\n')}` : '',
    `\n## Prontas para agente\n${livres.length ? livres.map(fmt).join('\n') : 'Nenhuma: todas dependem de ação humana ou de outra tarefa.'}`,
    ultimos.length ? `\n## Últimos logs\n${ultimos.join('\n')}` : ''
  ].filter(Boolean).join('\n');

  process.stdout.write(saida + '\n');
} catch (e) {
  // Um hook quebrado nunca deve impedir a sessão de abrir
  process.stdout.write(`(hook SessionStart: não foi possível ler finalizacao/TAREFAS.md — ${e.message})\n`);
}
