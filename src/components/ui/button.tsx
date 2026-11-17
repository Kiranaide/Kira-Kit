/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { isFunctionProp, isObjectProp } from "@/components/ui/prop-guards";

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
        sm: "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 gap-2 px-4 has-[>svg]:px-3",
        lg: "h-10 gap-2 px-5 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
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
  /** Keeps a disabled button focusable so keyboard users can reach and inspect it. */
  focusableWhenDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ButtonSize =
  "xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

const getButtonIconSize = (size: ButtonSize | null | undefined): string => {
  const sizes = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5",
    icon: "h-4 w-4",
    "icon-xs": "h-3 w-3",
    "icon-sm": "h-3.5 w-3.5",
    "icon-lg": "h-5 w-5",
  } satisfies Record<ButtonSize, string>;

  return sizes[size || "default"] || "h-4 w-4";
};

function Button(arg0: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const model = useButtonModel(arg0);

  return <ButtonView {...model} />;
}

interface ExpandableIconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  label: string;
  expandDirection?: "left" | "right";
  className?: string;
}

function ExpandableIconButton(
  arg0: ExpandableIconButtonProps & { ref?: React.Ref<HTMLButtonElement> },
) {
  const model = useExpandableIconButtonModel(arg0);

  return <ExpandableIconButtonView {...model} />;
}

function LoadingSpinner({ size }: { size: ButtonSize | null | undefined }) {
  const spinnerRef = React.useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => buttonUseGSAP(spinnerRef, reducedMotion), [reducedMotion]);

  const spinnerSize = getButtonIconSize(size);

  return (
    <svg
      ref={spinnerRef}
      className={cn(spinnerSize, "shrink-0")}
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
  if (!isLoading) {
    return children;
  }

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
  let effectiveLeftIcon = leftIcon;
  let effectiveRightIcon = rightIcon;

  if (isLoading) {
    effectiveLeftIcon = <LoadingSpinner size={size} />;
    effectiveRightIcon = undefined;
  }

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

interface IconButtonWithTooltipProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  tooltip: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  disabledReason?: string;
}

