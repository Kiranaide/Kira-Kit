import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import picocolors from "picocolors";

const PACKAGE_MANAGER = detectPackageManager();

function detectPackageManager(): "bun" | "pnpm" | "npm" | "yarn" {
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("npm")) return "npm";

  if (process.env.BUN_INSTALL) return "bun";
  if (process.env.PNPM_HOME) return "pnpm";
  if (process.env.YARN_ENABLE_IMMUTABLE_CACHE === "false") return "yarn";

  return "bun";
}

function getInstallCmd(dependencies: string[]): string {
  const pkgManager = PACKAGE_MANAGER;

  switch (pkgManager) {
    case "bun":
      return `bun add ${dependencies.join(" ")}`;
    case "pnpm":
      return `pnpm add ${dependencies.join(" ")}`;
    case "yarn":
      return `yarn add ${dependencies.join(" ")}`;
    default:
      return `npm install ${dependencies.join(" ")}`;
  }
}

function getDevInstallCmd(dependencies: string[]): string {
  const pkgManager = PACKAGE_MANAGER;

  switch (pkgManager) {
    case "bun":
      return `bun add -D ${dependencies.join(" ")}`;
    case "pnpm":
      return `pnpm add -D ${dependencies.join(" ")}`;
    case "yarn":
      return `yarn add -D ${dependencies.join(" ")}`;
    default:
      return `npm install -D ${dependencies.join(" ")}`;
  }
}

export async function parseDependencies(
  componentContent: string
): Promise<string[]> {
  const deps = new Set<string>();

  const npmPackages = [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "@tabler/icons-react",
    "date-fns",
    "react-day-picker",
    "react-resizable-panels",
    "@tanstack/react-table",
    "@tanstack/react-virtual",
    "@uiw/color-convert",
    "@uiw/react-color-hue",
    "@uiw/react-color-saturation",
    "@dnd-kit/core",
    "@dnd-kit/sortable",
    "@dnd-kit/utilities",
    "cmdk",
    "embla-carousel-react",
    "sonner",
    "animejs",
    "gsap",
    "@gsap/react",
  ];

  for (const pkg of npmPackages) {
    const regex = new RegExp(
      `from\\s+["']${pkg.replace("/", "\\/")}[@^~]?[\\d.]*["']`,
      "g"
    );
    if (regex.test(componentContent)) {
      deps.add(pkg);
    }
  }

  if (
    componentContent.includes('from "class-variance-authority"') ||
    componentContent.includes("from 'class-variance-authority'")
  ) {
    deps.add("class-variance-authority");
  }

  return Array.from(deps).sort();
}

export async function installDependencies(
  dependencies: string[],
  isDev: boolean = false
): Promise<void> {
  if (dependencies.length === 0) return;

  console.log(picocolors.cyan(`Installing dependencies...`));

  const cmd = isDev
    ? getDevInstallCmd(dependencies)
    : getInstallCmd(dependencies);

  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: { ...process.env, ADBLOCK: "1", DISABLE_OPENCOLLECTIVE: "1" },
    });
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error}`);
  }
}

export function getPackageManager(): string {
  return PACKAGE_MANAGER;
}

export async function initPackageJson(): Promise<void> {
  const packageJsonPath = join(process.cwd(), "package.json");

  if (!existsSync(packageJsonPath)) {
    execSync('echo "{}" > package.json', { stdio: "inherit" });
  }
}
