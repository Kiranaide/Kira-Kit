import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as lucide from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";
import {
  TABLER_TO_LUCIDE,
  applyIconLibrary,
  rewriteIconImports,
  rewriteIconSources,
} from "../src/core/install/icons";
import {
  PINNED_RANGES,
  planNpmDeps,
  type DepInstaller,
} from "../src/core/install/deps";
import { importsMatchDeps } from "../src/core/checks/imports-deps";
import type {
  CheckContext,
  ItemMeta,
  SourceFile,
} from "../src/core/checks/types";
import { ValidationError } from "../src/lib/errors";
import type { RegistryItemPayload } from "../src/lib/schemas";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-icons-"));

  temps.push(dir);

  return dir;
}

function fakeInstaller(calls: string[][]): DepInstaller {
  return {
    async install(_cwd, deps) {
      calls.push(deps);
    },
  };
}

function readJson<T>(path: string): T {
  // SAFETY: test helper reads JSON this suite wrote.
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function writeSource(dir: string, rel: string, content: string): void {
  const path = join(dir, rel);

  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf-8");
}

function sourceFilesUnder(srcDir: string): string[] {
  const out: string[] = [];
  const pending = ["components/ui", "hooks", "lib"];

  while (pending.length > 0) {
    const rel = pending.pop();

    if (!rel) continue;

    for (const entry of readdirSync(join(srcDir, rel), {
      withFileTypes: true,
    })) {
      const full = join(srcDir, rel, entry.name);

      if (entry.isDirectory()) {
        pending.push(relative(srcDir, full));
      } else if (/\.(tsx|ts)$/.test(entry.name)) {
        out.push(full);
      }
    }
  }

  return out;
}

function tablerNamesIn(content: string): string[] {
  const names: string[] = [];

  const imports = content.matchAll(
    /import\s*\{([^}]+)\}\s*from\s*["']@tabler\/icons-react["']/g,
  );

  for (const match of imports) {
    for (const binding of match[1].split(",")) {
      const name = binding.trim().split(/\s+as\s+/)[0];

      if (name) names.push(name);
    }
  }

  return names;
}

const TABLER_SOURCE = `import { IconCheck, IconX } from "@tabler/icons-react";

export function Actions() {
  return (
    <div>
      <IconCheck className="h-4 w-4" />
      <IconX className="h-4 w-4" />
    </div>
  );
}
`;

describe("TABLER_TO_LUCIDE map", () => {
  it("every target is a real lucide-react export", () => {
    for (const [tabler, target] of Object.entries(TABLER_TO_LUCIDE)) {
      // SAFETY: probing export existence — an absent name yields undefined
      // at runtime, which the assertion below catches.
      const exported = lucide[target as keyof typeof lucide];

      expect(exported, `${tabler} → ${target}`).toBeDefined();
    }
  });

  it("covers every tabler icon the kit sources import", () => {
    const srcDir = fileURLToPath(new URL("../../../src/", import.meta.url));

    const used = new Set(
      sourceFilesUnder(srcDir).flatMap((path) =>
        tablerNamesIn(readFileSync(path, "utf-8")),
      ),
    );

    expect(used.size).toBeGreaterThan(90);

    for (const name of used) {
      expect(
        Object.hasOwn(TABLER_TO_LUCIDE, name),
        `unmapped kit icon ${name}`,
      ).toBe(true);
    }
  });

  it("stays in lockstep with the installed lucide-react pin", () => {
    const pkg = readJson<{ devDependencies: Record<string, string> }>(
      fileURLToPath(new URL("../package.json", import.meta.url)),
    );

    expect(PINNED_RANGES["lucide-react"]).toBe("^1.76.0");
    expect(pkg.devDependencies["lucide-react"]).toBe(
      PINNED_RANGES["lucide-react"],
    );
  });
});

describe("rewriteIconImports", () => {
  it("keeps local bindings via aliases", () => {
    expect(rewriteIconImports(TABLER_SOURCE)).toContain(
      'import { Check as IconCheck, X as IconX } from "lucide-react";',
    );
    expect(rewriteIconImports(TABLER_SOURCE)).toContain("<IconCheck");
    expect(rewriteIconImports(TABLER_SOURCE)).not.toContain("@tabler");
  });

  it("handles multi-line import clauses", () => {
    const content = `import {
  IconChevronDown,
  IconSearch,
  IconX,
} from "@tabler/icons-react";`;

    expect(rewriteIconImports(content)).toBe(
      'import { ChevronDown as IconChevronDown, Search as IconSearch, X as IconX } from "lucide-react";',
    );
  });

  it("handles single quotes and a missing semicolon", () => {
    expect(
      rewriteIconImports("import { IconMoon } from '@tabler/icons-react'"),
    ).toBe('import { Moon as IconMoon } from "lucide-react";');
  });

  it("preserves existing aliases", () => {
    expect(
      rewriteIconImports(
        'import { IconCheck as Tick } from "@tabler/icons-react";',
      ),
    ).toBe('import { Check as Tick } from "lucide-react";');
  });

  it("leaves typeof references and icon records untouched", () => {
    const content = `import { IconCamera } from "@tabler/icons-react";
type IconType = typeof IconCamera;
const record = { camera: IconCamera };`;

    const next = rewriteIconImports(content);

    expect(next).toContain("type IconType = typeof IconCamera;");
    expect(next).toContain("const record = { camera: IconCamera };");
    expect(next).toContain(
      'import { Camera as IconCamera } from "lucide-react";',
    );
  });

  it("injects fill on filled icons once, respecting existing fill", () => {
    const content = `import { IconStarFilled, IconPinFilled } from "@tabler/icons-react";
const a = <IconStarFilled className="h-4 w-4" />;
const b = <IconPinFilled fill="none" />;`;

    const next = rewriteIconImports(content);

    expect(next).toContain(
      '<IconStarFilled fill="currentColor" className="h-4 w-4" />',
    );
    expect(next).toContain('<IconPinFilled fill="none" />');
    expect(rewriteIconImports(next)).toBe(next);
  });

  it("rewrites every tabler statement and keeps other imports", () => {
    const content = `import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "cn";
import { IconX } from "@tabler/icons-react";`;

    const next = rewriteIconImports(content);

    expect(next).toContain('import { useState } from "react";');
    expect(next).toContain('import { cn } from "cn";');
    expect(next).toContain(
      'import { Check as IconCheck } from "lucide-react";',
    );
    expect(next).toContain('import { X as IconX } from "lucide-react";');
  });

  it("throws on an unmapped icon", () => {
    expect(() =>
      rewriteIconImports(
        'import { IconDoesNotExist } from "@tabler/icons-react";',
      ),
    ).toThrow(ValidationError);
  });

  it("ignores non-import mentions of the package", () => {
    const content = "// docs: https://tabler.io/icons (@tabler/icons-react)\n";

    expect(rewriteIconImports(content)).toBe(content);
  });
});

describe("rewriteIconImports (stroke props)", () => {
  it("translates tabler stroke width to lucide strokeWidth", () => {
    const content = `import { IconCheck, IconX } from "@tabler/icons-react";
const ok = <IconCheck className="size-full" stroke={3} aria-hidden="true" />;
const err = <IconX stroke={3} />;`;

    const next = rewriteIconImports(content);

    expect(next).toContain('strokeWidth={3} aria-hidden="true"');
    expect(next).toContain("<IconX strokeWidth={3} />");
    expect(next).not.toMatch(/\bstroke=/);
    expect(rewriteIconImports(next)).toBe(next);
  });

  it("leaves stroke on non-icon elements and aliased bindings intact", () => {
    const content = `import { IconCheck as Tick } from "@tabler/icons-react";
const line = <line stroke="red" strokeWidth={1} />;
const ok = <Tick stroke={2} />;`;

    const next = rewriteIconImports(content);

    expect(next).toContain('<line stroke="red" strokeWidth={1} />');
    expect(next).toContain("<Tick strokeWidth={2} />");
  });
});

describe("rewriteIconSources", () => {
  it("converts project sources, skipping node_modules and dist", () => {
    const dir = tempDir();

    writeSource(dir, "src/a.tsx", TABLER_SOURCE);
    writeSource(dir, "src/nested/b.ts", TABLER_SOURCE);
    writeSource(dir, "src/c.tsx", "export const plain = 1;\n");
    writeSource(dir, "node_modules/pkg/d.tsx", TABLER_SOURCE);
    writeSource(dir, "dist/e.tsx", TABLER_SOURCE);

    const rewritten = rewriteIconSources(dir).map((path) =>
      path.replaceAll("\\", "/"),
    );

    expect(rewritten.sort()).toEqual(["src/a.tsx", "src/nested/b.ts"]);
    expect(readFileSync(join(dir, "src/c.tsx"), "utf-8")).toBe(
      "export const plain = 1;\n",
    );
    expect(readFileSync(join(dir, "node_modules/pkg/d.tsx"), "utf-8")).toBe(
      TABLER_SOURCE,
    );
  });
});

describe("applyIconLibrary", () => {
  it("installs lucide-react, rewrites sources, and never removes tabler", async () => {
    const dir = tempDir();

    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({
        dependencies: { "@tabler/icons-react": "^3.0.0" },
      }),
      "utf-8",
    );
    writeSource(dir, "src/welcome.tsx", TABLER_SOURCE);

    const calls: string[][] = [];

    await applyIconLibrary(dir, "lucide", {
      yes: true,
      installer: fakeInstaller(calls),
    });

    expect(calls.flat()).toEqual(["lucide-react@^1.76.0"]);
    expect(readFileSync(join(dir, "src/welcome.tsx"), "utf-8")).toContain(
      'from "lucide-react"',
    );

    const config = readJson<{ iconLibrary: string }>(
      join(dir, "components.json"),
    );

    const pkg = readJson<{ dependencies: Record<string, string> }>(
      join(dir, "package.json"),
    );

    expect(config.iconLibrary).toBe("lucide");
    expect(pkg.dependencies["@tabler/icons-react"]).toBe("^3.0.0");
  });

  it("skips the install when lucide-react is already present", async () => {
    const dir = tempDir();

    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { "lucide-react": "^1.76.0" } }),
      "utf-8",
    );

    const calls: string[][] = [];

    await applyIconLibrary(dir, "lucide", {
      yes: true,
      installer: fakeInstaller(calls),
    });

    expect(calls).toEqual([]);
  });

  it("switching back to tabler records config without rewriting sources", async () => {
    const dir = tempDir();

    writeSource(
      dir,
      "src/a.tsx",
      'import { Check as IconCheck } from "lucide-react";\n',
    );

    await applyIconLibrary(dir, "tabler", {
      yes: true,
      installer: fakeInstaller([]),
    });

    expect(readFileSync(join(dir, "src/a.tsx"), "utf-8")).toContain(
      'from "lucide-react"',
    );

    const config = readJson<{ iconLibrary: string }>(
      join(dir, "components.json"),
    );

    expect(config.iconLibrary).toBe("tabler");
  });
});

