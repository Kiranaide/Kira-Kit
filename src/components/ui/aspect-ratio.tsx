"use client";

/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const aspectRatioVariants = cva("relative w-full overflow-hidden", {
  variants: {
    fit: {
      cover: "[&_img]:object-cover [&_video]:object-cover",
      contain: "[&_img]:object-contain [&_video]:object-contain",
      fill: "[&_img]:object-fill [&_video]:object-fill",
      none: "[&_img]:object-none [&_video]:object-none",
      scaleDown: "[&_img]:object-scale-down [&_video]:object-scale-down",
    },
    position: {
      center: "[&_img]:object-center [&_video]:object-center",
      top: "[&_img]:object-top [&_video]:object-top",
      bottom: "[&_img]:object-bottom [&_video]:object-bottom",
      left: "[&_img]:object-left [&_video]:object-left",
      right: "[&_img]:object-right [&_video]:object-right",
      "top-left": "[&_img]:object-left-top [&_video]:object-left-top",
      "top-right": "[&_img]:object-right-top [&_video]:object-right-top",
      "bottom-left": "[&_img]:object-left-bottom [&_video]:object-left-bottom",
      "bottom-right":
        "[&_img]:object-right-bottom [&_video]:object-right-bottom",
    },
  },
  defaultVariants: {
    fit: "cover",
    position: "center",
  },
});

// Flex alignment for the content wrapper. `fit`/`object-position` only
// control how an actual `<img>`/`<video>` is cropped inside its box; this
// controls where *any* child (including plain non-media content) sits
// within the aspect-ratio box, since the wrapper is a flex container.
const positionAlignClasses: Record<
  NonNullable<VariantProps<typeof aspectRatioVariants>["position"]>,
  string
> = {
  center: "items-center justify-center",
  top: "items-start justify-center",
  bottom: "items-end justify-center",
  left: "items-center justify-start",
  right: "items-center justify-end",
  "top-left": "items-start justify-start",
  "top-right": "items-start justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-right": "items-end justify-end",
};

type AspectRatioPreset =
  "1:1" | "4:3" | "3:2" | "16:9" | "9:16" | "21:9" | "3:4" | "2:3";

const presetRatios: Record<AspectRatioPreset, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "21:9": 21 / 9,
  "3:4": 3 / 4,
  "2:3": 2 / 3,
};

// Static classes so Tailwind's JIT keeps them (interpolated arbitrary values
// would be purged). Base + per-breakpoint maps drive ResponsiveAspectRatio.
const aspectClass: Record<AspectRatioPreset, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "21:9": "aspect-[21/9]",
  "3:4": "aspect-[3/4]",
  "2:3": "aspect-[2/3]",
};
const aspectClassMd: Record<AspectRatioPreset, string> = {
  "1:1": "md:aspect-square",
  "4:3": "md:aspect-[4/3]",
  "3:2": "md:aspect-[3/2]",
  "16:9": "md:aspect-video",
  "9:16": "md:aspect-[9/16]",
  "21:9": "md:aspect-[21/9]",
  "3:4": "md:aspect-[3/4]",
  "2:3": "md:aspect-[2/3]",
};
const aspectClassLg: Record<AspectRatioPreset, string> = {
  "1:1": "lg:aspect-square",
  "4:3": "lg:aspect-[4/3]",
  "3:2": "lg:aspect-[3/2]",
  "16:9": "lg:aspect-video",
  "9:16": "lg:aspect-[9/16]",
  "21:9": "lg:aspect-[21/9]",
  "3:4": "lg:aspect-[3/4]",
  "2:3": "lg:aspect-[2/3]",
};
const aspectClassXl: Record<AspectRatioPreset, string> = {
  "1:1": "xl:aspect-square",
  "4:3": "xl:aspect-[4/3]",
  "3:2": "xl:aspect-[3/2]",
  "16:9": "xl:aspect-video",
  "9:16": "xl:aspect-[9/16]",
  "21:9": "xl:aspect-[21/9]",
  "3:4": "xl:aspect-[3/4]",
  "2:3": "xl:aspect-[2/3]",
};

/** Resolve a ratio prop to a numeric value for the CSS `aspect-ratio` property. */
function toRatioValue(ratio: number | AspectRatioPreset): number {
  return typeof ratio === "string" ? presetRatios[ratio] : ratio;
}

interface AspectRatioProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aspectRatioVariants> {
  ratio?: number | AspectRatioPreset;
  loading?: boolean;
  skeleton?: boolean;
  /** Scale the media up slightly on hover. Respects reduced motion. */
  zoomOnHover?: boolean;
}

function AspectRatio({
  ratio = "1:1",
  fit = "cover",
  position = "center",
  className,
  children,
  loading = false,
  skeleton = loading,
  zoomOnHover = false,
  style,
  ...props
}: AspectRatioProps) {
  const reducedMotion = useReducedMotion();
  // Use a static preset class when possible (better than inline for known
  // ratios), otherwise fall back to the inline aspect-ratio property.
  const presetClass =
    typeof ratio === "string" ? aspectClass[ratio] : undefined;

  return (
    <div
      data-slot="aspect-ratio"
      className={cn(
        "relative w-full overflow-hidden",
        presetClass,
        aspectRatioVariants({ fit, position }),
        zoomOnHover &&
          !reducedMotion &&
          "[&_img]:transition-transform [&_img]:duration-300 hover:[&_img]:scale-105 [&_video]:transition-transform [&_video]:duration-300 hover:[&_video]:scale-105",
        className,
      )}
      style={{
        ...(presetClass ? {} : { aspectRatio: toRatioValue(ratio) }),
        ...style,
      }}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 flex [&>img]:h-full [&>img]:w-full [&>video]:h-full [&>video]:w-full",
          positionAlignClasses[position ?? "center"],
        )}
      >
        {skeleton && (
          <div
            className={cn(
              "absolute inset-0 bg-muted",
              !reducedMotion && "animate-pulse",
            )}
          />
        )}
        {!loading && children}
      </div>
    </div>
  );
}

