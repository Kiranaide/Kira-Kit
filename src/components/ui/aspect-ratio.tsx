/* oxlint-disable react/only-export-components -- public compound API and variants */
"use client";

import * as React from "react";
import { isStringProp, withOccurrenceKeys } from "@/lib/component-utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { IconPhotoOff, IconPlayerPlay, IconRefresh } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";

const aspectRatioVariants = cva("relative w-full min-w-0 overflow-hidden", {
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
  defaultVariants: { fit: "cover", position: "center" },
});

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

function toRatioValue(ratio: number | AspectRatioPreset): number {
  const value = isStringProp(ratio) ? presetRatios[ratio] : ratio;

  return Number.isFinite(value) && value > 0 ? value : 1;
}

function coordinate(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 50;
}

interface AspectRatioProps
  extends
    Omit<useRender.ComponentProps<"div">, "className">,
    VariantProps<typeof aspectRatioVariants> {
  className?: string;
  ratio?: number | AspectRatioPreset;
  loading?: boolean;
  skeleton?: boolean;
  zoomOnHover?: boolean;
  focalPoint?: { x: number; y: number };
}

function AspectRatio({
  ratio: ratioInput,
  fit: fitInput,
  position: positionInput,
  loading: loadingInput,
  skeleton: skeletonInput,
  zoomOnHover: zoomOnHoverInput,
  focalPoint,
  className,
  children,
  style,
  ref,
  render,
  ...props
}: AspectRatioProps) {
  const { ratio, fit, position, loading, skeleton, zoomOnHover } =
    useAspectRatioOptions({
      ratio: ratioInput,
      fit: fitInput,
      position: positionInput,
      loading: loadingInput,
      skeleton: skeletonInput,
      zoomOnHover: zoomOnHoverInput,
    });

  const reducedMotion = useReducedMotion();

  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  return useRender({
    defaultTagName: "div",
    render,
    ref,
    props: mergeProps<"div">(
      {
        "data-slot": "aspect-ratio",
        "data-loading": loading || undefined,
        "aria-busy": loading || undefined,
        className: cn(
          aspectRatioVariants({ fit, position: focalPoint ? null : position }),
          "aspect-[var(--aspect-ratio)]",
          {
            "[&_img]:object-[var(--aspect-ratio-focal)] [&_video]:object-[var(--aspect-ratio-focal)]":
              focalPoint,
          },
          {
            "motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-200 motion-safe:hover:[&_img]:scale-105 motion-safe:[&_video]:transition-transform motion-safe:[&_video]:duration-200 motion-safe:hover:[&_video]:scale-105":
              zoomOnHover && !reducedMotion,
          },
          className,
        ),
        style: {
          "--aspect-ratio": toRatioValue(ratio),
          ...(focalPoint && {
            "--aspect-ratio-focal": `${coordinate(focalPoint.x)}% ${coordinate(focalPoint.y)}%`,
          }),
          ...style,
        } as React.CSSProperties,
        children: (
          <AspectRatioContent
            loading={loading}
            skeleton={skeleton}
            position={position}
          >
            {children}
          </AspectRatioContent>
        ),
      } as React.ComponentProps<"div">,
      props,
    ),
  });
}

function AspectRatioContent({
  loading,
  skeleton,
  position,
  children,
}: Pick<AspectRatioProps, "loading" | "skeleton" | "position" | "children">) {
  return (
    <>
      <div
        data-slot="aspect-ratio-content"
        aria-hidden={loading || undefined}
        inert={loading || undefined}
        className={cn(
          "absolute inset-0 flex [&>img]:h-full [&>img]:w-full [&>video]:h-full [&>video]:w-full",
          positionAlignClasses[position ?? "center"],
        )}
      >
        {children}
      </div>
      {skeleton && (
        <Skeleton
          data-slot="aspect-ratio-skeleton"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full rounded-none"
        />
      )}
    </>
  );
}

interface ResponsiveAspectRatioProps extends Omit<AspectRatioProps, "ratio"> {
  base: number | AspectRatioPreset;
  sm?: number | AspectRatioPreset;
  md?: number | AspectRatioPreset;
  lg?: number | AspectRatioPreset;
  xl?: number | AspectRatioPreset;
  query?: "viewport" | "container";
}

