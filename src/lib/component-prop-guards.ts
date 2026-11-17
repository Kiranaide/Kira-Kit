/** React and Base UI accept either a value or a render callback. */
export function isCallbackProp<Value>(
  value: Value,
): value is Extract<Value, (...args: never[]) => void> {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React render/ref unions require checking callable values at the component boundary.
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
