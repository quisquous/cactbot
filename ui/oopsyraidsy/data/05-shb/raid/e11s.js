import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// 565A/568D Sinsmoke Bound Of Faith share
// 565E/5699 Bowshock hits target of 565D (twice) and two others

export default {
  zoneId: ZoneId.EdensPromiseAnamorphosisSavage,
  damageWarn: {
    'E11S Burnt Strike Fire': '5652', // Line cleave
    'E11S Burnt Strike Lightning': '5654', // Line cleave
    'E11S Burnt Strike Holy': '5656', // Line cleave
    'E11S Shining Blade': '5657', // Baited explosion
    'E11S Burnt Strike Cycle Fire': '568E', // Line cleave during Cycle
    'E11S Burnt Strike Cycle Lightning': '5695', // Line cleave during Cycle
    'E11S Burnt Strike Cycle Holy': '569D', // Line cleave during Cycle
    'E11S Shining Blade Cycle': '569E', // Baited explosion during Cycle
    'E11S Halo Of Flame Brightfire': '566D', // Red circle intermission explosion
    'E11S Halo Of Levin Brightfire': '566C', // Blue circle intermission explosion
    'E11S Portal Of Flame Bright Pulse': '5671', // Red card intermission explosion
    'E11S Portal Of Levin Bright Pulse': '5670', // Blue card intermission explosion
    'E11S Resonant Winds': '5689', // Demi-Gukumatz "get in"
    'E11S Resounding Crack': '5688', // Demi-Gukumatz 270 degree frontal cleave
    'E11S Image Burnt Strike Lightning': '567B', // Fate Breaker's Image line cleave
    'E11N Image Burnout': '567C', // Fate Breaker's Image lightning expansion
    'E11N Image Burnt Strike Fire': '5679', // Fate Breaker's Image line cleave
    'E11N Image Burnt Strike Holy': '567B', // Fate Breaker's Image line cleave
    'E11N Image Shining Blade': '567E', // Fate Breaker's Image baited explosion
  },
  damageFail: {
    'E11S Burnout': '5655', // Burnt Strike lightning expansion
    'E11S Burnout Cycle': '5696', // Burnt Strike lightning expansion
    'E11S Blasting Zone': '5674', // Prismatic Deception charges
  },
  shareWarn: {
    'E11S Elemental Break': '5664', // Elemental Break protean
    'E11S Elemental Break Cycle': '568C', // Elemental Break protean during Cycle
    'E11S Sinsmite': '5667', // Lightning Elemental Break spread
    'E11S Sinsmite Cycle': '5694', // Lightning Elemental Break spread during Cycle
  },
  shareFail: {
    'E11S Burn Mark': '56A3', // Powder Mark debuff explosion
    'E11S Sinsight 1': '5661', // Holy Bound Of Faith tether
    'E11S Sinsight 2': '5BC7', // Holy Bound Of Faith tether from Fatebreaker's Image
    'E11S Sinsight 3': '56A0', // Holy Bound Of Faith tether during Cycle
  },
  triggers: [
    {
      id: 'E11S Holy Sinsight Group Share',
      damageRegex: '5669',
      condition: (e) => e.type === '15',
      mistake: function(e, data, matches) {
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
    {
      id: 'E11S Blastburn Knocked Off',
      // 5653 = Burnt Strike fire followup during most of the fight
      // 567A = same thing, but from Fatebreaker's Image
      // 568F = same thing, but during Cycle of Faith
      netRegex: NetRegexes.ability({ id: ['5653', '567A', '568F'] }),
      deathReason: (e, data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
  ],
};
