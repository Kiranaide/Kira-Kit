import * as React from "react";
import { useGSAP } from "@gsap/react";
import { Link } from "@tanstack/react-router";
import {
  IconArrowUpRight,
  IconArrowsExchange,
  IconBell,
  IconCheck,
  IconLayersLinked,
  IconLayoutSidebar,
  IconLoader2,
  IconPalette,
  IconPin,
  IconPlayerPlay,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { cn } from "cn";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  NavigationProgress,
  RouteTransition,
} from "@/components/ui/route-transition";
import { ThemeToggle, useTheme } from "@/components/ui/theme-provider";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DocCallout,
  DocChecklist,
  DocSteps,
  pickedValue,
} from "@/components/docs/doc-page";
import {
  fullStackCode,
  moduleMeta,
  moduleSegments,
  providerStackLayers,
  routerAdapterMeta,
  routerAdapters,
  routeTransitionChecklist,
  routeTransitionRouterMeta,
  routeTransitionRouters,
  routeTransitionViewTransitionCode,
  sidebarChecklist,
  themeChecklist,
  themeFoucScriptCode,
  themeProviderRootCode,
  themeProviderUsageCode,
  toastChecklist,
  toastOptimisticCode,
  toastRootCode,
  toastUsageCode,
  type ModuleSegment,
  type RouterAdapter,
  type RouteTransitionRouter,
} from "@/components/docs/segmented-installation-data";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(useGSAP);

const packageManagers = ["npm", "bun", "pnpm", "yarn"] as const;

type PackageManager = (typeof packageManagers)[number];

const runnerMap: Record<PackageManager, string> = {
  npm: "npx",
  bun: "bunx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};

const segmentIcons: Record<ModuleSegment, React.ReactNode> = {
  "theme-provider": <IconPalette className="size-4 shrink-0" aria-hidden />,
  sidebar: <IconLayoutSidebar className="size-4 shrink-0" aria-hidden />,
  toast: <IconBell className="size-4 shrink-0" aria-hidden />,
  "route-transition": (
    <IconArrowsExchange className="size-4 shrink-0" aria-hidden />
  ),
  "full-stack": <IconLayersLinked className="size-4 shrink-0" aria-hidden />,
};

const segmentRoutes: Partial<Record<ModuleSegment, string>> = {
  "theme-provider": "/components/theme-provider",
  sidebar: "/components/sidebar",
  toast: "/components/toast",
  "route-transition": "/components/route-transition",
};

function CliCommand({ command, cli }: { command: string; cli: string }) {
  return (
    <CodeBlock
      code={command.replace("{runner}", cli)}
      language="bash"
      copyFormat="shell"
      showLineNumbers
    />
  );
}

function InlinePackageManagerPicker({
  pm,
  onPmChange,
}: {
  pm: PackageManager;
  onPmChange: (next: PackageManager) => void;
}) {
  return (
    <ToggleGroup
      aria-label="Package manager"
      variant="segment"
      radius="pill"
      size="sm"
      slidingIndicator
      semantics="current"
      value={[pm]}
      onValueChange={(next) => {
        const picked = pickedValue(next, packageManagers);

        if (picked) onPmChange(picked);
      }}
    >
      {packageManagers.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function ThemeLivePreview() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-fit">
          <ThemeToggle variant="outline" size="sm" />
        </div>
        <output className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-mono text-foreground">
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full transition-colors duration-200",
                theme === "dark" ? "bg-primary" : "bg-warning",
              )}
            />
            html.{theme}
          </span>
          <span className="font-mono">
            localStorage[&quot;kira-theme&quot;]
          </span>
        </output>
      </div>
      <span className="text-xs text-muted-foreground">
        Live preview · toggles this page
      </span>
    </div>
  );
}

