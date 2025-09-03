import { Document } from 'flexsearch';
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
import bzdbDocumentation, {
  BZDBDocType,
  BZDBDocumentor,
} from '../../Utilities/BZDBDocumentor';
import { documentState } from '../../atoms';
import { BZDBType } from '../../data/bzdb-types';
import { useDocumentSearch } from '../../hooks/useFlexSearch';
import Button from '../Button';
import BZDBEquationField from '../Form/BZDBEquationField';
import CheckboxField from '../Form/CheckboxField';
import TextField from '../Form/TextField';
import ListenerModal from '../ListenerModal';
import Markdown from '../Markdown';
import { Tab, TabList } from '../TabList';

import generalStyles from '../../sass/general.module.scss';
import styles from './BZDBSettingsModal.module.scss';

// https://github.com/BZFlag-Dev/bzflag/blob/a249151/src/common/StateDatabase.cxx#L252-L256
const FalsyValues = ['0', 'off', 'false', 'no', 'disable'];

function isTruthy(value: boolean | number | string | null): boolean {
  if (value == null) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const lower = typeof value === 'number' ? value + '' : value.toLowerCase();
  // Per BZFS behavior, if something isn't falsy as defined above, it's truthy
  return FalsyValues.indexOf(lower) === -1;
}

interface SettingEditorProps {
  onChange: (setting: string, value: any) => void;
  variable: Required<Pick<BZDBDocType, 'name' | 'defValue'>> &
    Partial<BZDBDocType>;
}

