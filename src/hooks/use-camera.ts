import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import type {
  CameraConstraints,
  CameraError,
  CameraErrorCode,
  CameraFacingMode,
  CameraGestureState,
  CameraStatus,
  CameraTimerDuration,
  CameraVoiceCommand,
  CaptureResult,
  MediaDeviceInfo,
  Point,
} from "@/lib/camera/types";
import {
  DEFAULT_CAPTURE_FORMAT,
  DEFAULT_CAPTURE_QUALITY,
  GESTURE_CONFIG,
  HARDWARE_RELEASE_DELAY_MS,
  KEYBOARD_SHORTCUTS,
  MEDIA_RETRY_BASE_DELAY_MS,
  MEDIA_RETRY_MAX_ATTEMPTS,
  VOICE_COMMANDS,
} from "@/lib/camera/constants";
import {
  dataUrlToBlob,
  delay,
  getSupportedVideoCodec,
  isMediaDevicesSupported,
  isTorchSupported,
  toggleTorch,
  triggerHaptic,
} from "@/lib/camera/utils";

interface CameraFocusConstraintSet extends MediaTrackConstraintSet {
  focusMode?: "single-shot";
  pointsOfInterest?: Point[];
}

interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<
    ArrayLike<{ transcript: string; confidence: number }> & { isFinal: boolean }
  >;
}

interface CameraSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}

function speechConstructor() {
  if (typeof window === "undefined") return undefined;

  // SAFETY: optional browser constructors are feature-detected before use.
  const browser = window as Window & {
    SpeechRecognition?: new () => CameraSpeechRecognition;
    webkitSpeechRecognition?: new () => CameraSpeechRecognition;
  };

  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
}

export interface UseCameraOptions {
  facingMode?: CameraFacingMode;
  constraints?: CameraConstraints;
  autoStart?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableHaptics?: boolean;
  enableGestures?: boolean;
  enableVoiceControl?: boolean;
  captureQuality?: number;
  captureFormat?: "image/jpeg" | "image/png" | "image/webp";
  mirrorCapture?: boolean;
  gestureOptions?: {
    enablePinchToZoom?: boolean;
    enableTapToFocus?: boolean;
    enableDoubleTapToCapture?: boolean;
    enableSwipeToSwitch?: boolean;
    zoomSensitivity?: number;
    minZoom?: number;
    maxZoom?: number;
  };
  voiceOptions?: {
    language?: string;
    confidenceThreshold?: number;
    continuous?: boolean;
  };
  onCapture?: (result: CaptureResult) => void;
  onError?: (error: CameraError) => void;
  onStatusChange?: (status: CameraStatus) => void;
  onVoiceCommand?: (
    command: CameraVoiceCommand,
    phrase: string,
    confidence: number,
  ) => void;
  onGestureStart?: (type: CameraGestureState["gestureType"]) => void;
  onGestureEnd?: (type: CameraGestureState["gestureType"]) => void;
}

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;
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
  zoom: number;
  minZoom: number;
  maxZoom: number;
  focusPoint: Point | null;
  isFocusing: boolean;
  isFocusSupported: boolean;
  timerDuration: CameraTimerDuration;
  timerRemaining: number;
  isTimerActive: boolean;
  isVoiceListening: boolean;
  isVoiceSupported: boolean;
  lastVoiceCommand: CameraVoiceCommand | null;
  permissionState: "granted" | "denied" | "prompt" | "unknown";
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
  setZoom: (zoom: number) => void;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetZoom: () => void;
  focusAt: (point: Point) => void;
  unlockFocus: () => void;
  setTimerDuration: (duration: CameraTimerDuration) => void;
  startTimer: () => void;
  cancelTimer: () => void;
  startVoiceListening: (
    language?: string,
    onCommand?: UseCameraOptions["onVoiceCommand"],
  ) => void;
  stopVoiceListening: () => void;
  toggleVoiceListening: () => void;
}

interface RecordingSession {
  recorder: MediaRecorder;
  chunks: Blob[];
  result: Promise<Blob | null>;
  finish: (blob: Blob | null) => void;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const setup = useCameraSetup({ options });
  const state = { ...setup, ...useCameraState(setup) };
  const session = { ...state, ...useCameraSessionActions(state) };
  const stopped = { ...session, ...useCameraStopAction(session) };
  const started = { ...stopped, ...useCameraStartAction(stopped) };
  const capture = { ...started, ...useCameraCaptureActions(started) };
  const device = { ...capture, ...useCameraDeviceActions(capture) };
  const focus = { ...device, ...useCameraFocusAndTimerActions(device) };
  const voice = { ...focus, ...useCameraVoiceActions(focus) };
  useCameraInputEffects(voice);
  useCameraLifecycleEffects(voice);

  return cameraPublicState(voice);
}

export function getShortcutHint(
  action: keyof typeof KEYBOARD_SHORTCUTS,
): string {
  const key = KEYBOARD_SHORTCUTS[action];

  if (key === " ") return "Space";

  if (key === "Escape") return "Esc";

  return key.toUpperCase();
}

interface ReportCameraErrorContext {
  mountedRef: React.RefObject<boolean>;
  setError: React.Dispatch<React.SetStateAction<CameraError | null>>;
  onError: ((error: CameraError) => void) | undefined;
}

function reportCameraError(
  { mountedRef, setError, onError }: ReportCameraErrorContext,
  code: CameraErrorCode,
  message: string,
  suggestion?: string,
): void {
  const next: CameraError = {
    code,
    message,
    recoverable: true,
    suggestion,
  };

  if (mountedRef.current) setError(next);
  onError?.(next);
}

interface EnumerateCameraDevicesContext {
  mountedRef: React.RefObject<boolean>;
  setDevices: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>;
}

async function enumerateCameraDevices({
  mountedRef,
  setDevices,
}: EnumerateCameraDevicesContext): Promise<void> {
  if (!isMediaDevicesSupported()) return;

  try {
    const found = await navigator.mediaDevices.enumerateDevices();

    if (!mountedRef.current) return;
    setDevices(
      found
        .filter((device) => device.kind === "videoinput")
        .map((device, index) => ({
          deviceId: device.deviceId,
          kind: "videoinput",
          label: device.label || "Camera " + (index + 1),
          groupId: device.groupId,
        })),
    );
  } catch {
    /* Enumeration is optional; capture can still be available. */
  }
}

