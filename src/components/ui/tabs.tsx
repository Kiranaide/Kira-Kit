/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAnnounce } from "@/hooks/use-announce";
import {
  DropdownMenuItem,
  DropdownMenuWithContent,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconDots,
  IconGripVertical,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

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
  "default" | "outline" | "pills" | "underline" | "soft" | "card" | "segment";

type TabsTriggerColor =
  "default" | "primary" | "success" | "warning" | "destructive";

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
        segment: "bg-transparent gap-1 rounded-full p-1",
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
        className: "bg-success/10",
      },
      {
        variant: "default",
        color: "warning",
        className: "bg-warning/10",
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
        className: "border-success/30 bg-success/5",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-warning/30 bg-warning/5",
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
        className: "bg-success/10",
      },
      {
        variant: "card",
        color: "warning",
        className: "bg-warning/10",
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
  },
);

// Indicator renders for "underline" (edge underline) and "segment" (sliding
// pill). For every other variant the trigger's own data-[active] background
// owns the "pill", so a second fill layer here would double the selected
// treatment. Base UI supplies --active-tab-* on the span. Position/size come
// from the CSS vars as static values; motion animates translate (and size)
// only — CSS transitions interrupt cleanly on rapid retargeting and the final
// state never depends on transitionend.
function TabsIndicatorInternal() {
  const { orientation, variant, color } = useTabsContext();
  const reducedMotion = useReducedMotion();

  if (variant !== "underline" && variant !== "segment") return null;

  const isSegment = variant === "segment";
  const vertical = orientation === "vertical";

  let position: string;

  if (isSegment && vertical) {
    position =
      "left-0 right-0 top-0 rounded-full h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]";
  } else if (isSegment) {
    position =
      "inset-y-1 left-0 rounded-full w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]";
  } else if (vertical) {
    position =
      "right-0 top-0 w-0.5 h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]";
  } else {
    position =
      "bottom-0 left-0 w-[var(--active-tab-width)] h-0.5 translate-x-[var(--active-tab-left)]";
  }

  const colorClasses = {
    default: "bg-primary",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute",
        colorClasses[color],
        !reducedMotion &&
          "transition-[translate,width,height] duration-200 ease-out",
        position,
      )}
    />
  );
}

interface TabsListProps
  extends
    TabsPrimitive.List.Props,
    Omit<VariantProps<typeof tabsListVariants>, "orientation" | "color"> {
  showIndicator?: boolean;
  /** Constrain with `max-w-*`/`w-*`; overflow gains scroll chevrons. */
  scrollable?: boolean;
  children: React.ReactNode;
}

// Hidden-scrollbar utility (breadcrumb.tsx / toggle-group.tsx precedent).
const SCROLLBAR_NONE =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/**
 * Edge-detection for the scrollable TabsList. Subscribes via
 * useSyncExternalStore (§4-safe: no setState in effect bodies) to scroll,
 * resize, and childList mutations so chevrons stay current when tabs are
 * added/closed or the list is resized.
 */
function useTabsOverflow(
  el: HTMLElement | null,
  orientation: "horizontal" | "vertical",
) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!el) return () => {};

      const ro = new ResizeObserver(onStoreChange);
      ro.observe(el);
      const mo = new MutationObserver(onStoreChange);
      mo.observe(el, { childList: true, subtree: true });
      el.addEventListener("scroll", onStoreChange, { passive: true });
      window.addEventListener("resize", onStoreChange);

      return () => {
        ro.disconnect();
        mo.disconnect();
        el.removeEventListener("scroll", onStoreChange);
        window.removeEventListener("resize", onStoreChange);
      };
    },
    [el],
  );

  const getSnapshot = React.useCallback(() => {
    if (!el) return "0|0|0";

    const vertical = orientation === "vertical";
    let pos: number;
    let max: number;

    if (vertical) {
      pos = el.scrollTop;
      max = el.scrollHeight - el.clientHeight;
    } else {
      pos = el.scrollLeft;
      max = el.scrollWidth - el.clientWidth;
    }

    // `1` tolerance for fractional scrollWidth in sub-pixel layouts.
    return `${Number(pos > 0)}|${Number(pos < max - 1)}|${Number(max > 0)}`;
  }, [el, orientation]);

  const snapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "0|0|0",
  );

  const [canStart, canEnd, hasOverflow] = snapshot
    .split("|")
    .map((flag) => flag === "1");

  return { canStart, canEnd, hasOverflow };
}