function ResponsiveAspectRatio({
  base,
  sm,
  md,
  lg,
  xl,
  query = "viewport",
  className,
  style,
  ...props
}: ResponsiveAspectRatioProps) {
  const baseRatio = toRatioValue(base);
  const smRatio = sm === undefined ? baseRatio : toRatioValue(sm);
  const mdRatio = md === undefined ? smRatio : toRatioValue(md);
  const lgRatio = lg === undefined ? mdRatio : toRatioValue(lg);
  const xlRatio = xl === undefined ? lgRatio : toRatioValue(xl);

  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  const frame = (
    <AspectRatio
      {...props}
      data-slot="responsive-aspect-ratio"
      data-query={query}
      ratio={base}
      className={cn(
        query === "container"
          ? "@sm/aspect-ratio:aspect-[var(--aspect-ratio-sm)] @md/aspect-ratio:aspect-[var(--aspect-ratio-md)] @lg/aspect-ratio:aspect-[var(--aspect-ratio-lg)] @xl/aspect-ratio:aspect-[var(--aspect-ratio-xl)]"
          : "sm:aspect-[var(--aspect-ratio-sm)] md:aspect-[var(--aspect-ratio-md)] lg:aspect-[var(--aspect-ratio-lg)] xl:aspect-[var(--aspect-ratio-xl)]",
        className,
      )}
      style={
        {
          "--aspect-ratio-sm": smRatio,
          "--aspect-ratio-md": mdRatio,
          "--aspect-ratio-lg": lgRatio,
          "--aspect-ratio-xl": xlRatio,
          ...style,
        } as React.CSSProperties
      }
    />
  );

  return query === "container" ? (
    <div
      data-slot="aspect-ratio-container"
      className="@container/aspect-ratio w-full min-w-0"
    >
      {frame}
    </div>
  ) : (
    frame
  );
}

type AspectRatioMediaStatus = "loading" | "loaded" | "error";

interface AspectRatioSource {
  srcSet: string;
  media?: string;
  type?: string;
  sizes?: string;
}

interface AspectRatioImageProps extends React.ComponentProps<"img"> {
  placeholderSrc?: string;
  fallback?: React.ReactNode;
  onStatusChange?: (status: AspectRatioMediaStatus) => void;
  sources?: AspectRatioSource[];
}

function AspectRatioImageResource(arg0: AspectRatioImageProps) {
  const model = useAspectRatioImageResourceModel(arg0);

  return <AspectRatioImageResourceView {...model} />;
}

function AspectRatioImage(props: AspectRatioImageProps) {
  const sourceKeys =
    props.sources
      ?.map((source) => `${source.media}:${source.srcSet}`)
      .join("|") ?? "";

  const resourceKey = [props.src ?? "", props.srcSet ?? "", sourceKeys].join(
    "|",
  );

  return <AspectRatioImageResource key={resourceKey} {...props} />;
}

type AspectRatioVideoProps = React.ComponentProps<"video"> & {
  /** Real caption resources supplied by the caller. */
  captions?: Omit<React.ComponentProps<"track">, "kind">[];
};

function AspectRatioVideo({
  className,
  captions,
  children,
  ...props
}: AspectRatioVideoProps) {
  return (
    // oxlint-disable-next-line jsx-a11y/media-has-caption -- This video wrapper accepts real caller-provided caption resources and child tracks; it cannot synthesize a caption URL.
    <video
      data-slot="aspect-ratio-video"
      className={cn("h-full w-full", className)}
      {...props}
    >
      {captions?.map((caption) => (
        <track
          key={`${caption.src}:${caption.srcLang}:${caption.label}`}
          kind="captions"
          {...caption}
        />
      ))}
      {children}
    </video>
  );
}

type AspectRatioEmbedProps = React.ComponentProps<"iframe">;

function AspectRatioEmbed({
  className,
  title = "Embedded content",
  loading = "lazy",
  ...props
}: AspectRatioEmbedProps) {
  return (
    <iframe
      data-slot="aspect-ratio-embed"
      title={title || "Embedded content"}
      loading={loading}
      className={cn("h-full w-full border-0", className)}
      {...props}
    />
  );
}

