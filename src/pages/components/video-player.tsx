import { useState, useRef, useEffect } from "react"
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolume3,
  IconMaximize,
  IconSettings,
  IconPictureInPicture,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
} from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

function BasicDemo() {
  return (
    <div className="flex items-center justify-center rounded-lg border bg-muted/50 p-8">
      <div className="text-center">
        <video
          className="rounded-lg shadow-lg"
          width="640"
          height="360"
          controls
          poster="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="mt-3 text-sm text-muted-foreground">
          Standard HTML5 video with default controls
        </p>
      </div>
    </div>
  )
}

const basicCode = `import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer
  src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
  controls
/>`

function CustomControlsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }

      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value
      setVolume(value)
      setIsMuted(value === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-black">
        <video
          ref={videoRef}
          className="w-full"
          poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <Slider
          value={currentTime}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying ? (
                <IconPlayerPause className="w-5 h-5" />
              ) : (
                <IconPlayerPlay className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <IconVolume3 className="w-5 h-5" />
              ) : (
                <IconVolume className="w-5 h-5" />
              )}
            </Button>
            <Slider
              value={isMuted ? 0 : volume}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <IconSettings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <IconPictureInPicture className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <IconMaximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const customControlsCode = `import { useRef, useState } from "react"
import { IconPlayerPlay, IconPlayerPause, IconVolume, IconVolume3 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

function CustomControlsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play()
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div>
      <video
        ref={videoRef}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
      >
        <source src="video.mp4" />
      </video>
      
      <div className="controls">
        <Button onClick={togglePlay}>
          {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
        </Button>
        <Slider
          value={currentTime}
          max={duration}
          onValueChange={(v) => {
            videoRef.current!.currentTime = v
            setCurrentTime(v)
          }}
        />
      </div>
    </div>
  )
}`

function KeyboardShortcutsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }

      setIsPlaying(!isPlaying)
    }
  }

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const changeSpeed = (delta: number) => {
    const newSpeed = Math.max(0.25, Math.min(2, speed + delta))
    setSpeed(newSpeed)

    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-black">
        <video
          ref={videoRef}
          className="w-full"
          poster="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={togglePlay}>
          {isPlaying ? "Pause (Space)" : "Play (Space)"}
        </Button>
        <Button variant="outline" onClick={() => handleSkip(-10)}>
          <IconPlayerSkipBack className="w-4 h-4 mr-2" />
          Rewind 10s (←)
        </Button>
        <Button variant="outline" onClick={() => handleSkip(10)}>
          Forward 10s (→)
          <IconPlayerSkipForward className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" onClick={() => changeSpeed(-0.25)}>
          Slower {"(<)"}
        </Button>
        <Button variant="outline" onClick={() => changeSpeed(0.25)}>
          Faster {"(>)"}
        </Button>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium mb-2">Current Speed</p>
        <Badge variant="secondary">{speed}x</Badge>
      </div>
    </div>
  )
}

const keyboardShortcutsCode = `import { useRef, useState, useEffect } from "react"
import { IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

function KeyboardControlsDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [speed, setSpeed] = useState(1)

  const handleSkip = (seconds: number) => {
    videoRef.current!.currentTime += seconds
  }

  const changeSpeed = (delta: number) => {
    const newSpeed = Math.max(0.25, Math.min(2, speed + delta))
    setSpeed(newSpeed)
    videoRef.current!.playbackRate = newSpeed
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          handleSkip(-10)
          break
        case "ArrowRight":
          handleSkip(10)
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div>
      <video ref={videoRef}>
        <source src="video.mp4" />
      </video>
      <Button onClick={() => handleSkip(-10)}>
        <IconPlayerSkipBack /> Rewind 10s
      </Button>
    </div>
  )
}`

function PictureInPictureDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPiP, setIsPiP] = useState(false)

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setIsPiP(false)
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture()
        setIsPiP(true)
      }
    } catch (error) {
      console.error("PiP error:", error)
    }
  }

  const handlePiPChange = () => {
    setIsPiP(!!document.pictureInPictureElement)
  }

  useEffect(() => {
    videoRef.current?.addEventListener("enterpictureinpicture", handlePiPChange)
    videoRef.current?.addEventListener("leavepictureinpicture", handlePiPChange)

    return () => {
      videoRef.current?.removeEventListener("enterpictureinpicture", handlePiPChange)
      videoRef.current?.removeEventListener("leavepictureinpicture", handlePiPChange)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-black">
        <video
          ref={videoRef}
          className="w-full"
          controls
          poster="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="flex gap-3">
        <Button onClick={togglePiP} variant={isPiP ? "secondary" : "default"}>
          <IconPictureInPicture className="w-4 h-4 mr-2" />
          {isPiP ? "Exit Picture-in-Picture" : "Picture-in-Picture"}
        </Button>
      </div>

      {isPiP && (
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Video is playing in Picture-in-Picture mode. You can browse the page while watching!
          </p>
        </div>
      )}
    </div>
  )
}

const pictureInPictureCode = `import { useRef, useState, useEffect } from "react"
import { IconPictureInPicture } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

function PictureInPictureDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPiP, setIsPiP] = useState(false)

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await videoRef.current!.requestPictureInPicture()
      }
    } catch (error) {
      console.error("PiP error:", error)
    }
  }

  useEffect(() => {
    const handlePiPChange = () => {
      setIsPiP(!!document.pictureInPictureElement)
    }
    videoRef.current?.addEventListener("enterpictureinpicture", handlePiPChange)
    videoRef.current?.addEventListener("leavepictureinpicture", handlePiPChange)
    return () => {
      videoRef.current?.removeEventListener("enterpictureinpicture", handlePiPChange)
      videoRef.current?.removeEventListener("leavepictureinpicture", handlePiPChange)
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} controls>
        <source src="video.mp4" />
      </video>
      <Button onClick={togglePiP}>
        <IconPictureInPicture />
        Picture-in-Picture
      </Button>
    </div>
  )
}`

function PlaybackSpeedDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [speed, setSpeed] = useState(1)

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed)

    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-black">
        <video
          ref={videoRef}
          className="w-full"
          controls
          poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium mb-3">Playback Speed</p>
        <div className="flex flex-wrap gap-2">
          {speeds.map((s) => (
            <Button
              key={s}
              variant={speed === s ? "default" : "outline"}
              size="sm"
              onClick={() => changeSpeed(s)}
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Badge variant="secondary" className="text-sm">
          Current Speed: {speed}x
        </Badge>
      </div>
    </div>
  )
}

const playbackSpeedCode = `import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function PlaybackSpeedDemo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [speed, setSpeed] = useState(1)

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed)
    videoRef.current!.playbackRate = newSpeed
  }

  return (
    <div>
      <video ref={videoRef} controls>
        <source src="video.mp4" />
      </video>
      
      <div className="flex gap-2">
        {speeds.map((s) => (
          <Button
            key={s}
            variant={speed === s ? "default" : "outline"}
            onClick={() => changeSpeed(s)}
          >
            {s}x
          </Button>
        ))}
      </div>
      
      <Badge>Current: {speed}x</Badge>
    </div>
  )
}`

const usageCode = `import { VideoPlayer } from "@/components/ui/video-player"

export function MyComponent() {
  return (
    <VideoPlayer
      src="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      title="My Video"
      controls
      autoplay={false}
      loop={false}
      muted={false}
      className="w-full rounded-lg"
    />
  )
}`

export default function VideoPlayerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Video Player"
        description="A fully-featured video player component with custom controls, keyboard shortcuts, playback speed control, and Picture-in-Picture support."
        version="1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Custom Controls",
            description: "Fully customizable video controls with play/pause, volume, scrubber, and fullscreen buttons.",
          },
          {
            title: "Keyboard Shortcuts",
            description: "Full keyboard navigation with Space for play/pause, arrows for seeking, and more.",
          },
          {
            title: "Picture-in-Picture",
            description: "Native Picture-in-Picture API support for watching while browsing.",
          },
        ]}
      />

      <DemoTabs
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Video Player"
                description="Standard HTML5 video with default browser controls."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "custom",
            label: "Custom Controls",
            demo: (
              <DemoWrapper
                title="Custom Video Controls"
                description="Fully styled custom controls with play/pause, volume slider, and progress scrubber."
                code={customControlsCode}
              >
                <CustomControlsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "keyboard",
            label: "Keyboard",
            demo: (
              <DemoWrapper
                title="Keyboard Shortcuts"
                description="Keyboard controls for play/pause, seeking, and playback speed."
                code={keyboardShortcutsCode}
              >
                <KeyboardShortcutsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "pip",
            label: "Picture-in-Picture",
            demo: (
              <DemoWrapper
                title="Picture-in-Picture"
                description="Watch videos in a floating window while browsing."
                code={pictureInPictureCode}
              >
                <PictureInPictureDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "speed",
            label: "Playback Speed",
            demo: (
              <DemoWrapper
                title="Playback Speed Control"
                description="Adjust playback speed from 0.25x to 2x for faster or slower viewing."
                code={playbackSpeedCode}
              >
                <PlaybackSpeedDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation example with all common props."
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Space", description: "Toggle play/pause" },
          { keys: "← / →", description: "Seek backward/forward 10 seconds" },
          { keys: "↑ / ↓", description: "Volume up/down" },
          { keys: "M", description: "Toggle mute" },
          { keys: "F", description: "Toggle fullscreen" },
          { keys: "< / >", description: "Playback speed -/+ 0.25x" },
          { keys: "Home / End", description: "Seek to start/end" },
          { keys: "0-9", description: "Seek to percentage (0=0%, 9=90%)" },
        ]}
        title="Keyboard Shortcuts"
        description="Full keyboard support for accessible video control"
      />

      <APIReference
        sections={[
          {
            title: "VideoPlayer",
            props: [
              {
                prop: "src",
                type: "string",
                default: "-",
                description: "URL of the video file to play.",
              },
              {
                prop: "poster",
                type: "string",
                default: "-",
                description: "Image URL to display before video loads.",
              },
              {
                prop: "autoplay",
                type: "boolean",
                default: "false",
                description: "Automatically start playing when loaded.",
              },
              {
                prop: "controls",
                type: "boolean",
                default: "true",
                description: "Show browser default controls.",
              },
              {
                prop: "loop",
                type: "boolean",
                default: "false",
                description: "Restart video automatically when it ends.",
              },
              {
                prop: "muted",
                type: "boolean",
                default: "false",
                description: "Mute audio by default.",
              },
              {
                prop: "preload",
                type: "'auto' | 'metadata' | 'none'",
                default: "'metadata'",
                description: "How the video should be preloaded.",
              },
              {
                prop: "playbackRate",
                type: "number",
                default: "1",
                description: "Playback speed multiplier (0.25 to 2).",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for the container.",
              },
            ],
          },
          {
            title: "Events",
            props: [
              {
                prop: "onPlay",
                type: "() => void",
                default: "-",
                description: "Fired when video starts playing.",
              },
              {
                prop: "onPause",
                type: "() => void",
                default: "-",
                description: "Fired when video is paused.",
              },
              {
                prop: "onEnded",
                type: "() => void",
                default: "-",
                description: "Fired when video reaches the end.",
              },
              {
                prop: "onTimeUpdate",
                type: "(time: number) => void",
                default: "-",
                description: "Fired during playback with current time.",
              },
              {
                prop: "onProgress",
                type: "(loaded: number) => void",
                default: "-",
                description: "Fired as video loads with buffer amount.",
              },
              {
                prop: "onError",
                type: "(error: Error) => void",
                default: "-",
                description: "Fired when video loading fails.",
              },
              {
                prop: "onLoadedMetadata",
                type: "(metadata: VideoMetadata) => void",
                default: "-",
                description: "Fired when video metadata is loaded.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
