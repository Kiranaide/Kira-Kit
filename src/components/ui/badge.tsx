/* kira-kit-ignore-file spacing-scale: badges are labels, not controls; the compact ladder keeps optical half-steps (contract 3.9) */
/* kira-kit-ignore-file arbitrary-values: xs micro badges keep 10px type (documented sub-12px exception) */
"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { Combobox } from "@base-ui/react/combobox";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { cn } from "cn";
import { Spinner } from "@/components/ui/spinner";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const badgeVariants = cva(
  "gap-1.5 rounded-full border border-transparent font-medium transition-[color,background-color,border-color,box-shadow,opacity,scale] duration-150 inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden group/badge",
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
        true: "relative overflow-hidden before:absolute before:inset-0 before:animate-badge-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:content-['']",
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
    compoundVariants: [
      {
        variant: [
          "ghost",
          "outline",
          "link",
          "primary-soft",
          "secondary-soft",
          "destructive-soft",
          "success-soft",
          "warning-soft",
          "info-soft",
        ],
        shimmer: true,
        class: "before:via-foreground/15",
      },
    ],
  },
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

// §9 target size (WCAG 2.5.8): the visual glyph stays small per badge size,
// but the hit box is padded to ≥ 24×24 and pulled back with negative margin
// so the visible footprint doesn't grow.
const badgeCloseVariants = cva(
  "relative rounded-full p-0.5 opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[2px] after:absolute after:-inset-y-1.5 after:-inset-x-1.5 after:content-['']",
  {
    variants: {
      size: {
        xs: "h-3 w-3 [&>svg]:size-2",
        sm: "h-3.5 w-3.5 [&>svg]:size-2.5",
        default: "h-4 w-4 [&>svg]:size-3",
        lg: "h-4 w-4 [&>svg]:size-3",
        xl: "h-5 w-5 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
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

  /**
   * Toggle/chip state for interactive badges. Renders `aria-pressed` and
   * emits `data-pressed` for styling; only meaningful together with
   * `onClick` (or a `render` prop that renders a real button).
   */
  pressed?: boolean;
}

function useBadgeModel({
  className,
  variant: variantInput,
  size: sizeInput,
  icon,
  iconPosition: iconPositionInput,
  dot: dotInput,
  dotPulse: dotPulseInput,
  dismissible: dismissibleInput,
  onClose,
  loading: loadingInput,
  disabled: disabledInput,
  closeLabel: closeLabelInput,
  shimmer: shimmerInput,
  trend,
  preset,
  pressed,
  render,
  children,
  ...props
}: BadgeProps) {
  const { variant, size, iconPosition, dot, dotPulse, dismissible } =
    useBadgeOptions({
      variant: variantInput,
      size: sizeInput,
      iconPosition: iconPositionInput,
      dot: dotInput,
      dotPulse: dotPulseInput,
      dismissible: dismissibleInput,
    });

  const { loading, disabled, closeLabel, shimmer } = useBadgeOptions2({
    loading: loadingInput,
    disabled: disabledInput,
    closeLabel: closeLabelInput,
    shimmer: shimmerInput,
  });

  const [isVisible, setIsVisible] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);
  const reducedMotion = useReducedMotion();

  // Preset shorthands: resolve variant + default content when not overridden.
  const presetVariant: NonNullable<BadgeProps["variant"]> | undefined =
    badgeResolvePresetVariant1(preset);

  const resolvedVariant = presetVariant ?? variant;

  const resolvedChildren = children ?? badgeResolveResolvedChildren2(preset);

  const handleClose = React.useCallback(
    () =>
      badgeUseCallback(
        loading,
        disabled,
        setIsClosing,
        setIsVisible,
        onClose,
        reducedMotion,
      ),
    [loading, disabled, onClose, reducedMotion],
  );

  return {
    className,
    size,
    iconPosition,
    dot,
    dotPulse,
    dismissible,
    loading,
    disabled,
    closeLabel,
    shimmer,
    trend,
    pressed,
    render,
    props,
    isVisible,
    isClosing,
    reducedMotion,
    resolvedVariant,
    resolvedChildren,
    handleClose,
    icon,
  };
}

function Badge(input: BadgeProps) {
  const model = useBadgeModel(input);

  const {
    className,
    size,
    iconPosition,
    dot,
    loading,
    disabled,
    shimmer,
    pressed,
    render,
    props,
    isVisible,
    isClosing,
    reducedMotion,
    resolvedVariant,
  } = model;

  const dotColor = dot === true || dot === false ? "default" : dot;
  const hasDot = dot !== false;

  const badgeContent = (
    <BadgeMainContentView {...model} hasDot={hasDot} dotColor={dotColor} />
  );

  const { defaultTagName, ariaPressed, isInteractive, isNativeRendered } =
    badgeInteraction({
      visible: isVisible,
      disabled,
      onClick: props.onClick,
      render,
      pressed,
    });

  return useRender({
    defaultTagName,
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({
            variant: resolvedVariant,
            size,
            clickable: Boolean(props.onClick),
            disabled,
            shimmer: shimmer && !reducedMotion,
          }),
          { "flex-row-reverse": iconPosition === "right" },
          {
            "opacity-0 scale-95 transition-[opacity,scale] duration-150":
              isClosing,
          },
          { hidden: !isVisible },
          className,
        ),
        "aria-disabled": disabled || undefined,
        "aria-busy": loading || undefined,
        ...(isInteractive && isNativeRendered && { type: "button" as const }),
        "aria-pressed": ariaPressed,
        children: badgeContent,
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant: resolvedVariant,
      size,
      pressed: isInteractive && pressed === true,
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
      data-slot="status-badge"
      {...props}
    >
      {children ?? displayLabel}
    </Badge>
  );
}

type CountFormat = "default" | "short" | "commas";

function formatCount(count: number, format: CountFormat, max: number): string {
  if (format === "short") {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
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
  max: maxInput,
  format: formatInput,
  size: sizeInput,
  variant: variantInput,
  icon,
  iconPosition: iconPositionInput,
  pulse: pulseInput,
  animateCount: animateCountInput,
  className,
  ...props
}: CountBadgeProps) {
  const { max, format, size, variant, iconPosition, pulse } =
    useCountBadgeOptions({
      max: maxInput,
      format: formatInput,
      size: sizeInput,
      variant: variantInput,
      iconPosition: iconPositionInput,
      pulse: pulseInput,
    });

  const { animateCount } = useCountBadgeOptions2({
    animateCount: animateCountInput,
  });

  const reducedMotion = useReducedMotion();
  const showPulse = pulse && count > 0 && !reducedMotion;
  const displayCount = formatCount(count, format, max);

  // Number ticker: tween a displayed integer toward `count` on change.
  const numberRef = React.useRef<HTMLSpanElement>(null);
  const prevCount = React.useRef(count);
  useGSAP(() => {
    const el = numberRef.current;

    // Always advance the tween origin — even when this run early-returns
    // (non-default format / unmounted) — so switching back to "default"
    // animates from the current value instead of a stale one.
    const from = prevCount.current;
    prevCount.current = count;

    if (!el || !animateCount || format !== "default") return;

    if (reducedMotion || from === count) {
      el.textContent = displayCount;

      return;
    }

    const obj = { val: from };
    gsap.to(obj, {
      val: count,
      // §3.5: spring motion < 400ms.
      duration: 0.35,
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
        { "min-w-4": size === "xs" },
        { "min-w-5": size === "sm" },
        { "min-w-6": size === "default" },
        { "flex-row-reverse": iconPosition === "right" },
        { "animate-badge-pulse": showPulse },
        className,
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
  variant: variantInput,
  size: sizeInput,
  icon,
  iconPosition: iconPositionInput,
  removable: removableInput,
  onRemove,
  children,
  className,
  ...props
}: TagBadgeProps) {
  const { variant, size, iconPosition, removable } = useTagBadgeOptions({
    variant: variantInput,
    size: sizeInput,
    iconPosition: iconPositionInput,
    removable: removableInput,
  });

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
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TagInputProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "value"
> {
  /** Current tags (controlled). */
  value?: string[];
  /** Initial tags (uncontrolled). */
  defaultValue?: string[];
  /** Fired whenever the tag list changes (add or remove). */
  onValueChange?: (tags: string[]) => void;
  /** Suggested tags shown in the popup; the typed text is appended dynamically. */
  suggestions?: string[];
  placeholder?: string;
  /** Maximum number of tags; further input is ignored. */
  maxTags?: number;
  disabled?: boolean;
  size?: BadgeProps["size"];
  className?: string;
  ariaLabel?: string;
}

function TagInput(arg0: TagInputProps) {
  const model = useTagInputModel(arg0);

  return <TagInputView {...model} />;
}

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
  status?: StatusBadgeProps["status"];
  label?: string;
  pulse?: "none" | "continuous" | "once";
  count?: number;
  max?: number;
  format?: CountFormat;
  animateCount?: boolean;
  dot?: BadgeProps["dot"];
  dotPulse?: BadgeProps["dotPulse"];
}

function KiraBadge(input: KiraBadgeProps) {
  const {
    mode: modeInput,
    variant,
    size,
    className,
    children,
    icon,
    iconPosition,
    dismissible,
    onClose,
    status: statusInput,
    label,
    pulse: pulseInput,
    count: countInput,
    max,
    format,
    animateCount,
  } = input;

  const { mode, status, pulse, count } = useKiraBadgeOptions({
    mode: modeInput,
    status: statusInput,
    pulse: pulseInput,
    count: countInput,
  });

  if (mode === "status") {
    return (
      <KiraStatusBadge
        status={status}
        size={size}
        pulse={pulse}
        label={label}
        className={className}
      />
    );
  }

  if (mode === "count") {
    return (
      <KiraBadgeCountMode
        count={count}
        max={max}
        format={format}
        size={size}
        variant={variant}
        icon={icon}
        iconPosition={iconPosition}
        pulse={pulse}
        animateCount={animateCount}
        className={className}
      />
    );
  }

  if (mode === "tag") {
    return (
      <TagBadge
        // SAFETY: TagBadge's variant union is a subset of BadgeProps' union;
        // out-of-subset values were already gated by the mode switch above.
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

  return <KiraBadgeBaseMode {...input} mode={mode} />;
}

function KiraStatusBadge({
  size,
  ...props
}: Omit<StatusBadgeProps, "size"> & { size: BadgeProps["size"] }) {
  return (
    <StatusBadge
      {...props}
      size={size === "sm" || size === "lg" ? size : "default"}
    />
  );
}

function KiraCountBadge({
  size,
  variant,
  ...props
}: Omit<CountBadgeProps, "size" | "variant"> &
  Pick<BadgeProps, "size" | "variant">) {
  return (
    <CountBadge
      {...props}
      size={size === "xs" || size === "sm" ? size : "default"}
      variant={
        variant === "destructive" || variant === "secondary"
          ? variant
          : "default"
      }
    />
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

function keyedTags(tags: readonly string[]) {
  const occurrences = new Map<string, number>();

  return tags.map((tag) => {
    const occurrence = occurrences.get(tag) ?? 0;
    occurrences.set(tag, occurrence + 1);

    return { tag, key: JSON.stringify([tag, occurrence]) };
  });
}

function resolveBadgeOptions({
  variant = "default",
  size = "default",
  iconPosition = "left",
  dot = false,
  dotPulse = "none",
  dismissible = false,
}: {
  variant?: BadgeProps["variant"];
  size?: BadgeProps["size"];
  iconPosition?: BadgeProps["iconPosition"];
  dot?: BadgeProps["dot"];
  dotPulse?: BadgeProps["dotPulse"];
  dismissible?: BadgeProps["dismissible"];
}) {
  return { variant, size, iconPosition, dot, dotPulse, dismissible };
}

function resolveBadgeOptions2({
  loading = false,
  disabled = false,
  closeLabel = "Remove",
  shimmer = false,
}: {
  loading?: BadgeProps["loading"];
  disabled?: BadgeProps["disabled"];
  closeLabel?: BadgeProps["closeLabel"];
  shimmer?: BadgeProps["shimmer"];
}) {
  return { loading, disabled, closeLabel, shimmer };
}

function resolveCountBadgeOptions({
  max = 99,
  format = "default",
  size = "default",
  variant = "default",
  iconPosition = "left",
  pulse = false,
}: {
  max?: CountBadgeProps["max"];
  format?: CountBadgeProps["format"];
  size?: CountBadgeProps["size"];
  variant?: CountBadgeProps["variant"];
  iconPosition?: CountBadgeProps["iconPosition"];
  pulse?: CountBadgeProps["pulse"];
}) {
  return { max, format, size, variant, iconPosition, pulse };
}

function resolveCountBadgeOptions2({
  animateCount = false,
}: {
  animateCount?: CountBadgeProps["animateCount"];
}) {
  return { animateCount };
}

function resolveTagBadgeOptions({
  variant = "default",
  size = "sm",
  iconPosition = "left",
  removable = false,
}: {
  variant?: TagBadgeProps["variant"];
  size?: TagBadgeProps["size"];
  iconPosition?: TagBadgeProps["iconPosition"];
  removable?: TagBadgeProps["removable"];
}) {
  return { variant, size, iconPosition, removable };
}

function resolveTagInputOptions({
  suggestions = [],
  placeholder = "Add tag…",
  disabled = false,
  size = "sm",
  ariaLabel = "Tags",
}: {
  suggestions?: TagInputProps["suggestions"];
  placeholder?: TagInputProps["placeholder"];
  disabled?: TagInputProps["disabled"];
  size?: TagInputProps["size"];
  ariaLabel?: TagInputProps["ariaLabel"];
}) {
  return { suggestions, placeholder, disabled, size, ariaLabel };
}

function resolveKiraBadgeOptions({
  mode = "badge",
  status = "default",
  pulse = "none",
  count = 0,
}: {
  mode?: KiraBadgeProps["mode"];
  status?: KiraBadgeProps["status"];
  pulse?: KiraBadgeProps["pulse"];
  count?: KiraBadgeProps["count"];
}) {
  return { mode, status, pulse, count };
}

function BadgeContentView({
  value,
  size,
  placeholder,
}: {
  value: string[];
  size: "default" | "sm" | "lg" | "xs" | "xl" | null;
  placeholder: string;
}) {
  return (
    <Combobox.Chips className="contents">
      {keyedTags(value).map(({ tag, key }) => (
        <Combobox.Chip
          key={key}
          className={cn(
            badgeVariants({ variant: "secondary", size }),
            "rounded-md normal-case",
          )}
        >
          {tag}
          <Combobox.ChipRemove
            className="flex items-center justify-center rounded-sm text-current opacity-70 hover:opacity-100"
            aria-label={`Remove ${tag}`}
          >
            <IconX className="h-3 w-3" />
          </Combobox.ChipRemove>
        </Combobox.Chip>
      ))}
      <Combobox.Input
        placeholder={value.length === 0 ? placeholder : ""}
        className="h-6 min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </Combobox.Chips>
  );
}

function useTagInputModel({
  value: valueProp,
  defaultValue,
  onValueChange,
  suggestions: suggestionsInput,
  placeholder: placeholderInput,
  maxTags,
  disabled: disabledInput,
  size: sizeInput,
  className,
  ariaLabel: ariaLabelInput,
  ...props
}: TagInputProps) {
  const { suggestions, placeholder, disabled, size, ariaLabel } =
    useTagInputOptions({
      suggestions: suggestionsInput,
      placeholder: placeholderInput,
      disabled: disabledInput,
      size: sizeInput,
      ariaLabel: ariaLabelInput,
    });

  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internal;
  const [inputValue, setInputValue] = React.useState("");

  const commit = (next: string[]) =>
    badgeCommit(next, maxTags, setInternal, onValueChange);

  // Filter suggestions against the typed query and append the raw typed
  // text as a creatable item so Enter can commit arbitrary tags.
  const items = React.useMemo(
    () => badgeUseMemo(inputValue, suggestions),
    [inputValue, suggestions],
  );

  return {
    items,
    value,
    commit,
    inputValue,
    setInputValue,
    disabled,
    ariaLabel,
    className,
    props,
    size,
    placeholder,
  };
}

function TagInputView({
  items,
  value,
  commit,
  inputValue,
  setInputValue,
  disabled,
  ariaLabel,
  className,
  props,
  size,
  placeholder,
}: ReturnType<typeof useTagInputModel>) {
  return (
    <Combobox.Root
      multiple
      items={items}
      value={value}
      onValueChange={(next) => commit([...next])}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      disabled={disabled}
      autoHighlight
    >
      <div
        data-slot="tag-input"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background p-2 text-sm focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-colors",
          { "pointer-events-none opacity-50": disabled },
          className,
        )}
        {...props}
      >
        <BadgeContentView value={value} size={size} placeholder={placeholder} />
      </div>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup className="z-50 min-w-(--anchor-width) rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md">
            <Combobox.List>
              <Combobox.Empty className="px-2 py-1.5 text-sm text-muted-foreground">
                No matching tags
              </Combobox.Empty>
              {items.map((tag) => (
                <Combobox.Item
                  key={tag}
                  value={tag}
                  className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm outline-none data-highlighted:bg-muted data-highlighted:text-foreground"
                >
                  {tag}
                </Combobox.Item>
              ))}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
      <Combobox.Status className="sr-only" />
    </Combobox.Root>
  );
}

function useBadgeOptions({
  variant: variantInput,
  size: sizeInput,
  iconPosition: iconPositionInput,
  dot: dotInput,
  dotPulse: dotPulseInput,
  dismissible: dismissibleInput,
}: Parameters<typeof resolveBadgeOptions>[0]) {
  return React.useMemo(
    () =>
      resolveBadgeOptions({
        variant: variantInput,
        size: sizeInput,
        iconPosition: iconPositionInput,
        dot: dotInput,
        dotPulse: dotPulseInput,
        dismissible: dismissibleInput,
      }),
    [
      variantInput,
      sizeInput,
      iconPositionInput,
      dotInput,
      dotPulseInput,
      dismissibleInput,
    ],
  );
}

function useBadgeOptions2({
  loading: loadingInput,
  disabled: disabledInput,
  closeLabel: closeLabelInput,
  shimmer: shimmerInput,
}: Parameters<typeof resolveBadgeOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveBadgeOptions2({
        loading: loadingInput,
        disabled: disabledInput,
        closeLabel: closeLabelInput,
        shimmer: shimmerInput,
      }),
    [loadingInput, disabledInput, closeLabelInput, shimmerInput],
  );
}

function useCountBadgeOptions({
  max: maxInput,
  format: formatInput,
  size: sizeInput,
  variant: variantInput,
  iconPosition: iconPositionInput,
  pulse: pulseInput,
}: Parameters<typeof resolveCountBadgeOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCountBadgeOptions({
        max: maxInput,
        format: formatInput,
        size: sizeInput,
        variant: variantInput,
        iconPosition: iconPositionInput,
        pulse: pulseInput,
      }),
    [
      maxInput,
      formatInput,
      sizeInput,
      variantInput,
      iconPositionInput,
      pulseInput,
    ],
  );
}

function useCountBadgeOptions2({
  animateCount: animateCountInput,
}: Parameters<typeof resolveCountBadgeOptions2>[0]) {
  return React.useMemo(
    () => resolveCountBadgeOptions2({ animateCount: animateCountInput }),
    [animateCountInput],
  );
}

function useTagBadgeOptions({
  variant: variantInput,
  size: sizeInput,
  iconPosition: iconPositionInput,
  removable: removableInput,
}: Parameters<typeof resolveTagBadgeOptions>[0]) {
  return React.useMemo(
    () =>
      resolveTagBadgeOptions({
        variant: variantInput,
        size: sizeInput,
        iconPosition: iconPositionInput,
        removable: removableInput,
      }),
    [variantInput, sizeInput, iconPositionInput, removableInput],
  );
}

function useKiraBadgeOptions({
  mode: modeInput,
  status: statusInput,
  pulse: pulseInput,
  count: countInput,
}: Parameters<typeof resolveKiraBadgeOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraBadgeOptions({
        mode: modeInput,
        status: statusInput,
        pulse: pulseInput,
        count: countInput,
      }),
    [modeInput, statusInput, pulseInput, countInput],
  );
}

function useTagInputOptions({
  suggestions: suggestionsInput,
  placeholder: placeholderInput,
  disabled: disabledInput,
  size: sizeInput,
  ariaLabel: ariaLabelInput,
}: Parameters<typeof resolveTagInputOptions>[0]) {
  return React.useMemo(
    () =>
      resolveTagInputOptions({
        suggestions: suggestionsInput,
        placeholder: placeholderInput,
        disabled: disabledInput,
        size: sizeInput,
        ariaLabel: ariaLabelInput,
      }),
    [
      suggestionsInput,
      placeholderInput,
      disabledInput,
      sizeInput,
      ariaLabelInput,
    ],
  );
}

function badgeResolvePresetVariant1(
  preset: "beta" | "new" | "version" | undefined,
) {
  if (preset === "beta") {
    return "warning-soft" as const;
  }

  if (preset === "new") {
    return "success-soft" as const;
  }

  if (preset === "version") {
    return "secondary" as const;
  }

  return undefined;
}

function badgeResolveResolvedChildren2(
  preset: "beta" | "new" | "version" | undefined,
) {
  if (preset === "beta") {
    return "Beta" as const;
  }

  if (preset === "new") {
    return "New" as const;
  }

  return undefined;
}

function badgeUseCallback(
  loading: boolean,
  disabled: boolean,
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: (() => void) | undefined,
  reducedMotion: boolean,
) {
  if (loading || disabled) return;
  setIsClosing(true);
  setTimeout(
    () => {
      setIsVisible(false);
      onClose?.();
    },
    reducedMotion ? 0 : 150,
  );
}

function badgeCommit(
  next: string[],
  maxTags: number | undefined,
  setInternal: React.Dispatch<React.SetStateAction<string[]>>,
  onValueChange: ((tags: string[]) => void) | undefined,
) {
  // Split any comma-separated input that slipped into a committed value,
  // then dedupe case-insensitively on trimmed text.
  const split = next.flatMap((t) => t.split(",").map((s) => s.trim()));
  const seen = new Set<string>();

  const deduped = split.filter((t) => {
    if (!t) return false;
    const key = t.toLowerCase();

    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });

  const capped = maxTags === undefined ? deduped : deduped.slice(0, maxTags);
  setInternal(capped);
  onValueChange?.(capped);
}

function badgeUseMemo(inputValue: string, suggestions: string[]) {
  const query = inputValue.trim().toLowerCase();
  const typed = inputValue.trim();

  const matching = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query))
    : suggestions;

  const all = [
    ...matching,
    ...(typed && !matching.some((s) => s.toLowerCase() === typed)
      ? [typed]
      : []),
  ];

  const seen = new Set<string>();

  return all.filter((t) => {
    const key = t.toLowerCase();

    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });
}

type BadgeMainContentViewProps = {
  hasDot: boolean;
  dotColor:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline"
    | "muted";
  size: "default" | "xs" | "sm" | "lg" | "xl" | null;
  reducedMotion: boolean;
  dotPulse: "none" | "continuous" | "once";
  trend: BadgeProps["trend"];
  loading: boolean;
  icon: BadgeProps["icon"];
  dismissible: boolean;
  resolvedChildren: React.ReactNode;
  handleClose: () => void;
  disabled: boolean;
  closeLabel: string;
};

// oxlint-disable-next-line eslint/complexity -- The pure badge content renderer keeps its optional dot, trend, loading icon and dismiss affordance in one inline sequence.
function BadgeMainContentView({
  hasDot,
  dotColor,
  size,
  reducedMotion,
  dotPulse,
  trend,
  loading,
  icon,
  dismissible,
  resolvedChildren,
  handleClose,
  disabled,
  closeLabel,
}: BadgeMainContentViewProps) {
  return (
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
            }),
          )}
        />
      )}
      {trend && (
        <span className="shrink-0 flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">
          {trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
        </span>
      )}
      {(loading || icon) && (
        <span className="shrink-0 flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">
          {loading ? (
            <Spinner className="h-[1em] w-[1em] text-current" />
          ) : (
            icon
          )}
        </span>
      )}
      <span className={cn({ "pr-1": dismissible && !loading })}>
        {resolvedChildren}
      </span>
      {dismissible && !loading && (
        <button
          type="button"
          onClick={handleClose}
          disabled={disabled}
          className={cn(
            badgeCloseVariants({ size }),
            "focus-visible:ring-offset-1",
          )}
          aria-label={closeLabel}
        >
          <IconX />
        </button>
      )}
    </>
  );
}

