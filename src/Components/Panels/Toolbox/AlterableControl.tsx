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
import NumericalControl from './NumericalControl';
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
    const size: Vector3F = [...proposedSize];

    // Make sure we don't get any weird sizes with 0s
    for (const i in size) {
      if (size[i] <= 0) {
        size[i] = 0.01;
      }
    }

    onChange({
      ...data,
      size,
    });
  };
  const handleRotationOnChange = (proposedRotation: number) => {
    let rotation = proposedRotation;

    // Only allow 0 - 359 degrees of rotation
    if (rotation < 0) {
      rotation = 360 + proposedRotation;
    } else if (rotation >= 360) {
      rotation = 360 - proposedRotation;
    }

    onChange({
      ...data,
      rotation,
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
          value={data.size}
        />
      )}

      <NumericalControl
        className={styles.rotation}
        label="Rotation"
        layout="vertical"
        onChange={handleRotationOnChange}
        value={data.rotation ?? 0}
      />
    </section>
  );
};

export default AlterableControl;
export type { DataType as IAlterableControlDataType };
