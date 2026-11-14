import { safeValueInRange } from '../math';

describe('Math Utility Functions', () => {
  describe('safeValueInRange', () => {
    const data = [
      [370, 0, 360, false, 360],
      [15, 0, 360, false, 15],
      [-1, 0, 360, false, 0],
      [-450, 0, 360, false, 0],
      [360, 0, 360, false, 360],
      [350, 360, 400, false, 360],
      [450, 360, 400, false, 400],
      [370, 0, 360, true, 10],
      [365, 0, 360, true, 5],
      [360, 0, 360, true, 0],
    ] as const;

    data.forEach(([actual, min, max, cycle, expected]) => {
      it(`should return ${expected} when given ${actual} with a range of ${min}-${max} and cycle=${cycle}`, () => {
        expect(safeValueInRange(actual, min, max, cycle)).toEqual(expected);
      });
    });
  });
});
