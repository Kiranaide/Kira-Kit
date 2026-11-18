"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { IconCheck, IconMinus, IconLoader } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { isFunctionProp } from "@/components/ui/prop-guards";

gsap.registerPlugin(useGSAP);

// -----------------------------------------------------------------------------
// Styling
// -----------------------------------------------------------------------------

type CheckboxSize = "sm" | "default" | "lg";

type CheckboxVariant = "default" | "outline" | "filled" | "soft";

type CheckboxColor = "default" | "success" | "destructive" | "warning";

const checkboxVariants = cva(
  cn(
    // `after:` expands the hit area beyond the visual box (WCAG 2.5.8).
    // No overflow-hidden here, or the expanded target gets clipped.
    "peer relative inline-flex shrink-0 items-center justify-center border p-0 shadow-sm outline-none",
    "after:absolute after:-inset-2 after:content-['']",
    // Colors only. Never transition `transform`/`scale`: the press pop owns it.
    "transition-[color,background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
    // Root is a <span> by default, so use data-disabled (not :disabled).
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    // Single error path: `error` prop and Field both set aria-invalid.
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "aria-invalid:marked:border-destructive aria-invalid:marked:bg-destructive aria-invalid:marked:text-destructive-foreground",
  ),
  {
    variants: {
      variant: {
        default:
          "border-primary bg-transparent hover:border-primary/80 marked:border-primary marked:bg-primary marked:text-primary-foreground",
        outline:
          "border-2 border-input bg-transparent hover:bg-muted/50 marked:border-primary marked:bg-primary/10 marked:text-primary",
        filled:
          "border-transparent bg-muted hover:bg-muted/80 marked:border-primary marked:bg-primary marked:text-primary-foreground",
        soft: "border-transparent bg-primary/20 hover:bg-primary/30 marked:bg-primary marked:text-primary-foreground",
      },
      color: {
        default: "",
        success:
          "marked:border-success marked:bg-success marked:text-success-foreground marked:hover:bg-success/90",
        destructive:
          "marked:border-destructive marked:bg-destructive marked:text-destructive-foreground marked:hover:bg-destructive/90",
        warning:
          "marked:border-warning marked:bg-warning marked:text-warning-foreground marked:hover:bg-warning/90",
      },
      size: {
        sm: "size-4 rounded-sm [&_svg]:size-3",
        // kira-kit-ignore spacing-scale: check glyph fits the 20px box optically
        default: "size-5 rounded-sm [&_svg]:size-3.5",
        lg: "size-6 rounded-md [&_svg]:size-4",
      },
    },
    // Checked-hover tints only for the default color, so colored
    // checkboxes don't flash primary on hover.
    compoundVariants: [
      {
        variant: "default",
        color: "default",
        className: "marked:hover:bg-primary/90",
      },
      {
        variant: "outline",
        color: "default",
        className: "marked:hover:bg-primary/15",
      },
      {
        variant: "filled",
        color: "default",
        className: "marked:hover:bg-primary/90",
      },
      {
        variant: "soft",
        color: "default",
        className: "marked:hover:bg-primary",
      },
    ],
    defaultVariants: { variant: "default", color: "default", size: "default" },
  },
);

const rippleColor: Record<CheckboxColor, string> = {
  default: "bg-primary/30",
  success: "bg-success/30",
  destructive: "bg-destructive/30",
  warning: "bg-warning/30",
};

