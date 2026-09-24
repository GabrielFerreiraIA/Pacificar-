import type { DailyCheckin } from '../../types';
import type { Database } from '../../types/database';
import { db, ok } from './client';

type Row = Database['public']['Tables']['checkins']['Row'];

function toCheckin(r: Row): DailyCheckin {
  return {
    id: r.id,
    user_id: r.user_id,
    day_number: r.day_number,
    energy_rating: r.energy_rating ?? 0,
    sleep_quality: r.sleep_quality ?? 0,
    bloating_level: (r.bloating_level ?? 1) as DailyCheckin['bloating_level'],
    sweet_craving: (r.sweet_craving ?? 1) as DailyCheckin['sweet_craving'],
    bristol_type: r.bristol_type ?? 4,
    diet_compliance: (r.diet_compliance ?? 'partial') as DailyCheckin['diet_compliance'],
    water_intake: r.water_intake ?? '',
    self_care_done: r.self_care_done,
    tongue_scraping_done: r.tongue_scraping_done,
    warm_water_done: r.warm_water_done,
    zeolite_taken: r.zeolite_taken,
    journal_notes: r.journal_notes,
    created_at: r.created_at
  };
}

export async function listCheckins(userId: string): Promise<DailyCheckin[]> {
  const rows = ok(await db().from('checkins').select('*').eq('user_id', userId).order('day_number'));
  return rows.map(toCheckin);
}

/** Um check-in por dia: refazer o dia substitui o anterior. */
export async function upsertCheckin(userId: string, c: Omit<DailyCheckin, 'id' | 'created_at' | 'user_id'>) {
  const row = ok(
    await db()
      .from('checkins')
      .upsert(
        {
          user_id: userId,
          day_number: c.day_number,
          energy_rating: c.energy_rating || null,
          sleep_quality: c.sleep_quality || null,
          bloating_level: c.bloating_level,
          sweet_craving: c.sweet_craving,
          bristol_type: c.bristol_type || null,
          diet_compliance: c.diet_compliance,
          water_intake: c.water_intake,
          self_care_done: c.self_care_done,
          tongue_scraping_done: c.tongue_scraping_done,
          warm_water_done: c.warm_water_done,
          zeolite_taken: c.zeolite_taken,
          journal_notes: c.journal_notes
        },
        { onConflict: 'user_id,day_number' }
      )
      .select('*')
      .single()
  );
  return toCheckin(row);
}
