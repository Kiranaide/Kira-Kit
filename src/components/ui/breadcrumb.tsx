"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  IconChevronRight,
  IconSlash,
  IconDots,
  IconHome,
  IconLink,
  IconCheck,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const breadcrumbListVariants = cva(
  "flex flex-wrap items-center gap-1.5 break-words text-sm",
  {
    variants: {
      size: {
        sm: "text-xs gap-1",
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
  items: { href: string; label: string; current?: boolean }[];
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

function useBreadcrumbs(
  pathname: string,
  options: UseBreadcrumbsOptions = {},
): BreadcrumbItem[] {
  const {
    labels = {},
    includeHome = true,
    homeLabel = "Home",
    basePath = "",
  } = options;

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
      props: mergeProps<"a">(
        {
          "data-slot": "breadcrumb-link",
        } as React.AnchorHTMLAttributes<HTMLAnchorElement>,
        {
          ref,
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
                content={typeof children === "string" ? children : ""}
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
      <meta
        itemProp="name"
        content={typeof children === "string" ? children : ""}
      />
    </span>
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, items, onExpand, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fade + slide the menu in on open; reduced-motion users get an instant show.
  useGSAP(() => {
    if (!isOpen || !dropdownRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
      );
    });
    return () => mm.revert();
  }, [isOpen]);

  if (items && items.length > 0) {
    return (
      <span
        ref={ref}
        data-slot="breadcrumb-ellipsis"
        className={cn("relative", className)}
        {...props}
      >
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => {
            if (onExpand) {
              onExpand();
            } else {
              setIsOpen((prev) => !prev);
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Show hidden breadcrumbs"
        >
          <IconDots className="h-4 w-4" aria-hidden="true" />
        </button>
        {isOpen && (
          <div
            ref={dropdownRef}
            data-slot="breadcrumb-ellipsis-menu"
            className="absolute left-0 top-full z-50 mt-1 min-w-37.5 rounded-md border bg-popover p-1 shadow-md"
            role="menu"
          >
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                data-slot="breadcrumb-ellipsis-item"
                className="block rounded-sm px-3 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </span>
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
      props: mergeProps<"a">(
        {
          "data-slot": "breadcrumb-home",
        } as React.AnchorHTMLAttributes<HTMLAnchorElement>,
        {
          ref,
          itemProp: "item",
          className: cn(
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
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.href.startsWith("http")
          ? item.href
          : typeof window !== "undefined"
            ? `${window.location.origin}${item.href}`
            : item.href,
      })),
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

function BreadcrumbCollapsible({
  items,
  maxItems = 4,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 2,
  separator,
  size,
  linkVariant,
  homeIcon = false,
}: BreadcrumbCollapsibleProps) {
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
    item: { href: string; label: string; current?: boolean },
    index: number,
    position: number,
  ) => (
    <React.Fragment key={index}>
      {index > 0 && (
        <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
      )}
      <BreadcrumbItem>
        <meta itemProp="position" content={String(position)} />
        {item.current ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : homeIcon && index === 0 ? (
          <BreadcrumbHome
            href={item.href}
            showLabel={false}
            label={item.label}
          />
        ) : (
          <BreadcrumbLink href={item.href} variant={linkVariant}>
            {item.label}
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </React.Fragment>
  );

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

  const { beforeItems, afterItems, hiddenItems } = visibleItems as {
    beforeItems: typeof items;
    afterItems: typeof items;
    hiddenItems: typeof items;
  };

  let position = 0;

  return (
    <Breadcrumb separator={separator}>
      <BreadcrumbJsonLd
        items={items.map((i) => ({ name: i.label, href: i.href }))}
      />
      <BreadcrumbList size={size}>
        {beforeItems.map((item, index) => {
          position++;
          return renderItem(item, index, position);
        })}

        <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbEllipsis
            items={hiddenItems}
            onExpand={() => setIsExpanded(true)}
          />
        </BreadcrumbItem>

        {afterItems.map((item, index) => {
          position = items.length - itemsAfterCollapse + index + 1;
          return (
            <React.Fragment key={`after-${index}`}>
              <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <meta itemProp="position" content={String(position)} />
                {item.current ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href} variant={linkVariant}>
                    {item.label}
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

interface BreadcrumbResponsiveProps {
  items: { href: string; label: string; current?: boolean }[];

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

        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <BreadcrumbSeparator
                size={size}
                className={
                  index < items.length - mobileItems
                    ? "hidden md:flex"
                    : undefined
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
              {item.current ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : homeIcon && index === 0 ? (
                <BreadcrumbHome href={item.href} showLabel label={item.label} />
              ) : (
                <BreadcrumbLink href={item.href} variant={linkVariant}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// =============================================================================
// BreadcrumbActions — right-aligned trailing region for page-level actions
// =============================================================================

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

// =============================================================================
// BreadcrumbCopy — copy-the-current-path affordance with a copied-check flash
// =============================================================================

interface BreadcrumbCopyProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "value"> {
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
  const [copied, setCopied] = React.useState(false);
  const reduced = useReducedMotion();

  const handleCopy = () => {
    const text =
      value ??
      (typeof window !== "undefined" ? window.location.href : "");
    if (!text || typeof navigator === "undefined" || !navigator.clipboard)
      return;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), reduced ? 0 : 1500);
    });
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
      <span className="sr-only" role="status">
        {copied ? "Path copied" : label}
      </span>
    </button>
  );
}

// =============================================================================
// KiraBreadcrumb — one prop-driven entry point over the breadcrumb family
// =============================================================================

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
  className?: string;
}

function KiraBreadcrumb({
  items,
  separator,
  size,
  linkVariant,
  homeIcon = false,
  collapse = false,
  maxItems,
  itemsBeforeCollapse,
  itemsAfterCollapse,
  responsive = false,
  jsonLd = true,
  overflow = "collapse",
  actions,
  copyPath = false,
  className,
}: KiraBreadcrumbProps) {
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

  // Flat trail. In "scroll" mode the list is a horizontally scrollable row
  // with edge fade masks instead of collapsing.
  const scroll = overflow === "scroll";
  return (
    <Breadcrumb separator={separator} className={cn("flex items-center", className)}>
      {jsonLd && (
        <BreadcrumbJsonLd
          items={items.map((i) => ({ name: i.label, href: i.href }))}
        />
      )}
      <BreadcrumbList
        size={size}
        className={cn(
          scroll &&
            "flex-nowrap overflow-x-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]",
        )}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
            )}
            <BreadcrumbItem className={cn(scroll && "shrink-0")}>
              <meta itemProp="position" content={String(index + 1)} />
              {item.current ? (
                <BreadcrumbPage data-current="">
                  {item.icon}
                  {item.label}
                </BreadcrumbPage>
              ) : homeIcon && index === 0 ? (
                <BreadcrumbHome href={item.href} showLabel label={item.label} />
              ) : (
                <BreadcrumbLink href={item.href} variant={linkVariant}>
                  {item.icon}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
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
  KiraBreadcrumb,
  useBreadcrumbs,
  useBreadcrumbsFromMatches,
  useBreadcrumbContext,
  breadcrumbListVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
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
  KiraBreadcrumbProps,
  KiraBreadcrumbItem,
  UseBreadcrumbsOptions,
  BreadcrumbItem as BreadcrumbItemType,
};
