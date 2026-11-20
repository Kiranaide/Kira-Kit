import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { buildPayloads } from "../src/core/registry/build";
import { loadSourceRegistry } from "../src/core/registry/loader";
import {
  deriveMotionCss,
  extractMotionAssets,
} from "../src/core/registry/motion-css";
import { mergeCssRulesText } from "../src/core/install/css-rules";

const KIT_CSS = `:root {
  --ease-spring: linear(0, 0.5, 1);
}

@theme inline {
  --animate-shimmer: shimmer 2s infinite;
  --animate-route-zoom: route-zoom 0.25s var(--ease-spring) both;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@keyframes route-zoom {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes progress-stripes {
  from { background-position: 0 0; }
  to { background-position: 1rem 0; }
}

@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

const UTILITIES_CSS = `@theme inline {
  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--accordion-panel-height, auto); }
  }
}
`;

const assets = extractMotionAssets(KIT_CSS + "\n" + UTILITIES_CSS);

describe("extractMotionAssets", () => {
  it("collects animate and ease tokens with normalized values", () => {
    expect(assets.tokens.get("--animate-shimmer")).toBe("shimmer 2s infinite");
    expect(assets.tokens.get("--ease-spring")).toBe("linear(0, 0.5, 1)");
  });

  it("collects keyframes at any nesting depth", () => {
    expect(assets.keyframes.get("shimmer")).toContain("@keyframes shimmer {");
    expect(assets.keyframes.get("accordion-down")).toContain(
      "@keyframes accordion-down {",
    );
    expect(assets.keyframes.get("accordion-down")).toContain(
      "var(--accordion-panel-height, auto)",
    );
  });
});

describe("deriveMotionCss", () => {
  it("emits token, keyframes, and a slot-scoped reduced-motion gate for animate classes", () => {
    const css = deriveMotionCss(
      `<div data-slot="skeleton" className="animate-shimmer" />`,
      assets,
    );

    expect(css).toContain("@theme inline {");
    expect(css).toContain("--animate-shimmer: shimmer 2s infinite;");
    expect(css).toContain("@keyframes shimmer {");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain('[data-slot="skeleton"] {');
  });

  it("ignores builtin Tailwind animations", () => {
    expect(
      deriveMotionCss(
        `<div data-slot="x" className="animate-spin animate-pulse" />`,
        assets,
      ),
    ).toBeUndefined();
  });

  it("pulls keyframes from arbitrary animate values", () => {
    const css = deriveMotionCss(
      `<div data-slot="progress" className="animate-[progress-stripes_1s_linear_infinite]" />`,
      assets,
    );

    expect(css).toContain("@keyframes progress-stripes {");
    expect(css).not.toContain("@theme inline");
  });

  it("pulls keyframes referenced by bare name in string literals", () => {
    const css = deriveMotionCss(
      `const style = { animation: "scan-line " + duration + "ms linear infinite" };
       <div data-slot="camera-scan-overlay-line" style={style} />`,
      assets,
    );

    expect(css).toContain("@keyframes scan-line {");
  });

  it("does not treat class fragments as bare keyframe names", () => {
    const css = deriveMotionCss(
      `<div data-slot="x" className="animate-in fade-in-0 motion-safe:animate-shimmer" />`,
      assets,
    );

    // fade-in-0 must not drag in a bare fade-in keyframe block; shimmer
    // comes from the animate class, not the literal scan.
    expect(css).toContain("--animate-shimmer");
    expect(css).not.toContain("@keyframes fade-in");
  });

  it("closes over ease tokens referenced by animate token values", () => {
    const css = deriveMotionCss(
      `<div data-slot="route-transition" className="animate-route-zoom" />`,
      assets,
    );

    expect(css).toContain(":root {");
    expect(css).toContain("--ease-spring: linear(0, 0.5, 1);");
    expect(css).toContain("@keyframes route-zoom {");
  });

  it("skips blocks already present in curated css", () => {
    const curated = `@theme inline {
  --animate-shimmer: shimmer 2s infinite;
}

@keyframes shimmer {
  from { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="skeleton"] { animation-duration: 0.01ms !important; }
}
`;

    expect(
      deriveMotionCss(
        `<div data-slot="skeleton" className="animate-shimmer" />`,
        assets,
        curated,
      ),
    ).toBeUndefined();
  });

  it("returns undefined when the item uses no animations", () => {
    expect(
      deriveMotionCss(`<div data-slot="box" className="flex" />`, assets),
    ).toBeUndefined();
  });
});

describe("derived motion css merge", () => {
  it("backfills into an existing themed stylesheet idempotently", () => {
    const consumer = `@import "tailwindcss";

:root {
  --primary: oklch(0.6 0.2 1);
}
`;

    const derived = deriveMotionCss(
      `<div data-slot="skeleton" className="animate-shimmer" />`,
      assets,
    );

    const merged = mergeCssRulesText(consumer, derived ?? "");

    expect(merged).toContain("--primary: oklch(0.6 0.2 1);");
    expect(merged).toContain("--animate-shimmer: shimmer 2s infinite;");
    expect(merged).toContain("@keyframes shimmer {");
    expect(mergeCssRulesText(merged, derived ?? "")).toBe(merged);
  });
});

describe("buildPayloads motion backfill", () => {
  const FIXTURE = fileURLToPath(
    new URL("./fixtures/mini-repo", import.meta.url),
  );

  const temps: string[] = [];

  afterEach(() => {
    for (const dir of temps.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("attaches derived motion css to items that use animations", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-motion-"));
    temps.push(dir);
    cpSync(FIXTURE, dir, { recursive: true });

    const widgetPath = join(dir, "src/components/ui/widget.tsx");
    const widget = readFileSync(widgetPath, "utf-8");
    writeFileSync(
      widgetPath,
      widget.replace(
        'cn("h-6 w-6 bg-primary"',
        'cn("animate-fade-in h-6 w-6 bg-primary"',
      ),
      "utf-8",
    );

    const payloads = buildPayloads(dir, loadSourceRegistry(dir));
    const widgetPayload = payloads.find((p) => p.name === "widget");
    const buttonPayload = payloads.find((p) => p.name === "button");
    const cardPayload = payloads.find((p) => p.name === "card");

    expect(widgetPayload?.css).toContain("--animate-fade-in:");
    expect(widgetPayload?.css).toContain("@keyframes fade-in {");
    expect(buttonPayload?.css).toContain("@keyframes fade-in {");
    expect(cardPayload?.css).toBeUndefined();
  });
});
