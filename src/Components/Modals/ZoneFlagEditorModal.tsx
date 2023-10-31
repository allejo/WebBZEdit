import produce from 'immer';
import React, { useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { documentState } from '../../atoms';
import { IZone } from '../../Document/Obstacles/Zone';
import {
	ZoneEditorOpenEvent,
	ZoneEditorOpenEventName,
} from '../../Events/IZoneEditorOpenEvent';
import Alert, { AlertType } from '../Alert';
import Button from '../Button';
import FlagListEditor from '../FlagListEditor';
import ListenerModal from '../ListenerModal';
import Markdown from '../Markdown';

const ZoneFlagEditorModal = () => {
	const dialog = useDialogState();
	const [world, setBZWDocument] = useRecoilState(documentState);
	const [flagsDraft, setFlagsDraft] = useState<null | [string, number][]>(null);

	return (
		<ListenerModal<ZoneEditorOpenEvent>
			dialog={dialog}
			event={ZoneEditorOpenEventName}
			hideOnClickOutside={false}
			hideOnEsc={false}
			title="Zone Flag Editor"
		>
			{(eventData) => {
				if (!eventData) {
					return (
						<Alert type={AlertType.Danger} header="Modal Open Error">
							This modal was opened without any event data. Please report this
							as a bug.
						</Alert>
					);
				}

				const isRegularFlagEditor = eventData.getEditorMode() === 'flag';
				const zone = eventData.getZone();
				let flags = flagsDraft ?? zone.zoneflag;

				// Only do this map if we haven't made edits yet, otherwise we use our
				// array of draft edits.
				if (isRegularFlagEditor && !flagsDraft) {
					flags = zone.flag.map((f) => [f, -1]);
				}

				const handleSaveClick = () => {
					const nextWorld = produce(world, (draftWorld) => {
						if (!draftWorld) {
							return;
						}

						// If we don't have any modifications to our flags, then bail out
						if (flagsDraft === null) {
							return;
						}

						const updatedZone = draftWorld.children[zone._uuid] as IZone;

						if (isRegularFlagEditor) {
							updatedZone.flag = flagsDraft.map((def) => def[0]);
						} else {
							updatedZone.zoneflag = flagsDraft;
						}

						draftWorld.children[zone._uuid] = updatedZone;
					});

					setBZWDocument(nextWorld);
					dialog.hide();
				};

				const description = isRegularFlagEditor ? (
					<Markdown className="fc-muted fs-small">
						Map-wide flag settings (i.e. `+f` or `-f`) specify the number of
						each flag that **may** exist on the map at any given time; these
						settings allow these map-wide flags to spawn in this zone. There is
						no guarantee that these flags will be found in this zone; if you're
						looking for a guarantee, use "Zone Flags" instead.
					</Markdown>
				) : (
					<Markdown className="fc-muted fs-small">
						The specified amount of each of these flags will **always** spawn
						inside this zone, regardless of map-wide flag settings (i.e. `+f` or
						`-f`).
					</Markdown>
				);

				return [
					<>
						{description}

						<FlagListEditor
							allowCount={!isRegularFlagEditor}
							flags={flags}
							onChange={setFlagsDraft}
						/>
					</>,
					<Button type="success" onClick={handleSaveClick}>
						Save
					</Button>,
				];
			}}
		</ListenerModal>
	);
};

export default ZoneFlagEditorModal;
