import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconLoader, IconCheck } from "@tabler/icons-react";

import {
  Spinner,
  KiraProgressSpinner,
  type SpinnerState,
} from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

function FeaturesDemo() {
  const resolveLabel1 = () => {
    if (state === "success") {
      return "Upload complete" as const;
    }

    if (state === "error") {
      return "Upload failed" as const;
    }

    return "Uploading report" as const;
  };

  const resolveVariant2 = () => {
    if (state === "error") {
      return "destructive" as const;
    }

    if (state === "success") {
      return "success" as const;
    }

    return "default" as const;
  };

  const [value, setValue] = React.useState(45);
  const [state, setState] = React.useState<SpinnerState>("loading");

  return (
    <div className="w-full space-y-4">
      <KiraProgressSpinner
        label={resolveLabel1()}
        value={value}
        state={state}
        showPercent
        variant={resolveVariant2()}
      />
      <label className="flex flex-wrap items-center gap-2 text-sm">
        Progress
        <input
          aria-label="Upload progress"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => {
            setState("loading");
            setValue(Number(event.target.value));
          }}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setState("loading")}>
          Loading
        </Button>
        <Button size="sm" onClick={() => setState("success")}>
          Success
        </Button>
        <Button size="sm" variant="outline" onClick={() => setState("error")}>
          Error
        </Button>
      </div>
    </div>
  );
}

function IndeterminateDemo() {
  return <KiraProgressSpinner label="Waiting for server" />;
}

const indeterminateCode = `import { KiraProgressSpinner } from "@/components/ui/spinner"

function IndeterminateDemo() {
  return <KiraProgressSpinner label="Waiting for server" />;
}`;

const featuresCode = `import * as React from "react";
import { KiraProgressSpinner, type SpinnerState } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

function FeaturesDemo() {
  const [value, setValue] = React.useState(45);
  const [state, setState] = React.useState<SpinnerState>("loading");
  return <div className="w-full space-y-4">
    <KiraProgressSpinner label={state === "success" ? "Upload complete" : state === "error" ? "Upload failed" : "Uploading report"} value={value} state={state} showPercent variant={state === "error" ? "destructive" : state === "success" ? "success" : "default"} />
    <label className="flex flex-wrap items-center gap-2 text-sm">Progress
      <input aria-label="Upload progress" type="range" min={0} max={100} value={value} onChange={(event) => { setState("loading"); setValue(Number(event.target.value)); }} />
    </label>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => setState("loading")}>Loading</Button>
      <Button size="sm" onClick={() => setState("success")}>Success</Button>
      <Button size="sm" variant="outline" onClick={() => setState("error")}>Error</Button>
    </div>
  </div>;
}`;

function ShowcaseDemo() {
  return (
    <div className="w-full max-w-64 space-y-4">
      <KiraProgressSpinner
        label="Very long multilingual upload label 年次レポート 🌍 unbreakable_identifier_abcdefghijklmnopqrstuvwxyz"
        value={0}
        showPercent
      />
      <KiraProgressSpinner label="Full progress" value={100} showPercent />
      <KiraProgressSpinner
        label="Failed at 45 percent"
        value={45}
        state="error"
        showPercent
        variant="destructive"
      />
      <Spinner value={Number.NaN} label="Invalid progress safely reads zero" />
    </div>
  );
}

const showcaseCode = `import { Spinner, KiraProgressSpinner } from "@/components/ui/spinner"

function ShowcaseDemo() {
  return <div className="w-full max-w-64 space-y-4">
    <KiraProgressSpinner label="Very long multilingual upload label 年次レポート 🌍 unbreakable_identifier_abcdefghijklmnopqrstuvwxyz" value={0} showPercent />
    <KiraProgressSpinner label="Full progress" value={100} showPercent />
    <KiraProgressSpinner label="Failed at 45 percent" value={45} state="error" showPercent variant="destructive" />
    <Spinner value={Number.NaN} label="Invalid progress safely reads zero" />
  </div>;
}`;

function BasicDemo() {
  return (
    <output className="flex items-center gap-4">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </output>
  );
}

const basicCode = `import { Spinner } from "@/components/ui/spinner"

export function BasicDemo() {
  return (
    <div role="status" className="flex items-center gap-4">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}`;

function SizesDemo() {
  const sizes = ["xs", "sm", "default", "md", "lg", "xl"] as const;

  return (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  );
}

const sizesCode = `import { Spinner } from "@/components/ui/spinner"

function SizesDemo() {
  const sizes = ["xs", "sm", "default", "md", "lg", "xl"] as const;

  return (
    <div className="flex flex-wrap items-end gap-6">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  );
}`;

