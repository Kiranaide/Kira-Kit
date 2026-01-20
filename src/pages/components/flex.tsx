import { Flex } from "@/components/ui/flex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBrandGithub, IconBell, IconSettings, IconUser, IconHome, IconMail, IconPhone } from "@tabler/icons-react";

export function FlexPage() {
  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Flex</h1>
        <p className="text-muted-foreground">
          Flexible box layout primitive for building responsive layouts with ease.
        </p>
      </header>

      {/* Basic Direction */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Direction
        </h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Row (default)</p>
            <Flex gap={4} className="p-4 border rounded-lg bg-muted/30">
              <div className="p-4 bg-primary/20 rounded">1</div>
              <div className="p-4 bg-primary/20 rounded">2</div>
              <div className="p-4 bg-primary/20 rounded">3</div>
            </Flex>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Column</p>
            <Flex direction="column" gap={4} className="p-4 border rounded-lg bg-muted/30">
              <div className="p-4 bg-primary/20 rounded">1</div>
              <div className="p-4 bg-primary/20 rounded">2</div>
              <div className="p-4 bg-primary/20 rounded">3</div>
            </Flex>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Row Reverse</p>
            <Flex direction="row-reverse" gap={4} className="p-4 border rounded-lg bg-muted/30">
              <div className="p-4 bg-primary/20 rounded">1</div>
              <div className="p-4 bg-primary/20 rounded">2</div>
              <div className="p-4 bg-primary/20 rounded">3</div>
            </Flex>
          </div>
        </div>
      </section>

      {/* Justify Content */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Justify Content
        </h2>
        <div className="space-y-4">
          {(["start", "center", "end", "between", "around", "evenly"] as const).map((justify) => (
            <div key={justify}>
              <p className="text-sm text-muted-foreground mb-2">{justify}</p>
              <Flex justify={justify} gap={4} className="p-4 border rounded-lg bg-muted/30">
                <div className="p-3 bg-primary/20 rounded">A</div>
                <div className="p-3 bg-primary/20 rounded">B</div>
                <div className="p-3 bg-primary/20 rounded">C</div>
              </Flex>
            </div>
          ))}
        </div>
      </section>

      {/* Align Items */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Align Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["start", "center", "end", "stretch", "baseline"] as const).map((align) => (
            <div key={align}>
              <p className="text-sm text-muted-foreground mb-2">{align}</p>
              <Flex align={align} gap={4} className="p-4 border rounded-lg bg-muted/30 h-32">
                <div className="p-2 bg-primary/20 rounded text-sm">Short</div>
                <div className="p-4 bg-primary/20 rounded">Medium</div>
                <div className="p-6 bg-primary/20 rounded text-lg">Tall</div>
              </Flex>
            </div>
          ))}
        </div>
      </section>

      {/* Gap */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Gap Spacing
        </h2>
        <div className="space-y-4">
          {([0, 2, 4, 6, 8, 12] as const).map((gap) => (
            <div key={gap}>
              <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
              <Flex gap={gap} className="p-4 border rounded-lg bg-muted/30">
                <div className="p-3 bg-primary/20 rounded">1</div>
                <div className="p-3 bg-primary/20 rounded">2</div>
                <div className="p-3 bg-primary/20 rounded">3</div>
                <div className="p-3 bg-primary/20 rounded">4</div>
              </Flex>
            </div>
          ))}
        </div>
      </section>

      {/* Wrap */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Flex Wrap
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">wrap</p>
            <Flex wrap="wrap" gap={4} className="p-4 border rounded-lg bg-muted/30 max-w-md">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 bg-primary/20 rounded w-24 text-center">{i + 1}</div>
              ))}
            </Flex>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">nowrap (default)</p>
            <Flex wrap="nowrap" gap={4} className="p-4 border rounded-lg bg-muted/30 max-w-md overflow-x-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 bg-primary/20 rounded w-24 text-center shrink-0">{i + 1}</div>
              ))}
            </Flex>
          </div>
        </div>
      </section>

      {/* Responsive */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Responsive Values
        </h2>
        <p className="text-sm text-muted-foreground">
          Resize the window to see the layout change from column on mobile to row on desktop.
        </p>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, lg: 8 }}
          align={{ base: "stretch", md: "center" }}
          className="p-4 border rounded-lg bg-muted/30"
        >
          <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 1</div>
          <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 2</div>
          <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 3</div>
        </Flex>
      </section>

      {/* Semantic HTML */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Semantic HTML (as prop)
        </h2>
        <Flex as="nav" justify="between" align="center" className="p-4 border rounded-lg bg-muted/30">
          <Flex as="ul" gap={4} className="list-none">
            <li><a href="#" className="hover:text-primary">Home</a></li>
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
          </Flex>
          <Button size="sm">Sign In</Button>
        </Flex>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Real-World Examples
        </h2>

        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Navigation Header</p>
          <Flex as="header" justify="between" align="center" className="p-4 border rounded-lg bg-background">
            <Flex align="center" gap={2}>
              <div className="size-8 bg-primary rounded-md" />
              <span className="font-semibold">Brand</span>
            </Flex>
            <Flex gap={2}>
              <Button variant="ghost" size="icon-sm"><IconBell className="size-4" /></Button>
              <Button variant="ghost" size="icon-sm"><IconSettings className="size-4" /></Button>
              <Avatar size="sm">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Flex>
          </Flex>
        </div>

        {/* User Card */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">User Profile Card</p>
          <Flex gap={4} align="center" className="p-4 border rounded-lg bg-background">
            <Avatar size="lg">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Flex direction="column" gap={1} className="flex-1">
              <span className="font-semibold">John Doe</span>
              <span className="text-sm text-muted-foreground">Software Engineer</span>
              <Flex gap={2} className="mt-1">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
              </Flex>
            </Flex>
            <Button variant="outline" size="sm">
              <IconBrandGithub className="size-4 mr-2" />
              Follow
            </Button>
          </Flex>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
          <Flex direction="column" gap={3} className="p-4 border rounded-lg bg-background">
            <Flex align="center" gap={3}>
              <IconUser className="size-4 text-muted-foreground" />
              <span>John Doe</span>
            </Flex>
            <Flex align="center" gap={3}>
              <IconMail className="size-4 text-muted-foreground" />
              <span>john@example.com</span>
            </Flex>
            <Flex align="center" gap={3}>
              <IconPhone className="size-4 text-muted-foreground" />
              <span>+1 (555) 123-4567</span>
            </Flex>
            <Flex align="center" gap={3}>
              <IconHome className="size-4 text-muted-foreground" />
              <span>123 Main St, City, Country</span>
            </Flex>
          </Flex>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Flex } from "@/components/ui/flex"

// Basic row layout
<Flex gap={4} align="center">
  <Avatar />
  <span>Username</span>
</Flex>

// Column layout
<Flex direction="column" gap={2}>
  <Input />
  <Button>Submit</Button>
</Flex>

// Responsive layout
<Flex 
  direction={{ base: "column", md: "row" }} 
  gap={{ base: 4, lg: 8 }}
>
  <Card />
  <Card />
</Flex>

// Semantic HTML
<Flex as="nav" justify="between" align="center">
  <Logo />
  <NavLinks />
</Flex>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
