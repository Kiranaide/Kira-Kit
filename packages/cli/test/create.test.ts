import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createProject } from "../src/commands/create";
import { runCreate } from "../src/core/create/engine";
import type { DepInstaller } from "../src/core/install/deps";
import { ValidationError } from "../src/lib/errors";

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-create-test-"));
  tempDirs.push(dir);

  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("createProject", () => {
  it("scaffolds a template into cwd, personalizes package.json, and invokes injected adapters", async () => {
    const root = makeTempDir();
    const gitCalls: string[] = [];
    const installCalls: string[] = [];

    const fakeInstaller: DepInstaller = {
      async install() {},
      async installAll(cwd) {
        installCalls.push(cwd);
      },
    };

    const outcome = await runCreate({
      cwd: root,
      dir: "my-vite-app",
      template: "vite",
      git: true,
      install: true,
      yes: true,
      installer: fakeInstaller,
      async gitInit(cwd) {
        gitCalls.push(cwd);
      },
    });

    const expectedTarget = join(root, "my-vite-app");

    expect(outcome).toEqual({
      template: "vite",
      targetDir: expectedTarget,
      gitInitialized: true,
      depsInstalled: true,
    });
    expect(gitCalls).toEqual([expectedTarget]);
    expect(installCalls).toEqual([expectedTarget]);
    expect(existsSync(join(expectedTarget, "package.json"))).toBe(true);

    const pkg = JSON.parse(
      readFileSync(join(expectedTarget, "package.json"), "utf-8"),
    );

    expect(pkg.name).toBe("my-vite-app");
  });

  it("rejects non-empty target directories", async () => {
    const root = makeTempDir();
    const target = join(root, "occupied");
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, "README.md"), "existing");

    await expect(
      createProject({
        cwd: root,
        dir: "occupied",
        template: "vite",
        git: false,
        install: false,
        yes: true,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("rejects unknown template names", async () => {
    const root = makeTempDir();

    await expect(
      createProject({
        cwd: root,
        dir: "bad-app",
        template: "unknown-framework",
        git: false,
        install: false,
        yes: true,
      }),
    ).rejects.toThrow(ValidationError);
  });
});
