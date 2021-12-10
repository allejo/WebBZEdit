import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';

import { classList } from '../Utilities/cssClasses';
import { FlagAbbv } from '../data/flag-abbvs';
import Button from './Button';
import FlagName from './FlagName';
import NumberField from './Form/NumberField';
import SelectField from './Form/SelectField';

import Flags from '../data/flags.json';
import styles from './FlagListEditor.module.scss';

interface Props {
  allowCount: boolean;
  flags: [FlagAbbv | string, number][];
  onChange: (flags: [FlagAbbv | string, number][]) => void;
}

const FlagListEditor = ({ allowCount, flags, onChange }: Props) => {
  const [currFlagSelect, setCurrFlagSelect] = useState('');
  const [currFlagCount, setCurrFlagCount] = useState(allowCount ? 1 : -1);

  const selectedFlags = useMemo(() => {
    const flagSelection = new Set<string>();

    flags.forEach((flag) => flagSelection.add(flag[0]));

    return Array.from(flagSelection);
  }, [flags]);
  const flagOptions = useMemo(() => {
    const options: Record<string, string> = {
      '': '-- Select Flag --',
    };

    Flags.forEach(({ name, abbreviation }) => {
      options[abbreviation] = name;
    });

    return options;
  }, []);

  const handleFlagAdd = () => {
    const newFlags = [...flags];
    newFlags.push([currFlagSelect, currFlagCount]);
    newFlags.sort((a, b) => a[0].localeCompare(b[0]));

    setCurrFlagSelect('');
    setCurrFlagCount(1);
    onChange(newFlags);
  };
  const handleFlagDelete = (index: number) => () => {
    const newFlags = [...flags];
    newFlags.splice(index, 1);

    onChange(newFlags);
  };
  const handleFlagEdit = (index: number) => (newCount: number) => {
    const newFlags = [...flags];
    newFlags[index][1] = newCount;

    onChange(newFlags);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.flagCol}>Flag</div>
          {allowCount && <div className={styles.countCol}>Count</div>}
          <div className={styles.actionCol}>Actions</div>
        </div>
        {flags.map((flag, index) => (
          <div className={styles.row} key={flag[0]}>
            <div className={styles.flagCol}>
              <FlagName flag={flag[0]} disableTooltip={false} />
            </div>
            {allowCount && (
              <div className={styles.countCol}>
                <NumberField
                  label={`Number of ${flag[0]} flags`}
                  labelProps={{ className: 'sr-only' }}
                  onChange={handleFlagEdit(index)}
                  minValue={1}
                  value={flag[1]}
                />
              </div>
            )}
            <div className={styles.actionCol}>
              <Button type="danger" onClick={handleFlagDelete(index)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </div>
          </div>
        ))}
        <div className={classList([styles.row, styles.adder])}>
          <div className={styles.flagCol}>
            <SelectField
              options={flagOptions}
              disabledItems={selectedFlags}
              label="New Flag"
              labelProps={{ className: 'sr-only' }}
              onChange={setCurrFlagSelect}
              value={currFlagSelect}
            />
          </div>
          {allowCount && (
            <div className={styles.countCol}>
              <NumberField
                label="Count"
                labelProps={{ className: 'sr-only' }}
                onChange={setCurrFlagCount}
                minValue={1}
                value={currFlagCount}
              />
            </div>
          )}
          <div className={styles.actionCol}>
            <Button
              type="success"
              disabled={currFlagSelect === ''}
              onClick={handleFlagAdd}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlagListEditor;
export type { Props as IFlagListEditorProps };
