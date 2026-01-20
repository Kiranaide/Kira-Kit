import * as React from "react"
import { IconChevronRight, IconSlash, IconDots } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const breadcrumbListVariants = cva("flex items-center gap-1.5 break-words text-sm", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const breadcrumbLinkVariants = cva("transition-colors hover:text-foreground/80", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      underline: "text-muted-foreground underline decoration-dotted underline-offset-4 hover:underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const breadcrumbSeparatorVariants = cva("flex items-center", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      slash: "text-muted-foreground/50",
      chevron: "text-muted-foreground/70",
    },
    size: {
      sm: "h-3 w-3",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {}
interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<"ol">, VariantProps<typeof breadcrumbListVariants> {}
interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {}
interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a">, VariantProps<typeof breadcrumbLinkVariants> {}
interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<"li"> {
  variant?: "default" | "slash" | "chevron" | "dot"
  size?: "sm" | "default" | "lg"
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("relative", className)} aria-label="Breadcrumb" {...props} />
  )
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, size, ...props }, ref) => (
    <ol ref={ref} className={cn(breadcrumbListVariants({ size, className }))} {...props} />
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, variant, ...props }, ref) => (
    <a ref={ref} className={cn(breadcrumbLinkVariants({ variant, className }))} {...props} />
  )
)
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
      <IconDots className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">More</span>
    </span>
  )
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, variant = "default", size, ...props }, ref) => {
    const renderSeparator = () => {
      if (variant === "dot") {
        return <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
      }
      if (variant === "slash") {
        return <IconSlash className={cn(breadcrumbSeparatorVariants({ variant, size }))} aria-hidden="true" />
      }
      if (variant === "chevron") {
        return <IconChevronRight className={cn(breadcrumbSeparatorVariants({ variant, size }))} aria-hidden="true" />
      }
      return <IconChevronRight className={cn(breadcrumbSeparatorVariants({ variant: "chevron", size }))} aria-hidden="true" />
    }

    return (
      <li ref={ref} className={cn("flex items-center", className)} aria-hidden="true" {...props}>
        {renderSeparator()}
      </li>
    )
  }
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbEllipsis,
  BreadcrumbSeparator,
  breadcrumbListVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
}

export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
}
