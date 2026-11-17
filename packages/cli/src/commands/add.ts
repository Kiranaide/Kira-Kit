import { runShadcnChecked } from "../lib/shadcn";
import { toItemAddress } from "../lib/namespace";
import { ValidationError, RegistryError } from "../lib/errors";
import { getRegistryUrl } from "../lib/config";
import type { AddOptions } from "../types";

/** Entry of the registry index (registry.json) — only the name is needed. */
interface RegistryIndexEntry {
  name: string;
}

/** Shape of the registry index payload fetched from the registry URL. */
interface RegistryIndex {
  items?: RegistryIndexEntry[];
}

async function fetchAllItemNames(cwd: string): Promise<string[]> {
  const registryUrl = getRegistryUrl(cwd);
  let response: Response;
  try {
    response = await fetch(`${registryUrl}/registry.json`);
  } catch {
    throw new RegistryError(
      `Could not reach the Kira Kit registry at ${registryUrl}`,
      "Check your internet connection and retry, or run 'kira-kit list' to see what's cached.",
    );
  }
  if (!response.ok) {
    throw new RegistryError(
      `Registry index request failed (HTTP ${response.status}) at ${registryUrl}/registry.json`,
      "Verify your components.json '@kira-kit' registry URL, then retry.",
    );
  }
  // SAFETY: registry.json is served by the Kira Kit registry, whose items
  // always carry a kebab-case name; a missing items array yields an empty list.
  const data = (await response.json()) as RegistryIndex;
  return (data.items ?? []).map((item) => item.name);
}

export async function addComponents(options: AddOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();
  const args: string[] = ["add"];

  if (options.yes) args.push("--yes");
  if (options.overwrite) args.push("--overwrite");
  if (options.path) args.push("--path", options.path);
  if (options.dryRun) args.push("--dry-run");
  if (options.diff) args.push("--diff");
  if (options.view) args.push("--view");

  let items = options.items ?? [];

  if (options.all) {
    if (items.length > 0) {
      throw new ValidationError(
        "--all cannot be combined with explicit item names.",
        "Pass either item names or --all, not both.",
      );
    }
    const names = await fetchAllItemNames(cwd);
    if (names.length === 0) {
      throw new RegistryError(
        "The registry index contains no items.",
        "Check the '@kira-kit' registry URL in components.json.",
      );
    }
    // One shadcn invocation for everything — no per-item prompts.
    items = names.map(toItemAddress);
  } else {
    if (items.length === 0) {
      throw new ValidationError(
        "No items specified.",
        "Use 'kira-kit add button' or 'kira-kit add --all'.",
      );
    }
    items = items.map(toItemAddress);
  }

  return runShadcnChecked([...args, "--cwd", cwd, ...items], cwd);
}