function TabsScrollButton({
  direction,
  orientation,
  onScrollStep,
}: {
  direction: "start" | "end";
  orientation: "horizontal" | "vertical";
  onScrollStep: (direction: 1 | -1) => void;
}) {
  const vertical = orientation === "vertical";
  const backward = direction === "start";

  let label: string;
  let icon: React.ReactNode;
  let position: string;
  let step: 1 | -1 = 1;

  if (backward) {
    step = -1;
  }

  if (vertical && backward) {
    label = "Scroll tabs up";
    icon = <IconChevronUp className="size-3.5" aria-hidden="true" />;
    position = "top-1 left-1/2 -translate-x-1/2";
  } else if (vertical) {
    label = "Scroll tabs down";
    icon = <IconChevronDown className="size-3.5" aria-hidden="true" />;
    position = "bottom-1 left-1/2 -translate-x-1/2";
  } else if (backward) {
    label = "Scroll tabs left";
    icon = <IconChevronLeft className="size-3.5" aria-hidden="true" />;
    position = "left-1 top-1/2 -translate-y-1/2";
  } else {
    label = "Scroll tabs right";
    icon = <IconChevronRight className="size-3.5" aria-hidden="true" />;
    position = "right-1 top-1/2 -translate-y-1/2";
  }

  return (
    <button
      type="button"
      data-slot={`tabs-scroll-${direction}`}
      aria-label={label}
      onClick={() => onScrollStep(step)}
      className={cn(
        "absolute z-20 inline-flex size-6 items-center justify-center rounded-full",
        "border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur",
        "hover:text-foreground hover:bg-background",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring",
        "transition-colors duration-150 motion-reduce:transition-none",
        position,
      )}
    >
      {icon}
    </button>
  );
}

// oxlint-disable-next-line complexity -- orthogonal display concern flags over one element.
function TabsList({
  className,
  variant,
  showIndicator: showIndicatorProp,
  scrollable = false,
  children,
  ...props
}: TabsListProps) {
  const {
    orientation,
    variant: contextVariant,
    color,
    showIndicator: contextShowIndicator,
  } = useTabsContext();

  const [listEl, setListEl] = React.useState<HTMLDivElement | null>(null);
  const { canStart, canEnd, hasOverflow } = useTabsOverflow(
    listEl,
    orientation,
  );
  const reducedMotion = useReducedMotion();

  const finalVariant = variant ?? contextVariant;
  const shouldShowIndicator = showIndicatorProp ?? contextShowIndicator;

  const handleScrollStep = (direction: 1 | -1) => {
    if (!listEl) return;

    const vertical = orientation === "vertical";
    let amount: number;

    if (vertical) {
      amount = listEl.clientHeight * 0.8;
    } else {
      amount = listEl.clientWidth * 0.8;
    }

    let behavior: ScrollBehavior = "smooth";

    if (reducedMotion) {
      behavior = "auto";
    }

    if (vertical) {
      listEl.scrollBy({ top: direction * amount, behavior });
    } else {
      listEl.scrollBy({ left: direction * amount, behavior });
    }
  };

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={finalVariant}
      data-scrollable={scrollable || undefined}
      // orientation data-attr is emitted natively by Base UI — don't duplicate.
      className={cn(
        tabsListVariants({
          variant: finalVariant,
          color,
          orientation,
        }),
        scrollable && "flex-nowrap overflow-x-auto",
        scrollable && orientation === "vertical" && "overflow-y-auto",
        scrollable && SCROLLBAR_NONE,
        scrollable && "motion-safe:scroll-smooth",
        className,
      )}
      {...props}
      ref={setListEl}
    >
      {children}
      {shouldShowIndicator && <TabsIndicatorInternal />}
      {scrollable && hasOverflow && canStart && (
        <TabsScrollButton
          direction="start"
          orientation={orientation}
          onScrollStep={handleScrollStep}
        />
      )}
      {scrollable && hasOverflow && canEnd && (
        <TabsScrollButton
          direction="end"
          orientation={orientation}
          onScrollStep={handleScrollStep}
        />
      )}
    </TabsPrimitive.List>
  );
}

