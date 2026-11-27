/** Consumer import aliases (kira-kit.json `aliases`), with defaults. */
export interface ImportAliases {
  components: string;
  ui: string;
  hooks: string;
  lib: string;
  utils?: string;
}

/** Longest prefixes first so "@/components/ui/" beats "@/components/". */
const PREFIX_RULES: Array<[string, keyof Omit<ImportAliases, "utils">]> = [
  ["@/components/ui/", "ui"],
  ["@/hooks/", "hooks"],
  ["@/lib/", "lib"],
  ["@/components/", "components"],
];

function rewriteSpecifier(specifier: string, aliases: ImportAliases): string {
  if (specifier === "@/lib/utils" && aliases.utils) return aliases.utils;

  for (const [prefix, key] of PREFIX_RULES) {
    if (specifier.startsWith(prefix)) {
      return `${aliases[key]}/${specifier.slice(prefix.length)}`;
    }
  }

  return specifier;
}

/**
 * Rewrite kit-internal "@/…" import specifiers to the consumer's aliases.
 * Handles both quote styles; npm specifiers (incl. `cn`) are untouched.
 */
export function rewriteImports(
  content: string,
  aliases: ImportAliases,
): string {
  return content.replace(
    /(["'])@\/[^"']*\1/g,
    (match: string, quote: string) =>
      quote + rewriteSpecifier(match.slice(1, -1), aliases) + quote,
  );
}

/** Prepend a "use client" directive unless one already leads the file. */
export function prependUseClient(content: string): string {
  if (/^\s*(["'])use client\1/.test(content)) return content;

  return `"use client";\n\n${content}`;
}
