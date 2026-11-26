import type { ComponentProps as ReactComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
  IconMaximize,
  IconPictureInPicture,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconVideoOff,
  IconVolume,
  IconVolume3,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function BasicDemo() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-muted/40 p-4 sm:p-6">
      <div className="w-full space-y-3 text-center">
        <video
          className="aspect-video w-full rounded-lg border border-border bg-card shadow-sm"
          controls
          preload="metadata"
          poster="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80"
        >
          <source src={SAMPLE_VIDEO} type="video/mp4" />
          <track
            kind="captions"
            src="/captions/big-buck-bunny.en.vtt"
            srcLang="en"
            label="English sound captions"
            default
          />
          Your browser does not support HTML5 video.
        </video>
        <p className="text-xs text-muted-foreground">
          Native HTML5 video with default controls and English captions track.
        </p>
      </div>
    </div>
  );
}

const basicCode = `<video
  className="aspect-video w-full rounded-lg border border-border"
  controls
  preload="metadata"
  poster="/poster.jpg"
>
  <source src="/video.mp4" type="video/mp4" />
  <track kind="captions" src="/captions.en.vtt" srcLang="en" label="English" default />
</video>`;

function CustomControlsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playback = useVideoPlayback(videoRef);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <video
          ref={videoRef}
          className="aspect-video w-full"
          preload="metadata"
          poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
          onTimeUpdate={playback.handleTimeUpdate}
          onLoadedMetadata={playback.handleLoadedMetadata}
          onPlay={() => playback.setIsPlaying(true)}
          onPause={() => playback.setIsPlaying(false)}
        >
          <source src={SAMPLE_VIDEO} type="video/mp4" />
          <track
            kind="captions"
            src="/captions/big-buck-bunny.en.vtt"
            srcLang="en"
            label="English sound captions"
            default
          />
        </video>
      </div>

      <CustomControlsBar
        currentTime={playback.currentTime}
        duration={playback.duration}
        handleSeek={playback.handleSeek}
        togglePlay={playback.togglePlay}
        isPlaying={playback.isPlaying}
        toggleMute={playback.toggleMute}
        isMuted={playback.isMuted}
        volume={playback.volume}
        handleVolumeChange={playback.handleVolumeChange}
        onToggleFullscreen={playback.toggleFullscreen}
        onTogglePiP={playback.togglePiP}
      />
    </div>
  );
}

const customControlsCode = `import { useRef, useState } from "react"
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function CustomControlsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else void video.play()
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        className="aspect-video w-full rounded-lg border"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label={isPlaying ? "Pause" : "Play"} onClick={togglePlay}>
          {isPlaying ? <IconPlayerPause className="size-5" /> : <IconPlayerPlay className="size-5" />}
        </Button>
        <Slider
          aria-label="Seek timeline"
          value={currentTime}
          max={duration || 100}
          onValueChange={(next) => {
            if (videoRef.current) videoRef.current.currentTime = next
            setCurrentTime(next)
          }}
        />
      </div>
    </div>
  )
}`;

function KeyboardControlsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () =>
    toggleVideoPlayback(videoRef.current, isPlaying, setIsPlaying);

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      videoRef.current.currentTime + seconds,
    );
  };

  const changeSpeed = (delta: number) => {
    const nextSpeed = Math.max(0.25, Math.min(2, speed + delta));
    setSpeed(nextSpeed);

    if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleSkip(-10);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleSkip(10);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <video
          ref={videoRef}
          className="aspect-video w-full"
          preload="metadata"
          poster="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={SAMPLE_VIDEO} type="video/mp4" />
          <track
            kind="captions"
            src="/captions/big-buck-bunny.en.vtt"
            srcLang="en"
            label="English sound captions"
            default
          />
        </video>
      </div>

      <div
        role="toolbar"
        tabIndex={-1}
        aria-label="Video playback shortcuts"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap items-center gap-2"
      >
        <Button variant="outline" size="sm" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSkip(-10)}>
          <IconPlayerSkipBack aria-hidden="true" className="mr-1 size-4" />
          Rewind 10s
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSkip(10)}>
          Forward 10s
          <IconPlayerSkipForward aria-hidden="true" className="ml-1 size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => changeSpeed(-0.25)}>
          Slower
        </Button>
        <Button variant="outline" size="sm" onClick={() => changeSpeed(0.25)}>
          Faster
        </Button>
        <Badge variant="secondary">{speed}x</Badge>
      </div>
    </div>
  );
}

