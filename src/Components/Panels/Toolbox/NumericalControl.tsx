import React, { KeyboardEvent, SyntheticEvent } from 'react';

import styles from './NumericalControl.module.scss';
import keyboard from '../../../Utilities/keyboard';

interface Props {
  className?: string;
  layout?: 'horizontal' | 'vertical';
  label: string;
  onChange: (value: number) => void;
  prefix?: string;
  value: number;
}

const NumericalControl = ({
  className = '',
  layout = 'horizontal',
  label,
  onChange,
  prefix,
  value,
}: Props) => {
  const id = [prefix, label].join('-').toLowerCase();
  const handleOnChange = (event: SyntheticEvent<HTMLInputElement>) => {
    onChange(+event.currentTarget.value);
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const allowList = [
      keyboard.UP,
      keyboard.DOWN,
    ];

    if (allowList.indexOf(event.keyCode) >= 0) {
      event.preventDefault();

      const value = +event.currentTarget.value;
      const modifier = event.shiftKey ? 10 : 1;

      if (event.keyCode === keyboard.UP) {
        onChange(value + modifier);
      } else if (event.keyCode === keyboard.DOWN) {
        onChange(value - modifier);
      }
    }
  };

  return (
    <div className={`${styles.wrapper} ${className}`} data-layout={layout}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type="number"
        onChange={handleOnChange}
        onKeyDown={handleKeyPress}
        value={value}
      />
    </div>
  );
};

export default NumericalControl;
