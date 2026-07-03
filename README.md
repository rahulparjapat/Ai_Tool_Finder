# AI Tool Finder

A programmatic-SEO, ad-monetized directory comparing AI tools — built with **Astro**, styled with **Tailwind CSS**, deployable for **$0**. Clean, minimalist, white-background design with hand-authored monochrome icons and no third-party icon library.

From **109 researched AI tools** across **16 categories**, the site generates **869 pages**: individual tool reviews, category listicles (each with an original illustration banner), "best free alternatives to X" pages, **607 auto-paired "X vs Y" comparisons**, **14 hand-curated "best AI tools for [audience]" roundups**, a hand-written blog, and every required trust/legal page.

A non-technical site owner can add tools, write articles, and fix prices through a built-in **no-code dashboard** at `/admin/` — no code or GitHub website required day-to-day. See [`HOW_TO_UPDATE_YOUR_SITE.md`](./HOW_TO_UPDATE_YOUR_SITE.md) for plain-language instructions.

---

## Table of contents

- [Live deployments](#live-deployments)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Growing the site — developer route](#growing-the-site--developer-route)
- [Growing the site — non-technical route](#growing-the-site--non-technical-route)
- [The no-code content dashboard](#the-no-code-content-dashboard)
- [Why favicons and illustrations, not full logos or stock photos](#why-favicons-and-illustrations-not-full-logos-or-stock-photos)
- ["Last updated" dates — honest, not artificially freshened](#last-updated-dates--honest-not-artificially-freshened)
- [SEO implementation](#seo-implementation)
- [Ad monetization](#ad-monetization)
- [Compliance & trust infrastructure](#compliance--trust-infrastructure)
- [Running two live deployments — the duplicate-content safeguard](#running-two-live-deployments--the-duplicate-content-safeguard)
- [Deployment — pick one, all $0](#deployment--pick-one-all-0)
- [Known gaps — do these before real launch](#known-gaps--do-these-before-real-launch)

---

## Live deployments

This project is currently deployed to two places:

- **`https://aitoolfindercom.netlify.app`** — Netlify, **canonical**. This is the real, indexable site, and the only place the `/admin/` content dashboard works (it depends on Netlify Identity + Git Gateway).
- **`https://ai-tool-finder1.pages.dev`** — Cloudflare Pages, kept only as a backup/staging copy. It's automatically blocked from search indexing — see [Running two live deployments](#running-two-live-deployments--the-duplicate-content-safeguard).

If you buy a real custom domain later, update `SITE.url` in `src/lib/site.ts` and `SITE_URL` in `astro.config.mjs` to that domain — both hosts support attaching a custom domain for free.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** (static output) | Zero client-side JS by default; only the mobile menu, cookie consent, AdSense loader, and Netlify Identity scripts ship any JS |
| Styling | **Tailwind CSS 4** + `@tailwindcss/typography` | Compiled at build time, no runtime cost; `src/styles/global.css` defines the white/neutral design tokens |
| Icons | Hand-authored inline SVGs (`src/components/Icon.astro`) | Zero icon-library dependency; every icon inherits `currentColor`, guaranteeing no colored icons anywhere |
| Tool logos | Real official favicons (97 of 109 tools) with a generated monogram badge fallback (`src/components/ToolLogo.astro`) | See [below](#why-favicons-and-illustrations-not-full-logos-or-stock-photos) |
| Category imagery | 16 original AI-generated monochrome illustrations (`src/components/CategoryBanner.astro`) | Shown on every category page and every tool page within it |
| Content data | `src/data/tools.json`, `categories.json`, `use-cases.json` | Plain JSON, each wrapped in a named top-level key (e.g. `{ "tools": [...] }`) so the `/admin/` dashboard can manage them as clean collections |
| Content dashboard | **Decap CMS** (`public/admin/`) + Netlify Identity/Git Gateway | Free, open-source, git-backed — see [below](#the-no-code-content-dashboard) |
| Blog content | Astro Content Collections (`src/content/blog/*.md`) | Type-checked frontmatter via `src/content.config.ts`; also editable through the dashboard |
| Sitemap | Custom route (`src/pages/sitemap.xml.ts`) | Serves at the conventional `/sitemap.xml` URL, rebuilt fresh from live data on every build — not a static file |
| Node version | 22+ (required by Astro 7) | |
| Hosting | **Netlify** (required for `/admin/`); Cloudflare Pages, Vercel, and GitHub Pages configs also included | See [Deployment](#deployment--pick-one-all-0) |

---

## Project structure

```
/                              → homepage (hero, category grid, use-case grid)
/categories/                   → category index
/categories/[slug]/            → "Best [Category] in 2026" listicle, with banner image (16 pages)
/tools/                        → all-tools directory
/tools/[slug]/                 → individual tool review, with category banner image (109 pages)
/alternatives/[slug]/          → "best free alternatives to X" (109 pages)
/compare/                      → comparison index
/compare/[a]-vs-[b]/           → auto-paired head-to-head comparisons (607 pages)
/best-for/                     → use-case roundup index
/best-for/[slug]/              → hand-curated "Best AI Tools for [audience]" (14 pages)
/blog/                         → blog index
/blog/[slug]/                  → long-form articles
/about/, /contact/             → trust pages
/privacy-policy/, /terms/,
/affiliate-disclosure/         → required legal/compliance pages
/admin/                        → no-code content dashboard (Decap CMS), noindex'd
/404                           → custom not-found page
/robots.txt                    → dynamically generated, points to sitemap
/sitemap.xml                   → dynamically generated from live data on every build
/ads.txt                       → real AdSense publisher ID
/google7e64d7513cc35712.html   → real Search Console verification file

src/
  components/    → shared UI: Header, Footer, ToolCard, ToolLogo, CategoryBanner,
                   Icon, AdSlot, SEO, Analytics, ConsentBanner, IdentityWidget, Breadcrumbs
  content/blog/  → hand-written Markdown blog posts
  data/          → tools.json, categories.json, use-cases.json (the whole dataset)
  layouts/       → Layout.astro (shared page shell)
  lib/           → site.ts (config), data.ts (data-access layer), format.ts, icons.ts
  pages/         → every route in the table above

public/
  admin/         → Decap CMS dashboard (index.html + config.yml)
  images/
    categories/  → 16 original category illustrations
    logos/       → 97 downloaded tool favicons
  ads.txt, favicon.*, og-default.png, google verification file

scripts/
  fetch-favicons.mjs → one-off, re-runnable utility to (re)download tool favicons
```

---

## Quick start

```bash
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build into ./dist
npm run preview   # preview the production build locally
```

Requires **Node.js 22+**.

---

## Growing the site — developer route

Add a new tool inside the `tools` array in `src/data/tools.json` (shape documented via existing entries) and rebuild — it automatically gets a review page, an alternatives page, and comparison pages against every tool sharing a category. Add a new category inside the `categories` array in `src/data/categories.json` the same way.

Both files are wrapped in a named top-level key (`{ "tools": [...] }`, `{ "categories": [...] }`) rather than being bare arrays — this is required by the `/admin/` dashboard config, not optional, so don't unwrap them.

Add a blog post by dropping a new Markdown file into `src/content/blog/` with the required frontmatter (`title`, `description`, `publishDate`).

Whenever you genuinely update a tool's info, also bump its `lastUpdated` field to that day — see [below](#last-updated-dates--honest-not-artificially-freshened) for why this matters and how it's displayed.

To fetch a favicon for a newly added tool, run `node scripts/fetch-favicons.mjs` — safe to re-run any time, only touches `public/images/logos/`.

## Growing the site — non-technical route

Log in at `yoursite.com/admin/` and use the dashboard forms instead. Full plain-language instructions — including the one-time login setup — are in [`HOW_TO_UPDATE_YOUR_SITE.md`](./HOW_TO_UPDATE_YOUR_SITE.md).

---

## The no-code content dashboard

Since the site owner is non-technical, day-to-day content updates don't require touching code, JSON files, or GitHub's website directly.

**How it works:**
- `public/admin/index.html` loads **Decap CMS**, a free, open-source content editor, from a public CDN
- `public/admin/config.yml` defines every form field shown in the dashboard for four collections: **AI Tools**, **Categories**, **Best-For Roundups**, and **Blog Articles**
- The site owner logs in at `yoursite.com/admin/` with a simple email/password (via **Netlify Identity**), fills in a form, and clicks **Publish**
- Netlify's **Git Gateway** translates that into a real commit to the GitHub repository behind the scenes
- Netlify's build hook then automatically rebuilds and redeploys the live site, typically within 1–2 minutes

**One-time setup required** (deploy to Netlify, enable "Identity" and "Git Gateway," invite the site owner's email as a user) is documented step-by-step in [`HOW_TO_UPDATE_YOUR_SITE.md`](./HOW_TO_UPDATE_YOUR_SITE.md).

**Note on invite/password-recovery links:** `src/components/IdentityWidget.astro` loads the Netlify Identity widget sitewide (not just on `/admin/`) specifically so that invite and password-recovery email links — which point at the site root, not directly at `/admin/` — correctly trigger the "set your password" prompt instead of silently loading the homepage.

---

## Why favicons and illustrations, not full logos or stock photos

Three different types of imagery were considered for representing each tool, each with a different risk/authenticity tradeoff:

**Full company logos** (e.g. the OpenAI or Midjourney wordmark as used in their own branding): **not used, deliberately.** Reproducing a trademarked logo — whether by hotlinking to an external logo CDN or by asking an image model to recreate it — is a real trademark risk that no one but the trademark owner can waive, regardless of how it's obtained.

**Official favicons** (the small site icon each company already publicly serves for browser tabs/bookmarks — what's actually used): `ToolLogo.astro` shows each tool's real favicon when one is available. These were fetched once via `scripts/fetch-favicons.mjs` (using Google's public favicon service as the source) and saved locally into `public/images/logos/[slug].png` — **97 of 109 tools** have one. The other 12 (`grok`, `writesonic`, `elevenlabs`, `udio`, `github-copilot`, `replit-agent`, `otter-ai`, `consensus`, `scispace`, `pipedream`, `drift`, `salesforce-agentforce`) either don't serve a distinct favicon or only returned a generic fallback icon, which the fetch script deliberately detects and skips rather than saving a meaningless placeholder as if it were real. Storing these locally (rather than embedding a live third-party URL on every page load) keeps the site self-contained and avoids breaking in offline/sandboxed previews.

Using each site's own favicon is a meaningfully lower-risk category of use than a full logo, but it's still technically each company's mark, not a neutral asset — if a stricter stance is wanted later, `ToolLogo.astro` is a single component to revert to monogram-only.

**Stock photography**: not used. Free stock libraries don't have meaningful, distinct photography per individual AI tool — only generic "person using laptop" images that would end up repeated across unrelated tools. Paid/attributed stock (e.g. Getty Images) isn't usable without a license. **Solution instead**: 16 original, AI-generated, monochrome illustrations — one per category — shown via `CategoryBanner.astro`.

---

## "Last updated" dates — honest, not artificially freshened

Every tool has a `lastUpdated` field, but it's not displayed as a raw date. `src/lib/format.ts` converts it into a natural relative label at build time: "Updated today," "Updated 3 days ago," "Updated 2 weeks ago," or a plain "Updated Jun 2026" once it's been a couple of months.

This is deliberately **not** hardcoded to always say "today" — Google's search spam policies explicitly flag artificially-freshened dates as a manipulative practice that can hurt rankings. The label is recalculated against the real current date on every build, so a tool nobody has touched in months correctly stops showing a "days ago" label. The exact real ISO date is always available via a hover tooltip.

**This depends on one habit**: whenever a tool is genuinely reviewed or corrected, bump its `Last Updated` field to that real day — documented in [`HOW_TO_UPDATE_YOUR_SITE.md`](./HOW_TO_UPDATE_YOUR_SITE.md).

---

## SEO implementation

Every page ships with, via `SEO.astro`:
- Unique `<title>` and meta description
- Self-referencing canonical URL (always pointing at the canonical Netlify domain, see below)
- Open Graph + Twitter Card tags, including a generated default share image
- JSON-LD structured data: `WebSite`/`Organization` (homepage), `SoftwareApplication` (tool pages), `ItemList` (category, comparison, and use-case pages), `BreadcrumbList` (every page with breadcrumbs), `BlogPosting` (blog posts)
- Internal linking: every tool page links to its categories, its alternatives page, and related tools; every comparison page links back to both individual reviews; use-case pages link into the tool directory

---

## Ad monetization

Two ad networks currently run side by side — AdSense and Adsterra — each isolated in its own component so either can be added, removed, or swapped without touching the other:

- **Google AdSense**: publisher ID `pub-7273204238508295` is wired into `public/ads.txt` and the loader script in `Layout.astro`. `AdSlot.astro` is the reusable placement component; it currently renders a labeled placeholder until real ad-unit IDs are configured.
- **Adsterra**: three components, one per ad format —
  - `AdsterraNative.astro` — the Native Banner, blends into content, placed inside tool reviews, blog posts, and comparison pages
  - `AdsterraTopBanner.astro` — a responsive top-of-page slot (728x90 desktop / 320x50 mobile), the one ad shown on **every** page, placed in `Layout.astro` directly below the header
  - `AdsterraBanner.astro` — a single component parameterized by `size`, covering the fixed-size units (`728x90`, `320x50`, `300x250`, `160x600`, `160x300`, `468x60`); used for the 160x600 skyscraper in `AdSidebar.astro` and the 300x250 end-of-content slot on tool, blog, and best-for pages

**Placement philosophy**: ad density is deliberately curated, not maximized — a single top banner sitewide, plus a sidebar skyscraper and native/end-of-content banner only on genuinely long-form pages (tool reviews, blog posts, comparisons, best-for roundups). The homepage and category/tool index pages intentionally carry lighter ad weight since they're primarily navigation, not content-consumption pages. `AdSidebar.astro` is hidden entirely below the `lg` breakpoint — there's no room for a 160-wide skyscraper on mobile, and forcing one in would hurt the majority of visitors' experience.

Every Adsterra script tag reserves its exact pixel footprint upfront (no layout shift) and renders on a subtle neutral background, so an unloaded ad (ad blockers, or before Adsterra starts serving on a new domain) reads as deliberate whitespace rather than a broken-looking gap.

**Monetag (push notification ads)** — a third, materially different network is also wired in: `public/sw.js` is a Service Worker file provided by Monetag, and `MonetagServiceWorker.astro` registers it on every page. Unlike AdSense/Adsterra, this is Monetag's **push-notification ad format** — registering the worker is what allows the site to later ask a visitor's browser for permission to send notifications, and if granted, Monetag can deliver ad notifications even after the visitor leaves the site.

This is a more intrusive ad format than the banners above, and it was flagged explicitly as such before being implemented — several browsers (Chrome, Firefox, Edge) apply anti-abuse friction to sites requesting notification permission for advertising. It was added anyway at explicit request, with two safeguards to limit the downside:
1. The Service Worker only registers **after** a visitor clicks "Accept" on the cookie consent banner — it never registers for a visitor who hasn't consented, checked via the same `cookie-consent` localStorage key `ConsentBanner.astro` already uses.
2. Registration is wrapped in a feature check and silently fails (no console errors) in browsers that don't support or block it — this ad format is additive revenue, not required for the site to function.

If the notification-permission prompts end up hurting bounce rate or triggering browser warnings once live, `MonetagServiceWorker.astro` is the one file to remove to fully disable this.

---

## Compliance & trust infrastructure

- **Cookie consent banner** (`ConsentBanner.astro`) — dependency-free, wired to **Google Consent Mode v2**, defaults to `denied` until the visitor accepts.
- **Privacy Policy, Terms of Use, Affiliate Disclosure, About, Contact** — live pages with real content and `TODO` comments flagging where to get real legal review before high-traffic launch.
- Affiliate/outbound links use `rel="nofollow sponsored noopener"` per FTC and Google guidelines.
- `/admin/` is marked `noindex, nofollow` so the content dashboard never appears in search results.

---

## Running two live deployments — the duplicate-content safeguard

Running identical content live on two different domains causes Google to see **duplicate content**, which can split or hurt search ranking. Two real mechanisms handle this, not just documentation:

1. **`SITE.url` in `src/lib/site.ts`** is set to the Netlify domain, and both deployments build from this same value — so every page's `<link rel="canonical">` tag and the sitemap always point at Netlify, regardless of which host actually served the page to a visitor.
2. **`SITE.isSecondaryDeployment`** checks Cloudflare Pages' own `CF_PAGES=1` build environment variable (which Netlify does not set). When a build is detected as the Cloudflare Pages build specifically, `robots.txt.ts` outputs a full `Disallow: /` and `SEO.astro` forces `noindex, nofollow` sitewide — verified by running a build with `CF_PAGES=1` set and confirming both outputs change correctly, while a normal build stays fully indexable.

**Net effect**: the Netlify copy is the only one that can ever be indexed by Google; the Cloudflare Pages copy keeps working as a live backup but is invisible to search engines. Once confident in the setup, retiring one of the two deployments entirely is simpler and just as safe.

---

## Deployment — pick one, all $0

All configs are in the repo root and build-tested against this exact project.

- **Netlify (required for the admin dashboard, currently canonical)**: `netlify.toml` included; also enables Identity + Git Gateway for `/admin/`
- **Cloudflare Pages**: build command `npm run build`, output directory `dist` — works for the site itself, but `/admin/` login depends on Netlify Identity specifically
- **Vercel**: `vercel.json` included, `framework: astro` set explicitly
- **GitHub Pages**: `.github/workflows/deploy.yml` auto-builds on every push to `main`

---

## Known gaps — do these before real launch

1. **`SITE.url` is set to the current Netlify domain** (`aitoolfindercom.netlify.app`). Update it (and `astro.config.mjs`'s `SITE_URL`) if you buy a real custom domain.
2. **GA4 Measurement ID is a placeholder** (`G-XXXXXXXXXX`) in `src/lib/site.ts`. Analytics silently won't fire until you replace it.
3. **Ad units are placeholders.** AdSense Auto Ads can be turned on site-wide without touching this code; for manual placements, create ad units in your AdSense dashboard and pass their IDs into `<AdSlot adUnitId="...">`.
4. **Legal pages are templates, not lawyer-reviewed text.**
5. **Contact email is a placeholder** (`hello@example.com`) in `src/pages/contact.astro`.
6. **The admin dashboard's one-time setup (Netlify Identity + Git Gateway)** needs to be completed before `/admin/` can actually be logged into — see [`HOW_TO_UPDATE_YOUR_SITE.md`](./HOW_TO_UPDATE_YOUR_SITE.md).
7. **12 of 109 tools don't have a favicon on file** and use the monogram fallback — re-run `node scripts/fetch-favicons.mjs` periodically in case any start serving a real favicon later.
8. **Content freshness**: tool pricing/pros/cons reflect research as of each tool's `lastUpdated` field. Revisit periodically, and update that field honestly when you do.
