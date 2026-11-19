import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  generateTheme,
  themePayload,
  ThemeContrastError,
  type GeneratedTheme,
} from "../core/theme/theme";
import type { BaseColorName } from "../core/theme/palette";
import {
  DEFAULT_MONO,
  DEFAULT_SANS,
  resolveFont,
  type FontSpec,
} from "../core/theme/fonts";
import { installItems } from "../core/install/engine";
import { applyFonts } from "../core/install/apply-fonts";
import { applyIconLibrary, resolveIconLibrary } from "../core/install/icons";
import { readRawConfig } from "../lib/config";
import { ValidationError } from "../lib/errors";
import { info, success } from "../lib/logger";
import type { ThemeOptions } from "../types";

interface TypographySelection {
  sans: FontSpec;
  mono: FontSpec;
  iconLibrary: string;
  hasFonts: boolean;
  hasIcon: boolean;
}

function resolveSelection(
  cwd: string,
  options: ThemeOptions,
): TypographySelection {
  const raw = readRawConfig(cwd);

  return {
    sans: resolveFont("sans", options.font ?? raw?.font ?? DEFAULT_SANS),
    mono: resolveFont(
      "mono",
      options.fontMono ?? raw?.fontMono ?? DEFAULT_MONO,
    ),
    iconLibrary: resolveIconLibrary(options.icon ?? raw?.iconLibrary),
    hasFonts: Boolean(options.font || options.fontMono),
    hasIcon: Boolean(options.icon),
  };
}

async function applyTypography(
  cwd: string,
  selection: TypographySelection,
  installer: ThemeOptions["installer"],
): Promise<void> {
  if (selection.hasFonts) {
    await applyFonts(cwd, selection.sans, selection.mono, {
      yes: true,
      installer,
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
  selection: TypographySelection,
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
      baseColor: (options.baseColor as BaseColorName) ?? "neutral",
    });
  } catch (error) {
    if (error instanceof ThemeContrastError) {
      console.error(`error: ${error.message}`);

      return 1;
    }

    throw error;
  }

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

  if (options.apply) {
    await installItems(
      { items: [themePayload(generated.item)] },
      { cwd, yes: true, overwrite: true, skipDeps: true },
    );
    await applyTypography(cwd, selection, options.installer);
    success("Theme applied.");

    return 0;
  }

  info(`Apply it with: kira-kit theme --primary ${primary} --apply`);

  return 0;
}

export async function theme(options: ThemeOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();

  if (!options.primary && !options.font && !options.fontMono && !options.icon) {
    throw new ValidationError(
      "Nothing to generate or apply.",
      "Pass --primary <color>, --font <name>, --font-mono <name>, or --icon <library>.",
    );
  }

  const selection = resolveSelection(cwd, options);

  if (!options.primary) {
    if (!options.apply) {
      info(
        `Would apply: sans=${selection.sans.name}, mono=${selection.mono.name}, icons=${selection.iconLibrary}.`,
      );
      info("Re-run with --apply to write the CSS, config, and packages.");

      return 0;
    }

    await applyTypography(cwd, selection, options.installer);
    success("Theme options applied.");

    return 0;
  }

  return applyPrimaryTheme(cwd, options.primary, options, selection);
}
