import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import * as habitsService from '@/services/habits';
import type { Habit, Frequency } from '@/types';

export function useHabits() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => habitsService.fetchHabits(userId), []);
  const { data: habits, setData: setHabits, loading, error: fetchError } = useSupabaseQuery<Habit[]>(fetcher, user?.id);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const clearError = () => setMutationError(null);

  const addHabit = async (payload: { name: string; frequency: Frequency; streak: number }) => {
    if (!user) return;
    setMutationError(null);
    try {
      const newHabit = await habitsService.addHabit(user.id, payload);
      setHabits((prev) => [newHabit, ...(prev ?? [])]);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to add habit');
    }
  };

  const updateHabit = async (id: string, payload: Partial<Pick<Habit, 'name' | 'frequency' | 'streak'>>) => {
    setMutationError(null);
    try {
      await habitsService.updateHabit(id, payload);
      setHabits((prev) => (prev ?? []).map((h) => (h.id === id ? { ...h, ...payload } : h)));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update habit');
    }
  };

  const removeHabit = async (id: string) => {
    setMutationError(null);
    try {
      await habitsService.deleteHabit(id);
      setHabits((prev) => (prev ?? []).filter((h) => h.id !== id));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to delete habit');
    }
  };

  const incrementStreak = async (id: string) => {
    const habit = (habits ?? []).find((h) => h.id === id);
    if (!habit) return;
    const newStreak = habit.streak + 1;
    setMutationError(null);
    try {
      await habitsService.updateHabit(id, { streak: newStreak });
      setHabits((prev) => (prev ?? []).map((h) => (h.id === id ? { ...h, streak: newStreak } : h)));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update streak');
    }
  };

  const error = mutationError || (fetchError ? fetchError.message : null);

  return { habits: habits ?? [], loading, error, clearError, addHabit, updateHabit, removeHabit, incrementStreak };
}
