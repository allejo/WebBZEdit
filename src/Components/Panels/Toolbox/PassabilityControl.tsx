import React, { ChangeEvent } from 'react';

import { IPassableObject } from '../../../Document/Attributes/IPassableObject';

import styles from './PassabilityControls.module.scss';

interface Props {
  data: IPassableObject;
  onChange: (changes: IPassableObject) => void;
}

const PassabilityControls = ({ data, onChange }: Props) => {
  const handleDriveThroughOnChange = () => {
    onChange({
      ...data,
      drivethrough: !data.drivethrough,
    });
  };
  const handleShootThroughOnChange = () => {
    onChange({
      ...data,
      shootthrough: !data.shootthrough,
    });
  };

  return (
    <fieldset className={styles.wrapper}>
      <legend className={styles.legend}>Passability</legend>
      <div>
        <input
          type="checkbox"
          id="drivethrough"
          checked={data.drivethrough}
          onChange={handleDriveThroughOnChange}
        />
        <label htmlFor="drivethrough">Drive Through</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="shootthrough"
          checked={data.shootthrough}
          onChange={handleShootThroughOnChange}
        />
        <label htmlFor="shootthrough">Shoot Through</label>
      </div>
    </fieldset>
  );
};

export default PassabilityControls;
