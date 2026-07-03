// ============================================================================
// icons.ts
// ----------------------------------------------------------------------------
// Just the TypeScript type for valid icon names, kept separate from
// Icon.astro so plain .ts files (like data.ts) can import the type without
// needing to import an .astro component (which isn't valid from .ts files).
// This list must stay in sync with the ICONS map inside Icon.astro.
// ============================================================================
export type IconName =
  | "chat"
  | "pencil"
  | "image"
  | "video"
  | "microphone"
  | "code"
  | "briefcase"
  | "search"
  | "megaphone"
  | "cube"
  | "swatch"
  | "workflow"
  | "presentation"
  | "headset"
  | "academic-cap"
  | "currency"
  | "arrow-right"
  | "external-link"
  | "check"
  | "x-mark"
  | "menu"
  | "chevron-down"
  | "sparkles"
  | "scale"
  | "mail"
  | "document"
  | "shield";
