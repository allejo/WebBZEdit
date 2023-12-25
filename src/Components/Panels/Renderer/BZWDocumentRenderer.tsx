import React, { useCallback } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';

import Base from '../../../3DModels/Base';
import Box from '../../../3DModels/Box';
import Ground from '../../../3DModels/Ground';
import Pyramid from '../../../3DModels/Pyramid';
import Tank from '../../../3DModels/Tank';
import Teleporter from '../../../3DModels/Teleporter';
import WorldBorder from '../../../3DModels/WorldBorder';
import Zone from '../../../3DModels/Zone';
import { documentState, selectionState } from '../../../atoms';
import { IBase } from '../../../Document/Obstacles/Base';
import { IBox } from '../../../Document/Obstacles/Box';
import { IPyramid } from '../../../Document/Obstacles/Pyramid';
import {
	ITankModel,
	ITankModelObjectType,
} from '../../../Document/Obstacles/TankModel';
import { ITeleporter } from '../../../Document/Obstacles/Teleporter';
import { IZone } from '../../../Document/Obstacles/Zone';

const BZWDocumentRenderer = () => {
	const [selection, setSelection] = useRecoilState(selectionState);
	const document = useRecoilValue(documentState);

	const handleOnClick = useCallback(
		(uuid: string | null, setter: SetterOrUpdater<string | null>) => {
			return () => setter(uuid);
		},
		[],
	);

	if (document === null) {
		return null;
	}

	return (
		<>
			{Object.values(document.children).map((obstacle) => {
				const callback = handleOnClick(obstacle._uuid, setSelection);
				const props = {
					key: obstacle._uuid,
					onClick: callback,
					isSelected: selection === obstacle._uuid,
				};

				if (obstacle._objectType === ITankModelObjectType) {
					return <Tank {...props} configuration={obstacle as ITankModel} />;
				} else if (obstacle._objectType === 'box') {
					return <Box {...props} obstacle={obstacle as IBox} />;
				} else if (obstacle._objectType === 'pyramid') {
					return <Pyramid {...props} obstacle={obstacle as IPyramid} />;
				} else if (obstacle._objectType === 'base') {
					return <Base {...props} obstacle={obstacle as IBase} />;
				} else if (obstacle._objectType === 'teleporter') {
					return <Teleporter {...props} obstacle={obstacle as ITeleporter} />;
				} else if (obstacle._objectType === 'zone') {
					return <Zone {...props} obstacle={obstacle as IZone} />;
				}

				return null;
			})}
			<Ground worldSize={document.size} />
			<WorldBorder wallHeight={6.15} worldSize={document.size} />
		</>
	);
};

export default BZWDocumentRenderer;
