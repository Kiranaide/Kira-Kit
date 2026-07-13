import { useState, useRef } from "react";
import {
  Input,
  NumericInput,
  InputWithLabel,
  InputWithButton,
  InputWithSpinner,
  InputWithTooltip,
  InputWithDropdown,
  InputCluster,
  TextareaFixed,
  CurrencyInput,
  PercentageInput,
  DecimalInput,
  SearchInput,
  OTPInput,
  Rating,
  RatingDisplay,
  PasswordInput,
  TagInput,
} from "@/components/ui/input";
import type { OTPInputRef } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  IconCurrencyDollar,
  IconPercentage,
  IconAt,
  IconSearch,
  IconSend,
  IconCheck,
  IconHeart,
  IconHeartFilled,
  IconFlame,
  IconMoodSmile,
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
  Changelog,
} from "@/components/docs";

// =============================================================================
// Code Snippets
// =============================================================================

const basicCode = `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BasicInputDemo() {
  return (
    <div className="space-y-4">
      <Input placeholder="Enter text..." />
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      
      {/* Size Variants */}
      <div className="space-y-2">
        <Label>Extra Small (xs)</Label>
        <Input size="xs" placeholder="Extra small input" />
      </div>
      <div className="space-y-2">
        <Label>Small (sm)</Label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div className="space-y-2">
        <Label>Default</Label>
        <Input placeholder="Default input" />
      </div>
      <div className="space-y-2">
        <Label>Large (lg)</Label>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  )
}`;

const textareaCode = `import { Textarea } from "@/components/ui/textarea"
import { TextareaFixed } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TextareaDemo() {
  return (
    <div className="space-y-4">
      {/* Auto-expanding Textarea */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" placeholder="Tell us about yourself..." />
      </div>
      
      {/* Fixed Height Textarea */}
      <div className="space-y-2">
        <Label>Comments (Fixed Height)</Label>
        <TextareaFixed rows={4} placeholder="Enter comments..." />
      </div>
      
      {/* Disabled */}
      <div className="space-y-2">
        <Label>Disabled</Label>
        <Textarea placeholder="Disabled textarea" disabled />
      </div>
    </div>
  )
}`;

const numericCode = `import { NumericInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NumericInputDemo() {
  const [value, setValue] = useState(5)
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>With Buttons</Label>
        <NumericInput
          value={value}
          onChange={setValue}
          min={0}
          max={10}
        />
      </div>
      <div className="space-y-2">
        <Label>Without Buttons</Label>
        <NumericInput
          value={value}
          onChange={setValue}
          showButtons={false}
        />
      </div>
      <div className="space-y-2">
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
  )
}`;

const formattedCode = `import { CurrencyInput, PercentageInput, DecimalInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormattedInputDemo() {
  const [currency, setCurrency] = useState<number | null>(1234.56)
  const [percentage, setPercentage] = useState<number | null>(12.5)
  const [decimal, setDecimal] = useState<number | null>(98765.43)
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Currency (auto decimal + locale format)</Label>
        <CurrencyInput
          value={currency}
          onChange={setCurrency}
          currency="IDR"
        />
      </div>
      <div className="space-y-2">
        <Label>Percentage (auto decimal + % suffix)</Label>
        <PercentageInput
          value={percentage}
          onChange={setPercentage}
        />
      </div>
      <div className="space-y-2">
        <Label>Decimal (fixed fraction digits)</Label>
        <DecimalInput
          value={decimal}
          onChange={setDecimal}
          fractionDigits={3}
        />
      </div>
    </div>
  )
}`;

const prefixSuffixCode = `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconCurrencyDollar, IconPercentage, IconAt, IconSearch } from "@tabler/icons-react"

export function PrefixSuffixDemo() {
  return (
    <div className="space-y-4">
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
        <Label>Phone Number</Label>
        <Input prefix="+1" type="tel" placeholder="(555) 000-0000" />
      </div>
    </div>
  )
}`;

