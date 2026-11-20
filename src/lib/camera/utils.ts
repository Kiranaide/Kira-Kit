/**
 * Camera Utilities
 * Helper functions for camera operations
 */

import { BROWSER_PERMISSION_HELP_LINKS } from "./constants";

/**
 * Detect the user's browser for permission help links
 */
export function detectBrowser(): keyof typeof BROWSER_PERMISSION_HELP_LINKS {
  if (typeof navigator === "undefined") return "default";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("edg/")) return "edge";

  if (ua.includes("opr/") || ua.includes("opera")) return "opera";

  if (ua.includes("chrome")) return "chrome";

  if (ua.includes("safari") && !ua.includes("chrome")) return "safari";

  if (ua.includes("firefox")) return "firefox";

  return "default";
}

/**
 * Get the appropriate help link for camera permissions
 */
export function getPermissionHelpLink(): string {
  const browser = detectBrowser();

  return (
    BROWSER_PERMISSION_HELP_LINKS[browser] ||
    BROWSER_PERMISSION_HELP_LINKS.default
  );
}

/**
 * Check if the browser supports the MediaDevices API
 */
export function isMediaDevicesSupported(): boolean {
  return !!(
    typeof navigator !== "undefined" &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}

/**
 * Check if the browser supports the Permissions API for camera
 */
export async function checkCameraPermissionStatus(): Promise<
  "granted" | "denied" | "prompt"
> {
  try {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      return "prompt";
    }

    const permission = await navigator.permissions.query({
      name: "camera",
    });

    return permission.state;
  } catch {
    // Permissions API not supported
    return "prompt";
  }
}

/**
 * Check if torch/flashlight is supported on the given track
 */
export function isTorchSupported(track: MediaStreamTrack): boolean {
  try {
    const capabilities = track.getCapabilities();

    return "torch" in capabilities && capabilities.torch === true;
  } catch {
    return false;
  }
}

/**
 * Toggle torch on a video track
 */
export async function toggleTorch(
  track: MediaStreamTrack,
  enabled: boolean,
): Promise<boolean> {
  try {
    const torchConstraints = { torch: enabled };

    const constraints: MediaTrackConstraints & {
      advanced: { torch: boolean }[];
    } = {
      advanced: [torchConstraints],
    };

    await track.applyConstraints(constraints);

    return true;
  } catch {
    return false;
  }
}

/**
 * Trigger haptic feedback if available
 */
export function triggerHaptic(pattern: number | number[] = 50): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if high contrast mode is active
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(forced-colors: active)").matches;
}

/**
 * Generate a unique instance ID
 */
export function generateInstanceId(prefix = "camera"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Wait for a specified duration
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Data URL to Blob conversion
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Check if device has multiple cameras
 */
export async function hasMultipleCameras(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");

    return videoDevices.length > 1;
  } catch {
    return false;
  }
}

/**
 * Get supported video codecs for recording
 */
export function getSupportedVideoCodec(): string {
  if (typeof MediaRecorder === "undefined") return "";

  const codecs = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];

  for (const codec of codecs) {
    if (MediaRecorder.isTypeSupported(codec)) {
      return codec;
    }
  }

  return "";
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}
