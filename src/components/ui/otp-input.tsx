"use client";

import * as React from "react";
import { OTPField } from "@base-ui/react/otp-field";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

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

// oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
function OTPInput({
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
  ref,
  ...props
}: OTPInputProps & { ref?: React.Ref<HTMLDivElement> }) {
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
}

export { OTPInput, otpInputVariants, otpContainerVariants };

export type { OTPInputProps, OTPInputType };
