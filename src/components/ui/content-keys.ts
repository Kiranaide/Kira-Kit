import * as React from "react";

/** Content identities with a local occurrence suffix for duplicate labels. */
export function withContentKeys<T>(
  items: readonly T[],
  identity: (item: T) => string,
) {
  const occurrences = new Map<string, number>();

  return items.map((item) => {
    const content = identity(item);
    const occurrence = occurrences.get(content) ?? 0;
    occurrences.set(content, occurrence + 1);

    return { item, key: JSON.stringify([content, occurrence]) };
  });
}

export function reactContentKey(node: React.ReactNode) {
  if (React.isValidElement(node) && node.key !== null) return String(node.key);

  return String(node);
}
