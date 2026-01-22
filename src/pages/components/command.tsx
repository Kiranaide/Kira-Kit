import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"
import {
  IconSearch,
  IconFileText,
  IconSettings,
  IconUser,
  IconLayoutDashboard,
  IconCommand,
  IconLetterK,
  IconUsers,
  IconDatabase,
} from "@tabler/icons-react"

function BasicDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem>
          <IconFileText className="h-4 w-4 mr-2" />
          <span>New Document</span>
        </CommandItem>
        <CommandItem>
          <IconSearch className="h-4 w-4 mr-2" />
          <span>Search</span>
        </CommandItem>
        <CommandItem>
          <IconSettings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </CommandItem>
      </CommandList>
    </Command>
  )
}

const basicCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"

function BasicDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem>
          <IconFileText className="h-4 w-4 mr-2" />
          <span>New Document</span>
        </CommandItem>
        <CommandItem>
          <IconSearch className="h-4 w-4 mr-2" />
          <span>Search</span>
        </CommandItem>
        <CommandItem>
          <IconSettings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </CommandItem>
      </CommandList>
    </Command>
  )
}`

function GroupedDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem>
            <IconLayoutDashboard className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconUser className="h-4 w-4 mr-2" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Settings">
          <CommandItem>
            <IconSettings className="h-4 w-4 mr-2" />
            <span>Preferences</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem>
            <IconFileText className="h-4 w-4 mr-2" />
            <span>New File</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const groupedCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"

function GroupedDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem>
            <IconLayoutDashboard className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconUser className="h-4 w-4 mr-2" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Settings">
          <CommandItem>
            <IconSettings className="h-4 w-4 mr-2" />
            <span>Preferences</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`

function ShortcutsDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem>
          <span>Dashboard</span>
          <CommandShortcut>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">D</kbd>
            </div>
          </CommandShortcut>
        </CommandItem>
        <CommandItem>
          <span>Search</span>
          <CommandShortcut>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">K</kbd>
            </div>
          </CommandShortcut>
        </CommandItem>
        <CommandItem>
          <span>Settings</span>
          <CommandShortcut>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">,</kbd>
            </div>
          </CommandShortcut>
        </CommandItem>
      </CommandList>
    </Command>
  )
}

const shortcutsCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"

function ShortcutsDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem>
          <span>Dashboard</span>
          <CommandShortcut>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">D</kbd>
            </div>
          </CommandShortcut>
        </CommandItem>
      </CommandList>
    </Command>
  )
}`

function EmptyDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-4 text-center">
            <IconSearch className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm">No results found</p>
            <p className="text-xs text-muted-foreground">
              Try a different search term
            </p>
          </div>
        </CommandEmpty>
      </CommandList>
    </Command>
  )
}

const emptyCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"

function EmptyDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-4 text-center">
            <IconSearch className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm">No results found</p>
            <p className="text-xs text-muted-foreground">
              Try a different search term
            </p>
          </div>
        </CommandEmpty>
      </CommandList>
    </Command>
  )
}`

function VariantsDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="outline">Default</Badge>
        <Command variant="default">
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Settings</CommandItem>
            <CommandItem>Profile</CommandItem>
          </CommandList>
        </Command>
      </div>

      <div className="space-y-2">
        <Badge variant="outline">Minimal</Badge>
        <Command variant="minimal">
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Settings</CommandItem>
            <CommandItem>Profile</CommandItem>
          </CommandList>
        </Command>
      </div>

      <div className="space-y-2">
        <Badge variant="outline">Bordered</Badge>
        <Command variant="bordered">
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Settings</CommandItem>
            <CommandItem>Profile</CommandItem>
          </CommandList>
        </Command>
      </div>
    </div>
  )
}

const variantsCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

