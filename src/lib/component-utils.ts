import * as React from "react";

type CallableMember<Value> = Value extends (...args: never[]) => infer _Return
  ? Value
  : never;

type ComponentDefaults<Props, Defaults> = Props extends unknown
  ? Omit<Props, keyof Defaults> & {
      [Key in keyof Defaults]-?: Key extends keyof Props
        ? Exclude<Props[Key], undefined>
        : Defaults[Key];
    }
  : never;

type DefaultValue<Value> = Value extends (infer Item)[]
  ? readonly Item[]
  : Value;

type ComponentFallbacks<Props> = {
  [Key in keyof Props]?: DefaultValue<Props[Key]>;
};

/** React and Base UI accept either a value or a render/state callback. */
export function isFunctionProp<T>(value: T): value is CallableMember<T> {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React/Base UI render, ref, and state callback unions require a runtime callable check at the component boundary.
  return typeof value === "function";
}

/** Responsive component props accept token values or breakpoint records. */
export function isObjectProp<Value>(value: Value): value is Value & object {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Typed responsive and native prop unions require this representation guard.
  return typeof value === "object" && value !== null;
}

/** CSS dimensions and table primitive values keep their numeric semantics. */
export function isNumberProp<Value>(value: Value): value is Value & number {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Numeric members of public component prop unions are intentionally accepted.
  return typeof value === "number";
}

/** String children and primitive cell values retain text semantics. */
export function isStringProp<Value>(value: Value): value is Value & string {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- ReactNode and primitive cell value unions require text narrowing.
  return typeof value === "string";
}

export function isBooleanProp<Value>(value: Value): value is Value & boolean {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Boolean table cells intentionally sort by their primitive value.
  return typeof value === "boolean";
}

export function isBigIntProp<Value>(value: Value): value is Value & bigint {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Bigint values retain numeric ordering in the generic table sorting contract.
  return typeof value === "bigint";
}

/** Apply React-style defaults: explicit undefined uses the fallback; null does not. */
export function resolveComponentDefaults<
  Props extends object,
  const Defaults extends object,
>(
  props: Props,
  defaults: Defaults & ComponentFallbacks<Props>,
): ComponentDefaults<Props, Defaults> {
  const resolved = { ...props };

  // SAFETY: fallback keys are checked against the component prop contract.
  for (const key of Object.keys(defaults) as Extract<
    keyof Props,
    keyof Defaults
  >[]) {
    if (resolved[key] === undefined) {
      const fallback = defaults[key];
      const value = Array.isArray(fallback) ? [...fallback] : fallback;
      // SAFETY: the fallback contract validates each value for its matching prop key.
      resolved[key] = value as Props[typeof key];
    }
  }

  // SAFETY: only undefined-valued props were replaced; public and native props remain intact.
  return resolved as Props & ComponentDefaults<Props, Defaults>;
}

/** Remove composition props before forwarding native DOM attributes. */
export function omitComponentProps<
  Props extends object,
  const Keys extends readonly (keyof Props)[],
>(props: Props, keys: Keys): Omit<Props, Keys[number]> {
  const nativeProps = { ...props };

  for (const key of keys) delete nativeProps[key];

  return nativeProps;
}

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

export function reactContentKey(node: React.ReactNode) {
  if (React.isValidElement(node) && node.key !== null) return String(node.key);

  return String(node);
}
