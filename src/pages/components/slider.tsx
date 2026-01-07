import * as React from "react";
import { Slider, RangeSlider } from "@/components/ui/slider";

export function SliderPage() {
  const [value, setValue] = React.useState(50);
  const [rangeValue, setRangeValue] = React.useState<[number, number]>([
    20, 80,
  ]);

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Slider</h1>
        <p className="text-muted-foreground">
          An input where the user selects a value from within a given range.
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

      {/* Controlled */}
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
          />
        </div>
      </section>

      {/* With Tooltip */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Tooltip on Drag
        </h2>
        <p className="text-sm text-muted-foreground">
          Drag the slider to see the tooltip appear.
        </p>
        <div className="max-w-md">
          <Slider defaultValue={50} max={100} showTooltip />
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
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Range: {rangeValue[0]} - {rangeValue[1]}
        </p>
      </section>

      {/* Range Slider with Tooltip */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Range Slider with Tooltip
        </h2>
        <div className="max-w-md">
          <RangeSlider
            defaultValue={[30, 70]}
            min={0}
            max={100}
            showTooltip
            formatValue={(v) => `$${v}`}
          />
        </div>
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
          <Slider defaultValue={60} variant="default" />
          <Slider defaultValue={60} variant="info" />
          <Slider defaultValue={60} variant="success" />
          <Slider defaultValue={60} variant="warning" />
          <Slider defaultValue={60} variant="destructive" />
        </div>
      </section>

      {/* With Steps */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Steps
        </h2>
        <div className="max-w-md">
          <Slider defaultValue={25} max={100} step={25} showValue />
          <p className="text-xs text-muted-foreground mt-2">
            Step: 25 (0, 25, 50, 75, 100)
          </p>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Slider } from "@/components/ui/slider"

{/* Basic */}
<Slider defaultValue={50} max={100} step={1} />

{/* Controlled with value display */}
<Slider
  value={value}
  onValueChange={setValue}
  max={100}
  showValue
/>

{/* Variants */}
<Slider defaultValue={60} variant="success" size="lg" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
