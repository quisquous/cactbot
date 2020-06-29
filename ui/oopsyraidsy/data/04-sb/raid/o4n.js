'use strict';

// O4N - Deltascape 4.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V4\.0\)$/,
  },
  zoneId: ZoneId.DeltascapeV40,
  damageWarn: {
    'Blizzard III': '24BC', // Targeted circle AoEs, Exdeath
    'Empowered Thunder III': '24C1', // Untelegraphed large circle AoE, Exdeath
    'Zombie Breath': '24CB', // Conal, tree head after Decisive Battle
    'Clearout': '24CC', // Overlapping cone AoEs, Deathly Vine (tentacles alongside tree head)
    'Black Spark': '24C9', // Exploding Black Hole
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
      gainsEffectRegex: gLang.kEffect.Doom,
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Cleansers missed Doom!' } };
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
      gainsEffectRegex: gLang.kEffect.DeepFreeze,
      mistake: function(e) {
        return { type: 'warn', name: e.targetName, text: e.effectName };
      },
    },
  ],
}];
