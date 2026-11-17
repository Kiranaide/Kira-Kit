"use client";

import * as React from "react";
import { omitComponentProps } from "@/lib/component-native-props";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isCallbackProp } from "@/lib/component-prop-guards";

function mergeClassName<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  return isCallbackProp(className)
    ? (state: State) => cn(base, className(state))
    : cn(base, className);
}

const joinIds = (...ids: (string | undefined | false)[]) =>
  ids.filter(Boolean).join(" ") || undefined;

const radioGroupVariants = cva("min-w-0 gap-2", {
  variants: {
    orientation: {
      horizontal: "flex flex-wrap items-start gap-x-4 gap-y-2",
      vertical: "grid",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

interface RadioGroupProps<Value = string>
  extends
    RadioGroupPrimitive.Props<Value>,
    VariantProps<typeof radioGroupVariants> {
  "data-slot"?: string;
  error?: boolean;
  errorMessage?: React.ReactNode;
}

const RadioStyleContext = React.createContext<{
  invalid?: React.AriaAttributes["aria-invalid"];
  errorId?: string;
}>({});

function RadioGroup<Value = string>({
  className,
  orientation = "vertical",
  error = false,
  errorMessage,
  children,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
  ...props
}: RadioGroupProps<Value>) {
  const errorId = React.useId();
  const hasMessage = error && errorMessage != null;
  const invalid = ariaInvalid ?? (error || undefined);

  return renderRadioGroupSectionPart1({
    invalid,
    hasMessage,
    errorId,
    props,
    orientation,
    error,
    describedBy,
    className,
    children,
    errorMessage,
  });
}

const radioItemVariants = cva(
  "peer relative inline-flex shrink-0 items-center justify-center rounded-full border-2 bg-background outline-none touch-manipulation after:absolute after:-inset-2 after:content-[''] motion-safe:transition-colors motion-safe:duration-150 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-readonly:cursor-default aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-6",
      },
      color: {
        default: "border-input text-primary data-checked:border-primary",
        destructive:
          "border-input text-destructive data-checked:border-destructive",
        success: "border-input text-success data-checked:border-success",
        warning: "border-input text-warning data-checked:border-warning",
      },
    },
    defaultVariants: { size: "default", color: "default" },
  },
);

interface RadioGroupItemProps<Value = string>
  extends
    Omit<RadioPrimitive.Root.Props<Value>, "color">,
    VariantProps<typeof radioItemVariants> {}

const dotSizes = {
  sm: "size-1.5",
  default: "size-2",
  lg: "size-2.5",
};

function RadioGroupItem<Value = string>({
  className,
  size = "default",
  color = "default",
  children,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
  ...props
}: RadioGroupItemProps<Value>) {
  const group = React.useContext(RadioStyleContext);

  return (
    <RadioPrimitive.Root
      {...props}
      data-slot="radio-group-item"
      aria-invalid={ariaInvalid ?? group.invalid}
      aria-describedby={joinIds(describedBy, group.errorId)}
      className={mergeClassName<RadioPrimitive.Root.State>(
        radioItemVariants({ size, color }),
        className,
      )}
    >
      {children ?? (
        <RadioPrimitive.Indicator
          data-slot="radio-group-indicator"
          keepMounted
          className="flex size-full scale-100 items-center justify-center opacity-100 data-unchecked:scale-75 data-unchecked:opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]"
        >
          <span
            data-slot="radio-group-dot"
            aria-hidden="true"
            className={cn(
              "rounded-full bg-current",
              dotSizes[size ?? "default"],
            )}
          />
        </RadioPrimitive.Indicator>
      )}
    </RadioPrimitive.Root>
  );
}

interface RadioWithLabelProps<Value = string> extends Omit<
  RadioGroupItemProps<Value>,
  "className"
> {
  label: React.ReactNode;
  description?: React.ReactNode;
  disabledReason?: React.ReactNode;
  /** Class for the complete labeled option. */
  className?: string;
  /** Class for the radio control; also accepts native Base UI state functions. */
  itemClassName?: RadioGroupItemProps<Value>["className"];
}

function RadioWithLabel<Value = string>({
  label,
  description,
  disabledReason,
  disabled,
  className,
  itemClassName,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...props
}: RadioWithLabelProps<Value>) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  const reasonId = React.useId();
  const unavailable = disabled || disabledReason != null;

  return (
    <div data-slot="radio-with-label" className={cn("min-w-0", className)}>
      <label
        data-slot="radio-label"
        className="flex min-h-11 min-w-0 cursor-pointer items-start gap-3 py-2.5 has-data-disabled:cursor-not-allowed has-data-disabled:text-muted-foreground has-data-readonly:cursor-default"
      >
        <RadioGroupItem
          {...props}
          aria-labelledby={labelledBy ?? labelId}
          aria-describedby={joinIds(
            describedBy,
            description != null && descriptionId,
            disabledReason != null && reasonId,
          )}
          disabled={unavailable}
          className={mergeClassName<RadioPrimitive.Root.State>(
            "mt-0.5",
            itemClassName,
          )}
        />
        <span data-slot="radio-label-content" className="grid min-w-0 gap-1">
          <span
            id={labelId}
            data-slot="radio-label-text"
            className="text-sm font-medium leading-5 wrap-anywhere"
          >
            {label}
          </span>
          {description != null && (
            <span
              id={descriptionId}
              data-slot="radio-description"
              className="text-sm leading-5 text-muted-foreground wrap-anywhere"
            >
              {description}
            </span>
          )}
          {disabledReason != null && (
            <span
              id={reasonId}
              data-slot="radio-disabled-reason"
              className="text-sm leading-5 text-muted-foreground wrap-anywhere"
            >
              Unavailable: {disabledReason}
            </span>
          )}
        </span>
      </label>
    </div>
  );
}

