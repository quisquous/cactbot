import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Triggers applicable to all Palace of the Dead floors.

export type Data = RaidbossData;

// pomanders: https://xivapi.com/deepdungeonItem?pretty=true
const pomanders = [
  'Safety',
  'Sight',
  'Strength',
  'Steel',
  'Affluence',
  'Flight',
  'Alteration',
  'Purity',
  'Fortune',
  'Witching',
  'Serenity',
  'Rage',
  'Lust',
  'Intuition',
  'Raising',
  'Resolution',
  'Frailty',
  'Concealment',
  'Petrification',
];

const triggerSet: TriggerSet<Data> = {
  zoneId: [
    ZoneId.ThePalaceOfTheDeadFloors1_10,
    ZoneId.ThePalaceOfTheDeadFloors11_20,
    ZoneId.ThePalaceOfTheDeadFloors21_30,
    ZoneId.ThePalaceOfTheDeadFloors31_40,
    ZoneId.ThePalaceOfTheDeadFloors41_50,
    ZoneId.ThePalaceOfTheDeadFloors51_60,
    ZoneId.ThePalaceOfTheDeadFloors61_70,
    ZoneId.ThePalaceOfTheDeadFloors71_80,
    ZoneId.ThePalaceOfTheDeadFloors81_90,
    ZoneId.ThePalaceOfTheDeadFloors91_100,
    ZoneId.ThePalaceOfTheDeadFloors101_110,
    ZoneId.ThePalaceOfTheDeadFloors111_120,
    ZoneId.ThePalaceOfTheDeadFloors121_130,
    ZoneId.ThePalaceOfTheDeadFloors131_140,
    ZoneId.ThePalaceOfTheDeadFloors141_150,
    ZoneId.ThePalaceOfTheDeadFloors151_160,
    ZoneId.ThePalaceOfTheDeadFloors161_170,
    ZoneId.ThePalaceOfTheDeadFloors171_180,
    ZoneId.ThePalaceOfTheDeadFloors181_190,
    ZoneId.ThePalaceOfTheDeadFloors191_200,
  ],

  triggers: [
    // ---------------- Mimics ----------------
    {
      id: 'PotD General Mimic Spawn',
      // 2566 = Mimic
      type: 'AddedCombatant',
      netRegex: { npcNameId: '2566', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mimic spawned!',
        },
      },
    },
    {
      id: 'PotD General Mimic Infatuation',
      // gives Accursed Pox (43F) if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '18FD', source: 'Mimic' },
      response: Responses.interrupt(),
    },
    // ---------------- Pomanders ----------------
    {
      id: 'PotD General Pomander Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/7222?pretty=true
      // en: You return the pomander of ${pomander} to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '1C36' },
      infoText: (_data, matches, output) => output.duplicate!({ pomander: pomanders[ parseInt(matches.param1, 16) ] }),
      outputStrings: {
        duplicate: {
          en: '${pomander} duplicate',
        },
      },
    },
    // ---------------- Floor Notifications ----------------
    {
      id: 'PotD General Cairn of Return',
      // resurrects dead players
      // Cairn of Return activation message: https://xivapi.com/LogMessage/7242?pretty=true
      // en: The Cairn of Return begins to glow!
      type: 'SystemLogMessage',
      netRegex: { id: '1C4A', capture: false },
      infoText: (_data, matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cairn of Return activated',
        },
      },
    },
    {
      id: 'PotD General Cairn of Passage',
      // portal to transfer between floors
      // Cairn of Passage activation message: https://xivapi.com/LogMessage/7245?pretty=true
      // en: The Cairn of Passage is activated!
      type: 'SystemLogMessage',
      netRegex: { id: '1C4D', capture: false },
      infoText: (_data, matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Cairn of Passage activated',
        },
      },
    },
    {
      id: 'PotD General Accursed Hoard',
      // Accursed Hoard on this floor message: https://xivapi.com/LogMessage/7272?pretty=true
      // it seems that this SystemLogMessage isn't sent if the Accursed Hoard message is sent
      //   immediately after transference (transfer between floors)
      // trigger off of the GameLog message instead
      // en: You sense the Accursed Hoard calling you...
      type: 'GameLog',
      netRegex: { line: 'You sense the Accursed Hoard calling you\.\.\.', capture: false },
      infoText: (_data, matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Accursed Hoard on this floor',
        },
      },
    },
  ],
};

export default triggerSet;
