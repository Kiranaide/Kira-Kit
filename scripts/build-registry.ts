/**
 * Build Registry Script
 * Generates shadcn-compatible registry JSON files for all UI components.
 * Outputs to public/r/ for Vercel deployment.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";

// Configuration
const COMPONENTS_DIR = "./src/components/ui";
const HOOKS_DIR = "./src/hooks";
const OUTPUT_DIR = "./public/r";
const REGISTRY_NAME = "kira-kit";
const HOMEPAGE = "https://kira-kit.vercel.app";

// Dependency mappings - npm packages used by components
const NPM_DEPENDENCY_MAP: Record<string, string[]> = {
  "@base-ui/react": ["@base-ui/react"],
  animejs: ["animejs"],
  "class-variance-authority": ["class-variance-authority"],
  "@tabler/icons-react": ["@tabler/icons-react"],
  "date-fns": ["date-fns"],
  "react-day-picker": ["react-day-picker"],
  "react-resizable-panels": ["react-resizable-panels"],
  "@tanstack/react-table": ["@tanstack/react-table"],
  "@tanstack/react-virtual": ["@tanstack/react-virtual"],
  "@uiw/color-convert": ["@uiw/color-convert"],
  "@uiw/react-color-hue": ["@uiw/react-color-hue"],
  "@uiw/react-color-saturation": ["@uiw/react-color-saturation"],
  "@dnd-kit/core": ["@dnd-kit/core"],
  "@dnd-kit/sortable": ["@dnd-kit/sortable"],
  "@dnd-kit/utilities": ["@dnd-kit/utilities"],
  sonner: ["sonner"],
};

// Registry dependencies - components that depend on other kira-kit components
const REGISTRY_DEPENDENCY_MAP: Record<string, string[]> = {
  accordion: [],
  alert: [],
  "alert-dialog": ["button"],
  "aspect-ratio": [],
  avatar: [],
  badge: [],
  button: [],
  "button-group": ["button"],
  calendar: [],
  card: [],
  checkbox: ["label"],
  "color-picker": ["button", "popover", "input", "slider", "tabs"],
  combobox: ["button"],
  "context-menu": [],
  "data-table": ["button", "checkbox", "input", "dropdown-menu", "table"],
  "date-picker": ["button", "popover", "calendar"],
  dialog: [],
  drawer: [],
  "dropdown-menu": [],
  empty: [],
  field: ["label"],
  "file-upload": ["button", "dialog"],
  "hover-card": [],
  input: [],
  "input-group": ["input"],
  kbd: [],
  label: [],
  menubar: [],
  "navigation-menu": [],
  pagination: ["button"],
  popover: [],
  progress: [],
  "radio-group": ["label"],
  resizable: [],
  select: ["button", "popover"],
  separator: [],
  sidebar: ["button", "separator"],
  skeleton: [],
  slider: [],
  sonner: [],
  switch: [],
  table: [],
  tabs: [],
  textarea: [],
  toggle: [],
  "toggle-group": ["toggle"],
  tooltip: [],
  "tree-view": ["checkbox"],
};

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

/**
 * Extract npm dependencies from component source code
 */
function extractDependencies(content: string): string[] {
  const deps: Set<string> = new Set();

  // Always include core deps
  deps.add("clsx");
  deps.add("tailwind-merge");

  // Check for npm package imports
  for (const [importKey, npmDeps] of Object.entries(NPM_DEPENDENCY_MAP)) {
    // Match import statements like: import ... from "package"
    const regex = new RegExp(
      `from\\s+["']${importKey.replace("/", "\\/")}`,
      "g"
    );
    if (regex.test(content)) {
      npmDeps.forEach((dep) => deps.add(dep));
    }
  }

  // Check for class-variance-authority (cva)
  if (
    content.includes('from "class-variance-authority"') ||
    content.includes("from 'class-variance-authority'")
  ) {
    deps.add("class-variance-authority");
  }

  return Array.from(deps).sort();
}

/**
 * Get hook dependencies from component content
 */
function getHookDependencies(content: string): string[] {
  const hooks: Set<string> = new Set();
  
  // Scan for @/hooks/* imports
  const hookImportRegex = /from\s+["']@\/hooks\/([^"']+)["']/g;
  let match;
  while ((match = hookImportRegex.exec(content)) !== null) {
    const hookName = match[1].replace(".tsx", "").replace(".ts", "");
    hooks.add(hookName);
  }
  
  return Array.from(hooks).sort();
}

/**
 * Get registry dependencies for a component
 */
function getRegistryDependencies(
  componentName: string,
  content: string
): string[] {
  const deps: Set<string> = new Set();

  // Check predefined mappings first
  if (REGISTRY_DEPENDENCY_MAP[componentName]) {
    REGISTRY_DEPENDENCY_MAP[componentName].forEach((dep) => deps.add(dep));
  }

  // Also scan for @/components/ui/* imports
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

/**
 * Convert kebab-case to Title Case
 */
function toTitleCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate registry item for a component
 */
function generateRegistryItem(filePath: string): RegistryItem {
  const fileName = basename(filePath, ".tsx");
  const content = readFileSync(filePath, "utf-8");

  const dependencies = extractDependencies(content);
  const registryDependencies = getRegistryDependencies(fileName, content);
  const hookDeps = getHookDependencies(content);

  // Build files array with component file
  const files: RegistryItem["files"] = [
    {
      path: `ui/${fileName}.tsx`,
      type: "registry:component",
      content,
    },
  ];

  // Include hook files if component imports them
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

/**
 * Main build function
 */
function buildRegistry() {
  console.log("🔨 Building Kira Kit registry...\n");

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get all component files
  const files = readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();

  console.log(`📦 Found ${files.length} components\n`);

  const items: RegistryItem[] = [];

  for (const file of files) {
    const filePath = join(COMPONENTS_DIR, file);
    const item = generateRegistryItem(filePath);
    items.push(item);

    // Write individual component JSON
    const componentJsonPath = join(OUTPUT_DIR, `${item.name}.json`);
    writeFileSync(componentJsonPath, JSON.stringify(item, null, 2));
    console.log(
      `  ✅ ${item.name} (${item.dependencies.length} deps, ${item.registryDependencies.length} registry deps)`
    );
  }

  // Generate master registry.json
  const registry: Registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: HOMEPAGE,
    items,
  };

  const registryPath = join(OUTPUT_DIR, "registry.json");
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));

  // Generate index.json (simpler version for listing)
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
    JSON.stringify(indexData, null, 2)
  );

  console.log(`\n✨ Registry built successfully!`);
  console.log(`   📁 Output: ${OUTPUT_DIR}/`);
  console.log(
    `   📄 ${files.length} component JSONs + registry.json + index.json`
  );
  console.log(
    `\n🚀 Deploy to Vercel and access at: https://your-domain.vercel.app/r/{name}.json`
  );
}

// Run
buildRegistry();
