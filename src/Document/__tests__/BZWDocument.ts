import { BZWDocument } from '../BZWDocument';
import { Box } from '../Obstacles/Box';
import { Pyramid } from '../Obstacles/Pyramid';
import { Teleporter } from '../Obstacles/Teleporter';

describe('BZW Document Parser', () => {
  it('should handle a box', () => {
    const bzwBody = `\
    box
      position 5 10 15
      size 2 7 1
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const box: Box = parser.objects.pop() as Box;

    expect(box.attributes).toEqual({
      position: [5, 10, 15],
      size: [2, 7, 1],
    });
  });

  it('should handle a pyramid', () => {
    const bzwBody = `\
    pyramid
      position 3 4 5
      size 10 5 7
      zflip
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const pyramid: Pyramid = parser.objects.pop() as Pyramid;

    expect(pyramid.attributes).toEqual({
      position: [3, 4, 5],
      size: [10, 5, 7],
      zflip: true,
    });
  });

  it('should handle a teleporter', () => {
    const bzwBody = `\
    teleporter tele0
      position 0 0 10
      size 0.125 5 20
      rotation 45
      border 1.12
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const teleporter: Teleporter = parser.objects.pop() as Teleporter;

    expect(teleporter.attributes).toEqual({
      name: 'tele0',
      position: [0, 0, 10],
      size: [0.125, 5, 20],
      rotation: 45,
      border: 1.12,
    });
  });
});
