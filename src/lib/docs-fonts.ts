// Docs-only lazy font loaders for the theming & typeset pages' live preview.
// Keeping these out of the main entry avoids unused @font-face CSS on routes
// that only use the default Geist + Geist Mono stack.

type FontLoader = () => Promise<void>;

const FONT_LOADERS = new Map<string, FontLoader>([
  [
    "instrument-sans",
    async () => {
      await import("@fontsource-variable/instrument-sans");
    },
  ],
  [
    "inter",
    async () => {
      await import("@fontsource-variable/inter");
    },
  ],
  [
    "manrope",
    async () => {
      await import("@fontsource-variable/manrope");
    },
  ],
  [
    "plus-jakarta-sans",
    async () => {
      await import("@fontsource-variable/plus-jakarta-sans");
    },
  ],
  [
    "space-grotesk",
    async () => {
      await import("@fontsource-variable/space-grotesk");
    },
  ],
  [
    "dm-sans",
    async () => {
      await import("@fontsource-variable/dm-sans");
    },
  ],
  [
    "bricolage-grotesque",
    async () => {
      await import("@fontsource-variable/bricolage-grotesque");
    },
  ],
  [
    "sora",
    async () => {
      await import("@fontsource-variable/sora");
    },
  ],
  [
    "outfit",
    async () => {
      await import("@fontsource-variable/outfit");
    },
  ],
  [
    "newsreader",
    async () => {
      await import("@fontsource-variable/newsreader");
    },
  ],
  [
    "fraunces",
    async () => {
      await import("@fontsource-variable/fraunces");
    },
  ],
  [
    "jetbrains-mono",
    async () => {
      await import("@fontsource-variable/jetbrains-mono");
    },
  ],
  [
    "fira-code",
    async () => {
      await import("@fontsource-variable/fira-code");
    },
  ],
]);

const loadedFonts = new Set<string>();

export function loadDocsFont(name: string | undefined): void {
  if (!name || loadedFonts.has(name)) return;

  const loader = FONT_LOADERS.get(name);

  if (!loader) return;

  loadedFonts.add(name);
  void loader();
}

export function loadAllDocsFonts(): void {
  for (const name of FONT_LOADERS.keys()) {
    loadDocsFont(name);
  }
}
