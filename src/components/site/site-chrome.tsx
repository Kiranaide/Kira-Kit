import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  IconAdjustmentsHorizontal,
  IconArrowUpRight,
  IconBrandGithub,
  IconChevronDown,
  IconChevronRight,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { cn } from "cn";
import { useTheme } from "@/components/ui/theme-provider";

const LazyPresetStudioPopover = React.lazy(() =>
  import("@/components/site/theme-customizer").then((module) => ({
    default: module.PresetStudioPopover,
  })),
);

function PresetStudioShell({
  className,
  showLabel = true,
  onActivate,
}: {
  className?: string;
  showLabel?: boolean;
  onActivate?: (openImmediately: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-label="Preset studio: Default"
      data-slot="preset-studio-trigger"
      onClick={() => onActivate?.(true)}
      onPointerEnter={() => onActivate?.(false)}
      onFocus={() => onActivate?.(false)}
      className={cn(
        "docs-focus-ring inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border/80 bg-background/80 px-2.5 text-xs font-medium text-foreground shadow-2xs transition-[background-color,border-color,color] duration-150 ease-out hover:border-border hover:bg-accent lg:h-9 lg:px-3",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-3.5 shrink-0 rounded-full border border-black/15 dark:border-white/20"
        style={{ background: "var(--primary)" }}
      />
      {showLabel ? (
        <span className="max-w-32 truncate">Default</span>
      ) : (
        <span className="sr-only">Default</span>
      )}
      <IconAdjustmentsHorizontal
        aria-hidden="true"
        className="size-3.5 text-muted-foreground"
      />
      <IconChevronDown
        aria-hidden="true"
        className="hidden size-3 text-muted-foreground sm:inline"
      />
    </button>
  );
}

function DeferredPresetStudioPopover({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const [state, setState] = React.useState<"idle" | "preloaded" | "open">(
    "idle",
  );

  if (state === "idle") {
    return (
      <PresetStudioShell
        className={className}
        showLabel={showLabel}
        onActivate={(openImmediately) =>
          setState(openImmediately ? "open" : "preloaded")
        }
      />
    );
  }

  return (
    <React.Suspense
      fallback={
        <PresetStudioShell className={className} showLabel={showLabel} />
      }
    >
      <LazyPresetStudioPopover
        className={className}
        showLabel={showLabel}
        defaultOpen={state === "open"}
      />
    </React.Suspense>
  );
}

export const SITE_REPOSITORY_URL = "https://github.com/Kiranaide/kira-kit";

const navLinks = [
  { to: "/docs/introduction", label: "Documentation" },
  { to: "/components/button", label: "Components" },
  { to: "/docs/theming", label: "Themes" },
] as const;

/** Primary square with the "K" — the same mark the app sidebar uses. */
export function SiteBrand({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Kira Kit home"
      data-slot="site-brand"
      className={cn(
        "docs-focus-ring flex shrink-0 items-center gap-2 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-primary text-[13px] font-bold text-primary-foreground"
      >
        K
      </span>
      <span className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
        Kira Kit
      </span>
    </Link>
  );
}

/**
 * Icon-only light/dark control for the site headers. The sidebar keeps its own
 * labelled `ThemeToggle`; both write to the same `useTheme` store.
 */
export function ThemeModeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      data-slot="theme-mode-toggle"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      onClick={toggleTheme}
      className={cn(
        "docs-focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground lg:h-9 lg:w-9",
        className,
      )}
    >
      {theme === "light" ? (
        <IconMoon aria-hidden="true" className="h-[18px] w-[18px]" />
      ) : (
        <IconSun aria-hidden="true" className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

function GitHubLink({
  iconOnly = false,
  className,
}: {
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <a
      href={SITE_REPOSITORY_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Kira Kit on GitHub"
      data-slot="github-link"
      className={cn(
        "docs-focus-ring inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-[8px] px-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground lg:h-9",
        iconOnly && "w-11 px-0 lg:w-9",
        className,
      )}
    >
      <IconBrandGithub aria-hidden="true" className="h-4 w-4" />
      {!iconOnly && (
        <>
          <span className="hidden lg:inline">GitHub</span>
          <IconArrowUpRight
            aria-hidden="true"
            className="hidden h-3.5 w-3.5 lg:inline"
          />
        </>
      )}
    </a>
  );
}

interface SiteHeaderProps {
  /** Extra nodes parked next to the theme controls (used by the docs bar). */
  after?: React.ReactNode;
  className?: string;
}

/**
 * Sticky marketing header. The desktop nav is a link row; below `lg` the same
 * destinations collapse to a single Docs link plus the theme controls, matching
 * the design's compact mobile bar.
 */
export function SiteHeader({ after, className }: SiteHeaderProps) {
  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center gap-2 px-4 sm:px-8 lg:h-16 lg:px-12">
        <SiteBrand />

        <nav
          aria-label="Main"
          className="ml-6 hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="docs-focus-ring rounded-[8px] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/docs/introduction"
            className="docs-focus-ring inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-[8px] px-2 text-sm font-medium text-foreground transition-colors duration-150 ease-out hover:bg-accent lg:hidden"
          >
            <span className="sm:hidden">Docs</span>
            <span className="hidden sm:inline">Documentation</span>
            <IconArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
          <GitHubLink />
          <DeferredPresetStudioPopover
            showLabel={false}
            className="lg:hidden"
          />
          <DeferredPresetStudioPopover className="hidden lg:inline-flex" />
          {after}
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
}

type SectionCrumb = {
  label: string;
  to: "/components/button" | "/docs/introduction";
};

/** The crumb trail's middle stop, read off the route so no page restates it. */
function sectionCrumb(pathname: string): SectionCrumb | null {
  if (pathname.startsWith("/components")) {
    return { label: "Components", to: "/components/button" };
  }

  if (pathname.startsWith("/docs")) {
    return { label: "Documentation", to: "/docs/introduction" };
  }

  return null;
}

/** One crumb-trail stop: the link, then the separator pointing at what follows. */
function TrailCrumb({
  to,
  label,
  className,
}: {
  to: "/" | SectionCrumb["to"];
  label: string;
  className?: string;
}) {
  return (
    <li className={cn("shrink-0 items-center gap-1.5", className)}>
      <Link
        to={to}
        className="docs-focus-ring rounded-[6px] text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
      >
        {label}
      </Link>
      <IconChevronRight
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      />
    </li>
  );
}

/**
 * Sticky bar over every page inside the app shell: where you are, and the two
 * site-wide controls. Below `sm` the brand crumb is dropped — the shell's own
 * mobile header already carries it — and below `md` the section crumb too.
 */
export function PageTopBar({ crumb }: { crumb: string }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const section = sectionCrumb(pathname);

  return (
    <div
      data-slot="page-top-bar"
      // The shell's <main> is padded by its own 56px on mobile only, so `top-0`
      // lands this bar just under the fixed mobile header and flush at `md` up.
      className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-6 lg:px-10"
    >
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm">
          <TrailCrumb to="/" label="Kira Kit" className="hidden sm:flex" />
          {section && (
            <TrailCrumb
              to={section.to}
              label={section.label}
              className="hidden md:flex"
            />
          )}
          <li
            aria-current="page"
            className="min-w-0 truncate font-medium text-foreground"
          >
            {crumb}
          </li>
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <GitHubLink iconOnly />
        <DeferredPresetStudioPopover showLabel={false} className="lg:hidden" />
        <DeferredPresetStudioPopover className="hidden lg:inline-flex" />
        <ThemeModeToggle />
      </div>
    </div>
  );
}
