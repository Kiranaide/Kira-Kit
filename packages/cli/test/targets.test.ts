import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  importAliases,
  resolveAliasRoots,
  targetForFile,
} from "../src/core/install/targets";
import type { ComponentsConfig } from "../src/types";

let tempDirs: string[] = [];

function tempProject(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-targets-"));
  tempDirs.push(dir);

  for (const [rel, content] of Object.entries(files)) {
    const path = join(dir, rel);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, content);
  }

  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
});

const VITE_TSCONFIG = JSON.stringify({
  compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
});

describe("resolveAliasRoots", () => {
  it("resolves vite-style tsconfig paths", () => {
    const dir = tempProject({ "tsconfig.json": VITE_TSCONFIG });
    const roots = resolveAliasRoots(dir, null);

    expect(roots.ui).toBe(join(dir, "src/components/ui"));
    expect(roots.lib).toBe(join(dir, "src/lib"));
    expect(roots.hooks).toBe(join(dir, "src/hooks"));
  });

  it("resolves monorepo paths to the UI package", () => {
    const dir = tempProject({
      "tsconfig.json": JSON.stringify({
        compilerOptions: { paths: { "@/*": ["packages/ui/src/*"] } },
      }),
    });

    const roots = resolveAliasRoots(dir, null);

    expect(roots.ui).toBe(join(dir, "packages/ui/src/components/ui"));
  });

  it("follows tsconfig extends chains", () => {
    const dir = tempProject({
      "tsconfig.base.json": JSON.stringify({
        compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
      }),
      "tsconfig.json": JSON.stringify({ extends: "./tsconfig.base.json" }),
    });

    expect(resolveAliasRoots(dir, null).ui).toBe(
      join(dir, "src/components/ui"),
    );
  });

  it("honors custom aliases from components.json", () => {
    const dir = tempProject({
      "tsconfig.json": JSON.stringify({
        compilerOptions: { paths: { "@kit/*": ["./kit/*"] } },
      }),
    });

    const config: ComponentsConfig = { aliases: { ui: "@kit/ui" } };

    expect(resolveAliasRoots(dir, config).ui).toBe(join(dir, "kit/ui"));
  });

  it("falls back to src/ without tsconfig paths", () => {
    const dir = tempProject({});

    expect(resolveAliasRoots(dir, null).ui).toBe(
      join(dir, "src/components/ui"),
    );
  });
});

describe("importAliases", () => {
  it("fills defaults for missing aliases", () => {
    const aliases = importAliases({ aliases: { ui: "@kit/ui" } });

    expect(aliases.ui).toBe("@kit/ui");
    expect(aliases.lib).toBe("@/lib");
    expect(aliases.utils).toBe("@/lib/utils");
  });
});

describe("targetForFile", () => {
  const app = join(tmpdir(), "kira-app");

  const roots = {
    components: join(app, "src/components"),
    ui: join(app, "src/components/ui"),
    hooks: join(app, "src/hooks"),
    lib: join(app, "src/lib"),
  };

  it("targets ui files by basename", () => {
    const target = targetForFile(
      { path: "src/components/ui/button.tsx" },
      "registry:ui",
      roots,
      app,
    );

    expect(target).toBe(join(app, "src/components/ui/button.tsx"));
  });

  it("preserves lib subdirectories", () => {
    const target = targetForFile(
      { path: "src/lib/camera/utils.ts" },
      "registry:lib",
      roots,
      app,
    );

    expect(target).toBe(join(app, "src/lib/camera/utils.ts"));
  });

  it("targets hooks and honors --path for ui", () => {
    expect(
      targetForFile(
        { path: "src/hooks/use-x.ts" },
        "registry:hook",
        roots,
        app,
      ),
    ).toBe(join(app, "src/hooks/use-x.ts"));

    expect(
      targetForFile(
        { path: "src/components/ui/button.tsx" },
        "registry:ui",
        roots,
        app,
        "src/legacy",
      ),
    ).toBe(join(app, "src/legacy/button.tsx"));
  });

  it("lets an explicit target win", () => {
    const target = targetForFile(
      { path: "src/components/ui/button.tsx", target: "custom/button.tsx" },
      "registry:ui",
      roots,
      app,
    );

    expect(target).toBe(join(app, "custom/button.tsx"));
  });
});
