import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Separator variant styles
 * @see {@link SeparatorProps} for usage
 */
const separatorVariants = cva(
  "shrink-0 data-[orientation=horizontal]:w-full data-[orientation=vertical]:self-stretch",
  {
    variants: {
      /** Thickness of the separator */
      size: {
        xs: "data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
        sm: "data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
        default:
          "data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
        md: "data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5",
        lg: "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1",
        xl: "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
      },
      /** Line style - solid uses background, dashed/dotted use borders */
      lineStyle: {
        solid: "bg-border",
        dashed:
          "bg-transparent border-0 border-t border-dashed border-border data-[orientation=vertical]:border-t-0 data-[orientation=vertical]:border-l",
        dotted:
          "bg-transparent border-0 border-t border-dotted border-border data-[orientation=vertical]:border-t-0 data-[orientation=vertical]:border-l",
        gradient: "bg-gradient-to-r from-border/0 via-border to-border/0",
      },
      /** Custom gradient type */
      gradient: {
        none: "",
        fade: "from-border/0 via-border to-border/0",
        primary: "from-primary/0 via-primary to-primary/0",
        rainbow:
          "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
      },
      /** Animation type */
      animated: {
        none: "",
        pulse: "animate-pulse",
        shimmer: "animate-[shimmer_2s_infinite]",
      },
      /** Color of the separator */
      color: {
        default: "",
        primary: "",
        secondary: "",
        muted: "",
        destructive: "",
        success: "",
        warning: "",
        info: "",
      },
    },
    compoundVariants: [
      // Solid color variants
      { lineStyle: "solid", color: "default", className: "bg-border" },
      { lineStyle: "solid", color: "primary", className: "bg-primary" },
      { lineStyle: "solid", color: "secondary", className: "bg-secondary" },
      { lineStyle: "solid", color: "muted", className: "bg-muted" },
      { lineStyle: "solid", color: "destructive", className: "bg-destructive" },
      { lineStyle: "solid", color: "success", className: "bg-success" },
      { lineStyle: "solid", color: "warning", className: "bg-warning" },
      { lineStyle: "solid", color: "info", className: "bg-info" },
      // Gradient variants (ensure bg-gradient is applied)
      {
        lineStyle: "gradient",
        gradient: "fade",
        className:
          "bg-gradient-to-r data-[orientation=vertical]:bg-gradient-to-b",
      },
      {
        lineStyle: "gradient",
        gradient: "primary",
        className:
          "bg-gradient-to-r data-[orientation=vertical]:bg-gradient-to-b",
      },
      {
        lineStyle: "gradient",
        gradient: "rainbow",
        className:
          "bg-gradient-to-r data-[orientation=vertical]:bg-gradient-to-b",
      },
      // Dashed/dotted color variants (use border-color)
      { lineStyle: "dashed", color: "default", className: "border-border" },
      { lineStyle: "dashed", color: "primary", className: "border-primary" },
      {
        lineStyle: "dashed",
        color: "secondary",
        className: "border-secondary",
      },
      { lineStyle: "dashed", color: "muted", className: "border-muted" },
      {
        lineStyle: "dashed",
        color: "destructive",
        className: "border-destructive",
      },
      { lineStyle: "dashed", color: "success", className: "border-success" },
      { lineStyle: "dashed", color: "warning", className: "border-warning" },
      { lineStyle: "dashed", color: "info", className: "border-info" },
      { lineStyle: "dotted", color: "default", className: "border-border" },
      { lineStyle: "dotted", color: "primary", className: "border-primary" },
      {
        lineStyle: "dotted",
        color: "secondary",
        className: "border-secondary",
      },
      { lineStyle: "dotted", color: "muted", className: "border-muted" },
      {
        lineStyle: "dotted",
        color: "destructive",
        className: "border-destructive",
      },
      { lineStyle: "dotted", color: "success", className: "border-success" },
      { lineStyle: "dotted", color: "warning", className: "border-warning" },
      { lineStyle: "dotted", color: "info", className: "border-info" },
    ],
    defaultVariants: {
      size: "default",
      lineStyle: "solid",
      color: "default",
      gradient: "none",
      animated: "none",
    },
  },
);

