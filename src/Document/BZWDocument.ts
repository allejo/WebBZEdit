import { nanoid } from 'nanoid';

import { Stack } from '../Utilities/Stack';
import { Base } from './Obstacles/Base';
import { BaseObject } from './Obstacles/BaseObject';
import { Box } from './Obstacles/Box';
import { Mesh } from './Obstacles/Mesh';
import { MeshFace } from './Obstacles/MeshFace';
import { Pyramid } from './Obstacles/Pyramid';
import { Teleporter } from './Obstacles/Teleporter';
import { World } from './Obstacles/World';
import { Zone } from './Obstacles/Zone';

const ObjectMapping: Record<string, { new (): BaseObject }> = {
  base: Base,
  box: Box,
  face: MeshFace,
  mesh: Mesh,
  pyramid: Pyramid,
  teleporter: Teleporter,
  world: World,
  zone: Zone,
};

export class BZWDocument {
  public world: World = new World();

  constructor(public readonly document: string) {
    this.parseLines(document);
  }

  get objects(): Record<string, BaseObject> {
    return this.world.children;
  }

  private parseLines(document: string): void {
    const lines = document.split('\n');
    const objStack = new Stack<BaseObject>([this.world]);

    for (const _line of lines) {
      const line = _line.trim();
      const currObject: BaseObject | null = objStack.peek();

      // It's a comment or an empty line, ignore it
      if (line[0] === '#' || line === '') {
        continue;
      }

      if (currObject && line === currObject.terminator) {
        if (currObject.parent) {
          currObject.parent.children[currObject.uuid] = currObject;
        }

        currObject.finalize();

        if (!(currObject instanceof World)) {
          objStack.pop();
        }
      } else {
        const tokens = line.match(/([^ ]+)(?: (.+))?/);
        const object = tokens?.[1] ?? '';
        const infoString = tokens?.[2] ?? '';

        if (ObjectMapping.hasOwnProperty(object)) {
          const newObject = new ObjectMapping[object.toLowerCase()]();
          newObject.uuid = nanoid();
          newObject.infoString = infoString;

          // We create a World object by default, but a map file can have its
          // own defined. If this is the case, let's overwrite out default one.
          if (newObject instanceof World) {
            this.world = newObject;
            objStack.pop();
          } else {
            newObject.parent = currObject;
          }

          objStack.push(newObject);
        } else {
          currObject?.parseLine(line);
        }
      }
    }
  }
}