const tabsTriggerVariants = cva(
  [
    "group inline-flex items-center justify-center whitespace-nowrap gap-2",
    "rounded-md px-3 py-1.5 text-sm font-medium",
    "relative z-10",
    "transition-all duration-200",
    "motion-reduce:transition-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring",
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
        segment: [
          "text-muted-foreground hover:text-foreground rounded-full",
          // Active background is the sliding pill (Tabs.Indicator); the trigger
          // only raises text weight/colour so the pill stays unobstructed.
          "data-[active]:text-foreground data-[active]:font-semibold",
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
        className: "data-[active]:text-primary data-[active]:border-primary",
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
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground",
      },
      {
        variant: "pills",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground data-[active]:border-success",
      },
      {
        variant: "soft",
        color: "success",
        className: "data-[active]:bg-success/10 data-[active]:text-success",
      },
      {
        variant: "underline",
        color: "success",
        className: "data-[active]:text-success data-[active]:border-success",
      },
      {
        variant: "card",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground",
      },

      {
        variant: "default",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground",
      },
      {
        variant: "pills",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground data-[active]:border-warning",
      },
      {
        variant: "soft",
        color: "warning",
        className: "data-[active]:bg-warning/10 data-[active]:text-warning",
      },
      {
        variant: "underline",
        color: "warning",
        className: "data-[active]:text-warning data-[active]:border-warning",
      },
      {
        variant: "card",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground",
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

      // Segment: the pill fill comes from Tabs.Indicator; the trigger only
      // needs a readable text colour on top of the token fill.
      {
        variant: "segment",
        color: "default",
        className: "data-[active]:text-foreground",
      },
      {
        variant: "segment",
        color: "primary",
        className: "data-[active]:text-primary-foreground",
      },
      {
        variant: "segment",
        color: "success",
        className: "data-[active]:text-success-foreground",
      },
      {
        variant: "segment",
        color: "warning",
        className: "data-[active]:text-warning-foreground",
      },
      {
        variant: "segment",
        color: "destructive",
        className: "data-[active]:text-destructive-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      orientation: "horizontal",
    },
  },
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
  /** Unsaved-state marker: dot replaces the close X until hover/active. */
  dirty?: boolean;
  /** A close-guard promise is in flight for this tab. */
  closePending?: boolean;
  /** Leading slot — dnd-kit drag handle (rendered inside the Tab). */
  dragHandle?: React.ReactNode;
}

const badgeColorClasses = {
  default: "bg-muted-foreground/20 text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

interface TabCloseAffordanceProps {
  closeLabel: string;
  dirty: boolean;
  closePending: boolean;
  onClose: (e: React.MouseEvent) => void;
}

/** Closable-tab affordance: X button with dirty-dot swap and pending pulse. */
function TabCloseAffordance({
  closeLabel,
  dirty,
  closePending,
  onClose,
}: TabCloseAffordanceProps) {
  return (
    <button
      data-slot="tabs-close"
      type="button"
      aria-label={closeLabel}
      aria-keyshortcuts="Delete"
      aria-disabled={closePending || undefined}
      onClick={onClose}
      className={cn(
        "relative ms-1 rounded-full shrink-0",
        // Visual 20px, hit area ≥24px via pseudo-element (§9 SC 2.5.8).
        "p-0.5 before:absolute before:-inset-1.5 before:rounded-full",
        "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "transition-colors duration-150 motion-reduce:transition-none",
        "focus-visible:[&_svg]:opacity-100",
      )}
    >
      <IconX
        aria-hidden="true"
        className={cn(
          "h-3 w-3 transition-opacity duration-150 motion-reduce:transition-none",
          dirty &&
            !closePending &&
            "opacity-0 group-hover:opacity-100 group-data-[active]:opacity-100",
          closePending && "motion-safe:animate-pulse",
        )}
      />
      {dirty && !closePending && (
        <span
          data-slot="tabs-dirty-dot"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning group-hover:opacity-0 group-data-[active]:opacity-0"
        />
      )}
    </button>
  );
}

// SAFETY: label is app-authored ReactNode (local prop, not I/O); string vs
// node is the domain distinction for the aria label. Single parse boundary.
function resolveCloseLabel(children: React.ReactNode): string {
  // SAFETY: label is app-authored ReactNode (local prop, not I/O); string vs
  // node is the domain distinction for the aria label. Single parse boundary.
  // oxlint-disable-next-line anti-slop/no-runtime-typeof
  if (typeof children === "string") {
    return `Close ${children}`;
  }

  return "Close tab";
}

// oxlint-disable-next-line complexity -- linear prop fallbacks and feature slots, not nested branching.
function TabsTrigger({
  className,
  variant,
  color,
  icon,
  badge,
  badgeColor = "default",
  closable = false,
  onClose,
  dirty = false,
  closePending = false,
  dragHandle,
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

  const handleClose = (e: React.MouseEvent) => {
    if (closePending) return;

    e.stopPropagation();
    e.preventDefault();

    // SAFETY: KiraTabs/TabItem model tab identity as string values; the Tab
    // primitive's `TabsTab.Value` is `any` here only because Base UI widens it.
    onClose?.(value as string);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (closePending) return;

    if (closable && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();

      // SAFETY: same string-value invariant as handleClose above.
      onClose?.(value as string);
    }
  };

  // App-authored label: KiraTabs/TabItem labels are app-controlled, so a plain
  // runtime string check is the I/O contract here — non-strings (icon+text
  // nodes) degrade to the generic "Close tab".
  const closeLabel = resolveCloseLabel(children);

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-close-pending={closePending || undefined}
      aria-disabled={closePending || undefined}
      value={value}
      onKeyDown={handleKeyDown}
      className={cn(
        tabsTriggerVariants({
          variant: finalVariant,
          color: finalColor,
          orientation,
        }),
        closable && "pe-2",
        className,
      )}
      {...props}
    >
      {dragHandle}
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
            badgeColorClasses[badgeColor],
          )}
        >
          {badge}
        </span>
      )}
      {dirty && !closable && (
        <span
          data-slot="tabs-dirty-dot"
          aria-hidden="true"
          className="absolute top-1.5 end-1.5 size-1.5 rounded-full bg-warning group-data-[active]:hidden"
        />
      )}
      {closable && (
        <TabCloseAffordance
          closeLabel={closeLabel}
          dirty={dirty}
          closePending={closePending}
          onClose={handleClose}
        />
      )}
    </TabsPrimitive.Tab>
  );
}

