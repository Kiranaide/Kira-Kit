import * as React from "react";
import {
  IconHome,
  IconSettings,
  IconUser,
  IconBell,
  IconChartBar,
  IconFileText,
  IconKeyboard,
  IconPalette,
  IconAccessible,
} from "@tabler/icons-react";

import { Tabs, TabsList, TabsTrigger, TabsContent, KiraTabs } from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="john@example.com" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your settings here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Settings content goes here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

const basicCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function BasicTabs() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input id="name" defaultValue="John Doe" />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">Password content...</TabsContent>
      <TabsContent value="settings">Settings content...</TabsContent>
    </Tabs>
  )
}`;

function VariantsDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-medium">Default</p>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border">
              Default variant content
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border">Tab 2</div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border">Tab 3</div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">
          Underline (with animated indicator)
        </p>
        <Tabs defaultValue="tab1" variant="underline">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Analytics</TabsTrigger>
            <TabsTrigger value="tab3">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border mt-4">
              Underline variant with animated indicator
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border mt-4">
              Analytics
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border mt-4">
              Reports
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Pills</p>
        <Tabs defaultValue="tab1" variant="pills">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Analytics</TabsTrigger>
            <TabsTrigger value="tab3">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg bg-muted/50 mt-2">Pills variant</div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg bg-muted/50 mt-2">Analytics</div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg bg-muted/50 mt-2">Reports</div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Soft</p>
        <Tabs defaultValue="tab1" variant="soft">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Details</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border mt-4">
              Soft variant with subtle highlight
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border mt-4">
              Details
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border mt-4">
              Settings
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Card</p>
        <Tabs defaultValue="tab1" variant="card">
          <TabsList>
            <TabsTrigger value="tab1">First</TabsTrigger>
            <TabsTrigger value="tab2">Second</TabsTrigger>
            <TabsTrigger value="tab3">Third</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border mt-4">
              Card variant with shadow
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border mt-4">
              Second
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border mt-4">
              Third
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Color Variants</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Primary</p>
            <Tabs defaultValue="tab1" color="primary">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Success</p>
            <Tabs defaultValue="tab1" color="success">
              <TabsList>
                <TabsTrigger value="tab1">Active</TabsTrigger>
                <TabsTrigger value="tab2">Done</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Destructive</p>
            <Tabs defaultValue="tab1" color="destructive">
              <TabsList>
                <TabsTrigger value="tab1">Errors</TabsTrigger>
                <TabsTrigger value="tab2">Warnings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

const variantsCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Underline variant with animated indicator
<Tabs defaultValue="tab1" variant="underline">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Overview content</TabsContent>
  <TabsContent value="tab2">Analytics content</TabsContent>
</Tabs>

// Pills variant
<Tabs defaultValue="tab1" variant="pills">...</Tabs>

// Soft variant
<Tabs defaultValue="tab1" variant="soft">...</Tabs>

// Card variant
<Tabs defaultValue="tab1" variant="card">...</Tabs>

// With color
<Tabs defaultValue="tab1" color="primary">...</Tabs>
<Tabs defaultValue="tab1" color="success">...</Tabs>
<Tabs defaultValue="tab1" color="destructive">...</Tabs>`;

