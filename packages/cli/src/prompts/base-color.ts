import inquirer from "inquirer";

export async function selectBaseColor(): Promise<string> {
  const { baseColor } = await inquirer.prompt([
    {
      type: "list",
      name: "baseColor",
      message: "Choose base color:",
      choices: [
        { name: "Slate", value: "slate" },
        { name: "Gray", value: "gray" },
        { name: "Zinc", value: "zinc" },
        { name: "Neutral", value: "neutral" },
        { name: "Stone", value: "stone" },
      ],
      default: "neutral",
    },
  ]);
  return baseColor;
}
