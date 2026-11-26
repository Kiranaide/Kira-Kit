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
            <DropdownMenuItem
              icon={<IconUser aria-hidden="true" className="h-4 w-4" />}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<IconSettings aria-hidden="true" className="h-4 w-4" />}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              icon={<IconLogout aria-hidden="true" className="h-4 w-4" />}
            >
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
          <DropdownMenuItem icon={<IconUser aria-hidden="true" className="h-4 w-4" />}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem icon={<IconSettings aria-hidden="true" className="h-4 w-4" />}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconLogout aria-hidden="true" className="h-4 w-4" />}>
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
          <IconDotsVertical aria-hidden="true" className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            icon={<IconTrash aria-hidden="true" className="h-4 w-4" />}
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
        <IconDotsVertical aria-hidden="true" className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          icon={<IconTrash aria-hidden="true" className="h-4 w-4" />}
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
            <DropdownMenuItem
              icon={<IconPlus aria-hidden="true" />}
              shortcut="⌘N"
            >
              New File
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={<IconCopy aria-hidden="true" />}
              shortcut="⌘D"
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              icon={<IconDownload aria-hidden="true" />}
              shortcut="⌘S"
            >
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
          <DropdownMenuItem icon={<IconPlus aria-hidden="true" />} shortcut="⌘N">
            New File
          </DropdownMenuItem>
          <DropdownMenuItem icon={<IconCopy aria-hidden="true" />} shortcut="⌘D">
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconDownload aria-hidden="true" />} shortcut="⌘S">
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
              icon={<IconCheck aria-hidden="true" />}
            >
              Show Toolbar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={checkbox2}
              onCheckedChange={setCheckbox2}
              icon={<IconCheck aria-hidden="true" />}
            >
              Show Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={true}
              onCheckedChange={() => {}}
              icon={<IconCheck aria-hidden="true" />}
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
          <DropdownMenuCheckboxItem
            checked={checkbox1}
            onCheckedChange={setCheckbox1}
            icon={<IconCheck aria-hidden="true" />}
          >
            Show Toolbar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={checkbox2}
            onCheckedChange={setCheckbox2}
            icon={<IconCheck aria-hidden="true" />}
          >
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={true}
            onCheckedChange={() => {}}
            icon={<IconCheck aria-hidden="true" />}
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
                icon={<IconSun aria-hidden="true" className="h-4 w-4" />}
              >
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="dark"
                icon={<IconMoon aria-hidden="true" className="h-4 w-4" />}
              >
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="system"
                icon={
                  <IconDeviceDesktop aria-hidden="true" className="h-4 w-4" />
                }
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
          <DropdownMenuRadioGroup
            value={radioValue}
            onValueChange={setRadioValue}
          >
            <DropdownMenuRadioItem value="light" icon={<IconSun aria-hidden="true" className="h-4 w-4" />}>
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark" icon={<IconMoon aria-hidden="true" className="h-4 w-4" />}>
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system" icon={<IconDeviceDesktop aria-hidden="true" className="h-4 w-4" />}>
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
            <DropdownMenuSubTrigger
              icon={<IconSettings aria-hidden="true" className="h-4 w-4" />}
            >
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
            icon={<IconLogout aria-hidden="true" className="h-4 w-4" />}
          >
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
  DropdownMenuGroup,
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
        <DropdownMenuItem>Dashboard</DropdownMenuItem>
        <DropdownMenuItem>Analytics</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<IconSettings aria-hidden="true" className="h-4 w-4" />}>
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
          icon={<IconLogout aria-hidden="true" className="h-4 w-4" />}
        >
          Logout
        </DropdownMenuItem>
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
    setTimeout(() => setIsLoading(false), 2000);
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
          <DropdownMenuItem>
            This menu has a backdrop overlay. Click outside to close.
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex justify-end gap-2 p-1">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Confirm</Button>
        </div>
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
        <DropdownMenuItem
          icon={<IconUser aria-hidden="true" className="h-4 w-4" />}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={<IconSettings aria-hidden="true" className="h-4 w-4" />}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          icon={<IconLogout aria-hidden="true" className="h-4 w-4" />}
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
      <DropdownMenuItem icon={<IconUser aria-hidden="true" className="h-4 w-4" />}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem icon={<IconSettings aria-hidden="true" className="h-4 w-4" />}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        icon={<IconLogout aria-hidden="true" className="h-4 w-4" />}
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
        searchLabel="Filter actions"
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
      <output className="block text-xs text-muted-foreground">{selected}</output>
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
  const [handle] = React.useState(() => createDropdownMenuHandle<Row>());

  const items = React.useCallback(
    (row: Row): readonly MenuItemData[] => [
      {
        type: "action",
        id: `archive-${row.id}`,
        label: `Archive ${row.name}`,
        variant: "destructive",
        onSelect: async ({ signal }) => {
          await waitForDemoAction(signal, 2000);

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
      <output className="block text-xs text-muted-foreground">
        Last resolved: {resolved}
      </output>
      <div className="flex items-center justify-center gap-2">
        {rows.map((row) => (
          <DropdownMenuTrigger
            key={row.id}
            handle={handle}
            payload={row}
            render={<Button variant="outline">{row.name}</Button>}
          />
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
        icon: <IconDownload aria-hidden="true" className="size-4" />,
        shortcut: "⌘E",
        onSelect: ({ signal }) => exportDemoReport(signal, setLog),
        successMessage: "Report exported.",
      },
      {
        type: "action",
        id: "publish",
        label: "Publish (fails first)",
        icon: <IconRocket aria-hidden="true" className="size-4" />,
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
        icon: <IconTrash aria-hidden="true" className="size-4" />,
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
      <output className="block text-xs text-muted-foreground">
        {log.length > 0 ? log[log.length - 1]?.message : "No actions run yet."}
      </output>
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
      <output className="block text-xs text-muted-foreground">{message}</output>
    </>
  );
}`;

function StressDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <KiraDropdownMenu
        trigger={
          <Button variant="outline" className="w-full whitespace-normal">
            Long labels, disabled reasons, and narrow container
          </Button>
        }
        contentProps={{ className: "max-w-xs" }}
        items={stressMenuItems}
      />
      <KiraDropdownMenu
        trigger={
          <Button variant="outline" className="w-full">
            Empty actions menu
          </Button>
        }
        items={emptyMenuItems}
      />
    </div>
  );
}

const stressCode = `import { KiraDropdownMenu, type MenuItemData } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const items: MenuItemData[] = [
  {
    type: "action",
    id: "long",
    label: "Synchronize workspace_billing_ledger_2026_q4_archive across all regions",
    shortcut: "⇧⌘S",
    onSelect: () => {},
  },
  {
    type: "action",
    id: "disabled",
    label: "Delete organization",
    variant: "destructive",
    disabled: true,
    disabledReason: "Transfer active subscriptions before deleting.",
    onSelect: () => {},
  },
];

export function StressDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <KiraDropdownMenu
        trigger={<Button variant="outline" className="w-full">Long labels & disabled</Button>}
        contentProps={{ className: "max-w-xs" }}
        items={items}
      />
      <KiraDropdownMenu
        trigger={<Button variant="outline" className="w-full">Empty actions menu</Button>}
        items={[]}
      />
    </div>
  );
}`;

const usageCode = `import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconSettings } from "@tabler/icons-react";

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Label</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Item 1</DropdownMenuItem>
      <DropdownMenuItem icon={<IconSettings aria-hidden="true" />}>
        With Icon
      </DropdownMenuItem>
      <DropdownMenuItem loading>Async Action</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>;`;

export default function DropdownMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Dropdown Menu"
        description="A contextual menu component that displays a list of actions or options triggered by a button. Built on Base UI primitives with full keyboard navigation and WAI-ARIA support."
        version="v2.1.0"
      />

      <FeatureGrid
        features={dropdownMenuPageFeatures}
        description="Built on Base UI Menu with searchable filtering, shared detached triggers, and async action lifecycles."
      />

      <DemoTabs tabs={dropdownMenuPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={dropdownMenuPageShortcuts}
        description="Keyboard navigation and menu activation bindings provided by Base UI Menu."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and compose the dropdown menu components to build your menu structure."
        notes={[
          {
            label: "KiraDropdownMenu",
            body: "Use KiraDropdownMenu for data-driven MenuItemData trees, searchable filtering, async action lifecycles, or detached triggers sharing one popup via createDropdownMenuHandle.",
          },
          {
            label: "Group labels",
            body: "DropdownMenuLabel renders Base UI's Menu.GroupLabel and must be placed inside a DropdownMenuGroup so aria-labelledby associates correctly.",
          },
          {
            label: "Filter parts",
            body: "When building custom searchable menus, wrap the menu in DropdownMenuFilterProvider and place items inside DropdownMenuList alongside DropdownMenuInput, DropdownMenuClear, and DropdownMenuEmpty.",
          },
        ]}
      />

      <APIReference
        sections={dropdownMenuPageAPISections}
        description="Props, types, and defaults for every exported Dropdown Menu part and helper."
      />

      <Changelog
        entries={dropdownMenuPageChangelogEntries}
        title="Changelog"
        description="Version history for the Dropdown Menu component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const emptyMenuItems: readonly MenuItemData[] = [];

const stressMenuItems: readonly MenuItemData[] = [
  {
    type: "action",
    id: "long-label",
    label:
      "Synchronize workspace_billing_ledger_2026_q4_archive across all regions",
    shortcut: "⇧⌘S",
    onSelect: () => {},
  },
  {
    type: "action",
    id: "disabled-reason",
    label: "Delete organization",
    variant: "destructive",
    disabled: true,
    disabledReason: "Transfer active subscriptions before deleting.",
    onSelect: () => {},
  },
];

const dropdownMenuPageFeatures = [
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA menu pattern with keyboard navigation, focus management, and screen reader support.",
    icon: <IconKeyboard aria-hidden="true" className="h-4 w-4" />,
  },
  {
    title: "Composable",
    description:
      "Build complex menus with checkboxes, radio groups, submenus, native links, icons, and shortcuts.",
    icon: <IconComponents aria-hidden="true" className="h-4 w-4" />,
  },
  {
    title: "Flexible",
    description:
      "Supports searchable filtering, shared detached triggers, loading states, backdrops, and arrows.",
    icon: <IconMenu2 aria-hidden="true" className="h-4 w-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const dropdownMenuPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Items & Structure",
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
    group: "Items & Structure",
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
    group: "Items & Structure",
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
    group: "Items & Structure",
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
    value: "arrow",
    label: "Arrow",
    group: "Items & Structure",
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
    label: "Kira",
    group: "KiraDropdownMenu",
    demo: (
      <DemoWrapper
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
    group: "KiraDropdownMenu",
    demo: (
      <DemoWrapper
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
    group: "KiraDropdownMenu",
    demo: (
      <DemoWrapper
        title="Shared-Popup Row Actions"
        description="One stable handle shares one popup across row triggers; each trigger passes its row payload. Dismissal or switching triggers cancels pending actions."
        code={sharedRowsCode}
      >
        <SharedRowsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async-actions",
    label: "Async Actions",
    group: "KiraDropdownMenu",
    demo: (
      <DemoWrapper
        title="Async Action Lifecycle"
        description="Single-flight pending rows with aria-busy, recoverable failure with Retry, and sync actions without spinner."
        code={asyncCode}
      >
        <AsyncActionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading",
    group: "Behavior",
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
    group: "Behavior",
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
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long wrapping labels, disabled reasons, and empty item lists in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const dropdownMenuPageShortcuts = [
  { keys: "Enter / Space", description: "Open menu or activate focused item." },
  { keys: "Arrow Down", description: "Move highlight to the next item." },
  { keys: "Arrow Up", description: "Move highlight to the previous item." },
  { keys: "Arrow Right", description: "Open the focused submenu." },
  { keys: "Arrow Left", description: "Close the current submenu." },
  {
    keys: "Home / End",
    description: "Move highlight to the first or last item.",
  },
  { keys: "Escape", description: "Close the menu and restore trigger focus." },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const dropdownMenuPageAPISections = [
  {
    title: "DropdownMenu",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "-",
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
        type: "(open: boolean, details: Menu.Root.ChangeEventDetails) => void",
        default: "-",
        description: "Callback when the open state changes.",
      },
      {
        prop: "modal",
        type: "boolean",
        default: "true",
        description:
          "Whether the menu traps focus and blocks outside interaction.",
      },
      {
        prop: "handle",
        type: "Menu.Handle<Payload>",
        default: "-",
        description:
          "Detached handle from createDropdownMenuHandle for shared popups.",
      },
    ],
  },
  {
    title: "DropdownMenuPortal",
    props: [
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description: "Keep the portal mounted in the DOM while closed.",
      },
      {
        prop: "container",
        type: "HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null",
        default: "-",
        description: "Target container for the portal.",
      },
    ],
  },
  {
    title: "DropdownMenuTrigger",
    props: [
      {
        prop: "render",
        type: "Menu.Trigger.Props<Payload>['render']",
        default: "-",
        description: "Element to render as the trigger (e.g., Button).",
      },
      {
        prop: "handle",
        type: "Menu.Handle<Payload>",
        default: "-",
        description:
          "Detached menu handle connecting this trigger to a shared popup.",
      },
      {
        prop: "payload",
        type: "Payload",
        default: "-",
        description: "Per-trigger payload passed to a detached menu popup.",
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
    title: "DropdownMenuContent",
    props: [
      {
        prop: "side",
        type: 'Menu.Positioner.Props["side"]',
        default: '"bottom"',
        description: "Side of the trigger to render the menu.",
      },
      {
        prop: "align",
        type: 'Menu.Positioner.Props["align"]',
        default: '"start"',
        description: "Alignment of the menu relative to the trigger.",
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
        description: "Keep the popup mounted when closed.",
      },
      {
        prop: "showBackdrop",
        type: "boolean",
        default: "false",
        description: "Render DropdownMenuBackdrop behind the menu.",
      },
      {
        prop: "portalProps",
        type: "Omit<Menu.Portal.Props, 'children' | 'keepMounted'>",
        default: "-",
        description: "Props forwarded to the internal Menu.Portal.",
      },
      {
        prop: "positionerProps",
        type: "Omit<Menu.Positioner.Props, 'children' | 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'className'> & { className?: string }",
        default: "-",
        description: "Props forwarded to the internal Menu.Positioner.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes applied to the popup.",
      },
    ],
  },
  {
    title: "DropdownMenuBackdrop",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the backdrop overlay.",
      },
    ],
  },
  {
    title: "DropdownMenuArrow",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the arrow element.",
      },
    ],
  },
  {
    title: "DropdownMenuGroup",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Grouped menu items and optional DropdownMenuLabel.",
      },
    ],
  },
  {
    title: "DropdownMenuLabel",
    props: [
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description:
          "Indent label to align with rows that have leading indicators.",
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
    title: "DropdownMenuItem",
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
        description: "Indent item to align with indicator rows.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Decorative icon displayed before the item label.",
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
        description: "Show loading spinner, set aria-busy, and disable item.",
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
          "Visible explanation rendered inside the disabled row and linked via aria-describedby.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description: "Whether clicking the item closes the menu.",
      },
    ],
  },
  {
    title: "DropdownMenuLinkItem",
    props: [
      {
        prop: "href",
        type: "string",
        default: "-",
        description: "Destination URL rendered on a native anchor element.",
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
        description: "Indent link row to align with indicator rows.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Decorative leading icon.",
      },
      {
        prop: "shortcut",
        type: "string",
        default: "-",
        description: "Keyboard shortcut hint.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description: "Whether activating the link closes the menu.",
      },
    ],
  },
  {
    title: "DropdownMenuCheckboxItem",
    props: [
      {
        prop: "checked",
        type: "boolean",
        default: "-",
        description: "Controlled checked state.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean, details: Menu.CheckboxItem.ChangeEventDetails) => void",
        default: "-",
        description: "Callback when checked state changes.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Leading decorative icon next to the check indicator.",
      },
      {
        prop: "iconChecked",
        type: "React.ReactNode",
        default: "-",
        description: "Custom check indicator glyph.",
      },
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Apply inset start padding.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the checkbox item.",
      },
      {
        prop: "disabledReason",
        type: "string",
        default: "-",
        description: "Visible explanation linked via aria-describedby.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "false",
        description: "Whether toggling closes the menu.",
      },
    ],
  },
  {
    title: "DropdownMenuRadioGroup",
    props: [
      {
        prop: "value",
        type: "string",
        default: "-",
        description: "Currently selected value.",
      },
      {
        prop: "onValueChange",
        type: "(value: string, details: Menu.RadioGroup.ChangeEventDetails) => void",
        default: "-",
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
        default: "-",
        description: "Value of this radio item.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Decorative icon displayed before the item text.",
      },
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Apply inset start padding.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the radio item.",
      },
      {
        prop: "disabledReason",
        type: "string",
        default: "-",
        description: "Visible explanation linked via aria-describedby.",
      },
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "false",
        description: "Whether selecting closes the menu.",
      },
    ],
  },
  {
    title: "DropdownMenuSeparator",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the separator line.",
      },
    ],
  },
  {
    title: "DropdownMenuShortcut",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the shortcut hint span.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Shortcut text (rendered aria-hidden).",
      },
    ],
  },
  {
    title: "DropdownMenuSub",
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
        description: "Initial uncontrolled open state of the submenu.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, details: Menu.SubmenuRoot.ChangeEventDetails) => void",
        default: "-",
        description: "Callback when the submenu opens or closes.",
      },
    ],
  },
  {
    title: "DropdownMenuSubTrigger",
    props: [
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Indent trigger to align with indicator rows.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Decorative icon displayed before the label.",
      },
      {
        prop: "disabledReason",
        type: "string",
        default: "-",
        description: "Visible explanation linked via aria-describedby.",
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
    title: "DropdownMenuSubContent",
    props: [
      {
        prop: "align",
        type: 'Menu.Positioner.Props["align"]',
        default: '"start"',
        description: "Alignment of the submenu relative to the sub-trigger.",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "4",
        description: "Distance from the sub-trigger in pixels.",
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
        description: "Keep the submenu mounted when closed.",
      },
      {
        prop: "portalProps",
        type: "Omit<Menu.Portal.Props, 'children' | 'keepMounted'>",
        default: "-",
        description: "Props forwarded to the internal Menu.Portal.",
      },
      {
        prop: "positionerProps",
        type: "Omit<Menu.Positioner.Props, 'children' | 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'className'> & { className?: string }",
        default: "-",
        description: "Props forwarded to the internal Menu.Positioner.",
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
    title: "DropdownMenuFilterProvider",
    props: [
      {
        prop: "autoHighlight",
        type: "boolean",
        default: "false",
        description:
          "Automatically highlight the first matching item while filtering.",
      },
      {
        prop: "Menu.FilterProvider.Props",
        type: "Menu.FilterProvider.Props",
        default: "-",
        description:
          "Base UI 1.9 preview filter scope wrapper (renders no DOM).",
      },
    ],
  },
  {
    title: "DropdownMenuInput",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the filter input.",
      },
      {
        prop: "Menu.Input.Props",
        type: "Omit<Menu.Input.Props, 'className'>",
        default: "-",
        description: "Input attributes such as placeholder and aria-label.",
      },
    ],
  },
  {
    title: "DropdownMenuList",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the filterable item list.",
      },
    ],
  },
  {
    title: "DropdownMenuClear",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the filter clear button.",
      },
      {
        prop: "aria-label",
        type: "string",
        default: "-",
        description: "Accessible name for the clear button.",
      },
    ],
  },
  {
    title: "DropdownMenuEmpty",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          "Additional CSS classes for the zero-match status message.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description:
          "Empty state text rendered with polite live-region semantics.",
      },
    ],
  },
  {
    title: "DropdownMenuViewport",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          "Additional CSS classes for the detached-trigger content transition viewport.",
      },
    ],
  },
  {
    title: "KiraDropdownMenu",
    props: [
      {
        prop: "trigger",
        type: "React.ReactElement",
        default: "-",
        description:
          "Colocated trigger element (omit in detached handle mode).",
      },
      {
        prop: "items",
        type: "readonly MenuItemData[] | ((payload: Payload) => readonly MenuItemData[])",
        default: "-",
        description:
          "Static item tree or payload-driven factory in detached handle mode.",
      },
      {
        prop: "handle",
        type: "Menu.Handle<Payload>",
        default: "-",
        description:
          "Detached handle from createDropdownMenuHandle for shared popups.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description:
          "Custom menu items when not using the data-driven items prop.",
      },
      {
        prop: "searchable",
        type: "boolean",
        default: "false",
        description: "Enable Base UI 1.9 preview filtering inside the popup.",
      },
      {
        prop: "searchLabel",
        type: "string",
        default: '"Filter actions"',
        description: "Accessible label and placeholder for the filter input.",
      },
      {
        prop: "emptyMessage",
        type: "React.ReactNode",
        default: '"No matching actions."',
        description: "Zero-match message rendered inside DropdownMenuEmpty.",
      },
      {
        prop: "onActionError",
        type: "(error: unknown, item: MenuActionItem) => void",
        default: "-",
        description: "Error callback when an async MenuActionItem rejects.",
      },
      {
        prop: "rootProps / triggerProps / contentProps",
        type: "Partial root, trigger, and content props",
        default: "-",
        description:
          "Pass-through options for DropdownMenu, DropdownMenuTrigger, and DropdownMenuContent.",
      },
    ],
  },
  {
    title: "createDropdownMenuHandle",
    props: [
      {
        prop: "Payload (generic)",
        type: "<Payload = unknown>() => Menu.Handle<Payload>",
        default: "unknown",
        description:
          "Factory that creates a typed detached handle shared across triggers and one popup.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const dropdownMenuPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: "Unified menu metrics",
        description:
          "Popup padding tightened from 6px to p-1 and rows from 36px height with 10px horizontal padding/gap to min-h-8 px-2 py-1.5 gap-2 — the same item metric as Select and Combobox (menubar wrappers share the row variants). Labels align to px-2 py-1.5. The search header becomes an sm-tier h-8 field with a recomputed clear offset (pe-8, inset-e-1 top-1).",
      },
    ],
  },
  {
    version: "2.0.3",
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
    version: "2.0.2",
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
    version: "2.0.1",
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
    version: "2.0.0",
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
