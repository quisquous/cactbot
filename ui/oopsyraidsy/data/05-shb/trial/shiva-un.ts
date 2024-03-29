import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// Shiva Unreal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheAkhAfahAmphitheatreUnreal,
  damageWarn: {
    // Large white circles.
    'ShivaUn Icicle Impact': '537B',
    // "get in" aoe
    'ShivaUn Whiteout': '5376',
    // Avoidable tank stun.
    'ShivaUn Glacier Bash': '5375',
  },
  damageFail: {
    // 270 degree attack.
    'ShivaUn Glass Dance': '5378',
  },
  shareWarn: {
    // Hailstorm spread marker.
    'ShivaUn Hailstorm': '536F',
  },
  shareFail: {
    // Laser.  TODO: maybe blame the person it's on??
    'ShivaUn Avalanche': '5379',
  },
  soloWarn: {
    // Party shared tank buster.
    'ShivaUn Icebrand': '5373',
  },
  triggers: [
    {
      id: 'ShivaUn Deep Freeze',
      type: 'GainsEffect',
      // Shiva also uses ability 537A on you, but it has an unknown name.
      // So, use the effect instead for free translation.
      netRegex: NetRegexes.gainsEffect({ effectId: '1E7' }),
      condition: (_data, matches) => {
        // The intermission also gets this effect, but for a shorter duration.
        return parseFloat(matches.duration) > 20;
      },
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.effect };
      },
    },
  ],
};

export default triggerSet;
