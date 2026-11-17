import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runChecks, formatFindings } from "../core/checks/runner";
import { generatePresetItems } from "../core/theme/generate-presets";
import { loadSourceRegistry } from "../core/registry/loader";
import { docsOutputPaths, generateDocs } from "../core/docs/generate";
import { runShadcnChecked } from "../lib/shadcn";
import { info, success, warning } from "../lib/logger";
import { EXIT_CHECKS } from "../lib/errors";

export async function buildRegistry(options: {
  cwd?: string;
  skipChecks?: boolean;
}): Promise<number> {
  const repoRoot = options.cwd && existsSync(join(options.cwd, "registry.json"))
    ? options.cwd
    : process.cwd();

  // 1. Quality checks (errors block the build; warnings are advisory per §8)
  if (!options.skipChecks) {
    const result = runChecks({ repoRoot, paths: [], ci: false });
    if (result.findings.length > 0) {
      console.log(formatFindings(result, "pretty"));
    }
    if (result.failing > 0) {
      warning(
        `Quality checks failed (${result.failing} error(s)).`,
      );
      return EXIT_CHECKS;
    }
    success(
      `Quality checks passed (${result.filesChecked} files, ${result.findings.length} warning(s)).`,
    );
  }

  // 2. Regenerate theme presets into src/themes/registry.json
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
  success(`Generated ${themeItems.length} theme presets into src/themes/registry.json.`);

  // 3. Validate the source registry
  let code = await runShadcnChecked(["registry", "validate", join(repoRoot, "registry.json")], repoRoot);
  if (code !== 0) return code;
  success("shadcn registry validate passed.");

  // 4. Build registry JSON to public/r/
  code = await runShadcnChecked(
    ["build", join(repoRoot, "registry.json"), "--output", join(repoRoot, "public/r")],
    repoRoot,
  );
  if (code !== 0) return code;
  success("Built registry JSON into public/r/.");

  // 5. Prune stale public/r/*.json (check 2)
  const { items } = loadSourceRegistry(repoRoot);
  const expected = new Set([
    ...items.map((item) => item.name),
    "registry",
    "index",
  ]);
  const outputDir = join(repoRoot, "public/r");
  if (existsSync(outputDir)) {
    for (const entry of readdirSync(outputDir)) {
      if (!entry.endsWith(".json")) continue;
      const base = entry.replace(/\.json$/, "");
      if (!expected.has(base)) {
        rmSync(join(outputDir, entry));
        info(`Pruned stale registry output: ${entry}`);
      }
    }
  }

  // 6. Generate agent docs (llms.txt + per-item markdown)
  const { llmsTxt, perItem } = generateDocs(items, { repoRoot });
  const paths = docsOutputPaths(repoRoot);
  mkdirSync(paths.docsDir, { recursive: true });
  writeFileSync(paths.llms, llmsTxt, "utf-8");
  for (const doc of perItem) {
    writeFileSync(join(paths.docsDir, `${doc.name}.md`), doc.content, "utf-8");
  }
  success(`Generated ${paths.llms} and ${perItem.length} per-item docs.`);

  return 0;
}
