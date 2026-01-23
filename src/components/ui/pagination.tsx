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





interface PaginationContextValue extends UsePaginationReturn {
  size: "sm" | "default" | "lg";
  variant: "default" | "outline" | "pills" | "ghost" | "rounded";
  color: "default" | "primary" | "success" | "warning" | "destructive";
  disabled: boolean;

  paginationId: string;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
  const context = React.useContext(PaginationContext);
  return context;
}





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





interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof paginationVariants>,
    Omit<UsePaginationOptions, "onPageChange" | "onPageSizeChange"> {

  variant?: "default" | "outline" | "pills" | "ghost" | "rounded";

  color?: "default" | "primary" | "success" | "warning" | "destructive";

  onPageChange?: (page: number) => void;

  onPageSizeChange?: (pageSize: number) => void;

  disabled?: boolean;

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

        "[&>[data-mobile-hide]]:hidden [&>[data-mobile-hide]]:sm:flex",
        className
      )}
      role="list"
      aria-label={context ? `Page ${context.page} of ${context.pageCount}` : undefined}
      {...props}
    />
  );
}





interface PaginationItemProps extends React.HTMLAttributes<HTMLLIElement> {

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





interface PaginationLinkProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof paginationLinkVariants> {
  isActive?: boolean;

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


  const variant = variantProp ?? context?.variant ?? "default";
  const color = colorProp ?? context?.color ?? "default";
  const disabled = props.disabled ?? context?.disabled ?? false;


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





function PaginationFirst({
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive">) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? context?.isFirst ?? false;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        context?.firstPage();
      }
    },
    [onClick, context]
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
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive"> & {
  showLabel?: boolean;
}) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? (context ? !context.hasPrev : false);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        context?.prevPage();
      }
    },
    [onClick, context]
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
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive"> & {
  showLabel?: boolean;
}) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? (context ? !context.hasNext : false);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        context?.nextPage();
      }
    },
    [onClick, context]
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
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "page" | "isActive">) {
  const context = usePaginationContext();
  const disabled = props.disabled ?? context?.disabled ?? context?.isLast ?? false;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        context?.lastPage();
      }
    },
    [onClick, context]
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





interface PaginationPagesProps {

  renderPage?: (item: PageRangeItem, index: number) => React.ReactNode;

  renderEllipsis?: (key: string) => React.ReactNode;

  mobileMaxPages?: number;
}

function PaginationPages({
  renderPage,
  renderEllipsis,
  mobileMaxPages = 3,
}: PaginationPagesProps) {
  const context = usePaginationContext();


  const mobilePages = React.useMemo(() => {
    if (!context) return [];
    const pages = context.getPageRange();
    if (pages.length <= mobileMaxPages + 2) return pages;

    const { page, pageCount } = context;
    const result: PageRangeItem[] = [];


    result.push({ type: "page", page: 1, isActive: page === 1 });

    if (page > 2) {
      result.push({ type: "ellipsis", key: "mobile-ellipsis-start" });
    }


    if (page !== 1 && page !== pageCount) {
      result.push({ type: "page", page, isActive: true });
    }

    if (page < pageCount - 1) {
      result.push({ type: "ellipsis", key: "mobile-ellipsis-end" });
    }


    if (pageCount > 1) {
      result.push({ type: "page", page: pageCount, isActive: page === pageCount });
    }

    return result;
  }, [context, mobileMaxPages]);

  if (!context) {
    console.warn("PaginationPages must be used within a Pagination component with total prop");
    return null;
  }

  const pages = context.getPageRange();

  const defaultRenderPage = (item: PageRangeItem) => {
    if (item.type === "ellipsis") {
      return renderEllipsis?.(item.key) ?? <PaginationEllipsis />;
    }
    return <PaginationLink page={item.page} isActive={item.isActive} />;
  };

  return (
    <>
      {}
      {pages.map((item, index) => (
        <PaginationItem key={item.type === "page" ? item.page : item.key} mobileHide>
          {renderPage?.(item, index) ?? defaultRenderPage(item)}
        </PaginationItem>
      ))}
      {}
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





interface PaginationInfoProps extends React.HTMLAttributes<HTMLDivElement> {

  format?: string;

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





interface PaginationSizeSelectorProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {

  options?: number[];

  label?: string;

  showLabel?: boolean;

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





interface PaginationJumpProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {

  label?: string;

  showLabel?: boolean;

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





export {

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

  paginationVariants,
  paginationLinkVariants,

  usePaginationContext,
};


export {
  usePagination,
  useUrlPagination,
  calculatePageRange,
  type UsePaginationOptions,
  type UsePaginationReturn,
  type PageRangeItem,
} from "@/hooks/use-pagination";
