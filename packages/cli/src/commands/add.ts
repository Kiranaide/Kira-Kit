import { fetchRegistryItem, fetchRegistryIndex } from "../lib/registry";
import { fileExists, writeFile, ensureDir } from "../lib/file";
import { installDependencies, parseDependencies } from "../lib/deps";
import { getAliases, readConfig } from "../lib/config";
import { info, success, error, warning, spinner } from "../lib/logger";
import { existsSync } from "fs";
import { join, dirname } from "path";
import type { AddOptions } from "../types";

export async function addComponents(options: AddOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();

  const config = readConfig(cwd);

  if (!config) {
    error("No components.json found. Run 'kira-kit init' first.");

    return;
  }

  const aliases = getAliases(cwd);

  const componentsDir = join(
    cwd,
    aliases.components.replace("@/", "src/"),
    "ui",
  );

  const hooksDir = join(cwd, aliases.hooks.replace("@/", "src/"));

  if (options.all) {
    await addAllComponents(componentsDir, hooksDir, cwd, options);

    return;
  }

  const components = options.components;

  if (components.length === 0) {
    error(
      "No components specified. Use 'kira-kit add button' or 'kira-kit add --all'",
    );

    return;
  }

  const allDependencies: string[] = [];
  const installedComponents: string[] = [];

  for (const componentName of components) {
    info(`Fetching ${componentName}...`);

    const registryItem = await fetchRegistryItem(componentName);

    if (!registryItem) {
      error(`Component '${componentName}' not found in registry.`);
      continue;
    }

    const spin = spinner(`Installing ${componentName}`);
    spin.start();

    let needsOverwrite = false;

    for (const file of registryItem.files) {
      const filePath = join(
        file.path.startsWith("ui/") ? componentsDir : hooksDir,
        file.path
          .replace("ui/", "")
          .replace("hooks/", "")
          .replace("hooks/", ""),
      );

      if (fileExists(filePath) && !options.overwrite) {
        needsOverwrite = true;
        continue;
      }

      ensureDir(dirname(filePath));
      await writeFile(filePath, file.content);
    }

    const deps = await parseDependencies(
      registryItem.files.map((f) => f.content).join("\n"),
    );

    allDependencies.push(...deps);

    spin.stop(`Installed ${componentName}`);
    installedComponents.push(componentName);

    if (needsOverwrite && !options.overwrite) {
      warning(`Some files already exist. Use --overwrite to replace.`);
    }
  }

  if (allDependencies.length > 0) {
    const uniqueDeps = [...new Set(allDependencies)].sort();

    const missingDeps = uniqueDeps.filter((dep) => {
      return (
        !existsSync(join(cwd, "node_modules", dep)) &&
        !existsSync(join(cwd, "bun.lockb"))
      );
    });

    if (missingDeps.length > 0) {
      info(`Installing dependencies: ${missingDeps.join(", ")}`);
      await installDependencies(missingDeps);
    }
  }

  console.log("\n");

  if (installedComponents.length > 0) {
    success(`Successfully added: ${installedComponents.join(", ")}`);
  }

  if (options.components.length > installedComponents.length) {
    const failed = options.components.filter(
      (c) => !installedComponents.includes(c),
    );

    warning(`Failed to add: ${failed.join(", ")}`);
  }

  console.log("\n");
}

async function addAllComponents(
  componentsDir: string,
  hooksDir: string,
  cwd: string = process.cwd(),
  options: AddOptions,
): Promise<void> {
  info("Fetching registry index...");

  try {
    const index = await fetchRegistryIndex(cwd);
    const allComponents = index.components.map((c) => c.name);

    info(`Found ${allComponents.length} components. Installing all...`);

    // We can reuse the main logic by recursively calling addComponents
    // but with a flag to avoid infinite recursion if we were calling the command action.
    // Since we are inside the module, we can just call addComponents directly.
    // However, we need to pass the list of components to it.

    await addComponents({
      ...options,
      all: false, // Prevent infinite loop
      components: allComponents,
    });
  } catch (error) {
    console.error("Failed to fetch registry index:", error);
  }
}
