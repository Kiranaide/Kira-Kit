import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { NumberField } from "@base-ui/react/number-field";
import { OTPField } from "@base-ui/react/otp-field";
import { Meter } from "@base-ui/react/meter";
import { Combobox } from "@base-ui/react/combobox";
import { KiraSelect } from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconMinus,
  IconPlus,
  IconLoader2,
  IconX,
  IconCopy,
  IconCheck,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const inputVariants = cva(
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        xs: "h-7 px-2 py-0.5 text-xs file:h-5 file:text-xs",
        sm: "h-8 px-3 py-1 text-xs file:h-6 file:text-xs",
        default: "h-9 px-4 py-1 text-base md:text-sm file:h-7 file:text-sm",
        lg: "h-10 px-5 py-1.5 text-base md:text-sm file:h-8 file:text-sm",
        xl: "h-11 px-5 py-2 text-base file:h-8 file:text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const transitionClasses = "transition-colors";

const COUNTER_WARN_RATIO = 0.9;

interface CharacterCounterProps {
  currentLength: number;
  maxLength?: number;
  className?: string;
}

/**
 * Live n/max counter. Warn color near the limit, destructive at the limit.
 * Announced politely via aria-live.
 */
function CharacterCounter({
  currentLength,
  maxLength,
  className,
}: CharacterCounterProps) {
  const atLimit = maxLength !== undefined && currentLength >= maxLength;

  const nearLimit =
    maxLength !== undefined &&
    !atLimit &&
    currentLength >= Math.floor(COUNTER_WARN_RATIO * maxLength);

  return (
    <div
      className={cn(
        "text-right text-xs tabular-nums text-muted-foreground",
        className,
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          { "text-warning": nearLimit },
          { "text-destructive": atLimit },
        )}
      >
        {currentLength}
      </span>
      {maxLength !== undefined && `/${maxLength}`}
    </div>
  );
}

interface InputProps
  extends
    Omit<InputPrimitive.Props, "prefix" | "size" | "className">,
    VariantProps<typeof inputVariants> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: VariantProps<typeof inputVariants>["size"];
  showClear?: boolean;
  onClear?: () => void;
  showCopy?: boolean;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;

  /** Show a live character counter (requires a controlled `value`). */
  showCount?: boolean;
}

// Affordance offsets follow: text offset = container px + affordance width + 4px gap.
const PREFIX_PADDING = {
  xs: "pl-6",
  sm: "pl-8",
  default: "pl-9",
  lg: "pl-10",
  xl: "pl-10",
} as const;

const SUFFIX_PADDING = {
  xs: "pr-6",
  sm: "pr-8",
  default: "pr-9",
  lg: "pr-10",
  xl: "pr-10",
} as const;

const PREFIX_CONTAINER_PADDING = {
  xs: "pl-2",
  sm: "pl-3",
  default: "pl-4",
  lg: "pl-5",
  xl: "pl-5",
} as const;

const SUFFIX_CONTAINER_PADDING = {
  xs: "pr-2",
  sm: "pr-3",
  default: "pr-4",
  lg: "pr-5",
  xl: "pr-5",
} as const;

const PREFIX_INSET = {
  xs: "left-2",
  sm: "left-3",
  default: "left-4",
  lg: "left-5",
  xl: "left-5",
} as const;

const SUFFIX_INSET = {
  xs: "right-2",
  sm: "right-3",
  default: "right-4",
  lg: "right-5",
  xl: "right-5",
} as const;

// One size-6 action box: container px + 24px box + 4px gap.
const SINGLE_ACTION_PADDING = {
  xs: "pr-9",
  sm: "pr-10",
  default: "pr-11",
  lg: "pr-12",
  xl: "pr-12",
} as const;

// Two size-6 boxes: single-action offset + 24px box + 4px gap.
const DOUBLE_ACTION_PADDING = {
  xs: "pr-16",
  sm: "pr-17",
  default: "pr-18",
  lg: "pr-19",
  xl: "pr-19",
} as const;

const ACTION_ICON_SIZE = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  default: "h-4 w-4",
  lg: "h-4 w-4",
  xl: "h-4 w-4",
} as const;

const TAG_INPUT_MIN_HEIGHT = {
  xs: "min-h-7",
  sm: "min-h-8",
  default: "min-h-9",
  lg: "min-h-10",
  xl: "min-h-11",
} as const;

const SEARCH_ICON_SIZE = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  default: "h-4 w-4",
  lg: "h-4 w-4",
  xl: "h-4 w-4",
} as const;

interface InputActionButtonsProps {
  show: boolean;
  showClearButton: boolean;
  showCopy: boolean;
  size: InputSize;
  copied: boolean;
  onClear: () => void;
  onCopy: () => void;
}

/** Clear + copy affordances rendered as an absolutely positioned suffix. */
function InputActionButtons({
  show,
  showClearButton,
  showCopy,
  size,
  copied,
  onClear,
  onCopy,
}: InputActionButtonsProps) {
  if (!show) return null;

  const iconSize = ACTION_ICON_SIZE[size] ?? ACTION_ICON_SIZE.default;
  let copyButtonLabel = "Copy to clipboard";
  let copyButtonIcon = <IconCopy className={iconSize} />;

  if (copied) {
    copyButtonLabel = "Copied";
    copyButtonIcon = <IconCheck className={cn(iconSize, "text-success")} />;
  }

  return (
    <InputContentView
      showClearButton={showClearButton}
      onClear={onClear}
      iconSize={iconSize}
      showCopy={showCopy}
      onCopy={onCopy}
      copyButtonLabel={copyButtonLabel}
      copyButtonIcon={copyButtonIcon}
    />
  );
}

interface UseInputActionsOptions {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: InputProps["value"];
  onClear?: () => void;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
}

/** Clear through the native input event + copy-to-clipboard actions for Input. */
function useInputActions({
  inputRef,
  value,
  onClear,
  onCopySuccess,
  onCopyError,
}: UseInputActionsOptions) {
  const [copied, setCopied] = React.useState(false);
  const copiedTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = null;
      }
    };
  }, []);

  const handleClear = () => inputHandleClear(inputRef, onClear);

  const handleCopy = () =>
    inputHandleCopy(
      inputRef,
      value,
      setCopied,
      onCopySuccess,
      copiedTimeoutRef,
      onCopyError,
    );

  return { copied, handleClear, handleCopy };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefix,
      suffix,
      size: sizeInput,
      disabled,
      min,
      max,
      step: stepInput,
      value,
      onChange,
      showClear: showClearInput,
      onClear,
      showCopy: showCopyInput,
      onCopySuccess,
      onCopyError,
      showCount: showCountInput,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const { size, step, showClear, showCopy, showCount } = useInputOptions({
      size: sizeInput,
      step: stepInput,
      showClear: showClearInput,
      showCopy: showCopyInput,
      showCount: showCountInput,
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const reducedMotion = useReducedMotion();

    // SAFETY: inputRef is created above with HTMLInputElement type param; the
    // ref is only attached to the InputPrimitive rendered below.
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const { copied, handleClear, handleCopy } = useInputActions({
      inputRef,
      value,
      onClear,
      onCopySuccess,
      onCopyError,
    });

    return (
      <InputFieldView
        className={className}
        type={type}
        prefix={prefix}
        suffix={suffix}
        size={size}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        showClear={showClear}
        onClear={handleClear}
        showCopy={showCopy}
        copied={copied}
        onCopy={handleCopy}
        showCount={showCount}
        maxLength={maxLength}
        inputRef={inputRef}
        reducedMotion={reducedMotion}
        props={props}
      />
    );
  },
);

interface InputFieldViewOptions {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: VariantProps<typeof inputVariants>["size"];
  disabled?: boolean;
  min?: InputProps["min"];
  max?: InputProps["max"];
  step?: InputProps["step"];
  value: InputProps["value"];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  showClear?: boolean;
  onClear: () => void;
  showCopy?: boolean;
  copied: boolean;
  onCopy: () => void;
  showCount?: boolean;
  maxLength?: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  reducedMotion: boolean;
  props: Omit<InputProps, keyof InputFieldViewOptions>;
}

type InputSize = NonNullable<VariantProps<typeof inputVariants>["size"]>;

