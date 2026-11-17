import type { HighlighterCore, GrammarState } from "@shikijs/core";

export interface CodeToken {
  content: string;
  light?: string;
  dark?: string;
}

const languageLoaders = {
  typescript: () => import("@shikijs/langs/typescript"),
  tsx: () => import("@shikijs/langs/tsx"),
  javascript: () => import("@shikijs/langs/javascript"),
  jsx: () => import("@shikijs/langs/jsx"),
  json: () => import("@shikijs/langs/json"),
  css: () => import("@shikijs/langs/css"),
  html: () => import("@shikijs/langs/html"),
  markdown: () => import("@shikijs/langs/markdown"),
  yaml: () => import("@shikijs/langs/yaml"),
  shellscript: () => import("@shikijs/langs/shellscript"),
  python: () => import("@shikijs/langs/python"),
  sql: () => import("@shikijs/langs/sql"),
};

const aliases = {
  ts: "typescript",
  js: "javascript",
  md: "markdown",
  yml: "yaml",
  shell: "shellscript",
  bash: "shellscript",
  sh: "shellscript",
  py: "python",
} satisfies Record<string, string>;

export function codeLanguage(language: string) {
  const normalized = language.toLowerCase();

  // SAFETY: Own-property validation restricts the key to known aliases.
  return Object.hasOwn(aliases, normalized)
    ? aliases[normalized as keyof typeof aliases]
    : normalized;
}

let highlighter: Promise<HighlighterCore> | undefined;
const loadedLanguages = new Map<string, Promise<HighlighterCore>>();

/** Share the engine and load only the grammar requested by visible snippets. */
export function loadCodeHighlighter(language: string) {
  const lang = codeLanguage(language);

  if (!Object.hasOwn(languageLoaders, lang)) return null;
  let loading = loadedLanguages.get(lang);

  if (!loading) {
    highlighter ??= Promise.all([
      import("@shikijs/core"),
      import("@shikijs/engine-javascript"),
      import("@shikijs/themes/github-light"),
      import("@shikijs/themes/github-dark"),
    ])
      .then(([core, engine, light, dark]) =>
        core.createHighlighterCore({
          engine: engine.createJavaScriptRegexEngine(),
          themes: [light.default, dark.default],
          langs: [],
        }),
      )
      .catch((cause: unknown) => {
        highlighter = undefined;
        throw cause;
      });
    // SAFETY: Own-property validation restricts lang to the literal grammar map.
    const loader = languageLoaders[lang as keyof typeof languageLoaders];
    loading = Promise.all([highlighter, loader()])
      .then(async ([instance, grammar]) => {
        await instance.loadLanguage(grammar.default);

        return instance;
      })
      .catch((cause: unknown) => {
        loadedLanguages.delete(lang);
        throw cause;
      });
    loadedLanguages.set(lang, loading);
  }

  return loading;
}

export interface CodeTokenCache {
  language: string;
  prefix: string;
  lines: CodeToken[][];
  state?: GrammarState;
}

/** Keep completed line tokens and grammar state; only parse appended lines/tail. */
export function tokenizeCode(
  instance: HighlighterCore,
  code: string,
  language: string,
  cache: CodeTokenCache,
) {
  const lang = codeLanguage(language);

  if (cache.language !== lang || !code.startsWith(cache.prefix)) {
    cache.language = lang;
    cache.prefix = "";
    cache.lines = [];
    cache.state = undefined;
  }

  const tokenize = (text: string) =>
    instance.codeToTokensWithThemes(text, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      grammarState: cache.state,
      tokenizeMaxLineLength: 2000,
      tokenizeTimeLimit: 50,
    });

  const convert = (tokens: ReturnType<typeof tokenize>) =>
    tokens.map((line) =>
      line.map((token) => ({
        content: token.content,
        light: token.variants.light?.color,
        dark: token.variants.dark?.color,
      })),
    );

  const end = code.lastIndexOf("\n") + 1;

  if (end > cache.prefix.length) {
    const tokens = tokenize(code.slice(cache.prefix.length, end - 1));
    cache.lines = [...cache.lines, ...convert(tokens)];
    cache.state = instance.getLastGrammarState(tokens);
    cache.prefix = code.slice(0, end);
  }

  return [...cache.lines, ...convert(tokenize(code.slice(end)))];
}

const formattableLanguages = new Set([
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "css",
  "html",
  "markdown",
  "yaml",
]);

const formatterAliases = new Map([
  ["tsx", "typescript"],
  ["jsx", "javascript"],
]);

export async function formatCodeSource(code: string, language: string) {
  const lang = codeLanguage(language);

  if (!formattableLanguages.has(lang)) return code;
  const prettier = await import("prettier/standalone");
  const common = { tabWidth: 2, useTabs: false, printWidth: 80 };
  const formatterLanguage = formatterAliases.get(lang) ?? lang;

  switch (formatterLanguage) {
    case "typescript": {
      const [typescript, estree] = await Promise.all([
        import("prettier/plugins/typescript"),
        import("prettier/plugins/estree"),
      ]);

      return prettier.format(code, {
        ...common,
        parser: "typescript",
        plugins: [typescript, estree],
      });
    }

    case "javascript":
    case "json": {
      const [babel, estree] = await Promise.all([
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);

      return prettier.format(code, {
        ...common,
        parser: { json: "json-stringify", javascript: "babel" }[
          formatterLanguage
        ],
        plugins: [babel, estree],
      });
    }

    case "css": {
      const postcss = await import("prettier/plugins/postcss");

      return prettier.format(code, {
        ...common,
        parser: "css",
        plugins: [postcss],
      });
    }

    case "html": {
      const html = await import("prettier/plugins/html");

      return prettier.format(code, {
        ...common,
        parser: "html",
        plugins: [html],
      });
    }

    case "markdown": {
      const markdown = await import("prettier/plugins/markdown");

      return prettier.format(code, {
        ...common,
        parser: "markdown",
        plugins: [markdown],
      });
    }

    case "yaml": {
      const yaml = await import("prettier/plugins/yaml");

      return prettier.format(code, {
        ...common,
        parser: "yaml",
        plugins: [yaml],
      });
    }

    default:
      return code;
  }
}
