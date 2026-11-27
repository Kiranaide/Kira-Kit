import pc from "picocolors";
import { createClientContext, fetchIndex } from "../core/install/client";
import { success } from "../lib/logger";
import type { RegistryIndexEntry } from "../lib/schemas";

function matches(entry: RegistryIndexEntry, query: string): boolean {
  if (!query) return true;

  const haystack = [entry.name, entry.title, entry.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export async function searchItems(options: {
  query: string[];
  json?: boolean;
  cwd?: string;
}): Promise<number> {
  const entries = await fetchIndex(createClientContext(options.cwd));

  const query = options.query.join(" ");
  const hits = entries.filter((entry) => matches(entry, query));

  if (options.json) {
    console.log(JSON.stringify(hits, null, 2));

    return 0;
  }

  for (const entry of hits) {
    console.log(
      `${pc.bold(entry.name.padEnd(28))} ${entry.description ?? entry.title ?? ""}`,
    );
  }

  success(`${hits.length} match(es) for "${query || "(all items)"}".`);

  return 0;
}
