import type { DepInstaller } from "./core/install/deps";

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

export interface Registry {
  $schema: string;
  name: string;
  homepage?: string;
  include?: string[];
  items?: RegistryItem[];
}

export interface ComponentsConfig {
  $schema?: string;
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  tailwind?: {
    config?: string;
    css?: string;
    baseColor?: string;
    cssVariables?: boolean;
    prefix?: string;
  };
  iconLibrary?: string;
  font?: string;
  fontMono?: string;
  aliases?: {
    components?: string;
    utils?: string;
    ui?: string;
    lib?: string;
    hooks?: string;
  };
  registries?: Record<string, string>;
}

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
  font?: string;
  fontMono?: string;
  icon?: string;
  force: boolean;
  yes: boolean;
  /** Injectable package installer (tests); defaults to the detected PM. */
  installer?: DepInstaller;
}

export interface ThemeOptions {
  primary?: string;
  baseColor?: string;
  font?: string;
  fontMono?: string;
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
}

export interface CreateOptions {
  dir?: string;
  template?: string;
  install: boolean;
  git: boolean;
  yes: boolean;
}

export interface MigrateOptions {
  cwd: string;
  dryRun: boolean;
  yes: boolean;
}
