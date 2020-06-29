'use strict';

// O1N - Deltascape 1.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape V1\.0$/,
  },
  zoneId: ZoneId.DeltascapeV10,
  damageWarn: {
    'O1N Burn': '23D5', // Fireball explosion circle AoEs
    'O1N Clamp': '23E2', // Frontal rectangle knockback AoE, Alte Roite
  },
  triggers: [
    {
      // Small spread circles
      id: 'O1N Levinbolt',
      damageRegex: '23DA',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
