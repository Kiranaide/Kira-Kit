import { ValidationError } from "../lib/errors";
import { success } from "../lib/logger";
import { select } from "../lib/prompts";
import {
  TEMPLATE_NAMES,
  buildScaffoldCommand,
  runCreate,
  type ScaffoldPackageManager,
  type TemplateName,
} from "../core/create/engine";
import type { CreateOptions } from "../types";

export { TEMPLATE_NAMES, buildScaffoldCommand, type TemplateName };

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

function installCommand(pm: ScaffoldPackageManager): string {
  return `${pm} install`;
}

function execPrefix(pm: ScaffoldPackageManager): string {
  switch (pm) {
    case "bun":
      return "bunx";
    case "pnpm":
      return "pnpm dlx";
    case "yarn":
      return "yarn dlx";
    default:
      return "npx";
  }
}

function printNextSteps(
  targetDir: string,
  template: TemplateName,
  installed: boolean,
  pm: ScaffoldPackageManager,
): void {
  const exec = execPrefix(pm);

  console.log("\nNext steps:");
  console.log(`  cd ${targetDir}`);

  if (!installed) {
    console.log(`  ${installCommand(pm)}`);

    if (template === "astro") {
      console.log(`  ${exec} astro add react -y`);
    }

    console.log(
      `  ${exec} kira-kit init --yes            # install Kira Kit base packages`,
    );
  }

  console.log(
    `  ${exec} kira-kit init --preset ember-press   # apply a theme (optional)`,
  );
  console.log(
    `  ${exec} kira-kit add button                  # add your first component`,
  );
  console.log();
}

export async function createProject(options: CreateOptions): Promise<number> {
  const template = await resolveTemplate(options);
  const outcome = await runCreate({ ...options, template });

  success(`Scaffolded "${outcome.template}" project into ${outcome.targetDir}`);
  printNextSteps(
    outcome.targetDir,
    outcome.template,
    outcome.depsInstalled,
    outcome.packageManager,
  );

  return 0;
}
