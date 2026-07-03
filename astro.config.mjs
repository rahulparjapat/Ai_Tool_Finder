// @ts-check
// ============================================================================
// astro.config.mjs
// ----------------------------------------------------------------------------
// Astro's build configuration. Key choices:
//   - `output` defaults to fully static (no server needed at runtime), which
//     is what makes this deployable for $0 on any static host.
//   - Tailwind CSS is wired in via its official Vite plugin.
//   - The sitemap is served at the conventional /sitemap.xml URL via a
//     custom route (src/pages/sitemap.xml.ts) built directly from live
//     site data, rather than via @astrojs/sitemap (which produced
//     /sitemap-index.xml + /sitemap-0.xml instead of the standard path).
// ============================================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// This is the site's ONE canonical domain — kept in sync with src/lib/site.ts.
// The site is currently deployed in two places (Netlify + Cloudflare Pages);
// Netlify is canonical because it hosts the /admin/ content dashboard.
// Since both deployments are built from this same SITE_URL value, every
// page's <link rel="canonical"> (see SEO.astro) and the sitemap.xml both
// point at the Netlify domain no matter which host actually serves the
// page — this is what tells Google "attribute this content to Netlify,
// not Cloudflare Pages," avoiding a duplicate-content split. If you buy a
// real custom domain later, update this to that domain instead.
const SITE_URL = 'https://aitoolfindercom.netlify.app';

export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
});

