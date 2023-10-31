import { BZDBType } from '../data/bzdb-types';

import data from '../data/bzdb-documention.json';

type DocsType = typeof data;

interface BZDBDocType {
	name: string;
	description: string;
	defaultValue: string;
}

export class BZDBDocumentor {
	private readonly storage: Record<string, BZDBDocType> = {};
	private readonly fields: BZDBType[] = [];

	constructor(data: DocsType) {
		for (const variable of data.variables) {
			this.fields.push(variable.name as BZDBType);
			this.storage[variable.name] = {
				name: variable.name,
				description: variable.desc ?? '',
				defaultValue: variable.default,
			};
		}
	}

	getDescription(bzdb: BZDBType): string {
		return this.storage[bzdb].description;
	}

	getDefaultValue(bzdb: BZDBType): string {
		return this.storage[bzdb].defaultValue;
	}

	getSettings(): Iterable<BZDBType> {
		return this.fields;
	}
}

const bzdbDocumentation = new BZDBDocumentor(data);
Object.freeze(bzdbDocumentation);

export default bzdbDocumentation;
