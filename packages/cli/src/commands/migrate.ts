import { info, success, warning } from "../lib/logger";
import {
  runMigration,
  type DivergentComponent,
  type ImportRewrite,
  type MigrationFacts,
} from "../core/migrate/engine";
import type { MigrateOptions } from "../types";

function printDryRun(facts: MigrationFacts, cnRewrites: ImportRewrite[]): void {
  console.log("Dry run — no files will be modified:\n");

  if (facts.hadLegacyRegistryUrl) {
    console.log(
      `  components.json: remove "registryUrl" (legacy), add "registries['@kira-kit']"`,
    );
  } else if (facts.alreadyHasNamespace) {
    console.log("  components.json: already up to date");
  } else {
    console.log(`  components.json: add "registries['@kira-kit']"`);
  }

  if (facts.legacyAlias) {
    console.log(`  components.json: update aliases.lib to "@/lib"`);
  }

  if (facts.legacySchema) {
    console.log(
      `  components.json: replace the legacy $schema/style with kira values`,
    );
  }

  console.log(`  rewrite cn imports and calls to the \`cn\` npm package`);

  for (const rewrite of cnRewrites) {
    console.log(`  ${rewrite.file}: "${rewrite.from}" → "${rewrite.to}"`);
  }

  console.log("\nApply with `kira-kit migrate` (no --dry-run).");
}

function printDivergence(divergent: DivergentComponent[]): void {
  if (divergent.length === 0) {
    success("All local components match the registry");

    return;
  }

  warning(
    `${divergent.length} component${divergent.length === 1 ? "" : "s"} differ from the registry:`,
  );

  for (const item of divergent) {
    console.log(
      `  ${item.name} (${item.changedFiles} file${item.changedFiles === 1 ? "" : "s"})`,
    );
  }

  console.log("\nReview and update individually with:");
  console.log(
    `  kira-kit add <name> --diff   # e.g. kira-kit add ${divergent[0].name} --diff`,
  );
}

export async function migrateProject(options: MigrateOptions): Promise<number> {
  const outcome = await runMigration(options);

  if (options.dryRun) {
    printDryRun(outcome.plan.facts, outcome.plan.cnRewrites);

    return 0;
  }

  if (outcome.configUpdated) {
    success("components.json updated (@kira-kit registry namespace)");
  } else {
    info("components.json already has the @kira-kit registry (nothing to do)");
  }

  if (outcome.rewrittenFiles > 0) {
    success(
      `Rewrote ${outcome.rewrittenFiles} file${outcome.rewrittenFiles === 1 ? "" : "s"} to the cn package`,
    );
  } else {
    info("No legacy cn imports found");
  }

  if (!options.yes) {
    printDivergence(outcome.divergent);
  }

  return 0;
}
