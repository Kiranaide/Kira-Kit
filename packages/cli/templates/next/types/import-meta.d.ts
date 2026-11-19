// Kira Kit components read import.meta.env.DEV for development-only checks.
// Next.js does not ship Vite's ambient types, so declare the shape here.
interface ImportMetaEnv {
  readonly DEV?: boolean;
  readonly PROD?: boolean;
  readonly MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
