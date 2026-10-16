"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import gsap from "gsap";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconX,
  IconChevronDown,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const alertVariants = cva("relative w-full rounded-lg p-4", {
  variants: {
    variant: {
      default: "bg-background text-foreground border border-border",
      info: "bg-info/10 border border-info/30 text-info",
      success: "bg-success/10 border border-success/30 text-success",
      warning: "bg-warning/10 border border-warning/30 text-warning",
      destructive:
        "bg-destructive/10 border border-destructive/30 text-destructive",
      // Soft: tinted background, muted foreground text (matches Badge *-soft)
      "info-soft":
        "bg-info/10 border border-transparent text-info-foreground dark:text-info",
      "success-soft":
        "bg-success/10 border border-transparent text-success-foreground dark:text-success",
      "warning-soft":
        "bg-warning/10 border border-transparent text-warning-foreground dark:text-warning",
      "destructive-soft":
        "bg-destructive/10 border border-transparent text-destructive-foreground dark:text-destructive",
      "outline-default": "bg-transparent border border-border text-foreground",
      "outline-info": "bg-transparent border border-info text-info",
      "outline-success": "bg-transparent border border-success text-success",
      "outline-warning": "bg-transparent border border-warning text-warning",
      "outline-destructive":
        "bg-transparent border border-destructive text-destructive",
    },
    size: {
      xs: "p-2 text-xs",
      sm: "p-3 text-sm",
      default: "p-4 text-sm",
      lg: "p-5 text-base",
    },
    // Full-width, edge-to-edge banner (no rounding).
    banner: {
      true: "rounded-none border-x-0",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    banner: false,
  },
});

// Icon size + optical top-offset per alert size. Applied directly to the
// icon slot (instead of relying on `[&>svg]` sibling selectors), so
// placement stays consistent whether the icon comes from the variant's
// default or a custom node is passed in.
const alertIconSize: Record<NonNullable<VariantProps<typeof alertVariants>["size"]>, string> = {
  xs: "h-3 w-3 mt-0.5",
  sm: "h-3.5 w-3.5 mt-0.5",
  default: "h-4 w-4 mt-0.5",
  lg: "h-5 w-5 mt-1",
};

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const alertIcons: Record<
  AlertVariant,
  React.ComponentType<{ className?: string }> | null
> = {
  default: null,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  destructive: IconAlertCircle,
  "info-soft": IconInfoCircle,
  "success-soft": IconCircleCheck,
  "warning-soft": IconAlertTriangle,
  "destructive-soft": IconAlertCircle,
  "outline-default": null,
  "outline-info": IconInfoCircle,
  "outline-success": IconCircleCheck,
  "outline-warning": IconAlertTriangle,
  "outline-destructive": IconAlertCircle,
};

// Left accent-border color per variant family.
const accentBorder: Record<AlertVariant, string> = {
  default: "border-l-4 border-l-border",
  info: "border-l-4 border-l-info",
  success: "border-l-4 border-l-success",
  warning: "border-l-4 border-l-warning",
  destructive: "border-l-4 border-l-destructive",
  "info-soft": "border-l-4 border-l-info",
  "success-soft": "border-l-4 border-l-success",
  "warning-soft": "border-l-4 border-l-warning",
  "destructive-soft": "border-l-4 border-l-destructive",
  "outline-default": "border-l-4 border-l-border",
  "outline-info": "border-l-4 border-l-info",
  "outline-success": "border-l-4 border-l-success",
  "outline-warning": "border-l-4 border-l-warning",
  "outline-destructive": "border-l-4 border-l-destructive",
};

interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  /** Override the auto icon. Pass `null` to hide it entirely. */
  icon?: React.ReactNode | null;
  closable?: boolean;
  onClose?: () => void;
  size?: "xs" | "sm" | "default" | "lg";
  /** Add a colored left accent border. */
  leftAccent?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      banner = false,
      showIcon = true,
      icon,
      closable = false,
      onClose,
      leftAccent = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const IconComponent = alertIcons[variant || "default"];
    const resolvedSize = size || "default";

    // A custom `icon` (including `null` to hide) always takes precedence
    // over the variant's default icon.
    const iconNode =
      icon === undefined
        ? IconComponent
          ? React.createElement(IconComponent, { className: "h-full w-full" })
          : null
        : icon;

    const hasIcon = showIcon && iconNode !== null && iconNode !== undefined;

    React.useImperativeHandle(ref, () => innerRef.current!);

    const handleClose = React.useCallback(() => {
      if (!innerRef.current || reducedMotion) {
        setIsVisible(false);
        onClose?.();

        return;
      }

      gsap.to(innerRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => {
          setIsVisible(false);
          onClose?.();
        },
      });
    }, [onClose, reducedMotion]);

    if (!isVisible) return null;

    return (
      <div
        ref={innerRef}
        data-slot="alert"
        role="alert"
        className={cn(
          alertVariants({ variant, size, banner }),
          leftAccent && accentBorder[variant || "default"],
          className
        )}
        {...props}
      >
        {/* Icon + body share a flex row so placement (always leading, never
            overlapping the text) is consistent regardless of whether the
            icon is the variant default or a custom node. */}
        <div className="flex gap-3">
          {hasIcon && (
            <span
              data-slot="alert-icon"
              className={cn("relative z-10 shrink-0", alertIconSize[resolvedSize])}
            >
              {iconNode}
            </span>
          )}
          <div className={cn("relative z-10 min-w-0 flex-1", closable && "pr-6")}>
            {children}
          </div>
        </div>
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity z-20"
            aria-label="Close alert"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

// =============================================================================
// AlertActions — per-alert action button row
// =============================================================================

interface AlertAction {
  label: React.ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
}

interface AlertActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: AlertAction[];
}