function ColorsDemo() {
  const variants = [
    "default",
    "muted",
    "destructive",
    "warning",
    "success",
    "info",
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Spinner variant={variant} />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  );
}

const colorsCode = `import { Spinner } from "@/components/ui/spinner"

function ColorsDemo() {
  const variants = [
    "default",
    "muted",
    "destructive",
    "warning",
    "success",
    "info",
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Spinner variant={variant} />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  );
}`;

function ButtonLoadingDemo() {
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleClick} disabled={loading} className="gap-2">
        {loading && <Spinner size="sm" />}
        {loading ? "Loading..." : "Submit"}
      </Button>

      <Button
        variant="outline"
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        {loading && <Spinner size="sm" />}
        {loading ? "Loading..." : "Cancel"}
      </Button>

      <Button
        variant="destructive"
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        {loading && <Spinner size="sm" />}
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}

const buttonLoadingCode = `import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export function ButtonLoadingDemo() {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        {loading && <Spinner size="sm" />}
        {loading ? "Loading..." : "Submit"}
      </Button>

      <Button
        variant="outline"
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        {loading && <Spinner size="sm" />}
        {loading ? "Loading..." : "Cancel"}
      </Button>

      <Button
        variant="destructive"
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        {loading && <Spinner size="sm" />}
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}`;

function WithLabelDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Spinner variant="default" />
        <span className="text-sm">Loading your data...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner variant="success" />
        <span className="text-sm">Processing payment...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner variant="warning" />
        <span className="text-sm">Syncing changes...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner variant="destructive" />
        <span className="text-sm">Deleting files...</span>
      </div>
    </div>
  );
}

const withLabelCode = `import { Spinner } from "@/components/ui/spinner"

export function WithLabelDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Spinner variant="default" />
        <span className="text-sm">Loading your data...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner variant="success" />
        <span className="text-sm">Processing payment...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner variant="warning" />
        <span className="text-sm">Syncing changes...</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner variant="destructive" />
        <span className="text-sm">Deleting files...</span>
      </div>
    </div>
  );
}`;

function CardOverlayDemo() {
  return (
    <div className="relative h-32 w-full rounded-lg border bg-muted/50">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading content...</p>
      </div>
    </div>
  );
}

const cardOverlayCode = `import { Spinner } from "@/components/ui/spinner"

export function CardOverlayDemo() {
  return (
    <div className="relative h-32 w-full rounded-lg border bg-muted/50">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading content...</p>
      </div>
    </div>
  );
}`;

function InlineTextDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Uploading file <Spinner size="xs" className="ml-1 inline" /> 75%
      </p>
      <p className="text-sm">
        Connecting to server <Spinner size="xs" className="ml-1 inline" />{" "}
        please wait
      </p>
      <p className="text-sm">
        Saving changes <Spinner size="xs" className="ml-1 inline" /> almost done
      </p>
    </div>
  );
}

const inlineTextCode = `import { Spinner } from "@/components/ui/spinner"

export function InlineTextDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Uploading file <Spinner size="xs" className="ml-1 inline" /> 75%
      </p>
      <p className="text-sm">
        Connecting to server <Spinner size="xs" className="ml-1 inline" /> please wait
      </p>
      <p className="text-sm">
        Saving changes <Spinner size="xs" className="ml-1 inline" /> almost done
      </p>
    </div>
  );
}`;

const usageCode = `import { Spinner, KiraProgressSpinner } from "@/components/ui/spinner";

export function SpinnerUsage() {
  return (
    <div className="space-y-3">
      <Spinner label="Loading report" />
      <KiraProgressSpinner label="Uploading report" value={45} showPercent />
      <KiraProgressSpinner label="Upload complete" state="success" variant="success" />
    </div>
  );
}`;

