import { describe, expect, it } from "vitest";
import { migrateCnSource } from "../src/core/migrate/cn-codemod";

describe("migrateCnSource", () => {
  it("merges clsx + tailwind-merge imports and collapses the nested call", () => {
    const source = [
      'import { clsx } from "clsx";',
      'import { twMerge } from "tailwind-merge";',
      "",
      "export function cx(...args: unknown[]) {",
      "  return twMerge(clsx(args));",
      "}",
      "",
    ].join("\n");

    const result = migrateCnSource(source);

    expect(result).toContain('import { cn } from "cn";');
    expect(result).not.toContain("tailwind-merge");
    expect(result).not.toContain("twMerge(");
    expect(result).toContain("return cn(args);");
    expect(result.match(/import \{ cn \} from "cn";/g)).toHaveLength(1);
  });

  it("rewrites legacy @/lib/cn imports and clsx calls", () => {
    const source = [
      'import { cn } from "@/lib/cn";',
      'const a = clsx("x", { y: true });',
    ].join("\n");

    const result = migrateCnSource(source);

    expect(result).toContain('import { cn } from "cn";');
    expect(result).toContain('const a = cn("x", { y: true });');
  });

  it("handles default clsx imports", () => {
    const result = migrateCnSource('import clsx from "clsx";\nclsx("a");');

    expect(result).toContain('import { cn } from "cn";');
    expect(result).toContain('cn("a");');
  });

  it("leaves unrelated code untouched", () => {
    const source = 'import { cn } from "cn";\nexport const x = cn("a");\n';

    expect(migrateCnSource(source)).toBe(source);
  });

  it("does not crash on unbalanced parens (best-effort)", () => {
    const source = 'import { clsx } from "clsx";\nconst x = cn(cn("a");\n';

    expect(() => migrateCnSource(source)).not.toThrow();
  });
});
