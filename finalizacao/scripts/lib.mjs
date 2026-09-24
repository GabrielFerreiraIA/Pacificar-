// Leitura e escrita de finalizacao/TAREFAS.md — usado pelos scripts, hooks e pelo gerador do checklist.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const TAREFAS = join(ROOT, 'finalizacao', 'TAREFAS.md');
export const LOGS = join(ROOT, 'finalizacao', 'logs');

// - [S] **T-NN** Título · @dono · dep: T-AA, T-BB · nota
const LINHA = /^- \[([ ~x!])\] \*\*(T-\d+)\*\* (.+)$/;
const FASE = /^## (.+)$/;

export const STATUS = { ' ': 'livre', '~': 'em andamento', x: 'concluída', '!': 'bloqueada' };

export function hoje() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function agora() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${hoje()}_${p(d.getHours())}${p(d.getMinutes())}`;
}

export function lerTarefas() {
  const linhas = readFileSync(TAREFAS, 'utf8').split(/\r?\n/);
  const tarefas = [];
  let fase = '';
  let atual = null;

  linhas.forEach((linha, i) => {
    const f = linha.match(FASE);
    if (f) { fase = f[1].trim(); atual = null; return; }

    const m = linha.match(LINHA);
    if (m) {
      const [titulo, donos = '', dep = 'dep: —', ...resto] = m[3].split(' · ');
      atual = {
        linha: i,
        status: m[1],
        id: m[2],
        titulo: titulo.trim(),
        donos: donos.trim().split(/\s+/).filter(Boolean).map(d => d.replace('@', '')),
        deps: dep.replace(/^dep:\s*/, '').split(',').map(s => s.trim()).filter(s => /^T-\d+$/.test(s)),
        nota: resto.join(' · ').trim(),
        fase,
        detalhes: []
      };
      tarefas.push(atual);
      return;
    }

    // Sub-itens indentados pertencem à última tarefa
    if (atual && /^\s{2,}- /.test(linha)) atual.detalhes.push(linha.replace(/^\s+- /, '').trim());
    else if (linha.trim() === '') { /* mantém a tarefa aberta entre linhas em branco */ }
    else atual = null;
  });

  return { linhas, tarefas };
}

export function montarLinha(t) {
  const donos = t.donos.map(d => '@' + d).join(' ');
  const dep = t.deps.length ? t.deps.join(', ') : '—';
  return `- [${t.status}] **${t.id}** ${t.titulo} · ${donos} · dep: ${dep}${t.nota ? ' · ' + t.nota : ''}`;
}

export function salvarTarefa(linhas, t) {
  linhas[t.linha] = montarLinha(t);
  writeFileSync(TAREFAS, linhas.join('\n'), 'utf8');
}

/** Pronta = livre e com todas as dependências concluídas. */
export function prontas(tarefas) {
  const feitas = new Set(tarefas.filter(t => t.status === 'x').map(t => t.id));
  return tarefas.filter(t => t.status === ' ' && t.deps.every(d => feitas.has(d)));
}

export function listarLogs() {
  if (!existsSync(LOGS)) return [];
  return readdirSync(LOGS).filter(f => /^\d{4}-\d{2}-\d{2}_.+\.md$/.test(f)).sort();
}

export function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

export function resumo(tarefas) {
  const total = tarefas.length;
  const feitas = tarefas.filter(t => t.status === 'x').length;
  const fases = [...new Set(tarefas.map(t => t.fase))].map(fase => {
    const daFase = tarefas.filter(t => t.fase === fase);
    return { fase, feitas: daFase.filter(t => t.status === 'x').length, total: daFase.length };
  });
  return { total, feitas, fases };
}
