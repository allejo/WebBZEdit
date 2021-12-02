import React, { ChangeEvent } from 'react';

import {
  IZone,
  IZoneSafety,
  IZoneTeam,
} from '../../../Document/Obstacles/Zone';
import ToggleTip from '../../ToggleTip';

import styles from './ZoneControl.module.scss';

interface Props {
  data: IZone;
  onChange: (changes: IZone) => void;
}

const ZoneControl = ({ data, onChange }: Props) => {
  const handleMultiSelect = (key: keyof IZone) => (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selected = Array.from(e.target.options)
      .filter((o) => o.selected)
      .map((o) => o.value);

    onChange({
      ...data,
      [key]: selected,
    });
  };

  return (
    <section>
      <div className={styles.stacked}>
        <label htmlFor="team-spawning">
          Team Spawning
          <ToggleTip
            content={`
              These teams will be assigned
              to spawn in this zone
            `}
          />
        </label>
        <select
          id="team-spawning"
          multiple={true}
          onChange={handleMultiSelect('team')}
        >
          {['Rogue', 'Red', 'Green', 'Blue', 'Purple', 'Rabbit', 'Hunter'].map(
            (value: string, index: number) => {
              const teamVal = index as IZoneTeam;

              return (
                <option
                  key={index}
                  value={index}
                  selected={data.team?.indexOf(teamVal) !== -1}
                >
                  {value}
                </option>
              );
            },
          )}
        </select>
      </div>
      <div className={styles.stacked}>
        <label htmlFor="safety-zone">
          Team Flag Safety
          <ToggleTip
            content={`
              When a team flag is dropped over
              an "unsafe" ground (e.g. slope, death
              physics), it will fly to the closest
              "safety" zone.
            `}
          />
        </label>
        <select
          id="safety-zone"
          multiple={true}
          onChange={handleMultiSelect('safety')}
        >
          {['Red', 'Green', 'Blue', 'Purple'].map(
            (value: string, index: number) => {
              const teamVal = (index + 1) as IZoneSafety;

              return (
                <option
                  key={index}
                  value={teamVal}
                  selected={data.safety?.indexOf(teamVal) !== -1}
                >
                  {value}
                </option>
              );
            },
          )}
        </select>
      </div>
    </section>
  );
};

export default ZoneControl;
export type { Props as IZoneControlProps };
