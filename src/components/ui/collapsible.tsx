"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronDown } from "@tabler/icons-react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

const collapsibleTriggerVariants = cva(
  "flex items-center justify-between w-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        info: "bg-info/10 text-info dark:text-info hover:bg-info/20",
        success:
          "bg-success/10 text-success dark:text-success hover:bg-success/20",
        warning:
          "bg-warning/10 text-warning dark:text-warning hover:bg-warning/20",
        destructive:
          "bg-destructive/10 text-destructive dark:text-destructive hover:bg-destructive/20",
        ghost: "hover:bg-muted/30",
        outline: "border border-border hover:bg-muted/30",
        link: "hover:underline text-primary",
      },
      size: {
        xs: "py-1.5 px-3 text-xs rounded-md",
        sm: "py-2 px-3.5 text-xs rounded-md",
        default: "py-3 px-4 text-sm rounded-lg",
        lg: "py-4 px-5 text-base rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type CollapsibleRootProps = React.ComponentProps<
  typeof CollapsiblePrimitive.Root
>;

function Collapsible({ className, ...props }: CollapsibleRootProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

type CollapsibleTriggerProps = Omit<
  CollapsiblePrimitive.Trigger.Props,
  "children"
> & {
  children?: React.ReactNode;
  variant?: VariantProps<typeof collapsibleTriggerVariants>["variant"];
  size?: VariantProps<typeof collapsibleTriggerVariants>["size"];
  showArrow?: boolean;
  chevronIcon?: React.ReactNode;
  chevronPosition?: "start" | "end";
  icon?: React.ReactNode;
};

function CollapsibleTrigger({
  className,
  children,
  variant,
  size,
  showArrow = true,
  chevronIcon,
  chevronPosition = "end",
  icon,
  ...props
}: CollapsibleTriggerProps) {
  const defaultChevron = (
    <IconChevronDown
      data-collapsible-chevron
      className="h-4 w-4 transition-transform duration-300 ease-out in-data-panel-open:rotate-180"
    />
  );

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleTriggerVariants({ variant, size, className }))}
      {...props}
    >
      <span className="flex items-center gap-2 flex-1 min-w-0">
        {chevronPosition === "start" && (showArrow || chevronIcon) && (
          <span className="shrink-0">{chevronIcon || defaultChevron}</span>
        )}
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}
        <span className="flex-1 min-w-0 truncate">{children}</span>
        {chevronPosition === "end" && (showArrow || chevronIcon) && (
          <span className="shrink-0">{chevronIcon || defaultChevron}</span>
        )}
      </span>
    </CollapsiblePrimitive.Trigger>
  );
}

const collapsibleContentVariants = cva("", {
  variants: {
    size: {
      xs: "px-3 py-1.5 text-xs",
      sm: "px-3.5 py-2 text-xs",
      default: "px-4 py-3 text-sm",
      lg: "px-5 py-4 text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type CollapsibleContentProps = Omit<
  CollapsiblePrimitive.Panel.Props,
  "children"
> & {
  children?: React.ReactNode;
  inset?: boolean;
  lazyMount?: boolean;
  showSkeleton?: boolean;
  skeletonLines?: number;
  size?: "xs" | "sm" | "default" | "lg";
};

function CollapsibleContent({
  className,
  children,
  inset = false,
  lazyMount = false,
  showSkeleton = false,
  skeletonLines = 3,
  size = "default",
  ...props
}: CollapsibleContentProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [hasBeenOpened, setHasBeenOpened] = React.useState(false);
  const animationRef = React.useRef<gsap.core.Tween | null>(null);

  React.useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;

    if (!panel || !content) return;

    let prevOpen = panel.hasAttribute("data-open");

    if (prevOpen) {
      panel.style.height = "auto";
      panel.style.opacity = "1";
      setHasBeenOpened(true);
    } else {
      panel.style.height = "0";
      panel.style.opacity = "0";
    }

    const handleStateChange = () => {
      const isOpen = panel.hasAttribute("data-open");

      if (isOpen === prevOpen) return;

      if (animationRef.current) {
        animationRef.current.pause();
        animationRef.current = null;
      }

      const contentHeight = content.scrollHeight;

      if (isOpen) {
        setHasBeenOpened(true);
        animationRef.current = gsap.fromTo(
          panel,
          { height: 0, opacity: 0 },
          {
            height: contentHeight,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(panel, { height: "auto" });
            },
          }
        );
      } else {
        gsap.set(panel, { height: contentHeight });
        void panel.offsetHeight;
        animationRef.current = gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      prevOpen = isOpen;
    };

    const observer = new MutationObserver(handleStateChange);
    observer.observe(panel, {
      attributes: true,
      attributeFilter: ["data-open", "data-closed"],
    });

    return () => {
      observer.disconnect();

      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const skeletonWidths = React.useMemo(() => {
    const widths = ["75%", "85%", "60%", "90%", "70%"];

    return Array.from({ length: skeletonLines }).map(
      (_, i) => widths[i % widths.length]
    );
  }, [skeletonLines]);

  const skeleton = (
    <div className="space-y-2 px-4 py-3">
      {skeletonWidths.map((width, i) => (
        <div
          key={i}
          className="h-3 bg-muted rounded animate-pulse"
          style={{ width }}
        />
      ))}
    </div>
  );

  const shouldRenderChildren = !lazyMount || hasBeenOpened;

  const renderContent = shouldRenderChildren
    ? children
    : showSkeleton
      ? skeleton
      : null;

  return (
    <CollapsiblePrimitive.Panel
      ref={panelRef}
      data-slot="collapsible-panel"
      keepMounted
      className={cn("overflow-hidden", inset && "pl-8", className)}
      style={{
        height: 0,
        opacity: 0,
      }}
      {...props}
    >
      <div
        ref={contentRef}
        className={cn(collapsibleContentVariants({ size }))}
      >
        {renderContent}
      </div>
    </CollapsiblePrimitive.Panel>
  );
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleTriggerVariants,
};

export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
};
