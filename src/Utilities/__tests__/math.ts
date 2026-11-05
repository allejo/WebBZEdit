import { safeValueInRange } from '../math';

describe('Math Utility Functions', () => {
  describe('safeValueInRange', () => {
    const data = [
      [370, 0, 360, 360],
      [15, 0, 360, 15],
      [-1, 0, 360, 0],
      [-450, 0, 360, 0],
      [360, 0, 360, 360],
      [350, 360, 400, 360],
      [450, 360, 400, 400],
    ];

    data.forEach(([actual, min, max, expected]) => {
      it(`should return ${expected} when given ${actual} with a range of ${min}-${max}`, () => {
        expect(safeValueInRange(actual, min, max)).toEqual(expected);
      });
    });
  });
});
