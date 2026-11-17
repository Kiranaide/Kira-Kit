import { runShadcnChecked } from "../lib/shadcn";

export async function listComponents(options: {
  json?: boolean;
}): Promise<number> {
  const args = ["list", "@kira-kit"];

  if (options.json) args.push("--json");

  return runShadcnChecked(args);
}
