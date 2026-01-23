import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";




const radioGroupVariants = cva("grid gap-2", {
  variants: {
    orientation: {
      horizontal: "grid-flow-col auto-cols-max",
      vertical: "grid-flow-row",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

interface RadioGroupProps
  extends RadioGroupPrimitive.Props, VariantProps<typeof radioGroupVariants> {

  error?: boolean;

  errorMessage?: string;
}

function RadioGroup({
  className,
  orientation = "vertical",
  error,
  errorMessage,
  children,
  ...props
}: RadioGroupProps) {
  const errorId = React.useId();

  return (
    <div className="flex flex-col gap-1.5">
      <RadioGroupPrimitive
        data-slot="radio-group"
        data-error={error || undefined}
        aria-invalid={error || undefined}
        aria-describedby={error && errorMessage ? errorId : undefined}
        className={cn(radioGroupVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </RadioGroupPrimitive>
      {error && errorMessage && (
        <p
          id={errorId}
          className="text-sm text-destructive flex items-center gap-1.5"
          role="alert"
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
}




const radioItemVariants = cva(
  "relative aspect-square rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-all",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
      color: {
        default: "border-primary text-primary",
        destructive: "border-destructive text-destructive",
        success:
          "border-green-600 text-green-600 dark:border-green-500 dark:text-green-500",
        warning:
          "border-yellow-600 text-yellow-600 dark:border-yellow-500 dark:text-yellow-500",
      },
    },
    defaultVariants: {
      size: "default",
      color: "default",
    },
  },
);

const indicatorColorVariants: Record<string, string> = {
  default: "bg-primary",
  destructive: "bg-destructive",
  success: "bg-green-600 dark:bg-green-500",
  warning: "bg-yellow-600 dark:bg-yellow-500",
};

interface RadioGroupItemProps
  extends RadioPrimitive.Root.Props, VariantProps<typeof radioItemVariants> {}

function RadioIndicatorIcon({
  size,
  color,
}: {
  size: "sm" | "default" | "lg" | undefined | null;
  color: "default" | "destructive" | "success" | "warning" | undefined | null;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.6)",
        },
      );
    }
  }, []);

  return (
    <span
      ref={ref}
      className={cn(
        "block rounded-full origin-center",
        indicatorColorVariants[color ?? "default"],
        size === "sm" && "h-2 w-2",
        size === "default" && "h-2.5 w-2.5",
        size === "lg" && "h-3 w-3",
        !size && "h-2.5 w-2.5",
      )}
    />
  );
}

function RadioGroupItem({
  className,
  size,
  color,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size, color }), className)}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center w-full h-full">
        <RadioIndicatorIcon size={size} color={color} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}




interface RadioWithLabelProps extends RadioGroupItemProps {
  label: string;
  description?: string;
}

function RadioWithLabel({
  label,
  description,
  className,
  ...props
}: RadioWithLabelProps) {
  const id = React.useId();

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <RadioGroupItem id={id} {...props} />
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}




interface RadioCardProps extends RadioPrimitive.Root.Props {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

function RadioCard({
  label,
  description,
  icon,
  className,
  value,
  ...props
}: RadioCardProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-card"
      value={value}
      className={cn(
        "relative flex flex-col gap-2 p-4 rounded-lg border-2 border-input bg-transparent cursor-pointer transition-colors",
        "hover:border-primary/50 hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[checked]:border-primary data-[checked]:bg-primary/5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="shrink-0 text-muted-foreground data-[checked]:text-primary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{label}</div>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
        <RadioPrimitive.Indicator className="flex items-center justify-center shrink-0">
          <span className="h-3 w-3 rounded-full bg-primary animate-in zoom-in-0 duration-200" />
        </RadioPrimitive.Indicator>
      </div>
    </RadioPrimitive.Root>
  );
}




const radioButtonGroupVariants = cva(
  "inline-flex rounded-lg bg-muted p-1 gap-1",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface RadioButtonGroupProps
  extends
    RadioGroupPrimitive.Props,
    VariantProps<typeof radioButtonGroupVariants> {}

function RadioButtonGroup({
  className,
  size,
  children,
  ...props
}: RadioButtonGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-button-group"
      className={cn(radioButtonGroupVariants({ size }), className)}
      {...props}
    >
      {children}
    </RadioGroupPrimitive>
  );
}

const radioButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        default: "h-8 px-3 text-sm",
        lg: "h-9 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface RadioButtonProps
  extends RadioPrimitive.Root.Props, VariantProps<typeof radioButtonVariants> {
  children: React.ReactNode;
}

function RadioButton({
  className,
  size,
  children,
  ...props
}: RadioButtonProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-button"
      className={cn(
        radioButtonVariants({ size }),
        "text-muted-foreground",
        "data-[checked]:bg-background data-[checked]:text-foreground data-[checked]:shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </RadioPrimitive.Root>
  );
}

export {
  RadioGroup,
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
  RadioButtonGroup,
  RadioButton,
  radioGroupVariants,
  radioItemVariants,
  radioButtonGroupVariants,
  radioButtonVariants,
};
export type {
  RadioGroupProps,
  RadioGroupItemProps,
  RadioWithLabelProps,
  RadioCardProps,
  RadioButtonGroupProps,
  RadioButtonProps,
};
