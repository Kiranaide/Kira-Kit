"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import { useAnnounce } from "@/hooks/use-announce"

// ============================================================================
// STEPPER VARIANTS (CVA)
// ============================================================================

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
})

const stepperItemVariants = cva("group flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col",
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
})

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
        pending: "border-muted-foreground/30 bg-background text-muted-foreground",
        active: "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25",
        completed: "border-primary bg-primary text-primary-foreground",
        error: "border-destructive bg-destructive text-destructive-foreground",
        loading: "border-primary bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      size: "default",
      state: "pending",
    },
  }
)

const stepperSeparatorVariants = cva("transition-all duration-300", {
  variants: {
    orientation: {
      horizontal: "h-0.5 flex-1 min-w-8",
      vertical: "ml-4 mt-2 w-0.5 min-h-8",
    },
    state: {
      pending: "bg-muted-foreground/20",
      active: "bg-primary/50",
      completed: "bg-primary",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    state: "pending",
  },
})

const stepperContentVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "mt-2 text-center",
      vertical: "ml-4 mt-0 pb-8 pt-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

// ============================================================================
// TYPES
// ============================================================================

type StepState = "pending" | "active" | "completed" | "error" | "loading"

interface StepperContextValue {
  value: number
  onValueChange: (value: number) => void
  orientation: "horizontal" | "vertical"
  size: "sm" | "default" | "lg"
  linear: boolean
  completedSteps: Set<number>
  errorSteps: Set<number>
  loadingSteps: Set<number>
  totalSteps: number
  registerStep: (index: number) => void
  unregisterStep: (index: number) => void
  getStepState: (index: number) => StepState
  canNavigateTo: (index: number) => boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepperContext() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("Stepper components must be used within Stepper")
  }
  return context
}

// ============================================================================
// REDUCED MOTION HOOK
// ============================================================================

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

// ============================================================================
// STEPPER ROOT
// ============================================================================

interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof stepperVariants> {
  /** Current step (0-indexed) */
  value?: number
  /** Default step for uncontrolled mode */
  defaultValue?: number
  /** Callback when step changes */
  onValueChange?: (value: number) => void
  /** Whether steps must be completed sequentially */
  linear?: boolean
  /** Completed step indices */
  completedSteps?: number[]
  /** Error step indices */
  errorSteps?: number[]
  /** Loading step indices */
  loadingSteps?: number[]
  children: React.ReactNode
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      orientation = "horizontal",
      size = "default",
      linear = false,
      completedSteps: completedStepsProp = [],
      errorSteps: errorStepsProp = [],
      loadingSteps: loadingStepsProp = [],
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const [registeredSteps, setRegisteredSteps] = React.useState<Set<number>>(new Set())
    const stepperRef = React.useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()
    const { announce } = useAnnounce()

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : uncontrolledValue

    const completedSteps = React.useMemo(
      () => new Set(completedStepsProp),
      [completedStepsProp]
    )
    const errorSteps = React.useMemo(
      () => new Set(errorStepsProp),
      [errorStepsProp]
    )
    const loadingSteps = React.useMemo(
      () => new Set(loadingStepsProp),
      [loadingStepsProp]
    )

    const totalSteps = registeredSteps.size

    const handleValueChange = React.useCallback(
      (newValue: number) => {
        if (!isControlled) {
          setUncontrolledValue(newValue)
        }
        onValueChange?.(newValue)
        announce(`Step ${newValue + 1} of ${totalSteps}`)
      },
      [isControlled, onValueChange, announce, totalSteps]
    )

    const registerStep = React.useCallback((index: number) => {
      setRegisteredSteps((prev) => new Set([...prev, index]))
    }, [])

    const unregisterStep = React.useCallback((index: number) => {
      setRegisteredSteps((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, [])

    const getStepState = React.useCallback(
      (index: number): StepState => {
        if (loadingSteps.has(index)) return "loading"
        if (errorSteps.has(index)) return "error"
        if (index === value) return "active"
        if (completedSteps.has(index) || index < value) return "completed"
        return "pending"
      },
      [value, completedSteps, errorSteps, loadingSteps]
    )

    const canNavigateTo = React.useCallback(
      (index: number): boolean => {
        if (!linear) return true
        // Can go back to any completed step
        if (index < value) return true
        // Can only go to next step if current is completed
        if (index === value + 1 && completedSteps.has(value)) return true
        // Can stay on current step
        if (index === value) return true
        return false
      },
      [linear, value, completedSteps]
    )

    // GSAP animation for step transitions
    React.useEffect(() => {
      if (!stepperRef.current || reducedMotion) return

      const activeIndicator = stepperRef.current.querySelector(
        '[data-state="active"] [data-slot="stepper-indicator"]'
      )

      if (activeIndicator) {
        gsap.fromTo(
          activeIndicator,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        )
      }
    }, [value, reducedMotion])

    // Keyboard navigation handler
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        const isHorizontal = orientation === "horizontal"
        let targetValue = value

        switch (e.key) {
          case isHorizontal ? "ArrowRight" : "ArrowDown":
            e.preventDefault()
            targetValue = Math.min(value + 1, totalSteps - 1)
            break
          case isHorizontal ? "ArrowLeft" : "ArrowUp":
            e.preventDefault()
            targetValue = Math.max(value - 1, 0)
            break
          case "Home":
            e.preventDefault()
            targetValue = 0
            break
          case "End":
            e.preventDefault()
            targetValue = totalSteps - 1
            break
          default:
            return
        }

        if (canNavigateTo(targetValue)) {
          handleValueChange(targetValue)
        }
      },
      [orientation, value, totalSteps, canNavigateTo, handleValueChange]
    )

    const contextValue = React.useMemo(
      () => ({
        value,
        onValueChange: handleValueChange,
        orientation: orientation ?? "horizontal",
        size: size ?? "default",
        linear,
        completedSteps,
        errorSteps,
        loadingSteps,
        totalSteps,
        registerStep,
        unregisterStep,
        getStepState,
        canNavigateTo,
      }),
      [
        value,
        handleValueChange,
        orientation,
        size,
        linear,
        completedSteps,
        errorSteps,
        loadingSteps,
        totalSteps,
        registerStep,
        unregisterStep,
        getStepState,
        canNavigateTo,
      ]
    )

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
            ;(stepperRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          role="tablist"
          aria-orientation={orientation ?? "horizontal"}
          aria-label="Progress steps"
          data-slot="stepper"
          className={cn(stepperVariants({ orientation, size }), className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

// ============================================================================
// STEPPER ITEM
// ============================================================================

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Step index (0-indexed) */
  value: number
  /** Whether this step is optional */
  optional?: boolean
  /** Disable navigation to this step */
  disabled?: boolean
  children: React.ReactNode
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ value: stepValue, optional = false, disabled = false, className, children, ...props }, ref) => {
    const {
      value,
      onValueChange,
      orientation,
      totalSteps,
      registerStep,
      unregisterStep,
      getStepState,
      canNavigateTo,
    } = useStepperContext()

    const state = getStepState(stepValue)
    const isActive = stepValue === value
    const isClickable = !disabled && canNavigateTo(stepValue)
    const isLast = stepValue === totalSteps - 1

    // Register step on mount
    React.useEffect(() => {
      registerStep(stepValue)
      return () => unregisterStep(stepValue)
    }, [stepValue, registerStep, unregisterStep])

    const handleClick = () => {
      if (isClickable && stepValue !== value) {
        onValueChange(stepValue)
      }
    }

    return (
      <div
        ref={ref}
        role="tab"
        id={`stepper-tab-${stepValue}`}
        aria-selected={isActive}
        aria-disabled={disabled || !isClickable}
        aria-controls={`stepper-panel-${stepValue}`}
        tabIndex={isActive ? 0 : -1}
        data-slot="stepper-item"
        data-state={state}
        data-value={stepValue}
        data-optional={optional || undefined}
        className={cn(
          stepperItemVariants({ orientation, clickable: isClickable }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <StepperItemContext.Provider value={{ stepValue, state, isActive, optional, disabled, isLast }}>
          {children}
        </StepperItemContext.Provider>
      </div>
    )
  }
)
StepperItem.displayName = "StepperItem"

// Step Item Context
interface StepperItemContextValue {
  stepValue: number
  state: StepState
  isActive: boolean
  optional: boolean
  disabled: boolean
  isLast: boolean
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(null)

function useStepperItemContext() {
  const context = React.useContext(StepperItemContext)
  if (!context) {
    throw new Error("StepperIndicator/StepperContent must be used within StepperItem")
  }
  return context
}

// ============================================================================
// STEPPER INDICATOR
// ============================================================================

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom icon for completed state */
  completedIcon?: React.ReactNode
  /** Custom icon for error state */
  errorIcon?: React.ReactNode
  /** Custom icon for loading state */
  loadingIcon?: React.ReactNode
  /** Custom content (overrides default number) */
  children?: React.ReactNode
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
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
    const { size } = useStepperContext()
    const { stepValue, state } = useStepperItemContext()

    const renderContent = () => {
      if (children) return children
      switch (state) {
        case "completed":
          return completedIcon
        case "error":
          return errorIcon
        case "loading":
          return loadingIcon
        default:
          return stepValue + 1
      }
    }

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
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

// ============================================================================
// STEPPER TITLE
// ============================================================================

interface StepperTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const StepperTitle = React.forwardRef<HTMLDivElement, StepperTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { state, optional } = useStepperItemContext()

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
    )
  }
)
StepperTitle.displayName = "StepperTitle"

// ============================================================================
// STEPPER DESCRIPTION
// ============================================================================

interface StepperDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const StepperDescription = React.forwardRef<HTMLParagraphElement, StepperDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const { state } = useStepperItemContext()

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
    )
  }
)
StepperDescription.displayName = "StepperDescription"

