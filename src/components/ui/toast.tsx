import * as React from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconLoader2,
} from "@tabler/icons-react";

// ============================================
// TOAST VARIANTS
// ============================================
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-background border-border text-foreground",
        success:
          "bg-success/10 border-success text-success [&_[data-icon]]:text-success",
        error:
          "bg-destructive/10 border-destructive text-destructive [&_[data-icon]]:text-destructive",
        warning:
          "bg-warning/10 border-warning text-warning [&_[data-icon]]:text-warning",
        info: "bg-info/10 border-info text-info [&_[data-icon]]:text-info",
        loading: "bg-muted border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

// ============================================
// TYPES
// ============================================
type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";

interface ToastOptions extends ExternalToast {
  /** Custom icon to display */
  icon?: React.ReactNode;
  /** Custom class name for toast container */
  className?: string;
}

interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
  description?: string;
  duration?: number;
}

// ============================================
// DURATION DEFAULTS (in ms)
// Best practice: 5s for info, 8s for actions, longer for errors
// ============================================
const DURATION = {
  default: 5000,
  success: 4000,
  error: 8000,
  warning: 6000,
  info: 5000,
  loading: Infinity, // Loading toasts persist until dismissed
} as const;

// ============================================
// ICONS
// ============================================
const ToastIcons: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <IconCheck className="h-5 w-5" data-icon />,
  error: <IconX className="h-5 w-5" data-icon />,
  warning: <IconAlertTriangle className="h-5 w-5" data-icon />,
  info: <IconInfoCircle className="h-5 w-5" data-icon />,
  loading: <IconLoader2 className="h-5 w-5 animate-spin" data-icon />,
};

// ============================================
// ARIA CONFIGURATION
// WCAG 4.1.3: Status messages must be programmatically determinable
// ============================================
const getAriaConfig = (type: ToastType) => {
  // Error and warning are urgent - use assertive
  if (type === "error" || type === "warning") {
    return {
      role: "alert" as const,
      "aria-live": "assertive" as const,
      "aria-atomic": true,
    };
  }
  // Info, success, loading are non-urgent - use polite
  return {
    role: "status" as const,
    "aria-live": "polite" as const,
    "aria-atomic": true,
  };
};

// ============================================
// TOAST CREATOR FUNCTION
// ============================================
const createToast = (type: ToastType) => {
  return (message: string, options?: ToastOptions) => {
    const {
      duration = DURATION[type],
      icon,
      className,
      ...rest
    } = options ?? {};

    const ariaConfig = getAriaConfig(type);
    const defaultIcon = icon ?? ToastIcons[type];

    // Map our types to Sonner's methods
    const sonnerMethod = type === "default" || type === "loading" 
      ? sonnerToast 
      : sonnerToast[type as "success" | "error" | "warning" | "info"];

    return sonnerMethod(message, {
      duration,
      icon: defaultIcon,
      className: cn(toastVariants({ variant: type }), className),
      // Pass ARIA attributes via unstyled option is not available,
      // Sonner handles accessibility internally but we ensure proper configuration
      ...rest,
      // Custom data attributes for our styling hooks
      ...(ariaConfig as Record<string, unknown>),
    });
  };
};

// ============================================
// TOAST API
// ============================================
/**
 * Toast notification API with enhanced accessibility
 * 
 * @example
 * ```tsx
 * // Simple usage
 * toast("Hello world");
 * toast.success("Saved successfully");
 * toast.error("Something went wrong");
 * 
 * // With options
 * toast.info("New message", { 
 *   description: "From John Doe",
 *   duration: 10000 
 * });
 * 
 * // With action
 * toast("File deleted", {
 *   action: { label: "Undo", onClick: () => restore() }
 * });
 * 
 * // Promise-based
 * toast.promise(saveData(), {
 *   loading: "Saving...",
 *   success: "Saved!",
 *   error: "Failed to save"
 * });
 * 
 * // Programmatic control
 * const id = toast.loading("Processing...");
 * // Later...
 * toast.dismiss(id);
 * ```
 */
