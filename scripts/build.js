#!/usr/bin/env node
/**
 * AI Tool Finder — static site generator
 * Zero dependencies. Pure Node.js. Reads /data/*.json, writes plain HTML into /dist.
 * Run: node scripts/build.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const DIST_DIR = path.join(ROOT, "dist");
const SITE_DIR = path.join(ROOT, "site");

const SITE_NAME = "AI Tool Finder";
const SITE_URL = "https://example.com"; // TODO: replace with your real domain once deployed
const SITE_DESC = "Find, compare, and pick the best AI tools — chatbots, writing, image, video, coding, and more.";

const tools = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "tools.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "categories.json"), "utf8"));

const toolBySlug = Object.fromEntries(tools.map((t) => [t.slug, t]));
const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

// ---------- helpers ----------
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toolsInCategory(catSlug) {
  return tools.filter((t) => t.categories.includes(catSlug));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(relPath, content) {
  const full = path.join(DIST_DIR, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, "utf8");
}

// ---------- layout ----------
function layout({ title, description, canonicalPath, bodyHtml, jsonLd }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="${relPrefix(canonicalPath)}assets/style.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${relPrefix(canonicalPath)}index.html">${SITE_NAME}</a>
    <nav>
      <a href="${relPrefix(canonicalPath)}categories/index.html">Categories</a>
      <a href="${relPrefix(canonicalPath)}tools/index.html">All Tools</a>
      <a href="${relPrefix(canonicalPath)}compare/index.html">Compare</a>
    </nav>
  </div>
</header>
<main class="wrap">
${bodyHtml}
</main>
<footer class="site-footer">
  <div class="wrap">
    <p>${SITE_NAME} — independent AI tool reviews and comparisons. Some links may be affiliate links, at no extra cost to you.</p>
  </div>
</footer>
</body>
</html>`;
}

// crude relative-path prefix calculator based on folder depth
function relPrefix(canonicalPath) {
  const depth = canonicalPath.split("/").filter(Boolean).length - 1; // subtract file itself
  return depth > 0 ? "../".repeat(depth) : "./";
}

// ---------- page builders ----------
function buildHome() {
  const catCards = categories
    .map(
      (c) => `
    <a class="card" href="categories/${c.slug}/index.html">
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.description)}</p>
      <span class="count">${toolsInCategory(c.slug).length} tools</span>
    </a>`
    )
    .join("\n");

  const body = `
  <section class="hero">
    <h1>Find the Best AI Tool for Any Task</h1>
    <p>Independent, up-to-date comparisons of AI chatbots, writing tools, image &amp; video generators, coding assistants, and more.</p>
  </section>
  <section>
    <h2>Browse by Category</h2>
    <div class="grid">${catCards}</div>
  </section>`;

  writeFile(
    "index.html",
    layout({
      title: `${SITE_NAME} — Compare the Best AI Tools (2026)`,
      description: SITE_DESC,
      canonicalPath: "/index.html",
      bodyHtml: body,
    })
  );
}

function buildCategoryIndex() {
  const rows = categories
    .map((c) => `<li><a href="${c.slug}/index.html">${esc(c.name)}</a> — ${toolsInCategory(c.slug).length} tools</li>`)
    .join("\n");
  const body = `<h1>AI Tool Categories</h1><ul class="plain-list">${rows}</ul>`;
  writeFile(
    "categories/index.html",
    layout({
      title: `AI Tool Categories — ${SITE_NAME}`,
      description: "Browse every AI tool category we cover: chatbots, writing, image generation, video, coding, and more.",
      canonicalPath: "/categories/index.html",
      bodyHtml: body,
    })
  );
}

function buildCategoryPages() {
  categories.forEach((c) => {
    const list = toolsInCategory(c.slug);
    const rows = list
      .map(
        (t) => `
      <a class="card" href="../../tools/${t.slug}/index.html">
        <h3>${esc(t.name)} <span class="maker">by ${esc(t.maker)}</span></h3>
        <p>${esc(t.tagline)}</p>
        <span class="pricing">${t.hasFreeTier ? "✅ Free tier available" : "💲 Paid only"} — ${esc(t.pricing)}</span>
      </a>`
      )
      .join("\n");

    const body = `
    <h1>Best ${esc(c.name)} (2026)</h1>
    <p>${esc(c.description)}</p>
    <div class="grid">${rows}</div>`;

    writeFile(
      `categories/${c.slug}/index.html`,
      layout({
        title: `Best ${c.name} in 2026 — ${SITE_NAME}`,
        description: `Compare the best ${c.name.toLowerCase()} in 2026. ${c.description}`,
        canonicalPath: `/categories/${c.slug}/index.html`,
        bodyHtml: body,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Best ${c.name}`,
          itemListElement: list.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.name,
            url: `${SITE_URL}/tools/${t.slug}/index.html`,
          })),
        },
      })
    );
  });
}

function buildToolsIndex() {
  const rows = tools
    .map((t) => `<li><a href="${t.slug}/index.html">${esc(t.name)}</a> — ${esc(t.tagline)}</li>`)
    .join("\n");
  const body = `<h1>All AI Tools</h1><ul class="plain-list">${rows}</ul>`;
  writeFile(
    "tools/index.html",
    layout({
      title: `All AI Tools — ${SITE_NAME}`,
      description: "Full directory of every AI tool reviewed on the site.",
      canonicalPath: "/tools/index.html",
      bodyHtml: body,
    })
  );
}

function buildToolPages() {
  tools.forEach((t) => {
    const alts = tools.filter(
      (o) => o.slug !== t.slug && o.categories.some((c) => t.categories.includes(c))
    ).slice(0, 4);

    const prosHtml = t.pros.map((p) => `<li>${esc(p)}</li>`).join("");
    const consHtml = t.cons.map((p) => `<li>${esc(p)}</li>`).join("");
    const catLinks = t.categories
      .map((cs) => `<a href="../../categories/${cs}/index.html">${esc(catBySlug[cs].name)}</a>`)
      .join(", ");
    const altsHtml = alts
      .map(
        (a) => `<a class="card small" href="../${a.slug}/index.html"><h4>${esc(a.name)}</h4><p>${esc(a.tagline)}</p></a>`
      )
      .join("\n");

    const body = `
    <article>
      <h1>${esc(t.name)} Review (2026): Pricing, Features &amp; Alternatives</h1>
      <p class="lede">${esc(t.tagline)}</p>
      <table class="specs">
        <tr><th>Maker</th><td>${esc(t.maker)}</td></tr>
        <tr><th>Category</th><td>${catLinks}</td></tr>
        <tr><th>Pricing</th><td>${esc(t.pricing)}</td></tr>
        <tr><th>Free tier</th><td>${t.hasFreeTier ? "Yes" : "No"}</td></tr>
        <tr><th>Website</th><td><a rel="nofollow sponsored noopener" target="_blank" href="${esc(t.website)}">Visit ${esc(t.name)} →</a></td></tr>
      </table>

      <h2>Best for</h2>
      <p>${esc(t.bestFor)}</p>

      <div class="pros-cons">
        <div><h3>Pros</h3><ul>${prosHtml}</ul></div>
        <div><h3>Cons</h3><ul>${consHtml}</ul></div>
      </div>

      ${alts.length ? `<h2>Alternatives to ${esc(t.name)}</h2><div class="grid">${altsHtml}</div>` : ""}
    </article>`;

    writeFile(
      `tools/${t.slug}/index.html`,
      layout({
        title: `${t.name} Review 2026: Pricing, Pros & Cons — ${SITE_NAME}`,
        description: `${t.tagline} See pricing, pros, cons, and the best alternatives to ${t.name}.`,
        canonicalPath: `/tools/${t.slug}/index.html`,
        bodyHtml: body,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: t.name,
          applicationCategory: "AI Tool",
          offers: { "@type": "Offer", price: t.hasFreeTier ? "0" : "", priceCurrency: "USD" },
          description: t.tagline,
        },
      })
    );

    // Alternatives page: /alternatives/[tool]/index.html
    const altBody = `
    <article>
      <h1>Best Free Alternatives to ${esc(t.name)} (2026)</h1>
      <p>Looking for a free or cheaper alternative to ${esc(t.name)}? Here are the top options.</p>
      <div class="grid">
        ${alts
          .map(
            (a) => `<a class="card" href="../../tools/${a.slug}/index.html">
              <h3>${esc(a.name)}</h3>
              <p>${esc(a.tagline)}</p>
              <span class="pricing">${a.hasFreeTier ? "✅ Free tier available" : "💲 Paid only"}</span>
            </a>`
          )
          .join("\n")}
      </div>
    </article>`;
    writeFile(
      `alternatives/${t.slug}/index.html`,
      layout({
        title: `Best Free Alternatives to ${t.name} in 2026 — ${SITE_NAME}`,
        description: `Top free and paid alternatives to ${t.name} in 2026, compared side by side.`,
        canonicalPath: `/alternatives/${t.slug}/index.html`,
        bodyHtml: altBody,
      })
    );
  });
}

function buildComparePages() {
  const pairs = [];
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const a = tools[i], b = tools[j];
      const shared = a.categories.some((c) => b.categories.includes(c));
      if (shared) pairs.push([a, b]);
    }
  }

  const indexRows = pairs
    .map(([a, b]) => `<li><a href="${a.slug}-vs-${b.slug}/index.html">${esc(a.name)} vs ${esc(b.name)}</a></li>`)
    .join("\n");
  writeFile(
    "compare/index.html",
    layout({
      title: `AI Tool Comparisons — ${SITE_NAME}`,
      description: "Head-to-head comparisons between popular AI tools.",
      canonicalPath: "/compare/index.html",
      bodyHtml: `<h1>AI Tool Comparisons</h1><ul class="plain-list">${indexRows}</ul>`,
    })
  );

  pairs.forEach(([a, b]) => {
    const rowsHtml = `
    <tr><th>Maker</th><td>${esc(a.maker)}</td><td>${esc(b.maker)}</td></tr>
    <tr><th>Pricing</th><td>${esc(a.pricing)}</td><td>${esc(b.pricing)}</td></tr>
    <tr><th>Free tier</th><td>${a.hasFreeTier ? "Yes" : "No"}</td><td>${b.hasFreeTier ? "Yes" : "No"}</td></tr>
    <tr><th>Best for</th><td>${esc(a.bestFor)}</td><td>${esc(b.bestFor)}</td></tr>`;

    const body = `
    <article>
      <h1>${esc(a.name)} vs ${esc(b.name)} (2026): Which Should You Use?</h1>
      <p>${esc(a.name)} and ${esc(b.name)} are both popular tools in the ${esc(catBySlug[a.categories.find(c=>b.categories.includes(c))].name)} space. Here's how they compare.</p>
      <table class="compare-table">
        <tr><th></th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr>
        ${rowsHtml}
      </table>
      <div class="two-col">
        <div>
          <h2>${esc(a.name)}</h2>
          <p>${esc(a.tagline)}</p>
          <a class="btn" href="../../tools/${a.slug}/index.html">Read full ${esc(a.name)} review →</a>
        </div>
        <div>
          <h2>${esc(b.name)}</h2>
          <p>${esc(b.tagline)}</p>
          <a class="btn" href="../../tools/${b.slug}/index.html">Read full ${esc(b.name)} review →</a>
        </div>
      </div>
    </article>`;

    writeFile(
      `compare/${a.slug}-vs-${b.slug}/index.html`,
      layout({
        title: `${a.name} vs ${b.name} (2026 Comparison) — ${SITE_NAME}`,
        description: `${a.name} vs ${b.name}: compare pricing, features, and which one is best for you in 2026.`,
        canonicalPath: `/compare/${a.slug}-vs-${b.slug}/index.html`,
        bodyHtml: body,
      })
    );
  });

  return pairs.length;
}

function buildStaticAssets() {
  ensureDir(path.join(DIST_DIR, "assets"));
  fs.copyFileSync(path.join(SITE_DIR, "assets", "style.css"), path.join(DIST_DIR, "assets", "style.css"));
  // 404 page
  writeFile(
    "404.html",
    layout({
      title: `Page Not Found — ${SITE_NAME}`,
      description: "This page could not be found.",
      canonicalPath: "/404.html",
      bodyHtml: `<h1>404 — Page Not Found</h1><p><a href="index.html">Go back home</a></p>`,
    })
  );
}

function buildSitemap(allPaths) {
  const urls = allPaths
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml, "utf8");

  const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST_DIR, "robots.txt"), robots, "utf8");
}

function collectAllPaths() {
  const paths = ["/index.html", "/categories/index.html", "/tools/index.html", "/compare/index.html"];
  categories.forEach((c) => paths.push(`/categories/${c.slug}/index.html`));
  tools.forEach((t) => {
    paths.push(`/tools/${t.slug}/index.html`);
    paths.push(`/alternatives/${t.slug}/index.html`);
  });
  return paths;
}

// ---------- run ----------
function main() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  ensureDir(DIST_DIR);

  buildHome();
  buildCategoryIndex();
  buildCategoryPages();
  buildToolsIndex();
  buildToolPages();
  const pairCount = buildComparePages();
  buildStaticAssets();

  const basePaths = collectAllPaths();
  const comparePaths = [];
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const a = tools[i], b = tools[j];
      if (a.categories.some((c) => b.categories.includes(c))) {
        comparePaths.push(`/compare/${a.slug}-vs-${b.slug}/index.html`);
      }
    }
  }
  buildSitemap([...basePaths, ...comparePaths]);

  const totalPages = basePaths.length + comparePaths.length;
  console.log(`Build complete.`);
  console.log(`  Tools: ${tools.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Compare pages: ${pairCount}`);
  console.log(`  Total pages generated: ${totalPages}`);
}

main();
