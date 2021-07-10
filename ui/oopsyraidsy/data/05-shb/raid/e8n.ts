import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.EdensVerseRefulgence,
  damageWarn: {
    'E8N Biting Frost': '4DDB', // 270-degree frontal AoE, Shiva
    'E8N Driving Frost': '4DDC', // Rear cone AoE, Shiva
    'E8N Frigid Stone': '4E66', // Small spread circles, phase 1
    'E8N Reflected Axe Kick': '4E00', // Large circle AoE, Frozen Mirror
    'E8N Reflected Scythe Kick': '4E01', // Donut AoE, Frozen Mirror
    'E8N Frigid Eruption': '4E09', // Small circle AoE puddles, phase 1
    'E8N Icicle Impact': '4E0A', // Large circle AoE puddles, phase 1
    'E8N Axe Kick': '4DE2', // Large circle AoE, Shiva
    'E8N Scythe Kick': '4DE3', // Donut AoE, Shiva
    'E8N Reflected Biting Frost': '4DFE', // 270-degree frontal AoE, Frozen Mirror
    'E8N Reflected Driving Frost': '4DFF', // Cone AoE, Frozen Mirror
  },
  damageFail: {
  },
  triggers: [
    {
      id: 'E8N Shining Armor',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '95' }),
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      id: 'E8N Heavenly Strike',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '4DD8', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Pushed off!',
            de: 'Runter gestoßen!',
            fr: 'A été poussé(e) !',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백됨!',
          },
        };
      },
    },
    {
      id: 'E8N Frost Armor',
      type: 'GainsEffect',
      // Thin Ice
      netRegex: NetRegexes.gainsEffect({ effectId: '38F' }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Slid off!',
            de: 'runtergerutscht!',
            fr: 'A glissé(e) !',
            ja: '滑った',
            cn: '滑落',
            ko: '미끄러짐!',
          },
        };
      },
    },
  ],
};

export default triggerSet;
