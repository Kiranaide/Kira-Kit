import { useState } from "react";
import {
  IconFile,
  IconFolder,
  IconSearch,
  IconSettings,
  IconUser,
  IconHome,
  IconBell,
  IconMail,
  IconCalendar,
  IconCode,
  IconTerminal,
  IconBrandGithub,
} from "@tabler/icons-react";

import {
  Spotlight,
  type SpotlightItemType,
  type SpotlightGroupType,
} from "@/components/ui/spotlight";
import { SpotlightProvider } from "@/hooks/use-spotlight";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

// ============================================================================
// DEMO DATA
// ============================================================================

const commandGroups: SpotlightGroupType[] = [
  {
    id: "navigation",
    label: "Navigation",
    items: [
      {
        id: "home",
        label: "Go to Home",
        description: "Navigate to the home page",
        icon: <IconHome className="h-4 w-4" />,
        shortcut: ["⌘", "H"],
        keywords: ["home", "start", "main"],
      },
      {
        id: "settings",
        label: "Open Settings",
        description: "Manage your preferences",
        icon: <IconSettings className="h-4 w-4" />,
        shortcut: ["⌘", ","],
        keywords: ["settings", "preferences", "config"],
      },
      {
        id: "profile",
        label: "View Profile",
        description: "See your profile details",
        icon: <IconUser className="h-4 w-4" />,
        keywords: ["profile", "account", "user"],
      },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    items: [
      {
        id: "new-file",
        label: "New File",
        description: "Create a new file",
        icon: <IconFile className="h-4 w-4" />,
        shortcut: ["⌘", "N"],
        keywords: ["new", "create", "file"],
      },
      {
        id: "new-folder",
        label: "New Folder",
        description: "Create a new folder",
        icon: <IconFolder className="h-4 w-4" />,
        shortcut: ["⌘", "⇧", "N"],
        keywords: ["new", "create", "folder", "directory"],
      },
      {
        id: "search",
        label: "Search Files",
        description: "Search through all files",
        icon: <IconSearch className="h-4 w-4" />,
        shortcut: ["⌘", "P"],
        keywords: ["search", "find", "files"],
      },
    ],
  },
  {
    id: "tools",
    label: "Developer Tools",
    items: [
      {
        id: "terminal",
        label: "Open Terminal",
        description: "Launch integrated terminal",
        icon: <IconTerminal className="h-4 w-4" />,
        shortcut: ["⌘", "`"],
        keywords: ["terminal", "console", "shell"],
      },
      {
        id: "code",
        label: "View Source Code",
        description: "Open source code viewer",
        icon: <IconCode className="h-4 w-4" />,
        keywords: ["code", "source", "view"],
      },
      {
        id: "github",
        label: "Open GitHub",
        description: "Go to GitHub repository",
        icon: <IconBrandGithub className="h-4 w-4" />,
        keywords: ["github", "git", "repository"],
      },
    ],
  },
];

const recentItems: SpotlightItemType[] = [
  {
    id: "recent-1",
    label: "dashboard.tsx",
    description: "Last edited 2 hours ago",
    icon: <IconFile className="h-4 w-4" />,
  },
  {
    id: "recent-2",
    label: "Notifications",
    description: "5 unread notifications",
    icon: <IconBell className="h-4 w-4" />,
  },
  {
    id: "recent-3",
    label: "Messages",
    description: "3 new messages",
    icon: <IconMail className="h-4 w-4" />,
  },
];

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

function BasicDemo() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)}>Open Spotlight</Button>
        <span className="text-sm text-muted-foreground">
          or press{" "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">
            ⌘K
          </kbd>
        </span>
      </div>

      {selectedItem && (
        <p className="text-sm">
          Selected: <Badge variant="secondary">{selectedItem}</Badge>
        </p>
      )}

      <Spotlight
        open={open}
        onOpenChange={setOpen}
        groups={commandGroups}
        recentItems={recentItems}
        placeholder="Type a command or search..."
        onSelect={(item) => setSelectedItem(item.label)}
      />
    </div>
  );
}

