export const moduleSegments = [
  "theme-provider",
  "sidebar",
  "toast",
  "route-transition",
  "full-stack",
] as const;

export type ModuleSegment = (typeof moduleSegments)[number];

export const routerAdapters = [
  "native",
  "tanstack",
  "nextjs",
  "react-router",
] as const;

export type RouterAdapter = (typeof routerAdapters)[number];

export const routeTransitionRouters = [
  "tanstack",
  "nextjs",
  "react-router",
] as const;

export type RouteTransitionRouter = (typeof routeTransitionRouters)[number];

export interface ModuleSegmentMeta {
  id: ModuleSegment;
  label: string;
  shortLabel: string;
  tagline: string;
  command: string;
  depsLabel: string;
  scope: string;
}

export const moduleMeta: Record<ModuleSegment, ModuleSegmentMeta> = {
  "theme-provider": {
    id: "theme-provider",
    label: "Theme Provider",
    shortLabel: "Theme",
    tagline:
      "SSR-safe light, dark, and system theme context with live OS tracking, controlled cookie support, pre-paint bootstrap script, and ThemeToggle.",
    command: "{runner} kira-kit add theme-provider",
    depsLabel: "1 UI dep · button",
    scope: "App root",
  },
  sidebar: {
    id: "sidebar",
    label: "Sidebar",
    shortLabel: "Sidebar",
    tagline:
      "Responsive navigation shell with collapsible icon rail, mobile Base UI drawer, keyboard shortcut, and a router-agnostic adapter seam.",
    command: "{runner} kira-kit add sidebar",
    depsLabel: "Zero router lock-in",
    scope: "App shell",
  },
  toast: {
    id: "toast",
    label: "Toast",
    shortLabel: "Toast",
    tagline:
      "Base UI stacked and trigger-anchored notifications with swipe-to-dismiss, promise tracking, and optional optimistic-commit error wiring.",
    command: "{runner} kira-kit add toast",
    depsLabel: "Base UI Toast · 0 Sonner",
    scope: "App root",
  },
  "route-transition": {
    id: "route-transition",
    label: "Route Transition",
    shortLabel: "Routes",
    tagline:
      "Composite-only route entrances, a 120ms-debounced 2px navigation progress bar, and a reduced-motion-aware View Transitions helper.",
    command: "{runner} kira-kit add route-transition",
    depsLabel: "Zero router lock-in",
    scope: "App shell",
  },
  "full-stack": {
    id: "full-stack",
    label: "Full Stack",
    shortLabel: "All 4",
    tagline:
      "Combine ThemeProvider, KiraToastProvider, OptimisticFeedbackProvider, Sidebar, and RouteTransition in the recommended root-to-shell nesting order.",
    command:
      "{runner} kira-kit add theme-provider sidebar toast route-transition",
    depsLabel: "Complete shell",
    scope: "Root + Shell",
  },
};

export const themeProviderRootCode = `import { ThemeProvider } from "@/components/ui/theme-provider";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      // Defaults to "system" (tracks prefers-color-scheme live)
      defaultTheme="system"
      // Set storageKey={null} with value={cookieTheme} + onThemeChange for SSR cookies
      storageKey="kira-theme"
    >
      {children}
    </ThemeProvider>
  );
}`;

export const themeProviderUsageCode = `import { ThemeToggle, useTheme } from "@/components/ui/theme-provider";

export function HeaderActions() {
  const { theme, preference, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Compact icon-only toggle or full-width sidebar button (showLabel={true}) */}
      <ThemeToggle showLabel={false} />
      <button type="button" onClick={() => setTheme("system")}>
        {preference} ({theme})
      </button>
    </div>
  );
}`;

export const themeFoucScriptCode = `import { getThemeBootstrapScript } from "@/components/ui/theme-provider";

// Render inside <head> in SSR frameworks (TanStack Start, Next.js, Remix):
<script
  dangerouslySetInnerHTML={{
    __html: getThemeBootstrapScript({
      // Pass initialTheme={cookieTheme} and storageKey={null} for cookie-backed SSR
      defaultTheme: "system",
      storageKey: "kira-theme",
    }),
  }}
/>`;

