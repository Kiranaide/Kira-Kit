"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCheck,
  IconX,
  IconLoader2,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type {
  DetectedFace,
  FaceDetectionOptions,
  DocumentType,
  IdScanResult,
  LivenessChallenge,
  LivenessResult,
  KYCStep,
  KYCResult,
  CameraError,
  CaptureResult,
} from "@/lib/camera/types";
import {
  DEFAULT_FACE_DETECTION_OPTIONS,
  DEFAULT_LIVENESS_CHALLENGES,
  DOCUMENT_TEMPLATES,
} from "@/lib/camera/types";
import {
  FACE_DETECTION_INTERVAL_MS,
  FACE_CENTER_TOLERANCE_PERCENT,
  AUTO_CAPTURE_DEBOUNCE_MS,
  DOCUMENT_ALIGNMENT_CHECK_INTERVAL_MS,
} from "@/lib/camera/constants";
import { prefersReducedMotion } from "@/lib/camera/utils";
import {
  Camera,
  CameraPreview,
  CameraOverlay,
  CameraGuide,
  CameraControls,
  useCameraState,
  useCameraActions,
  getProgressDescription,
  CHALLENGE_ICONS,
} from "./camera";

const faceDetectionVariants = cva("absolute inset-0 pointer-events-none", {
  variants: {
    showGuide: { true: "", false: "" },
    showBoundingBox: { true: "", false: "" },
  },
  defaultVariants: { showGuide: true, showBoundingBox: true },
});

const idCardScannerVariants = cva("absolute inset-0 pointer-events-none", {
  variants: {
    state: {
      idle: "",
      scanning: "",
      processing: "",
      success: "",
      error: "",
    },
  },
  defaultVariants: { state: "idle" },
});

const livenessVariants = cva("absolute inset-0 pointer-events-none", {
  variants: {
    state: {
      idle: "",
      active: "",
      completed: "",
      failed: "",
    },
  },
  defaultVariants: { state: "idle" },
});

const kycFlowVariants = cva("relative flex flex-col", {
  variants: {
    size: {
      default: "w-full max-w-lg",
      full: "w-full h-full",
      compact: "w-full max-w-md",
    },
  },
  defaultVariants: { size: "default" },
});

interface FaceDetector {
  estimateFaces(
    video: HTMLVideoElement,
    config?: { flipHorizontal?: boolean }
  ): Promise<RawFace[]>;
}

interface RawFace {
  box: {
    xMin: number;
    yMin: number;
    width: number;
    height: number;
    score?: number;
  };
  keypoints?: Array<{ x: number; y: number; name?: string }>;
}

let faceDetectionModelPromise: Promise<FaceDetector> | null = null;

async function loadFaceDetectionModel(): Promise<FaceDetector> {
  if (!faceDetectionModelPromise) {
    faceDetectionModelPromise = (async () => {
      const [tf, faceDetection] = await Promise.all([
        import("@tensorflow/tfjs-core"),
        import("@tensorflow-models/face-detection"),
      ]);
      await import("@tensorflow/tfjs-backend-webgl");
      await tf.ready();
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detector = await faceDetection.createDetector(model, {
        runtime: "tfjs",
        maxFaces: 5,
      });
      return detector as unknown as FaceDetector;
    })();
  }
  return faceDetectionModelPromise;
}

interface TesseractWorker {
  recognize(image: Blob): Promise<{ data: { text: string } }>;
  terminate(): Promise<unknown>;
}

interface TesseractModule {
  createWorker(lang: string): Promise<TesseractWorker>;
}

let tesseractPromise: Promise<TesseractModule> | null = null;

async function loadTesseract(): Promise<TesseractModule> {
  if (!tesseractPromise) {
    tesseractPromise = import("tesseract.js").then(
      (mod) => (mod.default || mod) as unknown as TesseractModule
    );
  }
  return tesseractPromise;
}

interface MRZData {
  documentType: string;
  countryCode: string;
  lastName: string;
  firstName: string;
  documentNumber: string;
  nationality: string;
  dateOfBirth: string;
  sex: string;
  expirationDate: string;
  personalNumber?: string;
}

function parseMRZ(text: string): MRZData | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim().replace(/\s/g, ""))
    .filter((line) => line.length >= 30);

  if (lines.length < 2) return null;

  if (lines.length >= 2 && lines[0].length >= 44 && lines[1].length >= 44) {
    return parseTD3(lines[0], lines[1]);
  }
  if (lines.length >= 3 && lines[0].length >= 30) {
    return parseTD1(lines[0], lines[1], lines[2]);
  }
  if (lines.length >= 2 && lines[0].length >= 36) {
    return parseTD2(lines[0], lines[1]);
  }
  return null;
}

