import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type SyncStatus = 'idle' | 'syncing' | 'healthy' | 'error' | 'expired_session';

export type SyncStatusInfo = {
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  lastSyncProblemsFound: number;
  lastSyncProblemsInserted: number;
  cronSyncEnabled: boolean;
};

/**
 * Fetches and subscribes to sync status from user_profiles.
 * Realtime subscription gives instant updates when cron changes sync_status.
 * Falls back to 60s polling as a safety net.
 */
export function useSyncStatus(userId: string | undefined) {
  const [status, setStatus] = useState<SyncStatusInfo>({
    syncStatus: 'idle',
    lastSyncedAt: null,
    lastSyncError: null,
    lastSyncProblemsFound: 0,
    lastSyncProblemsInserted: 0,
    cronSyncEnabled: true,
  });

  const fetchStatus = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('sync_status, last_synced_at, last_sync_error, last_sync_problems_found, last_sync_problems_inserted, cron_sync_enabled')
      .eq('user_id', userId)
      .single();

    if (data) {
      setStatus({
        syncStatus: (data.sync_status as SyncStatus) ?? 'idle',
        lastSyncedAt: data.last_synced_at,
        lastSyncError: data.last_sync_error,
        lastSyncProblemsFound: data.last_sync_problems_found ?? 0,
        lastSyncProblemsInserted: data.last_sync_problems_inserted ?? 0,
        cronSyncEnabled: data.cron_sync_enabled ?? true,
      });
    }
  }, [userId]);

  // Initial fetch + 60s polling safety net
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Realtime subscription for instant updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user_profiles:sync:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          setStatus({
            syncStatus: (row.sync_status as SyncStatus) ?? 'idle',
            lastSyncedAt: row.last_synced_at as string | null,
            lastSyncError: row.last_sync_error as string | null,
            lastSyncProblemsFound: (row.last_sync_problems_found as number) ?? 0,
            lastSyncProblemsInserted: (row.last_sync_problems_inserted as number) ?? 0,
            cronSyncEnabled: (row.cron_sync_enabled as boolean) ?? true,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const toggleCronSync = useCallback(async (enabled: boolean) => {
    if (!userId) return;
    await supabase
      .from('user_profiles')
      .update({ cron_sync_enabled: enabled, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    setStatus((prev) => ({ ...prev, cronSyncEnabled: enabled }));
  }, [userId]);

  return { ...status, refresh: fetchStatus, toggleCronSync };
}
