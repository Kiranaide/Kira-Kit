import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeBlock } from "../src/components/ui/code-block";
import {
  AnnouncementBar,
  AnnouncementBarCountdown,
  AnnouncementBarProgress,
  AnnouncementRotator,
} from "../src/components/ui/announcement-bar";

test("code tabs share a toolbar and avoid the filled primary navigation style", () => {
  const html = renderToStaticMarkup(
    <CodeBlock
      code="const trail = 1;"
      filename="trail.ts"
      preview={<button type="button">Save trail</button>}
    />,
  );

  expect(html).toContain('data-slot="code-block-preview-tabs"');
  expect(html).toContain('data-slot="code-block-toolbar-controls"');
  expect(html).toContain('data-slot="code-block-formatted-tab"');
  expect(html).toContain('data-slot="code-block-source-tab"');
  expect(html).not.toContain("data-[active]:bg-background");
});

test("native code keeps blank rows and text line endings without visible extra newlines", () => {
  const html = renderToStaticMarkup(
    <CodeBlock
      code={"const trail = 1;\n\nconst saved = true;"}
      showLineNumbers={false}
    />,
  );

  expect(html.match(/data-slot="code-block-line"/g)).toHaveLength(3);
  expect(html.match(/data-slot="code-block-line-ending"/g)).toHaveLength(3);
  expect(html).toContain('aria-hidden="true" class="sr-only">\n</span>');
  expect(html).not.toContain("const trail = 1;\n</span>");
});

test("editable blocks initially expose the source editor", () => {
  const html = renderToStaticMarkup(
    <CodeBlock code="const trail=1;" editable editor="plain" />,
  );

  expect(html).toContain('data-slot="code-block-plain-editor"');
  expect(html).toContain("const trail=1;");
});

test("explicit pause exposes resume and suspends progress", () => {
  const html = renderToStaticMarkup(
    <AnnouncementBar autoDismiss={1500} showProgress paused>
      <AnnouncementRotator messages={["Alpine", "Lake"]} />
    </AnnouncementBar>,
  );

  expect(html).toContain("Resume timer");
  expect(html).toContain('aria-label="Resume announcements"');
  expect(html).toContain("animation-play-state:paused");
  expect(html).toContain("scaleX(1)");
});

test("countdown has explicit readable text alongside decorative digit cells", () => {
  // The server snapshot is 0, so `to` reads as remaining time from the epoch:
  // a fixed 90s window instead of a value that drifts with runner load.
  const html = renderToStaticMarkup(
    <AnnouncementBarCountdown to={new Date(90_000)} />,
  );

  expect(html).toContain('class="sr-only"');
  expect(html).toContain('data-slot="announcement-bar-countdown-number"');
  expect(html).not.toContain('aria-label="');
});

test("progress percentages stay finite for invalid input", () => {
  const html = renderToStaticMarkup(
    <AnnouncementBarProgress value={Infinity} />,
  );

  expect(html).toContain('aria-valuenow="0"');
  expect(html).toContain("scaleX(0)");
});
