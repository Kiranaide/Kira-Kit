import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { updateRawConfig } from "../../lib/config";
import { ValidationError } from "../../lib/errors";
import { info, success } from "../../lib/logger";
import { installNpmDeps, readConsumerPackage, type DepInstaller } from "./deps";

/**
 * Tabler → lucide name map. Local bindings stay `IconX` after the rewrite,
 * so usages, typeof references, and icon records need no changes. Filled
 * tabler variants map to the base lucide icon plus a fill prop injected at
 * the JSX usage site; a few entries are approximate visual matches.
 */
export const TABLER_TO_LUCIDE = {
  IconAlertCircle: "CircleAlert",
  IconAlertTriangle: "TriangleAlert",
  IconArrowDown: "ArrowDown",
  IconArrowLeft: "ArrowLeft",
  IconArrowRight: "ArrowRight",
  IconArrowUp: "ArrowUp",
  IconArrowsSort: "ArrowUpDown",
  IconAspectRatio: "Ratio",
  IconBolt: "Zap",
  IconBoltOff: "ZapOff",
  IconCalendar: "Calendar",
  IconCalendarDue: "CalendarClock",
  IconCamera: "Camera",
  IconCameraOff: "CameraOff",
  IconCameraRotate: "SwitchCamera",
  IconCheck: "Check",
  IconChecklist: "ListChecks",
  IconChevronDown: "ChevronDown",
  IconChevronLeft: "ChevronLeft",
  IconChevronRight: "ChevronRight",
  IconChevronUp: "ChevronUp",
  IconChevronsDown: "ChevronsDown",
  IconChevronsLeft: "ChevronsLeft",
  IconChevronsRight: "ChevronsRight",
  IconChevronsUp: "ChevronsUp",
  IconCircle: "Circle",
  IconCircleCheck: "CircleCheck",
  IconCircleX: "CircleX",
  IconClock: "Clock",
  IconCloudOff: "CloudOff",
  IconColorPicker: "Pipette",
  IconCopy: "Copy",
  IconDots: "Ellipsis",
  IconDotsVertical: "EllipsisVertical",
  IconDownload: "Download",
  IconEdit: "Pencil",
  IconExternalLink: "ExternalLink",
  IconEye: "Eye",
  IconEyeOff: "EyeOff",
  IconFile: "File",
  IconFileOff: "FileX",
  IconFilter: "Filter",
  IconFolder: "Folder",
  IconFolderOpen: "FolderOpen",
  IconGrid3x3: "Grid3x3",
  IconGrid4x4: "Square",
  IconGridDots: "Grip",
  IconGripVertical: "GripVertical",
  IconHome: "House",
  IconInbox: "Inbox",
  IconInfoCircle: "Info",
  IconKeyboard: "Keyboard",
  IconLayoutGrid: "LayoutGrid",
  IconLayoutSidebar: "PanelLeft",
  IconLink: "Link",
  IconLoader: "Loader",
  IconLoader2: "LoaderCircle",
  IconLock: "Lock",
  IconMaximize: "Maximize",
  IconMenu2: "Menu",
  IconMessageCircle: "MessageCircle",
  IconMicrophone: "Mic",
  IconMicrophoneOff: "MicOff",
  IconMinus: "Minus",
  IconMoon: "Moon",
  IconMusic: "Music",
  IconPaperclip: "Paperclip",
  IconPhoto: "Image",
  IconPhotoOff: "ImageOff",
  IconPin: "Pin",
  IconPinFilled: "Pin",
  IconPinnedOff: "PinOff",
  IconPlayerPause: "Pause",
  IconPlayerPlay: "Play",
  IconPlayerSkipForward: "SkipForward",
  IconPlus: "Plus",
  IconRefresh: "RefreshCw",
  IconRotateClockwise: "RotateCw",
  IconSearch: "Search",
  IconSelector: "ChevronsUpDown",
  IconSettings: "Settings",
  IconShare: "Share2",
  IconSlash: "Slash",
  IconSparkles: "Sparkles",
  IconSquare: "Square",
  IconStar: "Star",
  IconStarFilled: "Star",
  IconStarHalfFilled: "StarHalf",
  IconSun: "Sun",
  IconTrash: "Trash2",
  IconTrendingDown: "TrendingDown",
  IconTrendingUp: "TrendingUp",
  IconUpload: "Upload",
  IconUser: "User",
  IconVideo: "Video",
  IconX: "X",
  IconZoomIn: "ZoomIn",
  IconZoomOut: "ZoomOut",
  IconZoomReset: "Focus",
} satisfies Record<string, string>;

