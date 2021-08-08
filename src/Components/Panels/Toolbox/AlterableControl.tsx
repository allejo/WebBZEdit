import React from 'react';

import { IAlterable } from '../../../Document/Attributes/IAlterable';
import { IPositionable } from '../../../Document/Attributes/IPositionable';
import { implementsISizeable } from '../../../Document/Attributes/ISizeable';
import { Vector3F } from '../../../Utilities/types';
import NumericalControl from './NumericalControl';
import Vector3FControl from './Vector3FControl';

import styles from './AlterableControl.module.scss';

type DataType = IPositionable | IAlterable;

interface Props {
  data: DataType;
  onChange: (changes: DataType) => void;
}

const AlterableControl = ({ data, onChange }: Props) => {
  const handlePositionOnChange = (position: Vector3F) =>
    onChange({
      ...data,
      position,
    });
  const handleSizeOnChange = (size: Vector3F) =>
    onChange({
      ...data,
      size,
    });
  const handleRotationOnChange = (rotation: number) =>
    onChange({
      ...data,
      rotation,
    });

  return (
    <div className={styles.wrapper}>
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
    </div>
  );
};

export default AlterableControl;
export type { DataType as IAlterableControlDataType };