/** Build the padded base <input> element for InputFieldView. */
function createInputElement(
  options: InputFieldViewOptions,
  effectiveSize: InputSize,
) {
  const {
    className,
    type,
    prefix,
    suffix,
    disabled,
    min,
    max,
    step = 1,
    value,
    onChange,
    maxLength,
    inputRef,
    reducedMotion,
    props,
  } = options;

  const isNumeric = type === "number";

  return (
    <InputPrimitive
      ref={inputRef}
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ size: effectiveSize }),
        !reducedMotion && transitionClasses,
        prefix && PREFIX_PADDING[effectiveSize],
        suffix && SUFFIX_PADDING[effectiveSize],
        {
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none":
            isNumeric,
        },
        className,
      )}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
      maxLength={maxLength}
      step={step}
      {...props}
    />
  );
}

/** Live character counter node (opt-in via showCount). */
function resolveCounter(
  showCount: boolean,
  currentLength: number,
  maxLength?: number,
): React.ReactNode {
  if (!showCount) return null;

  return (
    <CharacterCounter
      currentLength={currentLength}
      maxLength={maxLength}
      className="mt-1"
    />
  );
}

/** Wrap the field (plus counter) in a full-width container when counted. */
function withCounterWrapper(
  counter: React.ReactNode,
  field: React.ReactNode,
): React.ReactNode {
  if (!counter) return field;

  return (
    <div className="w-full">
      {field}
      {counter}
    </div>
  );
}

/** Whether the field currently holds a clearable value. */
function hasClearAffordance(
  value: React.ComponentProps<"input">["value"],
  showClear: boolean,
  disabled?: boolean,
): boolean {
  if (!showClear || disabled) return false;

  return value !== undefined && value !== null && String(value).length > 0;
}

/** Clear/copy action buttons rendered inside the suffix area. */
function resolveActionButtons(params: {
  showClearButton: boolean;
  showCopy: boolean;
  size: InputSize;
  copied: boolean;
  onClear: () => void;
  onCopy: () => void;
}): React.ReactNode {
  const { showClearButton, showCopy, size, copied, onClear, onCopy } = params;

  return (
    (showClearButton || showCopy) && (
      <InputActionButtons
        show={showClearButton || showCopy}
        showClearButton={showClearButton}
        showCopy={showCopy}
        size={size}
        copied={copied}
        onClear={onClear}
        onCopy={onCopy}
      />
    )
  );
}

/** Suffix content: user suffix + action buttons in one row. */
function resolveCombinedSuffix(
  suffix: React.ReactNode,
  actionButtons: React.ReactNode,
): React.ReactNode {
  return (
    (suffix || actionButtons) && (
      <div className="flex items-center gap-1">
        {suffix}
        {actionButtons}
      </div>
    )
  );
}

/** Right padding applied to the input when action buttons are shown. */
function resolveActionButtonsPadding(
  showClear: boolean,
  showCopy: boolean,
  size: InputSize,
): string {
  if (showClear && showCopy) return DOUBLE_ACTION_PADDING[size];

  if (showClear || showCopy) return SINGLE_ACTION_PADDING[size];

  return "";
}

/** Absolutely-positioned prefix container on the left edge. */
function renderPrefixContainer(
  prefix: React.ReactNode,
  prefixContainerPadding: string,
): React.ReactNode {
  return (
    prefix && (
      <div
        className={cn(
          "absolute left-0 flex h-full items-center text-muted-foreground pointer-events-none",
          prefixContainerPadding,
        )}
      >
        {prefix}
      </div>
    )
  );
}

/** Absolutely-positioned suffix container on the right edge. */
function renderSuffixContainer(
  combinedSuffix: React.ReactNode,
  suffixContainerPadding: string,
): React.ReactNode {
  return (
    combinedSuffix && (
      <div
        className={cn(
          "absolute right-0 flex h-full items-center",
          suffixContainerPadding,
        )}
      >
        {combinedSuffix}
      </div>
    )
  );
}

/** Layout view for Input: padded primitive + prefix/suffix containers + counter. */
function InputFieldView(options: InputFieldViewOptions) {
  const {
    size = "default",
    disabled,
    showClear = false,
    onClear,
    showCopy = false,
    copied,
    onCopy,
    showCount = false,
    maxLength,
    value,
  } = options;

  const effectiveSize = size || "default";

  const inputElement = createInputElement(options, effectiveSize);

  const showClearButton = hasClearAffordance(
    value,
    showClear,
    disabled || options.props.readOnly,
  );

  const currentLength = String(value ?? "").length;
  const counter = resolveCounter(showCount, currentLength, maxLength);

  const actionButtons = resolveActionButtons({
    showClearButton,
    showCopy,
    size: effectiveSize,
    copied,
    onClear,
    onCopy,
  });

  const combinedSuffix = resolveCombinedSuffix(options.suffix, actionButtons);

  const actionButtonsPadding = resolveActionButtonsPadding(
    showClear,
    showCopy,
    effectiveSize,
  );

  // Always render the wrapper div: switching between bare-input and wrapper
  // trees remounts the <input> on first keystroke (showClear/showCopy appearing
  // when value goes empty → non-empty) and drops focus mid-typing.
  return withCounterWrapper(
    counter,
    <div className="relative flex items-center">
      {renderPrefixContainer(
        options.prefix,
        PREFIX_CONTAINER_PADDING[effectiveSize],
      )}
      {React.cloneElement(inputElement, {
        className: cn(inputElement.props.className, actionButtonsPadding),
      })}
      {renderSuffixContainer(
        combinedSuffix,
        SUFFIX_CONTAINER_PADDING[effectiveSize],
      )}
    </div>,
  );
}

Input.displayName = "Input";

interface NumericInputProps
  extends
    Omit<
      React.ComponentProps<"input">,
      "type" | "onChange" | "value" | "size" | "min" | "max" | "step"
    >,
    VariantProps<typeof inputVariants> {
  /** `null` renders an empty field (Base UI NumberField semantics). */
  value?: number | null;
  /** Matches Base UI NumberField: `null` when the field is cleared. */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  /** Step while Alt is held. @default 0.1 */
  smallStep?: number;
  /** Step while Shift is held. @default 10 */
  largeStep?: number;
  /** Allow typed text outside min/max without clamping (steppers still clamp). */
  allowOutOfRange?: boolean;
  /** Drag the input text horizontally to scrub the value. */
  scrub?: boolean;
  showButtons?: boolean;
}

function NumericInput({
  value,
  onValueChange,
  min,
  max,
  step: stepInput,
  smallStep,
  largeStep,
  allowOutOfRange,
  scrub: scrubInput,
  showButtons: showButtonsInput,
  className,
  disabled,
  id,
  name,
  required,
  readOnly,
  size: sizeInput,
  ...props
}: NumericInputProps) {
  const { step, scrub, showButtons, size } = useNumericInputDefaults({
    step: stepInput,
    scrub: scrubInput,
    showButtons: showButtonsInput,
    size: sizeInput,
  });

  const handleValueChange = (next: number | null) => {
    onValueChange?.(next);
  };

  const inputClasses = cn(
    inputVariants({ size }),
    transitionClasses,
    "min-w-0 flex-1",
    {
      "rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none":
        showButtons,
    },
    className,
  );

  const scrubArea = (
    <NumericInputField
      scrub={scrub}
      className={inputClasses}
      inputProps={props}
    />
  );

  return (
    <NumberField.Root
      data-slot="numeric-input-root"
      id={id}
      name={name}
      required={required}
      readOnly={readOnly}
      value={value ?? null}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
      smallStep={smallStep}
      largeStep={largeStep}
      allowOutOfRange={allowOutOfRange}
      disabled={disabled}
      className={cn("flex items-center", className)}
    >
      <NumericInputControls showButtons={showButtons} size={size || "default"}>
        {scrubArea}
      </NumericInputControls>
    </NumberField.Root>
  );
}

const STEPPER_SIZE = {
  xs: "size-7",
  sm: "size-8",
  default: "size-9",
  lg: "size-10",
  xl: "size-11",
} as const;

const STEPPER_ICON_SIZE = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  default: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-5 w-5",
} as const;