const rippleRadius: Record<CheckboxSize, string> = {
  sm: "rounded-sm",
  default: "rounded-sm",
  lg: "rounded-md",
};

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) {
      if (isFunctionProp(ref)) ref(node);
      else if (ref) ref.current = node;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

const joinIds = (...ids: (string | false | null | undefined)[]) =>
  ids.filter(Boolean).join(" ") || undefined;

// -----------------------------------------------------------------------------
// Checkbox
// -----------------------------------------------------------------------------

type CheckedChangeDetails = CheckboxPrimitive.Root.ChangeEventDetails;

interface CheckboxProps extends Omit<
  CheckboxPrimitive.Root.Props,
  "checked" | "onCheckedChange" | "defaultChecked" | "indeterminate" | "color"
> {
  /** `true` / `false` / `"indeterminate"`. Omit for uncontrolled (see `defaultChecked`). */
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  /** Base UI only ever emits booleans; indeterminate is input-only. */
  onCheckedChange?: (
    checked: boolean,
    eventDetails: CheckedChangeDetails,
  ) => void;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  color?: CheckboxColor;
  customIcon?: React.ReactNode;
  /** Spinner overlay; blocks toggling but keeps focus (readOnly, not disabled). */
  loading?: boolean;
  error?: boolean;
  /** When disabled, shown in a tooltip and exposed to screen readers. */
  disabledReason?: React.ReactNode;
  /** Class for the outer wrapper (the ripple + box container). */
  wrapperClassName?: string;
}

function Checkbox({
  className,
  wrapperClassName,
  checked,
  defaultChecked,
  size: sizeInput,
  variant: variantInput,
  color: colorInput,
  customIcon,
  loading: loadingInput,
  error: errorInput,
  disabled,
  disabledReason,
  readOnly,
  ref,
  ...props
}: CheckboxProps) {
  const { size, variant, color, loading, error } = useCheckboxOptions({
    size: sizeInput,
    variant: variantInput,
    color: colorInput,
    loading: loadingInput,
    error: errorInput,
  });

  const boxRef = React.useRef<HTMLElement | null>(null);
  const rippleRef = React.useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef<HTMLElement>(boxRef, ref);
  const scopeRef = React.useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP({ scope: scopeRef });
  const reasonId = React.useId();
  const showReason = Boolean(disabled && disabledReason);

  // Split the public tri-state prop at the boundary; Base UI owns the state.
  const indeterminate = checked === "indeterminate" ? true : undefined;

  const controlledChecked =
    checked === undefined ? undefined : checked === true;

  const animateToggle = () =>
    contextSafe(() => checkboxContextSafe(rippleRef, boxRef))();

  const handleChange = (next: boolean, details: CheckedChangeDetails) => {
    animateToggle();
    props.onCheckedChange?.(next, details);
  };

  const box = (
    <CheckboxBoxView
      scopeRef={scopeRef}
      wrapperClassName={wrapperClassName}
      rippleRef={rippleRef}
      size={size}
      error={error}
      color={color}
      props={props}
      mergedRef={mergedRef}
      controlledChecked={controlledChecked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      disabled={disabled}
      readOnly={readOnly}
      loading={loading}
      showReason={showReason}
      reasonId={reasonId}
      handleChange={handleChange}
      variant={variant}
      className={className}
      customIcon={customIcon}
      disabledReason={disabledReason}
    />
  );

  return showReason ? (
    <SimpleTooltip content={disabledReason}>{box}</SimpleTooltip>
  ) : (
    box
  );
}

// -----------------------------------------------------------------------------
// CheckboxWithLabel — sibling label, so render a native button (per docs)
// -----------------------------------------------------------------------------

interface CheckboxWithLabelProps extends CheckboxProps {
  label: string;
  description?: string;
  labelPlacement?: "right" | "left";
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
  const checkboxId = id ?? generatedId;
  const descriptionId = `${checkboxId}-description`;
  const inactive = props.disabled || props.readOnly;

  const text = (
    // kira-kit-ignore spacing-scale: label/description micro-stack uses the helper-text gap tier
    <div className="flex flex-col gap-0.5">
      <label
        htmlFor={checkboxId}
        id={`${checkboxId}-label`}
        className={cn("cursor-pointer text-sm font-medium leading-none", {
          "cursor-not-allowed opacity-70": inactive,
        })}
      >
        {label}
      </label>
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div
      data-slot="checkbox-with-label"
      className={cn("flex items-start gap-2", wrapperClassName)}
    >
      {labelPlacement === "left" && text}
      <Checkbox
        nativeButton
        render={
          <button type="button" aria-labelledby={`${checkboxId}-label`} />
        }
        {...props}
        id={checkboxId}
        aria-describedby={joinIds(
          props["aria-describedby"],
          description && descriptionId,
        )}
      />
      {labelPlacement === "right" && text}
    </div>
  );
}

// -----------------------------------------------------------------------------
// CheckboxGroup — always controlled internally (required for `parent`)
// -----------------------------------------------------------------------------

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
  onChange?: (
    value: string[],
    eventDetails: CheckboxGroupPrimitive.ChangeEventDetails,
  ) => void;
  /** Shared form field name; each checked option submits its `value`. */
  name?: string;
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

function CheckboxGroup(arg0: CheckboxGroupProps) {
  const model = useCheckboxGroupModel(arg0);

  return <CheckboxGroupView {...model} />;
}

// -----------------------------------------------------------------------------
// CheckboxCard — enclosing label (default <span> root is correct here)
// -----------------------------------------------------------------------------

interface CheckboxCardProps extends Omit<CheckboxProps, "customIcon"> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  /** `false` hides the box visually; it stays focusable and toggles the card. */
  showIndicator?: boolean;
  /** Optimistic mode: the box flips immediately, `onCommit` runs async,
   *  `onCheckedChange` fires only after success; rejection reverts and toasts.
   *  Requires a controlled `checked`. Re-toggling is blocked while pending. */
  optimistic?: boolean;
  // oxlint-disable-next-line anti-slop/no-unknown-returns -- Consumer commit callbacks may resolve any value; this library intentionally awaits and ignores that result.
  onCommit?: (checked: boolean) => Promise<unknown>;
  /** Toast title when `onCommit` rejects. */
  commitErrorTitle?: React.ReactNode;
}

function CheckboxCard({
  label,
  description,
  icon,
  size: sizeInput,
  variant: variantInput,
  showIndicator: showIndicatorInput,
  error: errorInput,
  checked,
  onCheckedChange,
  optimistic: optimisticInput,
  onCommit,
  commitErrorTitle,
  disabled: disabledInput,
  disabledReason,
  readOnly,
  className,
  id,
  ...checkboxProps
}: CheckboxCardProps) {
  const { size, variant, showIndicator, error, optimistic, disabled } =
    useCheckboxCardOptions({
      size: sizeInput,
      variant: variantInput,
      showIndicator: showIndicatorInput,
      error: errorInput,
      optimistic: optimisticInput,
      disabled: disabledInput,
    });

  const resolvePadding1 = () => checkboxResolvePadding1(size);

  const generatedId = React.useId();
  const reasonId = React.useId();
  const showReason = Boolean(disabled && disabledReason);

  const { pending, handleChange } = useCheckboxCardCommit({
    optimistic,
    onCommit,
    checked,
    onCheckedChange,
    commitErrorTitle,
  });

  const shownChecked = pending ?? checked;
  const padding = resolvePadding1();

  // <label> only allows phrasing content, so spans (display:block) not divs/p.
  const card = (
    <CheckboxCardView
      disabled={disabled}
      error={error}
      padding={padding}
      className={className}
      checkboxProps={checkboxProps}
      id={id}
      generatedId={generatedId}
      size={size}
      variant={variant}
      shownChecked={shownChecked}
      handleChange={handleChange}
      readOnly={readOnly}
      pending={pending}
      showReason={showReason}
      reasonId={reasonId}
      showIndicator={showIndicator}
      icon={icon}
      label={label}
      description={description}
    />
  );

  if (!showReason) return card;

  return (
    <>
      <SimpleTooltip content={disabledReason}>{card}</SimpleTooltip>
      {/* Outside the label so it isn't folded into the accessible name. */}
      <span id={reasonId} className="sr-only">
        {disabledReason}
      </span>
    </>
  );
}

function useCheckboxCardCommit({
  optimistic,
  onCommit,
  checked,
  onCheckedChange,
  commitErrorTitle,
}: Pick<
  CheckboxCardProps,
  "optimistic" | "onCommit" | "checked" | "onCheckedChange" | "commitErrorTitle"
>) {
  const [pending, setPending] = React.useState<boolean | null>(null);

  const handleChange = (next: boolean, details: CheckedChangeDetails) => {
    if (!optimistic || onCommit === undefined || checked === undefined) {
      onCheckedChange?.(next, details);

      return;
    }

    setPending(next);
    onCommit(next).then(
      () => {
        setPending(null);
        onCheckedChange?.(next, details);
      },
      () => {
        // Clearing the pending value restores the parent's committed value.
        setPending(null);
        toast.error(commitErrorTitle ?? "Couldn't save that", {
          description: "The change was reverted.",
        });
      },
    );
  };

  return { pending, handleChange };
}

// -----------------------------------------------------------------------------
// KiraCheckbox
// -----------------------------------------------------------------------------

type KiraCheckboxProps =
  | ({ mode?: "checkbox" } & CheckboxProps)
  | ({ mode: "label" } & CheckboxWithLabelProps)
  | ({ mode: "card" } & CheckboxCardProps)
  | ({ mode: "group" } & CheckboxGroupProps);

function KiraCheckbox(props: KiraCheckboxProps) {
  switch (props.mode) {
    case "label": {
      const { mode: _, ...rest } = props;

      return <CheckboxWithLabel {...rest} />;
    }

    case "card": {
      const { mode: _, ...rest } = props;

      return <CheckboxCard {...rest} />;
    }

    case "group": {
      const { mode: _, ...rest } = props;

      return <CheckboxGroup {...rest} />;
    }

    default: {
      // SAFETY: label/card/group modes are consumed above; the residual union
      // member is `{ mode?: "checkbox" } & CheckboxProps` by exhaustion.
      const { mode: _, ...rest } = props as {
        mode?: "checkbox";
      } & CheckboxProps;

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

function resolveCheckboxOptions({
  size = "default",
  variant = "default",
  color = "default",
  loading = false,
  error = false,
}: {
  size?: CheckboxProps["size"];
  variant?: CheckboxProps["variant"];
  color?: CheckboxProps["color"];
  loading?: CheckboxProps["loading"];
  error?: CheckboxProps["error"];
}) {
  return { size, variant, color, loading, error };
}

function resolveCheckboxGroupOptions({
  showSelectAll = false,
  selectAllLabel = "Select all",
  showProgress = false,
  orientation = "vertical",
  size = "default",
  variant = "default",
}: {
  showSelectAll?: CheckboxGroupProps["showSelectAll"];
  selectAllLabel?: CheckboxGroupProps["selectAllLabel"];
  showProgress?: CheckboxGroupProps["showProgress"];
  orientation?: CheckboxGroupProps["orientation"];
  size?: CheckboxGroupProps["size"];
  variant?: CheckboxGroupProps["variant"];
}) {
  return {
    showSelectAll,
    selectAllLabel,
    showProgress,
    orientation,
    size,
    variant,
  };
}

function resolveCheckboxGroupOptions2({
  color = "default",
  disabled = false,
  error = false,
}: {
  color?: CheckboxGroupProps["color"];
  disabled?: CheckboxGroupProps["disabled"];
  error?: CheckboxGroupProps["error"];
}) {
  return { color, disabled, error };
}

function resolveCheckboxCardOptions({
  size = "default",
  variant = "outline",
  showIndicator = true,
  error = false,
  optimistic = false,
  disabled = false,
}: {
  size?: CheckboxCardProps["size"];
  variant?: CheckboxCardProps["variant"];
  showIndicator?: CheckboxCardProps["showIndicator"];
  error?: CheckboxCardProps["error"];
  optimistic?: CheckboxCardProps["optimistic"];
  disabled?: CheckboxCardProps["disabled"];
}) {
  return { size, variant, showIndicator, error, optimistic, disabled };
}

function CheckboxIndicatorView({
  loading,
  customIcon,
}: {
  loading: boolean;
  customIcon: React.ReactNode;
}) {
  return (
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className={cn(
        "group/ind flex items-center justify-center text-current",
        "transition-[scale,opacity] duration-150 ease-out motion-reduce:transition-none",
        "data-starting-style:scale-0 data-starting-style:opacity-0",
        "data-ending-style:scale-0 data-ending-style:opacity-0",
        { invisible: loading },
      )}
    >
      {customIcon ?? (
        <>
          <IconMinus
            strokeWidth={3}
            className="hidden group-data-indeterminate/ind:block"
          />
          <IconCheck
            strokeWidth={3}
            className="group-data-indeterminate/ind:hidden"
          />
        </>
      )}
    </CheckboxPrimitive.Indicator>
  );
}

function useCheckboxGroupModel({
  options,
  value,
  defaultValue,
  onChange,
  name,
  label,
  description,
  showSelectAll: showSelectAllInput,
  selectAllLabel: selectAllLabelInput,
  showProgress: showProgressInput,
  orientation: orientationInput,
  size: sizeInput,
  variant: variantInput,
  color: colorInput,
  className,
  disabled: disabledInput,
  error: errorInput,
}: CheckboxGroupProps) {
  const {
    showSelectAll,
    selectAllLabel,
    showProgress,
    orientation,
    size,
    variant,
  } = useCheckboxGroupOptions({
    showSelectAll: showSelectAllInput,
    selectAllLabel: selectAllLabelInput,
    showProgress: showProgressInput,
    orientation: orientationInput,
    size: sizeInput,
    variant: variantInput,
  });

  const { color, disabled, error } = useCheckboxGroupOptions2({
    color: colorInput,
    disabled: disabledInput,
    error: errorInput,
  });

  const labelId = React.useId();
  const descriptionId = React.useId();
  const allValues = React.useMemo(() => options.map((o) => o.value), [options]);

  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const selectedCount = current.filter((v) => allValues.includes(v)).length;

  const handleValueChange = (
    next: string[],
    details: CheckboxGroupPrimitive.ChangeEventDetails,
  ) => {
    if (!isControlled) setInternal(next);
    onChange?.(next, details);
  };

  const shared = { size, variant, color, error } as const;

  return {
    label,
    labelId,
    description,
    descriptionId,
    current,
    handleValueChange,
    allValues,
    disabled,
    className,
    showProgress,
    selectedCount,
    showSelectAll,
    selectAllLabel,
    shared,
    orientation,
    options,
    name,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function CheckboxGroupView({
  label,
  labelId,
  description,
  descriptionId,
  current,
  handleValueChange,
  allValues,
  disabled,
  className,
  showProgress,
  selectedCount,
  showSelectAll,
  selectAllLabel,
  shared,
  orientation,
  options,
  name,
}: ReturnType<typeof useCheckboxGroupModel>) {
  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      value={current}
      onValueChange={handleValueChange}
      allValues={allValues}
      disabled={disabled}
      className={cn("flex flex-col gap-2", className)}
    >
      {(label || description) && (
        // kira-kit-ignore spacing-scale: label/description micro-stack uses the helper-text gap tier
        <div className="flex flex-col gap-0.5">
          {label && (
            <span id={labelId} className="text-sm font-medium leading-none">
              {label}
            </span>
          )}
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {showProgress && (
        <p
          data-slot="checkbox-group-progress"
          aria-live="polite"
          className="text-xs tabular-nums text-muted-foreground"
        >
          {selectedCount}/{allValues.length} selected
        </p>
      )}

      {showSelectAll && (
        <CheckboxWithLabel
          parent
          label={selectAllLabel}
          disabled={disabled}
          wrapperClassName="border-b border-border pb-2"
          {...shared}
        />
      )}

      <div
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {options.map((option) => (
          <CheckboxWithLabel
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={disabled || option.disabled}
            {...shared}
          />
        ))}
      </div>
    </CheckboxGroupPrimitive>
  );
}

function useCheckboxOptions({
  size: sizeInput,
  variant: variantInput,
  color: colorInput,
  loading: loadingInput,
  error: errorInput,
}: Parameters<typeof resolveCheckboxOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCheckboxOptions({
        size: sizeInput,
        variant: variantInput,
        color: colorInput,
        loading: loadingInput,
        error: errorInput,
      }),
    [sizeInput, variantInput, colorInput, loadingInput, errorInput],
  );
}

function useCheckboxCardOptions({
  size: sizeInput,
  variant: variantInput,
  showIndicator: showIndicatorInput,
  error: errorInput,
  optimistic: optimisticInput,
  disabled: disabledInput,
}: Parameters<typeof resolveCheckboxCardOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCheckboxCardOptions({
        size: sizeInput,
        variant: variantInput,
        showIndicator: showIndicatorInput,
        error: errorInput,
        optimistic: optimisticInput,
        disabled: disabledInput,
      }),
    [
      sizeInput,
      variantInput,
      showIndicatorInput,
      errorInput,
      optimisticInput,
      disabledInput,
    ],
  );
}

function useCheckboxGroupOptions({
  showSelectAll: showSelectAllInput,
  selectAllLabel: selectAllLabelInput,
  showProgress: showProgressInput,
  orientation: orientationInput,
  size: sizeInput,
  variant: variantInput,
}: Parameters<typeof resolveCheckboxGroupOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCheckboxGroupOptions({
        showSelectAll: showSelectAllInput,
        selectAllLabel: selectAllLabelInput,
        showProgress: showProgressInput,
        orientation: orientationInput,
        size: sizeInput,
        variant: variantInput,
      }),
    [
      showSelectAllInput,
      selectAllLabelInput,
      showProgressInput,
      orientationInput,
      sizeInput,
      variantInput,
    ],
  );
}

function useCheckboxGroupOptions2({
  color: colorInput,
  disabled: disabledInput,
  error: errorInput,
}: Parameters<typeof resolveCheckboxGroupOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveCheckboxGroupOptions2({
        color: colorInput,
        disabled: disabledInput,
        error: errorInput,
      }),
    [colorInput, disabledInput, errorInput],
  );
}

function checkboxContextSafe(
  rippleRef: React.RefObject<HTMLSpanElement | null>,
  boxRef: React.RefObject<HTMLElement | null>,
) {
  if (prefersReducedMotion()) return;

  if (rippleRef.current) {
    gsap.fromTo(
      rippleRef.current,
      { scale: 0.5, opacity: 0.3 },
      {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
        overwrite: true,
        clearProps: "transform,opacity", // hand back to scale-0/opacity-0 classes
      },
    );
  }

  if (boxRef.current) {
    gsap.fromTo(
      boxRef.current,
      { scale: 0.9 },
      {
        scale: 1,
        duration: 0.12,
        ease: "power2.out",
        overwrite: true,
        clearProps: "transform",
      },
    );
  }
}

function checkboxResolvePadding1(size: CheckboxSize) {
  if (size === "sm") {
    return "p-3" as const;
  }

  if (size === "lg") {
    return "p-5" as const;
  }

  return "p-4" as const;
}

type CheckboxBoxViewProps = {
  scopeRef: React.RefObject<HTMLSpanElement | null>;
  wrapperClassName: CheckboxProps["wrapperClassName"];
  rippleRef: React.RefObject<HTMLSpanElement | null>;
  size: CheckboxSize;
  error: boolean;
  color: CheckboxColor;
  props: Omit<
    CheckboxProps,
    | "className"
    | "wrapperClassName"
    | "checked"
    | "defaultChecked"
    | "size"
    | "variant"
    | "color"
    | "customIcon"
    | "loading"
    | "error"
    | "disabled"
    | "disabledReason"
    | "readOnly"
    | "ref"
  >;
  mergedRef: (node: HTMLElement | null) => void;
  controlledChecked: boolean | undefined;
  defaultChecked: CheckboxProps["defaultChecked"];
  indeterminate: true | undefined;
  disabled: CheckboxProps["disabled"];
  readOnly: CheckboxProps["readOnly"];
  loading: boolean;
  showReason: boolean;
  reasonId: string;
  handleChange: (next: boolean, details: CheckedChangeDetails) => void;
  variant: CheckboxVariant;
  className: CheckboxProps["className"];
  customIcon: CheckboxProps["customIcon"];
  disabledReason: CheckboxProps["disabledReason"];
};

function CheckboxBoxView({
  scopeRef,
  wrapperClassName,
  rippleRef,
  size,
  error,
  color,
  props,
  mergedRef,
  controlledChecked,
  defaultChecked,
  indeterminate,
  disabled,
  readOnly,
  loading,
  showReason,
  reasonId,
  handleChange,
  variant,
  className,
  customIcon,
  disabledReason,
}: CheckboxBoxViewProps) {
  return (
    <span
      ref={scopeRef}
      data-slot="checkbox-wrapper"
      className={cn("relative inline-flex", wrapperClassName)}
    >
      <span
        ref={rippleRef}
        aria-hidden
        data-slot="checkbox-ripple"
        className={cn(
          "pointer-events-none absolute inset-0 scale-0 opacity-0",
          rippleRadius[size],
          rippleColor[error ? "destructive" : color],
        )}
      />
      <CheckboxPrimitive.Root
        {...props}
        ref={mergedRef}
        data-slot="checkbox"
        checked={controlledChecked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        readOnly={readOnly || loading}
        aria-busy={loading || undefined}
        {...(error && { "aria-invalid": true })}
        aria-describedby={joinIds(
          props["aria-describedby"],
          showReason && reasonId,
        )}
        onCheckedChange={handleChange}
        className={cn(checkboxVariants({ variant, color, size }), className)}
      >
        <CheckboxIndicatorView loading={loading} customIcon={customIcon} />

        {loading && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconLoader
              strokeWidth={3}
              className="animate-spin motion-reduce:animate-none"
            />
          </span>
        )}
      </CheckboxPrimitive.Root>

      {showReason && (
        <span id={reasonId} className="sr-only">
          {disabledReason}
        </span>
      )}
    </span>
  );
}

type CheckboxCardViewProps = {
  disabled: boolean;
  error: boolean;
  padding: "p-3" | "p-5" | "p-4";
  className: CheckboxCardProps["className"];
  checkboxProps: Omit<
    CheckboxCardProps,
    | "label"
    | "description"
    | "icon"
    | "size"
    | "variant"
    | "showIndicator"
    | "error"
    | "checked"
    | "onCheckedChange"
    | "optimistic"
    | "onCommit"
    | "commitErrorTitle"
    | "disabled"
    | "disabledReason"
    | "readOnly"
    | "className"
    | "id"
  >;
  id: CheckboxCardProps["id"];
  generatedId: string;
  size: CheckboxSize;
  variant: CheckboxVariant;
  shownChecked: boolean | "indeterminate" | undefined;
  handleChange: (next: boolean, details: CheckedChangeDetails) => void;
  readOnly: CheckboxCardProps["readOnly"];
  pending: boolean | null;
  showReason: boolean;
  reasonId: string;
  showIndicator: boolean;
  icon: CheckboxCardProps["icon"];
  label: CheckboxCardProps["label"];
  description: CheckboxCardProps["description"];
};

function CheckboxCardView({
  disabled,
  error,
  padding,
  className,
  checkboxProps,
  id,
  generatedId,
  size,
  variant,
  shownChecked,
  handleChange,
  readOnly,
  pending,
  showReason,
  reasonId,
  showIndicator,
  icon,
  label,
  description,
}: CheckboxCardViewProps) {
  return (
    <label
      data-slot="checkbox-card"
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      className={cn(
        "group relative flex cursor-pointer items-start gap-2 rounded-lg border-2 border-input bg-transparent",
        "transition-[background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
        "hover:bg-muted/50",
        "has-data-checked:border-primary has-data-checked:bg-primary/5 has-data-checked:ring-1 has-data-checked:ring-primary/40",
        "has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent",
        "data-error:border-destructive",
        padding,
        className,
      )}
    >
      <Checkbox
        {...checkboxProps}
        id={id ?? generatedId}
        size={size}
        variant={variant}
        error={error}
        checked={shownChecked}
        onCheckedChange={handleChange}
        disabled={disabled}
        readOnly={readOnly || pending !== null}
        aria-busy={pending !== null || undefined}
        aria-describedby={joinIds(
          checkboxProps["aria-describedby"],
          showReason && reasonId,
        )}
        wrapperClassName={showIndicator ? "mt-0.5 shrink-0" : "sr-only"}
      />
      {icon && (
        <span
          data-slot="checkbox-card-icon"
          className="block shrink-0 text-muted-foreground transition-colors group-has-data-checked:text-primary"
        >
          {icon}
        </span>
      )}
      <span className="block min-w-0 flex-1">
        <span className="block select-none text-sm font-medium">{label}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