function VariantsDemo() {
  return (
    <div className="space-y-8">
      <Command variant="default">
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandItem>Dashboard</CommandItem>
        </CommandList>
      </Command>

      <Command variant="minimal">
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandItem>Dashboard</CommandItem>
        </CommandList>
      </Command>

      <Command variant="bordered">
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandItem>Dashboard</CommandItem>
        </CommandList>
      </Command>
    </div>
  )
}`

function DialogDemo() {
  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" className="gap-2"><IconCommand className="h-4 w-4" /><IconLetterK className="h-4 w-4" />Open Command</Button>} />
        <DialogContent className="p-0" showCloseButton={false}>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <IconLayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                  <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <IconUser className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <IconSettings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem>
                  <IconFileText className="h-4 w-4 mr-2" />
                  <span>New File</span>
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const dialogCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>Open Command</DialogTrigger>
      <DialogContent className="p-0">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <IconLayoutDashboard className="h-4 w-4 mr-2" />
                <span>Dashboard</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <IconFileText className="h-4 w-4 mr-2" />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}`

function BadgesDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandItem>
          <IconUser className="h-4 w-4 mr-2" />
          <span className="flex-1">Profile</span>
          <Badge variant="secondary" className="text-xs">
            Pro
          </Badge>
        </CommandItem>
        <CommandItem>
          <IconUsers className="h-4 w-4 mr-2" />
          <span className="flex-1">Team</span>
          <Badge variant="outline" className="text-xs">
            New
          </Badge>
        </CommandItem>
        <CommandItem>
          <IconDatabase className="h-4 w-4 mr-2" />
          <span className="flex-1">Database</span>
          <Badge variant="destructive" className="text-xs">
            3 alerts
          </Badge>
        </CommandItem>
      </CommandList>
    </Command>
  )
}

const badgesCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

function BadgesDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandItem>
          <IconUser className="h-4 w-4 mr-2" />
          <span className="flex-1">Profile</span>
          <Badge variant="secondary" className="text-xs">
            Pro
          </Badge>
        </CommandItem>
        <CommandItem>
          <IconUsers className="h-4 w-4 mr-2" />
          <span className="flex-1">Team</span>
          <Badge variant="outline" className="text-xs">
            New
          </Badge>
        </CommandItem>
        <CommandItem>
          <IconDatabase className="h-4 w-4 mr-2" />
          <span className="flex-1">Database</span>
          <Badge variant="destructive" className="text-xs">
            3 alerts
          </Badge>
        </CommandItem>
      </CommandList>
    </Command>
  )
}`

function RichContentDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandItem>
          <div className="flex flex-col">
            <span className="font-medium">Dashboard</span>
            <span className="text-xs text-muted-foreground">
              View your analytics and metrics
            </span>
          </div>
        </CommandItem>
        <CommandItem>
          <div className="flex flex-col">
            <span className="font-medium">Profile</span>
            <span className="text-xs text-muted-foreground">
              Manage your account settings
            </span>
          </div>
        </CommandItem>
        <CommandItem>
          <div className="flex flex-col">
            <span className="font-medium">Settings</span>
            <span className="text-xs text-muted-foreground">
              Configure your preferences
            </span>
          </div>
        </CommandItem>
      </CommandList>
    </Command>
  )
}

const richContentCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"

function RichContentDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandItem>
          <div className="flex flex-col">
            <span className="font-medium">Dashboard</span>
            <span className="text-xs text-muted-foreground">
              View your analytics and metrics
            </span>
          </div>
        </CommandItem>
        <CommandItem>
          <div className="flex flex-col">
            <span className="font-medium">Profile</span>
            <span className="text-xs text-muted-foreground">
              Manage your account settings
            </span>
          </div>
        </CommandItem>
      </CommandList>
    </Command>
  )
}`

