import { expect, test } from "bun:test";
import {
  codeLanguage,
  formatCodeSource,
  loadCodeHighlighter,
  tokenizeCode,
  type CodeTokenCache,
} from "../src/lib/code-presentation";

test("Prettier formats compact TypeScript without changing the input", async () => {
  const source =
    // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
    'export const trail={name:"Alpine",km:8.4};function label(km:number){return `${km} km`;}';

  const formatted = await formatCodeSource(source, "ts");
  expect(formatted).toContain(
    'export const trail = { name: "Alpine", km: 8.4 };',
  );
  expect(formatted).toContain(
    // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
    "function label(km: number) {\n  return `${km} km`;\n}",
  );
  expect(source).not.toContain("\n");
});

test("JSON receives consistent indentation and invalid partial code rejects", async () => {
  expect(
    await formatCodeSource('{"trail":{"km":8.4,"saved":true}}', "json"),
  ).toContain('\n  "trail": {\n    "km": 8.4,');
  await expect(
    formatCodeSource("export const trail = {", "typescript"),
  ).rejects.toThrow();
  expect(await formatCodeSource("$ bun run dev", "shell")).toBe(
    "$ bun run dev",
  );
});

test("language aliases are bounded and unsupported names remain plain", () => {
  expect(codeLanguage("TS")).toBe("typescript");
  expect(codeLanguage("bash")).toBe("shellscript");
  expect(loadCodeHighlighter("__proto__")).toBeNull();
  expect(loadCodeHighlighter("text")).toBeNull();
});

test("incremental stream colors match full tokenization across multiline grammar", async () => {
  const instance = await loadCodeHighlighter("tsx");
  expect(instance).not.toBeNull();

  if (!instance) throw new Error("TSX grammar unavailable");
  const cache: CodeTokenCache = { language: "", prefix: "", lines: [] };

  const source =
    // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
    '/* trail\n * details */\nconst label = `Alpine\n${8.4} km`;\n\nexport const card = <div title="Lake">{label}</div>;\n';

  for (let end = 1; end <= source.length; end += 3) {
    const code = source.slice(0, end);
    const actual = tokenizeCode(instance, code, "tsx", cache);

    const expected = instance
      .codeToTokensWithThemes(code, {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
      })
      .map((line) =>
        line.map((token) => ({
          content: token.content,
          light: token.variants.light?.color,
          dark: token.variants.dark?.color,
        })),
      );

    expect(actual).toEqual(expected);
  }

  expect(
    tokenizeCode(instance, source, "tsx", cache)
      .flat()
      .some((token) => token.light !== token.dark),
  ).toBe(true);
});

test("appending preserves completed token rows and replacement resets grammar", async () => {
  const instance = await loadCodeHighlighter("typescript");

  if (!instance) throw new Error("TypeScript grammar unavailable");
  const cache: CodeTokenCache = { language: "", prefix: "", lines: [] };

  const first = tokenizeCode(
    instance,
    'const trail = "Alpine";\nconst km',
    "typescript",
    cache,
  );

  const next = tokenizeCode(
    instance,
    'const trail = "Alpine";\nconst km = 8.4;\n',
    "typescript",
    cache,
  );

  expect(next[0]).toBe(first[0]);
  const replacement = "const saved = true;";
  expect(
    tokenizeCode(instance, replacement, "typescript", cache)
      .flat()
      .map((token) => token.content)
      .join(""),
  ).toBe(replacement);
  expect(cache.prefix).toBe("");
});
