# Container

A polymorphic, centered layout wrapper with responsive max-widths including prose, adjustable padding, optional flex centering, and named CSS container queries. KiraContainer adds header and footer slots plus inert loading skeletons and error content with retry handling.

## Install

```bash
kira-kit add @kira-kit/container
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/skeleton

## Usage

```tsx
import { Container } from "@/components/ui/container";
<Container> text</Container>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
