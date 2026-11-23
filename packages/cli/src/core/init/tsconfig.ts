import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import ts from "typescript";
import { readConsumerPackage } from "../install/deps";
import { findProperty, insertObjectProperty } from "./ast-patch";

export interface TsconfigUpdateResult {
  updatedFiles: string[];
  alreadyConfigured: boolean;
  aliasTarget: string;
}

export interface TextPatchResult {
  content: string;
  changed: boolean;
}

function rootObject(sf: ts.JsonSourceFile): ts.ObjectLiteralExpression | null {
  const first = sf.statements[0];

  if (!first || !ts.isExpressionStatement(first)) return null;

  return ts.isObjectLiteralExpression(first.expression)
    ? first.expression
    : null;
}

function insertIntoJsonObject(
  content: string,
  sf: ts.JsonSourceFile,
  obj: ts.ObjectLiteralExpression,
  entryLines: string[],
  fallbackIndent: string,
): string {
  return insertObjectProperty(content, sf, obj, entryLines, {
    fallbackIndent,
    trailingComma: false,
    allowInline: false,
  });
}

/**
 * Determine where `@/*` should map: `./src/*` when `src/` exists (or default),
 * `./*` for root `app/` projects (e.g. Next.js without `src/`).
 */
export function defaultAliasTarget(cwd: string): string {
  if (existsSync(join(cwd, "src"))) return "./src/*";

  if (existsSync(join(cwd, "app"))) return "./*";

  return "./src/*";
}

/** Check whether a tsconfig already resolves `@/*` (directly or via `extends`). */
function hasAtAliasResolved(filePath: string): boolean {
  const raw = ts.readConfigFile(filePath, ts.sys.readFile);

  if (raw.error) return false;

  const parsed = ts.parseJsonConfigFileContent(
    raw.config,
    ts.sys,
    dirname(filePath),
  );

  return Boolean(parsed.options.paths?.["@/*"]);
}

/**
 * Insert `"@/*": [target]` into a JSONC tsconfig string without adding
 * deprecated `baseUrl` (TypeScript 6.0+ compatible) and preserving comments.
 */
export function ensureTsconfigAliasText(
  content: string,
  target: string,
  fileName = "tsconfig.json",
): TextPatchResult {
  const sf = ts.parseJsonText(fileName, content);
  const root = rootObject(sf);

  if (!root) return { content, changed: false };

  const compilerOptionsProp = findProperty(root, "compilerOptions");

  if (!compilerOptionsProp) {
    const next = insertIntoJsonObject(
      content,
      sf,
      root,
      [
        '"compilerOptions": {',
        '  "paths": {',
        `    "@/*": ["${target}"]`,
        "  }",
        "}",
      ],
      "  ",
    );

    return { content: next, changed: true };
  }

  if (!ts.isObjectLiteralExpression(compilerOptionsProp.initializer)) {
    return { content, changed: false };
  }

  const compilerOptions = compilerOptionsProp.initializer;
  const pathsProp = findProperty(compilerOptions, "paths");

  if (!pathsProp) {
    const next = insertIntoJsonObject(
      content,
      sf,
      compilerOptions,
      ['"paths": {', `  "@/*": ["${target}"]`, "}"],
      "  ",
    );

    return { content: next, changed: true };
  }

  if (!ts.isObjectLiteralExpression(pathsProp.initializer)) {
    return { content, changed: false };
  }

  if (findProperty(pathsProp.initializer, "@/*")) {
    return { content, changed: false };
  }

  const next = insertIntoJsonObject(
    content,
    sf,
    pathsProp.initializer,
    [`"@/*": ["${target}"]`],
    "  ",
  );

  return { content: next, changed: true };
}

function usesTypeScript(cwd: string): boolean {
  const pkg = readConsumerPackage(cwd);

  return Boolean(
    pkg.dependencies?.typescript ||
    pkg.devDependencies?.typescript ||
    existsSync(join(cwd, "tsconfig.json")) ||
    existsSync(join(cwd, "tsconfig.app.json")),
  );
}

/**
 * Ensure `@/*` path mapping is configured in the project's tsconfig file(s).
 * Handles Vite's split `tsconfig.json` + `tsconfig.app.json` layout and omits
 * `baseUrl` to stay clean under TypeScript 6.0+.
 */
export function configureTsconfigPaths(cwd: string): TsconfigUpdateResult {
  const aliasTarget = defaultAliasTarget(cwd);
  const updatedFiles: string[] = [];

  if (!usesTypeScript(cwd)) {
    return { updatedFiles, alreadyConfigured: false, aliasTarget };
  }

  const rootPath = join(cwd, "tsconfig.json");
  const appPath = join(cwd, "tsconfig.app.json");

  if (!existsSync(rootPath) && !existsSync(appPath)) {
    const fresh = {
      compilerOptions: {
        paths: {
          "@/*": [aliasTarget],
        },
      },
    };

    writeFileSync(rootPath, JSON.stringify(fresh, null, 2) + "\n", "utf-8");
    updatedFiles.push("tsconfig.json");

    return { updatedFiles, alreadyConfigured: false, aliasTarget };
  }

  const targets = ["tsconfig.json", "tsconfig.app.json"].filter((rel) =>
    existsSync(join(cwd, rel)),
  );

  let alreadyConfigured = true;

  for (const rel of targets) {
    const fullPath = join(cwd, rel);

    if (hasAtAliasResolved(fullPath)) continue;

    alreadyConfigured = false;

    const current = readFileSync(fullPath, "utf-8");
    const result = ensureTsconfigAliasText(current, aliasTarget, rel);

    if (result.changed) {
      writeFileSync(fullPath, result.content, "utf-8");
      updatedFiles.push(rel);
    }
  }

  return {
    updatedFiles,
    alreadyConfigured: alreadyConfigured && updatedFiles.length === 0,
    aliasTarget,
  };
}