interface KiraAspectRatioProps extends Omit<AspectRatioProps, "children"> {
  src?: string;
  type?: "image" | "video" | "embed";
  alt?: string;
  placeholderSrc?: string;
  imageProps?: React.ComponentProps<"img">;
  videoProps?: AspectRatioVideoProps;
  embedProps?: React.ComponentProps<"iframe">;
  children?: React.ReactNode;
  sources?: AspectRatioSource[];
  responsive?: Omit<ResponsiveAspectRatioProps, keyof AspectRatioProps>;
  deferEmbed?: boolean;
  posterSrc?: string;
  activateLabel?: string;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void | Promise<void>;
  onMediaStatusChange?: (status: AspectRatioMediaStatus) => void;
}

function KiraAspectRatio(input: KiraAspectRatioProps) {
  const model = useKiraAspectRatioModel(input);

  return <KiraAspectRatioFrame {...model} />;
}

type KiraAspectRatioOptions = ReturnType<typeof useKiraAspectRatioOptions> &
  ReturnType<typeof useKiraAspectRatioOptions2>;

function aspectRatioResourceIdentity(
  input: KiraAspectRatioProps,
  type: KiraAspectRatioOptions["type"],
) {
  const sourceSets =
    input.sources?.map((source) => source.srcSet).join("|") ?? "";

  return `${type}|${input.src ?? ""}|${input.imageProps?.srcSet ?? ""}|${input.embedProps?.srcDoc ?? ""}|${sourceSets}`;
}

function isAspectRatioSourceAvailable(
  input: KiraAspectRatioProps,
  type: KiraAspectRatioOptions["type"],
) {
  return Boolean(
    input.src ||
    (type === "embed" && input.embedProps?.srcDoc) ||
    (type === "video" && input.videoProps?.children),
  );
}

function isAspectRatioBusy(
  loading: boolean,
  resource: ReturnType<typeof useAspectRatioResource>,
  custom: boolean,
  available: boolean,
  deferred: boolean,
  videoNeedsActivation: boolean,
) {
  return (
    loading ||
    resource.retrying ||
    (!custom &&
      available &&
      !deferred &&
      !videoNeedsActivation &&
      resource.status === "loading")
  );
}

function useKiraAspectRatioModel(input: KiraAspectRatioProps) {
  const display = useKiraAspectRatioOptions(input);
  const loading = useKiraAspectRatioOptions2(input);
  const options = { ...display, ...loading };
  const identity = aspectRatioResourceIdentity(input, options.type);

  const resource = useAspectRatioResource(
    identity,
    input.onRetry,
    input.onMediaStatusChange,
  );

  const custom = input.children !== undefined;
  const available = isAspectRatioSourceAvailable(input, options.type);

  const deferred =
    options.type === "embed" &&
    options.deferEmbed &&
    !resource.activated &&
    available &&
    !custom;

  const videoNeedsActivation =
    options.type === "video" && input.videoProps?.preload === "none";

  const busy = isAspectRatioBusy(
    options.loading,
    resource,
    custom,
    available,
    deferred,
    videoNeedsActivation,
  );

  React.useEffect(
    () =>
      aspectRatioUseEffect2(
        busy,
        resource.loadedEmbed,
        resource.focusEmbedAfterActivation,
      ),
    [busy, resource.loadedEmbed, resource.focusEmbedAfterActivation],
  );

  return {
    input,
    options,
    resource,
    custom,
    available,
    deferred,
    busy,
    resourceKey: `${identity}:${resource.revision}`,
  };
}

type AspectRatioRetryControls = {
  retryRequest: React.RefObject<number>;
  retryPending: React.RefObject<boolean>;
  setRetrying: React.Dispatch<React.SetStateAction<boolean>>;
  setRetryError: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<AspectRatioMediaStatus>>;
  setRevision: React.Dispatch<React.SetStateAction<number>>;
};

