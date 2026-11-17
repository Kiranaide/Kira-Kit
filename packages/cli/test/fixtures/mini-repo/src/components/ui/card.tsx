import { cn } from "cn";

export function Card({ className }: { className?: string }) {
  return (
    <div
      data-slot="card"
      // kira-kit-ignore raw-colors: brand swatch is intentionally hardcoded
      className={cn("bg-white", className)}
      style={{ color: "#333333" }}
    />
  );
}
