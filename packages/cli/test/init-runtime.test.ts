import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { init } from "../src/commands/init";
import {
  configureRuntime,
  patchAstroConfigText,
  patchBunfigText,
  patchPostcssConfigText,
  patchViteConfigText,
} from "../src/core/init/configure-runtime";
import { detectProjectRuntime } from "../src/core/init/detect-runtime";
import {
  configureTsconfigPaths,
  ensureTsconfigAliasText,
} from "../src/core/init/tsconfig";
import type {
  ConsumerPackageJson,
  DepInstaller,
} from "../src/core/install/deps";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

interface TestPackageJson extends ConsumerPackageJson {
  name?: string;
}

function tempProject(
  pkg: TestPackageJson = {
    name: "consumer",
    dependencies: { react: "^19.3.1", "react-dom": "^19.3.1" },
  },
): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-runtime-"));

  temps.push(dir);
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(pkg, null, 2),
    "utf-8",
  );

  return dir;
}

function fakeInstaller(calls: string[][]): DepInstaller {
  return {
    async install(_cwd, deps) {
      calls.push(deps);
    },
  };
}

const REACT_19 = { react: "^19.3.1", "react-dom": "^19.3.1" };

describe("detectProjectRuntime", () => {
  it("detects Vite 8 and parses its major version", () => {
    const dir = tempProject({
      dependencies: REACT_19,
      devDependencies: { vite: "^8.3.5" },
    });

    writeFileSync(join(dir, "vite.config.ts"), "export default {};\n", "utf-8");

    const runtime = detectProjectRuntime(dir);

    expect(runtime.kind).toBe("vite");
    expect(runtime.usesVite).toBe(true);
    expect(runtime.viteMajor).toBe(8);
    expect(runtime.configFile).toBe("vite.config.ts");
    expect(runtime.tailwindDeps).toEqual(["tailwindcss", "@tailwindcss/vite"]);
  });

  it("detects Vite + Nitro v3 when vite.config imports nitro/vite", () => {
    const dir = tempProject({
      dependencies: REACT_19,
      devDependencies: { vite: "^8.0.0", nitro: "^3.0.0" },
    });

    writeFileSync(
      join(dir, "vite.config.ts"),
      'import { nitro } from "nitro/vite";\nexport default { plugins: [nitro()] };\n',
      "utf-8",
    );

    const runtime = detectProjectRuntime(dir);

    expect(runtime.kind).toBe("vite");
    expect(runtime.label).toBe("Vite + Nitro");
    expect(runtime.hasNitro).toBe(true);
    expect(runtime.tailwindDeps).toEqual(["tailwindcss", "@tailwindcss/vite"]);
  });

  it("detects Next.js (Turbopack) from next.config.ts or dependency", () => {
    const dir = tempProject({
      dependencies: { ...REACT_19, next: "^16.0.0" },
    });

    writeFileSync(join(dir, "next.config.ts"), "export default {};\n", "utf-8");

    const runtime = detectProjectRuntime(dir);

    expect(runtime.kind).toBe("turbopack");
    expect(runtime.isNext).toBe(true);
    expect(runtime.tailwindDeps).toEqual([
      "tailwindcss",
      "@tailwindcss/postcss",
      "postcss",
    ]);
  });

  it("detects standalone Nitro when nitro.config.ts exists without Vite", () => {
    const dir = tempProject({
      dependencies: REACT_19,
      devDependencies: { nitro: "^3.0.0" },
    });

    writeFileSync(
      join(dir, "nitro.config.ts"),
      "export default {};\n",
      "utf-8",
    );

    const runtime = detectProjectRuntime(dir);

    expect(runtime.kind).toBe("nitro");
    expect(runtime.hasNitro).toBe(true);
    expect(runtime.usesVite).toBe(false);
    expect(runtime.tailwindDeps).toEqual([
      "tailwindcss",
      "@tailwindcss/postcss",
      "postcss",
    ]);
  });
});

describe("detectProjectRuntime (Astro & Bun)", () => {
  it("detects Astro and Bun runtimes", () => {
    const astroDir = tempProject({
      dependencies: { ...REACT_19, astro: "^5.0.0" },
    });

    writeFileSync(
      join(astroDir, "astro.config.mjs"),
      "export default {};\n",
      "utf-8",
    );
    expect(detectProjectRuntime(astroDir).kind).toBe("astro");

    const bunDir = tempProject({ dependencies: REACT_19 });

    writeFileSync(join(bunDir, "bunfig.toml"), "[install]\n", "utf-8");
    const bunRuntime = detectProjectRuntime(bunDir);

    expect(bunRuntime.kind).toBe("bun");
    expect(bunRuntime.tailwindDeps).toEqual([
      "tailwindcss",
      "bun-plugin-tailwind",
    ]);
  });
});

