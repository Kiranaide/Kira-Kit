import * as React from "react";
import {
  Input,
  NumericInput,
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
  SearchInput,
} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

  const [currencyValue, setCurrencyValue] = React.useState<number | null>(
    1234.56
  );
  const [percentageValue, setPercentageValue] = React.useState<number | null>(
    12.5
  );
  const [decimalValue, setDecimalValue] = React.useState<number | null>(
    98765.43
  );
  const [searchValue, setSearchValue] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [clearableValue, setClearableValue] =
    React.useState("Type to clear me");

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
        <p className="text-sm text-muted-foreground">
          The foundational input component built on Base UI primitives. Supports
          all native HTML input types including text, email, password, number,
          and more. Features consistent styling with focus rings, validation
          states, and disabled appearances.
        </p>
        <div className="max-w-sm space-y-3">
          <Input placeholder="Enter text..." />
          <Input type="email" placeholder="Email address" />
          <Input type="password" placeholder="Password" />
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Input components support multiple size variants for different use
          cases. Choose from extra small (xs), small (sm), default, or large
          (lg) sizes to match your design requirements. Size variants work
          seamlessly with prefix/suffix elements and maintain proper spacing.
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Extra Small (xs)</Label>
            <Input size="xs" placeholder="Extra small input" />
            <Input
              size="xs"
              prefix={<IconSearch className="h-3 w-3" />}
              placeholder="With prefix"
            />
          </div>
          <div className="space-y-2">
            <Label>Small (sm)</Label>
            <Input size="sm" placeholder="Small input" />
            <Input
              size="sm"
              prefix={<IconAt className="h-3.5 w-3.5" />}
              placeholder="With prefix"
            />
          </div>
          <div className="space-y-2">
            <Label>Default</Label>
            <Input placeholder="Default input" />
            <Input
              prefix={<IconCurrencyDollar className="h-4 w-4" />}
              placeholder="With prefix"
            />
          </div>
          <div className="space-y-2">
            <Label>Large (lg)</Label>
            <Input size="lg" placeholder="Large input" />
            <Input
              size="lg"
              prefix={<IconCurrencyDollar className="h-4 w-4" />}
              suffix={<IconPercentage className="h-4 w-4" />}
              placeholder="With prefix & suffix"
            />
          </div>
        </div>
      </section>

      {/* Textarea */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Textarea
        </h2>
        <p className="text-sm text-muted-foreground">
          Multi-line text input for longer content like comments, descriptions,
          or messages. Features auto-expanding height that grows with content
          while maintaining a consistent visual style.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Specialized input for numeric values with optional increment/decrement
          buttons. Supports min/max constraints, custom step values, and hides
          native browser spinners for a cleaner look.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Smart inputs that automatically format values as you type. Includes
          currency formatting with locale-aware symbols, percentage inputs with
          automatic % suffix, and decimal inputs with configurable precision.
          Uses fixed-point arithmetic to prevent floating-point errors.
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Currency (auto decimal + locale format)</Label>
            <CurrencyInput
              value={currencyValue}
              onChange={setCurrencyValue}
              currency="IDR"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage (auto decimal + % suffix)</Label>
            <PercentageInput
              value={percentageValue}
              onChange={setPercentageValue}
            />
          </div>
          <div className="space-y-2">
            <Label>Decimal (fixed fraction digits)</Label>
            <DecimalInput
              value={decimalValue}
              onChange={setDecimalValue}
              fractionDigits={3}
            />
          </div>
        </div>
      </section>

      {/* Input with Symbol (Prefix/Suffix) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Prefix/Suffix
        </h2>
        <p className="text-sm text-muted-foreground">
          Inputs with decorative or informational elements at the start or end.
          Supports both icons and text as prefix/suffix. Useful for currency
          symbols, domain suffixes, search icons, and other contextual hints.
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Currency Input</Label>
            <Input
              prefix={<IconCurrencyDollar className="h-4 w-4" />}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>Percentage Input</Label>
            <Input
              suffix={<IconPercentage className="h-4 w-4" />}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Email Input</Label>
            <Input
              prefix={<IconAt className="h-4 w-4" />}
              type="email"
              placeholder="username"
              suffix="@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Search Input</Label>
            <Input
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
        <p className="text-sm text-muted-foreground">
          Combination patterns for inputs that need both text context and
          numeric values. Commonly used for phone numbers with country codes,
          price ranges, and measurements with units.
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input prefix="+1" type="tel" placeholder="(555) 000-0000" />
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex items-center gap-2">
              <Input prefix="$" placeholder="Min" />
              <span className="text-muted-foreground">to</span>
              <Input prefix="$" placeholder="Max" />
            </div>
          </div>
        </div>
      </section>

      {/* Color Picker */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Picker
        </h2>
        <p className="text-sm text-muted-foreground">
          Rich color selection component with hue/saturation picker, hex input,
          and preset swatches. Supports WCAG contrast ratio display, custom
          preset colors, and minimal mode for simpler use cases.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Complete form field component combining label, input, description, and
          error message. Automatically generates accessible IDs and handles
          validation states with visual feedback.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Input paired with an action button for submission, search, or
          verification flows. Supports button positioning on either side,
          various button variants, and both text and icon content.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Input that displays a loading spinner when performing async operations
          like search-as-you-type, validation, or data fetching. Provides visual
          feedback during processing.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Input wrapped in a tooltip for providing additional context or help
          text on hover. Useful for explaining complex fields, security
          warnings, or format requirements without cluttering the UI.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Input combined with a dropdown selector for hybrid inputs like phone
          numbers with country codes, email addresses with domain selection, or
          measurements with unit selection. Dropdown can be positioned on either
          side.
        </p>
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
        <p className="text-sm text-muted-foreground">
          Container for combining multiple inputs into a cohesive visual unit.
          Automatically handles border radius adjustments for seamless
          connection. Ideal for date ranges, time ranges, and multi-part inputs.
        </p>
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
              <Input prefix="$" type="number" placeholder="Min" />
              <Input prefix="$" type="number" placeholder="Max" />
            </InputGroup>
          </div>
        </div>
      </section>

      {/* Textarea Fixed */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Fixed Height Textarea
        </h2>
        <p className="text-sm text-muted-foreground">
          Textarea variant that maintains a fixed height regardless of content.
          Does not auto-expand, making it suitable for layouts where consistent
          dimensions are required. Content scrolls within the fixed area.
        </p>
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
        <p className="text-sm text-muted-foreground">
          All input variants support disabled states with reduced opacity and
          cursor changes. Disabled inputs prevent user interaction while
          indicating the field is not currently editable.
        </p>
        <div className="max-w-sm space-y-3">
          <Input placeholder="Disabled input" disabled />
          <NumericInput value={5} onChange={() => {}} disabled />
          <Input prefix="$" placeholder="Disabled" disabled />
          <InputWithLabel
            label="Disabled Field"
            disabled
            placeholder="Cannot edit"
          />
        </div>
      </section>

      {/* Search Input */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Search Input
        </h2>
        <p className="text-sm text-muted-foreground">
          Debounced search input with loading state and clear button.
          Automatically triggers search after a delay, with keyboard shortcuts
          for immediate search (Enter) or clear (Escape).
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Debounced Search</Label>
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              onSearch={(v) => {
                setIsSearching(true);
                console.log("Searching:", v);
                setTimeout(() => setIsSearching(false), 1000);
              }}
              isLoading={isSearching}
              debounceMs={500}
            />
            <p className="text-xs text-muted-foreground">
              Current value: "{searchValue}"
            </p>
          </div>
          <div className="space-y-2">
            <Label>Size Variants</Label>
            <SearchInput size="sm" placeholder="Small search..." />
            <SearchInput placeholder="Default search..." />
            <SearchInput size="lg" placeholder="Large search..." />
          </div>
        </div>
      </section>

      {/* Input with Clear */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Clear
        </h2>
        <p className="text-sm text-muted-foreground">
          Input with a clear button that appears when there is content. Supports
          controlled and uncontrolled modes with configurable visibility
          behavior.
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Clearable (Controlled)</Label>
            <Input
              value={clearableValue}
              onChange={(e) => setClearableValue(e.target.value)}
              onClear={() => setClearableValue("")}
              showClear
              placeholder="Type something..."
            />
          </div>
          <div className="space-y-2">
            <Label>Clearable (Uncontrolled)</Label>
            <Input showClear placeholder="Type something..." />
          </div>
        </div>
      </section>

      {/* Input with Copy */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Input with Copy
        </h2>
        <p className="text-sm text-muted-foreground">
          Read-only input with a copy-to-clipboard button. Shows a checkmark
          when copied successfully. Ideal for sharing links, API keys, or
          generated codes.
        </p>
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Shareable Link</Label>
            <Input
              value="https://example.com/share/abc123"
              onCopySuccess={() => console.log("Copied!")}
              showCopy
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input value="sk-12345abcdef67890" size="sm" showCopy readOnly />
          </div>
          <div className="space-y-2">
            <Label>Invite Code</Label>
            <Input value="WELCOME-2024" size="lg" showCopy readOnly />
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Input, NumericInput } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "@/components/ui/color-picker"

// Basic
<Input placeholder="Enter text..." />
<Textarea placeholder="Long text..." />

// Numeric with buttons
<NumericInput value={5} onChange={setValue} min={0} max={10} />

// With prefix/suffix (native support)
<Input prefix="$" placeholder="0.00" />
<Input suffix="%" placeholder="0" />

// Color picker
<ColorPicker value="#3b82f6" onChange={setColor} />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
