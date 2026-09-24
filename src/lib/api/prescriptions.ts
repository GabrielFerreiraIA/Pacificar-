import type { Prescription } from '../../types';
import type { Database, Json } from '../../types/database';
import { db, ok } from './client';

type Row = Database['public']['Tables']['prescriptions']['Row'];

function toPrescription(r: Row): Prescription {
  return {
    id: r.id,
    user_id: r.user_id,
    dosha_predominant: (r.dosha_predominant ?? 'Tridosha') as Prescription['dosha_predominant'],
    massala_recommended: (r.massala_recommended ??
      'Massala Digestiva Universal') as Prescription['massala_recommended'],
    aromatherapy_oils: r.aromatherapy_oils,
    carrier_oil: r.carrier_oil ?? '',
    supplements_recommended: (r.supplements_recommended ?? []) as Prescription['supplements_recommended'],
    therapeutic_teas: r.therapeutic_teas,
    therapist_notes: r.therapist_notes,
    created_at: r.created_at,
    updated_at: r.updated_at
  };
}

export async function getPrescription(userId: string): Promise<Prescription | null> {
  const row = ok(await db().from('prescriptions').select('*').eq('user_id', userId).maybeSingle());
  return row ? toPrescription(row) : null;
}

/** Só a terapeuta grava (RLS). */
export async function savePrescription(userId: string, p: Partial<Prescription>, therapistId: string) {
  const patch: Database['public']['Tables']['prescriptions']['Insert'] = { user_id: userId, created_by: therapistId };
  if (p.dosha_predominant !== undefined) patch.dosha_predominant = p.dosha_predominant;
  if (p.massala_recommended !== undefined) patch.massala_recommended = p.massala_recommended;
  if (p.aromatherapy_oils !== undefined) patch.aromatherapy_oils = p.aromatherapy_oils;
  if (p.carrier_oil !== undefined) patch.carrier_oil = p.carrier_oil;
  if (p.supplements_recommended !== undefined)
    patch.supplements_recommended = p.supplements_recommended as unknown as Json;
  if (p.therapeutic_teas !== undefined) patch.therapeutic_teas = p.therapeutic_teas;
  if (p.therapist_notes !== undefined) patch.therapist_notes = p.therapist_notes;

  const row = ok(await db().from('prescriptions').upsert(patch, { onConflict: 'user_id' }).select('*').single());
  return toPrescription(row);
}
