#!/usr/bin/env node
// Uso:
//   npm run status
//   npm run tarefa -- iniciar  T-11 claude        (ou antigravity, codex...)
//   npm run tarefa -- concluir T-11 claude
//   npm run tarefa -- bloquear T-11 "falta a chave do Supabase"
//   npm run tarefa -- liberar  T-11
//   npm run tarefa -- json                         (todas as tarefas em JSON)
import { lerTarefas, salvarTarefa, prontas, resumo, hoje, STATUS } from './lib.mjs';

const [cmd = 'status', id, ...resto] = process.argv.slice(2);
const { linhas, tarefas } = lerTarefas();

function acharTarefa() {
  const t = tarefas.find(x => x.id === id?.toUpperCase());
  if (!t) {
    console.error(`Tarefa "${id ?? ''}" não encontrada em finalizacao/TAREFAS.md.`);
    process.exit(1);
  }
  return t;
}

function status() {
  const r = resumo(tarefas);
  const pct = Math.round((r.feitas / r.total) * 100);
  console.log(`\nPACIFICAR · ${r.feitas}/${r.total} tarefas concluídas (${pct}%)\n`);
  r.fases.forEach(f => {
    const barra = '█'.repeat(f.feitas) + '░'.repeat(f.total - f.feitas);
    console.log(`  ${barra.padEnd(10)} ${String(f.feitas).padStart(2)}/${f.total}  ${f.fase}`);
  });

  const lista = (titulo, itens) => {
    if (!itens.length) return;
    console.log(`\n${titulo}`);
    itens.forEach(t => console.log(`  ${t.id}  ${t.titulo}  [@${t.donos.join(' @')}]${t.nota ? '  — ' + t.nota : ''}`));
  };

  const livres = prontas(tarefas);
  lista('EM ANDAMENTO', tarefas.filter(t => t.status === '~'));
  lista('BLOQUEADAS', tarefas.filter(t => t.status === '!'));
  lista('PRONTAS PARA AGENTE (dependências concluídas)', livres.filter(t => t.donos.includes('agente')));
  lista('ESPERANDO AÇÃO HUMANA (@gabriel / @ana)', livres.filter(t => !t.donos.includes('agente')));
  console.log('');
}

switch (cmd) {
  case 'status':
    status();
    break;

  case 'json':
    console.log(JSON.stringify(tarefas, null, 2));
    break;

  case 'iniciar': {
    const t = acharTarefa();
    const agente = resto[0];
    if (!agente) { console.error('Informe quem está executando: npm run tarefa -- iniciar T-11 claude'); process.exit(1); }
    if (t.status === '~') { console.error(`${t.id} já está em andamento (${t.nota}). Escolha outra tarefa.`); process.exit(1); }
    if (t.status === 'x') { console.error(`${t.id} já foi concluída.`); process.exit(1); }
    const pendentes = t.deps.filter(d => tarefas.find(x => x.id === d)?.status !== 'x');
    if (pendentes.length && !resto.includes('--forcar')) {
      console.error(`${t.id} depende de ${pendentes.join(', ')}, ainda não concluída(s). Use --forcar só se tiver certeza.`);
      process.exit(1);
    }
    t.status = '~';
    t.nota = `em andamento: ${agente} (${hoje()})`;
    salvarTarefa(linhas, t);
    console.log(`${t.id} marcada como em andamento por ${agente}.`);
    console.log(`Faça o commit: git commit -m "[${t.id}] iniciar" -- finalizacao/TAREFAS.md`);
    break;
  }

  case 'concluir': {
    const t = acharTarefa();
    const agente = resto[0] ?? t.nota.match(/em andamento: (\S+)/)?.[1] ?? 'gabriel';
    t.status = 'x';
    t.nota = `concluída: ${agente} (${hoje()})`;
    salvarTarefa(linhas, t);
    console.log(`${t.id} concluída.`);
    if (agente !== 'gabriel' && agente !== 'ana') {
      console.log(`Agora registre o log: npm run log -- ${t.id} ${agente}`);
    }
    break;
  }

  case 'bloquear': {
    const t = acharTarefa();
    const motivo = resto.join(' ').trim();
    if (!motivo) { console.error('Explique o bloqueio: npm run tarefa -- bloquear T-11 "motivo"'); process.exit(1); }
    t.status = '!';
    t.nota = `bloqueada: ${motivo} (${hoje()})`;
    salvarTarefa(linhas, t);
    console.log(`${t.id} bloqueada: ${motivo}`);
    break;
  }

  case 'liberar': {
    const t = acharTarefa();
    t.status = ' ';
    t.nota = '';
    salvarTarefa(linhas, t);
    console.log(`${t.id} voltou a ficar livre.`);
    break;
  }

  default:
    console.error(`Comando desconhecido "${cmd}". Use: status | iniciar | concluir | bloquear | liberar | json`);
    console.error(`Status possíveis: ${Object.values(STATUS).join(', ')}`);
    process.exit(1);
}
