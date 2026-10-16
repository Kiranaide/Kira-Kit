import * as React from "react";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cva, type VariantProps } from "class-variance-authority";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer";

function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

function useCountUp(
  value: number,
  duration: number = 1,
  enabled: boolean = true,
  decimals: number = 0
): number {
  const [displayValue, setDisplayValue] = React.useState(0);
  const reducedMotion = useReducedMotion();
  const previousValue = React.useRef(0);

  React.useEffect(() => {
    if (!enabled || reducedMotion) {
      setDisplayValue(value);
      previousValue.current = value;

      return;
    }

    const obj = { val: previousValue.current };
    gsap.to(obj, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayValue(obj.val);
      },
      onComplete: () => {
        previousValue.current = value;
      },
    });

    return () => {
      gsap.killTweensOf(obj);
    };
  }, [value, duration, enabled, reducedMotion]);

  return decimals > 0
    ? Number(displayValue.toFixed(decimals))
    : Math.round(displayValue);
}

type FormatType = "currency" | "percentage" | "compact" | "number" | "custom";

interface FormatOptions {
  format?: FormatType;
  currency?: string;
  locale?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

function formatValue(value: number, options: FormatOptions = {}): string {
  const {
    format = "number",
    currency = "USD",
    locale = "en-US",
    decimals,
    prefix = "",
    suffix = "",
    formatter,
  } = options;

  if (formatter) {
    return `${prefix}${formatter(value)}${suffix}`;
  }

  let formatted: string;

  switch (format) {
    case "currency":
      formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 0,
      }).format(value);
      break;
    case "percentage":
      formatted = `${value.toFixed(decimals ?? 1)}%`;
      break;
    case "compact":
      formatted = new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: decimals ?? 1,
      }).format(value);
      break;
    case "number":
    default:
      formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals ?? 0,
        maximumFractionDigits: decimals ?? 0,
      }).format(value);
      break;
  }

  return `${prefix}${formatted}${suffix}`;
}

const statsCardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-2",
        filled: "bg-muted/50 border-transparent",
        gradient:
          "bg-gradient-to-br from-primary/10 to-primary/5 border-transparent",
        interactive:
          "border-border cursor-pointer hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        glass: "bg-background/60 backdrop-blur-xl border-border/50 shadow-lg",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
      status: {
        default: "",
        success: "border-l-4 border-l-success",
        warning: "border-l-4 border-l-warning",
        error: "border-l-4 border-l-destructive",
        info: "border-l-4 border-l-info",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "default",
    },
  }
);

const statsCardIconVariants = cva(
  "flex items-center justify-center rounded-lg shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
        info: "bg-info/10 text-info",
      },
      size: {
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const statsCardHeaderVariants = cva("flex items-start justify-between gap-2", {
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
});

const statsCardValueVariants = cva("font-bold tracking-tight tabular-nums", {
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
});

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
);

const statsCardDescriptionVariants = cva("text-sm text-muted-foreground", {
  variants: {},
  defaultVariants: {},
});

const statsCardProgressVariants = cva(
  "relative h-1.5 w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatsCardContextValue {
  id: string;
  isInteractive: boolean;
  size: "sm" | "default" | "lg";
}

const StatsCardContext = React.createContext<StatsCardContextValue | null>(
  null
);

function useStatsCardContext() {
  const context = React.useContext(StatsCardContext);

  if (!context) {
    throw new Error("StatsCard components must be used within a StatsCard");
  }

  return context;
}

interface StatsCardProps
  extends
    React.ComponentPropsWithoutRef<"article">,
    VariantProps<typeof statsCardVariants> {
  loading?: boolean;
  drawerContent?: React.ReactNode;
  drawerTitle?: string;
  drawerDescription?: string;
  onOpenChange?: (open: boolean) => void;
}

interface StatsCardIconProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof statsCardIconVariants> {}

interface StatsCardHeaderProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof statsCardHeaderVariants> {}

type StatsCardTitleProps = React.ComponentPropsWithoutRef<"h3">;

type StatsCardActionProps = React.ComponentPropsWithoutRef<"div">;

interface StatsCardValueProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof statsCardValueVariants>,
    FormatOptions {
  value?: number;
  animate?: boolean;
  animationDuration?: number;
  children?: React.ReactNode;
}

interface StatsCardTrendProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "trend">,
    VariantProps<typeof statsCardTrendVariants> {
  value: number;
  showIcon?: boolean;
  showSign?: boolean;
  comparison?: string;
}

interface StatsCardDescriptionProps
  extends
    React.ComponentPropsWithoutRef<"p">,
    VariantProps<typeof statsCardDescriptionVariants> {}

interface StatsCardProgressProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof statsCardProgressVariants> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

type StatsCardSparkProps = React.ComponentPropsWithoutRef<"div">;

interface StatsCardSparklineProps extends React.ComponentPropsWithoutRef<"div"> {
  data: number[];
  trend?: "up" | "down" | "neutral";
}

type StatsCardFooterProps = React.ComponentPropsWithoutRef<"div">;

