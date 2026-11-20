import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const routeTransitionVariants = cva("", {
  variants: {
    variant: {
      fade: "animate-route-fade motion-reduce:animate-none",
      "fade-up": "animate-route-fade-up motion-reduce:animate-none",
      "fade-down": "animate-route-fade-down motion-reduce:animate-none",
      "slide-left": "animate-route-slide-left motion-reduce:animate-none",
      "slide-right": "animate-route-slide-right motion-reduce:animate-none",
      zoom: "animate-route-zoom motion-reduce:animate-none",
      none: "",
    },
  },
  defaultVariants: { variant: "fade" },
});

interface RouteTransitionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof routeTransitionVariants> {
  /** Changing this key remounts the wrapper and replays the entrance, e.g. the router pathname. */
  transitionKey?: React.Key;
}

function RouteTransition({
  className,
  variant,
  transitionKey,
  ...props
}: RouteTransitionProps) {
  return (
    <div
      key={transitionKey}
      data-slot="route-transition"
      className={cn(routeTransitionVariants({ variant }), className)}
      {...props}
    />
  );
}

type NavigationProgressPhase = "idle" | "loading" | "finishing";

// Fast navigations never flash a bar; only loads that outlive the grace period show one.
const SHOW_DELAY_MS = 120;
const FINISH_DURATION_MS = 320;

interface NavigationProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether a navigation is in flight. The bar completes and fades out when this flips back to false. */
  active: boolean;
}

function NavigationProgress({
  active,
  className,
  style,
  ...props
}: NavigationProgressProps) {
  const [phase, setPhase] = React.useState<NavigationProgressPhase>("idle");

  React.useEffect(() => {
    if (!active) {
      // oxlint-disable-next-line react/set-state-in-effect -- the phase machine mirrors the active prop; one transition render per navigation, never per frame.
      setPhase((current) => (current === "loading" ? "finishing" : current));

      return;
    }

    const timer = setTimeout(() => setPhase("loading"), SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [active]);

  React.useEffect(() => {
    if (phase !== "finishing") return;

    const timer = setTimeout(() => setPhase("idle"), FINISH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      data-slot="navigation-progress"
      data-state={phase}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a native <progress> cannot express the transform-driven trickle or its completion retarget.
      role="progressbar"
      aria-label="Loading page"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary drop-shadow-[0_0_6px_var(--primary)]",
        phase === "loading" && "animate-nav-progress",
        className,
      )}
      style={
        phase === "finishing"
          ? {
              // Retargets from the in-flight trickle value to full width, then fades.
              animation: "none",
              transform: "scaleX(1)",
              opacity: 0,
              transition:
                "transform 150ms cubic-bezier(0.23, 1, 0.32, 1), opacity 150ms cubic-bezier(0.23, 1, 0.32, 1) 150ms",
              ...style,
            }
          : style
      }
      {...props}
    />
  );
}

export { RouteTransition, NavigationProgress, routeTransitionVariants };