const radioCardVariants = cva(
  "group/radio-card relative flex min-w-0 w-full cursor-pointer items-start gap-3 rounded-lg border border-input bg-background p-4 text-start outline-none touch-manipulation motion-safe:transition-colors motion-safe:duration-150 hover:border-primary/50 hover:bg-muted/50 active:bg-muted data-checked:border-primary data-checked:bg-primary/5 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:border-input data-disabled:hover:bg-background data-readonly:cursor-default aria-invalid:border-destructive",
);

interface RadioCardProps<Value = string> extends RadioPrimitive.Root
  .Props<Value> {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  metadata?: React.ReactNode;
  disabledReason?: React.ReactNode;
}

function RadioCard<Value = string>({
  label,
  description,
  icon,
  metadata,
  disabledReason,
  disabled,
  className,
  children,
  render,
  nativeButton,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: RadioCardProps<Value>) {
  const id = React.useId();
  const group = React.useContext(RadioStyleContext);

  const accessibilityProps = getRadioCardAccessibilityProps({
    id,
    labelledBy,
    describedBy,
    description,
    disabledReason,
    errorId: group.errorId,
    invalid: group.invalid,
    ariaInvalid,
  });

  return (
    <RadioPrimitive.Root
      {...props}
      id={props.id ?? `${id}-control`}
      data-slot="radio-card"
      disabled={disabled || disabledReason != null}
      nativeButton={nativeButton ?? render == null}
      render={
        render ?? (
          <button
            type="button"
            id={props.id ?? `${id}-control`}
            aria-labelledby={labelledBy ?? `${id}-label`}
          />
        )
      }
      {...accessibilityProps}
      className={mergeClassName<RadioPrimitive.Root.State>(
        radioCardVariants(),
        className,
      )}
    >
      {renderRadioCardContentPart2({
        id,
        label,
        metadata,
        description,
        disabledReason,
        children,
      })}
      {renderRadioCardIndicator(icon)}
    </RadioPrimitive.Root>
  );
}

function renderRadioCardIndicator(icon: React.ReactNode) {
  return (
    <>
      {icon != null && (
        <span
          data-slot="radio-card-icon"
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-muted-foreground group-data-checked/radio-card:text-primary [&_svg]:size-5"
        >
          {icon}
        </span>
      )}
      <span
        data-slot="radio-card-control"
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-input text-primary motion-safe:transition-colors motion-safe:duration-150 group-data-checked/radio-card:border-primary group-data-checked/radio-card:bg-primary group-data-checked/radio-card:text-primary-foreground"
      >
        <RadioPrimitive.Indicator
          data-slot="radio-card-indicator"
          keepMounted
          className="flex scale-100 items-center justify-center opacity-100 data-unchecked:scale-75 data-unchecked:opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]"
        >
          <IconCheck className="size-3.5" />
        </RadioPrimitive.Indicator>
      </span>
    </>
  );
}

function getRadioCardAccessibilityProps({
  id,
  labelledBy,
  describedBy,
  description,
  disabledReason,
  errorId,
  invalid,
  ariaInvalid,
}: {
  id: string;
  labelledBy?: string;
  describedBy?: string;
  description: React.ReactNode;
  disabledReason: React.ReactNode;
  errorId?: string;
  invalid?: React.AriaAttributes["aria-invalid"];
  ariaInvalid?: React.AriaAttributes["aria-invalid"];
}) {
  return {
    "aria-labelledby": labelledBy ?? `${id}-label`,
    "aria-describedby": joinIds(
      describedBy,
      description != null && `${id}-description`,
      disabledReason != null && `${id}-reason`,
      errorId,
    ),
    "aria-invalid": ariaInvalid ?? invalid,
  };
}

const radioButtonGroupVariants = cva(
  "relative isolate inline-flex w-fit max-w-full flex-wrap items-stretch gap-1 rounded-lg border border-border/60 bg-muted p-1",
  {
    variants: {
      size: { sm: "text-xs", default: "text-sm", lg: "text-base" },
    },
    defaultVariants: { size: "default" },
  },
);

type RadioSize = NonNullable<VariantProps<typeof radioItemVariants>["size"]>;

const RadioButtonStyleContext = React.createContext<{
  size: RadioSize;
  sliding: boolean;
}>({
  size: "default",
  sliding: false,
});

function RadioButtonGroupIndicator() {
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  React.useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const container = indicator?.parentElement;

    if (!indicator || !container) return;
    let positioned = false;

    const update = (animate: boolean) => {
      positioned = updateRadioButtonIndicator({
        indicator,
        container,
        animate,
        reducedMotion,
        positioned,
      });
    };

    const mutations = new MutationObserver(() => {
      update(true);
    });

    mutations.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-checked"],
    });
    const resize = new ResizeObserver(() => update(false));
    resize.observe(container);

    const handleVisibilityChange = () => update(false);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    for (const item of container.querySelectorAll('[data-slot="radio-button"]'))
      resize.observe(item);
    update(false);

    return () => {
      mutations.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gsap.killTweensOf(indicator);
    };
  }, [reducedMotion]);

  return (
    <span
      ref={indicatorRef}
      data-slot="radio-button-group-indicator"
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 origin-top-left rounded-md bg-background opacity-0 shadow-sm"
    />
  );
}