function NumericInputControls({
  showButtons,
  size,
  children,
}: {
  showButtons: boolean;
  size: InputSize;
  children: React.ReactNode;
}) {
  return (
    <NumberField.Group
      data-slot="numeric-input-controls"
      className="flex items-center"
    >
      {showButtons && (
        <NumberField.Decrement
          aria-label="Decrease value"
          data-slot="numeric-input-decrement"
          className={cn(
            "flex items-center justify-center rounded-l-lg border border-r-0 border-input hover:bg-muted/50 dark:bg-input/30 dark:hover:bg-input/50 disabled:opacity-50 disabled:cursor-not-allowed",
            STEPPER_SIZE[size],
          )}
        >
          <IconMinus className={STEPPER_ICON_SIZE[size]} />
        </NumberField.Decrement>
      )}
      {children}
      {showButtons && (
        <NumberField.Increment
          aria-label="Increase value"
          data-slot="numeric-input-increment"
          className={cn(
            "flex items-center justify-center rounded-r-lg border border-l-0 border-input hover:bg-muted/50 dark:bg-input/30 dark:hover:bg-input/50 disabled:opacity-50 disabled:cursor-not-allowed",
            STEPPER_SIZE[size],
          )}
        >
          <IconPlus className={STEPPER_ICON_SIZE[size]} />
        </NumberField.Increment>
      )}
    </NumberField.Group>
  );
}

function NumericInputField({
  scrub,
  className,
  inputProps,
}: {
  scrub: boolean;
  className: string;
  inputProps: React.ComponentProps<typeof NumberField.Input>;
}) {
  const input = (
    <NumberField.Input
      data-slot="numeric-input"
      className={className}
      {...inputProps}
    />
  );

  if (!scrub) return input;

  return (
    <NumberField.ScrubArea className="flex flex-1 items-center">
      {input}
      <NumberField.ScrubAreaCursor className="cursor-ew-resize" />
    </NumberField.ScrubArea>
  );
}

type FormattedInputBaseProps = Omit<
  React.ComponentProps<"input">,
  "type" | "onChange" | "value" | "size"
>;

interface CurrencyInputProps extends FormattedInputBaseProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  currency?: string;
  locale?: string;
  fractionDigits?: number;
  size?: VariantProps<typeof inputVariants>["size"];
}

function CurrencyInput({
  value,
  onChange,
  currency = "USD",
  locale,
  fractionDigits = 2,
  className,
  size,
  ...props
}: CurrencyInputProps) {
  const [internalValue, setInternalValue] = React.useState<number | null>(
    value ?? null,
  );

  const effectiveValue = value ?? internalValue;

  const format = (num: number) =>
    inputFormat(num, locale, currency, fractionDigits);

  let displayValue = "";

  if (!(effectiveValue == null || Number.isNaN(effectiveValue))) {
    displayValue = format(effectiveValue);
  }

  const handleChange = useDecimalInputChange(
    fractionDigits,
    setInternalValue,
    onChange,
  );

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      size={size}
      {...props}
    />
  );
}

interface PercentageInputProps extends FormattedInputBaseProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  locale?: string;
  fractionDigits?: number;
  size?: VariantProps<typeof inputVariants>["size"];
}

function PercentageInput({
  value,
  onChange,
  locale,
  fractionDigits = 2,
  className,
  size,
  ...props
}: PercentageInputProps) {
  const [internalValue, setInternalValue] = React.useState<number | null>(
    value ?? null,
  );

  const effectiveValue = value ?? internalValue;

  const format = (num: number) =>
    `${num.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}%`;

  let displayValue = "";

  if (!(effectiveValue == null || Number.isNaN(effectiveValue))) {
    displayValue = format(effectiveValue);
  }

  const handleChange = useDecimalInputChange(
    fractionDigits,
    setInternalValue,
    onChange,
  );

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      size={size}
      {...props}
    />
  );
}

interface DecimalInputProps extends FormattedInputBaseProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  locale?: string;
  fractionDigits?: number;
  useGrouping?: boolean;
  size?: VariantProps<typeof inputVariants>["size"];
}

function DecimalInput({
  value,
  onChange,
  locale,
  fractionDigits = 2,
  useGrouping = true,
  className,
  size,
  ...props
}: DecimalInputProps) {
  const [internalValue, setInternalValue] = React.useState<number | null>(
    value ?? null,
  );

  const effectiveValue = value ?? internalValue;

  const format = (num: number) =>
    num.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      useGrouping,
    });

  let displayValue = "";

  if (!(effectiveValue == null || Number.isNaN(effectiveValue))) {
    displayValue = format(effectiveValue);
  }

  const handleChange = useDecimalInputChange(
    fractionDigits,
    setInternalValue,
    onChange,
  );

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      size={size}
      {...props}
    />
  );
}

interface InputWithLabelProps extends Omit<
  React.ComponentProps<"input">,
  "size"
> {
  label: string;
  description?: string;
  error?: string;
  size?: VariantProps<typeof inputVariants>["size"];
}

