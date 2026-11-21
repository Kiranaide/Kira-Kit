"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "cn";
import { isFunctionProp } from "@/components/ui/prop-guards";

const separatorVariants = cva(
  "shrink-0 data-[orientation=horizontal]:h-[var(--separator-size)] data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[var(--separator-size)] data-[orientation=vertical]:self-stretch",
  {
    variants: {
      size: {
        xs: "[--separator-size:1px]",
        sm: "[--separator-size:1px]",
        default: "[--separator-size:1px]",
        md: "[--separator-size:2px]",
        lg: "[--separator-size:4px]",
        xl: "[--separator-size:6px]",
      },
      lineStyle: {
        solid: "bg-[var(--separator-color)]",
        dashed:
          "border-0 border-dashed border-[var(--separator-color)] data-[orientation=horizontal]:border-t-[length:var(--separator-size)] data-[orientation=vertical]:border-s-[length:var(--separator-size)]",
        dotted:
          "border-0 border-dotted border-[var(--separator-color)] data-[orientation=horizontal]:border-t-[length:var(--separator-size)] data-[orientation=vertical]:border-s-[length:var(--separator-size)]",
        gradient:
          "bg-linear-to-r from-transparent via-[var(--separator-gradient,var(--separator-color))] to-transparent data-[orientation=vertical]:bg-linear-to-b",
      },
      color: {
        default: "[--separator-color:var(--border)]",
        primary: "[--separator-color:var(--primary)]",
        secondary: "[--separator-color:var(--secondary)]",
        muted: "[--separator-color:var(--muted)]",
        destructive: "[--separator-color:var(--destructive)]",
        success: "[--separator-color:var(--success)]",
        warning: "[--separator-color:var(--warning)]",
        info: "[--separator-color:var(--info)]",
      },
      gradient: {
        none: "",
        fade: "",
        primary: "[--separator-gradient:var(--primary)]",
      },
    },
    defaultVariants: {
      size: "default",
      lineStyle: "solid",
      color: "default",
      gradient: "none",
    },
  },
);

const separatorLabelVariants = cva(
  "inline-flex min-w-0 items-center gap-2 wrap-anywhere text-xs font-medium text-muted-foreground",
);

type SeparatorLabelProps = React.ComponentProps<"span">;

function SeparatorLabel({ className, ...props }: SeparatorLabelProps) {
  return (
    <span
      data-slot="separator-label"
      className={cn(separatorLabelVariants(), className)}
      {...props}
    />
  );
}

type SeparatorSpacing = "none" | "sm" | "default" | "lg";

const spacingClasses = {
  horizontal: { none: "", sm: "my-2", default: "my-4", lg: "my-6" },
  vertical: { none: "", sm: "mx-2", default: "mx-4", lg: "mx-6" },
} satisfies Record<"horizontal" | "vertical", Record<SeparatorSpacing, string>>;

const insetClasses = {
  horizontal: {
    none: "",
    sm: "mx-2 w-auto",
    default: "mx-4 w-auto",
    lg: "mx-6 w-auto",
  },
  vertical: { none: "", sm: "my-2", default: "my-4", lg: "my-6" },
} satisfies Record<"horizontal" | "vertical", Record<SeparatorSpacing, string>>;

interface SeparatorProps
  extends
    Omit<SeparatorPrimitive.Props, "children" | "color">,
    VariantProps<typeof separatorVariants> {
  label?: React.ReactNode;
  labelAlign?: "start" | "center" | "end";
  labelIcon?: React.ReactNode;
  labelIconPosition?: "left" | "right";
  labelClassName?: string;
  lineClassName?: string;
  spacing?: SeparatorSpacing;
  inset?: SeparatorSpacing;
  /** Hide a visual rule from assistive technology. Base UI has no decorative prop. */
  decorative?: boolean;
}

function Separator(arg0: SeparatorProps) {
  const model = useSeparatorModel(arg0);

  return <SeparatorView {...model} />;
}

interface SeparatorAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
  pending?: boolean;
}

interface KiraSeparatorBaseProps
  extends
    Omit<React.ComponentProps<"div">, "children" | "color">,
    VariantProps<typeof separatorVariants> {
  label: React.ReactNode;
  labelAlign?: "start" | "center" | "end";
  labelIcon?: React.ReactNode;
  labelIconPosition?: "left" | "right";
  labelClassName?: string;
  lineClassName?: string;
  orientation?: "horizontal" | "vertical";
  spacing?: SeparatorSpacing;
  inset?: SeparatorSpacing;
  count?: number;
  countLabel?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
}

