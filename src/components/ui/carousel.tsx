"use client";

import * as React from "react";
import { omitComponentProps } from "@/lib/component-native-props";
import { resolveComponentDefaults } from "@/lib/component-defaults";
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
import useEmblaCarousel, {
  type EmblaViewportRefType,
} from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { isCallbackProp } from "@/lib/component-prop-guards";

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
      fade: "basis-full absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500",
      peek: "basis-[85%] pl-4",
      zoom: "basis-full pl-4 motion-safe:transition-transform motion-safe:duration-300",
      flip: "basis-full pl-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const carouselButtonVariants = cva(
  "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background/80 p-0 text-foreground shadow-md backdrop-blur-sm transition-[background-color,box-shadow,color] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
  },
);

const carouselDotVariants = cva(
  // kira-kit-ignore layout-transitions: dot pill stretch (w-2 to w-4) is the intended indicator animation
  "relative inline-flex items-center justify-center rounded-full transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      state: {
        // kira-kit-ignore target-size: 8px visual dot inside the 44px CarouselDot button target
        inactive: "h-2 w-2 bg-muted-foreground/50 hover:bg-muted-foreground/70",
        active: "h-2 w-4 bg-primary",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  },
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
  onInit?: (api: EmblaCarouselType) => void;
  onResize?: () => void;
  onSettle?: () => void;
  onCarouselScroll?: (progress: number) => void;
  setApi?: (api: EmblaCarouselType) => void;
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

interface CarouselProgressBarProps extends React.ComponentPropsWithoutRef<"div"> {
  animated?: boolean;
}

/** Image identity follows content, including repeated sources, rather than position. */
function carouselImageEntries<T extends { src: string; alt: string }>(
  images: T[],
) {
  const occurrences = new Map<string, number>();

  return images.map((image) => {
    const source = JSON.stringify([image.src, image.alt]);
    const occurrence = occurrences.get(source) ?? 0;
    occurrences.set(source, occurrence + 1);

    return { image, id: JSON.stringify([source, occurrence]) };
  });
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
  emblaApi: EmblaCarouselType | undefined;
  emblaRef: EmblaViewportRefType;
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
    "default" | "cards" | "fade" | "peek" | "zoom" | "flip" | null | undefined;
  prefersReducedMotion: boolean;
  isAutoPlaying: boolean;
  isDragging: boolean;
  toggleAutoplay: () => void;
  setApi?: (api: EmblaCarouselType) => void;
};

const CarouselContext = React.createContext<CarouselContextValue | undefined>(
  undefined,
);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component");
  }

  return context;
};

function useCarouselApi() {
  const [api, setApi] = React.useState<EmblaCarouselType | undefined>();

  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  const scrollTo = React.useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
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

function useCarouselNavigation(api: EmblaCarouselType | undefined) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => undefined;
      const events = ["select", "reInit", "resize", "settle"] as const;
      events.forEach((event) => api.on(event, onStoreChange));

      return () => {
        events.forEach((event) => api.off(event, onStoreChange));
      };
    },
    [api],
  );

  const selectedIndex = React.useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0,
  );

  const slideCount = React.useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  );

  const canScrollPrev = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );

  const canScrollNext = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  );

  return { selectedIndex, slideCount, canScrollPrev, canScrollNext };
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (input0, input1) => {
    const state0 = useCarouselSetup(input0, input1);
    const state1 = useCarouselState2(state0);
    const state2 = useCarouselState3(state1);
    const state3 = useCarouselActions(state2);

    return renderCarousel(state3);
  },
);

Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, ...props }, ref) => {
    const carouselContext = useCarousel();
    const { emblaRef, orientation, variant } = carouselContext;

    const indexedChildren = React.useMemo(() => {
      const cursor = { index: 0 };

      const injectIndex = (node: React.ReactNode): React.ReactNode => {
        if (!React.isValidElement(node)) return node;

        if (node.type === React.Fragment) {
          // SAFETY: Fragment children are only React elements by the same
          // isValidElement guard in injectIndex before recursion.
          const fragmentChildren = React.Children.map(
            (node as React.ReactElement<{ children: React.ReactNode }>).props
              .children,
            injectIndex,
          );

          return (
            <React.Fragment key={node.key}>{fragmentChildren}</React.Fragment>
          );
        }

        if (node.type === CarouselItem) {
          const index = cursor.index;
          cursor.index += 1;

          // SAFETY: node is a valid CarouselItem element (isValidElement guard
          // above), so cloning with an extra index prop is type-safe.
          return React.cloneElement(
            node as React.ReactElement<{ index: number }>,
            { index },
          );
        }

        return node;
      };

      return React.Children.map(children, injectIndex);
    }, [children]);

    return (
      <div
        ref={emblaRef}
        data-slot="carousel-viewport"
        className="overflow-hidden"
      >
        <div
          ref={ref}
          data-slot="carousel-content"
          className={cn(
            carouselContentVariants({ orientation, variant, className }),
          )}
          {...props}
        >
          {indexedChildren}
        </div>
      </div>
    );
  },
);

CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, variant, index = 0, children, ...props }, ref) => {
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
          overwrite: true,
        });
      }

      if (isFlip) {
        const rotationY = isActive ? 0 : 180;
        gsap.to(itemRef.current, {
          rotationY,
          duration: 0.6,
          ease: "back.out(1.7)",
          overwrite: true,
        });
      }
    }, [isActive, isZoom, isFlip, prefersReducedMotion]);

    return (
      <RenderCarouselItemPart1
        {...{
          itemRef,
          ref,
          carouselId,
          index,
          slideCount,
          isFade,
          isActive,
          itemVariant,
          className,
          isFlip,
          props,
          children,
        }}
      />
    );
  },
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
            : "top-4 left-1/2 -translate-x-1/2 rotate-90"),
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
              : "bottom-4 left-1/2 -translate-x-1/2 rotate-90"),
        )}
        onClick={scrollNext}
        aria-label="Go to next slide"
        {...props}
      >
        <IconChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  },
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
          Array.from({ length: dotCount }, (_, snapIndex) => snapIndex).map(
            (snapIndex) => (
              <CarouselDot
                key={snapIndex}
                index={snapIndex}
                isActive={snapIndex === selectedIndex}
                onClick={() => scrollTo(snapIndex)}
              />
            ),
          )}
      </div>
    );
  },
);

CarouselDots.displayName = "CarouselDots";

const CarouselDot = React.forwardRef<HTMLButtonElement, CarouselDotProps>(
  ({ className, index, isActive, onClick, ...props }, ref) => {
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
              className,
            }),
          )}
        />
      </button>
    );
  },
);

CarouselDot.displayName = "CarouselDot";

const CarouselAutoplayButton = React.forwardRef<
  HTMLButtonElement,
  CarouselAutoplayButtonProps
>(
  (
    { className, isPlaying: isPlayingProp, onToggle, onClick, ...props },
    ref,
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
          "inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/80 p-0 text-foreground shadow-md backdrop-blur-sm transition-[background-color,box-shadow,color] hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
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
  },
);

CarouselAutoplayButton.displayName = "CarouselAutoplayButton";

const CarouselProgressBar = React.forwardRef<
  HTMLDivElement,
  CarouselProgressBarProps