function ThemeProviderPanel({ cli }: { cli: string }) {
  const [showFouc, setShowFouc] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <DocSteps
        steps={[
          {
            number: 1,
            title: "Add theme-provider",
            description:
              "Installs ThemeProvider, useTheme, and ThemeToggle as a standalone module.",
            children: (
              <CliCommand
                command={moduleMeta["theme-provider"].command}
                cli={cli}
              />
            ),
          },
          {
            number: 2,
            title: "Wrap your app root",
            description:
              "Place ThemeProvider above routes so every screen (including auth and landing pages) shares the active theme.",
            children: (
              <div className="flex flex-col gap-3">
                <CodeBlock
                  code={themeProviderRootCode}
                  language="tsx"
                  showLineNumbers
                />
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/25 px-3.5 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    Need zero flash on first paint (SSR / static HTML)?
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFouc((open) => !open)}
                    aria-expanded={showFouc}
                  >
                    {showFouc ? "Hide <head> script" : "Show <head> script"}
                  </Button>
                </div>
                {showFouc && (
                  <CodeBlock
                    code={themeFoucScriptCode}
                    language="html"
                    showLineNumbers={false}
                  />
                )}
              </div>
            ),
          },
          {
            number: 3,
            title: "Drop in ThemeToggle or read useTheme()",
            description:
              "Try the live toggle below — it drives the real ThemeProvider wrapping this docs site.",
            children: (
              <div className="flex flex-col gap-3">
                <ThemeLivePreview />
                <CodeBlock
                  code={themeProviderUsageCode}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            ),
          },
        ]}
      />
      <DocChecklist items={[...themeChecklist]} />
    </div>
  );
}

