import * as React from "react"
import { ColorPicker } from "@/components/ui/color-picker"
import { IconPalette, IconClipboard, IconAccessible } from "@tabler/icons-react"
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

function BasicDemo() {
  const [color, setColor] = React.useState<`#${string}`>("#3b82f6")

  return (
    <div className="flex items-center gap-4">
      <ColorPicker
        value={color}
        onValueChange={(value) => setColor(value.hex as `#${string}`)}
      />
      <span className="text-sm font-mono">{color}</span>
    </div>
  )
}

const basicCode = `import { useState } from "react"
import { ColorPicker } from "@/components/ui/color-picker"

export function BasicColorPickerDemo() {
  const [color, setColor] = useState<\`#\${string}\`>("#3b82f6")

  return (
    <div className="flex items-center gap-4">
      <ColorPicker
        value={color}
        onValueChange={(value) => setColor(value.hex as \`#\${string}\`)}
      />
      <span className="text-sm font-mono">{color}</span>
    </div>
  )
}`

function FormatsDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">HEX</p>
        <ColorPicker value="#ef4444" type="hex" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">RGB</p>
        <ColorPicker value="#8b5cf6" type="rgb" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">HSL</p>
        <ColorPicker value="#f59e0b" type="hsl" />
      </div>
    </div>
  )
}

const formatsCode = `import { ColorPicker } from "@/components/ui/color-picker"

// HEX format (default)
<ColorPicker value="#ef4444" type="hex" />

// RGB format
<ColorPicker value="#8b5cf6" type="rgb" />

// HSL format
<ColorPicker value="#f59e0b" type="hsl" />`

function CustomSwatchesDemo() {
  const [color, setColor] = React.useState<`#${string}`>("#22c55e")

  return (
    <ColorPicker
      value={color}
      onValueChange={(value) => setColor(value.hex as `#${string}`)}
      swatches={[
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#14b8a6",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
      ]}
    />
  )
}

const customSwatchesCode = `import { useState } from "react"
import { ColorPicker } from "@/components/ui/color-picker"

export function CustomSwatchesDemo() {
  const [color, setColor] = useState<\`#\${string}\`>("#22c55e")

  return (
    <ColorPicker
      value={color}
      onValueChange={(value) => setColor(value.hex as \`#\${string}\`)}
      swatches={[
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#14b8a6",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
      ]}
    />
  )
}`

function HideSwatchesDemo() {
  return (
    <ColorPicker
      value="#6366f1"
      hideDefaultSwatches
      swatches={["#000000", "#ffffff", "#6366f1", "#ec4899"]}
    />
  )
}

const hideSwatchesCode = `import { ColorPicker } from "@/components/ui/color-picker"

// Use only custom swatches, hide defaults
<ColorPicker
  value="#6366f1"
  hideDefaultSwatches
  swatches={["#000000", "#ffffff", "#6366f1", "#ec4899"]}
/>`

function ContrastDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">With Contrast</p>
        <ColorPicker value="#3b82f6" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Hidden Contrast</p>
        <ColorPicker value="#3b82f6" hideContrastRatio />
      </div>
    </div>
  )
}

const contrastCode = `import { ColorPicker } from "@/components/ui/color-picker"

// Shows WCAG contrast ratio (default)
<ColorPicker value="#3b82f6" />

// Hide contrast ratio display
<ColorPicker value="#3b82f6" hideContrastRatio />`

function DisabledDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker value="#94a3b8" disabled />
    </div>
  )
}

const disabledCode = `import { ColorPicker } from "@/components/ui/color-picker"

<ColorPicker value="#94a3b8" disabled />`

// =============================================================================
// Main Page Component
// =============================================================================

export function ColorPickerPage() {
  const features = [
    {
      title: "Multiple Formats",
      description: "Supports HEX, RGB, and HSL color input and output formats.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Copy to Clipboard",
      description: "Click the copy button to quickly copy the current color value.",
      icon: <IconClipboard className="w-4 h-4 text-primary" />,
    },
    {
      title: "Accessible",
      description: "Full keyboard navigation and WCAG contrast ratio display.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
  ]

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Color Picker"
          description="Click the color swatch to open the picker with default swatches"
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "formats",
      label: "Formats",
      demo: (
        <DemoWrapper
          title="Color Formats"
          description="Toggle between HEX, RGB, and HSL color formats"
          code={formatsCode}
        >
          <FormatsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "custom-swatches",
      label: "Custom Swatches",
      demo: (
        <DemoWrapper
          title="Custom Swatches"
          description="Provide custom preset colors for quick selection"
          code={customSwatchesCode}
        >
          <CustomSwatchesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "hide-swatches",
      label: "Hide Swatches",
      demo: (
        <DemoWrapper
          title="Hide Default Swatches"
          description="Use only your custom swatches by hiding the defaults"
          code={hideSwatchesCode}
        >
          <HideSwatchesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "contrast",
      label: "Contrast",
      demo: (
        <DemoWrapper
          title="Contrast Ratio"
          description="Shows WCAG contrast ratio against white and black backgrounds"
          code={contrastCode}
        >
          <ContrastDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "disabled",
      label: "Disabled",
      demo: (
        <DemoWrapper
          title="Disabled State"
          description="Color picker in disabled state"
          code={disabledCode}
        >
          <DisabledDemo />
        </DemoWrapper>
      ),
    },
  ]

  const usageCode = `import { useState } from "react"
import { ColorPicker } from "@/components/ui/color-picker"

export function ColorPickerExample() {
  const [color, setColor] = useState<\`#\${string}\`>("#3b82f6")

  // Basic usage
  return (
    <ColorPicker
      value={color}
      onValueChange={(value) => setColor(value.hex as \`#\${string}\`)}
    />
  )
}

// With custom swatches
<ColorPicker
  value={color}
  swatches={["#ef4444", "#3b82f6", "#22c55e"]}
  hideDefaultSwatches
/>

// Different format
<ColorPicker value={color} type="rgb" />
<ColorPicker value={color} type="hsl" />

// Hide contrast ratio
<ColorPicker value={color} hideContrastRatio />

// Disabled state
<ColorPicker value={color} disabled />`

  const apiReference = [
    {
      title: "ColorPicker",
      props: [
        { prop: "value", type: "`#${string}`", default: '"#000000"', description: "Current color value as HEX string" },
        { prop: "onValueChange", type: "(value: ColorValue) => void", default: "-", description: "Callback when color changes. Returns ColorValue with hex, rgb, hsl properties" },
        { prop: "type", type: '"hex" | "rgb" | "hsl"', default: '"hex"', description: "Color format to display" },
        { prop: "swatches", type: "`#${string}`[]", default: "-", description: "Custom preset colors to display" },
        { prop: "hideDefaultSwatches", type: "boolean", default: "false", description: "Hide the default color swatches" },
        { prop: "hideContrastRatio", type: "boolean", default: "false", description: "Hide WCAG contrast ratio display" },
        { prop: "disabled", type: "boolean", default: "false", description: "Disable the color picker" },
        { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the root element" },
      ],
    },
  ]

  return (
    <ComponentPage>
      <PageHeader
        title="Color Picker"
        description="A comprehensive color picker with multiple color formats, swatches, eyedropper, and contrast ratio display."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  )
}
