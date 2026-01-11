import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const paginationVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      sm: "[&_button]:h-7 [&_button]:w-7 [&_button]:text-xs",
      default: "[&_button]:h-8 [&_button]:w-8 [&_button]:text-sm",
      lg: "[&_button]:h-9 [&_button]:w-9 [&_button]:text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {}

function Pagination({ className, size, ...props }: PaginationProps) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn(paginationVariants({ size }), className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li data-slot="pagination-item" className={cn("", className)} {...props} />
  );
}

const paginationLinkVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
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

interface PaginationLinkProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof paginationLinkVariants> {
  isActive?: boolean;
}

function PaginationLink({
  className,
  isActive,
  variant,
  color,
  ...props
}: PaginationLinkProps) {
  return (
    <button
      data-slot="pagination-link"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(paginationLinkVariants({ variant, color }), className)}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <IconChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span className="sr-only">Next</span>
      <IconChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn("flex h-8 w-8 items-center justify-center", className)}
      {...props}
    >
      <IconDots className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  paginationVariants,
  paginationLinkVariants,
};
