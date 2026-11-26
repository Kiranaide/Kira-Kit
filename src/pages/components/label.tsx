"use client";

import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  Label,
  LabelGroup,
  LabelDescription,
  KiraLabel,
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
  IconAccessible,
  IconPalette,
  IconComponents,
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

function BasicLabelDemo() {
  return (
    <div className="max-w-md space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  );
}

const basicLabelCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function BasicLabelDemo() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  )
}`;

function KiraLabelDemo() {
  return (
    <div className="max-w-md space-y-4">
      <KiraLabel
        htmlFor="kira-email"
        icon={<IconMail />}
        required
        description="We'll never share your email."
      >
        Email
      </KiraLabel>
      <Input id="kira-email" type="email" placeholder="you@example.com" />
    </div>
  );
}

const kiraLabelCode = `import { KiraLabel } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconMail } from "@tabler/icons-react"

<KiraLabel
  htmlFor="kira-email"
  icon={<IconMail />}
  required
  description="We'll never share your email."
>
  Email
</KiraLabel>
<Input id="kira-email" type="email" placeholder="you@example.com" />`;

function CounterLabelDemo() {
  const [value, setValue] = React.useState("");
  const maxCount = 60;

  return (
    <div className="max-w-md space-y-2">
      <KiraLabel htmlFor="kira-bio" count={value.length} maxCount={maxCount}>
        Bio
      </KiraLabel>
      <Input
        id="kira-bio"
        value={value}
        maxLength={maxCount}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tell us about yourself"
      />
      <KiraLabel htmlFor="kira-bio-near" count={48} maxCount={60}>
        Near limit (80%)
      </KiraLabel>
      <Input id="kira-bio-near" value={"x".repeat(48)} readOnly />
      <KiraLabel htmlFor="kira-bio-over" count={61} maxCount={60}>
        Over limit
      </KiraLabel>
      <Input id="kira-bio-over" value={"x".repeat(61)} readOnly />
    </div>
  );
}

const counterLabelCode = `import { useState } from "react"
import { KiraLabel } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function CounterLabelDemo() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-2">
      <KiraLabel htmlFor="kira-bio" count={value.length} maxCount={60}>
        Bio
      </KiraLabel>
      <Input
        id="kira-bio"
        value={value}
        maxLength={60}
        onChange={(e) => setValue(e.target.value)}
      />
      <KiraLabel htmlFor="kira-bio-near" count={48} maxCount={60}>
        Near limit (80%)
      </KiraLabel>
      <KiraLabel htmlFor="kira-bio-over" count={61} maxCount={60}>
        Over limit
      </KiraLabel>
    </div>
  )
}`;

function resolveEmailValidationState(value: string) {
  if (value.length === 0) {
    return undefined;
  }

  if (value.includes("@")) {
    return "valid" as const;
  }

  return "invalid" as const;
}

function resolveEmailValidationMessage(state: "valid" | "invalid" | undefined) {
  if (state === "invalid") {
    return "Enter a valid email address." as const;
  }

  if (state === "valid") {
    return "Looks good." as const;
  }

  return undefined;
}

function ValidationLabelDemo() {
  const [value, setValue] = React.useState("");
  const state = resolveEmailValidationState(value);

  return (
    <div className="max-w-md space-y-2">
      <KiraLabel
        htmlFor="kira-validate"
        validationState={state}
        validationMessage={resolveEmailValidationMessage(state)}
      >
        Email
      </KiraLabel>
      <Input
        id="kira-validate"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="you@example.com"
        aria-invalid={state === "invalid"}
      />
    </div>
  );
}

const validationLabelCode = `import { KiraLabel } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<KiraLabel
  htmlFor="kira-validate"
  validationState={valid ? "valid" : "invalid"}
  validationMessage={valid ? "Looks good." : "Enter a valid email address."}
>
  Email
</KiraLabel>
<Input id="kira-validate" aria-invalid={!valid} />`;

function WithIconsDemo() {
  return (
    <div className="max-w-md space-y-4">
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
  );
}

const withIconsCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconMail, IconLock, IconUser, IconStar } from "@tabler/icons-react"

export function WithIconsDemo() {
  return (
    <div className="space-y-4">
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
        <Input id="icon-password" type="password" placeholder="Enter password" />
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
  )
}`;

