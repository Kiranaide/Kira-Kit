"use client";

import * as React from "react";
import {
  resolveComponentDefaults,
  withOccurrenceKeys,
} from "@/lib/component-utils";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleCheck,
  IconCircleX,
  IconLoader,
} from "@tabler/icons-react";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dialogContentVariants } from "@/components/ui/dialog";

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
const overlayColorMap = {
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

const overlayBlurMap = {
  none: "",
  xs: "supports-backdrop-filter:backdrop-blur-xs",
  sm: "supports-backdrop-filter:backdrop-blur-sm",
  md: "supports-backdrop-filter:backdrop-blur-md",
  lg: "supports-backdrop-filter:backdrop-blur-lg",
  xl: "supports-backdrop-filter:backdrop-blur-xl",
};

interface AlertDialogOverlayProps extends Omit<
  AlertDialogPrimitive.Backdrop.Props,
  "className"
> {
  className?: string;
  opacity?: 20 | 30 | 40 | 50 | 60 | 70 | 80;
  blur?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  color?: "black" | "white";
  blurless?: boolean;
}

function AlertDialogOverlay(input: AlertDialogOverlayProps) {
  const { className, opacity, blur, color, blurless, ...props } =
    resolveComponentDefaults(input, ALERT_DIALOG_OVERLAY_DEFAULTS_1);

  const blurClass = blurless ? "" : overlayBlurMap[blur];

  const colorClass =
    overlayColorMap[color][opacity] ?? overlayColorMap[color][50];

  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 transition-opacity duration-200 motion-reduce:transition-none data-starting-style:opacity-0 data-ending-style:opacity-0",
        colorClass,
        blurClass,
        className,
      )}
      {...props}
    />
  );
}

interface AlertDialogContentProps extends Omit<
  AlertDialogPrimitive.Popup.Props,
  "className" | "style"
> {
  className?: string;
  style?: React.CSSProperties;
  size?: "sm" | "default" | "lg" | "xl" | "full";
  duration?: number;
  showCloseButton?: boolean;
  portalProps?: Omit<AlertDialogPrimitive.Portal.Props, "children">;
  overlayProps?: AlertDialogOverlayProps;
}

const alertDialogContentVariants = cva("group/alert-dialog-content gap-4 p-4", {
  variants: {
    size: {
      sm: "max-w-xs",
      default: "max-w-sm",
      lg: "max-w-md",
      xl: "max-w-lg",
      full: "h-full max-w-none overflow-hidden",
    },
  },
  defaultVariants: { size: "default" },
});

function AlertDialogContent({
  className,
  size = "default",
  duration,
  style,
  portalProps,
  overlayProps,
  showCloseButton = false,
  children,
  ...props
}: AlertDialogContentProps) {
  const transitionStyle =
    duration === undefined
      ? undefined
      : { transitionDuration: `${Math.max(0, duration)}ms` };

  return (
    <AlertDialogPortal {...portalProps}>
      <AlertDialogOverlay {...overlayProps} />
      <AlertDialogPrimitive.Viewport
        data-slot="alert-dialog-viewport"
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          data-size={size}
          className={cn(
            dialogContentVariants(),
            alertDialogContentVariants({ size }),
            "outline-none",
            className,
          )}
          style={{ ...transitionStyle, ...style }}
          {...props}
        >
          {size === "full" ? (
            <FullScreenBody>{children}</FullScreenBody>
          ) : (
            children
          )}
          {showCloseButton && <AlertDialogClose />}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPortal>
  );
}

