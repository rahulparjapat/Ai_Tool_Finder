// ============================================================================
// scripts/fetch-favicons.mjs
// ----------------------------------------------------------------------------
// One-off (re-runnable) utility script — NOT part of the site build itself.
// Downloads each tool's official favicon ONCE and saves it locally into
// public/images/logos/, using Google's public favicon service as the
// fetch source (https://www.google.com/s2/favicons?domain=...).
//
// Why fetch-and-save instead of embedding a live external URL on every
// page load:
//   1. A live external embed would silently break in the sandboxed preview
//      environment (no network access there).
//   2. It removes an ongoing runtime dependency on a third-party service —
//      once downloaded, the site is fully self-contained and still $0 to run.
//   3. It's easy to audit/replace any specific logo file by hand later
//      (e.g. if a company's brand guidelines are checked and a different
//      asset is preferred).
//
// IMPORTANT — usage note, not just a technical comment: these are each
// company's official small site icon (favicon), not their full wordmark
// logo. This was a deliberate choice — see PROJECT_OVERVIEW.md for the
// reasoning on why full trademarked logos are not reproduced on this site.
// Run again any time to pick up new tools added to tools.json:
//   node scripts/fetch-favicons.mjs
// ============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const toolsFile = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/tools.json"), "utf8"));
const tools = toolsFile.tools;

const OUT_DIR = path.join(ROOT, "public/images/logos");
fs.mkdirSync(OUT_DIR, { recursive: true });

function domainFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function fetchFavicon(domain, destPath) {
  // Google's public favicon endpoint — no API key required, returns a PNG.
  const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  const res = await fetch(src, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Google returns a small generic globe icon (a known ~500-600 byte PNG)
  // when it has no real favicon for a domain — skip saving those so we
  // don't silently ship a meaningless placeholder as if it were real.
  if (buf.length < 800) throw new Error("looks like a generic fallback icon, skipping");
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function main() {
  let ok = 0;
  let failed = [];

  for (const tool of tools) {
    const domain = domainFromUrl(tool.website);
    const destPath = path.join(OUT_DIR, `${tool.slug}.png`);

    if (!domain) {
      failed.push({ slug: tool.slug, reason: "invalid website URL" });
      continue;
    }

    try {
      const bytes = await fetchFavicon(domain, destPath);
      console.log(`OK   ${tool.slug.padEnd(24)} ${domain.padEnd(28)} ${bytes}B`);
      ok++;
    } catch (err) {
      failed.push({ slug: tool.slug, reason: err.message });
      console.log(`FAIL ${tool.slug.padEnd(24)} ${domain.padEnd(28)} ${err.message}`);
    }

    // Small delay to be a polite, non-hammering client of a free public service.
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`\nDone: ${ok}/${tools.length} favicons saved to public/images/logos/`);
  if (failed.length) {
    console.log(`\n${failed.length} tool(s) still need a logo (will fall back to the monogram badge):`);
    failed.forEach((f) => console.log(`  - ${f.slug}: ${f.reason}`));
  }
}

main();