>(({ className, animated = true, ...props }, ref) => {
  const { emblaApi, prefersReducedMotion } = useCarousel();
  const barRef = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLDivElement>(null);
  const scrollRafRef = React.useRef(0);

  // Scroll progress is painted imperatively: setState per scroll frame caused
  // a React render storm (visible flicker at fast scroll) racing embla's own
  // transform updates. aria-valuenow syncs on discrete events only.
  React.useEffect(() => {
    if (!emblaApi) return;

    const paint = () => {
      const progress = emblaApi.scrollProgress();

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`;
      }

      barRef.current?.setAttribute(
        "aria-valuenow",
        String(Math.round(progress * 100)),
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = requestAnimationFrame(paint);
    };

    paint();

    emblaApi.on("scroll", onScroll);
    emblaApi.on("select", paint);
    emblaApi.on("resize", paint);
    emblaApi.on("reInit", paint);

    return () => {
      cancelAnimationFrame(scrollRafRef.current);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("select", paint);
      emblaApi.off("resize", paint);
      emblaApi.off("reInit", paint);
    };
  }, [emblaApi]);

  return (
    <div
      ref={(node) => {
        barRef.current = node;

        if (isCallbackProp(ref)) ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="carousel-progress-bar"
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This custom progress display retains its visual geometry and ARIA value attributes; native progress has different rendering.
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-label="Carousel scroll progress"
      {...props}
    >
      <div
        ref={fillRef}
        className={cn(
          "h-full w-full origin-left rounded-full bg-primary",
          // transform-only transition: interruptible, no layout, §5-safe.
          animated &&
            !prefersReducedMotion &&
            "transition-transform duration-150 ease-out",
        )}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
});

CarouselProgressBar.displayName = "CarouselProgressBar";

const CarouselThumbnails = React.forwardRef<
  HTMLDivElement,
  CarouselThumbnailsProps
>(({ className, images, ...props }, ref) => {
  const { selectedIndex, scrollTo, prefersReducedMotion } = useCarousel();
  const thumbnailsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (thumbnailsRef.current) {
      // SAFETY: children[selectedIndex] is a button element rendered by this
      // component at that index; HTMLCollection indexing matches render order.
      const thumbnail = thumbnailsRef.current.children[
        selectedIndex
      ] as HTMLElement;

      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      data-slot="carousel-thumbnails"
      className={cn(
        "flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-muted",
        className,
      )}
      role="tablist"
      aria-label="Thumbnail navigation"
      {...props}
    >
      <div ref={thumbnailsRef} className="flex gap-2">
        {carouselImageEntries(images).map(({ image, id }, index) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`View ${image.alt}`}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-[border-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              index === selectedIndex
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent opacity-60 hover:opacity-100",
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
>((input0, input1) => {
  const state0 = useCarouselLightboxSetup(input0, input1);
  const state1 = useCarouselLightboxState2(state0);
  const state2 = useCarouselLightboxState3(state1);
  const state3 = useCarouselLightboxState4(state2);
  const state4 = useCarouselLightboxState5(state3);
  const state5 = useCarouselLightboxActions(state4);

  return renderCarouselLightbox(state5);
});

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
    ref,
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
      <div data-slot="carousel-image" className="relative w-full h-full">
        {isLoading && showSkeleton && (
          <div
            className={cn(
              "absolute inset-0 bg-muted animate-pulse",
              skeletonClassName,
            )}
          >
            <IconPhoto className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground/20" />
          </div>
        )}
        {error && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-muted",
              errorClassName,
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
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

CarouselImage.displayName = "CarouselImage";

const CarouselCounter = React.forwardRef<HTMLDivElement, CarouselCounterProps>(
  ({ className, ...props }, ref) => {
    const { selectedIndex, slideCount } = useCarousel();

    return (
      <div
        ref={ref}
        data-slot="carousel-counter"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
        role="status"
        aria-live="polite"
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {selectedIndex + 1} / {slideCount}
      </div>
    );
  },
);

CarouselCounter.displayName = "CarouselCounter";

interface KiraCarouselProps extends Omit<CarouselProps, "children"> {
  items: React.ReactNode[];
  /** Render navigation arrows overlaying the slides. */
  arrows?: boolean;
  /** Render dot indicators under the slides. */
  dots?: boolean;
  /** Render a real scroll-progress bar under the slides. */
  progressBar?: boolean;
  /** Render a "1 / N" live counter. */
  counter?: boolean;
  /** Enable autoplay and render a play/pause button. */
  autoplay?: boolean;
  /** Thumbnail strip driven by `thumbnailImages`. */
  thumbnails?: boolean;
  thumbnailImages?: { src: string; alt: string }[];
  itemClassName?: string;
}

/**
 * One-import composed carousel: slides + arrows + dots + progress + counter +
 * autoplay + thumbnails behind boolean switches. CarouselLightbox stays
 * standalone (modal concerns don't compose into an inline region).
 */
function KiraCarousel(inputProps: KiraCarouselProps) {
  const {
    items,
    arrows,
    dots,
    progressBar,
    counter,
    autoplay,
    thumbnails,
    thumbnailImages,
    itemClassName,
    className,
    ...props
  } = resolveComponentDefaults(inputProps, {
    arrows: true,
    dots: true,
    progressBar: false,
    counter: false,
    autoplay: false,
    thumbnails: false,
  });

  return renderKiraCarouselSectionPart6({
    className,
    autoplay,
    props,
    items,
    itemClassName,
    arrows,
    counter,
    dots,
    progressBar,
    thumbnails,
    thumbnailImages,
  });
}

KiraCarousel.displayName = "KiraCarousel";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselDot,
  CarouselAutoplayButton,
  CarouselProgressBar,
  CarouselThumbnails,
  CarouselLightbox,
  CarouselImage,
  CarouselCounter,
  KiraCarousel,
  useCarousel,
  useCarouselApi,
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
  CarouselProgressBarProps,
  CarouselThumbnailsProps,
  CarouselLightboxProps,
  CarouselImageProps,
  CarouselCounterProps,
  KiraCarouselProps,
};

type renderCarouselItemPart1Args = {
  itemRef: React.RefObject<HTMLDivElement | null>;
  ref: React.ForwardedRef<HTMLDivElement>;
  carouselId: string;
  index: number;
  slideCount: number;
  isFade: boolean;
  isActive: boolean;
  itemVariant: "default" | "cards" | "fade" | "peek" | "zoom" | "flip";
  className: string | undefined;
  isFlip: boolean;
  props: React.ComponentPropsWithoutRef<"div">;
  children: React.ReactNode;
};

function RenderCarouselItemPart1({
  itemRef,
  ref,
  carouselId,
  index,
  slideCount,
  isFade,
  isActive,
  itemVariant,
  className,
  isFlip,
  props,
  children,
}: renderCarouselItemPart1Args) {
  return (
    <div
      ref={(node) => {
        itemRef.current = node;

        if (isCallbackProp(ref)) ref(node);
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
        carouselItemVariants({ variant: itemVariant, className }),
        isFade && (isActive ? "opacity-100 z-10" : "opacity-0 z-0"),
        isFlip && "transform-style-3d backface-hidden",
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type renderCarouseltsxSectionPart2Args = {
  chromeButtonClass: "inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-50";
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  handleDownload: () => Promise<void>;
  handleShare: () => Promise<void>;
  setShowKeyboardHelp: React.Dispatch<React.SetStateAction<boolean>>;
};

function renderCarouseltsxSectionPart2({
  chromeButtonClass,
  setZoom,
  zoom,
  setPosition,
  handleDownload,
  handleShare,
  setShowKeyboardHelp,
}: renderCarouseltsxSectionPart2Args) {
  return (
    <div className="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 p-1">
      <button
        type="button"
        className={chromeButtonClass}
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
        className={chromeButtonClass}
        onClick={() => setZoom((prev) => Math.min(prev + 0.5, 4))}
        disabled={zoom >= 4}
        aria-label="Zoom in"
      >
        <IconZoomIn className="h-4 w-4" />
      </button>
      <div className="mx-1 h-4 w-px bg-white/30" />
      <button
        type="button"
        className={chromeButtonClass}
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
        className={chromeButtonClass}
        onClick={handleDownload}
        aria-label="Download image"
      >
        <IconDownload className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={chromeButtonClass}
        onClick={handleShare}
        aria-label="Share image"
      >
        <IconShare className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={chromeButtonClass}
        onClick={() => setShowKeyboardHelp((prev) => !prev)}
        aria-label="Show keyboard shortcuts"
      >
        <IconKeyboard className="h-4 w-4" />
      </button>
    </div>
  );
}

type renderCarouseltsxSectionPart3Args = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  isDragging: boolean;
  swipeOffset: { x: number; y: number };
  prefersReducedMotion: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleDoubleTap: () => void;
  currentIndex: number;
  images: { src: string; alt: string; title?: string }[];
  imageRef: React.RefObject<HTMLImageElement | null>;
};

function renderCarouseltsxSectionPart3({
  containerRef,
  zoom,
  isDragging,
  swipeOffset,
  prefersReducedMotion,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleDoubleTap,
  currentIndex,
  images,
  imageRef,
}: renderCarouseltsxSectionPart3Args) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- This image surface provides drag, pinch, and swipe gestures; the enclosing dialog provides equivalent keyboard navigation and zoom controls.
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden touch-none",
        zoom > 1 ? "cursor-grab" : "cursor-default",
        isDragging && "cursor-grabbing",
      )}
      style={{
        opacity: 1 - Math.abs(swipeOffset.y) / 500,
        transition:
          prefersReducedMotion || (swipeOffset.x === 0 && swipeOffset.y === 0)
            ? "none"
            : "opacity 0.3s ease",
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
      {/* Sliding track: real slide transition instead of a hard
                      src swap. translateX = -index*100% + live swipe offset;
                      zoom/pan transforms apply to the active image only. */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(calc(${-currentIndex * 100}% + ${swipeOffset.x}px))`,
          transition:
            prefersReducedMotion || swipeOffset.x !== 0
              ? "none"
              : "transform 0.3s ease",
        }}
      >
        {carouselImageEntries(images).map(({ image, id }, index) => (
          <div
            key={id}
            className="flex h-full w-full shrink-0 items-center justify-center"
            aria-hidden={index !== currentIndex}
          >
            <img
              ref={index === currentIndex ? imageRef : undefined}
              src={image.src}
              alt={image.alt}
              className="max-h-[85vh] max-w-[90vw] select-none object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type renderCarouseltsxSectionPart4Args = {
  images: { src: string; alt: string; title?: string }[];
  currentIndex: number;
  goToImage: (index: number) => void;
};

function renderCarouseltsxSectionPart4({
  images,
  currentIndex,
  goToImage,
}: renderCarouseltsxSectionPart4Args) {
  return (
    <div className="absolute bottom-4 left-1/2 z-50 flex max-w-[80vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-white/10 p-2 backdrop-blur-sm">
      {carouselImageEntries(images).map(({ image, id }, index) => (
        <button
          key={id}
          type="button"
          tabIndex={index === currentIndex ? 0 : -1}
          className={cn(
            "relative h-12 w-12 shrink-0 overflow-hidden rounded-md border-2 transition-[border-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
            index === currentIndex
              ? "border-white"
              : "border-transparent opacity-50 hover:opacity-100",
          )}
          onClick={() => goToImage(index)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();

              const prevIndex = (index - 1 + images.length) % images.length;

              goToImage(prevIndex);
              setTimeout(() => {
                // SAFETY: parentElement is this thumbnail strip,
                // its children are exactly the rendered buttons
                // in index order; optional-chains guard removals.
                (
                  e.currentTarget.parentElement?.children[
                    prevIndex
                  ] as HTMLElement
                )?.focus();
              }, 0);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              const nextIndex = (index + 1) % images.length;
              goToImage(nextIndex);
              setTimeout(() => {
                // SAFETY: parentElement is this thumbnail strip,
                // its children are exactly the rendered buttons
                // in index order; optional-chains guard removals.
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
  );
}

type renderCarouseltsxSectionPart5Args = {
  setShowKeyboardHelp: React.Dispatch<React.SetStateAction<boolean>>;
};

function renderCarouseltsxSectionPart5({
  setShowKeyboardHelp,
}: renderCarouseltsxSectionPart5Args) {
  return (
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
  );
}

type renderKiraCarouselSectionPart6Args = {
  className: KiraCarouselProps["className"];
  autoplay: Exclude<KiraCarouselProps["autoplay"], undefined>;
  props: Omit<
    KiraCarouselProps,
    | "items"
    | "arrows"
    | "dots"
    | "progressBar"
    | "counter"
    | "autoplay"
    | "thumbnails"
    | "thumbnailImages"
    | "itemClassName"
    | "className"
  >;
  items: KiraCarouselProps["items"];
  itemClassName: KiraCarouselProps["itemClassName"];
  arrows: Exclude<KiraCarouselProps["arrows"], undefined>;
  counter: Exclude<KiraCarouselProps["counter"], undefined>;
  dots: Exclude<KiraCarouselProps["dots"], undefined>;
  progressBar: Exclude<KiraCarouselProps["progressBar"], undefined>;
  thumbnails: Exclude<KiraCarouselProps["thumbnails"], undefined>;
  thumbnailImages: KiraCarouselProps["thumbnailImages"];
};

function renderKiraCarouselSectionPart6({
  className,
  autoplay,
  props,
  items,
  itemClassName,
  arrows,
  counter,
  dots,
  progressBar,
  thumbnails,
  thumbnailImages,
}: renderKiraCarouselSectionPart6Args) {
  return (
    <Carousel className={className} autoplay={autoplay} {...props}>
      <CarouselContent>
        {React.Children.map(items, (item) => (
          <CarouselItem className={itemClassName}>{item}</CarouselItem>
        ))}
      </CarouselContent>
      {arrows && <CarouselPrevious />}
      {arrows && <CarouselNext />}
      {counter && <CarouselCounter className="mt-2 text-center" />}
      {dots && <CarouselDots className="mt-4" />}
      {progressBar && <CarouselProgressBar className="mt-2" />}
      {autoplay && (
        <div className="mt-2 flex justify-center">
          <CarouselAutoplayButton />
        </div>
      )}
      {thumbnails && thumbnailImages && (
        <CarouselThumbnails className="mt-2" images={thumbnailImages} />
      )}
    </Carousel>
  );
}

function useCarouselSetup(
  inputProps: CarouselProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { resolvedProps, props } = resolveCarouselSetupProps(inputProps);

  const {
    orientation,
    loop,
    align,
    autoplay,
    autoplayInterval,
    pauseOnHover,
    pauseOnFocus,
    onAutoplayChange,
  } = resolvedProps;

  const carouselId = useId();

  const prefersReducedMotion = useReducedMotion();

  const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoplay);

  const [isDragging, setIsDragging] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const liveRegionRef = React.useRef<HTMLDivElement>(null);

  const dragAnimationRef = React.useRef<gsap.core.Tween | null>(null);

  const engine = useCarouselEngine({
    orientation: orientation ?? "horizontal",
    loop,
    align,
    autoplay,
    autoplayInterval,
    pauseOnHover,
    pauseOnFocus,
    prefersReducedMotion,
  });

  const {
    autoplayPlugin,
    emblaRef,
    emblaApi,
    selectedIndex,
    slideCount,
    canScrollPrev,
    canScrollNext,
  } = engine;

  // Mirror the plugin's play state into React so CarouselAutoplayButton and
  // consumers stay in sync regardless of what stopped/started autoplay
  // (hover, focus loss, toggle, reduced motion). Plugin events are exposed
  // on the embla API, not the plugin object.
  React.useEffect(() => {
    if (!emblaApi) return;

    const onPlay = () => {
      setIsAutoPlaying(true);
      onAutoplayChange?.(true);
    };

    const onStop = () => {
      setIsAutoPlaying(false);
      onAutoplayChange?.(false);
    };

    emblaApi.on("autoplay:play", onPlay).on("autoplay:stop", onStop);

    return () => {
      emblaApi.off("autoplay:play", onPlay).off("autoplay:stop", onStop);
    };
  }, [emblaApi, onAutoplayChange]);

  return {
    ...resolvedProps,
    props,
    ref,
    carouselId,
    prefersReducedMotion,
    isAutoPlaying,
    setIsAutoPlaying,
    isDragging,
    setIsDragging,
    containerRef,
    liveRegionRef,
    dragAnimationRef,
    autoplayPlugin,
    emblaRef,
    emblaApi,
    selectedIndex,
    slideCount,
    canScrollPrev,
    canScrollNext,
  };
}

function resolveCarouselSetupProps(inputProps: CarouselProps) {
  const resolvedProps = resolveComponentDefaults(inputProps, {
    variant: "default",
    orientation: "horizontal",
    loop: false,
    align: "start",
    autoplay: false,
    autoplayInterval: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
  });
  // SAFETY: These are the props consumed by Carousel setup rather than the root element.

  const props = omitComponentProps(resolvedProps, [
    "className",
    "variant",
    "orientation",
    "loop",
    "align",
    "autoplay",
    "autoplayInterval",
    "pauseOnHover",
    "pauseOnFocus",
    "onSlideChange",
    "onAutoplayChange",
    "onInit",
    "onResize",
    "onSettle",
    "onCarouselScroll",
    "setApi",
    "children",
  ] as const);

  return { resolvedProps, props };
}

function useCarouselEngine({
  orientation,
  loop,
  align,
  autoplay,
  autoplayInterval,
  pauseOnHover,
  pauseOnFocus,
  prefersReducedMotion,
}: {
  orientation: "horizontal" | "vertical";
  loop: boolean;
  align: "start" | "center" | "end";
  autoplay: boolean;
  autoplayInterval: number;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  prefersReducedMotion: boolean;
}) {
  // Stable plugin identity preserves the Embla scroll position across renders.
  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        playOnInit: autoplay && !prefersReducedMotion,
        delay: autoplayInterval,
        stopOnInteraction: false,
        stopOnMouseEnter: pauseOnHover,
        stopOnFocusIn: pauseOnFocus,
      }),
    [
      autoplay,
      autoplayInterval,
      pauseOnHover,
      pauseOnFocus,
      prefersReducedMotion,
    ],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align,
      axis: orientation === "horizontal" ? "x" : "y",
      duration: prefersReducedMotion ? 0 : 25,
    },
    [autoplayPlugin],
  );

  const navigation = useCarouselNavigation(emblaApi);

  return { autoplayPlugin, emblaRef, emblaApi, ...navigation };
}

function useCarouselState2(state: ReturnType<typeof useCarouselSetup>) {
  const {
    autoplay,
    onSlideChange,
    onInit,
    onResize,
    onSettle,
    onCarouselScroll,
    setApi,
    prefersReducedMotion,
    isAutoPlaying,
    liveRegionRef,
    autoplayPlugin,
    emblaApi,
  } = state;

  // Prop/reduced-motion changes drive the plugin; user toggles go through
  // toggleAutoplay (plugin events update isAutoPlaying). isAutoPlaying is
  // deliberately not read here so this effect never fights the user.
  // Guard on emblaApi: plugin methods throw before init.
  React.useEffect(() => {
    if (!emblaApi) return;

    if (prefersReducedMotion || !autoplay) {
      autoplayPlugin.stop();
    } else {
      autoplayPlugin.play();
    }
  }, [emblaApi, autoplayPlugin, autoplay, prefersReducedMotion]);

  useCarouselVisibilityPause({
    autoplayPlugin,
    autoplay,
    isAutoPlaying,
    prefersReducedMotion,
  });

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      onSlideChange?.(index);

      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Slide ${index + 1} of ${emblaApi.scrollSnapList().length}`;
      }
    };

    const onResizeHandler = () => {
      // canScroll flags are width-dependent: after a resize/reInit (e.g.
      // carousel becomes visible in a formerly zero-width tab) the buttons
      // would stay disabled until the next manual scroll otherwise.
      onResize?.();
    };

    const onSettleHandler = () => {
      // Fast drags can settle out-of-order with select; re-sync edge flags
      // so prev/next never go stale mid-gesture.
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
    liveRegionRef,
  ]);

  return { ...state };
}

function useCarouselVisibilityPause({
  autoplayPlugin,
  autoplay,
  isAutoPlaying,
  prefersReducedMotion,
}: {
  autoplayPlugin: ReturnType<typeof useCarouselEngine>["autoplayPlugin"];
  autoplay: boolean;
  isAutoPlaying: boolean;
  prefersReducedMotion: boolean;
}) {
  const wasPlayingRef = React.useRef(false);

  React.useEffect(() => {
    const handleVisibility = () => {
      if (!autoplay || prefersReducedMotion) return;

      if (document.hidden) {
        wasPlayingRef.current = isAutoPlaying;
        autoplayPlugin.stop();
      } else if (wasPlayingRef.current) {
        wasPlayingRef.current = false;
        autoplayPlugin.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [autoplayPlugin, autoplay, isAutoPlaying, prefersReducedMotion]);
}

function useCarouselState3(state: ReturnType<typeof useCarouselState2>) {
  const {
    orientation,
    pauseOnHover,
    onAutoplayChange,
    prefersReducedMotion,
    isAutoPlaying,
    setIsAutoPlaying,
    autoplayPlugin,
    emblaApi,
  } = state;

  const handleMouseEnter = React.useCallback(() => {
    if (pauseOnHover) autoplayPlugin.stop();
  }, [pauseOnHover, autoplayPlugin]);

  const handleMouseLeave = React.useCallback(() => {
    if (pauseOnHover && !prefersReducedMotion) autoplayPlugin.play();
  }, [pauseOnHover, autoplayPlugin, prefersReducedMotion]);

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
    [emblaApi, orientation],
  );

  const toggleAutoplay = React.useCallback(() => {
    if (isAutoPlaying) {
      autoplayPlugin.stop();
      setIsAutoPlaying(false);
      onAutoplayChange?.(false);
    } else if (!prefersReducedMotion) {
      autoplayPlugin.play();
      setIsAutoPlaying(true);
      onAutoplayChange?.(true);
    }
  }, [
    isAutoPlaying,
    autoplayPlugin,
    onAutoplayChange,
    prefersReducedMotion,
    setIsAutoPlaying,
  ]);

  return {
    ...state,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
    toggleAutoplay,
  };
}

function useCarouselActions(state: ReturnType<typeof useCarouselState3>) {
  const {
    prefersReducedMotion,
    setIsDragging,
    containerRef,
    dragAnimationRef,
    emblaApi,
  } = state;

  const scrollPrev = React.useCallback(
    () => emblaApi?.scrollPrev(),
    [emblaApi],
  );

  const scrollNext = React.useCallback(
    () => emblaApi?.scrollNext(),
    [emblaApi],
  );

  const scrollTo = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useGSAP(
    () => {
      if (!emblaApi || prefersReducedMotion) return;

      // Press feedback targets the VIEWPORT wrapper, never the translated
      // container: both GSAP and embla write `transform`, so a tween tail
      // from a press could overwrite embla's momentum/snap position and
      // freeze the carousel half-way between slides.
      const viewportNode = emblaApi.rootNode();

      const handlePointerDown = () => {
        setIsDragging(true);

        if (dragAnimationRef.current) dragAnimationRef.current.kill();
        dragAnimationRef.current = gsap.to(viewportNode, {
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
          dragAnimationRef.current = gsap.to(viewportNode, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        }
      };

      containerRef.current?.addEventListener("pointerdown", handlePointerDown);
      containerRef.current?.addEventListener("pointerup", handlePointerUp);

      return () => {
        containerRef.current?.removeEventListener(
          "pointerdown",
          handlePointerDown,
        );
        containerRef.current?.removeEventListener("pointerup", handlePointerUp);
      };
    },
    { scope: containerRef, dependencies: [emblaApi, prefersReducedMotion] },
  );

  return { ...state, scrollPrev, scrollNext, scrollTo };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderCarousel({
  className,
  variant,
  orientation,
  setApi,
  children,
  props,
  ref,
  carouselId,
  prefersReducedMotion,
  isAutoPlaying,
  isDragging,
  containerRef,
  liveRegionRef,
  emblaRef,
  emblaApi,
  selectedIndex,
  slideCount,
  canScrollPrev,
  canScrollNext,
  handleMouseEnter,
  handleMouseLeave,
  handleKeyDown,
  toggleAutoplay,
  scrollPrev,
  scrollNext,
  scrollTo,
}: ReturnType<typeof useCarouselActions>) {
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
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- The carousel region delegates arrow-key navigation and hover autoplay control; individual slides and navigation buttons retain their own interaction semantics. */}
      <div
        ref={(node) => {
          containerRef.current = node;

          if (isCallbackProp(ref)) ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="carousel"
        className={cn(carouselVariants({ variant, orientation, className }))}

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The named region preserves the component's div root, layout, and public DOM ref contract.
        role="region"
        aria-roledescription="carousel"
        aria-label={props["aria-label"] || "Image carousel"}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

          // SAFETY: isValidElement is checked above, so the node is a
          // React element and its props can be inspected.
          const isContentNode = (node: React.ReactNode): boolean => {
            if (!React.isValidElement(node)) return false;

            if (node.type === CarouselContent) return true;

            // SAFETY: isValidElement returned true for this node, so it is
            // a React element whose props are safe to inspect.
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
              (child.type === CarouselPrevious || child.type === CarouselNext),
          );

          const rest = childArray.filter(
            (child) => child !== main && !overlayNav.includes(child),
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

function useCarouselLightboxSetup(
  {
    className,
    images,
    initialIndex = 0,
    open,
    onOpenChange,
    ...props
  }: CarouselLightboxProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { emblaApi, prefersReducedMotion } = useCarousel();

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const [zoom, setZoom] = React.useState(1);

  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = React.useState(false);

  const [showKeyboardHelp, setShowKeyboardHelp] = React.useState(false);

  const [swipeOffset, setSwipeOffset] = React.useState({ x: 0, y: 0 });

  const imageRef = React.useRef<HTMLImageElement>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const dragStartRef = React.useRef({ x: 0, y: 0 });

  const touchStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);

  const initialPinchDistanceRef = React.useRef<number | null>(null);

  const initialZoomRef = React.useRef<number>(1);

  useResetCarouselLightboxSession({
    open,
    initialIndex,
    setCurrentIndex,
    setZoom,
    setPosition,
    setSwipeOffset,
  });

  // Single navigation entry point: advances the lightbox index AND scrolls
  // the underlying carousel to the matching slide, so closing the lightbox
  // leaves the carousel on the image you were viewing.
  const goToImage = React.useCallback(
    (index: number) => {
      const next = ((index % images.length) + images.length) % images.length;

      setCurrentIndex(next);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      emblaApi?.scrollTo(next);
    },
    [emblaApi, images.length],
  );

  return {
    className,
    images,
    open,
    onOpenChange,
    props,
    ref,
    prefersReducedMotion,
    currentIndex,
    zoom,
    setZoom,
    position,
    setPosition,
    isDragging,
    setIsDragging,
    showKeyboardHelp,
    setShowKeyboardHelp,
    swipeOffset,
    setSwipeOffset,
    imageRef,
    containerRef,
    dragStartRef,
    touchStartRef,
    initialPinchDistanceRef,
    initialZoomRef,
    goToImage,
  };
}

function useResetCarouselLightboxSession({
  open,
  initialIndex,
  setCurrentIndex,
  setZoom,
  setPosition,
  setSwipeOffset,
}: {
  open: boolean | undefined;
  initialIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setSwipeOffset: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}) {
  const [previousSession, setPreviousSession] = React.useState({
    open,
    initialIndex,
  });

  if (
    open === previousSession.open &&
    Object.is(initialIndex, previousSession.initialIndex)
  )
    return;
  setPreviousSession({ open, initialIndex });

  if (!open) return;
  setCurrentIndex(initialIndex);
  setZoom(1);
  setPosition({ x: 0, y: 0 });
  setSwipeOffset({ x: 0, y: 0 });
}

function useCarouselLightboxState2(
  state: ReturnType<typeof useCarouselLightboxSetup>,
) {
  const {
    zoom,
    setZoom,
    position,
    setPosition,
    setSwipeOffset,
    touchStartRef,
    initialPinchDistanceRef,
    initialZoomRef,
  } = state;

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
          e.touches[0].clientY - e.touches[1].clientY,
        );

        initialPinchDistanceRef.current = distance;
        initialZoomRef.current = zoom;
      }
    },
    [zoom, initialZoomRef, touchStartRef, initialPinchDistanceRef],
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
          e.touches[0].clientY - e.touches[1].clientY,
        );

        const scale = distance / initialPinchDistanceRef.current;

        const newZoom = Math.min(
          Math.max(initialZoomRef.current * scale, 1),
          4,
        );

        setZoom(newZoom);

        if (newZoom === 1) setPosition({ x: 0, y: 0 });
      } else if (e.touches.length === 1 && zoom > 1 && touchStartRef.current) {
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
    },
    [
      zoom,
      position,
      touchStartRef,
      setPosition,
      setZoom,
      initialPinchDistanceRef,
      initialZoomRef,
      setSwipeOffset,
    ],
  );

  return { ...state, handleTouchStart, handleTouchMove };
}

function useCarouselLightboxState3(
  state: ReturnType<typeof useCarouselLightboxState2>,
) {
  const {
    onOpenChange,
    currentIndex,
    zoom,
    setZoom,
    setPosition,
    swipeOffset,
    setSwipeOffset,
    touchStartRef,
    initialPinchDistanceRef,
    goToImage,
  } = state;

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
        (Math.abs(deltaY) > SWIPE_THRESHOLD ||
          velocityY > VELOCITY_THRESHOLD) &&
        Math.abs(deltaY) > Math.abs(deltaX)
      ) {
        onOpenChange(false);
        setSwipeOffset({ x: 0, y: 0 });
        touchStartRef.current = null;
        initialPinchDistanceRef.current = null;

        return;
      }

      if (
        Math.abs(deltaX) > SWIPE_THRESHOLD ||
        velocityX > VELOCITY_THRESHOLD
      ) {
        goToImage(deltaX > 0 ? currentIndex - 1 : currentIndex + 1);
      }
    }

    setSwipeOffset({ x: 0, y: 0 });
    touchStartRef.current = null;
    initialPinchDistanceRef.current = null;
  }, [
    zoom,
    swipeOffset,
    onOpenChange,
    goToImage,
    currentIndex,
    setSwipeOffset,
    initialPinchDistanceRef,
    touchStartRef,
  ]);

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
  }, [zoom, setPosition, setZoom]);

  return { ...state, handleTouchEnd, handleDoubleTap };
}

function useCarouselLightboxState4(
  state: ReturnType<typeof useCarouselLightboxState3>,
) {
  const {
    currentIndex,
    zoom,
    setZoom,
    position,
    setPosition,
    setIsDragging,
    setShowKeyboardHelp,
    dragStartRef,
    goToImage,
  } = state;

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToImage(currentIndex - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          goToImage(currentIndex + 1);
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
    },
    [goToImage, currentIndex, setZoom, setPosition, setShowKeyboardHelp],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  return { ...state, handleKeyDown, handleMouseDown };
}

function useCarouselLightboxState5(
  state: ReturnType<typeof useCarouselLightboxState4>,
) {
  const {
    images,
    prefersReducedMotion,
    currentIndex,
    zoom,
    position,
    setPosition,
    isDragging,
    setIsDragging,
    imageRef,
    dragStartRef,
  } = state;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
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
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      }
    },
    { dependencies: [zoom, position.x, position.y, prefersReducedMotion] },
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

  return { ...state, handleMouseMove, handleMouseUp, handleDownload };
}

function useCarouselLightboxActions(
  state: ReturnType<typeof useCarouselLightboxState5>,
) {
  const {
    images,
    onOpenChange,
    currentIndex,
    zoom,
    setZoom,
    setPosition,
    setShowKeyboardHelp,
    goToImage,
    handleDownload,
  } = state;

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

  const chromeButtonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-50";

  const lightboxChrome = (
    <>
      <button
        type="button"
        className="absolute top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => onOpenChange(false)}
        aria-label="Close lightbox"
      >
        <IconX className="h-5 w-5" />
      </button>
      <div className="absolute top-4 left-4 z-50 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
        {currentIndex + 1} / {images.length}
      </div>
      {renderCarouseltsxSectionPart2({
        chromeButtonClass,
        setZoom,
        zoom,
        setPosition,
        handleDownload,
        handleShare,
        setShowKeyboardHelp,
      })}
      <button
        type="button"
        className="absolute left-4 top-1/2 z-50 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => goToImage(currentIndex - 1)}
        aria-label="Previous image"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 z-50 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => goToImage(currentIndex + 1)}
        aria-label="Next image"
      >
        <IconChevronRight className="h-6 w-6" />
      </button>
    </>
  );

  return { ...state, lightboxChrome };
}

function renderCarouselLightbox({
  className,
  images,
  open,
  onOpenChange,
  props,
  ref,
  prefersReducedMotion,
  currentIndex,
  zoom,
  isDragging,
  showKeyboardHelp,
  setShowKeyboardHelp,
  swipeOffset,
  imageRef,
  containerRef,
  goToImage,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleDoubleTap,
  handleKeyDown,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  lightboxChrome,
}: ReturnType<typeof useCarouselLightboxActions>) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="carousel-lightbox-backdrop"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        />
        <DialogPrimitive.Popup
          ref={ref}
          data-slot="carousel-lightbox"
          className={cn("fixed inset-0 z-50 outline-none", className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto relative flex h-full w-full items-center justify-center">
              {lightboxChrome}
              {renderCarouseltsxSectionPart3({
                containerRef,
                zoom,
                isDragging,
                swipeOffset,
                prefersReducedMotion,
                handleMouseDown,
                handleMouseMove,
                handleMouseUp,
                handleTouchStart,
                handleTouchMove,
                handleTouchEnd,
                handleDoubleTap,
                currentIndex,
                images,
                imageRef,
              })}
              {images[currentIndex].title && (
                <div className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
                  {images[currentIndex].title}
                </div>
              )}
              {renderCarouseltsxSectionPart4({
                images,
                currentIndex,
                goToImage,
              })}
            </div>
          </div>
          {showKeyboardHelp &&
            renderCarouseltsxSectionPart5({ setShowKeyboardHelp })}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
