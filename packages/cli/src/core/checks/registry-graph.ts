import type { Finding, ItemMeta } from "./types";

const NAMESPACE_PREFIX = "@kira-kit/";

function stripNamespace(dep: string): string {
  return dep.startsWith(NAMESPACE_PREFIX)
    ? dep.slice(NAMESPACE_PREFIX.length)
    : dep;
}

function itemBaseName(key: string): string {
  return key.replace(/^(?:ui|hooks|lib)\//, "");
}

/**
 * Whole-graph check: verifies that `registryDependencies` across all registry
 * items form a DAG (no circular dependencies).
 */
export function checkRegistryGraph(items: Map<string, ItemMeta>): Finding[] {
  const byName = new Map<string, { key: string; meta: ItemMeta }>();

  for (const [key, meta] of items.entries()) {
    byName.set(itemBaseName(key), { key, meta });
  }

  const findings: Finding[] = [];
  const state = new Map<string, "visiting" | "visited">();
  const reportedCycles = new Set<string>();
  const stack: string[] = [];

  const visit = (name: string) => {
    state.set(name, "visiting");
    stack.push(name);

    const entry = byName.get(name);
    const deps = (entry?.meta.registryDependencies ?? []).map(stripNamespace);

    for (const dep of deps) {
      if (!byName.has(dep)) continue;

      const depState = state.get(dep);

      if (depState === "visiting") {
        const cycleStart = stack.indexOf(dep);
        const cycle = [...stack.slice(cycleStart), dep];
        const canonical = cycle.slice(0, -1).sort().join(",");

        if (!reportedCycles.has(canonical)) {
          reportedCycles.add(canonical);
          findings.push({
            checkId: "registry-graph",
            severity: "error",
            file: entry?.key ?? `registry/${name}`,
            message: `Circular registry dependency detected: ${cycle.join(" -> ")}`,
          });
        }
      } else if (!depState) {
        visit(dep);
      }
    }

    stack.pop();
    state.set(name, "visited");
  };

  for (const name of byName.keys()) {
    if (!state.has(name)) visit(name);
  }

  return findings;
}
