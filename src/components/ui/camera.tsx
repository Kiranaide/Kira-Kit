"use client";

import * as React from "react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCamera,
  IconCameraOff,
  IconCameraRotate,
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
  IconKeyboard,
  IconMicrophone,
  IconMicrophoneOff,
  IconEye,
  IconMoodSmile,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type {
  CameraError,
  CameraFacingMode,
  CameraMode,
  CameraStatus,
  CaptureResult,
  MediaDeviceInfo,
  CameraTimerDuration,
  CameraGridType,
  CameraGridConfig,
  CameraAspectRatio,
  CameraQuality,
  CameraSettingsValues,
  CameraFocusIndicatorStyle,
  CameraVoiceCommand,
  LivenessChallenge,
  CameraGuideConfig,
  CameraGuideAnimation,
  CameraScanOverlayPreset,
  CameraScanOverlayConfig,
} from "@/lib/camera/types";
import {
  HAPTIC_PATTERNS,
  STATUS_ANNOUNCEMENTS,
  ENHANCED_KEYBOARD_SHORTCUTS,
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
import {
  prefersReducedMotion,
  getPermissionHelpLink,
} from "@/lib/camera/utils";
import { useCamera } from "@/hooks/use-camera";

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}
import { getGuidePreset, type GuidePreset } from "@/lib/camera/guide-presets";

interface CameraState {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  status: CameraStatus;
  error: CameraError | null;
  devices: MediaDeviceInfo[];
  activeDeviceId: string | null;
  facingMode: CameraFacingMode;
  isRecording: boolean;
  isPaused: boolean;
  isRetrying: boolean;
  isFlashSupported: boolean;
  isFlashOn: boolean;
}

interface CameraActions {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  capture: () => CaptureResult | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  switchCamera: () => Promise<void>;
  switchDevice: (deviceId: string) => Promise<void>;
  toggleFlash: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  refreshDevices: () => Promise<void>;
}

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
    "relative overflow-hidden bg-black",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  ],
  {
    variants: {
      size: {
        default: "w-full aspect-video",
        sm: "w-64 aspect-video",
        md: "w-96 aspect-video",
        lg: "w-[32rem] aspect-video",
        full: "w-full h-full",
        square: "w-full aspect-square",
        fullscreen: "w-full h-[100vh]",
      },
      shape: {
        default: "rounded-lg",
        rounded: "rounded-2xl",
        circle: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "default",
    },
  }
);

const cameraButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-white text-black hover:bg-white/90 active:bg-white/80",
        secondary:
          "bg-white/20 text-white hover:bg-white/30 active:bg-white/40 backdrop-blur-sm",
        recording: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        ghost: "bg-transparent text-white hover:bg-white/10 active:bg-white/20",
        danger: "bg-red-500/80 text-white hover:bg-red-500 active:bg-red-600",
        success:
          "bg-green-500 text-white hover:bg-green-600 active:bg-green-700",
      },
      size: {
        xs: "h-8 w-8 min-h-8 min-w-8",
        sm: "h-10 w-10 min-h-10 min-w-10",
        md: "h-12 w-12 min-h-12 min-w-12",
        lg: "h-16 w-16 min-h-16 min-w-16",
        xl: "h-20 w-20 min-h-20 min-w-20",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-xl",
        square: "rounded-none",
        pill: "rounded-full px-4",
      },
    },
    compoundVariants: [
      { size: "xs", shape: "pill", className: "px-3 text-xs" },
      { size: "sm", shape: "pill", className: "px-4" },
      { size: "md", shape: "pill", className: "px-5" },
      { size: "lg", shape: "pill", className: "px-6" },
      { size: "xl", shape: "pill", className: "px-8" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "circle",
    },
  }
);

