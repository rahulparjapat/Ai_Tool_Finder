# AI Tool Finder

A **programmatic SEO directory** that compares AI tools (chatbots, writing, image/video generation, coding assistants, and more). Built with **zero external dependencies** — pure Node.js generates plain static HTML — so it can be hosted for **$0** on any static host, forever.

From just 18 tools and 8 categories, the generator currently produces **84 unique, SEO-optimized pages**:
- `/tools/[slug]` — individual tool review pages
- `/categories/[slug]` — "Best AI Tools for X" listicles
- `/alternatives/[slug]` — "Best Free Alternatives to X" pages
- `/compare/[a]-vs-[b]` — head-to-head comparison pages (auto-generated for every pair of tools that share a category)

Add more tools to `data/tools.json` and the page count scales automatically — 50 tools would generate 500+ pages with zero extra writing.

## Quick start

```bash
npm run build     # generates the static site into ./dist
npm run serve     # preview locally at http://localhost:8080
```

No `npm install` needed — there are no dependencies.

## Project structure

```
data/
  categories.json   # the 8 tool categories
  tools.json        # the tool database — THIS is what you edit to grow the site
scripts/
  build.js          # the static site generator
  serve.js          # tiny local preview server
site/
  assets/style.css  # site styling
dist/               # generated output (created by `npm run build`, not committed)
```

## How to add a new tool (grows the site automatically)

Open `data/tools.json` and add an object like:

```json
{
  "slug": "my-new-tool",
  "name": "My New Tool",
  "maker": "Example Inc.",
  "categories": ["writing", "productivity"],
  "tagline": "One sentence describing what it does.",
  "pricing": "Free plan available; Pro $10/mo",
  "hasFreeTier": true,
  "website": "https://example.com",
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"],
  "bestFor": "Who this tool is ideal for."
}
```

Run `npm run build` again — you instantly get:
- a new `/tools/my-new-tool/` review page
- a new `/alternatives/my-new-tool/` page
- new `/compare/my-new-tool-vs-*` pages against every tool sharing a category
- it's added to the relevant `/categories/*` listing pages automatically

## Deploying for $0 (pick one)

### Option A — Cloudflare Pages (recommended)
1. Push this folder to a GitHub repo.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create a project → connect your repo.
3. Build command: `node scripts/build.js` — Output directory: `dist`
4. Deploy. You get a free `*.pages.dev` URL with global CDN, HTTPS, and unlimited bandwidth.

### Option B — Netlify
1. Push to GitHub, then "Add new site" → import from Git on [netlify.com](https://netlify.com).
2. `netlify.toml` is already configured (`npm run build`, publish `dist`).
3. Deploy — free `*.netlify.app` subdomain.

### Option C — Vercel
1. Push to GitHub, import the repo at [vercel.com](https://vercel.com).
2. `vercel.json` is already configured.
3. Deploy — free `*.vercel.app` subdomain.

### Option D — GitHub Pages
1. Push to GitHub.
2. In repo Settings → Pages → Source: "GitHub Actions".
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on every push to `main`.
4. Free `username.github.io/repo-name` URL.

All four are permanently free tiers (no credit card, no trial expiry) and support custom domains for free later (you'd only pay ~$1-12/yr for the domain itself, which is optional).

## Before going live — checklist

1. **Update `SITE_URL`** in `scripts/build.js` (currently `https://example.com`) to your real deployed URL — this powers canonical tags, sitemap.xml, and JSON-LD structured data.
2. **Verify affiliate/referral links.** Currently the "Visit [Tool]" buttons link directly to each tool's homepage with `rel="nofollow sponsored"`. Swap in your actual affiliate links once you join relevant affiliate/referral programs (many AI tools — Jasper, Copy.ai, ElevenLabs, Murf, Notion — have affiliate programs).
3. **Submit your sitemap** (`/sitemap.xml`) to Google Search Console and Bing Webmaster Tools once live — this is the fastest way to get programmatic pages indexed.
4. **Apply for Google AdSense** once you have a reasonable number of pages and some organic traffic (10-20 unique visitors/day is a reasonable bar to attempt approval, though there's no official minimum).
5. **Expand the dataset.** Growing `tools.json` to 40-60 tools is the single highest-leverage thing you can do — it multiplies your compare-page count roughly quadratically.

## Content quality notes

- Tool data (pricing, pros/cons) was accurate as of mid-2026 but **pricing changes often** — review and update `tools.json` periodically to avoid stale/misleading info, which hurts both user trust and SEO (Google's Helpful Content guidelines penalize outdated commercial info).
- Consider adding a genuine "last updated" date per tool and a short human-written intro paragraph per category page to strengthen E-E-A-T (Experience, Expertise, Authoritativeness, Trust) signals, since pure database-driven pages can otherwise read as thin content to search engines.