const compositesCode = `import {
  InputWithLabel,
  InputWithButton,
  InputWithSpinner,
  InputWithTooltip,
  InputWithDropdown,
  InputCluster,
  Input,
} from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconSend, IconSearch, IconCheck } from "@tabler/icons-react"

export function InputCompositesDemo() {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <div className="space-y-6">
      {/* Input with Label */}
      <InputWithLabel
        label="Email Address"
        description="We'll never share your email."
        placeholder="name@example.com"
        type="email"
      />
      
      {/* Input with Button */}
      <InputWithButton
        placeholder="Enter your email"
        buttonText="Subscribe"
        buttonIcon={<IconSend className="w-4 h-4" />}
        onButtonClick={() => alert("Subscribed!")}
      />
      
      {/* Input with Spinner */}
      <InputWithSpinner
        placeholder="Searching..."
        isLoading={isLoading}
      />
      
      {/* Input with Tooltip */}
      <InputWithTooltip
        placeholder="Hover for help"
        tooltip="This field is required"
      />
      
      {/* Input with Dropdown */}
      <InputWithDropdown
        options={[
          { value: "+1", label: "+1" },
          { value: "+44", label: "+44" },
        ]}
        placeholder="Phone number"
        onOptionSelect={(value) => console.log(value)}
      />
      
      {/* Input Cluster */}
      <div className="space-y-2">
        <Label>Date Range</Label>
        <InputCluster>
          <Input type="date" placeholder="Start date" />
          <Input type="date" placeholder="End date" />
        </InputCluster>
      </div>
    </div>
  )
}`;

const searchActionsCode = `import { Input, SearchInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SearchActionsDemo() {
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [clearableValue, setClearableValue] = useState("Type to clear me")
  
  return (
    <div className="space-y-6">
      {/* Debounced Search */}
      <div className="space-y-2">
        <Label>Debounced Search</Label>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onSearch={(v) => {
            setIsSearching(true)
            console.log("Searching:", v)
            setTimeout(() => setIsSearching(false), 1000)
          }}
          isLoading={isSearching}
          debounceMs={500}
        />
      </div>
      
      {/* Clearable Input */}
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
      
      {/* Copy Input */}
      <div className="space-y-2">
        <Label>Shareable Link</Label>
        <Input
          value="https://example.com/share/abc123"
          onCopySuccess={() => console.log("Copied!")}
          showCopy
          readOnly
        />
      </div>
    </div>
  )
}`;

const otpCode = `import { OTPInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OTPInputDemo() {
  const [otpValue, setOtpValue] = useState("")
  const otpRef = useRef<OTPInputRef>(null)
  
  return (
    <div className="space-y-6">
      {/* Basic OTP */}
      <div className="space-y-2">
        <Label>6-Digit Verification Code</Label>
        <OTPInput
          ref={otpRef}
          value={otpValue}
          onChange={setOtpValue}
          onComplete={(code) => console.log("OTP Complete:", code)}
          autoFocus
        />
      </div>
      
      {/* Size Variants */}
      <div className="space-y-2">
        <Label>Small</Label>
        <OTPInput length={4} size="sm" />
      </div>
      
      {/* With Separator */}
      <div className="space-y-2">
        <Label>With Separator</Label>
        <OTPInput length={6} separatorAfter={2} gap="lg" />
      </div>
      
      {/* Masked (PIN) */}
      <div className="space-y-2">
        <Label>PIN Input (Masked)</Label>
        <OTPInput length={4} mask type="numeric" />
      </div>
    </div>
  )
}`;