function SidebarPanel({ cli }: { cli: string }) {
  const [adapter, setAdapter] = React.useState<RouterAdapter>("tanstack");
  const codeWrapRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !codeWrapRef.current) return;

      gsap.fromTo(
        codeWrapRef.current,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    },
    { dependencies: [adapter], scope: codeWrapRef },
  );

  const activeAdapter = routerAdapterMeta[adapter];

  return (
    <div className="flex flex-col gap-6">
      <DocSteps
        steps={[
          {
            number: 1,
            title: "Add sidebar",
            description:
              "Copies the responsive navigation shell without pulling in any router package.",
            children: (
              <CliCommand command={moduleMeta.sidebar.command} cli={cli} />
            ),
          },
          {
            number: 2,
            title: "Pick your router adapter",
            description:
              "Sidebar defaults to native <a> links. Choose your router to wire SidebarRouterProvider once at the shell.",
            children: (
              <div className="flex flex-col gap-3">
                <ToggleGroup
                  aria-label="Router adapter"
                  variant="segment"
                  radius="pill"
                  size="sm"
                  slidingIndicator
                  semantics="current"
                  value={[adapter]}
                  onValueChange={(next) => {
                    const picked = pickedValue(next, routerAdapters);

                    if (picked) setAdapter(picked);
                  }}
                >
                  {routerAdapters.map((key) => (
                    <ToggleGroupItem key={key} value={key}>
                      {routerAdapterMeta[key].label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>

                <div ref={codeWrapRef} className="flex flex-col gap-3">
                  <p className="text-xs leading-5 text-muted-foreground">
                    {activeAdapter.summary}
                  </p>
                  <CodeBlock
                    code={activeAdapter.code}
                    language="tsx"
                    showLineNumbers
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
      <DocChecklist items={[...sidebarChecklist]} />
    </div>
  );
}

function runPromiseToast() {
  const task = new Promise<void>((resolve) => {
    window.setTimeout(resolve, 900);
  });

  toast.promise(task, {
    loading: "Syncing workspace preferences…",
    success: "Workspace synced",
    error: "Sync failed",
  });
}

function ToastLivePlayground() {
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/35 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">
          Live Toast Playground
        </span>
        <span className="text-xs text-muted-foreground">
          Triggers real Base UI stacked &amp; anchored toasts
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            toast.success("Changes saved", {
              description: "Synced across all active sessions.",
            })
          }
        >
          <IconCheck className="size-3.5 text-success" aria-hidden />
          Success
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            toast.error("Couldn't save changes", {
              description: "Optimistic update was reverted.",
            })
          }
        >
          <IconX className="size-3.5 text-destructive" aria-hidden />
          Error
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={runPromiseToast}
        >
          <IconLoader2 className="size-3.5" aria-hidden />
          Promise
        </Button>
        <Button
          ref={anchorRef}
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            toast.info("Pinned to this button", {
              position: { anchor: anchorRef.current, side: "top" },
            })
          }
        >
          <IconPin className="size-3.5 text-primary" aria-hidden />
          Anchored
        </Button>
      </div>
    </div>
  );
}

function ToastPanel({ cli }: { cli: string }) {
  return (
    <div className="flex flex-col gap-6">
      <DocSteps
        steps={[
          {
            number: 1,
            title: "Add toast",
            description:
              "Installs KiraToastProvider, toast, and Base UI Toast primitives (no Sonner required).",
            children: (
              <CliCommand command={moduleMeta.toast.command} cli={cli} />
            ),
          },
          {
            number: 2,
            title: "Mount KiraToastProvider once at root",
            description:
              "Renders both the stacked bottom-right deck and the anchored toast portal.",
            children: (
              <CodeBlock code={toastRootCode} language="tsx" showLineNumbers />
            ),
          },
          {
            number: 3,
            title: "Connect optimistic rollbacks (recommended)",
            description:
              "Wrap your root with OptimisticFeedbackProvider so failed async commits on KiraButton, CheckboxCard, Switch, Toggle, and ToggleGroup surface automatically.",
            children: (
              <CodeBlock
                code={toastOptimisticCode}
                language="tsx"
                showLineNumbers
              />
            ),
          },
          {
            number: 4,
            title: "Trigger from anywhere",
            description:
              "Test the live playground below or copy the imperative API.",
            children: (
              <div className="flex flex-col gap-3">
                <ToastLivePlayground />
                <CodeBlock
                  code={toastUsageCode}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            ),
          },
        ]}
      />
      <DocChecklist items={[...toastChecklist]} />
    </div>
  );
}

function RouteTransitionLivePreview() {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const triggerLoad = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep((current) => current + 1);
    }, 650);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/35 p-4">
      <NavigationProgress active={loading} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">
          Live Route Transition Preview
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep((current) => current + 1)}
          >
            <IconPlayerPlay className="size-3.5" aria-hidden />
            Replay entrance
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={triggerLoad}
          >
            <IconLoader2
              className={cn("size-3.5", loading && "motion-safe:animate-spin")}
              aria-hidden
            />
            {loading ? "Loading…" : "Simulate slow route"}
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <RouteTransition
          transitionKey={step}
          variant="fade-up"
          className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs"
        >
          <span className="font-mono text-foreground">
            /workspace/view-{step + 1}
          </span>
          <span className="text-muted-foreground">
            variant=&quot;fade-up&quot; · 250ms
          </span>
        </RouteTransition>
      </div>
    </div>
  );
}

