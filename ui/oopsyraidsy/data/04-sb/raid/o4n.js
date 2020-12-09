import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// O4N - Deltascape 4.0 Normal
export default {
  zoneId: ZoneId.DeltascapeV40,
  damageWarn: {
    'O4N Blizzard III': '24BC', // Targeted circle AoEs, Exdeath
    'O4N Empowered Thunder III': '24C1', // Untelegraphed large circle AoE, Exdeath
    'O4N Zombie Breath': '24CB', // Conal, tree head after Decisive Battle
    'O4N Clearout': '24CC', // Overlapping cone AoEs, Deathly Vine (tentacles alongside tree head)
    'O4N Black Spark': '24C9', // Exploding Black Hole
  },
  shareWarn: {
    // Empowered Fire III inflicts the Pyretic debuff, which deals damage if the player
    // moves or acts before the debuff falls. Unfortunately it doesn't look like there's
    // currently a log line for this, so the only way to check for this is to collect
    // the debuffs and then warn if a player takes an action during that time. Not worth it
    // for Normal.
    'O4N Standard Fire': '24BA',
    'O4N Buster Thunder': '24BE', // A cleaving tank buster
  },
  triggers: [
    {
      id: 'O4N Doom', // Kills target if not cleansed
      netRegex: NetRegexes.gainsEffect({ effectId: '38E' }),
      deathReason: function(e, data, matches) {
        return { type: 'fail', name: e.target, reason: { en: 'Cleansers missed Doom!' } };
      },
    },
    {
      id: 'O4N Vacuum Wave', // Short knockback from Exdeath
      damageRegex: '24B8',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Pushed off!' } };
      },
    },
    {
      id: 'O4N Empowered Blizzard', // Room-wide AoE, freezes non-moving targets
      netRegex: NetRegexes.gainsEffect({ effectId: '4E6' }),
      mistake: function(e, data, matches) {
        return { type: 'warn', blame: e.target, text: e.effect };
      },
    },
  ],
};
