import { supabase } from '@/lib/supabase';
import { TABLES, SELECT_COLUMNS } from '@/constants';
import type { Habit, Frequency } from '@/types';

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from(TABLES.HABITS)
    .select(SELECT_COLUMNS.HABITS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Habit[]) ?? [];
}

export async function addHabit(
  userId: string,
  payload: { name: string; frequency: Frequency; streak: number }
): Promise<Habit> {
  const { data, error } = await supabase
    .from(TABLES.HABITS)
    .insert({ ...payload, user_id: userId })
    .select(SELECT_COLUMNS.HABITS)
    .single();
  if (error) throw error;
  return data as Habit;
}

export async function updateHabit(
  id: string,
  payload: Partial<Pick<Habit, 'name' | 'frequency' | 'streak'>>
): Promise<void> {
  const { error } = await supabase.from(TABLES.HABITS).update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.HABITS).delete().eq('id', id);
  if (error) throw error;
}
