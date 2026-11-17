import { runShadcnChecked } from "../lib/shadcn";

export async function searchItems(options: {
  query: string[];
  json?: boolean;
}): Promise<number> {
  const args = ["search", "@kira-kit"];

  if (options.query.length > 0) {
    args.push("--query", options.query.join(" "));
  }

  if (options.json) args.push("--json");

  return runShadcnChecked(args);
}
