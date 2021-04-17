import ZoneId from '../../../../../resources/zone_id';

// TODO: missing Shock Black 2?

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
    'Tower Flight Unit Lightfast Blade': '5BFE', // large room cleave
    'Tower Flight Unit Standard Laser': '5BFF', // tracking laser
    'Tower 2P Whirling Assault': '5BFB', // line aoe from 2P clones
    'Tower 2P Balanced Edge': '5BFA', // circular aoe on 2P clones
    'Tower Red Girl Generate Barrier 1': '6006', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 2': '6007', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 3': '6008', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 4': '6009', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 5': '6310', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 6': '6311', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 7': '6312', // being hit by barriers appearing
    'Tower Red Girl Generate Barrier 8': '6313', // being hit by barriers appearing
    'Tower Red Girl Shock White 1': '600F', // white shockwave circle not dropped on black
    'Tower Red Girl Shock White 2': '6010', // white shockwave circle not dropped on black
    'Tower Red Girl Shock Black 1': '6011', // black shockwave circle not dropped on white
    'Tower Red Girl Point White 1': '601F', // being hit by a white laser
    'Tower Red Girl Point White 2': '6021', // being hit by a white laser
    'Tower Red Girl Point Black 1': '6020', // being hit by a black laser
    'Tower Red Girl Point Black 2': '6022', // being hit by a black laser
    'Tower Red Girl Wipe White': '600C', // not line of sighting the white meteor
    'Tower Red Girl Wipe Black': '600D', // not line of sighting the black meteor
    'Tower Red Girl Diffuse Energy': '6056', // rotating clone bubble cleaves
    'Tower Red Girl Pylon Big Explosion': '6027', // not killing a pylon during hacking phase
    'Tower Red Girl Pylon Explosion': '6026', // pylon during Child's play
    'Tower Philosopher Deploy Armaments Middle': '5C02', // middle laser
    'Tower Philosopher Deploy Armaments Sides': '5C05', // sides laser
    'Tower Philosopher Energy Bomb': '5C05', // pink bubble
  },
  shareWarn: {
    'Tower Knave Magic Artillery Alpha': '5EAB', // Spread
    'Tower Hansel Seed Of Magic Alpha': '5C61', // Spread
  },
  shareFail: {
    'Tower Knave Magic Artillery Beta': '5EB3', // Tankbuster
    'Tower Red Girl Manipulate Energy': '601A', // Tankbuster
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
