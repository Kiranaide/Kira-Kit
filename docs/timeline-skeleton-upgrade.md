# Timeline and Skeleton upgrade — November 13, 2026

Status: Pass A and Pass B source and all eighteen focused demos implemented.
Scoped verification completed November 13, 2026. Required repository gates remain
blocked by lint errors outside this component family.
User scope recovered from the attached thread: both components; research through
October 31, 2026; finish Pass A and Pass B before any tests, lint, builds, or browser QA.
The previous run completed Timeline's read-only audit but failed before editing.
Baseline commit: `d10168441fab2755be0cb08d9c83591063d41f72`. The four component/demo
files matched that commit before this continuation. Many unrelated workspace edits
are present; they are excluded from this implementation.

## Research

- `bunx npm view @base-ui/react version` returned 1.9.0 on November 13.
  Installed package is 1.9.0. No prior Timeline or Skeleton status rows existed.
- Base UI's [official changelog](https://github.com/mui/base-ui/blob/master/CHANGELOG.md)
  dates 1.9.0 to October 9, 2026. Relevant changes: native disabled Collapsible
  triggers, closing when a render function removes a panel, reopening animation
  repairs, and general detached-animation cleanup. 1.8 added Avatar.Image
  keepMounted. Installed exports contain no Timeline or Skeleton primitive.
