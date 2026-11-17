import { runShadcnChecked } from "../lib/shadcn";
import { toItemAddress } from "../lib/namespace";
import { ValidationError } from "../lib/errors";

export async function viewItems(options: {
  items: string[];
}): Promise<number> {
  if (options.items.length === 0) {
    throw new ValidationError(
      "No items specified.",
      "Use 'kira-kit view button' to inspect an item before installing.",
    );
  }
  const items = options.items.map(toItemAddress);
  return runShadcnChecked(["view", ...items]);
}
