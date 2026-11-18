# Design System Plan — Kira Kit spacing & sizing

Purpose: make every control, container, and gap in the boilerplate follow one
shared contract. Apply the changes below **in the kira-kit source**, then
reinstall into this repo via the registry (`@kira-kit` in `components.json`).
`src/components/ui/` here is read-only; nothing in this plan edits it directly.

Audit basis: button/input read in full; all other kit components and pages
audited for exact height/padding/gap/radius values (Nov 2026).

> **Scope note (kira-kit-v2):** this repo IS the kit source — `src/components/ui/`
> is editable here and changes land directly (no registry reinstall needed).
> The preamble above and §4.1 describe the consumer repo (boilerplate-v2) and
> are out of scope for this repository. §3.12 is a rework of the existing
> `card.tsx`, not a new primitive. `--radius` here is 0.45rem and stays.
> The §6 kitchen-sink page lives at `/ui-preview` (no `/admin` zone here).

---

## 1. The contract

### 1.1 Base unit and sanctioned scale

- Base unit: **4px** (Tailwind default spacing, `1` = 0.25rem).
- Sanctioned steps: `1, 2, 3, 4, 5, 6, 8, 10, 12, 16`.
- Half-steps (`1.5`, `2.5`, `3.5`) are **banned in app code**. Inside the kit
  they are allowed only as documented optical exceptions (vertical text
  padding `py-1.5`/`py-2.5`, badge/tooltip internals). Never for heights,
  widths, gaps, or horizontal padding.
- Arbitrary values (`p-[13px]`, `h-[42px]`, `text-[0.8rem]`,
  `rounded-[min(...)]`) are banned everywhere except fluid page-level
  `clamp()` gutters/type (see §4.1).

### 1.2 Control height ladder (the core fix)

One ladder for **every interactive control**: button, input, select,
combobox trigger, textarea (min-height), numeric stepper, menu search field.
The button's existing ladder wins; inputs/selects move up to meet it.

| Size      | Height        | px     | Text                   | Icon | Typical use                     |
| --------- | ------------- | ------ | ---------------------- | ---- | ------------------------------- |
| `xs`      | `h-7` (28px)  | `px-2` | `text-xs`              | 12px | dense tables, chips, toolbars   |
| `sm`      | `h-8` (32px)  | `px-3` | `text-xs`              | 14px | filters, secondary toolbars     |
| `default` | `h-9` (36px)  | `px-4` | `text-base md:text-sm` | 16px | forms, dialogs                  |
| `lg`      | `h-10` (40px) | `px-5` | `text-base md:text-sm` | 20px | primary CTAs                    |
| `xl` NEW  | `h-11` (44px) | `px-5` | `text-base`            | 20px | touch surfaces, auth, marketing |

Rules:

- Inputs keep `text-base` below `md` (16px prevents iOS focus zoom). Buttons
  may use `text-xs`/`text-sm` at small sizes.
- `xl` exists to replace app-side hacks (`h-auto py-3.5`, `min-h-11`) with a
  real variant, and satisfies the 44px touch minimum.
- Coarse pointers: nav/menu rows get `pointer-coarse:min-h-11` (sidebar
  already does this — keep).
- Icon-only buttons: `size-7/8/9/10/11` matching the ladder (`icon-xs` …
  `icon-xl`).
- Badges, avatars, checkboxes are **not** controls; they keep their own
  compact ladders (§3.9, §3.12) and are exempt from the height table.

### 1.3 Gap tiers

| Relationship                      | Gap                               |
| --------------------------------- | --------------------------------- |
| Icon ↔ label inside a control     | `gap-2`                           |
| Label ↔ control (field stack)     | `gap-2`                           |
| Control ↔ helper/error text       | `gap-1`                           |
| Sibling controls, button rows     | `gap-2` (never `gap-1` for touch) |
| Form fields (FieldGroup/FieldSet) | `gap-6`                           |
| Card internal sections            | `gap-6`                           |
| Page sections                     | `gap-8`                           |

