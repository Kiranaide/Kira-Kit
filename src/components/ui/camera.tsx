/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
/* kira-kit-ignore-file raw-colors: canvas overlay stroke/scan-line colours are user-configurable drawing data, not theme styling */
"use client";

import * as React from "react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCamera,
  IconCameraOff,
  IconCameraRotate,
  IconCheck,
  IconPhoto,
  IconVideo,
  IconSquare,
  IconBolt,
  IconBoltOff,
  IconClock,
  IconSettings,
  IconAspectRatio,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
  IconGrid3x3,
  IconGrid4x4,
  IconGridDots,
  IconLayoutGrid,
  IconSlash,
  IconX,
  IconAlertTriangle,
  IconAlertCircle,
  IconRefresh,
  IconExternalLink,
  IconLoader2,
  IconMicrophone,
  IconMicrophoneOff,
} from "@tabler/icons-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { KiraSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type {
  CameraError,
  CameraFacingMode,
  CameraMode,
  CameraStatus,
  CaptureResult,
  CameraTimerDuration,
  CameraGridType,
  CameraGridConfig,
  CameraAspectRatio,
  CameraSettingsValues,
  CameraFocusIndicatorStyle,
  CameraVoiceCommand,
  DocumentType,
  CameraGuideConfig,
  CameraScanOverlayPreset,
  CameraScanOverlayConfig,
} from "@/lib/camera/types";
import {
  HAPTIC_PATTERNS,
  STATUS_ANNOUNCEMENTS,
  KEYBOARD_SHORTCUTS,
  KEYBOARD_DESCRIPTIONS,
  TIMER_DURATIONS,
  ASPECT_RATIOS,
  QUALITY_OPTIONS,
  GRID_OPTIONS,
  CAMERA_DEFAULT_SETTINGS,
  CAMERA_DEFAULT_GRID,
  CAMERA_DEFAULT_FOCUS,
  CAMERA_DEFAULT_ZOOM,
  SCAN_OVERLAY_DEFAULTS,
} from "@/lib/camera/constants";
import { getPermissionHelpLink } from "@/lib/camera/utils";
import {
  useCamera,
  type UseCameraOptions,
  type UseCameraReturn,
} from "@/hooks/use-camera";

function subscribeCameraVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);

  return () => document.removeEventListener("visibilitychange", notify);
}

function cameraPageVisible() {
  return typeof document !== "undefined" && !document.hidden;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function useCameraPageVisible() {
  return React.useSyncExternalStore(
    subscribeCameraVisibility,
    cameraPageVisible,
    () => false,
  );
}

const keyboardShortcuts = new Map<string, readonly string[]>(
  Object.entries(KEYBOARD_SHORTCUTS).map(([action, key]) => [action, [key]]),
);

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (isFunctionProp(ref)) {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}

import { getGuidePreset, type GuidePreset } from "@/lib/camera/guide-presets";
import { isFunctionProp } from "@/components/ui/prop-guards";

type CameraActions = Pick<
  UseCameraReturn,
  | "start"
  | "stop"
  | "capture"
  | "startRecording"
  | "stopRecording"
  | "pauseRecording"
  | "resumeRecording"
  | "switchCamera"
  | "switchDevice"
  | "toggleFlash"
  | "requestPermission"
  | "refreshDevices"
  | "setZoom"
  | "zoomIn"
  | "zoomOut"
  | "resetZoom"
  | "focusAt"
  | "unlockFocus"
  | "setTimerDuration"
  | "startTimer"
  | "cancelTimer"
  | "startVoiceListening"
  | "stopVoiceListening"
  | "toggleVoiceListening"
>;

type CameraState = Omit<UseCameraReturn, keyof CameraActions>;

const CameraStateContext = React.createContext<CameraState | null>(null);

const CameraActionsContext = React.createContext<CameraActions | null>(null);

function useCameraState(): CameraState {
  const context = React.useContext(CameraStateContext);

  if (!context) {
    throw new Error("useCameraState must be used within a Camera component");
  }

  return context;
}

function useCameraActions(): CameraActions {
  const context = React.useContext(CameraActionsContext);

  if (!context) {
    throw new Error("useCameraActions must be used within a Camera component");
  }

  return context;
}

function useCameraContext(): CameraState & CameraActions {
  const state = useCameraState();
  const actions = useCameraActions();

  return { ...state, ...actions };
}

const cameraVariants = cva(
  [
    "relative isolate overflow-hidden border border-white/10 bg-black",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  ],
  {
    variants: {
      size: {
        default: "w-full aspect-video",
        sm: "w-64 max-w-full aspect-video",
        md: "w-96 max-w-full aspect-video",
        // kira-kit-ignore arbitrary-values: fixed 512px camera stage width
        lg: "w-[32rem] max-w-full aspect-video",
        full: "w-full h-full",
        square: "w-full aspect-square",
        fullscreen: "w-full h-dvh",
      },
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      shape: {
        default: "rounded-lg",
        rounded: "rounded-2xl",
        circle: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      size: "default",
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      shape: "default",
    },
  },
);

const cameraButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium motion-safe:transition-[color,background-color,border-color,opacity,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-white text-black hover:bg-white/90 active:bg-white/80",
        secondary:
          "bg-white/20 text-white hover:bg-white/30 active:bg-white/40 backdrop-blur-sm",
        recording:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        ghost: "bg-transparent text-white hover:bg-white/10 active:bg-white/20",
        danger:
          "bg-destructive/80 text-destructive-foreground hover:bg-destructive active:bg-destructive/90",
        success:
          "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80",
      },
      size: {
        xs: "h-8 w-8 min-h-8 min-w-8",
        sm: "h-10 w-10 min-h-10 min-w-10",
        md: "h-12 w-12 min-h-12 min-w-12",
        lg: "h-16 w-16 min-h-16 min-w-16",
        xl: "h-20 w-20 min-h-20 min-w-20",
      },
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      shape: {
        circle: "rounded-full",
        rounded: "rounded-xl",
        square: "rounded-none",
        pill: "rounded-full px-4",
      },
    },
    compoundVariants: [
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      { size: "xs", shape: "pill", className: "px-3 text-xs" },
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      { size: "sm", shape: "pill", className: "px-4" },
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      { size: "md", shape: "pill", className: "px-5" },
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      { size: "lg", shape: "pill", className: "px-6" },
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      { size: "xl", shape: "pill", className: "px-8" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      shape: "circle",
    },
  },
);

const cameraControlsVariants = cva(
  [
    "absolute inset-x-0 @container/camera-controls flex items-center justify-center p-3 text-white",
    "motion-safe:transition-opacity duration-200",
  ],
  {
    variants: {
      position: {
        bottom:
          "bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        top: "top-0 bg-linear-to-b from-black/90 via-black/60 to-transparent pt-[max(0.75rem,env(safe-area-inset-top))]",
        floating:
          "inset-x-3 bottom-3 rounded-lg border border-white/15 bg-black/80",
      },
      visibility: {
        visible: "opacity-100",
        hidden: "opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      position: "bottom",
      visibility: "visible",
    },
  },
);

const cameraGuideVariants = cva(
  "absolute inset-0 flex items-center justify-center pointer-events-none",
  {
    variants: {
      variant: {
        face: "",
        document: "",
      },
    },
    defaultVariants: {
      variant: "face",
    },
  },
);

const cameraPermissionsVariants = cva(
  ["flex flex-col items-center justify-center gap-4 p-6", "text-center"],
  {
    variants: {
      variant: {
        default: "bg-muted/50",
        overlay:
          "absolute inset-0 z-10 @container/camera-permissions justify-start gap-0 overflow-y-auto bg-black/80 p-3 text-white backdrop-blur-sm",
        card: "bg-card border rounded-lg shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const controlBarVariants = cva(
  "flex items-center gap-2 p-2 bg-black/40 backdrop-blur-md rounded-2xl",
  {
    variants: {
      position: {
        top: "absolute top-0 left-0 right-0 mx-4 mt-[max(1rem,env(safe-area-inset-top))]",
        bottom:
          "absolute bottom-0 left-0 right-0 mx-4 mb-[max(1rem,env(safe-area-inset-bottom))]",
        left: "absolute left-0 top-1/2 -translate-y-1/2 ml-[max(1rem,env(safe-area-inset-left))]",
        right:
          "absolute right-0 top-1/2 -translate-y-1/2 mr-[max(1rem,env(safe-area-inset-right))]",
        floating: "absolute",
      },
      variant: {
        horizontal: "flex-row justify-center overflow-x-auto scrollbar-hide",
        vertical: "flex-col overflow-y-auto scrollbar-hide",
        floating: "flex-row justify-center",
      },
    },
    defaultVariants: {
      position: "top",
      variant: "horizontal",
    },
  },
);

const BUTTON_ICON_SIZES = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

const GRID_ICONS = {
  none: <IconX size={20} />,
  "rule-of-thirds": <IconGrid3x3 size={20} />,
  "golden-ratio": <IconLayoutGrid size={20} />,
  square: <IconGrid4x4 size={20} />,
  diagonal: <IconSlash size={20} />,
  "center-cross": <IconGridDots size={20} />,
} satisfies Record<CameraGridType, React.ReactNode>;

interface CameraProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "onError">,
    VariantProps<typeof cameraVariants>,
    Omit<UseCameraOptions, "onStatusChange"> {
  mode?: CameraMode;
  facingMode?: CameraFacingMode;
  autoStart?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableHaptics?: boolean;
  announceStatus?: boolean;
  captureQuality?: number;
  captureFormat?: "image/jpeg" | "image/png" | "image/webp";
  onCapture?: (result: CaptureResult) => void;
  onError?: (error: CameraError) => void;
  onStatusChange?: (status: CameraStatus) => void;
  onReady?: () => void;
}

type CameraRef = CameraActions;

const CameraRoot = React.forwardRef<CameraRef, CameraProps>((props, ref) => {
  const model = useCameraRootModel(props, ref);

  return <CameraRootView {...model} />;
});

CameraRoot.displayName = "Camera";

const previewVariants = cva("absolute inset-0 object-cover", {
  variants: {
    mirror: {
      true: "scale-x-[-1]",
      false: "",
    },
  },
  defaultVariants: {
    mirror: true,
  },
});

interface CameraPreviewProps
  extends
    Omit<React.ComponentPropsWithoutRef<"video">, "ref">,
    VariantProps<typeof previewVariants> {
  showSkeleton?: boolean;
  skeleton?: React.ReactNode;
}

const CameraPreview = React.forwardRef<HTMLVideoElement, CameraPreviewProps>(
  (
    { className, mirror, showSkeleton = true, skeleton, style, ...props },
    forwardedRef,
  ) => {
    const { videoRef, status, facingMode, zoom } = useCameraState();
    const shouldMirror = mirror ?? facingMode === "user";

    const isLoading =
      status === "initializing" || status === "requesting-permission";

    const reducedMotion = useReducedMotion();

    return (
      <>
        {showSkeleton &&
          isLoading &&
          (skeleton || (
            <CameraContentView reducedMotion={reducedMotion} status={status} />
          ))}
        <video
          ref={mergeRefs(videoRef, forwardedRef)}
          data-slot="camera-preview"
          style={{
            ...style,
            transform:
              "scale(" +
              zoom +
              ")" +
              (style?.transform ? " " + style.transform : ""),
          }}
          className={cn(
            previewVariants({ mirror: shouldMirror }),
            "w-full h-full",
            { invisible: isLoading },
            className,
          )}
          autoPlay
          playsInline
          muted
          aria-hidden="true"
          {...props}
        />
      </>
    );
  },
);

CameraPreview.displayName = "CameraPreview";

interface CameraOverlayProps extends React.ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
}

const CameraOverlay = React.forwardRef<HTMLDivElement, CameraOverlayProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="camera-overlay"
        className={cn(
          "absolute inset-0",
          { "pointer-events-none": !interactive },
          { "*:pointer-events-auto": interactive },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CameraOverlay.displayName = "CameraOverlay";

interface CameraCaptureFlashProps extends React.ComponentPropsWithoutRef<"div"> {
  duration?: number;
}

function CameraCaptureFlash({
  className,
  duration = 150,
  ...props
}: CameraCaptureFlashProps) {
  const { status } = useCameraState();
  const reducedMotion = useReducedMotion();

  if (status !== "capturing") return null;

  if (reducedMotion) return null;

  return (
    <div
      data-slot="camera-capture-flash"
      className={cn(
        "absolute inset-0 bg-white pointer-events-none",
        "animate-in fade-in-0 fade-out-0",
        className,
      )}
      style={{ animationDuration: `${duration}ms` }}
      aria-hidden="true"
      {...props}
    />
  );
}

CameraCaptureFlash.displayName = "CameraCaptureFlash";

interface CameraButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cameraButtonVariants> {
  icon?: React.ReactNode;
  iconSize?: number;
  label?: string;
  labelPosition?: "bottom" | "right" | "top" | "left";
  showLabel?: boolean;
  badge?: string | number;
  indicator?: "dot" | "ring" | "none";
  indicatorColor?: string;
  isActive?: boolean;
  isLoading?: boolean;
  hapticPattern?:
    "light" | "medium" | "heavy" | "success" | "error" | "warning" | "none";
  pressAnimation?: "scale" | "bounce" | "none";
  pulse?: boolean;
  pulseColor?: string;
  action?:
    | "capture"
    | "record"
    | "flash"
    | "switch"
    | "timer"
    | "grid"
    | "settings"
    | "zoom"
    | "aspectRatio";
}

type CameraButtonNativeProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  | "variant"
  | "size"
  | "shape"
  | "icon"
  | "iconSize"
  | "label"
  | "labelPosition"
  | "showLabel"
  | "badge"
  | "indicator"
  | "indicatorColor"
  | "isActive"
  | "isLoading"
  | "hapticPattern"
  | "pressAnimation"
  | "pulse"
  | "pulseColor"
  | "action"
>;

const CameraButton = React.forwardRef<HTMLButtonElement, CameraButtonProps>(
  (props, ref) => {
    const model = useCameraButtonModel(props, ref);

    return <CameraButtonView {...model} />;
  },
);

CameraButton.displayName = "CameraButton";

interface CaptureButtonProps extends Omit<
  CameraButtonProps,
  "icon" | "variant" | "size"
> {
  size?: "sm" | "md" | "lg";
  showInnerRing?: boolean;
  innerRingColor?: string;
}

const CaptureButton = React.forwardRef<HTMLButtonElement, CaptureButtonProps>(
  (
    {
      size = "md",
      showInnerRing = true,
      innerRingColor,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeMap = {
      sm: { button: "lg" as const, icon: 24 },
      md: { button: "xl" as const, icon: 28 },
      lg: { button: "xl" as const, icon: 32 },
    };

    const { button: buttonSize, icon: iconSize } = sizeMap[size];

    return (
      <CameraButton
        ref={ref}
        variant="primary"
        size={buttonSize}
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={<IconCamera size={iconSize} />}
        iconSize={iconSize}
        hapticPattern="medium"
        pressAnimation="scale"
        action="capture"
        className={className}
        {...props}
      >
        {showInnerRing && (
          <span
            data-slot="camera-capture-ring"
            className="absolute inset-1 rounded-full border-2 border-current/15"
            style={{ borderColor: innerRingColor }}
            aria-hidden="true"
          />
        )}
        {children}
      </CameraButton>
    );
  },
);

CaptureButton.displayName = "CaptureButton";

interface RecordButtonProps extends Omit<
  CameraButtonProps,
  "icon" | "variant"
> {
  isRecording?: boolean;
  size?: "sm" | "md" | "lg";
  showTimeBadge?: boolean;
  recordingDuration?: number;
}

const RecordButton = React.forwardRef<HTMLButtonElement, RecordButtonProps>(
  (
    {
      isRecording: isRecordingInput,
      size: sizeInput,
      showTimeBadge: showTimeBadgeInput,
      recordingDuration: recordingDurationInput,
      className,
      ...props
    },
    ref,
  ) => {
    const { isRecording, size, showTimeBadge, recordingDuration } =
      useCameraOptions4({
        isRecording: isRecordingInput,
        size: sizeInput,
        showTimeBadge: showTimeBadgeInput,
        recordingDuration: recordingDurationInput,
      });

    const sizeMap = {
      sm: { button: "md" as const, icon: 20 },
      md: { button: "lg" as const, icon: 24 },
      lg: { button: "xl" as const, icon: 28 },
    };

    const { button: buttonSize, icon: iconSize } = sizeMap[size];

    return (
      <CameraButton
        ref={ref}
        variant={isRecording ? "recording" : "secondary"}
        size={buttonSize}
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={
          isRecording ? (
            <IconSquare size={iconSize} />
          ) : (
            <IconVideo size={iconSize} />
          )
        }
        iconSize={iconSize}
        isActive={isRecording}
        pulse={isRecording}
        pulseColor="var(--destructive)"
        hapticPattern={isRecording ? "success" : "medium"}
        pressAnimation="scale"
        badge={
          showTimeBadge && isRecording
            ? formatDuration(recordingDuration)
            : undefined
        }
        action="record"
        className={className}
        {...props}
      />
    );
  },
);

RecordButton.displayName = "RecordButton";

interface FlashButtonProps extends Omit<CameraButtonProps, "icon"> {
  isEnabled?: boolean;
  isSupported?: boolean;
}

const FlashButton = React.forwardRef<HTMLButtonElement, FlashButtonProps>(
  ({ isEnabled = false, isSupported = true, className, ...props }, ref) => {
    return (
      <CameraButton
        ref={ref}
        variant={isEnabled ? "secondary" : "ghost"}
        isActive={isEnabled}
        size="md"
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={isEnabled ? <IconBolt size={20} /> : <IconBoltOff size={20} />}
        hapticPattern="light"
        pressAnimation="scale"
        disabled={!isSupported}
        action="flash"
        className={className}
        {...props}
      />
    );
  },
);

FlashButton.displayName = "FlashButton";

type SwitchCameraButtonProps = Omit<CameraButtonProps, "icon">;

const SwitchCameraButton = React.forwardRef<
  HTMLButtonElement,
  SwitchCameraButtonProps
>(({ disabled, className, ...props }, ref) => {
  return (
    <CameraButton
      ref={ref}
      variant="ghost"
      size="md"
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      shape="circle"
      icon={<IconCameraRotate size={20} />}
      hapticPattern="light"
      pressAnimation="scale"
      disabled={disabled}
      action="switch"
      className={className}
      {...props}
    />
  );
});

SwitchCameraButton.displayName = "SwitchCameraButton";

type TimerButtonProps = Omit<
  CameraButtonProps,
  "icon" | "onClick" | "badge" | "onDurationChange"
> & {
  duration: number;
  options?: number[];
  onDurationChange?: (duration: number) => void;
  showBadge?: boolean;
};

const TimerButton = React.forwardRef<HTMLButtonElement, TimerButtonProps>(
  (
    {
      duration,
      options = [...TIMER_DURATIONS],
      onDurationChange,
      showBadge = true,
      className,
      ...props
    },
    ref,
  ) => {
    const handleClick = React.useCallback(() => {
      const currentIndex = options.indexOf(duration);
      const nextIndex = (currentIndex + 1) % options.length;

      if (options.length && Number.isFinite(options[nextIndex]))
        onDurationChange?.(options[nextIndex]);
    }, [duration, options, onDurationChange]);

    const isActive = duration > 0;

    return (
      <CameraButton
        ref={ref}
        variant={isActive ? "secondary" : "ghost"}
        size="md"
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={<IconClock size={20} />}
        badge={showBadge && isActive ? `${duration}s` : undefined}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        isActive={isActive}
        action="timer"
        className={className}
        {...props}
      />
    );
  },
);

TimerButton.displayName = "TimerButton";

interface GridButtonProps extends Omit<CameraButtonProps, "icon" | "onClick"> {
  gridType: CameraGridType;
  onGridChange?: (gridType: CameraGridType) => void;
  cycleOptions?: boolean;
}

const GridButton = React.forwardRef<HTMLButtonElement, GridButtonProps>(
  (
    { gridType, onGridChange, cycleOptions = true, className, ...props },
    ref,
  ) => {
    const handleClick = React.useCallback(
      () => cameraUseCallback(cycleOptions, gridType, onGridChange),
      [gridType, onGridChange, cycleOptions],
    );

    const isActive = gridType !== "none";

    return (
      <CameraButton
        ref={ref}
        variant={isActive ? "secondary" : "ghost"}
        size="md"
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={GRID_ICONS[gridType]}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        isActive={isActive}
        action="grid"
        className={className}
        {...props}
      />
    );
  },
);

GridButton.displayName = "GridButton";

interface SettingsButtonProps extends Omit<CameraButtonProps, "icon"> {
  isOpen?: boolean;
}

const SettingsButton = React.forwardRef<HTMLButtonElement, SettingsButtonProps>(
  ({ isOpen = false, className, ...props }, ref) => {
    return (
      <CameraButton
        ref={ref}
        variant={isOpen ? "secondary" : "ghost"}
        size="md"
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={<IconSettings size={20} />}
        hapticPattern="light"
        pressAnimation="scale"
        action="settings"
        className={className}
        {...props}
      />
    );
  },
);

SettingsButton.displayName = "SettingsButton";

interface AspectRatioButtonProps extends Omit<
  CameraButtonProps,
  "icon" | "onClick"
> {
  aspectRatio: CameraAspectRatio;
  onAspectRatioChange?: (aspectRatio: CameraAspectRatio) => void;
  showBadge?: boolean;
}

const AspectRatioButton = React.forwardRef<
  HTMLButtonElement,
  AspectRatioButtonProps
>(
  (
    { aspectRatio, onAspectRatioChange, showBadge = true, className, ...props },
    ref,
  ) => {
    const handleClick = React.useCallback(() => {
      const options = ASPECT_RATIOS.map((opt) => opt.name);

      const currentIndex = options.indexOf(aspectRatio);
      const nextIndex = (currentIndex + 1) % options.length;
      onAspectRatioChange?.(options[nextIndex]);
    }, [aspectRatio, onAspectRatioChange]);

    return (
      <CameraButton
        ref={ref}
        variant="ghost"
        size="md"
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={<IconAspectRatio size={20} />}
        badge={showBadge ? aspectRatio : undefined}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        action="aspectRatio"
        className={className}
        {...props}
      />
    );
  },
);

AspectRatioButton.displayName = "AspectRatioButton";

interface ZoomButtonProps extends Omit<CameraButtonProps, "icon" | "onClick"> {
  zoomAction: "in" | "out" | "reset";
  zoom?: number;
  onZoom?: (delta: number) => void;
}

const ZoomButton = React.forwardRef<HTMLButtonElement, ZoomButtonProps>(
  ({ zoomAction, zoom, onZoom, className, ...props }, ref) => {
    const handleClick = React.useCallback(
      () => cameraUseCallback2(zoomAction, onZoom),
      [zoomAction, onZoom],
    );

    const icon = React.useMemo(() => {
      switch (zoomAction) {
        case "in":
          return <IconZoomIn size={20} />;
        case "out":
          return <IconZoomOut size={20} />;
        case "reset":
          return <IconZoomReset size={20} />;
      }
    }, [zoomAction]);

    const badge = React.useMemo(() => {
      if (zoomAction === "reset" && zoom && zoom !== 1) {
        return `${zoom.toFixed(1)}x`;
      }

      return undefined;
    }, [zoomAction, zoom]);

    return (
      <CameraButton
        ref={ref}
        variant="ghost"
        size="sm"
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        shape="circle"
        icon={icon}
        badge={badge}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        aria-label={cameraArialabelValue(zoomAction)}
        action="zoom"
        className={className}
        {...props}
      />
    );
  },
);

ZoomButton.displayName = "ZoomButton";

interface CameraControlsProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof cameraControlsVariants> {
  showCapture?: boolean;
  showRecord?: boolean;
  showSwitch?: boolean;
  showFlash?: boolean;
  onCapture?: () => void;
  onRecordStart?: () => void;
  onRecordStop?: (blob: Blob | null) => void;
  onSwitchCamera?: () => void;
  onToggleFlash?: (isOn: boolean) => void;
  autoHide?: boolean;
}

const CameraControls = React.forwardRef<HTMLDivElement, CameraControlsProps>(
  (props, ref) => {
    const model = useCameraControlsModel(props, ref);

    return <CameraControlsView {...model} />;
  },
);

CameraControls.displayName = "CameraControls";

interface CameraControlBarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof controlBarVariants> {
  visible?: boolean;
  autoHide?: boolean;
  isReady?: boolean;
  floatingPosition?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
}

const CameraControlBar = React.forwardRef<
  HTMLDivElement,
  CameraControlBarProps
>(
  (
    {
      className,
      position,
      variant,
      visible = true,
      autoHide = false,
      isReady = true,
      floatingPosition,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const shouldShow = visible && (!autoHide || isReady);

    const floatingStyles = React.useMemo(
      () => cameraUseMemo(position, floatingPosition),
      [position, floatingPosition],
    );

    if (!shouldShow) return null;

    return (
      <div
        ref={ref}
        className={cn(controlBarVariants({ position, variant }), className)}
        style={{ ...style, ...floatingStyles }}
        role="toolbar"
        aria-label="Camera controls"
        data-slot="camera-control-bar"
        {...props}
      >
        {children}
      </div>
    );
  },
);

CameraControlBar.displayName = "CameraControlBar";

interface CameraControlBarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  direction?: "horizontal" | "vertical";
}

const CameraControlBarGroup = React.forwardRef<
  HTMLDivElement,
  CameraControlBarGroupProps
>(({ className, label, direction = "horizontal", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="camera-control-bar-group"
      className={cn(
        "flex items-center",
        direction === "horizontal" ? "flex-row gap-2" : "flex-col gap-2",
        className,
      )}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-label={label}
      {...props}
    >
      {children}
    </div>
  );
});

CameraControlBarGroup.displayName = "CameraControlBarGroup";

const CameraControlBarDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-px h-6 bg-white/20 mx-1", className)}
      aria-hidden="true"
      {...props}
    />
  );
});

CameraControlBarDivider.displayName = "CameraControlBarDivider";

interface CameraGuideProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "face" | "document";
  documentType?: DocumentType;
  preset?: GuidePreset;
  config?: Partial<CameraGuideConfig>;
  isAligned?: boolean;
  alignmentProgress?: number;
  instruction?: string;
  showInstruction?: boolean;
  instructionPosition?: "top" | "bottom" | "inside";
  showAlignmentIndicator?: boolean;
  alignmentIndicatorPosition?:
    "top-right" | "top-left" | "bottom-right" | "bottom-left";
  showMeasurements?: boolean;
  showCenterCross?: boolean;
  safeZone?: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
  };
}

const variantToPreset = {
  face: "face-oval",
  document: "id-front",
} satisfies Record<string, GuidePreset>;

const documentTypeToPreset = {
  "national-id": "id-front",
  passport: "passport",
  "drivers-license": "drivers-license",
  custom: "custom",
} satisfies Record<DocumentType, GuidePreset>;

function CameraGuide(arg0: CameraGuideProps) {
  const model = useCameraGuideModel(arg0);

  return <CameraGuideView {...model} />;
}

CameraGuide.displayName = "CameraGuide";

interface CameraGridProps extends Partial<CameraGridConfig> {
  visible?: boolean;
  type?: CameraGridType;
  className?: string;
}

function CameraGrid({
  visible: visibleInput,
  type: typeInput,
  color: colorInput,
  opacity: opacityInput,
  lineWidth: lineWidthInput,
  showIntersectionDots: showIntersectionDotsInput,
  dotSize: dotSizeInput,
  animated: animatedInput,
  className,
}: CameraGridProps) {
  const { visible, type, color, opacity, lineWidth, showIntersectionDots } =
    useCameraGridOptions({
      visible: visibleInput,
      type: typeInput,
      color: colorInput,
      opacity: opacityInput,
      lineWidth: lineWidthInput,
      showIntersectionDots: showIntersectionDotsInput,
    });

  const { dotSize, animated } = useCameraGridOptions2({
    dotSize: dotSizeInput,
    animated: animatedInput,
  });

  const reducedMotion = useReducedMotion();

  if (!visible || type === "none") return null;

  const lineStyle: React.CSSProperties = {
    stroke: color,
    strokeWidth: lineWidth,
    opacity,
  };

  const dotStyle: React.CSSProperties = { fill: color, opacity: opacity * 1.5 };

  const animationClass =
    animated && !reducedMotion ? "animate-in fade-in-0 duration-200" : "";

  const { renderRuleOfThirds, renderGoldenRatio } = createPrimaryGridRenderers({
    animationClass,
    lineStyle,
    showIntersectionDots,
    dotSize,
    dotStyle,
  });

  const { renderSquare, renderDiagonal, renderCenterCross } =
    createSecondaryGridRenderers({
      animationClass,
      lineStyle,
      dotSize,
      dotStyle,
    });

  const gridRenderers = {
    none: () => null,
    "rule-of-thirds": renderRuleOfThirds,
    "golden-ratio": renderGoldenRatio,
    square: renderSquare,
    diagonal: renderDiagonal,
    "center-cross": renderCenterCross,
  } satisfies Record<CameraGridType, () => React.ReactNode>;

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
      data-slot="camera-grid"
      data-grid-type={type}
    >
      {gridRenderers[type]?.()}
    </div>
  );
}

