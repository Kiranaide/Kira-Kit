import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
      prose: "max-w-prose",
    },
    padding: {
      none: "",
      sm: "px-3 sm:px-4",
      default: "px-4 sm:px-6 lg:px-8",
      lg: "px-6 sm:px-8 lg:px-12",
    },
    centered: {
      true: "flex flex-col items-center",
      false: "",
    },
  },
  defaultVariants: {
    size: "xl",
    padding: "default",
    centered: false,
  },
});

type ContainerElement =
  | "div"
  | "section"
  | "main"
  | "article"
  | "aside"
  | "header"
  | "footer";

interface ContainerProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  as?: ContainerElement;
}

function Container({
  as: Component = "div",
  className,
  size,
  padding,
  centered,
  ...props
}: ContainerProps) {
  return (
    <Component
      data-slot="container"
      className={cn(containerVariants({ size, padding, centered }), className)}
      {...props}
    />
  );
}

export { Container, containerVariants };
export type { ContainerProps };
