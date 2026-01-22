import { Command } from "commander";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { init } from "./commands/init";
import { addComponents } from "./commands/add";
import { buildRegistry } from "./commands/build";
import { listComponents } from "./commands/list";
import type { InitOptions, AddOptions } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name("kira-kit")
  .description("CLI tool for Kira Kit - Component library and project scaffolding")
  .version("1.0.0");

program
  .command("create [name]")
  .description("Create a new project with Kira Kit")
  .option("-f, --framework <type>", "Framework: nextjs, vite-react, vite-router, remix")
  .option("--router <type>", "Router type for vite-router: file, code")
  .option("--install", "Install dependencies")
  .option("--no-install", "Don't install dependencies")
  .option("--git", "Initialize Git repository")
  .option("--no-git", "Don't initialize Git")
  .action((name: string | undefined, options: Record<string, unknown>) => {
    const createPath = resolve(__dirname, "..", "..", "create", "node_modules", "tsx", "cli.js");
    const createSrcPath = resolve(__dirname, "..", "..", "create", "src", "index.ts");

    const args = [createSrcPath];
    if (name) args.push(name);
    if (options.framework) args.push("--framework", String(options.framework));
    if (options.router) args.push("--router", String(options.router));
    if (options.install === true) args.push("--install");
    if (options.install === false) args.push("--no-install");
    if (options.git === true) args.push("--git");
    if (options.git === false) args.push("--no-git");

    const child = spawn(
      process.execPath,
      [createPath, ...args],
      {
        stdio: "inherit",
        cwd: process.cwd(),
        env: process.env,
      }
    );

    child.on("exit", (code) => {
      process.exit(code ?? 0);
    });
  });

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
