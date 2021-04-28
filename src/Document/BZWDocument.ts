import { Box } from './Obstacles/Box';
import { BaseObject } from './Obstacles/BaseObject';
import { Pyramid } from './Obstacles/Pyramid';
import { Teleporter } from './Obstacles/Teleporter';

const ObjectMapping: Record<string, { new(): BaseObject }> = {
  box: Box,
  pyramid: Pyramid,
  teleporter: Teleporter,
};

export class BZWDocument {
  readonly objects: BaseObject[] = [];

  constructor(public readonly document: string) {
    this.parseLines(document);
  }

  private parseLines(document: string): void {
    const lines = document.split("\n");
    const objectStack: BaseObject[] = [];

    for (const _line of lines) {
      const line = _line.trim();
      const currObject: BaseObject | null = objectStack[objectStack.length - 1] ?? null;

      if (currObject && line === currObject.terminator) {
        currObject.parent.push(currObject);
        currObject.finalize();

        objectStack.pop();
      } else {
        const tokens = line.match(/([^ ]+)(?: (.+))?/);
        const object = tokens?.[1] ?? '';
        const infoString = tokens?.[2] ?? '';

        if (ObjectMapping.hasOwnProperty(object)) {
          const newObject = new ObjectMapping[object.toLowerCase()]();
          newObject.infoString = infoString;
          newObject!.parent = this.objects;

          objectStack.push(newObject);
        } else {
          currObject?.parseLine(line);
        }
      }
    }
  }
}
