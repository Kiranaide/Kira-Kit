/* eslint-disable react-refresh/only-export-components */
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
import { cn } from "@/lib/utils";
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
        xs: "h-6 px-2 py-0.5 text-xs file:h-5 file:text-xs",
        sm: "h-7 px-2 py-1 text-[0.8rem] file:h-5.5 file:text-xs",
        default: "h-8 px-2.5 py-1 text-base md:text-sm file:h-6 file:text-sm",
        lg: "h-9 px-3 py-1.5 text-base md:text-sm file:h-7 file:text-sm",
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
          nearLimit && "text-warning",
          atLimit && "text-destructive",
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
    Omit<React.ComponentProps<"input">, "prefix" | "size">,
    VariantProps<typeof inputVariants> {
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

const PREFIX_PADDING = {
  xs: "pl-7",
  sm: "pl-7",
  default: "pl-8",
  lg: "pl-9",
} as const;

const SUFFIX_PADDING = {
  xs: "pr-7",
  sm: "pr-7",
  default: "pr-8",
  lg: "pr-9",
} as const;

const PREFIX_CONTAINER_PADDING = {
  xs: "pl-2",
  sm: "pl-2.5",
  default: "pl-3",
  lg: "pl-3",
} as const;

const SUFFIX_CONTAINER_PADDING = {
  xs: "pr-2",
  sm: "pr-2.5",
  default: "pr-3",
  lg: "pr-3",
} as const;

const ACTION_ICON_SIZE = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-4 w-4",
} as const;

interface InputActionButtonsProps {
  show: boolean;
  showClearButton: boolean;
  showCopy: boolean;
  size: string;
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
    <div className="flex items-center gap-0.5">
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

interface UseInputActionsOptions {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: unknown;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
}

/** Clear (with synthetic change event) + copy-to-clipboard actions for Input. */
function useInputActions({
  inputRef,
  value,
  onChange,
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

  const handleClear = () => {
    onClear?.();

    if (onChange && inputRef.current) {
      // Minimal change-event stand-in: React change handlers only read
      // `target.value`, which the frozen `{ value: "" }` below satisfies.
      // SAFETY: Event lacks React's change-event shape; the frozen target
      // patch below adds the only member handlers read (`.target.value`).
      const event = new Event("input", {
        bubbles: true,
      }) as React.ChangeEvent<HTMLInputElement>;

      Object.defineProperty(event, "target", {
        writable: false,
        value: { value: "" },
      });
      onChange(event);
    }

    inputRef.current?.focus();
  };

  const handleCopy = async () => {
    const textToCopy = inputRef.current?.value || String(value || "");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Copied to clipboard");
      onCopySuccess?.();

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = window.setTimeout(
        () => setCopied(false),
        2000,
      );
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      // SAFETY: catch only fires on clipboard rejection; the thrown unknown is
      // surfaced to the onCopyError contract typed as Error.
      onCopyError?.(error as Error);
    }
  };

  return { copied, handleClear, handleCopy };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefix,
      suffix,
      size = "default",
      disabled,
      min,
      max,
      step = 1,
      value,
      onChange,
      showClear = false,
      onClear,
      showCopy = false,
      onCopySuccess,
      onCopyError,
      showCount = false,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const reducedMotion = useReducedMotion();

    // SAFETY: inputRef is created above with HTMLInputElement type param; the
    // ref is only attached to the InputPrimitive rendered below.
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const { copied, handleCopy } = useInputActions({
      value,
      onChange,
      onClear,
      onCopySuccess,
      onCopyError,
    });

    return InputFieldView({
      className,
      type,
      prefix,
      suffix,
      size,
      disabled,
      min,
      max,
      step,
      value,
      onChange,
      showClear,
      onClear,
      showCopy,
      copied,
      onCopy: handleCopy,
      showCount,
      maxLength,
      inputRef,
      reducedMotion,
      props,
    });
  },
);

