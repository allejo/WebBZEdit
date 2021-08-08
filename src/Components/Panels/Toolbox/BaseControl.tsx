import React, { ChangeEvent } from 'react';

import { IBase } from '../../../Document/Obstacles/Base';

import styles from './BaseControl.module.scss';

interface Props {
  data: IBase;
  onChange: (changes: IBase) => void;
}

const BaseControl = ({ data, onChange }: Props) => {
  const handleBaseColorOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...data,
      color: +event.currentTarget.value as IBase['color'],
    });
  };

  return (
    <section>
      <fieldset>
        <legend>Base Settings</legend>
        <div className="d-flex">
          <label htmlFor="base-color">Team Color</label>
          <select
            className={styles.dropdown}
            id="base-color"
            value={data.color}
            onChange={handleBaseColorOnChange}
          >
            <option value={1}>Red</option>
            <option value={2}>Green</option>
            <option value={3}>Blue</option>
            <option value={4}>Purple</option>
          </select>
        </div>
      </fieldset>
    </section>
  );
};

export default BaseControl;
