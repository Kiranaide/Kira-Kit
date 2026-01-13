import * as React from "react";
import {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
  CheckboxCard,
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
} from "@tabler/icons-react";

export function CheckboxPage() {
  const [groupValue, setGroupValue] = React.useState<string[]>(["banana"]);

  const fruitOptions = [
    { value: "apple", label: "Apple", description: "A sweet red fruit" },
    { value: "banana", label: "Banana", description: "A yellow curved fruit" },
    { value: "orange", label: "Orange", description: "A citrus fruit" },
    { value: "grape", label: "Grape", disabled: true },
  ];

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Checkbox</h1>
        <p className="text-muted-foreground">
          A control that allows the user to toggle between checked and
          unchecked states with support for variants, colors, and more.
        </p>
      </header>

      {/* Basic Checkbox */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Checkbox
        </h2>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
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
      </section>

      {/* Style Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Style Variants
        </h2>
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
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
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
      </section>

      {/* Custom Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Icons
        </h2>
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
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <div className="flex items-center gap-6">
          <Checkbox id="loading-unchecked" loading />
          <Checkbox id="loading-checked" checked loading />
          <Checkbox
            id="loading-indeterminate"
            checked="indeterminate"
            loading
          />
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Error State
        </h2>
        <div className="flex items-center gap-6">
          <Checkbox id="error-unchecked" error />
          <Checkbox id="error-checked" checked error />
          <Checkbox id="error-indeterminate" checked="indeterminate" error />
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled States
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label
              htmlFor="disabled-unchecked"
              className="text-muted-foreground"
            >
              Disabled unchecked
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-checked" disabled checked />
            <Label
              htmlFor="disabled-checked"
              className="text-muted-foreground"
            >
              Disabled checked
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-readonly" readOnly checked />
            <Label
              htmlFor="disabled-readonly"
              className="text-muted-foreground"
            >
              Readonly checked
            </Label>
          </div>
        </div>
      </section>

      {/* CheckboxWithLabel */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          CheckboxWithLabel
        </h2>
        <p className="text-sm text-muted-foreground">
          A convenience wrapper with built-in label and description.
        </p>
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
      </section>

      {/* CheckboxGroup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          CheckboxGroup
        </h2>
        <p className="text-sm text-muted-foreground">
          Grouped checkboxes with optional select-all functionality.
        </p>
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
      </section>

      {/* Horizontal CheckboxGroup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal CheckboxGroup
        </h2>
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
      </section>

      {/* CheckboxCard */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          CheckboxCard
        </h2>
        <p className="text-sm text-muted-foreground">
          Card-style selectable checkbox with icon and description support.
        </p>
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
      </section>

      {/* Switch Reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Switch Component
        </h2>
        <p className="text-sm text-muted-foreground">
          For toggle switch functionality with icon support, use the dedicated{" "}
          <a href="/components/switch" className="text-primary hover:underline">
            Switch component
          </a>
          .
        </p>
      </section>

      {/* Combined Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Settings Panel Example
        </h2>
        <p className="text-sm text-muted-foreground">
          A realistic settings panel combining checkbox variants.
        </p>
        <div className="border rounded-lg p-6 max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Notification Channels</h3>
            <CheckboxGroup
              options={[
                { value: "email", label: "Email", description: "Get notified via email" },
                { value: "push", label: "Push", description: "Browser push notifications" },
                { value: "sms", label: "SMS", description: "Text message notifications" },
                { value: "slack", label: "Slack", description: "Slack channel updates" },
              ]}
              showSelectAll
              orientation="horizontal"
            />
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
            {`import { Checkbox, CheckboxWithLabel, CheckboxGroup, CheckboxCard } from "@/components/ui/checkbox"

// Basic checkbox
<Checkbox id="terms" />

// With variants
<Checkbox variant="outline" color="success" size="lg" checked />

// Checkbox with label
<CheckboxWithLabel
  label="Enable notifications"
  description="Receive push notifications"
  error
  loading
/>

// Checkbox group
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
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
