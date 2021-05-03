import React from 'react';

import { Vector3F } from '../../../Utilities/types';
import NumericalControl from './NumericalControl';

import styles from './Vector3FControls.module.scss';

interface Props {
  className?: string;
  name: string;
  onChange: (array: Vector3F) => void;
  value: Vector3F;
}

const Vector3FControls = ({ className = '', name, onChange, value }: Props) => {
  const handleOnChange = (arrIdx: number) => (newValue: number) => {
    const dupe: Vector3F = [...value];
    dupe[arrIdx] = newValue;

    onChange(dupe);
  };

  return (
    <fieldset className={`${styles.wrapper} ${className}`}>
      <legend className={styles.legend}>{name}</legend>

      <NumericalControl
        className="mb-1"
        label="X"
        prefix={name}
        onChange={handleOnChange(0)}
        value={value[0]}
      />

      <NumericalControl
        className="mb-1"
        label="Y"
        prefix={name}
        onChange={handleOnChange(1)}
        value={value[1]}
      />

      <NumericalControl
        label="Z"
        prefix={name}
        onChange={handleOnChange(2)}
        value={value[2]}
      />
    </fieldset>
  );
};

export default Vector3FControls;