export const themeChecklist = [
  {
    title: "Decoupled from Sidebar",
    description:
      "Mount ThemeProvider at the root route so auth, landing, and marketing pages without a sidebar still receive theming.",
  },
  {
    title: "Sandboxed storage safe",
    description:
      "localStorage reads and writes are wrapped in try/catch so embedded iframes or strict privacy modes never throw.",
  },
  {
    title: "Tailwind dark variant ready",
    description:
      "Applies .light or .dark directly to document.documentElement, matching Kira Kit's CSS token cascade.",
  },
] as const;

export const routerAdapterMeta: Record<
  RouterAdapter,
  { label: string; summary: string; code: string }
> = {
  native: {
    label: "Native <a>",
    summary:
      "Zero router setup required. SidebarItem renders a native <a href={to}> and matches window.location.pathname automatically.",
    code: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup label="Workspace">
              <SidebarItem to="/overview">Overview</SidebarItem>
              <SidebarItem to="/settings">Settings</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <SidebarTrigger className="md:hidden" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}`,
  },
  tanstack: {
    label: "TanStack Router",
    summary:
      "Bind TanStack Router's Link and useMatchRoute once at your layout shell — Sidebar itself stays 100% router-agnostic.",
    code: `import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  SidebarProvider,
  SidebarRouterProvider,
  type SidebarLinkProps,
  type SidebarRouterAdapter,
} from "@/components/ui/sidebar";

function TanStackLink({ to, disabled, ...props }: SidebarLinkProps) {
  return <Link {...props} to={to} disabled={disabled} />;
}

function useTanStackActive(to: string) {
  const matchRoute = useMatchRoute();

  return Boolean(matchRoute({ to, fuzzy: false }));
}

const adapter: SidebarRouterAdapter = {
  Link: TanStackLink,
  useIsActive: useTanStackActive,
};

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarRouterProvider adapter={adapter}>
      <SidebarProvider>{children}</SidebarProvider>
    </SidebarRouterProvider>
  );
}`,
  },
  nextjs: {
    label: "Next.js App Router",
    summary:
      "Adapt next/link and usePathname() inside a client shell component for instant App Router prefetching and active highlighting.",
    code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarRouterProvider,
  type SidebarLinkProps,
  type SidebarRouterAdapter,
} from "@/components/ui/sidebar";

function NextLink({ to, disabled, ...props }: SidebarLinkProps) {
  if (disabled) return <span {...props} aria-disabled="true" />;

  return <Link {...props} href={to} />;
}

function useNextActive(to: string) {
  const pathname = usePathname();

  return pathname === to;
}

const adapter: SidebarRouterAdapter = {
  Link: NextLink,
  useIsActive: useNextActive,
};

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarRouterProvider adapter={adapter}>
      <SidebarProvider>{children}</SidebarProvider>
    </SidebarRouterProvider>
  );
}`,
  },
  "react-router": {
    label: "React Router",
    summary:
      "Connect react-router's Link and useMatch() so SidebarItem preserves SPA navigation and exact route matching.",
    code: `import { Link, useMatch } from "react-router";
import {
  SidebarProvider,
  SidebarRouterProvider,
  type SidebarLinkProps,
  type SidebarRouterAdapter,
} from "@/components/ui/sidebar";

function ReactRouterLink({ to, disabled, ...props }: SidebarLinkProps) {
  if (disabled) return <span {...props} aria-disabled="true" />;

  return <Link {...props} to={to} />;
}

function useReactRouterActive(to: string) {
  return Boolean(useMatch({ path: to, end: true }));
}

const adapter: SidebarRouterAdapter = {
  Link: ReactRouterLink,
  useIsActive: useReactRouterActive,
};

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarRouterProvider adapter={adapter}>
      <SidebarProvider>{children}</SidebarProvider>
    </SidebarRouterProvider>
  );
}`,
  },
};

