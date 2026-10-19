/**
 * Build Registry Script
 * Generates shadcn-compatible registry JSON files for all UI components.
 * Outputs to public/r/ for Vercel deployment.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
  rmSync,
} from "fs";
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
  gsap: ["gsap"],
  "@gsap/react": ["@gsap/react", "gsap"],
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
  cmdk: ["cmdk"],
  "embla-carousel-react": ["embla-carousel-react"],
  "embla-carousel-autoplay": ["embla-carousel-autoplay"],
  "modern-monaco": ["modern-monaco"],
  "react-dom": ["react-dom"],
  recharts: ["recharts"],
  sonner: ["sonner"],
  "tesseract.js": ["tesseract.js"],
  "@tanstack/react-form": ["@tanstack/react-form"],
  "@tanstack/react-router": ["@tanstack/react-router"],
  zod: ["zod"],
};

// Registry dependencies - components that depend on other kira-kit components
const REGISTRY_DEPENDENCY_MAP: Record<string, string[]> = {
  accordion: ["tooltip"],
  alert: ["button"],
  "alert-dialog": ["button", "input"],
  "announcement-bar": [],
  "aspect-ratio": [],
  avatar: ["popover", "tooltip"],
  badge: [],
  breadcrumb: [],
  button: ["toast"],
  "button-group": ["button", "separator"],
  calendar: [],
  card: [],
  carousel: [],
  checkbox: ["label"],
  "color-picker": ["button", "popover", "input", "slider", "tabs"],
  combobox: ["button"],
  command: ["dialog"],
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
  input: ["toast", "select", "field"],
  "input-group": ["input", "select"],
  kbd: [],
  kanban: [],
  label: ["tooltip"],
  menubar: [],
  "navigation-menu": [],
  pagination: ["button"],
  popover: [],
  progress: [],
  "radio-group": ["label"],
  resizable: [],
  select: [],
  separator: [],
  sidebar: ["button", "separator"],
  skeleton: [],
  slider: [],
  spotlight: ["command"],
  stepper: [],
  stats: [],
  "stats-card": [],
  switch: [],
  table: ["checkbox"],
  tabs: ["dropdown-menu"],
  textarea: [],
  timeline: [],
  toast: [],
  toggle: ["toast", "tooltip"],
  "toggle-group": ["toggle", "tooltip", "toast"],
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
      "g",
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
  content: string,
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
// ---------------------------------------------------------------------------
// registry:check — static quality checks (playbook §8)
// Items 1–3 are errors (non-zero exit). Items 4–9 are warnings.
// ---------------------------------------------------------------------------

const INDEX_CSS_PATH = "./src/index.css";

const BUILTIN_IMPORTS: Record<string, true> = {
  react: true,
  "react-dom": true,
  "react/jsx-runtime": true,
  "react/jsx-dev-runtime": true,
};

// animate-* utilities provided by Tailwind/tailwind-animate themselves —
// no local token/keyframes pair required.
const ANIMATE_BUILTINS: Record<string, true> = {
  in: true,
  out: true,
  spin: true,
  ping: true,
  pulse: true,
  bounce: true,
  none: true,
};

interface CheckResult {
  errors: string[];
  warnings: string[];
  pruned: string[];
}

function packageNameOf(importPath: string): string | null {
  if (importPath.startsWith(".") || importPath.startsWith("/")) return null;
  if (importPath.startsWith("@/")) return null;
  const parts = importPath.split("/");
  return importPath.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function runRegistryChecks(
  sourceFiles: Array<{ name: string; content: string }>,
): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const pruned: string[] = [];

  const indexCss = existsSync(INDEX_CSS_PATH)
    ? readFileSync(INDEX_CSS_PATH, "utf8")
    : "";

  for (const { name, content } of sourceFiles) {
    // --- Check 1 (error): bare npm import not in NPM_DEPENDENCY_MAP -------
    const importRegex = /(?:from\s+|import\s+)["']([^"']+)["']/g;
    const knownPkgs = new Set(Object.keys(NPM_DEPENDENCY_MAP));
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = importRegex.exec(content)) !== null) {
      const pkg = packageNameOf(m[1]);
      if (!pkg || seen.has(pkg)) continue;
      seen.add(pkg);
      if (pkg in BUILTIN_IMPORTS) continue;
      if (!knownPkgs.has(pkg)) {
        errors.push(
          `[${name}] npm import "${pkg}" is not in NPM_DEPENDENCY_MAP — it would be silently dropped from the registry JSON.`,
        );
      }
    }

    // --- Check 2 (error/auto-prune): stale public/r/*.json ---------------
    // handled below against the full file list.

    // --- Check 3 (error): animate-* without token + keyframes ------------
    const animateRegex = /animate-([a-z0-9-]+)/g;
    const animateNames = new Set<string>();
    while ((m = animateRegex.exec(content)) !== null) {
      animateNames.add(m[1]);
    }
    for (const anim of animateNames) {
      if (anim in ANIMATE_BUILTINS) continue;
      const hasToken = indexCss.includes(`--animate-${anim}`);
      const hasKeyframes = new RegExp(`@keyframes\\s+${anim}\\s*\\{`).test(
        indexCss,
      );
      if (!hasToken || !hasKeyframes) {
        errors.push(
          `[${name}] uses \`animate-${anim}\` but src/index.css is missing ${
            !hasToken ? `\`--animate-${anim}\` token` : ""
          }${!hasToken && !hasKeyframes ? " and " : ""}${
            !hasKeyframes ? `@keyframes ${anim}` : ""
          } (dead animation).`,
        );
      }
    }

    // --- Check 4 (warning): data-slot / cva+Variants ----------------------
    if (!content.includes("data-slot=")) {
      warnings.push(`[${name}] no \`data-slot=\` found in component file.`);
    }
    const usesCva =
      content.includes("class-variance-authority") ||
      /\bcva\s*\(/.test(content);
    const exportsVariants =
      /export\s+(?:const|function|var)\s+\w*Variants/.test(content) ||
      /export\s*\{[^}]*Variants/.test(content);
    if (usesCva && !exportsVariants) {
      warnings.push(`[${name}] uses cva but exports no \`*Variants\`.`);
    }

    // --- Check 5 (warning): animation without reduced-motion gating -------
    const usesGsap = /from\s+["']gsap/.test(content);
    const usesAnimate = animateNames.size > 0;
    const hasReducedMotion =
      content.includes("useReducedMotion") ||
      content.includes("gsap.matchMedia");
    if ((usesGsap || usesAnimate) && !hasReducedMotion) {
      warnings.push(
        `[${name}] imports gsap or uses animate-* but has neither useReducedMotion nor gsap.matchMedia.`,
      );
    }

    // --- Check 6 (warning): tiny interactive targets ----------------------
    if (/\b(?:h|size)-[1-5]\b/.test(content)) {
      warnings.push(
        `[${name}] contains h-*/size- below 24px — check interactive target size (playbook §9 SC 2.5.8).`,
      );
    }

    // --- Check 7 (warning): raw colour literals ---------------------------
    const hexMatch = content.match(/#[0-9a-fA-F]{3,8}\b/);
    const rgbMatch = content.match(/\brgba?\(/);
    if (hexMatch || rgbMatch) {
      warnings.push(
        `[${name}] raw colour literal (${hexMatch ? hexMatch[0] : "rgb()"}) — use semantic tokens.`,
      );
    }

    // --- Check 8 (warning): layout-property transitions -------------------
    if (
      /\btransition-all\b/.test(content) ||
      /transition-\[(width|height|top|left)/.test(content)
    ) {
      warnings.push(
        `[${name}] transition-all or width/height/top/left transition — use transform/opacity (playbook §5).`,
      );
    }

    // --- Check 9 (warning): one-off z/shadow/radius values ----------------
    if (
      /\bz-\[/.test(content) ||
      /\bshadow-\[/.test(content) ||
      /\brounded-\[/.test(content)
    ) {
      warnings.push(
        `[${name}] arbitrary z-[…]/shadow-[…]/rounded-[…] value outside the token scales.`,
      );
    }
  }

  // --- Check 2: prune stale public/r/*.json -------------------------------
  if (existsSync(OUTPUT_DIR)) {
    const sourceNames = new Set(sourceFiles.map((f) => f.name));
    for (const f of readdirSync(OUTPUT_DIR)) {
      if (!f.endsWith(".json")) continue;
      const base = f.replace(/\.json$/, "");
      if (base === "registry" || base === "index") continue;
      if (!sourceNames.has(base)) {
        rmSync(join(OUTPUT_DIR, f));
        pruned.push(f);
      }
    }
  }

  return { errors, warnings, pruned };
}

function buildRegistry() {
  console.log("🔨 Building Kira Kit registry...\n");

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get all component files
  const files = readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();

  // registry:check (§8) — run before writing output, exit non-zero on errors
  const sourceFiles = files.map((f) => ({
    name: f.replace(/\.tsx$/, ""),
    content: readFileSync(join(COMPONENTS_DIR, f), "utf8"),
  }));
  const checkResult = runRegistryChecks(sourceFiles);
  for (const p of checkResult.pruned) {
    console.log(`  🧹 Pruned stale public/r/${p}`);
  }
  for (const w of checkResult.warnings) {
    console.log(`  ⚠️  ${w}`);
  }
  if (checkResult.errors.length > 0) {
    for (const e of checkResult.errors) {
      console.error(`  ❌ ${e}`);
    }
    console.error(
      `\n❌ registry:check failed with ${checkResult.errors.length} error(s) — fix them and re-run.`,
    );
    process.exit(1);
  }
  if (checkResult.warnings.length > 0) {
    console.log(
      `  ⚠️  ${checkResult.warnings.length} warning(s) — playbook §8 items 4–9; not blocking.`,
    );
  }

  const items: RegistryItem[] = [];

  for (const file of files) {
    const filePath = join(COMPONENTS_DIR, file);
    const item = generateRegistryItem(filePath);
    items.push(item);

    // Write individual component JSON
    const componentJsonPath = join(OUTPUT_DIR, `${item.name}.json`);
    writeFileSync(componentJsonPath, JSON.stringify(item, null, 2));
    console.log(
      `  ✅ ${item.name} (${item.dependencies.length} deps, ${item.registryDependencies.length} registry deps)`,
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

// Run
buildRegistry();
