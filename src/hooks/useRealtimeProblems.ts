import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Problem } from '@/types';

/**
 * Subscribes to Supabase Realtime INSERT events on dsa_problems.
 * When the cron batch-sync inserts new problems server-side,
 * this automatically adds them to the UI without page refresh.
 */
export function useRealtimeProblems(
  userId: string | undefined,
  onNewProblem: (problem: Problem) => void
) {
  const stableCallback = useCallback(onNewProblem, [onNewProblem]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`dsa_problems:user:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dsa_problems',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const problem: Problem = {
            id: row.id as string,
            title: row.title as string,
            difficulty: row.difficulty as Problem['difficulty'],
            topic: (row.topic as string) ?? '',
            solved: row.solved as boolean,
            date: row.date as string,
            source: (row.source as Problem['source']) ?? 'manual',
            leetcode_slug: (row.leetcode_slug as string) ?? '',
          };
          stableCallback(problem);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, stableCallback]);
}
