import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { detect, resolveCommand } from "package-manager-detector";
import { ValidationError } from "../../lib/errors";
import { info, success, warning } from "../../lib/logger";
import { confirm } from "../../lib/prompts";
import type { RegistryItemPayload } from "../../lib/schemas";

/**
 * Explicit ranges for deps whose majors matter to consumers; everything else
 * installs at the package's latest. Shared with the source scaffold.
 */
export const PINNED_RANGES = {
  "react-day-picker": "^10.0.0",
  "embla-carousel": "8.6.0",
  "embla-carousel-react": "^8.6.0",
  "react-resizable-panels": "4.16.0",
  "modern-monaco": "^0.4.2",
  recharts: "^3.10.0",
  "date-fns": "^4.4.0",
  "@date-fns/tz": "^1.5.0",
  "lucide-react": "^1.76.0",
} satisfies Record<string, string>;

/** Framework packages the consumer owns; add never installs or upgrades them. */
const FRAMEWORK_DEPS = new Set(["react", "react-dom", "next"]);

export interface ConsumerPackageJson {
  type?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export function readConsumerPackage(cwd: string): ConsumerPackageJson {
  const path = join(cwd, "package.json");

  if (!existsSync(path)) return {};

  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

function pinnedSpec(name: string): string {
  if (Object.hasOwn(PINNED_RANGES, name)) {
    // SAFETY: Object.hasOwn above proves name is a key of PINNED_RANGES.
    return `${name}@${PINNED_RANGES[name as keyof typeof PINNED_RANGES]}`;
  }

  return name;
}

/** Split "pkg", "pkg@^1", "@scope/pkg", "@scope/pkg@^1" into name + spec. */
function splitDep(dep: string) {
  const at = dep.lastIndexOf("@");

  if (at > 0) return { name: dep.slice(0, at), spec: dep };

  return { name: dep, spec: pinnedSpec(dep) };
}

function iconSubstitute(raw: string, iconLibrary?: string): string {
  return iconLibrary === "lucide" && raw === "@tabler/icons-react"
    ? "lucide-react"
    : raw;
}

function declaredDepNames(pkg: ConsumerPackageJson): Set<string> {
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
}

/**
 * Install specs for the wanted packages the consumer has not declared in
 * dependencies, devDependencies, or peerDependencies, with major-pinned
 * ranges applied and duplicates collapsed.
 */
export function planMissingDeps(
  wanted: readonly string[],
  pkg: ConsumerPackageJson,
): string[] {
  const present = declaredDepNames(pkg);
  const specs = new Map<string, string>();

  for (const raw of wanted) {
    const { name, spec } = splitDep(raw);

    if (present.has(name)) continue;

    specs.set(name, spec);
  }

  return [...specs.values()];
}

/**
 * Union of item npm deps (pinned where majors matter), minus framework
 * packages and anything the consumer already declares. With iconLibrary
 * "lucide", tabler icon deps are substituted before dedupe.
 */
export function planNpmDeps(
  items: RegistryItemPayload[],
  pkg: ConsumerPackageJson,
  iconLibrary?: string,
): string[] {
  const wanted = items
    .flatMap((item) =>
      (item.dependencies ?? []).map((raw) => iconSubstitute(raw, iconLibrary)),
    )
    .filter((raw) => !FRAMEWORK_DEPS.has(splitDep(raw).name));

  return planMissingDeps(wanted, pkg);
}

async function run(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  const child = spawn(command, args, { cwd, stdio: "inherit", shell: true });

  await new Promise<void>((resolvePromise, reject) => {
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolvePromise()
        : reject(
            new ValidationError(
              `${command} exited with ${code}`,
              "Retry, or install the packages manually.",
            ),
          ),
    );
  });
}

/** Package-install side effects, injectable for tests and embedders. */
export interface DepInstaller {
  install(cwd: string, deps: string[]): Promise<void>;
  installAll?(cwd: string): Promise<void>;
}

export const defaultDepInstaller: DepInstaller = {
  async install(cwd, deps) {
    const detected = await detect({ cwd });
    const agent = detected?.name ?? "npm";
    const command = resolveCommand(agent, "add", deps);

    if (!command) {
      throw new ValidationError(
        `Could not build an install command for ${agent}.`,
        `Install manually: ${deps.join(" ")}`,
      );
    }

    await run(command.command, command.args, cwd);
  },

  async installAll(cwd) {
    const detected = await detect({ cwd });
    const agent = detected?.name ?? "npm";
    const command = resolveCommand(agent, "install", []);

    if (!command) {
      throw new ValidationError(
        `Could not build an install command for ${agent}.`,
        `Install manually: ${agent} install`,
      );
    }

    await run(command.command, command.args, cwd);
  },
};

/** Install all project dependencies in `cwd` using the detected package manager. */
export async function installProjectDeps(
  cwd: string,
  installer: DepInstaller = defaultDepInstaller,
): Promise<boolean> {
  const detected = await detect({ cwd });
  const pm = detected?.name ?? "npm";

  info(`Installing dependencies with ${pm}…`);

  try {
    if (installer.installAll) {
      await installer.installAll(cwd);
    } else {
      await defaultDepInstaller.installAll!(cwd);
    }

    success("Dependencies installed.");

    return true;
  } catch (error) {
    warning(
      `Dependency install failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    info(`Install manually: cd ${cwd} && ${pm} install`);

    return false;
  }
}

/** Install missing npm deps with the consumer's detected package manager. */
export async function installNpmDeps(
  cwd: string,
  deps: string[],
  ctx: { yes?: boolean },
  installer: DepInstaller = defaultDepInstaller,
): Promise<boolean> {
  if (deps.length === 0) return false;

  const shown = deps.slice(0, 6).join(", ");
  const suffix = deps.length > 6 ? `, … (${deps.length} total)` : "";

  const proceed = await confirm(
    { yes: ctx.yes },
    `Install ${deps.length} package(s)? (${shown}${suffix})`,
    true,
  );

  if (!proceed) {
    warning("Skipped dependency install.");
    info(`Install manually: ${deps.join(" ")}`);

    return false;
  }

  info(`Installing ${shown}${suffix}…`);
  await installer.install(cwd, deps);
  success("Dependencies installed.");

  return true;
}

/**
 * Install whichever of the wanted npm packages the consumer has not declared,
 * pinned where majors matter. Returns whether anything was installed.
 */
export async function ensureNpmDeps(
  cwd: string,
  wanted: readonly string[],
  ctx: { yes?: boolean },
  installer: DepInstaller = defaultDepInstaller,
): Promise<boolean> {
  return installNpmDeps(
    cwd,
    planMissingDeps(wanted, readConsumerPackage(cwd)),
    ctx,
    installer,
  );
}