const ratingCode = `import { Rating, RatingDisplay } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconHeartFilled, IconHeart } from "@tabler/icons-react"

export function RatingDemo() {
  const [rating, setRating] = useState(3.5)
  
  return (
    <div className="space-y-6">
      {/* Interactive Rating */}
      <div className="space-y-2">
        <Label>Interactive Rating</Label>
        <Rating
          value={rating}
          onChange={setRating}
          allowHalf
          showValue
        />
      </div>
      
      {/* Size Variants */}
      <div className="space-y-2">
        <Label>Size Variants</Label>
        <Rating defaultValue={4} size="sm" />
        <Rating defaultValue={4} />
        <Rating defaultValue={4} size="lg" />
      </div>
      
      {/* Custom Icons */}
      <div className="space-y-2">
        <Label>Hearts</Label>
        <Rating
          defaultValue={3}
          color="pink"
          filledIcon={<IconHeartFilled />}
          emptyIcon={<IconHeart />}
        />
      </div>
      
      {/* Rating Display */}
      <div className="space-y-2">
        <Label>Rating Display (Read-only)</Label>
        <RatingDisplay value={4.7} reviewCount={1234} />
      </div>
    </div>
  )
}`;

const usageCode = `import { 
  Input, 
  NumericInput,
  OTPInput,
  Rating,
  RatingDisplay,
} from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Basic
<Input placeholder="Enter text..." />
<Textarea placeholder="Long text..." />

// Numeric with buttons
<NumericInput value={5} onChange={setValue} min={0} max={10} />

// With prefix/suffix
<Input prefix="$" placeholder="0.00" />
<Input suffix="%" placeholder="0" />

// Clearable and copyable
<Input showClear onClear={() => setValue("")} />
<Input showCopy value="text-to-copy" readOnly />

// OTP Input
<OTPInput
  length={6}
  type="numeric"
  onComplete={(code) => console.log("OTP:", code)}
/>

// PIN Input (masked)
<OTPInput length={4} mask />

// Rating
<Rating 
  value={rating} 
  onChange={setRating} 
  allowHalf 
  showValue 
/>

// Rating Display (read-only with review count)
<RatingDisplay value={4.7} reviewCount={1234} />`;

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <div className="space-y-6">
      <div className="max-w-sm space-y-3">
        <Input placeholder="Enter text..." />
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password" />
      </div>
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
      <div className="max-w-sm space-y-3">
        <Label>Disabled States</Label>
        <Input placeholder="Disabled input" disabled />
        <Input prefix="$" placeholder="Disabled" disabled />
      </div>
    </div>
  );
}

function TextareaDemo() {
  return (
    <div className="max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bio">Bio (Auto-expanding)</Label>
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
      <div className="space-y-2">
        <Label>Comments (Fixed Height)</Label>
        <TextareaFixed rows={4} placeholder="Enter comments..." />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <TextareaFixed rows={3} placeholder="Add notes..." />
      </div>
    </div>
  );
}

function NumericDemo() {
  const [numericValue, setNumericValue] = useState(5);

  return (
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
      <div className="max-w-[150px] space-y-2">
        <Label>Disabled</Label>
        <NumericInput value={5} onChange={() => {}} disabled />
      </div>
    </div>
  );
}

function FormattedDemo() {
  const [currencyValue, setCurrencyValue] = useState<number | null>(1234.56);
  const [percentageValue, setPercentageValue] = useState<number | null>(12.5);
  const [decimalValue, setDecimalValue] = useState<number | null>(98765.43);

  return (
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
  );
}

function PrefixSuffixDemo() {
  return (
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
  );
}

function CompositesDemo() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-sm space-y-6">
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

      <div className="space-y-2">
        <Label>Loading State</Label>
        <InputWithSpinner placeholder="Searching..." isLoading={isLoading} />
        <button
          onClick={() => setIsLoading(!isLoading)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Toggle loading
        </button>
      </div>

      <InputWithTooltip
        placeholder="Hover for help"
        tooltip="This field is required and must be unique"
      />
      <InputWithTooltip
        placeholder="API Key"
        tooltip="Keep this secret! Never share your API key publicly."
        type="password"
      />

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

      <div className="space-y-2">
        <Label>Date Range</Label>
        <InputCluster>
          <Input type="date" placeholder="Start date" />
          <Input type="date" placeholder="End date" />
        </InputCluster>
      </div>
      <div className="space-y-2">
        <Label>Time Range</Label>
        <InputCluster>
          <Input type="time" placeholder="Start time" />
          <Input type="time" placeholder="End time" />
        </InputCluster>
      </div>
      <div className="space-y-2">
        <Label>Price Range</Label>
        <InputCluster>
          <Input prefix="$" type="number" placeholder="Min" />
          <Input prefix="$" type="number" placeholder="Max" />
        </InputCluster>
      </div>
    </div>
  );
}

