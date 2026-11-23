import {
  configureRuntime,
  type RuntimeConfigResult,
} from "./configure-runtime";
import { detectProjectRuntime, type DetectedRuntime } from "./detect-runtime";
import { configureTsconfigPaths } from "./tsconfig";

export interface ProjectRuntimeSetupResult extends RuntimeConfigResult {
  runtime: DetectedRuntime;
  aliasTarget: string;
}

/**
 * Single setup seam for `kira-kit init`: detect the runtime (if not already
 * detected), wire `@/*` paths in tsconfig, and configure the bundler/PostCSS
 * plugin for Tailwind CSS v4.
 */
export function setupProjectRuntime(
  cwd: string,
  detected?: DetectedRuntime,
): ProjectRuntimeSetupResult {
  const runtime = detected ?? detectProjectRuntime(cwd);
  const tsResult = configureTsconfigPaths(cwd);
  const runtimeResult = configureRuntime(cwd, runtime);
  const notes = [...runtimeResult.notes];

  if (tsResult.updatedFiles.length > 0) {
    notes.unshift(
      `Configured "@/*" -> "${tsResult.aliasTarget}" in ${tsResult.updatedFiles.join(", ")}.`,
    );
  }

  return {
    runtime,
    aliasTarget: tsResult.aliasTarget,
    updatedFiles: [...tsResult.updatedFiles, ...runtimeResult.updatedFiles],
    notes,
    warnings: runtimeResult.warnings,
  };
}
