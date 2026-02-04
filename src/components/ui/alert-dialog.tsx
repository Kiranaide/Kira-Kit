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

interface AlertDialogOverlayProps extends AlertDialogPrimitive.Backdrop.Props {
  opacity?: number;
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

  useGSAP(
    () => {
      if (!overlayRef.current) return;

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        }
      );
    },
    { scope: overlayRef }
  );

  const blurClass = blurless
    ? ""
    : `supports-backdrop-filter:backdrop-blur-${blur}`;

  const colorClass =
    color === "black"
      ? `bg-black/${opacity}`
      : `bg-white/${opacity} dark:bg-white/${opacity}`;

  return (
    <AlertDialogPrimitive.Backdrop
      ref={overlayRef}
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50",
        colorClass,
        blurClass,
        className
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
  duration = 100,
  showCloseButton = false,
  children,
  ...props
}: AlertDialogContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const sizeClasses = {
    sm: "max-w-xs",
    default: "max-w-xs sm:max-w-sm",
    lg: "max-w-sm sm:max-w-md",
    xl: "max-w-md sm:max-w-lg",
    full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
  };

  const durationMap = {
    sm: 0.075,
    default: 0.1,
    lg: 0.15,
    xl: 0.2,
    full: 0.2,
  };

  useGSAP(
    () => {
      if (!contentRef.current) return;

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: durationMap[size],
          ease: "power2.out",
        }
      );
    },
    { scope: contentRef }
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
            ? "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none flex flex-col"
            : "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          sizeClasses[size],
          className
        )}
        style={
          {
            "--duration": `${duration}ms`,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
        {showCloseButton && <AlertDialogClose />}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
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
        className
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
        className
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
  }
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
        className
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
        className
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
        className
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
        "absolute right-3 top-3 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      <IconX className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </AlertDialogPrimitive.Close>
  );
}

interface AlertDialogWithIconProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "info" | "success" | "warning" | "danger" | "destructive";
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
  shortcut?: string;
}

function AlertDialogWithIcon({
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
}: AlertDialogWithIconProps) {
  const iconVariants = {
    info: {
      icon: IconInfoCircle,
      className: "bg-info/20 text-info",
    },
    success: {
      icon: IconCircleCheck,
      className: "bg-success/20 text-success",
    },
    warning: {
      icon: IconAlertTriangle,
      className: "bg-warning/20 text-warning",
    },
    danger: {
      icon: IconAlertTriangle,
      className: "bg-warning/20 text-warning",
    },
    destructive: {
      icon: IconCircleX,
      className: "bg-destructive/20 text-destructive",
    },
  };

  const { icon: IconComponent, className: iconClassName } =
    iconVariants[variant];

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <div
            className={cn(
              "mb-2 inline-flex size-10 items-center justify-center rounded-md",
              iconClassName
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
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          {action || (
            <AlertDialogAction
              variant={
                variant === "destructive" || variant === "danger"
                  ? "destructive"
                  : "default"
              }
              loading={loading}
              onClick={handleConfirm}
              shortcut={shortcut}
            >
              {confirmLabel}
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
  AlertDialogWithIcon,
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
  AlertDialogWithIconProps,
};
