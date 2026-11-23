import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { migrateProject } from "../src/commands/migrate";
import { runMigration } from "../src/core/migrate/engine";
import type { DepInstaller } from "../src/core/install/deps";
import { ValidationError } from "../src/lib/errors";

const tempDirs: string[] = [];

function makeTempProject(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-migrate-test-"));
  tempDirs.push(dir);
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "demo-app", dependencies: {} }, null, 2),
  );

  return dir;
}

function writeLegacyProjectFixture(dir: string): void {
  writeFileSync(
    join(dir, "components.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "default",
        registryUrl: "https://example.com/r",
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          lib: "@/lib/cn",
        },
      },
      null,
      2,
    ),
  );

  writeFileSync(
    join(dir, "src", "button.tsx"),
    [
      'import { clsx } from "clsx";',
      'import { twMerge } from "tailwind-merge";',
      "",
      "export function cx(...args: unknown[]) {",
      "  return twMerge(clsx(args));",
      "}",
      "",
    ].join("\n"),
  );

  writeFileSync(
    join(dir, "src", "card.tsx"),
    [
      'import { cn } from "@/lib/cn";',
      'const a = clsx("x", { y: true });',
      "export const b = cn(a);",
    ].join("\n"),
  );
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("migrateProject config & codemod", () => {
  it("throws ValidationError when components.json is missing", async () => {
    const dir = makeTempProject();

    await expect(
      migrateProject({ cwd: dir, dryRun: false, yes: true }),
    ).rejects.toThrow(ValidationError);
  });

  it("rewrites legacy cn imports, aliases.lib, registryUrl, and $schema when cwd !== process.cwd()", async () => {
    const dir = makeTempProject();
    writeLegacyProjectFixture(dir);

    const installed: Array<{ cwd: string; deps: string[] }> = [];

    const fakeInstaller: DepInstaller = {
      async install(cwd, deps) {
        installed.push({ cwd, deps });
      },
    };

    const outcome = await runMigration({
      cwd: dir,
      dryRun: false,
      yes: true,
      installer: fakeInstaller,
    });

    expect(outcome.configUpdated).toBe(true);
    expect(outcome.rewrittenFiles).toBe(2);
    expect(outcome.installedCn).toBe(true);
    expect(installed).toEqual([{ cwd: dir, deps: ["cn"] }]);

    const updatedConfig = JSON.parse(
      readFileSync(join(dir, "components.json"), "utf-8"),
    );

    expect(updatedConfig.registryUrl).toBeUndefined();
    expect(updatedConfig.registries["@kira-kit"]).toBe(
      "https://example.com/r/{name}.json",
    );
    expect(updatedConfig.aliases.lib).toBe("@/lib");
    expect(updatedConfig.style).toBe("kira");
    expect(updatedConfig.$schema).toContain("kira");

    const button = readFileSync(join(dir, "src", "button.tsx"), "utf-8");

    expect(button).toContain('import { cn } from "cn";');
    expect(button).not.toContain("tailwind-merge");
    expect(button).not.toContain("twMerge(");
    expect(button).toContain("return cn(args);");
    expect(button.match(/import \{ cn \} from "cn";/g)).toHaveLength(1);

    const card = readFileSync(join(dir, "src", "card.tsx"), "utf-8");

    expect(card).toContain('import { cn } from "cn";');
    expect(card).toContain('const a = cn("x", { y: true });');
  });
});

describe("migrateProject dry-run & divergence", () => {
  it("keeps standard aliases.lib (@/lib) untouched and leaves files intact in --dry-run", async () => {
    const dir = makeTempProject();

    const initialConfig = JSON.stringify(
      {
        style: "kira",
        aliases: { lib: "@/lib", utils: "@/lib/utils" },
        registries: {
          "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json",
        },
      },
      null,
      2,
    );

    writeFileSync(join(dir, "components.json"), initialConfig);
    writeFileSync(
      join(dir, "src", "helper.ts"),
      'import clsx from "clsx";\nexport const x = clsx("a");\n',
    );

    const outcome = await runMigration({
      cwd: dir,
      dryRun: true,
      yes: true,
    });

    expect(outcome.plan.facts.legacyAlias).toBe(false);
    expect(outcome.plan.cnRewrites).toHaveLength(1);
    expect(outcome.rewrittenFiles).toBe(0);
    expect(readFileSync(join(dir, "src", "helper.ts"), "utf-8")).toContain(
      'from "clsx"',
    );
    expect(readFileSync(join(dir, "components.json"), "utf-8")).toBe(
      initialConfig,
    );
  });

  it("handles unbalanced parens gracefully and reports divergent components via fetchItem seam", async () => {
    const dir = makeTempProject();

    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({
        style: "kira",
        registries: {
          "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json",
        },
      }),
    );
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "demo-app", dependencies: { cn: "^0.5.0" } }),
    );
    mkdirSync(join(dir, "src", "components", "ui"), { recursive: true });
    writeFileSync(
      join(dir, "src", "components", "ui", "badge.tsx"),
      'import { clsx } from "clsx";\nexport const x = cn(cn("a");\n',
    );

    const outcome = await runMigration({
      cwd: dir,
      dryRun: false,
      yes: false,
      async fetchItem(address) {
        return {
          name: address.replace("@kira-kit/", ""),
          files: [
            {
              path: "src/components/ui/badge.tsx",
              content: 'import { cn } from "cn";\nexport const x = cn("b");\n',
            },
          ],
        };
      },
    });

    expect(outcome.rewrittenFiles).toBe(1);
    expect(outcome.installedCn).toBe(false);
    expect(outcome.divergent).toEqual([{ name: "badge", changedFiles: 1 }]);
  });
});
