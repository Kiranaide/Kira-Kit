# Sidebar upgrade

Research cutoff: October 31, 2026. Implementation started November 11, 2026.
The user selected `src/components/ui/sidebar.tsx` and required implementation
and the demo to be complete before any checks or browser testing.

## Research and direction

- The npm registry reports Base UI **1.9.0**, published **October 9, 2026 at
  08:52:43 UTC**. `bunx npm view @base-ui/react version` also returned 1.9.0.
  The installed dependency is already `^1.9.0`; no package upgrade is needed.
  Source: <https://registry.npmjs.org/@base-ui/react>.
- The official 1.9.0 changelog fixes Collapsible closing/remounting, Drawer
  keyboard spacing, swipe release velocity and item taps, plus Menu focus and
  retained-popup behavior. These support replacing sidebar-specific versions
  of those behaviors with the existing Base UI wrappers.
  Source: <https://github.com/mui/base-ui/blob/master/CHANGELOG.md>.
- Stock shadcn's Base UI sidebar already supplies provider state, mobile
  layout, collapse modes, trigger, groups, menu parts, tooltips and skeletons.
  Those are parity work, not new feature claims. Kira retains its public
  composition while reusing the kit's Drawer, Collapsible and DropdownMenu.
  Sources: <https://ui.shadcn.com/docs/components/base/sidebar> and
  <https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/sidebar.tsx>.
- Linear's January 29, 2026 sidebar customization update describes arranging
  navigation around a person's work. Its Favorites documentation supports
  pinning projects, views and issues, with favorites ahead of team navigation.
  Sources: <https://linear.app/changelog/2026-01-29-sidebar-customization>
  and <https://linear.app/docs/favorites>.
- Linear's March 12, 2026 UI refresh emphasizes a calmer sidebar and clearer
  hierarchy. The implementation uses Kira's existing typography, semantic
  colors and spacing. It adds no decorative backgrounds or attention loops.
  Source: <https://linear.app/changelog/2026-03-12-ui-refresh>.
- WAI-ARIA's disclosure-navigation example explicitly avoids `role="menu"`
  for ordinary links. Tab navigation is native; arrow-key support is optional.
  Source: <https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/>.
- Playbook §3.5 maps personal shortcuts to bookmark toggles and reorder, and
  maps availability explanations to `disabledReason`. Reorder must have
  visible button alternatives to drag. Mobile disclosure uses the existing
  Drawer. Search and data-driven composition make these features usable.

The dated release references establish availability before the cutoff.
Undated live documentation is used for API and interaction guidance, not as
evidence that a feature first shipped in October. Search snippets disagreed
about the Base UI release date; the npm timestamp and raw official changelog
both establish October 9.

## Explore report

The baseline is the existing working copy, not HEAD. HEAD at task start was
`d10168441fab2755be0cb08d9c83591063d41f72`; both sidebar files already differed.
Copies are retained in the local temporary `kira-sidebar-upgrade-c4348d6e`
directory for comparison. Repository knowledge files were absent.

1. **Exports and props.** ThemeProvider/useTheme; SidebarProvider/useSidebar;
   Sidebar; Trigger; Header; Content; Search; Group; Item; Menu; MenuItem;
   MenuButton; MenuSub; ItemGroup; Divider; Footer; User; ThemeToggle; Skeleton;
   Badge; sidebarVariants/badgeVariants and their prop types. Provider owns
   collapse mode, side, defaults, persistence, widths and hover expansion.
   `Sidebar.side` is declared but ignored (baseline component lines 254–309).
   `SidebarUser.menuItems[].href` is declared but ignored (1209–1361).
   Trigger caller `onClick` overrides toggling (420–452).
2. **Primitives.** Tooltip and Drawer wrappers are already present. Group
   disclosure and the account menu duplicate existing Collapsible/Menu
   behavior. No standalone Base UI sidebar primitive exists; this is a layout
   composition. TanStack routing is part of the legacy SidebarItem contract.
3. **Motion.** A local reduced-motion hook duplicates the shared hook (21–40).
   Width/height and `transition-all` appear throughout. Skeletons, account
   popup, scroll-to-top and several controls ignore reduced motion.
4. **Slots.** Provider, trigger, item, badge, search controls, user popup and
   multiple rendered sub-elements lack stable `data-slot` attributes.
