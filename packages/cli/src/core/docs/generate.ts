import { join } from "node:path";
import type { SourceRegistryItem } from "../../lib/schemas";

export interface DocsOptions {
  repoRoot: string;
  /** Output directory for docs (default: public). */
  outDir?: string;
  /**
   * Optional origin for links in llms.txt (e.g. "https://example.com").
   * When omitted, resolved from deployment env vars or left empty so links
   * stay root-relative ("/docs/<name>.md") and work on any deployed host.
   */
  siteUrl?: string;
}

function normalizeOrigin(raw: string | undefined): string {
  if (!raw) return "";

  // Coolify can pass comma-separated URLs/FQDNs when multiple domains are bound.
  const first = raw
    .split(",")
    .map((part) => part.trim())
    .find(Boolean);

  if (!first) return "";

  const withScheme = /^https?:\/\//i.test(first) ? first : `https://${first}`;

  return withScheme.replace(/\/+$/, "");
}

/**
 * Resolve the deployed site origin from an explicit override or standard
 * platform environment variables. Returns "" when none is set so generated
 * llms.txt links stay root-relative ("/docs/<name>.md").
 */
export function resolveDocsBaseUrl(
  explicit?: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const direct = normalizeOrigin(explicit);

  if (direct) return direct;

  const candidates = [
    env.SITE_URL,
    env.PUBLIC_SITE_URL,
    env.VITE_SITE_URL,
    env.COOLIFY_URL,
    env.COOLIFY_FQDN,
    env.VERCEL_ENV === "production"
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : undefined,
    env.VERCEL_URL,
    env.CF_PAGES_URL,
    env.URL && /^https?:\/\//i.test(env.URL) ? env.URL : undefined,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeOrigin(candidate);

    if (normalized) return normalized;
  }

  return "";
}

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
  options: DocsOptions,
): GeneratedDocs {
  const baseUrl = resolveDocsBaseUrl(options.siteUrl);

  const perItem = items.map((item) => ({
    name: item.name,
    content: renderMarkdown(item),
  }));

  const llmsTxt = renderLlmsTxt(items, baseUrl);

  return { llmsTxt, perItem };
}

function renderLlmsTxt(items: SourceRegistryItem[], baseUrl: string): string {
  const lines: string[] = [
    "# Kira Kit",
    "",
    `> Enterprise UI kit built on Base UI primitives, ${items.length} components and hooks.`,
    "",
    "Kira Kit is a component registry. Install items with the kira-kit CLI:",
    "`kira-kit add @kira-kit/<name>`.",
    "",
    "Conventions:",
    "- Primitives: @base-ui/react (Base UI only — no Radix, no React Aria)",
    "- Class merging: the `cn` npm package",
    "- Styling: Tailwind CSS v4 with semantic CSS variables (never raw hex colors)",
    "- Slots: every component root carries data-slot",
    "- Variants: class-variance-authority, exported as `<name>Variants`",
    "- Motion: GSAP and CSS animations, always gated by useReducedMotion / gsap.matchMedia",
    "- Icons: @tabler/icons-react (lucide-react with --icon lucide)",
    "",
    "Items:",
  ];

  for (const item of items) {
    lines.push(
      `- [${item.title ?? item.name}](${baseUrl}/docs/${item.name}.md): ${item.description}`,
    );
  }

  return lines.join("\n") + "\n";
}

function usageLines(item: SourceRegistryItem): string[] {
  if (item.type === "registry:hook") {
    return [`import { ${camelCase(item.name)} } from "@/hooks/${item.name}";`];
  }

  if (item.type === "registry:lib") {
    const first = item.files?.[0]?.path ?? `${item.name}.ts`;
    const subpath = first.replace(/\.(tsx|ts)$/, "");

    return [
      `// Installed under your lib alias, e.g. src/lib/${subpath}.ts`,
      `import { /* exports */ } from "@/lib/${subpath}";`,
    ];
  }

  if (item.type === "registry:theme") {
    return ["/* Applied as CSS variables by kira-kit. */"];
  }

  if (item.type === "registry:style") {
    return [
      "/* Installed as CSS files next to your global stylesheet by kira-kit. */",
    ];
  }

  const component = pascalCase(item.name);

  return [
    `import { ${component} } from "@/components/ui/${item.name}";`,
    `<${component}> text</${component}>`,
  ];
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
    `kira-kit add @kira-kit/${item.name}`,
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

  lines.push("## Usage", "", "```tsx", ...usageLines(item), "```", "");

  if (item.type === "registry:ui") {
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