const cameraControlsVariants = cva(
  [
    "absolute left-0 right-0 flex items-center justify-center gap-4 p-4",
    "transition-opacity duration-200",
  ],
  {
    variants: {
      position: {
        bottom: "bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))]",
        top: "top-0 pt-[max(1rem,env(safe-area-inset-top))]",
        floating:
          "bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-full",
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
  }
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
  }
);

const cameraPermissionsVariants = cva(
  ["flex flex-col items-center justify-center gap-4 p-6", "text-center"],
  {
    variants: {
      variant: {
        default: "bg-muted/50",
        overlay: "absolute inset-0 bg-black/80 backdrop-blur-sm z-10",
        card: "bg-card border rounded-lg shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
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
  }
);

const BUTTON_ICON_SIZES = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

const GRID_ICONS: Record<CameraGridType, React.ReactNode> = {
  none: <IconX size={20} />,
  "rule-of-thirds": <IconGrid3x3 size={20} />,
  "golden-ratio": <IconLayoutGrid size={20} />,
  square: <IconGrid4x4 size={20} />,
  diagonal: <IconSlash size={20} />,
  "center-cross": <IconGridDots size={20} />,
};

const CHALLENGE_ICONS = {
  blink: IconEye,
  smile: IconMoodSmile,
  "turn-left": IconArrowLeft,
  "turn-right": IconArrowRight,
  "turn-up": IconArrowUp,
  "turn-down": IconArrowDown,
} as const;

interface CameraProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "onError">,
    VariantProps<typeof cameraVariants> {
  mode?: CameraMode;
  facingMode?: CameraFacingMode;
  autoStart?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableHaptics?: boolean;
  announceStatus?: boolean;
  captureQuality?: number;
  captureFormat?: "image/jpeg" | "image/png";
  onCapture?: (result: CaptureResult) => void;
  onError?: (error: CameraError) => void;
  onStatusChange?: (status: string) => void;
  onReady?: () => void;
}

interface CameraRef {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  capture: () => CaptureResult | null;
  switchCamera: () => Promise<void>;
  toggleFlash: () => Promise<void>;
}

const CameraRoot = React.forwardRef<CameraRef, CameraProps>(
  (
    {
      className,
      size,
      shape,
      mode = "selfie",
      facingMode: initialFacingMode,
      autoStart = false,
      enableKeyboardShortcuts = true,
      enableHaptics = true,
      announceStatus = true,
      captureQuality = 0.95,
      captureFormat = "image/jpeg",
      onCapture,
      onError,
      onStatusChange,
      onReady,
      children,
      ...props
    },
    ref
  ) => {
    const effectiveFacingMode =
      initialFacingMode ?? (mode === "selfie" ? "user" : "environment");

    const camera = useCamera({
      facingMode: effectiveFacingMode,
      autoStart,
      enableKeyboardShortcuts,
      enableHaptics,
      captureQuality,
      captureFormat,
      onCapture,
      onError,
      onStatusChange: (status: CameraStatus) => {
        onStatusChange?.(status);
        if (status === "ready") {
          onReady?.();
        }
      },
    });

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      start: camera.start,
      stop: camera.stop,
      capture: camera.capture,
      switchCamera: camera.switchCamera,
      toggleFlash: camera.toggleFlash,
    }));

    const state = React.useMemo<CameraState>(
      () => ({
        videoRef: camera.videoRef,
        stream: camera.stream,
        status: camera.status,
        error: camera.error,
        devices: camera.devices,
        activeDeviceId: camera.activeDeviceId,
        facingMode: camera.facingMode,
        isRecording: camera.isRecording,
        isPaused: camera.isPaused,
        isRetrying: camera.isRetrying,
        isFlashSupported: camera.isFlashSupported,
        isFlashOn: camera.isFlashOn,
      }),
      [
        camera.videoRef,
        camera.stream,
        camera.status,
        camera.error,
        camera.devices,
        camera.activeDeviceId,
        camera.facingMode,
        camera.isRecording,
        camera.isPaused,
        camera.isRetrying,
        camera.isFlashSupported,
        camera.isFlashOn,
      ]
    );

    const actions = React.useMemo<CameraActions>(
      () => ({
        start: camera.start,
        stop: camera.stop,
        capture: camera.capture,
        startRecording: camera.startRecording,
        stopRecording: camera.stopRecording,
        pauseRecording: camera.pauseRecording,
        resumeRecording: camera.resumeRecording,
        switchCamera: camera.switchCamera,
        switchDevice: camera.switchDevice,
        toggleFlash: camera.toggleFlash,
        requestPermission: camera.requestPermission,
        refreshDevices: camera.refreshDevices,
      }),
      [
        camera.start,
        camera.stop,
        camera.capture,
        camera.startRecording,
        camera.stopRecording,
        camera.pauseRecording,
        camera.resumeRecording,
        camera.switchCamera,
        camera.switchDevice,
        camera.toggleFlash,
        camera.requestPermission,
        camera.refreshDevices,
      ]
    );

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
        <CameraStateContext.Provider value={state}>
          <CameraActionsContext.Provider value={actions}>
            <div
              data-slot="camera"
              className={cn(cameraVariants({ size, shape, className }))}
              role="application"
              aria-label="Camera viewer"
              {...props}
            >
              {children}
              {announceStatus && (
                <CameraStatusAnnouncer status={camera.status} />
              )}
            </div>
          </CameraActionsContext.Provider>
        </CameraStateContext.Provider>
      </CameraErrorBoundary>
    );
  }
);

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
    { className, mirror, showSkeleton = true, skeleton, ...props },
    forwardedRef
  ) => {
    const { videoRef, status, facingMode } = useCameraState();
    const shouldMirror = mirror ?? facingMode === "user";
    const isLoading =
      status === "initializing" || status === "requesting-permission";
    const reducedMotion = prefersReducedMotion();

    return (
      <>
        {showSkeleton &&
          isLoading &&
          (skeleton || (
            <div
              className={cn(
                "absolute inset-0 bg-muted",
                !reducedMotion && "animate-pulse"
              )}
              aria-hidden="true"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div
                    className={cn(
                      "w-12 h-12 border-4 border-muted-foreground/30 border-t-muted-foreground rounded-full",
                      !reducedMotion && "animate-spin"
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
          ))}
        <video
          ref={mergeRefs(videoRef, forwardedRef)}
          data-slot="camera-preview"
          className={cn(
            previewVariants({ mirror: shouldMirror }),
            "w-full h-full",
            isLoading && "invisible",
            className
          )}
          autoPlay
          playsInline
          muted
          aria-hidden="true"
          {...props}
        />
      </>
    );
  }
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
          !interactive && "pointer-events-none",
          "*:pointer-events-auto",
          className
        )}
        aria-hidden="true"
        {...props}
      >
        {children}
      </div>
    );
  }
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
  const reducedMotion = prefersReducedMotion();

  if (status !== "capturing") return null;
  if (reducedMotion) return null;

  return (
    <div
      data-slot="camera-capture-flash"
      className={cn(
        "absolute inset-0 bg-white pointer-events-none",
        "animate-in fade-in-0 fade-out-0",
        className
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
    | "light"
    | "medium"
    | "heavy"
    | "success"
    | "error"
    | "warning"
    | "none";
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

const CameraButton = React.forwardRef<HTMLButtonElement, CameraButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      icon,
      iconSize,
      label,
      labelPosition = "bottom",
      showLabel = false,
      badge,
      indicator = "none",
      indicatorColor,
      isActive,
      isLoading,
      hapticPattern = "light",
      pressAnimation = "scale",
      pulse,
      pulseColor,
      action,
      style,
      onClick,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const reducedMotion = prefersReducedMotion();

    const handleHaptic = React.useCallback(() => {
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
    }, [hapticPattern]);

    const handlePointerDown = React.useCallback(() => {
      if (disabled || isLoading) return;
      setIsPressed(true);
    }, [disabled, isLoading]);

    const handlePointerUp = React.useCallback(() => {
      setIsPressed(false);
    }, []);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        handleHaptic();
        onClick?.(event);
      },
      [handleHaptic, onClick]
    );

    const pressStyles = React.useMemo(() => {
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
    }, [isPressed, pressAnimation, reducedMotion]);

    const finalIconSize = iconSize ?? BUTTON_ICON_SIZES[size ?? "md"];

    const getDefaultIcon = () => {
      switch (action) {
        case "capture":
          return <IconCamera size={finalIconSize} />;
        case "record":
          return <IconVideo size={finalIconSize} />;
        case "flash":
          return <IconBolt size={finalIconSize} />;
        case "switch":
          return <IconCameraRotate size={finalIconSize} />;
        case "timer":
          return <IconClock size={finalIconSize} />;
        case "grid":
          return <IconGrid3x3 size={finalIconSize} />;
        case "settings":
          return <IconSettings size={finalIconSize} />;
        case "zoom":
          return <IconZoomIn size={finalIconSize} />;
        case "aspectRatio":
          return <IconAspectRatio size={finalIconSize} />;
        default:
          return null;
      }
    };

    const renderIcon = () => {
      const resolvedIcon = icon ?? getDefaultIcon();
      if (!resolvedIcon) return null;
      return (
        <span
          className="flex items-center justify-center"
          style={{ width: finalIconSize, height: finalIconSize }}
        >
          {React.isValidElement(resolvedIcon)
            ? React.cloneElement(
                resolvedIcon as React.ReactElement<{ size?: number }>,
                { size: finalIconSize }
              )
            : resolvedIcon}
        </span>
      );
    };

    const renderBadge = () => {
      if (!badge) return null;
      return (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      );
    };

    const renderIndicator = () => {
      if (indicator === "none") return null;
      const indicatorStyle = { backgroundColor: indicatorColor };

      if (indicator === "dot") {
        return (
          <span
            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
            style={indicatorStyle}
          />
        );
      }
      if (indicator === "ring") {
        return (
          <span
            className="absolute inset-0 rounded-full ring-2 ring-offset-2"
            style={{
              ...indicatorStyle,
              boxShadow: `0 0 0 2px ${indicatorColor}, 0 0 0 4px transparent`,
            }}
          />
        );
      }
      return null;
    };

    const renderPulse = () => {
      if (!pulse || reducedMotion) return null;
      return (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: pulseColor || "currentColor" }}
        />
      );
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          cameraButtonVariants({ variant, size, shape }),
          "relative touch-manipulation select-none",
          isActive && "ring-2 ring-white/50",
          isLoading && "cursor-wait",
          className
        )}
        style={{ ...style, ...pressStyles }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
        disabled={disabled || isLoading}
        data-slot="camera-button"
        data-action={action}
        data-active={isActive}
        data-loading={isLoading}
        {...props}
      >
        {renderPulse()}
        {renderIndicator()}
        {renderBadge()}
        {isLoading ? (
          <IconLoader2 className="animate-spin" size={finalIconSize} />
        ) : showLabel && label ? (
          <span
            className={cn(
              "flex items-center gap-1",
              labelPosition === "bottom" && "flex-col",
              labelPosition === "top" && "flex-col-reverse"
            )}
          >
            {renderIcon()}
            <span className="text-xs font-medium">{label}</span>
          </span>
        ) : (
          <>
            {renderIcon()}
            {children}
          </>
        )}
      </button>
    );
  }
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
      innerRingColor = "#ef4444",
      className,
      children,
      ...props
    },
    ref
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
            className="absolute inset-2 rounded-full border-4"
            style={{ borderColor: innerRingColor }}
            aria-hidden="true"
          />
        )}
        {children}
      </CameraButton>
    );
  }
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
      isRecording = false,
      size = "md",
      showTimeBadge = false,
      recordingDuration = 0,
      className,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: { button: "md" as const, icon: 20 },
      md: { button: "lg" as const, icon: 24 },
      lg: { button: "xl" as const, icon: 28 },
    };
    const { button: buttonSize, icon: iconSize } = sizeMap[size];

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <CameraButton
        ref={ref}
        variant={isRecording ? "recording" : "secondary"}
        size={buttonSize}
        shape="circle"
        icon={
          isRecording ? (
            <IconSquare size={iconSize} />
          ) : (
            <IconVideo size={iconSize} />
          )
        }
        iconSize={iconSize}
        pulse={isRecording}
        pulseColor="#ef4444"
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
  }
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
        size="md"
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
  }
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
  "icon" | "onClick" | "badge"
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
    ref
  ) => {
    const handleClick = React.useCallback(() => {
      const currentIndex = options.indexOf(duration);
      const nextIndex = (currentIndex + 1) % options.length;
      onDurationChange?.(options[nextIndex]);
    }, [duration, options, onDurationChange]);

    const isActive = duration > 0;

    return (
      <CameraButton
        ref={ref}
        variant={isActive ? "secondary" : "ghost"}
        size="md"
        shape="circle"
        icon={<IconClock size={20} />}
        badge={showBadge && isActive ? `${duration}s` : undefined}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        action="timer"
        className={className}
        {...props}
      />
    );
  }
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
    ref
  ) => {
    const handleClick = React.useCallback(() => {
      if (cycleOptions) {
        const options = GRID_OPTIONS.map((opt) => opt.value);
        const currentIndex = options.indexOf(gridType);
        const nextIndex = (currentIndex + 1) % options.length;
        onGridChange?.(options[nextIndex] as CameraGridType);
      } else {
        onGridChange?.(gridType === "none" ? "rule-of-thirds" : "none");
      }
    }, [gridType, onGridChange, cycleOptions]);

    const isActive = gridType !== "none";

    return (
      <CameraButton
        ref={ref}
        variant={isActive ? "secondary" : "ghost"}
        size="md"
        shape="circle"
        icon={GRID_ICONS[gridType]}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        action="grid"
        className={className}
        {...props}
      />
    );
  }
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
        shape="circle"
        icon={<IconSettings size={20} />}
        hapticPattern="light"
        pressAnimation="scale"
        action="settings"
        className={className}
        {...props}
      />
    );
  }
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
    ref
  ) => {
    const handleClick = React.useCallback(() => {
      const options = ASPECT_RATIOS.map(
        (opt) => opt.name
      ) as CameraAspectRatio[];
      const currentIndex = options.indexOf(aspectRatio);
      const nextIndex = (currentIndex + 1) % options.length;
      onAspectRatioChange?.(options[nextIndex]);
    }, [aspectRatio, onAspectRatioChange]);

    return (
      <CameraButton
        ref={ref}
        variant="ghost"
        size="md"
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
  }
);

