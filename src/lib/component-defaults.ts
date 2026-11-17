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
