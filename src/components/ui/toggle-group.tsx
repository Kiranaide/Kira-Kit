import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-muted p-1",
        outline: "border border-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ToggleGroupProps
  extends ToggleGroupPrimitive.Props,
    VariantProps<typeof toggleGroupVariants> {}

const ToggleGroupContext = React.createContext<{
  variant?: "default" | "outline" | null;
  size?: "sm" | "default" | "lg" | null;
}>({});

function ToggleGroup({
  className,
  variant,
  children,
  ...props
}: ToggleGroupProps & { size?: "sm" | "default" | "lg" }) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size: props.size }}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        className={cn(toggleGroupVariants({ variant }), className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupContext.Provider>
  );
}

const toggleGroupItemVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-sm",
  {
    variants: {
      variant: {
        default: "rounded-md",
        outline:
          "rounded-none border-r last:border-r-0 first:rounded-l-lg last:rounded-r-lg",
      },
      size: {
        sm: "h-7 px-2",
        default: "h-9 px-3",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ToggleGroupItemProps
  extends TogglePrimitive.Props,
    VariantProps<typeof toggleGroupItemVariants> {}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = variant ?? context.variant ?? "default";
  const resolvedSize = size ?? context.size ?? "default";

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        toggleGroupItemVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
