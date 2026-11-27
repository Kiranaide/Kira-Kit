"use client";

import type { ComponentProps as ReactComponentProps } from "react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import {
  KiraPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationPages,
  PaginationInfo,
  PaginationStatus,
  usePagination,
  useUrlPagination,
  type PaginationProps,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const activity = [
  { name: "Design studio", owner: "Mira Chen", status: "In review" },
  { name: "Customer research", owner: "Sam Patel", status: "Approved" },
  { name: "Mobile experience", owner: "Nok Suriya", status: "In review" },
  { name: "Accessibility review", owner: "Alex Morgan", status: "Approved" },
  { name: "Release operations", owner: "Rin Takahashi", status: "Approved" },
  { name: "Localization", owner: "Lina Hassan", status: "In review" },
  { name: "Platform services", owner: "Kai Santos", status: "Approved" },
  { name: "Identity and access", owner: "Robin Lee", status: "In review" },
  { name: "Design systems", owner: "Tara Singh", status: "Approved" },
  { name: "Documentation", owner: "Noah Kim", status: "Approved" },
  { name: "Partner integrations", owner: "Emi Tanaka", status: "In review" },
  { name: "Product analytics", owner: "Luis Garcia", status: "Approved" },
  { name: "Community programs", owner: "Aya Mori", status: "Approved" },
  { name: "API experience", owner: "Jules Martin", status: "In review" },
  { name: "Billing operations", owner: "Taylor Smith", status: "Approved" },
  { name: "Growth experiments", owner: "Sasha Ivanova", status: "In review" },
  { name: "Content publishing", owner: "Bea Costa", status: "Approved" },
  { name: "Enterprise onboarding", owner: "Dara Sok", status: "In review" },
];

function ResultsList({
  rows,
  busy = false,
  id,
}: {
  rows: readonly (typeof activity)[number][];
  busy?: boolean;
  id?: string;
}) {
  return (
    <div id={id} aria-busy={busy || undefined} className="min-w-0 min-h-56">
      <ul aria-label="Workspace reviews" className="divide-y divide-border">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex min-w-0 items-start justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium wrap-anywhere">{row.name}</p>
              <p className="mt-1 text-xs text-muted-foreground wrap-anywhere">
                {row.owner}
              </p>
            </div>
            <span className="shrink-0 rounded-md border border-border px-2 py-1 text-xs">
              {row.status}
            </span>
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="py-6 text-sm text-muted-foreground">
          No matching reviews. Clear the filter to see all workspaces.
        </p>
      )}
    </div>
  );
}

function BasicDemo() {
  return (
    <div className="space-y-6">
      <KiraPagination
        total={180}
        defaultPage={3}
        defaultPageSize={10}
        aria-label="Workspace pagination"
      />
      <div className="space-y-2">
        <p className="text-sm font-medium">Compose the parts</p>
        <Pagination total={90} defaultPage={2} aria-label="Composed pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
          <PaginationInfo />
          <PaginationStatus />
        </Pagination>
      </div>
    </div>
  );
}

const basicCode = `import {
  KiraPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationPages,
  PaginationNext,
  PaginationInfo,
  PaginationStatus,
} from "@/components/ui/pagination"

<KiraPagination total={180} defaultPage={3} defaultPageSize={10} />

<Pagination total={90} defaultPage={2}>
  <PaginationContent>
    <PaginationItem><PaginationPrevious /></PaginationItem>
    <PaginationPages />
    <PaginationItem><PaginationNext /></PaginationItem>
  </PaginationContent>
  <PaginationInfo />
  <PaginationStatus />
</Pagination>`;

function ResultsDemo() {
  const [openOnly, setOpenOnly] = useState(false);

  const rows = openOnly
    ? activity.filter((row) => row.status === "In review")
    : activity;

  const pagination = usePagination({ total: rows.length, defaultPageSize: 5 });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Workspace reviews</p>
        <Button
          size="sm"
          variant={openOnly ? "default" : "outline"}
          aria-pressed={openOnly}
          onClick={() => setOpenOnly((value) => !value)}
        >
          In review only
        </Button>
      </div>
      <ResultsList
        rows={pagination.getPageData(rows)}
        id="pagination-review-results"
      />
      <KiraPagination
        total={rows.length}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={pagination.setPagination}
        showSizeSelector
        pageSizeOptions={[5, 10, 20]}
        controlsId="pagination-review-results"
      />
      <p className="text-xs text-muted-foreground">
        Filtering updates the total. The current page stays in bounds; changing
        page size resets it to page 1.
      </p>
    </div>
  );
}

const resultsCode = `import { usePagination, KiraPagination } from "@/components/ui/pagination"

const pagination = usePagination({ total: results.length, defaultPageSize: 5 })
const visibleRows = pagination.getPageData(results)

<KiraPagination
  total={results.length}
  page={pagination.page}
  pageSize={pagination.pageSize}
  onPaginationChange={pagination.setPagination}
  showSizeSelector
  pageSizeOptions={[5, 10, 20]}
  controlsId="review-results"
/>
// Render visibleRows in the element with id="review-results".`;

function VariantsDemo() {
  const variants: NonNullable<PaginationProps["variant"]>[] = [
    "default",
    "outline",
    "pills",
    "ghost",
    "rounded",
  ];

  const colors: NonNullable<PaginationProps["color"]>[] = [
    "primary",
    "success",
    "warning",
    "destructive",
  ];

  return (
    <div className="space-y-6">
      {variants.map((variant) => (
        <div key={variant} className="space-y-2">
          <p className="text-sm font-medium capitalize">{variant}</p>
          <KiraPagination
            total={80}
            defaultPage={3}
            variant={variant}
            showInfo={false}
            aria-label={`${variant} pagination`}
          />
        </div>
      ))}
      <div className="space-y-3">
        <p className="text-sm font-medium">Semantic color</p>
        {colors.map((color) => (
          <KiraPagination
            key={color}
            total={40}
            defaultPage={2}
            color={color}
            variant="outline"
            showInfo={false}
            aria-label={`${color} pagination`}
          />
        ))}
      </div>
    </div>
  );
}

const variantsCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination total={80} variant="outline" defaultPage={3} />
<KiraPagination total={80} variant="pills" defaultPage={3} />
<KiraPagination total={80} variant="ghost" defaultPage={3} />
<KiraPagination total={80} variant="rounded" defaultPage={3} />
<KiraPagination total={40} variant="outline" color="success" defaultPage={2} />`;

function SizesDemo() {
  return (
    <div className="space-y-6">
      {(["sm", "default", "lg"] as const).map((size) => {
        const resolveValue1 = () => {
          if (size === "sm") {
            return "Compact" as const;
          }

          if (size === "lg") {
            return "Large" as const;
          }

          return "Standard" as const;
        };

        return (
          <div className="space-y-2" key={size}>
            <p className="text-sm font-medium">{resolveValue1()}</p>
            <KiraPagination
              total={70}
              size={size}
              defaultPage={3}
              showInfo={false}
              aria-label={`${size} pagination`}
            />
          </div>
        );
      })}
    </div>
  );
}

const sizesCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination total={70} size="sm" />
<KiraPagination total={70} size="default" />
<KiraPagination total={70} size="lg" />
// Pointer-coarse controls receive at least 44px hit areas.`;

function EllipsisDemo() {
  const [page, setPage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [loadAfterJump, setLoadAfterJump] = useState(false);
  const [disableCurrentAfterJump, setDisableCurrentAfterJump] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="max-w-lg space-y-4">
      <EllipsisControlsSection
        page={page}
        setPage={setPage}
        setHasNavigated={setHasNavigated}
        loadAfterJump={loadAfterJump}
        setLoading={setLoading}
        loading={loading}
        disabled={disabled}
        disableCurrentAfterJump={disableCurrentAfterJump}
        hasNavigated={hasNavigated}
      />
      <p className="text-sm text-muted-foreground">
        Open either dots button, enter a page from 1 to 200, then press Enter or
        Go. Try page 1: the earlier dots disappear, and focus moves to the
        current page. Escape or clicking outside closes the popup without
        navigating. Enable Loading after jump to test busy controls; focus stays
        on the navigation region until the Loading state is cleared. Disabled
        current after jump tests the same fallback while sibling page controls
        remain enabled.
      </p>
      <EllipsisControlsSection2
        loading={loading}
        setLoading={setLoading}
        disabled={disabled}
        setDisabled={setDisabled}
        loadAfterJump={loadAfterJump}
        setLoadAfterJump={setLoadAfterJump}
        disableCurrentAfterJump={disableCurrentAfterJump}
        setDisableCurrentAfterJump={setDisableCurrentAfterJump}
        setPage={setPage}
        setHasNavigated={setHasNavigated}
      />
    </div>
  );
}

const ellipsisCode = `import { useState } from "react"
import { Pagination, PaginationContent, PaginationPages, PaginationInfo, PaginationStatus } from "@/components/ui/pagination"

const [page, setPage] = useState(50)
<Pagination total={2000} pageSize={10} page={page} onPageChange={setPage} maxPages={3}>
  <PaginationContent><PaginationPages mobileMaxPages={3} /></PaginationContent>
  <PaginationInfo />
  <PaginationStatus />
</Pagination>
// Ellipses open a shared Base UI Popover with PaginationJump.
// Valid local jumps focus the current page, or the nav if it is unavailable.
// The compact popup contains only a page input and Go action.
// Escape or clicking outside dismisses without changing the page.
// For native page URLs, pass getPageHref to Pages or KiraPagination.`;

function JumpDemo() {
  return (
    <div className="space-y-4">
      <KiraPagination
        total={1240}
        defaultPage={4}
        defaultPageSize={20}
        showJump
        showSizeSelector
        pageSizeOptions={[10, 20, 50]}
      />
      <p className="text-sm text-muted-foreground">
        Enter a page and press Enter or Go. An out-of-range value explains the
        valid range instead of silently navigating.
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="border-t border-border pt-4"
      >
        <p className="mb-3 text-sm font-medium">Safe inside another form</p>
        <KiraPagination
          total={60}
          showJump
          showInfo={false}
          aria-label="Pagination inside a form"
        />
      </form>
    </div>
  );
}

const jumpCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination
  total={1240}
  defaultPage={4}
  defaultPageSize={20}
  showJump
  showSizeSelector
  pageSizeOptions={[10, 20, 50]}
/>
// PaginationJump does not create a nested form.
// Empty results disable the jump control.`;

function UrlDemo() {
  const pagination = useUrlPagination({
    total: 180,
    defaultPage: 5,
    defaultPageSize: 10,
    pageParam: "resultsPage",
    pageSizeParam: "resultsSize",
    shallow: false,
  });

  return (
    <div className="space-y-4">
      <KiraPagination
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={pagination.setPagination}
        showSizeSelector
        pageSizeOptions={[10, 20, 50]}
        aria-label="URL pagination"
      />
      <div className="space-y-1 text-sm">
        <p className="font-medium">Shareable query</p>
        <code className="block rounded-md bg-muted p-3 text-xs wrap-anywhere">
          {pagination.searchParamsString ||
            "Default page and size — no pagination parameters"}
        </code>
      </div>
      <p className="text-sm text-muted-foreground">
        Without a page parameter, this view starts on saved page 5. Change page
        and size, then use browser Back or Forward. Other query parameters,
        repeated filters, and the hash are retained.
      </p>
      <a
        className="inline-block min-h-6 text-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring"
        href={pagination.buildUrl()}
      >
        Open this result view
      </a>
    </div>
  );
}

const urlCode = `import { useUrlPagination, KiraPagination } from "@/components/ui/pagination"

const pagination = useUrlPagination({
  total: 180,
  defaultPage: 5, // A saved preference; page 1 still gets an explicit URL.
  defaultPageSize: 10,
  pageParam: "resultsPage",
  pageSizeParam: "resultsSize",
  shallow: false, // Push entries for browser Back/Forward.
})
<KiraPagination
  total={pagination.total}
  page={pagination.page}
  pageSize={pagination.pageSize}
  onPaginationChange={pagination.setPagination}
  showSizeSelector
/>
const shareableUrl = pagination.buildUrl()`;

