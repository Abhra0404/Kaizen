// supabase/functions/leetcode-sync/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── GraphQL Queries ──

const RECENT_AC_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
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

// ── Helpers ──

async function queryLeetCode(
  query: string,
  variables: Record<string, unknown>
) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    difficulty: q.difficulty as string, // "Easy" | "Medium" | "Hard"
    topic: (q.topicTags as { name: string }[])
      .slice(0, 2)
      .map((t) => t.name)
      .join(", "), // e.g. "Array, Hash Table"
  };
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { username, limit = 50 } = await req.json();

    if (!username || typeof username !== "string") {
      return new Response(
        JSON.stringify({ error: "username is required" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // 1. Fetch recent accepted submissions
    const acData = await queryLeetCode(RECENT_AC_QUERY, {
      username: username.trim(),
      limit: Math.min(limit, 100),
    });

    const submissions = acData.recentAcSubmissionList ?? [];

    // Deduplicate by titleSlug (user may have solved same problem multiple times)
    const uniqueMap = new Map<
      string,
      { title: string; titleSlug: string; timestamp: string }
    >();
    for (const sub of submissions) {
      if (!uniqueMap.has(sub.titleSlug)) {
        uniqueMap.set(sub.titleSlug, sub);
      }
    }
    const uniqueSubmissions = Array.from(uniqueMap.values());

    // 2. Check cache in Supabase for known problem details
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const slugs = uniqueSubmissions.map((s) => s.titleSlug);
    const { data: cached } = await supabase
      .from("leetcode_problem_cache")
      .select("title_slug, difficulty, topic")
      .in("title_slug", slugs);

    const cacheMap = new Map<
      string,
      { difficulty: string; topic: string }
    >();
    for (const row of cached ?? []) {
      cacheMap.set(row.title_slug, {
        difficulty: row.difficulty,
        topic: row.topic,
      });
    }

    // 3. Fetch details for uncached problems (with concurrency limit)
    const uncached = uniqueSubmissions.filter(
      (s) => !cacheMap.has(s.titleSlug)
    );
    const BATCH_SIZE = 5;
    const newCacheEntries: {
      title_slug: string;
      difficulty: string;
      topic: string;
    }[] = [];

    for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
      const batch = uncached.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(async (sub) => {
          const detail = await getQuestionDetail(sub.titleSlug);
          cacheMap.set(sub.titleSlug, detail);
          newCacheEntries.push({
            title_slug: sub.titleSlug,
            difficulty: detail.difficulty,
            topic: detail.topic,
          });
        })
      );
      // Log failures but don't crash the whole request
      for (const r of results) {
        if (r.status === "rejected")
          console.error("Detail fetch failed:", r.reason);
      }
    }

    // 4. Persist new cache entries (non-blocking upsert)
    if (newCacheEntries.length > 0) {
      await supabase
        .from("leetcode_problem_cache")
        .upsert(newCacheEntries, { onConflict: "title_slug" });
    }

    // 5. Build final response
    const problems = uniqueSubmissions.map((sub) => {
      const detail = cacheMap.get(sub.titleSlug) ?? {
        difficulty: "Easy",
        topic: "",
      };
      return {
        title: sub.title,
        titleSlug: sub.titleSlug,
        difficulty: detail.difficulty,
        topic: detail.topic,
        timestamp: sub.timestamp,
      };
    });

    return new Response(
      JSON.stringify({ problems, count: problems.length }),
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
