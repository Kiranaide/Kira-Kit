import * as React from "react";
import { Slider, RangeSlider } from "@/components/ui/slider";
import {
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSun,
  IconTemperature,
  IconCurrencyDollar,
  IconAdjustments,
} from "@tabler/icons-react";

export function SliderPage() {
  const [value, setValue] = React.useState(50);
  const [rangeValue, setRangeValue] = React.useState<[number, number]>([
    20, 80,
  ]);
  const [priceValue, setPriceValue] = React.useState(150);
  const [tempValue, setTempValue] = React.useState(22);
  const [committedValue, setCommittedValue] = React.useState(50);

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Slider</h1>
        <p className="text-muted-foreground">
          An enhanced input component for selecting values within a range,
          featuring accessibility, animations, and customization options.
        </p>
      </header>

      {/* Basic Slider */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Slider
        </h2>
        <div className="max-w-md">
          <Slider defaultValue={50} max={100} step={1} />
        </div>
      </section>

      {/* Controlled with Value Display */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Controlled with Value Display
        </h2>
        <div className="max-w-md">
          <Slider
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
            showValue
            label="Volume"
          />
        </div>
        <p className="text-sm text-muted-foreground">Current value: {value}</p>
      </section>

      {/* Enhanced Tooltip System */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Enhanced Tooltip System
        </h2>
        <div className="max-w-md space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Always visible</p>
            <Slider
              defaultValue={50}
              max={100}
              tooltipMode="always"
              tooltipPosition="top"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">On hover</p>
            <Slider defaultValue={50} max={100} tooltipMode="hover" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">On drag</p>
            <Slider defaultValue={50} max={100} tooltipMode="on-drag" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Custom tooltip position (bottom)
            </p>
            <Slider
              defaultValue={50}
              max={100}
              tooltipMode="always"
              tooltipPosition="bottom"
            />
          </div>
        </div>
      </section>

      {/* Custom Formatting */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Value Formatting
        </h2>
        <div className="max-w-md space-y-6">
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
            <p className="text-sm text-muted-foreground mb-3">Percentage</p>
            <Slider
              defaultValue={75}
              max={100}
              showValue
              tooltipMode="always"
              formatValue={(v) => `${v}%`}
              label="Discount"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Temperature</p>
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
      </section>

      {/* Markers */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Markers and Tick Marks
        </h2>
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
      </section>

      {/* Range Slider */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Range Slider
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a range between two values.
        </p>
        <div className="max-w-md">
          <RangeSlider
            value={rangeValue}
            onValueChange={setRangeValue}
            min={0}
            max={100}
            showValue
            label="Price Range"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Range: {rangeValue[0]} - {rangeValue[1]}
        </p>
      </section>

      {/* Range Slider with Thumb Labels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Range Slider with Thumb Labels
        </h2>
        <div className="max-w-md">
          <RangeSlider
            defaultValue={[20, 80]}
            min={0}
            max={100}
            showValue
            thumbLabels={["Min", "Max"]}
            label="Budget Range"
          />
        </div>
      </section>

      {/* Range Slider with Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Range Slider with Thumb Icons
        </h2>
        <div className="max-w-md">
          <RangeSlider
            defaultValue={[30, 70]}
            min={0}
            max={100}
            showValue
            thumbIcons={[<IconVolume size={12} />, <IconVolume3 size={12} />]}
            label="Volume Levels"
          />
        </div>
      </section>

      {/* Validation States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Validation States
        </h2>
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
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Accessibility Features
        </h2>
        <div className="max-w-md space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              With aria-valuetext for screen readers
            </p>
            <Slider
              defaultValue={50}
              max={100}
              label="Volume"
              getValueText={(v) => `Volume level ${v} percent`}
              description="Use arrow keys to adjust volume by 5%"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Keyboard shortcuts:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Arrow Left/Down: Decrease by step</li>
              <li>Arrow Right/Up: Increase by step</li>
              <li>Page Up: Increase by large step (10x)</li>
              <li>Page Down: Decrease by large step (10x)</li>
              <li>Home: Jump to minimum</li>
              <li>End: Jump to maximum</li>
            </ul>
          </div>
        </div>
      </section>

      {/* onValueCommitted */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Value Committed Event
        </h2>
        <p className="text-sm text-muted-foreground">
          onValueCommitted fires only when the user releases the thumb (on
          pointer up).
        </p>
        <div className="max-w-md">
          <Slider
            defaultValue={50}
            max={100}
            onValueCommitted={setCommittedValue}
            showValue
            label="Committed Value"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Last committed value: {committedValue}
        </p>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
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
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
        <div className="max-w-md space-y-4">
          <Slider defaultValue={60} variant="default" label="Default" />
          <Slider defaultValue={60} variant="info" label="Info" />
          <Slider defaultValue={60} variant="success" label="Success" />
          <Slider defaultValue={60} variant="warning" label="Warning" />
          <Slider defaultValue={60} variant="destructive" label="Destructive" />
        </div>
      </section>

      {/* RTL Support */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          RTL Support
        </h2>
        <div className="max-w-md">
          <Slider
            defaultValue={70}
            max={100}
            dir="rtl"
            showValue
            label="RTL Slider"
          />
        </div>
      </section>

      {/* With Steps */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Steps
        </h2>
        <div className="max-w-md">
          <Slider
            defaultValue={25}
            max={100}
            step={25}
            showValue
            label="Step Slider"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Step: 25 (0, 25, 50, 75, 100)
          </p>
        </div>
      </section>

      {/* Thumb Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Thumb Icons
        </h2>
        <div className="max-w-md space-y-4">
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
      </section>

      {/* Advanced Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Advanced Example: Price Filter
        </h2>
        <div className="max-w-md space-y-4 bg-muted/50 p-6 rounded-lg">
          <RangeSlider
            defaultValue={[100, 500]}
            min={0}
            max={1000}
            step={10}
            showValue
            thumbLabels={["Min", "Max"]}
            formatValue={(v) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(v)
            }
            label="Price Range"
            required
            tooltipMode="always"
            markers={[
              { value: 0, label: "$0" },
              { value: 250, label: "$250" },
              { value: 500, label: "$500" },
              { value: 750, label: "$750" },
              { value: 1000, label: "$1k" },
            ]}
            thumbIcons={[
              <IconCurrencyDollar size={10} />,
              <IconCurrencyDollar size={10} />,
            ]}
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs">
          <pre className="text-foreground">
            {`import { Slider, RangeSlider } from "@/components/ui/slider"

// Basic slider
<Slider defaultValue={50} max={100} />

// Controlled with custom formatting
<Slider
  value={priceValue}
  onValueChange={setPriceValue}
  min={0}
  max={1000}
  formatValue={(v) => \`$\${v}\`}
  showValue
/>

// With accessibility
<Slider
  defaultValue={50}
  label="Volume"
  getValueText={(v) => \`Volume level \${v} percent\`}
  required
/>

// With markers
<Slider
  defaultValue={2}
  markers={[
    { value: 0, label: "Low" },
    { value: 1, label: "Medium" },
    { value: 2, label: "High" },
  ]}
  showValue
/>

// With validation
<Slider
  defaultValue={80}
  error="Value too high"
  label="Usage"
/>

// Range slider
<RangeSlider
  value={rangeValue}
  onValueChange={setRangeValue}
  min={0}
  max={100}
  thumbLabels={["Min", "Max"]}
  showValue
/>

// Tooltip modes
<Slider
  defaultValue={50}
  tooltipMode="always" | "hover" | "on-drag" | "never"
  tooltipPosition="top" | "bottom"
/>

// Value committed event
<Slider
  defaultValue={50}
  onValueChange={handleValueChange}     // During drag
  onValueCommitted={handleCommit}        // On pointer up
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
