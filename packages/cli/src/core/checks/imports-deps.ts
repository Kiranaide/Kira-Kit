import {
  extractImports,
  packageNameOf,
  type LocatedImport,
} from "../registry/extract";
import { libItemNameFor } from "../registry/lib-items";
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

/** A lib file importing a module shipped by its own item is not a dep. */
function isSelfLibImport(fileName: string, item: string): boolean {
  return (
    fileName.startsWith("lib/") &&
    libItemNameFor(fileName.slice("lib/".length)) === item
  );
}

function undeclaredLibImports(
  fileName: string,
  declaredRegistry: Set<string>,
  lib: LocatedImport[],
): Finding[] {
  const findings: Finding[] = [];

  for (const entry of lib) {
    const item = libItemNameFor(entry.specifier);

    if (!item) {
      findings.push({
        checkId: "imports-deps",
        severity: "error",
        file: fileName,
        line: entry.line,
        message: `imports "${entry.specifier}" but no registry:lib item ships this module (see lib-items.ts).`,
      });

      continue;
    }

    if (isSelfLibImport(fileName, item)) continue;

    if (declaredRegistry.has(`@kira-kit/${item}`)) continue;

    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: fileName,
      line: entry.line,
      message: `imports "${entry.specifier}" but the registry item does not declare "@kira-kit/${item}" in registryDependencies.`,
    });
  }

  return findings;
}

function undeclaredImports(
  fileName: string,
  meta: ItemMeta,
  external: LocatedImport[],
  internal: LocatedImport[],
  lib: LocatedImport[],
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

  return [
    ...findings,
    ...undeclaredLibImports(fileName, declaredRegistry, lib),
  ];
}

function unusedDeclarations(
  fileName: string,
  meta: ItemMeta,
  external: LocatedImport[],
  internal: LocatedImport[],
  lib: LocatedImport[],
): Finding[] {
  const findings: Finding[] = [];
  const imported = new Set(external.map((e) => packageNameOf(e.specifier)));

  const importedRegistry = new Set([
    ...internal.flatMap((e) => {
      const name = itemNameOf(e.specifier);

      return SUPPORT_MODULES.has(name) ? [] : [name];
    }),
    ...lib.flatMap((e) => {
      const item = libItemNameFor(e.specifier);

      return item ? [item] : [];
    }),
  ]);

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
 * `@kira-kit/<name>`, every `@/lib/*` import must map to a declared
 * registry:lib item, and every declared dependency must actually be used.
 */
export const importsMatchDeps: Check = (file, ctx) => {
  const meta = ctx.items.get(file.name);

  if (!meta) return [];

  const { external, internal, lib } = extractImports(file.content, file.path);

  // Consumers on lucide still declare tabler in registry metadata; normalize
  // so both check directions compare against the canonical dependency list.
  const normalized =
    ctx.iconLibrary === "lucide"
      ? external.map((entry) =>
          packageNameOf(entry.specifier) === "lucide-react"
            ? {
                ...entry,
                specifier: entry.specifier.replace(
                  /^lucide-react/,
                  "@tabler/icons-react",
                ),
              }
            : entry,
        )
      : external;

  return [
    ...undeclaredImports(file.name, meta, normalized, internal, lib),
    ...unusedDeclarations(file.name, meta, normalized, internal, lib),
  ];
};
