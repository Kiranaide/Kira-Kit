import { topLevelBlocks } from "../install/css-vars";
import { applyFontToCss } from "../install/apply-fonts";
import type { FontSpec } from "../theme/fonts";
import type { SourceRegistryItem } from "../../lib/schemas";

export interface ThemeTokens {
  light: Record<string, string>;
  dark: Record<string, string>;
}

function declarations(body: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];

  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    pairs.push([match[1], match[2].replace(/\s+/g, " ").trim()]);
  }

  return pairs;
}

/** Motion tokens ship with the base/item CSS, never with a color theme. */
function isMotionToken(key: string): boolean {
  return key.startsWith("--animate-") || key.startsWith("--ease-");
}

/** Extract depth-0 :root/.dark custom properties (kit CSS tokens). */
export function extractThemeTokens(css: string): ThemeTokens {
  const tokens: ThemeTokens = { light: {}, dark: {} };

  for (const block of topLevelBlocks(css)) {
    if (block.selector !== ":root" && block.selector !== ".dark") continue;

    const target = block.selector === ":root" ? tokens.light : tokens.dark;
    const body = css.slice(block.open + 1, block.close);

    for (const [key, value] of declarations(body)) {
      if (isMotionToken(key)) continue;

      target[key] = value;
    }
  }

  return tokens;
}

/** Point the kit CSS at the utilities file shipped beside it. */
export function buildBaseCss(
  css: string,
  utilitiesImport: string,
  fonts?: { sans: FontSpec; mono: FontSpec },
): string {
  const rewired = css.replace(
    /@import\s+["'][^"']*kira-utilities\.css["'];?/,
    `@import "${utilitiesImport}";`,
  );

  return fonts ? applyFontToCss(rewired, fonts.sans, fonts.mono) : rewired;
}

/** registry:theme item carrying the kit's own docs-app theme. */
export function defaultThemeItem(css: string): SourceRegistryItem {
  const tokens = extractThemeTokens(css);

  return {
    name: "theme-default",
    type: "registry:theme",
    title: "Kira Default",
    description:
      "The kit's own docs-app theme: a pink primary on neutral surfaces with a compact 0.45rem radius.",
    cssVars: {
      theme: { "--radius": tokens.light["--radius"] ?? "0.45rem" },
      light: tokens.light,
      dark: tokens.dark,
    },
  };
}
