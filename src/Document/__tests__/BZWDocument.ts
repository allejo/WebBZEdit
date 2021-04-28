import { BZWDocument } from '../BZWDocument';
import { Box } from '../Obstacles/Box';
import { Pyramid } from '../Obstacles/Pyramid';
import { Teleporter } from '../Obstacles/Teleporter';
import { Zone } from '../Obstacles/Zone';
import { Base } from '../Obstacles/Base';

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

  it('should handle a base', () => {
    const bzwBody = `\
    base
     position 10 20 30
     rotation 45
     size 1 2 3
     color 1
     oncap SW
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const base: Base = parser.objects.pop() as Base;

    expect(base.attributes).toEqual({
      position: [10, 20, 30],
      rotation: 45,
      size: [1, 2, 3],
      color: 1,
      oncap: "SW",
    });
  });

  it('should handle a zone', () => {
    const bzwBody = `\
    zone 
      name example_zone
      position 0.0 0.0 0.0
      size 1.0 1.0 1.0
      rotation 0.0

      zoneflag GM 2
      zoneflag OO

      flag L
      flag SW
      flag good
      flag bad
      team 0 1 2 3 4
      safety 1 2 3 4
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const zone: Zone = parser.objects.pop() as Zone;

    expect(zone.attributes).toEqual({
      name: 'example_zone',
      position: [0.0, 0.0, 0.0],
      size: [1.0, 1.0, 1.0],
      rotation: 0.0,
      zoneflag: ["GM 2", "OO"],
      flag: ["L", "SW", "good", "bad"],
      team: [0, 1, 2, 3, 4],
      safety: [1, 2, 3, 4],
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
