import * as React from "react";
import {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
  CheckboxCard,
  KiraCheckbox,
} from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  IconHeart,
  IconStar,
  IconBookmark,
  IconDeviceMobile,
  IconSettings,
  IconUser,
  IconShield,
  IconCheck,
  IconPalette,
  IconAccessible,
  IconLock,
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
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
}

const basicCode = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function BasicCheckbox() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="size-sm" size="sm" checked />
        <Label htmlFor="size-sm">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="size-default" size="default" checked />
        <Label htmlFor="size-default">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="size-lg" size="lg" checked />
        <Label htmlFor="size-lg">Large</Label>
      </div>
    </div>
  );
}

const sizesCode = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function SizeVariants() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="size-sm" size="sm" checked />
        <Label htmlFor="size-sm">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="size-default" size="default" checked />
        <Label htmlFor="size-default">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="size-lg" size="lg" checked />
        <Label htmlFor="size-lg">Large</Label>
      </div>
    </div>
  )
}`;

function StylesDemo() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-sm font-medium">Default</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="default" id="var-default-unchecked" />
          <Checkbox variant="default" id="var-default-checked" checked />
          <Checkbox
            variant="default"
            id="var-default-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Outline</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="outline" id="var-outline-unchecked" />
          <Checkbox variant="outline" id="var-outline-checked" checked />
          <Checkbox
            variant="outline"
            id="var-outline-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Filled</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="filled" id="var-filled-unchecked" />
          <Checkbox variant="filled" id="var-filled-checked" checked />
          <Checkbox
            variant="filled"
            id="var-filled-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Soft</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="soft" id="var-soft-unchecked" />
          <Checkbox variant="soft" id="var-soft-checked" checked />
          <Checkbox
            variant="soft"
            id="var-soft-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
    </div>
  );
}

const stylesCode = `import { Checkbox } from "@/components/ui/checkbox"

