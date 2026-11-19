import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// Bundle analysis is opt-in (`ANALYZE=1 bun run build`) so normal and CI builds
// don't pay the visualizer's generateBundle cost or try to open a browser.
const analyze = process.env.ANALYZE === "1" || process.env.ANALYZE === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    ...(analyze
      ? [
          visualizer({
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
            template: "treemap",
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // This showcase intentionally ships heavy code tooling as lazy bundles: the
    // Monaco editor (~1.5 MB), the Markdown editor (~1.1 MB) and Shiki grammars
    // (~0.9 MB). Each loads on demand via dynamic import / lazy routes, so none
    // affect first paint (the entry chunk is ~490 kB). Rolldown's automatic
    // splitting isolates them per dynamic import; manual maxSize chunk groups
    // were tried but produced circular-chunk init errors at runtime, so we keep
    // the default splitting and set the advisory limit above the largest lazy
    // bundle rather than force-splitting tightly-coupled editor internals.
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        // "use client" / "use no memo" are intentional React directives (the
        // latter keeps TanStack Virtual out of React Compiler). Rolldown can't
        // preserve module-level directives in bundled output, but these are
        // handled by the React plugin/compiler, so the warning is noise.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        defaultHandler(warning);
      },
    },
  },
});