5. **Bugs.** Every provider/search registers a global shortcut (189–204,
   629–641). Storage reads/writes can throw. Collapsed search targets an
   unmounted input (645–670). Mobile content inherits desktop collapse and
   hides its close control (356–379). Content repeats `sidebar-content` IDs.
   Closed groups hide by geometry while retaining focusable links; ItemGroup
   truncates at 500px. Group actions sit inside another button. Disabled links
   remain keyboard-operable. Collapsed rows lose accessible text. Collapsed
   account trigger toggles state without rendering a popup.
6. **States.** Active, disabled and loading exist but need semantics and
   consistent styling. Empty/error recovery, visible unavailable reasons,
   read-only personalization, zero counts and long-label fixtures are absent.
7. **Demo.** The baseline has 10 tabs but no Changelog or Kira composition.
   It claims arrow navigation and scroll persistence that do not exist.
   Some snippets have undefined icons; several actions use alert placeholders.
8. **Registry.** The map says sidebar depends on button/separator, while the
   source imports tooltip/drawer. The final imports, map and generated item
   must agree.

## Plan and feature briefs

### Pass A: core behavior

Preserve existing exports and TanStack links. Add controlled provider state,
storage keys, safe persistence and provider-scoped shortcuts. Replace local
motion/media subscriptions, hand-rolled disclosures and user menu. Give the
mobile drawer a title, visible close control and focus return. Keep collapsed
labels accessible, hide offcanvas content from focus, fix zero badges, use
native list semantics and forward native props to their documented elements.

### Pass B: personal shortcuts

Problem: team navigation grows, while each person returns to only a few views.
Behavior: KiraSidebar pins selected destinations above their original groups
and lets users reorder them with drag handles or Move up/Move down buttons.
Cut: automatic recency ranking, hidden preferences, cross-user storage,
optimistic server-success claims and additional npm dependencies.

### Pass B: searchable navigation and availability

Problem: a view can be difficult to find or unavailable to the current role.
Behavior: filter labels/keywords, reveal matching sections, show empty and
error recovery, and expose disabled reasons to keyboard and touch users.
Cut: remote search, permissions enforcement, AI-generated links and timers.

### Composition and design

KiraSidebar consumes sections/items within SidebarProvider so the content
area shares its trigger/state. The caller owns routes, active destination,
workspace context and optional controlled favorites. Desktop navigation is
quiet and immediate. Base UI owns disclosure and popup lifecycle. Existing
semantic color, radius and focus tokens are retained. Expanded labels can
wrap; icon mode retains accessible names. Mobile uses dynamic viewport and
safe-area spacing, with 44px coarse-pointer controls.

The UI guidance used is ui-taste (operate/polish/craft), frontend-design,
ui-ux-pro-max, emil-design-eng, mobile-native, animate, animation-performance
and break-ui. The navigation search returned only broad breadcrumb guidance;
the exact focus-not-obscured search matched. React search returned only test
query guidance after one retry, so implementation decisions rely on existing
React/Base UI code and WAI-ARIA, not an invented skill match.

## Demo and verification sequence

1. Implement Pass A and update its status row without claiming verification.
2. Implement Pass B and the complete demo: Basic, Modes, Search, Favorites,
   Groups, Account, Controlled state, Mobile, Kira, States and Stress, each
   with focused executable code. Include Keyboard, Usage, API and Changelog.
3. Only after both source and demo are complete, run `bun run check`, then
   `bun run build`. Record failures and their scope; do not alter unrelated
   components to make the repository gates pass.
4. Browser QA: all tabs, light/dark at 375×900 and 1440×900; collapsed search,
   group activation, account keyboard/focus, mobile close/focus/breakpoints,
   scoped shortcuts, disabled links, pin/reorder, controlled state, long
   labels and empty/error/loading states. Check reduced motion and zoom when
   the available browser tools support them.
5. Independent static review may use GPT-6.1 Sol, medium effort. The main
   session owns all edits. Audit tests require an isolated equivalent
   candidate; static inspection must not mutate this shared checkout.
6. Update registry output, status and evidence with actual results. Record
   physical devices, assistive technology and unsupported browser checks as
   gaps. Do not label an unrun or blocked check as a pass.

## Implementation and verification record

### Continuation — November 11, 2026

Recovered the previous session's plan and inherited source/demo drafts. The
continuation baseline is a frozen copy of those two files, not HEAD; the shared
checkout contains many unrelated edits. The original pre-upgrade copies remain
available for API comparison. No repository knowledge directory is present.

