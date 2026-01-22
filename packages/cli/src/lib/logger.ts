import picocolors from "picocolors";

export const colors = {
  primary: picocolors.cyan,
  success: picocolors.green,
  error: picocolors.red,
  warning: picocolors.yellow,
  dim: picocolors.dim,
  bold: picocolors.bold,
  italic: picocolors.italic,
};

export function log(message: string): void {
  console.log(message);
}

export function info(message: string): void {
  console.log(colors.primary("info") + " " + message);
}

export function success(message: string): void {
  console.log(colors.success("success") + " " + message);
}

export function error(message: string): void {
  console.error(colors.error("error") + " " + message);
}

export function warning(message: string): void {
  console.warn(colors.warning("warning") + " " + message);
}

export function banner(text: string): void {
  const line = "=".repeat(text.length + 4);
  console.log(
    picocolors.cyan(`
${line}
  ${text}
${line}
`),
  );
}

export function welcome(name: string): void {
  console.log(
    picocolors.cyan(`
    ██╗  ██╗██╗██████╗  █████╗       ██╗  ██╗██╗████████╗
    ██║ ██╔╝██║██╔══██╗██╔══██╗      ██║ ██╔╝██║╚══██╔══╝
    █████╔╝ ██║██████╔╝███████║█████╗█████╔╝ ██║   ██║   
    ██╔═██╗ ██║██╔══██╗██╔══██║╚════╝██╔═██╗ ██║   ██║   
    ██║  ██╗██║██║  ██║██║  ██║      ██║  ██╗██║   ██║   
    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝      ╚═╝  ╚═╝╚═╝   ╚═╝   

    CLI v0.2.0. Welcome!
    `),
  );
}

export function spinner(message: string): {
  start(): void;
  stop(msg: string): void;
} {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let interval: ReturnType<typeof setInterval>;
  let i = 0;

  return {
    start() {
      process.stdout.write(colors.dim(message) + " " + frames[0] + " \r");
      interval = setInterval(() => {
        process.stdout.write(
          "\r" + colors.dim(message) + " " + frames[i] + " \r",
        );
        i = (i + 1) % frames.length;
      }, 80);
    },
    stop(msg: string) {
      clearInterval(interval);
      process.stdout.write("\r" + " ".repeat(message.length + 5) + "\r");
      success(msg);
    },
  };
}

export function table(rows: string[][]): void {
  const maxLengths: number[] = [];

  for (const row of rows) {
    row.forEach((cell, i) => {
      maxLengths[i] = Math.max(maxLengths[i] || 0, cell.length);
    });
  }

  for (const row of rows) {
    const line = row.map((cell, i) => cell.padEnd(maxLengths[i])).join("  ");
    console.log(line);
  }
}

export function dim(message: string): string {
  return colors.dim(message);
}
