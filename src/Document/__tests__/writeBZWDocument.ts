import dedent from 'dedent';

import { newIBox } from '../Obstacles/Box';
import { newIMesh } from '../Obstacles/Mesh';
import { newIMeshFace } from '../Obstacles/MeshFace';
import { newIPyramid } from '../Obstacles/Pyramid';
import { ITeleporter, newITeleporter } from '../Obstacles/Teleporter';
import {
  ITeleporterLink,
  newITeleporterLink,
  TeleporterSide,
} from '../Obstacles/TeleporterLink';
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

  it('should output the world object and boxes', () => {
    const world: IWorld = {
      ...newIWorld(),
      flagheight: 10.75,
      children: {
        'box-1': {
          ...newIBox(),
        },
        'box-2': {
          ...newIBox(),
          position: [5, 10, 15],
          size: [15, 10, 1],
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
      flagheight 10.75
    end

    box
      position 0 0 0
      size 5 5 5
    end

    box
      position 5 10 15
      size 15 10 1
      rotation 45
    end
    `);
  });

  it('should print out the world object and pyramids', () => {
    const world: IWorld = {
      ...newIWorld(),
      freectfspawns: true,
      children: {
        'pyra-1': {
          ...newIPyramid(),
        },
        'pyra-2': {
          ...newIPyramid(),
          position: [5, 10, 0],
          size: [15, 10, 5],
          rotation: 75,
          flipz: true,
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
      freectfspawns
    end

    pyramid
      position 0 0 0
      size 7 7 12
    end

    pyramid
      position 5 10 0
      size 15 10 5
      rotation 75
      flipz
    end
    `);
  });

  it('should print out the world object and teleporters', () => {
    const world: IWorld = {
      ...newIWorld(),
      size: 400,
      children: {
        tele0: {
          ...newITeleporter(),
          name: 'tele0',
          position: [390.0, 390.0, 0.0],
          size: [0.56, 4.48, 27.7],
          rotation: 45,
          border: 1.12,
        } as ITeleporter,
        tele2: {
          ...newITeleporter(),
          name: 'tele2',
          position: [390.0, 390.0, 30.0],
          size: [0.56, 4.48, 15.0],
          rotation: 45,
          border: 1.12,
        } as ITeleporter,
        'link-0': {
          ...newITeleporterLink(),
          from: {
            name: 'tele0',
            side: TeleporterSide.Forward,
          },
          to: {
            name: 'tele2',
            side: TeleporterSide.Forward,
          },
        } as ITeleporterLink,
        'link-1': {
          ...newITeleporterLink(),
          from: {
            name: 'tele0',
            side: TeleporterSide.Backward,
          },
          to: {
            name: 'tele2',
            side: TeleporterSide.Backward,
          },
        } as ITeleporterLink,
        'link-2': {
          ...newITeleporterLink(),
          from: {
            name: 'tele2',
            side: TeleporterSide.Forward,
          },
          to: {
            name: 'tele0',
            side: TeleporterSide.Forward,
          },
        } as ITeleporterLink,
        'link-3': {
          ...newITeleporterLink(),
          from: {
            name: 'tele2',
            side: TeleporterSide.Backward,
          },
          to: {
            name: 'tele0',
            side: TeleporterSide.Backward,
          },
        } as ITeleporterLink,
      },
    };
    const actual = writeBZWDocument(world, {
      indentation: 'space',
      indentationWidth: 2,
    });

    expect(actual).toEqual(dedent`
    world
      size 400
    end

    teleporter tele0
      position 390 390 0
      size 0.56 4.48 27.7
      rotation 45
      border 1.12
    end

    teleporter tele2
      position 390 390 30
      size 0.56 4.48 15
      rotation 45
      border 1.12
    end

    link
      from tele0:f
      to tele2:f
    end

    link
      from tele0:b
      to tele2:b
    end

    link
      from tele2:f
      to tele0:f
    end

    link
      from tele2:b
      to tele0:b
    end
    `);
  });

  it('should print out the world object and a mesh with its faces', () => {
    const world: IWorld = {
      ...newIWorld(),
      children: {
        mesh: {
          ...newIMesh(),
          name: 'example_mesh',
          inside: [[5.5, 4.5, 1.2]],
          outside: [[0, 0, 1000]],
          vertex: [[100, 200, 300]],
          normal: [[1.0, 0, 0]],
          texcoord: [[0.1, 0.75]],
          shift: [[0, 0, 0]],
          scale: [[1, 1, 1]],
          shear: [[0, 0, 0]],
          spin: [[45, 0, 0, 0]],
          phydrv: 'example_phydrv',
          smoothbounce: true,
          noclusters: true,
          children: {
            'face-1': {
              ...newIMeshFace(),
              vertices: [1, 4, 0, 3, 5],
              normals: [2, 6, 0, 4, 7],
              texcoords: [0, 3, 2, 4, 9],
              phydrv: 'example_phydrv',
              smoothbounce: true,
              noclusters: true,
              drivethrough: true,
              shootthrough: true,
              matref: 'red_base_top',
            },
            'face-2': {
              ...newIMeshFace(),
              vertices: [5, 3, 0, 4, 1],
              normals: [2, 6, 0, 4, 7],
              texcoords: [0, 3, 2, 4, 9],
              phydrv: 'example_phydrv',
              smoothbounce: true,
              noclusters: true,
              drivethrough: true,
              shootthrough: true,
              matref: 'blue_base_top',
            },
          },
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

    mesh
      name example_mesh
      inside 5.5 4.5 1.2
      outside 0 0 1000
      vertex 100 200 300
      normal 1 0 0
      texcoord 0.1 0.75
      shift 0 0 0
      scale 1 1 1
      shear 0 0 0
      spin 45 0 0 0
      phydrv example_phydrv
      smoothbounce
      noclusters

      face
        vertices 1 4 0 3 5
        normals 2 6 0 4 7
        texcoords 0 3 2 4 9
        phydrv example_phydrv
        smoothbounce
        noclusters
        drivethrough
        shootthrough
        matref red_base_top
      endface

      face
        vertices 5 3 0 4 1
        normals 2 6 0 4 7
        texcoords 0 3 2 4 9
        phydrv example_phydrv
        smoothbounce
        noclusters
        drivethrough
        shootthrough
        matref blue_base_top
      endface
    end
    `);
  });
});
