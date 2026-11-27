import * as React from "react";
import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteSpotlightProvider } from "@/components/site/site-spotlight-context";
import { OptimisticFeedbackProvider } from "@/hooks/use-optimistic-commit";
import { PresetProvider } from "@/lib/theme-presets";

const LazyToastProvider = React.lazy(() =>
  import("@/components/ui/toast").then((module) => ({
    default: module.KiraToastProvider,
  })),
);

function DeferredToastViewport() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      React.startTransition(() => setReady(true));
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <React.Suspense fallback={null}>
      <LazyToastProvider />
    </React.Suspense>
  );
}

/**
 * Provider stack for the whole site. It sits on the root route instead of the
 * app shell so the marketing landing page — which has no sidebar — still gets
 * theming, tooltips and toasts.
 */
export function RootProviders() {
  return (
    <ThemeProvider>
      <PresetProvider>
        <OptimisticFeedbackProvider
          onError={({ title, description }) => {
            void import("@/components/ui/toast").then(({ toast }) => {
              toast.error(title, description ? { description } : undefined);
            });
          }}
        >
          <TooltipProvider>
            <SiteSpotlightProvider>
              <DeferredToastViewport />
              <Outlet />
            </SiteSpotlightProvider>
          </TooltipProvider>
        </OptimisticFeedbackProvider>
      </PresetProvider>
    </ThemeProvider>
  );
}
