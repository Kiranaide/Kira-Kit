import * as React from "react";
import { IconLoader, IconCheck } from "@tabler/icons-react";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}

const basicCode = `import { Spinner } from "@/components/ui/spinner"

export function BasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}`;

function SizesDemo() {
  const sizes = ["xs", "sm", "default", "md", "lg", "xl"] as const;

  return (
    <div className="flex items-end gap-6">
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

export function SizesDemo() {
  const sizes = ["xs", "sm", "default", "md", "lg", "xl"] as const;

  return (
    <div className="flex items-end gap-6">
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
    <div className="flex items-center gap-6">
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

export function ColorsDemo() {
  const variants = ["default", "muted", "destructive", "warning", "success", "info"] as const;

  return (
    <div className="flex items-center gap-6">
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

const usageCode = `import { Spinner } from "@/components/ui/spinner"

// Basic usage
<Spinner />

// With size
<Spinner size="lg" />

// With variant
<Spinner variant="destructive" />

// Custom label (for accessibility)
<Spinner label="Loading data" />

// Inline spinner
<p>Uploading <Spinner size="xs" className="inline" /> 75%</p>`;

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
        default: '"Loading"',
        description: "Accessible label for screen readers.",
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
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Spinner"
        description="Animated loading indicator with size and color variants, designed for accessibility and seamless integration with other components."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Spinner in your application."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for the Spinner component."
      />
    </ComponentPage>
  );
}
