import * as React from "react";
import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cva, type VariantProps } from "class-variance-authority";
import { gsap } from "gsap";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer";
import { resolveComponentDefaults } from "@/lib/component-defaults";

const statsTrendIcons = {
  positive: IconTrendingUp,
  negative: IconTrendingDown,
  neutral: IconMinus,
};

function useAnimatedDisplay(value: number, animated: boolean) {
  const [displayValue, setDisplayValue] = React.useState(0);

  const [previousDisplay, setPreviousDisplay] = React.useState({
    animated,
    value,
  });

  // Re-enabling starts from the last value displayed without animation.
  if (animated !== previousDisplay.animated) {
    setPreviousDisplay({ animated, value });

    if (animated) setDisplayValue(previousDisplay.value);
  } else if (!animated && !Object.is(value, previousDisplay.value)) {
    setPreviousDisplay({ animated, value });
  }

  return [displayValue, setDisplayValue] as const;
}

function useCountUp(
  value: number,
  duration: number = 1,
  enabled: boolean = true,
  decimals: number = 0,
): number {
  const reducedMotion = useReducedMotion();
  const animated = enabled && !reducedMotion;
  const [displayValue, setDisplayValue] = useAnimatedDisplay(value, animated);
  const previousValue = React.useRef(0);

  React.useEffect(() => {
    if (!animated) {
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
      previousValue.current = obj.val;
      gsap.killTweensOf(obj);
    };
  }, [value, duration, animated, setDisplayValue]);

  const visibleValue = animated ? displayValue : value;

  return decimals > 0
    ? Number(visibleValue.toFixed(decimals))
    : Math.round(visibleValue);
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

function resolveFormatOptions(input: FormatOptions) {
  const { format, currency, locale, decimals, prefix, suffix, formatter } =
    resolveComponentDefaults(input, RESOLVE_FORMAT_OPTIONS_DEFAULTS_1);

  return { format, currency, locale, decimals, prefix, suffix, formatter };
}

function getNumberFormatOptions({
  format,
  currency,
  decimals,
}: ReturnType<typeof resolveFormatOptions>): Intl.NumberFormatOptions {
  if (format === "currency") {
    return {
      style: "currency",
      currency,
      minimumFractionDigits: decimals ?? 0,
      maximumFractionDigits: decimals ?? 0,
    };
  }

  if (format === "compact") {
    return {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: decimals ?? 1,
    };
  }

  return {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  };
}

function formatValue(value: number, options: FormatOptions = {}): string {
  const resolved = resolveFormatOptions(options);
  const { formatter, prefix, suffix, format, decimals, locale } = resolved;

  if (formatter) {
    return prefix + formatter(value) + suffix;
  }

  const formatted =
    format === "percentage"
      ? value.toFixed(decimals ?? 1) + "%"
      : new Intl.NumberFormat(locale, getNumberFormatOptions(resolved)).format(
          value,
        );

  return prefix + formatted + suffix;
}

const statsCardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-[box-shadow,translate,border-color,background-color] duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-2",
        filled: "bg-muted/50 border-transparent",
        gradient:
          "bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 ring-primary/20 border-transparent",
        interactive:
          "border-border cursor-pointer hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        glass:
          "bg-background/60 dark:bg-background/40 backdrop-blur-xl backdrop-saturate-150 border-border/50 shadow-lg ring-0",
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
  },
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
  },
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
  },
);

interface StatsCardContextValue {
  id: string;
  isInteractive: boolean;
  size: "sm" | "default" | "lg";
}

const StatsCardContext = React.createContext<StatsCardContextValue | null>(
  null,
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

interface StatsCardDescriptionProps extends React.ComponentPropsWithoutRef<"p"> {}

interface StatsCardProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "default" | "success" | "warning" | "destructive";
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
  size?: "sm" | "default" | "lg";
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
    ref,
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
      [id, isInteractive, size],
    );

    if (loading) {
      return (
        <StatsCardContext.Provider value={contextValue}>
          <StatsCardSkeleton className={className} size={size || "default"} />
        </StatsCardContext.Provider>
      );
    }

    const cardContent = (
      <RenderStatsCardPart1
        {...{
          ref,
          isInteractive,
          id,
          handleClick,
          variant,
          size,
          status,
          className,
          props,
          children,
        }}
      />
    );

    if (drawerContent) {
      return renderStatsCardDrawer({
        contextValue,
        drawerOpen,
        handleDrawerOpenChange,
        drawerTitle,
        drawerDescription,
        drawerContent,
        cardContent,
      });
    }

    return (
      <StatsCardContext.Provider value={contextValue}>
        {cardContent}
      </StatsCardContext.Provider>
    );
  },
);

