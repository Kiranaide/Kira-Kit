"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconChevronDown,
  IconGripVertical,
  IconLoader2,
  IconRefresh,
  IconChevronsDown,
  IconChevronsUp,
} from "@tabler/icons-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";

interface AccordionItemData {
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
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children?: AccordionItemData[];
}

interface KiraAccordionProps extends Omit<
  React.ComponentProps<typeof AccordionPrimitive.Root>,
  "children"
> {
  items: AccordionItemData[];
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  scrollIntoView?: boolean;
  draggable?: boolean;
  onReorder?: (items: AccordionItemData[]) => void;
  asyncLoading?: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  nested?: boolean;
  showExpandAll?: boolean;
  dragHandlePosition?: "start" | "end";
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

function flattenItems(items: AccordionItemData[]): AccordionItemData[] {
  const flat: AccordionItemData[] = [];

  for (const item of items) {
    flat.push(item);
    if (item.children) {
      flat.push(...flattenItems(item.children));
    }
  }

  return flat;
}

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
  }
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

interface AccordionProps extends React.ComponentProps<
  typeof AccordionPrimitive.Root
> {
  scrollIntoView?: boolean;
}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(function Accordion(
  { className, scrollIntoView = false, children, ...props },
  forwardedRef
) {
  const reducedMotion = useReducedMotion();

  const handleValueChange: AccordionPrimitive.Root.Props["onValueChange"] = (
    value,
    ...args
  ) => {
    props.onValueChange?.(value, ...args);

    if (scrollIntoView && value.length > 0) {
      const lastOpened = value[value.length - 1];
      const trigger = document.querySelector<HTMLElement>(
        `[data-accordion-item-value="${lastOpened}"] [data-slot="accordion-trigger"]`
      );
      trigger?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "nearest",
      });
    }
  };

  return (
    <AccordionPrimitive.Root
      ref={forwardedRef}
      data-slot="accordion"
      className={cn("w-full space-y-1", className)}
      onValueChange={handleValueChange}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  );
});

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
        className
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
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  dragHandle?: React.ReactNode;
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
  loading = false,
  error = null,
  onRetry,
  dragHandle,
  ...props
}: AccordionTriggerProps) {
  const defaultChevron = <IconChevronDown className="h-4 w-4" />;

  const chevronElement = chevronIcon || defaultChevron;
  const animatedChevron = (
    <span
      data-accordion-chevron
      className="inline-block shrink-0 transition-transform duration-300 ease-out in-data-panel-open:rotate-180"
    >
      {chevronElement}
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
          {dragHandle && (
            <span
              className="shrink-0 cursor-grab active:cursor-grabbing touch-none"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {dragHandle}
            </span>
          )}
          {chevronPosition === "start" && showArrow && animatedChevron}
          {icon && <span className="shrink-0 flex items-center">{icon}</span>}
          <span className="flex-1 min-w-0 truncate">{children}</span>
          {loading && <IconLoader2 className="h-4 w-4 shrink-0 animate-spin" />}
          {error && !loading && onRetry && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRetry();
              }}
              className="shrink-0 p-1 rounded hover:bg-destructive/20 text-destructive"
              aria-label="Retry loading content"
            >
              <IconRefresh className="h-4 w-4" />
            </button>
          )}
          {chevronPosition === "end" && showArrow && animatedChevron}
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
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
};

