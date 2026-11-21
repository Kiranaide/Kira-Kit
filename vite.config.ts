import fs from "node:fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, type Plugin } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

type LlmsMiddlewareServer = {
  use: (
    fn: (
      req: {
        url?: string;
        headers: Record<string, string | string[] | undefined>;
      },
      res: {
        setHeader: (name: string, value: string) => void;
        end: (body: string) => void;
      },
      next: () => void,
    ) => void,
  ) => void;
};

function attachLlmsOriginMiddleware(
  middlewares: LlmsMiddlewareServer,
  filePath: string,
) {
  middlewares.use((req, res, next) => {
    const pathname = req.url?.split("?")[0];

    if (pathname !== "/llms.txt" || !fs.existsSync(filePath)) {
      next();

      return;
    }

    const rawHost = req.headers.host;
    const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
    const rawProto = req.headers["x-forwarded-proto"];

    const proto =
      (Array.isArray(rawProto) ? rawProto[0] : rawProto)
        ?.split(",")[0]
        ?.trim() || "http";

    const content = fs.readFileSync(filePath, "utf-8");

    const body = host
      ? content.replaceAll("](/docs/", `](${proto}://${host}/docs/`)
      : content;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.end(body);
  });
}

// Qualify root-relative /docs/ links in llms.txt with the live request origin
// during local `vite` dev and `vite preview` runs.
function llmsOriginPlugin(): Plugin {
  return {
    name: "kira-llms-origin",
    configureServer(server) {
      attachLlmsOriginMiddleware(
        server.middlewares,
        path.resolve(import.meta.dirname, "public/llms.txt"),
      );
    },
    configurePreviewServer(server) {
      attachLlmsOriginMiddleware(
        server.middlewares,
        path.resolve(import.meta.dirname, "dist/llms.txt"),
      );
    },
  };
}

// Bundle analysis is opt-in (`ANALYZE=1 bun run build`) so normal and CI builds
// don't pay the visualizer's generateBundle cost or try to open a browser.
const analyze = process.env.ANALYZE === "1" || process.env.ANALYZE === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    llmsOriginPlugin(),
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
    // This showcase ships heavy code tooling (Monaco, the Markdown editor,
    // Shiki grammars) as lazy bundles that load on demand, so none affect
    // first paint. Rolldown's automatic splitting isolates each dynamic import;
    // manual maxSize groups were tried and caused circular-chunk init errors.
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