function SearchActionsDemo() {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [clearableValue, setClearableValue] = useState("Type to clear me");

  return (
    <div className="max-w-sm space-y-6">
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
  );
}

function OTPDemo() {
  const [otpValue, setOtpValue] = useState("");
  const [otpComplete, setOtpComplete] = useState(false);
  const otpRef = useRef<OTPInputRef>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>6-Digit Verification Code</Label>
        <OTPInput
          ref={otpRef}
          value={otpValue}
          onChange={setOtpValue}
          onComplete={(code) => {
            setOtpComplete(true);
            console.log("OTP Complete:", code);
          }}
          autoFocus
        />
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground">
            Value: "{otpValue}"{" "}
            {otpComplete && <span className="text-success">Complete</span>}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              otpRef.current?.clear();
              setOtpComplete(false);
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Size Variants</Label>
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Small</span>
            <OTPInput length={4} size="sm" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Default</span>
            <OTPInput length={4} />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Large</span>
            <OTPInput length={4} size="lg" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Style Variants</Label>
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Default</span>
            <OTPInput length={4} variant="default" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Outline</span>
            <OTPInput length={4} variant="outline" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Filled</span>
            <OTPInput length={4} variant="filled" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>With Separator (Phone Format)</Label>
        <OTPInput length={6} separatorAfter={2} gap="lg" />
        <p className="text-xs text-muted-foreground">
          Separator appears after the 3rd digit
        </p>
      </div>

      <div className="space-y-2">
        <Label>Alphanumeric Code</Label>
        <OTPInput length={6} type="alphanumeric" placeholder="—" />
        <p className="text-xs text-muted-foreground">
          Accepts both letters and numbers (auto-uppercased)
        </p>
      </div>

      <div className="space-y-2">
        <Label>PIN Input (Masked)</Label>
        <OTPInput length={4} mask type="numeric" />
        <p className="text-xs text-muted-foreground">
          Values are hidden like a password
        </p>
      </div>

      <div className="space-y-2">
        <Label>Invalid State</Label>
        <OTPInput length={6} invalid />
        <p className="text-xs text-destructive">Invalid verification code</p>
      </div>

      <div className="space-y-2">
        <Label>Disabled</Label>
        <OTPInput length={6} disabled />
      </div>
    </div>
  );
}

