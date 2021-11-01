import { newIBox } from '../Obstacles/Box';
import { newIMesh } from '../Obstacles/Mesh';
import { newIMeshFace } from '../Obstacles/MeshFace';
import { IOptions, newIOptions } from '../Obstacles/Option';
import { newIPyramid } from '../Obstacles/Pyramid';
import { ITeleporter, newITeleporter } from '../Obstacles/Teleporter';
import {
  ITeleporterLink,
  newITeleporterLink,
  TeleporterSide,
} from '../Obstacles/TeleporterLink';
import { IWorld, newIWorld } from '../Obstacles/World';
import { bzw } from '../testingUtilities';
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

    expect(actual).toEqual(bzw`
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

    expect(actual).toEqual(bzw`
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

    expect(actual).toEqual(bzw`
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

    expect(actual).toEqual(bzw`
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

    expect(actual).toEqual(bzw`
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

  it('should print out the `options` object', () => {
    const world: IWorld = {
      ...newIWorld(),
      children: {
        options01: {
          ...newIOptions(),
          '-a': {
            linear: 50,
            angular: 38,
          },
          '-admsg': ['Welcome to my wonder map!', '  by blast'],
          '-autoteam': true,
          '-c': true,
          '+f': [
            {
              flag: 'G',
              count: 10,
            },
            {
              flag: 'US',
              count: 50,
            },
            {
              flag: 'good',
              count: 1,
            },
          ],
          '-f': ['bad'],
          '-fb': true,
          '-handicap': true,
          '-j': true,
          '-loadplugin': [
            '/usr/local/lib/bzflag/AllHandsOnDeck.so',
            '/usr/local/lib/bzflag/VPNBlocker.so',
          ],
          '-maxidle': 180,
          '-mp': {
            rogue: 0,
            red: 10,
            green: 0,
            blue: 10,
            purple: 0,
            observer: 50,
          },
          '-mps': 100,
          '-ms': 5,
          '-mts': 512,
          '-noteamkills': true,
          '-offa': true,
          '+r': true,
          '-rabbit': 'killer',
          '+s': 5,
          '-s': 10,
          '-sa': true,
          '-sb': true,
          '-set': {
            _gravity: '10',
            _skyColor: 'red',
          },
          '-sl': [
            {
              flag: 'G',
              num: 1,
            },
            {
              flag: 'US',
              num: 30,
            },
          ],
          '-srvmsg': ["Here's an on-join message sent to you", '  by blast'],
          '-st': 30,
          '-sw': 5,
          '-tk': true,
        } as IOptions,
      },
    };
    const actual = writeBZWDocument(world, {
      indentation: 'space',
      indentationWidth: 2,
    });

    expect(actual).toEqual(bzw`
      world
        size 800
      end

      options
        -a 50 38
        -admsg "Welcome to my wonder map!"
        -admsg "  by blast"
        -autoteam
        -c
        +f G{10}
        +f US{50}
        +f good
        -f bad
        -fb
        -handicap
        -j
        -loadplugin /usr/local/lib/bzflag/AllHandsOnDeck.so
        -loadplugin /usr/local/lib/bzflag/VPNBlocker.so
        -maxidle 180
        -mp 0,10,0,10,0,50
        -mps 100
        -ms 5
        -mts 512
        -noteamkills
        -offa
        +r
        -rabbit killer
        +s 5
        -s 10
        -sa
        -sb
        -set _gravity 10
        -set _skyColor red
        -sl G 1
        -sl US 30
        -srvmsg "Here's an on-join message sent to you"
        -srvmsg "  by blast"
        -st 30
        -sw 5
        -tk
      end
    `);
  });
});
