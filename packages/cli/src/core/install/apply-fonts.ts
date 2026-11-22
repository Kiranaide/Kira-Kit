import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  readRawConfig,
  updateRawConfig,
  type RawComponentsConfig,
} from "../../lib/config";
import { success } from "../../lib/logger";
import {
  SERIF_FONTS,
  fontCatalog,
  resolveFontPreset,
  type FontKind,
  type FontSpec,
} from "../theme/fonts";
import type { CssVarsMap } from "../theme/theme";
import { mergeCssVarsText } from "./css-vars";
import { installNpmDeps, readConsumerPackage, type DepInstaller } from "./deps";

const CSS_CANDIDATES = [
  "src/index.css",
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/global.css",
  "src/styles/globals.css",
  "src/globals.css",
  "src/app.css",
];

const DISPLAY_HEADING_FAMILY =
  "font-family: var(--font-display, var(--font-sans));";

export function detectCssPath(cwd: string): string {
  const configured = readRawConfig(cwd)?.tailwind?.css;

  if (configured) return configured;

  for (const candidate of CSS_CANDIDATES) {
    if (existsSync(join(cwd, candidate))) return candidate;
  }

  return existsSync(join(cwd, "app")) ? "app/globals.css" : "src/index.css";
}

function importPattern(pkg: string): RegExp {
  return new RegExp(`@import\\s+["']${pkg}["'];?`);
}

function insertImportAfterImports(css: string, pkg: string): string {
  const eol = css.includes("\r\n") ? "\r\n" : "\n";
  const line = `@import "${pkg}";`;
  const imports = [...css.matchAll(/@import\s+[^;]+;/g)];

  if (imports.length === 0) return `${line}${eol}${css}`;

  const last = imports[imports.length - 1];
  const at = last.index + last[0].length;

  return `${css.slice(0, at)}${eol}${line}${css.slice(at)}`;
}

function applyFontSlot(
  css: string,
  kind: FontKind,
  font: FontSpec,
  protectedPackages: ReadonlySet<string>,
): string {
  if (importPattern(font.pkg).test(css)) return css;

  const catalog = kind === "display" ? SERIF_FONTS : fontCatalog(kind);

  for (const existing of Object.values(catalog)) {
    if (protectedPackages.has(existing.pkg)) continue;

    const pattern = importPattern(existing.pkg);

    if (pattern.test(css)) {
      return css.replace(pattern, `@import "${font.pkg}";`);
    }
  }

  return insertImportAfterImports(css, font.pkg);
}

function withDisplayHeadingRule(css: string): string {
  if (css.includes(DISPLAY_HEADING_FAMILY)) return css;

  const eol = css.includes("\r\n") ? "\r\n" : "\n";

  const headingRule = `\n\n@layer base {
  h1,
  h2,
  h3 {
    ${DISPLAY_HEADING_FAMILY}
    letter-spacing: var(--tracking-kira-heading, inherit);
  }
}
`;

  return css.trimEnd() + headingRule.replaceAll("\n", eol);
}

/**
 * Swap the sans/mono (and optional display) fontsource imports and upsert
 * --font-sans/--font-mono (and --font-display when provided).
 * Color tokens are never touched; non-catalog font imports are left alone.
 */
export function applyFontToCss(
  css: string,
  sans: FontSpec,
  mono: FontSpec,
  display?: FontSpec,
  headingTracking?: string,
): string {
  const previousDisplayStack = css
    .match(/--font-display\s*:\s*([^;]+);/)?.[1]
    .trim();

  const retainedDisplay = Object.values(fontCatalog("display")).find(
    (font) => font.stack === previousDisplayStack,
  );

  const activeDisplay = display ?? retainedDisplay;
  const protectedPackages = new Set([sans.pkg, mono.pkg]);

  if (activeDisplay) protectedPackages.add(activeDisplay.pkg);

  let swapped = applyFontSlot(css, "sans", sans, protectedPackages);
  swapped = applyFontSlot(swapped, "mono", mono, protectedPackages);

  if (activeDisplay && activeDisplay.pkg !== sans.pkg) {
    swapped = applyFontSlot(
      swapped,
      "display",
      activeDisplay,
      protectedPackages,
    );
  }

  const themeVars: CssVarsMap = {
    "--font-sans": sans.stack,
    "--font-mono": mono.stack,
  };

  if (display) {
    themeVars["--font-display"] = display.stack;
  }

  if (headingTracking) {
    themeVars["--tracking-kira-heading"] = headingTracking;
  }

  if (display || headingTracking) swapped = withDisplayHeadingRule(swapped);

  return mergeCssVarsText(swapped, { theme: themeVars });
}

export interface ApplyFontsOptions {
  yes?: boolean;
  installer?: DepInstaller;
  display?: FontSpec;
  fontPreset?: string;
}

function formatFontSummary(
  sans: FontSpec,
  mono: FontSpec,
  display?: FontSpec,
): string {
  if (display && display.name !== sans.name) {
    return `${display.name} / ${sans.name} + ${mono.name}`;
  }

  return `${sans.name} + ${mono.name}`;
}

function recordFontConfig(
  cwd: string,
  sans: FontSpec,
  mono: FontSpec,
  options: ApplyFontsOptions,
): void {
  if (!readRawConfig(cwd)) return;

  const patch: Partial<RawComponentsConfig> = {
    font: sans.name,
    fontMono: mono.name,
  };

  if (options.display) patch.fontDisplay = options.display.name;

  if (options.fontPreset) patch.fontPreset = options.fontPreset;

  updateRawConfig(cwd, patch);
}

function missingFontPackages(
  cwd: string,
  sans: FontSpec,
  mono: FontSpec,
  display?: FontSpec,
): string[] {
  const pkg = readConsumerPackage(cwd);

  const present = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);

  const wanted = [sans.pkg, mono.pkg];

  if (display && display.name !== sans.name) {
    wanted.push(display.pkg);
  }

  return [...new Set(wanted)].filter((name) => !present.has(name));
}

/** Apply fonts to an existing project: CSS, components.json, missing packages. */
export async function applyFonts(
  cwd: string,
  sans: FontSpec,
  mono: FontSpec,
  options: ApplyFontsOptions = {},
): Promise<void> {
  const cssRel = detectCssPath(cwd);
  const cssPath = join(cwd, cssRel);

  if (existsSync(cssPath)) {
    const css = readFileSync(cssPath, "utf-8");

    const tracking = options.fontPreset
      ? resolveFontPreset(options.fontPreset).headingTracking
      : undefined;

    const next = applyFontToCss(css, sans, mono, options.display, tracking);

    if (next !== css) {
      writeFileSync(cssPath, next, "utf-8");
      const summary = formatFontSummary(sans, mono, options.display);

      success(`Fonts applied to ${cssRel} (${summary}).`);
    }
  }

  recordFontConfig(cwd, sans, mono, options);

  const missing = missingFontPackages(cwd, sans, mono, options.display);

  await installNpmDeps(cwd, missing, { yes: options.yes }, options.installer);
}
