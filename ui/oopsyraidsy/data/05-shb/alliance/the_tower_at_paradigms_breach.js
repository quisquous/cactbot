import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.TheTowerAtParadigmsBreach,
  damageWarn: {
    'Tower Knave Colossal Impact Center': '5EA7', // Center aoe from Knave and clones
    'Tower Knave Colossal Impact Side 1': '5EA5', // Side aoes from Knave and clones
    'Tower Knave Colossal Impact Side 2': '5EA6', // Side aoes from Knave and clones
    'Tower Knave Burst': '5ED4', // Spheroid Knavish Bullets collision
    'Tower Knave Magic Barrage': '5EAC', // Spheroid line aoes
    'Tower Hansel Repay': '5C70', // Shield damage
    'Tower Hansel Explosion': '5C67', // Being hit by Magic Bullet during Passing Lance
    'Tower Hansel Impact': '5C5C', // Being hit by Magical Confluence during Wandering Trail
    'Tower Hansel Bloody Sweep 1': '5C6C', // Dual cleaves without tether
    'Tower Hansel Bloody Sweep 2': '5C6D', // Dual cleaves without tether
    'Tower Hansel Bloody Sweep 3': '5C6E', // Dual cleaves with tether
    'Tower Hansel Bloody Sweep 4': '5C6F', // Dual cleaves with tether
    'Tower Hansel Passing Lance': '5C66', // The Passing Lance charge itself
    'Tower Hansel Breaththrough 1': '55B3', // half room cleave during Wandering Trail
    'Tower Hansel Breaththrough 2': '5C5D', // half room cleave during Wandering Trail
    'Tower Hansel Breaththrough 3': '5C5E', // half room cleave during Wandering Trail
    'Tower Hansel Hungry Lance 1': '5C71', // 2xlarge conal cleave during Wandering Trail
    'Tower Hansel Hungry Lance 2': '5C72', // 2xlarge conal cleave during Wandering Trail
  },
  shareWarn: {
    'Tower Knave Magic Artillery Alpha': '5EAB', // Spread
    'Tower Hansel Seed Of Magic Alpha': '5C61', // Spread
  },
  shareFail: {
    'Tower Knave Magic Artillery Beta': '5EB3', // Tankbuster
  },
  triggers: [
    {
      id: 'Tower Knave Lunge Knocked Off',
      netRegex: NetRegexes.ability({ id: '5EB1' }),
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
