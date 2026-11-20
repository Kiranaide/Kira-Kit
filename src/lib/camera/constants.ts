/**
 * Camera Constants
 * Centralized configuration for camera functionality
 */

import type { CameraScanOverlayPreset, CameraScanOverlayConfig } from "./types";

// Lock configuration for concurrent access control
export const CAMERA_LOCK_TIMEOUT_MS = 5000;

export const CAMERA_LOCK_POLL_INTERVAL_MS = 100;

// Retry configuration for media acquisition
export const MEDIA_RETRY_MAX_ATTEMPTS = 3;

export const MEDIA_RETRY_BASE_DELAY_MS = 300;

// Track release configuration
export const TRACK_END_TIMEOUT_MS = 500;

export const HARDWARE_RELEASE_DELAY_MS = 100;

// Capture configuration
export const DEFAULT_CAPTURE_QUALITY = 0.95;

export const DEFAULT_CAPTURE_FORMAT = "image/jpeg" as const;

// Video recording codecs (in order of preference)
export const VIDEO_CODECS = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

// Touch targets (WCAG 2.1)
export const MIN_TOUCH_TARGET_SIZE_PX = 44;

// Browser help links for camera permissions
export const BROWSER_PERMISSION_HELP_LINKS = {
  chrome: "https://support.google.com/chrome/answer/2693767",
  firefox:
    "https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions",
  safari: "https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac",
  edge: "https://support.microsoft.com/en-us/microsoft-edge/camera-and-microphone-permissions",
  opera: "https://help.opera.com/en/latest/web-preferences/#camera",
  default: "https://support.google.com/chrome/answer/2693767",
} satisfies Record<string, string>;

// Status messages for screen readers
export const STATUS_ANNOUNCEMENTS = {
  idle: "Camera is idle",
  "requesting-permission": "Requesting camera permission",
  "permission-denied": "Camera permission denied",
  initializing: "Initializing camera",
  ready: "Camera is ready",
  capturing: "Capturing photo",
  processing: "Processing",
  success: "Success",
  error: "Camera error occurred",
  paused: "Camera is paused",
} satisfies Record<string, string>;

export const KEYBOARD_SHORTCUTS = {
  capture: " ", // Space
  record: "r",
  switchCamera: "s",
  toggleFlash: "f",
  cancel: "Escape",
} as const;

// Enhanced keyboard shortcuts (2025-2026)
export const ENHANCED_KEYBOARD_SHORTCUTS = {
  // Primary actions
  capture: [" ", "Enter"],
  record: ["r", "R"],
  stop: ["Escape", "s", "S"],

  // Camera control
  switchCamera: ["c", "C"],
  toggleFlash: ["f", "F"],

  zoomIn: ["+", "=", "ArrowUp"],
  zoomOut: ["-", "_", "ArrowDown"],
  zoomReset: ["0"],
  zoom2x: ["2"],
  zoom3x: ["3"],

  focusCenter: ["Home"],

  // Guides
  toggleGrid: ["g", "G"],
  cycleGrid: ["Shift+g", "Shift+G"],

  toggleTimer: ["t", "T"],
  cycleTimer: ["Shift+t", "Shift+T"],

  openSettings: [","],

  // Navigation
  prevMode: ["ArrowLeft", "["],
  nextMode: ["ArrowRight", "]"],

  showHelp: ["?", "/"],
} as const;

export const KEYBOARD_DESCRIPTIONS = {
  capture: "Take a photo",
  record: "Start/stop recording",
  switchCamera: "Switch camera",
  toggleFlash: "Toggle flash",
  cancel: "Cancel capture timer",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  zoomReset: "Reset zoom to 1x",
  toggleGrid: "Toggle composition grid",
  toggleTimer: "Toggle capture timer",
  openSettings: "Open camera settings",
  showHelp: "Show keyboard shortcuts",
} satisfies Record<string, string>;

export const ANIMATION_DURATION_MS = {
  fade: 300,
  capture: 150,
  scan: 2000,
} as const;

// Safe area CSS variables
export const SAFE_AREA_INSETS = {
  top: "env(safe-area-inset-top)",
  bottom: "env(safe-area-inset-bottom)",
  left: "env(safe-area-inset-left)",
  right: "env(safe-area-inset-right)",
} as const;

export const CAMERA_DEFAULT_SETTINGS = {
  quality: "hd" as const,
  aspectRatio: "16:9" as const,
  format: "image/jpeg" as const,
  mirror: false,
  grid: "none" as const,
  timer: 0 as const,
  voiceControl: false,
  announcements: "standard" as const,
  haptics: true,
  showAlignmentIndicator: true,
};

