import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:bg-muted hover:text-muted-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-transparent data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        ghost:
          "bg-transparent hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        solid:
          "bg-muted text-muted-foreground data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
        success:
          "bg-transparent data-[pressed]:bg-success data-[pressed]:text-success-foreground",
        warning:
          "bg-transparent data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
        destructive:
          "bg-transparent data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
      },
      size: {
        sm: "h-8 px-2 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        default: "h-9 px-3 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-10 px-4 text-base [&_svg]:h-5 [&_svg]:w-5",
        icon: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
        "icon-sm": "h-8 w-8 [&_svg]:h-3.5 [&_svg]:w-3.5",
        "icon-lg": "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
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
  extends
    Omit<TogglePrimitive.Props, "children">,
    VariantProps<typeof toggleVariants> {
  "aria-label"?: string;
  "aria-describedby"?: string;
  loading?: boolean;
  showIndicator?: boolean;
  indicatorPosition?: "left" | "right";
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const warnIfMissingAriaLabel = (props: ToggleProps) => {
  if (typeof window !== "undefined" && import.meta.env?.DEV) {
    const hasTextContent =
      props.children &&
      typeof props.children === "string" &&
      props.children.trim().length > 0;

    const hasAriaLabel = !!props["aria-label"];
    const isIconOnly =
      props.icon ||
      props.size === "icon" ||
      props.size === "icon-sm" ||
      props.size === "icon-lg";

    if (isIconOnly && !hasAriaLabel && !hasTextContent) {
      // Icon-only toggles should have aria-label for accessibility
    }
  }
};

function Toggle({
  className,
  variant,
  size,
  shape,
  loading = false,
  showIndicator = false,
  indicatorPosition = "left",
  icon,
  children,
  disabled,
  pressed,
  defaultPressed,
  onPressedChange,
  ...props
}: ToggleProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [internalPressed, setInternalPressed] = React.useState(
    defaultPressed ?? false
  );

  const isPressed = pressed ?? internalPressed;

  warnIfMissingAriaLabel({ icon, size, children, ...props });

  const handlePressedChange: TogglePrimitive.Props["onPressedChange"] =
    React.useCallback(
      (
        newPressed: boolean,
        eventDetails: Parameters<
          NonNullable<TogglePrimitive.Props["onPressedChange"]>
        >[1]
      ) => {
        if (pressed === undefined) {
          setInternalPressed(newPressed);
        }

        onPressedChange?.(newPressed, eventDetails);

        if (ref.current && !loading) {
          ref.current.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(0.95)" },
              { transform: "scale(1)" },
            ],
            {
              duration: 150,
              easing: "ease-out",
            }
          );
        }
      },
      [pressed, onPressedChange, loading]
    );

  const renderIndicator = () => {
    if (loading) {
      return <IconLoader2 className="animate-spin" aria-hidden="true" />;
    }
    if (showIndicator && isPressed) {
      return <IconCheck aria-hidden="true" />;
    }
    return null;
  };

  const content = (
    <>
      {indicatorPosition === "left" && renderIndicator()}
      {icon}
      {children}
      {indicatorPosition === "right" && renderIndicator()}
    </>
  );

  return (
    <TogglePrimitive
      ref={ref}
      data-slot="toggle"
      data-loading={loading || undefined}
      className={cn(toggleVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      pressed={isPressed}
      defaultPressed={defaultPressed}
      onPressedChange={handlePressedChange}
      {...props}
    >
      {content}
    </TogglePrimitive>
  );
}

export { Toggle, toggleVariants };
export type { ToggleProps };
