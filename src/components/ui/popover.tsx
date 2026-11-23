import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

type PopoverProps<Payload = unknown> = PopoverPrimitive.Root.Props<Payload>;

type PopoverTriggerProps<Payload = unknown> =
  PopoverPrimitive.Trigger.Props<Payload>;

type PopoverPayloadTriggerProps<Payload = unknown> =
  PopoverTriggerProps<Payload>;

type PopoverPortalProps = PopoverPrimitive.Portal.Props;

type PopoverPositionerProps = Omit<
  PopoverPrimitive.Positioner.Props,
  "className"
> & { className?: string };

type PopoverViewportProps = Omit<
  PopoverPrimitive.Viewport.Props,
  "className"
> & { className?: string };

type PopoverCloseProps = PopoverPrimitive.Close.Props;

type PopoverBackdropProps = Omit<
  PopoverPrimitive.Backdrop.Props,
  "className"
> & { className?: string };

type PopoverDescriptionProps = Omit<
  PopoverPrimitive.Description.Props,
  "className"
> & { className?: string };

function Popover<Payload = unknown>(props: PopoverProps<Payload>) {
  return <PopoverPrimitive.Root {...props} />;
}

function createPopoverHandle<Payload = unknown>() {
  return PopoverPrimitive.createHandle<Payload>();
}

function PopoverTrigger<Payload = unknown>(
  props: PopoverTriggerProps<Payload>,
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPayloadTrigger<Payload = unknown>(
  props: PopoverPayloadTriggerProps<Payload>,
) {
  return (
    <PopoverPrimitive.Trigger data-slot="popover-payload-trigger" {...props} />
  );
}

function PopoverPortal(props: PopoverPortalProps) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}

function PopoverPositioner({ className, ...props }: PopoverPositionerProps) {
  return (
    <PopoverPrimitive.Positioner
      data-slot="popover-positioner"
      className={cn("z-50", className)}
      {...props}
    />
  );
}

function PopoverClose(props: PopoverCloseProps) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

const popoverContentVariants = cva(
  "origin-(--transform-origin) max-w-[min(var(--available-width),calc(100vw-2rem))] max-h-(--available-height) overflow-y-auto overscroll-contain rounded-lg border p-4 shadow-[var(--shadow-popover,var(--shadow-lg))] outline-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[instant]:transition-none motion-reduce:transition-none",
  {
    variants: {
      size: {
        auto: "w-auto",
        sm: "w-48",
        md: "w-72",
        lg: "w-96",
        // kira-kit-ignore arbitrary-values: fixed 512px wide popover variant
        xl: "w-[32rem]",
      },
      variant: {
        default: "border-border bg-popover text-popover-foreground",
        outline: "border-border bg-background text-foreground",
      },
    },
    defaultVariants: { size: "md", variant: "default" },
  },
);

type Positioning = Pick<
  PopoverPositionerProps,
  | "side"
  | "sideOffset"
  | "align"
  | "alignOffset"
  | "arrowPadding"
  | "collisionBoundary"
  | "collisionPadding"
  | "sticky"
>;

interface PopoverContentProps
  extends
    Omit<PopoverPrimitive.Popup.Props, "className">,
    VariantProps<typeof popoverContentVariants>,
    Positioning {
  className?: string;
  positionerProps?: PopoverPositionerProps;
  portalProps?: PopoverPortalProps;
}

function PopoverContent({
  className,
  size,
  variant,
  positionerProps,
  portalProps,
  side,
  sideOffset,
  align,
  alignOffset,
  arrowPadding,
  collisionBoundary,
  collisionPadding,
  sticky,
  ...props
}: PopoverContentProps) {
  const reduced = useReducedMotion();

  // Undefined convenience props must not erase values in the grouped props.
  const positioning = Object.fromEntries(
    Object.entries({
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
    }).filter(([, value]) => value !== undefined),
  );

  return (
    <PopoverPortal {...portalProps}>
      <PopoverPositioner
        side="bottom"
        sideOffset={4}
        align="center"
        collisionPadding={16}
        {...positionerProps}
        {...positioning}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            popoverContentVariants({ size, variant }),
            !reduced &&
              "transition-[opacity,scale] duration-200 ease-out data-ending-style:duration-150 data-ending-style:ease-in",
            className,
          )}
          {...props}
        />
      </PopoverPositioner>
    </PopoverPortal>
  );
}