function VerticalDemo() {
  return (
    <Tabs defaultValue="general" orientation="vertical">
      <div className="flex gap-4">
        <TabsList className="w-48">
          <TabsTrigger value="general" icon={<IconSettings />}>
            General
          </TabsTrigger>
          <TabsTrigger value="profile" icon={<IconUser />}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" icon={<IconBell />}>
            Notifications
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="general" className="mt-0">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">General Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your general application settings here.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">
                Update your profile information and preferences.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage how you receive notifications.
              </p>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

const verticalCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { IconSettings, IconUser, IconBell } from "@tabler/icons-react"

export function VerticalTabs() {
  return (
    <Tabs defaultValue="general" orientation="vertical">
      <div className="flex gap-4">
        <TabsList className="w-48">
          <TabsTrigger value="general" icon={<IconSettings />}>
            General
          </TabsTrigger>
          <TabsTrigger value="profile" icon={<IconUser />}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" icon={<IconBell />}>
            Notifications
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="general" className="mt-0">
            General settings content
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            Profile settings content
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            Notification settings content
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}`;

function IconsDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-medium">With Icons</p>
        <Tabs defaultValue="home">
          <TabsList>
            <TabsTrigger value="home" icon={<IconHome />}>
              Home
            </TabsTrigger>
            <TabsTrigger value="profile" icon={<IconUser />}>
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" icon={<IconSettings />}>
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <div className="p-4 rounded-lg border border-border">
              Home content with icon
            </div>
          </TabsContent>
          <TabsContent value="profile">
            <div className="p-4 rounded-lg border border-border">
              Profile content with icon
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-4 rounded-lg border border-border">
              Settings content with icon
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">With Badges</p>
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger
              value="inbox"
              icon={<IconBell />}
              badge={5}
              badgeColor="destructive"
            >
              Inbox
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              icon={<IconChartBar />}
              badge="New"
              badgeColor="primary"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" icon={<IconFileText />}>
              Reports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox">
            <div className="p-4 rounded-lg border border-border">
              You have 5 unread notifications
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="p-4 rounded-lg border border-border">
              New analytics features available
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="p-4 rounded-lg border border-border">
              Reports content
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const iconsCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { IconHome, IconUser, IconSettings, IconBell, IconChartBar } from "@tabler/icons-react"

// With icons
<Tabs defaultValue="home">
  <TabsList>
    <TabsTrigger value="home" icon={<IconHome />}>
      Home
    </TabsTrigger>
    <TabsTrigger value="profile" icon={<IconUser />}>
      Profile
    </TabsTrigger>
    <TabsTrigger value="settings" icon={<IconSettings />}>
      Settings
    </TabsTrigger>
  </TabsList>
  <TabsContent value="home">Home content</TabsContent>
</Tabs>

// With badges
<TabsTrigger value="inbox" icon={<IconBell />} badge={5} badgeColor="destructive">
  Inbox
</TabsTrigger>
<TabsTrigger value="analytics" icon={<IconChartBar />} badge="New" badgeColor="primary">
  Analytics
</TabsTrigger>`;

function DisabledDemo() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Tab</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled Tab
          </TabsTrigger>
          <TabsTrigger value="another">Another Tab</TabsTrigger>
          <TabsTrigger value="also-disabled" disabled>
            Also Disabled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="p-4 rounded-lg border border-border">
            This is the active tab content. The disabled tabs cannot be
            selected.
          </div>
        </TabsContent>
        <TabsContent value="another">
          <div className="p-4 rounded-lg border border-border">
            Another tab content.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const disabledCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function DisabledTabs() {
  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active Tab</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled Tab
        </TabsTrigger>
        <TabsTrigger value="another">Another Tab</TabsTrigger>
        <TabsTrigger value="also-disabled" disabled>
          Also Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        This is the active tab content.
      </TabsContent>
      <TabsContent value="another">
        Another tab content.
      </TabsContent>
    </Tabs>
  )
}`;

function ControlledDemo() {
  const [activeTab, setActiveTab] = React.useState("first");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("first")}
          className={`px-3 py-1 text-sm rounded border ${
            activeTab === "first"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Go to First
        </button>
        <button
          onClick={() => setActiveTab("second")}
          className={`px-3 py-1 text-sm rounded border ${
            activeTab === "second"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Go to Second
        </button>
        <button
          onClick={() => setActiveTab("third")}
          className={`px-3 py-1 text-sm rounded border ${
            activeTab === "third"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Go to Third
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">
          <div className="p-4 rounded-lg border border-border">
            <p className="font-medium">First Tab Content</p>
            <p className="text-sm text-muted-foreground mt-1">
              Current active tab:{" "}
              <code className="bg-muted px-1 rounded">{activeTab}</code>
            </p>
          </div>
        </TabsContent>
        <TabsContent value="second">
          <div className="p-4 rounded-lg border border-border">
            <p className="font-medium">Second Tab Content</p>
            <p className="text-sm text-muted-foreground mt-1">
              Current active tab:{" "}
              <code className="bg-muted px-1 rounded">{activeTab}</code>
            </p>
          </div>
        </TabsContent>
        <TabsContent value="third">
          <div className="p-4 rounded-lg border border-border">
            <p className="font-medium">Third Tab Content</p>
            <p className="text-sm text-muted-foreground mt-1">
              Current active tab:{" "}
              <code className="bg-muted px-1 rounded">{activeTab}</code>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const controlledCode = `import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function ControlledTabs() {
  const [activeTab, setActiveTab] = useState("first")

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("first")}>Go to First</button>
        <button onClick={() => setActiveTab("second")}>Go to Second</button>
        <button onClick={() => setActiveTab("third")}>Go to Third</button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
          <TabsTrigger value="third">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="first">
          First Tab - Current: {activeTab}
        </TabsContent>
        <TabsContent value="second">
          Second Tab - Current: {activeTab}
        </TabsContent>
        <TabsContent value="third">
          Third Tab - Current: {activeTab}
        </TabsContent>
      </Tabs>
    </div>
  )
}`;

const features = [
  {
    icon: <IconAccessible className="h-4 w-4" />,
    title: "Accessible",
    description:
      "WAI-ARIA compliant with proper roles, keyboard navigation (arrow keys, Home, End), and screen reader support.",
  },
  {
    icon: <IconPalette className="h-4 w-4" />,
    title: "Multiple Variants",
    description:
      "Choose from default, underline, pills, soft, and card variants with color theming support.",
  },
  {
    icon: <IconKeyboard className="h-4 w-4" />,
    title: "Feature Rich",
    description:
      "Icons, badges, closable tabs, lazy loading, animations, and vertical orientation support.",
  },
];

const keyboardShortcuts = [
  { keys: "← / →", description: "Navigate between tabs (horizontal)" },
  { keys: "↑ / ↓", description: "Navigate between tabs (vertical)" },
  { keys: "Home", description: "Go to first tab" },
  { keys: "End", description: "Go to last tab" },
  { keys: "Enter / Space", description: "Activate focused tab" },
  { keys: "Delete / Backspace", description: "Close tab (if closable)" },
];

const usageCode = `import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  KiraTabs,
} from "@/components/ui/tabs"

// Basic usage
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// With icons and badges
<TabsTrigger value="inbox" icon={<IconBell />} badge={5} badgeColor="destructive">
  Inbox
</TabsTrigger>

// Closable tabs
<TabsTrigger value="tab1" closable onClose={(value) => removeTab(value)}>
  Closable Tab
</TabsTrigger>

// Underline with auto indicator (underline variant only)
<Tabs variant="underline">
  <TabsList> {/* Indicator included automatically */}
    ...
  </TabsList>
</Tabs>

// Lazy loading — unmounts on leave, remounts on re-entry
<TabsContent value="tab1" lazy>
  Heavy content loaded on demand
</TabsContent>

// KiraTabs — prop-driven, with closable + add-tab
<KiraTabs
  variant="underline"
  addable
  onAdd={() => ({ value: crypto.randomUUID(), label: "New", content: "..." })}
  items={[
    { value: "a", label: "First", content: "One", closable: true },
    { value: "b", label: "Second", content: "Two", closable: true },
  ]}
/>`;

const apiSections = [
  {
    title: "Tabs",
    props: [
      {
        prop: "defaultValue",
        type: "string",
        description: "Default active tab value (uncontrolled)",
      },
      {
        prop: "value",
        type: "string",
        description: "Active tab value (controlled)",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        description: "Callback when active tab changes",
      },
      {
        prop: "variant",
        type: '"default" | "outline" | "underline" | "pills" | "soft" | "card"',
        default: '"default"',
        description: "Visual style variant",
      },
      {
        prop: "color",
        type: '"default" | "primary" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Color theme for tabs",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Tab layout orientation",
      },
      {
        prop: "showIndicator",
        type: "boolean",
        default: "true",
        description: "Show animated indicator (underline variant)",
      },
    ],
  },
  {
    title: "TabsTrigger",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Unique value for the tab (required)",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the tab",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Icon to display before label",
      },
      {
        prop: "badge",
        type: "string | number",
        description: "Badge content to display after label",
      },
      {
        prop: "badgeColor",
        type: '"default" | "primary" | "destructive" | "success" | "warning"',
        default: '"default"',
        description: "Badge color variant",
      },
      {
        prop: "closable",
        type: "boolean",
        default: "false",
        description: "Show close button",
      },
      {
        prop: "onClose",
        type: "(value: string) => void",
        description: "Callback when close button clicked",
      },
    ],
  },
  {
    title: "TabsContent",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Corresponding trigger value (required)",
      },
      {
        prop: "lazy",
        type: "boolean",
        default: "false",
        description:
          "Mount content only when first activated; unmounts on leave (use keepMounted to retain state)",
      },
      {
        prop: "animation",
        type: '"none" | "fade" | "slide" | "slideUp" | "zoom"',
        default: '"fade"',
        description: "Entrance animation style",
      },
    ],
  },
  {
    title: "KiraTabs",
    props: [
      {
        prop: "items",
        type: "TabItem[]",
        description:
          "Tabs as data: { value, label, icon?, badge?, content?, closable?, disabled? }",
      },
      {
        prop: "variant / color / orientation",
        type: "same as Tabs",
        description: "Forwarded to the underlying Tabs",
      },
      {
        prop: "addable",
        type: "boolean",
        default: "false",
        description: "Show a trailing + button",
      },
      {
        prop: "onAdd",
        type: "() => TabItem | void",
        description: "Return a new item to append and select it",
      },
      {
        prop: "onClose",
        type: "(value: string) => void",
        description: "Called after a closable tab is removed",
      },
      {
        prop: "lazy",
        type: "boolean",
        default: "false",
        description: "Native unmount for inactive panels",
      },
    ],
  },
];

const kiraCode = `import { KiraTabs } from "@/components/ui/tabs"

// Tabs as data — closable tabs auto-select a neighbour on close,
// and the + button appends a new tab.
const [id, setId] = useState(3)

<KiraTabs
  variant="underline"
  addable
  onAdd={() => {
    const value = \`tab-\${id}\`
    setId((n) => n + 1)
    return { value, label: \`Tab \${id}\`, content: "Fresh panel", closable: true }
  }}
  items={[
    { value: "tab-1", label: "First", content: "First panel", closable: true },
    { value: "tab-2", label: "Second", content: "Second panel", closable: true },
  ]}
/>`;

function KiraBasicDemo() {
  const items: TabItem[] = [
    {
      value: "overview",
      label: "Overview",
      icon: <IconHome />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Declared as an items array.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            KiraTabs wires the list, triggers, and panels from a single prop.
          </CardContent>
        </Card>
      ),
    },
    {
      value: "activity",
      label: "Activity",
      icon: <IconBell />,
      badge: 3,
      badgeColor: "primary",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Icons and badges come from data too.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No JSX plumbing per tab.
          </CardContent>
        </Card>
      ),
    },
    {
      value: "settings",
      label: "Settings",
      icon: <IconSettings />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Everything the primitives support, driven by props.
          </CardContent>
        </Card>
      ),
    },
  ];

  return <KiraTabs variant="pills" items={items} />;
}

