import { describe, expect, it } from "vitest";
import {
  apcaLc,
  clampToSrgb,
  luminance,
  oklchCss,
  parseToOklch,
  wcagRatio,
} from "../src/core/theme/color";

describe("parseToOklch", () => {
  it("parses hex to sensible OKLCH values", () => {
    const color = parseToOklch("#e2694a");
    expect(color.l).toBeGreaterThan(0.5);
    expect(color.l).toBeLessThan(0.8);
    expect(color.c).toBeGreaterThan(0.1);
    expect(color.h).toBeGreaterThanOrEqual(0);
    expect(color.h).toBeLessThan(360);
  });

  it("parses named colors and hsl/rgb", () => {
    expect(parseToOklch("rebeccapurple").l).toBeGreaterThan(0);
    expect(parseToOklch("hsl(120 50% 40%)").l).toBeGreaterThan(0);
    expect(parseToOklch("rgb(0 0 0)").l).toBeLessThan(0.2);
  });

  it("round-trips through oklchCss", () => {
    const color = parseToOklch("#336699");
    const parsed = parseToOklch(oklchCss(color));
    expect(parsed.l).toBeCloseTo(color.l, 2);
    expect(parsed.h).toBeCloseTo(color.h, 0);
  });

  it("throws a helpful error for invalid input", () => {
    expect(() => parseToOklch("not-a-color")).toThrow(/Invalid color/);
  });
});

describe("wcagRatio", () => {
  it("black on white is 21:1", () => {
    const black = parseToOklch("#000000");
    const white = parseToOklch("#ffffff");
    expect(wcagRatio(black, white)).toBeCloseTo(21, 0);
    expect(wcagRatio(white, black)).toBeCloseTo(21, 0);
  });

  it("same color is 1:1", () => {
    const color = parseToOklch("#e2694a");
    expect(wcagRatio(color, color)).toBeCloseTo(1, 5);
  });
});

describe("apcaLc", () => {
  it("returns a non-negative number for strong contrast", () => {
    const black = parseToOklch("#000000");
    const white = parseToOklch("#ffffff");
    expect(apcaLc(black, white)).toBeGreaterThan(80);
  });

  it("returns 0 for identical colors", () => {
    const color = parseToOklch("#888888");
    expect(apcaLc(color, color)).toBe(0);
  });
});

describe("clampToSrgb", () => {
  it("brings an out-of-gamut color into sRGB (chroma may drop, L may shift)", () => {
    const vivid = { l: 0.6, c: 0.4, h: 30 };
    const clamped = clampToSrgb(vivid);
    expect(clamped.c).toBeLessThan(vivid.c);
    expect(clamped.l).toBeGreaterThan(0);
    expect(clamped.l).toBeLessThan(1);
  });
});

describe("luminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(luminance(parseToOklch("#000000"))).toBeCloseTo(0, 5);
    expect(luminance(parseToOklch("#ffffff"))).toBeCloseTo(1, 2);
  });
});
