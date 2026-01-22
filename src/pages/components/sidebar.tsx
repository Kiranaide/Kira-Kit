import { useState } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarItemGroup,
  SidebarFooter,
  SidebarDivider,
  SidebarSearch,
  SidebarUser,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSkeleton,
  ThemeToggle,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  IconHome,
  IconSettings,
  IconUser,
  IconBell,
  IconMessage,
  IconChartBar,
  IconFolder,
  IconSearch,
  IconLayoutSidebar,
  IconLogout,
  IconMail,
  IconCalendar,
  IconUsers,
  IconDatabase,
  IconCloud,
  IconCode,
  IconPlus,
  IconFile,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconStar,
  IconHeart,
  IconBookmark,
} from "@tabler/icons-react"
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

const basicCode = `import { useState } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarSearch,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarUser,
  ThemeToggle,
} from "@/components/ui/sidebar"

export function BasicSidebarDemo() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar>
          <SidebarHeader title="My App" sticky />
          <SidebarSearch
            placeholder="Search..."
            value={searchValue}
            onChange={setSearchValue}
          />
          <SidebarContent>
            <SidebarGroup label="Main">
              <SidebarItem
                to="/home"
                icon={<HomeIcon />}
                badge={5}
                badgeVariant="destructive"
              >
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter sticky>
            <SidebarUser
              name="John Doe"
              email="john@example.com"
              menuItems={[
                { label: "Profile", onClick: () => {} },
                { label: "Logout", destructive: true },
              ]}
            />
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <main>{/* Your content */}</main>
      </div>
    </SidebarProvider>
  )
}`

const longScrollCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

export function LongScrollDemo() {
  return (
    <SidebarProvider collapsible="icon">
      <div className="flex">
        <Sidebar>
          <SidebarHeader title="Files" sticky />
          <SidebarContent showScrollTop>
            <SidebarGroup label="Favorites">
              <SidebarItem to="/star" icon={<StarIcon />} badge={5}>
                Starred
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div />
          </SidebarFooter>
        </Sidebar>
        <main />
      </div>
    </SidebarProvider>
  )
}`

const collapsedBadgesCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
  SidebarBadge,
} from "@/components/ui/sidebar"

export function CollapsedBadgesDemo() {
  return (
    <SidebarProvider collapsible="icon" defaultCollapsed>
      <Sidebar>
        <SidebarHeader title="Badges" />
        <SidebarContent>
          <SidebarItem
            to="/inbox"
            icon={<MailIcon />}
            badge={24}
            badgeVariant="default"
          >
            Inbox
          </SidebarItem>
          <SidebarItem
            to="/notifications"
            icon={<BellIcon />}
            badge={3}
            badgeVariant="destructive"
          >
            Alerts
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}`

const hoverExpandCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
} from "@/components/ui/sidebar"

export function HoverExpandDemo() {
  return (
    <SidebarProvider
      collapsible="icon"
      defaultCollapsed
      hoverExpand
    >
      <Sidebar>
        <SidebarHeader title="Hover Me" />
        <SidebarContent>
          <SidebarItem to="/home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}`

const fullFeaturedCode = `import { useState } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarSearch,
  SidebarGroup,
  SidebarItem,
  SidebarItemGroup,
  SidebarDivider,
  SidebarFooter,
  SidebarUser,
  ThemeToggle,
} from "@/components/ui/sidebar"

export function FullFeaturedDemo() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <SidebarProvider collapsible="icon">
      <Sidebar>
        <SidebarHeader title="Kira Kit" sticky />
        <SidebarSearch
          placeholder="Search..."
          value={searchValue}
          onChange={setSearchValue}
        />
        <SidebarContent>
          <SidebarGroup label="Main">
            <SidebarItem
              to="/overview"
              icon={<HomeIcon />}
              badge={12}
              badgeVariant="default"
            >
              Home
            </SidebarItem>
          </SidebarGroup>
          <SidebarDivider />
          <SidebarItemGroup
            label="Settings"
            icon={<SettingsIcon />}
          >
            <SidebarItem to="/settings/profile" level={1}>
              Profile
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarContent>
        <SidebarFooter sticky>
          <SidebarUser
            name="John Doe"
            email="john@example.com"
            menuItems={[
              { label: "Profile", onClick: () => {} },
              { label: "Logout", destructive: true },
            ]}
          />
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}`

const collapsibleModesCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
} from "@/components/ui/sidebar"

export function CollapsibleModesDemo() {
  return (
    <>
      <SidebarProvider collapsible="icon">
        <Sidebar>
          <SidebarHeader title="Icon" />
          <SidebarContent>
            <SidebarItem to="/home" icon={<HomeIcon />}>
              Home
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>

      <SidebarProvider collapsible="offcanvas">
        <Sidebar>
          <SidebarHeader title="Offcanvas" />
          <SidebarContent>
            <SidebarItem to="/home" icon={<HomeIcon />}>
              Home
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>

      <SidebarProvider collapsible="none">
        <Sidebar>
          <SidebarHeader title="Fixed" showToggle={false} />
          <SidebarContent>
            <SidebarItem to="/home" icon={<HomeIcon />}>
              Home
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </>
  )
}`

const rightSidebarCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
} from "@/components/ui/sidebar"

export function RightSidebarDemo() {
  return (
    <SidebarProvider side="right" collapsible="icon">
      <Sidebar>
        <SidebarHeader title="Right" />
        <SidebarContent>
          <SidebarItem to="/details" icon={<DatabaseIcon />}>
            Details
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}`

const variantsCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
} from "@/components/ui/sidebar"

