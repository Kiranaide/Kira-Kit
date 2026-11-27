import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { check } from "../src/commands/check";
import { listComponents } from "../src/commands/list";
import { searchItems } from "../src/commands/search";
import { viewItems } from "../src/commands/view";
import { EXIT_CHECKS, EXIT_OK, ValidationError } from "../src/lib/errors";

const tempDirs: string[] = [];

function makeFixtureProject(): string {
  const root = mkdtempSync(join(tmpdir(), "kira-query-"));

  tempDirs.push(root);

  const registryDir = join(root, "registry");
  mkdirSync(registryDir, { recursive: true });

  const index = {
    name: "kira-kit",
    items: [
      {
        name: "button",
        type: "registry:ui",
        title: "Button",
        description: "Interactive button primitive with variants.",
      },
      {
        name: "date-picker",
        type: "registry:ui",
        title: "Date Picker",
        description: "Calendar and range selector using native popover.",
      },
      {
        name: "use-reduced-motion",
        type: "registry:hook",
        title: "useReducedMotion",
        description: "Tracks prefers-reduced-motion media query.",
      },
    ],
  };

  const buttonItem = {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description: "Interactive button primitive with variants.",
    dependencies: ["@base-ui/react", "cn"],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
        content: `export function Button() { return <button />; }\n`,
      },
    ],
  };

  writeFileSync(join(registryDir, "registry.json"), JSON.stringify(index));
  writeFileSync(join(registryDir, "button.json"), JSON.stringify(buttonItem));

  const registryTemplate = `${pathToFileURL(registryDir).href}/{name}.json`;

  writeFileSync(
    join(root, "components.json"),
    JSON.stringify({
      registries: { "@kira-kit": registryTemplate },
    }),
  );

  return root;
}

afterEach(() => {
  vi.restoreAllMocks();

  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("list command", () => {
  it("outputs machine-readable JSON with --json", async () => {
    const cwd = makeFixtureProject();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await listComponents({ cwd, json: true });

    expect(code).toBe(EXIT_OK);
    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0] ?? "[]"));
    expect(payload).toHaveLength(3);
    expect(payload.map((entry: { name: string }) => entry.name)).toEqual([
      "button",
      "date-picker",
      "use-reduced-motion",
    ]);
  });

  it("prints a formatted table in default mode", async () => {
    const cwd = makeFixtureProject();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await listComponents({ cwd });

    expect(code).toBe(EXIT_OK);
    const output = logSpy.mock.calls.map((args) => args.join(" ")).join("\n");
    expect(output).toContain("button");
    expect(output).toContain("date-picker");
    expect(output).toContain("3 item(s) available");
  });
});

describe("search command", () => {
  it("filters entries by multi-word query and outputs JSON", async () => {
    const cwd = makeFixtureProject();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await searchItems({
      cwd,
      query: ["native", "popover"],
      json: true,
    });

    expect(code).toBe(EXIT_OK);
    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0] ?? "[]"));
    expect(payload).toHaveLength(1);
    expect(payload[0].name).toBe("date-picker");
  });

  it("returns all entries when query is empty", async () => {
    const cwd = makeFixtureProject();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await searchItems({ cwd, query: [], json: true });

    expect(code).toBe(EXIT_OK);
    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0] ?? "[]"));
    expect(payload).toHaveLength(3);
  });
});

describe("view command", () => {
  it("throws ValidationError when no items are passed", async () => {
    const cwd = makeFixtureProject();

    await expect(viewItems({ cwd, items: [] })).rejects.toThrow(
      ValidationError,
    );
  });

  it("prints item metadata, dependencies, and file contents", async () => {
    const cwd = makeFixtureProject();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await viewItems({ cwd, items: ["button"] });

    expect(code).toBe(EXIT_OK);
    const output = logSpy.mock.calls.map((args) => args.join(" ")).join("\n");
    expect(output).toContain("Button (button)");
    expect(output).toContain("@base-ui/react, cn");
    expect(output).toContain("--- ui/button.tsx ---");
    expect(output).toContain("export function Button()");
  });
});

describe("check command", () => {
  const miniRepo = fileURLToPath(
    new URL("./fixtures/mini-repo", import.meta.url),
  );

  it("accepts injectable cwd and reports JSON findings in --ci mode", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const code = await check({
      cwd: miniRepo,
      paths: [],
      ci: true,
      json: true,
    });

    expect(code).toBe(EXIT_CHECKS);
    expect(errSpy).toHaveBeenCalled();
    const parsed = JSON.parse(String(logSpy.mock.calls[0]?.[0] ?? "{}"));
    expect(parsed.filesChecked).toBeGreaterThan(0);
    expect(parsed.failing).toBe(parsed.findings.length);
  });

  it("returns EXIT_OK when checking a clean component directory", async () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-check-clean-"));

    tempDirs.push(dir);
    mkdirSync(join(dir, "src/components/ui"), { recursive: true });
    writeFileSync(join(dir, "src/index.css"), "");
    writeFileSync(
      join(dir, "src/components/ui/clean.tsx"),
      `import { cn } from "cn";\nexport function Clean() {\n  return <div data-slot="clean" className={cn("h-6 w-6")} />;\n}\n`,
    );

    vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await check({
      cwd: dir,
      paths: [],
      ci: true,
      json: false,
    });

    expect(code).toBe(EXIT_OK);
  });
});
