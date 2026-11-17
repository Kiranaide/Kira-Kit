# Announcement Bar, Aspect Ratio, and Code Block upgrade

## Banner and code follow-up — November 15, 2026

Announcement Bar v3.0.1 separates explicit playback/focus stops from temporary
hover and visibility suspension. Message and control changes receive bounded
opacity/transform entrances. Auto-dismiss progress uses one linear CSS animation
with pause and restart; numeric timer state updates once per second. Countdown
units reserve two digit widths, keeping minutes visible below one minute.

Code Block v3.1.0 adds both requested tab workflows: Formatted/Source by default,
and optional Preview/Code around a caller-supplied preview. Prettier formats
complete supported snippets with two-space indentation; source and edited drafts
are retained. Copy follows the selected code view. Line annotations bypass
formatting so their coordinates remain correct. Read-only colors use lazy Shiki
core, a JavaScript regex engine, two themes and only the requested grammar.
The native renderer keeps blank rows at the same line height without extra
newline-induced spacing, with separate hidden line endings for DOM text.
Editable blocks start on Source. Preview/Code uses a single underline treatment;
Formatted/Source shares the filename/copy toolbar with a soft selected surface.

Streaming reveals only appended text in at most four rows with a finite opacity
animation. Completed line tokens and grammar state are cached; only the new
complete lines and unfinished tail are parsed. Prettier waits for completion.
Hidden/offscreen snippets defer presentation work, and reduced motion suppresses
the reveal. No per-frame React timer or full-editor mount is added for reading.
Prettier and four Shiki packages are production/registry dependencies.

Follow-up verification: all 11 focused regression tests pass (formatting,
incremental grammar equivalence, retained token rows, original source/editing,
toolbar styles, native line boundaries, explicit pause, finite progress and
accessible countdown text). `bun run check` and `bun run build` both exit 0.
All generated component and support files match the working source exactly;
Code Block's registry includes Prettier and all four Shiki packages. Advisory
lint and build chunk warnings remain. The supplied tab screenshot was inspected,
but no fresh browser visual pass, live reduced-motion test or device performance
measurement is claimed. Prior verification below describes the earlier candidate.

Static review prompted fixes for reduced-motion countdown resume, auto-height
after the line-height change, and React 19 callback-ref cleanup. Countdown cells
now include explicit accessible text. The review used only non-mutating reads
of a stable intermediate candidate; it made no runtime or visual pass claim.

Implementation date: November 14, 2026. Feature research cutoff: October 31, 2026. Base UI audit: installed and latest published version 1.9.0, confirmed
with `bunx npm view @base-ui/react version`. Existing workspace changes were
preserved; the task baseline is the working source, not just Git HEAD.

## Research

