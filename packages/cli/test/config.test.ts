import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  findConfigFile,
  getRegistryUrl,
  readConfig,
  upsertKiraRegistry,
} from "../src/lib/config";
import { componentsConfigSchema } from "../src/lib/schemas";

let tempDirs: string[] = [];

// oxlint-disable-next-line anti-slop/no-unknown-parameters -- test helper serializes arbitrary fixture JSON, including intentionally invalid shapes
function tempProject(componentsJson: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-kit-test-"));
  writeFileSync(
    join(dir, "components.json"),
    JSON.stringify(componentsJson, null, 2),
  );
  tempDirs.push(dir);

  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
});

describe("config", () => {
  it("finds and reads components.json", () => {
    const dir = tempProject({
      style: "new-york",
      tailwind: { css: "src/app.css" },
    });

    expect(findConfigFile(dir)).toBe(join(dir, "components.json"));
    const config = readConfig(dir);
    expect(config?.tailwind?.css).toBe("src/app.css");
  });

  it("returns null when no components.json exists", () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-kit-empty-"));
    tempDirs.push(dir);
    expect(findConfigFile(dir)).toBeNull();
    expect(readConfig(dir)).toBeNull();
  });

  it("preserves unknown keys and other registries when upserting", () => {
    const dir = tempProject({
      style: "new-york",
      registries: { "@custom": "https://example.com/r/{name}.json" },
      someFutureField: true,
    });

    expect(
      upsertKiraRegistry(dir, "https://kira-kit.vercel.app/r/{name}.json"),
    ).toBe(true);
    const raw = JSON.parse(readFileSync(join(dir, "components.json"), "utf-8"));
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
    const raw = JSON.parse(readFileSync(join(dir, "components.json"), "utf-8"));
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

describe("componentsConfigSchema", () => {
  it("parses a shadcn-written config with extra keys", () => {
    const parsed = componentsConfigSchema.parse({
      $schema: "https://unpkg.com/shadcn@latest/schema/config.json",
      style: "new-york",
      rsc: true,
      tsx: true,
      tailwind: {
        css: "src/app.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      aliases: { components: "@/components", ui: "@/components/ui" },
      registries: { "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json" },
      unknownFuture: { nested: [1, 2] },
    });

    expect(parsed.style).toBe("new-york");
    expect(parsed.registries?.["@kira-kit"]).toContain("{name}.json");
  });

  it("rejects non-object input", () => {
    expect(() => componentsConfigSchema.parse("nope")).toThrow();
  });
});
