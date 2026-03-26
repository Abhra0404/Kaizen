import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import * as dsaService from '@/services/dsa';
import * as leetcodeService from '@/services/leetcode';
import type { Problem, Difficulty } from '@/types';

export function useProblems() {
  const { user } = useAuth();
  const fetcher = useCallback((userId: string) => dsaService.fetchProblems(userId), []);
  const { data: problems, setData: setProblems, loading, error: fetchError } = useSupabaseQuery<Problem[]>(fetcher, user?.id);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const clearError = () => setMutationError(null);

  const addProblem = async (payload: { title: string; difficulty: Difficulty; topic: string; solved: boolean }) => {
    if (!user) return;
    setMutationError(null);
    try {
      const newProblem = await dsaService.addProblem(user.id, payload);
      setProblems((prev) => [newProblem, ...(prev ?? [])]);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to add problem');
    }
  };

  const toggleSolved = async (id: string) => {
    const problem = (problems ?? []).find((p) => p.id === id);
    if (!problem) return;
    setMutationError(null);
    try {
      await dsaService.updateProblem(id, { solved: !problem.solved });
      setProblems((prev) => (prev ?? []).map((p) => (p.id === id ? { ...p, solved: !p.solved } : p)));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to update problem');
    }
  };

  const removeProblem = async (id: string) => {
    setMutationError(null);
    try {
      await dsaService.deleteProblem(id);
      setProblems((prev) => (prev ?? []).filter((p) => p.id !== id));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Failed to delete problem');
    }
  };

  const syncFromLeetCode = async () => {
    if (!user) return;
    setSyncing(true);
    setSyncResult(null);
    setMutationError(null);
    try {
      // 1. Get username
      const username = await leetcodeService.getLeetCodeUsername(user.id);
      if (!username) {
        setMutationError('Set your LeetCode username in Settings first.');
        setSyncing(false);
        return;
      }

      // 2. Fetch from LeetCode
      const lcProblems = await leetcodeService.fetchLeetCodeProblems(username);

      // 3. Upsert into DB
      const inserted = await leetcodeService.syncProblemsToDb(user.id, lcProblems);

      // 4. Update last synced timestamp
      await leetcodeService.updateLastSynced(user.id);

      // 5. Refresh local state
      const refreshed = await dsaService.fetchProblems(user.id);
      setProblems(refreshed);

      setSyncResult(`Synced ${lcProblems.length} problems (${inserted.length} new)`);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Sync failed');
    }
    setSyncing(false);
  };

  const error = mutationError || (fetchError ? fetchError.message : null);

  return {
    problems: problems ?? [],
    loading,
    error,
    clearError,
    addProblem,
    toggleSolved,
    removeProblem,
    syncFromLeetCode,
    syncing,
    syncResult,
    setSyncResult,
  };
}
