import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  KiraSkeleton,
  SkeletonBone,
  SkeletonLines,
  SkeletonRoot,
} from "../src/components/ui/skeleton";
import {
  KiraTimeline,
  Timeline,
  TimelineTime,
} from "../src/components/ui/timeline";

test("invalid timeline dates render a fallback without an invalid datetime", () => {
  const html = renderToStaticMarkup(<TimelineTime datetime="invalid" />);

  expect(html).toContain("Date unavailable");
  expect(html).not.toContain("datetime=");
});

test("relative time distinguishes future and past events", () => {
  const now = "2026-10-01T12:00:00Z";

  expect(
    renderToStaticMarkup(
      <TimelineTime
        datetime="2026-10-01T14:00:00Z"
        now={now}
        relative
        locale="en"
      />,
    ),
  ).toContain("in 2 hours");
  expect(
    renderToStaticMarkup(
      <TimelineTime
        datetime="2026-10-01T10:00:00Z"
        now={now}
        relative
        locale="en"
      />,
    ),
  ).toContain("2 hours ago");
});

test("custom grouping accepts object prototype property names", () => {
  const html = renderToStaticMarkup(
    <Timeline
      items={[
        { id: "first", title: "First" },
        { id: "second", title: "Second" },
      ]}
      groupBy={() => "__proto__"}
    />,
  );

  expect(html.match(/data-slot="timeline-group-heading"/g)).toHaveLength(1);
  expect(html).toContain('aria-setsize="2"');
  expect(html).toContain('aria-posinset="2"');
});

test("timeline refresh retains event history and announces loading once", () => {
  const html = renderToStaticMarkup(
    <KiraTimeline loading items={[{ id: "event", title: "Existing event" }]} />,
  );

  expect(html).toContain("Existing event");
  expect(html).toContain('aria-busy="true"');
  expect(html.match(/role="status"/g)).toHaveLength(1);
});

test("disabled shimmer has no moving overlay or leaked motion props", () => {
  const html = renderToStaticMarkup(
    <SkeletonBone variant="shimmer" animated={false} duration={0} />,
  );

  expect(html).not.toContain('data-slot="skeleton-shimmer"');
  expect(html).not.toContain("animated=");
  expect(html).not.toContain("duration=");
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain('inert=""');
});

test("line count is finite and grouped placeholders announce once", () => {
  const html = renderToStaticMarkup(
    <SkeletonRoot>
      <SkeletonLines count={Infinity} />
      <SkeletonLines count={-1} />
    </SkeletonRoot>,
  );

  expect(html.match(/data-slot="skeleton-text"/g)).toHaveLength(3);
  expect(html.match(/role="status"/g)).toHaveLength(1);
});

test("loaded skeleton content is exposed and initially loading content is withheld", () => {
  expect(
    renderToStaticMarkup(
      <KiraSkeleton loading={false}>
        <button>Loaded action</button>
      </KiraSkeleton>,
    ),
  ).toContain("Loaded action");
  expect(
    renderToStaticMarkup(
      <KiraSkeleton loading>
        <button>Unavailable action</button>
      </KiraSkeleton>,
    ),
  ).not.toContain("Unavailable action");
});