function parseTD3(line1: string, line2: string): MRZData {
  const names = line1.substring(5, 44).split("<<");
  return {
    documentType: line1.substring(0, 2).replace(/<+/g, ""),
    countryCode: line1.substring(2, 5),
    lastName: names[0]?.replace(/<+/g, " ").trim() || "",
    firstName: names[1]?.replace(/<+/g, " ").trim() || "",
    documentNumber: line2.substring(0, 9).replace(/<+/g, ""),
    nationality: line2.substring(10, 13),
    dateOfBirth: formatMRZDate(line2.substring(13, 19)),
    sex: line2.substring(20, 21),
    expirationDate: formatMRZDate(line2.substring(21, 27)),
    personalNumber: line2.substring(28, 42).replace(/<+/g, "") || undefined,
  };
}

function parseTD1(line1: string, line2: string, line3: string): MRZData {
  const names = line3
    .replace(/<+/g, " ")
    .trim()
    .split(/\s{2,}/);
  return {
    documentType: line1.substring(0, 2).replace(/<+/g, ""),
    countryCode: line1.substring(2, 5),
    documentNumber: line1.substring(5, 14).replace(/<+/g, ""),
    lastName: names[0] || "",
    firstName: names.slice(1).join(" ") || "",
    dateOfBirth: formatMRZDate(line2.substring(0, 6)),
    sex: line2.substring(7, 8),
    expirationDate: formatMRZDate(line2.substring(8, 14)),
    nationality: line2.substring(15, 18),
  };
}

function parseTD2(line1: string, line2: string): MRZData {
  const names = line1.substring(5, 36).split("<<");
  return {
    documentType: line1.substring(0, 2).replace(/<+/g, ""),
    countryCode: line1.substring(2, 5),
    lastName: names[0]?.replace(/<+/g, " ").trim() || "",
    firstName: names[1]?.replace(/<+/g, " ").trim() || "",
    documentNumber: line2.substring(0, 9).replace(/<+/g, ""),
    nationality: line2.substring(10, 13),
    dateOfBirth: formatMRZDate(line2.substring(13, 19)),
    sex: line2.substring(20, 21),
    expirationDate: formatMRZDate(line2.substring(21, 27)),
  };
}

function formatMRZDate(mrzDate: string): string {
  if (mrzDate.length !== 6) return mrzDate;
  const year = parseInt(mrzDate.substring(0, 2), 10);
  const month = mrzDate.substring(2, 4);
  const day = mrzDate.substring(4, 6);
  const fullYear =
    year > 30 ? `19${mrzDate.substring(0, 2)}` : `20${mrzDate.substring(0, 2)}`;
  return `${fullYear}-${month}-${day}`;
}

interface FaceDetectionProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof faceDetectionVariants> {
  options?: FaceDetectionOptions;
  onFacesDetected?: (faces: DetectedFace[]) => void;
  onAlignmentChange?: (isAligned: boolean) => void;
  showLoadingIndicator?: boolean;
  guideInstruction?: string;
  autoStart?: boolean;
}

