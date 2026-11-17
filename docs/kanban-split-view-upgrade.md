# Kanban and Split View upgrade

Research cutoff: October 31, 2026. Implementation: November 15, 2026.

## Evidence and decisions

- Base UI 1.9.0 was published October 9 and is installed. Neither target has a dedicated primitive. Shared Dialog, Select, Button, Avatar and Collapsible own their native interactions. Source: https://base-ui.com/react/overview/releases/v1-9-0 and https://registry.npmjs.org/@base-ui%2freact.
- shadcn Base UI Resizable uses react-resizable-panels. Retain installed 4.16.0, the latest stable release within the cutoff; 4.23.0 is a November release. Sources: https://ui.shadcn.com/docs/components/base/resizable and https://registry.npmjs.org/react-resizable-panels.
- GitHub board limits are soft capacity warnings. Offer warning by default and opt-in enforcement, always using full column counts under filtering. Source dated March 18: https://github.com/github/docs/blob/2a0fd5d3ea1301bd6b3eca87c960856c08387bb9/content/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout.md.
- Blocked dependencies are a real release-review use case. Source dated June 17: https://github.com/github/docs/blob/7a720df4719737202e73f39b1df41c6bb85688b6/content/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies.md.
- WCAG requires a click/tap alternative independently of keyboard dragging: https://www.w3.org/TR/2023/REC-WCAG22-20231005/#dragging-movements.
- Inbox reading panes provide right/below layouts. Apple describes compact list/detail navigation. These pages are undated and establish use cases, not an October release claim: https://support.google.com/mail/answer/9499937 and https://developer.apple.com/design/human-interface-guidelines/split-views.md.
- Preserve same-record content during refresh and viewport changes; keep per-record drafts in caller state when switching records. React source dated April 9: https://github.com/reactjs/react.dev/blob/abe931a8cb3aee3e8b15ef7e187214789164162a/src/content/learn/preserving-and-resetting-state.md.

## Pass B design briefs

### Kanban policy-aware movement

Problem: review queues overload and blocked work moves forward without context.
Behavior: all drag/dialog moves share capacity and caller-policy checks; show blocked reasons and actual capacity alongside cards.
Scope cut: no embedded workflow engine, dependency editor, automatic scheduling or remote persistence.

### Kanban focused work and recovery

Problem: a busy release board hides work that needs attention, and refreshes should retain context.
Behavior: KiraKanban supplies search and blocked filtering, actual counts, retained loading content and caller-owned retry; filtered moves use the full board.
Scope cut: no swimlane renderer, bulk editing or virtualization without demonstrated need.

### Split View compact review

Problem: an inbox detail editor is unreadable beside a queue on a narrow screen.
Behavior: keep both panes mounted and offer list/detail navigation within a narrow container; desktop retains the shared resize engine.
Scope cut: no routing, record-fetching or automatic ownership of per-record drafts.

### Split View resize alternatives and retained refresh

Problem: users cannot always drag a separator, and refreshes can discard an in-progress review.
Behavior: expose named width presets, focus/detail controls, busy/error/empty states and caller retry without replacing the editor tree.
Scope cut: no layout designer, global shortcuts or new animation layer.

## Migration notes

- Kanban `columns` is fully controlled. Use `defaultColumns` for local edits. IDs must be non-empty; column IDs and card IDs must be unique within their respective board scopes.
- The whole card surface starts a drag; the icon handle was removed. Native controls, links and editable content are excluded. Custom interactive content can opt out with `data-kanban-no-drag`. Focus the card for keyboard dragging. Title callbacks use native buttons. `KanbanAddColumn` accepts shared Button props. The context's drag/focus/dialog setter fields were removed; use `openMove` and guarded mutation methods.
- Kanban adds `kanban-card-labels`, `kanban-card-footer`, `kanban-card-elevation` and `kanban-column-content` slots. Pointer column disclosure transitions measured height and opacity over 200ms; reduced motion and keyboard disclosure are immediate. Pointer hover lift uses independent CSS translate so it preserves dnd-kit transforms. Drop previews retain built-in card content; custom card children remain caller-owned.
- Split View removes the inherited `children` prop, which was never rendered. Default sidebar width is 25%; maximum is 75% and main minimum is 10%. Sizes are bounded percentages.
- Split View's toolbar remains outside pane content. Generated panel IDs and named slots replace fixed IDs. `autoSaveId` uses a validated, separate storage namespace; previous saved widths are not migrated.
- Removed the standalone icon-button page and its navigation route. Icon-button examples remain on the Button page.

