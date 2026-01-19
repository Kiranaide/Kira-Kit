"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  usePagination,
  type UsePaginationOptions,
  type UsePaginationReturn,
  type PageRangeItem,
} from "@/hooks/use-pagination";

// ============================================
// CONTEXT
// ============================================

interface PaginationContextValue extends UsePaginationReturn {
  size: "sm" | "default" | "lg";
  variant: "default" | "outline" | "pills" | "ghost" | "rounded";
  color: "default" | "primary" | "success" | "warning" | "destructive";
  disabled: boolean;
  /** ID for accessibility linking */
  paginationId: string;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
  const context = React.useContext(PaginationContext);
  return context;
}

// ============================================
// VARIANTS
// ============================================

const paginationVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      sm: "[&_button]:h-7 [&_button]:min-w-7 [&_button]:text-xs",
      default: "[&_button]:h-8 [&_button]:min-w-8 [&_button]:text-sm",
      lg: "[&_button]:h-9 [&_button]:min-w-9 [&_button]:text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const paginationLinkVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: [
          "rounded-md hover:bg-muted",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm",
        ],
        outline: [
          "rounded-md border border-transparent hover:border-border hover:bg-transparent",
          "data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
        ],
        pills: [
          "rounded-full hover:bg-muted",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm",
        ],
        ghost: [
          "rounded-md hover:bg-muted/50 hover:text-foreground",
          "data-[active=true]:text-primary data-[active=true]:font-semibold data-[active=true]:bg-transparent",
        ],
        rounded: [
          "rounded-lg hover:bg-muted",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md",
        ],
      },
      color: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    compoundVariants: [
      // Success color
      {
        variant: "default",
        color: "success",
        className:
          "data-[active=true]:bg-green-600 data-[active=true]:text-white",
      },
      {
        variant: "pills",
        color: "success",
        className:
          "data-[active=true]:bg-green-600 data-[active=true]:text-white",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "data-[active=true]:border-green-600 data-[active=true]:bg-green-500/10 data-[active=true]:text-green-600",
      },
      {
        variant: "ghost",
        color: "success",
        className: "data-[active=true]:text-green-600",
      },
      // Warning color
      {
        variant: "default",
        color: "warning",
        className:
          "data-[active=true]:bg-amber-500 data-[active=true]:text-white",
      },
      {
        variant: "pills",
        color: "warning",
        className:
          "data-[active=true]:bg-amber-500 data-[active=true]:text-white",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "data-[active=true]:border-amber-500 data-[active=true]:bg-amber-500/10 data-[active=true]:text-amber-600",
      },
      {
        variant: "ghost",
        color: "warning",
        className: "data-[active=true]:text-amber-600",
      },
      // Destructive color
      {
        variant: "default",
        color: "destructive",
        className:
          "data-[active=true]:bg-destructive data-[active=true]:text-destructive-foreground",
      },
      {
        variant: "pills",
        color: "destructive",
        className:
          "data-[active=true]:bg-destructive data-[active=true]:text-destructive-foreground",
      },
      {
        variant: "outline",
        color: "destructive",
        className:
          "data-[active=true]:border-destructive data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive",
      },
      {
        variant: "ghost",
        color: "destructive",
        className: "data-[active=true]:text-destructive",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
);

// ============================================
// ROOT COMPONENT
// ============================================

interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof paginationVariants>,
    Omit<UsePaginationOptions, "onPageChange" | "onPageSizeChange"> {
  /** Visual style variant */
  variant?: "default" | "outline" | "pills" | "ghost" | "rounded";
  /** Color variant */
  color?: "default" | "primary" | "success" | "warning" | "destructive";
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Disable all pagination controls */
  disabled?: boolean;
  /** Accessible label for the navigation */
  "aria-label"?: string;
}

function Pagination({
  className,
  size = "default",
  variant = "default",
  color = "default",
  children,
  disabled = false,
  total,
  pageSize: pageSizeProp,
  defaultPage,
  page: controlledPage,
  onPageChange,
  onPageSizeChange,
  maxPages,
  keepInBounds,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const paginationId = React.useId();
  
  const pagination = usePagination({
    total,
    pageSize: pageSizeProp,
    defaultPage,
    page: controlledPage,
    onPageChange,
    onPageSizeChange,
    maxPages,
    keepInBounds,
  });

  const contextValue: PaginationContextValue = {
    ...pagination,
    size: size ?? "default",
    variant: variant ?? "default",
    color: color ?? "default",
    disabled,
    paginationId,
  };

  return (
    <PaginationContext.Provider value={contextValue}>
      <nav
        data-slot="pagination"
        role="navigation"
        aria-label={ariaLabel}
        className={cn(paginationVariants({ size }), className)}
        {...props}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
}

// ============================================
// PAGINATION CONTENT
// ============================================

function PaginationContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  const context = usePaginationContext();

  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex items-center gap-1",
        // Mobile responsive: hide some items on small screens
        "[&>[data-mobile-hide]]:hidden [&>[data-mobile-hide]]:sm:flex",
        className
      )}
      role="list"
      aria-label={context ? `Page ${context.page} of ${context.pageCount}` : undefined}
      {...props}
    />
  );
}

