import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const drawerVariants = cva(
  "fixed z-50 bg-background border shadow-xl transition-transform duration-300 ease-in-out",
  {
    variants: {
      side: {
        left: "inset-y-0 left-0 h-full border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
        right:
          "inset-y-0 right-0 h-full border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
        top: "inset-x-0 top-0 w-full border-b data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
        bottom:
          "inset-x-0 bottom-0 w-full border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      {
        side: ["left", "right"],
        size: "sm",
        className: "w-3/4 max-w-xs",
      },
      {
        side: ["left", "right"],
        size: "default",
        className: "w-3/4 max-w-sm",
      },
      {
        side: ["left", "right"],
        size: "lg",
        className: "w-3/4 max-w-lg",
      },
      {
        side: ["left", "right"],
        size: "xl",
        className: "w-3/4 max-w-xl",
      },
      {
        side: ["left", "right"],
        size: "full",
        className: "w-screen max-w-none",
      },

      {
        side: ["top", "bottom"],
        size: "sm",
        className: "h-auto max-h-[30vh]",
      },
      {
        side: ["top", "bottom"],
        size: "default",
        className: "h-auto max-h-[80vh]",
      },
      {
        side: ["top", "bottom"],
        size: "lg",
        className: "h-auto max-h-[90vh]",
      },
      {
        side: ["top", "bottom"],
        size: "xl",
        className: "h-screen max-h-none",
      },
      {
        side: ["top", "bottom"],
        size: "full",
        className: "h-screen max-h-none",
      },
    ],
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
);

function Drawer({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "transition-opacity duration-300",
        className
      )}
      {...props}
    />
  );
}

interface DrawerContentProps
  extends DialogPrimitive.Popup.Props, VariantProps<typeof drawerVariants> {
  showCloseButton?: boolean;
}

function DrawerContent({
  className,
  children,
  side = "right",
  size = "default",
  showCloseButton = true,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        className={cn(drawerVariants({ side, size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <IconX className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5 p-4 border-b border-border",
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "flex flex-col gap-2 p-4 border-t border-border mt-auto",
        className
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  drawerVariants,
};
