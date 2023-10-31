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
 * `min` (exclusive) or greater than `max` (inclusive), then it will "cycle"
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
	if (min <= val && val < max) {
		return val;
	}

	const isNegative = val < 0;
	const absValue = Math.abs(val);
	const range = max - min;
	const remainder = absValue % range;

	return isNegative ? max - remainder : min + remainder;
}
