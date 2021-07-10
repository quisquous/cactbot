import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: missing an orb during tornado phase
// TODO: jumping in the tornado damage??
// TODO: taking sungrace(4C80) or moongrace(4C82) with wrong debuff
// TODO: stygian spear/silver spear with the wrong debuff
// TODO: taking explosion from the wrong Chiaro/Scuro orb
// TODO: handle 4C89 Silver Stake tankbuster 2nd hit, as it's ok to have two in.

const wrongBuff = (str: string) => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
    ja: str + ' (不適切なバフ)',
    cn: str + ' (Buff错了)',
    ko: str + ' (버프 틀림)',
  };
};

const noBuff = (str: string) => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
    ja: str + ' (バフ無し)',
    cn: str + ' (没有Buff)',
    ko: str + ' (버프 없음)',
  };
};

export interface Data extends OopsyData {
  hasAstral?: { [name: string]: boolean };
  hasUmbral?: { [name: string]: boolean };
}

const triggerSet: OopsyTriggerSet<Data> = {
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
  shareWarn: {
    'E7S Stygian Stake': '4C34', // Laser tank buster 1
    'E7S Silver Shot': '4C92', // Spread markers
    'E7S Silver Scourge': '4C93', // Ice markers
    'E7S Chiaro Scuro Explosion 1': '4D14', // orb explosion
    'E7S Chiaro Scuro Explosion 2': '4D15', // orb explosion
  },
  triggers: [
    {
      // Interrupt
      id: 'E7S Advent Of Light',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '4C6E' }),
      mistake: (_data, matches) => {
        // TODO: is this blame correct? does this have a target?
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'E7S Astral Effect Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BE' }),
      run: (data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = true;
      },
    },
    {
      id: 'E7S Astral Effect Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '8BE' }),
      run: (data, matches) => {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[matches.target] = false;
      },
    },
    {
      id: 'E7S Umbral Effect Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BF' }),
      run: (data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = true;
      },
    },
    {
      id: 'E7S Umbral Effect Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '8BF' }),
      run: (data, matches) => {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[matches.target] = false;
      },
    },
    {
      id: 'E7S Light\'s Course',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: ['4C62', '4C63', '4C64', '4C5B', '4C5F'], ...playerDamageFields }),
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
      id: 'E7S Darks\'s Course',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: ['4C65', '4C66', '4C67', '4C5A', '4C60'], ...playerDamageFields }),
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
    {
      id: 'E7S Crusade Knockback',
      type: 'Ability',
      // 4C76 is the knockback damage, 4C58 is the damage for standing on the puck.
      netRegex: NetRegexes.abilityFull({ id: '4C76', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          text: {
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

export default triggerSet;