async function retryAspectRatioResource(
  onRetry: KiraAspectRatioProps["onRetry"],
  controls: AspectRatioRetryControls,
) {
  const {
    retryRequest,
    retryPending,
    setRetrying,
    setRetryError,
    setStatus,
    setRevision,
  } = controls;

  if (retryPending.current) return;
  const attempt = ++retryRequest.current;
  retryPending.current = true;
  setRetrying(true);
  setRetryError("");

  try {
    await onRetry?.();

    if (attempt !== retryRequest.current) return;
    setStatus("loading");
    setRevision((value) => value + 1);
  } catch (error) {
    if (attempt === retryRequest.current)
      setRetryError(
        error instanceof Error ? error.message : "Retry failed. Try again.",
      );
  } finally {
    if (attempt === retryRequest.current) {
      retryPending.current = false;
      setRetrying(false);
    }
  }
}

function useAspectRatioResource(
  identity: string,
  onRetry: KiraAspectRatioProps["onRetry"],
  onMediaStatusChange: KiraAspectRatioProps["onMediaStatusChange"],
) {
  const [previousSource, setPreviousSource] = React.useState(identity);
  const [status, setStatus] = React.useState<AspectRatioMediaStatus>("loading");
  const [revision, setRevision] = React.useState(0);
  const [activated, setActivated] = React.useState(false);
  const [retrying, setRetrying] = React.useState(false);
  const [retryError, setRetryError] = React.useState("");

  const [loadedEmbed, setLoadedEmbed] =
    React.useState<HTMLIFrameElement | null>(null);

  const focusEmbedAfterActivation = React.useRef(false);
  const retryRequest = React.useRef(0);
  const retryPending = React.useRef(false);

  if (identity !== previousSource) {
    setPreviousSource(identity);
    setStatus("loading");
    setRevision(0);
    setActivated(false);
    setRetrying(false);
    setRetryError("");
  }

  React.useEffect(
    () =>
      aspectRatioUseEffect(
        retryRequest,
        retryPending,
        focusEmbedAfterActivation,
      ),
    [identity],
  );

  const updateStatus = (next: AspectRatioMediaStatus) => {
    setStatus(next);
    onMediaStatusChange?.(next);
  };

  const retry = () =>
    retryAspectRatioResource(onRetry, {
      retryRequest,
      retryPending,
      setRetrying,
      setRetryError,
      setStatus,
      setRevision,
    });

  const activate = () => {
    focusEmbedAfterActivation.current = true;
    setActivated(true);
    setStatus("loading");
  };

  return {
    status,
    revision,
    activated,
    retrying,
    retryError,
    loadedEmbed,
    setLoadedEmbed,
    focusEmbedAfterActivation,
    updateStatus,
    retry,
    activate,
  };
}

type KiraAspectRatioModel = ReturnType<typeof useKiraAspectRatioModel>;

function KiraAspectRatioMedia(model: KiraAspectRatioModel) {
  const { input, options, custom, available, deferred, resourceKey, resource } =
    model;

  if (custom) return input.children;

  if (!available) return null;

  if (deferred) return <AspectRatioEmbedPreview {...model} />;

  if (options.type === "video") return <KiraAspectRatioVideoMedia {...model} />;

  if (options.type === "embed") return <KiraAspectRatioEmbedMedia {...model} />;

  return (
    <AspectRatioImage
      key={resourceKey}
      {...input.imageProps}
      src={input.src}
      alt={options.alt}
      placeholderSrc={input.placeholderSrc}
      sources={input.sources}
      fallback={null}
      onStatusChange={resource.updateStatus}
    />
  );
}

function AspectRatioEmbedPreview({
  input,
  options,
  resource,
}: KiraAspectRatioModel) {
  return (
    <div
      data-slot="aspect-ratio-embed-preview"
      className="relative flex h-full w-full items-center justify-center bg-muted"
    >
      {input.posterSrc && <AspectRatioImage src={input.posterSrc} alt="" />}
      <div
        data-slot="aspect-ratio-embed-control"
        className="absolute inset-0 flex items-center justify-center p-4"
      >
        <Button
          data-slot="aspect-ratio-embed-activate"
          variant="secondary"
          className="min-h-11 max-w-full whitespace-normal"
          onClick={resource.activate}
        >
          <IconPlayerPlay className="size-4" aria-hidden="true" />
          {options.activateLabel}
        </Button>
      </div>
    </div>
  );
}

