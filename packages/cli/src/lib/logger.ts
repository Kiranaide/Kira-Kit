import picocolors from "picocolors";

export const colors = {
  primary: picocolors.cyan,
  success: picocolors.green,
  error: picocolors.red,
  warning: picocolors.yellow,
  dim: picocolors.dim,
  bold: picocolors.bold,
};

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
  console.warn(colors.warning("warn") + " " + message);
}

export function dim(message: string): string {
  return colors.dim(message);
}
