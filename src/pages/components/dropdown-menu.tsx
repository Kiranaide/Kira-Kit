"use client";

import type { ComponentProps as ReactComponentProps } from "react";
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
  IconRocket,
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
  DropdownMenuSubContent,
  KiraDropdownMenu,
  DropdownMenuArrow,
  createDropdownMenuHandle,
  type MenuItemData,
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
  Changelog,
} from "@/components/docs";

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
            <DropdownMenuItem icon={<IconUser className="w-4 h-4" />}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem icon={<IconSettings className="w-4 h-4" />}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<IconLogout className="w-4 h-4" />}>
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconUser, IconSettings, IconLogout } from "@tabler/icons-react";

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
          <DropdownMenuItem icon={<IconUser className="w-4 h-4" />}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem icon={<IconSettings className="w-4 h-4" />}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconLogout className="w-4 h-4" />}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`;

function IconTriggerDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open actions"
          render={<Button variant="ghost" size="icon" />}
        >
          <IconDotsVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            icon={<IconTrash className="w-4 h-4" />}
          >
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";

export function IconTriggerDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open actions"
        render={<Button variant="ghost" size="icon" />}
      >
        <IconDotsVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          icon={<IconTrash className="w-4 h-4" />}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconPlus, IconCopy, IconDownload } from "@tabler/icons-react";

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
  );
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>View Options</DropdownMenuLabel>
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
            <DropdownMenuCheckboxItem
              checked={true}
              onCheckedChange={() => {}}
              icon={<IconCheck />}
              disabled
            >
              Disabled Option
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const checkboxCode = `import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconCheck } from "@tabler/icons-react";

export function CheckboxDemo() {
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Preferences
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const radioCode = `import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";

export function RadioDemo() {
  const [radioValue, setRadioValue] = useState("light");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Theme: {radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
            <DropdownMenuSubTrigger icon={<IconSettings className="w-4 h-4" />}>
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Security</DropdownMenuLabel>
                <DropdownMenuItem>Password</DropdownMenuItem>
                <DropdownMenuItem>2FA</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            icon={<IconLogout className="w-4 h-4" />}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const submenuCode = `import {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconSettings, IconLogout } from "@tabler/icons-react";

export function SubmenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        More Options
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
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
          <DropdownMenuItem
            variant="destructive"
            icon={<IconLogout className="w-4 h-4" />}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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

const loadingCode = `import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

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
  );
}`;

function BackdropDemo() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Modal Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent showBackdrop className="w-72">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Confirm Action</DropdownMenuLabel>
            <DropdownMenuItem>
              This menu has a backdrop overlay. Click outside to close.
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function BackdropDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Modal Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent showBackdrop className="w-72">
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  );
}`;

function WrapperDemo() {
  return (
    <div className="flex items-center justify-center">
      <KiraDropdownMenu
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
      </KiraDropdownMenu>
    </div>
  );
}

const wrapperCode = `import {
  KiraDropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconUser, IconSettings, IconLogout } from "@tabler/icons-react";

