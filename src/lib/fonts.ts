// Keep in sync with packages/cli/src/core/theme/fonts.ts (the CLI catalog).
export interface DocsFont {
  name: string;
  family: string;
  stack: string;
}

function sans(name: string, family: string): DocsFont {
  return {
    name,
    family,
    stack: `"${family}", ui-sans-serif, system-ui, sans-serif`,
  };
}

function mono(name: string, family: string): DocsFont {
  return { name, family, stack: `"${family}", ui-monospace, monospace` };
}

export const DOC_SANS_FONTS: DocsFont[] = [
  sans("geist", "Geist Variable"),
  sans("inter", "Inter Variable"),
  sans("manrope", "Manrope Variable"),
  sans("plus-jakarta-sans", "Plus Jakarta Sans Variable"),
  sans("space-grotesk", "Space Grotesk Variable"),
  sans("dm-sans", "DM Sans Variable"),
];

export const DOC_MONO_FONTS: DocsFont[] = [
  mono("geist-mono", "Geist Mono Variable"),
  mono("jetbrains-mono", "JetBrains Mono Variable"),
  mono("fira-code", "Fira Code Variable"),
];

export const DEFAULT_DOC_SANS = "geist";
export const DEFAULT_DOC_MONO = "geist-mono";
