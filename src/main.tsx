import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import "./index.css";
import "./lib/docs-fonts";
import { initFontPreview } from "./lib/font-preview";
import { router } from "./router";

initFontPreview();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