// Splits header/footer out of the scrollable body for `size="full"`: the
// footer is a flex sibling after the flex-1 scroll area, so it pins to the
// bottom even when the body doesn't fill the height, and both can bleed
// edge-to-edge. `overflow-y-auto` would implicitly force `overflow-x: auto`.
function FullScreenBody({ children }: { children: React.ReactNode }) {
  let header: React.ReactNode = null;
  let footer: React.ReactNode = null;
  const body: React.ReactNode[] = [];

  React.Children.toArray(children).forEach((child) => {
    if (React.isValidElement(child) && child.type === AlertDialogHeader) {
      header = child;
    } else if (
      React.isValidElement(child) &&
      child.type === AlertDialogFooter
    ) {
      footer = child;
    } else {
      body.push(child);
    }
  });

  return (
    <>
      {header}
      <div
        data-slot="alert-dialog-body"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
      >
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
    // kira-kit-ignore spacing-scale: title-to-description optical gap (contract-sanctioned exception)
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "group-has-data-[slot=alert-dialog-close]/alert-dialog-content:pr-8 min-w-0 wrap-break-word grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] shrink-0",
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
        layout === "horizontal" &&
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
  /** Set false when the caller owns async completion and dismissal. */
  closeOnClick?: boolean;
}

function AlertDialogAction(input: AlertDialogActionProps) {
  const {
    className,
    variant,
    size,
    loading,
    confirm,
    shortcut,
    closeOnClick,
    disabled,
    children,
    ...props
  } = resolveComponentDefaults(input, ALERT_DIALOG_ACTION_DEFAULTS_2);

  const button = (
    <Button
      data-slot="alert-dialog-action"
      data-confirm={confirm}
      data-loading={loading}
      aria-busy={loading || undefined}
      variant={confirm ? "default" : variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        "h-auto min-h-9 max-w-full whitespace-normal py-2 aria-disabled:opacity-50",
        loading && "cursor-wait",
        className,
      )}
      {...props}
    >
      {loading && (
        <IconLoader
          data-slot="alert-dialog-loading"
          aria-hidden="true"
          className="mr-2 h-4 w-4"
          data-icon="inline-start"
        />
      )}
      {children}
      {shortcut && (
        // kira-kit-ignore arbitrary-values: sub-12px micro type is a documented exception
        // kira-kit-ignore spacing-scale: kbd shortcut chip: compact label-tier padding and micro type
        <kbd
          data-slot="alert-dialog-shortcut"
          aria-hidden="true"
          className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span data-slot="alert-dialog-shortcut-label" className="text-xs">
            {shortcut}
          </span>
        </kbd>
      )}
    </Button>
  );

  return closeOnClick ? (
    <AlertDialogPrimitive.Close
      disabled={disabled || loading}
      render={button}
    />
  ) : (
    button
  );
}

interface AlertDialogCancelProps extends Omit<
  AlertDialogPrimitive.Close.Props,
  "className"