## Verification

Pass A/B source and all feature demos were implemented before verification, as requested. Subsequent UI polish and review repairs were checked after implementation.

- `bun run check`: passed (Oxlint, TypeScript and Prettier); warning-level repository diagnostics remain.
- `bun run build`: passed, including registry validation and source generation. Passed again after the final column viewport adjustment.
- Browser: all nine Kanban and ten Split View tabs walked at 375?800 and 1280?800 in light and dark. No page horizontal overflow, target content overflow or Vite error overlay. Representative Basic screenshots captured at all four settings; compact detail captured at 375px dark.
- Kanban: batched add/add/move retained both cards with exactly three change callbacks. Fine-pointer hover reaches a 2px lift and fades the elevation layer; shared Button supplies press feedback. Native stepped pointer dragging and keyboard dragging moved cards. Full-card pointer drop runs for 200ms; keyboard dragging remains immediate. Dialog movement restores focus to the moved card's action. Capacity enforcement and caller dependency policies rejected moves with visible reasons. Filtering retained full capacity counts and disabled card dragging. Read-only disclosure remained usable.
- Split View: compact record selection transferred focus to the detail region; drafts survived queue/detail navigation and caller-owned per-record notes were restored after switching records. First expansion restored the configured 35%, later expansion retained 40%; a saved 30% layout survived remount. Separator ArrowRight, Home, End and Enter resized/collapsed via the shared engine. Refresh, error and retry retained the same editor node and its draft. Compact presentation kept both trees mounted while hiding/inerting the inactive pane.
- Reduced motion was emulated through CDP. Settled pages had `document.getAnimations().length === 0` for both targets. Kanban hover translation was absent, and a pointer move completed with no overlay drop animation.
- Local artifacts: `C:/Users/Lenovo/AppData/Local/Temp/kira-kanban-split-qa-final/matrix.json`, screenshots in that directory; final check/build logs are adjacent `kira-kanban-split-*-final.log` files.
- Verification limits: no screenshot of every individual tab/state, no screen-reader session, no touch-device session, and no measured theme-wide contrast audit or browser 200% zoom check. Core horizontal Split View permits independent pane scrolling at phone widths; use KiraSplitView's compact presentation for list/detail workflows. The shared preview's direct drag attempts did not move cards and snapshots timed out; native CDP stepped input and screenshots supplied the missing evidence.

## Whole-card drag and column disclosure follow-up

Implemented whole-card mouse/touch activation with native-control exclusions, card keyboard focus, removal of the icon handle, and measured-height disclosure transitions. Follow-up verification: `bun run check` and `bun run build` passed. Native mouse input starting on description text and emulated long-press touch input moved cards; keyboard Space/arrows/Space moved a focused card. Starting a drag on Move did not activate the card sensor, and Space on Move opened its dialog independently. Base UI emitted 200ms height/opacity transitions and completed collapse/expansion; reduced-motion disclosure had zero animations and immediately reached its final size. Representative light 1280px and dark 375px screenshots had no page/card-content overflow. A real touch-device session remains unverified. Follow-up logs: `C:/Users/Lenovo/AppData/Local/Temp/kira-kanban-card-followup-*.log`; screenshots: adjacent `kira-kanban-card-followup/`.
