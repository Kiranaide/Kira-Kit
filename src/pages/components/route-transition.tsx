import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  RouteTransition,
  NavigationProgress,
} from "@/components/ui/route-transition";
import {
  startViewTransition,
  supportsViewTransitions,
} from "@/lib/view-transition";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";
import { RouteTransitionInstallationCard } from "@/components/docs/segmented-installation-guide";

const fadeCode = `import { RouteTransition } from "@/components/ui/route-transition"
import { useLocation, Outlet } from "@tanstack/react-router"

export function AppShell() {
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <main>
      {/* Keying by pathname replays the entrance on every route change.
          Search/hash changes keep the same key, so filters never flash. */}
      <RouteTransition transitionKey={pathname} variant="fade">
        <Outlet />
      </RouteTransition>
    </main>
  )
}`;

const galleryCode = `import * as React from "react"
import { RouteTransition } from "@/components/ui/route-transition"
import { Button } from "@/components/ui/button"

const variants = [
  "fade",
  "fade-up",
  "fade-down",
  "slide-left",
  "slide-right",
  "zoom",
] as const

export function VariantGalleryDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setRun((current) => current + 1)}>
        Replay all
      </Button>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => (
          <RouteTransition
            key={variant}
            transitionKey={\`\${variant}-\${run}\`}
            variant={variant}
            className="rounded-lg border border-border p-4"
          >
            {variant}
          </RouteTransition>
        ))}
      </div>
    </div>
  )
}`;

const progressCode = `import { NavigationProgress } from "@/components/ui/route-transition"
import { useRouterState } from "@tanstack/react-router"

export function AppShell() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  return (
    <>
      <main>{/* routes */}</main>
      {/* Fixed 2px bar at the viewport top. Appears only for loads that
          outlive a 120ms grace period, trickles via CSS scaleX while
          chunks load, then completes and fades out. */}
      <NavigationProgress active={isLoading} />
    </>
  )
}`;

const viewTransitionCode = `import { startViewTransition } from "@/lib/view-transition"

function toggleView() {
  // Crossfades the DOM update where the View Transitions API is available.
  // Reduced motion or unsupported browsers run the update instantly.
  startViewTransition(() => {
    setView((current) => (current === "grid" ? "list" : "grid"))
  })
}`;

const stressCode = `import * as React from "react"
import {
  RouteTransition,
  NavigationProgress,
} from "@/components/ui/route-transition"
import { Button } from "@/components/ui/button"

export function StressDemo() {
  const [step, setStep] = React.useState<"long" | "empty">("long")

  return (
    <div className="max-w-xs space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setStep("long")}>
          Long route title
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStep("empty")}>
          Empty state
        </Button>
        <Button size="sm" disabled>
          Disabled navigation
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <RouteTransition
          transitionKey={step}
          variant="fade-up"
          className="p-4"
        >
          {step === "long" ? (
            <p className="break-words text-sm font-medium">
              Enterprise_Workspace_Deployment_Pipeline_Configuration_Overview_v2
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No content.</p>
          )}
        </RouteTransition>
      </div>
      <NavigationProgress active={false} />
    </div>
  )
}`;

const usageCode = `import { createRouter } from "@tanstack/react-router"
import {
  RouteTransition,
  NavigationProgress,
} from "@/components/ui/route-transition"
import { prefersReducedMotion } from "@/hooks/use-reduced-motion"
import { supportsViewTransitionTypes } from "@/lib/view-transition"

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultViewTransition: supportsViewTransitionTypes() && {
    types: ({ pathChanged }) =>
      pathChanged && !prefersReducedMotion() ? ["route-change"] : false,
  },
})

// Pick one entrance mechanism per browser: native crossfade where supported,
// CSS RouteTransition everywhere else — never stack both.
<RouteTransition
  transitionKey={pathname}
  variant={supportsViewTransitionTypes() ? "none" : "fade"}
>
  <Outlet />
</RouteTransition>
<NavigationProgress active={isLoading} />`;

