"use client";

import * as React from "react";
import { animate } from "animejs";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";
import { IconCheck, IconMinus } from "@tabler/icons-react";

// ============================================
// ANIMATED CHECKBOX (with indeterminate support)
// ============================================
interface AnimatedCheckboxProps
  extends Omit<CheckboxPrimitive.Root.Props, "checked" | "onCheckedChange"> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  size?: "sm" | "default" | "lg";
}

function AnimatedCheckbox({
  className,
  checked = false,
  onCheckedChange,
  size = "default",
  ...props
}: AnimatedCheckboxProps) {
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const [internalChecked, setInternalChecked] = React.useState(checked);

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleChange = (newChecked: boolean) => {
    // Animate on check
    if (indicatorRef.current) {
      if (newChecked) {
        animate(indicatorRef.current, {
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          duration: 200,
          ease: "outBack",
        });
      } else {
        animate(indicatorRef.current, {
          scale: [1, 0],
          opacity: [1, 0],
          duration: 150,
          ease: "inQuad",
        });
      }
    }
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    default: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  };

  const isIndeterminate = internalChecked === "indeterminate";
  const isChecked = internalChecked === true;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={isChecked}
      indeterminate={isIndeterminate}
      onCheckedChange={handleChange}
      className={cn(
        "peer shrink-0 rounded-sm border border-primary shadow transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        "data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        ref={indicatorRef}
        className="flex items-center justify-center text-current"
        style={{
          transform: isChecked || isIndeterminate ? "scale(1)" : "scale(0)",
        }}
      >
        {isIndeterminate ? (
          <IconMinus className={iconSizes[size]} strokeWidth={3} />
        ) : (
          <IconCheck className={iconSizes[size]} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// ============================================
// CHECKBOX GROUP (for tri-state parent checkbox)
// ============================================
interface CheckboxWithLabelProps extends AnimatedCheckboxProps {
  label: string;
  description?: string;
}

function CheckboxWithLabel({
  label,
  description,
  className,
  ...props
}: CheckboxWithLabelProps) {
  const id = React.useId();

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <AnimatedCheckbox id={id} {...props} />
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

export { AnimatedCheckbox, CheckboxWithLabel };
export type { AnimatedCheckboxProps, CheckboxWithLabelProps };