type KiraSeparatorProps = KiraSeparatorBaseProps &
  (
    | {
        collapsible?: false;
        action?: SeparatorAction;
        children?: never;
        open?: never;
        defaultOpen?: never;
        onOpenChange?: never;
        keepMounted?: never;
        motion?: never;
      }
    | {
        collapsible: true;
        action?: never;
        children: React.ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: React.ComponentProps<typeof Collapsible>["onOpenChange"];
        keepMounted?: boolean;
        motion?: boolean;
      }
  );

function KiraSeparator(props: KiraSeparatorProps) {
  const model = useKiraSeparatorModel(props);

  return <KiraSeparatorRoot {...model} />;
}

function useKiraSeparatorModel(input: KiraSeparatorProps) {
  const options = useKiraSeparatorOptions(input);
  const disclosure = useKiraSeparatorOptions2(input);
  const id = React.useId();

  const accessibility = resolveKiraSeparatorAccessibility(id, {
    ...input,
    disabled: options.disabled,
  });

  const parts = createKiraSeparatorParts(input, options, accessibility, id);

  return {
    ...options,
    ...disclosure,
    ...parts,
    id,
    details: accessibility.details,
  };
}

function createKiraSeparatorParts(
  {
    label,
    labelAlign: _labelAlign,
    labelIcon,
    labelIconPosition: _labelIconPosition,
    labelClassName,
    lineClassName,
    orientation: _orientation,
    spacing,
    inset,
    size,
    lineStyle,
    color,
    gradient,
    count,
    countLabel: _countLabel,
    description,
    disabled: _disabled,
    disabledReason: _disabledReason,
    collapsible: _collapsible,
    action,
    children,
    open,
    defaultOpen: _defaultOpen,
    onOpenChange,
    keepMounted: _keepMounted,
    motion: _motion,
    className,
    "aria-describedby": _describedBy,
    ...props
  }: KiraSeparatorProps,
  options: ReturnType<typeof useKiraSeparatorOptions>,
  accessibility: ReturnType<typeof resolveKiraSeparatorAccessibility>,
  id: string,
) {
  const rootClass = separatorRootClass(
    options.orientation,
    spacing,
    inset,
    className,
  );

  const { buildBoundary, buildDetails } = createSeparatorContent({
    id,
    labelClassName,
    labelIcon,
    labelIconPosition: options.labelIconPosition,
    label,
    validCount: normalizeSeparatorCount(count),
    countLabel: options.countLabel,
    orientation: options.orientation,
    size,
    lineStyle,
    color,
    gradient,
    horizontal: options.orientation === "horizontal",
    lineClassName,
    collapsible: options.collapsible,
    disabled: options.disabled,
    ...accessibility,
    action,
    labelAlign: options.labelAlign,
    description,
  });

  return {
    props,
    rootClass,
    open,
    onOpenChange,
    children,
    buildBoundary,
    buildDetails,
  };
}

function normalizeSeparatorCount(count: number | undefined) {
  return count != null && Number.isFinite(count)
    ? Math.max(0, Math.floor(count))
    : undefined;
}

function separatorRootClass(
  orientation: "horizontal" | "vertical",
  spacing: SeparatorSpacing | undefined,
  inset: SeparatorSpacing | undefined,
  className: string | undefined,
) {
  return cn(
    "min-w-0",
    spacing && spacingClasses[orientation][spacing],
    inset && insetClasses[orientation][inset],
    className,
  );
}

