import type { ComponentProps as ReactComponentProps } from "react";
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

function IconsWithIconSection() {
  return (
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
  );
}

function IconsHeaderColorsSection() {
  return (
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
  );
}

function IconsCustomChevronSection() {
  return (
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
  );
}

function IconsDemo() {
  return (
    <div className="space-y-6">
      <IconsWithIconSection />
      <IconsHeaderColorsSection />
      <IconsCustomChevronSection />
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
      items={kiraAccordionDemoKiraAccordionItems}
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
    <KiraAccordion multiple items={kiraAccordionIconsDemoKiraAccordionItems} />
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
      items={kiraAccordionNestedDemoKiraAccordionItems}
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
  const [items, setItems] = React.useState<AccordionItemData[]>([
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
    <KiraAccordion draggable items={items} onReorder={setItems} showExpandAll />
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

function SearchDemo() {
  const items = [
    { value: "install", title: "Installation", content: "Run bun install." },
    {
      value: "config",
      title: "Configuration",
      content: "Edit vite.config.ts.",
    },
    {
      value: "theming",
      title: "Theming",
      content: "Tokens live in index.css.",
    },
    {
      value: "a11y",
      title: "Accessibility",
      content: "WCAG 2.2 AA throughout.",
    },
    { value: "deploy", title: "Deployment", content: "Push to Vercel." },
  ];

  return (
    <KiraAccordion searchable searchPlaceholder="Search docs…" items={items} />
  );
}

const searchCode = `import { KiraAccordion } from "@/components/ui/accordion"

<KiraAccordion
  searchable
  searchPlaceholder="Search docs…"
  items={items}
/>`;

function PersistedDemo() {
  const items = [
    {
      value: "s1",
      title: "Section 1",
      content: "Open me, then reload the page.",
    },
    {
      value: "s2",
      title: "Section 2",
      content: "My open state is remembered.",
    },
    {
      value: "s3",
      title: "Section 3",
      content: "Stored under the persistKey.",
    },
  ];

  return <KiraAccordion persistKey="demo-docs" items={items} />;
}

const persistedCode = `import { KiraAccordion } from "@/components/ui/accordion"

// Open state is saved to localStorage under this key and restored on reload
<KiraAccordion persistKey="demo-docs" items={items} />`;

function EndHandleDemo() {
  const [items, setItems] = React.useState<AccordionItemData[]>([
    { value: "a", title: "Alpha", content: "Handle on the right." },
    { value: "b", title: "Bravo", content: "Handle on the right." },
    { value: "c", title: "Charlie", content: "Handle on the right." },
  ]);

  return (
    <KiraAccordion
      draggable
      dragHandlePosition="end"
      items={items}
      onReorder={setItems}
    />
  );
}

const endHandleCode = `import { KiraAccordion } from "@/components/ui/accordion"

// Drag handle rendered at the end (trailing) of each trigger
<KiraAccordion
  draggable
  dragHandlePosition="end"
  items={items}
  onReorder={setItems}
/>`;

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
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000);
        });
        setItems((prev) =>
          prev.map((i) => {
            if (i.value === item.value) {
              return { ...i, loading: false, content: "Loaded content!" };
            }

            return i;
          }),
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

function StressDemo() {
  const items: AccordionItemData[] = [
    {
      value: "release-2-1-0",
      title:
        "Release 2.1.0 — Find in page, URL deep linking, and search highlighting for the accordion component",
      content:
        "This release adds three quality-of-life features to the accordion: browser find-in-page support via hiddenUntilFound, shareable #value links via deepLink, and <mark> highlighting for search matches. Long titles like this one truncate with an ellipsis instead of overflowing the card boundary, even inside a narrow 320px column.",
    },
    {
      value: "empty-section",
      title: "Release notes with no content",
      content: "",
    },
    {
      value: "rolled-back",
      title: "Rolled back build (disabled)",
      content:
        "This entry is disabled and cannot be opened. It proves disabled items render correctly inside the stress container.",
      disabled: true,
      disabledReason: "Build was rolled back — artifacts removed from storage.",
    },
  ];

  return (
    <div className="max-w-xs">
      <KiraAccordion items={items} />
    </div>
  );
}

function DisabledReasonsDemo() {
  const items: AccordionItemData[] = [
    {
      value: "billing",
      title: "Billing history",
      content: "Invoices, receipts, and payment methods for this workspace.",
    },
    {
      value: "sso",
      title: "SSO configuration",
      content: "SAML and OIDC identity provider settings.",
      disabled: true,
      disabledReason: "Available on the Enterprise plan — upgrade to enable.",
    },
    {
      value: "audit-log",
      title: "Audit log",
      content: "Every configuration change, with actor and timestamp.",
      disabled: true,
      disabledReason: "Log retention expired — contact support to restore.",
    },
  ];

  return <KiraAccordion items={items} />;
}

const disabledReasonsCode = `import { KiraAccordion } from "@/components/ui/accordion"

// Disabled items with a reason stay keyboard-reachable: Tab to the item and
// the tooltip opens on focus (§9 — never leave a disabled control unexplained).
<KiraAccordion
  items={[
    { value: "sso", title: "SSO configuration", content: "…",
      disabled: true,
      disabledReason: "Available on the Enterprise plan — upgrade to enable." },
  ]}
/>`;

const stressCode = `import { KiraAccordion } from "@/components/ui/accordion"

// Very long title + empty content + disabled item in a narrow container
<KiraAccordion items={stressItems} />

// Wrap in max-w-xs to prove titles truncate and nothing overflows horizontally.`;

function FindInPageDemo() {
  const items: AccordionItemData[] = [
    {
      value: "kudzu-history",
      title: "What is kudzu?",
      content:
        'Kudzu is a fast-growing vine introduced to the southeastern United States in 1876. Press Ctrl/Cmd+F and search for "kudzu" — this panel expands automatically.',
    },
    {
      value: "layout",
      title: "Page layout notes",
      content:
        "The remaining panels stay collapsed until the browser's find bar matches text inside them.",
    },
    {
      value: "credits",
      title: "Credits",
      content: "Demo content for the hiddenUntilFound feature.",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>F</kbd> and search for{" "}
        <strong>kudzu</strong> — the matching collapsed panel auto-expands and
        scrolls into view.
      </p>
      <KiraAccordion hiddenUntilFound items={items} />
    </div>
  );
}

const findInPageCode = `import { KiraAccordion } from "@/components/ui/accordion"

// hiddenUntilFound registers every panel with hidden="until-found":
// browser find-in-page expands and scrolls to matches.
// Note: item-level lazyMount is ignored while hiddenUntilFound is on.
<KiraAccordion hiddenUntilFound items={items} />`;

function DeepLinkDemo() {
  const items: AccordionItemData[] = [
    {
      value: "install",
      title: "How do I install Kira Kit?",
      content:
        "Copy the component files into your project. Open this item and notice the URL now ends in #install — share that link and the item opens on load.",
    },
    {
      value: "theming",
      title: "How do I customize the theme?",
      content:
        "Design tokens live in index.css. Loading the page with #theming opens and scrolls to this answer.",
    },
    {
      value: "license",
      title: "What license does Kira Kit use?",
      content:
        "MIT. Closing every item strips the hash from the URL; the Back button is not spammed by toggles.",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Open an item — the URL hash becomes <code>#&lt;value&gt;</code>. Reload
        with <code>#theming</code> in the address bar to see the item open and
        scroll into view.
      </p>
      <KiraAccordion deepLink items={items} />
    </div>
  );
}

const deepLinkCode = `import { KiraAccordion } from "@/components/ui/accordion"

// deepLink syncs the open item with the URL hash using replaceState
// (Back button is not spammed). Hash wins over persistKey on load.
<KiraAccordion deepLink items={items} />`;

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
        version="v2.3.0"
      />

      <FeatureGrid
        features={accordionPageFeatureGridFeatures}
        description="Accordion capabilities built into Kira Kit."
      />

      <DemoTabs defaultValue="basic" tabs={accordionPageDemoTabsTabs} />

      <KeyboardShortcuts
        shortcuts={accordionPageKeyboardShortcutsShortcuts}
        description="Use the keyboard to navigate, open, and reorder panels."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import the primitives, then compose an item, trigger, and panel."
        notes={[
          {
            label: "KiraAccordion",
            body: "Use the items prop for a data-driven accordion.",
          },
        ]}
      />

      <APIReference
        sections={accordionPageAPIReferenceSections}
        description="Props, types, and defaults for each part of the accordion."
      />

      <Changelog
        entries={accordionPageChangelogEntries}
        title="Changelog"
        description="Version history for the accordion."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const kiraAccordionDemoKiraAccordionItems = [
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
] satisfies ReactComponentProps<typeof KiraAccordion>["items"];

const kiraAccordionIconsDemoKiraAccordionItems = [
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
    content: "Project configuration files like tsconfig, vite.config, etc.",
  },
] satisfies ReactComponentProps<typeof KiraAccordion>["items"];

const kiraAccordionNestedDemoKiraAccordionItems = [
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
] satisfies ReactComponentProps<typeof KiraAccordion>["items"];

const accordionPageFeatureGridFeatures = [
  {
    title: "Accessible",
    description:
      "WAI-ARIA compliant with proper roles, keyboard navigation (Tab, Enter, Space; arrow keys reorder while dragging), and screen reader announcements.",
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
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const accordionPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "KiraAccordion",
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
    group: "KiraAccordion",
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
    group: "KiraAccordion",
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
    group: "KiraAccordion",
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
    group: "Behavior",
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
    value: "end-handle",
    label: "End Handle",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Trailing Drag Handle"
        description="dragHandlePosition='end' renders the handle after the title."
        code={endHandleCode}
      >
        <EndHandleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "search",
    label: "Search",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Searchable Accordion"
        description="Filter items by title as you type (recursive for nested items). Matched substrings are highlighted on string titles."
        code={searchCode}
      >
        <SearchDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "find-in-page",
    label: "Find in Page",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Find in Page"
        description="hiddenUntilFound registers collapsed panels with the browser find bar — Ctrl/⌘+F expands and scrolls to matches."
        code={findInPageCode}
      >
        <FindInPageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "deep-link",
    label: "Deep Link",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Deep Link"
        description="deepLink keeps the URL hash in sync with the open item — shareable #value links open and scroll on load."
        code={deepLinkCode}
      >
        <DeepLinkDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "persisted",
    label: "Persisted",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Persisted Open State"
        description="Open sections are saved to storage and restored on reload."
        code={persistedCode}
      >
        <PersistedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async",
    label: "Async Loading",
    group: "Behavior",
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
    value: "disabled-reasons",
    label: "Disabled Reasons",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Disabled Items with Reasons"
        description="Disabled items with a reason stay keyboard-reachable — Tab to the item and the tooltip opens on focus."
        code={disabledReasonsCode}
      >
        <DisabledReasonsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "expand-collapse",
    label: "Expand All",
    group: "Behavior",
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
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long titles truncate, empty content renders nothing, and disabled items stay inert — all inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const accordionPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab",
    group: "Navigate & toggle",
    description: "Move focus to the next trigger.",
  },
  {
    keys: "Shift + Tab",
    group: "Navigate & toggle",
    description: "Move focus to the previous trigger.",
  },
  {
    keys: "Enter / Space",
    group: "Navigate & toggle",
    description: "Toggle the focused panel.",
  },
  {
    keys: "Tab",
    group: "Navigate & toggle",
    description: "Focus a disabled item to read its reason, when provided.",
  },
  {
    keys: "Space",
    group: "Reorder items",
    description: "Pick up or drop an item when its drag handle has focus.",
  },
  {
    keys: "Arrow keys",
    group: "Reorder items",
    description: "Move the picked-up item up or down.",
  },
  {
    keys: "Escape",
    group: "Reorder items",
    description: "Cancel and return the item to its original position.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const accordionPageAPIReferenceSections = [
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
        description: "Array of currently open item values (controlled).",
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
        prop: "hiddenUntilFound",
        type: "boolean",
        default: "false",
        description:
          "⌘F finds and expands collapsed panels (browser find-in-page).",
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
        description:
          "Defer rendering until first open. Ignored when hiddenUntilFound is set.",
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
  {
    title: "KiraAccordion",
    props: [
      {
        prop: "items",
        type: "AccordionItemData[]",
        default: "-",
        description: "Data-driven item list.",
      },
      {
        prop: "items[].disabledReason",
        type: "string",
        default: "-",
        description:
          "Tooltip on a disabled item; stays reachable by keyboard (focus) and touch.",
      },
      {
        prop: "hiddenUntilFound",
        type: "boolean",
        default: "false",
        description:
          "⌘F finds and expands collapsed panels. Item-level lazyMount is ignored while this is on.",
      },
      {
        prop: "deepLink",
        type: "boolean",
        default: "false",
        description:
          "Open state syncs with the URL hash (replaceState; hash wins over persistKey on load).",
      },
      {
        prop: "searchable",
        type: "boolean",
        default: "false",
        description:
          "Render a filter input; matched substrings are highlighted on string titles.",
      },
      {
        prop: "persistKey",
        type: "string",
        default: "-",
        description: "Persist open state to storage under this key.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const accordionPageChangelogEntries = [
  {
    version: "2.3.0",
    date: "26 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Draggable Reorder Handle and Drag Overlay",
        description:
          "Moved the sortable drag handle out of AccordionPrimitive.Trigger into a sibling button inside AccordionPrimitive.Header so pointer and keyboard drag events are no longer swallowed by the trigger button, rendered DragOverlay as a standalone trigger shell instead of an unmounted AccordionItem, and removed the duplicate onReorder call inside useAccordionDrag.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: "Trigger and panel padding join the spacing ladder",
        description:
          "xs horizontal padding px-3 → px-2 and sm px-3.5 → px-3 on both trigger and panel, matching the control ladder's px steps. Vertical py values are unchanged (optical text exception).",
      },
    ],
  },
  {
    version: "2.1.2",
    date: "18 October 2026",
    changes: [
      {
        type: "fixed",
        title: "onItemOpen / onItemClose Never Fired",
        description:
          "Base UI 1.9's Accordion.Item does not call the consumer's onOpenChange, so Kira's onItemOpen, onItemClose and everything built on them (asyncLoading flows, per-item callbacks) never ran. Kira now observes the item's data-open attribute and fires the callbacks on transitions. Found during the full-pass QA — the asyncLoading demo worked before only by accident of its initial state.",
      },
      {
        type: "fixed",
        title: "Parent Item Updates Were Dropped",
        description:
          "In uncontrolled mode (no onReorder), updates to the items prop — loading flags, content, errors set by the parent after mount — were silently ignored; the internal snapshot from first render was kept forever. The component now adopts a changed items prop (internal reorder state still wins between renders).",
      },
      {
        type: "added",
        title: "Disabled Item Reasons",
        description:
          "New items[].disabledReason shows a tooltip on a disabled item. The reason is reachable by keyboard (Tab focuses the item, tooltip opens on focus) and touch — satisfying the WCAG 2.2 rule that a disabled control must never be unexplained.",
      },
      {
        type: "added",
        title: "Load-Success Checkmark",
        description:
          "When async loading completes without error, the trigger briefly shows a success checkmark (spinner → check → hidden) before the panel content takes over.",
      },
      {
        type: "changed",
        title: "Motion Tokens",
        description:
          "Panel expand now runs 200ms ease-out, collapse 150ms ease-in (exit = 65% of enter per the motion-token spec); chevron rotation matched at 200ms. All gated by prefers-reduced-motion.",
      },
      {
        type: "changed",
        title: "Chevron Slot Attribute Renamed",
        description:
          'The chevron span now carries data-slot="accordion-chevron" instead of data-accordion-chevron, matching the kit data-slot convention. Update any custom CSS targeting the old attribute.',
      },
      {
        type: "changed",
        title: "Registry",
        description:
          "Accordion now declares a tooltip registry dependency (disabledReason implementation).",
      },
    ],
  },
  {
    version: "2.1.1",
    date: "18 October 2026",
    changes: [
      {
        type: "fixed",
        title: "Open-Panel Trigger Corners",
        description:
          "The trigger's rounded-b-none-when-open rule used an ancestor selector [[data-panel-open]_&], but Base UI sets data-panel-open on the trigger itself — the rule never matched, so bottom corners stayed rounded on open panels. Now uses the self-variant data-panel-open:rounded-b-none; verified in-browser (0px radius when open, 7.2px when closed).",
      },
      {
        type: "fixed",
        title: "Rules of Hooks Violation",
        description:
          "renderAccordionItem (the non-draggable item renderer) called the useItemOpenHandler hook once per item, changing hook count as the search filter changed the item list. Replaced with a hook-free makeItemOpenHandler factory; react-hooks/rules-of-hooks now passes. React 19 + React Compiler masked the crash at runtime; uncompiled builds would have failed.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "16 October 2026",
    changes: [
      {
        type: "added",
        title: "Find in Page",
        description:
          "New hiddenUntilFound prop registers collapsed panels with the browser find bar — Ctrl/⌘+F auto-expands and scrolls to matches. Item-level lazyMount is ignored while enabled.",
      },
      {
        type: "added",
        title: "URL Hash Deep Linking",
        description:
          "New deepLink prop syncs the open item with the URL hash via replaceState: shareable #value links open and scroll on load; closing every item strips the hash.",
      },
      {
        type: "added",
        title: "Search-Term Highlighting",
        description:
          'Searchable accordions wrap the matched substring of string titles in a <mark data-slot="accordion-search-match"> element.',
      },
      {
        type: "changed",
        title: "Keyboard Documentation Corrected",
        description:
          "Audited against @base-ui/react 1.9.0: roving focus was removed from Accordion — Tab now moves between triggers as normal tab stops; Arrow/Home/End do not move focus. Drag-handle keyboard interactions documented.",
      },
      {
        type: "changed",
        title: "Reduced Motion Gating",
        description:
          "Loader spin, skeleton pulse, chevron rotation, and panel height transitions all stop under prefers-reduced-motion.",
      },
      {
        type: "added",
        title: "Focus Rings and Search Empty State",
        description:
          "Expand/Collapse and Clear search buttons gained visible focus rings; the empty search state now offers a working Clear search button.",
      },
      {
        type: "fixed",
        title: "Search Filter Parent Preservation",
        description:
          "Filtering with a matching parent title now keeps the parent's full children instead of an empty list.",
      },
      {
        type: "fixed",
        title: "Drag Handle Alignment",
        description:
          "Drag handles no longer push titles out of alignment with regular accordions: the grip overlays the trigger's edge padding (start or end side) with no background, no overlap with the title or chevron, and the trigger reserves room on the handle side.",
      },
    ],
  },
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
          "Refactored to single-file architecture following stock registry patterns for better maintainability.",
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
        description: "Smooth expand/collapse animations using GSAP library.",
      },
      {
        type: "added",
        title: "Variant Support",
        description: "Support for variants, sizes, and custom icons.",
      },
      {
        type: "added",
        title: "KiraAccordion",
        description: "All-in-one data-driven component for simplified usage.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
