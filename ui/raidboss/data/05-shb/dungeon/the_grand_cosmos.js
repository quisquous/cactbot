'use strict';

// The Grand Cosmos

[{
  zoneRegex: {
    en: /^The Grand Cosmos$/,
    ko: /\(692\)/,
  },
  timelineFile: 'the_grand_cosmos.txt',
  triggers: [
    {
      id: 'Cosmos Shadowbolt',
      regex: Regexes.startsUsing({ id: '4769', source: 'Seeker Of Solitude' }),
      regexDe: Regexes.startsUsing({ id: '4769', source: 'Einsiedler' }),
      regexFr: Regexes.startsUsing({ id: '4769', source: 'Ermite Du Palais' }),
      regexJa: Regexes.startsUsing({ id: '4769', source: '宮殿の隠者' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 탱버',
          };
        }
      },
    },
    {
      id: 'Cosmos Dark Pulse',
      regex: Regexes.headMarker({ id: '003E' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            ja: '自分にシェア',
            fr: 'Package sur VOUS',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
          ko: '"' + data.ShortName(matches.target) + '" 쉐어징',
        };
      },
    },
    {
      id: 'Cosmos Dark Well Far Winds',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'Cosmos Immortal Anathema',
      regex: Regexes.startsUsing({ id: '49A3', source: 'Seeker Of Solitude', capture: false }),
      regexDe: Regexes.startsUsing({ id: '49A3', source: 'Einsiedler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '49A3', source: 'Ermite Du Palais', capture: false }),
      regexJa: Regexes.startsUsing({ id: '49A3', source: '宮殿の隠者', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'Cosmos Tribulation',
      regex: Regexes.startsUsing({ id: '476B', source: 'Seeker Of Solitude', capture: false }),
      regexDe: Regexes.startsUsing({ id: '476B', source: 'Einsiedler', capture: false }),
      regexFr: Regexes.startsUsing({ id: '476B', source: 'Ermite Du Palais', capture: false }),
      regexJa: Regexes.startsUsing({ id: '476B', source: '宮殿の隠者', capture: false }),
      delaySeconds: 8,
      alertText: {
        en: 'Avoid Brooms',
        de: 'Besen ausweichen',
        fr: 'Evitez les balais',
        ko: '빗자루 피하기',
      },
    },
    {
      id: 'Cosmos Storm of Color',
      regex: Regexes.startsUsing({ id: '471B', source: 'Leannan Sith' }),
      regexDe: Regexes.startsUsing({ id: '471B', source: 'Leanan Sidhe' }),
      regexFr: Regexes.startsUsing({ id: '471B', source: 'Leannan Sith' }),
      regexJa: Regexes.startsUsing({ id: '471B', source: 'リャナンシー' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 탱버',
          };
        }
      },
    },
    {
      id: 'Cosmos Ode To Lost Love',
      regex: Regexes.startsUsing({ id: '471C', source: 'Leannan Sith', capture: false }),
      regexDe: Regexes.startsUsing({ id: '471C', source: 'Leanan Sidhe', capture: false }),
      regexFr: Regexes.startsUsing({ id: '471C', source: 'Leannan Sith', capture: false }),
      regexJa: Regexes.startsUsing({ id: '471C', source: 'リャナンシー', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      // Can't use added combatant here as all these adds exist.
      // So, just trigger on first auto.
      id: 'Cosmos Direct Seeding Mistake',
      regex: Regexes.ability({ id: '368', source: 'Lover\'s Ring', capture: false }),
      regexDe: Regexes.ability({ id: '368', source: 'Keim Des Geliebten', capture: false }),
      regexFr: Regexes.ability({ id: '368', source: 'Bague De L\'Amoureux', capture: false }),
      regexJa: Regexes.ability({ id: '368', source: 'ラヴァーズリング', capture: false }),
      suppressSeconds: 60,
      infoText: {
        en: 'Kill Extra Add',
        de: 'Add angreifen',
        ja: '水の精倒して',
        fr: 'Tuez l\'add',
        cn: '击杀小怪',
        ko: '쫄 처리',
      },
    },
    {
      id: 'Cosmos Gardener\'s Hymn',
      regex: Regexes.startsUsing({ id: '471E', source: 'Leannan Sith', capture: false }),
      regexDe: Regexes.startsUsing({ id: '471E', source: 'Leanan Sidhe', capture: false }),
      regexFr: Regexes.startsUsing({ id: '471E', source: 'Leannan Sith', capture: false }),
      regexJa: Regexes.startsUsing({ id: '471E', source: 'リャナンシー', capture: false }),
      infoText: {
        en: 'put seeds on dirt',
        de: 'Samen auf den nicht bewachsenen Boden legen',
        fr: 'Placez les graines sur la terre',
        ko: '씨앗 흙 위에 놓기',
      },
    },
    {
      id: 'Cosmos Ronkan Cure II',
      regex: Regexes.startsUsing({ id: '4931', source: 'Ser Hamonth', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4931', source: 'Sir Hamonth', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4931', source: 'Sire Hamonth', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4931', source: '幻影騎士ハモンス', capture: false }),
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Hamonth',
        de: 'Sir Hamonth unterbrechen',
        fr: 'Etoudissez Hamonth',
        ko: 'Hamonth 기절시키기',
      },
    },
    {
      id: 'Cosmos Captive Bolt',
      regex: Regexes.startsUsing({ id: '4764', source: 'Lugus' }),
      regexDe: Regexes.startsUsing({ id: '4764', source: 'Lugus' }),
      regexFr: Regexes.startsUsing({ id: '4764', source: 'Lugus' }),
      regexJa: Regexes.startsUsing({ id: '4764', source: 'ルゴス' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            ja: data.ShortName(matches.target) + 'にタンクバスター',
            cn: '死刑 -> ' + data.ShortName(matches.target),
            ko: '"' + data.ShortName(matches.target) + '" 탱버',
          };
        }
      },
    },
    {
      id: 'Cosmos Culling Blade',
      regex: Regexes.startsUsing({ id: '4765', source: 'Lugus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4765', source: 'Lugus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4765', source: 'Lugus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4765', source: 'ルゴス', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        ja: 'AoE',
        fr: 'Dégâts de zone',
        cn: 'AOE',
        ko: '전체 공격',
      },
    },
    {
      id: 'Cosmos Black Flame 1',
      regex: Regexes.headMarker({ id: '0019' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'Cosmos Black Flame 2',
      regex: Regexes.headMarker({ id: '0019' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 4,
      infoText: {
        en: 'Dodge Crosses',
        de: 'Den Kreuzen ausweichen',
        fr: 'Evitez les croix',
        ko: '십자 장판 서로 산개',
      },
    },
    {
      id: 'Cosmos Mortal Flame 1',
      regex: Regexes.headMarker({ id: '00C3' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        ja: '散開',
        fr: 'Ecartez-vous',
        cn: '分散',
        ko: '산개',
      },
    },
    {
      id: 'Cosmos Mortal Flame 2',
      regex: Regexes.headMarker({ id: '00C3' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      delaySeconds: 5.5,
      infoText: {
        en: 'Touch Furniture',
        de: 'Einrichtung berühren',
        fr: 'Touchez un élément de décor',
        ko: '가구에 불 옮기기',
      },
    },
    {
      id: 'Cosmos Scorching Left',
      regex: Regexes.startsUsing({ id: '4763', source: 'Lugus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4763', source: 'Lugus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4763', source: 'Lugus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4763', source: 'ルゴス', capture: false }),
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        ko: '왼쪽',
      },
    },
    {
      id: 'Cosmos Scorching Right',
      regex: Regexes.startsUsing({ id: '4762', source: 'Lugus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4762', source: 'Lugus', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4762', source: 'Lugus', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4762', source: 'ルゴス', capture: false }),
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        ko: '오른쪽',
      },
    },
    {
      id: 'Cosmos Fire\'s Domain',
      regex: Regexes.headMarker({ id: '003[2345]' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      preRun: function(data) {
        data.firesDomain = (data.firesDomain || 0) + 1;
      },
      infoText: function(data) {
        if (data.firesDomain == 1) {
          return {
            en: 'Point Tether Away From Furniture',
            de: 'Verbindung weg von der Einrichtung zeigen',
            fr: 'Placez le liens loin des décors',
            ko: '십자 장판 징: 가구에 닿지 말기',
          };
        }
        return {
          en: 'Tether on YOU',
          de: 'Verbindung auf DIR',
          fr: 'Lien sur vous',
          ko: '징 대상자',
        };
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
        'The Chamber of Celestial Song': 'den Großen Vergnügungen',
        'The Font of Quintessence': 'Broderieparterre',
        'The Martial Court': 'Kleine Stufenarkade',
      },
      'replaceText': {
        'Black Flame': 'Finsterer Flammenwind',
        'Captive Bolt': 'Schmetterklinge',
        'Culling Blade': 'Schockschnitt',
        'Dark Pulse': 'Dunkle Welle',
        'Dark Shock': 'Angriff aus dem Dunkeln',
        'Dark Well': 'Dunkles Bersten',
        'Direct Seeding': 'Bedecktbesamung',
        '(?<! )Far Wind': 'Heller Sturm',
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
        'Enslaved Love': 'Amour Asservi',
        'Leannan Sith': 'Leannan Sith',
        'Lugus': 'Lugus',
        'Seeker of Solitude': 'Ermite du Palais',
        'The Martial Court': 'La Cour martiale',
        'The Font of Quintessence': 'La Source de Quintessence',
        'The Chamber of Celestial Song': 'Chœur céleste',
      },
      'replaceText': {
        'Black Flame': 'Torrent fuligineux',
        'Captive Bolt': 'Lame pulvérisante',
        'Culling Blade': 'Lame percutante',
        'Dark Pulse': 'Déluge noir',
        'Dark Shock': 'Onde ténébreuse',
        'Dark Well': 'Déflagration ténébreuse',
        'Direct Seeding': 'Semis direct',
        '(?<! )Far Wind': 'Claire tempête',
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
        'Scorching Left/Right': 'Scrutement Gauche/Droite', // FIXME
        'Scorching Right': 'Scrutement Gauche',
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
      },
      'replaceText': {
        'Black Flame': '黒炎流',
        'Captive Bolt': '破砕斬',
        'Culling Blade': '衝撃斬',
        'Dark Pulse': '黒の波動',
        'Dark Shock': '黒の衝撃',
        'Dark Well': '黒の爆砕',
        'Direct Seeding': 'ダイレクトシーディング',
        '(?<! )Far Wind': '晴嵐',
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
