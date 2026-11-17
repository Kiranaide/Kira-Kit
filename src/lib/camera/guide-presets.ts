/**
 * Camera Guide Presets
 * Pre-configured guide configurations for common use cases
 *
 * @2025-2026 Best Practices
 * - Portrait and document framing
 * - Photography composition
 * - Barcode/QR positioning
 */

import type {
  CameraGuideConfig,
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- This imported public type describes camera geometry.
  CameraGuideShape,
  CameraGuideCornerStyle,
} from "@/lib/camera/types";

export type GuidePreset =
  // Portraits and documents
  | "face-oval"
  | "face-circle"
  | "passport-photo"
  | "id-front"
  | "id-back"
  | "passport"
  | "drivers-license"
  // Document Scanning
  | "a4-portrait"
  | "a4-landscape"
  | "letter-portrait"
  | "letter-landscape"
  | "receipt"
  | "business-card"
  | "check"
  // Barcode/QR
  | "barcode"
  | "qr-code"
  | "qr-square"
  // Photography
  | "square"
  | "portrait-3x4"
  | "landscape-4x3"
  | "wide-16x9"
  // Custom
  | "custom";

interface GuidePresetConfig {
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Public camera geometry types preserve compatibility.
  shape: CameraGuideShape;
  aspectRatio?: number;
  width?: string | number;
  height?: string | number;
  strokeWidth?: number;
  cornerStyle?: CameraGuideCornerStyle;
  cornerSize?: number;
  defaultInstruction: string;
  minWidth?: number;
  minHeight?: number;
}

/* oxlint-disable anti-slop/no-shape-in-symbol-names -- Preset keys preserve the public geometric shape contract. */
// Face/Identity guides
const FACE_GUIDES = {
  "face-oval": {
    shape: "oval",
    aspectRatio: 0.78,
    width: "60%",
    strokeWidth: 3,
    cornerStyle: "none",
    defaultInstruction: "Position your face in the oval",
  },
  "face-circle": {
    shape: "circle",
    aspectRatio: 1,
    width: "65%",
    strokeWidth: 3,
    cornerStyle: "none",
    defaultInstruction: "Center your face in the circle",
  },
  "passport-photo": {
    shape: "rectangle",
    aspectRatio: 0.77, // 35mm x 45mm
    width: "55%",
    strokeWidth: 3,
    cornerStyle: "none",
    defaultInstruction: "Align your face with the passport frame",
  },
} satisfies Record<string, GuidePresetConfig>;

// ID/Document guides
const ID_GUIDES = {
  "id-front": {
    shape: "rectangle",
    aspectRatio: 1.586, // ID-1: 85.6mm x 53.98mm
    width: "85%",
    strokeWidth: 4,
    cornerStyle: "bracket",
    cornerSize: 24,
    defaultInstruction: "Align the front of your ID card",
  },
  "id-back": {
    shape: "rectangle",
    aspectRatio: 1.586,
    width: "85%",
    strokeWidth: 4,
    cornerStyle: "bracket",
    cornerSize: 24,
    defaultInstruction: "Align the back of your ID card",
  },
  passport: {
    shape: "rectangle",
    aspectRatio: 1.42, // B7 format
    width: "80%",
    strokeWidth: 4,
    cornerStyle: "bracket",
    cornerSize: 28,
    defaultInstruction: "Align your passport within the frame",
  },
  "drivers-license": {
    shape: "rectangle",
    aspectRatio: 1.586,
    width: "85%",
    strokeWidth: 4,
    cornerStyle: "bracket",
    cornerSize: 24,
    defaultInstruction: "Align your driver's license",
  },
} satisfies Record<string, GuidePresetConfig>;

// Paper document guides
const PAPER_GUIDES = {
  "a4-portrait": {
    shape: "rectangle",
    aspectRatio: 1 / 1.414, // A4 ratio
    width: "90%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 20,
    defaultInstruction: "Align the A4 document",
  },
  "a4-landscape": {
    shape: "rectangle",
    aspectRatio: 1.414,
    width: "95%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 20,
    defaultInstruction: "Align the A4 document",
  },
  "letter-portrait": {
    shape: "rectangle",
    aspectRatio: 1 / 1.294, // US Letter ratio
    width: "90%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 20,
    defaultInstruction: "Align the letter document",
  },
  "letter-landscape": {
    shape: "rectangle",
    aspectRatio: 1.294,
    width: "95%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 20,
    defaultInstruction: "Align the letter document",
  },
  receipt: {
    shape: "rectangle",
    aspectRatio: 0.3, // Long narrow receipt
    width: "70%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 16,
    defaultInstruction: "Align the receipt within the frame",
  },
  "business-card": {
    shape: "rectangle",
    aspectRatio: 1.75, // Standard business card
    width: "75%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 18,
    defaultInstruction: "Align the business card",
  },
  check: {
    shape: "rectangle",
    aspectRatio: 2.2, // Standard check
    width: "90%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 20,
    defaultInstruction: "Align the check within the frame",
  },
} satisfies Record<string, GuidePresetConfig>;

