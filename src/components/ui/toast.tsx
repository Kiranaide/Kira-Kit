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

type ToastType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

interface ToastOptions extends ExternalToast {
  icon?: React.ReactNode;
  className?: string;
}

interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
  description?: string;
  duration?: number;
}

const DURATION = {
  default: 5000,
  success: 4000,
  error: 8000,
  warning: 6000,
  info: 5000,
  loading: Infinity,
} as const;

const ToastIcons: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <IconCheck className="h-5 w-5" data-icon />,
  error: <IconX className="h-5 w-5" data-icon />,
  warning: <IconAlertTriangle className="h-5 w-5" data-icon />,
  info: <IconInfoCircle className="h-5 w-5" data-icon />,
  loading: <IconLoader2 className="h-5 w-5 animate-spin" data-icon />,
};

const getAriaConfig = (type: ToastType) => {
  if (type === "error" || type === "warning") {
    return {
      role: "alert" as const,
      "aria-live": "assertive" as const,
      "aria-atomic": true,
    };
  }

  return {
    role: "status" as const,
    "aria-live": "polite" as const,
    "aria-atomic": true,
  };
};

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

    const sonnerMethod =
      type === "default" || type === "loading"
        ? sonnerToast
        : sonnerToast[type as "success" | "error" | "warning" | "info"];

    return sonnerMethod(message, {
      duration,
      icon: defaultIcon,
      className: cn(toastVariants({ variant: type }), className),

      ...rest,

      ...(ariaConfig as Record<string, unknown>),
    });
  };
};

export const toast = Object.assign(
  (message: string, options?: ToastOptions) =>
    createToast("default")(message, options),
  {
    success: createToast("success"),
    error: createToast("error"),
    warning: createToast("warning"),
    info: createToast("info"),
    loading: createToast("loading"),
    message: (title: string, options?: ToastOptions) => {
      return sonnerToast.message(title, {
        duration: DURATION.default,
        ...options,
      });
    },
    promise: <T,>(promise: Promise<T>, options: PromiseToastOptions<T>) => {
      return sonnerToast.promise(promise, {
        loading: options.loading,
        success: options.success,
        error: options.error,
        description: options.description,
        duration: options.duration ?? DURATION.success,
      });
    },
    custom: (
      render: (id: string | number) => React.ReactElement,
      options?: ToastOptions
    ) => {
      return sonnerToast.custom(render, {
        duration: options?.duration ?? DURATION.default,
        ...options,
      });
    },
    dismiss: (id?: string | number) => {
      if (id !== undefined) {
        sonnerToast.dismiss(id);
      } else {
        sonnerToast.dismiss();
      }
    },
    update: (
      id: string | number,
      options: ToastOptions & { message?: string; type?: ToastType }
    ) => {
      const { message, type = "default", ...rest } = options;

      sonnerToast.dismiss(id);

      if (message) {
        return createToast(type)(message, { ...rest, id });
      }
    },
  }
);

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  };
}

export { toastVariants };
export type { ToastOptions, ToastType, PromiseToastOptions };
