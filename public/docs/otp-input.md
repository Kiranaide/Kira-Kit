# OTP Input

Base UI OTPField input for 4-to-8-character numeric, alphanumeric, or alphabetic one-time codes. Supports masking, optional separators, auto-submit on completion, invalid styling, three sizes, and three surface variants.

## Install

```bash
kira-kit add @kira-kit/otp-input
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Usage

```tsx
import { OtpInput } from "@/components/ui/otp-input";
<OtpInput> text</OtpInput>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
