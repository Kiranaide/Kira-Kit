"use client"

import * as React from "react"
import { IconCheck, IconCircle, IconCircleCheck } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface StepperContextValue {
  value?: number | string
  onValueChange?: (value: number | string) => void
  orientation: "horizontal" | "vertical"
  size?: "sm" | "default" | "lg"
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

const stepperVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

const stepperListVariants = cva(
  "flex items-center gap-1",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col gap-4",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
    },
  }
)

const stepperItemVariants = cva(
  "relative flex items-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-row gap-4",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

const stepperTriggerVariants = cva(
  "flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const stepperIndicatorVariants = cva(
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-medium transition-colors",
  {
    variants: {
      state: {
        default: "border-border bg-background text-muted-foreground",
        active: "border-primary bg-primary text-primary-foreground",
        completed: "border-primary bg-primary text-primary-foreground",
        error: "border-destructive bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "h-6 w-6 text-xs",
        default: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
)

const stepperSeparatorVariants = cva(
  "border",
  {
    variants: {
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px",
      },
      state: {
        default: "border-muted",
        completed: "border-primary",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      state: "default",
    },
  }
)

interface StepperProps extends React.ComponentPropsWithoutRef<"div">, Omit<VariantProps<typeof stepperVariants>, "variant"> {
  value?: number | string
  onValueChange?: (value: number | string) => void
  size?: "sm" | "default" | "lg"
}

interface StepperListProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof stepperListVariants> {}
interface StepperItemProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onClick"> {
  value: number | string
  completed?: boolean
  disabled?: boolean
}
interface StepperTriggerProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof stepperTriggerVariants> {}
interface StepperIndicatorProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof stepperIndicatorVariants> {}
interface StepperTitleProps extends React.ComponentPropsWithoutRef<"p"> {}
interface StepperDescriptionProps extends React.ComponentPropsWithoutRef<"p"> {}
interface StepperSeparatorProps extends React.ComponentPropsWithoutRef<"div">, Omit<VariantProps<typeof stepperSeparatorVariants>, "state"> {
  state?: "default" | "completed"
  "data-completed"?: string
}
interface StepperContentProps extends React.ComponentPropsWithoutRef<"div"> {
  value: number | string
}
interface StepperNavigationProps extends React.ComponentPropsWithoutRef<"div"> {}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, size, value, onValueChange, orientation = "horizontal", children, ...props }, ref) => {
    const contextValue = React.useMemo(
      () => ({ value, onValueChange, orientation, size }),
      [value, onValueChange, orientation, size]
    )

  return (
    <div ref={ref} className={cn(stepperVariants({ orientation, className }))} {...props}>
      <StepperContext.Provider value={contextValue ?? { orientation: orientation || "horizontal" }}>{children}</StepperContext.Provider>
    </div>
  )
  }
)
Stepper.displayName = "Stepper"

const StepperList = React.forwardRef<HTMLDivElement, StepperListProps>(
  ({ className, orientation, size, ...props }, ref) => (
    <div ref={ref} className={cn(stepperListVariants({ orientation, size, className }))} {...props} />
  )
)
StepperList.displayName = "StepperList"

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, value, completed = false, disabled = false, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    const isActive = context?.value === value
    const state = completed ? "completed" : isActive ? "active" : "default"

    return (
      <div
        ref={ref}
        className={cn(stepperItemVariants({ orientation: context?.orientation, className }))}
        data-state={state}
        {...props}
      />
    )
  }
)
StepperItem.displayName = "StepperItem"

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ className, size, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(stepperTriggerVariants({ size, className }))}
      {...props}
    />
  )
)
StepperTrigger.displayName = "StepperTrigger"

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, state, size, children, ...props }, ref) => {
    const renderIndicator = () => {
      if (state === "completed") {
        return <IconCheck className="h-4 w-4" aria-hidden="true" />
      }
      if (state === "active") {
        return children || <IconCircleCheck className="h-4 w-4" aria-hidden="true" />
      }
      return children || <IconCircle className="h-4 w-4" aria-hidden="true" />
    }

    return (
      <div
        ref={ref}
        className={cn(stepperIndicatorVariants({ state, size, className }))}
        aria-current={state === "active" ? "step" : undefined}
        {...props}
      >
        {renderIndicator()}
      </div>
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

const StepperTitle = React.forwardRef<HTMLParagraphElement, StepperTitleProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("font-medium text-foreground", className)} {...props} />
  )
)
StepperTitle.displayName = "StepperTitle"

const StepperDescription = React.forwardRef<HTMLParagraphElement, StepperDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-muted-foreground", className)} {...props} />
  )
)
StepperDescription.displayName = "StepperDescription"

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, orientation, state, "data-completed": dataCompleted, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    const separatorState = state || (dataCompleted === "true" ? "completed" : "default")

    return (
      <div
        ref={ref}
        className={cn(stepperSeparatorVariants({ orientation: orientation || context?.orientation, state: separatorState, className }))}
        {...props}
      />
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ value: stepValue, className, children, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    const isActive = context?.value === stepValue

    if (!isActive) return null

    return (
      <div
        ref={ref}
        className={cn("mt-6", className)}
        role="tabpanel"
        id={`stepper-panel-${stepValue}`}
        aria-labelledby={`stepper-trigger-${stepValue}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperContent.displayName = "StepperContent"

const StepperNavigation = React.forwardRef<HTMLDivElement, StepperNavigationProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mt-6 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  )
)
StepperNavigation.displayName = "StepperNavigation"

export {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperNavigation,
  stepperVariants,
  stepperListVariants,
  stepperIndicatorVariants,
  stepperSeparatorVariants,
}

export type {
  StepperProps,
  StepperListProps,
  StepperItemProps,
  StepperTriggerProps,
  StepperIndicatorProps,
  StepperTitleProps,
  StepperDescriptionProps,
  StepperSeparatorProps,
  StepperContentProps,
  StepperNavigationProps,
}
