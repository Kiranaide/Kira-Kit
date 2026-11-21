"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconLoader2,
} from "@tabler/icons-react";
import { isCallbackProp } from "@/lib/component-prop-guards";

const TOAST_TYPES = [
  "default",
  "success",
  "error",
  "warning",
  "info",
  "loading",
] as const;

type ToastType = (typeof TOAST_TYPES)[number];

function isToastType(value: unknown): value is ToastType {
  return TOAST_TYPES.some((member) => member === value);
}

/** Anchor configuration for a toast pinned to a trigger element. */
interface ToastPosition {
  /** Element to anchor the toast against. `null` falls back to the stacked viewport. */
  anchor: HTMLElement | null;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  /** Distance from the anchor in px. @default 8 */
  sideOffset?: number;
}

interface ToastData {
  /** Custom icon. `null` hides the variant's default icon. */
  icon?: React.ReactNode;
}

const toastVariants = cva(
  // `group/toast` lets the progress bar pause while timers are paused.
  "group/toast rounded-lg border shadow-lg",
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
  success: <IconCheck className="size-5" data-icon />,
  error: <IconX className="size-5" data-icon />,
  warning: <IconAlertTriangle className="size-5" data-icon />,
  info: <IconInfoCircle className="size-5" data-icon />,
  loading: (
    <IconLoader2
      className="size-5 animate-spin motion-reduce:animate-none"
      data-icon
    />
  ),
};

/**
 * Collapsed-stack geometry (Base UI 1.9 stacking recipe): the frontmost
 * toast sits on the bottom edge, older ones peek 0.75rem behind at
 * decreasing scale, and `data-expanded` fans them out. No
 * `overflow-hidden` here — it would clip the `after:` hover bridge.
 */
const stackedRootClasses = cn(
  "pointer-events-auto absolute inset-x-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none outline-none",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring",
  "[--gap:0.75rem] [--peek:0.75rem]",
  "[--height:var(--toast-frontmost-height,var(--toast-height))]",
  "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))]",
  "[--shrink:calc(1-var(--scale))]",
  "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
  "h-(--height) data-expanded:h-(--toast-height)",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
  "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
  "transition-[transform,opacity,height] duration-200 ease-out",
  // Enter / exit
  "data-starting-style:[transform:translateY(150%)]",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
  "data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in",
  // Swipe exits: attribute VALUE selectors, not presence selectors
  "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-swiping:transition-none",
  "data-limited:pointer-events-none data-limited:opacity-0",
  "motion-reduce:transition-none",
  // Keeps hover alive across the gap between stacked toasts.
  "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[calc(var(--gap)+1px)] after:content-['']",
);

/** Geometry for `Toast.Positioner`-wrapped (anchored) toasts. */
const anchoredRootClasses = cn(
  "pointer-events-auto relative w-max max-w-96 origin-(--transform-origin) select-none outline-none",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring",
  "transition-[scale,opacity] duration-150 ease-out",
  "data-starting-style:scale-96 data-starting-style:opacity-0",
  "data-ending-style:scale-96 data-ending-style:opacity-0 data-ending-style:ease-in",
  "data-instant:transition-none motion-reduce:transition-none",
  "data-limited:pointer-events-none data-limited:opacity-0",
);

const contentClasses = cn(
  "relative flex items-start gap-3 overflow-hidden rounded-[inherit] p-4",
  "transition-opacity duration-200 data-behind:opacity-0 data-expanded:opacity-100",
  "motion-reduce:transition-none",
);

const stackedManager = Toast.createToastManager<ToastData>();
const anchoredManager = Toast.createToastManager<ToastData>();

type Manager = typeof stackedManager;

/** Which manager owns each live anchored toast (stacked is the fallback). */
const owners = new Map<string, Manager>();
const managerFor = (id: string): Manager => owners.get(id) ?? stackedManager;

/** Default auto-dismiss timeouts per variant (ms). 0 = no auto-dismiss. */
const DURATION = {
  default: 5000,
  success: 4000,
  error: 8000,
  warning: 6000,
  info: 5000,
  loading: 0,
} as const satisfies Record<ToastType, number>;

const PRIORITY = {
  default: "low",
  success: "low",
  error: "high",
  warning: "high",
  info: "low",
  loading: "low",
} as const satisfies Record<ToastType, "low" | "high">;

function resolveTimeout(type: ToastType, duration?: number): number {
  if (duration === undefined) return DURATION[type];

  if (!Number.isFinite(duration) || duration <= 0) return 0; // Infinity, 0, negatives

  return duration;
}