describe("planNpmDeps (icon substitution)", () => {
  // SAFETY: planNpmDeps only reads .dependencies from each payload.
  const items = [
    { dependencies: ["@tabler/icons-react", "cn"] },
  ] as RegistryItemPayload[];

  it("substitutes lucide-react with the pinned range", () => {
    const plan = planNpmDeps(items, {}, "lucide");

    expect(plan).toContain("lucide-react@^1.76.0");
    expect(plan).toContain("cn");
    expect(plan.join(" ")).not.toContain("@tabler");
  });

  it("keeps tabler by default", () => {
    expect(planNpmDeps(items, {})).toContain("@tabler/icons-react");
  });

  it("skips lucide-react when the consumer already declares it", () => {
    const plan = planNpmDeps(
      items,
      { dependencies: { "lucide-react": "^1.76.0" } },
      "lucide",
    );

    expect(plan).toEqual(["cn"]);
  });
});

function checkFile(content: string): SourceFile {
  return {
    name: "ui/test",
    path: "src/components/ui/test.tsx",
    content,
  };
}

function iconMeta(): ItemMeta {
  return {
    dependencies: ["@tabler/icons-react"],
    registryDependencies: [],
    files: ["ui/test.tsx"],
    description: "Well described.",
    categories: ["component"],
  };
}

