# Field and pagination upgrade

Implementation dates: November 11 and 12, 2026. Feature research cutoff: October 31, 2026.

## Research and baseline

`bunx npm view @base-ui/react version` returned **1.9.0** on November 11, 2026. The installed package is 1.9.0. The official release notes date it to **October 9, 2026**, within the requested cutoff. There were no field or pagination status rows before this task; both will be added without rewriting other rows.

Primary sources retrieved at task start:

- [Base UI 1.9.0 release](https://base-ui.com/react/overview/releases/v1-9-0): fixes stale focused field state, changing uncontrolled Field.Control defaults, and label focus in Shadow DOM. No new Pagination primitive exists in the installed package or documentation.
- [Base UI Field](https://base-ui.com/react/components/field): Root, Label, Control, Description, Error, and Validity provide native association and validation; onSubmit is the primitive default, onBlur/onChange are supported, and onChange validation can debounce. External libraries can supply invalid, dirty, and touched. Async onSubmit validation does not block submission; demos must not claim otherwise.
- [Base UI forms handbook](https://base-ui.com/react/handbook/forms): Base UI controls work with Field directly, and Field.Description provides the accessible description. Fieldset labels related control groups. Use visible labels, error descriptions, and external validation state without a second validation machine.
- [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/) and [history](https://design-system.service.gov.uk/components/error-summary/history/): focus the summary after failed submission, link errors to controls, and retain matching inline messages. History confirms these patterns precede October 2026.
- [GitHub GraphQL pagination](https://docs.github.com/en/graphql/guides/using-pagination-in-the-graphql-api): cursor connections expose hasNextPage/hasPreviousPage and cursors, so navigation must not invent a last page or total.
- [Carbon pagination](https://carbondesignsystem.com/components/pagination/usage/): pagination is useful for dense result sets, with clear item ranges and page-size changes.
- shadcn/ui October snapshot: GitHub API `commits?until=2026-11-01T00:00:00Z&per_page=1` returned **c0d63c339d6cd2fc26135590a54cf1f362269451**, dated October 31, 2026, 20:40:44 UTC. Read [Field at that commit](https://github.com/shadcn-ui/ui/blob/c0d63c339d6cd2fc26135590a54cf1f362269451/apps/v4/registry/bases/base/ui/field.tsx) and [Pagination at that commit](https://github.com/shadcn-ui/ui/blob/c0d63c339d6cd2fc26135590a54cf1f362269451/apps/v4/registry/bases/base/ui/pagination.tsx). Stock Field supplies layout and error display; stock Pagination supplies semantic nav/list/anchor composition over Base UI Button. Preserve this anatomy and extend it with primitive-backed validation and result navigation.

Some web-tool opens returned internal errors. Public Markdown, registry JSON, GitHub commit metadata, and historical raw sources were fetched directly with PowerShell HTTPS instead; fetched source files are saved in the task's OS temporary directory. Date-specific assertions above are based on retrieved release/commit content, not assumed current documentation.

## Skills and design direction

Applied sequentially: kira-upgrade, kira-explore, kira-pass-a, kira-pass-b, kira-visual-qa, and kira-registry-check. UI guidance: frontend-design, ui-taste (operate/polish/craft), ui-ux-pro-max, emil-design-eng, mobile-native, animate, and break-ui. Browser-use guidance applies at QA. Native iOS/Expo, Figma, images, gesture, and marketing skills are outside this component-library task.

UI UX Pro Max queries found applicable entries for inline validation, error placement, focusable error summaries, controlled state, and shared state. Established Kira tokens, typography, and accordion demo conventions outrank generic design-system recommendations. Use quiet settings/form examples for Field and operational result lists for Pagination. Reflow controls at the container width; use tabular numbers and semantic colors. Remove scale-from-zero validation-icon entrances and routine error translation; do not move text while users type or navigate. Use visible static pending feedback rather than unnecessary perpetual loaders. Desktop emulation is not physical-phone evidence.

## Explore: Field

1. Exports: Field(orientation vertical/horizontal/responsive; disabled/required/readOnly/invalid/id), FieldSet, FieldLegend(legend/label; required indicator), FieldGroup(default/outline), FieldContent, FieldLabel/FieldTitle(required indicator), FieldDescription/FieldHelperText, FieldSeparator, FieldRow(sm/default/lg), FieldCharacterCount(current/max; threshold 80; near-limit-only), FieldValidationIcon(valid/invalid/validating; size), FieldError/FieldErrorText(errors/field; visibility/icon), FormField(form/name/render child), FieldInput(native input plus field/label/description/error/counter), createZodValidator/options, useFieldContext, FieldApi, and z. `fieldVariants` is defined at source line 132 but not exported.
2. Primitive: source lines 3–21 import custom Label/Separator, TanStack/Zod, and GSAP; Field at line 156 is a hand-rolled context/div. Adopt Base UI Field and Fieldset while keeping layout anatomy and existing public convenience exports.
3. Motion: source lines 393–452 animate validation icons from zero; the validating SVG spins without reduced-motion gating. FieldError's GSAP appearance respects matchMedia but animates routine feedback. Remove these layers.
4. Slots: FieldInput's input and metadata row lack slots; validation icon SVGs/content lack slots; FieldTitle incorrectly reuses field-label. Keep rendered subparts identifiable.
5. Bugs: FieldLabel assumes a context ID even when the actual Base UI Input has a different ID. FieldInput only describes helper text, omits errors, forces empty controlled input without a field, and allows spread handlers to bypass field updates. FieldError memoizes mutable field meta, handles mixed errors poorly, and `showErrors=false` does not hide children. createZodValidator's onSubmit returns undefined for a scalar root error; numeric onChange adds both sync and async validation.
6. States: disabled/required/readOnly context is not consumed by general Base UI controls; invalid styles depend on inconsistent attribute values. Field context metadata must supplement, not replace, primitive state. Pending/success need text, counter limit feedback must not announce every keystroke.
7. Demo: source has Basic/Validation/Layout/Forms/Accessibility but no KeyboardShortcuts or Changelog, uses console logs/window alerts for form feedback, and places multiple unrelated examples in broad tabs. Replace with focused co-located demos.
8. Registry: existing map is `field: ["label"]` while source also imports Separator. New primitive-backed field needs Separator; npm map already covers Base UI, TanStack, Zod, CVA, and Tabler. No new package installation.

## Explore: Pagination

1. Exports: Pagination(total/page/pageSize/defaultPage/maxPages/keepInBounds; size/variant/color/disabled; callbacks), Content/Item, Link(page/isActive), First/Previous/Next/Last, Ellipsis, Pages(render callbacks/mobileMaxPages), Info(format/mobileCompact), SizeSelector(options/label/onSizeChange), Jump(label/onJump), Status, variants/context hook, usePagination/useUrlPagination/calculatePageRange. Types will be exported explicitly.
2. Primitive: source uses native buttons; stock shadcn uses Base UI Button rendered as anchor. Keep nav/list composition and use Base UI Button, Input, and existing Select for controls. There is no Pagination primitive.
3. Motion: link CVA at line 48 uses transition-all and active scale; semantic colors use green/amber raw palette classes. Replace with explicit quiet state feedback and semantic token roles.
4. Slots/names: navigation wrappers all render as pagination-link, decorative SVGs are not hidden, and mobile-hidden size/jump labels lose accessible names. Ensure explicit names and slots at every part.
5. Bugs: hook lines 200–207 capture total/pageSize at mount; effect-driven controlled mirroring conflicts with repository conventions. Navigation `??` chains let context disabled=false mask first/last boundaries. Pages ignores actual mobileMaxPages budget. Jump uses parseInt, silently clamps, can navigate to zero for empty results, and nests a form inside a form. Info and Status duplicate live announcements. URL hook can overwrite new size with stale size, drops unrelated query/hash in buildUrl, and uses history state null.
6. States: no loading/error/retry, no disabled reason, no cursor-only mode, no link URL/native modified-click support. Empty state needs 0–0 consistently. Numeric inputs must be strict and safe.
7. Demo: local bespoke DemoWrapper and tabs do not follow shared ComponentPage/PageHeader/DemoTabs/API/Keyboard/Changelog structure. Replace them; demonstrate changing result counts, URL state, and failure recovery.
8. Registry: existing `pagination: ["button"]`; add Select dependency when composing the existing Base UI Select. Hook source is automatically inlined by registry builder.

## Plan

1. Pass A across both targets: adopt Field/Fieldset and Button primitives, preserve composition and grouped exports, fix handlers/ARIA/errors, repair pagination controlled state and URL synchronization, replace raw colors and excessive motion, synchronize dependency maps.
2. Pass B: add KiraField and a linked FieldErrorSummary; add KiraPagination with page and cursor modes, optional size/jump controls, loading/error recovery, and native URL links. Preserve raw values and format only display.
3. Demos: complete both shared documentation pages with focused feature tabs, real settings/results fixtures, API for every exported part, keyboard scripts, migration notes, and a Demo data/Worst case toggle for long/empty/narrow/large-number states.
4. Only after both source implementations and demos are complete: run `bun run check`, then `bun run build`; use browser QA on every tab in light/dark at 375px/desktop, keyboard scripts, 200% zoom, and reduced motion. Fix material findings and repeat affected checks once. Document repository-wide blockers instead of fixing unrelated files.
5. Validate generated field/pagination registry payload dependencies and inline hooks; update status table honestly. No token scale changes, other exemplar edits, component deletion, or unrelated cleanup.

## Feature briefs

**Blur-first validation and limit feedback.** Problem: users are interrupted by premature errors while editing descriptions and settings. Behavior: KiraField combines visible label, primitive control, helper/error/success text, and a counter; onBlur is its default. Cut: per-keystroke validation animations and repeated live numeric announcements.

**Recoverable form errors.** Problem: after a failed submit, people miss errors below the fold. Behavior: FieldErrorSummary lists linked errors and optionally focuses only after submission/retry. Cut: focus movement on every blur and toast-only validation.

**Changing result sets and URL state.** Problem: filtering, page-size changes, and browser Back produce stale page navigation. Behavior: controlled totals and size derive from props; page/size update atomically; real anchors retain URL intent, filters, and hash. Cut: duplicate live regions and automatically animating page-number changes.

**Cursor navigation and pending/error states.** Problem: activity feeds and API connections know previous/next cursors but not a total. Behavior: KiraPagination cursor mode presents Previous/Next with an ordinal and explicit loading/error/retry without a made-up last page. Cut: numbered jumps and size controls when the server cannot support them. This uses native nav plus Base UI Button because Base UI has no Pagination primitive; it applies the playbook's primitive-first, async-feedback, disabled-reason, and raw-value rules to the user-requested real-use-case feature.

## Previous-session implementation status

Research/Explore, Pass A, Pass B, and both complete demo pages are implemented. Field has eight focused tabs; pagination has eleven. Both include shared page anatomy, API tables for every exported part, keyboard scripts, migration changelogs, and worst-case controls. No tests, checks, builds, or browser sessions ran before this implementation milestone. Verification was interrupted in the previous session. Continuation results are below.

## Continuation results for v3.0.1, November 12, 2026

The sources and demo changelogs are v3.0.1. The installed Base UI version remains
1.9.0. This continuation retains the October 31, 2026 feature cutoff and the
previous session's feature briefs.

### Corrections

- Field keeps Base UI validation in control when an external error is empty,
  false, or an empty collection. An explicit `invalid={false}` still overrides
  native invalidity.
- `FormField` infers field names from the supplied TanStack renderer instead of
  declaring twelve `any` parameters. Unknown names do not type-check.
- Uncontrolled counters subscribe to the native input or textarea value.
  Input/change events, native reset, successive canceled resets, and changing
  defaults do not leave a second React value out of sync. Controlled values and
  TanStack fields remain caller-owned.
- `FieldStatus` uses polite, atomic status semantics. The imported counter demo
  measures its actual 183 UTF-16 code units rather than a hand-written count.
- Pagination honors `keepInBounds=false`, keeps unbounded pages from marking
  another page active, reports uncontrolled bounds corrections once, and caps
  offsets at `Number.MAX_SAFE_INTEGER`.
- The new `setPagination({ page, pageSize })` commits both values once. The URL
  demo wires that callback directly instead of chaining setters with stale size
  state. Saved default page 5 still allows an explicit page 1. URLs retain
  repeated filters, the hash, and unrelated history state.
- Native rendered links retain `href`, `target`, `rel`, and `download`. Enter and
  modified clicks retain browser navigation; Space does not trigger a button
  action. Disabled raw anchors lose navigation and their render-owned click
  handler.
- Pagination has one status region per navigation context. Custom loading text,
  request failures, and retry availability reach that region.
- The jump hint uses the existing `muted-foreground` token. Its measured text
  contrast is 6.07:1 in light and 6.027:1 in dark. Go has a 44px minimum hit area
  under coarse-pointer emulation. No shared token values changed.

The v3.0.0 migration notes remain in both demo Changelog sections. The
continuation tightens the adapter's name contract and adds `setPagination`; it
does not remove another component or change the Button/Badge exemplars.

### Verification environment

Verification runs in a main-owned temporary worktree at the same HEAD,
`d10168441fab2755be0cb08d9c83591063d41f72`. Its 272 candidate files, including
45 ignored lint-tool files, are copied and SHA-256 checked against the primary
workspace. The pre-existing dirty workspace is preserved.

An undeclared Sonar lint plugin, version 4.2.2, is installed only for the isolated
verification environment. Application manifests are unchanged. Regression
fixtures exist only in that worktree during their checks and are moved outside
the candidate before the required repository commands run.

Two T3 preview snapshot attempts timed out after 15 seconds. The continuation
uses one owned local Edge tab through browser-use/CDP instead. Keyboard input is
trusted CDP input with focus emulation. Pointer, theme, and reduced-motion media
checks are emulated. These are not native OS focus or assistive-technology tests.

### Required command results

| Command         | Exit | Result                                                                                                                                                |
| --------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun run check` | 1    | 113 lint errors outside the five target source/demo files; no target lint errors. The lint failure stops the chained TypeScript and formatting steps. |
| `bun run build` | 1    | Registry generation and its checks finish for 73 components. The nested check hits the same 113 lint errors, before the Vite build.                   |

Supplemental application TypeScript checking reports 46 diagnostics outside the
five target files. The regression type fixture reports six existing Select
diagnostics and none in the fixture or target files. Its unknown-field-name
`@ts-expect-error` is consumed rather than reported as unused. Neither
supplemental command is reported as a passing repository gate.

The blockers include `src/lib/camera/utils.ts`, the CLI registry helper, and
other component/demo assertions in lint; application type diagnostics include
`flex.tsx` and the shared `select.tsx`. No unrelated source is changed to clear
them. In particular, the Pagination consumer's shared Select dependency still
has the recorded type errors.

### Browser results

| Check                    | Evidence                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Layout and stress states | 84 captures across all eight Field tabs and eleven Pagination tabs, light/dark, 375px/1280px, including worst-case data. No main or document horizontal overflow. All original captures and the affected focus/reflow/error captures are visually inspected.                                                       |
| Field interactions       | 36 captures cover blur-first invalid/success feedback, near/at-limit counts, uncontrolled reset, async pending/unavailable/recovered feedback, submit-summary focus and links, successful submit, Tab/Shift+Tab, checkbox Space, and read-only focus.                                                              |
| Pagination interactions  | 40 captures cover changing/filtering results, atomic page size, strict jumps, ancestor-form Enter, native links, cursor end/error/recovery, loading/retry, and Base UI Select keyboard behavior.                                                                                                                   |
| URL regressions          | Saved page 5 to explicit page 1, Back/Forward, atomic size changes, repeated filters, hash/history preservation, invalid numeric fallback, and shareable URL equality.                                                                                                                                             |
| Isolated regressions     | Input/textarea edits and reset, changed defaults, successful reset followed by canceled reset, empty external errors, native validation ownership, bounded callback counts, unbounded ranges, safe offsets, native Space/Enter/Ctrl-click, link attributes, disabled render-owned clicks, and custom loading text. |
| Reduced motion           | 96 states after settling, including pending feedback and open Select. Every recorded `document.getAnimations()` count is zero. Computed motion timings are also inspected. Final state and keyboard input remain usable.                                                                                           |
| Focus and names          | Eight focus captures show `:focus-visible` and unobscured controls. Accessible control names and one pagination status region are checked. Focus ring contrast has the separate failure below.                                                                                                                     |
| Reflow proxy             | Four worst-case scenes use 640 CSS px at DPR 2, in both themes, with no document/main horizontal overflow. This is a 200% reflow proxy, not native browser zoom. CDP Ctrl-plus does not change browser zoom in this environment.                                                                                   |

The composed Checkbox controls have a 20px visible box with a linked, clickable
label. This is recorded as a compact target, not a blanket 44px touch-target
pass. Pagination page controls and Go use 44px coarse-pointer targets; the web
24px floor and the 44px comfort target are not conflated.

### Remaining contrast and manual checks

Contrast is checked in both themes across the matrix and in failed-submit,
invalid-jump, request-failure, and worst-case scenes. Existing semantic token
combinations still fail the playbook's contrast floor:

| Combination                                 | Measured ratio | Required floor |
| ------------------------------------------- | -------------- | -------------- |
| Light `destructive` text on background      | 4.417:1        | 4.5:1          |
| Light error-summary text on `destructive/5` | 4.098:1        | 4.5:1          |
| Light primary-foreground text on primary    | 4.253:1        | 4.5:1          |
| Dark primary-foreground text on primary     | 3.162:1        | 4.5:1          |
| Light primary text on primary/10            | 3.987:1        | 4.5:1          |
| Light destructive text on destructive/10    | 3.787:1        | 4.5:1          |
| Light focus ring against its surroundings   | 2.832:1        | 3:1            |

The dark focus ring measures 5.164:1. The jump placeholder fix passes in both
themes. The remaining failures depend on shared token values; the playbook
requires approval before changing those scales. No token workaround or unrelated
palette edit is applied.

Native 200% browser zoom, the native OS reduced-motion toggle, screen-reader
speech, and native OS focus remain unverified. Overall completion is blocked by
the required repository gates and the contrast failures. Emulated checks are not
substituted for those missing checks.

### Registry and retained evidence

The generated Field payload has `separator` as its registry dependency.
Pagination has `select` and inlines `hooks/use-pagination.ts`. Every generated
source/hook string matches the candidate's literal UTF-8 bytes. Their package
dependencies match the imported packages; direct Base UI Button/Input imports do
not add a Kira Button registry dependency.

Only `public/r/field.json`, `public/r/pagination.json`, and those two entries in
the registry/index catalogs are synchronized into the primary workspace. The
other 71 catalog entries are preserved. No unrelated generated component payload
is copied or pruned.

Local evidence is retained under
`%TEMP%/kira-field-pagination-20261112-5c335dbb/`:

- `candidate-final-manifest.json` and `continuation-scope-check.json` record the
  exact candidate and source scope.
- `check-final.log`, `build-final.log`, `gates-final.json`, `types-final.log`, and
  `fixture-types-final.log` contain command output and exit statuses.
- `registry-sync-final.json` records dependency/content checks and catalog scope.
- `qa/matrix-final.json`, `qa/interactions-final.json`,
  `qa/pagination-interactions-final.json`, `qa/url-final.json`, and
  `qa/regressions-final.json` hold layout and interaction evidence.
- `qa/accessibility-final.json`, `qa/contrast-interactive-final.json`, and
  `qa/final-qa.json` hold contrast, focus, and reduced-motion observations.
- The original matrix contact sheets and final focus/reflow/error contact sheets
  retain the inspected screenshots. The native zoom probe is separate.

## Additional requirements, November 12, 2026

### Feature briefs

**Ellipsis page jump**

1. Long page ranges hide destinations behind dots without offering a direct way to reach them.
2. Each ellipsis opens a shared Base UI popover with the existing strict page-jump control; accepted local jumps close it and focus the current page, even when that ellipsis disappears. Native page URLs retain browser navigation.
3. No quick-jump carousel, duplicate range parser, cursor-mode jump, or new token values.

**Composable Field controls**

1. The complete KiraField wrapper currently assumes a string input, making selection and checked controls harder to compose consistently.
2. A typed control render slot receives identity and disabled/required/read-only state, while each control keeps its own typed value/change API. Base UI controls register directly; native controls use FieldControl. FieldItem isolates labels and descriptions for grouped options.
3. No monolithic input-type switch, duplicate select/checkbox state machines, automatic checked-to-string conversion, or imports that create a Field/Input registry cycle. Text-only convenience props remain exclusive to the default text-control branch.

Targeted API references: the installed Base UI 1.9.0 Field.Item, label association, Popover payload/focus, CheckboxGroup, Select, RadioGroup, NumberField and Combobox declarations/implementations. The previously recorded research and October 31, 2026 feature cutoff remain in force.

Implementation and focused demos were completed before verification, as requested. The earlier v3.0.1 final-gate attempt failed before lint because the isolated SonarJS package could not be resolved. The isolated tooling was restored with `bun install --force`, without changing app manifests. The current v3.1.0 results follow.

## v3.1.0 additions and verification, November 12, 2026

### Implemented behavior

`KiraField.control` accepts a custom control while preserving its typed value,
checked, change, and blur APIs. The slot supplies `id`, `name`, `disabled`,
`required`, and `readOnly`. Native controls register with `FieldControl`.
Existing Base UI controls register themselves. Compound NumberField and
Combobox controls receive `id` on their registering Root, so their inherited
Input IDs match the label identity. `FieldItem` scopes option labels and
helper text for grouped controls. Custom controls use `field` for validation
metadata, not automatic value binding. The existing text-input API is unchanged.

The Controls tab composes Input, Textarea, InputGroup, Select, RadioGroup,
Checkbox, CheckboxGroup, Switch, Slider, NumberField, and Combobox. It includes
editable, read-only, and disabled states, plus a form-value preview. The Native
inputs tab covers native text, number, date, time, color, file, and select
controls. Each custom control owns its value semantics. Text-only convenience
props cannot be combined with `control`.

Pagination ellipses are named buttons that open one shared Base UI Popover.
The popup reuses `PaginationJump` validation. Accepted local jumps close the
popup and return focus to a visible, enabled current-page control. When that
control is unavailable, the callback explicitly focuses the navigation region
and suppresses Base UI's descendant fallback. The region remains outside the
normal Tab order. Ordinary dismissal keeps Base UI's default focus behavior.
The Ellipsis jump demo includes both loading-after-jump and disabled-current
states with enabled sibling controls.

`getPageHref` also supplies native Go links. Native activation does not invoke
local setters or clear the draft before navigation. `mobileMaxPages` is exposed
on `KiraPagination`, with the compact default unchanged. The component imports
the shared reduced-motion hook. Both demo versions are 3.1.0.

### Audit and focused checks

The read-only audit reviewed the frozen R2 additions against
`additions-baseline`. It confirmed two defects: compound-control label identity
and a navigation-region fallback that Base UI could redirect to a sibling.
The main session corrected both in R3. Those corrections have not received
live browser verification or a second independent review.

All 272 files in `candidate-additions-r3-manifest.json` matched the primary
workspace, isolated verification checkout, and frozen candidate before checks.
The four changed files were the two components and their demo pages.

- The R3 SSR assembly smoke passed for all 11 control shapes and pagination.
  SSR does not verify hydration, native label activation, focus, or interaction.
- The custom-control and pagination prop-contract check had no fixture or target
  diagnostics. It exited 2 on one shared Select diagnostic. Negative contracts
  rejected mixed custom/text props, anchor ellipses, and cursor/mobile-range props.
- The app TypeScript check exited 2 with 46 unrelated diagnostics and no target
  diagnostics.
- Both audit fixtures were moved out of the verification checkout before the
  required gates ran.

### Required gates and registry

The commands ran in order against R3 in the isolated checkout.

| Command         | Exit | Result                                                                                            |
| --------------- | ---- | ------------------------------------------------------------------------------------------------- |
| `bun run check` | 1    | 113 unrelated lint errors. No target lint errors. Later type and formatting stages did not run.   |
| `bun run build` | 1    | Registry generation succeeded, then the same 113 lint errors stopped the build. Vite did not run. |

The lint output also contains warnings, including 323 references across the
owned components, demos, and hook. Zero target errors is not a clean lint pass.
No unrelated source fixes were made to bypass the repository failures.

Only `public/r/field.json`, `public/r/pagination.json`, and their two entries in
`public/r/registry.json` changed. The other 71 catalog entries were preserved.
`public/r/index.json` was already equivalent and remains byte-for-byte unchanged.
Every embedded component and hook string matches the candidate's UTF-8 bytes.
Field retains its `separator` registry dependency. Pagination retains `select`
and now includes both `use-pagination.ts` and `use-reduced-motion.ts`. Direct
Base UI Popover usage adds no local Popover or Button dependency.

### Remaining verification gaps

The prior v3.0.1 screenshots and interaction results remain historical evidence.
They are not a pass for the new Controls, Native inputs, or Ellipsis jump tabs.
After the old named browser daemon reported `conn: Connection lost`, one
supported recovery attempt stopped before the script ran:

```text
browser-use: permission-blocked: the pending Chrome connection ended before approval; browser-use did not retry or create another connection.
```

New-flow label activation, form values, validation, read-only and disabled
behavior, ellipsis keyboard dismissal, disappearing-trigger focus, the
unavailable-current fallback, and native Go links remain unverified live.
The new tabs also lack light/dark visual captures at 375px and 1280px and a
reduced-motion browser check. Shared-token contrast failures and the earlier
native zoom, assistive-technology speech, physical-device, and OS-focus gaps
remain. Shared token scales were not changed. The full upgrade is not verified
complete while these gaps and the required gate failures remain.

R3 evidence is stored beside the historical evidence under the same task root:
`candidate-additions-r3-manifest.json`, `candidate-additions-r3-meta.json`,
`verification-additions-r3.json`, `gates-additions-r3.json`,
`gate-diagnostics-additions-r3.json`, `registry-sync-additions-r3.json`,
`registry-scope-additions-r3-hashes.json`, `qa/ssr-additions-r3.json`, and
`qa/browser-recovery-r3-error.json`. The detailed command logs retain the matching
R3 suffix.

## v3.1.1 shared controls, November 13, 2026

`FieldInput` now renders the existing kit `Input` for its default text control.
It inherits the shared input variants, adornments, clear/copy actions, and
reduced-motion behavior while preserving field IDs, validation, composed
change/blur handlers, and controlled or uncontrolled character counts.
`InputProps` exposes the underlying Base UI input contract so `onValueChange`
and its cancellation details pass through the shared component.

`KiraField` multiline now renders the shared `Textarea` through the Base UI
control adapter. It retains textarea sizing and automatic content growth.
`inputProps.size` uses the kit `xs`, `sm`, `default`, and `lg` variants; multiline
maps `xs` to the textarea's `sm` variant. This replaces the old native numeric
input-size contract. Explicit bare native render overrides retain the previous
field fallback classes, and the low-level `FieldControl` adapter remains
available for native controls.

The Basic, Controls, Features, States, and Keyboard text examples use the
shared field input. Controls now reuse `NumericInput` and searchable
`KiraSelect` instead of assembling NumberField and Combobox primitives locally.
NumericInput forwards `id`, `name`, `required`, and `readOnly` to NumberField
Root. KiraSelect forwards field identity and read-only state through its simple
and searchable paths. A read-only shared Input hides its clear action.
Field's registry dependencies now include `input`, `textarea`, and `separator`.

### Focused verification

Fifteen automated headless Edge checks passed in an isolated checkout. They
cover label activation, once-only change/blur adapters, clear actions, controlled
and uncontrolled counters, multiline styling/sizing, custom rendered textarea,
cancelled changes and prevented blur, disabled/read-only inputs, numeric
stepping and read-only state, searchable and simple selection, native-render
fallback styling, and submitted form values.

Independent static review identified the native-render styling fallback and
multiline-size gaps. The main session corrected both and reran the focused
checks. The final corrections did not receive a second independent review.
The previous full-upgrade visual, assistive-technology, and device verification
gaps remain; these focused interaction checks do not establish those results.

Registry generation succeeded. `bun run check` and `bun run build` remain
blocked by the same 100 lint errors present in the pre-change snapshot, with
no errors in the changed component, demo, or registry files. The separate app
TypeScript check reports two existing diagnostics: `src/components/ui/flex.tsx`
and `src/pages/components/textarea.tsx`. Target TypeScript diagnostics are zero.

Evidence is retained under `%TEMP%/kira-field-shared-d41qpqgk/`, including the
pre-change snapshots, candidate manifest, focused regression fixture/report,
independent-review findings, baseline comparisons, and required-gate logs.

### Compact pagination ellipsis popup

The ellipsis page-jump popup now shows only the page number input and Go action.
The title remains available to screen readers, and the input's accessible label
includes the valid page range. Enter submits; Escape or clicking outside closes
the popup. Page validation and current-page focus restoration are preserved.
Five focused headless Edge checks passed for opening, invalid input, both
dismissal paths, and jumping with Enter without submitting an ancestor form.
Target lint and formatting passed. Evidence is retained under
`%TEMP%/kira-pagination-simple-g_aym0bv/`.

## v3.1.2 pagination controls, November 13, 2026

Generated page anchors now inherit their content and URL from the Base UI
button props. The previous render element supplied empty children, which
replaced the default page number in the Links demo. The same composition also
kept an active URL on disabled generated links; disabled anchors now remove
that URL. Explicit labels, custom render elements, localized numbers, and
native modified-click behavior are preserved.

The page-size selector now composes `KiraSelect` in its default single-select
mode. It uses the shared Select height, typography, border, and focus ring,
while retaining its pagination control slot and touch target. Its option list
still rejects invalid sizes and duplicates, includes the current size, resets
the page to 1 on selection, and notifies callbacks once. Labels, form names,
accessible descriptions, and loading/disabled state are preserved. KiraSelect
now forwards `data-slot` and `aria-describedby` through both its simple and
Combobox paths so wrappers can retain those attributes.

Numbered and cursor loading messages reuse the shared `Spinner` with
`size="sm"` and `variant="muted"`. The 16px indicator rotates with the existing
1-second linear CSS animation while a request is pending. Reduced motion keeps
the arc still, and background tabs pause the shared spinner. The indicator is
decorative: the existing loading text and single pagination status region
continue to convey the state. Navigation buttons and result rows gain no
animation or delay. The animation opportunity assessment selected only this
state indicator; repeated navigation and readable result data did not pass the
frequency/function gates.

### Focused verification

Twelve headless Edge scenarios passed against the final KiraSelect candidate
and the production stylesheet. They cover the unchanged Links demo function,
ordinary and modified clicks, URL Back/Forward, localized/custom labels,
disabled URLs, native Space behavior, shared Select styling, page-size reset
and form submission, keyboard dismissal/focus, both loading modes, live
reduced-motion changes, completion, mobile overflow, and dark styling.
Fourteen shared-field scenarios and the five compact-ellipsis scenarios also
passed after the Select wrapper change.

Independent static review of the four source/demo/dependency-map files found
no confirmed defects and verified their candidate hashes before and after
inspection. Target lint and formatting passed. The repository check/build
continue to fail on the same 100 lint errors in the saved baseline; the
separate app TypeScript check has the same two diagnostics in `flex.tsx` and
the textarea demo. The edited files have no lint errors or TypeScript
diagnostics. These checks cover this focused change; earlier full-upgrade
visual, assistive-technology, and device verification gaps remain.

Registry generation succeeded. The pagination dependency map now includes
`select` and `spinner`. Generated pagination and Select JSON embed the exact
component bytes; their master-registry entries were refreshed while preserving
all other entries. Reproduction snapshots, source hashes, interaction reports,
and baseline/candidate gate logs are retained under
`%TEMP%/kira-pagination-controls-9ml2ixe3/`.
