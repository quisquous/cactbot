import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: Diabolic Wind (28B9) always seems to be 0x16 not 0x15.

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
  triggers: [
    {
      id: 'O5N Throttle Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '3AA' }),
      run: (data, matches) => {
        (data.hasThrottle ??= {})[matches.target] = true;
        console.log(JSON.stringify(data.hasThrottle));
      },
    },
    {
      id: 'O5N Throttle Death',
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
      id: 'O5N Throttle Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '3AA' }),
      run: (data, matches) => {
        (data.hasThrottle ??= {})[matches.target] = false;
        console.log(JSON.stringify(data.hasThrottle));
      },
    },
    {
      // Getting hit by a ghost without throttle (the mandatory post-chimney one).
      id: 'O5N Possess',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '28AC', ...playerDamageFields }),
      condition: (data, matches) => !data.hasThrottle?.[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
