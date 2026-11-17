export interface SourceFile {
  /** Display name, e.g. "ui/button" or "hooks/use-reduced-motion". */
  name: string;
  /** Absolute or repo-relative path. */
  path: string;
  content: string;
}

export interface CheckContext {
  /** Combined src/index.css (or equivalent) for animation token checks. */
  indexCss: string;
  /** Registry metadata by item name (for checks 1 and 10). */
  items: Map<string, ItemMeta>;
}

export interface ItemMeta {
  dependencies: string[];
  registryDependencies: string[];
  /** File paths (like "ui/button.tsx") owned by the item. */
  files: string[];
  description: string;
  categories: string[];
}

export type Severity = "error" | "warning";

export interface Finding {
  checkId: string;
  severity: Severity;
  file: string;
  line?: number;
  col?: number;
  message: string;
}

export type Check = (file: SourceFile, ctx: CheckContext) => Finding[];

export const BUILTIN_IMPORTS = new Set([
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
]);
