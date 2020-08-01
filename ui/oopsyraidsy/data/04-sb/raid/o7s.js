'use strict';

// O7S - Sigmascape 3.0 Savage
[{
  zoneRegex: {
    en: /^Sigmascape V3\.0 \(Savage\)$/,
    ko: /^차원의 틈 오메가: 시그마편\(영웅\) \(3\)$/,
  },
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
