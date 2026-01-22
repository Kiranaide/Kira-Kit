import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconBrandTabler, IconKeyboard, IconSettings } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
} from "@/components/docs";

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

const chatMessages = [
  { sender: "Alice", message: "Hey, how's project going?", time: "10:30 AM", self: false },
  { sender: "You", message: "Going well! Just finished layout components.", time: "10:32 AM", self: true },
  { sender: "Alice", message: "That's great! Can you show me a demo?", time: "10:33 AM", self: false },
  { sender: "You", message: "Sure, I'll share my screen in a bit.", time: "10:35 AM", self: true },
  { sender: "Alice", message: "Perfect, thanks!", time: "10:36 AM", self: false },
  { sender: "You", message: "No problem. The ScrollArea component is particularly nice.", time: "10:38 AM", self: true },
  { sender: "Alice", message: "Looking forward to seeing it!", time: "10:40 AM", self: false },
];

function VerticalScrollDemo() {
  return (
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
  );
}

const verticalScrollCode = `import { ScrollArea } from "@/components/ui/scroll-area"

function VerticalScrollDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <ScrollArea className="h-72 border rounded-lg" aria-label="Scrollable list">
          <div className="p-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
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
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
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
  )
}`;

function HorizontalScrollDemo() {
  return (
    <ScrollArea orientation="horizontal" className="w-full border rounded-lg" aria-label="Tags">
      <div className="flex gap-2 p-4">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="shrink-0">
            {tag}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}

const horizontalScrollCode = `import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

function HorizontalScrollDemo() {
  const tags = ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js"]
  
  return (
    <ScrollArea orientation="horizontal" className="w-full border rounded-lg" aria-label="Tags">
      <div className="flex gap-2 p-4">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="shrink-0">
            {tag}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  )
}`;

function BothDirectionsDemo() {
  return (
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
  );
}

const bothDirectionsCode = `import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

function BothDirectionsDemo() {
  return (
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
  )
}`;

function ScrollbarSizesDemo() {
  return (
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
  );
}

const scrollbarSizesCode = `import { ScrollArea } from "@/components/ui/scroll-area"

function ScrollbarSizesDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(["thin", "default", "thick"] as const).map((size) => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">size="{size}"</p>
          <ScrollArea
            scrollbarSize={size}
            className="h-48 border rounded-lg"
            aria-label={\`\${size} scrollbar\`}
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
  )
}`;

function AccessibilityDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Focus the scroll area below and use keyboard navigation:
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
  );
}

const accessibilityCode = `import { ScrollArea } from "@/components/ui/scroll-area"

function AccessibilityDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Focus the scroll area below and use keyboard navigation:
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
  )
}`;

