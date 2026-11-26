# Flex

A polymorphic flexbox primitive whose direction, wrapping, justification, alignment, and gap props accept either fixed values or breakpoint maps from base through 2xl. It supports inline flex and semantic elements such as forms, navigation, lists, and fieldsets while preserving element-specific props and refs.

## Install

```bash
kira-kit add @kira-kit/flex
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/layout-responsive

## Usage

```tsx
import { Flex } from "@/components/ui/flex";
<Flex> text</Flex>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
