import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconMinus,
  IconPlus,
  IconLoader2,
  IconChevronDown,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const inputVariants = cva(
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent transition-colors file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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
  }
);

interface InputProps
  extends Omit<React.ComponentProps<"input">, "prefix" | "size">,
    VariantProps<typeof inputVariants> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  showIncrementButtons?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  size?: VariantProps<typeof inputVariants>["size"];
  // Clear functionality
  showClear?: boolean;
  onClear?: () => void;
  // Copy functionality
  showCopy?: boolean;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefix,
      suffix,
      size = "default",
      showIncrementButtons = false,
      onIncrement,
      onDecrement,
      disabled,
      min,
      max,
      step = 1,
      value,
      onChange,
      // Clear/Copy functionality
      showClear = false,
      onClear,
      showCopy = false,
      onCopySuccess,
      onCopyError,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [copied, setCopied] = React.useState(false);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const isNumeric = type === "number";
    const showButtons = isNumeric && showIncrementButtons;

    const effectiveSize = size || "default";

    // Determine if clear button should be visible
    const hasValue = String(value || "").length > 0;
    const showClearButton = showClear && hasValue && !disabled;

    // Handle clear
    const handleClear = () => {
      onClear?.();
      if (onChange && inputRef.current) {
        const event = new Event("input", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: false,
          value: { value: "" },
        });
        onChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
      }
      inputRef.current?.focus();
    };

    // Handle copy
    const handleCopy = async () => {
      const textToCopy = inputRef.current?.value || String(value || "");
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        toast.success("Copied to clipboard");
        onCopySuccess?.();
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy to clipboard");
        onCopyError?.(error as Error);
      }
    };

    // Size-aware padding for prefix/suffix
    const prefixPadding = {
      xs: "pl-7",
      sm: "pl-7",
      default: "pl-8",
      lg: "pl-9",
    }[effectiveSize];

    const suffixPadding = {
      xs: "pr-7",
      sm: "pr-7",
      default: "pr-8",
      lg: "pr-9",
    }[effectiveSize];

    const prefixContainerPadding = {
      xs: "pl-2",
      sm: "pl-2.5",
      default: "pl-3",
      lg: "pl-3",
    }[effectiveSize];

    const suffixContainerPadding = {
      xs: "pr-2",
      sm: "pr-2.5",
      default: "pr-3",
      lg: "pr-3",
    }[effectiveSize];

    // Button dimensions for increment/decrement buttons
    const buttonHeight = {
      xs: "h-6",
      sm: "h-7",
      default: "h-8",
      lg: "h-9",
    }[effectiveSize];

    const buttonWidth = {
      xs: "w-6",
      sm: "w-7",
      default: "w-8",
      lg: "w-9",
    }[effectiveSize];

    const iconSize = {
      xs: "h-2.5 w-2.5",
      sm: "h-3 w-3",
      default: "h-3 w-3",
      lg: "h-3.5 w-3.5",
    }[effectiveSize];

    // Handle increment/decrement for numeric inputs
    const handleIncrement = () => {
      if (disabled) return;

      const currentValue =
        typeof value === "number" ? value : parseFloat(String(value || 0)) || 0;
      const stepValue =
        typeof step === "number" ? step : parseFloat(String(step || 1)) || 1;
      const newValue = currentValue + stepValue;

      if (max !== undefined && typeof max === "number" && newValue > max)
        return;

      // If custom handlers provided, use them
      if (onIncrement) {
        onIncrement();
        return;
      }

      // Otherwise, update value through onChange
      if (onChange) {
        const syntheticEvent = {
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const handleDecrement = () => {
      if (disabled) return;

      const currentValue =
        typeof value === "number" ? value : parseFloat(String(value || 0)) || 0;
      const stepValue =
        typeof step === "number" ? step : parseFloat(String(step || 1)) || 1;
      const newValue = currentValue - stepValue;

      if (min !== undefined && typeof min === "number" && newValue < min)
        return;

      // If custom handlers provided, use them
      if (onDecrement) {
        onDecrement();
        return;
      }

      // Otherwise, update value through onChange
      if (onChange) {
        const syntheticEvent = {
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const inputElement = (
      <InputPrimitive
        ref={inputRef}
        type={type}
        data-slot="input"
        className={cn(
          inputVariants({ size: effectiveSize }),
          prefix && prefixPadding,
          suffix && suffixPadding,
          showButtons &&
            "rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          !showButtons &&
            isNumeric &&
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    );

    // If increment buttons are shown, wrap with buttons
    if (showButtons) {
      const numericValue =
        typeof value === "number" ? value : parseFloat(String(value || 0)) || 0;
      const minValue =
        typeof min === "number"
          ? min
          : min !== undefined
          ? parseFloat(String(min))
          : undefined;
      const maxValue =
        typeof max === "number"
          ? max
          : max !== undefined
          ? parseFloat(String(max))
          : undefined;
      const canDecrement = minValue === undefined || numericValue > minValue;
      const canIncrement = maxValue === undefined || numericValue < maxValue;

      return (
        <div className={cn("flex items-center", className)}>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || !canDecrement}
            className={cn(
              "flex items-center justify-center rounded-l-lg border border-r-0 border-input bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed",
              buttonHeight,
              buttonWidth
            )}
          >
            <IconMinus className={iconSize} />
          </button>
          {prefix || suffix ? (
            <div className="relative flex items-center flex-1">
              {prefix && (
                <div
                  className={cn(
                    "absolute left-0 flex h-full items-center text-muted-foreground pointer-events-none",
                    prefixContainerPadding
                  )}
                >
                  {prefix}
                </div>
              )}
              {inputElement}
              {suffix && (
                <div
                  className={cn(
                    "absolute right-0 flex h-full items-center text-muted-foreground pointer-events-none",
                    suffixContainerPadding
                  )}
                >
                  {suffix}
                </div>
              )}
            </div>
          ) : (
            inputElement
          )}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || !canIncrement}
            className={cn(
              "flex items-center justify-center rounded-r-lg border border-l-0 border-input bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed",
              buttonHeight,
              buttonWidth
            )}
          >
            <IconPlus className={iconSize} />
          </button>
        </div>
      );
    }

    // Size-aware icon sizes for clear/copy buttons
    const actionIconSize = {
      xs: "h-3 w-3",
      sm: "h-3.5 w-3.5",
      default: "h-4 w-4",
      lg: "h-4 w-4",
    }[effectiveSize];

    // Build action buttons for clear/copy
    const actionButtons = (showClearButton || showCopy) && (
      <div className="flex items-center gap-0.5">
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-sm p-0.5"
            aria-label="Clear input"
          >
            <svg
              className={actionIconSize}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-sm p-0.5"
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {copied ? (
              <svg
                className={cn(actionIconSize, "text-success")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className={actionIconSize}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    );

    // Combined suffix: user suffix + action buttons
    const combinedSuffix = (suffix || actionButtons) && (
      <div className="flex items-center gap-1">
        {suffix}
        {actionButtons}
      </div>
    );

    // Determine extra right padding for action buttons
    const actionButtonsPadding =
      showClear || showCopy ? (showClear && showCopy ? "pr-14" : "pr-9") : "";

    // If no prefix/suffix/actions, return simple input
    if (!prefix && !combinedSuffix) {
      return inputElement;
    }

    // With prefix/suffix/actions, wrap in container
    return (
      <div className="relative flex items-center">
        {prefix && (
          <div
            className={cn(
              "absolute left-0 flex h-full items-center text-muted-foreground pointer-events-none",
              prefixContainerPadding
            )}
          >
            {prefix}
          </div>
        )}
        {React.cloneElement(inputElement, {
          className: cn(inputElement.props.className, actionButtonsPadding),
        })}
        {combinedSuffix && (
          <div
            className={cn(
              "absolute right-0 flex h-full items-center",
              suffixContainerPadding
            )}
          >
            {combinedSuffix}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ============================================
// NUMERIC INPUT (backward compatibility wrapper)
// ============================================
interface NumericInputProps
  extends Omit<
      React.ComponentProps<"input">,
      "type" | "onChange" | "value" | "size"
    >,
    VariantProps<typeof inputVariants> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showButtons?: boolean;
}

/**
 * @deprecated Use Input with type="number" and showIncrementButtons prop instead.
 * This component is kept for backward compatibility.
 */
function NumericInput({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  showButtons = true,
  className,
  disabled,
  size = "default",
  ...props
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };

  const handleIncrement = () => {
    const newValue = (value || 0) + step;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = (value || 0) - step;
    if (min !== undefined && newValue < min) return;
    onChange?.(newValue);
  };

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      size={size}
      showIncrementButtons={showButtons}
      onIncrement={showButtons ? handleIncrement : undefined}
      onDecrement={showButtons ? handleDecrement : undefined}
      className={className}
      {...props}
    />
  );
}

// ============================================
// FORMATTED NUMERIC INPUTS
// - CurrencyInput
// - PercentageInput
// - DecimalInput
// These inputs format as you type using a fixed number of fraction digits.
// ============================================

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
    value ?? null
  );
  const [displayValue, setDisplayValue] = React.useState("");

  const effectiveValue = value ?? internalValue;

  const format = React.useCallback(
    (num: number) => {
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
    },
    [currency, fractionDigits, locale]
  );

  React.useEffect(() => {
    if (effectiveValue == null || Number.isNaN(effectiveValue)) {
      setDisplayValue("");
    } else {
      setDisplayValue(format(effectiveValue));
    }
  }, [effectiveValue, format]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/[^\d]/g, "");

    if (!digits) {
      setInternalValue(null);
      setDisplayValue("");
      onChange?.(null);
      return;
    }

    const int = parseInt(digits, 10);
    const factor = Math.pow(10, fractionDigits);
    const num = int / factor;

    setInternalValue(num);
    setDisplayValue(format(num));
    onChange?.(num);
  };

  const handleBlur = () => {
    if (effectiveValue == null || Number.isNaN(effectiveValue)) {
      setDisplayValue("");
    } else {
      setDisplayValue(format(effectiveValue));
    }
  };

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
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
    value ?? null
  );
  const [displayValue, setDisplayValue] = React.useState("");

  const effectiveValue = value ?? internalValue;

  const format = React.useCallback(
    (num: number) =>
      `${num.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })}%`,
    [fractionDigits, locale]
  );

  React.useEffect(() => {
    if (effectiveValue == null || Number.isNaN(effectiveValue)) {
      setDisplayValue("");
    } else {
      setDisplayValue(format(effectiveValue));
    }
  }, [effectiveValue, format]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/[^\d]/g, "");

    if (!digits) {
      setInternalValue(null);
      setDisplayValue("");
      onChange?.(null);
      return;
    }

    const int = parseInt(digits, 10);
    const factor = Math.pow(10, fractionDigits);
    const num = int / factor;

    setInternalValue(num);
    setDisplayValue(format(num));
    onChange?.(num);
  };

  const handleBlur = () => {
    if (effectiveValue == null || Number.isNaN(effectiveValue)) {
      setDisplayValue("");
    } else {
      setDisplayValue(format(effectiveValue));
    }
  };

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
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
    value ?? null
  );
  const [displayValue, setDisplayValue] = React.useState("");

  const effectiveValue = value ?? internalValue;

  const format = React.useCallback(
    (num: number) =>
      num.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping,
      }),
    [fractionDigits, locale, useGrouping]
  );

  React.useEffect(() => {
    if (effectiveValue == null || Number.isNaN(effectiveValue)) {
      setDisplayValue("");
    } else {
      setDisplayValue(format(effectiveValue));
    }
  }, [effectiveValue, format]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/[^\d]/g, "");

    if (!digits) {
      setInternalValue(null);
      setDisplayValue("");
      onChange?.(null);
      return;
    }

    const int = parseInt(digits, 10);
    const factor = Math.pow(10, fractionDigits);
    const num = int / factor;

    setInternalValue(num);
    setDisplayValue(format(num));
    onChange?.(num);
  };

  const handleBlur = () => {
    if (effectiveValue == null || Number.isNaN(effectiveValue)) {
      setDisplayValue("");
    } else {
      setDisplayValue(format(effectiveValue));
    }
  };

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      size={size}
      {...props}
    />
  );
}

