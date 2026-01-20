import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Container variants for max-width wrappers
 * @see {@link ContainerProps} for usage
 */
const containerVariants = cva("mx-auto w-full", {
  variants: {
    /** Maximum width of the container */
    size: {
      sm: "max-w-screen-sm",        // 640px
      md: "max-w-screen-md",        // 768px
      lg: "max-w-screen-lg",        // 1024px
      xl: "max-w-screen-xl",        // 1280px
      "2xl": "max-w-screen-2xl",    // 1536px
      full: "max-w-full",
      prose: "max-w-prose",         // 65ch - optimal reading width
    },
    /** Horizontal padding */
    padding: {
      none: "",
      sm: "px-3 sm:px-4",
      default: "px-4 sm:px-6 lg:px-8",
      lg: "px-6 sm:px-8 lg:px-12",
    },
    /** Center content within container */
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
})

type ContainerElement = "div" | "section" | "main" | "article" | "aside" | "header" | "footer"

interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {
  /** Semantic HTML element to render */
  as?: ContainerElement
}

/**
 * Container component for centering and constraining content width.
 * Provides responsive padding and multiple size presets.
 * 
 * @example
 * ```tsx
 * // Default container (xl max-width)
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 * 
 * // Narrow prose container for reading
 * <Container size="prose" centered>
 *   <article>Long form content...</article>
 * </Container>
 * 
 * // Full-width section with padding
 * <Container as="section" size="full">
 *   <Hero />
 * </Container>
 * 
 * // Responsive container
 * <Container size="lg" padding="lg">
 *   <Dashboard />
 * </Container>
 * ```
 */
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
  )
}

export { Container, containerVariants }
export type { ContainerProps }
