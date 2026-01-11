import * as React from "react";
import { ColorPicker } from "@/components/ui/color-picker";

export function ColorPickerPage() {
  const [color1, setColor1] = React.useState<`#${string}`>("#3b82f6");
  const [color2, setColor2] = React.useState<`#${string}`>("#22c55e");

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Color Picker</h1>
        <p className="text-muted-foreground">
          A comprehensive color picker with multiple color formats, swatches,
          eyedropper, and contrast ratio display.
        </p>
      </header>

      {/* Basic Color Picker */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Color Picker
        </h2>
        <p className="text-sm text-muted-foreground">
          Click the color swatch to open the picker.
        </p>
        <div className="flex items-center gap-4">
          <ColorPicker
            value={color1}
            onValueChange={(value) => setColor1(value.hex as `#${string}`)}
          />
          <span className="text-sm font-mono">{color1}</span>
        </div>
      </section>

      {/* Color Formats */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Formats
        </h2>
        <p className="text-sm text-muted-foreground">
          Toggle between HEX, RGB, and HSL color formats.
        </p>
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
      </section>

      {/* Custom Swatches */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Swatches
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide custom preset colors for quick selection.
        </p>
        <ColorPicker
          value={color2}
          onValueChange={(value) => setColor2(value.hex as `#${string}`)}
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
      </section>

      {/* Without Default Swatches */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Hide Default Swatches
        </h2>
        <p className="text-sm text-muted-foreground">
          Use only your custom swatches by hiding the defaults.
        </p>
        <ColorPicker
          value="#6366f1"
          hideDefaultSwatches
          swatches={["#000000", "#ffffff", "#6366f1", "#ec4899"]}
        />
      </section>

      {/* Contrast Ratio */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Contrast Ratio
        </h2>
        <p className="text-sm text-muted-foreground">
          Shows WCAG contrast ratio against white and black backgrounds.
        </p>
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              With Contrast
            </p>
            <ColorPicker value="#3b82f6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Hidden Contrast
            </p>
            <ColorPicker value="#3b82f6" hideContrastRatio />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Eyedropper Tool</strong> - Pick colors from anywhere on
            screen (Chrome/Edge 95+)
          </li>
          <li>
            <strong>Copy to Clipboard</strong> - Click copy button to copy
            current color value
          </li>
          <li>
            <strong>Recent Colors</strong> - Automatically tracks last 8
            selected colors
          </li>
          <li>
            <strong>Contrast Ratio</strong> - WCAG AA/AAA compliance indicators
          </li>
          <li>
            <strong>Multiple Formats</strong> - HEX, RGB, HSL input and output
          </li>
        </ul>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled State
        </h2>
        <ColorPicker value="#94a3b8" disabled />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { ColorPicker } from "@/components/ui/color-picker"

// Basic
<ColorPicker
  value={color}
  onValueChange={(value) => setColor(value.hex)}
/>

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
<ColorPicker value={color} hideContrastRatio />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
