'use strict';

[{
  zoneRegex: {
    en: /^The Weeping City Of Mhach$/,
  },
  zoneId: ZoneId.TheWeepingCityOfMhach,
  damageWarn: {
    'Weeping Critical Bite': '1848', // Sarsuchus cone aoe
    'Weeping Realm Shaker': '183E', // First Daughter circle aoe
    'Weeping Silkscreen': '183C', // First Daughter line aoe
    'Weeping Tremblor 1': '1837', // Arachne Eve disappear circle aoe 1
    'Weeping Tremblor 2': '1836', // Arachne Eve disappear circle aoe 2
    'Weeping Tremblor 3': '1835', // Arachne Eve disappear circle aoe 3
    'Weeping Spider Thread': '1839', // Arachne Eve spider line aoe
    'Weeping Fire II': '184E', // Black Mage Corpse circle aoe
    'Weeping Rotten Breath': '17D0', // Forgall Dahak cone aoe
    'Weeping Mow': '17D2', // Forgall Haagenti unmarked cleave
    'Weeping Mortal Ray': '17D4', // Forgall Haagenti look-away
    'Weeping Dark Eruption': '17C3', // Forgall puddle marker
    'Weeping Trembling Epigraph': '1855', // Headstone line aoe?
    'Weeping Flare Star 1': '1805', // Ozma cube phase donut 1?
    'Weeping Flare Star 2': '1806', // Ozma cube phase donut 2?
    'Weeping Execration': '1829', // Ozma triangle laser
    'Weeping Entanglement': '181D', // Calofisteri landmine puddle
    'Weeping Evil Curl': '1816', // Calofisteri axe
    'Weeping Evil Tress': '1817', // Calofisteri mace
    'Weeping Depth Charge': '1820', // Calofisteri charge to edge
    'Weeping Haircut 1': '180B', // Calofisteri 180 cleave 1
    'Weeping Haircut 2': '180F', // Calofisteri 180 cleave 2
    'Weeping Evil Switch': '1815', // Calofisteri lasers
  },
  shareWarn: {
    'Weeping Arachne Web': '185E', // Arachne Eve headmarker web aoe
    'Weeping Earth Aether': '1841', // Arachne Eve orbs
    'Weeping Epigraph': '1852', // Headstone cleave
    // This is too noisy.  Better to pop the balloons than worry about friends.
    // 'Weeping Explosion': '1807', // Ozmasphere Cube orb explosion
    'Weeping Split End 1': '180C', // Calofisteri tank cleave 1
    'Weeping Split End 2': '1810', // Calofisteri tank cleave 2
    'Weeping Bloodied Nail': '181F', // Calofisteri tank buster
    'Weeping Feint Particle Beam': '1928', // Calofisteri sky laser
  },
  gainsEffectWarn: {
    'Weeping Hysteria': '128', // Arachne Eve Frond Affeard
    'Weeping Zombification': '173', // Forgall too many zombie puddles
    'Weeping Toad': '1B7', // Forgall Brand of the Fallen failure
    'Weeping Assimilation': '42C', // Ozmashade Assimilation lookaway
  },
  triggers: [
    {
      id: 'Weeping Forgall Gradual Zombification Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '415' }),
      run: function(e, data, matches) {
        data.zombie = data.zombie || {};
        data.zombie[matches.target] = true;
      },
    },
    {
      id: 'Weeping Forgall Gradual Zombification Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '415' }),
      run: function(e, data, matches) {
        data.zombie = data.zombie || {};
        data.zombie[matches.target] = false;
      },
    },
    {
      id: 'Weeping Forgall Megadeath',
      netRegex: NetRegexes.ability({ id: '183A' }),
      condition: function(e, data, matches) {
        return data.zombie && !data.zombie[matches.target];
      },
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'Weeping Headstone Shield Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '15E' }),
      run: function(e, data, matches) {
        data.shield = data.shield || {};
        data.shield[matches.target] = true;
      },
    },
    {
      id: 'Weeping Headstone Shield Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '15E' }),
      run: function(e, data, matches) {
        data.shield = data.shield || {};
        data.shield[matches.target] = false;
      },
    },
    {
      id: 'Weeping Flaring Epigraph',
      netRegex: NetRegexes.ability({ id: '1856' }),
      condition: function(e, data, matches) {
        return data.shield && !data.shield[matches.target];
      },
      mistake: function(e, data, matches) {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
    {
      // This ability name is helpfully called "Attack" so name it something else.
      id: 'Weeping Ozma Tank Laser',
      netRegex: NetRegexes.ability({ id: '1831' }),
      condition: (e) => e.type != 15,
      mistake: function(e, data, matches) {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'Tank Laser',
          },
        };
      },
    },
  ],
}];
