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
import { detect } from "package-manager-detector";
import { ValidationError } from "../lib/errors";
import { info, success, warning } from "../lib/logger";
import { select } from "../lib/prompts";
import type { CreateOptions } from "../types";

export const TEMPLATE_NAMES = [
  "vite",
  "next",
  "tanstack-start",
  "monorepo",
] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

/** Resolve the bundled templates dir, both from dist/ and src/ layouts. */
export function resolveTemplatesRoot(): string {
  const here = fileURLToPath(new URL(".", import.meta.url));

  const candidates = [
    resolve(here, "..", "templates"), // dist/index.js → package root
    resolve(here, "..", "..", "templates"), // src/commands → package root
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new ValidationError(
    "Could not locate the bundled templates directory.",
    "Reinstall kira-kit — the published package ships its templates.",
  );
}

async function install(cwd: string, pm: string): Promise<void> {
  const child = spawn(pm, ["install"], { cwd, stdio: "inherit", shell: true });
  await new Promise<void>((resolvePromise, reject) => {
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`${pm} install exited with ${code}`)),
    );
  });
}

async function resolveTemplate(options: CreateOptions): Promise<TemplateName> {
  // SAFETY: --template is an unvalidated CLI string; it is checked against
  // TEMPLATE_NAMES immediately below before any template is used.
  let template = options.template as TemplateName | undefined;

  if (!template) {
    if (!options.yes && process.stdin.isTTY) {
      template = await select(
        { yes: options.yes },
        "Which template should be scaffolded?",
        TEMPLATE_NAMES.map((name) => ({ value: name, label: name })),
        "vite",
      );
    } else {
      throw new ValidationError(
        "No template specified.",
        `Pass one of: ${TEMPLATE_NAMES.join(", ")} — e.g. kira-kit create my-app --template vite`,
      );
    }
  }

  if (!TEMPLATE_NAMES.includes(template)) {
    throw new ValidationError(
      `Unknown template "${template}".`,
      `Available templates: ${TEMPLATE_NAMES.join(", ")}`,
    );
  }

  return template;
}

function scaffoldTemplate(
  template: TemplateName,
  dir: string | undefined,
): string {
  const targetDir = resolve(process.cwd(), dir ?? `kira-${template}-app`);

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

  // Personalize package.json when present at the template root.
  const pkgPath = join(targetDir, "package.json");

  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    pkg.name = targetDir.split(/[\\/]/).pop() ?? "kira-app";
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }

  success(`Scaffolded "${template}" template into ${targetDir}`);

  return targetDir;
}

async function initGit(targetDir: string): Promise<void> {
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

async function installDependencies(targetDir: string): Promise<void> {
  const detected = await detect({ cwd: targetDir });
  const pm = detected?.name ?? "npm";

  info(`Installing dependencies with ${pm}…`);

  try {
    await install(targetDir, pm);
    success("Dependencies installed.");
  } catch (error) {
    warning(
      `Dependency install failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    info(`Install manually: cd ${targetDir} && ${pm} install`);
  }
}

function printNextSteps(targetDir: string, installed: boolean): void {
  console.log("\nNext steps:");
  console.log(`  cd ${targetDir}`);

  if (!installed)
    console.log("  npm install   # or bun install / pnpm install");
  console.log(
    "  kira-kit init --preset terracotta   # apply a theme (optional)",
  );
  console.log(
    "  kira-kit add button                 # add your first component",
  );
  console.log();
}

export async function createProject(options: CreateOptions): Promise<number> {
  const template = await resolveTemplate(options);
  const targetDir = scaffoldTemplate(template, options.dir);

  if (options.git) await initGit(targetDir);

  if (options.install) await installDependencies(targetDir);

  printNextSteps(targetDir, Boolean(options.install));

  return 0;
}
