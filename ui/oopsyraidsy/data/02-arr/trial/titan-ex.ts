import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// Titan Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheNavelExtreme,
  damageWarn: {
    'TitanEx Weight Of The Land': '5BE',
    'TitanEx Burst': '5BF',
  },
  damageFail: {
    'TitanEx Landslide': '5BB',
    'TitanEx Gaoler Landslide': '5C3',
  },
  shareWarn: {
    'TitanEx Rock Buster': '5B7',
  },
  shareFail: {
    'TitanEx Mountain Buster': '5B8',
  },
  triggers: [
    {
      id: 'TitanEx Landslide',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '5BB', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'Repoussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
            ko: '넉백됨',
          },
        };
      },
    },
  ],
};

export default triggerSet;
