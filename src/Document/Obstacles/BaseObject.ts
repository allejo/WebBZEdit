import { parseString } from '../attributeParsers';

export abstract class BaseObject {
  public abstract readonly objectType: string;
  public readonly attributes: Record<string, any> = {};
  public infoString: string = '';
  public parent: any[] = [];

  protected readonly definitions: Record<string, (line: string) => any> = {};
  protected readonly endTerminator: string = 'end';

  public finalize(): void {}

  public parseLine(line: string): void {
    const spacePos = line.search(/[ ]|$/);
    const attribute = line.substring(0, spacePos).toLowerCase();
    const restOfLine = line.substr(spacePos + 1);

    const parser = this.definitions?.[attribute] ?? parseString;

    this.attributes[attribute] = parser(restOfLine);
  }

  public get terminator(): string {
    return this.endTerminator;
  }
}