- [shadcn Base UI Skeleton](https://ui.shadcn.com/docs/components/base/skeleton)
  supplies a styled placeholder and avatar/card/text examples. Its component
  catalog contains no Timeline. Extend the simple placeholder model; reuse the
  kit's Base UI Collapsible, Avatar and Button for behavior.
- [MUI Timeline](https://mui.com/material-ui/react-timeline/) demonstrates alternate
  alignment, dots, connectors and opposite content. The existing Kira API already
  advertised those layouts; repair them before adding a new feature.
- [AI Elements Task](https://elements.ai-sdk.dev/components/task) documents a
  collapsible, multi-step workflow history, including pending/in-progress/completed
  states. This motivates a release-workflow history with concise summaries and
  optional evidence/details. It does not justify inventing an agent runtime.
- [React Suspense](https://react.dev/reference/react/Suspense) describes fallback
  replacement and retaining previously revealed content during transitions.
  A controlled Skeleton boundary can apply the same product distinction to
  ordinary fetching without pretending to catch Suspense or application errors.
- Research used current official pages, the installed packages, and the dated
  October Base UI release. Undated living docs do not prove an October introduction
  date for a pattern; these are established use cases, not claimed October launches.

## Skeleton Explore (static; no execution)

1. Exports: Skeleton/SkeletonGroup, Root/Bone/Text/Lines/Heading/Avatar/Button/
   Image/Card/TableRow/ListItem and skeletonVariants. Root loading defaults true;
   Bone variant defaults default, animated true. Lines count 3/gap md/last 3/4;
   Avatar size md; Image ratio 16/9; TableRow columns 4.
2. Primitive: presentational divs are appropriate; no Base UI Skeleton primitive.
   Stock shadcn matches the basic bone rather than the Kira grouping API.
3. Motion: CSS pulse/wave and nested shimmer. Reduced-motion CSS exists, but the
   shimmer ignored animated=false, duration and delay; no offscreen/hidden pause.
4. Slots: exported aliases often rendered the generic bone slot. Shimmer and
   list text wrappers had no slot.
5. Bugs: SkeletonLegacy leaked animated onto DOM; Card leaked motion props onto
   its wrapper without configuring children; Lines/TableRow repeated IDs and
   event handlers on bones; ListItem dropped wrapper props. Truthy timing checks
   ignored zero. Root loading=false left motion and the loading message active.
6. States: no delayed loading, retained refresh, coordinated pause, failure
   recovery or meaningful loaded-content demo. Decorative children could contain
   focusable controls despite aria-hidden.
7. Demos: no KeyboardShortcuts, Kira, States or Changelog. Usage referenced an
   undeclared isLoading; API omitted parts and the text variant.
8. Registry: no external UI imports originally. Shared motion hook must be
   embedded by registry generation. Sidebar consumes animated=false SkeletonBone.

## Pass A

Timeline: replace hand-written collapse and image error state with shared Base UI
components; list semantics replace the unsupported feed keyboard contract;
measure virtual rows and keep placement transforms exclusive to virtualization;
group via Map; safe dates, signed relative time, locale/timezone/week grouping;
real responsive layouts and density; status text, controlled disclosure and
per-item overrides; refs/slots and visible disabled reasons. Unprompted GSAP
entrances removed. Collapsible owns opening/closing motion.

Skeleton: one bone implementation; semantic shimmer colors; timing reaches the
moving layer; reduced-motion and visibility gates; shared group motion; real
refs/slots and container prop destinations; finite count normalization; one
external status region; decorative content inert. All existing names retained.

## Pass B design briefs

### Timeline: inspect a workflow without losing the event history

Problem: loading older events or investigating a failed step can obscure the
context the user was reading.
Behavior: KiraTimeline composes event data, an initial skeleton, preserved events
while fetching older entries, cancellable loading, error/retry and completion text;
individual events expose native disclosure controls and actual application actions.
Cut: no implicit polling, decorative entrances, global shortcuts, fabricated
progress, search framework or new drag interactions.

### Skeleton: distinguish first load from refresh

Problem: fast requests flash placeholders; refreshes discard useful content and
focus; separately animated placeholders compete visually.
Behavior: KiraSkeleton delays initial placeholders, optionally holds an already
visible fallback briefly, reserves consumer-chosen space, preserves a mounted
content branch during refresh, and coordinates placeholder motion and one status.
Cut: no fetch engine, forced loading duration by default, layout measurement magic,
optimistic success, per-bone live regions or animated content entrances.

## Verification — November 13, 2026

Verification used an isolated detached worktree at baseline commit
`d10168441fab2755be0cb08d9c83591063d41f72`, overlaid with the current workspace
files. SHA-256 checks confirmed that the four component/demo files matched the
primary workspace before and after testing. Test/build output, dependencies and
browser artifacts stayed in the isolated checkout. Existing ignored lint-plugin
dependencies were copied into that checkout after the initial gate attempt
reported a missing Sonar plugin.

### Results

- `bun test scripts/timeline-skeleton.test.tsx`: **7 passed** after correcting
  the line-count assertion to count `skeleton-text`, the slot emitted by
  SkeletonText. The original assertion expected `skeleton-bone` and failed on
  the correct rendering. This one-line test correction was applied to the
  primary workspace. Component and demo source required no correction.
- All **20 demo/usage snippets** compiled with the project's TypeScript options.
- Lint over the four target files: **0 errors**, 223 advisory warnings.
  Target formatting passed. The separate app TypeScript check reported two
  diagnostics in `src/components/ui/flex.tsx` and
  `src/pages/components/textarea.tsx`; no target-file diagnostics.
- Required `bun run check`, then `bun run build`: both exited 1 on **94 lint
  errors outside the four target files**. The production Vite build was not
  reached. Registry generation and its checks succeeded inside `bun run build`.
- Generated Timeline and Skeleton registry files embed the exact component and
  shared reduced-motion hook source. Timeline dependencies are Avatar, Button,
  Collapsible and Skeleton. Skeleton has no cross-component registry dependency.
- All **18 demo tabs** were driven in headless Edge in light and dark at
  **375×900 and 1440×900**: **72 captures**, no horizontal page overflow,
  duplicate IDs or Vite error overlay. Four overview contact sheets were
  inspected. Tall/offscreen panel captures can be clipped; this is not a claim
  that every pixel of all 72 captures received a complete visual review.
- **36 scoped axe 4.10.3 scans** (all tabs, both themes, 375px) found **0
  violations**. `aria-prohibited-attr` appeared in incomplete/manual results;
  automated scans do not establish full accessibility compliance.

### Timeline behavior

Across both sizes and themes, trusted keyboard input verified Enter/Space
disclosure toggles, Tab/Shift+Tab access to the details link, inert closed
content and a visible focus ring. Native End reached event 150 in the virtual
viewport. Existing events remain visible and busy during loading; cancellation
restores focus to the load action; an error offers retry; successful retry
appends exactly one event.

An early mobile capture showed overlapping virtual rows during initial layout.
Settled row measurements were correct in all four contexts. A subsequent
600 ms animation-frame sample during hidden-panel reveal found no overlap in
all four contexts. No persistent virtualization defect was confirmed; preserve
the initial capture observation rather than claiming exhaustive interruption
coverage.

### Skeleton behavior

Across both sizes and themes, a 50 ms request completed without a visible
fallback; an 800 ms request revealed and replaced the fallback. The optional
500 ms minimum display held it after the 80 ms request completed. Refresh kept
the same input, edited draft and focus; non-retained reload hid and made loaded
controls inert. Shimmer used the configured 1.6 s duration, Pause stopped it,
and Motion off removed its moving layer.

Offscreen pause passed using the app's actual `main` scroll container, and
inactive demo panels paused. A first attempt scrolling the document tested the
wrong container and was superseded. Headless tab activation did not change
`document.hidden`; real hidden-document pause remains unverified.

Live reduced-motion emulation removed shimmer and reached **zero document
animations** after the shared controls' short transitions settled. Four early
150 ms samples still contained finishing transitions; settled rechecks passed.
Timeline disclosure also reached zero animations, with computed transition
duration `0.00001s` under the shared reduced-motion CSS.

### Stress cases and remaining gaps

Timeline Layouts/States and Skeleton Shapes/States passed overflow checks at
320px in both themes. The States tabs passed a CSS 200% zoom smoke check in
both themes. This was CSS zoom, not real browser zoom.

Remaining gaps: real hidden-document visibility, screen-reader output, physical
touch devices, real browser zoom, exhaustive focus/contrast and rapid
interruption coverage, complete tall-panel screenshot inspection, and consumer
registry installation/build. Existing external modern-monaco worker exceptions
were observed; no target component runtime exception was found.

Raw evidence is retained in
`C:/Users/Lenovo/AppData/Local/Temp/kira-timeline-skeleton-qa-20261113-i2y04l1y/reports/`:
`manifest.json`, `matrix.json`, `interactions.json`, `followup.json`,
`final-checks.json`, `accessibility.json`, `snippets.json`, gate logs and captures.
The exploratory harness results must be read with the superseding rechecks
described above. The test server and owned browser sessions were closed after
verification.