const basicCode = `import { useState } from "react"
import { Spotlight } from "@/components/ui/spotlight"

export function BasicSpotlightDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Spotlight</Button>

      <Spotlight
        open={open}
        onOpenChange={setOpen}
        placeholder="Type a command or search..."
      />
    </>
  )
}`;

function AsyncSearchDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SpotlightItemType[]>([]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setItems([]);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results: SpotlightItemType[] = [
      {
        id: `result-1-${query}`,
        label: `Result for "${query}"`,
        description: "Found in documents",
        icon: <IconFile className="h-4 w-4" />,
      },
      {
        id: `result-2-${query}`,
        label: `Another result for "${query}"`,
        description: "Found in calendar",
        icon: <IconCalendar className="h-4 w-4" />,
      },
    ];

    setItems(results);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Async Search</Button>

      <Spotlight
        open={open}
        onOpenChange={setOpen}
        items={items}
        loading={loading}
        onSearch={handleSearch}
        placeholder="Search with async loading..."
        disableFilter
        emptyContent={
          <div className="flex flex-col items-center gap-2 py-4">
            <IconSearch className="h-8 w-8 text-muted-foreground" />
            <p>Start typing to search...</p>
          </div>
        }
      />
    </div>
  );
}

const asyncSearchCode = `import { useState } from "react"
import { Spotlight } from "@/components/ui/spotlight"
import { IconFile } from "@tabler/icons-react"

export function AsyncSearchDemo() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  const handleSearch = async (query: string) => {
    setLoading(true)
    const results = await searchAPI(query)
    setLoading(false)
    setItems(results)
  }

  return (
    <Spotlight
      open={open}
      onOpenChange={setOpen}
      items={items}
      loading={loading}
      onSearch={handleSearch}
      placeholder="Search..."
      disableFilter
    />
  )
}`;

function GlobalShortcutDemo() {
  return (
    <SpotlightProvider>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">
            ⌘K
          </kbd>{" "}
          anywhere to open the spotlight. The shortcut is handled globally by
          SpotlightProvider.
        </p>

        <div className="flex gap-2">
          <Button onClick={() => {}}>Open Programmatically</Button>
          <Button variant="outline">Close Programmatically</Button>
        </div>
      </div>
    </SpotlightProvider>
  );
}

const globalShortcutCode = `import { SpotlightProvider, useSpotlight } from "@/hooks/use-spotlight"

export function GlobalShortcutDemo() {
  const { open, openSpotlight, closeSpotlight, query } = useSpotlight()

  return (
    <SpotlightProvider>
      <Button onClick={openSpotlight}>Open Spotlight</Button>
      <Spotlight
        open={open}
        onOpenChange={closeSpotlight}
        groups={commandGroups}
        placeholder="Global spotlight with keyboard shortcut..."
      />
    </SpotlightProvider>
  )
}`;

function SizesDemo() {
  const [size, setSize] = useState<"sm" | "default" | "lg" | "full">("default");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["sm", "default", "lg", "full"] as const).map((s) => (
          <Button
            key={s}
            variant={size === s ? "default" : "outline"}
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            {s.toUpperCase()}
          </Button>
        ))}
      </div>

      <Spotlight
        open={open}
        onOpenChange={setOpen}
        size={size}
        groups={commandGroups}
        placeholder={`Size: ${size}`}
      />
    </div>
  );
}

