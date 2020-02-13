'use strict';

// O7S - Sigmascape 3.0 Savage
[{
  zoneRegex: {
    en: /^Sigmascape V3\.0 \(Savage\)$/,
    ko: /^차원의 틈 오메가: 시그마편\(영웅\) \(3\)$/,
  },
  triggers: [
    {
      id: 'O7S Missile',
      damageRegex: gLang.kAbility.MissileExplosion,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'fail',
          blame: e.targetName,
          text: {
            en: 'Missile',
            de: 'Rakete',
            fr: e.abilityName,
            ja: e.abilityName,
            ko: e.abilityName,
          },
        };
      },
    },
    {
      id: 'O7S Stoneskin',
      abilityRegex: gLang.kAbility.UltrosStoneskin,
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'O7S Searing Wind',
      damageRegex: gLang.kAbility.TheHeat,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'hit by wind',
            de: 'von Versengen getroffen',
            ko: e.abilityName,
          },
        };
      },
    },
    {
      id: 'O7S Chain Cannon',
      damageRegex: gLang.kAbility.ChainCannon,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
