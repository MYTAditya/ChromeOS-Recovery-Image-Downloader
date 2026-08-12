import type { VercelRequest, VercelResponse } from '@vercel/node';

const SOURCES = [
  "https://dl.google.com/dl/edgedl/chromeos/recovery/recovery2.json",
  "https://dl.google.com/dl/edgedl/chromeos/recovery/cloudready_recovery2.json",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const results = await Promise.allSettled(
      SOURCES.map(async (url) => {
        const response = await fetch(url, { headers: { "User-Agent": "ChromeOS-Recovery-Image-Downloader" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      })
    );

    const combined: any[] = [];
    results.forEach((r) => {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        combined.push(...r.value);
      }
    });

    const seen = new Set<string>();
    const deduped = combined.filter((e: any) => {
      if (!e || !e.channel || !e.manufacturer || !e.model) return false;
      const key = `${e.channel}|${e.manufacturer}|${e.model}|${e.version ?? ""}|${e.url ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return res.status(200).json({ records: deduped });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