interface ToastAction {
  label: string;
  onClick: () => void;
}

const toActionProps = (action?: ToastAction) =>
  action ? { children: action.label, onClick: action.onClick } : undefined;

interface ToastOptions {
  /** Stable ID. Re-adding the same ID updates the toast in place (dedupe). */
  id?: string;
  description?: React.ReactNode;
  /** ms; `Infinity` or `0` disables auto-dismiss. */
  duration?: number;
  /** Custom icon; `null` hides the default. */
  icon?: React.ReactNode;
  action?: ToastAction;
  position?: ToastPosition;
  onClose?: () => void;
  onRemove?: () => void;
}

function createToast(type: ToastType) {
  return (title: React.ReactNode, options: ToastOptions = {}): string => {
    const {
      id,
      description,
      duration,
      icon,
      action,
      position,
      onClose,
      onRemove,
    } = options;

    const anchor = position?.anchor ?? null;
    const target = anchor ? anchoredManager : stackedManager;

    const toastId: string = target.add({
      id,
      title,
      description,
      type,
      timeout: resolveTimeout(type, duration),
      priority: PRIORITY[type],
      data: toastData(icon),
      actionProps: toActionProps(action),
      positionerProps: toastPositionerProps(anchor, position),
      onClose,
      onRemove() {
        owners.delete(toastId);
        onRemove?.();
      },
    });

    if (anchor) owners.set(toastId, anchoredManager);

    return toastId;
  };
}

function toastData(icon: React.ReactNode | undefined) {
  return icon === undefined ? undefined : { icon };
}

function toastPositionerProps(
  anchor: ToastPosition["anchor"] | null,
  position?: ToastPosition,
) {
  return anchor
    ? {
        anchor,
        align: position?.align,
        side: position?.side,
        sideOffset: position?.sideOffset ?? 8,
      }
    : undefined;
}

interface PromiseToastOptions<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((data: T) => React.ReactNode);

  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- JavaScript promises and action callbacks may reject with any value; the public error callback intentionally receives that original rejection.
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
  description?: React.ReactNode;
}

const resolve = <A,>(
  value: React.ReactNode | ((arg: A) => React.ReactNode),
  arg: A,
) => (isCallbackProp(value) ? value(arg) : value);

/** Global imperative toast API. Mirrors the previous sonner-based signature. */
const toast = Object.assign(createToast("default"), {
  success: createToast("success"),
  error: createToast("error"),
  warning: createToast("warning"),
  info: createToast("info"),
  loading: createToast("loading"),
  message: createToast("default"),

  promise: <T,>(promise: Promise<T>, options: PromiseToastOptions<T>) =>
    stackedManager.promise<T, ToastData>(promise, {
      loading: {
        title: options.loading,
        description: options.description,
        type: "loading",
        timeout: DURATION.loading,
      },
      success: (data: T) => ({
        title: resolve(options.success, data),
        description: options.description,
        type: "success",
        timeout: DURATION.success,
        priority: PRIORITY.success,
      }),

      // oxlint-disable-next-line anti-slop/no-unknown-parameters -- JavaScript promises and action callbacks may reject with any value; the public error callback intentionally receives that original rejection.
      error: (err: unknown) => ({
        title: resolve(options.error, err),
        description: options.description,
        type: "error",
        timeout: DURATION.error,
        priority: PRIORITY.error,
      }),
    }),

  /** Close one toast, or every toast in both viewports when no ID is given. */
  dismiss: (id?: string) => {
    if (id) return managerFor(id).close(id);
    stackedManager.close();
    anchoredManager.close();
  },

  update: (
    id: string,
    options: Omit<ToastOptions, "id" | "position"> & {
      title?: React.ReactNode;
      variant?: ToastType;
    },
  ) =>
    managerFor(id).update(id, (current) => {
      const type: ToastType =
        options.variant ??
        (isToastType(current.type) ? current.type : "default");

      const timingChanged =
        options.duration !== undefined ||
        (options.variant !== undefined && options.variant !== current.type);

      return {
        title: options.title ?? current.title,
        description:
          "description" in options ? options.description : current.description,
        type,
        priority: PRIORITY[type],
        timeout: timingChanged
          ? resolveTimeout(type, options.duration)
          : current.timeout,
        data:
          "icon" in options
            ? { ...current.data, icon: options.icon }
            : current.data,
        actionProps: options.action
          ? toActionProps(options.action)
          : current.actionProps,
      };
    }),
});

