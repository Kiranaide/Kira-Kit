---
"kira-kit": minor
---

Font and icon options for theming, shipping alongside the native install
engine changeset in this release.

- `init` and `theme` accept `--font` (geist, inter, manrope, plus-jakarta-sans,
  space-grotesk, dm-sans) and `--font-mono` (geist-mono, jetbrains-mono,
  fira-code). All fonts are `@fontsource-variable` packages. Application
  rewrites the CSS `@import` lines and upserts `--font-sans` / `--font-mono`
  in `@theme inline` — color tokens are never touched and `--force` is not
  required. Interactive `init` prompts for sans, mono, and icon choices.
- `init` and `theme` accept `--icon` (tabler, lucide). Choosing lucide
  installs `lucide-react` and rewrites every `@tabler/icons-react` import in
  project sources to aliased lucide imports (`Check as IconCheck`), so
  usages, `typeof` refs, and icon records keep their names. Filled Tabler
  icons get `fill="currentColor"` injected and Tabler `stroke` width props
  become `strokeWidth`; a few names map to approximate Lucide
  equivalents. `@tabler/icons-react` is never auto-removed — a hint is
  printed. Convert installed components later with `add --all --overwrite`.
- `theme` no longer requires `--primary`: font/icon options apply on their
  own with `--apply`, or print a dry-run summary without it.
- The base CSS ships a `--font-mono` token and the
  `@fontsource-variable/geist-mono` import; CodeBlock's default `fontFamily`
  is now `var(--font-mono, ui-monospace, monospace)` instead of a hardcoded
  family that was never installed.
- `kira-kit check` is icon-library aware: with `iconLibrary: "lucide"` in
  components.json, lucide imports satisfy the canonical tabler dependency
  declarations in both check directions.
