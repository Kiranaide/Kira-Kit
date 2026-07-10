"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const badgeVariants = cva(
  "gap-1.5 rounded-full border border-transparent font-medium transition-all inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground [a]:hover:bg-destructive/80",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        info: "bg-info text-info-foreground",
        outline:
          "border-border text-foreground bg-transparent [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "bg-muted text-muted-foreground hover:bg-muted/80 dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        "primary-soft": "bg-primary/10 text-primary",
        "secondary-soft": "bg-secondary/50 text-secondary-foreground",
        "destructive-soft": "bg-destructive/10 text-destructive",
        "success-soft":
          "bg-success/10 text-success-foreground dark:text-success",
        "warning-soft":
          "bg-warning/10 text-warning-foreground dark:text-warning",
        "info-soft": "bg-info/10 text-info-foreground dark:text-info",
      },

      size: {
        xs: "h-4 px-1.5 text-[10px] [&>svg]:size-2.5",
        sm: "h-5 px-2 text-xs [&>svg]:size-3",
        default: "h-6 px-2.5 text-xs [&>svg]:size-3.5",
        lg: "h-7 px-3 text-sm [&>svg]:size-4",
        xl: "h-8 px-4 text-sm [&>svg]:size-4",
      },

      clickable: {
        true: "cursor-pointer hover:opacity-90 active:scale-95",
        false: "",
      },

      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },

      shimmer: {
        true: "relative before:absolute before:inset-0 before:-translate-x-full before:animate-badge-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      clickable: false,
      disabled: false,
      shimmer: false,
    },
  }
);

const badgeDotVariants = cva("rounded-full shrink-0", {
  variants: {
    color: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      success: "bg-success",
      warning: "bg-warning",
      info: "bg-info",
      outline: "bg-foreground",
      muted: "bg-muted-foreground",
    },
    size: {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      default: "h-2.5 w-2.5",
      lg: "h-3 w-3",
      xl: "h-3.5 w-3.5",
    },
    pulse: {
      none: "",
      continuous: "animate-ping",
      once: "animate-ping-once",
    },
  },
  defaultVariants: {
    color: "default",
    size: "default",
    pulse: "none",
  },
});