const demoPages = {
  overview: {
    title: "Overview",
    body: "A summary of your workspace activity, recent projects, and quick actions.",
  },
  components: {
    title: "Components",
    body: "Browse the component registry, preview variants, and copy install commands.",
  },
  settings: {
    title: "Settings",
    body: "Manage your profile, theme preferences, and notification defaults.",
  },
} as const;

type DemoPage = keyof typeof demoPages;

type FadeVariant =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "none";

const demoPageOrder: DemoPage[] = ["overview", "components", "settings"];

const fadeVariantOrder: FadeVariant[] = [
  "fade",
  "fade-up",
  "fade-down",
  "slide-left",
  "slide-right",
  "zoom",
  "none",
];

type GalleryVariant = Exclude<FadeVariant, "none">;

const galleryVariantOrder: GalleryVariant[] = [
  "fade",
  "fade-up",
  "fade-down",
  "slide-left",
  "slide-right",
  "zoom",
];

const galleryVariantNotes = {
  fade: "Opacity only · 150ms",
  "fade-up": "8px spring rise · 250ms",
  "fade-down": "8px spring drop · 250ms",
  "slide-left": "Spring from the right · 250ms",
  "slide-right": "Spring from the left · 250ms",
  zoom: "Spring scale 0.96 → 1 · 250ms",
} satisfies Record<GalleryVariant, string>;

