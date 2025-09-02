import { BZDBType } from '../data/bzdb-types';

import data from '../data/bzdb-documention.json';

type DocsType = typeof data;

export type BZDBDocType = {
  category: string;
  defValue: string;
  description: string;
  name: string;
  since: string;
  type: DocsType['variables'][number]['type'];
};

export class BZDBDocumentor {
  private readonly grpByCat: Record<string, Record<string, BZDBDocType>> = {};
  private readonly storage: Record<string, BZDBDocType> = {};
  private readonly _fields: BZDBType[] = [];

  constructor(data: DocsType) {
    for (const variable of data.variables) {
      this._fields.push(variable.name as BZDBType);
      this.storage[variable.name] = {
        category: variable.category,
        defValue: variable.default,
        description: variable.desc ?? '',
        name: variable.name,
        since: variable.since ?? 'Unknown',
        type: variable.type,
      };

      const cat = variable.category ?? 'Miscellaneous';

      this.grpByCat = this.grpByCat ?? {};
      this.grpByCat[cat] = this.grpByCat[cat] ?? {};
      this.grpByCat[cat][variable.name] = this.storage[variable.name];
    }
  }

  forEach = (
    callback: (doc: BZDBDocType, index: number, array: BZDBDocType[]) => void,
  ): void => {
    const array = this._fields.map((f) => this.storage[f]);

    this._fields.forEach((field, index) => {
      callback(this.storage[field], index, array);
    });
  };

  mapByCategory = <T>(
    category: string,
    callback: (doc: BZDBDocType, index: number, array: BZDBDocType[]) => T,
  ): T[] => {
    if (!this.grpByCat.hasOwnProperty(category)) {
      return [];
    }

    return Object.values(this.grpByCat[category]).map(callback);
  };

  get categories(): string[] {
    return Object.keys(this.grpByCat).sort();
  }

  get fields(): BZDBType[] {
    return [...this._fields];
  }

  get store(): Readonly<Record<string, BZDBDocType>> {
    return { ...this.storage };
  }
}

const bzdbDocumentation = new BZDBDocumentor(data);
Object.freeze(bzdbDocumentation);

export default bzdbDocumentation;