CameraGrid.displayName = "CameraGrid";

type CameraScanOverlayStatus =
  "idle" | "scanning" | "aligned" | "processing" | "success" | "error";

interface CameraScanOverlayProps {
  preset: CameraScanOverlayPreset;
  isAligned?: boolean;
  isScanning?: boolean;
  isProcessing?: boolean;
  status?: CameraScanOverlayStatus;
  /** Optional status/instruction text. Omit or set showStatusText={false} to hide the badge. */
  statusText?: string;
  /** When false, the status text badge is hidden. Default true. */
  showStatusText?: boolean;
  config?: Partial<CameraScanOverlayConfig>;
  documentType?: "national-id" | "passport" | "drivers-license" | "custom";
  documentAspectRatio?: number;
  className?: string;
}

function CameraScanOverlay({
  preset,
  isAligned: isAlignedInput,
  isScanning: isScanningInput,
  isProcessing: isProcessingInput,
  status: statusInput,
  statusText,
  showStatusText: showStatusTextInput,
  config: configOverride,
  documentType: documentTypeInput,
  documentAspectRatio,
  className,
}: CameraScanOverlayProps) {
  const {
    isAligned,
    isScanning,
    isProcessing,
    status,
    showStatusText,
    documentType,
  } = useCameraScanOverlayOptions({
    isAligned: isAlignedInput,
    isScanning: isScanningInput,
    isProcessing: isProcessingInput,
    status: statusInput,
    showStatusText: showStatusTextInput,
    documentType: documentTypeInput,
  });

  const reducedMotion = useReducedMotion();
  const pageVisible = useCameraPageVisible();
  const config = { ...SCAN_OVERLAY_DEFAULTS[preset], ...configOverride };

  if (preset === "none") return null;

  const {
    ratio,
    stroke,
    color,
    corners,
    cornerSize,
    active,
    animate,
    duration,
    message,
  } = getScanOverlayPresentation({
    isScanning,
    isProcessing,
    status,
    pageVisible,
    config,
    reducedMotion,
    preset,
    documentAspectRatio,
    documentType,
    isAligned,
    statusText,
  });

  return (
    <CameraScanOverlayView
      preset={preset}
      status={status}
      className={className}
      ratio={ratio}
      stroke={stroke}
      color={color}
      config={config}
      corners={corners}
      cornerSize={cornerSize}
      active={active}
      animate={animate}
      duration={duration}
      showStatusText={showStatusText}
      message={message}
      isAligned={isAligned}
    />
  );
}

CameraScanOverlay.displayName = "CameraScanOverlay";

interface CameraTimerProps {
  duration: CameraTimerDuration;
  isActive: boolean;
  remaining: number;
  timerStyle?: "number" | "circular" | "bar";
  size?: "sm" | "md" | "lg";
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  showPulse?: boolean;
  className?: string;
}

function CameraTimer({
  duration,
  isActive,
  remaining,
  timerStyle: timerStyleInput,
  size: sizeInput,
  color: colorInput,
  backgroundColor: backgroundColorInput,
  animated: animatedInput,
  showPulse: showPulseInput,
  className,
}: CameraTimerProps) {
  const { timerStyle, size, color, backgroundColor, animated, showPulse } =
    useCameraTimerOptions({
      timerStyle: timerStyleInput,
      size: sizeInput,
      color: colorInput,
      backgroundColor: backgroundColorInput,
      animated: animatedInput,
      showPulse: showPulseInput,
    });

  const reduced = useReducedMotion();
  const pageVisible = useCameraPageVisible();

  if (!isActive || duration <= 0) return null;

  const count = Math.max(
    0,
    Math.min(duration, Number.isFinite(remaining) ? remaining : 0),
  );

  const progress = count / duration;

  return (
    <CameraTimerView
      count={count}
      progress={progress}
      timerStyle={timerStyle}
      size={size}
      color={color}
      backgroundColor={backgroundColor}
      animated={animated && !reduced && pageVisible}
      showPulse={showPulse}
      className={className}
    />
  );
}

const CAMERA_TIMER_SIZES = {
  sm: "size-16 text-2xl",
  md: "size-24 text-4xl",
  lg: "size-32 text-5xl",
} as const;

function CameraTimerView({
  count,
  progress,
  timerStyle,
  size,
  color,
  backgroundColor,
  animated,
  showPulse,
  className,
}: {
  count: number;
  progress: number;
  timerStyle: "number" | "circular" | "bar";
  size: "sm" | "md" | "lg";
  color: string;
  backgroundColor: string;
  animated: boolean;
  showPulse: boolean;
  className: string | undefined;
}) {
  return (
    <div
      data-slot="camera-timer"
      data-style={timerStyle}
      role="timer"
      aria-label={count + " seconds until capture"}
      className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none",
        { "animate-in fade-in-0 duration-200": animated },
        className,
      )}
    >
      <div
        data-slot="camera-timer-count"
        className={cn(
          "relative flex items-center justify-center rounded-full tabular-nums font-semibold",
          CAMERA_TIMER_SIZES[size],
          { "ring-2 ring-current/30": showPulse },
        )}
        style={{ color, backgroundColor }}
      >
        {timerStyle === "circular" && (
          <CameraTimerTrackView progress={progress} />
        )}
        <span
          key={count}
          data-slot="camera-timer-value"
          aria-hidden="true"
          className={cn({
            "animate-in fade-in-0 zoom-in-95 duration-150":
              animated && showPulse,
          })}
        >
          {count}
        </span>
        {timerStyle === "bar" && (
          <span
            data-slot="camera-timer-bar"
            aria-hidden="true"
            className="absolute inset-x-3 bottom-3 h-1 overflow-hidden rounded-full bg-current/20"
          >
            <span
              className="block h-full origin-left bg-current"
              style={{ transform: "scaleX(" + progress + ")" }}
            />
          </span>
        )}
      </div>
    </div>
  );
}

CameraTimer.displayName = "CameraTimer";

interface CameraPermissionsProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof cameraPermissionsVariants> {
  requestingTitle?: string;
  requestingDescription?: string;
  deniedTitle?: string;
  deniedDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  showHelpLink?: boolean;
  helpLinkUrl?: string;
  onRetry?: () => void;
  alwaysShow?: boolean;
}

type CameraPermissionContent = {
  icon: typeof IconCamera;
  iconClass: string;
  iconContainerClass: string;
  title: string;
  description: string;
  showRetry: boolean;
  showHelp: boolean;
};

function getCameraPermissionContent(
  status: CameraStatus,
  error: CameraError | null,
  reducedMotion: boolean,
  options: ReturnType<typeof useCameraOptions6>,
  showHelpLink: boolean,
): CameraPermissionContent {
  if (status === "idle") {
    return {
      icon: IconCamera,
      iconClass: "",
      iconContainerClass: "bg-primary/10",
      title: "Ready to take a photo",
      description: "Start the camera when you are ready.",
      showRetry: true,
      showHelp: false,
    };
  }

  if (status === "requesting-permission" || status === "initializing") {
    return {
      icon: IconCamera,
      iconClass: cn({ "animate-pulse": !reducedMotion }),
      iconContainerClass: "bg-primary/10",
      title: options.requestingTitle,
      description: options.requestingDescription,
      showRetry: false,
      showHelp: false,
    };
  }

  if (status === "permission-denied" || error?.code === "PERMISSION_DENIED") {
    return {
      icon: IconCameraOff,
      iconClass: "",
      iconContainerClass: "bg-destructive/10",
      title: options.deniedTitle,
      description: options.deniedDescription,
      showRetry: true,
      showHelp: showHelpLink,
    };
  }

  return {
    icon: IconAlertCircle,
    iconClass: "",
    iconContainerClass: "bg-destructive/10",
    title: options.errorTitle,
    description: error?.message || options.errorDescription,
    showRetry: error?.recoverable !== false,
    showHelp: false,
  };
}

const CameraPermissions = React.forwardRef<
  HTMLDivElement,
  CameraPermissionsProps
>(function CameraPermissions(props, ref) {
  const {
    className,
    variant,
    requestingTitle: requestingTitleInput,
    requestingDescription: requestingDescriptionInput,
    deniedTitle: deniedTitleInput,
    deniedDescription: deniedDescriptionInput,
    errorTitle: errorTitleInput,
    errorDescription: errorDescriptionInput,
    showHelpLink: showHelpLinkInput,
    helpLinkUrl,
    onRetry,
    alwaysShow: alwaysShowInput,
    ...elementProps
  } = props;

  const contentOptions = useCameraOptions6({
    requestingTitle: requestingTitleInput,
    requestingDescription: requestingDescriptionInput,
    deniedTitle: deniedTitleInput,
    deniedDescription: deniedDescriptionInput,
    errorTitle: errorTitleInput,
    errorDescription: errorDescriptionInput,
  });

  const { showHelpLink, alwaysShow } = useCameraOptions7({
    showHelpLink: showHelpLinkInput,
    alwaysShow: alwaysShowInput,
  });

  const { status, error } = useCameraState();
  const { start, stop } = useCameraActions();

  const reducedMotion = useReducedMotion();

  const isVisible =
    alwaysShow ||
    status === "idle" ||
    status === "requesting-permission" ||
    status === "initializing" ||
    status === "permission-denied" ||
    status === "error";

  if (!isVisible) return null;

  const content = getCameraPermissionContent(
    status,
    error,
    reducedMotion,
    contentOptions,
    showHelpLink,
  );

  const isRequesting =
    status === "requesting-permission" || status === "initializing";

  return (
    <CameraPermissionsView
      {...elementProps}
      ref={ref}
      className={className}
      variant={variant}
      status={status}
      error={error}
      permissionContent={content}
      isRequesting={isRequesting}
      reducedMotion={reducedMotion}
      helpLink={helpLinkUrl || getPermissionHelpLink()}
      onRetry={async () => {
        onRetry?.();
        await start();
      }}
      onCancel={() => void stop()}
    />
  );
});

type CameraPermissionsViewProps = CameraPermissionsProps & {
  status: CameraStatus;
  error: CameraError | null;
  permissionContent: CameraPermissionContent;
  isRequesting: boolean;
  reducedMotion: boolean;
  helpLink: string;
  onCancel: () => void;
};

const CameraPermissionsView = React.forwardRef<
  HTMLDivElement,
  CameraPermissionsViewProps
