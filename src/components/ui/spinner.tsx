"use client";

import * as React from "react";
import { animate } from "animejs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-flex shrink-0 animate-spin",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        warning: "text-warning",
        success: "text-success",
        info: "text-info",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface SpinnerProps
  extends React.SVGAttributes<SVGElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", ...props }, ref) => {
    const spinnerRef = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
      const svgRef = ref ? (ref as React.RefObject<SVGSVGElement>) : spinnerRef;
      if (svgRef?.current) {
        animate(svgRef.current, {
          rotate: "360deg",
          duration: 1000,
          easing: "linear",
          loop: true,
        });
      }
    }, [ref]);

    return (
      <svg
        ref={ref || spinnerRef}
        className={cn(spinnerVariants({ size, variant }), className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label}
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