type StatsCardTimeRangeProps = React.ComponentPropsWithoutRef<"span">;

interface StatsCardSkeletonProps extends React.ComponentPropsWithoutRef<"div"> {
  showSparkline?: boolean;
  showIcon?: boolean;
  showProgress?: boolean;
}

const StatsCard = React.forwardRef<HTMLElement, StatsCardProps>(
  (
    {
      className,
      variant,
      size = "default",
      status,
      loading,
      drawerContent,
      drawerTitle,
      drawerDescription,
      onOpenChange,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const isInteractive =
      variant === "interactive" || !!onClick || !!drawerContent;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (drawerContent) {
        setDrawerOpen(true);
      }

      onClick?.(e);
    };

    const handleDrawerOpenChange = (open: boolean) => {
      setDrawerOpen(open);
      onOpenChange?.(open);
    };

    const contextValue = React.useMemo(
      () => ({ id, isInteractive, size: size || "default" }),
      [id, isInteractive, size]
    );

    if (loading) {
      return (
        <StatsCardContext.Provider value={contextValue}>
          <StatsCardSkeleton className={className} />
        </StatsCardContext.Provider>
      );
    }

    const cardContent = (
      <article
        ref={ref}
        data-slot="stats-card"
        
        aria-labelledby={`${id}-title`}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(e as unknown as React.MouseEvent<HTMLElement>);
                }
              }
            : undefined
        }
        className={cn(statsCardVariants({ variant, size, status, className }))}
        {...props}
      >
        {children}
      </article>
    );

    if (drawerContent) {
      return (
        <StatsCardContext.Provider value={contextValue}>
          <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
            {cardContent}
            <DrawerContent side="right" size="lg">
              <DrawerHeader>
                <DrawerTitle>{drawerTitle || "Details"}</DrawerTitle>
                {drawerDescription && (
                  <DrawerDescription>{drawerDescription}</DrawerDescription>
                )}
              </DrawerHeader>
              <DrawerBody>{drawerContent}</DrawerBody>
            </DrawerContent>
          </Drawer>
        </StatsCardContext.Provider>
      );
    }

    return (
      <StatsCardContext.Provider value={contextValue}>
        {cardContent}
      </StatsCardContext.Provider>
    );
  }
);

StatsCard.displayName = "StatsCard";

const StatsCardIcon = React.forwardRef<HTMLDivElement, StatsCardIconProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="stats-card-icon"
      className={cn(statsCardIconVariants({ variant, size, className }))}
      aria-hidden="true"
      {...props}
    />
  )
);

StatsCardIcon.displayName = "StatsCardIcon";

const StatsCardHeader = React.forwardRef<HTMLDivElement, StatsCardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="stats-card-header"
      className={cn(statsCardHeaderVariants({ size, className }))}
      {...props}
    />
  )
);

StatsCardHeader.displayName = "StatsCardHeader";

const StatsCardTitle = React.forwardRef<
  HTMLHeadingElement,
  StatsCardTitleProps
>(({ className, ...props }, ref) => {
  const { id } = useStatsCardContext();

  return (
    <h3
      ref={ref}
      id={`${id}-title`}
      data-slot="stats-card-title"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
});

StatsCardTitle.displayName = "StatsCardTitle";

const StatsCardAction = React.forwardRef<HTMLDivElement, StatsCardActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="stats-card-action"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
);

StatsCardAction.displayName = "StatsCardAction";

const StatsCardValue = React.forwardRef<HTMLDivElement, StatsCardValueProps>(
  (
    {
      className,
      size,
      value,
      format,
      currency,
      locale,
      decimals,
      prefix,
      suffix,
      formatter,
      animate = false,
      animationDuration = 1,
      children,
      ...props
    },
    ref
  ) => {
    const { id } = useStatsCardContext();

    const animatedValue = useCountUp(
      value ?? 0,
      animationDuration,
      animate && value !== undefined,
      decimals ?? (format === "percentage" ? 1 : 0)
    );

    const displayValue =
      children ??
      (value === undefined
        ? null
        : formatValue(animate ? animatedValue : value, {
            format,
            currency,
            locale,
            decimals,
            prefix,
            suffix,
            formatter,
          }));

    return (
      <div
        ref={ref}
        data-slot="stats-card-value"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-describedby={`${id}-title`}
        className={cn(statsCardValueVariants({ size, className }))}
        {...props}
      >
        {displayValue}
      </div>
    );
  }
);

StatsCardValue.displayName = "StatsCardValue";

