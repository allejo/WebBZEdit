import dedent from 'dedent';

import { newIBox } from '../Obstacles/Box';
import { IWorld, newIWorld } from '../Obstacles/World';
import { writeBZWDocument } from '../writeBZWDocument';

describe('BZW Document Writer', () => {
  it('should output the world object', () => {
    const world: IWorld = {
      ...newIWorld(),
      nowalls: true,
    };
    const actual = writeBZWDocument(world, {
      indentation: 'space',
      indentationWidth: 2,
    });

    expect(actual).toEqual(dedent`
    world
      size 800
      nowalls
    end
    `);
  });

  it('should output the world object plus a box', () => {
    const world: IWorld = {
      ...newIWorld(),
      children: {
        'box-1': {
          ...newIBox(),
          rotation: 45,
        },
      },
    };
    const actual = writeBZWDocument(world, {
      indentation: 'space',
      indentationWidth: 2,
    });

    expect(actual).toEqual(dedent`
    world
      size 800
    end

    box
      position 0 0 0
      size 5 5 5
      rotation 45
    end
    `);
  });
});
