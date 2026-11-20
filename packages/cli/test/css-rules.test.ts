import { describe, expect, it } from "vitest";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  mergeCssRules,
  mergeCssRulesText,
} from "../src/core/install/css-rules";

const SNIPPET = `:root {
  --ease-spring: linear(0, 0.5, 1);
}

@theme inline {
  --animate-route-fade: route-fade 0.15s ease-out both;
}

@keyframes route-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 150ms;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms;
  }
}
`;

describe("mergeCssRulesText", () => {
  it("appends every rule to empty CSS and is idempotent", () => {
    const once = mergeCssRulesText("", SNIPPET);

    expect(once).toContain("--ease-spring: linear(0, 0.5, 1);");
    expect(once).toContain("@keyframes route-fade");
    expect(once).toContain("@media (prefers-reduced-motion: reduce)");
    expect(mergeCssRulesText(once, SNIPPET)).toBe(once);
  });

  it("upserts :root and @theme declarations without touching siblings", () => {
    const css =
      ":root {\n  --primary: red;\n}\n\n@theme inline {\n  --color-x: blue;\n  --animate-route-fade: old;\n}\n";

    const merged = mergeCssRulesText(css, SNIPPET);

    expect(merged).toContain("--primary: red;");
    expect(merged).toContain("--color-x: blue;");
    expect(merged).toContain("--ease-spring: linear(0, 0.5, 1);");
    expect(merged).toContain(
      "--animate-route-fade: route-fade 0.15s ease-out both;",
    );
    expect(merged).not.toContain("--animate-route-fade: old;");
    expect(mergeCssRulesText(merged, SNIPPET)).toBe(merged);
  });

  it("replaces a same-name @keyframes body and keeps other keyframes", () => {
    const css =
      "@keyframes route-fade {\n  from { opacity: 0.5; }\n}\n\n@keyframes other {\n  to { opacity: 1; }\n}\n";

    const merged = mergeCssRulesText(css, SNIPPET);

    expect(merged).toContain("from { opacity: 0; }");
    expect(merged).not.toContain("opacity: 0.5;");
    expect(merged).toContain("@keyframes other");
    expect(merged.match(/@keyframes route-fade/g)).toHaveLength(1);
  });

  it("merges @media inner rules without clobbering an existing gate", () => {
    const css =
      "@media (prefers-reduced-motion: reduce) {\n  *, ::before, ::after {\n    animation-duration: 0.01ms !important;\n  }\n}\n";

    const merged = mergeCssRulesText(css, SNIPPET);

    expect(merged).toContain("animation-duration: 0.01ms !important;");
    expect(merged).toContain("animation-duration: 0.01ms;");
    expect(
      merged.match(/@media \(prefers-reduced-motion: reduce\)/g),
    ).toHaveLength(1);
    expect(mergeCssRulesText(merged, SNIPPET)).toBe(merged);
  });

  it("matches selectors across whitespace differences", () => {
    const css =
      "::view-transition-old(root), ::view-transition-new(root) {\n  animation-duration: 250ms;\n}\n";

    const merged = mergeCssRulesText(css, SNIPPET);

    expect(merged).toContain("animation-duration: 150ms;");
    expect(merged).not.toContain("250ms");
    expect(merged.match(/animation-duration: 150ms;/g)).toHaveLength(1);
  });
});

describe("mergeCssRules", () => {
  it("writes the merged file, then reports no change on re-merge", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-css-rules-"));
    const cssPath = join(dir, "src/index.css");

    try {
      mkdirSync(join(dir, "src"), { recursive: true });
      writeFileSync(cssPath, ":root {\n  --primary: red;\n}\n");

      expect(mergeCssRules(cssPath, SNIPPET)).toBe(true);

      const merged = readFileSync(cssPath, "utf-8");

      expect(merged).toContain("--primary: red;");
      expect(merged).toContain("@keyframes route-fade");
      expect(mergeCssRules(cssPath, SNIPPET)).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("creates the stylesheet when missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-css-rules-"));
    const cssPath = join(dir, "nested/index.css");

    try {
      expect(mergeCssRules(cssPath, SNIPPET)).toBe(true);
      expect(readFileSync(cssPath, "utf-8")).toContain("@keyframes route-fade");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
