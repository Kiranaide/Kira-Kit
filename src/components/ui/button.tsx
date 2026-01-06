"use client";

import * as React from "react";
import { animate } from "animejs";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Destructive variants
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:text-foreground",
        "destructive-outline":
          "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 dark:border-destructive/30 dark:text-destructive",
        "destructive-ghost":
          "text-destructive hover:bg-destructive/10 dark:text-destructive",
        // Info variants
        info: "bg-info text-info-foreground hover:bg-info/90 dark:text-foreground",
        "info-outline":
          "border-info/50 bg-info/10 text-info-foreground hover:bg-info/20 dark:border-info/30 dark:text-info",
        "info-ghost": "text-info-foreground hover:bg-info/10 dark:text-info",
        // Success variants
        success:
          "bg-success text-success-foreground hover:bg-success/90 dark:text-foreground",
        "success-outline":
          "border-success/50 bg-success/10 text-success-foreground hover:bg-success/20 dark:border-success/30 dark:text-success",
        "success-ghost":
          "text-success-foreground hover:bg-success/10 dark:text-success",
        // Warning variants
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 dark:text-foreground",
        "warning-outline":
          "border-warning/50 bg-warning/10 text-warning-foreground hover:bg-warning/20 dark:border-warning/30 dark:text-warning",
        "warning-ghost":
          "text-warning-foreground hover:bg-warning/10 dark:text-warning",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    Omit<React.ComponentPropsWithoutRef<"button">, "size"> {
  holdDuration?: number; // in milliseconds
  onHoldComplete?: () => void;
  progressColor?: string;
}

function Button({
  className,
  variant = "default",
  size = "default",
  holdDuration,
  onHoldComplete,
  progressColor,
  disabled,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ...props
}: ButtonProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const [isHolding, setIsHolding] = React.useState(false);

  // Determine progress color based on variant - more vibrant and colorful
  const getProgressColor = () => {
    if (progressColor) return progressColor;

    // Use vibrant, semi-transparent colors that match the variant
    switch (variant) {
      case "destructive":
        return "rgba(255, 255, 255, 0.5)";
      case "default":
        return "rgba(255, 255, 255, 0.5)";
      case "secondary":
        return "rgba(255, 255, 255, 0.4)";
      case "info":
        return "rgba(59, 130, 246, 0.6)"; // Bright blue
      case "success":
        return "rgba(34, 197, 94, 0.6)"; // Bright green
      case "warning":
        return "rgba(251, 191, 36, 0.7)"; // Bright amber/yellow
      case "outline":
        return "hsl(var(--primary) / 0.4)";
      case "ghost":
        return "hsl(var(--primary) / 0.3)";
      default:
        return "hsl(var(--primary) / 0.4)";
    }
  };

  const resetProgress = () => {
    setIsHolding(false);
    if (animationRef.current) {
      animationRef.current.pause();
    }
    if (progressRef.current) {
      animate(progressRef.current, {
        width: "0%",
        duration: 150,
        ease: "outQuad",
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || !onHoldComplete) {
      onPointerDown?.(e);
      return;
    }

    setIsHolding(true);

    if (progressRef.current) {
      animationRef.current = animate(progressRef.current, {
        width: ["0%", "100%"],
        duration: holdDuration || 1000,
        ease: "linear",
        onComplete: () => {
          onHoldComplete();
          resetProgress();
        },
      });
    }

    onPointerDown?.(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (onHoldComplete) {
      resetProgress();
    }
    onPointerUp?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (onHoldComplete && isHolding) {
      resetProgress();
    }
    onPointerLeave?.(e);
  };

  const isHoldButton = !!onHoldComplete;

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        isHoldButton && "relative overflow-hidden select-none"
      )}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {isHoldButton && (
        <>
          {/* Progress bar - visible left-to-right animation */}
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full pointer-events-none"
            style={{
              width: 0,
              backgroundColor: getProgressColor(),
            }}
          />
          {/* Content with proper flex alignment */}
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        </>
      )}
      {!isHoldButton && children}
    </ButtonPrimitive>
  );
}

// ============================================
// HOLD BUTTON (backward compatibility wrapper)
// ============================================
interface HoldButtonProps extends ButtonProps {
  holdDuration?: number;
  onHoldComplete?: () => void;
  progressColor?: string;
}

/**
 * @deprecated Use Button with onHoldComplete prop instead
 * This component is kept for backward compatibility
 */
function HoldButton(props: HoldButtonProps) {
  return <Button {...props} />;
}

// ============================================
// EXPANDABLE ICON BUTTON (Icon → Icon + Text on hover)
// ============================================
interface ExpandableIconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  label: string;
  expandDirection?: "left" | "right";
  className?: string;
}

function ExpandableIconButton({
  icon,
  label,
  expandDirection = "right",
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ExpandableIconButtonProps) {
  const textRef = React.useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      // Animate text appearing
      animate(textRef.current, {
        width: ["0px", `${textWidth}px`],
        opacity: [0, 1],
        marginLeft: expandDirection === "right" ? ["0px", "8px"] : 0,
        marginRight: expandDirection === "left" ? ["0px", "8px"] : 0,
        duration: 200,
        ease: "outQuad",
      });
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (textRef.current) {
      animate(textRef.current, {
        width: "0px",
        opacity: 0,
        marginLeft: 0,
        marginRight: 0,
        duration: 150,
        ease: "inQuad",
      });
    }
    onMouseLeave?.(e);
  };

  const isHoldButton = !!props.onHoldComplete;

  return (
    <Button
      className={cn(
        "px-2 h-8 min-w-8 gap-0",
        expandDirection === "left" && "flex-row-reverse",
        // When hold button, override the gap from the wrapper span created by Button
        // The Button wraps children in: <span className="relative z-10 flex items-center gap-2">
        isHoldButton && "[&>span.relative.z-10.flex.items-center]:gap-0",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span
        className={cn(
          "shrink-0 flex items-center justify-center size-4",
          // When hold button, ensure proper structure
          isHoldButton && "relative z-10"
        )}
      >
        {icon}
      </span>
      <span
        ref={textRef}
        className={cn(
          "overflow-hidden whitespace-nowrap text-sm",
          // When hold button, ensure proper z-index
          isHoldButton && "relative z-10"
        )}
        style={{ width: 0, opacity: 0 }}
      >
        {label}
      </span>
    </Button>
  );
}

// Export buttonVariants separately to avoid fast refresh warning
export { buttonVariants };

export { Button, HoldButton, ExpandableIconButton };
export type { ButtonProps, HoldButtonProps, ExpandableIconButtonProps };
