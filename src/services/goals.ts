import { supabase } from '@/lib/supabase';
import { TABLES, SELECT_COLUMNS } from '@/constants';
import type { Goal } from '@/types';

export async function fetchGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from(TABLES.GOALS)
    .select(SELECT_COLUMNS.GOALS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Goal[]) ?? [];
}

export async function addGoal(
  userId: string,
  payload: { title: string; description: string; category: string; deadline: string; progress: number; completed: boolean }
): Promise<Goal> {
  const { data, error } = await supabase
    .from(TABLES.GOALS)
    .insert({ ...payload, user_id: userId })
    .select(SELECT_COLUMNS.GOALS)
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function updateGoal(
  id: string,
  payload: Partial<Omit<Goal, 'id'>>
): Promise<void> {
  const { error } = await supabase.from(TABLES.GOALS).update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.GOALS).delete().eq('id', id);
  if (error) throw error;
}
