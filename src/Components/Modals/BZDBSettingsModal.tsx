import produce from 'immer';
import React, { useCallback, useMemo, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { IOptions } from '../../Document/Obstacles/Option';
import { BZDBSettingsModalOpenEventName } from '../../Events/IBZDBSettingsModalOpenEvent';
import { documentState } from '../../atoms';
import { BZDBType } from '../../data/bzdb-types';
import Button from '../Button';
import NumberField from '../Form/NumberField';
import ListenerModal from '../ListenerModal';
import Markdown from '../Markdown';
import { Tab, TabList } from '../TabList';

import BZDBDocs from '../../data/bzdb-documention.json';
import generalStyles from '../../sass/general.module.scss';

type BZDBVariableType = typeof BZDBDocs.variables[number];

interface SettingEditorProps {
  onChange: (setting: string, value: any) => void;
  variable: BZDBVariableType;
}

const SettingEditor = ({ variable }: SettingEditorProps) => {
  const [value, setValue] = useState<any>(variable.default);

  const renderEditor = (type: string) => {
    if (type === 'integer' || type === 'float') {
      return (
        <NumberField
          label={variable.name}
          onChange={setValue}
          value={value}
          labelProps={{ className: 'sr-only' }}
        />
      );
    }

    return 'Unsupported';
  };

  return (
    <div className="mb-3">
      <div className="d-flex align-items-center mb-1">
        <div className="flex-grow-1">{variable.name}</div>
        <div>{renderEditor(variable.type ?? 'string')}</div>
      </div>
      <div className={generalStyles.descriptionLike}>
        <Markdown content={variable.desc} inline />
      </div>
    </div>
  );
};

const BZDBSettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const [bzdbStore, setBZDBStore] = useState<IOptions['-set']>({});
  const dialog = useDialogState();

  const { bzdbCategories, bzdbDefinitionsByCategory } = useMemo(() => {
    const groupedByCat: Record<string, BZDBVariableType[]> = {};
    const mappedByVariable: Partial<Record<BZDBType, BZDBVariableType>> = {};

    BZDBDocs.variables.forEach((variable) => {
      const cat = variable.category ?? 'Miscellaneous';

      if (!groupedByCat.hasOwnProperty(cat)) {
        groupedByCat[cat] = [];
      }

      groupedByCat[cat].push(variable);
      mappedByVariable[variable.name as BZDBType] = variable;
    });

    return {
      bzdbDefinitionsByCategory: groupedByCat,
      bzdbCategories: Object.keys(groupedByCat).sort(),
      bzdbDefinitionsByVariable: mappedByVariable,
      bzdbVariables: Object.keys(mappedByVariable).sort(),
    };
  }, []);

  const syncStateToWorld = useCallback(() => {
    const sets = world?._options?.['-set'] ?? {};

    setBZDBStore(sets);
  }, [world?._options]);

  const handleOnChange = (variable: string, value: string) => {
    const newStore: IOptions['-set'] = { ...bzdbStore };

    newStore[variable] = value;

    setBZDBStore(newStore);
  };

  const handleOnSave = () => {
    if (!world) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      draftWorld._options['-set'] = bzdbStore;
    });

    setBZWDocument(nextWorld);
    dialog.hide();
  };

  return (
    <ListenerModal
      event={BZDBSettingsModalOpenEventName}
      dialog={dialog}
      title="BZDB Settings"
      onOpen={syncStateToWorld}
      hideOnEsc={false}
      hideOnClickOutside={false}
    >
      <TabList aria-label="BZDB Settings" vertical>
        {bzdbCategories.map((category) => (
          <Tab title={category} key={category}>
            {bzdbDefinitionsByCategory[category].map((variable) => (
              <SettingEditor
                key={variable.name}
                onChange={handleOnChange}
                variable={variable}
              />
            ))}
          </Tab>
        ))}
      </TabList>
      <div>
        <Button type="success" onClick={handleOnSave}>
          Save
        </Button>
      </div>
    </ListenerModal>
  );
};

export default BZDBSettingsModal;
