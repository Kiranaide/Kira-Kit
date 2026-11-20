import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    // Preload lazy route chunks on hover/touch intent so most navigations
    // commit before the progress bar's grace period ends.
    defaultPreload: "intent",
    // Native crossfade for real path changes only; search/hash updates stay
    // instant. Browsers without the View Transitions API navigate normally.
    defaultViewTransition: {
      types: ({ pathChanged }) => (pathChanged ? ["route-change"] : false),
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
