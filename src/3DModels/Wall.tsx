import { useLoader } from '@react-three/fiber';
import React, { useMemo } from 'react';
import { RepeatWrapping, TextureLoader } from 'three';

import { CardinalDirection } from '../Utilities/contracts';
import SkinnableBox from './Abstract/SkinnableBox';

import worldWall from '../assets/wall.png';

interface Props {
	direction: CardinalDirection;
	wallHeight: number;
	worldSize: number;
}

const Wall = ({ direction, wallHeight, worldSize }: Props) => {
	const [wallTexture] = useLoader(TextureLoader, [worldWall]);

	const position: [number, number, number] = useMemo(() => {
		switch (direction) {
			case CardinalDirection.North:
				return [0, worldSize, 0];

			case CardinalDirection.South:
				return [0, -worldSize, 0];

			case CardinalDirection.East:
				return [worldSize, 0, 0];

			case CardinalDirection.West:
				return [-worldSize, 0, 0];

			default:
				return [0, 0, 0];
		}
	}, [direction, worldSize]);
	const rotation: number = useMemo(() => {
		switch (direction) {
			case CardinalDirection.North:
			case CardinalDirection.South:
				return 0;

			default:
				return 90;
		}
	}, [direction]);

	wallTexture.wrapS = wallTexture.wrapT = RepeatWrapping;
	wallTexture.repeat.set(worldSize / 10, wallHeight / 10);
	wallTexture.needsUpdate = true;

	return (
		<SkinnableBox
			position={position}
			size={[worldSize, 0.01, wallHeight]}
			rotation={rotation}
			topTexture={wallTexture}
			botTexture={wallTexture}
			xPosTexture={wallTexture}
			xNegTexture={wallTexture}
			yPosTexture={wallTexture}
			yNegTexture={wallTexture}
		/>
	);
};

export default Wall;
export type { Props as IWallProps };
