import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const cardSurfaceVariants = cva("", {
  variants: {
    variant: {
      default: "ring-foreground/10 bg-card",
      interactive:
        "ring-foreground/10 bg-card hover:shadow-lg hover:-translate-y-1 transition-[box-shadow,translate] duration-200 cursor-pointer",
      gradient:
        "bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 ring-primary/20",
      glass:
        "bg-background/60 dark:bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-border/50 shadow-lg ring-0",
      outline: "bg-transparent border-2 border-border ring-0",
      elevated: "ring-foreground/10 bg-card shadow-lg",
      bordered: "bg-card border-2 border-border ring-0",
      flat: "bg-muted/30 border-0 ring-0",
      elevated2: "ring-foreground/10 bg-card shadow-2xl",
      soft: "bg-muted/50 border border-border/50 ring-0",
    },
    size: {
      default: "",
      sm: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type CardVariant = VariantProps<typeof cardSurfaceVariants>["variant"];

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
  variant?: CardVariant;
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "text-card-foreground overflow-hidden rounded-xl p-6 text-sm ring-1 [--card-bleed:--spacing(6)] data-[size=sm]:p-4 data-[size=sm]:[--card-bleed:--spacing(4)] has-[>img:first-child]:pt-0 has-[>img:last-child]:pb-0 *:[img:first-child]:-mx-[var(--card-bleed)] *:[img:first-child]:w-[calc(100%+var(--card-bleed)*2)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:-mx-[var(--card-bleed)] *:[img:last-child]:w-[calc(100%+var(--card-bleed)*2)] *:[img:last-child]:rounded-b-xl group/card flex flex-col",
        cardSurfaceVariants({ variant, size }),
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "gap-1.5 mb-4 last:mb-0 group-data-[size=sm]/card:mb-3 rounded-t-xl [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base leading-none font-semibold group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 pt-6 group-data-[size=sm]/card:pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CardSkeleton({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
}) {
  return (
    <div
      data-slot="card-skeleton"
      data-size={size}
      aria-busy="true"
      className={cn(
        "rounded-xl border bg-card animate-pulse ring-1 ring-foreground/10",
        size === "sm" ? "p-4" : "p-6",
        className,
      )}
      {...props}
    >
      <div className="space-y-2">
        <div
          className={cn(
            "rounded bg-muted",
            size === "sm" ? "h-3 w-20" : "h-4 w-28",
          )}
        />
        <div
          className={cn(
            "rounded bg-muted",
            size === "sm" ? "h-2.5 w-32" : "h-3 w-44",
          )}
        />
      </div>
      <div className="mt-3 space-y-2">
        <div
          className={cn(
            "rounded bg-muted",
            size === "sm" ? "h-2.5 w-full" : "h-3 w-full",
          )}
        />
        <div
          className={cn(
            "rounded bg-muted",
            size === "sm" ? "h-2.5 w-4/5" : "h-3 w-4/5",
          )}
        />
      </div>
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardSkeleton,
  cardSurfaceVariants,
};
