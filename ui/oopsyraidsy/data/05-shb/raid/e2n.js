import ZoneId from '../../../../../resources/zone_id.js';

// TODO: shadoweye failure (top line fail, bottom line success, effect there too)
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:10612345:Tini Poutini:F:10000:100190F:
// [16:17:35.966] 16:400110FE:Voidwalker:40B7:Shadoweye:1067890A:Potato Chippy:1:0:1C:8000:
// gains the effect of Petrification from Voidwalker for 10.00 Seconds.
// TODO: puddle failure?
export default {
  zoneId: ZoneId.EdensGateDescent,
  damageWarn: {
    'E2N Doomvoid Slicer': '3E3C',
    'E2N Doomvoid Guillotine': '3E3B',
  },
  triggers: [
    {
      id: 'E2N Nyx',
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
};
