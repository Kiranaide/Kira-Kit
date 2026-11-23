"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronRight } from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import {
  isFunctionProp,
  resolveComponentDefaults,
} from "@/lib/component-utils";

const CollapsibleContext = React.createContext({
  open: false,
  hasOpened: false,
  motion: true,
});

const collapsibleTriggerVariants = cva(
  "group flex min-h-8 w-full items-center gap-2 text-start font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50 data-disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-150",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        info: "bg-info/10 text-[color-mix(in_oklab,var(--info)_55%,var(--foreground))] hover:bg-info/20 dark:text-[color-mix(in_oklab,var(--info)_90%,var(--foreground))]",
        success:
          "bg-success/10 text-[color-mix(in_oklab,var(--success)_55%,var(--foreground))] hover:bg-success/20 dark:text-[color-mix(in_oklab,var(--success)_90%,var(--foreground))]",
        warning:
          "bg-warning/10 text-[color-mix(in_oklab,var(--warning)_55%,var(--foreground))] hover:bg-warning/20 dark:text-warning",
        destructive:
          "bg-destructive/10 text-[color-mix(in_oklab,var(--destructive)_75%,var(--foreground))] hover:bg-destructive/20",
        ghost: "hover:bg-muted/30",
        outline: "border border-border hover:bg-muted/30",
        link: "text-primary hover:underline",
      },
      size: {
        xs: "rounded-md px-3 py-1.5 text-xs",
        sm: "rounded-md px-3 py-2 text-sm",
        default: "rounded-lg px-4 py-3 text-sm",
        lg: "rounded-lg px-5 py-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const collapsibleContentVariants = cva("min-w-0", {
  variants: {
    size: {
      none: "",
      xs: "px-3 py-1.5 text-xs",
      sm: "px-3 py-2 text-sm",
      default: "px-4 py-3 text-sm",
      lg: "px-5 py-4 text-base",
    },
  },
  defaultVariants: { size: "default" },
});

type CollapsibleRootProps = React.ComponentProps<
  typeof CollapsiblePrimitive.Root
> & { motion?: boolean };

function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  motion = true,
  className,
  children,
  ...props
}: CollapsibleRootProps) {
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? localOpen;
  const [hasOpened, setHasOpened] = React.useState(open);

  if (open && !hasOpened) setHasOpened(true);

  return (
    <CollapsibleContext.Provider value={{ open, hasOpened, motion }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        {...props}
        open={open}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details);

          if (!details.isCanceled && controlledOpen === undefined)
            setLocalOpen(next);
        }}
        className={(state) =>
          cn(
            "min-w-0",
            isFunctionProp(className) ? className(state) : className,
          )
        }
      >
        {children}
      </CollapsiblePrimitive.Root>
    </CollapsibleContext.Provider>
  );
}

type CollapsibleTriggerProps = CollapsiblePrimitive.Trigger.Props &
  VariantProps<typeof collapsibleTriggerVariants> & {
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
  const { open, motion } = React.useContext(CollapsibleContext);
  const reduced = useReducedMotion();

  const arrow = showArrow && (
    <span
      data-slot="collapsible-chevron"
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center",
        open && "rotate-90",
        motion && !reduced && "transition-transform duration-200 ease-out",
      )}
    >
      {chevronIcon ?? <IconChevronRight className="size-4" />}
    </span>
  );

  return renderCollapsibleTriggerPart1({
    props,
    variant,
    size,
    className,
    chevronPosition,
    arrow,
    icon,
    children,
  });
}

type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props &
  VariantProps<typeof collapsibleContentVariants> & {
    inset?: boolean;
    /** Retain children after the first opening. Default panels mount only while open. */
    lazyMount?: boolean;
    loading?: boolean;
    skeletonLines?: number;
  };