const editorInitialItems: TabItem[] = [
  {
    value: "tab-1",
    label: "index.ts",
    content: (
      <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
        export const one = 1
      </div>
    ),
    closable: true,
  },
  {
    value: "tab-2",
    label: "utils.ts",
    content: (
      <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
        export const two = 2
      </div>
    ),
    closable: true,
  },
];

function KiraEditorDemo() {
  const [nextId, setNextId] = React.useState(3);

  // Uncontrolled: KiraTabs owns the tab list, so close (auto-selects a
  // neighbour) and add both work without the parent tracking items. The
  // initial array is module-level so a re-render never resets the list.
  return (
    <KiraTabs
      variant="underline"
      items={editorInitialItems}
      addable
      onAdd={() => {
        const value = `tab-${nextId}`;
        setNextId((n) => n + 1);

        const created: TabItem = {
          value,
          label: `untitled-${nextId}.ts`,
          content: (
            <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
              // new file
            </div>
          ),
          closable: true,
        };

        return created;
      }}
    />
  );
}

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Tabs"
        description="Simple horizontal tabs with content panels."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraTabs",
    demo: (
      <DemoWrapper
        title="KiraTabs (items array)"
        description="Prop-driven tabs from a single data array — icons, badges, and panels included."
        code={kiraCode}
      >
        <KiraBasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "editor",
    label: "Closable + Add",
    demo: (
      <DemoWrapper
        title="Editor tabs"
        description="Closable tabs auto-select a neighbour on close; the + button appends a new tab."
        code={kiraCode}
      >
        <KiraEditorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Tab Variants"
        description="Different visual styles: default, underline, pills, soft, card, and colors."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "vertical",
    label: "Vertical",
    demo: (
      <DemoWrapper
        title="Vertical Orientation"
        description="Tabs arranged vertically with content to the side."
        code={verticalCode}
      >
        <VerticalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "Icons",
    demo: (
      <DemoWrapper
        title="Icons & Badges"
        description="Tabs with icons and notification badges."
        code={iconsCode}
      >
        <IconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled",
    label: "Disabled",
    demo: (
      <DemoWrapper
        title="Disabled Tabs"
        description="Individual tabs can be disabled to prevent selection."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controlled",
    label: "Controlled",
    demo: (
      <DemoWrapper
        title="Controlled State"
        description="Programmatically control the active tab from external state."
        code={controlledCode}
      >
        <ControlledDemo />
      </DemoWrapper>
    ),
  },
];

export default function TabsPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Tabs"
        description="Switch between different views with full accessibility, RTL support, and multiple style variants."
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Tabs components with various configurations."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for Tabs components."
      />

      <Changelog
        entries={[
          {
            version: "v2.0.0",
            date: "2026-07-13",
            changes: [
              {
                type: "added",
                title: "KiraTabs mega-component",
                description:
                  "Prop-driven tabs from an items array, with closable tabs (auto-selects a neighbour) and an add-tab (+) button.",
              },
              {
                type: "breaking",
                title: "Removed TabsIndicator & TabsScrollButton",
                description:
                  "The underline indicator is now automatic inside TabsList; the scroll button + scrollable prop were no-ops (needed an uninstalled plugin) and were removed.",
              },
              {
                type: "breaking",
                title: "lazy now uses native unmount",
                description:
                  "Lazy panels unmount on leave and remount on re-entry (losing internal state). Pass keepMounted to retain state. Also fixes a cross-talk bug between tab groups sharing a value.",
              },
              {
                type: "changed",
                title: "Indicator is underline-only",
                description:
                  "The fill pill behind non-underline variants was removed — the trigger's own selected background owns the highlight, ending the double treatment.",
              },
              {
                type: "fixed",
                title: "Reduced motion",
                description:
                  "The indicator's transition is gated on prefers-reduced-motion via the shared hook.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
