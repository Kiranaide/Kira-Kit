"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";

const switchTrackVariants = cva(
  [
    "relative inline-flex shrink-0 items-center rounded-full cursor-pointer transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9 px-0.5",
        default: "h-6 w-11 px-0.5",
        lg: "h-7 w-[52px] px-0.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white shadow-sm",
    "transition-transform duration-150 ease-out",
    "flex items-center justify-center",
    "translate-x-0 data-[unchecked]:translate-x-0",
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
  /** Icon displayed inside thumb when unchecked. */
  thumbIcon?: React.ReactNode;
  /** Icon displayed inside thumb when checked. */
  thumbIconChecked?: React.ReactNode;
  /** Ref to access the hidden input element. */
  inputRef?: React.Ref<HTMLInputElement>;
}

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
  thumbIcon,
  thumbIconChecked,
  disabled,
  readOnly,
  required,
  name,
  value,
  id,
  inputRef,
  ...props
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  // Track internal state for icon rendering
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
    if (error) return "bg-destructive";
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

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
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
        value={value}
        inputRef={inputRef}
        className={({ checked: isChecked }) =>
          cn(switchTrackVariants({ size }), getColorClass(isChecked))
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
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
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
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component to handle thumb icon rendering based on internal state
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

export { Switch, SwitchWithLabel, switchTrackVariants, switchThumbVariants };
export type { SwitchProps, SwitchWithLabelProps };
