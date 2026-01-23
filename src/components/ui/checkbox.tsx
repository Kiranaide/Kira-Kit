"use client";

import * as React from "react";
import { animate } from "animejs";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconCheck, IconMinus, IconLoader } from "@tabler/icons-react";

const checkboxVariants = cva(
  "peer shrink-0 border shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-transparent data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[checked]:border-primary hover:border-primary/80 data-[checked]:hover:bg-primary/90",
        outline:
          "border-2 border-input bg-transparent data-[checked]:bg-primary/10 data-[checked]:border-primary data-[checked]:text-primary hover:bg-muted/50 data-[checked]:hover:bg-primary/15",
        filled:
          "border-transparent bg-muted data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[checked]:border-primary hover:bg-muted/80 data-[checked]:hover:bg-primary/90",
        soft: "border-transparent bg-primary/20 data-[checked]:bg-primary data-[checked]:text-primary-foreground hover:bg-primary/30 data-[checked]:hover:bg-primary",
      },
      color: {
        default: "",
        success:
          "data-[checked]:bg-success data-[checked]:text-success-foreground data-[checked]:border-success",
        destructive:
          "data-[checked]:bg-destructive data-[checked]:text-destructive-foreground data-[checked]:border-destructive",
        warning:
          "data-[checked]:bg-warning data-[checked]:text-warning-foreground data-[checked]:border-warning",
      },
      size: {
        sm: "h-4 w-4 rounded-sm",
        default: "h-5 w-5 rounded-sm",
        lg: "h-6 w-6 rounded-md",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "default",
        className: "hover:border-primary/80 data-[checked]:hover:bg-primary/90",
      },
      {
        variant: "outline",
        color: "default",
        className:
          "data-[checked]:bg-primary/10 data-[checked]:hover:bg-primary/15",
      },
      {
        variant: "filled",
        color: "default",
        className: "data-[checked]:hover:bg-primary/90",
      },
      {
        variant: "soft",
        color: "default",
        className: "data-[checked]:hover:bg-primary",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  }
);