const FaceDetection = React.forwardRef<HTMLDivElement, FaceDetectionProps>(
  (
    {
      className,
      showGuide = true,
      showBoundingBox = true,
      options = DEFAULT_FACE_DETECTION_OPTIONS,
      onFacesDetected,
      onAlignmentChange,
      showLoadingIndicator = true,
      guideInstruction,
      autoStart = true,
      ...props
    },
    ref
  ) => {
    const { videoRef, status, facingMode } = useCameraState();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const detectorRef = React.useRef<FaceDetector | null>(null);
    const animationFrameRef = React.useRef<number>(0);
    const lastDetectionTimeRef = React.useRef<number>(0);

    const [isLoading, setIsLoading] = React.useState(true);
    const [isAligned, setIsAligned] = React.useState(false);
    const [faces, setFaces] = React.useState<DetectedFace[]>([]);

    const reducedMotion = prefersReducedMotion();

    const checkFaceCentered = React.useCallback(
      (
        face: DetectedFace,
        videoWidth: number,
        videoHeight: number
      ): boolean => {
        const centerX = videoWidth / 2;
        const centerY = videoHeight / 2;
        const faceCenter = {
          x: face.boundingBox.x + face.boundingBox.width / 2,
          y: face.boundingBox.y + face.boundingBox.height / 2,
        };
        const toleranceX = videoWidth * FACE_CENTER_TOLERANCE_PERCENT;
        const toleranceY = videoHeight * FACE_CENTER_TOLERANCE_PERCENT;
        return (
          Math.abs(faceCenter.x - centerX) < toleranceX &&
          Math.abs(faceCenter.y - centerY) < toleranceY
        );
      },
      []
    );

    const detectFaces = React.useCallback(async () => {
      const video = videoRef.current;
      const detector = detectorRef.current;
      if (!video || !detector || video.readyState !== 4) return;

      try {
        const rawFaces = await detector.estimateFaces(video, {
          flipHorizontal: false,
        });
        const detectedFaces: DetectedFace[] = rawFaces.map((face: RawFace) => ({
          boundingBox: {
            x: face.box.xMin,
            y: face.box.yMin,
            width: face.box.width,
            height: face.box.height,
          },
          landmarks: face.keypoints?.map((kp) => ({
            x: kp.x,
            y: kp.y,
            name: kp.name,
          })),
          confidence: face.box.score || 0.9,
        }));

        setFaces(detectedFaces);
        onFacesDetected?.(detectedFaces);

        if (detectedFaces.length === 1) {
          const aligned = checkFaceCentered(
            detectedFaces[0],
            video.videoWidth,
            video.videoHeight
          );
          if (aligned !== isAligned) {
            setIsAligned(aligned);
            onAlignmentChange?.(aligned);
          }
        } else if (isAligned) {
          setIsAligned(false);
          onAlignmentChange?.(false);
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    }, [
      videoRef,
      checkFaceCentered,
      isAligned,
      onFacesDetected,
      onAlignmentChange,
    ]);

    const runDetectionLoop = React.useCallback(() => {
      const loop = (timestamp: number) => {
        if (
          timestamp - lastDetectionTimeRef.current >=
          FACE_DETECTION_INTERVAL_MS
        ) {
          lastDetectionTimeRef.current = timestamp;
          detectFaces();
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    }, [detectFaces]);

    React.useEffect(() => {
      if (!showBoundingBox || !canvasRef.current || !videoRef.current) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      faces.forEach((face) => {
        ctx.strokeStyle = isAligned ? "#10b981" : "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          face.boundingBox.x,
          face.boundingBox.y,
          face.boundingBox.width,
          face.boundingBox.height
        );

        if (options.detectLandmarks && face.landmarks) {
          ctx.fillStyle = isAligned ? "#10b981" : "rgba(255, 255, 255, 0.6)";
          face.landmarks.forEach((landmark) => {
            ctx.beginPath();
            ctx.arc(landmark.x, landmark.y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }, [
      faces,
      isAligned,
      facingMode,
      showBoundingBox,
      videoRef,
      options.detectLandmarks,
    ]);

    React.useEffect(() => {
      if (!autoStart || status !== "ready") return;
      let mounted = true;

      (async () => {
        try {
          const detector = await loadFaceDetectionModel();
          if (!mounted) return;
          detectorRef.current = detector;
          setIsLoading(false);
          runDetectionLoop();
        } catch (err) {
          console.error("Failed to load face detection model:", err);
          if (mounted) setIsLoading(false);
        }
      })();

      return () => {
        mounted = false;
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      };
    }, [autoStart, status, runDetectionLoop]);

    return (
      <div
        ref={ref}
        data-slot="face-detection"
        className={cn(
          faceDetectionVariants({ showGuide, showBoundingBox, className })
        )}
        {...props}
      >
        {status === "ready" && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={cn(
                "w-full h-full bg-black/10 backdrop-blur-xs",
                "mask-[radial-gradient(ellipse_30%_60%_at_center,transparent_0,transparent_55%,white_75%)]",
                "mask-alpha"
              )}
            />
          </div>
        )}
        {showGuide && status === "ready" && (
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
        )}
        {showBoundingBox && status === "ready" && faces.length > 0 && (
          <canvas ref={canvasRef} className="hidden" />
        )}
        {status === "ready" && (
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
              {guideInstruction ||
                (isAligned
                  ? "Position your face within the oval frame"
                  : "Posisikan wajah anda dalam oval hingga menjadi hijau")}
            </div>
          </div>
        )}
        {showLoadingIndicator && isLoading && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2">
            <div
              className={cn(
                "w-2 h-2 rounded-full bg-white/60",
                !reducedMotion && "animate-pulse"
              )}
              role="status"
              aria-label="Loading face detection"
            />
          </div>
        )}
      </div>
    );
  }
);

FaceDetection.displayName = "FaceDetection";

interface IdCardScannerProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof idCardScannerVariants> {
  documentType?: DocumentType;
  onScanComplete?: (result: IdScanResult) => void;
  onScanError?: (error: Error) => void;
  autoCapture?: boolean;
  autoCaptureDelay?: number;
  showStateIndicator?: boolean;
  guideInstruction?: string;
}

const IdCardScanner = React.forwardRef<HTMLDivElement, IdCardScannerProps>(
  (
    {
      className,
      documentType = "national-id",
      onScanComplete,
      onScanError,
      autoCapture = true,
      autoCaptureDelay = AUTO_CAPTURE_DEBOUNCE_MS,
      showStateIndicator = true,
      guideInstruction,
      ...props
    },
    ref
  ) => {
    const { videoRef, status } = useCameraState();
    const { capture } = useCameraActions();

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const alignmentCheckRef = React.useRef<
      ReturnType<typeof setInterval> | undefined
    >(undefined);
    const autoCaptureTimeoutRef = React.useRef<
      ReturnType<typeof setTimeout> | undefined
    >(undefined);
    const tesseractWorkerRef = React.useRef<TesseractWorker | null>(null);

    const [state, setState] = React.useState<
      "idle" | "scanning" | "processing" | "success" | "error"
    >("idle");
    const [isAligned, setIsAligned] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const reducedMotion = prefersReducedMotion();
    const template = DOCUMENT_TEMPLATES[documentType];

    const detectDocumentEdges = React.useCallback(
      (video: HTMLVideoElement): boolean => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;

        const sampleWidth = 100;
        const sampleHeight = 100;
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        ctx.drawImage(video, 0, 0, sampleWidth, sampleHeight);

        const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        const data = imageData.data;

        let contrastSum = 0;
        for (let i = 0; i < data.length - 4; i += 4) {
          const r1 = data[i];
          const r2 = data[i + 4];
          contrastSum += Math.abs(r1 - r2);
        }

        const avgContrast = contrastSum / (data.length / 4);
        return avgContrast > 15;
      },
      []
    );

    const performOCR = React.useCallback(async (imageBlob: Blob) => {
      try {
        const Tesseract = await loadTesseract();
        if (!tesseractWorkerRef.current) {
          tesseractWorkerRef.current = await Tesseract.createWorker("eng");
        }
        const worker = tesseractWorkerRef.current;
        const { data } = await worker.recognize(imageBlob);
        return data.text;
      } catch (err) {
        console.error("OCR failed:", err);
        throw err;
      }
    }, []);

    const processScan = React.useCallback(async () => {
      setState("processing");

      try {
        const result = capture();
        if (!result) throw new Error("Failed to capture image");

        const text = await performOCR(result.blob);
        const mrzData = template.mrzEnabled ? parseMRZ(text) : null;

        const fields: Record<string, { value: string; confidence: number }> =
          {};
        if (mrzData) {
          fields.document_number = {
            value: mrzData.documentNumber,
            confidence: 0.9,
          };
          fields.name = {
            value: `${mrzData.firstName} ${mrzData.lastName}`,
            confidence: 0.9,
          };
          fields.date_of_birth = {
            value: mrzData.dateOfBirth,
            confidence: 0.9,
          };
          fields.expiry_date = {
            value: mrzData.expirationDate,
            confidence: 0.9,
          };
          fields.nationality = { value: mrzData.nationality, confidence: 0.9 };
        } else {
          const patterns = {
            name: /name[:\s]*([A-Za-z\s]+)/i,
            id_number: /(?:id|number)[:\s]*([A-Z0-9]+)/i,
            date_of_birth: /(?:dob|birth)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/i,
          };
          for (const [field, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match)
              fields[field] = { value: match[1].trim(), confidence: 0.7 };
          }
        }

        const scanResult: IdScanResult = {
          documentType,
          fields,
          rawImage: result.blob,
          croppedImage: result.blob,
          confidence: mrzData ? 0.9 : 0.6,
        };
        setState("success");
        onScanComplete?.(scanResult);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Scan failed");
        setErrorMessage(error.message);
        setState("error");
        onScanError?.(error);
      }
    }, [
      capture,
      performOCR,
      template.mrzEnabled,
      documentType,
      onScanComplete,
      onScanError,
    ]);

    React.useEffect(() => {
      if (status !== "ready" || (state !== "idle" && state !== "scanning"))
        return;
      setState("scanning");

      alignmentCheckRef.current = setInterval(() => {
        const video = videoRef.current;
        if (!video || video.readyState !== 4) return;

        const aligned = detectDocumentEdges(video);
        setIsAligned(aligned);

        if (aligned && autoCapture) {
          if (!autoCaptureTimeoutRef.current) {
            autoCaptureTimeoutRef.current = setTimeout(
              () => processScan(),
              autoCaptureDelay
            );
          }
        } else {
          if (autoCaptureTimeoutRef.current) {
            clearTimeout(autoCaptureTimeoutRef.current);
            autoCaptureTimeoutRef.current = undefined;
          }
        }
      }, DOCUMENT_ALIGNMENT_CHECK_INTERVAL_MS);

      return () => {
        if (alignmentCheckRef.current) clearInterval(alignmentCheckRef.current);
        if (autoCaptureTimeoutRef.current)
          clearTimeout(autoCaptureTimeoutRef.current);
      };
    }, [
      status,
      state,
      videoRef,
      autoCapture,
      autoCaptureDelay,
      detectDocumentEdges,
      processScan,
    ]);

    React.useEffect(() => {
      return () => {
        if (tesseractWorkerRef.current) tesseractWorkerRef.current.terminate();
      };
    }, []);

    return (
      <div
        ref={ref}
        data-slot="id-card-scanner"
        className={cn(idCardScannerVariants({ state, className }))}
        {...props}
      >
        <canvas ref={canvasRef} className="hidden" />
        {status === "ready" &&
          state !== "processing" &&
          state !== "success" &&
          state !== "error" && (
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
          )}
        {status === "ready" && state === "scanning" && (
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
              {guideInstruction ||
                "Posisikan dokumen anda dalam bingkai, ambil jelas dan mudah terbaca"}
            </div>
          </div>
        )}
        {showStateIndicator &&
          (state === "processing" ||
            state === "success" ||
            state === "error") && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <MinimalStateIndicator
                state={state}
                reducedMotion={reducedMotion}
                errorMessage={errorMessage}
              />
            </div>
          )}
        {!autoCapture && state === "scanning" && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <button
              type="button"
              onClick={processScan}
              className={cn(
                "px-5 py-2.5 rounded-full",
                "bg-white/90 text-black",
                "text-sm font-medium",
                "hover:bg-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                "pointer-events-auto",
                "transition-all duration-200"
              )}
            >
              Capture
            </button>
          </div>
        )}
      </div>
    );
  }
);

IdCardScanner.displayName = "IdCardScanner";

function MinimalStateIndicator({
  state,
  reducedMotion,
  errorMessage,
}: {
  state: "processing" | "success" | "error";
  reducedMotion: boolean;
  errorMessage?: string;
}) {
  const stateConfig = {
    processing: {
      icon: IconLoader2,
      color: "bg-white/90 text-black",
      ariaLabel: "Processing document",
    },
    success: {
      icon: IconCheck,
      color: "bg-emerald-500 text-white",
      ariaLabel: "Document captured",
    },
    error: {
      icon: IconAlertCircle,
      color: "bg-red-500 text-white",
      ariaLabel: errorMessage || "Scan failed",
    },
  };
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full",
        "shadow-lg",
        config.color
      )}
      role="status"
      aria-label={config.ariaLabel}
    >
      <Icon
        className={cn(
          "w-5 h-5",
          state === "processing" && !reducedMotion && "animate-spin"
        )}
        aria-hidden="true"
      />
    </div>
  );
}

interface LivenessCheckProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof livenessVariants> {
  challenges?: LivenessChallenge[];
  onComplete?: (result: LivenessResult) => void;
  onChallengeComplete?: (challenge: LivenessChallenge) => void;
  onChallengeFailed?: (challenge: LivenessChallenge) => void;
  autoStart?: boolean;
  showProgress?: boolean;
}

const LivenessCheck = React.forwardRef<HTMLDivElement, LivenessCheckProps>(
  (
    {
      className,
      challenges = DEFAULT_LIVENESS_CHALLENGES,
      onComplete,
      onChallengeComplete,
      onChallengeFailed,
      autoStart = false,
      showProgress = true,
      ...props
    },
    ref
  ) => {
    const { videoRef, status } = useCameraState();
    const startTimeRef = React.useRef<number>(0);
    const challengeTimeoutRef = React.useRef<
      ReturnType<typeof setTimeout> | undefined
    >(undefined);

    const [state, setState] = React.useState<
      "idle" | "active" | "completed" | "failed"
    >("idle");
    const [currentChallengeIndex, setCurrentChallengeIndex] = React.useState(0);
    const [completedChallenges, setCompletedChallenges] = React.useState<
      string[]
    >([]);
    const [failedChallenges, setFailedChallenges] = React.useState<string[]>(
      []
    );

    const reducedMotion = prefersReducedMotion();
    const currentChallenge = challenges[currentChallengeIndex];
    const progress =
      challenges.length > 0
        ? ((completedChallenges.length + failedChallenges.length) /
            challenges.length) *
          100
        : 0;

    const completeCheck = React.useCallback(
      (passed: boolean) => {
        setState(passed ? "completed" : "failed");
        const duration = Date.now() - startTimeRef.current;
        const result: LivenessResult = {
          passed,
          score: completedChallenges.length / challenges.length,
          completedChallenges,
          failedChallenges,
          duration,
        };
        onComplete?.(result);
      },
      [challenges.length, completedChallenges, failedChallenges, onComplete]
    );

    const completeChallenge = React.useCallback(() => {
      if (!currentChallenge) return;
      setCompletedChallenges((prev) => [...prev, currentChallenge.id]);
      onChallengeComplete?.(currentChallenge);
      if (challengeTimeoutRef.current)
        clearTimeout(challengeTimeoutRef.current);
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex((prev) => prev + 1);
      } else {
        setState("completed");
      }
    }, [
      currentChallenge,
      currentChallengeIndex,
      challenges.length,
      onChallengeComplete,
    ]);

    const failChallenge = React.useCallback(() => {
      if (!currentChallenge) return;
      setFailedChallenges((prev) => [...prev, currentChallenge.id]);
      onChallengeFailed?.(currentChallenge);
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex((prev) => prev + 1);
      } else {
        completeCheck(false);
      }
    }, [
      currentChallenge,
      currentChallengeIndex,
      challenges.length,
      onChallengeFailed,
      completeCheck,
    ]);

    const startCheck = React.useCallback(() => {
      if (state !== "idle") return;
      setState("active");
      startTimeRef.current = Date.now();
      setCurrentChallengeIndex(0);
      setCompletedChallenges([]);
      setFailedChallenges([]);
    }, [state]);

    React.useEffect(() => {
      if (state !== "active" || !currentChallenge) return;
      challengeTimeoutRef.current = setTimeout(
        () => failChallenge(),
        currentChallenge.timeout
      );
      return () => {
        if (challengeTimeoutRef.current)
          clearTimeout(challengeTimeoutRef.current);
      };
    }, [state, currentChallenge, failChallenge]);

    React.useEffect(() => {
      if (autoStart && status === "ready" && state === "idle") {
        const video = videoRef.current;
        if (video && video.readyState === 4) {
          requestAnimationFrame(() => startCheck());
        }
      }
    }, [autoStart, status, state, videoRef, startCheck]);

    const ChallengeIcon = currentChallenge
      ? CHALLENGE_ICONS[currentChallenge.type]
      : null;

    return (
      <div
        ref={ref}
        data-slot="liveness-check"
        className={cn(livenessVariants({ state, className }))}
        {...props}
      >
        {showProgress && state === "active" && (
          <div className="absolute top-0 left-0 right-0">
            <div className="h-1 bg-white/20">
              <div
                className={cn(
                  "h-full bg-primary transition-all duration-300",
                  !reducedMotion && "animate-pulse"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {challenges.map((challenge, index) => {
                const isCompleted = completedChallenges.includes(challenge.id);
                const isFailed = failedChallenges.includes(challenge.id);
                const isCurrent = index === currentChallengeIndex;
                return (
                  <div
                    key={challenge.id}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors duration-200",
                      isCompleted && "bg-green-500",
                      isFailed && "bg-red-500",
                      isCurrent && !isCompleted && !isFailed && "bg-primary",
                      !isCompleted && !isFailed && !isCurrent && "bg-white/30"
                    )}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          </div>
        )}
        {state === "active" && (
          <CameraGuide
            variant="face"
            isAligned={false}
            challenge={currentChallenge}
          />
        )}
        {state === "active" && currentChallenge && ChallengeIcon && (
          <div className="absolute top-16 left-0 right-0 flex justify-center">
            <div
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl",
                "bg-black/60 backdrop-blur-sm",
                "text-white"
              )}
            >
              <ChallengeIcon
                className={cn("w-10 h-10", !reducedMotion && "animate-bounce")}
                aria-hidden="true"
              />
              <span className="text-sm font-medium">
                {currentChallenge.description}
              </span>
              <button
                type="button"
                onClick={completeChallenge}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  "bg-primary text-primary-foreground",
                  "text-sm font-medium",
                  "hover:bg-primary/90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "pointer-events-auto"
                )}
              >
                Complete Challenge
              </button>
            </div>
          </div>
        )}
        {state === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={startCheck}
              disabled={status !== "ready"}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-primary text-primary-foreground",
                "font-medium",
                "hover:bg-primary/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none",
                "pointer-events-auto"
              )}
            >
              Start Liveness Check
            </button>
          </div>
        )}
        {state === "completed" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl",
                "bg-green-500/20 backdrop-blur-sm",
                "text-white"
              )}
            >
              <div className="p-3 rounded-full bg-green-500">
                <IconCheck className="w-8 h-8" aria-hidden="true" />
              </div>
              <span className="text-lg font-medium">Liveness Verified</span>
            </div>
          </div>
        )}
        {state === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl",
                "bg-red-500/20 backdrop-blur-sm",
                "text-white"
              )}
            >
              <div className="p-3 rounded-full bg-red-500">
                <IconX className="w-8 h-8" aria-hidden="true" />
              </div>
              <span className="text-lg font-medium">Verification Failed</span>
              <button
                type="button"
                onClick={() => {
                  setState("idle");
                  setCurrentChallengeIndex(0);
                  setCompletedChallenges([]);
                  setFailedChallenges([]);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  "bg-white/20 text-white",
                  "text-sm font-medium",
                  "hover:bg-white/30",
                  "pointer-events-auto"
                )}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        {status !== "ready" && state === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoader2
              className={cn(
                "w-8 h-8 text-white",
                !reducedMotion && "animate-spin"
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );
  }
);

