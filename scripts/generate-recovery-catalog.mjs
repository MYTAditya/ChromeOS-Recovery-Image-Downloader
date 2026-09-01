#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCES = [
  'https://dl.google.com/dl/edgedl/chromeos/recovery/recovery2.json',
  'https://dl.google.com/dl/edgedl/chromeos/recovery/cloudready_recovery2.json',
];

const OUTPUT_PATHS = [
  path.resolve('public/catalog/recovery-catalog.json'),
];

async function fetchSource(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'ChromeOS-Recovery-Image-Downloader' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected payload shape (expected an array)');
  }
  return data;
}

async function main() {
  const results = await Promise.allSettled(SOURCES.map(fetchSource));

  const combined = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      combined.push(...result.value);
      console.log(`OK  ${SOURCES[i]} (${result.value.length} records)`);
    } else {
      console.error(`FAIL ${SOURCES[i]}: ${result.reason?.message ?? result.reason}`);
    }
  });

  if (results.every((r) => r.status === 'rejected')) {
    console.error('All sources failed; leaving the existing catalog untouched.');
    process.exit(1);
  }

  const seen = new Set();
  const deduped = combined.filter((e) => {
    if (!e || !e.channel || !e.manufacturer || !e.model) return false;
    const key = `${e.channel}|${e.manufacturer}|${e.model}|${e.version ?? ''}|${e.url ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length === 0) {
    console.error('No valid records after filtering/dedupe; leaving the existing catalog untouched.');
    process.exit(1);
  }
  
  const json = `${JSON.stringify(deduped, null, 2)}\n`;

  for (const outputPath of OUTPUT_PATHS) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, json, 'utf8');
    console.log(`Wrote ${deduped.length} records -> ${path.relative(process.cwd(), outputPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