interface CancelCameraTimerContext {
  timerRef: React.RefObject<number | null>;
  mountedRef: React.RefObject<boolean>;
  setTimerRemaining: React.Dispatch<React.SetStateAction<number>>;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function cancelCameraTimer({
  timerRef,
  mountedRef,
  setTimerRemaining,
  setIsTimerActive,
}: CancelCameraTimerContext): void {
  if (timerRef.current) clearInterval(timerRef.current);
  timerRef.current = null;

  if (mountedRef.current) {
    setTimerRemaining(0);
    setIsTimerActive(false);
  }
}

interface AbortCameraRecognitionContext {
  recognitionRef: React.RefObject<CameraSpeechRecognition | null>;
  mountedRef: React.RefObject<boolean>;
  setIsVoiceListening: React.Dispatch<React.SetStateAction<boolean>>;
}

function abortCameraRecognition({
  recognitionRef,
  mountedRef,
  setIsVoiceListening,
}: AbortCameraRecognitionContext): void {
  const recognition = recognitionRef.current;
  recognitionRef.current = null;

  if (recognition) {
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition.abort();
  }

  if (mountedRef.current) setIsVoiceListening(false);
}

interface FinishCameraRecordingContext {
  recordingRef: React.RefObject<RecordingSession | null>;
}

function finishCameraRecording({
  recordingRef,
}: FinishCameraRecordingContext): Promise<Blob | null> {
  const session = recordingRef.current;

  if (!session) return Promise.resolve(null);

  if (session.recorder.state !== "inactive") session.recorder.stop();

  return session.result;
}

interface StopCameraStreamContext {
  requestRef: React.RefObject<number>;
  startupAbortRef: React.RefObject<AbortController | null>;
  startupRef: React.RefObject<Promise<void> | null>;
  cancelTimer: () => void;
  stopVoiceListening: () => void;
  focusTimerRef: React.RefObject<number | null>;
  captureFeedbackRef: React.RefObject<number | null>;
  streamRef: React.RefObject<MediaStream | null>;
  stopRecording: () => Promise<Blob | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  visibilityPausedRef: React.RefObject<boolean>;
  mountedRef: React.RefObject<boolean>;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRetrying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFlashOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFlashSupported: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusSupported: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  setIsFocusing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

async function stopCameraStream({
  requestRef,
  startupAbortRef,
  startupRef,
  cancelTimer,
  stopVoiceListening,
  focusTimerRef,
  captureFeedbackRef,
  streamRef,
  stopRecording,
  videoRef,
  visibilityPausedRef,
  mountedRef,
  setStream,
  setStatus,
  setIsPaused,
  setIsRetrying,
  setIsFlashOn,
  setIsFlashSupported,
  setIsFocusSupported,
  setFocusPoint,
  setIsFocusing,
  setIsRecording,
}: StopCameraStreamContext): Promise<void> {
  const request = ++requestRef.current;
  startupAbortRef.current?.abort();
  startupAbortRef.current = null;
  startupRef.current = null;
  cancelTimer();
  stopVoiceListening();

  if (focusTimerRef.current) clearTimeout(focusTimerRef.current);

  if (captureFeedbackRef.current) clearTimeout(captureFeedbackRef.current);
  focusTimerRef.current = null;
  captureFeedbackRef.current = null;
  const mediaStream = streamRef.current;
  streamRef.current = null;
  const recording = stopRecording();
  mediaStream?.getTracks().forEach((track) => track.stop());

  if (videoRef.current) videoRef.current.srcObject = null;
  visibilityPausedRef.current = false;

  if (mountedRef.current && request === requestRef.current) {
    setStream(null);
    setStatus("idle");
    setIsPaused(false);
    setIsRetrying(false);
    setIsFlashOn(false);
    setIsFlashSupported(false);
    setIsFocusSupported(false);
    setFocusPoint(null);
    setIsFocusing(false);
    setIsRecording(false);
  }

  await recording;
}

interface StartCameraStreamContext {
  startupRef: React.RefObject<Promise<void> | null>;
  streamRef: React.RefObject<MediaStream | null>;
  requestRef: React.RefObject<number>;
  startupAbortRef: React.RefObject<AbortController | null>;
  mountedRef: React.RefObject<boolean>;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  setError: React.Dispatch<React.SetStateAction<CameraError | null>>;
  setIsRetrying: React.Dispatch<React.SetStateAction<boolean>>;
  facingRef: React.RefObject<CameraFacingMode>;
  activeDeviceId: string | null;
  constraints: CameraConstraints | undefined;
  setFacingMode: React.Dispatch<React.SetStateAction<"user" | "environment">>;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setPermissionState: React.Dispatch<
    React.SetStateAction<"granted" | "denied" | "prompt" | "unknown">
  >;
  setActiveDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsFlashSupported: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusSupported: React.Dispatch<React.SetStateAction<boolean>>;
  stop: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  refreshDevices: () => Promise<void>;
}

interface CameraStreamOverride {
  facingMode?: CameraFacingMode;
  deviceId?: string | null;
}

interface CameraStartupSession {
  current: () => boolean;
  controller: AbortController;
  request: number;
}

function startCameraStream(
  context: StartCameraStreamContext,
  override?: CameraStreamOverride,
): Promise<void> {
  if (context.startupRef.current) return context.startupRef.current;

  if (context.streamRef.current?.active) return Promise.resolve();
  const request = ++context.requestRef.current;
  const controller = new AbortController();
  context.startupAbortRef.current = controller;

  const current = () =>
    context.mountedRef.current &&
    request === context.requestRef.current &&
    !controller.signal.aborted;

  const promise = initializeCameraStream(
    context,
    { current, controller, request },
    override,
  ).finally(() => {
    if (request === context.requestRef.current) {
      context.startupRef.current = null;
      context.startupAbortRef.current = null;
    }
  });

  context.startupRef.current = promise;

  return promise;
}

function cameraVideoConstraints(
  facing: CameraFacingMode,
  device: string | null,
  constraints: CameraConstraints | undefined,
): MediaTrackConstraints {
  const video: MediaTrackConstraints = { facingMode: { ideal: facing } };

  if (device) video.deviceId = { exact: device };

  if (constraints?.width) video.width = { ideal: constraints.width };

  if (constraints?.height) video.height = { ideal: constraints.height };

  if (constraints?.aspectRatio)
    video.aspectRatio = { ideal: constraints.aspectRatio };

  if (constraints?.frameRate)
    video.frameRate = { ideal: constraints.frameRate };

  return video;
}

async function acquireCameraStream(
  video: MediaTrackConstraints,
  current: () => boolean,
  setRetrying: StartCameraStreamContext["setIsRetrying"],
): Promise<MediaStream | null> {
  for (let attempt = 0; attempt < MEDIA_RETRY_MAX_ATTEMPTS; attempt++) {
    if (!current()) return null;

    try {
      return await navigator.mediaDevices.getUserMedia({ video, audio: false });
    } catch (cause) {
      if (!current()) return null;

      if (!(cause instanceof DOMException)) throw cause;

      if (
        cause.name !== "NotReadableError" ||
        attempt + 1 >= MEDIA_RETRY_MAX_ATTEMPTS
      )
        throw cause;
      setRetrying(true);
      await delay(MEDIA_RETRY_BASE_DELAY_MS * 2 ** attempt);
    }
  }

  return null;
}

async function initializeCameraStream(
  context: StartCameraStreamContext,
  session: CameraStartupSession,
  override?: CameraStreamOverride,
) {
  if (!session.current()) return;

  if (!isMediaDevicesSupported()) {
    context.createError(
      "DEVICE_NOT_FOUND",
      "Live camera access is unavailable.",
      "Use HTTPS or choose an image from your device.",
    );
    context.setStatus("error");

    return;
  }

  context.setStatus("requesting-permission");
  context.setError(null);
  context.setIsRetrying(false);
  const { facing, device } = cameraStreamTarget(context, override);
  let acquired: MediaStream | null = null;

  try {
    acquired = await acquireCameraStream(
      cameraVideoConstraints(facing, device, context.constraints),
      session.current,
      context.setIsRetrying,
    );

    if (!acquired) return;

    await completeCameraStreamStartup(
      context,
      session,
      acquired,
      facing,
      device,
    );
  } catch (cause) {
    acquired?.getTracks().forEach((track) => track.stop());

    if (!session.current()) return;
    context.streamRef.current = null;

    if (context.videoRef.current) context.videoRef.current.srcObject = null;
    context.setStream(null);
    context.setIsRetrying(false);
    reportCameraStartupFailure(context, cause instanceof Error ? cause : null);
  }
}

function publishCameraStream(
  context: StartCameraStreamContext,
  session: CameraStartupSession,
  acquired: MediaStream,
  facing: CameraFacingMode,
  device: string | null,
) {
  const track = acquired.getVideoTracks()[0];

  if (!track) throw new Error("The camera returned no video track.");
  context.streamRef.current = acquired;
  context.facingRef.current = facing;
  context.setFacingMode(facing);
  context.setStream(acquired);
  context.setPermissionState("granted");
  context.setActiveDeviceId(track.getSettings().deviceId ?? device ?? null);
  context.setIsFlashSupported(isTorchSupported(track));

  // SAFETY: focusMode is an optional capability outside older DOM typings.
  const capabilities = (track.getCapabilities?.() ??
    {}) as MediaTrackCapabilities & { focusMode?: string[] };

  context.setIsFocusSupported(
    capabilities.focusMode?.includes("single-shot") ?? false,
  );
  context.setIsRetrying(false);
  context.setStatus("initializing");
  track.addEventListener(
    "ended",
    () => {
      if (!session.current()) return;
      void context.stop();
      context.createError(
        "DEVICE_NOT_FOUND",
        "The camera disconnected.",
        "Reconnect it and start the camera again.",
      );
      context.setStatus("error");
    },
    { once: true },
  );
}

async function attachCameraPreview(
  element: HTMLVideoElement | null,
  stream: MediaStream,
  session: CameraStartupSession,
) {
  if (!element) return;
  element.srcObject = stream;
  await waitForCameraPreview(element, session.controller.signal);

  if (session.current()) await element.play();
}

function waitForCameraPreview(
  element: HTMLVideoElement,
  signal: AbortSignal,
): Promise<void> {
  if (element.readyState >= 2 && element.videoWidth > 0)
    return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    let timeout: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      clearTimeout(timeout);
      element.removeEventListener("loadeddata", loaded);
      element.removeEventListener("error", failed);
      signal.removeEventListener("abort", aborted);
    };

    const loaded = () => {
      cleanup();
      resolve();
    };

    const failed = () => {
      cleanup();
      reject(new Error("The camera preview could not load."));
    };

    const aborted = () => {
      cleanup();
      resolve();
    };

    timeout = setTimeout(failed, 10_000);
    element.addEventListener("loadeddata", loaded, { once: true });
    element.addEventListener("error", failed, { once: true });
    signal.addEventListener("abort", aborted, { once: true });
  });
}

function finishCameraStartup(
  context: StartCameraStreamContext,
  stream: MediaStream,
) {
  if (document.hidden) {
    stream.getVideoTracks().forEach((track) => {
      track.enabled = false;
    });
    context.setIsPaused(true);
    context.setStatus("paused");
  } else context.setStatus("ready");
  void context.refreshDevices();
}

function reportCameraStartupFailure(
  context: StartCameraStreamContext,
  cause: Error | null,
) {
  const name = cause instanceof DOMException ? cause.name : "";

  if (name === "NotAllowedError" || name === "SecurityError") {
    context.setPermissionState("denied");
    context.createError(
      "PERMISSION_DENIED",
      "Camera access was denied.",
      "Allow camera access in browser settings, or choose an image.",
    );
    context.setStatus("permission-denied");

    return;
  }

  if (name === "NotFoundError")
    context.createError(
      "DEVICE_NOT_FOUND",
      "No camera was found.",
      "Connect a camera or choose an image.",
    );
  else if (name === "NotReadableError" || name === "AbortError")
    context.createError(
      "DEVICE_IN_USE",
      "The camera is busy or unavailable.",
      "Close other camera apps and try again.",
    );
  else
    context.createError(
      name === "OverconstrainedError"
        ? "CONSTRAINT_NOT_SATISFIED"
        : "UNKNOWN_ERROR",
      cause?.message ?? "The camera could not start.",
      "Try another camera or choose an image.",
    );
  context.setStatus("error");
}

interface CaptureCameraFrameContext {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  visibilityPausedRef: React.RefObject<boolean>;
  zoomRef: React.RefObject<number>;
  mirrorCapture: boolean;
  captureFormat: "image/jpeg" | "image/png" | "image/webp";
  captureQuality: number;
  enableHaptics: boolean;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  captureFeedbackRef: React.RefObject<number | null>;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  onCapture: ((result: CaptureResult) => void) | undefined;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
}

function cameraFrameReady(
  element: HTMLVideoElement | null,
  stream: MediaStream | null,
  paused: boolean,
): element is HTMLVideoElement {
  return (
    !!stream?.active &&
    !!element &&
    element.readyState >= 2 &&
    element.videoWidth > 0 &&
    element.videoHeight > 0 &&
    !document.hidden &&
    !paused
  );
}

function drawCameraFrame(
  element: HTMLVideoElement,
  zoom: number,
  mirror: boolean,
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(element.videoWidth / zoom));
  canvas.height = Math.max(1, Math.round(element.videoHeight / zoom));
  const drawing = canvas.getContext("2d");

  if (!drawing) return null;

  if (mirror) {
    drawing.translate(canvas.width, 0);
    drawing.scale(-1, 1);
  }

  drawing.drawImage(
    element,
    (element.videoWidth - canvas.width) / 2,
    (element.videoHeight - canvas.height) / 2,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas;
}