function RatingDemo() {
  const [ratingValue, setRatingValue] = useState(3.5);
  const [feedbackRating, setFeedbackRating] = useState(0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Interactive Rating</Label>
        <Rating
          value={ratingValue}
          onChange={setRatingValue}
          allowHalf
          showValue
        />
        <p className="text-xs text-muted-foreground">
          Click or use arrow keys to rate. Supports half-stars.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Size Variants</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Small</span>
            <Rating defaultValue={4} size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Default</span>
            <Rating defaultValue={4} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Large</span>
            <Rating defaultValue={4} size="lg" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">XL</span>
            <Rating defaultValue={4} size="xl" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Color Variants</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Yellow</span>
            <Rating defaultValue={4} color="yellow" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Orange</span>
            <Rating defaultValue={4} color="orange" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Red</span>
            <Rating defaultValue={4} color="red" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Pink</span>
            <Rating defaultValue={4} color="pink" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-16">Primary</span>
            <Rating defaultValue={4} color="default" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Custom Icons</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Hearts</span>
            <Rating
              defaultValue={3}
              color="pink"
              filledIcon={<IconHeartFilled />}
              emptyIcon={<IconHeart />}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Fire</span>
            <Rating
              defaultValue={4}
              color="orange"
              max={3}
              filledIcon={<IconFlame />}
              emptyIcon={<IconFlame className="opacity-30" />}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Mood</span>
            <Rating
              defaultValue={4}
              color="yellow"
              filledIcon={<IconMoodSmile />}
              emptyIcon={<IconMoodSmile className="opacity-30" />}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Half Star Support</Label>
        <div className="flex flex-wrap gap-4">
          <Rating value={2.5} allowHalf readOnly showValue />
          <Rating value={3.5} allowHalf readOnly showValue />
          <Rating value={4.5} allowHalf readOnly showValue />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Custom Max Values</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">3 stars</span>
            <Rating defaultValue={2} max={3} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">5 stars</span>
            <Rating defaultValue={3} max={5} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">10 stars</span>
            <Rating defaultValue={7} max={10} size="sm" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Rating Display (Read-only)</Label>
        <div className="space-y-2">
          <RatingDisplay value={4.7} reviewCount={1234} />
          <RatingDisplay value={3.2} reviewCount={89} color="orange" />
          <RatingDisplay value={5.0} reviewCount={42} color="pink" />
        </div>
        <p className="text-xs text-muted-foreground">
          Use RatingDisplay for showing ratings with review counts
        </p>
      </div>

      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
        <Label>How was your experience?</Label>
        <Rating value={feedbackRating} onChange={setFeedbackRating} size="lg" />
        <div className="flex items-center gap-2 mt-2">
          {feedbackRating > 0 && (
            <>
              <span className="text-sm">
                {feedbackRating === 1 && "Poor"}
                {feedbackRating === 2 && "Fair"}
                {feedbackRating === 3 && "Good"}
                {feedbackRating === 4 && "Great"}
                {feedbackRating === 5 && "Excellent!"}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  alert(`Thank you for your ${feedbackRating}-star rating!`);
                  setFeedbackRating(0);
                }}
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Disabled</Label>
        <Rating defaultValue={3} disabled />
      </div>
    </div>
  );
}

// =============================================================================
// Password / Counter / Tags demos
// =============================================================================

function PasswordDemo() {
  const [pwd, setPwd] = useState("");

  return (
    <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <Label>Password (with visibility toggle)</Label>
        <PasswordInput placeholder="Enter password" />
      </div>
      <div className="space-y-2">
        <Label>With strength meter</Label>
        <PasswordInput
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          showStrength
          placeholder="Try mixing cases, numbers & symbols"
        />
      </div>
    </div>
  );
}

const passwordCode = `import { PasswordInput } from "@/components/ui/input"

// Masked by default, with an accessible show/hide toggle.
<PasswordInput placeholder="Enter password" />

// Live strength meter + requirement checklist.
<PasswordInput
  value={pwd}
  onChange={(e) => setPwd(e.target.value)}
  showStrength
/>`;

function CounterDemo() {
  const [bio, setBio] = useState("");
  const [handle, setHandle] = useState("");

  return (
    <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <Label>Username (max 20)</Label>
        <Input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          maxLength={20}
          showCount
          placeholder="username"
        />
      </div>
      <div className="space-y-2">
        <Label>Bio (max 160)</Label>
        <TextareaFixed
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
          rows={3}
          placeholder="Tell us about yourself..."
        />
        <p className="text-right text-xs tabular-nums text-muted-foreground">
          {bio.length}/160
        </p>
      </div>
    </div>
  );
}

const counterCode = `import { Input } from "@/components/ui/input"

// Live character counter (needs a controlled value + maxLength).
<Input value={handle} onChange={...} maxLength={20} showCount />`;

