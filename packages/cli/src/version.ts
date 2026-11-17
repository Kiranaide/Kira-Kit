import { createRequire } from "node:module";

declare const __KIRA_KIT_VERSION__: string | undefined;

/**
 * Single source of truth: packages/cli/package.json. The bundler injects
 * __KIRA_KIT_VERSION__ at build time; in dev/tests we read the file.
 */
/** kira-kit's own package.json — the only field getVersion() reads. */
interface PackageJsonWithVersion {
  version: string;
}

export function getVersion(): string {
  if (typeof __KIRA_KIT_VERSION__ !== "undefined") {
    return __KIRA_KIT_VERSION__;
  }
  try {
    const require = createRequire(import.meta.url);
    // SAFETY: ../package.json is kira-kit's own manifest, which always ships a
    // semver "version" field required by npm publishing.
    return (require("../package.json") as PackageJsonWithVersion).version;
  } catch {
    return "0.0.0";
  }
}
