import type { Json } from '../../types/database';
import { db, ok } from './client';

export interface AnamneseRecord {
  answers: Record<string, unknown>;
  completed: boolean;
  updated_at: string | null;
}

export async function getAnamnese(userId: string): Promise<AnamneseRecord | null> {
  const row = ok(
    await db().from('anamneses').select('answers, completed, updated_at').eq('user_id', userId).maybeSingle()
  );
  if (!row) return null;
  return {
    answers: (row.answers ?? {}) as Record<string, unknown>,
    completed: row.completed,
    updated_at: row.updated_at
  };
}

/** Grava o rascunho inteiro (upsert): a última versão local é a que vale. */
export async function saveAnamnese(userId: string, answers: Record<string, unknown>, completed: boolean) {
  ok(
    await db()
      .from('anamneses')
      .upsert(
        {
          user_id: userId,
          answers: answers as Json,
          completed,
          ...(completed ? { completed_at: new Date().toISOString() } : {})
        },
        { onConflict: 'user_id' }
      )
  );
}
