'use strict';

// TODO: shadoweye failure (top line fail, bottom line success, effect there too)
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:106E29AA:Ayra Sagramore:F:10000:100190F:
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:1069A42E:Nerio Albion:1:0:1C:8000:
// gains the effect of Petrification from Voidwalker for 10.00 Seconds.
// TODO: puddle failure?
[{
  zoneRegex: {
    en: /^Eden's Gate: Descent$/,
    cn: /^伊甸希望乐园 \(觉醒之章2\)$/,
    ko: /^희망의 낙원 에덴: 각성편 \(2\)$/,
  },
  zoneId: ZoneId.EdensGateDescent,
  damageWarn: {
    'E2S Doomvoid Slicer': '3E3C',
    'E3S Doomvoid Guillotine': '3E3B',
  },
  triggers: [
    {
      id: 'E2S Nyx',
      damageRegex: '3E3D',
      mistake: function(e, data) {
        return {
          type: 'warn',
          blame: e.targetName,
          text: {
            en: 'Booped',
            de: e.abilityName,
            fr: 'Malus de dégâts',
            ja: e.abilityName,
            cn: e.abilityName,
            ko: '닉스',
          },
        };
      },
    },
  ],
}];