### 1.4 Container padding tiers

| Container                                       | Padding                     | Radius                                            |
| ----------------------------------------------- | --------------------------- | ------------------------------------------------- |
| Menu/list popup (select, combobox, dropdown)    | `p-1`                       | `rounded-lg`                                      |
| Menu item (all menus, one metric)               | `px-2 py-1.5 min-h-8 gap-2` | `rounded-md`                                      |
| Popover body / toast / drawer                   | `p-4`                       | `rounded-lg` (toast/drawer), `rounded-lg` popover |
| Dialog                                          | `p-6`                       | `rounded-xl`                                      |
| **Card (new primitive)**                        | `p-6`, compact `p-4`        | `rounded-xl`                                      |
| Inline alert (ErrorSummary, FieldGroup outline) | `p-4`                       | `rounded-lg`                                      |
| Page shell                                      | `px-6 py-10 sm:px-10`       | —                                                 |

### 1.5 Radius ladder

Base `--radius: 0.625rem` stays. Hierarchy never skips a level:

1. `rounded-md` — items inside overlays (menu items, chips, kbd)
2. `rounded-lg` — controls (button, input, select, textarea) and list popups
3. `rounded-xl` — cards, dialogs
4. `rounded-2xl`+ — marketing/hero panels only

Remove the arbitrary `rounded-[min(var(--radius-md),10px)]` sm-select hack;
all control sizes use `rounded-lg`.

---

## 2. Why it feels off today (evidence)

| Concept   | Button       | Input          | Select   |
| --------- | ------------ | -------------- | -------- |
| `sm`      | h-8 px-3     | h-7 px-2       | h-7 px-2 |
| `default` | **h-9 px-4** | **h-8 px-2.5** | h-8 px-2 |
| `lg`      | h-10 px-5    | h-9 px-3       | missing  |

- A default Button beside a default Input is 4px taller with 6px more side
  padding. `InputWithButton` contains a `sizeToButton` workaround that steps
  the button down one size — delete it once ladders align.
- Three menu-item metrics: select `py-1 pl-1.5 pr-8`, combobox `px-2 py-1.5`,
  dropdown `px-2.5 py-2 min-h-9`. Popup padding: `p-0`/`p-1`/`p-1.5`/`p-4`.
- No Card primitive: me-page hand-rolls `rounded-xl border bg-card p-6 sm:p-7`;
  FieldGroup outline and ErrorSummary use `rounded-lg p-4`.
- Off-scale values in app code: `py-3.5`, `mt-3.5`, `-mb-2.5`, `px-3.5`,
  `size-8.5`, `text-[10px]`, `text-[0.8rem]`.

---

## 3. Per-component change spec (kit source)

Format: current → target. Only listed values change; everything else stays.

### 3.1 button.tsx

- Sizes `xs/sm/default/lg/icon*`: **unchanged** (they define the ladder).
- Add `xl: "h-11 gap-2 px-5 text-base has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-5"`.
- Add `"icon-xl": "size-11 [&_svg:not([class*='size-'])]:size-5"`.
- Add `xl` / `icon-xl` to `ButtonSize`, `getButtonIconSize` (`h-5 w-5`).

### 3.2 input.tsx

`inputVariants` sizes:

| Size    | Current                                | Target                                  |
| ------- | -------------------------------------- | --------------------------------------- |
| xs      | `h-6 px-2 py-0.5 text-xs`              | `h-7 px-2 py-0.5 text-xs`               |
| sm      | `h-7 px-2 py-1 text-[0.8rem]`          | `h-8 px-3 py-1 text-xs`                 |
| default | `h-8 px-2.5 py-1 text-base md:text-sm` | `h-9 px-4 py-1 text-base md:text-sm`    |
| lg      | `h-9 px-3 py-1.5 text-base md:text-sm` | `h-10 px-5 py-1.5 text-base md:text-sm` |
| xl NEW  | —                                      | `h-11 px-5 py-2 text-base`              |

