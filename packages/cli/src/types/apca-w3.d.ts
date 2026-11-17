declare module "apca-w3" {
  export function sRGBtoY(rgb: number[] | string): number;
  export function APCAcontrast(txtY: number, bgY: number): number;
}
