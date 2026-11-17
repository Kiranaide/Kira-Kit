import { describe, expect, it } from "vitest";
import { toItemAddress } from "../src/lib/namespace";

describe("toItemAddress", () => {
  it("namespaces bare names", () => {
    expect(toItemAddress("button")).toBe("@kira-kit/button");
    expect(toItemAddress("use-media-query")).toBe("@kira-kit/use-media-query");
  });

  it("passes already-namespaced names through", () => {
    expect(toItemAddress("@kira-kit/button")).toBe("@kira-kit/button");
  });

  it("passes shadcn registry names through", () => {
    expect(toItemAddress("@shadcn/button")).toBe("@shadcn/button");
  });

  it("passes URLs and local paths through", () => {
    expect(toItemAddress("https://example.com/r/button.json")).toBe(
      "https://example.com/r/button.json",
    );
    expect(toItemAddress("./registry/button.json")).toBe(
      "./registry/button.json",
    );
  });
});
