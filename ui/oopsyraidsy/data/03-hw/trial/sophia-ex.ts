import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: failing Discordant Cleansing

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.ContainmentBayP1T6Extreme,
  damageWarn: {
    'SophiaEx Thunder II': '19B0', // untelegraphed front cleave
    'SophiaEx Aero III': '19AE', // "get out"
    'SophiaEx Thunder III': '19AC', // "get under"
    'SophiaEx Aion Teleos Execute 1': '19B1', // Thunder II duplication
    'SophiaEx Aion Teleos Execute 2': '19AF', // Aero III duplication
    'SophiaEx Aion Teleos Execute 3': '19AD', // Thunder III duplication
    'SophiaEx Gnosis': '19C2', // knockback
    'SophiaEx The Third Demiurge Ring of Pain': '19BA', // circle that leaves a frost puddle
    'SophiaEx The Third Demiurge Gnostic Spear': '19B9', // 270 degree untelegraphed cleave
    'SophiaEx Onrush': '19C1', // dash
    'SophiaEx Barbelo Light Dew Execute': '19BF', // line laser from Barbelo head during Execuute
    'SophiaEx Barbelo Light Dew Onrush': '19C0', // line laser from Barbelo head during Onrush
  },
  damageFail: {
    'SophiaEx The First Demiurge Revengeance': '19BD', // hitting Vertical/Horizontal Kenoma
  },
  gainsEffectWarn: {
    'SophiaEx Frostbite': '25D', // standing in the frost puddle from the Third Demiurge
  },
  triggers: [
    {
      // Look away; does damage if failed.
      id: 'SophiaEx The Second Demiurge Divine Spark',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '19B6', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'SophiaEx Knocked Off',
      type: 'Ability',
      // 1981 = The Scales of Wisdom
      // 1AE1 = The Scales of Wisdom
      // 19C2 = Gnosis (knockback from Barbelo add)
      // Technically, things like Aero III and keroma also knock people off but they also can kill people
      // if we ever get proper "you fell off" log lines, we can fix this up.
      netRegex: NetRegexes.ability({ id: ['1981', '1AE1', '19C2'] }),
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