function ChatMessagesDemo() {
  return (
    <ScrollArea className="h-64 border rounded-lg bg-muted/20" aria-label="Chat messages">
      <div className="p-4 space-y-4">
        {chatMessages.map((msg, i) => (
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
  );
}

const chatMessagesCode = `import { ScrollArea } from "@/components/ui/scroll-area"

function ChatMessagesDemo() {
  const messages = [
    { sender: "Alice", message: "Hey, how's project going?", time: "10:30 AM", self: false },
    { sender: "You", message: "Going well! Just finished layout components.", time: "10:32 AM", self: true },
  ]
  
  return (
    <ScrollArea className="h-64 border rounded-lg bg-muted/20" aria-label="Chat messages">
      <div className="p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={\`flex \${msg.self ? "justify-end" : "justify-start"}\`}>
            <div className={\`max-w-[70%] p-3 rounded-lg \${msg.self ? "bg-primary text-primary-foreground" : "bg-muted"}\`}>
              <div className="text-sm">{msg.message}</div>
              <div className={\`text-xs mt-1 \${msg.self ? "text-primary-foreground/70" : "text-muted-foreground"}\`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}`;

function CodeBlockDemo() {
  return (
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
  );
}

const codeBlockCode = `import { ScrollArea } from "@/components/ui/scroll-area"

function CodeBlockDemo() {
  return (
    <ScrollArea orientation="horizontal" className="border rounded-lg bg-zinc-950" aria-label="Code example">
      <pre className="p-4 text-sm text-zinc-100 font-mono">
{\`import { ScrollArea } from "@/components/ui/scroll-area"

function MyComponent() {
  return (
    <ScrollArea className="h-72 border rounded-lg" aria-label="Scrollable content">
      <div className="p-4">
        {items.map(item => <Item key={item.id} {...item} />)}
      </div>
    </ScrollArea>
  )
}\`}
      </pre>
    </ScrollArea>
  )
}`;

export function ScrollAreaPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="ScrollArea"
        description="Scrollable region with styled native scrollbars and keyboard accessibility."
        version="1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description: "Full keyboard navigation with arrow keys, Page Up/Down, and Home/End support. ARIA compliant with proper labeling.",
            icon: <IconKeyboard className="h-4 w-4" />,
          },
          {
            title: "Customizable",
            description: "Support for vertical, horizontal, and bidirectional scrolling with configurable scrollbar sizes.",
            icon: <IconSettings className="h-4 w-4" />,
          },
          {
            title: "Native Feel",
            description: "Styled native scrollbars that respect browser settings and user preferences while maintaining visual consistency.",
            icon: <IconBrandTabler className="h-4 w-4" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="vertical"
        tabs={[
          {
            value: "vertical",
            label: "Vertical Scroll",
            demo: (
              <DemoWrapper
                title="Vertical Scrolling"
                description="Default vertical scroll with styled scrollbar. Includes list and user list variants."
                code={verticalScrollCode}
              >
                <VerticalScrollDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "horizontal",
            label: "Horizontal Scroll",
            demo: (
              <DemoWrapper
                title="Horizontal Scrolling"
                description="Horizontal scroll for tags, chips, or other horizontally stacked content."
                code={horizontalScrollCode}
              >
                <HorizontalScrollDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "both",
            label: "Both Directions",
            demo: (
              <DemoWrapper
                title="Bidirectional Scrolling"
                description="Scroll in both directions for large tables or wide content."
                code={bothDirectionsCode}
              >
                <BothDirectionsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sizes",
            label: "Scrollbar Sizes",
            demo: (
              <DemoWrapper
                title="Scrollbar Size Variants"
                description="Thin, default, and thick scrollbar sizes for different use cases."
                code={scrollbarSizesCode}
              >
                <ScrollbarSizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "accessibility",
            label: "Accessibility",
            demo: (
              <DemoWrapper
                title="Keyboard Navigation"
                description="Full keyboard support for accessible scrolling. Try using arrow keys, Page Up/Down, and Home/End."
                code={accessibilityCode}
              >
                <AccessibilityDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "examples",
            label: "Real-World Examples",
            demo: (
              <div className="space-y-6">
                <DemoWrapper
                  title="Chat Messages"
                  description="Auto-scrolling chat interface with message bubbles."
                  code={chatMessagesCode}
                >
                  <ChatMessagesDemo />
                </DemoWrapper>
                <DemoWrapper
                  title="Code Block"
                  description="Horizontal scroll for code snippets and wide content."
                  code={codeBlockCode}
                >
                  <CodeBlockDemo />
                </DemoWrapper>
              </div>
            ),
          },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Basic implementation examples for different scroll orientations and configurations."
        code={`import { ScrollArea } from "@/components/ui/scroll-area"

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
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "↑ ↓", description: "Scroll vertically" },
          { keys: "← →", description: "Scroll horizontally" },
          { keys: "Page Up / Page Down", description: "Scroll by page" },
          { keys: "Home", description: "Scroll to top" },
          { keys: "End", description: "Scroll to bottom" },
          { keys: "Ctrl + Home", description: "Scroll to top-left" },
          { keys: "Ctrl + End", description: "Scroll to bottom-right" },
          { keys: "Space", description: "Page down" },
          { keys: "Shift + Space", description: "Page up" },
        ]}
      />

      <APIReference
        sections={[
          {
            title: "ScrollArea",
            props: [
              { prop: "orientation", type: `'vertical' | 'horizontal' | 'both'`, default: `'vertical'`, description: "Scroll direction for the scrollable area." },
              { prop: "scrollbarSize", type: `'thin' | 'default' | 'thick'`, default: `'default'`, description: "Size of the scrollbars." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the scroll area container." },
              { prop: "aria-label", type: "string", default: "-", description: "Accessibility label for the scrollable region." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props with child element." },
              { prop: "children", type: "ReactNode", default: "-", description: "Content to be scrolled." },
            ],
          },
          {
            title: "ScrollAreaRoot",
            props: [
              { prop: "orientation", type: `'vertical' | 'horizontal' | 'both'`, default: `'vertical'`, description: "Scroll direction for the scrollable area." },
              { prop: "scrollbarSize", type: `'thin' | 'default' | 'thick'`, default: `'default'`, description: "Size of the scrollbars." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the root element." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props with child element." },
            ],
          },
          {
            title: "ScrollAreaViewport",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the viewport element." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props with child element." },
            ],
          },
          {
            title: "ScrollAreaScrollbar",
            props: [
              { prop: "orientation", type: `'vertical' | 'horizontal'`, default: "-", description: "Orientation of the scrollbar." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the scrollbar." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props with child element." },
            ],
          },
          {
            title: "ScrollAreaThumb",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the scrollbar thumb." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props with child element." },
            ],
          },
          {
            title: "ScrollAreaCorner",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the corner element." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props with child element." },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
