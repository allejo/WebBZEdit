import { nanoid } from 'nanoid';

import { Stack } from '../Utilities/Stack';
import { BaseProperties, newIBase } from './Obstacles/Base';
import { IBaseObject, newIBaseObject } from './Obstacles/BaseObject';
import { BoxProperties, newIBox } from './Obstacles/Box';
import { MeshProperties, newIMesh } from './Obstacles/Mesh';
import { MeshFaceProperties, newIMeshFace } from './Obstacles/MeshFace';
import { newIPyramid, PyramidProperties } from './Obstacles/Pyramid';
import {
  ITeleporter,
  newITeleporter,
  TeleporterProperties,
} from './Obstacles/Teleporter';
import { IWorld, newIWorld, WorldProperties } from './Obstacles/World';
import { newIZone, ZoneProperties } from './Obstacles/Zone';
import { bzwString, ParserCallback, Repeatable } from './attributeParsers';

type ObjectBuilder = {
  factory: () => any;
  parsers: Record<string, ParserCallback<any> | Repeatable<any>>;
  finalize: (obstacle: any) => void;
};

const noop = () => {};

const ObjectBuilders: Record<string, ObjectBuilder> = {
  base: {
    factory: newIBase,
    parsers: BaseProperties,
    finalize: noop,
  },
  box: {
    factory: newIBox,
    parsers: BoxProperties,
    finalize: noop,
  },
  face: {
    factory: newIMeshFace,
    parsers: MeshFaceProperties,
    finalize: noop,
  },
  mesh: {
    factory: newIMesh,
    parsers: MeshProperties,
    finalize: noop,
  },
  pyramid: {
    factory: newIPyramid,
    parsers: PyramidProperties,
    finalize: noop,
  },
  teleporter: {
    factory: newITeleporter,
    parsers: TeleporterProperties,
    finalize: (teleporter: ITeleporter) => {
      teleporter.name = teleporter._infoString;
    },
  },
  world: {
    factory: newIWorld,
    parsers: WorldProperties,
    finalize: noop,
  },
  zone: {
    factory: newIZone,
    parsers: ZoneProperties,
    finalize: noop,
  },
};

function parseLine(line: string, object: IBaseObject): void {
  const spacePos = line.search(/[ ]|$/);
  const attribute = line.substring(0, spacePos).toLowerCase();
  const restOfLine = line.substr(spacePos + 1).trim();

  const parser =
    ObjectBuilders[object._objectType].parsers[attribute] ?? bzwString;

  if (typeof parser === 'function') {
    object[attribute] = parser(restOfLine);
  } else {
    if (parser.type === 'repeatable') {
      if (!object[attribute]) {
        object[attribute] = [];
      }

      object[attribute].push(parser.callback(restOfLine));
    }
  }
}

export function parseBZWDocument(document: string): IWorld {
  let world: IWorld = {
    ...newIBaseObject('world'),
    size: 800,
    nowalls: false,
    freectfspawns: false,
  };

  const lines = document.split('\n');
  const objStack = new Stack<IBaseObject>([world]);

  for (const _line of lines) {
    const line = _line.trim();
    const currObject: IBaseObject | null = objStack.peek();

    // It's a comment or an empty line, ignore it
    if (line[0] === '#' || line === '') {
      continue;
    }

    if (currObject && line === currObject._terminator) {
      if (currObject._parent) {
        currObject._parent.children[currObject._uuid] = currObject;
      }

      ObjectBuilders[currObject._objectType].finalize(currObject);

      if (currObject._objectType !== 'world') {
        objStack.pop();
      }
    } else {
      const tokens = line.match(/([^ ]+)(?: (.+))?/);
      const object = tokens?.[1] ?? '';
      const infoString = tokens?.[2] ?? '';

      if (ObjectBuilders.hasOwnProperty(object)) {
        const newObject = ObjectBuilders[object.toLowerCase()].factory();
        newObject._uuid = nanoid();
        newObject._infoString = infoString;

        // We create a World object by default, but a map file can have its
        // own defined. If this is the case, let's overwrite out default one.
        if (newObject._objectType === 'world') {
          world = newObject;
          objStack.pop();
        } else {
          newObject._parent = currObject;
        }

        objStack.push(newObject);
      } else if (currObject) {
        parseLine(line, currObject);
      }
    }
  }

  return world;
}
