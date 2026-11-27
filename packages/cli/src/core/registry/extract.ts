import ts from "typescript";

export interface LocatedImport {
  specifier: string;
  line: number;
}

export interface ExtractedImports {
  /** Bare npm specifiers, e.g. "zod", "@base-ui/react/menu", "pkg/sub". */
  external: LocatedImport[];
  /** Internal registry deps as kebab item names, e.g. "@/components/ui/button" -> "button". */
  internal: LocatedImport[];
  /** "@/lib/*" specifiers, shipped as registry:lib items (see lib-items.ts). */
  lib: LocatedImport[];
  /** Relative specifiers, e.g. "./types" — resolved within an item's files. */
  relative: LocatedImport[];
}

/**
 * Parse a TS/TSX module with the TypeScript compiler API and extract imports.
 * Handles `import "pkg"`, `import type`, dynamic `import()`, `export … from`,
 * and scoped/deep subpaths. `node:*` builtins are exempt. Reusable by check 1.
 */
export function extractImports(
  source: string,
  fileName = "file.tsx",
): ExtractedImports {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.TSX,
  );

  const external = new Map<string, LocatedImport>();
  const internal = new Map<string, LocatedImport>();
  const lib = new Map<string, LocatedImport>();
  const relative = new Map<string, LocatedImport>();
  const buckets = { external, internal, lib, relative };

  const lineOf = (node: ts.Node): number =>
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line +
    1;

  const add = (
    target: Map<string, LocatedImport>,
    specifier: string,
    node: ts.Node,
    key: string,
  ): void => {
    const line = lineOf(node);
    const existing = target.get(key);

    if (!existing || line < existing.line) {
      target.set(key, { specifier, line });
    }
  };

  const visit = (node: ts.Node): void => {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const key = classify(node.moduleSpecifier.text, buckets, node, add);

      void key;
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier !== undefined &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      classify(node.moduleSpecifier.text, buckets, node, add);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      // SAFETY: node.arguments[0] is guarded by ts.isStringLiteral in the
      // branch condition immediately above, so the cast only refines the
      // element type TS widened to Expression.
      classify(
        (node.arguments[0] as ts.StringLiteral).text,
        buckets,
        node,
        add,
      );
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return {
    external: [...external.values()].sort((a, b) => a.line - b.line),
    internal: [...internal.values()].sort((a, b) => a.line - b.line),
    lib: [...lib.values()].sort((a, b) => a.line - b.line),
    relative: [...relative.values()].sort((a, b) => a.line - b.line),
  };
}

interface ImportBuckets {
  external: Map<string, LocatedImport>;
  internal: Map<string, LocatedImport>;
  lib: Map<string, LocatedImport>;
  relative: Map<string, LocatedImport>;
}

function classify(
  specifier: string,
  buckets: ImportBuckets,
  node: ts.Node,
  add: (
    target: Map<string, LocatedImport>,
    specifier: string,
    node: ts.Node,
    key: string,
  ) => void,
): string {
  if (specifier.startsWith("node:")) return "";

  if (specifier.startsWith(".")) {
    add(buckets.relative, specifier, node, specifier);

    return "";
  }

  if (!specifier.startsWith("@/")) {
    add(buckets.external, specifier, node, packageNameOf(specifier));

    return "";
  }

  classifyAlias(specifier, buckets, node, add);

  return "";
}

function classifyAlias(
  specifier: string,
  buckets: ImportBuckets,
  node: ts.Node,
  add: (
    target: Map<string, LocatedImport>,
    specifier: string,
    node: ts.Node,
    key: string,
  ) => void,
): void {
  if (specifier.startsWith("@/components/ui/")) {
    const name = specifier
      .replace("@/components/ui/", "")
      .replace(/\.(tsx|ts)$/, "");

    if (name && !name.includes("/"))
      add(buckets.internal, specifier, node, name);

    return;
  }

  if (specifier.startsWith("@/hooks/")) {
    const name = specifier.replace("@/hooks/", "").replace(/\.(tsx|ts)$/, "");

    if (name && !name.includes("/"))
      add(buckets.internal, specifier, node, name);

    return;
  }

  if (specifier.startsWith("@/lib/")) {
    const subpath = specifier.replace("@/lib/", "").replace(/\.(tsx|ts)$/, "");

    if (subpath) add(buckets.lib, specifier, node, subpath);
  }

  // Other internal aliases are not registry deps.
}

/** Trim deep subpaths and peer-style suffixes to the package name. */
export function packageNameOf(specifier: string): string {
  const parts = specifier.split("/");

  if (specifier.startsWith("@")) {
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }

  return parts[0];
}
