import { cva } from "class-variance-authority";

/* oxlint-disable anti-slop/no-shape-in-symbol-names -- CVA shape variants are public geometric styling props. */
export const cameraVariants = cva(
  "relative overflow-hidden rounded-xl bg-black",
  {
    variants: {
      size: {
        sm: "w-64 h-48",
        default: "w-96 h-72",
        lg: "w-[480px] h-[360px]",
        fullscreen: "fixed inset-0 w-full h-full z-50",
      },
      shape: {
        rectangle: "rounded-xl",
        square: "rounded-xl aspect-square",
        rounded: "rounded-2xl",
        circle: "rounded-full aspect-square",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "rectangle",
    },
  },
);

/* oxlint-enable anti-slop/no-shape-in-symbol-names */
export const cameraControlsVariants = cva(
  "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-full bg-black/50 backdrop-blur-sm",
  {
    variants: {
      position: {
        bottom: "bottom-4",
        top: "top-4",
      },
    },
    defaultVariants: {
      position: "bottom",
    },
  },
);

export const cameraPermissionsVariants = cva(
  "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 text-white p-6",
  {
    variants: {
      variant: {
        requesting: "",
        denied: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "requesting",
    },
  },
);

export const cameraGuideVariants = cva(
  "absolute inset-0 flex items-center justify-center pointer-events-none",
  {
    variants: {
      variant: {
        face: "",
        document: "",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "face",
    },
  },
);
