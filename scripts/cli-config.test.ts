import { expect, test } from "bun:test";
import {
  mkdtempSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readConfig, writeConfig } from "../packages/cli/src/lib/config";

test("config writes preserve custom settings when registryUrl is omitted", () => {
  const cwd = mkdtempSync(join(tmpdir(), "kira-config-test-"));

  try {
    const config = JSON.parse(readFileSync("components.json", "utf8"));

    config.aliases.ui = "@/custom/ui";
    config.registries = { "@custom": "https://example.com/r/{name}.json" };
    config.extra = "preserved";
    writeFileSync(join(cwd, "components.json"), JSON.stringify(config));

    const before = readConfig(cwd);

    expect(before?.aliases.ui).toBe("@/custom/ui");
    expect(before?.registryUrl).toBe("https://kira-kit.vercel.app/r");
    writeConfig(cwd, { style: "test" });

    const after = readConfig(cwd);

    expect(after?.aliases.ui).toBe(before?.aliases.ui);
    expect(after?.registries).toEqual(before?.registries);
    expect(
      JSON.parse(readFileSync(join(cwd, "components.json"), "utf8")).extra,
    ).toBe("preserved");
  } finally {
    unlinkSync(join(cwd, "components.json"));
    rmdirSync(cwd);
  }
});
