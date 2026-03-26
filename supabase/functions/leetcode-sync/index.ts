// supabase/functions/leetcode-sync/index.ts
// Production-level LeetCode submission sync with pagination (20 per page),
// rate limiting, incremental sync, and batch inserts.
// Uses LEETCODE_SESSION cookie (stored server-side) for paginated submissionList.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const PAGE_SIZE = 20;
const RATE_LIMIT_MS = 200; // 200ms between paginated requests (spec: 100–300ms)
const MAX_OFFSET = 10_000; // Safety cap to prevent runaway loops

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── GraphQL Queries ──

// Full sync: paginated submission list (requires LEETCODE_SESSION cookie)
// Fetches ALL submissions 20-at-a-time using offset/limit pagination
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

// Quick sync: recent accepted submissions (public API, no cookie)
const RECENT_AC_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
    }
  }
`;

// Enrich problems with difficulty & topic tags (public, no cookie)
const QUESTION_DETAIL_QUERY = `
  query questionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      difficulty
      topicTags { name }
    }
  }
`;

// ── Helpers ──

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function queryLeetCode(
  query: string,
  variables: Record<string, unknown>,
  sessionCookie?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Referer: "https://leetcode.com/submissions/",
  };
  if (sessionCookie) {
    headers["Cookie"] = `LEETCODE_SESSION=${sessionCookie}`;
  }

  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`LeetCode API returned ${res.status}`);
  const json = await res.json();
  if (json.errors)
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  return json.data;
}

async function getQuestionDetail(titleSlug: string) {
  const data = await queryLeetCode(QUESTION_DETAIL_QUERY, { titleSlug });
  const q = data.question;
  return {
    difficulty: q.difficulty as string,
    topic: (q.topicTags as { name: string }[])
      .slice(0, 2)
      .map((t) => t.name)
      .join(", "),
  };
}

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

// ══════════════════════════════════════════════════════════════
// Full Sync: Paginated fetch — 20 submissions per page
// ══════════════════════════════════════════════════════════════
// Production pagination strategy (from implement_leetcode.md):
//   1. Start with offset = 0
//   2. Fetch submissions in batches of 20
//   3. Increment offset by 20
//   4. Stop when empty response is returned
//   + Rate limiting: 200ms delay between requests
//   + Deduplication: keeps only first (most recent) accepted per titleSlug
//   + Skips already-synced slugs (doesn't re-add them)
//   + Incremental mode: if user already has 50+ problems synced,
//     uses early exit when hitting a streak of consecutive existing slugs
//     (means we've reached already-synced territory)

const EARLY_EXIT_THRESHOLD = 50; // Only use early exit if user has 50+ existing problems
const CONSECUTIVE_EXISTING_LIMIT = 20; // Exit after 20 consecutive existing accepted slugs

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

  // Only use early exit for incremental syncs (user already has many synced problems)
  const useEarlyExit = existingSlugs.size >= EARLY_EXIT_THRESHOLD;
  let consecutiveExisting = 0;

  while (hasNext) {
    // Fetch one page of 20 submissions
    const data = await queryLeetCode(
      SUBMISSION_LIST_QUERY,
      { offset, limit: PAGE_SIZE },
      sessionCookie
    );

    pagesScanned++;

    const result = data.submissionList;
    const submissions: RawSubmission[] = result?.submissions ?? [];

    // Step 4: Stop when empty response is returned
    if (submissions.length === 0) break;

    // Filter for Accepted, keep first (most recent) per slug
    for (const sub of submissions) {
      if (sub.statusDisplay === "Accepted" && !uniqueMap.has(sub.titleSlug)) {
        if (existingSlugs.has(sub.titleSlug)) {
          // Skip already-synced problems (don't add to map)
          consecutiveExisting++;

          // Incremental sync: if we hit many consecutive existing slugs in a row,
          // we've reached already-synced territory — safe to stop
          if (useEarlyExit && consecutiveExisting >= CONSECUTIVE_EXISTING_LIMIT) {
            earlyExit = true;
            break;
          }
        } else {
          // New problem — add it
          consecutiveExisting = 0; // Reset streak
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

    // Step 3: Increment offset by limit (20)
    offset += PAGE_SIZE;

    // Safety cap to prevent runaway loops
    if (offset > MAX_OFFSET) break;

    // Rate limiting: 200ms delay between requests (spec: 100–300ms)
    if (hasNext) {
      await delay(RATE_LIMIT_MS);
    }
  }

  return { problems: uniqueMap, earlyExit, pagesScanned };
}

// ── Quick Sync: Recent accepted submissions (public, no cookie) ──

async function fetchRecentSolved(
  username: string
): Promise<SolvedProblem[]> {
  const acData = await queryLeetCode(RECENT_AC_QUERY, {
    username: username.trim(),
    limit: 100,
  });

  const submissions = acData.recentAcSubmissionList ?? [];
  const uniqueMap = new Map<string, SolvedProblem>();
  for (const sub of submissions) {
    if (!uniqueMap.has(sub.titleSlug)) {
      uniqueMap.set(sub.titleSlug, sub);
    }
  }
  return Array.from(uniqueMap.values());
}

// ── Enrich problems with difficulty & topic (with caching) ──

async function enrichWithDetails(
  slugs: string[],
  supabase: ReturnType<typeof createClient>
): Promise<Map<string, { difficulty: string; topic: string }>> {
  const cacheMap = new Map<string, { difficulty: string; topic: string }>();

  // 1. Check cache in batches (Supabase .in() limit ~1000)
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

  // 2. Fetch details for uncached problems in small batches
  const uncachedSlugs = slugs.filter((s) => !cacheMap.has(s));
  const DETAIL_BATCH_SIZE = 5;
  const newCacheEntries: {
    title_slug: string;
    difficulty: string;
    topic: string;
  }[] = [];

  for (let i = 0; i < uncachedSlugs.length; i += DETAIL_BATCH_SIZE) {
    const batch = uncachedSlugs.slice(i, i + DETAIL_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (slug) => {
        const detail = await getQuestionDetail(slug);
        cacheMap.set(slug, detail);
        newCacheEntries.push({
          title_slug: slug,
          difficulty: detail.difficulty,
          topic: detail.topic,
        });
      })
    );
    for (const r of results) {
      if (r.status === "rejected")
        console.error("Detail fetch failed:", r.reason);
    }

    // Rate limit detail fetches too
    if (i + DETAIL_BATCH_SIZE < uncachedSlugs.length) {
      await delay(100);
    }
  }

  // 3. Persist new cache entries in batches
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

// ── Batch insert into dsa_problems ──

async function batchInsertProblems(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  problems: EnrichedProblem[]
): Promise<{ inserted: number; skipped: number }> {
  if (problems.length === 0) return { inserted: 0, skipped: 0 };

  // 1. Get existing leetcode slugs for this user
  const { data: existing } = await supabase
    .from("dsa_problems")
    .select("leetcode_slug")
    .eq("user_id", userId)
    .eq("source", "leetcode");

  const existingSlugs = new Set(
    (existing ?? []).map((r: { leetcode_slug: string }) => r.leetcode_slug)
  );

  // 2. Filter to only new problems
  const newProblems = problems.filter((p) => !existingSlugs.has(p.titleSlug));
  const skipped = problems.length - newProblems.length;

  if (newProblems.length === 0) return { inserted: 0, skipped };

  // 3. Batch insert (500 rows per batch)
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
      console.error("Batch insert error:", error.message);
    } else {
      totalInserted += (data ?? []).length;
    }
  }

  return { inserted: totalInserted, skipped };
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { username, userId, useFullSync } = body as {
      username?: string;
      userId?: string;
      useFullSync?: boolean;
    };

    if (!username || typeof username !== "string") {
      return new Response(
        JSON.stringify({ error: "username is required" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    if (!userId || typeof userId !== "string") {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase admin client (service role — bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let mode: "full" | "quick";
    let totalFound = 0;
    let inserted = 0;
    let skipped = 0;
    let earlyExit = false;
    let pagesScanned = 0;

    if (useFullSync) {
      // ══════════════════════════════════════════════════════
      // FULL SYNC — paginated submissionList, 20 per page
      // Uses LEETCODE_SESSION cookie stored in user_profiles
      // ══════════════════════════════════════════════════════
      mode = "full";

      // Retrieve session cookie from server-side storage
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("leetcode_session")
        .eq("user_id", userId)
        .single();

      const sessionCookie = profile?.leetcode_session;
      if (!sessionCookie) {
        return new Response(
          JSON.stringify({
            error:
              "No LeetCode session cookie found. Save it in Settings first.",
          }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      // Get existing slugs for incremental sync (early exit optimization)
      const { data: existingRows } = await supabase
        .from("dsa_problems")
        .select("leetcode_slug")
        .eq("user_id", userId)
        .eq("source", "leetcode");

      const existingSlugs = new Set(
        (existingRows ?? []).map(
          (r: { leetcode_slug: string }) => r.leetcode_slug
        )
      );

      // Paginated fetch: 20 submissions per page with rate limiting
      const result = await fetchAllAcceptedSubmissions(
        sessionCookie,
        existingSlugs
      );
      earlyExit = result.earlyExit;
      pagesScanned = result.pagesScanned;

      if (result.problems.size === 0 && existingSlugs.size === 0) {
        return new Response(
          JSON.stringify({
            error:
              "No solved problems found. Your session cookie may be expired — get a fresh one from LeetCode.",
          }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        );
      }

      const solvedList = Array.from(result.problems.values());
      totalFound = solvedList.length;

      if (totalFound > 0) {
        // Enrich with difficulty & topic
        const slugs = solvedList.map((s) => s.titleSlug);
        const detailMap = await enrichWithDetails(slugs, supabase);

        const enrichedProblems: EnrichedProblem[] = solvedList.map((sub) => {
          const detail = detailMap.get(sub.titleSlug) ?? {
            difficulty: "Easy",
            topic: "",
          };
          return {
            ...sub,
            difficulty: detail.difficulty,
            topic: detail.topic,
          };
        });

        // Batch insert into database (server-side)
        const insertResult = await batchInsertProblems(
          supabase,
          userId,
          enrichedProblems
        );
        inserted = insertResult.inserted;
        skipped = insertResult.skipped;
      }

      // Update last synced timestamp
      await supabase
        .from("user_profiles")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("user_id", userId);
    } else {
      // ══════════════════════════════════════════════════════
      // QUICK SYNC — public API, most recent ~20 solved
      // No cookie needed — uses username directly
      // ══════════════════════════════════════════════════════
      mode = "quick";

      const uniqueSubmissions = await fetchRecentSolved(username);
      totalFound = uniqueSubmissions.length;

      if (totalFound > 0) {
        const slugs = uniqueSubmissions.map((s) => s.titleSlug);
        const detailMap = await enrichWithDetails(slugs, supabase);

        const enrichedProblems: EnrichedProblem[] = uniqueSubmissions.map(
          (sub) => {
            const detail = detailMap.get(sub.titleSlug) ?? {
              difficulty: "Easy",
              topic: "",
            };
            return {
              ...sub,
              difficulty: detail.difficulty,
              topic: detail.topic,
            };
          }
        );

        const insertResult = await batchInsertProblems(
          supabase,
          userId,
          enrichedProblems
        );
        inserted = insertResult.inserted;
        skipped = insertResult.skipped;
      }

      // Update last synced timestamp
      await supabase
        .from("user_profiles")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("user_id", userId);
    }

    return new Response(
      JSON.stringify({
        mode,
        totalFound,
        inserted,
        skipped,
        earlyExit,
        pagesScanned,
        message: earlyExit
          ? `Incremental sync: scanned ${pagesScanned} pages, found ${totalFound} new problems (${inserted} inserted)`
          : `${mode === "full" ? "Full" : "Quick"} sync: scanned ${pagesScanned} pages, found ${totalFound} problems (${inserted} new, ${skipped} already existed)`,
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("leetcode-sync error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