function LinksDemo() {
  const pagination = useUrlPagination({
    total: 100,
    defaultPageSize: 10,
    pageParam: "linkedPage",
    pageSizeParam: "linkedSize",
  });

  const href = (page: number) => {
    const target = new URL(pagination.buildUrl(), window.location.href);

    if (page === 1) target.searchParams.delete("linkedPage");
    else target.searchParams.set("linkedPage", String(page));

    return `${target.pathname}${target.search}${target.hash}`;
  };

  const navigate = (event: MouseEvent<HTMLButtonElement>, page: number) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    pagination.setPage(page);
  };

  return (
    <div className="space-y-4">
      <Pagination
        total={100}
        page={pagination.page}
        pageSize={10}
        aria-label="Linked pagination"
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={pagination.hasPrev ? href(pagination.page - 1) : undefined}
              onClick={(event) => navigate(event, pagination.page - 1)}
            />
          </PaginationItem>
          <PaginationPages
            getPageHref={href}
            renderPage={(item) =>
              item.type === "ellipsis" ? (
                <PaginationEllipsis getPageHref={href} />
              ) : (
                <PaginationLink
                  page={item.page}
                  href={href(item.page)}
                  onClick={(event) => navigate(event, item.page)}
                />
              )
            }
          />
          <PaginationItem>
            <PaginationNext
              href={pagination.hasNext ? href(pagination.page + 1) : undefined}
              onClick={(event) => navigate(event, pagination.page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
        <PaginationInfo />
        <PaginationStatus />
      </Pagination>
      <p className="text-sm text-muted-foreground">
        These controls are real links. Ordinary clicks update this view;
        modified clicks and copying the link retain native browser behavior.
      </p>
    </div>
  );
}

const linksCode = `import { PaginationLink } from "@/components/ui/pagination"

<PaginationLink
  page={3}
  href="/components/pagination?linkedPage=3"
  onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    pagination.setPage(3)
  }}
/>
// Alternatively provide getPageHref to KiraPagination for native navigation.
// Router Link components can use the render prop.`;

function CursorDemo() {
  const [batch, setBatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failNext, setFailNext] = useState(false);
  const [retryBatch, setRetryBatch] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const request = (next: number) => {
    setRetryBatch(next);
    setLoading(true);
    setError("");
    const fail = failNext;
    setFailNext(false);
    timer.current = setTimeout(() => {
      if (fail) setError("Could not load this activity batch. Try again.");
      else setBatch(next);
      setLoading(false);
    }, 500);
  };

  const rows = activity.slice(batch * 6, batch * 6 + 6);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Recent workspace activity</p>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={failNext}
          onClick={() => setFailNext((value) => !value)}
          disabled={loading}
        >
          {failNext ? "Next request will fail" : "Fail next request"}
        </Button>
      </div>
      <ResultsList rows={rows} busy={loading} id="pagination-cursor-results" />
      <KiraPagination
        mode="cursor"
        page={batch + 1}
        itemCount={rows.length}
        hasPreviousPage={batch > 0}
        hasNextPage={batch < 2}
        onPreviousPage={() => request(batch - 1)}
        onNextPage={() => request(batch + 1)}
        loading={loading}
        error={error || undefined}
        onRetry={() => request(retryBatch)}
        controlsId="pagination-cursor-results"
      />
      <p className="text-xs text-muted-foreground">
        A simulated cursor API exposes previous/next batches. The controls do
        not invent a result total or last-page jump.
      </p>
    </div>
  );
}

const cursorCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination
  mode="cursor"
  itemCount={connection.nodes.length}
  hasPreviousPage={connection.pageInfo.hasPreviousPage}
  hasNextPage={connection.pageInfo.hasNextPage}
  onPreviousPage={() => loadBefore(connection.pageInfo.startCursor)}
  onNextPage={() => loadAfter(connection.pageInfo.endCursor)}
  loading={pending}
  error={requestError}
  onRetry={retryLastRequest}
/>
// Omit page when the server does not supply a batch ordinal.`;

function RecoveryDemo() {
  const [page, setPage] = useState(2);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [targetPage, setTargetPage] = useState(2);
  const [failNext, setFailNext] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const load = (next: number) => {
    setTargetPage(next);
    setPending(true);
    setError("");
    const fail = failNext;
    setFailNext(false);
    timer.current = setTimeout(() => {
      if (fail)
        setError(
          "The result request failed. Your current page is still available.",
        );
      else setPage(next);
      setPending(false);
    }, 500);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        The first request fails. Navigate once, then choose Try again. The
        selected page changes only when the request succeeds.
      </p>
      <KiraPagination
        total={90}
        page={page}
        onPageChange={load}
        loading={pending}
        loadingText="Loading the requested page…"
        error={error || undefined}
        onRetry={() => load(targetPage)}
      />
      <KiraPagination
        total={40}
        disabled
        disabledReason="Reviews are being exported. Navigation is available after the export finishes."
        aria-label="Disabled export pagination"
      />
    </div>
  );
}

const recoveryCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination
  total={90}
  page={committedPage}
  onPageChange={loadPage}
  loading={pending}
  error={requestError}
  onRetry={retryLastRequest}
