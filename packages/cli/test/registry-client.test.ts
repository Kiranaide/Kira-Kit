import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  dependencyAddress,
  fetchIndex,
  fetchItem,
  resolveAddress,
  resolveTree,
} from "../src/core/install/client";
import { RegistryError, ValidationError } from "../src/lib/errors";
import type { RegistryItemPayload } from "../src/lib/schemas";

let tempDirs: string[] = [];

function tempRegistry(
  files: Record<string, Partial<RegistryItemPayload>>,
): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-client-"));
  tempDirs.push(dir);

  for (const [rel, content] of Object.entries(files)) {
    writeFileSync(join(dir, rel), JSON.stringify(content, null, 2));
  }

  return dir;
}

function payload(
  name: string,
  registryDependencies: string[] = [],
): RegistryItemPayload {
  return {
    name,
    type: "registry:ui",
    title: name,
    description: `The ${name} item.`,
    registryDependencies,
    files: [
      {
        path: `src/components/ui/${name}.tsx`,
        type: "registry:ui",
        content: "export {};",
      },
    ],
  };
}

afterEach(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
  vi.unstubAllGlobals();
});

describe("resolveAddress", () => {
  it("maps bare names to the default kira-kit registry", () => {
    expect(resolveAddress("button", { cwd: "/app" })).toEqual({
      kind: "url",
      location: "https://kira-kit.vercel.app/r/button.json",
    });
  });

  it("resolves namespaces through kira-kit.json registries", () => {
    const resolved = resolveAddress("@custom/foo", {
      cwd: "/app",
      registries: { "@custom": "https://example.com/r/{name}.json" },
    });

    expect(resolved.location).toBe("https://example.com/r/foo.json");
  });

  it("appends /name.json to templates without a placeholder", () => {
    const resolved = resolveAddress("@custom/foo", {
      cwd: "/app",
      registries: { "@custom": "https://example.com/r" },
    });

    expect(resolved.location).toBe("https://example.com/r/foo.json");
  });

  it("resolves file:// templates to local paths", () => {
    const dir = tempRegistry({ "button.json": payload("button") });
    const template = pathToFileURL(join(dir, "{name}.json")).href;

    const resolved = resolveAddress("@kira-kit/button", {
      cwd: "/app",
      registries: { "@kira-kit": template },
    });

    expect(resolved.kind).toBe("file");
    expect(resolved.location).toBe(join(dir, "button.json"));
  });

  it("resolves local paths against cwd", () => {
    const dir = tempRegistry({});
    const resolved = resolveAddress("./r/button.json", { cwd: dir });

    expect(resolved.kind).toBe("file");
    expect(resolved.location).toBe(join(dir, "r/button.json"));
  });

  it("rejects unknown namespaces", () => {
    expect(() => resolveAddress("@nope/foo", { cwd: "/app" })).toThrow(
      ValidationError,
    );
  });
});

describe("dependencyAddress", () => {
  it("inherits the parent namespace for bare deps", () => {
    const parent = {
      kind: "url" as const,
      location: "https://x.test/r/a.json",
    };

    expect(dependencyAddress("button", "@kira-kit/widget", parent)).toBe(
      "@kira-kit/button",
    );
  });

  it("resolves bare deps as siblings of local files", () => {
    const parent = { kind: "file" as const, location: join("/reg", "a.json") };

    expect(dependencyAddress("button", "./a.json", parent)).toBe(
      join("/reg", "button.json"),
    );
  });

  it("resolves bare deps as sibling URLs", () => {
    const parent = {
      kind: "url" as const,
      location: "https://x.test/r/a.json",
    };

    expect(dependencyAddress("button", "https://x.test/r/a.json", parent)).toBe(
      "https://x.test/r/button.json",
    );
  });

  it("passes through addresses and resolves relative deps", () => {
    const parent = {
      kind: "url" as const,
      location: "https://x.test/r/a.json",
    };

    expect(dependencyAddress("@other/b", "@kira-kit/a", parent)).toBe(
      "@other/b",
    );
    expect(dependencyAddress("../shared/b.json", "@kira-kit/a", parent)).toBe(
      "https://x.test/shared/b.json",
    );
  });
});

describe("resolveTree (local registry)", () => {
  it("resolves deps before dependents and dedupes shared items", async () => {
    const dir = tempRegistry({
      "widget.json": payload("widget", ["@kira-kit/button", "@kira-kit/card"]),
      "card.json": payload("card", ["@kira-kit/button"]),
      "button.json": payload("button"),
    });

    const template = pathToFileURL(join(dir, "{name}.json")).href;

    const items = await resolveTree(["@kira-kit/widget"], {
      cwd: "/app",
      registries: { "@kira-kit": template },
    });

    expect(items.map((i) => i.name)).toEqual(["button", "card", "widget"]);
  });

  it("resolves bare deps as sibling files", async () => {
    const dir = tempRegistry({
      "widget.json": payload("widget", ["button"]),
      "button.json": payload("button"),
    });

    const items = await resolveTree([join(dir, "widget.json")], {
      cwd: "/app",
    });

    expect(items.map((i) => i.name)).toEqual(["button", "widget"]);
  });

  it("tolerates circular dependencies and fetches each item once", async () => {
    const dir = tempRegistry({
      "a.json": payload("a", ["@kira-kit/b"]),
      "b.json": payload("b", ["@kira-kit/a"]),
    });

    const template = pathToFileURL(join(dir, "{name}.json")).href;

    const items = await resolveTree(["@kira-kit/a", "@kira-kit/b"], {
      cwd: "/app",
      registries: { "@kira-kit": template },
    });

    expect(items.map((i) => i.name).sort()).toEqual(["a", "b"]);
  });

  it("rejects missing files and malformed payloads", async () => {
    const dir = tempRegistry({ "bad.json": { type: "registry:ui" } });

    await expect(
      fetchItem(join(dir, "missing.json"), { cwd: "/app" }),
    ).rejects.toThrow(RegistryError);
    await expect(
      fetchItem(join(dir, "bad.json"), { cwd: "/app" }),
    ).rejects.toThrow("Invalid registry item payload");
  });
});

describe("fetch over http", () => {
  it("fetches items and the index from the configured registry", async () => {
    const fetchMock = vi.fn(async (url: string) => ({
      ok: true,
      text: async () =>
        JSON.stringify(
          url.endsWith("registry.json")
            ? { items: [{ name: "button", type: "registry:ui" }] }
            : payload("button"),
        ),
    }));

    vi.stubGlobal("fetch", fetchMock);

    const ctx = {
      cwd: "/app",
      registries: { "@kira-kit": "https://registry.test/r/{name}.json" },
    };

    const item = await fetchItem("@kira-kit/button", ctx);

    expect(item.name).toBe("button");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://registry.test/r/button.json",
    );

    const index = await fetchIndex(ctx);

    expect(index.map((i) => i.name)).toEqual(["button"]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://registry.test/r/registry.json",
    );
  });

  it("reports HTTP failures as registry errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 404 })),
    );

    await expect(
      fetchItem("@kira-kit/button", { cwd: "/app" }),
    ).rejects.toThrow("HTTP 404");
  });
});
