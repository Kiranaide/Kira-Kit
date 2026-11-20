import { Link } from "@tanstack/react-router";
import { IconArrowRight } from "@tabler/icons-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ComponentPage, PageHeader, Section } from "@/components/docs";

const wiringCode = `import { createRouter } from "@tanstack/react-router"

export const router = createRouter({
  routeTree,
  // Preload lazy route chunks on hover/touch intent so most navigations
  // commit before the progress bar's grace period ends.
  defaultPreload: "intent",
  // Native crossfade for real path changes only; search/hash updates stay
  // instant. Browsers without the View Transitions API navigate normally.
  defaultViewTransition: {
    types: ({ pathChanged }) => (pathChanged ? ["route-change"] : false),
  },
})`;

const shellCode = `import { Outlet, useLocation, useRouterState } from "@tanstack/react-router"
import { RouteTransition, NavigationProgress } from "@/components/ui/route-transition"
import { supportsViewTransitions } from "@/lib/view-transition"

function RouteOutlet() {
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <RouteTransition
      transitionKey={pathname}
      // One entrance mechanism per browser: the native crossfade where the
      // View Transitions API exists, the CSS fade everywhere else. Never
      // both — stacking them reads as a double blink.
      variant={supportsViewTransitions() ? "none" : "fade"}
    >
      <Outlet />
    </RouteTransition>
  )
}

function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  return <NavigationProgress active={isLoading} />
}

export function AppShell() {
  return (
    <>
      <main>
        <RouteOutlet />
      </main>
      <RouteProgress />
    </>
  )
}`;

const variantCode = `import { RouteTransition } from "@/components/ui/route-transition"

// Directional navigation: forward moves content left, back moves it right.
<RouteTransition transitionKey={pathname} variant="slide-left">
  <Outlet />
</RouteTransition>

// Drilling into a detail view: a gentle focus-in.
<RouteTransition transitionKey={id} variant="zoom">
  <DetailView />
</RouteTransition>

// High-frequency surfaces (filters, tabs, command results): no entrance.
<RouteTransition transitionKey={query} variant="none">
  <Results />
</RouteTransition>`;

const helperCode = `import { startViewTransition } from "@/lib/view-transition"

// Crossfade any DOM update — layout swaps, theme changes, list reorders.
// Reduced motion or unsupported browsers apply the update instantly.
startViewTransition(() => {
  setView((current) => (current === "grid" ? "list" : "grid"))
})`;

const variantRows = [
  {
    variant: "fade",
    motion: "Opacity 0 → 1",
    duration: "150ms",
    use: "The default. Everyday navigation where content simply replaces content.",
  },
  {
    variant: "fade-up",
    motion: "Opacity + 8px spring rise",
    duration: "250ms",
    use: "Moving forward or deeper: overview → detail, list → item.",
  },
  {
    variant: "fade-down",
    motion: "Opacity + 8px spring drop",
    duration: "250ms",
    use: "Moving back or up: detail → overview, returning to a parent.",
  },
  {
    variant: "slide-left",
    motion: "Opacity + 24px spring from the right",
    duration: "250ms",
    use: "Directional sibling navigation (next page, next step). Content travels left, matching forward motion.",
  },
  {
    variant: "slide-right",
    motion: "Opacity + 24px spring from the left",
    duration: "250ms",
    use: "The reverse direction (previous page, back). Pair with slide-left so direction reads consistently.",
  },
  {
    variant: "zoom",
    motion: "Opacity + spring scale 0.96 → 1",
    duration: "250ms",
    use: "Focusing into a single object: detail views, previews, spotlights. Never scale from 0.",
  },
  {
    variant: "none",
    motion: "—",
    duration: "—",
    use: "High-frequency surfaces, keyboard-driven switches, or apps where the native crossfade already owns the entrance.",
  },
];