function IconButtonWithTooltip({
  icon,
  tooltip,
  tooltipSide = "top",
  disabledReason,
  className,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: IconButtonWithTooltipProps) {
  // While disabled, a disabledReason takes precedence and explains why.
  let tooltipContent = tooltip;

  if (disabled && disabledReason) {
    tooltipContent = disabledReason;
  }

  const button = (
    <Button
      className={className}
      aria-label={ariaLabel || tooltip}
      disabled={disabled}
      {...props}
    >
      {icon}
    </Button>
  );

  // A disabled button emits no pointer events, so wrap it in a span that
  // carries the hover target when we need the disabled-reason tooltip.
  let trigger = button;

  if (disabled && disabledReason) {
    trigger = <span className="inline-flex">{button}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent side={tooltipSide}>{tooltipContent}</TooltipContent>
    </Tooltip>
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
  pressedIcon?: React.ReactNode;
  unpressedIcon?: React.ReactNode;
  toggleErrorMessage?: string;
}

function useKiraButtonToggle({
  pressed,
  defaultPressed,
  onToggle,
  toggleErrorMessage,
}: {
  pressed: boolean | undefined;
  defaultPressed: boolean;
  onToggle: ((pressed: boolean) => void | Promise<void>) | undefined;
  toggleErrorMessage: string;
}) {
  const isToggleControlled = pressed !== undefined;
  const [pressedState, setPressedState] = React.useState(defaultPressed);
  let committedPressed = pressedState;

  if (isToggleControlled) {
    committedPressed = pressed ?? false;
  }

  const [optimisticPressed, setOptimisticPressed] = React.useOptimistic(
    committedPressed,
    (_prev: boolean, next: boolean) => next,
  );

  const handleToggle = () =>
    buttonHandleToggle(
      committedPressed,
      setOptimisticPressed,
      onToggle,
      isToggleControlled,
      setPressedState,
      toggleErrorMessage,
    );

  return { optimisticPressed, handleToggle };
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

function getKiraButtonLeftIcon({
  isLoading,
  toggle,
  optimisticPressed,
  size,
  leftIcon,
  pressedIcon,
  unpressedIcon,
}: {
  isLoading: boolean;
  toggle: boolean | undefined;
  optimisticPressed: boolean;
  size: ButtonProps["size"];
  leftIcon: React.ReactNode;
  pressedIcon: React.ReactNode;
  unpressedIcon: React.ReactNode;
}) {
  if (isLoading) {
    return <LoadingSpinner size={size} />;
  }

  if (toggle) {
    if (optimisticPressed) {
      return pressedIcon;
    }

    return unpressedIcon;
  }

  return leftIcon;
}

function KiraButton({
  loading,
  loadingText,
  toggle,
  pressed,
  defaultPressed: defaultPressedInput,
  onToggle,
  pressedIcon,
  unpressedIcon,
  toggleErrorMessage: toggleErrorMessageInput,
  leftIcon,
  rightIcon,
  children,
  className,
  size: sizeInput,
  variant: variantInput,
  disabled,
  onClick,
  ...props
}: KiraButtonProps) {
  const { defaultPressed, toggleErrorMessage, size, variant } =
    useKiraButtonOptions({
      defaultPressed: defaultPressedInput,
      toggleErrorMessage: toggleErrorMessageInput,
      size: sizeInput,
      variant: variantInput,
    });

  const { optimisticPressed, handleToggle } = useKiraButtonToggle({
    pressed,
    defaultPressed,
    onToggle,
    toggleErrorMessage,
  });

  const isLoading = !!loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (toggle) {
      React.startTransition(handleToggle);
    }

    onClick?.(e);
  };

  const effectiveLeftIcon = getKiraButtonLeftIcon({
    isLoading,
    toggle,
    optimisticPressed,
    size,
    leftIcon,
    pressedIcon,
    unpressedIcon,
  });

  let effectiveRightIcon = rightIcon;

  if (isLoading) {
    effectiveRightIcon = undefined;
  }

  let ariaPressed: boolean | undefined;

  if (toggle) {
    ariaPressed = optimisticPressed;
  }

  return (
    <Button
      className={cn({ "cursor-wait": isLoading }, className)}
      size={size}
      variant={variant}
      disabled={disabled || isLoading}
      leftIcon={effectiveLeftIcon}
      rightIcon={effectiveRightIcon}
      onClick={handleClick}
      aria-busy={isLoading || undefined}
      aria-pressed={ariaPressed}
      {...props}
    >
      <KiraButtonContent isLoading={isLoading} loadingText={loadingText}>
        {children}
      </KiraButtonContent>
    </Button>
  );
}

export { buttonVariants };

export {
  Button,
  ExpandableIconButton,
  LoadingButton,
  IconButtonWithTooltip,
  KiraButton,
};

export type {
  ButtonProps,
  ButtonSize,
  ExpandableIconButtonProps,
  LoadingButtonProps,
  IconButtonWithTooltipProps,
  KiraButtonProps,
};

function resolveKiraButtonOptions({
  defaultPressed = false,
  toggleErrorMessage = "Couldn't update",
  size = "default",
  variant = "default",
}: {
  defaultPressed?: KiraButtonProps["defaultPressed"];
  toggleErrorMessage?: KiraButtonProps["toggleErrorMessage"];
  size?: KiraButtonProps["size"];
  variant?: KiraButtonProps["variant"];
}) {
  return { defaultPressed, toggleErrorMessage, size, variant };
}

function useButtonModel({
  className,
  variant = "default",
  size = "default",
  holdDuration,
  onHoldComplete,
  disabled,
  leftIcon,
  rightIcon,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const hold = useButtonHoldProgress({
    disabled,
    onHoldComplete,
    holdDuration,
  });

  const {
    handlePressAnimation,
    handleRipple,
    startHold,
    resetProgress,
    isHolding,
    isKeyboardHolding,
    buttonRef,
    progressRef,
  } = hold;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) =>
    buttonHandlePointerDown(
      e,
      disabled,
      onPointerDown,
      handlePressAnimation,
      handleRipple,
      onHoldComplete,
      startHold,
    );

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) =>
    buttonReleaseHold(e, onHoldComplete, resetProgress, onPointerUp);

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (onHoldComplete && (isHolding || isKeyboardHolding)) {
      resetProgress();
    }

    onPointerLeave?.(e);
  };

  const { handleKeyDown, handleKeyUp } = buttonKeyboardHandlers(
    onHoldComplete,
    hold,
    props.onKeyDown,
    props.onKeyUp,
  );

  const isHoldButton = !!onHoldComplete;

  const renderContent = () => (
    <ButtonIconContent leftIcon={leftIcon} rightIcon={rightIcon}>
      {children}
    </ButtonIconContent>
  );

  return {
    buttonRef,
    ref,
    variant,
    size,
    className,
    disabled,
    handlePointerDown,
    handlePointerUp,
    handlePointerLeave,
    handleKeyDown,
    handleKeyUp,
    props,
    isHoldButton,
    progressRef,
    renderContent,
  };
}

