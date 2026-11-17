import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateTheme, ThemeContrastError } from "../core/theme/theme";
import type { BaseColorName } from "../core/theme/palette";
import { runShadcnChecked } from "../lib/shadcn";
import { ValidationError } from "../lib/errors";
import { info, success, warning } from "../lib/logger";
import type { ThemeOptions } from "../types";

export async function theme(options: ThemeOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();

  if (!options.primary) {
    throw new ValidationError(
      "No primary color provided.",
      "Pass one, e.g. kira-kit theme --primary #e2694a --base-color stone, or use a preset via 'kira-kit add @kira-kit/theme-<name>'.",
    );
  }

  const name = "custom";
  let generated;
  try {
    // SAFETY: --base-color is an unvalidated CLI string, but generateTheme
    // re-checks it against BASE_COLOR_NAMES and falls back to "neutral".
    generated = generateTheme({
      name,
      title: "Custom Kira Kit theme",
      description: `Custom OKLCH theme generated from primary ${options.primary}.`,
      primary: options.primary,
      baseColor: (options.baseColor as BaseColorName) ?? "neutral",
    });
  } catch (error) {
    if (error instanceof ThemeContrastError) {
      console.error(`error: ${error.message}`);
      return 1;
    }
    throw error;
  }

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

  const outPath = options.out
    ? join(cwd, options.out)
    : join(cwd, "kira-theme.json");
  writeFileSync(outPath, JSON.stringify(generated.item, null, 2) + "\n", "utf-8");
  success(`Wrote theme registry item to ${outPath}`);

  if (options.apply) {
    const code = await runShadcnChecked(
      ["add", outPath, "--yes", "--overwrite", "--cwd", cwd],
      cwd,
    );
    if (code === 0) {
      success("Theme applied.");
    } else {
      warning("shadcn could not apply the theme automatically.");
      info(`Apply it manually: shadcn add ${outPath}`);
    }
    return code;
  }

  info(`Apply it with: kira-kit theme --primary ${options.primary} --apply`);
  return 0;
}
