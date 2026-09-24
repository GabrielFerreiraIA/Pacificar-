#!/usr/bin/env node
// Hook Stop do Claude Code. Impede a sessão de encerrar quando uma tarefa de agente foi
// concluída HOJE e ainda não tem log. Dispara uma vez só (stop_hook_active evita loop).
import { lerTarefas, listarLogs, hoje } from '../scripts/lib.mjs';

let entrada = '';
process.stdin.on('data', c => (entrada += c));
process.stdin.on('end', () => {
  try {
    const evento = entrada ? JSON.parse(entrada) : {};
    if (evento.stop_hook_active) return process.exit(0);

    const { tarefas } = lerTarefas();
    const logs = listarLogs();
    const semLog = tarefas.filter(
      t =>
        t.status === 'x' &&
        t.donos.includes('agente') &&
        t.nota.includes(`(${hoje()})`) &&
        !logs.some(arquivo => arquivo.endsWith(`_${t.id}.md`))
    );

    if (semLog.length) {
      const ids = semLog.map(t => t.id).join(', ');
      process.stdout.write(
        JSON.stringify({
          decision: 'block',
          reason:
            `A(s) tarefa(s) ${ids} foi(ram) concluída(s) hoje sem log. ` +
            `Rode \`npm run log -- ${semLog[0].id} claude\`, preencha "O que foi feito", "Decisões", ` +
            `"Como testar" e "Pendências", e faça o commit com a marca [${semLog[0].id}].`
        })
      );
    }
  } catch {
    // Em caso de erro, deixa a sessão encerrar normalmente
  }
  process.exit(0);
});
