import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { addComponents } from "../src/commands/add";
import type { RegistryItemPayload } from "../src/lib/schemas";
import type { AddOptions } from "../src/types";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }

  vi.restoreAllMocks();
});

function item(
  name: string,
  type: RegistryItemPayload["type"],
  path: string,
): RegistryItemPayload {
  return {
    name,
    type,
    title: name,
    description: `${name} item`,
    files: [{ path, type, content: `// ${name}\n` }],
  };
}

function tempRegistry(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-add-reg-"));

  temps.push(dir);

  const items = [
    item("button", "registry:ui", "src/components/ui/button.tsx"),
    item("use-thing", "registry:hook", "src/hooks/use-thing.ts"),
    item("helpers", "registry:lib", "src/lib/helpers.ts"),
    { name: "theme-x", type: "registry:theme", title: "X", description: "x" },
    item("kira-base", "registry:style", "kira-base.css"),
  ];

  for (const entry of items) {
    writeFileSync(join(dir, `${entry.name}.json`), JSON.stringify(entry));
  }

  writeFileSync(
    join(dir, "registry.json"),
    JSON.stringify({ name: "test", items }),
    "utf-8",
  );

  return dir;
}

function tempConsumer(regDir: string): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-add-app-"));

  temps.push(dir);
  writeFileSync(
    join(dir, "components.json"),
    JSON.stringify({
      style: "kira",
      tailwind: { css: "src/index.css" },
      registries: {
        "@kira-kit": pathToFileURL(join(regDir, "{name}.json")).href,
      },
    }),
    "utf-8",
  );
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies: { react: "^19.3.1" } }),
    "utf-8",
  );

  return dir;
}

function options(cwd: string, extra: Partial<AddOptions> = {}): AddOptions {
  return { items: [], cwd, overwrite: false, yes: true, all: false, ...extra };
}

describe("addComponents", () => {
  it("--all installs ui/hook/lib items but not themes or styles", async () => {
    const cwd = tempConsumer(tempRegistry());

    expect(await addComponents(options(cwd, { all: true }))).toBe(0);
    expect(existsSync(join(cwd, "src/components/ui/button.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "src/hooks/use-thing.ts"))).toBe(true);
    expect(existsSync(join(cwd, "src/lib/helpers.ts"))).toBe(true);
    expect(existsSync(join(cwd, "src/kira-base.css"))).toBe(false);
  });

  it("adds an explicit item with its content", async () => {
    const cwd = tempConsumer(tempRegistry());

    expect(await addComponents(options(cwd, { items: ["button"] }))).toBe(0);
    expect(
      readFileSync(join(cwd, "src/components/ui/button.tsx"), "utf-8"),
    ).toBe("// button\n");
  });

  it("rejects --all combined with explicit names", async () => {
    const cwd = tempConsumer(tempRegistry());

    await expect(
      addComponents(options(cwd, { all: true, items: ["button"] })),
    ).rejects.toThrow(/--all/);
  });

  it("--view prints contents without writing", async () => {
    const cwd = tempConsumer(tempRegistry());
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    expect(
      await addComponents(options(cwd, { items: ["button"], view: true })),
    ).toBe(0);
    expect(log.mock.calls.flat().join("\n")).toContain("// button");
    expect(existsSync(join(cwd, "src/components/ui/button.tsx"))).toBe(false);
  });

  it("--diff shows a patch and leaves existing files alone", async () => {
    const cwd = tempConsumer(tempRegistry());
    const target = join(cwd, "src/components/ui/button.tsx");

    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, "// old\n", "utf-8");

    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    expect(
      await addComponents(options(cwd, { items: ["button"], diff: true })),
    ).toBe(0);

    const output = log.mock.calls.flat().join("\n");

    expect(output).toContain("-// old");
    expect(output).toContain("+// button");
    expect(readFileSync(target, "utf-8")).toBe("// old\n");
  });
});