const checkboxIndicatorVariants = cva(
  "flex items-center justify-center text-current w-full h-full transition-all duration-150",
  {
    variants: {
      size: {
        sm: "[&_svg]:h-3 [&_svg]:w-3",
        default: "[&_svg]:h-3.5 [&_svg]:w-3.5",
        lg: "[&_svg]:h-4 [&_svg]:w-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface CheckboxProps
  extends Omit<
    CheckboxPrimitive.Root.Props,
    "checked" | "onCheckedChange" | "defaultChecked"
  > {

  checked?: boolean | "indeterminate";

  defaultChecked?: boolean;

  onCheckedChange?: (checked: boolean | "indeterminate") => void;

  size?: "sm" | "default" | "lg";

  variant?: "default" | "outline" | "filled" | "soft";

  color?: "default" | "success" | "destructive" | "warning";

  customIcon?: React.ReactNode;

  loading?: boolean;

  error?: boolean;

  inputRef?: React.Ref<HTMLInputElement>;
}

function Checkbox({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  size = "default",
  variant = "default",
  color = "default",
  customIcon,
  loading = false,
  error = false,
  disabled,
  readOnly,
  name,
  value,
  required,
  id,
  inputRef,
  ...props
}: CheckboxProps) {

  const isControlled = checked !== undefined;
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const rippleRef = React.useRef<HTMLSpanElement>(null);
  const [internalChecked, setInternalChecked] = React.useState<
    boolean | "indeterminate"
  >(checked ?? defaultChecked);


  React.useEffect(() => {
    if (isControlled && checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked, isControlled]);


  React.useEffect(() => {
    if (indicatorRef.current) {
      const isActive =
        internalChecked === true || internalChecked === "indeterminate";
      indicatorRef.current.style.transform = isActive ? "scale(1)" : "scale(0)";
      indicatorRef.current.style.opacity = isActive ? "1" : "0";
    }
  }, []);

  const handleChange = (newChecked: boolean | "indeterminate") => {
    if (disabled || readOnly || loading) return;

    if (indicatorRef.current) {
      if (newChecked === true || newChecked === "indeterminate") {
        animate(indicatorRef.current, {
          scale: [0, 1.1, 0.95, 1],
          opacity: [0, 1],
          rotate: ["-10deg", "0deg"],
          duration: 200,
          easing: "outElastic(1, 0.5)",
        });
      } else {
        animate(indicatorRef.current, {
          scale: [1, 0.9, 0],
          opacity: [1, 0],
          rotate: ["0deg", "10deg"],
          duration: 150,
          ease: "easeOutQuad",
        });
      }
    }

    if (rippleRef.current) {
      animate(rippleRef.current, {
        scale: [0.5, 1.5],
        opacity: [0.3, 0],
        duration: 300,
        easing: "easeOutQuad",
      });
    }

    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  const isIndeterminate = internalChecked === "indeterminate";
  const isChecked = internalChecked === true;

  return (
    <div className="relative inline-flex items-center">
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        indeterminate={isIndeterminate}
        disabled={disabled || loading}
        readOnly={readOnly}
        required={required}
        inputRef={inputRef}
        onCheckedChange={handleChange}
        className={cn(
          checkboxVariants({ variant, color, size }),
          "relative overflow-hidden",
          "data-[invalid]:border-destructive data-[invalid]:data-[checked]:bg-destructive",
          "data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
          error && "border-destructive data-[checked]:bg-destructive",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          ref={indicatorRef}
          className={cn(checkboxIndicatorVariants({ size }))}
          style={{
            transform: isChecked || isIndeterminate ? "scale(1)" : "scale(0)",
            opacity: isChecked || isIndeterminate ? 1 : 0,
          }}
          keepMounted
        >
          {loading ? (
            <IconLoader
              className={cn(
                "animate-spin",
                size === "sm" && "h-3 w-3",
                size === "default" && "h-3.5 w-3.5",
                size === "lg" && "h-4 w-4"
              )}
              strokeWidth={3}
            />
          ) : customIcon ? (
            customIcon
          ) : isIndeterminate ? (
            <IconMinus strokeWidth={3} />
          ) : (
            <IconCheck strokeWidth={3} />
          )}
        </CheckboxPrimitive.Indicator>
        <span
          ref={rippleRef}
          className="absolute inset-0 rounded-sm bg-primary/30 scale-0 opacity-0 pointer-events-none"
        />
      </CheckboxPrimitive.Root>
    </div>
  );
}

interface CheckboxWithLabelProps extends CheckboxProps {
  label: string;
  description?: string;
  labelPlacement?: "right" | "left";
}

function CheckboxWithLabel({
  label,
  description,
  labelPlacement = "right",
  className,
  id,
  ...props
}: CheckboxWithLabelProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  const content = (
    <>
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={checkboxId}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer",
            (props.disabled || props.readOnly) &&
              "cursor-not-allowed opacity-70"
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </>
  );

  return (
    <div className={cn("flex items-start gap-3", className)}>
      {labelPlacement === "left" && content}
      <Checkbox id={checkboxId} {...props} />
      {labelPlacement === "right" && content}
    </div>
  );
}

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
  allValues?: string[];
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled" | "soft";
  color?: "default" | "success" | "destructive" | "warning";
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

function CheckboxGroup({
  options,
  value = [],
  onChange,
  label,
  description,
  showSelectAll = false,
  selectAllLabel = "Select all",
  allValues,
  orientation = "vertical",
  size = "default",
  variant = "default",
  color = "default",
  className,
  disabled = false,
  error = false,
}: CheckboxGroupProps) {
  const allChecked =
    allValues && allValues.length > 0
      ? allValues.every((v) => value.includes(v))
      : options.length > 0 && options.every((opt) => value.includes(opt.value));
  const someChecked = options.some((opt) => value.includes(opt.value));
  const isIndeterminate = someChecked && !allChecked;

  const effectiveAllValues = allValues || options.map((o) => o.value);

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      onChange?.(
        effectiveAllValues.filter(
          (v) => !options.find((o) => o.value === v)?.disabled
        )
      );
    } else {
      onChange?.([]);
    }
  };

  const handleItemChange = (itemValue: string, checked: boolean) => {
    if (checked) {
      const newValue = [...value, itemValue];
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
          variant={variant}
          color={color}
          disabled={disabled}
          error={error}
          className="pb-2 border-b border-border"
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
            variant={variant}
            color={color}
            disabled={disabled || option.disabled}
            error={error}
          />
        ))}
      </div>
    </div>
  );
}

interface CheckboxCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled" | "soft";
  color?: "default" | "success" | "destructive" | "warning";
  showIndicator?: boolean;
  error?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function CheckboxCard({
  label,
  description,
  icon,
  size = "default",
  variant = "outline",
  color = "default",
  showIndicator = true,
  error = false,
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxCardProps) {
  const [internalChecked, setInternalChecked] = React.useState(checked);

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;
    const newChecked = !internalChecked;
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  const sizeClasses: Record<
    string,
    { indicator: string; icon: string; padding: string }
  > = {
    sm: { indicator: "h-4 w-4", icon: "h-3 w-3", padding: "p-3" },
    default: { indicator: "h-5 w-5", icon: "h-3.5 w-3.5", padding: "p-4" },
    lg: { indicator: "h-6 w-6", icon: "h-4 w-4", padding: "p-5" },
  };

  const currentSize = sizeClasses[size];

  const getVariantClasses = () => {
    if (variant === "outline") {
      return internalChecked
        ? "bg-primary/10 border-primary text-primary"
        : "border-2 border-input bg-transparent";
    }
    if (variant === "filled") {
      return internalChecked
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-muted border-transparent";
    }
    if (variant === "soft") {
      return internalChecked
        ? "bg-primary text-primary-foreground"
        : "bg-primary/20 border-transparent";
    }
    return internalChecked
      ? "bg-primary text-primary-foreground border-primary"
      : "border-primary bg-transparent";
  };

  const getColorClasses = () => {
    if (!internalChecked) return "";
    if (color === "success")
      return "bg-success border-success text-success-foreground";
    if (color === "destructive")
      return "bg-destructive border-destructive text-destructive-foreground";
    if (color === "warning")
      return "bg-warning border-warning text-warning-foreground";
    return "";
  };

  return (
    <div
      data-slot="checkbox-card"
      data-disabled={disabled || undefined}
      data-checked={internalChecked || undefined}
      data-error={error || undefined}
      onClick={handleClick}
      role="checkbox"
      aria-checked={internalChecked}
      aria-disabled={disabled}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "relative flex flex-col gap-2 rounded-lg border-2 bg-transparent cursor-pointer transition-all",
        "hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent",
        currentSize.padding,
        error && "border-destructive",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIndicator && (
          <div className="shrink-0 mt-0.5">
            <div
              className={cn(
                "flex items-center justify-center rounded-sm transition-all",
                currentSize.indicator,
                getVariantClasses(),
                getColorClasses()
              )}
            >
              {internalChecked && (
                <IconCheck className={currentSize.icon} strokeWidth={3} />
              )}
            </div>
          </div>
        )}
        {icon && (
          <div
            className={cn(
              "shrink-0 text-muted-foreground transition-colors",
              internalChecked &&
                (color === "destructive" ? "text-destructive" : "text-primary")
            )}
            data-slot="checkbox-card-icon"
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "text-sm font-medium cursor-pointer select-none",
              disabled && "cursor-not-allowed"
            )}
          >
            {label}
          </span>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
  CheckboxCard,
  checkboxVariants,
};
export type {
  CheckboxProps,
  CheckboxWithLabelProps,
  CheckboxGroupProps,
  CheckboxGroupOption,
  CheckboxCardProps,
};
