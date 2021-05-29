import React from 'react';

import { Vector3F } from '../../../Utilities/types';
import NumericalControl from './NumericalControl';
import Vector3FControls from './Vector3FControls';

import styles from './PositionableControls.module.scss';
import { IPositionable } from '../../../Document/Attributes/IPositionable';

interface Props {
  data: IPositionable;
  onChange: (changes: IPositionable) => void;
}

const PositionableControls = ({ data, onChange }: Props) => {
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
      <Vector3FControls
        name="Position"
        className={styles.position}
        onChange={handlePositionOnChange}
        value={data.position}
      />

      <Vector3FControls
        name="Size"
        className={styles.size}
        onChange={handleSizeOnChange}
        value={data.size}
      />

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

export default PositionableControls;
