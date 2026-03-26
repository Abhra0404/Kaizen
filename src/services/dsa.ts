import { supabase } from '@/lib/supabase';
import { TABLES, SELECT_COLUMNS } from '@/constants';
import type { Problem, Difficulty } from '@/types';

export async function fetchProblems(userId: string): Promise<Problem[]> {
  const { data, error } = await supabase
    .from(TABLES.DSA_PROBLEMS)
    .select(SELECT_COLUMNS.DSA_PROBLEMS)
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as Problem[]) ?? [];
}

export async function addProblem(
  userId: string,
  payload: { title: string; difficulty: Difficulty; topic: string; solved: boolean }
): Promise<Problem> {
  const { data, error } = await supabase
    .from(TABLES.DSA_PROBLEMS)
    .insert({ ...payload, date: new Date().toISOString().split('T')[0], user_id: userId })
    .select(SELECT_COLUMNS.DSA_PROBLEMS)
    .single();
  if (error) throw error;
  return data as Problem;
}

export async function updateProblem(
  id: string,
  payload: Partial<Pick<Problem, 'title' | 'difficulty' | 'topic' | 'solved'>>
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.DSA_PROBLEMS)
    .update(payload)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteProblem(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.DSA_PROBLEMS).delete().eq('id', id);
  if (error) throw error;
}
