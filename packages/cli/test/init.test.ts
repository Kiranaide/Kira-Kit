import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { init } from "../src/commands/init";
import type { DepInstaller } from "../src/core/install/deps";
import { DEFAULT_REGISTRY_URL } from "../src/lib/schemas";
import type { KiraConfig } from "../src/types";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempConsumer(deps: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-init-"));

  temps.push(dir);
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "consumer", dependencies: deps }),
    "utf-8",
  );

  return dir;
}

function fakeInstaller(calls: string[][]): DepInstaller {
  return {
    async install(_cwd, deps) {
      calls.push(deps);
    },
  };
}

function readJson<T>(path: string): T {
  // SAFETY: test helper reads JSON this suite wrote.
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

const REACT_19 = { react: "^19.3.1", "react-dom": "^19.3.1" };

describe("init (offline defaults)", () => {
  it("writes kira config, base CSS, utilities, and base deps", async () => {
    const dir = tempConsumer(REACT_19);
    const calls: string[][] = [];

    const code = await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);

    const config = readJson<KiraConfig>(join(dir, "kira-kit.json"));

    expect(config.$schema).toBe(
      "https://kira-kit.vercel.app/schema/kira-kit.json",
    );
    expect(config.registries?.["@kira-kit"]).toBe(DEFAULT_REGISTRY_URL);
    expect(config.aliases?.ui).toBe("@/components/ui");
    expect(config.css).toBe("src/index.css");
    expect(config.theme?.preset).toBe("default");
    expect(config.theme?.baseColor).toBe("neutral");

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(css).toContain("--primary: oklch(0.49 0.22 1)");
    expect(css).toContain("--radius: 0.45rem");
    expect(css).toContain('@import "./kira-utilities.css";');
    expect(css).toContain("@source inline(");
    expect(existsSync(join(dir, "src/kira-utilities.css"))).toBe(true);
    expect(calls.flat()).toContain("@base-ui/react");
    expect(calls.flat()).toContain("tw-animate-css");
  });

  it("detects Next.js and enables rsc", async () => {
    const dir = tempConsumer({ ...REACT_19, next: "^16.0.0" });

    await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller([]),
    });

    const config = readJson<KiraConfig>(join(dir, "kira-kit.json"));

    expect(config.rsc).toBe(true);
  });

  it("leaves an existing theme untouched", async () => {
    const dir = tempConsumer(REACT_19);
    const existing = ":root {\n  --primary: red;\n}\n";
    const cssDir = join(dir, "src");

    mkdirSync(cssDir, { recursive: true });
    writeFileSync(join(cssDir, "index.css"), existing, "utf-8");

    await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller([]),
    });

    expect(readFileSync(join(cssDir, "index.css"), "utf-8")).toBe(existing);
  });
});

describe("init (themes and gates)", () => {
  it("rejects React below 19.2", async () => {
    const dir = tempConsumer({ react: "^18.3.1", "react-dom": "^18.3.1" });

    await expect(
      init({ cwd: dir, force: false, yes: true, installer: fakeInstaller([]) }),
    ).rejects.toThrow(/19\.2/);
  });

  it("applies a local preset without network", async () => {
    const dir = tempConsumer(REACT_19);

    const code = await init({
      cwd: dir,
      preset: "ember-press",
      force: false,
      yes: true,
      installer: fakeInstaller([]),
    });

    expect(code).toBe(0);

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(css).not.toContain("--primary: oklch(0.49 0.22 1)");
    expect(existsSync(join(dir, "kira-theme.json"))).toBe(true);

    const config = readJson<KiraConfig>(join(dir, "kira-kit.json"));

    expect(config.theme?.preset).toBe("ember-press");
  });

  it("applies a custom primary color", async () => {
    const dir = tempConsumer(REACT_19);

    const code = await init({
      cwd: dir,
      primary: "#e2694a",
      force: false,
      yes: true,
      installer: fakeInstaller([]),
    });

    expect(code).toBe(0);

    const theme = readJson<{
      name: string;
      cssVars: { light: Record<string, string> };
    }>(join(dir, "kira-theme.json"));

    expect(theme.name).toBe("theme-custom");
    expect(theme.cssVars.light["--primary"]).toMatch(/^oklch\(/);

    const config = readJson<KiraConfig>(join(dir, "kira-kit.json"));

    expect(config.theme?.primary).toBe("#e2694a");
    expect(config.theme?.preset).toBeUndefined();
  });
});