// ============================================
// PAGINATION ITEM
// ============================================

interface PaginationItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Hide this item on mobile screens */
  mobileHide?: boolean;
}

function PaginationItem({
  className,
  mobileHide,
  ...props
}: PaginationItemProps) {
  return (
    <li
      data-slot="pagination-item"
      data-mobile-hide={mobileHide ? "" : undefined}
      className={cn("", className)}
      {...props}
    />
  );
}

// ============================================
// PAGINATION LINK (Page Button)
// ============================================

interface PaginationLinkProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof paginationLinkVariants> {
  isActive?: boolean;
  /** Page number for this link (enables auto-click handling when context available) */
  page?: number;
}

function PaginationLink({
  className,
  isActive,
  variant: variantProp,
  color: colorProp,
  page,
  onClick,
  children,
  ...props
}: PaginationLinkProps) {
  const context = usePaginationContext();
  
  // Use context values if available, otherwise use props
  const variant = variantProp ?? context?.variant ?? "default";
  const color = colorProp ?? context?.color ?? "default";
  const disabled = props.disabled ?? context?.disabled ?? false;

  // Auto-determine active state from page number
  const active = isActive ?? (page !== undefined && context?.isCurrentPage(page));

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (page !== undefined && context?.setPage && !e.defaultPrevented) {
        context.setPage(page);
      }
    },
    [onClick, page, context]
  );

  return (
    <button
      type="button"
      data-slot="pagination-link"
      data-active={active}
      aria-current={active ? "page" : undefined}
      aria-label={page ? `Go to page ${page}` : undefined}
      disabled={disabled}
      className={cn(paginationLinkVariants({ variant, color }), className)}
      onClick={handleClick}
      {...props}
    >
      {children ?? page}
    </button>
  );
}

// ============================================
// NAVIGATION BUTTONS
// ============================================

function PaginationFirst({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive">) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? context?.isFirst ?? false;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (!e.defaultPrevented) {
        context?.firstPage();
      }
    },
    [props.onClick, context]
  );

  return (
    <PaginationLink
      aria-label="Go to first page"
      className={cn("gap-1", className)}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <IconChevronsLeft className="h-4 w-4" />
      <span className="sr-only">First page</span>
    </PaginationLink>
  );
}

function PaginationPrevious({
  className,
  showLabel = false,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive"> & {
  showLabel?: boolean;
}) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? (context ? !context.hasPrev : false);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (!e.defaultPrevented) {
        context?.prevPage();
      }
    },
    [props.onClick, context]
  );

  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("gap-1", showLabel && "px-2.5", className)}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <IconChevronLeft className="h-4 w-4" />
      {showLabel && <span className="hidden sm:inline">Previous</span>}
      <span className="sr-only">Previous page</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  showLabel = false,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive"> & {
  showLabel?: boolean;
}) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? (context ? !context.hasNext : false);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (!e.defaultPrevented) {
        context?.nextPage();
      }
    },
    [props.onClick, context]
  );

  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("gap-1", showLabel && "px-2.5", className)}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {showLabel && <span className="hidden sm:inline">Next</span>}
      <span className="sr-only">Next page</span>
      <IconChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationLast({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive">) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? context?.isLast ?? false;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (!e.defaultPrevented) {
        context?.lastPage();
      }
    },
    [props.onClick, context]
  );

  return (
    <PaginationLink
      aria-label="Go to last page"
      className={cn("gap-1", className)}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span className="sr-only">Last page</span>
      <IconChevronsRight className="h-4 w-4" />
    </PaginationLink>
  );
}