function capturedCameraResult(
  canvas: HTMLCanvasElement,
  format: CaptureCameraFrameContext["captureFormat"],
  quality: number,
): CaptureResult {
  const blob = dataUrlToBlob(
    canvas.toDataURL(format, Math.max(0, Math.min(1, quality))),
  );

  const type = blob.type;

  if (type !== "image/jpeg" && type !== "image/png" && type !== "image/webp")
    throw new Error("The browser produced an unsupported photo format.");

  return {
    blob,
    url: URL.createObjectURL(blob),
    type,
    timestamp: Date.now(),
    width: canvas.width,
    height: canvas.height,
  };
}

function signalCameraCapture(context: CaptureCameraFrameContext) {
  if (context.enableHaptics) triggerHaptic(50);
  context.setStatus("capturing");

  if (context.captureFeedbackRef.current)
    clearTimeout(context.captureFeedbackRef.current);
  const request = context.requestRef.current;
  context.captureFeedbackRef.current = setTimeout(() => {
    if (
      context.mountedRef.current &&
      request === context.requestRef.current &&
      context.streamRef.current
    )
      context.setStatus("ready");
  }, 150);
}

function captureCameraFrame(
  context: CaptureCameraFrameContext,
): CaptureResult | null {
  const element = context.videoRef.current;

  if (
    !cameraFrameReady(
      element,
      context.streamRef.current,
      context.visibilityPausedRef.current,
    )
  )
    return null;

  const canvas = drawCameraFrame(
    element,
    context.zoomRef.current,
    context.mirrorCapture,
  );

  if (!canvas) return null;

  try {
    const result = capturedCameraResult(
      canvas,
      context.captureFormat,
      context.captureQuality,
    );

    signalCameraCapture(context);
    // The caller owns result.url and revokes it when its preview is no longer used.
    context.onCapture?.(result);

    return result;
  } catch (cause) {
    context.createError(
      "UNKNOWN_ERROR",
      cause instanceof Error
        ? cause.message
        : "The photo could not be captured.",
    );

    return null;
  }
}

interface BeginCameraRecordingContext {
  streamRef: React.RefObject<MediaStream | null>;
  recordingRef: React.RefObject<RecordingSession | null>;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
  mountedRef: React.RefObject<boolean>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

function beginCameraRecording({
  streamRef,
  recordingRef,
  createError,
  mountedRef,
  setIsRecording,
  setIsPaused,
}: BeginCameraRecordingContext): void {
  if (!streamRef.current?.active || recordingRef.current || document.hidden)
    return;

  if (typeof MediaRecorder === "undefined") {
    createError(
      "UNKNOWN_ERROR",
      "Video recording is unavailable in this browser.",
    );

    return;
  }

  try {
    const mimeType = getSupportedVideoCodec();

    const recorder = new MediaRecorder(
      streamRef.current,
      mimeType ? { mimeType } : undefined,
    );

    let finish!: (blob: Blob | null) => void;

    const result = new Promise<Blob | null>((resolve) => {
      finish = resolve;
    });

    const session: RecordingSession = {
      recorder,
      chunks: [],
      result,
      finish,
    };

    recordingRef.current = session;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) session.chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = session.chunks.length
        ? new Blob(session.chunks, {
            type: recorder.mimeType || session.chunks[0].type,
          })
        : null;

      session.chunks = [];

      if (recordingRef.current === session) {
        recordingRef.current = null;

        if (mountedRef.current) {
          setIsRecording(false);
          setIsPaused(false);
        }
      }

      session.finish(blob);
    };

    recorder.onerror = () => {
      session.finish(null);

      if (recordingRef.current === session) {
        recordingRef.current = null;

        if (mountedRef.current) {
          setIsRecording(false);
          setIsPaused(false);
          createError("UNKNOWN_ERROR", "The recording failed. Try again.");
        }
      }
    };

    recorder.start(1000);
    setIsRecording(true);
    setIsPaused(false);
  } catch (cause) {
    recordingRef.current = null;
    createError(
      "UNKNOWN_ERROR",
      cause instanceof Error ? cause.message : "Recording could not start.",
    );
  }
}

interface PauseCameraRecordingContext {
  recordingRef: React.RefObject<RecordingSession | null>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

function pauseCameraRecording({
  recordingRef,
  setIsPaused,
}: PauseCameraRecordingContext): void {
  const recorder = recordingRef.current?.recorder;

  if (recorder?.state === "recording") {
    recorder.pause();
    setIsPaused(true);
  }
}

interface ResumeCameraRecordingContext {
  recordingRef: React.RefObject<RecordingSession | null>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

function resumeCameraRecording({
  recordingRef,
  setIsPaused,
}: ResumeCameraRecordingContext): void {
  const recorder = recordingRef.current?.recorder;

  if (recorder?.state === "paused" && !document.hidden) {
    recorder.resume();
    setIsPaused(false);
  }
}

interface SwitchCameraFacingContext {
  facingRef: React.RefObject<CameraFacingMode>;
  stop: () => Promise<void>;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  start: (override?: {
    facingMode?: CameraFacingMode;
    deviceId?: string | null;
  }) => Promise<void>;
}

async function switchCameraFacing({
  facingRef,
  stop,
  requestRef,
  mountedRef,
  start,
}: SwitchCameraFacingContext): Promise<void> {
  const next: CameraFacingMode =
    facingRef.current === "user" ? "environment" : "user";

  const stopped = stop();
  const request = requestRef.current;
  await stopped;
  await delay(HARDWARE_RELEASE_DELAY_MS);

  if (mountedRef.current && request === requestRef.current)
    await start({ facingMode: next, deviceId: null });
}

interface SwitchCameraDeviceContext {
  stop: () => Promise<void>;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  start: (override?: {
    facingMode?: CameraFacingMode;
    deviceId?: string | null;
  }) => Promise<void>;
}

async function switchCameraDevice(
  { stop, requestRef, mountedRef, start }: SwitchCameraDeviceContext,
  deviceId: string,
): Promise<void> {
  const stopped = stop();
  const request = requestRef.current;
  await stopped;
  await delay(HARDWARE_RELEASE_DELAY_MS);

  if (mountedRef.current && request === requestRef.current)
    await start({ deviceId });
}

interface ToggleCameraTorchContext {
  streamRef: React.RefObject<MediaStream | null>;
  requestRef: React.RefObject<number>;
  isFlashOn: boolean;
  mountedRef: React.RefObject<boolean>;
  setIsFlashOn: React.Dispatch<React.SetStateAction<boolean>>;
}

async function toggleCameraTorch({
  streamRef,
  requestRef,
  isFlashOn,
  mountedRef,
  setIsFlashOn,
}: ToggleCameraTorchContext): Promise<void> {
  const track = streamRef.current?.getVideoTracks()[0];

  if (!track || !isTorchSupported(track)) return;
  const request = requestRef.current;

  if (
    (await toggleTorch(track, !isFlashOn)) &&
    mountedRef.current &&
    request === requestRef.current
  )
    setIsFlashOn(!isFlashOn);
}

interface RequestCameraAccessContext {
  start: (override?: {
    facingMode?: CameraFacingMode;
    deviceId?: string | null;
  }) => Promise<void>;
  streamRef: React.RefObject<MediaStream | null>;
}

async function requestCameraAccess({
  start,
  streamRef,
}: RequestCameraAccessContext): Promise<boolean> {
  await start();

  return !!streamRef.current?.active;
}

interface UpdateCameraZoomContext {
  minZoom: number;
  maxZoom: number;
  zoomRef: React.RefObject<number>;
  setZoomState: React.Dispatch<React.SetStateAction<number>>;
}

function updateCameraZoom(
  { minZoom, maxZoom, zoomRef, setZoomState }: UpdateCameraZoomContext,
  next: number,
): void {
  if (!Number.isFinite(next)) return;
  const normalized = Math.max(minZoom, Math.min(maxZoom, next));
  zoomRef.current = normalized;
  setZoomState(normalized);
}

interface UnlockCameraFocusContext {
  focusTimerRef: React.RefObject<number | null>;
  setFocusPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  setIsFocusing: React.Dispatch<React.SetStateAction<boolean>>;
}

function unlockCameraFocus({
  focusTimerRef,
  setFocusPoint,
  setIsFocusing,
}: UnlockCameraFocusContext): void {
  if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
  focusTimerRef.current = null;
  setFocusPoint(null);
  setIsFocusing(false);
}

interface FocusCameraAtContext {
  streamRef: React.RefObject<MediaStream | null>;
  isFocusSupported: boolean;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  setFocusPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  setIsFocusing: React.Dispatch<React.SetStateAction<boolean>>;
  focusTimerRef: React.RefObject<number | null>;
  setIsFocusSupported: React.Dispatch<React.SetStateAction<boolean>>;
}

function focusCameraAt(
  {
    streamRef,
    isFocusSupported,
    requestRef,
    mountedRef,
    setFocusPoint,
    setIsFocusing,
    focusTimerRef,
    setIsFocusSupported,
  }: FocusCameraAtContext,
  point: Point,
): void {
  const track = streamRef.current?.getVideoTracks()[0];

  if (
    !track ||
    !isFocusSupported ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  )
    return;

  const next = {
    x: Math.max(0, Math.min(1, point.x)),
    y: Math.max(0, Math.min(1, point.y)),
  };

  const request = requestRef.current;

  const focusSettings: CameraFocusConstraintSet = {
    focusMode: "single-shot",
    pointsOfInterest: [next],
  };

  const focusConstraints: MediaTrackConstraints = {
    advanced: [focusSettings],
  };

  void track
    .applyConstraints(focusConstraints)
    .then(() => {
      if (!mountedRef.current || request !== requestRef.current) return;
      setFocusPoint(next);
      setIsFocusing(true);

      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        if (mountedRef.current) setIsFocusing(false);
      }, GESTURE_CONFIG.tapToFocus.lockDuration);
    })
    .catch(() => {
      if (mountedRef.current) setIsFocusSupported(false);
    });
}

