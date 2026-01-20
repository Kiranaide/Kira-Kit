import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScrollAreaPage() {
  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));

  const tags = [
    "React", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js",
    "Python", "Go", "Rust", "Vue", "Angular", "Svelte", "Next.js",
    "Tailwind", "GraphQL", "REST", "Docker", "Kubernetes", "AWS",
  ];

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">ScrollArea</h1>
        <p className="text-muted-foreground">
          Scrollable region with styled native scrollbars and keyboard accessibility.
        </p>
      </header>

      {/* Basic Vertical Scroll */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical Scroll
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default</p>
            <ScrollArea className="h-72 border rounded-lg" aria-label="Scrollable list">
              <div className="p-4 space-y-2">
                {items.slice(0, 20).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">User List</p>
            <ScrollArea className="h-72 border rounded-lg" aria-label="User list">
              <div className="p-4 space-y-2">
                {items.slice(0, 20).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{item.id}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">User {item.id}</div>
                      <div className="text-xs text-muted-foreground">user{item.id}@example.com</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal Scroll
        </h2>
        <ScrollArea orientation="horizontal" className="w-full border rounded-lg" aria-label="Tags">
          <div className="flex gap-2 p-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="shrink-0">
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* Both Directions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Both Directions
        </h2>
        <ScrollArea orientation="both" className="h-72 border rounded-lg" aria-label="Large content">
          <div className="p-4" style={{ width: "150%", minWidth: "800px" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["ID", "Name", "Email", "Role", "Status", "Department", "Location", "Joined"].map((header) => (
                    <th key={header} className="text-left p-3 bg-muted font-medium border-b whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 15).map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="p-3 border-b">{item.id}</td>
                    <td className="p-3 border-b whitespace-nowrap">User {item.id}</td>
                    <td className="p-3 border-b whitespace-nowrap">user{item.id}@example.com</td>
                    <td className="p-3 border-b">Developer</td>
                    <td className="p-3 border-b">
                      <Badge variant={item.id % 2 === 0 ? "default" : "secondary"}>
                        {item.id % 2 === 0 ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-3 border-b whitespace-nowrap">Engineering</td>
                    <td className="p-3 border-b whitespace-nowrap">San Francisco</td>
                    <td className="p-3 border-b whitespace-nowrap">2024-01-{String(item.id).padStart(2, "0")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </section>

      {/* Scrollbar Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Scrollbar Sizes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["thin", "default", "thick"] as const).map((size) => (
            <div key={size}>
              <p className="text-sm text-muted-foreground mb-2">size="{size}"</p>
              <ScrollArea
                scrollbarSize={size}
                className="h-48 border rounded-lg"
                aria-label={`${size} scrollbar`}
              >
                <div className="p-4 space-y-2">
                  {items.slice(0, 12).map((item) => (
                    <div key={item.id} className="p-2 bg-muted/50 rounded text-sm">
                      {item.name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Accessibility Features
        </h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keyboard Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> - Focus scroll area</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd> <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd> - Scroll vertically</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> - Scroll horizontally</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Page Up</kbd> <kbd className="px-2 py-1 bg-muted rounded text-xs">Page Down</kbd> - Scroll by page</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">Home</kbd> - Scroll to top</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">End</kbd> - Scroll to bottom</li>
              </ul>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Try focusing scroll area below and using keyboard navigation:
          </p>
          <ScrollArea className="h-48 border rounded-lg" aria-label="Keyboard navigation demo">
            <div className="p-4 space-y-2">
              {items.slice(0, 15).map((item) => (
                <div key={item.id} className="p-3 bg-muted/50 rounded">
                  Focus this area and use arrow keys to scroll - Item {item.id}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Real-World Examples
        </h2>

        {/* Chat Messages */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Chat Messages</p>
          <ScrollArea className="h-64 border rounded-lg bg-muted/20" aria-label="Chat messages">
            <div className="p-4 space-y-4">
              {[
                { sender: "Alice", message: "Hey, how's project going?", time: "10:30 AM", self: false },
                { sender: "You", message: "Going well! Just finished layout components.", time: "10:32 AM", self: true },
                { sender: "Alice", message: "That's great! Can you show me a demo?", time: "10:33 AM", self: false },
                { sender: "You", message: "Sure, I'll share my screen in a bit.", time: "10:35 AM", self: true },
                { sender: "Alice", message: "Perfect, thanks!", time: "10:36 AM", self: false },
                { sender: "You", message: "No problem. The ScrollArea component is particularly nice.", time: "10:38 AM", self: true },
                { sender: "Alice", message: "Looking forward to seeing it!", time: "10:40 AM", self: false },
              ].map((msg, i) => (
                <div key={i} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.self ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <div className="text-sm">{msg.message}</div>
                    <div className={`text-xs mt-1 ${msg.self ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Code Block */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Code Block</p>
          <ScrollArea orientation="horizontal" className="border rounded-lg bg-zinc-950" aria-label="Code example">
            <pre className="p-4 text-sm text-zinc-100 font-mono">
{`import { ScrollArea } from "@/components/ui/scroll-area"

function MyComponent() {
  return (
    <ScrollArea className="h-72 border rounded-lg" aria-label="Scrollable content">
      <div className="p-4">
        {items.map(item => <Item key={item.id} {...item} />)}
      </div>
    </ScrollArea>
  )
}`}
            </pre>
          </ScrollArea>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { ScrollArea } from "@/components/ui/scroll-area"

// Vertical scroll
<ScrollArea className="h-72" aria-label="List">
  <div className="p-4">
    {items.map(item => <Item key={item.id} />)}
  </div>
</ScrollArea>

// Horizontal scroll
<ScrollArea orientation="horizontal">
  <div className="flex gap-4 p-4">
    {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
  </div>
</ScrollArea>

// Both directions
<ScrollArea orientation="both" className="h-72">
  <LargeContent />
</ScrollArea>

// Custom scrollbar size
<ScrollArea scrollbarSize="thick" className="h-72">
  <Content />
</ScrollArea>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