(`file:h-*` helpers step with the ladder: h-5/6/7/8/8.)

Prefix/suffix affordances — recompute from the formula
**text offset = container px + affordance width + 4px gap**, rounded to scale:

- Prefix/suffix icons: `size-3` (xs), `size-4` (sm and up).
- Action buttons (clear/copy/password toggle) stay `size-6` boxes.

| Size    | Container pad (`PREFIX/SUFFIX_CONTAINER_PADDING`) | Icon offset (`PREFIX/SUFFIX_PADDING`) | One action box | Two action boxes |
| ------- | ------------------------------------------------- | ------------------------------------- | -------------- | ---------------- |
| xs      | `pl-2` / `pr-2`                                   | `pl-6` / `pr-6`                       | `pr-9`         | `pr-16`          |
| sm      | `pl-3` / `pr-3`                                   | `pl-8` / `pr-8`                       | `pr-10`        | `pr-17`          |
| default | `pl-4` / `pr-4`                                   | `pl-9` / `pr-9`                       | `pr-11`        | `pr-18`          |
| lg/xl   | `pl-5` / `pr-5`                                   | `pl-10` / `pr-10`                     | `pr-12`        | `pr-19`          |

Two-action values: single-action offset + 24px (second box) + 4px gap.
Tailwind v4 generates any numeric spacing step, so `pr-17/18/19` are valid —
no arbitrary values needed. Verify visually on the preview page (§6) — text
must never collide with the affordance.

Composite fixes:

- `InputWithButton`: delete `sizeToButton`; pass `size` straight through.
- `NumericInput` steppers: hardcoded `h-8 w-8` → derive from size
  (`size-7/8/9/10/11`), icons `h-3 w-3` → ladder icon sizes.
- `InputWithSpinner`: `pr-10` / `right-3` → single-action offset / container
  pad from the table.
- `TagInput` container: `p-2 gap-1.5` stays (chip area, documented exception);
  root `min-h` follows the ladder instead of fixed `h-6` input only.
- OTP slots: keep own square ladder (h-9/11/14) — non-standard control,
  documented exception.

### 3.3 select.tsx

Trigger uses `data-[size=…]` utilities (not cva):

- `data-[size=default]:h-8` → `h-9`; `data-[size=sm]:h-7` → `h-8`.
- Add `data-[size=xs]:h-7`, `data-[size=lg]:h-10`, `data-[size=xl]:h-11`.
- Base `px-2 py-1` → per-size px: `data-[size=xs]:px-2 data-[size=sm]:px-3
data-[size=default]:px-4 data-[size=lg]:px-5 data-[size=xl]:px-5`.
- Delete `data-[size=sm]:rounded-[min(var(--radius-md),10px)]` (both trigger
  and combobox). All sizes `rounded-lg`.
- Combobox trigger: `min-h-8`/`min-h-7` → ladder min-heights, same px mapping,
  `gap-1` → `gap-2`.
- SelectItem: `py-1 pr-8 pl-1.5 gap-1.5` → `px-2 py-1.5 pr-8 min-h-8 gap-2`
  (keep `pr-8` for the check indicator).
- Combobox item: already `px-2 py-1.5 gap-2` → add `min-h-8`.
- SelectGroup `p-1`, combobox popup `p-1`: keep (menu popup tier).

### 3.4 dropdown-menu.tsx

- Content: `p-1.5` → `p-1`.
- Item: `min-h-9 px-2.5 py-2 gap-2.5` → `min-h-8 px-2 py-1.5 gap-2`.
- Label: `px-2.5 py-2` → `px-2 py-1.5`.
- Search header input: `h-9 ps-3 pe-9` → `h-8 ps-3 pe-9` (sm control inside a
  menu); recheck its clear-button offset against §3.2 formula.

### 3.5 textarea.tsx

