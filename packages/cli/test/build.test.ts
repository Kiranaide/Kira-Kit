import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { buildRegistry } from "../src/commands/build";
import { generateDocs, resolveDocsBaseUrl } from "../src/core/docs/generate";
import {
  REGISTRY_ITEM_SCHEMA_URL,
  buildPayloads,
} from "../src/core/registry/build";
import { extractThemeTokens } from "../src/core/registry/css-assets";
import { loadSourceRegistry } from "../src/core/registry/loader";
import { validateRegistry } from "../src/core/registry/validate";
import type { RegistryIndex, SourceRegistry } from "../src/lib/schemas";

const FIXTURE = fileURLToPath(new URL("./fixtures/mini-repo", import.meta.url));

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function copyFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-build-"));

  temps.push(dir);
  cpSync(FIXTURE, dir, { recursive: true });

  return dir;
}

function readJson<T>(path: string): T {
  // SAFETY: test helpers only read JSON this suite (or the fixture) wrote.
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function editUiRegistry(
  dir: string,
  mutate: (registry: SourceRegistry) => void,
): void {
  const path = join(dir, "src/components/ui/registry.json");
  const registry = readJson<SourceRegistry>(path);

  mutate(registry);
  writeFileSync(path, JSON.stringify(registry, null, 2), "utf-8");
}

describe("validateRegistry", () => {
  it("accepts the fixture repo with complete lib dependencies", () => {
    const loaded = loadSourceRegistry(FIXTURE);

    expect(validateRegistry(FIXTURE, loaded)).toEqual([]);
  });

  it("flags an unresolved lib import when the dep is removed", () => {
    const dir = copyFixture();

    editUiRegistry(dir, (registry) => {
      const widget = registry.items?.find((i) => i.name === "widget");

      if (widget) delete widget.registryDependencies;
    });

    const issues = validateRegistry(dir, loadSourceRegistry(dir));

    expect(
      issues.some(
        (i) =>
          i.item === "widget" && i.message.includes("@/lib/layout-responsive"),
      ),
    ).toBe(true);
  });

  it("flags a shipped file that does not exist", () => {
    const dir = copyFixture();

    editUiRegistry(dir, (registry) => {
      const button = registry.items?.find((i) => i.name === "button");

      button?.files?.push({ path: "ghost.tsx" });
    });

    const issues = validateRegistry(dir, loadSourceRegistry(dir));

    expect(
      issues.some(
        (i) => i.item === "button" && i.message.includes("does not exist"),
      ),
    ).toBe(true);
  });
});

describe("buildPayloads", () => {
  it("inlines file contents with repo-relative posix paths", () => {
    const loaded = loadSourceRegistry(FIXTURE);
    const payloads = buildPayloads(FIXTURE, loaded);
    const widget = payloads.find((p) => p.name === "widget");

    expect(widget?.$schema).toBe(REGISTRY_ITEM_SCHEMA_URL);
    expect(widget?.files?.[0]?.path).toBe("src/components/ui/widget.tsx");
    expect(widget?.files?.[0]?.content).toContain("helperLabel");
  });

  it("keeps lib file paths repo-relative", () => {
    const payloads = buildPayloads(FIXTURE, loadSourceRegistry(FIXTURE));
    const lib = payloads.find((p) => p.name === "layout-responsive");

    expect(lib?.files?.[0]?.path).toBe("src/lib/layout-responsive.ts");
  });

  it("emits kira-base with the base stylesheet and utilities", () => {
    const payloads = buildPayloads(FIXTURE, loadSourceRegistry(FIXTURE));
    const base = payloads.find((p) => p.name === "kira-base");

    expect(base?.type).toBe("registry:style");
    expect(base?.files?.map((f) => f.path)).toEqual([
      "kira-base.css",
      "kira-utilities.css",
    ]);
    expect(base?.files?.[1]?.content).toContain("no-scrollbar");
  });

  it("extracts depth-0 theme tokens from CSS", () => {
    const tokens = extractThemeTokens(
      readFileSync(join(FIXTURE, "src/index.css"), "utf-8"),
    );

    expect(tokens.light["--radius"]).toBe("0.5rem");
  });
});

describe("buildRegistry (integration)", () => {
  it("builds payloads, index, schemas, docs and prunes stale outputs", () => {
    const dir = copyFixture();

    mkdirSync(join(dir, "public/r"), { recursive: true });
    writeFileSync(join(dir, "public/r/index.json"), "{}", "utf-8");

    expect(buildRegistry({ cwd: dir, skipChecks: true })).toBe(0);
    expect(existsSync(join(dir, "public/r/index.json"))).toBe(false);

    const index = readJson<RegistryIndex>(join(dir, "public/r/registry.json"));

    expect(index.name).toBe("mini-repo");
    expect(index.items?.length).toBe(5);

    for (const entry of index.items ?? []) {
      for (const file of entry.files ?? []) {
        expect(file).not.toHaveProperty("content");
      }
    }

    const widgetPath = join(dir, "public/r/widget.json");
    const widget = readJson<{ files: Array<{ content: string }> }>(widgetPath);

    expect(widget.files[0]?.content).toContain("helperLabel");
    expect(existsSync(join(dir, "public/schema/registry.json"))).toBe(true);
    expect(existsSync(join(dir, "public/schema/components.json"))).toBe(true);
    expect(readFileSync(join(dir, "public/llms.txt"), "utf-8")).toContain(
      "kira-kit add @kira-kit/",
    );

    const themes = readJson<SourceRegistry>(
      join(dir, "src/themes/registry.json"),
    );

    expect(themes.items?.some((i) => i.name === "theme-default")).toBe(true);
  });

  it("returns a user error when validation fails", () => {
    const dir = copyFixture();

    editUiRegistry(dir, (registry) => {
      const widget = registry.items?.find((i) => i.name === "widget");

      if (widget) delete widget.registryDependencies;
    });

    expect(buildRegistry({ cwd: dir, skipChecks: true })).toBe(1);
    expect(existsSync(join(dir, "public/r/registry.json"))).toBe(false);
  });
});

describe("generateDocs / resolveDocsBaseUrl", () => {
  it("emits root-relative /docs/ links when no deployment origin is set", () => {
    expect(resolveDocsBaseUrl(undefined, {})).toBe("");

    const { llmsTxt } = generateDocs(
      [
        {
          name: "button",
          type: "registry:ui",
          title: "Button",
          description: "Base UI button.",
        },
      ],
      { repoRoot: FIXTURE, siteUrl: "" },
    );

    expect(llmsTxt).toContain("- [Button](/docs/button.md): Base UI button.");
    expect(llmsTxt).not.toContain("kira-kit.vercel.app");
    expect(llmsTxt).not.toMatch(/shadcn/i);
  });

  it("resolves deployed origins from explicit option or platform env vars", () => {
    expect(resolveDocsBaseUrl("https://ui.example.com/", {})).toBe(
      "https://ui.example.com",
    );
    expect(
      resolveDocsBaseUrl(undefined, {
        COOLIFY_FQDN: "ui.example.com,www.example.com",
      }),
    ).toBe("https://ui.example.com");
    expect(
      resolveDocsBaseUrl(undefined, {
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "kira.example.com",
        VERCEL_URL: "kira-abc123.vercel.app",
      }),
    ).toBe("https://kira.example.com");
    expect(
      resolveDocsBaseUrl(undefined, {
        VERCEL_ENV: "preview",
        VERCEL_PROJECT_PRODUCTION_URL: "kira.example.com",
        VERCEL_URL: "kira-abc123.vercel.app",
      }),
    ).toBe("https://kira-abc123.vercel.app");

    const { llmsTxt } = generateDocs(
      [
        {
          name: "button",
          type: "registry:ui",
          title: "Button",
          description: "Base UI button.",
        },
      ],
      { repoRoot: FIXTURE, siteUrl: "https://ui.example.com/" },
    );

    expect(llmsTxt).toContain(
      "- [Button](https://ui.example.com/docs/button.md): Base UI button.",
    );
  });
});
