"use client";

/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { IconCopy, IconCheck, IconSparkles } from "@tabler/icons-react";

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none cursor-pointer",
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
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:text-foreground",
        "destructive-outline":
          "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 dark:border-destructive/30 dark:text-destructive",
        "destructive-ghost":
          "text-destructive hover:bg-destructive/10 dark:text-destructive",
        info: "bg-info text-info-foreground hover:bg-info/90 dark:text-foreground",
        "info-outline":
          "border-info/50 bg-info/10 text-info-foreground hover:bg-info/20 dark:border-info/30 dark:text-info",
        "info-ghost": "text-info-foreground hover:bg-info/10 dark:text-info",
        success:
          "bg-success text-success-foreground hover:bg-success/90 dark:text-foreground",
        "success-outline":
          "border-success/50 bg-success/10 text-success-foreground hover:bg-success/20 dark:border-success/30 dark:text-success",
        "success-ghost":
          "text-success-foreground hover:bg-success/10 dark:text-success",
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
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

interface ButtonProps
  extends
    VariantProps<typeof buttonVariants>,
    Omit<React.ComponentPropsWithoutRef<"button">, "size"> {
  holdDuration?: number;
  onHoldComplete?: () => void;
  progressColor?: string;
  rippleColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ButtonSize =
  "xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

const getButtonIconSize = (size: ButtonSize | null | undefined): string => {
  const sizes: Record<string, string> = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
    icon: "h-4 w-4",
    "icon-xs": "h-3 w-3",
    "icon-sm": "h-3.5 w-3.5",
    "icon-lg": "h-5 w-5",
  };
  return sizes[size || "default"] || "h-4 w-4";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      holdDuration,
      onHoldComplete,
      progressColor,
      rippleColor,
      disabled,
      leftIcon,
      rightIcon,
      children,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const progressRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [isHolding, setIsHolding] = React.useState(false);
    const [ripples, setRipples] = React.useState<
      Array<{ id: number; x: number; y: number }>
    >([]);
    const rippleIdRef = React.useRef(0);
    const [isKeyboardHolding, setIsKeyboardHolding] = React.useState(false);
    const holdTweenRef = React.useRef<gsap.core.Tween | null>(null);

    const getRippleColor = (): string => {
      if (rippleColor) return rippleColor;

      const colors: Record<string, string> = {
        default: "rgba(255, 255, 255, 0.3)",
        primary: "rgba(255, 255, 255, 0.3)",
        secondary: "rgba(255, 255, 255, 0.25)",
        destructive: "rgba(255, 255, 255, 0.3)",
        info: "rgba(255, 255, 255, 0.3)",
        success: "rgba(255, 255, 255, 0.3)",
        warning: "rgba(255, 255, 255, 0.35)",
        outline: "rgba(0, 0, 0, 0.1)",
        ghost: "rgba(0, 0, 0, 0.08)",
        "destructive-outline": "rgba(239, 68, 68, 0.2)",
        "destructive-ghost": "rgba(239, 68, 68, 0.15)",
        "info-outline": "rgba(59, 130, 246, 0.2)",
        "info-ghost": "rgba(59, 130, 246, 0.15)",
        "success-outline": "rgba(34, 197, 94, 0.2)",
        "success-ghost": "rgba(34, 197, 94, 0.15)",
        "warning-outline": "rgba(251, 191, 36, 0.25)",
        "warning-ghost": "rgba(251, 191, 36, 0.2)",
      };

      const safeVariant: string = variant || "default";
      return colors[safeVariant] || "rgba(0, 0, 0, 0.1)";
    };

    const getProgressColor = (): string => {
      if (progressColor) return progressColor;

      const colors: Record<string, string> = {
        destructive: "rgba(255, 255, 255, 0.5)",
        default: "rgba(255, 255, 255, 0.5)",
        secondary: "rgba(255, 255, 255, 0.4)",
        info: "rgba(59, 130, 246, 0.6)",
        success: "rgba(34, 197, 94, 0.6)",
        warning: "rgba(251, 191, 36, 0.7)",
        outline: "hsl(var(--primary) / 0.4)",
        ghost: "hsl(var(--primary) / 0.3)",
      };

      const safeVariant: string = variant || "default";
      return colors[safeVariant] || "hsl(var(--primary) / 0.4)";
    };

    const handlePressAnimation = (): void => {
      if (disabled || !buttonRef.current) return;

      gsap.to(buttonRef.current, {
        scale: 0.96,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    };

    const handleRipple = (e: React.PointerEvent<HTMLButtonElement>): void => {
      if (disabled) return;

      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;

      setRipples((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        const rippleElement = document.getElementById(`ripple-${id}`);
        if (rippleElement) {
          gsap.fromTo(
            rippleElement,
            { scale: 0, opacity: 0.5 },
            {
              scale: 1.5,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                setRipples((prev) => prev.filter((r) => r.id !== id));
              },
            },
          );
        }
      }, 0);
    };

    const resetProgress = (): void => {
      setIsHolding(false);
      setIsKeyboardHolding(false);
      if (holdTweenRef.current) {
        holdTweenRef.current.kill();
        holdTweenRef.current = null;
      }
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          width: "0%",
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    const startHold = (): void => {
      if (disabled || !onHoldComplete) return;

      setIsHolding(true);

      if (progressRef.current) {
        gsap.set(progressRef.current, { width: "0%" });
        holdTweenRef.current = gsap.to(progressRef.current, {
          width: "100%",
          duration: (holdDuration || 1000) / 1000,
          ease: "none",
          onComplete: () => {
            onHoldComplete?.();
            resetProgress();
          },
        });
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) {
        onPointerDown?.(e);
        return;
      }

      handlePressAnimation();
      handleRipple(e);

      if (onHoldComplete) {
        startHold();
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
      if (onHoldComplete && (isHolding || isKeyboardHolding)) {
        resetProgress();
      }
      onPointerLeave?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (onHoldComplete && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setIsKeyboardHolding(true);
        startHold();
      }
      props.onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (onHoldComplete && (e.key === "Enter" || e.key === " ")) {
        setIsKeyboardHolding(false);
        resetProgress();
      }
      props.onKeyUp?.(e);
    };

    const isHoldButton = !!onHoldComplete;

    const renderContent = () => {
      if (leftIcon || rightIcon) {
        return (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        );
      }
      return children;
    };

    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          "relative overflow-hidden",
          disabled && "cursor-not-allowed",
        )}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...props}
      >
        {isHoldButton && (
          <>
            <div
              ref={progressRef}
              className="absolute left-0 top-0 h-full pointer-events-none"
              style={{
                width: 0,
                backgroundColor: getProgressColor(),
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {renderContent()}
            </span>
          </>
        )}
        {!isHoldButton && (
          <>
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                id={`ripple-${ripple.id}`}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: "100px",
                  height: "100px",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: getRippleColor(),
                }}
              />
            ))}
            <span className="relative z-10 flex items-center gap-2">
              {renderContent()}
            </span>
          </>
        )}
      </ButtonPrimitive>
    );
  },
);
Button.displayName = "Button";