export function StyleVariants() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Default variant */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Default</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="default" />
          <Checkbox variant="default" checked />
          <Checkbox variant="default" checked="indeterminate" />
        </div>
      </div>

      {/* Outline variant */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Outline</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="outline" />
          <Checkbox variant="outline" checked />
          <Checkbox variant="outline" checked="indeterminate" />
        </div>
      </div>

      {/* Filled variant */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Filled</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="filled" />
          <Checkbox variant="filled" checked />
          <Checkbox variant="filled" checked="indeterminate" />
        </div>
      </div>

      {/* Soft variant */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Soft</p>
        <div className="flex items-center gap-4">
          <Checkbox variant="soft" />
          <Checkbox variant="soft" checked />
          <Checkbox variant="soft" checked="indeterminate" />
        </div>
      </div>
    </div>
  )
}`;

function ColorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-sm font-medium">Success</p>
        <div className="flex items-center gap-4">
          <Checkbox color="success" id="col-success-unchecked" />
          <Checkbox color="success" id="col-success-checked" checked />
          <Checkbox
            color="success"
            id="col-success-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Destructive</p>
        <div className="flex items-center gap-4">
          <Checkbox color="destructive" id="col-destructive-unchecked" />
          <Checkbox
            color="destructive"
            id="col-destructive-checked"
            checked
          />
          <Checkbox
            color="destructive"
            id="col-destructive-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Warning</p>
        <div className="flex items-center gap-4">
          <Checkbox color="warning" id="col-warning-unchecked" />
          <Checkbox color="warning" id="col-warning-checked" checked />
          <Checkbox
            color="warning"
            id="col-warning-indeterminate"
            checked="indeterminate"
          />
        </div>
      </div>
    </div>
  );
}

const colorsCode = `import { Checkbox } from "@/components/ui/checkbox"

export function ColorVariants() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Success color */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Success</p>
        <div className="flex items-center gap-4">
          <Checkbox color="success" />
          <Checkbox color="success" checked />
          <Checkbox color="success" checked="indeterminate" />
        </div>
      </div>

      {/* Destructive color */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Destructive</p>
        <div className="flex items-center gap-4">
          <Checkbox color="destructive" />
          <Checkbox color="destructive" checked />
          <Checkbox color="destructive" checked="indeterminate" />
        </div>
      </div>

      {/* Warning color */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Warning</p>
        <div className="flex items-center gap-4">
          <Checkbox color="warning" />
          <Checkbox color="warning" checked />
          <Checkbox color="warning" checked="indeterminate" />
        </div>
      </div>
    </div>
  )
}`;

function IconsDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use the customIcon prop to display a different icon when checked.
      </p>
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="heart"
            variant="filled"
            customIcon={<IconHeart className="h-3.5 w-3.5" strokeWidth={3} />}
          />
          <Label htmlFor="heart">Favorite</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="star"
            variant="filled"
            customIcon={<IconStar className="h-3.5 w-3.5" strokeWidth={3} />}
          />
          <Label htmlFor="star">Star</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bookmark"
            variant="filled"
            customIcon={
              <IconBookmark className="h-3.5 w-3.5" strokeWidth={3} />
            }
          />
          <Label htmlFor="bookmark">Bookmark</Label>
        </div>
      </div>
    </div>
  );
}

const iconsCode = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { IconHeart, IconStar, IconBookmark } from "@tabler/icons-react"

export function CustomIcons() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="heart"
          variant="filled"
          customIcon={<IconHeart className="h-3.5 w-3.5" strokeWidth={3} />}
        />
        <Label htmlFor="heart">Favorite</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="star"
          variant="filled"
          customIcon={<IconStar className="h-3.5 w-3.5" strokeWidth={3} />}
        />
        <Label htmlFor="star">Star</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="bookmark"
          variant="filled"
          customIcon={<IconBookmark className="h-3.5 w-3.5" strokeWidth={3} />}
        />
        <Label htmlFor="bookmark">Bookmark</Label>
      </div>
    </div>
  )
}`;

function StatesDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium">Loading State</p>
        <div className="flex items-center gap-6">
          <Checkbox id="loading-unchecked" loading />
          <Checkbox id="loading-checked" checked loading />
          <Checkbox id="loading-indeterminate" checked="indeterminate" loading />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Error State</p>
        <div className="flex items-center gap-6">
          <Checkbox id="error-unchecked" error />
          <Checkbox id="error-checked" checked error />
          <Checkbox id="error-indeterminate" checked="indeterminate" error />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Disabled States</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label htmlFor="disabled-unchecked" className="text-muted-foreground">
              Disabled unchecked
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-checked" disabled checked />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-readonly" readOnly checked />
            <Label htmlFor="disabled-readonly" className="text-muted-foreground">
              Readonly checked
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

const statesCode = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxStates() {
  return (
    <div className="space-y-6">
      {/* Loading State */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Loading State</p>
        <div className="flex items-center gap-6">
          <Checkbox loading />
          <Checkbox checked loading />
          <Checkbox checked="indeterminate" loading />
        </div>
      </div>

      {/* Error State */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Error State</p>
        <div className="flex items-center gap-6">
          <Checkbox error />
          <Checkbox checked error />
          <Checkbox checked="indeterminate" error />
        </div>
      </div>

      {/* Disabled States */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Disabled States</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-checked" disabled checked />
            <Label htmlFor="disabled-checked">Disabled checked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="readonly" readOnly checked />
            <Label htmlFor="readonly">Readonly checked</Label>
          </div>
        </div>
      </div>
    </div>
  )
}`;

function WithLabelDemo() {
  return (
    <div className="space-y-3 max-w-md">
      <CheckboxWithLabel
        label="Enable notifications"
        description="Receive push notifications on your device"
      />
      <CheckboxWithLabel
        label="Marketing emails"
        description="Get updates about new features"
        checked
      />
      <CheckboxWithLabel
        label="With error"
        description="This checkbox has an error state"
        error
      />
      <CheckboxWithLabel
        label="Loading state"
        description="When processing a request"
        loading
      />
    </div>
  );
}

const withLabelCode = `import { CheckboxWithLabel } from "@/components/ui/checkbox"

export function WithLabelDemo() {
  return (
    <div className="space-y-3 max-w-md">
      <CheckboxWithLabel
        label="Enable notifications"
        description="Receive push notifications on your device"
      />
      <CheckboxWithLabel
        label="Marketing emails"
        description="Get updates about new features"
        checked
      />
      <CheckboxWithLabel
        label="With error"
        description="This checkbox has an error state"
        error
      />
      <CheckboxWithLabel
        label="Loading state"
        description="When processing a request"
        loading
      />
    </div>
  )
}`;

function GroupDemo() {
  const [groupValue, setGroupValue] = React.useState<string[]>(["banana"]);

  const fruitOptions = [
    { value: "apple", label: "Apple", description: "A sweet red fruit" },
    { value: "banana", label: "Banana", description: "A yellow curved fruit" },
    { value: "orange", label: "Orange", description: "A citrus fruit" },
    { value: "grape", label: "Grape", disabled: true },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-medium">Vertical Group with Select All</p>
        <div className="max-w-md">
          <CheckboxGroup
            label="Select your favorite fruits"
            description="Choose one or more options"
            options={fruitOptions}
            value={groupValue}
            onChange={setGroupValue}
            showSelectAll
            selectAllLabel="Select all fruits"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: {groupValue.join(", ") || "None"}
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Horizontal Group</p>
        <div className="max-w-lg">
          <CheckboxGroup
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "angular", label: "Angular" },
              { value: "svelte", label: "Svelte" },
            ]}
            orientation="horizontal"
          />
        </div>
      </div>
    </div>
  );
}

const groupCode = `import { useState } from "react"
import { CheckboxGroup } from "@/components/ui/checkbox"

export function CheckboxGroupDemo() {
  const [groupValue, setGroupValue] = useState<string[]>(["banana"])

  const fruitOptions = [
    { value: "apple", label: "Apple", description: "A sweet red fruit" },
    { value: "banana", label: "Banana", description: "A yellow curved fruit" },
    { value: "orange", label: "Orange", description: "A citrus fruit" },
    { value: "grape", label: "Grape", disabled: true },
  ]

  return (
    <div className="space-y-8">
      {/* Vertical Group with Select All */}
      <div className="max-w-md">
        <CheckboxGroup
          label="Select your favorite fruits"
          description="Choose one or more options"
          options={fruitOptions}
          value={groupValue}
          onChange={setGroupValue}
          showSelectAll
          selectAllLabel="Select all fruits"
        />
      </div>
      <p>Selected: {groupValue.join(", ") || "None"}</p>

      {/* Horizontal Group */}
      <div className="max-w-lg">
        <CheckboxGroup
          options={[
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
            { value: "angular", label: "Angular" },
            { value: "svelte", label: "Svelte" },
          ]}
          orientation="horizontal"
        />
      </div>
    </div>
  )
}`;

function CardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <CheckboxCard
        label="Mobile App"
        description="iOS and Android applications"
        icon={<IconDeviceMobile className="h-5 w-5" />}
        variant="outline"
      />
      <CheckboxCard
        label="Settings"
        description="Configure application preferences"
        icon={<IconSettings className="h-5 w-5" />}
        variant="outline"
        checked
      />
      <CheckboxCard
        label="User Profile"
        description="Manage account settings"
        icon={<IconUser className="h-5 w-5" />}
        variant="outline"
        disabled
      />
      <CheckboxCard
        label="Security"
        description="Two-factor authentication"
        icon={<IconShield className="h-5 w-5" />}
        variant="outline"
        error
      />
    </div>
  );
}

const cardCode = `import { CheckboxCard } from "@/components/ui/checkbox"
import {
  IconDeviceMobile,
  IconSettings,
  IconUser,
  IconShield,
} from "@tabler/icons-react"

export function CheckboxCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <CheckboxCard
        label="Mobile App"
        description="iOS and Android applications"
        icon={<IconDeviceMobile className="h-5 w-5" />}
        variant="outline"
      />
      <CheckboxCard
        label="Settings"
        description="Configure application preferences"
        icon={<IconSettings className="h-5 w-5" />}
        variant="outline"
        checked
      />
      <CheckboxCard
        label="User Profile"
        description="Manage account settings"
        icon={<IconUser className="h-5 w-5" />}
        variant="outline"
        disabled
      />
      <CheckboxCard
        label="Security"
        description="Two-factor authentication"
        icon={<IconShield className="h-5 w-5" />}
        variant="outline"
        error
      />
    </div>
  )
}`;

// =============================================================================
// Kira / Loading / Progress demos (v2.0)
// =============================================================================

function KiraDemo() {
  const [fruits, setFruits] = React.useState<string[]>(["apple"]);
  return (
    <div className="flex flex-col gap-6 max-w-md">
      <KiraCheckbox mode="checkbox" variant="soft" color="success" defaultChecked />
      <KiraCheckbox
        mode="label"
        label="Enable notifications"
        description="One prop-driven API — switch modes without new imports."
      />
      <KiraCheckbox
        mode="group"
        label="Fruits"
        options={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
          { value: "orange", label: "Orange" },
        ]}
        value={fruits}
        onChange={setFruits}
        showSelectAll
        showProgress
      />
    </div>
  );
}

const kiraCode = `import { KiraCheckbox } from "@/components/ui/checkbox"

// One component, four modes — driven by \`mode\`
<KiraCheckbox mode="checkbox" variant="soft" color="success" defaultChecked />
<KiraCheckbox mode="label" label="Enable notifications" description="…" />
<KiraCheckbox mode="card" label="Mobile App" icon={<IconDeviceMobile />} />
<KiraCheckbox
  mode="group"
  label="Fruits"
  options={[{ value: "apple", label: "Apple" }]}
  value={fruits}
  onChange={setFruits}
  showSelectAll
  showProgress
/>`;

function LoadingDemo() {
  return (
    <div className="flex flex-col gap-4">
      <CheckboxWithLabel label="Saving preference…" description="Spinner blocks toggling until resolved." loading />
      <div className="flex items-center gap-3">
        <Checkbox loading />
        <Checkbox loading variant="outline" size="lg" />
      </div>
      <CheckboxCard
        label="Provisioning"
        description="Async state on a card."
        icon={<IconSettings className="h-5 w-5" />}
        variant="outline"
        loading
      />
    </div>
  );
}

const loadingCode = `import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox"

// \`loading\` shows a spinner in the indicator and blocks toggling
<CheckboxWithLabel label="Saving preference…" loading />
<Checkbox loading variant="outline" size="lg" />`;

function DisabledReasonDemo() {
  return (
    <div className="flex flex-col gap-4">
      <CheckboxWithLabel
        label="Delete account"
        description="Hover the box — a tooltip explains why it's locked."
        disabled
        disabledReason="Requires an admin role"
      />
      <CheckboxCard
        label="Enterprise SSO"
        description="Available on the Team plan."
        icon={<IconLock className="h-5 w-5" />}
        variant="outline"
        disabled
        disabledReason="Upgrade to unlock"
      />
    </div>
  );
}

const disabledReasonCode = `import { CheckboxWithLabel } from "@/components/ui/checkbox"

// \`disabledReason\` wraps a disabled box in a tooltip
<CheckboxWithLabel
  label="Delete account"
  disabled
  disabledReason="Requires an admin role"
/>`;

// =============================================================================
// Usage Code
// =============================================================================

const usageCode = `import {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
  CheckboxCard,
  KiraCheckbox,
} from "@/components/ui/checkbox"

// Basic checkbox
<Checkbox id="terms" />

// Loading (spinner blocks toggling) and disabled-with-reason
<Checkbox loading />
<CheckboxWithLabel label="Delete" disabled disabledReason="Admin only" />

// KiraCheckbox — one prop-driven API, four modes
<KiraCheckbox mode="checkbox" variant="soft" color="success" defaultChecked />
<KiraCheckbox mode="label" label="Enable notifications" description="…" />
<KiraCheckbox mode="group" options={fruitOptions} showSelectAll showProgress />

// With variants and colors
<Checkbox variant="outline" color="success" size="lg" checked />

// Checkbox with label and description
<CheckboxWithLabel
  label="Enable notifications"
  description="Receive push notifications"
  error
  loading
/>

// Checkbox group with select all
<CheckboxGroup
  label="Select fruits"
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]}
  value={selectedFruits}
  onChange={setSelectedFruits}
  showSelectAll
