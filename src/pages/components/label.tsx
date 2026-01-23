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
  UsageBlock,
  APIReference,
} from "@/components/docs";

// =============================================================================
// Demo: Basic Label
// =============================================================================
function BasicLabelDemo() {
  return (
    <div className="space-y-2 max-w-md">
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

// =============================================================================
// Demo: With Icons
// =============================================================================
function WithIconsDemo() {
  return (
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
  );
}

const withIconsCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconMail, IconLock, IconUser, IconStar } from "@tabler/icons-react"

export function WithIconsDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label icon={<IconMail />} htmlFor="email">
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="space-y-2">
        <Label icon={<IconLock />} htmlFor="password">
          Password
        </Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>

      <div className="space-y-2">
        <Label
          icon={<IconUser />}
          iconAfter={<IconStar className="text-warning" />}
          htmlFor="premium"
        >
          Premium User
        </Label>
        <Input id="premium" placeholder="VIP username" />
      </div>
    </div>
  )
}`;

// =============================================================================
// Demo: With Tooltip
// =============================================================================
function WithTooltipDemo() {
  return (
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
          htmlFor="email"
        >
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
    </div>
  )
}`;

// =============================================================================
// Demo: With Counter
// =============================================================================
function WithCounterDemo() {
  return (
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

// =============================================================================
// Demo: Sizes
// =============================================================================
function SizesDemo() {
  return (
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
  );
}

const sizesCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SizesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <Label size="sm" htmlFor="sm">Small Label</Label>
        <Input id="sm" placeholder="Small size (text-xs)" />
      </div>
      <div>
        <Label size="md" htmlFor="md">Medium Label (Default)</Label>
        <Input id="md" placeholder="Medium size (text-sm)" />
      </div>
      <div>
        <Label size="lg" htmlFor="lg">Large Label</Label>
        <Input id="lg" placeholder="Large size (text-base)" />
      </div>
    </div>
  )
}`;

// =============================================================================
// Demo: Required & Optional
// =============================================================================
function RequiredOptionalDemo() {
  return (
    <div className="space-y-6 max-w-md">
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
      {/* Required Fields */}
      <div className="space-y-2">
        <Label required htmlFor="required">
          Required Field
        </Label>
        <Input id="required" placeholder="..." required />
      </div>

      <div className="space-y-2">
        <Label required requiredIndicator="(required)" htmlFor="custom-req">
          Custom Required Indicator
        </Label>
        <Input id="custom-req" placeholder="..." />
      </div>

      {/* Optional Fields */}
      <div className="space-y-2">
        <Label optional htmlFor="optional">
          Optional Field
        </Label>
        <Input id="optional" placeholder="..." />
      </div>

      <div className="space-y-2">
        <Label optional optionalText="not required" htmlFor="custom-opt">
          Custom Optional Text
        </Label>
        <Input id="custom-opt" placeholder="..." />
      </div>
    </div>
  )
}`;

