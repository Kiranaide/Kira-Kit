import * as React from "react";
import { Switch, SwitchGroup } from "@/components/ui/switch";
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
  IconToggleRight,
  IconRefresh,
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

function BasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <Switch id="basic-unchecked" aria-label="Feature toggle" />
        <label htmlFor="basic-unchecked" className="text-sm">
          Unchecked
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="basic-checked" defaultChecked aria-label="Feature toggle" />
        <label htmlFor="basic-checked" className="text-sm">
          Checked
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="basic-disabled" disabled aria-label="Feature toggle" />
        <label htmlFor="basic-disabled" className="text-sm">
          Disabled
        </label>
      </div>
    </div>
  );
}

const basicCode = `import { Switch } from "@/components/ui/switch"

export function BasicSwitchDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <Switch id="basic-unchecked" aria-label="Feature toggle" />
        <label htmlFor="basic-unchecked">Unchecked</label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="basic-checked" defaultChecked aria-label="Feature toggle" />
        <label htmlFor="basic-checked">Checked</label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="basic-disabled" disabled aria-label="Feature toggle" />
        <label htmlFor="basic-disabled">Disabled</label>
      </div>
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex items-center gap-3">
        <Switch
          size="sm"
          id="size-sm"
          defaultChecked
          aria-label="Small switch"
        />
        <label htmlFor="size-sm" className="text-sm">
          Small
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          size="default"
          id="size-default"
          defaultChecked
          aria-label="Default switch"
        />
        <label htmlFor="size-default" className="text-sm">
          Default
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          size="lg"
          id="size-lg"
          defaultChecked
          aria-label="Large switch"
        />
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
    <div className="flex flex-wrap items-center gap-8">
      <Switch size="sm" id="size-sm" defaultChecked aria-label="Small" />
      <Switch size="default" id="size-default" defaultChecked aria-label="Default" />
      <Switch size="lg" id="size-lg" defaultChecked aria-label="Large" />
    </div>
  )
}`;

function LabelsDemo() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-w-md">
        <Switch
          label="Enable notifications"
          description="Receive push notifications on your device"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
        <Switch
          label="Dark mode"
          description="Switch to dark theme"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">Label position</p>
        <Switch
          label="Label at start"
          description="The label appears before the switch"
          labelPosition="start"
        />
        <Switch
          label="Label at end (default)"
          description="The label appears after the switch"
          labelPosition="end"
        />
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">Thumb icons</p>
        <Switch
          size="lg"
          checked={darkMode}
          onCheckedChange={setDarkMode}
          label="Dark mode"
          thumbIcon={<IconMoon className="h-4 w-4" />}
          thumbIconChecked={<IconSun className="h-4 w-4" />}
        />
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
  );
}

const labelsCode = `import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { IconMoon, IconSun, IconBell, IconBellOff } from "@tabler/icons-react"

export function SwitchLabelsDemo() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="space-y-6">
      {/* Built-in label + description */}
      <Switch
        label="Enable notifications"
        description="Receive push notifications on your device"
        checked={notifications}
        onCheckedChange={setNotifications}
      />

      {/* Label position */}
      <Switch label="Label at start" labelPosition="start" />
      <Switch label="Label at end" labelPosition="end" />

      {/* Thumb icons (uncontrolled — the switch owns its state) */}
      <Switch
        size="lg"
        defaultChecked
        label="Dark mode"
        thumbIcon={<IconMoon />}
        thumbIconChecked={<IconSun />}
      />
    </div>
  )
}`;

function SwitchColorsDemo() {
  return (
    <div>
      <p className="text-sm font-medium mb-3">Colors</p>
      <div className="flex flex-wrap items-center gap-6">
        <Switch
          color="success"
          defaultChecked
          id="color-success"
          aria-label="Success switch"
        />
        <label htmlFor="color-success" className="text-sm">
          Success
        </label>
        <Switch
          color="destructive"
          defaultChecked
          id="color-destructive"
          aria-label="Destructive switch"
        />
        <label htmlFor="color-destructive" className="text-sm">
          Destructive
        </label>
        <Switch
          color="warning"
          defaultChecked
          id="color-warning"
          aria-label="Warning switch"
        />
        <label htmlFor="color-warning" className="text-sm">
          Warning
        </label>
      </div>
    </div>
  );
}

