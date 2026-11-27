import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createProject } from "../src/commands/create";
import {
  TEMPLATE_NAMES,
  buildScaffoldCommand,
  runCreate,
} from "../src/core/create/engine";
import type { DepInstaller } from "../src/core/install/deps";
import { ValidationError } from "../src/lib/errors";
import type { InitOptions, ScaffoldInvocation } from "../src/types";

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-create-test-"));
  tempDirs.push(dir);

  return dir;
}

function makeFakeInstaller(installCalls: string[]): DepInstaller {
  return {
    async install() {},
    async installAll(cwd) {
      installCalls.push(cwd);
    },
  };
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("buildScaffoldCommand", () => {
  it("builds non-interactive create-vite command using parent cwd and basename", () => {
    const parent = join("/tmp", "work");
    const target = join(parent, "my-vite-app");
    const cmd = buildScaffoldCommand("vite", target, "npm", false);

    expect(cmd).toEqual({
      command: "npx",
      args: [
        "-y",
        "create-vite@latest",
        "my-vite-app",
        "--template",
        "react-ts",
        "--no-immediate",
        "--no-interactive",
      ],
      cwd: parent,
      installedDeps: false,
    });
  });

  it("builds create-next-app command with detected package manager flag", () => {
    const target = join("/tmp", "work", "my-next-app");
    const cmd = buildScaffoldCommand("next", target, "pnpm", true);

    expect(cmd.command).toBe("pnpm");
    expect(cmd.args).toEqual([
      "dlx",
      "create-next-app@latest",
      "my-next-app",
      "--ts",
      "--tailwind",
      "--app",
      "--no-src-dir",
      "--import-alias",
      "@/*",
      "--yes",
      "--skip-install",
      "--disable-git",
      "--use-pnpm",
    ]);
    expect(cmd.installedDeps).toBe(false);
  });

  it("adds react and installs during create-astro only when install is enabled", () => {
    const target = join("/tmp", "work", "my-astro-app");
    const withInstall = buildScaffoldCommand("astro", target, "bun", true);
    const withoutInstall = buildScaffoldCommand("astro", target, "bun", false);

    expect(withInstall.command).toBe("bun");
    expect(withInstall.args).toContain("--add");
    expect(withInstall.args).toContain("react");
    expect(withInstall.args).toContain("--install");
    expect(withInstall.installedDeps).toBe(true);

    expect(withoutInstall.args).not.toContain("--add");
    expect(withoutInstall.args).toContain("--no-install");
    expect(withoutInstall.installedDeps).toBe(false);
  });

  it("builds @tanstack/cli create command for tanstack-start", () => {
    const target = join("/tmp", "work", "my-start-app");
    const cmd = buildScaffoldCommand("tanstack-start", target, "bun", false);

    expect(cmd.command).toBe("bun");
    expect(cmd.args).toEqual([
      "x",
      "@tanstack/cli@latest",
      "create",
      "my-start-app",
      "--framework",
      "React",
      "--build-tool",
      "vite",
      "--package-manager",
      "bun",
      "--no-install",
      "--no-git",
      "--no-intent",
      "--non-interactive",
      "--yes",
    ]);
    expect(cmd.installedDeps).toBe(false);
  });
});

describe("runCreate", () => {
  it("delegates to upstream scaffolder, runs init, installs deps, and initializes git", async () => {
    const root = makeTempDir();
    const scaffoldCalls: ScaffoldInvocation[] = [];
    const initCalls: InitOptions[] = [];
    const gitCalls: string[] = [];
    const installCalls: string[] = [];
    const fakeInstaller = makeFakeInstaller(installCalls);

    const outcome = await runCreate({
      cwd: root,
      dir: "my-vite-app",
      template: "vite",
      git: true,
      install: true,
      yes: true,
      installer: fakeInstaller,
      async scaffolder(invocation) {
        scaffoldCalls.push(invocation);
        mkdirSync(join(invocation.cwd, "my-vite-app"), { recursive: true });
      },
      async initProject(opts) {
        initCalls.push(opts);

        return 0;
      },
      async gitInit(cwd) {
        gitCalls.push(cwd);
      },
    });

    const expectedTarget = join(root, "my-vite-app");

    expect(outcome).toMatchObject({
      template: "vite",
      targetDir: expectedTarget,
      gitInitialized: true,
      depsInstalled: true,
    });
    expect(scaffoldCalls).toHaveLength(1);
    expect(scaffoldCalls[0]?.cwd).toBe(root);
    expect(scaffoldCalls[0]?.args).toContain("create-vite@latest");
    expect(installCalls).toEqual([expectedTarget]);
    expect(initCalls).toEqual([
      {
        cwd: expectedTarget,
        yes: true,
        force: true,
        skipDeps: false,
        installer: fakeInstaller,
      },
    ]);
    expect(gitCalls).toEqual([expectedTarget]);
  });
});

describe("runCreate install options", () => {
  it("passes skipDeps to init and skips installAll when install is false", async () => {
    const root = makeTempDir();
    const initCalls: InitOptions[] = [];
    const installCalls: string[] = [];

    const outcome = await runCreate({
      cwd: root,
      dir: "my-next-app",
      template: "next",
      git: false,
      install: false,
      yes: true,
      installer: makeFakeInstaller(installCalls),
      async scaffolder() {},
      async initProject(opts) {
        initCalls.push(opts);

        return 0;
      },
    });

    expect(outcome.depsInstalled).toBe(false);
    expect(installCalls).toEqual([]);
    expect(initCalls[0]?.skipDeps).toBe(true);
  });

  it("skips redundant installAll for astro when create-astro already installed deps", async () => {
    const root = makeTempDir();
    const installCalls: string[] = [];

    const outcome = await runCreate({
      cwd: root,
      dir: "my-astro-app",
      template: "astro",
      git: false,
      install: true,
      yes: true,
      installer: makeFakeInstaller(installCalls),
      async scaffolder() {},
      async initProject() {
        return 0;
      },
    });

    expect(outcome.depsInstalled).toBe(true);
    expect(installCalls).toEqual([]);
  });
});

describe("createProject validation", () => {
  it("exposes vite, next, astro, and tanstack-start templates without monorepo", () => {
    expect(TEMPLATE_NAMES).toEqual(["vite", "next", "astro", "tanstack-start"]);
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

  it("rejects unknown and removed template names", async () => {
    const root = makeTempDir();

    await expect(
      createProject({
        cwd: root,
        dir: "bad-app",
        template: "monorepo",
        git: false,
        install: false,
        yes: true,
      }),
    ).rejects.toThrow(ValidationError);
  });
});
