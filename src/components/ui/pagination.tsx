"use client";

import * as React from "react";
import type { BaseUIEvent } from "@base-ui/react/types";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import {
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  usePagination,
  calculatePageRange,
  type UsePaginationOptions,
  type UsePaginationReturn,
  type PageRangeItem,
} from "@/hooks/use-pagination";
import { KiraSelect } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { isStringProp } from "@/lib/component-utils";

const paginationNavigationIcons = {
  first: IconChevronsLeft,
  previous: IconChevronLeft,
  next: IconChevronRight,
  last: IconChevronsRight,
};

const paginationVariants = cva(
  "@container/pagination flex min-w-0 w-full flex-wrap items-center gap-3",
  {
    variants: { size: { sm: "text-xs", default: "text-sm", lg: "text-base" } },
    defaultVariants: { size: "default" },
  },
);

const paginationLinkVariants = cva(
  "inline-flex shrink-0 touch-manipulation select-none items-center justify-center border border-transparent font-medium tabular-nums data-active:font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "min-h-8 min-w-8 px-2 text-xs",
        // kira-kit-ignore spacing-scale: pagination cell keeps 10px optical side padding
        default: "min-h-9 min-w-9 px-2.5 text-sm",
        lg: "min-h-11 min-w-11 px-3 text-base",
      },
      variant: {
        default:
          "rounded-md hover:bg-muted active:bg-accent data-active:border-primary data-active:bg-primary data-active:text-primary-foreground",
        outline:
          "rounded-md hover:border-border hover:bg-muted data-active:border-primary data-active:bg-primary/10 data-active:text-primary",
        pills:
          "rounded-full hover:bg-muted active:bg-accent data-active:border-primary data-active:bg-primary data-active:text-primary-foreground",
        ghost:
          "rounded-md hover:bg-muted data-active:font-semibold data-active:underline data-active:decoration-2 data-active:underline-offset-4",
        rounded:
          "rounded-lg hover:bg-muted active:bg-accent data-active:border-primary data-active:bg-primary data-active:text-primary-foreground",
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
        variant: "ghost",
        color: "success",
        className: "data-active:decoration-success",
      },
      {
        variant: "ghost",
        color: "warning",
        className: "data-active:decoration-warning",
      },
      {
        variant: "ghost",
        color: "destructive",
        className: "data-active:decoration-destructive",
      },
      {
        variant: ["default", "pills", "rounded"],
        color: "success",
        className:
          "data-active:border-success data-active:bg-success/15 data-active:text-foreground",
      },
      {
        variant: ["default", "pills", "rounded"],
        color: "warning",
        className:
          "data-active:border-warning data-active:bg-warning/15 data-active:text-foreground",
      },
      {
        variant: ["default", "pills", "rounded"],
        color: "destructive",
        className:
          "data-active:border-destructive data-active:bg-destructive data-active:text-destructive-foreground",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "data-active:border-success data-active:bg-success/10 data-active:text-foreground",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "data-active:border-warning data-active:bg-warning/10 data-active:text-foreground",
      },
      {
        variant: "outline",
        color: "destructive",
        className:
          "data-active:border-destructive data-active:bg-destructive/10 data-active:text-destructive",
      },
    ],
    defaultVariants: { size: "default", variant: "default", color: "default" },
  },
);

interface PaginationContextValue extends UsePaginationReturn {
  size: "sm" | "default" | "lg";
  variant: "default" | "outline" | "pills" | "ghost" | "rounded";
  color: "default" | "primary" | "success" | "warning" | "destructive";
  disabled: boolean;
  loading: boolean;
  error?: React.ReactNode;
  hasRetry: boolean;
  managed: boolean;
  paginationId: string;
  descriptionId?: string;
  controlsId?: string;
  formatNumber: (value: number) => string;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(
  null,
);

function usePaginationContext() {
  return React.useContext(PaginationContext);
}

interface PaginationJumpPayload {
  getPageHref?: (page: number) => string;
}

interface PaginationProps
  extends
    Omit<React.ComponentProps<"nav">, "color">,
    UsePaginationOptions,
    VariantProps<typeof paginationVariants> {
  variant?: PaginationContextValue["variant"];
  color?: PaginationContextValue["color"];
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  error?: React.ReactNode;
  onRetry?: () => void;
  controlsId?: string;
  locale?: string;
}

function Pagination(arg0: PaginationProps) {
  const model = usePaginationModel(arg0);

  return <PaginationView {...model} />;
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex min-w-0 max-w-full items-center gap-1 overflow-x-auto p-1",
        className,
      )}
      {...props}
    />
  );
}

interface PaginationItemProps extends React.ComponentProps<"li"> {
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
      data-mobile-hide={mobileHide || undefined}
      className={cn(
        "flex shrink-0",
        { "hidden @sm/pagination:flex": mobileHide },
        className,
      )}
      {...props}
    />
  );
}

interface PaginationLinkProps
  extends
    Omit<ButtonPrimitive.Props, "className" | "color" | "ref">,
    VariantProps<typeof paginationLinkVariants> {
  className?: string;
  ref?: React.Ref<HTMLElement>;
  isActive?: boolean;
  page?: number;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  download?: boolean | string;
}

function isNativePaginationLink(element: HTMLElement) {
  return element.tagName === "A" && element.hasAttribute("href");
}

function PaginationLink(arg0: PaginationLinkProps) {
  const model = usePaginationLinkModel(arg0);

  return <PaginationLinkView {...model} />;
}

type PaginationNavigationProps = Omit<
  PaginationLinkProps,
  "page" | "isActive"
> & { showLabel?: boolean; text?: string };

function PaginationNavigation({
  direction,
  showLabel = false,
  text,
  className,
  disabled,
  onClick,
  children,
  ...props
}: PaginationNavigationProps & {
  direction: "first" | "previous" | "next" | "last";
}) {
  const resolveAction2 = () => paginationResolveAction2(direction, context);

  const context = usePaginationContext();
  const leading = direction === "first" || direction === "previous";

  const atBoundary =
    context?.managed && (leading ? !context.hasPrev : !context.hasNext);

  const Icon = paginationNavigationIcons[direction];

  const label =
    text ??
    { first: "First", previous: "Previous", next: "Next", last: "Last" }[
      direction
    ];

  const action = resolveAction2();

  return (
    // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
    <PaginationLink
      {...props}
      data-slot={`pagination-${direction}`}
      disabled={Boolean(disabled || atBoundary)}
      aria-label={props["aria-label"] ?? `Go to ${direction} page`}
      className={cn("gap-1.5", className)}
      onClick={(event) => {
        onClick?.(event);

        if (
          !event.defaultPrevented &&
          !isNativePaginationLink(event.currentTarget)
        )
          action?.();
      }}
    >
      {children ?? (
        <PaginationNavigationIconView
          leading={leading}
          Icon={Icon}
          showLabel={showLabel}
          label={label}
        />
      )}
    </PaginationLink>
  );
}

function PaginationFirst(props: PaginationNavigationProps) {
  return <PaginationNavigation direction="first" {...props} />;
}

function PaginationPrevious(props: PaginationNavigationProps) {
  return <PaginationNavigation direction="previous" {...props} />;
}

function PaginationNext(props: PaginationNavigationProps) {
  return <PaginationNavigation direction="next" {...props} />;
}

function PaginationLast(props: PaginationNavigationProps) {
  return <PaginationNavigation direction="last" {...props} />;
}

