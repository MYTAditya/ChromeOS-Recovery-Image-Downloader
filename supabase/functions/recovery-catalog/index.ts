import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SOURCES = [
  "https://dl.google.com/dl/edgedl/chromeos/recovery/recovery2.json",
  "https://dl.google.com/dl/edgedl/chromeos/recovery/cloudready_recovery2.json",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const results = await Promise.allSettled(
      SOURCES.map(async (url) => {
        const res = await fetch(url, { headers: { "User-Agent": "ChromeOS-Recovery-Downloader" } });
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error(`Unexpected shape from ${url}`);
        return json;
      })
    );

    const combined: unknown[] = [];
    const errors: string[] = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        combined.push(...r.value);
      } else {
        errors.push(`${SOURCES[i]}: ${r.reason?.message ?? String(r.reason)}`);
      }
    });

    if (combined.length === 0) {
      return new Response(
        JSON.stringify({ error: "All sources failed", details: errors }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const seen = new Set<string>();
    const deduped = combined.filter((e: any) => {
      if (!e || !e.channel || !e.manufacturer || !e.model) return false;
      const key = `${e.channel}|${e.manufacturer}|${e.model}|${e.version ?? ""}|${e.url ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return new Response(JSON.stringify({ records: deduped, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
