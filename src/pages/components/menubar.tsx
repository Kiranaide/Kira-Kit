"use client"

import * as React from "react"
import {
  IconFile,
  IconEdit,
  IconUser,
  IconSettings,
  IconTrash,
  IconCopy,
  IconDownload,
  IconBold,
  IconItalic,
  IconUnderline,
  IconPalette,
  IconChevronRight,
  IconKeyboard,
  IconCheck,
} from "@tabler/icons-react"

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
} from "@/components/ui/menubar"
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

function BasicDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
          <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Enter Full Screen <MenubarShortcut>F11</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Zoom In <MenubarShortcut>⌘+</MenubarShortcut></MenubarItem>
          <MenubarItem>Zoom Out <MenubarShortcut>⌘-</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const basicCode = `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar"

export function BasicMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`

function IconButtonsDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Actions</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<IconFile className="h-4 w-4" />}>
            New File
          </MenubarItem>
          <MenubarItem icon={<IconCopy className="h-4 w-4" />}>
            Duplicate
          </MenubarItem>
          <MenubarItem icon={<IconDownload className="h-4 w-4" />}>
            Download
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem icon={<IconSettings className="h-4 w-4" />}>
            Settings
          </MenubarItem>
          <MenubarItem icon={<IconUser className="h-4 w-4" />}>
            Profile
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<IconEdit className="h-4 w-4" />}>
            Edit
          </MenubarItem>
          <MenubarItem icon={<IconCopy className="h-4 w-4" />}>
            Copy
          </MenubarItem>
          <MenubarItem icon={<IconTrash className="h-4 w-4" />} variant="destructive">
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const iconButtonsCode = `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar"
import { IconFile, IconSettings, IconUser, IconTrash } from "@tabler/icons-react"

export function MenubarWithIcons() {
  return (
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
          <MenubarItem icon={<IconUser className="h-4 w-4" />}>
            Profile
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`

