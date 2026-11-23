# Camera

Compound browser camera suite for photo and video capture with permission recovery, recording controls, timers, zoom and focus, composition grids, and face/document scan guides. It adds keyboard, gesture, voice, and haptic controls, while KiraCamera provides a capture/file-selection review workflow with abortable asynchronous acceptance.

## Install

```bash
kira-kit add @kira-kit/camera
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/camera-lib
- @kira-kit/dialog
- @kira-kit/drawer
- @kira-kit/select
- @kira-kit/switch
- @kira-kit/tabs
- @kira-kit/use-camera
- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { Camera } from "@/components/ui/camera";
<Camera> text</Camera>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
