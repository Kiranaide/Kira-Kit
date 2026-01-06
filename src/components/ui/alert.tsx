"use client";

import * as React from "react";
import { animate } from "animejs";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border border-border [&>svg]:text-foreground",
        info: "bg-info/10 border border-info/30 text-info-foreground [&>svg]:text-info-foreground",
        success:
          "bg-success/10 border border-success/30 text-success-foreground [&>svg]:text-success-foreground",
        warning:
          "bg-warning/10 border border-warning/30 text-warning-foreground [&>svg]:text-warning-foreground",
        destructive:
          "bg-destructive/10 border border-destructive/30 text-destructive-foreground [&>svg]:text-destructive-foreground",
        // Outline variants
        "outline-default":
          "bg-transparent border border-border text-foreground [&>svg]:text-foreground",
        "outline-info":
          "bg-transparent border border-info text-info-foreground [&>svg]:text-info-foreground",
        "outline-success":
          "bg-transparent border border-success text-success-foreground [&>svg]:text-success-foreground",
        "outline-warning":
          "bg-transparent border border-warning text-warning-foreground [&>svg]:text-warning-foreground",
        "outline-destructive":
          "bg-transparent border border-destructive text-destructive-foreground [&>svg]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const alertIcons = {
  default: null,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  destructive: IconAlertCircle,
  "outline-default": null,
  "outline-info": IconInfoCircle,
  "outline-success": IconCircleCheck,
  "outline-warning": IconAlertTriangle,
  "outline-destructive": IconAlertCircle,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

function Alert({
  className,
  variant = "default",
  showIcon = true,
  closable = false,
  onClose,
  children,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const alertRef = React.useRef<HTMLDivElement>(null);
  const IconComponent = alertIcons[variant || "default"];

  const handleClose = () => {
    if (alertRef.current) {
      // Use Web Animation API for smooth close animation
      alertRef.current.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-10px)" },
        ],
        {
          duration: 200,
          easing: "ease-in",
          fill: "forwards",
        }
      ).onfinish = () => {
        setIsVisible(false);
        onClose?.();
      };
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={alertRef}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && IconComponent && <IconComponent className="h-4 w-4" />}
      {children}
      {closable && (
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <IconX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

// Alert with Heading component
interface AlertWithHeadingProps extends AlertProps {
  title: string;
  description?: string;
}

function AlertWithHeading({
  title,
  description,
  children,
  ...props
}: AlertWithHeadingProps) {
  return (
    <Alert {...props}>
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </Alert>
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
  variant?:
    | "default"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "outline-default"
    | "outline-info"
    | "outline-success"
    | "outline-warning"
    | "outline-destructive";
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

  // Use alertVariants for styling consistency
  const variantClasses = alertVariants({ variant });

  const getProgressColor = () => {
    if (progressColor) return progressColor;
    // Use vibrant, colorful progress bars that match the variant
    switch (variant) {
      case "info":
      case "outline-info":
        return "rgba(59, 130, 246, 0.6)"; // Bright blue
      case "success":
      case "outline-success":
        return "rgba(34, 197, 94, 0.6)"; // Bright green
      case "warning":
      case "outline-warning":
        return "rgba(251, 191, 36, 0.7)"; // Bright amber/yellow
      case "destructive":
      case "outline-destructive":
        return "rgba(239, 68, 68, 0.6)"; // Bright red
      case "default":
      case "outline-default":
      default:
        return "rgba(148, 163, 184, 0.5)"; // Muted gray
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
        variantClasses,
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={progressRef}
        className="absolute left-0 top-0 h-full w-0 pointer-events-none transition-opacity duration-150"
        style={{
          backgroundColor: getProgressColor(),
          opacity: isHolding ? 1 : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
      <p className="relative z-10 text-xs text-muted-foreground mt-2">
        Hold to dismiss
      </p>
    </div>
  );
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertWithHeading,
  HoldToCloseAlert,
  alertVariants,
};
export type { HoldToCloseAlertProps };
