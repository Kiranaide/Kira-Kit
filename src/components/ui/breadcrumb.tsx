"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  IconChevronRight,
  IconSlash,
  IconDots,
  IconHome,
} from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ============================================================================
// VARIANTS
// ============================================================================

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
  }
)

const breadcrumbLinkVariants = cva(
  "inline-flex items-center gap-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        underline:
          "text-muted-foreground underline decoration-dotted underline-offset-4 hover:underline",
        ghost: "text-muted-foreground hover:bg-accent px-2 py-1 rounded-md -mx-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbSeparatorVariants = cva("flex items-center text-muted-foreground", {
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
})

// ============================================================================
// TYPES
// ============================================================================

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode
  maxItems?: number
  itemsBeforeCollapse?: number
  itemsAfterCollapse?: number
}

interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof breadcrumbListVariants> {}

interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {}

interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VariantProps<typeof breadcrumbLinkVariants> {
  asChild?: boolean
}

interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<"span"> {}

interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<"span"> {
  items?: { href: string; label: string }[]
  onExpand?: () => void
}

interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<"li">,
    VariantProps<typeof breadcrumbSeparatorVariants> {}

interface BreadcrumbHomeProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean
  showLabel?: boolean
  label?: string
}

interface BreadcrumbJsonLdProps {
  items: { name: string; href: string }[]
}

interface BreadcrumbCollapsibleProps {
  items: { href: string; label: string; current?: boolean }[]
  maxItems?: number
  itemsBeforeCollapse?: number
  itemsAfterCollapse?: number
  separator?: React.ReactNode
  size?: "sm" | "default" | "lg"
  linkVariant?: "default" | "underline" | "ghost"
  homeIcon?: boolean
}

interface UseBreadcrumbsOptions {
  /** Custom label mapping for path segments */
  labels?: Record<string, string>
  /** Whether to include home */
  includeHome?: boolean
  /** Home label */
  homeLabel?: string
  /** Base path to strip from the beginning */
  basePath?: string
}

interface BreadcrumbItem {
  href: string
  label: string
  current: boolean
}

// ============================================================================
// CONTEXT
// ============================================================================

interface BreadcrumbContextValue {
  separator?: React.ReactNode
  size?: "sm" | "default" | "lg"
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({})

const useBreadcrumbContext = () => React.useContext(BreadcrumbContext)

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Generate breadcrumb items from a pathname
 *
 * @example
 * ```tsx
 * const breadcrumbs = useBreadcrumbs("/products/electronics/phones", {
 *   labels: {
 *     products: "All Products",
 *     electronics: "Electronics",
 *     phones: "Phones",
 *   },
 * })
 * // Returns:
 * // [
 * //   { href: "/", label: "Home", current: false },
 * //   { href: "/products", label: "All Products", current: false },
 * //   { href: "/products/electronics", label: "Electronics", current: false },
 * //   { href: "/products/electronics/phones", label: "Phones", current: true },
 * // ]
 * ```
 */
function useBreadcrumbs(
  pathname: string,
  options: UseBreadcrumbsOptions = {}
): BreadcrumbItem[] {
  const {
    labels = {},
    includeHome = true,
    homeLabel = "Home",
    basePath = "",
  } = options

  return React.useMemo(() => {
    // Remove base path if provided
    let path = pathname
    if (basePath && path.startsWith(basePath)) {
      path = path.slice(basePath.length)
    }

    // Split path into segments
    const segments = path.split("/").filter(Boolean)

    const items: BreadcrumbItem[] = []

    // Add home if requested
    if (includeHome) {
      items.push({
        href: basePath || "/",
        label: homeLabel,
        current: segments.length === 0,
      })
    }

    // Build breadcrumb items from segments
    let currentPath = basePath || ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Get label from mapping or capitalize segment
      const label =
        labels[segment] ||
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())

      items.push({
        href: currentPath,
        label,
        current: index === segments.length - 1,
      })
    })

    return items
  }, [pathname, labels, includeHome, homeLabel, basePath])
}

