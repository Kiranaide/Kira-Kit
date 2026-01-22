import { Separator } from "@/components/ui/separator"
import { IconStar, IconBolt, IconLine, IconPalette, IconSparkles } from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs"

// =============================================================================
// Demo Components
// =============================================================================

function HorizontalDemo() {
  return (
    <div className="space-y-4">
      <p>Content above the separator</p>
      <Separator />
      <p>Content below the separator</p>
    </div>
  )
}

const horizontalCode = `import { Separator } from "@/components/ui/separator"

export function HorizontalSeparator() {
  return (
    <div className="space-y-4">
      <p>Content above the separator</p>
      <Separator />
      <p>Content below the separator</p>
    </div>
  )
}`

function VerticalDemo() {
  return (
    <div className="flex items-center gap-4 h-8">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Middle</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  )
}

const verticalCode = `import { Separator } from "@/components/ui/separator"

export function VerticalSeparator() {
  return (
    <div className="flex items-center gap-4 h-8">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Middle</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  )
}`

function SizesDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">xs</span>
        <Separator size="xs" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">sm</span>
        <Separator size="sm" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">default</span>
        <Separator size="default" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">lg</span>
        <Separator size="lg" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">xl</span>
        <Separator size="xl" className="max-w-48" />
      </div>
    </div>
  )
}

const sizesCode = `import { Separator } from "@/components/ui/separator"

export function SeparatorSizes() {
  return (
    <div className="space-y-4">
      <Separator size="xs" />
      <Separator size="sm" />
      <Separator size="default" />
      <Separator size="lg" />
      <Separator size="xl" />
    </div>
  )
}`

function LineStylesDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">Solid</span>
        <Separator lineStyle="solid" className="max-w-64" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">Dashed</span>
        <Separator lineStyle="dashed" className="max-w-64" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">Dotted</span>
        <Separator lineStyle="dotted" className="max-w-64" />
      </div>
    </div>
  )
}

const lineStylesCode = `import { Separator } from "@/components/ui/separator"

export function SeparatorLineStyles() {
  return (
    <div className="space-y-4">
      <Separator lineStyle="solid" />
      <Separator lineStyle="dashed" />
      <Separator lineStyle="dotted" />
    </div>
  )
}`

function ColorsDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">default</span>
        <Separator color="default" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">primary</span>
        <Separator color="primary" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">secondary</span>
        <Separator color="secondary" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">muted</span>
        <Separator color="muted" className="max-w-48" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-24 text-sm text-muted-foreground">destructive</span>
        <Separator color="destructive" className="max-w-48" />
      </div>
    </div>
  )
}

const colorsCode = `import { Separator } from "@/components/ui/separator"

export function SeparatorColors() {
  return (
    <div className="space-y-4">
      <Separator color="default" />
      <Separator color="primary" />
      <Separator color="secondary" />
      <Separator color="muted" />
      <Separator color="destructive" />
    </div>
  )
}`

function LabelsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Center label (default)
        </p>
        <Separator label="Or continue with" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Start label</p>
        <Separator label="Section 1" labelAlign="start" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">End label</p>
        <Separator label="The End" labelAlign="end" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          With Icon (Left)
        </p>
        <Separator
          label="Favorites"
          labelIcon={<IconStar className="w-3 h-3" />}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          With Icon (Right)
        </p>
        <Separator
          label="Power"
          labelIcon={<IconBolt className="w-3 h-3" />}
          labelIconPosition="right"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Vertical with label
        </p>
        <div className="flex h-24">
          <span className="p-2">Left</span>
          <Separator orientation="vertical" label="VS" />
          <span className="p-2">Right</span>
        </div>
      </div>
    </div>
  )
}

const labelsCode = `import { Separator } from "@/components/ui/separator"
import { IconStar, IconBolt } from "@tabler/icons-react"

export function SeparatorWithLabels() {
  return (
    <div className="space-y-6">
      {/* Center label (default) */}
      <Separator label="Or continue with" />

      {/* Start aligned label */}
      <Separator label="Section 1" labelAlign="start" />

      {/* End aligned label */}
      <Separator label="The End" labelAlign="end" />

      {/* With icon on the left */}
      <Separator
        label="Favorites"
        labelIcon={<IconStar className="w-3 h-3" />}
      />

      {/* With icon on the right */}
      <Separator
        label="Power"
        labelIcon={<IconBolt className="w-3 h-3" />}
        labelIconPosition="right"
      />

      {/* Vertical with label */}
      <div className="flex h-24">
        <span className="p-2">Left</span>
        <Separator orientation="vertical" label="VS" />
        <span className="p-2">Right</span>
      </div>
    </div>
  )
}`

function GradientsDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Fade (Transparent edges)
        </p>
        <Separator lineStyle="gradient" gradient="fade" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Primary Color Gradient
        </p>
        <Separator lineStyle="gradient" gradient="primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Rainbow</p>
        <Separator lineStyle="gradient" gradient="rainbow" />
      </div>
    </div>
  )
}

const gradientsCode = `import { Separator } from "@/components/ui/separator"

export function SeparatorGradients() {
  return (
    <div className="space-y-4">
      {/* Fade gradient - transparent edges */}
      <Separator lineStyle="gradient" gradient="fade" />

      {/* Primary color gradient */}
      <Separator lineStyle="gradient" gradient="primary" />

      {/* Rainbow gradient */}
      <Separator lineStyle="gradient" gradient="rainbow" />
    </div>
  )
}`

function AnimatedDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Pulse</p>
        <Separator animated="pulse" color="primary" />
      </div>
    </div>
  )
}

const animatedCode = `import { Separator } from "@/components/ui/separator"

export function AnimatedSeparator() {
  return (
    <div className="space-y-4">
      {/* Pulse animation */}
      <Separator animated="pulse" color="primary" />
    </div>
  )
}`

// =============================================================================
// Page Component
// =============================================================================

export function SeparatorPage() {
  const features = [
    {
      title: "Multiple Orientations",
      description:
        "Support for both horizontal and vertical separators to divide content in any direction.",
      icon: <IconLine className="h-4 w-4" />,
    },
    {
      title: "Rich Styling",
      description:
        "Various line styles (solid, dashed, dotted), colors, sizes, and gradient options for visual flexibility.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Labels & Icons",
      description:
        "Add descriptive labels with optional icons, positioned at start, center, or end of the separator.",
      icon: <IconSparkles className="h-4 w-4" />,
    },
  ]

  const demoTabs = [
    {
      value: "horizontal",
      label: "Horizontal",
      demo: (
        <DemoWrapper
          title="Horizontal Separator"
          description="Default separator that divides content horizontally."
          code={horizontalCode}
        >
          <HorizontalDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "vertical",
      label: "Vertical",
      demo: (
        <DemoWrapper
          title="Vertical Separator"
          description="Vertical separator for inline content division."
          code={verticalCode}
        >
          <VerticalDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Different thickness options from xs to xl."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "lineStyles",
      label: "Line Styles",
      demo: (
        <DemoWrapper
          title="Line Styles"
          description="Solid, dashed, and dotted line styles."
          code={lineStylesCode}
        >
          <LineStylesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "colors",
      label: "Colors",
      demo: (
        <DemoWrapper
          title="Color Variants"
          description="Semantic color options for different contexts."
          code={colorsCode}
        >
          <ColorsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "labels",
      label: "Labels & Icons",
      demo: (
        <DemoWrapper
          title="With Labels & Icons"
          description="Add descriptive text and icons to separators."
          code={labelsCode}
        >
          <LabelsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "gradients",
      label: "Gradients",
      demo: (
        <DemoWrapper
          title="Gradient Styles"
          description="Gradient separators for visual flair."
          code={gradientsCode}
        >
          <GradientsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "animated",
      label: "Animated",
      demo: (
        <DemoWrapper
          title="Animated Separator"
          description="Separators with animation effects."
          code={animatedCode}
        >
          <AnimatedDemo />
        </DemoWrapper>
      ),
    },
  ]

  const usageCode = `import { Separator } from "@/components/ui/separator"

// Basic horizontal separator
<Separator />

// Vertical separator
<Separator orientation="vertical" />

// With size
<Separator size="lg" />

// With line style
<Separator lineStyle="dashed" />

// With color
<Separator color="primary" />

// With label
<Separator label="Or continue with" />
<Separator label="Section" labelAlign="start" />

// With gradient
<Separator lineStyle="gradient" gradient="primary" />

// Animated
<Separator animated="pulse" color="primary" />`

  const apiSections = [
    {
      title: "Separator",
      props: [
        {
          prop: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "The orientation of the separator.",
        },
        {
          prop: "size",
          type: '"xs" | "sm" | "default" | "md" | "lg" | "xl"',
          default: '"default"',
          description: "The thickness of the separator line.",
        },
        {
          prop: "lineStyle",
          type: '"solid" | "dashed" | "dotted" | "gradient"',
          default: '"solid"',
          description: "The visual style of the separator line.",
        },
        {
          prop: "color",
          type: '"default" | "primary" | "secondary" | "muted" | "destructive" | "success" | "warning" | "info"',
          default: '"default"',
          description: "The color theme of the separator.",
        },
        {
          prop: "gradient",
          type: '"none" | "fade" | "primary" | "rainbow"',
          default: '"none"',
          description: "The gradient style when lineStyle is gradient.",
        },
        {
          prop: "animated",
          type: '"none" | "pulse" | "shimmer"',
          default: '"none"',
          description: "Animation effect applied to the separator.",
        },
        {
          prop: "label",
          type: "React.ReactNode",
          default: "-",
          description: "Text or content to display within the separator.",
        },
        {
          prop: "labelAlign",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: "Alignment of the label within the separator.",
        },
        {
          prop: "labelIcon",
          type: "React.ReactNode",
          default: "-",
          description: "Icon to display alongside the label.",
        },
        {
          prop: "labelIconPosition",
          type: '"left" | "right"',
          default: '"left"',
          description: "Position of the icon relative to the label text.",
        },
        {
          prop: "spacing",
          type: '"none" | "sm" | "default" | "lg"',
          default: "-",
          description: "Vertical/horizontal margin around the separator.",
        },
        {
          prop: "decorative",
          type: "boolean",
          default: "false",
          description: "If true, the separator is purely decorative (aria-hidden).",
        },
      ],
    },
  ]

  return (
    <ComponentPage>
      <PageHeader
        title="Separator"
        description="Visual divider to separate content sections with support for labels, icons, gradients, and animations."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="horizontal" />

      <UsageBlock
        code={usageCode}
        description="Import and use the Separator component with various props."
      />

      <APIReference
        sections={apiSections}
        description="Props and configuration options for the Separator component."
      />
    </ComponentPage>
  )
}
