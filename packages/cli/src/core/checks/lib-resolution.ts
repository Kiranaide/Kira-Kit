import { dirname, join, normalize } from "node:path/posix";
import { libItemNameFor } from "../registry/lib-items";
import { getImports, type Check, type Finding } from "./types";

/**
 * Check 13: registry:lib integrity. Lib files must not depend on ui/hook
 * items (layering), relative imports must stay inside the item's own files,
 * and every mapped lib import must reference an item that exists.
 */
export const libResolution: Check = (file, ctx) => {
  if (!file.name.startsWith("lib/")) return [];

  const meta = ctx.items.get(file.name);

  if (!meta) return [];

  const findings: Finding[] = [];
  const { internal, lib, relative } = getImports(file);

  for (const entry of internal) {
    findings.push({
      checkId: "lib-resolution",
      severity: "error",
      file: file.name,
      line: entry.line,
      message: `lib module imports "${entry.specifier}" — lib items must not depend on ui/hook registry items.`,
    });
  }

  const ownFiles = new Set(
    meta.files.map((path) => path.replace(/\.(tsx|ts)$/, "")),
  );

  const moduleDir = dirname(file.name.slice("lib/".length));

  for (const entry of relative) {
    const resolved = normalize(join(moduleDir, entry.specifier)).replace(
      /\.(tsx|ts)$/,
      "",
    );

    if (ownFiles.has(resolved)) continue;

    findings.push({
      checkId: "lib-resolution",
      severity: "error",
      file: file.name,
      line: entry.line,
      message: `relative import "${entry.specifier}" resolves outside the files shipped by this lib item.`,
    });
  }

  for (const entry of lib) {
    const item = libItemNameFor(entry.specifier);

    if (!item || ctx.items.has(item)) continue;

    findings.push({
      checkId: "lib-resolution",
      severity: "error",
      file: file.name,
      line: entry.line,
      message: `lib import "${entry.specifier}" maps to "${item}", which is not a registered item.`,
    });
  }

  return findings;
};