/**
 * Generate breadcrumbs from route matches (for TanStack Router)
 */
function useBreadcrumbsFromMatches(
  matches: { pathname: string; meta?: { title?: string; breadcrumb?: string } }[]
): BreadcrumbItem[] {
  return React.useMemo(() => {
    return matches.map((match, index) => ({
      href: match.pathname,
      label: match.meta?.breadcrumb || match.meta?.title || match.pathname,
      current: index === matches.length - 1,
    }))
  }, [matches])
}

// ============================================================================
// COMPONENTS
// ============================================================================

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      separator,
      maxItems,
      itemsBeforeCollapse,
      itemsAfterCollapse,
      children,
      ...props
    },
    ref
  ) => {
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
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

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
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

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
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, variant, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        itemProp="item"
        className={cn(breadcrumbLinkVariants({ variant, className }))}
        {...props}
      >
        {children}
        <meta itemProp="name" content={typeof children === "string" ? children : ""} />
      </Comp>
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

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
      <meta itemProp="name" content={typeof children === "string" ? children : ""} />
    </span>
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, items, onExpand, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    // If items provided, render as dropdown
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
                onExpand()
              } else {
                setIsOpen((prev) => !prev)
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
              className="absolute left-0 top-full z-50 mt-1 min-w-[150px] rounded-md border bg-popover p-1 shadow-md"
              role="menu"
            >
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
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
      )
    }

    // Default: just show ellipsis icon
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
    )
  }
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, variant = "default", size, children, ...props }, ref) => {
    const context = useBreadcrumbContext()

    const renderSeparator = () => {
      // Use children if provided
      if (children) return children

      // Use context separator if provided
      if (context.separator) return context.separator

      // Render based on variant
      switch (variant) {
        case "dot":
          return (
            <span
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
              aria-hidden="true"
            />
          )
        case "slash":
          return <IconSlash aria-hidden="true" />
        case "chevron":
        default:
          return <IconChevronRight aria-hidden="true" />
      }
    }

    return (
      <li
        ref={ref}
        data-slot="breadcrumb-separator"
        className={cn(
          breadcrumbSeparatorVariants({ variant, size, className })
        )}
        aria-hidden="true"
        {...props}
      >
        {renderSeparator()}
      </li>
    )
  }
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbHome = React.forwardRef<HTMLAnchorElement, BreadcrumbHomeProps>(
  ({ className, asChild, showLabel = false, label = "Home", ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-home"
        itemProp="item"
        className={cn(
          "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          className
        )}
        aria-label={showLabel ? undefined : label}
        {...props}
      >
        <IconHome className="h-4 w-4" aria-hidden="true" />
        {showLabel && <span itemProp="name">{label}</span>}
        {!showLabel && <span className="sr-only" itemProp="name">{label}</span>}
      </Comp>
    )
  }
)
BreadcrumbHome.displayName = "BreadcrumbHome"

// ============================================================================
// JSON-LD STRUCTURED DATA
// ============================================================================

/**
 * Generates Schema.org BreadcrumbList JSON-LD for SEO
 *
 * @example
 * ```tsx
 * <BreadcrumbJsonLd
 *   items={[
 *     { name: "Home", href: "/" },
 *     { name: "Products", href: "/products" },
 *     { name: "Electronics", href: "/products/electronics" },
 *   ]}
 * />
 * ```
 */
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
    [items]
  )

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ============================================================================
// COLLAPSIBLE BREADCRUMB (Compound Component)
// ============================================================================

