"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleCheck,
  IconCircleX,
  IconLoader,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

// Static class maps — Tailwind JIT only sees complete class strings, so
// interpolated `bg-black/${opacity}` would be purged. These are safelisted.
const overlayColorMap: Record<"black" | "white", Record<number, string>> = {
  black: {
    20: "bg-black/20",
    30: "bg-black/30",
    40: "bg-black/40",
    50: "bg-black/50",
    60: "bg-black/60",
    70: "bg-black/70",
    80: "bg-black/80",
  },
  white: {
    20: "bg-white/20",
    30: "bg-white/30",
    40: "bg-white/40",
    50: "bg-white/50",
    60: "bg-white/60",
    70: "bg-white/70",
    80: "bg-white/80",
  },
};

const overlayBlurMap: Record<string, string> = {
  none: "",
  xs: "supports-backdrop-filter:backdrop-blur-xs",
  sm: "supports-backdrop-filter:backdrop-blur-sm",
  md: "supports-backdrop-filter:backdrop-blur-md",
  lg: "supports-backdrop-filter:backdrop-blur-lg",
  xl: "supports-backdrop-filter:backdrop-blur-xl",
};

interface AlertDialogOverlayProps extends AlertDialogPrimitive.Backdrop.Props {
  opacity?: 20 | 30 | 40 | 50 | 60 | 70 | 80;
  blur?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  color?: "black" | "white";
  blurless?: boolean;
}

function AlertDialogOverlay({
  className,
  opacity = 50,
  blur = "xs",
  color = "black",
  blurless = false,
  ...props
}: AlertDialogOverlayProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!overlayRef.current || reducedMotion) return;
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    },
    { scope: overlayRef, dependencies: [reducedMotion] },
  );

  const blurClass = blurless ? "" : overlayBlurMap[blur];
  const colorClass =
    overlayColorMap[color][opacity] ?? overlayColorMap[color][50];

  return (
    <AlertDialogPrimitive.Backdrop
      ref={overlayRef}
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50",
        colorClass,
        blurClass,
        className,
      )}
      {...props}
    />
  );
}

interface AlertDialogContentProps extends AlertDialogPrimitive.Popup.Props {
  size?: "sm" | "default" | "lg" | "xl" | "full";
  duration?: number;
  showCloseButton?: boolean;
}

function AlertDialogContent({
  className,
  size = "default",
  duration,
  showCloseButton = false,
  children,
  ...props
}: AlertDialogContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const sizeClasses = {
    sm: "max-w-xs",
    default: "max-w-xs sm:max-w-sm",
    lg: "max-w-sm sm:max-w-md",
    xl: "max-w-md sm:max-w-lg",
    full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
  };

  // Per-size default entrance duration (seconds); `duration` prop overrides.
  const durationMap = {
    sm: 0.3,
    default: 0.35,
    lg: 0.4,
    xl: 0.45,
    full: 0.45,
  };
  const entranceDuration =
    duration !== undefined ? duration / 1000 : durationMap[size];

  useGSAP(
    () => {
      if (!contentRef.current || reducedMotion) return;
      // A playful pop with a gentle overshoot, instead of a barely-
      // noticeable fade. (Note: we deliberately only animate `scale` here,
      // not `x`/`y` — the dialog is centered via a `-translate-1/2` CSS
      // class, and GSAP fully owns the translate component of `transform`
      // once it animates x/y, which would clobber that centering.)
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: entranceDuration,
          ease: "back.out(1.7)",
        },
      );
    },
    { scope: contentRef, dependencies: [reducedMotion, entranceDuration] },
  );

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        ref={contentRef}
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "bg-background ring-foreground/10 gap-4 rounded-xl p-4 ring-1",
          size === "full"
            ? "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none flex flex-col overflow-hidden"
            : "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {size === "full" ? (
          <FullScreenBody>{children}</FullScreenBody>
        ) : (
          children
        )}
        {showCloseButton && <AlertDialogClose />}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
  );
}

// Splits header/footer out from the scrollable body for `size="full"`, so:
//  - the footer always pins to the bottom (it's a flex sibling after the
//    flex-1 scroll area, not just another item flowing inside it), even
//    when the body content doesn't fill the available height.
//  - header/footer can bleed edge-to-edge via their negative margins.
//    (Setting `overflow-y-auto` on a container implicitly forces its
//    `overflow-x` to `auto` too per the CSS spec, which was clipping that
//    bleed — keeping header/footer outside the scroll container avoids it.)
function FullScreenBody({ children }: { children: React.ReactNode }) {
  let header: React.ReactNode = null;
  let footer: React.ReactNode = null;
  const body: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === AlertDialogHeader) {
      header = child;
    } else if (React.isValidElement(child) && child.type === AlertDialogFooter) {
      footer = child;
    } else {
      body.push(child);
    }
  });

  return (
    <>
      {header}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {body}
      </div>
      {footer}
    </>
  );
}