function PopoverViewport({ className, ...props }: PopoverViewportProps) {
  const reduced = useReducedMotion();

  return (
    <PopoverPrimitive.Viewport
      data-slot="popover-viewport"
      className={cn(
        "relative *:data-previous:absolute *:data-previous:inset-0 data-instant:*:animate-none motion-reduce:*:animate-none",
        !reduced &&
          "*:data-current:animate-in *:data-current:fade-in-0 *:data-previous:animate-out *:data-previous:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

function PopoverBackdrop({ className, ...props }: PopoverBackdropProps) {
  const reduced = useReducedMotion();

  return (
    <PopoverPrimitive.Backdrop
      data-slot="popover-backdrop"
      className={cn(
        "fixed inset-0 z-40 bg-foreground/40 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
        !reduced &&
          "transition-opacity duration-200 data-ending-style:duration-150",
        className,
      )}
      {...props}
    />
  );
}

const popoverArrowVariants = cva("", {
  variants: {
    variant: { default: "fill-popover", outline: "fill-background" },
  },
  defaultVariants: { variant: "default" },
});

interface PopoverArrowProps
  extends
    Omit<PopoverPrimitive.Arrow.Props, "className">,
    VariantProps<typeof popoverArrowVariants> {
  className?: string;
}

function PopoverArrow({ className, variant, ...props }: PopoverArrowProps) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn(popoverArrowVariants({ variant }), className)}
      {...props}
    />
  );
}

interface PopoverTitleProps extends Omit<
  PopoverPrimitive.Title.Props,
  "className"
> {
  className?: string;
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

function PopoverTitle({
  className,
  as: Heading = "h4",
  render,
  ...props
}: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      render={render ?? <Heading />}
      className={cn(
        "font-medium text-base leading-snug wrap-break-word",
        className,
      )}
      {...props}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn(
        "text-sm text-muted-foreground mt-1 wrap-break-word",
        className,
      )}
      {...props}
    />
  );
}

type PopoverSlot<Payload> =
  React.ReactNode | ((payload: Payload | undefined) => React.ReactNode);

interface KiraPopoverProps<Payload = unknown> extends Omit<
  PopoverProps<Payload>,
  "children"
> {
  trigger?: React.ReactElement;
  title?: PopoverSlot<Payload>;
  description?: PopoverSlot<Payload>;
  children?: PopoverSlot<Payload>;
  footer?: PopoverSlot<Payload>;
  contentProps?: PopoverContentProps;
  showClose?: boolean;
  arrow?: boolean;
  dirty?: boolean;
  onDiscard?: () => void;
  preventClose?: boolean;
}

interface PopoverDismissal {
  triggerId?: string;
  switchTrigger: boolean;
}

interface PopoverDiscardConfirmationProps {
  keepRef: React.Ref<HTMLButtonElement>;
  onKeep: () => void;
  onDiscard: () => void;
}

function PopoverDiscardConfirmation({
  keepRef,
  onKeep,
  onDiscard,
}: PopoverDiscardConfirmationProps) {
  return (
    <fieldset
      data-slot="popover-discard-confirmation"
      className="mt-4 space-y-3 border-t pt-3"
    >
      <legend className="text-sm">Discard unsaved changes?</legend>
      <div className="flex flex-wrap gap-2">
        <Button ref={keepRef} variant="outline" onClick={onKeep}>
          Keep editing
        </Button>
        <Button variant="destructive" onClick={onDiscard}>
          Discard changes
        </Button>
      </div>
    </fieldset>
  );
}

function shouldGuardDismissal(
  next: boolean,
  switching: boolean,
  bypass: boolean,
  dirty: boolean,
  preventClose: boolean,
) {
  return (!next || switching) && !bypass && (dirty || preventClose);
}