/**
 * Auto-collapsing breadcrumb that shows ellipsis for long paths
 *
 * @example
 * ```tsx
 * <BreadcrumbCollapsible
 *   items={[
 *     { href: "/", label: "Home" },
 *     { href: "/products", label: "Products" },
 *     { href: "/products/electronics", label: "Electronics" },
 *     { href: "/products/electronics/phones", label: "Phones" },
 *     { href: "/products/electronics/phones/iphone", label: "iPhone 15", current: true },
 *   ]}
 *   maxItems={4}
 *   homeIcon
 * />
 * ```
 */
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
  const [isExpanded, setIsExpanded] = React.useState(false)

  const shouldCollapse = items.length > maxItems && !isExpanded

  const visibleItems = React.useMemo(() => {
    if (!shouldCollapse) return items

    const beforeItems = items.slice(0, itemsBeforeCollapse)
    const afterItems = items.slice(-itemsAfterCollapse)
    const hiddenItems = items.slice(itemsBeforeCollapse, -itemsAfterCollapse)

    return { beforeItems, afterItems, hiddenItems }
  }, [items, shouldCollapse, itemsBeforeCollapse, itemsAfterCollapse])

  const renderItem = (item: { href: string; label: string; current?: boolean }, index: number, position: number) => (
    <React.Fragment key={index}>
      {index > 0 && <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>}
      <BreadcrumbItem>
        <meta itemProp="position" content={String(position)} />
        {item.current ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : homeIcon && index === 0 ? (
          <BreadcrumbHome href={item.href} showLabel={false} label={item.label} />
        ) : (
          <BreadcrumbLink href={item.href} variant={linkVariant}>
            {item.label}
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </React.Fragment>
  )

  if (!shouldCollapse) {
    return (
      <Breadcrumb separator={separator}>
        <BreadcrumbJsonLd items={items.map((i) => ({ name: i.label, href: i.href }))} />
        <BreadcrumbList size={size}>
          {items.map((item, index) => renderItem(item, index, index + 1))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const { beforeItems, afterItems, hiddenItems } = visibleItems as {
    beforeItems: typeof items
    afterItems: typeof items
    hiddenItems: typeof items
  }

  let position = 0

  return (
    <Breadcrumb separator={separator}>
      <BreadcrumbJsonLd items={items.map((i) => ({ name: i.label, href: i.href }))} />
      <BreadcrumbList size={size}>
        {/* Before items */}
        {beforeItems.map((item, index) => {
          position++
          return renderItem(item, index, position)
        })}

        {/* Ellipsis with dropdown */}
        <BreadcrumbSeparator size={size}>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbEllipsis
            items={hiddenItems}
            onExpand={() => setIsExpanded(true)}
          />
        </BreadcrumbItem>

        {/* After items */}
        {afterItems.map((item, index) => {
          position = items.length - itemsAfterCollapse + index + 1
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
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// ============================================================================
// RESPONSIVE BREADCRUMB
// ============================================================================

interface BreadcrumbResponsiveProps {
  items: { href: string; label: string; current?: boolean }[]
  /** Number of items to show on mobile (default: 2 - parent + current) */
  mobileItems?: number
  separator?: React.ReactNode
  size?: "sm" | "default" | "lg"
  linkVariant?: "default" | "underline" | "ghost"
  homeIcon?: boolean
}

/**
 * Responsive breadcrumb that collapses on mobile
 */
function BreadcrumbResponsive({
  items,
  mobileItems = 2,
  separator,
  size,
  linkVariant,
  homeIcon = false,
}: BreadcrumbResponsiveProps) {
  // On mobile, show only last N items
  const mobileHiddenItems = items.slice(0, -mobileItems)

  return (
    <Breadcrumb separator={separator}>
      <BreadcrumbJsonLd items={items.map((i) => ({ name: i.label, href: i.href }))} />
      <BreadcrumbList size={size}>
        {/* Mobile: Show ellipsis if items are hidden */}
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

        {/* Desktop: All items */}
        {items.map((item, index) => (
          <React.Fragment key={index}>
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
                index < items.length - mobileItems ? "hidden md:inline-flex" : undefined
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
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Core components
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbEllipsis,
  BreadcrumbSeparator,
  BreadcrumbHome,
  // Compound components
  BreadcrumbJsonLd,
  BreadcrumbCollapsible,
  BreadcrumbResponsive,
  // Hooks
  useBreadcrumbs,
  useBreadcrumbsFromMatches,
  useBreadcrumbContext,
  // Variants
  breadcrumbListVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
}

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
  UseBreadcrumbsOptions,
  BreadcrumbItem as BreadcrumbItemType,
}