function StatesDemo() {
  const [errorChecked, setErrorChecked] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-3">Loading</p>
        <div className="flex items-center gap-4">
          <Switch loading id="loading-unchecked" aria-label="Loading switch" />
          <label htmlFor="loading-unchecked" className="text-sm">
            Loading (unchecked)
          </label>
          <Switch
            loading
            defaultChecked
            id="loading-checked"
            aria-label="Loading switch"
          />
          <label htmlFor="loading-checked" className="text-sm">
            Loading (checked)
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Error</p>
        <div className="flex items-center gap-4">
          <Switch
            error
            checked={errorChecked}
            onCheckedChange={setErrorChecked}
            id="error-state"
            aria-label="Invalid switch"
          />
          <label htmlFor="error-state" className="text-sm">
            Invalid styling
          </label>
          <Switch
            error
            errorMessage="Confirm your email address first"
            id="error-message"
          />
          <label htmlFor="error-message" className="text-sm">
            With error message
          </label>
        </div>
      </div>

      <SwitchColorsDemo />

      <div>
        <p className="text-sm font-medium mb-3">Read-only</p>
        <Switch
          readOnly
          defaultChecked
          id="readonly-switch"
          aria-label="Read-only switch"
        />
        <label htmlFor="readonly-switch" className="text-sm">
          Read-only (focusable, not toggleable)
        </label>
      </div>
    </div>
  );
}

const statesCode = `import { Switch } from "@/components/ui/switch"

export function SwitchStatesDemo() {
  return (
    <div className="space-y-6">
      {/* Loading: spinner + disabled + aria-busy */}
      <Switch loading />
      <Switch loading defaultChecked />

      {/* Error: aria-invalid styling, optional message */}
      <Switch error defaultChecked />
      <Switch error errorMessage="Confirm your email address first" />

      {/* Colors */}
      <Switch color="success" defaultChecked />
      <Switch color="destructive" defaultChecked />
      <Switch color="warning" defaultChecked />

      {/* Read-only: focusable but not toggleable */}
      <Switch readOnly defaultChecked />
    </div>
  )
}`;

function ControlledDemo() {
  const [value, setValue] = React.useState<"notifications" | "emails" | "">("");

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-w-md">
        <p className="text-sm font-medium">Controlled</p>
        <Switch
          id="controlled-notifications"
          checked={value === "notifications"}
          onCheckedChange={(checked) =>
            setValue(checked ? "notifications" : "")
          }
          label="Enable notifications"
          description={`State: ${value === "notifications" ? "on" : "off"}`}
        />
        <Switch
          id="controlled-emails"
          checked={value === "emails"}
          onCheckedChange={(checked) => setValue(checked ? "emails" : "")}
          label="Email alerts"
          description={`State: ${value === "emails" ? "on" : "off"}`}
        />
      </div>

      <div className="border-t pt-6 space-y-4 max-w-md">
        <p className="text-sm font-medium">
          Uncontrolled — form submission (value + uncheckedValue)
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            alert(
              `notifications: ${data.get("notifications")}, emails: ${data.get("emails")}`,
            );
          }}
        >
          <div className="flex flex-col gap-4">
            <Switch
              name="notifications"
              id="uncontrolled-notifications"
              defaultChecked
              label="Enable notifications"
              description='Submits "on" when checked, "off" when unchecked'
              uncheckedValue="off"
            />
            <Switch
              name="emails"
              id="uncontrolled-emails"
              label="Email alerts"
              description="Left off — submits nothing without uncheckedValue"
            />
            <button
              type="submit"
              className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Submit form
            </button>
          </div>
        </form>
      </div>

      <div className="border-t pt-6 max-w-md">
        <SwitchGroup label="Notification settings">
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

