import { afterEach, beforeEach, describe, expect, it } from "vitest";
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
import { installItems } from "../src/core/install/engine";
import {
  planNpmDeps,
  PINNED_RANGES,
  type DepInstaller,
} from "../src/core/install/deps";
import type { RegistryItemPayload } from "../src/lib/schemas";

let tempDirs: string[] = [];
let installCalls: Array<{ cwd: string; deps: string[] }> = [];

const fakeInstaller: DepInstaller = {
  install: async (cwd, deps) => {
    installCalls.push({ cwd, deps });
  },
};

function tempConsumer(extraConfig: { rsc?: boolean } = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-install-"));
  tempDirs.push(dir);

  writeFileSync(
    join(dir, "kira-kit.json"),
    JSON.stringify({
      css: "src/index.css",
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        hooks: "@/hooks",
        lib: "@/lib",
      },
      ...extraConfig,
    }),
  );
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ dependencies: { react: "^19.3.1", cn: "^1.0.0" } }),
  );
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    }),
  );
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(
    join(dir, "src/index.css"),
    ":root {\n  --primary: oklch(0.59 0.22 1);\n}\n\n.dark {\n  --primary: oklch(0.7 0.2 1);\n}\n",
  );

  return dir;
}

function buttonPayload(): RegistryItemPayload {
  return {
    name: "button",
    type: "registry:ui",
    dependencies: ["cn", "@tabler/icons-react", "react"],
    files: [
      {
        path: "src/components/ui/button.tsx",
        content:
          'import { cn } from "cn";\nimport { helper } from "@/lib/layout-responsive";\nexport function Button() { return cn(helper); }\r\n',
      },
    ],
  };
}

function libPayload(): RegistryItemPayload {
  return {
    name: "layout-responsive",
    type: "registry:lib",
    files: [
      {
        path: "src/lib/layout-responsive.ts",
        content: 'export const helper = "x";\n',
      },
    ],
  };
}

function motionPayload(): RegistryItemPayload {
  return {
    name: "route-transition",
    type: "registry:ui",
    files: [
      {
        path: "src/components/ui/route-transition.tsx",
        content: "export {};\n",
      },
    ],
    css: ":root {\n  --ease-spring: linear(0, 1);\n}\n\n@theme inline {\n  --animate-route-fade: route-fade 0.15s ease-out both;\n}\n\n@keyframes route-fade {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n",
  };
}

beforeEach(() => {
  installCalls = [];
});

afterEach(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
});

describe("planNpmDeps", () => {
  it("unions deps, pins majors, skips framework and present packages", () => {
    const items = [
      { name: "a", dependencies: ["embla-carousel", "date-fns", "zod", "cn"] },
      { name: "b", dependencies: ["react", "react-dom", "zod", "date-fns"] },
    ];

    const deps = planNpmDeps(items, { dependencies: { cn: "^1.0.0" } });

    expect(deps).toEqual([
      `embla-carousel@${PINNED_RANGES["embla-carousel"]}`,
      `date-fns@${PINNED_RANGES["date-fns"]}`,
      "zod",
    ]);
  });

  it("keeps explicit version specs verbatim", () => {
    const deps = planNpmDeps(
      [
        {
          name: "a",
          dependencies: ["embla-carousel@9.0.0", "@uiw/color-convert"],
        },
      ],
      {},
    );

    expect(deps).toEqual(["embla-carousel@9.0.0", "@uiw/color-convert"]);
  });
});

