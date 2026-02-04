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

interface LabelProps
  extends
    Omit<React.ComponentProps<"label">, "prefix">,
    VariantProps<typeof labelVariants> {
  size?: "sm" | "md" | "lg";
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  tooltip?: React.ReactNode;
  counter?: number | string;
  as?: "label" | "span" | "div";
  truncate?: boolean;
  srOnly?: React.ReactNode;
  requiredIndicator?: React.ReactNode;
  optionalText?: string;
}

interface LabelHintProps
  extends
    React.ComponentProps<"span">,
    VariantProps<typeof labelHintVariants> {}

interface LabelRequiredProps extends React.ComponentProps<"span"> {
  indicator?: React.ReactNode;
}

interface LabelOptionalProps extends React.ComponentProps<"span"> {
  text?: string;
}

interface LabelCounterProps extends React.ComponentProps<"span"> {
  count: number | string;
  max?: number;
}

interface LabelIconProps extends React.ComponentProps<"span"> {
  position?: "before" | "after";
}

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
      {srOnly && <span className="sr-only">{srOnly}</span>}

      {icon && <LabelIcon position="before">{icon}</LabelIcon>}

      <span
        className={cn(
          truncate && "truncate max-w-[200px]",
          "inline-flex items-center gap-1"
        )}
      >
        {children}
      </span>

      {required && (
        <LabelRequired indicator={requiredIndicator} aria-hidden="true" />
      )}

      {optional && !required && (
        <LabelOptional text={optionalText} aria-hidden="true" />
      )}

      {counter !== undefined && <LabelCounter count={counter} />}

      {iconAfter && <LabelIcon position="after">{iconAfter}</LabelIcon>}

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
      {...(props as object)}
    >
      {content}
    </Component>
  );
}

function LabelHint({ className, size = "md", ...props }: LabelHintProps) {
  return (
    <span
      data-slot="label-hint"
      className={cn(labelHintVariants({ size }), className)}
      {...props}
    />
  );
}

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
        "inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  );
}

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

interface LabelGroupProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;

  description?: React.ReactNode;

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