function WithTooltipDemo() {
  return (
    <div className="max-w-md space-y-4">
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
        <Input id="email-tooltip" type="email" placeholder="you@example.com" />
      </div>
    </div>
  );
}

const withTooltipCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconMail } from "@tabler/icons-react"

export function WithTooltipDemo() {
  return (
    <div className="space-y-4">
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
        <Input id="email-tooltip" type="email" placeholder="you@example.com" />
      </div>
    </div>
  )
}`;

function WithCounterDemo() {
  return (
    <div className="max-w-md space-y-4">
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
  );
}

const withCounterCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconFile, IconFolder, IconTag } from "@tabler/icons-react"

export function WithCounterDemo() {
  return (
    <div className="space-y-4">
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
  )
}`;

function SizesDemo() {
  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label size="sm" htmlFor="size-sm">
          Small Label
        </Label>
        <Input id="size-sm" placeholder="Small size (text-xs)" />
      </div>
      <div className="space-y-2">
        <Label size="md" htmlFor="size-md">
          Medium Label (Default)
        </Label>
        <Input id="size-md" placeholder="Medium size (text-sm)" />
      </div>
      <div className="space-y-2">
        <Label size="lg" htmlFor="size-lg">
          Large Label
        </Label>
        <Input id="size-lg" placeholder="Large size (text-base)" />
      </div>
    </div>
  );
}

const sizesCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SizesDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label size="sm" htmlFor="size-sm">Small Label</Label>
        <Input id="size-sm" placeholder="Small size (text-xs)" />
      </div>
      <div className="space-y-2">
        <Label size="md" htmlFor="size-md">Medium Label (Default)</Label>
        <Input id="size-md" placeholder="Medium size (text-sm)" />
      </div>
      <div className="space-y-2">
        <Label size="lg" htmlFor="size-lg">Large Label</Label>
        <Input id="size-lg" placeholder="Large size (text-base)" />
      </div>
    </div>
  )
}`;

function RequiredOptionalDemo() {
  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          Required Fields
        </h4>
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

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          Optional Fields
        </h4>
        <div className="space-y-2">
          <Label optional htmlFor="optional">
            Optional Field
          </Label>
          <Input id="optional" placeholder="Enter value (optional)" />
        </div>
        <div className="space-y-2">
          <Label optional optionalText="not required" htmlFor="optional-custom">
            Custom Optional Text
          </Label>
          <Input id="optional-custom" placeholder="..." />
        </div>
      </div>
    </div>
  );
}

const requiredOptionalCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function RequiredOptionalDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label required htmlFor="required">Required Field</Label>
        <Input id="required" type="email" placeholder="Enter your email" required />
      </div>
      <div className="space-y-2">
        <Label required requiredIndicator="(required)" htmlFor="required-custom">
          Custom Required Indicator
        </Label>
        <Input id="required-custom" placeholder="..." />
      </div>
      <div className="space-y-2">
        <Label optional htmlFor="optional">Optional Field</Label>
        <Input id="optional" placeholder="Enter value (optional)" />
      </div>
      <div className="space-y-2">
        <Label optional optionalText="not required" htmlFor="optional-custom">
          Custom Optional Text
        </Label>
        <Input id="optional-custom" placeholder="..." />
      </div>
    </div>
  )
}`;

function LabelGroupDemo() {
  return (
    <div className="max-w-md space-y-4">
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
  );
}

const labelGroupCode = `import { LabelGroup } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconMail, IconPhone } from "@tabler/icons-react"

export function LabelGroupDemo() {
  return (
    <div className="space-y-4">
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
  )
}`;

function StatesDemo() {
  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label disabled htmlFor="disabled">
          Disabled Field
        </Label>
        <Input id="disabled" placeholder="This field is disabled" disabled />
      </div>

      <div className="space-y-2">
        <Label truncate htmlFor="truncate">
          This is a very long label that will be truncated with an ellipsis when
          it exceeds the maximum width
        </Label>
        <Input id="truncate" placeholder="..." />
      </div>
    </div>
  );
}

