import * as React from "react";
import { Slider, RangeSlider } from "@/components/ui/slider";
import {
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSun,
  IconTemperature,
  IconAdjustments,
  IconAccessible,
  IconPalette,
  IconSettings,
} from "@tabler/icons-react";

import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="max-w-md">
      <Slider defaultValue={50} max={100} step={1} />
    </div>
  );
}

const basicCode = `import { Slider } from "@/components/ui/slider"

export function BasicSliderDemo() {
  return <Slider defaultValue={50} max={100} step={1} />
}`;

function SizesDemo() {
  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Small</p>
        <Slider defaultValue={30} size="sm" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Default</p>
        <Slider defaultValue={50} size="default" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Large</p>
        <Slider defaultValue={70} size="lg" />
      </div>
    </div>
  );
}

const sizesCode = `import { Slider } from "@/components/ui/slider"

export function SizesSliderDemo() {
  return (
    <div className="space-y-6">
      <Slider defaultValue={30} size="sm" />
      <Slider defaultValue={50} size="default" />
      <Slider defaultValue={70} size="lg" />
    </div>
  )
}`;

function MarkersDemo() {
  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Step markers</p>
        <Slider
          defaultValue={50}
          max={100}
          step={10}
          showStepMarkers
          showValue
          label="Zoom Level"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Custom markers</p>
        <Slider
          defaultValue={2}
          max={4}
          step={1}
          markers={[
            { value: 0, label: "Low" },
            { value: 1, label: "Medium" },
            { value: 2, label: "High" },
            { value: 3, label: "Very High" },
            { value: 4, label: "Extreme" },
          ]}
          showValue
          label="Intensity"
        />
      </div>
    </div>
  );
}

const markersCode = `import { Slider } from "@/components/ui/slider"

export function MarkersSliderDemo() {
  return (
    <div className="space-y-6">
      <Slider
        defaultValue={50}
        max={100}
        step={10}
        showStepMarkers
        showValue
        label="Zoom Level"
      />

      <Slider
        defaultValue={2}
        max={4}
        step={1}
        markers={[
          { value: 0, label: "Low" },
          { value: 1, label: "Medium" },
          { value: 2, label: "High" },
          { value: 3, label: "Very High" },
          { value: 4, label: "Extreme" },
        ]}
        showValue
        label="Intensity"
      />
    </div>
  )
}`;

function RangeDemo() {
  const [rangeValue, setRangeValue] = React.useState<[number, number]>([20, 80]);

  return (
    <div className="max-w-md space-y-6">
      <RangeSlider
        value={rangeValue}
        onValueChange={setRangeValue}
        min={0}
        max={100}
        showValue
        label="Price Range"
      />
      <p className="text-sm text-muted-foreground">
        Range: {rangeValue[0]} - {rangeValue[1]}
      </p>

      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-3">With thumb labels</p>
        <RangeSlider
          defaultValue={[20, 80]}
          min={0}
          max={100}
          showValue
          thumbLabels={["Min", "Max"]}
          label="Budget Range"
        />
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-3">With thumb icons</p>
        <RangeSlider
          defaultValue={[30, 70]}
          min={0}
          max={100}
          showValue
          thumbIcons={[<IconVolume size={12} />, <IconVolume3 size={12} />]}
          label="Volume Levels"
        />
      </div>
    </div>
  );
}

const rangeCode = `import { useState } from "react"
import { RangeSlider } from "@/components/ui/slider"
import { IconVolume, IconVolume3 } from "@tabler/icons-react"

export function RangeSliderDemo() {
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80])

  return (
    <div className="space-y-6">
      <RangeSlider
        value={rangeValue}
        onValueChange={setRangeValue}
        min={0}
        max={100}
        showValue
        label="Price Range"
      />

      <RangeSlider
        defaultValue={[20, 80]}
        thumbLabels={["Min", "Max"]}
        showValue
        label="Budget Range"
      />

      <RangeSlider
        defaultValue={[30, 70]}
        thumbIcons={[<IconVolume size={12} />, <IconVolume3 size={12} />]}
        showValue
        label="Volume Levels"
      />
    </div>
  )
}`;

function DisabledDemo() {
  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Error state</p>
        <Slider
          defaultValue={80}
          max={100}
          error="Value exceeds recommended limit"
          label="CPU Usage"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Required field</p>
        <Slider
          defaultValue={50}
          max={100}
          required
          label="Priority Level"
          description="Required field - set a priority"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Disabled</p>
        <Slider
          defaultValue={50}
          max={100}
          disabled
          label="Disabled Slider"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Read-only</p>
        <Slider
          defaultValue={50}
          max={100}
          readOnly
          label="Read-only Value"
        />
      </div>
    </div>
  );
}

const disabledCode = `import { Slider } from "@/components/ui/slider"

export function ValidationSliderDemo() {
  return (
    <div className="space-y-6">
      <Slider
        defaultValue={80}
        max={100}
        error="Value exceeds recommended limit"
        label="CPU Usage"
      />

      <Slider
        defaultValue={50}
        max={100}
        required
        label="Priority Level"
        description="Required field - set a priority"
      />

      <Slider
        defaultValue={50}
        max={100}
        disabled
        label="Disabled Slider"
      />

      <Slider
        defaultValue={50}
        max={100}
        readOnly
        label="Read-only Value"
      />
    </div>
  )
}`;

