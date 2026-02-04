"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCheck,
  IconX,
  IconLoader2,
  IconArrowRight,
  IconArrowLeft,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useAnnounce } from "@/hooks/use-announce";
import { Button } from "@/components/ui/button";

const stepperVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col",
    },
    size: {
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
  },
});

const stepperItemVariants = cva("group flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-row items-start gap-3 w-full",
    },
    clickable: {
      true: "cursor-pointer",
      false: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    clickable: false,
  },
});

const stepperIndicatorVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 font-medium transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        default: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
      },
      state: {
        pending:
          "border-muted-foreground/30 bg-background text-muted-foreground",
        active:
          "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25",
        completed: "border-primary bg-primary text-primary-foreground",
        error: "border-destructive bg-destructive text-destructive-foreground",
        loading: "border-primary bg-primary/10 text-primary",
        skipped:
          "border-muted-foreground/50 bg-muted text-muted-foreground line-through",
      },
    },
    defaultVariants: {
      size: "default",
      state: "pending",
    },
  }
);

const stepperSeparatorVariants = cva(
  "transition-all duration-300 rounded-full",
  {
    variants: {
      orientation: {
        horizontal: "h-0.5 flex-1 min-w-12",
        vertical: "ml-4 mt-2 w-0.5 min-h-10",
      },
      state: {
        pending: "bg-transparent",
        active: "bg-transparent",
        completed: "bg-transparent",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      state: "pending",
    },
  }
);

const stepperContentVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "mt-2 text-center",
      vertical: "mt-0 pt-0 pb-6 flex-1 min-w-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type StepState =
  | "pending"
  | "active"
  | "completed"
  | "error"
  | "loading"
  | "skipped";

interface StepperContextValue {
  value: number;
  onValueChange: (value: number) => void;
  orientation: "horizontal" | "vertical";
  size: "sm" | "default" | "lg";
  linear: boolean;
  editable: boolean;
  completedSteps: Set<number>;
  errorSteps: Set<number>;
  loadingSteps: Set<number>;
  skippedSteps: Set<number>;
  skippableSteps: Set<number>;
  totalSteps: number;
  visibleStepsCount: number;
  currentVisibleIndex: number;
  registerStep: (index: number, condition?: boolean) => void;
  unregisterStep: (index: number) => void;
  getStepState: (index: number) => StepState;
  canNavigateTo: (index: number) => boolean;
  skipStep: (index: number) => void;
  unskipStep: (index: number) => void;
  isStepVisible: (index: number) => boolean;
  focusStep: (index: number) => void;
  stepRefs: React.MutableRefObject<Map<number, HTMLElement>>;
  announceStep: (step: number, title?: string) => void;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper components must be used within Stepper");
  }
  return context;
}

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

interface StepperProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "onChange">,
    VariantProps<typeof stepperVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  linear?: boolean;
  editable?: boolean;
  completedSteps?: number[];
  errorSteps?: number[];
  loadingSteps?: number[];
  skippedSteps?: number[];
  skippableSteps?: number[];
  onSkip?: (step: number) => void;
  onComplete?: () => void;
  persistKey?: string;
  children: React.ReactNode;
}

