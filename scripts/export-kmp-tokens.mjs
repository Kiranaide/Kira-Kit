import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const registry = JSON.parse(
  readFileSync(resolve(rootDir, "src/themes/registry.json"), "utf8"),
);
const catalog = JSON.parse(
  readFileSync(resolve(rootDir, "src/themes/catalog.json"), "utf8"),
);

/**
 * Exact OKLCH -> sRGB conversion (Björn Ottosson's OKLab matrices) with
 * gamut clamping to [0, 1]. Returns hex (#RRGGBB or #RRGGBBAA) and
 * Compose Multiplatform ARGB literal (0xAARRGGBB).
 */
function parseOklch(str) {
  const match = str
    .trim()
    .match(
      /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/,
    );
  if (!match) return null;
  const l = Number(match[1]);
  const c = Number(match[2]);
  const h = Number(match[3]);
  let alpha = 1;
  if (match[4] !== undefined) {
    alpha = match[5] === "%" ? Number(match[4]) / 100 : Number(match[4]);
  }
  return { l, c, h, alpha };
}

function linearToSrgb(channel) {
  const clamped = Math.min(1, Math.max(0, channel));
  if (clamped <= 0.0031308) return 12.92 * clamped;
  return 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

function oklchToColor(oklchStr) {
  const parsed = parseOklch(oklchStr);
  if (!parsed) return null;

  const { l, c, h, alpha } = parsed;
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const r = Math.round(linearToSrgb(rLin) * 255);
  const g = Math.round(linearToSrgb(gLin) * 255);
  const bl = Math.round(linearToSrgb(bLin) * 255);
  const al = Math.round(Math.min(1, Math.max(0, alpha)) * 255);

  const hex2 = (n) => n.toString(16).padStart(2, "0").toUpperCase();
  const rr = hex2(r);
  const gg = hex2(g);
  const bb = hex2(bl);
  const aa = hex2(al);

  return {
    oklch: oklchStr,
    hex: al < 255 ? `#${rr}${gg}${bb}${aa}` : `#${rr}${gg}${bb}`,
    argb: `0x${aa}${rr}${gg}${bb}`,
    rgba: { r, g, b: bl, a: Number((al / 255).toFixed(4)) },
  };
}

function remToDp(remStr) {
  const match = String(remStr).trim().match(/^([\d.]+)rem$/);
  if (!match) return 0;
  return Number((Number(match[1]) * 16).toFixed(2));
}

function buildRadiusScale(baseRem) {
  const baseDp = remToDp(baseRem);
  const clamp = (v) => Number(Math.max(0, v).toFixed(2));
  return {
    baseRem,
    baseDp,
    smDp: clamp(baseDp - 4),
    mdDp: clamp(baseDp - 2),
    lgDp: clamp(baseDp),
    xlDp: clamp(baseDp + 4),
    xxlDp: clamp(baseDp + 8),
    xxxlDp: clamp(baseDp + 12),
    xxxxlDp: clamp(baseDp + 16),
  };
}

function stripPrefix(cssVarName) {
  return cssVarName.replace(/^--/, "");
}

function toCamelCase(kebab) {
  return kebab.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

function toPascalCase(kebab) {
  const camel = toCamelCase(kebab);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function convertColorBlock(varsObj) {
  const colors = {};
  const shadows = {};
  const other = {};

  for (const [key, value] of Object.entries(varsObj)) {
    const cleanKey = stripPrefix(key);
    if (cleanKey.startsWith("shadow-")) {
      shadows[cleanKey.replace(/^shadow-/, "")] = value;
    } else if (cleanKey === "radius") {
      other.radius = value;
    } else {
      const converted = oklchToColor(value);
      if (converted) {
        colors[cleanKey] = converted;
      } else {
        other[cleanKey] = value;
      }
    }
  }
  return { colors, shadows, other };
}

const themes = registry.items.map((item) => {
  const recipe = catalog.recipes[item.name] ?? {};
  const baseRadius =
    item.cssVars.theme?.["--radius"] ??
    item.cssVars.light?.["--radius"] ??
    "0.45rem";
  const light = convertColorBlock(item.cssVars.light);
  const dark = convertColorBlock(item.cssVars.dark);

  return {
    id: item.name,
    slug: item.name.replace(/^theme-/, ""),
    title: item.title,
    description: item.description,
    recipe,
    radius: buildRadiusScale(baseRadius),
    light: {
      colors: light.colors,
      shadows: light.shadows,
    },
    dark: {
      colors: dark.colors,
      shadows: dark.shadows,
    },
  };
});

const tokensPayload = {
  $schema: "https://kira-kit.dev/schema/kmp-tokens.v1.json",
  meta: {
    source: "kira-kit-v2",
    exportedAt: new Date().toISOString(),
    colorSpace: "sRGB (converted from OKLCH)",
    dpPerRem: 16,
    themeCount: themes.length,
  },
  motion: {
    easeOutStrong: {
      css: "cubic-bezier(0.23, 1, 0.32, 1)",
      composeCubicBezier: [0.23, 1.0, 0.32, 1.0],
    },
    spring: {
      dampingRatio: 0.65,
      stiffnessHint: "MediumLow",
      overshootPercent: 7,
    },
    durationsMs: {
      routeFade: 150,
      routeTransition: 250,
      fadeIn: 300,
      shake: 400,
      pingOnce: 800,
      shimmer: 2000,
    },
  },
  radiusPresets: catalog.radiusPresets.map((preset) => ({
    name: preset.name,
    title: preset.title,
    description: preset.description,
    ...buildRadiusScale(preset.value),
  })),
  surfacePresets: catalog.surfacePresets,
  fonts: catalog.fonts,
  fontPresets: catalog.fontPresets,
  themes,
};

// Generate ready-to-drop-in Kotlin Compose Multiplatform theme file
const colorKeys = Object.keys(themes[0].light.colors);

function formatKtColorScheme(themeObj, mode) {
  const modeColors = themeObj[mode].colors;
  const lines = colorKeys.map((key) => {
    const prop = toCamelCase(key);
    const entry = modeColors[key];
    return `    ${prop} = Color(${entry.argb}L),`;
  });
  return `KiraColorScheme(\n${lines.join("\n")}\n)`;
}

const kotlinLines = [
  "// Generated from kira-kit-v2 (src/themes/registry.json & src/themes/catalog.json)",
  "// Drop into your KMP project's commonMain source set (e.g. com.kirakit.theme).",
  "package com.kirakit.theme",
  "",
  "import androidx.compose.foundation.isSystemInDarkTheme",
  "import androidx.compose.foundation.shape.RoundedCornerShape",
  "import androidx.compose.runtime.Composable",
  "import androidx.compose.runtime.CompositionLocalProvider",
  "import androidx.compose.runtime.Immutable",
  "import androidx.compose.runtime.staticCompositionLocalOf",
  "import androidx.compose.ui.graphics.Color",
  "import androidx.compose.ui.unit.Dp",
  "import androidx.compose.ui.unit.dp",
  "",
  "@Immutable",
  "data class KiraColorScheme(",
  ...colorKeys.map((key) => `    val ${toCamelCase(key)}: Color,`),
  ")",
  "",
  "@Immutable",
  "data class KiraRadiusScale(",
  "    val sm: Dp,",
  "    val md: Dp,",
  "    val lg: Dp,",
  "    val xl: Dp,",
  "    val xxl: Dp,",
  "    val xxxl: Dp,",
  "    val xxxxl: Dp,",
  ") {",
  "    val shapeSm get() = RoundedCornerShape(sm)",
  "    val shapeMd get() = RoundedCornerShape(md)",
  "    val shapeLg get() = RoundedCornerShape(lg)",
  "    val shapeXl get() = RoundedCornerShape(xl)",
  "}",
  "",
  "@Immutable",
  "data class KiraThemeDefinition(",
  "    val id: String,",
  "    val title: String,",
  "    val light: KiraColorScheme,",
  "    val dark: KiraColorScheme,",
  "    val radius: KiraRadiusScale,",
  ")",
  "",
  "object KiraThemes {",
];

for (const t of themes) {
  const constName = toPascalCase(t.slug);
  kotlinLines.push(`    val ${constName} = KiraThemeDefinition(`);
  kotlinLines.push(`        id = "${t.id}",`);
  kotlinLines.push(`        title = "${t.title}",`);
  kotlinLines.push(
    `        light = ${formatKtColorScheme(t, "light").replace(/\n/g, "\n        ")},`,
  );
  kotlinLines.push(
    `        dark = ${formatKtColorScheme(t, "dark").replace(/\n/g, "\n        ")},`,
  );
  kotlinLines.push(`        radius = KiraRadiusScale(`);
  kotlinLines.push(`            sm = ${t.radius.smDp}.dp,`);
  kotlinLines.push(`            md = ${t.radius.mdDp}.dp,`);
  kotlinLines.push(`            lg = ${t.radius.lgDp}.dp,`);
  kotlinLines.push(`            xl = ${t.radius.xlDp}.dp,`);
  kotlinLines.push(`            xxl = ${t.radius.xxlDp}.dp,`);
  kotlinLines.push(`            xxxl = ${t.radius.xxxlDp}.dp,`);
  kotlinLines.push(`            xxxxl = ${t.radius.xxxxlDp}.dp,`);
  kotlinLines.push(`        ),`);
  kotlinLines.push(`    )`);
  kotlinLines.push("");
}

kotlinLines.push(
  `    val All: List<KiraThemeDefinition> = listOf(${themes.map((t) => toPascalCase(t.slug)).join(", ")})`,
);
kotlinLines.push("}");
kotlinLines.push("");
kotlinLines.push(
  "val LocalKiraColors = staticCompositionLocalOf { KiraThemes.Default.light }",
);
kotlinLines.push(
  "val LocalKiraRadius = staticCompositionLocalOf { KiraThemes.Default.radius }",
);
kotlinLines.push("");
kotlinLines.push("object KiraTheme {");
kotlinLines.push("    val colors: KiraColorScheme");
kotlinLines.push("        @Composable get() = LocalKiraColors.current");
kotlinLines.push("");
kotlinLines.push("    val radius: KiraRadiusScale");
kotlinLines.push("        @Composable get() = LocalKiraRadius.current");
kotlinLines.push("}");
kotlinLines.push("");
kotlinLines.push("@Composable");
kotlinLines.push("fun KiraTheme(");
kotlinLines.push("    theme: KiraThemeDefinition = KiraThemes.Default,");
kotlinLines.push("    darkTheme: Boolean = isSystemInDarkTheme(),");
kotlinLines.push("    content: @Composable () -> Unit,");
kotlinLines.push(") {");
kotlinLines.push("    val colors = if (darkTheme) theme.dark else theme.light");
kotlinLines.push("    CompositionLocalProvider(");
kotlinLines.push("        LocalKiraColors provides colors,");
kotlinLines.push("        LocalKiraRadius provides theme.radius,");
kotlinLines.push("        content = content,");
kotlinLines.push("    )");
kotlinLines.push("}");
kotlinLines.push("");

const outDir = resolve(rootDir, "exports/kmp");
mkdirSync(outDir, { recursive: true });

const jsonPath = resolve(outDir, "kira-tokens.json");
const ktPath = resolve(outDir, "KiraTheme.kt");

writeFileSync(jsonPath, `${JSON.stringify(tokensPayload, null, 2)}\n`, "utf8");
writeFileSync(ktPath, kotlinLines.join("\n"), "utf8");

console.log(
  `Exported ${themes.length} themes (${colorKeys.length} semantic colors each):`,
);
console.log(`  - ${jsonPath}`);
console.log(`  - ${ktPath}`);
