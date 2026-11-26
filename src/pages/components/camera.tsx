import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconCamera,
  IconScan,
  IconAdjustments,
  IconPhoto,
  IconKeyboard,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  KiraCamera,
  CameraPreview,
  CameraOverlay,
  CameraCaptureFlash,
  CameraPermissions,
  CameraControls,
  CameraControlBar,
  CameraControlBarGroup,
  CameraControlBarDivider,
  CameraButton,
  CaptureButton,
  RecordButton,
  FlashButton,
  SwitchCameraButton,
  TimerButton,
  GridButton,
  ZoomButton,
  CameraGrid,
  CameraTimer,
  CameraFocusIndicator,
  CameraZoomIndicator,
  CameraSettings,
  CameraKeyboardHelp,
  CameraVoiceControl,
  useCameraContext,
  CAMERA_DEFAULT_SETTINGS,
  type CameraRef,
  type CameraSettingsValues,
  type CameraGridType,
  type CameraScanOverlayPreset,
  type CameraReviewCapture,
  CameraScanOverlay,
  CameraGuide,
} from "@/components/ui/camera";
import { KiraSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";
import type { CameraStatus, CaptureResult } from "@/lib/camera/types";
import type { GuidePreset } from "@/lib/camera/guide-presets";

function useCapturePreview() {
  const [capture, setCapture] = React.useState<CaptureResult | null>(null);
  React.useEffect(
    () => () => {
      if (capture) URL.revokeObjectURL(capture.url);
    },
    [capture],
  );

  return { capture, setCapture };
}

function CapturePreview({
  capture,
  onClear,
}: {
  capture: CaptureResult | null;
  onClear: () => void;
}) {
  if (!capture) return null;

  return (
    <div className="space-y-2">
      <img
        src={capture.url}
        alt="Camera capture"
        className="max-h-48 w-full rounded-md border object-contain"
      />
      <p className="text-xs tabular-nums text-muted-foreground">
        {capture.width} × {capture.height} · {capture.type}
      </p>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear preview
      </Button>
    </div>
  );
}

function BasicDemo() {
  const { capture, setCapture } = useCapturePreview();
  const cameraRef = React.useRef<CameraRef>(null);
  const [status, setStatus] = React.useState<CameraStatus>("idle");

  return (
    <div className="w-full max-w-md space-y-3">
      <Camera
        ref={cameraRef}
        mode="photo"
        autoStart={false}
        enableKeyboardShortcuts
        className="w-full"
        onCapture={setCapture}
        onStatusChange={setStatus}
      >
        <CameraPreview showSkeleton={false} />
        <CameraPermissions variant="overlay" />
        <CameraCaptureFlash />
        <CameraControls showRecord={false} />
      </Camera>
      <Button
        variant="outline"
        size="sm"
        disabled={status === "idle"}
        onClick={() => {
          void cameraRef.current?.stop();
        }}
      >
        Stop camera
      </Button>
      <CapturePreview capture={capture} onClear={() => setCapture(null)} />
    </div>
  );
}

const basicCode = `import { useEffect, useRef, useState } from "react";
import { Camera, CameraPreview, CameraPermissions, CameraCaptureFlash, CameraControls, type CameraRef } from "@/components/ui/camera";
import { Button } from "@/components/ui/button";
import type { CaptureResult } from "@/lib/camera/types";

export function BasicDemo() {
  const cameraRef = useRef<CameraRef>(null);
  const [capture, setCapture] = useState<CaptureResult | null>(null);
  useEffect(() => () => { if (capture) URL.revokeObjectURL(capture.url); }, [capture]);
  return (
    <div className="space-y-3">
      <Camera ref={cameraRef} mode="photo" autoStart={false} enableKeyboardShortcuts className="w-full" onCapture={setCapture}>
        <CameraPreview showSkeleton={false} />
        <CameraPermissions variant="overlay" />
        <CameraCaptureFlash />
        <CameraControls showRecord={false} />
      </Camera>
      <Button variant="outline" onClick={() => { void cameraRef.current?.stop(); }}>Stop camera</Button>
      {capture && <img src={capture.url} alt="Captured photo" />}
    </div>
  );
}`;

function ReviewDemo() {
  const [accepted, setAccepted] = React.useState<Blob | null>(null);

  return (
    <div className="w-full max-w-lg space-y-3">
      <KiraCamera
        label="Delivery inspection photo"
        description="Photograph the parcel label or choose an existing image, then review it."
        guidePreset="landscape-4x3"
        onAccept={(capture) => setAccepted(capture.blob)}
        successMessage="Image retained in this session."
      />
      {accepted && (
        <p className="text-xs text-muted-foreground">
          The caller now holds a {Math.round(accepted.size / 1024)} KB image in
          memory.
        </p>
      )}
    </div>
  );
}

const reviewCode = `import { useState } from "react";
import { KiraCamera } from "@/components/ui/camera";

export function ReviewDemo() {
  const [accepted, setAccepted] = useState<Blob | null>(null);
  return (
    <div>
      <KiraCamera
        label="Delivery inspection photo"
        description="Photograph the parcel label or choose an existing image, then review it."
        guidePreset="landscape-4x3"
        onAccept={capture => setAccepted(capture.blob)}
        successMessage="Image retained in this session."
      />
      {accepted && <p>Image retained in memory: {accepted.size} bytes.</p>}
    </div>
  );
}`;

function createImageFixture(): CameraReviewCapture {
  const svg =
    // kira-kit-ignore raw-colors: standalone SVG data URI fixture cannot inherit CSS custom properties
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="#f1f5f9"/><rect x="120" y="100" width="400" height="280" rx="8" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/><rect x="210" y="170" width="220" height="120" rx="4" fill="#ffffff"/><text x="320" y="221" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#0f172a">Parcel 1042</text><text x="320" y="255" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#475569">Illustrative image fixture</text></svg>';

  return {
    blob: new Blob([svg], { type: "image/svg+xml" }),
    url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg),
    type: "image/svg+xml",
    source: "file",
    fileName: "parcel-fixture.svg",
    timestamp: 0,
    width: 640,
    height: 480,
  };
}

function waitForAcceptanceFixture(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException("Acceptance cancelled", "AbortError"));
    };

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, 1500);

    if (signal.aborted) {
      cancel();

      return;
    }

    signal.addEventListener("abort", cancel, { once: true });
  });
}

function AcceptanceDemo() {
  const [fixture] = React.useState(createImageFixture);
  const [failNext, setFailNext] = React.useState(true);
  const [accepted, setAccepted] = React.useState<Blob | null>(null);

  return (
    <div className="w-full max-w-lg space-y-4">
      <Switch
        label="Fixture: fail the next acceptance"
        checked={failNext}
        onCheckedChange={setFailNext}
      />
      <p className="text-xs text-muted-foreground">
        The sample image and 1.5-second delay are fixtures. Successful
        acceptance retains the Blob locally. Cancel and retry preserve the
        reviewed image.
      </p>
      <KiraCamera
        defaultCapture={fixture}
        label="Parcel photo fixture"
        onAccept={async (capture, signal) => {
          await waitForAcceptanceFixture(signal);

          if (failNext) {
            setFailNext(false);
            throw new Error(
              "Fixture: the image could not be retained. Retry or retake it.",
            );
          }

          setAccepted(capture.blob);
        }}
        successMessage="Image retained in this session."
      />
      {accepted && (
        <p className="text-xs text-muted-foreground">
          Caller-owned image: {accepted.size} bytes.
        </p>
      )}
    </div>
  );
}

