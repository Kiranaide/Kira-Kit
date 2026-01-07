"use client";

import * as React from "react";
import { animate } from "animejs";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";
import { IconCheck, IconMinus } from "@tabler/icons-react";

// ============================================
// ANIMATED CHECKBOX (with indeterminate support)
// ============================================
interface CheckboxProps
  extends Omit<CheckboxPrimitive.Root.Props, "checked" | "onCheckedChange"> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  size?: "sm" | "default" | "lg";
  customIcon?: React.ReactNode;
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  size = "default",
  customIcon,
  disabled,
  ...props
}: CheckboxProps) {
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const [internalChecked, setInternalChecked] = React.useState(checked);

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  // Animate on mount if already checked
  React.useEffect(() => {
    if (
      indicatorRef.current &&
      (checked === true || checked === "indeterminate")
    ) {
      indicatorRef.current.style.transform = "scale(1)";
      indicatorRef.current.style.opacity = "1";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (newChecked: boolean | "indeterminate") => {
    if (disabled) return;

    // Improved spring animation
    if (indicatorRef.current) {
      if (newChecked === true || newChecked === "indeterminate") {
        animate(indicatorRef.current, {
          scale: [0, 1.15, 0.95, 1],
          opacity: [0, 1],
          rotate: ["-10deg", "0deg"],
          duration: 300,
          ease: "outElastic(1, 0.5)",
        });
      } else {
        animate(indicatorRef.current, {
          scale: [1, 1.1, 0],
          opacity: [1, 1, 0],
          rotate: ["0deg", "10deg"],
          duration: 200,
          ease: "inQuad",
        });
      }
    }
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  const sizeClasses = {
    sm: "h-4 w-4", // Increased from 3.5 -> 4
    default: "h-5 w-5", // Increased from 4 -> 5
    lg: "h-6 w-6", // Increased from 5 -> 6
  };

  const iconSizes = {
    sm: "h-3 w-3", // Increased icon size slightly
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  const isIndeterminate = internalChecked === "indeterminate";
  const isChecked = internalChecked === true;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={isChecked}
      indeterminate={isIndeterminate}
      disabled={disabled}
      onCheckedChange={handleChange}
      className={cn(
        "peer shrink-0 rounded-sm border border-primary shadow-sm transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[checked]:border-primary",
        "data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground",
        "hover:border-primary/80 data-[checked]:hover:bg-primary/90",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        ref={indicatorRef}
        className="flex items-center justify-center text-current w-full h-full"
        style={{
          transform: isChecked || isIndeterminate ? "scale(1)" : "scale(0)",
          opacity: isChecked || isIndeterminate ? 1 : 0,
        }}
      >
        {customIcon ? (
          customIcon
        ) : isIndeterminate ? (
          <IconMinus className={iconSizes[size]} strokeWidth={3} />
        ) : (
          <IconCheck className={iconSizes[size]} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// ============================================
// CHECKBOX WITH LABEL (for tri-state parent checkbox)
// ============================================
interface CheckboxWithLabelProps extends CheckboxProps {
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
      <Checkbox id={id} {...props} />
      <div className="flex flex-col gap-0.5 pt-0.5">
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

// ============================================
// CHECKBOX GROUP (for grouped selections)
// ============================================
interface CheckboxGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  description?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "default" | "lg";
  className?: string;
  disabled?: boolean;
}

function CheckboxGroup({
  options,
  value = [],
  onChange,
  label,
  description,
  showSelectAll = false,
  selectAllLabel = "Select all",
  orientation = "vertical",
  size = "default",
  className,
  disabled = false,
}: CheckboxGroupProps) {
  const allChecked =
    options.length > 0 && options.every((opt) => value.includes(opt.value));
  const someChecked = options.some((opt) => value.includes(opt.value));
  const isIndeterminate = someChecked && !allChecked;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      onChange?.(options.filter((o) => !o.disabled).map((o) => o.value));
    } else {
      onChange?.([]);
    }
  };

  const handleItemChange = (itemValue: string, checked: boolean) => {
    if (checked) {
      const newValue = [...value, itemValue];
      // Remove duplicates just in case
      onChange?.([...new Set(newValue)]);
    } else {
      onChange?.(value.filter((v) => v !== itemValue));
    }
  };

  return (
    <div
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-3", className)}
    >
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-sm font-medium leading-none">{label}</span>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {showSelectAll && (
        <CheckboxWithLabel
          label={selectAllLabel}
          checked={
            allChecked ? true : isIndeterminate ? "indeterminate" : false
          }
          onCheckedChange={handleSelectAll}
          size={size}
          disabled={disabled}
          className="pb-1 border-b border-border"
        />
      )}
      <div
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((option) => (
          <CheckboxWithLabel
            key={option.value}
            label={option.label}
            description={option.description}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              handleItemChange(option.value, checked === true)
            }
            size={size}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
    </div>
  );
}

export { Checkbox, CheckboxWithLabel, CheckboxGroup };
export type {
  CheckboxProps,
  CheckboxWithLabelProps,
  CheckboxGroupProps,
  CheckboxGroupOption,
};
