"use client";

import * as React from "react";
import {
  IconCopy,
  IconCut,
  IconClipboard,
  IconArrowBack,
  IconArrowForward,
  IconRefresh,
  IconDownload,
  IconPrinter,
  IconShare,
  IconStar,
  IconBookmark,
  IconFolder,
  IconFile,
  IconPlus,
  IconMenu2,
  IconKeyboard,
  IconComponents,
} from "@tabler/icons-react";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
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

function BasicDemo() {
  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          icon={<IconArrowBack />}
          shortcut="⌘["
          onClick={() => handleAction("back")}
        >
          Back
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconArrowForward />}
          shortcut="⌘]"
          disabled
        >
          Forward
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconRefresh />}
          shortcut="⌘R"
          onClick={() => handleAction("reload")}
        >
          Reload
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          icon={<IconDownload />}
          shortcut="⌘S"
          onClick={() => handleAction("save")}
        >
          Save Page As...
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconPrinter />}
          onClick={() => handleAction("print")}
        >
          Print...
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const basicCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { IconArrowBack, IconArrowForward, IconRefresh } from "@tabler/icons-react"

export function BasicDemo() {
  const handleAction = (action: string) => {
    console.log(\`Action: \${action}\`)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          icon={<IconArrowBack />}
          shortcut="⌘["
          onClick={() => handleAction("back")}
        >
          Back
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconArrowForward />}
          shortcut="⌘]"
          disabled
        >
          Forward
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconRefresh />}
          shortcut="⌘R"
          onClick={() => handleAction("reload")}
        >
          Reload
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          icon={<IconDownload />}
          shortcut="⌘S"
          onClick={() => handleAction("save")}
        >
          Save Page As...
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconPrinter />}
          onClick={() => handleAction("print")}
        >
          Print...
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`;

function SubmenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
        Right click for nested menus
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile />}>Open</ContextMenuItem>
        <ContextMenuItem icon={<IconFolder />}>Open With</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Get Up!</ContextMenuItem>
            <ContextMenuItem>Inside Out</ContextMenuItem>
            <ContextMenuItem>Night Beats</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem icon={<IconPlus />}>
              New playlist...
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem icon={<IconShare />}>
              Share via Email
            </ContextMenuItem>
            <ContextMenuItem icon={<IconShare />}>
              Share on Twitter
            </ContextMenuItem>
            <ContextMenuItem icon={<IconShare />}>Copy Link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconBookmark />}>
          Add to Library
        </ContextMenuItem>
        <ContextMenuItem icon={<IconStar />}>Add to Favorites</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const submenuCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu"
import { IconFile, IconFolder, IconPlus, IconShare, IconBookmark, IconStar } from "@tabler/icons-react"

export function SubmenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
        Right click for nested menus
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile />}>Open</ContextMenuItem>
        <ContextMenuItem icon={<IconFolder />}>Open With</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Get Up!</ContextMenuItem>
            <ContextMenuItem>Inside Out</ContextMenuItem>
            <ContextMenuItem>Night Beats</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem icon={<IconPlus />}>
              New playlist...
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem icon={<IconShare />}>
              Share via Email
            </ContextMenuItem>
            <ContextMenuItem icon={<IconShare />}>
              Share on Twitter
            </ContextMenuItem>
            <ContextMenuItem icon={<IconShare />}>Copy Link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconBookmark />}>
          Add to Library
        </ContextMenuItem>
        <ContextMenuItem icon={<IconStar />}>Add to Favorites</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`;

function IconsDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
        Right click for file options
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile />} shortcut="⌘N">
          New File
        </ContextMenuItem>
        <ContextMenuItem icon={<IconFolder />} shortcut="⌘⇧N">
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconCopy />} shortcut="⌘C">
          Copy
        </ContextMenuItem>
        <ContextMenuItem icon={<IconCut />} shortcut="⌘X">
          Cut
        </ContextMenuItem>
        <ContextMenuItem icon={<IconClipboard />} shortcut="⌘V">
          Paste
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const iconsCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { IconFile, IconFolder, IconCopy, IconCut, IconClipboard } from "@tabler/icons-react"

export function IconsDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
        Right click for file options
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile />} shortcut="⌘N">
          New File
        </ContextMenuItem>
        <ContextMenuItem icon={<IconFolder />} shortcut="⌘⇧N">
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconCopy />} shortcut="⌘C">
          Copy
        </ContextMenuItem>
        <ContextMenuItem icon={<IconCut />} shortcut="⌘X">
          Cut
        </ContextMenuItem>
        <ContextMenuItem icon={<IconClipboard />} shortcut="⌘V">
          Paste
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`;

