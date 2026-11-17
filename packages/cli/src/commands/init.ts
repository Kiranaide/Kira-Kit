import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runShadcnChecked } from "../lib/shadcn";
import { readConfig, upsertKiraRegistry } from "../lib/config";
import { info, success } from "../lib/logger";
import { select, text, confirm } from "../lib/prompts";
import { generateTheme, ThemeContrastError } from "../core/theme/theme";
import type { BaseColorName } from "../core/theme/palette";
import type { InitOptions } from "../types";

function themeCssPath(cwd: string): string | null {
  const config = readConfig(cwd);
  const css = config?.tailwind?.css;

  if (css) return join(cwd, css);

  for (const candidate of [
    "src/index.css",
    "src/app/globals.css",
    "app/globals.css",
  ]) {
    const path = join(cwd, candidate);

    if (existsSync(path)) return path;
  }

  return null;
}

function themeExists(cwd: string): boolean {
  const cssPath = themeCssPath(cwd);

  if (!cssPath || !existsSync(cssPath)) return false;

  return readFileSync(cssPath, "utf-8").includes(":root");
}

async function applyCustomTheme(
  cwd: string,
  primary: string,
  baseColor: string | undefined,
  force: boolean,
): Promise<number> {
  let generated;

  try {
    // SAFETY: --base-color is an unvalidated CLI string, but generateTheme
    // re-checks it against BASE_COLOR_NAMES and falls back to "neutral".
    generated = generateTheme({
      name: "custom",
      title: "Custom Kira Kit theme",
      description: `Custom OKLCH theme generated from primary ${primary}.`,
      primary,
      baseColor: (baseColor as BaseColorName) ?? "neutral",
    });
  } catch (error) {
    if (error instanceof ThemeContrastError) {
      console.error(`error: ${error.message}`);

      return 1;
    }

    throw error;
  }

  const outPath = join(cwd, "kira-theme.json");
  writeFileSync(
    outPath,
    JSON.stringify(generated.item, null, 2) + "\n",
    "utf-8",
  );

  const args = ["add", outPath, "--yes"];

  if (force) args.push("--overwrite");
  const code = await runShadcnChecked([...args, "--cwd", cwd], cwd);

  if (code === 0) success("Custom theme applied.");

  return code;
}

async function ensureBaseConfig(cwd: string, yes: boolean): Promise<number> {
  if (readConfig(cwd)) return 0;

  info("No components.json found — delegating base setup to shadcn (Base UI)…");

  const args = ["init", "--base", "base"];

  if (yes) args.push("--yes");

  return runShadcnChecked([...args, "--cwd", cwd], cwd);
}

function registerRegistry(cwd: string): void {
  if (upsertKiraRegistry(cwd)) {
    success("Registered the @kira-kit registry in components.json.");
  } else {
    info("The @kira-kit registry is already registered.");
  }
}

async function applyPreset(cwd: string, options: InitOptions): Promise<number> {
  const args = ["add", `@kira-kit/theme-${options.preset}`, "--yes"];

  if (options.force) args.push("--overwrite");

  const code = await runShadcnChecked([...args, "--cwd", cwd], cwd);

  if (code === 0) success(`Theme preset "${options.preset}" applied.`);

  return code;
}

/** Interactive theme choice; null means "keep the current theme". */
async function interactiveTheme(
  cwd: string,
  options: InitOptions,
  hasTheme: boolean,
): Promise<number | null> {
  if (options.yes || !process.stdin.isTTY) return null;

  const ctx = { yes: options.yes };

  const choice = await select(
    ctx,
    "How should the theme be set up?",
    [
      { value: "keep", label: "Keep the current theme" },
      {
        value: "custom",
        label: "Generate a custom theme from a primary color",
      },
    ],
    "keep",
  );

  if (choice !== "custom") return null;

  const primary = await text(
    ctx,
    "Primary color (hex, e.g. #e2694a)",
    "#e2694a",
    (value) =>
      /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim())
        ? undefined
        : "Enter a hex color like #e2694a",
  );

  const force = hasTheme
    ? await confirm(ctx, "A theme already exists. Overwrite it?", true)
    : true;

  return applyCustomTheme(cwd, primary, options.baseColor, force);
}

export async function init(options: InitOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();
  const baseCode = await ensureBaseConfig(cwd, Boolean(options.yes));

  if (baseCode !== 0) return baseCode;

  registerRegistry(cwd);

  if (options.preset) return applyPreset(cwd, options);

  if (options.primary) {
    return applyCustomTheme(
      cwd,
      options.primary,
      options.baseColor,
      options.force,
    );
  }

  const hasTheme = themeExists(cwd);
  const interactiveCode = await interactiveTheme(cwd, options, hasTheme);

  if (interactiveCode !== null) return interactiveCode;

  if (hasTheme && !options.force) {
    info("A theme is already configured — leaving it untouched.");
    info(
      "To replace it: kira-kit init --preset <name> --force, or kira-kit theme --primary <color> --apply",
    );
  }

  success("Kira Kit initialized. Try: kira-kit add button");

  return 0;
}
