# Resizable and Scroll Area upgrade

Research cutoff: October 31, 2026. Implementation: November 13, 2026.
Base UI audit: 1.9.0. Resizable panels: 4.14.8 → 4.16.0.
The user requested no testing until both Pass A and Pass B features and demos
were implemented. Other working-tree changes predate this task.

## Research

- [Base UI releases](https://base-ui.com/react/overview/releases) dates 1.9.0
  to October 9. [1.8.0](https://base-ui.com/react/overview/releases/v1-8-0)
  prevents scrollbars stealing focus and hides them from the accessibility
  tree. [1.9.0](https://base-ui.com/react/overview/releases/v1-9-0) removes the
  presentational viewport role. The timeline records WebKit thumb overscroll
  feedback in 1.7.0.
- [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
  provides Root, Viewport, Content, Scrollbar, Thumb and Corner. Native overflow
  edge attributes support indicators; Content observes dynamic size changes.
  Base UI has no resizable splitter primitive.
- Stock shadcn [Scroll Area source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/scroll-area.tsx)
  wraps Base UI; [Resizable source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/resizable.tsx)
  wraps react-resizable-panels. These live sources establish current parity,
  not a historical snapshot of their exact October source.
- [Panels 4.16.0](https://github.com/bvaughn/react-resizable-panels/releases/tag/4.16.0)
  shipped October 31: native docking Workspace, CSS zoom/scale resize fixes,
  and cross-window preview fixes. [4.15.0](https://github.com/bvaughn/react-resizable-panels/releases/tag/4.15.0)
  improves imperative resize/collapse allocation. Adopt 4.16.0 and retain
  Group/Panel/Separator for this split-layout scope. November-only features
  and docking are outside this pass.
- [October VS Code layout documentation](https://github.com/microsoft/vscode-docs/blob/4ad8b6554dd1f408fc0568f16b2f9b38763ef084/docs/configure/custom-layout.md)
  documents editor plus Copilot views, remembered layouts and restore defaults.
- [Vercel Conversation](https://ai-sdk.dev/elements/components/conversation)
  documents automatic follow-output and a return-to-bottom control. The live
  page's November deprecation notice is outside the feature cutoff. This is
  a use-case reference, not a new dependency or dated October release claim.
- Installed v4 declarations specify numeric sizes in pixels, percentage
  strings explicitly, and numeric Layout values as percentages. Existing
  CollapsiblePanel/SplitView defaults and demos confused those contracts.

## Explore and Pass A

Two Sol auditors inspected the original component/demo pairs without changing
files or testing. Baseline: d10168441fab2755be0cb08d9c83591063d41f72; scoped
files matched HEAD at inspection.

Resizable defects: dead autoSaveId, narrowed native refs/callbacks, discarded
handle children, ungated motion, missing slots, obsolete state selectors,
incorrect units and nonexistent toggle/Escape documentation. Scroll Area:
invalid hsl(oklch()) color, all sizes forced thin, omitted Base UI primitives,
fictitious API exports/asChild and a static chat example claiming auto-follow.
Both demo pages lacked Changelog and Kira/states sections.

Pass A implements native resizable props, tolerant native persistence,
percentage defaults, separator states, 24px fine/44px coarse hit targets,
motion gating and slots. SplitView explicitly converts its percentage API.
The existing panels dependency is pinned to 4.16.0; no package was added.

Scroll Area composes all six Base UI parts, exposes viewport/content props
and refs, preserves convenience onScroll destination and native focus, and
provides actual thickness variants. SimpleScrollArea remains an alias.
Function-form Base UI class/style props remain supported.

## Pass B design briefs

### Saved review layouts

Problem: reviewers repeatedly resize explorer and inspector panes.
Behavior: KiraResizable composes named panels with saved sizes, visible
collapse/expand controls and restore-layout action using native APIs.
Cut: docking, tab management, popouts, global shortcuts and animated resizing.

### Overflow cues

Problem: documents and horizontal strips hide content beyond their edges.
Behavior: optional indicators use native overflow state; scrollbar visibility
can stay constant or reveal on hover, scrolling and keyboard focus.
Cut: progress meters and decorative scrolling effects.

### Follow incoming activity

Problem: new logs or messages pull readers away from earlier activity.
Behavior: opt-in KiraScrollArea follows content while pinned, pauses while
reading history, and provides a return-to-latest control and one polite status.
Cut: message models, networking, virtual lists and per-update smooth scrolling.

These additions follow the user's research scope and the playbook's primitive,
compact-button, status-region and drag-alternative rules. Its feature menu has
no dedicated layout/feed entry.

## Verification

Pass A and Pass B implementation is complete. All checks began after both
components' features and demo tabs were implemented, as requested.

### Completed features and migration

- `KiraResizable` supports named panels, saved layouts, collapse controls,
  restore defaults, balance panels, and empty or locked layouts. Public layout
  keys remain stable application IDs; DOM IDs are unique per instance.
  Collapsed content is inert.
- Scroll Area exports all six Base UI parts, overflow indicators, and shared
  variants. `KiraScrollArea` can follow incoming activity, pause while the
  reader browses history, and return to the latest activity. Content growth
  is observed; `contentVersion` covers updates that keep the same height.
- Each demo page has nine focused tabs plus keyboard guidance, usage, API
  reference, and a v2.0.0 changelog. The follow-output example has local
  append, growth, and history controls; it does not use a network service.
- `CollapsiblePanel` now defaults to `"20%"` with a `"10%"` minimum.
  Numeric panel sizes still mean pixels. Explicit `20` and `10` retain the
  previous pixel behavior. `SplitView` converts its numeric percentage API
  to percentage strings. `autoSaveId` now persists and needs stable panel IDs.
- Scroll Area now has separate Root, Viewport, and Content elements. Scrolling
  refs belong on `viewportRef`; content padding and layout belong on
  `contentProps`. Root `ref` targets the root. Convenience `onScroll`,
  viewport naming, and focus props target the viewport. `SimpleScrollArea`
  remains an alias. Automatic smooth scrolling has been removed.

### Independent review

A Sol reviewer inspected the candidate against baseline
`d10168441fab2755be0cb08d9c83591063d41f72` without modifying the checkout.
The main session fixed all four reported issues:

1. Saved low-level layouts with different panel IDs no longer override the
   caller's `defaultLayout`.
2. Changing Kira's persistence key or orientation remounts the native layout
   so its cached state does not carry across layouts.
3. Scrollbars use Base UI's corner insets without full-length CSS overrides.
4. Changing an inline `onFollowingChange` callback no longer restarts the
   observer or clears unseen-activity tracking.

The final fixes received compiler and registry checks. No second independent
review was performed. Browser interaction checks were subsequently completed
as recorded in the continuation below.

### Commands and evidence

Verification used `C:/Work/kira-layout-qa-20261113`, an isolated checkout at
the baseline with the working candidate copied in. The initial overlay
contained 227 files and preserved deletions. SHA-256 comparisons verified
the final eight implementation, demo, dependency, and registry-script files.
Generated artifacts stayed in that checkout until registry synchronization.

`bun install --frozen-lockfile` succeeded. The checkout's lint config needs
`eslint-plugin-sonarjs`, which the root manifest does not declare.
Checks used `NODE_PATH=C:/Work/kira-kit-v2/node_modules` to resolve the
already-installed plugin without changing the dependency manifest.

| Check                                                                   | Final result                                                                                                                                                                                          |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun run check`                                                         | Exit 1: 100 lint errors outside the upgraded component/demo files. Target files have non-blocking lint warnings. TypeScript and formatting stages were not reached.                                   |
| `bun run build`                                                         | Registry generation passed; the following check stopped on the same 100 lint errors. Vite production compilation was not reached.                                                                     |
| `bunx tsc --noEmit -p tsconfig.app.json`                                | Two unrelated diagnostics remain: `src/components/ui/flex.tsx:168` and `src/pages/components/textarea.tsx:626`. No diagnostics in the target components or demos.                                     |
| Copied demo and usage snippets, using the app's strict compiler options | All 20 snippets and their imported dependencies compiled with zero diagnostics. Unused snippet imports were removed.                                                                                  |
| Registry contents                                                       | The resizable, scroll-area, and split-view entries match their source files exactly. Both new Kira compositions declare the Button registry dependency; reduced-motion hooks are embedded where used. |

Scoped Prettier checks passed for both component/demo pairs, `split-view.tsx`,
and this report. The two component/demo pairs retain 109 non-blocking lint
warnings, including spacing, function length, and runtime type checks.

Logs are retained in the isolated checkout as `check-final.log`,
`build-final.log`, `type-diagnostics-final.log`, and
`snippet-diagnostics-final.log`, and `format-diagnostics-final.log`.
Snippets are extracted to
`node_modules/.cache/layout-snippets/` by
`C:/Users/Lenovo/AppData/Local/Temp/kira-verify-layout-snippets.ts`.

The three generated component JSON files and their entries in `registry.json`
and `index.json` were synchronized to the primary checkout. Other registry
entries were preserved. `public/r/` and the playbook are ignored by Git in
this repository.

### Browser QA continuation

The initial preview timeouts were resolved on the next testing turn. T3
preview checked the primary checkout at `http://localhost:5173`; the reused
server stopped during the run, so a task-owned replacement was started.
No separate headless Edge fallback was used.

- Walked all nine feature tabs per component in light and dark themes at
  375px and 1440px: 72 combinations. Geometry checks found no main-container
  horizontal overflow and no Vite runtime overlay. Screenshots were captured
  for 71 combinations; the first Basic/mobile/light capture was not retained.
  Representative mobile/desktop screenshots were visually inspected, not a
  complete per-state contrast audit.
- Resizable: pointer dragging changed Basic from 75% to approximately 37.2%;
  arrow keys moved by 5%, Home/End reached 20%/80%; Tab/Shift+Tab and the
  keyboard focus ring worked. Enter collapsed/expanded Outline (0%/30%).
  Saved layout changed to 40% and survived remount; restore returned to 35%.
  Kira Details became inert when collapsed and restore returned the layout
  to 25/50/25. Locked/empty/long and multilingual content rendered at mobile
  width. F6 did not move focus in the nested demo; it is not documented as
  a supported shortcut. Deferred drag-preview pointer behavior remains
  unverified because the drag tool rejected its selectors.
- Scroll Area: append and content growth followed the bottom; Read earlier
  paused at zero; subsequent append/growth preserved that position and
  displayed New activity below. Jump resumed following. Enter and Space
  activated Jump from the keyboard. ArrowDown, PageDown, PageUp, Home and
  End scrolled the focused viewport; overflow cues changed at the edges.
- Found and fixed a keyboard regression: passing `tabIndex={undefined}`
  suppressed Base UI's automatic tab order. The convenience wrapper now
  omits that prop unless explicitly supplied. All 36 Scroll Area
  theme/width/tab combinations were rechecked after the fix: overflowing
  viewports were tabbable and fitting viewports had `tabIndex=-1`.
  Keyboard focus rings were visible. Two Bun regression tests in
  `scripts/scroll-area.test.tsx` cover primitive default preservation and
  explicit overrides; actual overflow focus behavior was checked in-browser.
- State demos were checked at CSS `zoom: 2` in both themes at 1440px with
  no main-container horizontal overflow. This is not true browser zoom.

Evidence index: `C:/Work/kira-layout-qa-20261113/qa-evidence.json`, containing
screenshot paths for the initial matrix, the 36 post-fix captures, and CSS
zoom states. Screenshots reside under the T3 browser-artifacts directory.

### Continuation validation gates

| Check                                                     | Result                                                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `bun test scripts/scroll-area.test.tsx`                   | 2 passed, 0 failed.                                                                                                 |
| Scoped Oxlint and Prettier for the changed component/test | Exit 0; existing component lint warnings remain.                                                                    |
| `bun run check`                                           | Exit 1: 95 lint-error diagnostic lines, none in resizable/scroll-area/split-view. Later stages not reached.         |
| `bun run build`                                           | Registry built successfully, then stopped on the same lint failures; Vite production build not reached.             |
| `bunx tsc --noEmit -p tsconfig.app.json`                  | Same two unrelated Flex:168 and Textarea:626 errors.                                                                |
| `bun run typecheck`                                       | Exit 0, but the root config has no files and references app/node projects; this is not evidence of app compilation. |
| Generated component JSON                                  | Resizable, Scroll Area and SplitView content exactly matches current source, including the tab-order fix.           |

Logs: `check-continuation.log`, `build-continuation.log`,
`app-types-continuation.log`, `regression-final.log`,
`target-lint-final.log` and `format-final.log` in the isolated checkout.
The earlier 100-error results above describe the previous snapshot, not this
continuation. Unrelated working-tree changes were not repaired.

Remaining gaps: real browser 200% zoom, reduced-motion emulation (the owned
preview API exposes no media emulation), hidden-document reveal, real touch
and screen-reader testing, deferred drag-preview behavior, RTL keyboard
scrolling, and exhaustive contrast checks. A settled page had zero active
animations under its normal preference, but that does not verify reduced
motion. Full check/build and app compilation remain blocked; this upgrade is
not recorded as fully gate-passing.