export function VariantsDemo() {
  return (
    <>
      <SidebarProvider>
        <Sidebar variant="floating">
          <SidebarHeader title="Floating" />
          <SidebarContent>
            <SidebarItem to="/home" icon={<HomeIcon />}>
              Home
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>

      <SidebarProvider>
        <Sidebar variant="inset">
          <SidebarHeader title="Inset" />
          <SidebarContent>
            <SidebarItem to="/home" icon={<HomeIcon />}>
              Home
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </>
  )
}`

const skeletonCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarSkeleton,
} from "@/components/ui/sidebar"

export function SkeletonDemo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader title="Loading" />
        <SidebarSkeleton items={6} />
      </Sidebar>
    </SidebarProvider>
  )
}`

const menuButtonsCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function MenuButtonsDemo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader title="Actions" />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<PlusIcon />}
                onClick={() => alert("Create new item")}
                badge="+" 
                badgeVariant="success"
              >
                Create New
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<SearchIcon />}
                onClick={() => alert("Open search")}
              >
                Search
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}`

const usageCode = `import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarSearch,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarUser,
  ThemeToggle,
} from "@/components/ui/sidebar"

<SidebarProvider
  collapsible="icon"      // "icon" | "offcanvas" | "none"
  side="left"             // "left" | "right"
  persistState={true}     // Save collapsed state to localStorage
  width="16rem"           // Custom expanded width
  collapsedWidth="4rem"   // Custom collapsed width
  hoverExpand={false}     // Enable hover-to-expand (2025)
>
  <div className="flex">
    <Sidebar variant="default">
      <SidebarHeader title="My App" sticky />
      <SidebarSearch placeholder="Search..." />
      <SidebarContent showScrollTop>
        <SidebarGroup label="Main">
          <SidebarItem
            to="/home"
            icon={<HomeIcon />}
            badge={5}
            badgeVariant="destructive"
            shortcut="G H"
          >
            Home
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter sticky>
        <SidebarUser
          name="John Doe"
          email="john@example.com"
          menuItems={[
            { label: "Profile", onClick: () => {} },
            { label: "Logout", destructive: true },
          ]}
        />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
    <main>{/* Your content */}</main>
  </div>
</SidebarProvider>

// Keyboard Shortcuts:
// - Ctrl/Cmd + B: Toggle sidebar
// - Ctrl/Cmd + K: Focus search

// Accessibility:
// - ARIA landmarks (role="navigation")
// - aria-expanded on collapsible elements
// - aria-current="page" on active items
// - prefers-reduced-motion support`

function SidebarToggle() {
  const { collapsed, setCollapsed, collapsible } = useSidebar()

  if (collapsible === "none") {
    return (
      <Button variant="outline" size="sm" disabled>
        <IconLayoutSidebar className="h-4 w-4 mr-2" />
        Not Collapsible
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCollapsed(!collapsed)}
    >
      <IconLayoutSidebar className="h-4 w-4 mr-2" />
      {collapsed ? "Expand" : "Collapse"}
    </Button>
  )
}

