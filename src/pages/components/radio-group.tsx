import * as React from "react";
import {
  IconCircleCheck,
  IconPalette,
  IconLayoutGrid,
  IconCreditCard,
  IconBuildingBank,
  IconWallet,
} from "@tabler/icons-react";

import {
  RadioGroup,
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
  RadioButtonGroup,
  RadioButton,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" />
        <Label>Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" />
        <Label>Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" />
        <Label>Option 3</Label>
      </div>
    </RadioGroup>
  );
}

const basicCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function BasicRadioGroupDemo() {
  return (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" />
        <Label>Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" />
        <Label>Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" />
        <Label>Option 3</Label>
      </div>
    </RadioGroup>
  )
}`;

function WithLabelDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <RadioWithLabel
        value="default"
        label="Default"
        description="System default settings."
      />
      <RadioWithLabel
        value="comfortable"
        label="Comfortable"
        description="More spacing for better readability."
      />
      <RadioWithLabel
        value="compact"
        label="Compact"
        description="Less spacing for more content."
      />
    </RadioGroup>
  );
}

const withLabelCode = `import { RadioGroup, RadioWithLabel } from "@/components/ui/radio-group"

export function RadioWithLabelDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <RadioWithLabel
        value="default"
        label="Default"
        description="System default settings."
      />
      <RadioWithLabel
        value="comfortable"
        label="Comfortable"
        description="More spacing for better readability."
      />
      <RadioWithLabel
        value="compact"
        label="Compact"
        description="Less spacing for more content."
      />
    </RadioGroup>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Small</p>
        <RadioGroup defaultValue="sm">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sm" size="sm" />
            <Label>Small</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default</p>
        <RadioGroup defaultValue="def">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="def" size="default" />
            <Label>Default</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Large</p>
        <RadioGroup defaultValue="lg">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lg" size="lg" />
            <Label>Large</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

const sizesCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function RadioSizesDemo() {
  return (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Small</p>
        <RadioGroup defaultValue="sm">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sm" size="sm" />
            <Label>Small</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default</p>
        <RadioGroup defaultValue="def">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="def" size="default" />
            <Label>Default</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Large</p>
        <RadioGroup defaultValue="lg">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lg" size="lg" />
            <Label>Large</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}`;

function ColorsDemo() {
  return (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <RadioGroup defaultValue="default">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" color="default" />
            <Label>Primary</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Destructive</p>
        <RadioGroup defaultValue="destructive">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="destructive" color="destructive" />
            <Label>Destructive</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Success</p>
        <RadioGroup defaultValue="success">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="success" color="success" />
            <Label>Success</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Warning</p>
        <RadioGroup defaultValue="warning">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="warning" color="warning" />
            <Label>Warning</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

const colorsCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function RadioColorsDemo() {
  return (
    <div className="flex gap-8">
      <RadioGroup defaultValue="default">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" color="default" />
          <Label>Primary</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="destructive">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="destructive" color="destructive" />
          <Label>Destructive</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="success">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="success" color="success" />
          <Label>Success</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="warning">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="warning" color="warning" />
          <Label>Warning</Label>
        </div>
      </RadioGroup>
    </div>
  )
}`;

function OrientationDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Vertical (default)</p>
        <RadioGroup defaultValue="apple">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="apple" />
            <Label>Apple</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="banana" />
            <Label>Banana</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cherry" />
            <Label>Cherry</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Horizontal</p>
        <RadioGroup defaultValue="small" orientation="horizontal">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" />
            <Label>Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" />
            <Label>Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" />
            <Label>Large</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

const orientationCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function RadioOrientationDemo() {
  return (
    <div className="space-y-8">
      {/* Vertical (default) */}
      <RadioGroup defaultValue="apple">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="apple" />
          <Label>Apple</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="banana" />
          <Label>Banana</Label>
        </div>
      </RadioGroup>

      {/* Horizontal */}
      <RadioGroup defaultValue="small" orientation="horizontal">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="small" />
          <Label>Small</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="medium" />
          <Label>Medium</Label>
        </div>
      </RadioGroup>
    </div>
  )
}`;

function CardVariantDemo() {
  const [payment, setPayment] = React.useState("card");

  return (
    <div className="space-y-4">
      <RadioGroup
        value={payment}
        onValueChange={(val) => setPayment(val as string)}
        className="grid gap-3 max-w-md"
      >
        <RadioCard
          value="card"
          label="Credit Card"
          description="Pay with Visa, Mastercard, or AMEX"
          icon={<IconCreditCard className="h-5 w-5" />}
        />
        <RadioCard
          value="bank"
          label="Bank Transfer"
          description="Direct transfer from your bank account"
          icon={<IconBuildingBank className="h-5 w-5" />}
        />
        <RadioCard
          value="wallet"
          label="Digital Wallet"
          description="Pay with PayPal, Apple Pay, or Google Pay"
          icon={<IconWallet className="h-5 w-5" />}
        />
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Selected: {payment}</p>
    </div>
  );
}

const cardVariantCode = `import { useState } from "react"
import { RadioGroup, RadioCard } from "@/components/ui/radio-group"
import { IconCreditCard, IconBuildingBank, IconWallet } from "@tabler/icons-react"

export function RadioCardDemo() {
  const [payment, setPayment] = useState("card")

  return (
    <RadioGroup
      value={payment}
      onValueChange={setPayment}
      className="grid gap-3 max-w-md"
    >
      <RadioCard
        value="card"
        label="Credit Card"
        description="Pay with Visa, Mastercard, or AMEX"
        icon={<IconCreditCard className="h-5 w-5" />}
      />
      <RadioCard
        value="bank"
        label="Bank Transfer"
        description="Direct transfer from your bank account"
        icon={<IconBuildingBank className="h-5 w-5" />}
      />
      <RadioCard
        value="wallet"
        label="Digital Wallet"
        description="Pay with PayPal, Apple Pay, or Google Pay"
        icon={<IconWallet className="h-5 w-5" />}
      />
    </RadioGroup>
  )
}`;

function SegmentedControlDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Billing Cycle</Label>
        <RadioButtonGroup defaultValue="monthly">
          <RadioButton value="monthly">Monthly</RadioButton>
          <RadioButton value="yearly">Yearly</RadioButton>
        </RadioButtonGroup>
      </div>
      <div className="space-y-2">
        <Label>View Mode</Label>
        <RadioButtonGroup defaultValue="grid">
          <RadioButton value="list">List</RadioButton>
          <RadioButton value="grid">Grid</RadioButton>
          <RadioButton value="calendar">Calendar</RadioButton>
        </RadioButtonGroup>
      </div>
      <div className="space-y-2">
        <Label>Size Variants</Label>
        <div className="flex flex-col gap-3">
          <RadioButtonGroup defaultValue="sm" size="sm">
            <RadioButton value="sm" size="sm">
              Small
            </RadioButton>
            <RadioButton value="md" size="sm">
              Medium
            </RadioButton>
            <RadioButton value="lg" size="sm">
              Large
            </RadioButton>
          </RadioButtonGroup>
          <RadioButtonGroup defaultValue="sm" size="default">
            <RadioButton value="sm">Small</RadioButton>
            <RadioButton value="md">Medium</RadioButton>
            <RadioButton value="lg">Large</RadioButton>
          </RadioButtonGroup>
          <RadioButtonGroup defaultValue="sm" size="lg">
            <RadioButton value="sm" size="lg">
              Small
            </RadioButton>
            <RadioButton value="md" size="lg">
              Medium
            </RadioButton>
            <RadioButton value="lg" size="lg">
              Large
            </RadioButton>
          </RadioButtonGroup>
        </div>
      </div>
    </div>
  );
}

const segmentedControlCode = `import { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function SegmentedControlDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Billing Cycle</Label>
        <RadioButtonGroup defaultValue="monthly">
          <RadioButton value="monthly">Monthly</RadioButton>
          <RadioButton value="yearly">Yearly</RadioButton>
        </RadioButtonGroup>
      </div>

      <div className="space-y-2">
        <Label>View Mode</Label>
        <RadioButtonGroup defaultValue="grid">
          <RadioButton value="list">List</RadioButton>
          <RadioButton value="grid">Grid</RadioButton>
          <RadioButton value="calendar">Calendar</RadioButton>
        </RadioButtonGroup>
      </div>

      {/* Size variants */}
      <RadioButtonGroup defaultValue="sm" size="sm">
        <RadioButton value="sm" size="sm">Small</RadioButton>
        <RadioButton value="md" size="sm">Medium</RadioButton>
      </RadioButtonGroup>
      <RadioButtonGroup defaultValue="sm" size="lg">
        <RadioButton value="sm" size="lg">Small</RadioButton>
        <RadioButton value="md" size="lg">Medium</RadioButton>
      </RadioButtonGroup>
    </div>
  )
}`;

function ValidationDemo() {
  const [selectedPlan, setSelectedPlan] = React.useState<string | undefined>();
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = () => {
    if (selectedPlan) {
      setShowError(false);
      alert(`Selected plan: ${selectedPlan}`);
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label className="text-base">
          Select a plan <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={selectedPlan}
          onValueChange={(val) => {
            setSelectedPlan(val as string);
            setShowError(false);
          }}
          required
          error={showError}
          errorMessage="Please select a plan to continue"
        >
          <RadioWithLabel value="free" label="Free" description="$0/month" />
          <RadioWithLabel value="pro" label="Pro" description="$9.99/month" />
          <RadioWithLabel
            value="enterprise"
            label="Enterprise"
            description="Contact sales"
          />
        </RadioGroup>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}

const validationCode = `import { useState } from "react"
import { RadioGroup, RadioWithLabel } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function RadioValidationDemo() {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>()
  const [showError, setShowError] = useState(false)

  const handleSubmit = () => {
    if (!selectedPlan) {
      setShowError(true)
    } else {
      setShowError(false)
      alert(\`Selected plan: \${selectedPlan}\`)
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label className="text-base">
          Select a plan <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={selectedPlan}
          onValueChange={(val) => {
            setSelectedPlan(val)
            setShowError(false)
          }}
          required
          error={showError}
          errorMessage="Please select a plan to continue"
        >
          <RadioWithLabel value="free" label="Free" description="$0/month" />
          <RadioWithLabel value="pro" label="Pro" description="$9.99/month" />
          <RadioWithLabel
            value="enterprise"
            label="Enterprise"
            description="Contact sales"
          />
        </RadioGroup>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}`;

function DisabledDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Disabled Group</p>
        <RadioGroup defaultValue="enabled" disabled>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enabled" />
            <Label>Enabled option (group disabled)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" />
            <Label>Another option</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Individual Disabled Item</p>
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" />
            <Label>Available option</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" disabled />
            <Label className="text-muted-foreground">Disabled option</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-3" />
            <Label>Another available option</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

const disabledCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function RadioDisabledDemo() {
  return (
    <div className="space-y-6">
      {/* Disabled Group */}
      <RadioGroup defaultValue="enabled" disabled>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="enabled" />
          <Label>Enabled option (group disabled)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="other" />
          <Label>Another option</Label>
        </div>
      </RadioGroup>

      {/* Individual Disabled Item */}
      <RadioGroup defaultValue="option-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-1" />
          <Label>Available option</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-2" disabled />
          <Label className="text-muted-foreground">Disabled option</Label>
        </div>
      </RadioGroup>
    </div>
  )
}`;

// =============================================================================
// Usage Code
// =============================================================================

const usageCode = `import { 
  RadioGroup, 
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
  RadioButtonGroup,
  RadioButton,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Basic usage
<RadioGroup defaultValue="option-1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-1" />
    <Label>Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-2" />
    <Label>Option 2</Label>
  </div>
</RadioGroup>

// With labels and descriptions
<RadioGroup defaultValue="comfortable">
  <RadioWithLabel
    value="comfortable"
    label="Comfortable"
    description="More spacing for better readability."
  />
</RadioGroup>

// Card variant with icons
<RadioGroup value={payment} onValueChange={setPayment}>
  <RadioCard
    value="card"
    label="Credit Card"
    description="Pay with Visa, Mastercard"
    icon={<CreditCardIcon />}
  />
</RadioGroup>

// Segmented control style
<RadioButtonGroup defaultValue="monthly">
  <RadioButton value="monthly">Monthly</RadioButton>
  <RadioButton value="yearly">Yearly</RadioButton>
</RadioButtonGroup>

// With validation
<RadioGroup 
  required 
  error={hasError} 
  errorMessage="Please select an option"
>
  ...
</RadioGroup>`;

// =============================================================================
// Main Page Component
// =============================================================================

export default function RadioGroupPage() {
  const features = [
    {
      icon: <IconCircleCheck className="h-4 w-4" />,
      title: "Accessible",
      description:
        "WAI-ARIA compliant with proper roles, keyboard navigation, and screen reader support.",
    },
    {
      icon: <IconPalette className="h-4 w-4" />,
      title: "Multiple Variants",
      description:
        "Standard radio, cards with icons, and segmented button groups for different use cases.",
    },
    {
      icon: <IconLayoutGrid className="h-4 w-4" />,
      title: "Flexible Layout",
      description:
        "Supports vertical and horizontal orientations, multiple sizes, and color variants.",
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Radio Group"
          description="Simple radio group with manual labels."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "with-label",
      label: "With Labels",
      demo: (
        <DemoWrapper
          title="RadioWithLabel"
          description="Convenience component with built-in label and description."
          code={withLabelCode}
        >
          <WithLabelDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Small, default, and large radio button sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "colors",
      label: "Colors",
      demo: (
        <DemoWrapper
          title="Color Variants"
          description="Radio items support color variants for different contexts."
          code={colorsCode}
        >
          <ColorsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "orientation",
      label: "Orientation",
      demo: (
        <DemoWrapper
          title="Orientation"
          description="Vertical and horizontal layout options."
          code={orientationCode}
        >
          <OrientationDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "cards",
      label: "Cards",
      demo: (
        <DemoWrapper
          title="Radio Cards"
          description="Card-style radio options with icon support for richer selections."
          code={cardVariantCode}
        >
          <CardVariantDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "segmented",
      label: "Segmented",
      demo: (
        <DemoWrapper
          title="Segmented Control"
          description="Button-style radio group for visual selection between options."
          code={segmentedControlCode}
        >
          <SegmentedControlDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "validation",
      label: "Validation",
      demo: (
        <DemoWrapper
          title="Error State & Validation"
          description="Radio groups support error states with accessible error messages."
          code={validationCode}
        >
          <ValidationDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "disabled",
      label: "Disabled",
      demo: (
        <DemoWrapper
          title="Disabled State"
          description="Disable entire group or individual radio items."
          code={disabledCode}
        >
          <DisabledDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Tab", description: "Move focus to the radio group" },
    { keys: "Space", description: "Select focused radio item" },
    { keys: "Arrow Down / Right", description: "Move to next option" },
    { keys: "Arrow Up / Left", description: "Move to previous option" },
  ];

  const apiSections = [
    {
      title: "RadioGroup",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Controlled value of the selected radio item.",
        },
        {
          prop: "defaultValue",
          type: "string",
          description: "Default value for uncontrolled usage.",
        },
        {
          prop: "onValueChange",
          type: "(value: string) => void",
          description: "Callback when the selected value changes.",
        },
        {
          prop: "orientation",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          description: "Layout direction of the radio group.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable all radio items in the group.",
        },
        {
          prop: "required",
          type: "boolean",
          default: "false",
          description: "Mark the field as required.",
        },
        {
          prop: "error",
          type: "boolean",
          default: "false",
          description: "Display error state styling.",
        },
        {
          prop: "errorMessage",
          type: "string",
          description: "Error message to display when error is true.",
        },
      ],
    },
    {
      title: "RadioGroupItem",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Unique value for this radio item (required).",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size of the radio indicator.",
        },
        {
          prop: "color",
          type: '"default" | "destructive" | "success" | "warning"',
          default: '"default"',
          description: "Color variant of the radio indicator.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable this specific radio item.",
        },
      ],
    },
    {
      title: "RadioWithLabel",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Unique value for this radio item (required).",
        },
        {
          prop: "label",
          type: "string",
          description: "Label text displayed next to the radio.",
        },
        {
          prop: "description",
          type: "string",
          description: "Optional description text below the label.",
        },
      ],
    },
    {
      title: "RadioCard",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Unique value for this radio card (required).",
        },
        {
          prop: "label",
          type: "string",
          description: "Label text for the card.",
        },
        {
          prop: "description",
          type: "string",
          description: "Description text for the card.",
        },
        {
          prop: "icon",
          type: "ReactNode",
          description: "Optional icon displayed on the card.",
        },
      ],
    },
    {
      title: "RadioButtonGroup",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Controlled value of the selected button.",
        },
        {
          prop: "defaultValue",
          type: "string",
          description: "Default value for uncontrolled usage.",
        },
        {
          prop: "onValueChange",
          type: "(value: string) => void",
          description: "Callback when the selected value changes.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size of all buttons in the group.",
        },
      ],
    },
    {
      title: "RadioButton",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Unique value for this button (required).",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size of this specific button.",
        },
        {
          prop: "children",
          type: "ReactNode",
          description: "Button content/label.",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Radio Group"
        description="A set of checkable buttons where only one can be checked at a time. Supports multiple variants including standard radios, card selections, and segmented button groups."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the radio group components in your application."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Complete props reference for all radio group components."
      />
    </ComponentPage>
  );
}