// =============================================================================
// Demo: LabelGroup
// =============================================================================
function LabelGroupDemo() {
  return (
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

// =============================================================================
// Demo: States
// =============================================================================
function StatesDemo() {
  return (
    <div className="space-y-6 max-w-md">
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
      {/* Error State */}
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

      {/* Disabled State */}
      <div className="space-y-2">
        <Label disabled htmlFor="disabled">Disabled Field</Label>
        <Input id="disabled" disabled />
      </div>

      {/* Truncated Label */}
      <div className="space-y-2">
        <Label truncate htmlFor="truncate">
          This is a very long label that will be truncated...
        </Label>
        <Input id="truncate" />
      </div>
    </div>
  )
}`;

// =============================================================================
// Demo: With Hint
// =============================================================================
function WithHintDemo() {
  return (
    <div className="space-y-2 max-w-md">
      <Label
        hint={<LabelHint>Must be a valid email address</LabelHint>}
        htmlFor="with-hint"
      >
        Email Address
      </Label>
      <Input id="with-hint" type="email" placeholder="you@example.com" />
    </div>
  );
}

const withHintCode = `import { Label, LabelHint } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function WithHintDemo() {
  return (
    <div className="space-y-2">
      <Label
        hint={<LabelHint>Must be a valid email address</LabelHint>}
        htmlFor="email"
      >
        Email Address
      </Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  )
}`;

// =============================================================================
// Demo: Complex Form
// =============================================================================
function ComplexFormDemo() {
  return (
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
  );
}

const complexFormCode = `import { Label, LabelGroup } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { IconUser, IconMail, IconPhone } from "@tabler/icons-react"

export function ComplexFormDemo() {
  return (
    <div className="p-4 border rounded-lg space-y-4">
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

// =============================================================================
// Demo: Radio Group
// =============================================================================
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

// =============================================================================
// Demo: As Different Element
// =============================================================================
function AsElementDemo() {
  return (
    <div className="space-y-4 max-w-md">
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

// =============================================================================
// Usage Code
// =============================================================================
const usageCode = `import { Label, LabelGroup, LabelHint } from "@/components/ui/label"

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
<Label as="span">Rendered as span</Label>`;

// =============================================================================
// Features
// =============================================================================
const features = [
  {
    title: "Accessible",
    description:
      "Full ARIA support with proper htmlFor association, screen reader friendly required/optional indicators, and keyboard navigation.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Enhanced Features",
    description:
      "Icons, tooltips, counters, hints, and descriptions. Supports required/optional states with customizable indicators.",
    icon: <IconPalette className="h-4 w-4" />,
  },
  {
    title: "Composable",
    description:
      "Use Label standalone or with LabelGroup for label + description patterns. Render as label, span, or div elements.",
    icon: <IconComponents className="h-4 w-4" />,
  },
];

// =============================================================================
// API Reference Sections
// =============================================================================
const apiSections = [
  {
    title: "Label",
    props: [
      {
        prop: "htmlFor",
        type: "string",
        description: "The ID of the input element this label is for.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Icon to display before the label text.",
      },
      {
        prop: "iconAfter",
        type: "ReactNode",
        description: "Icon to display after the label text.",
      },
      {
        prop: "tooltip",
        type: "string",
        description: "Tooltip text shown on info icon hover.",
      },
      {
        prop: "counter",
        type: "number | string",
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
        prop: "hint",
        type: "ReactNode",
        description: "Hint element displayed after the label.",
      },
      {
        prop: "as",
        type: '"label" | "span" | "div"',
        default: '"label"',
        description: "The element type to render.",
      },
    ],
  },
  {
    title: "LabelGroup",
    props: [
      {
        prop: "label",
        type: "string",
        description: "The label text content.",
      },
      {
        prop: "description",
        type: "string",
        description: "Description text shown below the label.",
      },
      {
        prop: "labelProps",
        type: "LabelProps",
        description: "Props passed to the Label component.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "The form element(s) to wrap.",
      },
    ],
  },
  {
    title: "LabelHint",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        description: "Hint text content.",
      },
      {
        prop: "className",
        type: "string",
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
        description: "Description text content.",
      },
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes.",
      },
    ],
  },
];

// =============================================================================
// Demo Tabs Configuration
// =============================================================================
const demoTabs = [
  {
    value: "basic",
    label: "Basic",
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
    value: "icons",
    label: "Icons",
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
    value: "sizes",
    label: "Sizes",
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
    value: "group",
    label: "LabelGroup",
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
    value: "states",
    label: "States",
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
    value: "hint",
    label: "Hint",
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
    value: "form",
    label: "Complex Form",
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
  {
    value: "as",
    label: "As Element",
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
];

// =============================================================================
// Main Page Component
// =============================================================================
export default function LabelPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Label"
        description="Accessible form labels for inputs and form elements with enhanced features including icons, tooltips, counters, and more."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common patterns for using the Label component."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Complete props reference for Label components."
      />
    </ComponentPage>
  );
}
