"use client";

import * as React from "react";
import gsap from "gsap";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconX,
  IconLoader,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border border-border [&>svg]:text-foreground",
        info: "bg-info/10 border border-info/30 text-info [&>svg]:text-info",
        success:
          "bg-success/10 border border-success/30 text-success [&>svg]:text-success",
        warning:
          "bg-warning/10 border border-warning/30 text-warning [&>svg]:text-warning",
        destructive:
          "bg-destructive/10 border border-destructive/30 text-destructive [&>svg]:text-destructive",
        "outline-default":
          "bg-transparent border border-border text-foreground [&>svg]:text-foreground",
        "outline-info":
          "bg-transparent border border-info text-info [&>svg]:text-info",
        "outline-success":
          "bg-transparent border border-success text-success [&>svg]:text-success",
        "outline-warning":
          "bg-transparent border border-warning text-warning [&>svg]:text-warning",
        "outline-destructive":
          "bg-transparent border border-destructive text-destructive [&>svg]:text-destructive",
      },
      size: {
        xs: "p-2 text-xs [&>svg]:h-3 [&>svg]:w-3 [&>svg~*]:pl-5 [&>svg+div]:translate-y-[-2px] [&>svg]:top-2",
        sm: "p-3 text-sm [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg~*]:pl-6 [&>svg+div]:translate-y-[-2px] [&>svg]:top-3",
        default:
          "p-4 text-sm [&>svg]:h-4 [&>svg]:w-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:top-4",
        lg: "p-5 text-base [&>svg]:h-5 [&>svg]:w-5 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:top-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastProps {
  position?: ToastPosition;
  duration?: number;
  dismissable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  promise?: Promise<unknown>;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  size?: "xs" | "sm" | "default" | "lg";
  toast?: boolean;
  toastProps?: ToastProps;
  holdToClose?: boolean;
  holdDuration?: number;
  progressColor?: string;
}

