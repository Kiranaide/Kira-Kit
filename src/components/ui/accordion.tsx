"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronDown } from "@tabler/icons-react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [[data-panel-open]_&]:rounded-b-none rounded-lg",
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
      },
      size: {
        xs: "py-1.5 px-3 text-xs",
        sm: "py-2 px-3.5 text-xs",
        default: "py-3 px-4 text-sm",
        lg: "py-4 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const accordionContentVariants = cva("", {
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

function Accordion({
  className,
  scrollIntoView = false,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  scrollIntoView?: boolean;
}) {
  const handleValueChange: AccordionPrimitive.Root.Props["onValueChange"] = (
    value,
    ...args
  ) => {
    props.onValueChange?.(value, ...args);

    if (scrollIntoView && value.length > 0) {
      const lastOpened = value[value.length - 1];
      const trigger = document.querySelector<HTMLElement>(
        `[data-accordion-item-value="${lastOpened}"] [data-slot="accordion-trigger"]`,
      );
      trigger?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full space-y-1", className)}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  onOpen,
  onClose,
  disabled = false,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const wasOpenRef = React.useRef(false);

  const handleOpenChange: AccordionPrimitive.Item.Props["onOpenChange"] = (
    open,
    ...args
  ) => {
    if (open && !wasOpenRef.current) {
      onOpen?.();
    } else if (!open && wasOpenRef.current) {
      onClose?.();
    }
    wasOpenRef.current = open;
    props.onOpenChange?.(open, ...args);
  };

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-accordion-item-value={String(props.value)}
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      {...props}
    />
  );
}

type AccordionTriggerProps = Omit<
  AccordionPrimitive.Trigger.Props,
  "children"
> & {
  children?: React.ReactNode;
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  showArrow?: boolean;
  chevronIcon?: React.ReactNode;
  chevronPosition?: "start" | "end";
  icon?: React.ReactNode;
};

function AccordionTrigger({
  className,
  children,
  variant,
  size,
  showArrow = true,
  chevronIcon,
  chevronPosition = "end",
  icon,
  ...props
}: AccordionTriggerProps) {
  const defaultChevron = (
    <span
      data-accordion-chevron
      className="inline-block shrink-0 transition-transform duration-300 ease-out in-data-panel-open:rotate-180"
    >
      <IconChevronDown className="h-4 w-4" />
    </span>
  );

  return (
    <AccordionPrimitive.Header data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerVariants({ variant, size, className }))}
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
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

type AccordionContentProps = Omit<
  AccordionPrimitive.Panel.Props,
  "children"
> & {
  children?: React.ReactNode;
  size?: VariantProps<typeof accordionContentVariants>["size"];
  inset?: boolean;
  lazyMount?: boolean;
  showSkeleton?: boolean;
  skeletonLines?: number;
};

function AccordionContent({
  className,
  children,
  size,
  inset = false,
  lazyMount = false,
  showSkeleton = false,
  skeletonLines = 3,
  ...props
}: AccordionContentProps) {
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
        animationRef.current.kill();
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
          },
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
      (_, i) => widths[i % widths.length],
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
    <AccordionPrimitive.Panel
      ref={panelRef}
      data-slot="accordion-panel"
      keepMounted
      className={cn("overflow-hidden", inset && "pl-8", className)}
      style={{
        height: 0,
        opacity: 0,
      }}
      {...props}
    >
      <div ref={contentRef} className={cn(accordionContentVariants({ size }))}>
        {renderContent}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionTriggerVariants,
  accordionContentVariants,
};
export type { AccordionTriggerProps, AccordionContentProps };

// ============================================================================
// EasyAccordion - Simplified single-import API
// ============================================================================

type AccordionItemData = {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  showArrow?: boolean;
  chevronIcon?: React.ReactNode;
  chevronPosition?: "start" | "end";
  inset?: boolean;
  lazyMount?: boolean;
  showSkeleton?: boolean;
  skeletonLines?: number;
  children?: AccordionItemData[];
};

type EasyAccordionProps = Omit<
  React.ComponentProps<typeof AccordionPrimitive.Root>,
  "children"
> & {
  items: AccordionItemData[];
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  scrollIntoView?: boolean;
};

function renderAccordionItem(
  item: AccordionItemData,
  defaultVariant: VariantProps<
    typeof accordionTriggerVariants
  >["variant"] = "default",
  defaultSize: VariantProps<
    typeof accordionTriggerVariants
  >["size"] = "default",
  level: number = 0,
): React.ReactElement {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
      <AccordionTrigger
        variant={item.variant ?? defaultVariant}
        size={item.size ?? defaultSize}
        icon={item.icon}
        showArrow={item.showArrow ?? true}
        chevronIcon={item.chevronIcon}
        chevronPosition={item.chevronPosition ?? "end"}
      >
        {item.title}
      </AccordionTrigger>
      <AccordionContent
        size={item.size ?? defaultSize}
        inset={item.inset ?? level > 0}
        lazyMount={item.lazyMount}
        showSkeleton={item.showSkeleton}
        skeletonLines={item.skeletonLines}
      >
        {item.content}
        {hasChildren && (
          <div className={cn("mt-2", level > 0 && "ml-4")}>
            {item.children!.map((child) =>
              renderAccordionItem(
                child,
                defaultVariant,
                defaultSize,
                level + 1,
              ),
            )}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function EasyAccordion({
  items,
  variant = "default",
  size = "default",
  scrollIntoView = false,
  className,
  ...props
}: EasyAccordionProps) {
  return (
    <Accordion scrollIntoView={scrollIntoView} className={className} {...props}>
      {items.map((item) => renderAccordionItem(item, variant, size, 0))}
    </Accordion>
  );
}

export { EasyAccordion };
export type { EasyAccordionProps, AccordionItemData };
