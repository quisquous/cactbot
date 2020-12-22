import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// 562D Burnout is listed as Blastburn in my logs, but is Burnout text on screen and in E11S.

export default {
  zoneId: ZoneId.EdensPromiseAnamorphosis,
  damageWarn: {
    'E11N Burnt Strike Fire': '562E', // Line cleave
    'E11N Burnt Strike Lightning': '562C', // Line cleave
    'E11N Burnt Strike Holy': '5630', // Line cleave
    'E11N Burnout': '562D', // Burnt Strike lightning expansion
    'E11N Shining Blade': '5631', // Baited explosion
    'E11N Halo Of Flame Brightfire': '563B', // Red circle intermission explosion
    'E11N Halo Of Levin Brightfire': '563C', // Blue circle intermission explosion
    'E11N Resounding Crack': '564D', // Demi-Gukumatz 270 degree frontal cleave
    'E11N Image Burnt Strike Lightning': '5645', // Fate Breaker's Image line cleave
    'E11N Image Burnt Strike Fire': '5643', // Fate Breaker's Image line cleave
    'E11N Image Burnout': '5646', // Fate Breaker's Image lightning expansion
  },
  damageFail: {
    'E11N Burn Mark': '564F', // Powder Mark debuff explosion
    'E11N Blasting Zone': '563E', // Prismatic Deception charges
  },
  triggers: [
    {
      id: 'E11N Blastburn Knocked Off',
      // 562F = Burnt Strike fire followup during most of the fight
      // 5644 = same thing, but from Fatebreaker's Image
      netRegex: NetRegexes.ability({ id: ['562F', '5644'] }),
      deathReason: (e, data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Assomé',
            ja: 'ノックバック',
            cn: '击退坠落',
          },
        };
      },
    },
  ],
};
