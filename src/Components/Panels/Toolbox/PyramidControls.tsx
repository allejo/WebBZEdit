import React from 'react';


import styles from './PassabilityControl.module.scss';
import { IPyramid } from '../../../Document/Obstacles/Pyramid';

interface Props {
  data: IPyramid;
  onChange: (changes: IPyramid) => void;
}

const PyramidControl = ({ data, onChange }: Props) => {
  const handleFlipZOnChange = () => {
    onChange({
      ...data,
      flipz: !data.drivethrough,
    });
  };

  return (
    <div className={styles.wrapper}>
      <fieldset className={styles.passability}>
        <legend className={styles.legend}>Pyramid</legend>
        <div>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="flipz"
            checked={data.flipz}
            onChange={handleFlipZOnChange}
          />
          <label htmlFor="flipz">Flip Z Axis</label>
        </div>
      </fieldset>
    </div>
  );
};

export default PyramidControl;
