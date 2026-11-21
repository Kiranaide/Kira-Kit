import * as React from "react";
import { Link } from "@tanstack/react-router";
import { IconArrowNarrowRight, IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { RouteTransition } from "@/components/ui/route-transition";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Code,
  DocChecklist,
  DocPage,
  DocSection,
  DocTable,
  pickedValue,
} from "@/components/docs/doc-page";

type VariantName = NonNullable<
  React.ComponentProps<typeof RouteTransition>["variant"]
>;

const variants: readonly {
  name: VariantName;
  duration: string;
  use: string;
}[] = [
  {
    name: "fade",
    duration: "150 ms",
    use: "Content replaces content without a directional relationship.",
  },
  {
    name: "fade-up",
    duration: "250 ms",
    use: "Move one level deeper, such as from an overview to a detail page.",
  },
  {
    name: "fade-down",
    duration: "250 ms",
    use: "Return to a parent or overview.",
  },
  {
    name: "slide-left",
    duration: "250 ms",
    use: "Move forward between steps or sibling views.",
  },
  {
    name: "slide-right",
    duration: "250 ms",
    use: "Go back between steps or sibling views.",
  },
  {
    name: "zoom",
    duration: "250 ms",
    use: "Focus on a single item or preview.",
  },
  {
    name: "none",
    duration: "—",
    use: "Use for filters, keyboard-driven tabs, and native crossfade.",
  },
];

const variantNames = variants.map((entry) => entry.name);

const motionModels = [
  {
    title: "Native crossfade",
    description: "Use the browser transition on real pathname changes.",
  },
  {
    title: "Keyed fallback",
    description:
      "Use RouteTransition’s fade when native transitions are unavailable.",
  },
  {
    title: "Loading indicator",
    description:
      "NavigationProgress appears after a short delay on slow routes.",
  },
];

const wireUpCode = `import { Outlet, useRouterState } from "@tanstack/react-router";
import { RouteTransition } from "@/components/ui/route-transition";
import { supportsViewTransitions } from "@/lib/view-transition";

export function RouteOutlet() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <RouteTransition
      transitionKey={pathname}
      variant={supportsViewTransitions() ? "none" : "fade"}
    >
      <Outlet />
    </RouteTransition>
  );
}`;

const stateChangeCode = `import { startViewTransition } from "@/lib/view-transition";

startViewTransition(() => {
  setView("grid");
});`;

function DemoPanel({
  label,
  view,
  variant,
  transitionKey,
  active,
}: {
  label: string;
  view: "overview" | "details";
  variant?: VariantName;
  transitionKey?: number;
  active: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      {active ? (
        <RouteTransition
          transitionKey={transitionKey}
          variant={variant}
          className="rounded-[10px] border border-border bg-card p-4 text-card-foreground"
        >
          <p className="text-sm font-semibold">
            {view === "overview" ? "Overview" : "Details"}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            {view === "overview"
              ? "A list of records, one row at a time."
              : "One record, opened in place."}
          </p>
        </RouteTransition>
      ) : (
        <div className="rounded-[10px] border border-border bg-card p-4 text-card-foreground">
          <p className="text-sm font-semibold">
            {view === "overview" ? "Overview" : "Details"}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            {view === "overview"
              ? "A list of records, one row at a time."
              : "One record, opened in place."}
          </p>
        </div>
      )}
    </div>
  );
}

function VariantDemo() {
  const [variant, setVariant] = React.useState<VariantName>("slide-left");
  const [view, setView] = React.useState<"overview" | "details">("overview");
  const [tick, setTick] = React.useState(0);

  const duration = variants.find((entry) => entry.name === variant)?.duration;

  const play = (next: "overview" | "details") => {
    setView(next);
    setTick((current) => current + 1);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToggleGroup
            aria-label="Transition variant"
            variant="segment"
            size="sm"
            semantics="current"
            value={[variant]}
            onValueChange={(next) => {
              const picked = pickedValue(next, variantNames);

              if (picked) setVariant(picked);
            }}
          >
            {variants.map((entry) => (
              <ToggleGroupItem key={entry.name} value={entry.name}>
                {entry.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span className="text-[12px] font-semibold docs-accent">
            {duration}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <DemoPanel label="Before" view="overview" active={false} />
          <IconArrowNarrowRight
            aria-hidden="true"
            className="mt-6 hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
          />
          <DemoPanel
            label="After"
            view={view}
            variant={variant}
            transitionKey={tick}
            active
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => play(view === "overview" ? "details" : "overview")}
          >
            <IconPlayerPlay aria-hidden="true" className="h-4 w-4" />
            {view === "overview" ? "Open detail" : "Back to overview"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => play(view)}
            aria-label="Replay the transition"
          >
            Replay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MotionModelsSection() {
  return (
    <DocSection id="how-route-motion-works" title="How route motion works">
      <div className="grid gap-4 sm:grid-cols-3">
        {motionModels.map((model) => (
          <Card key={model.title}>
            <CardContent className="flex flex-col gap-1.5 pt-6">
              <p className="text-[15px] font-semibold text-card-foreground">
                {model.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {model.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DocSection>
  );
}

function VariantSection() {
  return (
    <DocSection
      id="choose-a-variant"
      title="Choose a variant"
      description="Match the motion to the direction and frequency of the interaction."
    >
      <VariantDemo />
      <DocTable
        columns={["Variant", "Use when"]}
        rows={variants.map((entry) => [
          <Code key={entry.name}>
            {entry.name}
            {entry.duration !== "—" && (
              <span className="text-muted-foreground"> · {entry.duration}</span>
            )}
          </Code>,
          entry.use,
        ])}
        caption="Route transition variants"
      />
    </DocSection>
  );
}

function WiringSection() {
  return (
    <DocSection
      id="install-and-wire-up"
      title="Install and wire up"
      description="Key the outlet by pathname in TanStack Router. Apply one entrance mechanism per navigation."
    >
      <CodeBlock
        code="npx kira-kit add route-transition"
        language="bash"
        copyFormat="shell"
        showLineNumbers
      />
      <CodeBlock code={wireUpCode} language="tsx" showLineNumbers />
      <Link
        to="/components/route-transition"
        className="docs-focus-ring w-fit rounded-[6px] text-sm font-semibold docs-accent underline-offset-4 hover:underline"
      >
        See the component example
      </Link>
    </DocSection>
  );
}

export default function TransitionsPage() {
  return (
    <DocPage
      title="Transitions"
      description="Add motion that explains where an interface changed. Keep navigation predictable with a reduced-motion path."
      previous={{ to: "/docs/theming", label: "Theming" }}
      next={{ to: "/docs/cli", label: "CLI" }}
    >
      <MotionModelsSection />
      <VariantSection />
      <WiringSection />
      <DocSection
        id="other-state-changes"
        title="Other state changes"
        description="Use startViewTransition for a layout or theme switch. It applies the update immediately where motion is reduced or unsupported."
      >
        <CodeBlock code={stateChangeCode} language="tsx" showLineNumbers />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <DocChecklist
          items={[
            {
              title: "Honor reduced motion",
              description:
                "Keep navigation and focus behavior intact when transitions are disabled.",
            },
            {
              title: "Animate opacity and transforms",
              description:
                "Keep layouts stable and avoid animating size or position properties.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
