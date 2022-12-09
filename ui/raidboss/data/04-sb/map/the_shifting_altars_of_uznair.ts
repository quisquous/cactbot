import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Gold Whisker (bonus treasure mob)
// TODO: Abharamu (bonus treasure mob)
// TODO: Altar Assembly (bonus treasure mobs)
// TODO: summons

const uznairOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '正在生成 ${name}!',
    ko: '${name} 등장!',
  },
} as const;

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheShiftingAltarsOfUznair,

  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Shifting Altars of Uznair Gold Whisker Spawn',
      // xxxx = Gold Whisker
      type: 'AddedCombatant',
      netRegex: { npcNameId: '' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Altars of Uznair Abharamu Spawn',
      // xxxx = Abharamu
      type: 'AddedCombatant',
      netRegex: { npcNameId: '' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Assembly Spawn',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Altar Assembly spawned, kill in order!',
        },
      },
    },
    // ---------------- lesser summons ----------------
    // ---------------- greater summons ----------------
    // ---------------- elder summons ----------------
  ],
};

export default triggerSet;