function buttonKeyboardHandlers(
  onHoldComplete: ButtonProps["onHoldComplete"],
  hold: ReturnType<typeof useButtonHoldProgress>,
  onKeyDown: ButtonProps["onKeyDown"],
  onKeyUp: ButtonProps["onKeyUp"],
) {
  return {
    handleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) =>
      buttonKeyboardStart(event, onHoldComplete, hold, onKeyDown),
    handleKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) =>
      buttonKeyboardRelease(
        event,
        onHoldComplete,
        hold.setIsKeyboardHolding,
        hold.resetProgress,
        onKeyUp,
      ),
  };
}

function ButtonView({
  buttonRef,
  ref,
  variant,
  size,
  className,
  disabled,
  handlePointerDown,
  handlePointerUp,
  handlePointerLeave,
  handleKeyDown,
  handleKeyUp,
  props,
  isHoldButton,
  progressRef,
  renderContent,
}: ReturnType<typeof useButtonModel>) {
  return (
    <ButtonPrimitive
      ref={(node) => buttonCallback(node, buttonRef, ref)}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        "relative overflow-hidden",
        { "cursor-not-allowed": disabled },
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
            className="absolute left-0 top-0 h-full pointer-events-none bg-current opacity-50"
            style={{ width: 0 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            {renderContent()}
          </span>
        </>
      )}
      {!isHoldButton && (
        <span className="relative z-10 flex items-center gap-2">
          {renderContent()}
        </span>
      )}
    </ButtonPrimitive>
  );
}

function useExpandableIconButtonModel({
  icon,
  label,
  expandDirection = "right",
  className,
  onMouseEnter,
  onMouseLeave,
  variant,
  ref,
  ...props
}: ExpandableIconButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) =>
    buttonHandleMouseEnter(
      e,
      textRef,
      expandDirection,
      reducedMotion,
      onMouseEnter,
    );

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) =>
    buttonHandleMouseLeave(e, textRef, reducedMotion, onMouseLeave);

  const isHoldButton = !!props.onHoldComplete;

  return {
    ref,
    variant,
    expandDirection,
    isHoldButton,
    className,
    handleMouseEnter,
    handleMouseLeave,
    label,
    props,
    icon,
    textRef,
  };
}

function ExpandableIconButtonView({
  ref,
  variant,
  expandDirection,
  isHoldButton,
  className,
  handleMouseEnter,
  handleMouseLeave,
  label,
  props,
  icon,
  textRef,
}: ReturnType<typeof useExpandableIconButtonModel>) {
  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn(
        "h-8 min-w-8 w-auto px-2 gap-0 [&>span]:gap-0",
        { "flex-row-reverse": expandDirection === "left" },
        { "[&>span.relative.z-10.flex.items-center]:gap-0": isHoldButton },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={label}
      {...props}
    >
      <span
        className={cn("shrink-0 flex items-center justify-center size-4", {
          "relative z-10": isHoldButton,
        })}
      >
        {icon}
      </span>
      <span
        ref={textRef}
        className={cn("overflow-hidden whitespace-nowrap text-sm", {
          "relative z-10": isHoldButton,
        })}
        style={{ width: 0, opacity: 0 }}
        aria-hidden="true"
      >
        {label}
      </span>
    </Button>
  );
}