const acceptanceCode = `import { useState } from "react";
import { KiraCamera } from "@/components/ui/camera";

function wait(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cancel = () => { clearTimeout(timer); reject(new DOMException("Acceptance cancelled", "AbortError")); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", cancel); resolve(); }, 1500);
    if (signal.aborted) { cancel(); return; }
    signal.addEventListener("abort", cancel, { once: true });
  });
}

export function AcceptanceDemo() {
  const [failNext, setFailNext] = useState(true);
  const [accepted, setAccepted] = useState<Blob | null>(null);
  return (
    <div>
      <KiraCamera label="Inspection photo" successMessage="Image retained in this session."
        onAccept={async (capture, signal) => {
          await wait(signal); // Illustrative delay fixture.
          if (failNext) {
            setFailNext(false);
            throw new Error("Fixture: acceptance failed. Retry.");
          }
          setAccepted(capture.blob);
        }}
      />
      {accepted && <p>Caller-owned image: {accepted.size} bytes.</p>}
    </div>
  );
}`;

function SharedCameraTools({
  onRecording,
}: {
  onRecording: (blob: Blob) => void;
}) {
  const camera = useCameraContext();
  const [grid, setGrid] = React.useState<CameraGridType>("none");
  const ready = camera.status === "ready" || camera.status === "capturing";

  const changeTimer = (duration: number) => {
    if (duration === 0 || duration === 3 || duration === 5 || duration === 10)
      camera.setTimerDuration(duration);
  };

  const record = async () => {
    if (camera.isRecording) {
      const blob = await camera.stopRecording();

      if (blob) onRecording(blob);
    } else camera.startRecording();
  };

  return (
    <>
      <CameraOverlay>
        <CameraGrid type={grid} />
      </CameraOverlay>
      <CameraTimer
        duration={camera.timerDuration}
        remaining={camera.timerRemaining}
        isActive={camera.isTimerActive}
      />
      <CameraFocusIndicator
        point={camera.focusPoint}
        isActive={camera.isFocusing}
        indicatorStyle="bracket"
      />
      <CameraZoomIndicator
        zoom={camera.zoom}
        minZoom={camera.minZoom}
        maxZoom={camera.maxZoom}
        position="top-right"
      />
      {ready && (
        <>
          <SharedCameraToolsControlsSection
            grid={grid}
            setGrid={setGrid}
            camera={camera}
            changeTimer={changeTimer}
          />
          <SharedCameraToolsControlsSection2 camera={camera} record={record} />
          {camera.isTimerActive && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 bottom-20"
              onClick={camera.cancelTimer}
            >
              Cancel timer
            </Button>
          )}
          {camera.isRecording && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 bottom-20"
              onClick={
                camera.isPaused ? camera.resumeRecording : camera.pauseRecording
              }
            >
              {camera.isPaused ? "Resume recording" : "Pause recording"}
            </Button>
          )}
        </>
      )}
    </>
  );
}

/* oxlint-disable anti-slop/no-shape-in-symbol-names -- These public shape props select geometric outlines, not data structures. */
function ControlsDemo() {
  const { capture, setCapture } = useCapturePreview();

  const [recording, setRecording] = React.useState<{
    blob: Blob;
    url: string;
  } | null>(null);

  const [helpOpen, setHelpOpen] = React.useState(false);
  const cameraRef = React.useRef<CameraRef>(null);
  React.useEffect(
    () => () => {
      if (recording) URL.revokeObjectURL(recording.url);
    },
    [recording],
  );

  return (
    <div className="w-full max-w-lg space-y-3">
      <ControlsControlsSection
        cameraRef={cameraRef}
        setCapture={setCapture}
        setRecording={setRecording}
      />
      <ControlsControlsSection2
        cameraRef={cameraRef}
        setHelpOpen={setHelpOpen}
      />
      <CameraKeyboardHelp open={helpOpen} onOpenChange={setHelpOpen} />
      <p className="text-xs text-muted-foreground">
        One controller powers capture, digital zoom, recording, timer and
        gestures. Video recording captures the camera track; photo zoom crops
        the capture. Use the buttons as pointer/keyboard alternatives to
        gestures.
      </p>
      <CapturePreview capture={capture} onClear={() => setCapture(null)} />
      {recording && (
        <div className="space-y-2">
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Camera recordings contain only the video track; microphone audio is never acquired. */}
          <video
            src={recording.url}
            controls
            className="w-full rounded-md border"
            aria-label="Recorded camera video"
          />
          <p className="text-xs text-muted-foreground">
            {recording.blob.type} · {Math.round(recording.blob.size / 1024)} KB
          </p>
        </div>
      )}
    </div>
  );
}
/* oxlint-enable anti-slop/no-shape-in-symbol-names */

const controlsCode = `import { Camera, CameraPreview, CameraPermissions, CameraControlBar, CameraControlBarGroup, CameraTimer, CaptureButton, RecordButton, TimerButton, ZoomButton, useCameraContext } from "@/components/ui/camera";
import { Button } from "@/components/ui/button";

function Controls() {
  const camera = useCameraContext();
  const ready = camera.status === "ready" || camera.status === "capturing";
  const record = async () => {
    if (camera.isRecording) {
      const blob = await camera.stopRecording();
      if (blob) console.info("Recorded MIME:", blob.type);
    } else camera.startRecording();
  };
  return (
    <>
      <CameraTimer duration={camera.timerDuration} remaining={camera.timerRemaining} isActive={camera.isTimerActive} />
      {ready && <CameraControlBar position="top"><CameraControlBarGroup>
        <TimerButton duration={camera.timerDuration} onDurationChange={duration => {
          if (duration === 0 || duration === 3 || duration === 5 || duration === 10) camera.setTimerDuration(duration);
        }} />
        <ZoomButton zoomAction="in" onZoom={delta => camera.zoomIn(delta)} />
      </CameraControlBarGroup></CameraControlBar>}
      {ready && <CameraControlBar position="bottom"><CameraControlBarGroup>
        <CaptureButton disabled={camera.isRecording || camera.isTimerActive} onClick={camera.startTimer} />
        <RecordButton isRecording={camera.isRecording} onClick={() => { void record(); }} />
      </CameraControlBarGroup></CameraControlBar>}
      {camera.isTimerActive && <Button variant="secondary" className="absolute left-4 bottom-20" onClick={camera.cancelTimer}>Cancel timer</Button>}
    </>
  );
}

export function ControlsDemo() {
  return (
    <Camera mode="video" autoStart={false} enableGestures enableKeyboardShortcuts className="w-full">
      <CameraPreview showSkeleton={false} />
      <CameraPermissions variant="overlay" />
      <Controls />
    </Camera>
  );
}`;