function Alert({
  className,
  variant = "default",
  size = "default",
  showIcon = true,
  closable = false,
  onClose,
  toast = false,
  toastProps,
  holdToClose = false,
  holdDuration = 1500,
  progressColor,
  children,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const alertRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const holdAnimationRef = React.useRef<gsap.core.Tween | null>(null);
  const [isHolding, setIsHolding] = React.useState(false);
  const IconComponent = alertIcons[variant || "default"];
  const [toastState, setToastState] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const getProgressColor = React.useCallback(() => {
    if (progressColor) return progressColor;
    switch (variant) {
      case "info":
      case "outline-info":
        return "rgba(59, 130, 246, 0.6)";
      case "success":
      case "outline-success":
        return "rgba(34, 197, 94, 0.6)";
      case "warning":
      case "outline-warning":
        return "rgba(251, 191, 36, 0.7)";
      case "destructive":
      case "outline-destructive":
        return "rgba(239, 68, 68, 0.6)";
      case "default":
      case "outline-default":
      default:
        return "rgba(148, 163, 184, 0.5)";
    }
  }, [variant, progressColor]);

  const handleClose = React.useCallback(() => {
    if (alertRef.current) {
      gsap.to(alertRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => {
          setIsVisible(false);
          onClose?.();
        },
      });
    }
  }, [onClose]);

  const resetProgress = React.useCallback(() => {
    setIsHolding(false);
    if (holdAnimationRef.current) {
      holdAnimationRef.current.kill();
    }
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "0%",
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, []);

  const handlePointerDown = React.useCallback(() => {
    if (!holdToClose) return;
    setIsHolding(true);
    if (progressRef.current) {
      holdAnimationRef.current = gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        {
          width: "100%",
          duration: holdDuration / 1000,
          ease: "none",
          onComplete: () => {
            handleClose();
            resetProgress();
          },
        }
      );
    }
  }, [holdToClose, holdDuration, handleClose, resetProgress]);

  const handlePointerUp = React.useCallback(() => {
    if (!holdToClose) return;
    resetProgress();
  }, [holdToClose, resetProgress]);

  const handlePointerLeave = React.useCallback(() => {
    if (!holdToClose) return;
    if (isHolding) {
      resetProgress();
    }
  }, [holdToClose, isHolding, resetProgress]);

  React.useEffect(() => {
    if (toast && toastProps?.duration && toastProps.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toastProps.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, toastProps?.duration, handleClose]);

  React.useEffect(() => {
    if (toastProps?.promise) {
      setToastState("loading");
      toastProps.promise
        .then(() => setToastState("success"))
        .catch(() => setToastState("error"));
    }
  }, [toastProps?.promise]);

  const getToastIcon = React.useCallback(() => {
    if (toastProps?.promise) {
      switch (toastState) {
        case "loading":
          return IconLoader;
        case "success":
          return IconCircleCheck;
        case "error":
          return IconAlertCircle;
        default:
          return IconComponent;
      }
    }
    return IconComponent;
  }, [toastProps?.promise, toastState, IconComponent]);

  const ToastIconComponent = getToastIcon();

  const toastPositionClass = toast
    ? cn("fixed shadow-lg z-50", {
        "bottom-4 right-4":
          !toastProps?.position || toastProps.position === "bottom-right",
        "bottom-4 left-1/2 -translate-x-1/2":
          toastProps?.position === "bottom-center",
        "bottom-4 left-4": toastProps?.position === "bottom-left",
        "top-4 right-4": toastProps?.position === "top-right",
        "top-4 left-1/2 -translate-x-1/2":
          toastProps?.position === "top-center",
        "top-4 left-4": toastProps?.position === "top-left",
      })
    : "";

  if (!isVisible) return null;

  return (
    <div
      ref={alertRef}
      data-slot="alert"
      role={toast ? "status" : "alert"}
      aria-live={toast ? "polite" : undefined}
      className={cn(
        alertVariants({ variant, size }),
        toastPositionClass,
        holdToClose && "select-none cursor-pointer overflow-hidden",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {holdToClose && (
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full w-0 pointer-events-none transition-opacity duration-150"
          style={{
            backgroundColor: getProgressColor(),
            opacity: isHolding ? 1 : 0,
          }}
        />
      )}
      {showIcon &&
        ToastIconComponent &&
        React.createElement(ToastIconComponent, {
          className: cn(
            "h-4 w-4 relative z-10",
            toastState === "loading" && "animate-spin",
            toastState === "success" && "text-success",
            toastState === "error" && "text-destructive"
          ),
        })}
      <div className="relative z-10">{children}</div>
      {toastProps?.action && (
        <button
          onClick={toastProps.action.onClick}
          className="text-sm font-medium underline hover:no-underline ml-auto relative z-10"
        >
          {toastProps.action.label}
        </button>
      )}
      {(closable || toastProps?.dismissable) && (
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity z-20"
          aria-label="Close alert"
        >
          <IconX className="h-4 w-4" />
        </button>
      )}
      {holdToClose && (
        <p className="relative z-10 text-muted-foreground text-xs mt-2">
          Hold to dismiss
        </p>
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
  size?: "xs" | "sm" | "default" | "lg";
}

function HoldToCloseAlert({
  holdDuration = 1500,
  onClose,
  children,
  className,
  variant = "default",
  progressColor,
  size = "default",
}: HoldToCloseAlertProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<gsap.core.Tween | null>(null);
  const [isHolding, setIsHolding] = React.useState(false);

  const variantClasses = alertVariants({ variant, size });

  const getProgressColor = () => {
    if (progressColor) return progressColor;
    switch (variant) {
      case "info":
      case "outline-info":
        return "rgba(59, 130, 246, 0.6)";
      case "success":
      case "outline-success":
        return "rgba(34, 197, 94, 0.6)";
      case "warning":
      case "outline-warning":
        return "rgba(251, 191, 36, 0.7)";
      case "destructive":
      case "outline-destructive":
        return "rgba(239, 68, 68, 0.6)";
      case "default":
      case "outline-default":
      default:
        return "rgba(148, 163, 184, 0.5)";
    }
  };

  const getTextClass = () => {
    switch (size) {
      case "xs":
        return "text-[10px]";
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-xs";
    }
  };

  const handlePointerDown = () => {
    setIsHolding(true);
    if (progressRef.current) {
      animationRef.current = gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        {
          width: "100%",
          duration: holdDuration / 1000,
          ease: "none",
          onComplete: () => {
            onClose?.();
            resetProgress();
          },
        }
      );
    }
  };

  const resetProgress = () => {
    setIsHolding(false);
    if (animationRef.current) {
      animationRef.current.kill();
    }
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "0%",
        duration: 0.15,
        ease: "power2.out",
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
      <p
        className={cn(
          "relative z-10 text-muted-foreground mt-2",
          getTextClass()
        )}
      >
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
export type {
  AlertProps,
  AlertWithHeadingProps,
  HoldToCloseAlertProps,
  ToastProps,
};
