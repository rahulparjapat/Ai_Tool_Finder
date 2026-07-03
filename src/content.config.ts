// ============================================================================
// content.config.ts
// ----------------------------------------------------------------------------
// Defines Astro's typed Content Collections. Currently just the "blog"
// collection, which reads every Markdown file under src/content/blog/ and
// validates its frontmatter against the schema below at build time — so a
// blog post with a typo'd or missing field fails the build loudly instead
// of silently rendering wrong.
// ============================================================================
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(), // ISO date, e.g. "2026-07-01"
    updatedDate: z.string().optional(),
    // Draft posts are excluded from getCollection() calls that filter on
    // this field, so you can write a post ahead of time without publishing it.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