/>

// Card style checkbox
<CheckboxCard
  label="Mobile App"
  description="iOS and Android"
  icon={<IconDeviceMobile />}
/>`;

// =============================================================================
// Main Page Component
// =============================================================================

export default function CheckboxPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "Full WAI-ARIA compliance with proper roles, keyboard navigation, and screen reader support.",
      icon: <IconAccessible className="h-4 w-4" />,
    },
    {
      title: "Customizable",
      description:
        "Multiple variants (default, outline, filled, soft), sizes, colors, and custom icons.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Composable",
      description:
        "Use standalone or with CheckboxWithLabel, CheckboxGroup, or CheckboxCard components.",
      icon: <IconCheck className="h-4 w-4" />,
    },
  ];

  const demoTabs = [
    {
      value: "kira",
      label: "Kira",
      demo: (
        <DemoWrapper
          title="KiraCheckbox"
          description="One prop-driven API for all four modes: checkbox, label, card, group."
          code={kiraCode}
        >
          <KiraDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "loading",
      label: "Loading",
      demo: (
        <DemoWrapper
          title="Loading State"
          description="A spinner replaces the indicator and blocks toggling while async work runs."
          code={loadingCode}
        >
          <LoadingDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "disabled-reason",
      label: "Disabled reason",
      demo: (
        <DemoWrapper
          title="Disabled Reason"
          description="Explain why a control is locked via an accessible tooltip on hover/focus."
          code={disabledReasonCode}
        >
          <DisabledReasonDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Checkbox"
          description="Simple checkbox with a label using the Checkbox component."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Available in small, default, and large sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "styles",
      label: "Styles",
      demo: (
        <DemoWrapper
          title="Style Variants"
          description="Choose from default, outline, filled, or soft visual styles."
          code={stylesCode}
        >
          <StylesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "colors",
      label: "Colors",
      demo: (
        <DemoWrapper
          title="Color Variants"
          description="Semantic colors for success, destructive, and warning states."
          code={colorsCode}
        >
          <ColorsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "icons",
      label: "Icons",
      demo: (
        <DemoWrapper
          title="Custom Icons"
          description="Replace the default checkmark with any custom icon."
          code={iconsCode}
        >
          <IconsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "states",
      label: "States",
      demo: (
        <DemoWrapper
          title="Loading, Error & Disabled States"
          description="Various interactive states for form feedback."
          code={statesCode}
        >
          <StatesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "withlabel",
      label: "WithLabel",
      demo: (
        <DemoWrapper
          title="CheckboxWithLabel"
          description="A convenience wrapper with built-in label and description support."
          code={withLabelCode}
        >
          <WithLabelDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group",
      label: "Group",
      demo: (
        <DemoWrapper
          title="CheckboxGroup"
          description="Grouped checkboxes with optional select-all functionality."
          code={groupCode}
        >
          <GroupDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "card",
      label: "Card",
      demo: (
        <DemoWrapper
          title="CheckboxCard"
          description="Card-style selectable checkbox with icon and description support."
          code={cardCode}
        >
          <CardDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Space", description: "Toggle checkbox state" },
    { keys: "Enter", description: "Toggle checkbox state" },
    { keys: "Tab", description: "Move focus to next focusable element" },
    { keys: "Shift + Tab", description: "Move focus to previous focusable element" },
  ];

  const apiSections = [
    {
      title: "Checkbox",
      props: [
        {
          prop: "checked",
          type: "boolean | 'indeterminate'",
          default: "false",
          description: "The checked state of the checkbox.",
        },
        {
          prop: "onCheckedChange",
          type: "(checked: boolean | 'indeterminate') => void",
          description: "Callback when the checked state changes.",
        },
        {
          prop: "variant",
          type: "'default' | 'outline' | 'filled' | 'soft'",
          default: "'default'",
          description: "Visual style variant of the checkbox.",
        },
        {
          prop: "size",
          type: "'sm' | 'default' | 'lg'",
          default: "'default'",
          description: "Size of the checkbox.",
        },
        {
          prop: "color",
          type: "'default' | 'success' | 'destructive' | 'warning'",
          default: "'default'",
          description: "Color theme of the checkbox.",
        },
        {
          prop: "customIcon",
          type: "React.ReactNode",
          description: "Custom icon to display when checked.",
        },
        {
          prop: "loading",
          type: "boolean",
          default: "false",
          description: "Shows a loading spinner.",
        },
        {
          prop: "error",
          type: "boolean",
          default: "false",
          description: "Shows error styling.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the checkbox.",
        },
        {
          prop: "readOnly",
          type: "boolean",
          default: "false",
          description: "Makes the checkbox read-only.",
        },
      ],
    },
    {
      title: "CheckboxWithLabel",
      props: [
        {
          prop: "label",
          type: "string",
          description: "The label text for the checkbox.",
        },
        {
          prop: "description",
          type: "string",
          description: "Optional description text below the label.",
        },
        {
          prop: "...CheckboxProps",
          type: "-",
          description: "Inherits all Checkbox props.",
        },
      ],
    },
    {
      title: "CheckboxGroup",
      props: [
        {
          prop: "options",
          type: "CheckboxOption[]",
          description: "Array of checkbox options with value, label, description, and disabled.",
        },
        {
          prop: "value",
          type: "string[]",
          description: "Array of selected values (controlled).",
        },
        {
          prop: "defaultValue",
          type: "string[]",
          description: "Initial selected values (uncontrolled).",
        },
        {
          prop: "onChange",
          type: "(value: string[]) => void",
          description: "Callback when selection changes.",
        },
        {
          prop: "orientation",
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: "Layout direction of the group.",
        },
        {
          prop: "showSelectAll",
          type: "boolean",
          default: "false",
          description: "Show a select all checkbox.",
        },
        {
          prop: "selectAllLabel",
          type: "string",
          default: "'Select all'",
          description: "Label for the select all checkbox.",
        },
        {
          prop: "showProgress",
          type: "boolean",
          default: "false",
          description: "Show a live 'n/total selected' indicator.",
        },
        {
          prop: "label",
          type: "string",
          description: "Group label.",
        },
        {
          prop: "description",
          type: "string",
          description: "Group description.",
        },
      ],
    },
    {
      title: "CheckboxCard",
      props: [
        {
          prop: "label",
          type: "string",
          description: "The card label text.",
        },
        {
          prop: "description",
          type: "string",
          description: "Optional description text.",
        },
        {
          prop: "icon",
          type: "React.ReactNode",
          description: "Icon to display in the card.",
        },
        {
          prop: "variant",
          type: "'default' | 'outline'",
          default: "'default'",
          description: "Visual style variant of the card.",
        },
        {
          prop: "...CheckboxProps",
          type: "-",
          description: "Inherits all Checkbox props.",
        },
      ],
    },
    {
      title: "KiraCheckbox",
      props: [
        {
          prop: "mode",
          type: "'checkbox' | 'label' | 'card' | 'group'",
          default: "'checkbox'",
          description:
            "Selects which underlying component renders; remaining props are those of the chosen mode.",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Checkbox"
        version="v2.0"
        description="A control that allows the user to toggle between checked and unchecked states with support for variants, colors, indeterminate state, and more."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="kira" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the checkbox components in your application."
      />

      <APIReference sections={apiSections} />

      <Changelog
        entries={[
          {
            version: "v2.0",
            date: "2026-07-22",
            changes: [
              {
                type: "added",
                title: "KiraCheckbox mega-component",
                description:
                  "One prop-driven API covering checkbox, label, card, and group modes.",
              },
              {
                type: "added",
                title: "Loading state",
                description:
                  "`loading` shows a spinner in the indicator and blocks toggling.",
              },
              {
                type: "added",
                title: "Disabled reason tooltip",
                description:
                  "`disabledReason` wraps a disabled control in an accessible tooltip.",
              },
              {
                type: "added",
                title: "Group progress indicator",
                description:
                  "CheckboxGroup `showProgress` renders a live n/total selected count.",
              },
              {
                type: "changed",
                title: "Reduced-motion gating",
                description:
                  "Indicator animation is gated behind useReducedMotion().",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