function InputWithLabel({
  label,
  description,
  error,
  className,
  id,
  size,
  disabled,
  required,
  ...props
}: InputWithLabelProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <Field
      id={inputId}
      disabled={disabled}
      required={required}
      invalid={!!error}
    >
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Input
        id={inputId}
        className={className}
        size={size}
        disabled={disabled}
        {...props}
      />
      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

interface InputWithButtonProps extends Omit<
  React.ComponentProps<"input">,
  "size"
> {
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  buttonPosition?: "left" | "right";
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof inputVariants>["size"];
}

function InputWithButton({
  buttonText,
  buttonIcon,
  onButtonClick,
  buttonPosition = "right",
  buttonVariant = "default",
  className,
  size = "default",
  ...props
}: InputWithButtonProps) {
  return (
    <div className="flex items-center">
      {buttonPosition === "left" && (
        <Button
          type="button"
          variant={buttonVariant}
          size={size}
          onClick={onButtonClick}
          className="rounded-r-none border-r-0 transition-colors"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
      <Input
        className={cn(
          { "rounded-l-none": buttonPosition === "left" },
          { "rounded-r-none": buttonPosition === "right" },
          "flex-1",
          className,
        )}
        size={size}
        {...props}
      />
      {buttonPosition === "right" && (
        <Button
          type="button"
          variant={buttonVariant}
          size={size}
          onClick={onButtonClick}
          className="rounded-l-none border-l-0 transition-colors"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
    </div>
  );
}

interface InputWithSpinnerProps extends Omit<
  React.ComponentProps<"input">,
  "size"
> {
  isLoading?: boolean;
  size?: VariantProps<typeof inputVariants>["size"];
}

function InputWithSpinner({
  isLoading = false,
  className,
  size,
  ...props
}: InputWithSpinnerProps) {
  const effectiveSize = size || "default";

  return (
    <div className="relative">
      <Input
        className={cn(
          isLoading && SINGLE_ACTION_PADDING[effectiveSize],
          className,
        )}
        size={size}
        {...props}
      />
      {isLoading && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            SUFFIX_INSET[effectiveSize],
          )}
        >
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

interface InputWithTooltipProps extends Omit<
  React.ComponentProps<"input">,
  "size"
> {
  tooltip: string;
  size?: VariantProps<typeof inputVariants>["size"];
}

function InputWithTooltip({
  tooltip,
  className,
  size,
  ...props
}: InputWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Input className={className} size={size} {...props} />}
      />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

interface InputWithDropdownProps extends Omit<
  React.ComponentProps<"input">,
  "onSelect" | "size"
> {
  options: { value: string; label: string }[];
  onOptionSelect?: (value: string) => void;
  dropdownPosition?: "left" | "right";
  dropdownValue?: string;
  size?: VariantProps<typeof inputVariants>["size"];
}

function InputWithDropdown({
  options,
  onOptionSelect,
  dropdownPosition = "left",
  dropdownValue,
  className,
  size,
  ...props
}: InputWithDropdownProps) {
  let selectRounding: string;

  if (dropdownPosition === "left") {
    selectRounding = "rounded-l-lg rounded-r-none";
  } else {
    selectRounding = "rounded-l-none rounded-r-lg";
  }

  const select = (
    <KiraSelect
      options={options}
      defaultValue={dropdownValue ?? options[0]?.value}
      onChange={(next) => onOptionSelect?.(String(next))}
      variant="ghost"
      size={size ?? undefined}
      className={cn(
        // Match the joined input: same ladder height and surface as the input
        // in both themes, seam edge squared.
        "border-input hover:bg-muted/50 dark:bg-input/30 dark:hover:bg-input/50",
        selectRounding,
      )}
      aria-label="Select option"
    />
  );

  return (
    <div className="flex">
      {dropdownPosition === "left" && select}
      <Input
        className={cn(
          "flex-1",
          { "rounded-l-none": dropdownPosition === "left" },
          { "rounded-r-none": dropdownPosition === "right" },
          className,
        )}
        size={size}
        {...props}
      />
      {dropdownPosition === "right" && select}
    </div>
  );
}

interface InputClusterProps {
  children: React.ReactNode;
  className?: string;
}

function InputCluster({ children, className }: InputClusterProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={cn("flex", className)}>
      {React.Children.map(childArray, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === childArray.length - 1;

        // SAFETY: children come from InputGroup's own composition; className is the
        // only custom prop this composite reads from them.
        const childProps = child.props as { className?: string };
        const childClassName = childProps.className;

        return React.cloneElement(
          // SAFETY: child is a React element cloned with an additive className; the
          // group renders only elements that accept className.
          child as React.ReactElement<{ className?: string }>,
          {
            className: cn(
              childClassName,
              { "rounded-l-none border-l-0": !isFirst },
              { "rounded-r-none": !isLast },
            ),
          },
        );
      })}
    </div>
  );
}

interface SearchInputProps extends Omit<
  React.ComponentProps<"input">,
  "size" | "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  showClear?: boolean;
  size?: VariantProps<typeof inputVariants>["size"];
}

function SearchInput(arg0: SearchInputProps) {
  const model = useSearchInputModel(arg0);

  return <SearchInputView {...model} />;
}

/** Base UI OTPField validation types; kira's `alphabetic` maps to `alpha`. */
type OTPInputType = "numeric" | "alphanumeric" | "alpha";

const otpInputVariants = cva(
  "flex items-center justify-center border bg-background text-center font-mono font-medium transition-[color,background-color,border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 w-9 text-sm rounded-md",
        default: "h-11 w-11 text-lg rounded-lg",
        lg: "h-14 w-14 text-xl rounded-xl",
      },
      variant: {
        default: "border-input",
        outline: "border-2 border-input",
        filled: "border-transparent bg-muted",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

const otpContainerVariants = cva("flex items-center", {
  variants: {
    gap: {
      // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
      sm: "gap-1.5",
      default: "gap-2",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    gap: "default",
  },
});

interface OTPInputProps
  extends
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "onChange" | "defaultValue" | "defaultChecked" | "color" | "style"
    >,
    VariantProps<typeof otpInputVariants> {
  length?: 4 | 5 | 6 | 7 | 8;

  type?: OTPInputType;

  mask?: boolean;

  /** Submit the owning form when the OTP becomes complete. */
  autoSubmit?: boolean;

  value?: string;

  onChange?: (value: string) => void;

  onComplete?: (value: string) => void;

  disabled?: boolean;

  invalid?: boolean;

  gap?: "sm" | "default" | "lg";

  /** Render a separator after the Nth slot (1-based). */
  separatorAfter?: number;

  autoFocus?: boolean;

  placeholder?: string;

  "aria-label"?: string;

  "aria-describedby"?: string;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  // oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
  (
    {
      length: lengthInput,
      type: typeInput,
      mask: maskInput,
      autoSubmit: autoSubmitInput,
      value: valueInput,
      onChange,
      onComplete,
      disabled: disabledInput,
      invalid: invalidInput,
      size: sizeInput,
      variant: variantInput,
      gap: gapInput,
      separatorAfter,
      autoFocus,
      placeholder: placeholderInput,
      className,
      "aria-label": ariaLabelInput,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const { length, type, mask, autoSubmit, value, disabled } =
      useInputOptions2({
        length: lengthInput,
        type: typeInput,
        mask: maskInput,
        autoSubmit: autoSubmitInput,
        value: valueInput,
        disabled: disabledInput,
      });

    const { invalid, size, variant, gap, placeholder, ariaLabel } =
      useInputOptions3({
        invalid: invalidInput,
        size: sizeInput,
        variant: variantInput,
        gap: gapInput,
        placeholder: placeholderInput,
        ariaLabel: ariaLabelInput,
      });

    return (
      <OTPField.Root
        data-slot="otp-input"
        ref={ref}
        length={length}
        value={value}
        onValueChange={(nextValue) => onChange?.(nextValue)}
        onValueComplete={onComplete}
        validationType={type}
        mask={mask}
        autoSubmit={autoSubmit}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(otpContainerVariants({ gap }), className)}
        {...props}
      >
        {Array.from({ length }).map((_, index) =>
          renderOtpSlot(index, {
            length,
            autoFocus,
            size,
            variant,
            invalid,
            placeholder,
            separatorAfter,
          }),
        )}
      </OTPField.Root>
    );
  },
);

OTPInput.displayName = "OTPInput";

interface OtpSlotOptions {
  length: number;
  autoFocus?: boolean;
  size?: VariantProps<typeof otpInputVariants>["size"];
  variant?: VariantProps<typeof otpInputVariants>["variant"];
  invalid?: boolean;
  placeholder?: string;
  separatorAfter?: number;
}

/** One OTP slot plus its optional separator (after the Nth digit). */
function renderOtpSlot(index: number, o: OtpSlotOptions) {
  const showSeparator =
    o.separatorAfter !== undefined &&
    index === o.separatorAfter - 1 &&
    index < o.length - 1;

  return (
    <React.Fragment key={index}>
      <OTPField.Input
        {...(o.autoFocus && index === 0 && { autoFocus: true })}
        className={cn(otpInputVariants({ size: o.size, variant: o.variant }), {
          "border-destructive focus:ring-destructive": o.invalid,
        })}
        placeholder={o.placeholder}
      />
      {showSeparator && <OTPField.Separator />}
    </React.Fragment>
  );
}

import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";

// kira-kit-ignore spacing-scale: star rating is a dense non-control glyph row
const ratingVariants = cva("inline-flex items-center gap-0.5", {
  variants: {
    size: {
      sm: "[&_svg]:h-4 [&_svg]:w-4",
      default: "[&_svg]:h-5 [&_svg]:w-5",
      lg: "[&_svg]:h-6 [&_svg]:w-6",
      xl: "[&_svg]:h-8 [&_svg]:w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const ratingItemVariants = cva(
  "transition-[color,box-shadow,opacity] duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
  {
    variants: {
      color: {
        default: "text-primary",
        yellow: "text-yellow-500",
        orange: "text-orange-500",
        red: "text-red-500",
        pink: "text-pink-500",
      },
      disabled: {
        true: "cursor-default opacity-60",
        false: "",
      },
      readOnly: {
        true: "cursor-default",
        false: "",
      },
    },
    defaultVariants: {
      color: "yellow",
      disabled: false,
      readOnly: false,
    },
  },
);

interface RatingProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof ratingVariants> {
  value?: number;

  defaultValue?: number;

  onChange?: (value: number) => void;

  max?: number;

  allowHalf?: boolean;

  allowClear?: boolean;

  disabled?: boolean;

  readOnly?: boolean;

  color?: "default" | "yellow" | "orange" | "red" | "pink";

  showValue?: boolean;

  filledIcon?: React.ReactNode;

  emptyIcon?: React.ReactNode;

  halfIcon?: React.ReactNode;

  tooltipFormatter?: (value: number) => string;

  "aria-label"?: string;

  "aria-describedby"?: string;
}

/** One decimal for half-star ratings, none for whole stars. */
function ratingDigits(allowHalf?: boolean) {
  if (allowHalf) return 1;

  return 0;
}

/** Roving tab stop: first enabled star is the only tabbable one. */
function ratingTabIndex(disabled?: boolean, readOnly?: boolean, index = 0) {
  if (disabled || readOnly) return -1;

  if (index === 0) return 0;

  return -1;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  // oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
  (props, ref) => {
    const model = useRatingModel(props, ref);

    return <RatingView {...model} />;
  },
);

Rating.displayName = "Rating";

interface RatingDisplayProps extends Omit<
  RatingProps,
  "onChange" | "allowClear" | "allowHalf"
> {
  showFraction?: boolean;

  reviewCount?: number;
}

const RatingDisplay = React.forwardRef<HTMLDivElement, RatingDisplayProps>(
  (
    { value = 0, showFraction = true, reviewCount, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <Rating value={value} readOnly allowHalf={showFraction} {...props} />
        {showFraction && (
          <span className="text-sm font-medium tabular-nums">
            {value.toFixed(1)}
          </span>
        )}
        {reviewCount !== undefined && (
          <span className="text-sm text-muted-foreground">
            ({reviewCount.toLocaleString()})
          </span>
        )}
      </div>
    );
  },
);

RatingDisplay.displayName = "RatingDisplay";

// =============================================================================
// Password input + strength meter
// =============================================================================

type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: { label: string; met: boolean }[];
};

/** Cheap, dependency-free strength heuristic. Not a security guarantee. */
function scorePassword(value: string): PasswordStrength {
  const checks = [
    { label: "At least 8 characters", met: value.length >= 8 },
    {
      label: "Upper & lowercase letters",
      met: /[a-z]/.test(value) && /[A-Z]/.test(value),
    },
    { label: "A number", met: /\d/.test(value) },
    { label: "A symbol", met: /[^A-Za-z0-9]/.test(value) },
  ];

  const met = checks.filter((c) => c.met).length;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  // SAFETY: met is at most checks.length (5) and the labels array is indexed by
  // the same bounds; 0 covers the empty-value branch.
  let rawScore = 0;

  if (value) {
    rawScore = met;
  }
  // SAFETY: met is at most checks.length (5) and the labels array is indexed by
  // the same bounds; 0 covers the empty-value branch.

  const score = rawScore as PasswordStrength["score"];

  return { score, label: labels[score], checks };
}

/** Met requirements render in success color; unmet stay muted. */
function checkColorClass(met: boolean) {
  if (met) return "text-success";

  return "text-muted-foreground";
}

const strengthColors = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-info",
  "bg-success",
];

interface PasswordInputProps extends Omit<
  InputProps,
  "type" | "suffix" | "showCopy"
> {
  /** Show a live strength meter + requirement checklist below the field. */
  showStrength?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  // oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
  (
    {
      showStrength = false,
      value,
      onChange,
      autoComplete = "new-password",
      className,
      size,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(false);
    const describedById = React.useId();
    const reducedMotion = useReducedMotion();

    let strength: PasswordStrength | null = null;

    if (showStrength) {
      strength = scorePassword(String(value ?? ""));
    }

    let inputType = "password";

    if (visible) {
      inputType = "text";
    }

    let toggleLabel = "Show password";

    if (visible) {
      toggleLabel = "Hide password";
    }

    let describedBy: string | undefined = undefined;

    if (showStrength) {
      describedBy = describedById;
    }

    return (
      <div className="w-full">
        <Input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          size={size}
          className={className}
          aria-describedby={describedBy}
          suffix={
            <button
              type="button"
              // Toggling must not steal focus from the field.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setVisible((v) => !v)}
              className="pointer-events-auto flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
              aria-label={toggleLabel}
              aria-pressed={visible}
            >
              {visible && <IconEyeOff className="h-4 w-4" />}
              {!visible && <IconEye className="h-4 w-4" />}
            </button>
          }
          {...props}
        />
        {strength && (
          <InputContentView2
            describedById={describedById}
            strength={strength}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

// =============================================================================
// Tag / chips input — Base UI Combobox multiple + Chips
// =============================================================================

interface TagInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "size" | "list"
> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  size?: VariantProps<typeof inputVariants>["size"];
  /** Keys that commit the current draft as a tag. */
  separators?: string[];
  maxTags?: number;
  allowDuplicates?: boolean;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (props, ref) => {
    const model = useTagInputModel(props, ref);

    return <TagInputView {...model} />;
  },
);

TagInput.displayName = "TagInput";

export {
  Input,
  inputVariants,
  CharacterCounter,
  NumericInput,
  InputWithLabel,
  InputWithButton,
  InputWithSpinner,
  InputWithTooltip,
  InputWithDropdown,
  InputCluster,
  CurrencyInput,
  PercentageInput,
  DecimalInput,
  SearchInput,
  OTPInput,
  otpInputVariants,
  otpContainerVariants,
  Rating,
  RatingDisplay,
  ratingVariants,
  ratingItemVariants,
  PasswordInput,
  TagInput,
};

export type {
  InputProps,
  NumericInputProps,
  InputWithLabelProps,
  InputWithButtonProps,
  InputWithSpinnerProps,
  InputWithTooltipProps,
  InputWithDropdownProps,
  InputClusterProps,
  CurrencyInputProps,
  PercentageInputProps,
  DecimalInputProps,
  SearchInputProps,
  OTPInputProps,
  OTPInputType,
  RatingProps,
  RatingDisplayProps,
  PasswordInputProps,
  TagInputProps,
};

function keyedTags(tags: readonly string[]) {
  const occurrences = new Map<string, number>();

  return tags.map((tag) => {
    const occurrence = occurrences.get(tag) ?? 0;
    occurrences.set(tag, occurrence + 1);

    return { tag, key: JSON.stringify([tag, occurrence]) };
  });
}

function useDecimalInputChange(
  fractionDigits: number,
  setInternalValue: React.Dispatch<React.SetStateAction<number | null>>,
  onChange?: (value: number | null) => void,
) {
  return React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      inputUseCallback(e, setInternalValue, onChange, fractionDigits),
    [fractionDigits, setInternalValue, onChange],
  );
}

function resolveInputOptions({
  size = "default",
  step = 1,
  showClear = false,
  showCopy = false,
  showCount = false,
}: {
  size?: InputSize | null;
  step?: string | number;
  showClear?: boolean;
  showCopy?: boolean;
  showCount?: boolean;
}) {
  return { size, step, showClear, showCopy, showCount };
}

function resolveSearchInputOptions({
  debounceMs = 300,
  isLoading = false,
  showClear = true,
  placeholder = "Search...",
}: {
  debounceMs?: SearchInputProps["debounceMs"];
  isLoading?: SearchInputProps["isLoading"];
  showClear?: SearchInputProps["showClear"];
  placeholder?: SearchInputProps["placeholder"];
}) {
  return { debounceMs, isLoading, showClear, placeholder };
}

function resolveInputOptions2({
  length = 6,
  type = "numeric",
  mask = false,
  autoSubmit = false,
  value = "",
  disabled = false,
}: {
  length?: 4 | 5 | 6 | 7 | 8;
  type?: OTPInputType;
  mask?: boolean;
  autoSubmit?: boolean;
  value?: string;
  disabled?: boolean;
}) {
  return { length, type, mask, autoSubmit, value, disabled };
}

function resolveInputOptions3({
  invalid = false,
  size = "default",
  variant = "default",
  gap = "default",
  placeholder = "○",
  ariaLabel = "One-time password",
}: {
  invalid?: boolean;
  size?: "default" | "sm" | "lg" | null;
  variant?: "default" | "outline" | "filled" | null;
  gap?: "default" | "sm" | "lg";
  placeholder?: string;
  ariaLabel?: string;
}) {
  return { invalid, size, variant, gap, placeholder, ariaLabel };
}

function resolveInputOptions4({
  defaultValue = 0,
  max = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  readOnly = false,
}: {
  defaultValue?: RatingProps["defaultValue"];
  max?: RatingProps["max"];
  allowHalf?: RatingProps["allowHalf"];
  allowClear?: RatingProps["allowClear"];
  disabled?: RatingProps["disabled"];
  readOnly?: RatingProps["readOnly"];
}) {
  return { defaultValue, max, allowHalf, allowClear, disabled, readOnly };
}

function resolveInputOptions5({
  size = "default",
  color = "yellow",
  showValue = false,
  ariaLabel = "Rating",
}: {
  size?: RatingProps["size"];
  color?: RatingProps["color"];
  showValue?: RatingProps["showValue"];
  ariaLabel?: RatingProps["aria-label"];
}) {
  return { size, color, showValue, ariaLabel };
}

function resolveInputOptions6({
  defaultValue = [],
  size = "default",
  separators = ["Enter", ","],
  allowDuplicates = false,
  placeholder = "Add tag…",
}: {
  defaultValue?: TagInputProps["defaultValue"];
  size?: TagInputProps["size"];
  separators?: TagInputProps["separators"];
  allowDuplicates?: TagInputProps["allowDuplicates"];
  placeholder?: TagInputProps["placeholder"];
}) {
  return { defaultValue, size, separators, allowDuplicates, placeholder };
}

function InputContentView({
  showClearButton,
  onClear,
  iconSize,
  showCopy,
  onCopy,
  copyButtonLabel,
  copyButtonIcon,
}: {
  showClearButton: boolean;
  onClear: () => void;
  iconSize: "h-3 w-3" | "h-4 w-4";
  showCopy: boolean;
  onCopy: () => void;
  copyButtonLabel: string;
  copyButtonIcon: React.JSX.Element;
}) {
  return (
    <div className="flex items-center gap-1">
      {showClearButton && (
        <button
          type="button"
          onClick={onClear}
          className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-sm"
          aria-label="Clear input"
        >
          <IconX className={iconSize} />
        </button>
      )}
      {showCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-sm"
          aria-label={copyButtonLabel}
        >
          {copyButtonIcon}
        </button>
      )}
    </div>
  );
}

function InputContentView2({
  describedById,
  strength,
  reducedMotion,
}: {
  describedById: string;
  strength: PasswordStrength;
  reducedMotion: boolean;
}) {
  return (
    <div id={describedById} className="mt-2 space-y-1.5">
      <Meter.Root
        value={strength.score * 25}
        min={0}
        max={100}
        aria-valuetext={`${strength.label} (${strength.score} of 4)`}
        className="flex items-center gap-2"
      >
        {/* kira-kit-ignore spacing-scale: data-viz track hairline, not a control height */}
        <Meter.Track className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <Meter.Indicator
            className={cn(
              strengthColors[strength.score],
              "h-full rounded-full",
              {
                // kira-kit-ignore layout-transitions: meter fill width is the value animation, driven by Base UI inline width
                "transition-[width,background-color] duration-300":
                  !reducedMotion,
              },
            )}
          />
        </Meter.Track>
        <span className="w-16 text-right text-xs font-medium tabular-nums text-muted-foreground">
          {strength.label}
        </span>
      </Meter.Root>
      <ul className="space-y-0.5">
        {strength.checks.map((c) => (
          // kira-kit-ignore spacing-scale: meter label row keeps the compact optical gap
          <li
            key={c.label}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              checkColorClass(c.met),
            )}
          >
            {c.met && <IconCheck className="h-3 w-3" />}
            {!c.met && <IconX className="h-3 w-3 opacity-50" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function useSearchInputModel({
  value,
  onChange,
  onSearch,
  debounceMs: debounceMsInput,
  isLoading: isLoadingInput,
  showClear: showClearInput,
  className,
  size,
  placeholder: placeholderInput,
  ...props
}: SearchInputProps) {
  const { debounceMs, isLoading, showClear, placeholder } =
    useSearchInputOptions({
      debounceMs: debounceMsInput,
      isLoading: isLoadingInput,
      showClear: showClearInput,
      placeholder: placeholderInput,
    });

  const [internalValue, setInternalValue] = React.useState(value || "");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const effectiveValue = value === undefined ? internalValue : value;

  const effectiveSize = size || "default";

  const iconSize = SEARCH_ICON_SIZE[effectiveSize];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    inputHandleChange(
      e,
      value,
      setInternalValue,
      onChange,
      debounceRef,
      onSearch,
      debounceMs,
    );

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("");
    }

    onChange?.("");
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    inputHandleKeyDown(
      e,
      debounceRef,
      onSearch,
      effectiveValue,
      handleClear,
      inputRef,
    );

  React.useEffect(() => () => cancelSearchDebounce(debounceRef), []);

  let suffix: React.ReactNode = undefined;

  if (isLoading) {
    suffix = (
      <IconLoader2
        className={cn(iconSize, "animate-spin text-muted-foreground")}
      />
    );
  }

  return {
    iconSize,
    inputRef,
    className,
    size,
    effectiveValue,
    handleChange,
    handleKeyDown,
    placeholder,
    showClear,
    handleClear,
    suffix,
    props,
  };
}

function SearchInputView({
  iconSize,
  inputRef,
  className,
  size,
  effectiveValue,
  handleChange,
  handleKeyDown,
  placeholder,
  showClear,
  handleClear,
  suffix,
  props,
}: ReturnType<typeof useSearchInputModel>) {
  const effectiveSize = size || "default";

  return (
    <div className="relative flex items-center">
      <div
        className={cn(
          "absolute flex items-center pointer-events-none text-muted-foreground z-10",
          PREFIX_INSET[effectiveSize],
        )}
      >
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Input
        ref={inputRef}
        type="search"
        className={cn(
          PREFIX_PADDING[effectiveSize],

          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          className,
        )}
        size={size}
        value={effectiveValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        showClear={showClear}
        onClear={handleClear}
        suffix={suffix}
        {...props}
      />
    </div>
  );
}

function useRatingModel(
  {
    value: controlledValue,
    defaultValue: defaultValueInput,
    onChange,
    max: maxInput,
    allowHalf: allowHalfInput,
    allowClear: allowClearInput,
    disabled: disabledInput,
    readOnly: readOnlyInput,
    size: sizeInput,
    color: colorInput,
    showValue: showValueInput,
    filledIcon,
    emptyIcon,
    halfIcon,
    tooltipFormatter,
    className,
    "aria-label": ariaLabelInput,
    "aria-describedby": ariaDescribedBy,
    ...props
  }: RatingProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { defaultValue, max, allowHalf, allowClear, disabled, readOnly } =
    useInputOptions4({
      defaultValue: defaultValueInput,
      max: maxInput,
      allowHalf: allowHalfInput,
      allowClear: allowClearInput,
      disabled: disabledInput,
      readOnly: readOnlyInput,
    });

  const { size, color, showValue, ariaLabel } = useInputOptions5({
    size: sizeInput,
    color: colorInput,
    showValue: showValueInput,
    ariaLabel: ariaLabelInput,
  });

  const { currentValue, displayValue, handleKeyDown, stars } =
    useRatingInteraction({
      controlledValue,
      defaultValue,
      onChange,
      max,
      allowHalf,
      allowClear,
      disabled,
      readOnly,
      color,
      filledIcon,
      emptyIcon,
      halfIcon,
      tooltipFormatter,
    });

  return {
    ref,
    ariaLabel,
    ariaDescribedBy,
    disabled,
    readOnly,
    currentValue,
    handleKeyDown,
    size,
    className,
    props,
    stars,
    showValue,
    displayValue,
    allowHalf,
  };
}

function RatingView({
  ref,
  ariaLabel,
  ariaDescribedBy,
  disabled,
  readOnly,
  currentValue,
  handleKeyDown,
  size,
  className,
  props,
  stars,
  showValue,
  displayValue,
  allowHalf,
}: ReturnType<typeof useRatingModel>) {
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      data-slot="rating"
      data-value={currentValue}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(ratingVariants({ size }), className)}
      {...props}
    >
      {stars}
      {showValue && (
        <span
          className="ml-2 text-sm font-medium tabular-nums text-muted-foreground"
          aria-hidden="true"
        >
          {displayValue.toFixed(ratingDigits(allowHalf))}
        </span>
      )}
    </div>
  );
}

function useTagInputModel(
  {
    value,
    defaultValue: defaultValueInput,
    onChange,
    size: sizeInput,
    separators: separatorsInput,
    maxTags,
    allowDuplicates: allowDuplicatesInput,
    className,
    disabled,
    placeholder: placeholderInput,
    ...props
  }: TagInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { defaultValue, size, separators, allowDuplicates, placeholder } =
    useInputOptions6({
      defaultValue: defaultValueInput,
      size: sizeInput,
      separators: separatorsInput,
      allowDuplicates: allowDuplicatesInput,
      placeholder: placeholderInput,
    });

  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const tags = value ?? internal;
  const [draft, setDraft] = React.useState("");

  const commit = (next: string[]) => {
    setInternal(next);
    onChange?.(next);
  };

  const addDraft = () =>
    inputAddDraft(draft, maxTags, tags, allowDuplicates, commit, setDraft);

  let tagPlaceholder = "";

  if (tags.length === 0) {
    tagPlaceholder = placeholder ?? "";
  }

  return {
    tags,
    commit,
    draft,
    setDraft,
    disabled,
    size,
    className,
    ref,
    tagPlaceholder,
    separators,
    addDraft,
    props,
  };
}

function TagInputView({
  tags,
  commit,
  draft,
  setDraft,
  disabled,
  size,
  className,
  ref,
  tagPlaceholder,
  separators,
  addDraft,
  props,
}: ReturnType<typeof useTagInputModel>) {
  return (
    <Combobox.Root
      multiple
      value={tags}
      onValueChange={(next) => commit([...next])}
      inputValue={draft}
      onInputValueChange={(next) => setDraft(next)}
      disabled={disabled}
      open={false}
    >
      {/* kira-kit-ignore spacing-scale: TagInput chip metrics are a documented exception */}
      <Combobox.Chips
        data-slot="tag-input"
        className={cn(
          inputVariants({ size }),
          "flex h-auto flex-wrap items-center gap-1.5 py-1",
          TAG_INPUT_MIN_HEIGHT[size || "default"],
          { "pointer-events-none opacity-50": disabled },
          className,
        )}
      >
        {keyedTags(tags).map(({ tag, key }) => (
          // kira-kit-ignore spacing-scale: TagInput chip metrics are a documented exception
          <Combobox.Chip
            key={key}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium"
          >
            {tag}
            <Combobox.ChipRemove
              className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${tag}`}
            >
              <IconX className="h-3 w-3" />
            </Combobox.ChipRemove>
          </Combobox.Chip>
        ))}
        <Combobox.Input
          ref={ref}
          placeholder={tagPlaceholder}
          className="h-6 min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (separators.includes(e.key)) {
              e.preventDefault();
              addDraft();
            } else if (e.key === "Backspace" && !draft && tags.length > 0) {
              commit(tags.slice(0, -1));
            }
          }}
          onBlur={() => addDraft()}
          {...props}
        />
      </Combobox.Chips>
    </Combobox.Root>
  );
}

function useInputOptions({
  size: sizeInput,
  step: stepInput,
  showClear: showClearInput,
  showCopy: showCopyInput,
  showCount: showCountInput,
}: Parameters<typeof resolveInputOptions>[0]) {
  return React.useMemo(
    () =>
      resolveInputOptions({
        size: sizeInput,
        step: stepInput,
        showClear: showClearInput,
        showCopy: showCopyInput,
        showCount: showCountInput,
      }),
    [sizeInput, stepInput, showClearInput, showCopyInput, showCountInput],
  );
}

function useInputOptions2({
  length: lengthInput,
  type: typeInput,
  mask: maskInput,
  autoSubmit: autoSubmitInput,
  value: valueInput,
  disabled: disabledInput,
}: Parameters<typeof resolveInputOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveInputOptions2({
        length: lengthInput,
        type: typeInput,
        mask: maskInput,
        autoSubmit: autoSubmitInput,
        value: valueInput,
        disabled: disabledInput,
      }),
    [
      lengthInput,
      typeInput,
      maskInput,
      autoSubmitInput,
      valueInput,
      disabledInput,
    ],
  );
}

function useInputOptions3({
  invalid: invalidInput,
  size: sizeInput,
  variant: variantInput,
  gap: gapInput,
  placeholder: placeholderInput,
  ariaLabel: ariaLabelInput,
}: Parameters<typeof resolveInputOptions3>[0]) {
  return React.useMemo(
    () =>
      resolveInputOptions3({
        invalid: invalidInput,
        size: sizeInput,
        variant: variantInput,
        gap: gapInput,
        placeholder: placeholderInput,
        ariaLabel: ariaLabelInput,
      }),
    [
      invalidInput,
      sizeInput,
      variantInput,
      gapInput,
      placeholderInput,
      ariaLabelInput,
    ],
  );
}

function useSearchInputOptions({
  debounceMs: debounceMsInput,
  isLoading: isLoadingInput,
  showClear: showClearInput,
  placeholder: placeholderInput,
}: Parameters<typeof resolveSearchInputOptions>[0]) {
  return React.useMemo(
    () =>
      resolveSearchInputOptions({
        debounceMs: debounceMsInput,
        isLoading: isLoadingInput,
        showClear: showClearInput,
        placeholder: placeholderInput,
      }),
    [debounceMsInput, isLoadingInput, showClearInput, placeholderInput],
  );
}

function useInputOptions4({
  defaultValue: defaultValueInput,
  max: maxInput,
  allowHalf: allowHalfInput,
  allowClear: allowClearInput,
  disabled: disabledInput,
  readOnly: readOnlyInput,
}: Parameters<typeof resolveInputOptions4>[0]) {
  return React.useMemo(
    () =>
      resolveInputOptions4({
        defaultValue: defaultValueInput,
        max: maxInput,
        allowHalf: allowHalfInput,
        allowClear: allowClearInput,
        disabled: disabledInput,
        readOnly: readOnlyInput,
      }),
    [
      defaultValueInput,
      maxInput,
      allowHalfInput,
      allowClearInput,
      disabledInput,
      readOnlyInput,
    ],
  );
}

function useInputOptions5({
  size: sizeInput,
  color: colorInput,
  showValue: showValueInput,
  ariaLabel: ariaLabelInput,
}: Parameters<typeof resolveInputOptions5>[0]) {
  return React.useMemo(
    () =>
      resolveInputOptions5({
        size: sizeInput,
        color: colorInput,
        showValue: showValueInput,
        ariaLabel: ariaLabelInput,
      }),
    [sizeInput, colorInput, showValueInput, ariaLabelInput],
  );
}

function useInputOptions6({
  defaultValue: defaultValueInput,
  size: sizeInput,
  separators: separatorsInput,
  allowDuplicates: allowDuplicatesInput,
  placeholder: placeholderInput,
}: Parameters<typeof resolveInputOptions6>[0]) {
  return React.useMemo(
    () =>
      resolveInputOptions6({
        defaultValue: defaultValueInput,
        size: sizeInput,
        separators: separatorsInput,
        allowDuplicates: allowDuplicatesInput,
        placeholder: placeholderInput,
      }),
    [
      defaultValueInput,
      sizeInput,
      separatorsInput,
      allowDuplicatesInput,
      placeholderInput,
    ],
  );
}

function inputHandleClear(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onClear: (() => void) | undefined,
) {
  const input = inputRef.current;

  if (input) {
    // Bypass React's value tracker so it creates a real change event.
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  onClear?.();
  input?.focus();
}

async function inputHandleCopy(
  inputRef: React.RefObject<HTMLInputElement | null>,
  value: string | number | readonly string[] | undefined,
  setCopied: React.Dispatch<React.SetStateAction<boolean>>,
  onCopySuccess: (() => void) | undefined,
  copiedTimeoutRef: React.RefObject<number | null>,
  onCopyError: ((error: Error) => void) | undefined,
) {
  const textToCopy = inputRef.current?.value ?? String(value ?? "");

  try {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard");
    onCopySuccess?.();

    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
    }

    copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  } catch (error) {
    toast.error("Failed to copy to clipboard");
    onCopyError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

function inputFormat(
  num: number,
  locale: string | undefined,
  currency: string,
  fractionDigits: number,
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(num);
  } catch {
    return num.toFixed(fractionDigits);
  }
}

function inputUseCallback(
  e: React.ChangeEvent<HTMLInputElement, Element>,
  setInternalValue: React.Dispatch<React.SetStateAction<number | null>>,
  onChange: ((value: number | null) => void) | undefined,
  fractionDigits: number,
) {
  const raw = e.target.value;
  const digits = raw.replace(/[^\d]/g, "");

  if (!digits) {
    setInternalValue(null);
    onChange?.(null);

    return;
  }

  const int = parseInt(digits, 10);
  const factor = Math.pow(10, fractionDigits);
  const num = int / factor;

  setInternalValue(num);
  onChange?.(num);
}

function cancelSearchDebounce(timer: React.RefObject<number | null>) {
  if (timer.current !== null) clearTimeout(timer.current);
  timer.current = null;
}

function inputHandleChange(
  e: React.ChangeEvent<HTMLInputElement, Element>,
  value: string | undefined,
  setInternalValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: ((value: string) => void) | undefined,
  debounceRef: React.RefObject<number | null>,
  onSearch: ((value: string) => void) | undefined,
  debounceMs: number,
) {
  const newValue = e.target.value;

  if (value === undefined) {
    setInternalValue(newValue);
  }

  onChange?.(newValue);

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  debounceRef.current = setTimeout(() => {
    onSearch?.(newValue);
  }, debounceMs);
}

function inputHandleKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  debounceRef: React.RefObject<number | null>,
  onSearch: ((value: string) => void) | undefined,
  effectiveValue: string,
  handleClear: () => void,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  if (e.key === "Enter") {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    onSearch?.(effectiveValue);
  }

  if (e.key === "Escape") {
    handleClear();
    inputRef.current?.blur();
  }
}

function inputHandleMouseMove(
  index: number,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  disabled: boolean,
  readOnly: boolean,
  allowHalf: boolean,
  setHoverValue: React.Dispatch<React.SetStateAction<number | null>>,
) {
  if (disabled || readOnly) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const isLeftHalf = x < rect.width / 2;

  if (allowHalf && isLeftHalf) {
    setHoverValue(index + 0.5);
  } else {
    setHoverValue(index + 1);
  }
}

function inputHandleClick(
  index: number,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  disabled: boolean,
  readOnly: boolean,
  allowHalf: boolean,
  handleRatingChange: (newValue: number) => void,
) {
  if (disabled || readOnly) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const isLeftHalf = x < rect.width / 2;

  if (allowHalf && isLeftHalf) {
    handleRatingChange(index + 0.5);
  } else {
    handleRatingChange(index + 1);
  }
}

function inputAddDraft(
  draft: string,
  maxTags: number | undefined,
  tags: string[],
  allowDuplicates: boolean,
  commit: (next: string[]) => void,
  setDraft: React.Dispatch<React.SetStateAction<string>>,
) {
  const tag = draft.trim();

  if (!tag) return;

  if (maxTags !== undefined && tags.length >= maxTags) return;

  if (!allowDuplicates && tags.includes(tag)) return;

  commit([...tags, tag]);
  setDraft("");
}

function useNumericInputDefaults({
  step: stepInput,
  scrub: scrubInput,
  showButtons: showButtonsInput,
  size: sizeInput,
}: {
  step?: NumericInputProps["step"];
  scrub?: NumericInputProps["scrub"];
  showButtons?: NumericInputProps["showButtons"];
  size?: NumericInputProps["size"];
}) {
  return React.useMemo(() => {
    const {
      step = 1,
      scrub = false,
      showButtons = true,
      size = "default",
    } = {
      step: stepInput,
      scrub: scrubInput,
      showButtons: showButtonsInput,
      size: sizeInput,
    };

    return { step, scrub, showButtons, size };
  }, [stepInput, scrubInput, showButtonsInput, sizeInput]);
}

type RatingInteractionOptions = Pick<
  RatingProps,
  "onChange" | "filledIcon" | "emptyIcon" | "halfIcon" | "tooltipFormatter"
> &
  ReturnType<typeof useInputOptions4> & {
    controlledValue: RatingProps["value"];
    color: ReturnType<typeof useInputOptions5>["color"];
  };

function useRatingInteraction(options: RatingInteractionOptions) {
  const {
    controlledValue,
    defaultValue,
    onChange,
    allowHalf,
    allowClear,
    disabled,
    readOnly,
  } = options;

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const currentValue = controlledValue ?? internalValue;

  const displayValue = hoverValue ?? currentValue;

  const handleRatingChange = (newValue: number) => {
    if (disabled || readOnly) return;

    let finalValue = newValue;

    if (allowClear && newValue === currentValue) {
      finalValue = 0;
    }

    if (controlledValue === undefined) {
      setInternalValue(finalValue);
    }

    onChange?.(finalValue);
  };

  const handleMouseMove = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) =>
    inputHandleMouseMove(
      index,
      e,
      disabled,
      readOnly,
      allowHalf,
      setHoverValue,
    );

  const handleClick = (index: number, e: React.MouseEvent<HTMLButtonElement>) =>
    inputHandleClick(
      index,
      e,
      disabled,
      readOnly,
      allowHalf,
      handleRatingChange,
    );

  const handleKeyDown = (e: React.KeyboardEvent) =>
    ratingKeyboardChange(e, options, currentValue, setInternalValue);

  const stars = (
    <RatingStars
      options={options}
      currentValue={currentValue}
      displayValue={displayValue}
      handleClick={handleClick}
      handleMouseMove={handleMouseMove}
      setHoverValue={setHoverValue}
    />
  );

  return { currentValue, displayValue, handleKeyDown, stars };
}

function ratingKeyboardChange(
  e: React.KeyboardEvent,
  options: RatingInteractionOptions,
  currentValue: number,
  setInternalValue: React.Dispatch<React.SetStateAction<number>>,
) {
  const { disabled, readOnly, allowHalf, max, controlledValue, onChange } =
    options;

  if (disabled || readOnly) return;
  const newValue = ratingKeyboardValue(e.key, currentValue, max, allowHalf);

  if (newValue === undefined) return;
  e.preventDefault();

  if (controlledValue === undefined) {
    setInternalValue(newValue);
  }

  onChange?.(newValue);
}

function RatingStars({
  options,
  currentValue,
  displayValue,
  handleClick,
  handleMouseMove,
  setHoverValue,
}: {
  options: RatingInteractionOptions;
  currentValue: number;
  displayValue: number;
  handleClick: (index: number, e: React.MouseEvent<HTMLButtonElement>) => void;
  handleMouseMove: (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  setHoverValue: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const { max, allowHalf, disabled, readOnly, color, tooltipFormatter } =
    options;

  const renderStar = (index: number) =>
    ratingStarIcon(index, displayValue, options);

  const getTooltip = (value: number) =>
    tooltipFormatter ? tooltipFormatter(value) : `${value} of ${max}`;

  const stars = Array.from({ length: max }, (_, index) => {
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;

    const isHalfFilled =
      allowHalf && displayValue >= index + 0.5 && displayValue < starValue;

    let starColor: typeof color | undefined;

    if (isFilled || isHalfFilled) {
      starColor = color;
    }

    return (
      <button
        key={index}
        type="button"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Pointer-position half ratings use this button as an ARIA radio in the keyboard-managed rating group.
        role="radio"
        aria-checked={currentValue >= starValue}
        aria-label={`Rate ${starValue} out of ${max}`}
        tabIndex={ratingTabIndex(disabled, readOnly, index)}
        disabled={disabled}
        title={getTooltip(starValue)}
        className={cn(
          ratingItemVariants({
            color: starColor,
            disabled,
            readOnly,
          }),
          { "text-muted-foreground/40": !isFilled && !isHalfFilled },
          { "hover:scale-110": !disabled && !readOnly },
        )}
        onClick={(e) => handleClick(index, e)}
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={() => setHoverValue(null)}
        onFocus={() => !readOnly && setHoverValue(index + 1)}
        onBlur={() => setHoverValue(null)}
      >
        {renderStar(index)}
      </button>
    );
  });

  return <>{stars}</>;
}

function ratingStarIcon(
  index: number,
  displayValue: number,
  { allowHalf, filledIcon, halfIcon, emptyIcon }: RatingInteractionOptions,
) {
  const fillAmount = displayValue - index;

  if (fillAmount >= 1) {
    return filledIcon || <IconStarFilled />;
  } else if (fillAmount >= 0.5 && allowHalf) {
    return halfIcon || <IconStarHalfFilled />;
  } else {
    return emptyIcon || <IconStar />;
  }
}

function ratingKeyboardValue(
  key: string,
  value: number,
  max: number,
  allowHalf: boolean,
) {
  const step = allowHalf ? 0.5 : 1;

  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return Math.min(max, value + step);
    case "ArrowLeft":
    case "ArrowDown":
      return Math.max(0, value - step);
    case "Home":
      return 0;
    case "End":
      return max;
    default:
      return undefined;
  }
}