function usePopoverDraftGuard<Payload>({
  handle: providedHandle,
  dirty = false,
  preventClose = false,
  onDiscard,
  onOpenChange,
}: Pick<
  KiraPopoverProps<Payload>,
  "handle" | "dirty" | "preventClose" | "onDiscard" | "onOpenChange"
>) {
  const [localHandle] = React.useState(() => createPopoverHandle<Payload>());
  const handle = providedHandle ?? localHandle;

  const [confirmation, setConfirmation] =
    React.useState<PopoverDismissal | null>(null);

  const activeTrigger = React.useRef<Element | undefined>(undefined);
  const bypass = React.useRef(false);
  const lastFocused = React.useRef<HTMLElement | null>(null);
  const keepRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (confirmation) keepRef.current?.focus();
  }, [confirmation]);

  const change: NonNullable<PopoverProps<Payload>["onOpenChange"]> = (
    next,
    details,
  ) => {
    const switching =
      next &&
      activeTrigger.current !== undefined &&
      details.trigger !== activeTrigger.current;

    if (
      shouldGuardDismissal(next, switching, bypass.current, dirty, preventClose)
    ) {
      details.cancel();

      if (!preventClose) {
        lastFocused.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setConfirmation({
          switchTrigger: switching,
          triggerId: details.trigger?.id,
        });
      }
    }

    bypass.current = false;
    onOpenChange?.(next, details);

    if (!details.isCanceled) {
      activeTrigger.current = next ? details.trigger : undefined;
      setConfirmation(null);
    }
  };

  const keepEditing = () => {
    setConfirmation(null);
    lastFocused.current?.focus();
  };

  const discard = () => {
    onDiscard?.();
    bypass.current = true;

    if (confirmation?.switchTrigger && confirmation.triggerId)
      handle.open(confirmation.triggerId);
    else handle.close();
  };

  const confirmationContent = confirmation && (
    <PopoverDiscardConfirmation
      keepRef={keepRef}
      onKeep={keepEditing}
      onDiscard={discard}
    />
  );

  return { handle, change, confirmationContent };
}

function resolvePopoverSlot<Payload>(
  slot: PopoverSlot<Payload>,
  payload: Payload | undefined,
) {
  return slot instanceof Function ? slot(payload) : slot;
}

function KiraPopover<Payload = unknown>({
  trigger,
  title,
  description,
  children,
  footer,
  contentProps,
  showClose = true,
  arrow = false,
  dirty,
  onDiscard,
  preventClose,
  onOpenChange,
  handle,
  ...props
}: KiraPopoverProps<Payload>) {
  const guard = usePopoverDraftGuard({
    handle,
    dirty,
    preventClose,
    onDiscard,
    onOpenChange,
  });

  const buildContent = (payload: Payload | undefined) => (
    <PopoverContent {...contentProps}>
      {arrow && <PopoverArrow variant={contentProps?.variant} />}
      {title && (
        <PopoverTitle>{resolvePopoverSlot(title, payload)}</PopoverTitle>
      )}
      {description && (
        <PopoverDescription>
          {resolvePopoverSlot(description, payload)}
        </PopoverDescription>
      )}
      <div data-slot="kira-popover-body" className="min-w-0 mt-3">
        {resolvePopoverSlot(children, payload)}
      </div>
      {footer && (
        <div
          data-slot="kira-popover-footer"
          className="mt-4 flex flex-wrap gap-2"
        >
          {resolvePopoverSlot(footer, payload)}
        </div>
      )}
      {guard.confirmationContent}
      {showClose && (
        <PopoverClose
          disabled={preventClose}
          render={
            <Button className="mt-3" variant="outline" size="sm">
              Close
            </Button>
          }
        />
      )}
    </PopoverContent>
  );

  const wrapRoot = () => (
    <>
      {trigger && <PopoverTrigger handle={guard.handle} render={trigger} />}
      <Popover {...props} handle={guard.handle} onOpenChange={guard.change}>
        {({ payload }) => buildContent(payload)}
      </Popover>
    </>
  );

  return wrapRoot();
}