function VariantGalleryDemo() {
  const [run, setRun] = React.useState(0);

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setRun((current) => current + 1)}>
        Replay all
      </Button>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {galleryVariantOrder.map((value) => (
          <div
            key={value}
            className="overflow-hidden rounded-lg border border-border"
          >
            <RouteTransition
              transitionKey={`${value}-${run}`}
              variant={value}
              className="space-y-1 p-4"
            >
              <p className="text-sm font-medium">{value}</p>
              <p className="text-xs text-muted-foreground">
                {galleryVariantNotes[value]}
              </p>
            </RouteTransition>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Every variant is transform/opacity only and settles within 250ms.
        Movement variants ride a gentle spring curve. See the Transitions guide
        under Documentation for when to use each.
      </p>
    </div>
  );
}

function RouteFadeDemo() {
  const [page, setPage] = React.useState<DemoPage>("overview");
  const [variant, setVariant] = React.useState<FadeVariant>("fade");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {demoPageOrder.map((key) => (
          <Button
            key={key}
            size="sm"
            variant={page === key ? "default" : "outline"}
            onClick={() => setPage(key)}
          >
            {demoPages[key].title}
          </Button>
        ))}
        <span className="mx-2 h-4 w-px bg-border" aria-hidden="true" />
        {fadeVariantOrder.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={variant === value ? "secondary" : "ghost"}
            onClick={() => setVariant(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <RouteTransition
          transitionKey={page}
          variant={variant}
          className="space-y-2 p-6"
        >
          <h3 className="text-lg font-semibold">{demoPages[page].title}</h3>
          <p className="text-sm text-muted-foreground">
            {demoPages[page].body}
          </p>
        </RouteTransition>
      </div>
      <p className="text-xs text-muted-foreground">
        The entrance is opacity-only at 150ms (fade-up adds an 8px spring rise
        at 250ms) — fast enough for navigation you do dozens of times a day.
        Reduced motion shows content instantly.
      </p>
    </div>
  );
}

function NavigationProgressDemo() {
  const [active, setActive] = React.useState(false);
  const timerRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const simulate = () => {
    window.clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = window.setTimeout(() => setActive(false), 1800);
  };

  return (
    <div className="space-y-3">
      <Button onClick={simulate} disabled={active}>
        {active ? "Navigating…" : "Simulate navigation"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Watch the top edge of the viewport: a 2px bar trickles toward 90% while
        the load is in flight, then completes to full width and fades out. Loads
        faster than 120ms never show a bar at all.
      </p>
      <NavigationProgress active={active} />
    </div>
  );
}

function ViewTransitionDemo() {
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const supported = supportsViewTransitions();

  const toggle = () => {
    startViewTransition(() =>
      setView((current) => (current === "grid" ? "list" : "grid")),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={toggle}>Toggle layout</Button>
        <span className="text-xs text-muted-foreground">
          {supported
            ? "View Transitions API available — the swap crossfades."
            : "View Transitions API unavailable — the swap is instant."}
        </span>
      </div>
      {view === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {["Alpha", "Beta", "Gamma"].map((name) => (
            <div
              key={name}
              className="rounded-lg border border-border p-4 text-sm font-medium"
            >
              {name}
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {["Alpha", "Beta", "Gamma"].map((name) => (
            <div key={name} className="p-3 text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StressDemo() {
  const [step, setStep] = React.useState<"long" | "empty">("long");

  return (
    <div className="max-w-xs space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={step === "long" ? "default" : "outline"}
          onClick={() => setStep("long")}
        >
          Long route title
        </Button>
        <Button
          size="sm"
          variant={step === "empty" ? "default" : "outline"}
          onClick={() => setStep("empty")}
        >
          Empty state
        </Button>
        <Button size="sm" variant="outline" disabled>
          Disabled navigation
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <RouteTransition
          transitionKey={step}
          variant="fade-up"
          className="space-y-1 p-4"
        >
          {step === "long" ? (
            <>
              <p className="break-words text-sm font-medium">
                Enterprise_Workspace_Deployment_Pipeline_Configuration_Overview_v2
              </p>
              <p className="text-xs text-muted-foreground">
                Long unbroken route headings wrap inside narrow containers
                without clipping the entrance animation.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No route content loaded.
            </p>
          )}
        </RouteTransition>
      </div>
      <NavigationProgress active={false} />
    </div>
  );
}

export default function RouteTransitionPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Route Transition"
        description="Route-change motion utilities: a keyed entrance fade, a 2px top navigation progress bar, and a reduced-motion-aware View Transitions helper. Composite-only, interruptible, and quiet enough for everyday navigation."
        version="v2.0.1"
      />

      <FeatureGrid
        features={routeTransitionPageFeatureGridFeatures}
        description="Composite-only route entrances and progress feedback."
      />

      <DemoTabs defaultValue="fade" tabs={routeTransitionPageDemoTabsTabs} />

      <RouteTransitionInstallationCard />

      <KeyboardShortcuts
        shortcuts={routeTransitionPageShortcuts}
        description="RouteTransition and NavigationProgress are non-interactive wrappers that preserve native keyboard focus order."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="How this docs app combines native view transitions, intent preloading, the entrance fade, and the progress bar."
        notes={[
          {
            label: "Avoid double animations",
            body: "Use native View Transitions where supported and pass variant='none' to RouteTransition so route changes never blink twice.",
          },
          {
            label: "120ms grace period",
            body: "NavigationProgress stays hidden during fast preloaded transitions and only renders when a load outlives 120ms.",
          },
        ]}
      />

      <APIReference
        sections={routeTransitionPageAPIReferenceSections}
        description="Props, return values, and exported variants for route transitions."
      />

      <Changelog
        entries={routeTransitionPageChangelogEntries}
        title="Changelog"
        description="Version history for Route Transition."
      />
    </ComponentPage>
  );
}

const routeTransitionPageFeatureGridFeatures = [
  {
    title: "Native crossfade first",
    description:
      "TanStack Router uses a 150ms crossfade for path changes when transition types are supported and motion is allowed.",
  },
  {
    title: "Composite-only motion",
    description:
      "Every animation is transform/opacity. The progress trickle is a CSS keyframe, so it stays smooth off the main thread while route chunks load and parse.",
  },
  {
    title: "Reduced motion aware",
    description:
      "The kit-wide prefers-reduced-motion gate flattens fades and the trickle; the startViewTransition helper skips the API entirely and applies updates instantly.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const routeTransitionPageDemoTabsTabs = [
  {
    value: "fade",
    label: "Entrance fade",
    demo: (
      <DemoWrapper
        title="RouteTransition"
        description="Switch pages and variants — the wrapper remounts on transitionKey and replays the entrance."
        code={fadeCode}
      >
        <RouteFadeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "gallery",
    label: "Variant gallery",
    demo: (
      <DemoWrapper
        title="All variants"
        description="Replay every entrance side by side and pick the one that fits your navigation."
        code={galleryCode}
      >
        <VariantGalleryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "progress",
    label: "Navigation progress",
    demo: (
      <DemoWrapper
        title="NavigationProgress"
        description="Drive active from useRouterState((s) => s.isLoading) in a real app."
        code={progressCode}
      >
        <NavigationProgressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "view-transition",
    label: "View transition helper",
    demo: (
      <DemoWrapper
        title="startViewTransition"
        description="Wrap any DOM update in a native crossfade with support and reduced-motion guards."
        code={viewTransitionCode}
      >
        <ViewTransitionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long unbroken titles, empty content, and disabled navigation controls inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const routeTransitionPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move focus through route content normally; RouteTransition and NavigationProgress never trap or intercept focus.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate focused links or controls that update transitionKey or invoke startViewTransition.",
  },
  {
    keys: "Reduced Motion",
    description:
      "OS prefers-reduced-motion: reduce flattens CSS entrances and skips document.startViewTransition for instant updates.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const routeTransitionPageAPIReferenceSections = [
  {
    title: "RouteTransition",
    props: [
      {
        prop: "transitionKey",
        type: "React.Key",
        default: "-",
        description:
          "Change it (e.g. to the router pathname) to remount the wrapper and replay the entrance. Stable keys across search/hash changes avoid flashes.",
      },
      {
        prop: "variant",
        type: '"fade" | "fade-up" | "fade-down" | "slide-left" | "slide-right" | "zoom" | "none"',
        default: '"fade"',
        description:
          "fade: 150ms opacity entrance. fade-up / fade-down: 8px spring rise or drop at 250ms. slide-left / slide-right: 24px directional spring travel at 250ms (left enters from the right, for forward navigation). zoom: spring scale 0.96 to 1 at 250ms. none: layout wrapper only.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional classes on the wrapper div.",
      },
    ],
  },
  {
    title: "NavigationProgress",
    props: [
      {
        prop: "active",
        type: "boolean",
        default: "-",
        description:
          "Whether a navigation is in flight. Shows after a 120ms grace period, trickles via CSS scaleX, then completes to full width and fades out over ~320ms.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          "Additional classes on the fixed 2px top progress bar (defaults: inset-x-0 top-0 z-50 bg-primary).",
      },
    ],
  },
  {
    title: "routeTransitionVariants",
    props: [
      {
        prop: "variant",
        type: '"fade" | "fade-up" | "fade-down" | "slide-left" | "slide-right" | "zoom" | "none"',
        default: '"fade"',
        description:
          "Exported CVA helper for applying reduced-motion-gated entrance classes directly.",
      },
    ],
  },
  {
    title: "View Transition helpers",
    props: [
      {
        prop: "update",
        type: "() => void | Promise<void>",
        default: "-",
        description:
          "DOM update to run inside document.startViewTransition. Runs directly when the API is missing or prefers-reduced-motion is set.",
      },
      {
        prop: "returns",
        type: "ViewTransition | undefined",
        default: "-",
        description:
          "The native ViewTransition handle (ready/finished/updateCallbackDone promises), or undefined when the update ran without a transition.",
      },
      {
        prop: "supportsViewTransitions()",
        type: "() => boolean",
        default: "-",
        description:
          "Returns true when document.startViewTransition is available.",
      },
      {
        prop: "supportsViewTransitionTypes()",
        type: "() => boolean",
        default: "-",
        description:
          "Returns true when the browser supports native transitions and their types. The router uses this to decide whether it can gate each navigation.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const routeTransitionPageChangelogEntries = [
  {
    version: "2.0.1",
    date: "26 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Skip native route transitions when motion is reduced",
        description:
          "Updated the router integration to check the current motion preference before starting each native transition.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "RouteTransition + NavigationProgress",
        description:
          "Keyed entrance fade and a fixed 2px top progress bar with a grace delay, CSS trickle, and interruptible completion.",
      },
      {
        type: "added",
        title: "Six entrance variants + gallery",
        description:
          "fade, fade-up, fade-down, slide-left, slide-right, and zoom (plus none), with a replayable gallery demo and a choosing-a-variant guide at /docs/transitions.",
      },
      {
        type: "added",
        title: "startViewTransition helper",
        description:
          "Reduced-motion-aware wrapper around the View Transitions API, shipped as @kira-kit/view-transition.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
