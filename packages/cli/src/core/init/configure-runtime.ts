import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import type { DetectedRuntime } from "./detect-runtime";
import { defaultAliasTarget, type TextPatchResult } from "./tsconfig";

export interface RuntimeConfigResult {
  /** Files created or updated. */
  updatedFiles: string[];
  /** Human-readable summary notes for actions taken. */
  notes: string[];
  /** Warnings when a config file could not be safely auto-edited. */
  warnings: string[];
}

export interface ConfigPatchResult {
  content: string;
  changed: boolean;
  notes: string[];
  warnings: string[];
}

export interface VitePatchOptions {
  viteMajor: number | null;
  aliasDir: string;
}

function detectEol(content: string): string {
  return content.includes("\r\n") ? "\r\n" : "\n";
}

function lineIndentAt(content: string, pos: number): string {
  const lineStart = content.lastIndexOf("\n", pos - 1) + 1;
  const line = content.slice(lineStart, pos);
  const match = line.match(/^([ \t]*)/);

  return match ? match[1] : "";
}

function isCjsFile(fileName: string): boolean {
  return /\.(cjs|cts)$/i.test(fileName);
}

function parseSource(fileName: string, content: string): ts.SourceFile {
  return ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true);
}

function isRequireCall(
  expr: ts.Expression | undefined,
  specifier: string,
): boolean {
  if (!expr || !ts.isCallExpression(expr)) return false;

  if (!ts.isIdentifier(expr.expression) || expr.expression.text !== "require") {
    return false;
  }

  const firstArg = expr.arguments[0];

  return (
    expr.arguments.length === 1 &&
    ts.isStringLiteral(firstArg) &&
    firstArg.text === specifier
  );
}

function statementRequires(stmt: ts.Statement, specifier: string): boolean {
  if (!ts.isVariableStatement(stmt)) return false;

  return stmt.declarationList.declarations.some((decl) =>
    isRequireCall(decl.initializer, specifier),
  );
}

function hasImportFrom(sf: ts.SourceFile, specifier: string): boolean {
  return sf.statements.some((stmt) => {
    if (
      ts.isImportDeclaration(stmt) &&
      ts.isStringLiteral(stmt.moduleSpecifier) &&
      stmt.moduleSpecifier.text === specifier
    ) {
      return true;
    }

    return statementRequires(stmt, specifier);
  });
}

function insertImportLine(
  content: string,
  sf: ts.SourceFile,
  importLine: string,
): string {
  const eol = detectEol(content);
  let lastImportEnd: number | null = null;

  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt)) {
      lastImportEnd = stmt.getEnd();
    }
  }

  if (lastImportEnd !== null) {
    return (
      content.slice(0, lastImportEnd) +
      eol +
      importLine +
      content.slice(lastImportEnd)
    );
  }

  const trimmed = content.trimStart();

  if (trimmed.startsWith("//") || trimmed.startsWith("/*")) {
    const firstNewline = content.indexOf("\n");

    if (firstNewline >= 0) {
      return (
        content.slice(0, firstNewline + 1) +
        importLine +
        eol +
        content.slice(firstNewline + 1)
      );
    }
  }

  return `${importLine}${eol}${content}`;
}

function unwrapExpression(expr: ts.Expression): ts.Expression {
  let current = expr;

  while (true) {
    if (ts.isParenthesizedExpression(current)) {
      current = current.expression;
    } else if (
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current)
    ) {
      current = current.expression;
    } else {
      return current;
    }
  }
}

function extractObjectFromFunction(
  fn: ts.ArrowFunction | ts.FunctionExpression,
): ts.ObjectLiteralExpression | null {
  if (!ts.isBlock(fn.body)) {
    const body = unwrapExpression(fn.body);

    return ts.isObjectLiteralExpression(body) ? body : null;
  }

  for (const stmt of fn.body.statements) {
    if (ts.isReturnStatement(stmt) && stmt.expression) {
      const returned = unwrapExpression(stmt.expression);

      if (ts.isObjectLiteralExpression(returned)) return returned;
    }
  }

  return null;
}