const badgeCloseVariants = cva(
  "rounded-full p-0.5 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2",
  {
    variants: {
      size: {
        xs: "h-3 w-3 [&>svg]:size-2",
        sm: "h-3.5 w-3.5 [&>svg]:size-2.5",
        default: "h-4 w-4 [&>svg]:size-3",
        lg: "h-4.5 w-4.5 [&>svg]:size-3.5",
        xl: "h-5 w-5 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface BadgeProps
  extends useRender.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;

  iconPosition?: "left" | "right";

  dot?:
    | boolean
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline"
    | "muted";

  dotPulse?: "none" | "continuous" | "once";

  dismissible?: boolean;

  onClose?: () => void;

  loading?: boolean;

  disabled?: boolean;

  closeLabel?: string;

  /** Light sweep effect, e.g. to highlight a "New" badge. Respects reduced motion. */
  shimmer?: boolean;

  /** Directional trend arrow rendered before the content. */
  trend?: "up" | "down";

  /** Preset shorthand that sets sensible variant + label styling. */
  preset?: "beta" | "new" | "version";
}

function Badge({
  className,
  variant = "default",
  size = "default",
  icon,
  iconPosition = "left",
  dot = false,
  dotPulse = "none",
  dismissible = false,
  onClose,
  loading = false,
  disabled = false,
  closeLabel = "Remove",
  shimmer = false,
  trend,
  preset,
  render,
  children,
  ...props
}: BadgeProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);
  const reducedMotion = useReducedMotion();

  // Preset shorthands: resolve variant + default content when not overridden.
  const presetVariant: NonNullable<BadgeProps["variant"]> | undefined =
    preset === "beta"
      ? "warning-soft"
      : preset === "new"
        ? "success-soft"
        : preset === "version"
          ? "secondary"
          : undefined;
  const resolvedVariant = presetVariant ?? variant;
  const resolvedChildren =
    children ??
    (preset === "beta"
      ? "Beta"
      : preset === "new"
        ? "New"
        : undefined);

  const handleClose = React.useCallback(() => {
    if (loading || disabled) return;
    setIsClosing(true);
    setTimeout(
      () => {
        setIsVisible(false);
        onClose?.();
      },
      reducedMotion ? 0 : 150
    );
  }, [loading, disabled, onClose, reducedMotion]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && dismissible) {
        e.preventDefault();
        handleClose();
      }
    },
    [dismissible, handleClose]
  );

  const dotColor = dot === true || dot === false ? "default" : dot;
  const hasDot = dot !== false;

  const badgeContent = (
    <>
      {hasDot && (
        <span
          className={cn(
            badgeDotVariants({
              color: dotColor,
              size,
              pulse:
                !reducedMotion &&
                (dotPulse === "continuous" || dotPulse === "once")
                  ? dotPulse
                  : "none",
            })
          )}
        />
      )}
      {trend && (
        <span className="shrink-0 flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">
          {trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
        </span>
      )}
      {icon && (
        <span className="shrink-0 flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">
          {loading ? (
            <svg className="animate-spin h-[1em] w-[1em]" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
      <span className={cn(dismissible && !loading && "pr-1")}>
        {resolvedChildren}
      </span>
      {dismissible && !loading && (
        <button
          type="button"
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            badgeCloseVariants({ size }),
            "focus-visible:ring-offset-1"
          )}
          aria-label={closeLabel}
        >
          <IconX />
        </button>
      )}
    </>
  );

  return useRender({
    defaultTagName: isVisible ? "span" : "div",
    props: mergeProps<"span">(
      { "data-slot": "badge" } as React.HTMLAttributes<HTMLSpanElement>,
      {
        className: cn(
          badgeVariants({
            variant: resolvedVariant,
            size,
            clickable: props.onClick ? true : false,
            disabled,
            shimmer: shimmer && !reducedMotion,
          }),
          iconPosition === "right" && "flex-row-reverse",
          isClosing && "opacity-0 scale-95 transition-all duration-150",
          !isVisible && "hidden",
          className
        ),
        "aria-disabled": disabled || undefined,
        tabIndex: props.onClick && !disabled ? 0 : undefined,
        onKeyDown:
          props.onClick && !disabled
            ? (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).click();
                }
              }
            : undefined,
        children: badgeContent,
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant: resolvedVariant,
      size,
    },
  });
}

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "default" | "lg";
  pulse?: "none" | "continuous" | "once";
  label?: string;
}

// Maps the status vocabulary onto the shared Badge dot colors + soft variants,
// so StatusBadge inherits Badge's sizing/spacing instead of re-declaring it.
const STATUS_TO_DOT: Record<
  StatusBadgeProps["status"],
  NonNullable<Exclude<BadgeProps["dot"], boolean>>
> = {
  success: "success",
  warning: "warning",
  error: "destructive",
  info: "info",
  default: "muted",
};

const STATUS_LABELS: Record<StatusBadgeProps["status"], string> = {
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
  default: "Unknown",
};

function StatusBadge({
  status,
  size = "default",
  pulse = "none",
  label,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const displayLabel = label || STATUS_LABELS[status];

  return (
    <Badge
      variant="ghost"
      size={size}
      dot={STATUS_TO_DOT[status]}
      dotPulse={pulse}
      className={className}
      {...({ "data-slot": "status-badge", role: "status" } as object)}
      {...props}
    >
      {displayLabel}
      {children}
    </Badge>
  );
}

type CountFormat = "default" | "short" | "commas";

function formatCount(count: number, format: CountFormat, max: number): string {
  if (format === "short") {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M+`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
    }
    return count > max ? `${max}+` : count.toString();
  }
  if (format === "commas") {
    const formatted = count.toLocaleString();
    return count > max ? `${max.toLocaleString()}+` : formatted;
  }
  return count > max ? `${max}+` : count.toString();
}

interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
  format?: CountFormat;
  size?: "xs" | "sm" | "default";
  variant?: "default" | "destructive" | "secondary";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  pulse?: boolean;
  /** Animate the number rolling from its previous value. Respects reduced motion. */
  animateCount?: boolean;
}

function CountBadge({
  count,
  max = 99,
  format = "default",
  size = "default",
  variant = "default",
  icon,
  iconPosition = "left",
  pulse = false,
  animateCount = false,
  className,
  ...props
}: CountBadgeProps) {
  const reducedMotion = useReducedMotion();
  const showPulse = pulse && count > 0 && !reducedMotion;
  const displayCount = formatCount(count, format, max);

  // Number ticker: tween a displayed integer toward `count` on change.
  const numberRef = React.useRef<HTMLSpanElement>(null);
  const prevCount = React.useRef(count);
  useGSAP(() => {
    const el = numberRef.current;
    if (!el || !animateCount || format !== "default") return;
    const from = prevCount.current;
    prevCount.current = count;
    if (reducedMotion || from === count) {
      el.textContent = displayCount;
      return;
    }
    const obj = { val: from };
    gsap.to(obj, {
      val: count,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        const v = Math.round(obj.val);
        el.textContent = v > max ? `${max}+` : String(v);
      },
    });
  }, [count, animateCount, reducedMotion, format, displayCount, max]);

  return (
    <span
      data-slot="count-badge"
      className={cn(
        badgeVariants({ variant, size }),
        "justify-center tabular-nums px-2",
        size === "xs" && "min-w-4",
        size === "sm" && "min-w-5",
        size === "default" && "min-w-6",
        iconPosition === "right" && "flex-row-reverse",
        showPulse && "animate-badge-pulse",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">
          {icon}
        </span>
      )}
      <span ref={numberRef}>{displayCount}</span>
    </span>
  );
}

interface TagBadgeProps extends Omit<BadgeProps, "variant"> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "primary-soft"
    | "secondary-soft"
    | "success"
    | "success-soft"
    | "warning"
    | "warning-soft"
    | "info"
    | "info-soft"
    | "destructive"
    | "destructive-soft";
  removable?: boolean;
  onRemove?: () => void;
}

function TagBadge({
  variant = "default",
  size = "sm",
  icon,
  iconPosition = "left",
  removable = false,
  onRemove,
  children,
  className,
  ...props
}: TagBadgeProps) {
  const [isRemoved, setIsRemoved] = React.useState(false);

  const handleRemove = () => {
    setIsRemoved(true);
    onRemove?.();
  };

  if (isRemoved) return null;

  return (
    <Badge
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      dismissible={removable}
      onClose={handleRemove}
      className={cn("rounded-md", className)}
      {...props}
    >
      {children}
    </Badge>
  );
}

interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "tight" | "normal" | "loose";
  orientation?: "horizontal" | "vertical";
}

function BadgeGroup({
  gap = "normal",
  orientation = "horizontal",
  className,
  children,
  ...props
}: BadgeGroupProps) {
  const gapClasses = {
    tight: "gap-1",
    normal: "gap-2",
    loose: "gap-3",
  };

  const orientationClasses = {
    horizontal: "flex flex-row flex-wrap items-center",
    vertical: "flex flex-col",
  };

  return (
    <div
      data-slot="badge-group"
      className={cn(
        orientationClasses[orientation],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// TagInput — keyboard-removable tag collection
// =============================================================================

interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current tags (controlled). */
  value: string[];
  /** Fired whenever the tag list changes (add or remove). */
  onChange: (tags: string[]) => void;
  variant?: TagBadgeProps["variant"];
  size?: BadgeProps["size"];
  placeholder?: string;
  /** Disable adding via the inline input (removal-only). */
  readOnlyInput?: boolean;
  "aria-label"?: string;
}

function TagInput({
  value,
  onChange,
  variant = "secondary",
  size = "sm",
  placeholder = "Add tag…",
  readOnlyInput = false,
  className,
  "aria-label": ariaLabel = "Tags",
  ...props
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addDraft = () => {
    const next = draft.trim();
    if (!next || value.includes(next)) {
      setDraft("");
      return;
    }
    onChange([...value, next]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addDraft();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      e.preventDefault();
      removeAt(value.length - 1);
    }
  };

  return (
    <div
      data-slot="tag-input"
      role="group"
      aria-label={ariaLabel}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background p-2 text-sm focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-colors",
        className
      )}
      {...props}
    >
      {value.map((tag, i) => (
        <TagBadge
          key={`${tag}-${i}`}
          variant={variant}
          size={size}
          removable
          onRemove={() => removeAt(i)}
          closeLabel={`Remove ${tag}`}
        >
          {tag}
        </TagBadge>
      ))}
      {!readOnlyInput && (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addDraft}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-24 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      )}
    </div>
  );
}

// =============================================================================
// KiraBadge — one prop-driven entry point over every badge mode
// =============================================================================

interface KiraBadgeProps {
  mode?: "badge" | "status" | "count" | "tag" | "dot";
  // Shared
  variant?: BadgeProps["variant"];
  size?: BadgeProps["size"];
  className?: string;
  children?: React.ReactNode;
  // badge / tag
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  trend?: "up" | "down";
  shimmer?: boolean;
  preset?: BadgeProps["preset"];
  dismissible?: boolean;
  onClose?: () => void;
  // status
  status?: StatusBadgeProps["status"];
  label?: string;
  pulse?: "none" | "continuous" | "once";
  // count
  count?: number;
  max?: number;
  format?: CountFormat;
  animateCount?: boolean;
  // dot
  dot?: BadgeProps["dot"];
  dotPulse?: BadgeProps["dotPulse"];
}

function KiraBadge({
  mode = "badge",
  variant,
  size,
  className,
  children,
  icon,
  iconPosition,
  trend,
  shimmer,
  preset,
  dismissible,
  onClose,
  status = "default",
  label,
  pulse = "none",
  count = 0,
  max,
  format,
  animateCount,
  dot,
  dotPulse,
}: KiraBadgeProps) {
  if (mode === "status") {
    return (
      <StatusBadge
        status={status}
        size={size === "sm" || size === "lg" ? size : "default"}
        pulse={pulse}
        label={label}
        className={className}
      />
    );
  }

  if (mode === "count") {
    return (
      <CountBadge
        count={count}
        max={max}
        format={format}
        size={size === "xs" || size === "sm" ? size : "default"}
        variant={
          variant === "destructive" || variant === "secondary"
            ? variant
            : "default"
        }
        icon={icon}
        iconPosition={iconPosition}
        pulse={pulse !== "none"}
        animateCount={animateCount}
        className={className}
      />
    );
  }

  if (mode === "tag") {
    return (
      <TagBadge
        variant={variant as TagBadgeProps["variant"]}
        size={size}
        icon={icon}
        iconPosition={iconPosition}
        removable={dismissible}
        onRemove={onClose}
        className={className}
      >
        {children}
      </TagBadge>
    );
  }

  // "badge" and "dot" both render the base Badge; "dot" just forces a dot.
  return (
    <Badge
      variant={variant}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      trend={trend}
      shimmer={shimmer}
      preset={preset}
      dismissible={dismissible}
      onClose={onClose}
      dot={mode === "dot" ? (dot ?? true) : dot}
      dotPulse={dotPulse}
      className={className}
    >
      {children}
    </Badge>
  );
}

export {
  Badge,
  badgeVariants,
  StatusBadge,
  CountBadge,
  TagBadge,
  BadgeGroup,
  TagInput,
  KiraBadge,
  formatCount,
};
export type {
  BadgeProps,
  StatusBadgeProps,
  CountBadgeProps,
  TagBadgeProps,
  BadgeGroupProps,
  TagInputProps,
  KiraBadgeProps,
};