interface HoldButtonProps extends ButtonProps {
  holdDuration?: number;
  onHoldComplete?: () => void;
  progressColor?: string;
}

function HoldButton(props: HoldButtonProps) {
  return <Button {...props} />;
}

interface ExpandableIconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  label: string;
  expandDirection?: "left" | "right";
  className?: string;
}

const ExpandableIconButton = React.forwardRef<
  HTMLButtonElement,
  ExpandableIconButtonProps
>(function ExpandableIconButton(
  {
    icon,
    label,
    expandDirection = "right",
    className,
    onMouseEnter,
    onMouseLeave,
    variant,
    ...props
  },
  ref,
) {
  const textRef = React.useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      gsap.to(textRef.current, {
        width: textWidth,
        opacity: 1,
        marginLeft: expandDirection === "right" ? 8 : 0,
        marginRight: expandDirection === "left" ? 8 : 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        width: 0,
        opacity: 0,
        marginLeft: 0,
        marginRight: 0,
        duration: 0.15,
        ease: "power2.in",
      });
    }
    onMouseLeave?.(e);
  };

  const isHoldButton = !!props.onHoldComplete;

  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn(
        "h-8 min-w-8 w-auto px-2 gap-0 [&>span]:gap-0",
        expandDirection === "left" && "flex-row-reverse",
        isHoldButton && "[&>span.relative.z-10.flex.items-center]:gap-0",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={label}
      {...props}
    >
      <span
        className={cn(
          "shrink-0 flex items-center justify-center size-4",
          isHoldButton && "relative z-10",
        )}
      >
        {icon}
      </span>
      <span
        ref={textRef}
        className={cn(
          "overflow-hidden whitespace-nowrap text-sm",
          isHoldButton && "relative z-10",
        )}
        style={{ width: 0, opacity: 0 }}
        aria-hidden="true"
      >
        {label}
      </span>
    </Button>
  );
});
ExpandableIconButton.displayName = "ExpandableIconButton";