const sizesCode = `import { useState } from "react"
import { Spotlight } from "@/components/ui/spotlight"

export function SizesDemo() {
  const [size, setSize] = useState("default")

  return (
    <Spotlight
      size={size}
      open={open}
      onOpenChange={setOpen}
      groups={commandGroups}
      placeholder="Select size..."
    />
  )
}`;

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SpotlightPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "Full ARIA combobox pattern with keyboard navigation, focus management, and screen reader support.",
      icon: <IconSearch className="w-4 h-4 text-primary" />,
    },
    {
      title: "Animated",
      description:
        "Smooth GSAP animations with prefers-reduced-motion support for accessibility.",
      icon: <IconBell className="w-4 h-4 text-primary" />,
    },
    {
      title: "Flexible",
      description:
        "Supports grouped commands, async search, custom rendering, and global shortcuts.",
      icon: <IconCode className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Usage"
          description="Command palette with grouped items, recent searches, and keyboard navigation."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "async",
      label: "Async Search",
      demo: (
        <DemoWrapper
          title="Async Search"
          description="Spotlight with async search, loading state, and custom empty state."
          code={asyncSearchCode}
        >
          <AsyncSearchDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "global",
      label: "Global Shortcut",
      demo: (
        <DemoWrapper
          title="Global Keyboard Shortcut"
          description="Use SpotlightProvider for global ⌘K shortcut handling."
          code={globalShortcutCode}
        >
          <GlobalShortcutDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Different size options: sm, default, lg, and full."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "↑ / ↓", description: "Navigate through items" },
    { keys: "Enter", description: "Select focused item" },
    { keys: "Escape", description: "Close spotlight" },
    { keys: "Home", description: "Jump to first item" },
    { keys: "End", description: "Jump to last item" },
    { keys: "⌘K / Ctrl+K", description: "Open spotlight (global)" },
  ];

  const usageCode = `import { Spotlight } from "@/components/ui/spotlight"
import { SpotlightProvider, useSpotlight } from "@/hooks/use-spotlight"

// Basic usage
<Spotlight
  open={open}
  onOpenChange={setOpen}
  groups={commandGroups}
  recentItems={recentItems}
  placeholder="Type a command or search..."
/>

// With async search
<Spotlight
  items={items}
  loading={loading}
  onSearch={handleSearch}
  placeholder="Search..."
  disableFilter
/>

// Global shortcut provider
<SpotlightProvider>
  <Spotlight open={open} onOpenChange={setOpen} groups={commandGroups} />
</SpotlightProvider>`;

  const apiReference = [
    {
      title: "Spotlight",
      props: [
        {
          prop: "open",
          type: "boolean",
          default: "-",
          description: "Controlled open state",
        },
        {
          prop: "groups",
          type: "SpotlightGroup[]",
          default: "-",
          description: "Grouped command items",
        },
        {
          prop: "items",
          type: "SpotlightItem[]",
          default: "-",
          description: "Flat list of items",
        },
        {
          prop: "recentItems",
          type: "SpotlightItem[]",
          default: "-",
          description: "Recent items shown when query is empty",
        },
        {
          prop: "onSearch",
          type: "(query: string) => void",
          default: "-",
          description: "Async search callback",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg" | "full"',
          default: '"default"',
          description: "Spotlight size variant",
        },
        {
          prop: "loading",
          type: "boolean",
          default: "false",
          description: "Show loading spinner",
        },
        {
          prop: "disableFilter",
          type: "boolean",
          default: "false",
          description: "Disable client-side filtering",
        },
        {
          prop: "placeholder",
          type: "string",
          default: '"Search..."',
          description: "Search placeholder text",
        },
        {
          prop: "emptyContent",
          type: "ReactNode",
          default: "-",
          description: "Custom empty state content",
        },
        {
          prop: "onSelect",
          type: "(item: SpotlightItem) => void",
          default: "-",
          description: "Item selection callback",
        },
        {
          prop: "onSearch",
          type: "(query: string, results: SpotlightItem[]) => void",
          default: "-",
          description: "Search results callback",
        },
      ],
    },
    {
      title: "SpotlightProvider",
      props: [
        {
          prop: "shortcut",
          type: "string[]",
          default: '["Meta", "K"]',
          description: "Keyboard shortcut to open spotlight",
        },
        {
          prop: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Default open state",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Provider children",
        },
      ],
    },
    {
      title: "useSpotlight Hook Returns",
      props: [
        {
          prop: "open",
          type: "boolean",
          default: "-",
          description: "Current open state",
        },
        {
          prop: "openSpotlight",
          type: "() => void",
          default: "-",
          description: "Function to open spotlight",
        },
        {
          prop: "closeSpotlight",
          type: "() => void",
          default: "-",
          description: "Function to close spotlight",
        },
        {
          prop: "query",
          type: "string",
          default: "-",
          description: "Current search query",
        },
        {
          prop: "focusedIndex",
          type: "number",
          default: "-",
          description: "Index of focused item",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Spotlight"
        description="A command palette / spotlight search component with full keyboard navigation, ARIA accessibility, GSAP animations, and flexible configuration."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  );
}
