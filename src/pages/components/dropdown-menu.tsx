"use client";

import * as React from "react";
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
  IconDotsVertical,
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
} from "@tabler/icons-react";

export function DropdownMenuPage() {
  const [radioValue, setRadioValue] = React.useState("light");
  const [checkbox1, setCheckbox1] = React.useState(true);
  const [checkbox2, setCheckbox2] = React.useState(false);
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
        <h1 className="text-3xl font-bold mb-2">Dropdown Menu</h1>
        <p className="text-muted-foreground">
          Displays a menu of actions or options triggered by a button.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Dropdown
        </h2>
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
      </section>

      {/* Icon Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Trigger
        </h2>
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
      </section>

      {/* With Icons & Shortcuts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons & Shortcuts
        </h2>
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
      </section>

      {/* Async/Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State (Opt-in)
        </h2>
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
      </section>

      {/* With Checkboxes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Checkbox Items
        </h2>
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
      </section>

      {/* With Radio Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Radio Items
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Theme: {radioValue.charAt(0).toUpperCase() + radioValue.slice(1)}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
              <DropdownMenuRadioItem value="light" icon={<IconSun className="w-4 h-4" />}>
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" icon={<IconMoon className="w-4 h-4" />}>
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" icon={<IconDeviceDesktop className="w-4 h-4" />}>
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* With Backdrop */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Modal with Backdrop
        </h2>
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
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button size="sm">
                Confirm
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* With Submenu */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Submenus
        </h2>
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
              <IconLogout className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* With Arrow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Arrow
        </h2>
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
      </section>

      {/* Convenience Wrapper */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Convenience Wrapper (DropdownMenuWithContent)
        </h2>
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
          <DropdownMenuItem variant="destructive" icon={<IconLogout className="w-4 h-4" />}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuWithContent>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
{`import {
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
</DropdownMenu>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
