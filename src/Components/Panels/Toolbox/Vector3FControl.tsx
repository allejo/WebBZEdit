import React from 'react';

import { Vector3F } from '../../../Utilities/types';
import NumericalControl from './NumericalControl';

import styles from './Vector3FControl.module.scss';

interface Props {
  className?: string;
  name: string;
  onChange: (array: Vector3F) => void;
  value: Vector3F;
}

const Vector3FControl = ({ className = '', name, onChange, value }: Props) => {
  const handleOnChange = (arrIdx: number) => (newValue: number) => {
    const dupe: Vector3F = [...value];
    dupe[arrIdx] = newValue;

    onChange(dupe);
  };

  return (
    <fieldset className={`${styles.wrapper} ${className}`}>
      <legend className={styles.legend}>{name}</legend>

      <NumericalControl
        className={styles.numericalControl}
        label="X"
        prefix={name}
        onChange={handleOnChange(0)}
        value={value[0]}
      />

      <NumericalControl
        className={styles.numericalControl}
        label="Y"
        prefix={name}
        onChange={handleOnChange(1)}
        value={value[1]}
      />

      <NumericalControl
        className={styles.numericalControl}
        label="Z"
        prefix={name}
        onChange={handleOnChange(2)}
        value={value[2]}
      />
    </fieldset>
  );
};

export default Vector3FControl;
