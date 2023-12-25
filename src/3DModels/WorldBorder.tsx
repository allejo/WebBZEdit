import React from 'react';

import { CardinalDirection } from '../Utilities/contracts';
import Wall from './Wall';

interface Props {
	wallHeight: number;
	worldSize: number;
}

const WorldBorder = ({ wallHeight, worldSize }: Props) => {
	if (!wallHeight) {
		return null;
	}

	return (
		<>
			<Wall
				direction={CardinalDirection.North}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
			<Wall
				direction={CardinalDirection.South}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
			<Wall
				direction={CardinalDirection.East}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
			<Wall
				direction={CardinalDirection.West}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
		</>
	);
};

export default WorldBorder;
export type { Props as IWorldBorderProps };
