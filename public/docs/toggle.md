# Toggle

Pressable Base UI toggle with seven visual variants, six text/icon sizes, three radii, loading and check indicators, pressed-icon support, and native checkbox-like hidden form inputs. KiraToggle adds tooltips and disabled explanations, global shortcut handling, reduced-motion GSAP feedback, and optimistic async toggles that roll back with an error toast.

## Install

```bash
kira-kit add @kira-kit/toggle
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/toast
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Toggle } from "@/components/ui/toggle";
<Toggle> text</Toggle>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