interface InputFieldViewOptions {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: VariantProps<typeof inputVariants>["size"];
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value: unknown;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  showClear?: boolean;
  onClear?: () => void;
  showCopy?: boolean;
  copied: boolean;
  onCopy: () => void;
  showCount?: boolean;
  maxLength?: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  reducedMotion: boolean;
  props: Omit<React.ComponentProps<"input">, keyof InputFieldViewOptions>;
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
        isNumeric &&
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
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
  onClear?: () => void;
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
): string {
  if (showClear && showCopy) return "pr-14";

  if (showClear || showCopy) return "pr-9";

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

  const showClearButton = hasClearAffordance(value, showClear, disabled);

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

  const actionButtonsPadding = resolveActionButtonsPadding(showClear, showCopy);

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
  step = 1,
  smallStep,
  largeStep,
  allowOutOfRange,
  scrub = false,
  showButtons = true,
  className,
  disabled,
  size = "default",
  ...props
}: NumericInputProps) {
  const handleValueChange = (next: number | null) => {
    onValueChange?.(next);
  };

  const inputClasses = cn(
    inputVariants({ size }),
    transitionClasses,
    "min-w-0 flex-1",
    showButtons &&
      "rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    className,
  );

  let scrubArea: React.ReactNode;

  if (scrub) {
    scrubArea = (
      <NumberField.ScrubArea className="flex flex-1 items-center">
        <NumberField.Input
          data-slot="numeric-input"
          className={inputClasses}
          {...props}
        />
        <NumberField.ScrubAreaCursor className="cursor-ew-resize" />
      </NumberField.ScrubArea>
    );
  } else {
    scrubArea = (
      <NumberField.Input
        data-slot="numeric-input"
        className={inputClasses}
        {...props}
      />
    );
  }

  return (
    <NumberField.Root
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
      <NumberField.Group className="flex items-center">
        {showButtons && (
          <NumberField.Decrement
            data-slot="numeric-input-decrement"
            className="flex h-8 w-8 items-center justify-center rounded-l-lg border border-r-0 border-input hover:bg-muted/50 dark:bg-input/30 dark:hover:bg-input/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconMinus className="h-3 w-3" />
          </NumberField.Decrement>
        )}
        {scrubArea}
        {showButtons && (
          <NumberField.Increment
            data-slot="numeric-input-increment"
            className="flex h-8 w-8 items-center justify-center rounded-r-lg border border-l-0 border-input hover:bg-muted/50 dark:bg-input/30 dark:hover:bg-input/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconPlus className="h-3 w-3" />
          </NumberField.Increment>
        )}
      </NumberField.Group>
    </NumberField.Root>
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

  const format = (num: number) => {
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
  };

  let displayValue = "";

  if (!(effectiveValue == null || Number.isNaN(effectiveValue))) {
    displayValue = format(effectiveValue);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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
  // Button heights are one step above input heights (h-9 vs h-8 …), so step
  // down to keep the button the same height as the joined input.
  const sizeToButton: Record<
    "xs" | "sm" | "default" | "lg",
    VariantProps<typeof buttonVariants>["size"]
  > = {
    xs: "xs",
    sm: "xs",
    default: "sm",
    lg: "default",
  };

  const buttonSize = sizeToButton[size ?? "default"];

  return (
    <div className="flex items-center">
      {buttonPosition === "left" && (
        <Button
          type="button"
          variant={buttonVariant}
          size={buttonSize}
          onClick={onButtonClick}
          className="rounded-r-none border-r-0 transition-colors"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
      <Input
        className={cn(
          buttonPosition === "left" && "rounded-l-none",
          buttonPosition === "right" && "rounded-r-none",
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
          size={buttonSize}
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
  return (
    <div className="relative">
      <Input
        className={cn(isLoading && "pr-10", className)}
        size={size}
        {...props}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
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
      <TooltipTrigger>
        <Input className={className} size={size} {...props} />
      </TooltipTrigger>
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
      className={cn(
        // Match the joined input: full input height (default size = h-8), same
        // surface as the input in both themes, seam edge squared.
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
          dropdownPosition === "left" && "rounded-l-none",
          dropdownPosition === "right" && "rounded-r-none",
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
              !isFirst && "rounded-l-none border-l-0",
              !isLast && "rounded-r-none",
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

function SearchInput({
  value,
  onChange,
  onSearch,
  debounceMs = 300,
  isLoading = false,
  showClear = true,
  className,
  size,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(value || "");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  let effectiveValue = internalValue;

  if (value !== undefined) {
    effectiveValue = value;
  }

  const effectiveSize = size || "default";

  const iconSize = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-4 w-4",
  }[effectiveSize];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("");
    }

    onChange?.("");
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  let suffix: React.ReactNode = undefined;

  if (isLoading) {
    suffix = (
      <IconLoader2
        className={cn(iconSize, "animate-spin text-muted-foreground")}
      />
    );
  }

  return (
    <div className="relative flex items-center">
      <div className="absolute left-2.5 flex items-center pointer-events-none text-muted-foreground z-10">
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
          "pl-8",

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

/** Base UI OTPField validation types; kira's `alphabetic` maps to `alpha`. */
type OTPInputType = "numeric" | "alphanumeric" | "alpha";

const otpInputVariants = cva(
  "flex items-center justify-center border bg-background text-center font-mono font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
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
      length = 6,
      type = "numeric",
      mask = false,
      autoSubmit = false,
      value = "",
      onChange,
      onComplete,
      disabled = false,
      invalid = false,
      size = "default",
      variant = "default",
      gap = "default",
      separatorAfter,
      autoFocus,
      placeholder = "○",
      className,
      "aria-label": ariaLabel = "One-time password",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
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
        className={cn(
          otpInputVariants({ size: o.size, variant: o.variant }),
          o.invalid && "border-destructive focus:ring-destructive",
        )}
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
  "transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm",
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
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      max = 5,
      allowHalf = false,
      allowClear = true,
      disabled = false,
      readOnly = false,
      size = "default",
      color = "yellow",
      showValue = false,
      filledIcon,
      emptyIcon,
      halfIcon,
      tooltipFormatter,
      className,
      "aria-label": ariaLabel = "Rating",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
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
    ) => {
      if (disabled || readOnly) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;

      if (allowHalf && isLeftHalf) {
        setHoverValue(index + 0.5);
      } else {
        setHoverValue(index + 1);
      }
    };

    const handleClick = (
      index: number,
      e: React.MouseEvent<HTMLButtonElement>,
    ) => {
      if (disabled || readOnly) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;

      if (allowHalf && isLeftHalf) {
        handleRatingChange(index + 0.5);
      } else {
        handleRatingChange(index + 1);
      }
    };

    // oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || readOnly) return;
      let step = 1;

      if (allowHalf) {
        step = 0.5;
      }

      let newValue = currentValue;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = Math.min(max, currentValue + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = Math.max(0, currentValue - step);
          break;
        case "Home":
          e.preventDefault();
          newValue = 0;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    const renderStar = (index: number) => {
      const fillAmount = displayValue - index;

      if (fillAmount >= 1) {
        return filledIcon || <IconStarFilled />;
      } else if (fillAmount >= 0.5 && allowHalf) {
        return halfIcon || <IconStarHalfFilled />;
      } else {
        return emptyIcon || <IconStar />;
      }
    };

    const getTooltip = (value: number) => {
      if (tooltipFormatter) return tooltipFormatter(value);

      return `${value} of ${max}`;
    };

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
            !isFilled && !isHalfFilled && "text-muted-foreground/40",
            !disabled && !readOnly && "hover:scale-110",
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
          <div id={describedById} className="mt-2 space-y-1.5">
            <Meter.Root
              value={strength.score * 25}
              min={0}
              max={100}
              aria-valuetext={`${strength.label} (${strength.score} of 4)`}
              className="flex items-center gap-2"
            >
              <Meter.Track className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <Meter.Indicator
                  className={cn(
                    strengthColors[strength.score],
                    "h-full rounded-full",
                    !reducedMotion && "transition-all duration-300",
                  )}
                />
              </Meter.Track>
              <span className="w-16 text-right text-xs font-medium tabular-nums text-muted-foreground">
                {strength.label}
              </span>
            </Meter.Root>
            <ul className="space-y-0.5">
              {strength.checks.map((c) => (
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
  (
    {
      value,
      defaultValue = [],
      onChange,
      size = "default",
      separators = ["Enter", ","],
      maxTags,
      allowDuplicates = false,
      className,
      disabled,
      placeholder = "Add tag…",
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState<string[]>(defaultValue);
    const tags = value ?? internal;
    const [draft, setDraft] = React.useState("");

    const commit = (next: string[]) => {
      setInternal(next);
      onChange?.(next);
    };

    const addDraft = () => {
      const tag = draft.trim();

      if (!tag) return;

      if (maxTags !== undefined && tags.length >= maxTags) return;

      if (!allowDuplicates && tags.includes(tag)) return;

      commit([...tags, tag]);
      setDraft("");
    };

    let tagPlaceholder = "";

    if (tags.length === 0) {
      tagPlaceholder = placeholder ?? "";
    }

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
        <Combobox.Chips
          data-slot="tag-input"
          className={cn(
            inputVariants({ size }),
            "flex h-auto min-h-8 flex-wrap items-center gap-1.5 py-1",
            disabled && "pointer-events-none opacity-50",
            className,
          )}
        >
          {tags.map((tag, i) => (
            <Combobox.Chip
              key={`${tag}-${i}`}
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