// ============================================
// TEXTAREA FIXED (no auto-height expansion)
// ============================================
interface TextareaFixedProps extends React.ComponentProps<"textarea"> {
  rows?: number;
}

function TextareaFixed({ className, rows = 3, ...props }: TextareaFixedProps) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm placeholder:text-muted-foreground flex w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// INPUT WITH LABEL
// ============================================
interface InputWithLabelProps
  extends Omit<React.ComponentProps<"input">, "size"> {
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
  ...props
}: InputWithLabelProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Input
        id={inputId}
        className={cn(error && "border-destructive", className)}
        aria-invalid={!!error}
        size={size}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ============================================
// INPUT WITH BUTTON
// ============================================
interface InputWithButtonProps
  extends Omit<React.ComponentProps<"input">, "size"> {
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
  size,
  ...props
}: InputWithButtonProps) {
  return (
    <div className="flex">
      {buttonPosition === "left" && (
        <Button
          type="button"
          variant={buttonVariant}
          onClick={onButtonClick}
          className="rounded-r-none border-r-0"
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
          className
        )}
        size={size}
        {...props}
      />
      {buttonPosition === "right" && (
        <Button
          type="button"
          variant={buttonVariant}
          onClick={onButtonClick}
          className="rounded-l-none border-l-0"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
    </div>
  );
}

// ============================================
// INPUT WITH SPINNER
// ============================================
interface InputWithSpinnerProps
  extends Omit<React.ComponentProps<"input">, "size"> {
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

// ============================================
// INPUT WITH TOOLTIP
// ============================================
interface InputWithTooltipProps
  extends Omit<React.ComponentProps<"input">, "size"> {
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

// ============================================
// INPUT WITH DROPDOWN
// ============================================
interface InputWithDropdownProps
  extends Omit<React.ComponentProps<"input">, "onSelect" | "size"> {
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(
    options.find((o) => o.value === dropdownValue) || options[0]
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option);
    onOptionSelect?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex">
      {dropdownPosition === "left" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 items-center gap-1 rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm hover:bg-muted/80"
          >
            {selectedOption?.label}
            <IconChevronDown className="h-3 w-3" />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 min-w-24 rounded-lg border bg-popover p-1 shadow-md">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted",
                    selectedOption?.value === option.value && "bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <Input
        className={cn(
          "flex-1",
          dropdownPosition === "left" && "rounded-l-none",
          dropdownPosition === "right" && "rounded-r-none",
          className
        )}
        size={size}
        {...props}
      />
      {dropdownPosition === "right" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 items-center gap-1 rounded-r-lg border border-l-0 border-input bg-muted px-3 text-sm hover:bg-muted/80"
          >
            {selectedOption?.label}
            <IconChevronDown className="h-3 w-3" />
          </button>
          {isOpen && (
            <div className="absolute top-full right-0 z-50 mt-1 min-w-24 rounded-lg border bg-popover p-1 shadow-md">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted",
                    selectedOption?.value === option.value && "bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// INPUT CLUSTER (multiple inputs in a row - simpler pattern)
// ============================================
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
        const childClassName = (child.props as Record<string, unknown>)
          .className as string | undefined;

        return React.cloneElement(
          child as React.ReactElement<{ className?: string }>,
          {
            className: cn(
              childClassName,
              !isFirst && "rounded-l-none border-l-0",
              !isLast && "rounded-r-none"
            ),
          }
        );
      })}
    </div>
  );
}

// ============================================
// SEARCH INPUT (debounced search with loading)
// ============================================
interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "onChange"> {
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

  const effectiveValue = value !== undefined ? value : internalValue;

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

    // Debounced search
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

  // Cleanup debounce on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center">
      {/* Search icon */}
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
          // Hide native search X button since we might use our own or none
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          className
        )}
        size={size}
        value={effectiveValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        // Use the new showClear prop from Base Input
        showClear={showClear}
        onClear={handleClear}
        // If loading, show spinner in suffix (overriding clear button visibility if needed, or alongside)
        // But Input doesn't support custom suffix alongside clear button easily without layout conflict if we aren't careful.
        // Let's use suffix for the loading spinner.
        suffix={
          isLoading ? (
            <IconLoader2
              className={cn(iconSize, "animate-spin text-muted-foreground")}
            />
          ) : undefined
        }
        {...props}
      />
    </div>
  );
}

// ============================================
// OTP INPUT
// ============================================

type OTPInputType = "numeric" | "alphanumeric" | "alphabetic";

interface OTPInputRef {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

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
  }
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
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof otpInputVariants> {
  /** Number of OTP digits (4-8) */
  length?: 4 | 5 | 6 | 7 | 8;
  /** Type of allowed characters */
  type?: OTPInputType;
  /** Mask input values (show dots) */
  mask?: boolean;
  /** Auto-submit when complete */
  autoSubmit?: boolean;
  /** Current value */
  value?: string;
  /** Value change handler */
  onChange?: (value: string) => void;
  /** Called when all digits are entered */
  onComplete?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Invalid state for styling */
  invalid?: boolean;
  /** Gap between inputs */
  gap?: "sm" | "default" | "lg";
  /** Show separator after this index (e.g., 3 for "XXX-XXX") */
  separatorAfter?: number;
  /** Auto-focus first input on mount */
  autoFocus?: boolean;
  /** Placeholder character */
  placeholder?: string;
  /** Aria label for accessibility */
  "aria-label"?: string;
  /** Aria describedby for accessibility */
  "aria-describedby"?: string;
}

const OTPInput = React.forwardRef<OTPInputRef, OTPInputProps>(
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
      autoFocus = false,
      placeholder = "○",
      className,
      "aria-label": ariaLabel = "One-time password",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId();
    const [values, setValues] = React.useState<string[]>(() =>
      value.split("").slice(0, length).concat(Array(length).fill("")).slice(0, length)
    );
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // Sync external value
    React.useEffect(() => {
      const newValues = value
        .split("")
        .slice(0, length)
        .concat(Array(length).fill(""))
        .slice(0, length);
      setValues(newValues);
    }, [value, length]);

    // Auto-focus first input
    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus]);

    // Expose imperative methods
    React.useImperativeHandle(ref, () => ({
      focus: () => inputRefs.current[0]?.focus(),
      clear: () => {
        const emptyValues = Array(length).fill("");
        setValues(emptyValues);
        onChange?.("");
        inputRefs.current[0]?.focus();
      },
      getValue: () => values.join(""),
      setValue: (newValue: string) => {
        const newValues = newValue
          .split("")
          .slice(0, length)
          .concat(Array(length).fill(""))
          .slice(0, length);
        setValues(newValues);
        onChange?.(newValue.slice(0, length));
      },
    }));

    // Validate input based on type
    const isValidChar = React.useCallback(
      (char: string): boolean => {
        switch (type) {
          case "numeric":
            return /^\d$/.test(char);
          case "alphabetic":
            return /^[a-zA-Z]$/.test(char);
          case "alphanumeric":
            return /^[a-zA-Z0-9]$/.test(char);
          default:
            return false;
        }
      },
      [type]
    );

    // Handle input change
    const handleOTPChange = React.useCallback(
      (index: number, inputValue: string) => {
        const char = inputValue.slice(-1).toUpperCase();

        if (!char) {
          // Clear current input
          const newValues = [...values];
          newValues[index] = "";
          setValues(newValues);
          onChange?.(newValues.join(""));
          return;
        }

        if (!isValidChar(char)) {
          // Shake animation for invalid input
          const input = inputRefs.current[index];
          if (input) {
            input.style.transform = "translateX(-4px)";
            setTimeout(() => {
              input.style.transform = "translateX(4px)";
              setTimeout(() => {
                input.style.transform = "translateX(-4px)";
                setTimeout(() => {
                  input.style.transform = "translateX(4px)";
                  setTimeout(() => {
                    input.style.transform = "";
                  }, 50);
                }, 50);
              }, 50);
            }, 50);
          }
          return;
        }

        const newValues = [...values];
        newValues[index] = char;
        setValues(newValues);

        const newValue = newValues.join("");
        onChange?.(newValue);

        // Move to next input
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newValues.every((v) => v !== "")) {
          onComplete?.(newValue);
        }
      },
      [values, length, isValidChar, onChange, onComplete]
    );

    // Handle paste
    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").toUpperCase();
        const chars = pastedData.split("").filter(isValidChar).slice(0, length);

        if (chars.length === 0) return;

        const newValues = [...Array(length).fill("")];
        chars.forEach((char, i) => {
          newValues[i] = char;
        });

        setValues(newValues);
        onChange?.(chars.join(""));

        // Focus appropriate input
        const nextEmptyIndex = newValues.findIndex((v) => v === "");
        const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();

        // Check if complete
        if (chars.length === length) {
          onComplete?.(chars.join(""));
        }
      },
      [length, isValidChar, onChange, onComplete]
    );

    // Handle keydown
    const handleKeyDown = React.useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "Backspace":
            e.preventDefault();
            if (values[index]) {
              // Clear current
              const newValues = [...values];
              newValues[index] = "";
              setValues(newValues);
              onChange?.(newValues.join(""));
            } else if (index > 0) {
              // Move to previous and clear
              const newValues = [...values];
              newValues[index - 1] = "";
              setValues(newValues);
              onChange?.(newValues.join(""));
              inputRefs.current[index - 1]?.focus();
            }
            break;

          case "Delete":
            e.preventDefault();
            if (values[index]) {
              const newValues = [...values];
              newValues[index] = "";
              setValues(newValues);
              onChange?.(newValues.join(""));
            }
            break;

          case "ArrowLeft":
            e.preventDefault();
            if (index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
            break;

          case "ArrowRight":
            e.preventDefault();
            if (index < length - 1) {
              inputRefs.current[index + 1]?.focus();
            }
            break;

          case "Home":
            e.preventDefault();
            inputRefs.current[0]?.focus();
            break;

          case "End":
            e.preventDefault();
            inputRefs.current[length - 1]?.focus();
            break;
        }
      },
      [values, length, onChange]
    );

    // Handle focus
    const handleFocus = React.useCallback(
      (index: number) => {
        setFocusedIndex(index);
        // Select input content
        inputRefs.current[index]?.select();
      },
      []
    );

    // Handle blur
    const handleBlur = React.useCallback(() => {
      setFocusedIndex(null);
    }, []);

    // Render separator
    const renderSeparator = (index: number) => {
      if (separatorAfter !== undefined && index === separatorAfter) {
        return (
          <span
            className="text-muted-foreground font-medium text-lg select-none"
            aria-hidden="true"
          >
            -
          </span>
        );
      }
      return null;
    };

    return (
      <div
        role="group"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        data-slot="otp-input"
        data-invalid={invalid || undefined}
        className={cn(otpContainerVariants({ gap }), className)}
        {...props}
      >
        {Array.from({ length }).map((_, index) => (
          <React.Fragment key={index}>
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`${baseId}-${index}`}
              type={mask ? "password" : "text"}
              inputMode={type === "numeric" ? "numeric" : "text"}
              autoComplete="one-time-code"
              maxLength={1}
              value={values[index]}
              placeholder={focusedIndex === index ? "" : placeholder}
              disabled={disabled}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={invalid || undefined}
              className={cn(
                otpInputVariants({ size, variant }),
                invalid && "border-destructive focus:ring-destructive",
                focusedIndex === index && "ring-2 ring-ring ring-offset-2",
                values[index] && "border-primary/50"
              )}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onPaste={handlePaste}
            />
            {renderSeparator(index)}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";

// ============================================
// RATING
// ============================================

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
  }
);

interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof ratingVariants> {
  /** Current rating value */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Value change handler */
  onChange?: (value: number) => void;
  /** Maximum rating value */
  max?: number;
  /** Allow half-star ratings */
  allowHalf?: boolean;
  /** Allow clearing (clicking same value) */
  allowClear?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only display mode */
  readOnly?: boolean;
  /** Color scheme */
  color?: "default" | "yellow" | "orange" | "red" | "pink";
  /** Show numeric value */
  showValue?: boolean;
  /** Custom filled icon */
  filledIcon?: React.ReactNode;
  /** Custom empty icon */
  emptyIcon?: React.ReactNode;
  /** Custom half icon */
  halfIcon?: React.ReactNode;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: number) => string;
  /** Aria label */
  "aria-label"?: string;
  /** Aria describedby */
  "aria-describedby"?: string;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
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
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    // Use controlled or internal value
    const currentValue = controlledValue ?? internalValue;

    // Display value (hover takes precedence)
    const displayValue = hoverValue ?? currentValue;

    // Handle value change
    const handleRatingChange = React.useCallback(
      (newValue: number) => {
        if (disabled || readOnly) return;

        // Allow clearing by clicking same value
        const finalValue = allowClear && newValue === currentValue ? 0 : newValue;

        if (controlledValue === undefined) {
          setInternalValue(finalValue);
        }
        onChange?.(finalValue);
      },
      [disabled, readOnly, allowClear, currentValue, controlledValue, onChange]
    );

    // Handle mouse move for half-star detection
    const handleMouseMove = React.useCallback(
      (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || readOnly) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isLeftHalf = x < rect.width / 2;

        if (allowHalf && isLeftHalf) {
          setHoverValue(index + 0.5);
        } else {
          setHoverValue(index + 1);
        }
      },
      [disabled, readOnly, allowHalf]
    );

    // Handle click for half-star detection
    const handleClick = React.useCallback(
      (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || readOnly) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isLeftHalf = x < rect.width / 2;

        if (allowHalf && isLeftHalf) {
          handleRatingChange(index + 0.5);
        } else {
          handleRatingChange(index + 1);
        }
      },
      [disabled, readOnly, allowHalf, handleRatingChange]
    );

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || readOnly) return;

        const step = allowHalf ? 0.5 : 1;
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
      },
      [disabled, readOnly, allowHalf, max, currentValue, controlledValue, onChange]
    );

    // Render star icon based on fill state
    const renderStar = React.useCallback(
      (index: number) => {
        const fillAmount = displayValue - index;

        if (fillAmount >= 1) {
          // Fully filled
          return filledIcon || <IconStarFilled />;
        } else if (fillAmount >= 0.5 && allowHalf) {
          // Half filled
          return halfIcon || <IconStarHalfFilled />;
        } else {
          // Empty
          return emptyIcon || <IconStar />;
        }
      },
      [displayValue, allowHalf, filledIcon, halfIcon, emptyIcon]
    );

    // Get tooltip text
    const getTooltip = React.useCallback(
      (value: number) => {
        if (tooltipFormatter) return tooltipFormatter(value);
        return `${value} of ${max}`;
      },
      [tooltipFormatter, max]
    );

    // Generate stars
    const stars = React.useMemo(() => {
      return Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = displayValue >= starValue;
        const isHalfFilled = allowHalf && displayValue >= index + 0.5 && displayValue < starValue;

        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={currentValue >= starValue}
            aria-label={`Rate ${starValue} out of ${max}`}
            tabIndex={disabled || readOnly ? -1 : index === 0 ? 0 : -1}
            disabled={disabled}
            title={getTooltip(starValue)}
            className={cn(
              ratingItemVariants({
                color: isFilled || isHalfFilled ? color : undefined,
                disabled,
                readOnly,
              }),
              !isFilled && !isHalfFilled && "text-muted-foreground/40",
              !disabled && !readOnly && "hover:scale-110"
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
    }, [
      max,
      displayValue,
      currentValue,
      allowHalf,
      disabled,
      readOnly,
      color,
      handleClick,
      handleMouseMove,
      getTooltip,
      renderStar,
    ]);

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
            {displayValue.toFixed(allowHalf ? 1 : 0)}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";

interface RatingDisplayProps
  extends Omit<RatingProps, "onChange" | "allowClear" | "allowHalf"> {
  /** Show fraction (e.g., 4.5) */
  showFraction?: boolean;
  /** Number of reviews */
  reviewCount?: number;
}

const RatingDisplay = React.forwardRef<HTMLDivElement, RatingDisplayProps>(
  ({ value = 0, showFraction = true, reviewCount, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <Rating
          value={value}
          readOnly
          allowHalf={showFraction}
          {...props}
        />
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
  }
);

RatingDisplay.displayName = "RatingDisplay";

export {
  Input,
  inputVariants,
  NumericInput,
  TextareaFixed,
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
  // OTP Input
  OTPInput,
  otpInputVariants,
  otpContainerVariants,
  // Rating
  Rating,
  RatingDisplay,
  ratingVariants,
  ratingItemVariants,
};
export type {
  NumericInputProps,
  TextareaFixedProps,
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
  // OTP Input
  OTPInputProps,
  OTPInputRef,
  OTPInputType,
  // Rating
  RatingProps,
  RatingDisplayProps,
};