`bunx npm view @base-ui/react version` still returns **1.9.0**. The official raw
changelog still starts at 1.9.0. No dependency version or token scale changed.
The feature research retains the requested October 31, 2026 cutoff.

Implementation includes controlled desktop/mobile state, storage failure
fallback, provider-scoped shortcuts, shared disclosures/account menus, labeled
mobile navigation and a visible close control. KiraSidebar adds label/keyword
search, normalized ordered favorites, star toggles, drag handles and visible
Move up/Move down controls, parent-owned preferences and availability/recovery
states. Unavailable links cannot navigate. Skeletons and desktop navigation
remain immediate rather than adding decorative motion.

The twelve co-located demos cover Basic, Modes, Search, Favorites, Groups,
Account, Controlled, Mobile, Kira, States, Stress and Parts. API sections cover
each exported component. Usage includes both the data-driven shell and all
composable parts. Narrow previews keep their selection/instruction text visible.
Empty navigation and managed favorites do not advertise an unusable star action.
Iconless rows retain a visible fallback in the rail.

Breaking changes are recorded in the v3.0.0 demo Changelog: provider-local
shortcuts by default (global is opt-in), parent-bounded sidebar height, removal
of the no-op Sidebar.side in favor of SidebarProvider.side, native list
semantics and unmounted closed disclosure content. Existing component exports
and variant recipes are preserved.

### QA corrections

An independent, non-mutating static audit of the frozen continuation baseline
identified five defects. The main session corrected them: batched boolean
requests compose in one handler; failed storage writes preserve in-memory
changes; focused rows do not remount on a rail peek; closed mobile search can
open the drawer; and nested provider shortcuts do not toggle an outer owner.
The audit did not run artifact-producing tests or certify the final diff.

The browser recheck found two additional problems and verified their fixes:

- Account actions stayed in a portal after their demo tab became inactive.
  This page now uses `DemoTabs lazyMount` so inactive fixtures, including their
  open overlays, unmount. Switching away from an open account menu leaves no
  visible menu portal. Demo state resets when switching feature tabs.
- A search effect competed with mobile popup autofocus: Ctrl+K opened the
  drawer but focus landed on Close. Drawer `initialFocus` now exclusively owns
  pending mobile search focus; the effect handles desktop expansion only.
  Ctrl+K, subsequent Tab, Escape and destination-close were rechecked in all
  four viewport/theme combinations.

The search and item-group triggers also retain distinct, stable `data-slot`
values through their shared tooltip wrapper.

### Required gates

Commands ran in order, after source and demo completion:

| Command         | Result | Scope                                                                                    |
| --------------- | ------ | ---------------------------------------------------------------------------------------- |
| `bun run check` | Exit 1 | 129 repository lint errors; zero errors in either sidebar file.                          |
| `bun run build` | Exit 1 | Registry generation/checks succeed, then the same repository lint gate blocks the build. |

The largest failing files are `src/components/ui/grid.tsx` (17 errors),
`field.tsx` (13), `color-picker.tsx` (12), `camera.tsx` (11) and
`src/lib/camera/guide-presets.ts` (9). They are outside this upgrade's scope and
were not edited to make this pass green. Sidebar lint warnings remain.
TypeScript, repository-wide Prettier checking and the Vite production build
were **not reached**. A clean production build is not claimed; overall upgrade
completion remains blocked.

Registry output contains `ui/sidebar.tsx` and `hooks/use-reduced-motion.ts`.
Its generated sidebar content is checked against the current source, not HEAD.
The existing dependency map at `scripts/build-registry.ts:118` is correct and
was not changed by this continuation. Registry dependencies are avatar,
collapsible, drawer, dropdown-menu and tooltip. NPM dependencies are Base UI,
Tabler, TanStack Router, cva, clsx and tailwind-merge. `public/r` is ignored in
this checkout; generating it does not create a tracked patch.

### Browser evidence

The shared preview opened, but two snapshot attempts failed with
`Preview automation snapshot timed out after 15000ms.` The permitted fallback
was browser-use/CDP against the local Vite server. Checks are browser-emulated,
not physical-device or assistive-technology results. Rendering was flushed
through screenshots before final assertions to avoid stale background frames.

- All twelve feature tabs were DOM-selected and captured at **375×900** and
  **1440×900**, in **light and dark**: 48 final captures. Each selected panel
  has nonzero dimensions; no horizontal page overflow, Vite error overlay or
  stale visible menu/dialog portal was observed. Contact sheets were inspected.
  Some captures clip the surrounding page; this is not full-page certification.
