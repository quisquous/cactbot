import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Triggers applicable to all Heaven-on-High floors.

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: [
    ZoneId.HeavenOnHighFloors1_10,
    ZoneId.HeavenOnHighFloors11_20,
    ZoneId.HeavenOnHighFloors21_30,
    ZoneId.HeavenOnHighFloors31_40,
    ZoneId.HeavenOnHighFloors41_50,
    ZoneId.HeavenOnHighFloors51_60,
    ZoneId.HeavenOnHighFloors61_70,
    ZoneId.HeavenOnHighFloors71_80,
    ZoneId.HeavenOnHighFloors81_90,
    ZoneId.HeavenOnHighFloors91_100,
  ],
  zoneLabel: {
    en: 'Heaven-on-High (All Floors)',
  },

  triggers: [
    // ---------------- Quivering Coffers ----------------
    {
      id: 'HoH General Quivering Coffer Spawn',
      // 7394 = Quivering Coffer
      // TODO: some Quivering Coffers may spawn after transference between floors and get called early before being found
      type: 'AddedCombatant',
      netRegex: { npcNameId: '7394', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Quivering Coffer spawned!',
        },
      },
    },
    {
      id: 'HoH General Quivering Coffer Malice',
      // gives Accursed Pox (43F) if not interrupted
      type: 'StartsUsing',
      netRegex: { id: '3019', source: 'Quivering Coffer' },
      response: Responses.interrupt(),
    },
    // ---------------- Pomanders and Magicite ----------------
    {
      id: 'HoH General Pomander Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/7222?pretty=true
      // en: You return the pomander of ${pomander} to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '1C36' },
      infoText: (_data, matches, output) => {
        switch (parseInt(matches.param1, 16)) {
          case 1:
            return output.duplicate!({ pomander: output.safety!() });
          case 2:
            return output.duplicate!({ pomander: output.sight!() });
          case 3:
            return output.duplicate!({ pomander: output.strength!() });
          case 4:
            return output.duplicate!({ pomander: output.steel!() });
          case 5:
            return output.duplicate!({ pomander: output.affluence!() });
          case 6:
            return output.duplicate!({ pomander: output.flight!() });
          case 7:
            return output.duplicate!({ pomander: output.alteration!() });
          case 8:
            return output.duplicate!({ pomander: output.purity!() });
          case 9:
            return output.duplicate!({ pomander: output.fortune!() });
          case 10:
            return output.duplicate!({ pomander: output.witching!() });
          case 11:
            return output.duplicate!({ pomander: output.serenity!() });
          case 12:
            return output.duplicate!({ pomander: output.rage!() });
          case 13:
            return output.duplicate!({ pomander: output.lust!() });
          case 14:
            return output.duplicate!({ pomander: output.intuition!() });
          case 15:
            return output.duplicate!({ pomander: output.raising!() });
          case 16:
            return output.duplicate!({ pomander: output.resolution!() });
          case 17:
            return output.duplicate!({ pomander: output.frailty!() });
          case 18:
            return output.duplicate!({ pomander: output.concealment!() });
          case 19:
            return output.duplicate!({ pomander: output.petrification!() });
        }
      },
      outputStrings: {
        duplicate: {
          en: '${pomander} duplicate',
        },
        // pomanders: https://xivapi.com/deepdungeonItem?pretty=true
        safety: {
          en: 'Safety',
        },
        sight: {
          en: 'Sight',
        },
        strength: {
          en: 'Strength',
        },
        steel: {
          en: 'Steel',
        },
        affluence: {
          en: 'Affluence',
        },
        flight: {
          en: 'Flight',
        },
        alteration: {
          en: 'Alteration',
        },
        purity: {
          en: 'Purity',
        },
        fortune: {
          en: 'Fortune',
        },
        witching: {
          en: 'Witching',
        },
        serenity: {
          en: 'Serenity',
        },
        rage: {
          en: 'Rage',
        },
        lust: {
          en: 'Lust',
        },
        intuition: {
          en: 'Intuition',
        },
        raising: {
          en: 'Raising',
        },
        resolution: {
          en: 'Resolution',
        },
        frailty: {
          en: 'Frailty',
        },
        concealment: {
          en: 'Concealment',
        },
        petrification: {
          en: 'Petrification',
        },
      },
    },
    {
      id: 'HoH General Magicite Duplicate',
      // duplicate item message: https://xivapi.com/LogMessage/9208?pretty=true
      // en: You return the splinter of ${magicite} magicite to the coffer. You cannot carry any more of that item.
      type: 'SystemLogMessage',
      netRegex: { id: '23F8' },
      infoText: (_data, matches, output) => {
        switch (parseInt(matches.param1, 16)) {
          case 1:
            return output.duplicate!({ magicite: output.inferno!() });
          case 2:
            return output.duplicate!({ magicite: output.crag!() });
          case 3:
            return output.duplicate!({ magicite: output.vortex!() });
          case 4:
            return output.duplicate!({ magicite: output.elder!() });
        }
      },
      outputStrings: {
        duplicate: {
          en: '${magicite} duplicate',
        },
        // magicite: https://xivapi.com/DeepDungeonMagicStone?pretty=true
        inferno: {
          en: 'Inferno',
        },
        crag: {
          en: 'Crag',
        },
        vortex: {
          en: 'Vortex',
        },
        elder: {
          en: 'Elder',
        },
      },
    },
    // ---------------- Floor Notifications ----------------
    {
      id: 'HoH General Beacon of Passage',
      // portal to transfer between floors
      // Beacon of Passage activation message: https://xivapi.com/LogMessage/7245?pretty=true
      // en: The Beacon of Passage is activated!
      type: 'SystemLogMessage',
      netRegex: { id: '1C4D', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Beacon of Passage activated',
        },
      },
    },
  ],
};

export default triggerSet;
