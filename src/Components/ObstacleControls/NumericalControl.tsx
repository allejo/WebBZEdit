import React, { SyntheticEvent } from 'react';

import styles from './NumericalControl.module.scss';

interface Props {
  className?: string;
  label: string;
  onChange: (value: number) => void;
  prefix?: string;
  value: number;
}

const NumericalControl = ({ className = '', label, onChange, prefix, value }: Props) => {
  const id = [prefix, label].join('-').toLowerCase();
  const callback = (event: SyntheticEvent<HTMLInputElement>) => {
    onChange(+event.currentTarget.value);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        className={styles.input}
        type="number"
        onChange={callback}
        value={value}
      />
    </div>
  );
};

export default NumericalControl;
