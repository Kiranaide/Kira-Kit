import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
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
  Slider,
  RangeSlider,
  KiraSlider,
  KiraRangeSlider,
} from "@/components/ui/slider";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="w-full max-w-md">
      <Slider label="Volume" defaultValue={50} max={100} step={1} />
    </div>
  );
}

const basicCode = `import { Slider } from "@/components/ui/slider";

export function BasicSliderDemo() {
  return (
    <div className="w-full max-w-md">
      <Slider label="Volume" defaultValue={50} max={100} step={1} />
    </div>
  );
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

const sizesCode = `import { Slider } from "@/components/ui/slider";

export function SizesSliderDemo() {
  return (
    <div className="space-y-6">
      <Slider defaultValue={30} size="sm" />
      <Slider defaultValue={50} size="default" />
      <Slider defaultValue={70} size="lg" />
    </div>
  );
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

const markersCode = `import { Slider } from "@/components/ui/slider";

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
  );
}`;

function RangeDemo() {
  const [rangeValue, setRangeValue] = React.useState<[number, number]>([
    20, 80,
  ]);

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
          thumbIcons={[
            <IconVolume key="lo" size={12} />,
            <IconVolume3 key="hi" size={12} />,
          ]}
          label="Volume Levels"
        />
      </div>
    </div>
  );
}

const rangeCode = `import * as React from "react";
import { RangeSlider } from "@/components/ui/slider";
import { IconVolume, IconVolume3 } from "@tabler/icons-react";

export function RangeSliderDemo() {
  const [rangeValue, setRangeValue] = React.useState<[number, number]>([20, 80]);

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
        min={0}
        max={100}
        thumbLabels={["Min", "Max"]}
        showValue
        label="Budget Range"
      />
      <RangeSlider
        defaultValue={[30, 70]}
        min={0}
        max={100}
        thumbIcons={[<IconVolume size={12} />, <IconVolume3 size={12} />]}
        showValue
        label="Volume Levels"
      />
    </div>
  );
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

const stepsCode = `import { Slider } from "@/components/ui/slider";

export function StepSliderDemo() {
  return (
    <Slider
      defaultValue={25}
      max={100}
      step={25}
      showValue
      label="Step Slider"
    />
  );
}`;

function FeaturesDemo() {
  return (
    <div className="w-full max-w-md">
      <Slider
        label="Sparse stops"
        defaultValue={10}
        stepOptions={[0, 10, 40, 90, 100]}
        showValue
      />
    </div>
  );
}

const featuresCode = `import { Slider } from "@/components/ui/slider";

export function SparseStopsDemo() {
  return (
    <div className="w-full max-w-md">
      <Slider
        label="Sparse stops"
        defaultValue={10}
        stepOptions={[0, 10, 40, 90, 100]}
        showValue
      />
    </div>
  );
}`;

function KiraSliderDemo() {
  return (
    <div className="w-full max-w-md space-y-6">
      <KiraSlider label="Playback volume" defaultValue={40} showValue />
      <KiraSlider
        label="Locked track volume"
        defaultValue={60}
        disabled
        disabledReason="Unlock the track to adjust its volume."
        showValue
      />
    </div>
  );
}

const kiraSliderCode = `import { KiraSlider } from "@/components/ui/slider";

export function KiraSliderDemo() {
  return (
    <div className="w-full max-w-md space-y-6">
      <KiraSlider label="Playback volume" defaultValue={40} showValue />
      <KiraSlider
        label="Locked track volume"
        defaultValue={60}
        disabled
        disabledReason="Unlock the track to adjust its volume."
        showValue
      />
    </div>
  );
}`;

function NumericRangeDemo() {
  const [committed, setCommitted] = React.useState<[number, number]>([10, 90]);

  return (
    <div className="w-full max-w-md space-y-3">
      <KiraRangeSlider
        label="Budget"
        defaultValue={[10, 90]}
        stepOptions={[0, 10, 40, 90, 100]}
        onValueCommitted={setCommitted}
      />
      <p className="text-sm text-muted-foreground">
        Committed: {committed.join(" – ")}. Number edits commit immediately.
      </p>
    </div>
  );
}

const numericRangeCode = `import * as React from "react";
import { KiraRangeSlider } from "@/components/ui/slider";