function useKiraButtonOptions({
  defaultPressed: defaultPressedInput,
  toggleErrorMessage: toggleErrorMessageInput,
  size: sizeInput,
  variant: variantInput,
}: Parameters<typeof resolveKiraButtonOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraButtonOptions({
        defaultPressed: defaultPressedInput,
        toggleErrorMessage: toggleErrorMessageInput,
        size: sizeInput,
        variant: variantInput,
      }),
    [defaultPressedInput, toggleErrorMessageInput, sizeInput, variantInput],
  );
}

function buttonUseGSAP(
  spinnerRef: React.RefObject<SVGSVGElement | null>,
  reducedMotion: boolean,
) {
  if (spinnerRef.current && !reducedMotion) {
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
    });
  }
}

async function buttonHandleToggle(
  committedPressed: boolean,
  setOptimisticPressed: (action: boolean) => void,
  onToggle: ((pressed: boolean) => void | Promise<void>) | undefined,
  isToggleControlled: boolean,
  setPressedState: React.Dispatch<React.SetStateAction<boolean>>,
  toggleErrorMessage: string,
) {
  const next = !committedPressed;
  setOptimisticPressed(next);

  try {
    await onToggle?.(next);

    if (!isToggleControlled) setPressedState(next);
  } catch {
    toast.error(toggleErrorMessage);
  }
}

function buttonHandlePressAnimation(
  disabled: boolean | undefined,
  reducedMotion: boolean,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
) {
  if (disabled || reducedMotion || !buttonRef.current) return;

  gsap.to(buttonRef.current, {
    scale: 0.96,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
    overwrite: "auto",
  });
}

function buttonHandleRipple(
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
  ripple.className = "pointer-events-none absolute rounded-full bg-current";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.transform = "translate(-50%, -50%)";
  host.appendChild(ripple);

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 0.3 },
    {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    },
  );
}

function buttonResetProgress(
  setIsHolding: React.Dispatch<React.SetStateAction<boolean>>,
  setIsKeyboardHolding: React.Dispatch<React.SetStateAction<boolean>>,
  holdTweenRef: React.RefObject<gsap.core.Tween | null>,
  progressRef: React.RefObject<HTMLDivElement | null>,
) {
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
}

function buttonHandlePointerDown(
  e: React.PointerEvent<HTMLButtonElement>,
  disabled: boolean | undefined,
  onPointerDown: React.PointerEventHandler<HTMLButtonElement> | undefined,
  handlePressAnimation: () => void,
  handleRipple: (e: React.PointerEvent<HTMLButtonElement>) => void,
  onHoldComplete: (() => void) | undefined,
  startHold: () => void,
) {
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
}

function buttonCallback(
  node: HTMLElement | null,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
  ref: React.Ref<HTMLButtonElement> | undefined,
) {
  // SAFETY: ButtonPrimitive renders a <button>, so the node is always
  // an HTMLButtonElement when mounted.
  const el = node as HTMLButtonElement | null;

  buttonRef.current = el;

  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React refs support callback and mutable-object forms, requiring runtime dispatch.
  if (isFunctionProp(ref)) ref(el);
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React refs support callback and mutable-object forms, requiring runtime dispatch.
  else if (ref && isObjectProp(ref)) ref.current = el;
}

