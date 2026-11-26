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

function BasicDemo() {
  const [lastAction, setLastAction] = React.useState(
    "Right click or press Shift+F10 to open the menu.",
  );

  return (
    <div className="space-y-3">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            icon={<IconArrowBack aria-hidden="true" />}
            shortcut="⌘["
            onClick={() => setLastAction("Selected: Back")}
          >
            Back
          </ContextMenuItem>
          <ContextMenuItem
            icon={<IconArrowForward aria-hidden="true" />}
            shortcut="⌘]"
            disabled
          >
            Forward
          </ContextMenuItem>
          <ContextMenuItem
            icon={<IconRefresh aria-hidden="true" />}
            shortcut="⌘R"
            onClick={() => setLastAction("Selected: Reload")}
          >
            Reload
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            icon={<IconDownload aria-hidden="true" />}
            shortcut="⌘S"
            onClick={() => setLastAction("Selected: Save Page As...")}
          >
            Save Page As...
          </ContextMenuItem>
          <ContextMenuItem
            icon={<IconPrinter aria-hidden="true" />}
            onClick={() => setLastAction("Selected: Print...")}
          >
            Print...
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <output className="block text-sm text-muted-foreground">
        {lastAction}
      </output>
    </div>
  );
}

const basicCode = `import * as React from "react";
import {
  IconArrowBack,
  IconArrowForward,
  IconRefresh,
  IconDownload,
  IconPrinter,
} from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

export function BasicDemo() {
  const [lastAction, setLastAction] = React.useState(
    "Right click or press Shift+F10 to open the menu.",
  );

  return (
    <div className="space-y-3">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            icon={<IconArrowBack aria-hidden="true" />}
            shortcut="⌘["
            onClick={() => setLastAction("Selected: Back")}
          >
            Back
          </ContextMenuItem>
          <ContextMenuItem
            icon={<IconArrowForward aria-hidden="true" />}
            shortcut="⌘]"
            disabled
          >
            Forward
          </ContextMenuItem>
          <ContextMenuItem
            icon={<IconRefresh aria-hidden="true" />}
            shortcut="⌘R"
            onClick={() => setLastAction("Selected: Reload")}
          >
            Reload
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            icon={<IconDownload aria-hidden="true" />}
            shortcut="⌘S"
            onClick={() => setLastAction("Selected: Save Page As...")}
          >
            Save Page As...
          </ContextMenuItem>
          <ContextMenuItem
            icon={<IconPrinter aria-hidden="true" />}
            onClick={() => setLastAction("Selected: Print...")}
          >
            Print...
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <output className="block text-sm text-muted-foreground">
        {lastAction}
      </output>
    </div>
  );
}`;

function SubmenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
        Right click for nested menus
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile aria-hidden="true" />}>
          Open
        </ContextMenuItem>
        <ContextMenuItem icon={<IconFolder aria-hidden="true" />}>
          Open With
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Get Up!</ContextMenuItem>
            <ContextMenuItem>Inside Out</ContextMenuItem>
            <ContextMenuItem>Night Beats</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem icon={<IconPlus aria-hidden="true" />}>
              New playlist...
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem icon={<IconShare aria-hidden="true" />}>
              Share via Email
            </ContextMenuItem>
            <ContextMenuItem icon={<IconShare aria-hidden="true" />}>
              Share on Twitter
            </ContextMenuItem>
            <ContextMenuItem icon={<IconShare aria-hidden="true" />}>
              Copy Link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconBookmark aria-hidden="true" />}>
          Add to Library
        </ContextMenuItem>
        <ContextMenuItem icon={<IconStar aria-hidden="true" />}>
          Add to Favorites
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const submenuCode = `import {
  IconFile,
  IconFolder,
  IconPlus,
  IconShare,
  IconBookmark,
  IconStar,
} from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

export function SubmenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
        Right click for nested menus
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile aria-hidden="true" />}>Open</ContextMenuItem>
        <ContextMenuItem icon={<IconFolder aria-hidden="true" />}>Open With</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Get Up!</ContextMenuItem>
            <ContextMenuItem>Inside Out</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem icon={<IconPlus aria-hidden="true" />}>New playlist...</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem icon={<IconShare aria-hidden="true" />}>Share via Email</ContextMenuItem>
            <ContextMenuItem icon={<IconShare aria-hidden="true" />}>Copy Link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconBookmark aria-hidden="true" />}>Add to Library</ContextMenuItem>
        <ContextMenuItem icon={<IconStar aria-hidden="true" />}>Add to Favorites</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`;

function IconsDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
        Right click for file options
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile aria-hidden="true" />} shortcut="⌘N">
          New File
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconFolder aria-hidden="true" />}
          shortcut="⌘⇧N"
        >
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconCopy aria-hidden="true" />} shortcut="⌘C">
          Copy
        </ContextMenuItem>
        <ContextMenuItem icon={<IconCut aria-hidden="true" />} shortcut="⌘X">
          Cut
        </ContextMenuItem>
        <ContextMenuItem
          icon={<IconClipboard aria-hidden="true" />}
          shortcut="⌘V"
        >
          Paste
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const iconsCode = `import {
  IconFile,
  IconFolder,
  IconCopy,
  IconCut,
  IconClipboard,
} from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

export function IconsDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
        Right click for file options
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconFile aria-hidden="true" />} shortcut="⌘N">New File</ContextMenuItem>
        <ContextMenuItem icon={<IconFolder aria-hidden="true" />} shortcut="⌘⇧N">New Folder</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconCopy aria-hidden="true" />} shortcut="⌘C">Copy</ContextMenuItem>
        <ContextMenuItem icon={<IconCut aria-hidden="true" />} shortcut="⌘X">Cut</ContextMenuItem>
        <ContextMenuItem icon={<IconClipboard aria-hidden="true" />} shortcut="⌘V">Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`;

function CheckboxesDemo() {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showStatusBar, setShowStatusBar] = React.useState(false);

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
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
      <output className="block text-sm text-muted-foreground">
        Status: Toolbar: {showToolbar ? "On" : "Off"}, Sidebar:{" "}
        {showSidebar ? "On" : "Off"}, Status Bar: {showStatusBar ? "On" : "Off"}
      </output>
    </div>
  );
}

const checkboxesCode = `import * as React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";

export function CheckboxesDemo() {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showStatusBar, setShowStatusBar] = React.useState(false);

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
          Right click for view options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Show Toolbar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Show Sidebar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
            Show Status Bar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
      <output className="block text-sm text-muted-foreground">
        Status: Toolbar: {showToolbar ? "On" : "Off"}, Sidebar: {showSidebar ? "On" : "Off"}, Status Bar: {showStatusBar ? "On" : "Off"}
      </output>
    </div>
  );
}`;

function RadioDemo() {
  const [radioValue, setRadioValue] = React.useState("name");

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
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
      <output className="block text-sm text-muted-foreground">
        Sorted by: {radioValue}
      </output>
    </div>
  );
}

const radioCode = `import * as React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu";

export function RadioDemo() {
  const [radioValue, setRadioValue] = React.useState("name");

  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 motion-safe:transition-colors">
          Right click for sorting options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel inset>Sort By</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
              <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
              <ContextMenuRadioItem value="date">Date Modified</ContextMenuRadioItem>
              <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
              <ContextMenuRadioItem value="type">Type</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <output className="block text-sm text-muted-foreground">
        Sorted by: {radioValue}
      </output>
    </div>
  );
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

const linksCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLinkItem,
} from "@/components/ui/context-menu";

export function LinksDemo() {
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
}`;

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
            icon: <IconDownload aria-hidden="true" />,
            errorMessage: "Export failed. Select Export report to retry.",
            onSelect: async ({ signal }) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 900);
              });

              if (signal.aborted) return;
              attempts.current += 1;

              if (attempts.current === 1) throw new Error("Demo failure");
              setResult("Report exported.");
            },
          },
        ]}
      />
      <output className="block text-sm text-muted-foreground">
        {result} First attempt fails; retry succeeds. Escape cancels pending UI
        work.
      </output>
    </div>
  );
}

const featuresCode = `import * as React from "react";
import { IconDownload } from "@tabler/icons-react";
import { KiraContextMenu } from "@/components/ui/context-menu";

export function FeaturesDemo() {
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
            icon: <IconDownload aria-hidden="true" />,
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
      <output className="block text-sm text-muted-foreground">
        {result} First attempt fails; retry succeeds.
      </output>
    </div>
  );
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

const disabledReasonCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

export function DisabledReasonDemo() {
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
}`;

function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <ContextMenu>
        <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">
          Long labels, links, and disabled explanations
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

const stressCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLinkItem,
  KiraContextMenu,
} from "@/components/ui/context-menu";

