import React, { ChangeEvent } from 'react';

import { IZone, IZoneSafety } from '../../../Document/Obstacles/Zone';
import {
  IZoneEditorOpenEvent,
  ZoneEditorMode,
  ZoneEditorOpenEvent,
  ZoneEditorOpenEventName,
} from '../../../Events/IZoneEditorOpenEvent';
import eventBus from '../../../Utilities/EventBus';
import Button from '../../Button';
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

  const handleOpenEditor = (mode: ZoneEditorMode) => () => {
    eventBus.dispatch<IZoneEditorOpenEvent>(
      ZoneEditorOpenEventName,
      new ZoneEditorOpenEvent(data, mode),
    );
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
          value={data.team?.map(String)}
        >
          {['Rogue', 'Red', 'Green', 'Blue', 'Purple', 'Rabbit', 'Hunter'].map(
            (value: string, index: number) => (
              <option key={index} value={index}>
                {value}
              </option>
            ),
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
          value={data.safety?.map(String)}
        >
          {['Red', 'Green', 'Blue', 'Purple'].map(
            (value: string, index: number) => (
              <option key={index} value={(index + 1) as IZoneSafety}>
                {value}
              </option>
            ),
          )}
        </select>
      </div>
      <div>
        <p className="fs-small fw-bold mb2">Flags</p>

        <div>
          <div className="d-flex mb2">
            <div className="flex-grow-1 mr2">
              <Button type="success" onClick={handleOpenEditor('zoneFlag')}>
                Zone Flags
              </Button>
            </div>
            <ToggleTip
              content={`
                Zone Flags are flags that will always
                exist in this zone regardless of global
                flag settings; i.e. flags defined with
                "+f" or "-f".
              `}
            />
          </div>
          <div className="d-flex">
            <div className="flex-grow-1 mr2">
              <Button
                type="success"
                className="w100"
                onClick={handleOpenEditor('flag')}
              >
                Flags
              </Button>
            </div>
            <ToggleTip
              content={`
                Regular flags are flags that _may_ spawn
                in this zone depending on global flag
                settings defined with "+f" or "-f".
              `}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZoneControl;
export type { Props as IZoneControlProps };