function CollapsibleContent(input: CollapsibleContentProps) {
  const {
    className,
    children,
    inset,
    lazyMount,
    loading,
    skeletonLines,
    size,
    keepMounted,
    ...props
  } = resolveComponentDefaults(input, COLLAPSIBLE_CONTENT_DEFAULTS_1);

  const { hasOpened, motion } = React.useContext(CollapsibleContext);
  const reduced = useReducedMotion();

  const lines = Number.isFinite(skeletonLines)
    ? Math.max(1, Math.min(8, Math.floor(skeletonLines)))
    : 3;

  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-panel"
      {...props}
      keepMounted={keepMounted ?? (lazyMount && hasOpened)}
      aria-busy={loading || undefined}
      className={(state) =>
        cn(
          "min-w-0 overflow-hidden",
          motion &&
            !reduced &&
            // kira-kit-ignore layout-transitions: Base UI collapsible panel height var is the standard expand/collapse animation
            "h-(--collapsible-panel-height) transition-[height,opacity] duration-200 ease-out data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:duration-150",
          isFunctionProp(className) ? className(state) : className,
        )
      }
    >
      <div
        data-slot="collapsible-content"
        className={cn(collapsibleContentVariants({ size }), inset && "ps-8")}
      >
        {loading ? (
          <output
            data-slot="collapsible-loading"

            className="block space-y-2"
          >
            <span className="sr-only">Loading details…</span>
            {Array.from({ length: lines }, (_, index) => (
              <span
                key={`line-${index}`}
                aria-hidden="true"
                className={cn(
                  "block h-3 rounded-sm bg-muted",
                  index % 2 ? "w-3/4" : "w-full",
                )}
              />
            ))}
          </output>
        ) : (
          children
        )}
      </div>
    </CollapsiblePrimitive.Panel>
  );
}

interface KiraCollapsibleProps extends Omit<
  CollapsibleRootProps,
  "children" | "title"
> {
  title: React.ReactNode;
  children?: React.ReactNode;
  description?: string;
  disabledReason?: string;
  icon?: React.ReactNode;
  variant?: CollapsibleTriggerProps["variant"];
  size?: CollapsibleTriggerProps["size"];
  loading?: boolean;
  keepMounted?: boolean;
}

function KiraCollapsible({
  title,
  description,
  disabledReason,
  icon,
  variant,
  size,
  loading,
  keepMounted,
  children,
  ...props
}: KiraCollapsibleProps) {
  const descriptionId = React.useId();

  const buildTrigger = () => (
    <CollapsibleTrigger
      variant={variant}
      size={size}
      icon={icon}
      aria-describedby={
        description || disabledReason ? descriptionId : undefined
      }
    >
      {title}
    </CollapsibleTrigger>
  );

  const buildContent = () => (
    <CollapsibleContent size={size} loading={loading} keepMounted={keepMounted}>
      {children}
    </CollapsibleContent>
  );

  return (
    <Collapsible {...props}>
      {buildTrigger()}
      {(description || disabledReason) && (
        <p
          data-slot="collapsible-description"
          id={descriptionId}
          className="px-4 py-2 text-sm text-muted-foreground"
        >
          {props.disabled && disabledReason ? disabledReason : description}
        </p>
      )}
      {buildContent()}
    </Collapsible>
  );
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  KiraCollapsible,
  collapsibleTriggerVariants,
  collapsibleContentVariants,
};

export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
  KiraCollapsibleProps,
};

type renderCollapsibleTriggerPart1Args = {
  props: Omit<
    CollapsibleTriggerProps,
    | "className"
    | "children"
    | "variant"
    | "size"
    | "showArrow"
    | "chevronIcon"
    | "chevronPosition"
    | "icon"
  >;
  variant: CollapsibleTriggerProps["variant"];
  size: CollapsibleTriggerProps["size"];
  className: CollapsibleTriggerProps["className"];
  chevronPosition: Exclude<
    CollapsibleTriggerProps["chevronPosition"],
    undefined
  >;
  arrow: false | React.JSX.Element;
  icon: CollapsibleTriggerProps["icon"];
  children: CollapsibleTriggerProps["children"];
};

function renderCollapsibleTriggerPart1({
  props,
  variant,
  size,
  className,
  chevronPosition,
  arrow,
  icon,
  children,
}: renderCollapsibleTriggerPart1Args) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      {...props}
      className={(state) =>
        cn(
          collapsibleTriggerVariants({ variant, size }),
          isFunctionProp(className) ? className(state) : className,
        )
      }
    >
      {chevronPosition === "start" && arrow}
      {icon && (
        <span
          data-slot="collapsible-icon"
          aria-hidden="true"
          className="shrink-0"
        >
          {icon}
        </span>
      )}
      <span
        data-slot="collapsible-label"
        className="min-w-0 flex-1 wrap-break-word"
      >
        {children}
      </span>
      {chevronPosition === "end" && arrow}
    </CollapsiblePrimitive.Trigger>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const COLLAPSIBLE_CONTENT_DEFAULTS_1 = {
  inset: false,
  lazyMount: false,
  loading: false,
  skeletonLines: 3,
} as const;