function lucideTarget(source: string): string | undefined {
  if (!Object.hasOwn(TABLER_TO_LUCIDE, source)) return undefined;

  // SAFETY: Object.hasOwn above proves source is a key of TABLER_TO_LUCIDE.
  return TABLER_TO_LUCIDE[source as keyof typeof TABLER_TO_LUCIDE];
}

const TABLER_IMPORT =
  /import\s*\{([^}]+)\}\s*from\s*(["'])@tabler\/icons-react\2;?/g;

const FILLED_TAGS = ["IconPinFilled", "IconStarFilled"];

function injectFilledProps(content: string): string {
  let next = content;

  for (const tag of FILLED_TAGS) {
    next = next.replace(
      new RegExp(`<${tag}\\b(?![^>]*\\bfill=)`, "g"),
      `<${tag} fill="currentColor"`,
    );
  }

  return next;
}

// Tabler's `stroke` prop is the stroke width; lucide's `stroke` is a color.
function rewriteStrokeProps(content: string, locals: string[]): string {
  let next = content;

  for (const local of locals) {
    next = next.replace(
      new RegExp(`(<${local}\\b[^>]*?\\s)stroke=`, "g"),
      "$1strokeWidth=",
    );
  }

  return next;
}

/** Rewrite tabler icon imports to aliased lucide imports, keeping bindings. */
export function rewriteIconImports(content: string): string {
  const locals: string[] = [];

  const rewritten = content.replace(TABLER_IMPORT, (_match, clause: string) => {
    const bindings = clause
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    const mapped = bindings.map((binding) => {
      const [source, alias] = binding.split(/\s+as\s+/);
      const local = alias ?? source;
      const target = lucideTarget(source);

      if (!target) {
        throw new ValidationError(
          `No lucide-react mapping for tabler icon "${source}".`,
          'Keep iconLibrary: "tabler", or extend TABLER_TO_LUCIDE in the CLI.',
        );
      }

      locals.push(local);

      return `${target} as ${local}`;
    });

    return `import { ${mapped.join(", ")} } from "lucide-react";`;
  });

  return rewriteStrokeProps(injectFilledProps(rewritten), locals);
}

function collectSourceFiles(dir: string, out: string[]): void {
  let entries;

  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist"
    ) {
      continue;
    }

    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      collectSourceFiles(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

/**
 * Convert every tabler-importing source file under cwd to lucide.
 * Returns the rewritten paths relative to cwd.
 */
export function rewriteIconSources(cwd: string): string[] {
  const files: string[] = [];

  collectSourceFiles(cwd, files);

  const rewritten: string[] = [];

  for (const file of files) {
    const content = readFileSync(file, "utf-8");

    if (!content.includes("@tabler/icons-react")) continue;

    const next = rewriteIconImports(content);

    if (next !== content) {
      writeFileSync(file, next, "utf-8");
      rewritten.push(relative(cwd, file));
    }
  }

  return rewritten;
}

function hasLucideImports(cwd: string): boolean {
  const files: string[] = [];

  collectSourceFiles(cwd, files);

  return files.some((file) =>
    readFileSync(file, "utf-8").includes('from "lucide-react"'),
  );
}

export interface ApplyIconOptions {
  yes?: boolean;
  installer?: DepInstaller;
}

/** Validate an icon-library choice, defaulting to the kit's tabler. */
export function resolveIconLibrary(value?: string): string {
  const iconLibrary = value ?? "tabler";

  if (iconLibrary !== "tabler" && iconLibrary !== "lucide") {
    throw new ValidationError(
      `Unknown icon library "${iconLibrary}".`,
      "Valid options: tabler, lucide.",
    );
  }

  return iconLibrary;
}

async function applyLucide(
  cwd: string,
  options: ApplyIconOptions,
): Promise<void> {
  const pkg = readConsumerPackage(cwd);

  const present = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);

  if (!present.has("lucide-react")) {
    await installNpmDeps(
      cwd,
      ["lucide-react"],
      { yes: options.yes },
      options.installer,
    );
  }

  const rewritten = rewriteIconSources(cwd);

  if (rewritten.length > 0) {
    success(`Rewrote ${rewritten.length} source file(s) to lucide-react.`);
  }

  if (pkg.dependencies?.["@tabler/icons-react"]) {
    info(
      "@tabler/icons-react is no longer imported — you can remove it from package.json.",
    );
  }
}

/** Record the icon library, install its package, and convert sources to it. */
export async function applyIconLibrary(
  cwd: string,
  iconLibrary: string,
  options: ApplyIconOptions = {},
): Promise<void> {
  updateRawConfig(cwd, { iconLibrary });

  if (iconLibrary === "lucide") {
    await applyLucide(cwd, options);

    return;
  }

  if (hasLucideImports(cwd)) {
    info(
      "Run 'kira-kit add --all --overwrite' to reinstall components with tabler icons.",
    );
  }
}
