/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
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
        sm: "px-2 py-1.5 text-xs min-h-12",
        default: "px-2.5 py-2 text-base md:text-sm min-h-16",
        lg: "px-3 py-2.5 text-base min-h-20",
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
  }
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
  const lineHeight = size === "sm" ? 20 : size === "lg" ? 28 : 24;
  const paddingY = size === "sm" ? 12 : size === "lg" ? 20 : 16;

  const minHeight = minRows ? minRows * lineHeight + paddingY : undefined;
  const maxHeight = maxRows ? maxRows * lineHeight + paddingY : undefined;

  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        textareaVariants({ size, resize }),
        autoSize && "field-sizing-content",
        maxRows && "overflow-auto",
        className
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

// =============================================================================
// TextareaWithCounter — accessible 3-element counter (GOV.UK / USWDS pattern)
// =============================================================================
//   1. static hint read once      → aria-describedby
//   2. visible counter             → aria-hidden (updates every keystroke)
//   3. debounced sr-only live node → announces at ~400ms rest, not per key

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

function TextareaWithCounter({
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
  const reduced = useReducedMotion();
  const [internalValue, setInternalValue] = React.useState(
    (defaultValue as string) ?? ""
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;
  const currentLength = currentValue.length;
  const remaining = maxLength - currentLength;

  const isWarning = currentLength >= maxLength * warningThreshold && remaining >= 0;
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
  React.useEffect(() => {
    const t = setTimeout(() => {
      setAnnounce(
        remaining >= 0
          ? `${remaining} characters remaining`
          : `${Math.abs(remaining)} characters over limit`
      );
    }, 400);
    return () => clearTimeout(t);
  }, [remaining]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const counterContent = renderCounter ? (
    renderCounter({
      current: currentLength,
      max: maxLength,
      remaining,
      isWarning,
      isError,
    })
  ) : showRemaining ? (
    `${remaining} remaining`
  ) : (
    `${currentLength}/${maxLength}`
  );

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
          !reduced && "transition-colors",
          isError && !reduced && "animate-shake",
          isError
            ? "text-destructive"
            : isWarning
              ? "text-warning dark:text-warning"
              : "text-muted-foreground"
        )}
      >
        {counterContent}
      </div>
      {/* Debounced sr-only live region. */}
      <span id={liveId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announce}
      </span>
    </div>
  );
}

// =============================================================================
// KiraTextarea — one prop-driven API: label + counter + submit + clear
// =============================================================================

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
  wrapperClassName?: string;
}

function KiraTextarea({
  label,
  description,
  error,
  maxLength,
  showCount = false,
  showRemaining = false,
  warningThreshold,
  hardLimit,
  clearable = false,
  onSubmit,
  submitOn = "mod-enter",
  wrapperClassName,
  id,
  value,
  defaultValue,
  onChange,
  onKeyDown,
  enterKeyHint = "enter",
  "aria-describedby": ariaDescribedBy,
  disabled,
  ...props
}: KiraTextareaProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = React.useState(
    (defaultValue as string) ?? ""
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;

  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const descId = description ? `${generatedId}-desc` : undefined;
  const errId = error ? `${generatedId}-err` : undefined;
  const hintId = maxLength ? `${generatedId}-hint` : undefined;
  const describedBy =
    [ariaDescribedBy, descId, errId, hintId].filter(Boolean).join(" ") ||
    undefined;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  };

  const clear = () => {
    setValue("");
    // Notify controlled callers via a synthetic-ish change on the ref.
    if (ref.current) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      setter?.call(ref.current, "");
      ref.current.dispatchEvent(new Event("input", { bubbles: true }));
      ref.current.focus();
    }
  };

  const currentLength = currentValue.length;
  const remaining = maxLength ? maxLength - currentLength : 0;
  const isWarning =
    maxLength != null &&
    currentLength >= maxLength * (warningThreshold ?? 0.8) &&
    remaining >= 0;
  const isError = maxLength != null && currentLength > maxLength;

  // Debounced sr-only announce for the counter.
  const [announce, setAnnounce] = React.useState("");
  React.useEffect(() => {
    if (maxLength == null) return;
    const t = setTimeout(() => {
      setAnnounce(
        remaining >= 0
          ? `${remaining} characters remaining`
          : `${Math.abs(remaining)} characters over limit`
      );
    }, 400);
    return () => clearTimeout(t);
  }, [remaining, maxLength]);

  const showCounter = maxLength != null && (showCount || showRemaining);

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium leading-none">
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
      <div className="relative">
        <Textarea
          ref={ref}
          id={textareaId}
          value={isControlled ? value : internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          enterKeyHint={enterKeyHint}
          maxLength={hardLimit ? maxLength : undefined}
          aria-invalid={isError || !!error || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          className={cn(clearable && currentLength > 0 && "pr-9")}
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
              "absolute right-2 top-2 grid size-6 place-items-center rounded text-muted-foreground",
              "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !reduced && "transition-colors"
            )}
          >
            <IconX className="size-4" />
          </button>
        )}
      </div>
      {showCounter && (
        <div
          aria-hidden="true"
          className={cn(
            "text-xs text-right tabular-nums",
            !reduced && "transition-colors",
            isError && !reduced && "animate-shake",
            isError
              ? "text-destructive"
              : isWarning
                ? "text-warning dark:text-warning"
                : "text-muted-foreground"
          )}
        >
          {showRemaining ? `${remaining} remaining` : `${currentLength}/${maxLength}`}
        </div>
      )}
      {showCounter && (
        <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {announce}
        </span>
      )}
      {error && (
        <p id={errId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { Textarea, TextareaWithCounter, KiraTextarea, textareaVariants };
export type { TextareaProps, TextareaWithCounterProps, KiraTextareaProps };
