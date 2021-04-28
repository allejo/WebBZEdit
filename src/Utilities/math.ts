/**
 * Convert from degrees to radians.
 *
 * The BZW format uses degrees while WebGL uses radians
 *
 * @param degrees
 */
export function deg2rad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
