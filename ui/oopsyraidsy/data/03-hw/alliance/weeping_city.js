import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

export default {
  zoneId: ZoneId.TheWeepingCityOfMhach,
  damageWarn: {
    'Weeping Critical Bite': '1848', // Sarsuchus cone aoe
    'Weeping Realm Shaker': '183E', // First Daughter circle aoe
    'Weeping Silkscreen': '183C', // First Daughter line aoe
    'Weeping Silken Spray': '1824', // Arachne Eve rear conal aoe
    'Weeping Tremblor 1': '1837', // Arachne Eve disappear circle aoe 1
    'Weeping Tremblor 2': '1836', // Arachne Eve disappear circle aoe 2
    'Weeping Tremblor 3': '1835', // Arachne Eve disappear circle aoe 3
    'Weeping Spider Thread': '1839', // Arachne Eve spider line aoe
    'Weeping Fire II': '184E', // Black Mage Corpse circle aoe
    'Weeping Necropurge': '17D7', // Forgall Shriveled Talon line aoe
    'Weeping Rotten Breath': '17D0', // Forgall Dahak cone aoe
    'Weeping Mow': '17D2', // Forgall Haagenti unmarked cleave
    'Weeping Dark Eruption': '17C3', // Forgall puddle marker
    // 1806 is also Flare Star, but if you get by 1805 you also get hit by 1806?
    'Weeping Flare Star': '1805', // Ozma cube phase donut
    'Weeping Execration': '1829', // Ozma triangle laser
    'Weeping Haircut 1': '180B', // Calofisteri 180 cleave 1
    'Weeping Haircut 2': '180F', // Calofisteri 180 cleave 2
    'Weeping Entanglement': '181D', // Calofisteri landmine puddle proc
    'Weeping Evil Curl': '1816', // Calofisteri axe
    'Weeping Evil Tress': '1817', // Calofisteri bulb
    'Weeping Depth Charge': '1820', // Calofisteri charge to edge
    'Weeping Feint Particle Beam': '1928', // Calofisteri sky laser
    'Weeping Evil Switch': '1815', // Calofisteri lasers
  },
  shareWarn: {
    'Weeping Arachne Web': '185E', // Arachne Eve headmarker web aoe
    'Weeping Earth Aether': '1841', // Arachne Eve orbs
    'Weeping Epigraph': '1852', // Headstone untelegraphed laser line tank attack
    // This is too noisy.  Better to pop the balloons than worry about friends.
    // 'Weeping Explosion': '1807', // Ozmasphere Cube orb explosion
    'Weeping Split End 1': '180C', // Calofisteri tank cleave 1
    'Weeping Split End 2': '1810', // Calofisteri tank cleave 2
    'Weeping Bloodied Nail': '181F', // Calofisteri axe/bulb appearing
  },
  gainsEffectWarn: {
    'Weeping Hysteria': '128', // Arachne Eve Frond Affeard
    'Weeping Zombification': '173', // Forgall too many zombie puddles
    'Weeping Toad': '1B7', // Forgall Brand of the Fallen failure
    'Weeping Doom': '38E', // Forgall Haagenti Mortal Ray
    'Weeping Assimilation': '42C', // Ozmashade Assimilation look-away
    'Weeping Stun': '95', // Calofisteri Penetration look-away
  },
  triggers: [
    {
      id: 'Weeping Forgall Gradual Zombification Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '415' }),
      run: (data, matches) => {
        data.zombie = data.zombie || {};
        data.zombie[matches.target] = true;
      },
    },
    {
      id: 'Weeping Forgall Gradual Zombification Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '415' }),
      run: (data, matches) => {
        data.zombie = data.zombie || {};
        data.zombie[matches.target] = false;
      },
    },
    {
      id: 'Weeping Forgall Mega Death',
      netRegex: NetRegexes.ability({ id: '17CA' }),
      condition: (data, matches) => data.zombie && !data.zombie[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'Weeping Headstone Shield Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '15E' }),
      run: (data, matches) => {
        data.shield = data.shield || {};
        data.shield[matches.target] = true;
      },
    },
    {
      id: 'Weeping Headstone Shield Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '15E' }),
      run: (data, matches) => {
        data.shield = data.shield || {};
        data.shield[matches.target] = false;
      },
    },
    {
      id: 'Weeping Flaring Epigraph',
      netRegex: NetRegexes.ability({ id: '1856' }),
      condition: (data, matches) => data.shield && !data.shield[matches.target],
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      // This ability name is helpfully called "Attack" so name it something else.
      id: 'Weeping Ozma Tank Laser',
      netRegex: NetRegexes.ability({ type: '22', id: '1831' }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'Tank Laser',
            de: 'Tank Laser',
            fr: 'Tank Laser',
            ja: 'タンクレザー',
            cn: '坦克激光',
            ko: '탱커 레이저',
          },
        };
      },
    },
    {
      id: 'Weeping Ozma Holy',
      netRegex: NetRegexes.ability({ id: '182E' }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Slid off!',
            de: 'ist runtergerutscht!',
            fr: 'A glissé(e) !',
            ja: 'ノックバック',
            cn: '击退！',
            ko: '넉백됨!',
          },
        };
      },
    },
  ],
};
