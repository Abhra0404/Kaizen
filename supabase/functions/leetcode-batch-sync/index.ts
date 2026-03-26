// supabase/functions/leetcode-batch-sync/index.ts
// System-facing batch sync orchestrator for cron-based auto-sync.
// Called by pg_cron every 10 minutes via pg_net.
// Iterates over all users with a leetcode_session, runs incremental
// sync for each, logs results to sync_logs table.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Configuration ──

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const PAGE_SIZE = 20;
const RATE_LIMIT_MS = 300; // 300ms between LeetCode pages (more conservative than manual 200ms)
const MAX_OFFSET = 10_000; // Safety cap
const INTER_USER_DELAY_MS = 3_000; // 3s between users to avoid LeetCode rate limits
const MAX_USERS_PER_RUN = 50; // Safety cap per cron run

// Incremental sync tuning (faster early exit for cron)
const EARLY_EXIT_THRESHOLD = 10; // Use early exit if user has 10+ existing problems
const CONSECUTIVE_EXISTING_LIMIT = 10; // Exit after 10 consecutive existing slugs

// ── GraphQL Queries ──

const SUBMISSION_LIST_QUERY = `
  query submissionList($offset: Int!, $limit: Int!) {
    submissionList(offset: $offset, limit: $limit) {
      lastKey
      hasNext
      submissions {
        id
        title
        titleSlug
        statusDisplay
        timestamp
        lang
      }
    }
  }
`;

const QUESTION_DETAIL_QUERY = `
  query questionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      difficulty
      topicTags { name }
    }
  }
`;

// ── Types ──

type RawSubmission = {
  id: string;
  title: string;
  titleSlug: string;
  statusDisplay: string;
  timestamp: string;
  lang: string;
};

type SolvedProblem = {
  title: string;
  titleSlug: string;
  timestamp: string;
};

type EnrichedProblem = SolvedProblem & {
  difficulty: string;
  topic: string;
};

type UserRow = {
  user_id: string;
  leetcode_username: string;
  leetcode_session: string;
};

type UserSyncResult = {
  userId: string;
  username: string;
  status: "success" | "error" | "skipped" | "expired_session";
  problemsFound: number;
  problemsInserted: number;
  pagesScanned: number;
  earlyExit: boolean;
  errorMessage?: string;
  durationMs: number;
};

// ── Helpers ──

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function queryLeetCode(
  query: string,
  variables: Record<string, unknown>,
  sessionCookie: string
) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/submissions/",
      Cookie: `LEETCODE_SESSION=${sessionCookie}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("SESSION_EXPIRED");
  }
  if (!res.ok) throw new Error(`LeetCode API returned ${res.status}`);

  const json = await res.json();
  if (json.errors) {
    const msg = json.errors[0]?.message ?? "GraphQL error";
    if (msg.toLowerCase().includes("not logged in") || msg.toLowerCase().includes("login")) {
      throw new Error("SESSION_EXPIRED");
    }
    throw new Error(msg);
  }
  return json.data;
}

async function getQuestionDetail(titleSlug: string) {
  // Public query — no session needed
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/",
    },
    body: JSON.stringify({
      query: QUESTION_DETAIL_QUERY,
      variables: { titleSlug },
    }),
  });
  if (!res.ok) throw new Error(`Detail fetch failed: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "GraphQL error");

  const q = json.data.question;
  return {
    difficulty: q.difficulty as string,
    topic: (q.topicTags as { name: string }[])
      .slice(0, 2)
      .map((t) => t.name)
      .join(", "),
  };
}

// ── Paginated Fetch (Incremental) ──

async function fetchAllAcceptedSubmissions(
  sessionCookie: string,
  existingSlugs: Set<string>
): Promise<{
  problems: Map<string, SolvedProblem>;
  earlyExit: boolean;
  pagesScanned: number;
}> {
  const uniqueMap = new Map<string, SolvedProblem>();
  let offset = 0;
  let hasNext = true;
  let earlyExit = false;
  let pagesScanned = 0;

  const useEarlyExit = existingSlugs.size >= EARLY_EXIT_THRESHOLD;
  let consecutiveExisting = 0;

  while (hasNext) {
    const data = await queryLeetCode(
      SUBMISSION_LIST_QUERY,
      { offset, limit: PAGE_SIZE },
      sessionCookie
    );

    pagesScanned++;

    const result = data.submissionList;
    const submissions: RawSubmission[] = result?.submissions ?? [];

    if (submissions.length === 0) break;

    for (const sub of submissions) {
      if (sub.statusDisplay === "Accepted" && !uniqueMap.has(sub.titleSlug)) {
        if (existingSlugs.has(sub.titleSlug)) {
          consecutiveExisting++;
          if (useEarlyExit && consecutiveExisting >= CONSECUTIVE_EXISTING_LIMIT) {
            earlyExit = true;
            break;
          }
        } else {
          consecutiveExisting = 0;
          uniqueMap.set(sub.titleSlug, {
            title: sub.title,
            titleSlug: sub.titleSlug,
            timestamp: sub.timestamp,
          });
        }
      }
    }

    if (earlyExit) break;

    hasNext = result?.hasNext ?? false;
    offset += PAGE_SIZE;
    if (offset > MAX_OFFSET) break;

    if (hasNext) {
      await delay(RATE_LIMIT_MS);
    }
  }

  return { problems: uniqueMap, earlyExit, pagesScanned };
}