export function ControlledSwitchDemo() {
  const [value, setValue] = useState<"notifications" | "emails" | "">("")

  return (
    <div className="space-y-6">
      {/* Controlled */}
      <Switch
        checked={value === "notifications"}
        onCheckedChange={(checked) => setValue(checked ? "notifications" : "")}
        label="Enable notifications"
      />

      {/* Uncontrolled + form submission with uncheckedValue */}
      <form onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        alert(data.get("notifications"))
      }}>
        <Switch
          name="notifications"
          defaultChecked
          uncheckedValue="off"
          label="Enable notifications"
        />
        <button type="submit">Submit form</button>
      </form>

      {/* Group */}
      <SwitchGroup label="Notification settings">
        <Switch label="Email notifications" defaultChecked />
        <Switch label="Push notifications" />
      </SwitchGroup>
    </div>
  )
}`;

// Illustrative network fixture: the maintenance setting deliberately rejects.
function saveSetting(succeed: boolean) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (succeed) resolve();
      else reject(new Error("Maintenance mode is locked"));
    }, 1200);
  });
}

function OptimisticDemo() {
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <div className="space-y-6 max-w-md">
      <Switch
        optimistic
        label="Auto-save documents"
        description="Flips instantly; the save request runs in the background"
        checked={autoSave}
        onCheckedChange={setAutoSave}
        onCommit={() => saveSetting(true)}
        commitErrorTitle="Couldn't save auto-save"
      />
      <Switch
        optimistic
        label="Maintenance mode"
        description="This illustrative save fails after 1.2 seconds; the change reverts with an explanation"
        checked={false}
        onCommit={() => saveSetting(false)}
        commitErrorTitle="Couldn't enable maintenance mode"
      />
    </div>
  );
}

const optimisticCode = `import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export function OptimisticSwitchDemo() {
  const [enabled, setEnabled] = useState(false)

  const save = async (checked: boolean) => {
    await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify({ autoSave: checked }),
    })
  }

  return (
    <Switch
      optimistic
      label="Auto-save documents"
      checked={enabled}
      onCheckedChange={setEnabled}
      onCommit={save}
      commitErrorTitle="Couldn't save auto-save setting"
    />
  )
  // The switch flips immediately. If \`save\` rejects, it reverts to
  // \`enabled\` and shows an error toast; while pending, the thumb shows
  // a spinner and re-toggling is blocked.
}`;

function DisabledReasonDemo() {
  return (
    <div className="space-y-6 max-w-md">
      <Switch
        disabled
        disabledReason="Available on the Team plan and above"
        label="SSO enforcement"
        description="Hover or focus the switch to see why it's unavailable"
      />
      <Switch
        disabled
        disabledReason="Your plan doesn't include audit logs"
        label="Audit log export"
      />
    </div>
  );
}

const disabledReasonCode = `import { Switch } from "@/components/ui/switch"

export function DisabledReasonSwitchDemo() {
  return (
    <Switch
      disabled
      disabledReason="Available on the Team plan and above"
      label="SSO enforcement"
    />
  )
  // The reason is announced to screen readers and shown as a tooltip
  // on hover AND keyboard focus — never hover-only.
}`;

function SettingsPanelDemo() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [wifi, setWifi] = React.useState(true);
  const [volume, setVolume] = React.useState(false);

  const rows = [
    {
      id: "dark",
      label: "Dark mode",
      description: "Toggle between light and dark theme",
      checked: darkMode,
      onChange: setDarkMode,
      off: <IconMoon className="h-4 w-4" />,
      on: <IconSun className="h-4 w-4" />,
    },
    {
      id: "notifications",
      label: "Push notifications",
      description: "Receive notifications about your activity",
      checked: notifications,
      onChange: setNotifications,
      off: <IconBellOff className="h-4 w-4" />,
      on: <IconBell className="h-4 w-4" />,
    },
    {
      id: "wifi",
      label: "WiFi",
      description: "Connect to available networks",
      checked: wifi,
      onChange: setWifi,
      off: <IconWifiOff className="h-4 w-4" />,
      on: <IconWifi className="h-4 w-4" />,
    },
    {
      id: "volume",
      label: "Sound",
      description: "Play sounds for notifications",
      checked: volume,
      onChange: setVolume,
      off: <IconVolumeOff className="h-4 w-4" />,
      on: <IconVolume className="h-4 w-4" />,
    },
  ];

  return (
    <div className="border rounded-lg p-6 max-w-2xl space-y-4">
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                size="lg"
                checked={row.checked}
                onCheckedChange={row.onChange}
                thumbIcon={row.off}
                thumbIconChecked={row.on}
                aria-label={row.label}
              />
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-sm text-muted-foreground">
                  {row.description}
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground tabular-nums">
              {row.checked ? "On" : "Off"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const settingsPanelCode = `import { Switch } from "@/components/ui/switch"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { useState } from "react"