export function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <ContextMenu>
        <ContextMenuTrigger className="rounded-lg border border-dashed p-4 text-sm">
          Long labels, links, and disabled explanations
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
}`;

const usageCode = `import * as React from "react";
import { IconDownload } from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuBackdrop,
  ContextMenuContent,
  ContextMenuArrow,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
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
            <ContextMenuItem icon={<IconDownload aria-hidden="true" />} onClick={() => window.print()}>
              Print report <ContextMenuShortcut>Ctrl+P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuLinkItem href="https://base-ui.com">Documentation</ContextMenuLinkItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
            Show details
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value={view} onValueChange={setView}>
            <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
            <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => window.print()}>Print</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
      <KiraContextMenu
        trigger="Print actions"
        items={[{ type: "action", id: "print", label: "Print report", onSelect: () => window.print() }]}
      />
    </>
  );
}`;

export default function ContextMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Context Menu"
        description="A menu displayed on right-click with icon support, destructive actions, submenus, and animations. Built on Base UI primitives with full keyboard navigation and WAI-ARIA support."
        version="v2.0.1"
      />

      <FeatureGrid
        features={contextMenuPageFeatures}
        description="Accessible context menus with keyboard triggers, native links, and async action recovery."
      />

      <DemoTabs tabs={contextMenuPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={contextMenuPageShortcuts}
        description="Keyboard navigation inherited from Base UI plus Kira trigger and cancellation bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and compose the context menu primitives or use KiraContextMenu for async action lists."
        notes={contextMenuUsageNotes}
      />

      <APIReference
        sections={contextMenuPageAPISections}
        description="Props, types, and defaults for every exported ContextMenu primitive, wrapper, and variant helper."
      />

      <Changelog
        entries={contextMenuPageChangelogEntries}
        title="Changelog"
        description="Version history for Context Menu."
      />
    </ComponentPage>
  );
}

const contextMenuUsageNotes = [
  {
    label: "KiraContextMenu",
    body: "Use KiraContextMenu with items for single-flight async actions with pending spinners, visible error messages, retry, and Escape cancellation.",
  },
  {
    label: "Keyboard opening",
    body: "ContextMenuTrigger is focusable by default (tabIndex={0}) and opens on Shift+F10 or the Context Menu key in addition to right-click and long press.",
  },
  {
    label: "ContextMenuWithContent",
    body: "Deprecated alias for KiraContextMenu. Prefer KiraContextMenu for all new code.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const contextMenuPageFeatures = [
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA menu pattern with keyboard navigation, focus management, and screen reader support.",
    icon: <IconKeyboard aria-hidden="true" className="size-4" />,
  },
  {
    title: "Composable",
    description:
      "Build complex menus with checkboxes, radio groups, submenus, icons, and keyboard shortcuts.",
    icon: <IconComponents aria-hidden="true" className="size-4" />,
  },
  {
    title: "Flexible",
    description:
      "Async actions with pending feedback, failure messages, retry and cancellation through KiraContextMenu.",
    icon: <IconMenu2 aria-hidden="true" className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const contextMenuPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    value: "features",
    label: "Kira Context Menu",
    group: "KiraContextMenu",
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
    value: "reasons",
    label: "Disabled Reasons",
    group: "Behavior",
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
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Narrow max-w-xs surface, long multilingual labels, disabled reason, native link, and empty list."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const contextMenuPageShortcuts = [
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
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const contextMenuPageAPISections = [
  {
    title: "ContextMenu",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "-",
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
        default: "-",
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
        default: "-",
        description: "Base UI polymorphism; no asChild prop.",
      },
      {
        prop: "tabIndex",
        type: "number",
        default: "0",
        description: "Focusable trigger for Shift+F10 / Context Menu opening.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the trigger element.",
      },
    ],
  },
  {
    title: "ContextMenuBackdrop",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the backdrop overlay.",
      },
      {
        prop: "render",
        type: "ReactElement | render function",
        default: "-",
        description: "Base UI polymorphism for the backdrop element.",
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
        description:
          "Alignment of the menu relative to the pointer or trigger.",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: "-",
        description: "Preferred side of the trigger to render the menu.",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "4",
        description: "Distance from the trigger in pixels.",
      },
      {
        prop: "alignOffset",
        type: "number",
        default: "0",
        description: "Offset along the alignment axis in pixels.",
      },
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description: "Keep the menu portal mounted in the DOM when closed.",
      },
      {
        prop: "showBackdrop",
        type: "boolean",
        default: "false",
        description: "Render ContextMenuBackdrop behind the open menu.",
      },
      {
        prop: "portalProps / positionerProps",
        type: "ContextMenuContentProps['portalProps'] / ContextMenuContentProps['positionerProps']",
        default: "-",
        description:
          "Forwarded Base UI Portal and Positioner props (collisionPadding defaults to 8).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the popup surface.",
      },
    ],
  },
  {
    title: "ContextMenuArrow",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the directional arrow.",
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
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Indent label to align with indicator-column items.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "-",
        description: "Icon to display before the item text.",
      },
      {
        prop: "shortcut",
        type: "string",
        default: "-",
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
        prop: "disabledReason",
        type: "string",
        default: "-",
        description:
          "Visible explanation rendered inside the disabled row; keyboard and touch reachable.",
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
    title: "ContextMenuLinkItem",
    props: [
      {
        prop: "href",
        type: "string",
        default: "-",
        description: "Native anchor destination with modifier-click support.",
      },
      {
        prop: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "Visual variant of the link row.",
      },
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Indent label to align with indicator-column items.",
      },
      {
        prop: "icon / shortcut",
        type: "ReactNode / string",
        default: "-",
        description: "Optional leading icon and trailing shortcut hint.",
      },
      {
        prop: "target / rel",
        type: "string",
        default: "-",
        description: "Native anchor navigation attributes.",
      },
    ],
  },
  {
    title: "ContextMenuCheckboxItem",
    props: [
      {
        prop: "checked",
        type: "boolean",
        default: "-",
        description: "Controlled checked state.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean) => void",
        default: "-",
        description: "Callback when checked state changes.",
      },
      {
        prop: "icon / iconChecked",
        type: "ReactNode",
        default: "-",
        description: "Optional leading icon and custom checked indicator.",
      },
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Applies inset alignment.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        default: "false / -",
        description: "Disable the item and optionally display why.",
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
        default: "-",
        description: "Currently selected value.",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        default: "-",
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
        default: "-",
        description: "Value of this radio item.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "-",
        description: "Icon to display before the item text.",
      },
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Applies inset alignment.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        default: "false / -",
        description: "Disable the radio item and optionally display why.",
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
    title: "ContextMenuSeparator",
    props: [
      {
        prop: "render",
        type: "ReactElement | render function",
        default: "-",
        description: "Base UI polymorphism.",
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
    title: "ContextMenuGroup",
    props: [
      {
        prop: "render",
        type: "ReactElement | render function",
        default: "-",
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
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "ContextMenuShortcut",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Trailing keyboard shortcut display text.",
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
    title: "ContextMenuSub",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "-",
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
        default: "-",
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
        default: "-",
        description: "Icon to display before the item text.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        default: "false / -",
        description: "Disable the submenu trigger and optionally display why.",
      },
    ],
  },
  {
    title: "ContextMenuSubContent",
    props: [
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment along the submenu axis.",
      },
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
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the submenu popup.",
      },
    ],
  },
  {
    title: "KiraContextMenu",
    props: [
      {
        prop: "trigger",
        type: "ReactNode",
        default: "-",
        description:
          "Focusable target; right click, long press or Shift+F10 opens it.",
      },
      {
        prop: "items",
        type: "readonly MenuActionItem[]",
        default: "-",
        description:
          "Actions with stable unique IDs and onSelect({ signal }); omit to compose children.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Custom menu items rendered when items is omitted.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "CSS classes applied to the trigger wrapper.",
      },
      {
        prop: "contentProps",
        type: "Omit<ContextMenuContentProps, 'children'>",
        default: "-",
        description: "Props forwarded to ContextMenuContent.",
      },
      {
        prop: "onActionError",
        type: "(error: unknown, item: MenuActionItem) => void",
        default: "-",
        description:
          "Optional error reporting. Failed actions remain open for retry.",
      },
    ],
  },
  {
    title: "ContextMenuWithContent",
    props: [
      {
        prop: "trigger",
        type: "ReactNode",
        default: "-",
        description:
          "Deprecated alias for KiraContextMenu. Element to use as the menu trigger.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Menu items to render inside the content.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "CSS classes applied to the trigger wrapper.",
      },
      {
        prop: "contentProps",
        type: "Omit<ContextMenuContentProps, 'children'>",
        default: "-",
        description: "Props to pass to ContextMenuContent.",
      },
    ],
  },
  {
    title: "Variant exports",
    props: [
      {
        prop: "contextMenuContentVariants",
        type: "cva",
        default: "-",
        description: "Popup surface classes shared with DropdownMenuContent.",
      },
      {
        prop: "contextMenuItemVariants",
        type: "cva",
        default: "-",
        description: "Row surface classes shared with DropdownMenuItem.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const contextMenuPageChangelogEntries = [
  {
    version: "2.0.1",
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
    version: "2.0.0",
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