// Default zoom configuration
export const CAMERA_DEFAULT_ZOOM = {
  min: 1,
  max: 10,
  step: 0.1,
  showIndicator: true,
};

// Default exposure configuration
export const CAMERA_DEFAULT_EXPOSURE = {
  min: -2,
  max: 2,
  step: 0.1,
  autoReset: true,
};

// Default focus configuration
export const CAMERA_DEFAULT_FOCUS = {
  enabled: true,
  animationDuration: 200,
  lockDuration: 3000,
  indicatorStyle: "ring" as const,
  indicatorSize: 80,
  indicatorColor: "#ffffff",
  lockedColor: "#4ade80",
};

// Default grid configuration
export const CAMERA_DEFAULT_GRID = {
  type: "none" as const,
  color: "#ffffff",
  opacity: 0.3,
  lineWidth: 1,
  showIntersectionDots: false,
  dotSize: 4,
  animated: true,
};

// Scan overlay defaults (face recognition & ID card scanner)
export const SCAN_OVERLAY_DEFAULTS = {
  none: {
    frameColor: "#ffffff",
    frameAlignedColor: "#22c55e",
    frameStrokeWidth: 2,
    scanLineEnabled: false,
    scanLineColor: "#3b82f6",
    scanLineDuration: 2000,
    cornersEnabled: false,
    cornerSize: 24,
    cornerGlow: false,
    showStatusBadge: false,
    showAlignmentIndicator: false,
    animationsEnabled: false,
  },
  "face-recognition": {
    frameColor: "#ffffff",
    frameAlignedColor: "#22c55e",
    frameStrokeWidth: 2,
    scanLineEnabled: true,
    scanLineColor: "#3b82f6",
    scanLineDuration: 2000,
    cornersEnabled: true,
    cornerSize: 24,
    cornerGlow: true,
    showStatusBadge: true,
    showAlignmentIndicator: true,
    animationsEnabled: true,
  },
  "id-card-scanner": {
    frameColor: "#ffffff",
    frameAlignedColor: "#22c55e",
    frameStrokeWidth: 3,
    scanLineEnabled: true,
    scanLineColor: "#3b82f6",
    scanLineDuration: 1500,
    cornersEnabled: true,
    cornerSize: 32,
    cornerGlow: true,
    showStatusBadge: true,
    showAlignmentIndicator: true,
    animationsEnabled: true,
  },
} satisfies Record<CameraScanOverlayPreset, CameraScanOverlayConfig>;

// Haptic feedback patterns
export const HAPTIC_PATTERNS = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  error: [20, 50, 20],
  warning: [10, 30, 10],
} satisfies Record<string, number | number[]>;

// Voice command phrases
export const VOICE_COMMANDS = {
  capture: ["capture", "take photo", "cheese", "snap"],
  record: ["record", "start recording", "video"],
  stop: ["stop", "finish", "done"],
  switch: ["switch", "flip", "front camera", "back camera"],
  zoomIn: ["zoom in", "closer"],
  zoomOut: ["zoom out", "farther"],
  flash: ["flash", "light"],
  timer: ["timer", "countdown"],
} as const;

export const TIMER_DURATIONS = [0, 3, 5, 10] as const;

// Aspect ratio options
export const ASPECT_RATIOS = [
  { name: "4:3", value: 4 / 3 },
  { name: "16:9", value: 16 / 9 },
  { name: "1:1", value: 1 },
  { name: "9:16", value: 9 / 16 },
  { name: "3:2", value: 3 / 2 },
  { name: "2:3", value: 2 / 3 },
] as const;

export const QUALITY_OPTIONS = [
  { name: "Standard", value: "standard" },
  { name: "HD", value: "hd" },
  { name: "Ultra HD", value: "ultra" },
  { name: "Lossless PNG", value: "lossless" },
] as const;

// Grid type options
export const GRID_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Rule of Thirds", value: "rule-of-thirds" },
  { name: "Golden Ratio", value: "golden-ratio" },
  { name: "Square", value: "square" },
  { name: "Diagonal", value: "diagonal" },
  { name: "Center Cross", value: "center-cross" },
] as const;

// Gesture configuration
export const GESTURE_CONFIG = {
  pinchToZoom: {
    enabled: true,
    sensitivity: 1.0,
    minZoom: 1,
    maxZoom: 10,
  },
  tapToFocus: {
    enabled: true,
    animationDuration: 200,
    lockDuration: 3000,
  },
  doubleTapToCapture: {
    enabled: true,
    maxDelay: 300,
  },
  swipeToSwitch: {
    enabled: true,
    threshold: 50,
  },
  longPressForMenu: {
    enabled: true,
    delay: 500,
  },
} as const;
