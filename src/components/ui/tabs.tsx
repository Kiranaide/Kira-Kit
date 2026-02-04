"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

interface TabsContextValue {
  orientation: "horizontal" | "vertical";
  variant: TabsListVariant;
  color: TabsTriggerColor;
  showIndicator: boolean;
}

const TabsContext = React.createContext<TabsContextValue>({
  orientation: "horizontal",
  variant: "default",
  color: "default",
  showIndicator: true,
});

function useTabsContext() {
  return React.useContext(TabsContext);
}

type TabsListVariant =
  | "default"
  | "outline"
  | "pills"
  | "underline"
  | "soft"
  | "card";
type TabsTriggerColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive";

interface TabsProps extends TabsPrimitive.Root.Props {
  orientation?: "horizontal" | "vertical";
  variant?: TabsListVariant;
  color?: TabsTriggerColor;
  showIndicator?: boolean;
}

function Tabs({
  orientation = "horizontal",
  variant = "default",
  color = "default",
  showIndicator = true,
  ...props
}: TabsProps) {
  return (
    <TabsContext.Provider
      value={{ orientation, variant, color, showIndicator }}
    >
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        {...props}
      />
    </TabsContext.Provider>
  );
}

const tabsListVariants = cva(
  [
    "inline-flex items-center justify-start text-muted-foreground relative",
    "transition-colors duration-200",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted rounded-lg p-1",
        outline: "border border-border bg-transparent rounded-lg p-1",
        pills: "bg-transparent gap-1",
        underline:
          "bg-transparent gap-1 rounded-none p-0 border-b border-border",
        soft: "bg-transparent gap-1",
        card: "bg-muted/30 rounded-lg gap-1 p-1",
      },
      color: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-stretch",
      },
      scrollable: {
        true: "overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "underline",
        orientation: "vertical",
        className: "border-b-0 border-r border-border",
      },

      {
        variant: "default",
        color: "primary",
        className: "bg-primary/10",
      },
      {
        variant: "default",
        color: "success",
        className: "bg-green-500/10",
      },
      {
        variant: "default",
        color: "warning",
        className: "bg-amber-500/10",
      },
      {
        variant: "default",
        color: "destructive",
        className: "bg-destructive/10",
      },

      {
        variant: "outline",
        color: "primary",
        className: "border-primary/30 bg-primary/5",
      },
      {
        variant: "outline",
        color: "success",
        className: "border-green-500/30 bg-green-500/5",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-amber-500/30 bg-amber-500/5",
      },
      {
        variant: "outline",
        color: "destructive",
        className: "border-destructive/30 bg-destructive/5",
      },
      {
        variant: "card",
        color: "primary",
        className: "bg-primary/10",
      },
      {
        variant: "card",
        color: "success",
        className: "bg-green-500/10",
      },
      {
        variant: "card",
        color: "warning",
        className: "bg-amber-500/10",
      },
      {
        variant: "card",
        color: "destructive",
        className: "bg-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      orientation: "horizontal",
      scrollable: false,
    },
  }
);

function TabsIndicatorInternal() {
  const { orientation, variant, color } = useTabsContext();

  const isUnderline = variant === "underline";
  const isFill = !isUnderline;

  const effectivePosition =
    orientation === "vertical"
      ? isUnderline
        ? "right"
        : "fill"
      : isUnderline
        ? "bottom"
        : "fill";

  const positionClasses = {
    bottom:
      "bottom-0 left-[var(--active-tab-left)] w-[var(--active-tab-width)] h-0.5",
    top: "top-0 left-[var(--active-tab-left)] w-[var(--active-tab-width)] h-0.5",
    left: "left-0 top-[var(--active-tab-top)] h-[var(--active-tab-height)] w-0.5",
    right:
      "right-0 top-[var(--active-tab-top)] h-[var(--active-tab-height)] w-0.5",
    fill: [
      "left-[var(--active-tab-left)]",
      "top-[var(--active-tab-top)]",
      "w-[var(--active-tab-width)]",
      "h-[var(--active-tab-height)]",
      "rounded-md",
      "opacity-80",
    ].join(" "),
  };

  const colorClasses = {
    default: isFill ? "bg-primary/10" : "bg-primary",
    primary: isFill ? "bg-primary/10" : "bg-primary",
    success: isFill ? "bg-green-600/10" : "bg-green-600",
    warning: isFill ? "bg-amber-500/10" : "bg-amber-500",
    destructive: isFill ? "bg-destructive/10" : "bg-destructive",
  };

  const shapeClasses = isUnderline
    ? ""
    : "border border-border/50 shadow-sm backdrop-blur-sm pointer-events-none z-0";

  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute",
        colorClasses[color],

        "animate-in fade-in-0 duration-200",
        "transition-all duration-200 ease-out",
        "motion-reduce:transition-none motion-reduce:animate-none",
        positionClasses[effectivePosition],
        shapeClasses
      )}
    />
  );
}

