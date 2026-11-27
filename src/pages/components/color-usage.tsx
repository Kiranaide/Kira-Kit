import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconCheck, IconCopy, IconMoon, IconSun } from "@tabler/icons-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

interface ColorSwatchProps {
  name: string;
  token: string;
  lightValue: string;
  darkValue?: string;
  description?: string;
  disabled?: boolean;
}

function ColorSwatchMeta({
  name,
  token,
  hasDarkValue,
  isDark,
  disabled,
  description,
  onToggleTheme,
}: {
  name: string;
  token: string;
  hasDarkValue: boolean;
  isDark: boolean;
  disabled: boolean;
  description?: string;
  onToggleTheme: () => void;
}) {
  const modeLabel = isDark ? "light" : "dark";

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-foreground">
          {name}
        </span>
        {hasDarkValue && (
          <button
            type="button"
            disabled={disabled}
            aria-pressed={isDark}
            aria-label={`Preview ${name} in ${modeLabel} mode`}
            onClick={onToggleTheme}
            className="flex size-7 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
            title={`Preview ${modeLabel} mode`}
          >
            {isDark ? (
              <IconSun aria-hidden="true" className="size-4" />
            ) : (
              <IconMoon aria-hidden="true" className="size-4" />
            )}
          </button>
        )}
      </div>
      <p className="truncate font-mono text-xs text-muted-foreground">
        --{token}
      </p>
      {description !== undefined && description.length > 0 && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function ColorSwatch({
  name,
  token,
  lightValue,
  darkValue,
  description,
  disabled = false,
}: ColorSwatchProps) {
  const [copied, setCopied] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const hasDarkValue = darkValue !== undefined && darkValue.length > 0;
  const displayValue = isDark && hasDarkValue ? darkValue : lightValue;

  const handleCopy = async () => {
    if (disabled) return;
    await navigator.clipboard.writeText(`var(--${token})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative min-w-0">
      <button
        type="button"
        disabled={disabled}
        aria-label={`Copy var(--${token}) for ${name}`}
        className={cn(
          "flex h-20 w-full items-center justify-center rounded-lg border border-border font-mono text-xs transition-[transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:shadow-md motion-safe:hover:scale-[1.02]",
        )}
        style={{ backgroundColor: displayValue }}
        onClick={() => void handleCopy()}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border border-border/80 bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm transition-opacity duration-150 motion-reduce:transition-none",
            copied
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          {copied ? (
            <IconCheck aria-hidden="true" className="size-3" />
          ) : (
            <IconCopy aria-hidden="true" className="size-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `Copied var(--${token}) to clipboard` : ""}
      </span>
      <ColorSwatchMeta
        name={name}
        token={token}
        hasDarkValue={hasDarkValue}
        isDark={isDark}
        disabled={disabled}
        description={description}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />
    </div>
  );
}

function SurfaceColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {surfaceColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const surfaceColorsCode = `// Surface tokens for backgrounds and containers
// Light -> Dark automatic mapping in src/index.css
.surface-card {
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
}

// Tailwind v4 semantic utilities
<div className="bg-background text-foreground">
  <section className="rounded-lg border border-border bg-card p-4">
    Card surface
  </section>
</div>`;

function ContentColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {contentColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const contentColorsCode = `// Content tokens for readable text hierarchy
<article className="space-y-2">
  <h3 className="text-foreground font-semibold">Primary heading</h3>
  <p className="text-secondary-foreground text-sm">Supporting label</p>
  <p className="text-muted-foreground text-xs">Metadata and captions</p>
</article>`;

function BrandColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {brandColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const brandColorsCode = `import { Button } from "@/components/ui/button"

<div className="flex flex-wrap gap-2">
  <Button className="bg-primary text-primary-foreground">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <span className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
    Highlighted surface
  </span>
</div>`;

function FeedbackColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {feedbackColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const feedbackColorsCode = `import { Badge } from "@/components/ui/badge"

<div className="flex flex-wrap gap-2">
  <Badge variant="destructive">Error</Badge>
  <Badge variant="info">Info</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
</div>`;

function UIColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {uiColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const uiColorsCode = `<div className="space-y-3">
  <button
    type="button"
    className="rounded-md border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
  >
    Bordered control
  </button>
  <input
    aria-label="Search"
    className="rounded-md border border-input bg-background px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-ring"
  />
</div>`;

function ChartColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {chartColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const chartColorsCode = `const series = [
  { label: "Direct", color: "var(--chart-1)" },
  { label: "Organic", color: "var(--chart-2)" },
  { label: "Referral", color: "var(--chart-3)" },
  { label: "Partner", color: "var(--chart-4)" },
  { label: "Other", color: "var(--chart-5)" },
]`;

function ComponentShowcaseDemo() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Buttons</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="success">Success</Button>
          <Button variant="info">Info</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Badges</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </div>
    </div>
  );
}

const componentShowcaseCode = `import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

<div className="flex flex-wrap gap-2">
  <Button variant="default">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="destructive">Destructive</Button>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="info">Info</Badge>
</div>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <ColorSwatch
        name="Workspace Secondary Highlight Surface Token"
        token="workspace-secondary-highlight-surface-foreground"
        lightValue="var(--primary)"
        darkValue="var(--secondary)"
        description="Long token names truncate cleanly without overflowing narrow containers."
      />
      <ColorSwatch
        name="Single-mode token (no dark override)"
        token="muted"
        lightValue="var(--muted)"
      />
      <ColorSwatch
        name="Disabled swatch state"
        token="destructive"
        lightValue="var(--destructive)"
        darkValue="var(--destructive)"
        description="Disabled swatches remain legible while blocking copy and toggle actions."
        disabled
      />
    </div>
  );
}

const stressCode = `// Narrow max-w-xs container: long token names, missing dark value, and disabled swatch
<div className="max-w-xs space-y-4">
  <div className="truncate font-mono text-xs text-muted-foreground">
    --workspace-secondary-highlight-surface-foreground
  </div>
  <div className="rounded-lg border border-border bg-muted p-4 opacity-50">
    Disabled surface preview
  </div>
</div>`;

const usageCode = `/* 1. Reference semantic CSS variables directly */
.callout {
  background-color: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* 2. Prefer Tailwind v4 semantic utilities in JSX */
export function TokenCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h3 className="font-semibold text-foreground">Semantic tokens</h3>
      <p className="text-sm text-muted-foreground">
        Automatically adapts across presets and light/dark appearance.
      </p>
    </div>
  )
}`;

export default function ColorUsagePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Color System"
        description="Semantic OKLCH color tokens organized by surface, content, brand, feedback, UI, and chart roles with automatic light and dark contrast pairing."
        version="v1.0.0"
      />

      <FeatureGrid
        features={colorUsagePageFeatures}
        description="Design-token guarantees across every Kira Kit component."
      />

      <DemoTabs defaultValue="surface" tabs={colorUsagePageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={colorUsagePageShortcuts}
        description="Keyboard access for interactive color swatch previews."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Apply semantic utilities instead of raw hex or palette colors."
        notes={colorUsagePageUsageNotes}
      />

      <APIReference
        sections={colorUsagePageAPISections}
        description="Semantic CSS custom properties and default light-mode OKLCH values."
      />

      <Changelog
        entries={colorUsagePageChangelogEntries}
        title="Changelog"
        description="Version history for the semantic color token specification."
      />
    </ComponentPage>
  );
}

const surfaceColors = [
  {
    name: "Background",
    token: "background",
    lightValue: "oklch(1 0 0)",
    darkValue: "oklch(0.145 0 0)",
    description: "Main page background",
  },
  {
    name: "Card",
    token: "card",
    lightValue: "oklch(1 0 0)",
    darkValue: "oklch(0.205 0 0)",
    description: "Card and container backgrounds",
  },
  {
    name: "Popover",
    token: "popover",
    lightValue: "oklch(1 0 0)",
    darkValue: "oklch(0.205 0 0)",
    description: "Dropdown and popover backgrounds",
  },
  {
    name: "Sidebar",
    token: "sidebar",
    lightValue: "oklch(0.985 0 0)",
    darkValue: "oklch(0.205 0 0)",
    description: "Sidebar navigation background",
  },
] satisfies ColorSwatchProps[];

const contentColors = [
  {
    name: "Foreground",
    token: "foreground",
    lightValue: "oklch(0.145 0 0)",
    darkValue: "oklch(0.985 0 0)",
    description: "Primary text content",
  },
  {
    name: "Muted Foreground",
    token: "muted-foreground",
    lightValue: "oklch(0.50 0.03 25)",
    darkValue: "oklch(0.65 0.03 20)",
    description: "Secondary and caption text",
  },
  {
    name: "Secondary Foreground",
    token: "secondary-foreground",
    lightValue: "oklch(0.20 0.03 15)",
    darkValue: "oklch(0.985 0 0)",
    description: "Tertiary content",
  },
  {
    name: "Accent Foreground",
    token: "accent-foreground",
    lightValue: "oklch(0.30 0.04 20)",
    darkValue: "oklch(0.98 0.01 10)",
    description: "Accented text elements",
  },
] satisfies ColorSwatchProps[];

const brandColors = [
  {
    name: "Primary",
    token: "primary",
    lightValue: "oklch(0.59 0.22 1)",
    darkValue: "oklch(0.66 0.21 354)",
    description: "Primary actions and brand color",
  },
  {
    name: "Primary Foreground",
    token: "primary-foreground",
    lightValue: "oklch(0.97 0.01 343)",
    darkValue: "oklch(0.97 0.01 343)",
    description: "Text on primary background",
  },
  {
    name: "Secondary",
    token: "secondary",
    lightValue: "oklch(0.75 0.10 10)",
    darkValue: "oklch(0.60 0.08 10)",
    description: "Secondary actions and elements",
  },
  {
    name: "Accent",
    token: "accent",
    lightValue: "oklch(0.92 0.04 15)",
    darkValue: "oklch(0.40 0.08 10)",
    description: "Highlight and decorative elements",
  },
] satisfies ColorSwatchProps[];

const feedbackColors = [
  {
    name: "Destructive",
    token: "destructive",
    lightValue: "oklch(0.60 0.22 20)",
    darkValue: "oklch(0.65 0.20 15)",
    description: "Error states and destructive actions",
  },
  {
    name: "Info",
    token: "info",
    lightValue: "oklch(0.75 0.16 225)",
    darkValue: "oklch(0.65 0.14 220)",
    description: "Informational messages",
  },
  {
    name: "Success",
    token: "success",
    lightValue: "oklch(0.75 0.18 150)",
    darkValue: "oklch(0.65 0.16 145)",
    description: "Success states and confirmations",
  },
  {
    name: "Warning",
    token: "warning",
    lightValue: "oklch(0.80 0.16 80)",
    darkValue: "oklch(0.70 0.14 75)",
    description: "Warning and cautionary states",
  },
] satisfies ColorSwatchProps[];

const uiColors = [
  {
    name: "Border",
    token: "border",
    lightValue: "oklch(0.90 0.01 20)",
    darkValue: "oklch(1 0 0 / 15%)",
    description: "Borders and dividers",
  },
  {
    name: "Input",
    token: "input",
    lightValue: "oklch(0.90 0.01 20)",
    darkValue: "oklch(1 0 0 / 20%)",
    description: "Form input backgrounds",
  },
  {
    name: "Ring",
    token: "ring",
    lightValue: "oklch(0.70 0.12 350)",
    darkValue: "oklch(0.65 0.14 350)",
    description: "Focus rings and indicators",
  },
] satisfies ColorSwatchProps[];

const chartColors = [
  {
    name: "Chart 1",
    token: "chart-1",
    lightValue: "oklch(0.75 0.14 185)",
    darkValue: "oklch(0.70 0.12 185)",
    description: "Teal — data series 1",
  },
  {
    name: "Chart 2",
    token: "chart-2",
    lightValue: "oklch(0.75 0.18 35)",
    darkValue: "oklch(0.70 0.16 35)",
    description: "Coral — data series 2",
  },
  {
    name: "Chart 3",
    token: "chart-3",
    lightValue: "oklch(0.78 0.14 95)",
    darkValue: "oklch(0.72 0.12 95)",
    description: "Golden — data series 3",
  },
  {
    name: "Chart 4",
    token: "chart-4",
    lightValue: "oklch(0.70 0.12 280)",
    darkValue: "oklch(0.65 0.10 280)",
    description: "Soft purple — data series 4",
  },
  {
    name: "Chart 5",
    token: "chart-5",
    lightValue: "oklch(0.65 0.10 160)",
    darkValue: "oklch(0.60 0.08 160)",
    description: "Sage — data series 5",
  },
] satisfies ColorSwatchProps[];

const colorUsagePageFeatures = [
  {
    title: "Semantic Tokens",
    description:
      "Colors are organized by role — surface, content, brand, feedback, UI, and chart — so themes re-skin cleanly.",
  },
  {
    title: "OKLCH Color Space",
    description:
      "Perceptually uniform lightness and chroma keep WCAG 2.1 AA contrast predictable across hues.",
  },
  {
    title: "Light & Dark Parity",
    description:
      "Every semantic token ships paired light and dark values with automatic foreground contrast.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const colorUsagePageDemoTabs = [
  {
    value: "surface",
    label: "Surface",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Surface Colors"
        description="Background and container tokens for pages, cards, popovers, and sidebars. Click any swatch to copy its CSS variable."
        code={surfaceColorsCode}
      >
        <SurfaceColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "content",
    label: "Content",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Content Colors"
        description="Text tokens for headings, body copy, labels, and captions."
        code={contentColorsCode}
      >
        <ContentColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "brand",
    label: "Brand",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Brand Colors"
        description="Primary, secondary, and accent tokens for key actions and highlights."
        code={brandColorsCode}
      >
        <BrandColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "feedback",
    label: "Feedback",
    group: "Semantic",
    demo: (
      <DemoWrapper
        title="Feedback Colors"
        description="Destructive, info, success, and warning status tokens."
        code={feedbackColorsCode}
      >
        <FeedbackColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ui",
    label: "UI",
    group: "Semantic",
    demo: (
      <DemoWrapper
        title="UI Colors"
        description="Border, input, and focus ring tokens for chrome and controls."
        code={uiColorsCode}
      >
        <UIColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "chart",
    label: "Chart",
    group: "Semantic",
    demo: (
      <DemoWrapper
        title="Chart Colors"
        description="Five distinct data-visualization tokens balanced for both light and dark surfaces."
        code={chartColorsCode}
      >
        <ChartColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "components",
    label: "Components",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Component Showcase"
        description="Buttons and badges consuming semantic color tokens live."
        code={componentShowcaseCode}
      >
        <ComponentShowcaseDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long token identifiers, missing dark overrides, and disabled swatch controls inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const colorUsagePageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    group: "Swatch controls",
    description:
      "Move focus between swatch copy buttons and theme preview toggles.",
  },
  {
    keys: "Enter / Space",
    group: "Swatch controls",
    description:
      "Copy var(--token) to the clipboard or toggle the swatch between light and dark previews.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const colorUsagePageUsageNotes = [
  {
    label: "Semantic over raw",
    body: "Always pair background and foreground tokens (for example bg-primary with text-primary-foreground) instead of hardcoded hex or Tailwind palette classes.",
  },
  {
    label: "Color-blind safety",
    body: "Never convey status by color alone; pair feedback tokens with text labels or icons.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const colorUsagePageAPISections = [
  {
    title: "Surface Tokens",
    props: [
      {
        prop: "--background",
        type: "oklch()",
        default: "oklch(1 0 0)",
        description: "Main page container background.",
      },
      {
        prop: "--card",
        type: "oklch()",
        default: "oklch(1 0 0)",
        description: "Card, panel, and content surface background.",
      },
      {
        prop: "--popover",
        type: "oklch()",
        default: "oklch(1 0 0)",
        description: "Dropdown, tooltip, and modal surface background.",
      },
      {
        prop: "--sidebar",
        type: "oklch()",
        default: "oklch(0.985 0 0)",
        description: "Sidebar navigation surface background.",
      },
      {
        prop: "--muted",
        type: "oklch()",
        default: "oklch(0.985 0 0)",
        description: "Subtle surface and disabled background.",
      },
    ],
  },
  {
    title: "Content Tokens",
    props: [
      {
        prop: "--foreground",
        type: "oklch()",
        default: "oklch(0.145 0 0)",
        description: "Primary text, headings, and body copy.",
      },
      {
        prop: "--muted-foreground",
        type: "oklch()",
        default: "oklch(0.50 0.03 25)",
        description: "Helper text, captions, timestamps, and metadata.",
      },
      {
        prop: "--secondary-foreground",
        type: "oklch()",
        default: "oklch(0.20 0.03 15)",
        description: "Subheadings and supporting labels.",
      },
      {
        prop: "--accent-foreground",
        type: "oklch()",
        default: "oklch(0.30 0.04 20)",
        description: "Text placed on accent surfaces.",
      },
    ],
  },
  {
    title: "Brand Tokens",
    props: [
      {
        prop: "--primary",
        type: "oklch()",
        default: "oklch(0.59 0.22 1)",
        description:
          "Primary buttons, active states, links, and brand emphasis.",
      },
      {
        prop: "--primary-foreground",
        type: "oklch()",
        default: "oklch(0.97 0.01 343)",
        description: "Contrasting text on primary surfaces.",
      },
      {
        prop: "--secondary",
        type: "oklch()",
        default: "oklch(0.75 0.10 10)",
        description: "Secondary actions and subtle surfaces.",
      },
      {
        prop: "--accent",
        type: "oklch()",
        default: "oklch(0.92 0.04 15)",
        description: "Hover highlights and selected surfaces.",
      },
    ],
  },
  {
    title: "Feedback Tokens",
    props: [
      {
        prop: "--destructive",
        type: "oklch()",
        default: "oklch(0.60 0.22 20)",
        description: "Error messages, delete actions, and validation failures.",
      },
      {
        prop: "--success",
        type: "oklch()",
        default: "oklch(0.75 0.18 150)",
        description: "Success states, confirmations, and completions.",
      },
      {
        prop: "--warning",
        type: "oklch()",
        default: "oklch(0.80 0.16 80)",
        description: "Cautionary messages and non-blocking warnings.",
      },
      {
        prop: "--info",
        type: "oklch()",
        default: "oklch(0.75 0.16 225)",
        description: "Informational tips and neutral notices.",
      },
    ],
  },
  {
    title: "UI & Chart Tokens",
    props: [
      {
        prop: "--border",
        type: "oklch()",
        default: "oklch(0.90 0.01 20)",
        description: "Borders, dividers, and hairline rules.",
      },
      {
        prop: "--input",
        type: "oklch()",
        default: "oklch(0.90 0.01 20)",
        description: "Form field borders and input chrome.",
      },
      {
        prop: "--ring",
        type: "oklch()",
        default: "oklch(0.70 0.12 350)",
        description: "Keyboard focus ring indicator.",
      },
      {
        prop: "--chart-1 .. --chart-5",
        type: "oklch()",
        default: "theme palette",
        description: "Ordered data-visualization series colors.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const colorUsagePageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Semantic color system guide",
        description:
          "Interactive OKLCH token catalog covering surface, content, brand, feedback, UI, and chart tokens with accessible clipboard copy, per-swatch dark previews, and stress cases.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