const keyboardShortcutsCode = `// Scope shortcuts to the focused player container rather than global window
<div
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === " ") {
      event.preventDefault()
      togglePlay()
    } else if (event.key === "ArrowLeft") {
      handleSkip(-10)
    } else if (event.key === "ArrowRight") {
      handleSkip(10)
    }
  }}
>
  <video ref={videoRef}><source src="/video.mp4" type="video/mp4" /></video>
</div>`;

function PictureInPictureDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPiP, setIsPiP] = useState(false);

  const togglePiP = async () => {
    if (!("pictureInPictureEnabled" in document)) return;

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPiP(false);
    } else if (videoRef.current) {
      await videoRef.current.requestPictureInPicture();
      setIsPiP(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const syncPiP = () => setIsPiP(Boolean(document.pictureInPictureElement));

    video?.addEventListener("enterpictureinpicture", syncPiP);
    video?.addEventListener("leavepictureinpicture", syncPiP);

    return () => {
      video?.removeEventListener("enterpictureinpicture", syncPiP);
      video?.removeEventListener("leavepictureinpicture", syncPiP);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <video
          ref={videoRef}
          className="aspect-video w-full"
          controls
          preload="metadata"
          poster="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80"
        >
          <source src={SAMPLE_VIDEO} type="video/mp4" />
          <track
            kind="captions"
            src="/captions/big-buck-bunny.en.vtt"
            srcLang="en"
            label="English sound captions"
            default
          />
        </video>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => void togglePiP()}
          variant={isPiP ? "secondary" : "default"}
        >
          <IconPictureInPicture aria-hidden="true" className="mr-2 size-4" />
          {isPiP ? "Exit Picture-in-Picture" : "Picture-in-Picture"}
        </Button>
        {isPiP && <Badge variant="info">Playing in Picture-in-Picture</Badge>}
      </div>
    </div>
  );
}

const pictureInPictureCode = `const togglePiP = async () => {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture()
  } else if (videoRef.current) {
    await videoRef.current.requestPictureInPicture()
  }
}`;

function PlaybackSpeedDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(1);

  const changeSpeed = (nextSpeed: number) => {
    setSpeed(nextSpeed);

    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        <video
          ref={videoRef}
          className="aspect-video w-full"
          controls
          preload="metadata"
          poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80"
        >
          <source src={SAMPLE_VIDEO} type="video/mp4" />
          <track
            kind="captions"
            src="/captions/big-buck-bunny.en.vtt"
            srcLang="en"
            label="English sound captions"
            default
          />
        </video>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-2">
          {playbackSpeeds.map((option) => (
            <Button
              key={option}
              variant={speed === option ? "default" : "outline"}
              size="sm"
              aria-pressed={speed === option}
              onClick={() => changeSpeed(option)}
            >
              {option}x
            </Button>
          ))}
        </div>
        <Badge variant="secondary">Current: {speed}x</Badge>
      </div>
    </div>
  );
}

const playbackSpeedCode = `const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

{speeds.map((option) => (
  <Button
    key={option}
    size="sm"
    variant={speed === option ? "default" : "outline"}
    aria-pressed={speed === option}
    onClick={() => {
      setSpeed(option)
      if (videoRef.current) videoRef.current.playbackRate = option
    }}
  >
    {option}x
  </Button>
))}`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-3 rounded-lg border border-border bg-card p-3">
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted text-muted-foreground">
        <IconVideoOff aria-hidden="true" className="size-6" />
        <span className="text-xs font-medium">No video stream loaded</span>
      </div>
      <div className="space-y-1">
        <p className="truncate text-sm font-semibold text-foreground">
          QuarterlyEngineeringAllHandsRecording_2026_1080p_Master.mp4
        </p>
        <p className="text-xs text-muted-foreground">0:00 / 0:00</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-sm" variant="outline" aria-label="Play" disabled>
          <IconPlayerPlay aria-hidden="true" className="size-4" />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Mute" disabled>
          <IconVolume aria-hidden="true" className="size-4" />
        </Button>
        <Badge variant="outline">Captions off</Badge>
      </div>
    </div>
  );
}

const stressCode = `// Narrow max-w-xs container: missing stream fallback, long filename truncation, disabled controls
<div className="max-w-xs space-y-3 rounded-lg border p-3">
  <div role="img" aria-label="Video source unavailable" className="flex aspect-video items-center justify-center rounded-md border border-dashed bg-muted">
    <span className="text-xs text-muted-foreground">No video stream loaded</span>
  </div>
  <p className="truncate text-sm font-semibold">QuarterlyAllHands_2026_1080p.mp4</p>
  <Button size="icon-sm" variant="outline" aria-label="Play" disabled>
    <IconPlayerPlay aria-hidden="true" className="size-4" />
  </Button>
</div>`;

