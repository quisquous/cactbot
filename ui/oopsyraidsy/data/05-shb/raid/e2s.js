'use strict';

// TODO: shadoweye failure
// TODO: Empty Hate (3E59/3E5A) hits everybody, so hard to tell about knockback
// TODO: maybe mark hell wind people who got clipped by stack?
// TODO: missing puddles?
// TODO: missing light/dark circle stack
[{
  zoneRegex: {
    en: /^Eden's Gate: Descent \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(觉醒之章2\)$/,
    ko: /^희망의 낙원 에덴: 각성편\(영웅\) \(2\)$/,
  },
  damageWarn: {
    'E2S Doomvoid Slicer': '3E50',
    'E3S Empty Rage': '3E6C',
    'E3S Doomvoid Guillotine': '3E4F',
  },
  triggers: [
    {
      id: 'E2S Doomvoid Cleaver',
      damageRegex: '3E64',
      condition: function(e, data) {
        // Double taps only.
        return e.type != '15';
      },
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E2S Shadoweye',
      gainsEffectRegex: gLang.kEffect.StoneCurse,
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.effectName };
      },
    },
    {
      id: 'E2S Nyx',
      damageRegex: '3E51',
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'Booped',
            // FIXME: ability name here is "Attack", which isn't great.
            de: e.abilityName,
            fr: e.abilityName,
            cn: e.abilityName,
            ja: e.abilityName,
            ko: '닉스',
          },
        };
      },
    },
  ],
}];