AspectRatioButton.displayName = "AspectRatioButton";

interface ZoomButtonProps extends Omit<CameraButtonProps, "icon" | "onClick"> {
  zoomAction: "in" | "out" | "reset";
  zoom?: number;
  onZoom?: (delta: number) => void;
}

const ZoomButton = React.forwardRef<HTMLButtonElement, ZoomButtonProps>(
  ({ zoomAction, zoom, onZoom, className, ...props }, ref) => {
    const handleClick = React.useCallback(() => {
      if (zoomAction === "in") {
        onZoom?.(0.5);
      } else if (zoomAction === "out") {
        onZoom?.(-0.5);
      } else {
        onZoom?.(0);
      }
    }, [zoomAction, onZoom]);

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
        shape="circle"
        icon={icon}
        badge={badge}
        hapticPattern="light"
        pressAnimation="scale"
        onClick={handleClick}
        action="zoom"
        className={className}
        {...props}
      />
    );
  }
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
  (
    {
      className,
      position,
      visibility,
      showCapture = true,
      showRecord = false,
      showSwitch = true,
      showFlash = true,
      onCapture,
      onRecordStart,
      onRecordStop,
      onSwitchCamera,
      onToggleFlash,
      autoHide = true,
      ...props
    },
    ref
  ) => {
    const { status, isRecording, isFlashSupported, isFlashOn, devices } =
      useCameraState();
    const {
      capture,
      startRecording,
      stopRecording,
      switchCamera,
      toggleFlash,
    } = useCameraActions();

    const captureButtonRef = React.useRef<HTMLButtonElement>(null);
    const isReady = status === "ready";
    const hasMultipleCameras = devices.length > 1;
    const reducedMotion = prefersReducedMotion();
    const computedVisibility = autoHide && !isReady ? "hidden" : visibility;

    const handleCapture = React.useCallback(() => {
      const result = capture();
      if (result) {
        onCapture?.();
      }
      setTimeout(() => captureButtonRef.current?.focus(), 200);
    }, [capture, onCapture]);

    const handleRecord = React.useCallback(async () => {
      if (isRecording) {
        const blob = await stopRecording();
        onRecordStop?.(blob);
      } else {
        startRecording();
        onRecordStart?.();
      }
    }, [
      isRecording,
      startRecording,
      stopRecording,
      onRecordStart,
      onRecordStop,
    ]);

    const handleSwitch = React.useCallback(async () => {
      await switchCamera();
      onSwitchCamera?.();
    }, [switchCamera, onSwitchCamera]);

    const handleFlash = React.useCallback(async () => {
      await toggleFlash();
      onToggleFlash?.(!isFlashOn);
    }, [toggleFlash, isFlashOn, onToggleFlash]);

    return (
      <div
        ref={ref}
        data-slot="camera-controls"
        className={cn(
          cameraControlsVariants({
            position,
            visibility: computedVisibility,
            className,
          })
        )}
        role="toolbar"
        aria-label="Camera controls"
        {...props}
      >
        {showFlash && isFlashSupported && (
          <FlashButton
            isEnabled={isFlashOn}
            onClick={handleFlash}
            disabled={!isReady}
          />
        )}
        {showRecord && (
          <RecordButton
            isRecording={isRecording}
            onClick={handleRecord}
            disabled={!isReady && !isRecording}
            className={cn(isRecording && !reducedMotion && "animate-pulse")}
          />
        )}
        {showCapture && (
          <CaptureButton
            ref={captureButtonRef}
            size="lg"
            onClick={handleCapture}
            disabled={!isReady}
            className="shadow-lg"
          />
        )}
        {showSwitch && (
          <SwitchCameraButton
            onClick={handleSwitch}
            disabled={!isReady || !hasMultipleCameras}
          />
        )}
      </div>
    );
  }
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
    ref
  ) => {
    const shouldShow = !autoHide || (autoHide && isReady && visible);

    const floatingStyles = React.useMemo(() => {
      if (position !== "floating" || !floatingPosition) return {};
      return {
        top: floatingPosition.top,
        bottom: floatingPosition.bottom,
        left: floatingPosition.left,
        right: floatingPosition.right,
      };
    }, [position, floatingPosition]);

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
  }
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
      className={cn(
        "flex items-center",
        direction === "horizontal" ? "flex-row gap-2" : "flex-col gap-2",
        className
      )}
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