function findVariableInitializer(
  sf: ts.SourceFile,
  targetName: string,
): ts.Expression | null {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;

    const match = stmt.declarationList.declarations.find(
      (decl) => ts.isIdentifier(decl.name) && decl.name.text === targetName,
    );

    if (match?.initializer) return match.initializer;
  }

  return null;
}

function resolveToObjectLiteral(
  expr: ts.Expression,
  sf: ts.SourceFile,
): ts.ObjectLiteralExpression | null {
  const unwrapped = unwrapExpression(expr);

  if (ts.isObjectLiteralExpression(unwrapped)) return unwrapped;

  if (ts.isArrowFunction(unwrapped) || ts.isFunctionExpression(unwrapped)) {
    return extractObjectFromFunction(unwrapped);
  }

  if (ts.isCallExpression(unwrapped) && unwrapped.arguments.length > 0) {
    return resolveToObjectLiteral(unwrapped.arguments[0], sf);
  }

  if (ts.isIdentifier(unwrapped)) {
    const init = findVariableInitializer(sf, unwrapped.text);

    return init ? resolveToObjectLiteral(init, sf) : null;
  }

  return null;
}

function findExportedConfigObject(
  sf: ts.SourceFile,
): ts.ObjectLiteralExpression | null {
  for (const stmt of sf.statements) {
    if (ts.isExportAssignment(stmt)) {
      return resolveToObjectLiteral(stmt.expression, sf);
    }

    if (
      ts.isExpressionStatement(stmt) &&
      ts.isBinaryExpression(stmt.expression) &&
      stmt.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      stmt.expression.left.getText(sf) === "module.exports"
    ) {
      return resolveToObjectLiteral(stmt.expression.right, sf);
    }
  }

  return null;
}

function getPropertyKey(prop: ts.ObjectLiteralElementLike): string | null {
  if (!ts.isPropertyAssignment(prop)) return null;

  if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
    return prop.name.text;
  }

  return null;
}

function findProp(
  obj: ts.ObjectLiteralExpression,
  name: string,
): ts.PropertyAssignment | null {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && getPropertyKey(prop) === name) {
      return prop;
    }
  }

  return null;
}

function insertObjectProperty(
  content: string,
  sf: ts.SourceFile,
  obj: ts.ObjectLiteralExpression,
  propLines: string[],
): string {
  const eol = detectEol(content);
  const objStart = obj.getStart(sf);
  const objEnd = obj.getEnd();
  const objIndent = lineIndentAt(content, objStart);

  if (obj.properties.length === 0) {
    const inner = objIndent + "  ";
    const body = propLines.map((line) => `${inner}${line}`).join(eol);

    return `${content.slice(0, objStart)}{${eol}${body},${eol}${objIndent}}${content.slice(objEnd)}`;
  }

  const last = obj.properties[obj.properties.length - 1];
  const lastEnd = last.getEnd();
  const multiLine = content.slice(objStart, objEnd).includes("\n");
  const between = content.slice(lastEnd, objEnd - 1);
  const commaOffset = between.indexOf(",");
  const insertAt = commaOffset >= 0 ? lastEnd + commaOffset + 1 : lastEnd;
  const needsComma = commaOffset < 0;

  if (!multiLine) {
    const inline = propLines.join(" ").replace(/\s+/g, " ");

    return (
      content.slice(0, insertAt) +
      (needsComma ? ", " : " ") +
      inline +
      content.slice(insertAt)
    );
  }

  const propIndent =
    lineIndentAt(content, last.getStart(sf)) || objIndent + "  ";

  const body = propLines.map((line) => `${propIndent}${line}`).join(eol);
  const trailingComma = commaOffset >= 0 ? "," : "";

  return (
    content.slice(0, insertAt) +
    (needsComma ? "," : "") +
    eol +
    body +
    trailingComma +
    content.slice(insertAt)
  );
}

