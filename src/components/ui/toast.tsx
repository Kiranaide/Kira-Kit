"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconLoader2,
} from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// -----------------------------------------------------------------------------
// Types & styling
// -----------------------------------------------------------------------------

type ToastType =
  "default" | "success" | "error" | "warning" | "info" | "loading";

interface ToastData {
  variant?: ToastType;
  icon?: React.ReactNode;
}

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg",
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
  },
);

const toastIcons: Record<ToastType, React.ReactNode> = {
  default: null,
  success: <IconCheck className="h-5 w-5" data-icon />,
  error: <IconX className="h-5 w-5" data-icon />,
  warning: <IconAlertTriangle className="h-5 w-5" data-icon />,
  info: <IconInfoCircle className="h-5 w-5" data-icon />,
  loading: <IconLoader2 className="h-5 w-5 animate-spin" data-icon />,
};

// -----------------------------------------------------------------------------
// Imperative manager + `toast()` API (works outside React)
// -----------------------------------------------------------------------------

const manager = Toast.createToastManager<ToastData>();

const DURATION: Record<ToastType, number> = {
  default: 5000,
  success: 4000,
  error: 8000,
  warning: 6000,
  info: 5000,
  loading: 0, // 0 = no auto-dismiss
};

interface ToastOptions {
  description?: React.ReactNode;
  duration?: number;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

function createToast(type: ToastType) {
  return (title: React.ReactNode, options?: ToastOptions): string => {
    const { description, duration, icon, action } = options ?? {};

    const resolvedTimeout =
      duration === Infinity ? 0 : (duration ?? DURATION[type]);

    return manager.add({
      title,
      description,
      type,
      timeout: resolvedTimeout,
      priority: type === "error" || type === "warning" ? "high" : "low",
      data: { variant: type, icon },
      actionProps: action
        ? { children: action.label, onClick: action.onClick }
        : undefined,
    });
  };
}

interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
  description?: string;
}

/** Global imperative toast API. Mirrors the previous sonner-based signature. */
const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) =>
    createToast("default")(title, options),
  {
    success: createToast("success"),
    error: createToast("error"),
    warning: createToast("warning"),
    info: createToast("info"),
    loading: createToast("loading"),
    message: createToast("default"),
    promise: <T,>(promise: Promise<T>, options: PromiseToastOptions<T>) =>
      manager.promise<T, ToastData>(promise, {
        loading: {
          title: options.loading,
          type: "loading",
          data: { variant: "loading" },
        },
        success: (data: T) => ({
          title:
            typeof options.success === "function"
              ? options.success(data)
              : options.success,
          type: "success",
          timeout: DURATION.success,
          data: { variant: "success" },
        }),
        error: (err: unknown) => ({
          title:
            typeof options.error === "function"
              ? options.error(err)
              : options.error,
          type: "error",
          timeout: DURATION.error,
          data: { variant: "error" },
        }),
      }),
    dismiss: (id?: string) => manager.close(id),
    update: (id: string, options: ToastOptions & { title?: React.ReactNode }) =>
      manager.update(id, {
        title: options.title,
        description: options.description,
      }),
  },
);

// -----------------------------------------------------------------------------
// Provider + Toaster (mount once)
// -----------------------------------------------------------------------------

interface KiraToastProviderProps {
  children?: React.ReactNode;
  /** Default auto-dismiss timeout (ms). 0 disables. */
  timeout?: number;
  /** Max toasts visible at once. */
  limit?: number;
}

function KiraToastProvider({
  children,
  timeout = 5000,
  limit = 3,
}: KiraToastProviderProps) {
  return (
    <Toast.Provider toastManager={manager} timeout={timeout} limit={limit}>
      {children}
      <KiraToaster />
    </Toast.Provider>
  );
}

function ToastItem({ toast: t }: { toast: Toast.Root.ToastObject<ToastData> }) {
  const variant = t.data?.variant ?? "default";
  const icon = t.data?.icon ?? toastIcons[variant];

  return (
    <Toast.Root
      toast={t}
      swipeDirection={["down", "right"]}
      className={cn(
        toastVariants({ variant }),
        // Base UI transition attributes drive enter/exit + swipe.
        "transition-all duration-200",
        "data-starting-style:opacity-0 data-starting-style:translate-y-2",
        "data-ending-style:opacity-0 data-ending-style:translate-y-2",
        "data-swiping:transition-none",
      )}
      style={{
        // Stack offset provided by Base UI as CSS vars.
        ["--gap" as string]: "0.75rem",
      }}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <Toast.Title className="text-sm font-semibold" />
        <Toast.Description className="text-sm opacity-90" />
      </div>
      {t.actionProps && (
        <Toast.Action className="text-sm font-medium underline underline-offset-2 hover:no-underline" />
      )}
      <Toast.Close
        className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Close"
      >
        <IconX className="h-4 w-4" />
      </Toast.Close>
    </Toast.Root>
  );
}

function KiraToaster() {
  const { toasts } = Toast.useToastManager();
  const reducedMotion = useReducedMotion();

  return (
    <Toast.Portal>
      <Toast.Viewport
        data-slot="toast-viewport"
        className={cn(
          "fixed top-4 right-4 z-100 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none",
          reducedMotion && "**:data-[slot=toast]:transition-none",
        )}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

/** Hook returning the toast manager for in-component use. */
function useToast() {
  return Toast.useToastManager();
}

export { toast, useToast, KiraToastProvider, KiraToaster, toastVariants };

export type { ToastType, ToastOptions, ToastData, PromiseToastOptions };