export const sidebarChecklist = [
  {
    title: "Mobile drawer built in",
    description:
      "Below md, SidebarTrigger opens an accessible Base UI drawer with focus management and Escape dismissal.",
  },
  {
    title: "Zero router dependency in source",
    description:
      "Switching routers only touches your adapter — no edits inside src/components/ui/sidebar.tsx.",
  },
  {
    title: "Scoped badge export",
    description:
      "Navigation count pills export sidebarBadgeVariants so they never collide with Badge's badgeVariants.",
  },
] as const;

export const toastRootCode = `import { KiraToastProvider } from "@/components/ui/toast";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mount once at root: renders both the stacked viewport and anchored toaster */}
      <KiraToastProvider />
      {children}
    </>
  );
}`;

export const toastOptimisticCode = `import { KiraToastProvider, toast } from "@/components/ui/toast";
import { OptimisticFeedbackProvider } from "@/hooks/use-optimistic-commit";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <OptimisticFeedbackProvider
      onError={({ title, description }) => {
        toast.error(title, description ? { description } : undefined);
      }}
    >
      <KiraToastProvider />
      {children}
    </OptimisticFeedbackProvider>
  );
}`;

export const toastUsageCode = `import { toast } from "@/components/ui/toast";

// Imperative calls from anywhere — event handlers, mutations, or utilities
toast.success("Changes saved", { description: "Synced across all sessions." });
toast.error("Couldn't save", { description: "Check your connection and retry." });

// Track an async task with automatic loading -> success/error transitions
toast.promise(saveDraft(), {
  loading: "Saving draft…",
  success: "Draft published",
  error: "Failed to publish draft",
});

// Anchor a toast directly beside the triggering button
toast.info("Copied link", { position: { anchor: buttonEl, side: "top" } });`;

export const toastChecklist = [
  {
    title: "Stacked & anchored viewports",
    description:
      "KiraToastProvider mounts both the bottom-right stacked deck and the anchored positioner automatically.",
  },
  {
    title: "Decoupled optimistic rollback",
    description:
      "Wiring OptimisticFeedbackProvider once connects KiraButton, CheckboxCard, Switch, Toggle, and ToggleGroup error rollbacks to toast.error.",
  },
  {
    title: "Reduced-motion & pause aware",
    description:
      "Hovering or focusing pauses the countdown bar; prefers-reduced-motion disables motion and progress animation.",
  },
] as const;

export const routeTransitionRouterMeta: Record<
  RouteTransitionRouter,
  { label: string; summary: string; code: string }
> = {
  tanstack: {
    label: "TanStack Router",
    summary:
      "Key RouteTransition by pathname (ignoring search/hash filter updates), pair with native View Transitions when supported, and bind NavigationProgress to router isLoading.",
    code: `import { Outlet, useRouterState } from "@tanstack/react-router";
import {
  NavigationProgress,
  RouteTransition,
} from "@/components/ui/route-transition";
import { supportsViewTransitionTypes } from "@/lib/view-transition";

export function RouteOutlet() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isLoading = useRouterState({ select: (state) => state.isLoading });

  return (
    <>
      <NavigationProgress active={isLoading} />
      <RouteTransition
        transitionKey={pathname}
        variant={supportsViewTransitionTypes() ? "none" : "fade"}
      >
        <Outlet />
      </RouteTransition>
    </>
  );
}`,
  },
  nextjs: {
    label: "Next.js App Router",
    summary:
      "Wrap route children in a client layout shell keyed by usePathname() so route segment swaps animate cleanly while keeping server components intact.",
    code: `"use client";

import { usePathname } from "next/navigation";
import {
  NavigationProgress,
  RouteTransition,
} from "@/components/ui/route-transition";

export function RouteOutlet({
  children,
  isPending = false,
}: {
  children: React.ReactNode;
  isPending?: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <NavigationProgress active={isPending} />
      <RouteTransition transitionKey={pathname} variant="fade">
        {children}
      </RouteTransition>
    </>
  );
}`,
  },
  "react-router": {
    label: "React Router",
    summary:
      "Bind useLocation().pathname to RouteTransition and useNavigation().state to NavigationProgress so slow loaders surface the 2px top bar automatically.",
    code: `import { Outlet, useLocation, useNavigation } from "react-router";
import {
  NavigationProgress,
  RouteTransition,
} from "@/components/ui/route-transition";

export function RouteOutlet() {
  const { pathname } = useLocation();
  const navigation = useNavigation();

  return (
    <>
      <NavigationProgress active={navigation.state === "loading"} />
      <RouteTransition transitionKey={pathname} variant="fade">
        <Outlet />
      </RouteTransition>
    </>
  );
}`,
  },
};

