/**
 * Maps src/lib module subpaths to the registry:lib item that ships them.
 * Shared by the import extractor, checks, scaffold, and build validation so
 * every `@/lib/*` import resolves to exactly one shippable item.
 */
export const LIB_ITEM_MAP = {
  "component-defaults": "component-defaults",
  "component-prop-guards": "component-prop-guards",
  "component-item-keys": "component-item-keys",
  "component-native-props": "component-native-props",
  "component-refs": "component-refs",
  "layout-responsive": "layout-responsive",
  "code-presentation": "code-presentation",
  "color-picker": "color-picker-lib",
  "camera/types": "camera-lib",
  "camera/constants": "camera-lib",
  "camera/utils": "camera-lib",
  "camera/guide-presets": "camera-lib",
  "data-table-helpers": "data-table-helpers",
} satisfies Record<string, string>;

/** "@/lib/camera/types.ts" -> "camera/types" */
export function libSubpathOf(specifier: string): string {
  return specifier.replace(/^@\/lib\//, "").replace(/\.(tsx|ts)$/, "");
}

export function libItemNameFor(specifier: string): string | undefined {
  const subpath = libSubpathOf(specifier);

  if (!Object.hasOwn(LIB_ITEM_MAP, subpath)) return undefined;

  // SAFETY: Object.hasOwn above proves subpath is a key of LIB_ITEM_MAP.
  return LIB_ITEM_MAP[subpath as keyof typeof LIB_ITEM_MAP];
}
