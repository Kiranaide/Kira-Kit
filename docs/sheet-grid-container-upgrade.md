# Sheet, Grid, and Container upgrade

Research cutoff: **October 31, 2026**. Sources checked November 13, 2026.
Compatibility target: installed and latest published `@base-ui/react` **1.9.0**.
The package registry was checked with `bunx npm view @base-ui/react version`.
These notes distinguish useful existing techniques from features released in October.

## Research and selected use cases

- Base UI 1.9.0 was released October 9, 2026. Its Drawer updates concern focus
  management, swiping, and keeping CSS-derived behavior consistent. Sheet already
  reuses the upgraded Kira Drawer; retain that primitive and its native lifecycle.
  Sources: <https://base-ui.com/react/overview/releases/v1-9-0>,
  <https://base-ui.com/react/components/drawer>.
- Stock shadcn's Base UI Sheet offers the four edges, close control, composed
  header/footer, and accessible dialog behavior. Its stock basics are the floor,
  not a reason to duplicate the implementation. Source:
  <https://ui.shadcn.com/docs/components/base/sheet>.
- PatternFly uses drawers for details associated with a primary list and for
  access to secondary content while maintaining context. Apply this to record
  inspection and editing; show modal editing separately from a non-modal details
  panel. Source: <https://www.patternfly.org/components/drawer/design-guidelines/>.
- Native Drawer snap points provide mobile bottom-sheet detents. Kira's useful
  layer is a responsive desktop-side/mobile-bottom composition, visible loading
  and recovery, and a caller-owned dismissal guard for unsaved or pending work.
  Swiping and focus trapping remain native. Source:
  <https://base-ui.com/react/components/drawer>.
- CSS Grid `repeat(auto-fit, minmax(...))` can fit cards to the available panel
  width without a resize observer or viewport breakpoint. Clamp the minimum to
  `100%` so a card still fits a narrow inspector. This is an established CSS
  technique, not an October 2026 invention. Source:
  <https://tailwindcss.com/docs/grid-template-columns>.
- Subgrid shares tracks across nested grids. Its practical use here is aligning
  plan titles, descriptions, prices, and actions despite unequal copy lengths.
  Keep DOM reading and focus order; dense packing is opt-in and does not provide
  masonry or interactive ARIA-grid behavior. Source:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid>.
- Size container queries let a component respond to its containing panel rather
  than the entire viewport. Use a named inline-size container for embedded record
  summaries and query its descendants. The query container cannot query itself.
  Size containment has intrinsic-size consequences, so make it opt-in. Sources:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries>,
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type>.
- Tailwind v4 exposes theme-variable maximum widths. Verify all Container size
  presets using computed styles and use the existing breakpoint values instead
  of introducing a new scale. Source: <https://tailwindcss.com/docs/max-width>.

## Explore reports (before this upgrade)

### Sheet

1. Exports: twelve aliases, including `sheetVariants`, at
   `src/components/ui/sheet.tsx:1`; no Sheet-named public prop types or mega-component.
   `side` belongs to the root; `size` and close/portal/overlay options belong to
   Content. Native root/part callbacks and function-form props are inherited.
2. Primitive: `@base-ui/react/drawer` through `drawer.tsx:2`; stock-shaped
   composed parts already exist. No replacement focus or gesture implementation
   is needed.
3. Motion: Drawer has state-driven transforms and `motion-reduce:transition-none`
   (`drawer.tsx:20`). Sheet owns no additional animation or completion state.
4. Slots: aliases retain the `drawer-*` slot contract documented in the existing
   Sheet 2.0.0 changelog. The popup receives Content's class/ref; its inner content
   wrapper is a different element.
5. Bugs: the form demo has unassociated labels, raw controls, and an inert Save
   action (`src/pages/components/sheet.tsx:345`); snippets reference unimported
   Input/Textarea/Button names. Cosmetic gradients obscure the real workflows.
6. States: native disabled trigger and modal behavior exist, but the page has no
   meaningful loading, error/retry, read-only, draft guard, or saved-result flow.
7. Demo contract: seven old tabs, no Kira/States tab, and incomplete API coverage
   for Portal/Overlay. Existing November 4 migration changelog must be retained.
8. Registry: the alias imports Drawer; the explicit dependency map has no Sheet
   entry. Add the direct dependencies introduced by the selected composition.

### Grid

1. Exports: Grid, GridItem, gridVariants and eleven types
   (`src/components/ui/grid.tsx:367`). Props include columns/rows, responsive gaps
   and spans; placement/self-alignment are single values. No typed native ref or
   polymorphic form/list contract is exposed.
2. Primitive: no Base UI Grid layout primitive exists in the installed package.
   CSS Grid is appropriate; this component is not an interactive ARIA data grid.
