import React from 'react';

import { IPositionable } from '../../Document/attributePartials';
import { Vector3F } from '../../Utilities/types';
import Vector3FControls from './Vector3FControls';
import NumericalControl from './NumericalControl';

interface Props {
  data: IPositionable;
  onChange: (changes: IPositionable) => void;
}

const PositionableControls = ({ data, onChange }: Props) => {
  const handlePositionOnChange = (position: Vector3F) => onChange({
    ...data,
    position,
  });
  const handleSizeOnChange = (size: Vector3F) => onChange({
    ...data,
    size,
  });
  const handleRotationOnChange = (rotation: number) => onChange({
    ...data,
    rotation,
  })

  return (
    <div>
      <Vector3FControls
        name="Position"
        onChange={handlePositionOnChange}
        value={data.position}
      />

      <Vector3FControls
        name="Size"
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