export function WrapperDemo() {
  return (
    <KiraDropdownMenu
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
    </KiraDropdownMenu>
  );
}`;

function SearchDemo() {
  const [selected, setSelected] = React.useState("No action selected.");

  const items: MenuItemData[] = [
    {
      type: "action",
      id: "copy",
      label: "Copy link",
      onSelect: () => setSelected("Link copied."),
    },
    {
      type: "action",
      id: "rename",
      label: "Rename project",
      onSelect: () => setSelected("Project renamed."),
    },
    {
      type: "submenu",
      id: "export",
      label: "Export",
      searchable: true,
      items: [
        {
          type: "action",
          id: "pdf",
          label: "Export PDF",
          onSelect: () => setSelected("PDF exported."),
        },
        {
          type: "action",
          id: "csv",
          label: "Export CSV",
          onSelect: () => setSelected("CSV exported."),
        },
      ],
    },
    {
      type: "action",
      id: "disabled",
      label: "Delete project",
      disabled: true,
      disabledReason: "Only workspace owners can delete projects.",
      onSelect: () => {},
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <KiraDropdownMenu
        trigger={<Button variant="outline">Search actions</Button>}
        items={items}
        searchable
        searchLabel="Filter actions"
      />
      <output className="block text-xs text-muted-foreground">
        {selected}
      </output>
    </div>
  );
}

const searchCode = `import { useState } from "react";
import { KiraDropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function SearchDemo() {
  const [selected, setSelected] = useState("No action selected.");
  return (
    <>
      <KiraDropdownMenu
        trigger={<Button variant="outline">Search actions</Button>}
        searchable
        items={[
          {
            type: "action",
            id: "copy",
            label: "Copy link",
            onSelect: () => setSelected("Link copied."),
          },
          {
            type: "action",
            id: "rename",
            label: "Rename project",
            onSelect: () => setSelected("Project renamed."),
          },
        ]}
      />
      <p role="status">{selected}</p>
    </>
  );
}`;

function SharedRowsDemo() {
  type Row = { id: string; name: string; env: string };

  const [rows, setRows] = React.useState<Row[]>([
    { id: "atlas", name: "Atlas", env: "production" },
    { id: "boreal", name: "Boreal", env: "staging" },
  ]);

  const [resolved, setResolved] = React.useState("none");

  // One stable handle: one shared popup, N triggers with per-row payloads.
  const [handle] = React.useState(() => createDropdownMenuHandle<Row>());

  const items = React.useCallback(
    (row: Row): readonly MenuItemData[] => [
      {
        type: "action",
        id: `archive-${row.id}`,
        label: `Archive ${row.name}`,
        variant: "destructive",
        onSelect: async ({ signal }) => {
          await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, 2000);
            signal.addEventListener(
              "abort",
              () => {
                clearTimeout(timer);
                resolve();
              },
              { once: true },
            );
          });

          if (signal.aborted) return;
          setRows((current) => current.filter((item) => item.id !== row.id));
          setResolved(row.name);
        },
      },
      {
        type: "link",
        id: `open-${row.id}`,
        label: `Open ${row.name}`,
        href: "#",
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Last resolved: {resolved}
      </p>
      <div className="flex items-center justify-center gap-2">
        {rows.map((row) => (
          <React.Fragment key={row.id}>
            <DropdownMenuTrigger
              handle={handle}
              payload={row}
              render={<Button variant="outline">{row.name}</Button>}
            />
          </React.Fragment>
        ))}
      </div>
      <KiraDropdownMenu
        handle={handle}
        items={items}
        rootProps={{ modal: false }}
      />
    </div>
  );
}

const sharedRowsCode = `import { useState } from "react";
import {
  KiraDropdownMenu,
  createDropdownMenuHandle,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Row = { id: string; name: string };

export function SharedRowsDemo() {
  const [rows, setRows] = useState<Row[]>([
    { id: "atlas", name: "Atlas" },
    { id: "boreal", name: "Boreal" },
  ]);

  // One stable handle: one shared popup, N triggers with payloads.
  const [handle] = useState(() => createDropdownMenuHandle<Row>());

  return (
    <div className="flex flex-col items-start gap-2">
      {rows.map((row) => (
        <DropdownMenuTrigger
          key={row.id}
          handle={handle}
          payload={row}
          render={<Button variant="outline">{row.name}</Button>}
        />
      ))}
      <KiraDropdownMenu
        handle={handle}
        items={(row) => [
          {
            type: "action",
            id: \`archive-\${row.id}\`,
            label: \`Archive \${row.name}\`,
            variant: "destructive",
            onSelect: () =>
              setRows((current) => current.filter((r) => r.id !== row.id)),
          },
        ]}
      />
    </div>
  );
}`;

function AsyncActionsDemo() {
  const [log, setLog] = React.useState<AsyncDemoLogEntry[]>([]);

  const publishAttempts = React.useRef(0);

  const items = React.useMemo<readonly MenuItemData[]>(
    () => [
      {
        type: "action",
        id: "export",
        label: "Export report",
        icon: <IconDownload className="size-4" />,
        shortcut: "⌘E",
        // Delayed fixture (labelled): 1.5s then success.
        onSelect: ({ signal }) => exportDemoReport(signal, setLog),
        successMessage: "Report exported.",
      },
      {
        type: "action",
        id: "publish",
        label: "Publish (fails first)",
        icon: <IconRocket className="size-4" />,
        closeOnSuccess: false,
        onSelect: ({ signal }) =>
          publishDemoReport(signal, publishAttempts, setLog),
        errorMessage: "Could not publish. Check the connection.",
      },
      {
        type: "action",
        id: "rename",
        label: "Rename (sync)",
        onSelect: () => {
          setLog((prev) => [
            ...prev,
            { id: crypto.randomUUID(), message: "renamed ✓" },
          ]);
        },
        successMessage: "Renamed.",
      },
      { type: "separator", id: "sep" },
      {
        type: "action",
        id: "delete",
        label: "Delete project",
        variant: "destructive",
        icon: <IconTrash className="size-4" />,
        disabled: true,
        disabledReason: "Deleting is disabled in the demo workspace.",
        onSelect: () => {},
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <KiraDropdownMenu
        trigger={<Button variant="outline">Project actions</Button>}
        items={items}
        searchable
      />
      <ul className="text-xs text-muted-foreground" aria-live="polite">
        {log.map((entry) => (
          <li key={entry.id}>{entry.message}</li>
        ))}
      </ul>
    </div>
  );
}

const asyncCode = `import { useRef, useState } from "react";
import {
  KiraDropdownMenu,
  type MenuItemData,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AsyncActionsDemo() {
  const [message, setMessage] = useState("");
  const attempts = useRef(0);
  const items: MenuItemData[] = [
    {
      type: "action",
      id: "publish",
      label: "Publish (fails first)",
      closeOnSuccess: false,
      onSelect: async ({ signal }) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (signal.aborted) return;
        attempts.current += 1;
        if (attempts.current === 1)
          throw new Error("Fixture connection failure");
        setMessage("Published.");
      },
      errorMessage: "Could not publish. Try again.",
    },
  ];
  return (
    <>
      <KiraDropdownMenu
        trigger={<Button variant="outline">Project actions</Button>}
        items={items}
      />
      <p role="status">{message}</p>
    </>
  );
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
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  KiraDropdownMenu,
} from "@/components/ui/dropdown-menu";
import { IconSettings } from "@tabler/icons-react";

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Label</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Item 1</DropdownMenuItem>
      <DropdownMenuItem icon={<IconSettings />}>With Icon</DropdownMenuItem>
      <DropdownMenuItem loading>Async Action</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>;`;

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
    title: "KiraDropdownMenu",
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
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
    label: "Kira",
    demo: (
      <DemoWrapper
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
        title="KiraDropdownMenu"
        description="Data-driven composition: static items, searchable actions, or detached shared triggers."
        code={wrapperCode}
      >
        <WrapperDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "search",
    label: "Search",
    demo: (
      <DemoWrapper
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
        title="Searchable Actions"
        description="Opt-in Base UI 1.9 preview filtering: type to narrow, Enter activates the first match, Clear resets, query resets on close."
        code={searchCode}
      >
        <SearchDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shared-rows",
    label: "Shared Rows",
    demo: (
      <DemoWrapper
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
        title="Shared-Popup Row Actions"
        description="One stable handle shares one popup across row triggers; each trigger passes its row payload. The labelled two-second fixture archives its row; dismissal or switching triggers cancels it."
        code={sharedRowsCode}
      >
        <SharedRowsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async-actions",
    label: "Async Actions",
    demo: (
      <DemoWrapper
        className="[&_[data-slot=card-header]>div]:flex-col [&_[data-slot=card-header]>div]:items-start [&_[data-slot=card-header]>div]:gap-4 sm:[&_[data-slot=card-header]>div]:flex-row sm:[&_[data-slot=card-header]>div]:items-center"
        title="Async Action Lifecycle"
        description="Single-flight pending rows with aria-busy, recoverable failure with Retry, sync actions without spinner. Delayed/fail-once controls are labelled fixtures."
        code={asyncCode}
      >
        <AsyncActionsDemo />
      </DemoWrapper>
    ),
  },
];

export default function DropdownMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Dropdown Menu"
        description="A contextual menu component that displays a list of actions or options triggered by a button. Built on Base UI primitives with full keyboard navigation and WAI-ARIA support."
        version="v2.0.3"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Import and compose the dropdown menu components to build your menu structure."
      />

      <APIReference sections={apiSections} />

      <Changelog entries={dropdownMenuPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const dropdownMenuPageChangelogEntries = [
  {
    version: "v2.1.0",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: "Unified menu metrics",
        description:
          "Popup padding p-1.5→p-1 and rows min-h-9 px-2.5 py-2 gap-2.5→min-h-8 px-2 py-1.5 gap-2 — the same item metric as Select and Combobox (menubar wrappers share the row variants). Labels align to px-2 py-1.5. The search header becomes an sm-tier h-8 field with a recomputed clear offset (pe-8, inset-e-1 top-1).",
      },
    ],
  },
  {
    version: "v2.0.2",
    date: "7 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Balanced popup spacing",
        description:
          "Removed the permanently reserved scrollbar gutter, separated search from its results, and aligned row and group-label padding. Search and preference rows have more room to breathe. Audited on Base UI 1.9.0; no public API changes.",
      },
    ],
  },
  {
    version: "v2.0.3",
    date: "8 November 2026",
    changes: [
      {
        type: "changed",
        title: "Demo structure conformance",
        description:
          "The page no longer overrides ComponentPage padding; layout matches every other component page. No API changes.",
      },
    ],
  },
  {
    version: "v2.0.1",
    date: "7 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Repair menu sessions and filtering",
        description:
          "Fixed FilterProvider placement for roots and submenus, detached trigger payloads, empty menus, preference rows staying open, async success closing, cancellation and stale pending state. Preserves state callback styles and readable long labels. Audited on Base UI 1.9.0; no public API changes.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "6 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Base UI 1.9.0 audit + rebuilt semantics",
        description:
          "DropdownMenuProps/TriggerProps are now generic over payload (<Payload>). Label renders Menu.GroupLabel and must sit inside a Group. Content/SubContent placement props derive from Menu.Positioner.Props; geometry goes only to the Positioner. Removed slide-in classes (opacity/scale motion only, 200/150ms).",
      },
      {
        type: "removed",
        title: "DropdownMenuWithContent",
        description:
          "Replaced by KiraDropdownMenu (items / children / detached handle modes).",
      },
      {
        type: "added",
        title: "KiraDropdownMenu + useMenuAction",
        description:
          "Data-driven menus (MenuItemData tree), searchable roots/submenus (Base UI 1.9 preview FilterProvider), shared detached-popup triggers via createDropdownMenuHandle, and a single-flight async action lifecycle with abort, retry and polite status region.",
      },
      {
        type: "added",
        title: "DropdownMenuLinkItem, disabledReason, filter parts",
        description:
          "Native-anchor rows (Menu.LinkItem), keyboard/touch-reachable disabled explanations, and DropdownMenuFilterProvider/Input/List/Clear/Empty/Viewport wrappers.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

interface AsyncDemoLogEntry {
  id: string;
  message: string;
}

function waitForDemoAction(
  signal: AbortSignal,
  milliseconds: number,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

async function exportDemoReport(
  signal: AbortSignal,
  setLog: React.Dispatch<React.SetStateAction<AsyncDemoLogEntry[]>>,
) {
  await waitForDemoAction(signal, 1500);

  if (signal.aborted) return;
  setLog((previous) => [
    ...previous,
    { id: crypto.randomUUID(), message: "exported ✓" },
  ]);
}

async function publishDemoReport(
  signal: AbortSignal,
  attempts: React.RefObject<number>,
  setLog: React.Dispatch<React.SetStateAction<AsyncDemoLogEntry[]>>,
) {
  await waitForDemoAction(signal, 800);

  if (signal.aborted) return;
  attempts.current += 1;

  if (attempts.current === 1) throw new Error("network");
  setLog((previous) => [
    ...previous,
    { id: crypto.randomUUID(), message: "published ✓" },
  ]);
}
