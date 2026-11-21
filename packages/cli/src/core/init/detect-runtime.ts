import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  readConsumerPackage,
  type ConsumerPackageJson,
} from "../install/deps";

export type RuntimeKind =
  | "vite"
  | "astro"
  | "turbopack"
  | "nitro"
  | "bun"
  | "postcss";

export interface DetectedRuntime {
  kind: RuntimeKind;
  label: string;
  configFile: string | null;
  usesVite: boolean;
  viteMajor: number | null;
  hasNitro: boolean;
  isNext: boolean;
  tailwindDeps: string[];
}

const VITE_CONFIGS = [
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.cts",
  "vite.config.cjs",
];

const ASTRO_CONFIGS = [
  "astro.config.mjs",
  "astro.config.ts",
  "astro.config.js",
  "astro.config.mts",
  "astro.config.cjs",
];

const NEXT_CONFIGS = [
  "next.config.ts",
  "next.config.mjs",
  "next.config.js",
  "next.config.cjs",
];

const NITRO_CONFIGS = [
  "nitro.config.ts",
  "nitro.config.mts",
  "nitro.config.js",
  "nitro.config.mjs",
  "nitro.config.cjs",
];

const POSTCSS_CONFIGS = [
  "postcss.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.ts",
];

const VITE_TAILWIND_DEPS = ["tailwindcss", "@tailwindcss/vite"];
const POSTCSS_TAILWIND_DEPS = ["tailwindcss", "@tailwindcss/postcss", "postcss"];
const BUN_TAILWIND_DEPS = ["tailwindcss", "bun-plugin-tailwind"];

function findFirstExisting(cwd: string, candidates: string[]): string | null {
  for (const candidate of candidates) {
    if (existsSync(join(cwd, candidate))) return candidate;
  }

  return null;
}

function collectDepNames(pkg: ConsumerPackageJson): Set<string> {
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
}

function parseMajorVersion(range: string | undefined): number | null {
  if (!range) return null;

  const match = range.match(/(\d+)/);

  return match ? Number(match[1]) : null;
}

function viteConfigMentionsNitro(
  cwd: string,
  configFile: string | null,
): boolean {
  if (!configFile) return false;

  try {
    const content = readFileSync(join(cwd, configFile), "utf-8");

    return /["']nitro(?:\/vite)?["']/.test(content);
  } catch {
    return false;
  }
}

function viteLabel(
  hasTanStackStart: boolean,
  hasNitro: boolean,
  hasReactRouter: boolean,
): string {
  if (hasTanStackStart && hasNitro) return "Vite (TanStack Start + Nitro)";

  if (hasTanStackStart) return "Vite (TanStack Start)";

  if (hasNitro) return "Vite + Nitro";

  if (hasReactRouter) return "Vite (React Router)";

  return "Vite";
}

function buildViteRuntime(
  pkg: ConsumerPackageJson,
  deps: Set<string>,
  viteConfig: string | null,
  hasNitro: boolean,
): DetectedRuntime {
  const viteRange =
    pkg.dependencies?.vite ??
    pkg.devDependencies?.vite ??
    pkg.peerDependencies?.vite;

  return {
    kind: "vite",
    label: viteLabel(
      deps.has("@tanstack/react-start"),
      hasNitro,
      deps.has("@react-router/dev"),
    ),
    configFile: viteConfig,
    usesVite: true,
    viteMajor: parseMajorVersion(viteRange),
    hasNitro,
    isNext: false,
    tailwindDeps: [...VITE_TAILWIND_DEPS],
  };
}

function buildRuntime(
  kind: RuntimeKind,
  label: string,
  configFile: string | null,
  tailwindDeps: string[],
  flags: { hasNitro?: boolean; isNext?: boolean } = {},
): DetectedRuntime {
  return {
    kind,
    label,
    configFile,
    usesVite: false,
    viteMajor: null,
    hasNitro: Boolean(flags.hasNitro),
    isNext: Boolean(flags.isNext),
    tailwindDeps: [...tailwindDeps],
  };
}

function detectNitro(
  cwd: string,
  deps: Set<string>,
  viteConfig: string | null,
  nitroConfig: string | null,
): boolean {
  return (
    nitroConfig !== null ||
    deps.has("nitro") ||
    deps.has("nitropack") ||
    viteConfigMentionsNitro(cwd, viteConfig)
  );
}

function detectFallbackRuntime(
  cwd: string,
  deps: Set<string>,
): DetectedRuntime {
  const bunConfig = existsSync(join(cwd, "bunfig.toml")) ? "bunfig.toml" : null;

  if (bunConfig || deps.has("bun-plugin-tailwind")) {
    return buildRuntime("bun", "Bun", bunConfig, BUN_TAILWIND_DEPS);
  }

  const postcssConfig = findFirstExisting(cwd, POSTCSS_CONFIGS);

  return buildRuntime(
    "postcss",
    postcssConfig ? "PostCSS" : "Generic (PostCSS)",
    postcssConfig,
    POSTCSS_TAILWIND_DEPS,
  );
}

/**
 * Inspect the consumer's config files and package.json to determine the active
 * bundler/runtime and the Tailwind CSS v4 integration it needs.
 */
export function detectProjectRuntime(cwd: string): DetectedRuntime {
  const pkg = readConsumerPackage(cwd);
  const deps = collectDepNames(pkg);

  const astroConfig = findFirstExisting(cwd, ASTRO_CONFIGS);

  if (astroConfig || deps.has("astro")) {
    return buildRuntime("astro", "Astro", astroConfig, VITE_TAILWIND_DEPS);
  }

  const nextConfig = findFirstExisting(cwd, NEXT_CONFIGS);

  if (nextConfig || deps.has("next")) {
    return buildRuntime(
      "turbopack",
      "Next.js (Turbopack)",
      nextConfig,
      POSTCSS_TAILWIND_DEPS,
      { isNext: true },
    );
  }

  const viteConfig = findFirstExisting(cwd, VITE_CONFIGS);
  const nitroConfig = findFirstExisting(cwd, NITRO_CONFIGS);
  const hasNitro = detectNitro(cwd, deps, viteConfig, nitroConfig);

  if (viteConfig || deps.has("vite")) {
    return buildViteRuntime(pkg, deps, viteConfig, hasNitro);
  }

  if (hasNitro) {
    return buildRuntime("nitro", "Nitro", nitroConfig, POSTCSS_TAILWIND_DEPS, {
      hasNitro: true,
    });
  }

  return detectFallbackRuntime(cwd, deps);
}