const usageCode = `import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function ComposableVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (playing) video.pause()
    else void video.play()
    setPlaying(!playing)
  }

  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        className="aspect-video w-full rounded-lg border border-border"
        preload="metadata"
        poster="/poster.jpg"
        onTimeUpdate={() => setTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
      >
        <source src="/video.mp4" type="video/mp4" />
        <track kind="captions" src="/captions.en.vtt" srcLang="en" label="English" default />
      </video>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={toggle}>{playing ? "Pause" : "Play"}</Button>
        <Slider
          aria-label="Seek timeline"
          value={time}
          max={duration || 100}
          onValueChange={(next) => {
            if (videoRef.current) videoRef.current.currentTime = next
            setTime(next)
          }}
        />
      </div>
    </div>
  )
}`;

export default function VideoPlayerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Video Player"
        description="Composable HTML5 video player patterns built with Kira Kit Button, Slider, and Badge controls, captions, playback speed, and Picture-in-Picture."
        version="v1.0.0"
      />

      <FeatureGrid
        features={videoPlayerPageFeatures}
        description="Media playback recipes combining native browser APIs with accessible Kira Kit controls."
      />

      <DemoTabs defaultValue="basic" tabs={videoPlayerPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={videoPlayerPageShortcuts}
        description="Keyboard bindings supported by the focused player container and native HTML5 video controls."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose native <video> with Button and Slider primitives."
        notes={videoPlayerPageUsageNotes}
      />

      <APIReference
        sections={videoPlayerPageAPISections}
        description="Key HTML5 <video> attributes, media properties, and DOM events used in these recipes."
      />

      <Changelog
        entries={videoPlayerPageChangelogEntries}
        title="Changelog"
        description="Version history for video player patterns."
      />
    </ComponentPage>
  );
}

const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

