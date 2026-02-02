import { cva } from "class-variance-authority";

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
  }
);

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
  }
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
  }
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
  }
);

export const faceDetectionVariants = cva(
  "absolute inset-0 pointer-events-none",
  {
    variants: {
      showGuide: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      showGuide: true,
    },
  }
);

export const idCardScannerVariants = cva(
  "absolute inset-0 flex flex-col items-center justify-center",
  {
    variants: {
      state: {
        idle: "",
        scanning: "",
        processing: "",
        success: "",
        error: "",
      },
    },
    defaultVariants: {
      state: "idle",
    },
  }
);

export const livenessCheckVariants = cva(
  "absolute inset-0 flex flex-col items-center justify-center",
  {
    variants: {
      state: {
        idle: "",
        active: "",
        completed: "",
        failed: "",
      },
    },
    defaultVariants: {
      state: "idle",
    },
  }
);

export const kycFlowVariants = cva(
  "relative w-full max-w-2xl mx-auto bg-black rounded-xl overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-96",
        default: "h-[500px]",
        lg: "h-[600px]",
        fullscreen: "fixed inset-0 z-50",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);
