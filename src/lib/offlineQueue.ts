/* ═══════════════════════════════════════════════════════════════
   Fila de gravações offline (T-73).
   Sem internet, cada gravação da paciente vira uma operação guardada no
   aparelho e é reenviada quando a conexão volta. Todas as operações são
   idempotentes (upsert ou marcação com valor final), então reenviar
   duas vezes não duplica nada. Operações sobre o mesmo alvo se fundem:
   só a última versão importa.
   ═══════════════════════════════════════════════════════════════ */
import type { DailyCheckin } from '../types';
import { saveAnamnese } from './api/anamnese';
import { upsertCheckin } from './api/checkins';
import { setPreparoItem, setZeoliteDay } from './api/marks';
import { updateCycle, type CyclePatch } from './api/parasiteCycles';
import { updateProfile, type ProfilePatch } from './api/profile';

export type Op =
  | { t: 'anamnese'; answers: Record<string, unknown>; completed: boolean }
  | { t: 'checkin'; checkin: Omit<DailyCheckin, 'id' | 'created_at' | 'user_id'> }
  | { t: 'zeolite'; day: number; marked: boolean }
  | { t: 'preparo'; itemId: string; checked: boolean }
  | { t: 'cycle'; cycleId: string; patch: CyclePatch }
  | { t: 'profile'; patch: ProfilePatch };

/** Alvo da operação: duas operações com a mesma chave se fundem. */
function chave(op: Op): string {
  switch (op.t) {
    case 'anamnese':
      return 'anamnese';
    case 'checkin':
      return `checkin:${op.checkin.day_number}`;
    case 'zeolite':
      return `zeolite:${op.day}`;
    case 'preparo':
      return `preparo:${op.itemId}`;
    case 'cycle':
      return `cycle:${op.cycleId}`;
    case 'profile':
      return 'profile';
  }
}

/** Executa a operação no servidor. */
export function executar(userId: string, op: Op): Promise<unknown> {
  switch (op.t) {
    case 'anamnese':
      return saveAnamnese(userId, op.answers, op.completed);
    case 'checkin':
      return upsertCheckin(userId, op.checkin);
    case 'zeolite':
      return setZeoliteDay(userId, op.day, op.marked);
    case 'preparo':
      return setPreparoItem(userId, op.itemId, op.checked);
    case 'cycle':
      return updateCycle(op.cycleId, op.patch);
    case 'profile':
      return updateProfile(userId, op.patch);
  }
}

/** Falha de rede (vale tentar de novo depois), e não recusa do servidor. */
export function ehErroDeRede(e: unknown): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
  const msg = e instanceof Error ? e.message : String(e);
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed|timeout|aborted/i.test(msg);
}

const storageKey = (userId: string) => `pacificar_fila_v1_${userId}`;

export function lerFila(userId: string): Op[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) ?? '[]') as Op[];
  } catch {
    return [];
  }
}

function gravarFila(userId: string, fila: Op[]) {
  try {
    if (fila.length) localStorage.setItem(storageKey(userId), JSON.stringify(fila));
    else localStorage.removeItem(storageKey(userId));
  } catch {
    /* armazenamento indisponível */
  }
}

/** Guarda a operação, fundindo com uma anterior sobre o mesmo alvo. */
export function enfileirar(userId: string, op: Op) {
  const k = chave(op);
  const fila = lerFila(userId).filter(o => chave(o) !== k);
  // Perfil: funde os campos em vez de substituir
  if (op.t === 'profile') {
    const anterior = lerFila(userId).find(o => o.t === 'profile') as Extract<Op, { t: 'profile' }> | undefined;
    fila.push({ t: 'profile', patch: { ...anterior?.patch, ...op.patch } });
  } else if (op.t === 'cycle') {
    const anterior = lerFila(userId).find(o => chave(o) === k) as Extract<Op, { t: 'cycle' }> | undefined;
    fila.push({ ...op, patch: { ...anterior?.patch, ...op.patch } });
  } else {
    fila.push(op);
  }
  gravarFila(userId, fila);
}

/** Uma descarga por vez por usuário (evento "online" e abertura do app podem coincidir). */
const emAndamento = new Map<string, Promise<{ pendentes: number; recusadas: number }>>();

/** Tira da fila exatamente a operação enviada (uma nova sobre o mesmo alvo pode ter chegado). */
function remover(userId: string, op: Op) {
  const alvo = JSON.stringify(op);
  const fila = lerFila(userId);
  const i = fila.findIndex(o => JSON.stringify(o) === alvo);
  if (i >= 0) fila.splice(i, 1);
  gravarFila(userId, fila);
}

/**
 * Reenvia a fila na ordem. Para no primeiro erro de rede (tenta de novo depois).
 * Operação recusada pelo servidor (ex.: acesso suspenso) é descartada, para não travar a fila.
 */
export function esvaziarFila(userId: string): Promise<{ pendentes: number; recusadas: number }> {
  const atual = emAndamento.get(userId);
  if (atual) return atual;
  const p = (async () => {
    let recusadas = 0;
    for (;;) {
      const [op] = lerFila(userId);
      if (!op) break;
      try {
        await executar(userId, op);
      } catch (e) {
        if (ehErroDeRede(e)) break;
        recusadas++;
        console.warn('[fila] operação recusada:', op.t, e instanceof Error ? e.message : e);
      }
      remover(userId, op);
    }
    return { pendentes: lerFila(userId).length, recusadas };
  })().finally(() => emAndamento.delete(userId));
  emAndamento.set(userId, p);
  return p;
}
