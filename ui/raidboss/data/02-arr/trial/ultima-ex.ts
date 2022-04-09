import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  plasmTargets?: Array<string>;
  boomCounter: number;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladUltimasBane,
  timelineFile: 'ultima-ex.txt',
  initData: () => {
    return {
      plasmTargets: [],
      boomCounter: 1,
    };
  },
  timelineTriggers: [
    {
      // Early Callout for Tank Cleave
      id: 'Ultima EX Homing Lasers',
      regex: /Homing Lasers/,
      beforeSeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Off-tank cleave',
          fr: 'Off-tank cleave',
        },
      },
    },
    {
      id: 'Ultima EX Vulcan Burst',
      regex: /Vulcan Burst/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Melee knockback',
          fr: 'Poussée',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Ultima EX Tank Purge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5EA', source: 'The Ultima Weapon', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      // At 5 stacks of Viscous Aetheroplasm, the target begins taking massive damage.
      id: 'Ultima EX Viscous Aetheroplasm',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '171', count: '04', capture: false }),
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankSwap,
      },
    },
    {
      id: 'Ultima EX Homing Aetheroplasm Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '672' }),
      run: (data, matches) => {
        data.plasmTargets = data.plasmTargets ??= [];
        data.plasmTargets.push(matches.target);
      },
    },
    {
      // This ability is ARR 2.0's version of headmarkers. No associated 27 lines are present.
      // These lines are sent by entities with no name and no 03/04 lines.
      id: 'Ultima EX Homing Aetheroplasm Call',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '672', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.plasmTargets?.includes(data.me))
          return output.target!();
        return output.avoid!();
      },
      outputStrings: {
        target: {
          en: 'Homing Aetheroplasm on YOU',
          fr: 'Laser + Éthéroplasma sur VOUS',
        },
        avoid: {
          en: 'Avoid Homing Aetheroplasm',
          fr: 'Évitez le laser + l\'Éthéroplasma',
        },
      },
    },
    {
      id: 'Ultima EX Homing Aetheroplasm Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '672', capture: false }),
      suppressSeconds: 5,
      run: (data) => delete data.plasmTargets,
    },
    {
      // We use a StartsUsing line here because we can't use timeline triggers for this,
      // and we want to warn players as early as possible.
      id: 'Ultima EX Aetheric Boom',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5E7', source: 'The Ultima Weapon', capture: false }),
      alarmText: (data, _matches, output) => output[`boom${data.boomCounter}`]!(),
      run: (data) => data.boomCounter += 1,
      outputStrings: {
        boom1: {
          en: 'Orbs: Cardinals',
          fr: 'Orbes : Cardinaux',
        },
        boom2: {
          en: 'Orbs: Cardinals (N/S first)',
          fr: 'Orbes : Cardinaux (N/S en premier)',
        },
        boom3: {
          en: 'Orbs: Intercardinals',
          fr: 'Orbes : Intercardinaux',
        },
      },
    },
  ],
};

export default triggerSet;