const StatsCardTrend = React.forwardRef<HTMLDivElement, StatsCardTrendProps>(
  (
    {
      className,
      trend,
      value,
      showIcon = true,
      showSign = false,
      comparison,
      ...props
    },
    ref
  ) => {
    const isPositive = Number(value) > 0;
    const isNegative = Number(value) < 0;
    const isNeutral = Number(value) === 0;

    const trendValue =
      showSign && !isNeutral
        ? `${isPositive ? "+" : ""}${Number(value)}%`
        : `${Math.abs(Number(value))}%`;

    const TrendIcon = isPositive
      ? IconTrendingUp
      : isNegative
        ? IconTrendingDown
        : IconMinus;

    const computedTrend =
      trend || (isPositive ? "up" : isNegative ? "down" : "neutral");

    const screenReaderText = isPositive
      ? `Increased by ${Math.abs(value)} percent`
      : isNegative
        ? `Decreased by ${Math.abs(value)} percent`
        : "No change";

    return (
      <div
        ref={ref}
        data-slot="stats-card-trend"
        className={cn(
          statsCardTrendVariants({ trend: computedTrend, className })
        )}
        {...props}
      >
        {showIcon && <TrendIcon className="h-4 w-4" aria-hidden="true" />}
        <span aria-hidden="true">{trendValue}</span>
        {comparison && (
          <span
            className="text-muted-foreground font-normal"
            aria-hidden="true"
          >
            {comparison}
          </span>
        )}
        <span className="sr-only">
          {screenReaderText}
          {comparison ? ` ${comparison}` : ""}
        </span>
      </div>
    );
  }
);

StatsCardTrend.displayName = "StatsCardTrend";

const StatsCardDescription = React.forwardRef<
  HTMLParagraphElement,
  StatsCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="stats-card-description"
    className={cn(statsCardDescriptionVariants({ className }))}
    {...props}
  />
));

StatsCardDescription.displayName = "StatsCardDescription";

const StatsCardProgress = React.forwardRef<
  HTMLDivElement,
  StatsCardProgressProps
>(
  (
    { className, variant, value, max = 100, showLabel = false, ...props },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const indicatorColor = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    };

    return (
      <div
        ref={ref}
        data-slot="stats-card-progress"
        className="space-y-1"
        {...props}
      >
        {showLabel && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{value}</span>
            <span>{max}</span>
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${Math.round(percentage)}% complete`}
          className={cn(statsCardProgressVariants({ variant, className }))}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              indicatorColor[variant || "default"]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

StatsCardProgress.displayName = "StatsCardProgress";

const StatsCardSpark = React.forwardRef<HTMLDivElement, StatsCardSparkProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="stats-card-spark"
      className={cn("h-16 w-full overflow-hidden", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  )
);

StatsCardSpark.displayName = "StatsCardSpark";

const StatsCardSparkline = React.forwardRef<
  HTMLDivElement,
  StatsCardSparklineProps
>(({ className, data, trend = "neutral", ...props }, ref) => {
  const reducedMotion = useReducedMotion();

  const color =
    trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#6b7280";

  const chartData = data.map((value, index) => ({ index, value }));
  const gradientId = React.useId();

  return (
    <div
      ref={ref}
      data-slot="stats-card-sparkline"
      className={cn("h-16 w-full", className)}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={!reducedMotion}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

StatsCardSparkline.displayName = "StatsCardSparkline";

const StatsCardFooter = React.forwardRef<HTMLDivElement, StatsCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="stats-card-footer"
      className={cn(
        "mt-2 flex items-center justify-between text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);

StatsCardFooter.displayName = "StatsCardFooter";

const StatsCardTimeRange = React.forwardRef<
  HTMLSpanElement,
  StatsCardTimeRangeProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="stats-card-time-range"
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));

StatsCardTimeRange.displayName = "StatsCardTimeRange";

const StatsCardSkeleton = React.forwardRef<
  HTMLDivElement,
  StatsCardSkeletonProps
>(
  (
    {
      className,
      showSparkline = false,
      showIcon = false,
      showProgress = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="stats-card-skeleton"
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm animate-pulse",
        className
      )}
      aria-busy="true"
      aria-label="Loading stats card"
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          {showIcon && <div className="h-10 w-10 rounded-lg bg-muted" />}
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
      </div>
      {showProgress && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted" />
      )}
      {showSparkline && <div className="mt-3 h-16 w-full rounded bg-muted" />}
    </div>
  )
);

StatsCardSkeleton.displayName = "StatsCardSkeleton";

export {
  StatsCard,
  StatsCardIcon,
  StatsCardHeader,
  StatsCardTitle,
  StatsCardAction,
  StatsCardValue,
  StatsCardTrend,
  StatsCardDescription,
  StatsCardProgress,
  StatsCardSpark,
  StatsCardSparkline,
  StatsCardFooter,
  StatsCardTimeRange,
  StatsCardSkeleton,
  statsCardVariants,
  statsCardIconVariants,
  statsCardHeaderVariants,
  statsCardValueVariants,
  statsCardTrendVariants,
  statsCardDescriptionVariants,
  statsCardProgressVariants,
  formatValue,
  useCountUp,
  useReducedMotion,
};

export type {
  StatsCardProps,
  StatsCardIconProps,
  StatsCardHeaderProps,
  StatsCardTitleProps,
  StatsCardActionProps,
  StatsCardValueProps,
  StatsCardTrendProps,
  StatsCardDescriptionProps,
  StatsCardProgressProps,
  StatsCardSparkProps,
  StatsCardSparklineProps,
  StatsCardFooterProps,
  StatsCardTimeRangeProps,
  StatsCardSkeletonProps,
  FormatType,
  FormatOptions,
};
