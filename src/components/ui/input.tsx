import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { NumberField } from "@base-ui/react/number-field";
import { Meter } from "@base-ui/react/meter";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconMinus,
  IconPlus,
  IconLoader2,
  IconSearch,
  IconX,
  IconCopy,
  IconCheck,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const inputVariants = cva(
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent file:inline-flex file:cursor-pointer file:items-center file:justify-center file:rounded-md file:border file:border-border dark:file:border-input file:bg-muted dark:file:bg-input/50 file:font-medium file:text-foreground hover:file:bg-accent hover:file:text-accent-foreground dark:hover:file:bg-input/70 hover:file:border-ring/50 focus-visible:ring-[3px] aria-invalid:ring-[3px] placeholder:text-muted-foreground w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        xs: "h-7 px-2 py-0.5 text-xs file:me-2 file:h-5 file:px-2 file:text-xs",
        sm: "h-8 px-3 py-1 text-xs file:me-2 file:h-6 file:px-2 file:text-xs",
        default:
          "h-9 px-4 py-1 text-base md:text-sm file:me-3 file:h-7 file:px-3 file:text-xs",
        lg: "h-10 px-5 py-1.5 text-base md:text-sm file:me-3 file:h-8 file:px-3 file:text-sm",
        xl: "h-11 px-5 py-2 text-base file:me-3 file:h-8 file:px-4 file:text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const inputShellVariants = cva(
  "dark:bg-input/30 border-input has-[>input:focus-visible]:border-ring has-[>input:focus-visible]:ring-ring has-[>input:focus-visible]:ring-[3px] has-[>input[aria-invalid=true]]:ring-destructive/20 dark:has-[>input[aria-invalid=true]]:ring-destructive/40 has-[>input[aria-invalid=true]]:border-destructive dark:has-[>input[aria-invalid=true]]:border-destructive/50 has-[>input[aria-invalid=true]]:ring-[3px] has-[>input:disabled]:bg-input/50 dark:has-[>input:disabled]:bg-input/80 has-[>input:disabled]:pointer-events-none has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:opacity-50 relative flex w-full min-w-0 cursor-text items-center rounded-lg border bg-transparent outline-none",
  {
    variants: {
      size: {
        xs: "h-7 gap-2 text-xs",
        sm: "h-8 gap-2 text-xs",
        default: "h-9 gap-2 text-base md:text-sm",
        lg: "h-10 gap-3 text-base md:text-sm",
        xl: "h-11 gap-3 text-base",
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

// Outer inline padding on the flex shell (4px scale, RTL-safe logical sides).
// Leading/trailing addons pull slightly closer to the border for optical balance;
// size-6 action buttons already include 4px internal padding around their 16px icons.
const SHELL_START_PADDING = {
  xs: "ps-2",
  sm: "ps-3",
  default: "ps-4",
  lg: "ps-5",
  xl: "ps-5",
} as const;

const SHELL_PREFIX_START_PADDING = {
  xs: "ps-2",
  sm: "ps-3",
  default: "ps-3",
  lg: "ps-4",
  xl: "ps-4",
} as const;

const SHELL_END_PADDING = {
  xs: "pe-2",
  sm: "pe-3",
  default: "pe-4",
  lg: "pe-5",
  xl: "pe-5",
} as const;

const SHELL_SUFFIX_END_PADDING = {
  xs: "pe-2",
  sm: "pe-3",
  default: "pe-3",
  lg: "pe-4",
  xl: "pe-4",
} as const;

const SHELL_ACTION_END_PADDING = {
  xs: "has-[[data-slot=input-suffix]_button]:pe-1",
  sm: "has-[[data-slot=input-suffix]_button]:pe-2",
  default: "has-[[data-slot=input-suffix]_button]:pe-2",
  lg: "has-[[data-slot=input-suffix]_button]:pe-3",
  xl: "has-[[data-slot=input-suffix]_button]:pe-3",
} as const;

const SHELL_FILE_START_PADDING = {
  xs: "ps-1",
  sm: "ps-1",
  default: "ps-1",
  lg: "ps-2",
  xl: "ps-2",
} as const;

const INPUT_CONTROL_SIZE = {
  xs: "py-0.5",
  sm: "py-1",
  default: "py-1",
  lg: "py-1.5",
  xl: "py-2",
} as const;

const FILE_CONTROL_SIZE = {
  xs: "file:me-2 file:h-5 file:px-2 file:text-xs",
  sm: "file:me-2 file:h-6 file:px-2 file:text-xs",
  default: "file:me-3 file:h-7 file:px-3 file:text-xs",
  lg: "file:me-3 file:h-8 file:px-3 file:text-sm",
  xl: "file:me-3 file:h-8 file:px-4 file:text-sm",
} as const;

const FILE_INPUT_CLASSES =
  "h-auto cursor-pointer py-0 text-muted-foreground file:inline-flex file:cursor-pointer file:items-center file:justify-center file:rounded-md file:border file:border-border dark:file:border-input file:bg-muted dark:file:bg-input/50 file:font-medium file:text-foreground hover:file:bg-accent hover:file:text-accent-foreground dark:hover:file:bg-input/70 hover:file:border-ring/50";

const ACTION_ICON_SIZE = {
  xs: "size-3",
  sm: "size-4",
  default: "size-4",
  lg: "size-4",
  xl: "size-4",
} as const;

const TAG_INPUT_MIN_HEIGHT = {
  xs: "min-h-7",
  sm: "min-h-8",
  default: "min-h-9",
  lg: "min-h-10",
  xl: "min-h-11",
} as const;

interface InputActionButtonsProps {
  show: boolean;
  showClearButton: boolean;
  showCopy: boolean;
  disabled?: boolean;
  size: InputSize;
  copied: boolean;
  reducedMotion: boolean;
  onClear: () => void;
  onCopy: () => void;
}

/** Clear + copy affordances rendered inside the trailing suffix slot. */
function InputActionButtons({
  show,
  showClearButton,
  showCopy,
  disabled,
  size,
  copied,
  reducedMotion,
  onClear,
  onCopy,
}: InputActionButtonsProps) {
  if (!show) return null;

  const iconSize = ACTION_ICON_SIZE[size] ?? ACTION_ICON_SIZE.default;
  let copyButtonLabel = "Copy to clipboard";
  let copyButtonIcon = <IconCopy className={iconSize} aria-hidden="true" />;

  if (copied) {
    copyButtonLabel = "Copied";
    copyButtonIcon = (
      <IconCheck className={cn(iconSize, "text-success")} aria-hidden="true" />
    );
  }

  return (
    <InputContentView
      showClearButton={showClearButton}
      onClear={onClear}
      iconSize={iconSize}
      showCopy={showCopy}
      disabled={disabled}
      reducedMotion={reducedMotion}
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

/** Build the borderless flex-1 <input> element inside InputFieldView's shell. */
function createInputElement(
  options: InputFieldViewOptions,
  effectiveSize: InputSize,
) {
  const {
    type,
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
  const isSearch = type === "search";
  const isFile = type === "file";

  return (
    <InputPrimitive
      ref={inputRef}
      type={type}
      data-slot="input"
      className={cn(
        "h-full w-full min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
        isFile
          ? [
              FILE_INPUT_CLASSES,
              FILE_CONTROL_SIZE[effectiveSize],
              !reducedMotion && "file:transition-colors",
            ]
          : INPUT_CONTROL_SIZE[effectiveSize],
        {
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none":
            isNumeric,
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none":
            isSearch,
        },
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
  disabled?: boolean;
  size: InputSize;
  copied: boolean;
  reducedMotion: boolean;
  onClear: () => void;
  onCopy: () => void;
}): React.ReactNode {
  const {
    showClearButton,
    showCopy,
    disabled,
    size,
    copied,
    reducedMotion,
    onClear,
    onCopy,
  } = params;

  return (
    (showClearButton || showCopy) && (
      <InputActionButtons
        show={showClearButton || showCopy}
        showClearButton={showClearButton}
        showCopy={showCopy}
        disabled={disabled}
        size={size}
        copied={copied}
        reducedMotion={reducedMotion}
        onClear={onClear}
        onCopy={onCopy}
      />
    )
  );
}

/** Leading flex addon slot before the input. */
function renderPrefixContainer(
  prefix: React.ReactNode,
  size: InputSize,
): React.ReactNode {
  return (
    prefix && (
      <div
        data-slot="input-prefix"
        className={cn(
          "flex shrink-0 items-center text-muted-foreground select-none",
          // Bare icons get the contract affordance size for consistent proportion.
          size === "xs"
            ? "[&_svg:not([class*='size-'])]:size-3"
            : "[&_svg:not([class*='size-'])]:size-4",
        )}
      >
        {prefix}
      </div>
    )
  );
}

/** Trailing flex addon slot after the input (user suffix + clear/copy actions). */
function renderSuffixContainer(
  suffix: React.ReactNode,
  actionButtons: React.ReactNode,
  size: InputSize,
): React.ReactNode {
  return (
    (suffix || actionButtons) && (
      <div
        data-slot="input-suffix"
        className={cn(
          "flex shrink-0 items-center gap-1 text-muted-foreground select-none",
          size === "xs"
            ? "[&_svg:not([class*='size-'])]:size-3"
            : "[&_svg:not([class*='size-'])]:size-4",
        )}
      >
        {suffix}
        {actionButtons}
      </div>
    )
  );
}

/** Focus the inner input when clicking empty shell padding or non-interactive addons. */
function handleInputShellClick(
  event: React.MouseEvent<HTMLDivElement>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  disabled?: boolean,
) {
  if (
    disabled ||
    !(event.target instanceof Element) ||
    event.target.closest("button, a, input, select, textarea")
  ) {
    return;
  }

  inputRef.current?.focus();
}

/** Compute flex-shell classes including optical start/end padding for addons. */
function resolveShellClassName(params: {
  size: InputSize;
  reducedMotion: boolean;
  hasPrefix: boolean;
  hasSuffix: boolean;
  isFile: boolean;
  className?: string;
}): string {
  const { size, reducedMotion, hasPrefix, hasSuffix, isFile, className } =
    params;

  let startPadding: string = SHELL_START_PADDING[size];

  if (hasPrefix) {
    startPadding = SHELL_PREFIX_START_PADDING[size];
  } else if (isFile) {
    startPadding = SHELL_FILE_START_PADDING[size];
  }

  return cn(
    inputShellVariants({ size }),
    !reducedMotion && transitionClasses,
    isFile && "cursor-pointer",
    startPadding,
    hasSuffix
      ? [SHELL_SUFFIX_END_PADDING[size], SHELL_ACTION_END_PADDING[size]]
      : SHELL_END_PADDING[size],
    className,
  );
}

/** Shared inline loading spinner for SearchInput and InputWithSpinner. */
function renderLoadingSpinner(
  isLoading: boolean,
  iconSize: "size-3" | "size-4",
  reducedMotion: boolean,
): React.ReactNode {
  if (!isLoading) return undefined;

  return (
    <IconLoader2
      className={cn(
        iconSize,
        !reducedMotion && "animate-spin",
        "text-muted-foreground",
      )}
      aria-hidden="true"
    />
  );
}

/** Layout view for Input: flex shell + leading/trailing addons + inner primitive + counter. */
function InputFieldView(options: InputFieldViewOptions) {
  const {
    className,
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
    inputRef,
    reducedMotion,
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
    disabled,
    size: effectiveSize,
    copied,
    reducedMotion,
    onClear,
    onCopy,
  });

  const shellClassName = resolveShellClassName({
    size: effectiveSize,
    reducedMotion,
    hasPrefix: Boolean(options.prefix),
    hasSuffix: Boolean(options.suffix || actionButtons),
    isFile: options.type === "file",
    className,
  });

  // Always render the flex shell: switching trees when showClear appears would
  // remount the <input> on first keystroke and drop focus mid-typing.
  return withCounterWrapper(
    counter,
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Click-to-focus is pointer convenience for the already keyboard-focusable input; the shell may contain independent action buttons and must not become a nested button.
    <div
      data-slot="input-shell"
      dir={options.props.dir}
      onClick={(event) => handleInputShellClick(event, inputRef, disabled)}
      className={shellClassName}
    >
      {renderPrefixContainer(options.prefix, effectiveSize)}
      {inputElement}
      {renderSuffixContainer(options.suffix, actionButtons, effectiveSize)}
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
  const reducedMotion = useReducedMotion();

  return (
    <Input
      className={className}
      size={size}
      suffix={renderLoadingSpinner(
        isLoading,
        ACTION_ICON_SIZE[effectiveSize],
        reducedMotion,
      )}
      aria-busy={isLoading || undefined}
      {...props}
    />
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

    const effectiveSize = size || "default";
    const iconSize = ACTION_ICON_SIZE[effectiveSize];

    return (
      <div data-slot="password-input" className="w-full">
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
              data-slot="password-input-toggle"
              disabled={props.disabled}
              // Toggling must not steal focus from the field.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setVisible((v) => !v)}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                !reducedMotion && transitionClasses,
              )}
              aria-label={toggleLabel}
              aria-pressed={visible}
            >
              {visible && (
                <IconEyeOff className={iconSize} aria-hidden="true" />
              )}
              {!visible && <IconEye className={iconSize} aria-hidden="true" />}
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
  InputWithSpinner,
  CurrencyInput,
  PercentageInput,
  DecimalInput,
  SearchInput,
  PasswordInput,
  TagInput,
};

export type {
  InputProps,
  NumericInputProps,
  InputWithSpinnerProps,
  CurrencyInputProps,
  PercentageInputProps,
  DecimalInputProps,
  SearchInputProps,
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
  disabled,
  reducedMotion,
  onCopy,
  copyButtonLabel,
  copyButtonIcon,
}: {
  showClearButton: boolean;
  onClear: () => void;
  iconSize: "size-3" | "size-4";
  showCopy: boolean;
  disabled?: boolean;
  reducedMotion: boolean;
  onCopy: () => void;
  copyButtonLabel: string;
  copyButtonIcon: React.JSX.Element;
}) {
  const actionButtonClass = cn(
    "flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    !reducedMotion && transitionClasses,
  );

  return (
    <>
      {showClearButton && (
        <button
          type="button"
          data-slot="input-clear"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          className={actionButtonClass}
          aria-label="Clear input"
        >
          <IconX className={iconSize} aria-hidden="true" />
        </button>
      )}
      {showCopy && (
        <button
          type="button"
          data-slot="input-copy"
          disabled={disabled}
          onClick={onCopy}
          className={actionButtonClass}
          aria-label={copyButtonLabel}
        >
          {copyButtonIcon}
        </button>
      )}
    </>
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
  const reducedMotion = useReducedMotion();

  const effectiveValue = value === undefined ? internalValue : value;
  const effectiveSize = size || "default";
  const iconSize = ACTION_ICON_SIZE[effectiveSize];

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

  const suffix = renderLoadingSpinner(isLoading, iconSize, reducedMotion);

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
    isLoading,
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
  isLoading,
  handleClear,
  suffix,
  props,
}: ReturnType<typeof useSearchInputModel>) {
  return (
    <Input
      ref={inputRef}
      type="search"
      className={className}
      size={size}
      value={effectiveValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      prefix={<IconSearch className={iconSize} aria-hidden="true" />}
      showClear={showClear}
      onClear={handleClear}
      suffix={suffix}
      aria-busy={isLoading || undefined}
      {...props}
    />
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
    onCopySuccess?.();

    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
    }

    copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  } catch (error) {
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

function cancelSearchDebounce(
  timer: React.RefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (timer.current !== null) clearTimeout(timer.current);
  timer.current = null;
}

function inputHandleChange(
  e: React.ChangeEvent<HTMLInputElement, Element>,
  value: string | undefined,
  setInternalValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: ((value: string) => void) | undefined,
  debounceRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
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
  debounceRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
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