function buttonHandleMouseEnter(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  textRef: React.RefObject<HTMLSpanElement | null>,
  expandDirection: "left" | "right",
  reducedMotion: boolean,
  onMouseEnter: React.MouseEventHandler<HTMLButtonElement> | undefined,
) {
  if (textRef.current) {
    const textWidth = textRef.current.scrollWidth;

    let marginLeft = 0;

    if (expandDirection === "right") {
      marginLeft = 8;
    }

    let marginRight = 0;

    if (expandDirection === "left") {
      marginRight = 8;
    }

    let duration = 0.2;

    if (reducedMotion) {
      duration = 0;
    }

    gsap.to(textRef.current, {
      width: textWidth,
      opacity: 1,
      marginLeft,
      marginRight,
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  onMouseEnter?.(e);
}

function buttonHandleMouseLeave(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  textRef: React.RefObject<HTMLSpanElement | null>,
  reducedMotion: boolean,
  onMouseLeave: React.MouseEventHandler<HTMLButtonElement> | undefined,
) {
  if (textRef.current) {
    let duration = 0.15;

    if (reducedMotion) {
      duration = 0;
    }

    gsap.to(textRef.current, {
      width: 0,
      opacity: 0,
      marginLeft: 0,
      marginRight: 0,
      duration,
      ease: "power2.in",
      overwrite: "auto",
    });
  }

  onMouseLeave?.(e);
}

function useButtonHoldProgress({
  disabled,
  onHoldComplete,
  holdDuration,
}: {
  disabled: boolean | undefined;
  onHoldComplete: ButtonProps["onHoldComplete"];
  holdDuration: number | undefined;
}) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isHolding, setIsHolding] = React.useState(false);
  const [isKeyboardHolding, setIsKeyboardHolding] = React.useState(false);
  const holdTweenRef = React.useRef<gsap.core.Tween | null>(null);
  const reducedMotion = useReducedMotion();

  const handlePressAnimation = () =>
    buttonHandlePressAnimation(disabled, reducedMotion, buttonRef);

  const handleRipple = (e: React.PointerEvent<HTMLButtonElement>) =>
    buttonHandleRipple(e, disabled, reducedMotion, buttonRef);

  const resetProgress = () =>
    buttonResetProgress(
      setIsHolding,
      setIsKeyboardHolding,
      holdTweenRef,
      progressRef,
    );

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

  return {
    handlePressAnimation,
    handleRipple,
    startHold,
    resetProgress,
    isHolding,
    isKeyboardHolding,
    setIsKeyboardHolding,
    buttonRef,
    progressRef,
  } satisfies {
    handlePressAnimation: typeof handlePressAnimation;
    handleRipple: typeof handleRipple;
    startHold: typeof startHold;
    resetProgress: typeof resetProgress;
    isHolding: typeof isHolding;
    isKeyboardHolding: typeof isKeyboardHolding;
    setIsKeyboardHolding: typeof setIsKeyboardHolding;
    buttonRef: typeof buttonRef;
    progressRef: typeof progressRef;
  };
}

function ButtonIconContent({
  leftIcon,
  rightIcon,
  children,
}: Pick<ButtonProps, "leftIcon" | "rightIcon" | "children">) {
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
}

function buttonReleaseHold(
  e: React.PointerEvent<HTMLButtonElement>,
  onHoldComplete: ButtonProps["onHoldComplete"],
  resetProgress: () => void,
  onPointerUp: ButtonProps["onPointerUp"],
) {
  if (onHoldComplete) resetProgress();
  onPointerUp?.(e);
}

function buttonKeyboardRelease(
  e: React.KeyboardEvent<HTMLButtonElement>,
  onHoldComplete: ButtonProps["onHoldComplete"],
  setIsKeyboardHolding: React.Dispatch<React.SetStateAction<boolean>>,
  resetProgress: () => void,
  onKeyUp: ButtonProps["onKeyUp"],
) {
  if (onHoldComplete && (e.key === "Enter" || e.key === " ")) {
    setIsKeyboardHolding(false);
    resetProgress();
  }

  onKeyUp?.(e);
}

function buttonKeyboardStart(
  e: React.KeyboardEvent<HTMLButtonElement>,
  onHoldComplete: ButtonProps["onHoldComplete"],
  { setIsKeyboardHolding, startHold }: ReturnType<typeof useButtonHoldProgress>,
  onKeyDown: ButtonProps["onKeyDown"],
) {
  if (onHoldComplete && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    setIsKeyboardHolding(true);
    startHold();
  }

  onKeyDown?.(e);
}