function appendArrayElement(
  content: string,
  sf: ts.SourceFile,
  arr: ts.ArrayLiteralExpression,
  elementText: string,
): string {
  const eol = detectEol(content);
  const arrStart = arr.getStart(sf);
  const arrEnd = arr.getEnd();

  if (arr.elements.length === 0) {
    return `${content.slice(0, arrStart)}[${elementText}]${content.slice(arrEnd)}`;
  }

  const last = arr.elements[arr.elements.length - 1];
  const lastEnd = last.getEnd();
  const multiLine = content.slice(arrStart, arrEnd).includes("\n");
  const between = content.slice(lastEnd, arrEnd - 1);
  const commaOffset = between.indexOf(",");
  const insertAt = commaOffset >= 0 ? lastEnd + commaOffset + 1 : lastEnd;
  const needsComma = commaOffset < 0;

  if (!multiLine) {
    return (
      content.slice(0, insertAt) +
      (needsComma ? ", " : " ") +
      elementText +
      content.slice(insertAt)
    );
  }

  const elemIndent =
    lineIndentAt(content, last.getStart(sf)) ||
    lineIndentAt(content, arrStart) + "  ";

  const trailingComma = commaOffset >= 0 ? "," : "";

  return (
    content.slice(0, insertAt) +
    (needsComma ? "," : "") +
    eol +
    elemIndent +
    elementText +
    trailingComma +
    content.slice(insertAt)
  );
}

function arrayContainsCall(
  arr: ts.ArrayLiteralExpression,
  sf: ts.SourceFile,
  calleeName: string,
): boolean {
  return arr.elements.some((el) => el.getText(sf).includes(`${calleeName}(`));
}

