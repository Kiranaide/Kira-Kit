import { Command } from "commander";
import { init } from "./commands/init";
import { addComponents } from "./commands/add";
import { buildRegistry } from "./commands/build";
import { listComponents } from "./commands/list";
import type { InitOptions, AddOptions } from "./types";

const program = new Command();

program
  .name("kira-kit")
  .description("CLI tool for adding Kira Kit components to your project")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize Kira Kit in your project")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .option("--base-color <color>", "Base color (slate, gray, zinc, neutral, stone)")
  .option("--primary-color <color>", "Primary color (blue, green, orange, pink, purple, red, violet, yellow)")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(async (options: InitOptions) => {
    try {
      await init(options);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program
  .command("add")
  .description("Add component(s) to your project")
  .argument("[components...]", "Component names to add")
  .option("-c, --cwd <directory>", "Working directory", process.cwd())
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-y, --yes", "Skip prompts")
  .option("--all", "Add all components")
  .action(async (components: string[], options: AddOptions) => {
    try {
      await addComponents({
        ...options,
        components,
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program
  .command("build")
  .description("Build registry files for all components")
  .action(() => {
    try {
      buildRegistry();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List all available components in the registry")
  .action(async () => {
    try {
      await listComponents();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