// ============================================================================
// STEPPER SEPARATOR
// ============================================================================

interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { orientation, value } = useStepperContext()
    const { stepValue, isLast } = useStepperItemContext()

    if (isLast) return null

    const separatorState =
      stepValue < value ? "completed" : stepValue === value ? "active" : "pending"

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
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

// ============================================================================
// STEPPER CONTENT
// ============================================================================

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useStepperContext()

    return (
      <div
        ref={ref}
        data-slot="stepper-content"
        className={cn(stepperContentVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperContent.displayName = "StepperContent"

// ============================================================================
// STEPPER PANEL
// ============================================================================

interface StepperPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Step value this panel belongs to */
  value: number
  /** Force show even when not active (for animations) */
  forceMount?: boolean
  children: React.ReactNode
}

const StepperPanel = React.forwardRef<HTMLDivElement, StepperPanelProps>(
  ({ value: panelValue, forceMount = false, className, children, ...props }, ref) => {
    const { value } = useStepperContext()
    const panelRef = React.useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()
    const isActive = panelValue === value

    // GSAP animation for panel transitions
    React.useEffect(() => {
      if (!panelRef.current || reducedMotion) return

      if (isActive) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        )
      }
    }, [isActive, reducedMotion])

    if (!isActive && !forceMount) return null

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
          ;(panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node
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
    )
  }
)
StepperPanel.displayName = "StepperPanel"

// ============================================================================
// STEPPER ACTIONS (Navigation buttons)
// ============================================================================

interface StepperActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
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
    )
  }
)
StepperActions.displayName = "StepperActions"

// ============================================================================
// PROGRESS VARIANT
// ============================================================================

interface StepperProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show step labels below progress bar */
  showLabels?: boolean
  /** Custom labels for each step */
  labels?: string[]
}

const StepperProgress = React.forwardRef<HTMLDivElement, StepperProgressProps>(
  ({ showLabels = false, labels = [], className, ...props }, ref) => {
    const { value, totalSteps } = useStepperContext()
    const progress = totalSteps > 1 ? (value / (totalSteps - 1)) * 100 : 100
    const reducedMotion = useReducedMotion()
    const progressRef = React.useRef<HTMLDivElement>(null)

    // GSAP animation for progress bar
    React.useEffect(() => {
      if (!progressRef.current || reducedMotion) return

      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: "power2.out",
      })
    }, [progress, reducedMotion])

    return (
      <div ref={ref} data-slot="stepper-progress" className={cn("w-full", className)} {...props}>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full bg-primary transition-all"
            style={{ width: reducedMotion ? `${progress}%` : 0 }}
            role="progressbar"
            aria-valuenow={value + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${value + 1} of ${totalSteps}`}
          />
        </div>
        {showLabels && labels.length > 0 && (
          <div className="mt-2 flex justify-between">
            {labels.map((label, index) => (
              <span
                key={index}
                className={cn(
                  "text-xs transition-colors",
                  index <= value ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
)
StepperProgress.displayName = "StepperProgress"

// ============================================================================
// EXPORTS
// ============================================================================

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
  // Variants
  stepperVariants,
  stepperItemVariants,
  stepperIndicatorVariants,
  stepperSeparatorVariants,
  stepperContentVariants,
  // Context hooks
  useStepperContext,
  useStepperItemContext,
}

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
  StepState,
}
