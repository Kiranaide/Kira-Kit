/** Narrow already typed React/DOM prop unions without coercing their values. */
type CallableMember<Value> = Value extends (...args: never[]) => infer _Return
  ? Value
  : never;

export function isFunctionProp<T>(value: T): value is CallableMember<T> {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Base UI accepts both values and state callbacks; preserve that public union.
  return typeof value === "function";
}

export function isStringProp<T>(value: T): value is T & string {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React props accept strings alongside arrays or native element types.
  return typeof value === "string";
}

export function isNumberProp<T>(value: T): value is T & number {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- DOM/CSS length props distinguish numeric units from literal strings.
  return typeof value === "number";
}

export function isObjectProp<T>(value: T): value is T & object {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Responsive props accept a scalar or a typed breakpoint object.
  return value !== null && typeof value === "object";
}
