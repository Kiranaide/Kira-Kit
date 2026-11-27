import type * as React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { cn } from "cn";
import { Spinner } from "@/components/ui/spinner";
import {
  SkeletonCard,
  SkeletonHeading,
  SkeletonText,
  SkeletonLines,
} from "@/components/ui/skeleton";

function getSkeletonDelay(pathname: string): number {
  if (pathname === "/") return 1500;

  if (pathname.startsWith("/components/")) return 500;

  return 1000;
}

function getRouteName(pathname: string): string {
  if (pathname === "/") return "Home";
  const match = pathname.match(/^\/components\/(.+)$/);

  if (match) {
    const componentName = match[1];

    return componentName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "page";
}

function getSkeletonType(
  pathname: string,
): "component" | "overview" | "generic" {
  if (pathname === "/") return "overview";

  if (pathname.startsWith("/components/")) return "component";

  return "generic";
}

/** Mirrors the docs frame: a 232px intro column beside the section content. */
function SectionSkeleton({
  heading,
  rows,
}: {
  heading: string;
  rows: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3.5 lg:flex-row lg:gap-8">
      <div className="flex flex-col gap-1.5 lg:w-[232px] lg:shrink-0 lg:gap-2">
        <SkeletonHeading className={cn("h-7", heading)} />
        <SkeletonLines count={2} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">{rows}</div>
    </div>
  );
}

/** The header and the fixed-height example browser, which is the frame's tallest block. */
function PlaygroundSkeleton() {
  return (
    <div className="flex flex-col gap-5 lg:gap-7">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <SkeletonHeading className="h-10 w-52 lg:h-12 lg:w-72" />
          <div className="h-6 w-14 shrink-0 rounded-[12px] bg-muted" />
        </div>
        <SkeletonLines count={2} lastLineWidth="2/3" />
      </div>

      <div className="flex flex-col gap-5 lg:h-[692px] lg:gap-0">
        <div className="flex flex-col gap-2 lg:hidden">
          <SkeletonText className="h-4 w-20" />
          <div className="h-12 rounded-[8px] border border-border bg-muted" />
        </div>

        <div className="flex overflow-hidden rounded-[12px] border border-border lg:h-full">
          <div className="hidden w-56 shrink-0 flex-col gap-3 border-r border-border bg-muted/40 px-3 py-[18px] lg:flex">
            <SkeletonText className="h-4 w-20" />
            <div className="flex flex-col gap-px">
              {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                <div
                  key={row}
                  className={cn(
                    "h-[27px] rounded-[5px]",
                    row === 0 ? "bg-primary/10" : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 lg:gap-4 lg:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <SkeletonHeading className="h-6 w-40" />
                <SkeletonText className="h-3.5 w-64" />
              </div>
              <div className="h-8 w-40 rounded-[8px] bg-muted" />
            </div>

            <div className="flex min-h-[200px] flex-1 items-center justify-center rounded-[8px] border border-border bg-muted/20 p-2 lg:p-8">
              <div className="h-40 w-full max-w-[592px] rounded-[8px] bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-8 px-4 pt-6 pb-8 lg:gap-10 lg:px-8 lg:pt-8 lg:pb-12">
      <PlaygroundSkeleton />

      <SectionSkeleton
        heading="w-24"
        rows={[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-start gap-3.5 py-[18px]">
            <div className="h-9 w-9 shrink-0 rounded-[8px] bg-primary/10" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <SkeletonHeading className="h-4 w-44" />
              <SkeletonText className="h-3.5 w-full" />
            </div>
          </div>
        ))}
      />

      <SectionSkeleton
        heading="w-40"
        rows={
          <div className="grid gap-3 lg:grid-cols-2">
            {[0, 1].map((card) => (
              <div
                key={card}
                className="flex flex-col gap-3 rounded-[10px] border border-border/70 bg-muted/30 p-4"
              >
                <SkeletonHeading className="h-4 w-28" />
                <SkeletonLines count={4} />
              </div>
            ))}
          </div>
        }
      />

      <SectionSkeleton
        heading="w-24"
        rows={
          <div className="flex h-[460px] flex-col overflow-hidden rounded-[10px] border border-border/70 bg-card">
            <div className="h-[50px] shrink-0 bg-muted/30" />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <SkeletonLines count={9} lastLineWidth="1/2" />
            </div>
          </div>
        }
      />

      <SectionSkeleton
        heading="w-32"
        rows={
          <div className="flex flex-col gap-6">
            {[0, 1].map((card) => (
              <div
                key={card}
                className="overflow-hidden rounded-[10px] border border-border/70 bg-muted/30"
              >
                <div className="h-[48px] bg-muted" />
                <div className="divide-y divide-border/70">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="flex gap-5 px-4 py-2.5">
                      <SkeletonText className="h-3.5 w-[308px] max-w-1/2" />
                      <SkeletonText className="h-3.5 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

function OverviewPageSkeleton() {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <SkeletonHeading className="h-9 w-1/3" />
      <SkeletonLines count={3} />

      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function GenericPageSkeleton() {
  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <SkeletonHeading className="h-9 w-1/2" />
      <SkeletonLines count={2} />

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <div className="p-6 border border-border rounded-lg space-y-3">
          <SkeletonImage />
          <SkeletonHeading />
          <SkeletonLines count={2} />
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <div className="p-6 border border-border rounded-lg space-y-3">
          <SkeletonImage />
          <SkeletonHeading />
          <SkeletonLines count={2} />
        </div>
      </div>
    </div>
  );
}

function SkeletonImage() {
  return (
    <div className="w-full aspect-video rounded-md bg-muted motion-safe:animate-pulse motion-reduce:opacity-70" />
  );
}

export function RoutePending() {
  const location = useLocation();
  const [showSkeleton, setShowSkeleton] = useState(false);

  const delay = getSkeletonDelay(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), delay);

    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  const routeName = getRouteName(location.pathname);
  const skeletonType = getSkeletonType(location.pathname);

  return (
    <output
      className="block fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"

      aria-live="polite"
      aria-label={`Loading ${routeName}`}
    >
      <div className="w-full max-w-4xl p-8 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" variant="default" />
          <p className="text-sm text-muted-foreground">
            Loading {routeName}...
          </p>
        </div>

        {showSkeleton && (
          <div className="w-full">
            {skeletonType === "component" && <ComponentPageSkeleton />}
            {skeletonType === "overview" && <OverviewPageSkeleton />}
            {skeletonType === "generic" && <GenericPageSkeleton />}
          </div>
        )}
      </div>
    </output>
  );
}
