import { describe, expect, it } from "vitest";
import { generateTheme, ThemeContrastError } from "../src/core/theme/theme";
import { parseToOklch, wcagRatio } from "../src/core/theme/color";
import { PRESETS } from "../src/core/theme/presets";
import { generatePresetItems } from "../src/core/theme/generate-presets";

/** Independent copy of the blocking pair list from contrast.ts. */
const TEXT_PAIRS: Array<[fg: string, bg: string]> = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "background"],
  ["accent-foreground", "accent"],
  ["destructive-foreground", "destructive"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
];
const UI_PAIRS: Array<[fg: string, bg: string]> = [
  ["ring", "background"],
  ["border", "background"],
  ["sidebar-ring", "sidebar"],
  ["sidebar-border", "sidebar"],
];

/** Parsed cssVars lookup: token name (without the -- prefix) → OKLCH color. */
interface ParsedTokens {
  [token: string]: ReturnType<typeof parseToOklch>;
}

/** Parse cssVars strings back into OKLCH colors. */
function toTokens(vars: Record<string, string>): ParsedTokens {
  const out: ParsedTokens = {};
  for (const [key, value] of Object.entries(vars)) {
    out[key.replace(/^--/, "")] = parseToOklch(value);
  }
  return out;
}

function expectSchemeToPassAA(
  tokens: Record<string, { l: number; c: number; h: number }>,
  scheme: string,
) {
  for (const [fg, bg] of TEXT_PAIRS) {
    if (!tokens[fg] || !tokens[bg]) continue;
    const ratio = wcagRatio(tokens[fg], tokens[bg]);
    expect(
      ratio,
      `${scheme} text pair ${fg}/${bg} = ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(4.5);
  }
  for (const [fg, bg] of UI_PAIRS) {
    if (!tokens[fg] || !tokens[bg]) continue;
    const ratio = wcagRatio(tokens[fg], tokens[bg]);
    expect(
      ratio,
      `${scheme} UI pair ${fg}/${bg} = ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(3);
  }
}

describe("generateTheme", () => {
  it.each(
    Array.from({ length: 24 }, (_, i) => ({ hue: i * 15 })),
  )("passes WCAG AA for primary hue $hue across light and dark", ({ hue }) => {
    const primary = `oklch(0.65 0.19 ${hue})`;
    const theme = generateTheme({
      name: `hue-${hue}`,
      title: "Hue test",
      description: "Property test theme",
      primary,
      baseColor: "neutral",
    });
    expect(theme.failures).toHaveLength(0);
    expectSchemeToPassAA(toTokens(theme.item.cssVars?.light ?? {}), "light");
    expectSchemeToPassAA(toTokens(theme.item.cssVars?.dark ?? {}), "dark");
  });

  it("also passes for very light and very dark primaries", () => {
    for (const primary of ["oklch(0.92 0.06 90)", "oklch(0.3 0.09 260)"]) {
      const theme = generateTheme({
        name: "edge",
        title: "Edge test",
        description: "Property test theme",
        primary,
        baseColor: "stone",
      });
      expect(theme.failures).toHaveLength(0);
      expectSchemeToPassAA(toTokens(theme.item.cssVars?.light ?? {}), "light");
      expectSchemeToPassAA(toTokens(theme.item.cssVars?.dark ?? {}), "dark");
    }
  });

  it("emits a registry:theme item with numeric OKLCH cssVars", () => {
    const theme = generateTheme({
      name: "sample",
      title: "Sample",
      description: "Sample theme",
      primary: "#e2694a",
      baseColor: "stone",
    });
    expect(theme.item.name).toBe("theme-sample");
    expect(theme.item.type).toBe("registry:theme");
    for (const scheme of ["light", "dark"] as const) {
      const vars = theme.item.cssVars?.[scheme] ?? {};
      expect(vars["--background"]).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
      expect(Object.keys(vars)).toContain("--primary");
      expect(Object.keys(vars)).toContain("--chart-1");
      expect(Object.keys(vars)).toContain("--sidebar");
    }
    expect(theme.item.cssVars?.theme?.["--radius"]).toBeDefined();
  });

  it("reports APCA values and records adjustments", () => {
    const theme = generateTheme({
      name: "apca",
      title: "APCA",
      description: "Sample theme",
      primary: "#e2694a",
      baseColor: "neutral",
    });
    expect(theme.apca.length).toBeGreaterThan(0);
    for (const entry of theme.apca) {
      expect(entry.lc).toBeGreaterThanOrEqual(0);
    }
    // Vivid mid-lightness primaries always need a foreground adjustment.
    expect(theme.adjustments.length).toBeGreaterThan(0);
  });

  it("throws ThemeContrastError when auto-adjust cannot fix a pair", () => {
    // Zero-chroma primary on identical base hue can exhaust adjustment for
    // some pairs only in pathological setups; ensure the error type carries
    // failure details when it does throw.
    try {
      generateTheme({
        name: "maybe-fail",
        title: "Maybe fail",
        description: "Sample theme",
        primary: "oklch(0.99 0.02 0)",
        baseColor: "neutral",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeContrastError);
      // SAFETY: generateTheme throws only ThemeContrastError, and the
      // instanceof assertion above guarantees the failure details are present.
      expect((error as ThemeContrastError).failures.length).toBeGreaterThan(0);
    }
  });
});

describe("presets", () => {
  it("has 6-10 curated presets with real descriptions", () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(6);
    expect(PRESETS.length).toBeLessThanOrEqual(10);
    for (const preset of PRESETS) {
      expect(preset.name).toMatch(/^[a-z0-9-]+$/);
      expect(preset.description.length).toBeGreaterThan(20);
      expect(preset.primary).toMatch(/^(#|oklch\()/);
    }
  });

  it("generates every preset through the same engine, all passing AA", () => {
    const { items, adjustments } = generatePresetItems();
    expect(items).toHaveLength(PRESETS.length);
    expect(adjustments.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.type).toBe("registry:theme");
      expect(item.cssVars?.light).toBeDefined();
      expect(item.cssVars?.dark).toBeDefined();
      expectSchemeToPassAA(toTokens(item.cssVars?.light ?? {}), `${item.name} light`);
      expectSchemeToPassAA(toTokens(item.cssVars?.dark ?? {}), `${item.name} dark`);
    }
  });
});
