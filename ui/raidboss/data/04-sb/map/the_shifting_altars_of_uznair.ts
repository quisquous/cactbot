import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: confirm Abharamu npcNameId
// TODO: Gold Whisker (bonus treasure mob)
// TODO: summons

const uznairOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    cn: '正在生成 ${name}!',
    ko: '${name} 등장!',
  },
  adds: {
    en: 'Adds soon',
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
      // 6568 = Abharamu
      type: 'AddedCombatant',
      netRegex: { npcNameId: '6568' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: uznairOutputStrings.spawn,
      },
    },
    {
      id: 'Shifting Altars of Uznair Altar Assembly Spawn',
      // 7604 = Altar Onion
      // 7605 = Altar Egg
      // 7606 = Altar Garlic
      // 7607 = Altar Tomato
      // 7608 = Altar Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: '760[4-8]', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Altar Assembly spawned, kill in order!',
        },
      },
    },
    // ---------------- lesser summons ----------------
    {
      id: 'Shifting Altars of Uznair Altar Chimera Ram\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '3452', source: 'Altar Chimera', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Chimera Dragon\'s Voice',
      type: 'StartsUsing',
      netRegex: { id: '3453', source: 'Altar Chimera', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'Shifting Altars of Uznair Altar Kelpie Torpedo',
      type: 'StartsUsing',
      netRegex: { id: '347E', source: 'Altar Kelpie' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Kelpie Rising Seas',
      type: 'StartsUsing',
      netRegex: { id: '3480', source: 'Altar Kelpie', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Kelpie Hydro Push',
      type: 'StartsUsing',
      netRegex: { id: '3482', source: 'Altar Kelpie', capture: false },
      response: Responses.getBehind(),
    },
    // ---------------- greater summons ----------------
    {
      id: 'Shifting Altars of Uznair The Winged Sideslip',
      type: 'StartsUsing',
      netRegex: { id: '3444', source: 'The Winged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Shifting Altars of Uznair The Older One Mystic Flash',
      type: 'StartsUsing',
      netRegex: { id: '3449', source: 'The Older One' },
      response: Responses.tankBuster(),
    },
    // frond affeared look away
    // ??? tankbuster
    // implosion aoe
    // hold tankbuster
    // boneshaker aoe
    // proximity aoe
    // ---------------- elder summons ----------------
    {
      id: 'Shifting Altars of Uznair Altar Mandragora Optical Intrusion',
      type: 'StartsUsing',
      netRegex: { id: '3437', source: 'Altar Mandragora' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Shifting Altars of Uznair Altar Mandragora Saibai Mandragora',
      type: 'StartsUsing',
      netRegex: { id: '343A', source: 'Altar Mandragora', capture: false },
      infoText: (_data, _matches, output) => output.adds!(),
      outputStrings: {
        adds: uznairOutputStrings.adds,
      },
    },
    // huff tankbuster
    // knockback into spin cone
  ],
};

export default triggerSet;
