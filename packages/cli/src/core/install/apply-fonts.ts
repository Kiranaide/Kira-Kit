import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readRawConfig, updateRawConfig } from "../../lib/config";
import { success } from "../../lib/logger";
import { fontCatalog, type FontKind, type FontSpec } from "../theme/fonts";
import { mergeCssVarsText } from "./css-vars";
import { installNpmDeps, readConsumerPackage, type DepInstaller } from "./deps";

const CSS_CANDIDATES = [
  "src/index.css",
  "src/app/globals.css",
  "app/globals.css",
];

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

function applyFontSlot(css: string, kind: FontKind, font: FontSpec): string {
  if (importPattern(font.pkg).test(css)) return css;

  for (const existing of Object.values(fontCatalog(kind))) {
    const pattern = importPattern(existing.pkg);

    if (pattern.test(css)) {
      return css.replace(pattern, `@import "${font.pkg}";`);
    }
  }

  const eol = css.includes("\r\n") ? "\r\n" : "\n";
  const line = `@import "${font.pkg}";`;
  const imports = [...css.matchAll(/@import\s+[^;]+;/g)];

  if (imports.length === 0) return `${line}${eol}${css}`;

  const last = imports[imports.length - 1];
  const at = last.index + last[0].length;

  return `${css.slice(0, at)}${eol}${line}${css.slice(at)}`;
}

/**
 * Swap the sans/mono fontsource imports and upsert --font-sans/--font-mono.
 * Color tokens are never touched; non-catalog font imports are left alone.
 */
export function applyFontToCss(
  css: string,
  sans: FontSpec,
  mono: FontSpec,
): string {
  const swapped = applyFontSlot(applyFontSlot(css, "sans", sans), "mono", mono);

  return mergeCssVarsText(swapped, {
    theme: { "--font-sans": sans.stack, "--font-mono": mono.stack },
  });
}

export interface ApplyFontsOptions {
  yes?: boolean;
  installer?: DepInstaller;
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
    const next = applyFontToCss(css, sans, mono);

    if (next !== css) {
      writeFileSync(cssPath, next, "utf-8");
      success(`Fonts applied to ${cssRel} (${sans.name} + ${mono.name}).`);
    }
  }

  if (readRawConfig(cwd)) {
    updateRawConfig(cwd, { font: sans.name, fontMono: mono.name });
  }

  const pkg = readConsumerPackage(cwd);

  const present = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);

  const missing = [sans.pkg, mono.pkg].filter((name) => !present.has(name));

  await installNpmDeps(cwd, missing, { yes: options.yes }, options.installer);
}
