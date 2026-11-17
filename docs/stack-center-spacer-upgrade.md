# Stack, Center, and Spacer upgrade

Research cutoff: October 31, 2026. Work started November 15, 2026.
The user selected all three targets and deferred every test/check/browser pass
until Pass A and B implementation is complete across the family.

## Research

- The npm lookup `bunx npm view @base-ui/react version` returned **1.9.0**.
  The [Base UI changelog](https://github.com/mui/base-ui/blob/master/CHANGELOG.md)
  dates this release October 9, 2026. There is no dedicated Stack, Center, or
  Spacer primitive in the installed package or release catalog. Use its
  [useRender](https://base-ui.com/react/utils/use-render) and mergeProps utilities.
- The [stock shadcn component catalog](https://ui.shadcn.com/docs/components)
  has no equivalents for these three layout utilities. Its AI Elements Stack
  is a different component, not a replacement for flex layout.
- [Chakra Stack](https://chakra-ui.com/docs/components/stack) documents responsive
  direction and separators. These are established capabilities, not inventions
  introduced in October 2026.
- [Every Layout Switcher](https://every-layout.dev/layouts/switcher/) explains
  container-width-driven flex-basis switching, with equal-priority actions,
  comparison cards and ordered steps as real use cases.
- [MDN justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)
  documents `safe center`: overflow falls back to start alignment.
- [MDN env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env) documents
  safe-area insets for controls near device UI.
- [web.dev CLS guidance](https://web.dev/articles/optimize-cls), updated February
  7, 2025, recommends reserving dimensions for deferred embeds/media.
- Documentation was fetched from the web at task time. Older established
  patterns are proposed for October 2026 use; current catalogs are compatibility
  checks, not proof of historical release dates for individual API additions.
  Search-engine endpoints did not produce useful results; primary documents
  supplied the evidence. No unverified October-only trend is claimed.

## Explore and Pass A

Read-only Sol exploration confirmed Stack dropped numeric zero, keyed divider
fragments by index, and inserted div separators directly in lists. Native
tag-specific props and refs were missing across the three components. Spacer
accepted arbitrary numbers despite its finite class map, lacked explicit zero
dimensions and fixed-size shrink protection, and exported no variants.

Pass A preserves keyed children in one flat sibling array, uses decorative
list-item divider adapters, adopts Base UI render/ref composition, types native
attributes, and makes Spacer's decorative/size contract explicit. Responsive
CSS is literal source in a registry-inlined helper, so consumers do not depend
on the demo application's safelist. Fragments intentionally remain child groups;
use keyed direct children when dividing a collection.

## Pass B design briefs

### Adaptive Stack

Problem: action rows squeezed into side panels need to adapt to their own width,
and deferred records should keep editable rows stable while refreshing.
Behavior: responsive direction/wrap plus KiraStack intrinsic switching, with
caller-owned busy state and retained children.
Scope cut: no visual-order reversal, drag engine, persistence or fake fetches.

### Reachable centered content

Problem: tall forms can lose their first controls when centered in a short
viewport, and mobile browser chrome changes the available height.
Behavior: safe flex/grid centering plus KiraCenter bounded content, dynamic or
small viewport height, chrome offset and optional safe-area gutters.
Scope cut: absolute positioning remains an explicit unsafe overlay technique;
Center does not implement dialogs, authentication or focus management.

### Fluid and reserved space

Problem: fixed gaps do not scale with reading layouts, footer space must include
device insets, and deferred content needs a stable footprint.
Behavior: responsive Spacer sizing/axis plus KiraSpacer bounded fluid lengths,
optional safe-area addition and a reserved-content variant with shared Skeleton.
Scope cut: no new token scale, scroll observers, animations or arbitrary numeric
spacing values.

## Verification

All Pass A/B features and the eight Stack, eight Center and nine Spacer demo
tabs were implemented before verification began. No tests, checks, builds or
dev server were run before implementation completion. Baseline copies of the
six source/demo files, registry script and playbook were saved under the system
temporary directory for exact diff review.

### Source and examples

- Seven source/demo/helper files have zero TypeScript diagnostics. The current
  app also has zero diagnostics. All **28** copied demo/usage snippets compile
  in an in-memory TypeScript host without writing files into the checkout.
- The main session formatted the target files and fixed all confirmed review
  and runtime findings. The required final repository gates are recorded below.
- The Sol auditor inspected the saved baseline and an exact candidate, without
  edits or tests. It confirmed two accessibility defects: custom decorative
  loading content needed `inert`, and Spacer render composition could override
  its decorative contract. Main fixed both and verified element/callback/fluid
  adapters, native refs, merged classes/handlers and inert placeholder buttons.
  These repairs were not independently re-reviewed.
- Runtime checks additionally found and repaired conflicting safe-flex classes,
  a Viewport demo minimum-height override and the intrinsic switcher's missing
  child shrink rule when composed with Button.

### Browser evidence

The existing development server was reused. Final layout traversal selected the
actual tab's `aria-controls` panel rather than an exiting panel that remained
mounted. All **25 tabs × light/dark × 375×900/1440×900 = 100** selected-panel
checks found the expected content/theme and no horizontal page overflow.
Kira/States and Center's Safe overflow captures were inspected as contact
sheets; this is representative visual inspection, not an exhaustive visual or
contrast audit of every state.

- Stack: reviewer order reversed while retaining the same input node and draft;
  numeric zero remained visible and every direct reviewer-list child was `li`.
  Native form-ref submission worked. Retained refresh kept the same editable
  input and draft while `aria-busy` changed. The switcher fits four actions in
  one desktop row, puts them in one constrained narrow column, and forces a
  column with five actions. Its final light/dark recheck measured 269px at
  mobile width and 320px in the desktop narrow fixture, with no local overflow.
- Center: safe flex, automatic grid and constrained grid tracks keep the first
  oversized item 17px inside the panel; unsafe flex/constrained grid put it 80px
  above the panel. Small and dynamic viewport modes measured 772px at a 900px
  viewport with an 8rem offset; panel mode measured 192px. The bounded form
  saved through native form submission, and the section ref resolved correctly.
  Loading/error/ready/empty fixtures rendered their expected messages, read-only
  state and disabled reason. A Center-only CSS `zoom: 2` smoke check had no page
  overflow; this does not substitute for real browser zoom.
- Spacer: the reserved draft stays mounted, hidden and inert during reload,
  then returns with its value. The fixture retained its exact 194px height
  before/during/after reload. Fluid spacing changed from 48px to 28.59375px in
  the narrower query container. The native span ref and decorative attributes
  passed. Responsive sizes measured 16px vertically on mobile and 32px
  horizontally on desktop. All three States tabs also passed a 320px page
  overflow smoke check.

These interactions used programmatic browser controls. Native keyboard commands
reported success but delivered no `keydown` event to an installed page listener;
keyboard traversal is **unverified**. Animation-frame waits and two Absolute
snapshot attempts timed out in preview. Reduced-motion emulation and real 200%
browser zoom were unavailable. A browser-use fallback connection failed, and
automatic approval review rejected launching a temporary Edge browser with
`blocked by policy`. No separate browser was launched. Physical safe-area/browser
chrome behavior, touch, screen-reader output, exhaustive contrast, every tall
panel's full visual inspection and a consumer install/build remain unverified.

Temporary evidence is in
`C:/Users/Lenovo/AppData/Local/Temp/kira-stack-center-spacer-final-qa.json`, with
the candidate compiler harness and contact sheets beside it. Early captures
included unsettled/exiting panels; they are not used as final visual proof.
The post-repair switcher recheck supersedes its earlier overflowing capture.

### Breaking changes

- Stack retains numeric zero and keyed row identity. Decorative rules inside
  native lists now use `li` adapters, so direct-child selector assumptions may
  need adjustment. Props follow the selected native tag; HStack/VStack directions
  cannot be overridden. Default rules expose `stack-divider` slots. Fragments
  remain groups rather than flattened records.
- Center defaults to safe alignment, so oversized flex/grid content can align
  to the start instead of becoming unreachable. Absolute centering remains
  explicitly unsafe for oversized content.
- Spacer accepts only the documented spacing union, enforces decorative
  hidden/inert semantics after render composition, rejects children/tab stops,
  and prevents fixed sizes from shrinking. Use KiraSpacer's reserve mode for
  supplied content.

### Repository gates

Final `bun run check`, then `bun run build`: **both passed (exit 0)**.
The production build completed, including registry generation/checks. Existing
lint and bundle-size/directive warnings remain warnings. The three generated
registry entries include current component source and the shared responsive
helper where needed; UTF-8 source comparisons passed. No dependency package
change was needed. Early unrelated Code Block failures were superseded by these
successful final gates; other concurrent workspace changes were preserved.

Gate logs:
`C:/Users/Lenovo/AppData/Local/Temp/kira-stack-center-spacer-final-check.log` and
`C:/Users/Lenovo/AppData/Local/Temp/kira-stack-center-spacer-final-build.log`.