function updateRadioButtonIndicator({
  indicator,
  container,
  animate,
  reducedMotion,
  positioned,
}: {
  indicator: HTMLSpanElement;
  container: HTMLElement;
  animate: boolean;
  reducedMotion: boolean;
  positioned: boolean;
}) {
  const selected = container.querySelector<HTMLElement>(
    '[data-slot="radio-button"][data-checked]',
  );

  if (!selected || !selected.offsetWidth) {
    gsap.killTweensOf(indicator);
    gsap.set(indicator, { opacity: 0 });

    return false;
  }

  const parent = container.getBoundingClientRect();
  const target = selected.getBoundingClientRect();
  const previous = indicator.getBoundingClientRect();
  const parentScaleX = parent.width / container.offsetWidth || 1;
  const parentScaleY = parent.height / container.offsetHeight || 1;
  const x = (target.left - parent.left) / parentScaleX - container.clientLeft;
  const y = (target.top - parent.top) / parentScaleY - container.clientTop;

  gsap.killTweensOf(indicator);
  gsap.set(indicator, {
    width: target.width / parentScaleX,
    height: target.height / parentScaleY,
    opacity: 1,
  });

  if (
    positioned &&
    animate &&
    !reducedMotion &&
    document.visibilityState === "visible"
  ) {
    // Resize once, then interpolate transforms from the current visual box.
    // Rapid selections retarget the in-flight pill instead of queuing motion.
    gsap.fromTo(
      indicator,
      {
        x: (previous.left - parent.left) / parentScaleX - container.clientLeft,
        y: (previous.top - parent.top) / parentScaleY - container.clientTop,
        scaleX: previous.width / target.width,
        scaleY: previous.height / target.height,
      },
      {
        x,
        y,
        scaleX: 1,
        scaleY: 1,
        duration: 0.2,
        ease: "power3.out",
        overwrite: true,
      },
    );
  } else {
    gsap.set(indicator, { x, y, scaleX: 1, scaleY: 1 });
  }

  return true;
}

