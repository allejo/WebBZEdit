import produce from 'immer';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { IOptions } from '../../Document/Obstacles/Option';
import { BZDBSettingsModalOpenEventName } from '../../Events/IBZDBSettingsModalOpenEvent';
import { documentState } from '../../atoms';
import { BZDBType } from '../../data/bzdb-types';
import Button from '../Button';
import CheckboxField from '../Form/CheckboxField';
import NumberField from '../Form/NumberField';
import ListenerModal from '../ListenerModal';
import Markdown from '../Markdown';
import { Tab, TabList } from '../TabList';

import BZDBDocs from '../../data/bzdb-documention.json';
import generalStyles from '../../sass/general.module.scss';
import styles from './BZDBSettingsModal.module.scss';

type BZDBVariableType = typeof BZDBDocs.variables[number];

interface SettingEditorProps {
  onChange: (setting: string, value: any) => void;
  variable: BZDBVariableType;
}

const SettingEditor = ({ onChange, variable }: SettingEditorProps) => {
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
    } else if (type === 'boolean') {
      return (
        <CheckboxField
          label={variable.name}
          onChange={setValue}
          value={value}
          labelProps={{ className: 'sr-only' }}
        />
      );
    }

    return 'Unsupported';
  };

  useEffect(() => {
    onChange(variable.name, value);
  }, [onChange, value, variable.name]);

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

type BZDBStore = NonNullable<IOptions['-set']>;
type ReducerAction =
  | {
      type: 'replace';
      store: BZDBStore;
    }
  | {
      type: 'delete';
      variable: BZDBType | string;
    }
  | {
      type: 'edit';
      variable: BZDBType | string;
      value: string;
    };

function bzdbReducer(state: BZDBStore, action: ReducerAction) {
  if (action.type === 'replace') {
    return action.store;
  }

  return produce(state, (draftState) => {
    if (action.type === 'edit') {
      draftState[action.variable] = action.value;
    } else if (action.type === 'delete') {
      delete draftState[action.variable];
    }
  });
}

const BZDBSettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const [bzdbStore, bzdbStoreDispatch] = useReducer(bzdbReducer, {});
  const dialog = useDialogState();

  const {
    bzdbCategories,
    bzdbDefinitionsByCategory,
    bzdbDefinitionsByVariable,
  } = useMemo(() => {
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
    bzdbStoreDispatch({
      type: 'replace',
      store: world?._options?.['-set'] ?? {},
    });
  }, [world?._options]);

  const handleOnChange = (variable: string, value: string) => {
    const definition = bzdbDefinitionsByVariable[variable as BZDBType];

    if (value === definition?.default) {
      bzdbStoreDispatch({ type: 'delete', variable });
    } else {
      bzdbStoreDispatch({ type: 'edit', variable, value });
    }
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
      className={styles.modalBody}
      dialog={dialog}
      footer={
        <Button type="success" onClick={handleOnSave}>
          Save
        </Button>
      }
      title="BZDB Settings"
      onOpen={syncStateToWorld}
      hideOnEsc={false}
      hideOnClickOutside={false}
    >
      <TabList aria-label="BZDB Settings" className={styles.tabList} vertical>
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
    </ListenerModal>
  );
};

export default BZDBSettingsModal;