interface ResponsiveAspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  base: number | AspectRatioPreset;
  md?: number | AspectRatioPreset;
  lg?: number | AspectRatioPreset;
  xl?: number | AspectRatioPreset;
  fit?: NonNullable<VariantProps<typeof aspectRatioVariants>["fit"]>;
  loading?: boolean;
}

function ResponsiveAspectRatio({
  base,
  md,
  lg,
  xl,
  fit = "cover",
  loading = false,
  className,
  children,
  style,
  ...props
}: ResponsiveAspectRatioProps) {
  const reducedMotion = useReducedMotion();

  // Prefer static breakpoint classes for preset ratios (JIT-safe). Numeric
  // ratios fall back to a CSS var per breakpoint via a scoped media rule.
  const basePreset = typeof base === "string" ? aspectClass[base] : undefined;
  const mdPreset = typeof md === "string" ? aspectClassMd[md] : undefined;
  const lgPreset = typeof lg === "string" ? aspectClassLg[lg] : undefined;
  const xlPreset = typeof xl === "string" ? aspectClassXl[xl] : undefined;

  const inlineStyle: React.CSSProperties & Record<string, string | number> = {
    ...style,
  };
  if (!basePreset) inlineStyle.aspectRatio = toRatioValue(base);

  return (
    <div
      data-slot="responsive-aspect-ratio"
      className={cn(
        "relative w-full overflow-hidden",
        basePreset,
        mdPreset,
        lgPreset,
        xlPreset,
        aspectRatioVariants({ fit }),
        className,
      )}
      style={inlineStyle}
      {...props}
    >
      <div className="absolute inset-0 flex [&>img]:h-full [&>img]:w-full [&>video]:h-full [&>video]:w-full">
        {loading && (
          <div
            className={cn(
              "absolute inset-0 bg-muted",
              !reducedMotion && "animate-pulse",
            )}
          />
        )}
        {!loading && children}
      </div>
    </div>
  );
}

// =============================================================================
// AspectRatioImage — image with blur-up load state
// =============================================================================

interface AspectRatioImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Low-res placeholder shown blurred until the full image loads. */
  placeholderSrc?: string;
}

function AspectRatioImage({
  className,
  onLoad,
  placeholderSrc,
  style,
  ...props
}: AspectRatioImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <img
      data-slot="aspect-ratio-image"
      className={cn(
        "h-full w-full",
        !reducedMotion && "transition-[filter,opacity] duration-500",
        !loaded && "scale-[1.02] blur-md opacity-0",
        loaded && "blur-0 opacity-100",
        className,
      )}
      style={
        placeholderSrc && !loaded
          ? {
              backgroundImage: `url(${placeholderSrc})`,
              backgroundSize: "cover",
              ...style,
            }
          : style
      }
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      {...props}
    />
  );
}

// =============================================================================
// AspectRatioVideo / AspectRatioEmbed — media wrappers filling the ratio box
// =============================================================================

type AspectRatioVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

function AspectRatioVideo({ className, ...props }: AspectRatioVideoProps) {
  return (
    <video
      data-slot="aspect-ratio-video"
      className={cn("h-full w-full", className)}
      {...props}
    />
  );
}

type AspectRatioEmbedProps = React.IframeHTMLAttributes<HTMLIFrameElement>;

function AspectRatioEmbed({ className, ...props }: AspectRatioEmbedProps) {
  return (
    <iframe
      data-slot="aspect-ratio-embed"
      className={cn("h-full w-full border-0", className)}
      {...props}
    />
  );
}

// =============================================================================
// KiraAspectRatio — one prop-driven media component
// =============================================================================

interface KiraAspectRatioProps extends Omit<AspectRatioProps, "children"> {
  /** Media source. When `type` is "image" a blur-up image is rendered. */
  src?: string;
  type?: "image" | "video" | "embed";
  alt?: string;
  placeholderSrc?: string;
  /** Passed to <video> (controls/autoPlay/muted/loop/poster). */
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  /** Passed to the <iframe> for embeds. */
  embedProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  children?: React.ReactNode;
}

function KiraAspectRatio({
  src,
  type = "image",
  alt = "",
  placeholderSrc,
  videoProps,
  embedProps,
  loading = false,
  children,
  ...aspectProps
}: KiraAspectRatioProps) {
  const buildMedia = () => {
    if (children) return children;
    if (!src) return null;
    if (type === "video") {
      return <AspectRatioVideo src={src} {...videoProps} />;
    }
    if (type === "embed") {
      return <AspectRatioEmbed src={src} title={alt} {...embedProps} />;
    }
    return (
      <AspectRatioImage src={src} alt={alt} placeholderSrc={placeholderSrc} />
    );
  };

  return (
    <AspectRatio loading={loading} {...aspectProps}>
      {buildMedia()}
    </AspectRatio>
  );
}

export {
  AspectRatio,
  ResponsiveAspectRatio,
  AspectRatioImage,
  AspectRatioVideo,
  AspectRatioEmbed,
  KiraAspectRatio,
  aspectRatioVariants,
  presetRatios,
};
export type {
  AspectRatioProps,
  ResponsiveAspectRatioProps,
  AspectRatioImageProps,
  AspectRatioVideoProps,
  AspectRatioEmbedProps,
  KiraAspectRatioProps,
  AspectRatioPreset,
};
