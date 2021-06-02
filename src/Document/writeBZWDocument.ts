import { IBaseObject } from './Obstacles/BaseObject';
import { IWorld } from './Obstacles/World';
import { writeNumber } from './attributeWriters';

export interface StyleOptions {
  indentation: 'space' | 'tab';
  indentationWidth?: number;
}

let styleOptions: StyleOptions = {
  indentation: 'tab',
};

function getIndentation(): string {
  if (styleOptions.indentation === 'tab') {
    return '\t';
  }

  return ' '.repeat(styleOptions.indentationWidth ?? 4);
}

function writeObstacle(
  obstacle: IBaseObject,
  writeChildren: boolean,
): string[] {
  const body: string[] = [];

  Object.entries(obstacle).forEach(([attribute, value]) => {
    if (attribute[0] === '_') {
      return;
    }

    if (attribute === 'children') {
      if (writeChildren) {
        Object.values(value as IBaseObject['children']).forEach(
          (child: IBaseObject) => {
            body.push(...writeObstacle(child, true));
          },
        );
      }
    } else if (value === true) {
      body.push(attribute);
    } else if (typeof value === 'number') {
      if (attribute === 'rotation' && value === 0) {
        return;
      }

      body.push(`${attribute} ${writeNumber(value)}`);
    } else if (typeof value === 'string') {
      if (value.trim().length === 0) {
        return;
      }

      body.push(`${attribute} ${value}`);
    } else if (Array.isArray(value)) {
      const values = value.map((arrValue) => {
        if (typeof arrValue === 'number') {
          return writeNumber(arrValue);
        }

        return arrValue;
      });

      body.push(`${attribute} ${values.join(' ')}`);
    }
  });

  return [
    obstacle._objectType,
    ...body.map((line) => getIndentation() + line),
    obstacle._terminator,
  ];
}

export function writeBZWDocument(
  document: IWorld,
  styling?: StyleOptions,
): string {
  if (styling) {
    styleOptions = styling;
  }

  const output = [
    // Print out the "world" object
    [writeObstacle(document, false), ''],

    // Print out all of the objects in this world
    Object.values(document.children).map((object: IBaseObject) => {
      return [writeObstacle(object, true), ''];
    }),
  ];

  return output.flat(4).join('\n').trim();
}