interface TabsListProps
  extends
    TabsPrimitive.List.Props,
    Omit<VariantProps<typeof tabsListVariants>, "orientation" | "color"> {
  scrollable?: boolean;
  showIndicator?: boolean;
  children: React.ReactNode;
}

function TabsList({
  className,
  variant,
  scrollable = false,
  showIndicator: showIndicatorProp,
  children,
  ...props
}: TabsListProps) {
  const {
    orientation,
    variant: contextVariant,
    color,
    showIndicator: contextShowIndicator,
  } = useTabsContext();
  const finalVariant = variant ?? contextVariant;
  const shouldShowIndicator = showIndicatorProp ?? contextShowIndicator;

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-orientation={orientation}
      className={cn(
        tabsListVariants({
          variant: finalVariant,
          color,
          orientation,
          scrollable,
        }),
        className
      )}
      {...props}
    >
      {children}
      {shouldShowIndicator && <TabsIndicatorInternal />}
    </TabsPrimitive.List>
  );
}

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap gap-2",
    "rounded-md px-3 py-1.5 text-sm font-medium",
    "relative z-10",
    "transition-all duration-200",
    "motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "min-h-[44px] sm:min-h-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-muted-foreground hover:text-foreground",

          "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-md data-[selected]:font-semibold",
          "data-[state=selected]:bg-background data-[state=selected]:text-foreground data-[state=selected]:shadow-md data-[state=selected]:font-semibold",
        ],
        outline: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[selected]:bg-primary data-[selected]:text-foreground data-[selected]:font-semibold data-[selected]:shadow-md",
          "data-[state=selected]:bg-primary data-[state=selected]:text-foreground data-[state=selected]:font-semibold data-[state=selected]:shadow-md",
        ],
        pills: [
          "text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/50",
          "data-[selected]:bg-primary data-[selected]:text-foreground data-[selected]:border-primary data-[selected]:font-semibold data-[selected]:shadow-md",
          "data-[state=selected]:bg-primary data-[state=selected]:text-foreground data-[state=selected]:border-primary data-[state=selected]:font-semibold data-[state=selected]:shadow-md",
        ],
        underline: [
          "text-muted-foreground rounded-none border-b-2 border-transparent -mb-px hover:text-foreground hover:border-muted-foreground/30",
          "data-[selected]:text-primary data-[selected]:border-primary data-[selected]:font-semibold",
          "data-[state=selected]:text-primary data-[state=selected]:border-primary data-[state=selected]:font-semibold",
        ],
        soft: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[selected]:bg-primary/10 data-[selected]:text-foreground data-[selected]:font-semibold",
          "data-[state=selected]:bg-primary/10 data-[state=selected]:text-foreground data-[state=selected]:font-semibold",
        ],
        card: [
          "text-muted-foreground hover:text-foreground",
          "data-[selected]:bg-card data-[selected]:text-foreground data-[selected]:shadow-lg data-[selected]:font-semibold data-[selected]:border data-[selected]:border-border",
          "data-[state=selected]:bg-card data-[state=selected]:text-foreground data-[state=selected]:shadow-lg data-[state=selected]:font-semibold data-[state=selected]:border data-[state=selected]:border-border",
        ],
      },
      color: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start w-full",
      },
    },
    compoundVariants: [
      {
        variant: "underline",
        orientation: "vertical",
        className: "border-b-0 border-r-2 -mr-px mb-0",
      },

      {
        variant: "default",
        color: "primary",
        className:
          "data-[selected]:bg-primary data-[selected]:text-foreground data-[state=selected]:bg-primary data-[state=selected]:text-foreground",
      },
      {
        variant: "outline",
        color: "primary",
        className:
          "data-[selected]:bg-primary data-[selected]:text-foreground data-[state=selected]:bg-primary data-[state=selected]:text-foreground",
      },
      {
        variant: "pills",
        color: "primary",
        className:
          "data-[selected]:bg-primary data-[selected]:text-foreground data-[state=selected]:bg-primary data-[state=selected]:text-foreground",
      },
      {
        variant: "soft",
        color: "primary",
        className: "data-[selected]:bg-primary/10 data-[selected]:text-primary",
      },
      {
        variant: "underline",
        color: "primary",
        className:
          "data-[selected]:text-primary data-[selected]:border-primary",
      },
      {
        variant: "card",
        color: "primary",
        className:
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
      },

      {
        variant: "default",
        color: "success",
        className: "data-[selected]:bg-green-600 data-[selected]:text-white",
      },
      {
        variant: "outline",
        color: "success",
        className: "data-[selected]:bg-green-600 data-[selected]:text-white",
      },
      {
        variant: "pills",
        color: "success",
        className:
          "data-[selected]:bg-green-600 data-[selected]:text-white data-[selected]:border-green-600",
      },
      {
        variant: "soft",
        color: "success",
        className:
          "data-[selected]:bg-green-500/10 data-[selected]:text-green-600",
      },
      {
        variant: "underline",
        color: "success",
        className:
          "data-[selected]:text-green-600 data-[selected]:border-green-600",
      },
      {
        variant: "card",
        color: "success",
        className: "data-[selected]:bg-green-600 data-[selected]:text-white",
      },

      {
        variant: "default",
        color: "warning",
        className: "data-[selected]:bg-amber-500 data-[selected]:text-white",
      },
      {
        variant: "outline",
        color: "warning",
        className: "data-[selected]:bg-amber-500 data-[selected]:text-white",
      },
      {
        variant: "pills",
        color: "warning",
        className:
          "data-[selected]:bg-amber-500 data-[selected]:text-white data-[selected]:border-amber-500",
      },
      {
        variant: "soft",
        color: "warning",
        className:
          "data-[selected]:bg-amber-500/10 data-[selected]:text-amber-600",
      },
      {
        variant: "underline",
        color: "warning",
        className:
          "data-[selected]:text-amber-600 data-[selected]:border-amber-500",
      },
      {
        variant: "card",
        color: "warning",
        className: "data-[selected]:bg-amber-500 data-[selected]:text-white",
      },

      {
        variant: "default",
        color: "destructive",
        className:
          "data-[selected]:bg-destructive data-[selected]:text-destructive-foreground",
      },
      {
        variant: "outline",
        color: "destructive",
        className:
          "data-[selected]:bg-destructive data-[selected]:text-destructive-foreground",
      },
      {
        variant: "pills",
        color: "destructive",
        className:
          "data-[selected]:bg-destructive data-[selected]:text-destructive-foreground data-[selected]:border-destructive",
      },
      {
        variant: "soft",
        color: "destructive",
        className:
          "data-[selected]:bg-destructive/10 data-[selected]:text-destructive",
      },
      {
        variant: "underline",
        color: "destructive",
        className:
          "data-[selected]:text-destructive data-[selected]:border-destructive",
      },
      {
        variant: "card",
        color: "destructive",
        className:
          "data-[selected]:bg-destructive data-[selected]:text-destructive-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      orientation: "horizontal",
    },
  }
);

