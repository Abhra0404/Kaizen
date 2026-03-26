import type { SyncStatus } from '@/hooks/useSyncStatus';
import { useSyncStatus } from '@/hooks/useSyncStatus';

function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const STATUS_CONFIG: Record<SyncStatus, { color: string; label: string }> = {
  idle: { color: 'bg-gray-400', label: 'Not synced' },
  syncing: { color: 'bg-yellow-400 animate-pulse', label: 'Syncing...' },
  healthy: { color: 'bg-green-500', label: 'Auto-sync active' },
  error: { color: 'bg-red-500', label: 'Sync error' },
  expired_session: { color: 'bg-orange-500', label: 'Session expired' },
};

export default function SyncStatusBadge({ userId }: { userId: string | undefined }) {
  const { syncStatus, lastSyncedAt, lastSyncError } = useSyncStatus(userId);
  const config = STATUS_CONFIG[syncStatus] ?? STATUS_CONFIG.idle;

  return (
    <div
      className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted"
      title={lastSyncError ?? ''}
    >
      <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${config.color}`} />
      <span className="font-medium">{config.label}</span>
      {lastSyncedAt && (
        <span className="text-gray-400 dark:text-gray-500">
          · {formatTimeAgo(lastSyncedAt)}
        </span>
      )}
      {syncStatus === 'expired_session' && (
        <span className="text-orange-600 dark:text-orange-400 text-xs ml-1">
          — Update in Settings
        </span>
      )}
    </div>
  );
}
