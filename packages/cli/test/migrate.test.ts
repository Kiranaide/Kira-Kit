import {
  existsSync,
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
        tsx: true,
        tailwind: {
          config: "",
          css: "src/app.css",
          baseColor: "stone",
          cssVariables: true,
        },
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
  it("throws ValidationError when neither kira-kit.json nor components.json exists", async () => {
    const dir = makeTempProject();

    await expect(
      migrateProject({ cwd: dir, dryRun: false, yes: true }),
    ).rejects.toThrow(ValidationError);
  });

  it("converts legacy components.json to flat kira-kit.json and rewrites cn imports", async () => {
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
    expect(outcome.removedLegacyConfig).toBe(true);
    expect(outcome.rewrittenFiles).toBe(2);
    expect(outcome.installedCn).toBe(true);
    expect(installed).toEqual([{ cwd: dir, deps: ["cn"] }]);
    expect(existsSync(join(dir, "components.json"))).toBe(false);
    expect(existsSync(join(dir, "kira-kit.json"))).toBe(true);

    const updatedConfig = JSON.parse(
      readFileSync(join(dir, "kira-kit.json"), "utf-8"),
    );

    expect(updatedConfig.$schema).toBe(
      "https://kira-kit.vercel.app/schema/kira-kit.json",
    );
    expect(updatedConfig.css).toBe("src/app.css");
    expect(updatedConfig.theme.baseColor).toBe("stone");
    expect(updatedConfig.tailwind).toBeUndefined();
    expect(updatedConfig.style).toBeUndefined();
    expect(updatedConfig.tsx).toBeUndefined();
    expect(updatedConfig.registryUrl).toBeUndefined();
    expect(updatedConfig.registries["@kira-kit"]).toBe(
      "https://example.com/r/{name}.json",
    );
    expect(updatedConfig.aliases.lib).toBe("@/lib");
    expect(updatedConfig.aliases.utils).toBeUndefined();

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

  it("keeps a non-Kira components.json intact while creating kira-kit.json", async () => {
    const dir = makeTempProject();

    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({
        style: "new-york",
        tailwind: { css: "src/globals.css", baseColor: "zinc" },
      }),
    );

    const outcome = await runMigration({ cwd: dir, dryRun: false, yes: true });

    expect(outcome.configUpdated).toBe(true);
    expect(outcome.removedLegacyConfig).toBe(false);
    expect(existsSync(join(dir, "components.json"))).toBe(true);
    expect(existsSync(join(dir, "kira-kit.json"))).toBe(true);

    const migrated = JSON.parse(
      readFileSync(join(dir, "kira-kit.json"), "utf-8"),
    );

    expect(migrated.css).toBe("src/globals.css");
    expect(migrated.theme.baseColor).toBe("zinc");
  });
});

describe("migrateProject dry-run & divergence", () => {
  it("keeps standard aliases.lib (@/lib) untouched and leaves files intact in --dry-run", async () => {
    const dir = makeTempProject();

    const initialConfig = JSON.stringify(
      {
        $schema: "https://kira-kit.vercel.app/schema/kira-kit.json",
        css: "src/index.css",
        aliases: { lib: "@/lib" },
        registries: {
          "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json",
        },
      },
      null,
      2,
    );

    writeFileSync(join(dir, "kira-kit.json"), initialConfig);
    writeFileSync(
      join(dir, "src", "helper.ts"),
      'import clsx from "clsx";\nexport const x = clsx("a");\n',
    );

    const outcome = await runMigration({
      cwd: dir,
      dryRun: true,
      yes: true,
    });

    expect(outcome.plan.facts.fromLegacyConfigFile).toBe(false);
    expect(outcome.plan.facts.legacyAlias).toBe(false);
    expect(outcome.plan.cnRewrites).toHaveLength(1);
    expect(outcome.rewrittenFiles).toBe(0);
    expect(readFileSync(join(dir, "src", "helper.ts"), "utf-8")).toContain(
      'from "clsx"',
    );
    expect(readFileSync(join(dir, "kira-kit.json"), "utf-8")).toBe(
      initialConfig,
    );
  });

  it("handles unbalanced parens gracefully and reports divergent components via fetchItem seam", async () => {
    const dir = makeTempProject();

    writeFileSync(
      join(dir, "kira-kit.json"),
      JSON.stringify({
        $schema: "https://kira-kit.vercel.app/schema/kira-kit.json",
        css: "src/index.css",
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
