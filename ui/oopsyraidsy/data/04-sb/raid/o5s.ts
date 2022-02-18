import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: Diabolic Wind (28BD) always seems to be 0x16 not 0x15.

export interface Data extends OopsyData {
  hasThrottle?: { [name: string]: boolean };
}

// O5S - Sigmascape 1.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV10Savage,
  damageWarn: {
    'O5S Wroth Ghost Encumber': '28B6', // squares appearing
    'O5S Saintly Bean': '28B4', // chasing lights
  },
  triggers: [
    {
      id: 'O5S Throttle Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3AA' }),
      run: (data, matches) => (data.hasThrottle ??= {})[matches.target] = true,
    },
    {
      id: 'O5S Throttle Death',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3AA' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
      deathReason: (data, matches) => {
        if (!data.hasThrottle?.[matches.target])
          return;
        return {
          id: matches.targetId,
          name: matches.target,
          text: matches.effect,
        };
      },
    },
    {
      id: 'O5S Throttle Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '3AA' }),
      run: (data, matches) => (data.hasThrottle ??= {})[matches.target] = false,
    },
    {
      // Getting hit by a ghost without throttle (the mandatory post-chimney one).
      id: 'O5S Possess',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '28AC', ...playerDamageFields }),
      condition: (data, matches) => !data.hasThrottle?.[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
