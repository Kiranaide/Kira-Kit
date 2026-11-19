import { ValidationError } from "../../lib/errors";

export type FontKind = "sans" | "mono";

export interface FontSpec {
  name: string;
  pkg: string;
  family: string;
  stack: string;
}

function spec(name: string, family: string, kind: FontKind): FontSpec {
  const fallback =
    kind === "sans"
      ? "ui-sans-serif, system-ui, sans-serif"
      : "ui-monospace, monospace";

  return {
    name,
    pkg: `@fontsource-variable/${name}`,
    family,
    stack: `"${family}", ${fallback}`,
  };
}

export const SANS_FONTS = {
  geist: spec("geist", "Geist Variable", "sans"),
  inter: spec("inter", "Inter Variable", "sans"),
  manrope: spec("manrope", "Manrope Variable", "sans"),
  "plus-jakarta-sans": spec(
    "plus-jakarta-sans",
    "Plus Jakarta Sans Variable",
    "sans",
  ),
  "space-grotesk": spec("space-grotesk", "Space Grotesk Variable", "sans"),
  "dm-sans": spec("dm-sans", "DM Sans Variable", "sans"),
} satisfies Record<string, FontSpec>;

export const MONO_FONTS = {
  "geist-mono": spec("geist-mono", "Geist Mono Variable", "mono"),
  "jetbrains-mono": spec("jetbrains-mono", "JetBrains Mono Variable", "mono"),
  "fira-code": spec("fira-code", "Fira Code Variable", "mono"),
} satisfies Record<string, FontSpec>;

export const DEFAULT_SANS = "geist";
export const DEFAULT_MONO = "geist-mono";

export function fontCatalog(kind: FontKind): Record<string, FontSpec> {
  return kind === "sans" ? SANS_FONTS : MONO_FONTS;
}

export function resolveFont(kind: FontKind, name: string): FontSpec {
  const catalog = fontCatalog(kind);
  const found = catalog[name];

  if (!found) {
    throw new ValidationError(
      `Unknown ${kind} font "${name}".`,
      `Valid options: ${Object.keys(catalog).join(", ")}.`,
    );
  }

  return found;
}
