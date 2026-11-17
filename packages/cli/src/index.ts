import { Command } from "commander";
import { getVersion } from "./version";
import { printError } from "./lib/errors";
import { init } from "./commands/init";
import { addComponents } from "./commands/add";
import { listComponents } from "./commands/list";
import { viewItems } from "./commands/view";
import { searchItems } from "./commands/search";
import { check } from "./commands/check";
import { theme } from "./commands/theme";
import { buildRegistry } from "./commands/build";
import { createProject } from "./commands/create";
import { migrateProject as migrate } from "./commands/migrate";

const program = new Command();

program
  .name("kira-kit")
  .description(
    "Kira Kit — shadcn-compatible Base UI component registry, OKLCH themes, and quality checks",
  )
  .version(getVersion());

program
  .command("init")
  .description("Initialize Kira Kit in your project (delegates base setup to shadcn)")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .option("--base <base>", "Component library base (base, radix, aria)")
  .option("--preset <name>", "Install a theme preset (e.g. terracotta)")
  .option("--primary <color>", "Generate a custom theme from this primary color")
  .option("--base-color <name>", "Base color (neutral, stone, zinc, slate, gray)")
  .option("--force", "Re-apply the theme even if one already exists")
  .option("-y, --yes", "Skip prompts, use defaults")
  .action(async (options) => {
    process.exit(await run(() => init(options)));
  });

program
  .command("add [items...]")
  .description("Add component(s) via the pinned shadcn CLI")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-a, --all", "Add every item in the registry")
  .option("-p, --path <path>", "Path to add the component to")
  .option("--dry-run", "Preview changes without writing files")
  .option("--diff", "Show diff for files that would change")
  .option("--view", "Show file contents instead of writing")
  .action(async (items: string[], options) => {
    process.exit(await run(() => addComponents({ ...options, items })));
  });

program
  .command("list")
  .description("List available registry items")
  .option("--json", "Print machine-readable JSON")
  .action(async (options) => {
    process.exit(await run(() => listComponents(options)));
  });

program
  .command("view [items...]")
  .description("View registry item contents")
  .action(async (items: string[], options) => {
    process.exit(await run(() => viewItems({ ...options, items })));
  });

program
  .command("search [query...]")
  .description("Search the registry")
  .option("--json", "Print machine-readable JSON")
  .action(async (query: string[], options) => {
    process.exit(await run(() => searchItems({ ...options, query })));
  });

program
  .command("theme")
  .description("Generate an OKLCH theme palette from a primary color")
  .option("--primary <color>", "Primary color (hex or any CSS color)")
  .option("--base-color <name>", "Base color (neutral, stone, zinc, slate, gray)")
  .option("--out <file>", "Write the registry item to this file")
  .option("--apply", "Install the generated theme via shadcn")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .action(async (options) => {
    process.exit(await run(() => theme(options)));
  });

program
  .command("check [paths...]")
  .description("Run quality checks on component sources")
  .option("--ci", "Fail on every finding unless suppressed (auto when CI is set)")
  .option("--format <format>", "Output format: pretty, json, github")
  .option("--json", "Shorthand for --format json")
  .action(async (paths: string[], options) => {
    process.exit(await run(() => check({ ...options, paths })));
  });

program
  .command("build")
  .description("Maintainer: validate, build, and emit the registry + docs")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .option("--skip-checks", "Skip quality checks")
  .action(async (options) => {
    process.exit(await run(() => buildRegistry(options)));
  });

program
  .command("create [dir]")
  .description("Scaffold a new project pre-wired for Kira Kit")
  .option("-t, --template <template>", "Template: vite, next, tanstack-start, monorepo")
  .option("--install", "Install dependencies after scaffolding")
  .option("--no-install", "Skip dependency installation")
  .option("--git", "Initialize a git repository")
  .option("--no-git", "Skip git initialization")
  .option("-y, --yes", "Skip prompts, use defaults")
  .action(async (dir: string | undefined, options) => {
    process.exit(await run(() => createProject({ dir, ...options })));
  });

program
  .command("migrate")
  .description("Migrate a v0.2.x project to the shadcn-native setup")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .option("--dry-run", "Print changes without writing files")
  .option("-y, --yes", "Skip prompts, apply automatically")
  .action(async (options) => {
    process.exit(await run(() => migrate(options)));
  });

async function run(action: () => Promise<number | void>): Promise<number> {
  try {
    const code = await action();
    return typeof code === "number" ? code : 0;
  } catch (error) {
    return printError(error);
  }
}

program.parse();