/>
// Commit the new page after loading succeeds; retain the previous result on failure.
<KiraPagination total={40} disabled disabledReason="Reviews are being exported." />`;

function StressDemo() {
  const [worst, setWorst] = useState(false);

  return (
    <div className="space-y-6">
      <fieldset aria-label="Demo data" className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={worst ? "outline" : "default"}
          aria-pressed={!worst}
          onClick={() => setWorst(false)}
        >
          Demo data
        </Button>
        <Button
          size="sm"
          variant={worst ? "default" : "outline"}
          aria-pressed={worst}
          onClick={() => setWorst(true)}
        >
          Worst case
        </Button>
      </fieldset>
      <div className="space-y-6" key={String(worst)}>
        <KiraPagination
          total={worst ? 9_876_543_210 : 260}
          defaultPage={worst ? 999_999 : 4}
          defaultPageSize={10}
          showJump
          showSizeSelector
          pageSizeLabel={
            worst
              ? "Maximum workspace review entries displayed per page"
              : "Rows per page"
          }
          aria-label="Stress pagination"
        />
        <div className="max-w-xs space-y-3 rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Narrow result container</p>
          <KiraPagination
            total={80}
            defaultPage={4}
            showLabels
            infoMobileCompact
            aria-label="Narrow pagination"
          />
        </div>
        <KiraPagination
          total={0}
          showJump
          showSizeSelector
          aria-label="Empty results pagination"
        />
        <KiraPagination
          mode="cursor"
          hasPreviousPage={false}
          hasNextPage={false}
          itemCount={0}
          disabled
          disabledReason={
            worst
              ? "The international workspace review export is being prepared. Ask an administrator with the appropriate access permissions to resume navigation."
              : "No activity is available for this workspace."
          }
          aria-label="Empty cursor pagination"
        />
        <div dir="rtl">
          <KiraPagination
            total={100}
            defaultPage={4}
            aria-label="Right-to-left pagination"
          />
        </div>
      </div>
    </div>
  );
}

const stressCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination
  total={9_876_543_210}
  defaultPage={999_999}
  showJump
  showSizeSelector
  pageSizeLabel="Maximum workspace review entries displayed per page"
/>
<div className="max-w-xs">
  <KiraPagination total={80} defaultPage={4} showLabels infoMobileCompact />
</div>
<KiraPagination total={0} showJump showSizeSelector />
<KiraPagination
  mode="cursor"
  hasPreviousPage={false}
  hasNextPage={false}
  itemCount={0}
  disabled
  disabledReason="No activity is available for this workspace."
/>
<div dir="rtl"><KiraPagination total={100} defaultPage={4} /></div>`;

function KeyboardDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tab to a page button and use Enter or Space. The selector uses Base UI
        Select keys; the jump input accepts Enter without submitting an ancestor
        form. Enter or Space on the dots opens Go to page; Escape cancels it.
      </p>
      <KiraPagination
        total={170}
        defaultPage={3}
        maxPages={3}
        mobileMaxPages={3}
        showEdges
        showJump
        showSizeSelector
        pageSizeOptions={[10, 20, 50]}
        aria-label="Keyboard pagination"
      />
    </div>
  );
}

const keyboardCode = `import { KiraPagination } from "@/components/ui/pagination"

<KiraPagination
  total={170}
  defaultPage={3}
  maxPages={3}
  mobileMaxPages={3}
  showEdges
  showJump
  showSizeSelector
  pageSizeOptions={[10, 20, 50]}
/>`;

const usageCode = `import { usePagination, KiraPagination } from "@/components/ui/pagination"

export function Results({ rows }: { rows: { id: string; title: string }[] }) {
  const pagination = usePagination({ total: rows.length, defaultPageSize: 10 })
  return (
    <>
      <ul id="results">
        {pagination.getPageData(rows).map((row) => <li key={row.id}>{row.title}</li>)}
      </ul>
      <KiraPagination
        total={rows.length}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPaginationChange={pagination.setPagination}
        showSizeSelector
        controlsId="results"
      />
    </>
  )
}`;

