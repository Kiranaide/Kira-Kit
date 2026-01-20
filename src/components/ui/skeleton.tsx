import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// Skeleton Variants
// ============================================================================

const skeletonVariants = cva("rounded-md bg-muted", {
  variants: {
    variant: {
      default: "motion-safe:animate-pulse motion-reduce:opacity-70",
      circle: "rounded-full motion-safe:animate-pulse motion-reduce:opacity-70",
      text: "h-4 w-full motion-safe:animate-pulse motion-reduce:opacity-70",
      shimmer: "relative overflow-hidden motion-reduce:opacity-70",
      wave: "motion-safe:animate-skeleton-wave motion-reduce:opacity-70",
    },
    animated: {
      true: "",
      false: "!animate-none",
    },
  },
  defaultVariants: {
    variant: "default",
    animated: true,
  },
});

// ============================================================================
// Types
// ============================================================================

interface SkeletonRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Indicates loading state for assistive technology */
  loading?: boolean;
  /** Accessible label describing what is loading */
  "aria-label"?: string;
  /** Live region politeness for announcements */
  "aria-live"?: "polite" | "assertive" | "off";
  /** Children skeleton elements */
  children: React.ReactNode;
}

interface SkeletonBoneProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Animation delay in milliseconds for staggering */
  delay?: number;
  /** Animation duration in milliseconds */
  duration?: number;
}

interface SkeletonLinesProps extends Omit<SkeletonBoneProps, "children"> {
  /** Number of lines to render */
  count?: number;
  /** Gap between lines */
  gap?: "sm" | "md" | "lg";
  /** Make last line shorter for natural text appearance */
  lastLineWidth?: "full" | "3/4" | "1/2" | "2/3";
}

interface SkeletonImageProps extends SkeletonBoneProps {
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
}

interface SkeletonAvatarProps extends Omit<SkeletonBoneProps, "variant"> {
  /** Avatar size */
  size?: "sm" | "md" | "lg" | "xl";
}

// ============================================================================
// Skeleton Root (Container with accessibility)
// ============================================================================

