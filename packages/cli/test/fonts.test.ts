import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { init } from "../src/commands/init";
import { theme } from "../src/commands/theme";
import {
  applyFontToCss,
  applyFonts,
  detectCssPath,
} from "../src/core/install/apply-fonts";
import type { DepInstaller } from "../src/core/install/deps";
import { buildBaseCss } from "../src/core/registry/css-assets";
import {
  DEFAULT_MONO,
  DEFAULT_SANS,
  MONO_FONTS,
  SANS_FONTS,
  fontCatalog,
  resolveFont,
} from "../src/core/theme/fonts";
import { BASE_CSS } from "../src/generated/assets";
import { ValidationError } from "../src/lib/errors";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempConsumer(deps: Record<string, string> = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-fonts-"));

  temps.push(dir);
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies: deps }),
    "utf-8",
  );

  return dir;
}

function fakeInstaller(calls: string[][]): DepInstaller {
  return {
    async install(_cwd, deps) {
      calls.push(deps);
    },
  };
}

function readJson<T>(path: string): T {
  // SAFETY: test helper reads JSON this suite wrote.
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function writeCss(dir: string, css: string): void {
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(join(dir, "src/index.css"), css, "utf-8");
}

const REACT_19 = { react: "^19.3.1", "react-dom": "^19.3.1" };

const KIT_CSS = `@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "./kira-utilities.css";

@theme inline {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, monospace;
}

:root {
  --primary: oklch(0.59 0.22 1);
}
`;

describe("font catalog", () => {
  it("ships six sans and three mono fonts with the documented defaults", () => {
    expect(Object.keys(SANS_FONTS)).toHaveLength(6);
    expect(Object.keys(MONO_FONTS)).toHaveLength(3);
    expect(DEFAULT_SANS).toBe("geist");
    expect(DEFAULT_MONO).toBe("geist-mono");
    expect(fontCatalog("sans")).toBe(SANS_FONTS);
    expect(fontCatalog("mono")).toBe(MONO_FONTS);
  });

  it("derives package, family, and stack from the font name", () => {
    for (const font of [
      ...Object.values(SANS_FONTS),
      ...Object.values(MONO_FONTS),
    ]) {
      expect(font.pkg).toBe(`@fontsource-variable/${font.name}`);
      expect(font.family.endsWith(" Variable")).toBe(true);
      expect(font.stack.startsWith(`"${font.family}", `)).toBe(true);
    }

    expect(SANS_FONTS.inter.stack).toBe(
      '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    );
    expect(MONO_FONTS["fira-code"].stack).toBe(
      '"Fira Code Variable", ui-monospace, monospace',
    );
  });

  it("rejects unknown fonts with the valid options in the hint", () => {
    expect(() => resolveFont("sans", "comic-sans")).toThrow(ValidationError);
    expect(() => resolveFont("sans", "comic-sans")).toThrow(
      /Unknown sans font "comic-sans"/,
    );
    expect(() => resolveFont("mono", "geist")).toThrow(/Unknown mono font/);
    expect(resolveFont("sans", "inter").name).toBe("inter");
  });
});

describe("buildBaseCss", () => {
  it("rewires the utilities import and keeps default fonts", () => {
    const css = buildBaseCss(BASE_CSS, "./kira-utilities.css");

    expect(css).toContain('@import "./kira-utilities.css";');
    expect(css).toContain('@import "@fontsource-variable/geist";');
    expect(css).toContain('@import "@fontsource-variable/geist-mono";');
    expect(css).toContain("--font-mono:");
  });

  it("defaults are an identity transform", () => {
    const plain = buildBaseCss(BASE_CSS, "./kira-utilities.css");

    const defaults = buildBaseCss(BASE_CSS, "./kira-utilities.css", {
      sans: resolveFont("sans", DEFAULT_SANS),
      mono: resolveFont("mono", DEFAULT_MONO),
    });

    expect(defaults).toBe(plain);
  });

  it("swaps imports and tokens for a custom pairing", () => {
    const css = buildBaseCss(BASE_CSS, "./kira-utilities.css", {
      sans: resolveFont("sans", "space-grotesk"),
      mono: resolveFont("mono", "jetbrains-mono"),
    });

    expect(css).toContain('@import "@fontsource-variable/space-grotesk";');
    expect(css).toContain('@import "@fontsource-variable/jetbrains-mono";');
    expect(css).not.toContain("@fontsource-variable/geist");
    expect(css).toContain(
      '--font-sans: "Space Grotesk Variable", ui-sans-serif, system-ui, sans-serif;',
    );
    expect(css).toContain(
      '--font-mono: "JetBrains Mono Variable", ui-monospace, monospace;',
    );
    expect(css).toContain("oklch(0.59 0.22 1)");
  });
});

describe("applyFontToCss", () => {
  const inter = resolveFont("sans", "inter");
  const fira = resolveFont("mono", "fira-code");

  it("swaps both slots in place and upserts the tokens", () => {
    const next = applyFontToCss(KIT_CSS, inter, fira);

    expect(next).toContain('@import "@fontsource-variable/inter";');
    expect(next).toContain('@import "@fontsource-variable/fira-code";');
    expect(next).not.toContain("@fontsource-variable/geist");
    expect(next).toContain(`--font-sans: ${inter.stack};`);
    expect(next).toContain(`--font-mono: ${fira.stack};`);
    expect(next).toContain("--primary: oklch(0.59 0.22 1);");
  });

  it("inserts imports after the last @import when none exist", () => {
    const css = '@import "tailwindcss";\n\n:root {\n  --primary: red;\n}\n';

    const next = applyFontToCss(css, inter, fira);

    expect(next).toContain(
      '@import "tailwindcss";\n@import "@fontsource-variable/inter";\n@import "@fontsource-variable/fira-code";',
    );
  });

  it("prepends imports when the stylesheet has none", () => {
    const next = applyFontToCss(":root {\n  --primary: red;\n}\n", inter, fira);

    expect(next.startsWith('@import "@fontsource-variable/inter";')).toBe(true);
  });

  it("creates the @theme inline block when missing", () => {
    const next = applyFontToCss(":root {\n  --primary: red;\n}\n", inter, fira);

    expect(next).toContain("@theme inline");
    expect(next).toContain(`--font-sans: ${inter.stack};`);
    expect(next).toContain("--primary: red;");
  });

  it("leaves non-catalog fontsource imports alone", () => {
    const css = KIT_CSS.replace(
      '@import "@fontsource-variable/geist";',
      '@import "@fontsource-variable/geist";\n@import "@fontsource-variable/roboto";',
    );

    const next = applyFontToCss(css, inter, fira);

    expect(next).toContain('@import "@fontsource-variable/roboto";');
    expect(next).toContain('@import "@fontsource-variable/inter";');
  });

  it("is idempotent", () => {
    const once = applyFontToCss(KIT_CSS, inter, fira);

    expect(applyFontToCss(once, inter, fira)).toBe(once);
  });

  it("keeps CRLF line endings", () => {
    const crlf = KIT_CSS.replace(/\n/g, "\r\n");
    const next = applyFontToCss(crlf, inter, fira);

    expect(next).toContain('@import "@fontsource-variable/inter";\r\n');
    expect(next).not.toMatch(/[^\r]\n/);
  });
});

describe("applyFonts (existing project)", () => {
  it("rewrites CSS, records config fields, and installs missing packages", async () => {
    const dir = tempConsumer({
      ...REACT_19,
      "@fontsource-variable/geist": "^5.3.0",
    });

    writeCss(dir, KIT_CSS);
    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({ style: "kira", tailwind: { css: "src/index.css" } }),
      "utf-8",
    );

    const calls: string[][] = [];

    await applyFonts(
      dir,
      resolveFont("sans", "manrope"),
      resolveFont("mono", "jetbrains-mono"),
      { yes: true, installer: fakeInstaller(calls) },
    );

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(css).toContain('@import "@fontsource-variable/manrope";');
    expect(css).toContain('@import "@fontsource-variable/jetbrains-mono";');
    expect(css).toContain("--primary: oklch(0.59 0.22 1);");

    const config = readJson<{ font: string; fontMono: string }>(
      join(dir, "components.json"),
    );

    expect(config.font).toBe("manrope");
    expect(config.fontMono).toBe("jetbrains-mono");
    expect(calls.flat()).toEqual([
      "@fontsource-variable/manrope",
      "@fontsource-variable/jetbrains-mono",
    ]);
  });

  it("detectCssPath prefers the configured css path", () => {
    const dir = tempConsumer();

    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({ tailwind: { css: "styles/app.css" } }),
      "utf-8",
    );

    expect(detectCssPath(dir)).toBe("styles/app.css");
  });
});

