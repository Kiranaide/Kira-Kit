# Upgrade to Kira Kit 0.5

Use Node.js 22.12.0 or later and React 19.2 or later. Start on a clean Git
branch so you can review edits to your copied components and CSS. Use the
published `0.5.0` commands below once that version is available.

## Check the installer changes

- Use the 0.5 registry URL from the release notes with the 0.5 CLI. Keep the
  existing registry URL in projects using 0.4. The two installers expect
  different formats for registry items that include CSS.
- Run `npx kira-kit@0.5.0 init --yes` from the consumer root. Remove the
  legacy `--base` flag from scripts. Use `--preset` to choose a theme.
- Preview a component update with
  `npx kira-kit@0.5.0 add input --dry-run --diff`. Merge the changes you
  need into customized files. Review dependency and stylesheet changes in
  the same diff. Use `--overwrite` only for items you intend to replace.
- Update each changed item together with its registry dependencies. If your
  build reports missing helpers or changed exports, compare the full update
  in a separate Git branch and reapply your edits to the new sources.
  Remove legacy files only after checking that your app no longer imports
  them. A mixed tree of old and new components can fail to compile.
- For example, some 0.4 installs pulled in `toast` alongside `button`.
  If you still use both items, include both in the reviewed update, then
  reapply your local changes and run the consumer build.
- Update scripts that fetch `/r/index.json` to fetch `/r/registry.json`.
  If your config uses the legacy `registryUrl` field, review
  `npx kira-kit@0.5.0 migrate --dry-run` before applying it.

## Update changed imports and props

Install extracted items explicitly when your project uses them.

```sh
npx kira-kit@0.5.0 add otp-input rating theme-provider
```

Before:

```tsx
import { OTPInput, Rating, RatingDisplay } from "@/components/ui/input";
import { badgeVariants } from "@/components/ui/sidebar";
import { TagInput } from "@/components/ui/badge";
```

After:

```tsx
import { OTPInput } from "@/components/ui/otp-input";
import { Rating, RatingDisplay } from "@/components/ui/rating";
import { sidebarBadgeVariants } from "@/components/ui/sidebar";
import { TagInput } from "@/components/ui/input";
```

- Replace `<InputWithLabel label="Email" type="email" />` with
  `<KiraField label="Email" type="email" name="email" />` from the field item.
  Compose `InputGroup`, `InputGroupInput` and `InputGroupAddon` for buttons
  and other controls formerly supplied by input helpers. Attach the tooltip
  or dropdown trigger to the corresponding control.
- Replace `IconButtonWithTooltip` with an icon-sized `Button` that has an
  accessible name, composed with the tooltip item.
- Move `loading`, `error` and `onRetry` handling outside `KiraContainer`,
  `KiraGrid`, `KiraStack` and `KiraSpacer`. Render a skeleton, a retry
  button or the content as children of the layout component.

Run your consumer build and check keyboard interactions on the updated
screens. If a registry upgrade fails, restore the changed files from your
branch and install again from the previous registry snapshot.

## Install from a registry snapshot

Extract the release's registry archive into a directory you control.
Set `registries["@kira-kit"]` in `components.json` to the extracted
`r/{name}.json` path relative to the project, or serve that directory and
use its full HTTP URL. Pin the CLI version as well. Keep the application's
dependency lockfile to reproduce dependency versions.
