import { BZDBType } from '../data/bzdb-types';

export interface FlagDocumentation {
	name: string;
	abbreviation: string;
	type: 'Good' | 'Bad';
	summary: string;
	bzdb: BZDBType[];
}
