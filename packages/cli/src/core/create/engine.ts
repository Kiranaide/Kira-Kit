import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import {
  detect,
  resolveCommand,
  type AgentName,
} from "package-manager-detector";
import { ValidationError } from "../../lib/errors";
import { info } from "../../lib/logger";
import { init } from "../../commands/init";
import { installProjectDeps } from "../install/deps";
import type { CreateOptions, ScaffoldInvocation } from "../../types";

export const TEMPLATE_NAMES = [
  "vite",
  "next",
  "astro",
  "tanstack-start",
] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

export type ScaffoldPackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface CreateOutcome {
  template: TemplateName;
  targetDir: string;
  gitInitialized: boolean;
  depsInstalled: boolean;
  packageManager: ScaffoldPackageManager;
}

interface UpstreamSpec {
  args: string[];
  installedDeps: boolean;
}

export function validateTemplateName(raw: string): TemplateName {
  const match = TEMPLATE_NAMES.find((name) => name === raw);

  if (!match) {
    throw new ValidationError(
      `Unknown template "${raw}".`,
      `Available templates: ${TEMPLATE_NAMES.join(", ")}`,
    );
  }

  return match;
}

function normalizePackageManager(
  name: AgentName | undefined,
): ScaffoldPackageManager {
  if (name === "pnpm" || name === "yarn" || name === "bun") return name;

  return "npm";
}

function nextPmFlag(pm: ScaffoldPackageManager): string {
  switch (pm) {
    case "pnpm":
      return "--use-pnpm";
    case "yarn":
      return "--use-yarn";
    case "bun":
      return "--use-bun";
    default:
      return "--use-npm";
  }
}

function astroSpec(projectName: string, install: boolean): UpstreamSpec {
  const extra = install ? ["--add", "react", "--install"] : ["--no-install"];

  return {
    args: [
      "create-astro@latest",
      projectName,
      "--template",
      "minimal",
      ...extra,
      "--no-git",
      "--skip-houston",
      "-y",
    ],
    installedDeps: install,
  };
}

function upstreamSpec(
  template: TemplateName,
  projectName: string,
  pm: ScaffoldPackageManager,
  install: boolean,
): UpstreamSpec {
  switch (template) {
    case "vite":
      return {
        args: [
          "create-vite@latest",
          projectName,
          "--template",
          "react-ts",
          "--no-immediate",
          "--no-interactive",
        ],
        installedDeps: false,
      };
    case "next":
      return {
        args: [
          "create-next-app@latest",
          projectName,
          "--ts",
          "--tailwind",
          "--app",
          "--no-src-dir",
          "--import-alias",
          "@/*",
          "--yes",
          "--skip-install",
          "--disable-git",
          nextPmFlag(pm),
        ],
        installedDeps: false,
      };
    case "astro":
      return astroSpec(projectName, install);
    case "tanstack-start":
      return {
        args: [
          "@tanstack/cli@latest",
          "create",
          projectName,
          "--framework",
          "React",
          "--build-tool",
          "vite",
          "--package-manager",
          pm,
          "--no-install",
          "--no-git",
          "--no-intent",
          "--non-interactive",
          "--yes",
        ],
        installedDeps: false,
      };
  }
}

/**
 * Build the upstream scaffolder command for a template and package manager.
 * Always runs in `dirname(targetDir)` with `basename(targetDir)` so Windows
 * absolute paths are never mangled by upstream CLIs (e.g. create-vite).
 */
export function buildScaffoldCommand(
  template: TemplateName,
  targetDir: string,
  pm: ScaffoldPackageManager,
  install: boolean,
): ScaffoldInvocation {
  const parentDir = dirname(targetDir);
  const projectName = basename(targetDir);
  const spec = upstreamSpec(template, projectName, pm, install);
  const resolved = resolveCommand(pm, "execute", spec.args);

  if (!resolved) {
    throw new ValidationError(
      `Could not build a scaffold command for ${pm}.`,
      "Run the upstream scaffolder manually, then run kira-kit init.",
    );
  }

  const args =
    resolved.command === "npx" ? ["-y", ...resolved.args] : resolved.args;

  return {
    command: resolved.command,
    args,
    cwd: parentDir,
    installedDeps: spec.installedDeps,
  };
}

function quoteWinArg(arg: string): string {
  return /\s/.test(arg) ? `"${arg.replaceAll('"', '\\"')}"` : arg;
}

async function defaultScaffolder(
  invocation: ScaffoldInvocation,
): Promise<void> {
  mkdirSync(invocation.cwd, { recursive: true });

  const isWin = process.platform === "win32";
  const args = isWin ? invocation.args.map(quoteWinArg) : invocation.args;

  const child = spawn(invocation.command, args, {
    cwd: invocation.cwd,
    stdio: "inherit",
    shell: isWin,
  });

  await new Promise<void>((resolvePromise, reject) => {
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolvePromise()
        : reject(
            new ValidationError(
              `${invocation.command} ${invocation.args[0] ?? ""} exited with ${code}`.trim(),
              "Check your network connection and retry, or scaffold manually and run kira-kit init.",
            ),
          ),
    );
  });
}

async function defaultGitInit(targetDir: string): Promise<void> {
  const git = spawn("git", ["init"], {
    cwd: targetDir,
    stdio: "ignore",
    shell: process.platform === "win32",
  });

  await new Promise<void>((resolvePromise) => {
    git.on("error", () => resolvePromise());
    git.on("exit", () => resolvePromise());
  });
}

function ensureEmptyTarget(targetDir: string): void {
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    throw new ValidationError(
      `Target directory "${targetDir}" is not empty.`,
      "Choose a different directory or clean it first.",
    );
  }
}

/**
 * Scaffold a new project via the framework's official upstream CLI, then run
 * `kira-kit init` to wire Kira Kit config, Tailwind v4, tokens, and deps.
 */
export async function runCreate(
  options: CreateOptions & { template: string },
): Promise<CreateOutcome> {
  const template = validateTemplateName(options.template);
  const cwd = options.cwd ?? process.cwd();
  const targetDir = resolve(cwd, options.dir ?? `kira-${template}-app`);

  ensureEmptyTarget(targetDir);

  const detected = await detect({ cwd });
  const pm = normalizePackageManager(detected?.name);

  const invocation = buildScaffoldCommand(
    template,
    targetDir,
    pm,
    options.install,
  );

  info(`Scaffolding "${template}" via ${invocation.command}…`);

  const runScaffold = options.scaffolder ?? defaultScaffolder;

  await runScaffold(invocation);

  let depsInstalled = invocation.installedDeps;

  if (options.install && !depsInstalled) {
    depsInstalled = await installProjectDeps(targetDir, options.installer);
  }

  const runInit = options.initProject ?? init;

  await runInit({
    cwd: targetDir,
    yes: true,
    force: true,
    skipDeps: !options.install,
    installer: options.installer,
  });

  let gitInitialized = false;

  if (options.git) {
    const initGit = options.gitInit ?? defaultGitInit;

    await initGit(targetDir);
    gitInitialized = true;
  }

  return {
    template,
    targetDir,
    gitInitialized,
    depsInstalled,
    packageManager: pm,
  };
}