function resolveKiraSeparatorAccessibility(
  id: string,
  {
    disabled,
    disabledReason,
    action,
    description,
    "aria-describedby": describedBy,
  }: Pick<
    KiraSeparatorProps,
    | "disabled"
    | "disabledReason"
    | "action"
    | "description"
    | "aria-describedby"
  >,
) {
  const reason = disabledReason ?? action?.disabledReason;
  const isDisabled = disabled || action?.disabled === true;

  const details =
    [
      describedBy,
      description == null ? undefined : id + "-description",
      isDisabled && reason ? id + "-reason" : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return { reason, isDisabled: Boolean(isDisabled), details };
}

function KiraSeparatorRoot({
  id,
  props,
  details,
  rootClass,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  motion,
  collapsible,
  keepMounted,
  children,
  buildBoundary,
  buildDetails,
}: ReturnType<typeof useKiraSeparatorModel>) {
  if (collapsible)
    return (
      <Collapsible
        data-slot="kira-separator"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
        role="group"
        {...props}
        aria-labelledby={id + "-label"}
        aria-describedby={details}
        className={rootClass}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
        motion={motion}
      >
        {buildBoundary()}
        {buildDetails()}
        <CollapsibleContent
          data-slot="kira-separator-panel"
          size="none"
          keepMounted={keepMounted}
          className="mt-3"
        >
          {children}
        </CollapsibleContent>
      </Collapsible>
    );

  return (
    <div
      data-slot="kira-separator"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      {...props}
      aria-labelledby={id + "-label"}
      aria-describedby={details}
      className={rootClass}
    >
      {buildBoundary()}
      {buildDetails()}
    </div>
  );
}

export {
  Separator,
  SeparatorLabel,
  KiraSeparator,
  separatorVariants,
  separatorLabelVariants,
};

export type {
  SeparatorProps,
  SeparatorLabelProps,
  SeparatorSpacing,
  SeparatorAction,
  KiraSeparatorProps,
};

function resolveSeparatorOptions({
  orientation = "horizontal",
  lineStyle = "solid",
  color = "default",
  labelAlign = "center",
  labelIconPosition = "left",
  decorative = false,
}: {
  orientation?: SeparatorProps["orientation"];
  lineStyle?: SeparatorProps["lineStyle"];
  color?: SeparatorProps["color"];
  labelAlign?: SeparatorProps["labelAlign"];
  labelIconPosition?: SeparatorProps["labelIconPosition"];
  decorative?: SeparatorProps["decorative"];
}) {
  return {
    orientation,
    lineStyle,
    color,
    labelAlign,
    labelIconPosition,
    decorative,
  };
}

function resolveKiraSeparatorOptions({
  labelAlign = "center",
  labelIconPosition = "left",
  orientation = "horizontal",
  countLabel = "items",
  disabled = false,
  collapsible = false,
}: {
  labelAlign?: KiraSeparatorProps["labelAlign"];
  labelIconPosition?: KiraSeparatorProps["labelIconPosition"];
  orientation?: KiraSeparatorProps["orientation"];
  countLabel?: KiraSeparatorProps["countLabel"];
  disabled?: KiraSeparatorProps["disabled"];
  collapsible?: KiraSeparatorProps["collapsible"];
}) {
  return {
    labelAlign,
    labelIconPosition,
    orientation,
    countLabel,
    disabled,
    collapsible,
  };
}

function resolveKiraSeparatorOptions2({
  defaultOpen = false,
  keepMounted = false,
  motion = true,
}: {
  defaultOpen?: KiraSeparatorProps["defaultOpen"];
  keepMounted?: KiraSeparatorProps["keepMounted"];
  motion?: KiraSeparatorProps["motion"];
}) {
  return { defaultOpen, keepMounted, motion };
}

function SeparatorIconView({
  labelAlign,
  buildLine,
  id,
  labelClassName,
  labelIcon,
  labelIconPosition,
  label,
}: {
  labelAlign: "start" | "center" | "end";
  buildLine: (position: "start" | "end") => React.JSX.Element;
  id: string;
  labelClassName: string | undefined;
  labelIcon: React.ReactNode;
  labelIconPosition: "right" | "left";
  label: React.ReactNode;
}) {
  return (
    <>
      {labelAlign !== "start" && buildLine("start")}
      <SeparatorLabel id={id} className={labelClassName}>
        {labelIcon != null && labelIconPosition === "left" && (
          <span
            data-slot="separator-icon"
            aria-hidden="true"
            className="flex shrink-0 items-center [&_svg]:size-4"
          >
            {labelIcon}
          </span>
        )}
        <span
          data-slot="separator-label-text"
          className="min-w-0 wrap-anywhere"
        >
          {label}
        </span>
        {labelIcon != null && labelIconPosition === "right" && (
          <span
            data-slot="separator-icon"
            aria-hidden="true"
            className="flex shrink-0 items-center [&_svg]:size-4"
          >
            {labelIcon}
          </span>
        )}
      </SeparatorLabel>
      {labelAlign !== "end" && buildLine("end")}
    </>
  );
}

function KiraSeparatorIconView({
  id,
  labelClassName,
  labelIcon,
  labelIconPosition,
  label,
  validCount,
  countLabel,
}: {
  id: string;
  labelClassName: string | undefined;
  labelIcon: React.ReactNode;
  labelIconPosition: "right" | "left";
  label: React.ReactNode;
  validCount: number | undefined;
  countLabel: string;
}) {
  return (
    <SeparatorLabel
      id={id + "-label"}
      className={cn("text-foreground", labelClassName)}
    >
      {labelIcon != null && labelIconPosition === "left" && (
        <span
          data-slot="kira-separator-icon"
          aria-hidden="true"
          className="flex shrink-0 items-center [&_svg]:size-4"
        >
          {labelIcon}
        </span>
      )}
      <span
        data-slot="kira-separator-label-text"
        className="min-w-0 wrap-anywhere"
      >
        {label}
      </span>
      {validCount !== undefined && (
        // kira-kit-ignore spacing-scale: separator label chip uses badge-tier padding
        <span
          data-slot="kira-separator-count"
          aria-label={validCount.toLocaleString() + " " + countLabel}
          className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums"
        >
          {validCount.toLocaleString()}
        </span>
      )}
      {labelIcon != null && labelIconPosition === "right" && (
        <span
          data-slot="kira-separator-icon"
          aria-hidden="true"
          className="flex shrink-0 items-center [&_svg]:size-4"
        >
          {labelIcon}
        </span>
      )}
    </SeparatorLabel>
  );
}

function KiraSeparatorContentView({
  buildLabel,
  action,
  isDisabled,
  reason,
  details,
}: {
  buildLabel: () => React.JSX.Element;
  action: SeparatorAction | undefined;
  isDisabled: boolean;
  reason: string | undefined;
  details: string | undefined;
}) {
  return (
    <div
      data-slot="kira-separator-content"
      className="flex min-w-0 flex-wrap items-center justify-center gap-2"
    >
      {buildLabel()}
      {action && (
        <Button
          type="button"
          data-slot="kira-separator-action"
          variant="ghost"
          size="xs"
          disabled={isDisabled || action.pending}
          focusableWhenDisabled={
            Boolean(isDisabled && reason) || action.pending
          }
          aria-busy={action.pending || undefined}
          aria-describedby={details}
          className="h-auto min-h-7 max-w-full py-1 whitespace-normal"
          onClick={() => {
            if (!isDisabled && !action.pending) action.onClick();
          }}
        >
          {action.pending && (
            <Spinner
              className="text-current"
              style={{ animationName: "none" }}
            />
          )}
          {action.label}
        </Button>
      )}
    </div>
  );
}

function hasSeparatorLabel(label: React.ReactNode) {
  return (
    label !== undefined && label !== null && label !== false && label !== ""
  );
}

function useSeparatorModel({
  className,
  orientation: orientationInput,
  size,
  lineStyle: lineStyleInput,
  color: colorInput,
  gradient,
  label,
  labelAlign: labelAlignInput,
  labelIcon,
  labelIconPosition: labelIconPositionInput,
  labelClassName,
  lineClassName,
  spacing,
  inset,
  decorative: decorativeInput,
  role,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  ...props
}: SeparatorProps) {
  const {
    orientation,
    lineStyle,
    color,
    labelAlign,
    labelIconPosition,
    decorative,
  } = useSeparatorOptions({
    orientation: orientationInput,
    lineStyle: lineStyleInput,
    color: colorInput,
    labelAlign: labelAlignInput,
    labelIconPosition: labelIconPositionInput,
    decorative: decorativeInput,
  });

  const id = React.useId();

  const hasLabel = hasSeparatorLabel(label);

  const horizontal = orientation === "horizontal";

  const lineClass = cn(
    separatorVariants({ size, lineStyle, color, gradient }),
    "flex-1",
    horizontal ? "data-[orientation=horizontal]:w-auto" : "min-h-4",
    lineClassName,
  );

  const buildLine = (position: "start" | "end") => (
    <SeparatorLineView
      key={position}
      orientation={orientation}
      className={lineClass}
    />
  );

  return {
    orientation,
    props,
    decorative,
    role,
    ariaHidden,
    ariaLabel,
    labelledBy,
    hasLabel,
    id,
    size,
    lineStyle,
    color,
    gradient,
    horizontal,
    spacing,
    inset,
    className,
    labelAlign,
    buildLine,
    labelClassName,
    labelIcon,
    labelIconPosition,
    label,
  };
}

function SeparatorLineView({
  orientation,
  className,
}: {
  orientation: "horizontal" | "vertical";
  className: string;
}) {
  return (
    <span
      data-slot="separator-line"
      data-orientation={orientation}
      aria-hidden="true"
      className={className}
    />
  );
}

function SeparatorView({
  orientation,
  props,
  decorative,
  role,
  ariaHidden,
  ariaLabel,
  labelledBy,
  hasLabel,
  id,
  size,
  lineStyle,
  color,
  gradient,
  horizontal,
  spacing,
  inset,
  className,
  labelAlign,
  buildLine,
  labelClassName,
  labelIcon,
  labelIconPosition,
  label,
}: ReturnType<typeof useSeparatorModel>) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      {...props}
      role={decorative ? "presentation" : (role ?? "separator")}
      aria-hidden={decorative ? true : ariaHidden}
      aria-label={ariaLabel}
      aria-labelledby={
        labelledBy ?? (hasLabel && !decorative && !ariaLabel ? id : undefined)
      }
      className={(state) =>
        cn(
          hasLabel
            ? "flex min-w-0 items-center gap-3"
            : separatorVariants({ size, lineStyle, color, gradient }),
          hasLabel &&
            (horizontal ? "w-full" : "h-full min-h-0 w-auto flex-col"),
          spacing && spacingClasses[orientation][spacing],
          inset && insetClasses[orientation][inset],
          {
            "data-[orientation=horizontal]:w-auto":
              !hasLabel && inset && inset !== "none" && horizontal,
          },
          isFunctionProp(className) ? className(state) : className,
        )
      }
    >
      {hasLabel && (
        <SeparatorIconView
          labelAlign={labelAlign}
          buildLine={buildLine}
          id={id}
          labelClassName={labelClassName}
          labelIcon={labelIcon}
          labelIconPosition={labelIconPosition}
          label={label}
        />
      )}
    </SeparatorPrimitive>
  );
}

