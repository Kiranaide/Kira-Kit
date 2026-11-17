import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type {
  CheckContext,
  ItemMeta,
  SourceFile,
} from "../src/core/checks/types";
import { importsMatchDeps } from "../src/core/checks/imports-deps";
import { deadAnimate } from "../src/core/checks/dead-animate";
import { dataSlotAndCva } from "../src/core/checks/data-slot-cva";
import { reducedMotion } from "../src/core/checks/reduced-motion";
import { targetSize } from "../src/core/checks/target-size";
import { rawColors } from "../src/core/checks/raw-colors";
import { layoutTransitions } from "../src/core/checks/layout-transitions";
import { arbitraryValues } from "../src/core/checks/arbitrary-values";
import { registryMetadata } from "../src/core/checks/registry-metadata";
import { baseUiOnly } from "../src/core/checks/base-ui-only";
import { cnSource } from "../src/core/checks/cn-source";
import {
  isSuppressed,
  parseSuppressions,
  unusedSuppressions,
} from "../src/core/checks/suppressions";
import { formatFindings, runChecks } from "../src/core/checks/runner";

function file(content: string, name = "ui/test"): SourceFile {
  return {
    name,
    path: `src/components/ui/${name.split("/")[1] ?? "test"}.tsx`,
    content,
  };
}

function ctx(overrides: Partial<CheckContext> = {}): CheckContext {
  return { indexCss: "", items: new Map(), ...overrides };
}

function metadataMeta(overrides: Partial<ItemMeta> = {}): ItemMeta {
  return {
    dependencies: [],
    registryDependencies: [],
    files: [],
    description: "A nicely described interactive component with real detail.",
    categories: ["component"],
    ...overrides,
  };
}

function depsMeta(overrides: Partial<ItemMeta> = {}): ItemMeta {
  return {
    dependencies: ["@base-ui/react"],
    registryDependencies: [],
    files: ["ui/test.tsx"],
    description: "Well described.",
    categories: ["component"],
    ...overrides,
  };
}

const CLEAN_COMPONENT = `
import { useRef } from "react";
import { cn } from "cn";
export function Test() {
  return <div data-slot="test" className={cn("h-6 w-6")} />;
}
`;

describe("base-ui-only", () => {
  it("flags Radix and React Aria imports", () => {
    const findings = baseUiOnly(
      file(`import { Dialog } from "@radix-ui/react-dialog";`),
      ctx(),
    );

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("error");
    expect(findings[0].line).toBe(1);
  });

  it("allows Base UI imports", () => {
    expect(
      baseUiOnly(
        file(`import { Dialog } from "@base-ui/react/dialog";`),
        ctx(),
      ),
    ).toHaveLength(0);
  });
});

describe("cn-source", () => {
  it("flags clsx, tailwind-merge, and local cn imports", () => {
    for (const specifier of [
      "clsx",
      "tailwind-merge",
      "@/lib/cn",
      "@/lib/utils",
    ]) {
      const findings = cnSource(
        file(`import { cn } from "${specifier}";`),
        ctx(),
      );

      expect(findings, specifier).toHaveLength(1);
      expect(findings[0].severity).toBe("error");
    }
  });

  it("allows the cn package", () => {
    expect(cnSource(file(`import { cn } from "cn";`), ctx())).toHaveLength(0);
  });
});

describe("data-slot-cva", () => {
  it("warns when no data-slot is present", () => {
    const findings = dataSlotAndCva(
      file(`export function Test() { return null; }`),
      ctx(),
    );

    expect(findings[0].checkId).toBe("data-slot-cva");
  });

  it("warns when cva is used without exporting *Variants", () => {
    const findings = dataSlotAndCva(
      file(
        `import { cva } from "class-variance-authority";\nconst v = cva("");`,
      ),
      ctx(),
    );

    expect(findings.some((f) => f.message.includes("cva"))).toBe(true);
  });

  it("passes a clean component", () => {
    expect(dataSlotAndCva(file(CLEAN_COMPONENT), ctx())).toHaveLength(0);
  });

  it("accepts data-slot in createElement form", () => {
    const content = `return React.createElement(Component, { "data-slot": "box" });`;
    expect(dataSlotAndCva(file(content), ctx())).toHaveLength(0);
  });
});

