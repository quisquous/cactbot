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
        de: 'Besen ausweichen',
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
        de: 'Samen auf den nicht bewachsenen Boden legen',
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
        de: 'Sir Hamonth unterbrechen',
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
        de: 'Den Kreuzen ausweichen',
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
        de: 'Einrichtung berühren',
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
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Enslaved Love': 'versklavt[a] Liebhaber',
        'Leannan Sith': 'Leanan Sidhe',
        'Lugus': 'Lugus',
        'Seeker of Solitude': 'Einsiedler',
        'The Chamber of Celestial Song will be sealed off': 'bis sich der Zugang zu[rm]? den Großen Vergnügungen schließt',
        'The Font of Quintessence will be sealed off': 'bis sich der Zugang zu[rm]? Broderieparterre schließt',
        'The Martial Court will be sealed off': 'bis sich der Zugang zu[rm]? Kleine Stufenarkade schließt',
        'is no longer sealed': 'öffnet sich wieder',
      },
      'replaceText': {
        'Black Flame': 'Finsterer Flammenwind',
        'Captive Bolt': 'Schmetterklinge',
        'Culling Blade': 'Schockschnitt',
        'Dark Pulse': 'Dunkle Welle',
        'Dark Shock': 'Angriff aus dem Dunkeln',
        'Dark Well': 'Dunkles Bersten',
        'Direct Seeding': 'Bedecktbesamung',
        'Far Wind': 'Heller Sturm',
        'Fire\'s Domain': 'Heißer Höllensturm',
        'Fire\'s Ire': 'Holistisches Höllenfeuer',
        'Gardener\'s Hymn': 'Wiegenlied der Sprösslinge',
        'Immortal Anathema': 'Ewiger Bannfluch',
        'Ireful Wind': 'Starke Bö',
        'Mortal Flame': 'Ewige Flammen',
        'Ode To Fallen Petals': 'Stimme des Blumensturms',
        'Ode To Far Winds': 'Stimme des hellen Sturms',
        'Ode To Lost Love': 'Unerwiderte Liebe',
        'Otherworldly Heat': 'Sengendes Seelenbrennen',
        'Plummet': 'Ausloten',
        'Scorching Left/Right': 'Linker/Rechter Höllenhieb',
        'Scorching Right': 'Rechter Höllenhieb',
        'Shadowbolt': 'Schattenramme',
        'Storm Of Color': 'Frühlingssturm',
        'Tribulation': 'Schwermütiges Zaudern',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Enslaved Love': 'amour asservi',
        'Leannan Sith': 'Leannan Sith',
        'Lugus': 'Lugus',
        'Seeker of Solitude': 'ermite du palais',
        'The Chamber of Celestial Song will be sealed off': 'The Chamber of Celestial Song will be sealed off', // FIXME
        'The Font of Quintessence will be sealed off': 'The Font of Quintessence will be sealed off', // FIXME
        'The Martial Court will be sealed off': 'The Martial Court will be sealed off', // FIXME
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        'Black Flame': 'Torrent fuligineux',
        'Captive Bolt': 'Lame pulvérisante',
        'Culling Blade': 'Lame percutante',
        'Dark Pulse': 'Déluge noir',
        'Dark Shock': 'Onde ténébreuse',
        'Dark Well': 'Déflagration ténébreuse',
        'Direct Seeding': 'Semis direct',
        'Far Wind': 'Claire tempête',
        'Fire\'s Domain': 'Fournaise infernale',
        'Fire\'s Ire': 'Étincelle infernale',
        'Gardener\'s Hymn': 'Ballade du bourgeonnement',
        'Immortal Anathema': 'Anathème immortel',
        'Ireful Wind': 'Ouragan violent',
        'Mortal Flame': 'Flamme mortelle',
        'Ode To Fallen Petals': 'Mélodie florale',
        'Ode To Far Winds': 'Aria de tempête',
        'Ode To Lost Love': 'Rhapsodie de l\'amour fou',
        'Otherworldly Heat': 'Croix de feu',
        'Plummet': 'Piqué',
        'Scorching Left/Right': 'Scorching Left/Right', // FIXME
        'Scorching Right': 'Scrutement dextre',
        'Shadowbolt': 'Éclair ombreux',
        'Storm Of Color': 'Orage de printemps',
        'Tribulation': 'Tribulation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Enslaved Love': 'エンスレイブド・ラヴ',
        'Leannan Sith': 'リャナンシー',
        'Lugus': 'ルゴス',
        'Seeker of Solitude': '宮殿の隠者',
        'The Chamber of Celestial Song will be sealed off': 'The Chamber of Celestial Song will be sealed off', // FIXME
        'The Font of Quintessence will be sealed off': 'The Font of Quintessence will be sealed off', // FIXME
        'The Martial Court will be sealed off': 'The Martial Court will be sealed off', // FIXME
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        'Black Flame': '黒炎流',
        'Captive Bolt': '破砕斬',
        'Culling Blade': '衝撃斬',
        'Dark Pulse': '黒の波動',
        'Dark Shock': '黒の衝撃',
        'Dark Well': '黒の爆砕',
        'Direct Seeding': 'ダイレクトシーディング',
        'Far Wind': '晴嵐',
        'Fire\'s Domain': '炎獄殺',
        'Fire\'s Ire': '炎獄閃',
        'Gardener\'s Hymn': '萌芽への謡',
        'Immortal Anathema': 'イモータルアナテーマ ',
        'Ireful Wind': '強風',
        'Mortal Flame': '必滅の炎',
        'Ode To Fallen Petals': '花嵐の歌声',
        'Ode To Far Winds': '晴嵐の歌声',
        'Ode To Lost Love': '狂愛の歌声',
        'Otherworldly Heat': '鬼炎斬',
        'Plummet': 'プラメット',
        'Scorching Left/Right': 'Scorching Left/Right', // FIXME
        'Scorching Right': '右辺炎獄斬',
        'Shadowbolt': 'シャドウボルト',
        'Storm Of Color': '春嵐',
        'Tribulation': 'トリビュレーション',
      },
    },
  ],
}];