| Size    | Current                                     | Target                                    |
| ------- | ------------------------------------------- | ----------------------------------------- |
| sm      | `px-2 py-1.5 min-h-12 text-xs`              | `px-3 py-1.5 min-h-12 text-xs`            |
| default | `px-2.5 py-2 min-h-16 text-base md:text-sm` | `px-4 py-2 min-h-16 text-base md:text-sm` |
| lg      | `px-3 py-2.5 min-h-20 text-base`            | `px-5 py-2.5 min-h-20 text-base`          |
| xl NEW  | —                                           | `px-5 py-3 min-h-24 text-base`            |

Update the JS auto-height constants to match (paddingY 12/16/20 → 12/16/20/24;
lineHeight stays 20/24/28). `py` half-steps are the documented vertical-text
exception. Clear button `right-2 top-2` → container-pad aligned (`right-3`
default), `pr-9` → single-action offset.

### 3.6 field.tsx

- Field root `gap-2`: keep. Label→control `gap-2`: keep.
- FieldSet / FieldGroup: `gap-5` → `gap-6`.
- FieldControl: `min-h-10 px-3 py-2 rounded-md` → `min-h-9 px-4 py-1 rounded-lg`
  (matches default control).
- FieldError: `gap-1.5` → `gap-2`.
- FieldGroup outline / ErrorSummary: `rounded-lg p-4` stays (inline-alert tier).
- FieldRow sm/default/lg = `gap-2/4/6`: keep (layout gaps).

### 3.7 dialog.tsx / drawer.tsx / popover.tsx / toast.tsx

- Dialog `p-6 rounded-xl`, header `gap-1.5 mb-4`, footer `gap-2 pt-6`: keep
  (dialog tier). Close `right-4 top-4`: keep.
- Drawer header/body/footer `p-4`: keep (compact-overlay tier).
- Popover `p-4 rounded-lg`: keep. KiraPopover `mt-3`/`mt-4` internal rhythm:
  keep.
- Toast `p-4 gap-3`: keep (icon ↔ content optical gap, documented exception).

### 3.8 accordion.tsx

- px aligns to ladder: xs `px-3`→`px-2`, sm `px-3.5`→`px-3`, default `px-4`
  keep, lg `px-5` keep. `py` values keep (vertical-text exception).

### 3.9 badge.tsx

- Compact non-control ladder stays: h-4/5/6/7/8 with px-1.5/2/2.5/3/4
  (documented exception: badges are labels, half-steps optical).
- Close button lg `h-4.5` → `h-4`.
- xs `text-[10px]`: keep as the single documented sub-12px exception
  (count/micro badges), or move to `text-xs` if you prefer a hard 12px floor.

### 3.10 checkbox.tsx / separator.tsx / skeleton.tsx / avatar.tsx / tooltip.tsx

- Checkbox sizes 4/5/6 keep; label wrapper `gap-3` → `gap-2`. Card variant
  `p-3/4/5` keep (container tier).
- Separator `my-2/4/6` keep.
- Skeleton: button bone `h-9` keep; add bones for h-7/8/10/11 so skeletons
  match every ladder size.
- Avatar ladder keep (non-control).
- Tooltip sm/default/lg padding keep (overlay-text tier, documented).

### 3.11 sidebar.tsx / table.tsx / data-table.tsx

- Sidebar MenuButton: `min-h-9 px-2.5` → `min-h-9 px-3` (nav tier, slightly
  roomier than menu items); coarse `min-h-11` keep. Search `h-9` now matches
  the default control — keep.
- Table density CSS vars: **keep as-is** — this is the kit's one properly
  tokenized spacing system and the model for the rest.
- Data-table toolbar/pagination: pagination select sm/default/lg h-7/8/9 →
  h-8/9/10 to follow the ladder; toolbar `px-4 py-2` keep.

### 3.12 NEW: Card primitive

Add `card.tsx` to the kit so pages stop hand-rolling cards:

- `Card`: `rounded-xl border border-border bg-card text-card-foreground p-6`,
  prop `compact` → `p-4`.
