"use client";

import * as React from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";
import {
  IconFile,
  IconEdit,
  IconEye,
  IconUser,
  IconSettings,
  IconTrash,
  IconCopy,
  IconDownload,
  IconBold,
  IconItalic,
  IconUnderline,
  IconPalette,
} from "@tabler/icons-react";

export function MenubarPage() {
  const [radioValue, setRadioValue] = React.useState("andy");
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAsyncAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Menubar</h1>
        <p className="text-muted-foreground">
          A horizontal menu bar with dropdown menus, like in desktop applications.
          Now with enhanced features like icons, loading states, and focus styles.
        </p>
      </header>

      {/* Basic Menubar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Menubar
        </h2>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem icon={<IconFile className="h-4 w-4" />}>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem icon={<IconFile className="h-4 w-4" />}>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem icon={<IconCopy className="h-4 w-4" />}>
                Share
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem icon={<IconDownload className="h-4 w-4" />}>
                Print <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem icon={<IconEdit className="h-4 w-4" />}>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem icon={<IconEdit className="h-4 w-4" />}>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Paste <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
                Show Toolbar
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                Show Sidebar
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem icon={<IconEye className="h-4 w-4" />}>
                Enter Full Screen <MenubarShortcut>F11</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Profiles</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value={radioValue} onValueChange={setRadioValue}>
                <MenubarLabel>Switch Profile</MenubarLabel>
                <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarItem icon={<IconUser className="h-4 w-4" />}>
                Edit Profiles...
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
        <p className="text-sm text-muted-foreground">
          Menu items now support <code>icon</code> prop for visual indicators.
        </p>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Actions</MenubarTrigger>
            <MenubarContent>
              <MenubarItem icon={<IconFile className="h-4 w-4" />}>
                New File
              </MenubarItem>
              <MenubarItem icon={<IconSettings className="h-4 w-4" />}>
                Settings
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem icon={<IconUser className="h-4 w-4" />}>
                Profile
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* With Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Loading State
        </h2>
        <p className="text-sm text-muted-foreground">
          Async actions can display a loading spinner with <code>loading</code> prop.
        </p>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Async</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Normal Action</MenubarItem>
              <MenubarItem
                icon={<IconDownload className="h-4 w-4" />}
                loading={isLoading}
                onClick={handleAsyncAction}
              >
                {isLoading ? "Downloading..." : "Download"}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Another Action</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* With Destructive Items */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Destructive Items
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code>variant="destructive"</code> for dangerous actions like delete.
        </p>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Danger Zone</MenubarTrigger>
            <MenubarContent>
              <MenubarItem icon={<IconTrash className="h-4 w-4" />} variant="destructive">
                Delete Project
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Cancel</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* With Submenus */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Submenus
        </h2>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Format</MenubarTrigger>
            <MenubarContent>
              <MenubarItem icon={<IconBold className="h-4 w-4" />}>Bold</MenubarItem>
              <MenubarItem icon={<IconItalic className="h-4 w-4" />}>Italic</MenubarItem>
              <MenubarItem icon={<IconUnderline className="h-4 w-4" />}>
                Underline
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger icon={<IconPalette className="h-4 w-4" />}>
                  Text Color
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Red</MenubarItem>
                  <MenubarItem>Green</MenubarItem>
                  <MenubarItem>Blue</MenubarItem>
                  <MenubarItem>Black</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>Background</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Yellow</MenubarItem>
                  <MenubarItem>Light Blue</MenubarItem>
                  <MenubarItem>Light Green</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Icons:</strong> Add visual context with{" "}
            <code>icon</code> prop
          </li>
          <li>
            <strong className="text-foreground">Loading States:</strong>{" "}
            <code>loading</code> prop for async actions
          </li>
          <li>
            <strong className="text-foreground">Destructive Variant:</strong>{" "}
            <code>variant="destructive"</code> for dangerous actions
          </li>
          <li>
            <strong className="text-foreground">Focus Ring Styles:</strong> Visible
            focus indicators for accessibility
          </li>
          <li>
            <strong className="text-foreground">TypeScript Types:</strong> Fully typed
            props exported
          </li>
          <li>
            <strong className="text-foreground">forwardRef:</strong> Ref support on
            most components
          </li>
        </ul>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
{`import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<IconFile className="h-4 w-4" />}>
        New <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarItem variant="destructive" icon={<IconTrash className="h-4 w-4" />}>
        Delete
      </MenubarItem>
      <MenubarItem loading={isLoading} onClick={handleAction}>
        Async Action
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
