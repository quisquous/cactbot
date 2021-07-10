import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// Ultima Weapon Ultimate
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  damageWarn: {
    'UWU Searing Wind': '2B5C',
    'UWU Eruption': '2B5A',
    'UWU Weight': '2B65',
    'UWU Landslide1': '2B70',
    'UWU Landslide2': '2B71',
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41',
    'UWU Slipstream': '2B53',
    'UWU Wicked Wheel': '2B4E',
    'UWU Wicked Tornado': '2B4F',
  },
  triggers: [
    {
      id: 'UWU Windburn',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'EB' }),
      suppressSeconds: 2,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Featherlance explosion.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'UWU Featherlance',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '2B43', ...playerDamageFields }),
      suppressSeconds: 5,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.source };
      },
    },
  ],
};

export default triggerSet;
