import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
