/**
 * Prebuild: embed the kit's base CSS, vendored utilities, and default theme
 * tokens into src/generated/assets.ts so `kira-kit init` works offline, and
 * sync the same CSS into the bundled create templates.
 *
 * Usage (from packages/cli): bun run scripts/embed-assets.ts
 */
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syncEmbeddedAssets } from "../src/core/css/assets-sync";

const REPO_ROOT = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../../..",
);

const result = syncEmbeddedAssets(REPO_ROOT);

if (result.assetsWritten) {
  console.log("Embedded kit CSS assets into src/generated/assets.ts.");
  console.log(`Synced kit CSS into ${result.templatesSynced} templates.`);
}