// Barcode/QR guides
const CODE_GUIDES = {
  barcode: {
    shape: "rectangle",
    aspectRatio: 3,
    width: "85%",
    height: "20%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 20,
    defaultInstruction: "Center the barcode in the frame",
  },
  "qr-code": {
    shape: "square",
    aspectRatio: 1,
    width: "60%",
    strokeWidth: 3,
    cornerStyle: "bracket",
    cornerSize: 24,
    defaultInstruction: "Center the QR code in the frame",
  },
  "qr-square": {
    shape: "square",
    aspectRatio: 1,
    width: "50%",
    strokeWidth: 4,
    cornerStyle: "bracket",
    cornerSize: 28,
    defaultInstruction: "Fit the QR code inside the square",
  },
} satisfies Record<string, GuidePresetConfig>;

// Photography guides
const PHOTO_GUIDES = {
  square: {
    shape: "square",
    aspectRatio: 1,
    width: "70%",
    strokeWidth: 2,
    cornerStyle: "none",
    defaultInstruction: "Compose your shot",
  },
  "portrait-3x4": {
    shape: "rectangle",
    aspectRatio: 3 / 4,
    width: "65%",
    strokeWidth: 2,
    cornerStyle: "none",
    defaultInstruction: "Compose your portrait",
  },
  "landscape-4x3": {
    shape: "rectangle",
    aspectRatio: 4 / 3,
    width: "85%",
    strokeWidth: 2,
    cornerStyle: "none",
    defaultInstruction: "Compose your landscape",
  },
  "wide-16x9": {
    shape: "rectangle",
    aspectRatio: 16 / 9,
    width: "95%",
    strokeWidth: 2,
    cornerStyle: "none",
    defaultInstruction: "Compose your wide shot",
  },
} satisfies Record<string, GuidePresetConfig>;

// Combine all presets
export const GUIDE_PRESETS = {
  "face-oval": FACE_GUIDES["face-oval"],
  "face-circle": FACE_GUIDES["face-circle"],
  "passport-photo": FACE_GUIDES["passport-photo"],
  "id-front": ID_GUIDES["id-front"],
  "id-back": ID_GUIDES["id-back"],
  passport: ID_GUIDES.passport,
  "drivers-license": ID_GUIDES["drivers-license"],
  "a4-portrait": PAPER_GUIDES["a4-portrait"],
  "a4-landscape": PAPER_GUIDES["a4-landscape"],
  "letter-portrait": PAPER_GUIDES["letter-portrait"],
  "letter-landscape": PAPER_GUIDES["letter-landscape"],
  receipt: PAPER_GUIDES.receipt,
  "business-card": PAPER_GUIDES["business-card"],
  check: PAPER_GUIDES.check,
  barcode: CODE_GUIDES.barcode,
  "qr-code": CODE_GUIDES["qr-code"],
  "qr-square": CODE_GUIDES["qr-square"],
  square: PHOTO_GUIDES.square,
  "portrait-3x4": PHOTO_GUIDES["portrait-3x4"],
  "landscape-4x3": PHOTO_GUIDES["landscape-4x3"],
  "wide-16x9": PHOTO_GUIDES["wide-16x9"],
  custom: {
    shape: "rectangle",
    defaultInstruction: "Align your subject",
  },
} satisfies Record<GuidePreset, GuidePresetConfig>;

// Helper function to get preset config
export function getGuidePreset(preset: GuidePreset): GuidePresetConfig {
  return GUIDE_PRESETS[preset] || GUIDE_PRESETS.custom;
}

// Helper function to merge preset with custom config
export function mergeGuideConfig(
  preset: GuidePreset,
  customConfig?: Partial<CameraGuideConfig>,
): CameraGuideConfig {
  const presetConfig = getGuidePreset(preset);

  return {
    shape: presetConfig.shape,
    aspectRatio: presetConfig.aspectRatio,
    width: presetConfig.width,
    height: presetConfig.height,
    strokeWidth: presetConfig.strokeWidth,
    cornerStyle: presetConfig.cornerStyle,
    cornerSize: presetConfig.cornerSize,
    strokeColor: "#ffffff",
    alignedColor: "#4ade80",
    misalignedColor: "#fbbf24",
    fillColor: "rgba(0, 0, 0, 0.3)",
    animation: "pulse",
    animationDuration: 2000,
    ...customConfig,
  };
}

/* oxlint-enable anti-slop/no-shape-in-symbol-names */
// Preset categories for UI organization
export const GUIDE_PRESET_CATEGORIES = {
  identity: {
    label: "Identity",
    presets: [
      "face-oval",
      "face-circle",
      "passport-photo",
      "id-front",
      "id-back",
      "passport",
      "drivers-license",
    ] satisfies GuidePreset[],
  },
  documents: {
    label: "Documents",
    presets: [
      "a4-portrait",
      "a4-landscape",
      "letter-portrait",
      "letter-landscape",
      "receipt",
      "business-card",
      "check",
    ] satisfies GuidePreset[],
  },
  codes: {
    label: "Codes",
    presets: ["barcode", "qr-code", "qr-square"] satisfies GuidePreset[],
  },
  photography: {
    label: "Photography",
    presets: [
      "square",
      "portrait-3x4",
      "landscape-4x3",
      "wide-16x9",
    ] satisfies GuidePreset[],
  },
} as const;

export type GuidePresetCategory = keyof typeof GUIDE_PRESET_CATEGORIES;