>(function CameraPermissionsView(
  {
    className,
    variant,
    status,
    error,
    permissionContent,
    isRequesting,
    reducedMotion,
    helpLink,
    onRetry,
    onCancel,
    ...props
  },
  ref,
) {
  const isOverlay = variant === "overlay";
  const actionSize = isOverlay ? "sm" : "default";

  return (
    <div
      {...props}
      ref={ref}
      data-slot="camera-permissions"
      className={cn(cameraPermissionsVariants({ variant, className }))}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-label={permissionContent.title}
    >
      <div
        data-slot="camera-permission-body"
        className={cn(
          isOverlay
            ? "my-auto flex w-full shrink-0 flex-col items-center gap-2 @min-[24rem]/camera-permissions:gap-4"
            : "contents",
        )}
      >
        <CameraPermissionMessage
          content={permissionContent}
          error={error}
          isOverlay={isOverlay}
          isRequesting={isRequesting}
          reducedMotion={reducedMotion}
        />
        <CameraPermissionActions
          status={status}
          content={permissionContent}
          isRequesting={isRequesting}
          isOverlay={isOverlay}
          actionSize={actionSize}
          helpLink={helpLink}
          onCancel={onCancel}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
});

function CameraPermissionMessage({
  content,
  error,
  isOverlay,
  isRequesting,
  reducedMotion,
}: {
  content: CameraPermissionContent;
  error: CameraError | null;
  isOverlay: boolean;
  isRequesting: boolean;
  reducedMotion: boolean;
}) {
  return (
    <>
      <CameraPermissionIcon
        content={content}
        isOverlay={isOverlay}
        isRequesting={isRequesting}
        reducedMotion={reducedMotion}
      />
      <CameraPermissionText
        content={content}
        error={error}
        isOverlay={isOverlay}
      />
    </>
  );
}

function CameraPermissionIcon({
  content,
  isOverlay,
  isRequesting,
  reducedMotion,
}: {
  content: CameraPermissionContent;
  isOverlay: boolean;
  isRequesting: boolean;
  reducedMotion: boolean;
}) {
  const Icon = content.icon;

  return (
    <div
      data-slot="camera-permission-icon"
      className={cn(
        "shrink-0 rounded-full",
        isOverlay ? "hidden p-3 @min-[24rem]/camera-permissions:block" : "p-4",
        content.iconContainerClass,
      )}
    >
      {isRequesting ? (
        <IconLoader2
          className={cn(isOverlay ? "size-6" : "size-10", "text-primary", {
            "animate-spin": !reducedMotion,
          })}
          aria-hidden="true"
        />
      ) : (
        <Icon
          className={cn(
            isOverlay ? "size-6" : "size-10",
            content.icon === IconCameraOff || content.icon === IconAlertCircle
              ? "text-destructive"
              : "text-primary",
            content.iconClass,
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function CameraPermissionText({
  content,
  error,
  isOverlay,
}: {
  content: CameraPermissionContent;
  error: CameraError | null;
  isOverlay: boolean;
}) {
  return (
    <div
      data-slot="camera-permission-content"
      className={cn(
        "max-w-xs break-words",
        isOverlay ? "space-y-1" : "space-y-2",
      )}
    >
      <h3
        data-slot="camera-permission-title"
        className={cn(
          "font-semibold",
          isOverlay
            ? "text-sm @min-[24rem]/camera-permissions:text-lg"
            : "text-lg",
        )}
      >
        {content.title}
      </h3>
      <p
        data-slot="camera-permission-description"
        className={cn(
          isOverlay
            ? "text-xs text-white/80 @min-[24rem]/camera-permissions:text-sm"
            : "text-sm text-muted-foreground",
        )}
      >
        {content.description}
      </p>
      {error?.suggestion && (
        <p
          data-slot="camera-permission-suggestion"
          className={cn(
            "text-xs italic",
            isOverlay ? "text-white/80" : "text-muted-foreground/80",
          )}
        >
          {error.suggestion}
        </p>
      )}
    </div>
  );
}

function CameraPermissionActions({
  status,
  content,
  isRequesting,
  isOverlay,
  actionSize,
  helpLink,
  onCancel,
  onRetry,
}: {
  status: CameraStatus;
  content: CameraPermissionContent;
  isRequesting: boolean;
  isOverlay: boolean;
  actionSize: "sm" | "default";
  helpLink: string;
  onCancel: () => void;
  onRetry: (() => void) | undefined;
}) {
  const overlayButtonClass = {
    "min-h-11 @min-[24rem]/camera-permissions:min-h-8": isOverlay,
  };

  return (
    <div
      data-slot="camera-permission-actions"
      className="flex shrink-0 flex-wrap items-center justify-center gap-2"
    >
      {isRequesting && (
        <Button
          variant="outline"
          size={actionSize}
          className={cn("text-foreground", overlayButtonClass)}
          onClick={onCancel}
        >
          Cancel camera request
        </Button>
      )}
      {content.showRetry && (
        <Button
          onClick={onRetry}
          size={actionSize}
          className={cn("gap-2", overlayButtonClass)}
        >
          <IconRefresh className="w-4 h-4" aria-hidden="true" />
          {status === "idle" ? "Start camera" : "Try again"}
        </Button>
      )}
      {content.showHelp && (
        <a
          data-slot="camera-permission-help"
          href={helpLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: actionSize }),
            "text-foreground",
            overlayButtonClass,
          )}
        >
          How to enable
          <IconExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

CameraPermissions.displayName = "CameraPermissions";

interface CameraSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: CameraSettingsValues;
  onValuesChange: (values: CameraSettingsValues) => void;
  variant?: "sheet" | "modal" | "panel";
  position?: "bottom" | "right" | "left";
  className?: string;
}

function CameraSettings({
  open,
  onOpenChange,
  values,
  onValuesChange,
  variant = "sheet",
  position = "bottom",
  className,
}: CameraSettingsProps) {
  const update = <K extends keyof CameraSettingsValues>(
    key: K,
    value: CameraSettingsValues[K],
  ) => onValuesChange({ ...values, [key]: value });

  if (!open) return null;

  const content = (
    <CameraSettingsContent
      values={values}
      onValuesChange={onValuesChange}
      update={update}
      onClose={() => onOpenChange(false)}
    />
  );

  if (variant === "panel")
    return (
      <div
        data-slot="camera-settings"
        className={cn(
          "rounded-md border bg-background text-foreground",
          className,
        )}
      >
        {content}
      </div>
    );

  if (variant === "modal")
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent data-slot="camera-settings" className={className}>
          <DialogHeader>
            <DialogTitle>Camera settings</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer side={position} open={open} onOpenChange={onOpenChange}>
      <DrawerContent data-slot="camera-settings" className={className}>
        <DrawerTitle className="px-4 pt-4">Camera settings</DrawerTitle>
        {content}
      </DrawerContent>
    </Drawer>
  );
}

type CameraSettingsUpdate = <K extends keyof CameraSettingsValues>(
  key: K,
  value: CameraSettingsValues[K],
) => void;

function CameraSettingsContent({
  values,
  onValuesChange,
  update,
  onClose,
}: {
  values: CameraSettingsValues;
  onValuesChange: (values: CameraSettingsValues) => void;
  update: CameraSettingsUpdate;
  onClose: () => void;
}) {
  return (
    <div data-slot="camera-settings-content" className="space-y-4 p-4">
      <Tabs defaultValue="photo">
        <TabsList className="w-full">
          <TabsTrigger value="photo">Photo</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>
        <TabsContent value="photo" className="space-y-4 pt-4">
          <CameraContentView5 values={values} onValuesChange={onValuesChange} />
          <div // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
            role="group"
            aria-label="Capture aspect ratio"
            className="space-y-2"
          >
            <p className="text-sm font-medium">Aspect ratio</p>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <Button
                  key={ratio.name}
                  size="sm"
                  variant={
                    values.aspectRatio === ratio.name ? "secondary" : "outline"
                  }
                  aria-pressed={values.aspectRatio === ratio.name}
                  onClick={() => update("aspectRatio", ratio.name)}
                >
                  {ratio.name}
                </Button>
              ))}
            </div>
          </div>
          <KiraSelect
            aria-label="Capture format"
            options={[
              { value: "image/jpeg", label: "JPEG" },
              { value: "image/png", label: "PNG" },
              { value: "image/webp", label: "WebP" },
            ]}
            value={values.format}
            onChange={(format) => {
              if (
                format === "image/jpeg" ||
                format === "image/png" ||
                format === "image/webp"
              )
                update("format", format);
            }}
          />
          <Switch
            label="Mirror preview"
            description="Captured images stay unmirrored unless mirrorCapture is enabled."
            checked={values.mirror}
            onCheckedChange={(checked) => update("mirror", checked)}
          />
        </TabsContent>
        <CameraContentView6 values={values} update={update} />
        <CameraContentView7 values={values} update={update} />
      </Tabs>
      <Button variant="outline" onClick={onClose}>
        Close settings
      </Button>
    </div>
  );
}

CameraSettings.displayName = "CameraSettings";

interface CameraKeyboardHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customShortcuts?: Record<string, string[]>;
  customDescriptions?: Record<string, string>;
  className?: string;
}

function CameraKeyboardHelp({
  open,
  onOpenChange,
  customShortcuts = {},
  customDescriptions = {},
  className,
}: CameraKeyboardHelpProps) {
  const keys = Array.from(
    new Set([
      "capture",
      "record",
      "switchCamera",
      "toggleFlash",
      "cancel",
      ...Object.keys(customShortcuts),
    ]),
  );

  return (
    <CameraKeyboardHelpView
      open={open}
      onOpenChange={onOpenChange}
      className={className}
      keys={keys}
      customShortcuts={customShortcuts}
      customDescriptions={customDescriptions}
    />
  );
}

CameraKeyboardHelp.displayName = "CameraKeyboardHelp";

interface CameraStatusAnnouncerProps {
  status: CameraStatus;
  customMessages?: Partial<Record<CameraStatus, string>>;
  additionalMessage?: string;
  enabled?: boolean;
  politeness?: "polite" | "assertive";
  className?: string;
  showVisual?: boolean;
}

function CameraStatusAnnouncer({
  status,
  customMessages,
  additionalMessage,
  enabled = true,
  politeness = "polite",
  showVisual = false,
  className,
}: CameraStatusAnnouncerProps) {
  if (!enabled) return null;
  const message = customMessages?.[status] ?? STATUS_ANNOUNCEMENTS[status];

  return (
    <span
      data-slot="camera-status-announcer"
      role={politeness === "assertive" ? "alert" : "status"}
      aria-atomic="true"
      className={cn({ "sr-only": !showVisual }, className)}
    >
      {message}
      {additionalMessage ? ". " + additionalMessage : ""}
    </span>
  );
}

CameraStatusAnnouncer.displayName = "CameraStatusAnnouncer";

function getControlDescription(
  action: NonNullable<CameraButtonProps["action"]>,
  state?: { isRecording?: boolean; isFlashOn?: boolean },
): string {
  const descriptions: Record<
    NonNullable<CameraButtonProps["action"]>,
    string
  > = {
    capture: "Take a photo",
    record: state?.isRecording
      ? "Stop video recording"
      : "Start video recording",
    switch: "Switch between front and back camera",
    flash: state?.isFlashOn ? "Turn off camera torch" : "Turn on camera torch",
    timer: "Change capture timer",
    grid: "Change composition grid",
    settings: "Open camera settings",
    zoom: "Change camera zoom",
    aspectRatio: "Change aspect ratio",
  };

  return descriptions[action] ?? "";
}

interface CameraFocusIndicatorProps {
  point: { x: number; y: number } | null;
  isActive: boolean;
  isLocked?: boolean;
  indicatorStyle?: CameraFocusIndicatorStyle;
  size?: number;
  color?: string;
  lockedColor?: string;
  strokeWidth?: number;
  animationDuration?: number;
  className?: string;
}

function CameraFocusIndicator({
  point,
  isActive,
  isLocked: isLockedInput,
  indicatorStyle: indicatorStyleInput,
  size: sizeInput,
  color: colorInput,
  lockedColor: lockedColorInput,
  strokeWidth: strokeWidthInput,
  animationDuration: animationDurationInput,
  className,
}: CameraFocusIndicatorProps) {
  const { isLocked, indicatorStyle, size, color, lockedColor, strokeWidth } =
    useCameraFocusIndicatorOptions({
      isLocked: isLockedInput,
      indicatorStyle: indicatorStyleInput,
      size: sizeInput,
      color: colorInput,
      lockedColor: lockedColorInput,
      strokeWidth: strokeWidthInput,
    });

  const { animationDuration } = useCameraFocusIndicatorOptions2({
    animationDuration: animationDurationInput,
  });

  const reducedMotion = useReducedMotion();

  if (!point || !isActive) return null;
  const currentColor = isLocked ? lockedColor : color;

  return (
    <CameraFocusIndicatorView
      point={point}
      currentColor={currentColor}
      size={size}
      animationDuration={animationDuration}
      reducedMotion={reducedMotion}
      indicatorStyle={indicatorStyle}
      strokeWidth={strokeWidth}
      isLocked={isLocked}
      className={className}
    />
  );
}

function CameraFocusIndicatorView({
  point,
  currentColor,
  size,
  animationDuration,
  reducedMotion,
  indicatorStyle,
  strokeWidth,
  isLocked,
  className,
}: {
  point: { x: number; y: number };
  currentColor: string;
  size: number;
  animationDuration: number;
  reducedMotion: boolean;
  indicatorStyle: CameraFocusIndicatorStyle;
  strokeWidth: number;
  isLocked: boolean;
  className: string | undefined;
}) {
  return (
    <div
      data-slot="camera-focus-indicator"
      aria-hidden="true"
      className={cn("absolute pointer-events-none", className)}
      style={cameraFocusIndicatorStyle(
        point,
        currentColor,
        size,
        animationDuration,
        reducedMotion,
      )}
    >
      {(indicatorStyle === "ring" || indicatorStyle === "box") && (
        <span
          className={cn("absolute inset-0 border", {
            "rounded-full": indicatorStyle === "ring",
          })}
          style={{ borderColor: currentColor, borderWidth: strokeWidth }}
        />
      )}
      {indicatorStyle === "bracket" &&
        CAMERA_FOCUS_CORNERS.map((position) => (
          <span
            key={position}
            className={cn("absolute h-1/3 w-1/3", position)}
            style={{ borderColor: currentColor, borderWidth: strokeWidth }}
          />
        ))}
      {indicatorStyle === "crosshair" && (
        <>
          <span
            className="absolute inset-x-0 top-1/2 bg-current"
            style={{ height: strokeWidth }}
          />
          <span
            className="absolute inset-y-0 left-1/2 bg-current"
            style={{ width: strokeWidth }}
          />
        </>
      )}
      <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
      {isLocked && (
        <span className="absolute -right-1 -top-1 rounded-full bg-black px-1 text-xs text-white">
          ✓
        </span>
      )}
    </div>
  );
}

const CAMERA_FOCUS_CORNERS = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

function cameraFocusIndicatorStyle(
  point: { x: number; y: number },
  color: string,
  size: number,
  animationDuration: number,
  reducedMotion: boolean,
): React.CSSProperties {
  return {
    left: `calc(${Math.max(0, Math.min(1, point.x)) * 100}% - ${size / 2}px)`,
    top: `calc(${Math.max(0, Math.min(1, point.y)) * 100}% - ${size / 2}px)`,
    width: size,
    height: size,
    color,
    transition: reducedMotion
      ? undefined
      : `opacity ${Math.max(0, Math.min(400, animationDuration))}ms ease-out`,
  };
}

CameraFocusIndicator.displayName = "CameraFocusIndicator";

interface CameraZoomIndicatorProps {
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  format?: "multiplier" | "percentage";
  showBar?: boolean;
  showOnChange?: boolean;
  hideDelay?: number;
  alwaysVisible?: boolean;
  className?: string;
}

function CameraZoomIndicator(arg0: CameraZoomIndicatorProps) {
  const model = useCameraZoomIndicatorModel(arg0);

  return <CameraZoomIndicatorView {...model} />;
}

CameraZoomIndicator.displayName = "CameraZoomIndicator";

interface CameraVoiceControlProps {
  enabled: boolean;
  language?: string;
  onCommand?: (
    command: CameraVoiceCommand,
    phrase: string,
    confidence: number,
  ) => void;
  showListeningIndicator?: boolean;
  showCommandFeedback?: boolean;
  feedbackDuration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

function CameraVoiceControl({
  enabled: enabledInput,
  language: languageInput,
  onCommand,
  showListeningIndicator: showListeningIndicatorInput,
  showCommandFeedback: showCommandFeedbackInput,
  feedbackDuration: feedbackDurationInput,
  position: positionInput,
  className,
}: CameraVoiceControlProps) {
  const {
    enabled,
    language,
    showListeningIndicator,
    showCommandFeedback,
    feedbackDuration,
    position,
  } = useCameraVoiceControlOptions({
    enabled: enabledInput,
    language: languageInput,
    showListeningIndicator: showListeningIndicatorInput,
    showCommandFeedback: showCommandFeedbackInput,
    feedbackDuration: feedbackDurationInput,
    position: positionInput,
  });

  const { isVoiceListening, isVoiceSupported, status } = useCameraState();
  const { startVoiceListening, stopVoiceListening } = useCameraActions();

  const [feedback, setFeedback] = React.useState<{
    command: CameraVoiceCommand;
    confidence: number;
  } | null>(null);

  const feedbackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const reduced = useReducedMotion();
  React.useEffect(
    () => () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      stopVoiceListening();
    },
    [stopVoiceListening],
  );

  if (!enabled) return null;

  const receiveCommand: UseCameraOptions["onVoiceCommand"] = (
    command,
    phrase,
    confidence,
  ) =>
    cameraReceiveCommand(
      command,
      phrase,
      confidence,
      onCommand,
      setFeedback,
      feedbackTimer,
      feedbackDuration,
    );

  return (
    <CameraVoiceControlView
      language={language}
      showListeningIndicator={showListeningIndicator}
      showCommandFeedback={showCommandFeedback}
      position={position}
      className={className}
      isVoiceListening={isVoiceListening}
      isVoiceSupported={isVoiceSupported}
      status={status}
      startVoiceListening={startVoiceListening}
      stopVoiceListening={stopVoiceListening}
      receiveCommand={receiveCommand}
      reduced={reduced}
      feedback={feedback}
    />
  );
}

const CAMERA_VOICE_CONTROL_POSITIONS = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

function CameraVoiceControlView({
  language,
  showListeningIndicator,
  showCommandFeedback,
  position,
  className,
  isVoiceListening,
  isVoiceSupported,
  status,
  startVoiceListening,
  stopVoiceListening,
  receiveCommand,
  reduced,
  feedback,
}: {
  language: string;
  showListeningIndicator: boolean;
  showCommandFeedback: boolean;
  position: NonNullable<CameraVoiceControlProps["position"]>;
  className: string | undefined;
  isVoiceListening: boolean;
  isVoiceSupported: boolean;
  status: CameraStatus;
  startVoiceListening: ReturnType<
    typeof useCameraActions
  >["startVoiceListening"];
  stopVoiceListening: ReturnType<typeof useCameraActions>["stopVoiceListening"];
  receiveCommand: UseCameraOptions["onVoiceCommand"];
  reduced: boolean;
  feedback: { command: CameraVoiceCommand; confidence: number } | null;
}) {
  return (
    <div
      data-slot="camera-voice-control"
      className={cn(
        "absolute flex max-w-full flex-col gap-2",
        CAMERA_VOICE_CONTROL_POSITIONS[position],
        className,
      )}
      data-language={language}
    >
      {showListeningIndicator && (
        <Button
          variant="secondary"
          size="sm"
          aria-pressed={isVoiceListening}
          disabled={
            !isVoiceSupported || (status !== "ready" && !isVoiceListening)
          }
          aria-label={
            isVoiceListening ? "Stop voice control" : "Start voice control"
          }
          onClick={() =>
            isVoiceListening
              ? stopVoiceListening()
              : startVoiceListening(language, receiveCommand)
          }
          className={cn({ "transition-colors duration-150": !reduced })}
        >
          {isVoiceListening ? (
            <IconMicrophone aria-hidden="true" />
          ) : (
            <IconMicrophoneOff aria-hidden="true" />
          )}
          {isVoiceListening ? "Listening" : "Voice control"}
        </Button>
      )}
      <CameraVoiceStatusView
        isVoiceSupported={isVoiceSupported}
        showCommandFeedback={showCommandFeedback}
        feedback={feedback}
      />
    </div>
  );
}

function CameraVoiceStatusView({
  isVoiceSupported,
  showCommandFeedback,
  feedback,
}: {
  isVoiceSupported: boolean;
  showCommandFeedback: boolean;
  feedback: { command: CameraVoiceCommand; confidence: number } | null;
}) {
  return (
    <>
      {!isVoiceSupported && (
        <p
          data-slot="camera-voice-unavailable"
          className="rounded-md bg-background p-2 text-xs text-foreground"
        >
          Voice control is unavailable. Use the camera buttons.
        </p>
      )}
      {showCommandFeedback && feedback && (
        <p
          data-slot="camera-voice-feedback"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
          role="status"
          className="rounded-md bg-background p-2 text-sm text-foreground"
        >
          {feedback.command} command received
        </p>
      )}
    </>
  );
}

CameraVoiceControl.displayName = "CameraVoiceControl";

interface CameraErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  className?: string;
}

interface CameraErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class CameraErrorBoundary extends Component<
  CameraErrorBoundaryProps,
  CameraErrorBoundaryState
> {
  constructor(props: CameraErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): CameraErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    const { children, fallback, className } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      if (fallback) {
        if (isFunctionProp(fallback)) {
          return fallback(error, this.handleReset);
        }

        return fallback;
      }

      return (
        <div
          data-slot="camera-error-boundary"
          className={cn(
            "flex flex-col items-center justify-center gap-4 p-6 rounded-lg",
            "bg-destructive/10 border border-destructive/20",
            "text-center",
            className,
          )}
          role="alert"
          aria-live="assertive"
        >
          <div className="p-3 rounded-full bg-destructive/20">
            <IconAlertTriangle
              className="w-8 h-8 text-destructive"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-destructive">Camera Error</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {error.message || "An unexpected error occurred with the camera."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={this.handleReset}
            className="gap-2"
          >
            <IconRefresh className="w-4 h-4" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      );
    }

    return children;
  }
}

const Camera = Object.assign(CameraRoot, {
  Preview: CameraPreview,
  Overlay: CameraOverlay,
  CaptureFlash: CameraCaptureFlash,
  Button: CameraButton,
  CaptureButton,
  RecordButton,
  FlashButton,
  SwitchCameraButton,
  TimerButton,
  GridButton,
  SettingsButton,
  AspectRatioButton,
  ZoomButton,
  Controls: CameraControls,
  ControlBar: CameraControlBar,
  ControlBarGroup: CameraControlBarGroup,
  ControlBarDivider: CameraControlBarDivider,
  Guide: CameraGuide,
  Grid: CameraGrid,
  ScanOverlay: CameraScanOverlay,
  Timer: CameraTimer,
  Permissions: CameraPermissions,
  Settings: CameraSettings,
  KeyboardHelp: CameraKeyboardHelp,
  StatusAnnouncer: CameraStatusAnnouncer,
  FocusIndicator: CameraFocusIndicator,
  ZoomIndicator: CameraZoomIndicator,
  VoiceControl: CameraVoiceControl,
  ErrorBoundary: CameraErrorBoundary,
});

type CameraReviewCapture =
  | (Omit<CaptureResult, "type"> & {
      type: CaptureResult["type"];
      source: "camera";
      fileName?: string;
    })
  | (Omit<CaptureResult, "type"> & {
      type: string;
      source: "file";
      fileName?: string;
    });

type CameraReviewPhase =
  | { status: "capture"; message?: string; messageKind?: "error" | "info" }
  | { status: "selecting" }
  | {
      status: "review";
      capture: CameraReviewCapture;
      message?: string;
      messageKind?: "error" | "info";
    }
  | { status: "accepting"; capture: CameraReviewCapture }
  | { status: "accepted"; capture: CameraReviewCapture };

interface KiraCameraProps extends Omit<
  CameraProps,
  "children" | "onCapture" | "autoStart" | "announceStatus"
> {
  label?: string;
  description?: string;
  /** Caller owns this initial preview URL. New capture URLs belong to this workflow. */
  defaultCapture?: CameraReviewCapture;
  onAccept: (
    capture: CameraReviewCapture,
    signal: AbortSignal,
  ) => void | Promise<void>;
  acceptLabel?: string;
  successMessage?: string;
  allowFileSelection?: boolean;
  maxFileSize?: number;
  guidePreset?: GuidePreset;
  disabled?: boolean;
  disabledReason?: string;
}

function readImageDimensions(
  url: string,
  signal: AbortSignal,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener("abort", cancel);
    };

    const cancel = () => {
      cleanup();
      image.src = "";
      reject(new DOMException("Image selection cancelled", "AbortError"));
    };

    image.onload = () => {
      cleanup();
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => {
      cleanup();
      reject(
        new Error(
          "This image could not be opened. Choose a JPEG, PNG or another image your browser supports.",
        ),
      );
    };

    if (signal.aborted) {
      cancel();

      return;
    }

    signal.addEventListener("abort", cancel, { once: true });
    image.src = url;
  });
}

function KiraCamera(arg0: KiraCameraProps) {
  const model = useKiraCameraModel(arg0);

  return <KiraCameraView {...model} />;
}

export {
  Camera,
  KiraCamera,
  CameraPreview,
  CameraOverlay,
  CameraCaptureFlash,
  CameraButton,
  CaptureButton,
  RecordButton,
  FlashButton,
  SwitchCameraButton,
  TimerButton,
  GridButton,
  SettingsButton,
  AspectRatioButton,
  ZoomButton,
  CameraControls,
  CameraControlBar,
  CameraControlBarGroup,
  CameraControlBarDivider,
  CameraGuide,
  CameraGrid,
  CameraScanOverlay,
  CameraTimer,
  CameraPermissions,
  CameraSettings,
  CameraKeyboardHelp,
  CameraStatusAnnouncer,
  CameraFocusIndicator,
  CameraZoomIndicator,
  CameraVoiceControl,
  CameraErrorBoundary,
  // Hooks (re-exported from context)
  useCameraState,
  useCameraActions,
  useCameraContext,
  // Utilities
  getControlDescription,
  // Variants
  cameraVariants,
  cameraButtonVariants,
  cameraControlsVariants,
  cameraGuideVariants,
  cameraPermissionsVariants,
  controlBarVariants,
  // Constants from lib
  CAMERA_DEFAULT_SETTINGS,
  GRID_ICONS,
  BUTTON_ICON_SIZES,
  SCAN_OVERLAY_DEFAULTS,
};

// Re-export types from lib
export type {
  CameraTimerDuration,
  CameraGridType,
  CameraSettingsValues,
  CameraAspectRatio,
  CameraQuality,
  CameraScanOverlayPreset,
  CameraScanOverlayConfig,
} from "@/lib/camera/types";

export type {
  KiraCameraProps,
  CameraReviewCapture,
  CameraReviewPhase,
  CameraProps,
  CameraRef,
  CameraPreviewProps,
  CameraOverlayProps,
  CameraCaptureFlashProps,
  CameraButtonProps,
  CaptureButtonProps,
  RecordButtonProps,
  FlashButtonProps,
  SwitchCameraButtonProps,
  TimerButtonProps,
  GridButtonProps,
  SettingsButtonProps,
  AspectRatioButtonProps,
  ZoomButtonProps,
  CameraControlsProps,
  CameraControlBarProps,
  CameraControlBarGroupProps,
  CameraGuideProps,
  CameraGridProps,
  CameraTimerProps,
  CameraScanOverlayProps,
  CameraPermissionsProps,
  CameraSettingsProps,
  CameraKeyboardHelpProps,
  CameraStatusAnnouncerProps,
  CameraFocusIndicatorProps,
  CameraZoomIndicatorProps,
  CameraVoiceControlProps,
  CameraErrorBoundaryProps,
  CameraState,
  CameraActions,
};

