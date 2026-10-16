import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const centerVariants = cva("", {
  variants: {
    type: {
      flex: "flex items-center justify-center",
      grid: "grid place-items-center",
      absolute: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    inline: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      type: "flex",
      inline: true,
      className: "inline-flex items-center justify-center",
    },
    {
      type: "flex",
      inline: false,
      className: "flex items-center justify-center",
    },
    { type: "grid", inline: true, className: "inline-grid place-items-center" },
    { type: "grid", inline: false, className: "grid place-items-center" },
  ],
  defaultVariants: {
    type: "flex",
    inline: false,
  },
});

type CenterType = "flex" | "grid" | "absolute";

type CenterElement = "div" | "span" | "section" | "main" | "article";

interface CenterProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof centerVariants> {
  as?: CenterElement;
  type?: CenterType;
}

function Center({
  as: Component = "div",
  className,
  type = "flex",
  inline,
  ...props
}: CenterProps) {
  return (
    <Component
      data-slot="center"
      className={cn(centerVariants({ type, inline }), className)}
      {...props}
    />
  );
}

export { Center, centerVariants };

export type { CenterProps, CenterType };