- [Base UI 1.9.0 release](https://base-ui.com/react/overview/releases/v1-9-0)
  is dated October 9, 2026. The installed package has Button, Tabs, useRender,
  and mergeProps; it has no announcement, aspect-ratio, or code-block primitive.
  Native media and code elements remain the appropriate foundations.
- [shadcn October 2026 changelog](https://ui.shadcn.com/docs/changelog)
  introduced [Code Block](https://ui.shadcn.com/docs/components/code-block)
  for snippets, logs, diffs, agent output, and Markdown. Its composable header,
  actions, copy, tabs, and native code content set the parity target. Kira keeps
  the existing prop-driven API and adds these composable parts without adding
  a syntax-highlighting dependency.
- [WAI-ARIA carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
  requires explicit rotation control, stopping on keyboard focus, and an
  explicit user request to restart after focus stops rotation. Automatic
  changes should not repeatedly interrupt assistive technology.
- [GOV.UK notification banner guidance](https://design-system.service.gov.uk/components/notification-banner/)
  uses banners for service incidents, approaching deadlines, and the result of
  important actions. Critical information must remain available long enough
  to read and act on.
- [MDN picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)
  documents source selection and art direction: portrait mobile crops can be
  different resources from desktop crops, rather than stretching one asset.
  [Native CSS aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
  and object-position provide stable media geometry and focal crops.
- The installed modern-monaco 0.4.2 exposes an asynchronous editor initializer.
  Its theme is global to the Monaco instance. Native read-only rendering avoids
  editor initialization and keeps partial streamed text, clipboard values,
  and accessibility available while an optional editor loads or fails.

## Explore findings

### Announcement Bar

The baseline exported the root, icon/content/action/dismiss/progress/countdown,
rotator, stack, Kira wrapper, dismissal/expiry/countdown/context hooks, and
variants. It had no Base UI primitive. Rotator had no user controls or
visibility pause; the content nested live regions. Actions were anchors even
without URLs. Compound dismiss buttons did not dismiss the root; Kira's dismiss
called only the external callback. Storage did not adopt changed keys or other
instances. Dismissal waited for animation completion; timer cleanup subtracted
elapsed time twice. Stack disclosure depended on hover. Countdown could keep
an obsolete value after its target changed. Ref, slot, state, and documentation
coverage were incomplete.

### Aspect Ratio

The baseline exported root, responsive root, image/video/embed, Kira wrapper,
variants, and ratio presets. Native geometry was correct for preset ratios,
but numeric responsive values were never applied after the base breakpoint.
Loading removed children, preventing media from loading and losing drafts.
The placeholder was a background on the same transparent image, so it could
not be seen. Cached images, failed sources, and source changes had no reliable
lifecycle. Root/media refs and internal slots were incomplete. Demo pages
lacked keyboard instructions and a changelog.

### Code Block

The baseline exported CodeBlock, its props, and variants. Every read-only
snippet initialized Monaco, including documentation snippets in inactive
panels. Option changes recreated models, discarded editing state, and coupled
themes. Copy used the original prop instead of the edited model; failures and
timeouts were not handled. Editor failure was silent. Header and fallback
colors did not follow the variant. Native root props/refs, composable parts,
keyboard instructions, usage, and changelog were absent.

## Pass B design briefs

### Announcement rotation and deadlines

Problem: people miss incident or maintenance notices while messages rotate or
the banner disappears. Behavior: explicit previous/next/pause controls, focus
and visibility stops, readable deadline text, extension, and caller-supplied
start/end dates. Cut: automatic focus movement and assertive announcements on
every timer tick.

### Announcement actions and consent decisions

Problem: a banner must keep an action available when saving fails, and consent
choices must distinguish acceptance from rejection. Behavior: cancellable
caller-owned async actions, visible pending/error/success, retry, and optional
keyed decision persistence after a successful callback. Cut: network calls,
analytics, and a claim that the component implements a complete consent system.

### Media loading and recovery

Problem: broken or changing assets leave blank cards and disrupt the page.
Behavior: retain the resource while a reserved frame shows its placeholder,
adopt cached/source changes, and expose a recovery action in Kira's error state.
Cut: filter animation and automatic retry loops.

### Responsive art direction and deferred embeds

Problem: a desktop crop fails in a narrow card, and external embeds load before
someone chooses to view them. Behavior: viewport or local container ratios,
native picture sources, bounded focal coordinates, and an explicit preview
action before creating a deferred iframe. Cut: a custom player, drag editor,
and claims about cross-origin iframe content that load events cannot prove.

### Code copying and change review

Problem: copying line numbers, command prompts, or removed diff lines produces
invalid code. Behavior: copy the current buffer or caller-supplied clean value,
show a success check/error recovery, and label additions/removals/highlights.
Cut: a homegrown syntax parser and executing code.

### Code file tabs and streamed output

Problem: generated answers span files and change while being received.
Behavior: Base UI file selection retains per-file edits, copies the active
file, and renders incomplete streamed text without a live announcement per
token. Cut: automatic scrolling away from the reader and a full IDE.

## Verification

The November 14 implementation completed all three Pass A/Pass B sources and
demo pages before running verification, as requested. The referenced
[upgrade thread](t3-thread://v2/4b71ca88-dfe6-4910-a761-0bd056bbebe1/63833321-2fff-48ff-80e2-ba1a5be2f5af)
contains the initial independent review, its repairs, successful intermediate
gates, and the light/dark visual walks at 375px and 1280px. That run stopped
during copy tests whose selectors matched hidden demo panels. Those attempts
were not evidence of clipboard failures.

### Continuation, November 15, 2026

`bunx npm view @base-ui/react version` still reports 1.9.0, matching all three
recorded audits. The October research scope and feature selection are retained.
No fresh independent review was launched. The initial continuation `bun run
check` reached formatting after lint and TypeScript passed, then failed on four
target files. Those files were formatted without changing unrelated source.

The shared T3 preview was used for current interaction checks. Every control
selector was scoped to its active outer demo panel and, for code files, the
active inner file panel. Tests that initially used unavailable labels or included
line-number text in a snapshot were corrected before recording a pass.

- Announcement actions: real Tab/Enter reaches Cancel without losing pending
  action focus; cancellation remains cancelled past the fixture completion
  time; failure exposes Try again; retry succeeds; successful actions remain
  dismissible. Consent saves `accepted` and `rejected` separately. Shared
  dismissal hides both instances, adopts a new key, and retains the old key's
  dismissal. Collapsing/reopening the stack retains its edited input.
- Announcement timing: Next stops rotation for longer than its six-second
  interval; explicit Resume restarts it. Pause retains a notice beyond its
  twelve-second timeout. Extend resets remaining time; hiding the demo for
  longer than that timeout retains the notice; revealing it resumes dismissal.
- Code copying: shell payload equals `bun add @base-ui/react\nbun run dev`;
  diff payload excludes the removed line and includes the new retry/timeout
  policy. The failure fixture shows a recovery message and then captures the
  full source after retry. Switching files copies the selected JSON source.
  Two edited file drafts survive switching; copying uses the retained active
  draft. Plain editing and font-size changes preserve the buffer.
- Streamed code: pausing freezes rendered line content while the source
  continues. Copy equals the frozen code without line-number chrome. Resume
  displays the latest source. ArrowRight/Enter selects the next file through
  native Base UI tabs. Monaco initializes when explicitly selected after the
  editor panel is revealed.
- Media: reload retains the same input node/value and exact frame height;
  a broken image recovers to the loaded local illustration. Embeds contain no
  iframe until activation and return to the deferred state after reset.
  All eleven media demo tabs were programmatically selected in light/dark at
  375×900 and 1280×900: no page or panel overflow. All eight preset ratios
  resolve correctly; native picture selects portrait at 375px and landscape
  at desktop; the numeric desktop ratio resolves to 3, and widening a local
  container changes its ratio from 1 to 16/9 without changing the viewport.

### Final correction: Aspect Ratio v3.0.1

Deferred embed activation removed the focused button and left focus on BODY.
Kira now transfers focus to the loaded iframe after the media's loading/inert
state clears. The effect preserves another control's focus if the reader moved
while waiting. The loaded iframe was verified as `document.activeElement` with
`inert=false`; the conditional preservation path was inspected statically.
A real Enter activation was rechecked after formatting and again focused
the loaded iframe. Representative deferred-preview screenshots were reviewed
in light/dark at 375px and 1280px. The demo header, keyboard notes, and dated
changelog record v3.0.1.

### Final gates and registry

- `bun run check`: exit 0 after the final component correction; lint,
  TypeScript and formatting pass (advisory warnings remain).
- `bun run build`: exit 0; registry generation/checks, its repeated check
  gate, and the Vite production build pass.
- All three generated registry files contain their exact current component
  source and exact current `use-reduced-motion.ts` content. Announcement Bar
  registry dependencies are `button`, `spinner`; Aspect Ratio uses `button`,
  `skeleton`; Code Block uses `button`, `spinner`, `tabs`, `toast`. Their npm
  dependencies are present, including optional `modern-monaco` for Code Block.

The working checkout is the verified candidate; its existing unrelated changes
were preserved. Browser checks used the development build. No consumer-install
test or additional independent review of v3.0.1 is claimed.

### Breaking changes and limitations

- Announcement Bar: default position is inline instead of sticky top;
  URL-less actions are native buttons and Kira actions receive AbortSignal
  context. Dismissal is immediate. The named region/contextual live-content
  contract replaces nested live regions. Focus stops rotation until explicit
  resume; expired countdowns say Ended; marquee loops are bounded.
- Aspect Ratio: AspectRatioImage adds a span wrapper while its ref still
  targets the image. Loading retains children but makes them inert. Kira
  tracks media lifecycle, defers embeds by default, and normalizes invalid
  ratios to a square. Update direct-child selectors and use `deferEmbed=false`
  where immediate embed loading is intentional.
- Code Block: read-only content uses native code without Monaco syntax
  colors. Theme/minimap apply to optional editing; Monaco themes are global.
  The system theme is the default, explicit editor themes win, auto height
  is capped at 480px, and either `editable=true` or `readOnly=false` enables
  editing. Header tokens replace window dots. Copy uses the current displayed
  buffer and removes marked deletion lines.

These are scoped verification claims. Prior screenshot walks are retained;
the continuation's four media configurations were DOM/layout checks, not four
new exhaustive manual visual reviews. Clipboard payloads used local adapters;
OS clipboard permission behavior is unverified. The preview host rejected
keyboard dispatch inside the sandboxed cross-site iframe, so a full inside-frame
Tab walk is unverified. Live reduced-motion emulation, real browser 200% zoom,
physical touch/screen readers, exhaustive contrast, video playback/captions,
all advanced-editor failure/theme races, pinned-notice focus cases, and consumer
registry installation remain open. A zero-animation document with the normal
motion preference was observed; it is not a reduced-motion pass.
