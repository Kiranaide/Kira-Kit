import inquirer from "inquirer";

export async function selectPrimaryColor(): Promise<string> {
  const { primaryColor } = await inquirer.prompt([
    {
      type: "list",
      name: "primaryColor",
      message: "Choose primary color:",
      choices: [
        { name: "Blue", value: "blue" },
        { name: "Green", value: "green" },
        { name: "Orange", value: "orange" },
        { name: "Pink", value: "pink" },
        { name: "Purple", value: "purple" },
        { name: "Red", value: "red" },
        { name: "Violet", value: "violet" },
        { name: "Yellow", value: "yellow" },
      ],
      default: "blue",
    },
  ]);

  return primaryColor;
}
