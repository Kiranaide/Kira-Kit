import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ComponentsConfig } from "../types";

export const DEFAULT_REGISTRY_URL = "https://kira-kit.vercel.app/r";

const DEFAULT_CONFIG = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "base-nova",
  rsc: false,
  tsx: true,
  registryUrl: DEFAULT_REGISTRY_URL,
  tailwind: {
    config: "",
    css: "src/index.css",
    baseColor: "neutral",
    cssVariables: true,
    prefix: "",
  },
  iconLibrary: "tabler",
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
  menuColor: "default",
  menuAccent: "subtle",
  registries: {},
} as const;

export function findConfigFile(cwd: string): string | null {
  const paths = [join(cwd, "components.json"), join(cwd, "kira-kit.json")];

  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

export function readConfig(cwd: string): ComponentsConfig | null {
  const configPath = findConfigFile(cwd);

  if (!configPath) {
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf-8");

    return JSON.parse(content) as ComponentsConfig;
  } catch {
    return null;
  }
}

export function writeConfig(
  cwd: string,
  config: Partial<ComponentsConfig>,
): void {
  const existingConfig = readConfig(cwd);
  const newConfig = { ...DEFAULT_CONFIG, ...existingConfig, ...config };

  const configPath = join(cwd, "components.json");
  writeFileSync(configPath, JSON.stringify(newConfig, null, 2) + "\n");
}

export function updateAliases(
  cwd: string,
  aliases: Partial<ComponentsConfig["aliases"]>,
): void {
  const config = readConfig(cwd);

  if (!config) {
    throw new Error("No components.json found. Run 'kira-kit init' first.");
  }

  config.aliases = { ...config.aliases, ...aliases };

  const configPath = join(cwd, "components.json");
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

export function getAliases(cwd: string): ComponentsConfig["aliases"] {
  const config = readConfig(cwd);

  if (!config) {
    return DEFAULT_CONFIG.aliases;
  }

  return config.aliases;
}

export function getRegistryUrl(cwd: string): string {
  const config = readConfig(cwd);

  if (!config) {
    return "https://kira-kit.vercel.app/r";
  }

  if (config.registries && "@kira-kit" in config.registries) {
    return config.registries["@kira-kit"];
  }

  return "https://kira-kit.vercel.app/r";
}
