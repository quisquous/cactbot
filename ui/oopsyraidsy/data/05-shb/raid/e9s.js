import ZoneId from '../../../../../resources/zone_id.js';

// TODO: 561D Evil Seed hits everyone, hard to know if there's a double tap
// TODO: falling through panel just does damage with no ability name, like a death wall
// TODO: what happens if you jump in seed thorns?

export default {
  zoneId: ZoneId.EdensPromiseUmbraSavage,
  damageWarn: {
    'E9S Bad Vibrations': '561C', // tethered outside giant tree ground aoes
    'E9S Anti-Air Phaser Unlimited': '5612', // anti-air "out"
    'E9S Wide-Angle Particle Beam': '5B00', // anti-air "sides"
    'E9S Wide-Angle Phaser Unlimited': '560E', // wide-angle "sides"
    'E9S Anti-Air Particle Beam': '5B01', // wide-angle "out"
    'E9S The Second Art Of Darkness 1': '5601', // left-right cleave
    'E9S The Second Art Of Darkness 2': '5602', // left-right cleave
    'E9S The Art Of Darkness 1': '5A95', // boss left-right summon/panel cleave
    'E9S The Art Of Darkness 2': '5A96', // boss left-right summon/panel cleave
    'E9S The Art Of Darkness Clone 1': '561E', // clone left-right summon cleave
    'E9S The Art Of Darkness Clone 2': '561F', // clone left-right summon cleave
    'E9S The Third Art Of Darkness 1': '5603', // third art left-right cleave initial
    'E9S The Third Art Of Darkness 2': '5604', // third art left-right cleave initial
    'E9S Art Of Darkness': '5606', // third art left-right cleave final
    'E9S Full-Perimiter Particle Beam': '5629', // panel "get in"
    'E9S Dark Chains': '5FAC', // Slow to break partner chains
  },
  damageFail: {
    'E9S Withdraw': '561A', // Slow to break seed chain, get sucked back in yikes
    'E9S Aetherosynthesis': '561B', // Standing on seeds during explosion (possibly via Withdraw)
  },
  shareWarn: {
    'E9S Hyper-Focused Particle Beam': '55FD', // Art Of Darkness protean
  },
  shareFail: {
    'E9S Condensed Anti-Air Particle Beam': '5615', // anti-air "tank spread"
    'E9S Condensed Wide-Angle Particle Beam': '5610', // wide-angle "tank laser"
  },
  triggers: [
    {
      // Art Of Darkness Partner Stack
      id: 'E9S Multi-Pronged Particle Beam',
      damageRegex: '5600',
      condition: (e) => e.type === '15',
      mistake: function(e, data, matches) {
        return {
          type: 'warn',
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
  ],
};
