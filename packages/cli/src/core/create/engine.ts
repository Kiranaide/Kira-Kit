import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { ValidationError } from "../../lib/errors";
import { installProjectDeps } from "../install/deps";
import type { CreateOptions } from "../../types";

export const TEMPLATE_NAMES = [
  "vite",
  "next",
  "tanstack-start",
  "monorepo",
] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

export interface CreateOutcome {
  template: TemplateName;
  targetDir: string;
  gitInitialized: boolean;
  depsInstalled: boolean;
}

/** Resolve the bundled templates dir, both from dist/ and src/ layouts. */
export function resolveTemplatesRoot(): string {
  const here = fileURLToPath(new URL(".", import.meta.url));

  const candidates = [
    resolve(here, "..", "templates"),
    resolve(here, "..", "..", "templates"),
    resolve(here, "..", "..", "..", "templates"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new ValidationError(
    "Could not locate the bundled templates directory.",
    "Reinstall kira-kit — the published package ships its templates.",
  );
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

async function defaultGitInit(targetDir: string): Promise<void> {
  const git = spawn("git", ["init"], {
    cwd: targetDir,
    stdio: "ignore",
    shell: true,
  });

  await new Promise<void>((resolvePromise) => {
    git.on("error", () => resolvePromise());
    git.on("exit", () => resolvePromise());
  });
}

function scaffoldTemplate(
  template: TemplateName,
  cwd: string,
  dir: string | undefined,
): string {
  const targetDir = resolve(cwd, dir ?? `kira-${template}-app`);

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    throw new ValidationError(
      `Target directory "${targetDir}" is not empty.`,
      "Choose a different directory or clean it first.",
    );
  }

  const sourceDir = join(resolveTemplatesRoot(), template);

  if (!existsSync(sourceDir)) {
    throw new ValidationError(
      `Template "${template}" is missing from this kira-kit installation.`,
      "Reinstall kira-kit and retry.",
    );
  }

  cpSync(sourceDir, targetDir, { recursive: true });

  const pkgPath = join(targetDir, "package.json");

  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    pkg.name = targetDir.split(/[\\/]/).pop() ?? "kira-app";
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }

  return targetDir;
}

/** Scaffold a bundled template into `options.cwd` and run optional post-steps. */
export async function runCreate(
  options: CreateOptions & { template: string },
): Promise<CreateOutcome> {
  const template = validateTemplateName(options.template);
  const cwd = options.cwd ?? process.cwd();
  const targetDir = scaffoldTemplate(template, cwd, options.dir);

  let gitInitialized = false;

  if (options.git) {
    const initGit = options.gitInit ?? defaultGitInit;
    await initGit(targetDir);
    gitInitialized = true;
  }

  let depsInstalled = false;

  if (options.install) {
    depsInstalled = await installProjectDeps(targetDir, options.installer);
  }

  return { template, targetDir, gitInitialized, depsInstalled };
}