describe("configureTsconfigPaths", () => {
  it("adds @/* without deprecated baseUrl and preserves JSONC comments", () => {
    const input = `{
  // TypeScript 6 config
  "compilerOptions": {
    "target": "ES2022",
    /* strict mode */
    "strict": true
  }
}
`;

    const result = ensureTsconfigAliasText(input, "./src/*");

    expect(result.changed).toBe(true);
    expect(result.content).toContain("// TypeScript 6 config");
    expect(result.content).toContain("/* strict mode */");
    expect(result.content).toContain('"@/*": ["./src/*"]');
    expect(result.content).not.toContain("baseUrl");

    const second = ensureTsconfigAliasText(result.content, "./src/*");

    expect(second.changed).toBe(false);
  });

  it("updates both tsconfig.json and tsconfig.app.json in split Vite projects", () => {
    const dir = tempProject({
      dependencies: REACT_19,
      devDependencies: { typescript: "^6.0.0" },
    });

    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify(
        { files: [], references: [{ path: "./tsconfig.app.json" }] },
        null,
        2,
      ) + "\n",
      "utf-8",
    );
    writeFileSync(
      join(dir, "tsconfig.app.json"),
      JSON.stringify(
        { compilerOptions: { target: "ES2022", strict: true } },
        null,
        2,
      ) + "\n",
      "utf-8",
    );

    const res = configureTsconfigPaths(dir);

    expect(res.updatedFiles).toEqual(["tsconfig.json", "tsconfig.app.json"]);
    expect(readFileSync(join(dir, "tsconfig.json"), "utf-8")).toContain(
      '"@/*": ["./src/*"]',
    );
    expect(readFileSync(join(dir, "tsconfig.app.json"), "utf-8")).toContain(
      '"@/*": ["./src/*"]',
    );
  });

  it("maps @/* to ./* for root app/ projects without src/", () => {
    const dir = tempProject({
      dependencies: { ...REACT_19, next: "^16.0.0" },
      devDependencies: { typescript: "^6.0.0" },
    });

    mkdirSync(join(dir, "app"), { recursive: true });
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { strict: true } }, null, 2) + "\n",
      "utf-8",
    );

    const res = configureTsconfigPaths(dir);

    expect(res.aliasTarget).toBe("./*");
    expect(readFileSync(join(dir, "tsconfig.json"), "utf-8")).toContain(
      '"@/*": ["./*"]',
    );
  });
});

describe("Vite config patching", () => {
  it("patches Vite 8 config with @tailwindcss/vite and native resolve.tsconfigPaths", () => {
    const input = `import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
`;

    const first = patchViteConfigText(input, "vite.config.ts", {
      viteMajor: 8,
      aliasDir: "./src",
    });

    expect(first.changed).toBe(true);
    expect(first.content).toContain(
      'import tailwindcss from "@tailwindcss/vite";',
    );
    expect(first.content).toContain("plugins: [react(), tailwindcss()]");
    expect(first.content).toContain("tsconfigPaths: true");
    expect(first.content).not.toContain("fileURLToPath");

    const second = patchViteConfigText(first.content, "vite.config.ts", {
      viteMajor: 8,
      aliasDir: "./src",
    });

    expect(second.changed).toBe(false);
  });

  it("patches Vite 7 config with @tailwindcss/vite and resolve.alias", () => {
    const input = `import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
`;

    const first = patchViteConfigText(input, "vite.config.ts", {
      viteMajor: 7,
      aliasDir: "./src",
    });

    expect(first.changed).toBe(true);
    expect(first.content).toContain(
      'import tailwindcss from "@tailwindcss/vite";',
    );
    expect(first.content).toContain(
      'import { fileURLToPath, URL } from "node:url";',
    );
    expect(first.content).toContain(
      '"@": fileURLToPath(new URL("./src", import.meta.url))',
    );

    const second = patchViteConfigText(first.content, "vite.config.ts", {
      viteMajor: 7,
      aliasDir: "./src",
    });

    expect(second.changed).toBe(false);
  });

  it("supports arrow-function defineConfig and respects existing vite-tsconfig-paths", () => {
    const input = `import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
}));
`;

    const res = patchViteConfigText(input, "vite.config.ts", {
      viteMajor: 8,
      aliasDir: "./src",
    });

    expect(res.changed).toBe(true);
    expect(res.content).toContain("tailwindcss()");
    expect(res.content).not.toContain("resolve:");
  });
});

