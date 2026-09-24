import type { UserProfile } from '../../types';
import type { Database } from '../../types/database';
import { dataSaoPaulo } from '../lunar';
import { db, ok } from './client';

type Row = Database['public']['Tables']['profiles']['Row'];

export function toUserProfile(r: Row): UserProfile {
  return {
    id: r.id,
    full_name: r.full_name || '',
    email: r.email ?? '',
    role: r.role === 'admin' ? 'admin' : 'patient',
    weight: r.weight ?? undefined,
    height: r.height ?? undefined,
    age: r.age ?? undefined,
    phone: r.phone ?? undefined,
    journey_start_date: r.journey_start_date ?? dataSaoPaulo(new Date(r.created_at)),
    current_day: r.current_day,
    avatar_url: r.avatar_url ?? undefined,
    created_at: r.created_at
  };
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const row = ok(await db().from('profiles').select('*').eq('id', userId).maybeSingle());
  return row ? toUserProfile(row) : null;
}

/** Campos que a própria pessoa pode mudar (os de controle são bloqueados no banco). */
export type ProfilePatch = Partial<
  Pick<Row, 'full_name' | 'phone' | 'weight' | 'height' | 'age' | 'current_day' | 'avatar_url'>
>;

export async function updateProfile(userId: string, patch: ProfilePatch) {
  ok(await db().from('profiles').update(patch).eq('id', userId));
}