interface RadioButtonGroupProps<Value = string>
  extends
    Omit<RadioGroupProps<Value>, "orientation">,
    VariantProps<typeof radioButtonGroupVariants> {}

function RadioButtonGroup<Value = string>({
  className,
  size = "default",
  children,
  ...props
}: RadioButtonGroupProps<Value>) {
  return (
    <RadioButtonStyleContext.Provider
      value={{ size: size ?? "default", sliding: true }}
    >
      <RadioGroup
        {...props}
        data-slot="radio-button-group"
        orientation="horizontal"
        className={mergeClassName<RadioGroupPrimitive.State>(
          radioButtonGroupVariants({ size }),
          className,
        )}
      >
        <RadioButtonGroupIndicator />
        {children}
      </RadioGroup>
    </RadioButtonStyleContext.Provider>
  );
}

const radioButtonVariants = cva(
  "relative isolate z-10 inline-flex min-w-0 max-w-full cursor-pointer select-none items-center justify-center rounded-md font-medium text-muted-foreground outline-none touch-manipulation motion-safe:transition-colors motion-safe:duration-150 hover:text-foreground active:bg-background/70 data-checked:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-readonly:cursor-default aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
  {
    variants: {
      size: {
        sm: "min-h-11 px-2.5 py-1.5 text-xs sm:min-h-8",
        default: "min-h-11 px-3 py-2 text-sm sm:min-h-9",
        lg: "min-h-11 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
);

interface RadioButtonProps<Value = string>
  extends
    RadioPrimitive.Root.Props<Value>,
    VariantProps<typeof radioButtonVariants> {
  children: React.ReactNode;
}

function RadioButton<Value = string>({
  className,
  size,
  children,
  render,
  nativeButton,
  "aria-invalid": ariaInvalid,
  "aria-describedby": describedBy,
  ...props
}: RadioButtonProps<Value>) {
  const id = React.useId();
  const style = React.useContext(RadioButtonStyleContext);
  const group = React.useContext(RadioStyleContext);

  return (
    <RadioPrimitive.Root
      {...props}
      id={props.id ?? id}
      data-slot="radio-button"
      nativeButton={nativeButton ?? render == null}
      render={
        render ?? (
          <button type="button" id={props.id ?? id}>
            {children}
          </button>
        )
      }
      aria-invalid={ariaInvalid ?? group.invalid}
      aria-describedby={joinIds(describedBy, group.errorId)}
      className={mergeClassName<RadioPrimitive.Root.State>(
        radioButtonVariants({ size: size ?? style.size }),
        className,
      )}
    >
      {!style.sliding && (
        <RadioPrimitive.Indicator
          data-slot="radio-button-indicator"
          aria-hidden="true"
          keepMounted
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-background opacity-100 shadow-sm data-unchecked:opacity-0 motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
      )}
      <span data-slot="radio-button-label" className="min-w-0 wrap-anywhere">
        {children}
      </span>
    </RadioPrimitive.Root>
  );
}

interface KiraRadioOption<Value extends string | number = string> {
  value: Value;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  metadata?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  /** Content outside the radio, visible only while this option is checked. */
  details?: React.ReactNode;
}

interface KiraRadioGroupProps<
  Value extends string | number = string,
> extends Omit<RadioGroupProps<Value>, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  options: readonly KiraRadioOption<Value>[];
  layout?: "list" | "cards" | "segmented";
  size?: RadioSize;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  fieldProps?: Omit<
    FieldPrimitive.Root.Props,
    "children" | "name" | "disabled" | "invalid" | "className"
  >;
}

function KiraRadioGroup<Value extends string | number = string>(
  input0: KiraRadioGroupProps<Value>,
) {
  const state0 = useRadioGroupSetup<Value>(input0);
  const state1 = useRadioGroupActions<Value>(state0);

  return renderRadioGroup<Value>(state1);
}

export {
  KiraRadioGroup,
  RadioGroup,
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
  RadioButtonGroup,
  RadioButton,
  radioGroupVariants,
  radioItemVariants,
  radioCardVariants,
  radioButtonGroupVariants,
  radioButtonVariants,
};

export type {
  KiraRadioOption,
  KiraRadioGroupProps,
  RadioGroupProps,
  RadioGroupItemProps,
  RadioWithLabelProps,
  RadioCardProps,
  RadioButtonGroupProps,
  RadioButtonProps,
};

type renderRadioGroupSectionPart1Args<Value = string> = {
  invalid: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
  hasMessage: boolean;
  errorId: string;
  props: Omit<
    RadioGroupProps<Value>,
    | "className"
    | "orientation"
    | "error"
    | "errorMessage"
    | "children"
    | "aria-invalid"
    | "aria-describedby"
  >;
  orientation: Exclude<RadioGroupProps<Value>["orientation"], undefined>;
  error: Exclude<RadioGroupProps<Value>["error"], undefined>;
  describedBy: RadioGroupProps<Value>["aria-describedby"];
  className: RadioGroupProps<Value>["className"];
  children: RadioGroupProps<Value>["children"];
  errorMessage: RadioGroupProps<Value>["errorMessage"];
};

function renderRadioGroupSectionPart1<Value = string>({
  invalid,
  hasMessage,
  errorId,
  props,
  orientation,
  error,
  describedBy,
  className,
  children,
  errorMessage,
}: renderRadioGroupSectionPart1Args<Value>) {
  return (
    <RadioStyleContext.Provider
      value={{ invalid, errorId: hasMessage ? errorId : undefined }}
    >
      <div data-slot="radio-group-wrapper" className="min-w-0 space-y-2">
        <RadioGroupPrimitive
          {...props}
          data-slot={props["data-slot"] ?? "radio-group"}
          data-orientation={orientation}
          data-error={error || undefined}
          aria-invalid={invalid}
          aria-describedby={joinIds(describedBy, hasMessage && errorId)}
          className={mergeClassName<RadioGroupPrimitive.State>(
            radioGroupVariants({ orientation }),
            className,
          )}
        >
          {children}
        </RadioGroupPrimitive>
        {hasMessage && (
          <p
            data-slot="radio-group-error"
            id={errorId}
            className="flex items-start gap-2 text-sm text-destructive"
            role="alert"
          >
            <IconAlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span data-slot="radio-group-error-message">{errorMessage}</span>
          </p>
        )}
      </div>
    </RadioStyleContext.Provider>
  );
}

type renderRadioCardContentPart2Args<Value = string> = {
  id: string;
  label: RadioCardProps<Value>["label"];
  metadata: RadioCardProps<Value>["metadata"];
  description: RadioCardProps<Value>["description"];
  disabledReason: RadioCardProps<Value>["disabledReason"];
  children: RadioCardProps<Value>["children"];
};

function renderRadioCardContentPart2<Value = string>({
  id,
  label,
  metadata,
  description,
  disabledReason,
  children,
}: renderRadioCardContentPart2Args<Value>) {
  return (
    <span data-slot="radio-card-content" className="grid min-w-0 flex-1 gap-1">
      <span
        data-slot="radio-card-heading"
        className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1"
      >
        <span
          id={`${id}-label`}
          data-slot="radio-card-label"
          className="text-sm font-medium leading-5 wrap-anywhere"
        >
          {label}
        </span>
        {metadata != null && (
          <span
            data-slot="radio-card-metadata"
            className="text-xs font-medium text-muted-foreground tabular-nums wrap-anywhere"
          >
            {metadata}
          </span>
        )}
      </span>
      {description != null && (
        <span
          id={`${id}-description`}
          data-slot="radio-card-description"
          className="text-sm leading-5 text-muted-foreground wrap-anywhere"
        >
          {description}
        </span>
      )}
      {disabledReason != null && (
        <span
          id={`${id}-reason`}
          data-slot="radio-disabled-reason"
          className="text-sm leading-5 text-muted-foreground wrap-anywhere"
        >
          Unavailable: {disabledReason}
        </span>
      )}
      {children}
    </span>
  );
}

function renderRadioGroupSkeletonPart3() {
  return (
    <div
      data-slot="radio-group-skeleton"
      aria-hidden="true"
      className="grid w-full gap-3"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          data-slot="radio-skeleton-item"
          className="flex min-h-16 items-center gap-3 rounded-lg border border-border p-4"
        >
          <span className="size-5 shrink-0 rounded-full bg-muted" />
          <span className="grid w-full gap-2">
            <span className="h-3 w-1/2 rounded bg-muted" />
            <span className="h-3 w-3/4 rounded bg-muted" />
          </span>
        </div>
      ))}
    </div>
  );
}

