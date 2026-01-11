import * as React from "react";
import {
  RadioGroup,
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  IconCreditCard,
  IconBuildingBank,
  IconWallet,
} from "@tabler/icons-react";

export function RadioGroupPage() {
  const [payment, setPayment] = React.useState("card");

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
            {`import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

<RadioGroup defaultValue="option-1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-1" />
    <Label>Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-2" />
    <Label>Option 2</Label>
  </div>
</RadioGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
