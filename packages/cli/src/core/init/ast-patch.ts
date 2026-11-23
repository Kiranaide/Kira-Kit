import ts from "typescript";

export interface InsertObjectOptions {
  fallbackIndent?: string;
  trailingComma?: boolean;
  allowInline?: boolean;
}

export function detectEol(content: string): string {
  return content.includes("\r\n") ? "\r\n" : "\n";
}

export function lineIndentAt(content: string, pos: number): string {
  const lineStart = content.lastIndexOf("\n", pos - 1) + 1;
  const line = content.slice(lineStart, pos);
  const match = line.match(/^([ \t]*)/);

  return match ? match[1] : "";
}

export function getPropertyName(
  prop: ts.ObjectLiteralElementLike,
): string | null {
  if (!ts.isPropertyAssignment(prop)) return null;

  if (ts.isStringLiteral(prop.name) || ts.isIdentifier(prop.name)) {
    return prop.name.text;
  }

  return null;
}

export function findProperty(
  obj: ts.ObjectLiteralExpression,
  name: string,
): ts.PropertyAssignment | null {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && getPropertyName(prop) === name) {
      return prop;
    }
  }

  return null;
}

interface ResolvedInsertOptions {
  fallbackIndent: string;
  trailingComma: boolean;
  allowInline: boolean;
}

function resolveInsertOptions(
  options: InsertObjectOptions,
): ResolvedInsertOptions {
  return {
    fallbackIndent: options.fallbackIndent ?? "  ",
    trailingComma: options.trailingComma ?? true,
    allowInline: options.allowInline ?? true,
  };
}

function insertIntoEmptyObject(
  content: string,
  objStart: number,
  objEnd: number,
  objIndent: string,
  propLines: string[],
  eol: string,
  opts: ResolvedInsertOptions,
): string {
  const inner = objIndent + opts.fallbackIndent;
  const body = propLines.map((line) => `${inner}${line}`).join(eol);
  const comma = opts.trailingComma ? "," : "";

  return `${content.slice(0, objStart)}{${eol}${body}${comma}${eol}${objIndent}}${content.slice(objEnd)}`;
}

function insertIntoNonEmptyObject(
  content: string,
  sf: ts.SourceFile,
  obj: ts.ObjectLiteralExpression,
  propLines: string[],
  eol: string,
  opts: ResolvedInsertOptions,
): string {
  const objStart = obj.getStart(sf);
  const objEnd = obj.getEnd();
  const last = obj.properties[obj.properties.length - 1];
  const lastEnd = last.getEnd();
  const commaOffset = content.slice(lastEnd, objEnd - 1).indexOf(",");
  const hasComma = commaOffset >= 0;
  const insertAt = hasComma ? lastEnd + commaOffset + 1 : lastEnd;

  if (opts.allowInline && !content.slice(objStart, objEnd).includes("\n")) {
    const inline = propLines.join(" ").replace(/\s+/g, " ");
    const sep = hasComma ? " " : ", ";

    return content.slice(0, insertAt) + sep + inline + content.slice(insertAt);
  }

  const propIndent =
    lineIndentAt(content, last.getStart(sf)) ||
    lineIndentAt(content, objStart) + opts.fallbackIndent;

  const body = propLines.map((line) => `${propIndent}${line}`).join(eol);
  const lead = hasComma ? "" : ",";
  const tail = opts.trailingComma && hasComma ? "," : "";

  return (
    content.slice(0, insertAt) +
    lead +
    eol +
    body +
    tail +
    content.slice(insertAt)
  );
}

/**
 * Insert property lines into an object literal (TS/JS or JSONC) while
 * preserving existing EOL, indentation, comments, and comma style.
 */
export function insertObjectProperty(
  content: string,
  sf: ts.SourceFile,
  obj: ts.ObjectLiteralExpression,
  propLines: string[],
  options: InsertObjectOptions = {},
): string {
  const opts = resolveInsertOptions(options);
  const eol = detectEol(content);

  if (obj.properties.length === 0) {
    const objStart = obj.getStart(sf);

    return insertIntoEmptyObject(
      content,
      objStart,
      obj.getEnd(),
      lineIndentAt(content, objStart),
      propLines,
      eol,
      opts,
    );
  }

  return insertIntoNonEmptyObject(content, sf, obj, propLines, eol, opts);
}