interface PopoverFlowNavigation {
  navigate: (id: string) => void;
  back: () => void;
}

interface PopoverFlowView {
  id: string;
  title: React.ReactNode;
  render: (navigation: PopoverFlowNavigation) => React.ReactNode;
}

interface KiraPopoverFlowProps extends Omit<
  KiraPopoverProps,
  "children" | "title"
> {
  views: readonly PopoverFlowView[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

interface PopoverFlowContentProps {
  view: PopoverFlowView | undefined;
  navigation: PopoverFlowNavigation;
  ref: React.Ref<HTMLDivElement>;
}

function PopoverFlowContent({
  view,
  navigation,
  ref,
}: PopoverFlowContentProps) {
  return (
    <div
      data-slot="popover-flow-view"
      ref={ref}
      tabIndex={-1}
      className="outline-none"
    >
      {view?.render(navigation)}
    </div>
  );
}

function KiraPopoverFlow({
  views,
  value,
  defaultValue,
  onValueChange,
  onOpenChangeComplete,
  ...props
}: KiraPopoverFlowProps) {
  const initial = defaultValue ?? views[0]?.id ?? "";
  const [localValue, setLocalValue] = React.useState(initial);
  const current = value ?? localValue;
  const history = React.useRef<{ id: string; focusIndex: number }[]>([]);
  const frame = React.useRef<number | undefined>(undefined);
  const heading = React.useRef<HTMLDivElement>(null);
  React.useEffect(
    () => () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const select = (id: string, focusIndex?: number) => {
    if (!views.some((view) => view.id === id)) return;

    if (value === undefined) setLocalValue(id);
    onValueChange?.(id);

    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const buttons = heading.current?.querySelectorAll<HTMLElement>(
        "button, input, select, textarea, a[href]",
      );

      (focusIndex === undefined
        ? heading.current
        : (buttons?.[focusIndex] ?? heading.current)
      )?.focus();
    });
  };

  const navigate = (id: string) => {
    if (id === current || !views.some((view) => view.id === id)) return;

    const controls = heading.current?.querySelectorAll(
      "button, input, select, textarea, a[href]",
    );

    history.current.push({
      id: current,
      focusIndex: controls
        ? Array.from(controls).findIndex(
            (control) => control === document.activeElement,
          )
        : -1,
    });
    select(id);
  };

  const back = () => {
    const previous = history.current.pop();

    if (previous) select(previous.id, previous.focusIndex);
  };

  const view = views.find((item) => item.id === current);

  const wrapPopover = () => (
    <KiraPopover
      {...props}
      title={view?.title ?? "No view available"}
      onOpenChangeComplete={(open) => {
        onOpenChangeComplete?.(open);

        if (!open && value === undefined) {
          setLocalValue(initial);
          history.current = [];
        }
      }}
    >
      <PopoverFlowContent
        view={view}
        navigation={{ navigate, back }}
        ref={heading}
      />
    </KiraPopover>
  );

  return wrapPopover();
}

export {
  Popover,
  PopoverTrigger,
  PopoverPayloadTrigger,
  PopoverContent,
  PopoverClose,
  PopoverPortal,
  PopoverPositioner,
  PopoverViewport,
  PopoverArrow,
  PopoverBackdrop,
  PopoverTitle,
  PopoverDescription,
  createPopoverHandle,
  KiraPopover,
  KiraPopoverFlow,
  popoverContentVariants,
  popoverArrowVariants,
};

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverPayloadTriggerProps,
  PopoverContentProps,
  PopoverPortalProps,
  PopoverPositionerProps,
  PopoverViewportProps,
  PopoverCloseProps,
  PopoverBackdropProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverArrowProps,
  PopoverSlot,
  KiraPopoverProps,
  PopoverFlowNavigation,
  PopoverFlowView,
  KiraPopoverFlowProps,
};