interface StartCameraTimerContext {
  streamRef: React.RefObject<MediaStream | null>;
  timerRef: React.RefObject<number | null>;
  timerDuration: CameraTimerDuration;
  capture: () => CaptureResult | null;
  setTimerRemaining: React.Dispatch<React.SetStateAction<number>>;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  cancelTimer: () => void;
}

function startCameraTimer({
  streamRef,
  timerRef,
  timerDuration,
  capture,
  setTimerRemaining,
  setIsTimerActive,
  cancelTimer,
}: StartCameraTimerContext): void {
  if (!streamRef.current?.active || timerRef.current || document.hidden) return;

  if (timerDuration === 0) {
    capture();

    return;
  }

  let remaining: number = timerDuration;
  setTimerRemaining(remaining);
  setIsTimerActive(true);
  timerRef.current = setInterval(() => {
    remaining -= 1;

    if (remaining <= 0) {
      cancelTimer();
      capture();
    } else setTimerRemaining(remaining);
  }, 1000);
}

interface ListenForCameraCommandsContext {
  voiceOptions:
    | { language?: string; confidenceThreshold?: number; continuous?: boolean }
    | undefined;
  enableVoiceControl: boolean;
  recognitionRef: React.RefObject<CameraSpeechRecognition | null>;
  streamRef: React.RefObject<MediaStream | null>;
  mountedRef: React.RefObject<boolean>;
  setLastVoiceCommand: React.Dispatch<
    React.SetStateAction<CameraVoiceCommand | null>
  >;
  onVoiceCommand:
    | ((
        command: CameraVoiceCommand,
        phrase: string,
        confidence: number,
      ) => void)
    | undefined;
  capture: () => CaptureResult | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  switchCamera: () => Promise<void>;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  toggleFlash: () => Promise<void>;
  startTimer: () => void;
  setIsVoiceListening: React.Dispatch<React.SetStateAction<boolean>>;
  stopVoiceListening: () => void;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
}

interface RecognizedCameraCommand {
  command: CameraVoiceCommand;
  phrase: string;
  confidence: number;
}

function recognizedCameraCommand(
  event: SpeechResultEvent,
  threshold: number,
): RecognizedCameraCommand | null {
  const result = event.results[event.resultIndex];

  if (!result?.isFinal) return null;
  const spoken = result[0];

  if (!spoken || spoken.confidence < threshold) return null;
  const phrase = spoken.transcript.trim().toLowerCase();

  const matched = Object.entries(VOICE_COMMANDS).find(([, phrases]) =>
    phrases.some((candidate) => candidate === phrase),
  );

  if (!matched) return null;

  // SAFETY: keys originate in the CameraVoiceCommand configuration.
  return {
    command: matched[0] as CameraVoiceCommand,
    phrase,
    confidence: spoken.confidence,
  };
}

function dispatchCameraCommand(
  context: ListenForCameraCommandsContext,
  command: CameraVoiceCommand,
) {
  const actions = {
    capture: () => {
      context.capture();
    },
    record: context.startRecording,
    stop: () => {
      void context.stopRecording();
    },
    switch: () => {
      void context.switchCamera();
    },
    zoomIn: () => context.zoomIn(),
    zoomOut: () => context.zoomOut(),
    flash: () => {
      void context.toggleFlash();
    },
    timer: context.startTimer,
  } satisfies Record<CameraVoiceCommand, () => void>;

  actions[command]();
}

function acceptCameraSpeech(
  context: ListenForCameraCommandsContext,
  recognition: CameraSpeechRecognition,
  event: SpeechResultEvent,
  override?: UseCameraOptions["onVoiceCommand"],
) {
  if (
    !context.mountedRef.current ||
    context.recognitionRef.current !== recognition ||
    document.hidden
  )
    return;

  const recognized = recognizedCameraCommand(
    event,
    context.voiceOptions?.confidenceThreshold ?? 0.5,
  );

  if (!recognized) return;
  const { command, phrase, confidence } = recognized;
  context.setLastVoiceCommand(command);
  context.onVoiceCommand?.(command, phrase, confidence);
  override?.(command, phrase, confidence);
  dispatchCameraCommand(context, command);
}

function configureCameraRecognition(
  recognition: CameraSpeechRecognition,
  options: UseCameraOptions["voiceOptions"],
  language?: string,
) {
  recognition.lang = language ?? options?.language ?? "en-US";
  recognition.continuous = options?.continuous ?? false;
  recognition.interimResults = false;
}

function listenForCameraCommands(
  context: ListenForCameraCommandsContext,
  requestedLanguage?: string,
  overrideCommand?: UseCameraOptions["onVoiceCommand"],
): void {
  const Constructor = speechConstructor();

  if (
    !Constructor ||
    (!context.enableVoiceControl && requestedLanguage === undefined) ||
    context.recognitionRef.current ||
    !context.streamRef.current?.active
  )
    return;
  const recognition = new Constructor();
  context.recognitionRef.current = recognition;
  configureCameraRecognition(
    recognition,
    context.voiceOptions,
    requestedLanguage,
  );
  recognition.onresult = (event) =>
    acceptCameraSpeech(context, recognition, event, overrideCommand);
  recognition.onend = () => {
    if (context.recognitionRef.current !== recognition) return;
    context.recognitionRef.current = null;

    if (context.mountedRef.current) context.setIsVoiceListening(false);
  };

  recognition.onerror = (event) => {
    if (context.recognitionRef.current !== recognition) return;
    context.stopVoiceListening();

    if (event.error !== "aborted")
      context.createError(
        "UNKNOWN_ERROR",
        "Voice control could not start.",
        "Allow microphone access or use the camera buttons.",
      );
  };

  try {
    recognition.start();
    context.setIsVoiceListening(true);
  } catch {
    context.stopVoiceListening();
    context.createError(
      "UNKNOWN_ERROR",
      "Voice control is unavailable. Use the camera buttons.",
    );
  }
}

interface BindCameraKeyboardContext {
  enableKeyboardShortcuts: boolean;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;
  startTimer: () => void;
  recordingRef: React.RefObject<RecordingSession | null>;
  stopRecording: () => Promise<Blob | null>;
  startRecording: () => void;
  switchCamera: () => Promise<void>;
  toggleFlash: () => Promise<void>;
  cancelTimer: () => void;
}

function bindCameraKeyboard({
  enableKeyboardShortcuts,
  gestureContainerRef,
  startTimer,
  recordingRef,
  stopRecording,
  startRecording,
  switchCamera,
  toggleFlash,
  cancelTimer,
}: BindCameraKeyboardContext) {
  if (!enableKeyboardShortcuts) return;
  const element = gestureContainerRef.current;

  if (!element) return;

  const keydown = (event: KeyboardEvent) => {
    if (!cameraShortcutAllowed(event, element)) return;

    switch (event.key.toLowerCase()) {
      case KEYBOARD_SHORTCUTS.capture:
        event.preventDefault();
        startTimer();
        break;
      case KEYBOARD_SHORTCUTS.record:
        event.preventDefault();

        if (recordingRef.current) void stopRecording();
        else startRecording();
        break;
      case KEYBOARD_SHORTCUTS.switchCamera:
        event.preventDefault();
        void switchCamera();
        break;
      case KEYBOARD_SHORTCUTS.toggleFlash:
        event.preventDefault();
        void toggleFlash();
        break;
      case "escape":
        event.preventDefault();
        cancelTimer();
        break;
    }
  };

  element.addEventListener("keydown", keydown);

  return () => element.removeEventListener("keydown", keydown);
}

interface BindCameraGesturesContext {
  enableGestures: boolean;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  gestureOptions:
    | {
        enablePinchToZoom?: boolean;
        enableTapToFocus?: boolean;
        enableDoubleTapToCapture?: boolean;
        enableSwipeToSwitch?: boolean;
        zoomSensitivity?: number;
        minZoom?: number;
        maxZoom?: number;
      }
    | undefined;
  zoomRef: React.RefObject<number>;
  gestureStarted: (type: CameraGestureState["gestureType"]) => void | undefined;
  setZoom: (next: number) => void;
  switchCamera: () => Promise<void>;
  gestureEnded: (type: CameraGestureState["gestureType"]) => void | undefined;
  startTimer: () => void;
  focusAt: (point: Point) => void;
}

interface CameraPointerSession {
  pointers: Map<number, Point>;
  origin: Point | null;
  moved: boolean;
  distance: number;
  initialZoom: number;
  lastTap: number;
  gesture: CameraGestureState["gestureType"];
}

function pointerSeparation(pointers: Map<number, Point>) {
  const [a, b] = Array.from(pointers.values());

  return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
}

function beginCameraPointer(
  context: BindCameraGesturesContext,
  element: HTMLElement,
  state: CameraPointerSession,
  event: PointerEvent,
) {
  if (
    !(event.target instanceof HTMLElement) ||
    event.target.closest("button,input,select,textarea,a,[role=slider]") ||
    !context.streamRef.current?.active
  )
    return;
  state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (state.pointers.size === 1) {
    state.origin = { x: event.clientX, y: event.clientY };
    state.moved = false;
  }

  if (
    state.pointers.size === 2 &&
    context.gestureOptions?.enablePinchToZoom !== false
  ) {
    state.distance = pointerSeparation(state.pointers);
    state.initialZoom = context.zoomRef.current;
    state.gesture = "pinch";
    context.gestureStarted(state.gesture);
  }

  element.setPointerCapture(event.pointerId);
}

function moveCameraPointer(
  context: BindCameraGesturesContext,
  state: CameraPointerSession,
  event: PointerEvent,
) {
  if (!state.pointers.has(event.pointerId)) return;
  state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (
    state.origin &&
    Math.hypot(event.clientX - state.origin.x, event.clientY - state.origin.y) >
      8
  )
    state.moved = true;

  if (state.gesture !== "pinch" || state.distance <= 0) return;
  event.preventDefault();
  context.setZoom(
    state.initialZoom *
      (pointerSeparation(state.pointers) / state.distance) **
        (context.gestureOptions?.zoomSensitivity ?? 1),
  );
}

function focusCameraPointer(
  context: BindCameraGesturesContext,
  element: HTMLElement,
  event: PointerEvent,
) {
  if (context.gestureOptions?.enableTapToFocus === false) return;
  const rect = element.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) return;
  context.gestureStarted("tap");
  context.focusAt({
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  });
  context.gestureEnded("tap");
}

