import * as React from "react";
import {
  IconFolder,
  IconFile,
  IconSettings,
  IconInfoCircle,
  IconCheck,
  IconAlertTriangle,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  KiraAccordion,
  type AccordionItemData,
} from "@/components/ui/accordion";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  return (
    <Accordion defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Kira Kit?</AccordionTrigger>
        <AccordionContent>
          Kira Kit is a modern React component library built with Base UI,
          Tailwind CSS, and TypeScript. It provides a set of accessible and
          customizable UI components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>
          Simply copy the components you need into your project. Each component
          is self-contained and can be customized to fit your design system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes! All components are built with accessibility in mind, using Base
          UI primitives that follow WAI-ARIA guidelines.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const basicCode = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export function BasicAccordionDemo() {
  return (
    <Accordion defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Kira Kit?</AccordionTrigger>
        <AccordionContent>
          Kira Kit is a modern React component library built with Base UI,
          Tailwind CSS, and TypeScript.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>
          Simply copy the components you need into your project.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`;

function CollapsibleDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Multiple Selection</p>
        <Accordion multiple defaultValue={["item-1", "item-2"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>First Item (open by default)</AccordionTrigger>
            <AccordionContent>
              Multiple items can be open simultaneously.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second Item (open by default)</AccordionTrigger>
            <AccordionContent>
              Click any header to toggle without closing others.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Third Item</AccordionTrigger>
            <AccordionContent>
              This one starts closed but can be opened.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Without Arrow</p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger showArrow={false}>
              Click to expand (no arrow)
            </AccordionTrigger>
            <AccordionContent>
              This accordion item has no chevron arrow indicator.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger showArrow={false}>
              Another item without arrow
            </AccordionTrigger>
            <AccordionContent>
              Clean look without the default arrow icon.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

const collapsibleCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export function CollapsibleAccordionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Multiple Selection</p>
        <Accordion multiple defaultValue={["item-1", "item-2"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>First Item</AccordionTrigger>
            <AccordionContent>Multiple items can be open.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second Item</AccordionTrigger>
            <AccordionContent>Click to toggle without closing others.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Without Arrow</p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger showArrow={false}>No Arrow</AccordionTrigger>
            <AccordionContent>Clean look without the arrow indicator.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}`;

function IconsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">With Icon</p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger icon={<IconFolder className="w-4 h-4" />}>
              Project Files
            </AccordionTrigger>
            <AccordionContent>
              Contains all your project source files and assets.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger icon={<IconFile className="w-4 h-4" />}>
              Documentation
            </AccordionTrigger>
            <AccordionContent>
              README, CHANGELOG, and other documentation files.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger icon={<IconSettings className="w-4 h-4" />}>
              Configuration
            </AccordionTrigger>
            <AccordionContent>
              Project configuration files like tsconfig, vite.config, etc.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Header Background Colors
        </p>
        <Accordion multiple>
          <AccordionItem value="info">
            <AccordionTrigger
              variant="info"
              icon={<IconInfoCircle className="w-4 h-4" />}
            >
              Information
            </AccordionTrigger>
            <AccordionContent>
              This is an informational message with a blue pastel background.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="success">
            <AccordionTrigger
              variant="success"
              icon={<IconCheck className="w-4 h-4" />}
            >
              Success
            </AccordionTrigger>
            <AccordionContent>
              This indicates a successful action with a green pastel background.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warning">
            <AccordionTrigger
              variant="warning"
              icon={<IconAlertTriangle className="w-4 h-4" />}
            >
              Warning
            </AccordionTrigger>
            <AccordionContent>
              This warns about potential issues with a yellow pastel background.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Custom Chevron</p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger
              chevronIcon={<IconChevronRight className="w-4 h-4" />}
              chevronPosition="end"
            >
              Custom Chevron (Right Arrow)
            </AccordionTrigger>
            <AccordionContent>
              This accordion uses a custom right arrow icon.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger
              chevronIcon={<IconPlus className="w-4 h-4" />}
              showArrow={false}
            >
              Plus/Minus Toggle
            </AccordionTrigger>
            <AccordionContent>
              This accordion uses a plus/minus style toggle indicator.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

const iconsCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { IconFolder, IconFile, IconSettings, IconChevronRight } from "@tabler/icons-react"

export function IconsAccordionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">With Icon</p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger icon={<IconFolder className="w-4 h-4" />}>
              Project Files
            </AccordionTrigger>
            <AccordionContent>Contains all your project source files.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Header Colors</p>
        <Accordion multiple>
          <AccordionItem value="info">
            <AccordionTrigger variant="info">Info</AccordionTrigger>
            <AccordionContent>Informational content.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="success">
            <AccordionTrigger variant="success">Success</AccordionTrigger>
            <AccordionContent>Successful action.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}`;

function VerticalDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Nested Accordions</p>
        <Accordion multiple>
          <AccordionItem value="item-1">
            <AccordionTrigger>Parent Item 1</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">This is parent content.</p>
              <Accordion>
                <AccordionItem value="child-1">
                  <AccordionTrigger>Nested Child 1</AccordionTrigger>
                  <AccordionContent inset>
                    This nested accordion has inset padding for visual
                    hierarchy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="child-2">
                  <AccordionTrigger>Nested Child 2</AccordionTrigger>
                  <AccordionContent inset>
                    Another nested accordion item with inset.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Parent Item 2</AccordionTrigger>
            <AccordionContent>
              Another parent item without nested content.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Size Variants</p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">xs</p>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="xs">Extra Small</AccordionTrigger>
                <AccordionContent size="xs">
                  This is extra small content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">sm</p>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="sm">Small</AccordionTrigger>
                <AccordionContent size="sm">
                  This is small content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">lg</p>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="lg">Large</AccordionTrigger>
                <AccordionContent size="lg">
                  This is large content with more padding.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

const verticalCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export function VerticalAccordionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Nested Accordions</p>
        <Accordion multiple>
          <AccordionItem value="item-1">
            <AccordionTrigger>Parent Item 1</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">This is parent content.</p>
              <Accordion>
                <AccordionItem value="child-1">
                  <AccordionTrigger>Nested Child 1</AccordionTrigger>
                  <AccordionContent inset>
                    Nested content with inset padding.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}`;

function KiraAccordionDemo() {
  return (
    <KiraAccordion
      defaultValue={["item-1"]}
      items={[
        {
          value: "item-1",
          title: "What is Kira Kit?",
          content:
            "Kira Kit is a modern React component library built with Base UI, Tailwind CSS, and TypeScript. It provides a set of accessible and customizable UI components.",
        },
        {
          value: "item-2",
          title: "How do I install it?",
          content:
            "Simply copy the components you need into your project. Each component is self-contained and can be customized to fit your design system.",
        },
        {
          value: "item-3",
          title: "Is it accessible?",
          content:
            "Yes! All components are built with accessibility in mind, using Base UI primitives that follow WAI-ARIA guidelines.",
        },
      ]}
    />
  );
}

const kiraAccordionCode = `import { KiraAccordion } from "@/components/ui/accordion"

export function KiraAccordionDemo() {
  return (
    <KiraAccordion
      defaultValue={["item-1"]}
      items={[
        {
          value: "item-1",
          title: "What is Kira Kit?",
          content: "Kira Kit is a modern React component library...",
        },
        {
          value: "item-2",
          title: "How do I install it?",
          content: "Simply copy the components you need...",
        },
        {
          value: "item-3",
          title: "Is it accessible?",
          content: "Yes! All components are built with accessibility...",
        },
      ]}
    />
  )
}`;

function KiraAccordionIconsDemo() {
  return (
    <KiraAccordion
      multiple
      items={[
        {
          value: "files",
          title: "Project Files",
          icon: <IconFolder className="w-4 h-4" />,
          content: "Contains all your project source files and assets.",
        },
        {
          value: "docs",
          title: "Documentation",
          icon: <IconFile className="w-4 h-4" />,
          content: "README, CHANGELOG, and other documentation files.",
        },
        {
          value: "config",
          title: "Configuration",
          icon: <IconSettings className="w-4 h-4" />,
          content:
            "Project configuration files like tsconfig, vite.config, etc.",
        },
      ]}
    />
  );
}

const kiraAccordionIconsCode = `import { KiraAccordion } from "@/components/ui/accordion"
import { IconFolder, IconFile, IconSettings } from "@tabler/icons-react"

export function KiraAccordionIconsDemo() {
  return (
    <KiraAccordion
      multiple
      items={[
        {
          value: "files",
          title: "Project Files",
          icon: <IconFolder className="w-4 h-4" />,
          content: "Contains all your project source files...",
        },
        {
          value: "docs",
          title: "Documentation",
          icon: <IconFile className="w-4 h-4" />,
          content: "README, CHANGELOG, and other docs...",
        },
        {
          value: "config",
          title: "Configuration",
          icon: <IconSettings className="w-4 h-4" />,
          content: "Project configuration files...",
        },
      ]}
    />
  )
}`;

function KiraAccordionNestedDemo() {
  return (
    <KiraAccordion
      multiple
      nested
      items={[
        {
          value: "frontend",
          title: "Frontend Development",
          content: "Modern frontend development stack and tools.",
          children: [
            {
              value: "react",
              title: "React",
              content: "A JavaScript library for building user interfaces.",
            },
            {
              value: "vue",
              title: "Vue.js",
              content: "The Progressive JavaScript Framework.",
            },
            {
              value: "angular",
              title: "Angular",
              content: "The modern web developer's platform.",
            },
          ],
        },
        {
          value: "backend",
          title: "Backend Development",
          content: "Server-side technologies and frameworks.",
          children: [
            {
              value: "node",
              title: "Node.js",
              content: "JavaScript runtime built on Chrome's V8 engine.",
            },
            {
              value: "python",
              title: "Python",
              content: "A programming language that lets you work quickly.",
            },
          ],
        },
      ]}
    />
  );
}

const kiraAccordionNestedCode = `import { KiraAccordion } from "@/components/ui/accordion"

export function KiraAccordionNestedDemo() {
  return (
    <KiraAccordion
      multiple
      items={[
        {
          value: "frontend",
          title: "Frontend Development",
          content: "Modern frontend development stack...",
          children: [
            {
              value: "react",
              title: "React",
              content: "A JavaScript library...",
            },
            {
              value: "vue",
              title: "Vue.js",
              content: "The Progressive Framework...",
            },
          ],
        },
        {
          value: "backend",
          title: "Backend Development",
          content: "Server-side technologies...",
          children: [
            {
              value: "node",
              title: "Node.js",
              content: "JavaScript runtime...",
            },
          ],
        },
      ]}
    />
  )
}`;

function KiraAccordionVariantsDemo() {
  return (
    <div className="space-y-4">
      <KiraAccordion
        items={[
          {
            value: "info",
            title: "Information",
            icon: <IconInfoCircle className="w-4 h-4" />,
            variant: "info",
            content:
              "This is an informational message with a blue pastel background.",
          },
        ]}
      />
      <KiraAccordion
        items={[
          {
            value: "success",
            title: "Success",
            icon: <IconCheck className="w-4 h-4" />,
            variant: "success",
            content:
              "This indicates a successful action with a green pastel background.",
          },
        ]}
      />
      <KiraAccordion
        items={[
          {
            value: "warning",
            title: "Warning",
            icon: <IconAlertTriangle className="w-4 h-4" />,
            variant: "warning",
            content:
              "This warns about potential issues with a yellow pastel background.",
          },
        ]}
      />
    </div>
  );
}

const kiraAccordionVariantsCode = `import { KiraAccordion } from "@/components/ui/accordion"
import { IconInfoCircle, IconCheck, IconAlertTriangle } from "@tabler/icons-react"

export function KiraAccordionVariantsDemo() {
  return (
    <div className="space-y-4">
      <KiraAccordion
        items={[
          {
            value: "info",
            title: "Information",
            icon: <IconInfoCircle className="w-4 h-4" />,
            variant: "info",
            content: "Informational message...",
          },
        ]}
      />
      <KiraAccordion
        items={[
          {
            value: "success",
            title: "Success",
            icon: <IconCheck className="w-4 h-4" />,
            variant: "success",
            content: "Successful action...",
          },
        ]}
      />
    </div>
  )
}`;

function DraggableDemo() {
  const [items, setItems] = React.useState([
    {
      value: "item-1",
      title: "First Item",
      content: "This is the first item. Drag the handle to reorder.",
    },
    {
      value: "item-2",
      title: "Second Item",
      content: "This is the second item. Drag the handle to reorder.",
    },
    {
      value: "item-3",
      title: "Third Item",
      content: "This is the third item. Drag the handle to reorder.",
    },
    {
      value: "item-4",
      title: "Fourth Item",
      content: "This is the fourth item. Drag the handle to reorder.",
    },
  ]);

  return (
    <KiraAccordion
      draggable
      items={items}
      onReorder={(newItems) => setItems(newItems as typeof items)}
      showExpandAll
    />
  );
}

const draggableCode = `import { KiraAccordion } from "@/components/ui/accordion"
import { useState } from "react"

export function DraggableDemo() {
  const [items, setItems] = useState([
    { value: "item-1", title: "First Item", content: "Content..." },
    { value: "item-2", title: "Second Item", content: "Content..." },
  ])

  return (
    <KiraAccordion
      draggable
      items={items}
      onReorder={setItems}
      showExpandAll
    />
  )
}`;

function AsyncLoadingDemo() {
  const [items, setItems] = React.useState<AccordionItemData[]>([
    {
      value: "item-1",
      title: "Async Item 1",
      content: "This content was loaded asynchronously!",
      loading: false,
    },
    {
      value: "item-2",
      title: "Async Item 2",
      content: "",
      loading: true,
    },
    {
      value: "item-3",
      title: "Error Item",
      content: "",
      error: new Error("Failed to load content"),
      onRetry: () => alert("Retry clicked!"),
    },
  ]);

  return (
    <KiraAccordion
      asyncLoading
      items={items}
      onItemOpen={async (item) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setItems((prev) =>
          prev.map((i) =>
            i.value === item.value
              ? { ...i, loading: false, content: "Loaded content!" }
              : i
          )
        );
      }}
    />
  );
}

const asyncLoadingCode = `import { KiraAccordion } from "@/components/ui/accordion"

export function AsyncLoadingDemo() {
  const [items, setItems] = useState([
    { value: "item-1", title: "Async Item", content: "", loading: true },
  ])

  return (
    <KiraAccordion
      asyncLoading
      items={items}
      onItemOpen={async (item) => {
        // Load data asynchronously
        const data = await fetchData(item.value)
        setItems(prev => prev.map(i => 
          i.value === item.value 
            ? { ...i, loading: false, content: data } 
            : i
        ))
      }}
    />
  )
}`;

function ExpandCollapseDemo() {
  return (
    <KiraAccordion
      multiple
      showExpandAll
      items={[
        { value: "item-1", title: "Item 1", content: "Content for item 1" },
        { value: "item-2", title: "Item 2", content: "Content for item 2" },
        { value: "item-3", title: "Item 3", content: "Content for item 3" },
      ]}
    />
  );
}

const expandCollapseCode = `import { KiraAccordion } from "@/components/ui/accordion"

export function ExpandCollapseDemo() {
  return (
    <KiraAccordion
      multiple
      showExpandAll
      items={[...]}
    />
  )
}`;

export function VerticalAccordionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Nested Accordions</p>
        <Accordion multiple>
          <AccordionItem value="item-1">
            <AccordionTrigger>Parent Item 1</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">This is parent content.</p>
              <Accordion>
                <AccordionItem value="child-1">
                  <AccordionTrigger>Nested Child 1</AccordionTrigger>
                  <AccordionContent inset>
                    Nested content with inset padding.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

const usageCode = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

// Basic
<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>

// With Icon
<AccordionTrigger icon={<Icon />}>Title</AccordionTrigger>

// Without Arrow
<AccordionTrigger showArrow={false}>Title</AccordionTrigger>

// Colored Header
<AccordionTrigger variant="info">Info</AccordionTrigger>
<AccordionTrigger variant="success">Success</AccordionTrigger>
<AccordionTrigger variant="warning">Warning</AccordionTrigger>
<AccordionTrigger variant="destructive">Error</AccordionTrigger>
<AccordionTrigger variant="ghost">Ghost</AccordionTrigger>
<AccordionTrigger variant="outline">Outline</AccordionTrigger>

// Sizes
<AccordionTrigger size="xs">Extra Small</AccordionTrigger>
<AccordionTrigger size="sm">Small</AccordionTrigger>
<AccordionTrigger size="default">Default</AccordionTrigger>
<AccordionTrigger size="lg">Large</AccordionTrigger>

// Multiple open
<Accordion multiple>...</Accordion>

// Disabled Item
<AccordionItem value="item-1" disabled>...</AccordionItem>

// With Callbacks
<AccordionItem value="item-1" onOpen={() => {}} onClose={() => {}}>
  <AccordionTrigger>Title</AccordionTrigger>
  <AccordionContent>Content</AccordionContent>
</AccordionItem>

// Lazy Mount with Skeleton
<AccordionContent lazyMount showSkeleton skeletonLines={4}>
  Content loaded on open
</AccordionContent>

// Nested Accordions with Inset
<AccordionContent inset>...</AccordionContent>

// Custom Chevron
<AccordionTrigger chevronIcon={<CustomIcon />} chevronPosition="start">
  Title
</AccordionTrigger>

// Scroll Into View
<Accordion scrollIntoView>...</Accordion>`;

export default function AccordionPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Accordion"
        description="Collapsible content panels for organizing information. Supports icons, colors, sizes, nested accordions, and lazy loading."
        version="v2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description:
              "WAI-ARIA compliant with proper roles, keyboard navigation (Tab, Enter, Space, Arrow keys), and screen reader announcements.",
          },
          {
            title: "Customizable",
            description:
              "Supports icons, colors, sizes, custom chevrons, ghost/outline variants, and disabled states.",
          },
          {
            title: "Performant",
            description:
              "Lazy mount with skeleton loading, GSAP animations with prefers-reduced-motion support, and scroll-into-view.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Accordion"
                description="Simple accordion with default open item and smooth animations."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "collapsible",
            label: "Collapsible",
            demo: (
              <DemoWrapper
                title="Collapsible Behavior"
                description="Multiple selection mode and custom arrow options for flexible collapsible patterns."
                code={collapsibleCode}
              >
                <CollapsibleDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "icons",
            label: "Icons",
            demo: (
              <DemoWrapper
                title="With Icons"
                description="Icon support, colored headers, and custom chevron configurations."
                code={iconsCode}
              >
                <IconsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "vertical",
            label: "Vertical",
            demo: (
              <DemoWrapper
                title="Vertical / Nested"
                description="Nested accordions with inset padding and size variants."
                code={verticalCode}
              >
                <VerticalDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "easy",
            label: "Easy",
            demo: (
              <DemoWrapper
                title="Easy Accordion"
                description="Easy accordion with default open item and smooth animations."
                code={kiraAccordionCode}
              >
                <KiraAccordionDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "easy-icons",
            label: "Easy Icons",
            demo: (
              <DemoWrapper
                title="Easy Accordion with Icons"
                description="Easy accordion with icons and smooth animations."
                code={kiraAccordionIconsCode}
              >
                <KiraAccordionIconsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "easy-nested",
            label: "Easy Nested",
            demo: (
              <DemoWrapper
                title="Easy Nested Accordion"
                description="Easy nested accordion with smooth animations."
                code={kiraAccordionNestedCode}
              >
                <KiraAccordionNestedDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "easy-variants",
            label: "Easy Variants",
            demo: (
              <DemoWrapper
                title="Easy Accordion with Variants"
                description="Easy accordion with variants and smooth animations."
                code={kiraAccordionVariantsCode}
              >
                <KiraAccordionVariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "draggable",
            label: "Draggable",
            demo: (
              <DemoWrapper
                title="Draggable Accordion"
                description="Drag and drop to reorder items with dedicated drag handles."
                code={draggableCode}
              >
                <DraggableDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "async",
            label: "Async Loading",
            demo: (
              <DemoWrapper
                title="Async Loading"
                description="Async loading states with skeleton, loading spinner, and error retry."
                code={asyncLoadingCode}
              >
                <AsyncLoadingDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "expand-collapse",
            label: "Expand All",
            demo: (
              <DemoWrapper
                title="Expand/Collapse All"
                description="Bulk expand and collapse functionality with showExpandAll prop."
                code={expandCollapseCode}
              >
                <ExpandCollapseDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Tab", description: "Move focus to next accordion" },
          {
            keys: "Shift + Tab",
            description: "Move focus to previous accordion",
          },
          { keys: "Enter / Space", description: "Toggle current item" },
          { keys: "Home", description: "Move to first item" },
          { keys: "End", description: "Move to last item" },
          {
            keys: "Arrow Down / Arrow Right",
            description: "Move to next item",
          },
          {
            keys: "Arrow Up / Arrow Left",
            description: "Move to previous item",
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Accordion components with various configuration options."
      />

      <APIReference
        sections={[
          {
            title: "Accordion",
            props: [
              {
                prop: "defaultValue",
                type: "string[]",
                default: "-",
                description: "Array of item values to be open by default.",
              },
              {
                prop: "value",
                type: "string[]",
                default: "-",
                description:
                  "Array of currently open item values (controlled).",
              },
              {
                prop: "onValueChange",
                type: "(value: string[]) => void",
                default: "-",
                description: "Callback when open items change.",
              },
              {
                prop: "multiple",
                type: "boolean",
                default: "false",
                description: "Allow multiple items to be open at once.",
              },
              {
                prop: "scrollIntoView",
                type: "boolean",
                default: "false",
                description: "Auto-scroll opened items into view.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "AccordionItem",
            props: [
              {
                prop: "value",
                type: "string",
                default: "-",
                description: "Unique identifier for the accordion item.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disable interaction with this item.",
              },
              {
                prop: "onOpen",
                type: "() => void",
                default: "-",
                description: "Callback when item opens.",
              },
              {
                prop: "onClose",
                type: "() => void",
                default: "-",
                description: "Callback when item closes.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "AccordionTrigger",
            props: [
              {
                prop: "variant",
                type: "'default' | 'info' | 'success' | 'warning' | 'destructive' | 'ghost' | 'outline'",
                default: "'default'",
                description: "Visual style variant of the trigger.",
              },
              {
                prop: "size",
                type: "'xs' | 'sm' | 'default' | 'lg'",
                default: "'default'",
                description: "Size of the trigger.",
              },
              {
                prop: "showArrow",
                type: "boolean",
                default: "true",
                description: "Show or hide the default chevron arrow.",
              },
              {
                prop: "chevronIcon",
                type: "ReactNode",
                default: "-",
                description: "Custom icon to replace the default chevron.",
              },
              {
                prop: "chevronPosition",
                type: "'start' | 'end'",
                default: "'end'",
                description: "Position of the chevron icon.",
              },
              {
                prop: "icon",
                type: "ReactNode",
                default: "-",
                description: "Icon displayed before the trigger text.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "AccordionContent",
            props: [
              {
                prop: "size",
                type: "'xs' | 'sm' | 'default' | 'lg'",
                default: "'default'",
                description: "Size of the content padding.",
              },
              {
                prop: "inset",
                type: "boolean",
                default: "false",
                description: "Add left padding for nested accordions.",
              },
              {
                prop: "lazyMount",
                type: "boolean",
                default: "false",
                description: "Defer rendering until first open.",
              },
              {
                prop: "showSkeleton",
                type: "boolean",
                default: "false",
                description: "Show skeleton loading state before mount.",
              },
              {
                prop: "skeletonLines",
                type: "number",
                default: "3",
                description: "Number of skeleton lines to show.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
        ]}
      />

      <Changelog
        entries={[
          {
            version: "2.0.0",
            date: "5 February 2026",
            changes: [
              {
                type: "added",
                title: "Drag-and-Drop Support",
                description:
                  "Added draggable prop with dedicated drag handles using @dnd-kit for cross-level reordering with visual feedback.",
              },
              {
                type: "added",
                title: "Async Loading States",
                description:
                  "Added asyncLoading prop with skeleton loading, spinner indicators, and error retry functionality.",
              },
              {
                type: "added",
                title: "Expand/Collapse All",
                description:
                  "Added showExpandAll prop to display bulk expand and collapse buttons for accordion groups.",
              },
              {
                type: "added",
                title: "WCAG 2.2 AA Accessibility",
                description:
                  "Full accessibility compliance with prefers-reduced-motion detection, keyboard navigation, and error boundaries.",
              },
              {
                type: "added",
                title: "Nested Accordion Support",
                description:
                  "Full support for recursive accordion structures with proper indentation and variant inheritance.",
              },
              {
                type: "changed",
                title: "Single-File Architecture",
                description:
                  "Refactored to single-file architecture following shadcn/ui patterns for better maintainability.",
              },
              {
                type: "changed",
                title: "TypeScript Strict Mode",
                description:
                  "Improved TypeScript strict mode compliance with better type definitions.",
              },
              {
                type: "changed",
                title: "Animation Optimization",
                description:
                  "Optimized animations with will-change CSS hints and reduced motion fallbacks.",
              },
            ],
          },
          {
            version: "1.0.0",
            date: "15 January 2026",
            changes: [
              {
                type: "added",
                title: "Initial Release",
                description:
                  "Basic accordion functionality with Base UI integration for accessible primitives.",
              },
              {
                type: "added",
                title: "GSAP Animations",
                description:
                  "Smooth expand/collapse animations using GSAP library.",
              },
              {
                type: "added",
                title: "Variant Support",
                description: "Support for variants, sizes, and custom icons.",
              },
              {
                type: "added",
                title: "KiraAccordion",
                description:
                  "All-in-one data-driven component for simplified usage.",
              },
            ],
          },
        ]}
        title="Changelog"
        description="Version history and changes for the Accordion component."
      />
    </ComponentPage>
  );
}