const statesCode = `import { Label, LabelDescription } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function StatesDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label error htmlFor="error">Invalid Field</Label>
        <Input
          id="error"
          className="border-destructive focus-visible:ring-destructive"
        />
        <LabelDescription className="text-destructive">
          This field is required
        </LabelDescription>
      </div>
      <div className="space-y-2">
        <Label disabled htmlFor="disabled">Disabled Field</Label>
        <Input id="disabled" disabled />
      </div>
      <div className="space-y-2">
        <Label truncate htmlFor="truncate">
          This is a very long label that will be truncated with an ellipsis...
        </Label>
        <Input id="truncate" />
      </div>
    </div>
  )
}`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-6">
      <div className="space-y-2">
        <KiraLabel
          htmlFor="stress-long"
          icon={<IconMail />}
          required
          truncate
          tooltip="Truncates cleanly inside narrow columns while keeping indicators visible."
          count={48}
          maxCount={60}
          description="Long descriptions wrap onto multiple lines inside a max-w-xs container."
        >
          Primary workspace administration and billing notification email
          address
        </KiraLabel>
        <Input id="stress-long" placeholder="admin@example.com" />
      </div>

      <div className="space-y-2">
        <KiraLabel
          htmlFor="stress-disabled"
          disabled
          optional
          description="Read-only field locked by workspace policy."
        >
          Disabled narrow label
        </KiraLabel>
        <Input id="stress-disabled" disabled placeholder="Locked" />
      </div>

      <div className="space-y-2">
        <KiraLabel htmlFor="stress-empty" count={0} maxCount={100}>
          {""}
        </KiraLabel>
        <Input id="stress-empty" placeholder="Empty label content fallback" />
      </div>
    </div>
  );
}

const stressCode = `import { KiraLabel } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconMail } from "@tabler/icons-react"

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-6">
      <div className="space-y-2">
        <KiraLabel
          htmlFor="stress-long"
          icon={<IconMail />}
          required
          truncate
          tooltip="Truncates cleanly inside narrow columns."
          count={48}
          maxCount={60}
          description="Long descriptions wrap onto multiple lines inside a max-w-xs container."
        >
          Primary workspace administration and billing notification email address
        </KiraLabel>
        <Input id="stress-long" placeholder="admin@example.com" />
      </div>

      <div className="space-y-2">
        <KiraLabel htmlFor="stress-disabled" disabled optional>
          Disabled narrow label
        </KiraLabel>
        <Input id="stress-disabled" disabled placeholder="Locked" />
      </div>

      <div className="space-y-2">
        <KiraLabel htmlFor="stress-empty" count={0} maxCount={100}>
          {""}
        </KiraLabel>
        <Input id="stress-empty" placeholder="Empty label content fallback" />
      </div>
    </div>
  )
}`;

function WithHintDemo() {
  return (
    <div className="max-w-md space-y-2">
      <Label hint="Must be a valid email address" htmlFor="with-hint">
        Email Address
      </Label>
      <Input id="with-hint" type="email" placeholder="you@example.com" />
    </div>
  );
}

const withHintCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function WithHintDemo() {
  return (
    <div className="space-y-2">
      <Label hint="Must be a valid email address" htmlFor="with-hint">
        Email Address
      </Label>
      <Input id="with-hint" type="email" placeholder="you@example.com" />
    </div>
  )
}`;

function ComplexFormDemo() {
  return (
    <div className="max-w-md space-y-4 rounded-lg border p-4">
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
          <a href="#terms-and-conditions" className="underline">
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
  );
}

const complexFormCode = `import { Label, LabelGroup } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { IconUser, IconMail, IconPhone } from "@tabler/icons-react"

export function ComplexFormDemo() {
  return (
    <div className="space-y-4 rounded-lg border p-4">
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
          I agree to the terms and conditions
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="text-sm font-normal" optional>
          Send me marketing emails
        </Label>
      </div>
    </div>
  )
}`;

function RadioGroupDemo() {
  return (
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
          <Label htmlFor="yearly" className="font-normal" counter="Save 17%">
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
  );
}

const radioGroupCode = `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IconStar } from "@tabler/icons-react"

export function RadioGroupDemo() {
  return (
    <div>
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
          <Label htmlFor="yearly" className="font-normal" counter="Save 17%">
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
  )
}`;

function AsElementDemo() {
  return (
    <div className="max-w-md space-y-4">
      <Label as="span" icon={<IconTag />}>
        Rendered as span
      </Label>
      <Label as="div" icon={<IconFolder />}>
        Rendered as div
      </Label>
    </div>
  );
}

const asElementCode = `import { Label } from "@/components/ui/label"
import { IconTag, IconFolder } from "@tabler/icons-react"

