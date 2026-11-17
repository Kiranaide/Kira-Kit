import { extractImports, packageNameOf } from "../registry/extract";
import { BUILTIN_IMPORTS, type Check, type Finding } from "./types";

/** Support modules embedded as files rather than registry items. */
const SUPPORT_MODULES = new Set(["prop-guards", "content-keys"]);

/**
 * Check 1: imports vs declared dependencies — bidirectional.
 * Every bare npm import must be declared in the item's `dependencies`
 * (or be a React builtin), every internal import must be declared as
 * `@kira-kit/<name>`, and every declared dependency must actually be used.
 */
export const importsMatchDeps: Check = (file, ctx) => {
  const meta = ctx.items.get(file.name);
  const findings: Finding[] = [];
  if (!meta) return findings;

  const { external, internal } = extractImports(file.content, file.path);

  const declared = new Set(meta.dependencies);
  const declaredRegistry = new Set(meta.registryDependencies);

  for (const entry of external) {
    const pkg = packageNameOf(entry.specifier);
    if (BUILTIN_IMPORTS.has(pkg) || declared.has(pkg)) continue;
    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: file.name,
      line: entry.line,
      message: `imports "${pkg}" but the registry item does not declare it in dependencies.`,
    });
  }

  for (const entry of internal) {
    const name = entry.specifier
      .replace(/^@\/(components\/ui|hooks)\//, "")
      .replace(/\.(tsx|ts)$/, "");
    if (SUPPORT_MODULES.has(name)) continue;
    if (!declaredRegistry.has(`@kira-kit/${name}`)) {
      findings.push({
        checkId: "imports-deps",
        severity: "error",
        file: file.name,
        line: entry.line,
        message: `imports "@kira-kit/${name}" but the registry item does not declare it in registryDependencies.`,
      });
    }
  }

  const imported = new Set(external.map((e) => packageNameOf(e.specifier)));
  for (const dep of meta.dependencies) {
    if (BUILTIN_IMPORTS.has(dep) || imported.has(dep)) continue;
    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: file.name,
      message: `declares dependency "${dep}" but no file of this item imports it.`,
    });
  }

  const importedRegistry = new Set(
    internal
      .map((e) => e.specifier.replace(/^@\/(components\/ui|hooks)\//, "").replace(/\.(tsx|ts)$/, ""))
      .filter((name) => !SUPPORT_MODULES.has(name)),
  );
  for (const dep of meta.registryDependencies) {
    const name = dep.replace("@kira-kit/", "");
    if (importedRegistry.has(name)) continue;
    findings.push({
      checkId: "imports-deps",
      severity: "error",
      file: file.name,
      message: `declares registry dependency "${dep}" but no file of this item imports it.`,
    });
  }

  return findings;
};
