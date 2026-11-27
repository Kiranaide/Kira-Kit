import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BASE_CSS,
  DEFAULT_THEME_CSSVARS,
  UTILITIES_CSS,
} from "../src/generated/assets";
import { buildBaseCss, defaultThemeItem } from "../src/core/css/stylesheet";

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

  it("UTILITIES_CSS matches the vendored utilities verbatim and leaks no docs-only rules", () => {
    expect(UTILITIES_CSS).toBe(utilities);
    expect(UTILITIES_CSS).not.toMatch(/\.docs-/);
  });

  it("DEFAULT_THEME_CSSVARS matches the extracted default theme", () => {
    expect(DEFAULT_THEME_CSSVARS).toEqual(defaultThemeItem(indexCss).cssVars);
  });

  it("keeps the responsive safelists and the pink primary", () => {
    expect(BASE_CSS).toContain("@source inline(");
    expect(BASE_CSS).toContain("--primary: oklch(0.49 0.22 1)");
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
