import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { runChecks, formatFindings } from "../core/checks/runner";
import { generatePresetItems } from "../core/theme/generate-presets";
import { loadSourceRegistry } from "../core/registry/loader";
import { docsOutputPaths, generateDocs } from "../core/docs/generate";
import type { SourceRegistryItem } from "../lib/schemas";
import { runShadcnChecked } from "../lib/shadcn";
import { info, success, warning } from "../lib/logger";
import { EXIT_CHECKS } from "../lib/errors";

/** Quality gate: errors block the build; warnings are advisory per §8. */
function qualityGate(repoRoot: string): number {
  const result = runChecks({ repoRoot, paths: [], ci: false });

  if (result.findings.length > 0) {
    console.log(formatFindings(result, "pretty"));
  }

  if (result.failing > 0) {
    warning(`Quality checks failed (${result.failing} error(s)).`);

    return EXIT_CHECKS;
  }

  success(
    `Quality checks passed (${result.filesChecked} files, ${result.findings.length} warning(s)).`,
  );

  return 0;
}

function writeThemePresets(repoRoot: string): void {
  const { items: themeItems, adjustments } = generatePresetItems();
  const themesPath = join(repoRoot, "src/themes/registry.json");

  mkdirSync(join(repoRoot, "src/themes"), { recursive: true });
  writeFileSync(
    themesPath,
    JSON.stringify({ items: themeItems }, null, 2) + "\n",
    "utf-8",
  );

  for (const adjustment of adjustments) {
    info(
      `theme ${adjustment.preset}: adjusted ${adjustment.token} lightness ${adjustment.fromL} → ${adjustment.toL} for contrast`,
    );
  }

  success(
    `Generated ${themeItems.length} theme presets into src/themes/registry.json.`,
  );
}

function pruneStaleOutputs(
  repoRoot: string,
  items: SourceRegistryItem[],
): void {
  const expected = new Set([
    ...items.map((item) => item.name),
    "registry",
    "index",
  ]);

  const outputDir = join(repoRoot, "public/r");

  if (!existsSync(outputDir)) return;

  for (const entry of readdirSync(outputDir)) {
    if (!entry.endsWith(".json")) continue;

    const base = entry.replace(/\.json$/, "");

    if (!expected.has(base)) {
      rmSync(join(outputDir, entry));
      info(`Pruned stale registry output: ${entry}`);
    }
  }
}

function writeDocs(repoRoot: string, items: SourceRegistryItem[]): void {
  const { llmsTxt, perItem } = generateDocs(items, { repoRoot });
  const paths = docsOutputPaths(repoRoot);

  mkdirSync(paths.docsDir, { recursive: true });
  writeFileSync(paths.llms, llmsTxt, "utf-8");

  for (const doc of perItem) {
    writeFileSync(join(paths.docsDir, `${doc.name}.md`), doc.content, "utf-8");
  }

  success(`Generated ${paths.llms} and ${perItem.length} per-item docs.`);
}

export async function buildRegistry(options: {
  cwd?: string;
  skipChecks?: boolean;
}): Promise<number> {
  const repoRoot =
    options.cwd && existsSync(join(options.cwd, "registry.json"))
      ? options.cwd
      : process.cwd();

  if (!options.skipChecks) {
    const gate = qualityGate(repoRoot);

    if (gate !== 0) return gate;
  }

  writeThemePresets(repoRoot);

  let code = await runShadcnChecked(
    ["registry", "validate", join(repoRoot, "registry.json")],
    repoRoot,
  );

  if (code !== 0) return code;
  success("shadcn registry validate passed.");

  code = await runShadcnChecked(
    [
      "build",
      join(repoRoot, "registry.json"),
      "--output",
      join(repoRoot, "public/r"),
    ],
    repoRoot,
  );

  if (code !== 0) return code;
  success("Built registry JSON into public/r/.");

  const { items } = loadSourceRegistry(repoRoot);

  pruneStaleOutputs(repoRoot, items);
  writeDocs(repoRoot, items);

  return 0;
}