type DocumentType = "national-id" | "passport" | "drivers-license" | "custom";

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
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
  showMeasurements?: boolean;
  showCenterCross?: boolean;
  safeZone?: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
  };
  challenge?: LivenessChallenge;
  respectReducedMotion?: boolean;
}

const variantToPreset: Record<string, GuidePreset> = {
  face: "face-oval",
  document: "id-front",
};
const documentTypeToPreset: Record<DocumentType, GuidePreset> = {
  "national-id": "id-front",
  passport: "passport",
  "drivers-license": "drivers-license",
  custom: "custom",
};

function CameraGuide({
  variant,
  documentType,
  preset,
  config,
  isAligned = false,
  alignmentProgress,
  instruction,
  showInstruction = true,
  instructionPosition = "bottom",
  showAlignmentIndicator = true,
  alignmentIndicatorPosition = "top-right",
  showMeasurements = false,
  showCenterCross = false,
  safeZone,
  challenge,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...props
}: CameraGuideProps) {
  const reducedMotion = prefersReducedMotion();

  const effectivePreset = React.useMemo(() => {
    if (preset) return preset;
    if (variant === "document" && documentType) {
      return documentTypeToPreset[documentType];
    }
    if (variant) {
      return variantToPreset[variant];
    }
    return "custom";
  }, [preset, variant, documentType]);

  const guideConfig = React.useMemo(() => {
    const presetConfig = getGuidePreset(effectivePreset);
    return {
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
      animation: "pulse" as CameraGuideAnimation,
      animationDuration: 2000,
      ...config,
    };
  }, [effectivePreset, config]);

  const currentColor = React.useMemo(() => {
    if (isAligned) return guideConfig.alignedColor;
    if (alignmentProgress !== undefined) {
      const r1 = parseInt(guideConfig.misalignedColor.slice(1, 3), 16);
      const g1 = parseInt(guideConfig.misalignedColor.slice(3, 5), 16);
      const b1 = parseInt(guideConfig.misalignedColor.slice(5, 7), 16);
      const r2 = parseInt(guideConfig.alignedColor.slice(1, 3), 16);
      const g2 = parseInt(guideConfig.alignedColor.slice(3, 5), 16);
      const b2 = parseInt(guideConfig.alignedColor.slice(5, 7), 16);
      const r = Math.round(r1 + (r2 - r1) * alignmentProgress);
      const g = Math.round(g1 + (g2 - g1) * alignmentProgress);
      const b = Math.round(b1 + (b2 - b1) * alignmentProgress);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
    return guideConfig.misalignedColor;
  }, [
    isAligned,
    alignmentProgress,
    guideConfig.alignedColor,
    guideConfig.misalignedColor,
  ]);

  const animationStyles = React.useMemo(() => {
    if (respectReducedMotion && reducedMotion) return {};
    if (guideConfig.animation === "pulse") {
      return {
        animation: `pulse ${guideConfig.animationDuration}ms ease-in-out infinite`,
      };
    }
    if (guideConfig.animation === "glow") {
      return {
        animation: `glow ${guideConfig.animationDuration}ms ease-in-out infinite`,
        boxShadow: `0 0 20px ${currentColor}40`,
      };
    }
    return {};
  }, [
    guideConfig.animation,
    guideConfig.animationDuration,
    currentColor,
    reducedMotion,
    respectReducedMotion,
  ]);

  const safeZoneStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (!safeZone) return undefined;
    return {
      paddingTop: safeZone.top,
      paddingBottom: safeZone.bottom,
      paddingLeft: safeZone.left,
      paddingRight: safeZone.right,
    };
  }, [safeZone]);

  const renderGuide = () => {
    const { shape, cornerStyle, cornerSize, strokeWidth, fillColor } =
      guideConfig;
    const strokeStyle: React.CSSProperties = {
      stroke: currentColor,
      strokeWidth,
      fill: fillColor,
    };

    if (shape === "oval" || shape === "circle") {
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

    if (shape === "rectangle" || shape === "square") {
      if (cornerStyle === "bracket" && cornerSize) {
        const cs = cornerSize;
        return (
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={animationStyles}
          >
            <path
              d={`M ${cs} 2 L 2 2 L 2 ${cs}`}
              fill="none"
              style={strokeStyle}
            />
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
      const radius = cornerStyle === "rounded" ? 8 : 0;
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
    return null;
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };
  const instructionPositionClasses = {
    top: "top-8",
    bottom: "bottom-8",
    inside: "bottom-4",
  };
  const displayInstruction =
    instruction || getGuidePreset(effectivePreset).defaultInstruction;

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
        className="relative"
        style={{
          width: guideConfig.width ?? "auto",
          height:
            guideConfig.height ??
            (guideConfig.aspectRatio ? undefined : "auto"),
          aspectRatio: guideConfig.aspectRatio?.toString(),
        }}
      >
        {renderGuide()}
        {showMeasurements && (
          <div className="absolute left-2 bottom-2 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white/80">
            {guideConfig.width && guideConfig.height
              ? `${guideConfig.width}×${guideConfig.height}`
              : guideConfig.aspectRatio
                ? `AR ${guideConfig.aspectRatio}`
                : "Custom"}
          </div>
        )}
        {showCenterCross && (
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
        )}
        {showAlignmentIndicator && (
          <div
            className={cn(
              "absolute w-3 h-3 rounded-full transition-colors duration-300",
              positionClasses[alignmentIndicatorPosition]
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
            "absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-full",
            "bg-black/60 backdrop-blur-sm text-white text-sm font-medium",
            "transition-opacity duration-300",
            instructionPositionClasses[instructionPosition]
          )}
          role="status"
          aria-live="polite"
        >
          {displayInstruction}
        </div>
      )}
      {challenge && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
          {CHALLENGE_ICONS[challenge.type] &&
            React.createElement(CHALLENGE_ICONS[challenge.type], {
              size: 20,
              className: "text-white",
            })}
          <span className="text-white text-sm font-medium">
            {challenge.description}
          </span>
        </div>
      )}
    </div>
  );
}

CameraGuide.displayName = "CameraGuide";

interface CameraGridProps extends Partial<CameraGridConfig> {
  visible?: boolean;
  type?: CameraGridType;
  className?: string;
}

function CameraGrid({
  visible = true,
  type = CAMERA_DEFAULT_GRID.type,
  color = CAMERA_DEFAULT_GRID.color,
  opacity = CAMERA_DEFAULT_GRID.opacity,
  lineWidth = CAMERA_DEFAULT_GRID.lineWidth,
  showIntersectionDots = CAMERA_DEFAULT_GRID.showIntersectionDots,
  dotSize = CAMERA_DEFAULT_GRID.dotSize,
  animated = CAMERA_DEFAULT_GRID.animated,
  className,
}: CameraGridProps) {
  const reducedMotion = prefersReducedMotion();

  if (!visible || type === "none") return null;

  const lineStyle: React.CSSProperties = {
    stroke: color,
    strokeWidth: lineWidth,
    opacity,
  };
  const dotStyle: React.CSSProperties = { fill: color, opacity: opacity * 1.5 };
  const animationClass = animated && !reducedMotion ? "animate-fade-in" : "";

  const renderRuleOfThirds = () => (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass
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
      <svg
        className={cn(
          "absolute inset-0 w-full h-full pointer-events-none",
          animationClass
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
  };

  const renderSquare = () => (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        animationClass
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
        animationClass
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
        animationClass
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="50" y1="40" x2="50" y2="60" style={lineStyle} />
      <line x1="40" y1="50" x2="60" y2="50" style={lineStyle} />
      <circle cx="50" cy="50" r={dotSize} style={dotStyle} />
    </svg>
  );

  const gridRenderers: Record<CameraGridType, () => React.ReactNode> = {
    none: () => null,
    "rule-of-thirds": renderRuleOfThirds,
    "golden-ratio": renderGoldenRatio,
    square: renderSquare,
    diagonal: renderDiagonal,
    "center-cross": renderCenterCross,
  };

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
  | "idle"
  | "scanning"
  | "aligned"
  | "processing"
  | "success"
  | "error";

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
  isAligned = false,
  isScanning = true,
  isProcessing = false,
  status = "scanning",
  statusText,
  showStatusText = true,
  config: configOverride,
  documentType = "national-id",
  className,
}: CameraScanOverlayProps) {
  const reducedMotion = prefersReducedMotion();
  const defaults = SCAN_OVERLAY_DEFAULTS[preset];
  const config: CameraScanOverlayConfig = {
    ...defaults,
    ...configOverride,
  };
  const animationsEnabled =
    config.animationsEnabled !== false && !reducedMotion;

  if (preset === "none") return null;

  const scanLineDuration = (config.scanLineDuration ?? 2000) / 1000;

  const ScanningLineEl = config.scanLineEnabled ? (
    <div
      className="absolute left-0 right-0 h-px pointer-events-none overflow-hidden"
      style={{
        top: 0,
        animation: animationsEnabled
          ? `scan-line ${scanLineDuration}s linear infinite`
          : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className="h-full w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${config.scanLineColor ?? "#3b82f6"} 50%, transparent 100%)`,
          opacity: 0.9,
          boxShadow: config.cornerGlow
            ? `0 0 8px ${config.scanLineColor ?? "#3b82f6"}`
            : undefined,
        }}
      />
    </div>
  ) : null;

  const statusMessage =
    statusText ??
    (status === "processing" || isProcessing
      ? "Processing..."
      : status === "aligned" ||
          (isAligned && (status === "scanning" || isScanning))
        ? "Hold still"
        : status === "success"
          ? "Captured"
          : status === "error"
            ? "Try again"
            : "Position in frame");

  const instructionBadge =
    showStatusText && config.showStatusBadge ? (
      <div className="absolute bottom-12 left-0 right-0 flex justify-center px-6">
        <div
          className={cn(
            "max-w-md px-4 py-2.5 rounded-lg",
            "bg-black/70 backdrop-blur-sm",
            "text-white text-sm text-center leading-relaxed"
          )}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      </div>
    ) : null;

  if (preset === "face-recognition") {
    return (
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        data-slot="camera-scan-overlay"
        data-preset="face-recognition"
        aria-hidden="true"
      >
        <div className="absolute inset-0">
          <div
            className={cn(
              "w-full h-full bg-black/10 backdrop-blur-xs",
              "mask-[radial-gradient(ellipse_30%_60%_at_center,transparent_0,transparent_55%,white_75%)]",
              "mask-alpha"
            )}
          />
        </div>
        <CameraGuide
          variant="face"
          isAligned={isAligned}
          showInstruction={false}
          showAlignmentIndicator={false}
          safeZone={{ top: "12%", bottom: "12%", left: "15%", right: "15%" }}
          config={{
            animation: "none",
            strokeWidth: 2,
            fillColor: "transparent",
            misalignedColor: "#ffffff",
            alignedColor: "#22c55e",
          }}
        />
        {ScanningLineEl}
        {instructionBadge}
      </div>
    );
  }

  if (preset === "id-card-scanner") {
    return (
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        data-slot="camera-scan-overlay"
        data-preset="id-card-scanner"
        aria-hidden="true"
      >
        <CameraGuide
          variant="document"
          documentType={documentType}
          isAligned={isAligned}
          showInstruction={false}
          showAlignmentIndicator={false}
          safeZone={{
            top: "15%",
            bottom: "15%",
            left: "10%",
            right: "10%",
          }}
          config={{
            animation: "none",
            strokeWidth: 3,
            fillColor: "transparent",
            misalignedColor: "#ffffff",
            alignedColor: "#22c55e",
          }}
        />
        {ScanningLineEl}
        {instructionBadge}
      </div>
    );
  }

  return null;
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
  timerStyle = "circular",
  size = "md",
  color = "#ffffff",
  backgroundColor = "rgba(0, 0, 0, 0.6)",
  animated = true,
  showPulse = true,
  className,
}: CameraTimerProps) {
  const reducedMotion = prefersReducedMotion();

  if (!isActive || duration === 0) return null;

  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-24 h-24 text-4xl",
    lg: "w-32 h-32 text-5xl",
  };

  if (timerStyle === "circular") {
    const circumference = 2 * Math.PI * 45;
    const progress = remaining / duration;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          sizeClasses[size],
          className
        )}
        style={{ backgroundColor }}
        role="timer"
        aria-live="assertive"
        aria-atomic="true"
      >
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition:
                animated && !reducedMotion
                  ? "stroke-dashoffset 1s linear"
                  : undefined,
            }}
          />
        </svg>
        <span
          className="relative z-10 font-bold tabular-nums"
          style={{ color }}
        >
          {remaining}
        </span>
        {showPulse && animated && !reducedMotion && remaining <= 3 && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-50"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold tabular-nums",
        sizeClasses[size],
        animated && !reducedMotion && "animate-pulse",
        className
      )}
      style={{ backgroundColor, color }}
      role="timer"
      aria-live="assertive"
      aria-atomic="true"
    >
      {remaining}
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

