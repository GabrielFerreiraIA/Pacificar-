#!/usr/bin/env node
// Hook SessionEnd do Claude Code: registro mecânico de toda sessão, mesmo que o agente
// esqueça o log. Vai para finalizacao/logs/.sessoes.jsonl (local, fora do git).
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { LOGS, lerTarefas, git } from '../scripts/lib.mjs';

let entrada = '';
process.stdin.on('data', c => (entrada += c));
process.stdin.on('end', () => {
  try {
    const evento = entrada ? JSON.parse(entrada) : {};
    const { tarefas } = lerTarefas();
    const registro = {
      em: new Date().toISOString(),
      ferramenta: 'claude-code',
      sessao: evento.session_id ?? null,
      motivo: evento.reason ?? null,
      branch: git('rev-parse --abbrev-ref HEAD'),
      ultimo_commit: git('log -1 --oneline'),
      em_andamento: tarefas.filter(t => t.status === '~').map(t => `${t.id} (${t.nota})`),
      nao_commitado: git('status --short').split('\n').filter(Boolean).length
    };
    mkdirSync(LOGS, { recursive: true });
    appendFileSync(join(LOGS, '.sessoes.jsonl'), JSON.stringify(registro) + '\n', 'utf8');
  } catch {
    // Nunca atrapalha o encerramento
  }
  process.exit(0);
});
