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

export function TabsPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Tabs</h1>
        <p className="text-muted-foreground">
          Switch between different views of content.
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

      {/* Outline Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Outline Variant
        </h2>
        <Tabs defaultValue="tab1">
          <TabsList variant="outline">
            <TabsTrigger value="tab1" variant="outline">
              Tab 1
            </TabsTrigger>
            <TabsTrigger value="tab2" variant="outline">
              Tab 2
            </TabsTrigger>
            <TabsTrigger value="tab3" variant="outline">
              Tab 3
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border mt-2">
              Content for Tab 1
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border mt-2">
              Content for Tab 2
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border mt-2">
              Content for Tab 3
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Pills Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Pills Variant
        </h2>
        <Tabs defaultValue="overview">
          <TabsList variant="pills">
            <TabsTrigger value="overview" variant="pills">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" variant="pills">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" variant="pills">
              Reports
            </TabsTrigger>
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

      {/* Underline Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Underline Variant
        </h2>
        <p className="text-sm text-muted-foreground">
          A clean underline style with animated border indicator.
        </p>
        <Tabs defaultValue="all">
          <TabsList variant="underline">
            <TabsTrigger value="all" variant="underline">
              All
            </TabsTrigger>
            <TabsTrigger value="active" variant="underline">
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" variant="underline">
              Completed
            </TabsTrigger>
            <TabsTrigger value="archived" variant="underline">
              Archived
            </TabsTrigger>
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

      {/* Soft Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Soft Variant
        </h2>
        <p className="text-sm text-muted-foreground">
          Subtle background highlight with primary color accent.
        </p>
        <Tabs defaultValue="overview">
          <TabsList variant="soft">
            <TabsTrigger value="overview" variant="soft">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" variant="soft">
              Details
            </TabsTrigger>
            <TabsTrigger value="settings" variant="soft">
              Settings
            </TabsTrigger>
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
        <Tabs defaultValue="first">
          <TabsList variant="card">
            <TabsTrigger value="first" variant="card">
              First
            </TabsTrigger>
            <TabsTrigger value="second" variant="card">
              Second
            </TabsTrigger>
            <TabsTrigger value="third" variant="card">
              Third
            </TabsTrigger>
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

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Combine style variants with color variants for different themes.
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Success (Default)</p>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="all" color="success">All</TabsTrigger>
                <TabsTrigger value="active" color="success">Active</TabsTrigger>
                <TabsTrigger value="done" color="success">Done</TabsTrigger>
              </TabsList>
              <TabsContent value="all" animation="slide">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 mt-4">
                  All tasks content
                </div>
              </TabsContent>
              <TabsContent value="active" animation="slide">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 mt-4">
                  Active tasks content
                </div>
              </TabsContent>
              <TabsContent value="done" animation="slide">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 mt-4">
                  Done tasks content
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Success (Pills)</p>
            <Tabs defaultValue="active">
              <TabsList variant="pills">
                <TabsTrigger value="all" variant="pills" color="success">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" variant="pills" color="success">
                  Active
                </TabsTrigger>
                <TabsTrigger value="done" variant="pills" color="success">
                  Done
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" animation="slide">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 mt-4">
                  All tasks content
                </div>
              </TabsContent>
              <TabsContent value="active" animation="slide">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 mt-4">
                  Active tasks content
                </div>
              </TabsContent>
              <TabsContent value="done" animation="slide">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 mt-4">
                  Done tasks content
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Warning (Underline)</p>
            <Tabs defaultValue="pending">
              <TabsList variant="underline">
                <TabsTrigger
                  value="pending"
                  variant="underline"
                  color="warning"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger value="review" variant="underline" color="warning">
                  In Review
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  variant="underline"
                  color="warning"
                >
                  Approved
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" animation="slideUp">
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 mt-4">
                  Pending items
                </div>
              </TabsContent>
              <TabsContent value="review" animation="slideUp">
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 mt-4">
                  Items in review
                </div>
              </TabsContent>
              <TabsContent value="approved" animation="slideUp">
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 mt-4">
                  Approved items
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Destructive (Soft)</p>
            <Tabs defaultValue="errors">
              <TabsList variant="soft">
                <TabsTrigger value="errors" variant="soft" color="destructive">
                  Errors
                </TabsTrigger>
                <TabsTrigger
                  value="warnings"
                  variant="soft"
                  color="destructive"
                >
                  Warnings
                </TabsTrigger>
                <TabsTrigger value="logs" variant="soft" color="destructive">
                  Logs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="errors" animation="zoom">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 mt-4">
                  Error logs
                </div>
              </TabsContent>
              <TabsContent value="warnings" animation="zoom">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 mt-4">
                  Warning logs
                </div>
              </TabsContent>
              <TabsContent value="logs" animation="zoom">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 mt-4">
                  All logs
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
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

      {/* With Indicator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Indicator
        </h2>
        <p className="text-sm text-muted-foreground">
          TabsIndicator provides a smooth animated indicator that follows the
          active tab. Works best with underline and default variants.
        </p>
        <Tabs defaultValue="tab1">
          <TabsList variant="underline" className="relative">
            <TabsTrigger value="tab1" variant="underline">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tab2" variant="underline">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="tab3" variant="underline">
              Reports
            </TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 rounded-lg border border-border mt-4">
              Overview content with animated indicator
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 rounded-lg border border-border mt-4">
              Analytics content with animated indicator
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 rounded-lg border border-border mt-4">
              Reports content with animated indicator
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

// With indicator (for underline variant)
<Tabs defaultValue="tab1">
  <TabsList variant="underline" className="relative">
    <TabsTrigger value="tab1" variant="underline">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2" variant="underline">Tab 2</TabsTrigger>
    <TabsIndicator />
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// With animations
<TabsContent value="tab1" animation="slide">
  Content slides in from right
</TabsContent>

// Color variants
<TabsTrigger value="tab1" variant="pills" color="success">
  Success Tab
</TabsTrigger>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
