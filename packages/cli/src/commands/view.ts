import pc from "picocolors";
import { createClientContext, fetchItem } from "../core/install/client";
import { toItemAddress } from "../lib/namespace";
import { ValidationError } from "../lib/errors";
import type { RegistryItemPayload } from "../lib/schemas";

function printItem(item: RegistryItemPayload): void {
  console.log(pc.bold(`\n${item.title ?? item.name} (${item.name})`));

  if (item.description) console.log(item.description);

  if (item.dependencies?.length) {
    console.log(pc.dim(`npm dependencies: ${item.dependencies.join(", ")}`));
  }

  for (const file of item.files ?? []) {
    console.log(pc.dim(`\n--- ${file.path} ---`));
    console.log(file.content);
  }
}

export async function viewItems(options: {
  items: string[];
  cwd?: string;
}): Promise<number> {
  if (options.items.length === 0) {
    throw new ValidationError(
      "No items specified.",
      "Use 'kira-kit view button' to inspect an item before installing.",
    );
  }

  const ctx = createClientContext(options.cwd);

  for (const address of options.items.map(toItemAddress)) {
    printItem(await fetchItem(address, ctx));
  }

  return 0;
}