type renderBuildSegmentSectionPart4Args<
  Value extends string | number = string,
> = {
  option: KiraRadioOption<Value>;
  size: RadioSize;
  id: string;
  index: number;
};

function renderBuildSegmentSectionPart4<
  Value extends string | number = string,
>({ option, size, id, index }: renderBuildSegmentSectionPart4Args<Value>) {
  return (
    <RadioButton
      key={option.value}
      value={option.value}
      size={size}
      disabled={option.disabled || option.disabledReason != null}
      aria-labelledby={`${id}-option-${index}`}
      aria-describedby={joinIds(
        option.description != null && `${id}-option-${index}-description`,
        option.disabledReason != null && `${id}-option-${index}-reason`,
      )}
      className="flex-1 basis-auto"
    >
      <span className="flex min-w-0 items-center justify-center gap-2">
        {option.icon != null && (
          <span aria-hidden="true" className="shrink-0 [&_svg]:size-4">
            {option.icon}
          </span>
        )}
        <span id={`${id}-option-${index}`} className="min-w-0 wrap-anywhere">
          {option.label}
        </span>
      </span>
    </RadioButton>
  );
}

type renderBuildSegmentDetailsSectionPart5Args<
  Value extends string | number = string,
> = {
  options: KiraRadioGroupProps<Value>["options"];
  selectedValue: Value | undefined;
  id: string;
};

