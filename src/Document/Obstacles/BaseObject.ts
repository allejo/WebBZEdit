import { bzwString, ParserCallback, Repeatable } from '../attributeParsers';

export abstract class BaseObject {
  // TODO: Figure out a better way of handling properties
  //   https://github.com/microsoft/TypeScript/pull/26797
  [key: string]: any;

  public abstract readonly objectType: string;
  public uuid: string = '';
  public infoString: string = '';
  public parent: BaseObject | null = null;
  public children: Record<string, BaseObject> = {};

  protected readonly definitions: Record<
    string,
    Repeatable<any> | ParserCallback<any>
  > = {};
  protected readonly endTerminator: string = 'end';

  public finalize(): void {}

  public parseLine(line: string): void {
    const spacePos = line.search(/[ ]|$/);
    const attribute = line.substring(0, spacePos).toLowerCase();
    const restOfLine = line.substr(spacePos + 1).trim();

    const parser = this.definitions?.[attribute] ?? bzwString;

    if (typeof parser === 'function') {
      this[attribute] = parser(restOfLine);
    } else {
      if (parser.type === 'repeatable') {
        if (!this[attribute]) {
          this[attribute] = [];
        }

        this[attribute].push(parser.callback(restOfLine));
      }
    }
  }

  public get terminator(): string {
    return this.endTerminator;
  }
}
