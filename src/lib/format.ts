// ============================================================================
// format.ts
// ----------------------------------------------------------------------------
// Small display-formatting helpers. Kept separate from data.ts (which is
// about *what* the data is) since this is purely about *how* it's shown.
// ============================================================================

/**
 * Formats a "last updated" ISO date (e.g. "2026-07-02") as a human-friendly,
 * honest relative label:
 *   - "Updated today" / "Updated yesterday" for the last 2 days
 *   - "Updated N days ago" for up to 3 weeks
 *   - "Updated N weeks ago" for up to ~2 months
 *   - Otherwise falls back to a plain "Updated Mon YYYY" — e.g. "Updated Jun 2026"
 *
 * IMPORTANT: this only ever *labels* the real underlying date more
 * naturally — it never invents a fake date. The actual ISO date each tool
 * was last reviewed always lives in the `lastUpdated` field itself, and the
 * label is recalculated at build time against the real current date, so it
 * stays honest as time passes (a tool not touched in 6 months will
 * correctly stop showing a "days ago" label and instead show its real month).
 */
export function formatLastUpdated(isoDate: string, now: Date = new Date()): string {
  const then = new Date(`${isoDate}T00:00:00Z`);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 21) return `Updated ${diffDays} days ago`;
  if (diffDays < 60) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;

  return `Updated ${then.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}`;
}