3. Motion: none; retain immediate layout and keyboard behavior.
4. Slots: `grid` and `grid-item` exist (`grid.tsx:200`, `grid.tsx:364`).
5. Bugs: seventeen open dictionary annotations discard map key evidence. Baseline
   lint reports all seventeen as errors. Responsive class prefixes assembled by
   `resolveResponsive` lack Grid-specific safelists in `src/index.css:7`.
   GridItem cannot render a list item, and shrinkable child sizing is absent.
6. States: layouts need empty, long-content, narrow-container and focus-order
   demonstrations; deferred collections also need busy/empty/recovery states.
7. Demo contract: eleven old tabs start at `column-count`, with no Basic,
   KeyboardShortcuts, Changelog, Kira or States sections. Several snippets drift
   from their fixtures; "masonry-style" is an inaccurate feature claim.
8. Registry: Grid imports Flex's responsive resolver; the explicit map omits
   Grid. Its CSS requirements must also ship to registry consumers.

### Container

1. Exports: Container, containerVariants and ContainerProps
   (`src/components/ui/container.tsx:68`). Seven widths, four gutter presets and
   horizontal content centering; `as` is a tag union with weak native props.
2. Primitive: no Base UI Container layout primitive exists. Use native layout
   and Base UI useRender/mergeProps for composition.
3. Motion: none; size changes require no animation.
4. Slots: root `container` exists (`container.tsx:60`).
5. Bugs: breakpoint max-width utilities require verification against Tailwind v4
   (`container.tsx:8`). The Centered demo promises vertical centering, although
   the variant only sets `items-center`. The Prose demo uses absent typography
   plugin classes and unsupported reading-research claims.
6. States: long words, nested widths, native semantics and deferred-document
   content need demonstrations. Disabled/pressed states do not apply to a wrapper.
7. Demo contract: eight old tabs begin with Sizes, with no KeyboardShortcuts,
   Changelog, Kira or States. Usage references undefined application components.
8. Registry: no cross-component dependency yet; add only what the composition
   actually imports. Query CSS must be optional and must not alter global tokens.

## Design briefs (before feature implementation)

### Responsive contextual Sheet

Problem: editing a record must fit a phone while retaining the user's list context.
Behavior: KiraSheet composes the shared Drawer at the chosen desktop/mobile edge,
keeps caller controls and draft mounting explicit, and shows busy/recovery reasons.
Cut: automatic saving, global shortcuts, a second gesture engine, and fake success.

### Intrinsic Grid and deferred collection

Problem: a card collection inside a narrow panel cannot use page-width columns.
Behavior: auto-fit/auto-fill columns clamp to the available width; KiraGrid renders
caller-owned items, reserved skeleton cells, empty feedback and retry actions.
Cut: speculative masonry, implicit ARIA-grid navigation, sorting and drag behavior.

### Queryable Container and deferred document

Problem: an embedded record needs local reflow and a stable place for deferred text.
Behavior: Container can establish an opt-in named inline-size query context;
KiraContainer composes header/body/footer with caller-controlled busy and recovery.
Cut: new token scales, automatic data fetching, decorative entrances and typography
plugin dependencies.

## Baseline and verification

Before changes, `bun run check` exits 1 with **92 lint errors**, including the
**17 Grid errors**. The working tree already contains extensive unrelated edits.
Target files and their baseline contents were saved outside the checkout for
comparison. There is no `.codex/knowledge/` directory in this repository.

Implementation, exact gate results, browser evidence and remaining gaps will be
recorded below as each phase finishes.

### Pass A — November 13, 2026

- All seventeen Grid dictionary lint errors were repaired. Grid and GridItem now
  compose native tags through Base UI useRender/mergeProps and preserve typed refs.
  GridItem supports `as="li"`; its placement/self-alignment props are responsive.
  Grid-specific responsive classes were initially added to the stylesheet sources;
  Pass B moved them into portable literals in the component source.
- Container uses the same native composition and existing breakpoint variables
  for maximum widths. Its content can shrink and wrap. No token value changed.
- Sheet retains the native Drawer aliases and adds SheetHandle plus Sheet-named
  root/content/handle/side types. Existing Drawer slots remain compatible.
- Explicit registry entries now cover Sheet → Drawer and Grid → Flex.
- Verification used a separate checkout at parent commit
  `d10168441fab2755be0cb08d9c83591063d41f72`, patched with the working candidate.
  The first attempt lacked ignored vendored lint tooling and is not counted as a
  valid gate run; the tooling was copied before rerunning.