interface TabsTriggerProps
  extends
    Omit<TabsPrimitive.Tab.Props, "children">,
    Omit<VariantProps<typeof tabsTriggerVariants>, "orientation"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: "default" | "primary" | "destructive" | "success" | "warning";
  closable?: boolean;
  onClose?: (value: string) => void;
}

function TabsTrigger({
  className,
  variant,
  color,
  icon,
  badge,
  badgeColor = "default",
  closable = false,
  onClose,
  value,
  children,
  ...props
}: TabsTriggerProps) {
  const {
    orientation,
    variant: contextVariant,
    color: contextColor,
  } = useTabsContext();
  const finalVariant = variant ?? contextVariant;
  const finalColor = color ?? contextColor;

  const badgeColorClasses = {
    default: "bg-muted-foreground/20 text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-green-600 text-white",
    warning: "bg-amber-500 text-white",
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose?.(value as string);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (closable && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();
      onClose?.(value as string);
    }
  };

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      value={value}
      onKeyDown={handleKeyDown}
      className={cn(
        tabsTriggerVariants({
          variant: finalVariant,
          color: finalColor,
          orientation,
        }),
        closable && "pe-2",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium min-w-5",
            badgeColorClasses[badgeColor]
          )}
        >
          {badge}
        </span>
      )}
      {closable && (
        <button
          type="button"
          aria-label={`Close ${typeof children === "string" ? children : "tab"}`}
          onClick={handleClose}
          className={cn(
            "ms-1 rounded-full p-0.5 shrink-0",
            "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors duration-150"
          )}
        >
          <IconX className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </TabsPrimitive.Tab>
  );
}

