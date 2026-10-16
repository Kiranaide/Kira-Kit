/* eslint-disable react-refresh/only-export-components */
"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { IconX, IconPlus } from "@tabler/icons-react";

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
    },
  }
);

// Indicator is underline-only: for every other variant the trigger's own
// data-[active] background owns the "pill", so a second fill layer here would
// double the selected treatment. Base UI supplies --active-tab-* on the span.
function TabsIndicatorInternal() {
  const { orientation, variant, color } = useTabsContext();
  const reducedMotion = useReducedMotion();

  if (variant !== "underline") return null;

  const position =
    orientation === "vertical"
      ? "right-0 top-[var(--active-tab-top)] h-[var(--active-tab-height)] w-0.5"
      : "bottom-0 left-[var(--active-tab-left)] w-[var(--active-tab-width)] h-0.5";

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
        !reducedMotion &&
          "animate-in fade-in-0 duration-200 transition-all ease-out",
        position
      )}
    />
  );
}

interface TabsListProps
  extends
    TabsPrimitive.List.Props,
    Omit<VariantProps<typeof tabsListVariants>, "orientation" | "color"> {
  showIndicator?: boolean;
  children: React.ReactNode;
}

function TabsList({
  className,
  variant,
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
          "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-md data-[active]:font-semibold",
        ],
        outline: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary data-[active]:text-foreground data-[active]:font-semibold data-[active]:shadow-md",
        ],
        pills: [
          "text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary data-[active]:text-foreground data-[active]:border-primary data-[active]:font-semibold data-[active]:shadow-md",
        ],
        underline: [
          "text-muted-foreground rounded-none border-b-2 border-transparent -mb-px hover:text-foreground hover:border-muted-foreground/30",
          "data-[active]:text-primary data-[active]:border-primary data-[active]:font-semibold",
        ],
        soft: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary/10 data-[active]:text-foreground data-[active]:font-semibold",
        ],
        card: [
          "text-muted-foreground hover:text-foreground",
          "data-[active]:bg-card data-[active]:text-foreground data-[active]:shadow-lg data-[active]:font-semibold data-[active]:border data-[active]:border-border",
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
        className: "data-[active]:bg-primary data-[active]:text-foreground",
      },
      {
        variant: "outline",
        color: "primary",
        className: "data-[active]:bg-primary data-[active]:text-foreground",
      },
      {
        variant: "pills",
        color: "primary",
        className: "data-[active]:bg-primary data-[active]:text-foreground",
      },
      {
        variant: "soft",
        color: "primary",
        className: "data-[active]:bg-primary/10 data-[active]:text-primary",
      },
      {
        variant: "underline",
        color: "primary",
        className:
          "data-[active]:text-primary data-[active]:border-primary",
      },
      {
        variant: "card",
        color: "primary",
        className:
          "data-[active]:bg-primary data-[active]:text-primary-foreground",
      },

      {
        variant: "default",
        color: "success",
        className: "data-[active]:bg-green-600 data-[active]:text-white",
      },
      {
        variant: "outline",
        color: "success",
        className: "data-[active]:bg-green-600 data-[active]:text-white",
      },
      {
        variant: "pills",
        color: "success",
        className:
          "data-[active]:bg-green-600 data-[active]:text-white data-[active]:border-green-600",
      },
      {
        variant: "soft",
        color: "success",
        className:
          "data-[active]:bg-green-500/10 data-[active]:text-green-600",
      },
      {
        variant: "underline",
        color: "success",
        className:
          "data-[active]:text-green-600 data-[active]:border-green-600",
      },
      {
        variant: "card",
        color: "success",
        className: "data-[active]:bg-green-600 data-[active]:text-white",
      },

      {
        variant: "default",
        color: "warning",
        className: "data-[active]:bg-amber-500 data-[active]:text-white",
      },
      {
        variant: "outline",
        color: "warning",
        className: "data-[active]:bg-amber-500 data-[active]:text-white",
      },
      {
        variant: "pills",
        color: "warning",
        className:
          "data-[active]:bg-amber-500 data-[active]:text-white data-[active]:border-amber-500",
      },
      {
        variant: "soft",
        color: "warning",
        className:
          "data-[active]:bg-amber-500/10 data-[active]:text-amber-600",
      },
      {
        variant: "underline",
        color: "warning",
        className:
          "data-[active]:text-amber-600 data-[active]:border-amber-500",
      },
      {
        variant: "card",
        color: "warning",
        className: "data-[active]:bg-amber-500 data-[active]:text-white",
      },

      {
        variant: "default",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground",
      },
      {
        variant: "outline",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground",
      },
      {
        variant: "pills",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground data-[active]:border-destructive",
      },
      {
        variant: "soft",
        color: "destructive",
        className:
          "data-[active]:bg-destructive/10 data-[active]:text-destructive",
      },
      {
        variant: "underline",
        color: "destructive",
        className:
          "data-[active]:text-destructive data-[active]:border-destructive",
      },
      {
        variant: "card",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground",
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
        <span
          data-slot="tabs-icon"
          className="shrink-0 [&_svg]:h-4 [&_svg]:w-4"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {badge !== undefined && (
        <span
          data-slot="tabs-badge"
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
          data-slot="tabs-close"
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

  // `lazy` uses Base UI's native unmount: the panel is not in the DOM until its
  // tab is first selected, and unmounts again when left. `keepMounted` is the
  // escape hatch for panels that must retain internal state across visits.
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      data-value={value}
      value={value}
      keepMounted={lazy ? false : keepMounted}
      className={cn(tabsContentVariants({ animation, orientation }), className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Panel>
  );
}

interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: "default" | "primary" | "destructive" | "success" | "warning";
  content?: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
}

interface KiraTabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsListVariant;
  color?: TabsTriggerColor;
  orientation?: "horizontal" | "vertical";
  showIndicator?: boolean;
  animation?: TabsContentProps["animation"];
  lazy?: boolean;
  /** Show a trailing "+" button. Return a new TabItem to append & select it. */
  addable?: boolean;
  onAdd?: () => TabItem | void;
  onClose?: (value: string) => void;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

/**
 * Prop-driven Tabs: pass an `items` array and get the full family wired up,
 * including optional closable tabs (auto-selects a neighbour on close) and an
 * add-tab (+) button. Built from the primitives above — no duplicated styling.
 */
function KiraTabs({
  items: itemsProp,
  value,
  defaultValue,
  onValueChange,
  variant = "default",
  color = "default",
  orientation = "horizontal",
  showIndicator = true,
  animation = "fade",
  lazy = false,
  addable = false,
  onAdd,
  onClose,
  className,
  listClassName,
  contentClassName,
}: KiraTabsProps) {
  // Own the item list so closable/addable can mutate it. When the parent passes
  // a fresh `itemsProp`, adopt it (adjust-on-prop-change via a render-time state
  // prev-value, not an effect — react-compiler safe).
  const [items, setItems] = React.useState(itemsProp);
  const [prevItemsProp, setPrevItemsProp] = React.useState(itemsProp);

  if (itemsProp !== prevItemsProp) {
    setPrevItemsProp(itemsProp);
    setItems(itemsProp);
  }

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? itemsProp[0]?.value
  );

  const activeValue = isControlled ? value : internalValue;

  const selectValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const handleClose = (closedValue: string) => {
    const idx = items.findIndex((i) => i.value === closedValue);
    const next = items.filter((i) => i.value !== closedValue);

    // If the active tab was closed, move to a neighbour.
    if (activeValue === closedValue && next.length > 0) {
      const neighbour = next[Math.max(0, idx - 1)];
      selectValue(neighbour.value);
    }

    setItems(next);
    onClose?.(closedValue);
  };

  const handleAdd = () => {
    const created = onAdd?.();

    if (created) {
      setItems((prev) => [...prev, created]);
      selectValue(created.value);
    }
  };

  return (
    <Tabs
      value={activeValue}
      onValueChange={selectValue}
      variant={variant}
      color={color}
      orientation={orientation}
      showIndicator={showIndicator}
      className={className}
    >
      <TabsList className={listClassName}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            icon={item.icon}
            badge={item.badge}
            badgeColor={item.badgeColor}
            disabled={item.disabled}
            closable={item.closable}
            onClose={handleClose}
          >
            {item.label}
          </TabsTrigger>
        ))}
        {addable && (
          <button
            data-slot="tabs-add"
            type="button"
            onClick={handleAdd}
            aria-label="Add tab"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1.5 shrink-0",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors duration-150"
            )}
          >
            <IconPlus className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          animation={animation}
          lazy={lazy}
          className={contentClassName}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  KiraTabs,
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
  TabItem,
  KiraTabsProps,
};