function RouteTransitionRouterPicker() {
  const [router, setRouter] = React.useState<RouteTransitionRouter>("tanstack");
  const codeWrapRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !codeWrapRef.current) return;

      gsap.fromTo(
        codeWrapRef.current,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    },
    { dependencies: [router], scope: codeWrapRef },
  );

  const activeRouter = routeTransitionRouterMeta[router];

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        aria-label="Route transition router"
        variant="segment"
        radius="pill"
        size="sm"
        slidingIndicator
        semantics="current"
        value={[router]}
        onValueChange={(next) => {
          const picked = pickedValue(next, routeTransitionRouters);

          if (picked) setRouter(picked);
        }}
      >
        {routeTransitionRouters.map((key) => (
          <ToggleGroupItem key={key} value={key}>
            {routeTransitionRouterMeta[key].label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div ref={codeWrapRef} className="flex flex-col gap-3">
        <p className="text-xs leading-5 text-muted-foreground">
          {activeRouter.summary}
        </p>
        <CodeBlock code={activeRouter.code} language="tsx" showLineNumbers />
      </div>
    </div>
  );
}

function RouteTransitionPanel({ cli }: { cli: string }) {
  return (
    <div className="flex flex-col gap-6">
      <DocSteps
        steps={[
          {
            number: 1,
            title: "Add route-transition",
            description:
              "Installs RouteTransition, NavigationProgress, and the reduced-motion-aware view-transition helper.",
            children: (
              <CliCommand
                command={moduleMeta["route-transition"].command}
                cli={cli}
              />
            ),
          },
          {
            number: 2,
            title: "Wire your router pathname & loading state",
            description:
              "Key RouteTransition by pathname inside your shell outlet and pass your router's loading flag to NavigationProgress.",
            children: <RouteTransitionRouterPicker />,
          },
          {
            number: 3,
            title: "Test live & crossfade local UI swaps",
            description:
              "Try the top progress bar and keyed entrance below, or call startViewTransition() for in-page view switches.",
            children: (
              <div className="flex flex-col gap-3">
                <RouteTransitionLivePreview />
                <CodeBlock
                  code={routeTransitionViewTransitionCode}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            ),
          },
        ]}
      />
      <DocChecklist items={[...routeTransitionChecklist]} />
    </div>
  );
}

function ProviderArchitectureStack() {
  const [focused, setFocused] = React.useState<string>(
    providerStackLayers[0].name,
  );

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/25 p-4">
      <div className="flex items-center justify-between gap-2 pb-1">
        <span className="text-xs font-medium text-foreground">
          Recommended nesting order
        </span>
        <span className="text-xs text-muted-foreground">
          Outer root → Inner shell
        </span>
      </div>
      <ol className="flex flex-col gap-1.5">
        {providerStackLayers.map((item, index) => {
          const isActive = focused === item.name;

          return (
            <li key={item.name}>
              <button
                type="button"
                onMouseEnter={() => setFocused(item.name)}
                onFocus={() => setFocused(item.name)}
                onClick={() => setFocused(item.name)}
                style={{
                  marginLeft: `${index * 8}px`,
                  width: `calc(100% - ${index * 8}px)`,
                }}
                className={cn(
                  "flex flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between",
                  isActive
                    ? "border-primary/50 bg-primary/8 text-foreground"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground">
                  <span className="inline-flex size-4 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">
                    {index + 1}
                  </span>
                  {item.name}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {item.layer}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <output className="mt-1 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
        <strong className="font-mono text-foreground">{focused}:</strong>{" "}
        {providerStackLayers.find((layer) => layer.name === focused)?.role}
      </output>
    </div>
  );
}

function FullStackPanel({ cli }: { cli: string }) {
  return (
    <div className="flex flex-col gap-6">
      <DocSteps
        steps={[
          {
            number: 1,
            title: "Install all four modules in one command",
            description:
              "Adds theme-provider, sidebar, toast, and route-transition along with their shared hooks.",
            children: (
              <CliCommand
                command={moduleMeta["full-stack"].command}
                cli={cli}
              />
            ),
          },
          {
            number: 2,
            title: "Compose RootProviders and AppShell",
            description:
              "Keep ThemeProvider and KiraToastProvider at your root route, and mount Sidebar, NavigationProgress, and RouteTransition inside your app shell.",
            children: (
              <div className="flex flex-col gap-4">
                <ProviderArchitectureStack />
                <CodeBlock
                  code={fullStackCode}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            ),
          },
        ]}
      />
      <DocCallout title="Why split RootProviders and AppShell?">
        Keeping ThemeProvider, OptimisticFeedbackProvider, and KiraToastProvider
        on the root route ensures marketing, login, and error pages still get
        theming and notifications without loading Sidebar chrome or shell route
        transitions.
      </DocCallout>
    </div>
  );
}

function StandaloneInstallationCard({
  moduleId,
  title,
  children,
}: {
  moduleId: ModuleSegment;
  title: string;
  children: (cli: string) => React.ReactNode;
}) {
  const [pm, setPm] = React.useState<PackageManager>("npm");
  const meta = moduleMeta[moduleId];

  return (
    <section
      aria-label={title}
      className="flex flex-col gap-4"
      data-slot="module-installation-section"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {meta.tagline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            icon={<IconSparkles className="size-3" aria-hidden />}
            className="font-mono text-[11px]"
          >
            {meta.depsLabel}
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {meta.scope}
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden border-border/80">
        <CardContent className="flex flex-col gap-6 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
            <span className="text-xs font-medium text-muted-foreground">
              Package manager
            </span>
            <InlinePackageManagerPicker pm={pm} onPmChange={setPm} />
          </div>
          {children(runnerMap[pm])}
        </CardContent>
      </Card>
    </section>
  );
}

export function ThemeProviderInstallationCard() {
  return (
    <StandaloneInstallationCard
      moduleId="theme-provider"
      title="Installation & root setup"
    >
      {(cli) => <ThemeProviderPanel cli={cli} />}
    </StandaloneInstallationCard>
  );
}

export function SidebarInstallationCard() {
  return (
    <StandaloneInstallationCard
      moduleId="sidebar"
      title="Installation & router setup"
    >
      {(cli) => <SidebarPanel cli={cli} />}
    </StandaloneInstallationCard>
  );
}

export function ToastInstallationCard() {
  return (
    <StandaloneInstallationCard
      moduleId="toast"
      title="Installation & optimistic wiring"
    >
      {(cli) => <ToastPanel cli={cli} />}
    </StandaloneInstallationCard>
  );
}

export function RouteTransitionInstallationCard() {
  return (
    <StandaloneInstallationCard
      moduleId="route-transition"
      title="Installation & router wiring"
    >
      {(cli) => <RouteTransitionPanel cli={cli} />}
    </StandaloneInstallationCard>
  );
}

function SegmentHeaderBar({
  segment,
  onSegmentChange,
}: {
  segment: ModuleSegment;
  onSegmentChange: (next: ModuleSegment) => void;
}) {
  const meta = moduleMeta[segment];
  const componentRoute = segmentRoutes[segment];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          aria-label="Installation module"
          variant="segment"
          radius="pill"
          size="sm"
          slidingIndicator
          semantics="current"
          value={[segment]}
          onValueChange={(next) => {
            const picked = pickedValue(next, moduleSegments);

            if (picked) onSegmentChange(picked);
          }}
        >
          {moduleSegments.map((key) => (
            <ToggleGroupItem key={key} value={key} className="gap-1.5">
              {segmentIcons[key]}
              <span className="hidden sm:inline">{moduleMeta[key].label}</span>
              <span className="sm:hidden">{moduleMeta[key].shortLabel}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            icon={<IconSparkles className="size-3" aria-hidden />}
            className="font-mono text-[11px]"
          >
            {meta.depsLabel}
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {meta.scope}
          </Badge>
          {componentRoute && (
            <Link
              to={componentRoute}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Open demo
              <IconArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        {meta.tagline}
      </p>
    </div>
  );
}

export function SegmentedInstallationGuide({ cli }: { cli: string }) {
  const [segment, setSegment] = React.useState<ModuleSegment>("theme-provider");
  const panelRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !panelRef.current) return;

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    },
    { dependencies: [segment], scope: panelRef },
  );

  return (
    <Card className="overflow-hidden border-border/80">
      <CardContent className="flex flex-col gap-6 pt-6">
        <SegmentHeaderBar segment={segment} onSegmentChange={setSegment} />

        <div ref={panelRef} data-slot="installation-segment-panel">
          {segment === "theme-provider" && <ThemeProviderPanel cli={cli} />}
          {segment === "sidebar" && <SidebarPanel cli={cli} />}
          {segment === "toast" && <ToastPanel cli={cli} />}
          {segment === "route-transition" && <RouteTransitionPanel cli={cli} />}
          {segment === "full-stack" && <FullStackPanel cli={cli} />}
        </div>
      </CardContent>
    </Card>
  );
}