describe("theme command (font and icon options)", () => {
  it("requires at least one option", async () => {
    const dir = tempConsumer(REACT_19);

    await expect(theme({ cwd: dir, apply: false })).rejects.toThrow(
      /Nothing to generate or apply/,
    );
  });

  it("validates font and icon names", async () => {
    const dir = tempConsumer(REACT_19);

    await expect(
      theme({ cwd: dir, apply: false, font: "nope" }),
    ).rejects.toThrow(/Unknown sans font/);
    await expect(
      theme({ cwd: dir, apply: false, icon: "feather" }),
    ).rejects.toThrow(/Unknown icon library/);
  });

  it("prints a dry run without --apply and writes nothing", async () => {
    const dir = tempConsumer(REACT_19);

    writeCss(dir, KIT_CSS);

    const code = await theme({ cwd: dir, font: "inter", apply: false });

    expect(code).toBe(0);
    expect(readFileSync(join(dir, "src/index.css"), "utf-8")).toBe(KIT_CSS);
  });

  it("applies fonts without --primary and without --force", async () => {
    const dir = tempConsumer(REACT_19);

    writeCss(dir, KIT_CSS);
    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({ style: "kira" }),
      "utf-8",
    );

    const calls: string[][] = [];

    const code = await theme({
      cwd: dir,
      font: "dm-sans",
      fontMono: "fira-code",
      apply: true,
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(css).toContain('@import "@fontsource-variable/dm-sans";');
    expect(css).toContain('@import "@fontsource-variable/fira-code";');
    expect(css).toContain("--primary: oklch(0.59 0.22 1);");
    expect(calls.flat()).toContain("@fontsource-variable/dm-sans");
  });

  it("applies --icon lucide on its own", async () => {
    const dir = tempConsumer(REACT_19);

    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(
      join(dir, "src/welcome.tsx"),
      'import { IconSparkles } from "@tabler/icons-react";\nexport const x = <IconSparkles />;\n',
      "utf-8",
    );

    const calls: string[][] = [];

    const code = await theme({
      cwd: dir,
      icon: "lucide",
      apply: true,
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);
    expect(calls.flat()).toContain("lucide-react");

    const source = readFileSync(join(dir, "src/welcome.tsx"), "utf-8");

    expect(source).toContain(
      'import { Sparkles as IconSparkles } from "lucide-react";',
    );

    const config = readJson<{ iconLibrary: string }>(
      join(dir, "components.json"),
    );

    expect(config.iconLibrary).toBe("lucide");
  });
});

describe("init (typography)", () => {
  it("honors --font, --font-mono, and --icon on a fresh project", async () => {
    const dir = tempConsumer(REACT_19);
    const calls: string[][] = [];

    const code = await init({
      cwd: dir,
      force: false,
      yes: true,
      font: "inter",
      fontMono: "fira-code",
      icon: "lucide",
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);

    const config = readJson<{
      font: string;
      fontMono: string;
      iconLibrary: string;
    }>(join(dir, "components.json"));

    expect(config.font).toBe("inter");
    expect(config.fontMono).toBe("fira-code");
    expect(config.iconLibrary).toBe("lucide");

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(css).toContain('@import "@fontsource-variable/inter";');
    expect(css).toContain('@import "@fontsource-variable/fira-code";');
    expect(css).not.toContain("@fontsource-variable/geist");

    const flat = calls.flat();

    expect(flat).toContain("lucide-react");
    expect(flat).toContain("@fontsource-variable/inter");
    expect(flat).toContain("@fontsource-variable/fira-code");
    expect(flat).not.toContain("@tabler/icons-react");
  });

  it("defaults stay geist / geist-mono / tabler", async () => {
    const dir = tempConsumer(REACT_19);
    const calls: string[][] = [];

    await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller(calls),
    });

    const config = readJson<{
      font: string;
      fontMono: string;
      iconLibrary: string;
    }>(join(dir, "components.json"));

    expect(config.font).toBe("geist");
    expect(config.fontMono).toBe("geist-mono");
    expect(config.iconLibrary).toBe("tabler");
    expect(calls.flat()).toContain("@tabler/icons-react");
    expect(calls.flat()).toContain("@fontsource-variable/geist-mono");
  });

  it("rejects unknown icon libraries", async () => {
    const dir = tempConsumer(REACT_19);

    await expect(
      init({
        cwd: dir,
        force: false,
        yes: true,
        icon: "heroicons",
        installer: fakeInstaller([]),
      }),
    ).rejects.toThrow(/Unknown icon library/);
  });
});

describe("init (existing projects)", () => {
  it("applies fonts to an existing theme without --force", async () => {
    const dir = tempConsumer(REACT_19);

    writeCss(dir, KIT_CSS);
    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({ style: "kira", font: "manrope" }),
      "utf-8",
    );

    const code = await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller([]),
    });

    expect(code).toBe(0);

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(css).toContain('@import "@fontsource-variable/manrope";');
    expect(css).toContain("--primary: oklch(0.59 0.22 1);");
    expect(css).not.toContain("@source inline(");
  });

  it("leaves an existing theme untouched when no fonts are requested", async () => {
    const dir = tempConsumer(REACT_19);

    writeCss(dir, KIT_CSS);

    await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller([]),
    });

    expect(readFileSync(join(dir, "src/index.css"), "utf-8")).toBe(KIT_CSS);
  });
});