export function SettingsPanelDemo() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Switch
          size="lg"
          checked={darkMode}
          onCheckedChange={setDarkMode}
          thumbIcon={<IconMoon />}
          thumbIconChecked={<IconSun />}
          aria-label="Dark mode"
        />
        <div>
          <p className="text-sm font-medium">Dark mode</p>
          <p className="text-sm text-muted-foreground">
            Toggle between light and dark theme
          </p>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">
        {darkMode ? "On" : "Off"}
      </span>
    </div>
  )
}`;

const features = [
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA support with keyboard toggling, screen reader labels, and ≥24px targets with an invisible hit-area extension.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Customizable",
    description:
      "Three sizes, semantic color variants, custom thumb icons, and flexible label positioning.",
    icon: <IconToggleRight className="h-4 w-4" />,
  },
  {
    title: "Optimistic saving",
    description:
      "Flip instantly, commit async, revert with a toast on failure — the checkbox-card pattern, on a switch.",
    icon: <IconRefresh className="h-4 w-4" />,
  },
  {
    title: "Explainable",
    description:
      "Disabled switches carry a reason (tooltip + screen reader text), and loading states set aria-busy.",
    icon: <IconLock className="h-4 w-4" />,
  },
];

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic switch"
        description="Default, checked, and disabled states."
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
        title="Sizes"
        description="Small (40×24 track), default (44×24), large (52×28)."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "labels",
    label: "Labels",
    demo: (
      <DemoWrapper
        title="Labels and icons"
        description="Built-in label/description, label position, and thumb icons."
        code={labelsCode}
      >
        <LabelsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="States"
        description="Loading, invalid, colors, read-only."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controlled",
    label: "Controlled",
    demo: (
      <DemoWrapper
        title="Control patterns"
        description="Controlled, uncontrolled form submission with uncheckedValue, and groups."
        code={controlledCode}
      >
        <ControlledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "optimistic",
    label: "Optimistic",
    demo: (
      <DemoWrapper
        title="Optimistic auto-save"
        description="Flip instantly, commit async; rejection reverts with a toast. 'Maintenance mode' deliberately fails after ~1.2s (illustrative fixture)."
        code={optimisticCode}
      >
        <OptimisticDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled-reason",
    label: "Disabled reason",
    demo: (
      <DemoWrapper
        title="Disabled with reason"
        description="Tooltip on hover and focus; reason text exposed to screen readers."
        code={disabledReasonCode}
      >
        <DisabledReasonDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "settings",
    label: "Settings panel",
    demo: (
      <DemoWrapper
        title="Settings panel"
        description="A realistic settings scene combining switches with thumb icons."
        code={settingsPanelCode}
      >
        <SettingsPanelDemo />
      </DemoWrapper>
    ),
  },
];

const keyboardShortcuts = [
  {
    keys: "Space",
    description: "Toggle the switch (inherited from Base UI)",
  },
  {
    keys: "Enter",
    description: "Toggle the switch (inherited from Base UI)",
  },
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move focus; a disabled switch with disabledReason shows its tooltip on focus",
  },
];

const usageCode = `import { Switch, SwitchGroup } from "@/components/ui/switch"

// Basic switch (uncontrolled)
<Switch id="notifications" aria-label="Notifications" />

// With label and description
<Switch
  label="Enable notifications"
  description="Receive push notifications"
  checked={enabled}
  onCheckedChange={setEnabled}
/>

// Label position
<Switch label="Label first" labelPosition="start" />

// With error message
<Switch
  label="Accept terms"
  errorMessage="You must accept the terms"
  required
/>

// Screen reader announcements
<Switch
  label="Airplane mode"
  checkedLabel="Airplane mode enabled"
  uncheckedLabel="Airplane mode disabled"
/>