function resolveHasAliasOrTsconfigPaths(
  obj: ts.ObjectLiteralExpression,
  sf: ts.SourceFile,
): boolean {
  const pluginsProp = findProp(obj, "plugins");

  if (
    pluginsProp &&
    ts.isArrayLiteralExpression(pluginsProp.initializer) &&
    arrayContainsCall(pluginsProp.initializer, sf, "tsconfigPaths")
  ) {
    return true;
  }

  const resolveProp = findProp(obj, "resolve");

  if (!resolveProp || !ts.isObjectLiteralExpression(resolveProp.initializer)) {
    return false;
  }

  const resolveObj = resolveProp.initializer;

  if (findProp(resolveObj, "tsconfigPaths")) return true;

  const aliasProp = findProp(resolveObj, "alias");

  if (!aliasProp) return false;

  if (ts.isObjectLiteralExpression(aliasProp.initializer)) {
    return Boolean(findProp(aliasProp.initializer, "@"));
  }

  if (ts.isArrayLiteralExpression(aliasProp.initializer)) {
    return aliasProp.initializer.elements.some((el) =>
      /["']@["']/.test(el.getText(sf)),
    );
  }

  return false;
}

function aliasRelativeDir(cwd: string): string {
  const target = defaultAliasTarget(cwd);

  return target === "./*" ? "." : "./src";
}

function createFreshViteConfig(cwd: string, viteMajor: number | null): string {
  const useNativeTsconfigPaths = viteMajor !== null && viteMajor >= 8;

  if (useNativeTsconfigPaths) {
    return `import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
});
`;
  }

  const dir = aliasRelativeDir(cwd);

  return `import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("${dir}", import.meta.url)),
    },
  },
});
`;
}

function patchViteTailwindPlugin(
  content: string,
  fileName: string,
  notes: string[],
  warnings: string[],
): string {
  let next = content;
  let sf = parseSource(fileName, next);

  if (!hasImportFrom(sf, "@tailwindcss/vite")) {
    const importLine = isCjsFile(fileName)
      ? 'const tailwindcss = require("@tailwindcss/vite");'
      : 'import tailwindcss from "@tailwindcss/vite";';

    next = insertImportLine(next, sf, importLine);
    sf = parseSource(fileName, next);
  }

  const configObj = findExportedConfigObject(sf);

  if (!configObj) return next;

  const pluginsProp = findProp(configObj, "plugins");

  if (!pluginsProp) {
    notes.push(`Added @tailwindcss/vite plugin to ${fileName}.`);

    return insertObjectProperty(next, sf, configObj, [
      "plugins: [tailwindcss()]",
    ]);
  }

  if (!ts.isArrayLiteralExpression(pluginsProp.initializer)) {
    warnings.push(
      `Could not update non-array plugins property in ${fileName} — add tailwindcss() manually.`,
    );

    return next;
  }

  if (!arrayContainsCall(pluginsProp.initializer, sf, "tailwindcss")) {
    notes.push(`Added @tailwindcss/vite plugin to ${fileName}.`);

    return appendArrayElement(
      next,
      sf,
      pluginsProp.initializer,
      "tailwindcss()",
    );
  }

  return next;
}

function ensureAliasHelperImport(
  content: string,
  fileName: string,
): string {
  const sf = parseSource(fileName, content);

  if (isCjsFile(fileName)) {
    if (hasImportFrom(sf, "node:path") || hasImportFrom(sf, "path")) {
      return content;
    }

    return insertImportLine(content, sf, 'const path = require("node:path");');
  }

  if (hasImportFrom(sf, "node:url") || hasImportFrom(sf, "url")) {
    return content;
  }

  return insertImportLine(
    content,
    sf,
    'import { fileURLToPath, URL } from "node:url";',
  );
}

function insertViteAliasProperty(
  content: string,
  sf: ts.SourceFile,
  configObj: ts.ObjectLiteralExpression,
  aliasExpr: string,
): string {
  const resolveProp = findProp(configObj, "resolve");

  if (!resolveProp) {
    return insertObjectProperty(content, sf, configObj, [
      "resolve: {",
      "  alias: {",
      `    "@": ${aliasExpr},`,
      "  },",
      "}",
    ]);
  }

  if (!ts.isObjectLiteralExpression(resolveProp.initializer)) return content;

  const aliasProp = findProp(resolveProp.initializer, "alias");

  if (!aliasProp) {
    return insertObjectProperty(content, sf, resolveProp.initializer, [
      "alias: {",
      `  "@": ${aliasExpr},`,
      "}",
    ]);
  }

  if (ts.isObjectLiteralExpression(aliasProp.initializer)) {
    return insertObjectProperty(content, sf, aliasProp.initializer, [
      `"@": ${aliasExpr}`,
    ]);
  }

  return content;
}

function patchViteResolve(
  content: string,
  fileName: string,
  options: VitePatchOptions,
  notes: string[],
): string {
  const sf = parseSource(fileName, content);
  const configObj = findExportedConfigObject(sf);

  if (!configObj || resolveHasAliasOrTsconfigPaths(configObj, sf)) {
    return content;
  }

  if (options.viteMajor !== null && options.viteMajor >= 8) {
    const resolveProp = findProp(configObj, "resolve");

    notes.push(
      `Enabled native resolve.tsconfigPaths in ${fileName} (Vite ${options.viteMajor}).`,
    );

    if (resolveProp && ts.isObjectLiteralExpression(resolveProp.initializer)) {
      return insertObjectProperty(content, sf, resolveProp.initializer, [
        "tsconfigPaths: true",
      ]);
    }

    return insertObjectProperty(content, sf, configObj, [
      "resolve: {",
      "  tsconfigPaths: true,",
      "}",
    ]);
  }

  const withImport = ensureAliasHelperImport(content, fileName);
  const updatedSf = parseSource(fileName, withImport);
  const updatedObj = findExportedConfigObject(updatedSf);

  if (!updatedObj) return withImport;

  const aliasExpr = isCjsFile(fileName)
    ? `path.resolve(__dirname, "${options.aliasDir}")`
    : `fileURLToPath(new URL("${options.aliasDir}", import.meta.url))`;

  notes.push(
    `Configured resolve.alias "@" -> "${options.aliasDir}" in ${fileName}.`,
  );

  return insertViteAliasProperty(withImport, updatedSf, updatedObj, aliasExpr);
}

export function patchViteConfigText(
  content: string,
  fileName: string,
  options: VitePatchOptions,
): ConfigPatchResult {
  const notes: string[] = [];
  const warnings: string[] = [];
  const initialSf = parseSource(fileName, content);

  if (!findExportedConfigObject(initialSf)) {
    warnings.push(
      `Could not statically locate the exported config object in ${fileName} — add @tailwindcss/vite and resolve config manually.`,
    );

    return { content, changed: false, notes, warnings };
  }

  const withPlugin = patchViteTailwindPlugin(
    content,
    fileName,
    notes,
    warnings,
  );

  const next = patchViteResolve(withPlugin, fileName, options, notes);

  return { content: next, changed: next !== content, notes, warnings };
}

export function patchAstroConfigText(
  content: string,
  fileName: string,
): ConfigPatchResult {
  let next = content;
  const notes: string[] = [];
  const warnings: string[] = [];
  let sf = parseSource(fileName, next);
  let configObj = findExportedConfigObject(sf);

  if (!configObj) {
    warnings.push(
      `Could not statically locate the exported config object in ${fileName} — add @tailwindcss/vite under vite.plugins manually.`,
    );

    return { content: next, changed: false, notes, warnings };
  }

  if (!hasImportFrom(sf, "@tailwindcss/vite")) {
    next = insertImportLine(
      next,
      sf,
      'import tailwindcss from "@tailwindcss/vite";',
    );
    sf = parseSource(fileName, next);
    configObj = findExportedConfigObject(sf);
  }

  if (!configObj) {
    return { content: next, changed: next !== content, notes, warnings };
  }

  const viteProp = findProp(configObj, "vite");

  if (!viteProp) {
    next = insertObjectProperty(next, sf, configObj, [
      "vite: {",
      "  plugins: [tailwindcss()],",
      "}",
    ]);
    notes.push(`Added @tailwindcss/vite under vite.plugins in ${fileName}.`);
  } else if (ts.isObjectLiteralExpression(viteProp.initializer)) {
    const pluginsProp = findProp(viteProp.initializer, "plugins");

    if (!pluginsProp) {
      next = insertObjectProperty(next, sf, viteProp.initializer, [
        "plugins: [tailwindcss()]",
      ]);
      notes.push(`Added @tailwindcss/vite under vite.plugins in ${fileName}.`);
    } else if (
      ts.isArrayLiteralExpression(pluginsProp.initializer) &&
      !arrayContainsCall(pluginsProp.initializer, sf, "tailwindcss")
    ) {
      next = appendArrayElement(
        next,
        sf,
        pluginsProp.initializer,
        "tailwindcss()",
      );
      notes.push(`Added @tailwindcss/vite under vite.plugins in ${fileName}.`);
    }
  }

  return { content: next, changed: next !== content, notes, warnings };
}

const FRESH_POSTCSS_CONFIG = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;

export function patchPostcssConfigText(
  content: string,
  fileName: string,
): ConfigPatchResult {
  if (content.includes("@tailwindcss/postcss")) {
    return { content, changed: false, notes: [], warnings: [] };
  }

  const sf = parseSource(fileName, content);
  const configObj = findExportedConfigObject(sf);

  if (!configObj) {
    return {
      content,
      changed: false,
      notes: [],
      warnings: [
        `Could not statically patch ${fileName} — add "@tailwindcss/postcss": {} to your PostCSS plugins manually.`,
      ],
    };
  }

  const pluginsProp = findProp(configObj, "plugins");

  if (!pluginsProp) {
    const next = insertObjectProperty(content, sf, configObj, [
      "plugins: {",
      '  "@tailwindcss/postcss": {},',
      "}",
    ]);

    return {
      content: next,
      changed: true,
      notes: [`Added "@tailwindcss/postcss" to ${fileName}.`],
      warnings: [],
    };
  }

  if (ts.isObjectLiteralExpression(pluginsProp.initializer)) {
    const next = insertObjectProperty(content, sf, pluginsProp.initializer, [
      '"@tailwindcss/postcss": {}',
    ]);

    return {
      content: next,
      changed: true,
      notes: [`Added "@tailwindcss/postcss" to ${fileName}.`],
      warnings: [],
    };
  }

  if (ts.isArrayLiteralExpression(pluginsProp.initializer)) {
    const next = appendArrayElement(
      content,
      sf,
      pluginsProp.initializer,
      '"@tailwindcss/postcss"',
    );

    return {
      content: next,
      changed: true,
      notes: [`Added "@tailwindcss/postcss" to ${fileName}.`],
      warnings: [],
    };
  }

  return {
    content,
    changed: false,
    notes: [],
    warnings: [
      `Could not update plugins in ${fileName} — add "@tailwindcss/postcss" manually.`,
    ],
  };
}

function bunfigSeparator(content: string, eol: string): string {
  if (content.length === 0) return "";

  return content.endsWith("\n") ? eol : `${eol}${eol}`;
}

export function patchBunfigText(content: string): TextPatchResult {
  if (content.includes("bun-plugin-tailwind")) {
    return { content, changed: false };
  }

  const eol = detectEol(content);
  const sectionMatch = content.match(/^\[serve\.static\]\s*$/m);

  if (!sectionMatch || sectionMatch.index === undefined) {
    const separator = bunfigSeparator(content, eol);

    return {
      content: `${content}${separator}[serve.static]${eol}plugins = ["bun-plugin-tailwind"]${eol}`,
      changed: true,
    };
  }

  const afterHeader = sectionMatch.index + sectionMatch[0].length;
  const rest = content.slice(afterHeader);
  const nextSection = rest.search(/^\[/m);
  const sectionBody = nextSection >= 0 ? rest.slice(0, nextSection) : rest;
  const pluginsMatch = sectionBody.match(/^(\s*plugins\s*=\s*\[)([^\]]*)(\])/m);

  if (pluginsMatch && pluginsMatch.index !== undefined) {
    const inner = pluginsMatch[2].trim();

    const updated =
      inner.length === 0
        ? `${pluginsMatch[1]}"bun-plugin-tailwind"${pluginsMatch[3]}`
        : `${pluginsMatch[1]}${inner}, "bun-plugin-tailwind"${pluginsMatch[3]}`;

    const start = afterHeader + pluginsMatch.index;
    const end = start + pluginsMatch[0].length;

    return {
      content: content.slice(0, start) + updated + content.slice(end),
      changed: true,
    };
  }

  return {
    content:
      content.slice(0, afterHeader) +
      `${eol}plugins = ["bun-plugin-tailwind"]` +
      content.slice(afterHeader),
    changed: true,
  };
}

function configurePostcss(cwd: string): RuntimeConfigResult {
  const candidates = [
    "postcss.config.mjs",
    "postcss.config.js",
    "postcss.config.cjs",
    "postcss.config.ts",
  ];

  const existing = candidates.find((rel) => existsSync(join(cwd, rel)));

  if (!existing) {
    writeFileSync(
      join(cwd, "postcss.config.mjs"),
      FRESH_POSTCSS_CONFIG,
      "utf-8",
    );

    return {
      updatedFiles: ["postcss.config.mjs"],
      notes: ["Created postcss.config.mjs with @tailwindcss/postcss."],
      warnings: [],
    };
  }

  const fullPath = join(cwd, existing);
  const current = readFileSync(fullPath, "utf-8");
  const patched = patchPostcssConfigText(current, existing);

  if (patched.changed) {
    writeFileSync(fullPath, patched.content, "utf-8");
  }

  return {
    updatedFiles: patched.changed ? [existing] : [],
    notes: patched.notes,
    warnings: patched.warnings,
  };
}

function configureVite(
  cwd: string,
  runtime: DetectedRuntime,
): RuntimeConfigResult {
  if (!runtime.configFile) {
    const fresh = createFreshViteConfig(cwd, runtime.viteMajor);

    writeFileSync(join(cwd, "vite.config.ts"), fresh, "utf-8");

    return {
      updatedFiles: ["vite.config.ts"],
      notes: [
        "Created vite.config.ts with @tailwindcss/vite and path resolution.",
      ],
      warnings: [],
    };
  }

  const fullPath = join(cwd, runtime.configFile);
  const current = readFileSync(fullPath, "utf-8");

  const patched = patchViteConfigText(current, runtime.configFile, {
    viteMajor: runtime.viteMajor,
    aliasDir: aliasRelativeDir(cwd),
  });

  if (patched.changed) {
    writeFileSync(fullPath, patched.content, "utf-8");
  }

  return {
    updatedFiles: patched.changed ? [runtime.configFile] : [],
    notes: patched.notes,
    warnings: patched.warnings,
  };
}

function configureAstro(
  cwd: string,
  runtime: DetectedRuntime,
): RuntimeConfigResult {
  if (!runtime.configFile) {
    const fresh = `import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
`;

    writeFileSync(join(cwd, "astro.config.mjs"), fresh, "utf-8");

    return {
      updatedFiles: ["astro.config.mjs"],
      notes: ["Created astro.config.mjs with @tailwindcss/vite."],
      warnings: [],
    };
  }

  const fullPath = join(cwd, runtime.configFile);
  const current = readFileSync(fullPath, "utf-8");
  const patched = patchAstroConfigText(current, runtime.configFile);

  if (patched.changed) {
    writeFileSync(fullPath, patched.content, "utf-8");
  }

  return {
    updatedFiles: patched.changed ? [runtime.configFile] : [],
    notes: patched.notes,
    warnings: patched.warnings,
  };
}

function configureBun(cwd: string): RuntimeConfigResult {
  const fullPath = join(cwd, "bunfig.toml");

  if (!existsSync(fullPath)) {
    writeFileSync(
      fullPath,
      '[serve.static]\nplugins = ["bun-plugin-tailwind"]\n',
      "utf-8",
    );

    return {
      updatedFiles: ["bunfig.toml"],
      notes: ["Created bunfig.toml with bun-plugin-tailwind."],
      warnings: [],
    };
  }

  const current = readFileSync(fullPath, "utf-8");
  const patched = patchBunfigText(current);

  if (patched.changed) {
    writeFileSync(fullPath, patched.content, "utf-8");
  }

  return {
    updatedFiles: patched.changed ? ["bunfig.toml"] : [],
    notes: patched.changed
      ? ["Configured bun-plugin-tailwind in bunfig.toml."]
      : [],
    warnings: [],
  };
}

/**
 * Configure Tailwind CSS v4 (and Vite path resolution when applicable) for the
 * detected consumer runtime.
 */
export function configureRuntime(
  cwd: string,
  runtime: DetectedRuntime,
): RuntimeConfigResult {
  switch (runtime.kind) {
    case "vite":
      return configureVite(cwd, runtime);
    case "astro":
      return configureAstro(cwd, runtime);
    case "bun":
      return configureBun(cwd);
    case "turbopack":
    case "nitro":
    case "postcss":
      return configurePostcss(cwd);
  }
}