export default function CommandPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Command"
        description="Command palette with search, groups, and keyboard shortcuts. Built on cmdk for powerful fuzzy search and navigation."
        version="1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Fuzzy Search",
            description: "Powered by cmdk for fast, intelligent fuzzy matching across all items.",
          },
          {
            title: "Keyboard First",
            description: "Full keyboard navigation with arrow keys, Enter to select, and configurable shortcuts.",
          },
          {
            title: "Flexible Groups",
            description: "Organize items into logical groups with separators and custom headings.",
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
                title="Basic Command"
                description="Simple item list with search input and empty state."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "grouped",
            label: "Grouped",
            demo: (
              <DemoWrapper
                title="Grouped Items"
                description="Items organized by category with group headings and separators."
                code={groupedCode}
              >
                <GroupedDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "shortcuts",
            label: "Shortcuts",
            demo: (
              <DemoWrapper
                title="Keyboard Shortcuts"
                description="Display keyboard shortcuts for quick actions and navigation."
                code={shortcutsCode}
              >
                <ShortcutsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "empty",
            label: "Empty State",
            demo: (
              <DemoWrapper
                title="Custom Empty State"
                description="Custom 'No results' message with icon and helpful text."
                code={emptyCode}
              >
                <EmptyDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "variants",
            label: "Variants",
            demo: (
              <DemoWrapper
                title="Style Variants"
                description="Default, minimal, and bordered visual styles."
                code={variantsCode}
              >
                <VariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "dialog",
            label: "Dialog",
            demo: (
              <DemoWrapper
                title="Command in Dialog"
                description="Command palette integrated with a modal dialog for typical command palette usage."
                code={dialogCode}
              >
                <DialogDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "badges",
            label: "Badges",
            demo: (
              <DemoWrapper
                title="With Badges"
                description="Command items with status badges for visual indicators."
                code={badgesCode}
              >
                <BadgesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "rich",
            label: "Rich Content",
            demo: (
              <DemoWrapper
                title="Rich Content"
                description="Command items with descriptions and additional metadata."
                code={richContentCode}
              >
                <RichContentDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "↑ / ↓", description: "Navigate items" },
          { keys: "Enter", description: "Select item" },
          { keys: "Esc", description: "Close command" },
          { keys: "Tab", description: "Navigate within input" },
          { keys: "Home / End", description: "Jump to start/end" },
        ]}
      />

      <UsageBlock
        code={`import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"

export function MyCommand() {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`}
        title="Usage"
        description="Basic implementation example"
      />

      <APIReference
        sections={[
          {
            title: "Command",
            props: [
              {
                prop: "variant",
                type: "'default' | 'minimal' | 'bordered'",
                default: "'default'",
                description: "Visual style variant for the command palette.",
              },
              {
                prop: "size",
                type: "'sm' | 'default' | 'lg'",
                default: "'default'",
                description: "Maximum height of the command palette.",
              },
              {
                prop: "filter",
                type: "boolean",
                default: "true",
                description: "Whether to filter items based on input.",
              },
            ],
          },
          {
            title: "CommandInput",
            props: [
              {
                prop: "placeholder",
                type: "string",
                default: "undefined",
                description: "Placeholder text for the search input.",
              },
              {
                prop: "value",
                type: "string",
                default: "undefined",
                description: "Controlled value of the input.",
              },
              {
                prop: "onValueChange",
                type: "(value: string) => void",
                default: "undefined",
                description: "Callback when input value changes.",
              },
            ],
          },
          {
            title: "CommandItem",
            props: [
              {
                prop: "value",
                type: "string",
                default: "required",
                description: "Unique value for the item (required for search).",
              },
              {
                prop: "onSelect",
                type: "() => void",
                default: "undefined",
                description: "Callback when the item is selected.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Whether the item is disabled.",
              },
            ],
          },
          {
            title: "CommandGroup",
            props: [
              {
                prop: "heading",
                type: "string",
                default: "undefined",
                description: "Heading text displayed above the group.",
              },
              {
                prop: "value",
                type: "string",
                default: "undefined",
                description: "Optional value for the group.",
              },
            ],
          },
          {
            title: "CommandShortcut",
            props: [
              {
                prop: "children",
                type: "ReactNode",
                default: "required",
                description: "Shortcut text or keyboard display.",
              },
            ],
          },
          {
            title: "CommandEmpty",
            props: [
              {
                prop: "children",
                type: "ReactNode",
                default: "required",
                description: "Content to display when no results are found.",
              },
            ],
          },
          {
            title: "CommandSeparator",
            props: [
              {
                prop: "alwaysRender",
                type: "boolean",
                default: "false",
                description: "Whether to always render the separator.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
