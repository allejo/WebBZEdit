import React, { useMemo } from 'react';

import { FlagAbbv } from '../data/flag-abbvs';
import ToggleTip from './ToggleTip';

import Flags from '../data/flags.json';

interface Props {
	flag: FlagAbbv | string;
	disableTooltip: boolean;
}

const FlagName = ({ flag: flagAbbv }: Props) => {
	const flag = useMemo(
		() => Flags.find((f) => f.abbreviation === flagAbbv),
		[flagAbbv],
	);

	if (!flag) {
		return (
			<span>
				<em>{flagAbbv}</em>
				<ToggleTip content={`A potentially custom or invalid flag`} />
			</span>
		);
	}

	return (
		<span>
			{flag.name}
			<ToggleTip content={flag.summary} />
		</span>
	);
};

export default FlagName;
export type { Props as IFlagNameProps };
