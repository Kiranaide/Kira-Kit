export interface RegistryItem {
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

export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export interface ComponentsConfig {
  $schema: string;
  style: string;
  rsc: boolean;
  tsx: boolean;
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
    cssVariables: boolean;
    prefix?: string;
  };
  iconLibrary: string;
  aliases: {
    components: string;
    utils: string;
    ui: string;
    lib: string;
    hooks: string;
  };
  menuColor: string;
  menuAccent: string;
  registries: Record<string, string>;
}

export interface AddOptions {
  components: string[];
  cwd: string;
  overwrite: boolean;
  yes: boolean;
  all: boolean;
}

export interface InitOptions {
  cwd: string;
  baseColor: string;
  primaryColor: string;
  yes: boolean;
}