interface AlertDialogHeaderProps extends React.ComponentProps<"div"> {
  centered?: boolean;
}

function AlertDialogHeader({
  className,
  centered = false,
  ...props
}: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] shrink-0",
        centered &&
          "place-items-center text-center sm:group-data-[size=default]/alert-dialog-content:place-items-center sm:group-data-[size=default]/alert-dialog-content:text-center",
        className,
      )}
      {...props}
    />
  );
}

interface AlertDialogFooterProps extends React.ComponentProps<"div"> {
  centered?: boolean;
  layout?: "horizontal" | "stacked";
}

function AlertDialogFooter({
  className,
  centered = false,
  layout = "horizontal",
  ...props
}: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "bg-muted/50 -mx-4 -mb-4 rounded-b-xl border-t p-4 flex flex-col-reverse gap-2 shrink-0",
        layout === "horizontal" && "sm:flex-row sm:justify-end",
        layout === "stacked" && "flex-col",
        centered && "sm:justify-center",
        "group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

const alertDialogMediaVariants = cva(
  "mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default: "bg-muted",
        info: "bg-info/20 text-info",
        success: "bg-success/20 text-success",
        warning: "bg-warning/20 text-warning",
        destructive: "bg-destructive/20 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface AlertDialogMediaProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof alertDialogMediaVariants> {}

function AlertDialogMedia({
  className,
  variant,
  ...props
}: AlertDialogMediaProps) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(alertDialogMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

interface AlertDialogActionProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  confirm?: boolean;
  shortcut?: string;
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  loading = false,
  confirm = false,
  shortcut,
  disabled,
  children,
  ...props
}: AlertDialogActionProps) {
  return (
    <Button
      data-slot="alert-dialog-action"
      data-confirm={confirm}
      data-loading={loading}
      variant={confirm ? "default" : variant}
      size={size}
      disabled={disabled || loading}
      className={cn(loading && "cursor-wait", className)}
      {...props}
    >
      {loading && (
        <IconLoader
          className="mr-2 h-4 w-4 animate-spin"
          data-icon="inline-start"
        />
      )}
      {children}
      {shortcut && (
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">{shortcut}</span>
        </kbd>
      )}
    </Button>
  );
}

interface AlertDialogCancelProps extends AlertDialogPrimitive.Close.Props {
  variant?: "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-xs";
  shortcut?: string;
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  shortcut,
  children,
  ...props
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={
        <Button variant={variant} size={size}>
          {children}
          {shortcut && (
            <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{shortcut}</span>
            </kbd>
          )}
        </Button>
      }
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-sm font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

interface AlertDialogWarningProps extends React.ComponentProps<"div"> {
  variant?: "info" | "warning" | "error" | "success";
}

function AlertDialogWarning({
  className,
  variant = "warning",
  children,
  ...props
}: AlertDialogWarningProps) {
  const variantClasses = {
    info: "bg-info/10 text-info border border-info/30",
    warning: "bg-warning/10 text-warning border border-warning/30",
    error: "bg-destructive/10 text-destructive border border-destructive/30",
    success: "bg-success/10 text-success border border-success/30",
  };

  const icons = {
    info: IconInfoCircle,
    warning: IconAlertTriangle,
    error: IconCircleX,
    success: IconCircleCheck,
  };

  const IconComponent = icons[variant];

  return (
    <div
      data-slot="alert-dialog-warning"
      className={cn(
        "flex items-start gap-3 rounded-lg p-3 text-sm",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <IconComponent className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

interface AlertDialogListProps extends React.ComponentProps<"ul"> {
  items: string[];
  variant?: "bullet" | "numbered" | "checkbox";
}

function AlertDialogList({
  className,
  items,
  variant = "bullet",
  ...props
}: AlertDialogListProps) {
  const listStyles: Record<typeof variant, string> = {
    bullet: "list-disc pl-5",
    numbered: "list-decimal pl-5",
    checkbox: "list-none",
  };

  return (
    <ul
      data-slot="alert-dialog-list"
      className={cn("space-y-1 text-sm", listStyles[variant], className)}
      {...props}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={
            variant === "checkbox" ? "flex items-center gap-2" : undefined
          }
        >
          {variant === "checkbox" && (
            <span className="inline-block h-4 w-4 rounded border border-muted-foreground/30" />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}

interface AlertDialogCloseProps extends React.ComponentProps<
  typeof AlertDialogPrimitive.Close
> {
  variant?: "outline" | "ghost" | "secondary";
  size?: "icon-xs" | "icon-sm" | "icon" | "default" | "sm";
}

function AlertDialogClose({
  className,
  variant = "ghost",
  size = "icon-xs",
  ...props
}: AlertDialogCloseProps) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-close"
      className={cn(
        // `Button` always appends its own `relative` class, which (by
        // Tailwind's utility ordering) beats a plain `absolute` here
        // regardless of source order — use `!absolute` so this reliably
        // pins to the corner instead of falling into normal flow.
        "absolute! right-3 top-3 z-20 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className,
      )}
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      <IconX className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </AlertDialogPrimitive.Close>
  );
}

interface KiraAlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "info" | "success" | "warning" | "destructive";
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  action?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "default" | "lg" | "xl";
  /** Keyboard shortcut hint on the confirm button (also wired to a handler). */
  shortcut?: string;
  /** Require typing this exact string to enable the confirm button. */
  confirmText?: string;
  /** Disable the confirm button for N seconds (cooldown for dangerous actions). */
  confirmDelay?: number;
  /** Async confirm handler; shows a success checkmark before closing. */
  onConfirmAsync?: () => Promise<void>;
}

const kiraDialogIcons = {
  info: { icon: IconInfoCircle, className: "bg-info/20 text-info" },
  success: { icon: IconCircleCheck, className: "bg-success/20 text-success" },
  warning: { icon: IconAlertTriangle, className: "bg-warning/20 text-warning" },
  destructive: {
    icon: IconCircleX,
    className: "bg-destructive/20 text-destructive",
  },
};

function KiraAlertDialog({
  open,
  onOpenChange,
  variant = "info",
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  action,
  children,
  size = "default",
  shortcut,
  confirmText,
  confirmDelay,
  onConfirmAsync,
}: KiraAlertDialogProps) {
  const { icon: IconComponent, className: iconClassName } =
    kiraDialogIcons[variant];

  const [typed, setTyped] = React.useState("");
  const [remaining, setRemaining] = React.useState(confirmDelay ?? 0);
  const [asyncState, setAsyncState] = React.useState<
    "idle" | "loading" | "success"
  >("idle");

  // Reset transient state on the closed→open transition (during render, per
  // the React "adjust state when a prop changes" guidance — no effect needed).
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTyped("");
      setAsyncState("idle");
      setRemaining(confirmDelay ?? 0);
    }
  }

  // Countdown cooldown while the dialog is open (effect only manages the timer).
  React.useEffect(() => {
    if (!open || !confirmDelay) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, confirmDelay]);

  const typeGateUnmet = confirmText != null && typed !== confirmText;
  const delayUnmet = remaining > 0;
  const confirmDisabled =
    loading || asyncState === "loading" || typeGateUnmet || delayUnmet;

  const handleConfirm = React.useCallback(async () => {
    if (confirmDisabled) return;
    if (onConfirmAsync) {
      setAsyncState("loading");
      try {
        await onConfirmAsync();
        setAsyncState("success");
        setTimeout(() => onOpenChange?.(false), 700);
      } catch {
        setAsyncState("idle");
      }
      return;
    }
    await onConfirm?.();
  }, [confirmDisabled, onConfirmAsync, onConfirm, onOpenChange]);

  // Wire the shortcut (e.g. "⌘↵" / "Enter") to actually confirm.
  React.useEffect(() => {
    if (!open || !shortcut) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, shortcut, handleConfirm]);

  const confirmContent =
    asyncState === "success" ? (
      <>
        <IconCircleCheck className="mr-1 h-4 w-4" />
        Done
      </>
    ) : delayUnmet ? (
      `${confirmLabel} (${remaining})`
    ) : (
      confirmLabel
    );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <div
            className={cn(
              "mb-2 inline-flex size-10 items-center justify-center rounded-md",
              iconClassName,
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        {confirmText != null && (
          <div className="space-y-1.5">
            <label
              htmlFor="kira-confirm-input"
              className="text-xs text-muted-foreground"
            >
              Type <span className="font-mono font-medium">{confirmText}</span>{" "}
              to confirm
            </label>
            <Input
              id="kira-confirm-input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              aria-label={`Type ${confirmText} to confirm`}
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          {action || (
            <AlertDialogAction
              variant={variant === "destructive" ? "destructive" : "default"}
              loading={loading || asyncState === "loading"}
              disabled={confirmDisabled}
              onClick={handleConfirm}
              shortcut={shortcut}
            >
              {confirmContent}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
        <AlertDialogClose />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogList,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogWarning,
  KiraAlertDialog,
};
export type {
  AlertDialogActionProps,
  AlertDialogCloseProps,
  AlertDialogContentProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogListProps,
  AlertDialogMediaProps,
  AlertDialogOverlayProps,
  AlertDialogWarningProps,
  KiraAlertDialogProps,
};
