import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { runChecks, formatFindings } from "../core/checks/runner";
import {
  generatePresetItems,
  generateThemeCatalog,
} from "../core/theme/generate-presets";
import { verifyCssScheme } from "../core/theme/contrast";
import { loadSourceRegistry } from "../core/registry/loader";
import { buildPayloads, writeRegistryOutputs } from "../core/registry/build";
import { defaultThemeItem } from "../core/css/stylesheet";
import { syncEmbeddedAssets } from "../core/css/assets-sync";
import { validateRegistry } from "../core/registry/validate";
import { docsOutputPaths, generateDocs } from "../core/docs/generate";
import type { RegistryItemPayload, SourceRegistryItem } from "../lib/schemas";
import { info, success, warning } from "../lib/logger";
import { EXIT_CHECKS, EXIT_USER } from "../lib/errors";

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

function writeThemePresets(
  repoRoot: string,
  defaultTheme: SourceRegistryItem,
): void {
  const { items: themeItems, adjustments } = generatePresetItems();
  const themesPath = join(repoRoot, "src/themes/registry.json");

  mkdirSync(join(repoRoot, "src/themes"), { recursive: true });
  writeFileSync(
    themesPath,
    JSON.stringify({ items: [defaultTheme, ...themeItems] }, null, 2) + "\n",
    "utf-8",
  );
  writeFileSync(
    join(repoRoot, "src/themes/catalog.json"),
    JSON.stringify(generateThemeCatalog(), null, 2) + "\n",
    "utf-8",
  );

  for (const adjustment of adjustments) {
    info(
      `theme ${adjustment.preset}: adjusted ${adjustment.token} lightness ${adjustment.fromL} → ${adjustment.toL} for contrast`,
    );
  }

  success(
    `Generated ${themeItems.length + 1} themes (incl. theme-default) into src/themes/registry.json.`,
  );
}

function defaultThemeContrastPasses(theme: SourceRegistryItem): boolean {
  const failures = (["light", "dark"] as const).flatMap((scheme) =>
    verifyCssScheme(scheme, theme.cssVars?.[scheme] ?? {}),
  );

  for (const { scheme, fg, bg, ratio, threshold } of failures) {
    warning(
      `theme-default ${scheme} ${fg} on ${bg}: ${ratio.toFixed(2)}:1 (needs ${threshold}:1). Edit src/index.css.`,
    );
  }

  return failures.length === 0;
}

function pruneStaleOutputs(repoRoot: string, names: string[]): void {
  const expected = new Set([...names, "registry"]);
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

/** Doc metadata for build-emitted style items (no source registry entry). */
function styleDocItem(payload: RegistryItemPayload): SourceRegistryItem {
  return {
    name: payload.name,
    type: "registry:style",
    title: payload.title ?? payload.name,
    description: payload.description ?? payload.name,
  };
}

function writeDocs(repoRoot: string, items: SourceRegistryItem[]): void {
  const { llmsTxt, perItem } = generateDocs(items, { repoRoot });
  const paths = docsOutputPaths(repoRoot);

  mkdirSync(paths.docsDir, { recursive: true });
  writeFileSync(paths.llms, llmsTxt, "utf-8");

  for (const doc of perItem) {
    const docPath = join(paths.docsDir, `${doc.name}.md`);

    mkdirSync(dirname(docPath), { recursive: true });
    writeFileSync(docPath, doc.content, "utf-8");
  }

  success(`Generated ${paths.llms} and ${perItem.length} per-item docs.`);
}

export function buildRegistry(options: {
  cwd?: string;
  skipChecks?: boolean;
}): number {
  const repoRoot =
    options.cwd && existsSync(join(options.cwd, "registry.json"))
      ? options.cwd
      : process.cwd();

  if (!options.skipChecks) {
    const gate = qualityGate(repoRoot);

    if (gate !== 0) return gate;
  }

  const indexCss = readFileSync(join(repoRoot, "src/index.css"), "utf-8");
  const defaultTheme = defaultThemeItem(indexCss);

  if (!defaultThemeContrastPasses(defaultTheme)) return EXIT_CHECKS;

  writeThemePresets(repoRoot, defaultTheme);

  const loaded = loadSourceRegistry(repoRoot);
  const issues = validateRegistry(repoRoot, loaded);

  if (issues.length > 0) {
    for (const issue of issues) {
      warning(`${issue.item}: ${issue.message}`);
    }

    warning(`Registry validation failed (${issues.length} issue(s)).`);

    return EXIT_USER;
  }

  success(`Registry validation passed (${loaded.items.length} items).`);

  const payloads = buildPayloads(repoRoot, loaded);

  writeRegistryOutputs(
    repoRoot,
    join(repoRoot, "public/r"),
    loaded.root,
    payloads,
  );
  success("Built registry JSON into public/r/.");

  pruneStaleOutputs(
    repoRoot,
    payloads.map((payload) => payload.name),
  );

  const kiraBase = payloads.find((payload) => payload.name === "kira-base");

  writeDocs(
    repoRoot,
    kiraBase ? [...loaded.items, styleDocItem(kiraBase)] : loaded.items,
  );

  const synced = syncEmbeddedAssets(repoRoot);

  if (synced.assetsWritten) {
    success(
      `Synced embedded CLI CSS assets and ${synced.templatesSynced} template(s).`,
    );
  }

  return 0;
}