function SkeletonRoot({
  loading = true,
  "aria-label": ariaLabel,
  "aria-live": ariaLive = "polite",
  className,
  children,
  ...props
}: SkeletonRootProps) {
  return (
    <div
      data-slot="skeleton-root"
      role="status"
      aria-busy={loading}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      className={cn("relative", className)}
      {...props}
    >
      {children}
      {/* Screen reader announcement */}
      {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
    </div>
  );
}

// ============================================================================
// Skeleton Bone (Base skeleton element)
// ============================================================================

function SkeletonBone({
  className,
  variant,
  animated,
  delay,
  duration,
  style,
  ...props
}: SkeletonBoneProps) {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(delay && { animationDelay: `${delay}ms` }),
    ...(duration && { animationDuration: `${duration}ms` }),
  };

  return (
    <div
      data-slot="skeleton-bone"
      aria-hidden="true"
      tabIndex={-1}
      className={cn(skeletonVariants({ variant, animated }), className)}
      style={customStyle}
      {...props}
    >
      {variant === "shimmer" && (
        <div
          className="absolute inset-0 motion-safe:animate-shimmer motion-reduce:hidden"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Skeleton Text (Single text line)
// ============================================================================

function SkeletonText({ className, ...props }: SkeletonBoneProps) {
  return (
    <SkeletonBone
      variant="text"
      className={cn("h-4", className)}
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Lines (Multiple text lines)
// ============================================================================

function SkeletonLines({
  count = 3,
  gap = "md",
  lastLineWidth = "3/4",
  className,
  delay,
  ...props
}: SkeletonLinesProps) {
  const gapClasses = {
    sm: "space-y-1.5",
    md: "space-y-2",
    lg: "space-y-3",
  };

  const lastWidthClasses = {
    full: "w-full",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "1/2": "w-1/2",
  };

  return (
    <div
      data-slot="skeleton-lines"
      aria-hidden="true"
      className={cn(gapClasses[gap], className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonText
          key={index}
          delay={delay ? delay + index * 50 : undefined}
          className={cn(
            index === count - 1 && lastWidthClasses[lastLineWidth]
          )}
          {...props}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Skeleton Heading
// ============================================================================

function SkeletonHeading({ className, ...props }: SkeletonBoneProps) {
  return (
    <SkeletonBone
      variant="text"
      className={cn("h-6 w-3/4", className)}
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Avatar
// ============================================================================

function SkeletonAvatar({
  size = "md",
  className,
  ...props
}: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <SkeletonBone
      variant="circle"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Button
// ============================================================================

function SkeletonButton({ className, ...props }: SkeletonBoneProps) {
  return (
    <SkeletonBone className={cn("h-9 w-24", className)} {...props} />
  );
}

// ============================================================================
// Skeleton Image
// ============================================================================

function SkeletonImage({
  aspectRatio = "16/9",
  className,
  style,
  ...props
}: SkeletonImageProps) {
  return (
    <SkeletonBone
      className={cn("w-full", className)}
      style={{
        ...style,
        aspectRatio,
      }}
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Card (Composition)
// ============================================================================

function SkeletonCard({ className, ...props }: SkeletonBoneProps) {
  return (
    <div
      data-slot="skeleton-card"
      aria-hidden="true"
      className={cn("space-y-3", className)}
      {...props}
    >
      <SkeletonImage aspectRatio="16/9" />
      <SkeletonHeading />
      <SkeletonLines count={2} lastLineWidth="1/2" />
    </div>
  );
}

// ============================================================================
// Skeleton Table Row
// ============================================================================

interface SkeletonTableRowProps extends SkeletonBoneProps {
  /** Number of columns */
  columns?: number;
}

function SkeletonTableRow({
  columns = 4,
  className,
  delay,
  ...props
}: SkeletonTableRowProps) {
  return (
    <div
      data-slot="skeleton-table-row"
      aria-hidden="true"
      className={cn("flex gap-4", className)}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonBone
          key={index}
          delay={delay ? delay + index * 30 : undefined}
          className="h-4 flex-1"
          {...props}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Skeleton List Item
// ============================================================================

function SkeletonListItem({ className, delay, ...props }: SkeletonBoneProps) {
  return (
    <div
      data-slot="skeleton-list-item"
      aria-hidden="true"
      className={cn("flex items-center gap-3", className)}
    >
      <SkeletonAvatar size="sm" delay={delay} {...props} />
      <div className="flex-1 space-y-2">
        <SkeletonBone
          delay={delay ? delay + 50 : undefined}
          className="h-4 w-3/4"
          {...props}
        />
        <SkeletonBone
          delay={delay ? delay + 100 : undefined}
          className="h-3 w-1/2"
          {...props}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Legacy Skeleton (Backward compatible)
// ============================================================================

interface LegacySkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function SkeletonLegacy({ className, variant, ...props }: LegacySkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      tabIndex={-1}
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    >
      {variant === "shimmer" && (
        <div
          className="absolute inset-0 motion-safe:animate-shimmer motion-reduce:hidden"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Compound Component Export (New API)
// ============================================================================

const SkeletonCompound = Object.assign(SkeletonRoot, {
  Root: SkeletonRoot,
  Bone: SkeletonBone,
  Text: SkeletonText,
  Lines: SkeletonLines,
  Heading: SkeletonHeading,
  Avatar: SkeletonAvatar,
  Button: SkeletonButton,
  Image: SkeletonImage,
  Card: SkeletonCard,
  TableRow: SkeletonTableRow,
  ListItem: SkeletonListItem,
});

// ============================================================================
// Exports
// ============================================================================

export {
  // Legacy simple skeleton (backward compatible) - default export name
  SkeletonLegacy as Skeleton,
  // Compound component (new API) for advanced usage
  SkeletonCompound as SkeletonGroup,
  // Individual components for tree-shaking
  SkeletonRoot,
  SkeletonBone,
  SkeletonText,
  SkeletonLines,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonListItem,
  // Variants
  skeletonVariants,
};

export type {
  SkeletonRootProps,
  SkeletonBoneProps,
  SkeletonLinesProps,
  SkeletonImageProps,
  SkeletonAvatarProps,
  SkeletonTableRowProps,
};
