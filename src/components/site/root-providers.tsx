import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { KiraToastProvider, toast } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptimisticFeedbackProvider } from "@/hooks/use-optimistic-commit";
import { PresetProvider } from "@/lib/theme-presets";

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
            toast.error(title, description ? { description } : undefined);
          }}
        >
          <TooltipProvider>
            <KiraToastProvider />
            <Outlet />
          </TooltipProvider>
        </OptimisticFeedbackProvider>
      </PresetProvider>
    </ThemeProvider>
  );
}