// ── Enrich with Difficulty & Topic (cache-first) ──

async function enrichWithDetails(
  slugs: string[],
  supabase: ReturnType<typeof createClient>
): Promise<Map<string, { difficulty: string; topic: string }>> {
  const cacheMap = new Map<string, { difficulty: string; topic: string }>();

  // Check cache in batches
  for (let i = 0; i < slugs.length; i += 1000) {
    const batch = slugs.slice(i, i + 1000);
    const { data: cached } = await supabase
      .from("leetcode_problem_cache")
      .select("title_slug, difficulty, topic")
      .in("title_slug", batch);

    for (const row of cached ?? []) {
      cacheMap.set(row.title_slug, {
        difficulty: row.difficulty,
        topic: row.topic,
      });
    }
  }

  // Fetch uncached in small batches
  const uncachedSlugs = slugs.filter((s) => !cacheMap.has(s));
  const DETAIL_BATCH_SIZE = 5;
  const newCacheEntries: { title_slug: string; difficulty: string; topic: string }[] = [];

  for (let i = 0; i < uncachedSlugs.length; i += DETAIL_BATCH_SIZE) {
    const batch = uncachedSlugs.slice(i, i + DETAIL_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (slug) => {
        const detail = await getQuestionDetail(slug);
        cacheMap.set(slug, detail);
        newCacheEntries.push({ title_slug: slug, ...detail });
      })
    );
    for (const r of results) {
      if (r.status === "rejected") console.error("Detail fetch failed:", r.reason);
    }
    if (i + DETAIL_BATCH_SIZE < uncachedSlugs.length) {
      await delay(100);
    }
  }

  // Persist cache
  if (newCacheEntries.length > 0) {
    for (let i = 0; i < newCacheEntries.length; i += 500) {
      const batch = newCacheEntries.slice(i, i + 500);
      await supabase
        .from("leetcode_problem_cache")
        .upsert(batch, { onConflict: "title_slug" });
    }
  }

  return cacheMap;
}

// ── Batch Insert ──

async function batchInsertProblems(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  problems: EnrichedProblem[]
): Promise<{ inserted: number; skipped: number }> {
  if (problems.length === 0) return { inserted: 0, skipped: 0 };

  const { data: existing } = await supabase
    .from("dsa_problems")
    .select("leetcode_slug")
    .eq("user_id", userId)
    .eq("source", "leetcode");

  const existingSlugs = new Set(
    (existing ?? []).map((r: { leetcode_slug: string }) => r.leetcode_slug)
  );

  const newProblems = problems.filter((p) => !existingSlugs.has(p.titleSlug));
  const skipped = problems.length - newProblems.length;

  if (newProblems.length === 0) return { inserted: 0, skipped };

  const INSERT_BATCH_SIZE = 500;
  let totalInserted = 0;

  for (let i = 0; i < newProblems.length; i += INSERT_BATCH_SIZE) {
    const batch = newProblems.slice(i, i + INSERT_BATCH_SIZE);
    const rows = batch.map((p) => ({
      user_id: userId,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      solved: true,
      date: new Date(Number(p.timestamp) * 1000).toISOString().split("T")[0],
      source: "leetcode",
      leetcode_slug: p.titleSlug,
    }));

    const { data, error } = await supabase
      .from("dsa_problems")
      .insert(rows)
      .select("id");

    if (error) {
      console.error(`Batch insert error for user ${userId}:`, error.message);
    } else {
      totalInserted += (data ?? []).length;
    }
  }

  return { inserted: totalInserted, skipped };
}

// ── Single-User Sync ──