function LoadingSpinner({ size }: { size: ButtonSize | null | undefined }) {
  const spinnerRef = React.useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  const spinnerSizes: Record<string, string> = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-4.5 w-4.5",
    icon: "h-4 w-4",
    "icon-xs": "h-3 w-3",
    "icon-sm": "h-3.5 w-3.5",
    "icon-lg": "h-4.5 w-4.5",
  };
  const spinnerSize = spinnerSizes[size || "default"] || "h-4 w-4";

  return (
    <svg
      ref={spinnerRef}
      className={cn(spinnerSize)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  size = "default",
  className,
  leftIcon,
  rightIcon,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn(isLoading && "cursor-wait", className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      size={size}
      leftIcon={isLoading ? <LoadingSpinner size={size} /> : leftIcon}
      rightIcon={!isLoading ? rightIcon : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          {(loadingText || children) && (
            <span className="sr-only">{loadingText || "Loading"}</span>
          )}
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

interface CopyButtonProps extends Omit<ButtonProps, "children"> {
  text: string;
  confirmDuration?: number;
  successMessage?: string;
}

function CopyButton({
  text,
  confirmDuration = 2000,
  successMessage = "Copied!",
  size = "default",
  variant = "outline",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), confirmDuration);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const iconSize = getButtonIconSize(size);

  return (
    <Button
      onClick={handleCopy}
      size={size}
      variant={variant}
      disabled={copied || props.disabled}
      leftIcon={
        copied ? (
          <IconCheck className={iconSize} />
        ) : (
          <IconCopy className={iconSize} />
        )
      }
      {...props}
    />
  );
}

interface ButtonWithLabelProps extends ButtonProps {
  label: string;
  description?: string;
  error?: string;
}

function ButtonWithLabel({
  label,
  description,
  error,
  className,
  id,
  ...props
}: ButtonWithLabelProps) {
  const generatedId = React.useId();
  const buttonId = id || generatedId;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={buttonId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Button id={buttonId} aria-invalid={!!error} {...props} />
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface IconButtonWithTooltipProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  tooltip: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

function IconButtonWithTooltip({
  icon,
  tooltip,
  tooltipSide = "top",
  className,
  "aria-label": ariaLabel,
  ...props
}: IconButtonWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          className={className}
          aria-label={ariaLabel || tooltip}
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

interface CompoundButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  iconPosition?: "left" | "right";
}

function CompoundButton({
  icon,
  label,
  description,
  iconPosition = "left",
  className,
  size = "default",
  ...props
}: CompoundButtonProps) {
  const containerClass = (() => {
    const safeSize = size || "default";
    switch (safeSize) {
      case "xs":
        return "py-1 px-2";
      case "sm":
        return "py-1.5 px-2.5";
      case "lg":
        return "py-2.5 px-4";
      default:
        return "py-2 px-3";
    }
  })();

  const iconSize = getButtonIconSize(size);

  return (
    <Button
      className={cn(
        "flex-col items-start h-auto gap-1",
        containerClass,
        className,
      )}
      leftIcon={iconPosition === "left" ? icon : undefined}
      rightIcon={iconPosition === "right" ? icon : undefined}
      {...props}
    >
      <div className="flex items-center gap-2 w-full">
        {iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        {iconPosition === "right" && (
          <span className={cn("shrink-0 ml-auto", iconSize)}>{icon}</span>
        )}
        <span className="font-medium">{label}</span>
        {iconPosition === "left" && (
          <span className={cn("shrink-0 ml-auto", iconSize)}>{icon}</span>
        )}
      </div>
      {description && (
        <span className="text-xs opacity-70 w-full">{description}</span>
      )}
    </Button>
  );
}

interface AsyncButtonProps extends Omit<ButtonProps, "onClick" | "disabled"> {
  onAsyncClick: () => Promise<void>;
  loadingText?: string;
  successDuration?: number;
  successMessage?: string;
  errorMessage?: string;
}

function AsyncButton({
  onAsyncClick,
  loadingText = "Loading...",
  successDuration = 1500,
  successMessage,
  errorMessage = "Action failed",
  size = "default",
  variant = "default",
  children,
  ...props
}: AsyncButtonProps) {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleClick = async () => {
    if (status !== "idle") return;

    setStatus("loading");

    try {
      await onAsyncClick();
      setStatus("success");
      if (successMessage) {
        toast.success(successMessage);
      }
      setTimeout(() => setStatus("idle"), successDuration);
    } catch {
      setStatus("error");
      toast.error(errorMessage);
      setTimeout(() => setStatus("idle"), successDuration);
    }
  };

  const iconSize = getButtonIconSize(size);

  return (
    <Button
      onClick={handleClick}
      disabled={status !== "idle"}
      size={size}
      variant={variant}
      leftIcon={
        status === "loading" ? (
          <LoadingSpinner size={size} />
        ) : status === "success" ? (
          <IconSparkles className={iconSize} />
        ) : undefined
      }
      aria-live="polite"
      aria-busy={status === "loading"}
      {...props}
    >
      {status === "loading" && <span className="sr-only">{loadingText}</span>}
      {status === "loading" && loadingText}
      {status === "success" && children}
      {status === "idle" && children}
    </Button>
  );
}

interface QuickActionButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

function QuickActionButton({
  icon,
  label,
  description,
  className,
  size = "default",
  variant = "secondary",
  ...props
}: QuickActionButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.075,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
    props.onClick?.(e);
  };

  const iconSize = (() => {
    const safeSize = size || "default";
    switch (safeSize) {
      case "xs":
      case "sm":
        return "h-4 w-4";
      case "lg":
      case "icon-lg":
        return "h-6 w-6";
      default:
        return "h-5 w-5";
    }
  })();

  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      className={cn("flex-col items-center gap-1 h-auto py-3 px-4", className)}
      size={size}
      variant={variant}
      {...props}
    >
      <span className={iconSize}>{icon}</span>
      <span className="text-xs font-medium">{label}</span>
      {description && (
        <span className="text-[10px] opacity-70">{description}</span>
      )}
    </Button>
  );
}

interface KiraButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  tooltip?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  expandable?: boolean;
  expandLabel?: string;
  onAsyncClick?: () => Promise<void>;
  asyncLoadingText?: string;
  asyncSuccessMessage?: string;
  asyncErrorMessage?: string;
  asyncSuccessDuration?: number;
  copyText?: string;
  copySuccessMessage?: string;
  copyConfirmDuration?: number;
  formLabel?: string;
  formDescription?: string;
  formError?: string;
  quickAction?: boolean;
  quickActionDescription?: string;
  compound?: boolean;
  compoundDescription?: string;
  compoundIconPosition?: "left" | "right";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

function KiraButton({
  loading,
  loadingText,
  tooltip,
  tooltipSide = "top",
  expandable,
  expandLabel,
  onAsyncClick,
  asyncLoadingText = "Loading...",
  asyncSuccessMessage,
  asyncErrorMessage = "Action failed",
  asyncSuccessDuration = 1500,
  copyText,
  copySuccessMessage = "Copied!",
  copyConfirmDuration = 2000,
  formLabel,
  formDescription,
  formError,
  quickAction,
  quickActionDescription,
  compound,
  compoundDescription,
  compoundIconPosition = "left",
  icon,
  iconPosition = "left",
  leftIcon,
  rightIcon,
  children,
  className,
  size = "default",
  variant = "default",
  disabled,
  onClick,
  ...props
}: KiraButtonProps) {
  const [asyncStatus, setAsyncStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [copied, setCopied] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const generatedId = React.useId();
  const buttonId = props.id || generatedId;

  const isLoading = loading || asyncStatus === "loading";

  const handleAsyncClick = async () => {
    if (!onAsyncClick || asyncStatus !== "idle") return;

    setAsyncStatus("loading");

    try {
      await onAsyncClick();
      setAsyncStatus("success");
      if (asyncSuccessMessage) {
        toast.success(asyncSuccessMessage);
      }
      setTimeout(() => setAsyncStatus("idle"), asyncSuccessDuration);
    } catch {
      setAsyncStatus("error");
      toast.error(asyncErrorMessage);
      setTimeout(() => setAsyncStatus("idle"), asyncSuccessDuration);
    }
  };

  const handleCopy = async () => {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast.success(copySuccessMessage);
      setTimeout(() => setCopied(false), copyConfirmDuration);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (copyText) {
      handleCopy();
    } else if (onAsyncClick) {
      handleAsyncClick();
    }

    // Quick action animation
    if (quickAction && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.075,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }

    onClick?.(e);
  };

  const effectiveLeftIcon = React.useMemo(() => {
    if (isLoading) {
      return <LoadingSpinner size={size} />;
    }
    if (copied) {
      return <IconCheck className={getButtonIconSize(size)} />;
    }
    if (asyncStatus === "success") {
      return <IconSparkles className={getButtonIconSize(size)} />;
    }
    if (icon && iconPosition === "left") {
      return icon;
    }
    return leftIcon;
  }, [isLoading, copied, asyncStatus, icon, iconPosition, leftIcon, size]);

  const effectiveRightIcon = React.useMemo(() => {
    if (isLoading) {
      return undefined;
    }
    if (icon && iconPosition === "right") {
      return icon;
    }
    return rightIcon;
  }, [isLoading, icon, iconPosition, rightIcon]);

  const buttonContent = () => {
    // Quick action layout
    if (quickAction) {
      const iconSize = (() => {
        switch (size) {
          case "xs":
          case "sm":
            return "h-4 w-4";
          case "lg":
          case "icon-lg":
            return "h-6 w-6";
          default:
            return "h-5 w-5";
        }
      })();

      return (
        <>
          <span className={iconSize}>{effectiveLeftIcon}</span>
          <span className="text-xs font-medium">{children}</span>
          {quickActionDescription && (
            <span className="text-[10px] opacity-70">
              {quickActionDescription}
            </span>
          )}
        </>
      );
    }

    // Compound layout
    if (compound) {
      const containerClass = (() => {
        switch (size) {
          case "xs":
            return "py-1 px-2";
          case "sm":
            return "py-1.5 px-2.5";
          case "lg":
            return "py-2.5 px-4";
          default:
            return "py-2 px-3";
        }
      })();

      const iconSize = getButtonIconSize(size);

      return (
        <div className={cn("flex flex-col items-start gap-1", containerClass)}>
          <div className="flex items-center gap-2 w-full">
            {compoundIconPosition === "left" && (
              <span className="shrink-0">{effectiveLeftIcon}</span>
            )}
            <span className="font-medium">{children}</span>
            {compoundIconPosition === "right" && (
              <span className={cn("shrink-0 ml-auto", iconSize)}>
                {effectiveLeftIcon}
              </span>
            )}
          </div>
          {compoundDescription && (
            <span className="text-xs opacity-70 w-full">
              {compoundDescription}
            </span>
          )}
        </div>
      );
    }

    // Loading state with text
    if (isLoading) {
      const displayText =
        loadingText ||
        (asyncStatus === "loading" ? asyncLoadingText : undefined);
      if (displayText) {
        return (
          <>
            <span className="sr-only">{displayText}</span>
            {displayText}
          </>
        );
      }
    }

    // Default content
    return children;
  };

  const buildButton = () => {
    const buttonClasses = cn(
      className,
      quickAction && "flex-col items-center gap-1 h-auto py-3 px-4",
      compound && "h-auto",
    );

    if (expandable && expandLabel) {
      return (
        <ExpandableIconButton
          ref={buttonRef}
          icon={icon || leftIcon || <IconSparkles />}
          label={expandLabel}
          className={buttonClasses}
          size={size}
          variant={variant}
          disabled={disabled || isLoading || copied}
          onClick={handleClick}
          {...props}
        />
      );
    }

    return (
      <Button
        ref={buttonRef}
        id={buttonId}
        className={buttonClasses}
        size={size}
        variant={variant}
        disabled={disabled || isLoading || copied}
        leftIcon={quickAction || compound ? undefined : effectiveLeftIcon}
        rightIcon={quickAction || compound ? undefined : effectiveRightIcon}
        onClick={handleClick}
        aria-label={tooltip}
        aria-busy={isLoading}
        aria-live={onAsyncClick ? "polite" : undefined}
        aria-invalid={formError ? true : undefined}
        {...props}
      >
        {buttonContent()}
      </Button>
    );
  };

  const wrapWithTooltip = (element: React.ReactNode) => {
    if (!tooltip) return element;

    return (
      <Tooltip>
        <TooltipTrigger>{element}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  };

  const wrapWithFormLabel = (element: React.ReactNode) => {
    if (!formLabel) return element;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={buttonId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {formLabel}
        </label>
        {element}
        {formDescription && !formError && (
          <p className="text-xs text-muted-foreground">{formDescription}</p>
        )}
        {formError && <p className="text-xs text-destructive">{formError}</p>}
      </div>
    );
  };

  return wrapWithFormLabel(wrapWithTooltip(buildButton()));
}

export { buttonVariants, getButtonIconSize };
export {
  Button,
  HoldButton,
  ExpandableIconButton,
  LoadingButton,
  CopyButton,
  ButtonWithLabel,
  IconButtonWithTooltip,
  CompoundButton,
  AsyncButton,
  QuickActionButton,
  KiraButton,
};
export type {
  ButtonProps,
  ButtonSize,
  HoldButtonProps,
  ExpandableIconButtonProps,
  LoadingButtonProps,
  CopyButtonProps,
  ButtonWithLabelProps,
  IconButtonWithTooltipProps,
  CompoundButtonProps,
  AsyncButtonProps,
  QuickActionButtonProps,
  KiraButtonProps,
};