const SettingEditor = ({ onChange, variable }: SettingEditorProps) => {
  const [value, setValue] = useState<any>(variable.defValue);

  const renderEditor = (type: string) => {
    if (type === 'integer' || type === 'float' || type === 'string') {
      return (
        <BZDBEquationField
          label={variable.name}
          labelProps={{ className: 'sr-only' }}
          onChange={setValue}
          value={value}
        />
      );
    } else if (type === 'boolean') {
      return (
        <CheckboxField
          label={variable.name}
          onChange={(value: boolean) => setValue(value ? '1' : '0')}
          value={isTruthy(value)}
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
      {variable?.description && (
        <div className={generalStyles.descriptionLike}>
          <Markdown content={variable.description} inline />
        </div>
      )}
    </div>
  );
};

type BZDBStore = {
  custom: Record<string, string>;
  native: NonNullable<IOptions['-set']>;
};
type ReducerAction =
  | {
      type: 'replace';
      store: Record<string, string>;
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
  return produce(state, (draftState) => {
    if (action.type === 'delete' || action.type === 'edit') {
      const type = bzdbDocumentation.isNativeField(action.variable)
        ? 'native'
        : 'custom';

      if (action.type === 'edit') {
        draftState[type][action.variable] = action.value;
      } else if (action.type === 'delete') {
        delete draftState[type][action.variable];
      }
    } else if (action.type === 'replace') {
      const incomingState = action.store;

      Object.entries(incomingState).forEach(([key, value]) => {
        const type = bzdbDocumentation.isNativeField(key) ? 'native' : 'custom';
        draftState[type][key] = value;
      });
    }
  });
}
function bzdbInitialState(): BZDBStore {
  return {
    custom: {},
    native: {},
  };
}

const bzdbSearchIndex = new Document<BZDBDocType>({
  id: 'name',
  store: true,
  index: [
    {
      // @ts-expect-error - flexsearch types are wrong
      field: 'name',
      tokenize: 'reverse',
    },
    {
      // @ts-expect-error - flexsearch types are wrong
      field: 'description',
      tokenize: 'forward',
    },
  ],
});

bzdbDocumentation.forEach((variable) => {
  bzdbSearchIndex.add({ ...variable });
});

type MapByCategoryFunc = BZDBDocumentor['mapByCategory'];

const BZDBSettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const [bzdbStore, bzdbStoreDispatch] = useReducer(
    bzdbReducer,
    bzdbInitialState(),
  );
  const dialog = useDialogState();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newSettingName, setNewSettingName] = useState<string>('');
  const [newSettingValue, setNewSettingValue] = useState<string>('');
  const results = useDocumentSearch<BZDBDocType>(searchQuery, bzdbSearchIndex);
  const customSettings = useMemo(() => Object.entries(bzdbStore.custom), [
    bzdbStore.custom,
  ]);

  const syncStateToLocal = useCallback(() => {
    bzdbStoreDispatch({
      type: 'replace',
      store: world?._options?.['-set'] ?? {},
    });
  }, [world?._options]);

  const handleOnAddCustom = useCallback(() => {
    if (newSettingName.trim() === '') {
      return;
    }

    if (bzdbStore.custom.hasOwnProperty(newSettingName)) {
      return;
    }

    if (bzdbDocumentation.isNativeField(newSettingName)) {
      return;
    }

    bzdbStoreDispatch({
      type: 'edit',
      variable: newSettingName,
      value: newSettingValue,
    });
    setNewSettingName('');
    setNewSettingValue('');
  }, [bzdbStore.custom, newSettingName, newSettingValue]);
  const handleOnChange = (variable: string, value: string) => {
    const definition = bzdbDocumentation.store[variable as BZDBType];

    if (value === definition?.defValue) {
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
      draftWorld._options['-set'] = {
        ...bzdbStore.native,
        ...bzdbStore.custom,
      };
    });

    setBZWDocument(nextWorld);
    dialog.hide();
  };

  const [categories, mapEachInCategory] = useMemo<
    [string[], MapByCategoryFunc]
  >(() => {
    if (results.length === 0) {
      return [bzdbDocumentation.categories, bzdbDocumentation.mapByCategory];
    }

    const filteredView: Record<string, Record<string, BZDBDocType>> = {};

    results.forEach((resultSummary) => {
      resultSummary.result.forEach((result) => {
        if (!result.doc) {
          return;
        }

        if (!filteredView.hasOwnProperty(result.doc.category)) {
          filteredView[result.doc.category] = {};
        }

        filteredView[result.doc.category][result.doc.name] = result.doc;
      });
    });

    return [
      Object.keys(filteredView).sort(),
      (category, cb) => {
        return Object.values(filteredView[category]).map(cb);
      },
    ];
  }, [results]);

  const handleOnDeleteCustom = useCallback((fieldName: string) => {
    return () => {
      bzdbStoreDispatch({ type: 'delete', variable: fieldName });
    };
  }, []);

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
      fullWidth
      title="BZDB Settings"
      onOpen={syncStateToLocal}
      hideOnEsc={false}
      hideOnClickOutside={false}
    >
      <div>
        <TextField
          label="BZDB Settings Search"
          hideLabel
          onChange={setSearchQuery}
          placeholder="Search settings (e.g., _gravity, Agility, etc.)"
          value={searchQuery}
        />
      </div>
      <TabList aria-label="BZDB Settings" className={styles.tabList} vertical>
        {[
          ...categories.map((category) => (
            <Tab title={category} key={category}>
              {mapEachInCategory(category, (variable) => (
                <SettingEditor
                  key={variable.name}
                  onChange={handleOnChange}
                  variable={variable}
                />
              ))}
            </Tab>
          )),
          <Tab title="Custom" key="custom">
            {customSettings.map(([variable, value]) => (
              <div className="row">
                <div className="col">
                  <SettingEditor
                    key={variable}
                    onChange={handleOnChange}
                    variable={{
                      name: variable,
                      defValue: value,
                    }}
                  />
                </div>
                <div className="col-auto">
                  <Button
                    type="danger"
                    onClick={handleOnDeleteCustom(variable)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <div className="row">
              <div className="col">
                <TextField
                  label="New Custom BZDB Setting Name"
                  onChange={setNewSettingName}
                  value={newSettingName}
                />
              </div>
              <div className="col">
                <TextField
                  label="New Custom BZDB Setting Value"
                  onChange={setNewSettingValue}
                  value={newSettingValue}
                />
              </div>
              <div className="col-auto align-self-end">
                <Button type="success" onClick={handleOnAddCustom}>
                  Add Custom Setting
                </Button>
              </div>
            </div>
          </Tab>,
        ]}
      </TabList>
    </ListenerModal>
  );
};

export default BZDBSettingsModal;
