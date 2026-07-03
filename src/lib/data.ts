// ============================================================================
// data.ts
// ----------------------------------------------------------------------------
// Central data-access layer for the site. All pages import from here rather
// than reading the JSON files directly — this keeps the "shape" of a Tool /
// Category consistent everywhere, and gives one place to compute derived
// data (e.g. every possible tool-vs-tool comparison pair) instead of
// repeating that logic in multiple page templates.
// ============================================================================
// Each JSON data file is wrapped in a single top-level key (e.g. { "tools": [...] })
// rather than being a bare array. This is required by the Decap CMS admin panel
// (see public/admin/config.yml) so it can manage each file as a named
// "collection" with clean Add/Edit/Delete buttons — it does not change how
// the data is used anywhere else in the site.
import toolsFile from "../data/tools.json";
import categoriesFile from "../data/categories.json";
import useCasesFile from "../data/use-cases.json";
import type { IconName } from "./icons";

/** A single tool category, e.g. "AI Writing Tools". */
export interface Category {
  slug: string;
  name: string;
  /** Name of a monochrome icon defined in Icon.astro. */
  icon: IconName;
  /** Original illustration shown as a banner on this category's pages and
   *  on every tool page within it. Optional — categories awaiting their
   *  illustration simply render without a banner (see CategoryBanner.astro). */
  image?: string;
  description: string;
}

/** A single AI tool entry — the core content unit of the whole site. */
export interface Tool {
  slug: string;
  name: string;
  maker: string;
  /** One or more category slugs this tool belongs to. */
  categories: string[];
  tagline: string;
  pricing: string;
  hasFreeTier: boolean;
  website: string;
  /** Optional affiliate/referral link — falls back to `website` when unset. */
  affiliateUrl?: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  /** ISO date string shown as "last updated" for content-freshness signals. */
  lastUpdated?: string;
}

/** A hand-curated "best AI tools for [audience]" roundup page. */
export interface UseCase {
  slug: string;
  title: string;
  intro: string;
  /** Ordered list of tool slugs featured in this roundup. */
  toolSlugs: string[];
}

export const categories: Category[] = (categoriesFile as { categories: Category[] }).categories;
export const tools: Tool[] = (toolsFile as { tools: Tool[] }).tools;
export const useCases: UseCase[] = (useCasesFile as { useCases: UseCase[] }).useCases;

/** Fast lookup maps, built once at build time (this is a static site —
 *  there's no per-request cost to worry about here). */
export const categoryBySlug: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c])
);
export const toolBySlug: Record<string, Tool> = Object.fromEntries(
  tools.map((t) => [t.slug, t])
);

/** All tools that belong to a given category slug. */
export function toolsInCategory(categorySlug: string): Tool[] {
  return tools.filter((t) => t.categories.includes(categorySlug));
}

/** Tools related to a given tool (shares at least one category), used to
 *  power "Alternatives" sections without manual curation per tool. */
export function relatedTools(tool: Tool, limit = 4): Tool[] {
  return tools
    .filter((t) => t.slug !== tool.slug && t.categories.some((c) => tool.categories.includes(c)))
    .slice(0, limit);
}

/** The URL a "Visit [Tool]" button should point to — prefers an affiliate
 *  link if one is configured, otherwise falls back to the plain website. */
export function outboundLink(tool: Tool): string {
  return tool.affiliateUrl || tool.website;
}

/** A single generated "X vs Y" comparison pair, plus the category they share
 *  (used for the page's intro sentence and breadcrumb context). */
export interface ComparePair {
  a: Tool;
  b: Tool;
  sharedCategory: Category;
}

/** Every unique pair of tools that share at least one category. This is the
 *  core "programmatic SEO" engine of the site — growing the tool dataset
 *  automatically grows this list (roughly quadratically) with zero new code. */
export function allComparePairs(): ComparePair[] {
  const pairs: ComparePair[] = [];
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const a = tools[i];
      const b = tools[j];
      const sharedSlug = a.categories.find((c) => b.categories.includes(c));
      if (sharedSlug) {
        pairs.push({ a, b, sharedCategory: categoryBySlug[sharedSlug] });
      }
    }
  }
  return pairs;
}

/** Canonical URL slug for a comparison page between two tools. */
export function compareSlug(a: Tool, b: Tool): string {
  return `${a.slug}-vs-${b.slug}`;
}

/** Resolves a UseCase's tool slugs into full Tool objects, in the order
 *  the use-case data specifies (silently skips any slug that doesn't
 *  resolve, though the data has been validated to avoid this). */
export function toolsForUseCase(useCase: UseCase): Tool[] {
  return useCase.toolSlugs.map((slug) => toolBySlug[slug]).filter(Boolean);
}