const apiSections = [
  {
    title: "Spinner",
    props: [
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "md" | "lg" | "xl"',
        default: '"default"',
        description: "Size of the spinner.",
      },
      {
        prop: "variant",
        type: '"default" | "muted" | "destructive" | "warning" | "success" | "info"',
        default: '"default"',
        description: "Color variant of the spinner.",
      },
      {
        prop: "label",
        type: "string",
        default: "undefined",
        description: "Accessible label for screen readers.",
      },
      {
        prop: "value",
        type: "number",
        description: "Clamped 0–100 progress; undefined is indeterminate.",
      },
      {
        prop: "state",
        type: '"loading" | "success" | "error"',
        default: '"loading"',
        description: "Controlled lifecycle; parent supplies a matching label.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes to apply.",
      },
    ],
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function SpinnerPage() {
  const features = [
    {
      title: "Responsive",
      description:
        "Six size variants from extra-small to extra-large for any use case.",
      icon: <IconLoader className="h-4 w-4" />,
    },
    {
      title: "Themed",
      description: "Six color variants matching the design system palette.",
      icon: <IconCheck className="h-4 w-4" />,
    },
    {
      title: "Accessible",
      description: "Built with proper ARIA labels for screen readers.",
      icon: <IconLoader className="h-4 w-4" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Spinner"
          description="Simple loading indicator with text label."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Six size options from xs to xl."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "colors",
      label: "Colors",
      demo: (
        <DemoWrapper
          title="Color Variants"
          description="Six color variants for different contexts."
          code={colorsCode}
        >
          <ColorsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "button",
      label: "Button Loading",
      demo: (
        <DemoWrapper
          title="Button with Spinner"
          description="Combine spinner with buttons for loading states."
          code={buttonLoadingCode}
        >
          <ButtonLoadingDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "labels",
      label: "With Labels",
      demo: (
        <DemoWrapper
          title="Spinner with Labels"
          description="Contextual loading messages with matching spinner colors."
          code={withLabelCode}
        >
          <WithLabelDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "overlay",
      label: "Card Overlay",
      demo: (
        <DemoWrapper
          title="Card Loading Overlay"
          description="Full card loading state with centered spinner."
          code={cardOverlayCode}
        >
          <CardOverlayDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "inline",
      label: "Inline Text",
      demo: (
        <DemoWrapper
          title="Inline in Text"
          description="Small inline spinners within text content."
          code={inlineTextCode}
        >
          <InlineTextDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "indeterminate",
      label: "Indeterminate",
      demo: (
        <DemoWrapper
          title="Unknown duration"
          description="A visible task label and HTML status; rotation pauses with reduced motion or a hidden document."
          code={indeterminateCode}
        >
          <IndeterminateDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "features",
      label: "Kira Progress",
      demo: (
        <DemoWrapper
          title="Controlled progress lifecycle"
          description="Measured progress and explicit success/error; terminal states never display a stale percent."
          code={featuresCode}
        >
          <FeaturesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "showcase",
      label: "States",
      demo: (
        <DemoWrapper
          title="Progress boundaries"
          description="Long labels, zero/full progress, invalid input and no stale terminal percentage."
          code={showcaseCode}
        >
          <ShowcaseDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Spinner"
        description="Animated loading indicator with size and color variants, designed for accessibility and seamless integration with other components."
        version="v2.0.1"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "None",
            description:
              "Spinner is non-interactive; feature demo controls use normal Tab, arrows and Enter.",
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Spinner in your application."
      />

      <APIReference
        sections={spinnerPageAPIReferenceSections}
        title="API reference"
        description="Props and configuration options for the Spinner component."
      />

      <Changelog entries={spinnerPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const spinnerPageAPIReferenceSections = [
  ...apiSections,
  {
    title: "KiraProgressSpinner",
    props: [
      {
        prop: "label",
        type: "string",
        description: "Required visible and accessible task label.",
      },
      {
        prop: "value",
        type: "number",
        description: "Clamped 0–100 progress; undefined is indeterminate.",
      },
      {
        prop: "state",
        type: '"loading" | "success" | "error"',
        default: '"loading"',
        description: "Controlled loading, success or error state.",
      },
      {
        prop: "showPercent",
        type: "boolean",
        default: "false",
        description: "Numeric percent only while determinate loading.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const spinnerPageChangelogEntries = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "changed",
        title: "Shared useDocumentVisible hook",
        description:
          "Adopted useDocumentVisible from @/hooks/use-visibility-pause instead of managing a local visibilitychange listener.",
      },
    ],
  },
  {
    version: "v2.0.1",
    date: "11 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Demo page follows the accordion structure",
        description:
          "Basic comes first, feature and Kira examples have focused tabs, and Changelog follows API Reference. Audited against Base UI 1.9.0; no component API changes.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "31 October 2026",
    changes: [
      {
        type: "added",
        title: "Determinate progress and controlled success/error glyphs",
      },
      {
        type: "fixed",
        title:
          "Arc origin, hidden-document pause and HTML status announcements",
      },
      {
        type: "breaking",
        title:
          "No default label: bare Spinner is decorative. Supply label or parent busy status.",
      },
      {
        type: "changed",
        title:
          "KiraProgressSpinner shows its label and hides percentage after terminal states",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
