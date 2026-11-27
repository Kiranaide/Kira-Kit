import type { DepInstaller } from "./core/install/deps";
import type { z } from "zod";
import type { kiraConfigSchema, RegistryItemPayload } from "./lib/schemas";

export type RegistryItemType =
  | "registry:ui"
  | "registry:hook"
  | "registry:theme"
  | "registry:style"
  | "registry:base"
  | "registry:file"
  | "registry:lib"
  | "registry:block"
  | "registry:page"
  | "registry:item";

export interface RegistryItem {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  categories?: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files?: Array<{
    path: string;
    type: string;
    content: string;
    target?: string;
  }>;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

/** kira-kit.json shape is owned by the zod schema in lib/schemas. */
export type KiraConfig = z.infer<typeof kiraConfigSchema>;

export interface AddOptions {
  items: string[];
  cwd: string;
  overwrite: boolean;
  yes: boolean;
  all: boolean;
  path?: string;
  dryRun?: boolean;
  diff?: boolean;
  view?: boolean;
}

export interface InitOptions {
  cwd: string;
  preset?: string;
  primary?: string;
  baseColor?: string;
  fontPreset?: string;
  font?: string;
  fontDisplay?: string;
  fontMono?: string;
  radius?: string;
  surface?: string;
  icon?: string;
  force: boolean;
  yes: boolean;
  /** Skip installing npm packages (used by `create --no-install`). */
  skipDeps?: boolean;
  /** Injectable package installer (tests); defaults to the detected PM. */
  installer?: DepInstaller;
}

export interface ThemeOptions {
  primary?: string;
  baseColor?: string;
  fontPreset?: string;
  font?: string;
  fontDisplay?: string;
  fontMono?: string;
  radius?: string;
  surface?: string;
  icon?: string;
  out?: string;
  apply: boolean;
  cwd: string;
  /** Injectable package installer (tests); defaults to the detected PM. */
  installer?: DepInstaller;
}

export interface CheckOptions {
  paths: string[];
  ci: boolean;
  format?: "pretty" | "json" | "github";
  json: boolean;
  cwd?: string;
}

export interface ScaffoldInvocation {
  command: string;
  args: string[];
  cwd: string;
  /** True when the upstream scaffolder already ran dependency installation. */
  installedDeps: boolean;
}

export interface CreateOptions {
  dir?: string;
  cwd?: string;
  template?: string;
  install: boolean;
  git: boolean;
  yes: boolean;
  /** Injectable upstream scaffolder runner (tests); defaults to spawning the PM execute command. */
  scaffolder?: (invocation: ScaffoldInvocation) => Promise<void>;
  /** Injectable post-scaffold Kira Kit initializer (tests); defaults to `init`. */
  initProject?: (options: InitOptions) => Promise<number>;
  /** Injectable package installer (tests); defaults to the detected PM. */
  installer?: DepInstaller;
  /** Injectable git initializer (tests); defaults to `git init`. */
  gitInit?: (cwd: string) => Promise<void>;
}

export interface MigrateOptions {
  cwd: string;
  dryRun: boolean;
  yes: boolean;
  /** Injectable package installer (tests); defaults to the detected PM. */
  installer?: DepInstaller;
  /** Injectable registry fetcher for divergence checks (tests). */
  fetchItem?: (
    address: string,
    ctx: { cwd: string; registries?: Record<string, string> },
  ) => Promise<RegistryItemPayload>;
}