export function AsElementDemo() {
  return (
    <div className="space-y-4">
      <Label as="span" icon={<IconTag />}>
        Rendered as span
      </Label>
      <Label as="div" icon={<IconFolder />}>
        Rendered as div
      </Label>
    </div>
  )
}`;

const usageCode = `import { KiraLabel, Label, LabelGroup } from "@/components/ui/label"

// Unified KiraLabel with description, live counter, and validation
<KiraLabel
  htmlFor="bio"
  required
  description="Visible on your public profile."
  count={bio.length}
  maxCount={160}
>
  Bio
</KiraLabel>

// Standalone primitive Label
<Label icon={<IconMail />} tooltip="Used for notifications" htmlFor="email">
  Email
</Label>

// LabelGroup wrapper
<LabelGroup
  label="Email"
  description="We'll never share your email"
  labelProps={{ required: true, icon: <IconMail /> }}
>
  <Input type="email" />
</LabelGroup>`;

export default function LabelPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Label"
        description="Accessible form labels for inputs and form elements with enhanced features including icons, tooltips, counters, and more."
        version="v2.1.0"
      />

      <FeatureGrid
        features={labelPageFeatures}
        description="Accessible labelling capabilities built into Kira Kit."
      />

      <DemoTabs tabs={labelPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        title="Keyboard shortcuts"
        description="Label is not interactive — it points at controls."
        shortcuts={labelPageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common patterns for using Label and KiraLabel."
        notes={[
          {
            label: "KiraLabel",
            body: "Prefer KiraLabel when you need descriptions, live character counts, inline validation messages, or Base UI Field.Label integration.",
          },
          {
            label: "Label",
            body: "Use the standalone Label primitive for simple htmlFor associations or custom render composition.",
          },
        ]}
      />

      <APIReference
        sections={labelPageAPISections}
        title="API reference"
        description="Complete props reference for exported Label components and variants."
      />

      <Changelog
        entries={labelPageChangelogEntries}
        title="Changelog"
        description="Version history for Label."
      />
    </ComponentPage>
  );
}

const labelPageFeatures = [
  {
    title: "Accessible",
    description:
      "Full ARIA support with proper htmlFor association, screen reader friendly required/optional indicators, and opt-in Base UI Field.Label integration.",
    icon: <IconAccessible className="size-4" />,
  },
  {
    title: "Enhanced Features",
    description:
      "Icons, tooltips, counters, hints, live character counts, and inline validation messages with semantic status tokens.",
    icon: <IconPalette className="size-4" />,
  },
  {
    title: "Composable",
    description:
      "Use KiraLabel for all-in-one fields or compose Label, LabelGroup, and sub-parts independently as label, span, or div elements.",
    icon: <IconComponents className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const labelPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Label"
        description="Simple label for form inputs."
        code={basicLabelCode}
      >
        <BasicLabelDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Small, medium, and large label sizes."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "required",
    label: "Required/Optional",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Required & Optional"
        description="Mark fields as required or optional with customizable indicators."
        code={requiredOptionalCode}
      >
        <RequiredOptionalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "hint",
    label: "Hint",
    group: "Core",
    demo: (
      <DemoWrapper
        title="With Hint"
        description="Add a hint element after the label."
        code={withHintCode}
      >
        <WithHintDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "as",
    label: "As Element",
    group: "Core",
    demo: (
      <DemoWrapper
        title="As Different Element"
        description="Render as span or div using the as prop."
        code={asElementCode}
      >
        <AsElementDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraLabel",
    group: "KiraLabel",
    demo: (
      <DemoWrapper
        title="KiraLabel (unified API)"
        description="One prop-driven component: icon, required, hint, description, counter, and validation."
        code={kiraLabelCode}
      >
        <KiraLabelDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "char-count",
    label: "Counter (live)",
    group: "KiraLabel",
    demo: (
      <DemoWrapper
        title="Live character counter"
        description="count/maxCount update as you type, with a near-limit warning colour and aria-live."
        code={counterLabelCode}
      >
        <CounterLabelDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "validation",
    label: "Validation",
    group: "KiraLabel",
    demo: (
      <DemoWrapper
        title="Inline validation"
        description="validationState drives colour; validationMessage renders a linked aria-live status."
        code={validationLabelCode}
      >
        <ValidationLabelDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "group",
    label: "LabelGroup",
    group: "KiraLabel",
    demo: (
      <DemoWrapper
        title="LabelGroup"
        description="Use LabelGroup for labels with descriptions."
        code={labelGroupCode}
      >
        <LabelGroupDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "Icons",
    group: "Decorators",
    demo: (
      <DemoWrapper
        title="With Icons"
        description="Add icons before or after the label text using icon and iconAfter props."
        code={withIconsCode}
      >
        <WithIconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "tooltip",
    label: "Tooltip",
    group: "Decorators",
    demo: (
      <DemoWrapper
        title="With Tooltip"
        description="Add an info tooltip using the tooltip prop."
        code={withTooltipCode}
      >
        <WithTooltipDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "counter",
    label: "Counter",
    group: "Decorators",
    demo: (
      <DemoWrapper
        title="With Counter"
        description="Display a counter badge using the counter prop."
        code={withCounterCode}
      >
        <WithCounterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="States"
        description="Error, disabled, and truncated states."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long truncated labels, disabled states, and empty label content inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "form",
    label: "Complex Form",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Complex Form Example"
        description="A complete form using various Label features."
        code={complexFormCode}
      >
        <ComplexFormDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "radio",
    label: "Radio Group",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="With Radio Group"
        description="Labels with radio group selections."
        code={radioGroupCode}
      >
        <RadioGroupDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const labelPageShortcuts = [
  {
    keys: "Tab",
    description:
      "Labels are not tab stops; focus moves past the label to its associated control (browser default).",
  },
  {
    keys: "Click / label activation",
    description:
      "Clicking the label focuses the associated control via htmlFor or Base UI Field.Label.",
  },
  {
    keys: "Screen reader",
    description:
      "Reading a label announces the control's name; KiraLabel's validation message renders an <output> polite live region.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const labelPageAPISections = [
  {
    title: "KiraLabel",
    props: [
      {
        prop: "description",
        type: "ReactNode",
        default: "-",
        description:
          "Renders a description below the label (folds LabelGroup).",
      },
      {
        prop: "count",
        type: "number",
        default: "-",
        description: "Live character count shown inline with aria-live.",
      },
      {
        prop: "maxCount",
        type: "number",
        default: "-",
        description:
          "Upper bound for count; near-limit and over show warning/destructive colours.",
      },
      {
        prop: "validationState",
        type: '"valid" | "invalid" | "validating"',
        default: "-",
        description: "Drives label colour and the validation message tone.",
      },
      {
        prop: "validationMessage",
        type: "ReactNode",
        default: "-",
        description: "Inline status message rendered in a polite <output>.",
      },
      {
        prop: "field",
        type: "boolean",
        default: "false",
        description:
          "Render Base UI's Field.Label for automatic control association inside a <Field.Root>.",
      },
    ],
  },
  {
    title: "Label",
    props: [
      {
        prop: "htmlFor",
        type: "string",
        default: "-",
        description: "The ID of the input element this label is for.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "-",
        description: "Icon to display before the label text.",
      },
      {
        prop: "iconAfter",
        type: "ReactNode",
        default: "-",
        description: "Icon to display after the label text.",
      },
      {
        prop: "tooltip",
        type: "ReactNode",
        default: "-",
        description: "Tooltip content shown on info icon hover/focus.",
      },
      {
        prop: "counter",
        type: "number | string",
        default: "-",
        description:
          "Counter badge displayed after the label. Shows 99+ when over 99.",
      },
      {
        prop: "required",
        type: "boolean",
        default: "false",
        description: "Shows required indicator (asterisk by default).",
      },
      {
        prop: "requiredIndicator",
        type: "ReactNode",
        default: '"*"',
        description: "Custom required indicator content.",
      },
      {
        prop: "optional",
        type: "boolean",
        default: "false",
        description: "Shows optional indicator.",
      },
      {
        prop: "optionalText",
        type: "string",
        default: '"optional"',
        description: "Custom text for optional indicator.",
      },
      {
        prop: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Size of the label text.",
      },
      {
        prop: "error",
        type: "boolean",
        default: "false",
        description: "Applies error styling to the label.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Applies disabled styling to the label.",
      },
      {
        prop: "truncate",
        type: "boolean",
        default: "false",
        description: "Truncates long label text with ellipsis.",
      },
      {
        prop: "srOnly",
        type: "ReactNode",
        default: "-",
        description: "Screen-reader-only text prepended inside the label.",
      },
      {
        prop: "hint",
        type: "ReactNode",
        default: "-",
        description: "Hint element displayed after the label.",
      },
      {
        prop: "as",
        type: '"label" | "span" | "div"',
        default: '"label"',
        description: "The element type to render when render is omitted.",
      },
      {
        prop: "render",
        type: "ReactElement",
        default: "-",
        description:
          "Swap the root element (e.g. Base UI <Field.Label />) while keeping merged classes and slots.",
      },
    ],
  },
  {
    title: "LabelGroup",
    props: [
      {
        prop: "label",
        type: "ReactNode",
        default: "-",
        description: "The label content.",
      },
      {
        prop: "description",
        type: "ReactNode",
        default: "-",
        description: "Description shown below the label.",
      },
      {
        prop: "labelProps",
        type: 'Omit<LabelProps, "children">',
        default: "-",
        description: "Props passed to the inner Label component.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "The form element(s) to wrap.",
      },
    ],
  },
  {
    title: "LabelHint",
    props: [
      {
        prop: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Hint typography size matching Label sizes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Hint text content.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "LabelDescription",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Description text content.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "LabelRequired",
    props: [
      {
        prop: "indicator",
        type: "ReactNode",
        default: '"*"',
        description: "Required marker displayed next to the label.",
      },
    ],
  },
  {
    title: "LabelOptional",
    props: [
      {
        prop: "text",
        type: "string",
        default: '"optional"',
        description: "Text rendered inside parentheses next to the label.",
      },
    ],
  },
  {
    title: "LabelCounter",
    props: [
      {
        prop: "count",
        type: "number | string",
        default: "-",
        description: "Value rendered inside the counter pill.",
      },
      {
        prop: "max",
        type: "number",
        default: "99",
        description: "Maximum numeric value before displaying as max+.",
      },
    ],
  },
  {
    title: "LabelIcon",
    props: [
      {
        prop: "position",
        type: '"before" | "after"',
        default: '"before"',
        description: "Placement metadata exposed via data-position.",
      },
    ],
  },
  {
    title: "Variants",
    props: [
      {
        prop: "labelVariants / labelHintVariants",
        type: "cva",
        default: "-",
        description:
          "Exported class-variance-authority recipes for Label and LabelHint.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const labelPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "4 November 2026",
    changes: [
      {
        type: "changed",
        title: "Semantic status tokens",
        description:
          "KiraLabel counter warning tone and valid-state message now use text-warning / text-success tokens instead of raw amber/green hexes — theme-consistent in light and dark.",
      },
      {
        type: "changed",
        title: "Counter over-limit emphasis",
        description:
          "KiraLabelCounter adds font-medium when count exceeds maxCount, matching the destructive emphasis.",
      },
      {
        type: "fixed",
        title: "Lint gate: type-assertion safety comment",
        description:
          "The rest-spread cast on Label's root props carries a SAFETY invariant comment; cast narrowed to React.HTMLAttributes<HTMLElement>.",
      },
      {
        type: "added",
        title: "aria-describedby pattern documented",
        description:
          "Validation demo documents the consumer-side control wiring: KiraLabel renders the polite live region; the consumer links it with aria-describedby on the control.",
      },
      {
        type: "added",
        title: "Keyboard interaction section",
        description:
          "Honest a11y rows: labels are not tab stops, click activation focuses the control, live-region announcement.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "13 July 2026",
    changes: [
      {
        type: "added",
        title: "KiraLabel mega-component",
        description:
          "One prop-driven label with description, live character counter, inline validation, and an opt-in Base UI Field.Label path for automatic control association.",
      },
      {
        type: "fixed",
        title: "Duplicate disabled styling & gap",
        description:
          "Disabled opacity and the label gap are no longer applied in two places.",
      },
      {
        type: "breaking",
        title: "truncate no longer hard-caps width",
        description:
          "The hard-coded 200px max-width cap was removed; truncation now flex-clamps to the available width.",
      },
      {
        type: "changed",
        title: "labelVariants / labelHintVariants exported",
        description: "Variant helpers are now part of the public API.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
