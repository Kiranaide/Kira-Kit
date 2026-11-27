import assert from "node:assert/strict";
import { appendFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { $ } from "bun";
import { preview } from "vite";

async function verifySite(origin: string) {
  for (const path of [
    "/r/registry.json",
    "/r/color-picker.json",
    "/r/theme-default.json",
    "/schema/registry-item.json",
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.match(
      response.headers.get("content-type") ?? "",
      /application\/json/,
    );
    await response.json();
  }

  const docs = await fetch(origin + "/docs/installation");
  assert.equal(docs.status, 200);
  assert.match(await docs.text(), /id="root"/);
}

async function verifyConsumer(
  scratch: string,
  tarball: string,
  version: string,
  origin: string,
  legacyRegistry?: string,
) {
  await writeFile(join(scratch, "package.json"), '{"private":true}\n');
  await $`bun add ${tarball}`.cwd(scratch);
  const cli = join(scratch, "node_modules/kira-kit/dist/index.mjs");
  assert.equal((await $`node ${cli} --version`.text()).trim(), version);

  const project = join(scratch, "consumer");
  await $`node ${cli} create ${project} --template vite --no-install --no-git --yes`;
  const configPath = join(project, "kira-kit.json");
  const config = await readFile(configPath, "utf8");
  const defaultRegistry = "https://kira-kit.vercel.app/r/{name}.json";
  assert.ok(config.includes(defaultRegistry));
  await writeFile(
    configPath,
    config.replace(
      defaultRegistry,
      legacyRegistry ?? origin + "/r/{name}.json",
    ),
  );
  await $`bun install`.cwd(project);
  const cssPath = join(project, "src/index.css");
  const customCss = "\n/* release smoke custom CSS */\n";
  await appendFile(cssPath, customCss);
  const item = legacyRegistry === undefined ? "color-picker" : "button";
  const componentPath = join(project, `src/components/ui/${item}.tsx`);
  const customSource = "\n// release smoke custom component\n";

  if (legacyRegistry !== undefined) {
    await $`bun add kira-kit@0.4.0`.cwd(scratch);
    assert.equal((await $`node ${cli} --version`.text()).trim(), "0.4.0");
    await $`node ${cli} add ${item} --cwd ${project} --yes`;
    await appendFile(componentPath, customSource);
    await $`bun add ${tarball}`.cwd(scratch);
    await writeFile(
      configPath,
      config.replace(defaultRegistry, origin + "/r/{name}.json"),
    );
  }

  await $`node ${cli} init --cwd ${project} --yes`;
  await $`node ${cli} add ${item} --cwd ${project} --yes`;
  assert.ok((await readFile(cssPath, "utf8")).includes(customCss));

  if (legacyRegistry === undefined) {
    await appendFile(componentPath, customSource);
  }

  const original = await readFile(componentPath, "utf8");
  assert.ok(original.includes(customSource));
  await $`node ${cli} add ${item} --cwd ${project} --yes`;
  assert.equal(await readFile(componentPath, "utf8"), original);

  if (legacyRegistry !== undefined) {
    await $`node ${cli} add ${item} toast --cwd ${project} --overwrite --yes`;
    assert.ok(!(await readFile(componentPath, "utf8")).includes(customSource));
    await appendFile(componentPath, customSource);
    await $`node ${cli} add color-picker --cwd ${project} --yes`;
  }

  const missing =
    await $`node ${cli} add release-smoke-missing --cwd ${project} --yes`.nothrow();

  assert.notEqual(missing.exitCode, 0);

  await $`bun run build`.cwd(project);
}

const [packageFile, legacyRegistry] = process.argv.slice(2);

assert.ok(packageFile, "Pass the path to the packed CLI");

const { version } = await Bun.file("packages/cli/package.json").json();
const scratch = await mkdtemp(join(tmpdir(), "kira-release-"));
const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });

try {
  const origin = server.resolvedUrls?.local[0];
  assert.ok(origin);
  const base = origin.replace(/\/$/, "");
  await verifySite(base);
  await verifyConsumer(
    scratch,
    resolve(packageFile),
    version,
    base,
    legacyRegistry,
  );
} finally {
  await server.close();
  await rm(scratch, { recursive: true, force: true });
}
