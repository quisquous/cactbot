'use strict';

// O7S - Sigmascape 3.0 Savage
[{
  zoneId: ZoneId.SigmascapeV30Savage,
  damageFail: {
    'O7S Missile': '2782',
    'O7S Chain Cannon': '278F',
  },
  damageWarn: {
    'O7S Searing Wind': '2777',
  },
  triggers: [
    {
      id: 'O7S Stoneskin',
      abilityRegex: '2AB5',
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
