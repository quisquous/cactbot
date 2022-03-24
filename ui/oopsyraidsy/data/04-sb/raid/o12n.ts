import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// O12N - Alphascape 4.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV40,
  damageWarn: {
    'O12N Floodlight': '3309', // targeted circular aoes after Program Alpha
    'O12N Efficient Bladework': '32FF', // telegraphed centered circle
    'O12N Efficient Bladework Untelegraphed': '32F3', // centered circle after transformation
    'O12N Optimized Blizzard III': '3303', // cross aoe
    'O12N Superliminal Steel 1': '3306', // sides of the room
    'O12N Superliminal Steel 2': '3307', // sides of the room
    'O12N Beyond Strength': '3300', // donut
    'O12N Optical Laser': '3320', // line aoe from eye
    'O12N Optimized Sagittarius Arrow': '3323', // line aoe from Omega-M
  },
  shareWarn: {
    'O12N Solar Ray': '330F', // circular tankbuster
  },
  soloWarn: {
    'O12N Spotlight': '330A', // stack marker
  },
  triggers: [
    {
      id: 'O12N Discharger Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '32F6' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
