import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: Radiant Braver is 4F16/4F17(x2), shouldn't get hit by both?
// TODO: Radiant Desperado is 4F18/4F19, shouldn't get hit by both?
// TODO: Radiant Meteor is 4F1A, and shouldn't get hit by more than 1?
// TODO: missing a tower?

// Note: Deliberately not including pyretic damage as an error.
// Note: It doesn't appear that there's any way to tell who failed the cutscene.

export default {
  zoneId: ZoneId.TheSeatOfSacrifice,
  damageWarn: {
    'WOL Solemn Confiteor': '4F2A', // ground puddles
    'WOL Coruscant Saber In': '4F10', // saber in
    'WOL Coruscant Saber Out': '4F11', // saber out
    'WOL Imbued Corusance Out': '4F4B', // saber out
    'WOL Imbued Corusance In': '4F4C', // saber in
    'WOL Shining Wave': '4F26', // sword triangle
    'WOL Cauterize': '4F25',
    'WOL Brimstone Earth 1': '4F1E', // corner growing circles, initial
    'WOL Brimstone Earth 2': '4F1F', // corner growing circles, growing
    'WOL Flare Breath': '4F24',
    'WOL Decimation': '4F23',
  },
  gainsEffectWarn: {
    'WOL Deep Freeze': '4E6',
  },
  triggers: [
    {
      id: 'WOL True Walking Dead',
      netRegex: NetRegexes.gainsEffect({ effectId: '38E' }),
      delaySeconds: function(e, data, matches) {
        return parseFloat(matches.duration) - 0.5;
      },
      deathReason: function(e, data, matches) {
        return { type: 'fail', name: e.target, reason: matches.effect };
      },
    },
  ],
};
