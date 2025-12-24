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
  "relative aspect-square rounded-full border-2 border-primary text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
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

function RadioGroupItem({ className, size, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center">
        <span
          className={cn(
            "block rounded-full bg-primary",
            size === "sm" && "h-1.5 w-1.5",
            size === "default" && "h-2 w-2",
            size === "lg" && "h-2.5 w-2.5",
            !size && "h-2 w-2"
          )}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem, radioGroupVariants, radioItemVariants };