function cameraValueValue(
  isLoading: boolean | undefined,
  finalIconSize: number,
  reducedMotion: boolean,
  showLabel: boolean,
  label: string | undefined,
  labelPosition: "bottom" | "right" | "top" | "left",
  renderIcon: () => React.JSX.Element | null,
  children: React.ReactNode,
) {
  if (isLoading) {
    return (
      <span
        data-slot="camera-button-loader"
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center"
        style={{ width: finalIconSize, height: finalIconSize }}
      >
        <IconLoader2
          className={cn("size-full", { "animate-spin": !reducedMotion })}
        />
      </span>
    );
  }

  if (showLabel && label) {
    return (
      <span
        className={cn(
          "flex items-center gap-1",
          { "flex-col": labelPosition === "bottom" },
          { "flex-col-reverse": labelPosition === "top" },
        )}
      >
        {renderIcon()}
        <span className="text-xs font-medium">{label}</span>
      </span>
    );
  }

  return (
    <>
      {renderIcon()}
      {children}
    </>
  );
}

function cameraArialabelValue(zoomAction: "in" | "out" | "reset") {
  if (zoomAction === "in") {
    return "Zoom in";
  }

  if (zoomAction === "out") {
    return "Zoom out";
  }

  return "Reset zoom";
}

function cameraValueValue2(
  guideConfig: Pick<CameraGuideConfig, "width" | "height" | "aspectRatio">,
) {
  if (guideConfig.width && guideConfig.height) {
    return `${guideConfig.width}×${guideConfig.height}`;
  }

  if (guideConfig.aspectRatio) {
    return `AR ${guideConfig.aspectRatio}`;
  }

  return "Custom";
}

function cameraRatioValue(
  preset: CameraScanOverlayPreset,
  documentAspectRatio: number | undefined,
  documentType: "passport" | "drivers-license" | "custom" | "national-id",
) {
  if (preset === "face-recognition") {
    return 0.75;
  }

  if (
    documentAspectRatio &&
    Number.isFinite(documentAspectRatio) &&
    documentAspectRatio > 0
  ) {
    return documentAspectRatio;
  }

  return getGuidePreset(documentTypeToPreset[documentType]).aspectRatio ?? 1.5;
}

function cameraValueValue3(
  status: CameraScanOverlayStatus,
  isProcessing: boolean,
  isAligned: boolean,
) {
  if (status === "success") {
    return "Captured";
  }

  if (status === "error") {
    return "Try again";
  }

  if (isProcessing || status === "processing") {
    return "Processing…";
  }

  if (isAligned) {
    return "Frame aligned";
  }

  return "Position in frame";
}

function cameraCurrentStepValue(
  phase: CameraReviewPhase,
  review: CameraReviewCapture | null,
) {
  if (phase.status === "accepted" || phase.status === "accepting") {
    return 2;
  }

  if (review) {
    return 1;
  }

  return 0;
}

function cameraStatusMessageValue(
  disabled: boolean,
  phase: CameraReviewPhase,
  successMessage: string,
) {
  if (disabled) {
    return "Camera capture is disabled.";
  }

  if (phase.status === "accepted") {
    return successMessage;
  }

  if (phase.status === "accepting") {
    return "Accepting image…";
  }

  if (phase.status === "selecting") {
    return "Preparing image…";
  }

  return (
    phase.message ||
    (phase.status === "review"
      ? "Review the image, then accept or retake it."
      : "Start the camera or choose an image from your device.")
  );
}

function cameraDatatoneValue(hasError: boolean, phase: CameraReviewPhase) {
  if (hasError) {
    return "error";
  }

  if (phase.status === "accepted") {
    return "success";
  }

  return "info";
}

function cameraValueValue4(hasError: boolean, phase: CameraReviewPhase) {
  if (hasError) {
    return "bg-destructive/10 text-foreground";
  }

  if (phase.status === "accepted") {
    return "bg-success/10 text-foreground";
  }

  return "bg-muted/50 text-muted-foreground";
}

function cameraValueValue5(hasError: boolean, phase: CameraReviewPhase) {
  if (hasError) {
    return (
      <IconAlertCircle
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-destructive"
      />
    );
  }

  if (phase.status === "accepted") {
    return (
      <IconCheck
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-success"
      />
    );
  }

  return <IconPhoto aria-hidden="true" className="mt-0.5 size-4 shrink-0" />;
}

function resolveCameraOptions({
  mode = "selfie",
  autoStart = false,
  enableKeyboardShortcuts = false,
  enableGestures = false,
  enableVoiceControl = false,
  mirrorCapture = false,
}: {
  mode?: CameraProps["mode"];
  autoStart?: CameraProps["autoStart"];
  enableKeyboardShortcuts?: CameraProps["enableKeyboardShortcuts"];
  enableGestures?: CameraProps["enableGestures"];
  enableVoiceControl?: CameraProps["enableVoiceControl"];
  mirrorCapture?: CameraProps["mirrorCapture"];
}) {
  return {
    mode,
    autoStart,
    enableKeyboardShortcuts,
    enableGestures,
    enableVoiceControl,
    mirrorCapture,
  };
}

function resolveCameraOptions2({
  enableHaptics = true,
  announceStatus = true,
  captureQuality = 0.95,
  captureFormat = "image/jpeg",
}: {
  enableHaptics?: CameraProps["enableHaptics"];
  announceStatus?: CameraProps["announceStatus"];
  captureQuality?: CameraProps["captureQuality"];
  captureFormat?: CameraProps["captureFormat"];
}) {
  return { enableHaptics, announceStatus, captureQuality, captureFormat };
}

type ResolvedCameraButtonOptions = {
  labelPosition: NonNullable<CameraButtonProps["labelPosition"]>;
  showLabel: NonNullable<CameraButtonProps["showLabel"]>;
  indicator: NonNullable<CameraButtonProps["indicator"]>;
  hapticPattern: NonNullable<CameraButtonProps["hapticPattern"]>;
  pressAnimation: NonNullable<CameraButtonProps["pressAnimation"]>;
};

function resolveCameraOptions3({
  labelPosition = "bottom",
  showLabel = false,
  indicator = "none",
  hapticPattern = "light",
  pressAnimation = "scale",
}: {
  labelPosition?: CameraButtonProps["labelPosition"];
  showLabel?: CameraButtonProps["showLabel"];
  indicator?: CameraButtonProps["indicator"];
  hapticPattern?: CameraButtonProps["hapticPattern"];
  pressAnimation?: CameraButtonProps["pressAnimation"];
}): ResolvedCameraButtonOptions {
  return { labelPosition, showLabel, indicator, hapticPattern, pressAnimation };
}

function resolveCameraOptions4({
  isRecording = false,
  size = "md",
  showTimeBadge = false,
  recordingDuration = 0,
}: {
  isRecording?: boolean;
  size?: "sm" | "md" | "lg";
  showTimeBadge?: boolean;
  recordingDuration?: number;
}) {
  return { isRecording, size, showTimeBadge, recordingDuration };
}

function resolveCameraOptions5({
  showCapture = true,
  showRecord = false,
  showSwitch = true,
  showFlash = true,
  autoHide = true,
}: {
  showCapture?: CameraControlsProps["showCapture"];
  showRecord?: CameraControlsProps["showRecord"];
  showSwitch?: CameraControlsProps["showSwitch"];
  showFlash?: CameraControlsProps["showFlash"];
  autoHide?: CameraControlsProps["autoHide"];
}) {
  return { showCapture, showRecord, showSwitch, showFlash, autoHide };
}

function resolveCameraGuideOptions({
  isAligned = false,
  showInstruction = true,
  instructionPosition = "bottom",
  showAlignmentIndicator = true,
  alignmentIndicatorPosition = "top-right",
  showMeasurements = false,
}: {
  isAligned?: CameraGuideProps["isAligned"];
  showInstruction?: CameraGuideProps["showInstruction"];
  instructionPosition?: CameraGuideProps["instructionPosition"];
  showAlignmentIndicator?: CameraGuideProps["showAlignmentIndicator"];
  alignmentIndicatorPosition?: CameraGuideProps["alignmentIndicatorPosition"];
  showMeasurements?: CameraGuideProps["showMeasurements"];
}) {
  return {
    isAligned,
    showInstruction,
    instructionPosition,
    showAlignmentIndicator,
    alignmentIndicatorPosition,
    showMeasurements,
  };
}

function resolveCameraGuideOptions2({
  showCenterCross = false,
}: {
  showCenterCross?: CameraGuideProps["showCenterCross"];
}) {
  return { showCenterCross };
}

function resolveCameraGridOptions({
  visible = true,
  type = CAMERA_DEFAULT_GRID.type,
  color = CAMERA_DEFAULT_GRID.color,
  opacity = CAMERA_DEFAULT_GRID.opacity,
  lineWidth = CAMERA_DEFAULT_GRID.lineWidth,
  showIntersectionDots = CAMERA_DEFAULT_GRID.showIntersectionDots,
}: {
  visible?: CameraGridProps["visible"];
  type?: CameraGridProps["type"];
  color?: CameraGridProps["color"];
  opacity?: CameraGridProps["opacity"];
  lineWidth?: CameraGridProps["lineWidth"];
  showIntersectionDots?: CameraGridProps["showIntersectionDots"];
}) {
  return { visible, type, color, opacity, lineWidth, showIntersectionDots };
}

function resolveCameraGridOptions2({
  dotSize = CAMERA_DEFAULT_GRID.dotSize,
  animated = CAMERA_DEFAULT_GRID.animated,
}: {
  dotSize?: CameraGridProps["dotSize"];
  animated?: CameraGridProps["animated"];
}) {
  return { dotSize, animated };
}

function resolveCameraScanOverlayOptions({
  isAligned = false,
  isScanning = true,
  isProcessing = false,
  status = "scanning",
  showStatusText = true,
  documentType = "national-id",
}: {
  isAligned?: CameraScanOverlayProps["isAligned"];
  isScanning?: CameraScanOverlayProps["isScanning"];
  isProcessing?: CameraScanOverlayProps["isProcessing"];
  status?: CameraScanOverlayProps["status"];
  showStatusText?: CameraScanOverlayProps["showStatusText"];
  documentType?: CameraScanOverlayProps["documentType"];
}) {
  return {
    isAligned,
    isScanning,
    isProcessing,
    status,
    showStatusText,
    documentType,
  };
}

function resolveCameraTimerOptions({
  timerStyle = "circular",
  size = "md",
  color = "var(--color-background)",
  backgroundColor = "var(--color-foreground)",
  animated = true,
  showPulse = true,
}: {
  timerStyle?: CameraTimerProps["timerStyle"];
  size?: CameraTimerProps["size"];
  color?: CameraTimerProps["color"];
  backgroundColor?: CameraTimerProps["backgroundColor"];
  animated?: CameraTimerProps["animated"];
  showPulse?: CameraTimerProps["showPulse"];
}) {
  return { timerStyle, size, color, backgroundColor, animated, showPulse };
}

function resolveCameraOptions6({
  requestingTitle = "Camera Access",
  requestingDescription = "Please allow camera access when prompted",
  deniedTitle = "Camera Access Denied",
  deniedDescription = "Please enable camera access in your browser settings to continue.",
  errorTitle = "Camera Error",
  errorDescription = "Unable to access the camera. Please try again.",
}: {
  requestingTitle?: string;
  requestingDescription?: string;
  deniedTitle?: string;
  deniedDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
}) {
  return {
    requestingTitle,
    requestingDescription,
    deniedTitle,
    deniedDescription,
    errorTitle,
    errorDescription,
  };
}

function resolveCameraOptions7({
  showHelpLink = true,
  alwaysShow = false,
}: {
  showHelpLink?: boolean;
  alwaysShow?: boolean;
}) {
  return { showHelpLink, alwaysShow };
}

function resolveCameraFocusIndicatorOptions({
  isLocked = false,
  indicatorStyle = CAMERA_DEFAULT_FOCUS.indicatorStyle,
  size = CAMERA_DEFAULT_FOCUS.indicatorSize,
  color = CAMERA_DEFAULT_FOCUS.indicatorColor,
  lockedColor = CAMERA_DEFAULT_FOCUS.lockedColor,
  strokeWidth = 2,
}: {
  isLocked?: CameraFocusIndicatorProps["isLocked"];
  indicatorStyle?: CameraFocusIndicatorProps["indicatorStyle"];
  size?: CameraFocusIndicatorProps["size"];
  color?: CameraFocusIndicatorProps["color"];
  lockedColor?: CameraFocusIndicatorProps["lockedColor"];
  strokeWidth?: CameraFocusIndicatorProps["strokeWidth"];
}) {
  return { isLocked, indicatorStyle, size, color, lockedColor, strokeWidth };
}

function resolveCameraFocusIndicatorOptions2({
  animationDuration = 200,
}: {
  animationDuration?: CameraFocusIndicatorProps["animationDuration"];
}) {
  return { animationDuration };
}

function resolveCameraZoomIndicatorOptions({
  minZoom = CAMERA_DEFAULT_ZOOM.min,
  maxZoom = CAMERA_DEFAULT_ZOOM.max,
  position = "top-right",
  format = "multiplier",
  showBar = true,
  showOnChange = true,
}: {
  minZoom?: CameraZoomIndicatorProps["minZoom"];
  maxZoom?: CameraZoomIndicatorProps["maxZoom"];
  position?: CameraZoomIndicatorProps["position"];
  format?: CameraZoomIndicatorProps["format"];
  showBar?: CameraZoomIndicatorProps["showBar"];
  showOnChange?: CameraZoomIndicatorProps["showOnChange"];
}) {
  return { minZoom, maxZoom, position, format, showBar, showOnChange };
}

function resolveCameraZoomIndicatorOptions2({
  hideDelay = 2000,
  alwaysVisible = false,
}: {
  hideDelay?: CameraZoomIndicatorProps["hideDelay"];
  alwaysVisible?: CameraZoomIndicatorProps["alwaysVisible"];
}) {
  return { hideDelay, alwaysVisible };
}

function resolveCameraVoiceControlOptions({
  enabled = false,
  language = "en-US",
  showListeningIndicator = true,
  showCommandFeedback = true,
  feedbackDuration = 2000,
  position = "top-left",
}: {
  enabled?: CameraVoiceControlProps["enabled"];
  language?: CameraVoiceControlProps["language"];
  showListeningIndicator?: CameraVoiceControlProps["showListeningIndicator"];
  showCommandFeedback?: CameraVoiceControlProps["showCommandFeedback"];
  feedbackDuration?: CameraVoiceControlProps["feedbackDuration"];
  position?: CameraVoiceControlProps["position"];
}) {
  return {
    enabled,
    language,
    showListeningIndicator,
    showCommandFeedback,
    feedbackDuration,
    position,
  };
}

function resolveKiraCameraOptions({
  label = "Capture image",
  description = "Keep the subject readable and review the image before accepting.",
  acceptLabel = "Accept image",
  successMessage = "Image accepted.",
  allowFileSelection = true,
  maxFileSize = 10 * 1024 * 1024,
}: {
  label?: KiraCameraProps["label"];
  description?: KiraCameraProps["description"];
  acceptLabel?: KiraCameraProps["acceptLabel"];
  successMessage?: KiraCameraProps["successMessage"];
  allowFileSelection?: KiraCameraProps["allowFileSelection"];
  maxFileSize?: KiraCameraProps["maxFileSize"];
}) {
  return {
    label,
    description,
    acceptLabel,
    successMessage,
    allowFileSelection,
    maxFileSize,
  };
}

function resolveKiraCameraOptions2({
  disabled = false,
  facingMode = "environment",
  mode = "photo",
}: {
  disabled?: KiraCameraProps["disabled"];
  facingMode?: KiraCameraProps["facingMode"];
  mode?: KiraCameraProps["mode"];
}) {
  return { disabled, facingMode, mode };
}

function CameraContentView({
  reducedMotion,
  status,
}: {
  reducedMotion: boolean;
  status: CameraStatus;
}) {
  return (
    <div
      className={cn("absolute inset-0 bg-muted", {
        "animate-pulse": !reducedMotion,
      })}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div
            className={cn(
              "w-12 h-12 border-4 border-muted-foreground/30 border-t-muted-foreground rounded-full",
              { "animate-spin": !reducedMotion },
            )}
          />
          <span className="text-sm">
            {status === "requesting-permission"
              ? "Requesting permission..."
              : "Initializing camera..."}
          </span>
        </div>
      </div>
    </div>
  );
}

function CameraControlsPrimaryView({
  showCapture,
  captureButtonRef,
  handleCapture,
  isReady,
  showRecord,
  isRecording,
  handleRecord,
}: {
  showCapture: boolean;
  captureButtonRef: React.RefObject<HTMLButtonElement | null>;
  handleCapture: () => void;
  isReady: boolean;
  showRecord: boolean;
  isRecording: boolean;
  handleRecord: () => Promise<void>;
}) {
  return (
    <div
      data-slot="camera-controls-primary"
      className="flex items-center justify-center gap-3"
    >
      {showCapture && (
        <div className="flex flex-col items-center gap-1">
          <CaptureButton
            ref={captureButtonRef}
            size="sm"
            onClick={handleCapture}
            disabled={!isReady}
            className="size-14 min-h-14 min-w-14 @min-[24rem]/camera-controls:size-16 @min-[24rem]/camera-controls:min-h-16 @min-[24rem]/camera-controls:min-w-16"
          />
          <span aria-hidden="true" className="text-xs font-medium">
            Photo
          </span>
        </div>
      )}
      {showRecord && (
        <div className="flex flex-col items-center gap-1">
          <RecordButton
            size="sm"
            isRecording={isRecording}
            onClick={handleRecord}
            disabled={!isReady && !isRecording}
            aria-label={isRecording ? "Stop recording" : "Record video"}
            aria-pressed={isRecording}
            className={cn(
              showCapture
                ? "size-11 min-h-11 min-w-11"
                : "size-14 min-h-14 min-w-14",
            )}
          />
          <span aria-hidden="true" className="text-xs font-medium tabular-nums">
            {isRecording ? "Recording" : "Video"}
          </span>
        </div>
      )}
    </div>
  );
}

function CameraContentView2({
  animationStyles,
  cs,
  strokeStyle,
}: {
  animationStyles: React.CSSProperties;
  cs: number;
  strokeStyle: React.CSSProperties;
}) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={animationStyles}
    >
      <path d={`M ${cs} 2 L 2 2 L 2 ${cs}`} fill="none" style={strokeStyle} />
      <path
        d={`M ${100 - cs} 2 L 98 2 L 98 ${cs}`}
        fill="none"
        style={strokeStyle}
      />
      <path
        d={`M 2 ${100 - cs} L 2 98 L ${cs} 98`}
        fill="none"
        style={strokeStyle}
      />
      <path
        d={`M 98 ${100 - cs} L 98 98 L ${100 - cs} 98`}
        fill="none"
        style={strokeStyle}
      />
    </svg>
  );
}

function CameraContentView3({ currentColor }: { currentColor: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line
        x1="50"
        y1="48"
        x2="50"
        y2="52"
        stroke={currentColor}
        strokeWidth={1}
      />
      <line
        x1="48"
        y1="50"
        x2="52"
        y2="50"
        stroke={currentColor}
        strokeWidth={1}
      />
    </svg>
  );
}

function CameraContentView4({
  animationClass,
  goldenX,
  lineStyle,
  goldenY,
}: {
  animationClass: "" | "animate-in fade-in-0 duration-200";
  goldenX: number;
  lineStyle: React.CSSProperties;
  goldenY: number;
}) {
  return (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1={goldenX} y1="0" x2={goldenX} y2="100" style={lineStyle} />
      <line
        x1={100 - goldenX}
        y1="0"
        x2={100 - goldenX}
        y2="100"
        style={lineStyle}
      />
      <line x1="0" y1={goldenY} x2="100" y2={goldenY} style={lineStyle} />
      <line
        x1="0"
        y1={100 - goldenY}
        x2="100"
        y2={100 - goldenY}
        style={lineStyle}
      />
    </svg>
  );
}

function CameraTimerTrackView({ progress }: { progress: number }) {
  return (
    <svg
      data-slot="camera-timer-track"
      className="absolute inset-0 size-full -rotate-90"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="3"
      />
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray={2 * Math.PI * 46}
        strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
      />
    </svg>
  );
}