function MechanismOverview() {
  return (
    <Section
      title="How route motion works"
      description="Three layers cooperate, and each one owns a distinct moment of the navigation."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">1 · Native crossfade</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Where the View Transitions API exists, the router wraps path changes
            in document.startViewTransition. The kit tunes the root crossfade to
            150ms with a strong ease-out. Search and hash updates skip it and
            stay instant.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              2 · CSS entrance fallback
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browsers without the API get a keyed RouteTransition entrance
            instead. Pick one mechanism per browser — running the fade on top of
            the crossfade (or restarting it when the crossfade ends) reads as a
            double blink.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              3 · Progress while loading
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            NavigationProgress covers the wait itself: a 2px top bar that
            appears only for loads outliving a 120ms grace period, trickles
            toward 90%, then completes and fades out when the route commits.
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function VariantGuide() {
  return (
    <Section
      title="Choosing a variant"
      description="Route content is read dozens of times a day, so every entrance settles within 250ms and hints direction rather than performing it. Movement variants ride a gentle spring (~7% overshoot) so arrivals feel alive; plain fade stays ease-out. Match the motion to what the navigation means."
    >
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Variant</th>
                  <th className="py-2 text-left font-medium">Motion</th>
                  <th className="py-2 text-left font-medium">Duration</th>
                  <th className="py-2 text-left font-medium">When to use</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variantRows.map((row) => (
                  <tr key={row.variant}>
                    <td className="py-2 font-mono text-xs">{row.variant}</td>
                    <td className="py-2 text-muted-foreground">{row.motion}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">
                      {row.duration}
                    </td>
                    <td className="py-2 text-muted-foreground">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <CodeBlock code={variantCode} language="tsx" />
    </Section>
  );
}

function WiringGuide() {
  return (
    <Section
      title="Wiring it into a TanStack Router app"
      description="Router options first, then the shell. This is exactly how the docs app you are reading is wired."
    >
      <CodeBlock code={wiringCode} language="tsx" />
      <CodeBlock code={shellCode} language="tsx" />
    </Section>
  );
}

const installCode = `kira-kit add route-transition`;

function InstallGuide() {
  return (
    <Section
      title="Installing with the CLI"
      description="The registry item carries its own motion CSS. Adding it merges the spring token, entrance keyframes, and view-transition tuning into your global stylesheet — idempotently, so re-adding or updating never duplicates rules."
    >
      <CodeBlock code={installCode} language="bash" />
    </Section>
  );
}

function HelperGuide() {
  return (
    <Section
      title="Crossfading arbitrary updates"
      description="The View Transitions API is not limited to routes. The lib helper wraps any DOM update with support and reduced-motion guards."
    >
      <CodeBlock code={helperCode} language="tsx" />
    </Section>
  );
}

function Guarantees() {
  return (
    <Section
      title="Accessibility and performance"
      description="The guarantees every variant ships with."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Built-in guarantees</CardTitle>
          <CardDescription>
            No configuration needed — these hold for every variant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Reduced motion:
              </span>{" "}
              the kit-wide prefers-reduced-motion gate flattens every entrance
              and the trickle to an instant state change, and
              startViewTransition skips the API entirely.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Composite-only:
              </span>{" "}
              every animation is transform/opacity — no layout or paint work per
              frame.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Smooth under load:
              </span>{" "}
              the progress trickle is a CSS keyframe, so it runs off the main
              thread exactly while route chunks load and parse.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Interruptible:
              </span>{" "}
              rapid navigations retarget the bar from its current value and
              replay entrances from a stable key; nothing queues.
            </li>
            <li>
              <span className="font-medium text-foreground">
                No flash on fast loads:
              </span>{" "}
              the 120ms grace period means preloaded routes never show a bar.
            </li>
          </ul>
        </CardContent>
      </Card>
    </Section>
  );
}

export default function TransitionsGuidePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Transitions"
        description="How route-change motion works in Kira Kit: the mechanism hierarchy, the entrance variants and when to use each, the navigation progress bar, and the accessibility and performance guarantees."
      />

      <MechanismOverview />
      <VariantGuide />
      <InstallGuide />
      <WiringGuide />
      <HelperGuide />
      <Guarantees />

      <div className="flex items-center gap-3">
        <Link
          to="/components/route-transition"
          className={cn(buttonVariants())}
        >
          Try the live demos
          <IconArrowRight className="h-4 w-4" />
        </Link>
        <span className="text-sm text-muted-foreground">
          Variant gallery, progress simulation, and the view-transition helper
          on the Route Transition component page.
        </span>
      </div>
    </ComponentPage>
  );
}
