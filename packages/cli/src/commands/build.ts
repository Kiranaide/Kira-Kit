import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const COMPONENTS_DIR = "./src/components/ui";
const HOOKS_DIR = "./src/hooks";
const OUTPUT_DIR = "./public/r";
const REGISTRY_NAME = "kira-kit";
const HOMEPAGE = "https://kira-kit.vercel.app";

import {
  NPM_DEPENDENCY_MAP,
  REGISTRY_DEPENDENCY_MAP,
} from "../lib/build-config";

interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:hook";
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{
    path: string;
    type: "registry:component" | "registry:hook";
    content: string;
  }>;
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function extractDependencies(content: string): string[] {
  const deps: Set<string> = new Set();

  deps.add("clsx");
  deps.add("tailwind-merge");

  for (const [importKey, npmDeps] of Object.entries(NPM_DEPENDENCY_MAP)) {
    const regex = new RegExp(
      `from\\s+["']${importKey.replace("/", "\\/")}`,
      "g",
    );
    if (regex.test(content)) {
      npmDeps.forEach((dep) => deps.add(dep));
    }
  }

  if (
    content.includes('from "class-variance-authority"') ||
    content.includes("from 'class-variance-authority'")
  ) {
    deps.add("class-variance-authority");
  }

  return Array.from(deps).sort();
}

function getHookDependencies(content: string): string[] {
  const hooks: Set<string> = new Set();

  const hookImportRegex = /from\s+["']@\/hooks\/([^"']+)["']/g;
  let match;
  while ((match = hookImportRegex.exec(content)) !== null) {
    const hookName = match[1].replace(".tsx", "").replace(".ts", "");
    hooks.add(hookName);
  }

  return Array.from(hooks).sort();
}

function getRegistryDependencies(
  componentName: string,
  content: string,
): string[] {
  const deps: Set<string> = new Set();

  if (REGISTRY_DEPENDENCY_MAP[componentName]) {
    REGISTRY_DEPENDENCY_MAP[componentName].forEach((dep) => deps.add(dep));
  }

  const uiImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  let match;
  while ((match = uiImportRegex.exec(content)) !== null) {
    const importedComponent = match[1].replace(".tsx", "").replace(".ts", "");
    if (importedComponent !== componentName) {
      deps.add(importedComponent);
    }
  }

  return Array.from(deps).sort();
}

function toTitleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateRegistryItem(filePath: string): RegistryItem {
  const fileName = filePath.split("/").pop()?.replace(".tsx", "") || "";
  const content = readFileSync(filePath, "utf-8");

  const dependencies = extractDependencies(content);
  const registryDependencies = getRegistryDependencies(fileName, content);
  const hookDeps = getHookDependencies(content);

  const files: RegistryItem["files"] = [
    {
      path: `ui/${fileName}.tsx`,
      type: "registry:component",
      content,
    },
  ];

  for (const hookName of hookDeps) {
    const hookPath = join(HOOKS_DIR, `${hookName}.ts`);
    if (existsSync(hookPath)) {
      const hookContent = readFileSync(hookPath, "utf-8");
      files.push({
        path: `hooks/${hookName}.ts`,
        type: "registry:hook",
        content: hookContent,
      });
    }
  }

  return {
    name: fileName,
    type: "registry:ui",
    title: toTitleCase(fileName),
    description: `${toTitleCase(fileName)} component from Kira Kit.`,
    dependencies,
    registryDependencies,
    files,
  };
}

export function buildRegistry(): void {
  console.log("🔨 Building Kira Kit registry...\n");

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!existsSync(COMPONENTS_DIR)) {
    console.log(`📦 Components directory not found: ${COMPONENTS_DIR}`);
    console.log("Make sure you're running from the kira-kit root directory.");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdirSync } = require("fs");
  const files = readdirSync(COMPONENTS_DIR)
    .filter((f: string) => f.endsWith(".tsx"))
    .sort();

  console.log(`📦 Found ${files.length} components\n`);

  const items: RegistryItem[] = [];

  for (const file of files) {
    const filePath = join(COMPONENTS_DIR, file);
    const item = generateRegistryItem(filePath);
    items.push(item);

    const componentJsonPath = join(OUTPUT_DIR, `${item.name}.json`);
    writeFileSync(componentJsonPath, JSON.stringify(item, null, 2));
    console.log(
      `  ✅ ${item.name} (${item.dependencies.length} deps, ${item.registryDependencies.length} registry deps)`,
    );
  }

  const registry: Registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: HOMEPAGE,
    items,
  };

  const registryPath = join(OUTPUT_DIR, "registry.json");
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));

  const indexData = {
    name: REGISTRY_NAME,
    homepage: HOMEPAGE,
    components: items.map((item) => ({
      name: item.name,
      title: item.title,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
    })),
  };

  writeFileSync(
    join(OUTPUT_DIR, "index.json"),
    JSON.stringify(indexData, null, 2),
  );

  console.log(`\n✨ Registry built successfully!`);
  console.log(`   📁 Output: ${OUTPUT_DIR}/`);
  console.log(
    `   📄 ${files.length} component JSONs + registry.json + index.json`,
  );
  console.log(
    `\n🚀 Deploy to Vercel and access at: https://your-domain.vercel.app/r/{name}.json`,
  );
}