// ============================================
// ELLIPSIS
// ============================================

function PaginationEllipsis({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const context = usePaginationContext();
  const sizeClasses = {
    sm: "h-7 w-7",
    default: "h-8 w-8",
    lg: "h-9 w-9",
  };

  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center",
        sizeClasses[context?.size ?? "default"],
        className
      )}
      {...props}
    >
      <IconDots className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

// ============================================
// PAGINATION PAGES (Auto-render pages)
// ============================================

interface PaginationPagesProps {
  /** Custom render function for page items */
  renderPage?: (item: PageRangeItem, index: number) => React.ReactNode;
  /** Custom render function for ellipsis */
  renderEllipsis?: (key: string) => React.ReactNode;
  /** Maximum pages to show on mobile (default: 3) */
  mobileMaxPages?: number;
}

function PaginationPages({
  renderPage,
  renderEllipsis,
  mobileMaxPages = 3,
}: PaginationPagesProps) {
  const context = usePaginationContext();
  
  if (!context) {
    console.warn("PaginationPages must be used within a Pagination component with total prop");
    return null;
  }

  const pages = context.getPageRange();

  // Mobile optimization: show fewer pages on small screens
  const mobilePages = React.useMemo(() => {
    if (pages.length <= mobileMaxPages + 2) return pages;
    
    const { page, pageCount } = context;
    const result: PageRangeItem[] = [];
    
    // Always show first
    result.push({ type: "page", page: 1, isActive: page === 1 });
    
    if (page > 2) {
      result.push({ type: "ellipsis", key: "mobile-ellipsis-start" });
    }
    
    // Show current page
    if (page !== 1 && page !== pageCount) {
      result.push({ type: "page", page, isActive: true });
    }
    
    if (page < pageCount - 1) {
      result.push({ type: "ellipsis", key: "mobile-ellipsis-end" });
    }
    
    // Always show last
    if (pageCount > 1) {
      result.push({ type: "page", page: pageCount, isActive: page === pageCount });
    }
    
    return result;
  }, [pages, context, mobileMaxPages]);

  const defaultRenderPage = (item: PageRangeItem) => {
    if (item.type === "ellipsis") {
      return renderEllipsis?.(item.key) ?? <PaginationEllipsis />;
    }
    return <PaginationLink page={item.page} isActive={item.isActive} />;
  };

  return (
    <>
      {/* Desktop view */}
      {pages.map((item, index) => (
        <PaginationItem key={item.type === "page" ? item.page : item.key} mobileHide>
          {renderPage?.(item, index) ?? defaultRenderPage(item)}
        </PaginationItem>
      ))}
      {/* Mobile view */}
      {mobilePages.map((item, index) => (
        <PaginationItem
          key={`mobile-${item.type === "page" ? item.page : item.key}`}
          className="flex sm:hidden"
        >
          {renderPage?.(item, index) ?? defaultRenderPage(item)}
        </PaginationItem>
      ))}
    </>
  );
}

// ============================================
// PAGINATION INFO
// ============================================

interface PaginationInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Format template: {start}, {end}, {total}, {page}, {pageCount} */
  format?: string;
  /** Show total items only on desktop */
  mobileCompact?: boolean;
}

function PaginationInfo({
  className,
  format = "Showing {start}-{end} of {total}",
  mobileCompact = true,
  ...props
}: PaginationInfoProps) {
  const context = usePaginationContext();

  if (!context) {
    return null;
  }

  const { startItem, endItem, total, page, pageCount } = context;

  // Don't render if no items
  if (total === 0) {
    return (
      <div
        data-slot="pagination-info"
        className={cn("text-sm text-muted-foreground", className)}
        aria-live="polite"
        {...props}
      >
        No results
      </div>
    );
  }

  const formattedText = format
    .replace("{start}", String(startItem))
    .replace("{end}", String(endItem))
    .replace("{total}", String(total))
    .replace("{page}", String(page))
    .replace("{pageCount}", String(pageCount));

  const mobileText = `${page}/${pageCount}`;

  return (
    <div
      data-slot="pagination-info"
      id={`${context.paginationId}-info`}
      className={cn("text-sm text-muted-foreground", className)}
      aria-live="polite"
      {...props}
    >
      {mobileCompact ? (
        <>
          <span className="hidden sm:inline">{formattedText}</span>
          <span className="sm:hidden">{mobileText}</span>
        </>
      ) : (
        formattedText
      )}
    </div>
  );
}