interface PaginationEllipsisProps extends Omit<
  PopoverPrimitive.Trigger.Props<PaginationJumpPayload>,
  | "className"
  | "children"
  | "payload"
  | "handle"
  | "render"
  | "nativeButton"
  | "type"
> {
  className?: string;
  getPageHref?: (page: number) => string;
}

function PaginationEllipsis({
  className,
  getPageHref,
  disabled,
  "aria-label": ariaLabel = "Go to page",
  "aria-describedby": describedBy,
  ...props
}: PaginationEllipsisProps) {
  const context = usePaginationContext();

  if (!context) return null;

  return (
    <PopoverPrimitive.Trigger
      {...props}
      type="button"
      data-slot="pagination-ellipsis"
      payload={{ getPageHref }}
      disabled={
        disabled || context.disabled || context.loading || !context.pageCount
      }
      aria-label={ariaLabel}
      aria-describedby={
        [describedBy, context.descriptionId].filter(Boolean).join(" ") ||
        undefined
      }
      className={cn(
        paginationLinkVariants({
          size: context.size,
          variant: context.variant,
        }),
        "text-muted-foreground pointer-coarse:min-h-11 pointer-coarse:min-w-11",
        className,
      )}
    >
      <IconDots
        data-slot="pagination-ellipsis-icon"
        className="size-4"
        aria-hidden="true"
      />
    </PopoverPrimitive.Trigger>
  );
}

function PaginationEllipsisPopup({
  getPageHref,
  onJump,
  focusCurrentPage,
}: PaginationJumpPayload & {
  onJump: (page: number) => void;
  focusCurrentPage: boolean;
}) {
  const context = usePaginationContext();
  const reduced = useReducedMotion();

  if (!context) return null;

  return (
    <PaginationEllipsisPositionerView
      focusCurrentPage={focusCurrentPage}
      context={context}
      reduced={reduced}
      getPageHref={getPageHref}
      onJump={onJump}
    />
  );
}

interface PaginationPagesProps {
  renderPage?: (item: PageRangeItem, index: number) => React.ReactNode;
  renderEllipsis?: (key: string) => React.ReactNode;
  /** 1 shows only the current page in narrow containers; 3+ shows a range. */
  mobileMaxPages?: number;
  getPageHref?: (page: number) => string;
}

function PaginationPages({
  renderPage,
  renderEllipsis,
  mobileMaxPages = 1,
  getPageHref,
}: PaginationPagesProps) {
  const context = usePaginationContext();

  if (!context || context.pageCount === 0) return null;
  const desktop = context.getPageRange();

  const mobile =
    mobileMaxPages < 3
      ? [{ type: "page" as const, page: context.page, isActive: true }]
      : calculatePageRange(context.page, context.pageCount, mobileMaxPages);

  const renderItem = (item: PageRangeItem, index: number) =>
    renderPage?.(item, index) ??
    (item.type === "ellipsis" ? (
      (renderEllipsis?.(item.key) ?? (
        <PaginationEllipsis
          getPageHref={getPageHref}
          aria-label={
            item.key === "ellipsis-start"
              ? "Go to an earlier page"
              : "Go to a later page"
          }
        />
      ))
    ) : (
      <PaginationLink
        page={item.page}
        isActive={item.isActive}
        href={getPageHref?.(item.page)}
      />
    ));

  return (
    <>
      {desktop.map((item, index) => (
        <PaginationItem
          key={item.type === "page" ? item.page : item.key}
          mobileHide
        >
          {renderItem(item, index)}
        </PaginationItem>
      ))}
      {mobile.map((item, index) => (
        <PaginationItem
          key={`mobile-${item.type === "page" ? item.page : item.key}`}
          className="@sm/pagination:hidden"
        >
          {renderItem(item, index)}
        </PaginationItem>
      ))}
    </>
  );
}

interface PaginationInfoProps extends React.ComponentProps<"div"> {
  format?: string;
  emptyText?: string;
  mobileCompact?: boolean;
}

function PaginationInfo({
  className,
  format = "Showing {start}–{end} of {total}",
  emptyText = "No results",
  mobileCompact = false,
  ...props
}: PaginationInfoProps) {
  const context = usePaginationContext();

  if (!context) return null;

  const values = {
    start: context.startItem,
    end: context.endItem,
    total: context.total,
    page: context.page,
    pageCount: context.pageCount,
  };

  const text =
    context.total === 0
      ? emptyText
      : Object.entries(values).reduce(
          (template, [token, number]) =>
            template.replaceAll(`{${token}}`, context.formatNumber(number)),
          format,
        );

  return (
    <div
      data-slot="pagination-info"
      className={cn(
        "min-w-0 text-sm text-muted-foreground tabular-nums wrap-anywhere",
        className,
      )}
      {...props}
    >
      {mobileCompact && context.total > 0 ? (
        <>
          <span
            data-slot="pagination-info-full"
            className="hidden @sm/pagination:inline"
          >
            {text}
          </span>
          <span
            data-slot="pagination-info-compact"
            className="@sm/pagination:hidden"
          >
            Page {context.formatNumber(context.page)} of{" "}
            {context.formatNumber(context.pageCount)}
          </span>
        </>
      ) : (
        text
      )}
    </div>
  );
}

