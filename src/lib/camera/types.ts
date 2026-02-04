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
  | "MODEL_LOAD_FAILED"
  | "OCR_FAILED"
  | "FACE_NOT_DETECTED"
  | "LIVENESS_FAILED"
  | "UNKNOWN_ERROR";

export type CameraStatus =
  | "idle"
  | "requesting-permission"
  | "permission-denied"
  | "initializing"
  | "ready"
  | "detecting"
  | "capturing"
  | "processing"
  | "success"
  | "error"
  | "paused";

export type CameraFacingMode = "user" | "environment";

export type CameraMode =
  | "selfie"
  | "face-detection"
  | "id-scanner"
  | "photo"
  | "video"
  | "liveness";

export type DocumentType =
  | "national-id"
  | "passport"
  | "drivers-license"
  | "custom";

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
  type: "image/jpeg" | "image/png" | "video/webm";
  timestamp: number;
  width: number;
  height: number;
}

export interface DetectedFace {
  boundingBox: BoundingBox;
  landmarks?: FaceLandmark[];
  confidence: number;
  descriptor?: Float32Array;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmark {
  x: number;
  y: number;
  z?: number;
  name?: string;
}

export interface IdScanResult {
  documentType: DocumentType;
  fields: Record<string, { value: string; confidence: number }>;
  rawImage: Blob;
  croppedImage: Blob;
  confidence: number;
}

export interface LivenessResult {
  passed: boolean;
  score: number;
  completedChallenges: string[];
  failedChallenges: string[];
  duration: number;
}

export interface LivenessChallenge {
  id: string;
  type:
    | "blink"
    | "smile"
    | "turn-left"
    | "turn-right"
    | "turn-up"
    | "turn-down";
  description: string;
  timeout: number;
}

export interface KYCStep {
  id: string;
  type: "document-front" | "document-back" | "selfie" | "liveness";
  title: string;
  description: string;
  documentTypes?: DocumentType[];
}

export interface KYCResult {
  documentFront?: Blob;
  documentBack?: Blob;
  extractedFields: Record<string, { value: string; confidence: number }>;
  selfie?: Blob;
  livenessScore: number;
  faceMatch?: boolean;
  completedAt: number;
}

export interface CameraProps {
  mode?: CameraMode;
  facingMode?: CameraFacingMode;
  constraints?: CameraConstraints;
  onCapture?: (result: CaptureResult) => void;
  onError?: (error: CameraError) => void;
  onFaceDetected?: (faces: DetectedFace[]) => void;
  onIdScanned?: (result: IdScanResult) => void;
  onLivenessComplete?: (result: LivenessResult) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface FaceDetectionOptions {
  minConfidence?: number;
  maxFaces?: number;
  detectLandmarks?: boolean;
  detectDescriptors?: boolean;
}

export interface OCROptions {
  language?: string;
  region?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  whitelist?: string;
  blacklist?: string;
}

export interface DocumentTemplate {
  type: DocumentType;
  aspectRatio: number;
  requiredFields: string[];
  mrzEnabled?: boolean;
  sampleImage?: string;
}

export const DOCUMENT_TEMPLATES: Record<DocumentType, DocumentTemplate> = {
  "national-id": {
    type: "national-id",
    aspectRatio: 1.586, // ID-1 format (85.6mm x 53.98mm)
    requiredFields: ["name", "id_number", "date_of_birth", "expiry_date"],
    mrzEnabled: false,
  },
  passport: {
    type: "passport",
    aspectRatio: 1.42, // Passport format
    requiredFields: [
      "name",
      "passport_number",
      "nationality",
      "date_of_birth",
      "expiry_date",
    ],
    mrzEnabled: true,
  },
  "drivers-license": {
    type: "drivers-license",
    aspectRatio: 1.586,
    requiredFields: [
      "name",
      "license_number",
      "date_of_birth",
      "expiry_date",
      "class",
    ],
    mrzEnabled: false,
  },
  custom: {
    type: "custom",
    aspectRatio: 1.5,
    requiredFields: [],
    mrzEnabled: false,
  },
};

export const DEFAULT_FACE_DETECTION_OPTIONS: FaceDetectionOptions = {
  minConfidence: 0.7,
  maxFaces: 1,
  detectLandmarks: true,
  detectDescriptors: false,
};

export const DEFAULT_LIVENESS_CHALLENGES: LivenessChallenge[] = [
  { id: "blink", type: "blink", description: "Blink your eyes", timeout: 5000 },
  {
    id: "turn-left",
    type: "turn-left",
    description: "Turn your head left",
    timeout: 5000,
  },
  {
    id: "turn-right",
    type: "turn-right",
    description: "Turn your head right",
    timeout: 5000,
  },
];

export const CAMERA_CONSTRAINTS: Record<CameraMode, MediaStreamConstraints> = {
  selfie: {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
  },
  "face-detection": {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
  },
  "id-scanner": {
    video: {
      facingMode: "environment",
      width: { ideal: 1920 },
      height: { ideal: 1080 },
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
  liveness: {
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
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

export type CameraQuality = "standard" | "hd" | "ultra" | "raw";

export type CameraCaptureFormat = "image/jpeg" | "image/png" | "image/webp";

export type CameraGuideShape =
  | "oval"
  | "rectangle"
  | "circle"
  | "square"
  | "polygon";

export type CameraGuideCornerStyle = "rounded" | "sharp" | "bracket" | "none";

export type CameraGuideAnimation = "pulse" | "glow" | "breathe" | "none";

export type CameraButtonVariant =
  | "primary"
  | "secondary"
  | "recording"
  | "ghost"
  | "danger"
  | "success";

export type CameraButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type CameraButtonShape = "circle" | "rounded" | "square" | "pill";

export type CameraHapticPattern =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "error"
  | "warning"
  | "none";

export type CameraFocusIndicatorStyle =
  | "ring"
  | "crosshair"
  | "bracket"
  | "box";

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
  | "none"
  | "face-recognition"
  | "id-card-scanner";

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
  respectsReducedMotion?: boolean;
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
