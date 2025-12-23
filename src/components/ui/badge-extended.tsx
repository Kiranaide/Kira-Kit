"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// BADGE VARIANTS (extended colors and sizes)
// ============================================
const badgeExtendedVariants = cva(
  "gap-1.5 rounded-full border border-transparent font-medium transition-all inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        info: "bg-info text-info-foreground",
        outline: "border-border text-foreground bg-transparent",
        ghost: "bg-muted text-muted-foreground",
        // Soft variants (lighter backgrounds)
        "primary-soft": "bg-primary/10 text-primary",
        "secondary-soft": "bg-secondary/50 text-secondary-foreground",
        "destructive-soft": "bg-destructive/10 text-destructive",
        "success-soft":
          "bg-success/10 text-success-foreground dark:text-success",
        "warning-soft":
          "bg-warning/10 text-warning-foreground dark:text-warning",
        "info-soft": "bg-info/10 text-info-foreground dark:text-info",
      },
      size: {
        xs: "h-4 px-1.5 text-[10px] [&>svg]:size-2.5",
        sm: "h-5 px-2 text-xs [&>svg]:size-3",
        default: "h-6 px-2.5 text-xs [&>svg]:size-3.5",
        lg: "h-7 px-3 text-sm [&>svg]:size-4",
        xl: "h-8 px-4 text-sm [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BadgeExtendedProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeExtendedVariants> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

function BadgeExtended({
  className,
  variant,
  size,
  icon,
  iconPosition = "left",
  children,
  ...props
}: BadgeExtendedProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        badgeExtendedVariants({ variant, size }),
        iconPosition === "right" && "flex-row-reverse",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// ============================================
// STATUS BADGE (with dot indicator)
// ============================================
interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "default" | "lg";
}

function StatusBadge({
  status,
  size = "default",
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const statusColors = {
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-destructive",
    info: "bg-info",
    default: "bg-muted-foreground",
  };

  const sizeClasses = {
    sm: "h-5 px-2 text-xs gap-1.5",
    default: "h-6 px-2.5 text-xs gap-2",
    lg: "h-7 px-3 text-sm gap-2",
  };

  const dotSizes = {
    sm: "h-1.5 w-1.5",
    default: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };

  return (
    <span
      data-slot="status-badge"
      className={cn(
        "inline-flex items-center rounded-full bg-muted text-muted-foreground font-medium",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          statusColors[status],
          dotSizes[size]
        )}
      />
      {children}
    </span>
  );
}

// ============================================
// COUNT BADGE (for notifications, counts etc)
// ============================================
interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
  size?: "xs" | "sm" | "default";
  variant?: "default" | "destructive" | "secondary";
}

function CountBadge({
  count,
  max = 99,
  size = "default",
  variant = "default",
  className,
  ...props
}: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  const sizeClasses = {
    xs: "min-w-4 h-4 px-1 text-[10px]",
    sm: "min-w-5 h-5 px-1.5 text-xs",
    default: "min-w-6 h-6 px-2 text-xs",
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      data-slot="count-badge"
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tabular-nums",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  );
}

export { BadgeExtended, StatusBadge, CountBadge, badgeExtendedVariants };
export type { BadgeExtendedProps, StatusBadgeProps, CountBadgeProps };
