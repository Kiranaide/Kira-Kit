import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("rounded-md bg-muted", {
  variants: {
    variant: {
      default: "animate-pulse",
      circle: "rounded-full animate-pulse",
      text: "h-4 w-full animate-pulse",
      shimmer: "relative overflow-hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    >
      {variant === "shimmer" && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 via-white/20 via-white/10 to-transparent"
          style={{
            width: "100%",
            height: "100%",
            animation: "shimmer 2s linear infinite",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}

// Preset skeleton components
function SkeletonText({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton variant="text" className={cn("h-4", className)} {...props} />
  );
}

function SkeletonHeading({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      variant="text"
      className={cn("h-6 w-3/4", className)}
      {...props}
    />
  );
}

function SkeletonAvatar({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      variant="circle"
      className={cn("h-10 w-10", className)}
      {...props}
    />
  );
}

function SkeletonButton({ className, ...props }: SkeletonProps) {
  return <Skeleton className={cn("h-9 w-24", className)} {...props} />;
}

function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  skeletonVariants,
};