function CheckboxesDemo() {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showStatusBar, setShowStatusBar] = React.useState(false);

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
          Right click for view options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={showToolbar}
            onCheckedChange={setShowToolbar}
          >
            Show Toolbar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            Show Sidebar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Show Status Bar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-muted-foreground">
        Status: Toolbar: {showSidebar ? "On" : "Off"}, Sidebar:{" "}
        {showSidebar ? "On" : "Off"}, Status Bar:{" "}
        {showStatusBar ? "On" : "Off"}
      </p>
    </div>
  );
}

const checkboxesCode = `import { useState } from "react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu"

export function CheckboxesDemo() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showStatusBar, setShowStatusBar] = useState(false)

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
          Right click for view options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={showToolbar}
            onCheckedChange={setShowToolbar}
          >
            Show Toolbar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            Show Sidebar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Show Status Bar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-muted-foreground">
        Status: Toolbar: {showSidebar ? "On" : "Off"}, Sidebar:{" "}
        {showSidebar ? "On" : "Off"}, Status Bar:{" "}
        {showStatusBar ? "On" : "Off"}
      </p>
    </div>
  )
}`;

function RadioDemo() {
  const [radioValue, setRadioValue] = React.useState("name");

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
          Right click for sorting options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel inset>Sort By</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
            >
              <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
              <ContextMenuRadioItem value="date">
                Date Modified
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
              <ContextMenuRadioItem value="type">Type</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-muted-foreground">Sorted by: {radioValue}</p>
    </div>
  );
}

const radioCode = `import { useState } from "react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu"

export function RadioDemo() {
  const [radioValue, setRadioValue] = useState("name")

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
          Right click for sorting options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel inset>Sort By</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
            >
              <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
              <ContextMenuRadioItem value="date">
                Date Modified
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
              <ContextMenuRadioItem value="type">Type</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-muted-foreground">Sorted by: {radioValue}</p>
    </div>
  )
}`;

const features = [
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA menu pattern with keyboard navigation, focus management, and screen reader support.",
    icon: <IconKeyboard className="h-4 w-4" />,
  },
  {
    title: "Composable",
    description:
      "Build complex menus with checkboxes, radio groups, submenus, icons, and keyboard shortcuts.",
    icon: <IconComponents className="h-4 w-4" />,
  },
  {
    title: "Flexible",
    description:
      "Support for loading states, arrows, destructive actions, and a convenience wrapper component.",
    icon: <IconMenu2 className="h-4 w-4" />,
  },
];

const keyboardShortcuts = [
  { keys: "Enter / Space", description: "Activate selected item" },
  { keys: "Arrow Down", description: "Move to next item" },
  { keys: "Arrow Up", description: "Move to previous item" },
  { keys: "Arrow Right", description: "Open submenu" },
  { keys: "Arrow Left", description: "Close submenu" },
  { keys: "Escape", description: "Close menu" },
  { keys: "Home", description: "Move to first item" },
  { keys: "End", description: "Move to last item" },
];

const usageCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuWithContent,
  ContextMenuArrow,
} from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Action</ContextMenuItem>
    <ContextMenuItem icon={<Icon />} shortcut="⌘K">With Shortcut</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
      Toggle
    </ContextMenuCheckboxItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Submenu</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Sub Action</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>`;

const apiSections = [
  {
    title: "ContextMenu",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the context menu.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Default open state for uncontrolled usage.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when the open state changes.",
      },
      {
        prop: "modal",
        type: "boolean",
        default: "true",
        description: "Whether the menu should trap focus when open.",
      },
    ],
  },
  {
    title: "ContextMenuTrigger",
    props: [
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Prevent the context menu from opening.",
      },
    ],
  },
  {
    title: "ContextMenuContent",
    props: [
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment of the menu.",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "Side of the trigger to render the menu.",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "4",
        description: "Distance from the trigger in pixels.",
      },
    ],
  },
  {
    title: "ContextMenuItem",
    props: [
      {
        prop: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "Visual variant of the menu item.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Icon to display before the item text.",
      },
      {
        prop: "shortcut",
        type: "string",
        description: "Keyboard shortcut hint (e.g., '⌘K').",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Show loading spinner and disable item.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the menu item.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description: "Close the menu when clicked.",
      },
    ],
  },
  {
    title: "ContextMenuCheckboxItem",
    props: [
      {
        prop: "checked",
        type: "boolean",
        description: "Controlled checked state.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Callback when checked state changes.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Custom check icon.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the checkbox item.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description: "Close the menu when clicked.",
      },
    ],
  },
  {
    title: "ContextMenuRadioGroup",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Currently selected value.",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        description: "Callback when selection changes.",
      },
    ],
  },
  {
    title: "ContextMenuRadioItem",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Value of this radio item.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Icon to display before the item text.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the radio item.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description: "Close the menu when clicked.",
      },
    ],
  },
  {
    title: "ContextMenuWithContent",
    props: [
      {
        prop: "trigger",
        type: "ReactNode",
        description: "Element to use as the menu trigger.",
      },
      {
        prop: "contentProps",
        type: "ContextMenuContentProps",
        description: "Props to pass to ContextMenuContent.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Menu items to render inside the content.",
      },
    ],
  },
  {
    title: "ContextMenuSeparator",
    props: [
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element.",
      },
    ],
  },
  {
    title: "ContextMenuSub",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the submenu.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Default open state for uncontrolled usage.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when the open state changes.",
      },
    ],
  },
  {
    title: "ContextMenuSubTrigger",
    props: [
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Adds inset padding to the item.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Icon to display before the item text.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the submenu trigger.",
      },
    ],
  },
  {
    title: "ContextMenuSubContent",
    props: [
      {
        prop: "alignOffset",
        type: "number",
        default: "-4",
        description: "The offset from the trigger along the align axis.",
      },
      {
        prop: "avoidCollisions",
        type: "boolean",
        default: "true",
        description: "Whether to avoid collisions with viewport boundaries.",
      },
      {
        prop: "collisionPadding",
        type: "number | Partial<Record<Side, number>>",
        default: "10",
        description: "Padding between the popover and viewport edges.",
      },
    ],
  },
  {
    title: "ContextMenuGroup",
    props: [
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element.",
      },
    ],
  },
  {
    title: "ContextMenuLabel",
    props: [
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Adds inset padding to the label.",
      },
    ],
  },
  {
    title: "ContextMenuRadioItem",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Value of this radio item.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Icon to display before the item text.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the radio item.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description: "Close the menu when clicked.",
      },
    ],
  },
];

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Context Menu"
        description="Simple context menu with navigation actions and shortcuts."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "submenu",
    label: "Submenu",
    demo: (
      <DemoWrapper
        title="Nested Submenus"
        description="Context menu with nested submenu support."
        code={submenuCode}
      >
        <SubmenuDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "Icons",
    demo: (
      <DemoWrapper
        title="Icons & Shortcuts"
        description="Menu items with icons and keyboard shortcut hints."
        code={iconsCode}
      >
        <IconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "checkboxes",
    label: "Checkboxes",
    demo: (
      <DemoWrapper
        title="Checkbox Items"
        description="Toggle options with checkbox menu items."
        code={checkboxesCode}
      >
        <CheckboxesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "radio",
    label: "Radio",
    demo: (
      <DemoWrapper
        title="Radio Items"
        description="Single-select options with radio menu items."
        code={radioCode}
      >
        <RadioDemo />
      </DemoWrapper>
    ),
  },
];

export function ContextMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Context Menu"
        description="A menu displayed on right-click with icon support, destructive actions, submenus, and animations. Built on Base UI primitives with full keyboard navigation and WAI-ARIA support."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Import and compose the context menu components to build your menu structure."
      />

      <APIReference sections={apiSections} />
    </ComponentPage>
  );
}
