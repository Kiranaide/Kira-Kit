import { existsSync, readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "fs";
import { dirname, join, relative } from "path";

export async function readFile(filePath: string): Promise<string> {
  return readFileSync(filePath, "utf-8");
}

export async function writeFile(
  filePath: string,
  content: string
): Promise<void> {
  const dir = dirname(filePath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, content, "utf-8");
}

export async function copyFile(
  source: string,
  destination: string
): Promise<void> {
  const dir = dirname(destination);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  cpSync(source, destination);
}

export async function copyDirectory(
  source: string,
  destination: string
): Promise<void> {
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  cpSync(source, destination, { recursive: true });
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export async function removeFile(filePath: string): Promise<void> {
  if (existsSync(filePath)) {
    rmSync(filePath);
  }
}

export async function removeDirectory(dirPath: string): Promise<void> {
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true });
  }
}

export function getRelativePath(from: string, to: string): string {
  return relative(from, to);
}

export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}