function CheckboxDemo() {
  const [showToolbar, setShowToolbar] = React.useState(true)
  const [showSidebar, setShowSidebar] = React.useState(false)
  const [showStatusBar, setShowStatusBar] = React.useState(true)

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Show Toolbar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
            Show Status Bar
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Preferences</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={true} onCheckedChange={() => {}}>
            Auto-save
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={false} onCheckedChange={() => {}}>
            Word Wrap
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={true} onCheckedChange={() => {}}>
            Line Numbers
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const checkboxCode = `import * as React from "react"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarCheckboxItem,
} from "@/components/ui/menubar"

export function MenubarWithCheckbox() {
  const [showToolbar, setShowToolbar] = React.useState(true)
  const [showSidebar, setShowSidebar] = React.useState(false)

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Show Toolbar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Show Sidebar
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`

function RadioDemo() {
  const [radioValue, setRadioValue] = React.useState("andy")

  return (
    <Menubar>
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

      <MenubarMenu>
        <MenubarTrigger>Theme</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={radioValue} onValueChange={setRadioValue}>
            <MenubarLabel>Color Scheme</MenubarLabel>
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const radioCode = `import * as React from "react"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarLabel,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
} from "@/components/ui/menubar"

export function MenubarWithRadio() {
  const [radioValue, setRadioValue] = React.useState("andy")

  return (
    <Menubar>
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
          <MenubarItem>Edit Profiles...</MenubarItem>
          </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`

function DropdownDemo() {
  return (
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

      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Image</MenubarItem>
          <MenubarItem>Link</MenubarItem>
          <MenubarItem>Table</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger icon={<IconChevronRight className="h-4 w-4" />}>
              Shapes
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Rectangle</MenubarItem>
              <MenubarItem>Circle</MenubarItem>
              <MenubarItem>Triangle</MenubarItem>
              <MenubarItem>Star</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const dropdownCode = `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarSeparator,
} from "@/components/ui/menubar"
import { IconBold, IconItalic, IconUnderline, IconPalette } from "@tabler/icons-react"

export function MenubarWithDropdown() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<IconBold className="h-4 w-4" />}>Bold</MenubarItem>
          <MenubarItem icon={<IconItalic className="h-4 w-4" />}>Italic</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger icon={<IconPalette className="h-4 w-4" />}>
              Text Color
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Red</MenubarItem>
              <MenubarItem>Green</MenubarItem>
              <MenubarItem>Blue</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`

export function MenubarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Menubar"
        description="A horizontal menu bar with dropdown menus, like in desktop applications. Features icons, checkbox items, radio groups, submenus, and full keyboard navigation."
        version="1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Icon Support",
            description: "Add visual context with icon prop on menu items for better UX.",
            icon: <IconKeyboard className="h-4 w-4" />,
          },
          {
            title: "Interactive Items",
            description: "Checkbox items and radio groups for toggleable options and selections.",
            icon: <IconCheck className="h-4 w-4" />,
          },
          {
            title: "Submenus",
            description: "Nested menu support with MenubarSub, MenubarSubTrigger, and MenubarSubContent.",
            icon: <IconChevronRight className="h-4 w-4" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          { value: "basic", label: "Basic", demo: <DemoWrapper title="Basic Menubar" description="A simple menubar with menus, items, separators, and keyboard shortcuts." code={basicCode}><BasicDemo /></DemoWrapper> },
          { value: "icons", label: "Icon Buttons", demo: <DemoWrapper title="With Icons" description="Menu items with icon prop for visual indicators and destructive variants." code={iconButtonsCode}><IconButtonsDemo /></DemoWrapper> },
          { value: "checkbox", label: "Checkbox", demo: <DemoWrapper title="Checkbox Items" description="Toggleable checkbox items for settings and preferences." code={checkboxCode}><CheckboxDemo /></DemoWrapper> },
          { value: "radio", label: "Radio", demo: <DemoWrapper title="Radio Groups" description="Radio group for selecting one option from multiple choices." code={radioCode}><RadioDemo /></DemoWrapper> },
          { value: "dropdown", label: "Dropdown", demo: <DemoWrapper title="Submenus" description="Create nested dropdown menus for hierarchical organization." code={dropdownCode}><DropdownDemo /></DemoWrapper> },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "↑ / ↓", description: "Navigate menu items" },
          { keys: "← / →", description: "Navigate between menus" },
          { keys: "Enter / Space", description: "Select menu item" },
          { keys: "Escape", description: "Close menu" },
          { keys: "Home / End", description: "Jump to first/last item" },
        ]}
      />

      <UsageBlock
        code={`import {
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
      <MenubarItem icon={<IconFile />}>
        New <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarItem variant="destructive" icon={<IconTrash />}>
        Delete
      </MenubarItem>
      <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
        Show Toolbar
      </MenubarCheckboxItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
      />

      <APIReference
        sections={[
          {
            title: "Menubar",
            props: [
              { prop: "className", type: "string", description: "Additional CSS classes for the menubar container." },
            ],
          },
          {
            title: "MenubarMenu",
            props: [
              { prop: "open", type: "boolean", description: "Whether the menu is currently open (controlled)." },
              { prop: "defaultOpen", type: "boolean", description: "Whether the menu is open by default." },
              { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback when menu open state changes." },
            ],
          },
          {
            title: "MenubarTrigger",
            props: [
              { prop: "className", type: "string", description: "Additional CSS classes for the trigger button." },
            ],
          },
          {
            title: "MenubarContent",
            props: [
              { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment of the menu relative to the trigger." },
              { prop: "alignOffset", type: "number", description: "Offset in pixels from the alignment edge." },
              { prop: "className", type: "string", description: "Additional CSS classes for the content container." },
            ],
          },
          {
            title: "MenubarItem",
            props: [
              { prop: "icon", type: "ReactNode", description: "Icon to display before the item text." },
              { prop: "variant", type: '"default" | "destructive"', default: '"default"', description: "Visual style variant for the item." },
              { prop: "disabled", type: "boolean", default: "false", description: "Disable interaction with this item." },
              { prop: "className", type: "string", description: "Additional CSS classes for the item." },
            ],
          },
          {
            title: "MenubarCheckboxItem",
            props: [
              { prop: "checked", type: "boolean", description: "Whether the checkbox is checked." },
              { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Callback when checked state changes." },
            ],
          },
          {
            title: "MenubarRadioGroup",
            props: [
              { prop: "value", type: "string", description: "The selected radio value." },
              { prop: "onValueChange", type: "(value: string) => void", description: "Callback when radio value changes." },
            ],
          },
          {
            title: "MenubarRadioItem",
            props: [
              { prop: "value", type: "string", description: "Unique value for this radio item." },
            ],
          },
          {
            title: "MenubarLabel",
            props: [
              { prop: "className", type: "string", description: "Additional CSS classes for the label." },
            ],
          },
          {
            title: "MenubarSub",
            props: [
              { prop: "open", type: "boolean", description: "Whether the submenu is open (controlled)." },
              { prop: "defaultOpen", type: "boolean", description: "Whether the submenu is open by default." },
              { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback when submenu open state changes." },
            ],
          },
          {
            title: "MenubarSubTrigger",
            props: [
              { prop: "icon", type: "ReactNode", description: "Icon to display before the trigger text." },
            ],
          },
          {
            title: "MenubarSubContent",
            props: [
              { prop: "alignOffset", type: "number", description: "Offset in pixels from the alignment edge." },
            ],
          },
          {
            title: "MenubarShortcut",
            props: [
              { prop: "className", type: "string", description: "Additional CSS classes for the shortcut text." },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
