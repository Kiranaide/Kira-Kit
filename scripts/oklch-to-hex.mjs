import { formatHex, formatHex8 } from "culori";

// All OKLCH values from src/index.css
const lightTokens = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.59 0.22 1)",
  "primary-foreground": "oklch(0.97 0.01 343)",
  secondary: "oklch(0.75 0.1 10)",
  "secondary-foreground": "oklch(0.2 0.03 15)",
  muted: "oklch(0.95 0.02 20)",
  "muted-foreground": "oklch(0.5 0.03 25)",
  accent: "oklch(0.92 0.04 15)",
  "accent-foreground": "oklch(0.3 0.04 20)",
  destructive: "oklch(0.6 0.22 20)",
  "destructive-foreground": "oklch(0.98 0.01 20)",
  info: "oklch(0.75 0.16 225)",
  "info-foreground": "oklch(0.98 0.01 225)",
  success: "oklch(0.75 0.18 150)",
  "success-foreground": "oklch(0.98 0.01 150)",
  warning: "oklch(0.8 0.16 80)",
  "warning-foreground": "oklch(0.2 0.03 80)",
  border: "oklch(0.9 0.01 20)",
  input: "oklch(0.9 0.01 20)",
  ring: "oklch(0.7 0.12 350)",
  "chart-1": "oklch(0.75 0.14 185)",
  "chart-2": "oklch(0.75 0.18 35)",
  "chart-3": "oklch(0.78 0.14 95)",
  "chart-4": "oklch(0.7 0.12 280)",
  "chart-5": "oklch(0.65 0.1 160)",
  sidebar: "oklch(0.985 0 0)",
  "sidebar-foreground": "oklch(0.145 0 0)",
  "sidebar-primary": "oklch(0.59 0.22 1)",
  "sidebar-primary-foreground": "oklch(0.97 0.01 343)",
  "sidebar-accent": "oklch(0.9 0.04 15)",
  "sidebar-accent-foreground": "oklch(0.25 0.04 15)",
  "sidebar-border": "oklch(0.922 0 0)",
  "sidebar-ring": "oklch(0.7 0.12 350)",
  "scrollbar-thumb": "oklch(0.7 0 0 / 40%)",
  "scrollbar-track": "transparent",
  "scrollbar-thumb-hover": "oklch(0.6 0 0 / 60%)",
};

const darkTokens = {
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)",
  "card-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",
  primary: "oklch(0.66 0.21 354)",
  "primary-foreground": "oklch(0.97 0.01 343)",
  secondary: "oklch(0.6 0.08 10)",
  "secondary-foreground": "oklch(0.985 0 0)",
  muted: "oklch(0.25 0.02 15)",
  "muted-foreground": "oklch(0.65 0.03 20)",
  accent: "oklch(0.4 0.08 10)",
  "accent-foreground": "oklch(0.98 0.01 10)",
  destructive: "oklch(0.65 0.2 15)",
  "destructive-foreground": "oklch(0.98 0.01 15)",
  info: "oklch(0.65 0.14 220)",
  "info-foreground": "oklch(0.98 0.01 220)",
  success: "oklch(0.65 0.16 145)",
  "success-foreground": "oklch(0.98 0.01 145)",
  warning: "oklch(0.7 0.14 75)",
  "warning-foreground": "oklch(0.15 0.03 75)",
  border: "oklch(1 0 0 / 15%)",
  input: "oklch(1 0 0 / 20%)",
  ring: "oklch(0.65 0.14 350)",
  "chart-1": "oklch(0.7 0.12 185)",
  "chart-2": "oklch(0.7 0.16 35)",
  "chart-3": "oklch(0.72 0.12 95)",
  "chart-4": "oklch(0.65 0.1 280)",
  "chart-5": "oklch(0.6 0.08 160)",
  sidebar: "oklch(0.205 0 0)",
  "sidebar-foreground": "oklch(0.985 0 0)",
  "sidebar-primary": "oklch(0.73 0.18 350)",
  "sidebar-primary-foreground": "oklch(0.97 0.01 343)",
  "sidebar-accent": "oklch(0.45 0.08 10)",
  "sidebar-accent-foreground": "oklch(0.98 0.01 10)",
  "sidebar-border": "oklch(1 0 0 / 10%)",
  "sidebar-ring": "oklch(0.65 0.14 350)",
  "scrollbar-thumb": "oklch(0.5 0 0 / 40%)",
  "scrollbar-track": "transparent",
  "scrollbar-thumb-hover": "oklch(0.6 0 0 / 60%)",
};

