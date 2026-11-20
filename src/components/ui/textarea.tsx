import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX } from "@tabler/icons-react";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const textareaVariants = cva(
  [
    "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
    "disabled:bg-input/50 dark:disabled:bg-input/80",
    "rounded-lg border bg-transparent transition-colors",
    "focus-visible:ring-[3px] aria-invalid:ring-[3px]",
    "placeholder:text-muted-foreground",
    "flex w-full outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "px-3 py-1.5 text-xs min-h-12",
        default: "px-4 py-2 text-base md:text-sm min-h-16",
        lg: "px-5 py-2.5 text-base min-h-20",
        xl: "px-5 py-3 text-base min-h-24",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      size: "default",
      resize: "none",
    },
  },
);

interface TextareaProps
  extends
    Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {
  minRows?: number;
  maxRows?: number;
  autoSize?: boolean;
}

function Textarea({
  className,
  size,
  resize,
  minRows,
  maxRows,
  autoSize = true,
  style,
  ref,
  ...props
}: TextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
  const resolveLineHeight1 = () => textareaResolveLineHeight1(size);

  const resolvePaddingY2 = () => textareaResolvePaddingY2(size);

  const lineHeight = resolveLineHeight1();
  const paddingY = resolvePaddingY2();

  const minHeight = minRows ? minRows * lineHeight + paddingY : undefined;
  const maxHeight = maxRows ? maxRows * lineHeight + paddingY : undefined;

  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        textareaVariants({ size, resize }),
        { "field-sizing-content": autoSize },
        { "overflow-auto": maxRows },
        className,
      )}
      style={{
        ...style,
        minHeight: minHeight ? `${minHeight}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
      }}
      {...props}
    />
  );
}

interface TextareaWithCounterProps extends TextareaProps {
  maxLength: number;
  warningThreshold?: number;
  showRemaining?: boolean;
  /** Enforce a hard cap (silent truncation) instead of allowing over-limit. */
  hardLimit?: boolean;
  renderCounter?: (props: {
    current: number;
    max: number;
    remaining: number;
    isWarning: boolean;
    isError: boolean;
  }) => React.ReactNode;
  wrapperClassName?: string;
}

function TextareaWithCounter(arg0: TextareaWithCounterProps) {
  const model = useTextareaWithCounterModel(arg0);

  return <TextareaWithCounterView {...model} />;
}

interface KiraTextareaProps extends Omit<TextareaProps, "onSubmit"> {
  label?: string;
  description?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  showRemaining?: boolean;
  warningThreshold?: number;
  hardLimit?: boolean;
  clearable?: boolean;
  /** Fires on the submit combo; receives the trimmed value. */
  onSubmit?: (value: string) => void;
  submitOn?: "enter" | "mod-enter";
  /** Inline validation (§3.5): return an error message or `null` when valid.
   *  When provided, it replaces the `error` prop's static message once
   *  validation has run at least once. */
  validate?: (value: string) => string | null;
  /** When validation runs. Defaults to `"onBlur"` (§3.5: validate on blur,
   *  not per keystroke). `onChange` revalidates after the first run. */
  validationMode?: "onBlur" | "onChange";
  wrapperClassName?: string;
}

function KiraTextarea(arg0: KiraTextareaProps) {
  const model = useKiraTextareaModel(arg0);

  return <KiraTextareaView {...model} />;
}

export { Textarea, TextareaWithCounter, KiraTextarea, textareaVariants };

export type { TextareaProps, TextareaWithCounterProps, KiraTextareaProps };

function counterTone(isError: boolean, isWarning: boolean) {
  if (isError) return "text-destructive";

  if (isWarning) return "text-warning dark:text-warning";

  return "text-muted-foreground";
}

function resolveKiraTextareaOptions({
  showCount = false,
  showRemaining = false,
  clearable = false,
  submitOn = "mod-enter",
  validationMode = "onBlur",
  enterKeyHint = "enter",
}: {
  showCount?: KiraTextareaProps["showCount"];
  showRemaining?: KiraTextareaProps["showRemaining"];
  clearable?: KiraTextareaProps["clearable"];
  submitOn?: KiraTextareaProps["submitOn"];
  validationMode?: KiraTextareaProps["validationMode"];
  enterKeyHint?: KiraTextareaProps["enterKeyHint"];
}) {
  return {
    showCount,
    showRemaining,
    clearable,
    submitOn,
    validationMode,
    enterKeyHint,
  };
}

function useTextareaWithCounterModel({
  maxLength,
  warningThreshold = 0.8,
  showRemaining = false,
  hardLimit = false,
  renderCounter,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  id,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaWithCounterProps) {
  const resolveCounterContent3 = () => {
    if (renderCounter) {
      return renderCounter({
        current: currentLength,
        max: maxLength,
        remaining,
        isWarning,
        isError,
      });
    }

    if (showRemaining) {
      return `${remaining} remaining`;
    }

    return `${currentLength}/${maxLength}`;
  };

  const reduced = useReducedMotion();

  // SAFETY: `defaultValue` on a textarea is string | number | readonly
  // string[] per React types; the DOM value of a textarea is always a string.
  const [internalValue, setInternalValue] = React.useState(
    (defaultValue as string) ?? "",
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;
  const currentLength = currentValue.length;
  const remaining = maxLength - currentLength;

  const isWarning =
    currentLength >= maxLength * warningThreshold && remaining >= 0;

  const isError = currentLength > maxLength;

  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const hintId = `${generatedId}-hint`;
  const liveId = `${generatedId}-live`;

  const combinedAriaDescribedBy = [ariaDescribedBy, hintId]
    .filter(Boolean)
    .join(" ");

  // Debounced live announcement: setState in a timer callback (not effect body).
  const [announce, setAnnounce] = React.useState("");
  React.useEffect(() => textareaUseEffect(setAnnounce, remaining), [remaining]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const counterContent = resolveCounterContent3();

  return {
    wrapperClassName,
    hintId,
    maxLength,
    textareaId,
    isControlled,
    value,
    internalValue,
    handleChange,
    hardLimit,
    isError,
    combinedAriaDescribedBy,
    props,
    reduced,
    isWarning,
    counterContent,
    liveId,
    announce,
  };
}

function TextareaWithCounterView({
  wrapperClassName,
  hintId,
  maxLength,
  textareaId,
  isControlled,
  value,
  internalValue,
  handleChange,
  hardLimit,
  isError,
  combinedAriaDescribedBy,
  props,
  reduced,
  isWarning,
  counterContent,
  liveId,
  announce,
}: ReturnType<typeof useTextareaWithCounterModel>) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <span id={hintId} className="sr-only">
        You can enter up to {maxLength} characters.
      </span>
      <Textarea
        id={textareaId}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        maxLength={hardLimit ? maxLength : undefined}
        aria-invalid={isError || undefined}
        aria-describedby={combinedAriaDescribedBy}
        {...props}
      />
      {/* Visible counter — hidden from SRs (the live node speaks instead). */}
      <div
        aria-hidden="true"
        className={cn(
          "mt-1.5 text-xs text-right tabular-nums",
          { "transition-colors": !reduced },
          { "animate-shake": isError && !reduced },
          counterTone(isError, isWarning),
        )}
      >
        {counterContent}
      </div>
      {/* Debounced sr-only live region. */}
      <output
        id={liveId}

        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announce}
      </output>
    </div>
  );
}

function useKiraTextareaModel({
  label,
  description,
  error,
  maxLength,
  showCount: showCountInput,
  showRemaining: showRemainingInput,
  warningThreshold,
  hardLimit,
  clearable: clearableInput,
  onSubmit,
  submitOn: submitOnInput,
  validate,
  validationMode: validationModeInput,
  wrapperClassName,
  id,
  value,
  defaultValue,
  onChange,
  onKeyDown,
  onBlur,
  enterKeyHint: enterKeyHintInput,
  "aria-describedby": ariaDescribedBy,
  disabled,
  ...props
}: KiraTextareaProps) {
  const options = useKiraTextareaOptions({
    showCount: showCountInput,
    showRemaining: showRemainingInput,
    clearable: clearableInput,
    submitOn: submitOnInput,
    validationMode: validationModeInput,
    enterKeyHint: enterKeyHintInput,
  });

  const reduced = useReducedMotion();

  const control = useKiraTextareaControl(
    {
      value,
      defaultValue,
      id,
      description,
      error,
      validate,
      maxLength,
      warningThreshold,
      onChange,
      onBlur,
      onKeyDown,
      onSubmit,
      "aria-describedby": ariaDescribedBy,
    },
    options,
  );

  return {
    ...options,
    ...control,
    wrapperClassName,
    label,
    description,
    maxLength,
    value,
    hardLimit,
    error,
    disabled,
    props,
    reduced,
  };
}

type KiraTextareaControlProps = Pick<
  KiraTextareaProps,
  | "value"
  | "defaultValue"
  | "id"
  | "description"
  | "error"
  | "validate"
  | "maxLength"
  | "warningThreshold"
  | "onChange"
  | "onBlur"
  | "onKeyDown"
  | "onSubmit"
  | "aria-describedby"
>;

function useKiraTextareaControl(
  input: KiraTextareaControlProps,
  options: ReturnType<typeof useKiraTextareaOptions>,
) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const editing = useTextareaValue(input.value, input.defaultValue);
  const { currentValue } = editing;
  const ids = useTextareaDescriptionIds(input);

  const validation = useTextareaValidation({
    validate: input.validate,
    validationMode: options.validationMode,
    currentValue,
    setValue: editing.setValue,
    onChange: input.onChange,
    onBlur: input.onBlur,
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) =>
    textareaHandleKeyDown(
      event,
      input.onKeyDown,
      input.onSubmit,
      options.submitOn,
      currentValue,
    );

  const clear = () => textareaClear(editing.setValue, ref, Object);

  const counter = useTextareaCounter({
    currentValue,
    maxLength: input.maxLength,
    warningThreshold: input.warningThreshold,
    showCount: options.showCount,
    showRemaining: options.showRemaining,
  });

  return {
    ...ids,
    ...counter,
    ref,
    ...editing,
    ...validation,
    handleKeyDown,
    clear,
  };
}

function useTextareaDescriptionIds({
  id,
  description,
  error,
  validate,
  maxLength,
  "aria-describedby": ariaDescribedBy,
}: Pick<
  KiraTextareaProps,
  "id" | "description" | "error" | "validate" | "maxLength" | "aria-describedby"
>) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const descId = description ? `${generatedId}-desc` : undefined;
  const errId = error || validate ? `${generatedId}-err` : undefined;
  const hintId = maxLength ? `${generatedId}-hint` : undefined;

  const describedBy =
    [ariaDescribedBy, descId, errId, hintId].filter(Boolean).join(" ") ||
    undefined;

  return { textareaId, descId, errId, hintId, describedBy };
}

function useTextareaValue(
  value: KiraTextareaProps["value"],
  defaultValue: KiraTextareaProps["defaultValue"],
) {
  // SAFETY: native textarea defaults are serialized to text by the DOM.
  const [internalValue, setInternalValue] = React.useState(
    (defaultValue as string) ?? "",
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
  };

  return { internalValue, isControlled, currentValue, setValue };
}

function useTextareaValidation({
  validate,
  validationMode,
  currentValue,
  setValue,
  onChange,
  onBlur,
}: {
  validate: KiraTextareaProps["validate"];
  validationMode: "onBlur" | "onChange";
  currentValue: string;
  setValue: (next: string) => void;
  onChange: KiraTextareaProps["onChange"];
  onBlur: KiraTextareaProps["onBlur"];
}) {
  // undefined is untouched; null is validated and valid.
  const [validateMessage, setValidateMessage] = React.useState<
    string | null | undefined
  >(undefined);

  const runValidation = (next: string) =>
    setValidateMessage(validate ? validate(next) : null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    textareaHandleChange(
      event,
      setValue,
      validate,
      validationMode,
      validateMessage,
      runValidation,
      onChange,
    );

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (validate) runValidation(currentValue);
    onBlur?.(event);
  };

  return { validateMessage, handleChange, handleBlur };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function KiraTextareaView({
  wrapperClassName,
  label,
  textareaId,
  description,
  descId,
  hintId,
  maxLength,
  ref,
  isControlled,
  value,
  internalValue,
  handleChange,
  handleBlur,
  handleKeyDown,
  enterKeyHint,
  hardLimit,
  isError,
  error,
  validateMessage,
  describedBy,
  disabled,
  clearable,
  currentLength,
  props,
  clear,
  reduced,
  showCounter,
  isWarning,
  showRemaining,
  remaining,
  announce,
  errId,
}: ReturnType<typeof useKiraTextareaModel>) {
  return (
    // kira-kit-ignore spacing-scale: textarea label/description stack uses the optical header gap
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium leading-none"
        >
          {label}
        </label>
      )}
      {description && (
        <p id={descId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {hintId && (
        <span id={hintId} className="sr-only">
          You can enter up to {maxLength} characters.
        </span>
      )}
      <TextareaAdornmentsView
        ref={ref}
        textareaId={textareaId}
        isControlled={isControlled}
        value={value}
        internalValue={internalValue}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleKeyDown={handleKeyDown}
        enterKeyHint={enterKeyHint}
        hardLimit={hardLimit}
        maxLength={maxLength}
        isError={isError}
        error={error}
        validateMessage={validateMessage}
        describedBy={describedBy}
        disabled={disabled}
        clearable={clearable}
        currentLength={currentLength}
        props={props}
        clear={clear}
        reduced={reduced}
      />
      {showCounter && (
        <div
          aria-hidden="true"
          className={cn(
            "text-xs text-right tabular-nums",
            { "transition-colors": !reduced },
            { "animate-shake": isError && !reduced },
            counterTone(isError, isWarning),
          )}
        >
          {showRemaining
            ? `${remaining} remaining`
            : `${currentLength}/${maxLength}`}
        </div>
      )}
      {showCounter && (
        <output aria-live="polite" aria-atomic="true" className="sr-only">
          {announce}
        </output>
      )}
      {(validateMessage ?? error) && (
        <p id={errId} role="alert" className="text-sm text-destructive">
          {validateMessage ?? error}
        </p>
      )}
    </div>
  );
}

// oxlint-disable-next-line eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function TextareaAdornmentsView({
  ref,
  textareaId,
  isControlled,
  value,
  internalValue,
  handleChange,
  handleBlur,
  handleKeyDown,
  enterKeyHint,
  hardLimit,
  maxLength,
  isError,
  error,
  validateMessage,
  describedBy,
  disabled,
  clearable,
  currentLength,
  props,
  clear,
  reduced,
}: TextareaAdornmentsViewParams) {
  const effectiveSize = props.size || "default";

  const clearPadding = {
    sm: "pr-10",
    default: "pr-11",
    lg: "pr-12",
    xl: "pr-12",
  }[effectiveSize];

  const clearInset = {
    sm: "right-3",
    default: "right-4",
    lg: "right-5",
    xl: "right-5",
  }[effectiveSize];

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        id={textareaId}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        enterKeyHint={enterKeyHint}
        maxLength={hardLimit ? maxLength : undefined}
        aria-invalid={isError || !!error || !!validateMessage || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={cn(clearable && currentLength > 0 && clearPadding)}
        {...props}
      />
      {clearable && currentLength > 0 && !disabled && (
        <button
          type="button"
          aria-label="Clear"
          // preventDefault on mousedown so the textarea keeps focus.
          onMouseDown={(e) => e.preventDefault()}
          onClick={clear}
          className={cn(
            "absolute top-2 grid size-6 place-items-center rounded text-muted-foreground",
            clearInset,
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            { "transition-colors": !reduced },
          )}
        >
          <IconX className="size-4" />
        </button>
      )}
    </div>
  );
}

function useKiraTextareaOptions({
  showCount: showCountInput,
  showRemaining: showRemainingInput,
  clearable: clearableInput,
  submitOn: submitOnInput,
  validationMode: validationModeInput,
  enterKeyHint: enterKeyHintInput,
}: Parameters<typeof resolveKiraTextareaOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraTextareaOptions({
        showCount: showCountInput,
        showRemaining: showRemainingInput,
        clearable: clearableInput,
        submitOn: submitOnInput,
        validationMode: validationModeInput,
        enterKeyHint: enterKeyHintInput,
      }),
    [
      showCountInput,
      showRemainingInput,
      clearableInput,
      submitOnInput,
      validationModeInput,
      enterKeyHintInput,
    ],
  );
}

function textareaResolveLineHeight1(
  size: "sm" | "lg" | "xl" | "default" | null | undefined,
) {
  if (size === "sm") {
    return 20 as const;
  }

  if (size === "lg") {
    return 28 as const;
  }

  return 24 as const;
}

function textareaResolvePaddingY2(
  size: "sm" | "lg" | "xl" | "default" | null | undefined,
) {
  if (size === "sm") {
    return 12 as const;
  }

  if (size === "lg") {
    return 20 as const;
  }

  if (size === "xl") {
    return 24 as const;
  }

  return 16 as const;
}

function textareaUseEffect(
  setAnnounce: React.Dispatch<React.SetStateAction<string>>,
  remaining: number,
) {
  const t = setTimeout(() => {
    setAnnounce(
      remaining >= 0
        ? `${remaining} characters remaining`
        : `${Math.abs(remaining)} characters over limit`,
    );
  }, 400);

  return () => clearTimeout(t);
}

function textareaHandleChange(
  e: React.ChangeEvent<HTMLTextAreaElement, Element>,
  setValue: (next: string) => void,
  validate: ((value: string) => string | null) | undefined,
  validationMode: "onBlur" | "onChange",
  validateMessage: string | null | undefined,
  runValidation: (next: string) => void,
  onChange:
    | React.ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>
    | undefined,
) {
  setValue(e.target.value);

  if (
    validate &&
    validationMode === "onChange" &&
    validateMessage !== undefined
  ) {
    runValidation(e.target.value);
  }

  onChange?.(e);
}

function textareaHandleKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined,
  onSubmit: ((value: string) => void) | undefined,
  submitOn: "enter" | "mod-enter",
  currentValue: string,
) {
  onKeyDown?.(e);

  if (!onSubmit || e.nativeEvent.isComposing) return; // guard IME

  const combo =
    submitOn === "enter"
      ? e.key === "Enter" && !e.shiftKey
      : e.key === "Enter" && (e.metaKey || e.ctrlKey);

  if (!combo) return;
  const trimmed = currentValue.trim();

  if (!trimmed) return;
  e.preventDefault();
  onSubmit(trimmed);
}

function textareaClear(
  setValue: (next: string) => void,
  ref: React.RefObject<HTMLTextAreaElement | null>,
  Object: ObjectConstructor,
) {
  setValue("");

  // Notify controlled callers via a synthetic-ish change on the ref.
  if (ref.current) {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;

    setter?.call(ref.current, "");
    ref.current.dispatchEvent(new Event("input", { bubbles: true }));
    ref.current.focus();
  }
}

function textareaUseEffect2(
  maxLength: number | undefined,
  setAnnounce: React.Dispatch<React.SetStateAction<string>>,
  remaining: number,
) {
  if (maxLength == null) return;

  const t = setTimeout(() => {
    setAnnounce(
      remaining >= 0
        ? `${remaining} characters remaining`
        : `${Math.abs(remaining)} characters over limit`,
    );
  }, 400);

  return () => clearTimeout(t);
}

function useTextareaCounter({
  currentValue,
  maxLength,
  warningThreshold,
  showCount,
  showRemaining,
}: {
  currentValue: string;
  maxLength: KiraTextareaProps["maxLength"];
  warningThreshold: KiraTextareaProps["warningThreshold"];
  showCount: boolean;
  showRemaining: boolean;
}) {
  const currentLength = currentValue.length;
  const remaining = maxLength ? maxLength - currentLength : 0;

  const isWarning =
    maxLength != null &&
    currentLength >= maxLength * (warningThreshold ?? 0.8) &&
    remaining >= 0;

  const isError = maxLength != null && currentLength > maxLength;

  // Debounced sr-only announce for the counter.
  const [announce, setAnnounce] = React.useState("");
  React.useEffect(
    () => textareaUseEffect2(maxLength, setAnnounce, remaining),
    [remaining, maxLength],
  );

  const showCounter = maxLength != null && (showCount || showRemaining);

  return {
    isError,
    currentLength,
    showCounter,
    isWarning,
    remaining,
    announce,
  } satisfies {
    isError: typeof isError;
    currentLength: typeof currentLength;
    showCounter: typeof showCounter;
    isWarning: typeof isWarning;
    remaining: typeof remaining;
    announce: typeof announce;
  };
}

type TextareaAdornmentsViewParams = {
  ref: ReturnType<typeof useKiraTextareaModel>["ref"];
  textareaId: ReturnType<typeof useKiraTextareaModel>["textareaId"];
  isControlled: ReturnType<typeof useKiraTextareaModel>["isControlled"];
  value: ReturnType<typeof useKiraTextareaModel>["value"];
  internalValue: ReturnType<typeof useKiraTextareaModel>["internalValue"];
  handleChange: ReturnType<typeof useKiraTextareaModel>["handleChange"];
  handleBlur: ReturnType<typeof useKiraTextareaModel>["handleBlur"];
  handleKeyDown: ReturnType<typeof useKiraTextareaModel>["handleKeyDown"];
  enterKeyHint: ReturnType<typeof useKiraTextareaModel>["enterKeyHint"];
  hardLimit: ReturnType<typeof useKiraTextareaModel>["hardLimit"];
  maxLength: ReturnType<typeof useKiraTextareaModel>["maxLength"];
  isError: ReturnType<typeof useKiraTextareaModel>["isError"];
  error: ReturnType<typeof useKiraTextareaModel>["error"];
  validateMessage: ReturnType<typeof useKiraTextareaModel>["validateMessage"];
  describedBy: ReturnType<typeof useKiraTextareaModel>["describedBy"];
  disabled: ReturnType<typeof useKiraTextareaModel>["disabled"];
  clearable: ReturnType<typeof useKiraTextareaModel>["clearable"];
  currentLength: ReturnType<typeof useKiraTextareaModel>["currentLength"];
  props: ReturnType<typeof useKiraTextareaModel>["props"];
  clear: ReturnType<typeof useKiraTextareaModel>["clear"];
  reduced: ReturnType<typeof useKiraTextareaModel>["reduced"];
};
