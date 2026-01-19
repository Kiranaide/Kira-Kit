import { useState } from "react";
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
  SidebarBadge,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSkeleton,
  ThemeToggle,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
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
  IconArchive,
  IconDownload,
  IconUpload,
  IconStar,
  IconHeart,
  IconBookmark,
  IconTag,
} from "@tabler/icons-react";

// Simple sidebar toggle button for demos
function SidebarToggle() {
  const { collapsed, setCollapsed, collapsible } = useSidebar();

  if (collapsible === "none") {
    return (
      <Button variant="outline" size="sm" disabled>
        <IconLayoutSidebar className="h-4 w-4 mr-2" />
        Not Collapsible
      </Button>
    );
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
  );
}

export function SidebarPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="p-8 max-w-6xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Sidebar</h1>
        <p className="text-muted-foreground">
          A responsive sidebar component for application navigation with
          collapsible groups, theme toggle, badges, search, user profile, and
          more. Built with 2025-2026 best practices including WCAG 2.2
          compliance, reduced motion support, and modern UX patterns.
        </p>
      </header>

      {/* 2025 Features Highlight */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          2025-2026 Features
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium">Keyboard Shortcuts</span>
            <p className="text-xs text-muted-foreground mt-1">
              Ctrl+B toggle, Ctrl+K search
            </p>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium">Collapsible Modes</span>
            <p className="text-xs text-muted-foreground mt-1">
              icon, offcanvas, or none
            </p>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium">Persistent State</span>
            <p className="text-xs text-muted-foreground mt-1">
              localStorage persistence
            </p>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium">Collapsed Badges</span>
            <p className="text-xs text-muted-foreground mt-1">
              Dot indicators when collapsed
            </p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <span className="text-sm font-medium">Hover Expand</span>
            <p className="text-xs text-muted-foreground mt-1">
              Temporarily expand on hover
            </p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <span className="text-sm font-medium">Scroll to Top</span>
            <p className="text-xs text-muted-foreground mt-1">
              Auto scroll button for long lists
            </p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <span className="text-sm font-medium">Reduced Motion</span>
            <p className="text-xs text-muted-foreground mt-1">
              Respects prefers-reduced-motion
            </p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <span className="text-sm font-medium">WCAG 2.2 A11y</span>
            <p className="text-xs text-muted-foreground mt-1">
              ARIA landmarks & roles
            </p>
          </div>
        </div>
      </section>

      {/* Scroll Fix Demo - Many Items */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Long Navigation (Scroll Fix)
        </h2>
        <p className="text-sm text-muted-foreground">
          Sidebars with many items now properly scroll. A scroll-to-top button
          appears when you scroll down. Try scrolling to see the button appear.
        </p>
        <SidebarProvider collapsible="icon" persistState={false}>
          <div className="flex border border-border rounded-lg overflow-hidden h-[500px]">
            <Sidebar>
              <SidebarHeader title="Files" sticky />
              <SidebarSearch placeholder="Search files..." />
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
                  <SidebarItem
                    to="/archive"
                    icon={<IconArchive className="w-5 h-5" />}
                  >
                    Archive
                  </SidebarItem>
                </SidebarGroup>
                <SidebarDivider />
                <SidebarGroup label="Actions" defaultOpen>
                  <SidebarItem
                    to="/download"
                    icon={<IconDownload className="w-5 h-5" />}
                  >
                    Downloads
                  </SidebarItem>
                  <SidebarItem
                    to="/upload"
                    icon={<IconUpload className="w-5 h-5" />}
                  >
                    Uploads
                  </SidebarItem>
                  <SidebarItem
                    to="/tags"
                    icon={<IconTag className="w-5 h-5" />}
                  >
                    Tags
                  </SidebarItem>
                </SidebarGroup>
                <SidebarDivider />
                <SidebarGroup label="Workspace" defaultOpen>
                  <SidebarItem
                    to="/calendar"
                    icon={<IconCalendar className="w-5 h-5" />}
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
                    to="/messages"
                    icon={<IconMessage className="w-5 h-5" />}
                    badge={7}
                    badgeVariant="warning"
                  >
                    Messages
                  </SidebarItem>
                  <SidebarItem
                    to="/analytics"
                    icon={<IconChartBar className="w-5 h-5" />}
                  >
                    Analytics
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
                  <SidebarItem to="/settings/notifications" level={1}>
                    Notifications
                  </SidebarItem>
                  <SidebarItem to="/settings/billing" level={1}>
                    Billing
                  </SidebarItem>
                </SidebarItemGroup>
              </SidebarContent>
              <SidebarFooter sticky>
                <ThemeToggle />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6 bg-background flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Content Area</h3>
                <SidebarToggle />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Scroll down in the sidebar to see the scroll-to-top button.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sticky header and footer keep important elements visible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </section>

      {/* Collapsed Badges Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Collapsed Badges (Dot Indicators)
        </h2>
        <p className="text-sm text-muted-foreground">
          When the sidebar is collapsed, badges appear as small dot indicators
          on the icons. Hover over collapsed items to see the full badge in the
          tooltip.
        </p>
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
              <p className="text-muted-foreground text-center">
                Notice the colored dots on the collapsed icons indicating
                badges.
                <br />
                Hover over icons to see full badge values in tooltips.
              </p>
              <SidebarToggle />
            </div>
          </div>
        </SidebarProvider>
      </section>

      {/* Hover Expand Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Hover Expand (2025 UX Pattern)
        </h2>
        <p className="text-sm text-muted-foreground">
          Enable <code className="bg-muted px-1 rounded">hoverExpand</code> to
          temporarily expand the sidebar when hovering over it while collapsed.
          This provides quick access without permanently expanding.
        </p>
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
              <p className="text-muted-foreground text-center">
                Hover over the collapsed sidebar to temporarily expand it.
                <br />
                The sidebar will collapse again when you move away.
              </p>
              <SidebarToggle />
            </div>
          </div>
        </SidebarProvider>
      </section>

      {/* Full Featured Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Full Featured Demo
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete sidebar with search, badges, user profile, and all features.
          Try pressing{" "}
          <kbd className="px-1.5 py-0.5 rounded border bg-muted text-xs">
            Ctrl+B
          </kbd>{" "}
          to toggle.
        </p>
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
                <SidebarGroup label="Main" defaultOpen={true}>
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
                <SidebarGroup label="Workspace" defaultOpen={true}>
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
                  defaultOpen={false}
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
                <p className="text-muted-foreground">
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
      </section>

      {/* Collapsible Modes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Collapsible Modes
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Icon Mode */}
          <div>
            <p className="text-sm font-medium mb-2">Icon Mode (default)</p>
            <p className="text-xs text-muted-foreground mb-4">
              Collapses to show icons only with tooltips
            </p>
            <SidebarProvider
              collapsible="icon"
              defaultCollapsed
              persistState={false}
            >
              <div className="flex border border-border rounded-lg overflow-hidden h-[300px]">
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
            </SidebarProvider>
          </div>

          {/* Offcanvas Mode */}
          <div>
            <p className="text-sm font-medium mb-2">Offcanvas Mode</p>
            <p className="text-xs text-muted-foreground mb-4">
              Hides completely when collapsed
            </p>
            <SidebarProvider collapsible="offcanvas" persistState={false}>
              <div className="flex border border-border rounded-lg overflow-hidden h-[300px]">
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
            </SidebarProvider>
          </div>

          {/* None Mode */}
          <div>
            <p className="text-sm font-medium mb-2">None Mode</p>
            <p className="text-xs text-muted-foreground mb-4">
              Cannot be collapsed
            </p>
            <SidebarProvider collapsible="none" persistState={false}>
              <div className="flex border border-border rounded-lg overflow-hidden h-[300px]">
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
            </SidebarProvider>
          </div>
        </div>
      </section>

      {/* Badges Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Badge Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          6 badge variants plus a dot size for collapsed state indicators.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <SidebarBadge variant="default">12</SidebarBadge>
            <span className="text-xs text-muted-foreground">default</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarBadge variant="secondary">New</SidebarBadge>
            <span className="text-xs text-muted-foreground">secondary</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarBadge variant="destructive">3</SidebarBadge>
            <span className="text-xs text-muted-foreground">destructive</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarBadge variant="success">Live</SidebarBadge>
            <span className="text-xs text-muted-foreground">success</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarBadge variant="warning">Beta</SidebarBadge>
            <span className="text-xs text-muted-foreground">warning</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarBadge variant="outline">Pro</SidebarBadge>
            <span className="text-xs text-muted-foreground">outline</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarBadge variant="destructive" size="dot" />
            <span className="text-xs text-muted-foreground">dot (collapsed)</span>
          </div>
        </div>
      </section>

      {/* Right Sidebar Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Right Sidebar
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">side="right"</code> for a
          right-aligned sidebar.
        </p>
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
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium mb-2">Floating</p>
            <p className="text-sm text-muted-foreground mb-4">
              Rounded corners, margin, and shadow
            </p>
            <SidebarProvider collapsible="icon" persistState={false}>
              <div className="flex bg-muted/30 rounded-lg overflow-hidden h-[300px]">
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
            </SidebarProvider>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Inset</p>
            <p className="text-sm text-muted-foreground mb-4">
              Subtle background, no border
            </p>
            <SidebarProvider collapsible="icon" persistState={false}>
              <div className="flex border border-border rounded-lg overflow-hidden h-[300px]">
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
            </SidebarProvider>
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State (Skeleton)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use SidebarSkeleton to show a loading state while content is being
          fetched.
        </p>
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
      </section>

      {/* Menu Button Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Menu Buttons (Non-link Items)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use SidebarMenuButton for interactive buttons that aren't navigation
          links.
        </p>
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
                      badge={"+"}
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
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
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
// - prefers-reduced-motion support`}
          </pre>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          API Reference
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">SidebarProvider Props</h3>
            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                {`collapsible?: "icon" | "offcanvas" | "none"  // default: "icon"
side?: "left" | "right"                       // default: "left"
defaultCollapsed?: boolean                    // default: false
persistState?: boolean                        // default: true
width?: string                                // default: "16rem"
collapsedWidth?: string                       // default: "4rem"
hoverExpand?: boolean                         // default: false (2025 feature)`}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">SidebarHeader/Footer Props</h3>
            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                {`title?: string                // Header title text
logo?: React.ReactNode        // Custom logo element
showToggle?: boolean          // Show collapse toggle (default: true)
sticky?: boolean              // Make header/footer sticky (default: false)`}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">SidebarContent Props</h3>
            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                {`showScrollTop?: boolean       // Show scroll-to-top button (default: true)`}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">SidebarItem Props</h3>
            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                {`to: string                    // Navigation URL
icon?: React.ReactNode        // Icon element
badge?: React.ReactNode       // Badge content (shows dot when collapsed)
badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
shortcut?: string             // Keyboard shortcut display
disabled?: boolean            // Disabled state
level?: number                // Nesting level (0, 1, 2, etc.)`}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">SidebarBadge Props</h3>
            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                {`variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
size?: "default" | "sm" | "dot"  // "dot" for collapsed state indicators`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
