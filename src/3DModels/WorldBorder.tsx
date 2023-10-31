import React from 'react';

import Wall, { Direction } from './Wall';

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
				direction={Direction.North}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
			<Wall
				direction={Direction.South}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
			<Wall
				direction={Direction.East}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
			<Wall
				direction={Direction.West}
				wallHeight={wallHeight}
				worldSize={worldSize}
			/>
		</>
	);
};

export default WorldBorder;
export type { Props as IWorldBorderProps };
