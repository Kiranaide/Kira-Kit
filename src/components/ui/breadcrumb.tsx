"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Menu } from "@base-ui/react/menu";
import {
  IconChevronRight,
  IconSlash,
  IconDots,
  IconHome,
  IconLink,
  IconCheck,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isStringProp } from "@/lib/component-prop-guards";

const breadcrumbListVariants = cva(
  // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
  "flex flex-wrap items-center gap-1.5 break-words text-sm",
  {
    variants: {
      size: {
        sm: "text-xs gap-1",
        // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
        default: "text-sm gap-1.5",
        lg: "text-base gap-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const breadcrumbLinkVariants = cva(
  // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
  "inline-flex items-center gap-1.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        underline:
          "text-muted-foreground underline decoration-dotted underline-offset-4 hover:underline",
        ghost:
          "text-muted-foreground hover:bg-accent px-2 py-1 rounded-md -mx-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const breadcrumbSeparatorVariants = cva(
  "flex items-center text-muted-foreground",
  {
    variants: {
      variant: {
        default: "",
        slash: "text-muted-foreground/50",
        chevron: "text-muted-foreground/70",
        dot: "",
      },
      size: {
        sm: "[&>svg]:h-3 [&>svg]:w-3",
        default: "[&>svg]:h-4 [&>svg]:w-4",
        lg: "[&>svg]:h-5 [&>svg]:w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
}

interface BreadcrumbListProps
  extends
    React.ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof breadcrumbListVariants> {}

type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li">;

interface BreadcrumbLinkProps
  extends
    React.ComponentPropsWithoutRef<"a">,
    VariantProps<typeof breadcrumbLinkVariants> {
  render?: useRender.RenderProp;
}

type BreadcrumbPageProps = React.ComponentPropsWithoutRef<"span">;

interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<"span"> {
  items?: { href: string; label: string }[];
  onExpand?: () => void;
}

interface BreadcrumbSeparatorProps
  extends
    React.ComponentPropsWithoutRef<"li">,
    VariantProps<typeof breadcrumbSeparatorVariants> {}

interface BreadcrumbHomeProps extends React.ComponentPropsWithoutRef<"a"> {
  render?: useRender.RenderProp;
  showLabel?: boolean;
  label?: string;
}

interface BreadcrumbJsonLdProps {
  items: { name: string; href: string }[];
}

interface BreadcrumbCollapsibleProps {
  items: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  separator?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  linkVariant?: "default" | "underline" | "ghost";
  homeIcon?: boolean;
}

interface UseBreadcrumbsOptions {
  labels?: Record<string, string>;

  includeHome?: boolean;

  homeLabel?: string;

  basePath?: string;
}

interface BreadcrumbItem {
  href: string;
  label: string;
  current: boolean;
}

interface BreadcrumbContextValue {
  separator?: React.ReactNode;
  size?: "sm" | "default" | "lg";
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({});

const useBreadcrumbContext = () => React.useContext(BreadcrumbContext);

/**
 * Fixed-width middle truncation for long crumb labels: `start…end`, keeping
 * ~10 chars per side. Labels ≤ max pass through untouched.
 */
function truncateMiddle(label: string, max = 24): string {
  if (label.length <= max) return label;
  const keep = Math.floor((max - 1) / 2);

  return `${label.slice(0, keep)}…${label.slice(-keep)}`;
}

function useBreadcrumbs(
  pathname: string,
  options: UseBreadcrumbsOptions = {},
): BreadcrumbItem[] {
  const { labels, includeHome, homeLabel, basePath } = resolveComponentDefaults(
    options,
    { labels: {}, includeHome: true, homeLabel: "Home", basePath: "" },
  );

  return React.useMemo(() => {
    let path = pathname;

    if (basePath && path.startsWith(basePath)) {
      path = path.slice(basePath.length);
    }

    const segments = path.split("/").filter(Boolean);

    const items: BreadcrumbItem[] = [];

    if (includeHome) {
      items.push({
        href: basePath || "/",
        label: homeLabel,
        current: segments.length === 0,
      });
    }

    let currentPath = basePath || "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const label =
        labels[segment] ||
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

      items.push({
        href: currentPath,
        label,
        current: index === segments.length - 1,
      });
    });

    return items;
  }, [pathname, labels, includeHome, homeLabel, basePath]);
}

function useBreadcrumbsFromMatches(
  matches: {
    pathname: string;
    meta?: { title?: string; breadcrumb?: string };
  }[],
): BreadcrumbItem[] {
  return React.useMemo(() => {
    return matches.map((match, index) => ({
      href: match.pathname,
      label: match.meta?.breadcrumb || match.meta?.title || match.pathname,
      current: index === matches.length - 1,
    }));
  }, [matches]);
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator, children, ...props }, ref) => {
    return (
      <BreadcrumbContext.Provider value={{ separator }}>
        <nav
          ref={ref}
          data-slot="breadcrumb"
          className={cn("relative", className)}
          aria-label="Breadcrumb"
          {...props}
        >
          {children}
        </nav>
      </BreadcrumbContext.Provider>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, size, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className={cn(breadcrumbListVariants({ size, className }))}
      {...props}
    />
  ),
);

BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      itemScope
      itemProp="itemListElement"
      itemType="https://schema.org/ListItem"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  ),
);

BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, variant, render, children, ...props }, ref) => {
    const reduced = useReducedMotion();

    return useRender({
      defaultTagName: "a",
      render,
      ref,
      props: mergeProps<"a">(
        // SAFETY: The default data-slot object is a valid anchor-props object.
        {
          "data-slot": "breadcrumb-link",
        } as React.AnchorHTMLAttributes<HTMLAnchorElement>,
        {
          itemProp: "item",
          className: cn(
            breadcrumbLinkVariants({ variant, className }),
            !reduced && "transition-colors",
          ),
          children: (
            <>
              {children}
              <meta
                itemProp="name"
                content={isStringProp(children) ? children : ""}
              />
            </>
          ),
        },
        props,
      ),
    });
  },
);

BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      aria-current="page"
      itemProp="item"
      className={cn("font-medium text-foreground", className)}
      {...props}
    >
      {children}
      <meta itemProp="name" content={isStringProp(children) ? children : ""} />
    </span>
  ),
);

BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, items, onExpand: _onExpand, ...props }, ref) => {
  if (items && items.length > 0) {
    return (
      <Menu.Root>
        <span
          ref={ref}
          data-slot="breadcrumb-ellipsis"
          className={cn("relative", className)}
          {...props}
        >
          <Menu.Trigger
            aria-label="Show hidden breadcrumbs"
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <IconDots className="h-4 w-4" aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="start" sideOffset={4}>
              <Menu.Popup
                data-slot="breadcrumb-ellipsis-menu"
                className="z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg max-h-(--available-height) overflow-y-auto origin-(--transform-original) outline-none data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 data-open:zoom-in-95 data-closed:zoom-out-95"
              >
                {items.map((item) => (
                  <Menu.Item
                    key={item.href}
                    data-slot="breadcrumb-ellipsis-item"
                    className="block rounded-sm px-3 py-2 text-sm text-popover-foreground outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground cursor-default"
                  >
                    <a href={item.href}>{item.label}</a>
                  </Menu.Item>
                ))}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </span>
      </Menu.Root>
    );
  }

  return (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <IconDots className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">More</span>
    </span>
  );
});

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, variant = "default", size, children, ...props }, ref) => {
  const context = useBreadcrumbContext();

  const renderSeparator = () => {
    if (children) return children;

    if (context.separator) return context.separator;

    switch (variant) {
      case "dot":
        return (
          // kira-kit-ignore spacing-scale: non-control indicator dot on the compact ladder
          <span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
            aria-hidden="true"
          />
        );
      case "slash":
        return <IconSlash aria-hidden="true" />;
      case "chevron":
      default:
        return <IconChevronRight aria-hidden="true" />;
    }
  };

  return (
    <li
      ref={ref}
      data-slot="breadcrumb-separator"
      className={cn(breadcrumbSeparatorVariants({ variant, size, className }))}
      aria-hidden="true"
      {...props}
    >
      {renderSeparator()}
    </li>
  );
});

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbHome = React.forwardRef<HTMLAnchorElement, BreadcrumbHomeProps>(
  ({ className, render, showLabel = false, label = "Home", ...props }, ref) => {
    const reduced = useReducedMotion();

    return useRender({
      defaultTagName: "a",
      render,
      ref,
      props: mergeProps<"a">(
        // SAFETY: The default data-slot object is a valid anchor-props object.
        {
          "data-slot": "breadcrumb-home",
        } as React.AnchorHTMLAttributes<HTMLAnchorElement>,
        {
          itemProp: "item",
          className: cn(
            // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
            "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
            !reduced && "transition-colors",
            className,
          ),
          "aria-label": showLabel ? undefined : label,
          children: (
            <>
              <IconHome className="h-4 w-4" aria-hidden="true" />
              {showLabel && <span itemProp="name">{label}</span>}
              {!showLabel && (
                <span className="sr-only" itemProp="name">
                  {label}
                </span>
              )}
            </>
          ),
        },
        props,
      ),
    });
  },
);