const videoPlayerPageFeatures = [
  {
    title: "Accessible Custom Controls",
    description:
      "Compose Slider scrubbers and labelled icon Button controls with full keyboard focus support.",
  },
  {
    title: "Captions & Playback Speed",
    description:
      "Native <track kind='captions'> support alongside discrete playbackRate presets.",
  },
  {
    title: "Picture-in-Picture & Fullscreen",
    description:
      "Progressive enhancement over standard browser PiP and Fullscreen APIs.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const videoPlayerPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Native Video Player"
        description="Standard HTML5 video with browser controls, poster frame, and English captions."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "custom",
    label: "Custom Controls",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Custom Video Controls"
        description="Accessible play/pause, mute, volume, scrubber, PiP, and fullscreen toolbar."
        code={customControlsCode}
      >
        <CustomControlsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "speed",
    label: "Playback Speed",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Playback Speed Control"
        description="Adjust playback rate from 0.25x to 2x with pressed state indicators."
        code={playbackSpeedCode}
      >
        <PlaybackSpeedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "keyboard",
    label: "Keyboard",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Keyboard Controls"
        description="Focus the player frame to play/pause with Space and seek ±10s with Left/Right arrows."
        code={keyboardShortcutsCode}
      >
        <KeyboardControlsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "pip",
    label: "Picture-in-Picture",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Picture-in-Picture"
        description="Pop out video into a floating window while continuing to browse."
        code={pictureInPictureCode}
      >
        <PictureInPictureDemo />
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
        description="Unavailable video stream fallback, long filename truncation, and disabled toolbar controls inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const videoPlayerPageShortcuts = [
  {
    keys: "Space",
    group: "Playback",
    description: "Toggle play/pause when the player container has focus.",
  },
  {
    keys: "← / →",
    group: "Playback",
    description: "Seek backward or forward 10 seconds.",
  },
  {
    keys: "Tab / Shift + Tab",
    group: "Navigation",
    description:
      "Move focus across custom play, mute, scrubber, and PiP controls.",
  },
  {
    keys: "Enter / Space",
    group: "Activation",
    description: "Activate focused toolbar buttons or speed presets.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const videoPlayerPageUsageNotes = [
  {
    label: "Composable recipe",
    body: "Video Player is a composition pattern built on native <video> plus @/components/ui/button and @/components/ui/slider — there is no separate registry primitive to install.",
  },
  {
    label: "Captions attribution",
    body: "Sample Big Buck Bunny sound captions by Demuxed (CC BY 3.0). Always ship a <track kind='captions'> element for WCAG 1.2.2 compliance.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const videoPlayerPageAPISections = [
  {
    title: "HTML <video> Attributes",
    props: [
      {
        prop: "poster",
        type: "string",
        default: "-",
        description: "Preview image displayed before playback begins.",
      },
      {
        prop: "controls",
        type: "boolean",
        default: "false",
        description: "Show native browser playback controls.",
      },
      {
        prop: "preload",
        type: '"auto" | "metadata" | "none"',
        default: '"metadata"',
        description:
          "Controls how much media data the browser fetches up front.",
      },
      {
        prop: "muted / loop / playsInline",
        type: "boolean",
        default: "false",
        description: "Standard playback behavior attributes.",
      },
    ],
  },
  {
    title: "HTMLVideoElement Properties & Events",
    props: [
      {
        prop: "currentTime / duration",
        type: "number",
        default: "0",
        description: "Playback position and total length in seconds.",
      },
      {
        prop: "playbackRate / volume",
        type: "number",
        default: "1",
        description: "Speed multiplier (0.25–2) and audio level (0–1).",
      },
      {
        prop: "onTimeUpdate / onLoadedMetadata",
        type: "ReactEventHandler<HTMLVideoElement>",
        default: "-",
        description: "Sync React scrubber state with media playback.",
      },
      {
        prop: "onPlay / onPause / onEnded",
        type: "ReactEventHandler<HTMLVideoElement>",
        default: "-",
        description: "Track playback lifecycle transitions.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const videoPlayerPageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Composable video player guide",
        description:
          "Documented accessible HTML5 video patterns with labelled custom controls, focused keyboard bindings, Picture-in-Picture, playback speed, and stress cases.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

interface CustomControlsBarProps {
  currentTime: number;
  duration: number;
  handleSeek: (value: number) => void;
  togglePlay: () => void;
  isPlaying: boolean;
  toggleMute: () => void;
  isMuted: boolean;
  volume: number;
  handleVolumeChange: (value: number) => void;
  onTogglePiP: () => void;
  onToggleFullscreen: () => void;
}

function CustomControlsWindowActions({
  onTogglePiP,
  onToggleFullscreen,
}: {
  onTogglePiP: () => void;
  onToggleFullscreen: () => void;
}) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle Picture-in-Picture"
        onClick={onTogglePiP}
      >
        <IconPictureInPicture aria-hidden="true" className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle fullscreen"
        onClick={onToggleFullscreen}
      >
        <IconMaximize aria-hidden="true" className="size-5" />
      </Button>
    </div>
  );
}

function CustomControlsBar(props: CustomControlsBarProps) {
  const {
    currentTime,
    duration,
    handleSeek,
    togglePlay,
    isPlaying,
    toggleMute,
    isMuted,
    volume,
    handleVolumeChange,
    onTogglePiP,
    onToggleFullscreen,
  } = props;

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <Slider
        aria-label="Seek timeline"
        value={currentTime}
        max={duration > 0 ? duration : 100}
        step={0.1}
        onValueChange={handleSeek}
        className="w-full"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isPlaying ? "Pause video" : "Play video"}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <IconPlayerPause aria-hidden="true" className="size-5" />
            ) : (
              <IconPlayerPlay aria-hidden="true" className="size-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            onClick={toggleMute}
          >
            {isMuted ? (
              <IconVolume3 aria-hidden="true" className="size-5" />
            ) : (
              <IconVolume aria-hidden="true" className="size-5" />
            )}
          </Button>
          <Slider
            aria-label="Volume"
            value={isMuted ? 0 : volume}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
          <span className="font-mono text-xs text-muted-foreground">
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </span>
        </div>
        <CustomControlsWindowActions
          onTogglePiP={onTogglePiP}
          onToggleFullscreen={onToggleFullscreen}
        />
      </div>
    </div>
  );
}

function formatVideoTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function toggleVideoPlayback(
  video: HTMLVideoElement | null,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (!video) return;

  if (isPlaying) video.pause();
  else void video.play();
  setIsPlaying(!isPlaying);
}

function useVideoPlayback(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () =>
    toggleVideoPlayback(videoRef.current, isPlaying, setIsPlaying);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePiP = () => {
    if (!("pictureInPictureEnabled" in document)) return;

    if (document.pictureInPictureElement) {
      void document.exitPictureInPicture();
    } else if (videoRef.current) {
      void videoRef.current.requestPictureInPicture();
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (videoRef.current) {
      void videoRef.current.requestFullscreen();
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    setIsPlaying,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    togglePiP,
    toggleFullscreen,
  };
}
