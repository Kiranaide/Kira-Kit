import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { init } from "../src/commands/init";
import { theme } from "../src/commands/theme";
import { resolveThemeSelection } from "../src/core/theme/apply";
import { BASE_CSS } from "../src/generated/assets";
import { ValidationError } from "../src/lib/errors";
import type { DepInstaller } from "../src/core/install/deps";

const tempDirs: string[] = [];

const noopInstaller: DepInstaller = {
  async install() {},
};

function makeProject(): string {
  const dir = mkdtempSync(join(tmpdir(), "kira-theme-apply-"));
  tempDirs.push(dir);
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      name: "demo-app",
      dependencies: { react: "^19.2.0", "react-dom": "^19.2.0" },
    }),
  );

  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe("resolveThemeSelection & CLI consistency", () => {
  it("defaults to geist sans and geist-mono when no flags or config exist", () => {
    const dir = makeProject();
    const selection = resolveThemeSelection(dir, {});

    expect(selection.sans.name).toBe("geist");
    expect(selection.mono.name).toBe("geist-mono");
    expect(selection.display).toBeUndefined();
    expect(selection.iconLibrary).toBe("tabler");
  });

  it("rejects unknown --base-color consistently in both init and theme --primary", async () => {
    const dir = makeProject();

    await expect(
      init({
        cwd: dir,
        baseColor: "not-a-color",
        force: false,
        yes: true,
        installer: noopInstaller,
      }),
    ).rejects.toThrow(ValidationError);

    await expect(
      theme({
        cwd: dir,
        primary: "#e2694a",
        baseColor: "not-a-color",
        apply: false,
        installer: noopInstaller,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("preserves existing fontDisplay from components.json when theme updates --font-mono", async () => {
    const dir = makeProject();

    writeFileSync(
      join(dir, "components.json"),
      JSON.stringify(
        {
          style: "kira",
          font: "inter",
          fontDisplay: "newsreader",
          fontMono: "geist-mono",
          tailwind: { css: "src/index.css", baseColor: "neutral" },
        },
        null,
        2,
      ),
    );
    writeFileSync(join(dir, "src/index.css"), BASE_CSS);

    const code = await theme({
      cwd: dir,
      fontMono: "jetbrains-mono",
      apply: true,
      installer: noopInstaller,
    });

    expect(code).toBe(0);

    const updated = JSON.parse(
      readFileSync(join(dir, "components.json"), "utf-8"),
    );

    expect(updated.font).toBe("inter");
    expect(updated.fontDisplay).toBe("newsreader");
    expect(updated.fontMono).toBe("jetbrains-mono");
  });
});
