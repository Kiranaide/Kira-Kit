"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { useOptimisticCommit } from "@/hooks/use-optimistic-commit";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { isFunctionProp, isObjectProp } from "@/lib/component-utils";

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none cursor-pointer",
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
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "destructive-outline":
          "border-destructive/50 bg-background text-destructive hover:bg-destructive/10",
        "destructive-ghost":
          "text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20",
        info: "bg-info text-info-foreground hover:bg-info/90",
        "info-outline":
          "border-info/50 bg-background text-info hover:bg-info/10",
        "info-ghost": "text-info hover:bg-info/10 dark:hover:bg-info/20",
        success: "bg-success text-success-foreground hover:bg-success/90",
        "success-outline":
          "border-success/50 bg-background text-success hover:bg-success/10",
        "success-ghost":
          "text-success hover:bg-success/10 dark:hover:bg-success/20",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        "warning-outline":
          "border-warning/50 bg-background text-warning hover:bg-warning/10",
        "warning-ghost":
          "text-warning hover:bg-warning/10 dark:hover:bg-warning/20",
      },
      size: {
        xs: "h-7 gap-1 px-2 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        // kira-kit-ignore spacing-scale: sm button optical exception: 14px icons, 6px gap, 10px icon-side padding (contract 3.1)
        sm: "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 gap-2 px-4 has-[>svg]:px-3",
        lg: "h-10 gap-2 px-5 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-5",
        xl: "h-11 gap-2 px-5 text-base has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        // kira-kit-ignore spacing-scale: sm button optical exception: 14px icons, 6px gap, 10px icon-side padding (contract 3.1)
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
        "icon-xl": "size-11 [&_svg:not([class*='size-'])]:size-5",
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
  ref?: React.Ref<HTMLButtonElement>;
  render?: ButtonPrimitive.Props["render"];
  nativeButton?: ButtonPrimitive.Props["nativeButton"];
  holdDuration?: number;
  onHoldComplete?: () => void;
  /** Keeps a disabled button focusable so keyboard users can reach and inspect it. */
  focusableWhenDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "lg"
  | "xl"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"
  | "icon-xl";

const getButtonIconSize = (size: ButtonSize | null | undefined): string => {
  const sizes = {
    xs: "h-3 w-3",
    // kira-kit-ignore spacing-scale: sm button optical exception: 14px icons, 6px gap, 10px icon-side padding (contract 3.1)
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-5 w-5",
    icon: "h-4 w-4",
    "icon-xs": "h-3 w-3",
    // kira-kit-ignore spacing-scale: sm button optical exception: 14px icons, 6px gap, 10px icon-side padding (contract 3.1)
    "icon-sm": "h-3.5 w-3.5",
    "icon-lg": "h-5 w-5",
    "icon-xl": "h-5 w-5",
  } satisfies Record<ButtonSize, string>;

  return sizes[size || "default"] || "h-4 w-4";
};

function spawnRipple(
  e: React.PointerEvent<HTMLButtonElement>,
  disabled: boolean | undefined,
  reducedMotion: boolean,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
) {
  if (disabled || reducedMotion) return;

  const host = buttonRef.current;
  const rect = host?.getBoundingClientRect();

  if (!host || !rect) return;

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const diameter = Math.max(rect.width, rect.height) * 2;

  const ripple = document.createElement("span");
  ripple.className =
    "pointer-events-none absolute rounded-full bg-current animate-button-ripple motion-reduce:hidden";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  host.appendChild(ripple);

  const cleanup = () => ripple.remove();
  ripple.addEventListener("animationend", cleanup, { once: true });
  window.setTimeout(cleanup, 700);
}

function assignButtonRef(
  node: HTMLElement | null,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
  ref: React.Ref<HTMLButtonElement> | undefined,
) {
  // SAFETY: ButtonPrimitive renders a <button>, so the node is always an HTMLButtonElement when mounted.
  const el = node as HTMLButtonElement | null;

  buttonRef.current = el;

  if (isFunctionProp(ref)) ref(el);
  else if (ref && isObjectProp(ref)) ref.current = el;
}

function useButtonHoldProgress({
  disabled,
  onHoldComplete,
  holdDuration = 1000,
}: {
  disabled: boolean | undefined;
  onHoldComplete: ButtonProps["onHoldComplete"];
  holdDuration?: number;
}) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const timerRef = React.useRef<number | null>(null);
  const [holding, setHolding] = React.useState(false);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetProgress = React.useCallback(() => {
    clearTimer();
    setHolding(false);
  }, [clearTimer]);

  React.useEffect(() => clearTimer, [clearTimer]);

  const startHold = React.useCallback(() => {
    if (disabled || !onHoldComplete) return;

    clearTimer();
    setHolding(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      onHoldComplete();
    }, holdDuration);
  }, [disabled, onHoldComplete, holdDuration, clearTimer]);

  return { buttonRef, holding, holdDuration, startHold, resetProgress };
}