function TagsDemo() {
  const [tags, setTags] = useState<string[]>(["design", "react"]);

  return (
    <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <Label>Tags (Enter or comma to add, Backspace to remove)</Label>
        <TagInput value={tags} onChange={setTags} maxTags={6} />
        <p className="text-xs text-muted-foreground">
          {tags.length}/6 tags — {tags.join(", ") || "none yet"}
        </p>
      </div>
      <div className="space-y-2">
        <Label>Uncontrolled</Label>
        <TagInput defaultValue={["one"]} placeholder="Add a tag…" />
      </div>
    </div>
  );
}

const tagsCode = `import { TagInput } from "@/components/ui/input"

<TagInput value={tags} onChange={setTags} maxTags={6} />

// Uncontrolled
<TagInput defaultValue={["one"]} placeholder="Add a tag…" />`;

// =============================================================================
// Main Page Component
// =============================================================================

export default function InputPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "WAI-ARIA compliant with proper labels, keyboard navigation, and screen reader support across all input types.",
    },
    {
      title: "Customizable",
      description:
        "Size variants, prefix/suffix support, formatted inputs, and composable patterns for any use case.",
    },
    {
      title: "Composable",
      description:
        "Mix and match with labels, buttons, spinners, tooltips, dropdowns, and clusters for complex form layouts.",
    },
  ];

  const shortcuts = [
    { keys: "Tab", description: "Move focus to next input" },
    { keys: "Shift + Tab", description: "Move focus to previous input" },
    { keys: "Enter", description: "Submit form or trigger action" },
    { keys: "Escape", description: "Clear input or close dropdown" },
    { keys: "Arrow Left/Right", description: "Navigate OTP digits" },
    { keys: "Backspace", description: "Delete and move to previous (OTP)" },
    { keys: "Arrow Up/Down", description: "Increment/decrement numeric value" },
    { keys: "Arrow Left/Right", description: "Adjust rating value" },
  ];

  const apiSections = [
    {
      title: "Input",
      props: [
        {
          prop: "size",
          type: '"xs" | "sm" | "default" | "lg"',
          default: '"default"',
          description: "Size variant of the input.",
        },
        {
          prop: "prefix",
          type: "ReactNode",
          description: "Element displayed before the input.",
        },
        {
          prop: "suffix",
          type: "ReactNode",
          description: "Element displayed after the input.",
        },
        {
          prop: "showClear",
          type: "boolean",
          default: "false",
          description: "Show clear button when input has value.",
        },
        {
          prop: "onClear",
          type: "() => void",
          description: "Callback when clear button is clicked.",
        },
        {
          prop: "showCopy",
          type: "boolean",
          default: "false",
          description: "Show copy-to-clipboard button.",
        },
        {
          prop: "onCopySuccess",
          type: "() => void",
          description: "Callback when content is copied.",
        },
      ],
    },
    {
      title: "NumericInput",
      props: [
        {
          prop: "value",
          type: "number",
          description: "Current numeric value.",
        },
        {
          prop: "onChange",
          type: "(value: number) => void",
          description: "Callback when value changes.",
        },
        {
          prop: "min",
          type: "number",
          description: "Minimum allowed value.",
        },
        {
          prop: "max",
          type: "number",
          description: "Maximum allowed value.",
        },
        {
          prop: "step",
          type: "number",
          default: "1",
          description: "Step increment/decrement value.",
        },
        {
          prop: "showButtons",
          type: "boolean",
          default: "true",
          description: "Show increment/decrement buttons.",
        },
      ],
    },
    {
      title: "OTPInput",
      props: [
        {
          prop: "length",
          type: "number",
          default: "6",
          description: "Number of OTP digits (4-8).",
        },
        {
          prop: "value",
          type: "string",
          description: "Current OTP value.",
        },
        {
          prop: "onChange",
          type: "(value: string) => void",
          description: "Callback when OTP value changes.",
        },
        {
          prop: "onComplete",
          type: "(code: string) => void",
          description: "Callback when all digits are entered.",
        },
        {
          prop: "type",
          type: '"numeric" | "alphanumeric"',
          default: '"numeric"',
          description: "Allowed input type.",
        },
        {
          prop: "mask",
          type: "boolean",
          default: "false",
          description: "Hide entered values like a password.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size variant.",
        },
        {
          prop: "variant",
          type: '"default" | "outline" | "filled"',
          default: '"default"',
          description: "Visual style variant.",
        },
        {
          prop: "separatorAfter",
          type: "number",
          description: "Show separator after this digit index.",
        },
        {
          prop: "invalid",
          type: "boolean",
          default: "false",
          description: "Show error state styling.",
        },
      ],
    },
    {
      title: "Rating",
      props: [
        {
          prop: "value",
          type: "number",
          description: "Current rating value.",
        },
        {
          prop: "defaultValue",
          type: "number",
          default: "0",
          description: "Initial value for uncontrolled mode.",
        },
        {
          prop: "onChange",
          type: "(value: number) => void",
          description: "Callback when rating changes.",
        },
        {
          prop: "max",
          type: "number",
          default: "5",
          description: "Maximum rating value.",
        },
        {
          prop: "allowHalf",
          type: "boolean",
          default: "false",
          description: "Allow half-star ratings.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg" | "xl"',
          default: '"default"',
          description: "Size of rating icons.",
        },
        {
          prop: "color",
          type: '"yellow" | "orange" | "red" | "pink" | "default"',
          default: '"yellow"',
          description: "Color of filled icons.",
        },
        {
          prop: "filledIcon",
          type: "ReactNode",
          description: "Custom icon for filled state.",
        },
        {
          prop: "emptyIcon",
          type: "ReactNode",
          description: "Custom icon for empty state.",
        },
        {
          prop: "showValue",
          type: "boolean",
          default: "false",
          description: "Display numeric value next to stars.",
        },
        {
          prop: "readOnly",
          type: "boolean",
          default: "false",
          description: "Disable interaction.",
        },
      ],
    },
    {
      title: "RatingDisplay",
      props: [
        {
          prop: "value",
          type: "number",
          description: "Rating value to display.",
        },
        {
          prop: "reviewCount",
          type: "number",
          description: "Number of reviews to show.",
        },
        {
          prop: "color",
          type: '"yellow" | "orange" | "red" | "pink" | "default"',
          default: '"yellow"',
          description: "Color of the rating stars.",
        },
      ],
    },
    {
      title: "SearchInput",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Current search value.",
        },
        {
          prop: "onChange",
          type: "(value: string) => void",
          description: "Callback when input changes.",
        },
        {
          prop: "onSearch",
          type: "(value: string) => void",
          description: "Callback when search is triggered (debounced).",
        },
        {
          prop: "debounceMs",
          type: "number",
          default: "300",
          description: "Debounce delay in milliseconds.",
        },
        {
          prop: "isLoading",
          type: "boolean",
          default: "false",
          description: "Show loading spinner.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size variant.",
        },
      ],
    },
    {
      title: "CurrencyInput / PercentageInput / DecimalInput",
      props: [
        {
          prop: "value",
          type: "number | null",
          description: "Current numeric value.",
        },
        {
          prop: "onChange",
          type: "(value: number | null) => void",
          description: "Callback when value changes.",
        },
        {
          prop: "currency",
          type: "string",
          default: '"USD"',
          description: "Currency code (CurrencyInput only).",
        },
        {
          prop: "fractionDigits",
          type: "number",
          default: "2",
          description: "Number of decimal places (DecimalInput).",
        },
      ],
    },
  ];

  const tabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Input & Size Variants"
          description="The foundational input component with multiple size variants. Supports all native HTML input types including text, email, password, and number."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "textarea",
      label: "Textarea",
      demo: (
        <DemoWrapper
          title="Textarea"
          description="Multi-line text input for longer content. Features auto-expanding height or fixed height variants."
          code={textareaCode}
        >
          <TextareaDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "numeric",
      label: "Numeric",
      demo: (
        <DemoWrapper
          title="Numeric Input"
          description="Specialized input for numeric values with optional increment/decrement buttons. Supports min/max constraints and custom step values."
          code={numericCode}
        >
          <NumericDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "formatted",
      label: "Formatted",
      demo: (
        <DemoWrapper
          title="Formatted Inputs"
          description="Smart inputs that automatically format values as you type. Includes currency, percentage, and decimal inputs with locale-aware formatting."
          code={formattedCode}
        >
          <FormattedDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "prefix-suffix",
      label: "Prefix/Suffix",
      demo: (
        <DemoWrapper
          title="Prefix & Suffix"
          description="Inputs with decorative or informational elements at the start or end. Supports both icons and text as prefix/suffix."
          code={prefixSuffixCode}
        >
          <PrefixSuffixDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "composites",
      label: "Composites",
      demo: (
        <DemoWrapper
          title="Input Composites"
          description="Pre-built composite components combining inputs with labels, buttons, spinners, tooltips, dropdowns, and clusters."
          code={compositesCode}
        >
          <CompositesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "search-actions",
      label: "Search & Actions",
      demo: (
        <DemoWrapper
          title="Search & Action Inputs"
          description="Debounced search input with loading state, clearable inputs, and copy-to-clipboard functionality."
          code={searchActionsCode}
        >
          <SearchActionsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "otp",
      label: "OTP",
      demo: (
        <DemoWrapper
          title="OTP Input"
          description="One-time password input with separated digit boxes. Supports auto-focus advancement, paste handling, keyboard navigation, and numeric/alphanumeric modes."
          code={otpCode}
        >
          <OTPDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "rating",
      label: "Rating",
      demo: (
        <DemoWrapper
          title="Rating"
          description="Star rating component with hover preview, half-star support, keyboard navigation, and customizable icons/colors."
          code={ratingCode}
        >
          <RatingDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "password",
      label: "Password",
      demo: (
        <DemoWrapper
          title="Password Input"
          description="Masked by default with an accessible show/hide toggle, plus an optional live strength meter and requirement checklist. Lets you drop the 'confirm password' field."
          code={passwordCode}
        >
          <PasswordDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "counter",
      label: "Counter",
      demo: (
        <DemoWrapper
          title="Character Counter"
          description="A live n/max counter that announces politely and warns when the limit is reached. Works on Input and TextareaFixed."
          code={counterCode}
        >
          <CounterDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "tags",
      label: "Tags",
      demo: (
        <DemoWrapper
          title="Tag Input"
          description="Type and press Enter or comma to add a tag; Backspace removes the last. Supports controlled and uncontrolled use, dedupe, and a max count."
          code={tagsCode}
        >
          <TagsDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Input"
        version="v2.1"
        description="A comprehensive collection of input components for forms and data entry. Includes basic inputs, textareas, numeric inputs, formatted inputs, OTP, ratings, and composable patterns."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={tabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={shortcuts} />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for common input patterns"
      />

      <APIReference sections={apiSections} />

      <Changelog
        entries={[
          {
            version: "2.1.0",
            date: "10 July 2026",
            changes: [
              {
                type: "added",
                title: "Password Input & Strength Meter",
                description:
                  "Added PasswordInput with a masked-by-default field, an accessible show/hide toggle that doesn't steal focus, and an optional live strength meter with a requirement checklist.",
              },
              {
                type: "added",
                title: "Character Counter",
                description:
                  "Input and TextareaFixed gained a showCount prop that renders a live n/max counter (aria-live polite) which warns at the limit.",
              },
              {
                type: "added",
                title: "Tag Input",
                description:
                  "Added TagInput for chip-style entry: Enter/comma to add, Backspace to remove, with dedupe, maxTags, and controlled/uncontrolled modes.",
              },
              {
                type: "fixed",
                title: "OTP Shake & Icons",
                description:
                  "Replaced the OTP invalid-shake setTimeout chain with a single reduced-motion-safe CSS keyframe, and swapped the hand-drawn clear/copy SVGs for Tabler icons with larger tap targets.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