/**
 * Separator component props
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator lineStyle="dashed" color="primary" />
 * <Separator label="Or continue with" />
 * <Separator lineStyle="gradient" gradient="primary" />
 * ```
 */
export interface SeparatorProps
  extends SeparatorPrimitive.Props, VariantProps<typeof separatorVariants> {
  /** Label content to display in the separator */
  label?: React.ReactNode;
  /** Alignment of the label */
  labelAlign?: "start" | "center" | "end";
  /** Icon to display alongside the label */
  labelIcon?: React.ReactNode;
  /** Position of the label icon */
  labelIconPosition?: "left" | "right";
  /** Spacing around the separator */
  spacing?: "none" | "sm" | "default" | "lg";
  /** Whether the separator is purely decorative (aria-hidden) */
  decorative?: boolean;
}

/**
 * Visual separator for dividing content sections
 */
export function Separator({
  className,
  orientation = "horizontal",
  size,
  lineStyle = "solid",
  color = "default",
  gradient,
  animated,
  label,
  labelAlign = "center",
  labelIcon,
  labelIconPosition = "left",
  spacing,
  decorative,
  ...props
}: SeparatorProps) {
  // Spacing classes for margin
  const spacingClasses = {
    none: "",
    sm: orientation === "horizontal" ? "my-2" : "mx-2",
    default: orientation === "horizontal" ? "my-4" : "mx-4",
    lg: orientation === "horizontal" ? "my-6" : "mx-6",
  };

  const semanticProps = decorative
    ? { role: "none", "aria-hidden": true }
    : { role: "separator", "aria-orientation": orientation };

  if (label) {
    const showLeftLine = labelAlign === "end" || labelAlign === "center";
    const showRightLine = labelAlign === "start" || labelAlign === "center";

    return (
      <div
        data-slot="separator"
        {...semanticProps}
        className={cn(
          "flex items-center gap-3 w-full",
          orientation === "vertical" && "flex-col h-full w-auto",
          spacing && spacingClasses[spacing],
          className,
        )}
      >
        {showLeftLine && (
          <SeparatorPrimitive
            aria-hidden="true"
            orientation={orientation}
            className={cn(
              separatorVariants({
                size,
                lineStyle,
                color,
                gradient,
                animated,
              }),
              "overflow-hidden",
              orientation === "horizontal" && "flex-1",
              orientation === "vertical" && "flex-1 min-h-4 w-px",
            )}
            data-orientation={orientation}
          />
        )}
        <span
          className={cn(
            "flex items-center text-xs text-muted-foreground uppercase tracking-wider font-medium whitespace-nowrap px-2 select-none",
            orientation === "vertical" && "py-1",
          )}
        >
          {labelIcon && labelIconPosition === "left" && (
            <span className="mr-2">{labelIcon}</span>
          )}
          {label}
          {labelIcon && labelIconPosition === "right" && (
            <span className="ml-2">{labelIcon}</span>
          )}
        </span>
        {showRightLine && (
          <SeparatorPrimitive
            aria-hidden="true"
            orientation={orientation}
            className={cn(
              separatorVariants({
                size,
                lineStyle,
                color,
                gradient,
                animated,
              }),
              "overflow-hidden",
              orientation === "horizontal" && "flex-1",
              orientation === "vertical" && "flex-1 min-h-4 w-px",
            )}
            data-orientation={orientation}
          />
        )}
      </div>
    );
  }

  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        separatorVariants({ size, lineStyle, color, gradient, animated }),
        spacing && spacingClasses[spacing],
        "overflow-hidden",
        className,
      )}
      data-orientation={orientation}
      {...props}
      {...(decorative ? { decorative: true } : {})}
    />
  );
}

export { separatorVariants };
