import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  ensureNpmDeps,
  planMissingDeps,
  type DepInstaller,
} from "../src/core/install/deps";

const tempDirs: string[] = [];

interface TestPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

function makeProject(pkg: TestPackageJson): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-deps-"));

  tempDirs.push(dir);
  writeFileSync(join(dir, "package.json"), JSON.stringify(pkg));

  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("planMissingDeps", () => {
  it("pins majors that matter and keeps unpinned packages bare", () => {
    expect(planMissingDeps(["lucide-react", "cn"], {})).toEqual([
      "lucide-react@^1.76.0",
      "cn",
    ]);
  });

  it("treats dependencies, devDependencies, and peerDependencies as present", () => {
    const pkg = {
      dependencies: { cn: "^0.5.0" },
      devDependencies: { "lucide-react": "^1.76.0" },
      peerDependencies: { "@fontsource-variable/inter": "^5.0.0" },
    };

    expect(
      planMissingDeps(
        ["cn", "lucide-react", "@fontsource-variable/inter", "zod"],
        pkg,
      ),
    ).toEqual(["zod"]);
  });

  it("collapses duplicates", () => {
    expect(planMissingDeps(["cn", "cn"], {})).toEqual(["cn"]);
  });
});

describe("ensureNpmDeps", () => {
  it("skips the installer when a package lives only in devDependencies", async () => {
    const dir = makeProject({ devDependencies: { cn: "^0.5.0" } });
    const calls: string[][] = [];

    const installer: DepInstaller = {
      async install(_cwd, deps) {
        calls.push(deps);
      },
    };

    const installed = await ensureNpmDeps(
      dir,
      ["cn"],
      { yes: true },
      installer,
    );

    expect(installed).toBe(false);
    expect(calls).toEqual([]);
  });

  it("installs only the missing, pinned specs", async () => {
    const dir = makeProject({ dependencies: { cn: "^0.5.0" } });
    const calls: string[][] = [];

    const installer: DepInstaller = {
      async install(_cwd, deps) {
        calls.push(deps);
      },
    };

    const installed = await ensureNpmDeps(
      dir,
      ["cn", "lucide-react"],
      { yes: true },
      installer,
    );

    expect(installed).toBe(true);
    expect(calls).toEqual([["lucide-react@^1.76.0"]]);
  });
});
