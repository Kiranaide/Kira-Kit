import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { welcome, info, success, warning, dim } from "../lib/logger";
import { selectBaseColor } from "../prompts/base-color";
import { selectPrimaryColor } from "../prompts/primary-color";
import { detectProjectType, inputAlias } from "../prompts/project-type";
import { writeConfig, readConfig } from "../lib/config";
import { generateCss } from "../lib/theme-generator";
import { execSync } from "child_process";
import type { InitOptions } from "../types";

const UTILS_TEMPLATE = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const COLOR_MAPPING: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#a855f7",
  red: "#ef4444",
  violet: "#8b5cf6",
  yellow: "#eab308",
};

export async function init(options: InitOptions): Promise<void> {
  const cwd = options.cwd || process.cwd();

  welcome("Kira Kit CLI");

  const existingConfig = readConfig(cwd);
  if (existingConfig) {
    warning("Kira Kit is already initialized in this project.");
    const inquirer = await import("inquirer");
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Reinitialize? This will overwrite your config.",
        default: false,
      },
    ]);
    if (!confirm) {
      return;
    }
  }

  const baseColor = options.baseColor || (await selectBaseColor());
  const primaryColor = options.primaryColor || (await selectPrimaryColor());
  const projectType = await detectProjectType(cwd);

  info(`Project type: ${projectType}`);
  info(`Base color: ${baseColor}`);
  info(`Primary color: ${primaryColor}`);

  const componentsAlias = await inputAlias("components", "@/components");
  const utilsAlias = await inputAlias("utils", "@/lib/utils");

  const utilsDir = join(cwd, utilsAlias.replace("@/", "src/"));
  const componentsUiDir = join(
    cwd,
    componentsAlias.replace("@/", "src/"),
    "ui",
  );

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

  // Resolve primary color to hex
  const primaryHex = COLOR_MAPPING[primaryColor] || primaryColor;
  // Fallback if user somehow passed a value not in mapping and not a valid hex,
  // generateCss will throw or handle it (currently throws if invalid).
  // basic check:
  const isHex = /^#[0-9A-F]{6}$/i.test(primaryHex);
  const colorToUse = isHex ? primaryHex : "#3b82f6"; // Default to blue if invalid

  if (existsSync(cssFilePath)) {
    const content = readFileSync(cssFilePath, "utf-8");
    const hasVariables = content.includes(":root {");
    if (!hasVariables) {
      const cssContent = generateCss(colorToUse);
      writeFileSync(cssFilePath, cssContent, "utf-8");
      success("Generated src/index.css with dynamic palette");
    }
  } else {
    // Create it if it doesn't exist
    const cssContent = generateCss(colorToUse);
    writeFileSync(cssFilePath, cssContent, "utf-8");
    success("Created src/index.css with dynamic palette");
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

  const packageManager = process.env.BUN_INSTALL
    ? "bun"
    : process.env.PNPM_HOME
      ? "pnpm"
      : process.env.YARN_ENABLE_IMMUTABLE_CACHE === "false"
        ? "yarn"
        : "npm";

  try {
    execSync(
      `${packageManager} add clsx tailwind-merge class-variance-authority @tabler/icons-react`,
      {
        stdio: "inherit",
        cwd,
        env: { ...process.env, ADBLOCK: "1", DISABLE_OPENCOLLECTIVE: "1" },
      },
    );
    success("Dependencies installed");
  } catch {
    warning("Failed to install dependencies. Please run manually:");
    console.log(
      `  ${packageManager} add clsx tailwind-merge class-variance-authority @tabler/icons-react`,
    );
  }

  console.log("\n");
  success("Kira Kit initialized successfully!");
  console.log("\nNext steps:");
  console.log(`  ${dim("Add a component:")}  kira-kit add button`);
  console.log(`  ${dim("List components:")}  kira-kit list`);
  console.log("\n");
}