export function NumericRangeDemo() {
  const [committed, setCommitted] = React.useState<[number, number]>([10, 90]);

  return (
    <div className="w-full max-w-md space-y-3">
      <KiraRangeSlider
        label="Budget"
        defaultValue={[10, 90]}
        stepOptions={[0, 10, 40, 90, 100]}
        onValueCommitted={setCommitted}
      />
      <p className="text-sm text-muted-foreground">
        Committed: {committed.join(" – ")}. Number edits commit immediately.
      </p>
    </div>
  );
}`;

function InvertedDemo() {
  return (
    <div className="w-full max-w-md">
      <RangeSlider
        label="Inverted budget"
        inverted
        defaultValue={[20, 80]}
        tooltipMode="always"
        showValue
        variant="gradient"
      />
    </div>
  );
}

const invertedCode = `import { RangeSlider } from "@/components/ui/slider";

export function InvertedDemo() {
  return (
    <div className="w-full max-w-md">
      <RangeSlider
        label="Inverted budget"
        inverted
        defaultValue={[20, 80]}
        tooltipMode="always"
        showValue
        variant="gradient"
      />
    </div>
  );
}`;

function VerticalDemo() {
  return (
    <Slider
      label="Vertical volume"
      orientation="vertical"
      defaultValue={40}
      showValue
    />
  );
}

const verticalCode = `import { Slider } from "@/components/ui/slider";

export function VerticalDemo() {
  return (
    <Slider
      label="Vertical volume"
      orientation="vertical"
      defaultValue={40}
      showValue
    />
  );
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

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Thumb icons</p>
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

const advancedCode = `import * as React from "react";
import { Slider } from "@/components/ui/slider";
import {
  IconVolume2,
  IconSun,
  IconAdjustments,
  IconTemperature,
} from "@tabler/icons-react";

export function AdvancedSliderDemo() {
  const [priceValue, setPriceValue] = React.useState(150);
  const [tempValue, setTempValue] = React.useState(22);

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
      <Slider defaultValue={33} max={100} thumbIcon={<IconVolume2 size={12} />} label="Volume" />
      <Slider defaultValue={66} max={100} thumbIcon={<IconSun size={12} />} label="Brightness" />
      <Slider defaultValue={50} max={100} thumbIcon={<IconAdjustments size={12} />} label="Settings" />
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
  );
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
        <Slider defaultValue={50} max={100} disabled label="Disabled Slider" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Read-only</p>
        <Slider defaultValue={50} max={100} readOnly label="Read-only Value" />
      </div>
    </div>
  );
}

const disabledCode = `import { Slider } from "@/components/ui/slider";

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
      <Slider defaultValue={50} max={100} disabled label="Disabled Slider" />
      <Slider defaultValue={50} max={100} readOnly label="Read-only Value" />
    </div>
  );
}`;

function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-6">
      <Slider
        label="A very long multilingual setting label 音量調整 with an unbreakable_identifier_abcdefghijklmnopqrstuvwxyz"
        defaultValue={0}
        showValue
      />
      <KiraRangeSlider
        label="Read-only budget"
        defaultValue={[20, 80]}
        readOnly
      />
      <KiraRangeSlider
        label="Empty stops fallback"
        stepOptions={[]}
        defaultValue={[0, 100]}
      />
      <KiraSlider
        label="Restricted setting"
        defaultValue={50}
        disabled
        disabledReason="Ask the workspace owner to unlock this setting."
      />
    </div>
  );
}

const stressCode = `import { Slider, KiraSlider, KiraRangeSlider } from "@/components/ui/slider";

export function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-6">
      <Slider
        label="A very long multilingual setting label 音量調整 with an unbreakable_identifier_abcdefghijklmnopqrstuvwxyz"
        defaultValue={0}
        showValue
      />
      <KiraRangeSlider label="Read-only budget" defaultValue={[20, 80]} readOnly />
      <KiraRangeSlider
        label="Empty stops fallback"
        stepOptions={[]}
        defaultValue={[0, 100]}
      />
      <KiraSlider
        label="Restricted setting"
        defaultValue={50}
        disabled
        disabledReason="Ask the workspace owner to unlock this setting."
      />
    </div>
  );
}`;

const usageCode = `import {
  Slider,
  RangeSlider,
  KiraSlider,
  KiraRangeSlider,
} from "@/components/ui/slider";

