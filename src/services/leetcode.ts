import { supabase } from '@/lib/supabase';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leetcode-sync`;

// ── Types ──

export type LeetCodeProblem = {
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  timestamp: string;
};

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
  // Try update first — covers the case where the row already exists
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

// ── Fetch from Edge Function ──

export async function fetchLeetCodeProblems(username: string): Promise<LeetCodeProblem[]> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ username, limit: 50 }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Sync failed (${res.status})`);
  }

  const { problems } = await res.json();
  return problems;
}

// ── Bulk insert into dsa_problems (skips duplicates via leetcode_slug) ──

export async function syncProblemsToDb(userId: string, problems: LeetCodeProblem[]) {
  const rows = problems.map((p) => ({
    user_id: userId,
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    solved: true,
    date: new Date(Number(p.timestamp) * 1000).toISOString().split('T')[0],
    source: 'leetcode',
    leetcode_slug: p.titleSlug,
  }));

  // upsert: if leetcode_slug already exists for this user, update it instead of duplicating
  const { error, data } = await supabase
    .from('dsa_problems')
    .upsert(rows, { onConflict: 'user_id,leetcode_slug', ignoreDuplicates: true })
    .select('id, title, difficulty, topic, solved, date');

  if (error) throw error;
  return data ?? [];
}

// ── Update last_synced_at timestamp ──

export async function updateLastSynced(userId: string): Promise<void> {
  await supabase
    .from('user_profiles')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('user_id', userId);
}
