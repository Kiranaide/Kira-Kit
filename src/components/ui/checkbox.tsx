/* eslint-disable react-refresh/only-export-components */
"use client";

import * as React from "react";
import gsap from "gsap";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SimpleTooltip } from "@/components/ui/tooltip";
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
  "flex items-center justify-center text-current w-full h-full",
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

const indicatorIconSize = {
  sm: "h-3 w-3",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
} as const;

type CheckboxSize = "sm" | "default" | "lg";

type CheckboxVariant = "default" | "outline" | "filled" | "soft";

type CheckboxColor = "default" | "success" | "destructive" | "warning";

interface CheckboxProps
  extends Omit<
    CheckboxPrimitive.Root.Props,
    "checked" | "onCheckedChange" | "defaultChecked" | "indeterminate"
  > {
  /** `true` / `false` / `"indeterminate"`. Omit for uncontrolled (see `defaultChecked`). */
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  color?: CheckboxColor;
  customIcon?: React.ReactNode;
  /** Spinner in the indicator; blocks toggling. */
  loading?: boolean;
  error?: boolean;
  /** When disabled, wrap in a tooltip explaining why. */
  disabledReason?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
}

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  size = "default",
  variant = "default",
  color = "default",
  customIcon,
  loading = false,
  error = false,
  disabled,
  disabledReason,
  readOnly,
  ...props
}: CheckboxProps) {
  const reduced = useReducedMotion();
  const rippleRef = React.useRef<HTMLSpanElement>(null);
  const boxRef = React.useRef<HTMLButtonElement>(null);

  // Split the public tri-state prop at the boundary; Base UI owns the state.
  const controlledIndeterminate =
    checked === "indeterminate" ? true : undefined;

  const controlledChecked = checked === undefined ? undefined : checked === true;

  const handleChange = (next: boolean) => {
    if (loading) return;

    // Indicator scale/opacity is CSS-driven off data-checked (one writer).
    // GSAP only decorates separate elements: the ripple and a press pop.
    if (!reduced && rippleRef.current) {
      gsap.fromTo(
        rippleRef.current,
        { scale: 0.5, opacity: 0.3 },
        { scale: 1.5, opacity: 0, duration: 0.3, ease: "power1.out" }
      );
    }

    if (!reduced && boxRef.current) {
      // Press micro-interaction < 150ms (transform only).
      gsap.fromTo(
        boxRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.12, ease: "power2.out" }
      );
    }

    onCheckedChange?.(next);
  };

  const box = (
    <div className="relative inline-flex items-center">
      <CheckboxPrimitive.Root
        ref={boxRef}
        data-slot="checkbox"
        checked={controlledChecked}
        defaultChecked={defaultChecked}
        indeterminate={controlledIndeterminate}
        disabled={disabled || loading}
        readOnly={readOnly}
        onCheckedChange={handleChange}
        className={cn(
          checkboxVariants({ variant, color, size }),
          "relative overflow-hidden",
          "data-invalid:border-destructive data-invalid:data-checked:bg-destructive",
          "data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2",
          error && "border-destructive data-checked:bg-destructive",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className={cn(
            "group/ind",
            checkboxIndicatorVariants({ size }),
            // Resting/initial state via CSS (GSAP inline styles take over on toggle).
            "scale-0 opacity-0 data-[checked]:scale-100 data-[checked]:opacity-100",
            "data-[indeterminate]:scale-100 data-[indeterminate]:opacity-100",
            !reduced && "transition-[transform,opacity] duration-150"
          )}
          keepMounted
        >
          {loading ? (
            <IconLoader
              className={cn("animate-spin", indicatorIconSize[size])}
              strokeWidth={3}
            />
          ) : customIcon ? (
            customIcon
          ) : (
            // Indicator carries data-indeterminate; swap minus vs check via CSS.
            <>
              <IconMinus
                strokeWidth={3}
                className="hidden group-data-[indeterminate]/ind:block"
              />
              <IconCheck
                strokeWidth={3}
                className="group-data-[indeterminate]/ind:hidden"
              />
            </>
          )}
        </CheckboxPrimitive.Indicator>
        <span
          ref={rippleRef}
          data-slot="checkbox-ripple"
          className="absolute inset-0 rounded-sm bg-primary/30 scale-0 opacity-0 pointer-events-none"
        />
      </CheckboxPrimitive.Root>
    </div>
  );

  if (disabled && disabledReason) {
    return <SimpleTooltip content={disabledReason}>{box}</SimpleTooltip>;
  }

  return box;
}

interface CheckboxWithLabelProps extends CheckboxProps {
  label: string;
  description?: string;
  labelPlacement?: "right" | "left";
  /** Wrapper className (the checkbox's own className still targets the box). */
  wrapperClassName?: string;
}

function CheckboxWithLabel({
  label,
  description,
  labelPlacement = "right",
  wrapperClassName,
  id,
  ...props
}: CheckboxWithLabelProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  const content = (
    <div className="flex flex-col gap-0.5">
      <label
        htmlFor={checkboxId}
        className={cn(
          "text-sm font-medium leading-none cursor-pointer",
          (props.disabled || props.readOnly) && "cursor-not-allowed opacity-70"
        )}
      >
        {label}
      </label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );

  return (
    <div
      data-slot="checkbox-with-label"
      className={cn("flex items-start gap-3", wrapperClassName)}
    >
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
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  description?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  /** Show a live "n/total selected" indicator. */
  showProgress?: boolean;
  orientation?: "vertical" | "horizontal";
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  color?: CheckboxColor;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

function CheckboxGroup({
  options,
  value,
  defaultValue,
  onChange,
  label,
  description,
  showSelectAll = false,
  selectAllLabel = "Select all",
  showProgress = false,
  orientation = "vertical",
  size = "default",
  variant = "default",
  color = "default",
  className,
  disabled = false,
  error = false,
}: CheckboxGroupProps) {
  const allValues = React.useMemo(() => options.map((o) => o.value), [options]);

  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onChange?.(v)}
      allValues={allValues}
      disabled={disabled}
      className={cn("flex flex-col gap-3", className)}
      render={
        <CheckboxGroupInner
          options={options}
          label={label}
          description={description}
          showSelectAll={showSelectAll}
          selectAllLabel={selectAllLabel}
          showProgress={showProgress}
          orientation={orientation}
          size={size}
          variant={variant}
          color={color}
          disabled={disabled}
          error={error}
          allValues={allValues}
          value={value}
        />
      }
    />
  );
}

// Rendered inside the primitive so children pick up the group context.
function CheckboxGroupInner({
  options,
  label,
  description,
  showSelectAll,
  selectAllLabel,
  showProgress,
  orientation,
  size,
  variant,
  color,
  disabled,
  error,
  allValues,
  value,
  ...divProps
}: {
  options: CheckboxGroupOption[];
  label?: string;
  description?: string;
  showSelectAll: boolean;
  selectAllLabel: string;
  showProgress: boolean;
  orientation: "vertical" | "horizontal";
  size: CheckboxSize;
  variant: CheckboxVariant;
  color: CheckboxColor;
  disabled: boolean;
  error: boolean;
  allValues: string[];
  value?: string[];
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const selectedCount = value ? value.length : 0;

  return (
    <div {...divProps}>
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
      {showProgress && (
        <p
          data-slot="checkbox-group-progress"
          className="text-xs text-muted-foreground tabular-nums"
          aria-live="polite"
        >
          {selectedCount}/{allValues.length} selected
        </p>
      )}
      {showSelectAll && (
        // `parent` lets Base UI derive checked/indeterminate from the group's
        // `allValues` + `value` — no hand-rolled parent hook needed.
        <CheckboxWithLabel
          parent
          label={selectAllLabel}
          size={size}
          variant={variant}
          color={color}
          disabled={disabled}
          error={error}
          wrapperClassName="pb-2 border-b border-border"
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
            name={option.value}
            label={option.label}
            description={option.description}
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

interface CheckboxCardProps
  extends Omit<CheckboxProps, "customIcon" | "onCheckedChange"> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  showIndicator?: boolean;
  onCheckedChange?: (checked: boolean) => void;
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
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  disabledReason,
  className,
  name,
  value,
  id,
}: CheckboxCardProps) {
  const generatedId = React.useId();
  const cardId = id || generatedId;

  const padding = size === "sm" ? "p-3" : size === "lg" ? "p-5" : "p-4";

  const card = (
    <label
      htmlFor={cardId}
      data-slot="checkbox-card"
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      className={cn(
        "group relative flex items-start gap-3 rounded-lg border-2 border-input bg-transparent cursor-pointer transition-all",
        "hover:bg-muted/50",
        "has-data-[checked]:border-primary has-data-[checked]:bg-primary/5",
        "has-data-[checked]:ring-1 has-data-[checked]:ring-primary/40",
        "has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent",
        padding,
        error && "border-destructive",
        className
      )}
    >
      {showIndicator && (
        <div className="shrink-0 mt-0.5">
          <Checkbox
            id={cardId}
            name={name}
            value={value}
            size={size}
            variant={variant}
            color={color}
            error={error}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={(c) => onCheckedChange?.(c === true)}
            disabled={disabled}
          />
        </div>
      )}
      {icon && (
        <div
          className={cn(
            "shrink-0 text-muted-foreground transition-colors",
            "group-has-data-[checked]:text-primary"
          )}
          data-slot="checkbox-card-icon"
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium select-none">{label}</span>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );

  if (disabled && disabledReason) {
    return <SimpleTooltip content={disabledReason}>{card}</SimpleTooltip>;
  }

  return card;
}

type KiraCheckboxProps =
  | ({ mode?: "checkbox" } & CheckboxProps)
  | ({ mode: "label" } & CheckboxWithLabelProps)
  | ({ mode: "card" } & CheckboxCardProps)
  | ({ mode: "group" } & CheckboxGroupProps);

function KiraCheckbox(props: KiraCheckboxProps) {
  switch (props.mode) {
    case "label": {
      const { mode, ...rest } = props;
      void mode;

      return <CheckboxWithLabel {...rest} />;
    }

    case "card": {
      const { mode, ...rest } = props;
      void mode;

      return <CheckboxCard {...rest} />;
    }

    case "group": {
      const { mode, ...rest } = props;
      void mode;

      return <CheckboxGroup {...rest} />;
    }

    default: {
      const { mode, ...rest } = props as { mode?: "checkbox" } & CheckboxProps;
      void mode;

      return <Checkbox {...rest} />;
    }
  }
}

export {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
  CheckboxCard,
  KiraCheckbox,
  checkboxVariants,
};

export type {
  CheckboxProps,
  CheckboxWithLabelProps,
  CheckboxGroupProps,
  CheckboxGroupOption,
  CheckboxCardProps,
  KiraCheckboxProps,
};
