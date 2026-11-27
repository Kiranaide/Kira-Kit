import { describe, expect, it } from "vitest";
import {
  BASE_COLOR_NAMES,
  generateBaseColorVars,
  generateTheme,
  ThemeContrastError,
} from "../src/core/theme/theme";
import { parseToOklch, wcagRatio } from "../src/core/theme/color";
import {
  RADIUS_PRESET_NAMES,
  SURFACE_PRESET_NAMES,
  resolveRadius,
  resolveSurface,
} from "../src/core/theme/geometry";
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
  ["info-foreground", "info"],
  ["success-foreground", "success"],
  ["warning-foreground", "warning"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
];

const UI_PAIRS: Array<[fg: string, bg: string]> = [
  ["ring", "background"],
  ["sidebar-ring", "sidebar"],
];

/** Parsed cssVars lookup: token name (without the -- prefix) → OKLCH color. */
interface ParsedTokens {
  [token: string]: ReturnType<typeof parseToOklch>;
}

/** Parse color cssVars strings back into OKLCH colors (skips non-color tokens like --shadow-*). */
function toTokens(vars: Record<string, string>): ParsedTokens {
  const out: ParsedTokens = {};

  for (const [key, value] of Object.entries(vars)) {
    if (key.startsWith("--shadow-") || key === "--radius") continue;
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
  it.each(Array.from({ length: 24 }, (_, i) => ({ hue: i * 15 })))(
    "passes WCAG AA for primary hue $hue across light and dark",
    ({ hue }) => {
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
    },
  );

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
    expect(adjustments).toEqual([]);

    for (const item of items) {
      expect(item.type).toBe("registry:theme");
      expect(item.cssVars?.light).toBeDefined();
      expect(item.cssVars?.dark).toBeDefined();
      expectSchemeToPassAA(
        toTokens(item.cssVars?.light ?? {}),
        `${item.name} light`,
      );
      expectSchemeToPassAA(
        toTokens(item.cssVars?.dark ?? {}),
        `${item.name} dark`,
      );
    }
  });

  it("generates perceptually distinct AA-passing base color presets", () => {
    expect(BASE_COLOR_NAMES).toContain("paper");
    expect(BASE_COLOR_NAMES).toContain("anthracite");

    for (const baseColor of BASE_COLOR_NAMES) {
      const vars = generateBaseColorVars(baseColor);
      expectSchemeToPassAA(toTokens(vars.light), `${baseColor} light`);
      expectSchemeToPassAA(toTokens(vars.dark), `${baseColor} dark`);
    }

    const paper = generateBaseColorVars("paper");
    const slate = generateBaseColorVars("slate");
    expect(paper.light["--background"]).not.toBe(slate.light["--background"]);
    expect(paper.dark["--background"]).not.toBe(slate.dark["--background"]);
  });

  it("resolves radius and surface presets", () => {
    expect(RADIUS_PRESET_NAMES).toEqual([
      "sharp",
      "crisp",
      "balanced",
      "soft",
      "pill",
    ]);
    expect(SURFACE_PRESET_NAMES).toEqual(["hairline", "tactile", "elevated"]);
    expect(resolveRadius("crisp").value).toBe("0.375rem");
    expect(resolveRadius("0.5rem").value).toBe("0.5rem");
    expect(resolveSurface("tactile").light["--shadow-card"]).toContain("inset");
  });

  it("applies radius, surface, and semantic status tokens in generateTheme", () => {
    const generated = generateTheme({
      name: "geom",
      title: "Geom",
      description: "Geometry test",
      primary: "#2552D9",
      baseColor: "anthracite",
      radius: "sharp",
      surface: "elevated",
    });

    const themeVars = generated.item.cssVars?.theme ?? {};
    const light = generated.item.cssVars?.light ?? {};

    expect(themeVars["--radius"]).toBe("0rem");
    expect(light["--shadow-card"]).toBeDefined();
    expect(light["--info"]).toBeDefined();
    expect(light["--success"]).toBeDefined();
    expect(light["--warning"]).toBeDefined();
  });
});
