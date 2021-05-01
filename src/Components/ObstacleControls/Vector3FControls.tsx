import React from 'react';
import { Vector3F } from '../../Utilities/types';
import NumericalControl from './NumericalControl';

interface Props {
  name: string;
  onChange: (array: Vector3F) => void;
  value: Vector3F;
}

const Vector3FControls = ({ name, onChange, value }: Props) => {
  const handleOnChange = (arrIdx: number) => (newValue: number) => {
    const dupe: Vector3F = [...value];
    dupe[arrIdx] = newValue;

    onChange(dupe);
  };

  return (
    <fieldset>
      <legend>{name}</legend>

      <NumericalControl
        label="X-axis"
        prefix={name}
        onChange={handleOnChange(0)}
        value={value[0]}
      />

      <NumericalControl
        label="Y-axis"
        prefix={name}
        onChange={handleOnChange(1)}
        value={value[1]}
      />

      <NumericalControl
        label="Z-axis"
        prefix={name}
        onChange={handleOnChange(2)}
        value={value[2]}
      />
    </fieldset>
  );
};

export default Vector3FControls;
