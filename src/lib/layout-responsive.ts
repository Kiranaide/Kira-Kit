const layoutBreakpoints = ["base", "sm", "md", "lg", "xl", "2xl"] as const;

type LayoutBreakpoint = (typeof layoutBreakpoints)[number];

type LayoutResponsiveValue<Value> =
  Value | Partial<Record<LayoutBreakpoint, Value>>;

type LayoutClassMap = Record<string, readonly string[]>;

function isLayoutMap<Value extends string | number | boolean>(
  value: LayoutResponsiveValue<Value>,
): value is Partial<Record<LayoutBreakpoint, Value>> {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- The public responsive API accepts a primitive or a typed breakpoint map.
  return typeof value === "object";
}

/** Every class, including its breakpoint prefix, is literal source for consumer CSS. */
function resolveLayoutResponsive<Value extends string | number | boolean>(
  value: LayoutResponsiveValue<Value> | undefined,
  classMap: LayoutClassMap,
): string {
  if (value == null) return "";

  if (!isLayoutMap(value)) return classMap[String(value)]?.[0] ?? "";

  return layoutBreakpoints
    .flatMap((breakpoint, index) => {
      const entry = value[breakpoint];

      const classes =
        entry === undefined ? "" : (classMap[String(entry)]?.[index] ?? "");

      return classes ? [classes] : [];
    })
    .join(" ");
}

const layoutGapClasses = {
  "0": ["gap-0", "sm:gap-0", "md:gap-0", "lg:gap-0", "xl:gap-0", "2xl:gap-0"],
  "1": ["gap-1", "sm:gap-1", "md:gap-1", "lg:gap-1", "xl:gap-1", "2xl:gap-1"],
  "2": ["gap-2", "sm:gap-2", "md:gap-2", "lg:gap-2", "xl:gap-2", "2xl:gap-2"],
  "3": ["gap-3", "sm:gap-3", "md:gap-3", "lg:gap-3", "xl:gap-3", "2xl:gap-3"],
  "4": ["gap-4", "sm:gap-4", "md:gap-4", "lg:gap-4", "xl:gap-4", "2xl:gap-4"],
  "5": ["gap-5", "sm:gap-5", "md:gap-5", "lg:gap-5", "xl:gap-5", "2xl:gap-5"],
  "6": ["gap-6", "sm:gap-6", "md:gap-6", "lg:gap-6", "xl:gap-6", "2xl:gap-6"],
  "8": ["gap-8", "sm:gap-8", "md:gap-8", "lg:gap-8", "xl:gap-8", "2xl:gap-8"],
  "10": [
    "gap-10",
    "sm:gap-10",
    "md:gap-10",
    "lg:gap-10",
    "xl:gap-10",
    "2xl:gap-10",
  ],
  "12": [
    "gap-12",
    "sm:gap-12",
    "md:gap-12",
    "lg:gap-12",
    "xl:gap-12",
    "2xl:gap-12",
  ],
  "16": [
    "gap-16",
    "sm:gap-16",
    "md:gap-16",
    "lg:gap-16",
    "xl:gap-16",
    "2xl:gap-16",
  ],
  "20": [
    "gap-20",
    "sm:gap-20",
    "md:gap-20",
    "lg:gap-20",
    "xl:gap-20",
    "2xl:gap-20",
  ],
  "24": [
    "gap-24",
    "sm:gap-24",
    "md:gap-24",
    "lg:gap-24",
    "xl:gap-24",
    "2xl:gap-24",
  ],
} as const;

type LayoutSpacing = keyof typeof layoutGapClasses extends infer Key
  ? Key extends `${infer Size extends number}`
    ? Size
    : never
  : never;

export { resolveLayoutResponsive, layoutGapClasses };

export type { LayoutResponsiveValue, LayoutSpacing };
