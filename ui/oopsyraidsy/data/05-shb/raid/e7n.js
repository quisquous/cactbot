import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

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
  damageFail: {
  },
  triggers: [
    {
      id: 'E7N Stygian Stake', // Laser tank buster, outside intermission phase
      damageRegex: '4C33',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5N Silver Shot', // Spread markers, intermission
      damageRegex: '4E7D',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E7N Astral Effect Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = true;
      },
    },
    {
      id: 'E7N Astral Effect Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = false;
      },
    },
    {
      id: 'E7N Umbral Effect Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = true;
      },
    },
    {
      id: 'E7N Umbral Effect Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = false;
      },
    },
    {
      id: 'E7N Light\'s Course',
      damageRegex: ['4C3E', '4C40', '4C22', '4C3C', '4E63'],
      condition: (e, data) => {
        return !data.hasUmbral || !data.hasUmbral[e.targetName];
      },
      mistake: (e, data) => {
        if (data.hasAstral && data.hasAstral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7N Darks\'s Course',
      damageRegex: ['4C3D', '4C23', '4C41', '4C43'],
      condition: (e, data) => {
        return !data.hasAstral || !data.hasAstral[e.targetName];
      },
      mistake: (e, data) => {
        if (data.hasUmbral && data.hasUmbral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        // This case is probably impossible, as the debuff ticks after death,
        // but leaving it here in case there's some rez or disconnect timing
        // that could lead to this.
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
  ],
};
