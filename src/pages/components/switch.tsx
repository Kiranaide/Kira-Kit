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
  IconBluetooth,
  IconBluetoothOff,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

export function SwitchPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [wifi, setWifi] = React.useState(true);
  const [volume, setVolume] = React.useState(false);
  const [bluetooth, setBluetooth] = React.useState(true);
  const [hasError, setHasError] = React.useState(true);

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Switch</h1>
        <p className="text-muted-foreground">
          A two-state toggle switch component with full accessibility support.
        </p>
      </header>

      {/* Basic Switch */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Switch
        </h2>
        <div className="flex items-center gap-4">
          <Switch id="basic-unchecked" />
          <Switch id="basic-checked" checked />
          <Switch id="basic-disabled" disabled />
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
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
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch color="default" id="col-default" checked />
            <label htmlFor="col-default" className="text-sm">
              Default
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch color="success" id="col-success" checked />
            <label htmlFor="col-success" className="text-sm">
              Success
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch color="destructive" id="col-destructive" checked />
            <label htmlFor="col-destructive" className="text-sm">
              Destructive
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch color="warning" id="col-warning" checked />
            <label htmlFor="col-warning" className="text-sm">
              Warning
            </label>
          </div>
        </div>
      </section>

      {/* Label Position (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Label Position (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">labelPosition</code> to place the label before or after the switch.
        </p>
        <div className="space-y-4 max-w-md">
          <Switch
            label="Label at end (default)"
            description="The label appears after the switch"
            labelPosition="end"
          />
          <Switch
            label="Label at start"
            description="The label appears before the switch"
            labelPosition="start"
          />
        </div>
      </section>

      {/* Error Message (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Error Message (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Display validation errors with proper ARIA attributes for accessibility.
        </p>
        <div className="space-y-4 max-w-md">
          <Switch
            label="Accept terms and conditions"
            description="You must accept to continue"
            errorMessage={hasError ? "You must accept the terms to proceed" : undefined}
            checked={!hasError}
            onCheckedChange={(checked) => setHasError(!checked)}
            required
          />
          <p className="text-xs text-muted-foreground">
            ✓ aria-invalid • aria-errormessage • aria-describedby
          </p>
        </div>
      </section>

      {/* Screen Reader Announcements (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Screen Reader Announcements (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Custom labels for checked/unchecked states announced to screen readers.
        </p>
        <div className="space-y-4 max-w-md">
          <Switch
            label="Airplane Mode"
            description="Toggle airplane mode on your device"
            checkedLabel="Airplane mode enabled"
            uncheckedLabel="Airplane mode disabled"
          />
        </div>
      </section>

      {/* Touch Target (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Touch Target (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">touchTarget</code> to ensure WCAG 2.2 AA compliant 44×44px minimum touch area.
        </p>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch id="touch-normal" />
            <label htmlFor="touch-normal" className="text-sm">
              Normal
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="touch-target" touchTarget />
            <label htmlFor="touch-target" className="text-sm">
              With Touch Target (44px min)
            </label>
          </div>
        </div>
      </section>

      {/* Switch Group (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Switch Group (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Group related switches with proper accessibility attributes.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <SwitchGroup label="Notification Settings" orientation="vertical">
            <Switch label="Email notifications" />
            <Switch label="Push notifications" defaultChecked />
            <Switch label="SMS notifications" />
          </SwitchGroup>
          <SwitchGroup label="Privacy Settings" orientation="vertical">
            <Switch label="Public profile" defaultChecked />
            <Switch label="Show online status" defaultChecked />
            <Switch label="Allow messages from anyone" />
          </SwitchGroup>
        </div>
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Label
        </h2>
        <div className="space-y-4 max-w-md">
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
      </section>

      {/* With Icon Support */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Support
        </h2>
        <p className="text-sm text-muted-foreground">
          Use thumbIcon for unchecked state and thumbIconChecked for checked state.
        </p>

        <div className="space-y-6">
          {/* Theme Switch */}
          <div className="flex items-center gap-4">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              size="lg"
              thumbIcon={<IconMoon className="h-4 w-4" />}
              thumbIconChecked={<IconSun className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Theme Switch</p>
              <p className="text-sm text-muted-foreground">
                Toggle between moon and sun icons
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center gap-4">
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              size="lg"
              thumbIcon={<IconBellOff className="h-4 w-4" />}
              thumbIconChecked={<IconBell className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">
                Bell icon changes based on state
              </p>
            </div>
          </div>

          {/* WiFi */}
          <div className="flex items-center gap-4">
            <Switch
              checked={wifi}
              onCheckedChange={setWifi}
              size="lg"
              thumbIcon={<IconWifiOff className="h-4 w-4" />}
              thumbIconChecked={<IconWifi className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">WiFi</p>
              <p className="text-sm text-muted-foreground">
                WiFi icon indicates connection status
              </p>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4">
            <Switch
              checked={volume}
              onCheckedChange={setVolume}
              size="lg"
              thumbIcon={<IconVolumeOff className="h-4 w-4" />}
              thumbIconChecked={<IconVolume className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Sound</p>
              <p className="text-sm text-muted-foreground">
                Volume icon shows sound state
              </p>
            </div>
          </div>

          {/* Bluetooth */}
          <div className="flex items-center gap-4">
            <Switch
              checked={bluetooth}
              onCheckedChange={setBluetooth}
              size="lg"
              thumbIcon={<IconBluetoothOff className="h-4 w-4" />}
              thumbIconChecked={<IconBluetooth className="h-4 w-4" />}
            />
            <div>
              <p className="text-sm font-medium">Bluetooth</p>
              <p className="text-sm text-muted-foreground">
                Bluetooth icon with brand color
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Icons with Check/X */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Check/X Icons
        </h2>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              thumbIcon={<IconX className="h-4 w-4" />}
              thumbIconChecked={<IconCheck className="h-4 w-4" />}
            />
            <span className="text-sm">Enable feature</span>
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <div className="flex items-center gap-8">
          <Switch loading id="loading-unchecked" />
          <Switch loading id="loading-checked" checked />
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Error State
        </h2>
        <div className="flex items-center gap-8">
          <Switch error id="error-unchecked" />
          <Switch error id="error-checked" checked />
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled State
        </h2>
        <div className="flex items-center gap-8">
          <Switch disabled id="disabled-unchecked" />
          <Switch disabled id="disabled-checked" checked />
        </div>
      </section>

      {/* Settings Panel Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Settings Panel Example
        </h2>
        <p className="text-sm text-muted-foreground">
          A realistic settings panel combining multiple switches.
        </p>
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
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Switch, SwitchWithLabel, SwitchGroup } from "@/components/ui/switch"

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

// With error message (New)
<Switch
  label="Accept terms"
  errorMessage="You must accept the terms"
  required
/>

// Screen reader announcements (New)
<Switch
  label="Airplane Mode"
  checkedLabel="Airplane mode enabled"
  uncheckedLabel="Airplane mode disabled"
/>

// Touch target for mobile (New)
<Switch touchTarget />

// Switch group (New)
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
<Switch error />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
