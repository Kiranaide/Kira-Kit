# Code Block

Syntax-highlighted code display and editor with line numbers, diff and highlight markers, formatting, light/dark themes, clipboard feedback, and streamed-output pause/follow controls. It supports plain or lazily loaded Monaco editing with a textarea fallback, preview tabs, and multi-file KiraCodeBlock drafts.

## Install

```bash
kira-kit add @kira-kit/code-block
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn
- modern-monaco

## Registry dependencies

- @kira-kit/button
- @kira-kit/code-presentation
- @kira-kit/component-defaults
- @kira-kit/component-native-props
- @kira-kit/component-prop-guards
- @kira-kit/component-refs
- @kira-kit/tabs
- @kira-kit/toast
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { CodeBlock } from "@/components/ui/code-block";
<CodeBlock> text</CodeBlock>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