function CameraContentView5({
  values,
  onValuesChange,
}: {
  values: CameraSettingsValues;
  onValuesChange: (values: CameraSettingsValues) => void;
}) {
  return (
    <div // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-label="Photo quality"
      className="space-y-2"
    >
      <p className="text-sm font-medium">Quality</p>
      <div className="flex flex-wrap gap-2">
        {QUALITY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={values.quality === option.value ? "secondary" : "outline"}
            aria-pressed={values.quality === option.value}
            onClick={() =>
              onValuesChange({
                ...values,
                quality: option.value,
                format:
                  option.value === "lossless" ? "image/png" : "image/jpeg",
              })
            }
          >
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function CameraContentView6({
  values,
  update,
}: {
  values: CameraSettingsValues;
  update: <K extends keyof CameraSettingsValues>(
    key: K,
    value: CameraSettingsValues[K],
  ) => void;
}) {
  return (
    <TabsContent value="guides" className="space-y-4 pt-4">
      <div // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
        role="group"
        aria-label="Composition grid"
        className="space-y-2"
      >
        <p className="text-sm font-medium">Composition grid</p>
        <div className="flex flex-wrap gap-2">
          {GRID_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={values.grid === option.value ? "secondary" : "outline"}
              aria-pressed={values.grid === option.value}
              onClick={() => update("grid", option.value)}
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>
      <div // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
        role="group"
        aria-label="Capture timer"
        className="space-y-2"
      >
        <p className="text-sm font-medium">Capture timer</p>
        <div className="flex flex-wrap gap-2">
          {TIMER_DURATIONS.map((duration) => (
            <Button
              key={duration}
              size="sm"
              variant={values.timer === duration ? "secondary" : "outline"}
              aria-pressed={values.timer === duration}
              onClick={() => update("timer", duration)}
            >
              {duration === 0 ? "Off" : duration + " seconds"}
            </Button>
          ))}
        </div>
      </div>
      <Switch
        label="Show alignment indicator"
        checked={values.showAlignmentIndicator}
        onCheckedChange={(checked) => update("showAlignmentIndicator", checked)}
      />
    </TabsContent>
  );
}

function CameraContentView7({
  values,
  update,
}: {
  values: CameraSettingsValues;
  update: <K extends keyof CameraSettingsValues>(
    key: K,
    value: CameraSettingsValues[K],
  ) => void;
}) {
  return (
    <TabsContent value="accessibility" className="space-y-4 pt-4">
      <Switch
        label="Enable voice controls"
        description="Microphone access starts only after pressing the voice button."
        checked={values.voiceControl}
        onCheckedChange={(checked) => update("voiceControl", checked)}
      />
      <Switch
        label="Haptic feedback"
        checked={values.haptics}
        onCheckedChange={(checked) => update("haptics", checked)}
      />
      <KiraSelect
        aria-label="Announcement detail"
        options={["minimal", "standard", "verbose"]}
        value={values.announcements}
        onChange={(detail) => {
          if (
            detail === "minimal" ||
            detail === "standard" ||
            detail === "verbose"
          )
            update("announcements", detail);
        }}
      />
    </TabsContent>
  );
}

function CameraKeyboardHelpView({
  open,
  onOpenChange,
  className,
  keys,
  customShortcuts,
  customDescriptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string | undefined;
  keys: string[];
  customShortcuts: Record<string, string[]>;
  customDescriptions: Record<string, string>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-slot="camera-keyboard-help" className={className}>
        <DialogHeader>
          <DialogTitle>Camera keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Enable keyboard shortcuts and focus the camera region. These keys
          leave text fields and other controls alone.
        </p>
        <div className="space-y-2">
          {keys.map((key) => {
            const shortcuts =
              customShortcuts[key] ?? keyboardShortcuts.get(key) ?? [];

            return (
              <div
                key={key}
                className="flex items-start justify-between gap-4 rounded-md bg-muted px-3 py-2 text-sm"
              >
                <span>
                  {customDescriptions[key] ??
                    Object.entries(KEYBOARD_DESCRIPTIONS).find(
                      ([action]) => action === key,
                    )?.[1] ??
                    key}
                </span>
                <kbd className="shrink-0 font-mono text-xs">
                  {shortcuts
                    .map((value) => (value === " " ? "Space" : value))
                    .join(" / ")}
                </kbd>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KiraCameraImageDetailsView({
  review,
}: {
  review: CameraReviewCapture;
}) {
  return (
    <div
      data-slot="kira-camera-image-details"
      className="space-y-1 text-xs text-muted-foreground"
    >
      {review.fileName && (
        <p
          data-slot="kira-camera-file-name"
          className="wrap-anywhere text-foreground"
        >
          {review.fileName}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {/* kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change) */}
        <span className="inline-flex items-center gap-1.5">
          {review.source === "camera" ? (
            // kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change)
            <IconCamera aria-hidden="true" className="size-3.5" />
          ) : (
            // kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change)
            <IconPhoto aria-hidden="true" className="size-3.5" />
          )}
          {review.source === "camera" ? "Camera photo" : "Chosen image"}
        </span>
        <span className="tabular-nums">
          {review.width} × {review.height} px
        </span>
        <span className="tabular-nums">
          {Math.round(review.blob.size / 1024)} KB
        </span>
      </div>
    </div>
  );
}

function CameraContentView8({
  acceptButtonRef,
  disabled,
  pending,
  phase,
  accept,
  reducedMotion,
  acceptLabel,
}: {
  acceptButtonRef: React.RefObject<HTMLButtonElement | null>;
  disabled: boolean;
  pending: boolean;
  phase: CameraReviewPhase;
  accept: () => Promise<void>;
  reducedMotion: boolean;
  acceptLabel: string;
}) {
  return (
    <Button
      ref={acceptButtonRef}
      disabled={disabled || pending}
      focusableWhenDisabled
      aria-busy={phase.status === "accepting" || undefined}
      onClick={() => {
        void accept();
      }}
      leftIcon={
        phase.status === "accepting" ? (
          <IconLoader2
            aria-hidden="true"
            className={cn("size-4", { "animate-spin": !reducedMotion })}
          />
        ) : (
          <IconCheck aria-hidden="true" className="size-4" />
        )
      }
      className="h-auto min-h-11 whitespace-normal py-2"
    >
      {phase.status === "accepting" ? "Accepting image…" : acceptLabel}
    </Button>
  );
}

function KiraCameraProgressView({
  currentStep,
  phase,
}: {
  currentStep: number;
  phase: CameraReviewPhase;
}) {
  return (
    <ol
      data-slot="kira-camera-progress"
      aria-label="Capture progress"
      className="grid grid-cols-3 gap-3 text-xs"
    >
      {["Capture", "Review", "Accept"].map((step, index) => {
        const completed = index < currentStep || phase.status === "accepted";
        const active = index === currentStep && phase.status !== "accepted";

        return (
          // kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change)
          <li
            key={step}
            data-slot="kira-camera-step"
            data-active={active || undefined}
            data-completed={completed || undefined}
            aria-current={active ? "step" : undefined}
            className={cn(
              "flex min-w-0 items-center gap-1.5 border-b-2 pb-2",
              completed || active
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full font-medium tabular-nums",
                active
                  ? "bg-primary/10 text-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {completed ? <IconCheck className="size-3" /> : index + 1}
            </span>
            <span className="min-w-0 break-words">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

function useCameraRootModel(
  {
    className,
    size,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: outline,
    mode: modeInput,
    facingMode: initialFacingMode,
    autoStart: autoStartInput,
    enableKeyboardShortcuts: enableKeyboardShortcutsInput,
    enableGestures: enableGesturesInput,
    enableVoiceControl: enableVoiceControlInput,
    constraints,
    mirrorCapture: mirrorCaptureInput,
    gestureOptions,
    voiceOptions,
    onVoiceCommand,
    onGestureStart,
    onGestureEnd,
    enableHaptics: enableHapticsInput,
    announceStatus: announceStatusInput,
    captureQuality: captureQualityInput,
    captureFormat: captureFormatInput,
    onCapture,
    onError,
    onStatusChange,
    onReady,
    children,
    ...props
  }: CameraProps,
  ref: React.ForwardedRef<CameraRef>,
) {
  const options = useCameraRootOptions({
    mode: modeInput,
    autoStart: autoStartInput,
    enableKeyboardShortcuts: enableKeyboardShortcutsInput,
    enableGestures: enableGesturesInput,
    enableVoiceControl: enableVoiceControlInput,
    mirrorCapture: mirrorCaptureInput,
    enableHaptics: enableHapticsInput,
    announceStatus: announceStatusInput,
    captureQuality: captureQualityInput,
    captureFormat: captureFormatInput,
  });

  const { enableKeyboardShortcuts, enableGestures, announceStatus } = options;

  const camera = useCameraRootController({
    options,
    facingMode: initialFacingMode,
    constraints,
    gestureOptions,
    voiceOptions,
    onVoiceCommand,
    onGestureStart,
    onGestureEnd,
    onCapture,
    onError,
    onStatusChange,
    onReady,
  });

  React.useImperativeHandle(ref, () => camera);

  return {
    onError,
    camera,
    enableKeyboardShortcuts,
    size,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: outline,
    className,
    enableGestures,
    props,
    children,
    announceStatus,
  };
}

function useCameraRootController({
  options,
  facingMode,
  constraints,
  gestureOptions,
  voiceOptions,
  onVoiceCommand,
  onGestureStart,
  onGestureEnd,
  onCapture,
  onError,
  onStatusChange,
  onReady,
}: {
  options: ReturnType<typeof useCameraRootOptions>;
  facingMode: CameraProps["facingMode"];
  constraints: CameraProps["constraints"];
  gestureOptions: CameraProps["gestureOptions"];
  voiceOptions: CameraProps["voiceOptions"];
  onVoiceCommand: CameraProps["onVoiceCommand"];
  onGestureStart: CameraProps["onGestureStart"];
  onGestureEnd: CameraProps["onGestureEnd"];
  onCapture: CameraProps["onCapture"];
  onError: CameraProps["onError"];
  onStatusChange: CameraProps["onStatusChange"];
  onReady: CameraProps["onReady"];
}) {
  const effectiveFacingMode =
    facingMode ?? (options.mode === "selfie" ? "user" : "environment");

  return useCamera({
    facingMode: effectiveFacingMode,
    autoStart: options.autoStart,
    enableKeyboardShortcuts: options.enableKeyboardShortcuts,
    enableHaptics: options.enableHaptics,
    enableGestures: options.enableGestures,
    enableVoiceControl: options.enableVoiceControl,
    constraints,
    mirrorCapture: options.mirrorCapture,
    gestureOptions,
    voiceOptions,
    onVoiceCommand,
    onGestureStart,
    onGestureEnd,
    captureQuality: options.captureQuality,
    captureFormat: options.captureFormat,
    onCapture,
    onError,
    onStatusChange: (status: CameraStatus) => {
      onStatusChange?.(status);

      if (status === "ready") onReady?.();
    },
  });
}

function useCameraRootOptions(input: {
  mode: CameraProps["mode"];
  autoStart: CameraProps["autoStart"];
  enableKeyboardShortcuts: CameraProps["enableKeyboardShortcuts"];
  enableGestures: CameraProps["enableGestures"];
  enableVoiceControl: CameraProps["enableVoiceControl"];
  mirrorCapture: CameraProps["mirrorCapture"];
  enableHaptics: CameraProps["enableHaptics"];
  announceStatus: CameraProps["announceStatus"];
  captureQuality: CameraProps["captureQuality"];
  captureFormat: CameraProps["captureFormat"];
}) {
  return {
    ...useCameraOptions(input),
    ...useCameraOptions2(input),
  };
}

function CameraRootView({
  onError,
  camera,
  enableKeyboardShortcuts,
  size,
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
  shape: outline,
  className,
  enableGestures,
  props,
  children,
  announceStatus,
}: ReturnType<typeof useCameraRootModel>) {
  return (
    <CameraErrorBoundary
      onError={(error) =>
        onError?.({
          code: "UNKNOWN_ERROR",
          message: error.message,
          recoverable: true,
        })
      }
    >
      <CameraStateContext.Provider value={camera}>
        <CameraActionsContext.Provider value={camera}>
          <div
            ref={camera.gestureContainerRef}
            data-slot="camera"
            // oxlint-disable-next-line react/refs -- The controller contains both reactive status and DOM refs; status is state, not a ref's current value.
            data-status={camera.status}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The named camera viewer takes focus for its documented keyboard shortcuts.
            tabIndex={enableKeyboardShortcuts ? 0 : undefined}
            className={cn(
              // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
              cameraVariants({ size, shape: outline, className }),
              "max-w-full motion-reduce:**:animate-none motion-reduce:**:transition-none",
              { "touch-none": enableGestures },
            )}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The named camera viewer is a keyboard shortcut and gesture container with a div ref contract.
            role="region"
            aria-label="Camera viewer"
            {...props}
          >
            {children}
            {announceStatus && <CameraStatusAnnouncer status={camera.status} />}
          </div>
        </CameraActionsContext.Provider>
      </CameraStateContext.Provider>
    </CameraErrorBoundary>
  );
}

function useCameraButtonModel(
  {
    className,
    variant,
    size,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: outline,
    icon,
    iconSize,
    label,
    labelPosition: labelPositionInput,
    showLabel: showLabelInput,
    badge,
    indicator: indicatorInput,
    indicatorColor,
    isActive,
    isLoading,
    hapticPattern: hapticPatternInput,
    pressAnimation: pressAnimationInput,
    pulse,
    pulseColor,
    action,
    style,
    onClick,
    disabled,
    children,
    ...props
  }: CameraButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { labelPosition, showLabel, indicator, hapticPattern, pressAnimation } =
    useCameraOptions3({
      labelPosition: labelPositionInput,
      showLabel: showLabelInput,
      indicator: indicatorInput,
      hapticPattern: hapticPatternInput,
      pressAnimation: pressAnimationInput,
    });

  const interaction = useCameraButtonInteraction(
    disabled,
    isLoading,
    hapticPattern,
    onClick,
  );

  const { reducedMotion, pressStyles } = useCameraButtonMotion(
    pressAnimation,
    interaction.isPressed,
  );

  const renderParts = getCameraButtonRenderParts({
    icon,
    iconSize,
    size,
    action,
    badge,
    indicator,
    indicatorColor,
    pulse,
    pulseColor,
  });

  return createCameraButtonModel({
    ref,
    variant,
    size,
    outline,
    isActive,
    isLoading,
    className,
    style,
    pressStyles,
    interaction,
    disabled,
    props,
    label,
    action,
    renderParts,
    reducedMotion,
    showLabel,
    labelPosition,
    children,
  });
}

function createCameraButtonModel({
  ref,
  variant,
  size,
  outline,
  isActive,
  isLoading,
  className,
  style,
  pressStyles,
  interaction,
  disabled,
  props,
  label,
  action,
  renderParts,
  reducedMotion,
  showLabel,
  labelPosition,
  children,
}: {
  ref: React.ForwardedRef<HTMLButtonElement>;
  variant: CameraButtonProps["variant"];
  size: CameraButtonProps["size"];
  outline: CameraButtonProps["shape"];
  isActive: CameraButtonProps["isActive"];
  isLoading: CameraButtonProps["isLoading"];
  className: CameraButtonProps["className"];
  style: CameraButtonProps["style"];
  pressStyles: React.CSSProperties;
  interaction: ReturnType<typeof useCameraButtonInteraction>;
  disabled: CameraButtonProps["disabled"];
  props: CameraButtonNativeProps;
  label: CameraButtonProps["label"];
  action: CameraButtonProps["action"];
  renderParts: ReturnType<typeof getCameraButtonRenderParts>;
  reducedMotion: boolean;
  showLabel: boolean;
  labelPosition: NonNullable<CameraButtonProps["labelPosition"]>;
  children: React.ReactNode;
}) {
  return {
    ref,
    variant,
    size,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: outline,
    isActive,
    isLoading,
    className,
    style,
    pressStyles,
    handlePointerDown: interaction.handlePointerDown,
    handlePointerUp: interaction.handlePointerUp,
    handleClick: interaction.handleClick,
    disabled,
    props,
    label,
    action,
    renderPulse: renderParts.renderPulse,
    renderIndicator: renderParts.renderIndicator,
    renderBadge: renderParts.renderBadge,
    finalIconSize: renderParts.finalIconSize,
    reducedMotion,
    showLabel,
    labelPosition,
    renderIcon: renderParts.renderIcon,
    children,
  };
}

function useCameraButtonMotion(
  pressAnimation: NonNullable<CameraButtonProps["pressAnimation"]>,
  isPressed: boolean,
) {
  const reducedMotion = useReducedMotion();

  const pressStyles = React.useMemo(
    () => cameraUseMemo2(reducedMotion, pressAnimation, isPressed),
    [isPressed, pressAnimation, reducedMotion],
  );

  return { reducedMotion, pressStyles };
}

function getCameraButtonRenderParts({
  icon,
  iconSize,
  size,
  action,
  badge,
  indicator,
  indicatorColor,
  pulse,
  pulseColor,
}: Pick<
  CameraButtonProps,
  | "icon"
  | "iconSize"
  | "size"
  | "action"
  | "badge"
  | "indicator"
  | "indicatorColor"
  | "pulse"
  | "pulseColor"
>) {
  const finalIconSize = iconSize ?? BUTTON_ICON_SIZES[size ?? "md"];

  return {
    finalIconSize,
    renderIcon: () => cameraButtonIcon(icon, action, finalIconSize),
    renderBadge: () => cameraButtonBadge(badge),
    renderIndicator: () => cameraButtonIndicator(indicator, indicatorColor),
    renderPulse: () => cameraButtonPulse(pulse, pulseColor),
  };
}

function useCameraButtonInteraction(
  disabled: boolean | undefined,
  isLoading: boolean | undefined,
  hapticPattern: NonNullable<CameraButtonProps["hapticPattern"]>,
  onClick: CameraButtonProps["onClick"],
) {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleHaptic = React.useCallback(
    () => cameraUseCallback3(hapticPattern),
    [hapticPattern],
  );

  const handlePointerDown = React.useCallback(() => {
    if (disabled || isLoading) return;

    setIsPressed(true);
  }, [disabled, isLoading]);

  const handlePointerUp = React.useCallback(() => setIsPressed(false), []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      handleHaptic();
      onClick?.(event);
    },
    [handleHaptic, onClick],
  );

  return { isPressed, handlePointerDown, handlePointerUp, handleClick };
}

const cameraButtonActionIcons = {
  capture: IconCamera,
  record: IconVideo,
  flash: IconBolt,
  switch: IconCameraRotate,
  timer: IconClock,
  grid: IconGrid3x3,
  settings: IconSettings,
  zoom: IconZoomIn,
  aspectRatio: IconAspectRatio,
} satisfies Record<
  NonNullable<CameraButtonProps["action"]>,
  React.ComponentType<{ size?: number }>
>;

function cameraButtonIcon(
  icon: React.ReactNode,
  action: CameraButtonProps["action"],
  size: number,
) {
  const DefaultIcon = action ? cameraButtonActionIcons[action] : undefined;

  const resolvedIcon =
    icon ?? (DefaultIcon ? <DefaultIcon size={size} /> : null);

  if (!resolvedIcon) return null;

  return (
    <span
      data-slot="camera-button-icon"
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {React.isValidElement<{ size?: number; className?: string }>(resolvedIcon)
        ? React.cloneElement(resolvedIcon, {
            size,
            className: cn(resolvedIcon.props.className, "size-full"),
          })
        : resolvedIcon}
    </span>
  );
}

function cameraButtonBadge(badge: CameraButtonProps["badge"]) {
  if (badge === undefined || badge === null || badge === "") return null;

  return (
    // kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change)
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-info px-1.5 text-xs font-semibold text-info-foreground">
      {badge}
    </span>
  );
}

function cameraButtonIndicator(
  indicator: CameraButtonProps["indicator"],
  color: string | undefined,
) {
  if (indicator === "dot") {
    return (
      // kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change)
      <span
        className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  }

  if (indicator === "ring") {
    return (
      <span
        className="absolute inset-0 rounded-full ring-2 ring-offset-2"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 0 2px ${color}, 0 0 0 4px transparent`,
        }}
      />
    );
  }

  return null;
}

function cameraButtonPulse(
  pulse: boolean | undefined,
  color: string | undefined,
) {
  if (!pulse) return null;

  return (
    <span
      data-slot="camera-button-recording-ring"
      aria-hidden="true"
      className="absolute -inset-1 rounded-full border-2"
      style={{ borderColor: color || "currentColor" }}
    />
  );
}

function CameraButtonView({
  ref,
  variant,
  size,
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
  shape: outline,
  isActive,
  isLoading,
  className,
  style,
  pressStyles,
  handlePointerDown,
  handlePointerUp,
  handleClick,
  disabled,
  props,
  label,
  action,
  renderPulse,
  renderIndicator,
  renderBadge,
  finalIconSize,
  reducedMotion,
  showLabel,
  labelPosition,
  renderIcon,
  children,
}: ReturnType<typeof useCameraButtonModel>) {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="default"
      type="button"
      className={cn(
        // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
        cameraButtonVariants({ variant, size, shape: outline }),
        "relative touch-manipulation select-none",
        { "ring-2 ring-white/50": isActive },
        { "cursor-wait": isLoading },
        className,
      )}
      style={{ ...style, ...pressStyles }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      disabled={disabled || isLoading}
      data-slot="camera-button"
      aria-label={
        props["aria-label"] ??
        label ??
        (action ? getControlDescription(action) : "Camera action")
      }
      aria-pressed={isActive}
      aria-busy={isLoading || undefined}
      onPointerCancel={handlePointerUp}
      data-action={action}
      data-active={isActive}
      data-loading={isLoading}
      {...props}
    >
      {renderPulse()}
      {renderIndicator()}
      {renderBadge()}
      {cameraValueValue(
        isLoading,
        finalIconSize,
        reducedMotion,
        showLabel,
        label,
        labelPosition,
        renderIcon,
        children,
      )}
    </Button>
  );
}

function useCameraControlsModel(
  {
    className,
    position,
    visibility,
    showCapture: showCaptureInput,
    showRecord: showRecordInput,
    showSwitch: showSwitchInput,
    showFlash: showFlashInput,
    onCapture,
    onRecordStart,
    onRecordStop,
    onSwitchCamera,
    onToggleFlash,
    autoHide: autoHideInput,
    ...props
  }: CameraControlsProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { showCapture, showRecord, showSwitch, showFlash, autoHide } =
    useCameraOptions5({
      showCapture: showCaptureInput,
      showRecord: showRecordInput,
      showSwitch: showSwitchInput,
      showFlash: showFlashInput,
      autoHide: autoHideInput,
    });

  const { status, isRecording, isFlashSupported, isFlashOn, devices } =
    useCameraState();

  const { capture, startRecording, stopRecording, switchCamera, toggleFlash } =
    useCameraActions();

  const captureButtonRef = React.useRef<HTMLButtonElement>(null);
  const isReady = status === "ready" || status === "capturing";
  const hasMultipleCameras = devices.length > 1;
  const computedVisibility = autoHide && !isReady ? "hidden" : visibility;

  const handleCapture = React.useCallback(
    () => cameraUseCallback4(capture, onCapture, captureButtonRef),
    [capture, onCapture],
  );

  const handleRecord = React.useCallback(
    () =>
      cameraUseCallback5(
        isRecording,
        stopRecording,
        onRecordStop,
        startRecording,
        onRecordStart,
      ),
    [isRecording, startRecording, stopRecording, onRecordStart, onRecordStop],
  );

  const handleSwitch = React.useCallback(async () => {
    await switchCamera();
    onSwitchCamera?.();
  }, [switchCamera, onSwitchCamera]);

  const handleFlash = React.useCallback(async () => {
    await toggleFlash();
    onToggleFlash?.(!isFlashOn);
  }, [toggleFlash, isFlashOn, onToggleFlash]);

  return {
    ref,
    computedVisibility,
    position,
    className,
    props,
    showFlash,
    isFlashSupported,
    isFlashOn,
    handleFlash,
    isReady,
    showCapture,
    captureButtonRef,
    handleCapture,
    showRecord,
    isRecording,
    handleRecord,
    showSwitch,
    handleSwitch,
    hasMultipleCameras,
  };
}

function CameraControlsView({
  ref,
  computedVisibility,
  position,
  className,
  props,
  showFlash,
  isFlashSupported,
  isFlashOn,
  handleFlash,
  isReady,
  showCapture,
  captureButtonRef,
  handleCapture,
  showRecord,
  isRecording,
  handleRecord,
  showSwitch,
  handleSwitch,
  hasMultipleCameras,
}: ReturnType<typeof useCameraControlsModel>) {
  return (
    <div
      ref={ref}
      data-slot="camera-controls"
      inert={computedVisibility === "hidden" || undefined}
      className={cn(
        cameraControlsVariants({
          position,
          visibility: computedVisibility,
          className,
        }),
      )}
      role="toolbar"
      aria-label="Camera controls"
      {...props}
    >
      <div
        data-slot="camera-controls-layout"
        className="grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2"
      >
        <div data-slot="camera-controls-start" className="justify-self-start">
          {showFlash && isFlashSupported && (
            <FlashButton
              isEnabled={isFlashOn}
              onClick={handleFlash}
              disabled={!isReady}
              className="size-11 min-h-11 min-w-11"
            />
          )}
        </div>
        <CameraControlsPrimaryView
          showCapture={showCapture}
          captureButtonRef={captureButtonRef}
          handleCapture={handleCapture}
          isReady={isReady}
          showRecord={showRecord}
          isRecording={isRecording}
          handleRecord={handleRecord}
        />
        <div data-slot="camera-controls-end" className="justify-self-end">
          {showSwitch && (
            <SwitchCameraButton
              onClick={handleSwitch}
              disabled={!isReady || !hasMultipleCameras}
              className="size-11 min-h-11 min-w-11"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function useCameraGuideModel({
  variant,
  documentType,
  preset,
  config,
  isAligned: isAlignedInput,
  alignmentProgress,
  instruction,
  showInstruction: showInstructionInput,
  instructionPosition: instructionPositionInput,
  showAlignmentIndicator: showAlignmentIndicatorInput,
  alignmentIndicatorPosition: alignmentIndicatorPositionInput,
  showMeasurements: showMeasurementsInput,
  showCenterCross: showCenterCrossInput,
  safeZone,
  children,
  className,
  style,
  ...props
}: CameraGuideProps) {
  const {
    isAligned,
    showInstruction,
    instructionPosition,
    showAlignmentIndicator,
    alignmentIndicatorPosition,
    showMeasurements,
  } = useCameraGuideOptions({
    isAligned: isAlignedInput,
    showInstruction: showInstructionInput,
    instructionPosition: instructionPositionInput,
    showAlignmentIndicator: showAlignmentIndicatorInput,
    alignmentIndicatorPosition: alignmentIndicatorPositionInput,
    showMeasurements: showMeasurementsInput,
  });

  const { showCenterCross } = useCameraGuideOptions2({
    showCenterCross: showCenterCrossInput,
  });

  const reducedMotion = useReducedMotion();
  const pageVisible = useCameraPageVisible();

  const effectivePreset = React.useMemo(
    () => cameraUseMemo3(preset, variant, documentType),
    [preset, variant, documentType],
  );

  const presentation = useCameraGuidePresentation({
    effectivePreset,
    config,
    isAligned,
    alignmentProgress,
    safeZone,
    reducedMotion,
    pageVisible,
  });

  return {
    variant,
    className,
    safeZoneStyle: presentation.safeZoneStyle,
    style,
    effectivePreset,
    isAligned,
    props,
    guideConfig: presentation.guideConfig,
    config,
    renderGuide: presentation.renderGuide,
    showMeasurements,
    showCenterCross,
    currentColor: presentation.currentColor,
    showAlignmentIndicator,
    reducedMotion,
    positionClasses: CAMERA_GUIDE_POSITIONS,
    alignmentIndicatorPosition,
    children,
    showInstruction,
    instructionPositionClasses: CAMERA_GUIDE_INSTRUCTION_POSITIONS,
    instructionPosition,
    displayInstruction:
      instruction || getGuidePreset(effectivePreset).defaultInstruction,
  };
}

function useCameraGuidePresentation({
  effectivePreset,
  config,
  isAligned,
  alignmentProgress,
  safeZone,
  reducedMotion,
  pageVisible,
}: {
  effectivePreset: ReturnType<typeof cameraUseMemo3>;
  config: CameraGuideProps["config"];
  isAligned: boolean;
  alignmentProgress: number | undefined;
  safeZone: CameraGuideProps["safeZone"];
  reducedMotion: boolean;
  pageVisible: boolean;
}) {
  const guideConfig = React.useMemo(
    () => cameraUseMemo4(effectivePreset, config),
    [effectivePreset, config],
  );

  const currentColor = React.useMemo(
    () => cameraGuideColor(isAligned, alignmentProgress, guideConfig),
    [isAligned, alignmentProgress, guideConfig],
  );

  const animationStyles: React.CSSProperties = {
    animation:
      !reducedMotion && pageVisible && guideConfig.animation !== "none"
        ? "scan-overlay-corner-pulse " +
          Math.max(100, Math.min(400, guideConfig.animationDuration)) +
          "ms ease-out 1"
        : undefined,
  };

  const safeZoneStyle = React.useMemo<React.CSSProperties | undefined>(
    () => cameraUseMemo5(safeZone),
    [safeZone],
  );

  return {
    guideConfig,
    currentColor,
    safeZoneStyle,
    renderGuide: () =>
      cameraGuideOutline(guideConfig, currentColor, animationStyles),
  };
}

const CAMERA_GUIDE_POSITIONS = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

const CAMERA_GUIDE_INSTRUCTION_POSITIONS = {
  top: "top-8",
  bottom: "bottom-8",
  inside: "bottom-4",
};

function cameraGuideColor(
  isAligned: boolean,
  alignmentProgress: number | undefined,
  config: ReturnType<typeof cameraUseMemo4>,
) {
  if (isAligned) return config.alignedColor;

  const canBlend =
    alignmentProgress !== undefined &&
    Number.isFinite(alignmentProgress) &&
    /^#[\da-f]{6}$/i.test(config.misalignedColor) &&
    /^#[\da-f]{6}$/i.test(config.alignedColor);

  if (!canBlend || alignmentProgress === undefined)
    return config.misalignedColor;

  const progress = Math.max(0, Math.min(1, alignmentProgress));

  const channels = [1, 3, 5].map((offset) => {
    const from = parseInt(config.misalignedColor.slice(offset, offset + 2), 16);
    const to = parseInt(config.alignedColor.slice(offset, offset + 2), 16);

    return Math.round(from + (to - from) * progress)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

function cameraGuideOutline(
  guideConfig: ReturnType<typeof cameraUseMemo4>,
  currentColor: string,
  animationStyles: React.CSSProperties,
) {
  const {
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: outline,
    cornerStyle,
    cornerSize,
    strokeWidth,
    fillColor,
  } = guideConfig;

  const strokeStyle: React.CSSProperties = {
    stroke: currentColor,
    strokeWidth,
    fill: fillColor,
    strokeDasharray: guideConfig.strokeDasharray,
  };

  if (outline === "oval" || outline === "circle") {
    return (
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={animationStyles}
      >
        <ellipse cx="50" cy="50" rx="48" ry="48" style={strokeStyle} />
      </svg>
    );
  }

  if (outline !== "rectangle" && outline !== "square") return null;

  if (cornerStyle === "bracket" && cornerSize) {
    return (
      <CameraContentView2
        animationStyles={animationStyles}
        cs={cornerSize}
        strokeStyle={strokeStyle}
      />
    );
  }

  const radius =
    cornerStyle === "rounded" ? (guideConfig.cornerRadius ?? 8) : 0;

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={animationStyles}
    >
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx={radius}
        ry={radius}
        style={strokeStyle}
      />
    </svg>
  );
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function CameraGuideView({
  variant,
  className,
  safeZoneStyle,
  style,
  effectivePreset,
  isAligned,
  props,
  guideConfig,
  config,
  renderGuide,
  showMeasurements,
  showCenterCross,
  currentColor,
  showAlignmentIndicator,
  reducedMotion,
  positionClasses,
  alignmentIndicatorPosition,
  children,
  showInstruction,
  instructionPositionClasses,
  instructionPosition,
  displayInstruction,
}: ReturnType<typeof useCameraGuideModel>) {
  return (
    <div
      className={cn(cameraGuideVariants({ variant }), className)}
      style={{ ...safeZoneStyle, ...style }}
      data-slot="camera-guide"
      data-preset={effectivePreset}
      data-aligned={isAligned}
      {...props}
    >
      <div
        data-slot="camera-guide-frame"
        className="relative max-w-full max-h-full"
        style={{
          width: guideConfig.width ?? "auto",
          height:
            config?.height ??
            (guideConfig.aspectRatio
              ? undefined
              : (guideConfig.height ?? "auto")),
          aspectRatio: guideConfig.aspectRatio?.toString(),
        }}
      >
        {renderGuide()}
        {showMeasurements && (
          // kira-kit-ignore arbitrary-values: sub-12px micro type is a documented exception
          // kira-kit-ignore spacing-scale: camera overlay chrome keeps compact optical metrics (documented non-change)
          <div className="absolute left-2 bottom-2 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white/80">
            {cameraValueValue2(guideConfig)}
          </div>
        )}
        {showCenterCross && <CameraContentView3 currentColor={currentColor} />}
        {showAlignmentIndicator && (
          <div
            className={cn(
              "absolute w-3 h-3 rounded-full",
              { "transition-colors duration-200": !reducedMotion },
              positionClasses[alignmentIndicatorPosition],
            )}
            style={{
              backgroundColor: isAligned
                ? guideConfig.alignedColor
                : guideConfig.misalignedColor,
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </div>
      {showInstruction && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-2rem)] px-4 py-2 rounded-full text-center",
            "bg-black/60 backdrop-blur-sm text-white text-sm font-medium",
            { "transition-opacity duration-200": !reducedMotion },
            instructionPositionClasses[instructionPosition],
          )}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
          role="status"
          aria-live="polite"
        >
          {displayInstruction}
        </div>
      )}
    </div>
  );
}

function useCameraZoomIndicatorModel({
  zoom,
  minZoom: minZoomInput,
  maxZoom: maxZoomInput,
  position: positionInput,
  format: formatInput,
  showBar: showBarInput,
  showOnChange: showOnChangeInput,
  hideDelay: hideDelayInput,
  alwaysVisible: alwaysVisibleInput,
  className,
}: CameraZoomIndicatorProps) {
  const { minZoom, maxZoom, position, format, showBar, showOnChange } =
    useCameraZoomIndicatorOptions({
      minZoom: minZoomInput,
      maxZoom: maxZoomInput,
      position: positionInput,
      format: formatInput,
      showBar: showBarInput,
      showOnChange: showOnChangeInput,
    });

  const { hideDelay, alwaysVisible } = useCameraZoomIndicatorOptions2({
    hideDelay: hideDelayInput,
    alwaysVisible: alwaysVisibleInput,
  });

  const reduced = useReducedMotion();
  const [previousZoom, setPreviousZoom] = React.useState(zoom);
  const [hiddenZoom, setHiddenZoom] = React.useState<number | null>(null);

  if (previousZoom !== zoom) {
    setPreviousZoom(zoom);
    setHiddenZoom(null);
  }

  const isVisible = alwaysVisible || !showOnChange || hiddenZoom !== zoom;
  React.useEffect(
    () =>
      cameraUseEffect(
        showOnChange,
        alwaysVisible,
        setHiddenZoom,
        zoom,
        hideDelay,
      ),
    [zoom, showOnChange, alwaysVisible, hideDelay],
  );
  const safeZoom = Number.isFinite(zoom) ? zoom : minZoom;
  const range = maxZoom - minZoom;

  const progress =
    range > 0 ? Math.max(0, Math.min(1, (safeZoom - minZoom) / range)) : 0;

  const formattedZoom =
    format === "multiplier"
      ? safeZoom.toFixed(1) + "×"
      : Math.round(progress * 100) + "%";

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return {
    isVisible,
    reduced,
    positions,
    position,
    className,
    formattedZoom,
    showBar,
    progress,
  };
}

function CameraZoomIndicatorView({
  isVisible,
  reduced,
  positions,
  position,
  className,
  formattedZoom,
  showBar,
  progress,
}: ReturnType<typeof useCameraZoomIndicatorModel>) {
  return (
    <div
      data-slot="camera-zoom-indicator"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-hidden={!isVisible || undefined}
      className={cn(
        "absolute flex flex-col items-end gap-1",
        { "transition-opacity duration-150": !reduced },
        positions[position],
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <div className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium tabular-nums text-background">
        {formattedZoom}
      </div>
      {showBar && (
        <div
          data-slot="camera-zoom-track"
          aria-hidden="true"
          className="h-1 w-16 overflow-hidden rounded-full bg-background/20"
        >
          <div
            data-slot="camera-zoom-progress"
            className="h-full origin-left bg-background"
            style={{ transform: "scaleX(" + progress + ")" }}
          />
        </div>
      )}
    </div>
  );
}

type KiraCameraOperationContext = {
  operationRef: React.MutableRefObject<AbortController | null>;
  mountedRef: React.MutableRefObject<boolean>;
  ownedUrlRef: React.MutableRefObject<string | null>;
  focusAfterChangeRef: React.MutableRefObject<boolean>;
  setPhase: React.Dispatch<React.SetStateAction<CameraReviewPhase>>;
  releaseOwnedImage: () => void;
};

function isCurrentKiraCameraOperation(
  controller: AbortController,
  context: KiraCameraOperationContext,
) {
  return (
    context.mountedRef.current &&
    !controller.signal.aborted &&
    context.operationRef.current === controller
  );
}

function getKiraCameraFileError(file: File, fileSizeLimit: number) {
  if (file.size > fileSizeLimit) {
    return (
      "Choose an image smaller than " +
      Math.round((fileSizeLimit / 1024 / 1024) * 10) / 10 +
      " MB."
    );
  }

  if (
    !file.type.startsWith("image/") &&
    !/\.(?:jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name)
  ) {
    return "Choose an image file.";
  }

  return null;
}

async function selectKiraCameraFile(
  file: File,
  disabled: boolean,
  fileSizeLimit: number,
  context: KiraCameraOperationContext,
) {
  if (disabled || context.operationRef.current) return;

  const validationError = getKiraCameraFileError(file, fileSizeLimit);

  if (validationError) {
    context.setPhase({
      status: "capture",
      messageKind: "error",
      message: validationError,
    });

    return;
  }

  const controller = new AbortController();
  context.operationRef.current = controller;
  const url = URL.createObjectURL(file);
  context.setPhase({ status: "selecting" });

  try {
    const dimensions = await readImageDimensions(url, controller.signal);

    if (!isCurrentKiraCameraOperation(controller, context)) {
      URL.revokeObjectURL(url);

      return;
    }

    context.releaseOwnedImage();
    context.ownedUrlRef.current = url;
    context.focusAfterChangeRef.current = true;
    context.setPhase({
      status: "review",
      capture: {
        blob: file,
        url,
        type: file.type,
        source: "file",
        fileName: file.name,
        timestamp: Date.now(),
        ...dimensions,
      },
    });
  } catch (cause) {
    URL.revokeObjectURL(url);

    if (isCurrentKiraCameraOperation(controller, context)) {
      context.setPhase({
        status: "capture",
        messageKind: "error",
        message:
          cause instanceof Error
            ? cause.message
            : "The image could not be opened. Choose another image.",
      });
    }
  } finally {
    if (context.operationRef.current === controller) {
      context.operationRef.current = null;
    }
  }
}

async function acceptKiraCameraCapture(
  disabled: boolean,
  phase: CameraReviewPhase,
  onAccept: KiraCameraProps["onAccept"],
  context: KiraCameraOperationContext,
) {
  if (disabled || phase.status !== "review" || context.operationRef.current)
    return;

  const { capture } = phase;
  const controller = new AbortController();
  context.operationRef.current = controller;
  context.setPhase({ status: "accepting", capture });

  try {
    await onAccept(capture, controller.signal);

    if (!isCurrentKiraCameraOperation(controller, context)) return;

    context.focusAfterChangeRef.current = true;
    context.setPhase({ status: "accepted", capture });
  } catch (cause) {
    if (!isCurrentKiraCameraOperation(controller, context)) return;

    context.focusAfterChangeRef.current = true;
    context.setPhase({
      status: "review",
      capture,
      messageKind: "error",
      message:
        cause instanceof Error
          ? cause.message
          : "The image could not be accepted. Retry or retake it.",
    });
  } finally {
    if (context.operationRef.current === controller) {
      context.operationRef.current = null;
    }
  }
}

function useKiraCameraWorkflow({
  defaultCapture,
  disabled,
  fileSizeLimit,
  onAccept,
}: {
  defaultCapture: KiraCameraProps["defaultCapture"];
  disabled: boolean;
  fileSizeLimit: number;
  onAccept: KiraCameraProps["onAccept"];
}) {
  const [phase, setPhase] = React.useState<CameraReviewPhase>(() =>
    defaultCapture
      ? { status: "review", capture: defaultCapture }
      : { status: "capture" },
  );

  const operationRef = React.useRef<AbortController | null>(null);
  const ownedUrlRef = React.useRef<string | null>(null);
  const mountedRef = React.useRef(true);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const fileButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const acceptButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const reviewHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const focusAfterChangeRef = React.useRef(false);
  const review = "capture" in phase ? phase.capture : null;
  const pending = phase.status === "accepting" || phase.status === "selecting";

  const releaseOwnedImage = React.useCallback(() => {
    if (ownedUrlRef.current) URL.revokeObjectURL(ownedUrlRef.current);
    ownedUrlRef.current = null;
  }, [ownedUrlRef]);

  const operationContext: KiraCameraOperationContext = {
    operationRef,
    mountedRef,
    ownedUrlRef,
    focusAfterChangeRef,
    setPhase,
    releaseOwnedImage,
  };

  const actions = useKiraCameraWorkflowActions({
    disabled,
    fileSizeLimit,
    phase,
    onAccept,
    context: operationContext,
    fileInputRef,
    review,
  });

  useKiraCameraWorkflowFocus(
    phase.status,
    focusAfterChangeRef,
    acceptButtonRef,
    reviewHeadingRef,
    fileButtonRef,
  );
  useKiraCameraWorkflowLifecycle(mountedRef, operationRef, releaseOwnedImage);

  return {
    phase,
    review,
    pending,
    fileInputRef,
    fileButtonRef,
    acceptButtonRef,
    reviewHeadingRef,
    ...actions,
  };
}

function useKiraCameraWorkflowActions({
  disabled,
  fileSizeLimit,
  phase,
  onAccept,
  context,
  fileInputRef,
  review,
}: {
  disabled: boolean;
  fileSizeLimit: number;
  phase: CameraReviewPhase;
  onAccept: KiraCameraProps["onAccept"];
  context: KiraCameraOperationContext;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  review: CameraReviewCapture | null;
}) {
  const receiveCapture = React.useCallback(
    (capture: CaptureResult) =>
      cameraReceiveCapture(
        capture,
        disabled,
        context.operationRef,
        context.releaseOwnedImage,
        context.ownedUrlRef,
        context.focusAfterChangeRef,
        context.setPhase,
      ),
    [disabled, context],
  );

  const retake = React.useCallback(
    () =>
      cameraRetake(
        context.operationRef,
        context.releaseOwnedImage,
        context.focusAfterChangeRef,
        fileInputRef,
        context.setPhase,
      ),
    [context, fileInputRef],
  );

  const selectFile = React.useCallback(
    (file: File) =>
      selectKiraCameraFile(file, disabled, fileSizeLimit, context),
    [context, disabled, fileSizeLimit],
  );

  const accept = React.useCallback(
    () => acceptKiraCameraCapture(disabled, phase, onAccept, context),
    [context, disabled, onAccept, phase],
  );

  const cancel = React.useCallback(
    () =>
      cameraCancel(
        context.operationRef,
        context.focusAfterChangeRef,
        context.setPhase,
        review,
      ),
    [context, review],
  );

  return { receiveCapture, retake, selectFile, accept, cancel };
}

function useKiraCameraWorkflowFocus(
  status: CameraReviewPhase["status"],
  focusAfterChangeRef: React.MutableRefObject<boolean>,
  acceptButtonRef: React.RefObject<HTMLButtonElement | null>,
  reviewHeadingRef: React.RefObject<HTMLHeadingElement | null>,
  fileButtonRef: React.RefObject<HTMLButtonElement | null>,
) {
  React.useEffect(() => {
    if (!focusAfterChangeRef.current) return;
    focusAfterChangeRef.current = false;

    if (status === "review") acceptButtonRef.current?.focus();
    else if (status === "accepted") reviewHeadingRef.current?.focus();
    else if (status === "capture") fileButtonRef.current?.focus();
  }, [
    status,
    focusAfterChangeRef,
    acceptButtonRef,
    reviewHeadingRef,
    fileButtonRef,
  ]);
}

function useKiraCameraWorkflowLifecycle(
  mountedRef: React.MutableRefObject<boolean>,
  operationRef: React.MutableRefObject<AbortController | null>,
  releaseOwnedImage: () => void,
) {
  React.useEffect(
    () => cameraUseEffect2(mountedRef, operationRef, releaseOwnedImage),
    [mountedRef, operationRef, releaseOwnedImage],
  );
}

function getKiraCameraModelInputs({
  label: labelInput,
  description: descriptionInput,
  defaultCapture,
  onAccept,
  acceptLabel: acceptLabelInput,
  successMessage: successMessageInput,
  allowFileSelection: allowFileSelectionInput,
  maxFileSize: maxFileSizeInput,
  guidePreset,
  disabled: disabledInput,
  disabledReason,
  className,
  facingMode: facingModeInput,
  mode: modeInput,
  onError,
  size,
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
  shape: outline,
  ...cameraProps
}: KiraCameraProps) {
  return {
    cameraProps,
    options: {
      label: labelInput,
      description: descriptionInput,
      acceptLabel: acceptLabelInput,
      successMessage: successMessageInput,
      allowFileSelection: allowFileSelectionInput,
      maxFileSize: maxFileSizeInput,
      disabled: disabledInput,
      facingMode: facingModeInput,
      mode: modeInput,
    },
    model: {
      defaultCapture,
      onAccept,
      guidePreset,
      disabledReason,
      className,
      onError,
      size,
      outline,
    },
  };
}

function useKiraCameraModel(props: KiraCameraProps) {
  const inputs = getKiraCameraModelInputs(props);
  const { cameraProps } = inputs;
  const model = inputs.model;
  const options = useKiraCameraModelOptions(inputs.options);

  const {
    label,
    description,
    acceptLabel,
    successMessage,
    allowFileSelection,
    maxFileSize,
    disabled,
    facingMode,
    mode,
  } = options;

  const workflow = useKiraCameraModelWorkflow(
    model.defaultCapture,
    disabled,
    maxFileSize,
    model.onAccept,
  );

  const reducedMotion = useReducedMotion();

  const viewState = getKiraCameraModelViewState({
    workflow,
    disabled,
    successMessage,
    maxFileSize,
    size: model.size,
  });

  const { buildCapture, buildReview } = createKiraCameraViewBuilders({
    cameraProps,
    disabled,
    mode,
    facingMode,
    size: model.size,
    outline: model.outline,
    onError: model.onError,
    label,
    guidePreset: model.guidePreset,
    phase: workflow.phase,
    review: workflow.review,
    pending: workflow.pending,
    workflow,
    reducedMotion,
    acceptLabel,
    photoViewportClass: viewState.photoViewportClass,
  });

  return {
    phase: workflow.phase,
    disabled,
    className: model.className,
    id: React.useId(),
    label,
    description,
    currentStep: viewState.currentStep,
    buildCapture,
    size: model.size,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: model.outline,
    photoViewportClass: viewState.photoViewportClass,
    reducedMotion,
    buildReview,
    allowFileSelection,
    fileButtonRef: workflow.fileButtonRef,
    fileInputRef: workflow.fileInputRef,
    facingMode,
    selectFile: workflow.selectFile,
    fileSizeLimit: viewState.fileSizeLimit,
    cancel: workflow.cancel,
    hasError: viewState.hasError,
    statusMessage: viewState.statusMessage,
    disabledReason: model.disabledReason,
  };
}

function getKiraCameraModelViewState({
  workflow,
  disabled,
  successMessage,
  maxFileSize,
  size,
}: {
  workflow: ReturnType<typeof useKiraCameraWorkflow>;
  disabled: boolean;
  successMessage: string;
  maxFileSize: number;
  size: CameraProps["size"];
}) {
  return getKiraCameraDisplayState({
    phase: workflow.phase,
    review: workflow.review,
    disabled,
    successMessage,
    maxFileSize,
    size,
  });
}

function createKiraCameraViewBuilders({
  cameraProps,
  disabled,
  mode,
  facingMode,
  size,
  outline,
  onError,
  label,
  guidePreset,
  phase,
  review,
  pending,
  workflow,
  reducedMotion,
  acceptLabel,
  photoViewportClass,
}: {
  cameraProps: Partial<CameraProps>;
  disabled: boolean;
  mode: CameraProps["mode"];
  facingMode: CameraProps["facingMode"];
  size: CameraProps["size"];
  outline: CameraProps["shape"];
  onError: CameraProps["onError"];
  label: string;
  guidePreset: KiraCameraProps["guidePreset"];
  phase: CameraReviewPhase;
  review: CameraReviewCapture | null;
  pending: boolean;
  workflow: ReturnType<typeof useKiraCameraWorkflow>;
  reducedMotion: boolean;
  acceptLabel: string;
  photoViewportClass: string | undefined;
}) {
  return {
    buildCapture: () => (
      <KiraCameraCaptureView
        cameraProps={cameraProps}
        disabled={disabled}
        mode={mode}
        facingMode={facingMode}
        size={size}
        outline={outline}
        receiveCapture={workflow.receiveCapture}
        onError={onError}
        label={label}
        photoViewportClass={photoViewportClass}
        guidePreset={guidePreset}
      />
    ),
    buildReview: () => (
      <KiraCameraReviewView
        phase={phase}
        review={review}
        size={size}
        outline={outline}
        photoViewportClass={photoViewportClass}
        label={label}
        reviewHeadingRef={workflow.reviewHeadingRef}
        disabled={disabled}
        pending={pending}
        accept={workflow.accept}
        reducedMotion={reducedMotion}
        acceptLabel={acceptLabel}
        acceptButtonRef={workflow.acceptButtonRef}
        cancel={workflow.cancel}
        retake={workflow.retake}
      />
    ),
  };
}

function useKiraCameraModelOptions({
  label,
  description,
  acceptLabel,
  successMessage,
  allowFileSelection,
  maxFileSize,
  disabled,
  facingMode,
  mode,
}: {
  label: KiraCameraProps["label"];
  description: KiraCameraProps["description"];
  acceptLabel: KiraCameraProps["acceptLabel"];
  successMessage: KiraCameraProps["successMessage"];
  allowFileSelection: KiraCameraProps["allowFileSelection"];
  maxFileSize: KiraCameraProps["maxFileSize"];
  disabled: KiraCameraProps["disabled"];
  facingMode: KiraCameraProps["facingMode"];
  mode: KiraCameraProps["mode"];
}) {
  return {
    ...useKiraCameraOptions({
      label,
      description,
      acceptLabel,
      successMessage,
      allowFileSelection,
      maxFileSize,
    }),
    ...useKiraCameraOptions2({ disabled, facingMode, mode }),
  };
}

function useKiraCameraModelWorkflow(
  defaultCapture: KiraCameraProps["defaultCapture"],
  disabled: boolean,
  maxFileSize: number,
  onAccept: KiraCameraProps["onAccept"],
) {
  return useKiraCameraWorkflow({
    defaultCapture,
    disabled,
    fileSizeLimit: getKiraCameraFileSizeLimit(maxFileSize),
    onAccept,
  });
}

function getKiraCameraFileSizeLimit(maxFileSize: number) {
  return Number.isFinite(maxFileSize) && maxFileSize > 0
    ? maxFileSize
    : 10 * 1024 * 1024;
}

function getKiraCameraDisplayState({
  phase,
  review,
  disabled,
  successMessage,
  size,
  maxFileSize,
}: {
  phase: CameraReviewPhase;
  review: CameraReviewCapture | null;
  disabled: boolean;
  successMessage: string;
  size: CameraProps["size"];
  maxFileSize: number;
}) {
  const hasError =
    (phase.status === "capture" || phase.status === "review") &&
    phase.messageKind === "error";

  return {
    hasError,
    fileSizeLimit: getKiraCameraFileSizeLimit(maxFileSize),
    currentStep: cameraCurrentStepValue(phase, review),
    photoViewportClass:
      !size || size === "default"
        ? "aspect-[4/3] @min-[24rem]/kira-camera:aspect-video"
        : undefined,
    statusMessage: cameraStatusMessageValue(disabled, phase, successMessage),
  };
}

function KiraCameraCaptureView({
  cameraProps,
  disabled,
  mode,
  facingMode,
  size,
  outline,
  receiveCapture,
  onError,
  label,
  photoViewportClass,
  guidePreset,
}: {
  cameraProps: Partial<CameraProps>;
  disabled: boolean;
  mode: CameraProps["mode"];
  facingMode: CameraProps["facingMode"];
  size: CameraProps["size"];
  outline: CameraProps["shape"];
  receiveCapture: (capture: CaptureResult) => void;
  onError: CameraProps["onError"];
  label: string;
  photoViewportClass: string | undefined;
  guidePreset: KiraCameraProps["guidePreset"];
}) {
  return (
    <Camera
      {...cameraProps}
      key={disabled ? "disabled" : "enabled"}
      enableKeyboardShortcuts={!disabled && cameraProps.enableKeyboardShortcuts}
      enableGestures={!disabled && cameraProps.enableGestures}
      enableVoiceControl={!disabled && cameraProps.enableVoiceControl}
      mode={mode}
      facingMode={facingMode}
      size={size}
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
      shape={outline}
      onCapture={receiveCapture}
      onError={onError}
      autoStart={false}
      announceStatus={false}
      aria-label={label + " camera"}
      className={cn("w-full", photoViewportClass)}
    >
      <CameraPreview showSkeleton={false} />
      {!disabled && <CameraPermissions variant="overlay" />}
      {disabled && (
        <div
          data-slot="kira-camera-disabled"
          className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-white"
        >
          Camera capture is disabled.
        </div>
      )}
      {guidePreset && (
        <CameraGuide
          preset={guidePreset}
          showInstruction={false}
          showAlignmentIndicator={false}
          config={{ animation: "none", fillColor: "transparent" }}
        />
      )}
      {!disabled && (
        <CameraControls showCapture showRecord={false} showFlash showSwitch />
      )}
    </Camera>
  );
}

function KiraCameraReviewView({
  phase,
  review,
  size,
  outline,
  photoViewportClass,
  label,
  reviewHeadingRef,
  disabled,
  pending,
  accept,
  reducedMotion,
  acceptLabel,
  acceptButtonRef,
  cancel,
  retake,
}: {
  phase: CameraReviewPhase;
  review: CameraReviewCapture | null;
  size: CameraProps["size"];
  outline: CameraProps["shape"];
  photoViewportClass: string | undefined;
  label: string;
  reviewHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  disabled: boolean;
  pending: boolean;
  accept: () => Promise<void>;
  reducedMotion: boolean;
  acceptLabel: string;
  acceptButtonRef: React.RefObject<HTMLButtonElement | null>;
  cancel: () => void;
  retake: () => void;
}) {
  if (!review) return null;

  return (
    <div data-slot="kira-camera-review" className="space-y-3">
      <h3
        ref={reviewHeadingRef}
        tabIndex={-1}
        className="rounded-sm text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {phase.status === "accepted" ? "Accepted image" : "Review image"}
      </h3>
      <div
        data-slot="kira-camera-review-frame"
        className={cn(
          // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
          cameraVariants({ size, shape: outline }),
          "w-full",
          photoViewportClass,
        )}
      >
        <img
          data-slot="kira-camera-review-image"
          src={review.url}
          alt={label + " preview"}
          className="h-full w-full object-contain"
        />
      </div>
      <KiraCameraImageDetailsView review={review} />
      <KiraCameraReviewActions
        phase={phase}
        disabled={disabled}
        pending={pending}
        accept={accept}
        reducedMotion={reducedMotion}
        acceptLabel={acceptLabel}
        acceptButtonRef={acceptButtonRef}
        cancel={cancel}
        retake={retake}
      />
    </div>
  );
}

function KiraCameraReviewActions({
  phase,
  disabled,
  pending,
  accept,
  reducedMotion,
  acceptLabel,
  acceptButtonRef,
  cancel,
  retake,
}: {
  phase: CameraReviewPhase;
  disabled: boolean;
  pending: boolean;
  accept: () => Promise<void>;
  reducedMotion: boolean;
  acceptLabel: string;
  acceptButtonRef: React.RefObject<HTMLButtonElement | null>;
  cancel: () => void;
  retake: () => void;
}) {
  return (
    <div
      data-slot="kira-camera-review-actions"
      className="grid grid-cols-1 gap-2 @min-[24rem]/kira-camera:grid-cols-2"
    >
      {phase.status !== "accepted" && (
        <CameraContentView8
          acceptButtonRef={acceptButtonRef}
          disabled={disabled}
          pending={pending}
          phase={phase}
          accept={accept}
          reducedMotion={reducedMotion}
          acceptLabel={acceptLabel}
        />
      )}
      {pending ? (
        <Button
          variant="outline"
          onClick={cancel}
          className="h-auto min-h-11 whitespace-normal py-2"
        >
          Cancel acceptance
        </Button>
      ) : (
        <Button
          variant="outline"
          disabled={disabled}
          onClick={retake}
          leftIcon={<IconRefresh aria-hidden="true" className="size-4" />}
          className="h-auto min-h-11 whitespace-normal py-2"
        >
          {phase.status === "accepted" ? "Capture another" : "Retake image"}
        </Button>
      )}
    </div>
  );
}

// oxlint-disable-next-line eslint/max-lines-per-function -- The pure camera composition keeps the model-owned preview, controls and capture result in one readable slot hierarchy.
function KiraCameraView({
  phase,
  disabled,
  className,
  id,
  label,
  description,
  currentStep,
  buildCapture,
  size,
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
  shape: outline,
  photoViewportClass,
  reducedMotion,
  buildReview,
  allowFileSelection,
  fileButtonRef,
  fileInputRef,
  facingMode,
  selectFile,
  fileSizeLimit,
  cancel,
  hasError,
  statusMessage,
  disabledReason,
}: ReturnType<typeof useKiraCameraModel>) {
  return (
    <div
      data-slot="kira-camera"
      data-state={phase.status}
      data-disabled={disabled || undefined}
      className={cn(
        "@container/kira-camera w-full min-w-0 max-w-lg space-y-4",
        className,
      )}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-labelledby={id + "-label"}
      aria-describedby={id + "-status"}
    >
      <div data-slot="kira-camera-header" className="space-y-1">
        <p
          id={id + "-label"}
          data-slot="kira-camera-label"
          className="wrap-anywhere text-base font-semibold"
        >
          {label}
        </p>
        <p
          data-slot="kira-camera-description"
          className="wrap-anywhere text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
      </div>
      <KiraCameraProgressView currentStep={currentStep} phase={phase} />
      {phase.status === "capture" && buildCapture()}
      {phase.status === "selecting" && (
        <div
          data-slot="kira-camera-loading"
          className={cn(
            // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
            cameraVariants({ size, shape: outline }),
            "grid w-full place-items-center",
            photoViewportClass,
          )}
        >
          <div className="flex flex-col items-center gap-2 text-white">
            <IconLoader2
              aria-hidden="true"
              className={cn("size-5", { "animate-spin": !reducedMotion })}
            />
            <p className="text-sm">Preparing image…</p>
          </div>
        </div>
      )}
      {buildReview()}
      {allowFileSelection && phase.status === "capture" && (
        <div data-slot="kira-camera-file-selection" className="space-y-1.5">
          <Button
            ref={fileButtonRef}
            variant="outline"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<IconPhoto aria-hidden="true" className="size-4" />}
            className="min-h-11 w-full @min-[24rem]/kira-camera:min-h-9 @min-[24rem]/kira-camera:w-auto"
          >
            Choose an image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={facingMode}
            tabIndex={-1}
            data-slot="kira-camera-file-input"
            className="sr-only"
            aria-label={"Choose an image for " + label}
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";

              if (file) void selectFile(file);
            }}
          />
          <p className="text-xs text-muted-foreground">
            Images up to {Math.round((fileSizeLimit / 1024 / 1024) * 10) / 10}{" "}
            MB. Your device may offer a camera or image library.
          </p>
        </div>
      )}
      {phase.status === "selecting" && (
        <Button variant="outline" onClick={cancel}>
          Cancel selection
        </Button>
      )}
      <div
        id={id + "-status"}
        data-slot="kira-camera-status"
        data-tone={cameraDatatoneValue(hasError, phase)}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "flex min-h-12 items-start gap-2 rounded-lg px-3 py-2 text-sm",
          cameraValueValue4(hasError, phase),
        )}
      >
        {cameraValueValue5(hasError, phase)}
        <span className="min-w-0 wrap-anywhere">{statusMessage}</span>
      </div>
      {disabledReason && (
        <p
          data-slot="kira-camera-disabled-reason"
          className="text-xs text-muted-foreground"
        >
          {disabledReason}
        </p>
      )}
    </div>
  );
}

function useCameraOptions4({
  isRecording: isRecordingInput,
  size: sizeInput,
  showTimeBadge: showTimeBadgeInput,
  recordingDuration: recordingDurationInput,
}: Parameters<typeof resolveCameraOptions4>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions4({
        isRecording: isRecordingInput,
        size: sizeInput,
        showTimeBadge: showTimeBadgeInput,
        recordingDuration: recordingDurationInput,
      }),
    [isRecordingInput, sizeInput, showTimeBadgeInput, recordingDurationInput],
  );
}

function useCameraGridOptions({
  visible: visibleInput,
  type: typeInput,
  color: colorInput,
  opacity: opacityInput,
  lineWidth: lineWidthInput,
  showIntersectionDots: showIntersectionDotsInput,
}: Parameters<typeof resolveCameraGridOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraGridOptions({
        visible: visibleInput,
        type: typeInput,
        color: colorInput,
        opacity: opacityInput,
        lineWidth: lineWidthInput,
        showIntersectionDots: showIntersectionDotsInput,
      }),
    [
      visibleInput,
      typeInput,
      colorInput,
      opacityInput,
      lineWidthInput,
      showIntersectionDotsInput,
    ],
  );
}

function useCameraGridOptions2({
  dotSize: dotSizeInput,
  animated: animatedInput,
}: Parameters<typeof resolveCameraGridOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveCameraGridOptions2({
        dotSize: dotSizeInput,
        animated: animatedInput,
      }),
    [dotSizeInput, animatedInput],
  );
}

function useCameraScanOverlayOptions({
  isAligned: isAlignedInput,
  isScanning: isScanningInput,
  isProcessing: isProcessingInput,
  status: statusInput,
  showStatusText: showStatusTextInput,
  documentType: documentTypeInput,
}: Parameters<typeof resolveCameraScanOverlayOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraScanOverlayOptions({
        isAligned: isAlignedInput,
        isScanning: isScanningInput,
        isProcessing: isProcessingInput,
        status: statusInput,
        showStatusText: showStatusTextInput,
        documentType: documentTypeInput,
      }),
    [
      isAlignedInput,
      isScanningInput,
      isProcessingInput,
      statusInput,
      showStatusTextInput,
      documentTypeInput,
    ],
  );
}

function useCameraTimerOptions({
  timerStyle: timerStyleInput,
  size: sizeInput,
  color: colorInput,
  backgroundColor: backgroundColorInput,
  animated: animatedInput,
  showPulse: showPulseInput,
}: Parameters<typeof resolveCameraTimerOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraTimerOptions({
        timerStyle: timerStyleInput,
        size: sizeInput,
        color: colorInput,
        backgroundColor: backgroundColorInput,
        animated: animatedInput,
        showPulse: showPulseInput,
      }),
    [
      timerStyleInput,
      sizeInput,
      colorInput,
      backgroundColorInput,
      animatedInput,
      showPulseInput,
    ],
  );
}

function useCameraOptions6({
  requestingTitle: requestingTitleInput,
  requestingDescription: requestingDescriptionInput,
  deniedTitle: deniedTitleInput,
  deniedDescription: deniedDescriptionInput,
  errorTitle: errorTitleInput,
  errorDescription: errorDescriptionInput,
}: Parameters<typeof resolveCameraOptions6>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions6({
        requestingTitle: requestingTitleInput,
        requestingDescription: requestingDescriptionInput,
        deniedTitle: deniedTitleInput,
        deniedDescription: deniedDescriptionInput,
        errorTitle: errorTitleInput,
        errorDescription: errorDescriptionInput,
      }),
    [
      requestingTitleInput,
      requestingDescriptionInput,
      deniedTitleInput,
      deniedDescriptionInput,
      errorTitleInput,
      errorDescriptionInput,
    ],
  );
}

function useCameraOptions7({
  showHelpLink: showHelpLinkInput,
  alwaysShow: alwaysShowInput,
}: Parameters<typeof resolveCameraOptions7>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions7({
        showHelpLink: showHelpLinkInput,
        alwaysShow: alwaysShowInput,
      }),
    [showHelpLinkInput, alwaysShowInput],
  );
}

function useCameraFocusIndicatorOptions({
  isLocked: isLockedInput,
  indicatorStyle: indicatorStyleInput,
  size: sizeInput,
  color: colorInput,
  lockedColor: lockedColorInput,
  strokeWidth: strokeWidthInput,
}: Parameters<typeof resolveCameraFocusIndicatorOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraFocusIndicatorOptions({
        isLocked: isLockedInput,
        indicatorStyle: indicatorStyleInput,
        size: sizeInput,
        color: colorInput,
        lockedColor: lockedColorInput,
        strokeWidth: strokeWidthInput,
      }),
    [
      isLockedInput,
      indicatorStyleInput,
      sizeInput,
      colorInput,
      lockedColorInput,
      strokeWidthInput,
    ],
  );
}

function useCameraFocusIndicatorOptions2({
  animationDuration: animationDurationInput,
}: Parameters<typeof resolveCameraFocusIndicatorOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveCameraFocusIndicatorOptions2({
        animationDuration: animationDurationInput,
      }),
    [animationDurationInput],
  );
}

function useCameraVoiceControlOptions({
  enabled: enabledInput,
  language: languageInput,
  showListeningIndicator: showListeningIndicatorInput,
  showCommandFeedback: showCommandFeedbackInput,
  feedbackDuration: feedbackDurationInput,
  position: positionInput,
}: Parameters<typeof resolveCameraVoiceControlOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraVoiceControlOptions({
        enabled: enabledInput,
        language: languageInput,
        showListeningIndicator: showListeningIndicatorInput,
        showCommandFeedback: showCommandFeedbackInput,
        feedbackDuration: feedbackDurationInput,
        position: positionInput,
      }),
    [
      enabledInput,
      languageInput,
      showListeningIndicatorInput,
      showCommandFeedbackInput,
      feedbackDurationInput,
      positionInput,
    ],
  );
}

function useCameraOptions({
  mode: modeInput,
  autoStart: autoStartInput,
  enableKeyboardShortcuts: enableKeyboardShortcutsInput,
  enableGestures: enableGesturesInput,
  enableVoiceControl: enableVoiceControlInput,
  mirrorCapture: mirrorCaptureInput,
}: Parameters<typeof resolveCameraOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions({
        mode: modeInput,
        autoStart: autoStartInput,
        enableKeyboardShortcuts: enableKeyboardShortcutsInput,
        enableGestures: enableGesturesInput,
        enableVoiceControl: enableVoiceControlInput,
        mirrorCapture: mirrorCaptureInput,
      }),
    [
      modeInput,
      autoStartInput,
      enableKeyboardShortcutsInput,
      enableGesturesInput,
      enableVoiceControlInput,
      mirrorCaptureInput,
    ],
  );
}

function useCameraOptions2({
  enableHaptics: enableHapticsInput,
  announceStatus: announceStatusInput,
  captureQuality: captureQualityInput,
  captureFormat: captureFormatInput,
}: Parameters<typeof resolveCameraOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions2({
        enableHaptics: enableHapticsInput,
        announceStatus: announceStatusInput,
        captureQuality: captureQualityInput,
        captureFormat: captureFormatInput,
      }),
    [
      enableHapticsInput,
      announceStatusInput,
      captureQualityInput,
      captureFormatInput,
    ],
  );
}

function useCameraOptions3({
  labelPosition: labelPositionInput,
  showLabel: showLabelInput,
  indicator: indicatorInput,
  hapticPattern: hapticPatternInput,
  pressAnimation: pressAnimationInput,
}: Parameters<typeof resolveCameraOptions3>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions3({
        labelPosition: labelPositionInput,
        showLabel: showLabelInput,
        indicator: indicatorInput,
        hapticPattern: hapticPatternInput,
        pressAnimation: pressAnimationInput,
      }),
    [
      labelPositionInput,
      showLabelInput,
      indicatorInput,
      hapticPatternInput,
      pressAnimationInput,
    ],
  );
}

function useCameraOptions5({
  showCapture: showCaptureInput,
  showRecord: showRecordInput,
  showSwitch: showSwitchInput,
  showFlash: showFlashInput,
  autoHide: autoHideInput,
}: Parameters<typeof resolveCameraOptions5>[0]) {
  return React.useMemo(
    () =>
      resolveCameraOptions5({
        showCapture: showCaptureInput,
        showRecord: showRecordInput,
        showSwitch: showSwitchInput,
        showFlash: showFlashInput,
        autoHide: autoHideInput,
      }),
    [
      showCaptureInput,
      showRecordInput,
      showSwitchInput,
      showFlashInput,
      autoHideInput,
    ],
  );
}

function useCameraGuideOptions({
  isAligned: isAlignedInput,
  showInstruction: showInstructionInput,
  instructionPosition: instructionPositionInput,
  showAlignmentIndicator: showAlignmentIndicatorInput,
  alignmentIndicatorPosition: alignmentIndicatorPositionInput,
  showMeasurements: showMeasurementsInput,
}: Parameters<typeof resolveCameraGuideOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraGuideOptions({
        isAligned: isAlignedInput,
        showInstruction: showInstructionInput,
        instructionPosition: instructionPositionInput,
        showAlignmentIndicator: showAlignmentIndicatorInput,
        alignmentIndicatorPosition: alignmentIndicatorPositionInput,
        showMeasurements: showMeasurementsInput,
      }),
    [
      isAlignedInput,
      showInstructionInput,
      instructionPositionInput,
      showAlignmentIndicatorInput,
      alignmentIndicatorPositionInput,
      showMeasurementsInput,
    ],
  );
}

function useCameraGuideOptions2({
  showCenterCross: showCenterCrossInput,
}: Parameters<typeof resolveCameraGuideOptions2>[0]) {
  return React.useMemo(
    () => resolveCameraGuideOptions2({ showCenterCross: showCenterCrossInput }),
    [showCenterCrossInput],
  );
}

function useCameraZoomIndicatorOptions({
  minZoom: minZoomInput,
  maxZoom: maxZoomInput,
  position: positionInput,
  format: formatInput,
  showBar: showBarInput,
  showOnChange: showOnChangeInput,
}: Parameters<typeof resolveCameraZoomIndicatorOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCameraZoomIndicatorOptions({
        minZoom: minZoomInput,
        maxZoom: maxZoomInput,
        position: positionInput,
        format: formatInput,
        showBar: showBarInput,
        showOnChange: showOnChangeInput,
      }),
    [
      minZoomInput,
      maxZoomInput,
      positionInput,
      formatInput,
      showBarInput,
      showOnChangeInput,
    ],
  );
}

function useCameraZoomIndicatorOptions2({
  hideDelay: hideDelayInput,
  alwaysVisible: alwaysVisibleInput,
}: Parameters<typeof resolveCameraZoomIndicatorOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveCameraZoomIndicatorOptions2({
        hideDelay: hideDelayInput,
        alwaysVisible: alwaysVisibleInput,
      }),
    [hideDelayInput, alwaysVisibleInput],
  );
}

function useKiraCameraOptions({
  label: labelInput,
  description: descriptionInput,
  acceptLabel: acceptLabelInput,
  successMessage: successMessageInput,
  allowFileSelection: allowFileSelectionInput,
  maxFileSize: maxFileSizeInput,
}: Parameters<typeof resolveKiraCameraOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraCameraOptions({
        label: labelInput,
        description: descriptionInput,
        acceptLabel: acceptLabelInput,
        successMessage: successMessageInput,
        allowFileSelection: allowFileSelectionInput,
        maxFileSize: maxFileSizeInput,
      }),
    [
      labelInput,
      descriptionInput,
      acceptLabelInput,
      successMessageInput,
      allowFileSelectionInput,
      maxFileSizeInput,
    ],
  );
}

function useKiraCameraOptions2({
  disabled: disabledInput,
  facingMode: facingModeInput,
  mode: modeInput,
}: Parameters<typeof resolveKiraCameraOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveKiraCameraOptions2({
        disabled: disabledInput,
        facingMode: facingModeInput,
        mode: modeInput,
      }),
    [disabledInput, facingModeInput, modeInput],
  );
}

function cameraUseCallback(
  cycleOptions: boolean,
  gridType: CameraGridType,
  onGridChange: ((gridType: CameraGridType) => void) | undefined,
) {
  if (cycleOptions) {
    const options = GRID_OPTIONS.map((opt) => opt.value);
    const currentIndex = options.indexOf(gridType);
    const nextIndex = (currentIndex + 1) % options.length;
    onGridChange?.(options[nextIndex]);
  } else {
    onGridChange?.(gridType === "none" ? "rule-of-thirds" : "none");
  }
}

function cameraUseCallback2(
  zoomAction: "in" | "out" | "reset",
  onZoom: ((delta: number) => void) | undefined,
) {
  if (zoomAction === "in") {
    onZoom?.(0.5);
  } else if (zoomAction === "out") {
    onZoom?.(-0.5);
  } else {
    onZoom?.(0);
  }
}

function cameraUseMemo(
  position: "top" | "bottom" | "left" | "right" | "floating" | null | undefined,
  floatingPosition:
    | {
        top?: string | number;
        bottom?: string | number;
        left?: string | number;
        right?: string | number;
      }
    | undefined,
) {
  if (position !== "floating" || !floatingPosition) return {};

  return {
    top: floatingPosition.top,
    bottom: floatingPosition.bottom,
    left: floatingPosition.left,
    right: floatingPosition.right,
  };
}

function cameraReceiveCommand(
  command: CameraVoiceCommand,
  phrase: string,
  confidence: number,
  onCommand:
    | ((
        command: CameraVoiceCommand,
        phrase: string,
        confidence: number,
      ) => void)
    | undefined,
  setFeedback: React.Dispatch<
    React.SetStateAction<{
      command: CameraVoiceCommand;
      confidence: number;
    } | null>
  >,
  feedbackTimer: React.RefObject<number | null>,
  feedbackDuration: number,
) {
  onCommand?.(command, phrase, confidence);
  setFeedback({ command, confidence });

  if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  feedbackTimer.current = setTimeout(
    () => setFeedback(null),
    Math.max(0, Number.isFinite(feedbackDuration) ? feedbackDuration : 2000),
  );
}

function cameraUseCallback3(
  hapticPattern:
    "success" | "none" | "error" | "light" | "medium" | "heavy" | "warning",
) {
  if (
    hapticPattern === "none" ||
    typeof navigator === "undefined" ||
    !navigator.vibrate
  )
    return;
  const pattern = HAPTIC_PATTERNS[hapticPattern];

  if (Array.isArray(pattern)) {
    navigator.vibrate(pattern.slice());
  } else {
    navigator.vibrate(pattern);
  }
}

function cameraUseMemo2(
  reducedMotion: boolean,
  pressAnimation: "none" | "scale" | "bounce",
  isPressed: boolean,
) {
  if (reducedMotion || pressAnimation === "none" || !isPressed) {
    return {};
  }

  if (pressAnimation === "scale") {
    return { transform: "scale(0.92)" };
  }

  if (pressAnimation === "bounce") {
    return { transform: "scale(0.95)" };
  }

  return {};
}

function cameraUseCallback4(
  capture: () => CaptureResult | null,
  onCapture: (() => void) | undefined,
  captureButtonRef: React.RefObject<HTMLButtonElement | null>,
) {
  const result = capture();

  if (result) {
    onCapture?.();
  }

  captureButtonRef.current?.focus();
}

async function cameraUseCallback5(
  isRecording: boolean,
  stopRecording: () => Promise<Blob | null>,
  onRecordStop: ((blob: Blob | null) => void) | undefined,
  startRecording: () => void,
  onRecordStart: (() => void) | undefined,
) {
  if (isRecording) {
    const blob = await stopRecording();
    onRecordStop?.(blob);
  } else {
    startRecording();
    onRecordStart?.();
  }
}

function cameraUseMemo3(
  preset: GuidePreset | undefined,
  variant: "face" | "document" | undefined,
  documentType: DocumentType | undefined,
) {
  if (preset) return preset;

  if (variant === "document" && documentType) {
    return documentTypeToPreset[documentType];
  }

  if (variant) {
    return variantToPreset[variant];
  }

  return "custom";
}

function cameraUseMemo4(
  effectivePreset: GuidePreset,
  config: Partial<CameraGuideConfig> | undefined,
) {
  const presetConfig = getGuidePreset(effectivePreset);

  return {
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- The preserved shape key describes public geometric variants and guide outlines.
    shape: presetConfig.shape,
    aspectRatio: presetConfig.aspectRatio,
    width: presetConfig.width,
    height: presetConfig.height,
    strokeWidth: presetConfig.strokeWidth ?? 3,
    cornerStyle: presetConfig.cornerStyle ?? "none",
    cornerSize: presetConfig.cornerSize ?? 20,
    strokeColor: "#ffffff",
    alignedColor: "#4ade80",
    misalignedColor: "#fbbf24",
    fillColor: "rgba(0, 0, 0, 0.3)",
    animation: "none",
    animationDuration: 2000,
    ...config,
  };
}

function cameraUseMemo5(
  safeZone:
    | {
        top?: number | string;
        bottom?: number | string;
        left?: number | string;
        right?: number | string;
      }
    | undefined,
) {
  if (!safeZone) return undefined;

  return {
    paddingTop: safeZone.top,
    paddingBottom: safeZone.bottom,
    paddingLeft: safeZone.left,
    paddingRight: safeZone.right,
  };
}

function cameraUseEffect(
  showOnChange: boolean,
  alwaysVisible: boolean,
  setHiddenZoom: React.Dispatch<React.SetStateAction<number | null>>,
  zoom: number,
  hideDelay: number,
) {
  if (!showOnChange || alwaysVisible) return;

  const timer = setTimeout(
    () => setHiddenZoom(zoom),
    Math.max(0, Number.isFinite(hideDelay) ? hideDelay : 2000),
  );

  return () => clearTimeout(timer);
}

function cameraReceiveCapture(
  capture: CaptureResult,
  disabled: boolean,
  operationRef: React.RefObject<AbortController | null>,
  releaseOwnedImage: () => void,
  ownedUrlRef: React.RefObject<string | null>,
  focusAfterChangeRef: React.RefObject<boolean>,
  setPhase: React.Dispatch<React.SetStateAction<CameraReviewPhase>>,
) {
  if (disabled || operationRef.current) {
    URL.revokeObjectURL(capture.url);

    return;
  }

  releaseOwnedImage();
  ownedUrlRef.current = capture.url;
  focusAfterChangeRef.current = true;
  setPhase({ status: "review", capture: { ...capture, source: "camera" } });
}

function cameraRetake(
  operationRef: React.RefObject<AbortController | null>,
  releaseOwnedImage: () => void,
  focusAfterChangeRef: React.RefObject<boolean>,
  fileInputRef: React.RefObject<HTMLInputElement | null>,
  setPhase: React.Dispatch<React.SetStateAction<CameraReviewPhase>>,
) {
  operationRef.current?.abort();
  operationRef.current = null;
  releaseOwnedImage();
  focusAfterChangeRef.current = true;

  if (fileInputRef.current) fileInputRef.current.value = "";
  setPhase({ status: "capture" });
}

function cameraCancel(
  operationRef: React.RefObject<AbortController | null>,
  focusAfterChangeRef: React.RefObject<boolean>,
  setPhase: React.Dispatch<React.SetStateAction<CameraReviewPhase>>,
  review: CameraReviewCapture | null,
) {
  operationRef.current?.abort();
  operationRef.current = null;
  focusAfterChangeRef.current = true;
  setPhase(
    review
      ? {
          status: "review",
          capture: review,
          message: "Acceptance cancelled. The image is ready to retry.",
        }
      : {
          status: "capture",
          message: "Image selection cancelled. Choose another image.",
        },
  );
}

function cameraUseEffect2(
  mountedRef: React.RefObject<boolean>,
  operationRef: React.RefObject<AbortController | null>,
  releaseOwnedImage: () => void,
) {
  mountedRef.current = true;

  return () => {
    mountedRef.current = false;
    operationRef.current?.abort();
    operationRef.current = null;
    releaseOwnedImage();
  };
}

function createPrimaryGridRenderers({
  animationClass,
  lineStyle,
  showIntersectionDots,
  dotSize,
  dotStyle,
}: {
  animationClass: "animate-in fade-in-0 duration-200" | "";
  lineStyle: React.CSSProperties;
  showIntersectionDots: boolean;
  dotSize: number;
  dotStyle: React.CSSProperties;
}) {
  const renderRuleOfThirds = () => (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="33.33" y1="0" x2="33.33" y2="100" style={lineStyle} />
      <line x1="66.66" y1="0" x2="66.66" y2="100" style={lineStyle} />
      <line x1="0" y1="33.33" x2="100" y2="33.33" style={lineStyle} />
      <line x1="0" y1="66.66" x2="100" y2="66.66" style={lineStyle} />
      {showIntersectionDots && (
        <>
          <circle cx="33.33" cy="33.33" r={dotSize / 2} style={dotStyle} />
          <circle cx="66.66" cy="33.33" r={dotSize / 2} style={dotStyle} />
          <circle cx="33.33" cy="66.66" r={dotSize / 2} style={dotStyle} />
          <circle cx="66.66" cy="66.66" r={dotSize / 2} style={dotStyle} />
        </>
      )}
    </svg>
  );

  const renderGoldenRatio = () => {
    const phi = 1.618;
    const goldenX = 100 / phi;
    const goldenY = 100 / phi;

    return (
      <CameraContentView4
        animationClass={animationClass}
        goldenX={goldenX}
        lineStyle={lineStyle}
        goldenY={goldenY}
      />
    );
  };

  return { renderRuleOfThirds, renderGoldenRatio } satisfies {
    renderRuleOfThirds: typeof renderRuleOfThirds;
    renderGoldenRatio: typeof renderGoldenRatio;
  };
}

function createSecondaryGridRenderers({
  animationClass,
  lineStyle,
  dotSize,
  dotStyle,
}: {
  animationClass: "animate-in fade-in-0 duration-200" | "";
  lineStyle: React.CSSProperties;
  dotSize: number;
  dotStyle: React.CSSProperties;
}) {
  const renderSquare = () => (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <rect
        x="25"
        y="25"
        width="50"
        height="50"
        fill="none"
        style={lineStyle}
      />
      <line x1="25" y1="25" x2="75" y2="75" style={lineStyle} />
      <line x1="75" y1="25" x2="25" y2="75" style={lineStyle} />
    </svg>
  );

  const renderDiagonal = () => (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="0" y1="0" x2="100" y2="100" style={lineStyle} />
      <line x1="100" y1="0" x2="0" y2="100" style={lineStyle} />
    </svg>
  );

  const renderCenterCross = () => (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="50" y1="40" x2="50" y2="60" style={lineStyle} />
      <line x1="40" y1="50" x2="60" y2="50" style={lineStyle} />
      <circle cx="50" cy="50" r={dotSize} style={dotStyle} />
    </svg>
  );

  return { renderSquare, renderDiagonal, renderCenterCross } satisfies {
    renderSquare: typeof renderSquare;
    renderDiagonal: typeof renderDiagonal;
    renderCenterCross: typeof renderCenterCross;
  };
}

function getScanOverlayPresentation({
  isScanning,
  isProcessing,
  status,
  pageVisible,
  config,
  reducedMotion,
  preset,
  documentAspectRatio,
  documentType,
  isAligned,
  statusText,
}: GetScanOverlayPresentationParams) {
  const active =
    isScanning && !isProcessing && ["scanning", "aligned"].includes(status);

  const animate = [
    active,
    pageVisible,
    config.animationsEnabled !== false,
    !reducedMotion,
  ].every(Boolean);

  const duration = Math.max(
    500,
    Number.isFinite(config.scanLineDuration)
      ? (config.scanLineDuration ?? 2000)
      : 2000,
  );

  const ratio = cameraRatioValue(preset, documentAspectRatio, documentType);

  const color = isAligned ? config.frameAlignedColor : config.frameColor;
  const stroke = Math.max(1, config.frameStrokeWidth ?? 2);
  const cornerSize = Math.max(4, config.cornerSize ?? 16);

  const message =
    statusText ?? cameraValueValue3(status, isProcessing, isAligned);

  const corners = [
    "top-0 left-0 border-t border-l",
    "top-0 right-0 border-t border-r",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];

  return {
    ratio,
    stroke,
    color,
    corners,
    cornerSize,
    active,
    animate,
    duration,
    message,
  } satisfies {
    ratio: typeof ratio;
    stroke: typeof stroke;
    color: typeof color;
    corners: typeof corners;
    cornerSize: typeof cornerSize;
    active: typeof active;
    animate: typeof animate;
    duration: typeof duration;
    message: typeof message;
  };
}

type CameraScanOverlayViewProps = {
  preset: CameraScanOverlayProps["preset"];
  status: CameraScanOverlayStatus;
  className: CameraScanOverlayProps["className"];
  ratio: number;
  stroke: number;
  color: string;
  config:
    | {
        frameColor: string;
        frameAlignedColor: string;
        frameStrokeWidth: number;
        scanLineEnabled: boolean;
        scanLineColor: string;
        scanLineDuration: number;
        cornersEnabled: boolean;
        cornerSize: number;
        cornerGlow: boolean;
        showStatusBadge: boolean;
        showAlignmentIndicator: boolean;
        animationsEnabled: boolean;
      }
    | {
        frameColor: string;
        frameAlignedColor: string;
        frameStrokeWidth: number;
        scanLineEnabled: boolean;
        scanLineColor: string;
        scanLineDuration: number;
        cornersEnabled: boolean;
        cornerSize: number;
        cornerGlow: boolean;
        showStatusBadge: boolean;
        showAlignmentIndicator: boolean;
        animationsEnabled: boolean;
      }
    | {
        frameColor: string;
        frameAlignedColor: string;
        frameStrokeWidth: number;
        scanLineEnabled: boolean;
        scanLineColor: string;
        scanLineDuration: number;
        cornersEnabled: boolean;
        cornerSize: number;
        cornerGlow: boolean;
        showStatusBadge: boolean;
        showAlignmentIndicator: boolean;
        animationsEnabled: boolean;
      };
  corners: string[];
  cornerSize: number;
  active: boolean;
  animate: boolean;
  duration: number;
  showStatusText: boolean;
  message: string;
  isAligned: boolean;
};

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- The pure overlay renderer groups frame geometry, corner styles, scan-line styles and its live status without owning scanning state.
function CameraScanOverlayView({
  preset,
  status,
  className,
  ratio,
  stroke,
  color,
  config,
  corners,
  cornerSize,
  active,
  animate,
  duration,
  showStatusText,
  message,
  isAligned,
}: CameraScanOverlayViewProps) {
  return (
    <div
      data-slot="camera-scan-overlay"
      data-preset={preset}
      data-state={status}
      className={cn("absolute inset-0 pointer-events-none", className)}
    >
      <div
        data-slot="camera-scan-overlay-visual"
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center p-6"
      >
        <div
          data-slot="camera-scan-overlay-frame"
          className={cn(
            "relative max-h-full max-w-full overflow-hidden",
            preset === "face-recognition" ? "rounded-full" : "rounded-md",
          )}
          style={{
            width: preset === "face-recognition" ? "52%" : "80%",
            aspectRatio: ratio,
            border: stroke + "px solid " + (color ?? "#ffffff"),
          }}
        >
          {config.cornersEnabled &&
            preset !== "face-recognition" &&
            corners.map((position) => (
              <span
                key={position}
                data-slot="camera-scan-overlay-corner"
                className={cn("absolute", position)}
                style={{
                  width: cornerSize,
                  height: cornerSize,
                  borderColor: color,
                  borderWidth: stroke,
                  filter: config.cornerGlow
                    ? "drop-shadow(0 0 4px " + (color ?? "#ffffff") + ")"
                    : undefined,
                }}
              />
            ))}
          {config.scanLineEnabled && active && (
            <div
              data-slot="camera-scan-overlay-line"
              className="absolute inset-0"
              style={{
                animation: animate
                  ? "scan-line " + duration + "ms linear infinite"
                  : undefined,
              }}
            >
              <span
                className="absolute inset-x-0 top-1/2 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, " +
                    (config.scanLineColor ?? "#ffffff") +
                    ", transparent)",
                }}
              />
            </div>
          )}
        </div>
      </div>
      {showStatusText && config.showStatusBadge && (
        <p
          data-slot="camera-scan-overlay-status"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="absolute inset-x-4 bottom-4 mx-auto max-w-sm rounded-md bg-black/80 px-3 py-2 text-center text-sm text-white"
        >
          {message}
          {config.showAlignmentIndicator && (
            <span className="block text-xs">
              {isAligned ? "Alignment confirmed" : "Alignment pending"}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

type GetScanOverlayPresentationParams = {
  isScanning: boolean;
  isProcessing: boolean;
  status: CameraScanOverlayStatus;
  pageVisible: boolean;
  config:
    | {
        frameColor: string;
        frameAlignedColor: string;
        frameStrokeWidth: number;
        scanLineEnabled: boolean;
        scanLineColor: string;
        scanLineDuration: number;
        cornersEnabled: boolean;
        cornerSize: number;
        cornerGlow: boolean;
        showStatusBadge: boolean;
        showAlignmentIndicator: boolean;
        animationsEnabled: boolean;
      }
    | {
        frameColor: string;
        frameAlignedColor: string;
        frameStrokeWidth: number;
        scanLineEnabled: boolean;
        scanLineColor: string;
        scanLineDuration: number;
        cornersEnabled: boolean;
        cornerSize: number;
        cornerGlow: boolean;
        showStatusBadge: boolean;
        showAlignmentIndicator: boolean;
        animationsEnabled: boolean;
      }
    | {
        frameColor: string;
        frameAlignedColor: string;
        frameStrokeWidth: number;
        scanLineEnabled: boolean;
        scanLineColor: string;
        scanLineDuration: number;
        cornersEnabled: boolean;
        cornerSize: number;
        cornerGlow: boolean;
        showStatusBadge: boolean;
        showAlignmentIndicator: boolean;
        animationsEnabled: boolean;
      };
  reducedMotion: boolean;
  preset: CameraScanOverlayProps["preset"];
  documentAspectRatio: CameraScanOverlayProps["documentAspectRatio"];
  documentType: "national-id" | "passport" | "drivers-license" | "custom";
  isAligned: boolean;
  statusText: CameraScanOverlayProps["statusText"];
};
