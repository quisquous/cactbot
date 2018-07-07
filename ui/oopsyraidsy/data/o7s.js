'use strict';

// O7S - Sigmascape 3.0 Savage
[{
  zoneRegex: /Sigmascape V3\.0 \(Savage\)/,
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
