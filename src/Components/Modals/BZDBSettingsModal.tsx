import React, { useCallback, useMemo } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { BZDBSettingsModalOpenEventName } from '../../Events/IBZDBSettingsModalOpenEvent';
import { documentState } from '../../atoms';
import { BZDBType } from '../../data/bzdb-types';
import ListenerModal from '../ListenerModal';
import { Tab, TabList } from '../TabList';

import BZDBDocs from '../../data/bzdb-documention.json';

type BZDBVariableType = typeof BZDBDocs.variables[number];

const BZDBSettingsModal = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const dialog = useDialogState();

  const { bzdbCategories, bzdbDefinitions } = useMemo(() => {
    const groupedByCat: Record<string, BZDBVariableType> = {};
    const mappedByVariable: Partial<Record<BZDBType, BZDBVariableType>> = {};

    BZDBDocs.variables.forEach((variable) => {
      groupedByCat[variable.category ?? 'Miscellaneous'] = variable;
      mappedByVariable[variable.name as BZDBType] = variable;
    });

    return {
      bzdbDefinitions: groupedByCat,
      bzdbCategories: Object.keys(groupedByCat).sort(),
      bzdbVariables: mappedByVariable,
    };
  }, []);

  const syncStateToWorld = useCallback(() => {
    const sets = world?._options?.['-set'] ?? {};
  }, [world?._options]);

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
            ...
          </Tab>
        ))}
      </TabList>
    </ListenerModal>
  );
};

export default BZDBSettingsModal;