function renderStatsCardDrawer({
  contextValue,
  drawerOpen,
  handleDrawerOpenChange,
  drawerTitle,
  drawerDescription,
  drawerContent,
  cardContent,
}: {
  contextValue: StatsCardContextValue;
  drawerOpen: boolean;
  handleDrawerOpenChange: (open: boolean) => void;
  drawerTitle: React.ReactNode;
  drawerDescription: React.ReactNode;
  drawerContent: React.ReactNode;
  cardContent: React.ReactNode;
}) {
  return (
    <StatsCardContext.Provider value={contextValue}>
      <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
        {cardContent}
        <DrawerContent size="lg">
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
  ),
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
  ),
);

StatsCardHeader.displayName = "StatsCardHeader";

const StatsCardTitle = React.forwardRef<
  HTMLHeadingElement,
  StatsCardTitleProps
>(({ className, children, ...props }, ref) => {
  const { id } = useStatsCardContext();

  return (
    <h3
      ref={ref}
      id={`${id}-title`}
      data-slot="stats-card-title"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
    </h3>
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
  ),
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
    ref,
  ) => {
    const { id } = useStatsCardContext();

    const animatedValue = useCountUp(
      value ?? 0,
      animationDuration,
      animate && value !== undefined,
      decimals ?? (format === "percentage" ? 1 : 0),
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

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
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
  },
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
    ref,
  ) => {
    const resolveTrendDirection = () => {
      if (isPositive) return "positive" as const;

      if (isNegative) return "negative" as const;

      return "neutral" as const;
    };

    const resolveComputedTrend2 = () => {
      if (isPositive) {
        return "up" as const;
      }

      if (isNegative) {
        return "down" as const;
      }

      return "neutral" as const;
    };

    const resolveScreenReaderText3 = () => {
      if (isPositive) {
        return `Increased by ${Math.abs(value)} percent`;
      }

      if (isNegative) {
        return `Decreased by ${Math.abs(value)} percent`;
      }

      return "No change" as const;
    };

    const isPositive = Number(value) > 0;
    const isNegative = Number(value) < 0;
    const isNeutral = Number(value) === 0;

    const trendValue =
      showSign && !isNeutral
        ? `${isPositive ? "+" : ""}${Number(value)}%`
        : `${Math.abs(Number(value))}%`;

    const TrendIcon = statsTrendIcons[resolveTrendDirection()];

    const computedTrend = trend || resolveComputedTrend2();

    const screenReaderText = resolveScreenReaderText3();

    return (
      <div
        ref={ref}
        data-slot="stats-card-trend"
        className={cn(
          statsCardTrendVariants({ trend: computedTrend, className }),
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
  },
);

StatsCardTrend.displayName = "StatsCardTrend";

const StatsCardDescription = React.forwardRef<
  HTMLParagraphElement,
  StatsCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="stats-card-description"
    className={cn("text-sm text-muted-foreground", className)}
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
    ref,
  ) => {
    const indicatorColor = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    };

    return (
      <MeterPrimitive.Root
        ref={ref}
        data-slot="stats-card-progress"
        value={value}
        max={max}
        getAriaValueText={(_formattedValue, val) =>
          `${Math.round((val / max) * 100)}% complete`
        }
        className={cn("space-y-1", className)}
        {...props}
      >
        {showLabel && (
          <MeterPrimitive.Value className="flex justify-between text-xs text-muted-foreground">
            {(_formattedValue, val) => (
              <>
                <span>{val}</span>
                <span>{max}</span>
              </>
            )}
          </MeterPrimitive.Value>
        )}
        <MeterPrimitive.Track className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <MeterPrimitive.Indicator
            className={cn(
              // kira-kit-ignore layout-transitions: meter fill width is the value animation, driven by Base UI inline width
              "h-full rounded-full transition-[width,background-color] duration-300",
              indicatorColor[variant || "default"],
            )}
          />
        </MeterPrimitive.Track>
      </MeterPrimitive.Root>
    );
  },
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
  ),
);

StatsCardSpark.displayName = "StatsCardSpark";

const statsCardSparklineColors = {
  up: "var(--color-success)",
  down: "var(--color-destructive)",
  neutral: "var(--color-muted-foreground)",
} as const;

const StatsCardSparkline = React.forwardRef<
  HTMLDivElement,
  StatsCardSparklineProps
