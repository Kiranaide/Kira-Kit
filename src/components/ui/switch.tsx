"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";

// ============================================================================
// Switch Track Variants
// ============================================================================

const switchTrackVariants = cva(
  [
    "relative inline-flex shrink-0 items-center rounded-full cursor-pointer",
    // Smooth spring-like transition
    "transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "motion-reduce:transition-none",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // Disabled state
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    // Touch target - ensure minimum 44px on mobile
    "touch-action-manipulation",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9 px-0.5",
        default: "h-6 w-11 px-0.5",
        lg: "h-7 w-[52px] px-0.5",
      },
      // Touch target sizes for mobile accessibility
      touchTarget: {
        true: "min-h-[44px] min-w-[44px] p-2",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      touchTarget: false,
    },
  }
);

// ============================================================================
// Switch Thumb Variants
// ============================================================================

const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white shadow-sm",
    // Spring-like transition for natural feel
    "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "motion-reduce:transition-none",
    "flex items-center justify-center",
    "translate-x-0 data-[unchecked]:translate-x-0",
    // Press effect
    "active:scale-95 data-[pressed]:scale-95",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[checked]:translate-x-4",
        default: "h-5 w-5 data-[checked]:translate-x-5",
        lg: "h-6 w-6 data-[checked]:translate-x-[22px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

interface SwitchProps
  extends Omit<
    SwitchPrimitive.Root.Props,
    "checked" | "onCheckedChange" | "defaultChecked"
  > {
  /** Current checked state. Use for controlled mode. */
  checked?: boolean;
  /** Default checked state. Use for uncontrolled mode. */
  defaultChecked?: boolean;
  /** Callback when the switch state changes. */
  onCheckedChange?: (checked: boolean) => void;
  /** Size variant of the switch. */
  size?: "sm" | "default" | "lg";
  /** Color scheme for the active state. */
  color?: "default" | "success" | "destructive" | "warning";
  /** Label text displayed next to the switch. */
  label?: string;
  /** Description text displayed below the label. */
  description?: string;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Applies error styling. */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Icon displayed inside thumb when unchecked. */
  thumbIcon?: React.ReactNode;
  /** Icon displayed inside thumb when checked. */
  thumbIconChecked?: React.ReactNode;
  /** Ref to access the hidden input element. */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Name attribute for form submission. */
  name?: string;
  /** Value attribute for form submission. */
  value?: string;
  /** Required attribute for form validation. */
  required?: boolean;
  /** Position of label relative to switch */
  labelPosition?: "start" | "end";
  /** Ensure minimum 44px touch target on mobile */
  touchTarget?: boolean;
  /** Custom label for checked state (for screen readers) */
  checkedLabel?: string;
  /** Custom label for unchecked state (for screen readers) */
  uncheckedLabel?: string;
}

// ============================================================================
// Switch Component
// ============================================================================