function ButtonIconContent({
  leftIcon,
  rightIcon,
  children,
}: Pick<ButtonProps, "leftIcon" | "rightIcon" | "children">) {
  if (!leftIcon && !rightIcon) return children;

  return (
    <>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  );
}

function ButtonHoldOverlay({
  holding,
  holdDuration,
  reducedMotion,
}: {
  holding: boolean;
  holdDuration: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 origin-left bg-current opacity-50 motion-reduce:transition-none"
      style={{
        transform: holding ? "scaleX(1)" : "scaleX(0)",
        transition: reducedMotion
          ? "none"
          : `transform ${holding ? holdDuration : 150}ms ${holding ? "linear" : "ease-out"}`,
      }}
    />
  );
}

function useButtonInteractionHandlers({
  disabled,
  reducedMotion,
  buttonRef,
  isHoldButton,
  startHold,
  resetProgress,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
}: {
  disabled?: boolean;
  reducedMotion: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  isHoldButton: boolean;
  startHold: () => void;
  resetProgress: () => void;
  onPointerDown?: ButtonProps["onPointerDown"];
  onPointerUp?: ButtonProps["onPointerUp"];
  onPointerLeave?: ButtonProps["onPointerLeave"];
  onKeyDown?: ButtonProps["onKeyDown"];
  onKeyUp?: ButtonProps["onKeyUp"];
}) {
  return {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled) {
        spawnRipple(e, disabled, reducedMotion, buttonRef);

        if (isHoldButton) startHold();
      }

      onPointerDown?.(e);
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (isHoldButton) resetProgress();
      onPointerUp?.(e);
    },
    onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (isHoldButton) resetProgress();
      onPointerLeave?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isHoldButton && !e.repeat && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        startHold();
      }

      onKeyDown?.(e);
    },
    onKeyUp: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isHoldButton && (e.key === "Enter" || e.key === " ")) {
        resetProgress();
      }

      onKeyUp?.(e);
    },
  };
}

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth,
  holdDuration = 1000,
  onHoldComplete,
  disabled,
  leftIcon,
  rightIcon,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const reducedMotion = useReducedMotion();

  const { buttonRef, holding, startHold, resetProgress } =
    useButtonHoldProgress({
      disabled,
      onHoldComplete,
      holdDuration,
    });

  const isHoldButton = Boolean(onHoldComplete);

  const handlers = useButtonInteractionHandlers({
    disabled,
    reducedMotion,
    buttonRef,
    isHoldButton,
    startHold,
    resetProgress,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
  });

  return (
    <ButtonPrimitive
      ref={(node) => assignButtonRef(node, buttonRef, ref)}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, fullWidth, className }),
        "relative overflow-hidden",
        { "cursor-not-allowed": disabled },
      )}
      disabled={disabled}
      {...handlers}
      {...props}
    >
      {isHoldButton && (
        <ButtonHoldOverlay
          holding={holding}
          holdDuration={holdDuration}
          reducedMotion={reducedMotion}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <ButtonIconContent leftIcon={leftIcon} rightIcon={rightIcon}>
          {children}
        </ButtonIconContent>
      </span>
    </ButtonPrimitive>
  );
}

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
  variant,
  ref,
  ...props
}: ExpandableIconButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const isHoldButton = Boolean(props.onHoldComplete);

  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn(
        "group/expandable h-8 min-w-8 w-auto px-2 gap-0 [&>span]:gap-0",
        { "flex-row-reverse": expandDirection === "left" },
        className,
      )}
      aria-label={label}
      {...props}
    >
      <span
        className={cn("flex size-4 shrink-0 items-center justify-center", {
          "relative z-10": isHoldButton,
        })}
      >
        {icon}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity,margin] duration-200 ease-out motion-reduce:transition-none group-hover/expandable:grid-cols-[1fr] group-hover/expandable:opacity-100 group-focus-visible/expandable:grid-cols-[1fr] group-focus-visible/expandable:opacity-100",
          expandDirection === "right"
            ? "group-hover/expandable:ml-2 group-focus-visible/expandable:ml-2"
            : "group-hover/expandable:mr-2 group-focus-visible/expandable:mr-2",
          { "relative z-10": isHoldButton },
        )}
      >
        <span className="overflow-hidden whitespace-nowrap text-sm">
          {label}
        </span>
      </span>
    </Button>
  );
}