function StepsDemo() {
  return (
    <div className="max-w-md space-y-4">
      <Slider
        defaultValue={25}
        max={100}
        step={25}
        showValue
        label="Step Slider"
      />
      <p className="text-xs text-muted-foreground">
        Step: 25 (0, 25, 50, 75, 100)
      </p>
    </div>
  );
}

const stepsCode = `import { Slider } from "@/components/ui/slider"

export function StepSliderDemo() {
  return (
    <Slider
      defaultValue={25}
      max={100}
      step={25}
      showValue
      label="Step Slider"
    />
  )
}`;

function AdvancedDemo() {
  const [priceValue, setPriceValue] = React.useState(150);
  const [tempValue, setTempValue] = React.useState(22);

  return (
    <div className="max-w-md bg-muted/50 p-6 rounded-lg space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Currency</p>
        <Slider
          value={priceValue}
          onValueChange={setPriceValue}
          min={0}
          max={1000}
          step={10}
          showValue
          tooltipMode="always"
          formatValue={(v) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(v)
          }
          label="Price"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Thumb icons</p>
        <Slider
          defaultValue={33}
          max={100}
          thumbIcon={<IconVolume2 size={12} />}
          label="Volume"
        />
        <Slider
          defaultValue={66}
          max={100}
          thumbIcon={<IconSun size={12} />}
          label="Brightness"
        />
        <Slider
          defaultValue={50}
          max={100}
          thumbIcon={<IconAdjustments size={12} />}
          label="Settings"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Custom tooltip</p>
        <Slider
          value={tempValue}
          onValueChange={setTempValue}
          min={0}
          max={40}
          showValue
          tooltipMode="always"
          formatValue={(v) => `${v}°C`}
          renderTooltip={(v) => (
            <div className="flex items-center gap-1">
              <IconTemperature size={12} />
              {v}°C
            </div>
          )}
          label="Temperature"
          thumbIcon={<IconTemperature size={12} />}
        />
      </div>
    </div>
  );
}

const advancedCode = `import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { IconVolume2, IconSun, IconAdjustments, IconTemperature } from "@tabler/icons-react"

export function AdvancedSliderDemo() {
  const [priceValue, setPriceValue] = useState(150)
  const [tempValue, setTempValue] = useState(22)

  return (
    <div className="bg-muted/50 p-6 rounded-lg space-y-6">
      <Slider
        value={priceValue}
        onValueChange={setPriceValue}
        min={0}
        max={1000}
        step={10}
        showValue
        tooltipMode="always"
        formatValue={(v) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(v)
        }
        label="Price"
      />

      <Slider
        defaultValue={33}
        max={100}
        thumbIcon={<IconVolume2 size={12} />}
        label="Volume"
      />

      <Slider
        value={tempValue}
        onValueChange={setTempValue}
        min={0}
        max={40}
        showValue
        tooltipMode="always"
        formatValue={(v) => \`\${v}°C\`}
        renderTooltip={(v) => (
          <div className="flex items-center gap-1">
            <IconTemperature size={12} />
            {v}°C
          </div>
        )}
        label="Temperature"
        thumbIcon={<IconTemperature size={12} />}
      />
    </div>
  )
}`;

