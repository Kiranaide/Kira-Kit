import * as React from "react";
import {
  IconCamera,
  IconId,
  IconUserScan,
  IconShieldCheck,
  IconDeviceMobile,
  IconAccessible,
  IconMicrophone,
  IconGrid3x3,
  IconClock,
  // IconKeyboard,
  IconFocus,
} from "@tabler/icons-react";
import {
  Camera,
  CameraPreview,
  CameraOverlay,
  CameraPermissions,
  CameraGuide,
  CameraGrid,
  CameraScanOverlay,
  CameraControlBar,
  CameraTimer,
  CameraVoiceControl,
  CameraKeyboardHelp,
  CameraSettings,
  CameraFocusIndicator,
  CameraZoomIndicator,
  CameraControls,
  CameraButton,
  CAMERA_DEFAULT_SETTINGS,
  type CameraSettingsValues,
  type CameraGridType,
  type CameraTimerDuration,
  type CameraScanOverlayPreset,
} from "@/components/ui/camera";
import {
  FaceDetection,
  IdCardScanner,
  LivenessCheck,
  KYCFlow,
} from "@/components/ui/camera-features";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// =============================================================================
// Enhanced Camera Demo with New Features (2025-2026)
// =============================================================================

function EnhancedCameraDemo() {
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = React.useState(false);

  const [settings, setSettings] = React.useState<CameraSettingsValues>(
    CAMERA_DEFAULT_SETTINGS
  );

  return (
    <div className="flex flex-col items-center gap-4 min-h-[500px]">
      <div className="w-full max-w-lg relative">
        <Camera
          mode="photo"
          autoStart
          onCapture={(result) => {
            setCapturedImage(result.url);
          }}
          className="w-full"
          size="lg"
        >
          <EnhancedCameraContent
            settings={settings}
            onSettingsChange={setSettings}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenKeyboardHelp={() => setKeyboardHelpOpen(true)}
          />
        </Camera>

        <CameraVoiceControl
          enabled={settings.voiceControl}
          // onCommand={(command) => console.log("Voice command:", command)}
        />

        <CameraSettings
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          values={settings}
          onValuesChange={setSettings}
          variant="sheet"
          position="bottom"
        />

        <CameraKeyboardHelp
          open={keyboardHelpOpen}
          onOpenChange={setKeyboardHelpOpen}
        />
      </div>

      {capturedImage && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Captured Image:</p>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-48 h-36 object-cover rounded-lg border"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCapturedImage(null)}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

interface EnhancedCameraContentProps {
  settings: CameraSettingsValues;
  onSettingsChange: (values: CameraSettingsValues) => void;
  onOpenSettings: () => void;
  onOpenKeyboardHelp: () => void;
}

function EnhancedCameraContent({
  settings,
  onSettingsChange,
  onOpenSettings,
  // onOpenKeyboardHelp,
}: EnhancedCameraContentProps) {
  const {
    zoom,
    focusPoint,
    isFocusing,
    gestureContainerRef,
    isFlashOn,
    toggleFlash,
    timerDuration,
    timerRemaining,
    isTimerActive,
    setTimerDuration,
    // startTimer,
    // capture,
  } = useCamera({
    enableGestures: true,
    gestureOptions: {
      enablePinchToZoom: true,
      enableTapToFocus: true,
    },
  });

  // Grid types for cycling
  const gridTypes: CameraGridType[] = [
    "none",
    "rule-of-thirds",
    "golden-ratio",
    "square",
    "diagonal",
    "center-cross",
  ];

  const cycleGrid = () => {
    const currentIndex = gridTypes.indexOf(settings.grid);
    const nextIndex = (currentIndex + 1) % gridTypes.length;
    onSettingsChange({ ...settings, grid: gridTypes[nextIndex] });
  };

  // Timer durations for cycling
  const timerDurations: CameraTimerDuration[] = [0, 3, 5, 10];

  const cycleTimer = () => {
    const currentIndex = timerDurations.indexOf(timerDuration);
    const nextIndex = (currentIndex + 1) % timerDurations.length;
    setTimerDuration(timerDurations[nextIndex]);
  };

  return (
    <div
      ref={gestureContainerRef as React.RefObject<HTMLDivElement>}
      className="absolute inset-0"
    >
      <CameraPreview />

      <CameraGrid type={settings.grid} visible={settings.grid !== "none"} />

      <CameraFocusIndicator point={focusPoint} isActive={isFocusing} />

      <CameraZoomIndicator zoom={zoom} showOnChange />

      {isTimerActive && (
        <CameraTimer
          duration={timerDuration}
          isActive={isTimerActive}
          remaining={timerRemaining}
          size="lg"
        />
      )}

      <CameraPermissions />

      <CameraControlBar position="top" variant="horizontal">
        <CameraButton
          action="flash"
          variant={isFlashOn ? "primary" : "secondary"}
          isActive={isFlashOn}
          onClick={toggleFlash}
        />
        <CameraButton
          action="grid"
          variant={settings.grid === "none" ? "secondary" : "primary"}
          isActive={settings.grid !== "none"}
          badge={settings.grid === "none" ? undefined : settings.grid}
          onClick={cycleGrid}
        />
        <CameraButton
          action="timer"
          variant={timerDuration > 0 ? "primary" : "secondary"}
          badge={timerDuration > 0 ? `${timerDuration}s` : undefined}
          onClick={cycleTimer}
        />
        <CameraButton
          action="settings"
          variant="secondary"
          onClick={onOpenSettings}
        />
      </CameraControlBar>

      {/* <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-8">
        <CameraButton action="switch" />
        <CameraButton
          action="capture"
          size="lg"
          onClick={() => {
            if (timerDuration > 0) {
              startTimer();
            } else {
              capture();
            }
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/40 text-white hover:bg-black/60"
          onClick={onOpenKeyboardHelp}
        >
          <IconKeyboard size={20} />
        </Button>
      </div> */}
      <CameraControls showCapture showSwitch />
    </div>
  );
}

const enhancedCameraCode = `import {
  Camera,
  CameraPreview,
  CameraGrid,
  CameraControlBar,
  CameraTimer,
  CameraVoiceControl,
  CameraSettings,
  CameraFocusIndicator,
  CameraZoomIndicator,
  CameraButton,
  CAMERA_DEFAULT_SETTINGS,
} from "@/components/ui/camera"
import { useCamera } from "@/hooks/use-camera"

function EnhancedCameraDemo() {
  const [settings, setSettings] = React.useState(CAMERA_DEFAULT_SETTINGS)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  
  const {
    zoom,
    focusPoint,
    isFocusing,
    gestureContainerRef,
    isTimerActive,
    timerRemaining,
    timerDuration,
    setTimerDuration,
    startTimer,
    capture,
  } = useCamera({
    enableGestures: true,
    gestureOptions: {
      enablePinchToZoom: true,
      enableTapToFocus: true,
    },
  })
  
  return (
    <Camera mode="photo" autoStart>
      <div ref={gestureContainerRef}>
        <CameraPreview />
        <CameraGrid type={settings.grid} visible={settings.grid !== "none"} />
        <CameraFocusIndicator point={focusPoint} isActive={isFocusing} />
        <CameraZoomIndicator zoom={zoom} />
        
        {isTimerActive && (
          <CameraTimer
            duration={timerDuration}
            isActive={isTimerActive}
            remaining={timerRemaining}
            style="circular"
          />
        )}
        
        <CameraControlBar position="top">
          <CameraButton action="flash" />
          <CameraButton
            action="grid"
            gridType={settings.grid}
            onGridChange={(grid) => setSettings({ ...settings, grid })}
          />
          <CameraButton
            action="timer"
            duration={timerDuration}
            onDurationChange={setTimerDuration}
          />
          <CameraButton
            action="settings"
            onClick={() => setSettingsOpen(true)}
          />
        </CameraControlBar>
        
        <CameraButton
          action="capture"
          onClick={() => timerDuration > 0 ? startTimer() : capture()}
        />
      </div>
      
      <CameraVoiceControl enabled={settings.voiceControl} />
      <CameraSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        values={settings}
        onValuesChange={setSettings}
      />
    </Camera>
  )
}`;

// =============================================================================
// Scan Overlay Demo (Face Recognition & ID Card Scanner)
// =============================================================================

function ScanOverlayDemo() {
  const [preset, setPreset] =
    React.useState<CameraScanOverlayPreset>("face-recognition");

  const [isAligned, setIsAligned] = React.useState(false);
  const [showStatusText, setShowStatusText] = React.useState(true);

  return (
    <div className="flex flex-col items-center gap-4 min-h-[400px]">
      <div className="w-full max-w-md">
        <Camera mode="photo" autoStart className="w-full" size="default">
          <CameraPreview />
          <CameraPermissions />
          <CameraScanOverlay
            preset={preset}
            isAligned={isAligned}
            status={isAligned ? "aligned" : "scanning"}
            showStatusText={showStatusText}
            statusText={
              preset === "face-recognition"
                ? isAligned
                  ? "Hold still"
                  : "Position your face in the oval"
                : isAligned
                  ? "Hold steady"
                  : "Position document in frame"
            }
          />
        </Camera>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={preset === "face-recognition" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreset("face-recognition")}
        >
          Face Recognition
        </Button>
        <Button
          variant={preset === "id-card-scanner" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreset("id-card-scanner")}
        >
          ID Card Scanner
        </Button>
        <Button
          variant={preset === "none" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreset("none")}
        >
          None
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Simulate aligned:
          </span>
          <Button
            variant={isAligned ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAligned(!isAligned)}
          >
            {isAligned ? "Aligned" : "Not aligned"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Show instruction text:
          </span>
          <Button
            variant={showStatusText ? "default" : "outline"}
            size="sm"
            onClick={() => setShowStatusText(!showStatusText)}
          >
            {showStatusText ? "On" : "Off"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const scanOverlayCode = `import {
  Camera,
  CameraPreview,
  CameraPermissions,
  CameraScanOverlay,
} from "@/components/ui/camera"

function ScanOverlayDemo() {
  const [preset, setPreset] = React.useState("face-recognition")
  const [isAligned, setIsAligned] = React.useState(false)
  const [showStatusText, setShowStatusText] = React.useState(true)

  return (
    <Camera mode="photo" autoStart>
      <CameraPreview />
      <CameraPermissions />
      <CameraScanOverlay
        preset={preset}
        isAligned={isAligned}
        status={isAligned ? "aligned" : "scanning"}
        showStatusText={showStatusText}
        statusText={
          preset === "face-recognition"
            ? isAligned ? "Hold still" : "Position your face in the oval"
            : isAligned ? "Hold steady" : "Position document in frame"
        }
      />
    </Camera>
  )
}

// Hide text: <CameraScanOverlay showStatusText={false} preset="face-recognition" />`;

// Grid Overlays (composition grids - kept for backward compatibility)
function GridOverlaysDemo() {
  const [gridType, setGridType] =
    React.useState<CameraGridType>("rule-of-thirds");

  return (
    <div className="flex flex-col items-center gap-4 min-h-[400px]">
      <div className="w-full max-w-md">
        <Camera mode="photo" autoStart className="w-full" size="default">
          <CameraPreview />
          <CameraGrid type={gridType} />
        </Camera>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {[
          { value: "none", label: "None" },
          { value: "rule-of-thirds", label: "Rule of Thirds" },
          { value: "golden-ratio", label: "Golden Ratio" },
          { value: "square", label: "Square" },
          { value: "diagonal", label: "Diagonal" },
          { value: "center-cross", label: "Center Cross" },
        ].map((option) => (
          <Button
            key={option.value}
            variant={gridType === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setGridType(option.value as CameraGridType)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

const gridOverlaysCode = `import { Camera, CameraPreview, CameraGrid } from "@/components/ui/camera"

function GridOverlaysDemo() {
  const [gridType, setGridType] = React.useState("rule-of-thirds")
  
  return (
    <Camera mode="photo" autoStart>
      <CameraPreview />
      <CameraGrid type={gridType} />
    </Camera>
  )
}`;

// =============================================================================
// Fullscreen Camera Demo
// =============================================================================

function FullscreenCameraDemo() {
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  return (
    <div className="relative w-full min-h-[60vh] bg-background rounded-xl border overflow-hidden">
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <Camera
          mode="photo"
          autoStart
          size="fullscreen"
          className="w-full h-full"
          onCapture={(result) => setCapturedImage(result.url)}
        >
          <CameraPreview />
          <CameraPermissions />
          <CameraControls showCapture showSwitch />
        </Camera>
      </div>

      {capturedImage && (
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg border p-2">
            <p className="text-xs text-muted-foreground mb-1">Last capture</p>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-24 h-16 object-cover rounded-md border"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const fullscreenCameraCode = `import {
  Camera,
  CameraPreview,
  CameraControls,
  CameraPermissions,
} from "@/components/ui/camera"

function FullscreenCameraDemo() {
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null)

  return (
    <div className="relative w-full min-h-[60vh] rounded-xl border overflow-hidden">
      <Camera
        mode="photo"
        autoStart
        size="fullscreen"
        className="w-full h-[60vh]"
        onCapture={(result) => setCapturedImage(result.url)}
      >
        <CameraPreview />
        <CameraPermissions />
        <CameraControls showCapture showSwitch />
      </Camera>
    </div>
  )
}`;

// =============================================================================
// Original Demo Components (preserved)
// =============================================================================

function BasicCameraDemo() {
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 min-h-[400px]">
      <Camera
        mode="photo"
        autoStart
        onCapture={(result) => {
          setCapturedImage(result.url);
        }}
        className="w-full max-w-md"
        size="default"
      >
        <CameraPreview />
        <CameraPermissions />
        <CameraControls showCapture showSwitch />
      </Camera>

      {capturedImage && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Captured Image:</p>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-48 h-36 object-cover rounded-lg border"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCapturedImage(null)}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

const basicCameraCode = `import {
  Camera,
  CameraPreview,
  CameraControls,
  CameraPermissions,
} from "@/components/ui/camera"

function BasicCameraDemo() {
  const [capturedImage, setCapturedImage] = React.useState(null)

  return (
    <Camera
      mode="photo"
      autoStart
      onCapture={(result) => setCapturedImage(result.url)}
    >
      <CameraPreview />
      <CameraPermissions />
      <CameraControls showCapture showSwitch />
    </Camera>
  )
}`;

function FaceDetectionDemo() {
  const [faceCount, setFaceCount] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-4 min-h-[400px]">
      <div className="text-center mb-2">
        <Badge variant={faceCount > 0 ? "default" : "secondary"}>
          {faceCount > 0 ? `${faceCount} face(s) detected` : "No face detected"}
        </Badge>
      </div>

      <Camera
        mode="face-detection"
        autoStart
        className="w-full max-w-md"
        size="default"
      >
        <CameraPreview mirror />
        <CameraPermissions />
        <CameraOverlay>
          <FaceDetection
            showGuide
            showBoundingBox
            onFacesDetected={(faces) => setFaceCount(faces.length)}
          />
        </CameraOverlay>
      </Camera>
    </div>
  );
}

const faceDetectionCode = `import {
  Camera,
  CameraPreview,
  CameraOverlay,
  CameraPermissions,
} from "@/components/ui/camera"
import { FaceDetection } from "@/components/ui/camera-features"

function FaceDetectionDemo() {
  const [faceCount, setFaceCount] = React.useState(0)

  return (
    <Camera mode="face-detection" autoStart>
      <CameraPreview mirror />
      <CameraPermissions />
      <CameraOverlay>
        <FaceDetection
          showGuide
          showBoundingBox
          onFacesDetected={(faces) => setFaceCount(faces.length)}
        />
      </CameraOverlay>
    </Camera>
  )
}`;

function IdScannerDemo() {
  const [scanResult, setScanResult] = React.useState<Record<
    string,
    string
  > | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 min-h-[450px]">
      <Camera mode="id-scanner" autoStart className="w-full max-w-lg" size="lg">
        <CameraPreview />
        <CameraPermissions />
        <CameraOverlay>
          <IdCardScanner
            documentType="national-id"
            autoCapture={false}
            onScanComplete={(result) => {
              const fields: Record<string, string> = {};
              Object.entries(result.fields).forEach(([key, val]) => {
                fields[key] = val.value;
              });
              setScanResult(fields);
            }}
          />
        </CameraOverlay>
      </Camera>

      {scanResult && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-sm">Extracted Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(scanResult).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}:
                  </dt>
                  <dd>{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const idScannerCode = `import {
  Camera,
  CameraPreview,
  CameraOverlay,
  CameraPermissions,
} from "@/components/ui/camera"
import { IdCardScanner } from "@/components/ui/camera-features"

function IdScannerDemo() {
  const [scanResult, setScanResult] = React.useState(null)

  return (
    <Camera mode="id-scanner" autoStart>
      <CameraPreview />
      <CameraPermissions />
      <CameraOverlay>
        <IdCardScanner
          documentType="national-id"
          autoCapture={false}
          onScanComplete={(result) => setScanResult(result.fields)}
        />
      </CameraOverlay>
    </Camera>
  )
}`;

function LivenessDemo() {
  const [result, setResult] = React.useState<{
    passed: boolean;
    score: number;
  } | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 min-h-[450px]">
      {result && (
        <div className="text-center">
          <Badge variant={result.passed ? "default" : "destructive"}>
            {result.passed ? "Verification Passed" : "Verification Failed"}
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">
            Score: {result.score.toFixed(0)}%
          </p>
        </div>
      )}

      <Camera
        mode="liveness"
        autoStart
        className="w-full max-w-md"
        size="default"
      >
        <CameraPreview mirror />
        <CameraPermissions />
        <CameraOverlay>
          <LivenessCheck
            autoStart
            onComplete={(livenessResult) => {
              setResult({
                passed: livenessResult.passed,
                score: livenessResult.score,
              });
            }}
          />
        </CameraOverlay>
      </Camera>
    </div>
  );
}

const livenessCode = `import {
  Camera,
  CameraPreview,
  CameraOverlay,
  CameraPermissions,
} from "@/components/ui/camera"
import { LivenessCheck } from "@/components/ui/camera-features"

function LivenessDemo() {
  return (
    <Camera mode="liveness" autoStart>
      <CameraPreview mirror />
      <CameraPermissions />
      <CameraOverlay>
        <LivenessCheck
          onComplete={(result) => {
            console.log("Liveness:", result.passed, result.score)
          }}
        />
      </CameraOverlay>
    </Camera>
  )
}`;

function KYCFlowDemo() {
  const [completed, setCompleted] = React.useState(false);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
          <IconShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold">KYC Completed!</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Identity verification completed successfully. All documents have been
          processed.
        </p>
        <Button onClick={() => setCompleted(false)}>Start Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 min-h-[500px]">
      <KYCFlow
        steps={[
          {
            id: "document-front",
            type: "document-front",
            title: "ID Front",
            description: "Scan the front of your ID",
          },
          {
            id: "selfie",
            type: "selfie",
            title: "Selfie",
            description: "Take a selfie for verification",
          },
        ]}
        documentType="national-id"
        onComplete={() => setCompleted(true)}
        size="default"
      />
    </div>
  );
}

const kycFlowCode = `import { KYCFlow } from "@/components/ui/camera-features"

function KYCFlowDemo() {
  return (
    <KYCFlow
      steps={[
        {
          id: "document-front",
          type: "document-front",
          title: "ID Front",
          description: "Scan the front of your ID",
        },
        {
          id: "document-back",
          type: "document-back",
          title: "ID Back",
          description: "Scan the back of your ID",
        },
        {
          id: "selfie",
          type: "selfie",
          title: "Selfie",
          description: "Take a selfie for verification",
        },
        {
          id: "liveness",
          type: "liveness",
          title: "Liveness Check",
          description: "Complete verification challenges",
        },
      ]}
      documentType="national-id"
      onComplete={(result) => {
        console.log("KYC Complete:", result)
      }}
    />
  )
}`;

function GuidesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 min-h-[300px]">
      <div className="flex flex-col items-center gap-2">
        <Camera mode="photo" size="sm" className="w-64 h-80 rounded-xl">
          <CameraPreview />
          <CameraOverlay interactive={false}>
            <CameraGuide variant="face" isAligned={false} />
          </CameraOverlay>
        </Camera>
        <p className="text-sm text-muted-foreground">
          Face Guide (Not Aligned)
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Camera mode="photo" size="sm" className="w-64 h-80 rounded-xl">
          <CameraPreview />
          <CameraOverlay interactive={false}>
            <CameraGuide
              variant="face"
              isAligned
              showCenterCross
              showMeasurements
            />
          </CameraOverlay>
        </Camera>
        <p className="text-sm text-muted-foreground">Face Guide (Aligned)</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Camera mode="photo" size="md" className="w-80 h-52 rounded-xl">
          <CameraPreview />
          <CameraOverlay interactive={false}>
            <CameraGuide
              variant="document"
              documentType="national-id"
              isAligned={false}
              showMeasurements
              safeZone={{ top: 16, bottom: 16, left: 16, right: 16 }}
            />
          </CameraOverlay>
        </Camera>
        <p className="text-sm text-muted-foreground">Document Guide</p>
      </div>
    </div>
  );
}

const guidesCode = `import { CameraGuide } from "@/components/ui/camera"

// Face oval guide
<CameraGuide variant="face" isAligned={false} />
<CameraGuide
  variant="face"
  isAligned={true}
  showCenterCross
  showMeasurements
/>

// Document frame guide
<CameraGuide
  variant="document"
  documentType="national-id"
  isAligned={false}
  showMeasurements
  safeZone={{ top: 16, bottom: 16, left: 16, right: 16 }}
/>
<CameraGuide variant="document" documentType="passport" isAligned={true} />`;

// =============================================================================
// Usage Code
// =============================================================================

const usageCode = `import {
  Camera,
  CameraPreview,
  CameraControls,
  CameraPermissions,
  CameraOverlay,
  CameraGuide,
  CameraGrid,
  CameraControlBar,
  CameraTimer,
  CameraVoiceControl,
  CameraSettings,
  CameraFocusIndicator,
  CameraZoomIndicator,
  CameraButton,
  CAMERA_DEFAULT_SETTINGS,
} from "@/components/ui/camera"
import {
  FaceDetection,
  IdCardScanner,
  LivenessCheck,
  KYCFlow,
} from "@/components/ui/camera-features"
import { useCamera } from "@/hooks/use-camera"

// Enhanced camera with all new features
function EnhancedCamera() {
  const [settings, setSettings] = React.useState(CAMERA_DEFAULT_SETTINGS)
  
  const {
    zoom,
    focusPoint,
    isFocusing,
    gestureContainerRef,
    timerDuration,
    startTimer,
    capture,
  } = useCamera({
    enableGestures: true,
    gestureOptions: {
      enablePinchToZoom: true,
      enableTapToFocus: true,
    },
  })
  
  return (
    <Camera mode="photo" autoStart>
      <div ref={gestureContainerRef}>
        <CameraPreview />
        <CameraGrid type={settings.grid} />
        <CameraFocusIndicator point={focusPoint} isActive={isFocusing} />
        <CameraZoomIndicator zoom={zoom} />
        
        <CameraControlBar position="top">
          <CameraButton action="flash" />
          <CameraButton
            action="grid"
            gridType={settings.grid}
            onGridChange={(grid) => setSettings({ ...settings, grid })}
          />
          <CameraButton
            action="timer"
            duration={timerDuration}
            onDurationChange={(value) => setTimerDuration(value)}
          />
          <CameraButton action="settings" />
        </CameraControlBar>
        
        <CameraButton
          action="capture"
          size="lg"
          onClick={() => timerDuration > 0 ? startTimer() : capture()}
        />
      </div>
      
      <CameraVoiceControl enabled={settings.voiceControl} />
      <CameraSettings values={settings} onValuesChange={setSettings} />
    </Camera>
  )
}`;

// =============================================================================
// API Reference Data
// =============================================================================

const apiSections = [
  {
    title: "Camera",
    props: [
      {
        prop: "mode",
        type: '"face-detection" | "id-scanner" | "photo" | "video" | "liveness"',
        default: '"photo"',
        description:
          "Camera operation mode determining facingMode and constraints.",
      },
      {
        prop: "facingMode",
        type: '"user" | "environment"',
        description:
          "Camera facing direction. Auto-selected based on mode if not specified.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "fullscreen"',
        default: '"default"',
        description: "Size variant of the camera container.",
      },
      {
        prop: "autoStart",
        type: "boolean",
        default: "false",
        description: "Automatically start camera when component mounts.",
      },
      {
        prop: "onCapture",
        type: "(result: CaptureResult) => void",
        description: "Callback when a photo or video is captured.",
      },
      {
        prop: "onCameraError",
        type: "(error: CameraError) => void",
        description: "Callback when a camera error occurs. Alias: onError.",
      },
    ],
  },
  {
    title: "CameraControlBar",
    props: [
      {
        prop: "position",
        type: '"top" | "bottom" | "left" | "right" | "floating"',
        default: '"top"',
        description: "Position of the control bar on screen.",
      },
      {
        prop: "variant",
        type: '"horizontal" | "vertical" | "floating"',
        default: '"horizontal"',
        description: "Layout orientation of controls.",
      },
      {
        prop: "visible",
        type: "boolean",
        default: "true",
        description: "Whether the control bar is visible.",
      },
    ],
  },
  {
    title: "CameraGridOverlay",
    props: [
      {
        prop: "type",
        type: '"none" | "rule-of-thirds" | "golden-ratio" | "square" | "diagonal" | "center-cross"',
        default: '"none"',
        description: "Type of composition grid to display.",
      },
      {
        prop: "visible",
        type: "boolean",
        default: "true",
        description: "Whether the grid is visible.",
      },
      {
        prop: "color",
        type: "string",
        default: '"#ffffff"',
        description: "Color of the grid lines.",
      },
      {
        prop: "opacity",
        type: "number",
        default: "0.3",
        description: "Opacity of the grid lines (0-1).",
      },
    ],
  },
  {
    title: "CameraTimer",
    props: [
      {
        prop: "duration",
        type: "number",
        description: "Timer duration in seconds.",
      },
      {
        prop: "isActive",
        type: "boolean",
        description: "Whether the timer is currently counting down.",
      },
      {
        prop: "remaining",
        type: "number",
        description: "Remaining time in seconds.",
      },
      {
        prop: "style",
        type: '"number" | "circular" | "bar"',
        default: '"circular"',
        description: "Visual style of the timer display.",
      },
    ],
  },
  {
    title: "CameraVoiceControl",
    props: [
      {
        prop: "enabled",
        type: "boolean",
        default: "false",
        description: "Whether voice control is enabled.",
      },
      {
        prop: "language",
        type: "string",
        default: '"en-US"',
        description: "Language for speech recognition.",
      },
      {
        prop: "onCommand",
        type: "(command: string, phrase: string, confidence: number) => void",
        description: "Callback when a voice command is recognized.",
      },
    ],
  },
  {
    title: "CameraSettings",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Whether the settings panel is open.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when the open state changes.",
      },
      {
        prop: "values",
        type: "CameraSettingsValues",
        description: "Current settings values.",
      },
      {
        prop: "onValuesChange",
        type: "(values: CameraSettingsValues) => void",
        description: "Callback when settings change.",
      },
      {
        prop: "variant",
        type: '"sheet" | "modal" | "panel"',
        default: '"sheet"',
        description: "Display variant of the settings panel.",
      },
    ],
  },
  {
    title: "useCameraGestures",
    description:
      "Hook for handling camera gestures (pinch-to-zoom, tap-to-focus, etc.)",
    props: [
      {
        prop: "enablePinchToZoom",
        type: "boolean",
        default: "true",
        description: "Enable pinch gesture for zooming.",
      },
      {
        prop: "enableTapToFocus",
        type: "boolean",
        default: "true",
        description: "Enable tap gesture for focusing.",
      },
      {
        prop: "enableDoubleTapToCapture",
        type: "boolean",
        default: "true",
        description: "Enable double-tap gesture for capture.",
      },
      {
        prop: "onZoomChange",
        type: "(zoom: number) => void",
        description: "Callback when zoom level changes.",
      },
      {
        prop: "onFocusChange",
        type: "(point: { x: number; y: number }) => void",
        description: "Callback when focus point changes.",
      },
    ],
  },
];

// =============================================================================
// Changelog Data
// =============================================================================

const changelog: Array<{
  version: string;
  date: string;
  changes: Array<{
    type: "added" | "changed" | "fixed" | "deprecated" | "removed" | "breaking";
    title: string;
    description?: string;
  }>;
}> = [
  {
    version: "2.1.0",
    date: "2026-02-02",
    changes: [
      {
        type: "added",
        title: "Fullscreen Camera Size & Demo",
        description:
          "Introduced a fullscreen size variant for the Camera component and a dedicated fullscreen demo tab showcasing full-viewport capture layouts.",
      },
      {
        type: "added",
        title: "Guide Measurements & Safe Zones",
        description:
          "Enhanced CameraGuide with optional measurement overlays (width, height, aspect ratio) and safeZone padding support, with updated demos that stay centered within the camera frame.",
      },
      {
        type: "changed",
        title: "Settings & Keyboard Help Overlays",
        description:
          "Refactored CameraSettings to use the shared Dialog and Drawer components for modal, sheet, and panel variants, and updated CameraKeyboardHelp to render inside the Dialog component for consistent accessibility.",
      },
      {
        type: "changed",
        title: "Minimalist Face Detection & ID Scanner UI",
        description:
          "Refined face and document guides to a minimal, production-ready look: white-to-green alignment coloring, centered oval/rectangular frames, and concise bottom instructions without heavy blur overlays. This keeps the camera feed clear while still guiding users through selfie and document capture flows.",
      },
      {
        type: "fixed",
        title: "Capture & Camera Switching in Demos",
        description:
          "Aligned Enhanced and Basic camera demos to use the shared CaptureButton and SwitchCameraButton wiring so both keyboard shortcuts and UI buttons trigger capture and camera switching reliably.",
      },
      {
        type: "fixed",
        title: "ID Scanner, Liveness Check, and KYC Flow Reliability",
        description:
          "Improved demo flows for IdCardScanner, LivenessCheck, and KYCFlow by adding explicit manual capture for documents, enabling auto-started liveness challenges, and tightening demo state handling so each step can complete as documented.",
      },
      {
        type: "changed",
        title: "CameraScanOverlay Optional Status Text",
        description:
          "Status/instruction text in CameraScanOverlay is now optional. Use showStatusText={false} to hide the instruction badge, or omit statusText to use default messages. Demo updated with a toggle to show or hide the text.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2025-02-02",
    changes: [
      {
        type: "added",
        title: "Enhanced Camera Controls",
        description:
          "New button system with full customization including variants, sizes, shapes, haptic feedback, and animations. Includes CaptureButton, RecordButton, TimerButton, GridButton, SwitchCameraButton, FlashButton, SettingsButton, AspectRatioButton, and ZoomButton.",
      },
      {
        type: "added",
        title: "CameraControlBar Component",
        description:
          "New toolbar component for secondary controls with support for horizontal, vertical, and floating layouts. Includes grouping and divider support.",
      },
      {
        type: "added",
        title: "Customizable Guides",
        description:
          "Enhanced CameraGuide with 20+ preset configurations for KYC, documents, barcodes, and photography. Supports full customization of colors, shapes, animations, and alignment feedback.",
      },
      {
        type: "added",
        title: "Grid Overlays",
        description:
          "New CameraGridOverlay component with multiple composition grids: rule-of-thirds, golden ratio, square, diagonal, and center cross. Configurable colors, opacity, and animations.",
      },
      {
        type: "added",
        title: "Gesture Support",
        description:
          "useCameraGestures hook providing pinch-to-zoom, tap-to-focus, double-tap-to-capture, swipe-to-switch, and long-press gestures. Includes visual feedback components: CameraFocusIndicator and CameraZoomIndicator.",
      },
      {
        type: "added",
        title: "Voice Control",
        description:
          "useCameraVoice hook and CameraVoiceControl component for hands-free camera operation. Supports 8 voice commands: capture, record, stop, switch, zoomIn, zoomOut, flash, and timer.",
      },
      {
        type: "added",
        title: "Timer and Countdown",
        description:
          "useCameraTimer hook and CameraTimer component for delayed capture. Supports multiple visual styles (number, circular, bar) with haptic and sound feedback.",
      },
      {
        type: "added",
        title: "Settings Panel",
        description:
          "CameraSettings component with comprehensive configuration options organized into Photo, Guides, and Accessibility sections. Supports sheet, modal, and panel variants.",
      },
      {
        type: "added",
        title: "Keyboard Shortcuts Help",
        description:
          "CameraKeyboardHelp component displaying all available keyboard shortcuts in an organized, accessible modal. Includes enhanced keyboard navigation with 20+ shortcuts.",
      },
      {
        type: "changed",
        title: "Accessibility Enhancements",
        description:
          "Full WCAG 2.1 AA compliance with improved screen reader announcements, keyboard navigation, focus management, and reduced motion support throughout all components.",
      },
      {
        type: "changed",
        title: "TypeScript Types",
        description:
          "Comprehensive type definitions for all new features including CameraSettingsValues, CameraGridType, CameraGuideConfig, and more.",
      },
      {
        type: "changed",
        title: "Haptic Feedback",
        description:
          "Integrated haptic feedback patterns (light, medium, heavy, success, error, warning) across all interactive components for improved tactile feedback.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-01-01",
    changes: [
      {
        type: "added",
        title: "Initial Release",
        description:
          "Core camera functionality with photo/video capture, face detection using TensorFlow.js, ID card scanning with OCR, liveness detection, and KYC flow support.",
      },
    ],
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

export default function CameraPage() {
  const features = [
    {
      title: "Face Detection",
      description:
        "Real-time face detection using TensorFlow.js BlazeFace model with facial landmark tracking.",
      icon: <IconUserScan className="h-5 w-5" />,
    },
    {
      title: "ID Card Scanner",
      description:
        "Document scanning with OCR powered by Tesseract.js, supporting ID cards, passports, and driver's licenses.",
      icon: <IconId className="h-5 w-5" />,
    },
    {
      title: "Liveness Detection",
      description:
        "Anti-spoofing verification with challenges like blink detection and head turn tracking.",
      icon: <IconShieldCheck className="h-5 w-5" />,
    },
    {
      title: "Mobile Optimized",
      description:
        "Touch-friendly controls, camera switching, and optimized performance for mobile devices.",
      icon: <IconDeviceMobile className="h-5 w-5" />,
    },
    {
      title: "Accessible",
      description:
        "WCAG 2.1 AA compliant with screen reader announcements, keyboard navigation, and reduced motion support.",
      icon: <IconAccessible className="h-5 w-5" />,
    },
    {
      title: "KYC Flow",
      description:
        "Complete identity verification wizard combining document scanning, selfie capture, and liveness check.",
      icon: <IconCamera className="h-5 w-5" />,
    },
    {
      title: "Gesture Support",
      description:
        "Pinch-to-zoom, tap-to-focus, double-tap capture, and swipe gestures with visual feedback.",
      icon: <IconFocus className="h-5 w-5" />,
    },
    {
      title: "Voice Control",
      description:
        "Hands-free camera operation with voice commands for capture, zoom, flash, and more.",
      icon: <IconMicrophone className="h-5 w-5" />,
    },
    {
      title: "Grid Overlays",
      description:
        "Composition guides including rule-of-thirds, golden ratio, and diagonal grids for better framing.",
      icon: <IconGrid3x3 className="h-5 w-5" />,
    },
    {
      title: "Timer and Settings",
      description:
        "Self-timer with countdown and comprehensive settings panel for photo, guides, and accessibility.",
      icon: <IconClock className="h-5 w-5" />,
    },
  ];

  const shortcuts = [
    { keys: "Space", description: "Capture photo" },
    { keys: "Tab", description: "Navigate between controls" },
    { keys: "Enter", description: "Activate focused control" },
    { keys: "Esc", description: "Cancel/Close camera" },
    { keys: "S", description: "Switch camera (front/back)" },
    { keys: "F", description: "Toggle flash" },
    { keys: "+ / -", description: "Zoom in/out" },
    { keys: "0", description: "Reset zoom" },
    { keys: "G", description: "Toggle grid" },
    { keys: "T", description: "Toggle timer" },
    { keys: ",", description: "Open settings" },
    { keys: "?", description: "Show keyboard shortcuts" },
  ];

  const demoTabs = [
    {
      value: "enhanced",
      label: "Enhanced (New)",
      demo: (
        <DemoWrapper
          title="Enhanced Camera"
          description="Complete camera with all new features: gestures, voice control, timer, grid overlays, and settings panel."
          code={enhancedCameraCode}
        >
          <EnhancedCameraDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "fullscreen",
      label: "Fullscreen",
      demo: (
        <DemoWrapper
          title="Fullscreen Camera"
          description="Fullscreen-style camera layout using the fullscreen size variant, ideal for hero sections or capture flows."
          code={fullscreenCameraCode}
        >
          <FullscreenCameraDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "scan-overlay",
      label: "Scan Overlays",
      demo: (
        <DemoWrapper
          title="Scan Overlays (Face & ID)"
          description="Professional face recognition and ID card scanner overlays for KYC and document verification."
          code={scanOverlayCode}
        >
          <ScanOverlayDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "grids",
      label: "Grid Overlays",
      demo: (
        <DemoWrapper
          title="Composition Grids"
          description="Multiple grid overlays for better photo composition."
          code={gridOverlaysCode}
        >
          <GridOverlaysDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Camera"
          description="Simple camera capture with photo mode and camera switching."
          code={basicCameraCode}
        >
          <BasicCameraDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "face-detection",
      label: "Face Detection",
      demo: (
        <DemoWrapper
          title="Face Detection"
          description="Real-time face detection using TensorFlow.js with oval guide overlay."
          code={faceDetectionCode}
        >
          <FaceDetectionDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "id-scanner",
      label: "ID Scanner",
      demo: (
        <DemoWrapper
          title="ID Card Scanner"
          description="Document scanning with OCR text extraction and field parsing."
          code={idScannerCode}
        >
          <IdScannerDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "liveness",
      label: "Liveness Check",
      demo: (
        <DemoWrapper
          title="Liveness Detection"
          description="Anti-spoofing verification with blink and head turn challenges."
          code={livenessCode}
        >
          <LivenessDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "kyc-flow",
      label: "KYC Flow",
      demo: (
        <DemoWrapper
          title="KYC Verification Flow"
          description="Complete identity verification wizard with document scanning, selfie, and liveness check."
          code={kycFlowCode}
        >
          <KYCFlowDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "guides",
      label: "Guides",
      demo: (
        <DemoWrapper
          title="Visual Guides"
          description="Face oval and document frame guides for positioning assistance."
          code={guidesCode}
        >
          <GuidesDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Camera"
        version="v2.0"
        description="A comprehensive camera component system with face detection, ID card scanning, liveness verification, KYC flow, gesture support, voice control, and advanced accessibility features for identity verification."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="enhanced" lazyMount />

      <KeyboardShortcuts shortcuts={shortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and compose camera components for your use case."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for all camera components."
      />

      <Changelog
        entries={changelog}
        title="Changelog"
        description="Version history and changes for the Camera component."
      />
    </ComponentPage>
  );
}
