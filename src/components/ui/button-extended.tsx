"use client";

import * as React from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================
// HOLD BUTTON (Hold to execute, release to cancel)
// ============================================
interface HoldButtonProps {
  holdDuration?: number; // in milliseconds
  onHoldComplete?: () => void;
  progressColor?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "xs";
}

function HoldButton({
  holdDuration = 1000,
  onHoldComplete,
  progressColor,
  children,
  className,
  disabled,
  variant = "default",
  ...props
}: HoldButtonProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const [isHolding, setIsHolding] = React.useState(false);

  // Determine progress color based on variant
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    if (variant === "destructive") return "rgba(255, 255, 255, 0.4)";
    if (variant === "default") return "rgba(255, 255, 255, 0.4)";
    return "hsl(var(--primary) / 0.3)";
  };

  const handlePointerDown = () => {
    if (disabled) return;
    setIsHolding(true);

    if (progressRef.current) {
      animationRef.current = animate(progressRef.current, {
        width: ["0%", "100%"],
        duration: holdDuration,
        ease: "linear",
        onComplete: () => {
          onHoldComplete?.();
          resetProgress();
        },
      });
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

  const handlePointerUp = () => {
    resetProgress();
  };

  const handlePointerLeave = () => {
    if (isHolding) {
      resetProgress();
    }
  };

  return (
    <Button
      className={cn("relative overflow-hidden select-none", className)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      disabled={disabled}
      variant={variant}
      {...props}
    >
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
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Button>
  );
}

// ============================================
// EXPANDABLE ICON BUTTON (Icon → Icon + Text on hover)
// ============================================
interface ExpandableIconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  icon: React.ReactNode;
  label: string;
  expandDirection?: "left" | "right";
}

function ExpandableIconButton({
  icon,
  label,
  expandDirection = "right",
  className,
  ...props
}: ExpandableIconButtonProps) {
  const textRef = React.useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
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
  };

  const handleMouseLeave = () => {
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
  };

  return (
    <Button
      className={cn(
        "px-2 h-8 min-w-8 gap-0",
        expandDirection === "left" && "flex-row-reverse",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className="shrink-0 flex items-center justify-center size-4">
        {icon}
      </span>
      <span
        ref={textRef}
        className="overflow-hidden whitespace-nowrap text-sm"
        style={{ width: 0, opacity: 0 }}
      >
        {label}
      </span>
    </Button>
  );
}

// ============================================
// HOLD TO CLOSE ALERT (Hold to dismiss, release to cancel)
// ============================================
interface HoldToCloseAlertProps {
  holdDuration?: number;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "info" | "success" | "warning" | "destructive";
  progressColor?: string;
}

function HoldToCloseAlert({
  holdDuration = 1500,
  onClose,
  children,
  className,
  variant = "default",
  progressColor,
}: HoldToCloseAlertProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const [isHolding, setIsHolding] = React.useState(false);

  const variantClasses = {
    default: "border-border bg-background text-foreground",
    info: "border-info/30 bg-info/10 text-info-foreground",
    success: "border-success/30 bg-success/10 text-success-foreground",
    warning: "border-warning/30 bg-warning/10 text-warning-foreground",
    destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  };

  const getProgressColor = () => {
    if (progressColor) return progressColor;
    switch (variant) {
      case "info":
        return "hsl(var(--info) / 0.3)";
      case "success":
        return "hsl(var(--success) / 0.3)";
      case "warning":
        return "hsl(var(--warning) / 0.3)";
      case "destructive":
        return "hsl(var(--destructive) / 0.3)";
      default:
        return "hsl(var(--muted-foreground) / 0.3)";
    }
  };

  const handlePointerDown = () => {
    setIsHolding(true);
    if (progressRef.current) {
      animationRef.current = animate(progressRef.current, {
        width: ["0%", "100%"],
        duration: holdDuration,
        ease: "linear",
        onComplete: () => {
          onClose?.();
          resetProgress();
        },
      });
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

  const handlePointerUp = () => {
    resetProgress();
  };

  const handlePointerLeave = () => {
    if (isHolding) {
      resetProgress();
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 select-none cursor-pointer",
        variantClasses[variant],
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={progressRef}
        className="absolute left-0 top-0 h-full pointer-events-none"
        style={{
          width: 0,
          backgroundColor: getProgressColor(),
        }}
      />
      <div className="relative z-10">{children}</div>
      <p className="relative z-10 text-xs text-muted-foreground mt-2">
        Hold to dismiss
      </p>
    </div>
  );
}

export { HoldButton, ExpandableIconButton, HoldToCloseAlert };
export type {
  HoldButtonProps,
  ExpandableIconButtonProps,
  HoldToCloseAlertProps,
};