- Separate open mobile captures cover all four combinations. The 304px drawer
  fits the viewport, has a navigation label and visible Close action, and
  initially focuses an element inside it. Native 30-Tab cycles and Shift+Tab
  stayed inside; Escape restored the opener. The final search-focused captures
  show no account-menu overlap.
- Native Space and Enter toggle the nested disclosure and closed content
  unmounts. The initial Space check used the wrong automation key name; it was
  repeated with an actual space character, not counted as an implementation bug.
- The account menu opens from the rail; End, Home and ArrowDown focus the
  corresponding items. Enter executes the Preferences action. Action selection
  and Escape restore trigger focus.
- Rail search expands and focuses its input, a `sprint` keyword finds Current
  cycle, and Escape clears the query. Ctrl+B is ignored in editable search.
  Mobile Ctrl+K opens and focuses the input at both widths in both themes;
  subsequent Tab remains trapped and Escape returns focus. Destination selection
  closes the mobile drawer and updates the caller's selected view.
- Batched uncontrolled/controlled boolean requests, readable storage with
  denied writes, focused-peek node identity, nested-provider shortcut isolation,
  disabled real-href navigation, pinning and the visible Move down/Enter reorder
  path were exercised. Loading, error/retry, empty and read-only fixtures render
  their expected states. These setter/storage checks use temporary fixtures;
  they are not a committed integration suite.
- Long multilingual labels and zero counts remain available. A 40-row fixture
  scrolls within the navigation area. CSS-only 200% zoom produced no horizontal
  page overflow; actual browser zoom was not tested. Duplicate element IDs were
  not observed.
- Genuine reduced-motion media emulation was active; drawer-owned running
  animations were zero. This does not certify unrelated animations elsewhere
  on the page.

Evidence is local to
`C:/Users/Lenovo/AppData/Local/Temp/kira-sidebar-continue-135992c238ca404ca32801d0cb0b06b1/`:
`qa-shortcut-final.json`, behavior scripts/results, final gate logs and the
`final-matrix/` screenshots/contact sheets. Earlier partial/stale-popup captures
are retained as diagnostic evidence and superseded by the final captures.

### Remaining gaps

Repository gates must pass before this upgrade is marked complete. Physical
mobile/touch/swipe and drag-reorder checks, screen-reader runs, measured color
contrast, real browser zoom, actual responsive breakpoint transitions and the
global-shortcut opt-in were not verified. No isolated audit test worktree was
created, so no auditor-run candidate test claim is made. Unrelated working-copy
changes are retained; no commit or PR was created.

## Motion continuation and rapid-interruption fix ? November 11, 2026

Sidebar/demo version **3.1.0** adds a thirteenth **Motion** tab. The earlier
48-capture twelve-tab matrix above describes v3.0.0, not final motion
certification. The continuation uses the animate, choreograph,
animation-performance, review-animations, Emil design-engineering and UI/UX
skills; no animation dependency was added.

### Confirmed defect and repair

A reproducible state mismatch caused the wide navigation to remain over the
workspace: collapse ? hover-peek ? expand ? leave while expanded ? collapse
from the toolbar. Before the repair, the frame was **64px**, but navigation
was **256px** with `data-hover-expanded=true` outside hover.

- Clear temporary peek when collapse or peek configuration changes. Cancel
  pending hover exits when peek eligibility changes, and recheck actual hover
  and focus before a delayed close.
- Replace the layout animation's post-event animation-frame gap with a React
  layout-effect commit. Capture the current visual position, pause its tween,
  then restore/measure/invert before paint. Batched requests retain one snapshot;
  the reducer also supplies a commit for child-owned disclosures and reorders.
- Explicit `transition-none` cancels running CSS transitions when motion is
  disabled or keyboard intent takes over. Removing transition classes alone
  did not reliably cancel an in-flight transition. GSAP context cleanup restores
  author transforms on interruption, disable and unmount.
- Pointer displacement uses a 200ms ease-out; no text scaling or width tween.
  Surface clip-path and divider translation share timing. Shared disclosure and
  drawer exits are 150ms. Search results and skeletons remain static.

### Focused verification

Main-session shared-preview checks (not auditor tests):

- Baseline stale-peek sequence reproduced; repaired sequence returns a **64px
  frame and 64px nav**, `data-hover-expanded=false`. Both DOM-event reproduction
  and real browser hover/click actions exercised the repaired path.