export default function PaginationPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Pagination"
        description="Keep results in sync, preserve useful URLs, and move through pages or cursor batches with clear recovery states."
        version="v3.2.1"
      />
      <FeatureGrid features={paginationPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={paginationPageDemoTabsTabs} />
      <KeyboardShortcuts
        shortcuts={paginationPageKeyboardShortcutsShortcuts}
        description="Use the Keyboard, Links, and URL state demos. Pagination adds no global arrow-key shortcuts."
      />
      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Pair usePagination or useUrlPagination with KiraPagination, or compose the primitive parts directly."
        notes={[
          {
            label: "KiraPagination",
            body: "Use KiraPagination for standard numbered or cursor-based result sets with optional info, page-size selector, jump input, and recovery states.",
          },
        ]}
      />
      <APIReference sections={paginationPageAPIReferenceSections} />
      <Changelog entries={paginationPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const paginationPageFeatureGridFeatures = [
  {
    title: "Jump from the dots",
    description:
      "Ellipsis buttons open a labeled page input, with strict bounds and deliberate focus return.",
  },
  {
    title: "Changing results",
    description:
      "Filtering and page-size changes keep item ranges and page controls in sync.",
  },
  {
    title: "URLs and links",
    description:
      "Share result views and retain normal link and browser history behavior.",
  },
  {
    title: "Cursor recovery",
    description:
      "Navigate API batches without guessing a total, with pending and retry feedback.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const paginationPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Navigate a result set"
        description="Use KiraPagination or compose nav, page controls, and one status region."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Current-page emphasis"
        description="Five styles and semantic colors retain a visible selected state."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Fit the control to the task"
        description="Compact, standard, and large controls preserve usable focus and hit areas."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "results",
    label: "Result sets",
    group: "KiraPagination",
    demo: (
      <DemoWrapper
        title="Review workspace activity"
        description="Filter the rows and change page size. The total and visible slice update together."
        code={resultsCode}
      >
        <ResultsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ellipsis",
    label: "Ellipsis jump",
    group: "KiraPagination",
    demo: (
      <DemoWrapper
        title="Reach pages hidden by the dots"
        description="A keyboard- and touch-operable disclosure reuses the page-jump control. The shared popup survives page-range changes."
        code={ellipsisCode}
      >
        <EllipsisDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "jump",
    label: "Jump and size",
    group: "KiraPagination",
    demo: (
      <DemoWrapper
        title="Find a particular page"
        description="Use a strict page input and a labeled size selector; nested forms are avoided."
        code={jumpCode}
      >
        <JumpDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "url",
    label: "URL state",
    group: "KiraPagination",
    demo: (
      <DemoWrapper
        title="Keep a shareable view"
        description="Update page and size atomically, then navigate with browser Back and Forward."
        code={urlCode}
      >
        <UrlDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "links",
    label: "Links",
    group: "KiraPagination",
    demo: (
      <DemoWrapper
        title="Retain native link behavior"
        description="Real anchors support copy, modified clicks, and a router-style click handler."
        code={linksCode}
      >
        <LinksDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "cursor",
    label: "Cursor API",
    group: "KiraPagination",
    demo: (
      <DemoWrapper
        title="Browse recent activity"
        description="Previous and next batches come from the API's pageInfo flags, without a made-up total."
        code={cursorCode}
      >
        <CursorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "recovery",
    label: "Loading and retry",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Recover from a failed request"
        description="A shared Spinner signals loading while the selected page stays committed. Reduced motion keeps the indicator still; failures expose Try again."
        code={recoveryCode}
      >
        <RecoveryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "keyboard",
    label: "Keyboard",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Operate every control"
        description="Try page buttons, first/last actions, the selector, and the jump input."
        code={keyboardCode}
      >
        <KeyboardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, empty results, disabled states, large totals, RTL, and a narrow max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const paginationPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move through visible page buttons, selector, and jump input in document order (Base UI/native controls).",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate a page button. Enter follows an anchor; Space is not redefined for links.",
  },
  {
    keys: "Enter / Arrow Down",
    description:
      "Open the focused page-size selector (inherited from Base UI Select).",
  },
  {
    keys: "Arrow Up / Down, Home / End",
    description:
      "Navigate options inside the open selector (inherited from Base UI Select).",
  },
  {
    keys: "Escape",
    description:
      "Close the selector or ellipsis popup and restore focus (inherited from Base UI Select/Popover).",
  },
  {
    keys: "Enter / Space on dots",
    description:
      "Open Go to page. An accepted local jump closes the popup and focuses the visible current-page control.",
  },
  {
    keys: "Enter in Go to page",
    description:
      "Validate and navigate without submitting an ancestor form. Invalid input gives a linked error.",
  },
  {
    keys: "Ctrl/Cmd + click",
    description:
      "Open a linked page in a new tab using native anchor behavior.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const paginationPageAPIReferenceSections = [
  {
    title: "Pagination / KiraPagination (pages mode)",
    props: [
      {
        prop: "total / defaultTotal",
        type: "number",
        default: "0",
        description:
          "Controlled or initial uncontrolled result count. Controlled totals update immediately when filtering changes them.",
      },
      {
        prop: "page / defaultPage",
        type: "number",
        default: "1",
        description: "Controlled or initial uncontrolled 1-indexed page.",
      },
      {
        prop: "pageSize / defaultPageSize",
        type: "number",
        default: "10",
        description:
          "Controlled or initial uncontrolled size. Use defaultPageSize for an independently editable selector.",
      },
      {
        prop: "onPageChange / onPageSizeChange / onTotalChange",
        type: "(number) => void",
        description:
          "Notifications for requested changes. Controlled values remain owned by the caller.",
      },
      {
        prop: "onPaginationChange",
        type: "({ page, pageSize }) => void",
        description:
          "One atomic page/size notification, including page 1 after a size change.",
      },
      {
        prop: "maxPages / keepInBounds",
        type: "number / boolean",
        default: "5 / true",
        description:
          "Numbered-button budget (3–25) and derived page clamping. Clamping alone does not invoke a user navigation callback.",
      },
      {
        prop: "size / variant / color",
        type: '"sm" | "default" | "lg" / "default" | "outline" | "pills" | "ghost" | "rounded" / "default" | "primary" | "success" | "warning" | "destructive"',
        default: '"default"',
        description:
          "Control size, selected-state appearance, and semantic tone. Default and primary are aliases.",
      },
      {
        prop: "loading / loadingText / error / onRetry",
        type: "boolean / string / ReactNode / () => void",
        description:
          "Pending controls are disabled and show the shared Spinner beside loadingText. The indicator stops rotating with reduced motion. Errors retain the previous view and can expose Try again.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / ReactNode",
        description:
          "Global disability plus a visible explanation included in control descriptions.",
      },
      {
        prop: "controlsId / locale",
        type: "string",
        default: 'locale="en-US"',
        description:
          "Associate navigation with its result element and format numbers with Intl.NumberFormat.",
      },
      {
        prop: "aria-label / id / DOM props",
        type: "nav attributes",
        default: 'aria-label="Pagination"',
        description:
          "Named native navigation landmark. Pagination requires composed children; KiraPagination composes them.",
      },
    ],
  },
  {
    title: "KiraPagination pages convenience props",
    props: [
      {
        prop: "mode",
        type: '"pages"',
        default: '"pages"',
        description: "Known-total numbered navigation.",
      },
      {
        prop: "showInfo / showSizeSelector / showJump",
        type: "boolean",
        default: "true / false / false",
        description:
          "Item range, page-size control, and explicit jump control.",
      },
      {
        prop: "pageSizeOptions",
        type: "readonly number[]",
        default: "[10, 20, 50, 100]",
        description:
          "Available sizes; the current size is retained when it is not in the list.",
      },
      {
        prop: "infoFormat / emptyInfoText / infoMobileCompact",
        type: "string / string / boolean",
        default: '"Showing {start}–{end} of {total}" / "No results" / false',
        description:
          "Customize the item-range text ({start} {end} {total} {page} {pageCount} tokens), the zero-total message, and show a compact 'Page x of y' in narrow containers.",
      },
      {
        prop: "pageSizeLabel / pageSizeSuffix",
        type: "string",
        default: '"Rows per page"',
        description:
          "Label before the size selector and an optional suffix after it; the suffix is tied to the control via aria-describedby.",
      },
      {
        prop: "showEdges / showLabels",
        type: "boolean",
        default: "false",
        description:
          "Optional first/last controls and text labels; compact containers keep the essential controls.",
      },
      {
        prop: "mobileMaxPages (Kira only)",
        type: "number",
        default: "1",
        description:
          "Current-page-only mobile layout by default. Set 3–25 to show a bounded mobile range and its interactive ellipses.",
      },
      {
        prop: "tabIndex",
        type: "number",
        default: "-1",
        description:
          "Pagination root is programmatically focusable after a jump if the current-page control is disabled or absent. It does not add a normal tab stop.",
      },
      {
        prop: "getPageHref",
        type: "(page) => string",
        description:
          "Native URLs for page, direction, ellipsis Go, and standalone Go controls. Native links do not also invoke local setters.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Supplemental content before the single status region.",
      },
    ],
  },
  {
    title: "KiraPagination cursor mode",
    props: [
      {
        prop: "mode",
        type: '"cursor"',
        description:
          "Use with cursor APIs and unknown totals. No numbered buttons, last-page control, or jump is inferred.",
      },
      {
        prop: "hasPreviousPage / hasNextPage",
        type: "boolean",
        default: "hasPreviousPage=false",
        description:
          "Server-authoritative navigation flags; hasNextPage is required.",
      },
      {
        prop: "onPreviousPage / onNextPage",
        type: "() => void",
        description: "Caller requests the previous or next server cursor.",
      },
      {
        prop: "previousHref / nextHref",
        type: "string",
        description:
          "Optional native navigation URLs. Omit callbacks when using server navigation.",
      },
      {
        prop: "page / itemCount",
        type: "number",
        description:
          "Optional known batch ordinal and count in this batch. Neither implies a total.",
      },
      {
        prop: "size / variant / color / locale",
        type: "Pagination style/locale props",
        default: "default / outline / default / en-US",
        description:
          "Same control styling and number formatting as pages mode.",
      },
      {
        prop: "loading / loadingText / error / onRetry",
        type: "Pagination recovery props",
        description:
          "Request state and retry for the last failed cursor. Loading uses the shared Spinner and respects reduced motion.",
      },
      {
        prop: "disabled / disabledReason / controlsId / nav props",
        type: "Pagination state and DOM props",
        description:
          "Named landmark, visible reason, result relationship, and native attributes.",
      },
    ],
  },
  {
    title: "PaginationLink",
    props: [
      {
        prop: "page / isActive",
        type: "number / boolean",
        description:
          "Target page and explicit selected state. The context can infer aria-current=page.",
      },
      {
        prop: "href / target / rel / download",
        type: "anchor attributes",
        description:
          "Render an anchor and retain native navigation and modified clicks.",
      },
      {
        prop: "render / nativeButton",
        type: "Base UI render / boolean",
        description:
          "Router/custom element adapter. The default is a native button without href or render.",
      },
      {
        prop: "size / variant / color / disabled",
        type: "Pagination control props",
        description:
          "Override appearance; context disability and pending state cannot be bypassed.",
      },
      {
        prop: "onClick / ref / DOM props",
        type: "Base UI Button props",
        description:
          "Caller handlers compose and may prevent context navigation. Icon-only controls need aria-label.",
      },
    ],
  },
  {
    title: "PaginationFirst / Previous / Next / Last",
    props: [
      {
        prop: "showLabel / text",
        type: "boolean / string",
        default: "false / direction label",
        description:
          "Optional visible text. Automatic direction names remain accessible in compact containers.",
      },
      {
        prop: "href / onClick / disabled / remaining Link props",
        type: "PaginationLink props",
        description:
          "Inherit Link appearance and events; boundaries remain disabled. Icons mirror in RTL.",
      },
    ],
  },
  {
    title: "PaginationEllipsis",
    props: [
      {
        prop: "aria-label",
        type: "string",
        default: '"Go to page"',
        description:
          "A real button that opens the shared Base UI Popover. Pages names earlier/later disclosures automatically. Requires a Pagination root with a known total.",
      },
      {
        prop: "getPageHref",
        type: "(page) => string",
        description:
          "Optional native URL for Go. Pages passes its URL builder into default ellipses; custom renderers pass it explicitly.",
      },
      {
        prop: "disabled / ref / onClick / className",
        type: "Base UI Trigger props",
        description:
          "Native button attributes and composed trigger events. Root loading, empty pages, and disability take precedence; Escape or clicking outside dismisses without navigating.",
      },
    ],
  },
  {
    title: "PaginationContent / Item / Pages",
    props: [
      {
        prop: "Content / Item DOM props",
        type: "ul / li attributes",
        description:
          "Semantic list composition. Ellipsis is documented separately as an interactive disclosure.",
      },
      {
        prop: "PaginationItem.mobileHide",
        type: "boolean",
        default: "false",
        description:
          "Hide the optional item in containers narrower than the sm container breakpoint.",
      },
      {
        prop: "PaginationPages.renderPage / renderEllipsis",
        type: "(item, index) => ReactNode / (key) => ReactNode",
        description:
          "Custom page/ellipsis contents; Pages creates the surrounding li.",
      },
      {
        prop: "PaginationPages.mobileMaxPages",
        type: "number",
        default: "1",
        description:
          "Compact count: 1–2 retain the current page; 3–25 render a bounded range.",
      },
      {
        prop: "PaginationPages.getPageHref",
        type: "(page) => string",
        description:
          "Use anchors for default page buttons and ellipsis Go controls. Custom renderers own their native URL wiring.",
      },
    ],
  },
  {
    title: "PaginationInfo / PaginationStatus",
    props: [
      {
        prop: "Info.format / emptyText",
        type: "string / string",
        default: '"Showing {start}–{end} of {total}" / "No results"',
        description:
          "Replace all start/end/total/page/pageCount placeholders with formatted values, or render emptyText when total is 0.",
      },
      {
        prop: "Info.mobileCompact",
        type: "boolean",
        default: "false",
        description:
          "Use a short page phrase in narrow containers. Info is ordinary text, not a second live region.",
      },
      {
        prop: "Status.children / loadingText",
        type: "ReactNode / string",
        default: 'loadingText="Loading results…"',
        description:
          "The single polite, atomic announcement for this navigation context.",
      },
      {
        prop: "className / div props",
        type: "native attributes",
        description:
          "Forward DOM attributes; Status is visually hidden by default.",
      },
    ],
  },
  {
    title: "PaginationSizeSelector",
    props: [
      {
        prop: "options / onSizeChange",
        type: "readonly number[] / (size) => void",
        default: "[10, 20, 50, 100]",
        description:
          "KiraSelect options and shared styling, plus additional caller notification; context resets the page to 1.",
      },
      {
        prop: "label / suffix / showLabel",
        type: "string / string / boolean",
        default: '"Rows per page" / - / true',
        description:
          "Persistent label and accessible name even when the visible label is hidden, plus an optional trailing suffix tied via aria-describedby.",
      },
      {
        prop: "disabled / id / name / aria-label / aria-describedby / className",
        type: "supported selector attributes",
        description:
          "Control identity, form name, accessible descriptions, and wrapper styling. Global disability wins.",
      },
    ],
  },
  {
    title: "PaginationJump",
    props: [
      {
        prop: "label / showLabel / onJump",
        type: "string / boolean / (page) => void",
        default: '"Go to page" / true',
        description:
          "Strict positive integer input with Enter or Go. Invalid/out-of-range values do not navigate.",
      },
      {
        prop: "getPageHref",
        type: "(page) => string",
        description:
          "Go becomes a native link for a valid page URL; Enter activates that link and modified clicks retain browser behavior. onJump applies to accepted local jumps only.",
      },
      {
        prop: "disabled / id / input props / className",
        type: "Base UI Input attributes",
        description:
          "Forward supported input attributes; value and change are managed internally. Empty results disable input and Go.",
      },
    ],
  },
  {
    title: "usePagination / calculatePageRange",
    props: [
      {
        prop: "options",
        type: "UsePaginationOptions",
        description:
          "Controlled/default page, page size, total, callbacks, maxPages, and keepInBounds.",
      },
      {
        prop: "return values",
        type: "UsePaginationReturn",
        description:
          "page, pageSize, total, pageCount, startIndex, endIndex, startItem, endItem, hasPrev/hasNext/isFirst/isLast.",
      },
      {
        prop: "navigation",
        type: "setPage / nextPage / prevPage / firstPage / lastPage / reset",
        description:
          "Clamped by default; setPage honors keepInBounds=false. Selecting the current page does not notify.",
      },
      {
        prop: "setPagination",
        type: "({ page: number; pageSize: number }) => void",
        description:
          "Commit both values once. Wire onPaginationChange={pagination.setPagination} when composing a hook and a controlled Pagination, especially with URL state.",
      },
      {
        prop: "setPageSize / setTotal",
        type: "(number) => void",
        description:
          "Mutate uncontrolled state, or notify controlled owners. Page-size changes request page 1 atomically.",
      },
      {
        prop: "getPageRange / isCurrentPage / getPageData",
        type: "range / predicate / readonly-array slice",
        description:
          "Bounded numbered buttons and safe data slices. Empty pages have start/end items 0 and endIndex=-1.",
      },
      {
        prop: "calculatePageRange(page, pageCount, maxPages)",
        type: "PageRangeItem[]",
        description:
          "Finite normalized input, unique first/current/last pages, and at most maxPages numbered controls.",
      },
    ],
  },
  {
    title: "useUrlPagination / context / variants",
    props: [
      {
        prop: "pageParam / pageSizeParam",
        type: "string",
        default: '"page" / "pageSize"',
        description: "Query keys; invalid URL values fall back to defaults.",
      },
      {
        prop: "shallow",
        type: "boolean",
        default: "true",
        description:
          "true replaces, false pushes browser history without reloading. Back/Forward subscription keeps state current.",
      },
      {
        prop: "getSearchParams / setSearchParams / subscribe",
        type: "router adapter functions",
        description:
          "For a router-owned URL, provide its read/write functions and store-change subscription.",
      },
      {
        prop: "searchParamsString / buildUrl",
        type: "string / (basePath?) => string",
        description:
          "Preserve unrelated parameters and hash while adding current pagination state.",
      },
      {
        prop: "usePaginationContext()",
        type: "PaginationContextValue | null",
        description:
          "Access page state, style, loading/disability, IDs, and formatting within Pagination.",
      },
      {
        prop: "paginationVariants / paginationLinkVariants",
        type: "CVA functions",
        description:
          "Exported root and control styles. All public component, hook, and range types are exported.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const paginationPageChangelogEntries = [
  {
    version: "3.2.1",
    date: "20 November 2026",
    changes: [
      {
        type: "removed",
        title: "Invisible ellipsis placeholders",
        description:
          "The desktop range no longer pads the slots where an ellipsis would appear, so the footer is as wide as the pages it actually shows. Edge pages no longer carry dead space next to the first and last buttons; expect the footer width to change as the window slides.",
      },
    ],
  },
  {
    version: "3.2.0",
    date: "19 November 2026",
    changes: [
      {
        type: "added",
        title: "Info and size-selector customization",
        description:
          "KiraPagination gains infoFormat, emptyInfoText and infoMobileCompact for the item-range text, plus pageSizeLabel and pageSizeSuffix for the size selector. The suffix is associated with the control through aria-describedby.",
      },
      {
        type: "fixed",
        title: "Stable footer width across page ranges",
        description:
          "Windowed ranges keep a constant desktop slot count: a missing ellipsis renders an invisible placeholder, so navigating near the edges no longer shifts the footer width. The active page control keeps its identity and focus.",
      },
      {
        type: "fixed",
        title: "Size selector width and touch target",
        description:
          "The input fallback widens to 5ch so formatted sizes like 1,000 are not clipped (field-sizing:content still applies where supported); coarse pointers keep the 44px target.",
      },
    ],
  },
  {
    version: "3.1.2",
    date: "13 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Visible page links",
        description:
          "Numbered links retain their default page labels when href is supplied. Disabled generated anchors remove their URLs; ordinary and modified clicks keep their existing behavior.",
      },
      {
        type: "changed",
        title: "KiraSelect page size",
        description:
          "The page-size control uses KiraSelect with Select's standard height, typography, and focus ring, while preserving its label, page reset, form value, and touch target.",
      },
      {
        type: "added",
        title: "Loading indicator",
        description:
          "Numbered and cursor pagination reuse the shared Spinner beside loading text. Reduced motion stops rotation; the existing status region owns announcements.",
      },
    ],
  },
  {
    version: "3.1.1",
    date: "13 November 2026",
    changes: [
      {
        type: "changed",
        title: "Compact ellipsis page jump",
        description:
          "Clicking the dots opens a compact page input and Go action. Enter submits, Escape or clicking outside dismisses, and page validation and focus restoration are preserved.",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "12 November 2026",
    changes: [
      {
        type: "added",
        title: "Go to page from ellipses",
        description:
          "Dots are named Base UI Popover triggers. They reuse strict PaginationJump validation, disable with loading/empty/restricted states, and focus the new current page when a local jump removes the trigger; busy or absent controls fall back to the navigation region.",
      },
      {
        type: "added",
        title: "Native URL jumps and mobile ranges",
        description:
          "getPageHref also applies to Go controls. Valid native links preserve browser navigation without local page changes. KiraPagination.mobileMaxPages exposes an optional mobile range; the default stays compact.",
      },
      {
        type: "changed",
        title: "Ellipsis semantics",
        description:
          "PaginationEllipsis now renders a button rather than an aria-hidden span and requires Pagination context. Consumers wanting decorative gaps can provide a noninteractive custom renderEllipsis. Audited against Base UI 1.9.0.",
      },
    ],
  },
  {
    version: "3.0.1",
    date: "12 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Saved URL defaults and repeated filters",
        description:
          "Page 1 remains reachable when defaultPage is not 1. Shareable URLs preserve repeated query values. setPagination commits page and size together; the URL tab forwards onPaginationChange once instead of chaining stale setters.",
      },
      {
        type: "fixed",
        title: "Native link composition",
        description:
          "Custom render elements retain href, target, rel, and download. Real links keep native Space/Enter behavior and do not also invoke local page changes; disabled controls do not call consumer actions.",
      },
      {
        type: "fixed",
        title: "Jump control contrast and touch target",
        description:
          "The page-number hint uses muted-foreground instead of a half-opacity default. Go matches the 44px touch-primary controls without changing shared token scales.",
      },
      {
        type: "fixed",
        title: "Bounds and loading feedback",
        description:
          "keepInBounds=false is honored by setters without marking an unrelated page active. Uncontrolled bounds corrections notify change handlers once; offsets stay safe. The status region announces custom loading text, request failures, and retry availability.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "11 November 2026",
    changes: [
      {
        type: "added",
        title: "KiraPagination and cursor results",
        description:
          "Composed numbered/cursor navigation, optional jump and size controls, loading/error recovery, native links, and container-aware compact layouts.",
      },
      {
        type: "fixed",
        title: "State and URL synchronization",
        description:
          "Changing controlled totals and sizes takes effect immediately. URL updates commit page and size together, preserve filters/hash/history state, and subscribe to Back/Forward.",
      },
      {
        type: "changed",
        title: "Primitive-backed controls",
        description:
          "Audited against Base UI 1.9.0. Button, Input, and the existing Base UI Select provide interaction; Base UI has no Pagination primitive. Semantic colors replace fixed palettes.",
      },
      {
        type: "breaking",
        title: "Controlled page size and totals",
        description:
          "pageSize and total are controlled when supplied. Use defaultPageSize/defaultTotal for local setters. Empty endIndex is -1; maxPages now bounds the number of numeric buttons.",
      },
      {
        type: "breaking",
        title: "Names, selectors, and jump behavior",
        description:
          "State attributes are presence-based. Navigation parts have distinct slots. SizeSelector exposes documented Base UI selector attributes; Jump uses strict text input and a Go button instead of a nested form or silent clamping.",
      },
      {
        type: "changed",
        title: "Single announcement and quiet navigation",
        description:
          "Info is no longer a live region; Status announces complete phrases once. Removed all-property transitions and page-button scaling. PaginationStatus belongs once per composed nav and is included by KiraPagination.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function EllipsisControlsSection({
  page,
  setPage,
  setHasNavigated,
  loadAfterJump,
  setLoading,
  loading,
  disabled,
  disableCurrentAfterJump,
  hasNavigated,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setHasNavigated: React.Dispatch<React.SetStateAction<boolean>>;
  loadAfterJump: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  disabled: boolean;
  disableCurrentAfterJump: boolean;
  hasNavigated: boolean;
}) {
  return (
    <Pagination
      total={2000}
      pageSize={10}
      page={page}
      onPageChange={(nextPage) => {
        setPage(nextPage);
        setHasNavigated(true);

        if (loadAfterJump) setLoading(true);
      }}
      maxPages={3}
      loading={loading}
      disabled={disabled}
      disabledReason="Page navigation is paused for this demonstration."
      aria-label="Ellipsis page jump"
    >
      <PaginationContent>
        <PaginationPages
          mobileMaxPages={3}
          renderPage={(item) =>
            item.type === "page" ? (
              <PaginationLink
                page={item.page}
                isActive={item.isActive}
                disabled={
                  disableCurrentAfterJump && hasNavigated && item.isActive
                }
              />
            ) : undefined
          }
        />
      </PaginationContent>
      <PaginationInfo />
      <PaginationStatus />
    </Pagination>
  );
}

function EllipsisControlsSection2({
  loading,
  setLoading,
  disabled,
  setDisabled,
  loadAfterJump,
  setLoadAfterJump,
  disableCurrentAfterJump,
  setDisableCurrentAfterJump,
  setPage,
  setHasNavigated,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  loadAfterJump: boolean;
  setLoadAfterJump: React.Dispatch<React.SetStateAction<boolean>>;
  disableCurrentAfterJump: boolean;
  setDisableCurrentAfterJump: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setHasNavigated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <fieldset aria-label="Ellipsis demo state" className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        aria-pressed={loading}
        onClick={() => setLoading(!loading)}
      >
        Loading state
      </Button>
      <Button
        size="sm"
        variant="outline"
        aria-pressed={disabled}
        onClick={() => setDisabled(!disabled)}
      >
        Disabled state
      </Button>
      <Button
        size="sm"
        variant="outline"
        aria-pressed={loadAfterJump}
        onClick={() => setLoadAfterJump(!loadAfterJump)}
      >
        Loading after jump
      </Button>
      <Button
        size="sm"
        variant="outline"
        aria-pressed={disableCurrentAfterJump}
        onClick={() => setDisableCurrentAfterJump(!disableCurrentAfterJump)}
      >
        Disabled current after jump
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setPage(50);
          setLoading(false);
          setHasNavigated(false);
        }}
      >
        Reset to page 50
      </Button>
    </fieldset>
  );
}