- `bun run check` then `bun run build` both exit 1 on **75 lint errors outside
  these targets**, down from 92. Registry generation succeeds inside the build.
  TypeScript, formatting and production compilation are not reached by these
  required gates. Overall release completion is blocked; the feature pass stays
  within the selected component scope.

### Pass B — November 13, 2026

- Sheet v2.1.0 adds KiraSheet: desktop/right and mobile/bottom composition at
  the existing 640px breakpoint, a native close-request guard with a visible
  reason, loading masks that retain children, and caller-owned recovery actions.
  Its nine demos cover edges, widths, retained drafts, detents, non-modal record
  inspection, scrolling history, contextual editing and explicit states.
- Grid v2.0.0 adds auto-fit/auto-fill columns with a minimum clamped to the
  containing panel, responsive placements and self-alignment, and KiraGrid's
  stable keyed collection, retained refresh, skeleton, empty and retry states.
  Its 745 literal prefixed class candidates ship with the component source, so
  consuming Tailwind apps can discover the supported responsive classes.
  Eight demos include intrinsic layouts, subgrid track alignment and native form
  and list semantics.
- Container v2.0.0 adds opt-in named inline-size queries and KiraContainer's
  header/body/footer composition, retained loading content and error recovery.
  Its nine demos cover all width presets, gutters, nested widths, a 65ch reading
  cap, native semantics, panel queries and document states.
- All 26 demos have co-located snippets derived from their live functions and
  helpers. Fixtures expose local/manual state changes and make no service claims.
  ComponentPage, PageHeader, FeatureGrid, DemoTabs, KeyboardShortcuts, UsageBlock,
  APIReference and Changelog follow the playbook contract. Sheet's existing
  November 4 v2.0.0 migration entry is retained.
- Feature implementation is complete. Final compiler, snippet, browser and
  required gate verification are recorded separately below; core-pass results
  above do not verify the feature candidate.
- Final verification removed Grid's dependency on Flex for a type. Grid now
  owns the finite responsive value shape used by its local resolver. The public
  prop shape is unchanged, and standalone Grid snippets no longer pull in Flex's
  unrelated compiler error.

### Verification handoff ? November 14, 2026

The continuation thread finished most verification but was interrupted before
closing QA. Implementation of both passes is complete for all three components;
this is **partial verification, not a release pass**.

On resumption, SHA-256 comparisons confirmed that all six current component and
demo files match the isolated candidate used by the continuation. Results below
are recovered from that session's logs and thread history, not new test runs.

- All 29 copied snippets compiled and matched the 26 live demos. All six target
  files passed formatting. Supplemental app typing reported only the existing
  Flex and textarea diagnostics.
- Grid v2.0.1 corrects native list render adapters: an explicit native ul/ol
  render element receives li wrappers in ready, loading, empty and error states.
  Render callbacks and custom components returning lists require matching as.
  Thirty list/render-state cases passed. A separate Tailwind consumer compilation
  generated all 745 supported responsive class candidates, with none missing.
- Grid's four viewport/theme combinations were checked. Native form submission,
  typed ref access and Enter activation passed. The last browser assertion,
  grid-stable-keyed-filter, observed same=false with one remaining item and
  failed. Its cause was not established before interruption. Do not infer that
  stable keys or retained refresh were verified from the static render cases.
  The subsequent retained-refresh, empty/retry and initial-loading assertions in
  that runner were not reached.
- Sheet was checked in both themes at 375px and desktop without horizontal
  overflow. Four edges and desktop widths 320/384/512/576/full were checked;
  KiraSheet used bottom on phone and right on desktop. Tab/Shift+Tab containment,
  Escape focus return, dirty-draft dismissal guards, save/discard, retained input
  identity/value while loading, inert hidden controls, cancellation and retry
  passed. The scrolling footer remained reachable at both widths. The non-modal
  inspector allowed background pointer and keyboard interaction.
- Container was checked in both themes at 375px and desktop without horizontal
  overflow. Width presets, named-query local reflow, retained input identity/value
  and layout height during loading, retry/empty recovery, native article ref and
  keyboard reading action passed. An initial recovery probe selected an inactive
  mounted demo; the corrected active-tab-scoped checks passed.
- Required check and build commands still exited 1 on 75 unrelated lint errors.
  Registry generation succeeded inside build; production Vite compilation was
  not reached. These are historical candidate gate results, not a fresh count for
  all unrelated working-tree edits.

Remaining verification: resolve the failed Grid keyed-filter identity assertion
and run the subsequent collection lifecycle checks; finish visible-page reduced
motion and real 200% browser zoom. Physical touch devices, live screen readers,
exhaustive contrast, natural interruption/visibility behavior and full registry
consumer installation/build are not established by this evidence. The Tailwind
CSS compilation alone does not establish a consumer application build.
