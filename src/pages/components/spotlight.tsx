import { useState } from "react"
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
} from "@tabler/icons-react"

import { Spotlight, type SpotlightItemType, type SpotlightGroupType } from "@/components/ui/spotlight"
import { SpotlightProvider, useSpotlight } from "@/hooks/use-spotlight"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
]

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
]

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

function BasicDemo() {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)}>Open Spotlight</Button>
        <span className="text-sm text-muted-foreground">
          or press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
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
  )
}

function AsyncSearchDemo() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<SpotlightItemType[]>([])

  const handleSearch = async (query: string) => {
    if (!query) {
      setItems([])
      return
    }

    setLoading(true)
    // Simulate async search
    await new Promise((resolve) => setTimeout(resolve, 500))

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
    ]

    setItems(results)
    setLoading(false)
  }

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
  )
}

function GlobalShortcutDemo() {
  return (
    <SpotlightProvider>
      <GlobalShortcutContent />
    </SpotlightProvider>
  )
}

function GlobalShortcutContent() {
  const { open, openSpotlight, closeSpotlight, query } = useSpotlight()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd> anywhere to open the spotlight.
        The shortcut is handled globally by the SpotlightProvider.
      </p>

      <div className="flex gap-2">
        <Button onClick={openSpotlight}>Open Programmatically</Button>
        <Button variant="outline" onClick={closeSpotlight}>
          Close Programmatically
        </Button>
      </div>

      {query && (
        <p className="text-sm">
          Current query: <Badge variant="secondary">{query}</Badge>
        </p>
      )}

      <Spotlight
        open={open}
        onOpenChange={closeSpotlight}
        groups={commandGroups}
        placeholder="Global spotlight with keyboard shortcut..."
      />
    </div>
  )
}

function SizesDemo() {
  const [size, setSize] = useState<"sm" | "default" | "lg" | "full">("default")
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["sm", "default", "lg", "full"] as const).map((s) => (
          <Button
            key={s}
            variant={size === s ? "default" : "outline"}
            onClick={() => {
              setSize(s)
              setOpen(true)
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
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SpotlightPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Spotlight</h1>
          <Badge>Enhanced</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          A command palette / spotlight search component with full keyboard navigation,
          ARIA accessibility, GSAP animations, and flexible configuration.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Accessible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Full ARIA combobox pattern with keyboard navigation, focus management, and screen reader support.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Animated</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Smooth GSAP animations with prefers-reduced-motion support for accessibility.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flexible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Supports grouped commands, async search, custom rendering, and global keyboard shortcuts.
          </CardContent>
        </Card>
      </div>

      {/* Demos */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="async">Async Search</TabsTrigger>
          <TabsTrigger value="global">Global Shortcut</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
              <CardDescription>
                Command palette with grouped items, recent searches, and keyboard navigation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="async">
          <Card>
            <CardHeader>
              <CardTitle>Async Search</CardTitle>
              <CardDescription>
                Spotlight with async search, loading state, and custom empty state.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AsyncSearchDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Keyboard Shortcut</CardTitle>
              <CardDescription>
                Use SpotlightProvider for global ⌘K shortcut handling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalShortcutDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes">
          <Card>
            <CardHeader>
              <CardTitle>Size Variants</CardTitle>
              <CardDescription>
                Different size options: sm, default, lg, and full.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SizesDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>Full keyboard support for accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { key: "↑ / ↓", description: "Navigate through items" },
              { key: "Enter", description: "Select focused item" },
              { key: "Escape", description: "Close spotlight" },
              { key: "Home", description: "Jump to first item" },
              { key: "End", description: "Jump to last item" },
              { key: "⌘K / Ctrl+K", description: "Open spotlight (global)" },
            ].map(({ key, description }) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="rounded border bg-muted px-2 py-1 text-xs font-mono">
                  {key}
                </kbd>
                <span className="text-sm text-muted-foreground">{description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Key props and configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Prop</th>
                  <th className="py-2 text-left font-medium">Type</th>
                  <th className="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono text-xs">open</td>
                  <td className="py-2 text-muted-foreground">boolean</td>
                  <td className="py-2">Controlled open state</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">groups</td>
                  <td className="py-2 text-muted-foreground">SpotlightGroup[]</td>
                  <td className="py-2">Grouped command items</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">items</td>
                  <td className="py-2 text-muted-foreground">SpotlightItem[]</td>
                  <td className="py-2">Flat list of items</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">recentItems</td>
                  <td className="py-2 text-muted-foreground">SpotlightItem[]</td>
                  <td className="py-2">Recent items shown when query is empty</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">onSearch</td>
                  <td className="py-2 text-muted-foreground">(query: string) =&gt; void</td>
                  <td className="py-2">Async search callback</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">size</td>
                  <td className="py-2 text-muted-foreground">sm | default | lg | full</td>
                  <td className="py-2">Spotlight size variant</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">loading</td>
                  <td className="py-2 text-muted-foreground">boolean</td>
                  <td className="py-2">Show loading spinner</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
