"use client";

import * as React from "react";
import {
  IconMenu2,
  IconKeyboard,
  IconComponents,
  IconUser,
  IconSettings,
  IconLogout,
  IconCopy,
  IconTrash,
  IconCheck,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
  IconPlus,
  IconDownload,
  IconDotsVertical,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuWithContent,
  DropdownMenuArrow,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconUser className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconSettings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const basicCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconUser, IconSettings, IconLogout } from "@tabler/icons-react"

export function BasicDropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconUser className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconLogout className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function IconTriggerDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
          <IconDotsVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconTrash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const iconTriggerCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical, IconTrash } from "@tabler/icons-react"

export function IconTriggerDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <IconDotsVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function ShortcutsDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          File
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem icon={<IconPlus />} shortcut="⌘N">
              New File
            </DropdownMenuItem>
            <DropdownMenuItem icon={<IconCopy />} shortcut="⌘D">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<IconDownload />} shortcut="⌘S">
              Save
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const shortcutsCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconPlus, IconCopy, IconDownload } from "@tabler/icons-react"

export function ShortcutsDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        File
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem icon={<IconPlus />} shortcut="⌘N">
            New File
          </DropdownMenuItem>
          <DropdownMenuItem icon={<IconCopy />} shortcut="⌘D">
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconDownload />} shortcut="⌘S">
            Save
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function CheckboxDemo() {
  const [checkbox1, setCheckbox1] = React.useState(true);
  const [checkbox2, setCheckbox2] = React.useState(false);

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Preferences
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>View Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={checkbox1}
            onCheckedChange={setCheckbox1}
            icon={<IconCheck />}
          >
            Show Toolbar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={checkbox2}
            onCheckedChange={setCheckbox2}
            icon={<IconCheck />}
          >
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={true}
            onCheckedChange={() => {}}
            icon={<IconCheck />}
            disabled
          >
            Disabled Option
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const checkboxCode = `import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconCheck } from "@tabler/icons-react"

export function CheckboxDemo() {
  const [checkbox1, setCheckbox1] = useState(true)
  const [checkbox2, setCheckbox2] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Preferences
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>View Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={checkbox1}
          onCheckedChange={setCheckbox1}
          icon={<IconCheck />}
        >
          Show Toolbar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={checkbox2}
          onCheckedChange={setCheckbox2}
          icon={<IconCheck />}
        >
          Show Sidebar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={true}
          onCheckedChange={() => {}}
          icon={<IconCheck />}
          disabled
        >
          Disabled Option
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function RadioDemo() {
  const [radioValue, setRadioValue] = React.useState("light");

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Theme: {radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={radioValue}
            onValueChange={setRadioValue}
          >
            <DropdownMenuRadioItem
              value="light"
              icon={<IconSun className="w-4 h-4" />}
            >
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="dark"
              icon={<IconMoon className="w-4 h-4" />}
            >
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="system"
              icon={<IconDeviceDesktop className="w-4 h-4" />}
            >
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const radioCode = `import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react"

export function RadioDemo() {
  const [radioValue, setRadioValue] = useState("light")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Theme: {radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={radioValue}
          onValueChange={setRadioValue}
        >
          <DropdownMenuRadioItem
            value="light"
            icon={<IconSun className="w-4 h-4" />}
          >
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            icon={<IconMoon className="w-4 h-4" />}
          >
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            icon={<IconDeviceDesktop className="w-4 h-4" />}
          >
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function SubmenuDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          More Options
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
          <DropdownMenuItem>Analytics</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              icon={<IconSettings className="w-4 h-4" />}
            >
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Security</DropdownMenuLabel>
                <DropdownMenuItem>Password</DropdownMenuItem>
                <DropdownMenuItem>2FA</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconLogout className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const submenuCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconSettings, IconLogout } from "@tabler/icons-react"

export function SubmenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        More Options
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem>Dashboard</DropdownMenuItem>
        <DropdownMenuItem>Analytics</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<IconSettings className="w-4 h-4" />}>
            Settings
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Security</DropdownMenuLabel>
              <DropdownMenuItem>Password</DropdownMenuItem>
              <DropdownMenuItem>2FA</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconLogout className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function LoadingDemo() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAsyncAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Normal Action</DropdownMenuItem>
          <DropdownMenuItem loading={isLoading} onClick={handleAsyncAction}>
            {isLoading ? "Processing..." : "Async Action"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Another Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const loadingCode = `import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const handleAsyncAction = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Normal Action</DropdownMenuItem>
        <DropdownMenuItem loading={isLoading} onClick={handleAsyncAction}>
          {isLoading ? "Processing..." : "Async Action"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Another Action</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function BackdropDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Modal Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent showBackdrop className="w-72">
          <DropdownMenuLabel>Confirm Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            This menu has a backdrop overlay. Click outside to close.
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="flex justify-end gap-2 p-1">
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button size="sm">Confirm</Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const backdropCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function BackdropDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Modal Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent showBackdrop className="w-72">
        <DropdownMenuLabel>Confirm Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          This menu has a backdrop overlay. Click outside to close.
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex justify-end gap-2 p-1">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Confirm</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function ArrowDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Arrow Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuArrow />
          <DropdownMenuGroup>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const arrowCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuArrow,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function ArrowDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Arrow Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        <DropdownMenuGroup>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`;

function WrapperDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenuWithContent
        trigger={<Button variant="outline">Quick Actions</Button>}
        contentProps={{ className: "w-56" }}
      >
        <DropdownMenuItem icon={<IconUser className="w-4 h-4" />}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem icon={<IconSettings className="w-4 h-4" />}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          icon={<IconLogout className="w-4 h-4" />}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuWithContent>
    </div>
  );
}

