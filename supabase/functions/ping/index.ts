// supabase/functions/ping/index.ts
// Lightweight health check to prevent Supabase from pausing due to inactivity.
// Called every 10 minutes by pg_cron.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing Supabase configuration",
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Perform a simple database query to keep the connection active
    const { data, error } = await supabase
      .from("app_config")
      .select("key")
      .limit(1);

    if (error) {
      console.error("Ping query error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Supabase ping successful",
        timestamp: new Date().toISOString(),
        data,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Ping function error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
}

Deno.serve(handler);
