/** Remove composition props before forwarding native DOM attributes. */
export function omitComponentProps<
  Props extends object,
  const Keys extends readonly (keyof Props)[],
>(props: Props, keys: Keys): Omit<Props, Keys[number]> {
  const nativeProps = { ...props };

  for (const key of keys) delete nativeProps[key];

  return nativeProps;
}
