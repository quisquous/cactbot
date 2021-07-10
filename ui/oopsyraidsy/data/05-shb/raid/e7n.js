import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

const wrongBuff = (str) => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
    ja: str + ' (不適切なバフ)',
    cn: str + ' (Buff错了)',
    ko: str + ' (버프 틀림)',
  };
};

const noBuff = (str) => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
    ja: str + ' (バフ無し)',
    cn: str + ' (没有Buff)',
    ko: str + '(버프 없음)',
  };
};

export default {
  zoneId: ZoneId.EdensVerseIconoclasm,
  damageWarn: {
    'E7N Stygian Sword': '4C55', // Circle ground AoEs after False Twilight
    'E7N Strength In Numbers Donut': '4C4C', // Large donut ground AoEs, intermission
    'E7N Strength In Numbers 2': '4C4D', // Large circle ground AoEs, intermission
  },
  shareWarn: {
    'E7N Stygian Stake': '4C33', // Laser tank buster, outside intermission phase
    'E5N Silver Shot': '4E7D', // Spread markers, intermission
  },
  triggers: [
    {
      id: 'E7N Astral Effect Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BE' }),
      run: (data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = true;
      },
    },
    {
      id: 'E7N Astral Effect Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8BE' }),
      run: (data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = false;
      },
    },
    {
      id: 'E7N Umbral Effect Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BF' }),
      run: (data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = true;
      },
    },
    {
      id: 'E7N Umbral Effect Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8BF' }),
      run: (data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = false;
      },
    },
    {
      id: 'E7N Light\'s Course',
      netRegex: NetRegexes.abilityFull({ id: ['4C3E', '4C40', '4C22', '4C3C', '4E63'], ...playerDamageFields }),
      condition: (data, matches) => {
        return !data.hasUmbral || !data.hasUmbral[matches.target];
      },
      mistake: (data, matches) => {
        if (data.hasAstral && data.hasAstral[matches.target])
          return { type: 'fail', blame: matches.target, text: wrongBuff(matches.ability) };
        return { type: 'warn', blame: matches.target, text: noBuff(matches.ability) };
      },
    },
    {
      id: 'E7N Darks\'s Course',
      netRegex: NetRegexes.abilityFull({ id: ['4C3D', '4C23', '4C41', '4C43'], ...playerDamageFields }),
      condition: (data, matches) => {
        return !data.hasAstral || !data.hasAstral[matches.target];
      },
      mistake: (data, matches) => {
        if (data.hasUmbral && data.hasUmbral[matches.target])
          return { type: 'fail', blame: matches.target, text: wrongBuff(matches.ability) };
        // This case is probably impossible, as the debuff ticks after death,
        // but leaving it here in case there's some rez or disconnect timing
        // that could lead to this.
        return { type: 'warn', blame: matches.target, text: noBuff(matches.ability) };
      },
    },
  ],
};