export const toast = Object.assign(
  // Default toast
  (message: string, options?: ToastOptions) => createToast("default")(message, options),
  {
    /**
     * Success toast - green styling, checkmark icon
     * Uses aria-live="polite" (non-urgent)
     */
    success: createToast("success"),

    /**
     * Error toast - red styling, X icon
     * Uses aria-live="assertive" (urgent)
     * Default duration: 8s (longer for errors)
     */
    error: createToast("error"),

    /**
     * Warning toast - yellow/amber styling, alert icon
     * Uses aria-live="assertive" (urgent)
     */
    warning: createToast("warning"),

    /**
     * Info toast - blue styling, info icon
     * Uses aria-live="polite" (non-urgent)
     */
    info: createToast("info"),

    /**
     * Loading toast - muted styling, spinner icon
     * Persists until dismissed programmatically
     */
    loading: createToast("loading"),

    /**
     * Message toast with title emphasis
     */
    message: (title: string, options?: ToastOptions) => {
      return sonnerToast.message(title, {
        duration: DURATION.default,
        ...options,
      });
    },

    /**
     * Promise-based toast that shows loading, then success/error
     * 
     * @example
     * ```tsx
     * toast.promise(fetchData(), {
     *   loading: "Loading data...",
     *   success: (data) => `Loaded ${data.length} items`,
     *   error: (err) => `Error: ${err.message}`
     * });
     * ```
     */
    promise: <T,>(
      promise: Promise<T>,
      options: PromiseToastOptions<T>
    ) => {
      return sonnerToast.promise(promise, {
        loading: options.loading,
        success: options.success,
        error: options.error,
        description: options.description,
        duration: options.duration ?? DURATION.success,
      });
    },

    /**
     * Custom toast with full control over content
     * 
     * @example
     * ```tsx
     * toast.custom((id) => (
     *   <div className="flex items-center gap-2">
     *     <Avatar />
     *     <span>Custom content</span>
     *     <Button onClick={() => toast.dismiss(id)}>Close</Button>
     *   </div>
     * ));
     * ```
     */
    custom: (
      render: (id: string | number) => React.ReactElement,
      options?: ToastOptions
    ) => {
      return sonnerToast.custom(render, {
        duration: options?.duration ?? DURATION.default,
        ...options,
      });
    },

    /**
     * Dismiss a specific toast by ID, or all toasts if no ID provided
     */
    dismiss: (id?: string | number) => {
      if (id !== undefined) {
        sonnerToast.dismiss(id);
      } else {
        sonnerToast.dismiss();
      }
    },

    /**
     * Update an existing toast
     * 
     * @example
     * ```tsx
     * const id = toast.loading("Uploading...");
     * // Later...
     * toast.update(id, {
     *   type: "success",
     *   message: "Upload complete!"
     * });
     * ```
     */
    update: (
      id: string | number,
      options: ToastOptions & { message?: string; type?: ToastType }
    ) => {
      const { message, type = "default", ...rest } = options;
      
      // Dismiss and recreate with new options
      sonnerToast.dismiss(id);
      
      if (message) {
        return createToast(type)(message, { ...rest, id });
      }
    },
  }
);

// ============================================
// USE TOAST HOOK
// For accessing toast state and actions in components
// ============================================

/**
 * Hook to access toast API within React components
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast } = useToast();
 *   
 *   return (
 *     <Button onClick={() => toast.success("Done!")}>
 *       Save
 *     </Button>
 *   );
 * }
 * ```
 */
export function useToast() {
  // Return the toast API even without context for convenience
  return {
    toast,
    dismiss: toast.dismiss,
  };
}

// ============================================
// EXPORTS
// ============================================
export { toastVariants };
export type { ToastOptions, ToastType, PromiseToastOptions };