function AlertActions({ actions, className, ...props }: AlertActionsProps) {
  return (
    <div
      data-slot="alert-actions"
      className={cn("mt-3 flex flex-wrap gap-2", className)}
      {...props}
    >
      {actions.map((action, i) => (
        <Button
          key={i}
          size="sm"
          variant={action.variant ?? (i === 0 ? "default" : "outline")}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

// =============================================================================
// Relative time helper
// =============================================================================

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const s = Math.floor(diff / 1000);

  if (s < 60) return "just now";
  const m = Math.floor(s / 60);

  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);

  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);

  return `${d}d ago`;
}

function useRelativeTime(date?: Date): string | null {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!date) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);

    return () => clearInterval(interval);
  }, [date]);

  return date ? formatRelativeTime(date) : null;
}

// =============================================================================
// KiraAlert — one prop-driven inline alert
// =============================================================================

interface KiraAlertProps extends Omit<AlertProps, "children" | "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Override the auto icon (or `null` to hide). */
  icon?: React.ReactNode;
  /** Action buttons rendered under the body. */
  actions?: AlertAction[];
  /** Collapsible extra content behind a Show more / less toggle. */
  expandable?: boolean;
  expandedContent?: React.ReactNode;
  /** Copy-to-clipboard affordance. */
  copyable?: boolean;
  copyText?: string;
  /** Show a relative timestamp in the corner. */
  timestamp?: Date;
  dismissible?: boolean;
  children?: React.ReactNode;
}

function KiraAlert({
  title,
  description,
  icon,
  actions,
  expandable = false,
  expandedContent,
  copyable = false,
  copyText,
  timestamp,
  dismissible = false,
  variant = "default",
  showIcon = true,
  children,
  ...alertProps
}: KiraAlertProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const relative = useRelativeTime(timestamp);

  const handleCopy = React.useCallback(() => {
    const text =
      copyText ??
      (typeof description === "string"
        ? description
        : typeof title === "string"
          ? title
          : "");

    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [copyText, description, title]);

  return (
    <Alert
      variant={variant}
      showIcon={showIcon}
      icon={icon}
      closable={dismissible}
      {...alertProps}
    >
      {(copyable || relative) && (
        <div className="absolute right-0 top-0 flex items-center gap-2">
          {relative && <span className="text-xs opacity-70">{relative}</span>}
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label={copied ? "Copied" : "Copy"}
            >
              {copied ? (
                <IconCheck className="h-3.5 w-3.5" />
              ) : (
                <IconCopy className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
      {expandable && (
        <>
          <div
            className={cn(
              "grid",
              !reducedMotion && "transition-[grid-template-rows] duration-200",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div className="pt-2 text-sm">{expandedContent}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium opacity-80 hover:opacity-100"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Show more"}
            <IconChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                reducedMotion && "transition-none",
                expanded && "rotate-180"
              )}
            />
          </button>
        </>
      )}
      {actions && actions.length > 0 && <AlertActions actions={actions} />}
    </Alert>
  );
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
  KiraAlert,
  alertVariants,
  formatRelativeTime,
};

export type {
  AlertProps,
  AlertActionsProps,
  AlertAction,
  KiraAlertProps,
  AlertVariant,
};
