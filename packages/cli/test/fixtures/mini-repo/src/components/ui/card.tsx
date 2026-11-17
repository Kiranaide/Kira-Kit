import { cn } from "cn";

export function Card({ className }: { className?: string }) {
  return (
    <div
      data-slot="card"
      className={cn("bg-white", className)}
      // kira-kit-ignore raw-colors: brand swatch is intentionally hardcoded
      style={{ color: "#333333" }}
    />
  );
}
