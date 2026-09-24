/* Marcações simples com chave composta: dias de zeólita e itens do Preparo. */
import { db, ok } from './client';

export async function listZeoliteDays(userId: string): Promise<number[]> {
  const rows = ok(await db().from('zeolite_days').select('day').eq('user_id', userId).order('day'));
  return rows.map(r => r.day);
}

export async function setZeoliteDay(userId: string, day: number, marked: boolean) {
  if (marked) {
    ok(
      await db()
        .from('zeolite_days')
        .upsert({ user_id: userId, day }, { onConflict: 'user_id,day', ignoreDuplicates: true })
    );
  } else {
    ok(await db().from('zeolite_days').delete().eq('user_id', userId).eq('day', day));
  }
}

export async function listPreparo(userId: string): Promise<string[]> {
  const rows = ok(await db().from('preparo_checked').select('item_id').eq('user_id', userId));
  return rows.map(r => r.item_id);
}

export async function setPreparoItem(userId: string, itemId: string, checked: boolean) {
  if (checked) {
    ok(
      await db()
        .from('preparo_checked')
        .upsert({ user_id: userId, item_id: itemId }, { onConflict: 'user_id,item_id', ignoreDuplicates: true })
    );
  } else {
    ok(await db().from('preparo_checked').delete().eq('user_id', userId).eq('item_id', itemId));
  }
}
