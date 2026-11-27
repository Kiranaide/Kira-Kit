import {
  Link,
  Outlet,
  useLocation,
  useRouterState,
} from "@tanstack/react-router";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarDivider,
  SidebarProvider,
  SidebarRouterProvider,
  SidebarTrigger,
  type SidebarLinkProps,
  type SidebarRouterAdapter,
} from "@/components/ui/sidebar";
import {
  RouteTransition,
  NavigationProgress,
} from "@/components/ui/route-transition";
import {
  componentsNavigation,
  docsNavigation,
  layoutNavigation,
} from "@/components/site/site-navigation";
import { supportsViewTransitionTypes } from "@/lib/view-transition";
import { IconHome, IconRuler2 } from "@tabler/icons-react";

function TanStackSidebarLink({ to, disabled, ...props }: SidebarLinkProps) {
  return <Link {...props} to={to} disabled={disabled} />;
}

function useTanStackIsActive(to: string) {
  return useLocation({ select: (location) => location.pathname === to });
}

const tanStackSidebarRouter: SidebarRouterAdapter = {
  Link: TanStackSidebarLink,
  useIsActive: useTanStackIsActive,
};

export function AppLayout() {
  return (
    <SidebarRouterProvider adapter={tanStackSidebarRouter}>
      <SidebarProvider>
        <div className="flex h-dvh overflow-hidden print:h-auto print:overflow-visible">
          <MobileHeader />

          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarItem
                to="/overview"
                icon={<IconHome className="w-5 h-5" />}
              >
                Overview
              </SidebarItem>

              <SidebarItem
                to="/ui-preview"
                icon={<IconRuler2 className="w-5 h-5" />}
              >
                UI Preview
              </SidebarItem>

              <SidebarDivider />

              <DocsNavigation />

              <SidebarDivider />

              <SidebarGroup label="Layout">
                {layoutNavigation.map((item) => (
                  <SidebarItem
                    key={item.to}
                    to={item.to}
                    icon={<item.icon className="w-5 h-5" />}
                  >
                    {item.label}
                  </SidebarItem>
                ))}
              </SidebarGroup>

              <SidebarDivider />

              <SidebarGroup label="Components">
                {componentsNavigation.map((item) => (
                  <SidebarItem
                    key={item.to}
                    to={item.to}
                    icon={<item.icon className="w-5 h-5" />}
                  >
                    {item.label}
                  </SidebarItem>
                ))}
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main
            id="app-main"
            className="min-h-0 flex-1 overflow-y-auto bg-background pt-14 md:pt-0 print:overflow-visible print:pt-0"
          >
            <RouteOutlet />
          </main>

          <RouteProgress />
        </div>
      </SidebarProvider>
    </SidebarRouterProvider>
  );
}

function RouteOutlet() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <RouteTransition
      transitionKey={pathname}
      // The native crossfade owns the entrance where supported; running the
      // CSS fade on top of it (or restarting it when the crossfade ends)
      // reads as a double blink.
      variant={supportsViewTransitionTypes() ? "none" : "fade"}
    >
      <Outlet />
    </RouteTransition>
  );
}

function RouteProgress() {
  const isLoading = useRouterState({ select: (state) => state.isLoading });

  return <NavigationProgress active={isLoading} />;
}

function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 border-b border-border bg-background md:hidden print:hidden">
      <SidebarTrigger />
      <div className="flex items-center gap-2 ml-2">
        <Link
          to="/"
          className="docs-focus-ring flex items-center gap-2 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div
            aria-hidden="true"
            className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"
          >
            <span className="text-primary-foreground font-bold text-xs">K</span>
          </div>
          <span className="font-semibold text-foreground">
            Kira Kit<span className="sr-only"> home</span>
          </span>
        </Link>
      </div>
    </header>
  );
}

function DocsNavigation() {
  return (
    <SidebarGroup label="Documentation">
      {docsNavigation.map((item) => (
        <SidebarItem
          key={item.to}
          to={item.to}
          icon={<item.icon className="w-5 h-5" />}
        >
          {item.label}
        </SidebarItem>
      ))}
    </SidebarGroup>
  );
}
