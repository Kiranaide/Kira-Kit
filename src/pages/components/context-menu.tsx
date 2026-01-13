import * as React from "react";
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
  ContextMenuWithContent,
  ContextMenuArrow,
} from "@/components/ui/context-menu";
import {
  IconCopy,
  IconCut,
  IconClipboard,
  IconArrowBack,
  IconArrowForward,
  IconRefresh,
  IconDownload,
  IconPrinter,
  IconTrash,
  IconEdit,
  IconShare,
  IconStar,
  IconBookmark,
  IconSettings,
  IconFolder,
  IconFile,
  IconPlus,
  IconHeart,
} from "@tabler/icons-react";

export function ContextMenuPage() {
  const [radioValue, setRadioValue] = React.useState("name");
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showStatusBar, setShowStatusBar] = React.useState(false);
  const [multiSelectItems, setMultiSelectItems] = React.useState<string[]>([
    "item1",
  ]);

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
  };

  const toggleMultiSelect = (item: string) => {
    setMultiSelectItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Context Menu</h1>
        <p className="text-muted-foreground">
          A menu displayed on right-click with icon support, destructive
          actions, submenus, and animations.
        </p>
      </header>

      {/* Basic Context Menu */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Context Menu
        </h2>
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
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
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
      </section>

      {/* With Checkbox Items */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Checkbox Items
        </h2>
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
          Status: Toolbar: {showToolbar ? "On" : "Off"}, Sidebar:{" "}
          {showSidebar ? "On" : "Off"}, Status Bar:{" "}
          {showStatusBar ? "On" : "Off"}
        </p>
      </section>

      {/* With Radio Items */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Radio Items
        </h2>
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
      </section>

      {/* With Submenu */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Submenu
        </h2>
        <p className="text-sm text-muted-foreground">
          Submenus open on hover. Hover over the right arrow to see the submenu.
        </p>
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
      </section>

      {/* Destructive Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Destructive Actions
        </h2>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
            Right click for destructive actions
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem icon={<IconEdit />}>Rename</ContextMenuItem>
            <ContextMenuItem icon={<IconCopy />}>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" icon={<IconTrash />}>
              Delete
            </ContextMenuItem>
            <ContextMenuItem variant="destructive" icon={<IconTrash />}>
              Delete Permanently
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
            Right click to see loading state
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem icon={<IconFile />}>Open File</ContextMenuItem>
            <ContextMenuItem icon={<IconDownload />}>Download</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem loading>Processing...</ContextMenuItem>
            <ContextMenuItem icon={<IconSettings />}>Settings</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>

      {/* With Arrow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Arrow
        </h2>
        <p className="text-sm text-muted-foreground">
          Context menu with an arrow pointing to the click position.
        </p>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
            Right click for menu with arrow
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuArrow />
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
      </section>

      {/* closeOnClick Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Multi-Select (closeOnClick: false)
        </h2>
        <p className="text-sm text-muted-foreground">
          Items with <code className="bg-muted px-1 rounded">closeOnClick=false</code>{" "}
          don't close the menu when clicked. Useful for multi-select patterns.
        </p>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
            Right click for multi-select
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Select multiple items:</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={multiSelectItems.includes("item1")}
              onCheckedChange={() => toggleMultiSelect("item1")}
              closeOnClick={false}
            >
              Item 1
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={multiSelectItems.includes("item2")}
              onCheckedChange={() => toggleMultiSelect("item2")}
              closeOnClick={false}
            >
              Item 2
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={multiSelectItems.includes("item3")}
              onCheckedChange={() => toggleMultiSelect("item3")}
              closeOnClick={false}
            >
              Item 3
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Apply Selection</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <p className="text-sm text-muted-foreground">
          Selected: {multiSelectItems.length > 0 ? multiSelectItems.join(", ") : "None"}
        </p>
      </section>

      {/* ContextMenuWithContent */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Convenience Wrapper (ContextMenuWithContent)
        </h2>
        <p className="text-sm text-muted-foreground">
          A simplified wrapper for quick context menus without nested
          components.
        </p>
        <ContextMenuWithContent
          trigger={
            <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
              Right click for quick menu
            </div>
          }
        >
          <ContextMenuItem icon={<IconCopy />} shortcut="⌘C">
            Copy
          </ContextMenuItem>
          <ContextMenuItem icon={<IconCut />} shortcut="⌘X">
            Cut
          </ContextMenuItem>
          <ContextMenuItem icon={<IconClipboard />}>Paste</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem icon={<IconTrash />} variant="destructive">
            Delete
          </ContextMenuItem>
        </ContextMenuWithContent>
      </section>

      {/* Rich Context Menu Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Rich Context Menu Example
        </h2>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border text-sm hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="text-center">
              <p>Rich Context Menu Demo</p>
              <p className="text-muted-foreground text-sm mt-1">
                Right click anywhere
              </p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuLabel inset>File</ContextMenuLabel>
              <ContextMenuItem icon={<IconFile />} shortcut="⌘N">
                New
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
              <ContextMenuSeparator />
              <ContextMenuItem
                icon={<IconTrash />}
                variant="destructive"
                shortcut="⌫"
              >
                Delete
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuLabel inset>View</ContextMenuLabel>
              <ContextMenuCheckboxItem
                checked={showToolbar}
                onCheckedChange={setShowToolbar}
              >
                Toolbar
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem
                checked={showSidebar}
                onCheckedChange={setShowSidebar}
              >
                Sidebar
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Status Bar
              </ContextMenuCheckboxItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>Sort By</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuRadioGroup
                  value={radioValue}
                  onValueChange={setRadioValue}
                >
                  <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="type">Type</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem icon={<IconSettings />}>Settings</ContextMenuItem>
            <ContextMenuItem icon={<IconHeart />}>Favorites</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
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
import { IconCopy, IconTrash } from "@tabler/icons-react"

// Basic usage
<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem icon={<IconCopy />} shortcut="⌘C">Copy</ContextMenuItem>
    <ContextMenuItem variant="destructive" icon={<IconTrash />}>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

// With submenu
<ContextMenu>
  <ContextMenuTrigger>Open menu</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Action</ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Submenu</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Sub Action</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>

// With arrow
<ContextMenu>
  <ContextMenuTrigger>Open menu</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuArrow />
    <ContextMenuItem>Action</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

// Multi-select pattern (closeOnClick={false})
<ContextMenu>
  <ContextMenuTrigger>Select items</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuCheckboxItem closeOnClick={false}>
      Item 1
    </ContextMenuCheckboxItem>
    <ContextMenuCheckboxItem closeOnClick={false}>
      Item 2
    </ContextMenuCheckboxItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Apply</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

// Quick wrapper
<ContextMenuWithContent trigger={<div>Click me</div>}>
  <ContextMenuItem>Action 1</ContextMenuItem>
  <ContextMenuItem>Action 2</ContextMenuItem>
</ContextMenuWithContent>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