interface PaginationSizeSelectorProps {
  className?: string;
  options?: readonly number[];
  label?: string;
  suffix?: string;
  showLabel?: boolean;
  onSizeChange?: (size: number) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

function PaginationSizeSelector({
  className,
  options = [10, 20, 50, 100],
  label = "Rows per page",
  suffix,
  showLabel = true,
  onSizeChange,
  disabled,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: PaginationSizeSelectorProps) {
  const context = usePaginationContext();
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const suffixId = `${selectId}-suffix`;

  const { sizes, selected } = paginationSizeChoices(options, context);

  return (
    <div
      data-slot="pagination-size-selector"
      className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}
    >
      {showLabel && (
        <label
          data-slot="pagination-size-label"
          htmlFor={selectId}
          className="text-sm text-muted-foreground"
        >
          {label}
        </label>
      )}
      <KiraSelect
        id={selectId}
        name={name}
        data-slot="pagination-size-control"
        options={sizes.map((value) => ({
          value: String(value),
          label: context?.formatNumber(value) ?? String(value),
        }))}
        value={String(selected)}
        disabled={paginationUnavailable(disabled, context)}
        aria-label={ariaLabel ?? label}
        aria-describedby={paginationDescription(
          [describedBy, suffix && suffixId].filter(Boolean).join(" ") ||
            undefined,
          context,
        )}
        size="xs"
        className={cn(
          "w-fit max-w-full motion-reduce:transition-none pointer-coarse:min-h-11",
          "**:data-[slot=select-field-input]:w-[5ch] **:data-[slot=select-field-input]:flex-none",
          "supports-[field-sizing:content]:**:data-[slot=select-field-input]:w-auto supports-[field-sizing:content]:[&_[data-slot=select-field-input]]:field-sizing-content",
          "**:data-[slot=select-field-clear]:hidden",
        )}
        onChange={(value) => {
          if (!isStringProp(value) || !value) return;
          const next = Number(value);
          onSizeChange?.(next);
          context?.setPageSize(next);
        }}
      />
      {suffix && (
        <span id={suffixId} className="text-sm text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  );
}

function paginationUnavailable(
  disabled: boolean | undefined,
  context: PaginationContextValue | null,
) {
  return Boolean(disabled || context?.disabled || context?.loading);
}

function paginationDescription(
  describedBy: string | undefined,
  context: PaginationContextValue | null,
) {
  return (
    [describedBy, context?.descriptionId].filter(Boolean).join(" ") || undefined
  );
}

function paginationSizeChoices(
  options: readonly number[],
  context: PaginationContextValue | null,
) {
  const sizes = Array.from(
    new Set(
      [...options, context?.pageSize ?? 10].filter(
        (value) => Number.isSafeInteger(value) && value > 0,
      ),
    ),
  );

  return { sizes, selected: context?.pageSize ?? sizes[0] ?? 10 };
}

interface PaginationJumpProps extends Omit<
  InputPrimitive.Props,
  "className" | "value" | "defaultValue" | "onValueChange" | "type"
> {
  className?: string;
  label?: string;
  showLabel?: boolean;
  onJump?: (page: number) => void;
  getPageHref?: (page: number) => string;
}

function getValidJumpPage(value: string, pageCount: number) {
  const page = Number(value);

  return /^[1-9]\d*$/.test(value) &&
    Number.isSafeInteger(page) &&
    page <= pageCount
    ? page
    : null;
}

function PaginationJump(arg0: PaginationJumpProps) {
  const model = usePaginationJumpModel(arg0);

  return <PaginationJumpView {...model} />;
}

function getPaginationAnnouncement(
  context: PaginationContextValue,
  loadingText: string,
) {
  if (context.loading) return loadingText;

  if (context.error)
    return (
      <>
        {context.error} {context.hasRetry && "Try again is available."}
      </>
    );

  if (context.total === 0) return "No results.";

  return `Page ${context.formatNumber(context.page)} of ${context.formatNumber(context.pageCount)}. Showing items ${context.formatNumber(context.startItem)} to ${context.formatNumber(context.endItem)} of ${context.formatNumber(context.total)}.`;
}

interface PaginationStatusProps extends React.ComponentProps<"div"> {
  loadingText?: string;
}

function PaginationStatus({
  className,
  children,
  loadingText = "Loading results…",
  ...props
}: PaginationStatusProps) {
  const context = usePaginationContext();

  if (!context) return null;

  return (
    <div
      data-slot="pagination-status"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn("sr-only", className)}
      {...props}
    >
      {children ?? getPaginationAnnouncement(context, loadingText)}
    </div>
  );
}

interface KiraPagePaginationProps extends PaginationProps {
  mode?: "pages";
  showInfo?: boolean;
  infoFormat?: string;
  emptyInfoText?: string;
  /** Compact "Page x of y" info in narrow containers instead of the full range. */
  infoMobileCompact?: boolean;
  showSizeSelector?: boolean;
  pageSizeOptions?: readonly number[];
  pageSizeLabel?: string;
  pageSizeSuffix?: string;
  showJump?: boolean;
  showEdges?: boolean;
  showLabels?: boolean;
  mobileMaxPages?: number;
  getPageHref?: (page: number) => string;
}

interface KiraCursorPaginationProps extends Omit<
  React.ComponentProps<"nav">,
  "color" | "onChange"
> {
  mode: "cursor";
  hasPreviousPage?: boolean;
  hasNextPage: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  previousHref?: string;
  nextHref?: string;
  /** Optional known batch ordinal. No total or last-page count is inferred. */
  page?: number;
  itemCount?: number;
  size?: PaginationContextValue["size"];
  variant?: PaginationContextValue["variant"];
  color?: PaginationContextValue["color"];
  loading?: boolean;
  loadingText?: string;
  error?: React.ReactNode;
  onRetry?: () => void;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  controlsId?: string;
  locale?: string;
}

type KiraPaginationProps = KiraPagePaginationProps | KiraCursorPaginationProps;

function KiraPaginationNavigation({
  getPageHref,
  showEdges,
  showLabels,
  mobileMaxPages,
}: Pick<
  KiraPagePaginationProps,
  "getPageHref" | "showEdges" | "showLabels" | "mobileMaxPages"
>) {
  const context = usePaginationContext();

  if (!context) return null;

  return (
    <PaginationContentView
      showEdges={showEdges}
      context={context}
      getPageHref={getPageHref}
      showLabels={showLabels}
      mobileMaxPages={mobileMaxPages}
    />
  );
}

function KiraCursorPagination(arg0: KiraCursorPaginationProps) {
  const model = useKiraCursorPaginationModel(arg0);

  return <KiraCursorPaginationView {...model} />;
}

function KiraPagination(props: KiraPaginationProps) {
  if (props.mode === "cursor") return <KiraCursorPagination {...props} />;

  const {
    mode: _mode,
    showInfo = true,
    infoFormat,
    emptyInfoText,
    infoMobileCompact,
    showSizeSelector = false,
    pageSizeOptions,
    pageSizeLabel,
    pageSizeSuffix,
    showJump = false,
    showEdges = false,
    showLabels = false,
    mobileMaxPages = 1,
    getPageHref,
    children,
    error,
    onRetry,
    ...paginationProps
  } = props;

  const buildInfo = () =>
    showInfo ? (
      <PaginationInfo
        format={infoFormat}
        emptyText={emptyInfoText}
        mobileCompact={infoMobileCompact}
      />
    ) : null;

  const buildNavigation = () => (
    <KiraPaginationNavigation
      getPageHref={getPageHref}
      showEdges={showEdges}
      showLabels={showLabels}
      mobileMaxPages={mobileMaxPages}
    />
  );

  return (
    <Pagination
      {...paginationProps}
      error={error}
      onRetry={onRetry}
      data-kira-pagination=""
      data-mode="pages"
    >
      <div
        data-slot="pagination-overview"
        className="flex min-w-0 w-full flex-wrap items-center justify-between gap-3"
      >
        {buildInfo()}
        <div className="ml-auto flex min-w-0 max-w-full flex-wrap items-center justify-end gap-3">
          {showSizeSelector && (
            <PaginationSizeSelector
              options={pageSizeOptions}
              label={pageSizeLabel}
              suffix={pageSizeSuffix}
            />
          )}
          {buildNavigation()}
        </div>
      </div>
      {showJump && (
        <div data-slot="pagination-options" className="w-full">
          <PaginationJump getPageHref={getPageHref} />
        </div>
      )}
      {children}
      <KiraPaginationResultStatus
        error={error}
        onRetry={onRetry}
        loadingText={paginationProps.loadingText}
        loading={paginationProps.loading}
      />
    </Pagination>
  );
}

function KiraPaginationResultStatus({
  error,
  onRetry,
  loadingText,
  loading,
}: Pick<PaginationProps, "error" | "onRetry" | "loadingText" | "loading">) {
  return (
    <PaginationStatus loadingText={loadingText}>
      {error && !loading ? (
        <>
          {error} {onRetry && "Try again is available."}
        </>
      ) : undefined}
    </PaginationStatus>
  );
}

export {
  KiraPagination,
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

export type {
  KiraPaginationProps,
  KiraPagePaginationProps,
  KiraCursorPaginationProps,
  PaginationProps,
  PaginationContextValue,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNavigationProps,
  PaginationEllipsisProps,
  PaginationPagesProps,
  PaginationInfoProps,
  PaginationSizeSelectorProps,
  PaginationJumpProps,
  PaginationStatusProps,
};

export {
  usePagination,
  useUrlPagination,
  calculatePageRange,
} from "@/hooks/use-pagination";

export type {
  PaginationState,
  UsePaginationOptions,
  UsePaginationReturn,
  UseUrlPaginationOptions,
  UseUrlPaginationReturn,
  PageRangeItem,
  PaginationRangeItem,
} from "@/hooks/use-pagination";

function resolvePaginationOptions({
  size = "default",
  variant = "default",
  color = "default",
  disabled = false,
  loading = false,
  loadingText = "Loading results…",
}: {
  size?: PaginationProps["size"];
  variant?: PaginationProps["variant"];
  color?: PaginationProps["color"];
  disabled?: PaginationProps["disabled"];
  loading?: PaginationProps["loading"];
  loadingText?: PaginationProps["loadingText"];
}) {
  return { size, variant, color, disabled, loading, loadingText };
}

function resolvePaginationOptions2({
  locale = "en-US",
  ariaLabel = "Pagination",
}: {
  locale?: PaginationProps["locale"];
  ariaLabel?: PaginationProps["aria-label"];
}) {
  return { locale, ariaLabel };
}

function resolveKiraCursorPaginationOptions({
  hasPreviousPage = false,
  size = "default",
  variant = "outline",
  color = "default",
  loading = false,
  loadingText = "Loading results…",
}: {
  hasPreviousPage?: KiraCursorPaginationProps["hasPreviousPage"];
  size?: KiraCursorPaginationProps["size"];
  variant?: KiraCursorPaginationProps["variant"];
  color?: KiraCursorPaginationProps["color"];
  loading?: KiraCursorPaginationProps["loading"];
  loadingText?: KiraCursorPaginationProps["loadingText"];
}) {
  return { hasPreviousPage, size, variant, color, loading, loadingText };
}

function resolveKiraCursorPaginationOptions2({
  disabled = false,
  locale = "en-US",
  ariaLabel = "Results pagination",
}: {
  disabled?: KiraCursorPaginationProps["disabled"];
  locale?: KiraCursorPaginationProps["locale"];
  ariaLabel?: KiraCursorPaginationProps["aria-label"];
}) {
  return { disabled, locale, ariaLabel };
}

function PaginationErrorView({
  error,
  onRetry,
  disabled,
  size,
}: {
  error: React.ReactNode;
  onRetry: (() => void) | undefined;
  disabled: boolean;
  size: "default" | "sm" | "lg" | null;
}) {
  return (
    <div
      data-slot="pagination-error"
      className="flex w-full flex-wrap items-center gap-2 text-sm text-destructive"
    >
      <IconAlertCircle
        data-slot="pagination-error-icon"
        className="size-4 shrink-0"
        aria-hidden="true"
      />
      <span
        data-slot="pagination-error-message"
        className="min-w-0 wrap-anywhere"
      >
        {error}
      </span>
      {onRetry && (
        <ButtonPrimitive
          type="button"
          data-slot="pagination-retry"
          disabled={disabled}
          onClick={onRetry}
          className={cn(
            paginationLinkVariants({
              size: size ?? "default",
              variant: "outline",
            }),
            "text-foreground",
          )}
        >
          Try again
        </ButtonPrimitive>
      )}
    </div>
  );
}

function PaginationNavigationIconView({
  leading,
  Icon,
  showLabel,
  label,
}: {
  leading: boolean;
  Icon: typeof IconChevronLeft;
  showLabel: boolean;
  label: string;
}) {
  return (
    <>
      {leading && (
        <Icon
          data-slot="pagination-navigation-icon"
          className="size-4 rtl:rotate-180"
          aria-hidden="true"
        />
      )}
      {showLabel && (
        <span
          data-slot="pagination-navigation-label"
          className="hidden @sm/pagination:inline"
        >
          {label}
        </span>
      )}
      {!leading && (
        <Icon
          data-slot="pagination-navigation-icon"
          className="size-4 rtl:rotate-180"
          aria-hidden="true"
        />
      )}
    </>
  );
}

function PaginationEllipsisPositionerView({
  focusCurrentPage,
  context,
  reduced,
  getPageHref,
  onJump,
}: {
  focusCurrentPage: boolean;
  context: PaginationContextValue;
  reduced: boolean;
  getPageHref: ((page: number) => string) | undefined;
  onJump: (page: number) => void;
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        data-slot="pagination-ellipsis-positioner"
        side="bottom"
        sideOffset={6}
        collisionPadding={16}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="pagination-ellipsis-popup"
          initialFocus
          finalFocus={
            focusCurrentPage
              ? () => {
                  const nav = document.getElementById(context.paginationId);

                  const active = Array.from(
                    nav?.querySelectorAll<HTMLElement>(
                      '[aria-current="page"]',
                    ) ?? [],
                  ).find(
                    (element) =>
                      element.getClientRects().length > 0 &&
                      element.tabIndex >= 0 &&
                      !element.matches(":disabled, [aria-disabled=true]"),
                  );

                  if (active) return active;

                  if (!nav) return true;
                  // Returning a non-tabbable nav lets Base UI choose its first
                  // tabbable child. Focus it explicitly without adding a tab stop.
                  nav.focus({ preventScroll: true });

                  return false;
                }
              : undefined
          }
          className={cn(
            "max-w-[min(var(--available-width),calc(100vw-2rem))] rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md outline-none",
            {
              "origin-(--transform-origin) transition-[opacity,scale] duration-200 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0":
                !reduced,
            },
          )}
        >
          <PopoverPrimitive.Title
            data-slot="pagination-ellipsis-title"
            className="sr-only"
          >
            Go to page
          </PopoverPrimitive.Title>
          <PaginationJump
            showLabel={false}
            aria-label={`Page number, 1 to ${context.formatNumber(context.pageCount)}`}
            getPageHref={getPageHref}
            onJump={onJump}
          />
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

// oxlint-disable-next-line eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function PaginationContentView({
  showEdges,
  context,
  getPageHref,
  showLabels,
  mobileMaxPages,
}: {
  showEdges: boolean | undefined;
  context: PaginationContextValue;
  getPageHref: ((page: number) => string) | undefined;
  showLabels: boolean | undefined;
  mobileMaxPages: number | undefined;
}) {
  return (
    <PaginationContent>
      {showEdges && (
        <PaginationItem mobileHide>
          <PaginationFirst
            href={context.hasPrev ? getPageHref?.(1) : undefined}
          />
        </PaginationItem>
      )}
      <PaginationItem>
        <PaginationPrevious
          showLabel={showLabels}
          href={context.hasPrev ? getPageHref?.(context.page - 1) : undefined}
        />
      </PaginationItem>
      <PaginationPages
        getPageHref={getPageHref}
        mobileMaxPages={mobileMaxPages}
      />
      <PaginationItem>
        <PaginationNext
          showLabel={showLabels}
          href={context.hasNext ? getPageHref?.(context.page + 1) : undefined}
        />
      </PaginationItem>
      {showEdges && (
        <PaginationItem mobileHide>
          <PaginationLast
            href={
              context.hasNext ? getPageHref?.(context.pageCount) : undefined
            }
          />
        </PaginationItem>
      )}
    </PaginationContent>
  );
}

function PaginationErrorView2({
  error,
  onRetry,
  disabled,
  size,
}: {
  error: React.ReactNode;
  onRetry: (() => void) | undefined;
  disabled: boolean;
  size: "default" | "sm" | "lg";
}) {
  return (
    <div
      data-slot="pagination-error"
      className="flex flex-wrap items-center gap-2 text-sm text-destructive"
    >
      <IconAlertCircle
        data-slot="pagination-error-icon"
        className="size-4 shrink-0"
        aria-hidden="true"
      />
      <span
        data-slot="pagination-error-message"
        className="min-w-0 wrap-anywhere"
      >
        {error}
      </span>
      {onRetry && (
        <PaginationLink
          data-slot="pagination-retry"
          onClick={onRetry}
          disabled={disabled}
          size={size}
          variant="outline"
        >
          Try again
        </PaginationLink>
      )}
    </div>
  );
}

function usePaginationModel(input: PaginationProps) {
  const {
    className,
    children,
    id,
    error,
    onRetry,
    disabledReason,
    pageSize,
    ...props
  } = input;

  const presentation = usePaginationPresentation(input);
  const generatedId = React.useId();
  const paginationId = id ?? generatedId;
  const [jumpOpen, setJumpOpen] = React.useState(false);
  const [jumped, setJumped] = React.useState(false);
  const pagination = usePaginationState(input, pageSize);

  const context = usePaginationContextValue(
    input,
    pagination,
    presentation,
    paginationId,
  );

  return {
    context,
    jumpOpen,
    setJumped,
    setJumpOpen,
    props,
    paginationId,
    size: presentation.size,
    disabled: presentation.disabled,
    loading: presentation.loading,
    ariaLabel: presentation.ariaLabel,
    className,
    children,
    loadingText: presentation.loadingText,
    error,
    onRetry,
    descriptionId: context.descriptionId,
    disabledReason,
    jumped,
  };
}

function usePaginationState(
  input: PaginationProps,
  pageSize: number | undefined,
) {
  return usePagination({
    total: input.total,
    defaultTotal: input.defaultTotal,
    pageSize,
    defaultPageSize: input.defaultPageSize,
    defaultPage: input.defaultPage,
    page: input.page,
    onPageChange: input.onPageChange,
    onPageSizeChange: input.onPageSizeChange,
    onTotalChange: input.onTotalChange,
    onPaginationChange: input.onPaginationChange,
    maxPages: input.maxPages,
    keepInBounds: input.keepInBounds,
  });
}

function usePaginationContextValue(
  input: PaginationProps,
  pagination: ReturnType<typeof usePagination>,
  presentation: ReturnType<typeof usePaginationPresentation>,
  paginationId: string,
) {
  const formatter = new Intl.NumberFormat(presentation.locale);

  return createPaginationContext({
    pagination,
    presentation,
    input,
    paginationId,
    formatter,
  });
}

function createPaginationContext({
  pagination,
  presentation,
  input,
  paginationId,
  formatter,
}: {
  pagination: ReturnType<typeof usePagination>;
  presentation: ReturnType<typeof usePaginationPresentation>;
  input: PaginationProps;
  paginationId: string;
  formatter: Intl.NumberFormat;
}): PaginationContextValue {
  return {
    ...pagination,
    size: presentation.size ?? "default",
    variant: presentation.variant,
    color: presentation.color,
    disabled: presentation.disabled,
    loading: presentation.loading,
    error: input.error,
    hasRetry: input.onRetry !== undefined,
    managed: input.total !== undefined || input.defaultTotal !== undefined,
    paginationId,
    descriptionId:
      presentation.disabled && input.disabledReason
        ? `${paginationId}-reason`
        : undefined,
    controlsId: input.controlsId,
    formatNumber: (value) => formatter.format(value),
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function PaginationView({
  context,
  jumpOpen,
  setJumped,
  setJumpOpen,
  props,
  paginationId,
  size,
  disabled,
  loading,
  ariaLabel,
  className,
  children,
  loadingText,
  error,
  onRetry,
  descriptionId,
  disabledReason,
  jumped,
}: ReturnType<typeof usePaginationModel>) {
  return (
    <PaginationContext.Provider value={context}>
      <PopoverPrimitive.Root<PaginationJumpPayload>
        open={jumpOpen}
        onOpenChange={(open) => {
          if (open) setJumped(false);
          setJumpOpen(open);
        }}
      >
        {({ payload }) => (
          <>
            <nav
              {...props}
              id={paginationId}
              tabIndex={props.tabIndex ?? -1}
              data-slot="pagination"
              data-size={size}
              data-disabled={disabled || undefined}
              data-loading={loading || undefined}
              aria-label={ariaLabel}
              aria-busy={loading || undefined}
              className={cn(
                paginationVariants({ size }),
                "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className,
              )}
            >
              {children}
              {loading && (
                <p
                  data-slot="pagination-loading"
                  className="flex w-full items-center gap-2 text-sm text-muted-foreground"
                >
                  <Spinner size="sm" variant="muted" />
                  {loadingText}
                </p>
              )}
              {!loading && error && (
                <PaginationErrorView
                  error={error}
                  onRetry={onRetry}
                  disabled={disabled}
                  size={size}
                />
              )}
              {descriptionId && (
                <p
                  data-slot="pagination-disabled-reason"
                  id={descriptionId}
                  className="w-full text-sm text-muted-foreground"
                >
                  {disabledReason}
                </p>
              )}
            </nav>
            <PaginationEllipsisPopup
              getPageHref={payload?.getPageHref}
              focusCurrentPage={jumped}
              onJump={() => {
                setJumped(true);
                setJumpOpen(false);
              }}
            />
          </>
        )}
      </PopoverPrimitive.Root>
    </PaginationContext.Provider>
  );
}

function usePaginationLinkModel({
  className,
  isActive,
  size: sizeProp,
  variant: variantProp,
  color: colorProp,
  page,
  onClick,
  onKeyDown,
  onKeyUp,
  children,
  disabled: disabledProp,
  href,
  render,
  nativeButton,
  target,
  rel,
  download,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  ...props
}: PaginationLinkProps) {
  const context = usePaginationContext();

  const { disabled, active, size } = paginationLinkSemantics({
    disabledProp,
    isActive,
    page,
    sizeProp,
    context,
  });

  const { linkHref, clonedLinkProps, renderedElement } = paginationLinkRender({
    href,
    render,
    disabled,
    target,
    rel,
    download,
  });

  return {
    props,
    linkProps: clonedLinkProps,
    linkHref,
    active,
    ariaLabel,
    page,
    context,
    describedBy,
    disabled,
    nativeButton,
    render,
    renderedElement,
    size,
    variantProp,
    colorProp,
    className,
    onClick,
    onKeyDown,
    onKeyUp,
    children,
  };
}

function paginationLinkSemantics({
  disabledProp,
  isActive,
  page,
  sizeProp,
  context,
}: {
  disabledProp: boolean | undefined;
  isActive: boolean | undefined;
  page: number | undefined;
  sizeProp: PaginationLinkProps["size"];
  context: PaginationContextValue | null;
}) {
  return {
    disabled: paginationLinkDisabled(disabledProp, context),
    active: paginationLinkActive(isActive, page, context),
    size: paginationLinkSize(sizeProp, context),
  };
}

function paginationLinkDisabled(
  disabled: boolean | undefined,
  context: PaginationContextValue | null,
) {
  return Boolean(disabled || context?.disabled || context?.loading);
}

function paginationLinkActive(
  active: boolean | undefined,
  page: number | undefined,
  context: PaginationContextValue | null,
) {
  return active ?? (page !== undefined && context?.isCurrentPage(page));
}

function paginationLinkSize(
  size: PaginationLinkProps["size"],
  context: PaginationContextValue | null,
) {
  return size ?? context?.size ?? "default";
}

function paginationLinkRender({
  href,
  render,
  disabled,
  target,
  rel,
  download,
}: {
  href: string | undefined;
  render: PaginationLinkProps["render"];
  disabled: boolean;
  target: React.HTMLAttributeAnchorTarget | undefined;
  rel: string | undefined;
  download: boolean | string | undefined;
}) {
  const anchor =
    React.isValidElement<React.ComponentProps<"a">>(render) &&
    render.type === "a"
      ? render
      : undefined;

  const linkHref = href ?? anchor?.props.href;

  const clonedLinkProps = paginationAnchorProps({
    linkHref,
    disabled,
    target,
    rel,
    download,
  });

  return {
    linkHref,
    clonedLinkProps,
    renderedElement: React.isValidElement(render)
      ? React.cloneElement(render, clonedLinkProps)
      : render,
  };
}

function paginationAnchorProps({
  linkHref,
  disabled,
  target,
  rel,
  download,
}: {
  linkHref: string | undefined;
  disabled: boolean;
  target: React.ComponentProps<"a">["target"];
  rel: React.ComponentProps<"a">["rel"];
  download: React.ComponentProps<"a">["download"];
}): Pick<
  React.ComponentProps<"a">,
  "href" | "target" | "rel" | "download" | "onClick"
> {
  const props: Pick<
    React.ComponentProps<"a">,
    "href" | "target" | "rel" | "download" | "onClick"
  > = {};

  if (linkHref !== undefined || disabled)
    props.href = disabled ? undefined : linkHref;

  if (target !== undefined) props.target = target;

  if (rel !== undefined) props.rel = rel;

  if (download !== undefined) props.download = download;

  if (disabled) props.onClick = undefined;

  return props;
}

function PaginationLinkView({
  props,
  linkProps,
  linkHref,
  active,
  ariaLabel,
  page,
  context,
  describedBy,
  disabled,
  nativeButton,
  render,
  renderedElement,
  size,
  variantProp,
  colorProp,
  className,
  onClick,
  onKeyDown,
  onKeyUp,
  children,
}: ReturnType<typeof usePaginationLinkModel>) {
  const aria = paginationLinkAria({
    ariaLabel,
    page,
    active,
    context,
    controlsId: props["aria-controls"],
    describedBy,
    descriptionId: context?.descriptionId,
  });

  const target = paginationLinkTarget({
    linkHref,
    nativeButton,
    render,
    renderedElement,
    children,
    role: props.role,
  });

  const keyboardHandlers = paginationLinkKeyboardHandlers(onKeyDown, onKeyUp);

  const presentation = paginationLinkPresentation({
    size,
    variantProp,
    colorProp,
    context,
    className,
    children,
    page,
  });

  return (
    <ButtonPrimitive
      data-slot="pagination-link"
      {...props}
      {...linkProps}
      type={target.type}
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      aria-label={aria.label}
      aria-controls={aria.controls}
      aria-describedby={aria.describedBy}
      disabled={disabled}
      nativeButton={target.nativeButton}
      render={target.render}
      role={target.role}
      className={presentation.className}
      onClick={(event) =>
        paginationCallback(event, disabled, onClick, page, context)
      }
      onKeyDown={keyboardHandlers.onKeyDown}
      onKeyUp={keyboardHandlers.onKeyUp}
    >
      {presentation.children}
    </ButtonPrimitive>
  );
}

function paginationLinkPresentation({
  size,
  variantProp,
  colorProp,
  context,
  className,
  children,
  page,
}: {
  size: PaginationLinkProps["size"];
  variantProp: PaginationLinkProps["variant"];
  colorProp: PaginationLinkProps["color"];
  context: PaginationContextValue | null;
  className: string | undefined;
  children: React.ReactNode;
  page: number | undefined;
}) {
  return {
    className: cn(
      paginationLinkClasses(size, variantProp, colorProp, context),
      "pointer-coarse:min-h-11 pointer-coarse:min-w-11",
      className,
    ),
    children: paginationLinkChildren(children, page, context),
  };
}

function paginationLinkClasses(
  size: PaginationLinkProps["size"],
  variant: PaginationLinkProps["variant"],
  color: PaginationLinkProps["color"],
  context: PaginationContextValue | null,
) {
  return paginationLinkVariants({
    size,
    variant: variant ?? context?.variant ?? "default",
    color: color ?? context?.color ?? "default",
  });
}

function paginationLinkChildren(
  children: React.ReactNode,
  page: number | undefined,
  context: PaginationContextValue | null,
) {
  if (children !== undefined && children !== null) return children;

  if (page === undefined) return undefined;

  return context?.formatNumber(page) ?? page;
}

type PaginationKeyboardEvent = Parameters<
  NonNullable<PaginationLinkProps["onKeyDown"]>
>[0];

function paginationLinkKeyboardHandlers(
  onKeyDown: PaginationLinkProps["onKeyDown"],
  onKeyUp: PaginationLinkProps["onKeyUp"],
) {
  const handleKey = (
    event: PaginationKeyboardEvent,
    callback: PaginationLinkProps["onKeyDown"] | PaginationLinkProps["onKeyUp"],
  ) => {
    callback?.(event);

    if (isNativePaginationLink(event.currentTarget) && event.key === " ") {
      event.preventBaseUIHandler();
    }
  };

  return {
    onKeyDown: (event: PaginationKeyboardEvent) => handleKey(event, onKeyDown),
    onKeyUp: (event: PaginationKeyboardEvent) => handleKey(event, onKeyUp),
  };
}

function paginationLinkAria({
  ariaLabel,
  page,
  active,
  context,
  controlsId,
  describedBy,
  descriptionId,
}: {
  ariaLabel: string | undefined;
  page: number | undefined;
  active: boolean | undefined;
  context: PaginationContextValue | null;
  controlsId: string | undefined;
  describedBy: string | undefined;
  descriptionId: string | undefined;
}) {
  return {
    label:
      ariaLabel ??
      (page === undefined
        ? undefined
        : `${active ? "Current page," : "Go to page"} ${context?.formatNumber(page) ?? page}`),
    controls: controlsId ?? context?.controlsId,
    describedBy:
      [describedBy, descriptionId].filter(Boolean).join(" ") || undefined,
  };
}

function paginationLinkTarget({
  linkHref,
  nativeButton,
  render,
  renderedElement,
  children,
  role,
}: {
  linkHref: string | undefined;
  nativeButton: boolean | undefined;
  render: PaginationLinkProps["render"];
  renderedElement: PaginationLinkProps["render"];
  children: React.ReactNode;
  role: React.AriaRole | undefined;
}) {
  return {
    type: linkHref === undefined ? ("button" as const) : undefined,
    nativeButton: nativeButton ?? (linkHref === undefined && !render),
    render:
      renderedElement ??
      (linkHref === undefined ? undefined : <a href={linkHref}>{children}</a>),
    role: linkHref === undefined ? role : "link",
  };
}

function usePaginationJumpModel({
  className,
  label = "Go to page",
  showLabel = true,
  onJump,
  getPageHref,
  disabled,
  id,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  ...props
}: PaginationJumpProps) {
  const context = usePaginationContext();
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const goRef = React.useRef<HTMLElement>(null);
  const nextPage = getValidJumpPage(value, context?.pageCount ?? 0);

  const unavailable =
    paginationUnavailable(disabled, context) || !context?.pageCount;

  return {
    className,
    showLabel,
    inputId,
    label,
    props,
    value,
    setValue,
    setError,
    onKeyDown,
    goRef,
    unavailable,
    context,
    ariaLabel,
    error,
    describedBy,
    nextPage,
    getPageHref,
    onJump,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function PaginationJumpView({
  className,
  showLabel,
  inputId,
  label,
  props,
  value,
  setValue,
  setError,
  onKeyDown,
  goRef,
  unavailable,
  context,
  ariaLabel,
  error,
  describedBy,
  nextPage,
  getPageHref,
  onJump,
}: ReturnType<typeof usePaginationJumpModel>) {
  return (
    <div
      data-slot="pagination-jump"
      className={cn("flex min-w-0 flex-col gap-2", className)}
    >
      <div
        data-slot="pagination-jump-controls"
        className="flex min-w-0 flex-wrap items-center gap-2"
      >
        {showLabel && (
          <label
            data-slot="pagination-jump-label"
            htmlFor={inputId}
            className="text-sm text-muted-foreground"
          >
            {label}
          </label>
        )}
        <InputPrimitive
          {...props}
          id={inputId}
          data-slot="pagination-jump-input"
          type="text"
          inputMode="numeric"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            setError("");
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);

            if (!event.defaultPrevented && event.key === "Enter") {
              event.preventDefault();
              goRef.current?.click();
            }
          }}
          disabled={unavailable}
          placeholder={String(context?.page ?? 1)}
          aria-label={ariaLabel ?? label}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            [
              describedBy,
              context?.descriptionId,
              error ? `${inputId}-error` : undefined,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className="min-h-9 w-16 rounded-md border border-input bg-background px-2 text-center text-base tabular-nums outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 aria-invalid:border-destructive sm:text-sm pointer-coarse:min-h-11"
        />
        <PaginationLink
          ref={goRef}
          data-slot="pagination-jump-submit"
          aria-label="Go"
          page={nextPage ?? undefined}
          href={
            !unavailable && nextPage !== null
              ? getPageHref?.(nextPage)
              : undefined
          }
          disabled={unavailable}
          variant="outline"
          onClick={(event) =>
            paginationCallback2(
              event,
              nextPage,
              context,
              setError,
              onJump,
              setValue,
            )
          }
        >
          Go
        </PaginationLink>
      </div>
      {error && (
        <p
          data-slot="pagination-jump-error"
          id={`${inputId}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function useKiraCursorPaginationModel({
  mode,
  hasPreviousPage: hasPreviousPageInput,
  hasNextPage,
  onPreviousPage,
  onNextPage,
  previousHref,
  nextHref,
  page,
  itemCount,
  size: sizeInput,
  variant: variantInput,
  color: colorInput,
  loading: loadingInput,
  loadingText: loadingTextInput,
  error,
  onRetry,
  disabled: disabledInput,
  disabledReason,
  controlsId,
  locale: localeInput,
  className,
  id,
  children,
  "aria-label": ariaLabelInput,
  ...props
}: KiraCursorPaginationProps) {
  const { hasPreviousPage, size, variant, color, loading, loadingText } =
    useKiraCursorPaginationOptions({
      hasPreviousPage: hasPreviousPageInput,
      size: sizeInput,
      variant: variantInput,
      color: colorInput,
      loading: loadingInput,
      loadingText: loadingTextInput,
    });

  const { disabled, locale, ariaLabel } = useKiraCursorPaginationOptions2({
    disabled: disabledInput,
    locale: localeInput,
    ariaLabel: ariaLabelInput,
  });

  const { rootId, format } = useCursorPaginationFormat(id, locale);

  const reasonId = disabled && disabledReason ? `${rootId}-reason` : undefined;

  const views = cursorPaginationViews({
    hasPreviousPage,
    hasNextPage,
    previousHref,
    nextHref,
    page,
    size,
    variant,
    color,
    controlsId,
    reasonId,
    unavailable: disabled || loading,
    onPreviousPage,
    onNextPage,
    format,
    loading,
    loadingText,
    error,
    onRetry,
    disabled,
    disabledReason,
    itemCount,
  });

  return {
    props,
    rootId,
    mode,
    loading,
    ariaLabel,
    size,
    className,
    itemCount,
    format,
    ...views,
    children,
  };
}

function useCursorPaginationFormat(id: string | undefined, locale: string) {
  const generatedId = React.useId();
  const formatter = new Intl.NumberFormat(locale);

  const format = (value: number) =>
    formatter.format(
      Math.max(0, Math.floor(Number.isFinite(value) ? value : 0)),
    );

  return { rootId: id ?? generatedId, format };
}

type CursorPaginationViewOptions = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousHref: string | undefined;
  nextHref: string | undefined;
  page: number | undefined;
  size: PaginationContextValue["size"];
  variant: PaginationContextValue["variant"];
  color: PaginationContextValue["color"];
  controlsId: string | undefined;
  reasonId: string | undefined;
  unavailable: boolean;
  onPreviousPage: (() => void) | undefined;
  onNextPage: (() => void) | undefined;
  format: (value: number) => string;
};

function cursorPaginationViews(
  options: CursorPaginationViewOptions &
    Omit<
      CursorPaginationFeedbackOptions,
      "size" | "reasonId" | "page" | "format"
    >,
) {
  return {
    buildNavigation: () => cursorPaginationNavigation(options),
    buildFeedback: () => cursorPaginationFeedback(options),
  };
}

function cursorPaginationNavigation({
  hasPreviousPage,
  hasNextPage,
  previousHref,
  nextHref,
  page,
  size,
  variant,
  color,
  controlsId,
  reasonId,
  unavailable,
  onPreviousPage,
  onNextPage,
  format,
}: CursorPaginationViewOptions) {
  return (
    <PaginationContent>
      <PaginationItem>
        {/* kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept */}
        <PaginationLink
          data-slot="pagination-previous"
          disabled={unavailable || !hasPreviousPage}
          href={previousHref}
          size={size}
          variant={variant}
          color={color}
          aria-label="Previous results"
          aria-controls={controlsId}
          aria-describedby={reasonId}
          onClick={onPreviousPage}
          className="gap-1.5"
        >
          <IconChevronLeft
            data-slot="pagination-navigation-icon"
            className="size-4 rtl:rotate-180"
            aria-hidden="true"
          />
          <span data-slot="pagination-navigation-label">Previous</span>
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <span
          data-slot="pagination-cursor-position"
          className="px-2 text-sm text-muted-foreground tabular-nums"
        >
          {page === undefined ? "Results" : `Page ${format(Math.max(1, page))}`}
        </span>
      </PaginationItem>
      <PaginationItem>
        {/* kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept */}
        <PaginationLink
          data-slot="pagination-next"
          disabled={unavailable || !hasNextPage}
          href={nextHref}
          size={size}
          variant={variant}
          color={color}
          aria-label="Next results"
          aria-controls={controlsId}
          aria-describedby={reasonId}
          onClick={onNextPage}
          className="gap-1.5"
        >
          <span data-slot="pagination-navigation-label">Next</span>
          <IconChevronRight
            data-slot="pagination-navigation-icon"
            className="size-4 rtl:rotate-180"
            aria-hidden="true"
          />
        </PaginationLink>
      </PaginationItem>
    </PaginationContent>
  );
}

type CursorPaginationFeedbackOptions = Pick<
  CursorPaginationViewOptions,
  "size" | "reasonId" | "page" | "format"
> & {
  loading: boolean;
  loadingText: string;
  error: React.ReactNode;
  onRetry: (() => void) | undefined;
  disabled: boolean;
  disabledReason: React.ReactNode;
  itemCount: number | undefined;
  hasNextPage: boolean;
};

function cursorPaginationStatus({
  loading,
  loadingText,
  error,
  onRetry,
  page,
  itemCount,
  hasNextPage,
  format,
}: CursorPaginationFeedbackOptions) {
  if (loading) return loadingText;

  if (error) {
    return (
      <>
        {error} {onRetry && "Try again is available."}
      </>
    );
  }

  return (
    <>
      {page !== undefined && `Page ${format(Math.max(1, page))}. `}
      {itemCount !== undefined && `Showing ${format(itemCount)} results. `}
      {!hasNextPage && "End of results."}
    </>
  );
}

function cursorPaginationFeedback({
  loading,
  loadingText,
  error,
  onRetry,
  disabled,
  size,
  reasonId,
  disabledReason,
  page,
  itemCount,
  hasNextPage,
  format,
}: CursorPaginationFeedbackOptions) {
  const status = cursorPaginationStatus({
    loading,
    loadingText,
    error,
    onRetry,
    page,
    itemCount,
    hasNextPage,
    format,
    size,
    reasonId,
    disabled,
    disabledReason,
  });

  return (
    <>
      {loading && (
        <p
          data-slot="pagination-loading"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner size="sm" variant="muted" />
          {loadingText}
        </p>
      )}
      {!loading && error && (
        <PaginationErrorView2
          error={error}
          onRetry={onRetry}
          disabled={disabled}
          size={size}
        />
      )}
      {reasonId && (
        <p
          data-slot="pagination-disabled-reason"
          id={reasonId}
          className="text-sm text-muted-foreground"
        >
          {disabledReason}
        </p>
      )}
      <output
        data-slot="pagination-status"

        aria-live="polite"
        aria-atomic="true"
        className="block sr-only"
      >
        {status}
      </output>
    </>
  );
}

function KiraCursorPaginationView({
  props,
  rootId,
  mode,
  loading,
  ariaLabel,
  size,
  className,
  itemCount,
  format,
  buildNavigation,
  buildFeedback,
  children,
}: ReturnType<typeof useKiraCursorPaginationModel>) {
  return (
    <nav
      {...props}
      id={rootId}
      data-slot="pagination"
      data-kira-pagination=""
      data-mode={mode}
      data-loading={loading || undefined}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={cn(
        paginationVariants({ size }),
        "flex-col items-start",
        className,
      )}
    >
      {itemCount !== undefined && (
        <p
          data-slot="pagination-info"
          className="text-sm text-muted-foreground tabular-nums"
        >
          {itemCount === 0
            ? "No results in this batch"
            : `${format(itemCount)} results in this batch`}
        </p>
      )}
      {buildNavigation()}
      {buildFeedback()}
      {children}
    </nav>
  );
}

function usePaginationOptions({
  size: sizeInput,
  variant: variantInput,
  color: colorInput,
  disabled: disabledInput,
  loading: loadingInput,
  loadingText: loadingTextInput,
}: Parameters<typeof resolvePaginationOptions>[0]) {
  return React.useMemo(
    () =>
      resolvePaginationOptions({
        size: sizeInput,
        variant: variantInput,
        color: colorInput,
        disabled: disabledInput,
        loading: loadingInput,
        loadingText: loadingTextInput,
      }),
    [
      sizeInput,
      variantInput,
      colorInput,
      disabledInput,
      loadingInput,
      loadingTextInput,
    ],
  );
}

function usePaginationOptions2({
  locale: localeInput,
  ariaLabel: ariaLabelInput,
}: Parameters<typeof resolvePaginationOptions2>[0]) {
  return React.useMemo(
    () =>
      resolvePaginationOptions2({
        locale: localeInput,
        ariaLabel: ariaLabelInput,
      }),
    [localeInput, ariaLabelInput],
  );
}

function usePaginationPresentation(input: PaginationProps) {
  const options = usePaginationOptions({
    size: input.size,
    variant: input.variant,
    color: input.color,
    disabled: input.disabled,
    loading: input.loading,
    loadingText: input.loadingText,
  });

  const accessibility = usePaginationOptions2({
    locale: input.locale,
    ariaLabel: input["aria-label"],
  });

  return { ...options, ...accessibility };
}

function useKiraCursorPaginationOptions({
  hasPreviousPage: hasPreviousPageInput,
  size: sizeInput,
  variant: variantInput,
  color: colorInput,
  loading: loadingInput,
  loadingText: loadingTextInput,
}: Parameters<typeof resolveKiraCursorPaginationOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraCursorPaginationOptions({
        hasPreviousPage: hasPreviousPageInput,
        size: sizeInput,
        variant: variantInput,
        color: colorInput,
        loading: loadingInput,
        loadingText: loadingTextInput,
      }),
    [
      hasPreviousPageInput,
      sizeInput,
      variantInput,
      colorInput,
      loadingInput,
      loadingTextInput,
    ],
  );
}

function useKiraCursorPaginationOptions2({
  disabled: disabledInput,
  locale: localeInput,
  ariaLabel: ariaLabelInput,
}: Parameters<typeof resolveKiraCursorPaginationOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveKiraCursorPaginationOptions2({
        disabled: disabledInput,
        locale: localeInput,
        ariaLabel: ariaLabelInput,
      }),
    [disabledInput, localeInput, ariaLabelInput],
  );
}

function paginationResolveAction2(
  direction: "first" | "last" | "next" | "previous",
  context: PaginationContextValue | null,
) {
  if (direction === "first") {
    return context?.firstPage;
  }

  if (direction === "previous") {
    return context?.prevPage;
  }

  if (direction === "next") {
    return context?.nextPage;
  }

  return context?.lastPage;
}

function paginationCallback(
  event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>,
  disabled: boolean,
  onClick:
    | ((
        event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>,
      ) => void)
    | undefined,
  page: number | undefined,
  context: PaginationContextValue | null,
) {
  if (disabled) {
    event.preventDefault();

    return;
  }

  onClick?.(event);
  const nativeLink = isNativePaginationLink(event.currentTarget);

  if (!event.defaultPrevented && !nativeLink && page !== undefined)
    context?.setPage(page);
}

function paginationCallback2(
  event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>,
  nextPage: number | null,
  context: PaginationContextValue | null,
  setError: React.Dispatch<React.SetStateAction<string>>,
  onJump: ((page: number) => void) | undefined,
  setValue: React.Dispatch<React.SetStateAction<string>>,
) {
  if (nextPage === null || !context) {
    event.preventDefault();
    setError(
      `Enter a page from 1 to ${context?.formatNumber(context.pageCount) ?? 0}.`,
    );

    return;
  }

  // Leave native URL activation and modified clicks untouched.
  if (isNativePaginationLink(event.currentTarget)) return;
  setError("");
  onJump?.(nextPage);
  setValue("");
}