export default function SliderPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "Full WAI-ARIA support with keyboard navigation, screen reader announcements, and configurable aria-valuetext.",
      icon: <IconAccessible className="h-4 w-4" />,
    },
    {
      title: "Customizable",
      description:
        "Multiple sizes, color variants, custom formatting, markers, tooltips, and thumb icons for any use case.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Flexible",
      description:
        "Single and range sliders, controlled/uncontrolled modes, validation states, RTL support, and value commit events.",
      icon: <IconSettings className="h-4 w-4" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Slider"
          description="Simple slider for selecting a single value within a range."
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
          description="Small, default, and large slider sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "markers",
      label: "With Marks",
      demo: (
        <DemoWrapper
          title="Markers and Tick Marks"
          description="Auto-generated step markers or custom labeled markers."
          code={markersCode}
        >
          <MarkersDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "range",
      label: "Range",
      demo: (
        <DemoWrapper
          title="Range Slider"
          description="Select a range between two values with optional thumb labels and icons."
          code={rangeCode}
        >
          <RangeDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "disabled",
      label: "Disabled",
      demo: (
        <DemoWrapper
          title="Validation States"
          description="Error, required, disabled, and read-only states."
          code={disabledCode}
        >
          <DisabledDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "steps",
      label: "Steps",
      demo: (
        <DemoWrapper
          title="With Steps"
          description="Slider with discrete step values."
          code={stepsCode}
        >
          <StepsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "advanced",
      label: "Advanced",
      demo: (
        <DemoWrapper
          title="Advanced Features"
          description="Custom formatting, tooltips, thumb icons, and more."
          code={advancedCode}
        >
          <AdvancedDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Arrow Left/Down", description: "Decrease by step" },
    { keys: "Arrow Right/Up", description: "Increase by step" },
    { keys: "Page Up", description: "Increase by large step (10x)" },
    { keys: "Page Down", description: "Decrease by large step (10x)" },
    { keys: "Home", description: "Jump to minimum" },
    { keys: "End", description: "Jump to maximum" },
  ];

  const usageCode = `import { Slider, RangeSlider } from "@/components/ui/slider"

// Basic slider
<Slider defaultValue={50} max={100} />

// With size
<Slider defaultValue={50} size="lg" />

// With markers
<Slider
  defaultValue={50}
  max={100}
  step={10}
  showStepMarkers
  showValue
/>

// Range slider
<RangeSlider
  defaultValue={[20, 80]}
  min={0}
  max={100}
  showValue
/>

// With validation
<Slider
  defaultValue={80}
  max={100}
  error="Value too high"
  label="Usage"
/>

// With steps
<Slider
  defaultValue={25}
  max={100}
  step={25}
  showValue
/>`;

  const apiSections = [
    {
      title: "Slider",
      props: [
        {
          prop: "value",
          type: "number",
          description: "Controlled value of the slider.",
        },
        {
          prop: "defaultValue",
          type: "number",
          default: "0",
          description: "Initial value for uncontrolled mode.",
        },
        {
          prop: "onValueChange",
          type: "(value: number) => void",
          description: "Callback fired on every value change during drag.",
        },
        {
          prop: "onValueCommitted",
          type: "(value: number) => void",
          description: "Callback fired only when pointer is released.",
        },
        {
          prop: "min",
          type: "number",
          default: "0",
          description: "Minimum value of the slider.",
        },
        {
          prop: "max",
          type: "number",
          default: "100",
          description: "Maximum value of the slider.",
        },
        {
          prop: "step",
          type: "number",
          default: "1",
          description: "Step increment for the slider.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size variant of the slider.",
        },
        {
          prop: "variant",
          type: '"default" | "info" | "success" | "warning" | "destructive"',
          default: '"default"',
          description: "Color variant of the slider track.",
        },
        {
          prop: "label",
          type: "string",
          description: "Label text displayed above the slider.",
        },
        {
          prop: "description",
          type: "string",
          description: "Helper text displayed below the slider.",
        },
        {
          prop: "error",
          type: "string",
          description: "Error message that puts slider in error state.",
        },
        {
          prop: "required",
          type: "boolean",
          default: "false",
          description: "Marks the field as required.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the slider.",
        },
        {
          prop: "readOnly",
          type: "boolean",
          default: "false",
          description: "Makes the slider read-only.",
        },
        {
          prop: "showValue",
          type: "boolean",
          default: "false",
          description: "Shows the current value next to the label.",
        },
        {
          prop: "formatValue",
          type: "(value: number) => string",
          description: "Custom formatter for displayed values.",
        },
        {
          prop: "getValueText",
          type: "(value: number) => string",
          description: "Custom aria-valuetext for screen readers.",
        },
        {
          prop: "tooltipMode",
          type: '"always" | "hover" | "on-drag" | "never"',
          default: '"never"',
          description: "When to show the tooltip.",
        },
        {
          prop: "tooltipPosition",
          type: '"top" | "bottom"',
          default: '"top"',
          description: "Position of the tooltip relative to thumb.",
        },
        {
          prop: "renderTooltip",
          type: "(value: number) => ReactNode",
          description: "Custom tooltip content renderer.",
        },
        {
          prop: "thumbIcon",
          type: "ReactNode",
          description: "Icon to display inside the thumb.",
        },
        {
          prop: "showStepMarkers",
          type: "boolean",
          default: "false",
          description: "Show auto-generated markers at each step.",
        },
        {
          prop: "markers",
          type: "Array<{ value: number; label?: string }>",
          description: "Custom markers with optional labels.",
        },
        {
          prop: "dir",
          type: '"ltr" | "rtl"',
          default: '"ltr"',
          description: "Text direction for RTL support.",
        },
      ],
    },
    {
      title: "RangeSlider",
      props: [
        {
          prop: "value",
          type: "[number, number]",
          description: "Controlled value as [min, max] tuple.",
        },
        {
          prop: "defaultValue",
          type: "[number, number]",
          default: "[0, 100]",
          description: "Initial value for uncontrolled mode.",
        },
        {
          prop: "onValueChange",
          type: "(value: [number, number]) => void",
          description: "Callback fired on value change.",
        },
        {
          prop: "thumbLabels",
          type: "[string, string]",
          description: "Labels for the min and max thumbs.",
        },
        {
          prop: "thumbIcons",
          type: "[ReactNode, ReactNode]",
          description: "Icons for the min and max thumbs.",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Slider"
        version="v1.0"
        description="An enhanced input component for selecting values within a range, featuring accessibility, animations, and customization options."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Common usage patterns for Slider and RangeSlider components."
      />

      <APIReference sections={apiSections} />
    </ComponentPage>
  );
}
