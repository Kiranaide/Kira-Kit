import * as React from "react";
import { animate } from "animejs";
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
  extends RadioGroupPrimitive.Props,
    VariantProps<typeof radioGroupVariants> {}

function RadioGroup({
  className,
  orientation = "vertical",
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn(radioGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

const radioItemVariants = cva(
  "relative aspect-square rounded-full border-2 border-primary text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-all",
  {
    variants: {
      size: {
        sm: "h-4 w-4", // 16px
        default: "h-5 w-5", // 20px
        lg: "h-6 w-6", // 24px
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface RadioGroupItemProps
  extends RadioPrimitive.Root.Props,
    VariantProps<typeof radioItemVariants> {}

function RadioIndicatorIcon({
  size,
}: {
  size: "sm" | "default" | "lg" | undefined | null;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      animate(ref.current, {
        scale: [0, 1],
        duration: 400,
        ease: "outElastic(1, 0.6)",
      });
    }
  }, []);

  return (
    <span
      ref={ref}
      className={cn(
        "block rounded-full bg-primary origin-center",
        size === "sm" && "h-2 w-2",
        size === "default" && "h-2.5 w-2.5",
        size === "lg" && "h-3 w-3",
        !size && "h-2.5 w-2.5"
      )}
    />
  );
}

function RadioGroupItem({ className, size, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center w-full h-full">
        <RadioIndicatorIcon size={size} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

// ============================================
// RADIO WITH LABEL
// ============================================
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

// ============================================
// RADIO CARD (card-style selectable radio)
// ============================================
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
        className
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
          <span className="h-3 w-3 rounded-full bg-primary" />
        </RadioPrimitive.Indicator>
      </div>
    </RadioPrimitive.Root>
  );
}

export {
  RadioGroup,
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
  radioGroupVariants,
  radioItemVariants,
};
export type {
  RadioGroupProps,
  RadioGroupItemProps,
  RadioWithLabelProps,
  RadioCardProps,
};