function ToastItem({
  toast: t,
  anchored = false,
}: {
  toast: Toast.Root.ToastObject<ToastData>;
  anchored?: boolean;
}) {
  const variant: ToastType = isToastType(t.type) ? t.type : "default";
  const icon = t.data?.icon === undefined ? toastIcons[variant] : t.data.icon;
  const timeout = t.timeout ?? 0;

  return renderToastPart1({ t, anchored, variant, icon, timeout });
}

const viewportClasses =
  "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:inset-x-auto sm:right-4 sm:mx-0 sm:w-96";

function KiraToaster() {
  const { toasts } = Toast.useToastManager<ToastData>();

  return (
    <Toast.Portal>
      <Toast.Viewport data-slot="toast-viewport" className={viewportClasses}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function KiraAnchoredToaster() {
  const { toasts } = Toast.useToastManager<ToastData>();

  return (
    <Toast.Portal>
      <Toast.Viewport
        data-slot="toast-anchored-viewport"
        className="outline-none"
      >
        {toasts.map((t) => (
          <Toast.Positioner
            key={t.id}
            toast={t}
            className="z-[calc(1000-var(--toast-index))] outline-none"
          >
            <ToastItem toast={t} anchored />
          </Toast.Positioner>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

interface KiraToastProviderProps {
  children?: React.ReactNode;
  /** Default timeout (ms) for toasts added via `useToast()` directly. 0 disables. */
  timeout?: number;
  /** Max stacked toasts visible at once. */
  limit?: number;
}

function KiraToastProvider({
  children,
  timeout = 5000,
  limit = 3,
}: KiraToastProviderProps) {
  return (
    <>
      <Toast.Provider toastManager={anchoredManager} timeout={timeout}>
        <KiraAnchoredToaster />
      </Toast.Provider>
      <Toast.Provider
        toastManager={stackedManager}
        timeout={timeout}
        limit={limit}
      >
        {children}
        <KiraToaster />
      </Toast.Provider>
    </>
  );
}

/** Reactive access to the stacked toast manager (includes `toasts`). */
function useToast() {
  return Toast.useToastManager<ToastData>();
}

export {
  toast,
  useToast,
  KiraToastProvider,
  KiraToaster,
  KiraAnchoredToaster,
  toastVariants,
  DURATION,
};

export type {
  ToastType,
  ToastOptions,
  ToastPosition,
  ToastData,
  ToastAction,
  PromiseToastOptions,
};

type renderToastPart1Args = {
  t: {
    toast: Toast.Root.ToastObject<ToastData>;
    anchored?: boolean;
  }["toast"];
  anchored: Exclude<
    {
      toast: Toast.Root.ToastObject<ToastData>;
      anchored?: boolean;
    }["anchored"],
    undefined
  >;
  variant: ToastType;
  icon: React.ReactNode;
  timeout: number;
};

function renderToastPart1({
  t,
  anchored,
  variant,
  icon,
  timeout,
}: renderToastPart1Args) {
  return (
    <Toast.Root
      data-slot="toast"
      toast={t}
      swipeDirection={anchored ? undefined : ["up", "down", "left", "right"]}
      className={cn(
        toastVariants({ variant }),
        anchored ? anchoredRootClasses : stackedRootClasses,
      )}
    >
      <Toast.Content data-slot="toast-content" className={contentClasses}>
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div className="min-w-0 flex-1">
          <Toast.Title className="text-sm font-semibold" />
          <Toast.Description className="text-sm opacity-90" />
        </div>
        {t.actionProps && (
          <Toast.Action className="shrink-0 self-center text-sm font-medium underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring" />
        )}
        <Toast.Close
          aria-label="Close"
          className="shrink-0 self-start rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          <IconX className="size-4" />
        </Toast.Close>

        {/* Auto-dismiss countdown. Transform-only (scaleX), clipped by the
            rounded Content. Pauses with Base UI's timers via data-expanded;
            `updateKey` remounts it so updates restart the countdown. */}
        {timeout > 0 && (
          // kira-kit-ignore spacing-scale: toast progress hairline is 2px by design
          <span
            key={t.updateKey}
            aria-hidden
            data-slot="toast-progress"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-current/15 motion-reduce:hidden"
          >
            <span
              className="block h-full origin-left bg-current animate-toast-progress rtl:origin-right group-data-expanded/toast:paused"
              style={{ animationDuration: `${timeout}ms` }}
            />
          </span>
        )}
      </Toast.Content>
    </Toast.Root>
  );
}