LivenessCheck.displayName = "LivenessCheck";

const KYC_STORAGE_KEY = "kyc-flow-progress";

interface KYCSessionData {
  currentStepIndex: number;
  completedSteps: string[];
  extractedFields: Record<string, { value: string; confidence: number }>;
  livenessScore: number;
  timestamp: number;
}

function saveSession(data: KYCSessionData): void {
  try {
    sessionStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Failed to save KYC session");
  }
}

function loadSession(): KYCSessionData | null {
  try {
    const stored = sessionStorage.getItem(KYC_STORAGE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored) as KYCSessionData;
    if (Date.now() - data.timestamp > 30 * 60 * 1000) {
      sessionStorage.removeItem(KYC_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function clearSession(): void {
  sessionStorage.removeItem(KYC_STORAGE_KEY);
}

const DEFAULT_KYC_STEPS: KYCStep[] = [
  {
    id: "document-front",
    type: "document-front",
    title: "Document Front",
    description: "Capture the front of your ID document",
    documentTypes: ["national-id", "passport", "drivers-license"],
  },
  {
    id: "document-back",
    type: "document-back",
    title: "Document Back",
    description: "Capture the back of your ID document",
    documentTypes: ["national-id", "drivers-license"],
  },
  {
    id: "selfie",
    type: "selfie",
    title: "Selfie",
    description: "Take a photo of yourself",
  },
  {
    id: "liveness",
    type: "liveness",
    title: "Liveness Check",
    description: "Complete the liveness verification",
  },
];

interface KYCFlowProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "children" | "onError">,
    VariantProps<typeof kycFlowVariants> {
  steps?: KYCStep[];
  documentType?: DocumentType;
  onComplete?: (result: KYCResult) => void;
  onStepChange?: (step: KYCStep, index: number) => void;
  onError?: (error: CameraError) => void;
  enablePersistence?: boolean;
  allowSkip?: boolean;
  showStepIndicator?: boolean;
  showNavigation?: boolean;
}

const KYCFlow = React.forwardRef<HTMLDivElement, KYCFlowProps>(
  (
    {
      className,
      size,
      steps = DEFAULT_KYC_STEPS,
      documentType = "national-id",
      onComplete,
      onStepChange,
      onError,
      enablePersistence = true,
      allowSkip = false,
      showStepIndicator = true,
      showNavigation = true,
      ...props
    },
    ref
  ) => {
    const reducedMotion = prefersReducedMotion();

    const [currentStepIndex, setCurrentStepIndex] = React.useState(() => {
      if (enablePersistence) {
        const session = loadSession();
        return session?.currentStepIndex ?? 0;
      }
      return 0;
    });

    const [completedSteps, setCompletedSteps] = React.useState<string[]>(() => {
      if (enablePersistence) {
        const session = loadSession();
        return session?.completedSteps ?? [];
      }
      return [];
    });

    const [documentFront, setDocumentFront] = React.useState<Blob | null>(null);
    const [documentBack, setDocumentBack] = React.useState<Blob | null>(null);
    const [selfie, setSelfie] = React.useState<Blob | null>(null);
    const [extractedFields, setExtractedFields] = React.useState<
      Record<string, { value: string; confidence: number }>
    >({});
    const [livenessScore, setLivenessScore] = React.useState(0);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const isFirstStep = currentStepIndex === 0;

    const filteredSteps = React.useMemo(() => {
      return steps.filter((step) => {
        if (step.type === "document-back" && documentType === "passport")
          return false;
        return true;
      });
    }, [steps, documentType]);

    React.useEffect(() => {
      if (!enablePersistence) return;
      saveSession({
        currentStepIndex,
        completedSteps,
        extractedFields,
        livenessScore,
        timestamp: Date.now(),
      });
    }, [
      enablePersistence,
      currentStepIndex,
      completedSteps,
      extractedFields,
      livenessScore,
    ]);

    React.useEffect(() => {
      if (currentStep) onStepChange?.(currentStep, currentStepIndex);
    }, [currentStep, currentStepIndex, onStepChange]);

    const completeStep = React.useCallback(
      (stepId: string) => {
        setCompletedSteps((prev) => [...prev, stepId]);
        if (isLastStep) {
          const result: KYCResult = {
            documentFront: documentFront ?? undefined,
            documentBack: documentBack ?? undefined,
            extractedFields,
            selfie: selfie ?? undefined,
            livenessScore,
            completedAt: Date.now(),
          };
          if (enablePersistence) clearSession();
          onComplete?.(result);
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      },
      [
        isLastStep,
        documentFront,
        documentBack,
        extractedFields,
        selfie,
        livenessScore,
        enablePersistence,
        onComplete,
      ]
    );

    const handleDocumentScan = React.useCallback(
      (result: IdScanResult, stepType: "document-front" | "document-back") => {
        setIsProcessing(true);
        if (stepType === "document-front") setDocumentFront(result.rawImage);
        else setDocumentBack(result.rawImage);
        setExtractedFields((prev) => ({ ...prev, ...result.fields }));
        setIsProcessing(false);
        completeStep(currentStep.id);
      },
      [currentStep, completeStep]
    );

    const handleSelfieCaptureResult = React.useCallback(
      (result: CaptureResult) => {
        if (currentStep?.type === "selfie") {
          setSelfie(result.blob);
          completeStep(currentStep.id);
        }
      },
      [currentStep, completeStep]
    );

    const handleLivenessComplete = React.useCallback(
      (result: LivenessResult) => {
        setLivenessScore(result.score);
        if (result.passed) completeStep(currentStep.id);
      },
      [currentStep, completeStep]
    );

    const handlePrevious = React.useCallback(() => {
      if (!isFirstStep) setCurrentStepIndex((prev) => prev - 1);
    }, [isFirstStep]);

    const handleSkip = React.useCallback(() => {
      if (allowSkip && !isLastStep) setCurrentStepIndex((prev) => prev + 1);
    }, [allowSkip, isLastStep]);

    const renderStepContent = () => {
      if (!currentStep) return null;
      const cameraMode =
        currentStep.type === "selfie" || currentStep.type === "liveness"
          ? "face-detection"
          : "id-scanner";
      const facingMode =
        cameraMode === "face-detection" ? "user" : "environment";

      return (
        <Camera
          mode={cameraMode}
          facingMode={facingMode}
          onError={onError}
          onCapture={
            currentStep.type === "selfie"
              ? handleSelfieCaptureResult
              : undefined
          }
          className="rounded-lg overflow-hidden"
        >
          <CameraPreview mirror={facingMode === "user"} />
          <CameraOverlay>
            {(currentStep.type === "document-front" ||
              currentStep.type === "document-back") && (
              <IdCardScanner
                documentType={documentType}
                onScanComplete={(result) =>
                  handleDocumentScan(
                    result,
                    currentStep.type as "document-front" | "document-back"
                  )
                }
                onScanError={(err) =>
                  onError?.({
                    code: "OCR_FAILED",
                    message: err.message,
                    recoverable: true,
                  })
                }
              />
            )}
            {currentStep.type === "selfie" && (
              <>
                <FaceDetection showGuide showBoundingBox={false} />
                <CameraGuide
                  variant="face"
                  instruction="Position your face in the center"
                />
              </>
            )}
            {currentStep.type === "liveness" && (
              <LivenessCheck onComplete={handleLivenessComplete} autoStart />
            )}
          </CameraOverlay>
          {currentStep.type === "selfie" && (
            <CameraControls
              showCapture
              showRecord={false}
              showSwitch={false}
              showFlash={false}
            />
          )}
        </Camera>
      );
    };

    return (
      <div
        ref={ref}
        data-slot="kyc-flow"
        className={cn(kycFlowVariants({ size, className }))}
        role="region"
        aria-label="KYC verification flow"
        {...props}
      >
        {showStepIndicator && (
          <StepIndicator
            steps={filteredSteps}
            currentIndex={currentStepIndex}
            completedSteps={completedSteps}
            reducedMotion={reducedMotion}
          />
        )}
        {currentStep && (
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold">{currentStep.title}</h2>
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
            <span className="sr-only">
              {getProgressDescription(
                currentStepIndex + 1,
                filteredSteps.length,
                currentStep.title
              )}
            </span>
          </div>
        )}
        <div className="relative aspect-4/3 bg-black rounded-lg overflow-hidden">
          {renderStepContent()}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <div className="flex flex-col items-center gap-3 text-white">
                <IconLoader2
                  className={cn("w-10 h-10", !reducedMotion && "animate-spin")}
                  aria-hidden="true"
                />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>
        {showNavigation && (
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "text-sm font-medium",
                "border border-input bg-background",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              <IconArrowLeft className="w-4 h-4" aria-hidden="true" />
              Previous
            </button>
            {allowSkip && !isLastStep && (
              <button
                type="button"
                onClick={handleSkip}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  "text-sm font-medium text-muted-foreground",
                  "hover:text-foreground"
                )}
              >
                Skip
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

KYCFlow.displayName = "KYCFlow";

function StepIndicator({
  steps,
  currentIndex,
  completedSteps,
  reducedMotion,
}: {
  steps: KYCStep[];
  currentIndex: number;
  completedSteps: string[];
  reducedMotion: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = index === currentIndex;
        const isPending = !isCompleted && !isCurrent;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "text-sm font-medium transition-colors duration-200",
                isCompleted && "bg-green-500 text-white",
                isCurrent &&
                  !reducedMotion &&
                  "bg-primary text-primary-foreground animate-pulse",
                isCurrent &&
                  reducedMotion &&
                  "bg-primary text-primary-foreground",
                isPending && "bg-muted text-muted-foreground"
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? (
                <IconCheck className="w-4 h-4" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  isCompleted ? "bg-green-500" : "bg-muted"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

/* eslint-disable react-refresh/only-export-components */

export {
  FaceDetection,
  IdCardScanner,
  LivenessCheck,
  KYCFlow,
  // Variants
  faceDetectionVariants,
  idCardScannerVariants,
  livenessVariants,
  kycFlowVariants,
  // Utilities
  parseMRZ,
  // Constants
  DEFAULT_KYC_STEPS,
};

export type {
  FaceDetectionProps,
  IdCardScannerProps,
  LivenessCheckProps,
  KYCFlowProps,
};
