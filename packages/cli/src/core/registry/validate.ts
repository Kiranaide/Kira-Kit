import { existsSync, readFileSync } from "node:fs";
import { join, posix, relative } from "node:path";
import type { SourceRegistryItem } from "../../lib/schemas";
import { extractImports } from "./extract";
import type { LoadedRegistry } from "./loader";

export interface ValidationIssue {
  item: string;
  message: string;
}

interface ShippedFile {
  /** Repo-relative posix path, e.g. "src/lib/camera/utils.ts". */
  repoPath: string;
  absPath: string;
}

interface AvailableModules {
  ui: Set<string>;
  hooks: Set<string>;
  lib: Set<string>;
}

function shippedFiles(
  item: SourceRegistryItem,
  baseDir: string,
  repoRoot: string,
): ShippedFile[] {
  return (item.files ?? []).map((file) => {
    const absPath = join(baseDir, file.path);

    return {
      repoPath: relative(repoRoot, absPath).replaceAll("\\", "/"),
      absPath,
    };
  });
}

function stemOf(repoPath: string): string {
  return repoPath.replace(/\.(tsx|ts)$/, "");
}

function addModules(files: ShippedFile[], into: AvailableModules): void {
  for (const file of files) {
    const stem = stemOf(file.repoPath);

    if (stem.startsWith("src/components/ui/")) {
      into.ui.add(stem.slice("src/components/ui/".length));
    } else if (stem.startsWith("src/hooks/")) {
      into.hooks.add(stem.slice("src/hooks/".length));
    } else if (stem.startsWith("src/lib/")) {
      into.lib.add(stem.slice("src/lib/".length));
    }
  }
}

/** Transitive registryDependencies closure, cycle-safe; URLs are skipped. */
function closureItems(
  start: SourceRegistryItem,
  byName: Map<string, SourceRegistryItem>,
): SourceRegistryItem[] {
  const seen = new Set<string>();
  const out: SourceRegistryItem[] = [];
  const stack = [start];

  while (stack.length > 0) {
    const item = stack.pop();

    if (!item || seen.has(item.name)) continue;

    seen.add(item.name);
    out.push(item);

    for (const dep of item.registryDependencies ?? []) {
      const next = byName.get(dep.replace(/^@[^/]+\//, "")) ?? byName.get(dep);

      if (next) stack.push(next);
    }
  }

  return out;
}

function validateFile(
  item: SourceRegistryItem,
  file: ShippedFile,
  own: Set<string>,
  avail: AvailableModules,
  issues: ValidationIssue[],
): void {
  const imports = extractImports(
    readFileSync(file.absPath, "utf-8"),
    file.repoPath,
  );

  const missing = (specifier: string, line: number): void => {
    issues.push({
      item: item.name,
      message: `${file.repoPath}:${line} imports "${specifier}" but no item in its dependency tree ships it.`,
    });
  };

  for (const imp of imports.internal) {
    const isHook = imp.specifier.startsWith("@/hooks/");

    const name = stemOf(
      imp.specifier.replace("@/components/ui/", "").replace("@/hooks/", ""),
    );

    if (!(isHook ? avail.hooks : avail.ui).has(name)) {
      missing(imp.specifier, imp.line);
    }
  }

  for (const imp of imports.lib) {
    const subpath = stemOf(imp.specifier.replace("@/lib/", ""));

    if (!avail.lib.has(subpath)) missing(imp.specifier, imp.line);
  }

  for (const imp of imports.relative) {
    const resolved = stemOf(
      posix.normalize(posix.join(posix.dirname(file.repoPath), imp.specifier)),
    );

    if (!own.has(resolved)) missing(imp.specifier, imp.line);
  }
}

function availableModules(
  item: SourceRegistryItem,
  byName: Map<string, SourceRegistryItem>,
  loaded: LoadedRegistry,
  repoRoot: string,
) {
  const avail: AvailableModules = {
    ui: new Set(),
    hooks: new Set(),
    lib: new Set(),
  };

  const own = new Set<string>();

  for (const depItem of closureItems(item, byName)) {
    const depFiles = shippedFiles(
      depItem,
      loaded.origins.get(depItem.name) ?? repoRoot,
      repoRoot,
    );

    addModules(depFiles, avail);

    if (depItem.name === item.name) {
      for (const f of depFiles) own.add(stemOf(f.repoPath));
    }
  }

  return { avail, own };
}

function checkItem(
  item: SourceRegistryItem,
  loaded: LoadedRegistry,
  byName: Map<string, SourceRegistryItem>,
  repoRoot: string,
  issues: ValidationIssue[],
): void {
  const baseDir = loaded.origins.get(item.name) ?? repoRoot;
  const files = shippedFiles(item, baseDir, repoRoot);

  for (const file of files) {
    if (!existsSync(file.absPath)) {
      issues.push({
        item: item.name,
        message: `shipped file "${file.repoPath}" does not exist.`,
      });
    }
  }

  const { avail, own } = availableModules(item, byName, loaded, repoRoot);

  for (const file of files) {
    if (existsSync(file.absPath) && /\.(tsx|ts)$/.test(file.repoPath)) {
      validateFile(item, file, own, avail, issues);
    }
  }
}

/**
 * Native registry validation: every shipped file exists, and every internal,
 * lib, and relative import resolves to a file shipped by the item or its
 * transitive registryDependencies. Guarantees no missing-module ships.
 */
export function validateRegistry(
  repoRoot: string,
  loaded: LoadedRegistry,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const byName = new Map<string, SourceRegistryItem>();

  for (const item of loaded.items) {
    byName.set(item.name, item);

    const short = item.name.split("/").pop();

    if (short && short !== item.name) byName.set(short, item);
  }

  for (const item of loaded.items) {
    checkItem(item, loaded, byName, repoRoot, issues);
  }

  return issues;
}