export function SliderUsage() {
  return (
    <div className="space-y-6">
      <Slider label="Volume" defaultValue={40} showValue />
      <RangeSlider label="Window" defaultValue={[20, 80]} showValue />
      <KiraSlider
        label="Locked volume"
        disabled
        disabledReason="Unlock the track to edit volume."
      />
      <KiraRangeSlider
        label="Budget"
        defaultValue={[10, 90]}
        stepOptions={[0, 10, 40, 90, 100]}
        onValueCommitted={(values) => console.log(values)}
      />
    </div>
  );
}`;

export default function SliderPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Slider"
        version="v2.0.1"
        description="An enhanced input component for selecting values within a range, featuring accessibility, animations, and customization options."
      />
      <FeatureGrid
        features={sliderPageFeatures}
        description="Capabilities built into Kira Kit Slider."
      />
      <DemoTabs tabs={sliderPageDemoTabs} defaultValue="basic" />
      <KeyboardShortcuts
        shortcuts={sliderPageShortcuts}
        description="Keyboard navigation and value adjustment bindings."
      />
      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns for Slider, RangeSlider, KiraSlider, and KiraRangeSlider."
        notes={[
          {
            label: "KiraSlider & KiraRangeSlider",
            body: "Use KiraSlider when a disabled slider needs a keyboard-reachable tooltip reason, and KiraRangeSlider for paired From/To numeric inputs.",
          },
          {
            label: "sliderVariants",
            body: "Exported CVA helper for size and color variant styling.",
          },
        ]}
      />
      <APIReference
        sections={sliderPageAPISections}
        description="Props, types, and defaults for each exported slider component."
      />
      <Changelog
        entries={sliderPageChangelogEntries}
        title="Changelog"
        description="Version history for Slider."
      />
    </ComponentPage>
  );
}

const sliderPageFeatures = [
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
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const sliderPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    value: "steps",
    label: "Steps",
    group: "Core",
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
    value: "kira",
    label: "Kira Slider",
    group: "KiraSlider",
    demo: (
      <DemoWrapper
        title="Kira Slider"
        description="A labelled slider with a keyboard-reachable explanation when disabled."
        code={kiraSliderCode}
      >
        <KiraSliderDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "numeric",
    label: "Kira Range",
    group: "KiraSlider",
    demo: (
      <DemoWrapper
        title="From / To alternatives"
        description="Edit the range without dragging. Sparse-stop arrows, non-crossing values and immediate commits."
        code={numericRangeCode}
      >
        <NumericRangeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "features",
    label: "Sparse Stops",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Sparse stops"
        description="Arrows advance to the adjacent allowed value without changing raw-value spacing."
        code={featuresCode}
      >
        <FeaturesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "inverted",
    label: "Inverted",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Inverted range"
        description="The high value starts on the left; bubble text still matches each thumb."
        code={invertedCode}
      >
        <InvertedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "vertical",
    label: "Vertical",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Vertical slider"
        description="Native orientation semantics and keyboard operation."
        code={verticalCode}
      >
        <VerticalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "advanced",
    label: "Advanced",
    group: "Behavior",
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
  {
    value: "disabled",
    label: "Validation",
    group: "Behavior",
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
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, zero, full range, read-only inputs, disabled reasons, and empty stops in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const sliderPageShortcuts = [
  {
    keys: "Arrow keys",
    description:
      "Inherited from Base UI: move by step (orientation/direction aware). Kira sparse stops advance to adjacent allowed values; inversion reverses the visual scale.",
  },
  {
    keys: "Page Up / Page Down",
    description:
      "Inherited from Base UI: move by largeStep. Sparse stops advance to adjacent allowed values.",
  },
  {
    keys: "Home / End",
    description:
      "Inherited from Base UI: jump to track bounds, constrained to allowed stops and the sibling thumb.",
  },
  {
    keys: "Arrow Up / Arrow Down (number fields)",
    description:
      "Kira sparse numeric alternative: advance between stops without crossing; edits commit immediately.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const sliderPageAPISections = [
  {
    title: "Slider",
    props: [
      {
        prop: "value",
        type: "number",
        default: "-",
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
        default: "-",
        description: "Callback fired on every value change during drag.",
      },
      {
        prop: "onValueCommitted",
        type: "(value: number) => void",
        default: "-",
        description:
          "Callback for committed pointer or keyboard changes; KiraRangeSlider number edits commit immediately.",
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
        prop: "stepOptions",
        type: "number[]",
        default: "-",
        description:
          "Discrete allowed stops; arrow navigation advances between adjacent stops.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Track orientation.",
      },
      {
        prop: "inverted",
        type: "boolean",
        default: "false",
        description: "Reverses the visual value scale.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size variant of the slider.",
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive" | "gradient"',
        default: '"default"',
        description: "Color variant of the slider track.",
      },
      {
        prop: "label",
        type: "string",
        default: "-",
        description: "Label text displayed above the slider.",
      },
      {
        prop: "description",
        type: "string",
        default: "-",
        description: "Helper text displayed below the slider.",
      },
      {
        prop: "error",
        type: "string",
        default: "-",
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
        default: "String",
        description: "Custom formatter for displayed values.",
      },
      {
        prop: "getValueText",
        type: "(value: number) => string",
        default: "String",
        description: "Custom aria-valuetext for screen readers.",
      },
      {
        prop: "tooltipMode",
        type: '"always" | "hover" | "on-drag" | "never"',
        default: '"on-drag"',
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
        default: "-",
        description: "Custom tooltip content renderer.",
      },
      {
        prop: "thumbLabel",
        type: "string",
        default: "-",
        description: "Short text displayed inside the thumb.",
      },
      {
        prop: "thumbIcon",
        type: "ReactNode",
        default: "-",
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
        type: "SliderMarker[]",
        default: "-",
        description: "Custom markers with optional labels.",
      },
    ],
  },
  {
    title: "RangeSlider",
    props: [
      {
        prop: "value",
        type: "[number, number]",
        default: "-",
        description: "Controlled value as [min, max] tuple.",
      },
      {
        prop: "defaultValue",
        type: "[number, number]",
        default: "[25, 75]",
        description: "Initial value for uncontrolled mode.",
      },
      {
        prop: "onValueChange",
        type: "(value: [number, number]) => void",
        default: "-",
        description: "Callback fired on value change.",
      },
      {
        prop: "onValueCommitted",
        type: "(value: [number, number]) => void",
        default: "-",
        description: "Callback fired when a drag or keyboard change commits.",
      },
      {
        prop: "thumbLabels",
        type: "[string, string]",
        default: "-",
        description: "Labels for the min and max thumbs.",
      },
      {
        prop: "thumbIcons",
        type: "[ReactNode, ReactNode]",
        default: "-",
        description: "Icons for the min and max thumbs.",
      },
    ],
  },
  {
    title: "KiraSlider",
    props: [
      {
        prop: "...SliderProps",
        type: "SliderProps",
        default: "-",
        description: "Accepts all Slider props.",
      },
      {
        prop: "disabledReason",
        type: "string",
        default: "-",
        description:
          "Keyboard-reachable tooltip explanation shown when disabled is true.",
      },
    ],
  },
  {
    title: "KiraRangeSlider",
    props: [
      {
        prop: "...RangeSliderProps",
        type: "RangeSliderProps",
        default: "-",
        description: "Accepts all RangeSlider props.",
      },
      {
        prop: "disabledReason",
        type: "string",
        default: "-",
        description:
          "Keyboard-reachable tooltip explanation shown when disabled is true.",
      },
      {
        prop: "showInputs",
        type: "boolean",
        default: "true",
        description:
          "Paired From/To numeric inputs under the track; honors bounds, stops, and readOnly.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const sliderPageChangelogEntries = [
  {
    version: "2.0.1",
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
    version: "2.0.0",
    date: "31 October 2026",
    changes: [
      {
        type: "added",
        title: "Kira range numeric inputs and reachable disabled reasons",
      },
      {
        type: "fixed",
        title:
          "Sparse-stop keyboard navigation, read-only input enforcement and reduced motion",
      },
      {
        type: "breaking",
        title:
          "Commit no longer sends a duplicate onValueChange; range thumbs default to non-crossing",
      },
      {
        type: "changed",
        title:
          "Continuous dragging keeps direct pointer tracking; no GSAP commit animation",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