const wrapperCode = `import {
  DropdownMenuWithContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconUser, IconSettings, IconLogout } from "@tabler/icons-react"

export function WrapperDemo() {
  return (
    <DropdownMenuWithContent
      trigger={<Button variant="outline">Quick Actions</Button>}
      contentProps={{ className: "w-56" }}
    >
      <DropdownMenuItem icon={<IconUser className="w-4 h-4" />}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem icon={<IconSettings className="w-4 h-4" />}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        icon={<IconLogout className="w-4 h-4" />}
      >
        Logout
      </DropdownMenuItem>
    </DropdownMenuWithContent>
  )
}`;

// =============================================================================
// Constants
// =============================================================================

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
      "Support for loading states, backdrop overlays, arrows, and a convenience wrapper component.",
    icon: <IconMenu2 className="h-4 w-4" />,
  },
];

const keyboardShortcuts = [
  { keys: "Enter / Space", description: "Open menu or activate item" },
  { keys: "Arrow Down", description: "Move to next item" },
  { keys: "Arrow Up", description: "Move to previous item" },
  { keys: "Arrow Right", description: "Open submenu" },
  { keys: "Arrow Left", description: "Close submenu" },
  { keys: "Escape", description: "Close menu" },
  { keys: "Home", description: "Move to first item" },
  { keys: "End", description: "Move to last item" },
];

const usageCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuWithContent,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Label</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem icon={<Icon />}>With Icon</DropdownMenuItem>
    <DropdownMenuItem loading>Async Action</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`;

const apiSections = [
  {
    title: "DropdownMenu",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the dropdown menu.",
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
    title: "DropdownMenuTrigger",
    props: [
      {
        prop: "render",
        type: "ReactElement",
        description: "Element to render as the trigger (e.g., Button).",
      },
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element.",
      },
    ],
  },
  {
    title: "DropdownMenuContent",
    props: [
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment of the menu relative to the trigger.",
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
      {
        prop: "showBackdrop",
        type: "boolean",
        default: "false",
        description: "Show a backdrop overlay behind the menu.",
      },
    ],
  },
  {
    title: "DropdownMenuItem",
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
    ],
  },
  {
    title: "DropdownMenuCheckboxItem",
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
    ],
  },
  {
    title: "DropdownMenuRadioGroup",
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
    title: "DropdownMenuRadioItem",
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
    ],
  },
  {
    title: "DropdownMenuWithContent",
    props: [
      {
        prop: "trigger",
        type: "ReactNode",
        description: "Element to use as the menu trigger.",
      },
      {
        prop: "contentProps",
        type: "DropdownMenuContentProps",
        description: "Props to pass to DropdownMenuContent.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Menu items to render inside the content.",
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
        title="Basic Dropdown"
        description="Simple dropdown menu with labels, groups, and icons."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icon-trigger",
    label: "Icon Trigger",
    demo: (
      <DemoWrapper
        title="Icon Trigger"
        description="Compact icon button trigger for contextual menus."
        code={iconTriggerCode}
      >
        <IconTriggerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shortcuts",
    label: "Shortcuts",
    demo: (
      <DemoWrapper
        title="Icons & Shortcuts"
        description="Menu items with icons and keyboard shortcut hints."
        code={shortcutsCode}
      >
        <ShortcutsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "checkbox",
    label: "Checkbox",
    demo: (
      <DemoWrapper
        title="Checkbox Items"
        description="Toggle options with checkbox menu items."
        code={checkboxCode}
      >
        <CheckboxDemo />
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
    value: "submenu",
    label: "Submenu",
    demo: (
      <DemoWrapper
        title="Submenus"
        description="Nested menus for complex navigation hierarchies."
        code={submenuCode}
      >
        <SubmenuDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading",
    demo: (
      <DemoWrapper
        title="Loading State"
        description="Async actions with loading indicator on menu items."
        code={loadingCode}
      >
        <LoadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "backdrop",
    label: "Backdrop",
    demo: (
      <DemoWrapper
        title="Modal with Backdrop"
        description="Menu with backdrop overlay for modal-like behavior."
        code={backdropCode}
      >
        <BackdropDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "arrow",
    label: "Arrow",
    demo: (
      <DemoWrapper
        title="With Arrow"
        description="Menu with an arrow pointing to the trigger."
        code={arrowCode}
      >
        <ArrowDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "wrapper",
    label: "Wrapper",
    demo: (
      <DemoWrapper
        title="Convenience Wrapper"
        description="DropdownMenuWithContent for simpler usage patterns."
        code={wrapperCode}
      >
        <WrapperDemo />
      </DemoWrapper>
    ),
  },
];

// =============================================================================
// Page Component
// =============================================================================

export function DropdownMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Dropdown Menu"
        description="A contextual menu component that displays a list of actions or options triggered by a button. Built on Base UI primitives with full keyboard navigation and WAI-ARIA support."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Import and compose the dropdown menu components to build your menu structure."
      />

      <APIReference sections={apiSections} />
    </ComponentPage>
  );
}
