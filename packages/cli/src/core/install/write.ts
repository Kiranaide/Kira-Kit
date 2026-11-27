import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { info, warning } from "../../lib/logger";
import { confirm } from "../../lib/prompts";

export interface WriteRequest {
  target: string;
  content: string;
  item: string;
}

export interface PlannedWrite extends WriteRequest {
  exists: boolean;
  identical: boolean;
}

export interface WriteOutcome {
  /** Targets written (or that would be written under --dry-run). */
  written: string[];
  skipped: string[];
  conflicts: string[];
}

export interface WriteOptions {
  overwrite?: boolean;
  yes?: boolean;
  dryRun?: boolean;
}

/** Dedupe by target path and classify each write against the existing file. */
export function planWrites(requests: WriteRequest[]): PlannedWrite[] {
  const byTarget = new Map<string, PlannedWrite>();

  for (const request of requests) {
    if (byTarget.has(request.target)) continue;

    const exists = existsSync(request.target);

    const identical =
      exists && readFileSync(request.target, "utf-8") === request.content;

    byTarget.set(request.target, { ...request, exists, identical });
  }

  return [...byTarget.values()];
}

async function resolveConflictChoice(
  conflicts: PlannedWrite[],
  options: WriteOptions,
): Promise<boolean> {
  if (conflicts.length === 0) return false;

  if (options.overwrite) return true;

  if (options.yes || options.dryRun) {
    if (!options.dryRun) {
      warning(
        `${conflicts.length} existing file(s) differ — skipped (use --overwrite to replace).`,
      );
    }

    return false;
  }

  const lines = conflicts.map((c) => `  ${c.target}`).join("\n");
  info(`Conflicting files:\n${lines}`);

  return confirm({}, `Overwrite ${conflicts.length} existing file(s)?`, false);
}

/**
 * Apply a write plan: identical files skip, conflicts need --overwrite or an
 * interactive confirm (--yes skips them), --dry-run writes nothing.
 */
export async function applyWrites(
  plan: PlannedWrite[],
  options: WriteOptions,
): Promise<WriteOutcome> {
  const conflicts = plan.filter((w) => w.exists && !w.identical);
  const overwriteConflicts = await resolveConflictChoice(conflicts, options);

  const outcome: WriteOutcome = {
    written: [],
    skipped: [],
    conflicts: conflicts.map((c) => c.target),
  };

  for (const write of plan) {
    if (write.identical || (write.exists && !overwriteConflicts)) {
      outcome.skipped.push(write.target);

      continue;
    }

    if (!options.dryRun) {
      mkdirSync(dirname(write.target), { recursive: true });
      writeFileSync(write.target, write.content, "utf-8");
    }

    outcome.written.push(write.target);
  }

  return outcome;
}
