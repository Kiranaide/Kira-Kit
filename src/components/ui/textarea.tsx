import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";




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
  extends Omit<React.ComponentProps<"textarea">, "size">,
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
  ...props
}: TextareaProps) {


  const lineHeight = size === "sm" ? 20 : size === "lg" ? 28 : 24;
  const paddingY = size === "sm" ? 12 : size === "lg" ? 20 : 16;

  const minHeight = minRows ? minRows * lineHeight + paddingY : undefined;
  const maxHeight = maxRows ? maxRows * lineHeight + paddingY : undefined;

  return (
    <textarea
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




interface TextareaWithCounterProps extends TextareaProps {

  maxLength: number;

  warningThreshold?: number;

  showRemaining?: boolean;

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
  renderCounter,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  id,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaWithCounterProps) {
  const [internalValue, setInternalValue] = React.useState(
    (defaultValue as string) ?? ""
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;
  const currentLength = currentValue.length;
  const remaining = maxLength - currentLength;

  const isWarning = currentLength >= maxLength * warningThreshold;
  const isError = currentLength >= maxLength;


  const generatedCounterId = React.useId();
  const generatedTextareaId = React.useId();
  const counterId = generatedCounterId;
  const textareaId = id ?? generatedTextareaId;
  const counterElementId = `${counterId}-counter`;


  const combinedAriaDescribedBy = ariaDescribedBy
    ? `${ariaDescribedBy} ${counterElementId}`
    : counterElementId;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
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
  ) : (
    <span>
      {showRemaining
        ? `${remaining} characters remaining`
        : `${currentLength}/${maxLength}`}
    </span>
  );

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Textarea
        id={textareaId}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        maxLength={maxLength}
        aria-describedby={combinedAriaDescribedBy}
        {...props}
      />
      <div
        id={counterElementId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "mt-1.5 text-xs text-right transition-colors",
          isError
            ? "text-destructive"
            : isWarning
              ? "text-warning dark:text-warning"
              : "text-muted-foreground"
        )}
      >
        {counterContent}
      </div>
    </div>
  );
}




export { Textarea, TextareaWithCounter, textareaVariants };
export type { TextareaProps, TextareaWithCounterProps };
