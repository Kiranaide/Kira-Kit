"use client";

import * as React from "react";
import { useId } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
  IconX,
  IconZoomIn,
  IconZoomOut,
  IconDownload,
  IconShare,
  IconMaximize,
  IconKeyboard,
  IconPhoto,
  IconAlertCircle,
} from "@tabler/icons-react";
import useEmblaCarousel from "embla-carousel-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const carouselVariants = cva("relative group", {
  variants: {
    variant: {
      default: "",
      cards: "",
      fade: "",
      peek: "",
      zoom: "",
      flip: "",
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
});

const carouselContentVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "-ml-4",
      vertical: "-mt-4 flex-col",
    },
    variant: {
      default: "",
      cards: "",
      fade: "relative",
      peek: "",
      zoom: "items-center justify-center",
      flip: "perspective-1000",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
});

const carouselItemVariants = cva("min-w-0 shrink-0 grow-0", {
  variants: {
    variant: {
      default: "basis-full pl-4",
      cards: "pl-4 md:basis-1/2 lg:basis-1/3",
      fade: "basis-full absolute inset-0 transition-opacity duration-500",
      peek: "basis-[85%] pl-4",
      zoom: "basis-full pl-4 transition-transform duration-300",
      flip: "basis-full pl-4",
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
});

const carouselButtonVariants = cva(
  "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background/80 p-0 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        subtle: "bg-background/50 hover:bg-background/80",
        ghost: "border-0 bg-transparent shadow-none hover:bg-accent",
      },
      position: {
        absolute: "absolute",
        relative: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "absolute",
    },
  }
);

const carouselDotVariants = cva(
  "relative inline-flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      state: {
        inactive: "h-2 w-2 bg-muted-foreground/50 hover:bg-muted-foreground/70",
        active: "h-2 w-4 bg-primary",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      state: "inactive",
      size: "default",
    },
  }
);

interface CarouselProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "onResize" | "onScroll">,
    VariantProps<typeof carouselVariants> {
  loop?: boolean;
  align?: "start" | "center" | "end";
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  onSlideChange?: (index: number) => void;
  onAutoplayChange?: (isPlaying: boolean) => void;
  onInit?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void;
  onResize?: () => void;
  onSettle?: () => void;
  onCarouselScroll?: (progress: number) => void;
  setApi?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void;
  autoHeight?: boolean;
}

type CarouselContentProps = React.ComponentPropsWithoutRef<"div">;

interface CarouselItemProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof carouselItemVariants> {
  index?: number;
}

type CarouselPreviousProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof carouselButtonVariants>;

type CarouselNextProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof carouselButtonVariants>;

interface CarouselDotsProps extends React.ComponentPropsWithoutRef<"div"> {
  count?: number;
}

interface CarouselDotProps
  extends
    React.ComponentPropsWithoutRef<"button">,
    Omit<VariantProps<typeof carouselDotVariants>, "state"> {
  index: number;
  isActive?: boolean;
}

interface CarouselAutoplayButtonProps
  extends
    React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof carouselButtonVariants> {
  isPlaying?: boolean;
  onToggle?: () => void;
}

type CarouselProgressProps = React.ComponentPropsWithoutRef<"div">;

interface CarouselProgressBarProps extends React.ComponentPropsWithoutRef<"div"> {
  animated?: boolean;
}

interface CarouselThumbnailsProps extends React.ComponentPropsWithoutRef<"div"> {
  images: { src: string; alt: string }[];
}

interface CarouselLightboxProps extends React.ComponentPropsWithoutRef<"div"> {
  images: { src: string; alt: string; title?: string }[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CarouselImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "loading"
> {
  loading?: "lazy" | "eager";
  showSkeleton?: boolean;
  skeletonClassName?: string;
  errorClassName?: string;
  errorContent?: React.ReactNode;
}

type CarouselCounterProps = React.ComponentPropsWithoutRef<"div">;

type CarouselContextValue = {
  emblaApi: ReturnType<typeof useEmblaCarousel>[1];
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  carouselId: string;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  slideCount: number;
  orientation: "horizontal" | "vertical";
  variant:
    | "default"
    | "cards"
    | "fade"
    | "peek"
    | "zoom"
    | "flip"
    | null
    | undefined;
  prefersReducedMotion: boolean;
  isAutoPlaying: boolean;
  isDragging: boolean;
  toggleAutoplay: () => void;
  setApi?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void;
};

const CarouselContext = React.createContext<CarouselContextValue | undefined>(
  undefined
);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component");
  }

