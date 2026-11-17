import {
  extractImports,
  packageNameOf,
  type LocatedImport,
} from "../registry/extract";
import {
  BUILTIN_IMPORTS,
  type Check,
  type Finding,
  type ItemMeta,
} from "./types";

/** Support modules embedded as files rather than registry items. */
const SUPPORT_MODULES = new Set(["prop-guards", "content-keys"]);

function itemNameOf(specifier: string): string {
  return specifier
    .replace(/^@\/(components\/ui|hooks)\//, "")
    .replace(/\.(tsx|ts)$/, "");
}

function undeclaredImports(
  fileName: string,
  meta: ItemMeta,
  external: LocatedImport[],
  internal: LocatedImport[],
): Finding[] {
  const findings: Finding[] = [];
  const declared = new Set(meta.dependencies);
  const declaredRegistry = new Set(meta.registryDependencies);

  for (const entry of external) {
    const pkg = packageNameOf(entry.specifier);

    if (BUILTIN_IMPORTS.has(pkg) || declared.has(pkg)) continue;

    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: fileName,
      line: entry.line,
      message: `imports "${pkg}" but the registry item does not declare it in dependencies.`,
    });
  }

  for (const entry of internal) {
    const name = itemNameOf(entry.specifier);

    if (SUPPORT_MODULES.has(name)) continue;

    if (declaredRegistry.has(`@kira-kit/${name}`)) continue;

    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: fileName,
      line: entry.line,
      message: `imports "@kira-kit/${name}" but the registry item does not declare it in registryDependencies.`,
    });
  }

  return findings;
}

function unusedDeclarations(
  fileName: string,
  meta: ItemMeta,
  external: LocatedImport[],
  internal: LocatedImport[],
): Finding[] {
  const findings: Finding[] = [];
  const imported = new Set(external.map((e) => packageNameOf(e.specifier)));

  const importedRegistry = new Set(
    internal.flatMap((e) => {
      const name = itemNameOf(e.specifier);

      return SUPPORT_MODULES.has(name) ? [] : [name];
    }),
  );

  for (const dep of meta.dependencies) {
    if (BUILTIN_IMPORTS.has(dep) || imported.has(dep)) continue;

    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: fileName,
      message: `declares dependency "${dep}" but no file of this item imports it.`,
    });
  }

  for (const dep of meta.registryDependencies) {
    const name = dep.replace("@kira-kit/", "");

    if (importedRegistry.has(name)) continue;

    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: fileName,
      message: `declares registry dependency "${dep}" but no file of this item imports it.`,
    });
  }

  return findings;
}

/**
 * Check 1: imports vs declared dependencies — bidirectional.
 * Every bare npm import must be declared in the item's `dependencies`
 * (or be a React builtin), every internal import must be declared as
 * `@kira-kit/<name>`, and every declared dependency must actually be used.
 */
export const importsMatchDeps: Check = (file, ctx) => {
  const meta = ctx.items.get(file.name);

  if (!meta) return [];

  const { external, internal } = extractImports(file.content, file.path);

  return [
    ...undeclaredImports(file.name, meta, external, internal),
    ...unusedDeclarations(file.name, meta, external, internal),
  ];
};