function SettingsDemo() {
  const [values, setValues] = React.useState<CameraSettingsValues>(
    CAMERA_DEFAULT_SETTINGS,
  );

  const [open, setOpen] = React.useState(true);

  return (
    <div className="w-full max-w-lg space-y-3">
      {!open && (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open settings
        </Button>
      )}
      <CameraSettings
        variant="panel"
        open={open}
        onOpenChange={setOpen}
        values={values}
        onValuesChange={setValues}
      />
      <p className="text-xs text-muted-foreground">
        Caller-owned settings: {values.format}, {values.aspectRatio}, timer{" "}
        {values.timer}s. Pass the chosen format, constraints and accessibility
        options to your camera.
      </p>
    </div>
  );
}

const settingsCode = `import { useState } from "react";
import { CameraSettings, CAMERA_DEFAULT_SETTINGS, type CameraSettingsValues } from "@/components/ui/camera";
import { Button } from "@/components/ui/button";

export function SettingsDemo() {
  const [values, setValues] = useState<CameraSettingsValues>(CAMERA_DEFAULT_SETTINGS);
  const [open, setOpen] = useState(true);
  return (
    <div>
      {!open && <Button onClick={() => setOpen(true)}>Open settings</Button>}
      <CameraSettings variant="panel" open={open} onOpenChange={setOpen} values={values} onValuesChange={setValues} />
    </div>
  );
}`;

function VoiceDemo() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Camera
        mode="photo"
        autoStart={false}
        enableVoiceControl
        className="w-full"
      >
        <CameraPreview showSkeleton={false} />
        <CameraPermissions variant="overlay" />
        <CameraControls />
        <CameraVoiceControl enabled position="top-left" />
      </Camera>
      <p className="text-xs text-muted-foreground">
        Start the camera, then press Voice control. Speech recognition support
        and microphone permission depend on the browser. Camera buttons remain
        available.
      </p>
    </div>
  );
}

const voiceCode = `import { Camera, CameraPreview, CameraPermissions, CameraControls, CameraVoiceControl } from "@/components/ui/camera";

export function VoiceDemo() {
  return (
    <Camera mode="photo" autoStart={false} enableVoiceControl className="w-full">
      <CameraPreview showSkeleton={false} />
      <CameraPermissions variant="overlay" />
      <CameraControls />
      <CameraVoiceControl enabled position="top-left" />
    </Camera>
  );
}`;

function OverlaysDemo() {
  const [preset, setPreset] =
    React.useState<CameraScanOverlayPreset>("id-card-scanner");

  const [status, setStatus] = React.useState<
    "idle" | "scanning" | "aligned" | "processing" | "success" | "error"
  >("idle");

  const id = React.useId();

  return (
    <div className="w-full max-w-lg space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={id + "-preset"} className="block text-xs font-medium">
            Overlay preset
          </label>
          <KiraSelect
            id={id + "-preset"}
            value={preset}
            options={["id-card-scanner", "face-recognition", "none"]}
            onChange={(next) => {
              if (
                next === "id-card-scanner" ||
                next === "face-recognition" ||
                next === "none"
              )
                setPreset(next);
            }}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={id + "-status"} className="block text-xs font-medium">
            Status fixture
          </label>
          <KiraSelect
            id={id + "-status"}
            value={status}
            options={[
              "idle",
              "scanning",
              "aligned",
              "processing",
              "success",
              "error",
            ]}
            onChange={(next) => {
              if (
                next === "idle" ||
                next === "scanning" ||
                next === "aligned" ||
                next === "processing" ||
                next === "success" ||
                next === "error"
              )
                setStatus(next);
            }}
          />
        </div>
      </div>
      <Camera autoStart={false} announceStatus={false} className="w-full">
        <CameraScanOverlay
          preset={preset}
          status={status}
          isAligned={status === "aligned"}
          isScanning={status === "scanning"}
          isProcessing={status === "processing"}
          statusText={"Overlay fixture: " + status}
        />
      </Camera>
      <p className="text-xs text-muted-foreground">
        Visual status fixtures illustrate positioning and motion. This overlay
        performs no recognition or automatic alignment.
      </p>
    </div>
  );
}

const overlaysCode = `import { Camera, CameraScanOverlay } from "@/components/ui/camera";

export function OverlaysDemo() {
  return (
    <Camera autoStart={false} announceStatus={false} className="w-full">
      <CameraScanOverlay
        preset="id-card-scanner"
        status="idle"
        isScanning={false}
        documentAspectRatio={1.586}
        statusText="Overlay fixture: position in frame"
      />
    </Camera>
  );
}`;

const GUIDE_PRESETS: GuidePreset[] = [
  "face-oval",
  "id-front",
  "passport",
  "receipt",
  "qr-code",
  "wide-16x9",
];

function GuidesDemo() {
  const [preset, setPreset] = React.useState<GuidePreset>("id-front");
  const id = React.useId();

  return (
    <div className="w-full max-w-lg space-y-3">
      <label htmlFor={id} className="block text-sm font-medium">
        Framing guide
      </label>
      <KiraSelect
        id={id}
        value={preset}
        options={GUIDE_PRESETS}
        onChange={(next) => {
          const selected = GUIDE_PRESETS.find((item) => item === next);

          if (selected) setPreset(selected);
        }}
      />
      <Camera autoStart={false} announceStatus={false} className="w-full">
        <CameraGuide
          preset={preset}
          showAlignmentIndicator={false}
          config={{ animation: "none", fillColor: "transparent" }}
        />
      </Camera>
      <p className="text-xs text-muted-foreground">
        Static framing aids for documents, photos and codes. QR and barcode
        guides do not decode codes.
      </p>
    </div>
  );
}

const guidesCode = `import { Camera, CameraGuide } from "@/components/ui/camera";

export function GuidesDemo() {
  return (
    <Camera autoStart={false} announceStatus={false} className="w-full">
      <CameraGuide preset="id-front" showAlignmentIndicator={false} config={{ animation: "none", fillColor: "transparent" }} />
    </Camera>
  );
}`;

function KiraDemo() {
  const [accepted, setAccepted] = React.useState<Blob | null>(null);

  return (
    <div className="w-full max-w-lg space-y-3">
      <KiraCamera
        label="Warranty claim photo"
        description="Capture the product serial label or choose a photo, then review it before adding it."
        guidePreset="id-front"
        acceptLabel="Add claim photo"
        successMessage="Claim photo retained in this session."
        onAccept={(capture) => setAccepted(capture.blob)}
      />
      {accepted && (
        <p className="text-xs text-muted-foreground">
          The claim owns the image Blob. Connect onAccept to your save API when
          needed.
        </p>
      )}
    </div>
  );
}

const kiraCode = `import { useState } from "react";
import { KiraCamera } from "@/components/ui/camera";

export function KiraDemo() {
  const [accepted, setAccepted] = useState<Blob | null>(null);
  return (
    <div>
      <KiraCamera
        label="Warranty claim photo"
        description="Capture the product serial label or choose a photo, then review it before adding it."
        guidePreset="id-front"
        acceptLabel="Add claim photo"
        successMessage="Claim photo retained in this session."
        onAccept={capture => setAccepted(capture.blob)}
      />
      {accepted && <p>The claim owns the image Blob.</p>}
    </div>
  );
}`;

