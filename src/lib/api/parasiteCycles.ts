import type { ParasiteCycle } from '../../types';
import type { Database } from '../../types/database';
import { buildParasiteCycles } from '../lunar';
import { db, ok } from './client';

type Row = Database['public']['Tables']['parasite_cycles']['Row'];

function toCycle(r: Row): ParasiteCycle {
  return {
    id: r.id,
    user_id: r.user_id,
    cycle_number: r.cycle_number,
    moon_name: r.moon_name ?? `Ciclo ${String(r.cycle_number).padStart(2, '0')}`,
    moon_date: r.moon_date ?? '',
    day1_completed: r.day1_completed,
    day2_completed: r.day2_completed,
    day3_completed: r.day3_completed,
    charcoal_taken: r.charcoal_taken,
    h2o2_taken: r.h2o2_taken,
    completed: r.completed
  };
}

export async function listCycles(userId: string): Promise<ParasiteCycle[]> {
  const rows = ok(await db().from('parasite_cycles').select('*').eq('user_id', userId).order('cycle_number'));
  return rows.map(toCycle);
}

/** No primeiro acesso cria os 5 ciclos nas próximas luas cheias a partir do início da jornada (T-55). */
export async function ensureCycles(userId: string, startDate: string): Promise<ParasiteCycle[]> {
  const atuais = await listCycles(userId);
  if (atuais.length) return atuais;
  const novos = buildParasiteCycles(startDate, userId).map(c => ({
    user_id: userId,
    cycle_number: c.cycle_number,
    moon_name: c.moon_name,
    moon_date: c.moon_date
  }));
  // ignoreDuplicates: dois aparelhos abrindo ao mesmo tempo não duplicam nem dão erro
  ok(
    await db().from('parasite_cycles').upsert(novos, { onConflict: 'user_id,cycle_number', ignoreDuplicates: true })
  );
  return listCycles(userId);
}

export type CyclePatch = Partial<
  Pick<Row, 'day1_completed' | 'day2_completed' | 'day3_completed' | 'charcoal_taken' | 'h2o2_taken' | 'completed'>
>;

export async function updateCycle(cycleId: string, patch: CyclePatch) {
  ok(await db().from('parasite_cycles').update(patch).eq('id', cycleId));
}
