"use client"

import * as React from "react"
import { IconChevronLeft, IconChevronRight, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react"
import useEmblaCarousel from "embla-carousel-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const carouselVariants = cva("relative group", {
  variants: {
    variant: {
      default: "",
      cards: "",
      fade: "",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
  },
})

const carouselContentVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "-ml-4",
      vertical: "-mt-4 flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

const carouselItemVariants = cva(
  "min-w-0 shrink-0 grow-0 basis-full",
  {
    variants: {
      variant: {
        default: "pl-4",
        cards: "pl-4 md:basis-1/2 lg:basis-1/3",
        fade: "",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        full: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const carouselButtonVariants = cva(
  "absolute inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background/80 p-0 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "",
        subtle: "bg-background/50 hover:bg-background/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const carouselDotVariants = cva(
  "h-2 w-2 rounded-full transition-all",
  {
    variants: {
      state: {
        inactive: "bg-muted-foreground/50",
        active: "bg-primary w-6",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
)

interface CarouselProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof carouselVariants> {
  loop?: boolean
  align?: "start" | "center" | "end"
  autoplay?: boolean
  autoplayInterval?: number
}

interface CarouselContentProps extends React.ComponentPropsWithoutRef<"div"> {}
interface CarouselItemProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof carouselItemVariants> {}
interface CarouselPreviousProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof carouselButtonVariants> {}
interface CarouselNextProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof carouselButtonVariants> {}
interface CarouselDotsProps extends React.ComponentPropsWithoutRef<"div"> {}
interface CarouselDotProps extends React.ComponentPropsWithoutRef<"button">, Omit<VariantProps<typeof carouselDotVariants>, "state"> {
  index: number
  isActive?: boolean
}
interface CarouselAutoplayButtonProps extends React.ComponentPropsWithoutRef<"button"> {}
interface CarouselProgressProps extends React.ComponentPropsWithoutRef<"div"> {}

type CarouselContextValue = {
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedScrollSnap: () => number
  orientation: "horizontal" | "vertical"
  prefersReducedMotion: boolean | undefined
}

const CarouselContext = React.createContext<CarouselContextValue | undefined>(undefined)

const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component")
  }
  return context!
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, orientation = "horizontal", loop = false, align = "start", autoplay = false, autoplayInterval = 5000, children, ...props }, ref) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

    React.useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = () => {
        setPrefersReducedMotion(mediaQuery.matches)
      }
      mediaQuery.addEventListener("change", handleChange)

      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    }, [])

    const [emblaRef, emblaApi] = useEmblaCarousel(
      { loop, align, axis: orientation === "horizontal" ? "x" : "y" },
      [
        (emblaApi: any) => {
          if (autoplay && emblaApi) {
            const interval = setInterval(() => {
              if (emblaApi) emblaApi.scrollNext()
            }, autoplayInterval)
            emblaApi.on("destroy", () => clearInterval(interval))
          }
        },
      ] as any
    )

    return (
      <CarouselContext.Provider value={{
        scrollPrev: () => emblaApi?.scrollPrev?.(),
        scrollNext: () => emblaApi?.scrollNext?.(),
        scrollTo: (index) => emblaApi?.scrollTo?.(index),
        canScrollPrev: emblaApi?.canScrollPrev?.() ?? false,
        canScrollNext: emblaApi?.canScrollNext?.() ?? false,
        selectedScrollSnap: () => emblaApi?.selectedScrollSnap?.() ?? 0,
        orientation: orientation ?? "horizontal",
        prefersReducedMotion,
      }}>
        <div
          ref={ref}
          className={cn(carouselVariants({ variant: "default", orientation: orientation ?? "horizontal", className }))}
          role="region"
          aria-label="Carousel"
          aria-roledescription="Image carousel with navigation controls"
          {...props}
        >
          <CarouselContent ref={emblaRef}>{children}</CarouselContent>
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()
  return (
    <div
      ref={ref}
      className={cn(carouselContentVariants({ orientation, className }))}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(carouselItemVariants({ size, className }))}
      role="group"
      {...props}
    />
  )
)
CarouselItem.displayName = "CarouselItem"

  const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
    ({ className, ...props }, ref) => {
      const { scrollPrev, canScrollPrev, orientation } = useCarousel()

      return (
        <button
          ref={ref}
          type="button"
          disabled={!canScrollPrev}
          className={cn(
            carouselButtonVariants({ className }),
            orientation === "horizontal" ? "left-4 top-1/2 -translate-y-1/2" : "top-4 left-1/2 -translate-x-1/2"
          )}
          onClick={() => scrollPrev?.()}
          aria-label="Previous slide"
          {...props}
        >
          <IconChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
      )
    }
  )
CarouselPrevious.displayName = "CarouselPrevious"

  const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
    ({ className, ...props }, ref) => {
      const { scrollNext, canScrollNext, orientation } = useCarousel()

      return (
        <button
          ref={ref}
          type="button"
          disabled={!canScrollNext}
          className={cn(
            carouselButtonVariants({ className }),
            orientation === "horizontal" ? "right-4 top-1/2 -translate-y-1/2" : "bottom-4 left-1/2 -translate-x-1/2"
          )}
          onClick={() => scrollNext?.()}
          aria-label="Next slide"
          {...props}
        >
          <IconChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )
    }
  )
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
      className={cn("absolute bottom-4 left-1/2 -translate-x-1/2", className)}
      {...props}
    >
    {children}
  </div>
))
CarouselDots.displayName = "CarouselDots"

const CarouselDot = React.forwardRef<HTMLButtonElement, CarouselDotProps>(
  ({ className, index, isActive, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(carouselDotVariants({ state: isActive ? "active" : "inactive", className }))}
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? "true" : undefined}
      onClick={() => (props as any).onClick?.(index)}
      {...props}
    />
  )
)
CarouselDot.displayName = "CarouselDot"

const CarouselAutoplayButton = React.forwardRef<HTMLButtonElement, CarouselAutoplayButtonProps & { isPlaying?: boolean; onToggle?: () => void }>(
  ({ className, isPlaying, onToggle, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 p-0 text-foreground shadow-md backdrop-blur-sm transition-opacity hover:bg-background disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onToggle?.()
        onClick?.(e)
      }}
      aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
      aria-pressed={isPlaying}
      {...props}
    >
      {isPlaying ? <IconPlayerPause className="h-3 w-3" aria-hidden="true" /> : <IconPlayerPlay className="h-3 w-3" aria-hidden="true" />}
    </button>
  )
)
CarouselAutoplayButton.displayName = "CarouselAutoplayButton"

const CarouselProgress = React.forwardRef<HTMLDivElement, CarouselProgressProps>(({ className, ...props }, ref) => {
  const { scrollTo, selectedScrollSnap } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn("absolute bottom-4 left-1/2 -translate-x-1/2", className)}
      {...props}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselDot
            key={index}
            index={index}
            isActive={index === selectedScrollSnap()}
            onClick={() => scrollTo?.(index)}
          />
        ))}
      </div>
    </div>
  )
})
CarouselProgress.displayName = "CarouselProgress"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselDot,
  CarouselAutoplayButton,
  CarouselProgress,
  useCarousel,
  carouselVariants,
  carouselContentVariants,
  carouselItemVariants,
  carouselButtonVariants,
  carouselDotVariants,
}

export type {
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselPreviousProps,
  CarouselNextProps,
  CarouselDotsProps,
  CarouselDotProps,
  CarouselAutoplayButtonProps,
  CarouselProgressProps,
}
