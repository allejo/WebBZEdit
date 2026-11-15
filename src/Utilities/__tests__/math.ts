import { safeValueInRange } from '../math';

describe('Math Utility Functions', () => {
  describe('safeValueInRange', () => {
    const data = [
      [370, 0, 360, false, 360],
      [15, 0, 360, false, 15],
      [-1, 0, 360, false, 0],
      [-450, 0, 360, false, 0],
      [0, 0, 360, false, 0],
      [360, 0, 360, false, 360],
      [350, 360, 400, false, 360],
      [450, 360, 400, false, 400],
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
