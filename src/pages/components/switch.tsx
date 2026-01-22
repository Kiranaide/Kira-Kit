import * as React from "react";
import { Switch, SwitchWithLabel, SwitchGroup } from "@/components/ui/switch";
import {
  IconMoon,
  IconSun,
  IconBell,
  IconBellOff,
  IconWifi,
  IconWifiOff,
  IconVolume,
  IconVolumeOff,
  IconAccessible,
  IconPalette,
  IconToggleRight,
} from "@tabler/icons-react";
import {
  PageHeader,
  FeatureGrid,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function DemoWrapperInner({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setView("preview")}
            className={cn(
              "px-3 py-1 text-sm rounded-md transition-colors",
              view === "preview"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={cn(
              "px-3 py-1 text-sm rounded-md transition-colors",
              view === "code"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            Code
          </button>
        </div>
      </div>
      <div className="p-4 min-h-[180px]">
        {view === "preview" ? (
          children
        ) : (
          <pre className="text-xs overflow-auto bg-muted p-4 rounded">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function BasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Switch id="basic-unchecked" />
      <Switch id="basic-checked" checked />
      <Switch id="basic-disabled" disabled />
    </div>
  );
}

const basicCode = `import { Switch } from "@/components/ui/switch"

export function BasicSwitchDemo() {
  return (
    <div className="flex items-center gap-4">
      <Switch id="basic-unchecked" />
      <Switch id="basic-checked" checked />
      <Switch id="basic-disabled" disabled />
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3">
        <Switch size="sm" id="size-sm" checked />
        <label htmlFor="size-sm" className="text-sm">
          Small
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="default" id="size-default" checked />
        <label htmlFor="size-default" className="text-sm">
          Default
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="lg" id="size-lg" checked />
        <label htmlFor="size-lg" className="text-sm">
          Large
        </label>
      </div>
    </div>
  );
}

const sizesCode = `import { Switch } from "@/components/ui/switch"

export function SwitchSizesDemo() {
  return (
    <div className="flex items-center gap-8">
      <Switch size="sm" id="size-sm" checked />
      <label htmlFor="size-sm">Small</label>
      <Switch size="default" id="size-default" checked />
      <label htmlFor="size-default">Default</label>
      <Switch size="lg" id="size-lg" checked />
      <label htmlFor="size-lg">Large</label>
    </div>
  )
}`;

function StatesDemo() {
  const [checked, setChecked] = React.useState(true);
  const [errorChecked, setErrorChecked] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-3">Checked / Unchecked</p>
        <div className="flex items-center gap-4">
          <Switch id="state-unchecked" />
          <label htmlFor="state-unchecked" className="text-sm">
            Unchecked
          </label>
          <Switch id="state-checked" checked />
          <label htmlFor="state-checked" className="text-sm">
            Checked
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Loading State</p>
        <div className="flex items-center gap-4">
          <Switch loading id="loading-unchecked" />
          <label htmlFor="loading-unchecked" className="text-sm">
            Loading (unchecked)
          </label>
          <Switch loading checked id="loading-checked" />
          <label htmlFor="loading-checked" className="text-sm">
            Loading (checked)
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Error State</p>
        <div className="flex items-center gap-4">
          <Switch
            error
            checked={errorChecked}
            onCheckedChange={setErrorChecked}
            id="error-unchecked"
          />
          <label htmlFor="error-unchecked" className="text-sm">
            Error state
          </label>
          <Switch
            error
            errorMessage="This field is required"
            checked={!errorChecked}
            onCheckedChange={() => setErrorChecked(!errorChecked)}
            id="error-message"
          />
          <label htmlFor="error-message" className="text-sm">
            With error message
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Disabled State</p>
        <div className="flex items-center gap-4">
          <Switch disabled id="disabled-unchecked" />
          <label htmlFor="disabled-unchecked" className="text-sm">
            Disabled (unchecked)
          </label>
          <Switch disabled checked id="disabled-checked" />
          <label htmlFor="disabled-checked" className="text-sm">
            Disabled (checked)
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Color States</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              color="success"
              checked={checked}
              onCheckedChange={setChecked}
              id="color-success"
            />
            <label htmlFor="color-success" className="text-sm">
              Success
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              color="destructive"
              checked={checked}
              onCheckedChange={setChecked}
              id="color-destructive"
            />
            <label htmlFor="color-destructive" className="text-sm">
              Destructive
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              color="warning"
              checked={checked}
              onCheckedChange={setChecked}
              id="color-warning"
            />
            <label htmlFor="color-warning" className="text-sm">
              Warning
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

const statesCode = `import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function SwitchStatesDemo() {
  const [checked, setChecked] = useState(true)
  const [errorChecked, setErrorChecked] = useState(true)

  return (
    <div className="space-y-6">
      {/* Checked / Unchecked */}
      <div className="flex items-center gap-4">
        <Switch />
        <Switch checked />
      </div>

      {/* Loading State */}
      <div className="flex items-center gap-4">
        <Switch loading />
        <Switch loading checked />
      </div>

      {/* Error State */}
      <div className="flex items-center gap-4">
        <Switch error checked={errorChecked} onCheckedChange={setErrorChecked} />
        <Switch
          error
          errorMessage="This field is required"
          checked={!errorChecked}
          onCheckedChange={() => setErrorChecked(!errorChecked)}
        />
      </div>

      {/* Disabled State */}
      <div className="flex items-center gap-4">
        <Switch disabled />
        <Switch disabled checked />
      </div>

      {/* Color States */}
      <div className="flex items-center gap-4">
        <Switch color="success" checked={checked} onCheckedChange={setChecked} />
        <Switch color="destructive" checked={checked} onCheckedChange={setChecked} />
        <Switch color="warning" checked={checked} onCheckedChange={setChecked} />
      </div>
    </div>
  )
}`;

function WithLabelDemo() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-w-md">
        <p className="text-sm font-medium">SwitchWithLabel Component</p>
        <SwitchWithLabel
          label="Enable notifications"
          description="Receive push notifications on your device"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
        <SwitchWithLabel
          label="Dark mode"
          description="Switch to dark theme"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">Label Position</p>
        <Switch
          label="Label at end (default)"
          description="The label appears after the switch"
          labelPosition="end"
          id="label-end"
        />
        <Switch
          label="Label at start"
          description="The label appears before the switch"
          labelPosition="start"
          id="label-start"
        />
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">With Icons</p>
        <div className="flex items-center gap-4">
          <Switch
            size="lg"
            checked={darkMode}
            onCheckedChange={setDarkMode}
            label="Dark mode"
            thumbIcon={<IconMoon className="h-4 w-4" />}
            thumbIconChecked={<IconSun className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center gap-4">
          <Switch
            size="lg"
            checked={notifications}
            onCheckedChange={setNotifications}
            label="Notifications"
            thumbIcon={<IconBellOff className="h-4 w-4" />}
            thumbIconChecked={<IconBell className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}

const withLabelCode = `import { Switch, SwitchWithLabel } from "@/components/ui/switch"
import { useState } from "react"
import { IconMoon, IconSun, IconBell, IconBellOff } from "@tabler/icons-react"

export function SwitchWithLabelDemo() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="space-y-6">
      {/* SwitchWithLabel component */}
      <SwitchWithLabel
        label="Enable notifications"
        description="Receive push notifications on your device"
        checked={notifications}
        onCheckedChange={setNotifications}
      />

      {/* Label position */}
      <Switch
        label="Label at end (default)"
        labelPosition="end"
      />
      <Switch
        label="Label at start"
        labelPosition="start"
      />

      {/* With icons */}
      <Switch
        size="lg"
        checked={darkMode}
        onCheckedChange={setDarkMode}
        label="Dark mode"
        thumbIcon={<IconMoon />}
        thumbIconChecked={<IconSun />}
      />
      <Switch
        size="lg"
        checked={notifications}
        onCheckedChange={setNotifications}
        label="Notifications"
        thumbIcon={<IconBellOff />}
        thumbIconChecked={<IconBell />}
      />
    </div>
  )
}`;

function UncontrolledDemo() {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>("");

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-w-md">
        <p className="text-sm font-medium">
          Uncontrolled (with defaultChecked)
        </p>
        <p className="text-sm text-muted-foreground">
          The switch manages its own state. Use <code className="bg-muted px-1 rounded">name</code> and
          <code className="bg-muted px-1 rounded">form</code> props to access the value.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            alert(`Uncontrolled value: ${formData.get("notifications")}`);
          }}
        >
          <div className="flex flex-col gap-4">
            <Switch
              name="notifications"
              id="uncontrolled-notifications"
              defaultChecked={true}
              label="Enable notifications"
              description="Managed by the component itself"
            />
            <Switch
              name="emails"
              id="uncontrolled-emails"
              defaultChecked={false}
              label="Email alerts"
              description="Managed by the component itself"
            />
            <button
              type="submit"
              className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">Controlled (with checked)</p>
        <p className="text-sm text-muted-foreground">
          You control the state with <code className="bg-muted px-1 rounded">checked</code> and{" "}
          <code className="bg-muted px-1 rounded">onCheckedChange</code> props.
        </p>
        <div className="flex flex-col gap-4">
          <Switch
            id="controlled-notifications"
            checked={uncontrolledValue === "notifications"}
            onCheckedChange={(checked) =>
              setUncontrolledValue(checked ? "notifications" : "")
            }
            label="Enable notifications"
            description={`State: ${uncontrolledValue === "notifications" ? "on" : "off"}`}
          />
          <Switch
            id="controlled-emails"
            checked={uncontrolledValue === "emails"}
            onCheckedChange={(checked) =>
              setUncontrolledValue(checked ? "emails" : "")
            }
            label="Email alerts"
            description={`State: ${uncontrolledValue === "emails" ? "on" : "off"}`}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">Switch Group</p>
        <p className="text-sm text-muted-foreground">
          Group related switches with proper accessibility attributes.
        </p>
        <SwitchGroup label="Notification Settings" orientation="vertical">
          <Switch label="Email notifications" defaultChecked />
          <Switch label="Push notifications" />
          <Switch label="SMS notifications" />
        </SwitchGroup>
      </div>
    </div>
  );
}

const controlledCode = `import { Switch, SwitchGroup } from "@/components/ui/switch"
import { useState } from "react"

export function ControlledUncontrolledDemo() {
  const [controlledValue, setControlledValue] = useState<string>("")

  return (
    <div className="space-y-6">
      {/* Uncontrolled */}
      <form onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        alert(\`Value: \${formData.get("notifications")}\`)
      }}>
        <Switch
          name="notifications"
          defaultChecked={true}
          label="Enable notifications"
          description="Managed by the component itself"
        />
        <button type="submit">Submit Form</button>
      </form>

      {/* Controlled */}
      <Switch
        checked={controlledValue === "notifications"}
        onCheckedChange={(checked) =>
          setControlledValue(checked ? "notifications" : "")
        }
        label="Enable notifications"
        description={\`State: \${controlledValue === "notifications" ? "on" : "off"}\`}
      />

      {/* Switch Group */}
      <SwitchGroup label="Notification Settings">
        <Switch label="Email notifications" defaultChecked />
        <Switch label="Push notifications" />
        <Switch label="SMS notifications" />
      </SwitchGroup>
    </div>
  )
}`;

function SettingsPanelDemo() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [wifi, setWifi] = React.useState(true);
  const [volume, setVolume] = React.useState(false);

  return (
    <div className="border rounded-lg p-6 max-w-2xl space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              thumbIcon={<IconMoon className="h-4 w-4" />}
              thumbIconChecked={<IconSun className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              checked={notifications}
              onCheckedChange={setNotifications}
              thumbIcon={<IconBellOff className="h-4 w-4" />}
              thumbIconChecked={<IconBell className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Push notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your activity
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              checked={wifi}
              onCheckedChange={setWifi}
              thumbIcon={<IconWifiOff className="h-4 w-4" />}
              thumbIconChecked={<IconWifi className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">WiFi</p>
              <p className="text-sm text-muted-foreground">
                Connect to available networks
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              checked={volume}
              onCheckedChange={setVolume}
              thumbIcon={<IconVolumeOff className="h-4 w-4" />}
              thumbIconChecked={<IconVolume className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Sound</p>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Status: Dark: {darkMode ? "On" : "Off"}, Notifications:{" "}
          {notifications ? "On" : "Off"}, WiFi: {wifi ? "On" : "Off"}, Sound:{" "}
          {volume ? "On" : "Off"}
        </p>
      </div>
    </div>
  );
}

const settingsPanelCode = `import { Switch } from "@/components/ui/switch"
import { IconMoon, IconSun, IconBell, IconBellOff, IconWifi, IconWifiOff, IconVolume, IconVolumeOff } from "@tabler/icons-react"
import { useState } from "react"

export function SettingsPanelDemo() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [wifi, setWifi] = useState(true)
  const [volume, setVolume] = useState(false)

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Switch
          size="lg"
          checked={darkMode}
          onCheckedChange={setDarkMode}
          thumbIcon={<IconMoon />}
          thumbIconChecked={<IconSun />}
        />
        <div>
          <p className="text-sm font-medium">Dark mode</p>
          <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          size="lg"
          checked={notifications}
          onCheckedChange={setNotifications}
          thumbIcon={<IconBellOff />}
          thumbIconChecked={<IconBell />}
        />
        <div>
          <p className="text-sm font-medium">Push notifications</p>
          <p className="text-sm text-muted-foreground">Receive notifications about your activity</p>
        </div>
      </div>

      {/* More switches... */}

      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Status: Dark: {darkMode ? "On" : "Off"}, Notifications: {notifications ? "On" : "Off"}
        </p>
      </div>
    </div>
  )
}`;

export function SwitchPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "Full WAI-ARIA support with keyboard navigation, screen reader announcements, and WCAG 2.2 AA compliant touch targets.",
      icon: <IconAccessible className="h-4 w-4" />,
    },
    {
      title: "Customizable",
      description:
        "Multiple sizes, color variants, custom icons for checked/unchecked states, and flexible label positioning.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Feature Rich",
      description:
        "Loading states, error states, validation messages, switch groups, and both controlled/uncontrolled modes.",
      icon: <IconToggleRight className="h-4 w-4" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapperInner
          title="Basic Switch"
          description="Simple toggle switch with default, checked, and disabled states."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapperInner>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapperInner
          title="Size Variants"
          description="Small, default, and large switch sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapperInner>
      ),
    },
    {
      value: "states",
      label: "States",
      demo: (
        <DemoWrapperInner
          title="Switch States"
          description="Checked, unchecked, loading, error, disabled, and color states."
          code={statesCode}
        >
          <StatesDemo />
        </DemoWrapperInner>
      ),
    },
    {
      value: "with-label",
      label: "With Label",
      demo: (
        <DemoWrapperInner
          title="Labels and Icons"
          description="Switches with labels, descriptions, custom icons, and configurable label position."
          code={withLabelCode}
        >
          <WithLabelDemo />
        </DemoWrapperInner>
      ),
    },
    {
      value: "controlled",
      label: "Uncontrolled/Controlled",
      demo: (
        <DemoWrapperInner
          title="Control Patterns"
          description="Uncontrolled (defaultChecked), controlled (checked/onCheckedChange), and switch groups."
          code={controlledCode}
        >
          <UncontrolledDemo />
        </DemoWrapperInner>
      ),
    },
    {
      value: "example",
      label: "Settings Panel",
      demo: (
        <DemoWrapperInner
          title="Settings Panel Example"
          description="A realistic settings panel combining multiple switches with icons."
          code={settingsPanelCode}
        >
          <SettingsPanelDemo />
        </DemoWrapperInner>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Space", description: "Toggle the switch on/off" },
    { keys: "Enter", description: "Toggle the switch on/off" },
    { keys: "Tab", description: "Move focus to the next element" },
    { keys: "Shift + Tab", description: "Move focus to the previous element" },
  ];

  const usageCode = `import { Switch, SwitchWithLabel, SwitchGroup } from "@/components/ui/switch"

// Basic switch
<Switch id="notifications" />

// With label and description
<Switch
  label="Enable notifications"
  description="Receive push notifications"
  checked={enabled}
  onCheckedChange={setEnabled}
/>

// Label position
<Switch label="Label first" labelPosition="start" />
<Switch label="Label last" labelPosition="end" />

// With error message
<Switch
  label="Accept terms"
  errorMessage="You must accept the terms"
  required
/>

// Screen reader announcements
<Switch
  label="Airplane Mode"
  checkedLabel="Airplane mode enabled"
  uncheckedLabel="Airplane mode disabled"
/>

// Touch target for mobile
<Switch touchTarget />

// Switch group
<SwitchGroup label="Notification Settings">
  <Switch label="Email" />
  <Switch label="Push" />
  <Switch label="SMS" />
</SwitchGroup>

// With custom icons
<Switch
  size="lg"
  checked={isDark}
  onCheckedChange={setIsDark}
  thumbIcon={<IconMoon />}
  thumbIconChecked={<IconSun />}
/>

// With color variants
<Switch color="success" checked />
<Switch color="destructive" checked />
<Switch color="warning" checked />

// With loading state
<Switch loading />

// With error state
<Switch error />

// Uncontrolled
<Switch name="notifications" defaultChecked />`;

  const apiSections = [
    {
      title: "Switch",
      props: [
        {
          prop: "checked",
          type: "boolean",
          description: "Controlled checked state of the switch.",
        },
        {
          prop: "defaultChecked",
          type: "boolean",
          default: "false",
          description: "Initial checked state for uncontrolled mode.",
        },
        {
          prop: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: "Callback fired when the checked state changes.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size of the switch.",
        },
        {
          prop: "color",
          type: '"default" | "success" | "destructive" | "warning"',
          default: '"default"',
          description: "Color variant of the switch when checked.",
        },
        {
          prop: "label",
          type: "string",
          description: "Label text displayed next to the switch.",
        },
        {
          prop: "description",
          type: "string",
          description: "Description text displayed below the label.",
        },
        {
          prop: "labelPosition",
          type: '"start" | "end"',
          default: '"end"',
          description: "Position of the label relative to the switch.",
        },
        {
          prop: "thumbIcon",
          type: "ReactNode",
          description: "Icon displayed in the thumb when unchecked.",
        },
        {
          prop: "thumbIconChecked",
          type: "ReactNode",
          description: "Icon displayed in the thumb when checked.",
        },
        {
          prop: "loading",
          type: "boolean",
          default: "false",
          description: "Shows a loading spinner and disables the switch.",
        },
        {
          prop: "error",
          type: "boolean",
          default: "false",
          description: "Applies error styling to the switch.",
        },
        {
          prop: "errorMessage",
          type: "string",
          description: "Error message displayed below the switch.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the switch.",
        },
        {
          prop: "required",
          type: "boolean",
          default: "false",
          description: "Marks the switch as required for form validation.",
        },
        {
          prop: "touchTarget",
          type: "boolean",
          default: "false",
          description: "Ensures WCAG 2.2 AA compliant 44x44px minimum touch area.",
        },
        {
          prop: "checkedLabel",
          type: "string",
          description: "Screen reader announcement when checked.",
        },
        {
          prop: "uncheckedLabel",
          type: "string",
          description: "Screen reader announcement when unchecked.",
        },
        {
          prop: "name",
          type: "string",
          description: "Name attribute for form submission.",
        },
        {
          prop: "value",
          type: "string",
          description: "Value attribute for form submission.",
        },
      ],
    },
    {
      title: "SwitchWithLabel",
      props: [
        {
          prop: "label",
          type: "string",
          description: "Required label text for the switch.",
        },
        {
          prop: "description",
          type: "string",
          description: "Optional description text below the label.",
        },
        {
          prop: "...props",
          type: "SwitchProps",
          description: "All Switch props are supported.",
        },
      ],
    },
    {
      title: "SwitchGroup",
      props: [
        {
          prop: "label",
          type: "string",
          description: "Group label for accessibility.",
        },
        {
          prop: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"vertical"',
          description: "Layout orientation of the switches in the group.",
        },
        {
          prop: "children",
          type: "ReactNode",
          description: "Switch components to render in the group.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <PageHeader
        title="Switch"
        version="v1.0"
        description="A two-state toggle switch component with full accessibility support, custom icons, multiple sizes and colors, loading and error states."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Common usage patterns for the Switch component."
      />

      <APIReference
        sections={apiSections}
        description="Props and configuration options for Switch components."
      />
    </div>
  );
}