function tapCameraPointer(
  context: BindCameraGesturesContext,
  element: HTMLElement,
  state: CameraPointerSession,
  event: PointerEvent,
) {
  const now = Date.now();

  if (
    context.gestureOptions?.enableDoubleTapToCapture !== false &&
    now - state.lastTap < GESTURE_CONFIG.doubleTapToCapture.maxDelay
  ) {
    context.gestureStarted("doubleTap");
    context.startTimer();
    context.gestureEnded("doubleTap");
    state.lastTap = 0;

    return;
  }

  state.lastTap = now;
  focusCameraPointer(context, element, event);
}

function releaseCameraPointer(
  context: BindCameraGesturesContext,
  element: HTMLElement,
  state: CameraPointerSession,
  event: PointerEvent,
) {
  if (!state.origin) return;
  const dx = event.clientX - state.origin.x;
  const dy = event.clientY - state.origin.y;

  if (
    state.moved &&
    Math.abs(dx) >= GESTURE_CONFIG.swipeToSwitch.threshold &&
    Math.abs(dx) > Math.abs(dy) * 2 &&
    context.gestureOptions?.enableSwipeToSwitch !== false
  ) {
    context.gestureStarted("swipe");
    void context.switchCamera();
    context.gestureEnded("swipe");
  } else if (!state.moved) tapCameraPointer(context, element, state, event);
}

function endCameraPointer(
  context: BindCameraGesturesContext,
  element: HTMLElement,
  state: CameraPointerSession,
  event: PointerEvent,
) {
  if (!state.pointers.has(event.pointerId)) return;
  state.pointers.delete(event.pointerId);

  if (
    event.type !== "pointercancel" &&
    event.type !== "lostpointercapture" &&
    state.pointers.size === 0 &&
    state.origin &&
    state.gesture !== "pinch"
  )
    releaseCameraPointer(context, element, state, event);

  if (state.pointers.size !== 0) return;

  if (state.gesture) context.gestureEnded(state.gesture);
  state.gesture = null;
  state.origin = null;
}

function bindCameraGestures(context: BindCameraGesturesContext) {
  if (!context.enableGestures) return;
  const element = context.gestureContainerRef.current;

  if (!element) return;

  const state: CameraPointerSession = {
    pointers: new Map(),
    origin: null,
    moved: false,
    distance: 0,
    initialZoom: 1,
    lastTap: 0,
    gesture: null,
  };

  const down = (event: PointerEvent) =>
    beginCameraPointer(context, element, state, event);

  const move = (event: PointerEvent) =>
    moveCameraPointer(context, state, event);

  const end = (event: PointerEvent) =>
    endCameraPointer(context, element, state, event);

  element.addEventListener("pointerdown", down);
  element.addEventListener("pointermove", move, { passive: false });
  element.addEventListener("pointerup", end);
  element.addEventListener("pointercancel", end);
  element.addEventListener("lostpointercapture", end);

  return () => {
    element.removeEventListener("pointerdown", down);
    element.removeEventListener("pointermove", move);
    element.removeEventListener("pointerup", end);
    element.removeEventListener("pointercancel", end);
    element.removeEventListener("lostpointercapture", end);
  };
}

interface BindCameraVisibilityContext {
  cancelTimer: () => void;
  stopVoiceListening: () => void;
  recordingRef: React.RefObject<RecordingSession | null>;
  visibilityPausedRef: React.RefObject<boolean>;
  streamRef: React.RefObject<MediaStream | null>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  stop: () => Promise<void>;
}

function bindCameraVisibility({
  cancelTimer,
  stopVoiceListening,
  recordingRef,
  visibilityPausedRef,
  streamRef,
  setIsPaused,
  setStatus,
  stop,
}: BindCameraVisibilityContext) {
  const visibility = () => {
    const context = {
      cancelTimer,
      stopVoiceListening,
      recordingRef,
      visibilityPausedRef,
      streamRef,
      setIsPaused,
      setStatus,
      stop,
    };

    if (document.hidden) suspendCameraVisibility(context);
    else resumeCameraVisibility(context);
  };

  const pagehide = () => {
    void stop();
  };

  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pagehide", pagehide);

  return () => {
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pagehide", pagehide);
  };
}

interface BindCameraDevicesContext {
  refreshDevices: () => Promise<void>;
}

function bindCameraDevices({ refreshDevices }: BindCameraDevicesContext) {
  if (!isMediaDevicesSupported()) return;

  const deviceChange = () => {
    void refreshDevices();
  };

  navigator.mediaDevices.addEventListener("devicechange", deviceChange);
  void refreshDevices();

  return () =>
    navigator.mediaDevices.removeEventListener("devicechange", deviceChange);
}

interface MountCameraControllerContext {
  mountedRef: React.RefObject<boolean>;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;
  autoStart: boolean;
  startVisible: () => void;
  stopUnmounted: () => void;
}

function mountCameraController({
  mountedRef,
  gestureContainerRef,
  autoStart,
  startVisible,
  stopUnmounted,
}: MountCameraControllerContext) {
  mountedRef.current = true;
  const element = gestureContainerRef.current;
  let observer: IntersectionObserver | undefined;
  let intersecting = typeof IntersectionObserver === "undefined";

  const tryStart = () => {
    if (
      autoStart &&
      intersecting &&
      element &&
      !document.hidden &&
      !element.closest("[hidden],[inert]")
    ) {
      startVisible();
      observer?.disconnect();
    }
  };

  if (autoStart && element && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver((entries) => {
      intersecting = entries.some((entry) => entry.isIntersecting);
      tryStart();
    });
    observer.observe(element);
  } else tryStart();
  document.addEventListener("visibilitychange", tryStart);

  return () => {
    observer?.disconnect();
    document.removeEventListener("visibilitychange", tryStart);
    mountedRef.current = false;
    stopUnmounted();
  };
}

function cameraConfiguration(options: UseCameraOptions) {
  return {
    ...options,
    ...cameraSessionDefaults(options),
    ...cameraControlDefaults(options),
    ...cameraCaptureDefaults(options),
  };
}

function cameraSessionDefaults(options: UseCameraOptions) {
  return {
    facingMode: options.facingMode ?? "user",
    autoStart: options.autoStart ?? false,
  };
}

function cameraControlDefaults(options: UseCameraOptions) {
  return {
    enableKeyboardShortcuts: options.enableKeyboardShortcuts ?? false,
    enableGestures: options.enableGestures ?? false,
    enableVoiceControl: options.enableVoiceControl ?? false,
  };
}

function cameraCaptureDefaults(options: UseCameraOptions) {
  return {
    captureQuality: options.captureQuality ?? DEFAULT_CAPTURE_QUALITY,
    captureFormat: options.captureFormat ?? DEFAULT_CAPTURE_FORMAT,
    mirrorCapture: options.mirrorCapture ?? false,
    enableHaptics: options.enableHaptics ?? true,
  };
}

interface CameraSetupContext {
  options: UseCameraOptions;
}

