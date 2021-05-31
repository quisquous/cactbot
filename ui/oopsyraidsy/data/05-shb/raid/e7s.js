import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

// TODO: missing an orb during tornado phase
// TODO: jumping in the tornado damage??
// TODO: taking sungrace(4C80) or moongrace(4C82) with wrong debuff
// TODO: stygian spear/silver spear with the wrong debuff
// TODO: taking explosion from the wrong Chiaro/Scuro orb
// TODO: handle 4C89 Silver Stake tankbuster 2nd hit, as it's ok to have two in.

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
    ko: str + ' (버프 없음)',
  };
};

export default {
  zoneId: ZoneId.EdensVerseIconoclasmSavage,
  damageWarn: {
    'E7S Silver Sword': '4C8E', // ground aoe
    'E7S Overwhelming Force': '4C73', // add phase ground aoe
    'E7S Strength in Numbers 1': '4C70', // add get under
    'E7S Strength in Numbers 2': '4C71', // add get out
    'E7S Paper Cut': '4C7D', // tornado ground aoes
    'E7S Buffet': '4C77', // tornado ground aoes also??
  },
  damageFail: {
    'E7S Betwixt Worlds': '4C6B', // purple ground line aoes
    'E7S Crusade': '4C58', // blue knockback circle (standing in it)
    'E7S Explosion': '4C6F', // didn't kill an add
  },
  triggers: [
    {
      // Laser tank buster 1
      id: 'E7S Stygian Stake',
      damageRegex: '4C34',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Spread markers
      id: 'E7S Silver Shot',
      damageRegex: '4C92',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Ice markers
      id: 'E7S Silver Scourge',
      damageRegex: '4C93',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Orb Explosion
      id: 'E7S Chiaro Scuro Explosion',
      damageRegex: '4D1[45]',
      condition: (e) => e.type !== '15',
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // Interrupt
      id: 'E7S Advent Of Light',
      abilityRegex: '4C6E',
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E7S Astral Effect Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = true;
      },
    },
    {
      id: 'E7S Astral Effect Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8BE' }),
      run: (_e, data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = false;
      },
    },
    {
      id: 'E7S Umbral Effect Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = true;
      },
    },
    {
      id: 'E7S Umbral Effect Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '8BF' }),
      run: (_e, data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = false;
      },
    },
    {
      id: 'E7S Light\'s Course',
      damageRegex: ['4C62', '4C63', '4C64', '4C5B', '4C5F'],
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
      id: 'E7S Darks\'s Course',
      damageRegex: ['4C65', '4C66', '4C67', '4C5A', '4C60'],
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
    {
      id: 'E7S Crusade Knockback',
      // 4C76 is the knockback damage, 4C58 is the damage for standing on the puck.
      damageRegex: '4C76',
      deathReason: (e) => {
        return {
          type: 'fail',
          name: e.targetName,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
          },
        };
      },
    },
  ],
};
