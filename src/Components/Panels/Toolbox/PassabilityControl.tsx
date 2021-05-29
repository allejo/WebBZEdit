import React, { ChangeEvent } from 'react';

import { IPassableObject } from '../../../Document/Attributes/IPassableObject';

import styles from './PassabilityControls.module.scss';

interface Props {
  data: IPassableObject;
  onChange: (changes: IPassableObject) => void;
}

const PassabilityControls = ({ data, onChange }: Props) => {
  const handleDriveThroughOnChange = (_: ChangeEvent) => {
    const drivethrough = !data.drivethrough;
    onChange({
        ...data,
      drivethrough,
    });
  }
  const handleShootThroughOnChange = (_: ChangeEvent) => {
    const shootthrough = !data.shootthrough;
    onChange({
      ...data,
      shootthrough,
    });
  }

  return (
    <div className={styles.wrapper}>
      <legend className={styles.legend}>Passability</legend>
      <div>
        <input type="checkbox" id="drivethrough" checked={data.drivethrough} onChange={handleDriveThroughOnChange}/>
          <label htmlFor="drivethrough">Drive Through</label>
      </div>

      <div>
        <input type="checkbox" id="shootthrough" checked={data.shootthrough} onChange={handleShootThroughOnChange}/>
          <label htmlFor="shootthrough">Pass Through</label>
      </div>

    </div>
  );
};

export default PassabilityControls;