describe("dead-animate", () => {
  const cssWithToken = `
--animate-fade-in: fade-in 0.3s ease;
@keyframes fade-in { from { opacity: 0; } }
`;

  it("errors on animate-* without token + keyframes", () => {
    const findings = deadAnimate(
      file(`<div className="animate-fade-in" />`),
      ctx({ indexCss: "" }),
    );

    expect(findings[0].checkId).toBe("dead-animate");
  });

  it("passes when token and keyframes both exist", () => {
    expect(
      deadAnimate(
        file(`<div className="animate-fade-in" />`),
        ctx({ indexCss: cssWithToken }),
      ),
    ).toHaveLength(0);
  });

  it("ignores builtin Tailwind animations", () => {
    expect(
      deadAnimate(file(`<div className="animate-spin" />`), ctx()),
    ).toHaveLength(0);
  });
});

describe("reduced-motion", () => {
  it("warns on animate-* without gating", () => {
    expect(
      reducedMotion(file(`<div className="animate-fade-in" />`), ctx()),
    ).toHaveLength(1);
  });

  it("passes when useReducedMotion or gsap.matchMedia is present", () => {
    const gated = `import { useReducedMotion } from "@/hooks/use-reduced-motion";\n<div className="animate-fade-in" />`;
    expect(reducedMotion(file(gated), ctx())).toHaveLength(0);
  });

  it("passes with a motion-reduce variant", () => {
    expect(
      reducedMotion(
        file(`<div className="animate-spin motion-reduce:animate-none" />`),
        ctx(),
      ),
    ).toHaveLength(0);
  });

  it("passes CSS animation under the global index.css gate", () => {
    const indexCss = `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }`;
    expect(
      reducedMotion(
        file(`<div className="animate-fade-in" />`),
        ctx({ indexCss }),
      ),
    ).toHaveLength(0);
  });

  it("still warns on gsap without a JS gate despite the global CSS gate", () => {
    const indexCss = `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }`;
    const content = `import gsap from "gsap";\ngsap.to(el, { opacity: 0 });`;
    expect(reducedMotion(file(content), ctx({ indexCss }))).toHaveLength(1);
    const gated = `import gsap from "gsap";\nif (prefersReducedMotion()) return;\ngsap.to(el, { opacity: 0 });`;
    expect(reducedMotion(file(gated), ctx({ indexCss }))).toHaveLength(0);
  });

  it("does not flag files without animation", () => {
    expect(reducedMotion(file(CLEAN_COMPONENT), ctx())).toHaveLength(0);
  });
});

describe("target-size", () => {
  it("warns on h-4/size-3 utilities", () => {
    expect(targetSize(file(`<button className="h-4" />`), ctx())).toHaveLength(
      1,
    );
    expect(
      targetSize(file(`<button className="size-3" />`), ctx()),
    ).toHaveLength(1);
  });

  it("passes on h-6 and above", () => {
    expect(
      targetSize(file(`<button className="h-6 w-6" />`), ctx()),
    ).toHaveLength(0);
  });

  it("warns on small interactive spans with focus/hover affordances", () => {
    expect(
      targetSize(
        file(`<span className="size-5 cursor-pointer hover:bg-muted" />`),
        ctx(),
      ),
    ).toHaveLength(1);
  });

  it("ignores small icons and decoration inside a sized target", () => {
    const content = `<button className="h-9 px-3"><svg className="h-4 w-4" /></button>`;
    expect(targetSize(file(content), ctx())).toHaveLength(0);
    expect(
      targetSize(
        file(
          `<span className="size-1.5 rounded-full bg-warning group-data-active:hidden" />`,
        ),
        ctx(),
      ),
    ).toHaveLength(0);
  });

  it("ignores child-targeting variant selectors", () => {
    expect(
      targetSize(file(`<button className="h-9 [&_svg]:size-3" />`), ctx()),
    ).toHaveLength(0);
  });
});

