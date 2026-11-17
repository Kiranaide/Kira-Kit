import { Welcome } from "@kira/ui";

export function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Vite + @kira/ui
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          One component library, ready to grow.
        </h1>
        <p className="text-balance text-muted-foreground">
          Add components from the Kira Kit registry and share them across every
          app in your workspace.
        </p>
      </div>
      <Welcome>Start building</Welcome>
    </main>
  );
}
