"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer as Sheet,
  DrawerPortal as SheetPortal,
  DrawerOverlay as SheetOverlay,
  DrawerTrigger as SheetTrigger,
  DrawerClose as SheetClose,
  DrawerHandle as SheetHandle,
  DrawerContent as SheetContent,
  DrawerHeader as SheetHeader,
  DrawerFooter as SheetFooter,
  DrawerTitle as SheetTitle,
  DrawerDescription as SheetDescription,
  DrawerBody as SheetBody,
  drawerVariants as sheetVariants,
  type DrawerSide as SheetSide,
  type DrawerProps as SheetProps,
  type DrawerContentProps as SheetContentProps,
  type DrawerHandleProps as SheetHandleProps,
} from "@/components/ui/drawer";

const sheetDesktopQuery = "(min-width: 640px)";

function subscribeSheetViewport(onChange: () => void) {
  const query = window.matchMedia(sheetDesktopQuery);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function getSheetDesktopSnapshot() {
  return window.matchMedia(sheetDesktopQuery).matches;
}

function getSheetServerSnapshot() {
  return true;
}

type KiraSheetRootProps = Omit<
  SheetProps,
  | "children"
  | "side"
  | "snapPoints"
  | "snapPoint"
  | "defaultSnapPoint"
  | "onSnapPointChange"
  | "snapToSequentialPoints"
>;

interface KiraSheetProps {
  trigger: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Switch to mobileSide below the existing 640px breakpoint. */
  responsive?: boolean;
  side?: SheetSide;
  mobileSide?: SheetSide;
  rootProps?: KiraSheetRootProps;
  contentProps?: Omit<SheetContentProps, "children">;
  /** Blocks native close requests. Controlled parents must respect isCanceled. */
  closeDisabledReason?: string;
  loading?: boolean;
  loadingLabel?: string;
  loadingContent?: React.ReactNode;
  error?: React.ReactNode;
  onRetry?: () => void;
}

function KiraSheet({
  trigger,
  title,
  description,
  children,
  footer,
  responsive: responsiveInput,
  side: sideInput,
  mobileSide: mobileSideInput,
  rootProps,
  contentProps,
  closeDisabledReason,
  loading: loadingInput,
  loadingLabel: loadingLabelInput,
  loadingContent,
  error,
  onRetry,
}: KiraSheetProps) {
  const { responsive, side, mobileSide, loading, loadingLabel } =
    useKiraSheetOptions({
      responsive: responsiveInput,
      side: sideInput,
      mobileSide: mobileSideInput,
      loading: loadingInput,
      loadingLabel: loadingLabelInput,
    });

  const desktop = React.useSyncExternalStore(
    subscribeSheetViewport,
    getSheetDesktopSnapshot,
    getSheetServerSnapshot,
  );

  const activeSide = responsive && !desktop ? mobileSide : side;

  const change: NonNullable<SheetProps["onOpenChange"]> = (next, details) => {
    if (!next && closeDisabledReason) details.cancel();
    rootProps?.onOpenChange?.(next, details);
  };

  const buildHeader = () => (
    <SheetHeader>
      <SheetTitle>{title}</SheetTitle>
      {description != null && (
        <SheetDescription>{description}</SheetDescription>
      )}
    </SheetHeader>
  );

  const buildBody = () => (
    <SheetStatusView
      closeDisabledReason={closeDisabledReason}
      loading={loading}
      loadingLabel={loadingLabel}
      error={error}
      onRetry={onRetry}
      loadingContent={loadingContent}
    >
      {children}
    </SheetStatusView>
  );

  const buildFooter = () =>
    footer != null && <SheetFooter>{footer}</SheetFooter>;

  const wrapContent = () => (
    <SheetContent
      {...contentProps}
      data-slot="kira-sheet"
      data-side={activeSide}
    >
      {buildHeader()}
      {buildBody()}
      {buildFooter()}
    </SheetContent>
  );

  return (
    <Sheet {...rootProps} side={activeSide} onOpenChange={change}>
      <SheetTrigger render={trigger} />
      {wrapContent()}
    </Sheet>
  );
}

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetHandle,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
  KiraSheet,
  sheetVariants,
};

export type {
  SheetSide,
  SheetProps,
  SheetContentProps,
  SheetHandleProps,
  KiraSheetRootProps,
  KiraSheetProps,
};

function resolveKiraSheetOptions({
  responsive = true,
  side = "right",
  mobileSide = "bottom",
  loading = false,
  loadingLabel = "Loading details…",
}: {
  responsive?: KiraSheetProps["responsive"];
  side?: KiraSheetProps["side"];
  mobileSide?: KiraSheetProps["mobileSide"];
  loading?: KiraSheetProps["loading"];
  loadingLabel?: KiraSheetProps["loadingLabel"];
}) {
  return { responsive, side, mobileSide, loading, loadingLabel };
}

// oxlint-disable-next-line eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function SheetStatusView({
  closeDisabledReason,
  loading,
  loadingLabel,
  error,
  onRetry,
  children,
  loadingContent,
}: {
  closeDisabledReason: string | undefined;
  loading: boolean;
  loadingLabel: string;
  error: React.ReactNode;
  onRetry: (() => void) | undefined;
  children: React.ReactNode;
  loadingContent: React.ReactNode;
}) {
  return (
    <SheetBody className="space-y-4">
      <p
        data-slot="sheet-status"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
        role="status"
        className={
          closeDisabledReason ? "text-sm text-muted-foreground" : "sr-only"
        }
      >
        {closeDisabledReason}
        {loading && (
          <span className="sr-only">
            {closeDisabledReason && " "}
            {loadingLabel}
          </span>
        )}
      </p>
      {!loading && error != null && (
        <div
          data-slot="sheet-error"
          className="space-y-3 rounded-lg border border-destructive/30 p-4"
        >
          <div role="alert" className="text-sm text-destructive">
            {error}
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      )}
      <div
        data-slot="sheet-loading-region"
        aria-busy={loading}
        className="relative min-h-48"
      >
        <div
          data-slot="sheet-body-content"
          className={loading ? "opacity-0" : undefined}
          aria-hidden={loading || undefined}
          inert={loading}
        >
          {children}
        </div>
        {loading && (
          <div
            data-slot="sheet-skeleton"
            aria-hidden="true"
            className="absolute inset-0"
          >
            {loadingContent ?? <Skeleton className="h-full w-full" />}
            <p className="absolute inset-x-4 top-4 text-sm text-muted-foreground">
              {loadingLabel}
            </p>
          </div>
        )}
      </div>
    </SheetBody>
  );
}

function useKiraSheetOptions({
  responsive: responsiveInput,
  side: sideInput,
  mobileSide: mobileSideInput,
  loading: loadingInput,
  loadingLabel: loadingLabelInput,
}: Parameters<typeof resolveKiraSheetOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraSheetOptions({
        responsive: responsiveInput,
        side: sideInput,
        mobileSide: mobileSideInput,
        loading: loadingInput,
        loadingLabel: loadingLabelInput,
      }),
    [
      responsiveInput,
      sideInput,
      mobileSideInput,
      loadingInput,
      loadingLabelInput,
    ],
  );
}
