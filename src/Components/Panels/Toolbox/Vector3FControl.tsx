import React from 'react';

import { Vector3F } from '../../../Utilities/types';
import { FieldLayout } from '../../Form/BaseFormField';
import NumberField from '../../Form/NumberField';

import styles from './Vector3FControl.module.scss';

interface Props {
  className?: string;
  name: string;
  onChange: (array: Vector3F) => void;
  ranges?: Record<'x' | 'y' | 'z', [number?, number?]>;
  value: Vector3F;
}

const Vector3FControl = ({
  className = '',
  name,
  onChange,
  ranges,
  value,
}: Props) => {
  const handleOnChange = (arrIdx: number) => (newValue: number) => {
    const dupe: Vector3F = [...value];
    dupe[arrIdx] = newValue;

    onChange(dupe);
  };

  return (
    <fieldset className={`${styles.wrapper} ${className}`}>
      <legend className={styles.legend}>{name}</legend>

      <NumberField
        className={styles.numericalControl}
        layout={FieldLayout.Horizontal}
        label="X"
        labelProps={{ id: `${name}-x` }}
        minValue={ranges?.x[0]}
        maxValue={ranges?.x[1]}
        onChange={handleOnChange(0)}
        value={value[0]}
      />

      <NumberField
        className={styles.numericalControl}
        layout={FieldLayout.Horizontal}
        label="Y"
        labelProps={{ id: `${name}-y` }}
        minValue={ranges?.y[0]}
        maxValue={ranges?.y[1]}
        onChange={handleOnChange(1)}
        value={value[1]}
      />

      <NumberField
        className={styles.numericalControl}
        layout={FieldLayout.Horizontal}
        label="Z"
        labelProps={{ id: `${name}-z` }}
        minValue={ranges?.z[0]}
        maxValue={ranges?.z[1]}
        onChange={handleOnChange(2)}
        value={value[2]}
      />
    </fieldset>
  );
};

export default Vector3FControl;
