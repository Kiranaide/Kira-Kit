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
} from "@tabler/icons-react";

// Simple sidebar toggle button for demos
function SidebarToggle() {
  const { collapsed, setCollapsed } = useSidebar();
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
  return (
    <div className="p-8 max-w-6xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Sidebar</h1>
        <p className="text-muted-foreground">
          A responsive sidebar component for application navigation with
          collapsible groups, theme toggle, and more.
        </p>
      </header>

      {/* Demo Sidebar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Interactive Demo
        </h2>
        <p className="text-sm text-muted-foreground">
          Click the toggle button to collapse/expand the sidebar.
        </p>
        <SidebarProvider>
          <div className="flex border border-border rounded-lg overflow-hidden h-[500px]">
            {/* Sidebar */}
            <Sidebar>
              <SidebarHeader />
              <SidebarContent>
                <SidebarGroup label="Main" defaultOpen={true}>
                  <SidebarItem
                    to="/overview"
                    icon={<IconHome className="w-5 h-5" />}
                  >
                    Home
                  </SidebarItem>
                  <SidebarItem
                    to="/search"
                    icon={<IconSearch className="w-5 h-5" />}
                  >
                    Search
                  </SidebarItem>
                  <SidebarItem
                    to="/analytics"
                    icon={<IconChartBar className="w-5 h-5" />}
                  >
                    Analytics
                  </SidebarItem>
                </SidebarGroup>
                <SidebarDivider />
                <SidebarGroup label="Communication" defaultOpen={true}>
                  <SidebarItem
                    to="/messages"
                    icon={<IconMessage className="w-5 h-5" />}
                  >
                    Messages
                  </SidebarItem>
                  <SidebarItem
                    to="/notifications"
                    icon={<IconBell className="w-5 h-5" />}
                  >
                    Notifications
                  </SidebarItem>
                </SidebarGroup>
                <SidebarDivider />
                <SidebarGroup label="Content" defaultOpen={false}>
                  <SidebarItem
                    to="/files"
                    icon={<IconFolder className="w-5 h-5" />}
                  >
                    Files
                  </SidebarItem>
                  <SidebarItem
                    to="/profile"
                    icon={<IconUser className="w-5 h-5" />}
                  >
                    Profile
                  </SidebarItem>
                  <SidebarItem
                    to="/settings"
                    icon={<IconSettings className="w-5 h-5" />}
                  >
                    Settings
                  </SidebarItem>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <ThemeToggle />
              </SidebarFooter>
            </Sidebar>
            {/* Content Area */}
            <div className="flex-1 p-6 bg-background">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Content Area</h3>
                <SidebarToggle />
              </div>
              <p className="text-muted-foreground">
                This is the main content area. The sidebar can be collapsed to
                save space on smaller screens or when more content area is
                needed.
              </p>
            </div>
          </div>
        </SidebarProvider>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Collapsible:</strong> Toggle
            between expanded and collapsed states
          </li>
          <li>
            <strong className="text-foreground">Groups:</strong> Organize items
            into collapsible groups
          </li>
          <li>
            <strong className="text-foreground">Active State:</strong>
            Automatically highlights the current route
          </li>
          <li>
            <strong className="text-foreground">Theme Toggle:</strong> Built-in
            dark/light mode switcher
          </li>
          <li>
            <strong className="text-foreground">Icons:</strong> Support for
            icons in each item
          </li>
          <li>
            <strong className="text-foreground">Tooltips:</strong> Shows
            tooltips when collapsed
          </li>
        </ul>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Floating</p>
            <p className="text-sm text-muted-foreground mb-4">
              A sidebar with rounded corners, margin, and shadow for a floating
              appearance.
            </p>
            <SidebarProvider>
              <div className="flex bg-muted/30 rounded-lg overflow-hidden h-[350px]">
                <Sidebar variant="floating">
                  <SidebarHeader />
                  <SidebarContent>
                    <SidebarGroup label="Navigation">
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
                      <SidebarItem
                        to="/settings"
                        icon={<IconSettings className="w-5 h-5" />}
                      >
                        Settings
                      </SidebarItem>
                    </SidebarGroup>
                  </SidebarContent>
                  <SidebarFooter>
                    <ThemeToggle />
                  </SidebarFooter>
                </Sidebar>
                <div className="flex-1 p-6 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Floating sidebar with rounded corners
                  </p>
                </div>
              </div>
            </SidebarProvider>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Inset</p>
            <p className="text-sm text-muted-foreground mb-4">
              A subtle inset sidebar without border for minimal designs.
            </p>
            <SidebarProvider>
              <div className="flex border border-border rounded-lg overflow-hidden h-[350px]">
                <Sidebar variant="inset">
                  <SidebarHeader />
                  <SidebarContent>
                    <SidebarGroup label="Navigation">
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
                      <SidebarItem
                        to="/settings"
                        icon={<IconSettings className="w-5 h-5" />}
                      >
                        Settings
                      </SidebarItem>
                    </SidebarGroup>
                  </SidebarContent>
                  <SidebarFooter>
                    <ThemeToggle />
                  </SidebarFooter>
                </Sidebar>
                <div className="flex-1 p-6 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Inset sidebar with subtle background
                  </p>
                </div>
              </div>
            </SidebarProvider>
          </div>
        </div>
      </section>

      {/* Tree-View Feature */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Tree-View Navigation
        </h2>
        <p className="text-sm text-muted-foreground">
          Use SidebarItemGroup for tree-view like navigation with collapsible
          sub-items.
        </p>
        <SidebarProvider>
          <div className="flex border border-border rounded-lg overflow-hidden h-[400px]">
            <Sidebar>
              <SidebarHeader />
              <SidebarContent>
                <SidebarItemGroup
                  label="Documents"
                  icon={<IconFolder className="w-5 h-5" />}
                  defaultOpen={true}
                >
                  <SidebarItem to="/docs/intro" level={1}>
                    Introduction
                  </SidebarItem>
                  <SidebarItem to="/docs/getting-started" level={1}>
                    Getting Started
                  </SidebarItem>
                  <SidebarItem to="/docs/api" level={1}>
                    API Reference
                  </SidebarItem>
                </SidebarItemGroup>
                <SidebarItemGroup
                  label="Settings"
                  icon={<IconSettings className="w-5 h-5" />}
                >
                  <SidebarItem to="/settings/profile" level={1}>
                    Profile
                  </SidebarItem>
                  <SidebarItem to="/settings/notifications" level={1}>
                    Notifications
                  </SidebarItem>
                  <SidebarItem to="/settings/security" level={1}>
                    Security
                  </SidebarItem>
                </SidebarItemGroup>
                <SidebarDivider />
                <SidebarItem to="/home" icon={<IconHome className="w-5 h-5" />}>
                  Home
                </SidebarItem>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-6 flex items-center justify-center">
              <p className="text-muted-foreground">
                Click the groups to expand/collapse sub-items
              </p>
            </div>
          </div>
        </SidebarProvider>
      </section>

      {/* Component Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Component Breakdown
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium mb-2">SidebarProvider</h3>
            <p className="text-sm text-muted-foreground">
              Wraps the entire layout to provide sidebar state context.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium mb-2">Sidebar</h3>
            <p className="text-sm text-muted-foreground">
              The main container with responsive width.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium mb-2">SidebarHeader</h3>
            <p className="text-sm text-muted-foreground">
              Logo, title, and toggle button area.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium mb-2">SidebarGroup</h3>
            <p className="text-sm text-muted-foreground">
              Collapsible section with label and children items.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium mb-2">SidebarItem</h3>
            <p className="text-sm text-muted-foreground">
              Navigation link with icon and active state.
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium mb-2">SidebarFooter</h3>
            <p className="text-sm text-muted-foreground">
              Bottom section for theme toggle or user menu.
            </p>
          </div>
        </div>
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
  SidebarGroup,
  SidebarItem,
  SidebarItemGroup,
  SidebarFooter,
  SidebarDivider,
  ThemeToggle,
} from "@/components/ui/sidebar"

<SidebarProvider>
  <div className="flex">
    <Sidebar variant="default">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup label="Main">
          <SidebarItem to="/home" icon={<HomeIcon />}>
            Home
          </SidebarItem>
        </SidebarGroup>
        <SidebarDivider />
        <SidebarItemGroup label="Documents" icon={<FolderIcon />}>
          <SidebarItem to="/docs/intro" level={1}>
            Introduction
          </SidebarItem>
          <SidebarItem to="/docs/api" level={1}>
            API Reference
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
    <main>{/* Your content */}</main>
  </div>
</SidebarProvider>

// Variants
<Sidebar variant="floating" />  // Rounded with shadow
<Sidebar variant="inset" />      // Subtle background
<Sidebar variant="default" />    // Standard with border`}
          </pre>
        </div>
      </section>
    </div>
  );
}
