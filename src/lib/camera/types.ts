export interface CameraError {
  code: CameraErrorCode;
  message: string;
  recoverable: boolean;
  suggestion?: string;
}

export type CameraErrorCode =
  | "PERMISSION_DENIED"
  | "DEVICE_NOT_FOUND"
  | "DEVICE_IN_USE"
  | "CONSTRAINT_NOT_SATISFIED"
  | "UNKNOWN_ERROR";

export type CameraStatus =
  | "idle"
  | "requesting-permission"
  | "permission-denied"
  | "initializing"
  | "ready"
  | "capturing"
  | "processing"
  | "success"
  | "error"
  | "paused";

export type CameraFacingMode = "user" | "environment";

export type CameraMode = "selfie" | "photo" | "video";

export type DocumentType =
  "national-id" | "passport" | "drivers-license" | "custom";

export interface CameraConstraints {
  width?: number;
  height?: number;
  aspectRatio?: number;
  frameRate?: number;
}

export interface MediaDeviceInfo {
  deviceId: string;
  kind: "videoinput" | "audioinput" | "audiooutput";
  label: string;
  groupId: string;
}

export interface CaptureResult {
  blob: Blob;
  url: string;
  type: "image/jpeg" | "image/png" | "image/webp" | "video/webm";
  timestamp: number;
  width: number;
  height: number;
}

export interface CameraProps {
  mode?: CameraMode;
  facingMode?: CameraFacingMode;
  constraints?: CameraConstraints;
  onCapture?: (result: CaptureResult) => void;
  onError?: (error: CameraError) => void;
  className?: string;
  children?: React.ReactNode;
}

export const CAMERA_CONSTRAINTS: Record<CameraMode, MediaStreamConstraints> = {
  selfie: {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
  },
  photo: {
    video: {
      facingMode: "environment",
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  },
  video: {
    video: {
      facingMode: "environment",
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 },
    },
    audio: true,
  },
};

// Enhanced Camera Types

export type CameraTimerDuration = 0 | 3 | 5 | 10;

export type CameraGridType =
  | "none"
  | "rule-of-thirds"
  | "golden-ratio"
  | "square"
  | "diagonal"
  | "center-cross";

export type CameraAspectRatio = "4:3" | "16:9" | "1:1" | "9:16" | "3:2" | "2:3";

export type CameraQuality = "standard" | "hd" | "ultra" | "lossless";

export type CameraCaptureFormat = "image/jpeg" | "image/png" | "image/webp";

// oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Public camera geometry type names are part of the existing API.
export type CameraGuideShape =
  "oval" | "rectangle" | "circle" | "square" | "polygon";

export type CameraGuideCornerStyle = "rounded" | "sharp" | "bracket" | "none";

export type CameraGuideAnimation = "pulse" | "glow" | "breathe" | "none";

export type CameraButtonVariant =
  "primary" | "secondary" | "recording" | "ghost" | "danger" | "success";

export type CameraButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Public camera geometry type names are part of the existing API.
export type CameraButtonShape = "circle" | "rounded" | "square" | "pill";

export type CameraHapticPattern =
  "light" | "medium" | "heavy" | "success" | "error" | "warning" | "none";

export type CameraFocusIndicatorStyle =
  "ring" | "crosshair" | "bracket" | "box";

export type CameraControlBarPosition = "top" | "bottom" | "left" | "right";

export type CameraControlBarVariant = "horizontal" | "vertical" | "floating";

export type CameraVoiceCommand =
  | "capture"
  | "record"
  | "stop"
  | "switch"
  | "zoomIn"
  | "zoomOut"
  | "flash"
  | "timer";

export type CameraAnnouncementVerbosity = "minimal" | "standard" | "verbose";

export interface CameraGridConfig {
  type: CameraGridType;
  color?: string;
  opacity?: number;
  lineWidth?: number;
  showIntersectionDots?: boolean;
  dotSize?: number;
  animated?: boolean;
}

export type CameraScanOverlayPreset =
  "none" | "face-recognition" | "id-card-scanner";

export interface CameraScanOverlayConfig {
  frameColor?: string;
  frameAlignedColor?: string;
  frameStrokeWidth?: number;
  scanLineEnabled?: boolean;
  scanLineColor?: string;
  scanLineDuration?: number;
  cornersEnabled?: boolean;
  cornerSize?: number;
  cornerGlow?: boolean;
  showStatusBadge?: boolean;
  showAlignmentIndicator?: boolean;
  animationsEnabled?: boolean;
}

export interface CameraGuideConfig {
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Public camera geometry types preserve compatibility.
  shape: CameraGuideShape;
  aspectRatio?: number;
  width?: string | number;
  height?: string | number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fillColor?: string;
  cornerStyle?: CameraGuideCornerStyle;
  cornerRadius?: number;
  cornerSize?: number;
  alignedColor?: string;
  misalignedColor?: string;
  animation?: CameraGuideAnimation;
  animationDuration?: number;
}

export interface CameraZoomConfig {
  min: number;
  max: number;
  step: number;
  showIndicator: boolean;
}

export interface CameraExposureConfig {
  min: number;
  max: number;
  step: number;
  autoReset: boolean;
}

export interface CameraFocusConfig {
  enabled: boolean;
  animationDuration: number;
  lockDuration: number;
  indicatorStyle: CameraFocusIndicatorStyle;
  indicatorSize: number;
  indicatorColor: string;
  lockedColor: string;
}

export interface CameraSafeZone {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  color?: string;
  opacity?: number;
  showLabels?: boolean;
}

export interface CameraSettingsValues {
  quality: CameraQuality;
  aspectRatio: CameraAspectRatio;
  format: CameraCaptureFormat;
  mirror: boolean;
  grid: CameraGridType;
  timer: CameraTimerDuration;
  voiceControl: boolean;
  announcements: CameraAnnouncementVerbosity;
  haptics: boolean;
  showAlignmentIndicator: boolean;
}

export interface CameraVoiceCommandConfig {
  command: CameraVoiceCommand;
  phrases: string[];
  action: () => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface CameraGestureState {
  isGesturing: boolean;
  gestureType: "pinch" | "tap" | "doubleTap" | "swipe" | "longPress" | null;
  startPoint?: Point;
  endPoint?: Point;
  scale?: number;
  velocity?: number;
}
