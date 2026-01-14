"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IconInfoCircle } from "@tabler/icons-react";

// =============================================================================
// Types
// =============================================================================

interface LabelProps
  extends Omit<React.ComponentProps<"label">, "prefix">,
    VariantProps<typeof labelVariants> {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show required indicator */
  required?: boolean;
  /** Show optional indicator */
  optional?: boolean;
  /** Hint text displayed inline */
  hint?: React.ReactNode;
  /** Show error styling */
  error?: boolean;
  /** Show disabled styling */
  disabled?: boolean;
  /** Icon to display before the label text */
  icon?: React.ReactNode;
  /** Icon to display after the label text */
  iconAfter?: React.ReactNode;
  /** Tooltip content for info icon */
  tooltip?: React.ReactNode;
  /** Counter/badge to display (e.g., "3" for "Files (3)") */
  counter?: number | string;
  /** Render as a different element (default: label) */
  as?: "label" | "span" | "div";
  /** Truncate long text with ellipsis */
  truncate?: boolean;
  /** Screen reader only text (visually hidden) */
  srOnly?: React.ReactNode;
  /** Custom required indicator (default: "*") */
  requiredIndicator?: React.ReactNode;
  /** Custom optional text (default: "optional") */
  optionalText?: string;
}

interface LabelHintProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof labelHintVariants> {}

interface LabelRequiredProps extends React.ComponentProps<"span"> {
  /** Custom indicator content */
  indicator?: React.ReactNode;
}

interface LabelOptionalProps extends React.ComponentProps<"span"> {
  /** Custom text (default: "optional") */
  text?: string;
}

interface LabelCounterProps extends React.ComponentProps<"span"> {
  /** Counter value */
  count: number | string;
  /** Maximum value before showing "99+" style */
  max?: number;
}

interface LabelIconProps extends React.ComponentProps<"span"> {
  /** Position of the icon */
  position?: "before" | "after";
}

// =============================================================================
// Variants
// =============================================================================

const labelVariants = cva(
  "text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      error: {
        true: "text-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  }
);

const labelHintVariants = cva("text-muted-foreground text-xs font-normal", {
  variants: {
    size: {
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// =============================================================================
// Label
// =============================================================================

function Label({
  className,
  size = "md",
  required,
  optional,
  hint,
  error,
  disabled,
  icon,
  iconAfter,
  tooltip,
  counter,
  as = "label",
  truncate,
  srOnly,
  requiredIndicator = "*",
  optionalText = "optional",
  children,
  ...props
}: LabelProps) {
  const Component = as;

  const content = (
    <>
      {/* Screen reader only text */}
      {srOnly && <span className="sr-only">{srOnly}</span>}

      {/* Icon before */}
      {icon && <LabelIcon position="before">{icon}</LabelIcon>}

      {/* Main text content */}
      <span
        className={cn(
          truncate && "truncate max-w-[200px]",
          "inline-flex items-center gap-1"
        )}
      >
        {children}
      </span>

      {/* Required indicator */}
      {required && (
        <LabelRequired indicator={requiredIndicator} aria-hidden="true" />
      )}

      {/* Optional indicator */}
      {optional && !required && (
        <LabelOptional text={optionalText} aria-hidden="true" />
      )}

      {/* Counter badge */}
      {counter !== undefined && <LabelCounter count={counter} />}

      {/* Icon after */}
      {iconAfter && <LabelIcon position="after">{iconAfter}</LabelIcon>}

      {/* Tooltip info icon */}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full hover:bg-muted p-0.5 -my-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="More information"
              />
            }
          >
            <IconInfoCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}

      {/* Inline hint */}
      {hint && (
        <LabelHint size={size} className="ml-1">
          {hint}
        </LabelHint>
      )}
    </>
  );

  return (
    <Component
      data-slot="label"
      data-size={size}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      data-truncate={truncate || undefined}
      className={cn(
        labelVariants({ size, error }),
        "gap-1.5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...(props as React.ComponentProps<typeof Component>)}
    >
      {content}
    </Component>
  );
}

// =============================================================================
// LabelHint
// =============================================================================

function LabelHint({ className, size = "md", ...props }: LabelHintProps) {
  return (
    <span
      data-slot="label-hint"
      className={cn(labelHintVariants({ size }), className)}
      {...props}
    />
  );
}

// =============================================================================
// LabelRequired
// =============================================================================

function LabelRequired({
  className,
  indicator = "*",
  ...props
}: LabelRequiredProps) {
  return (
    <span
      data-slot="label-required"
      className={cn("text-destructive font-normal", className)}
      {...props}
    >
      {indicator}
    </span>
  );
}

// =============================================================================
// LabelOptional
// =============================================================================

function LabelOptional({
  className,
  text = "optional",
  ...props
}: LabelOptionalProps) {
  return (
    <span
      data-slot="label-optional"
      className={cn("text-xs text-muted-foreground font-normal", className)}
      {...props}
    >
      ({text})
    </span>
  );
}

// =============================================================================
// LabelCounter - Badge style counter
// =============================================================================

function LabelCounter({
  className,
  count,
  max = 99,
  ...props
}: LabelCounterProps) {
  const displayCount =
    typeof count === "number" && count > max ? `${max}+` : count;

  return (
    <span
      data-slot="label-counter"
      className={cn(
        "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  );
}

// =============================================================================
// LabelIcon - Icon wrapper with consistent sizing
// =============================================================================

function LabelIcon({
  className,
  position = "before",
  children,
  ...props
}: LabelIconProps) {
  return (
    <span
      data-slot="label-icon"
      data-position={position}
      className={cn(
        "inline-flex items-center justify-center shrink-0 [&_svg]:h-4 [&_svg]:w-4 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// =============================================================================
// LabelDescription (for field context compatibility)
// =============================================================================

type LabelDescriptionProps = React.ComponentProps<"p">;

function LabelDescription({ className, ...props }: LabelDescriptionProps) {
  return (
    <p
      data-slot="label-description"
      className={cn(
        "text-muted-foreground text-sm font-normal mt-1",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// LabelGroup - Group label with description
// =============================================================================

interface LabelGroupProps extends React.ComponentProps<"div"> {
  /** The main label text */
  label: React.ReactNode;
  /** Description text below the label */
  description?: React.ReactNode;
  /** Label props to pass through */
  labelProps?: Omit<LabelProps, "children">;
}

function LabelGroup({
  className,
  label,
  description,
  labelProps,
  children,
  ...props
}: LabelGroupProps) {
  return (
    <div
      data-slot="label-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <Label {...labelProps}>{label}</Label>
      {description && <LabelDescription>{description}</LabelDescription>}
      {children}
    </div>
  );
}

// =============================================================================
// Exports
// =============================================================================

export {
  Label,
  LabelHint,
  LabelRequired,
  LabelOptional,
  LabelCounter,
  LabelIcon,
  LabelDescription,
  LabelGroup,
};

// =============================================================================
// Type Exports
// =============================================================================

export type {
  LabelProps,
  LabelHintProps,
  LabelRequiredProps,
  LabelOptionalProps,
  LabelCounterProps,
  LabelIconProps,
  LabelDescriptionProps,
  LabelGroupProps,
};