function StressDemo() {
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2">
      <div className="w-full max-w-xs space-y-3">
        <p className="text-sm font-medium">Empty and disabled</p>
        <KiraCamera
          label="International returns inspection photo with a long workflow label"
          description="The empty state explains how to begin."
          disabled
          disabledReason="Only an assigned reviewer can add evidence."
          onAccept={() => {}}
        />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Control state fixtures</p>
        <div className="flex flex-wrap items-center gap-3">
          <CameraButton
            icon={<IconCamera aria-hidden="true" />}
            label="Capture"
            showLabel
            hapticPattern="none"
          />
          <CameraButton
            icon={<IconCamera aria-hidden="true" />}
            label="Selected fixture"
            showLabel
            isActive
            hapticPattern="none"
          />
          <CameraButton
            icon={<IconCamera aria-hidden="true" />}
            label="Preparing fixture"
            showLabel
            isLoading
            hapticPattern="none"
          />
          <CameraButton
            icon={<IconCamera aria-hidden="true" />}
            label="Disabled fixture"
            showLabel
            disabled
            hapticPattern="none"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Visual button fixtures. The Acceptance tab supplies real pending,
          cancel, error/retry and confirmed local success.
        </p>
      </div>
    </div>
  );
}

const stressCode = `import { KiraCamera, CameraButton } from "@/components/ui/camera";
import { IconCamera } from "@tabler/icons-react";

// Long workflow labels, empty/disabled states, and control fixtures in a max-w-xs column
export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraCamera
        label="International returns inspection photo with a long workflow label"
        description="The empty state explains how to begin."
        disabled
        disabledReason="Only an assigned reviewer can add evidence."
        onAccept={() => {}}
      />
      <CameraButton icon={<IconCamera aria-hidden="true" />} label="Preparing fixture" showLabel isLoading hapticPattern="none" />
      <CameraButton icon={<IconCamera aria-hidden="true" />} label="Disabled fixture" showLabel disabled hapticPattern="none" />
    </div>
  );
}`;

function SharedCameraToolsControlsSection({
  grid,
  setGrid,
  camera,
  changeTimer,
}: {
  grid: CameraGridType;
  setGrid: React.Dispatch<React.SetStateAction<CameraGridType>>;
  camera: ReturnType<typeof useCameraContext>;
  changeTimer: (duration: number) => void;
}) {
  return (
    <CameraControlBar position="top">
      <CameraControlBarGroup>
        <GridButton size="sm" gridType={grid} onGridChange={setGrid} />
        <TimerButton
          size="sm"
          duration={camera.timerDuration}
          onDurationChange={changeTimer}
        />
        <ZoomButton
          size="sm"
          zoomAction="out"
          onZoom={(delta) => camera.zoomOut(-delta)}
          disabled={camera.zoom <= camera.minZoom}
        />
        <ZoomButton
          size="sm"
          zoomAction="in"
          onZoom={(delta) => camera.zoomIn(delta)}
          disabled={camera.zoom >= camera.maxZoom}
        />
        <ZoomButton
          size="sm"
          zoomAction="reset"
          onZoom={() => camera.resetZoom()}
        />
      </CameraControlBarGroup>
    </CameraControlBar>
  );
}

function SharedCameraToolsControlsSection2({
  camera,
  record,
}: {
  camera: ReturnType<typeof useCameraContext>;
  record: () => Promise<void>;
}) {
  return (
    <CameraControlBar position="bottom">
      <CameraControlBarGroup>
        <FlashButton
          size="sm"
          isEnabled={camera.isFlashOn}
          isSupported={camera.isFlashSupported}
          onClick={() => {
            void camera.toggleFlash();
          }}
        />
        <SwitchCameraButton
          size="sm"
          disabled={camera.devices.length < 2 || camera.isRecording}
          onClick={() => {
            void camera.switchCamera();
          }}
        />
        <CameraControlBarDivider />
        <CaptureButton
          size="sm"
          disabled={camera.isRecording || camera.isTimerActive}
          onClick={camera.startTimer}
        />
        <RecordButton
          size="sm"
          isRecording={camera.isRecording}
          onClick={() => {
            void record();
          }}
        />
      </CameraControlBarGroup>
    </CameraControlBar>
  );
}

function ControlsControlsSection({
  cameraRef,
  setCapture,
  setRecording,
}: {
  cameraRef: React.RefObject<CameraRef | null>;
  setCapture: React.Dispatch<React.SetStateAction<CaptureResult | null>>;
  setRecording: React.Dispatch<
    React.SetStateAction<{ blob: Blob; url: string } | null>
  >;
}) {
  return (
    <Camera
      ref={cameraRef}
      mode="video"
      className="w-full"
      autoStart={false}
      enableGestures
      enableKeyboardShortcuts
      onCapture={setCapture}
    >
      <CameraPreview showSkeleton={false} />
      <CameraPermissions variant="overlay" />
      <CameraCaptureFlash />
      <SharedCameraTools
        onRecording={(blob) =>
          setRecording({ blob, url: URL.createObjectURL(blob) })
        }
      />
    </Camera>
  );
}

function ControlsControlsSection2({
  cameraRef,
  setHelpOpen,
}: {
  cameraRef: React.RefObject<CameraRef | null>;
  setHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          void cameraRef.current?.stop();
        }}
      >
        Stop camera
      </Button>
      {/* oxlint-disable anti-slop/no-shape-in-symbol-names -- CameraButton's public shape prop selects geometric styling. */}
      <CameraButton
        size="sm"
        variant="secondary"
        shape="rounded"
        icon={<IconKeyboard aria-hidden="true" />}
        label="Keyboard help"
        showLabel
        labelPosition="right"
        action="settings"
        onClick={() => setHelpOpen(true)}
      />
      {/* oxlint-enable anti-slop/no-shape-in-symbol-names */}
    </div>
  );
}

