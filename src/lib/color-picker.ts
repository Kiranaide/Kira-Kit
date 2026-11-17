import {
  hexToHsva,
  hslaToHsva,
  hsvaToHex,
  hsvaToHexa,
  hsvaToHsla,
  hsvaToRgba,
  rgbaToHsva,
  type HexColor,
  type HslaColor,
  type HsvaColor,
  type RgbaColor,
} from "@uiw/color-convert";

export type OklchColor = { l: number; c: number; h: number; a?: number };

export type ColorFormat = "hex" | "hexa" | "rgb" | "hsl" | "oklch";

export type ColorInput =
  string | HsvaColor | HslaColor | RgbaColor | OklchColor;

export type ColorPickerValue = {
  hex: HexColor;
  hexa: string;
  hsl: HslaColor;
  rgb: RgbaColor;
  hsv: HsvaColor;
  oklch: OklchColor;
};

export type ColorHarmony = { name: string; colors: string[] };

const within = (n: number, min: number, max: number) =>
  Number.isFinite(n) && n >= min && n <= max;

const hue = (n: number) => ((n % 360) + 360) % 360;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const rounded = (n: number, places = 4) => Number(n.toFixed(places));

export const isHexColor = (input: string) =>
  /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(input);

function oklchChannels(color: OklchColor): [number, number, number] {
  const angle = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(angle);
  const b = color.c * Math.sin(angle);
  const l = (color.l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (color.l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (color.l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function isOklchInSrgb(color: OklchColor): boolean {
  return oklchChannels(color).every(
    (channel) => channel >= -0.000001 && channel <= 1.000001,
  );
}

export function oklchToRgba(color: OklchColor): RgbaColor {
  let mapped = { ...color, l: clamp(color.l, 0, 1), h: hue(color.h) };

  if (!isOklchInSrgb(mapped)) {
    let low = 0;
    let high = Math.max(0, color.c);

    for (let i = 0; i < 28; i++) {
      const c = (low + high) / 2;

      if (isOklchInSrgb({ ...mapped, c })) low = c;
      else high = c;
    }

    mapped = { ...mapped, c: low };
  }

  const [r, g, b] = oklchChannels(mapped).map((n) =>
    Math.round(clamp(toSrgb(n), 0, 1) * 255),
  );

  return { r, g, b, a: clamp(color.a ?? 1, 0, 1) };
}

export function rgbaToOklch(rgb: RgbaColor): OklchColor {
  const r = linear(rgb.r),
    g = linear(rgb.g),
    b = linear(rgb.b);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return {
    l: clamp(L, 0, 1),
    c: Math.hypot(a, B),
    h:
      Math.hypot(a, B) < 0.000001 ? 0 : hue((Math.atan2(B, a) * 180) / Math.PI),
    a: rgb.a,
  };
}

function toSrgb(n: number) {
  return n <= 0.0031308 ? n * 12.92 : 1.055 * n ** (1 / 2.4) - 0.055;
}

function linear(n: number) {
  const channel = n / 255;

  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function isColorText(input: ColorInput): input is string {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Discriminate the public string/channel union before validating its color channels.
  return typeof input === "string";
}

function isColorChannels(
  input: ColorInput,
): input is Exclude<ColorInput, string> {
  return input !== null && !isColorText(input);
}

function validOklch(color: OklchColor) {
  return (
    within(color.l, 0, 1) &&
    within(color.c, 0, 0.4) &&
    Number.isFinite(color.h) &&
    within(color.a ?? 1, 0, 1)
  );
}

function numeric(input: string, percentScale = 1): number {
  return input.endsWith("%")
    ? (Number(input.slice(0, -1)) * percentScale) / 100
    : Number(input);
}

function parseCss(input: string): HsvaColor | null {
  const match = /^(rgba?|hsla?|oklch)\(([^()]*)\)$/i.exec(input);

  if (!match) return null;

  const tokens = match[2]
    .trim()
    .replace(/,/g, " ")
    .replace(/\//g, " / ")
    .split(/\s+/);

  const slash = tokens.indexOf("/");
  const channels = slash < 0 ? tokens.slice(0, 3) : tokens.slice(0, slash);
  const alphaToken = slash < 0 ? tokens[3] : tokens[slash + 1];

  if (!validCssChannels(tokens, channels, slash)) return null;

  if (!validCssTokens(channels, alphaToken)) return null;
  const a = alphaToken === undefined ? 1 : numeric(alphaToken);

  if (!within(a, 0, 1)) return null;
  const kind = match[1].toLowerCase();

  if (kind.startsWith("rgb")) {
    const [r, g, b] = channels.map((token) => numeric(token, 255));

    return parseColor({ r, g, b, a });
  }

  const h = Number(channels[2].replace(/deg$/, ""));

  if (kind === "oklch")
    return parseColor({
      l: numeric(channels[0]),
      c: numeric(channels[1], 0.4),
      h,
      a,
    });

  return parseColor({
    h: Number(channels[0].replace(/deg$/, "")),
    s: numeric(channels[1], 100),
    l: numeric(channels[2], 100),
    a,
  });
}

export function parseColor(input: ColorInput): HsvaColor | null {
  if (isColorText(input)) {
    const text = input.trim();

    if (isHexColor(text)) return hexToHsva(text);

    return parseCss(text);
  }

  if (!isColorChannels(input)) return null;

  return parseColorChannels(input);
}

function parseColorChannels(
  input: Exclude<ColorInput, string>,
): HsvaColor | null {
  const a = input.a ?? 1;

  if (!within(a, 0, 1)) return null;

  if ("r" in input) return parseRgbChannels(input, a);

  if ("c" in input) {
    if (!validOklch({ ...input, a })) return null;

    return rgbaToHsva(oklchToRgba({ ...input, a }));
  }

  return parseHueChannels(input, a);
}

function parseHueChannels(
  input: HsvaColor | HslaColor,
  a: number,
): HsvaColor | null {
  if (!Number.isFinite(input.h) || !within(input.s, 0, 100)) return null;

  if ("v" in input)
    return within(input.v, 0, 100) ? { ...input, h: hue(input.h), a } : null;

  return within(input.l, 0, 100)
    ? hslaToHsva({ ...input, h: hue(input.h), a })
    : null;
}

export function getColorAsHsva(input: ColorInput): HsvaColor {
  const color = parseColor(input);

  if (!color)
    throw new RangeError("Enter a valid HEX, RGB, HSL or OKLCH color.");

  return color;
}

function isHexValue(value: string): value is HexColor {
  return /^#[\da-f]{6}$/i.test(value);
}

export function colorValue(color: HsvaColor): ColorPickerValue {
  const rgb = hsvaToRgba(color);
  const hex = hsvaToHex(color);

  if (!isHexValue(hex))
    throw new RangeError("The color could not be serialized as sRGB.");

  return {
    hex,
    hexa: hsvaToHexa(color),
    hsv: { ...color },
    hsl: hsvaToHsla(color),
    rgb,
    oklch: rgbaToOklch(rgb),
  };
}

export function formatColor(
  color: HsvaColor,
  format: ColorFormat,
  includeAlpha = color.a < 1,
): string {
  const value = colorValue(color);
  const alpha = includeAlpha ? " / " + rounded(color.a) : "";

  switch (format) {
    case "hex":
      return includeAlpha ? value.hexa : value.hex;
    case "hexa":
      return value.hexa;
    case "rgb":
      return (
        "rgb(" + [value.rgb.r, value.rgb.g, value.rgb.b].join(" ") + alpha + ")"
      );
    case "hsl":
      return (
        "hsl(" +
        rounded(value.hsl.h, 2) +
        " " +
        rounded(value.hsl.s, 2) +
        "% " +
        rounded(value.hsl.l, 2) +
        "%" +
        alpha +
        ")"
      );
    case "oklch":
      return (
        "oklch(" +
        rounded(value.oklch.l * 100, 4) +
        "% " +
        rounded(value.oklch.c, 6) +
        " " +
        rounded(value.oklch.h, 3) +
        alpha +
        ")"
      );
  }
}

export function generateHarmonies(color: HsvaColor): ColorHarmony[] {
  const hsl = hsvaToHsla(color);

  const hex = (h: number, l = hsl.l) =>
    hsvaToHex(hslaToHsva({ ...hsl, h: hue(h), l }));

  const base = hsvaToHex(color);

  return [
    { name: "Complementary", colors: [base, hex(hsl.h + 180)] },
    { name: "Analogous", colors: [hex(hsl.h - 30), base, hex(hsl.h + 30)] },
    { name: "Triadic", colors: [base, hex(hsl.h + 120), hex(hsl.h + 240)] },
    {
      name: "Monochromatic",
      colors: [
        hex(hsl.h, Math.min(95, hsl.l + 30)),
        base,
        hex(hsl.h, Math.max(10, hsl.l - 20)),
        hex(hsl.h, Math.max(5, hsl.l - 40)),
      ],
    },
  ].map((group) => ({ ...group, colors: Array.from(new Set(group.colors)) }));
}

function composite(foreground: RgbaColor, background: RgbaColor): RgbaColor {
  const a = foreground.a + background.a * (1 - foreground.a);

  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };

  const channel = (front: number, back: number) =>
    (front * foreground.a + back * background.a * (1 - foreground.a)) / a;

  return {
    r: channel(foreground.r, background.r),
    g: channel(foreground.g, background.g),
    b: channel(foreground.b, background.b),
    a,
  };
}

function luminance(rgb: RgbaColor): number {
  return (
    0.2126 * linear(rgb.r) + 0.7152 * linear(rgb.g) + 0.0722 * linear(rgb.b)
  );
}

export function getContrastRatio(
  foreground: ColorInput,
  background: ColorInput,
): number | null {
  const front = parseColor(foreground),
    back = parseColor(background);

  if (!front || !back || back.a !== 1) return null;
  const bg = hsvaToRgba(back);
  const first = luminance(composite(hsvaToRgba(front), bg));
  const second = luminance(bg);

  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function initialColor(
  input: ColorInput,
  defaultAlpha?: number,
): HsvaColor {
  const parsed = parseColor(input) ?? { h: 217, s: 76, v: 96, a: 1 };

  const explicitAlpha = isColorChannels(input)
    ? input.a !== undefined
    : /^#(?:[\da-f]{4}|[\da-f]{8})$/i.test(input) ||
      /\/|^(?:rgba|hsla)\([^)]*,[^)]*,[^)]*,/i.test(input);

  return defaultAlpha !== undefined &&
    Number.isFinite(defaultAlpha) &&
    !explicitAlpha
    ? { ...parsed, a: clamp(defaultAlpha, 0, 1) }
    : parsed;
}

export function parseOklchInput(input: ColorInput): OklchColor | null {
  if (isColorChannels(input))
    return "c" in input && validOklch(input) ? input : null;

  const match =
    /^oklch\(\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)%?)\s+([+-]?(?:\d+(?:\.\d*)?|\.\d+)%?)\s+([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?)(?:\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)%?))?\s*\)$/i.exec(
      input.trim(),
    );

  if (!match) return null;

  const color = {
    l: numeric(match[1]),
    c: numeric(match[2], 0.4),
    h: Number(match[3].replace(/deg$/i, "")),
    a: match[4] === undefined ? 1 : numeric(match[4]),
  };

  return validOklch(color) ? color : null;
}

export function findAccessibleColor(
  foreground: HsvaColor,
  background: ColorInput,
  target: number,
): HsvaColor | null {
  if (getContrastRatio(foreground, background) === null) return null;
  const base = rgbaToOklch(hsvaToRgba(foreground));
  let best: HsvaColor | null = null;
  let distance = Infinity;

  for (let i = 0; i <= 200; i++) {
    const l = i / 200;
    const candidate = rgbaToHsva(oklchToRgba({ ...base, l, a: foreground.a }));
    const ratio = getContrastRatio(candidate, background);

    if (ratio !== null && ratio >= target && Math.abs(l - base.l) < distance) {
      best = candidate;
      distance = Math.abs(l - base.l);
    }
  }

  return best;
}

export function serializeColorToken(name: string, color: HsvaColor): string {
  if (!/^[A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)*$/.test(name))
    throw new RangeError(
      "Use a token name such as brand.primary, with letters, numbers, underscores or hyphens.",
    );
  const rgb = hsvaToRgba(color);

  const token = {
    $type: "color",
    $value: {
      colorSpace: "srgb",
      components: [rgb.r, rgb.g, rgb.b].map((channel) => channel / 255),
      alpha: color.a,
    },
  };

  const parts = name.split(".");

  const nested: object = parts.reduceRight<object>(
    (value, part) => Object.fromEntries([[part, value]]),
    token,
  );

  return JSON.stringify(nested, null, 2);
}

export { hslaToHsva };

function parseRgbChannels(input: RgbaColor, a: number): HsvaColor | null {
  if (![input.r, input.g, input.b].every((n) => within(n, 0, 255))) return null;

  return rgbaToHsva({ ...input, a });
}

function validCssChannels(tokens: string[], channels: string[], slash: number) {
  return (
    channels.length === 3 &&
    (slash < 0 ? tokens.length <= 4 : tokens.length === slash + 2)
  );
}

function validCssTokens(channels: string[], alphaToken: string | undefined) {
  const tokens =
    alphaToken === undefined ? channels : [...channels, alphaToken];

  return tokens.every((token) =>
    /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:%|deg)?$/.test(token),
  );
}