- `CardHeader`: `flex flex-col gap-1.5` (title↔description optical exception),
  `mb-4` when followed by content.
- `CardTitle`: `text-base font-semibold leading-none`.
- `CardDescription`: `text-sm text-muted-foreground`.
- `CardContent`: no padding of its own (Card owns it).
- `CardFooter`: `flex items-center gap-2 pt-6`.

---

## 4. App-side follow-up (this repo, after registry reinstall)

All in allowed zones (`src/components/common/`, `src/pages/`). No `ui/` edits.

### 4.1 Pages

- `auth-form.tsx`: delete `h-auto rounded-lg py-3.5 text-base md:text-base`
  overrides on submit/inputs → `size="xl"`. Forgot-link `-mt-1 -mb-2.5` →
  remove; field `gap-2` owns the rhythm. Output box `px-3.5 py-3` → `px-3 py-2`.
- `auth-page.tsx`: `mt-3.5` → `mt-3` or `mt-4`. Fluid `clamp()` gutter/type
  stays — documented exception for page-level fluid values.
- `me-page.tsx`: hand-rolled `rounded-xl border bg-card p-6 sm:p-7` → kit
  `Card`. `sm:p-7` disappears. `gap-x-8 gap-y-5` dl → `gap-x-8 gap-y-4` or
  `gap-y-6` (pick one sanctioned step).
- `error-pages.tsx`: code box `px-3.5 py-2.5` → `px-3 py-2`; button
  `min-h-12` hacks → `size="xl"` (or keep min-h-12 as marketing exception).
- `brand.tsx`: `size-8.5`, `w-3.75`, `h-2.25`, `w-1.75` → whole steps
  (`size-8`/`size-9` logo box; redraw inner marks on the 4px grid).

### 4.2 Wrappers (optional, only if a pattern repeats 3+ times)

- `PageShell`: `max-w-* px-6 py-10 sm:px-10` page container.
- `ButtonRow`: `flex items-center gap-2`.
- Do not wrap kit components just to re-pad them — fix the kit instead.

---

## 5. Enforcement

- oxlint (already configured with anti-slop plugins): add/extend rules for app
  code — no arbitrary spacing utilities, no half-step utilities, no inline
  `style`, no `className` height/padding overrides on kit components (use
  `size`). Kit files are exempt (read-only here anyway).
- Grep gate for app code: `p-\[|h-\[|w-\[|gap-\d\.5|px-\d\.5|py-\d\.5|mt-\d\.5`
  should return only the documented `clamp()` exceptions.
- Persist this contract as the source of truth; new pages read it before
  choosing any spacing value.

## 6. Verification checklist (build a `/admin/ui-preview` kitchen-sink page)

- [ ] Button + Input + Select + Textarea at each size render **equal heights**
      on a shared baseline, side by side.
- [ ] `InputWithButton` / `InputWithDropdown` / `InputCluster` seams align with
      no size workaround.
- [ ] Prefix/suffix/clear/copy/password affordances: text never collides at
      any size, both themes.
- [ ] Select vs combobox vs dropdown items: identical padding/min-height;
      popups all `p-1`.
- [ ] Card vs dialog vs popover padding tiers visually distinct and consistent.
- [ ] Mobile: inputs ≥16px text (no iOS zoom); touch targets ≥44px where
      `xl`/coarse applies; ≥8px between adjacent targets.
- [ ] Dark mode pass on all of the above.
- [ ] Reduced-motion pass (no spacing-related motion regressions).
- [ ] `bun check` (oxlint type-aware + tsc) clean after reinstall.

## 7. Order of work

1. Kit: button `xl` + input/select/textarea ladder alignment (§3.1–3.5) —
   this alone removes the visible misalignment.
2. Kit: menu-item/popup unification + field gaps (§3.3–3.6).
3. Kit: Card primitive + remaining components (§3.7–3.12).
4. Reinstall via registry into this repo; run §6 checklist.
5. App-side cleanup (§4), then lint gates (§5).
