import React from 'react';

import { ConeDefaults, ICone } from '../../../Document/Obstacles/Cone';
import CheckboxField from '../../Form/CheckboxField';
import NumberField from '../../Form/NumberField';

interface Props {
  data: ICone;
  onChange: (changes: ICone) => void;
}

const ConeControl = ({ data, onChange }: Props) => {
  const handleOnDivisionsChange = (value: number) => {
    onChange({ ...data, divisions: value });
  };

  return (
    <section className="d-flex flex-row gap-3">
      <div className="d-flex flex-column">
        <NumberField
          label="Divisions"
          onChange={handleOnDivisionsChange}
          value={data.divisions}
          minValue={3}
        />

        <NumberField
          label="Angle"
          onChange={(value: number) => onChange({ ...data, angle: value })}
          value={data.angle ?? ConeDefaults.angle}
          minValue={1}
          maxValue={360}
        />
      </div>

      <fieldset>
        <legend>Behavior</legend>

        <CheckboxField
          label="Smooth Bounce"
          onChange={(value: boolean) =>
            onChange({ ...data, smoothbounce: value })
          }
          value={data.smoothbounce ?? ConeDefaults.smoothbounce}
        />

        <CheckboxField
          label="Flat Shading (i.e., Disable Normals)"
          onChange={(value: boolean) =>
            onChange({ ...data, flatshading: value })
          }
          value={data.flatshading ?? ConeDefaults.flatshading}
        />
      </fieldset>
    </section>
  );
};

export default ConeControl;
