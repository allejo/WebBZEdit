import React from 'react';

import { IAlterable } from '../../../Document/Attributes/IAlterable';
import {
	implementsIPositionable,
	IPositionable,
} from '../../../Document/Attributes/IPositionable';
import { implementsISizeable } from '../../../Document/Attributes/ISizeable';
import { IBaseObject } from '../../../Document/Obstacles/BaseObject';
import { ITankModelObjectType } from '../../../Document/Obstacles/TankModel';
import { Vector3F } from '../../../Utilities/types';
import NumberField from '../../Form/NumberField';
import Vector3FControl from './Vector3FControl';

import styles from './AlterableControl.module.scss';

export function canUseAlterableControlToolbox(
	value: any,
): value is IPositionable | IAlterable {
	const isPositionable = implementsIPositionable(value);
	const isISizeable = implementsISizeable(value);

	return isPositionable || (isPositionable && isISizeable);
}

type DataType = IBaseObject & (IPositionable | IAlterable);

interface Props {
	data: DataType;
	onChange: (changes: DataType) => void;
}

const NoNegativeZAxisList = [ITankModelObjectType];

const AlterableControl = ({ data, onChange }: Props) => {
	const handlePositionOnChange = (proposedPosition: Vector3F) => {
		const position: Vector3F = [...proposedPosition];

		if (position[2] < 0 && NoNegativeZAxisList.indexOf(data._objectType) > -1) {
			position[2] = 0;
		}

		onChange({
			...data,
			position,
		});
	};
	const handleSizeOnChange = (proposedSize: Vector3F) => {
		onChange({
			...data,
			size: proposedSize,
		});
	};
	const handleRotationOnChange = (proposedRotation: number) => {
		onChange({
			...data,
			rotation: proposedRotation,
		});
	};

	return (
		<section>
			<Vector3FControl
				name="Position"
				className={styles.position}
				onChange={handlePositionOnChange}
				value={data.position}
			/>

			{implementsISizeable(data) && (
				<Vector3FControl
					name="Size"
					className={styles.size}
					onChange={handleSizeOnChange}
					ranges={{
						x: [0.01],
						y: [0.01],
						z: [0.01],
					}}
					value={data.size}
				/>
			)}

			<NumberField
				className={styles.rotation}
				label="Rotation"
				onChange={handleRotationOnChange}
				minValue={0}
				maxValue={360}
				cycleValues={true}
				value={data.rotation ?? 0}
			/>
		</section>
	);
};

export default AlterableControl;
export type { DataType as IAlterableControlDataType };
