'use strict';

// The Grand Cosmos

[{
  zoneRegex: /^The Grand Cosmos$/,
  timelineFile: 'the_grand_cosmos.txt',
  triggers: [
    {
      id: 'Cosmos Shadowbolt',
      regex: / 14:4769:Seeker Of Solitude starts using Shadowbolt on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Cosmos Dark Pulse',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            cn: '集合点名',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches[1]),
          cn: '靠近 ' + data.ShortName(matches[1]) + '集合',
        };
      },
    },
    {
      id: 'Cosmos Dark Well Far Winds',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Cosmos Immortal Anathema',
      regex: / 14:49A3:Seeker Of Solitude starts using Immortal Anathema/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'Cosmos Tribulation',
      regex: / 14:476B:Seeker Of Solitude starts using Tribulation/,
      delaySeconds: 8,
      alertText: {
        en: 'Avoid Brooms',
      },
    },
    {
      id: 'Cosmos Storm of Color',
      regex: / 14:471B:Leannan Sith starts using Storm Of Color on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Cosmos Ode To Lost Love',
      regex: / 14:471C:Leannan Sith starts using Ode To Lost Love/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      // Can't use added combatant here as all these adds exist.
      // So, just trigger on first auto.
      id: 'Cosmos Direct Seeding Mistake',
      regex: / 15:\y{ObjectId}:Lover's Ring:368:/,
      suppressSeconds: 60,
      infoText: {
        en: 'Kill Extra Add',
        de: 'Add angreifen',
        ja: '水の精倒して',
        fr: 'Tuez l\'add',
        cn: '击杀小怪',
      },
    },
    {
      id: 'Cosmos Gardener\'s Hymn',
      regex: / 14:471E:Leannan Sith starts using Gardener's Hymn/,
      infoText: {
        en: 'put seeds on dirt',
      },
    },
    {
      id: 'Cosmos Ronkan Cure II',
      regex: / 14:4931:Ser Hamonth starts using Ronkan Cure II/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Hamonth',
      },
    },
    {
      id: 'Cosmos Captive Bolt',
      regex: / 14:4764:Lugus starts using Captive Bolt on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: data.ShortName(matches[1]) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Cosmos Culling Blade',
      regex: / 14:4765:Lugus starts using Culling Blade/,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
      },
    },
    {
      id: 'Cosmos Black Flame 1',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0019:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Cosmos Black Flame 2',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0019:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 4,
      infoText: {
        en: 'Dodge Crosses',
      },
    },
    {
      id: 'Cosmos Mortal Flame 1',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C3:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
      },
    },
    {
      id: 'Cosmos Mortal Flame 2',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00C3:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 5.5,
      infoText: {
        en: 'Touch Furniture',
      },
    },
    {
      id: 'Cosmos Scorching Left',
      regex: / 14:4763:Lugus starts using Scorching Left/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Cosmos Scorching Right',
      regex: / 14:4762:Lugus starts using Scorching Right/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
  ],
}];
