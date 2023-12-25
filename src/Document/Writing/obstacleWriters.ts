import { MapObjectHeader } from '../contracts';
import { IBaseObject } from '../Obstacles/BaseObject';
import {
	Accelerations,
	FlagCount,
	IOptions,
	MaxPlayers,
	ShotLimit,
} from '../Obstacles/Option';
import { ITeleporter } from '../Obstacles/Teleporter';
import { TeleporterReference } from '../Obstacles/TeleporterLink';

export const AttributePriority: Record<string, Record<string, number>> = {
	_global: {
		name: -1,
		drivethrough: 50,
		shootthrough: 51,
		passable: 52,
		matref: 60,
	},
	mesh: {
		children: 100,
	},
};

export const HeaderWriters: Record<
	MapObjectHeader,
	(o: IBaseObject) => string
> = {
	teleporter: (tele: ITeleporter) => `${tele._objectType} ${tele.name}`,
};

export const AttributeWriters: Record<
	string,
	Record<string, (v: any) => string | string[]>
> = {
	link: {
		from: (r: TeleporterReference) => `from ${r.name}:${r.side}`,
		to: (r: TeleporterReference) => `to ${r.name}:${r.side}`,
	},
	options: {
		'-a': (a: Accelerations) => `-a ${a.linear} ${a.angular}`,
		'-admsg': (am: string[]) => am.map((m) => `-admsg "${m}"`),
		'+f': (fc: FlagCount[]) => {
			return fc.map((f) => `+f ${f.flag}${f.count > 1 ? `{${f.count}}` : ''}`);
		},
		'-f': (fs: string[]) => fs.map((f) => `-f ${f}`),
		'-loadplugin': (ps: string[]) => ps.map((p) => `-loadplugin ${p}`),
		'-mp': (m: MaxPlayers) => {
			let response = '';

			if ('total' in m) {
				response = String(m.total);
			} else {
				const { rogue, red, green, blue, purple, observer } = m;
				response = [rogue, red, green, blue, purple, observer].join(',');
			}

			return `-mp ${response}`;
		},
		'-set': (set: IOptions['-set']) => {
			return Object.entries(set ?? {}).map(([key, value]) => {
				return `-set ${key} ${value}`;
			});
		},
		'-sl': (sl: ShotLimit[]) => sl.map((s) => `-sl ${s.flag} ${s.num}`),
		'-srvmsg': (msgs: string[]) => msgs.map((m) => `-srvmsg "${m}"`),
	},
};

export const FooterWriters: typeof HeaderWriters = {};

export const IgnoredAttributes: Record<string, string[]> = {
	_global: [],
	face: [], // Mesh Face
	mesh: ['faces'],
	teleporter: ['name'],
};
