import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import * as goalsService from '@/services/goals';
import type { Goal } from '@/types';

export function useGoals() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => goalsService.fetchGoals(userId), []);
  const { data: goals, setData: setGoals, loading, error: fetchError } = useSupabaseQuery<Goal[]>(fetcher, user?.id);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const clearError = () => setMutationError(null);

  const addGoal = async (payload: { title: string; description: string; category: string; deadline: string; progress: number; completed: boolean }) => {
    if (!user) return;
    setMutationError(null);
    try {
      const newGoal = await goalsService.addGoal(user.id, payload);
      setGoals((prev) => [newGoal, ...(prev ?? [])]);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to add goal');
    }
  };

  const updateGoal = async (id: string, payload: Partial<Omit<Goal, 'id'>>) => {
    setMutationError(null);
    try {
      await goalsService.updateGoal(id, payload);
      setGoals((prev) => (prev ?? []).map((g) => (g.id === id ? { ...g, ...payload } : g)));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update goal');
    }
  };

  const removeGoal = async (id: string) => {
    setMutationError(null);
    try {
      await goalsService.deleteGoal(id);
      setGoals((prev) => (prev ?? []).filter((g) => g.id !== id));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to delete goal');
    }
  };

  const toggleCompleted = async (id: string) => {
    const goal = (goals ?? []).find((g) => g.id === id);
    if (!goal) return;
    setMutationError(null);
    try {
      await goalsService.updateGoal(id, { completed: !goal.completed });
      setGoals((prev) => (prev ?? []).map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update goal');
    }
  };

  const error = mutationError || (fetchError ? fetchError.message : null);

  return { goals: goals ?? [], loading, error, clearError, addGoal, updateGoal, removeGoal, toggleCompleted };
}
