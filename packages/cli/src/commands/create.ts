import { ValidationError } from "../lib/errors";
import { success } from "../lib/logger";
import { select } from "../lib/prompts";
import {
  TEMPLATE_NAMES,
  resolveTemplatesRoot,
  runCreate,
  type TemplateName,
} from "../core/create/engine";
import type { CreateOptions } from "../types";

export { TEMPLATE_NAMES, resolveTemplatesRoot, type TemplateName };

async function resolveTemplate(options: CreateOptions): Promise<string> {
  if (options.template) return options.template;

  if (!options.yes && process.stdin.isTTY) {
    return select(
      { yes: options.yes },
      "Which template should be scaffolded?",
      TEMPLATE_NAMES.map((name) => ({ value: name, label: name })),
      "vite",
    );
  }

  throw new ValidationError(
    "No template specified.",
    `Pass one of: ${TEMPLATE_NAMES.join(", ")} — e.g. kira-kit create my-app --template vite`,
  );
}

function printNextSteps(targetDir: string, installed: boolean): void {
  console.log("\nNext steps:");
  console.log(`  cd ${targetDir}`);

  if (!installed)
    console.log("  npm install   # or bun install / pnpm install");
  console.log(
    "  kira-kit init --preset ember-press   # apply a theme (optional)",
  );
  console.log(
    "  kira-kit add button                 # add your first component",
  );
  console.log();
}

export async function createProject(options: CreateOptions): Promise<number> {
  const template = await resolveTemplate(options);
  const outcome = await runCreate({ ...options, template });

  success(
    `Scaffolded "${outcome.template}" template into ${outcome.targetDir}`,
  );
  printNextSteps(outcome.targetDir, outcome.depsInstalled);

  return 0;
}