function useKiraSeparatorOptions({
  labelAlign: labelAlignInput,
  labelIconPosition: labelIconPositionInput,
  orientation: orientationInput,
  countLabel: countLabelInput,
  disabled: disabledInput,
  collapsible: collapsibleInput,
}: Parameters<typeof resolveKiraSeparatorOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraSeparatorOptions({
        labelAlign: labelAlignInput,
        labelIconPosition: labelIconPositionInput,
        orientation: orientationInput,
        countLabel: countLabelInput,
        disabled: disabledInput,
        collapsible: collapsibleInput,
      }),
    [
      labelAlignInput,
      labelIconPositionInput,
      orientationInput,
      countLabelInput,
      disabledInput,
      collapsibleInput,
    ],
  );
}

function useKiraSeparatorOptions2({
  defaultOpen: defaultOpenInput,
  keepMounted: keepMountedInput,
  motion: motionInput,
}: Parameters<typeof resolveKiraSeparatorOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveKiraSeparatorOptions2({
        defaultOpen: defaultOpenInput,
        keepMounted: keepMountedInput,
        motion: motionInput,
      }),
    [defaultOpenInput, keepMountedInput, motionInput],
  );
}

function useSeparatorOptions({
  orientation: orientationInput,
  lineStyle: lineStyleInput,
  color: colorInput,
  labelAlign: labelAlignInput,
  labelIconPosition: labelIconPositionInput,
  decorative: decorativeInput,
}: Parameters<typeof resolveSeparatorOptions>[0]) {
  return React.useMemo(
    () =>
      resolveSeparatorOptions({
        orientation: orientationInput,
        lineStyle: lineStyleInput,
        color: colorInput,
        labelAlign: labelAlignInput,
        labelIconPosition: labelIconPositionInput,
        decorative: decorativeInput,
      }),
    [
      orientationInput,
      lineStyleInput,
      colorInput,
      labelAlignInput,
      labelIconPositionInput,
      decorativeInput,
    ],
  );
}

