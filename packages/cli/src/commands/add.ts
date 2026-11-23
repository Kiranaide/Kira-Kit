import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { createTwoFilesPatch } from "diff";
import pc from "picocolors";
import { createClientContext, fetchIndex } from "../core/install/client";
import { installItems, planInstall } from "../core/install/engine";
import type { PlannedWrite } from "../core/install/write";
import { toItemAddress } from "../lib/namespace";
import { ValidationError, RegistryError } from "../lib/errors";
import { success } from "../lib/logger";
import type { AddOptions } from "../types";

/** --all installs components, hooks, and lib modules — not themes/styles. */
const INSTALLABLE_TYPES = new Set([
  "registry:ui",
  "registry:hook",
  "registry:lib",
]);

async function allItemAddresses(cwd: string): Promise<string[]> {
  const entries = await fetchIndex(createClientContext(cwd));

  const names = entries
    .filter((entry) => entry.type && INSTALLABLE_TYPES.has(entry.type))
    .map((entry) => entry.name);

  if (names.length === 0) {
    throw new RegistryError(
      "The registry index contains no installable items.",
      "Check the '@kira-kit' registry URL in components.json.",
    );
  }

  return names.map(toItemAddress);
}

async function resolveItems(
  options: AddOptions,
  cwd: string,
): Promise<string[]> {
  const items = options.items ?? [];

  if (!options.all) {
    if (items.length === 0) {
      throw new ValidationError(
        "No items specified.",
        "Use 'kira-kit add button' or 'kira-kit add --all'.",
      );
    }

    return items.map(toItemAddress);
  }

  if (items.length > 0) {
    throw new ValidationError(
      "--all cannot be combined with explicit item names.",
      "Pass either item names or --all, not both.",
    );
  }

  return allItemAddresses(cwd);
}

function printView(planned: PlannedWrite[], cwd: string): void {
  for (const write of planned) {
    console.log(pc.bold(`\n--- ${relative(cwd, write.target)} ---`));
    console.log(write.content);
  }
}

function printDiff(planned: PlannedWrite[], cwd: string): void {
  for (const write of planned) {
    if (write.identical) continue;

    const before = write.exists ? readFileSync(write.target, "utf-8") : "";

    const name = relative(cwd, write.target);
    const patch = createTwoFilesPatch(name, name, before, write.content);

    console.log(patch);
  }
}

async function preview(
  addresses: string[],
  options: AddOptions,
  cwd: string,
): Promise<number> {
  const { planned } = await planInstall(
    { addresses },
    { cwd, path: options.path },
  );

  if (options.view) {
    printView(planned, cwd);
  } else {
    printDiff(planned, cwd);
  }

  return 0;
}

export async function addComponents(options: AddOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();
  const addresses = await resolveItems(options, cwd);

  if (options.view || options.diff) {
    return preview(addresses, options, cwd);
  }

  const result = await installItems(
    { addresses },
    {
      cwd,
      yes: options.yes,
      overwrite: options.overwrite,
      dryRun: options.dryRun,
      path: options.path,
    },
  );

  const cssNote =
    result.cssVarsApplied || result.cssRulesApplied
      ? " Global stylesheet updated."
      : "";

  success(
    `Added ${result.items.length} item(s): ${result.written.length} file(s) written, ${result.skipped.length} skipped.${cssNote}`,
  );

  return 0;
}