const tabsContentVariants = cva(
  [
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  ],
  {
    variants: {
      animation: {
        none: "",
        fade: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:animation-duration-200",
        slide:
          "motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:fade-in-0 motion-safe:animation-duration-300",
        slideUp:
          "motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in-0 motion-safe:animation-duration-300",
        zoom: "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in-0 motion-safe:animation-duration-200",
        // Direction-aware entry: Base UI Panel exposes data-activation-direction
        // natively, so the panel slides in from the side the selection came from.
        // NOTE: never use `duration-*` here — it sets transition-duration and the
        // browser default transition-property:all then delays Base UI's exit
        // detection, breaking animation restarts on keepMounted panels.
        auto: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:animation-duration-200 data-[activation-direction=left]:motion-safe:slide-in-from-right-4 data-[activation-direction=right]:motion-safe:slide-in-from-left-4 data-[activation-direction=up]:motion-safe:slide-in-from-bottom-4 data-[activation-direction=down]:motion-safe:slide-in-from-top-4",
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
  },
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
  let mounted = keepMounted;

  if (lazy) {
    mounted = false;
  }

  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      data-value={value}
      value={value}
      keepMounted={mounted}
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
  /** Unsaved-state marker (dot on the close affordance until hover/active). */
  dirty?: boolean;
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
  /**
   * Close guard. Return/resolve `false` to veto the close (tab stays,
   * `onClose` is not fired). While a promise is pending, the tab's close
   * control is inert and shows a pulsing state.
   */
  onBeforeClose?: (value: string) => boolean | Promise<boolean>;
  /** Sync the active tab to `location.hash` (replaceState; accordion precedent). */
  deepLink?: boolean;
  /** Render an "All tabs" dropdown menu next to the list. */
  overflowMenu?: boolean;
  /** Enable drag-to-reorder via dnd-kit (pointer + keyboard). */
  reorderable?: boolean;
  onReorder?: (items: TabItem[]) => void;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

// Type-wide constants (hoisted for use inside hooks and render alike).
const DND_SENSORS_ACTIVATION = { distance: 8 } as const;

/** Wire one tab into dnd-kit sortable drag state; handle stays inside the Tab. */
function useSortableTab(item: TabItem) {
  const sortable = useSortable({ id: item.value, disabled: item.disabled });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    style.opacity = 0.5;
    style.zIndex = 20;
  }

  const dragHandle = (
    <span
      {...attributes}
      {...listeners}
      data-slot="tabs-drag-handle"
      aria-hidden="true"
      onPointerDown={(e) => e.stopPropagation()}
      className="-ms-1 inline-flex size-5 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-foreground/10 active:cursor-grabbing touch-none"
    >
      <IconGripVertical className="size-3.5" />
    </span>
  );

  return { setNodeRef, style, dragHandle };
}

/**
 * TabsTrigger wrapped for dnd-kit when `reorderable` is on. The sortable node
 * ref/style go on a wrapper span so the Base UI Tab DOM registration (roving
 * tabindex composites) stays untouched; the drag handle renders INSIDE the
 * trigger as the leading slot.
 */
function SortableTab({
  item,
  reorderable,
  onClose,
  closePending,
}: {
  item: TabItem;
  reorderable: boolean;
  onClose: (value: string) => void;
  closePending: boolean;
}) {
  const { setNodeRef, style, dragHandle } = useSortableTab(item);

  if (!reorderable) {
    return (
      <TabsTrigger
        value={item.value}
        icon={item.icon}
        badge={item.badge}
        badgeColor={item.badgeColor}
        disabled={item.disabled}
        closable={item.closable}
        onClose={onClose}
        dirty={item.dirty}
        closePending={closePending}
      >
        {item.label}
      </TabsTrigger>
    );
  }

  return (
    <span ref={setNodeRef} style={style} className="inline-flex">
      <TabsTrigger
        value={item.value}
        icon={item.icon}
        badge={item.badge}
        badgeColor={item.badgeColor}
        disabled={item.disabled}
        closable={item.closable}
        onClose={onClose}
        dirty={item.dirty}
        closePending={closePending}
        dragHandle={dragHandle}
      >
        {item.label}
      </TabsTrigger>
    </span>
  );
}

/** "All tabs" dropdown: jump to any item; check marks the active one. */
function TabsOverflowMenu({
  items,
  activeValue,
  onSelect,
}: {
  items: TabItem[];
  activeValue: string | undefined;
  onSelect: (value: string) => void;
}) {
  return (
    <DropdownMenuWithContent
      contentProps={{ className: "max-h-72 overflow-y-auto" }}
      trigger={
        <button
          type="button"
          data-slot="tabs-overflow-trigger"
          aria-label="All tabs"
          className={cn(
            "inline-flex items-center justify-center rounded-md size-6 shrink-0",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors duration-150 motion-reduce:transition-none",
          )}
        >
          <IconDots className="h-4 w-4" aria-hidden="true" />
        </button>
      }
    >
      {items.map((item) => {
        const isActive = item.value === activeValue;
        let icon: React.ReactNode;

        if (isActive) {
          icon = <IconCheck />;
        }

        return (
          <DropdownMenuItem
            key={item.value}
            closeOnClick
            disabled={item.disabled}
            icon={icon}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuWithContent>
  );
}

/**
 * Close-guard state machine. Returns `(value) => void` that either closes
 * immediately, vetoes, or marks the tab pending while the guard promise runs.
 */
function useCloseGuard(
  items: TabItem[],
  activeValue: string | undefined,
  selectValue: (next: string) => void,
  setItems: React.Dispatch<React.SetStateAction<TabItem[]>>,
  onClose: ((value: string) => void) | undefined,
  onBeforeClose: ((value: string) => boolean | Promise<boolean>) | undefined,
) {
  const [pendingCloses, setPendingCloses] = React.useState<
    Record<string, boolean>
  >({});

  const runClose = (closedValue: string) => {
    const idx = items.findIndex((i) => i.value === closedValue);
    const next = items.filter((i) => i.value !== closedValue);

    // If the active tab was closed, move to the FOLLOWING tab in reading
    // order, wrapping to first (WAI-ARIA APG tabs pattern).
    if (activeValue === closedValue && next.length > 0) {
      const neighbour = next[idx] ?? next[0];
      selectValue(neighbour.value);
    }

    setItems(next);
    onClose?.(closedValue);
  };

  const handleClose = (closedValue: string) => {
    if (pendingCloses[closedValue]) return;

    if (!onBeforeClose) {
      runClose(closedValue);

      return;
    }

    let verdict: boolean | Promise<boolean>;

    try {
      verdict = onBeforeClose(closedValue);
    } catch {
      verdict = false;
    }

    if (verdict instanceof Promise) {
      setPendingCloses((prev) => ({ ...prev, [closedValue]: true }));
      verdict
        .then((allowed) => {
          if (allowed) {
            runClose(closedValue);
          }
        })
        .catch(() => {
          // Guard rejection vetoes the close.
        })
        .finally(() => {
          setPendingCloses((prev) => {
            const nextPending = { ...prev };
            delete nextPending[closedValue];

            return nextPending;
          });
        });

      return;
    }

    if (verdict) {
      runClose(closedValue);
    }
  };

  return { pendingCloses, handleClose };
}

/** Hash deep-link effects: mount-time hash adoption + replaceState per selection. */
function useTabsDeepLinkEffects(
  deepLink: boolean,
  items: TabItem[],
  activeValue: string | undefined,
  selectValue: (next: string) => void,
) {
  React.useEffect(() => {
    if (!deepLink || typeof window === "undefined") return;

    if (!window.location.hash || window.location.hash === "#") return;

    const target = decodeURIComponent(window.location.hash.slice(1));

    if (!items.some((item) => item.value === target)) return;

    if (target !== activeValue) {
      selectValue(target);
    }
    // Hash adoption runs once on mount; re-runs would fight replaceState below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink]);

  React.useEffect(() => {
    if (!deepLink || typeof window === "undefined") return;

    if (!activeValue) return;

    window.history.replaceState(
      window.history.state,
      "",
      `#${encodeURIComponent(activeValue)}`,
    );
  }, [deepLink, activeValue]);
}

// oxlint-disable-next-line complexity -- one prop per optional feature (guard/menu/dnd/link); each is a single flag check.
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
  onBeforeClose,
  deepLink = false,
  overflowMenu = false,
  reorderable = false,
  onReorder,
  className,
  listClassName,
  contentClassName,
}: KiraTabsProps) {
  // Own the item list so closable/addable/reorder can mutate it. When the
  // parent passes a fresh `itemsProp`, adopt it (adjust-on-prop-change via a
  // render-time state prev-value, not an effect — react-compiler safe).
  const [items, setItems] = React.useState(itemsProp);
  const [prevItemsProp, setPrevItemsProp] = React.useState(itemsProp);

  if (itemsProp !== prevItemsProp) {
    setPrevItemsProp(itemsProp);
    setItems(itemsProp);
  }

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? itemsProp[0]?.value,
  );

  let activeValue: string | undefined;

  if (isControlled) {
    activeValue = value;
  } else {
    activeValue = internalValue;
  }

  const selectValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const announce = useAnnounce();

  const { pendingCloses, handleClose } = useCloseGuard(
    items,
    activeValue,
    selectValue,
    setItems,
    onClose,
    onBeforeClose,
  );

  useTabsDeepLinkEffects(deepLink, items, activeValue, selectValue);

  const handleAdd = () => {
    const created = onAdd?.();

    if (created) {
      setItems((prev) => [...prev, created]);
      selectValue(created.value);
    }
  };

  // --- Drag reorder (dnd-kit) ---
  const dragSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: DND_SENSORS_ACTIVATION,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.value === active.id);
    const newIndex = items.findIndex((i) => i.value === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onReorder?.(next);
    announce.announcePolite(`Moved to position ${newIndex + 1}`);
  };

  // --- Sortable wiring ---
  const sortableIds = items.map((i) => i.value);

  const baseListNode = (
    <TabsList className={listClassName}>
      {items.map((item) => (
        <SortableTab
          key={item.value}
          item={item}
          reorderable={reorderable}
          onClose={handleClose}
          closePending={Boolean(pendingCloses[item.value])}
        />
      ))}
      {addable && (
        <button
          data-slot="tabs-add"
          type="button"
          onClick={handleAdd}
          aria-label="Add tab"
          className={cn(
            "inline-flex items-center justify-center rounded-md size-6 shrink-0",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors duration-150 motion-reduce:transition-none",
          )}
        >
          <IconPlus className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {overflowMenu && items.length > 0 && (
        <TabsOverflowMenu
          items={items}
          activeValue={activeValue}
          onSelect={selectValue}
        />
      )}
    </TabsList>
  );

  let listNode = baseListNode;

  if (reorderable && items.length > 0) {
    listNode = (
      <DndContext
        sensors={dragSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
          {baseListNode}
        </SortableContext>
      </DndContext>
    );
  }

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
      {listNode}
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
