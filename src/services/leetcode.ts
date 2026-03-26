import { supabase } from '@/lib/supabase';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leetcode-sync`;

// ── LeetCode Username (user_profiles) ──

export async function getLeetCodeUsername(userId: string): Promise<string> {
  const { data } = await supabase
    .from('user_profiles')
    .select('leetcode_username')
    .eq('user_id', userId)
    .single();
  return data?.leetcode_username ?? '';
}

export async function saveLeetCodeUsername(userId: string, username: string): Promise<void> {
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ leetcode_username: username, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_profiles')
      .insert({ user_id: userId, leetcode_username: username, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
}

// ── LeetCode Session Cookie (stored server-side in user_profiles — never in localStorage) ──

export async function getLeetCodeSession(userId: string): Promise<string> {
  const { data } = await supabase
    .from('user_profiles')
    .select('leetcode_session')
    .eq('user_id', userId)
    .single();
  return data?.leetcode_session ?? '';
}

export async function saveLeetCodeSession(userId: string, session: string): Promise<void> {
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ leetcode_session: session, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('user_profiles')
      .insert({ user_id: userId, leetcode_session: session, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
}

// ── Sync response from Edge Function ──

export type SyncResponse = {
  mode: 'full' | 'quick';
  totalFound: number;
  inserted: number;
  skipped: number;
  earlyExit: boolean;
  pagesScanned: number;
  message: string;
};

// ── Trigger sync via Edge Function ──
// Edge Function handles everything server-side:
//   - Full sync: paginated submissionList (20 per page) with session cookie from DB
//   - Quick sync: recentAcSubmissionList (public, ~20 recent)
//   - Rate limiting (200ms between pages)
//   - Incremental sync with early exit
//   - Batch inserts into dsa_problems

export async function triggerLeetCodeSync(
  userId: string,
  username: string,
  useFullSync: boolean
): Promise<SyncResponse> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ username, userId, useFullSync }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Sync failed (${res.status})`);
  }

  return await res.json() as SyncResponse;
}

// ── Delete all LeetCode synced data and reset username ──

export async function deleteLeetCodeData(userId: string): Promise<number> {
  // 1. Delete all leetcode-synced problems for this user
  const { data, error: deleteError } = await supabase
    .from('dsa_problems')
    .delete()
    .eq('user_id', userId)
    .eq('source', 'leetcode')
    .select('id');

  if (deleteError) throw deleteError;

  // 2. Clear username, session, and last_synced_at in user_profiles
  await supabase
    .from('user_profiles')
    .update({
      leetcode_username: '',
      leetcode_session: '',
      last_synced_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return (data ?? []).length;
}
