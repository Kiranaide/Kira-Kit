import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ScrollArea } from "../src/components/ui/scroll-area";

function viewportMarkup(element: React.ReactElement) {
  return renderToStaticMarkup(element).match(
    /<div[^>]*data-slot="scroll-area-viewport"[^>]*>/,
  )?.[0];
}

test("preserves Base UI's automatic tab order when tabIndex is omitted", () => {
  const viewport = viewportMarkup(<ScrollArea>Activity</ScrollArea>);

  expect(viewport).toBeDefined();
  expect(viewport).toContain('tabindex="-1"');
});

test("preserves explicit viewport tab order overrides", () => {
  expect(
    viewportMarkup(<ScrollArea tabIndex={0}>Activity</ScrollArea>),
  ).toContain('tabindex="0"');
  expect(
    viewportMarkup(
      <ScrollArea tabIndex={0} viewportProps={{ tabIndex: -1 }}>
        Activity
      </ScrollArea>,
    ),
  ).toContain('tabindex="-1"');
});
