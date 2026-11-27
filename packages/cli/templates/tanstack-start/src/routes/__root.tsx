import type { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
  useRouterState,
} from "@tanstack/react-router";
import {
  NavigationProgress,
  RouteTransition,
} from "@/components/ui/route-transition";
import { supportsViewTransitions } from "@/lib/view-transition";
import "@/index.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kira Kit + TanStack Start" },
    ],
  }),
  component: RootComponent,
});

function RouteOutlet() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <RouteTransition
      transitionKey={pathname}
      // One entrance mechanism per browser: the native crossfade where the
      // View Transitions API exists, the CSS fade everywhere else.
      variant={supportsViewTransitions() ? "none" : "fade"}
    >
      <Outlet />
    </RouteTransition>
  );
}

function RouteProgress() {
  const isLoading = useRouterState({ select: (state) => state.isLoading });

  return <NavigationProgress active={isLoading} />;
}

function RootComponent() {
  return (
    <RootDocument>
      <RouteOutlet />
      <RouteProgress />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
