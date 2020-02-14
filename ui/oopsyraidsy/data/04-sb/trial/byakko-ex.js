'use strict';

// Byakko Extreme
[{
  zoneRegex: {
    en: /^The Jade Stoa \(Extreme\)$/,
    ko: /^극 백호 토벌전$/,
  },
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
            ko: '구슬 맞음',
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
            ko: '장판 안에 들어감',
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
          blame: e.targetName,
          text: {
            en: 'bubble collision',
            de: 'Blasen sind zusammengestoßen',
            ko: '장판 겹쳐서 터짐',
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
            ko: '번개 장판',
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
            ko: '번개 장판',
          },
        };
      },
    },
  ],
}];
