import { safeValueInRange } from '../math';

describe('Math Utility Functions', () => {
  describe('safeValueInRange', () => {
    const data = [
      [15, 0, 360, false, 15],
      [-1, 0, 360, false, 0],
      [-450, 0, 360, false, 0],
      [0, 0, 360, false, 0],
      [350, 360, 400, false, 360],
      [15, 0, 360, true, 15],
      [-1, 0, 360, true, 359],
      [-450, 0, 360, true, 270],
      [0, 0, 360, true, 0],
      [360, 0, 360, true, 0],
      [370, 0, 360, true, 10],
      [365, 0, 360, true, 5],
      [720, 0, 360, true, 0],
      [730, 0, 360, true, 10],
    ] as const;

    data.forEach(([actual, min, max, cycle, expected]) => {
      it(`should return ${expected} when given ${actual} with a range of ${min}-${max} and cycle=${cycle}`, () => {
        expect(safeValueInRange(actual, min, max, cycle)).toEqual(expected);
      });
    });

    it('should keep values below `max` when it is exclusive', () => {
      expect(safeValueInRange(360, 0, 360)).toBeLessThan(360);
      expect(safeValueInRange(370, 0, 360)).toBeLessThan(360);
      expect(safeValueInRange(450, 360, 400)).toBeGreaterThanOrEqual(360);
      expect(safeValueInRange(450, 360, 400)).toBeLessThan(400);
    });

    it('should keep values below `max` for large ranges', () => {
      const max = 1e300;

      expect(safeValueInRange(max, 0, max)).toBeLessThan(max);
    });

    describe('with inclusive bounds', () => {
      it('should allow `max` when not cycling', () => {
        expect(safeValueInRange(360, 0, 360, false, true)).toEqual(360);
        expect(safeValueInRange(400, 0, 360, false, true)).toEqual(360);
      });

      it('should cycle through both bounds', () => {
        expect(safeValueInRange(359, 1, 360, true, true)).toEqual(359);
        expect(safeValueInRange(360, 1, 360, true, true)).toEqual(360);
        expect(safeValueInRange(361, 1, 360, true, true)).toEqual(1);
        expect(safeValueInRange(362, 1, 360, true, true)).toEqual(2);
      });
    });

    describe('with exclusive bounds', () => {
      it('should cycle through the upper bound', () => {
        expect(safeValueInRange(358, 0, 360, true, false)).toEqual(358);
        expect(safeValueInRange(359, 0, 360, true, false)).toEqual(359);
        expect(safeValueInRange(360, 0, 360, true, false)).toEqual(0);
        expect(safeValueInRange(361, 0, 360, true, false)).toEqual(1);
      });
    });

    describe('with optional bounds', () => {
      it('should return the value when neither bound is set', () => {
        expect(safeValueInRange(-5)).toEqual(-5);
        expect(safeValueInRange(5)).toEqual(5);
      });

      it('should only clamp to `min` when only `min` is set', () => {
        expect(safeValueInRange(-5, 0)).toEqual(0);
        expect(safeValueInRange(5, 0)).toEqual(5);
      });

      it('should only clamp to `max` when only `max` is set', () => {
        expect(safeValueInRange(400, undefined, 360)).toEqual(360);
        expect(safeValueInRange(5, undefined, 360)).toEqual(5);
      });

      it('should throw when cycling without both bounds', () => {
        expect(() => safeValueInRange(5, 0, undefined, true)).toThrow();
        expect(() => safeValueInRange(5, undefined, 360, true)).toThrow();
        expect(() => safeValueInRange(5, undefined, undefined, true)).toThrow();
      });
    });
  });
});
