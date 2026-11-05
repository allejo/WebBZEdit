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

/**
 * Return a value that is within the specified range. If `value` is less than
 * `min` (inclusive) or greater than `max` (inclusive), then it will "cycle"
 * through the numbers and return a value within the specified range.
 *
 * @param val
 * @param min
 * @param max
 */
export function safeValueInRange(
  val: number,
  min: number,
  max: number,
): number {
  if (min <= val && val <= max) {
    return val;
  }

  if (val <= min) {
    return min;
  }

  return max;
}