BreadcrumbHome.displayName = "BreadcrumbHome";

function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = React.useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => {
        const resolveItem1 = () => {
          if (item.href.startsWith("http")) {
            return item.href;
          }

          if (typeof window === "undefined") {
            return item.href;
          }

          return `${window.location.origin}${item.href}`;
        };

        return {
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: resolveItem1(),
        };
      }),
    }),
    [items],
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbCollapsible(input: BreadcrumbCollapsibleProps) {
  const {
    items,
    itemsBeforeCollapse = BREADCRUMB_COLLAPSIBLE_DEFAULTS_1.itemsBeforeCollapse,
    itemsAfterCollapse = BREADCRUMB_COLLAPSIBLE_DEFAULTS_1.itemsAfterCollapse,
  } = input;

  const { maxItems, separator, size, linkVariant, homeIcon } =
    resolveComponentDefaults(input, BREADCRUMB_COLLAPSIBLE_DEFAULTS_1);

  const [isExpanded, setIsExpanded] = React.useState(false);

  const shouldCollapse = items.length > maxItems && !isExpanded;

  const visibleItems = React.useMemo(() => {
    if (!shouldCollapse) return items;

    const beforeItems = items.slice(0, itemsBeforeCollapse);
    const afterItems = items.slice(-itemsAfterCollapse);
    const hiddenItems = items.slice(itemsBeforeCollapse, -itemsAfterCollapse);

    return { beforeItems, afterItems, hiddenItems };
  }, [items, shouldCollapse, itemsBeforeCollapse, itemsAfterCollapse]);

  const renderItem = (
    item: (typeof items)[number],
    index: number,
    position: number,
  ) =>
    renderBreadcrumbItem({
      item,
      index,
      position,
      size,
      separator,
      linkVariant,
      homeIcon,
    });

  if (!shouldCollapse) {
    return (
      <Breadcrumb separator={separator}>
        <BreadcrumbJsonLd
          items={items.map((i) => ({ name: i.label, href: i.href }))}
        />
        <BreadcrumbList size={size}>
          {items.map((item, index) => renderItem(item, index, index + 1))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // SAFETY: when shouldCollapse the useMemo above returned an object, not an array.
  const { beforeItems, afterItems, hiddenItems } = visibleItems as {
    beforeItems: typeof items;
    afterItems: typeof items;
    hiddenItems: typeof items;
  };

  return renderBreadcrumbCollapsibleView({
    separator,
    items,
    size,
    beforeItems,
    renderItem,
    hiddenItems,
    setIsExpanded,
    afterItems,
    itemsAfterCollapse,
    linkVariant,
  });
}

function renderBreadcrumbItem({
  item,
  index,
  position,
  size,
  separator,
  linkVariant,
  homeIcon,
}: {
  item: BreadcrumbCollapsibleProps["items"][number];
  index: number;
  position: number;
  size: BreadcrumbCollapsibleProps["size"];
  separator: BreadcrumbCollapsibleProps["separator"];
  linkVariant: BreadcrumbCollapsibleProps["linkVariant"];
  homeIcon: BreadcrumbCollapsibleProps["homeIcon"];
}) {
  let content: React.ReactNode;

  if (item.current) {
    content = (
      <BreadcrumbPage>
        {item.icon}
        {item.label}
      </BreadcrumbPage>
    );
  } else if (homeIcon && index === 0) {
    content = (
      <BreadcrumbHome href={item.href} showLabel={false} label={item.label} />
    );
  } else {
    content = (
      <BreadcrumbLink
        href={item.href}
        variant={linkVariant}
        title={
          truncateMiddle(item.label) === item.label ? undefined : item.label
        }
      >
        {item.icon}
        {truncateMiddle(item.label)}
      </BreadcrumbLink>
    );
  }

  return (
    <React.Fragment key={item.href}>
      {index > 0 && (
        <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
      )}
      <BreadcrumbItem>
        <meta itemProp="position" content={String(position)} />
        {content}
      </BreadcrumbItem>
    </React.Fragment>
  );
}

interface BreadcrumbResponsiveProps {
  items: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];

  mobileItems?: number;
  separator?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  linkVariant?: "default" | "underline" | "ghost";
  homeIcon?: boolean;
}

function BreadcrumbResponsive({
  items,
  mobileItems = 2,
  separator,
  size,
  linkVariant,
  homeIcon = false,
}: BreadcrumbResponsiveProps) {
  const mobileHiddenItems = items.slice(0, -mobileItems);

  return (
    <Breadcrumb separator={separator}>
      <BreadcrumbJsonLd
        items={items.map((i) => ({ name: i.label, href: i.href }))}
      />
      <BreadcrumbList size={size}>
        {mobileHiddenItems.length > 0 && (
          <>
            <BreadcrumbItem className="md:hidden">
              <BreadcrumbEllipsis items={mobileHiddenItems} />
            </BreadcrumbItem>
            <BreadcrumbSeparator size={size} className="md:hidden">
              {separator}
            </BreadcrumbSeparator>
          </>
        )}

        {items.map((item, index) => {
          const resolveValue3 = () => {
            if (item.current) {
              return (
                <BreadcrumbPage>
                  {item.icon}
                  {item.label}
                </BreadcrumbPage>
              );
            }

            if (homeIcon && index === 0) {
              return (
                <BreadcrumbHome href={item.href} showLabel label={item.label} />
              );
            }

            return (
              <BreadcrumbLink
                href={item.href}
                variant={linkVariant}
                title={
                  truncateMiddle(item.label) === item.label
                    ? undefined
                    : item.label
                }
              >
                {item.icon}
                {truncateMiddle(item.label)}
              </BreadcrumbLink>
            );
          };

          return renderBreadcrumbtsxSectionPart2({
            item,
            index,
            size,
            items,
            mobileItems,
            separator,
            resolveValue3,
          });
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface BreadcrumbMobileMenuProps {
  items: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

function BreadcrumbMobileMenu({ items, className }: BreadcrumbMobileMenuProps) {
  const current = items[items.length - 1];
  const ancestors = items.slice(0, -1);

  if (!current) return null;

  return (
    <Menu.Root>
      <div className={cn("md:hidden", className)}>
        {/* kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept */}
        <Menu.Trigger
          aria-label={`Navigate to ancestors of ${current.label}`}
          className="inline-flex items-center gap-1.5 rounded-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {current.icon}
          {truncateMiddle(current.label)}
          <IconChevronRight
            className="h-4 w-4 rotate-90 text-muted-foreground"
            aria-hidden="true"
          />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner align="start" sideOffset={4}>
            <Menu.Popup
              data-slot="breadcrumb-mobile-menu"
              className="z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg max-h-(--available-height) overflow-y-auto origin-(--transform-original) outline-none data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 data-open:zoom-in-95 data-closed:zoom-out-95"
            >
              {ancestors.length === 0 ? (
                <Menu.Item
                  disabled
                  className="block rounded-sm px-3 py-2 text-sm text-muted-foreground"
                >
                  No ancestors
                </Menu.Item>
              ) : (
                ancestors.map((item) => (
                  <Menu.Item
                    key={item.href}
                    data-slot="breadcrumb-mobile-menu-item"
                    className="block rounded-sm px-3 py-2 text-sm text-popover-foreground outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground cursor-default"
                  >
                    <a href={item.href}>
                      {item.icon}
                      {item.label}
                    </a>
                  </Menu.Item>
                ))
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </div>
    </Menu.Root>
  );
}

type BreadcrumbActionsProps = React.ComponentPropsWithoutRef<"div">;

function BreadcrumbActions({
  className,
  children,
  ...props
}: BreadcrumbActionsProps) {
  return (
    <div
      data-slot="breadcrumb-actions"
      className={cn("ml-auto flex items-center gap-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface BreadcrumbCopyProps extends Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value"
> {
  /** Full path/URL to copy. Defaults to `window.location.href`. */
  value?: string;
  label?: string;
}

function BreadcrumbCopy({
  value,
  label = "Copy path",
  className,
  ...props
}: BreadcrumbCopyProps) {
  const resolveValue4 = () => {
    if (copied) {
      return "Path copied" as const;
    }

    if (copyError) {
      return "Copy failed — press Ctrl+C to copy the path from the address bar" as const;
    }

    return label;
  };

  const [copied, setCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState(false);
  const resetTimer = React.useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();

  React.useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleCopy = () => {
    const text =
      value ?? (typeof window === "undefined" ? "" : window.location.href);

    if (!text || typeof navigator === "undefined" || !navigator.clipboard)
      return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setCopyError(false);
        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(
          () => setCopied(false),
          reduced ? 0 : 1500,
        );
      },
      () => {
        // Clipboard write rejected (permissions/focus): surface an sr-only hint instead of failing silently.
        setCopied(false);
        setCopyError(true);
        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(() => setCopyError(false), 3000);
      },
    );
  };

  return (
    <button
      type="button"
      data-slot="breadcrumb-copy"
      onClick={handleCopy}
      aria-label={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        !reduced && "transition-colors",
        className,
      )}
      {...props}
    >
      {copied ? (
        <IconCheck className="h-4 w-4 text-success" aria-hidden="true" />
      ) : (
        <IconLink className="h-4 w-4" aria-hidden="true" />
      )}
      <output className="sr-only">{resolveValue4()}</output>
    </button>
  );
}

interface KiraBreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
  icon?: React.ReactNode;
}

interface KiraBreadcrumbProps {
  items: KiraBreadcrumbItem[];
  separator?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  linkVariant?: "default" | "underline" | "ghost";
  homeIcon?: boolean;
  /** Collapse the middle of a long trail behind an ellipsis. */
  collapse?: boolean;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  /** Mobile-first: hide all but the last N crumbs behind an ellipsis. */
  responsive?: boolean;
  /** Emit SEO JSON-LD (default true). */
  jsonLd?: boolean;
  /** "collapse" (default) or "scroll" — a horizontally scrollable row. */
  overflow?: "collapse" | "scroll";
  /** Right-aligned trailing actions region. */
  actions?: React.ReactNode;
  /** Show a copy-current-path affordance in the actions region. */
  copyPath?: boolean;
  /**
   * Mobile-first ancestor menu: on <md, collapse the trail to the current
   * page with a chevron trigger listing all ancestors (Base UI Menu).
   */
  mobileMenu?: boolean;
  className?: string;
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function KiraBreadcrumb(input: KiraBreadcrumbProps) {
  const {
    items,
    separator,
    size,
    linkVariant,
    homeIcon,
    collapse,
    maxItems,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    responsive,
    jsonLd,
    overflow,
    actions,
    copyPath,
    mobileMenu,
    className,
  } = resolveComponentDefaults(input, KIRA_BREADCRUMB_DEFAULTS_2);

  const trailing =
    actions || copyPath ? (
      <BreadcrumbActions>
        {actions}
        {copyPath && <BreadcrumbCopy />}
      </BreadcrumbActions>
    ) : null;

  // Collapse / responsive delegate to the existing rich sub-components.
  if (responsive) {
    return (
      <div className={cn("flex items-center", className)}>
        <BreadcrumbResponsive
          items={items}
          separator={separator}
          size={size}
          linkVariant={linkVariant}
          homeIcon={homeIcon}
        />
        {trailing}
      </div>
    );
  }

  if (collapse) {
    return renderKiraBreadcrumbSectionPart3({
      className,
      items,
      separator,
      size,
      linkVariant,
      homeIcon,
      maxItems,
      itemsBeforeCollapse,
      itemsAfterCollapse,
      trailing,
    });
  }

  // Flat trail. In "scroll" mode the list is a horizontally scrollable row
  // with edge fade masks instead of collapsing.
  const scroll = overflow === "scroll";

  if (mobileMenu) {
    return renderKiraBreadcrumbSectionPart4({
      separator,
      className,
      jsonLd,
      items,
      size,
      homeIcon,
      linkVariant,
      trailing,
    });
  }

  return (
    <Breadcrumb
      separator={separator}
      className={cn("flex items-center", className)}
    >
      {jsonLd && (
        <BreadcrumbJsonLd
          items={items.map((i) => ({ name: i.label, href: i.href }))}
        />
      )}
      {renderKiraBreadcrumbSectionPart5({
        size,
        scroll,
        items,
        homeIcon,
        linkVariant,
        separator,
      })}
      {trailing}
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbEllipsis,
  BreadcrumbSeparator,
  BreadcrumbHome,
  BreadcrumbJsonLd,
  BreadcrumbCollapsible,
  BreadcrumbResponsive,
  BreadcrumbActions,
  BreadcrumbCopy,
  BreadcrumbMobileMenu,
  KiraBreadcrumb,
  useBreadcrumbs,
  useBreadcrumbsFromMatches,
  useBreadcrumbContext,
  breadcrumbListVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
  truncateMiddle,
};

export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbEllipsisProps,
  BreadcrumbSeparatorProps,
  BreadcrumbHomeProps,
  BreadcrumbJsonLdProps,
  BreadcrumbCollapsibleProps,
  BreadcrumbResponsiveProps,
  BreadcrumbActionsProps,
  BreadcrumbCopyProps,
  BreadcrumbMobileMenuProps,
  KiraBreadcrumbProps,
  KiraBreadcrumbItem,
  UseBreadcrumbsOptions,
  BreadcrumbItem as BreadcrumbItemType,
};

type renderBreadcrumbCollapsibleSectionPart1Args = {
  separator: BreadcrumbCollapsibleProps["separator"];
  items: BreadcrumbCollapsibleProps["items"];
  size: BreadcrumbCollapsibleProps["size"];
  beforeItems: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  renderItem: (
    item: {
      href: string;
      label: string;
      current?: boolean;
      icon?: React.ReactNode;
    },
    index: number,
    position: number,
  ) => React.JSX.Element;
  hiddenItems: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  afterItems: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  itemsAfterCollapse: number;
  linkVariant: BreadcrumbCollapsibleProps["linkVariant"];
};

function renderBreadcrumbCollapsibleSectionPart1({
  separator,
  items,
  size,
  beforeItems,
  renderItem,
  hiddenItems,
  setIsExpanded,
  afterItems,
  itemsAfterCollapse,
  linkVariant,
}: renderBreadcrumbCollapsibleSectionPart1Args) {
  return (
    <Breadcrumb separator={separator}>
      <BreadcrumbJsonLd
        items={items.map((i) => ({ name: i.label, href: i.href }))}
      />
      <BreadcrumbList size={size}>
        {beforeItems.map((item, index) => renderItem(item, index, index + 1))}

        <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbEllipsis
            items={hiddenItems}
            onExpand={() => setIsExpanded(true)}
          />
        </BreadcrumbItem>

        {afterItems.map((item, index) => {
          const position = items.length - itemsAfterCollapse + index + 1;

          return (
            <React.Fragment key={item.href}>
              <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <meta itemProp="position" content={String(position)} />
                {item.current ? (
                  <BreadcrumbPage>
                    {item.icon}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    variant={linkVariant}
                    title={
                      truncateMiddle(item.label) === item.label
                        ? undefined
                        : item.label
                    }
                  >
                    {item.icon}
                    {truncateMiddle(item.label)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type renderBreadcrumbtsxSectionPart2Args = {
  item: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  };
  index: number;
  size: BreadcrumbResponsiveProps["size"];
  items: BreadcrumbResponsiveProps["items"];
  mobileItems: Exclude<BreadcrumbResponsiveProps["mobileItems"], undefined>;
  separator: BreadcrumbResponsiveProps["separator"];
  resolveValue3: () => React.JSX.Element;
};

function renderBreadcrumbtsxSectionPart2({
  item,
  index,
  size,
  items,
  mobileItems,
  separator,
  resolveValue3,
}: renderBreadcrumbtsxSectionPart2Args) {
  return (
    <React.Fragment key={item.href}>
      {index > 0 && (
        <BreadcrumbSeparator
          size={size}
          className={
            index < items.length - mobileItems ? "hidden md:flex" : undefined
          }
        >
          {separator}
        </BreadcrumbSeparator>
      )}
      <BreadcrumbItem
        className={
          index < items.length - mobileItems
            ? "hidden md:inline-flex"
            : undefined
        }
      >
        <meta itemProp="position" content={String(index + 1)} />
        {resolveValue3()}
      </BreadcrumbItem>
    </React.Fragment>
  );
}

type renderKiraBreadcrumbSectionPart3Args = {
  className: KiraBreadcrumbProps["className"];
  items: KiraBreadcrumbProps["items"];
  separator: KiraBreadcrumbProps["separator"];
  size: KiraBreadcrumbProps["size"];
  linkVariant: KiraBreadcrumbProps["linkVariant"];
  homeIcon: boolean;
  maxItems: KiraBreadcrumbProps["maxItems"];
  itemsBeforeCollapse: KiraBreadcrumbProps["itemsBeforeCollapse"];
  itemsAfterCollapse: KiraBreadcrumbProps["itemsAfterCollapse"];
  trailing: React.JSX.Element | null;
};

function renderKiraBreadcrumbSectionPart3({
  className,
  items,
  separator,
  size,
  linkVariant,
  homeIcon,
  maxItems,
  itemsBeforeCollapse,
  itemsAfterCollapse,
  trailing,
}: renderKiraBreadcrumbSectionPart3Args) {
  return (
    <div className={cn("flex items-center", className)}>
      <BreadcrumbCollapsible
        items={items}
        separator={separator}
        size={size}
        linkVariant={linkVariant}
        homeIcon={homeIcon}
        maxItems={maxItems}
        itemsBeforeCollapse={itemsBeforeCollapse}
        itemsAfterCollapse={itemsAfterCollapse}
      />
      {trailing}
    </div>
  );
}

type renderKiraBreadcrumbSectionPart4Args = {
  separator: KiraBreadcrumbProps["separator"];
  className: KiraBreadcrumbProps["className"];
  jsonLd: boolean;
  items: KiraBreadcrumbProps["items"];
  size: KiraBreadcrumbProps["size"];
  homeIcon: boolean;
  linkVariant: KiraBreadcrumbProps["linkVariant"];
  trailing: React.JSX.Element | null;
};

function renderKiraBreadcrumbSectionPart4({
  separator,
  className,
  jsonLd,
  items,
  size,
  homeIcon,
  linkVariant,
  trailing,
}: renderKiraBreadcrumbSectionPart4Args) {
  return (
    <Breadcrumb
      separator={separator}
      className={cn("flex items-center", className)}
    >
      {jsonLd && (
        <BreadcrumbJsonLd
          items={items.map((i) => ({ name: i.label, href: i.href }))}
        />
      )}
      <BreadcrumbMobileMenu items={items} />
      {/* kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept */}
      <BreadcrumbList
        size={size}
        className="hidden md:flex flex-wrap items-center gap-1.5 wrap-break-word text-sm"
      >
        {items.map((item, index) => {
          const resolveValue5 = () => {
            if (item.current) {
              return (
                <BreadcrumbPage data-current="">
                  {item.icon}
                  {item.label}
                </BreadcrumbPage>
              );
            }

            if (homeIcon && index === 0) {
              return (
                <BreadcrumbHome href={item.href} showLabel label={item.label} />
              );
            }

            return (
              <BreadcrumbLink href={item.href} variant={linkVariant}>
                {item.icon}
                {item.label}
              </BreadcrumbLink>
            );
          };

          return (
            <React.Fragment key={item.href}>
              {index > 0 && (
                <BreadcrumbSeparator size={size}>
                  {separator}
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                <meta itemProp="position" content={String(index + 1)} />
                {resolveValue5()}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
      {trailing}
    </Breadcrumb>
  );
}

type renderKiraBreadcrumbSectionPart5Args = {
  size: KiraBreadcrumbProps["size"];
  scroll: boolean;
  items: KiraBreadcrumbProps["items"];
  homeIcon: boolean;
  linkVariant: KiraBreadcrumbProps["linkVariant"];
  separator: KiraBreadcrumbProps["separator"];
};

function renderKiraBreadcrumbSectionPart5({
  size,
  scroll,
  items,
  homeIcon,
  linkVariant,
  separator,
}: renderKiraBreadcrumbSectionPart5Args) {
  return (
    <BreadcrumbList
      size={size}
      className={cn(
        scroll &&
          "flex-nowrap overflow-x-auto overscroll-contain scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mask-[linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]",
      )}
    >
      {items.map((item, index) => {
        const resolveValue6 = () => {
          if (item.current) {
            return (
              <BreadcrumbPage data-current="">
                {item.icon}
                {item.label}
              </BreadcrumbPage>
            );
          }

          if (homeIcon && index === 0) {
            return (
              <BreadcrumbHome href={item.href} showLabel label={item.label} />
            );
          }

          return (
            <BreadcrumbLink
              href={item.href}
              variant={linkVariant}
              title={
                truncateMiddle(item.label) === item.label
                  ? undefined
                  : item.label
              }
            >
              {item.icon}
              {truncateMiddle(item.label)}
            </BreadcrumbLink>
          );
        };

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
            )}
            <BreadcrumbItem className={cn(scroll && "shrink-0")}>
              <meta itemProp="position" content={String(index + 1)} />
              {resolveValue6()}
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}
    </BreadcrumbList>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const BREADCRUMB_COLLAPSIBLE_DEFAULTS_1 = {
  maxItems: 4,
  itemsBeforeCollapse: 1,
  itemsAfterCollapse: 2,
  homeIcon: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_BREADCRUMB_DEFAULTS_2 = {
  homeIcon: false,
  collapse: false,
  responsive: false,
  jsonLd: true,
  overflow: "collapse",
  copyPath: false,
  mobileMenu: false,
} as const;

type renderBreadcrumbCollapsibleViewArgs = {
  separator: BreadcrumbCollapsibleProps["separator"];
  items: BreadcrumbCollapsibleProps["items"];
  size: BreadcrumbCollapsibleProps["size"];
  beforeItems: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  renderItem: (
    item: {
      href: string;
      label: string;
      current?: boolean;
      icon?: React.ReactNode;
    },
    index: number,
    position: number,
  ) => React.JSX.Element;
  hiddenItems: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  afterItems: {
    href: string;
    label: string;
    current?: boolean;
    icon?: React.ReactNode;
  }[];
  itemsAfterCollapse: number;
  linkVariant: BreadcrumbCollapsibleProps["linkVariant"];
};

function renderBreadcrumbCollapsibleView({
  separator,
  items,
  size,
  beforeItems,
  renderItem,
  hiddenItems,
  setIsExpanded,
  afterItems,
  itemsAfterCollapse,
  linkVariant,
}: renderBreadcrumbCollapsibleViewArgs) {
  return renderBreadcrumbCollapsibleSectionPart1({
    separator,
    items,
    size,
    beforeItems,
    renderItem,
    hiddenItems,
    setIsExpanded,
    afterItems,
    itemsAfterCollapse,
    linkVariant,
  });
}
