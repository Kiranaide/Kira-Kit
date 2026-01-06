import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  NumericInput,
  InputWithAffix,
  InputWithLabel,
  InputWithButton,
  InputWithSpinner,
  InputWithTooltip,
  InputWithDropdown,
  InputGroup,
  TextareaFixed,
  CurrencyInput,
  PercentageInput,
  DecimalInput,
} from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  IconCurrencyDollar,
  IconPercentage,
  IconAt,
  IconSearch,
  IconSend,
  IconCheck,
} from "@tabler/icons-react";

export function InputPage() {
  const [numericValue, setNumericValue] = React.useState(5);
  const [color, setColor] = React.useState("#3b82f6");
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailValue, setEmailValue] = React.useState("");
  const [currencyValue, setCurrencyValue] = React.useState<number | null>(1234.56);
  const [percentageValue, setPercentageValue] = React.useState<number | null>(12.5);
  const [decimalValue, setDecimalValue] = React.useState<number | null>(98765.43);

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

      {/* Formatted Inputs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Formatted Inputs
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Currency (auto decimal + locale format)</Label>
            <CurrencyInput
              value={currencyValue}
              onChange={setCurrencyValue}
              currency="USD"
              placeholder="$1,234.56"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage (auto decimal + % suffix)</Label>
            <PercentageInput
              value={percentageValue}
              onChange={setPercentageValue}
              placeholder="12.50%"
            />
          </div>
          <div className="space-y-2">
            <Label>Decimal (fixed fraction digits)</Label>
            <DecimalInput
              value={decimalValue}
              onChange={setDecimalValue}
              fractionDigits={3}
              placeholder="98,765.430"
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

      {/* Input with Label */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Label
        </h2>
        <div className="max-w-sm space-y-4">
          <InputWithLabel
            label="Email Address"
            description="We'll never share your email with anyone else."
            placeholder="name@example.com"
            type="email"
          />
          <InputWithLabel
            label="Password"
            description="Must be at least 8 characters"
            type="password"
            placeholder="Enter password"
          />
          <InputWithLabel
            label="Username"
            error="Username is already taken"
            placeholder="username"
          />
        </div>
      </section>

      {/* Input with Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Button
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Subscribe</Label>
            <InputWithButton
              placeholder="Enter your email"
              buttonText="Subscribe"
              buttonIcon={<IconSend className="w-4 h-4" />}
              buttonPosition="right"
              onButtonClick={() => alert("Subscribed!")}
            />
          </div>
          <div className="space-y-2">
            <Label>Search</Label>
            <InputWithButton
              placeholder="Search..."
              buttonText="Search"
              buttonIcon={<IconSearch className="w-4 h-4" />}
              buttonPosition="left"
              buttonVariant="outline"
              onButtonClick={() => alert("Searching...")}
            />
          </div>
          <div className="space-y-2">
            <Label>Verify</Label>
            <InputWithButton
              placeholder="Enter code"
              buttonText="Verify"
              buttonIcon={<IconCheck className="w-4 h-4" />}
              buttonPosition="right"
              buttonVariant="success"
              onButtonClick={() => alert("Verified!")}
            />
          </div>
        </div>
      </section>

      {/* Input with Spinner */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Spinner
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Loading State</Label>
            <InputWithSpinner
              placeholder="Searching..."
              isLoading={isLoading}
            />
            <button
              onClick={() => setIsLoading(!isLoading)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Toggle loading
            </button>
          </div>
        </div>
      </section>

      {/* Input with Tooltip */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Tooltip
        </h2>
        <div className="max-w-sm space-y-4">
          <InputWithTooltip
            placeholder="Hover for help"
            tooltip="This field is required and must be unique"
          />
          <InputWithTooltip
            placeholder="API Key"
            tooltip="Keep this secret! Never share your API key publicly."
            type="password"
          />
        </div>
      </section>

      {/* Input with Dropdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Dropdown
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Country Code</Label>
            <InputWithDropdown
              options={[
                { value: "+1", label: "+1" },
                { value: "+44", label: "+44" },
                { value: "+33", label: "+33" },
                { value: "+49", label: "+49" },
                { value: "+81", label: "+81" },
              ]}
              placeholder="Phone number"
              onOptionSelect={(value) => console.log("Selected:", value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Domain</Label>
            <InputWithDropdown
              options={[
                { value: "gmail.com", label: "@gmail.com" },
                { value: "yahoo.com", label: "@yahoo.com" },
                { value: "outlook.com", label: "@outlook.com" },
              ]}
              placeholder="Username"
              dropdownPosition="right"
              onOptionSelect={(value) => console.log("Selected:", value)}
            />
          </div>
        </div>
      </section>

      {/* Input Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input Group
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <InputGroup>
              <Input type="date" placeholder="Start date" />
              <Input type="date" placeholder="End date" />
            </InputGroup>
          </div>
          <div className="space-y-2">
            <Label>Time Range</Label>
            <InputGroup>
              <Input type="time" placeholder="Start time" />
              <Input type="time" placeholder="End time" />
            </InputGroup>
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <InputGroup>
              <InputWithAffix prefix="$" type="number" placeholder="Min" />
              <InputWithAffix prefix="$" type="number" placeholder="Max" />
            </InputGroup>
          </div>
        </div>
      </section>

      {/* Textarea Fixed */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Fixed Height Textarea
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Comments (Fixed Height)</Label>
            <TextareaFixed rows={4} placeholder="Enter comments..." />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <TextareaFixed rows={3} placeholder="Add notes..." />
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
          <InputWithLabel label="Disabled Field" disabled placeholder="Cannot edit" />
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
