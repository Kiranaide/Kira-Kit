# Spotlight and Empty upgrade

Research cutoff: October 31, 2026. Implementation date: November 13, 2026.
Base UI installed and latest published version checked: 1.9.0.

## Research

- [Base UI releases](https://base-ui.com/react/overview/releases): 1.9.0 was released October 9, 2026. Its Combobox changes repair asynchronous highlighting, external item registration and browser autofill; Dialog changes improve initial focus and nested-dialog restoration.
- [shadcn Base UI Command](https://ui.shadcn.com/docs/components/base/command): stock Command wraps cmdk. Reuse Kira's existing Command and Base UI CommandDialog rather than maintaining another keyboard/ARIA implementation.
- [shadcn Base UI Empty](https://ui.shadcn.com/docs/components/base/empty): stock presentation exposes EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription and EmptyContent. Extend that composition while retaining Kira's shorthand presets.
- [Carbon empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/), updated August 11, 2026: distinguish first use, successful completion and errors; offer contextual next actions. Loading is not absence of data.
- [Carbon search](https://carbondesignsystem.com/patterns/search-pattern/), updated August 11, 2026: scope searches, report complete result counts, show progress and provide recovery when there are no results.
- [Raycast Quicklinks](https://www.raycast.com/core-features/quicklinks): search can lead to project resources and quick actions; descriptions and previews help identify the correct destination.

Dated Base UI and Carbon evidence falls within the cutoff. shadcn and Raycast are living references accessed November 13; they are not represented as releases introduced in October. No dependency upgrade is needed.

## Pre-upgrade Explore findings

Spotlight has an async callback-identity render loop, invisible selectable flat items beside groups, fixed duplicate IDs, disabled-item/empty/IME keyboard defects, dead trigger/hint props, missing visible dismissal, a private motion hook and overlapping GSAP effects. Its shortcut demo does nothing and its snippets/API are inaccurate.

Empty has no standalone Base UI primitive. It lacks stock composable parts, refs and subpart slots, renders a blank media gap for null icons, and demonstrates actions that do nothing. Both pages lack a changelog and meaningful stress/recovery examples. Existing target source and demos were clean against HEAD d10168441fab2755be0cb08d9c83591063d41f72; unrelated workspace edits are preserved.

## Feature design briefs

### Scoped search and previews

Problem: global workspace results mix projects, documents and people, making the right destination hard to identify.
Behavior: KiraSpotlight exposes caller-defined scope buttons and a noninteractive preview of the highlighted result; selection remains keyboard driven by shared Command.
Cut: nested command pages, arbitrary AI execution and a second command-action state machine.

### Remote search with recovery

Problem: delayed responses can overwrite newer queries, while loading and failures look like empty results.
Behavior: debounce caller-owned search, pass an AbortSignal, ignore stale responses, prevent stale selection and expose retry plus a contextual no-results state.
Cut: built-in network clients, persistent caches and automatic retries.

### Relevant recent results

Problem: repeated tasks require searching for the same resource again.
Behavior: show deduplicated caller-controlled recents above the full catalog on an empty query; optional managed recents remain in memory and can be cleared.
Cut: localStorage tracking and hidden collection of search text.

### Composable empty presentation

Problem: dense panels, first-use pages and custom media need different layouts and heading levels.
Behavior: provide stock-shaped parts, center/inline layouts, native props/refs and a render adapter for heading semantics; shorthand presets share the same parts.
Cut: illustrations, decorative motion and another upload/search implementation.

### Contextual recovery

Problem: no matches, offline data, missing access and an empty project require different next actions.
Behavior: KiraEmpty selects contextual copy and icons, composes shared Buttons, and reports pending/error/success for caller actions with cancellation and duplicate/stale-result guards.
Cut: implicit fetches, simulated permissions and automatic success replacement of the caller's data.

## Implementation: v2.0.0

[Spotlight](../src/components/ui/spotlight.tsx) reuses the shared Command/cmdk and Base UI CommandDialog for result navigation, IDs, focus, dismissal and modal behavior. Flat and grouped items render together. Loading, no matches, disabled reasons and visible dismissal have explicit presentation.

`KiraSpotlight` adds caller-defined scopes, debounced remote search with an AbortSignal, stale-response and stale-selection guards, retry, deduplicated recents, descriptive previews and an opt-in Ctrl/⌘K shortcut. Recents precede the full catalog. Shortcut hints alone do not register listeners; editable fields retain shortcut ownership. Search and recent data remain caller owned, with optional in-memory recents.

[Empty](../src/components/ui/empty.tsx) exposes `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription` and `EmptyContent`, native refs/props, Base UI render adapters, variants and centered/inline layouts. Null media leaves no blank wrapper. Presets and shorthand presentation share these parts.

`KiraEmpty` provides first-use, no-results, error, offline, forbidden, complete and loading states. Caller actions receive an AbortSignal and expose pending, cancellation, error and success feedback. Duplicate actions and stale completions are guarded. Callers still own data changes and cooperative cancellation of their work.

Both [Spotlight](../src/pages/components/spotlight.tsx) and [Empty](../src/pages/components/empty.tsx) pages contain ten focused demo tabs, working local actions, copyable examples, keyboard guidance, API documentation and November 13, 2026 changelogs.

## Migration

- Pass a React element through the Spotlight root: `trigger={<SpotlightTrigger />}`.
- `SpotlightTrigger.asChild` was removed. Use the shared Button `render` contract.
- `spotlightOverlayVariants` was removed; the shared dialog owns the overlay.
- Spotlight root `onSearch` receives query events. Move asynchronous result providers to `KiraSpotlight.search`.
- Supplying `Empty.children` now replaces the shorthand icon/title/description/action layout. Compose parts and put custom actions in `EmptyContent`.
- `Empty.title` accepts a ReactNode. Put native HTML title attributes on the render element.

## Review repairs

Independent static review identified five defects in the first candidate. The main session fixed them before final verification:

- Changing an Empty context A→B→A could restore cancelled pending state. Context changes now reset the stored operation.
- Revisiting query A→B→A could expose old selectable remote results. Request version participates in snapshot identity.
- Preview selection was not controlled. Command now receives the selected result value.
- cmdk overrides supplied input IDs. The visible search label now links to the actual input ID.
- Five snippets declared unused scopes. Those declarations were removed.

Browser/compiler checks verified the repairs. The corrected candidate did not receive a second independent review. Composed Spotlight children also now show “Search results” rather than an inaccurate zero count.

## Verification: November 13, 2026

Verification began after both components, all feature demos, API docs, changelogs and registry maps were implemented, per user instruction. No tests or builds ran during research or Explore.

Checks ran in the isolated checkout at `C:\Users\Lenovo\AppData\Local\Temp\kira-spotlight-empty-c1424b4def1d4ce09ace0c17e352de8f`, based on commit `d10168441fab2755be0cb08d9c83591063d41f72`. The candidate included the existing workspace changes and deletions. The four target files, registry script and embedded reduced-motion hook were compared to the primary checkout; final source hashes are in the evidence directory. Audit checks did not generate artifacts in the primary checkout.

Bun dependencies and the ignored `tools/oxlint` configuration were installed/copied into isolation. The installed `eslint-plugin-sonarjs` was linked from the primary checkout because the lint configuration uses it without declaring it as a package dependency. Package configuration was not changed by this upgrade.

| Check                                | Result                                                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Target lint and four-file formatting | Passed; zero target lint errors                                                                                                                                                                                  |
| App compiler diagnostics             | Zero target diagnostics; two unrelated diagnostics in `src/components/ui/flex.tsx` and `src/pages/components/textarea.tsx`                                                                                       |
| Copied examples                      | 22 snippets compiled with zero snippet diagnostics                                                                                                                                                               |
| Demo matrix                          | 80 checks: 20 tabs × light/dark × 375×900/1440×900; no page overflow, duplicate IDs, Vite error overlay or out-of-bounds Spotlight popup                                                                         |
| Lifecycle and recovery               | 21 checks passed: cancellation, returning contexts/queries, stale selection, controlled state, disabled recents, duplicate actions, error/retry/success, clear search, composition, heading level and null media |
| Features, keyboard and motion        | 20 checks passed: scopes, recents/clear, previews, visible label association, Tab/Shift+Tab modal containment, shortcut ownership/unmount cleanup, remote retry and reduced motion                               |
| Initial keyboard walk                | Native Arrow/Home/End/Enter selection and focus return passed                                                                                                                                                    |
| `bun run check`                      | Exit 1: 95 lint errors, zero in the four target files                                                                                                                                                            |
| `bun run build`                      | Exit 1: registry generation/checks passed, then the same 95 unrelated lint errors stopped the build; Vite production compilation was not reached                                                                 |

The lint baseline was measured by temporarily restoring only the four target files to the baseline commit in the isolated candidate, while retaining the same unrelated workspace changes and configuration. It reported 100 lint errors. The final candidate reported 95; this is a scoped comparison, not a claim that clean HEAD has 100 errors.

Reduced-motion emulation produced a popup animation duration of `1e-05s`, matching the global 0.01ms override, static loading indicators and no active document animations. This verifies the observed reduced-motion behavior; it does not establish natural full-motion playback across devices.

Representative light/dark and mobile/desktop captures were inspected. Some offscreen full-card captures were clipped or blank; dedicated Empty Kira/States element captures were subsequently taken and inspected. The 80 DOM checks passed, but every saved screenshot was not individually reviewed.

## Registry synchronization

[Registry maps](../scripts/build-registry.ts) now declare `spotlight: ["command", "button", "empty", "kbd"]` and `empty: ["button", "spinner"]`. Successful generation in isolation produced:

| Entry     | Registry dependencies       | Embedded files                                    |
| --------- | --------------------------- | ------------------------------------------------- |
| Spotlight | button, command, empty, kbd | `ui/spotlight.tsx`, `hooks/use-reduced-motion.ts` |
| Empty     | button, spinner             | `ui/empty.tsx`                                    |

The generated standalone entries and only their records in `public/r/registry.json` and `public/r/index.json` were synchronized to the primary checkout. Embedded source and dependencies match the candidate. All unrelated registry bytes and metadata were preserved. Generated registry files are ignored by Git.

## Remaining limitations

The required repository gates remain blocked by unrelated lint failures spanning files outside this component family. The separate compiler check also retains the two unrelated diagnostics above. Overall repository completion is not claimed.

Real browser zoom, physical devices, live screen-reader output and consumer registry installation/build remain unverified. Follow-up measured contrast found shared Button failures in Empty (details below); contrast is not signed off. Shared Monaco worker warnings and unhandled worker events occurred; zero console errors are not claimed. Static review repairs were verified by the main session but not independently re-reviewed.

The shared T3 preview was closed after repeated snapshot timeouts. The fallback headless Edge instance on CDP port 9391 was closed after verifying its process ID and dedicated profile; the isolated Vite server on port 5188 was stopped. The isolated checkout and evidence remain available. No commit or PR was created.

## Follow-up accessibility and reflow QA

- Ran axe-core 4.10.3 against all ten tabs per component in light/dark at 375×900 (40 scoped scans). Empty panels were scrolled into view before scanning; earlier offscreen scans were not accepted as contrast evidence.
- Fixed Spotlight recovery/empty content appearing inside the results listbox, which produced `aria-required-children`. Empty content now sits alongside the listbox, preserving interactive recovery actions.
- Fixed selected scope contrast (3.93:1 in dark mode) by reusing the outline Button variant. All 20 Spotlight follow-up scans reported zero axe violations; incomplete/manual checks remain, so this is not full WCAG certification.
- Empty scans found primary action Button contrast failures in Basic, Parts, Recovery and Kira: 4.25:1 light / 3.16:1 dark against 4.5:1 required. These are shared Button/token issues; no exemplar or token scale was changed without approval. Empty remains blocked on contrast.
- Added 32 focused CSS reflow assertions at 720×450 and 320×450, light/dark. The first run exposed desktop popup clipping; Spotlight now reserves the Command viewport's desktop top/bottom spacing. All 32 assertions passed after the fix. This approximates reflow at 200% but is **not real browser zoom**.
- Reran all 20 feature/keyboard/reduced-motion checks successfully. The separate 21-check lifecycle rerun could not start because its temporary `qa-fixture.html` is no longer present; its earlier result was not replaced with a new pass.
- Target lint: zero errors (warnings remain). `bun run typecheck`: exit 0 (`tsc --noEmit`; not proof of project-reference compilation). Required `bun run check` then `bun run build`: both exit 1 on the same 95 unrelated lint errors, zero target errors. Registry generation passed; production Vite build remains unreached. Refreshed standalone registry entries match source.
- Follow-up evidence: `followup-accessibility.json`, `followup-*.png`, `reflow-followup.json`, `reflow-followup.py`, `check-followup.log`, `build-followup.log`, `typecheck-followup.log`, `lint-followup.log`. Captures were saved but not all visually reviewed.

## Evidence

Evidence directory: `C:\Users\Lenovo\AppData\Local\Temp\kira-spotlight-empty-c1424b4def1d4ce09ace0c17e352de8f-reports`.

- `check-final.log`, `build-final.log`, `baseline-check.log`: gate output and scoped baseline.
- `matrix.json`, `interactions.json`, `features-keyboard-motion.json`: browser assertion results.
- `snippets/result.json`: copied-snippet compilation result.
- `registry-sync.json`: source and generated-file hashes plus unchanged-registry-content hashes.
- `gates.mjs`, `baseline.mjs`, `check-snippets.mjs`, browser scripts and PNG captures: retained verification inputs and artifacts.
