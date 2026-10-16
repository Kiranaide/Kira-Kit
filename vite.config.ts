import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import { defineConfig, type Plugin } from "vite"
import { visualizer } from "rollup-plugin-visualizer"

/**
 * MediaPipe ships minified UMD bundles that attach their classes
 * (`FaceDetection`, `FaceMesh`) to the global object at runtime instead of
 * using ESM exports. `@tensorflow-models/*` then does
 * `import { FaceDetection } from "@mediapipe/face_detection"`, which Vite 7's
 * esbuild resolved via CJS interop but Vite 8's Rolldown cannot — it fails the
 * build with a MISSING_EXPORT error.
 *
 * This plugin appends an explicit named export that reads the class off the
 * global scope after the UMD IIFE has run, restoring the named binding.
 */
function mediapipeNamedExports(): Plugin {
  const shims: Record<string, string> = {
    "@mediapipe/face_detection": "FaceDetection",
    "@mediapipe/face_mesh": "FaceMesh",
  }

  return {
    name: "mediapipe-named-exports",
    transform: {
      // Only run on the two MediaPipe UMD bundles, not all ~9k modules.
      filter: { id: /[\\/]@mediapipe[\\/](face_detection|face_mesh)[\\/].*\.js$/ },
      handler(code, id) {
        for (const [pkg, exportName] of Object.entries(shims)) {
          if (id.includes(`/${pkg}/`) || id.includes(`\\${pkg}\\`)) {
            const g = "typeof globalThis!=='undefined'?globalThis:self"

            return {
              code: `${code}\nexport const ${exportName} = (${g}).${exportName};\n`,
              map: null,
            }
          }
        }

        return null
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    mediapipeNamedExports(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Let the mediapipeNamedExports plugin handle these in dev too, rather
    // than esbuild pre-bundling (which would strip the appended exports).
    exclude: ["@mediapipe/face_detection", "@mediapipe/face_mesh"],
  },
})
