import * as React from "react"
import { IconX } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const announcementBarVariants = cva(
  "relative flex w-full items-center justify-between gap-4 px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        info: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
      },
      position: {
        top: "sticky top-0 z-50",
        bottom: "fixed bottom-0 z-50",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "top",
    },
  }
)

interface AnnouncementBarProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof announcementBarVariants> {}
interface AnnouncementBarContentProps extends React.ComponentPropsWithoutRef<"div"> {}
interface AnnouncementBarActionProps extends React.ComponentPropsWithoutRef<"a"> {}
interface AnnouncementBarDismissProps extends React.ComponentPropsWithoutRef<"button"> {}

const AnnouncementBar = React.forwardRef<HTMLDivElement, AnnouncementBarProps>(
  ({ className, variant, position, role = "status", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(announcementBarVariants({ variant, position, className }))}
      role={role}
      {...props}
    />
  )
)
AnnouncementBar.displayName = "AnnouncementBar"

const AnnouncementBarContent = React.forwardRef<HTMLDivElement, AnnouncementBarContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 items-center gap-2", className)} {...props} />
  )
)
AnnouncementBarContent.displayName = "AnnouncementBarContent"

const AnnouncementBarAction = React.forwardRef<HTMLAnchorElement, AnnouncementBarActionProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn("inline-flex items-center font-medium underline underline-offset-4 hover:no-underline", className)}
      {...props}
    />
  )
)
AnnouncementBarAction.displayName = "AnnouncementBarAction"

const AnnouncementBarDismiss = React.forwardRef<HTMLButtonElement, AnnouncementBarDismissProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none",
        className
      )}
      aria-label="Dismiss announcement"
      {...props}
    >
      <IconX className="h-4 w-4" aria-hidden="true" />
    </button>
  )
)
AnnouncementBarDismiss.displayName = "AnnouncementBarDismiss"

export function useAnnouncementDismiss(key: string) {
  const [isDismissed, setIsDismissed] = React.useState(() => {
    if (typeof window === "undefined") return false
    try {
      return localStorage.getItem(`announcement-${key}`) === "dismissed"
    } catch {
      return false
    }
  })

  const dismiss = React.useCallback(() => {
    setIsDismissed(true)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`announcement-${key}`, "dismissed")
      } catch {
      }
    }
  }, [key])

  return [isDismissed, dismiss] as const
}

export {
  AnnouncementBar,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  announcementBarVariants,
}

export type {
  AnnouncementBarProps,
  AnnouncementBarContentProps,
  AnnouncementBarActionProps,
  AnnouncementBarDismissProps,
}