describe("raw-colors", () => {
  it("warns on hex and rgb literals", () => {
    expect(rawColors(file(`const c = "#fff";`), ctx())).toHaveLength(1);
    expect(rawColors(file(`const c = "rgb(0 0 0)";`), ctx())).toHaveLength(1);
  });

  it("passes on token classes", () => {
    expect(
      rawColors(
        file(`<div className="bg-background text-foreground" />`),
        ctx(),
      ),
    ).toHaveLength(0);
  });
});

describe("layout-transitions", () => {
  it("warns on transition-all and arbitrary width transitions", () => {
    expect(
      layoutTransitions(file(`<div className="transition-all" />`), ctx()),
    ).toHaveLength(1);
    expect(
      layoutTransitions(file(`<div className="transition-[width]" />`), ctx()),
    ).toHaveLength(1);
  });

  it("passes on transform/opacity transitions", () => {
    expect(
      layoutTransitions(
        file(`<div className="transition-transform duration-200" />`),
        ctx(),
      ),
    ).toHaveLength(0);
  });
});

describe("arbitrary-values", () => {
  it("warns on arbitrary z/shadow/rounded values", () => {
    for (const className of [
      "z-[100]",
      "shadow-[0_0_10px]",
      "rounded-[13px]",
    ]) {
      expect(
        arbitraryValues(file(`<div className="${className}" />`), ctx()),
      ).toHaveLength(1);
    }
  });

  it("passes inherit and token-derived values", () => {
    for (const className of [
      "rounded-[inherit]",
      "rounded-[calc(var(--radius)-3px)]",
      "z-[calc(1000-var(--toast-index))]",
      "shadow-[inset_0_-2px_0_0_var(--border)]",
    ]) {
      expect(
        arbitraryValues(file(`<div className="${className}" />`), ctx()),
        className,
      ).toHaveLength(0);
    }
  });
});

describe("registry-metadata", () => {
  it("errors on empty description", () => {
    const items = new Map([["ui/test", metadataMeta({ description: "" })]]);
    const findings = registryMetadata(file("", "ui/test"), ctx({ items }));
    expect(findings.some((f) => f.message.includes("description"))).toBe(true);
  });

  it("errors on TODO and boilerplate descriptions", () => {
    for (const description of [
      "TODO: write",
      "a button",
      "A Button component.",
    ]) {
      const items = new Map([["ui/test", metadataMeta({ description })]]);
      expect(
        registryMetadata(file("", "ui/test"), ctx({ items })).length,
        description,
      ).toBeGreaterThan(0);
    }
  });

  it("errors when no category is set", () => {
    const items = new Map([["ui/test", metadataMeta({ categories: [] })]]);
    expect(
      registryMetadata(file("", "ui/test"), ctx({ items })).length,
    ).toBeGreaterThan(0);
  });

  it("passes a well-described item with categories", () => {
    const items = new Map([["ui/test", metadataMeta()]]);
    expect(registryMetadata(file("", "ui/test"), ctx({ items }))).toHaveLength(
      0,
    );
  });
});

