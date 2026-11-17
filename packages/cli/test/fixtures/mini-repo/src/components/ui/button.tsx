import { cn } from "cn";

export function Button({ className }: { className?: string }) {
  return (
    <button
      data-slot="button"
      aria-label="Fixture button"
      className={cn("animate-fade-in h-6 w-6 bg-primary", className)}
    />
  );
}
