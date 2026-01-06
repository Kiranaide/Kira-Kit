import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NumericInput, InputWithAffix } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  IconCurrencyDollar,
  IconPercentage,
  IconAt,
  IconSearch,
} from "@tabler/icons-react";

export function InputPage() {
  const [numericValue, setNumericValue] = React.useState(5);
  const [color, setColor] = React.useState("#3b82f6");

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Input</h1>
        <p className="text-muted-foreground">
          Various input components for forms and data entry.
        </p>
      </header>

      {/* Basic Input */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Input
        </h2>
        <div className="max-w-sm space-y-3">
          <Input placeholder="Enter text..." />
          <Input type="email" placeholder="Email address" />
          <Input type="password" placeholder="Password" />
        </div>
      </section>

      {/* Textarea */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Textarea
        </h2>
        <div className="max-w-sm space-y-3">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-textarea">Disabled</Label>
            <Textarea
              id="disabled-textarea"
              placeholder="Disabled textarea"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Numeric Input */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Numeric Input
        </h2>
        <div className="space-y-4">
          <div className="max-w-[150px] space-y-2">
            <Label>With Buttons</Label>
            <NumericInput
              value={numericValue}
              onChange={setNumericValue}
              min={0}
              max={10}
            />
          </div>
          <div className="max-w-[150px] space-y-2">
            <Label>Without Buttons</Label>
            <NumericInput
              value={numericValue}
              onChange={setNumericValue}
              showButtons={false}
            />
          </div>
          <div className="max-w-[150px] space-y-2">
            <Label>Step = 0.1</Label>
            <NumericInput
              value={1.5}
              onChange={() => {}}
              step={0.1}
              min={0}
              max={5}
            />
          </div>
        </div>
      </section>

      {/* Input with Symbol (Prefix/Suffix) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Symbol
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Currency Input</Label>
            <InputWithAffix
              prefix={<IconCurrencyDollar className="h-4 w-4" />}
              type="number"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage Input</Label>
            <InputWithAffix
              suffix={<IconPercentage className="h-4 w-4" />}
              type="number"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Email Input</Label>
            <InputWithAffix
              prefix={<IconAt className="h-4 w-4" />}
              type="email"
              placeholder="username"
              suffix="@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Search Input</Label>
            <InputWithAffix
              prefix={<IconSearch className="h-4 w-4" />}
              placeholder="Search..."
            />
          </div>
        </div>
      </section>

      {/* Text with Numeric */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Text with Numeric
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <InputWithAffix
              prefix="+1"
              type="tel"
              placeholder="(555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex items-center gap-2">
              <InputWithAffix prefix="$" type="number" placeholder="Min" />
              <span className="text-muted-foreground">to</span>
              <InputWithAffix prefix="$" type="number" placeholder="Max" />
            </div>
          </div>
        </div>
      </section>

      {/* Color Picker */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Picker
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>With Hex Input & Presets</Label>
            <ColorPicker
              value={color as `#${string}`}
              onValueChange={(v) => setColor(v.hex)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimal</Label>
            <ColorPicker
              value={color as `#${string}`}
              onValueChange={(v) => setColor(v.hex)}
              hideContrastRatio
              hideDefaultSwatches
            />
          </div>
          <div className="space-y-2">
            <Label>Custom Presets</Label>
            <ColorPicker
              value={color as `#${string}`}
              onValueChange={(v) => setColor(v.hex)}
              swatches={["#1e40af", "#166534", "#b91c1c", "#0891b2", "#7c3aed"]}
              hideDefaultSwatches
            />
          </div>
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled States
        </h2>
        <div className="max-w-sm space-y-3">
          <Input placeholder="Disabled input" disabled />
          <NumericInput value={5} onChange={() => {}} disabled />
          <InputWithAffix prefix="$" placeholder="Disabled" disabled />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Input, NumericInput, InputWithAffix } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "@/components/ui/color-picker"

// Basic
<Input placeholder="Enter text..." />
<Textarea placeholder="Long text..." />

// Numeric with buttons
<NumericInput value={5} onChange={setValue} min={0} max={10} />

// With prefix/suffix
<InputWithAffix prefix="$" placeholder="0.00" />
<InputWithAffix suffix="%" placeholder="0" />

// Color picker
<ColorPicker value="#3b82f6" onChange={setColor} />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
