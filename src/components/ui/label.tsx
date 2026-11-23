"use client";

import * as React from "react";
import { Field } from "@base-ui/react/field";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { isNumberProp } from "@/lib/component-utils";

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
  /**
   * Render a different root element (e.g. Base UI's <Field.Label />) instead of
   * the `as` element. The element is cloned with the label's classes, data-slot
   * attributes, and content merged in.
   */
  render?: React.ReactElement;
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
  // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
  "text-sm leading-none font-medium flex items-center gap-1.5 select-none group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed",
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
  },
);

const labelHintVariants = cva("text-muted-foreground text-xs font-normal", {
  variants: {
    size: {
      // kira-kit-ignore arbitrary-values: sub-12px micro type is a documented exception
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
  size: sizeInput,
  required,
  optional,
  hint,
  error,
  disabled,
  icon,
  iconAfter,
  tooltip,
  counter,
  as: asInput,
  truncate,
  srOnly,
  requiredIndicator: requiredIndicatorInput,
  optionalText: optionalTextInput,
  render,
  children,
  ...props
}: LabelProps) {
  const { size, as, requiredIndicator, optionalText } = useLabelDefaults({
    size: sizeInput,
    as: asInput,
    requiredIndicator: requiredIndicatorInput,
    optionalText: optionalTextInput,
  });

  const Component = as;

  const content = (
    <LabelSrOnlyView
      srOnly={srOnly}
      icon={icon}
      truncate={truncate}
      required={required}
      requiredIndicator={requiredIndicator}
      optional={optional}
      optionalText={optionalText}
      counter={counter}
      iconAfter={iconAfter}
      tooltip={tooltip}
      hint={hint}
      size={size}
    >
      {children}
    </LabelSrOnlyView>
  );

  const rootProps = {
    "data-slot": "label",
    "data-size": size,
    "data-error": error || undefined,
    "data-disabled": disabled || undefined,
    "data-truncate": truncate || undefined,
    className: cn(
      labelVariants({ size, error }),
      { "min-w-0": truncate },
      className,
    ),
    // SAFETY: `props` is LabelProps minus destructured keys; the rest-spread
    // lands on a label/span/div root. The cast only silences the
    // htmlFor-on-non-label excess check — HTML label props are valid on all
    // three roots, and Base UI render elements receive the same shape.
    ...(props as React.HTMLAttributes<HTMLElement>),
  };

  // `render` swaps the root element (e.g. Base UI's <Field.Label />) while
  // keeping the merged classes, data-slots, and content.
  if (render) {
    return React.cloneElement(render, rootProps, content);
  }

  return <Component {...rootProps}>{content}</Component>;
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
  const displayCount = isNumberProp(count) && count > max ? `${max}+` : count;

  return (
    // kira-kit-ignore spacing-scale: optional/count badge uses badge-tier compact padding
    <span
      data-slot="label-counter"
      className={cn(
        "inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground",
        className,
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
        className,
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
        className,
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

interface KiraLabelProps extends Omit<LabelProps, "counter"> {
  /** Description rendered below the label (folds LabelGroup's job). */
  description?: React.ReactNode;
  /** Live character count; renders `count/maxCount` with an aria-live region. */
  count?: number;
  maxCount?: number;
  /** Inline validation state — drives colour and, with htmlFor, a linked message. */
  validationState?: "valid" | "invalid" | "validating";
  validationMessage?: React.ReactNode;
  /**
   * Render Base UI's Field.Label so the label auto-associates with the control
   * of a surrounding <Field.Root>. Coexists with the default <label> path.
   */
  field?: boolean;
}

function KiraLabelCounter({
  count,
  maxCount,
}: {
  count: number;
  maxCount?: number;
}) {
  const resolveClassName1 = () => labelResolveClassName1(over, near);

  const over = maxCount !== undefined && count > maxCount;
  const near = maxCount !== undefined && !over && count >= maxCount * 0.8;

  return (
    <span
      data-slot="label-char-count"
      aria-live="polite"
      className={cn(
        "ml-auto text-xs font-normal tabular-nums",
        resolveClassName1(),
      )}
    >
      {count}
      {maxCount !== undefined && `/${maxCount}`}
    </span>
  );
}

function KiraLabel({
  description,
  count,
  maxCount,
  validationState,
  validationMessage,
  field,
  error,
  size = "md",
  hint,
  className,
  htmlFor,
  children,
  ...labelProps
}: KiraLabelProps) {
  const resolveClassName2 = () =>
    labelResolveClassName2(isInvalid, validationState);

  const isInvalid = validationState === "invalid";
  const messageId = React.useId();

  const label = (
    <Label
      {...labelProps}
      htmlFor={htmlFor}
      size={size}
      hint={hint}
      error={error || isInvalid}
      className={cn({ "w-full": count !== undefined }, className)}
      // Opt into Base UI's Field.Label for automatic control association.
      render={field ? <Field.Label /> : undefined}
    >
      {children}
      {count !== undefined && (
        <KiraLabelCounter count={count} maxCount={maxCount} />
      )}
    </Label>
  );

  if (!description && !validationMessage) return label;

  return (
    <div data-slot="kira-label" className="flex flex-col gap-1">
      {label}
      {description && <LabelDescription>{description}</LabelDescription>}
      {validationMessage && (
        <output
          id={htmlFor ? messageId : undefined}

          aria-live="polite"
          data-slot="label-validation-message"
          className={`block ${cn("text-xs font-normal", resolveClassName2())}`}
        >
          {validationMessage}
        </output>
      )}
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
  KiraLabel,
  labelVariants,
  labelHintVariants,
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
  KiraLabelProps,
};

function labelResolveClassName1(over: boolean, near: boolean) {
  if (over) {
    return "text-destructive font-medium" as const;
  }

  if (near) {
    return "text-warning" as const;
  }

  return "text-muted-foreground" as const;
}

function labelResolveClassName2(
  isInvalid: boolean,
  validationState: "valid" | "invalid" | "validating" | undefined,
) {
  if (isInvalid) {
    return "text-destructive" as const;
  }

  if (validationState === "valid") {
    return "text-success" as const;
  }

  return "text-muted-foreground" as const;
}

// oxlint-disable-next-line eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function LabelSrOnlyView({
  srOnly,
  icon,
  truncate,
  children,
  required,
  requiredIndicator,
  optional,
  optionalText,
  counter,
  iconAfter,
  tooltip,
  hint,
  size,
}: LabelSrOnlyViewParams) {
  return (
    <>
      {srOnly && (
        <span data-slot="label-sr-only" className="sr-only">
          {srOnly}
        </span>
      )}

      {icon && <LabelIcon position="before">{icon}</LabelIcon>}

      <span
        data-slot="label-text"
        className={cn({ truncate: truncate }, "inline-flex items-center gap-1")}
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
                data-slot="label-tooltip-trigger"
                type="button"
                className="inline-flex items-center justify-center rounded-full hover:bg-muted p-0.5 -my-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="More information"
              />
            }
          >
            {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
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
}

function useLabelDefaults({
  size: sizeInput,
  as: asInput,
  requiredIndicator: requiredIndicatorInput,
  optionalText: optionalTextInput,
}: {
  size?: LabelProps["size"];
  as?: LabelProps["as"];
  requiredIndicator?: LabelProps["requiredIndicator"];
  optionalText?: LabelProps["optionalText"];
}) {
  return React.useMemo(() => {
    const {
      size = "md",
      as = "label",
      requiredIndicator = "*",
      optionalText = "optional",
    } = {
      size: sizeInput,
      as: asInput,
      requiredIndicator: requiredIndicatorInput,
      optionalText: optionalTextInput,
    };

    return { size, as, requiredIndicator, optionalText };
  }, [sizeInput, asInput, requiredIndicatorInput, optionalTextInput]);
}

type LabelSrOnlyViewParams = {
  srOnly: LabelProps["srOnly"];
  icon: LabelProps["icon"];
  truncate: LabelProps["truncate"];
  children: LabelProps["children"];
  required: LabelProps["required"];
  requiredIndicator: LabelProps["requiredIndicator"];
  optional: LabelProps["optional"];
  optionalText: LabelProps["optionalText"];
  counter: LabelProps["counter"];
  iconAfter: LabelProps["iconAfter"];
  tooltip: LabelProps["tooltip"];
  hint: LabelProps["hint"];
  size: LabelProps["size"];
};