const Stepper = React.forwardRef<HTMLElement, StepperProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      orientation = "horizontal",
      size = "default",
      linear = false,
      editable = true,
      completedSteps: completedStepsProp = [],
      errorSteps: errorStepsProp = [],
      loadingSteps: loadingStepsProp = [],
      skippedSteps: skippedStepsProp = [],
      skippableSteps: skippableStepsProp = [],
      onSkip,
      onComplete,
      persistKey,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const [registeredSteps, setRegisteredSteps] = React.useState<Set<number>>(
      new Set()
    );
    const [stepConditions, setStepConditions] = React.useState<
      Map<number, boolean>
    >(new Map());
    const [internalSkippedSteps, setInternalSkippedSteps] = React.useState<
      Set<number>
    >(new Set(skippedStepsProp));
    const stepperRef = React.useRef<HTMLElement>(null);
    const stepRefs = React.useRef<Map<number, HTMLElement>>(new Map());
    const reducedMotion = useReducedMotion();
    const { announce } = useAnnounce();

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const completedSteps = React.useMemo(
      () => new Set(completedStepsProp),
      [completedStepsProp]
    );
    const errorSteps = React.useMemo(
      () => new Set(errorStepsProp),
      [errorStepsProp]
    );
    const loadingSteps = React.useMemo(
      () => new Set(loadingStepsProp),
      [loadingStepsProp]
    );
    const skippableSteps = React.useMemo(
      () => new Set(skippableStepsProp),
      [skippableStepsProp]
    );
    const skippedSteps = React.useMemo(
      () => new Set([...skippedStepsProp, ...internalSkippedSteps]),
      [skippedStepsProp, internalSkippedSteps]
    );

    const visibleSteps = React.useMemo(() => {
      const visible = new Set<number>();
      registeredSteps.forEach((step) => {
        const condition = stepConditions.get(step);
        if (condition === undefined || condition === true) {
          visible.add(step);
        }
      });
      return visible;
    }, [registeredSteps, stepConditions]);

    const totalSteps = visibleSteps.size;

    const visibleStepsArray = React.useMemo(
      () => Array.from(visibleSteps).sort((a, b) => a - b),
      [visibleSteps]
    );

    const currentVisibleIndex = React.useMemo(
      () => Math.max(visibleStepsArray.indexOf(value), 0),
      [visibleStepsArray, value]
    );

    React.useEffect(() => {
      if (!persistKey) return;
      try {
        const saved = localStorage.getItem(`stepper-${persistKey}`);
        if (saved) {
          const data = JSON.parse(saved);
          if (!isControlled && typeof data.currentStep === "number") {
            setUncontrolledValue(data.currentStep);
          }
          if (Array.isArray(data.skippedSteps)) {
            setInternalSkippedSteps(new Set(data.skippedSteps));
          }
        }
      } catch {}
    }, [persistKey, isControlled]);

    React.useEffect(() => {
      if (!persistKey) return;
      try {
        localStorage.setItem(
          `stepper-${persistKey}`,
          JSON.stringify({
            currentStep: value,
            skippedSteps: Array.from(internalSkippedSteps),
            completedSteps: Array.from(completedSteps),
          })
        );
      } catch {}
    }, [persistKey, value, internalSkippedSteps, completedSteps]);

    const isStepVisible = React.useCallback(
      (index: number): boolean => visibleSteps.has(index),
      [visibleSteps]
    );

    const announceStep = React.useCallback(
      (step: number, title?: string) => {
        const visibleIndex =
          Array.from(visibleSteps)
            .sort((a, b) => a - b)
            .indexOf(step) + 1;
        const message = title
          ? `Step ${visibleIndex} of ${totalSteps}: ${title}`
          : `Step ${visibleIndex} of ${totalSteps}`;
        announce(message);
      },
      [visibleSteps, totalSteps, announce]
    );

    const handleValueChange = React.useCallback(
      (newValue: number) => {
        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);

        if (newValue >= totalSteps - 1 && completedSteps.has(newValue)) {
          onComplete?.();
        }
      },
      [isControlled, onValueChange, totalSteps, completedSteps, onComplete]
    );

    const registerStep = React.useCallback(
      (index: number, condition?: boolean) => {
        setRegisteredSteps((prev) => new Set([...prev, index]));
        if (condition !== undefined) {
          setStepConditions((prev) => new Map(prev).set(index, condition));
        }
      },
      []
    );

    const unregisterStep = React.useCallback((index: number) => {
      setRegisteredSteps((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      setStepConditions((prev) => {
        const next = new Map(prev);
        next.delete(index);
        return next;
      });
    }, []);

    const skipStep = React.useCallback(
      (index: number) => {
        if (skippableSteps.has(index)) {
          setInternalSkippedSteps((prev) => new Set([...prev, index]));
          onSkip?.(index);
        }
      },
      [skippableSteps, onSkip]
    );

    const unskipStep = React.useCallback((index: number) => {
      setInternalSkippedSteps((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, []);

    const focusStep = React.useCallback((index: number) => {
      const stepElement = stepRefs.current.get(index);
      if (stepElement) {
        stepElement.focus();
      }
    }, []);

    const getStepState = React.useCallback(
      (index: number): StepState => {
        if (loadingSteps.has(index)) return "loading";
        if (errorSteps.has(index)) return "error";
        if (skippedSteps.has(index)) return "skipped";
        if (index === value) return "active";
        if (completedSteps.has(index) || index < value) return "completed";
        return "pending";
      },
      [value, completedSteps, errorSteps, loadingSteps, skippedSteps]
    );

    const canNavigateTo = React.useCallback(
      (index: number): boolean => {
        if (!isStepVisible(index)) return false;
        if (!linear) return editable || index >= value;

        if (index < value) return editable;

        if (index === value + 1 && completedSteps.has(value)) return true;

        if (index === value) return true;
        return false;
      },
      [linear, value, completedSteps, editable, isStepVisible]
    );

    React.useEffect(() => {
      if (!stepperRef.current || reducedMotion) return;

      const activeIndicator = stepperRef.current.querySelector(
        '[data-state="active"] [data-slot="stepper-indicator"]'
      );

      if (activeIndicator) {
        gsap.fromTo(
          activeIndicator,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
      }
    }, [value, reducedMotion]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        const isHorizontal = orientation === "horizontal";
        const visibleStepsArray = Array.from(visibleSteps).sort(
          (a, b) => a - b
        );
        const currentIndex = visibleStepsArray.indexOf(value);
        let targetIndex = currentIndex;

        switch (e.key) {
          case isHorizontal ? "ArrowRight" : "ArrowDown":
            e.preventDefault();
            targetIndex = Math.min(
              currentIndex + 1,
              visibleStepsArray.length - 1
            );
            break;
          case isHorizontal ? "ArrowLeft" : "ArrowUp":
            e.preventDefault();
            targetIndex = Math.max(currentIndex - 1, 0);
            break;
          case "Home":
            e.preventDefault();
            targetIndex = 0;
            break;
          case "End":
            e.preventDefault();
            targetIndex = visibleStepsArray.length - 1;
            break;
          case "Enter":
          case " ": {
            e.preventDefault();

            const focusedElement: HTMLElement | null =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
            if (focusedElement?.hasAttribute("data-value")) {
              const stepValue = parseInt(
                focusedElement.getAttribute("data-value") || "0",
                10
              );
              if (canNavigateTo(stepValue)) {
                handleValueChange(stepValue);
                announceStep(stepValue);
              }
            }
            return;
          }
          case "Escape":
            e.preventDefault();
            (e.target as HTMLElement)?.blur();
            return;
          default:
            return;
        }

        const targetStep = visibleStepsArray[targetIndex];
        if (targetStep !== undefined) {
          focusStep(targetStep);
        }
      },
      [
        orientation,
        visibleSteps,
        value,
        canNavigateTo,
        handleValueChange,
        focusStep,
        announceStep,
      ]
    );

    const contextValue = React.useMemo(
      () => ({
        value,
        onValueChange: handleValueChange,
        orientation: orientation ?? "horizontal",
        size: size ?? "default",
        linear,
        editable,
        completedSteps,
        errorSteps,
        loadingSteps,
        skippedSteps,
        skippableSteps,
        totalSteps,
        visibleStepsCount: totalSteps,
        currentVisibleIndex,
        registerStep,
        unregisterStep,
        getStepState,
        canNavigateTo,
        skipStep,
        unskipStep,
        isStepVisible,
        focusStep,
        stepRefs,
        announceStep,
      }),
      [
        value,
        handleValueChange,
        orientation,
        size,
        linear,
        editable,
        completedSteps,
        errorSteps,
        loadingSteps,
        skippedSteps,
        skippableSteps,
        totalSteps,
        currentVisibleIndex,
        registerStep,
        unregisterStep,
        getStepState,
        canNavigateTo,
        skipStep,
        unskipStep,
        isStepVisible,
        focusStep,
        announceStep,
      ]
    );

    return (
      <StepperContext.Provider value={contextValue}>
        <nav
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            (stepperRef as React.MutableRefObject<HTMLElement | null>).current =
              node;
          }}
          role="navigation"
          aria-label="Progress steps"
          data-slot="stepper"
          data-orientation={orientation ?? "horizontal"}
          className={cn(stepperVariants({ orientation, size }), className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <ol
            role="list"
            className={cn(
              "flex",
              orientation === "vertical" ? "flex-col" : "flex-row items-center",
              orientation === "vertical" ? "" : "w-full"
            )}
          >
            {children}
          </ol>
        </nav>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = "Stepper";

interface StepperItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: number;
  optional?: boolean;
  disabled?: boolean;
  condition?: boolean;
  title?: string;
  children: React.ReactNode;
}

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  (
    {
      value: stepValue,
      optional = false,
      disabled = false,
      condition,
      title,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {
      value,
      onValueChange,
      orientation,
      totalSteps,
      registerStep,
      unregisterStep,
      getStepState,
      canNavigateTo,
      skippableSteps,
      isStepVisible,
      stepRefs,
      announceStep,
    } = useStepperContext();

    const state = getStepState(stepValue);
    const isActive = stepValue === value;
    const isClickable = !disabled && canNavigateTo(stepValue);
    const isLast = stepValue === totalSteps - 1;
    const isSkippable = skippableSteps.has(stepValue) || optional;
    const isVisible = isStepVisible(stepValue);

    React.useEffect(() => {
      registerStep(stepValue, condition);
      return () => unregisterStep(stepValue);
    }, [stepValue, condition, registerStep, unregisterStep]);

    const itemRef = React.useRef<HTMLLIElement>(null);
    React.useEffect(() => {
      if (itemRef.current) {
        stepRefs.current.set(stepValue, itemRef.current);
      }
      return () => {
        stepRefs.current.delete(stepValue);
      };
    }, [stepValue, stepRefs]);

    const handleClick = () => {
      if (isClickable && stepValue !== value) {
        onValueChange(stepValue);
        announceStep(stepValue, title);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    if (!isVisible) return null;

    return (
      <li
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (itemRef as React.MutableRefObject<HTMLLIElement | null>).current =
            node;
        }}
        role="listitem"
        id={`stepper-step-${stepValue}`}
        aria-current={isActive ? "step" : undefined}
        aria-disabled={disabled || !isClickable}
        tabIndex={isClickable ? 0 : -1}
        data-slot="stepper-item"
        data-state={state}
        data-value={stepValue}
        data-optional={isSkippable || undefined}
        data-skippable={isSkippable || undefined}
        className={cn(
          stepperItemVariants({ orientation, clickable: isClickable }),
          disabled && "opacity-50 cursor-not-allowed",
          isClickable &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <StepperItemContext.Provider
          value={{
            stepValue,
            state,
            isActive,
            optional: isSkippable,
            disabled,
            isLast,
            title,
          }}
        >
          {children}
        </StepperItemContext.Provider>
      </li>
    );
  }
);
StepperItem.displayName = "StepperItem";

interface StepperItemContextValue {
  stepValue: number;
  state: StepState;
  isActive: boolean;
  optional: boolean;
  disabled: boolean;
  isLast: boolean;
  title?: string;
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(
  null
);

function useStepperItemContext() {
  const context = React.useContext(StepperItemContext);
  if (!context) {
    throw new Error(
      "StepperIndicator/StepperContent must be used within StepperItem"
    );
  }
  return context;
}

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  completedIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const StepperIndicator = React.forwardRef<
  HTMLDivElement,
  StepperIndicatorProps
>(
  (
    {
      completedIcon = <IconCheck className="h-4 w-4" />,
      errorIcon = <IconX className="h-4 w-4" />,
      loadingIcon = <IconLoader2 className="h-4 w-4 animate-spin" />,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { size } = useStepperContext();
    const { stepValue, state } = useStepperItemContext();

    const renderContent = () => {
      if (children) return children;
      switch (state) {
        case "completed":
          return completedIcon;
        case "error":
          return errorIcon;
        case "loading":
          return loadingIcon;
        default:
          return stepValue + 1;
      }
    };

    return (
      <div
        ref={ref}
        data-slot="stepper-indicator"
        className={cn(stepperIndicatorVariants({ size, state }), className)}
        aria-hidden="true"
        {...props}
      >
        {renderContent()}
      </div>
    );
  }
);
StepperIndicator.displayName = "StepperIndicator";

interface StepperTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepperTitle = React.forwardRef<HTMLDivElement, StepperTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { state, optional } = useStepperItemContext();

    return (
      <div
        ref={ref}
        data-slot="stepper-title"
        className={cn(
          "text-sm font-medium transition-colors",
          state === "active" && "text-foreground",
          state === "completed" && "text-foreground",
          state === "pending" && "text-muted-foreground",
          state === "error" && "text-destructive",
          className
        )}
        {...props}
      >
        {children}
        {optional && (
          <span className="ml-1 text-xs text-muted-foreground">(Optional)</span>
        )}
      </div>
    );
  }
);
StepperTitle.displayName = "StepperTitle";

interface StepperDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  StepperDescriptionProps
>(({ className, children, ...props }, ref) => {
  const { state } = useStepperItemContext();

  return (
    <p
      ref={ref}
      data-slot="stepper-description"
      className={cn(
        "text-xs text-muted-foreground transition-colors",
        state === "error" && "text-destructive/80",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
StepperDescription.displayName = "StepperDescription";

type StepperSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  StepperSeparatorProps
>(({ className, ...props }, ref) => {
  const { orientation, value } = useStepperContext();
  const { stepValue, isLast } = useStepperItemContext();

  if (isLast) return null;

  const separatorState =
    stepValue < value
      ? "completed"
      : stepValue === value
        ? "active"
        : "pending";

  return (
    <div
      ref={ref}
      data-slot="stepper-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        stepperSeparatorVariants({ orientation, state: separatorState }),
        className
      )}
      {...props}
    />
  );
});
StepperSeparator.displayName = "StepperSeparator";

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useStepperContext();

    return (
      <div
        ref={ref}
        data-slot="stepper-content"
        className={cn(stepperContentVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepperContent.displayName = "StepperContent";

interface StepperPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;

  forceMount?: boolean;
  children: React.ReactNode;
}

const StepperPanel = React.forwardRef<HTMLDivElement, StepperPanelProps>(
  (
    { value: panelValue, forceMount = false, className, children, ...props },
    ref
  ) => {
    const { value } = useStepperContext();
    const panelRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const isActive = panelValue === value;

    React.useEffect(() => {
      if (!panelRef.current || reducedMotion) return;

      if (isActive) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
    }, [isActive, reducedMotion]);

    if (!isActive && !forceMount) return null;

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (panelRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }}
        role="tabpanel"
        id={`stepper-panel-${panelValue}`}
        aria-labelledby={`stepper-tab-${panelValue}`}
        hidden={!isActive}
        data-slot="stepper-panel"
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !isActive && forceMount && "hidden",
          className
        )}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepperPanel.displayName = "StepperPanel";

interface StepperActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StepperActions = React.forwardRef<HTMLDivElement, StepperActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="stepper-actions"
        className={cn("flex items-center gap-2 pt-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StepperActions.displayName = "StepperActions";

interface StepperProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  showLabels?: boolean;
  labels?: string[];
  steps?: number;
}

const StepperProgress = React.forwardRef<HTMLDivElement, StepperProgressProps>(
  ({ showLabels = false, labels = [], steps, className, ...props }, ref) => {
    const {
      value,
      totalSteps: contextTotalSteps,
      visibleStepsCount,
      currentVisibleIndex,
    } = useStepperContext();
    const reducedMotion = useReducedMotion();
    const progressRef = React.useRef<HTMLDivElement>(null);
    const previousProgress = React.useRef<number>(0);

    const effectiveTotalSteps =
      steps ??
      (labels.length > 0 ? labels.length : null) ??
      visibleStepsCount ??
      contextTotalSteps ??
      0;

    const hasRegisteredSteps = contextTotalSteps > 0;
    const effectiveCurrentIndex = hasRegisteredSteps
      ? currentVisibleIndex
      : value;

    const progress =
      effectiveTotalSteps > 1
        ? (effectiveCurrentIndex / (effectiveTotalSteps - 1)) * 100
        : effectiveCurrentIndex > 0
          ? 100
          : 0;

    const clampedProgress = Math.max(0, Math.min(100, progress));

    React.useEffect(() => {
      previousProgress.current = clampedProgress;
    }, []);

    React.useEffect(() => {
      if (!progressRef.current) return;

      if (previousProgress.current === clampedProgress) return;

      if (reducedMotion) {
        gsap.set(progressRef.current, { width: `${clampedProgress}%` });
        previousProgress.current = clampedProgress;
        return;
      }

      gsap.to(progressRef.current, {
        width: `${clampedProgress}%`,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          previousProgress.current = clampedProgress;
        },
      });
    }, [clampedProgress, reducedMotion]);

    return (
      <div
        ref={ref}
        data-slot="stepper-progress"
        className={cn("w-full", className)}
        {...props}
      >
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full bg-primary"
            style={{ width: `${clampedProgress}%` }}
            role="progressbar"
            aria-valuenow={effectiveCurrentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={effectiveTotalSteps}
            aria-label={`Step ${effectiveCurrentIndex + 1} of ${effectiveTotalSteps}`}
          />
        </div>
        {showLabels && labels.length > 0 && (
          <div className="mt-2 flex justify-between">
            {labels.map((label: string, index: number) => (
              <span
                key={index}
                className={cn(
                  "text-xs transition-colors duration-200",
                  index <= effectiveCurrentIndex
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);
StepperProgress.displayName = "StepperProgress";

interface StepperNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  showBack?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
  backLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  finishLabel?: string;
  onBack?: () => void;
  onNext?: () => Promise<boolean> | boolean;
  onSkip?: () => void;
  onFinish?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  loading?: boolean;
}

const StepperNavigation = React.forwardRef<
  HTMLDivElement,
  StepperNavigationProps
>(
  (
    {
      showBack = true,
      showNext = true,
      showSkip = true,
      backLabel = "Back",
      nextLabel = "Next",
      skipLabel = "Skip",
      finishLabel = "Finish",
      onBack,
      onNext,
      onSkip,
      onFinish,
      nextDisabled = false,
      backDisabled = false,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const {
      value,
      onValueChange,
      totalSteps,
      skippableSteps,
      skipStep,
      announceStep,
    } = useStepperContext();

    const isFirstStep = value === 0;
    const isLastStep = value === totalSteps - 1;
    const isSkippable = skippableSteps.has(value);

    const handleBack = () => {
      if (onBack) {
        onBack();
      } else if (value > 0) {
        onValueChange(value - 1);
        announceStep(value - 1);
      }
    };

    const handleNext = async () => {
      if (isLastStep) {
        onFinish?.();
        return;
      }

      if (onNext) {
        const canProceed = await onNext();
        if (!canProceed) return;
      }

      if (value < totalSteps - 1) {
        onValueChange(value + 1);
        announceStep(value + 1);
      }
    };

    const handleSkip = () => {
      if (onSkip) {
        onSkip();
      } else {
        skipStep(value);
        if (value < totalSteps - 1) {
          onValueChange(value + 1);
          announceStep(value + 1);
        }
      }
    };

    return (
      <div
        ref={ref}
        data-slot="stepper-navigation"
        className={cn(
          "flex items-center justify-between gap-2 pt-4",
          className
        )}
        {...props}
      >
        <div>
          {showBack && !isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={backDisabled || loading}
            >
              <IconArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showSkip && isSkippable && !isLastStep && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
            >
              {skipLabel}
              <IconPlayerSkipForward className="ml-2 h-4 w-4" />
            </Button>
          )}

          {showNext && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={nextDisabled || loading}
            >
              {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLastStep ? finishLabel : nextLabel}
              {!isLastStep && !loading && (
                <IconArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
StepperNavigation.displayName = "StepperNavigation";

export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperPanel,
  StepperActions,
  StepperProgress,
  StepperNavigation,
  stepperVariants,
  stepperItemVariants,
  stepperIndicatorVariants,
  stepperSeparatorVariants,
  stepperContentVariants,
  useStepperContext,
  useStepperItemContext,
};

export type {
  StepperProps,
  StepperItemProps,
  StepperIndicatorProps,
  StepperTitleProps,
  StepperDescriptionProps,
  StepperSeparatorProps,
  StepperContentProps,
  StepperPanelProps,
  StepperActionsProps,
  StepperProgressProps,
  StepperNavigationProps,
  StepState,
};