function KiraAspectRatioVideoMedia({
  input,
  resourceKey,
  resource,
}: KiraAspectRatioModel) {
  const { videoProps } = input;

  return (
    <AspectRatioVideo
      key={resourceKey}
      {...videoProps}
      src={input.src}
      controls={videoProps?.controls ?? true}
      preload={videoProps?.preload ?? "metadata"}
      onLoadedMetadata={(event) => {
        resource.updateStatus("loaded");
        videoProps?.onLoadedMetadata?.(event);
      }}
      onError={(event) => {
        resource.updateStatus("error");
        videoProps?.onError?.(event);
      }}
    />
  );
}

function KiraAspectRatioEmbedMedia({
  input,
  options,
  resourceKey,
  resource,
}: KiraAspectRatioModel) {
  const { embedProps } = input;

  return (
    <AspectRatioEmbed
      key={resourceKey}
      {...embedProps}
      src={input.src}
      title={embedProps?.title || options.alt || "Embedded content"}
      onLoad={(event) => {
        resource.updateStatus("loaded");
        resource.setLoadedEmbed(event.currentTarget);
        embedProps?.onLoad?.(event);
      }}
      onError={(event) => {
        resource.updateStatus("error");
        embedProps?.onError?.(event);
      }}
    />
  );
}

function aspectRatioFrameNativeProps({
  src: _src,
  type: _type,
  alt: _alt,
  placeholderSrc: _placeholderSrc,
  imageProps: _imageProps,
  videoProps: _videoProps,
  embedProps: _embedProps,
  children: _children,
  sources: _sources,
  responsive: _responsive,
  deferEmbed: _deferEmbed,
  posterSrc: _posterSrc,
  activateLabel: _activateLabel,
  errorMessage: _errorMessage,
  emptyMessage: _emptyMessage,
  onRetry: _onRetry,
  onMediaStatusChange: _onMediaStatusChange,
  loading: _loading,
  skeleton: _skeleton,
  ...props
}: KiraAspectRatioProps) {
  return props;
}

