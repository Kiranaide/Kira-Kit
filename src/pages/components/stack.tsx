import { HStack, VStack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconCheck, IconX, IconAlertCircle, IconStar } from "@tabler/icons-react";

export function StackPage() {
  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Stack</h1>
        <p className="text-muted-foreground">
          Simplified flex layout for vertical and horizontal stacking with optional dividers.
        </p>
      </header>

      {/* VStack */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          VStack (Vertical)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default gap</p>
            <VStack className="p-4 border rounded-lg bg-muted/30">
              <div className="p-3 bg-primary/20 rounded w-full text-center">Item 1</div>
              <div className="p-3 bg-primary/20 rounded w-full text-center">Item 2</div>
              <div className="p-3 bg-primary/20 rounded w-full text-center">Item 3</div>
            </VStack>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">gap={8}</p>
            <VStack gap={8} className="p-4 border rounded-lg bg-muted/30">
              <div className="p-3 bg-primary/20 rounded w-full text-center">Item 1</div>
              <div className="p-3 bg-primary/20 rounded w-full text-center">Item 2</div>
              <div className="p-3 bg-primary/20 rounded w-full text-center">Item 3</div>
            </VStack>
          </div>
        </div>
      </section>

      {/* HStack */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          HStack (Horizontal)
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default</p>
            <HStack className="p-4 border rounded-lg bg-muted/30">
              <div className="p-3 bg-primary/20 rounded">Item 1</div>
              <div className="p-3 bg-primary/20 rounded">Item 2</div>
              <div className="p-3 bg-primary/20 rounded">Item 3</div>
            </HStack>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">With justify="between"</p>
            <HStack justify="between" className="p-4 border rounded-lg bg-muted/30">
              <div className="p-3 bg-primary/20 rounded">Left</div>
              <div className="p-3 bg-primary/20 rounded">Center</div>
              <div className="p-3 bg-primary/20 rounded">Right</div>
            </HStack>
          </div>
        </div>
      </section>

      {/* Alignment */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Alignment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["start", "center", "end"] as const).map((align) => (
            <div key={align}>
              <p className="text-sm text-muted-foreground mb-2">align="{align}"</p>
              <HStack align={align} gap={4} className="p-4 border rounded-lg bg-muted/30 h-24">
                <div className="p-2 bg-primary/20 rounded">A</div>
                <div className="p-4 bg-primary/20 rounded">B</div>
                <div className="p-6 bg-primary/20 rounded">C</div>
              </HStack>
            </div>
          ))}
        </div>
      </section>

      {/* Dividers */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Dividers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">VStack with dividers</p>
            <VStack dividers className="p-4 border rounded-lg bg-background">
              <div className="py-2">Section 1</div>
              <div className="py-2">Section 2</div>
              <div className="py-2">Section 3</div>
            </VStack>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">HStack with dividers</p>
            <HStack dividers align="center" className="p-4 border rounded-lg bg-background h-16">
              <span className="px-2">Home</span>
              <span className="px-2">Products</span>
              <span className="px-2">About</span>
              <span className="px-2">Contact</span>
            </HStack>
          </div>
        </div>
      </section>

      {/* Responsive Gap */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Responsive Gap
        </h2>
        <p className="text-sm text-muted-foreground">
          Resize the window to see gap change: base=2, md=4, lg=8
        </p>
        <HStack gap={{ base: 2, md: 4, lg: 8 }} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
          <div className="p-4 bg-primary/20 rounded">4</div>
        </HStack>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Real-World Examples
        </h2>

        {/* Button Group */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Action Buttons</p>
          <HStack gap={2}>
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </HStack>
        </div>

        {/* Status List */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Status List</p>
          <VStack gap={2} align="start" className="p-4 border rounded-lg bg-background">
            <HStack gap={2} align="center">
              <IconCheck className="size-4 text-green-500" />
              <span>Build completed successfully</span>
            </HStack>
            <HStack gap={2} align="center">
              <IconCheck className="size-4 text-green-500" />
              <span>Tests passed (42/42)</span>
            </HStack>
            <HStack gap={2} align="center">
              <IconAlertCircle className="size-4 text-yellow-500" />
              <span>2 warnings found</span>
            </HStack>
            <HStack gap={2} align="center">
              <IconX className="size-4 text-red-500" />
              <span>Deployment failed</span>
            </HStack>
          </VStack>
        </div>

        {/* User List */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Team Members</p>
          <VStack dividers className="border rounded-lg bg-background">
            {[
              { name: "Alice Johnson", role: "Lead Developer", avatar: "AJ" },
              { name: "Bob Smith", role: "Designer", avatar: "BS" },
              { name: "Carol White", role: "Product Manager", avatar: "CW" },
            ].map((user) => (
              <HStack key={user.name} justify="between" align="center" className="p-4">
                <HStack gap={3} align="center">
                  <Avatar size="sm">
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <VStack gap={0}>
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.role}</span>
                  </VStack>
                </HStack>
                <Button variant="ghost" size="sm">View</Button>
              </HStack>
            ))}
          </VStack>
        </div>

        {/* Feature Cards */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Feature Cards</p>
          <HStack gap={4} className="overflow-x-auto pb-2">
            {[
              { icon: IconStar, title: "Premium", desc: "Access all features" },
              { icon: IconCheck, title: "Verified", desc: "Trusted by millions" },
              { icon: IconAlertCircle, title: "Support", desc: "24/7 assistance" },
            ].map((feature) => (
              <Card key={feature.title} className="min-w-48 shrink-0">
                <CardHeader className="pb-2">
                  <feature.icon className="size-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </HStack>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Stack, HStack, VStack } from "@/components/ui/stack"

// Vertical stack
<VStack gap={4}>
  <Input placeholder="Email" />
  <Input placeholder="Password" />
  <Button>Sign In</Button>
</VStack>

// Horizontal stack
<HStack gap={2} align="center">
  <Avatar />
  <span>Username</span>
</HStack>

// With dividers
<VStack dividers>
  <MenuItem>Profile</MenuItem>
  <MenuItem>Settings</MenuItem>
  <MenuItem>Logout</MenuItem>
</VStack>

// Responsive gap
<HStack gap={{ base: 2, md: 4, lg: 8 }}>
  <Card />
  <Card />
</HStack>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