async function syncOneUser(
  supabase: ReturnType<typeof createClient>,
  user: UserRow
): Promise<UserSyncResult> {
  const startTime = Date.now();
  const base: Omit<UserSyncResult, "status" | "durationMs"> = {
    userId: user.user_id,
    username: user.leetcode_username,
    problemsFound: 0,
    problemsInserted: 0,
    pagesScanned: 0,
    earlyExit: false,
  };

  // Mark as syncing
  await supabase
    .from("user_profiles")
    .update({ sync_status: "syncing" })
    .eq("user_id", user.user_id);

  try {
    // Get existing slugs for incremental sync
    const { data: existingRows } = await supabase
      .from("dsa_problems")
      .select("leetcode_slug")
      .eq("user_id", user.user_id)
      .eq("source", "leetcode");

    const existingSlugs = new Set(
      (existingRows ?? []).map((r: { leetcode_slug: string }) => r.leetcode_slug)
    );

    // Paginated fetch
    const fetchResult = await fetchAllAcceptedSubmissions(
      user.leetcode_session,
      existingSlugs
    );

    base.pagesScanned = fetchResult.pagesScanned;
    base.earlyExit = fetchResult.earlyExit;

    const solvedList = Array.from(fetchResult.problems.values());
    base.problemsFound = solvedList.length;

    if (solvedList.length > 0) {
      // Enrich
      const slugs = solvedList.map((s) => s.titleSlug);
      const detailMap = await enrichWithDetails(slugs, supabase);

      const enrichedProblems: EnrichedProblem[] = solvedList.map((sub) => {
        const detail = detailMap.get(sub.titleSlug) ?? {
          difficulty: "Easy",
          topic: "",
        };
        return { ...sub, ...detail };
      });

      // Insert
      const insertResult = await batchInsertProblems(
        supabase,
        user.user_id,
        enrichedProblems
      );
      base.problemsInserted = insertResult.inserted;
    }

    // Update profile
    await supabase
      .from("user_profiles")
      .update({
        sync_status: "healthy",
        last_synced_at: new Date().toISOString(),
        last_sync_error: null,
        last_sync_problems_found: base.problemsFound,
        last_sync_problems_inserted: base.problemsInserted,
      })
      .eq("user_id", user.user_id);

    return {
      ...base,
      status: "success",
      durationMs: Date.now() - startTime,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isExpired = message === "SESSION_EXPIRED";

    await supabase
      .from("user_profiles")
      .update({
        sync_status: isExpired ? "expired_session" : "error",
        last_sync_error: message,
      })
      .eq("user_id", user.user_id);

    return {
      ...base,
      status: isExpired ? "expired_session" : "error",
      errorMessage: message,
      durationMs: Date.now() - startTime,
    };
  }
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { cronSecret, triggeredBy } = body as {
      cronSecret?: string;
      triggeredBy?: string;
    };

    // Validate cron secret
    const expectedSecret = Deno.env.get("CRON_SECRET");
    if (!expectedSecret || cronSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query eligible users
    const { data: users, error: queryError } = await supabase
      .from("user_profiles")
      .select("user_id, leetcode_username, leetcode_session")
      .neq("leetcode_session", "")
      .neq("leetcode_username", "")
      .neq("sync_status", "syncing")
      .eq("cron_sync_enabled", true)
      .limit(MAX_USERS_PER_RUN);

    if (queryError) {
      throw new Error(`Failed to query users: ${queryError.message}`);
    }

    const eligibleUsers: UserRow[] = (users ?? []).filter(
      (u: UserRow) => u.leetcode_session && u.leetcode_username
    );

    if (eligibleUsers.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No eligible users for sync",
          usersProcessed: 0,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const results: UserSyncResult[] = [];
    const trigger = triggeredBy === "manual" ? "manual" : "cron";

    for (let i = 0; i < eligibleUsers.length; i++) {
      const user = eligibleUsers[i];
      console.log(
        `[${i + 1}/${eligibleUsers.length}] Syncing ${user.leetcode_username}...`
      );

      const result = await syncOneUser(supabase, user);
      results.push(result);

      // Log to sync_logs table
      await supabase.from("sync_logs").insert({
        user_id: user.user_id,
        completed_at: new Date().toISOString(),
        status: result.status,
        mode: "incremental",
        problems_found: result.problemsFound,
        problems_inserted: result.problemsInserted,
        pages_scanned: result.pagesScanned,
        early_exit: result.earlyExit,
        error_message: result.errorMessage ?? null,
        triggered_by: trigger,
      });

      console.log(
        `[${i + 1}/${eligibleUsers.length}] ${user.leetcode_username}: ${result.status} — ` +
          `${result.problemsInserted} new, ${result.pagesScanned} pages, ${result.durationMs}ms`
      );

      // Delay between users (skip after last user)
      if (i < eligibleUsers.length - 1) {
        await delay(INTER_USER_DELAY_MS);
      }
    }

    const summary = {
      usersProcessed: results.length,
      successful: results.filter((r) => r.status === "success").length,
      errors: results.filter((r) => r.status === "error").length,
      expiredSessions: results.filter((r) => r.status === "expired_session").length,
      totalNewProblems: results.reduce((sum, r) => sum + r.problemsInserted, 0),
      triggeredBy: trigger,
      results,
    };

    console.log(
      `Batch sync complete: ${summary.usersProcessed} users, ` +
        `${summary.successful} ok, ${summary.errors} errors, ` +
        `${summary.expiredSessions} expired, ${summary.totalNewProblems} new problems`
    );

    return new Response(JSON.stringify(summary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Batch sync error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
