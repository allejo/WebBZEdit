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
 * Return a value that is within the specified range.
 *
 * If `value` is less than `min` (inclusive) or greater than `max` (exclusive),
 * then it will return the respective bounds. Otherwise, it will return the
 * value itself.
 *
 * @param val
 * @param min
 * @param max
 * @param cycle If true, the value will be cycled within the range instead of clamped.
 * @param inclusive If true, the bounds are inclusive.
 */
export function safeValueInRange(
  val: number,
  min?: number,
  max?: number,
  cycle = false,
  inclusive = false,
): number {
  if (min == null || max == null) {
    if (cycle) {
      throw new Error(
        'Cannot cycle values when min or max is undefined. Please provide both min and max.',
      );
    }

    return Math.min(Math.max(val, min ?? -Infinity), max ?? Infinity);
  }

  if (cycle) {
    const span = max - min + (inclusive ? 1 : 0);

    return min + ((((val - min) % span) + span) % span);
  }

  const upper =
    inclusive || !Number.isFinite(max)
      ? max
      : max - Math.max(Number.EPSILON, Math.abs(max) * Number.EPSILON);

  return Math.min(Math.max(val, min), upper);
}