// ============================================
// PAGINATION SIZE SELECTOR
// ============================================

interface PaginationSizeSelectorProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  /** Available page size options */
  options?: number[];
  /** Label text */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Callback when size changes */
  onSizeChange?: (size: number) => void;
}

function PaginationSizeSelector({
  className,
  options = [10, 20, 30, 50, 100],
  label = "Rows per page",
  showLabel = true,
  onSizeChange,
  ...props
}: PaginationSizeSelectorProps) {
  const context = usePaginationContext();
  const selectId = React.useId();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = Number(e.target.value);
      onSizeChange?.(newSize);
      context?.setPageSize(newSize);
    },
    [onSizeChange, context]
  );

  const sizeClasses = {
    sm: "h-7 text-xs",
    default: "h-8 text-sm",
    lg: "h-9 text-base",
  };

  return (
    <div
      data-slot="pagination-size-selector"
      className={cn("flex items-center gap-2", className)}
    >
      {showLabel && (
        <label
          htmlFor={selectId}
          className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={context?.pageSize ?? options[0]}
        onChange={handleChange}
        disabled={context?.disabled}
        className={cn(
          "rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50",
          sizeClasses[context?.size ?? "default"]
        )}
        aria-label={showLabel ? undefined : label}
        {...props}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================
// PAGINATION JUMP (Direct Page Input)
// ============================================

interface PaginationJumpProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  /** Label text */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Callback when page is submitted */
  onJump?: (page: number) => void;
}

function PaginationJump({
  className,
  label = "Go to page",
  showLabel = true,
  onJump,
  ...props
}: PaginationJumpProps) {
  const context = usePaginationContext();
  const inputId = React.useId();
  const [value, setValue] = React.useState("");

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const pageNum = parseInt(value, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && context) {
        const clampedPage = Math.min(pageNum, context.pageCount);
        onJump?.(clampedPage);
        context.setPage(clampedPage);
        setValue("");
      }
    },
    [value, onJump, context]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const sizeClasses = {
    sm: "h-7 text-xs w-12",
    default: "h-8 text-sm w-14",
    lg: "h-9 text-base w-16",
  };

  return (
    <form
      data-slot="pagination-jump"
      className={cn("flex items-center gap-2", className)}
      onSubmit={handleSubmit}
    >
      {showLabel && (
        <label
          htmlFor={inputId}
          className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="number"
        min={1}
        max={context?.pageCount ?? 1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={context?.disabled}
        placeholder={String(context?.page ?? 1)}
        className={cn(
          "rounded-md border border-input bg-background px-2 text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          sizeClasses[context?.size ?? "default"]
        )}
        aria-label={showLabel ? undefined : label}
        {...props}
      />
      {context?.pageCount !== undefined && (
        <span className="text-sm text-muted-foreground hidden sm:inline">
          of {context.pageCount}
        </span>
      )}
    </form>
  );
}

// ============================================
// PAGINATION STATUS (Screen Reader Announcements)
// ============================================

function PaginationStatus({ className }: { className?: string }) {
  const context = usePaginationContext();

  if (!context) return null;

  return (
    <div
      data-slot="pagination-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      Page {context.page} of {context.pageCount}
      {context.total > 0 && `, showing items ${context.startItem} to ${context.endItem} of ${context.total}`}
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export {
  // Components
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
  PaginationPages,
  PaginationInfo,
  PaginationSizeSelector,
  PaginationJump,
  PaginationStatus,
  // Variants
  paginationVariants,
  paginationLinkVariants,
  // Hook for custom implementations
  usePaginationContext,
};

// Re-export hook and types from use-pagination
export {
  usePagination,
  useUrlPagination,
  calculatePageRange,
  type UsePaginationOptions,
  type UsePaginationReturn,
  type PageRangeItem,
} from "@/hooks/use-pagination";
