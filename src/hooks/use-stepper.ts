import * as React from "react"

// ============================================
// USE STEPPER HOOK
// ============================================
// Stepper state management with navigation,
// validation, and keyboard accessibility

interface UseStepperOptions {
  /** Total number of steps */
  totalSteps: number
  /** Initial step (0-indexed) */
  initialStep?: number
  /** Controlled step value */
  step?: number
  /** Callback when step changes */
  onStepChange?: (step: number, direction: "next" | "prev" | "goto") => void
  /** Whether steps must be completed sequentially */
  linear?: boolean
  /** Step validation functions */
  validators?: Record<number, () => boolean | Promise<boolean>>
  /** Callback before step change (can prevent navigation) */
  onBeforeStepChange?: (
    from: number,
    to: number
  ) => boolean | Promise<boolean>
}

interface UseStepperReturn {
  /** Current step (0-indexed) */
  currentStep: number
  /** Total number of steps */
  totalSteps: number
  /** Set of completed step indices */
  completedSteps: Set<number>
  /** Step with validation error */
  errorStep: number | null
  /** Whether currently validating */
  isValidating: boolean
  /** Go to next step */
  next: () => Promise<boolean>
  /** Go to previous step */
  prev: () => void
  /** Go to specific step */
  goTo: (step: number) => Promise<boolean>
  /** Reset to initial step */
  reset: () => void
  /** Mark step as completed */
  markCompleted: (step: number) => void
  /** Mark step as incomplete */
  markIncomplete: (step: number) => void
  /** Set error on step */
  setError: (step: number | null) => void
  /** Check if step is active */
  isActive: (step: number) => boolean
  /** Check if step is completed */
  isCompleted: (step: number) => boolean
  /** Check if step has error */
  hasError: (step: number) => boolean
  /** Check if step is accessible (can be navigated to) */
  isAccessible: (step: number) => boolean
  /** Check if can go next */
  canGoNext: boolean
  /** Check if can go prev */
  canGoPrev: boolean
  /** Check if on first step */
  isFirstStep: boolean
  /** Check if on last step */
  isLastStep: boolean
  /** Progress percentage (0-100) */
  progress: number
  /** Keyboard event handler for step navigation */
  getStepProps: (step: number) => {
    role: "tab"
    tabIndex: number
    "aria-selected": boolean
    "aria-disabled": boolean
    "data-state": "active" | "completed" | "error" | "pending"
    onClick: () => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }
  /** Props for step panel content */
  getPanelProps: (step: number) => {
    role: "tabpanel"
    hidden: boolean
    "aria-labelledby": string
    id: string
  }
}

