import { z } from "zod";

export const KIRA_NAMESPACE = "@kira-kit";

export const DEFAULT_REGISTRY_URL = "https://kira-kit.vercel.app/r/{name}.json";

/**
 * components.json as written by shadcn init. We are deliberately loose:
 * shadcn owns this file's shape; we only read the parts we need.
 */
export const componentsConfigSchema = z.looseObject({
  $schema: z.string().optional(),
  style: z.string().optional(),
  rsc: z.boolean().optional(),
  tsx: z.boolean().optional(),
  tailwind: z
    .looseObject({
      css: z.string().optional(),
      baseColor: z.string().optional(),
      cssVariables: z.boolean().optional(),
    })
    .optional(),
  iconLibrary: z.string().optional(),
  aliases: z
    .looseObject({
      components: z.string().optional(),
      utils: z.string().optional(),
      ui: z.string().optional(),
      lib: z.string().optional(),
      hooks: z.string().optional(),
    })
    .optional(),
  registries: z.record(z.string(), z.string()).optional(),
});

/** A registry item in our source registries (before build inlines files). */
export const sourceRegistryItemSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, "item name must be kebab-case"),
  type: z.enum([
    "registry:ui",
    "registry:hook",
    "registry:theme",
    "registry:style",
    "registry:base",
    "registry:file",
    "registry:lib",
    "registry:block",
    "registry:page",
  ]),
  title: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z
    .array(
      z.object({
        path: z.string(),
        type: z.string().optional(),
        target: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .optional(),
  cssVars: z
    .looseObject({
      theme: z.record(z.string(), z.string()).optional(),
      light: z.record(z.string(), z.string()).optional(),
      dark: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  docs: z.string().optional(),
});

/** Source registry file. Only the root registry.json carries a name. */
export const sourceRegistrySchema = z.object({
  $schema: z.string().optional(),
  name: z.string().optional(),
  homepage: z.string().optional(),
  include: z.array(z.string()).optional(),
  items: z.array(sourceRegistryItemSchema).optional(),
});

export type SourceRegistry = z.infer<typeof sourceRegistrySchema>;

export type SourceRegistryItem = z.infer<typeof sourceRegistryItemSchema>;