function renderKiraSeparatorLine(
  {
    orientation,
    size,
    lineStyle,
    color,
    gradient,
    horizontal,
    lineClassName,
  }: CreateSeparatorContentParams,
  position: "start" | "end",
) {
  return (
    <Separator
      key={position}
      decorative
      orientation={orientation}
      size={size}
      lineStyle={lineStyle}
      color={color}
      gradient={gradient}
      data-slot="kira-separator-line"
      className={cn(
        "min-w-4 flex-1",
        horizontal ? "data-[orientation=horizontal]:w-auto" : "min-h-4",
        lineClassName,
      )}
    />
  );
}

function KiraSeparatorControl({
  collapsible,
  disabled,
  reason,
  id,
  details,
  action,
  isDisabled,
  buildLabel,
}: CreateSeparatorContentParams & { buildLabel: () => React.JSX.Element }) {
  return collapsible ? (
    <div
      data-slot="kira-separator-trigger-proxy"
      role={disabled && reason ? "group" : undefined}
      tabIndex={disabled && reason ? 0 : undefined}
      aria-labelledby={disabled && reason ? id + "-label" : undefined}
      aria-describedby={disabled && reason ? details : undefined}
      className="min-w-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      <CollapsibleTrigger
        data-slot="kira-separator-trigger"
        size="xs"
        showArrow
        disabled={disabled}
        aria-describedby={details}
        className="h-auto min-h-8 w-auto max-w-full flex-wrap px-2 py-1 text-start focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        {buildLabel()}
      </CollapsibleTrigger>
    </div>
  ) : (
    <KiraSeparatorContentView
      buildLabel={buildLabel}
      action={action}
      isDisabled={isDisabled}
      reason={reason}
      details={details}
    />
  );
}

