import { supabase } from '@/lib/supabase';
import { TABLES, SELECT_COLUMNS } from '@/constants';
import type { Project, ProjectStatus } from '@/types';

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select(SELECT_COLUMNS.PROJECTS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Project[]) ?? [];
}

export async function addProject(
  userId: string,
  payload: { name: string; description: string; status: ProjectStatus; progress: number; team: string[]; tags: string[] }
): Promise<Project> {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .insert({ ...payload, user_id: userId })
    .select(SELECT_COLUMNS.PROJECTS)
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(
  id: string,
  payload: Partial<Omit<Project, 'id'>>
): Promise<void> {
  const { error } = await supabase.from(TABLES.PROJECTS).update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.PROJECTS).delete().eq('id', id);
  if (error) throw error;
}
