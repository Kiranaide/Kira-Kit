import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BASE_CSS,
  DEFAULT_THEME_CSSVARS,
  UTILITIES_CSS,
} from "../src/generated/assets";
import {
  buildBaseCss,
  defaultThemeItem,
} from "../src/core/registry/css-assets";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const indexCss = readFileSync(
  join(REPO_ROOT, "src/index.css"),
  "utf-8",
).replaceAll("\r\n", "\n");

const utilities = readFileSync(
  join(REPO_ROOT, "src/styles/kira-utilities.css"),
  "utf-8",
).replaceAll("\r\n", "\n");

describe("embedded assets drift guard", () => {
  it("BASE_CSS matches src/index.css with the utilities import rewired", () => {
    expect(BASE_CSS).toBe(buildBaseCss(indexCss, "./kira-utilities.css"));
  });

  it("UTILITIES_CSS matches the vendored utilities verbatim", () => {
    expect(UTILITIES_CSS).toBe(utilities);
  });

  it("DEFAULT_THEME_CSSVARS matches the extracted default theme", () => {
    expect(DEFAULT_THEME_CSSVARS).toEqual(defaultThemeItem(indexCss).cssVars);
  });

  it("keeps the responsive safelists and the pink primary", () => {
    expect(BASE_CSS).toContain("@source inline(");
    expect(BASE_CSS).toContain("oklch(0.59 0.22 1)");
    expect(BASE_CSS).toContain("--radius: 0.45rem");
  });

  it("ships both font imports and font tokens", () => {
    expect(BASE_CSS).toContain('@import "@fontsource-variable/geist";');
    expect(BASE_CSS).toContain('@import "@fontsource-variable/geist-mono";');
    expect(BASE_CSS).toContain(
      '--font-mono: "Geist Mono Variable", ui-monospace, monospace;',
    );
  });
});

const TEMPLATES_ROOT = join(REPO_ROOT, "packages/cli/templates");

const TEMPLATE_CSS_TARGETS = [
  {
    css: "vite/src/index.css",
    utilities: "vite/src/styles/kira-utilities.css",
    utilitiesImport: "./styles/kira-utilities.css",
  },
  {
    css: "tanstack-start/src/index.css",
    utilities: "tanstack-start/src/styles/kira-utilities.css",
    utilitiesImport: "./styles/kira-utilities.css",
  },
  {
    css: "next/app/globals.css",
    utilities: "next/app/kira-utilities.css",
    utilitiesImport: "./kira-utilities.css",
  },
  {
    css: "monorepo/packages/ui/src/index.css",
    utilities: "monorepo/packages/ui/src/styles/kira-utilities.css",
    utilitiesImport: "./styles/kira-utilities.css",
  },
];

function readNormalized(path: string): string {
  return readFileSync(path, "utf-8").replaceAll("\r\n", "\n");
}

describe("template CSS drift guard", () => {
  for (const target of TEMPLATE_CSS_TARGETS) {
    it(`${target.css} ships the kit base CSS + utilities`, () => {
      expect(readNormalized(join(TEMPLATES_ROOT, target.css))).toBe(
        buildBaseCss(indexCss, target.utilitiesImport),
      );

      expect(readNormalized(join(TEMPLATES_ROOT, target.utilities))).toBe(
        utilities,
      );
    });
  }
});