export const routeTransitionViewTransitionCode = `import { startViewTransition } from "@/lib/view-transition";

// Crossfade in-page layout swaps (e.g. grid <-> list) where supported.
// Falls back to an instant state update under prefers-reduced-motion or older browsers.
function handleToggleView() {
  startViewTransition(() => {
    setView((current) => (current === "grid" ? "list" : "grid"));
  });
}`;

export const routeTransitionChecklist = [
  {
    title: "Never double-animate",
    description:
      "When enabling native View Transitions in your router, pass variant={supportsViewTransitionTypes() ? 'none' : 'fade'} so browsers never blink twice.",
  },
  {
    title: "120ms anti-flash grace period",
    description:
      "NavigationProgress stays invisible during fast preloaded transitions and only mounts when a navigation outlives 120ms.",
  },
  {
    title: "Reduced-motion & composite-only",
    description:
      "All entrance variants animate opacity/transform only, settle within 250ms, and disable automatically under prefers-reduced-motion.",
  },
] as const;

export const fullStackCode = `import { ThemeProvider, ThemeToggle } from "@/components/ui/theme-provider";
import { KiraToastProvider, toast } from "@/components/ui/toast";
import { OptimisticFeedbackProvider } from "@/hooks/use-optimistic-commit";
import {
  NavigationProgress,
  RouteTransition,
} from "@/components/ui/route-transition";
import { supportsViewTransitionTypes } from "@/lib/view-transition";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarRouterProvider,
} from "@/components/ui/sidebar";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <OptimisticFeedbackProvider
        onError={({ title, description }) => {
          toast.error(title, description ? { description } : undefined);
        }}
      >
        <KiraToastProvider />
        {children}
      </OptimisticFeedbackProvider>
    </ThemeProvider>
  );
}

export function AppShell({
  pathname,
  isLoading,
  children,
}: {
  pathname: string;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <SidebarRouterProvider adapter={yourRouterAdapter}>
      <SidebarProvider>
        <NavigationProgress active={isLoading} />
        <div className="flex h-screen overflow-hidden">
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarItem to="/overview">Overview</SidebarItem>
            </SidebarContent>
            <SidebarFooter>
              <ThemeToggle />
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-y-auto">
            <RouteTransition
              transitionKey={pathname}
              variant={supportsViewTransitionTypes() ? "none" : "fade"}
            >
              {children}
            </RouteTransition>
          </main>
        </div>
      </SidebarProvider>
    </SidebarRouterProvider>
  );
}`;

export const providerStackLayers = [
  {
    name: "ThemeProvider",
    layer: "Root · Outer",
    role: "Owns .light / .dark class on <html> and persists kira-theme.",
  },
  {
    name: "OptimisticFeedbackProvider",
    layer: "Root · Feedback Seam",
    role: "Routes rejected optimistic commits from controls to toast.error.",
  },
  {
    name: "KiraToastProvider",
    layer: "Root · Portals",
    role: "Mounts Base UI stacked and anchored toast viewports once.",
  },
  {
    name: "SidebarRouterProvider",
    layer: "Shell · Adapter",
    role: "Optional router seam for TanStack, Next.js, or React Router links.",
  },
  {
    name: "SidebarProvider",
    layer: "Shell · Layout",
    role: "Manages desktop collapse state, mobile drawer, and keyboard toggle.",
  },
  {
    name: "RouteTransition + NavigationProgress",
    layer: "Shell · Outlet",
    role: "Animates pathname changes inside <main> and shows a 2px progress bar on loads over 120ms.",
  },
] as const;