function createSeparatorContent(options: CreateSeparatorContentParams) {
  const { id, horizontal, labelAlign, description, isDisabled, reason } =
    options;

  const buildLabel = () => <KiraSeparatorIconView {...options} />;

  const buildLine = (position: "start" | "end") =>
    renderKiraSeparatorLine(options, position);

  const buildControl = () => (
    <KiraSeparatorControl {...options} buildLabel={buildLabel} />
  );

  const buildBoundary = () => (
    <div
      data-slot="kira-separator-boundary"
      className={cn(
        "flex min-w-0 items-center gap-3",
        horizontal ? "w-full" : "h-full flex-col",
      )}
    >
      {labelAlign !== "start" && buildLine("start")}
      {buildControl()}
      {labelAlign !== "end" && buildLine("end")}
    </div>
  );

  const buildDetails = () => (
    <>
      {description != null && (
        <div
          id={id + "-description"}
          data-slot="kira-separator-description"
          className="mt-2 wrap-anywhere text-xs text-muted-foreground"
        >
          {description}
        </div>
      )}
      {isDisabled && reason && (
        <p
          id={id + "-reason"}
          data-slot="kira-separator-reason"
          className="mt-2 wrap-anywhere text-xs text-muted-foreground"
        >
          {reason}
        </p>
      )}
    </>
  );

  return { buildBoundary, buildDetails } satisfies {
    buildBoundary: typeof buildBoundary;
    buildDetails: typeof buildDetails;
  };
}

type CreateSeparatorContentParams = {
  id: string;
  labelClassName: KiraSeparatorProps["labelClassName"];
  labelIcon: KiraSeparatorProps["labelIcon"];
  labelIconPosition: "left" | "right";
  label: KiraSeparatorProps["label"];
  validCount: number | undefined;
  countLabel: string;
  orientation: "horizontal" | "vertical";
  size: KiraSeparatorProps["size"];
  lineStyle: KiraSeparatorProps["lineStyle"];
  color: KiraSeparatorProps["color"];
  gradient: KiraSeparatorProps["gradient"];
  horizontal: boolean;
  lineClassName: KiraSeparatorProps["lineClassName"];
  collapsible: boolean;
  disabled: boolean;
  reason: string | undefined;
  details: string | undefined;
  action: KiraSeparatorProps["action"];
  isDisabled: boolean;
  labelAlign: "center" | "start" | "end";
  description: KiraSeparatorProps["description"];
};
