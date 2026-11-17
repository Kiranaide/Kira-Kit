import { join } from "node:path";
import type { SourceRegistryItem } from "../../lib/schemas";

export interface DocsOptions {
  repoRoot: string;
  /** Output directory for docs (default: public). */
  outDir?: string;
}

const HOMEPAGE = "https://kira-kit.vercel.app";

/** One rendered per-item markdown page (llms.txt links to it). */
export interface PerItemDoc {
  name: string;
  content: string;
}

/** Owner contract for generateDocs: the index plus every per-item page. */
export interface GeneratedDocs {
  llmsTxt: string;
  perItem: PerItemDoc[];
}

/** Paths generateDocs outputs are written to (owned by the `build` command). */
export interface DocsOutputPaths {
  llms: string;
  docsDir: string;
}

/** Generate public/llms.txt and public/docs/<item>.md from registry items. */
export function generateDocs(
  items: SourceRegistryItem[],
  _options: DocsOptions,
): GeneratedDocs {
  const perItem = items.map((item) => ({ name: item.name, content: renderMarkdown(item) }));
  const llmsTxt = renderLlmsTxt(items);
  return { llmsTxt, perItem };
}

function renderLlmsTxt(items: SourceRegistryItem[]): string {
  const lines: string[] = [
    "# Kira Kit",
    "",
    `> Enterprise UI kit built on Base UI primitives, ${items.length} components and hooks.`,
    "",
    "Kira Kit is a shadcn-compatible component registry. Install items with the shadcn CLI:",
    "`shadcn add @kira-kit/<name>`, or register the registry once with `shadcn registry add`.",
    "",
    "Conventions:",
    "- Primitives: @base-ui/react (Base UI only — no Radix, no React Aria)",
    "- Class merging: the `cn` npm package",
    "- Styling: Tailwind CSS v4 with semantic CSS variables (never raw hex colors)",
    "- Slots: every component root carries data-slot",
    "- Variants: class-variance-authority, exported as `<name>Variants`",
    "- Motion: GSAP and CSS animations, always gated by useReducedMotion / gsap.matchMedia",
    "- Icons: @tabler/icons-react",
    "",
    "Items:",
  ];
  for (const item of items) {
    lines.push(`- [${item.title ?? item.name}](${HOMEPAGE}/docs/${item.name}.md): ${item.description}`);
  }
  return lines.join("\n") + "\n";
}

function renderMarkdown(item: SourceRegistryItem): string {
  const deps = item.dependencies ?? [];
  const registryDeps = item.registryDependencies ?? [];
  const lines: string[] = [
    `# ${item.title ?? item.name}`,
    "",
    item.description,
    "",
    "## Install",
    "",
    "```bash",
    `npx shadcn add @kira-kit/${item.name}`,
    "```",
    "",
  ];

  if (deps.length > 0) {
    lines.push("## Dependencies", "", ...deps.map((d) => `- ${d}`), "");
  }
  if (registryDeps.length > 0) {
    lines.push(
      "## Registry dependencies",
      "",
      ...registryDeps.map((d) => `- ${d}`),
      "",
    );
  }

  const isHook = item.type === "registry:hook";
  lines.push(
    "## Usage",
    "",
    "```tsx",
    isHook
      ? `import { ${camelCase(item.name)} } from "@/hooks/${item.name}";`
      : `import { ${pascalCase(item.name)} } from "@/components/ui/${item.name}";`,
    isHook
      ? ""
      : item.type === "registry:theme"
        ? "/* Applied as CSS variables by shadcn. */"
        : `<${pascalCase(item.name)}>${` text`}</${pascalCase(item.name)}>`,
    "```",
    "",
  );

  if (!isHook && item.type !== "registry:theme") {
    lines.push(
      "## Accessibility",
      "",
      "Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring",
      "come from the primitive layer. Animations are gated by `useReducedMotion`.",
      "",
    );
  }

  return lines.join("\n");
}

function pascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function camelCase(name: string): string {
  const pascal = pascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function docsOutputPaths(repoRoot: string): DocsOutputPaths {
  return {
    llms: join(repoRoot, "public", "llms.txt"),
    docsDir: join(repoRoot, "public", "docs"),
  };
}