describe("installItems", () => {
  it("writes ui and lib files, installs missing deps, normalizes CRLF", async () => {
    const dir = tempConsumer();

    const result = await installItems(
      { items: [buttonPayload(), libPayload()] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    const button = readFileSync(
      join(dir, "src/components/ui/button.tsx"),
      "utf-8",
    );

    expect(button).toContain('from "@/lib/layout-responsive"');
    expect(button).not.toContain("\r");
    expect(existsSync(join(dir, "src/lib/layout-responsive.ts"))).toBe(true);
    expect(result.npmDeps).toEqual(["@tabler/icons-react"]);
    expect(installCalls).toEqual([{ cwd: dir, deps: ["@tabler/icons-react"] }]);
  });

  it("prepends use client when rsc is enabled", async () => {
    const dir = tempConsumer({ rsc: true });

    await installItems(
      { items: [buttonPayload()] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    const button = readFileSync(
      join(dir, "src/components/ui/button.tsx"),
      "utf-8",
    );

    expect(button.startsWith('"use client";')).toBe(true);
  });

  it("skips identical files and conflicting files under --yes", async () => {
    const dir = tempConsumer();
    const target = join(dir, "src/components/ui/button.tsx");
    mkdirSync(join(dir, "src/components/ui"), { recursive: true });
    writeFileSync(target, "// local edit\n");

    const first = await installItems(
      { items: [buttonPayload()] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    expect(first.skipped).toContain(target);
    expect(first.conflicts).toContain(target);
    expect(readFileSync(target, "utf-8")).toBe("// local edit\n");

    const second = await installItems(
      { items: [buttonPayload()] },
      { cwd: dir, yes: true, overwrite: true, installer: fakeInstaller },
    );

    expect(second.written).toContain(target);

    const third = await installItems(
      { items: [buttonPayload()] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    expect(third.skipped).toContain(target);
    expect(third.conflicts).toEqual([]);
  });

  it("writes nothing under --dry-run", async () => {
    const dir = tempConsumer();

    const result = await installItems(
      { items: [buttonPayload()] },
      { cwd: dir, yes: true, dryRun: true, installer: fakeInstaller },
    );

    expect(result.written.length).toBe(1);
    expect(existsSync(join(dir, "src/components/ui/button.tsx"))).toBe(false);
    expect(installCalls).toEqual([]);
  });
});

describe("installItems (css and config)", () => {
  it("merges theme cssVars into the consumer CSS", async () => {
    const dir = tempConsumer();

    const theme: RegistryItemPayload = {
      name: "theme-test",
      type: "registry:theme",
      cssVars: {
        light: { "--primary": "oklch(0.663 0.193 22.3)" },
        dark: { "--primary": "oklch(0.8 0.1 22.3)" },
      },
    };

    const result = await installItems(
      { items: [theme] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(result.cssVarsApplied).toBe(true);
    expect(css).toContain("--primary: oklch(0.663 0.193 22.3);");
    expect(css).toContain("--primary: oklch(0.8 0.1 22.3);");
  });

  it("requires kira-kit.json and guides legacy components.json users to migrate", async () => {
    const dir = mkdtempSync(join(tmpdir(), "kira-bare-"));
    tempDirs.push(dir);

    await expect(
      installItems(
        { items: [buttonPayload()] },
        { cwd: dir, yes: true, installer: fakeInstaller },
      ),
    ).rejects.toThrow("No kira-kit.json");

    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify({ style: "kira" }),
    );

    await expect(
      installItems(
        { items: [buttonPayload()] },
        { cwd: dir, yes: true, installer: fakeInstaller },
      ),
    ).rejects.toThrow(/legacy components\.json/);
  });
});

describe("installItems (item css)", () => {
  it("merges item css into the global stylesheet, idempotently", async () => {
    const dir = tempConsumer();

    const result = await installItems(
      { items: [motionPayload()] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    const css = readFileSync(join(dir, "src/index.css"), "utf-8");

    expect(result.cssRulesApplied).toBe(true);
    expect(css).toContain("--ease-spring: linear(0, 1);");
    expect(css).toContain(
      "--animate-route-fade: route-fade 0.15s ease-out both;",
    );
    expect(css).toContain("@keyframes route-fade");
    expect(css).toContain("--primary: oklch(0.59 0.22 1);");

    const again = await installItems(
      { items: [motionPayload()] },
      { cwd: dir, yes: true, installer: fakeInstaller },
    );

    expect(again.cssRulesApplied).toBe(false);
    expect(readFileSync(join(dir, "src/index.css"), "utf-8")).toBe(css);
  });

  it("skips item css on dry run", async () => {
    const dir = tempConsumer();

    const result = await installItems(
      { items: [motionPayload()] },
      { cwd: dir, yes: true, dryRun: true, installer: fakeInstaller },
    );

    expect(result.cssRulesApplied).toBe(false);
    expect(readFileSync(join(dir, "src/index.css"), "utf-8")).not.toContain(
      "@keyframes route-fade",
    );
  });
});