function checkCtx(iconLibrary?: string): CheckContext {
  return {
    indexCss: "",
    items: new Map([["ui/test", iconMeta()]]),
    iconLibrary,
  };
}

const LUCIDE_SOURCE =
  'import { Check as IconCheck } from "lucide-react";\nexport const x = <IconCheck />;\n';

const TABLER_IMPORT_SOURCE =
  'import { IconCheck } from "@tabler/icons-react";\nexport const x = <IconCheck />;\n';

describe("imports-deps (lucide-aware)", () => {
  it("accepts lucide imports against canonical tabler declarations", () => {
    expect(
      importsMatchDeps(checkFile(LUCIDE_SOURCE), checkCtx("lucide")),
    ).toEqual([]);
  });

  it("flags lucide imports when the project is still on tabler", () => {
    const findings = importsMatchDeps(checkFile(LUCIDE_SOURCE), checkCtx());

    expect(findings.length).toBe(2);
    expect(findings.some((f) => f.message.includes("lucide-react"))).toBe(true);
    expect(
      findings.some((f) => f.message.includes("declares dependency")),
    ).toBe(true);
  });

  it("still accepts canonical tabler sources under a lucide config", () => {
    expect(
      importsMatchDeps(checkFile(TABLER_IMPORT_SOURCE), checkCtx("lucide")),
    ).toEqual([]);
  });

  it("flags unused icon declarations in both modes", () => {
    const content = "export const x = 1;\n";

    expect(
      importsMatchDeps(checkFile(content), checkCtx("lucide")).length,
    ).toBe(1);
    expect(importsMatchDeps(checkFile(content), checkCtx()).length).toBe(1);
  });
});
