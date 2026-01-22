import inquirer from "inquirer";
import { existsSync } from "fs";
import { join } from "path";

export type ProjectType = "nextjs" | "vite" | "remix" | "gatsby" | "other";

export async function detectProjectType(cwd: string): Promise<ProjectType> {
  const files = ["next.config.js", "vite.config.ts", "remix.config.js", "gatsby-config.js"];

  for (const file of files) {
    if (existsSync(join(cwd, file))) {
      if (file === "next.config.js") return "nextjs";
      if (file === "vite.config.ts") return "vite";
      if (file === "remix.config.js") return "remix";
      if (file === "gatsby-config.js") return "gatsby";
    }
  }

  return "other";
}

export async function selectProjectType(cwd: string): Promise<ProjectType> {
  const detected = await detectProjectType(cwd);

  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: `Detected: ${detected}. Choose project type:`,
      choices: [
        { name: "Next.js", value: "nextjs" },
        { name: "Vite", value: "vite" },
        { name: "Remix", value: "remix" },
        { name: "Gatsby", value: "gatsby" },
        { name: "Other", value: "other" },
      ],
      default: detected,
    },
  ]);

  return projectType;
}

export async function confirmProjectType(
  detected: ProjectType
): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Detected project type: ${detected}. Is this correct?`,
      default: true,
    },
  ]);
  return confirm;
}

export async function inputAlias(
  name: string,
  defaultValue: string
): Promise<string> {
  const { alias } = await inquirer.prompt([
    {
      type: "input",
      name: "alias",
      message: `Enter ${name} alias:`,
      default: defaultValue,
    },
  ]);
  return alias;
}
