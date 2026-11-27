import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  findConfigFile,
  findLegacyConfigFile,
  getRegistryUrl,
  readConfig,
  upsertKiraRegistry,
} from "../src/lib/config";
import { kiraConfigSchema } from "../src/lib/schemas";

let tempDirs: string[] = [];

// oxlint-disable-next-line anti-slop/no-unknown-parameters -- test helper serializes arbitrary fixture JSON, including intentionally invalid shapes
function tempProject(kiraConfig: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-kit-test-"));
  writeFileSync(
    join(dir, "kira-kit.json"),
    JSON.stringify(kiraConfig, null, 2),
  );
  tempDirs.push(dir);

  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
});

describe("config", () => {
  it("finds and reads kira-kit.json", () => {
    const dir = tempProject({
      css: "src/app.css",
      theme: { preset: "default", baseColor: "neutral" },
    });

    expect(findConfigFile(dir)).toBe(join(dir, "kira-kit.json"));
    const config = readConfig(dir);
    expect(config?.css).toBe("src/app.css");
    expect(config?.theme?.preset).toBe("default");
    expect(config?.theme?.baseColor).toBe("neutral");
  });

  it("ignores legacy components.json during normal config reads", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-kit-legacy-"));
    tempDirs.push(dir);
    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({ tailwind: { css: "src/app.css" } }),
    );

    expect(findConfigFile(dir)).toBeNull();
    expect(findLegacyConfigFile(dir)).toBe(join(dir, "components.json"));
    expect(readConfig(dir)).toBeNull();
  });

  it("returns null when no kira-kit.json exists", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-kit-empty-"));
    tempDirs.push(dir);
    expect(findConfigFile(dir)).toBeNull();
    expect(readConfig(dir)).toBeNull();
  });

  it("preserves unknown keys and other registries when upserting", () => {
    const dir = tempProject({
      css: "src/index.css",
      registries: { "@custom": "https://example.com/r/{name}.json" },
      someFutureField: true,
    });

    expect(
      upsertKiraRegistry(dir, "https://kira-kit.vercel.app/r/{name}.json"),
    ).toBe(true);
    const raw = JSON.parse(readFileSync(join(dir, "kira-kit.json"), "utf-8"));
    expect(raw.registries["@custom"]).toBe("https://example.com/r/{name}.json");
    expect(raw.registries["@kira-kit"]).toBe(
      "https://kira-kit.vercel.app/r/{name}.json",
    );
    expect(raw.someFutureField).toBe(true);

    // Idempotent: a second call with the same URL is a no-op.
    expect(
      upsertKiraRegistry(dir, "https://kira-kit.vercel.app/r/{name}.json"),
    ).toBe(false);
  });

  it("never clobbers a user-configured registry URL", () => {
    const dir = tempProject({
      registries: { "@kira-kit": "https://mirror.example.com/r/{name}.json" },
    });

    expect(upsertKiraRegistry(dir)).toBe(false);
    const raw = JSON.parse(readFileSync(join(dir, "kira-kit.json"), "utf-8"));
    expect(raw.registries["@kira-kit"]).toBe(
      "https://mirror.example.com/r/{name}.json",
    );
  });

  it("resolves the registry URL without the {name} suffix", () => {
    const dir = tempProject({
      registries: { "@kira-kit": "https://mirror.example.com/r/{name}.json" },
    });

    expect(getRegistryUrl(dir)).toBe("https://mirror.example.com/r");
  });
});

describe("kiraConfigSchema", () => {
  it("parses a kira-kit.json config with extra keys", () => {
    const parsed = kiraConfigSchema.parse({
      $schema: "https://kira-kit.vercel.app/schema/kira-kit.json",
      css: "src/app.css",
      rsc: true,
      iconLibrary: "tabler",
      theme: { preset: "default", baseColor: "neutral", font: "geist" },
      aliases: { components: "@/components", ui: "@/components/ui" },
      registries: { "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json" },
      unknownFuture: { nested: [1, 2] },
    });

    expect(parsed.css).toBe("src/app.css");
    expect(parsed.theme?.preset).toBe("default");
    expect(parsed.theme?.baseColor).toBe("neutral");
    expect(parsed.registries?.["@kira-kit"]).toContain("{name}.json");
  });

  it("rejects non-object input", () => {
    expect(() => kiraConfigSchema.parse("nope")).toThrow();
  });
});
