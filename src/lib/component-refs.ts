import type { Ref, RefCallback } from "react";
import { isCallbackProp } from "@/lib/component-prop-guards";

/** Create a commit-time ref callback without reading ref values during render. */
export function mergeComponentRefs<Element>(
  ...refs: (Ref<Element> | undefined)[]
): RefCallback<Element> {
  return (element) => {
    for (const ref of refs) {
      if (isCallbackProp(ref)) ref(element);
      else if (ref) ref.current = element;
    }
  };
}