function useCameraSetup(context: CameraSetupContext) {
  const {
    facingMode: initialFacingMode,
    constraints,
    autoStart,
    enableKeyboardShortcuts,
    enableHaptics,
    enableGestures,
    enableVoiceControl,
    captureQuality,
    captureFormat,
    mirrorCapture,
    gestureOptions,
    voiceOptions,
    onCapture,
    onError,
    onStatusChange,
    onVoiceCommand,
    onGestureStart,
    onGestureEnd,
  } = cameraConfiguration(context.options);

  const requestedMin = gestureOptions?.minZoom ?? 1;
  const requestedMax = gestureOptions?.maxZoom ?? 4;
  const minZoom = Math.max(1, Number.isFinite(requestedMin) ? requestedMin : 1);

  const maxZoom = Math.max(
    minZoom,
    Number.isFinite(requestedMax) ? requestedMax : 4,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const gestureContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const requestRef = useRef(0);
  const startupRef = useRef<Promise<void> | null>(null);
  const startupAbortRef = useRef<AbortController | null>(null);
  const recordingRef = useRef<RecordingSession | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const captureFeedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<CameraSpeechRecognition | null>(null);
  const zoomRef = useRef(minZoom);

  return {
    initialFacingMode,
    constraints,
    autoStart,
    enableKeyboardShortcuts,
    enableHaptics,
    enableGestures,
    enableVoiceControl,
    captureQuality,
    captureFormat,
    mirrorCapture,
    gestureOptions,
    voiceOptions,
    onCapture,
    onError,
    onStatusChange,
    onVoiceCommand,
    onGestureStart,
    onGestureEnd,
    minZoom,
    maxZoom,
    videoRef,
    gestureContainerRef,
    streamRef,
    mountedRef,
    requestRef,
    startupRef,
    startupAbortRef,
    recordingRef,
    timerRef,
    captureFeedbackRef,
    focusTimerRef,
    recognitionRef,
    zoomRef,
  };
}

interface CameraStateContext {
  initialFacingMode: CameraFacingMode;
  minZoom: number;
  maxZoom: number;
  zoomRef: React.RefObject<number>;
}

function useCameraState(context: CameraStateContext) {
  const facingRef = useRef(context.initialFacingMode);
  const visibilityPausedRef = useRef(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<CameraError | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState(context.initialFacingMode);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isFlashSupported, setIsFlashSupported] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [zoomState, setZoomState] = useState(context.minZoom);
  const zoom = Math.max(context.minZoom, Math.min(context.maxZoom, zoomState));
  useEffect(() => {
    // oxlint-disable-next-line react/immutability -- This mutable useRef is owned by useCamera and synchronized only inside an effect.
    context.zoomRef.current = zoom;
  }, [zoom, context.zoomRef]);
  const [focusPoint, setFocusPoint] = useState<Point | null>(null);
  const [isFocusing, setIsFocusing] = useState(false);
  const [isFocusSupported, setIsFocusSupported] = useState(false);
  const [timerDuration, setTimerDuration] = useState<CameraTimerDuration>(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isVoiceSupported] = useState(() => !!speechConstructor());

  const [lastVoiceCommand, setLastVoiceCommand] =
    useState<CameraVoiceCommand | null>(null);

  return {
    facingRef,
    visibilityPausedRef,
    stream,
    setStream,
    status,
    setStatus,
    error,
    setError,
    devices,
    setDevices,
    activeDeviceId,
    setActiveDeviceId,
    facingMode,
    setFacingMode,
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    isRetrying,
    setIsRetrying,
    isFlashSupported,
    setIsFlashSupported,
    isFlashOn,
    setIsFlashOn,
    setZoomState,
    zoom,
    focusPoint,
    setFocusPoint,
    isFocusing,
    setIsFocusing,
    isFocusSupported,
    setIsFocusSupported,
    timerDuration,
    setTimerDuration,
    timerRemaining,
    setTimerRemaining,
    isTimerActive,
    setIsTimerActive,
    isVoiceListening,
    setIsVoiceListening,
    isVoiceSupported,
    lastVoiceCommand,
    setLastVoiceCommand,
  };
}

interface CameraSessionActionsContext {
  onStatusChange: ((status: CameraStatus) => void) | undefined;
  status: CameraStatus;
  mountedRef: React.RefObject<boolean>;
  setError: React.Dispatch<React.SetStateAction<CameraError | null>>;
  onError: ((error: CameraError) => void) | undefined;
  setDevices: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>;
  timerRef: React.RefObject<number | null>;
  setTimerRemaining: React.Dispatch<React.SetStateAction<number>>;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  recognitionRef: React.RefObject<CameraSpeechRecognition | null>;
  setIsVoiceListening: React.Dispatch<React.SetStateAction<boolean>>;
  recordingRef: React.RefObject<RecordingSession | null>;
}

function useCameraSessionActions(context: CameraSessionActionsContext) {
  const [permissionState, setPermissionState] =
    useState<UseCameraReturn["permissionState"]>("unknown");

  const reportStatus = useEffectEvent((next: CameraStatus) =>
    context.onStatusChange?.(next),
  );

  useEffect(() => {
    reportStatus(context.status);
  }, [context.status]);

  const createError = useCallback(
    (code: CameraErrorCode, message: string, suggestion?: string) =>
      reportCameraError(
        {
          mountedRef: context.mountedRef,
          setError: context.setError,
          onError: context.onError,
        },
        code,
        message,
        suggestion,
      ),
    [context.onError, context.mountedRef, context.setError],
  );

  const refreshDevices = useCallback(
    async () =>
      enumerateCameraDevices({
        mountedRef: context.mountedRef,
        setDevices: context.setDevices,
      }),
    [context.mountedRef, context.setDevices],
  );

  const cancelTimer = useCallback(
    () =>
      cancelCameraTimer({
        timerRef: context.timerRef,
        mountedRef: context.mountedRef,
        setTimerRemaining: context.setTimerRemaining,
        setIsTimerActive: context.setIsTimerActive,
      }),
    [
      context.timerRef,
      context.mountedRef,
      context.setTimerRemaining,
      context.setIsTimerActive,
    ],
  );

  const stopVoiceListening = useCallback(
    () =>
      abortCameraRecognition({
        recognitionRef: context.recognitionRef,
        mountedRef: context.mountedRef,
        setIsVoiceListening: context.setIsVoiceListening,
      }),
    [context.recognitionRef, context.mountedRef, context.setIsVoiceListening],
  );

  const stopRecording = useCallback(
    (): Promise<Blob | null> =>
      finishCameraRecording({ recordingRef: context.recordingRef }),
    [context.recordingRef],
  );

  return {
    permissionState,
    setPermissionState,
    createError,
    refreshDevices,
    cancelTimer,
    stopVoiceListening,
    stopRecording,
  };
}

interface CameraStopActionContext {
  requestRef: React.RefObject<number>;
  startupAbortRef: React.RefObject<AbortController | null>;
  startupRef: React.RefObject<Promise<void> | null>;
  cancelTimer: () => void;
  stopVoiceListening: () => void;
  focusTimerRef: React.RefObject<number | null>;
  captureFeedbackRef: React.RefObject<number | null>;
  streamRef: React.RefObject<MediaStream | null>;
  stopRecording: () => Promise<Blob | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  visibilityPausedRef: React.RefObject<boolean>;
  mountedRef: React.RefObject<boolean>;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRetrying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFlashOn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFlashSupported: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusSupported: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  setIsFocusing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

function useCameraStopAction(context: CameraStopActionContext) {
  const stop = useCallback(
    async () =>
      stopCameraStream({
        requestRef: context.requestRef,
        startupAbortRef: context.startupAbortRef,
        startupRef: context.startupRef,
        cancelTimer: context.cancelTimer,
        stopVoiceListening: context.stopVoiceListening,
        focusTimerRef: context.focusTimerRef,
        captureFeedbackRef: context.captureFeedbackRef,
        streamRef: context.streamRef,
        stopRecording: context.stopRecording,
        videoRef: context.videoRef,
        visibilityPausedRef: context.visibilityPausedRef,
        mountedRef: context.mountedRef,
        setStream: context.setStream,
        setStatus: context.setStatus,
        setIsPaused: context.setIsPaused,
        setIsRetrying: context.setIsRetrying,
        setIsFlashOn: context.setIsFlashOn,
        setIsFlashSupported: context.setIsFlashSupported,
        setIsFocusSupported: context.setIsFocusSupported,
        setFocusPoint: context.setFocusPoint,
        setIsFocusing: context.setIsFocusing,
        setIsRecording: context.setIsRecording,
      }),
    [
      context.cancelTimer,
      context.stopRecording,
      context.stopVoiceListening,
      context.requestRef,
      context.startupAbortRef,
      context.startupRef,
      context.focusTimerRef,
      context.captureFeedbackRef,
      context.streamRef,
      context.videoRef,
      context.visibilityPausedRef,
      context.mountedRef,
      context.setStream,
      context.setStatus,
      context.setIsPaused,
      context.setIsRetrying,
      context.setIsFlashOn,
      context.setIsFlashSupported,
      context.setIsFocusSupported,
      context.setFocusPoint,
      context.setIsFocusing,
      context.setIsRecording,
    ],
  );

  return { stop };
}

interface CameraStartActionContext {
  startupRef: React.RefObject<Promise<void> | null>;
  streamRef: React.RefObject<MediaStream | null>;
  requestRef: React.RefObject<number>;
  startupAbortRef: React.RefObject<AbortController | null>;
  mountedRef: React.RefObject<boolean>;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  setError: React.Dispatch<React.SetStateAction<CameraError | null>>;
  setIsRetrying: React.Dispatch<React.SetStateAction<boolean>>;
  facingRef: React.RefObject<CameraFacingMode>;
  activeDeviceId: string | null;
  constraints: CameraConstraints | undefined;
  setFacingMode: React.Dispatch<React.SetStateAction<"user" | "environment">>;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setPermissionState: React.Dispatch<
    React.SetStateAction<"granted" | "denied" | "prompt" | "unknown">
  >;
  setActiveDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsFlashSupported: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusSupported: React.Dispatch<React.SetStateAction<boolean>>;
  stop: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  refreshDevices: () => Promise<void>;
}

function useCameraStartAction(context: CameraStartActionContext) {
  const start = useCallback(
    (override?: {
      facingMode?: CameraFacingMode;
      deviceId?: string | null;
    }): Promise<void> =>
      startCameraStream(
        {
          startupRef: context.startupRef,
          streamRef: context.streamRef,
          requestRef: context.requestRef,
          startupAbortRef: context.startupAbortRef,
          mountedRef: context.mountedRef,
          createError: context.createError,
          setStatus: context.setStatus,
          setError: context.setError,
          setIsRetrying: context.setIsRetrying,
          facingRef: context.facingRef,
          activeDeviceId: context.activeDeviceId,
          constraints: {
            width: context.constraints?.width,
            height: context.constraints?.height,
            aspectRatio: context.constraints?.aspectRatio,
            frameRate: context.constraints?.frameRate,
          },
          setFacingMode: context.setFacingMode,
          setStream: context.setStream,
          setPermissionState: context.setPermissionState,
          setActiveDeviceId: context.setActiveDeviceId,
          setIsFlashSupported: context.setIsFlashSupported,
          setIsFocusSupported: context.setIsFocusSupported,
          stop: context.stop,
          videoRef: context.videoRef,
          setIsPaused: context.setIsPaused,
          refreshDevices: context.refreshDevices,
        },
        override,
      ),
    [
      context.activeDeviceId,
      context.constraints?.width,
      context.constraints?.height,
      context.constraints?.aspectRatio,
      context.constraints?.frameRate,
      context.createError,
      context.refreshDevices,
      context.stop,
      context.startupRef,
      context.streamRef,
      context.requestRef,
      context.startupAbortRef,
      context.mountedRef,
      context.setStatus,
      context.setError,
      context.setIsRetrying,
      context.facingRef,
      context.setFacingMode,
      context.setStream,
      context.setPermissionState,
      context.setActiveDeviceId,
      context.setIsFlashSupported,
      context.setIsFocusSupported,
      context.videoRef,
      context.setIsPaused,
    ],
  );

  return { start };
}

interface CameraCaptureActionsContext {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  visibilityPausedRef: React.RefObject<boolean>;
  zoomRef: React.RefObject<number>;
  mirrorCapture: boolean;
  captureFormat: "image/jpeg" | "image/png" | "image/webp";
  captureQuality: number;
  enableHaptics: boolean;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  captureFeedbackRef: React.RefObject<number | null>;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  onCapture: ((result: CaptureResult) => void) | undefined;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
  recordingRef: React.RefObject<RecordingSession | null>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

function useCameraCaptureActions(context: CameraCaptureActionsContext) {
  const capture = useCallback(
    (): CaptureResult | null =>
      captureCameraFrame({
        videoRef: context.videoRef,
        streamRef: context.streamRef,
        visibilityPausedRef: context.visibilityPausedRef,
        zoomRef: context.zoomRef,
        mirrorCapture: context.mirrorCapture,
        captureFormat: context.captureFormat,
        captureQuality: context.captureQuality,
        enableHaptics: context.enableHaptics,
        setStatus: context.setStatus,
        captureFeedbackRef: context.captureFeedbackRef,
        requestRef: context.requestRef,
        mountedRef: context.mountedRef,
        onCapture: context.onCapture,
        createError: context.createError,
      }),
    [
      context.captureFormat,
      context.captureQuality,
      context.createError,
      context.enableHaptics,
      context.mirrorCapture,
      context.onCapture,
      context.videoRef,
      context.streamRef,
      context.visibilityPausedRef,
      context.zoomRef,
      context.setStatus,
      context.captureFeedbackRef,
      context.requestRef,
      context.mountedRef,
    ],
  );

  const startRecording = useCallback(
    () =>
      beginCameraRecording({
        streamRef: context.streamRef,
        recordingRef: context.recordingRef,
        createError: context.createError,
        mountedRef: context.mountedRef,
        setIsRecording: context.setIsRecording,
        setIsPaused: context.setIsPaused,
      }),
    [
      context.createError,
      context.streamRef,
      context.recordingRef,
      context.mountedRef,
      context.setIsRecording,
      context.setIsPaused,
    ],
  );

  const pauseRecording = useCallback(
    () =>
      pauseCameraRecording({
        recordingRef: context.recordingRef,
        setIsPaused: context.setIsPaused,
      }),
    [context.recordingRef, context.setIsPaused],
  );

  const resumeRecording = useCallback(
    () =>
      resumeCameraRecording({
        recordingRef: context.recordingRef,
        setIsPaused: context.setIsPaused,
      }),
    [context.recordingRef, context.setIsPaused],
  );

  return { capture, startRecording, pauseRecording, resumeRecording };
}

interface CameraDeviceActionsContext {
  facingRef: React.RefObject<CameraFacingMode>;
  stop: () => Promise<void>;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  start: (override?: {
    facingMode?: CameraFacingMode;
    deviceId?: string | null;
  }) => Promise<void>;
  streamRef: React.RefObject<MediaStream | null>;
  isFlashOn: boolean;
  setIsFlashOn: React.Dispatch<React.SetStateAction<boolean>>;
  minZoom: number;
  maxZoom: number;
  zoomRef: React.RefObject<number>;
  setZoomState: React.Dispatch<React.SetStateAction<number>>;
}

function useCameraDeviceActions(context: CameraDeviceActionsContext) {
  const switchCamera = useCallback(
    async () =>
      switchCameraFacing({
        facingRef: context.facingRef,
        stop: context.stop,
        requestRef: context.requestRef,
        mountedRef: context.mountedRef,
        start: context.start,
      }),
    [
      context.start,
      context.stop,
      context.facingRef,
      context.requestRef,
      context.mountedRef,
    ],
  );

  const switchDevice = useCallback(
    async (deviceId: string) =>
      switchCameraDevice(
        {
          stop: context.stop,
          requestRef: context.requestRef,
          mountedRef: context.mountedRef,
          start: context.start,
        },
        deviceId,
      ),
    [context.start, context.stop, context.requestRef, context.mountedRef],
  );

  const toggleFlash = useCallback(
    async () =>
      toggleCameraTorch({
        streamRef: context.streamRef,
        requestRef: context.requestRef,
        isFlashOn: context.isFlashOn,
        mountedRef: context.mountedRef,
        setIsFlashOn: context.setIsFlashOn,
      }),
    [
      context.isFlashOn,
      context.streamRef,
      context.requestRef,
      context.mountedRef,
      context.setIsFlashOn,
    ],
  );

  const requestPermission = useCallback(
    async () =>
      requestCameraAccess({
        start: context.start,
        streamRef: context.streamRef,
      }),
    [context.start, context.streamRef],
  );

  const setZoom = useCallback(
    (next: number) =>
      updateCameraZoom(
        {
          minZoom: context.minZoom,
          maxZoom: context.maxZoom,
          zoomRef: context.zoomRef,
          setZoomState: context.setZoomState,
        },
        next,
      ),
    [context.minZoom, context.maxZoom, context.zoomRef, context.setZoomState],
  );

  return {
    switchCamera,
    switchDevice,
    toggleFlash,
    requestPermission,
    setZoom,
  };
}

interface CameraFocusAndTimerActionsContext {
  setZoom: (next: number) => void;
  zoomRef: React.RefObject<number>;
  focusTimerRef: React.RefObject<number | null>;
  setFocusPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  setIsFocusing: React.Dispatch<React.SetStateAction<boolean>>;
  streamRef: React.RefObject<MediaStream | null>;
  isFocusSupported: boolean;
  requestRef: React.RefObject<number>;
  mountedRef: React.RefObject<boolean>;
  setIsFocusSupported: React.Dispatch<React.SetStateAction<boolean>>;
  timerRef: React.RefObject<number | null>;
  timerDuration: CameraTimerDuration;
  capture: () => CaptureResult | null;
  setTimerRemaining: React.Dispatch<React.SetStateAction<number>>;
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  cancelTimer: () => void;
}

function useCameraFocusAndTimerActions(
  context: CameraFocusAndTimerActionsContext,
) {
  const { setZoom } = context;

  const zoomIn = useCallback(
    (step = 0.5) => setZoom(context.zoomRef.current + step),
    [setZoom, context.zoomRef],
  );

  const zoomOut = useCallback(
    (step = 0.5) => setZoom(context.zoomRef.current - step),
    [setZoom, context.zoomRef],
  );

  const resetZoom = useCallback(() => setZoom(1), [setZoom]);

  const unlockFocus = useCallback(
    () =>
      unlockCameraFocus({
        focusTimerRef: context.focusTimerRef,
        setFocusPoint: context.setFocusPoint,
        setIsFocusing: context.setIsFocusing,
      }),
    [context.focusTimerRef, context.setFocusPoint, context.setIsFocusing],
  );

  const focusAt = useCallback(
    (point: Point) =>
      focusCameraAt(
        {
          streamRef: context.streamRef,
          isFocusSupported: context.isFocusSupported,
          requestRef: context.requestRef,
          mountedRef: context.mountedRef,
          setFocusPoint: context.setFocusPoint,
          setIsFocusing: context.setIsFocusing,
          focusTimerRef: context.focusTimerRef,
          setIsFocusSupported: context.setIsFocusSupported,
        },
        point,
      ),
    [
      context.isFocusSupported,
      context.streamRef,
      context.requestRef,
      context.mountedRef,
      context.setFocusPoint,
      context.setIsFocusing,
      context.focusTimerRef,
      context.setIsFocusSupported,
    ],
  );

  const startTimer = useCallback(
    () =>
      startCameraTimer({
        streamRef: context.streamRef,
        timerRef: context.timerRef,
        timerDuration: context.timerDuration,
        capture: context.capture,
        setTimerRemaining: context.setTimerRemaining,
        setIsTimerActive: context.setIsTimerActive,
        cancelTimer: context.cancelTimer,
      }),
    [
      context.cancelTimer,
      context.capture,
      context.timerDuration,
      context.streamRef,
      context.timerRef,
      context.setTimerRemaining,
      context.setIsTimerActive,
    ],
  );

  return { zoomIn, zoomOut, resetZoom, unlockFocus, focusAt, startTimer };
}

interface CameraVoiceActionsContext {
  voiceOptions:
    | { language?: string; confidenceThreshold?: number; continuous?: boolean }
    | undefined;
  enableVoiceControl: boolean;
  recognitionRef: React.RefObject<CameraSpeechRecognition | null>;
  streamRef: React.RefObject<MediaStream | null>;
  mountedRef: React.RefObject<boolean>;
  setLastVoiceCommand: React.Dispatch<
    React.SetStateAction<CameraVoiceCommand | null>
  >;
  onVoiceCommand:
    | ((
        command: CameraVoiceCommand,
        phrase: string,
        confidence: number,
      ) => void)
    | undefined;
  capture: () => CaptureResult | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  switchCamera: () => Promise<void>;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  toggleFlash: () => Promise<void>;
  startTimer: () => void;
  setIsVoiceListening: React.Dispatch<React.SetStateAction<boolean>>;
  stopVoiceListening: () => void;
  createError: (
    code: CameraErrorCode,
    message: string,
    suggestion?: string,
  ) => void;
}

function useCameraVoiceActions(context: CameraVoiceActionsContext) {
  const { stopVoiceListening } = context;

  const startVoiceListening = useCallback(
    (
      requestedLanguage?: string,
      overrideCommand?: UseCameraOptions["onVoiceCommand"],
    ) =>
      listenForCameraCommands(
        {
          voiceOptions: {
            language: context.voiceOptions?.language,
            continuous: context.voiceOptions?.continuous,
            confidenceThreshold: context.voiceOptions?.confidenceThreshold,
          },
          enableVoiceControl: context.enableVoiceControl,
          recognitionRef: context.recognitionRef,
          streamRef: context.streamRef,
          mountedRef: context.mountedRef,
          setLastVoiceCommand: context.setLastVoiceCommand,
          onVoiceCommand: context.onVoiceCommand,
          capture: context.capture,
          startRecording: context.startRecording,
          stopRecording: context.stopRecording,
          switchCamera: context.switchCamera,
          zoomIn: context.zoomIn,
          zoomOut: context.zoomOut,
          toggleFlash: context.toggleFlash,
          startTimer: context.startTimer,
          setIsVoiceListening: context.setIsVoiceListening,
          stopVoiceListening: stopVoiceListening,
          createError: context.createError,
        },
        requestedLanguage,
        overrideCommand,
      ),
    [
      context.capture,
      context.createError,
      context.enableVoiceControl,
      context.onVoiceCommand,
      context.startRecording,
      context.startTimer,
      context.stopRecording,
      stopVoiceListening,
      context.switchCamera,
      context.toggleFlash,
      context.voiceOptions?.language,
      context.voiceOptions?.continuous,
      context.voiceOptions?.confidenceThreshold,
      context.zoomIn,
      context.zoomOut,
      context.recognitionRef,
      context.streamRef,
      context.mountedRef,
      context.setLastVoiceCommand,
      context.setIsVoiceListening,
    ],
  );

  const toggleVoiceListening = useCallback(() => {
    if (context.recognitionRef.current) stopVoiceListening();
    else startVoiceListening();
  }, [startVoiceListening, stopVoiceListening, context.recognitionRef]);

  return { startVoiceListening, toggleVoiceListening };
}

interface CameraInputEffectsContext {
  enableKeyboardShortcuts: boolean;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;
  startTimer: () => void;
  recordingRef: React.RefObject<RecordingSession | null>;
  stopRecording: () => Promise<Blob | null>;
  startRecording: () => void;
  switchCamera: () => Promise<void>;
  toggleFlash: () => Promise<void>;
  cancelTimer: () => void;
  onGestureStart:
    ((type: CameraGestureState["gestureType"]) => void) | undefined;
  onGestureEnd: ((type: CameraGestureState["gestureType"]) => void) | undefined;
  enableGestures: boolean;
  streamRef: React.RefObject<MediaStream | null>;
  gestureOptions:
    | {
        enablePinchToZoom?: boolean;
        enableTapToFocus?: boolean;
        enableDoubleTapToCapture?: boolean;
        enableSwipeToSwitch?: boolean;
        zoomSensitivity?: number;
        minZoom?: number;
        maxZoom?: number;
      }
    | undefined;
  zoomRef: React.RefObject<number>;
  setZoom: (next: number) => void;
  focusAt: (point: Point) => void;
}

function useCameraInputEffects(context: CameraInputEffectsContext) {
  useEffect(
    () =>
      bindCameraKeyboard({
        enableKeyboardShortcuts: context.enableKeyboardShortcuts,
        gestureContainerRef: context.gestureContainerRef,
        startTimer: context.startTimer,
        recordingRef: context.recordingRef,
        stopRecording: context.stopRecording,
        startRecording: context.startRecording,
        switchCamera: context.switchCamera,
        toggleFlash: context.toggleFlash,
        cancelTimer: context.cancelTimer,
      }),
    [
      context.enableKeyboardShortcuts,
      context.cancelTimer,
      context.startRecording,
      context.startTimer,
      context.stopRecording,
      context.switchCamera,
      context.toggleFlash,
      context.gestureContainerRef,
      context.recordingRef,
    ],
  );

  const gestureStarted = useEffectEvent(
    (type: CameraGestureState["gestureType"]) => context.onGestureStart?.(type),
  );

  const gestureEnded = useEffectEvent(
    (type: CameraGestureState["gestureType"]) => context.onGestureEnd?.(type),
  );

  useEffect(
    () =>
      bindCameraGestures({
        enableGestures: context.enableGestures,
        gestureContainerRef: context.gestureContainerRef,
        streamRef: context.streamRef,
        gestureOptions: {
          enablePinchToZoom: context.gestureOptions?.enablePinchToZoom,
          enableTapToFocus: context.gestureOptions?.enableTapToFocus,
          enableDoubleTapToCapture:
            context.gestureOptions?.enableDoubleTapToCapture,
          enableSwipeToSwitch: context.gestureOptions?.enableSwipeToSwitch,
          zoomSensitivity: context.gestureOptions?.zoomSensitivity,
        },
        zoomRef: context.zoomRef,
        gestureStarted,
        setZoom: context.setZoom,
        switchCamera: context.switchCamera,
        gestureEnded,
        startTimer: context.startTimer,
        focusAt: context.focusAt,
      }),
    [
      context.enableGestures,
      context.focusAt,
      context.gestureOptions?.enablePinchToZoom,
      context.gestureOptions?.enableTapToFocus,
      context.gestureOptions?.enableDoubleTapToCapture,
      context.gestureOptions?.enableSwipeToSwitch,
      context.gestureOptions?.zoomSensitivity,
      context.setZoom,
      context.startTimer,
      context.switchCamera,
      context.gestureContainerRef,
      context.streamRef,
      context.zoomRef,
    ],
  );
}

interface CameraLifecycleEffectsContext {
  cancelTimer: () => void;
  stopVoiceListening: () => void;
  recordingRef: React.RefObject<RecordingSession | null>;
  visibilityPausedRef: React.RefObject<boolean>;
  streamRef: React.RefObject<MediaStream | null>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: React.Dispatch<React.SetStateAction<CameraStatus>>;
  stop: () => Promise<void>;
  refreshDevices: () => Promise<void>;
  autoStart: boolean;
  start: (override?: {
    facingMode?: CameraFacingMode;
    deviceId?: string | null;
  }) => Promise<void>;
  mountedRef: React.RefObject<boolean>;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;
}

function useCameraLifecycleEffects(context: CameraLifecycleEffectsContext) {
  useEffect(
    () =>
      bindCameraVisibility({
        cancelTimer: context.cancelTimer,
        stopVoiceListening: context.stopVoiceListening,
        recordingRef: context.recordingRef,
        visibilityPausedRef: context.visibilityPausedRef,
        streamRef: context.streamRef,
        setIsPaused: context.setIsPaused,
        setStatus: context.setStatus,
        stop: context.stop,
      }),
    [
      context.cancelTimer,
      context.stop,
      context.stopVoiceListening,
      context.recordingRef,
      context.visibilityPausedRef,
      context.streamRef,
      context.setIsPaused,
      context.setStatus,
    ],
  );
  useEffect(
    () => bindCameraDevices({ refreshDevices: context.refreshDevices }),
    [context.refreshDevices],
  );

  const startVisible = useEffectEvent(() => {
    if (context.autoStart && !document.hidden) void context.start();
  });

  const stopUnmounted = useEffectEvent(() => {
    void context.stop();
  });

  useEffect(
    () =>
      mountCameraController({
        mountedRef: context.mountedRef,
        gestureContainerRef: context.gestureContainerRef,
        autoStart: context.autoStart,
        startVisible,
        stopUnmounted,
      }),
    [context.autoStart, context.mountedRef, context.gestureContainerRef],
  );
}

function cameraPublicState(context: UseCameraReturn) {
  return {
    videoRef: context.videoRef,
    gestureContainerRef: context.gestureContainerRef,
    stream: context.stream,
    status: context.status,
    error: context.error,
    devices: context.devices,
    activeDeviceId: context.activeDeviceId,
    facingMode: context.facingMode,
    isRecording: context.isRecording,
    isPaused: context.isPaused,
    isRetrying: context.isRetrying,
    isFlashSupported: context.isFlashSupported,
    isFlashOn: context.isFlashOn,
    zoom: context.zoom,
    minZoom: context.minZoom,
    maxZoom: context.maxZoom,
    focusPoint: context.focusPoint,
    isFocusing: context.isFocusing,
    isFocusSupported: context.isFocusSupported,
    timerDuration: context.timerDuration,
    timerRemaining: context.timerRemaining,
    isTimerActive: context.isTimerActive,
    isVoiceListening: context.isVoiceListening,
    isVoiceSupported: context.isVoiceSupported,
    lastVoiceCommand: context.lastVoiceCommand,
    permissionState: context.permissionState,
    start: context.start,
    stop: context.stop,
    capture: context.capture,
    startRecording: context.startRecording,
    stopRecording: context.stopRecording,
    pauseRecording: context.pauseRecording,
    resumeRecording: context.resumeRecording,
    switchCamera: context.switchCamera,
    switchDevice: context.switchDevice,
    toggleFlash: context.toggleFlash,
    requestPermission: context.requestPermission,
    refreshDevices: context.refreshDevices,
    setZoom: context.setZoom,
    zoomIn: context.zoomIn,
    zoomOut: context.zoomOut,
    resetZoom: context.resetZoom,
    focusAt: context.focusAt,
    unlockFocus: context.unlockFocus,
    setTimerDuration: context.setTimerDuration,
    startTimer: context.startTimer,
    cancelTimer: context.cancelTimer,
    startVoiceListening: context.startVoiceListening,
    stopVoiceListening: context.stopVoiceListening,
    toggleVoiceListening: context.toggleVoiceListening,
  };
}

function cameraShortcutAllowed(
  event: KeyboardEvent,
  element: HTMLElement,
): boolean {
  return !(
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.repeat ||
    event.target !== element
  );
}

function suspendCameraVisibility(context: BindCameraVisibilityContext) {
  context.cancelTimer();
  context.stopVoiceListening();
  const recorder = context.recordingRef.current?.recorder;
  context.visibilityPausedRef.current = recorder?.state !== "paused";

  if (recorder?.state === "recording") recorder.pause();
  context.streamRef.current?.getVideoTracks().forEach((track) => {
    track.enabled = false;
  });

  if (context.streamRef.current) {
    context.setIsPaused(true);
    context.setStatus("paused");
  }
}

function resumeCameraVisibility(context: BindCameraVisibilityContext) {
  if (!context.streamRef.current) return;
  context.streamRef.current.getVideoTracks().forEach((track) => {
    track.enabled = true;
  });

  if (
    context.visibilityPausedRef.current &&
    context.recordingRef.current?.recorder.state === "paused"
  )
    context.recordingRef.current.recorder.resume();
  context.visibilityPausedRef.current = false;
  context.setIsPaused(
    context.recordingRef.current?.recorder.state === "paused",
  );
  context.setStatus("ready");
}

function cameraStreamTarget(
  context: StartCameraStreamContext,
  override?: CameraStreamOverride,
) {
  return {
    facing: override?.facingMode ?? context.facingRef.current,
    device:
      override?.deviceId === undefined
        ? context.activeDeviceId
        : override.deviceId,
  };
}

async function completeCameraStreamStartup(
  context: StartCameraStreamContext,
  session: CameraStartupSession,
  acquired: MediaStream,
  facing: CameraFacingMode,
  device: string | null,
) {
  if (!session.current()) {
    acquired.getTracks().forEach((track) => track.stop());

    return;
  }

  publishCameraStream(context, session, acquired, facing, device);
  await attachCameraPreview(context.videoRef.current, acquired, session);

  if (session.current()) finishCameraStartup(context, acquired);
}
