import { IBaseObject } from './Obstacles/BaseObject';
import { IWorld } from './Obstacles/World';
import { PriorityWriter } from './Writing/PriorityWriter';
import { writeArray, writeNumber } from './Writing/attributeWriters';
import {
  AttributePriority,
  FooterWriters,
  HeaderWriters,
  IgnoredAttributes,
} from './Writing/obstacleWriters';

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
  const obstacleType = obstacle._objectType;
  const terminator = obstacle._terminator;
  const body = new PriorityWriter();

  Object.entries(obstacle).forEach(([attribute, value]) => {
    const isInternal = attribute[0] === '_';
    const isIgnored =
      IgnoredAttributes._global.indexOf(attribute) >= 0 ||
      IgnoredAttributes[obstacleType]?.indexOf(attribute) >= 0;

    if (isInternal || isIgnored) {
      return;
    }

    const writePriority: number =
      AttributePriority._global[attribute] ??
      AttributePriority?.[obstacleType]?.[attribute] ??
      0;

    if (attribute === 'children') {
      if (writeChildren) {
        Object.values(value as IBaseObject['children']).forEach(
          (child: IBaseObject) => {
            body.push(writePriority, '', ...writeObstacle(child, true));
          },
        );
      }
    } else if (value === true) {
      body.push(writePriority, attribute);
    } else if (typeof value === 'number') {
      if (attribute === 'rotation' && value === 0) {
        return;
      }

      body.push(writePriority, `${attribute} ${writeNumber(value)}`);
    } else if (typeof value === 'string') {
      if (value.trim().length === 0) {
        return;
      }

      body.push(writePriority, `${attribute} ${value}`);
    } else if (Array.isArray(value)) {
      const isNested = value.every(Array.isArray);

      if (isNested) {
        for (const nestedElement of value) {
          body.push(
            writePriority,
            `${attribute} ${writeArray(nestedElement).join(' ')}`,
          );
        }
      } else {
        const values = writeArray(value);

        body.push(writePriority, `${attribute} ${values.join(' ')}`);
      }
    }
  });

  return [
    HeaderWriters[obstacleType]?.(obstacle) ?? obstacleType,
    ...body.export().map((line) => (getIndentation() + line).trimRight()),
    FooterWriters[obstacleType]?.(obstacle) ?? terminator,
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
