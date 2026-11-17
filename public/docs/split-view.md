# Split View

Resizable two-pane layout with horizontal or vertical orientation, a collapsible sidebar, sizing constraints, localStorage persistence, and imperative resize controls. KiraSplitView switches to single-pane navigation below 640px and adds presets plus loading, empty, and retryable error feedback.

## Install

```bash
npx shadcn add @kira-kit/split-view
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn
- react-resizable-panels

## Registry dependencies

- @kira-kit/button
- @kira-kit/resizable
- @kira-kit/skeleton

## Usage

```tsx
import { SplitView } from "@/components/ui/split-view";
<SplitView> text</SplitView>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
