// ============================================================================
// site.ts
// ----------------------------------------------------------------------------
// Central site configuration. Every value that's specific to *this*
// deployment (domain, analytics ID, ad publisher ID, etc.) lives here so it
// only ever needs to be changed in one place. Search for "TODO" below for
// the handful of placeholder values you must replace before going live.
// ============================================================================
export const SITE = {
  /** Shown in the header, footer, and page titles. */
  name: "AI Tool Finder",
  tagline: "Find, compare, and pick the best AI tools",
  description:
    "Independent, up-to-date comparisons of AI chatbots, writing tools, image and video generators, coding assistants, and more.",

  // This is the site's ONE canonical, real domain — it must match exactly
  // what's registered in Google Search Console and AdSense, and it must
  // also be kept in sync with the `site` field in astro.config.mjs.
  //
  // NOTE: this project is currently deployed in two places:
  //   https://aitoolfindercom.netlify.app  (Netlify — canonical, since it
  //     hosts the /admin/ content dashboard, which requires Netlify Identity)
  //   https://ai-tool-finder1.pages.dev    (Cloudflare Pages — kept only as
  //     a backup/staging copy)
  // Because this SITE.url value is used to build every page's
  // <link rel="canonical"> tag (see SEO.astro) and the sitemap, both
  // deployments' pages point back at the Netlify domain as "the real
  // version" regardless of which host actually served the page to a given
  // visitor — this tells Google to attribute the content to Netlify only,
  // avoiding a duplicate-content split. Canonical tags are only a hint
  // though, not a hard block — see `isSecondaryDeployment` below for the
  // actual enforcement that stops the Cloudflare Pages copy from being
  // indexed at all. If you buy a real custom domain later, update this
  // value to that instead — both hosts support attaching one for free.
  url: "https://aitoolfindercom.netlify.app",

  // Cloudflare Pages automatically sets the CF_PAGES=1 environment
  // variable during its own builds (Netlify does not set this) — so this
  // evaluates to true only when the site is being built for the
  // Cloudflare Pages deployment specifically. It's used by robots.txt.ts
  // and SEO.astro to force noindex/disallow ONLY on that secondary
  // deployment, while the Netlify (canonical) deployment stays fully
  // indexable. This is the actual technical enforcement behind the
  // "avoid duplicate content across two live domains" note above.
  isSecondaryDeployment: process.env.CF_PAGES === "1",

  // TODO: replace with your real handle, or remove the meta tag in SEO.astro
  // if you don't have one.
  twitterHandle: "@yourhandle",

  // Real AdSense publisher ID, wired from the ads.txt provided for this
  // project. Used both in public/ads.txt and in the AdSense loader script
  // in Layout.astro. Do not change this unless your AdSense account ID
  // actually changes.
  adsensePublisherId: "pub-7273204238508295",

  // TODO: replace with your real GA4 Measurement ID. Analytics.astro checks
  // for the literal string "XXXX" and silently skips loading GA4 until you
  // do this, so there's no broken tracking request in the meantime.
  ga4MeasurementId: "G-XXXXXXXXXX",

  /** Default social-share image, used when a page doesn't set its own. */
  defaultOgImage: "/og-default.png",
};
