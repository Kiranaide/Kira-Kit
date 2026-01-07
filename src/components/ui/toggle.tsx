import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { animate } from "animejs";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-transparent data-[pressed]:bg-muted data-[pressed]:text-foreground",
        outline:
          "border border-input bg-transparent hover:bg-muted hover:text-foreground data-[pressed]:bg-muted data-[pressed]:text-foreground",
        ghost:
          "bg-transparent hover:bg-muted hover:text-foreground data-[pressed]:bg-muted data-[pressed]:text-foreground",
        success:
          "bg-transparent data-[pressed]:bg-success data-[pressed]:text-success-foreground",
        warning:
          "bg-transparent data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
        destructive:
          "bg-transparent data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
      size: {
        sm: "h-8 px-2 [&_svg]:h-4 [&_svg]:w-4",
        default: "h-9 px-3 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-10 px-4 [&_svg]:h-5 [&_svg]:w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

interface ToggleProps
  extends TogglePrimitive.Props,
    VariantProps<typeof toggleVariants> {}

function Toggle({ className, variant, size, shape, ...props }: ToggleProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const handlePressedChange = (pressed: boolean) => {
    props.onPressedChange?.(pressed);

    if (ref.current) {
      animate(ref.current, {
        scale: [1, 0.95, 1],
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  };

  return (
    <TogglePrimitive
      ref={ref}
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, shape }), className)}
      onPressedChange={handlePressedChange}
      {...props}
    />
  );
}

// ============================================
// TOGGLE GROUP
// ============================================
const toggleGroupVariants = cva("inline-flex gap-1 items-center", {
  variants: {
    variant: {
      default: "",
      outline:
        "[&>[data-slot=toggle-group-item]]:border [&>[data-slot=toggle-group-item]]:border-input",
    },
    size: {
      sm: "[&>[data-slot=toggle-group-item]]:h-8 [&>[data-slot=toggle-group-item]]:px-2",
      default:
        "[&>[data-slot=toggle-group-item]]:h-9 [&>[data-slot=toggle-group-item]]:px-3",
      lg: "[&>[data-slot=toggle-group-item]]:h-10 [&>[data-slot=toggle-group-item]]:px-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ToggleGroupContextValue = {
  variant?: VariantProps<typeof toggleGroupVariants>["variant"];
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({});

interface ToggleGroupProps
  extends ToggleGroupPrimitive.Props,
    VariantProps<typeof toggleGroupVariants> {}

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ variant }}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        className={cn(toggleGroupVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps extends ToggleGroupPrimitive.Item.Props {
  variant?: "default" | "success" | "warning" | "destructive";
}

function ToggleGroupItem({
  className,
  variant = "default",
  children,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  const ref = React.useRef<HTMLButtonElement>(null);

  const handlePressedChange = (pressed: boolean) => {
    props.onPressedChange?.(pressed);

    if (ref.current) {
      animate(ref.current, {
        scale: [1, 0.95, 1],
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  };

  return (
    <TogglePrimitive
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "success" &&
          "data-[pressed]:bg-success data-[pressed]:text-success-foreground",
        variant === "warning" &&
          "data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
        variant === "destructive" &&
          "data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
        variant === "default" &&
          "data-[pressed]:bg-muted data-[pressed]:text-foreground",
        context.variant === "outline" && "border border-input",
        className
      )}
      onPressedChange={handlePressedChange}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export {
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  toggleVariants,
  toggleGroupVariants,
};
export type { ToggleProps, ToggleGroupProps, ToggleGroupItemProps };
