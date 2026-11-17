import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Resolved export of shadcn's "." entry — its CLI bin target. */
const SHADCN_EXPORTS = [".", "./schema", "./registry"];

/**
 * Resolve the shadcn CLI entry point from kira-kit's own node_modules so
 * behavior is locked to the pinned version, never PATH drift.
 *
 * shadcn's package.json restricts subpath exports (no "./package.json"), so
 * we resolve the "." export, which maps to the same dist/index.js as its bin.
 */
export function resolveShadcnBin(): string {
  for (const subpath of SHADCN_EXPORTS) {
    try {
      return require.resolve(`shadcn${subpath === "." ? "" : subpath}`);
    } catch {
      continue;
    }
  }
  throw new Error("shadcn CLI entry could not be resolved");
}

export function isShadcnAvailable(): boolean {
  try {
    resolveShadcnBin();
    return true;
  } catch {
    return false;
  }
}

export type SpawnResult = {
  code: number;
};

/**
 * Run the pinned shadcn CLI with passthrough stdio.
 * Returns the child's exit code; never throws except on spawn failure.
 */
export function runShadcn(
  args: string[],
  cwd: string = process.cwd(),
): Promise<SpawnResult> {
  const bin = resolveShadcnBin();
  const child = spawn(
    process.execPath,
    [...process.execArgv, bin, ...args],
    { stdio: "inherit", cwd, env: process.env },
  );

  return new Promise((resolvePromise, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => resolvePromise({ code: code ?? 0 }));
  });
}

/**
 * Run shadcn and map failures onto the kira-kit exit-code contract.
 * Returns 0 on success, 2 when the shadcn binary itself is missing/unlaunchable.
 */
export async function runShadcnChecked(
  args: string[],
  cwd: string = process.cwd(),
): Promise<number> {
  try {
    const { code } = await runShadcn(args, cwd);
    return code;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("ENOENT")) {
      console.error(
        "error: the pinned shadcn CLI could not be launched. Reinstall kira-kit (e.g. npm install kira-kit) and retry.",
      );
      return 2;
    }
    throw error;
  }
}
