'use strict';

// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  triggers: [
    {
      id: 'ByaEx Sweep The Leg',
      damageRegex: gLang.kAbility.ByaSweepTheLeg,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ByaEx Fire and Lightning',
      damageRegex: gLang.kAbility.ByaFireAndLightning,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ByaEx Distant Clap',
      damageRegex: gLang.kAbility.ByaDistantClap,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ByaEx Aratama',
      damageRegex: gLang.kAbility.ByaAratama,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'popped aratama',
            de: 'Einschlag ausgelöst',
          },
        };
      },
    },
    {
      id: 'ByaEx Vacuum Claw',
      damageRegex: gLang.kAbility.ByaVacuumClaw,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'stepped in orb',
            de: 'in Kugel reingelaufen',
          },
        };
      },
    },
    {
      id: 'ByaEx Imperial Guard',
      damageRegex: gLang.kAbility.ByaImperialGuard,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      damageRegex: gLang.kAbility.ByaOminousWind,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName, text: {
            en: 'bubble collision',
            de: 'Blasen sind zusammengestoßen',
          },
        };
      },
    },
    {
      id: 'ByaEx Hundredfold Havoc 1',
      damageRegex: gLang.kAbility.ByaHundredfoldHavoc1,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'thunder',
            de: 'Blitz',
          },
        };
      },
    },
    {
      id: 'ByaEx Hundredfold Havoc 2',
      damageRegex: gLang.kAbility.ByaHundredfoldHavoc2,
      condition: function(e, data) {
        return data.IsPlayerId(e.targetId);
      },
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'thunder',
            de: 'Blitz',
          },
        };
      },
    },
  ],
}];