// Generate primitive color ramps using OKLCH
const ramps = {
  // Neutral (achromatic)
  neutral: {
    hue: 0,
    chroma: 0,
    steps: [
      { name: "0", l: 0 },
      { name: "5", l: 0.05 },
      { name: "10", l: 0.145 },
      { name: "15", l: 0.205 },
      { name: "20", l: 0.25 },
      { name: "25", l: 0.3 },
      { name: "30", l: 0.35 },
      { name: "40", l: 0.4 },
      { name: "50", l: 0.5 },
      { name: "60", l: 0.6 },
      { name: "65", l: 0.65 },
      { name: "70", l: 0.7 },
      { name: "80", l: 0.8 },
      { name: "85", l: 0.85 },
      { name: "90", l: 0.9 },
      { name: "92", l: 0.922 },
      { name: "95", l: 0.95 },
      { name: "98", l: 0.985 },
      { name: "100", l: 1.0 },
    ],
  },
  // Rose/Magenta (primary hue ~350-1)
  rose: {
    hue: 355,
    steps: [
      { name: "50", l: 0.97, c: 0.01 },
      { name: "100", l: 0.94, c: 0.04 },
      { name: "200", l: 0.88, c: 0.08 },
      { name: "300", l: 0.8, c: 0.12 },
      { name: "400", l: 0.73, c: 0.18 },
      { name: "500", l: 0.66, c: 0.21 },
      { name: "600", l: 0.59, c: 0.22 },
      { name: "700", l: 0.5, c: 0.2 },
      { name: "800", l: 0.4, c: 0.16 },
      { name: "900", l: 0.3, c: 0.12 },
    ],
  },
  // Red (destructive hue ~15-20)
  red: {
    hue: 18,
    steps: [
      { name: "50", l: 0.98, c: 0.01 },
      { name: "100", l: 0.94, c: 0.04 },
      { name: "200", l: 0.86, c: 0.08 },
      { name: "300", l: 0.78, c: 0.14 },
      { name: "400", l: 0.7, c: 0.18 },
      { name: "500", l: 0.65, c: 0.2 },
      { name: "600", l: 0.6, c: 0.22 },
      { name: "700", l: 0.5, c: 0.18 },
      { name: "800", l: 0.4, c: 0.14 },
      { name: "900", l: 0.3, c: 0.1 },
    ],
  },
  // Blue (info hue ~220-225)
  blue: {
    hue: 222,
    steps: [
      { name: "50", l: 0.98, c: 0.01 },
      { name: "100", l: 0.94, c: 0.04 },
      { name: "200", l: 0.88, c: 0.08 },
      { name: "300", l: 0.8, c: 0.12 },
      { name: "400", l: 0.75, c: 0.16 },
      { name: "500", l: 0.65, c: 0.14 },
      { name: "600", l: 0.55, c: 0.16 },
      { name: "700", l: 0.45, c: 0.14 },
      { name: "800", l: 0.35, c: 0.12 },
      { name: "900", l: 0.25, c: 0.08 },
    ],
  },
  // Green (success hue ~145-150)
  green: {
    hue: 148,
    steps: [
      { name: "50", l: 0.98, c: 0.01 },
      { name: "100", l: 0.94, c: 0.04 },
      { name: "200", l: 0.88, c: 0.08 },
      { name: "300", l: 0.8, c: 0.14 },
      { name: "400", l: 0.75, c: 0.18 },
      { name: "500", l: 0.65, c: 0.16 },
      { name: "600", l: 0.55, c: 0.16 },
      { name: "700", l: 0.45, c: 0.14 },
      { name: "800", l: 0.35, c: 0.1 },
      { name: "900", l: 0.25, c: 0.06 },
    ],
  },
  // Amber (warning hue ~75-80)
  amber: {
    hue: 78,
    steps: [
      { name: "50", l: 0.98, c: 0.02 },
      { name: "100", l: 0.94, c: 0.06 },
      { name: "200", l: 0.88, c: 0.1 },
      { name: "300", l: 0.8, c: 0.16 },
      { name: "400", l: 0.75, c: 0.16 },
      { name: "500", l: 0.7, c: 0.14 },
      { name: "600", l: 0.6, c: 0.14 },
      { name: "700", l: 0.5, c: 0.12 },
      { name: "800", l: 0.4, c: 0.1 },
      { name: "900", l: 0.3, c: 0.06 },
      { name: "950", l: 0.15, c: 0.03 },
    ],
  },
  // Warm Gray (secondary/muted/accent hue ~10-25)
  "warm-gray": {
    hue: 18,
    steps: [
      { name: "50", l: 0.95, c: 0.02 },
      { name: "100", l: 0.92, c: 0.04 },
      { name: "200", l: 0.88, c: 0.04 },
      { name: "300", l: 0.8, c: 0.04 },
      { name: "400", l: 0.75, c: 0.1 },
      { name: "500", l: 0.6, c: 0.08 },
      { name: "600", l: 0.5, c: 0.06 },
      { name: "700", l: 0.4, c: 0.08 },
      { name: "800", l: 0.25, c: 0.02 },
      { name: "900", l: 0.2, c: 0.03 },
    ],
  },
};

function parseOklch(str) {
  if (str === "transparent") return null;

  const alphaMatch = str.match(
    /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.]+)%?\)/,
  );

  const noAlphaMatch = str.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);

  if (alphaMatch) {
    const [, l, c, h, a] = alphaMatch;

    return { mode: "oklch", l: +l, c: +c, h: +h, alpha: +a / 100 };
  }

  if (noAlphaMatch) {
    const [, l, c, h] = noAlphaMatch;

    return { mode: "oklch", l: +l, c: +c, h: +h };
  }

  return null;
}

function toHex(oklchStr) {
  if (oklchStr === "transparent") return "#00000000";
  const parsed = parseOklch(oklchStr);

  if (!parsed) return null;

  if (parsed.alpha !== undefined && parsed.alpha < 1) {
    return formatHex8(parsed);
  }

  return formatHex(parsed);
}

// Convert semantic tokens
const result = { light: {}, dark: {}, primitives: {} };

for (const [name, val] of Object.entries(lightTokens)) {
  result.light[name] = { oklch: val, hex: toHex(val) };
}

for (const [name, val] of Object.entries(darkTokens)) {
  result.dark[name] = { oklch: val, hex: toHex(val) };
}

// Generate primitive ramps
for (const [rampName, config] of Object.entries(ramps)) {
  result.primitives[rampName] = {};

  for (const step of config.steps) {
    const c = step.c === undefined ? config.chroma : step.c;
    const h = step.h === undefined ? config.hue : step.h;
    const color = { mode: "oklch", l: step.l, c, h };
    result.primitives[rampName][step.name] = {
      oklch: `oklch(${step.l} ${c} ${h})`,
      hex: formatHex(color),
    };
  }
}

console.log(JSON.stringify(result, null, 2));
