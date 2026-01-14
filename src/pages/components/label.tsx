"use client";

import {
  Label,
  LabelHint,
  LabelGroup,
  LabelDescription,
} from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconFile,
  IconFolder,
  IconTag,
  IconStar,
} from "@tabler/icons-react";

export function LabelPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Label</h1>
        <p className="text-muted-foreground">
          Accessible form labels for inputs and form elements with enhanced
          features including icons, tooltips, counters, and more.
        </p>
      </header>

      {/* Basic Label */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Label
        </h2>
        <div className="space-y-2 max-w-md">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
        <p className="text-sm text-muted-foreground">
          Add icons before or after the label text using{" "}
          <code className="bg-muted px-1 rounded">icon</code> and{" "}
          <code className="bg-muted px-1 rounded">iconAfter</code>.
        </p>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label icon={<IconMail />} htmlFor="icon-email">
              Email Address
            </Label>
            <Input id="icon-email" type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label icon={<IconLock />} htmlFor="icon-password">
              Password
            </Label>
            <Input
              id="icon-password"
              type="password"
              placeholder="Enter password"
            />
          </div>

          <div className="space-y-2">
            <Label
              icon={<IconUser />}
              iconAfter={<IconStar className="text-warning" />}
              htmlFor="icon-both"
            >
              Premium User
            </Label>
            <Input id="icon-both" placeholder="VIP username" />
          </div>
        </div>
      </section>

      {/* With Tooltip */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Tooltip
        </h2>
        <p className="text-sm text-muted-foreground">
          Add an info tooltip using the{" "}
          <code className="bg-muted px-1 rounded">tooltip</code> prop.
        </p>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label
              tooltip="Your API key is used to authenticate requests. Keep it secret!"
              htmlFor="api-key"
            >
              API Key
            </Label>
            <Input id="api-key" type="password" placeholder="sk-..." />
          </div>

          <div className="space-y-2">
            <Label
              icon={<IconMail />}
              required
              tooltip="We'll send a confirmation link to this address"
              htmlFor="email-tooltip"
            >
              Email Address
            </Label>
            <Input
              id="email-tooltip"
              type="email"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </section>

      {/* With Counter */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Counter
        </h2>
        <p className="text-sm text-muted-foreground">
          Display a counter badge using the{" "}
          <code className="bg-muted px-1 rounded">counter</code> prop.
        </p>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label icon={<IconFile />} counter={12} htmlFor="files">
              Files
            </Label>
            <Input id="files" placeholder="Select files..." />
          </div>

          <div className="space-y-2">
            <Label icon={<IconFolder />} counter={3} htmlFor="folders">
              Folders
            </Label>
            <Input id="folders" placeholder="Select folders..." />
          </div>

          <div className="space-y-2">
            <Label icon={<IconTag />} counter={150} htmlFor="tags">
              Tags (shows 99+ when over max)
            </Label>
            <Input id="tags" placeholder="Add tags..." />
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <Label size="sm" htmlFor="size-sm">
              Small Label
            </Label>
            <Input id="size-sm" placeholder="Small size (text-xs)" />
          </div>
          <div>
            <Label size="md" htmlFor="size-md">
              Medium Label (Default)
            </Label>
            <Input id="size-md" placeholder="Medium size (text-sm)" />
          </div>
          <div>
            <Label size="lg" htmlFor="size-lg">
              Large Label
            </Label>
            <Input id="size-lg" placeholder="Large size (text-base)" />
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Required Field
        </h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label required htmlFor="required">
              Required Field
            </Label>
            <Input
              id="required"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              required
              requiredIndicator="(required)"
              htmlFor="required-custom"
            >
              Custom Required Indicator
            </Label>
            <Input id="required-custom" placeholder="..." />
          </div>
        </div>
      </section>

      {/* Optional Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Optional Field
        </h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label optional htmlFor="optional">
              Optional Field
            </Label>
            <Input id="optional" placeholder="Enter value (optional)" />
          </div>

          <div className="space-y-2">
            <Label
              optional
              optionalText="not required"
              htmlFor="optional-custom"
            >
              Custom Optional Text
            </Label>
            <Input id="optional-custom" placeholder="..." />
          </div>
        </div>
      </section>

      {/* Truncation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Truncation
        </h2>
        <p className="text-sm text-muted-foreground">
          Long labels can be truncated with the{" "}
          <code className="bg-muted px-1 rounded">truncate</code> prop.
        </p>
        <div className="space-y-2 max-w-md">
          <Label truncate htmlFor="truncate">
            This is a very long label that will be truncated with an ellipsis
            when it exceeds the maximum width
          </Label>
          <Input id="truncate" placeholder="..." />
        </div>
      </section>

      {/* With Hint */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Hint
        </h2>
        <div className="space-y-2 max-w-md">
          <Label
            hint={<LabelHint>Must be a valid email address</LabelHint>}
            htmlFor="with-hint"
          >
            Email Address
          </Label>
          <Input id="with-hint" type="email" placeholder="you@example.com" />
        </div>
      </section>

      {/* LabelGroup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          LabelGroup
        </h2>
        <p className="text-sm text-muted-foreground">
          Use LabelGroup for labels with descriptions.
        </p>
        <div className="space-y-4 max-w-md">
          <LabelGroup
            label="Notification Email"
            description="We'll send important updates to this address"
            labelProps={{ required: true, icon: <IconMail /> }}
          >
            <Input placeholder="notifications@example.com" type="email" />
          </LabelGroup>

          <LabelGroup
            label="Phone Number"
            description="For two-factor authentication"
            labelProps={{ optional: true, icon: <IconPhone /> }}
          >
            <Input placeholder="+1 (555) 000-0000" type="tel" />
          </LabelGroup>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Error State
        </h2>
        <div className="space-y-2 max-w-md">
          <Label error htmlFor="error">
            Invalid Field
          </Label>
          <Input
            id="error"
            type="email"
            placeholder="Enter your email"
            className="border-destructive focus-visible:ring-destructive"
          />
          <LabelDescription className="text-destructive">
            This field is required
          </LabelDescription>
        </div>
      </section>

      {/* As Different Element */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          As Different Element
        </h2>
        <p className="text-sm text-muted-foreground">
          Render as span or div using the{" "}
          <code className="bg-muted px-1 rounded">as</code> prop.
        </p>
        <div className="space-y-4 max-w-md">
          <Label as="span" icon={<IconTag />}>
            Rendered as span
          </Label>
          <Label as="div" icon={<IconFolder />}>
            Rendered as div
          </Label>
        </div>
      </section>

      {/* Complex Form Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Complex Form Example
        </h2>
        <div className="max-w-md p-4 border rounded-lg space-y-4">
          <LabelGroup
            label="Full Name"
            labelProps={{ required: true, icon: <IconUser />, size: "sm" }}
          >
            <Input placeholder="John Doe" />
          </LabelGroup>

          <LabelGroup
            label="Email Address"
            description="We'll never share your email"
            labelProps={{
              required: true,
              icon: <IconMail />,
              tooltip: "Used for account recovery and notifications",
            }}
          >
            <Input type="email" placeholder="john@example.com" />
          </LabelGroup>

          <LabelGroup
            label="Phone Number"
            description="For two-factor authentication"
            labelProps={{ optional: true, icon: <IconPhone /> }}
          >
            <Input type="tel" placeholder="+1 (555) 000-0000" />
          </LabelGroup>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <a href="#" className="underline">
                terms and conditions
              </a>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing" className="text-sm font-normal" optional>
              Send me marketing emails
            </Label>
          </div>
        </div>
      </section>

      {/* Radio Group with Labels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Radio Group
        </h2>
        <div className="max-w-md">
          <Label required icon={<IconStar />} htmlFor="subscription">
            Subscription Plan
          </Label>
          <RadioGroup defaultValue="monthly" className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal">
                Monthly - $9.99/mo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yearly" id="yearly" />
              <Label
                htmlFor="yearly"
                className="font-normal"
                counter="Save 17%"
              >
                Yearly - $99.99/yr
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lifetime" id="lifetime" />
              <Label
                htmlFor="lifetime"
                className="font-normal"
                iconAfter={<IconStar className="text-warning" />}
              >
                Lifetime - $199.99
              </Label>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled State
        </h2>
        <div className="space-y-2 max-w-md">
          <Label disabled htmlFor="disabled">
            Disabled Field
          </Label>
          <Input id="disabled" placeholder="This field is disabled" disabled />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Label, LabelGroup, LabelHint, LabelCounter } from "@/components/ui/label"

// Basic
<Label htmlFor="input-id">Label Text</Label>

// With icon
<Label icon={<IconMail />} htmlFor="email">Email</Label>

// With tooltip
<Label tooltip="Help text here" htmlFor="api-key">API Key</Label>

// With counter
<Label counter={12} htmlFor="files">Files</Label>

// Required with custom indicator
<Label required requiredIndicator="(required)">Email</Label>

// Optional with custom text
<Label optional optionalText="not required">Phone</Label>

// Truncated long label
<Label truncate>Very long label text...</Label>

// LabelGroup for label + description
<LabelGroup
  label="Email"
  description="We'll never share your email"
  labelProps={{ required: true, icon: <IconMail /> }}
>
  <Input type="email" />
</LabelGroup>

// Render as different element
<Label as="span">Rendered as span</Label>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
