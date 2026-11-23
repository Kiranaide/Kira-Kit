import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { themePayload, type GeneratedTheme } from "../core/theme/theme";
import {
  applyStandaloneTokens,
  buildCustomTheme,
  persistThemeConfig,
  resolveThemeSelection,
  type ResolvedThemeSelection,
} from "../core/theme/apply";
import { installItems } from "../core/install/engine";
import { applyFonts } from "../core/install/apply-fonts";
import { applyIconLibrary } from "../core/install/icons";
import { ValidationError } from "../lib/errors";
import { info, success } from "../lib/logger";
import type { ThemeOptions } from "../types";

async function applyTypography(
  cwd: string,
  selection: ResolvedThemeSelection,
  installer: ThemeOptions["installer"],
): Promise<void> {
  if (selection.hasFonts) {
    await applyFonts(cwd, selection.sans, selection.mono, {
      yes: true,
      installer,
      display: selection.display,
      fontPreset: selection.fontPreset,
    });
  }

  if (selection.hasIcon) {
    await applyIconLibrary(cwd, selection.iconLibrary, {
      yes: true,
      installer,
    });
  }
}

function reportContrast(generated: GeneratedTheme): void {
  for (const adjustment of generated.adjustments) {
    info(
      `adjusted ${adjustment.scheme}.${adjustment.token} lightness ${adjustment.fromL} → ${adjustment.toL} for contrast`,
    );
  }

  const weakest = [...generated.apca].sort((a, b) => a.lc - b.lc)[0];

  if (weakest) {
    info(
      `APCA (informational): weakest text pair ${weakest.pair} at Lc ${weakest.lc.toFixed(1)}`,
    );
  }
}

async function applyPrimaryTheme(
  cwd: string,
  primary: string,
  options: ThemeOptions,
  selection: ResolvedThemeSelection,
): Promise<number> {
  const generated = buildCustomTheme(primary, selection);

  if (!generated) return 1;

  reportContrast(generated);

  const outPath = options.out
    ? join(cwd, options.out)
    : join(cwd, "kira-theme.json");

  writeFileSync(
    outPath,
    JSON.stringify(generated.item, null, 2) + "\n",
    "utf-8",
  );
  success(`Wrote theme registry item to ${outPath}`);

  if (!options.apply) {
    info(`Apply it with: kira-kit theme --primary ${primary} --apply`);

    return 0;
  }

  await installItems(
    { items: [themePayload(generated.item)] },
    { cwd, yes: true, overwrite: true, skipDeps: true },
  );
  persistThemeConfig(cwd, selection, "neutral");
  await applyTypography(cwd, selection, options.installer);
  success("Theme applied.");

  return 0;
}

function hasAnyThemeOption(options: ThemeOptions): boolean {
  const flags = [
    options.primary,
    options.baseColor,
    options.fontPreset,
    options.font,
    options.fontDisplay,
    options.fontMono,
    options.radius,
    options.surface,
    options.icon,
  ];

  return flags.some(Boolean);
}

function formatDryRunSummary(selection: ResolvedThemeSelection): string {
  const parts: string[] = [];

  if (selection.baseColor) parts.push(`base=${selection.baseColor}`);

  if (selection.radius) parts.push(`radius=${selection.radius.name}`);

  if (selection.surface) parts.push(`surface=${selection.surface.name}`);

  if (selection.display) parts.push(`display=${selection.display.name}`);

  parts.push(
    `sans=${selection.sans.name}`,
    `mono=${selection.mono.name}`,
    `icons=${selection.iconLibrary}`,
  );

  return parts.join(", ");
}

export async function theme(options: ThemeOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();

  if (!hasAnyThemeOption(options)) {
    throw new ValidationError(
      "Nothing to generate or apply.",
      "Pass --primary <color>, --base-color <name>, --font-preset <name>, --font <name>, --font-display <name>, --font-mono <name>, --radius <preset>, --surface <preset>, or --icon <library>.",
    );
  }

  const selection = resolveThemeSelection(cwd, options);

  if (options.primary) {
    return applyPrimaryTheme(cwd, options.primary, options, selection);
  }

  if (!options.apply) {
    info(`Would apply: ${formatDryRunSummary(selection)}.`);
    info("Re-run with --apply to write the CSS, config, and packages.");

    return 0;
  }

  if (selection.hasTokens) {
    applyStandaloneTokens(cwd, selection);
    persistThemeConfig(cwd, selection);
  }

  await applyTypography(cwd, selection, options.installer);
  success("Theme options applied.");

  return 0;
}
