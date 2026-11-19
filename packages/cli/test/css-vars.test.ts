import { describe, expect, it } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  mergeCssVars,
  mergeCssVarsText,
  topLevelBlocks,
} from "../src/core/install/css-vars";

const KIT_CSS = `@import "tailwindcss";

:root {
  --primary: oklch(0.59 0.22 1);
  --radius: 0.45rem;
}

.dark {
  --primary: oklch(0.7 0.2 1);
}

@layer base {
  :root {
    --nested: keep-me;
  }
}

@theme inline {
  --color-primary: var(--primary);
  @keyframes shimmer {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
}
`;

describe("topLevelBlocks", () => {
  it("finds only depth-0 blocks", () => {
    const selectors = topLevelBlocks(KIT_CSS).map((b) => b.selector);

    expect(selectors).toEqual([
      ":root",
      ".dark",
      "@layer base",
      "@theme inline",
    ]);
  });

  it("ignores braces inside comments", () => {
    const css = "/* :root { fake } */\n:root {\n  --a: 1;\n}\n";

    expect(topLevelBlocks(css).map((b) => b.selector)).toEqual([":root"]);
  });
});

describe("mergeCssVarsText", () => {
  it("updates light and dark values in place", () => {
    const merged = mergeCssVarsText(KIT_CSS, {
      light: { "--primary": "oklch(0.663 0.193 22.3)" },
      dark: { "--primary": "oklch(0.8 0.1 22.3)" },
    });

    expect(merged).toContain("--primary: oklch(0.663 0.193 22.3);");
    expect(merged).toContain("--primary: oklch(0.8 0.1 22.3);");
    expect(merged).not.toContain("oklch(0.59 0.22 1)");
  });

  it("never touches the nested :root inside @layer base", () => {
    const merged = mergeCssVarsText(KIT_CSS, {
      light: { "--nested": "changed", "--primary": "red" },
    });

    expect(merged).toContain("--nested: keep-me;");
    expect(merged).toContain("--nested: changed;");
  });

  it("appends missing declarations to an existing block", () => {
    const merged = mergeCssVarsText(KIT_CSS, {
      light: { "--brand-new": "oklch(0.5 0.1 100)" },
    });

    expect(merged).toMatch(
      /--radius: 0\.45rem;\n  --brand-new: oklch\(0\.5 0\.1 100\);\n}/,
    );
  });

  it("creates a block when the selector is absent", () => {
    const css = ":root {\n  --a: 1;\n}\n";
    const merged = mergeCssVarsText(css, { dark: { "--a": "2" } });

    expect(merged).toContain(".dark {\n  --a: 2;\n}");
  });

  it("merges theme vars around nested keyframes", () => {
    const merged = mergeCssVarsText(KIT_CSS, {
      theme: { "--color-primary": "var(--p)", "--radius-lg": "0.625rem" },
    });

    expect(merged).toContain("--color-primary: var(--p);");
    expect(merged).toContain("--radius-lg: 0.625rem;");
    expect(merged).toContain("@keyframes shimmer");
  });

  it("is a no-op for empty cssVars", () => {
    expect(mergeCssVarsText(KIT_CSS, {})).toBe(KIT_CSS);
    expect(mergeCssVarsText(KIT_CSS, { light: {} })).toBe(KIT_CSS);
  });
});

describe("mergeCssVars (file)", () => {
  it("writes the merged file and reports change", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-css-"));

    try {
      const cssPath = join(dir, "src/index.css");
      mkdirSync(join(dir, "src"), { recursive: true });
      writeFileSync(cssPath, KIT_CSS);

      expect(mergeCssVars(cssPath, { light: { "--primary": "red" } })).toBe(
        true,
      );
      expect(readFileSync(cssPath, "utf-8")).toContain("--primary: red;");
      expect(mergeCssVars(cssPath, { light: { "--primary": "red" } })).toBe(
        false,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("creates the CSS file when absent", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-css-"));

    try {
      const cssPath = join(dir, "src/index.css");

      expect(mergeCssVars(cssPath, { light: { "--a": "1" } })).toBe(true);
      expect(readFileSync(cssPath, "utf-8")).toContain(":root {\n  --a: 1;\n}");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
