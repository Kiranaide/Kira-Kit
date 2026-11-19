import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { IconSparkles } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const welcomeVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type WelcomeProps = Omit<React.ComponentPropsWithoutRef<"button">, "size"> &
  VariantProps<typeof welcomeVariants>;

export function Welcome({
  children = "Start building",
  className,
  variant,
  size,
  ...props
}: WelcomeProps) {
  return (
    <ButtonPrimitive
      data-slot="welcome"
      className={cn(welcomeVariants({ variant, size }), className)}
      {...props}
    >
      <IconSparkles aria-hidden="true" />
      {children}
    </ButtonPrimitive>
  );
}

export { welcomeVariants };
