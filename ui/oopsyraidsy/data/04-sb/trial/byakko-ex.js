import ZoneId from '../../../../../resources/zone_id.js';

// Byakko Extreme
export default {
  zoneId: ZoneId.TheJadeStoaExtreme,
  damageWarn: {
    // Popping Unrelenting Anguish bubbles
    'ByaEx Aratama': '27F6',
    // Stepping in growing orb
    'ByaEx Vacuum Claw': '27E9',
    // Lightning Puddles
    'ByaEx Hunderfold Havoc 1': '27E5',
    'ByaEx Hunderfold Havoc 2': '27E6',
  },
  damageFail: {
    'ByaEx Sweep The Leg': '27DB',
    'ByaEx Fire and Lightning': '27DE',
    'ByaEx Distant Clap': '27DD',
    // Midphase line attack
    'ByaEx Imperial Guard': '27F1',
  },
  triggers: [
    {
      // Pink bubble collision
      id: 'ByaEx Ominous Wind',
      damageRegex: '27EC',
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
            fr: 'collision de bulles',
            ja: '衝突',
            cn: '相撞',
            ko: '장판 겹쳐서 터짐',
          },
        };
      },
    },
  ],
};