// Optimistic auto-save (requires controlled \`checked\`)
<Switch
  optimistic
  label="Auto-save"
  checked={autoSave}
  onCheckedChange={setAutoSave}
  onCommit={saveToServer}
  commitErrorTitle="Couldn't save auto-save setting"
/>

// Disabled with a reason (tooltip + screen reader text)
<Switch disabled disabledReason="Requires the Team plan" label="SSO" />

// Form submission: value when checked, uncheckedValue when unchecked
<Switch name="notifications" uncheckedValue="off" />

// Switch group
<SwitchGroup label="Notification settings">
  <Switch label="Email" />
  <Switch label="Push" />
</SwitchGroup>

// Custom thumb icons
<Switch
  size="lg"
  thumbIcon={<IconMoon />}
  thumbIconChecked={<IconSun />}
/>

// Color variants
<Switch color="success" defaultChecked />
<Switch color="destructive" defaultChecked />
<Switch color="warning" defaultChecked />

// Loading state (aria-busy + disabled)
<Switch loading />`;

const apiSections = [
  {
    title: "Switch",
    props: [
      {
        prop: "checked",
        type: "boolean",
        description: "Controlled checked state.",
      },
      {
        prop: "defaultChecked",
        type: "boolean",
        default: "false",
        description: "Initial checked state for uncontrolled use.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean) => void",
        description:
          "Called after the checked state changes (after a successful commit in optimistic mode).",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description:
          "Track size. sm is 40×24 (16px thumb), default 44×24 (20px thumb), lg 52×28 (24px thumb).",
      },
      {
        prop: "color",
        type: '"default" | "success" | "destructive" | "warning"',
        default: '"default"',
        description: "Track color when checked.",
      },
      {
        prop: "label",
        type: "string",
        description: "Label rendered next to the switch.",
      },
      {
        prop: "description",
        type: "string",
        description: "Description rendered below the label.",
      },
      {
        prop: "labelPosition",
        type: '"start" | "end"',
        default: '"end"',
        description: "Side the label sits on relative to the switch.",
      },
      {
        prop: "thumbIcon",
        type: "ReactNode",
        description: "Icon shown in the thumb when unchecked.",
      },
      {
        prop: "thumbIconChecked",
        type: "ReactNode",
        description: "Icon shown in the thumb when checked.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description:
          "Shows a thumb spinner, disables toggling, and sets aria-busy.",
      },
      {
        prop: "error",
        type: "boolean",
        default: "false",
        description:
          "Sets aria-invalid and applies invalid styling to the track.",
      },
      {
        prop: "errorMessage",
        type: "string",
        description:
          "Error text rendered below the switch and linked via aria-errormessage.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the switch.",
      },
      {
        prop: "disabledReason",
        type: "ReactNode",
        description:
          "When disabled, shown as a tooltip on hover/focus and announced to screen readers.",
      },
      {
        prop: "readOnly",
        type: "boolean",
        default: "false",
        description:
          "Focusable but not toggleable; unlike disabled it stays in the tab order.",
      },
      {
        prop: "required",
        type: "boolean",
        default: "false",
        description: "Marks the switch as required for form validation.",
      },
      {
        prop: "optimistic",
        type: "boolean",
        default: "false",
        description:
          "Optimistic mode: flip instantly, commit via onCommit, revert + toast on rejection. Requires a controlled checked.",
      },
      {
        prop: "onCommit",
        type: "(checked: boolean) => Promise<void>",
        description:
          "Async commit run in optimistic mode; rejection reverts the flip.",
      },
      {
        prop: "commitErrorTitle",
        type: "ReactNode",
        description: "Toast title used when onCommit rejects.",
      },
      {
        prop: "checkedLabel",
        type: "string",
        description: "Live-region announcement when checked.",
      },
      {
        prop: "uncheckedLabel",
        type: "string",
        description: "Live-region announcement when unchecked.",
      },
      {
        prop: "name",
        type: "string",
        description: "Form field name for the hidden input.",
      },
      {
        prop: "value",
        type: "string",
        description: 'Submitted value when checked. Base UI default is "on".',
      },
      {
        prop: "uncheckedValue",
        type: "string",
        description:
          "Base UI 1.9: submitted value when unchecked (without it, unchecked switches submit nothing).",
      },
      {
        prop: "form",
        type: "string",
        description: "Base UI 1.9: id of the form the hidden input submits to.",
      },
      {
        prop: "inputRef",
        type: "Ref<HTMLInputElement>",
        description: "Ref forwarded to the hidden input element.",
      },
    ],
  },
  {
    title: "SwitchGroup",
    props: [
      {
        prop: "label",
        type: "string",
        description: "Group label rendered as a native fieldset legend.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"vertical"',
        description: "Layout direction of the group.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Switch components in the group.",
      },
    ],
  },
];

const changelogEntries: React.ComponentProps<typeof Changelog>["entries"] = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "changed",
        title: "Shared useOptimisticCommit seam",
        description:
          "Removed the direct toast dependency; optimistic switch commits now route through useOptimisticCommit (singleFlight: true).",
      },
      {
        type: "fixed",
        title: "Focus ring at full strength",
        description:
          "focus-visible now paints ring-[3px] ring-ring rather than ring-ring/50; the 50% halo fell to 1.63–2.82:1 against the page, below WCAG 1.4.11's minimum for a state indicator.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "9 November 2026",
    changes: [
      {
        type: "fixed",
        title: "State, saving and accessibility cleanup",
        description:
          "Thumb icons use Base UI state directly, including uncontrolled and programmatic updates. Async commits handle thrown and rejected errors, block duplicate saves, and keep caller description IDs. Loading spinners respect reduced motion.",
      },
      {
        type: "breaking",
        title: "Explicit commit and group contracts",
        description:
          "onCommit returns Promise<void>; await persistence inside the callback. SwitchGroup renders a fieldset and legend and accepts fieldset props. className is a string on the field wrapper.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "10 November 2026",
    changes: [
      {
        type: "breaking",
        title: "SwitchWithLabel removed",
        description:
          "Use the Switch component's built-in label/description props — they cover everything SwitchWithLabel did (sibling label, description text, label styling).",
      },
      {
        type: "breaking",
        title: "touchTarget prop removed; hit area is now always extended",
        description:
          "Every switch gets an invisible ::after hit-area extension (±8px) instead of optionally inflating the visible track. Visual layouts no longer shift when touchTarget was set.",
      },
      {
        type: "breaking",
        title: "sm size grew to a 40×24 track",
        description:
          "The old 36×20 sm track sat below the 24px WCAG 2.5.8 floor. sm now ships a 16px thumb on a 40×24 track (visually still the 'small' option).",
      },
      {
        type: "fixed",
        title: "Double state management deleted",
        description:
          "The internal checked mirror that duplicated Base UI's controlled/uncontrolled handling is gone; Base UI owns the state. Uncontrolled switches with thumb icons now flip correctly from a single source.",
      },
      {
        type: "added",
        title:
          "Optimistic auto-save (optimistic / onCommit / commitErrorTitle)",
        description:
          "Flip instantly, run the save async, revert + toast.error on rejection, block re-toggling while pending. Mirrors CheckboxCard's optimistic pattern.",
      },
      {
        type: "added",
        title: "disabledReason",
        description:
          "Disabled switches explain themselves: tooltip on hover AND keyboard focus, plus an sr-only reason linked via aria-describedby.",
      },
      {
        type: "added",
        title: "Base UI 1.9 parity props surfaced",
        description:
          "uncheckedValue and form pass through to the hidden input; loading sets aria-busy; data-checked/data-unchecked state attributes styleable.",
      },
      {
        type: "fixed",
        title: "Focus ring moved to the button exemplar",
        description:
          "focus-visible:ring-[3px] ring-ring/50 (was ring-2 ring-ring ring-offset-2), matching checkbox/button conventions.",
      },
      {
        type: "changed",
        title: "Audited against Base UI 1.9.0",
        description:
          "aria-label preferred over associated labels for bare switches; aria-describedby still wires description/error/reason.",
      },
    ],
  },
];

export default function SwitchPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Switch"
        version="v2.0.1"
        description="A two-state toggle switch: optimistic auto-save, explainable disabled states, Base UI 1.9 form parity, and full keyboard/screen reader support."
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

      <Changelog entries={changelogEntries} />
    </ComponentPage>
  );
}