describe("imports-deps", () => {
  const importsBaseUi = `import { useButton } from "@base-ui/react/use-button";`;

  it("passes when every import is declared", () => {
    const items = new Map([["ui/test", depsMeta()]]);
    expect(
      importsMatchDeps(file(importsBaseUi, "ui/test"), ctx({ items })),
    ).toHaveLength(0);
  });

  it("errors on an undeclared npm import", () => {
    const items = new Map([["ui/test", depsMeta({ dependencies: [] })]]);

    const findings = importsMatchDeps(
      file(importsBaseUi, "ui/test"),
      ctx({ items }),
    );

    expect(findings[0].message).toContain("@base-ui/react");
  });

  it("errors on an undeclared internal registry import", () => {
    const content = `import { Card } from "@/components/ui/card";`;
    const items = new Map([["ui/test", depsMeta()]]);
    const findings = importsMatchDeps(file(content, "ui/test"), ctx({ items }));
    expect(findings[0].message).toContain("@kira-kit/card");
  });

  it("errors on a declared dependency that is never imported", () => {
    const items = new Map([
      ["ui/test", depsMeta({ dependencies: ["@base-ui/react", "lodash"] })],
    ]);

    const findings = importsMatchDeps(
      file(importsBaseUi, "ui/test"),
      ctx({ items }),
    );

    expect(findings.some((f) => f.message.includes("lodash"))).toBe(true);
  });

  it("exempts support modules embedded as files", () => {
    const content = `import { guard } from "@/components/ui/prop-guards";`;
    const items = new Map([["ui/test", depsMeta({ dependencies: [] })]]);
    expect(
      importsMatchDeps(file(content, "ui/test"), ctx({ items })),
    ).toHaveLength(0);
  });
});

describe("suppressions", () => {
  it("errors on a suppression without a reason", () => {
    const { errors, suppressions } = parseSuppressions(
      `// kira-kit-ignore raw-colors`,
      "ui/test",
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].severity).toBe("error");
    expect(suppressions.line).toHaveLength(0);
  });

  it("suppresses a finding on the line below the comment", () => {
    const source = `const a = "#fff"; // line 1\n// kira-kit-ignore raw-colors: matched palette\nconst b = "#000";`;
    const { errors, suppressions } = parseSuppressions(source, "ui/test");
    expect(errors).toHaveLength(0);

    const finding = {
      checkId: "raw-colors",
      severity: "error" as const,
      file: "ui/test",
      line: 3,
      message: "x",
    };

    expect(isSuppressed(finding, suppressions)).toBe(true);
    const notCovered = { ...finding, line: 1 };
    expect(isSuppressed(notCovered, suppressions)).toBe(false);
  });

  it("file-level suppression covers every line", () => {
    const source = `/* kira-kit-ignore-file raw-colors: legacy file */\nconst a = "#fff";`;
    const { suppressions } = parseSuppressions(source, "ui/test");

    const finding = {
      checkId: "raw-colors",
      severity: "error" as const,
      file: "ui/test",
      line: 2,
      message: "x",
    };

    expect(isSuppressed(finding, suppressions)).toBe(true);
  });

  it("warns when a suppression matches nothing", () => {
    const source = `// kira-kit-ignore raw-colors: nothing here`;
    const { suppressions } = parseSuppressions(source, "ui/test");
    const unused = unusedSuppressions([], suppressions, "ui/test");
    expect(unused).toHaveLength(1);
    expect(unused[0].severity).toBe("warning");
  });
});

describe("runChecks", () => {
  const repoRoot = fileURLToPath(
    new URL("./fixtures/mini-repo", import.meta.url),
  );

  it("counts suppressed findings and fails on errors", () => {
    const result = runChecks({
      repoRoot,
      paths: [],
      ci: true,
    });

    expect(result.filesChecked).toBeGreaterThan(0);
    expect(result.findings.some((f) => f.checkId === "reduced-motion")).toBe(
      true,
    );
    expect(result.failing).toBe(result.findings.length);
  });

  it("does not report a suppression that matched a finding as unused", () => {
    const result = runChecks({ repoRoot, paths: [], ci: true });
    expect(result.suppressed).toBeGreaterThan(0);
    expect(
      result.findings.some(
        (f) => f.checkId === "suppression" && f.file === "ui/card",
      ),
    ).toBe(false);
  });

  it("formats findings as github annotations", () => {
    const result = {
      findings: [
        {
          checkId: "raw-colors",
          severity: "error" as const,
          file: "ui/button",
          line: 3,
          message: "bad",
        },
      ],
      suppressed: 0,
      ci: true,
      failing: 1,
      filesChecked: 1,
    };

    const github = formatFindings(result, "github");
    expect(github).toContain(
      "::error file=src/components/ui/button,line=3,title=raw-colors::bad",
    );
  });
});
