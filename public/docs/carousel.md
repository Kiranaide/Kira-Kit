# Carousel

Embla carousel with horizontal and vertical axes, cards, fade, peek, zoom, and flip variants, keyboard navigation, and reduced-motion-aware autoplay. It includes arrows, dots, progress, thumbnails, and a composed KiraCarousel; its lightbox adds pinch/double-tap zoom, panning, swipe dismissal, download, and sharing.

## Install

```bash
kira-kit add @kira-kit/carousel
```

## Dependencies

- @base-ui/react
- @gsap/react
- @tabler/icons-react
- class-variance-authority
- cn
- embla-carousel
- embla-carousel-autoplay
- embla-carousel-react
- gsap

## Registry dependencies

- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { Carousel } from "@/components/ui/carousel";
<Carousel> text</Carousel>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
