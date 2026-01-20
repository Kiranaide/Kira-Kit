import * as React from "react"
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statsCardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-2",
        filled: "bg-muted/50 border-transparent",
        gradient: "bg-gradient-to-br from-primary/10 to-primary/5 border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const statsCardHeaderVariants = cva(
  "flex items-center justify-between",
  {
    variants: {
      size: {
        sm: "space-y-1",
        default: "space-y-2",
        lg: "space-y-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const statsCardValueVariants = cva(
  "text-2xl font-bold tracking-tight",
  {
    variants: {
      size: {
        sm: "text-xl",
        default: "text-2xl",
        lg: "text-3xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const statsCardTrendVariants = cva(
  "inline-flex items-center gap-1 text-sm font-medium",
  {
    variants: {
      trend: {
        up: "text-success",
        down: "text-destructive",
        neutral: "text-muted-foreground",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
)

const statsCardDescriptionVariants = cva(
  "text-sm text-muted-foreground",
  {
    variants: {},
    defaultVariants: {},
  }
)

interface StatsCardProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof statsCardVariants> {}
interface StatsCardHeaderProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof statsCardHeaderVariants> {}
interface StatsCardValueProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof statsCardValueVariants> {}
interface StatsCardTrendProps extends Omit<React.ComponentPropsWithoutRef<"div">, "trend">, VariantProps<typeof statsCardTrendVariants> {
  value: number
  showIcon?: boolean
  showSign?: boolean
}
interface StatsCardDescriptionProps extends React.ComponentPropsWithoutRef<"p">, VariantProps<typeof statsCardDescriptionVariants> {}
interface StatsCardSparkProps extends React.ComponentPropsWithoutRef<"div"> {}
interface StatsCardSparklineProps extends React.ComponentPropsWithoutRef<"div"> {
  data: number[]
  trend?: "up" | "down" | "neutral"
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(statsCardVariants({ variant, className }))} {...props} />
  )
)
StatsCard.displayName = "StatsCard"

const StatsCardHeader = React.forwardRef<HTMLDivElement, StatsCardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} className={cn(statsCardHeaderVariants({ size, className }))} {...props} />
  )
)
StatsCardHeader.displayName = "StatsCardHeader"

const StatsCardValue = React.forwardRef<HTMLDivElement, StatsCardValueProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} className={cn(statsCardValueVariants({ size, className }))} {...props} />
  )
)
StatsCardValue.displayName = "StatsCardValue"

const StatsCardTrend = React.forwardRef<HTMLDivElement, StatsCardTrendProps>(
  ({ className, trend, value, showIcon = true, showSign = false, ...props }, ref) => {
    const isPositive = Number(value) > 0
    const isNegative = Number(value) < 0
    const isNeutral = Number(value) === 0

    const trendValue = showSign && !isNeutral
      ? `${isPositive ? "+" : ""}${Number(value)}%`
      : `${Math.abs(Number(value))}%`

    const TrendIcon = isPositive ? IconTrendingUp : isNegative ? IconTrendingDown : IconMinus

    return (
      <div
        ref={ref}
        className={cn(statsCardTrendVariants({ trend: trend || (isPositive ? "up" : isNegative ? "down" : "neutral"), className }))}
        {...props}
      >
        {showIcon && <TrendIcon className="h-4 w-4" aria-hidden="true" />}
        <span>{trendValue}</span>
      </div>
    )
  }
)
StatsCardTrend.displayName = "StatsCardTrend"

const StatsCardDescription = React.forwardRef<HTMLParagraphElement, StatsCardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(statsCardDescriptionVariants({ className }))} {...props} />
  )
)
StatsCardDescription.displayName = "StatsCardDescription"

const StatsCardSpark = React.forwardRef<HTMLDivElement, StatsCardSparkProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-16 w-full overflow-hidden", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  )
)
StatsCardSpark.displayName = "StatsCardSpark"

const StatsCardSparkline = React.forwardRef<HTMLDivElement, StatsCardSparklineProps>(
  ({ className, data, trend = "neutral", ...props }, ref) => {
    const color = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#6b7280"
    const chartData = data.map((value, index) => ({ index, value }))

    return (
      <div ref={ref} className={cn("h-16 w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#gradient-${trend})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
StatsCardSparkline.displayName = "StatsCardSparkline"

export {
  StatsCard,
  StatsCardHeader,
  StatsCardValue,
  StatsCardTrend,
  StatsCardDescription,
  StatsCardSpark,
  StatsCardSparkline,
  statsCardVariants,
  statsCardHeaderVariants,
  statsCardValueVariants,
  statsCardTrendVariants,
  statsCardDescriptionVariants,
}

export type {
  StatsCardProps,
  StatsCardHeaderProps,
  StatsCardValueProps,
  StatsCardTrendProps,
  StatsCardDescriptionProps,
  StatsCardSparkProps,
  StatsCardSparklineProps,
}
