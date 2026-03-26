import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import * as projectsService from '@/services/projects';
import type { Project, ProjectStatus } from '@/types';

export function useProjects() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => projectsService.fetchProjects(userId), []);
  const { data: projects, setData: setProjects, loading, error: fetchError } = useSupabaseQuery<Project[]>(fetcher, user?.id);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const clearError = () => setMutationError(null);

  const addProject = async (payload: { name: string; description: string; status: ProjectStatus; progress: number; team: string[]; tags: string[] }) => {
    if (!user) return;
    setMutationError(null);
    try {
      const newProject = await projectsService.addProject(user.id, payload);
      setProjects((prev) => [newProject, ...(prev ?? [])]);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to add project');
    }
  };

  const updateProject = async (id: string, payload: Partial<Omit<Project, 'id'>>) => {
    setMutationError(null);
    try {
      await projectsService.updateProject(id, payload);
      setProjects((prev) => (prev ?? []).map((p) => (p.id === id ? { ...p, ...payload } : p)));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const removeProject = async (id: string) => {
    setMutationError(null);
    try {
      await projectsService.deleteProject(id);
      setProjects((prev) => (prev ?? []).filter((p) => p.id !== id));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const error = mutationError || (fetchError ? fetchError.message : null);

  return { projects: projects ?? [], loading, error, clearError, addProject, updateProject, removeProject };
}