function badgeInteraction({
  visible,
  disabled,
  onClick,
  render,
  pressed,
}: Pick<BadgeProps, "disabled" | "onClick" | "render" | "pressed"> & {
  visible: boolean;
}) {
  const isInteractive = Boolean(onClick) && !disabled;
  const isNativeRendered = render == null;
  let defaultTagName: "button" | "span" | "div" = "span";

  if (!visible) defaultTagName = "div";
  else if (isInteractive && isNativeRendered) defaultTagName = "button";

  return {
    defaultTagName,
    isInteractive,
    isNativeRendered,
    ariaPressed: isInteractive ? pressed : undefined,
  };
}

function KiraBadgeCountMode({
  count,
  pulse,
  ...props
}: Pick<
  KiraBadgeProps,
  | "max"
  | "format"
  | "size"
  | "variant"
  | "icon"
  | "iconPosition"
  | "animateCount"
  | "className"
> & { count: number; pulse: NonNullable<KiraBadgeProps["pulse"]> }) {
  return <KiraCountBadge {...props} count={count} pulse={pulse !== "none"} />;
}

function KiraBadgeBaseMode({
  mode,
  variant,
  size,
  icon,
  iconPosition,
  trend,
  shimmer,
  preset,
  dismissible,
  onClose,
  dot,
  dotPulse,
  className,
  children,
}: KiraBadgeProps & { mode: NonNullable<KiraBadgeProps["mode"]> }) {
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
