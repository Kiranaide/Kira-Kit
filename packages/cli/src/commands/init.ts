import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { welcome, info, success, warning, dim } from "../lib/logger";
import { selectBaseColor } from "../prompts/base-color";
import { selectPrimaryColor } from "../prompts/primary-color";
import { selectProjectType, inputAlias } from "../prompts/project-type";
import { writeConfig, readConfig } from "../lib/config";
import { execSync } from "child_process";
import type { InitOptions } from "../types";

const UTILS_TEMPLATE = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const CSS_VARIABLES_TEMPLATE = (baseColor: string, primaryColor: string) => `:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: var(--${primaryColor}-500);
  --primary-foreground: 210 40% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 10% 3.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
`;

export async function init(options: InitOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();

  welcome("Kira Kit CLI");

  const existingConfig = readConfig(cwd);
  if (existingConfig) {
    warning("Kira Kit is already initialized in this project.");
    const inquirer = await import("inquirer");
    const prompt = new inquirer.Confirm({
      message: "Reinitialize? This will overwrite your config.",
      name: "confirm",
      default: false,
    });
    const { confirm } = await prompt.run();
    if (!confirm) {
      return;
    }
  }

  const baseColor = options.baseColor || await selectBaseColor();
  const primaryColor = options.primaryColor || await selectPrimaryColor();
  const projectType = await selectProjectType(cwd);

  info(`Project type: ${projectType}`);
  info(`Base color: ${baseColor}`);
  info(`Primary color: ${primaryColor}`);

  const componentsAlias = await inputAlias("components", "@/components");
  const utilsAlias = await inputAlias("utils", "@/lib/utils");

  const utilsDir = join(cwd, utilsAlias.replace("@/", "src/"));
  const componentsUiDir = join(cwd, componentsAlias.replace("@/", "src/"), "ui");

  if (!existsSync(utilsDir)) {
    mkdirSync(utilsDir, { recursive: true });
  }

  if (!existsSync(componentsUiDir)) {
    mkdirSync(componentsUiDir, { recursive: true });
  }

  const utilsFilePath = join(utilsDir, "cn.ts");
  writeFileSync(utilsFilePath, UTILS_TEMPLATE, "utf-8");
  success(`Created ${utilsAlias}/cn.ts`);

  const cssFilePath = join(cwd, "src", "index.css");
  if (existsSync(cssFilePath)) {
    const content = readFileSync(cssFilePath, "utf-8");
    const hasVariables = content.includes(":root {");
    if (!hasVariables) {
      writeFileSync(cssFilePath, CSS_VARIABLES_TEMPLATE(baseColor, primaryColor) + "\n" + content, "utf-8");
      success("Added CSS variables to src/index.css");
    }
  }

  writeConfig(cwd, {
    tailwind: {
      config: "",
      css: "src/index.css",
      baseColor,
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: componentsAlias,
      utils: utilsAlias,
      ui: `${componentsAlias}/ui`,
      lib: "@/lib",
      hooks: "@/hooks",
    },
  });

  success("Created components.json");

  info("Installing base dependencies...");

  const packageManager = process.env.BUN_INSTALL ? "bun" :
    process.env.PNPM_HOME ? "pnpm" :
      process.env.YARN_ENABLE_IMMUTABLE_CACHE === "false" ? "yarn" : "npm";

  try {
    execSync(
      `${packageManager} add clsx tailwind-merge class-variance-authority @tabler/icons-react`,
      {
        stdio: "inherit",
        cwd,
        env: { ...process.env, ADBLOCK: "1", DISABLE_OPENCOLLECTIVE: "1" },
      }
    );
    success("Dependencies installed");
  } catch {
    warning("Failed to install dependencies. Please run manually:");
    console.log(`  ${packageManager} add clsx tailwind-merge class-variance-authority @tabler/icons-react`);
  }

  console.log("\n");
  success("Kira Kit initialized successfully!");
  console.log("\nNext steps:");
  console.log(`  ${dim("Add a component:")}  kira-kit add button`);
  console.log(`  ${dim("List components:")}  kira-kit list`);
  console.log("\n");
}
