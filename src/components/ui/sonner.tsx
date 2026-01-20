import { useTheme } from "@/components/ui/sidebar";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Enhanced Toaster component with accessibility and styling improvements.
 *
 * Features:
 * - WCAG 2.2 AA compliant with proper ARIA live regions
 * - Respects `prefers-reduced-motion`
 * - Semantic color variants with icons
 * - Configurable position and duration
 *
 * @example
 * ```tsx
 * // In your app layout
 * <Toaster position="top-right" richColors />
 *
 * // Usage
 * import { toast } from "@/components/ui/toast";
 * toast.success("Saved successfully");
 * toast.error("Something went wrong");
 * ```
 */
const Toaster = ({
  position = "top-right",
  expand = false,
  richColors = true,
  closeButton = true,
  duration = 5000,
  visibleToasts = 3,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      duration={duration}
      visibleToasts={visibleToasts}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            "group toast",
            // Base styles
            "group-[.toaster]:bg-background",
            "group-[.toaster]:text-foreground",
            "group-[.toaster]:border-border",
            "group-[.toaster]:shadow-lg",
            "group-[.toaster]:rounded-lg",
            // Allow close button to be visible (not clipped)
            "group-[.toaster]:overflow-visible",
            // Animation - respect reduced motion
            "motion-reduce:transition-none",
          ].join(" "),
          title: "group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton: [
            "group-[.toast]:bg-primary",
            "group-[.toast]:text-primary-foreground",
            "group-[.toast]:hover:bg-primary/90",
            "group-[.toast]:font-medium",
            "group-[.toast]:rounded-md",
            "group-[.toast]:px-3",
            "group-[.toast]:py-1.5",
            "group-[.toast]:text-sm",
          ].join(" "),
          cancelButton: [
            "group-[.toast]:bg-muted",
            "group-[.toast]:text-muted-foreground",
            "group-[.toast]:hover:bg-muted/80",
            "group-[.toast]:font-medium",
            "group-[.toast]:rounded-md",
            "group-[.toast]:px-3",
            "group-[.toast]:py-1.5",
            "group-[.toast]:text-sm",
          ].join(" "),
          closeButton: [
            // Positioning - ensure button is not clipped
            "group-[.toast]:!left-auto",
            "group-[.toast]:!right-2",
            "group-[.toast]:!top-2",
            "group-[.toast]:!transform-none",
            // Styling
            "group-[.toast]:bg-background",
            "group-[.toast]:text-muted-foreground",
            "group-[.toast]:border",
            "group-[.toast]:border-border",
            "group-[.toast]:rounded-md",
            "group-[.toast]:h-6",
            "group-[.toast]:w-6",
            "group-[.toast]:flex",
            "group-[.toast]:items-center",
            "group-[.toast]:justify-center",
            "group-[.toast]:hover:bg-muted",
            "group-[.toast]:hover:text-foreground",
            "group-[.toast]:transition-colors",
            // Ensure icon is visible
            "group-[.toast]:[&_svg]:h-3",
            "group-[.toast]:[&_svg]:w-3",
          ].join(" "),
          // Semantic color variants with enhanced visibility
          error: [
            "group-[.toaster]:!bg-destructive/10",
            "group-[.toaster]:!border-destructive",
            "group-[.toaster]:!text-destructive",
            "group-[.toaster]:[&_[data-title]]:!text-destructive",
            "group-[.toaster]:[&_[data-icon]]:!text-destructive",
          ].join(" "),
          success: [
            "group-[.toaster]:!bg-success/10",
            "group-[.toaster]:!border-success",
            "group-[.toaster]:!text-success",
            "group-[.toaster]:[&_[data-title]]:!text-success",
            "group-[.toaster]:[&_[data-icon]]:!text-success",
          ].join(" "),
          warning: [
            "group-[.toaster]:!bg-warning/10",
            "group-[.toaster]:!border-warning",
            "group-[.toaster]:!text-warning",
            "group-[.toaster]:[&_[data-title]]:!text-warning",
            "group-[.toaster]:[&_[data-icon]]:!text-warning",
          ].join(" "),
          info: [
            "group-[.toaster]:!bg-info/10",
            "group-[.toaster]:!border-info",
            "group-[.toaster]:!text-info",
            "group-[.toaster]:[&_[data-title]]:!text-info",
            "group-[.toaster]:[&_[data-icon]]:!text-info",
          ].join(" "),
          loading: [
            "group-[.toaster]:!bg-muted/50",
            "group-[.toaster]:!border-muted-foreground/30",
            "group-[.toaster]:!text-muted-foreground",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
