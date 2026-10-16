import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CameraConstraints,
  CameraError,
  CameraErrorCode,
  CameraFacingMode,
  CameraStatus,
  CaptureResult,
  MediaDeviceInfo,
  CameraTimerDuration,
  CameraVoiceCommand,
  Point,
  CameraGestureState,
} from "@/lib/camera/types";
import {
  CAMERA_LOCK_TIMEOUT_MS,
  MEDIA_RETRY_MAX_ATTEMPTS,
  MEDIA_RETRY_BASE_DELAY_MS,
  TRACK_END_TIMEOUT_MS,
  HARDWARE_RELEASE_DELAY_MS,
  DEFAULT_CAPTURE_QUALITY,
  DEFAULT_CAPTURE_FORMAT,
  KEYBOARD_SHORTCUTS,
  GESTURE_CONFIG,
} from "@/lib/camera/constants";
import {
  generateInstanceId,
  delay,
  dataUrlToBlob,
  isTorchSupported,
  toggleTorch,
  triggerHaptic,
  getSupportedVideoCodec,
  checkCameraPermissionStatus,
} from "@/lib/camera/utils";

let globalCameraLock = false;

let globalLockHolder: string | null = null;

const lockWaitQueue: Array<() => void> = [];

const waitForTracksToEnd = (
  tracks: MediaStreamTrack[],
  timeoutMs = TRACK_END_TIMEOUT_MS
): Promise<void> => {
  return new Promise((resolve) => {
    if (tracks.length === 0) {
      resolve();

      return;
    }

    const activeTracks = tracks.filter((t) => t.readyState === "live");

    if (activeTracks.length === 0) {
      resolve();

      return;
    }

    let resolved = false;
    let endedCount = 0;

    const onEnded = () => {
      endedCount++;

      if (endedCount >= activeTracks.length && !resolved) {
        resolved = true;
        resolve();
      }
    };

    activeTracks.forEach((track) => {
      track.addEventListener("ended", onEnded, { once: true });
      track.stop();
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, timeoutMs);
  });
};

const acquireMediaStreamWithRetry = async (
  constraints: MediaStreamConstraints,
  maxRetries = MEDIA_RETRY_MAX_ATTEMPTS,
  onRetry?: (attempt: number, maxRetries: number) => void
): Promise<MediaStream> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      lastError = err as Error;

      const isRetryable =
        err instanceof DOMException &&
        (err.name === "NotReadableError" ||
          (err.message &&
            err.message.includes("Could not start video source")));

      if (isRetryable && attempt < maxRetries - 1) {
        const retryDelay = MEDIA_RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        onRetry?.(attempt + 1, maxRetries);
        await delay(retryDelay);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
};

const acquireLock = async (
  instanceId: string,
  timeoutMs = CAMERA_LOCK_TIMEOUT_MS
): Promise<boolean> => {
  const startTime = Date.now();

  while (globalCameraLock && globalLockHolder !== instanceId) {
    if (Date.now() - startTime > timeoutMs) {
      return false;
    }

    await new Promise<void>((resolve) => {
      lockWaitQueue.push(resolve);
      setTimeout(resolve, 100);
    });
  }

  globalCameraLock = true;
  globalLockHolder = instanceId;

  return true;
};

const releaseLock = (instanceId: string): void => {
  if (globalLockHolder === instanceId) {
    globalCameraLock = false;
    globalLockHolder = null;
    const next = lockWaitQueue.shift();

    if (next) next();
  }
};

export interface UseCameraOptions {
  // Core options
  facingMode?: CameraFacingMode;
  constraints?: CameraConstraints;
  autoStart?: boolean;

  // Features
  enableKeyboardShortcuts?: boolean;
  enableHaptics?: boolean;
  enableGestures?: boolean;
  enableVoiceControl?: boolean;

  // Capture settings
  captureQuality?: number;
  captureFormat?: "image/jpeg" | "image/png";

  // Gesture settings
  gestureOptions?: {
    enablePinchToZoom?: boolean;
    enableTapToFocus?: boolean;
    enableDoubleTapToCapture?: boolean;
    enableSwipeToSwitch?: boolean;
    zoomSensitivity?: number;
    minZoom?: number;
    maxZoom?: number;
  };

  // Voice settings
  voiceOptions?: {
    language?: string;
    confidenceThreshold?: number;
    continuous?: boolean;
  };

  // Callbacks
  onCapture?: (result: CaptureResult) => void;
  onError?: (error: CameraError) => void;
  onStatusChange?: (status: CameraStatus) => void;
  onVoiceCommand?: (
    command: CameraVoiceCommand,
    phrase: string,
    confidence: number
  ) => void;
  onGestureStart?: (type: CameraGestureState["gestureType"]) => void;
  onGestureEnd?: (type: CameraGestureState["gestureType"]) => void;
}

export interface UseCameraReturn {
  // Refs
  videoRef: React.RefObject<HTMLVideoElement | null>;
  gestureContainerRef: React.RefObject<HTMLDivElement | null>;

  // State
  stream: MediaStream | null;
  status: CameraStatus;
  error: CameraError | null;
  devices: MediaDeviceInfo[];
  activeDeviceId: string | null;
  facingMode: CameraFacingMode;
  isRecording: boolean;
  isPaused: boolean;
  isRetrying: boolean;

  // Flash
  isFlashSupported: boolean;
  isFlashOn: boolean;

  // Zoom & Focus
  zoom: number;
  minZoom: number;
  maxZoom: number;
  focusPoint: Point | null;
  isFocusing: boolean;

  // Timer
  timerDuration: CameraTimerDuration;
  timerRemaining: number;
  isTimerActive: boolean;

  // Voice
  isVoiceListening: boolean;
  isVoiceSupported: boolean;
  lastVoiceCommand: CameraVoiceCommand | null;

  // Permissions
  permissionState: "granted" | "denied" | "prompt" | "unknown";

  // Actions
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

  // Zoom & Focus actions
  setZoom: (zoom: number) => void;
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetZoom: () => void;
  focusAt: (point: Point) => void;
  unlockFocus: () => void;

  // Timer actions
  setTimerDuration: (duration: CameraTimerDuration) => void;
  startTimer: () => void;
  cancelTimer: () => void;

  // Voice actions
  startVoiceListening: () => void;
  stopVoiceListening: () => void;
  toggleVoiceListening: () => void;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const {
    facingMode: initialFacingMode = "user",
    constraints = {},
    autoStart = false,
    enableKeyboardShortcuts = true,
    enableHaptics = true,
    enableGestures: _enableGestures = false,
    enableVoiceControl = false,
    captureQuality = DEFAULT_CAPTURE_QUALITY,
    captureFormat = DEFAULT_CAPTURE_FORMAT,
    gestureOptions = {},
    voiceOptions: _voiceOptions = {},
    onCapture,
    onError,
    onStatusChange,
    onVoiceCommand: _onVoiceCommand,
    onGestureStart: _onGestureStart,
    onGestureEnd: _onGestureEnd,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const gestureContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const instanceIdRef = useRef(generateInstanceId());
  const isMountedRef = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashTrackRef = useRef<MediaStreamTrack | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<CameraError | null>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  const [facingMode, setFacingMode] =
    useState<CameraFacingMode>(initialFacingMode);

  const [isRetrying, setIsRetrying] = useState(false);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const [isRecording, setIsRecording] = useState(false);

  const [isFlashSupported, setIsFlashSupported] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const {
    minZoom = GESTURE_CONFIG.pinchToZoom.minZoom,
    maxZoom = GESTURE_CONFIG.pinchToZoom.maxZoom,
  } = gestureOptions;

  const [zoom, setZoomState] = useState(1);
  const [focusPoint, setFocusPoint] = useState<Point | null>(null);
  const [isFocusing, setIsFocusing] = useState(false);

  const [timerDuration, setTimerDuration] = useState<CameraTimerDuration>(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const [isVoiceSupported] = useState(
    typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );

  const [lastVoiceCommand, _setLastVoiceCommand] =
    useState<CameraVoiceCommand | null>(null);

  const [permissionState, setPermissionState] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const createError = useCallback(
    (
      code: CameraErrorCode,
      message: string,
      recoverable = true,
      suggestion?: string
    ): CameraError => {
      const err: CameraError = { code, message, recoverable, suggestion };
      setError(err);
      onError?.(err);

      return err;
    },
    [onError]
  );

  const getCanvas = useCallback((): HTMLCanvasElement => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    return canvasRef.current;
  }, []);

  const attachStreamToVideo = useCallback(
    async (
      video: HTMLVideoElement,
      mediaStream: MediaStream
    ): Promise<void> => {
      video.srcObject = mediaStream;

      await new Promise<void>((resolve, reject) => {
        if (video.readyState >= 1) {
          resolve();

          return;
        }

        const onLoadedMetadata = () => {
          video.removeEventListener("error", onErrorHandler);
          resolve();
        };

        const onErrorHandler = () => {
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          reject(new Error("Video failed to load metadata"));
        };

        video.addEventListener("loadedmetadata", onLoadedMetadata, {
          once: true,
        });
        video.addEventListener("error", onErrorHandler, { once: true });
      });

      try {
        await video.play();
      } catch {
        // Autoplay errors are expected and can be ignored
      }
    },
    []
  );

  const refreshDevices = useCallback(async (): Promise<void> => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();

      const videoDevices = allDevices
        .filter((device) => device.kind === "videoinput")
        .map((device, index) => ({
          deviceId: device.deviceId,
          kind: device.kind as "videoinput",
          label: device.label || `Camera ${index + 1}`,
          groupId: device.groupId,
        }));

      setDevices(videoDevices);
    } catch {
      // Device enumeration failed, will retry on next attempt
    }
  }, []);

  const start = useCallback(
    async (overrideOptions?: {
      facingMode?: CameraFacingMode;
      deviceId?: string | null;
    }): Promise<void> => {
      const effectiveFacingMode = overrideOptions?.facingMode ?? facingMode;

      const effectiveDeviceId =
        overrideOptions?.deviceId === undefined
          ? activeDeviceId
          : overrideOptions.deviceId;

      const lockAcquired = await acquireLock(instanceIdRef.current);

      if (!lockAcquired) {
        return;
      }

      if (streamRef.current) {
        releaseLock(instanceIdRef.current);

        return;
      }

      if (!isMountedRef.current) {
        releaseLock(instanceIdRef.current);

        return;
      }

      setStatus("initializing");
      setError(null);
      setIsRetrying(false);

      try {
        const videoConstraints: MediaTrackConstraints = {
          facingMode: effectiveFacingMode,
          ...(constraints.width && { width: { ideal: constraints.width } }),
          ...(constraints.height && { height: { ideal: constraints.height } }),
          ...(constraints.frameRate && {
            frameRate: { ideal: constraints.frameRate },
          }),
          ...(constraints.aspectRatio && {
            aspectRatio: { ideal: constraints.aspectRatio },
          }),
        };

        const mediaConstraints: MediaStreamConstraints = {
          video: effectiveDeviceId
            ? { deviceId: { exact: effectiveDeviceId }, ...videoConstraints }
            : videoConstraints,
          audio: false,
        };

        const mediaStream = await acquireMediaStreamWithRetry(
          mediaConstraints,
          MEDIA_RETRY_MAX_ATTEMPTS,
          () => {
            if (isMountedRef.current) {
              setIsRetrying(true);
            }
          }
        );

        if (isMountedRef.current) {
          setIsRetrying(false);
        }

        if (!isMountedRef.current) {
          mediaStream.getTracks().forEach((track) => track.stop());

          return;
        }

        streamRef.current = mediaStream;
        setStream(mediaStream);

        const videoTrack = mediaStream.getVideoTracks()[0];

        if (videoTrack) {
          const settings = videoTrack.getSettings();

          if (settings.deviceId) {
            setActiveDeviceId(settings.deviceId);
          }

          flashTrackRef.current = videoTrack;
          const flashSupported = isTorchSupported(videoTrack);
          setIsFlashSupported(flashSupported);
        }

        if (videoRef.current && isMountedRef.current) {
          await attachStreamToVideo(videoRef.current, mediaStream);

          if (isMountedRef.current) {
            setStatus("ready");
          }
        }
      } catch (err) {
        if (!isMountedRef.current) return;

        setIsRetrying(false);

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";

        if (
          errorMessage.includes("Permission denied") ||
          errorMessage.includes("NotAllowedError")
        ) {
          createError(
            "PERMISSION_DENIED",
            "Camera permission was denied.",
            true,
            "Please allow camera access and try again."
          );
          setStatus("permission-denied");
        } else if (errorMessage.includes("NotFoundError")) {
          createError("DEVICE_NOT_FOUND", "Camera device not found.", false);
          setStatus("error");
        } else if (
          errorMessage.includes("NotReadableError") ||
          errorMessage.includes("TrackStartError") ||
          errorMessage.includes("Could not start video source")
        ) {
          createError(
            "DEVICE_IN_USE",
            "Camera is busy or temporarily unavailable.",
            true,
            "Try closing other apps using the camera."
          );
          setStatus("error");
        } else {
          createError(
            "UNKNOWN_ERROR",
            `Failed to start camera: ${errorMessage}`,
            true
          );
          setStatus("error");
        }
      } finally {
        releaseLock(instanceIdRef.current);
      }
    },
    [facingMode, activeDeviceId, constraints, attachStreamToVideo, createError]
  );

  const stop = useCallback(async (): Promise<void> => {
    releaseLock(instanceIdRef.current);

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      await waitForTracksToEnd(tracks);
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    await delay(HARDWARE_RELEASE_DELAY_MS);

    if (isMountedRef.current) {
      setStream(null);
      setStatus("idle");
      setIsFlashSupported(false);
      setIsFlashOn(false);
    }
  }, []);

  const capture = useCallback((): CaptureResult | null => {
    const video = videoRef.current;

    if (!video || video.readyState !== 4) {
      return null;
    }

    const canvas = getCanvas();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const dataUrl = canvas.toDataURL(captureFormat, captureQuality);
    const blob = dataUrlToBlob(dataUrl);

    const result: CaptureResult = {
      blob,
      url: URL.createObjectURL(blob),
      type: captureFormat,
      timestamp: Date.now(),
      width: canvas.width,
      height: canvas.height,
    };

    if (enableHaptics) {
      triggerHaptic(50);
    }

    onCapture?.(result);

    return result;
  }, [
    facingMode,
    captureQuality,
    captureFormat,
    enableHaptics,
    getCanvas,
    onCapture,
  ]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    const mimeType = getSupportedVideoCodec();

    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      setIsRecording(false);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder) {
        resolve(null);

        return;
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        recordedChunksRef.current = [];
        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const pauseRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    }
  }, []);

  const resumeRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  }, []);

  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    await stop();
    await start({ facingMode: newFacingMode });
  }, [facingMode, stop, start]);

  const switchDevice = useCallback(
    async (deviceId: string) => {
      await stop();
      await start({ deviceId });
    },
    [stop, start]
  );

  const toggleFlashAction = useCallback(async () => {
    const track = flashTrackRef.current;

    if (!track || !isFlashSupported) return;

    const success = await toggleTorch(track, !isFlashOn);

    if (success) {
      setIsFlashOn(!isFlashOn);
    }
  }, [isFlashSupported, isFlashOn]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const state = await checkCameraPermissionStatus();

      if (state === "denied") {
        createError(
          "PERMISSION_DENIED",
          "Camera permission was denied.",
          true,
          "Enable camera access in browser settings."
        );
        setPermissionState("denied");

        return false;
      }

      if (state === "prompt") {
        try {
          const testStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });

          testStream.getTracks().forEach((track) => track.stop());
          setPermissionState("granted");

          return true;
        } catch {
          createError(
            "PERMISSION_DENIED",
            "Camera permission was denied.",
            true,
            "Please allow camera access."
          );
          setPermissionState("denied");

          return false;
        }
      }

      setPermissionState("granted");

      return true;
    } catch {
      return false;
    }
  }, [createError]);

  const clampZoom = useCallback(
    (value: number) => Math.max(minZoom, Math.min(maxZoom, value)),
    [minZoom, maxZoom]
  );

  const setZoom = useCallback(
    (value: number) => {
      const clampedZoom = clampZoom(value);
      setZoomState(clampedZoom);
    },
    [clampZoom]
  );

  const zoomIn = useCallback(
    (step = 0.5) => {
      setZoom(zoom + step);
    },
    [zoom, setZoom]
  );

  const zoomOut = useCallback(
    (step = 0.5) => {
      setZoom(zoom - step);
    },
    [zoom, setZoom]
  );

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  const focusAt = useCallback((point: Point) => {
    setFocusPoint(point);
    setIsFocusing(true);
    setTimeout(() => setIsFocusing(false), 3000);
  }, []);

  const unlockFocus = useCallback(() => {
    setFocusPoint(null);
    setIsFocusing(false);
  }, []);

  const startTimer = useCallback(() => {
    if (timerDuration === 0) {
      capture();

      return;
    }

    setTimerRemaining(timerDuration);
    setIsTimerActive(true);

    timerIntervalRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }

          setIsTimerActive(false);
          capture();

          return 0;
        }

        return next;
      });
    }, 1000);
  }, [timerDuration, capture]);

  const cancelTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsTimerActive(false);
    setTimerRemaining(0);
  }, []);

  const startVoiceListening = useCallback(() => {
    if (!isVoiceSupported || !enableVoiceControl) return;
    setIsVoiceListening(true);
  }, [isVoiceSupported, enableVoiceControl]);

  const stopVoiceListening = useCallback(() => {
    setIsVoiceListening(false);
  }, []);

  const toggleVoiceListening = useCallback(() => {
    if (isVoiceListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  }, [isVoiceListening, startVoiceListening, stopVoiceListening]);

  useEffect(() => {
    if (!enableKeyboardShortcuts || status !== "ready") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case KEYBOARD_SHORTCUTS.capture:
          event.preventDefault();
          capture();
          break;
        case KEYBOARD_SHORTCUTS.record:
          event.preventDefault();

          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }

          break;
        case KEYBOARD_SHORTCUTS.switchCamera:
          event.preventDefault();

          if (devices.length > 1) {
            switchCamera();
          }

          break;
        case KEYBOARD_SHORTCUTS.toggleFlash:
          event.preventDefault();

          if (isFlashSupported) {
            toggleFlashAction();
          }

          break;
        case KEYBOARD_SHORTCUTS.cancel:
          event.preventDefault();
          cancelTimer();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enableKeyboardShortcuts,
    status,
    isRecording,
    devices.length,
    isFlashSupported,
    capture,
    startRecording,
    stopRecording,
    switchCamera,
    toggleFlashAction,
    cancelTimer,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;

      if (isHidden) {
        if (status === "ready") {
          setIsPaused(true);

          if (isRecording) {
            pauseRecording();
          }
        }
      } else {
        if (isRecording) {
          resumeRecording();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, isRecording, pauseRecording, resumeRecording]);

  useEffect(() => {
    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    refreshDevices();

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [refreshDevices]);

  useEffect(() => {
    isMountedRef.current = true;

    if (autoStart) {
      setTimeout(() => start(), 0);
    }

    return () => {
      isMountedRef.current = false;
      stop();

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return {
    videoRef,
    gestureContainerRef,
    stream,
    status,
    error,
    devices,
    activeDeviceId,
    facingMode,
    isRecording,
    isPaused,
    isRetrying,
    isFlashSupported,
    isFlashOn,
    zoom,
    minZoom,
    maxZoom,
    focusPoint,
    isFocusing,
    timerDuration,
    timerRemaining,
    isTimerActive,
    isVoiceListening,
    isVoiceSupported,
    lastVoiceCommand,
    permissionState,
    start,
    stop,
    capture,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    switchCamera,
    switchDevice,
    toggleFlash: toggleFlashAction,
    requestPermission,
    refreshDevices,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    focusAt,
    unlockFocus,
    setTimerDuration,
    startTimer,
    cancelTimer,
    startVoiceListening,
    stopVoiceListening,
    toggleVoiceListening,
  };
}

export function getShortcutHint(
  action: keyof typeof KEYBOARD_SHORTCUTS
): string {
  const key = KEYBOARD_SHORTCUTS[action];

  if (key === " ") return "Space";

  if (key === "Escape") return "Esc";

  return key.toUpperCase();
}