const tabsContentVariants = cva(
  [
    "ring-offset-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      animation: {
        none: "",
        fade: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200",
        slide:
          "motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:fade-in-0 motion-safe:duration-300",
        slideUp:
          "motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in-0 motion-safe:duration-300",
        zoom: "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in-0 motion-safe:duration-200",
      },
      orientation: {
        horizontal: "mt-2",
        vertical: "ms-4 mt-0",
      },
    },
    defaultVariants: {
      animation: "fade",
      orientation: "horizontal",
    },
  }
);

interface TabsContentProps
  extends
    TabsPrimitive.Panel.Props,
    Omit<VariantProps<typeof tabsContentVariants>, "orientation"> {
  lazy?: boolean;

  keepMounted?: boolean;
}

function TabsContent({
  className,
  animation,
  lazy = false,
  keepMounted = true,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { orientation } = useTabsContext();
  const [hasBeenActive, setHasBeenActive] = React.useState(false);

  React.useEffect(() => {
    const checkActive = () => {
      const panel = document.querySelector(
        `[data-slot="tabs-content"][data-value="${value}"]`
      );
      if (panel && !panel.hasAttribute("hidden")) {
        setHasBeenActive(true);
      }
    };

    checkActive();
    const observer = new MutationObserver(checkActive);
    const panel = document.querySelector(
      `[data-slot="tabs-content"][data-value="${value}"]`
    );
    if (panel) {
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    }

    return () => observer.disconnect();
  }, [value]);

  const shouldRender = !lazy || hasBeenActive;

  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      data-value={value}
      value={value}
      keepMounted={keepMounted}
      className={cn(tabsContentVariants({ animation, orientation }), className)}
      {...props}
    >
      {shouldRender ? children : null}
    </TabsPrimitive.Panel>
  );
}

interface TabsIndicatorProps extends TabsPrimitive.Indicator.Props {
  position?: "bottom" | "top" | "left" | "right";
}

function TabsIndicator({ className, position, ...props }: TabsIndicatorProps) {
  const { orientation, variant, color } = useTabsContext();

  const effectivePosition =
    position ??
    (orientation === "vertical"
      ? variant === "underline"
        ? "right"
        : "left"
      : variant === "underline"
        ? "bottom"
        : "bottom");

  const positionClasses = {
    bottom:
      "bottom-0 left-[var(--active-tab-left)] w-[var(--active-tab-width)] h-0.5",
    top: "top-0 left-[var(--active-tab-left)] w-[var(--active-tab-width)] h-0.5",
    left: "left-0 top-[var(--active-tab-top)] h-[var(--active-tab-height)] w-0.5",
    right:
      "right-0 top-[var(--active-tab-top)] h-[var(--active-tab-height)] w-0.5",
  };

  const colorClasses = {
    default: "bg-primary",
    primary: "bg-primary",
    success: "bg-green-600",
    warning: "bg-amber-500",
    destructive: "bg-destructive",
  };

  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute",
        colorClasses[color],

        "animate-in fade-in-0 duration-200",
        "transition-all duration-200 ease-out",
        "motion-reduce:transition-none motion-reduce:animate-none",
        positionClasses[effectivePosition],
        className
      )}
      {...props}
    />
  );
}

interface TabsScrollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right" | "up" | "down";
  visible?: boolean;
}

function TabsScrollButton({
  direction,
  visible = true,
  className,
  ...props
}: TabsScrollButtonProps) {
  if (!visible) return null;

  const isHorizontal = direction === "left" || direction === "right";
  const isStart = direction === "left" || direction === "up";

  return (
    <button
      type="button"
      aria-label={`Scroll ${direction}`}
      className={cn(
        "absolute z-10 flex items-center justify-center",
        "w-8 h-full bg-linear-to-r from-background to-transparent",
        isHorizontal ? "top-0" : "left-0",
        isStart
          ? isHorizontal
            ? "left-0"
            : "top-0"
          : isHorizontal
            ? "right-0 rotate-180"
            : "bottom-0 rotate-180",
        "opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity",
        className
      )}
      {...props}
    >
      <svg
        className="h-4 w-4 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  TabsScrollButton,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
  useTabsContext,
};

export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsIndicatorProps,
  TabsScrollButtonProps,
};