export function useStepper(options: UseStepperOptions): UseStepperReturn {
  const {
    totalSteps,
    initialStep = 0,
    step: controlledStep,
    onStepChange,
    linear = false,
    validators = {},
    onBeforeStepChange,
  } = options

  const [uncontrolledStep, setUncontrolledStep] = React.useState(initialStep)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  )
  const [errorStep, setErrorStep] = React.useState<number | null>(null)
  const [isValidating, setIsValidating] = React.useState(false)

  const isControlled = controlledStep !== undefined
  const currentStep = isControlled ? controlledStep : uncontrolledStep

  const setStep = React.useCallback(
    (newStep: number, direction: "next" | "prev" | "goto") => {
      if (!isControlled) {
        setUncontrolledStep(newStep)
      }
      onStepChange?.(newStep, direction)
    },
    [isControlled, onStepChange]
  )

  const validateStep = React.useCallback(
    async (step: number): Promise<boolean> => {
      const validator = validators[step]
      if (!validator) return true

      setIsValidating(true)
      try {
        const result = await validator()
        if (!result) {
          setErrorStep(step)
        } else {
          setErrorStep(null)
        }
        return result
      } catch {
        setErrorStep(step)
        return false
      } finally {
        setIsValidating(false)
      }
    },
    [validators]
  )

  const canNavigateTo = React.useCallback(
    (targetStep: number): boolean => {
      if (targetStep < 0 || targetStep >= totalSteps) return false
      if (!linear) return true
      // In linear mode, can only go to completed steps or next uncompleted
      if (targetStep <= currentStep) return true
      if (targetStep === currentStep + 1) return true
      return completedSteps.has(targetStep - 1)
    },
    [linear, totalSteps, currentStep, completedSteps]
  )

  const next = React.useCallback(async (): Promise<boolean> => {
    if (currentStep >= totalSteps - 1) return false

    // Validate current step
    const isValid = await validateStep(currentStep)
    if (!isValid) return false

    // Check before change callback
    if (onBeforeStepChange) {
      const canProceed = await onBeforeStepChange(currentStep, currentStep + 1)
      if (!canProceed) return false
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]))
    setStep(currentStep + 1, "next")
    return true
  }, [currentStep, totalSteps, validateStep, onBeforeStepChange, setStep])

  const prev = React.useCallback(() => {
    if (currentStep <= 0) return
    setStep(currentStep - 1, "prev")
  }, [currentStep, setStep])

  const goTo = React.useCallback(
    async (targetStep: number): Promise<boolean> => {
      if (!canNavigateTo(targetStep)) return false

      // If going forward, validate current step
      if (targetStep > currentStep) {
        const isValid = await validateStep(currentStep)
        if (!isValid) return false
      }

      // Check before change callback
      if (onBeforeStepChange) {
        const canProceed = await onBeforeStepChange(currentStep, targetStep)
        if (!canProceed) return false
      }

      // Mark steps as completed if going forward
      if (targetStep > currentStep) {
        setCompletedSteps((prev) => {
          const next = new Set(prev)
          for (let i = currentStep; i < targetStep; i++) {
            next.add(i)
          }
          return next
        })
      }

      setStep(targetStep, "goto")
      return true
    },
    [canNavigateTo, currentStep, validateStep, onBeforeStepChange, setStep]
  )

  const reset = React.useCallback(() => {
    setStep(initialStep, "goto")
    setCompletedSteps(new Set())
    setErrorStep(null)
  }, [initialStep, setStep])

  const markCompleted = React.useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }, [])

  const markIncomplete = React.useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      next.delete(step)
      return next
    })
  }, [])

  const isActive = React.useCallback(
    (step: number) => step === currentStep,
    [currentStep]
  )

  const isCompleted = React.useCallback(
    (step: number) => completedSteps.has(step),
    [completedSteps]
  )

  const hasError = React.useCallback(
    (step: number) => errorStep === step,
    [errorStep]
  )

  const isAccessible = React.useCallback(
    (step: number) => canNavigateTo(step),
    [canNavigateTo]
  )

  const getStepState = React.useCallback(
    (step: number): "active" | "completed" | "error" | "pending" => {
      if (hasError(step)) return "error"
      if (isActive(step)) return "active"
      if (isCompleted(step)) return "completed"
      return "pending"
    },
    [hasError, isActive, isCompleted]
  )

  const getStepProps = React.useCallback(
    (step: number) => ({
      role: "tab" as const,
      tabIndex: isActive(step) ? 0 : -1,
      "aria-selected": isActive(step),
      "aria-disabled": !isAccessible(step),
      "data-state": getStepState(step),
      onClick: () => {
        if (isAccessible(step)) {
          goTo(step)
        }
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        let targetStep = currentStep

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault()
            targetStep = Math.min(currentStep + 1, totalSteps - 1)
            break
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault()
            targetStep = Math.max(currentStep - 1, 0)
            break
          case "Home":
            e.preventDefault()
            targetStep = 0
            break
          case "End":
            e.preventDefault()
            targetStep = totalSteps - 1
            break
          case "Enter":
          case " ":
            e.preventDefault()
            if (isAccessible(step)) {
              goTo(step)
            }
            return
          default:
            return
        }

        if (isAccessible(targetStep)) {
          goTo(targetStep)
        }
      },
    }),
    [isActive, isAccessible, getStepState, goTo, currentStep, totalSteps]
  )

  const getPanelProps = React.useCallback(
    (step: number) => ({
      role: "tabpanel" as const,
      hidden: !isActive(step),
      "aria-labelledby": `stepper-tab-${step}`,
      id: `stepper-panel-${step}`,
    }),
    [isActive]
  )

  return {
    currentStep,
    totalSteps,
    completedSteps,
    errorStep,
    isValidating,
    next,
    prev,
    goTo,
    reset,
    markCompleted,
    markIncomplete,
    setError: setErrorStep,
    isActive,
    isCompleted,
    hasError,
    isAccessible,
    canGoNext: currentStep < totalSteps - 1,
    canGoPrev: currentStep > 0,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100,
    getStepProps,
    getPanelProps,
  }
}

export type { UseStepperOptions, UseStepperReturn }