const CameraPermissions = React.forwardRef<
  HTMLDivElement,
  CameraPermissionsProps
>(
  (
    {
      className,
      variant,
      requestingTitle = "Camera Access",
      requestingDescription = "Please allow camera access when prompted",
      deniedTitle = "Camera Access Denied",
      deniedDescription = "Please enable camera access in your browser settings to continue.",
      errorTitle = "Camera Error",
      errorDescription = "Unable to access the camera. Please try again.",
      showHelpLink = true,
      helpLinkUrl,
      onRetry,
      alwaysShow = false,
      ...props
    },
    ref
  ) => {
    const { status, error } = useCameraState();
    const { requestPermission, start } = useCameraActions();

    const reducedMotion = prefersReducedMotion();
    const helpLink = helpLinkUrl || getPermissionHelpLink();

    const shouldShow =
      alwaysShow ||
      status === "requesting-permission" ||
      status === "permission-denied" ||
      (status === "error" && error?.code === "PERMISSION_DENIED");

    if (!shouldShow) return null;

    const isRequesting = status === "requesting-permission";
    const isDenied =
      status === "permission-denied" || error?.code === "PERMISSION_DENIED";
    const isError = status === "error" && !isDenied;

    const getContent = () => {
      if (isRequesting) {
        return {
          icon: IconCamera,
          iconClass: cn(!reducedMotion && "animate-pulse"),
          iconContainerClass: "bg-primary/10",
          title: requestingTitle,
          description: requestingDescription,
          showRetry: false,
          showHelp: false,
        };
      }
      if (isDenied) {
        return {
          icon: IconCameraOff,
          iconClass: "",
          iconContainerClass: "bg-destructive/10",
          title: deniedTitle,
          description: deniedDescription,
          showRetry: true,
          showHelp: showHelpLink,
        };
      }
      return {
        icon: IconAlertCircle,
        iconClass: "",
        iconContainerClass: "bg-destructive/10",
        title: errorTitle,
        description: error?.message || errorDescription,
        showRetry: error?.recoverable !== false,
        showHelp: false,
      };
    };

    const content = getContent();
    const Icon = content.icon;

    const handleRetry = async () => {
      onRetry?.();
      if (isDenied) {
        await requestPermission();
      }
      await start();
    };

    return (
      <div
        ref={ref}
        data-slot="camera-permissions"
        className={cn(cameraPermissionsVariants({ variant, className }))}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className={cn("p-4 rounded-full", content.iconContainerClass)}>
          {isRequesting ? (
            <IconLoader2
              className={cn(
                "w-10 h-10 text-primary",
                !reducedMotion && "animate-spin"
              )}
              aria-hidden="true"
            />
          ) : (
            <Icon
              className={cn(
                "w-10 h-10",
                isDenied || isError ? "text-destructive" : "text-primary",
                content.iconClass
              )}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="space-y-2 max-w-xs">
          <h3 className="font-semibold text-lg">{content.title}</h3>
          <p className="text-sm text-muted-foreground">{content.description}</p>
          {error?.suggestion && (
            <p className="text-xs text-muted-foreground/80 italic">
              {error.suggestion}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {content.showRetry && (
            <Button onClick={handleRetry} className="gap-2">
              <IconRefresh className="w-4 h-4" aria-hidden="true" />
              Try Again
            </Button>
          )}
          {content.showHelp && (
            <a
              href={helpLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-4 py-2 rounded-md",
                "text-sm font-medium",
                "border border-input bg-background",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              How to Enable
              <IconExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    );
  }
);

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
  const [activeSection, setActiveSection] = React.useState<
    "photo" | "guides" | "accessibility"
  >("photo");

  const updateValue = React.useCallback(
    <K extends keyof CameraSettingsValues>(
      key: K,
      value: CameraSettingsValues[K]
    ) => {
      onValuesChange({ ...values, [key]: value });
    },
    [values, onValuesChange]
  );

  if (!open) return null;

  const renderPhotoSection = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-white/80 mb-3 block">
          Quality
        </label>
        <div className="grid grid-cols-2 gap-2">
          {QUALITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateValue("quality", option.value as CameraQuality)
              }
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                values.quality === option.value
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-white/80 mb-3 block">
          Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.name}
              onClick={() =>
                updateValue("aspectRatio", ratio.name as CameraAspectRatio)
              }
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                values.aspectRatio === ratio.name
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {ratio.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-white/80 block">
            Mirror Preview
          </label>
          <span className="text-xs text-white/50">Flip image horizontally</span>
        </div>
        <button
          onClick={() => updateValue("mirror", !values.mirror)}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            values.mirror ? "bg-green-500" : "bg-white/20"
          )}
          aria-checked={values.mirror}
          role="switch"
        >
          <span
            className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              values.mirror ? "left-7" : "left-1"
            )}
          />
        </button>
      </div>
    </div>
  );

  const renderGuidesSection = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-white/80 mb-3 block">
          Composition Grid
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GRID_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateValue("grid", option.value as CameraGridType)
              }
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                values.grid === option.value
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-white/80 mb-3 block">
          Self-Timer
        </label>
        <div className="flex gap-2">
          {TIMER_DURATIONS.map((duration) => (
            <button
              key={duration}
              onClick={() =>
                updateValue("timer", duration as CameraTimerDuration)
              }
              className={cn(
                "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                values.timer === duration
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {duration === 0 ? "Off" : `${duration}s`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-white/80 block">
            Voice Control
          </label>
          <span className="text-xs text-white/50">
            Control camera with voice commands
          </span>
        </div>
        <button
          onClick={() => updateValue("voiceControl", !values.voiceControl)}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            values.voiceControl ? "bg-green-500" : "bg-white/20"
          )}
          aria-checked={values.voiceControl}
          role="switch"
        >
          <span
            className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              values.voiceControl ? "left-7" : "left-1"
            )}
          />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-white/80 block">
            Haptic Feedback
          </label>
          <span className="text-xs text-white/50">Vibration on actions</span>
        </div>
        <button
          onClick={() => updateValue("haptics", !values.haptics)}
          className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            values.haptics ? "bg-green-500" : "bg-white/20"
          )}
          aria-checked={values.haptics}
          role="switch"
        >
          <span
            className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              values.haptics ? "left-7" : "left-1"
            )}
          />
        </button>
      </div>
    </div>
  );

  const sections = [
    { id: "photo" as const, label: "Photo", icon: <IconCamera size={18} /> },
    { id: "guides" as const, label: "Guides", icon: <IconGrid3x3 size={18} /> },
    {
      id: "accessibility" as const,
      label: "Accessibility",
      icon: <IconGrid3x3 size={18} />,
    },
  ];

  const renderContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">Camera Settings</h2>
      </div>
      <div className="flex px-6 py-3 gap-2 border-b border-white/10 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
              activeSection === section.id
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "photo" && renderPhotoSection()}
        {activeSection === "guides" && renderGuidesSection()}
        {activeSection === "accessibility" && renderAccessibilitySection()}
      </div>
      <div className="px-6 py-4 border-t border-white/10 bg-white/5">
        <button
          onClick={() => onValuesChange(CAMERA_DEFAULT_SETTINGS)}
          className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn("max-w-md max-h-[80vh] p-0 overflow-hidden", className)}
        >
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  const side: "left" | "right" | "top" | "bottom" =
    position === "left" || position === "right" || position === "bottom"
      ? position
      : "bottom";
  const isBottomSheet = side === "bottom";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side={side}
        className={cn(
          "shadow-2xl overflow-hidden",
          isBottomSheet && "max-h-[70vh] rounded-t-2xl",
          !isBottomSheet && "w-80",
          className
        )}
      >
        {renderContent()}
      </DrawerContent>
    </Drawer>
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
  customShortcuts,
  customDescriptions,
  className,
}: CameraKeyboardHelpProps) {
  const shortcutGroups = React.useMemo(() => {
    const allDescriptions = { ...KEYBOARD_DESCRIPTIONS, ...customDescriptions };
    return [
      {
        label: "Primary Actions",
        shortcuts: ["capture", "record", "stop"].map((key) => ({
          key,
          description: allDescriptions[key] || key,
        })),
      },
      {
        label: "Camera Control",
        shortcuts: ["switchCamera", "toggleFlash"].map((key) => ({
          key,
          description: allDescriptions[key] || key,
        })),
      },
      {
        label: "Zoom",
        shortcuts: ["zoomIn", "zoomOut", "zoomReset"].map((key) => ({
          key,
          description: allDescriptions[key] || key,
        })),
      },
      {
        label: "Guides & Settings",
        shortcuts: ["toggleGrid", "toggleTimer", "openSettings"].map((key) => ({
          key,
          description: allDescriptions[key] || key,
        })),
      },
    ];
  }, [customDescriptions]);

  const formatShortcut = (keys: readonly string[]): string => {
    return keys
      .map((key) =>
        key === " "
          ? "Space"
          : key === "ArrowUp"
            ? "↑"
            : key === "ArrowDown"
              ? "↓"
              : key === "ArrowLeft"
                ? "←"
                : key === "ArrowRight"
                  ? "→"
                  : key
      )
      .join(" / ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-lg max-h-[80vh] text-white p-0 overflow-hidden",
          className
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-white/10 space-y-0">
          <div className="flex items-center gap-3">
            <IconKeyboard size={24} className="text-white" />
            <DialogTitle className="text-xl font-semibold text-white">
              Keyboard Shortcuts
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {shortcutGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map(({ key, description }) => {
                    const keys = [
                      ...(ENHANCED_KEYBOARD_SHORTCUTS[
                        key as keyof typeof ENHANCED_KEYBOARD_SHORTCUTS
                      ] ||
                        customShortcuts?.[key] ||
                        []),
                    ];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
                      >
                        <span className="text-white/90">{description}</span>
                        <kbd className="px-2 py-1 text-sm font-mono bg-white/10 rounded text-white/80">
                          {formatShortcut(keys)}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-sm text-white/60 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">?</kbd> or{" "}
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">/</kbd> to toggle
            this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
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
  className,
  showVisual = false,
}: CameraStatusAnnouncerProps) {
  const [announcement, setAnnouncement] = React.useState<string>("");
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    const message = customMessages?.[status] ?? STATUS_ANNOUNCEMENTS[status];
    const fullMessage = additionalMessage
      ? `${message}. ${additionalMessage}`
      : message;
    if (fullMessage && fullMessage !== announcement) {
      requestAnimationFrame(() => {
        setKey((k) => k + 1);
        setAnnouncement(fullMessage);
      });
    }
  }, [status, customMessages, additionalMessage, enabled, announcement]);

  if (!enabled) return null;

  return (
    <div
      key={key}
      data-slot="camera-status-announcer"
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn(
        !showVisual && "sr-only",
        showVisual && [
          "fixed bottom-4 right-4 z-50",
          "px-3 py-2 rounded-lg",
          "bg-background/95 border shadow-lg",
          "text-sm text-foreground",
          "animate-in fade-in slide-in-from-bottom-2",
        ],
        className
      )}
    >
      {announcement}
    </div>
  );
}

CameraStatusAnnouncer.displayName = "CameraStatusAnnouncer";

function getControlDescription(
  action: "capture" | "record" | "switch" | "flash",
  state?: { isRecording?: boolean; isFlashOn?: boolean }
): string {
  switch (action) {
    case "capture":
      return "Take a photo. Press Space or click to capture.";
    case "record":
      return state?.isRecording
        ? "Stop video recording. Press R or click to stop."
        : "Start video recording. Press R or click to start.";
    case "switch":
      return "Switch between front and back camera. Press S or click to switch.";
    case "flash":
      return state?.isFlashOn
        ? "Turn off flash. Press F or click to toggle."
        : "Turn on flash. Press F or click to toggle.";
    default:
      return "";
  }
}

function getProgressDescription(
  currentStep: number,
  totalSteps: number,
  stepName?: string
): string {
  const base = `Step ${currentStep} of ${totalSteps}`;
  return stepName ? `${base}: ${stepName}` : base;
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
  respectReducedMotion?: boolean;
  className?: string;
}

function CameraFocusIndicator({
  point,
  isActive,
  isLocked = false,
  indicatorStyle = CAMERA_DEFAULT_FOCUS.indicatorStyle,
  size = CAMERA_DEFAULT_FOCUS.indicatorSize,
  color = CAMERA_DEFAULT_FOCUS.indicatorColor,
  lockedColor = CAMERA_DEFAULT_FOCUS.lockedColor,
  strokeWidth = 2,
  animationDuration = 200,
  respectReducedMotion = true,
  className,
}: CameraFocusIndicatorProps) {
  const reducedMotion = prefersReducedMotion();

  if (!point || !isActive) return null;

  const shouldAnimate = !respectReducedMotion || !reducedMotion;
  const currentColor = isLocked ? lockedColor : color;

  const baseClasses = cn(
    "absolute pointer-events-none transition-transform",
    shouldAnimate && "ease-out",
    className
  );

  const renderRing = () => (
    <div
      className={cn(baseClasses, "rounded-full border-2")}
      style={{
        width: size,
        height: size,
        left: point.x - size / 2,
        top: point.y - size / 2,
        borderColor: currentColor,
        borderWidth: strokeWidth,
        transitionDuration: `${animationDuration}ms`,
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
        style={{ backgroundColor: currentColor }}
      />
      {isLocked && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: lockedColor }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      )}
    </div>
  );

  const renderCrosshair = () => (
    <div
      className={baseClasses}
      style={{
        left: point.x - size / 2,
        top: point.y - size / 2,
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute top-1/2 left-0 w-full -translate-y-1/2"
        style={{ height: strokeWidth, backgroundColor: currentColor }}
      />
      <div
        className="absolute top-0 left-1/2 h-full -translate-x-1/2"
        style={{ width: strokeWidth, backgroundColor: currentColor }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          borderColor: currentColor,
          borderWidth: strokeWidth,
        }}
      />
    </div>
  );

  const indicatorRenderers: Record<
    CameraFocusIndicatorStyle,
    () => React.ReactNode
  > = {
    ring: renderRing,
    crosshair: renderCrosshair,
    bracket: renderRing,
    box: renderRing,
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-live="polite"
      aria-atomic="true"
    >
      {indicatorRenderers[indicatorStyle]?.()}
    </div>
  );
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

function CameraZoomIndicator({
  zoom,
  minZoom = CAMERA_DEFAULT_ZOOM.min,
  maxZoom = CAMERA_DEFAULT_ZOOM.max,
  position = "top-right",
  format = "multiplier",
  showBar = true,
  showOnChange = true,
  hideDelay = 2000,
  alwaysVisible = false,
  className,
}: CameraZoomIndicatorProps) {
  const [isVisible, setIsVisible] = React.useState(
    !showOnChange || alwaysVisible
  );
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (showOnChange && !alwaysVisible) {
      setIsVisible(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    }
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [zoom, showOnChange, alwaysVisible, hideDelay]);

  const formattedZoom = React.useMemo(() => {
    if (format === "multiplier") {
      return `${zoom.toFixed(1)}x`;
    }
    const percentage = ((zoom - minZoom) / (maxZoom - minZoom)) * 100;
    return `${Math.round(percentage)}%`;
  }, [zoom, format, minZoom, maxZoom]);

  const barWidth = React.useMemo(() => {
    const percentage = ((zoom - minZoom) / (maxZoom - minZoom)) * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`;
  }, [zoom, minZoom, maxZoom]);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (!isVisible && !alwaysVisible) return null;

  return (
    <div
      className={cn(
        "absolute flex flex-col items-end gap-1 transition-opacity duration-300",
        positionClasses[position],
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="camera-zoom-indicator"
    >
      <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium tabular-nums">
        {formattedZoom}
      </div>
      {showBar && (
        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-150"
            style={{ width: barWidth }}
          />
        </div>
      )}
    </div>
  );
}

CameraZoomIndicator.displayName = "CameraZoomIndicator";

interface CameraVoiceControlProps {
  enabled: boolean;
  language?: string;
  onCommand?: (
    command: CameraVoiceCommand,
    phrase: string,
    confidence: number
  ) => void;
  showListeningIndicator?: boolean;
  showCommandFeedback?: boolean;
  feedbackDuration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

function CameraVoiceControl({
  enabled,
  language = "en-US",
  showListeningIndicator = true,
  showCommandFeedback = true,
  position = "top-left",
  className,
}: Omit<CameraVoiceControlProps, "onCommand" | "feedbackDuration">) {
  const [isListening, setIsListening] = React.useState(false);
  const [showFeedback] = React.useState(false);
  const [lastCommand] = React.useState<CameraVoiceCommand | null>(null);
  const [confidence] = React.useState(0);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  if (!enabled || !isSupported) return null;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div
      className={cn(
        "absolute flex flex-col gap-2",
        positionClasses[position],
        className
      )}
      data-slot="camera-voice-control"
      data-language={language}
    >
      {showListeningIndicator && (
        <button
          onClick={toggleListening}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200",
            isListening
              ? "bg-red-500/80 text-white"
              : "bg-black/60 text-white/80 hover:bg-black/80"
          )}
          aria-label={
            isListening ? "Stop voice control" : "Start voice control"
          }
          aria-pressed={isListening}
        >
          {isListening ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <IconMicrophone size={18} />
              <span className="text-sm font-medium">Listening...</span>
            </>
          ) : (
            <>
              <IconMicrophoneOff size={18} />
              <span className="text-sm font-medium">Voice</span>
            </>
          )}
        </button>
      )}
      {showCommandFeedback && showFeedback && lastCommand && (
        <div
          className="px-4 py-2 bg-green-500/90 text-white rounded-full text-sm font-medium animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <span className="mr-1 font-semibold uppercase text-[11px] tracking-wide">
            {lastCommand}
          </span>
          {confidence < 0.9 && (
            <span className="ml-2 text-xs opacity-75">
              ({Math.round(confidence * 100)}%)
            </span>
          )}
        </div>
      )}
    </div>
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
    console.error("Camera error boundary caught error:", error, errorInfo);
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
        if (typeof fallback === "function") {
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
            className
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

/* eslint-disable react-refresh/only-export-components */

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

export {
  Camera,
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
  getProgressDescription,
  // Variants
  cameraVariants,
  cameraButtonVariants,
  cameraControlsVariants,
  cameraGuideVariants,
  cameraPermissionsVariants,
  controlBarVariants,
  // Constants from lib
  CAMERA_DEFAULT_SETTINGS,
  CHALLENGE_ICONS,
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
