import React from 'react';

import { IBase } from '../../../Document/Obstacles/Base';

import styles from './BaseControl.module.scss';

interface Props {
  data: IBase;
  onChange: (changes: IBase) => void;
}

const BaseControl = ({ data, onChange }: Props) => {
  const handleBaseColourOnChange = (value: number) => {
    onChange({
      ...data,
      color: value as IBase['color'],
    });
  };

  return (
    <div className={styles.wrapper}>
      <fieldset className={styles.base}>
        <legend className={styles.legend}>Base</legend>
        <div>
          <select
            className={styles.dropdown}
            id="base-color"
            value={data.color}
            onChange={(event) =>
              handleBaseColourOnChange(parseInt(event.target.value))
            }
          >
            <option value={1}>Red</option>
            <option value={2}>Green</option>
            <option value={3}>Blue</option>
            <option value={4}>Purple</option>
          </select>
          <label htmlFor="base-color">Team Color</label>
        </div>
      </fieldset>
    </div>
  );
};

export default BaseControl;
