# Progress Indicator and Separator upgrade

Implementation date: November 13, 2026. Feature research cutoff: October 31, 2026. The cutoff applies to feature selection; dependency compatibility is
checked against the installed and currently published Base UI version.

## Research evidence

The package registry reports `@base-ui/react` **1.9.0** via
`bunx npm view @base-ui/react version`. The repository installs `^1.9.0`.
Base UI published 1.9.0 on **October 9, 2026**, before the requested cutoff.
Neither target had an existing playbook status row or dedicated upgrade record.

| Primary source                                                                                                                                                                                           | Verified finding                                                                                                                                                                                                               | Consequence for this upgrade                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Base UI 1.9.0 release](https://github.com/mui/base-ui/releases/tag/v1.9.0), published October 9, 2026                                                                                                   | Includes general animation cleanup and Strict Mode registration repairs, plus Collapsible disabled-button and interrupted-panel repairs. There is no Separator or Progress breaking change in that release.                    | Keep Base UI 1.9.0; compose existing controls and disclosures.                                                                       |
| [Base UI 1.7.0 release](https://github.com/mui/base-ui/releases/tag/v1.7.0), published August 4, 2026                                                                                                    | Progress custom minimum/maximum semantics were repaired.                                                                                                                                                                       | Reuse the kit's existing Base UI Progress for measured phase progress.                                                               |
| [Base UI Separator](https://base-ui.com/react/components/separator) and installed `separator/Separator.d.ts`                                                                                             | Separator is one primitive with orientation, native attributes/ref, state-aware className/style, and render composition. It has no `decorative` prop.                                                                          | Convert the kit's decorative switch into role/ARIA props; keep the native primitive on labelled and plain paths.                     |
| [shadcn Separator at the October cutoff](https://raw.githubusercontent.com/shadcn-ui/ui/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/bases/base/ui/separator.tsx), commit September 4, 2026 | A thin Base UI wrapper with `data-slot`, a one-pixel horizontal rule, and vertical self-stretch.                                                                                                                               | Extend this shape; preserve plain-root geometry used by Field, Stack, and ButtonGroup.                                               |
| [shadcn Progress at the October cutoff](https://raw.githubusercontent.com/shadcn-ui/ui/c257f688cf4de7ec10cc1be84cad29cd4631182c/apps/v4/registry/bases/base/ui/progress.tsx), same commit                | ProgressIndicator is the fill inside Progress.Track, not a multi-step milestone component.                                                                                                                                     | This target is a task milestone list; do not substitute the unrelated stock progress fill.                                           |
| [Carbon Progress Indicator](https://carbondesignsystem.com/components/progress-indicator/usage/), page updated September 30, 2026                                                                        | Describes onboarding/checkout/visa workflows, explicit completed/current/pending/error/disabled states, optional helper text, vertical layouts, and passive versus interactive indicators.                                     | Add explicit milestone states, visible reasons, meaningful descriptions, native step controls, and narrow-screen stacking.           |
| [PatternFly Progress Stepper](https://www.patternfly.org/components/progress-stepper/design-guidelines), retrieved November 13, 2026                                                                     | Documents background installation/task monitoring, failure/warning/pending states, compact and vertical layouts, and progress stepper versus wizard distinctions. The retrieved page has no verified October publication date. | Use background import/release monitoring as an illustrative application of established patterns; do not claim a new October release. |
| [Microsoft Fluent 2 Divider](https://fluent2.microsoft.design/components/web/react/core/divider/usage), retrieved November 13, 2026                                                                      | Documents inset grouping, short sentence-case labels, flexible spacing, and hiding purely visual rules from screen readers. The retrieved page has no verified October publication date.                                       | Add logical insets, preserve sentence case, distinguish decorative rules from named boundaries.                                      |
| [Mantine Divider](https://mantine.dev/core/divider/), retrieved November 13, 2026                                                                                                                        | Labels may include icons or links, with start/center/end placement and both orientations. No October release date was established for the current page.                                                                        | Keep interactive boundary actions outside separator-role descendants in the Kira composition.                                        |

GitHub commit queries used `until=2026-10-31T23:59:59Z` for both shadcn source
paths. The live shadcn `base-nova` registry was also compared with those source
snapshots. Documentation without a verified publication date is explicitly
current context, not proof of an October 2026 launch. A Slack help URL resolved
to unrelated notification settings and a GOV.UK task-list URL returned 410;
neither is evidence for a feature decision.

## Explore: Progress Indicator

1. **Exports:** `ProgressIndicator`, `indicatorVariants`, `lineVariants`,
   `ProgressIndicatorProps`, and `ProgressStep`. Existing numeric step values
   and index-based `currentStep` are retained. Only its own demo imports it.
2. **Primitive:** there is no Base UI milestone/stepper primitive in the
   installed package or current component documentation. Native ordered-list
   semantics fit a milestone sequence; interactive controls reuse kit Button,
   and measured task progress reuses kit Progress.
3. **Motion:** unconditional `transition-all` at original lines 13 and 49, and
   a second 500ms transition at line 158. Reduced motion is not respected.
4. **Slots:** root, step, and connector exist. Indicator, icon, number, label,
   description, status, and content slots are missing.
5. **Bugs:** clickable `<div>` at lines 137–145 lacks keyboard/control
   semantics; labels disappear in vertical mode without descriptions; variant
   color overrides pending connectors; long labels move connectors away from
   marker centers; NaN/fractional/out-of-range indices have undefined behavior.
6. **States:** only index-derived pending/active/completed are supported. No
   error, paused, skipped, disabled reason, read-only, or empty state.
7. **Demo:** five existing demo groups omit KeyboardShortcuts, Changelog,
   explicit state/stress coverage, and the Kira composition. Usage references
   missing icon imports and an undefined `currentStep`.
8. **Registry:** no explicit map entry; adding kit Button/Progress/Spinner
   requires cross-component map entries. The reduced-motion hook auto-inlines.

## Explore: Separator

1. **Exports:** `Separator`, `separatorVariants`, and `SeparatorProps`.
   Preserve orientation, semantic default, variant sizes, spacing, color, label
   alignment/icon, native props, and consumer `data-slot` overrides.
2. **Primitive:** the plain branch uses Base UI Separator; labelled branch
   bypasses it with a `<div>` and drops `...props`, including ref, ID, events,
   style, render, and accessible descriptions.
3. **Motion:** decorative pulse/shimmer has no reduced-motion or visibility
   gating; `animate-[shimmer_2s_infinite]` does not name a defined shared utility.
4. **Slots:** only the root has one. Label, icon, and line slots are missing.
5. **Bugs:** label `0` takes the plain branch; label text is forced uppercase
   and nowrap; vertical gradient default remains horizontal; dashed/dotted
   borders stay one pixel at every size; rainbow has competing `via-*` stops;
   decorative is passed as an unsupported primitive/DOM prop.
6. **States:** static separators have no actionable states. Added actions and
   disclosure must expose native disabled/expanded/busy states and reasons.
7. **Demo:** missing KeyboardShortcuts and Changelog, no Kira composition,
   long-label/zero-label/native-prop/read-only stress coverage.
8. **Registry/consumers:** ButtonGroupSeparator, FieldSeparator, and Stack
   depend on the unwrapped plain-root geometry. Existing `separator: []` must
   include any new kit Button/Collapsible dependency.

## Pass B design briefs, written before implementation

### Inspectable task milestones

Problem: a background import can stop at a specific phase while earlier work
remains complete; an index alone cannot explain the failure or recovery.
Behavior: explicit per-step states, optional/disabled reasons, and named native
buttons let people inspect milestones without pretending to advance the task.
Cut: form validation, navigation persistence, and wizard orchestration; the
existing Stepper owns those features.

### Kira task summary

Problem: people need a single readable summary of a multi-phase job, a measured
current-phase percentage when available, and a way to retry a failed phase.
Behavior: `KiraProgressIndicator` composes the milestone list, one contextual
status region, shared Progress, and a caller-owned retry action.
Cut: timers, estimated completion dates, fake progress, automatic execution,
and optimistic success. Async state stays with the application.

### Contextual boundary action

Problem: a feed boundary such as “3 new updates” needs a next action that works
with the keyboard, while the rule itself remains noninteractive.
Behavior: `KiraSeparator` places a visible label/count and shared Button between
decorative lines, with one named wrapper and logical inset/alignment options.
Cut: rotating labels, rainbow gradients, pulse/shimmer decoration, and per-rule
live announcements.

### Disclosable section boundary

Problem: optional import diagnostics or archived updates can dominate a compact
page even when the person only needs the current task.
Behavior: the Kira separator uses shared Collapsible for a named show/hide
control, native expanded state, controlled/uncontrolled open behavior, and
retained content when requested.
Cut: a custom disclosure state machine, drag interactions, and new motion or
design token scales.

## Implementation and verification

Pass A source is implemented for both components. Progress Indicator now uses
an ordered milestone list, shared Button/Spinner, explicit states and reasons,
safe index bounds, persistent vertical labels, aligned responsive connectors,
native refs/attributes, complete slots, and gated motion. Separator now retains
the same Base UI root on both paths, including native props/ref/render/style,
correct semantic/decorative roles, zero labels, labelled slots, orientation-aware
gradients, consistent border thickness, and logical insets. Animated/rainbow
options are removed and documented as breaking changes in the demo changelog.

Pass B source, demos, API tables, keyboard sections, and changelogs are now
implemented for both components. Progress Indicator has nine focused tabs and
`KiraProgressIndicator` with a task summary, measured phase Progress, and
caller-owned recovery. Its local import demo validates actual JSON/contact
records. Separator has eleven focused tabs and `KiraSeparator` with contextual
counts, shared actions, and mutually exclusive shared Collapsible sections.
Retained review notes, controlled open state, zero/invalid counts, busy/disabled
actions, and keyboard-reachable unavailable reasons are demonstrated.

Registry maps now declare Progress Indicator's Button/Progress/Spinner and
Separator's Button/Collapsible/Spinner dependencies. No npm dependencies,
tokens, exemplar components, routes, or sidebar entries were changed.

Verification started only after this implementation milestone. No
check/build/lint/typecheck/test or browser pass ran before both passes and all
twenty demo tabs were implemented.

### Required gates: blocked, not complete

`rtk proxy bun run check` and then `rtk proxy bun run build` both exited 1.
Each run reported 92 out-of-scope lint errors, with no error diagnostics in the
four target component/demo files. Target lint warnings remain (including
complexity, function length, spacing, and semantic-tag preferences); this is
not a warning-free result. Errors affect more than three unrelated files,
including camera utilities/presets, camera, spacer, and CLI initialization.
They were not repaired as part of this upgrade.

Build completed registry generation (`Registry built successfully!`) before
its nested check failed. TypeScript, repository-wide formatting, and the Vite
production bundle were not reached by those commands. The documented
breadcrumb-only exception does not excuse these lint failures.

Generated registry records were inspected:

- Progress Indicator: four npm dependencies (`@tabler/icons-react`,
  `class-variance-authority`, `clsx`, `tailwind-merge`), registry dependencies
  `button`, `progress`, `spinner`, and the inlined reduced-motion hook.
- Separator: four npm dependencies (`@base-ui/react`,
  `class-variance-authority`, `clsx`, `tailwind-merge`), registry dependencies
  `button`, `collapsible`, `spinner`.

The sub-24px registry warnings are broad source heuristics matching decorative
icons/rules. Browser measurements across the demo matrix found all visible
target component buttons and disabled-reason proxies at least 24×24 CSS px.

### Browser evidence: scoped automated pass

Reused the existing `http://localhost:5173` server. `agent-browser` was not
installed and the browser-use Chrome connection ended before approval.
Verification instead used cached Playwright with an isolated headless Edge;
no package was installed, no user browser session was accessed, and the owned
browser was closed. The existing server was left running.

- All 20 feature tabs (nine Progress Indicator, eleven Separator) were opened
  in light and dark at 375×1000 and 1440×1000: **80 matrix states**, **80 PNG
  captures**, **213 passing assertions**, and no page-error events.
- Every matrix state passed page-overflow/overlay checks and 24px interactive
  target measurements. Four representative captures were visually inspected:
  mobile light progress states, desktop dark import recovery, mobile dark
  separator states, and desktop light disclosure. Capturing the other states
  is not a claim that every image received a manual visual/contrast review.
- Real Tab/Shift+Tab/Enter/Space events verified inspection callbacks, native
  disabled blocking and reachable descriptions, separator actions, disclosure
  focus order, closed-content exclusion, and retained note values.
- Read-only removed step controls. Actual local JSON/contact validation,
  failed-validation recovery, retry-to-summary focus, successful local import,
  busy-action blocking, count clearing, zero labels, forwarded refs/IDs,
  invalid counts, empty steps, NaN indices, and clamped completion passed.
- With reduced motion emulated, all 20 tabs had
  `document.getAnimations().length === 0` after settling; the progress loading
  glyph was static. This is browser media emulation, not a physical OS toggle.
- Both States tabs passed page-overflow checks at **CSS zoom 200%** in both
  themes at 375px. Native browser zoom and physical-device text scaling were
  not exercised.

### Remaining gaps and breaking changes

Full manual image review, measured text/focus-ring contrast in each theme,
physical touch/real screen-reader testing, hidden-tab/offscreen motion checks,
rapid-interruption checks, and dedicated Field/Stack/ButtonGroup consumer
regressions remain unverified. The two failed repository gates remain a
release blocker; neither component is marked fully done.

Progress Indicator defaults to vertical stacking below `sm` (opt out with
`responsive={false}`), gives empty labels a `Step N` fallback, and positions
connector classes within steps. Active connectors no longer imply unfinished
work is complete. Separator removes `animated` and `gradient="rainbow"`;
labels retain sentence case and wrap. Its plain-root geometry and semantic
`decorative={false}` default remain unchanged. Both demo changelogs record
these changes.

Evidence lives outside the repository in the audit directory below:
`qa.cjs` (assert-based browser check), `qa-report.json`, the 80 PNG files,
`check-continuation.log`, and `build-continuation.log`.

Baseline: `d10168441fab2755be0cb08d9c83591063d41f72` plus the pre-existing
uncommitted workspace. Exact pre-edit copies and SHA-256 values of both source
files, demos, registry builder, and playbook are saved outside the repository
at `C:/Users/Lenovo/AppData/Local/Temp/kira-progress-separator-upgrade-20261113`.