>(({ className, data, trend = "neutral", ...props }, ref) => {
  const reducedMotion = useReducedMotion();

  const color = statsCardSparklineColors[trend];

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
        className,
      )}
      {...props}
    />
  ),
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
>((input, ref) => {
  const { className, showSparkline, showIcon, showProgress, size, ...props } =
    resolveComponentDefaults(input, STATS_CARD_TSX_DEFAULTS_2);

  const resolveClassName4 = () => {
    if (size === "sm") {
      return "p-3" as const;
    }

    if (size === "lg") {
      return "p-6" as const;
    }

    return "p-4" as const;
  };

  const resolveClassName5 = () => {
    if (size === "sm") {
      return "h-3 w-20" as const;
    }

    if (size === "lg") {
      return "h-5 w-28" as const;
    }

    return "h-4 w-24" as const;
  };

  const resolveClassName6 = () => {
    if (size === "sm") {
      return "h-6 w-24" as const;
    }

    if (size === "lg") {
      return "h-10 w-40" as const;
    }

    return "h-8 w-32" as const;
  };

  const resolveClassName7 = () => {
    if (size === "sm") {
      return "h-3 w-14" as const;
    }

    if (size === "lg") {
      return "h-5 w-20" as const;
    }

    return "h-4 w-16" as const;
  };

  return renderStatsCardSkeletonPart2({
    ref,
    resolveClassName4,
    className,
    props,
    showIcon,
    resolveClassName5,
    resolveClassName6,
    resolveClassName7,
    showProgress,
    showSparkline,
    size,
  });
});

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
  formatValue,
  useCountUp,
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

type renderStatsCardPart1Args = {
  ref: React.ForwardedRef<HTMLElement>;
  isInteractive: boolean;
  id: string;
  handleClick: (e: React.MouseEvent<HTMLElement>) => void;
  variant:
    | "default"
    | "gradient"
    | "outline"
    | "filled"
    | "interactive"
    | "glass"
    | null
    | undefined;
  size: "default" | "sm" | "lg" | null;
  status:
    "error" | "default" | "success" | "warning" | "info" | null | undefined;
  className: string | undefined;
  props: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
};

function RenderStatsCardPart1({
  ref,
  isInteractive,
  id,
  handleClick,
  variant,
  size,
  status,
  className,
  props,
  children,
}: renderStatsCardPart1Args) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Actionable cards set button role, tabIndex, and Enter/Space activation together; informational cards attach no interaction handlers.
    <article
      ref={ref}
      data-slot="stats-card"
      role={isInteractive ? "button" : undefined}

      aria-labelledby={`${id}-title`}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.currentTarget.click();
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
}

type renderStatsCardSkeletonPart2Args = {
  ref: React.ForwardedRef<HTMLDivElement>;
  resolveClassName4: () => "p-3" | "p-4" | "p-6";
  className: string | undefined;
  props: React.ComponentPropsWithoutRef<"div">;
  showIcon: boolean;
  resolveClassName5: () => "h-3 w-20" | "h-5 w-28" | "h-4 w-24";
  resolveClassName6: () => "h-6 w-24" | "h-10 w-40" | "h-8 w-32";
  resolveClassName7: () => "h-3 w-14" | "h-5 w-20" | "h-4 w-16";
  showProgress: boolean;
  showSparkline: boolean;
  size: "default" | "sm" | "lg";
};

function renderStatsCardSkeletonPart2({
  ref,
  resolveClassName4,
  className,
  props,
  showIcon,
  resolveClassName5,
  resolveClassName6,
  resolveClassName7,
  showProgress,
  showSparkline,
  size,
}: renderStatsCardSkeletonPart2Args) {
  return (
    <div
      ref={ref}
      data-slot="stats-card-skeleton"
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card shadow-sm animate-pulse",
        resolveClassName4(),
        className,
      )}
      aria-busy="true"
      aria-label="Loading stats card"
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          {showIcon && <div className="h-10 w-10 rounded-lg bg-muted" />}
          <div className={cn("rounded bg-muted", resolveClassName5())} />
          <div className={cn("rounded bg-muted", resolveClassName6())} />
          <div className={cn("rounded bg-muted", resolveClassName7())} />
        </div>
      </div>
      {showProgress && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted" />
      )}
      {showSparkline && (
        <div
          className={cn(
            "mt-3 w-full rounded bg-muted",
            size === "lg" ? "h-20" : "h-16",
          )}
        />
      )}
    </div>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const RESOLVE_FORMAT_OPTIONS_DEFAULTS_1 = {
  format: "number",
  currency: "USD",
  locale: "en-US",
  prefix: "",
  suffix: "",
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const STATS_CARD_TSX_DEFAULTS_2 = {
  showSparkline: false,
  showIcon: false,
  showProgress: false,
  size: "default",
} as const;
