import pc from "picocolors";
import { createClientContext, fetchIndex } from "../core/install/client";
import { success } from "../lib/logger";

export async function listComponents(options: {
  json?: boolean;
  cwd?: string;
}): Promise<number> {
  const entries = await fetchIndex(createClientContext(options.cwd));

  if (options.json) {
    console.log(JSON.stringify(entries, null, 2));

    return 0;
  }

  for (const entry of entries) {
    const name = pc.bold(entry.name.padEnd(28));
    const type = pc.dim((entry.type ?? "registry:ui").replace("registry:", ""));
    const description = entry.description ?? entry.title ?? "";

    console.log(`${name} ${type.padEnd(10)} ${description}`);
  }

  success(
    `${entries.length} item(s) available. Add one with: kira-kit add <name>`,
  );

  return 0;
}
