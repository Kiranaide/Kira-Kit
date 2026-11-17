import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as { version: string };

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: "esm",
  target: "node22",
  platform: "node",
  banner: { js: "#!/usr/bin/env node" },
  define: { __KIRA_KIT_VERSION__: JSON.stringify(pkg.version) },
});
