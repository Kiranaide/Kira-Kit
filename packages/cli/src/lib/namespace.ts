/** Map a bare item name to the @kira-kit namespace; pass through addresses. */
export function toItemAddress(name: string): string {
  const passthrough =
    name.startsWith("@") ||
    name.startsWith("http://") ||
    name.startsWith("https://") ||
    name.startsWith("./") ||
    name.startsWith("../") ||
    name.startsWith("/") ||
    /^[a-zA-Z]:[\\/]/.test(name) ||
    name === "." ||
    name === "..";

  if (passthrough) return name;

  return `@kira-kit/${name}`;
}