function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  size = "default",
  color = "default",
  label,
  description,
  loading = false,
  error = false,
  errorMessage,
  thumbIcon,
  thumbIconChecked,
  disabled,
  readOnly,
  required,
  name,
  id,
  inputRef,
  labelPosition = "end",
  touchTarget = false,
  checkedLabel,
  uncheckedLabel,
  ...props
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id || generatedId;
  const descriptionId = `${switchId}-description`;
  const errorId = `${switchId}-error`;

  // Track internal state for icon rendering and announcements
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(
    checked ?? defaultChecked
  );

  // Sync with controlled prop
  React.useEffect(() => {
    if (isControlled && checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked, isControlled]);

  const handleCheckedChange = (newChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  const getColorClass = (isChecked: boolean) => {
    if (!isChecked) return "bg-muted-foreground/30";
    if (error || errorMessage) return "bg-destructive";
    switch (color) {
      case "success":
        return "bg-success";
      case "destructive":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  const iconSizeClass =
    size === "sm"
      ? "h-2.5 w-2.5"
      : size === "default"
      ? "h-3 w-3"
      : "h-3.5 w-3.5";

  // Build aria-describedby
  const ariaDescribedBy = [
    description ? descriptionId : null,
    errorMessage ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  // Screen reader announcement for state
  const stateLabel = internalChecked
    ? checkedLabel || "On"
    : uncheckedLabel || "Off";

  const switchElement = (
    <SwitchPrimitive.Root
      data-slot="switch"
      id={switchId}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled || loading}
      readOnly={readOnly}
      required={required}
      name={name}
      inputRef={inputRef}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error || !!errorMessage || undefined}
      aria-errormessage={errorMessage ? errorId : undefined}
      className={({ checked: isChecked }) =>
        cn(
          switchTrackVariants({ size, touchTarget }),
          getColorClass(isChecked)
        )
      }
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))}>
        {loading ? (
          <IconLoader
            className={cn(
              "animate-spin text-muted-foreground",
              iconSizeClass
            )}
          />
        ) : (
          <ThumbIcon
            checked={internalChecked}
            thumbIcon={thumbIcon}
            thumbIconChecked={thumbIconChecked}
            iconSizeClass={iconSizeClass}
          />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );

  // Screen reader live region for state changes
  const liveRegion = (checkedLabel || uncheckedLabel) && (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {stateLabel}
    </span>
  );

  // If no label, return just the switch
  if (!label && !description && !errorMessage) {
    return (
      <div className={cn("inline-flex items-center", className)}>
        {switchElement}
        {liveRegion}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-start gap-3",
        labelPosition === "start" && "flex-row-reverse",
        className
      )}
    >
      {switchElement}
      <div className="flex flex-col gap-0.5 pt-0.5">
        {label && (
          <label
            htmlFor={switchId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer select-none",
              (disabled || loading || readOnly) &&
                "cursor-not-allowed opacity-70"
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {errorMessage && (
          <p
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </p>
        )}
      </div>
      {liveRegion}
    </div>
  );
}

// ============================================================================
// Thumb Icon Helper
// ============================================================================

function ThumbIcon({
  checked,
  thumbIcon,
  thumbIconChecked,
  iconSizeClass,
}: {
  checked: boolean;
  thumbIcon?: React.ReactNode;
  thumbIconChecked?: React.ReactNode;
  iconSizeClass: string;
}) {
  const wrapperClass =
    "flex items-center justify-center [&_svg]:w-full [&_svg]:h-full";

  if (checked) {
    if (thumbIconChecked) {
      return (
        <span className={cn(wrapperClass, "text-primary", iconSizeClass)}>
          {thumbIconChecked}
        </span>
      );
    }
    if (thumbIcon) {
      return (
        <span className={cn(wrapperClass, "text-primary", iconSizeClass)}>
          {thumbIcon}
        </span>
      );
    }
  } else if (thumbIcon) {
    return (
      <span
        className={cn(wrapperClass, "text-muted-foreground", iconSizeClass)}
      >
        {thumbIcon}
      </span>
    );
  }
  return null;
}

// ============================================================================
// Switch With Label (Convenience Component)
// ============================================================================

interface SwitchWithLabelProps extends SwitchProps {
  /** Label text (required for this component). */
  label: string;
  /** Description text displayed below the label. */
  description?: string;
}

function SwitchWithLabel({
  label,
  description,
  className,
  id,
  ...props
}: SwitchWithLabelProps) {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Switch id={switchId} {...props} />
      <div className="flex flex-col gap-0.5 pt-0.5">
        <label
          htmlFor={switchId}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer select-none",
            (props.disabled || props.loading) && "cursor-not-allowed opacity-70"
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Switch Group (For multiple related switches)
// ============================================================================

interface SwitchGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group label for accessibility */
  label?: string;
  /** Orientation of the group */
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
}

function SwitchGroup({
  label,
  orientation = "vertical",
  className,
  children,
  ...props
}: SwitchGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      data-slot="switch-group"
      className={cn(
        orientation === "vertical" ? "flex flex-col gap-3" : "flex flex-row gap-4 flex-wrap",
        className
      )}
      {...props}
    >
      {label && (
        <span className="text-sm font-medium text-foreground mb-1">{label}</span>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { Switch, SwitchWithLabel, SwitchGroup, switchTrackVariants, switchThumbVariants };
export type { SwitchProps, SwitchWithLabelProps, SwitchGroupProps };
