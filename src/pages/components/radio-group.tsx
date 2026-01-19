import * as React from "react";
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
  IconCreditCard,
  IconBuildingBank,
  IconWallet,
} from "@tabler/icons-react";

export function RadioGroupPage() {
  const [payment, setPayment] = React.useState("card");
  const [selectedPlan, setSelectedPlan] = React.useState<string | undefined>();
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = () => {
    if (!selectedPlan) {
      setShowError(true);
    } else {
      setShowError(false);
      alert(`Selected plan: ${selectedPlan}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Radio Group</h1>
        <p className="text-muted-foreground">
          A set of checkable buttons where only one can be checked at a time.
        </p>
      </header>

      {/* Basic Radio Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Radio Group
        </h2>
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
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Radio items support color variants for different contexts.
        </p>
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
      </section>

      {/* RadioWithLabel */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          RadioWithLabel
        </h2>
        <p className="text-sm text-muted-foreground">
          A convenience component with built-in label and description.
        </p>
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
      </section>

      {/* Error State with Validation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Error State & Validation
        </h2>
        <p className="text-sm text-muted-foreground">
          Radio groups support error states with accessible error messages.
        </p>
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
              <RadioWithLabel
                value="free"
                label="Free"
                description="$0/month"
              />
              <RadioWithLabel
                value="pro"
                label="Pro"
                description="$9.99/month"
              />
              <RadioWithLabel
                value="enterprise"
                label="Enterprise"
                description="Contact sales"
              />
            </RadioGroup>
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled State
        </h2>
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
      </section>

      {/* Radio Button Group (Segmented Control) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Radio Button Group (Segmented Control)
        </h2>
        <p className="text-sm text-muted-foreground">
          A segmented control style for visual selection between options.
        </p>
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
      </section>

      {/* Radio Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Radio Cards
        </h2>
        <p className="text-sm text-muted-foreground">
          Card-style radio options with icon support.
        </p>
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
      </section>

      {/* Horizontal Orientation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal Orientation
        </h2>
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
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
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
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { 
  RadioGroup, 
  RadioGroupItem,
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
</RadioGroup>

// With color variant
<RadioGroupItem value="danger" color="destructive" />

// With validation
<RadioGroup 
  required 
  error={hasError} 
  errorMessage="Please select an option"
>
  ...
</RadioGroup>

// Segmented control style
<RadioButtonGroup defaultValue="monthly">
  <RadioButton value="monthly">Monthly</RadioButton>
  <RadioButton value="yearly">Yearly</RadioButton>
</RadioButtonGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
