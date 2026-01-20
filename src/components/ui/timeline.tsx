import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const timelineVariants = cva("relative")

const timelineItemVariants = cva(
  "relative pl-8 pb-8 last:pb-0",
  {
    variants: {
      variant: {
        default: "",
        alternating: "pl-8",
        compact: "pl-6",
      },
      alignment: {
        left: "",
        center: "mx-auto max-w-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      alignment: "left",
    },
  }
)

const timelineConnectorVariants = cva(
  "absolute left-3 top-2 bottom-2 w-0.5",
  {
    variants: {
      variant: {
        default: "bg-muted",
        dashed: "border-l-2 border-dashed border-muted",
      },
      size: {
        sm: "left-2.5",
        default: "left-3",
        lg: "left-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const timelineDotVariants = cva(
  "absolute left-0 top-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-background border-2 border-border",
        filled: "bg-primary border-primary",
        outlined: "bg-background border-2 border-primary",
        ghost: "bg-transparent border-2 border-muted",
      },
      size: {
        sm: "h-4 w-4 -left-0.5",
        default: "h-6 w-6 -left-0",
        lg: "h-8 w-8 -left-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const timelineContentVariants = cva("relative")

const timelineTimeVariants = cva(
  "mb-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        subtle: "text-muted-foreground/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const timelineTitleVariants = cva(
  "text-base font-semibold leading-none",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const timelineDescriptionVariants = cva(
  "mt-1 text-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TimelineProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof timelineVariants> {}
interface TimelineItemProps extends React.ComponentPropsWithoutRef<"li">, VariantProps<typeof timelineItemVariants> {}
interface TimelineConnectorProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof timelineConnectorVariants> {}
interface TimelineDotProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof timelineDotVariants> {}
interface TimelineContentProps extends React.ComponentPropsWithoutRef<"div"> {}
interface TimelineTimeProps extends React.ComponentPropsWithoutRef<"time">, VariantProps<typeof timelineTimeVariants> {}
interface TimelineTitleProps extends React.ComponentPropsWithoutRef<"h3">, VariantProps<typeof timelineTitleVariants> {}
interface TimelineDescriptionProps extends React.ComponentPropsWithoutRef<"p">, VariantProps<typeof timelineDescriptionVariants> {}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(timelineVariants({ className }))} {...props} />
  )
)
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, variant, alignment, ...props }, ref) => (
    <li ref={ref} className={cn(timelineItemVariants({ variant, alignment, className }))} {...props} />
  )
)
TimelineItem.displayName = "TimelineItem"

const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(timelineConnectorVariants({ variant, size, className }))} {...props} />
  )
)
TimelineConnector.displayName = "TimelineConnector"

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <div ref={ref} className={cn(timelineDotVariants({ variant, size, className }))} {...props}>
      {children}
    </div>
  )
)
TimelineDot.displayName = "TimelineDot"

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(timelineContentVariants({ className }))} {...props} />
  )
)
TimelineContent.displayName = "TimelineContent"

const TimelineTime = React.forwardRef<HTMLTimeElement, TimelineTimeProps>(
  ({ className, variant, ...props }, ref) => (
    <time ref={ref} className={cn(timelineTimeVariants({ variant, className }))} {...props} />
  )
)
TimelineTime.displayName = "TimelineTime"

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, variant, ...props }, ref) => (
    <h3 ref={ref} className={cn(timelineTitleVariants({ variant, className }))} {...props} />
  )
)
TimelineTitle.displayName = "TimelineTitle"

const TimelineDescription = React.forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(
  ({ className, variant, ...props }, ref) => (
    <p ref={ref} className={cn(timelineDescriptionVariants({ variant, className }))} {...props} />
  )
)
TimelineDescription.displayName = "TimelineDescription"

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  timelineVariants,
  timelineItemVariants,
  timelineConnectorVariants,
  timelineDotVariants,
  timelineContentVariants,
  timelineTimeVariants,
  timelineTitleVariants,
  timelineDescriptionVariants,
}

export type {
  TimelineProps,
  TimelineItemProps,
  TimelineConnectorProps,
  TimelineDotProps,
  TimelineContentProps,
  TimelineTimeProps,
  TimelineTitleProps,
  TimelineDescriptionProps,
}
