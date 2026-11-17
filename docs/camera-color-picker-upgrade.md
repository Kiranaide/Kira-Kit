# Camera and Color Picker upgrade

Requested research cutoff: October 31, 2026. Implementation started November 14, 2026. Both Pass A and Pass B, including demos, must finish before any testing.
The pre-upgrade working tree was preserved outside the repository; it includes
the user's existing edits on commit `d10168441fab2755be0cb08d9c83591063d41f72`.

## Research

- `bunx npm view @base-ui/react version` returned **1.9.0**. npm's publication
  metadata and the [official release](https://github.com/mui/base-ui/releases/tag/v1.9.0)
  date it to **October 9, 2026**. This matches the repository dependency.
  Relevant fixes include retained Popover transitions and focus guards, Slider
  pointer cancellation and touch commits, and Strict Mode item registration.
- The [official shadcn Base UI registry](https://ui.shadcn.com/r/styles/base-nova/registry.json)
  contains Button, Input, Popover, Slider and other composition parts, but no
  Camera or Color Picker. Base UI's installed 1.9.0 catalog likewise has neither
  domain primitive. Reuse the kit controls rather than inventing their semantics.
- [MediaDevices.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
  requires a secure context and user permission. A permission prompt can remain
  unanswered, so stopping a request must invalidate its eventual result and stop
  any stream that arrives later. Browser errors have distinct names and should
  offer an appropriate recovery action.
- The native [file input capture hint](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
  can request a front or back camera on supporting mobile devices. It is a hint,
  not a universal guarantee; ordinary image selection remains the fallback.
- [Stripe's document and selfie flows](https://docs.stripe.com/identity/verification-checks)
  illustrate a real capture use case: collect a document and optional selfie,
  review the image, then pass evidence to a separate verification service.
  Capturing an image or manually completing a head-movement checklist does not
  establish identity or biometric liveness.
- [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)
  provides perceptual lightness and explicit chroma/hue and alpha. Its established
  CSS support makes accurate editing/copying useful for Tailwind v4 and brand
  systems. This picker edits sRGB colors; converting an out-of-gamut OKLCH value
  must report its sRGB mapping rather than claiming wide-gamut preservation.
- [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/)
  is an immutable Final Community Group Report dated October 28, 2025. Color token
  values include `colorSpace`, `components` and `alpha`, enabling portable brand
  token exports available before the requested cutoff.
- [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  uses an inclusive 4.5:1 threshold for ordinary text and 3:1 for large text.
  Evaluate translucent foregrounds after compositing over the actual background;
  identify the text category instead of giving one ambiguous pass badge.
- [EyeDropper](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper)
  remains a secure-context, limited-support API. Invoke it only from a user
  action, handle cancellation and failure, and keep manual editing available.

The web search returned weak unrelated results, so implementation claims above
were checked against first-party release metadata, registries, specifications and
documentation. Mutable documentation was retrieved during this session; no claim
is made that every proposed workflow was newly invented in October 2026.

## Static exploration

Two Sol auditors inspected the current components independently without editing
files or running checks. Camera has pending-start races, recorder/timer cleanup
defects, a second controller in the enhanced demo, hidden interactive overlays,
dead gesture/voice/zoom controls, incomplete registry helpers, and manual liveness
claims. Color Picker duplicates broken HSL conversion, has conflicting alpha
state, nests interactive trigger elements, rejects incomplete edits, mishandles
clipboard/contrast, mutates swatches and lacks an honest form value.

## Pass B design briefs

### Reviewed camera capture

Problem: document and inspection uploads need a readable, intentional photo.
Behavior: start explicitly, capture or select an image, review it, retake or accept.
Cut: no automatic upload, identity judgment, or implicit persistence of photos.

### Cancellable acceptance

Problem: a failed save should retain the reviewed image and allow recovery.
Behavior: caller-owned acceptance receives the capture and an AbortSignal;
pending, cancellation, error/retry and confirmed success share one status region.
Cut: no fabricated progress percentage or success before the promise resolves.

### Accessible brand color

Problem: a brand foreground can fail contrast on its real surface, especially
with transparency.
Behavior: edit one color with validated format drafts and show its composited
contrast against an explicit background, with an opt-in accessible suggestion.
Cut: no automatic change to the site's token scales and no blanket WCAG claim.

### Portable token handoff

Problem: designers and developers need the same color and opacity in their tools.
Behavior: copy exact CSS in the chosen format or one named DTCG color token,
with pending, success and recoverable failure feedback.
Cut: no remote palette storage, package dependency, or unsupported gamut promise.

### Camera UI refinement

The follow-up applies the UI Taste polish/craft playbooks and Frontend Design
skill to the existing kit. The audience is someone collecting a readable photo
for a document, return or inspection workflow. The viewfinder is the main
surface; a balanced shutter dock makes photo/video actions distinct and keeps
secondary controls predictable. The Kira workflow shows the actual Capture,
Review and Accept sequence, with readable image details and recovery beside
the actions. Mobile actions have 44px targets, and long permission messages
scroll inside the preview. The default Kira photo viewport uses 4:3 below a
24rem container width and 16:9 above it; explicit size variants are preserved.
The dock's fade supports legibility over live imagery. CameraButton icons now
retain their configured size instead of inheriting the shared Button's 16px
default.

The palette, typography and radii reuse the kit's existing semantic tokens and
font. The fixed dark media surface follows the existing camera convention.
No shared token scales or exemplar Button, Field or Badge conventions change.

The workflows compose the playbook §3.5 async Button, copy feedback, inline
validation, disabled reasons and reserved loading states. Domain-specific capture,
contrast and token behavior follows the user's request for researched use cases.

## Implementation and verification

Pass A and Pass B source are implemented for both components. Camera has ten
focused demo tabs; Color Picker has ten. Both pages include the seven required
documentation sections, with Basic selected first and breaking changes recorded.

The simple Color Picker retains the original swatch/value trigger, saturation
plane and slim hue control. Its Input and Select share matching heights and
label spacing. Actual-background contrast and token export are composed in
`KiraColorPicker`.

Registry packaging now traverses nested hooks and local libraries, including
relative imports, and reads dynamic npm imports. Camera dependency maps
and Color Picker's Select/helper dependencies are explicit. The CLI accepts
`registry:lib` files, places them under the configured lib alias and honors
declared dependencies for dynamic imports.

Implementation and demos finished before any test, lint, build or browser
check, as requested. The later camera UI refinement also finished before its
verification and was rechecked after the material visual fixes.

### Verification before optional workflow removal — November 14, 2026

This evidence covers the earlier implementation, including four optional camera
workflow tabs that were subsequently removed. The cleanup checks are recorded
separately below.

- **Required gates passed:** `bun run check`, then `bun run build`. The latter
  included registry checks, another repository check and the Vite production
  build. Advisory lint and bundle warnings remain; neither command failed.
- **Registry contents match:** all 18 serialized files across `camera`,
  `camera-features` and `color-picker` match their 12 unique source files
  byte-for-byte. Shared controls, nested hooks/lib helpers and optional model
  dependencies are declared.
- **Browser matrix:** Camera's fourteen tabs and Color Picker's ten tabs were
  captured and checked in light/dark at 375×900 and 1440×900: 96 combinations.
  No horizontal page overflow or Vite error overlay was found. Camera's matrix
  was repeated for the UI refinement, and its final affected layouts were
  recaptured. Contact sheets and representative full-size popup, live-control,
  review, error and success captures were inspected. Some tall demos extend
  beyond their viewport captures; this is not exhaustive visual coverage.
- **Compact picker:** shared trigger/Input alignment measured 28/32/36px for
  sm/default/lg. Format Select and color Input align in the popup. Native
  keyboard checks covered Enter/blur commit, invalid rejection, Escape restore
  and dismissal/focus return, slider Home/End, format changes, alpha 0/1, required
  form submission, canonical alpha values and reset.
- **Color workflows:** a suggestion reached 4.58:1 for ordinary text on the
  explicitly white background. CSS and DTCG output preserved the selected
  channels/alpha. Clipboard adapters exercised pending, cancellation, failure,
  retry and exact output. EyeDropper fixtures ignored late results after
  closure/disable/read-only and used the latest alpha. These fixtures do not
  verify real browser permission behavior.
- **Camera workflows:** native file input selected a PNG and reached dimensions,
  review, acceptance and retake/reset. Acceptance fixtures passed pending,
  cancel, failure/retry, success and focus return in both widths/themes. The UI
  steps follow the actual phase, and error/success feedback preserves the image.
- **Simulated media:** canvas streams verified real photo dimensions/cropping;
  late streams were stopped, countdown Escape cancelled, recorder fixtures
  completed with their MIME, both switch/Stop races stayed cancelled and
  disabling Kira stopped the controller. The refined shutter dock fit photo,
  video and combined modes without overlap, with 44px secondary targets and a
  centered single primary action. Native shutter/record/torch controls, denied
  permission help and long-error recovery were exercised against simulated APIs.
- **Motion and stress:** all 24 tabs returned zero document animations under
  reduced motion. Final pending acceptance and CameraButton states also passed.
  The shared CSS reset uses 0.01ms rather than literal 0s. Color Picker passed
  320px long/empty/popup checks and a CSS 200% zoom smoke; this was not real
  browser zoom.

The read-only Sol review covered an earlier immutable candidate. Its six
findings were repaired in the main session: OCR document-type invalidation,
switch/Stop ordering, EyeDropper stale results, disabled camera shortcuts,
keyboard help and OCR percentage display. The later repairs and UI pass were
verified by the main session; they have no second independent review.

Physical camera/recording, OCR and face-model providers, speech, physical torch,
real EyeDropper/clipboard permissions, screen readers, physical touch, true
browser zoom, exhaustive contrast/color accuracy and consumer installation with
custom aliases remain unverified. Convenience capture URL ownership without an
`onCapture` consumer is a remaining baseline risk; KiraCamera owns and releases
its newly created URLs.

Local evidence is in
`C:/Users/Lenovo/AppData/Local/Temp/kira-camera-color-upgrade-20261114/`:
`check-ui-final.log`, `build-ui-final.log`, `registry-final-comparison.json` and
`browser-qa/results.jsonl` with the saved captures. These are local artifacts,
not published evidence.

### Optional camera workflow removal — November 14, 2026

The user requested removal of the optional workflows instead of consolidation.
Deleted `src/components/ui/camera-features.tsx` and removed face detection,
document OCR/MRZ parsing, guided liveness and KYC evidence collection. Their four
demo tabs, usage snippets, API sections, variants, callbacks, error codes,
detection status, mode constraints and liveness guide UI were removed.

Removed the feature registry entry and npm dependency mappings. Bun removed
`@tensorflow-models/face-detection`, `@tensorflow-models/face-landmarks-detection`,
`@tensorflow/tfjs` and `tesseract.js`, pruning their unused transitive packages
from the lockfile. The MediaPipe Vite export shim and optimization exclusions
were removed. Core document framing now reads aspect ratios from the existing
guide presets instead of OCR templates.

Camera now has ten focused tabs for capture, review, acceptance, controls,
settings, voice, overlays, guides, the Kira workflow and states. Color Picker
retains its ten tabs.

Cleanup verification passed: `bun run check`, then `bun run build`, including
registry checks and the Vite production build. All 13 serialized files across
the two remaining registry entries match their source files byte-for-byte. The
deleted entry is absent from the registry indexes and its JSON was pruned.
No TensorFlow, MediaPipe or Tesseract packages remain in the lockfile; Bun pruned
78 package entries. Other direct dependency versions and dev dependencies were
preserved. No new browser QA was run for this cleanup.

Cleanup logs and the dependency/registry comparison are recorded locally in
`C:/Users/Lenovo/AppData/Local/Temp/kira-camera-features-removal-20261114/`:
`check-cleanup.log`, `build-cleanup.log`, `registry-cleanup.log` and
`dependency-removal-report.json`.

### Breaking changes

- Camera shortcuts default off and apply only to the focused camera region.
- Captured photos remain unmirrored unless `mirrorCapture` is enabled.
- The optional camera workflow exports and registry entry were removed. The
  `face-detection`, `id-scanner` and `liveness` modes and their feature-only
  types/helpers are no longer available.
- Quality `raw` is now `lossless` (PNG); reduced-motion bypass props were removed.
- The default photo ring is a muted current-color ring. KiraCamera's default
  mobile viewport uses 4:3, and review actions stack at narrow container widths.
  Explicit camera size variants retain their configured aspect ratio.
- Color Picker keeps controlled values caller-owned. Preserve `hsv` or `hexa`
  when storing its output to retain opacity. Drafts commit on Enter/blur;
  invalid values are rejected. `type` is a deprecated initial-format alias.
- Color Picker's `className` styles the root; `contentClassName` styles the
  popup. The default trigger is one Button beside an Input.
