import type { ComponentPropsWithoutRef } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { IconSparkles } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const welcomeVariants = cva(
  "w-full max-w-lg rounded-xl border bg-card p-8 text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        accent: "border-primary/20 bg-primary/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type WelcomeProps = ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof welcomeVariants>;

export function Welcome({ className, variant, ...props }: WelcomeProps) {
  return (
    <section
      data-slot="welcome"
      className={cn(welcomeVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-4">
        <IconSparkles
          aria-hidden="true"
          className="size-10 shrink-0 rounded-lg bg-primary p-2 text-primary-foreground"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Kira Kit is ready</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Your project is configured for Base UI, Tailwind CSS, and the Kira Kit registry.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <code className="rounded-md bg-muted px-3 py-2 text-xs sm:text-sm">
          shadcn add @kira-kit/button
        </code>
        <ButtonPrimitive
          type="button"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Start building
        </ButtonPrimitive>
      </div>
    </section>
  );
}