function BasicDemo() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <SidebarProvider persistState={false}>
      <div className="flex border border-border rounded-lg overflow-hidden h-[400px]">
        <Sidebar>
          <SidebarHeader title="Basic" sticky />
          <SidebarSearch
            placeholder="Search..."
            value={searchValue}
            onChange={setSearchValue}
          />
          <SidebarContent>
            <SidebarGroup label="Main" defaultOpen>
              <SidebarItem
                to="/home"
                icon={<IconHome className="w-5 h-5" />}
                badge={5}
                badgeVariant="destructive"
              >
                Home
              </SidebarItem>
              <SidebarItem
                to="/messages"
                icon={<IconMessage className="w-5 h-5" />}
                badge={12}
                badgeVariant="default"
              >
                Messages
              </SidebarItem>
              <SidebarItem
                to="/notifications"
                icon={<IconBell className="w-5 h-5" />}
                badge={3}
                badgeVariant="destructive"
              >
                Notifications
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter sticky>
            <SidebarUser
              name="John Doe"
              email="john@example.com"
              menuItems={[
                {
                  label: "Profile",
                  icon: <IconUser className="w-4 h-4" />,
                  onClick: () => console.log("Profile"),
                },
                {
                  label: "Logout",
                  icon: <IconLogout className="w-4 h-4" />,
                  onClick: () => console.log("Logout"),
                  destructive: true,
                },
              ]}
            />
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 flex flex-col gap-4">
          <SidebarToggle />
          {searchValue && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                Search value: <strong>{searchValue}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  )
}

