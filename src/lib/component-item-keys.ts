/** Keep repeated labels distinct without tying unrelated items to their array positions. */
export function withOccurrenceKeys<Item>(
  items: readonly Item[],
  identity: (item: Item) => string,
) {
  const occurrences = new Map<string, number>();

  return items.map((item) => {
    const value = identity(item);
    const occurrence = occurrences.get(value) ?? 0;
    occurrences.set(value, occurrence + 1);

    return { item, key: JSON.stringify([value, occurrence]) };
  });
}