  return context;
};

function useCarouselApi() {
  const [api, setApi] =
    React.useState<ReturnType<typeof useEmblaCarousel>[1]>();

  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  const scrollTo = React.useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  );

  return {
    api,
    setApi,
    current,
    count,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  };
}

function useVisibleSlides() {
  const { emblaApi, variant } = useCarousel();
  const [visibleSlides, setVisibleSlides] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onScroll = () => {
      if (variant === "fade") {
        setVisibleSlides([emblaApi.selectedScrollSnap()]);
      } else {
        setVisibleSlides(emblaApi.slidesInView());
      }
    };

    emblaApi.on("select", onScroll);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);

    onScroll();

    return () => {
      emblaApi.off("select", onScroll);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
    };
  }, [emblaApi, variant]);

  return visibleSlides;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      variant = "default",
      orientation = "horizontal",
      loop = false,
      align = "start",
      autoplay = false,
      autoplayInterval = 5000,
      pauseOnHover = true,
      pauseOnFocus = true,
      onSlideChange,
      onAutoplayChange,
      onInit,
      onResize,
      onSettle,
      onCarouselScroll,
      setApi,
      children,
      ...props
    },
    ref
  ) => {
    const carouselId = useId();

    const [prefersReducedMotion, setPrefersReducedMotion] =
      React.useState(false);

    const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoplay);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [slideCount, setSlideCount] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);

    const autoplayTimerRef = React.useRef<ReturnType<
      typeof setInterval
    > | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const liveRegionRef = React.useRef<HTMLDivElement>(null);
    const dragAnimationRef = React.useRef<gsap.core.Tween | null>(null);

    React.useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);

        if (e.matches) {
          setIsAutoPlaying(false);
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop,
      align,
      axis: orientation === "horizontal" ? "x" : "y",
      duration: prefersReducedMotion ? 0 : 25,
    });

    React.useEffect(() => {
      if (!emblaApi) return;

      const onSelect = () => {
        const index = emblaApi.selectedScrollSnap();
        setSelectedIndex(index);
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
        onSlideChange?.(index);

        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = `Slide ${index + 1} of ${emblaApi.scrollSnapList().length}`;
        }
      };

      const onResizeHandler = () => {
        setSlideCount(emblaApi.scrollSnapList().length);
        onResize?.();
      };

      const onSettleHandler = () => {
        onSettle?.();
      };

      const onScrollHandler = () => {
        const progress = emblaApi.scrollProgress();
        onCarouselScroll?.(progress);
      };

      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onResizeHandler);
      emblaApi.on("settle", onSettleHandler);
      emblaApi.on("scroll", onScrollHandler);

      setSlideCount(emblaApi.scrollSnapList().length);
      onSelect();
      onInit?.(emblaApi);
      setApi?.(emblaApi);

      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onResizeHandler);
        emblaApi.off("settle", onSettleHandler);
        emblaApi.off("scroll", onScrollHandler);
      };
    }, [
      emblaApi,
      onSlideChange,
      onInit,
      onResize,
      onSettle,
      onCarouselScroll,
      setApi,
    ]);

    React.useEffect(() => {
      if (!emblaApi || !isAutoPlaying || prefersReducedMotion) {
        if (autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }

        return;
      }

      autoplayTimerRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, autoplayInterval);

      return () => {
        if (autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }
      };
    }, [emblaApi, isAutoPlaying, autoplayInterval, prefersReducedMotion]);

    const handleMouseEnter = React.useCallback(() => {
      if (pauseOnHover && isAutoPlaying) {
        if (autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }
      }
    }, [pauseOnHover, isAutoPlaying]);

    const handleMouseLeave = React.useCallback(() => {
      if (pauseOnHover && isAutoPlaying && emblaApi && !prefersReducedMotion) {
        autoplayTimerRef.current = setInterval(() => {
          emblaApi.scrollNext();
        }, autoplayInterval);
      }
    }, [
      pauseOnHover,
      isAutoPlaying,
      emblaApi,
      autoplayInterval,
      prefersReducedMotion,
    ]);

    const handleFocusIn = React.useCallback(() => {
      if (pauseOnFocus && isAutoPlaying) {
        if (autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }
      }
    }, [pauseOnFocus, isAutoPlaying]);

    const handleFocusOut = React.useCallback(
      (e: React.FocusEvent) => {
        if (
          pauseOnFocus &&
          isAutoPlaying &&
          emblaApi &&
          !prefersReducedMotion &&
          !containerRef.current?.contains(e.relatedTarget)
        ) {
          autoplayTimerRef.current = setInterval(() => {
            emblaApi.scrollNext();
          }, autoplayInterval);
        }
      },
      [
        pauseOnFocus,
        isAutoPlaying,
        emblaApi,
        autoplayInterval,
        prefersReducedMotion,
      ]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (!emblaApi) return;

        const isHorizontal = orientation === "horizontal";
        const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

        switch (e.key) {
          case prevKey:
            e.preventDefault();
            emblaApi.scrollPrev();
            break;
          case nextKey:
            e.preventDefault();
            emblaApi.scrollNext();
            break;
          case "Home":
            e.preventDefault();
            emblaApi.scrollTo(0);
            break;
          case "End":
            e.preventDefault();
            emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
            break;
        }
      },
      [emblaApi, orientation]
    );

    const toggleAutoplay = React.useCallback(() => {
      const newState = !isAutoPlaying;
      setIsAutoPlaying(newState);
      onAutoplayChange?.(newState);
    }, [isAutoPlaying, onAutoplayChange]);

    const scrollPrev = React.useCallback(
      () => emblaApi?.scrollPrev(),
      [emblaApi]
    );

    const scrollNext = React.useCallback(
      () => emblaApi?.scrollNext(),
      [emblaApi]
    );

    const scrollTo = React.useCallback(
      (index: number) => emblaApi?.scrollTo(index),
      [emblaApi]
    );

    useGSAP(() => {
      if (!emblaApi || prefersReducedMotion) return;

      const handlePointerDown = () => {
        setIsDragging(true);

        if (dragAnimationRef.current) dragAnimationRef.current.kill();
        dragAnimationRef.current = gsap.to(".embla__container", {
          scale: 0.98,
          opacity: 0.9,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      const handlePointerUp = () => {
        setIsDragging(false);

        if (dragAnimationRef.current) {
          dragAnimationRef.current.kill();
          dragAnimationRef.current = gsap.to(".embla__container", {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        }
      };

      emblaApi
        .containerNode()
        .addEventListener("pointerdown", handlePointerDown);
      emblaApi.containerNode().addEventListener("pointerup", handlePointerUp);

      return () => {
        emblaApi
          .containerNode()
          .removeEventListener("pointerdown", handlePointerDown);
        emblaApi
          .containerNode()
          .removeEventListener("pointerup", handlePointerUp);
      };
    }, [emblaApi, prefersReducedMotion]);

    return (
      <CarouselContext.Provider
        value={{
          emblaApi,
          emblaRef,
          carouselId,
          scrollPrev,
          scrollNext,
          scrollTo,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          slideCount,
          orientation: orientation ?? "horizontal",
          variant,
          prefersReducedMotion,
          isAutoPlaying,
          isDragging,
          toggleAutoplay,
          setApi,
        }}
      >
        <div
          ref={(node) => {
            containerRef.current = node;

            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          data-slot="carousel"
          className={cn(carouselVariants({ variant, orientation, className }))}
          role="region"
          aria-roledescription="carousel"
          aria-label={props["aria-label"] || "Image carousel"}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
          {...props}
        >
          <div
            ref={liveRegionRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
          {(() => {
            const childArray = React.Children.toArray(children);

            const isContentNode = (node: React.ReactNode): boolean => {
              if (!React.isValidElement(node)) return false;

              if (node.type === CarouselContent) return true;

              const nodeChildren = (
                node as React.ReactElement<{ children?: React.ReactNode }>
              ).props.children;

              let found = false;
              React.Children.forEach(nodeChildren, (child) => {
                if (!found && isContentNode(child)) {
                  found = true;
                }
              });

              return found;
            };

            const main = childArray.find(isContentNode);

            const overlayNav = childArray.filter(
              (child) =>
                React.isValidElement(child) &&
                (child.type === CarouselPrevious || child.type === CarouselNext)
            );

            const rest = childArray.filter(
              (child) => child !== main && !overlayNav.includes(child)
            );

            return (
              <>
                <div className="relative">
                  {main}
                  {overlayNav}
                </div>
                {rest}
              </>
            );
          })()}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, ...props }, ref) => {
    const carouselContext = useCarousel();
    const { emblaRef, orientation, variant } = carouselContext;

    const indexedChildren = React.useMemo(() => {
      let nextIndex = 0;

      const injectIndex = (node: React.ReactNode): React.ReactNode => {
        if (!React.isValidElement(node)) return node;

        if (node.type === React.Fragment) {
          const fragmentChildren = React.Children.map(
            (node as React.ReactElement<{ children: React.ReactNode }>).props
              .children,
            injectIndex
          );

          return (
            <React.Fragment key={node.key}>{fragmentChildren}</React.Fragment>
          );
        }

        if (node.type === CarouselItem) {
          const index = nextIndex;
          nextIndex++;

          return React.cloneElement(
            node as React.ReactElement<{ index: number }>,
            { index }
          );
        }

        return node;
      };

      return React.Children.map(children, injectIndex);
    }, [children]);

    return (
      <div ref={emblaRef} className="overflow-hidden">
        <div
          ref={ref}
          data-slot="carousel-content"
          className={cn(
            carouselContentVariants({ orientation, variant, className })
          )}
          {...props}
        >
          {indexedChildren}
        </div>
      </div>
    );
  }
);

CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, variant, size, index = 0, children, ...props }, ref) => {
    const carouselContext = useCarousel();

    const {
      carouselId,
      selectedIndex,
      slideCount,
      variant: contextVariant,
      prefersReducedMotion,
    } = carouselContext;

    const itemRef = React.useRef<HTMLDivElement>(null);
    const itemVariant = variant ?? contextVariant ?? "default";
    const isActive = index === selectedIndex;
    const isFade = itemVariant === "fade";
    const isZoom = itemVariant === "zoom";
    const isFlip = itemVariant === "flip";

    useGSAP(() => {
      if (!itemRef.current) return;

      if (prefersReducedMotion) return;

      if (isZoom) {
        gsap.to(itemRef.current, {
          scale: isActive ? 1 : 0.8,
          opacity: isActive ? 1 : 0.3,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      if (isFlip) {
        const rotationY = isActive ? 0 : 180;
        gsap.to(itemRef.current, {
          rotationY,
          duration: 0.6,
          ease: "back.out(1.7)",
        });
      }
    }, [isActive, isZoom, isFlip, prefersReducedMotion]);

    return (
      <div
        ref={(node) => {
          itemRef.current = node;

          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="carousel-item"
        id={`carousel-slide-${carouselId}-${index}`}
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={`Slide ${index + 1} of ${slideCount}`}
        aria-hidden={isFade && !isActive ? true : undefined}
        inert={isFade && !isActive ? true : undefined}
        className={cn(
          carouselItemVariants({ variant: itemVariant, size, className }),
          isFade && (isActive ? "opacity-100 z-10" : "opacity-0 z-0"),
          isFlip && "transform-style-3d backface-hidden"
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(({ className, variant, position = "absolute", ...props }, ref) => {
  const carouselContext = React.useContext(CarouselContext);
  const scrollPrev = carouselContext?.scrollPrev ?? (() => {});
  const canScrollPrev = carouselContext?.canScrollPrev ?? false;
  const orientation = carouselContext?.orientation ?? "horizontal";

  return (
    <button
      ref={ref}
      data-slot="carousel-previous"
      type="button"
      disabled={!canScrollPrev}
      className={cn(
        carouselButtonVariants({ variant, position, className }),
        position === "absolute" &&
          (orientation === "horizontal"
            ? "left-4 top-1/2 -translate-y-1/2"
            : "top-4 left-1/2 -translate-x-1/2 rotate-90")
      )}
      onClick={scrollPrev}
      aria-label="Go to previous slide"
      {...props}
    >
      <IconChevronLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
});

CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, variant, position = "absolute", ...props }, ref) => {
    const carouselContext = React.useContext(CarouselContext);
    const scrollNext = carouselContext?.scrollNext ?? (() => {});
    const canScrollNext = carouselContext?.canScrollNext ?? false;
    const orientation = carouselContext?.orientation ?? "horizontal";

    return (
      <button
        ref={ref}
        data-slot="carousel-next"
        type="button"
        disabled={!canScrollNext}
        className={cn(
          carouselButtonVariants({ variant, position, className }),
          position === "absolute" &&
            (orientation === "horizontal"
              ? "right-4 top-1/2 -translate-y-1/2"
              : "bottom-4 left-1/2 -translate-x-1/2 rotate-90")
        )}
        onClick={scrollNext}
        aria-label="Go to next slide"
        {...props}
      >
        <IconChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }
);

CarouselNext.displayName = "CarouselNext";

const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, count, children, ...props }, ref) => {
    const carouselContext = useCarousel();
    const { carouselId, slideCount, selectedIndex, scrollTo } = carouselContext;
    const dotCount = count ?? slideCount;

    return (
      <div
        ref={ref}
        data-slot="carousel-dots"
        id={`carousel-dots-${carouselId}`}
        role="tablist"
        aria-label="Slide navigation"
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        {children ??
          Array.from({ length: dotCount }).map((_, index) => (
            <CarouselDot
              key={index}
              index={index}
              isActive={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
      </div>
    );
  }
);

CarouselDots.displayName = "CarouselDots";

const CarouselDot = React.forwardRef<HTMLButtonElement, CarouselDotProps>(
  ({ className, index, isActive, size, onClick, ...props }, ref) => {
    const carouselContext = useCarousel();
    const { carouselId, scrollTo } = carouselContext;

    return (
      <button
        ref={ref}
        data-slot="carousel-dot"
        type="button"
        id={`carousel-dot-${carouselId}-${index}`}
        role="tab"
        aria-selected={isActive}
        aria-controls={`carousel-slide-${carouselId}-${index}`}
        aria-label={`Go to slide ${index + 1}`}
        className="h-11 w-11 flex items-center justify-center"
        onClick={(e) => {
          scrollTo(index);
          onClick?.(e);
        }}
        {...props}
      >
        <span
          className={cn(
            carouselDotVariants({
              state: isActive ? "active" : "inactive",
              size,
              className,
            })
          )}
        />
      </button>
    );
  }
);

CarouselDot.displayName = "CarouselDot";

const CarouselAutoplayButton = React.forwardRef<
  HTMLButtonElement,
  CarouselAutoplayButtonProps
>(
  (
    { className, isPlaying: isPlayingProp, onToggle, onClick, ...props },
    ref
  ) => {
    const carouselContext = React.useContext(CarouselContext);
    const isAutoPlaying = carouselContext?.isAutoPlaying ?? false;
    const toggleAutoplay = carouselContext?.toggleAutoplay ?? (() => {});
    const playing = isPlayingProp ?? isAutoPlaying;

    return (
      <button
        ref={ref}
        data-slot="carousel-autoplay-button"
        type="button"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 p-0 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        onClick={(e) => {
          onToggle?.();
          toggleAutoplay();
          onClick?.(e);
        }}
        aria-label={
          playing ? "Pause automatic slideshow" : "Play automatic slideshow"
        }
        aria-pressed={playing}
        {...props}
      >
        {playing ? (
          <IconPlayerPause className="h-4 w-4" aria-hidden="true" />
        ) : (
          <IconPlayerPlay className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );
  }
);

CarouselAutoplayButton.displayName = "CarouselAutoplayButton";

const CarouselProgress = React.forwardRef<
  HTMLDivElement,
  CarouselProgressProps
>(({ className, ...props }, ref) => {
  const { slideCount, selectedIndex, scrollTo } = useCarousel();

  return (
    <div
      ref={ref}
      data-slot="carousel-progress"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: slideCount }).map((_, index) => (
        <CarouselDot
          key={index}
          index={index}
          isActive={index === selectedIndex}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
});

CarouselProgress.displayName = "CarouselProgress";

const CarouselProgressBar = React.forwardRef<
  HTMLDivElement,
  CarouselProgressBarProps
>(({ className, animated = true, ...props }, ref) => {
  const { selectedIndex, slideCount, prefersReducedMotion } = useCarousel();
  const progressRef = React.useRef<HTMLDivElement>(null);

  const progress =
    slideCount > 0 ? ((selectedIndex + 1) / slideCount) * 100 : 0;

  useGSAP(
    () => {
      if (progressRef.current && animated && !prefersReducedMotion) {
        gsap.to(progressRef.current, {
          width: `${progress}%`,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [progress, animated, prefersReducedMotion] }
  );

  return (
    <div
      ref={ref}
      data-slot="carousel-progress-bar"
      className={cn(
        "h-1 w-full rounded-full bg-muted overflow-hidden",
        className
      )}
      role="progressbar"
      aria-valuenow={selectedIndex + 1}
      aria-valuemin={1}
      aria-valuemax={slideCount}
      aria-label={`Slide ${selectedIndex + 1} of ${slideCount}`}
      {...props}
    >
      <div
        ref={progressRef}
        className="h-full bg-primary rounded-full"
        style={
          !animated || prefersReducedMotion
            ? { width: `${progress}%` }
            : undefined
        }
      />
    </div>
  );
});

CarouselProgressBar.displayName = "CarouselProgressBar";

const CarouselThumbnails = React.forwardRef<
  HTMLDivElement,
  CarouselThumbnailsProps
>(({ className, images, ...props }, ref) => {
  const { selectedIndex, scrollTo } = useCarousel();
  const thumbnailsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[
        selectedIndex
      ] as HTMLElement;

      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      ref={ref}
      data-slot="carousel-thumbnails"
      className={cn(
        "flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-muted",
        className
      )}
      role="tablist"
      aria-label="Thumbnail navigation"
      {...props}
    >
      <div ref={thumbnailsRef} className="flex gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`View ${image.alt}`}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              index === selectedIndex
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
            onClick={() => scrollTo(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
});

CarouselThumbnails.displayName = "CarouselThumbnails";

const CarouselLightbox = React.forwardRef<
  HTMLDivElement,
  CarouselLightboxProps
>(
  (
    { className, images, initialIndex = 0, open, onOpenChange, ...props },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
    const [zoom, setZoom] = React.useState(1);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = React.useState(false);
    const [swipeOffset, setSwipeOffset] = React.useState({ x: 0, y: 0 });
    const imageRef = React.useRef<HTMLImageElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const dragStart = React.useRef({ x: 0, y: 0 });

    const touchStartRef = React.useRef<{
      x: number;
      y: number;
      time: number;
    } | null>(null);

    const initialPinchDistanceRef = React.useRef<number | null>(null);
    const initialZoomRef = React.useRef<number>(1);

    React.useEffect(() => {
      if (open) {
        setCurrentIndex(initialIndex);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setSwipeOffset({ x: 0, y: 0 });
      }
    }, [open, initialIndex]);

    const handleTouchStart = React.useCallback(
      (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now(),
          };
        } else if (e.touches.length === 2) {
          const distance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );

          initialPinchDistanceRef.current = distance;
          initialZoomRef.current = zoom;
        }
      },
      [zoom]
    );

    const handleTouchMove = React.useCallback(
      (e: React.TouchEvent) => {
        if (e.touches.length === 1 && touchStartRef.current && zoom === 1) {
          const deltaX = e.touches[0].clientX - touchStartRef.current.x;
          const deltaY = e.touches[0].clientY - touchStartRef.current.y;
          setSwipeOffset({ x: deltaX, y: deltaY });
        } else if (
          e.touches.length === 2 &&
          initialPinchDistanceRef.current !== null
        ) {
          const distance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );

          const scale = distance / initialPinchDistanceRef.current;

          const newZoom = Math.min(
            Math.max(initialZoomRef.current * scale, 1),
            4
          );

          setZoom(newZoom);

          if (newZoom === 1) setPosition({ x: 0, y: 0 });
        } else if (e.touches.length === 1 && zoom > 1) {
          if (touchStartRef.current) {
            setPosition({
              x: e.touches[0].clientX - touchStartRef.current.x + position.x,
              y: e.touches[0].clientY - touchStartRef.current.y + position.y,
            });
            touchStartRef.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
              time: Date.now(),
            };
          }
        }
      },
      [zoom, position]
    );

    const handleTouchEnd = React.useCallback(() => {
      if (touchStartRef.current && zoom === 1) {
        const deltaX = swipeOffset.x;
        const deltaY = swipeOffset.y;
        const deltaTime = Date.now() - touchStartRef.current.time;
        const velocityX = Math.abs(deltaX) / deltaTime;
        const velocityY = Math.abs(deltaY) / deltaTime;

        const SWIPE_THRESHOLD = 100;
        const VELOCITY_THRESHOLD = 0.5;

        if (
          Math.abs(deltaY) > SWIPE_THRESHOLD ||
          velocityY > VELOCITY_THRESHOLD
        ) {
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            onOpenChange(false);
            setSwipeOffset({ x: 0, y: 0 });
            touchStartRef.current = null;
            initialPinchDistanceRef.current = null;

            return;
          }
        }

        if (
          Math.abs(deltaX) > SWIPE_THRESHOLD ||
          velocityX > VELOCITY_THRESHOLD
        ) {
          if (deltaX > 0) {
            setCurrentIndex((prev) =>
              prev > 0 ? prev - 1 : images.length - 1
            );
          } else {
            setCurrentIndex((prev) =>
              prev < images.length - 1 ? prev + 1 : 0
            );
          }

          setZoom(1);
          setPosition({ x: 0, y: 0 });
        }
      }

      setSwipeOffset({ x: 0, y: 0 });
      touchStartRef.current = null;
      initialPinchDistanceRef.current = null;
    }, [zoom, swipeOffset, images.length, onOpenChange]);

    const lastTapRef = React.useRef<number>(0);

    const handleDoubleTap = React.useCallback(() => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        if (zoom === 1) {
          setZoom(2);
        } else {
          setZoom(1);
          setPosition({ x: 0, y: 0 });
        }
      }

      lastTapRef.current = now;
    }, [zoom]);

    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "Escape":
            onOpenChange(false);
            break;
          case "ArrowLeft":
            e.preventDefault();
            setCurrentIndex((prev) =>
              prev > 0 ? prev - 1 : images.length - 1
            );
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            break;
          case "ArrowRight":
            e.preventDefault();
            setCurrentIndex((prev) =>
              prev < images.length - 1 ? prev + 1 : 0
            );
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            break;
          case "+":
          case "=":
            e.preventDefault();
            setZoom((prev) => Math.min(prev + 0.5, 4));
            break;
          case "-":
            e.preventDefault();
            setZoom((prev) => {
              const newZoom = Math.max(prev - 0.5, 1);

              if (newZoom === 1) setPosition({ x: 0, y: 0 });

              return newZoom;
            });
            break;
          case "0":
            e.preventDefault();
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            break;
          case "?":
            setShowKeyboardHelp((prev) => !prev);
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, images.length, onOpenChange]);

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        dragStart.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        };
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useGSAP(
      () => {
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: zoom,
            x: position.x,
            y: position.y,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      },
      { dependencies: [zoom, position.x, position.y] }
    );

    const handleDownload = async () => {
      const image = images[currentIndex];

      try {
        const response = await fetch(image.src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = image.alt || `image-${currentIndex + 1}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        window.open(image.src, "_blank");
      }
    };

    const handleShare = async () => {
      const image = images[currentIndex];

      if (navigator.share) {
        try {
          await navigator.share({
            title: image.title || image.alt,
            url: image.src,
          });
        } catch {
          /* empty */
        }
      } else {
        navigator.clipboard.writeText(image.src);
      }
    };

    if (!open) return null;

    return (
      <div
        ref={ref}
        data-slot="carousel-lightbox"
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        {...props}
      >
        {}
        <button
          type="button"
          className="absolute top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => onOpenChange(false)}
          aria-label="Close lightbox"
        >
          <IconX className="h-5 w-5" />
        </button>

        {}
        <div className="absolute top-4 left-4 z-50 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>

        {}
        <div className="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 p-1">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-50"
            onClick={() => setZoom((prev) => Math.max(prev - 0.5, 1))}
            disabled={zoom <= 1}
            aria-label="Zoom out"
          >
            <IconZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-12 text-center text-sm text-white">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-50"
            onClick={() => setZoom((prev) => Math.min(prev + 0.5, 4))}
            disabled={zoom >= 4}
            aria-label="Zoom in"
          >
            <IconZoomIn className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-white/30" />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20"
            onClick={() => {
              setZoom(1);
              setPosition({ x: 0, y: 0 });
            }}
            aria-label="Reset zoom"
          >
            <IconMaximize className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20"
            onClick={handleDownload}
            aria-label="Download image"
          >
            <IconDownload className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20"
            onClick={handleShare}
            aria-label="Share image"
          >
            <IconShare className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20"
            onClick={() => setShowKeyboardHelp((prev) => !prev)}
            aria-label="Show keyboard shortcuts"
          >
            <IconKeyboard className="h-4 w-4" />
          </button>
        </div>

        {}
        <button
          type="button"
          className="absolute left-4 top-1/2 z-50 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => {
            setCurrentIndex((prev) =>
              prev > 0 ? prev - 1 : images.length - 1
            );
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
          aria-label="Previous image"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="absolute right-4 top-1/2 z-50 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => {
            setCurrentIndex((prev) =>
              prev < images.length - 1 ? prev + 1 : 0
            );
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
          aria-label="Next image"
        >
          <IconChevronRight className="h-6 w-6" />
        </button>

        {}
        <div
          ref={containerRef}
          className={cn(
            "relative flex h-full w-full items-center justify-center overflow-hidden touch-none",
            zoom > 1 ? "cursor-grab" : "cursor-default",
            isDragging && "cursor-grabbing"
          )}
          style={{
            transform: `translate(${swipeOffset.x}px, ${swipeOffset.y}px)`,
            opacity: 1 - Math.abs(swipeOffset.y) / 500,
            transition:
              swipeOffset.x === 0 && swipeOffset.y === 0
                ? "transform 0.3s ease, opacity 0.3s ease"
                : "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            handleTouchEnd();
            handleDoubleTap();
          }}
        >
          <img
            ref={imageRef}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-h-[85vh] max-w-[90vw] select-none object-contain"
            draggable={false}
          />
        </div>

        {}
        {images[currentIndex].title && (
          <div className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
            {images[currentIndex].title}
          </div>
        )}

        {}
        <div className="absolute bottom-4 left-1/2 z-50 flex max-w-[80vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-white/10 p-2 backdrop-blur-sm">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              tabIndex={index === currentIndex ? 0 : -1}
              className={cn(
                "relative h-12 w-12 shrink-0 overflow-hidden rounded-md border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
                index === currentIndex
                  ? "border-white"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
              onClick={() => {
                setCurrentIndex(index);
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  const prevIndex = index > 0 ? index - 1 : images.length - 1;
                  setCurrentIndex(prevIndex);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                  setTimeout(() => {
                    (
                      e.currentTarget.parentElement?.children[
                        prevIndex
                      ] as HTMLElement
                    )?.focus();
                  }, 0);
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  const nextIndex = index < images.length - 1 ? index + 1 : 0;
                  setCurrentIndex(nextIndex);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                  setTimeout(() => {
                    (
                      e.currentTarget.parentElement?.children[
                        nextIndex
                      ] as HTMLElement
                    )?.focus();
                  }, 0);
                }
              }}
              aria-label={`View ${image.alt}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {}
        {showKeyboardHelp && (
          <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/80">
            <div className="rounded-lg bg-zinc-900 p-6 text-white shadow-xl">
              <h3 className="mb-4 text-lg font-semibold">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">←</kbd>
                  <span>Previous image</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">→</kbd>
                  <span>Next image</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">+</kbd>
                  <span>Zoom in</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">-</kbd>
                  <span>Zoom out</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">0</kbd>
                  <span>Reset zoom</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">Esc</kbd>
                  <span>Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5">?</kbd>
                  <span>Toggle help</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-md bg-white/10 py-2 hover:bg-white/20"
                onClick={() => setShowKeyboardHelp(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CarouselLightbox.displayName = "CarouselLightbox";

const CarouselImage = React.forwardRef<HTMLImageElement, CarouselImageProps>(
  (
    {
      src,
      alt,
      loading = "lazy",
      showSkeleton = true,
      skeletonClassName,
      errorClassName,
      errorContent,
      className,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setError(false);
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setError(true);
      onError?.(e);
    };

    return (
      <div className="relative w-full h-full">
        {isLoading && showSkeleton && (
          <div
            className={cn(
              "absolute inset-0 bg-muted animate-pulse",
              skeletonClassName
            )}
          >
            <IconPhoto className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground/20" />
          </div>
        )}
        {error && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-muted",
              errorClassName
            )}
          >
            {errorContent || (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <IconAlertCircle className="h-8 w-8" />
                <span className="text-sm">Failed to load</span>
              </div>
            )}
          </div>
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover",
            isLoading && "opacity-0",
            error && "hidden",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CarouselImage.displayName = "CarouselImage";

const CarouselCounter = React.forwardRef<HTMLDivElement, CarouselCounterProps>(
  ({ className, ...props }, ref) => {
    const { selectedIndex, slideCount } = useCarousel();

    return (
      <div
        ref={ref}
        data-slot="carousel-counter"
        role="status"
        aria-live="polite"
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {selectedIndex + 1} / {slideCount}
      </div>
    );
  }
);

CarouselCounter.displayName = "CarouselCounter";

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
  CarouselProgressBar,
  CarouselThumbnails,
  CarouselLightbox,
  CarouselImage,
  CarouselCounter,
  useCarousel,
  useCarouselApi,
  useVisibleSlides,
  carouselVariants,
  carouselContentVariants,
  carouselItemVariants,
  carouselButtonVariants,
  carouselDotVariants,
};

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
  CarouselProgressBarProps,
  CarouselThumbnailsProps,
  CarouselLightboxProps,
  CarouselImageProps,
  CarouselCounterProps,
};