const partsCode = `import { useState } from "react";
import { IconKeyboard } from "@tabler/icons-react";
import {
  Camera, CameraPreview, CameraOverlay, CameraCaptureFlash, CameraButton,
  CaptureButton, RecordButton, FlashButton, SwitchCameraButton, TimerButton,
  GridButton, SettingsButton, AspectRatioButton, ZoomButton,
  CameraControls, CameraControlBar, CameraControlBarGroup, CameraControlBarDivider,
  CameraGuide, CameraGrid, CameraScanOverlay, CameraTimer, CameraPermissions,
  CameraSettings, CameraKeyboardHelp, CameraStatusAnnouncer,
  CameraFocusIndicator, CameraZoomIndicator, CameraVoiceControl, CameraErrorBoundary,
  useCameraContext, CAMERA_DEFAULT_SETTINGS,
  type CameraSettingsValues, type CameraGridType, type CameraAspectRatio,
} from "@/components/ui/camera";

function CameraParts() {
  const camera = useCameraContext();
  const [grid, setGrid] = useState<CameraGridType>("none");
  const [ratio, setRatio] = useState<CameraAspectRatio>("4:3");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settings, setSettings] = useState<CameraSettingsValues>(CAMERA_DEFAULT_SETTINGS);
  return (
    <>
      <CameraPreview showSkeleton={false} />
      <CameraPermissions variant="overlay" />
      <CameraOverlay><CameraGrid type={grid} /><CameraCaptureFlash /></CameraOverlay>
      <CameraGuide preset="id-front" showInstruction={false} showAlignmentIndicator={false} />
      <CameraScanOverlay preset="none" isScanning={false} />
      <CameraFocusIndicator point={camera.focusPoint} isActive={camera.isFocusing} />
      <CameraZoomIndicator zoom={camera.zoom} minZoom={camera.minZoom} maxZoom={camera.maxZoom} />
      <CameraTimer duration={camera.timerDuration} remaining={camera.timerRemaining} isActive={camera.isTimerActive} />
      <CameraControlBar position="top" className="flex-wrap">
        <GridButton gridType={grid} onGridChange={setGrid} />
        <TimerButton duration={camera.timerDuration} onDurationChange={duration => {
          if (duration === 0 || duration === 3 || duration === 5 || duration === 10) camera.setTimerDuration(duration);
        }} />
        <AspectRatioButton aspectRatio={ratio} onAspectRatioChange={setRatio} />
        <ZoomButton zoomAction="in" onZoom={delta => camera.zoomIn(delta)} />
        <SettingsButton isOpen={settingsOpen} onClick={() => setSettingsOpen(true)} />
        <CameraButton icon={<IconKeyboard aria-hidden="true" />} label="Keyboard help" onClick={() => setHelpOpen(true)} />
      </CameraControlBar>
      <CameraControlBar position="bottom">
        <CameraControlBarGroup>
          <FlashButton isEnabled={camera.isFlashOn} isSupported={camera.isFlashSupported} onClick={() => { void camera.toggleFlash(); }} />
          <SwitchCameraButton onClick={() => { void camera.switchCamera(); }} />
          <CameraControlBarDivider />
          <CaptureButton onClick={camera.startTimer} />
          <RecordButton isRecording={camera.isRecording} onClick={() => {
            if (camera.isRecording) void camera.stopRecording(); else camera.startRecording();
          }} />
        </CameraControlBarGroup>
      </CameraControlBar>
      <CameraVoiceControl enabled={false} />
      <CameraStatusAnnouncer status={camera.status} />
      <CameraSettings open={settingsOpen} onOpenChange={setSettingsOpen} values={settings} onValuesChange={setSettings} />
      <CameraKeyboardHelp open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}

export function PartsExample() {
  return <CameraErrorBoundary><Camera mode="photo" autoStart={false} announceStatus={false} className="w-full"><CameraParts /></Camera></CameraErrorBoundary>;
}

// Alternative to the composed control bars:
export function SimpleControlsExample() {
  return <Camera mode="photo" className="w-full"><CameraPreview /><CameraPermissions /><CameraControls /></Camera>;
}`;

const usageCode =
  `import { useEffect, useRef, useState } from "react";
import { IconKeyboard } from "@tabler/icons-react";
import {
  Camera, KiraCamera, CameraPreview, CameraOverlay, CameraCaptureFlash, CameraButton,
  CaptureButton, RecordButton, FlashButton, SwitchCameraButton, TimerButton,
  GridButton, SettingsButton, AspectRatioButton, ZoomButton,
  CameraControls, CameraControlBar, CameraControlBarGroup, CameraControlBarDivider,
  CameraGuide, CameraGrid, CameraScanOverlay, CameraTimer, CameraPermissions,
  CameraSettings, CameraKeyboardHelp, CameraStatusAnnouncer,
  CameraFocusIndicator, CameraZoomIndicator, CameraVoiceControl, CameraErrorBoundary,
  useCameraContext, CAMERA_DEFAULT_SETTINGS,
  type CameraRef, type CameraSettingsValues, type CameraGridType, type CameraAspectRatio,
} from "@/components/ui/camera";
import { Button } from "@/components/ui/button";
import type { CaptureResult } from "@/lib/camera/types";` +
  "\n\n" +
  [basicCode, kiraCode, partsCode]
    .map((code) => code.replace(/^import[\s\S]*?;\s*\n/gm, ""))
    .join("\n\n");

