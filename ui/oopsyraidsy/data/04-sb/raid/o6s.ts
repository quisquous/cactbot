import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

interface Data extends OopsyData {
  hasFireResist?: { [name: string]: boolean };
}

// O6S - Sigmascape 2.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV20Savage,
  damageWarn: {
    'O6S Earthquake': '2810', // failing to be in a plane
    'O6S Rock Hard': '2812', // from portrayal of earth?
    'O6S Flash Torrent 1': '2AB9', // from portrayal of water??
    'O6S Flash Torrent 2': '280F', // from portrayal of water??
    'O6S Easterly Featherlance': '283E', // blown away Easterly circles
    'O6S Demonic Wave': '2830', // failing to be behind rock
    'O6S Demonic Spout': '2836', // pair of targeted circle'
    'O6S Demonic Stone 1': '2844', // chasing circle initial
    'O6S Demonic Stone 2': '2845', // chasing circle repeated
    'O6S Intense Pain': '283A', // failing to spread for Demonic Pain tether
  },
  shareWarn: {
    'O6S The Price': '2826', // exploding Last Kiss tankbuster debuff
  },
  triggers: [
    {
      id: 'O6S Fire Resistance Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '5ED' }),
      run: (data, matches) => (data.hasFireResist ??= {})[matches.target] = true,
    },
    {
      id: 'O6S Fire Resistance Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '5ED' }),
      run: (data, matches) => (data.hasFireResist ??= {})[matches.target] = false,
    },
    {
      // Flash Fire without Fire Resistance.
      id: 'O6S Flash Fire',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '280A' }),
      condition: (data, matches) => !data.hasFireResist?.[matches.target],
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      // Look away; does damage if failed.
      id: 'O6S Divine Lure',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '2822', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