function AccordionContent({
  className,
  children,
  size,
  inset = false,
  lazyMount = false,
  showSkeleton = false,
  skeletonLines = 3,
  loading = false,
  error = null,
  onRetry,
  ...props
}: AccordionContentProps) {
  const [hasBeenOpened, setHasBeenOpened] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (panel.hasAttribute("data-open")) {
      setHasBeenOpened(true);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-open"
        ) {
          if (panel.hasAttribute("data-open")) {
            setHasBeenOpened(true);
          }
        }
      });
    });

    observer.observe(panel, {
      attributes: true,
      attributeFilter: ["data-open"],
    });

    return () => observer.disconnect();
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

  let renderContent: React.ReactNode = null;
  if (loading) {
    renderContent = skeleton;
  } else if (error) {
    renderContent = (
      <div className="px-4 py-3 text-destructive">
        <p className="text-sm font-medium">Error loading content</p>
        <p className="text-xs opacity-80 mt-1">{error.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs flex items-center gap-1 hover:underline"
          >
            <IconRefresh className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
    );
  } else if (shouldRenderChildren) {
    renderContent = children;
  } else if (showSkeleton) {
    renderContent = skeleton;
  }

  return (
    <AccordionPrimitive.Panel
      ref={panelRef}
      data-slot="accordion-panel"
      keepMounted
      className={cn(
        "overflow-hidden h-(--accordion-panel-height) transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      <div className={cn(accordionContentVariants({ size }))}>
        {renderContent}
      </div>
    </AccordionPrimitive.Panel>
  );
}

interface SortableAccordionItemProps {
  item: AccordionItemData;
  defaultVariant: VariantProps<typeof accordionTriggerVariants>["variant"];
  defaultSize: VariantProps<typeof accordionTriggerVariants>["size"];
  level: number;
  dragHandlePosition: "start" | "end";
  nested?: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  asyncLoading?: boolean;
}

function SortableAccordionItem({
  item,
  defaultVariant,
  defaultSize,
  level,
  dragHandlePosition,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading,
}: SortableAccordionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.value, disabled: item.disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleOpen = React.useCallback(async () => {
    if (asyncLoading && onItemOpen) {
      await onItemOpen(item);
    } else {
      onItemOpen?.(item);
    }
  }, [asyncLoading, onItemOpen, item]);

  const handleClose = React.useCallback(() => {
    onItemClose?.(item);
  }, [onItemClose, item]);

  const dragHandle = (
    <span
      {...attributes}
      {...listeners}
      className="shrink-0 p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing touch-none"
      aria-label="Drag to reorder"
    >
      <IconGripVertical className="h-4 w-4 text-muted-foreground" />
    </span>
  );

  const hasChildren = nested && item.children && item.children.length > 0;

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={item.value}
        disabled={item.disabled}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        <AccordionTrigger
          variant={item.variant ?? defaultVariant}
          size={item.size ?? defaultSize}
          icon={item.icon}
          showArrow={item.showArrow ?? true}
          chevronIcon={item.chevronIcon}
          chevronPosition={item.chevronPosition ?? "end"}
          loading={item.loading}
          error={item.error}
          onRetry={item.onRetry}
          dragHandle={dragHandlePosition === "start" ? dragHandle : undefined}
        >
          {item.title}
        </AccordionTrigger>
        <AccordionContent
          size={item.size ?? defaultSize}
          inset={item.inset ?? level > 0}
          lazyMount={item.lazyMount}
          showSkeleton={item.showSkeleton}
          skeletonLines={item.skeletonLines}
          loading={item.loading}
          error={item.error}
          onRetry={item.onRetry}
        >
          {item.content}
          {hasChildren && (
            <div className={cn("mt-2 space-y-1", level > 0 && "ml-4")}>
              {item.children?.map((child) => (
                <SortableAccordionItem
                  key={child.value}
                  item={child}
                  defaultVariant={defaultVariant}
                  defaultSize={defaultSize}
                  level={level + 1}
                  dragHandlePosition={dragHandlePosition}
                  nested={nested}
                  onItemOpen={onItemOpen}
                  onItemClose={onItemClose}
                  asyncLoading={asyncLoading}
                />
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function KiraAccordion({
  items: initialItems,
  variant = "default",
  size = "default",
  scrollIntoView = false,
  draggable = false,
  onReorder,
  asyncLoading = false,
  onItemOpen,
  onItemClose,
  nested = false,
  showExpandAll = false,
  dragHandlePosition = "start",
  className,
  ...props
}: KiraAccordionProps) {
  const [items, setItems] = React.useState(initialItems);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [openValues, setOpenValues] = React.useState<string[]>([]);
  const accordionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        setItems((items) => {
          const flatItems = flattenItems(items);
          const oldIndex = flatItems.findIndex(
            (item) => item.value === active.id
          );
          const newIndex = flatItems.findIndex(
            (item) => item.value === over.id
          );

          if (oldIndex === -1 || newIndex === -1) return items;

          const newFlatItems = arrayMove(flatItems, oldIndex, newIndex);

          onReorder?.(newFlatItems);
          return newFlatItems;
        });
      }
    },
    [onReorder]
  );

  const handleExpandAll = React.useCallback(() => {
    const allValues = flattenItems(items).map((item) => item.value);
    setOpenValues(allValues);
  }, [items]);

  const handleCollapseAll = React.useCallback(() => {
    setOpenValues([]);
  }, []);

  const accordionContent = (
    <Accordion
      ref={accordionRef}
      scrollIntoView={scrollIntoView}
      className={className}
      value={openValues}
      onValueChange={(value, ...args) => {
        setOpenValues(value);
        props.onValueChange?.(value, ...args);
      }}
      {...props}
    >
      {draggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.value)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {items.map((item) => (
                <SortableAccordionItem
                  key={item.value}
                  item={item}
                  defaultVariant={variant}
                  defaultSize={size}
                  level={0}
                  dragHandlePosition={dragHandlePosition}
                  nested={nested}
                  onItemOpen={onItemOpen}
                  onItemClose={onItemClose}
                  asyncLoading={asyncLoading}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: "0.5" } },
              }),
            }}
          >
            {activeId ? (
              <div className="opacity-50">
                {(() => {
                  const item = flattenItems(items).find(
                    (i) => i.value === activeId
                  );
                  return item ? (
                    <AccordionItem value={item.value} disabled={item.disabled}>
                      <AccordionTrigger
                        variant={item.variant ?? variant}
                        size={item.size ?? size}
                        icon={item.icon}
                        showArrow={item.showArrow ?? true}
                        chevronIcon={item.chevronIcon}
                        chevronPosition={item.chevronPosition ?? "end"}
                      >
                        {item.title}
                      </AccordionTrigger>
                    </AccordionItem>
                  ) : null;
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        items.map((item) =>
          renderAccordionItem(
            item,
            variant,
            size,
            0,
            nested,
            onItemOpen,
            onItemClose,
            asyncLoading
          )
        )
      )}
    </Accordion>
  );

  return (
    <div className="space-y-2">
      {showExpandAll && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleExpandAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Expand all accordion items"
          >
            <IconChevronsDown className="h-3.5 w-3.5" />
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Collapse all accordion items"
          >
            <IconChevronsUp className="h-3.5 w-3.5" />
            Collapse All
          </button>
        </div>
      )}
      {accordionContent}
    </div>
  );
}

function renderAccordionItem(
  item: AccordionItemData,
  defaultVariant: VariantProps<
    typeof accordionTriggerVariants
  >["variant"] = "default",
  defaultSize: VariantProps<
    typeof accordionTriggerVariants
  >["size"] = "default",
  level: number = 0,
  nested?: boolean,
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>,
  onItemClose?: (item: AccordionItemData) => void,
  asyncLoading?: boolean
): React.ReactElement {
  const hasChildren = nested && item.children && item.children.length > 0;

  const handleOpen = async () => {
    if (asyncLoading && onItemOpen) {
      await onItemOpen(item);
    } else {
      onItemOpen?.(item);
    }
  };

  const handleClose = () => {
    onItemClose?.(item);
  };

  return (
    <AccordionItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <AccordionTrigger
        variant={item.variant ?? defaultVariant}
        size={item.size ?? defaultSize}
        icon={item.icon}
        showArrow={item.showArrow ?? true}
        chevronIcon={item.chevronIcon}
        chevronPosition={item.chevronPosition ?? "end"}
        loading={item.loading}
        error={item.error}
        onRetry={item.onRetry}
      >
        {item.title}
      </AccordionTrigger>
      <AccordionContent
        size={item.size ?? defaultSize}
        inset={item.inset ?? level > 0}
        lazyMount={item.lazyMount}
        showSkeleton={item.showSkeleton}
        skeletonLines={item.skeletonLines}
        loading={item.loading}
        error={item.error}
        onRetry={item.onRetry}
      >
        {item.content}
        {hasChildren && (
          <div className={cn("mt-2 space-y-1", level > 0 && "ml-4")}>
            {item.children?.map((child) =>
              renderAccordionItem(
                child,
                defaultVariant,
                defaultSize,
                level + 1,
                nested,
                onItemOpen,
                onItemClose,
                asyncLoading
              )
            )}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

/* eslint-disable react-refresh/only-export-components */

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  KiraAccordion,
  accordionTriggerVariants,
  accordionContentVariants,
  useReducedMotion,
};

export type {
  AccordionItemData,
  AccordionTriggerProps,
  AccordionContentProps,
  KiraAccordionProps,
};
