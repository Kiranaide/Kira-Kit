import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const dialogContentVariants = cva(
  "pointer-events-auto relative flex min-h-0 max-h-full min-w-0 w-full flex-col overflow-y-auto break-words rounded-xl border border-border bg-background p-6 transition-[opacity,scale,box-shadow] duration-200 motion-reduce:transition-none data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 shadow-[var(--shadow-modal,var(--shadow-xl))] data-non-modal:shadow-[var(--shadow-popover,var(--shadow-md))] data-non-modal:data-starting-style:scale-[0.98] data-non-modal:data-ending-style:scale-[0.98]",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "h-full max-w-none",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const DialogModalContext = React.createContext(true);

function Dialog<Payload = unknown>({
  modal = true,
  ...props
}: DialogPrimitive.Root.Props<Payload>) {
  const nonModal = modal === false;

  return (
    <DialogModalContext.Provider value={modal === true}>
      <DialogPrimitive.Root
        data-slot="dialog"
        modal={modal}
        // Non-modal recipe (Base UI 1.9): modal={false} alone still closes on
        // outside presses and focus moving out. bake disablePointerDismissal so
        // non-modal dialogs actually stay open while the page is used; Esc,
        // Dialog.Close and forms still close it. An explicit consumer prop wins.
        disablePointerDismissal={
          nonModal && props.disablePointerDismissal === undefined
            ? true
            : props.disablePointerDismissal
        }
        {...props}
      />
    </DialogModalContext.Provider>
  );
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: Omit<DialogPrimitive.Backdrop.Props, "className"> & {
  className?: string;
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none data-starting-style:opacity-0 data-ending-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

interface DialogContentProps
  extends
    Omit<DialogPrimitive.Popup.Props, "className">,
    VariantProps<typeof dialogContentVariants> {
  className?: string;
  showCloseButton?: boolean;
  portalProps?: Omit<DialogPrimitive.Portal.Props, "children">;
  /** Keep the header and footer visible while DialogBody scrolls. */
  scrollable?: boolean;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "default",
  portalProps,
  scrollable = false,
  ...props
}: DialogContentProps) {
  const modal = React.useContext(DialogModalContext);

  return (
    <DialogPortal {...portalProps}>
      {modal && <DialogOverlay />}
      <div
        data-slot="dialog-viewport"
        className={cn(
          "pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4",
          { "justify-end items-start": !modal },
        )}
      >
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          data-non-modal={modal ? undefined : ""}
          className={cn(
            dialogContentVariants({ size }),
            { "overflow-hidden": scrollable },
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogClose
              className="absolute right-4 top-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none"
              aria-label="Close"
            >
              <IconX aria-hidden="true" className="h-4 w-4" />
            </DialogClose>
          )}
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // kira-kit-ignore spacing-scale: title-to-description optical gap (contract-sanctioned exception)
    <div
      data-slot="dialog-header"
      className={cn(
        "flex min-w-0 shrink-0 flex-col gap-1.5 mb-4 pr-8",
        className,
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-auto pt-6",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: Omit<DialogPrimitive.Title.Props, "className"> & { className?: string }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: Omit<DialogPrimitive.Description.Props, "className"> & {
  className?: string;
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

interface KiraDialogProps {
  trigger: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  rootProps?: Omit<DialogPrimitive.Root.Props, "children">;
  contentProps?: Omit<DialogContentProps, "children">;
}

function KiraDialog({
  trigger,
  title,
  description,
  children,
  footer,
  rootProps,
  contentProps,
}: KiraDialogProps) {
  const buildHeader = () => (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {description != null && (
        <DialogDescription>{description}</DialogDescription>
      )}
    </DialogHeader>
  );

  const buildFooter = () =>
    footer != null && <DialogFooter>{footer}</DialogFooter>;

  const wrapContent = () => (
    <DialogContent {...contentProps}>
      {buildHeader()}
      <DialogBody>{children}</DialogBody>
      {buildFooter()}
    </DialogContent>
  );

  return (
    <Dialog {...rootProps}>
      <DialogTrigger render={trigger} />
      {wrapContent()}
    </Dialog>
  );
}

const DialogPopup = DialogPrimitive.Popup;

type DialogRootProps = DialogPrimitive.Root.Props;

type DialogPopupProps = DialogPrimitive.Popup.Props;

type DialogPortalProps = DialogPrimitive.Portal.Props;

type DialogRootActions = DialogPrimitive.Root.Actions;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogPopup,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  KiraDialog,
  dialogContentVariants,
  DialogDescription,
};

export type {
  DialogRootProps,
  DialogPopupProps,
  DialogPortalProps,
  DialogRootActions,
  DialogContentProps,
  KiraDialogProps,
};
