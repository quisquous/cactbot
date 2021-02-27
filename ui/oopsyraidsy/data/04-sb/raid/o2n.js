import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// O2N - Deltascape 2.0 Normal
export default {
  zoneId: ZoneId.DeltascapeV20,
  damageWarn: {
    'O2N Main Quake': '24A5', // Non-telegraphed circle AoE, Fleshy Member
    'O2N Erosion': '2590', // Small circle AoEs, Fleshy Member
  },
  shareWarn: {
    'O2N Paranormal Wave': '250E', // Instant tank cleave
  },
  triggers: [
    {
      // We could try to separate out the mistake that led to the player being petrified.
      // However, it's Normal mode, why overthink it?
      id: 'O2N Petrification',
      netRegex: NetRegexes.gainsEffect({ effectId: '262' }),
      // The user might get hit by another petrifying ability before the effect ends.
      // There's no point in notifying for that.
      suppressSeconds: 10,
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
    {
      id: 'O2N Earthquake',
      damageRegex: '2515',
      condition: function(e) {
        // This deals damage only to non-floating targets.
        return e.damage > 0;
      },
      mistake: function(e) {
        return { type: 'warn', name: e.targetName, text: e.abilityName };
      },
    },
  ],
};
