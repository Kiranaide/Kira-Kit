"use client";

import type { ComponentProps as ReactComponentProps } from "react";
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
  KiraContextMenu,
  ContextMenuLinkItem,
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
  Changelog,
} from "@/components/docs";

function FeaturesDemo() {
  const attempts = React.useRef(0);
  const [result, setResult] = React.useState("No export yet.");

  return (
    <div className="w-full space-y-3">
      <KiraContextMenu
        trigger="Right click, long press, or focus and press Shift+F10 to export"
        className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border p-4 text-center text-sm"
        items={[
          {
            type: "action",
            id: "export",
            label: "Export report",
            icon: <IconDownload />,
            errorMessage: "Export failed. Select Export report to retry.",
            onSelect: async ({ signal }) => {
              await new Promise((resolve) => setTimeout(resolve, 900));

              if (signal.aborted) return;
              attempts.current += 1;

              if (attempts.current === 1) throw new Error("Demo failure");
              setResult("Report exported.");
            },
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        {result} First attempt fails; retry succeeds. Escape cancels pending UI
        work.
      </p>
    </div>
  );
}

const featuresCode = `import * as React from "react";
import { KiraContextMenu } from "@/components/ui/context-menu"
import { IconDownload } from "@tabler/icons-react"

function FeaturesDemo() {
  const attempts = React.useRef(0);
  const [result, setResult] = React.useState("No export yet.");
  return <div className="w-full space-y-3">
    <KiraContextMenu trigger="Right click, long press, or focus and press Shift+F10 to export"
      className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border p-4 text-center text-sm"
      items={[
        { type: "action", id: "export", label: "Export report", icon: <IconDownload />, errorMessage: "Export failed. Select Export report to retry.", onSelect: async ({ signal }) => {
          await new Promise((resolve) => setTimeout(resolve, 900));
          if (signal.aborted) return;
          attempts.current += 1;
          if (attempts.current === 1) throw new Error("Demo failure");
          setResult("Report exported.");
        } },
      ]} />
    <p className="text-sm text-muted-foreground">{result} First attempt fails; retry succeeds. Escape cancels pending UI work.</p>
  </div>;
}`;

function LinksDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">
        Documentation links
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLinkItem
          href="https://base-ui.com/react/components/context-menu"
          target="_blank"
        >
          Open Base UI docs
        </ContextMenuLinkItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const linksCode = `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuLinkItem } from "@/components/ui/context-menu"

function LinksDemo() {
  return <ContextMenu>
    <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">Documentation links</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLinkItem href="https://base-ui.com/react/components/context-menu" target="_blank">Open Base UI docs</ContextMenuLinkItem>
    </ContextMenuContent>
  </ContextMenu>;
}`;

function DisabledReasonDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">
        Restricted report actions
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          disabled
          disabledReason="Only the owner can delete this report."
        >
          Delete report
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const disabledReasonCode = `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"

function DisabledReasonDemo() {
  return <ContextMenu>
    <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">Restricted report actions</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem disabled disabledReason="Only the owner can delete this report.">Delete report</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>;
}`;

function ShowcaseDemo() {
  return (
    <div className="w-full max-w-64 space-y-4">
      <ContextMenu>
        <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">
          Long labels, links and disabled explanations
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem>
            A very long action label for a report named 年次レポート-2026-🌍
          </ContextMenuItem>
          <ContextMenuItem
            disabled
            disabledReason="Request access from your workspace owner."
          >
            Restricted action
          </ContextMenuItem>
          <ContextMenuLinkItem
            href="https://base-ui.com/react/components/context-menu"
            target="_blank"
          >
            Open Base UI docs
          </ContextMenuLinkItem>
        </ContextMenuContent>
      </ContextMenu>
      <KiraContextMenu
        trigger="Empty action list"
        items={[]}
        className="rounded-lg border border-dashed p-4 text-sm"
      />
    </div>
  );
}

const showcaseCode = `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuLinkItem, KiraContextMenu } from "@/components/ui/context-menu"

function ShowcaseDemo() {
  return <div className="w-full max-w-64 space-y-4">
    <ContextMenu>
      <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">Long labels, links and disabled explanations</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>A very long action label for a report named 年次レポート-2026-🌍</ContextMenuItem>
        <ContextMenuItem disabled disabledReason="Request access from your workspace owner.">Restricted action</ContextMenuItem>
        <ContextMenuLinkItem href="https://base-ui.com/react/components/context-menu" target="_blank">Open Base UI docs</ContextMenuLinkItem>
      </ContextMenuContent>
    </ContextMenu>
    <KiraContextMenu trigger="Empty action list" items={[]} className="rounded-lg border border-dashed p-4 text-sm" />
  </div>;
}`;

function BasicDemo() {
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
        <ContextMenuItem icon={<IconArrowForward />} shortcut="⌘]" disabled>
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
        {showSidebar ? "On" : "Off"}, Status Bar: {showStatusBar ? "On" : "Off"}
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
      "Async actions with pending feedback, failure messages, retry and cancellation through KiraContextMenu.",
    icon: <IconMenu2 className="h-4 w-4" />,
  },
];

const keyboardShortcuts = [
  {
    keys: "Shift+F10 / Context Menu",
    description: "Kira addition: open from the focused trigger.",
  },
  {
    keys: "Enter / Space",
    description: "Inherited from Base UI: activate the selected item.",
  },
  {
    keys: "Arrow Down",
    description: "Inherited from Base UI: move to the next item.",
  },
  {
    keys: "Arrow Up",
    description: "Inherited from Base UI: move to the previous item.",
  },
  {
    keys: "Arrow Right",
    description: "Inherited from Base UI: open a submenu.",
  },
  {
    keys: "Arrow Left",
    description: "Inherited from Base UI: close a submenu.",
  },
  {
    keys: "Escape",
    description:
      "Inherited from Base UI: close the menu. Kira addition: cancel a pending action.",
  },
  {
    keys: "Home",
    description: "Inherited from Base UI: move to the first item.",
  },
  {
    keys: "End",
    description: "Inherited from Base UI: move to the last item.",
  },
];

const usageCode = `import * as React from "react";
import { IconDownload } from "@tabler/icons-react";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuBackdrop, ContextMenuContent,
  ContextMenuArrow, ContextMenuItem, ContextMenuLinkItem, ContextMenuShortcut,
  ContextMenuSeparator, ContextMenuCheckboxItem, ContextMenuRadioGroup,
  ContextMenuRadioItem, ContextMenuGroup, ContextMenuLabel, ContextMenuSub,
  ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuWithContent,
  KiraContextMenu,
} from "@/components/ui/context-menu";

export function ContextMenuUsage() {
  const [checked, setChecked] = React.useState(false);
  const [view, setView] = React.useState("list");
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>Report actions</ContextMenuTrigger>
        <ContextMenuBackdrop />
        <ContextMenuContent>
          <ContextMenuArrow />
          <ContextMenuGroup>
            <ContextMenuLabel>Report</ContextMenuLabel>
            <ContextMenuItem icon={<IconDownload />} onClick={() => window.print()}>
              Print report <ContextMenuShortcut>Ctrl+P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuLinkItem href="https://base-ui.com">Documentation</ContextMenuLinkItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>Show details</ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value={view} onValueChange={setView}>
            <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
            <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
            <ContextMenuSubContent><ContextMenuItem onClick={() => window.print()}>Print</ContextMenuItem></ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
      <KiraContextMenu trigger="Print actions" items={[{ type: "action", id: "print", label: "Print report", onSelect: () => window.print() }]} />
      {/* Deprecated alias; prefer KiraContextMenu for new code. */}
      <ContextMenuWithContent trigger="Legacy report"><ContextMenuItem onClick={() => window.print()}>Print</ContextMenuItem></ContextMenuWithContent>
    </>
  );
}`;

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
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables context-menu opening at the root.",
      },
    ],
  },
  {
    title: "ContextMenuTrigger",
    props: [
      {
        prop: "render",
        type: "ReactElement | render function",
        description: "Base UI polymorphism; no asChild prop.",
      },
      {
        prop: "tabIndex",
        type: "number",
        default: "0",
        description: "Focusable trigger for Shift+F10 / Context Menu opening.",
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
        prop: "render",
        type: "ReactElement | render function",
        description: "Base UI polymorphism.",
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
        default: "0",
        description:
          "Offset along the align axis; viewport collision padding is 8px.",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "4",
        description: "Distance from the parent row.",
      },
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description: "Keep the submenu portal mounted when closed.",
      },
    ],
  },
  {
    title: "ContextMenuGroup",
    props: [
      {
        prop: "render",
        type: "ReactElement | render function",
        description: "Base UI polymorphism.",
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
  {
    value: "links",
    label: "Links",
    demo: (
      <DemoWrapper
        title="Native links"
        description="Real anchors preserve modifier-click and browser navigation."
        code={linksCode}
      >
        <LinksDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "reasons",
    label: "Disabled Reasons",
    demo: (
      <DemoWrapper
        title="Why an action is unavailable"
        description="The explanation stays visible on keyboard and touch, not just hover."
        code={disabledReasonCode}
      >
        <DisabledReasonDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "features",
    label: "Kira Context Menu",
    demo: (
      <DemoWrapper
        title="Async contextual actions"
        description="Single-flight actions, visible failure, retry and Escape cancellation. Local illustrative export fixture."
        code={featuresCode}
      >
        <FeaturesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "showcase",
    label: "States",
    demo: (
      <DemoWrapper
        title="Stress cases"
        description="Narrow surface, long multilingual labels, native link and empty list."
        code={showcaseCode}
      >
        <ShowcaseDemo />
      </DemoWrapper>
    ),
  },
];

export default function ContextMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Context Menu"
        description="A menu displayed on right-click with icon support, destructive actions, submenus, and animations. Built on Base UI primitives with full keyboard navigation and WAI-ARIA support."
        version="v2.0.1"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Import and compose the context menu components to build your menu structure."
      />

      <APIReference sections={contextMenuPageAPIReferenceSections} />

      <Changelog entries={contextMenuPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const contextMenuPageAPIReferenceSections = [
  ...apiSections,
  {
    title: "KiraContextMenu",
    props: [
      {
        prop: "trigger",
        type: "ReactNode",
        description:
          "Focusable target; right click, long press or Shift+F10 opens it.",
      },
      {
        prop: "items",
        type: "readonly MenuActionItem[]",
        description:
          "Actions with stable unique IDs and onSelect({ signal }); omit to compose children.",
      },
      {
        prop: "onActionError",
        type: "(error, item) => void",
        description:
          "Optional error reporting. Failed actions remain open for retry.",
      },
    ],
  },
  {
    title: "ContextMenuLinkItem",
    props: [
      {
        prop: "href",
        type: "string",
        description: "Native anchor destination with modifier-click support.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const contextMenuPageChangelogEntries = [
  {
    version: "v2.0.1",
    date: "11 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Demo page follows the accordion structure",
        description:
          "Basic comes first, feature and Kira examples have focused tabs, and Changelog follows API Reference. Audited against Base UI 1.9.0; no component API changes.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "31 October 2026",
    changes: [
      {
        type: "added",
        title: "KiraContextMenu async actions and native link rows",
      },
      {
        type: "fixed",
        title:
          "Keyboard opening, focus rings, constrained popups and reduced-motion exits",
      },
      {
        type: "changed",
        title:
          "Rows reuse dropdown primitives and styles; ContextMenuWithContent remains an alias",
      },
      {
        type: "breaking",
        title:
          "Use Base UI render instead of asChild; disabled belongs on ContextMenu root",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const handleAction = (action: string) => {
  console.log(`Action: ${action}`);
};