function LongScrollDemo() {
  return (
    <SidebarProvider collapsible="icon" persistState={false}>
      <div className="flex border border-border rounded-lg overflow-hidden h-[500px]">
        <Sidebar>
          <SidebarHeader title="Files" sticky />
          <SidebarContent showScrollTop>
            <SidebarGroup label="Favorites" defaultOpen>
              <SidebarItem
                to="/star"
                icon={<IconStar className="w-5 h-5" />}
                badge={5}
              >
                Starred
              </SidebarItem>
              <SidebarItem
                to="/heart"
                icon={<IconHeart className="w-5 h-5" />}
                badge={12}
                badgeVariant="destructive"
              >
                Favorites
              </SidebarItem>
              <SidebarItem
                to="/bookmark"
                icon={<IconBookmark className="w-5 h-5" />}
              >
                Bookmarks
              </SidebarItem>
            </SidebarGroup>
            <SidebarDivider />
            <SidebarGroup label="Files" defaultOpen>
              <SidebarItem
                to="/documents"
                icon={<IconFile className="w-5 h-5" />}
              >
                Documents
              </SidebarItem>
              <SidebarItem
                to="/photos"
                icon={<IconPhoto className="w-5 h-5" />}
                badge={234}
              >
                Photos
              </SidebarItem>
              <SidebarItem
                to="/videos"
                icon={<IconVideo className="w-5 h-5" />}
              >
                Videos
              </SidebarItem>
              <SidebarItem
                to="/music"
                icon={<IconMusic className="w-5 h-5" />}
              >
                Music
              </SidebarItem>
            </SidebarGroup>
            <SidebarDivider />
            <SidebarGroup label="New Components 2025-2026" defaultOpen>
              <SidebarItem to="/components/new-components-showcase" icon={<IconCode className="w-5 h-5" />}>
                Breadcrumb
              </SidebarItem>
              <SidebarItem to="/components/new-components-showcase" icon={<IconLayoutSidebar className="w-5 h-5" />}>
                Command Palette
              </SidebarItem>
              <SidebarItem to="/components/new-components-showcase" icon={<IconBell className="w-5 h-5" />}>
                Announcement Bar
              </SidebarItem>
              <SidebarItem to="/components/new-components-showcase" icon={<IconUsers className="w-5 h-5" />}>
                Stepper
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div />
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Content Area</h3>
            <SidebarToggle />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Scroll down in the sidebar to see the scroll-to-top button.
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

function CollapsedBadgesDemo() {
  return (
    <SidebarProvider
      collapsible="icon"
      defaultCollapsed
      persistState={false}
    >
      <div className="flex border border-border rounded-lg overflow-hidden h-[400px]">
        <Sidebar>
          <SidebarHeader title="Badges" />
          <SidebarContent>
            <SidebarItem
              to="/inbox"
              icon={<IconMail className="w-5 h-5" />}
              badge={24}
              badgeVariant="default"
            >
              Inbox
            </SidebarItem>
            <SidebarItem
              to="/notifications"
              icon={<IconBell className="w-5 h-5" />}
              badge={3}
              badgeVariant="destructive"
            >
              Alerts
            </SidebarItem>
            <SidebarItem
              to="/analytics"
              icon={<IconChartBar className="w-5 h-5" />}
              badge="New"
              badgeVariant="success"
            >
              Analytics
            </SidebarItem>
            <SidebarItem
              to="/beta"
              icon={<IconCode className="w-5 h-5" />}
              badge="Beta"
              badgeVariant="warning"
            >
              Beta Features
            </SidebarItem>
            <SidebarDivider />
            <SidebarItemGroup
              label="Projects"
              icon={<IconFolder className="w-5 h-5" />}
              badge={5}
              badgeVariant="secondary"
            >
              <SidebarItem to="/project/1" level={1}>
                Project Alpha
              </SidebarItem>
              <SidebarItem to="/project/2" level={1}>
                Project Beta
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-center text-sm">
            Notice the colored dots on the collapsed icons indicating badges.
            <br />
            Hover over icons to see full badge values in tooltips.
          </p>
          <SidebarToggle />
        </div>
      </div>
    </SidebarProvider>
  )
}

function HoverExpandDemo() {
  return (
    <SidebarProvider
      collapsible="icon"
      defaultCollapsed
      hoverExpand
      persistState={false}
    >
      <div className="flex border border-border rounded-lg overflow-hidden h-[400px]">
        <Sidebar>
          <SidebarHeader title="Hover Me" />
          <SidebarContent>
            <SidebarItem
              to="/home"
              icon={<IconHome className="w-5 h-5" />}
            >
              Home
            </SidebarItem>
            <SidebarItem
              to="/messages"
              icon={<IconMessage className="w-5 h-5" />}
              badge={8}
            >
              Messages
            </SidebarItem>
            <SidebarItem
              to="/calendar"
              icon={<IconCalendar className="w-5 h-5" />}
            >
              Calendar
            </SidebarItem>
            <SidebarItem
              to="/settings"
              icon={<IconSettings className="w-5 h-5" />}
            >
              Settings
            </SidebarItem>
          </SidebarContent>
          <SidebarFooter>
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-center text-sm">
            Hover over the collapsed sidebar to temporarily expand it.
            <br />
            The sidebar will collapse again when you move away.
          </p>
          <SidebarToggle />
        </div>
      </div>
    </SidebarProvider>
  )
}

function FullFeaturedDemo() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <SidebarProvider collapsible="icon" persistState={false}>
      <div className="flex border border-border rounded-lg overflow-hidden h-[600px]">
        <Sidebar>
          <SidebarHeader title="Kira Kit" sticky />
          <SidebarSearch
            placeholder="Search..."
            value={searchValue}
            onChange={setSearchValue}
          />
          <SidebarContent>
            <SidebarGroup label="Main" defaultOpen>
              <SidebarItem
                to="/overview"
                icon={<IconHome className="w-5 h-5" />}
              >
                Home
              </SidebarItem>
              <SidebarItem
                to="/messages"
                icon={<IconMessage className="w-5 h-5" />}
                badge={12}
                badgeVariant="default"
              >
                Messages
              </SidebarItem>
              <SidebarItem
                to="/notifications"
                icon={<IconBell className="w-5 h-5" />}
                badge={3}
                badgeVariant="destructive"
              >
                Notifications
              </SidebarItem>
              <SidebarItem
                to="/analytics"
                icon={<IconChartBar className="w-5 h-5" />}
                badge="New"
                badgeVariant="success"
              >
                Analytics
              </SidebarItem>
            </SidebarGroup>
            <SidebarDivider />
            <SidebarGroup label="Workspace" defaultOpen>
              <SidebarItem
                to="/calendar"
                icon={<IconCalendar className="w-5 h-5" />}
                shortcut="G C"
              >
                Calendar
              </SidebarItem>
              <SidebarItem
                to="/team"
                icon={<IconUsers className="w-5 h-5" />}
              >
                Team
              </SidebarItem>
              <SidebarItem
                to="/files"
                icon={<IconFolder className="w-5 h-5" />}
              >
                Files
              </SidebarItem>
            </SidebarGroup>
            <SidebarDivider />
            <SidebarItemGroup
              label="Settings"
              icon={<IconSettings className="w-5 h-5" />}
            >
              <SidebarItem to="/settings/profile" level={1}>
                Profile
              </SidebarItem>
              <SidebarItem to="/settings/security" level={1}>
                Security
              </SidebarItem>
              <SidebarItem to="/settings/billing" level={1}>
                Billing
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarContent>
          <SidebarFooter sticky>
            <SidebarUser
              name="John Doe"
              email="john@example.com"
              menuItems={[
                {
                  label: "Profile",
                  icon: <IconUser className="w-4 h-4" />,
                  onClick: () => console.log("Profile"),
                },
                {
                  label: "Settings",
                  icon: <IconSettings className="w-4 h-4" />,
                  onClick: () => console.log("Settings"),
                },
                {
                  label: "Logout",
                  icon: <IconLogout className="w-4 h-4" />,
                  onClick: () => console.log("Logout"),
                  destructive: true,
                },
              ]}
            />
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 bg-background">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Content Area</h3>
            <SidebarToggle />
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              This sidebar demonstrates all features including badges,
              search, keyboard shortcuts, sticky header/footer, and user
              profile section.
            </p>
            {searchValue && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Search value: <strong>{searchValue}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

function CollapsibleModesDemo() {
  return (
    <div className="space-y-6">
      <SidebarProvider
        collapsible="icon"
        defaultCollapsed
        persistState={false}
      >
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Icon Mode (default)</p>
            <p className="text-xs text-muted-foreground">
              Collapses to show icons only with tooltips
            </p>
          </div>
          <div className="flex h-[250px]">
            <Sidebar>
              <SidebarHeader title="Icon" />
              <SidebarContent>
                <SidebarItem
                  to="/home"
                  icon={<IconHome className="w-5 h-5" />}
                >
                  Home
                </SidebarItem>
                <SidebarItem
                  to="/mail"
                  icon={<IconMail className="w-5 h-5" />}
                  badge={5}
                >
                  Mail
                </SidebarItem>
                <SidebarItem
                  to="/settings"
                  icon={<IconSettings className="w-5 h-5" />}
                >
                  Settings
                </SidebarItem>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground text-center">
                Hover icons for tooltips
              </p>
              <SidebarToggle />
            </div>
          </div>
        </div>
      </SidebarProvider>

      <SidebarProvider collapsible="offcanvas" persistState={false}>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Offcanvas Mode</p>
            <p className="text-xs text-muted-foreground">
              Hides completely when collapsed
            </p>
          </div>
          <div className="flex h-[250px]">
            <Sidebar>
              <SidebarHeader title="Offcanvas" />
              <SidebarContent>
                <SidebarItem
                  to="/home"
                  icon={<IconHome className="w-5 h-5" />}
                >
                  Home
                </SidebarItem>
                <SidebarItem
                  to="/mail"
                  icon={<IconMail className="w-5 h-5" />}
                >
                  Mail
                </SidebarItem>
                <SidebarItem
                  to="/settings"
                  icon={<IconSettings className="w-5 h-5" />}
                >
                  Settings
                </SidebarItem>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground text-center">
                Sidebar slides away
              </p>
              <SidebarToggle />
            </div>
          </div>
        </div>
      </SidebarProvider>

      <SidebarProvider collapsible="none" persistState={false}>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">None Mode</p>
            <p className="text-xs text-muted-foreground">
              Cannot be collapsed
            </p>
          </div>
          <div className="flex h-[250px]">
            <Sidebar>
              <SidebarHeader title="Fixed" showToggle={false} />
              <SidebarContent>
                <SidebarItem
                  to="/home"
                  icon={<IconHome className="w-5 h-5" />}
                >
                  Home
                </SidebarItem>
                <SidebarItem
                  to="/mail"
                  icon={<IconMail className="w-5 h-5" />}
                >
                  Mail
                </SidebarItem>
                <SidebarItem
                  to="/settings"
                  icon={<IconSettings className="w-5 h-5" />}
                >
                  Settings
                </SidebarItem>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground text-center">
                Always expanded
              </p>
              <SidebarToggle />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

function RightSidebarDemo() {
  return (
    <SidebarProvider
      side="right"
      collapsible="icon"
      persistState={false}
    >
      <div className="flex border border-border rounded-lg overflow-hidden h-[350px]">
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground">Content on the left</p>
          <SidebarToggle />
        </div>
        <Sidebar>
          <SidebarHeader title="Right" />
          <SidebarContent>
            <SidebarItem
              to="/details"
              icon={<IconDatabase className="w-5 h-5" />}
            >
              Details
            </SidebarItem>
            <SidebarItem
              to="/activity"
              icon={<IconChartBar className="w-5 h-5" />}
            >
              Activity
            </SidebarItem>
            <SidebarItem
              to="/cloud"
              icon={<IconCloud className="w-5 h-5" />}
            >
              Cloud
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}

function VariantsDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SidebarProvider collapsible="icon" persistState={false}>
        <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Floating</p>
            <p className="text-xs text-muted-foreground">
              Rounded corners, margin, and shadow
            </p>
          </div>
          <div className="flex h-[250px]">
            <Sidebar variant="floating">
              <SidebarHeader title="Floating" />
              <SidebarContent>
                <SidebarItem
                  to="/home"
                  icon={<IconHome className="w-5 h-5" />}
                >
                  Home
                </SidebarItem>
                <SidebarItem
                  to="/dashboard"
                  icon={<IconChartBar className="w-5 h-5" />}
                >
                  Dashboard
                </SidebarItem>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 flex items-center justify-center">
              <SidebarToggle />
            </div>
          </div>
        </div>
      </SidebarProvider>

      <SidebarProvider collapsible="icon" persistState={false}>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Inset</p>
            <p className="text-xs text-muted-foreground">
              Subtle background, no border
            </p>
          </div>
          <div className="flex h-[250px]">
            <Sidebar variant="inset">
              <SidebarHeader title="Inset" />
              <SidebarContent>
                <SidebarItem
                  to="/home"
                  icon={<IconHome className="w-5 h-5" />}
                >
                  Home
                </SidebarItem>
                <SidebarItem
                  to="/dashboard"
                  icon={<IconChartBar className="w-5 h-5" />}
                >
                  Dashboard
                </SidebarItem>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 flex items-center justify-center">
              <SidebarToggle />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

function SkeletonDemo() {
  return (
    <SidebarProvider collapsible="icon" persistState={false}>
      <div className="flex border border-border rounded-lg overflow-hidden h-[300px]">
        <Sidebar>
          <SidebarHeader title="Loading" />
          <SidebarSkeleton items={6} />
        </Sidebar>
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground">Skeleton loading animation</p>
          <SidebarToggle />
        </div>
      </div>
    </SidebarProvider>
  )
}

function MenuButtonsDemo() {
  return (
    <SidebarProvider collapsible="icon" persistState={false}>
      <div className="flex border border-border rounded-lg overflow-hidden h-[300px]">
        <Sidebar>
          <SidebarHeader title="Actions" />
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconPlus className="w-5 h-5" />}
                  onClick={() => alert("Create new item")}
                  badge="+" 
                  badgeVariant="success"
                >
                  Create New
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconSearch className="w-5 h-5" />}
                  onClick={() => alert("Open search")}
                >
                  Search
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconSettings className="w-5 h-5" />}
                  onClick={() => alert("Open settings")}
                  isActive
                >
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground">
            Click buttons to trigger actions
          </p>
          <SidebarToggle />
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function SidebarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Sidebar"
        description="A responsive sidebar component for application navigation with collapsible groups, theme toggle, badges, search, user profile, and more. Built with 2025-2026 best practices including WCAG 2.2 compliance, reduced motion support, and modern UX patterns."
        version="v2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Keyboard Shortcuts",
            description: "Full keyboard support with Ctrl+B to toggle and Ctrl+K to focus search. Proper ARIA navigation pattern with arrow key navigation.",
          },
          {
            title: "Flexible Collapsing",
            description: "Three collapsible modes: icon (icons only), offcanvas (slides away), and none (fixed). Includes hover-expand for quick access.",
          },
          {
            title: "Persistent State",
            description: "Automatically saves collapsed state to localStorage. Scroll position and user preferences persist across sessions.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Sidebar"
                description="Basic sidebar with search, badges, and user profile."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "long-scroll",
            label: "Long Scroll",
            demo: (
              <DemoWrapper
                title="Long Navigation"
                description="Sidebar with many items. A scroll-to-top button appears when you scroll down."
                code={longScrollCode}
              >
                <LongScrollDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "collapsed-badges",
            label: "Collapsed Badges",
            demo: (
              <DemoWrapper
                title="Dot Indicators"
                description="Badges appear as small dot indicators when collapsed. Hover over items to see full values in tooltips."
                code={collapsedBadgesCode}
              >
                <CollapsedBadgesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "hover-expand",
            label: "Hover Expand",
            demo: (
              <DemoWrapper
                title="Hover-to-Expand"
                description="Enable hoverExpand to temporarily expand the sidebar when hovering while collapsed."
                code={hoverExpandCode}
              >
                <HoverExpandDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "full-featured",
            label: "Full Featured",
            demo: (
              <DemoWrapper
                title="Complete Sidebar"
                description="Complete sidebar with all features including search, badges, user profile, keyboard shortcuts, and sticky header/footer."
                code={fullFeaturedCode}
              >
                <FullFeaturedDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "collapsible-modes",
            label: "Collapsible Modes",
            demo: (
              <DemoWrapper
                title="Three Collapsible Modes"
                description="Icon mode (icons only), offcanvas mode (slides away), and none mode (not collapsible)."
                code={collapsibleModesCode}
              >
                <CollapsibleModesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "right-sidebar",
            label: "Right Sidebar",
            demo: (
              <DemoWrapper
                title="Right-Aligned"
                description="Use side='right' for a right-aligned sidebar."
                code={rightSidebarCode}
              >
                <RightSidebarDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "variants",
            label: "Variants",
            demo: (
              <DemoWrapper
                title="Visual Variants"
                description="Floating variant with rounded corners and shadow, and inset variant with subtle background."
                code={variantsCode}
              >
                <VariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "skeleton",
            label: "Skeleton",
            demo: (
              <DemoWrapper
                title="Loading State"
                description="Use SidebarSkeleton to show a loading state while content is being fetched."
                code={skeletonCode}
              >
                <SkeletonDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "menu-buttons",
            label: "Menu Buttons",
            demo: (
              <DemoWrapper
                title="Interactive Buttons"
                description="Use SidebarMenuButton for interactive buttons that aren't navigation links."
                code={menuButtonsCode}
              >
                <MenuButtonsDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Ctrl / Cmd + B", description: "Toggle sidebar collapse" },
          { keys: "Ctrl / Cmd + K", description: "Focus search input" },
          { keys: "Escape", description: "Close search/collapse" },
          { keys: "↑ / ↓", description: "Navigate items" },
          { keys: "Enter / Space", description: "Activate item" },
          { keys: "Home / End", description: "Jump to first/last item" },
        ]}
        title="Keyboard Navigation"
        description="Full keyboard support for accessibility"
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation example with all key features"
      />

      <APIReference
        title="API Reference"
        description="Key props and configuration options for all Sidebar components"
        sections={[
          {
            title: "SidebarProvider",
            props: [
              {
                prop: "collapsible",
                type: '"icon" | "offcanvas" | "none"',
                default: "icon",
                description: "How the sidebar collapses when toggled.",
              },
              {
                prop: "side",
                type: '"left" | "right"',
                default: "left",
                description: "Which side of the screen the sidebar appears on.",
              },
              {
                prop: "defaultCollapsed",
                type: "boolean",
                default: "false",
                description: "Initial collapsed state.",
              },
              {
                prop: "persistState",
                type: "boolean",
                default: "true",
                description: "Save collapsed state to localStorage.",
              },
              {
                prop: "width",
                type: "string",
                default: "16rem",
                description: "Custom expanded width.",
              },
              {
                prop: "collapsedWidth",
                type: "string",
                default: "4rem",
                description: "Custom collapsed width.",
              },
              {
                prop: "hoverExpand",
                type: "boolean",
                default: "false",
                description: "Enable hover-to-expand (2025 feature).",
              },
            ],
          },
          {
            title: "Sidebar",
            props: [
              {
                prop: "variant",
                type: '"default" | "floating" | "inset"',
                default: "default",
                description: "Visual style variant.",
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
            title: "SidebarHeader",
            props: [
              {
                prop: "title",
                type: "string",
                default: "-",
                description: "Header title text.",
              },
              {
                prop: "logo",
                type: "React.ReactNode",
                default: "-",
                description: "Custom logo element.",
              },
              {
                prop: "showToggle",
                type: "boolean",
                default: "true",
                description: "Show collapse toggle button.",
              },
              {
                prop: "sticky",
                type: "boolean",
                default: "false",
                description: "Make header sticky.",
              },
            ],
          },
          {
            title: "SidebarFooter",
            props: [
              {
                prop: "sticky",
                type: "boolean",
                default: "false",
                description: "Make footer sticky.",
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
            title: "SidebarContent",
            props: [
              {
                prop: "showScrollTop",
                type: "boolean",
                default: "true",
                description: "Show scroll-to-top button.",
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
            title: "SidebarGroup",
            props: [
              {
                prop: "label",
                type: "string",
                default: "-",
                description: "Group label text.",
              },
              {
                prop: "defaultOpen",
                type: "boolean",
                default: "true",
                description: "Initial open state.",
              },
            ],
          },
          {
            title: "SidebarItem",
            props: [
              {
                prop: "to",
                type: "string",
                default: "-",
                description: "Navigation URL (required).",
              },
              {
                prop: "icon",
                type: "React.ReactNode",
                default: "-",
                description: "Icon element.",
              },
              {
                prop: "badge",
                type: "React.ReactNode",
                default: "-",
                description: "Badge content (shows dot when collapsed).",
              },
              {
                prop: "badgeVariant",
                type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"',
                default: "default",
                description: "Badge visual variant.",
              },
              {
                prop: "shortcut",
                type: "string",
                default: "-",
                description: "Keyboard shortcut display.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disabled state.",
              },
              {
                prop: "level",
                type: "number",
                default: "0",
                description: "Nesting level (0, 1, 2, etc.).",
              },
            ],
          },
          {
            title: "SidebarItemGroup",
            props: [
              {
                prop: "label",
                type: "string",
                default: "-",
                description: "Group label text.",
              },
              {
                prop: "icon",
                type: "React.ReactNode",
                default: "-",
                description: "Group icon element.",
              },
              {
                prop: "badge",
                type: "React.ReactNode",
                default: "-",
                description: "Badge content for the group.",
              },
              {
                prop: "badgeVariant",
                type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"',
                default: "default",
                description: "Badge visual variant.",
              },
              {
                prop: "defaultOpen",
                type: "boolean",
                default: "true",
                description: "Initial open state.",
              },
            ],
          },
          {
            title: "SidebarBadge",
            props: [
              {
                prop: "variant",
                type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"',
                default: "default",
                description: "Badge visual variant.",
              },
              {
                prop: "size",
                type: '"default" | "sm" | "dot"',
                default: "default",
                description: "Badge size (dot for collapsed state).",
              },
            ],
          },
          {
            title: "SidebarSearch",
            props: [
              {
                prop: "placeholder",
                type: "string",
                default: "Search...",
                description: "Input placeholder text.",
              },
              {
                prop: "value",
                type: "string",
                default: "-",
                description: "Controlled input value.",
              },
              {
                prop: "onChange",
                type: "(value: string) => void",
                default: "-",
                description: "Value change handler.",
              },
            ],
          },
          {
            title: "SidebarUser",
            props: [
              {
                prop: "name",
                type: "string",
                default: "-",
                description: "User display name.",
              },
              {
                prop: "email",
                type: "string",
                default: "-",
                description: "User email address.",
              },
              {
                prop: "avatar",
                type: "React.ReactNode",
                default: "-",
                description: "Custom avatar element.",
              },
              {
                prop: "menuItems",
                type: "UserMenuItem[]",
                default: "[]",
                description: "Dropdown menu items.",
              },
            ],
          },
          {
            title: "SidebarMenu",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "SidebarMenuItem",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "SidebarMenuButton",
            props: [
              {
                prop: "icon",
                type: "React.ReactNode",
                default: "-",
                description: "Button icon.",
              },
              {
                prop: "badge",
                type: "React.ReactNode",
                default: "-",
                description: "Badge content.",
              },
              {
                prop: "badgeVariant",
                type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"',
                default: "default",
                description: "Badge visual variant.",
              },
              {
                prop: "isActive",
                type: "boolean",
                default: "false",
                description: "Active state.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disabled state.",
              },
              {
                prop: "onClick",
                type: "() => void",
                default: "-",
                description: "Click handler.",
              },
            ],
          },
          {
            title: "SidebarSkeleton",
            props: [
              {
                prop: "items",
                type: "number",
                default: "6",
                description: "Number of skeleton items to show.",
              },
            ],
          },
          {
            title: "useSidebar() Hook",
            props: [
              {
                prop: "collapsed",
                type: "boolean",
                default: "-",
                description: "Current collapsed state.",
              },
              {
                prop: "setCollapsed",
                type: "(collapsed: boolean) => void",
                default: "-",
                description: "Toggle collapsed state function.",
              },
              {
                prop: "collapsible",
                type: '"icon" | "offcanvas" | "none"',
                default: "-",
                description: "Current collapsible mode.",
              },
              {
                prop: "side",
                type: '"left" | "right"',
                default: "-",
                description: "Current sidebar side.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
