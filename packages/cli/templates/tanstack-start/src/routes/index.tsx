import { createFileRoute } from "@tanstack/react-router";
import { Welcome } from "@/components/ui/welcome";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          TanStack Start + Kira Kit
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Build your next interface.
        </h1>
        <p className="text-balance text-muted-foreground">
          A minimal React 19 project with Base UI primitives and Tailwind CSS
          v4, ready for the Kira Kit registry.
        </p>
      </div>
      <Welcome>Start building</Welcome>
    </main>
  );
}