function renderBuildSegmentDetailsSectionPart5<
  Value extends string | number = string,
>({
  options,
  selectedValue,
  id,
}: renderBuildSegmentDetailsSectionPart5Args<Value>) {
  return (
    <>
      {options.map(
        (option, index) =>
          (option.description != null ||
            option.metadata != null ||
            option.details != null) && (
            <section
              key={option.value}
              hidden={!Object.is(option.value, selectedValue)}
              data-slot="kira-radio-details"
              aria-labelledby={`${id}-option-${index}`}
              className="min-w-0 space-y-1 border-s-2 border-primary/30 ps-4 text-sm leading-6 wrap-anywhere motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150"
            >
              {option.description != null && (
                <p
                  id={`${id}-option-${index}-description`}
                  data-slot="radio-segment-description"
                  className="text-muted-foreground"
                >
                  {option.description}
                </p>
              )}
              {option.metadata != null && (
                <p
                  data-slot="radio-segment-metadata"
                  className="text-xs text-muted-foreground tabular-nums"
                >
                  {option.metadata}
                </p>
              )}
              {option.details}
            </section>
          ),
      )}
      {options.map(
        (option, index) =>
          option.disabledReason != null && (
            <p
              key={option.value}
              id={`${id}-option-${index}-reason`}
              data-slot="radio-disabled-reason"
              className="text-sm leading-6 text-muted-foreground wrap-anywhere"
            >
              {option.label}: {option.disabledReason}
            </p>
          ),
      )}
    </>
  );
}

type renderKiraRadioGroupPart6Args<Value extends string | number = string> = {
  fieldProps: KiraRadioGroupProps<Value>["fieldProps"];
  name: KiraRadioGroupProps<Value>["name"];
  disabled: KiraRadioGroupProps<Value>["disabled"];
  error: KiraRadioGroupProps<Value>["error"];
  loading: boolean;
  label: KiraRadioGroupProps<Value>["label"];
  required: KiraRadioGroupProps<Value>["required"];
  description: KiraRadioGroupProps<Value>["description"];
  wrapGroup: () => React.JSX.Element;
  layout: "list" | "cards" | "segmented";
  options: KiraRadioGroupProps<Value>["options"];
  buildSegmentDetails: () => React.JSX.Element;
  loadingLabel: React.ReactNode;
  errorMessage: KiraRadioGroupProps<Value>["errorMessage"];
};

