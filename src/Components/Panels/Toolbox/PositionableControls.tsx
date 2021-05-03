import React from 'react';

import { IPositionable } from '../../../Document/attributePartials';
import { Vector3F } from '../../../Utilities/types';
import NumericalControl from './NumericalControl';
import Vector3FControls from './Vector3FControls';

import styles from './PositionableControls.module.scss';

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
        className="mr-3"
        onChange={handlePositionOnChange}
        value={data.position}
      />

      <Vector3FControls
        name="Size"
        className="mr-3"
        onChange={handleSizeOnChange}
        value={data.size}
      />

      <NumericalControl
        label="Rotation"
        onChange={handleRotationOnChange}
        value={data.rotation ?? 0}
      />
    </div>
  );
};

export default PositionableControls;