function LoadingSpinner({ size }: { size: ButtonSize | null | undefined }) {
  const spinnerSize = getButtonIconSize(size);

  return (
    <svg
      className={cn(
        spinnerSize,
        "shrink-0 animate-spin motion-reduce:animate-none",
      )}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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

function LoadingButtonContent({
  isLoading,
  loadingText,
  children,
}: {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}) {
  if (!isLoading) return children;

  if (loadingText || children) {
    return (
      <>
        <span className="sr-only">{loadingText || "Loading"}</span>
        {loadingText ?? children}
      </>
    );
  }

  return loadingText ?? children;
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
  const effectiveLeftIcon = isLoading ? (
    <LoadingSpinner size={size} />
  ) : (
    leftIcon
  );

  const effectiveRightIcon = isLoading ? undefined : rightIcon;

  return (
    <Button
      className={cn({ "cursor-wait": isLoading }, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      size={size}
      leftIcon={effectiveLeftIcon}
      rightIcon={effectiveRightIcon}
      {...props}
    >
      <LoadingButtonContent isLoading={isLoading} loadingText={loadingText}>
        {children}
      </LoadingButtonContent>
    </Button>
  );
}

interface KiraButtonProps extends Omit<ButtonProps, "onToggle"> {
  loading?: boolean;
  loadingText?: string;
  /** Optimistic toggle mode (like/favorite/bookmark). */
  toggle?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  /** Async toggle handler; the pressed state flips instantly and rolls back if this rejects. */
  onToggle?: (pressed: boolean) => void | Promise<void>;
  /** Optional local error handler invoked when onToggle rejects. */
  onToggleError?: (error: Error) => void;
  pressedIcon?: React.ReactNode;
  unpressedIcon?: React.ReactNode;
  toggleErrorMessage?: string;
}

function KiraButtonContent({
  isLoading,
  loadingText,
  children,
}: {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}) {
  if (isLoading && loadingText) {
    return (
      <>
        <span className="sr-only">{loadingText}</span>
        {loadingText}
      </>
    );
  }

  return children;
}

// oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
function KiraButton({
  loading,
  loadingText,
  toggle,
  pressed,
  defaultPressed = false,
  onToggle,
  onToggleError,
  pressedIcon,
  unpressedIcon,
  toggleErrorMessage = "Couldn't update",
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
  const isToggleControlled = pressed !== undefined;
  const [pressedState, setPressedState] = React.useState(defaultPressed);
  const committedPressed = isToggleControlled ? Boolean(pressed) : pressedState;

  const { optimisticValue: optimisticPressed, commit } = useOptimisticCommit({
    value: committedPressed,
    onCommit: onToggle,
    onCommitted: (next) => {
      if (!isToggleControlled) setPressedState(next);
    },
    onError: onToggleError,
    errorTitle: toggleErrorMessage,
  });

  const isLoading = Boolean(loading);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (toggle) {
      commit(!committedPressed);
    }

    onClick?.(e);
  };

  let effectiveLeftIcon = leftIcon;

  if (isLoading) {
    effectiveLeftIcon = <LoadingSpinner size={size} />;
  } else if (toggle) {
    effectiveLeftIcon = optimisticPressed ? pressedIcon : unpressedIcon;
  }

  return (
    <Button
      className={cn({ "cursor-wait": isLoading }, className)}
      size={size}
      variant={variant}
      disabled={disabled || isLoading}
      leftIcon={effectiveLeftIcon}
      rightIcon={isLoading ? undefined : rightIcon}
      onClick={handleClick}
      aria-busy={isLoading || undefined}
      aria-pressed={toggle ? optimisticPressed : undefined}
      {...props}
    >
      <KiraButtonContent isLoading={isLoading} loadingText={loadingText}>
        {children}
      </KiraButtonContent>
    </Button>
  );
}

export {
  buttonVariants,
  Button,
  ExpandableIconButton,
  LoadingButton,
  KiraButton,
};

export type {
  ButtonProps,
  ButtonSize,
  ExpandableIconButtonProps,
  LoadingButtonProps,
  KiraButtonProps,
};