export default function CameraPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Camera"
        version="v3.0.1"
        description="Composable photo/video capture with reviewed image handoff, shared controls and framing guides."
      />

      <FeatureGrid
        features={cameraPageFeatures}
        description="Explicit camera activation, reviewed capture handoff, and composable controls."
      />

      <DemoTabs defaultValue="basic" tabs={cameraPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={cameraPageShortcuts}
        description="Scoped camera shortcuts and native Base UI control bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use KiraCamera for reviewed capture workflows or compose Camera primitives directly."
        notes={cameraPageUsageNotes}
      />

      <APIReference
        sections={cameraPageAPISections}
        description="Props, types, and defaults for every exported Camera part and utility."
      />

      <Changelog
        entries={cameraPageChangelogEntries}
        title="Changelog"
        description="Version history for the Camera component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const cameraPageFeatures = [
  {
    title: "Intentional capture",
    description:
      "Start explicitly, photograph or choose an image, review it and accept or retake.",
    icon: <IconCamera aria-hidden="true" className="size-4" />,
  },
  {
    title: "Cancellable handoff",
    description:
      "Caller-owned acceptance preserves the image through pending, cancel and retry.",
    icon: <IconPhoto aria-hidden="true" className="size-4" />,
  },
  {
    title: "Shared controls",
    description:
      "Timer, recording, digital zoom, settings and opt-in voice/gesture alternatives.",
    icon: <IconAdjustments aria-hidden="true" className="size-4" />,
  },
  {
    title: "Framing guides",
    description:
      "Static photo, document and code-positioning frames with caller-owned alignment feedback.",
    icon: <IconScan aria-hidden="true" className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const cameraPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Camera capture"
        description="Explicit start, native controls, scoped shortcuts and owned preview URLs."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controls",
    label: "Controls",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Shared camera controls"
        description="One controller for digital zoom, focus gestures, timer and real recording."
        code={controlsCode}
      >
        <ControlsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "settings",
    label: "Settings",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Camera settings"
        description="Shared Tabs, Select, Switch and Button with caller-owned values."
        code={settingsCode}
      >
        <SettingsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "voice",
    label: "Voice",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Opt-in voice controls"
        description="Feature-detected speech recognition with explicit start and button alternatives."
        code={voiceCode}
      >
        <VoiceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "review",
    label: "Review",
    group: "KiraCamera",
    demo: (
      <DemoWrapper
        title="Review before accepting"
        description="Camera or file selection, image review, retake and local acceptance."
        code={reviewCode}
      >
        <ReviewDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "acceptance",
    label: "Acceptance",
    group: "KiraCamera",
    demo: (
      <DemoWrapper
        title="Cancellable acceptance"
        description="Labelled image/delay fixtures show pending, cancel, error, retry and local success."
        code={acceptanceCode}
      >
        <AcceptanceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraCamera",
    demo: (
      <DemoWrapper
        title="Claim photo workflow"
        description="The reviewed camera/file workflow with caller-owned acceptance."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "overlays",
    label: "Overlays",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Scan overlay states"
        description="Status fixtures for framing, processing and recovery."
        code={overlaysCode}
      >
        <OverlaysDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "guides",
    label: "Guides",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Framing presets"
        description="Static document, photo and code-positioning guides."
        code={guidesCode}
      >
        <GuidesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long workflow labels, empty/disabled states, and control fixtures in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const cameraPageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move through native camera buttons, file selection and review actions. Focus must remain visible.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate a focused control; inherited from Base UI Button. File selection also uses the native browser dialog.",
  },
  {
    keys: "Space / R / S / F",
    description:
      "With enableKeyboardShortcuts and the camera region itself focused: timed photo, recording, camera switch and torch; Kira additions.",
  },
  {
    keys: "Escape",
    description:
      "With the camera region focused: cancel a countdown. In settings/help: native Base UI dismissal and focus return. Use Stop camera to end capture.",
  },
  {
    keys: "Arrow keys / Enter / typeahead",
    description:
      "Choose settings options; inherited from the kit’s Base UI Select and Tabs.",
  },
  {
    keys: "Cancel acceptance / Cancel timer",
    description:
      "Reachable button alternatives stop caller-owned acceptance or a countdown without discarding the reviewed image.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const cameraPageUsageNotes = [
  {
    label: "KiraCamera",
    body: "Use KiraCamera for complete photo-capture and file-selection workflows with built-in review, retake, and cancellable caller-owned acceptance.",
  },
  {
    label: "Composable Camera primitives",
    body: "Compose Camera, CameraPreview, CameraControls, CameraControlBar, and framing overlays directly when you need custom recording, zoom, timer, or settings layouts.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

function apiProp(
  prop: string,
  type: string,
  defaultValue: string,
  description: string,
) {
  return { prop, type, default: defaultValue, description };
}

const nativeDiv = apiProp(
  "Native div props / className",
  'React.ComponentPropsWithoutRef<"div">',
  "-",
  "Native attributes and styling reach this part.",
);

const nativeButton = apiProp(
  "CameraButton props",
  "CameraButtonProps",
  "-",
  "Shared native-button labels, busy/disabled states, CVA variants and click callbacks.",
);

const cameraPageAPISections = [
  {
    title: "Camera",
    props: [
      apiProp(
        "mode / facingMode",
        '"selfie" | "photo" | "video" / "user" | "environment"',
        '"selfie" / mode-derived',
        "One camera controller shared by all child parts.",
      ),
      apiProp(
        "autoStart",
        "boolean",
        "false",
        "Optional startup waits for a visible, intersecting camera. Prefer the explicit permission UI.",
      ),
      apiProp(
        "constraints",
        "CameraConstraints",
        "-",
        "Requested width, height, frame rate and aspect ratio.",
      ),
      apiProp(
        "enableKeyboardShortcuts / enableGestures / enableVoiceControl",
        "boolean",
        "false",
        "Opt-in scoped shortcuts, pointer gestures and speech recognition.",
      ),
      apiProp(
        "gestureOptions / voiceOptions",
        "UseCameraOptions gestureOptions / voiceOptions",
        "-",
        "Gesture toggles/bounds and speech language/confidence.",
      ),
      apiProp(
        "captureFormat / captureQuality",
        '"image/jpeg" | "image/png" | "image/webp" / number (0–1)',
        '"image/jpeg" / 0.95',
        "Photo encoding; the returned Blob reports the format the browser produced.",
      ),
      apiProp(
        "mirrorCapture",
        "boolean",
        "false",
        "Mirror the captured photo explicitly. Preview mirroring is independent.",
      ),
      apiProp(
        "enableHaptics / announceStatus",
        "boolean",
        "true",
        "Optional vibration and a composed camera-status live region.",
      ),
      apiProp(
        "size / shape",
        '"sm" | "md" | "default" | "lg" | "full" | "square" | "fullscreen" / "default" | "rounded" | "circle" | "none"',
        '"default" / "default"',
        "Shared camera viewport variants.",
      ),
      apiProp(
        "onCapture / onError / onStatusChange / onReady",
        "CameraProps callbacks",
        "-",
        "Actual capture, typed recoverable failures, CameraStatus changes and ready notification.",
      ),
      apiProp(
        "onVoiceCommand / onGestureStart / onGestureEnd",
        "UseCameraOptions callbacks",
        "-",
        "Speech and pointer-gesture notifications.",
      ),
      apiProp(
        "ref",
        "React.Ref<CameraRef>",
        "-",
        "Imperative camera actions. useCameraState/useCameraActions/useCameraContext share this controller.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "KiraCamera",
    props: [
      apiProp(
        "Camera props",
        "KiraCameraProps",
        "-",
        "Inherits camera options except children, onCapture, autoStart and announceStatus.",
      ),
      apiProp(
        "label / description",
        "string",
        '"Capture image" / review guidance',
        "Visible workflow name and capture instructions.",
      ),
      apiProp(
        "onAccept",
        "(capture: CameraReviewCapture, signal: AbortSignal) => void | Promise<void>",
        "required",
        "Caller-owned acceptance; confirmed success follows completion.",
      ),
      apiProp(
        "defaultCapture",
        "CameraReviewCapture",
        "-",
        "Initial reviewed image. The caller owns its URL; the workflow owns later capture URLs.",
      ),
      apiProp(
        "acceptLabel / successMessage",
        "string",
        '"Accept image" / "Image accepted."',
        "Caller-specific action and confirmed completion copy.",
      ),
      apiProp(
        "allowFileSelection / maxFileSize",
        "boolean / number (bytes)",
        "true / 10485760",
        "Native image selection/capture hint and decoded image-size validation.",
      ),
      apiProp(
        "guidePreset",
        "GuidePreset",
        "-",
        "Optional static framing guide.",
      ),
      apiProp(
        "disabled / disabledReason",
        "boolean / string",
        "false / -",
        "Unavailable actions with visible explanation.",
      ),
    ],
  },
  {
    title: "CameraPreview",
    props: [
      apiProp(
        "mirror / showSkeleton / skeleton",
        "CameraPreviewProps",
        "facing-mode-derived / true / default placeholder",
        "Shared video ref, preview mirroring and initial placeholder.",
      ),
      apiProp(
        "Native video props / ref",
        'React.ComponentPropsWithoutRef<"video"> / React.Ref<HTMLVideoElement>',
        "-",
        "Video attributes, metadata events and ref reach the preview.",
      ),
    ],
  },
  {
    title: "CameraOverlay",
    props: [
      apiProp(
        "interactive",
        "boolean",
        "false",
        "Enable pointer interaction explicitly for overlay controls.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraCaptureFlash",
    props: [
      apiProp(
        "duration",
        "number (ms)",
        "150",
        "Brief capture feedback, disabled under reduced motion.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraButton",
    props: [
      apiProp(
        "variant / size / shape",
        "CameraButtonProps CVA variants",
        "default / md / circle",
        "Shared native Button composition.",
      ),
      apiProp(
        "icon / iconSize / children",
        "React.ReactNode / number / React.ReactNode",
        "-",
        "Visual content; decorative icons remain hidden from assistive technology.",
      ),
      apiProp(
        "label / showLabel / labelPosition",
        'string / boolean / "bottom" | "right" | "top" | "left"',
        "- / false / bottom",
        "Accessible name and optional visible label.",
      ),
      apiProp(
        "badge / indicator / indicatorColor",
        'string | number / "dot" | "ring" | "none" / string',
        "- / none / -",
        "Value badge or status indicator.",
      ),
      apiProp(
        "isActive / isLoading",
        "boolean",
        "false",
        "Pressed selection or busy state; loading prevents activation.",
      ),
      apiProp(
        "hapticPattern / pressAnimation / pulse / pulseColor",
        "CameraButtonProps feedback options",
        "light / scale / false / -",
        "Optional bounded feedback with reduced-motion gates.",
      ),
      apiProp(
        "action",
        '"capture" | "record" | "flash" | "switch" | "timer" | "grid" | "settings" | "zoom" | "aspectRatio"',
        "-",
        "Default icon/name. Supply onClick to wire the action.",
      ),
      apiProp(
        "Native button props / ref",
        "React.ButtonHTMLAttributes<HTMLButtonElement> / React.Ref<HTMLButtonElement>",
        "-",
        "Native events, disabled state and focus.",
      ),
    ],
  },
  {
    title: "CaptureButton",
    props: [
      apiProp(
        "size / showInnerRing / innerRingColor",
        '"sm" | "md" | "lg" / boolean / string',
        "md / true / muted current-color ring",
        "Capture visual treatment with an optional custom ring color. Wire onClick to capture or startTimer.",
      ),
      nativeButton,
    ],
  },
  {
    title: "RecordButton",
    props: [
      apiProp(
        "isRecording / showTimeBadge / recordingDuration",
        "boolean / boolean / number (seconds)",
        "false / false / 0",
        "Recording label, shape and optional elapsed time.",
      ),
      apiProp("size", '"sm" | "md" | "lg"', '"md"', "Record control size."),
      nativeButton,
    ],
  },
  {
    title: "FlashButton",
    props: [
      apiProp(
        "isEnabled / isSupported",
        "boolean",
        "false / true",
        "Torch selection and hardware availability; supply onClick.",
      ),
      nativeButton,
    ],
  },
  { title: "SwitchCameraButton", props: [nativeButton] },
  {
    title: "TimerButton",
    props: [
      apiProp(
        "duration / options / onDurationChange / showBadge",
        "number / number[] / (duration: number) => void / boolean",
        "required / [0,3,5,10] / - / true",
        "Cycle caller-owned timer durations; wire to setTimerDuration.",
      ),
      nativeButton,
    ],
  },
  {
    title: "GridButton",
    props: [
      apiProp(
        "gridType / onGridChange / cycleOptions",
        "CameraGridType / (grid: CameraGridType) => void / boolean",
        "required / - / true",
        "Cycle caller-owned composition grids.",
      ),
      nativeButton,
    ],
  },
  {
    title: "SettingsButton",
    props: [
      apiProp(
        "isOpen",
        "boolean",
        "false",
        "Selected appearance for an open settings panel; supply onClick.",
      ),
      nativeButton,
    ],
  },
  {
    title: "AspectRatioButton",
    props: [
      apiProp(
        "aspectRatio / onAspectRatioChange / showBadge",
        "CameraAspectRatio / (ratio: CameraAspectRatio) => void / boolean",
        "required / - / true",
        "Cycle caller-owned ratios. Apply the chosen ratio to preview/constraints as needed.",
      ),
      nativeButton,
    ],
  },
  {
    title: "ZoomButton",
    props: [
      apiProp(
        "zoomAction / zoom / onZoom",
        '"in" | "out" | "reset" / number / (delta: number) => void',
        "required / - / -",
        "Requests +0.5, -0.5 or reset (0); the caller updates camera zoom.",
      ),
      nativeButton,
    ],
  },
  {
    title: "CameraControls",
    props: [
      apiProp(
        "showCapture / showRecord / showSwitch / showFlash",
        "boolean",
        "true / false / true / true",
        "Centered photo/video actions, balanced secondary controls and visible labels, wired to the shared controller.",
      ),
      apiProp(
        "position / visibility / autoHide",
        "CameraControlsProps variants / boolean",
        "bottom / visible / true",
        "Unavailable/hidden controls are inert.",
      ),
      apiProp(
        "onCapture / onRecordStart / onRecordStop / onSwitchCamera / onToggleFlash",
        "CameraControlsProps callbacks",
        "-",
        "Action notifications; recorder stop returns the final Blob or null.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraControlBar",
    props: [
      apiProp(
        "position / variant",
        '"top" | "bottom" | "left" | "right" / "horizontal" | "vertical" | "floating"',
        "bottom / horizontal",
        "Composed controls positioned on the viewport.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraControlBarGroup",
    props: [
      apiProp(
        "label / direction",
        'string / "horizontal" | "vertical"',
        "- / horizontal",
        "Accessible name and layout for related controls.",
      ),
      nativeDiv,
    ],
  },
  { title: "CameraControlBarDivider", props: [nativeDiv] },
  {
    title: "CameraGuide",
    props: [
      apiProp(
        "preset / variant / documentType / config",
        "GuidePreset / CameraGuideProps variant / DocumentType / Partial<CameraGuideConfig>",
        "custom / - / - / -",
        "Static preset or explicit framing configuration; no recognition.",
      ),
      apiProp(
        "isAligned / alignmentProgress",
        "boolean / number",
        "false / -",
        "Caller-owned alignment feedback.",
      ),
      apiProp(
        "instruction / showInstruction / instructionPosition",
        'string / boolean / "top" | "bottom" | "inside"',
        "- / true / bottom",
        "Positioning text.",
      ),
      apiProp(
        "showAlignmentIndicator / alignmentIndicatorPosition",
        "boolean / CameraGuideProps alignmentIndicatorPosition",
        "true / top-right",
        "Caller-owned status mark.",
      ),
      apiProp(
        "showMeasurements / showCenterCross / safeZone",
        "CameraGuideProps",
        "false / false / -",
        "Optional measurements, center mark and usable insets.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraGrid",
    props: [
      apiProp(
        "type / color / opacity / lineWidth / showIntersectionDots / dotSize / animated",
        "Partial<CameraGridConfig>",
        "none / preset defaults",
        "Six composition grid choices and configurable lines/intersection marks.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraScanOverlay",
    props: [
      apiProp(
        "preset",
        '"none" | "face-recognition" | "id-card-scanner"',
        "required",
        "Frame/scan visual preset.",
      ),
      apiProp(
        "status / isAligned / isScanning / isProcessing",
        '"idle" | "scanning" | "aligned" | "processing" | "success" | "error" / boolean',
        "scanning / false / true / false",
        "Explicit visual state. Scan motion stops when inactive or processing.",
      ),
      apiProp(
        "statusText / showStatusText / config",
        "string / boolean / Partial<CameraScanOverlayConfig>",
        "- / true / preset defaults",
        "Optional status badge, accessible feedback and configuration.",
      ),
      apiProp(
        "documentType / documentAspectRatio / className",
        "DocumentType / number / string",
        "national-id / template-derived / -",
        "Document dimensions and root styling.",
      ),
    ],
  },
  {
    title: "CameraTimer",
    props: [
      apiProp(
        "duration / isActive / remaining",
        "CameraTimerDuration / boolean / number",
        "required",
        "Controller-owned countdown and accessible timer label.",
      ),
      apiProp(
        "timerStyle / size / color / backgroundColor / animated / showPulse / className",
        '"number" | "circular" | "bar" / CameraTimerProps',
        "circular / md / token colors / true / true / -",
        "Distinct timer visuals and optional bounded tick motion.",
      ),
    ],
  },
  {
    title: "CameraPermissions",
    props: [
      apiProp(
        "variant",
        "CameraPermissionsProps CVA variant",
        "default",
        "Permission/start/retry UI from the shared controller.",
      ),
      apiProp(
        "requestingTitle / requestingDescription / deniedTitle / deniedDescription / errorTitle / errorDescription",
        "string",
        "contextual defaults",
        "Failure or startup explanations.",
      ),
      apiProp(
        "showHelpLink / helpLinkUrl / onRetry / alwaysShow",
        "boolean / string / () => void / boolean",
        "true / browser-derived / - / false",
        "Recoverable permission actions, custom help and optional persistent display.",
      ),
      nativeDiv,
    ],
  },
  {
    title: "CameraSettings",
    props: [
      apiProp(
        "open / onOpenChange / values / onValuesChange",
        "boolean / (open: boolean) => void / CameraSettingsValues / (values: CameraSettingsValues) => void",
        "required",
        "Caller-owned settings and panel state.",
      ),
      apiProp(
        "variant / position / className",
        '"sheet" | "modal" | "panel" / "bottom" | "right" | "left" / string',
        "sheet / bottom / -",
        "Base UI Drawer/Dialog or inline panel.",
      ),
    ],
  },
  {
    title: "CameraKeyboardHelp",
    props: [
      apiProp(
        "open / onOpenChange",
        "boolean / (open: boolean) => void",
        "required",
        "Base UI help dialog with implemented root shortcuts.",
      ),
      apiProp(
        "customShortcuts / customDescriptions / className",
        "Record<string,string[]> / Record<string,string> / string",
        "{} / {} / -",
        "Add documentation for shortcuts the caller implements.",
      ),
    ],
  },
  {
    title: "CameraStatusAnnouncer",
    props: [
      apiProp(
        "status / customMessages / additionalMessage",
        "CameraStatus / Partial<Record<CameraStatus,string>> / string",
        "required / - / -",
        "One complete contextual status phrase.",
      ),
      apiProp(
        "enabled / politeness / showVisual / className",
        'boolean / "polite" | "assertive" / boolean / string',
        "true / polite / false / -",
        "Live-region semantics and optional visible status.",
      ),
    ],
  },
  {
    title: "CameraFocusIndicator",
    props: [
      apiProp(
        "point / isActive / isLocked",
        "{ x: number; y: number } | null / boolean / boolean",
        "required / required / false",
        "Normalized viewport focus point and state.",
      ),
      apiProp(
        "indicatorStyle / size / color / lockedColor / strokeWidth / animationDuration / className",
        "CameraFocusIndicatorProps",
        "preset defaults",
        "Ring, box, bracket or crosshair visuals. Hardware focus remains browser/device-dependent.",
      ),
    ],
  },
  {
    title: "CameraZoomIndicator",
    props: [
      apiProp(
        "zoom / minZoom / maxZoom / format",
        'number / number / number / "multiplier" | "percentage"',
        "required / 1 / 10 / multiplier",
        "Actual zoom with a bounded progress mark.",
      ),
      apiProp(
        "position / showBar / showOnChange / hideDelay / alwaysVisible / className",
        "CameraZoomIndicatorProps",
        "top-right / true / true / 2000 / false / -",
        "Visibility and delayed hiding with motion gates.",
      ),
    ],
  },
  {
    title: "CameraVoiceControl",
    props: [
      apiProp(
        "enabled / language / onCommand",
        "boolean / string / UseCameraOptions onVoiceCommand",
        "required / en-US / -",
        "Explicit microphone activation after browser support detection.",
      ),
      apiProp(
        "showListeningIndicator / showCommandFeedback / feedbackDuration / position / className",
        "CameraVoiceControlProps",
        "true / true / 2000 / top-left / -",
        "Listening control and command feedback.",
      ),
    ],
  },
  {
    title: "CameraErrorBoundary",
    props: [
      apiProp(
        "children / fallback / onError / onReset / className",
        "CameraErrorBoundaryProps",
        "required / default recovery / - / - / -",
        "Render-error recovery. The camera root already includes a boundary.",
      ),
    ],
  },
  {
    title: "Context, utilities and variants",
    props: [
      apiProp(
        "useCameraState / useCameraActions / useCameraContext",
        "() => CameraState / CameraActions / ReturnType<typeof useCameraContext>",
        "-",
        "Access the one controller inside Camera.",
      ),
      apiProp(
        "getControlDescription",
        "Public utility function",
        "-",
        "Accessible text for camera controls.",
      ),
      apiProp(
        "cameraVariants / cameraButtonVariants / cameraControlsVariants / cameraGuideVariants / cameraPermissionsVariants / controlBarVariants",
        "CVA variant functions",
        "-",
        "Exported shared camera-part styles.",
      ),
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const cameraPageChangelogEntries = [
  {
    version: "3.0.1",
    date: "20 November 2026",
    changes: [
      {
        type: "removed",
        title: "Orphan scan-overlay-pulse-glow keyframes",
        description:
          "The base stylesheet declared keyframes no component references — the scan overlay animates with scan-overlay-corner-pulse. Dropped from the kit CSS and CLI templates.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "14 November 2026",
    changes: [
      {
        type: "added",
        title: "KiraCamera reviewed capture",
        description:
          "Native image selection, explicit capture, review/retake and cancellable caller-owned acceptance. Research cutoff October 31, 2026; Base UI 1.9.0 audited.",
      },
      {
        type: "fixed",
        title: "One camera controller and cleanup",
        description:
          "Late permission streams are stopped, duplicate startup is guarded, recordings complete with their actual MIME and timers/voice/resources clean up.",
      },
      {
        type: "changed",
        title: "Shared controls and honest states",
        description:
          "Settings reuse the kit’s Tabs, Select, Switch and Button. Ten focused demos cover capture, review, controls and framing.",
      },
      {
        type: "changed",
        title: "Camera capture and review design",
        description:
          "A balanced shutter dock with a legibility fade, readable compact permission prompts, 44px mobile actions, capture/review/accept steps, image details and reserved recovery feedback. KiraCamera's default mobile photo viewport uses 4:3; explicit size variants are preserved. The default photo ring uses a muted current color; recording uses semantic tokens.",
      },
      {
        type: "breaking",
        title: "Explicit activation and scope",
        description:
          "Camera keyboard shortcuts default off and act only while the camera region itself has focus.",
      },
      {
        type: "breaking",
        title: "Optional workflows removed",
        description:
          "Face detection, document OCR, liveness and KYC workflows were removed with their types, camera modes, registry entry and TensorFlow/Tesseract dependencies.",
      },
      {
        type: "breaking",
        title: "Accurate output and removed no-ops",
        description:
          "Quality raw is now lossless (PNG). Reduced-motion bypass props were removed. Photo capture stays unmirrored unless mirrorCapture is enabled.",
      },
      {
        type: "fixed",
        title: "Gated guide/timer feedback and recovery",
        description:
          "Static default guides, bounded timer ticks, configured framing ratios, normalized focus marks and accessible status feedback.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "1 November 2026",
    changes: [
      {
        type: "added",
        title: "Enhanced controls, guide presets and scan overlays",
        description:
          "Previous camera-control, guide-preset and scan-overlay release.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
