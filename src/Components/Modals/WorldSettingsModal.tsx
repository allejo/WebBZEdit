import produce from 'immer';
import React, { useCallback, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { documentState } from '../../atoms';
import { WorldSettingsModalOpenEventName } from '../../Events/IWorldSettingsModalOpenEvent';
import Button from '../Button';
import CheckboxField from '../Form/CheckboxField';
import NumberField from '../Form/NumberField';
import { positiveOnly } from '../Form/Validators';
import ListenerModal from '../ListenerModal';

const DEFAULT_WORLD_SIZE = 400;
const DEFAULT_NO_WALLS = false;
const DEFAULT_FREE_CTF_SPAWNS = false;

const WorldSettingsModal = () => {
	const [world, setBZWDocument] = useRecoilState(documentState);
	const dialog = useDialogState();

	const [size, setSize] = useState(DEFAULT_WORLD_SIZE);
	const [noWalls, setNoWalls] = useState(DEFAULT_NO_WALLS);
	const [freeCtfSpawns, setFreeCtfSpawns] = useState(DEFAULT_FREE_CTF_SPAWNS);

	// Our state is used to keep track of changes that will be made to the BZW
	// document, changes are queued up and only applied when the "Save" button is
	// hit. Sync our state to the current BZW Document so that we can display the
	// most up to date values to the user.
	const syncStateToWorld = useCallback(() => {
		setSize(world?.size ?? DEFAULT_WORLD_SIZE);
		setNoWalls(world?.nowalls ?? DEFAULT_NO_WALLS);
		setFreeCtfSpawns(world?.freectfspawns ?? DEFAULT_FREE_CTF_SPAWNS);
	}, [world?.size, world?.nowalls, world?.freectfspawns]);

	const handleOnClickSave = () => {
		if (!world) {
			return;
		}

		const nextWorld = produce(world, (draftWorld) => {
			draftWorld.size = size;
			draftWorld.nowalls = noWalls;
			draftWorld.freectfspawns = freeCtfSpawns;
		});

		setBZWDocument(nextWorld);
		dialog.hide();
	};

	return (
		<ListenerModal
			event={WorldSettingsModalOpenEventName}
			dialog={dialog}
			footer={
				<Button type="success" onClick={handleOnClickSave}>
					Save
				</Button>
			}
			title="World Settings"
			hideOnEsc={false}
			hideOnClickOutside={false}
			onOpen={syncStateToWorld}
		>
			<div className="row mb-3">
				<div className="col-md-6">
					<NumberField
						label="World Size"
						onChange={setSize}
						value={size}
						allowChange={positiveOnly}
						description="The length and width (because all maps are a square) of the map in World Units (wu)."
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<CheckboxField
						label="No Walls"
						onChange={setNoWalls}
						value={noWalls}
						description="Do not render walls at the edges of the map. If players drive past the edge of the map, they will be kicked. You will need to create your own walls."
					/>
				</div>
				<div className="col-md-6">
					<CheckboxField
						label="Free CTF Spawns"
						onChange={setFreeCtfSpawns}
						value={freeCtfSpawns}
						description="On a CTF map, a player will spawn at their base on join and after their team flag has been captured. With 'free CTF spawns' enabled, players will spawn randomly on the map or on specified zone objects."
					/>
				</div>
			</div>
		</ListenerModal>
	);
};

export default WorldSettingsModal;
