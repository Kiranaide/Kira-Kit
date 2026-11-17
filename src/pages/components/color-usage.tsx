"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  APIReference,
} from "@/components/docs";

interface ColorSwatchProps {
  name: string;
  token: string;
  lightValue: string;
  darkValue?: string;
  description?: string;
}

function ColorSwatch({
  name,
  token,
  lightValue,
  darkValue,
  description,
}: ColorSwatchProps) {
  const [copied, setCopied] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const displayValue = isDark && darkValue ? darkValue : lightValue;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`var(--${token})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={`Copy ${name} color value`}
        className="w-full h-20 rounded-lg border border-border transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md flex items-center justify-center text-xs font-mono"
        style={{
          backgroundColor: displayValue,
          color: isDark && darkValue ? "white" : "black",
        }}
        onClick={handleCopy}
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{name}</span>
          {darkValue && (
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={`Preview ${isDark ? "light" : "dark"} mode`}
            >
              <IconMoon className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono">{token}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
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
];

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
];

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
];

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
];

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
];

const chartColors = [
  {
    name: "Chart 1",
    token: "chart-1",
    lightValue: "oklch(0.75 0.14 185)",
    darkValue: "oklch(0.70 0.12 185)",
    description: "Teal - data visualization",
  },
  {
    name: "Chart 2",
    token: "chart-2",
    lightValue: "oklch(0.75 0.18 35)",
    darkValue: "oklch(0.70 0.16 35)",
    description: "Coral - data visualization",
  },
  {
    name: "Chart 3",
    token: "chart-3",
    lightValue: "oklch(0.78 0.14 95)",
    darkValue: "oklch(0.72 0.12 95)",
    description: "Golden - data visualization",
  },
  {
    name: "Chart 4",
    token: "chart-4",
    lightValue: "oklch(0.70 0.12 280)",
    darkValue: "oklch(0.65 0.10 280)",
    description: "Soft Purple - data visualization",
  },
  {
    name: "Chart 5",
    token: "chart-5",
    lightValue: "oklch(0.65 0.10 160)",
    darkValue: "oklch(0.60 0.08 160)",
    description: "Sage - data visualization",
  },
];

function SurfaceColorsDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {surfaceColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const surfaceColorsCode = `// Surface colors for backgrounds and containers
background:   oklch(1 0 0)      // Main page background
card:        oklch(1 0 0)      // Card and panel backgrounds
popover:     oklch(1 0 0)      // Dropdowns and modals
sidebar:      oklch(0.985 0 0)   // Sidebar background
muted:        oklch(0.985 0 0)   // Subtle backgrounds

// Usage with CSS variables
.component {
  background-color: var(--background);
  color: var(--foreground);
  border-color: var(--border);
}`;

function ContentColorsDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {contentColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const contentColorsCode = `// Content colors for text
foreground:         oklch(0.145 0 0)  // Primary text
muted-foreground:   oklch(0.50 0.03 25)  // Secondary text
secondary-foreground: oklch(0.20 0.03 15)  // Tertiary text
accent-foreground:  oklch(0.30 0.04 20)  // Accented text

// Usage
.heading {
  color: var(--foreground);
}

.caption {
  color: var(--muted-foreground);
}

.badge-text {
  color: var(--accent-foreground);
}`;

function BrandColorsDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {brandColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const brandColorsCode = `// Brand colors
primary:             oklch(0.59 0.22 1)   // Primary actions
primary-foreground:   oklch(0.97 0.01 343) // Text on primary
secondary:           oklch(0.75 0.10 10)  // Secondary actions
accent:              oklch(0.92 0.04 15)  // Highlights

// Usage
<Button className="bg-primary text-primary-foreground">
  Primary Action
</Button>

<Button variant="secondary">
  Secondary Action
</Button>

<div className="bg-accent text-accent-foreground">
  Highlighted content
</div>`;

function FeedbackColorsDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {feedbackColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const feedbackColorsCode = `// Feedback colors
destructive: oklch(0.60 0.22 20)  // Errors
info:        oklch(0.75 0.16 225)  // Information
success:     oklch(0.75 0.18 150)  // Success
warning:     oklch(0.80 0.16 80)   // Warnings

// Usage
<Alert variant="destructive">Error message</Alert>
<Alert variant="info">Info message</Alert>
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>`;

function UIColorsDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {uiColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const uiColorsCode = `// UI colors
border: oklch(0.90 0.01 20)  // Borders and dividers
input:  oklch(0.90 0.01 20)  // Form inputs
ring:   oklch(0.70 0.12 350) // Focus indicators

// Usage
<button className="border border-border">
  Bordered Button
</button>

<input className="bg-input border border-border focus:ring-2 focus:ring-ring" />

<div className="focus:outline-none focus:ring-2 focus:ring-ring">
  Accessible focus
</div>`;

function ChartColorsDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {chartColors.map((color) => (
        <ColorSwatch key={color.token} {...color} />
      ))}
    </div>
  );
}

const chartColorsCode = `// Chart colors
chart-1: oklch(0.75 0.14 185)  // Teal
chart-2: oklch(0.75 0.18 35)   // Coral
chart-3: oklch(0.78 0.14 95)   // Golden
chart-4: oklch(0.70 0.12 280)  // Soft Purple
chart-5: oklch(0.65 0.10 160)  // Sage

// Usage with charting libraries
<Chart
  data={[
    { value: 100, fill: "var(--chart-1)" },
    { value: 200, fill: "var(--chart-2)" },
    { value: 300, fill: "var(--chart-3)" },
  ]}
/>

// CSS usage
.bar-chart {
  --chart-bar-1: var(--chart-1);
  --chart-bar-2: var(--chart-2);
}`;

import { IconMoon } from "@tabler/icons-react";

function ComponentShowcase() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Buttons</h4>
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
          <h4 className="font-medium">Badges</h4>
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
    </div>
  );
}

const componentShowcaseCode = `import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Button variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Badge variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="warning">Warning</Badge>`;

export default function ColorUsagePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Color System"
        description="A comprehensive color system built on semantic tokens with OKLCH colors. Inspired by Apple Human Interface Guidelines and Carbon Design System principles."
        version="v1.0"
      />

      <FeatureGrid features={colorUsagePageFeatureGridFeatures} />

      <DemoTabs defaultValue="surface" tabs={colorUsagePageDemoTabsTabs} />

      <APIReference sections={colorUsagePageAPIReferenceSections} />
    </ComponentPage>
  );
}

const colorUsagePageFeatureGridFeatures = [
  {
    title: "Semantic Tokens",
    description:
      "Colors are organized by purpose: surface, content, brand, feedback, and UI.",
  },
  {
    title: "OKLCH Color Space",
    description:
      "Modern color space with better perceptual uniformity and WCAG contrast compliance.",
  },
  {
    title: "Light & Dark Modes",
    description:
      "All colors have light and dark variants that automatically respond to system theme.",
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];

const colorUsagePageDemoTabsTabs = [
  {
    value: "surface",
    label: "Surface",
    demo: (
      <DemoWrapper
        title="Surface Colors"
        description="Background and container colors for layouts, cards, panels, and sidebars."
        code={surfaceColorsCode}
      >
        <SurfaceColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "content",
    label: "Content",
    demo: (
      <DemoWrapper
        title="Content Colors"
        description="Text colors for headings, body content, captions, and accents."
        code={contentColorsCode}
      >
        <ContentColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "brand",
    label: "Brand",
    demo: (
      <DemoWrapper
        title="Brand Colors"
        description="Primary, secondary, and accent colors for branding and actions."
        code={brandColorsCode}
      >
        <BrandColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "feedback",
    label: "Feedback",
    demo: (
      <DemoWrapper
        title="Feedback Colors"
        description="Destructive, info, success, and warning colors for status messages."
        code={feedbackColorsCode}
      >
        <FeedbackColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ui",
    label: "UI",
    demo: (
      <DemoWrapper
        title="UI Colors"
        description="Border, input, and focus ring colors for UI elements."
        code={uiColorsCode}
      >
        <UIColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "chart",
    label: "Chart",
    demo: (
      <DemoWrapper
        title="Chart Colors"
        description="Data visualization colors for charts and graphs."
        code={chartColorsCode}
      >
        <ChartColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "components",
    label: "Components",
    demo: (
      <DemoWrapper
        title="Component Showcase"
        description="Live examples of components using color system tokens."
        code={componentShowcaseCode}
      >
        <ComponentShowcase />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

const colorUsagePageAPIReferenceSections = [
  {
    title: "Surface Colors",
    props: [
      {
        prop: "--background",
        type: "oklch()",
        default: "oklch(1 0 0)",
        description: "Main page container background",
      },
      {
        prop: "--card",
        type: "oklch()",
        default: "oklch(1 0 0)",
        description: "Card, panel, and content area backgrounds",
      },
      {
        prop: "--popover",
        type: "oklch()",
        default: "oklch(1 0 0)",
        description: "Dropdowns, tooltips, and modal backgrounds",
      },
      {
        prop: "--sidebar",
        type: "oklch()",
        default: "oklch(0.985 0 0)",
        description: "Sidebar and navigation panel background",
      },
      {
        prop: "--muted",
        type: "oklch()",
        default: "oklch(0.985 0 0)",
        description: "Subtle backgrounds and disabled states",
      },
    ],
  },
  {
    title: "Content Colors",
    props: [
      {
        prop: "--foreground",
        type: "oklch()",
        default: "oklch(0.145 0 0)",
        description: "Primary text, headings, body copy",
      },
      {
        prop: "--muted-foreground",
        type: "oklch()",
        default: "oklch(0.50 0.03 25)",
        description: "Helper text, captions, timestamps, metadata",
      },
      {
        prop: "--secondary-foreground",
        type: "oklch()",
        default: "oklch(0.20 0.03 15)",
        description: "Subheadings, labels, decorative text",
      },
      {
        prop: "--accent-foreground",
        type: "oklch()",
        default: "oklch(0.30 0.04 20)",
        description: "Accented text, highlighted content",
      },
    ],
  },
  {
    title: "Brand Colors",
    props: [
      {
        prop: "--primary",
        type: "oklch()",
        default: "oklch(0.59 0.22 1)",
        description: "Primary buttons, active states, links, brand elements",
      },
      {
        prop: "--primary-foreground",
        type: "oklch()",
        default: "oklch(0.97 0.01 343)",
        description: "Text on primary buttons and backgrounds",
      },
      {
        prop: "--secondary",
        type: "oklch()",
        default: "oklch(0.75 0.10 10)",
        description: "Secondary actions, toggle states, alternative buttons",
      },
      {
        prop: "--accent",
        type: "oklch()",
        default: "oklch(0.92 0.04 15)",
        description: "Highlights, decorative elements, selections",
      },
    ],
  },
  {
    title: "Feedback Colors",
    props: [
      {
        prop: "--destructive",
        type: "oklch()",
        default: "oklch(0.60 0.22 20)",
        description: "Error messages, delete actions, validation errors",
      },
      {
        prop: "--success",
        type: "oklch()",
        default: "oklch(0.75 0.18 150)",
        description: "Success messages, confirmation, completion states",
      },
      {
        prop: "--warning",
        type: "oklch()",
        default: "oklch(0.80 0.16 80)",
        description: "Warnings, cautions, non-critical issues",
      },
      {
        prop: "--info",
        type: "oklch()",
        default: "oklch(0.75 0.16 225)",
        description: "Informational messages, tips, notifications",
      },
    ],
  },
  {
    title: "UI Colors",
    props: [
      {
        prop: "--border",
        type: "oklch()",
        default: "oklch(0.90 0.01 20)",
        description: "Borders, dividers, separator lines",
      },
      {
        prop: "--input",
        type: "oklch()",
        default: "oklch(0.90 0.01 20)",
        description: "Form input backgrounds, form fields",
      },
      {
        prop: "--ring",
        type: "oklch()",
        default: "oklch(0.70 0.12 350)",
        description: "Focus indicators, keyboard navigation rings",
      },
    ],
  },
  {
    title: "Chart Colors",
    props: [
      {
        prop: "--chart-1",
        type: "oklch()",
        default: "oklch(0.75 0.14 185)",
        description: "Teal - data series 1, primary data",
      },
      {
        prop: "--chart-2",
        type: "oklch()",
        default: "oklch(0.75 0.18 35)",
        description: "Coral - data series 2, complementary",
      },
      {
        prop: "--chart-3",
        type: "oklch()",
        default: "oklch(0.78 0.14 95)",
        description: "Golden - data series 3, accent",
      },
      {
        prop: "--chart-4",
        type: "oklch()",
        default: "oklch(0.70 0.12 280)",
        description: "Soft Purple - data series 4, secondary",
      },
      {
        prop: "--chart-5",
        type: "oklch()",
        default: "oklch(0.65 0.10 160)",
        description: "Sage - data series 5, tertiary",
      },
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];
