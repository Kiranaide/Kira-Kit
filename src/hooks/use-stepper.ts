import * as React from "react"

// ============================================
// USE STEPPER HOOK
// ============================================
// Stepper state management with navigation,
// validation, skip, persistence, and keyboard accessibility

interface UseStepperOptions {
  /** Total number of steps */
  totalSteps: number
  /** Initial step (0-indexed) */
  initialStep?: number
  /** Controlled step value */
  step?: number
  /** Callback when step changes */
  onStepChange?: (step: number, direction: "next" | "prev" | "goto" | "skip") => void
  /** Whether steps must be completed sequentially */
  linear?: boolean
  /** Allow editing completed steps */
  editable?: boolean
  /** Step validation functions */
  validators?: Record<number, () => boolean | Promise<boolean>>
  /** Callback before step change (can prevent navigation) */
  onBeforeStepChange?: (
    from: number,
    to: number
  ) => boolean | Promise<boolean>
  /** Steps that can be skipped (0-indexed) */
  skippableSteps?: number[]
  /** Callback when step is skipped */
  onSkip?: (step: number) => void
  /** Callback when all steps are completed */
  onComplete?: () => void
  /** localStorage key for persisting progress */
  persistKey?: string
  /** Step conditions for branching (step index -> condition) */
  stepConditions?: Record<number, boolean>
}

interface UseStepperReturn {
  /** Current step (0-indexed) */
  currentStep: number
  /** Total number of steps */
  totalSteps: number
  /** Visible steps (after applying conditions) */
  visibleSteps: number[]
  /** Set of completed step indices */
  completedSteps: Set<number>
  /** Set of skipped step indices */
  skippedSteps: Set<number>
  /** Set of skippable step indices */
  skippableSteps: Set<number>
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
  /** Skip current step */
  skip: () => void
  /** Skip specific step */
  skipStep: (step: number) => void
  /** Unskip a step */
  unskipStep: (step: number) => void
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
  /** Check if step is skipped */
  isSkipped: (step: number) => boolean
  /** Check if step is skippable */
  isSkippable: (step: number) => boolean
  /** Check if step has error */
  hasError: (step: number) => boolean
  /** Check if step is accessible (can be navigated to) */
  isAccessible: (step: number) => boolean
  /** Check if step is visible (not hidden by condition) */
  isVisible: (step: number) => boolean
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
  /** Save progress to storage */
  saveProgress: () => void
  /** Load progress from storage */
  loadProgress: () => void
  /** Clear saved progress */
  clearProgress: () => void
  /** Keyboard event handler for step navigation */
  getStepProps: (step: number) => {
    role: "listitem"
    tabIndex: number
    "aria-current": "step" | undefined
    "aria-disabled": boolean
    "data-state": "active" | "completed" | "error" | "pending" | "skipped"
    "data-skippable": boolean
    onClick: () => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }
  /** Props for step panel content */
  getPanelProps: (step: number) => {
    role: "region"
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
    editable = true,
    validators = {},
    onBeforeStepChange,
    skippableSteps: skippableStepsProp = [],
    onSkip,
    onComplete,
    persistKey,
    stepConditions = {},
  } = options

