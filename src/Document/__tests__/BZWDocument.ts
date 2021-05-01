import { BZWDocument } from '../BZWDocument';
import { Box } from '../Obstacles/Box';
import { Pyramid } from '../Obstacles/Pyramid';
import { Teleporter } from '../Obstacles/Teleporter';
import { Zone } from '../Obstacles/Zone';
import { Base } from '../Obstacles/Base';
import { Mesh } from '../Obstacles/Mesh';
import { World } from '../Obstacles/World';

describe('BZW Document Parser', () => {
  it('should handle a box', () => {
    const bzwBody = `\
    box
      position 5 10 15
      size 2 7 1
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const box: Box = Object.values(parser.objects).pop() as Box;

    expect(box.position).toEqual([5, 10, 15]);
    expect(box.size).toEqual([2, 7, 1]);
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
    const pyramid: Pyramid = Object.values(parser.objects).pop() as Pyramid;

    expect(pyramid.position).toEqual([3, 4, 5]);
    expect(pyramid.size).toEqual([10, 5, 7]);
    expect(pyramid.zflip).toEqual(true);
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
    const base: Base = Object.values(parser.objects).pop() as Base;

    expect(base.position).toEqual([10, 20, 30]);
    expect(base.rotation).toEqual(45);
    expect(base.size).toEqual([1, 2, 3]);
    expect(base.color).toEqual(1);
    expect(base.oncap).toEqual('SW');
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
    const zone: Zone = Object.values(parser.objects).pop() as Zone;

    expect(zone.name).toEqual('example_zone');
    expect(zone.position).toEqual([0.0, 0.0, 0.0]);
    expect(zone.size).toEqual([1.0, 1.0, 1.0]);
    expect(zone.rotation).toEqual(0.0);
    expect(zone.zoneflag).toEqual(['GM 2', 'OO']);
    expect(zone.flag).toEqual(['L', 'SW', 'good', 'bad']);
    expect(zone.team).toEqual([0, 1, 2, 3, 4]);
    expect(zone.safety).toEqual([1, 2, 3, 4]);
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
    const teleporter: Teleporter = Object.values(
      parser.objects,
    ).pop() as Teleporter;

    expect(teleporter.name).toEqual('tele0');
    expect(teleporter.position).toEqual([0, 0, 10]);
    expect(teleporter.size).toEqual([0.125, 5, 20]);
    expect(teleporter.rotation).toEqual(45);
    expect(teleporter.border).toEqual(1.12);
  });

  it('should handle a mesh', () => {
    const bzwBody = `\
    mesh
      name example_mesh
      inside 5.5 4.5 1.2
      outside 0 0 1000
      vertex 100 200 300
      normal 1.0 0 0
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
        passable
        matref
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
        passable
        matref
      endface
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const mesh: Mesh = Object.values(parser.objects).pop() as Mesh;

    expect(mesh.name).toEqual('example_mesh');
    expect(mesh.inside).toEqual([[5.5, 4.5, 1.2]]);
    expect(mesh.outside).toEqual([[0, 0, 1000]]);
    expect(mesh.vertex).toEqual([[100, 200, 300]]);
    expect(mesh.normal).toEqual([[1.0, 0, 0]]);
    expect(mesh.texcoord).toEqual([[0.1, 0.75]]);
    expect(mesh.shift).toEqual([[0, 0, 0]]);
    expect(mesh.scale).toEqual([[1, 1, 1]]);
    expect(mesh.shear).toEqual([[0, 0, 0]]);
    expect(mesh.spin).toEqual([[45, 0, 0, 0]]);
    expect(mesh.phydrv).toEqual('example_phydrv');
    expect(mesh.smoothbounce).toEqual(true);
    expect(mesh.noclusters).toEqual(true);

    expect(mesh.faces[0].vertices).toEqual([1, 4, 0, 3, 5]);
    expect(mesh.faces[0].normals).toEqual([2, 6, 0, 4, 7]);
    expect(mesh.faces[0].texcoords).toEqual([0, 3, 2, 4, 9]);
    expect(mesh.faces[0].phydrv).toEqual('example_phydrv');
    expect(mesh.faces[0].smoothbounce).toEqual(true);
    expect(mesh.faces[0].noclusters).toEqual(true);
    expect(mesh.faces[0].drivethrough).toEqual(true);
    expect(mesh.faces[0].shootthrough).toEqual(true);
    expect(mesh.faces[0].passable).toEqual(true);
    expect(mesh.faces[0].matref).toEqual('');

    expect(mesh.faces[1].vertices).toEqual([5, 3, 0, 4, 1]);
    expect(mesh.faces[1].normals).toEqual([2, 6, 0, 4, 7]);
    expect(mesh.faces[1].texcoords).toEqual([0, 3, 2, 4, 9]);
    expect(mesh.faces[1].phydrv).toEqual('example_phydrv');
    expect(mesh.faces[1].smoothbounce).toEqual(true);
    expect(mesh.faces[1].noclusters).toEqual(true);
    expect(mesh.faces[1].drivethrough).toEqual(true);
    expect(mesh.faces[1].shootthrough).toEqual(true);
    expect(mesh.faces[1].passable).toEqual(true);
    expect(mesh.faces[1].matref).toEqual('');
  });

  it('should handle a world', () => {
    const bzwBody = `\
    world
      name example_world
      size 400.0
      flagHeight 10.0
      noWalls
      freeCtfSpawns
    end
    `;
    const parser = new BZWDocument(bzwBody);
    const world: World = parser.world;

    expect(world.name).toEqual('example_world');
    expect(world.size).toEqual(400.0);
    expect(world.flagheight).toEqual(10.0);
    expect(world.nowalls).toEqual(true);
    expect(world.freectfspawns).toEqual(true);
  });

  it('should ignore comments', () => {
    const bzwBody = `\
    # HiX2 experimental world
    # Copyright (c) 1993-2020 Tim Riker
    # by Tim Riker Tim@Rikers.org
    #
    # This is a team play world
    
    # Typical World definition
    #
    world
    name HiX 2.0
    size 400.0
    flagHeight 0.0
    end
    
    # top of the world
    box
    name A Box # this comment should not be part of the string
    position 0.0 0.0 29.0 # A comment at the end of the line
    rotation 0.0
    size     9.6568542495 4.0 16.0
    end
    `;
    const parser = new BZWDocument(bzwBody);

    expect(parser.world.name).toEqual('HiX 2.0');
    expect(parser.world.size).toEqual(400);
    expect(parser.world.flagheight).toEqual(0);

    const box: Box = Object.values(parser.world.children).pop() as Box;
    expect(box.name).toEqual('A Box');
    expect(box.position).toEqual([0, 0, 29]);
    expect(box.size).toEqual([9.6568542495, 4.0, 16.0]);
  });
});
