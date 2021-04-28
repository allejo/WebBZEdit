import { bzwString, ParserCallback, Repeatable } from '../attributeParsers';

export abstract class BaseObject {
  public abstract readonly objectType: string;
  public readonly attributes: Record<string, any> = {};
  public infoString: string = '';
  public parent: any[] = [];

  protected readonly definitions: Record<string, Repeatable<any> | ParserCallback<any>> = {};
  protected readonly endTerminator: string = 'end';

  public finalize(): void {}

  public parseLine(line: string): void {
    const spacePos = line.search(/[ ]|$/);
    const attribute = line.substring(0, spacePos).toLowerCase();
    const restOfLine = line.substr(spacePos + 1);

    const parser = this.definitions?.[attribute] ?? bzwString;

    if (typeof parser === 'function') {
      this.attributes[attribute] = parser(restOfLine);
    } else {
      if (parser.type === "repeatable") {
        if (!this.attributes.hasOwnProperty(attribute)) {
          this.attributes[attribute] = [];
        }

        this.attributes[attribute].push(parser.callback(restOfLine));
      }
    }
  }

  public get terminator(): string {
    return this.endTerminator;
  }
}
