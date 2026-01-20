import * as React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
} from "@/components/ui/tabs";
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
  IconHome,
  IconSettings,
  IconUser,
  IconBell,
  IconChartBar,
  IconFileText,
} from "@tabler/icons-react";

export function TabsPage() {
  const [closableTabs, setClosableTabs] = React.useState([
    { value: "tab1", label: "Dashboard" },
    { value: "tab2", label: "Analytics" },
    { value: "tab3", label: "Reports" },
    { value: "tab4", label: "Settings" },
  ]);

  const handleCloseTab = (value: string) => {
    setClosableTabs((prev) => prev.filter((tab) => tab.value !== value));
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Tabs</h1>
        <p className="text-muted-foreground">
          Switch between different views with full accessibility and RTL support.
        </p>
      </header>

      {/* Basic Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Tabs
        </h2>
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
      </section>

      {/* With Icons (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Add icons to tabs using the <code className="bg-muted px-1 rounded">icon</code> prop.
        </p>
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
      </section>

      {/* With Badges (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Badges (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Add notification badges using <code className="bg-muted px-1 rounded">badge</code> and <code className="bg-muted px-1 rounded">badgeColor</code> props.
        </p>
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger value="inbox" icon={<IconBell />} badge={5} badgeColor="destructive">
              Inbox
            </TabsTrigger>
            <TabsTrigger value="analytics" icon={<IconChartBar />} badge="New" badgeColor="primary">
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
      </section>

      {/* Closable Tabs (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Closable Tabs (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">closable</code> and <code className="bg-muted px-1 rounded">onClose</code> props. 
          Supports Delete/Backspace keyboard shortcuts.
        </p>
        <Tabs defaultValue={closableTabs[0]?.value}>
          <TabsList>
            {closableTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                closable
                onClose={handleCloseTab}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {closableTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="p-4 rounded-lg border border-border">
                Content for {tab.label}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        {closableTabs.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            All tabs closed. Refresh to reset.
          </p>
        )}
      </section>

      {/* Vertical Orientation (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical Orientation (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">orientation="vertical"</code> for vertical tab layouts.
        </p>
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
                  General settings content
                </div>
              </TabsContent>
              <TabsContent value="profile" className="mt-0">
                <div className="p-4 rounded-lg border border-border">
                  Profile settings content
                </div>
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <div className="p-4 rounded-lg border border-border">
                  Notification settings content
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </section>

      {/* Color-Matched Backgrounds (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color-Matched Backgrounds (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          TabsList background automatically matches the color variant.
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Primary</p>
            <Tabs defaultValue="tab1" color="primary">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  Primary themed content
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  Tab 2 content
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  Tab 3 content
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Success</p>
            <Tabs defaultValue="tab1" color="success">
              <TabsList>
                <TabsTrigger value="tab1">Active</TabsTrigger>
                <TabsTrigger value="tab2">Completed</TabsTrigger>
                <TabsTrigger value="tab3">Archived</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                  Success themed content
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                  Completed content
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                  Archived content
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Destructive</p>
            <Tabs defaultValue="tab1" color="destructive">
              <TabsList>
                <TabsTrigger value="tab1">Errors</TabsTrigger>
                <TabsTrigger value="tab2">Warnings</TabsTrigger>
                <TabsTrigger value="tab3">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                  Error logs content
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                  Warning logs content
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                  All logs content
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Underline Variant with Indicator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Underline Variant (Auto Indicator)
        </h2>
        <p className="text-sm text-muted-foreground">
          The indicator is automatically included for underline variant.
        </p>
        <Tabs defaultValue="all" variant="underline">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="p-4 rounded-lg border border-border mt-4">
              All items content
            </div>
          </TabsContent>
          <TabsContent value="active">
            <div className="p-4 rounded-lg border border-border mt-4">
              Active items content
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="p-4 rounded-lg border border-border mt-4">
              Completed items content
            </div>
          </TabsContent>
          <TabsContent value="archived">
            <div className="p-4 rounded-lg border border-border mt-4">
              Archived items content
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Underline with Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Underline with Color Indicator
        </h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Primary</p>
            <Tabs defaultValue="tab1" variant="underline" color="primary">
              <TabsList>
                <TabsTrigger value="tab1">Overview</TabsTrigger>
                <TabsTrigger value="tab2">Analytics</TabsTrigger>
                <TabsTrigger value="tab3">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-4 rounded-lg border border-border mt-4">
                  Overview with primary indicator
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-4 rounded-lg border border-border mt-4">
                  Analytics content
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-4 rounded-lg border border-border mt-4">
                  Reports content
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Warning</p>
            <Tabs defaultValue="pending" variant="underline" color="warning">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="review">In Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 mt-4">
                  Pending items
                </div>
              </TabsContent>
              <TabsContent value="review">
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 mt-4">
                  Items in review
                </div>
              </TabsContent>
              <TabsContent value="approved">
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 mt-4">
                  Approved items
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Pills Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Pills Variant
        </h2>
        <Tabs defaultValue="overview" variant="pills">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="p-4 rounded-lg bg-muted/50 mt-2">
              Overview content
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="p-4 rounded-lg bg-muted/50 mt-2">
              Analytics content
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="p-4 rounded-lg bg-muted/50 mt-2">
              Reports content
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Soft Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Soft Variant
        </h2>
        <p className="text-sm text-muted-foreground">
          Subtle background highlight with primary color accent.
        </p>
        <Tabs defaultValue="overview" variant="soft">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="p-4 rounded-lg border border-border mt-4">
              Overview content with soft styling
            </div>
          </TabsContent>
          <TabsContent value="details">
            <div className="p-4 rounded-lg border border-border mt-4">
              Details content with soft styling
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-4 rounded-lg border border-border mt-4">
              Settings content with soft styling
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Card Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Card Variant
        </h2>
        <p className="text-sm text-muted-foreground">
          Active tab appears as a card with shadow and border.
        </p>
        <Tabs defaultValue="first" variant="card">
          <TabsList>
            <TabsTrigger value="first">First</TabsTrigger>
            <TabsTrigger value="second">Second</TabsTrigger>
            <TabsTrigger value="third">Third</TabsTrigger>
          </TabsList>
          <TabsContent value="first">
            <div className="p-4 rounded-lg border border-border mt-4">
              First tab content with card styling
            </div>
          </TabsContent>
          <TabsContent value="second">
            <div className="p-4 rounded-lg border border-border mt-4">
              Second tab content with card styling
            </div>
          </TabsContent>
          <TabsContent value="third">
            <div className="p-4 rounded-lg border border-border mt-4">
              Third tab content with card styling
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Lazy Loading (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Lazy Loading (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">lazy</code> prop to only render panel content when first activated.
        </p>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Eager (Default)</TabsTrigger>
            <TabsTrigger value="tab2">Lazy Loaded</TabsTrigger>
            <TabsTrigger value="tab3">Lazy Loaded</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border">
              This content is rendered immediately
            </div>
          </TabsContent>
          <TabsContent value="tab2" lazy>
            <div className="p-4 rounded-lg border border-border">
              This content was lazy loaded (only rendered when tab activated)
            </div>
          </TabsContent>
          <TabsContent value="tab3" lazy>
            <div className="p-4 rounded-lg border border-border">
              This content was also lazy loaded
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Animations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Content Animations
        </h2>
        <p className="text-sm text-muted-foreground">
          TabsContent supports different entrance animations: fade, slide,
          slideUp, and zoom.
        </p>
        <Tabs defaultValue="slide">
          <TabsList>
            <TabsTrigger value="slide">Slide Right</TabsTrigger>
            <TabsTrigger value="slideUp">Slide Up</TabsTrigger>
            <TabsTrigger value="zoom">Zoom</TabsTrigger>
            <TabsTrigger value="fade">Fade</TabsTrigger>
          </TabsList>
          <TabsContent value="slide" animation="slide">
            <div className="p-4 rounded-lg border border-border mt-4">
              This content slides in from the right
            </div>
          </TabsContent>
          <TabsContent value="slideUp" animation="slideUp">
            <div className="p-4 rounded-lg border border-border mt-4">
              This content slides in from the bottom
            </div>
          </TabsContent>
          <TabsContent value="zoom" animation="zoom">
            <div className="p-4 rounded-lg border border-border mt-4">
              This content zooms in
            </div>
          </TabsContent>
          <TabsContent value="fade" animation="fade">
            <div className="p-4 rounded-lg border border-border mt-4">
              This content fades in (default)
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Manual Indicator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Manual Indicator
        </h2>
        <p className="text-sm text-muted-foreground">
          You can also add TabsIndicator manually for more control.
        </p>
        <Tabs defaultValue="tab1" variant="underline" showIndicator={false}>
          <TabsList className="relative">
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Analytics</TabsTrigger>
            <TabsTrigger value="tab3">Reports</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border mt-4">
              Overview with manual indicator
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border mt-4">
              Analytics with manual indicator
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border mt-4">
              Reports with manual indicator
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
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

// With icons and badges (New)
<TabsTrigger value="inbox" icon={<IconBell />} badge={5} badgeColor="destructive">
  Inbox
</TabsTrigger>

// Closable tabs (New)
<TabsTrigger value="tab1" closable onClose={(value) => removeTab(value)}>
  Closable Tab
</TabsTrigger>

// Vertical orientation (New)
<Tabs orientation="vertical">
  ...
</Tabs>

// Color-matched backgrounds (New)
<Tabs color="primary">
  <TabsList> {/* Gets bg-primary/10 */}
    ...
  </TabsList>
</Tabs>

// Underline with auto indicator
<Tabs variant="underline">
  <TabsList> {/* Indicator included automatically */}
    ...
  </TabsList>
</Tabs>

// Lazy loading (New)
<TabsContent value="tab1" lazy>
  Heavy content loaded on demand
</TabsContent>

// With animations
<TabsContent value="tab1" animation="slide">
  Content slides in from right
</TabsContent>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