function renderKiraRadioGroupPart6<Value extends string | number = string>({
  fieldProps,
  name,
  disabled,
  error,
  loading,
  label,
  required,
  description,
  wrapGroup,
  layout,
  options,
  buildSegmentDetails,
  loadingLabel,
  errorMessage,
}: renderKiraRadioGroupPart6Args<Value>) {
  return (
    <FieldPrimitive.Root
      {...fieldProps}
      data-slot="kira-radio-group"
      name={name}
      disabled={disabled}
      invalid={error || undefined}
      aria-busy={loading || undefined}
      className="grid min-w-0 gap-3"
    >
      <FieldPrimitive.Label
        data-slot="radio-group-label"
        nativeLabel={false}
        render={<div />}
        className="text-sm font-medium leading-5"
      >
        {label}
        {required && (
          <span className="ms-2 text-xs font-normal text-muted-foreground">
            Required
          </span>
        )}
      </FieldPrimitive.Label>
      {description != null && (
        <FieldPrimitive.Description
          data-slot="radio-group-description"
          className="text-sm leading-6 text-muted-foreground"
        >
          {description}
        </FieldPrimitive.Description>
      )}
      {wrapGroup()}
      {layout === "segmented" && options.length > 0 && buildSegmentDetails()}
      {loading && (
        <output
          data-slot="radio-group-loading"
          className="text-sm text-muted-foreground"
        >
          {loadingLabel}
        </output>
      )}
      <FieldPrimitive.Error
        {...(errorMessage == null ? {} : { children: errorMessage })}
        data-slot="radio-group-error"
        match={error ? true : undefined}
        className="text-sm leading-6 text-destructive"
        role="alert"
      />
    </FieldPrimitive.Root>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_RADIO_GROUP_DEFAULTS_1 = {
  layout: "list",
  size: "default",
  loading: false,
  loadingLabel: "Loading choices…",
  emptyMessage: "No choices are available.",
} as const;

type renderKiraRadioGroupViewArgs<Value extends string | number = string> = {
  fieldProps: KiraRadioGroupProps<Value>["fieldProps"];
  name: KiraRadioGroupProps<Value>["name"];
  disabled: KiraRadioGroupProps<Value>["disabled"];
  error: KiraRadioGroupProps<Value>["error"];
  loading: Exclude<KiraRadioGroupProps<Value>["loading"], undefined>;
  label: KiraRadioGroupProps<Value>["label"];
  required: KiraRadioGroupProps<Value>["required"];
  description: KiraRadioGroupProps<Value>["description"];
  wrapGroup: () => React.JSX.Element;
  layout: Exclude<KiraRadioGroupProps<Value>["layout"], undefined>;
  options: Exclude<KiraRadioGroupProps<Value>["options"], undefined>;
  buildSegmentDetails: () => React.JSX.Element;
  loadingLabel: KiraRadioGroupProps<Value>["loadingLabel"];
  errorMessage: KiraRadioGroupProps<Value>["errorMessage"];
};

function renderKiraRadioGroupView<Value extends string | number = string>({
  fieldProps,
  name,
  disabled,
  error,
  loading,
  label,
  required,
  description,
  wrapGroup,
  layout,
  options,
  buildSegmentDetails,
  loadingLabel,
  errorMessage,
}: renderKiraRadioGroupViewArgs<Value>) {
  return renderKiraRadioGroupPart6({
    fieldProps,
    name,
    disabled,
    error,
    loading,
    label,
    required,
    description,
    wrapGroup,
    layout,
    options,
    buildSegmentDetails,
    loadingLabel,
    errorMessage,
  });
}

function useRadioGroupSetup<Value extends string | number = string>(
  input: KiraRadioGroupProps<Value>,
) {
  const resolvedProps = resolveComponentDefaults(
    input,
    KIRA_RADIO_GROUP_DEFAULTS_1,
  );

  const { layout, size, value, defaultValue, onValueChange } = resolvedProps;
  // SAFETY: The excluded keys are exactly those removed by the original native-prop rest binding.

  const props = omitComponentProps(resolvedProps, [
    "label",
    "description",
    "options",
    "layout",
    "size",
    "loading",
    "loadingLabel",
    "emptyMessage",
    "fieldProps",
    "error",
    "errorMessage",
    "disabled",
    "readOnly",
    "required",
    "name",
    "value",
    "defaultValue",
    "onValueChange",
  ] as const);

  const id = React.useId();

  const [localValue, setLocalValue] = React.useState(defaultValue);

  const selectedValue = value === undefined ? localValue : value;

  const handleValueChange: NonNullable<
    RadioGroupProps<Value>["onValueChange"]
  > = (next, details) => {
    onValueChange?.(next, details);

    if (!details.isCanceled && value === undefined) setLocalValue(next);
  };

  const buildOption = (option: KiraRadioOption<Value>, index: number) =>
    buildRadioOption({ option, index, id, layout, size });

  return {
    ...resolvedProps,
    props,
    id,
    selectedValue,
    handleValueChange,
    buildOption,
  };
}

function buildRadioOption<Value extends string | number>({
  option,
  index,
  id,
  layout,
  size,
}: {
  option: KiraRadioOption<Value>;
  index: number;
  id: string;
  layout: KiraRadioGroupProps<Value>["layout"];
  size: KiraRadioGroupProps<Value>["size"];
}) {
  const optionLabelId = `${id}-option-${index}`;
  const optionLabel = <span id={optionLabelId}>{option.label}</span>;

  const common = {
    value: option.value,
    disabled: option.disabled || option.disabledReason != null,
  };

  const control =
    layout === "cards" ? (
      <RadioCard
        {...common}
        label={optionLabel}
        description={option.description}
        icon={option.icon}
        metadata={option.metadata}
        disabledReason={option.disabledReason}
      />
    ) : (
      <RadioWithLabel
        {...common}
        label={
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {optionLabel}
            {option.metadata != null && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {option.metadata}
              </span>
            )}
          </span>
        }
        description={option.description}
        disabledReason={option.disabledReason}
        size={size}
        aria-labelledby={optionLabelId}
      />
    );

  return (
    <FieldPrimitive.Item
      key={option.value}
      data-slot="kira-radio-option"
      className="group/choice min-w-0"
    >
      {control}
      {option.details != null && (
        <section
          data-slot="kira-radio-details"
          aria-labelledby={optionLabelId}
          className="hidden min-w-0 border-s-2 border-primary/30 ps-4 pt-3 text-sm leading-6 wrap-anywhere group-has-data-checked/choice:block"
        >
          {option.details}
        </section>
      )}
    </FieldPrimitive.Item>
  );
}

function useRadioGroupActions<Value extends string | number = string>(
  state: ReturnType<typeof useRadioGroupSetup<Value>>,
) {
  const {
    options,
    layout,
    size,
    loading,
    emptyMessage,
    disabled,
    readOnly,
    required,
    name,
    value,
    defaultValue,
    props,
    id,
    selectedValue,
    handleValueChange,
    buildOption,
  } = state;

  const buildChoices = () => {
    if (options.length > 0) {
      return options.map(buildOption);
    }

    if (loading) {
      return renderRadioGroupSkeletonPart3();
    }

    return (
      <p
        data-slot="radio-group-empty"
        className="py-3 text-sm text-muted-foreground"
      >
        {emptyMessage}
      </p>
    );
  };

  const buildSegment = (option: KiraRadioOption<Value>, index: number) =>
    renderBuildSegmentSectionPart4({ option, size, id, index });

  const buildSegmentDetails = () =>
    renderBuildSegmentDetailsSectionPart5({ options, selectedValue, id });

  const wrapGroup = () =>
    layout === "segmented" && options.length > 0 ? (
      <RadioButtonGroup
        {...props}
        className={mergeClassName<RadioGroupPrimitive.State>(
          "flex w-full",
          props.className,
        )}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        name={name}
        size={size}
        disabled={disabled}
        readOnly={readOnly || loading}
        required={required}
      >
        {options.map(buildSegment)}
      </RadioButtonGroup>
    ) : (
      <RadioGroup
        {...props}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        name={name}
        disabled={disabled}
        readOnly={readOnly || loading}
        required={required}
      >
        {buildChoices()}
      </RadioGroup>
    );

  return { ...state, buildSegmentDetails, wrapGroup };
}

function renderRadioGroup<Value extends string | number = string>({
  label,
  description,
  options,
  layout,
  loading,
  loadingLabel,
  fieldProps,
  error,
  errorMessage,
  disabled,
  required,
  name,
  buildSegmentDetails,
  wrapGroup,
}: ReturnType<typeof useRadioGroupActions<Value>>) {
  return renderKiraRadioGroupView({
    fieldProps,
    name,
    disabled,
    error,
    loading,
    label,
    required,
    description,
    wrapGroup,
    layout,
    options,
    buildSegmentDetails,
    loadingLabel,
    errorMessage,
  });
}
