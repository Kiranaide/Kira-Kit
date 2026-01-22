import { fetchRegistryIndex } from "../lib/registry";
import { table } from "../lib/logger";
import { info, error } from "../lib/logger";

export async function listComponents(): Promise<void> {
  try {
    info("Fetching registry index...");

    const index = await fetchRegistryIndex();

    console.log(`\n📦 Kira Kit Components (${index.components.length} total)\n`);

    const rows = [
      ["Name", "Title", "Dependencies", "Registry Deps"],
      ...index.components.map((c) => [
        c.name,
        c.title,
        c.dependencies.length.toString(),
        c.registryDependencies.length.toString(),
      ]),
    ];

    table(rows);

    console.log("\n");
    info("Use 'kira-kit add <component>' to install a component.");
  } catch (err) {
    error("Failed to fetch registry index. Make sure you're connected to the internet.");
    console.error(err);
  }
}