function KiraAspectRatioFrame(model: KiraAspectRatioModel) {
  const { input, options, resource, custom, available, deferred, busy } = model;

  const frameProps = {
    ...aspectRatioFrameNativeProps(input),
    loading: busy,
    skeleton:
      input.skeleton ?? (options.loading || (options.type !== "image" && busy)),
    "data-state": aspectRatioValueValue(
      custom,
      available,
      deferred,
      resource.status,
    ),
  };

  const content = (
    <>
      <KiraAspectRatioMedia {...model} />
      {!custom && (!available || resource.status === "error") && !deferred && (
        <AspectRatioStateMessageView
          available={available}
          errorMessage={options.errorMessage}
          emptyMessage={options.emptyMessage}
          retryError={resource.retryError}
          onRetry={input.onRetry}
          retrying={resource.retrying}
          retry={resource.retry}
        />
      )}
    </>
  );

  return input.responsive ? (
    <ResponsiveAspectRatio {...frameProps} {...input.responsive}>
      {content}
    </ResponsiveAspectRatio>
  ) : (
    <AspectRatio {...frameProps}>{content}</AspectRatio>
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
  AspectRatioMediaStatus,
  AspectRatioSource,
};

function aspectRatioValueValue(
  custom: boolean,
  available: boolean,
  deferred: boolean,
  status: AspectRatioMediaStatus,
) {
  if (custom) {
    return "custom";
  }

  if (available) {
    if (deferred) {
      return "deferred";
    }

    return status;
  }

  return "empty";
}

function resolveAspectRatioOptions({
  ratio = "1:1",
  fit = "cover",
  position = "center",
  loading = false,
  skeleton = loading,
  zoomOnHover = false,
}: {
  ratio?: AspectRatioProps["ratio"];
  fit?: AspectRatioProps["fit"];
  position?: AspectRatioProps["position"];
  loading?: AspectRatioProps["loading"];
  skeleton?: AspectRatioProps["skeleton"];
  zoomOnHover?: AspectRatioProps["zoomOnHover"];
}) {
  return { ratio, fit, position, loading, skeleton, zoomOnHover };
}

function resolveKiraAspectRatioOptions({
  type = "image",
  alt = "",
  deferEmbed = true,
  activateLabel = "Load embedded content",
  errorMessage = "Media could not be loaded.",
  emptyMessage = "No media selected",
}: {
  type?: KiraAspectRatioProps["type"];
  alt?: KiraAspectRatioProps["alt"];
  deferEmbed?: KiraAspectRatioProps["deferEmbed"];
  activateLabel?: KiraAspectRatioProps["activateLabel"];
  errorMessage?: KiraAspectRatioProps["errorMessage"];
  emptyMessage?: KiraAspectRatioProps["emptyMessage"];
}) {
  return { type, alt, deferEmbed, activateLabel, errorMessage, emptyMessage };
}

function resolveKiraAspectRatioOptions2({
  loading = false,
}: {
  loading?: KiraAspectRatioProps["loading"];
}) {
  return { loading };
}

function AspectRatioStateMessageView({
  available,
  errorMessage,
  emptyMessage,
  retryError,
  onRetry,
  retrying,
  retry,
}: {
  available: boolean;
  errorMessage: string;
  emptyMessage: string;
  retryError: string;
  onRetry: (() => void | Promise<void>) | undefined;
  retrying: boolean;
  retry: () => Promise<void>;
}) {
  return (
    <div
      data-slot={available ? "aspect-ratio-recovery" : "aspect-ratio-empty"}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted p-4 text-center text-sm text-muted-foreground"
    >
      <IconPhotoOff aria-hidden="true" className="size-6" />
      <span data-slot="aspect-ratio-state-message">
        {available ? errorMessage : emptyMessage}
      </span>
      {retryError && (
        <span
          data-slot="aspect-ratio-retry-error"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
          role="status"
          className="text-destructive"
        >
          {retryError}
        </span>
      )}
      {(available || onRetry) && (
        <Button
          data-slot="aspect-ratio-retry"
          variant="outline"
          size="sm"
          disabled={retrying}
          aria-busy={retrying || undefined}
          className="min-h-11"
          onClick={() => {
            void retry();
          }}
        >
          <IconRefresh className="size-4" aria-hidden="true" />
          {retrying ? "Retrying…" : "Try again"}
        </Button>
      )}
    </div>
  );
}

function useAspectRatioImageResourceModel({
  src,
  srcSet,
  alt = "",
  placeholderSrc,
  fallback,
  onStatusChange,
  onLoad,
  onError,
  className,
  style,
  ref,
  sources,
  loading = "lazy",
  decoding = "async",
  ...props
}: AspectRatioImageProps) {
  const [status, setStatus] = React.useState<AspectRatioMediaStatus>(
    src || srcSet ? "loading" : "error",
  );

  const reducedMotion = useReducedMotion();

  const notifyStatus = React.useEffectEvent((value: AspectRatioMediaStatus) =>
    onStatusChange?.(value),
  );

  React.useEffect(() => {
    notifyStatus(status);
  }, [status]);

  const imageRef = React.useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && (image.currentSrc || image.src))
      setStatus(image.naturalWidth > 0 ? "loaded" : "error");
  }, []);

  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  const image = useRender({
    defaultTagName: "img",
    ref: [ref ?? null, imageRef],
    props: mergeProps<"img">(
      {
        "data-slot": "aspect-ratio-image",
        src,
        srcSet,
        alt,
        loading,
        decoding,
        className: cn(
          "absolute inset-0 h-full w-full",
          { "opacity-0": status !== "loaded" },
          { invisible: status === "error" },
          {
            "transition-opacity duration-200 motion-reduce:transition-none":
              !reducedMotion,
          },
          className,
        ),
        style,
        onLoad: (event) => {
          setStatus("loaded");
          onLoad?.(event);
        },
        onError: (event) => {
          setStatus("error");
          onError?.(event);
        },
      } as React.ComponentProps<"img">,
      props,
    ),
  });

  return { status, placeholderSrc, sources, image, fallback, alt };
}

