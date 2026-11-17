import {
  clampChroma,
  converter,
  formatCss,
  parse,
  wcagLuminance,
} from "culori";
import { APCAcontrast, sRGBtoY } from "apca-w3";

export type OklchColor = { l: number; c: number; h: number };

const oklch = converter("oklch");
const rgbConverter = converter("rgb");

export function parseToOklch(input: string): OklchColor {
  const parsed = parse(input.trim());
  if (!parsed) {
    throw new Error(
      `Invalid color: "${input}". Use a hex like #e2694a, a named CSS color, oklch(...), hsl(...), or rgb(...).`,
    );
  }
  const converted = oklch(parsed);
  if (converted === undefined || Number.isNaN(converted.l)) {
    throw new Error(`Color "${input}" could not be converted to OKLCH.`);
  }
  return { l: converted.l, c: converted.c, h: converted.h ?? 0 };
}

/** Numeric OKLCH → CSS string. Numeric output, no string interpolation. */
export function oklchCss(color: OklchColor): string {
  const l = round(color.l, 3);
  const c = round(color.c, 3);
  const h = round(color.h, 1);
  return formatCss({ mode: "oklch", l, c, h });
}

export function clampToSrgb(color: OklchColor): OklchColor {
  const clamped = clampChroma({ mode: "oklch", ...color }, "rgb");
  return { l: clamped.l, c: clamped.c, h: clamped.h ?? 0 };
}

/** WCAG 2.x relative luminance, computed on the sRGB-clamped color. */
export function luminance(color: OklchColor): number {
  const clamped = clampChroma({ mode: "oklch", ...color }, "rgb");
  return wcagLuminance(clamped);
}

export function wcagRatio(fg: OklchColor, bg: OklchColor): number {
  const lf = luminance(fg);
  const lb = luminance(bg);
  const hi = Math.max(lf, lb);
  const lo = Math.min(lf, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** APCA Lc (non-blocking, informational). Absolute value reported. */
export function apcaLc(fg: OklchColor, bg: OklchColor): number {
  const fgY = sRGBtoY(toRgb255(fg));
  const bgY = sRGBtoY(toRgb255(bg));
  const value = APCAcontrast(fgY, bgY);
  if (typeof value === "number") return Math.abs(value);
  return 0;
}

function toRgb255(color: OklchColor): [number, number, number] {
  const rgb = rgbConverter(clampChroma({ mode: "oklch", ...color }, "rgb"));
  const channel = (v: number | undefined) =>
    Math.round(Math.min(1, Math.max(0, v ?? 0)) * 255);
  return [channel(rgb.r), channel(rgb.g), channel(rgb.b)];
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
