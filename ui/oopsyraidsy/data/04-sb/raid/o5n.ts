import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

interface Data extends OopsyData {
  hasThrottle?: { [name: string]: boolean };
}

// O5N - Sigmascape 1.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV10,
  damageWarn: {
    'O5N Wroth Ghost Encumber': '28AE', // squares that ghosts appear in
    'O5N Saintly Beam': '28AA', // chasing circles that destroy ghosts
  },
  shareWarn: {
    'O5N Diabolic Wind': '28B9', // green spread markers
  },
  triggers: [
    {
      id: 'O5N Throttle Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3AA' }),
      run: (data, matches) => (data.hasThrottle ??= {})[matches.target] = true,
    },
    {
      id: 'O5N Throttle Death',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3AA' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
      deathReason: (data, matches) => {
        if (data.hasThrottle?.[matches.target])
          return { name: matches.target, text: matches.effect };
      },
    },
    {
      id: 'O5N Throttle Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '3AA' }),
      run: (data, matches) => (data.hasThrottle ??= {})[matches.target] = false,
    },
    {
      // Getting hit by a ghost without throttle (the mandatory post-chimney one).
      id: 'O5N Possess',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '28AC' }),
      condition: (data, matches) => data.hasThrottle?.[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