function AspectRatioImageResourceView({
  status,
  placeholderSrc,
  sources,
  image,
  fallback,
  alt,
}: ReturnType<typeof useAspectRatioImageResourceModel>) {
  return (
    <span
      data-slot="aspect-ratio-image-wrapper"
      data-state={status}
      aria-busy={status === "loading" || undefined}
      className="relative block h-full w-full overflow-hidden"
    >
      {status === "loading" &&
        (placeholderSrc ? (
          <img
            data-slot="aspect-ratio-placeholder"
            src={placeholderSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-105 blur-md"
          />
        ) : (
          <Skeleton
            data-slot="aspect-ratio-image-skeleton"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full rounded-none"
          />
        ))}
      {sources?.length ? (
        <picture
          data-slot="aspect-ratio-picture"
          className="block h-full w-full"
        >
          {withOccurrenceKeys(
            sources,
            (source) =>
              `${source.media}:${source.type}:${source.srcSet}:${source.sizes}`,
          ).map(({ item: source, key }) => (
            <source data-slot="aspect-ratio-source" key={key} {...source} />
          ))}
          {image}
        </picture>
      ) : (
        image
      )}
      {status === "error" && (
        <span
          data-slot="aspect-ratio-image-error"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted p-4 text-center text-sm text-muted-foreground"
        >
          {fallback === undefined ? (
            <>
              <IconPhotoOff aria-hidden="true" className="size-6" />
              <span>{alt ? `Unable to load ${alt}` : "Image unavailable"}</span>
            </>
          ) : (
            fallback
          )}
        </span>
      )}
    </span>
  );
}

function useAspectRatioOptions({
  ratio: ratioInput,
  fit: fitInput,
  position: positionInput,
  loading: loadingInput,
  skeleton: skeletonInput,
  zoomOnHover: zoomOnHoverInput,
}: Parameters<typeof resolveAspectRatioOptions>[0]) {
  return React.useMemo(
    () =>
      resolveAspectRatioOptions({
        ratio: ratioInput,
        fit: fitInput,
        position: positionInput,
        loading: loadingInput,
        skeleton: skeletonInput,
        zoomOnHover: zoomOnHoverInput,
      }),
    [
      ratioInput,
      fitInput,
      positionInput,
      loadingInput,
      skeletonInput,
      zoomOnHoverInput,
    ],
  );
}

function useKiraAspectRatioOptions({
  type: typeInput,
  alt: altInput,
  deferEmbed: deferEmbedInput,
  activateLabel: activateLabelInput,
  errorMessage: errorMessageInput,
  emptyMessage: emptyMessageInput,
}: Parameters<typeof resolveKiraAspectRatioOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraAspectRatioOptions({
        type: typeInput,
        alt: altInput,
        deferEmbed: deferEmbedInput,
        activateLabel: activateLabelInput,
        errorMessage: errorMessageInput,
        emptyMessage: emptyMessageInput,
      }),
    [
      typeInput,
      altInput,
      deferEmbedInput,
      activateLabelInput,
      errorMessageInput,
      emptyMessageInput,
    ],
  );
}

function useKiraAspectRatioOptions2({
  loading: loadingInput,
}: Parameters<typeof resolveKiraAspectRatioOptions2>[0]) {
  return React.useMemo(
    () => resolveKiraAspectRatioOptions2({ loading: loadingInput }),
    [loadingInput],
  );
}

function aspectRatioUseEffect(
  retryRequest: React.RefObject<number>,
  retryPending: React.RefObject<boolean>,
  focusEmbedAfterActivation: React.RefObject<boolean>,
) {
  retryRequest.current += 1;
  retryPending.current = false;

  return () => {
    retryRequest.current += 1;
    retryPending.current = false;
    focusEmbedAfterActivation.current = false;
  };
}

function aspectRatioUseEffect2(
  busy: boolean,
  loadedEmbed: HTMLIFrameElement | null,
  focusEmbedAfterActivation: React.RefObject<boolean>,
) {
  if (busy || !loadedEmbed || !focusEmbedAfterActivation.current) return;
  focusEmbedAfterActivation.current = false;
  const document = loadedEmbed.ownerDocument;

  // Loading makes the media inert. Transfer focus after that state clears,
  // unless the reader has already moved to another control while waiting.
  if (loadedEmbed.isConnected && document.activeElement === document.body)
    loadedEmbed.focus();
}
