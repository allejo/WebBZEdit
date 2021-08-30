import { IBaseObject } from '../Obstacles/BaseObject';
import {
  Accelerations,
  BZDBSetting,
  FlagCount,
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

export const HeaderWriters: Record<string, (o: IBaseObject & any) => string> = {
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
    '+f': (fc: FlagCount[]) =>
      fc.map((f) => `+f ${f.flag}` + (f.count > 1 ? `{${f.count}}` : '')),
    '-f': (fs: string[]) => fs.map((f) => `-f ${f}`),
    '-loadplugin': (ps: string[]) => ps.map((p) => `-loadplugin ${p}`),
    '-mp': (m: MaxPlayers) => {
      let response = '';

      if ('total' in m) {
        response = m.total + '';
      } else {
        response = [m.rogue, m.red, m.green, m.blue, m.purple, m.observer].join(
          ',',
        );
      }

      return `-mp ${response}`;
    },
    '-set': (set: BZDBSetting[]) => set.map((s) => `-set ${s.name} ${s.value}`),
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
