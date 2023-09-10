import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

interface Data extends OopsyData {
  hasFireResist?: { [name: string]: boolean };
}

// O6N - Sigmascape 2.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV20,
  damageWarn: {
    'O6N Earthquake': '2811', // failing to be in a plane
    'O6N Demonic Stone': '2847', // chasing circles
    'O6N Demonic Wave': '2831', // failing to be behind rock
    'O6N Demonic Spout 1': '2835', // pair of targeted circles (#1)
    'O6N Demonic Spout 2': '2837', // pair of targeted circles (#2)
    'O6N Featherlance': '2AE8', // blown away Easterly circles
    'O6N Intense Pain': '2AE7', // failing to spread for Demonic Pain tether
  },
  triggers: [
    {
      id: 'O6N Fire Resistance Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '5ED' }),
      run: (data, matches) => (data.hasFireResist ??= {})[matches.target] = true,
    },
    {
      id: 'O6N Fire Resistance Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '5ED' }),
      run: (data, matches) => (data.hasFireResist ??= {})[matches.target] = false,
    },
    {
      // Flash Fire without Fire Resistance.
      id: 'O6N Flash Fire',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '280B' }),
      condition: (data, matches) => !data.hasFireResist?.[matches.target],
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
  ],
};
export default triggerSet;
