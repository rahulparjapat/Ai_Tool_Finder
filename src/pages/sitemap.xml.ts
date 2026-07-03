// ============================================================================
// sitemap.xml.ts
// ----------------------------------------------------------------------------
// Serves the sitemap at the standard, clean URL /sitemap.xml (search engines
// and most SEO tools expect it exactly there by convention).
//
// This replaces the @astrojs/sitemap integration, which instead produced
// /sitemap-index.xml + /sitemap-0.xml — functionally fine, but not the
// conventional URL. Rather than dropping a static file in public/ (which
// would freeze it and go stale the moment a tool is added via the /admin/
// dashboard), this is a build-time API route: it pulls the exact same
// live data (tools, categories, comparisons, use-cases, blog posts) that
// every page on the site is generated from, so the sitemap always reflects
// reality on every rebuild — no separate file to remember to update.
// ============================================================================
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../lib/site";
import { categories, tools, useCases, allComparePairs, compareSlug } from "../lib/data";

export const GET: APIRoute = async () => {
  // Every static, hand-written page on the site (trust/legal pages, index
  // pages for each section). Kept as a plain list here since there's no
  // dataset to derive these from — they're fixed, one-off pages.
  const staticPaths = [
    "/",
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/terms/",
    "/affiliate-disclosure/",
    "/categories/",
    "/tools/",
    "/compare/",
    "/best-for/",
    "/blog/",
  ];

  // One entry per category, e.g. /categories/writing/
  const categoryPaths = categories.map((c) => `/categories/${c.slug}/`);

  // Two entries per tool: its review page and its "alternatives to X" page.
  const toolPaths = tools.flatMap((t) => [`/tools/${t.slug}/`, `/alternatives/${t.slug}/`]);

  // One entry per auto-generated "X vs Y" comparison pair.
  const comparePaths = allComparePairs().map(({ a, b }) => `/compare/${compareSlug(a, b)}/`);

  // One entry per curated "best AI tools for [audience]" roundup.
  const useCasePaths = useCases.map((uc) => `/best-for/${uc.slug}/`);

  // One entry per published (non-draft) blog post.
  const blogPosts = await getCollection("blog", ({ data }) => !data.draft);
  const blogPaths = blogPosts.map((post) => `/blog/${post.id}/`);

  // Deliberately NOT included: /admin/ (private dashboard, marked noindex)
  // and /404/ (not real content) — neither should ever appear in a sitemap.
  const allPaths = [
    ...staticPaths,
    ...categoryPaths,
    ...toolPaths,
    ...comparePaths,
    ...useCasePaths,
    ...blogPaths,
  ];

  const urlEntries = allPaths
    .map((path) => `  <url><loc>${new URL(path, SITE.url).toString()}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