- Sixteen frame-separated reversals settled with zero sidebar CSS animations
  and no residual menu/icon transforms. Thirty pairs of same-turn toggles
  preserved the initial final state and left no residual transforms.
- Disabling Motion during a transition changed surface/divider properties to
  `none`, canceled all sidebar CSS animations and removed GSAP transforms.
  Keyboard toggles were immediate.
- Desktop **1440px** light/dark theme values were asserted; no horizontal page
  overflow. Mobile **375px** light/dark layout checks fit the 304px drawer.
  A settled keyboard-search recheck focused `sidebar-search-input`, with popup
  `transitionProperty=none` and zero running animations.
- The earlier unresolved mobile duration probe was misleading: `duration-200`
  can compute to `0.2s` even with `transitionProperty=none`. The actual keyboard
  popup and backdrop had no transition property and no running animations.

Shared-preview snapshots repeatedly returned
`Preview automation snapshot timed out after 15000ms.` DOM evaluation and
browser input worked. The browser-use fallback returned
`permission-blocked: the pending Chrome connection ended before approval`;
no permission bypass was attempted. Preview frame timing was intermittent:
long RAF probes sometimes timed out and same-evaluation elapsed-time samples
could retain frozen transforms until a later call. These are not FPS, full
visual-matrix or every-frame-continuity claims. One rapid mobile reopen sample
ran before dismissal settled; it was superseded by the settled search recheck,
not counted as a pass.

A static-only independent audit found no introduced defect in the reviewed
rapid-interruption diff. Its additional pre-existing configuration-toggle peek
finding was fixed by clearing peek on `hoverExpand`/`collapsible` changes. That
last adjustment was not independently re-audited. Delayed controlled callbacks
may skip displacement continuity; semantic state does not depend on animation
completion. No isolated auditor test worktree was supplied.

### Final gates

`bun run check` then `bun run build` both exit **1** with **129 out-of-scope lint
errors**, zero errors in sidebar source/demo or drawer. Registry generation
succeeds and includes GSAP. TypeScript, repository-wide Prettier and Vite
production build remain blocked by the lint gate. Target source/demo formatting
was applied. Logs: `check-rapid-final.log`, `build-rapid-final.log` in the scratch
evidence directory above. Existing unrelated changes are retained.

Remaining gaps: a fresh full thirteen-tab visual matrix, final-candidate
reduced-motion media recheck, physical rapid cursor/touch/swipe/drag, measured
frame performance, screen-reader/contrast and delayed controlled updates.
The earlier reduced-motion evidence remains historical; no full completion
claim is made.

## Loading motion ? v3.1.1, November 11, 2026

At the user's request, `SidebarSkeleton` now reuses `SkeletonBone` from the
shared skeleton component. Individual bones are static; their rows share one
standard 2-second opacity pulse. No per-row stagger, shimmer gradient, layout
animation, extra dependency or per-frame React rendering was added.

Loading indication is independent of pointer intent, so keyboard-started
loading still has feedback. `SidebarProvider.motion=false` and reduced motion
disable it. An IntersectionObserver and document visibility listener pause the
pulse offscreen or in hidden tabs; listeners and observer are removed on
unmount/disable. Rows start paused before the visibility check. Loading removal
unmounts the skeleton immediately. The root remains a named busy status with
screen-reader text outside the animated, aria-hidden rows.

The States and Parts demos use this shared component; API copy and the v3.1.1
changelog document it. Registry dependencies now include `skeleton`. Historical
v3.0/v3.1 static-skeleton notes above remain descriptions of those revisions.

Verification: focused oxlint exits 0 (warnings remain); source/demo Prettier
checks pass. A Bun server-render harness checks expanded/rail markup, named busy
status, motion-disabled row classes, initial pause and item-count boundaries
(0, NaN, Infinity, 99 and fractions). All pass. An initial broad class assertion
incorrectly counted the shared bones' overridden animation class; the corrected
assertion targets the animated rows. This is not browser animation verification.
No new browser, frame-performance, offscreen/tab-visibility or reduced-motion
media-emulation check was run for this change.

Required gates are rerun in order: `bun run check`, then `bun run build`.
Logs are in `C:/Users/Lenovo/AppData/Local/Temp/kira-sidebar-loading/`.

Both required gates exit **1** on the same **129 unrelated lint errors**, with
zero errors in sidebar source/demo or skeleton. Registry generation succeeds;
its sidebar source matches the current file and declares the skeleton dependency.
TypeScript, repository-wide formatting and production bundling are not reached.