describe("Astro, PostCSS, and Bun config patching", () => {
  it("patches Astro config with vite.plugins tailwindcss()", () => {
    const input = `import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
});
`;

    const res = patchAstroConfigText(input, "astro.config.mjs");

    expect(res.changed).toBe(true);
    expect(res.content).toContain(
      'import tailwindcss from "@tailwindcss/vite";',
    );
    expect(res.content).toContain("plugins: [tailwindcss()]");
    expect(
      patchAstroConfigText(res.content, "astro.config.mjs").changed,
    ).toBe(false);
  });

  it("patches existing postcss.config.mjs and bunfig.toml idempotently", () => {
    const postcss = `export default {
  plugins: {
    autoprefixer: {},
  },
};
`;

    const patchedPostcss = patchPostcssConfigText(
      postcss,
      "postcss.config.mjs",
    );

    expect(patchedPostcss.changed).toBe(true);
    expect(patchedPostcss.content).toContain('"@tailwindcss/postcss": {}');
    expect(
      patchPostcssConfigText(patchedPostcss.content, "postcss.config.mjs")
        .changed,
    ).toBe(false);

    const bunfig = '[serve.static]\nplugins = ["other-plugin"]\n';
    const patchedBunfig = patchBunfigText(bunfig);

    expect(patchedBunfig.changed).toBe(true);
    expect(patchedBunfig.content).toContain(
      'plugins = ["other-plugin", "bun-plugin-tailwind"]',
    );
    expect(patchBunfigText(patchedBunfig.content).changed).toBe(false);
  });
});

describe("init integration (Vite)", () => {
  it("configures Vite 8 + TypeScript paths + @tailwindcss/vite automatically", async () => {
    const dir = tempProject({
      dependencies: REACT_19,
      devDependencies: { vite: "^8.3.5", typescript: "^6.0.0" },
    });

    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(
      join(dir, "vite.config.ts"),
      `import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
`,
      "utf-8",
    );
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { strict: true } }, null, 2) + "\n",
      "utf-8",
    );

    const calls: string[][] = [];

    const code = await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);
    expect(calls.flat()).toContain("tailwindcss");
    expect(calls.flat()).toContain("@tailwindcss/vite");
    expect(calls.flat()).not.toContain("@tailwindcss/postcss");

    const viteConfig = readFileSync(join(dir, "vite.config.ts"), "utf-8");

    expect(viteConfig).toContain("@tailwindcss/vite");
    expect(viteConfig).toContain("tailwindcss()");
    expect(viteConfig).toContain("tsconfigPaths: true");

    const tsconfig = readFileSync(join(dir, "tsconfig.json"), "utf-8");

    expect(tsconfig).toContain('"@/*": ["./src/*"]');
    expect(tsconfig).not.toContain("baseUrl");
  });
});

describe("init integration (Turbopack & Nitro)", () => {
  it("configures Next.js (Turbopack) with postcss.config.mjs and @tailwindcss/postcss", async () => {
    const dir = tempProject({
      dependencies: { ...REACT_19, next: "^16.0.0" },
      devDependencies: { typescript: "^6.0.0" },
    });

    mkdirSync(join(dir, "app"), { recursive: true });
    writeFileSync(join(dir, "next.config.ts"), "export default {};\n", "utf-8");
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { strict: true } }, null, 2) + "\n",
      "utf-8",
    );

    const calls: string[][] = [];

    const code = await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);
    expect(calls.flat()).toContain("tailwindcss");
    expect(calls.flat()).toContain("@tailwindcss/postcss");
    expect(calls.flat()).toContain("postcss");
    expect(existsSync(join(dir, "postcss.config.mjs"))).toBe(true);
    expect(readFileSync(join(dir, "postcss.config.mjs"), "utf-8")).toContain(
      "@tailwindcss/postcss",
    );
    expect(readFileSync(join(dir, "tsconfig.json"), "utf-8")).toContain(
      '"@/*": ["./*"]',
    );
  });

  it("configures standalone Nitro with postcss.config.mjs and @tailwindcss/postcss", async () => {
    const dir = tempProject({
      dependencies: REACT_19,
      devDependencies: { nitro: "^3.0.0" },
    });

    writeFileSync(
      join(dir, "nitro.config.ts"),
      "export default {};\n",
      "utf-8",
    );

    const calls: string[][] = [];

    const code = await init({
      cwd: dir,
      force: false,
      yes: true,
      installer: fakeInstaller(calls),
    });

    expect(code).toBe(0);
    expect(calls.flat()).toContain("tailwindcss");
    expect(calls.flat()).toContain("@tailwindcss/postcss");
    expect(calls.flat()).toContain("postcss");
    expect(existsSync(join(dir, "postcss.config.mjs"))).toBe(true);

    const runtime = detectProjectRuntime(dir);
    const second = configureRuntime(dir, runtime);

    expect(second.updatedFiles).toEqual([]);
  });
});