> {
  className?: string;
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
      className={cn(
        "h-auto min-h-9 max-w-full whitespace-normal py-2",
        className,
      )}
      render={
        <Button variant={variant} size={size}>
          {children}
          {shortcut && (
            // kira-kit-ignore arbitrary-values: sub-12px micro type is a documented exception
            // kira-kit-ignore spacing-scale: kbd shortcut chip: compact label-tier padding and micro type
            <kbd
              data-slot="alert-dialog-shortcut"
              aria-hidden="true"
              className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
            >
              <span data-slot="alert-dialog-shortcut-label" className="text-xs">
                {shortcut}
              </span>
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
}: Omit<
  React.ComponentProps<typeof AlertDialogPrimitive.Title>,
  "className"
> & {
  className?: string;
}) {
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
}: Omit<
  React.ComponentProps<typeof AlertDialogPrimitive.Description>,
  "className"
> & { className?: string }) {
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
      <IconComponent
        data-slot="alert-dialog-warning-icon"
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0"
      />
      <div data-slot="alert-dialog-warning-content">{children}</div>
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
      {withOccurrenceKeys(items, (item) => item).map(({ item, key }) => (
        <li
          data-slot="alert-dialog-list-item"
          key={key}
          className={
            variant === "checkbox" ? "flex items-center gap-2" : undefined
          }
        >
          {variant === "checkbox" && (
            <span
              data-slot="alert-dialog-list-marker"
              aria-hidden="true"
              className="inline-block h-4 w-4 rounded border border-muted-foreground/30"
            />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}

interface AlertDialogCloseProps extends Omit<
  React.ComponentProps<typeof AlertDialogPrimitive.Close>,
  "className"
> {
  className?: string;
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
      <IconX
        data-slot="alert-dialog-close-icon"
        aria-hidden="true"
        className="h-4 w-4"
      />
      <span data-slot="alert-dialog-close-label" className="sr-only">
        Close
      </span>
    </AlertDialogPrimitive.Close>
  );
}

interface KiraAlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  variant?: "info" | "success" | "warning" | "destructive";
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  /** Custom actions own their confirmation gates and dismissal. */
  action?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "default" | "lg" | "xl";
  /** Display hint; Cmd/Ctrl+Enter confirms while focus is inside this popup. */
  shortcut?: string;
  confirmText?: string;
  /** Seconds of visible time before confirmation becomes available. */
  confirmDelay?: number;
  onConfirmAsync?: () => Promise<void>;
  errorMessage?: string;
  showCloseButton?: boolean;
}

const kiraDialogIcons = {
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  destructive: IconCircleX,
};

function KiraAlertDialog(input0: KiraAlertDialogProps) {
  const state0 = useKiraAlertDialogSetup(input0);
  const state1 = useKiraAlertDialogState2(state0);
  const state2 = useKiraAlertDialogState3(state1);
  const state3 = useKiraAlertDialogActions(state2);

  return renderKiraAlertDialog(state3);
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
  alertDialogContentVariants,
  alertDialogMediaVariants,
};

export type {
  AlertDialogActionProps,
  AlertDialogCloseProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogListProps,
  AlertDialogMediaProps,
  AlertDialogOverlayProps,
  AlertDialogWarningProps,
  KiraAlertDialogProps,
};

type renderBuildBodySectionPart1Args = {
  children: KiraAlertDialogProps["children"];
  confirmText: KiraAlertDialogProps["confirmText"];
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  typed: string;
  busy: boolean;
  committed: boolean;
  statusId: string;
  setTyped: React.Dispatch<React.SetStateAction<string>>;
  state: "error" | "idle" | "pending" | "success";
  statusText: string;
};

function renderBuildBodySectionPart1({
  children,
  confirmText,
  inputId,
  inputRef,
  typed,
  busy,
  committed,
  statusId,
  setTyped,
  state,
  statusText,
}: renderBuildBodySectionPart1Args) {
  return (
    <>
      {children}
      {confirmText != null && (
        <div data-slot="alert-dialog-confirm-field" className="space-y-1.5">
          <label
            data-slot="alert-dialog-confirm-label"
            htmlFor={inputId}
            className="text-sm text-muted-foreground"
          >
            Type{" "}
            <span
              data-slot="alert-dialog-confirm-value"
              className="font-mono font-medium"
            >
              {confirmText}
            </span>{" "}
            to confirm
          </label>
          <Input
            ref={inputRef}
            id={inputId}
            value={typed}
            disabled={busy || committed}
            autoComplete="off"
            aria-describedby={statusId}
            onChange={(event) => setTyped(event.target.value)}
          />
        </div>
      )}
      <output
        data-slot="alert-dialog-status"
        id={statusId}

        aria-atomic="true"
        className={`block ${cn(
          "min-h-5 text-sm tabular-nums",
          state === "error" ? "text-destructive" : "text-muted-foreground",
        )}`}
      >
        {statusText}
      </output>
    </>
  );
}

type renderBuildFooterSectionPart2Args = {
  cancelRef: React.RefObject<HTMLButtonElement | null>;
  busy: boolean;
  committed: boolean;
  onCancel: KiraAlertDialogProps["onCancel"];
  cancelLabel: string;
  action: KiraAlertDialogProps["action"];
  variant: "success" | "destructive" | "warning" | "info";
  confirmRef: React.RefObject<HTMLButtonElement | null>;
  confirmDisabled: boolean;
  handleConfirm: () => Promise<void>;
  shortcut: KiraAlertDialogProps["shortcut"];
  statusId: string;
  resolveValue1: () => string | React.JSX.Element;
};

function renderBuildFooterSectionPart2({
  cancelRef,
  busy,
  committed,
  onCancel,
  cancelLabel,
  action,
  variant,
  confirmRef,
  confirmDisabled,
  handleConfirm,
  shortcut,
  statusId,
  resolveValue1,
}: renderBuildFooterSectionPart2Args) {
  return (
    <AlertDialogFooter>
      <AlertDialogCancel
        ref={cancelRef}
        disabled={busy || committed}
        onClick={onCancel}
      >
        {cancelLabel}
      </AlertDialogCancel>
      {action ?? (
        <AlertDialogAction
          variant={variant === "destructive" ? "destructive" : "default"}
          ref={confirmRef}
          focusableWhenDisabled
          closeOnClick={false}
          loading={busy}
          disabled={confirmDisabled}
          onClick={handleConfirm}
          shortcut={shortcut}
          aria-keyshortcuts={shortcut ? "Control+Enter Meta+Enter" : undefined}
          aria-describedby={statusId}
        >
          {resolveValue1()}
        </AlertDialogAction>
      )}
    </AlertDialogFooter>
  );
}

type renderKiraAlertDialogSectionPart3Args = {
  isOpen: boolean;
  busy: boolean;
  committed: boolean;
  operation: React.RefObject<{ generation: number; locked: boolean }>;
  changeOpen: (next: boolean) => void;
  trigger: KiraAlertDialogProps["trigger"];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  size: "default" | "sm" | "lg" | "xl";
  confirmText: KiraAlertDialogProps["confirmText"];
  cancelRef: React.RefObject<HTMLButtonElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  shortcut: KiraAlertDialogProps["shortcut"];
  handleConfirm: () => Promise<void>;
  buildHeader: () => React.JSX.Element;
  buildBody: () => React.JSX.Element;
  buildFooter: () => React.JSX.Element;
  showCloseButton: boolean;
};

function RenderKiraAlertDialogSectionPart3({
  isOpen,
  busy,
  committed,
  operation,
  changeOpen,
  trigger,
  triggerRef,
  size,
  confirmText,
  cancelRef,
  inputRef,
  shortcut,
  handleConfirm,
  buildHeader,
  buildBody,
  buildFooter,
  showCloseButton,
}: renderKiraAlertDialogSectionPart3Args) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(next, details) => {
        if (
          !next &&
          isOpen &&
          (busy || committed || operation.current.locked)
        ) {
          details.cancel();

          return;
        }

        changeOpen(next);
      }}
    >
      {trigger && <AlertDialogTrigger ref={triggerRef} render={trigger} />}
      <AlertDialogContent
        size={size}
        aria-busy={busy || undefined}
        initialFocus={() =>
          confirmText == null ? cancelRef.current : inputRef.current
        }
        finalFocus={trigger ? triggerRef : undefined}
        onKeyDown={(event) => {
          if (
            shortcut &&
            event.key === "Enter" &&
            (event.metaKey || event.ctrlKey) &&
            !event.repeat &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            void handleConfirm();
          }
        }}
      >
        {buildHeader()}
        {buildBody()}
        {buildFooter()}
        {showCloseButton && <AlertDialogClose disabled={busy || committed} />}
      </AlertDialogContent>
    </AlertDialog>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const ALERT_DIALOG_OVERLAY_DEFAULTS_1 = {
  opacity: 50,
  blur: "xs",
  color: "black",
  blurless: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const ALERT_DIALOG_ACTION_DEFAULTS_2 = {
  variant: "default",
  size: "default",
  loading: false,
  confirm: false,
  closeOnClick: true,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_ALERT_DIALOG_DEFAULTS_3 = {
  defaultOpen: false,
  variant: "info",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  loading: false,
  size: "default",
  confirmDelay: 0,
  errorMessage: "Could not complete the action. Try again.",
  showCloseButton: false,
} as const;

function useKiraAlertDialogSetup(input: KiraAlertDialogProps) {
  const resolvedProps = resolveComponentDefaults(
    input,
    KIRA_ALERT_DIALOG_DEFAULTS_3,
  );

  const { open, defaultOpen, confirmDelay } = resolvedProps;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isOpen = open ?? uncontrolledOpen;

  const inputId = React.useId();

  const statusId = React.useId();

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const confirmRef = React.useRef<HTMLButtonElement>(null);

  const operation = React.useRef({ generation: 0, locked: false });

  const [typed, setTyped] = React.useState("");

  const [remaining, setRemaining] = React.useState(
    Math.max(0, Math.ceil(confirmDelay)),
  );

  const [state, setState] = React.useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const [previous, setPrevious] = React.useState({
    open: isOpen,
    delay: confirmDelay,
  });

  return {
    ...resolvedProps,
    setUncontrolledOpen,
    isOpen,
    inputId,
    statusId,
    cancelRef,
    triggerRef,
    inputRef,
    confirmRef,
    operation,
    typed,
    setTyped,
    remaining,
    setRemaining,
    state,
    setState,
    previous,
    setPrevious,
  };
}

function useKiraAlertDialogState2(
  model: ReturnType<typeof useKiraAlertDialogSetup>,
) {
  const {
    open,
    onOpenChange,
    confirmDelay,
    setUncontrolledOpen,
    isOpen,
    operation,
    setTyped,
    setRemaining,
    state,
    setState,
    previous,
    setPrevious,
  } = model;

  if (previous.open !== isOpen || previous.delay !== confirmDelay) {
    setPrevious({ open: isOpen, delay: confirmDelay });

    if (previous.open !== isOpen && isOpen) {
      setTyped("");
      setState("idle");
    }

    setRemaining(Math.max(0, Math.ceil(confirmDelay)));
  }

  const changeOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange, setUncontrolledOpen],
  );

  // A completion from an earlier opening must never update or close a later one.
  React.useEffect(() => {
    const request = operation.current;

    return () => {
      request.generation += 1;
      request.locked = false;
    };
  }, [isOpen, setUncontrolledOpen, operation]);

  React.useEffect(() => {
    if (!isOpen || confirmDelay <= 0) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible")
        setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, confirmDelay, operation, setRemaining]);

  const closeAfterSuccess = React.useEffectEvent(() => changeOpen(false));

  React.useEffect(() => {
    if (!isOpen || state !== "success") return;
    const timer = window.setTimeout(() => closeAfterSuccess(), 500);

    return () => window.clearTimeout(timer);
  }, [isOpen, state, setRemaining]);

  return { ...model, changeOpen };
}

function useKiraAlertDialogState3(
  model: ReturnType<typeof useKiraAlertDialogState2>,
) {
  const {
    title,
    description,
    action,
    confirmText,
    variant,
    loading,
    errorMessage,
    isOpen,
    operation,
    typed,
    remaining,
    state,
  } = model;

  const busy = loading || state === "pending";

  const committed = state === "success";

  const typeGateUnmet = confirmText != null && typed !== confirmText;

  const confirmDisabled = busy || committed || typeGateUnmet || remaining > 0;

  const handleConfirm = async () => {
    if (
      !canStartAlertDialogConfirmation({
        isOpen,
        confirmDisabled,
        locked: operation.current.locked,
        hasAction: action != null,
      })
    )
      return;
    await runAlertDialogConfirmation(model);
  };

  const statusText = getAlertDialogStatusText({
    state,
    errorMessage,
    busy,
    committed,
    remaining,
    typeGateUnmet,
    confirmText,
  });

  const MediaIcon = kiraDialogIcons[variant];

  const buildHeader = () => (
    <AlertDialogHeader>
      <AlertDialogMedia variant={variant}>
        <MediaIcon data-slot="alert-dialog-media-icon" aria-hidden />
      </AlertDialogMedia>
      <AlertDialogTitle>{title}</AlertDialogTitle>
      {description && (
        <AlertDialogDescription>{description}</AlertDialogDescription>
      )}
    </AlertDialogHeader>
  );

  return {
    ...model,
    busy,
    committed,
    confirmDisabled,
    handleConfirm,
    statusText,
    buildHeader,
  };
}

async function runAlertDialogConfirmation(
  model: ReturnType<typeof useKiraAlertDialogState2>,
) {
  const { operation, confirmRef, setState, onConfirmAsync, onConfirm } = model;
  const request = operation.current;
  const generation = ++request.generation;
  request.locked = true;
  confirmRef.current?.focus();
  setState("pending");

  try {
    await (onConfirmAsync ?? onConfirm)?.();

    if (request.generation === generation) setState("success");
  } catch {
    if (request.generation === generation) {
      request.locked = false;
      setState("error");
    }
  }
}

function getAlertDialogStatusText({
  state,
  errorMessage,
  busy,
  committed,
  remaining,
  typeGateUnmet,
  confirmText,
}: {
  state: string;
  errorMessage: string;
  busy: boolean;
  committed: boolean;
  remaining: number;
  typeGateUnmet: boolean;
  confirmText?: string;
}) {
  if (state === "error") return errorMessage;

  if (busy) return "Completing the action. Please wait.";

  if (committed) return "Action completed.";

  if (remaining > 0) return `You can confirm in ${remaining} seconds.`;

  if (typeGateUnmet) return `Enter ${confirmText} to enable confirmation.`;

  return "";
}

function canStartAlertDialogConfirmation({
  isOpen,
  confirmDisabled,
  locked,
  hasAction,
}: {
  isOpen: boolean;
  confirmDisabled: boolean;
  locked: boolean;
  hasAction: boolean;
}) {
  return isOpen && !confirmDisabled && !locked && !hasAction;
}

function useKiraAlertDialogActions(
  model: ReturnType<typeof useKiraAlertDialogState3>,
) {
  const {
    onCancel,
    action,
    children,
    shortcut,
    confirmText,
    variant,
    confirmLabel,
    cancelLabel,
    inputId,
    statusId,
    cancelRef,
    inputRef,
    confirmRef,
    typed,
    setTyped,
    state,
    busy,
    committed,
    confirmDisabled,
    handleConfirm,
    statusText,
  } = model;

  const buildBody = () =>
    renderBuildBodySectionPart1({
      children,
      confirmText,
      inputId,
      inputRef,
      typed,
      busy,
      committed,
      statusId,
      setTyped,
      state,
      statusText,
    });

  const buildFooter = () => {
    const resolveValue1 = () => {
      if (committed) {
        return (
          <>
            <IconCircleCheck
              data-slot="alert-dialog-success-icon"
              aria-hidden="true"
            />
            Done
          </>
        );
      }

      if (busy) {
        return "Working..." as const;
      }

      return confirmLabel;
    };

    return renderBuildFooterSectionPart2({
      cancelRef,
      busy,
      committed,
      onCancel,
      cancelLabel,
      action,
      variant,
      confirmRef,
      confirmDisabled,
      handleConfirm,
      shortcut,
      statusId,
      resolveValue1,
    });
  };

  return { ...model, buildBody, buildFooter };
}

function renderKiraAlertDialog({
  trigger,
  shortcut,
  confirmText,
  size,
  showCloseButton,
  isOpen,
  cancelRef,
  triggerRef,
  inputRef,
  operation,
  changeOpen,
  busy,
  committed,
  handleConfirm,
  buildHeader,
  buildBody,
  buildFooter,
}: ReturnType<typeof useKiraAlertDialogActions>) {
  return (
    <RenderKiraAlertDialogSectionPart3
      {...{
        isOpen,
        busy,
        committed,
        operation,
        changeOpen,
        trigger,
        triggerRef,
        size,
        confirmText,
        cancelRef,
        inputRef,
        shortcut,
        handleConfirm,
        buildHeader,
        buildBody,
        buildFooter,
        showCloseButton,
      }}
    />
  );
}