  const [uncontrolledStep, setUncontrolledStep] = React.useState(initialStep)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  )
  const [skippedSteps, setSkippedSteps] = React.useState<Set<number>>(new Set())
  const [errorStep, setErrorStep] = React.useState<number | null>(null)
  const [isValidating, setIsValidating] = React.useState(false)

  const isControlled = controlledStep !== undefined
  const currentStep = isControlled ? controlledStep : uncontrolledStep

  const skippableSteps = React.useMemo(
    () => new Set(skippableStepsProp),
    [skippableStepsProp]
  )

  // Calculate visible steps based on conditions
  const visibleSteps = React.useMemo(() => {
    const visible: number[] = []
    for (let i = 0; i < totalSteps; i++) {
      const condition = stepConditions[i]
      if (condition === undefined || condition === true) {
        visible.push(i)
      }
    }
    return visible
  }, [totalSteps, stepConditions])

  const visibleStepsSet = React.useMemo(() => new Set(visibleSteps), [visibleSteps])
  const effectiveTotalSteps = visibleSteps.length

  // Load progress from storage on mount
  React.useEffect(() => {
    if (!persistKey) return
    try {
      const saved = localStorage.getItem(`stepper-${persistKey}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (!isControlled && typeof data.currentStep === "number") {
          setUncontrolledStep(data.currentStep)
        }
        if (Array.isArray(data.completedSteps)) {
          setCompletedSteps(new Set(data.completedSteps))
        }
        if (Array.isArray(data.skippedSteps)) {
          setSkippedSteps(new Set(data.skippedSteps))
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [persistKey, isControlled])

  const saveProgress = React.useCallback(() => {
    if (!persistKey) return
    try {
      localStorage.setItem(
        `stepper-${persistKey}`,
        JSON.stringify({
          currentStep,
          completedSteps: Array.from(completedSteps),
          skippedSteps: Array.from(skippedSteps),
        })
      )
    } catch {
      // Ignore storage errors
    }
  }, [persistKey, currentStep, completedSteps, skippedSteps])

  const loadProgress = React.useCallback(() => {
    if (!persistKey) return
    try {
      const saved = localStorage.getItem(`stepper-${persistKey}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (!isControlled && typeof data.currentStep === "number") {
          setUncontrolledStep(data.currentStep)
        }
        if (Array.isArray(data.completedSteps)) {
          setCompletedSteps(new Set(data.completedSteps))
        }
        if (Array.isArray(data.skippedSteps)) {
          setSkippedSteps(new Set(data.skippedSteps))
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, [persistKey, isControlled])

  const clearProgress = React.useCallback(() => {
    if (!persistKey) return
    try {
      localStorage.removeItem(`stepper-${persistKey}`)
    } catch {
      // Ignore storage errors
    }
  }, [persistKey])

  // Auto-save on step change
  React.useEffect(() => {
    if (persistKey) {
      saveProgress()
    }
  }, [persistKey, currentStep, completedSteps, skippedSteps, saveProgress])

  const setStep = React.useCallback(
    (newStep: number, direction: "next" | "prev" | "goto" | "skip") => {
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

  const isVisible = React.useCallback(
    (step: number): boolean => visibleStepsSet.has(step),
    [visibleStepsSet]
  )

  const canNavigateTo = React.useCallback(
    (targetStep: number): boolean => {
      if (!isVisible(targetStep)) return false
      if (targetStep < 0 || targetStep >= totalSteps) return false
      if (!linear) return editable || targetStep >= currentStep
      // In linear mode, can only go to completed steps or next uncompleted
      if (targetStep < currentStep) return editable
      if (targetStep === currentStep) return true
      if (targetStep === currentStep + 1) return true
      return completedSteps.has(targetStep - 1)
    },
    [linear, totalSteps, currentStep, completedSteps, editable, isVisible]
  )

  const getNextVisibleStep = React.useCallback(
    (from: number): number | null => {
      const currentIndex = visibleSteps.indexOf(from)
      if (currentIndex === -1 || currentIndex >= visibleSteps.length - 1) return null
      return visibleSteps[currentIndex + 1]
    },
    [visibleSteps]
  )

  const getPrevVisibleStep = React.useCallback(
    (from: number): number | null => {
      const currentIndex = visibleSteps.indexOf(from)
      if (currentIndex <= 0) return null
      return visibleSteps[currentIndex - 1]
    },
    [visibleSteps]
  )

  const next = React.useCallback(async (): Promise<boolean> => {
    const nextStep = getNextVisibleStep(currentStep)
    if (nextStep === null) return false

    // Validate current step
    const isValid = await validateStep(currentStep)
    if (!isValid) return false

    // Check before change callback
    if (onBeforeStepChange) {
      const canProceed = await onBeforeStepChange(currentStep, nextStep)
      if (!canProceed) return false
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]))
    setStep(nextStep, "next")

    // Check if wizard is complete
    if (nextStep === visibleSteps[visibleSteps.length - 1]) {
      // Will trigger onComplete when this step is also completed
    }

    return true
  }, [currentStep, getNextVisibleStep, validateStep, onBeforeStepChange, setStep, visibleSteps])

  const prev = React.useCallback(() => {
    const prevStep = getPrevVisibleStep(currentStep)
    if (prevStep === null) return
    setStep(prevStep, "prev")
  }, [currentStep, getPrevVisibleStep, setStep])

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
            if (isVisible(i)) {
              next.add(i)
            }
          }
          return next
        })
      }

      setStep(targetStep, "goto")
      return true
    },
    [canNavigateTo, currentStep, validateStep, onBeforeStepChange, setStep, isVisible]
  )

  const skip = React.useCallback(() => {
    if (!skippableSteps.has(currentStep)) return

    const nextStep = getNextVisibleStep(currentStep)
    if (nextStep === null) return

    setSkippedSteps((prev) => new Set([...prev, currentStep]))
    onSkip?.(currentStep)
    setStep(nextStep, "skip")
  }, [currentStep, skippableSteps, getNextVisibleStep, onSkip, setStep])

  const skipStep = React.useCallback(
    (step: number) => {
      if (!skippableSteps.has(step)) return
      setSkippedSteps((prev) => new Set([...prev, step]))
      onSkip?.(step)
    },
    [skippableSteps, onSkip]
  )

  const unskipStep = React.useCallback((step: number) => {
    setSkippedSteps((prev) => {
      const next = new Set(prev)
      next.delete(step)
      return next
    })
  }, [])

  const reset = React.useCallback(() => {
    setStep(initialStep, "goto")
    setCompletedSteps(new Set())
    setSkippedSteps(new Set())
    setErrorStep(null)
    clearProgress()
  }, [initialStep, setStep, clearProgress])

  const markCompleted = React.useCallback(
    (step: number) => {
      setCompletedSteps((prev) => new Set([...prev, step]))
      // Check if all visible steps are completed
      const allCompleted = visibleSteps.every(
        (s) => completedSteps.has(s) || s === step || skippedSteps.has(s)
      )
      if (allCompleted) {
        onComplete?.()
      }
    },
    [visibleSteps, completedSteps, skippedSteps, onComplete]
  )

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

  const isSkipped = React.useCallback(
    (step: number) => skippedSteps.has(step),
    [skippedSteps]
  )

  const isSkippable = React.useCallback(
    (step: number) => skippableSteps.has(step),
    [skippableSteps]
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
    (step: number): "active" | "completed" | "error" | "pending" | "skipped" => {
      if (hasError(step)) return "error"
      if (isSkipped(step)) return "skipped"
      if (isActive(step)) return "active"
      if (isCompleted(step)) return "completed"
      return "pending"
    },
    [hasError, isSkipped, isActive, isCompleted]
  )

  const getStepProps = React.useCallback(
    (step: number) => ({
      role: "listitem" as const,
      tabIndex: isActive(step) ? 0 : -1,
      "aria-current": isActive(step) ? ("step" as const) : undefined,
      "aria-disabled": !isAccessible(step),
      "data-state": getStepState(step),
      "data-skippable": isSkippable(step),
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
            targetStep = getNextVisibleStep(currentStep) ?? currentStep
            break
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault()
            targetStep = getPrevVisibleStep(currentStep) ?? currentStep
            break
          case "Home":
            e.preventDefault()
            targetStep = visibleSteps[0]
            break
          case "End":
            e.preventDefault()
            targetStep = visibleSteps[visibleSteps.length - 1]
            break
          case "Enter":
          case " ":
            e.preventDefault()
            if (isAccessible(step)) {
              goTo(step)
            }
            return
          case "Escape":
            e.preventDefault()
            ;(e.target as HTMLElement)?.blur()
            return
          default:
            return
        }

        if (isAccessible(targetStep)) {
          goTo(targetStep)
        }
      },
    }),
    [
      isActive,
      isAccessible,
      getStepState,
      isSkippable,
      goTo,
      currentStep,
      getNextVisibleStep,
      getPrevVisibleStep,
      visibleSteps,
    ]
  )

  const getPanelProps = React.useCallback(
    (step: number) => ({
      role: "region" as const,
      hidden: !isActive(step),
      "aria-labelledby": `stepper-step-${step}`,
      id: `stepper-panel-${step}`,
    }),
    [isActive]
  )

  // Calculate progress based on visible steps
  const currentVisibleIndex = visibleSteps.indexOf(currentStep)
  const progressValue =
    effectiveTotalSteps > 1
      ? (currentVisibleIndex / (effectiveTotalSteps - 1)) * 100
      : 100

  return {
    currentStep,
    totalSteps: effectiveTotalSteps,
    visibleSteps,
    completedSteps,
    skippedSteps,
    skippableSteps,
    errorStep,
    isValidating,
    next,
    prev,
    goTo,
    reset,
    skip,
    skipStep,
    unskipStep,
    markCompleted,
    markIncomplete,
    setError: setErrorStep,
    isActive,
    isCompleted,
    isSkipped,
    isSkippable,
    hasError,
    isAccessible,
    isVisible,
    canGoNext: getNextVisibleStep(currentStep) !== null,
    canGoPrev: getPrevVisibleStep(currentStep) !== null,
    isFirstStep: currentVisibleIndex === 0,
    isLastStep: currentVisibleIndex === effectiveTotalSteps - 1,
    progress: progressValue,
    saveProgress,
    loadProgress,
    clearProgress,
    getStepProps,
    getPanelProps,
  }
}

export type { UseStepperOptions, UseStepperReturn }
